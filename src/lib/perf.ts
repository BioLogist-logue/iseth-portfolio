/**
 * Lightweight floor-transition profiler.
 *
 * Marks are written with the User Timing API (visible in the browser
 * DevTools Performance panel as `tower:*`). Completed transitions are kept in
 * `window.__towerPerf` and logged in development, or in production with
 * `?perf` in the URL.
 *
 * Phases:
 *   start       button pressed / navigation requested
 *   swap        doors shut, destination scene mounted behind them
 *   mounted     destination scene committed (React tree ready)
 *   prepared    shaders compiled + textures uploaded (GPU ready)
 *   firstFrame  first frame rendered after preparation
 *   doorsOpen   doors begin to open
 *   arrived     doors fully open
 */

export type PerfPhase = "start" | "swap" | "mounted" | "prepared" | "firstFrame" | "doorsOpen" | "arrived";

export interface TransitionRecord {
  from: string;
  to: string;
  /** ms since `start` for each phase reached. */
  phases: Partial<Record<PerfPhase, number>>;
  total: number;
  /** Longest frame (ms) observed while the doors opened and the camera moved out. */
  worstFrameAfterOpen: number;
  /** Frames over 50 ms during the same window. */
  longFramesAfterOpen: number;
  /** Every frame over 50 ms during the whole transition: [ms since start, duration]. */
  longFrames: [at: number, ms: number][];
  /** Set when the destination failed to prepare (doors were kept shut). */
  failed?: string;
}

interface Active {
  from: string;
  to: string;
  t0: number;
  phases: Partial<Record<PerfPhase, number>>;
  sampling: boolean;
  sampleUntil: number;
  worst: number;
  long: number;
  longAt: [number, number][];
}

let active: Active | null = null;
const history: TransitionRecord[] = [];

const verbose = () =>
  typeof window !== "undefined" && (process.env.NODE_ENV !== "production" || window.location.search.includes("perf"));

function userMark(name: string) {
  try {
    performance.mark(`tower:${name}`);
  } catch {}
}

export const transitionPerf = {
  begin(from: string, to: string) {
    active = { from, to, t0: performance.now(), phases: { start: 0 }, sampling: false, sampleUntil: 0, worst: 0, long: 0, longAt: [] };
    userMark(`start:${from}->${to}`);
  },

  mark(phase: PerfPhase) {
    if (!active || active.phases[phase] !== undefined) return;
    active.phases[phase] = Math.round(performance.now() - active.t0);
    userMark(phase);
    if (phase === "doorsOpen") {
      // Watch frame times while the reveal happens.
      active.sampling = true;
      active.sampleUntil = performance.now() + 2500;
    }
  },

  /** Called every rendered frame with the frame delta in ms. */
  frame(dtMs: number) {
    const a = active;
    if (!a) return;
    if (a.phases.prepared !== undefined && a.phases.firstFrame === undefined) this.mark("firstFrame");
    // Long frames anywhere in the transition (helps locate hitches).
    if (dtMs > 50) a.longAt.push([Math.round(performance.now() - a.t0), Math.round(dtMs)]);
    if (!a.sampling) return;
    if (performance.now() > a.sampleUntil) {
      a.sampling = false;
      this.finish();
      return;
    }
    a.worst = Math.max(a.worst, dtMs);
    if (dtMs > 50) a.long++;
  },

  /** Close the current record as failed (destination never became ready). */
  fail(reason: string) {
    if (!active) return;
    this.finish(reason);
  },

  finish(failed?: string) {
    const a = active;
    if (!a) return;
    active = null;
    const rec: TransitionRecord = {
      from: a.from,
      to: a.to,
      phases: a.phases,
      total: a.phases.arrived ?? Math.round(performance.now() - a.t0),
      worstFrameAfterOpen: Math.round(a.worst),
      longFramesAfterOpen: a.long,
      longFrames: a.longAt,
      ...(failed ? { failed } : {}),
    };
    try {
      performance.measure(`tower:transition ${a.from}->${a.to}`, { start: a.t0, duration: rec.total });
    } catch {}
    history.push(rec);
    if (history.length > 20) history.shift();
    if (typeof window !== "undefined") (window as unknown as { __towerPerf: TransitionRecord[] }).__towerPerf = history;
    if (verbose()) {
      (failed ? console.warn : console.info)(
        `[tower] ${rec.from} → ${rec.to}${failed ? ` FAILED (${failed})` : ""}: ${rec.total} ms total · worst frame after open ${rec.worstFrameAfterOpen} ms (${rec.longFramesAfterOpen} long)`,
        rec.phases,
      );
    }
  },

  history: () => history,
};
