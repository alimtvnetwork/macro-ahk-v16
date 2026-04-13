# Deep Audit — Why Auth Still Breaks After the "No-Retry" Refactor

**Created:** 2026-04-13  
**Status:** Review Required  
**Scope:** Diagram audit + spec audit + code audit  
**Related issue:** `spec/17-app-issues/88-auth-loading-failure-retry-inconsistency/00-overview.md`

---

## Files Audited

### Diagrams
- `standalone-scripts/macro-controller/diagrams/injection-pipeline-workflow.mmd`
- `standalone-scripts/macro-controller/diagrams/script-injection-pipeline.mmd`
- `standalone-scripts/macro-controller/diagrams/auth-bridge-waterfall.mmd`
- `standalone-scripts/macro-controller/diagrams/inconsistencies/auth-retry-inconsistencies.mmd`

### Spec / memory
- `spec/17-app-issues/88-auth-loading-failure-retry-inconsistency/00-overview.md`
- `.lovable/memory/constraints/no-retry-policy.md`
- `.lovable/memory/architecture/auth-bridge-service.md`

### Code
- `standalone-scripts/macro-controller/src/loop-cycle.ts`
- `standalone-scripts/macro-controller/src/credit-fetch.ts`
- `standalone-scripts/macro-controller/src/credit-balance.ts`
- `standalone-scripts/macro-controller/src/shared-state-runtime.ts`
- `standalone-scripts/macro-controller/src/auth.ts`

---

## Executive Summary

The auth failure is **not** mainly because retry was removed incorrectly.

The real problem is that the codebase is currently in a **half-migrated state**:

1. The architecture says **all token consumers must use `getBearerToken()`**.
2. The no-retry policy says **the cycle path must not recover/retry at all**.
3. But the implementation still contains **direct `resolveToken()` reads**, **direct `recoverAuthOnce()` calls**, and **a hidden second cycle attempt**.

So the system now has mixed rules:
- some paths use the new Auth Bridge,
- some paths still use old manual auth handling,
- some paths still perform recovery inside the cycle,
- and the diagrams do not fully match the current architecture.

That inconsistency is why auth behavior still feels unstable and "wrong".

---

## The Core Mistake

The intended architecture is:

```text
All token consumers -> getBearerToken() -> single recovery path inside Auth Bridge
```

But the actual implementation is still:

```text
loop-cycle.ts       -> resolveToken() + recoverAuthOnce()
credit-balance.ts   -> resolveToken() + recoverAuthOnce()
credit-fetch.ts     -> mixed: resolveToken() on preflight, getBearerToken() on recovery
```

This is the exact architectural break.

---

## Root Cause Analysis

### RCA-1: `loop-cycle.ts` still performs auth recovery inside the cycle path

This is the clearest violation.

#### Evidence
- `handleFallbackAuthRecovery()` in `loop-cycle.ts:121-146`
- `doCycleFetchWithToken()` in `loop-cycle.ts:215-250`

#### What it does now
- On `401/403`, the cycle calls `handleFallbackAuthRecovery(...)`
- that function calls `recoverAuthOnce()`
- then calls `doCycleFetchWithToken(true)` through the callback

#### Why this is wrong
Issue #88 explicitly says:
- cycle auth failure should **fail the current cycle**
- no retry/backoff in the cycle path
- no direct `recoverAuthOnce()` outside the Auth Bridge

#### Why it breaks auth behavior
This keeps a second auth path alive inside the cycle. So even after the refactor, the cycle is still trying to rescue itself instead of failing fast.

That means the code is still doing the very thing the fix was meant to remove.

---

### RCA-2: `loop-cycle.ts` still bypasses the Auth Bridge completely on initial token read

#### Evidence
- `loop-cycle.ts:24-25` imports `resolveToken` and `recoverAuthOnce`
- `loop-cycle.ts:216` reads `const freshToken = resolveToken()`
- `loop-cycle.ts:258-279` does manual token recovery in `doCycleFetchFallback()`

#### Why this is wrong
The Auth Bridge memory/spec says `getBearerToken(options?)` is the **single TTL-aware entry point**.

But `resolveToken()` is a raw synchronous read path. It does not enforce the same recovery contract as `getBearerToken()`.

#### Why it breaks auth behavior
This can start a cycle with a stale or missing token state, then force the cycle into manual recovery logic that should not exist anymore.

So the cycle is not only retrying — it is starting from the wrong token source contract.

---

### RCA-3: `credit-balance.ts` still uses direct `recoverAuthOnce()` instead of `getBearerToken({ force: true })`

#### Evidence
- `credit-balance.ts:16` imports `recoverAuthOnce`
- `credit-balance.ts:172` reads token via `resolveToken()`
- `credit-balance.ts:190-220` performs manual auth recovery + second request

#### Why this is wrong
Issue #88 says:
- credit-balance may do a sequential one-time recovery pattern
- but token recovery must be routed through `getBearerToken({ force: true })`
- and only `getBearerToken()` should own recovery behavior

#### Why it breaks auth behavior
This creates another independent recovery path that can race with:
- the loop cycle path
- the callback credit-fetch path
- the async credit-fetch path

Even if each path only retries once, they are still **multiple competing recovery paths**.

That is exactly the class of bug the no-retry fix was supposed to eliminate.

---

### RCA-4: `credit-fetch.ts` is internally inconsistent between callback and async flows

#### Evidence
- `fetchLoopCredits()` starts with `resolveToken()` at `credit-fetch.ts:204`
- `fetchLoopCreditsAsync()` resolves through `getBearerToken()` / `getBearerToken({ force: true })` at `credit-fetch.ts:283-292`

#### Why this is wrong
One codepath uses the new bridge contract.
The other still starts from the old raw token path.

So two APIs that are supposed to represent the same feature do not share the same auth semantics.

#### Why it breaks auth behavior
This makes failures intermittent and hard to reason about:
- async path may behave correctly
- callback path may use stale token state first
- recovery behavior differs depending on which function called the API

This is a migration inconsistency, not a true architecture.

---

### RCA-5: The diagrams are partly outdated and helped preserve the wrong mental model

#### Evidence

##### `auth-bridge-waterfall.mmd`
This diagram still shows a simplified flow:
- localStorage
- TTL check
- cookie fallback

But the current architecture/memory says the real flow is:
- localStorage fast path
- Auth Bridge recovery manager
- extension bridge path
- cookie fallback
- single-flight coordination

##### `injection-pipeline-workflow.mmd`
Stage `2c: seedTokensIntoTab` still describes manual token handling in prose:
- read storage token + timestamp
- if expired read cookie again
- write token into tab localStorage

That description does **not** reflect the rule that token consumers should delegate to `getBearerToken()` rather than re-implement token recovery semantics manually.

#### Why this matters
When diagrams are simpler than the actual architecture, they encourage engineers to rebuild the flow manually in feature code.

That appears to be what happened here.

---

### RCA-6: The no-retry refactor removed the obvious backoff system, but not the hidden recovery recursion in the cycle path

The old mistake was easy to see:
- `retryCount`
- `maxRetries`
- backoff delays
- `__cycleRetryPending`

Those were removed.

But one important behavior still survived in a smaller form:
- cycle request fails
- cycle calls recovery function
- recovery function calls the cycle fetch again

That is still a retry in behavior, even if it is no longer called "backoff".

So the refactor removed the **large retry system**, but not the **architectural retry shape**.

---

## Why Authentication Still Feels Broken

Auth still feels broken because the code now mixes **three different contracts**:

1. **Raw token read contract** — `resolveToken()`
2. **Direct recovery contract** — `recoverAuthOnce()`
3. **Unified bridge contract** — `getBearerToken()`

When one feature uses #3 and another still uses #1/#2, the system becomes unpredictable.

Typical symptoms from that mismatch:
- one feature works while another 401s
- one path recovers while another thinks auth is dead
- token state is invalidated in one place and re-read differently elsewhere
- docs say one thing, runtime behavior does another

This is a consistency failure, not just a single bug.

---

## Precise Inconsistencies Found

### Spec / memory says
- use `getBearerToken()` as the single auth entry point
- no retry in `loop-cycle.ts`
- no direct `recoverAuthOnce()` outside Auth Bridge

### Code still does
- `loop-cycle.ts` -> `resolveToken()` + `recoverAuthOnce()` + second fetch attempt
- `credit-balance.ts` -> `resolveToken()` + `recoverAuthOnce()`
- `credit-fetch.ts` -> mixed `resolveToken()` and `getBearerToken()` usage

### Diagram still suggests
- manual cookie-based refresh logic in the injection pipeline
- simplified cookie fallback model in the auth bridge diagram

---

## Conclusion

The failure came from **an incomplete migration**.

The project attempted to move to a unified Auth Bridge + no-retry architecture, but the implementation only removed the visible retry system. It did **not** fully remove the older manual auth/recovery paths.

So the current state is:
- the spec is right,
- the no-retry memory is right,
- but the code is still partly executing the old model.

That is the real reason the authentication flow still behaves incorrectly.

---

## Fix Direction For Review Only

**No code changes are proposed in this document.** This is analysis only.

When approved, the fix should do exactly this:

1. `loop-cycle.ts`
   - remove direct `recoverAuthOnce()` usage
   - remove cycle-path recovery callback flow
   - fail the cycle immediately on auth failure

2. `credit-balance.ts`
   - replace manual recovery with `getBearerToken({ force: true })`
   - keep only the sequential one-time recovery pattern allowed by Issue #88

3. `credit-fetch.ts`
   - start both callback and async flows from `getBearerToken()`
   - eliminate mixed `resolveToken()`/`getBearerToken()` semantics

4. diagrams
   - update auth bridge diagram to show the real recovery waterfall
   - update injection pipeline token stage so it references the Auth Bridge contract, not manual cookie logic

---

## Review Checklist

- [x] Verified the current spec already forbids retry/backoff in cycle path
- [x] Verified code still contains cycle-path recovery behavior
- [x] Verified code still contains direct `recoverAuthOnce()` outside Auth Bridge
- [x] Verified callback and async credit fetch flows do not use the same auth contract
- [x] Verified diagrams are not fully aligned with the current auth architecture
- [ ] Await review before code changes