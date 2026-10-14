"use client";

import { useThree } from "@react-three/fiber";
import { Component, Suspense, useEffect, useRef, type ReactNode } from "react";
import type * as THREE from "three";
import { getFloor, lobby } from "@/lib/building";
import { archetypeOf } from "@/lib/archetypes";
import { classifyError, injectedFault, logPrep } from "@/lib/scenePrep";
import { useTower } from "@/store/tower";
import { LightRig, type LightRigProps } from "../common/LightRig";
import { prepareForReveal } from "../common/prepare";
import { Clouds, NightStars, SkyDome } from "../common/Sky";
import { ElevatorCab } from "./ElevatorCab";
import { FloorSceneComponents } from "./floorScenes";

/**
 * Everything inside the tower. Only the current floor is mounted; the cab
 * persists across floors so the swap happens invisibly behind closed doors.
 */
export default function InteriorWorld() {
  const floorId = useTower((s) => s.floorId);
  const theme = useTower((s) => s.theme);
  const reduced = useTower((s) => s.reducedMotion);
  const floor = getFloor(floorId) ?? lobby;
  const arch = archetypeOf(floor);
  const Scene = FloorSceneComponents[arch.family];
  const outdoor = arch.family === "garden";
  const night = theme === "dark";
  const group = useRef<THREE.Group>(null);
  const attempt = useTower((s) => s.prep.attempt);
  const token = useTower((s) => s.prep.token);
  // Retry bumps `attempt`: a new key remounts the scene and resets its error boundary.
  const sceneKey = `${floor.id}:${attempt}`;

  return (
    <>
      {arch.style.windows || outdoor ? (
        <>
          <SkyDome theme={theme} />
          {night ? <NightStars animate={!reduced} /> : outdoor && <Clouds animate={!reduced} />}
        </>
      ) : (
        <color attach="background" args={[night ? "#16130f" : "#e4dccf"]} />
      )}

      <LightRig {...interiorLights(arch, night)} />
      <ElevatorCab />
      <group ref={group}>
        <SceneBoundary key={sceneKey} floorId={floor.id}>
          <Suspense fallback={null}>
            <FaultProbe faultKey={`${floor.id}#${token}`} floorId={floor.id} />
            <Scene floor={floor} />
          </Suspense>
        </SceneBoundary>
      </group>
      <FloorPreparer group={group} />
    </>
  );
}

/** Light tints per archetype character. Warm = reading / archive, cool = digital classroom. */
const TONES = {
  warm: { daySky: "#fdf0dc", daySun: "#ffeccd", lampSky: "#ffdcb0", lampSun: "#ffd29c", ambient: "#ffe4c2" },
  neutral: { daySky: "#f8f6f1", daySun: "#fff4e4", lampSky: "#fbe6cb", lampSun: "#ffdcb0", ambient: "#fbecd8" },
  cool: { daySky: "#eef4fb", daySun: "#f6f8ff", lampSky: "#f0ead8", lampSun: "#f6e8d2", ambient: "#eef0f4" },
} as const;

function interiorLights(arch: ReturnType<typeof archetypeOf>, night: boolean): LightRigProps {
  const s = arch.style;
  const fog = { color: "#000000", near: 600, far: 1200 }; // present but out of range: keeps shader keys stable
  if (arch.family === "garden") {
    return {
      fog,
      hemi: night ? { sky: "#3a4a7a", ground: "#2a2016", intensity: 0.75 } : { sky: "#cfe6ff", ground: "#b9a27a", intensity: 1.0 },
      ambient: { color: "#ffe8cc", intensity: night ? 0.08 : 0.04 },
      sun: { position: night ? [-10, 20, 8] : [14, 22, 10], color: night ? "#a8b8ff" : "#fff1d6", intensity: night ? 0.55 : 2.4, bounds: [-16, 16, 16, -16] },
      accent: night && arch.accentLight ? arch.accentLight : undefined,
    };
  }
  const daylight = s.windows && !night;
  // Lighting character from the archetype: tint + key strength (uniform changes only).
  const tone = TONES[arch.light.tint];
  const key = arch.light.key;
  return {
    fog,
    hemi: daylight
      ? { sky: tone.daySky, ground: "#c9a27a", intensity: 1.05 }
      : { sky: tone.lampSky, ground: "#6a4c34", intensity: night ? 0.85 : 0.95 },
    ambient: { color: tone.ambient, intensity: 0.12 + s.warmth * 0.1 },
    sun: {
      position: daylight ? [-12, 16, 12] : [4, 16, 7],
      color: daylight ? tone.daySun : tone.lampSun,
      intensity: (daylight ? 2.0 : 1.05) * key,
      bounds: [-16, 16, 14, -14],
    },
    accent: (night || !s.windows) && arch.accentLight ? arch.accentLight : undefined,
  };
}

/**
 * When a new floor scene mounts (behind closed elevator doors), upload its
 * textures and compile its shaders, then report it as prepared. The elevator
 * keeps its doors shut until this completes.
 */
function FloorPreparer({ group }: { group: React.RefObject<THREE.Group | null> }) {
  const gl = useThree((s) => s.gl);
  const camera = useThree((s) => s.camera);
  const scene = useThree((s) => s.scene);
  const floorId = useTower((s) => s.floorId);
  const mounted = useTower((s) => s.mountedFloorId);
  const seq = useTower((s) => s.mountSeq);
  const token = useTower((s) => s.prep.token);
  const markPrepared = useTower((s) => s.markPrepared);
  const markPrepFailed = useTower((s) => s.markPrepFailed);

  useEffect(() => {
    if (mounted !== floorId || !group.current) return;
    let cancelled = false;
    const root = group.current;
    (async () => {
      const fault = injectedFault(`${floorId}#${token}`, floorId, ["reject", "hang"]);
      if (fault === "hang") await new Promise(() => {}); // never resolves → timeout path
      if (fault === "reject") throw new Error("Injected GPU preparation failure");
      await prepareForReveal(gl, root, camera, scene);
    })().then(
      () => !cancelled && markPrepared(floorId),
      (err: unknown) => {
        if (cancelled) return;
        logPrep("gpu-prep-error", floorId, err);
        markPrepFailed(floorId, "gpu-error", String((err as Error)?.message ?? err));
      },
    );
    return () => {
      cancelled = true;
    };
  }, [seq, mounted, floorId, token, gl, camera, scene, group, markPrepared, markPrepFailed]);
  return null;
}

/**
 * Catches a floor scene that fails to load (chunk / network error) or throws
 * while rendering, reports it, and renders nothing so the cab and lighting
 * stay stable behind the closed doors.
 */
class SceneBoundary extends Component<{ floorId: string; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    const { floorId } = this.props;
    const reason = classifyError(error);
    logPrep("scene-error", floorId, error);
    useTower.getState().markPrepFailed(floorId, reason, String((error as Error)?.message ?? error));
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/** Development-only: throws during render when a "throw" fault is injected. */
function FaultProbe({ faultKey, floorId }: { faultKey: string; floorId: string }) {
  if (injectedFault(faultKey, floorId, ["throw"])) throw new Error("Injected scene render failure");
  return null;
}
