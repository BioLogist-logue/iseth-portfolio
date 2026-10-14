"use client";

import type { ThreeEvent } from "@react-three/fiber";
import { ContactShadows, Html } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import { EXT, buildingHeight } from "@/lib/layout";
import { useTower } from "@/store/tower";
import { Backdrop, Clouds, NightStars, SkyDome } from "../common/Sky";
import { BasementSection, Building } from "./Building";
import { BOLLARDS, Island } from "./Landscape";
import { GlowPoints } from "../common/GlowPoints";

export default function ExteriorScene() {
  const theme = useTower((s) => s.theme);
  const view = useTower((s) => s.view);
  const mobile = useTower((s) => s.mobile);
  const reduced = useTower((s) => s.reducedMotion);
  const focusBuilding = useTower((s) => s.focusBuilding);
  const markReady = useTower((s) => s.markReady);
  useEffect(() => markReady("exterior"), [markReady]);

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    if (e.delta > 6) return; // was a drag, not a click
    e.stopPropagation();
    focusBuilding();
  };

  return (
    <group>
      <SkyDome theme={theme} />
      {theme === "light" ? <Clouds animate={!reduced} /> : <NightStars animate={!reduced} />}
      <Backdrop theme={theme} lowDetail={mobile} />
      <group
        onClick={onClick}
        onPointerOver={() => view === "exterior" && (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "")}
      >
        <Island lowDetail={mobile} />
        <BasementSection front={EXT.plazaFront} lowDetail={mobile} />
        <Building lowDetail={mobile} />
      </group>
      {/* Soft grounding shadows, rendered once (the plaza is static). */}
      <ContactShadows
        position={[0, 0.135, -0.75]}
        scale={[36, 24.5]}
        far={5}
        blur={2.6}
        opacity={theme === "dark" ? 0.3 : 0.42}
        resolution={mobile ? 512 : 1024}
        color="#4a3826"
        frames={1}
      />
      {theme === "dark" && <NightGlow />}
      <EnterButton visible={view === "approach"} />
    </group>
  );
}

function EnterButton({ visible }: { visible: boolean }) {
  const enter = useTower((s) => s.enterBuilding);
  const busy = useTower((s) => s.busy);
  return (
    <Html position={[0, 0.9, EXT.d / 2 + 3.4]} center zIndexRange={[25, 21]}>
      <AnimatePresence>
        {visible && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 10, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.35, delay: 0.5 }}
            onClick={() => void enter()}
            disabled={busy}
            className="enter-btn"
          >
            <span className="text-[15px] font-semibold">들어가기</span>
            <span className="text-[11px] tracking-wide opacity-70">Enter</span>
          </motion.button>
        )}
      </AnimatePresence>
    </Html>
  );
}

/** Warm halos around exterior lights after dark. */
function NightGlow() {
  const points = useMemo(() => {
    const top = buildingHeight() + 0.45;
    const pts: [number, number, number][] = BOLLARDS.map(([x, , z]) => [x, 0.66, z]);
    // entrance canopy downlights
    for (const x of [-1.6, 0, 1.6]) pts.push([x, 3.0, EXT.d / 2 + 1.5]);
    // rooftop pergola string lights
    for (let i = 0; i < 9; i += 2) pts.push([-4.3 - 1.9 + i * 0.475, top + 2.28, 1.3]);
    return pts;
  }, []);
  return <GlowPoints points={points} size={2.0} opacity={0.7} />;
}
