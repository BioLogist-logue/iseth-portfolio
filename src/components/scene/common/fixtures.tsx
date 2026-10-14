"use client";

import { memo } from "react";
import { RBox } from "./instancing";
import { accentMat, mats, texMat } from "./materials";
import { G, Box, Cyl, CylLow } from "./primitives";
import { artTexture, booksTexture } from "./textures";

/**
 * Architectural fixtures shared by the interior archetypes. Each is a few
 * meshes built from shared geometry and materials, so new archetypes add
 * identity without adding draw-call-heavy assets.
 */

type V3 = [number, number, number];
interface Placed {
  position?: V3;
  rotation?: number;
}

/** Low-cost shelving: a wood carcass with a books "face" (3 meshes). Faces +z (and −z if `double`). */
export const ShelfBlock = memo(function ShelfBlock({
  position,
  rotation = 0,
  w = 2,
  h = 2.2,
  d = 0.45,
  seed = "shelf",
  double = false,
}: Placed & { w?: number; h?: number; d?: number; seed?: string; double?: boolean }) {
  const m = mats();
  const books = texMat(booksTexture(seed), 0.15);
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <RBox p={[0, h / 2, 0]} size={[w, h, d]} radius={0.03} m={m.wood} cast />
      <mesh geometry={G.plane} material={books} position={[0, h / 2 - 0.02, d / 2 + 0.005]} scale={[w - 0.12, h - 0.2, 1]} />
      {double && <mesh geometry={G.plane} material={books} position={[0, h / 2 - 0.02, -d / 2 - 0.005]} rotation={[0, Math.PI, 0]} scale={[w - 0.12, h - 0.2, 1]} />}
      <Box p={[0, h + 0.03, 0]} s={[w + 0.06, 0.06, d + 0.06]} m={m.woodDark} />
    </group>
  );
});

/** Freestanding white display/partition wall with optional art on both faces. */
export const PartitionWall = memo(function PartitionWall({
  position,
  rotation = 0,
  w = 3.6,
  h = 3,
  art,
}: Placed & { w?: number; h?: number; art?: [string, string?] }) {
  const m = mats();
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <RBox p={[0, h / 2, 0]} size={[w, h, 0.22]} radius={0.04} m={m.plaster} cast receive />
      <Box p={[0, 0.06, 0]} s={[w + 0.04, 0.12, 0.26]} m={m.woodDark} />
      {art?.[0] && (
        <group position={[0, h * 0.52, 0.12]}>
          <Box s={[w * 0.46 + 0.08, h * 0.36 + 0.08, 0.03]} m={m.wood} />
          <mesh geometry={G.plane} material={texMat(artTexture(art[0], "art"), 0.3)} position={[0, 0, 0.016]} scale={[w * 0.46, h * 0.36, 1]} />
        </group>
      )}
      {art?.[1] && (
        <group position={[0, h * 0.52, -0.12]} rotation={[0, Math.PI, 0]}>
          <Box s={[w * 0.46 + 0.08, h * 0.36 + 0.08, 0.03]} m={m.wood} />
          <mesh geometry={G.plane} material={texMat(artTexture(art[1], "art"), 0.3)} position={[0, 0, 0.016]} scale={[w * 0.46, h * 0.36, 1]} />
        </group>
      )}
    </group>
  );
});

/** Ceiling track with small spot heads — "focused display lighting" without real lights. */
export const TrackLights = memo(function TrackLights({ position, rotation = 0, w = 6, n = 5 }: Placed & { w?: number; n?: number }) {
  const m = mats();
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <Box p={[0, 0, 0]} s={[w, 0.05, 0.06]} m={m.dark} />
      {Array.from({ length: n }, (_, i) => {
        const x = -w / 2 + ((i + 0.5) * w) / n;
        return (
          <group key={i} position={[x, -0.12, 0.05]} rotation={[0.5, 0, 0]}>
            <CylLow p={[0, 0, 0]} s={[0.1, 0.18, 0.1]} m={m.dark} />
            <Cyl p={[0, -0.095, 0]} s={[0.08, 0.01, 0.08]} m={m.lamp} />
          </group>
        );
      })}
    </group>
  );
});

export type BoardKind = "blackboard" | "cork" | "schedule" | "process" | "screen";

/** Wall-mounted board. No text: readable content always lives in the DOM. */
export const WallBoard = memo(function WallBoard({
  position,
  rotation = 0,
  w = 3,
  h = 1.4,
  kind = "cork",
  accent = "#c08a4a",
  seed = "board",
}: Placed & { w?: number; h?: number; kind?: BoardKind; accent?: string; seed?: string }) {
  const m = mats();
  const surface =
    kind === "blackboard"
      ? accentMat("#2f4a3e")
      : kind === "cork"
        ? accentMat("#c99a6a")
        : kind === "screen"
          ? texMat(artTexture(seed, "screen"), 0.55)
          : m.offWhite;
  const notes: [number, number, string][] =
    kind === "cork"
      ? [
          [-0.32, 0.18, "#fbf3d0"],
          [-0.05, 0.22, "#f2a7b8"],
          [0.22, 0.12, "#cfe6f5"],
          [-0.22, -0.18, "#ffffff"],
          [0.1, -0.16, "#f4cf5d"],
          [0.34, -0.2, "#bfe3c4"],
        ]
      : kind === "schedule"
        ? Array.from({ length: 10 }, (_, i) => [-0.36 + (i % 5) * 0.18, i < 5 ? 0.14 : -0.14, i % 3 ? "#eef3fb" : accent] as [number, number, string])
        : [];
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <Box p={[0, 0, -0.02]} s={[w + 0.12, h + 0.12, 0.05]} m={m.wood} />
      <mesh geometry={G.plane} material={surface} position={[0, 0, 0.006]} scale={[w, h, 1]} />
      {kind === "blackboard" && <Box p={[0, -h / 2 - 0.05, 0.05]} s={[w, 0.04, 0.1]} m={m.wood} />}
      {notes.map(([x, y, c], i) => (
        <mesh key={i} geometry={G.plane} material={accentMat(c, 0.1)} position={[x * w, y * h, 0.012]} scale={[w * 0.14, h * 0.22, 1]} />
      ))}
      {kind === "process" &&
        [0, 1, 2, 3].map((i) => (
          <group key={i}>
            <mesh geometry={G.plane} material={accentMat(i % 2 ? accent : "#5b6fd6", 0.25)} position={[(-0.36 + i * 0.24) * w, 0.05 * h, 0.012]} scale={[w * 0.16, h * 0.34, 1]} />
            {i < 3 && <mesh geometry={G.plane} material={m.dark} position={[(-0.24 + i * 0.24) * w, 0.05 * h, 0.012]} scale={[w * 0.06, 0.02, 1]} />}
          </group>
        ))}
    </group>
  );
});

/** Slanted document / lecture-material stand. */
export const DocumentStand = memo(function DocumentStand({ position, rotation = 0, seed = "doc" }: Placed & { seed?: string }) {
  const m = mats();
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <CylLow p={[0, 0.5, 0]} s={[0.06, 1.0, 0.06]} m={m.woodDark} />
      <Cyl p={[0, 0.02, 0]} s={[0.4, 0.04, 0.4]} m={m.woodDark} />
      <group position={[0, 1.08, 0]} rotation={[-0.6, 0, 0]}>
        <RBox p={[0, 0, 0]} size={[0.62, 0.46, 0.04]} radius={0.015} m={m.wood} />
        <mesh geometry={G.plane} material={texMat(artTexture(seed, "cover"), 0.3)} position={[0, 0, 0.022]} scale={[0.52, 0.38, 1]} />
      </group>
    </group>
  );
});

/** Standing media station: a screen on a slim post. */
export const MediaKiosk = memo(function MediaKiosk({ position, rotation = 0, seed = "kiosk" }: Placed & { seed?: string }) {
  const m = mats();
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <RBox p={[0, 0.03, 0]} size={[0.6, 0.06, 0.5]} radius={0.02} m={m.offWhite} />
      <Box p={[0, 0.6, -0.05]} s={[0.08, 1.15, 0.08]} m={m.steel} />
      <group position={[0, 1.25, 0]} rotation={[-0.25, 0, 0]}>
        <RBox p={[0, 0, 0]} size={[0.78, 0.5, 0.05]} radius={0.02} m={m.dark} cast />
        <mesh geometry={G.plane} material={texMat(artTexture(seed, "chart"), 0.6)} position={[0, 0, 0.027]} scale={[0.7, 0.42, 1]} />
      </group>
    </group>
  );
});

/** Low presentation stage with a soft wood edge. */
export const Stage = memo(function Stage({ position, rotation = 0, w = 6, d = 2.2 }: Placed & { w?: number; d?: number }) {
  const m = mats();
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <RBox p={[0, 0.11, 0]} size={[w, 0.22, d]} radius={0.05} m={m.woodLight} receive />
      <Box p={[0, 0.12, d / 2 + 0.005]} s={[w - 0.1, 0.03, 0.01]} m={m.cove} />
    </group>
  );
});
