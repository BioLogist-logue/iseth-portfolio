"use client";

import { memo } from "react";
import type { ItemType, ObjectKind, PortfolioItem } from "@/lib/types";
import { accentMat, mats, texMat } from "../common/materials";
import { G, Box, Cyl, CylLow, Ico, Sphere, Torus } from "../common/primitives";
import { artTexture } from "../common/textures";

const DEFAULT_KIND: Record<ItemType, ObjectKind> = {
  app: "tablet",
  lesson: "book",
  worksheet: "folder",
  case: "screen",
  lecture: "screen",
  certificate: "frame",
  badge: "badge",
  milestone: "frame",
  document: "folder",
  tool: "monitor",
  reflection: "book",
  essay: "frame",
  template: "folder",
  role: "badge",
};

export function objectKind(item: PortfolioItem): ObjectKind {
  return item.object ?? DEFAULT_KIND[item.type];
}

/** Approximate height of each model, used to place labels and hitboxes. */
export const KIND_HEIGHT: Record<ObjectKind, number> = {
  tablet: 0.45,
  monitor: 0.6,
  book: 0.5,
  folder: 0.35,
  poster: 0.85,
  frame: 0.65,
  badge: 0.55,
  screen: 0.85,
  device: 0.5,
  "model-dna": 0.95,
  "model-cell": 0.6,
  terrarium: 0.6,
  kiosk: 0.6,
};

/** Small stylised object per kind. Origin at the base, front facing +z. */
export const ObjectModel = memo(function ObjectModel({ kind, seed, accent }: { kind: ObjectKind; seed: string; accent: string }) {
  const m = mats();
  const a = accentMat(accent);
  switch (kind) {
    case "tablet":
    case "kiosk": {
      const s = kind === "kiosk" ? 1.25 : 1;
      return (
        <group scale={s}>
          <Box p={[0, 0.04, -0.06]} s={[0.28, 0.08, 0.2]} m={m.white} cast />
          <group position={[0, 0.24, 0]} rotation={[-0.32, 0, 0]}>
            <Box s={[0.46, 0.33, 0.025]} m={m.dark} cast />
            <mesh position={[0, 0, 0.014]} material={texMat(artTexture(seed, "screen"), 0.6)} geometry={G.plane} scale={[0.42, 0.29, 1]} />
          </group>
        </group>
      );
    }
    case "monitor":
      return (
        <group>
          <Box p={[0, 0.34, 0]} s={[0.66, 0.42, 0.035]} m={m.dark} cast />
          <mesh position={[0, 0.34, 0.019]} material={texMat(artTexture(seed, "screen"), 0.6)} geometry={G.plane} scale={[0.6, 0.36, 1]} />
          <Box p={[0, 0.1, -0.02]} s={[0.05, 0.2, 0.05]} m={m.steel} />
          <Box p={[0, 0.01, 0]} s={[0.24, 0.02, 0.16]} m={m.steel} />
        </group>
      );
    case "screen":
      return (
        <group>
          <CylLow p={[0, 0.25, -0.03]} s={[0.05, 0.5, 0.05]} m={m.steel} />
          <Box p={[0, 0.01, -0.03]} s={[0.36, 0.02, 0.26]} m={m.steel} />
          <Box p={[0, 0.62, 0]} s={[0.86, 0.5, 0.04]} m={m.dark} cast />
          <mesh position={[0, 0.62, 0.022]} material={texMat(artTexture(seed, "chart"), 0.6)} geometry={G.plane} scale={[0.8, 0.44, 1]} />
        </group>
      );
    case "book":
      return (
        <group>
          <Box p={[0, 0.03, 0.05]} s={[0.4, 0.06, 0.3]} m={m.woodLight} />
          <group position={[0, 0.27, -0.02]} rotation={[-0.18, 0, 0]}>
            <Box s={[0.34, 0.44, 0.06]} m={a} cast />
            <mesh position={[0, 0, 0.032]} material={texMat(artTexture(seed, "cover"), 0.35)} geometry={G.plane} scale={[0.3, 0.4, 1]} />
          </group>
          <Box p={[0.08, 0.08, 0.12]} s={[0.3, 0.04, 0.22]} m={m.offWhite} />
        </group>
      );
    case "folder":
      return (
        <group>
          <Box p={[0, 0.04, 0]} s={[0.36, 0.08, 0.28]} m={a} cast />
          <Box p={[0.02, 0.11, 0]} s={[0.34, 0.06, 0.27]} m={m.offWhite} cast />
          <group position={[0, 0.25, -0.08]} rotation={[-0.3, 0, 0]}>
            <Box s={[0.32, 0.22, 0.03]} m={a} />
            <mesh position={[0, 0, 0.016]} material={texMat(artTexture(seed, "cover"), 0.3)} geometry={G.plane} scale={[0.28, 0.18, 1]} />
          </group>
        </group>
      );
    case "poster":
      return (
        <group>
          {[-0.18, 0.18].map((x) => (
            <Box key={x} p={[x, 0.42, -0.08]} r={[0.12, 0, 0]} s={[0.035, 0.84, 0.035]} m={m.wood} />
          ))}
          <group position={[0, 0.52, -0.02]} rotation={[-0.12, 0, 0]}>
            <Box s={[0.5, 0.62, 0.02]} m={m.white} cast />
            <mesh position={[0, 0, 0.012]} material={texMat(artTexture(seed, "art"), 0.45)} geometry={G.plane} scale={[0.46, 0.58, 1]} />
          </group>
        </group>
      );
    case "frame":
      return (
        <group>
          <Box p={[0, 0.06, -0.08]} s={[0.12, 0.12, 0.12]} m={m.woodDark} />
          <group position={[0, 0.36, 0]} rotation={[-0.14, 0, 0]}>
            <Box s={[0.5, 0.5, 0.03]} m={m.wood} cast />
            <mesh position={[0, 0, 0.017]} material={texMat(artTexture(seed, "art"), 0.4)} geometry={G.plane} scale={[0.42, 0.42, 1]} />
          </group>
        </group>
      );
    case "badge":
      return (
        <group>
          <Box p={[0, 0.04, -0.04]} s={[0.28, 0.08, 0.2]} m={m.woodDark} />
          <Box p={[-0.06, 0.2, -0.02]} r={[0, 0, 0.25]} s={[0.07, 0.24, 0.01]} m={a} />
          <Box p={[0.06, 0.2, -0.02]} r={[0, 0, -0.25]} s={[0.07, 0.24, 0.01]} m={a} />
          <Cyl p={[0, 0.38, 0]} r={[Math.PI / 2, 0, 0]} s={[0.32, 0.04, 0.32]} m={accentMat("#d9b24a", 0.15)} cast />
          <Cyl p={[0, 0.38, 0.022]} r={[Math.PI / 2, 0, 0]} s={[0.22, 0.01, 0.22]} m={a} />
        </group>
      );
    case "device":
      return (
        <group>
          <Box p={[0, 0.09, 0]} s={[0.42, 0.18, 0.32]} m={m.white} cast />
          <Box p={[0.05, 0.12, 0.165]} s={[0.2, 0.08, 0.01]} m={m.screen} />
          <Sphere p={[-0.08, 0.26, -0.02]} s={[0.2, 0.16, 0.2]} m={m.glass} />
          <CylLow p={[0.14, 0.3, -0.06]} s={[0.05, 0.24, 0.05]} m={a} />
          <Sphere p={[0.14, 0.44, -0.06]} s={0.07} m={m.bulb} />
        </group>
      );
    case "model-dna":
      return (
        <group>
          <Cyl p={[0, 0.03, 0]} s={[0.36, 0.06, 0.36]} m={m.white} />
          {Array.from({ length: 11 }, (_, i) => {
            const y = 0.12 + i * 0.075;
            const ang = i * 0.62;
            const x = Math.cos(ang) * 0.13;
            const z = Math.sin(ang) * 0.13;
            return (
              <group key={i}>
                <Sphere p={[x, y, z]} s={0.055} m={a} />
                <Sphere p={[-x, y, -z]} s={0.055} m={accentMat("#f2c14e")} />
                <Box p={[0, y, 0]} r={[0, -ang, 0]} s={[0.24, 0.015, 0.015]} m={m.offWhite} />
              </group>
            );
          })}
        </group>
      );
    case "model-cell":
      return (
        <group>
          <Cyl p={[0, 0.03, 0]} s={[0.34, 0.06, 0.34]} m={m.white} />
          <Sphere p={[0, 0.34, 0]} s={[0.5, 0.42, 0.5]} m={m.glass} />
          <Sphere p={[0.03, 0.34, 0]} s={0.17} m={accentMat("#8a4fc0", 0.2)} />
          <Sphere p={[-0.13, 0.28, 0.08]} s={[0.12, 0.06, 0.06]} m={m.leaf1} />
          <Sphere p={[0.12, 0.42, -0.06]} s={[0.1, 0.05, 0.05]} m={a} />
          <Torus p={[0, 0.34, 0]} r={[Math.PI / 2, 0, 0]} s={0.5} m={m.glass} />
        </group>
      );
    case "terrarium":
      return (
        <group>
          <Box p={[0, 0.04, 0]} s={[0.44, 0.08, 0.34]} m={m.wood} />
          <Box p={[0, 0.32, 0]} s={[0.42, 0.48, 0.32]} m={m.glass} />
          <Box p={[0, 0.11, 0]} s={[0.38, 0.06, 0.28]} m={m.soil} />
          <Ico p={[-0.06, 0.26, 0]} s={[0.18, 0.24, 0.16]} m={m.leaf3} />
          <Ico p={[0.09, 0.22, 0.04]} s={[0.12, 0.16, 0.12]} m={m.leaf1} />
        </group>
      );
    default:
      return <Box p={[0, 0.2, 0]} s={0.4} m={a} />;
  }
});
