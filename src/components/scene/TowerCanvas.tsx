"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, lazy, useEffect } from "react";
import * as THREE from "three";
import { EXT } from "@/lib/layout";
import { transitionPerf } from "@/lib/perf";
import { useTower } from "@/store/tower";
import { LightRig } from "./common/LightRig";
import { CameraRig } from "./CameraRig";
import { applyThemeToMaterials } from "./common/materials";
import { SKY } from "./common/Sky";

const ExteriorScene = lazy(() => import("./exterior/ExteriorScene"));
const InteriorWorld = lazy(() => import("./interior/InteriorWorld"));

/** Reports viewport aspect to the store and adapts FOV for portrait screens. */
function ViewportSync() {
  const size = useThree((s) => s.size);
  const setViewport = useTower((s) => s.setViewport);
  useEffect(() => {
    const aspect = size.width / Math.max(1, size.height);
    const coarse = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
    setViewport(aspect, size.width < 768 || (coarse && size.width < 1024));
  }, [size.width, size.height, setViewport]);
  return null;
}

function ThemeSync() {
  const theme = useTower((s) => s.theme);
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    applyThemeToMaterials(theme);
    gl.toneMapping = THREE.NeutralToneMapping;
    gl.toneMappingExposure = theme === "dark" ? 1.0 : 1.05;
  }, [theme, gl]);
  return null;
}

function ExteriorLights() {
  const theme = useTower((s) => s.theme);
  const night = theme === "dark";
  return (
    <LightRig
      reserveCabLight
      fog={{ color: SKY[theme].fog, near: 110, far: 300 }}
      hemi={night ? { sky: "#5a6aa8", ground: "#7a5434", intensity: 1.0 } : { sky: "#d4e8ff", ground: "#d9c3a0", intensity: 0.95 }}
      ambient={{ color: "#ffe8cc", intensity: night ? 0.06 : 0.04 }}
      sun={{
        position: night ? [-18, 26, 14] : [22, 32, 18],
        color: night ? "#a9b9ff" : "#fff0d4",
        intensity: night ? 0.7 : 2.3,
        bounds: [-24, 24, 30, -14],
        far: 90,
      }}
      accent={night ? { position: [0, 2.6, EXT.d / 2 + 3], color: "#ffb870", intensity: 18, distance: 16 } : undefined}
    />
  );
}

/** Feeds frame times to the transition profiler. */
function PerfProbe() {
  useFrame((_, dt) => transitionPerf.frame(dt * 1000));
  return null;
}

export default function TowerCanvas() {
  const view = useTower((s) => s.view);
  const theme = useTower((s) => s.theme);
  const mobile = useTower((s) => s.mobile);
  const night = theme === "dark";

  return (
    <Canvas
      shadows={{ type: THREE.PCFShadowMap }}
      dpr={[1, mobile ? 1.5 : 2]}
      camera={{ fov: 42, near: 0.1, far: 700, position: [30, 18, 40] }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.NeutralToneMapping;
      }}
      className="tower-canvas"
      aria-hidden
    >
      <ViewportSync />
      <PerfProbe />
      <ThemeSync />
      <CameraRig />
      <Environment resolution={64} frames={1} environmentIntensity={night ? 0.25 : 0.6}>
        <Lightformer form="rect" intensity={night ? 0.6 : 2} position={[0, 10, 0]} rotation-x={Math.PI / 2} scale={[20, 20, 1]} color={night ? "#5a6aa8" : "#ffffff"} />
        <Lightformer form="rect" intensity={1.2} position={[-12, 4, 8]} rotation-y={Math.PI / 2} scale={[12, 6, 1]} color="#ffe2b8" />
        <Lightformer form="rect" intensity={0.8} position={[12, 4, -6]} rotation-y={-Math.PI / 2} scale={[12, 6, 1]} color={night ? "#ffb870" : "#cfe6ff"} />
      </Environment>
      <Suspense fallback={null}>
        {view === "interior" ? (
          <InteriorWorld />
        ) : (
          <>
            <ExteriorLights />
            <ExteriorScene />
          </>
        )}
      </Suspense>
    </Canvas>
  );
}
