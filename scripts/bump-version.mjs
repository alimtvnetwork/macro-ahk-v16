#!/usr/bin/env node
/**
 * bump-version.mjs — Single source-of-truth version bump
 *
 * Usage:
 *   node scripts/bump-version.mjs <new-version>
 *   node scripts/bump-version.mjs patch|minor|major
 *
 * Updates ALL version files in one shot:
 *   - chrome-extension/manifest.json  (version + version_name)
 *   - src/shared/constants.ts         (EXTENSION_VERSION)
 *   - standalone-scripts/macro-controller/src/shared-state.ts (VERSION)
 *   - standalone-scripts/macro-controller/src/instruction.ts  (version)
 *   - standalone-scripts/macro-controller/dist/instruction.json (version)
 *   - standalone-scripts/marco-sdk/src/instruction.ts          (version)
 *   - standalone-scripts/marco-sdk/dist/instruction.json       (version)
 *   - standalone-scripts/xpath/src/instruction.ts              (version)
 *   - standalone-scripts/xpath/dist/instruction.json           (version)
 *
 * After running, check-version-sync.mjs will pass.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/* ── Parse current version from manifest ─────────────────────── */
function getCurrentVersion() {
  const manifest = JSON.parse(
    readFileSync(resolve(ROOT, "chrome-extension/manifest.json"), "utf-8"),
  );
  return manifest.version;
}

/* ── Resolve target version ──────────────────────────────────── */
function resolveVersion(input) {
  const current = getCurrentVersion();
  const parts = current.split(".").map(Number);

  if (/^\d+\.\d+\.\d+$/.test(input)) return input;

  switch (input) {
    case "patch":
      parts[2]++;
      return parts.join(".");
    case "minor":
      parts[1]++;
      parts[2] = 0;
      return parts.join(".");
    case "major":
      parts[0]++;
      parts[1] = 0;
      parts[2] = 0;
      return parts.join(".");
    default:
      console.error(`Usage: node scripts/bump-version.mjs <version|patch|minor|major>`);
      console.error(`  Current version: ${current}`);
      process.exit(1);
  }
}

/* ── Replacement targets ─────────────────────────────────────── */
function getTargets(ver) {
  return [
    {
      path: "chrome-extension/manifest.json",
      replacements: [
        { pattern: /("version"\s*:\s*")[\d.]+(")/,         replacement: `$1${ver}$2` },
        { pattern: /("version_name"\s*:\s*")[\d.]+(")/,    replacement: `$1${ver}$2` },
      ],
    },
    {
      path: "src/shared/constants.ts",
      replacements: [
        { pattern: /(EXTENSION_VERSION\s*=\s*")[\d.]+(")/,  replacement: `$1${ver}$2` },
      ],
    },
    {
      path: "standalone-scripts/macro-controller/src/shared-state.ts",
      replacements: [
        { pattern: /(VERSION\s*=\s*['"])[\d.]+(["'])/,      replacement: `$1${ver}$2` },
      ],
    },
    {
      path: "standalone-scripts/macro-controller/src/instruction.ts",
      replacements: [
        { pattern: /(version:\s*")[\d.]+(")/,               replacement: `$1${ver}$2` },
      ],
    },
    {
      path: "standalone-scripts/macro-controller/dist/instruction.json",
      optional: true,
      replacements: [
        { pattern: /("version"\s*:\s*")[\d.]+(")/,          replacement: `$1${ver}$2` },
      ],
    },
    {
      path: "standalone-scripts/marco-sdk/src/instruction.ts",
      replacements: [
        { pattern: /(version:\s*")[\d.]+(")/,               replacement: `$1${ver}$2` },
      ],
    },
    {
      path: "standalone-scripts/marco-sdk/dist/instruction.json",
      optional: true,
      replacements: [
        { pattern: /("version"\s*:\s*")[\d.]+(")/,          replacement: `$1${ver}$2` },
      ],
    },
    {
      path: "standalone-scripts/xpath/src/instruction.ts",
      replacements: [
        { pattern: /(version:\s*")[\d.]+(")/,               replacement: `$1${ver}$2` },
      ],
    },
    {
      path: "standalone-scripts/xpath/dist/instruction.json",
      optional: true,
      replacements: [
        { pattern: /("version"\s*:\s*")[\d.]+(")/,          replacement: `$1${ver}$2` },
      ],
    },
  ];
}

/* ── Main ────────────────────────────────────────────────────── */
const input = process.argv[2];
if (!input) {
  console.error(`Usage: node scripts/bump-version.mjs <version|patch|minor|major>`);
  console.error(`  Current version: ${getCurrentVersion()}`);
  process.exit(1);
}

const oldVer = getCurrentVersion();
const newVer = resolveVersion(input);

console.log(`Bumping version: ${oldVer} -> ${newVer}\n`);

let updated = 0;
let skipped = 0;

for (const target of getTargets(newVer)) {
  const fullPath = resolve(ROOT, target.path);

  if (!existsSync(fullPath)) {
    if (target.optional) {
      console.log(`  [SKIP] ${target.path} (not found — optional)`);
      skipped++;
      continue;
    }
    console.error(`  [FAIL] ${target.path} — required file not found`);
    process.exit(1);
  }

  let content = readFileSync(fullPath, "utf-8");
  let changed = false;

  for (const { pattern, replacement } of target.replacements) {
    const before = content;
    content = content.replace(pattern, replacement);
    if (content !== before) changed = true;
  }

  if (changed) {
    writeFileSync(fullPath, content, "utf-8");
    console.log(`  [OK]   ${target.path}`);
    updated++;
  } else {
    console.log(`  [--]   ${target.path} (already at ${newVer})`);
  }
}

console.log(`\nDone: ${updated} file(s) updated, ${skipped} skipped.`);
console.log(`Run: node scripts/check-version-sync.mjs`);