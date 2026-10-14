"use client";

import { create } from "zustand";
import {
  floorsBetween,
  getFloor,
  getItem,
  getZone,
  lobby,
  locateItem,
  travelDuration,
} from "@/lib/building";
import {
  approachPose,
  cabPose,
  cameraFov,
  doorwayPose,
  elevatorApproachPose,
  exteriorPose,
  hallPose,
  overviewPose,
  zonePose,
  type Pose,
  type ViewCtx,
} from "@/lib/layout";
import { playClick, playDing, playDoor, setSoundEnabled, startHum, stopHum, unlockAudio } from "@/lib/audio";
import { preloadFloorScene } from "@/components/scene/interior/floorScenes";
import { transitionPerf } from "@/lib/perf";
import { PREP_TIMEOUT_MS, logPrep, type PrepFailureReason, type PrepState } from "@/lib/scenePrep";

export type View = "exterior" | "approach" | "interior";
export type Sub = "hall" | "overview" | "zone" | "elevator";
/** "stalled": arrived, doors held shut because the floor failed to prepare. */
export type ElevatorPhase = "idle" | "closing" | "moving" | "opening" | "stalled";
export type Theme = "light" | "dark";
export type Panel =
  | { kind: "item"; id: string }
  | { kind: "about" }
  | { kind: "featured" }
  | { kind: "updates" }
  | null;

export interface CameraCommand {
  pose: Pose;
  duration: number;
  /** Extra height at the midpoint of the move, for gentle crane shots. */
  arc: number;
  id: number;
}

interface TowerState {
  view: View;
  sub: Sub;
  floorId: string;
  zoneId: string | null;
  panel: Panel;
  hoveredItemId: string | null;

  camera: CameraCommand;
  doorsOpen: boolean;
  elevator: {
    phase: ElevatorPhase;
    displayFloorId: string;
    direction: 1 | -1 | 0;
    pressed: string | null;
  };
  busy: boolean;
  fade: boolean;

  theme: Theme;
  themeManual: boolean;
  sound: boolean;
  reducedMotion: boolean;
  mobile: boolean;
  aspect: number;

  searchOpen: boolean;
  directoryOpen: boolean;
  readyFloors: Record<string, boolean>;
  /** Floor whose scene is currently mounted (React tree committed). */
  mountedFloorId: string | null;
  /** Increments on every scene mount, so a remount of the same floor is detectable. */
  mountSeq: number;
  /** Preparation status of the current floor's scene (loading / ready / failed). */
  prep: PrepState;
  prepTimeoutMs: number;
  /**
   * Set when a floor failed to prepare and the visitor is held safely:
   * "elevator" = doors kept shut in the cab, "entrance" = behind the entry fade.
   */
  stalled: null | "elevator" | "entrance";
}

interface TowerActions {
  setViewport: (aspect: number, mobile: boolean) => void;
  setTheme: (t: Theme, manual?: boolean) => void;
  toggleSound: () => void;
  setReducedMotion: (r: boolean) => void;
  setHovered: (id: string | null) => void;
  setSearchOpen: (o: boolean) => void;
  setDirectoryOpen: (o: boolean) => void;
  markReady: (floorId: string) => void;
  markPrepared: (floorId: string) => void;
  markPrepFailed: (floorId: string, reason: PrepFailureReason, message: string) => void;
  /** Retry preparing the current floor after a failure. */
  retryScene: () => Promise<void>;
  /** Leave a failed floor: ride to the lobby, or step outside if the lobby itself failed. */
  leaveFailedScene: () => Promise<void>;

  focusBuilding: () => void;
  backToExterior: () => void;
  enterBuilding: () => Promise<void>;
  exitBuilding: () => Promise<void>;
  goHall: () => void;
  goOverview: () => void;
  goZone: (zoneId: string) => void;
  enterElevator: () => Promise<void>;
  exitElevator: () => Promise<void>;
  rideTo: (floorId: string) => Promise<void>;
  navigate: (to: { floorId: string; zoneId?: string; itemId?: string }) => Promise<void>;
  openItem: (id: string) => void;
  openPanel: (p: Panel) => void;
  closePanel: () => void;
  reframe: () => void;
}

export type TowerStore = TowerState & TowerActions;

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
let camId = 0;

export const useTower = create<TowerStore>((set, get) => {
  const ctx = (): ViewCtx => {
    const a = get().aspect;
    return { aspect: a, fov: cameraFov(a) };
  };
  /** Scale animation time for reduced motion. */
  const t = (sec: number) => (get().reducedMotion ? Math.min(sec * 0.3, 0.35) : sec);

  const move = (pose: Pose, sec: number, arc = 0) => {
    const d = t(sec);
    set({ camera: { pose, duration: d, arc: get().reducedMotion ? 0 : arc, id: ++camId } });
    return sleep(d * 1000);
  };
  const cut = (pose: Pose) => set({ camera: { pose, duration: 0, arc: 0, id: ++camId } });

  const doors = async (open: boolean) => {
    if (get().doorsOpen === open) return;
    const d = t(open ? 0.85 : 0.75);
    set({ doorsOpen: open });
    playDoor(open ? "open" : "close", Math.max(d, 0.3));
    await sleep(d * 1000);
  };

  const withBusy = async (fn: () => Promise<void>) => {
    if (get().busy) return;
    set({ busy: true });
    try {
      await fn();
    } finally {
      set({ busy: false });
    }
  };

  const beginPrep = (floorId: string, bumpAttempt = false) => {
    const prev = get().prep;
    const attempt = bumpAttempt ? prev.attempt + 1 : prev.attempt;
    set({ prep: { floorId, status: "loading", failure: null, attempt, token: prev.token + 1 }, mountedFloorId: null });
    logPrep(bumpAttempt ? "retry" : "begin", floorId, { attempt });
  };

  /**
   * Wait until the floor is mounted *and* GPU-prepared. Resolves "ready" or
   * "failed"; a timeout is recorded as a failure, never a silent success.
   */
  const waitPrepared = async (floorId: string): Promise<"ready" | "failed"> => {
    const start = performance.now();
    for (;;) {
      const p = get().prep;
      if (p.floorId === floorId && p.status === "ready") return "ready";
      if (p.floorId === floorId && p.status === "failed") return "failed";
      if (performance.now() - start > get().prepTimeoutMs) {
        get().markPrepFailed(floorId, "timeout", `Not ready after ${get().prepTimeoutMs} ms`);
        return "failed";
      }
      await sleep(30);
    }
  };

  /** Hold the visitor safely after a failure (doors shut / entry fade kept). */
  const stall = (context: "elevator" | "entrance") => {
    stopHum(0.2);
    transitionPerf.fail(get().prep.failure?.reason ?? "unknown");
    if (context === "elevator")
      set((st) => ({ stalled: "elevator", elevator: { ...st.elevator, phase: "stalled", direction: 0, pressed: null } }));
    else set({ stalled: "entrance" });
  };

  /** Doors open onto a prepared floor and the visitor steps out. */
  const arrive = async () => {
    stopHum(0.25);
    playDing();
    set((st) => ({ stalled: null, elevator: { ...st.elevator, phase: "opening", direction: 0 } }));
    transitionPerf.mark("doorsOpen");
    await doors(true);
    transitionPerf.mark("arrived");
    set((st) => ({ elevator: { ...st.elevator, phase: "idle", pressed: null } }));
    await sleep(t(0.35) * 1000);
    await exitElevatorInner();
  };

  // Internal (non-locking) building blocks used by the public actions.
  const enterBuildingInner = async (): Promise<boolean> => {
    const lobbyId = lobby.id;
    transitionPerf.begin("exterior", lobbyId);
    preloadFloorScene(lobby.sceneType);
    await move(doorwayPose(), 1.2);
    set({ fade: true });
    await sleep(t(0.45) * 1000);
    const lobbyFloor = getFloor(lobbyId)!;
    beginPrep(lobbyId);
    set({
      view: "interior",
      sub: "overview",
      stalled: null,
      floorId: lobbyId,
      zoneId: null,
      doorsOpen: false,
      elevator: { phase: "idle", displayFloorId: lobbyId, direction: 0, pressed: null },
    });
    const ov = overviewPose(lobbyFloor, ctx());
    // Start just inside the entrance and glide forward.
    cut({ position: [ov.position[0], 1.7, 9.9], target: [0, 1.6, -6] });
    transitionPerf.mark("swap");
    if ((await waitPrepared(lobbyId)) !== "ready") {
      // Keep the entry fade over the unprepared scene; the recovery UI takes over.
      stall("entrance");
      return false;
    }
    transitionPerf.mark("doorsOpen");
    set({ fade: false });
    await move(ov, 1.6);
    transitionPerf.mark("arrived");
    return true;
  };

  const enterElevatorInner = async () => {
    const s = get();
    if (s.sub === "elevator") return;
    set({ zoneId: null, panel: null });
    void doors(true);
    await move(elevatorApproachPose(), 1.0);
    set({ sub: "elevator" });
    await move(cabPose(), 1.2);
  };

  /** Step out at eye level, then crane up to reveal the whole floor. */
  const exitElevatorInner = async () => {
    // Never step out onto a floor that is not prepared.
    if (get().stalled || get().prep.status !== "ready") return;
    set({ sub: "hall" });
    await move(hallPose(ctx()), 1.0);
    void doors(false);
    await sleep(t(0.25) * 1000);
    const floor = getFloor(get().floorId)!;
    set({ sub: "overview" });
    await move(overviewPose(floor, ctx()), 1.7, 1.2);
  };

  const rideInner = async (floorId: string): Promise<boolean> => {
    const s = get();
    const dest = getFloor(floorId);
    if (!dest) return false;
    if (s.sub !== "elevator") await enterElevatorInner();
    if (get().floorId === floorId) {
      // Pressing the failed floor's own button means "try again".
      if (get().stalled) return retryInner();
      await exitElevatorInner();
      return true;
    }
    set({ stalled: null });
    const from = get().floorId;
    const path = floorsBetween(from, floorId);
    const dir = (path.length && getFloorIndexDir(from, floorId)) as 1 | -1;

    transitionPerf.begin(from, floorId);
    playClick();
    set((st) => ({ elevator: { ...st.elevator, pressed: floorId, direction: dir } }));
    // Start fetching the destination scene code right away, during the press + door close.
    preloadFloorScene(dest.sceneType);
    await sleep(t(0.25) * 1000);
    set((st) => ({ elevator: { ...st.elevator, phase: "closing" } }));
    await doors(false);

    // Doors are shut: swap the floor scene behind them.
    beginPrep(floorId);
    set((st) => ({ floorId, zoneId: null, elevator: { ...st.elevator, phase: "moving" } }));
    transitionPerf.mark("swap");
    const total = travelDuration(from, floorId, get().reducedMotion);
    startHum(total);
    const step = (total * 1000) / path.length;
    for (const f of path) {
      await sleep(step);
      set((st) => ({ elevator: { ...st.elevator, displayFloorId: f.id } }));
    }
    // Travel time normally covers preparation; if not, the cab waits with the doors shut.
    if ((await waitPrepared(floorId)) !== "ready") {
      stall("elevator");
      return false;
    }
    await arrive();
    return true;
  };

  /** Re-prepare the current floor after a failure; continue the arrival if it works. */
  const retryInner = async (): Promise<boolean> => {
    const st = get();
    const floorId = st.floorId;
    const context = st.stalled;
    if (!context) return true;
    const dest = getFloor(floorId);
    if (!dest) return false;
    transitionPerf.begin(floorId, floorId);
    // A late success (e.g. finished just after a timeout) needs no remount.
    if (!(st.prep.floorId === floorId && st.prep.status === "ready")) {
      beginPrep(floorId, true);
      preloadFloorScene(dest.sceneType);
      transitionPerf.mark("swap");
      if ((await waitPrepared(floorId)) !== "ready") {
        stall(context);
        return false;
      }
    }
    logPrep("recovered", floorId, { attempt: get().prep.attempt });
    if (context === "elevator") {
      await arrive();
    } else {
      set({ stalled: null });
      transitionPerf.mark("doorsOpen");
      set({ fade: false });
      await move(overviewPose(dest, ctx()), 1.6);
      transitionPerf.mark("arrived");
    }
    return true;
  };

  const exitBuildingInner = async () => {
    set({ panel: null, fade: true, stalled: null });
    await sleep(t(0.45) * 1000);
    set((st) => ({
      view: "approach",
      sub: "hall",
      zoneId: null,
      doorsOpen: false,
      elevator: { ...st.elevator, phase: "idle", pressed: null },
    }));
    cut(doorwayPose());
    await sleep(150);
    set({ fade: false });
    await move(approachPose(ctx()), 1.4);
  };

  return {
    view: "exterior",
    sub: "hall",
    floorId: lobby.id,
    zoneId: null,
    panel: null,
    hoveredItemId: null,
    camera: { pose: exteriorPose({ aspect: 1.6, fov: 42 }), duration: 0, arc: 0, id: 0 },
    doorsOpen: false,
    elevator: { phase: "idle", displayFloorId: lobby.id, direction: 0, pressed: null },
    busy: false,
    fade: false,
    theme: "light",
    themeManual: false,
    sound: true,
    reducedMotion: false,
    mobile: false,
    aspect: 1.6,
    searchOpen: false,
    directoryOpen: false,
    readyFloors: {},
    mountedFloorId: null,
    mountSeq: 0,
    prep: { floorId: null, status: "idle", failure: null, attempt: 0, token: 0 },
    prepTimeoutMs: PREP_TIMEOUT_MS,
    stalled: null,

    setViewport: (aspect, mobile) => {
      const prev = get().aspect;
      set({ aspect, mobile });
      if (Math.abs(prev - aspect) > 0.05 && !get().busy) get().reframe();
    },
    setTheme: (theme, manual = false) => set({ theme, themeManual: manual || get().themeManual }),
    toggleSound: () => {
      unlockAudio();
      const sound = !get().sound;
      setSoundEnabled(sound);
      set({ sound });
      try {
        localStorage.setItem("iseth-sound", sound ? "on" : "off");
      } catch {}
    },
    setReducedMotion: (reducedMotion) => set({ reducedMotion }),
    setHovered: (hoveredItemId) => set({ hoveredItemId }),
    setSearchOpen: (searchOpen) => set({ searchOpen }),
    setDirectoryOpen: (directoryOpen) => set({ directoryOpen }),
    markReady: (floorId) => {
      set((s) => ({ readyFloors: { ...s.readyFloors, [floorId]: true }, mountedFloorId: floorId, mountSeq: s.mountSeq + 1 }));
      if (floorId === get().floorId) transitionPerf.mark("mounted");
    },
    markPrepared: (floorId) => {
      const p = get().prep;
      if (get().floorId !== floorId || p.floorId !== floorId) return;
      // A late success after a timeout is accepted: Retry then continues at once.
      set({ prep: { ...p, status: "ready", failure: null } });
      transitionPerf.mark("prepared");
      logPrep(p.status === "failed" ? "ready-late" : "ready", floorId, { attempt: p.attempt });
    },
    markPrepFailed: (floorId, reason, message) => {
      const p = get().prep;
      if (p.floorId !== floorId || p.status === "ready") return;
      const failure = { floorId, reason, message, attempt: p.attempt, at: Date.now() };
      set({ prep: { ...p, status: "failed", failure } });
      logPrep("failed", floorId, failure);
    },
    retryScene: () => withBusy(async () => void (await retryInner())),
    leaveFailedScene: () =>
      withBusy(async () => {
        const s = get();
        if (!s.stalled) return;
        if (s.stalled === "elevator" && s.floorId !== lobby.id) {
          logPrep("leave-to-lobby", s.floorId);
          await rideInner(lobby.id);
        } else {
          logPrep("leave-outside", s.floorId);
          await exitBuildingInner();
        }
      }),

    focusBuilding: () => {
      if (get().busy || get().view !== "exterior") return;
      set({ view: "approach" });
      void move(approachPose(ctx()), 1.5, 0.5);
    },
    backToExterior: () => {
      if (get().busy) return;
      set({ view: "exterior" });
      void move(exteriorPose(ctx()), 1.4);
    },
    enterBuilding: () => withBusy(async () => void (await enterBuildingInner())),
    exitBuilding: () => withBusy(exitBuildingInner),
    goHall: () => {
      if (get().busy || get().view !== "interior") return;
      set({ sub: "hall", zoneId: null });
      void move(hallPose(ctx()), 1.1);
    },
    goOverview: () => {
      if (get().busy || get().view !== "interior") return;
      const floor = getFloor(get().floorId)!;
      set({ sub: "overview", zoneId: null });
      void move(overviewPose(floor, ctx()), 1.4, 1.5);
    },
    goZone: (zoneId) => {
      const s = get();
      if (s.busy || s.view !== "interior" || s.sub === "elevator") return;
      const floor = getFloor(s.floorId);
      const zone = getZone(zoneId);
      if (!floor || !zone || zone.floorId !== floor.id) return;
      const pose = zonePose(floor, zoneId, ctx());
      if (!pose) return;
      set({ sub: "zone", zoneId });
      void move(pose, 1.3, 0.8);
      if (zone.panel) set({ panel: { kind: zone.panel } });
    },
    enterElevator: () => withBusy(enterElevatorInner),
    exitElevator: () => withBusy(exitElevatorInner),
    rideTo: (floorId) => {
      unlockAudio();
      return withBusy(async () => void (await rideInner(floorId)));
    },
    navigate: ({ floorId, zoneId, itemId }) => {
      unlockAudio();
      return withBusy(async () => {
        set({ searchOpen: false, directoryOpen: false });
        if (get().view !== "interior" && !(await enterBuildingInner())) return;
        if (get().floorId !== floorId || get().stalled) {
          if (!(await rideInner(floorId))) return;
        } else if (get().sub === "elevator") await exitElevatorInner();
        if (zoneId) {
          const floor = getFloor(floorId)!;
          const pose = zonePose(floor, zoneId, ctx());
          if (pose) {
            set({ sub: "zone", zoneId });
            await move(pose, 1.3, 0.8);
          }
          const panel = getZone(zoneId)?.panel;
          if (panel && !itemId) set({ panel: { kind: panel } });
        }
        if (itemId) set({ panel: { kind: "item", id: itemId } });
      });
    },
    openItem: (id) => {
      if (!getItem(id)) return;
      set({ panel: { kind: "item", id } });
    },
    openPanel: (panel) => set({ panel }),
    closePanel: () => set({ panel: null }),

    /** Re-apply the current view's pose (after resize / orientation change). */
    reframe: () => {
      const s = get();
      const c = ctx();
      let pose: Pose | null = null;
      if (s.view === "exterior") pose = exteriorPose(c);
      else if (s.view === "approach") pose = approachPose(c);
      else {
        const floor = getFloor(s.floorId)!;
        if (s.sub === "overview") pose = overviewPose(floor, c);
        else if (s.sub === "hall") pose = hallPose(c);
        else if (s.sub === "zone" && s.zoneId) pose = zonePose(floor, s.zoneId, c);
      }
      if (pose) void move(pose, 0.5);
    },
  };
});

function getFloorIndexDir(from: string, to: string): 1 | -1 {
  const path = floorsBetween(from, to);
  const last = path[path.length - 1];
  const first = getFloor(from)!;
  const n = (f: typeof first) => (f.type === "rooftop" ? 1e6 : f.floorNumber);
  return n(last) > n(first) ? 1 : -1;
}

export function itemLocation(itemId: string) {
  const item = getItem(itemId);
  return item ? locateItem(item) : { zone: undefined, floor: undefined };
}

// Dev-only handle for debugging in the browser console.
if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  (window as unknown as { __tower: typeof useTower }).__tower = useTower;
}
