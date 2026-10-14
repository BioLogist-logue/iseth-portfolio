"use client";

import { useTower } from "@/store/tower";

type V3 = [number, number, number];

export interface LightRigProps {
  hemi: { sky: string; ground: string; intensity: number };
  ambient: { color: string; intensity: number };
  sun: { position: V3; color: string; intensity: number; bounds: [number, number, number, number]; far?: number };
  /** Optional local warm light (entrance glow, pergola…). Always mounted; 0 = off. */
  accent?: { position: V3; color: string; intensity: number; distance: number };
  fog: { color: string; near: number; far: number };
}

/**
 * One light setup shared by every view. It always mounts the same set of
 * lights (hemisphere, ambient, one shadowed sun, two point lights incl. the
 * elevator cab's) plus fog. three.js keys shader programs on light counts and
 * fog, so keeping the structure constant means switching floors or entering
 * the building only changes uniforms — no global shader recompile mid-transition.
 */
export function LightRig({ hemi, ambient, sun, accent, fog, reserveCabLight = false }: LightRigProps & { reserveCabLight?: boolean }) {
  const mobile = useTower((s) => s.mobile);
  const size = mobile ? 1024 : 2048;
  const [l, r, t, b] = sun.bounds;
  return (
    <>
      <fog attach="fog" args={[fog.color, fog.near, fog.far]} />
      <hemisphereLight color={hemi.sky} groundColor={hemi.ground} intensity={hemi.intensity} />
      <ambientLight color={ambient.color} intensity={ambient.intensity} />
      <directionalLight
        position={sun.position}
        intensity={sun.intensity}
        color={sun.color}
        castShadow
        shadow-mapSize={[size, size]}
        shadow-camera-left={l}
        shadow-camera-right={r}
        shadow-camera-top={t}
        shadow-camera-bottom={b}
        shadow-camera-far={sun.far ?? 80}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />
      <pointLight
        position={accent?.position ?? [0, -50, 0]}
        intensity={accent?.intensity ?? 0}
        distance={accent?.distance ?? 1}
        color={accent?.color ?? "#ffffff"}
      />
      {/* Placeholder matching the elevator cab's point light where there is no cab. */}
      {reserveCabLight && <pointLight position={[0, -50, 0]} intensity={0} distance={1} />}
    </>
  );
}
