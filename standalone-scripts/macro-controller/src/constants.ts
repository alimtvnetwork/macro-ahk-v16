/**
 * MacroLoop Controller — Centralized Constants
 *
 * Single source of truth for all hardcoded string/number constants used
 * across multiple files. Organized by category per the naming convention
 * in mem://architecture/constant-naming-convention
 *
 * NOTE: Config-derived constants (IDS, TIMING, CONFIG) remain in shared-state.ts
 * because they are resolved at runtime from __MARCO_CONFIG__.
 *
 * @see mem://architecture/constant-naming-convention
 */

/* ------------------------------------------------------------------ */
/*  DOM Element IDs (ID_*)                                             */
/* ------------------------------------------------------------------ */

// Panel / Core
export const ID_MARCO_PANEL_BACKDROP = 'marco-panel-backdrop';

// Workspace
export const ID_LOOP_WS_LIST = 'loop-ws-list';
export const ID_LOOP_WS_SELECTED = 'loop-ws-selected';

// Tools / Logging
export const ID_LOOP_LOG_COUNT = 'loop-log-count';

// Database Modal
export const ID_MARCO_DB_EMPTY = 'marco-db-empty';
export const ID_MARCO_JSON_BTN = 'marco-json-btn';
export const ID_MARCO_SCHEMA_LABEL = 'marco-schema-label';
export const ID_MARCO_SCHEMA_VAL_ROW = 'marco-schema-val-row';
export const ID_MARCO_SCHEMA_VAL_LABEL = 'marco-schema-val-label';
export const ID_MARCO_SCHEMA_SELECT = 'marco-schema-select';
export const ID_MARCO_SCHEMA_VAL_INPUT = 'marco-schema-val-input';
export const ID_MARCO_SCHEMA_FK_ROW = 'marco-schema-fk-row';

/* ------------------------------------------------------------------ */
/*  CSS Selectors (SEL_*)                                              */
/* ------------------------------------------------------------------ */

export const SEL_LOOP_WS_ITEM = '.loop-ws-item';

/* ------------------------------------------------------------------ */
/*  Data Attributes (ATTR_*)                                           */
/* ------------------------------------------------------------------ */

export const ATTR_DATA_ACTIVE = 'data-active';
export const ATTR_DATA_SKELETON = 'data-skeleton';
export const ATTR_SELECTED_ID = 'data-selected-id';
export const ATTR_WS_ID = 'data-ws-id';
export const ATTR_WS_NAME = 'data-ws-name';
export const ATTR_WS_CURRENT = 'data-ws-current';

/* ------------------------------------------------------------------ */
/*  LocalStorage Keys (LS_*)                                           */
/* ------------------------------------------------------------------ */

export const LS_PANEL_STATE = 'ml_panel_state';
export const LS_PANEL_GEOMETRY = 'ml_panel_geometry';
export const LS_BACKDROP_OPACITY = 'marco_backdrop_opacity';
export const LS_RENAME_HISTORY = 'ml_rename_history';
export const LS_LOG_MANAGER_CONFIG = 'marco_log_manager_config';
export const LOG_STORAGE_KEY = 'ahk_macroloop_logs';
export const LOG_MAX_ENTRIES = 500;

/* ------------------------------------------------------------------ */
/*  Workspace Keys                                                     */
/* ------------------------------------------------------------------ */

export const WS_HISTORY_KEY = 'ml_workspace_history';
export const WS_SHARED_KEY = 'ml_known_workspaces';
export const WS_HISTORY_MAX_ENTRIES = 50;

/* ------------------------------------------------------------------ */
/*  Cache Keys                                                         */
/* ------------------------------------------------------------------ */

export const WS_CACHE_PREFIX = 'marco_ws_cache_';
export const WS_LAST_PROJECT_KEY = 'marco_last_project_id';

/* ------------------------------------------------------------------ */
/*  Bloated Key Patterns (localStorage cleanup)                        */
/* ------------------------------------------------------------------ */

export const BLOATED_KEY_PATTERNS = ['console-history', 'previously-viewed-files', 'ai-code-completion'];

/* ------------------------------------------------------------------ */
/*  Style Element IDs (STYLE_*)                                        */
/* ------------------------------------------------------------------ */

export const STYLE_ID_DB_JSON = 'marco-db-json-styles';
export const STYLE_ID_DB_SCHEMA = 'marco-db-schema-styles';
export const STYLE_ID_DB_MODAL = 'marco-database-styles';

/* ------------------------------------------------------------------ */
/*  Timing Constants (numeric)                                         */
/* ------------------------------------------------------------------ */

export const BRIDGE_TIMEOUT_MS = 5000;

// Rename
export const RENAME_DEFAULT_DELAY_MS = 750;
export const RENAME_MIN_DELAY_MS = 100;
export const RENAME_MAX_DELAY_MS = 10000;
export const RENAME_OP_WINDOW = 5;
export const RENAME_HISTORY_MAX = 20;
export const RENAME_MAX_CONSECUTIVE_FAILURES = 3;

// Panel layout
export const PANEL_EDGE_MARGIN = 8;
export const PANEL_MIN_VISIBLE_HEIGHT = 220;
export const PANEL_MIN_VISIBLE_WIDTH = 360;
export const DEFAULT_BACKDROP_OPACITY = 0;

// Database
export const DB_PAGE_SIZE = 25;

/* ------------------------------------------------------------------ */
/*  CSS Fragment Constants (CSS_*)                                      */
/* ------------------------------------------------------------------ */

// Shared across: log-activity-ui, js-executor, credit-api
export const CSS_SPAN_STYLE_COLOR = '<span style="color:';
// credit-api (alias — same value as CSS_SPAN_STYLE_COLOR)
export const CSS_SPAN_COLOR = CSS_SPAN_STYLE_COLOR;
// credit-api
export const CSS_BAR_SEGMENT_TAIL = '%;height:100%;background:linear-gradient(90deg,';
export const CSS_TRANSITION_TAIL = ');transition:width ';
export const CSS_EASE_CLOSE = ' ease;"></div>';
export const CSS_STYLE_WIDTH = '" style="width:';
// panel-controls, settings-ui
export const CSS_BACKGROUND = 'background:';
// hot-reload-section, panel-header
export const CSS_FONT_SIZE = 'font-size:';
// auth-diag-waterfall, tools-sections-builder
export const CSS_FONT_SIZE_9PX_COLOR = 'font-size:9px;color:';
// settings-tab-panels
export const CSS_FONT_SIZE_11PX_FONT_WEIGHT_700_COLOR = 'font-size:11px;font-weight:700;color:';
// bulk-rename-fields, tools-sections-builder
export const CSS_BORDER_RADIUS_3PX_BACKGROUND = ';border-radius:3px;background:';
// panel-controls
export const CSS_BORDER_1PX_SOLID_RGBA_255_255_255_0_08 = ';border:1px solid rgba(255,255,255,0.08);';
// hot-reload-section
export const CSS_PADDING_2PX_0 = ';padding:2px 0;';
// prompt-injection
export const CSS_BORDER_PRIMARY = 'rgba(124,58,237,0.3)';
export const CSS_BORDER_PRIMARY_STRONG = 'rgba(124,58,237,0.4)';
export const CSS_BORDER_SOLID = ';border:1px solid ';
export const CSS_LABEL_BLOCK = 'display:block;font-size:11px;color:';
export const CSS_LABEL_SUFFIX = ';margin-bottom:4px;font-weight:600;';
export const CSS_BORDER_RADIUS_COLOR = ';border-radius:6px;color:';
// save-prompt-task-next
export const CSS_RGBA_124_58_237_0_15 = 'rgba(124,58,237,0.15)';
// tools-sections-builder
export const CSS_WIDTH_100_PADDING_3PX_5PX_BORDER_1PX_SOL = 'width:100%;padding:3px 5px;border:1px solid ';
export const CSS_BRIGHTNESS_1_3 = 'brightness(1.3)';

/* ------------------------------------------------------------------ */
/*  DOM Element IDs — additional                                       */
/* ------------------------------------------------------------------ */

export const ID_MARCO_ERROR_OVERLAY = 'marco-error-overlay';

/* ------------------------------------------------------------------ */
/*  LocalStorage Keys — additional                                     */
/* ------------------------------------------------------------------ */

export const LS_TOKEN_SAVED_AT = 'marco_token_saved_at';
export const LS_RENAME_PRESET_PREFIX = 'MacroController.RenamePresets.';

/* ------------------------------------------------------------------ */
/*  IndexedDB Constants (prompt cache)                                 */
/* ------------------------------------------------------------------ */

export const DB_PROMPTS_CACHE_NAME = 'marco_prompts_cache';
export const DB_PROMPTS_CACHE_VERSION = 3;
export const DB_PROMPTS_STORE = 'prompts';
export const DB_PROMPTS_UI_STORE = 'ui_snapshots';
export const DB_PROMPTS_JSON_COPY_KEY = 'json_copy';
export const DB_PROMPTS_HTML_COPY_KEY = 'html_copy';
export const DB_PROMPTS_UI_CACHE_KEY = 'dropdown_snapshot';

/* ------------------------------------------------------------------ */
/*  API Path Constants (API_*)                                         */
/* ------------------------------------------------------------------ */

export const API_USER_WORKSPACES = '/user/workspaces';
export const API_USER_WORKSPACES_SLASH = '/user/workspaces/';

/* ------------------------------------------------------------------ */
/*  Timing / Limit Constants — additional                              */
/* ------------------------------------------------------------------ */

export const DEFAULT_TOKEN_TTL_MS = 120_000;
export const MIN_CREDIT_CALL_GAP_MS = 10_000;
export const MAX_OVERLAY_ERRORS = 30;
export const MAX_SDK_ATTEMPTS = 3;
export const SDK_RETRY_DELAY_MS = 500;
export const MAX_UI_CREATE_RETRIES = 10;

/* ------------------------------------------------------------------ */
/*  Default Values — additional                                        */
/* ------------------------------------------------------------------ */

export const DEFAULT_PRESET_NAME = 'Default';
export const DEFAULT_PASTE_XPATH = '/html/body/div[3]/div/div[2]/main/div/div/div[1]/div/div[2]/div/form/div[3]/div/div/div/div';
export const SAVE_PROMPT_XPATH = '/html/body/div[3]/div/div[2]/main/div/div/div[1]/div/div[2]/div/form/div[2]/div';

/* ------------------------------------------------------------------ */
/*  Startup Label Constants                                            */
/* ------------------------------------------------------------------ */

export const LABEL_PROMPT_PREWARM = 'prompt-prewarm';
export const LABEL_WS_PREFETCH = 'ws-prefetch';
export const LABEL_STARTUP_RETRY = 'Startup: Retry #';
export const LABEL_AUTH_AUTO_RESYNC = 'Auth auto-resync (';
export const LABEL_LOG_MACROLOOP_V = '[MacroLoop v';

/* ------------------------------------------------------------------ */
/*  Log / Label Prefix Constants                                       */
/* ------------------------------------------------------------------ */

export const LABEL_EXTENSION_BRIDGE = 'Extension bridge ';
export const LABEL_DOMAIN_GUARD = 'domain-guard';
export const LABEL_SOURCE_EXTENSION = 'marco-extension';
export const LABEL_NEXT_TASKS = 'next-tasks';
export const LABEL_LOG_SESSIONCHECK = '[SessionCheck/';
export const LABEL_LOG_XPATHUTILS = '[XPathUtils.';
export const LABEL_KEEPING_EXISTING_WS = ': Keeping existing workspace: ';
export const LABEL_IGNORING_API_SET = '" — ignoring, API already set: ';

/* ------------------------------------------------------------------ */
/*  DOM Element IDs — Phase 3                                          */
/* ------------------------------------------------------------------ */

export const ID_STARTUP_TOAST = 'mcl-startup-toast';
export const ID_DATABASE_MODAL = 'macroloop-database-modal';
export const ID_TOAST_CONTAINER = 'marco-toast-container';
export const ID_TOAST_STACK = 'marco-toast-stack';

/* ------------------------------------------------------------------ */
/*  Config Validator Schema Versions                                   */
/* ------------------------------------------------------------------ */

export const SUPPORTED_CONFIG_SCHEMA = 1;
export const SUPPORTED_THEME_SCHEMA = 2;

/* ------------------------------------------------------------------ */
/*  Timing / Limit Constants — Phase 3                                 */
/* ------------------------------------------------------------------ */

export const COOKIE_DIAGNOSTIC_COOLDOWN_MS = 60_000;
export const LOG_FLUSH_INTERVAL_MS = 1000;
export const CREDIT_CACHE_TTL_S = 30;
export const RETRY_MAX_RETRIES = 3;
export const RETRY_BACKOFF_MS = 2000;
export const TOAST_AUTO_DISMISS_MS = 10_000;
export const TOAST_FADE_DURATION_MS = 300;
export const TOKEN_POLL_INTERVAL_MS = 250;
export const TOKEN_REFRESH_RETRY_MS = 1500;
export const STARTUP_WS_MAX_RETRIES = 2;
export const RECENT_ERRORS_MAX = 50;
export const TOAST_QUEUE_MAX = 20;
export const TOAST_QUEUE_POLL_MS = 250;
export const TOAST_QUEUE_TTL_MS = 30_000;
export const WORKSPACE_OBSERVER_MAX_RETRIES = 10;
export const REINJECT_COOLDOWN_MS = 5000;
export const LOOP_JS_HISTORY_MAX = 20;
export const TOAST_MAX_STACK = 3;
export const MAX_ACTIVITY_LINES = 100;

/* ------------------------------------------------------------------ */
/*  API / URL Constants                                                */
/* ------------------------------------------------------------------ */

export const CREDIT_API_BASE = 'https://api.lovable.dev';

/* ------------------------------------------------------------------ */
/*  Storage Keys — Phase 3                                             */
/* ------------------------------------------------------------------ */

export const LS_REINJECT_PREFIX = '__marco_reinject_';
export const GKV_FORBIDDEN_GROUP = 'rename_forbidden';
export const FORCED_THEME_KEY = 'dark';

/* ------------------------------------------------------------------ */
/*  Panel Defaults                                                     */
/* ------------------------------------------------------------------ */

export const PANEL_DEFAULT_WIDTH = 494;
export const PANEL_DEFAULT_HEIGHT = 517;
export const FILE_NAME = 'macro-looping.js';

/* ------------------------------------------------------------------ */
/*  CSS Fragment Constants — Phase 3                                   */
/* ------------------------------------------------------------------ */

export const CSS_ROW_DIAG = 'display:flex;align-items:center;gap:6px;padding:2px 4px;background:rgba(0,0,0,.2);border-radius:3px;';

/* ------------------------------------------------------------------ */
/*  Date Constants                                                     */
/* ------------------------------------------------------------------ */

export const DATE_CHANGELOG_2026_03_21 = '2026-03-21';

/* ------------------------------------------------------------------ */
/*  Auth Constants (arrays)                                            */
/* ------------------------------------------------------------------ */

export const SESSION_BRIDGE_KEYS = [
  'marco_bearer_token',
  'lovable-session-id',
  'lovable-session-id-v2',
  'lovable-session-id.id',
  'ahk_bearer_token',
];

export const FALLBACK_SESSION_COOKIE_NAMES = [
  'lovable-session-id-v2',
  'lovable-session-id.id',
  '__Secure-lovable-session-id.id',
  '__Host-lovable-session-id.id',
  'lovable-session-id',
];

/* ------------------------------------------------------------------ */
/*  Shared String Constants                                            */
/* ------------------------------------------------------------------ */

export const MACRO_CONTROLLER_NS = 'macro-controller';
export const SECTION_DIVIDER = '// ============================================\n';
