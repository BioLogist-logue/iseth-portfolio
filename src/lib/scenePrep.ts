/**
 * Scene-preparation status, failure classification, development logging and
 * (development-only) fault injection for verifying the recovery path.
 */

export type PrepStatus = "idle" | "loading" | "ready" | "failed";

export type PrepFailureReason =
  /** Preparation didn't finish within the timeout. */
  | "timeout"
  /** The floor's scene code could not be fetched (network / chunk error). */
  | "load-error"
  /** The scene threw while rendering. */
  | "render-error"
  /** Texture upload / shader compilation failed. */
  | "gpu-error";

export interface PrepFailure {
  floorId: string;
  reason: PrepFailureReason;
  message: string;
  attempt: number;
  at: number;
}

export interface PrepState {
  floorId: string | null;
  status: PrepStatus;
  failure: PrepFailure | null;
  /** Bumped on Retry: remounts the floor scene and resets its error boundary. */
  attempt: number;
  /** Unique per preparation (every swap or retry). */
  token: number;
}

export const PREP_TIMEOUT_MS = 10000;

const dev = process.env.NODE_ENV !== "production";

interface PrepLogEntry {
  t: number;
  event: string;
  floorId: string;
  detail?: unknown;
}
const log: PrepLogEntry[] = [];

/** Development-only diagnostics. Entries are kept in `window.__towerPrepLog`. */
export function logPrep(event: string, floorId: string, detail?: unknown) {
  if (!dev || typeof window === "undefined") return;
  log.push({ t: Math.round(performance.now()), event, floorId, detail });
  if (log.length > 100) log.shift();
  (window as unknown as { __towerPrepLog: PrepLogEntry[] }).__towerPrepLog = log;
  const fn = event === "failed" ? console.warn : console.info;
  fn(`[tower:prep] ${event} ${floorId}`, detail ?? "");
}

export function classifyError(err: unknown): PrepFailureReason {
  const msg = String((err as Error)?.message ?? err);
  if (/chunk|dynamically imported module|Loading CSS chunk|Failed to fetch|import\(\)/i.test(msg)) return "load-error";
  return "render-error";
}

export const failureCopy: Record<PrepFailureReason, string> = {
  timeout: "공간을 준비하는 데 시간이 너무 오래 걸리고 있어요.",
  "load-error": "네트워크 문제로 이 층의 공간을 불러오지 못했어요.",
  "render-error": "이 층을 그리는 중에 문제가 생겼어요.",
  "gpu-error": "그래픽 자원을 준비하는 중에 문제가 생겼어요.",
};

// ── Development-only fault injection ─────────────────────────────────────
// In the browser console:
//   __towerFail = { floorId: "4f", mode: "throw" | "reject" | "hang", times: 1 }
// "throw" = render error, "reject" = GPU-prep error, "hang" = never finishes (timeout).
export type FaultMode = "throw" | "reject" | "hang";
interface FaultSpec {
  floorId?: string;
  mode: FaultMode;
  times?: number;
}

const decided = new Map<string, FaultMode | null>();

/**
 * Decide (once per floor+attempt key, so React StrictMode double renders stay
 * idempotent) whether to inject a fault for this preparation attempt.
 */
export function injectedFault(key: string, floorId: string, accept: FaultMode[]): FaultMode | null {
  if (!dev || typeof window === "undefined") return null;
  if (decided.has(key)) {
    const d = decided.get(key)!;
    return d && accept.includes(d) ? d : null;
  }
  const w = window as unknown as { __towerFail?: FaultSpec | null };
  const spec = w.__towerFail;
  let mode: FaultMode | null = null;
  if (spec && (!spec.floorId || spec.floorId === floorId)) {
    mode = spec.mode;
    const left = (spec.times ?? 1) - 1;
    w.__towerFail = left > 0 ? { ...spec, times: left } : null;
    logPrep("fault-injected", floorId, { mode, key });
  }
  decided.set(key, mode);
  return mode && accept.includes(mode) ? mode : null;
}
