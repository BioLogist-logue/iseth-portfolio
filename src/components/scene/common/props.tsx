"use client";

import { useMemo } from "react";
import type { ReactNode } from "react";
import { mats, texMat } from "./materials";
import { G, Box, Cyl, CylLow, Disc, Ico, PotTaper, Sphere } from "./primitives";
import { artTexture, booksTexture } from "./textures";

type V3 = [number, number, number];
interface Placed {
  position?: V3;
  rotation?: number;
  scale?: number;
}

function Group({ position, rotation = 0, scale = 1, children }: Placed & { children: ReactNode }) {
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {children}
    </group>
  );
}

/** Potted plant. `variant` changes the foliage silhouette. */
export function Plant({ variant = 0, tall = false, ...g }: Placed & { variant?: number; tall?: boolean }) {
  const m = mats();
  const leaf = [m.leaf1, m.leaf2, m.leaf3][variant % 3];
  const h = tall ? 1.25 : 0.75;
  return (
    <Group {...g}>
      <PotTaper p={[0, 0.22, 0]} s={[0.5, 0.44, 0.5]} m={m.pot} cast />
      {variant % 2 === 0 ? (
        <>
          <Ico p={[0, 0.5 + h * 0.35, 0]} s={[0.62, h * 0.7, 0.62]} m={leaf} cast />
          <Ico p={[0.16, 0.45 + h * 0.6, 0.05]} s={[0.42, h * 0.5, 0.42]} m={m.leaf3} cast />
        </>
      ) : (
        <>
          {[0, 1.2, 2.4, 3.6, 4.8].map((a, i) => (
            <Box
              key={i}
              p={[Math.sin(a) * 0.12, 0.55 + h * 0.4, Math.cos(a) * 0.12]}
              r={[Math.cos(a) * 0.5, a, Math.sin(a) * 0.5]}
              s={[0.12, h * 0.9, 0.04]}
              m={leaf}
              cast
            />
          ))}
        </>
      )}
    </Group>
  );
}

export function Tree({ height = 3, variant = 0, ...g }: Placed & { height?: number; variant?: number }) {
  const m = mats();
  const leafA = [m.leaf1, m.leaf3, m.leaf2][variant % 3];
  return (
    <Group {...g}>
      <CylLow p={[0, height * 0.35, 0]} s={[0.16, height * 0.7, 0.16]} m={m.trunk} cast />
      <Ico p={[0, height * 0.78, 0]} s={[height * 0.55, height * 0.45, height * 0.55]} m={leafA} cast />
      <Ico p={[height * 0.18, height * 0.95, height * 0.08]} s={height * 0.38} m={m.leaf3} cast />
      <Ico p={[-height * 0.16, height * 0.9, -height * 0.1]} s={height * 0.34} m={m.leaf1} cast />
    </Group>
  );
}

export function Bush({ ...g }: Placed) {
  const m = mats();
  return (
    <Group {...g}>
      <Ico p={[0, 0.28, 0]} s={[0.8, 0.55, 0.8]} m={m.leaf2} cast />
      <Ico p={[0.25, 0.36, 0.1]} s={[0.45, 0.4, 0.45]} m={m.leaf3} />
      <Sphere p={[-0.2, 0.5, 0.25]} s={0.1} m={m.flowerPink} />
      <Sphere p={[0.15, 0.55, -0.2]} s={0.09} m={m.flowerWhite} />
    </Group>
  );
}

export function Bench({ length = 1.8, ...g }: Placed & { length?: number }) {
  const m = mats();
  return (
    <Group {...g}>
      <Box p={[0, 0.42, 0]} s={[length, 0.08, 0.5]} m={m.wood} cast receive />
      <Box p={[-length / 2 + 0.15, 0.2, 0]} s={[0.12, 0.4, 0.44]} m={m.concrete} cast />
      <Box p={[length / 2 - 0.15, 0.2, 0]} s={[0.12, 0.4, 0.44]} m={m.concrete} cast />
    </Group>
  );
}

export function Planter({ w = 2, d = 1, h = 0.5, flowers = true, ...g }: Placed & { w?: number; d?: number; h?: number; flowers?: boolean }) {
  const m = mats();
  const blobs = useMemo(() => {
    const out: { p: V3; s: number; c: number }[] = [];
    const n = Math.max(2, Math.round(w * d * 2.2));
    for (let i = 0; i < n; i++) {
      const x = ((i * 0.618) % 1) * (w - 0.3) - (w - 0.3) / 2;
      const z = ((i * 0.381 + 0.2) % 1) * (d - 0.3) - (d - 0.3) / 2;
      out.push({ p: [x, h + 0.12, z], s: 0.35 + ((i * 0.27) % 0.25), c: i % 4 });
    }
    return out;
  }, [w, d, h]);
  return (
    <Group {...g}>
      <Box p={[0, h / 2, 0]} s={[w, h, d]} m={m.concrete} cast receive />
      <Box p={[0, h + 0.005, 0]} s={[w - 0.12, 0.02, d - 0.12]} m={m.soil} />
      {blobs.map((b, i) => (
        <Ico key={i} p={b.p} s={[b.s, b.s * 0.7, b.s]} m={b.c === 0 ? m.leaf3 : m.leaf2} />
      ))}
      {flowers &&
        blobs.map((b, i) =>
          i % 2 ? null : (
            <Sphere
              key={`f${i}`}
              p={[b.p[0] + 0.08, b.p[1] + b.s * 0.32, b.p[2]]}
              s={0.09}
              m={[m.flowerPink, m.flowerWhite, m.flowerYellow][i % 3]}
            />
          ),
        )}
    </Group>
  );
}

export function Bollard(g: Placed) {
  const m = mats();
  return (
    <Group {...g}>
      <Cyl p={[0, 0.3, 0]} s={[0.12, 0.6, 0.12]} m={m.dark} />
      <Cyl p={[0, 0.62, 0]} s={[0.13, 0.08, 0.13]} m={m.bulb} />
    </Group>
  );
}

export function Sofa({ color = "cream", ...g }: Placed & { color?: "cream" | "green" | "grey" }) {
  const m = mats();
  const f = color === "green" ? m.fabricGreen : color === "grey" ? m.fabricGrey : m.fabricCream;
  return (
    <Group {...g}>
      <Box p={[0, 0.25, 0]} s={[2.2, 0.3, 0.9]} m={f} cast receive />
      <Box p={[0, 0.6, -0.35]} s={[2.2, 0.55, 0.2]} m={f} cast />
      <Box p={[-1.02, 0.45, 0]} s={[0.18, 0.4, 0.9]} m={f} cast />
      <Box p={[1.02, 0.45, 0]} s={[0.18, 0.4, 0.9]} m={f} cast />
      <Box p={[0, 0.05, 0]} s={[2.1, 0.1, 0.8]} m={m.woodDark} />
    </Group>
  );
}

export function Armchair({ color = "green", ...g }: Placed & { color?: "cream" | "green" }) {
  const m = mats();
  const f = color === "green" ? m.fabricGreen : m.fabricCream;
  return (
    <Group {...g}>
      <Box p={[0, 0.32, 0]} s={[0.85, 0.22, 0.8]} m={f} cast />
      <Box p={[0, 0.65, -0.33]} s={[0.85, 0.5, 0.16]} m={f} cast />
      <Box p={[-0.4, 0.5, 0]} s={[0.12, 0.3, 0.75]} m={f} />
      <Box p={[0.4, 0.5, 0]} s={[0.12, 0.3, 0.75]} m={f} />
      {[-0.35, 0.35].map((x) =>
        [-0.3, 0.3].map((z) => <Box key={`${x}${z}`} p={[x, 0.11, z]} s={[0.05, 0.22, 0.05]} m={m.woodDark} />),
      )}
    </Group>
  );
}

export function CoffeeTable({ round = true, ...g }: Placed & { round?: boolean }) {
  const m = mats();
  return (
    <Group {...g}>
      {round ? <Cyl p={[0, 0.42, 0]} s={[1.1, 0.06, 1.1]} m={m.wood} cast receive /> : <Box p={[0, 0.42, 0]} s={[1.3, 0.06, 0.7]} m={m.wood} cast />}
      <Cyl p={[0, 0.2, 0]} s={[0.16, 0.4, 0.16]} m={m.woodDark} />
    </Group>
  );
}

export function Table({ w = 1.6, d = 0.8, h = 0.75, top = "wood", ...g }: Placed & { w?: number; d?: number; h?: number; top?: "wood" | "white" }) {
  const m = mats();
  return (
    <Group {...g}>
      <Box p={[0, h, 0]} s={[w, 0.06, d]} m={top === "wood" ? m.wood : m.white} cast receive />
      {[-1, 1].map((sx) =>
        [-1, 1].map((sz) => (
          <Box key={`${sx}${sz}`} p={[sx * (w / 2 - 0.06), h / 2, sz * (d / 2 - 0.06)]} s={[0.05, h, 0.05]} m={m.woodDark} />
        )),
      )}
    </Group>
  );
}

/** Solid counter / island with a lit wood front. */
export function Counter({ w = 3, d = 1, h = 0.95, ...g }: Placed & { w?: number; d?: number; h?: number }) {
  const m = mats();
  return (
    <Group {...g}>
      <Box p={[0, h / 2, 0]} s={[w, h, d]} m={m.white} cast receive />
      <Box p={[0, h / 2 - 0.05, d / 2 + 0.01]} s={[w - 0.1, h - 0.25, 0.02]} m={m.wood} />
      <Box p={[0, 0.06, d / 2 + 0.03]} s={[w - 0.1, 0.03, 0.02]} m={m.cove} />
      <Box p={[0, h + 0.02, 0]} s={[w + 0.06, 0.04, d + 0.06]} m={m.offWhite} />
    </Group>
  );
}

export function Chair(g: Placed) {
  const m = mats();
  return (
    <Group {...g}>
      <Box p={[0, 0.45, 0]} s={[0.45, 0.05, 0.42]} m={m.woodLight} cast />
      <Box p={[0, 0.72, -0.19]} s={[0.45, 0.5, 0.04]} m={m.woodLight} />
      <CylLow p={[0, 0.22, 0]} s={[0.05, 0.44, 0.05]} m={m.steel} />
      <CylLow p={[0, 0.02, 0]} s={[0.4, 0.03, 0.4]} m={m.steel} />
    </Group>
  );
}

export function Stool(g: Placed) {
  const m = mats();
  return (
    <Group {...g}>
      <Cyl p={[0, 0.62, 0]} s={[0.36, 0.06, 0.36]} m={m.wood} cast />
      {[0, 1, 2].map((i) => (
        <CylLow
          key={i}
          p={[Math.sin((i * Math.PI * 2) / 3) * 0.12, 0.3, Math.cos((i * Math.PI * 2) / 3) * 0.12]}
          s={[0.035, 0.62, 0.035]}
          m={m.woodDark}
        />
      ))}
    </Group>
  );
}

export function Pouf({ color = 0, ...g }: Placed & { color?: number }) {
  const m = mats();
  return (
    <Group {...g}>
      <Cyl p={[0, 0.2, 0]} s={[0.55, 0.4, 0.55]} m={[m.fabricGreen, m.fabricCream, m.fabricGrey][color % 3]} cast />
    </Group>
  );
}

export function Bookshelf({ w = 1.8, h = 2.1, d = 0.4, seed = "s", ...g }: Placed & { w?: number; h?: number; d?: number; seed?: string }) {
  const m = mats();
  const rows = Math.max(2, Math.floor((h - 0.2) / 0.42));
  const books = texMat(booksTexture(seed), 0.15);
  return (
    <Group {...g}>
      <Box p={[0, h / 2, -d / 2 + 0.02]} s={[w, h, 0.04]} m={m.woodLight} />
      <Box p={[-w / 2, h / 2, 0]} s={[0.05, h, d]} m={m.wood} cast />
      <Box p={[w / 2, h / 2, 0]} s={[0.05, h, d]} m={m.wood} cast />
      {Array.from({ length: rows + 1 }, (_, i) => (
        <Box key={i} p={[0, 0.05 + (i * (h - 0.1)) / rows, 0]} s={[w, 0.04, d]} m={m.wood} />
      ))}
      {Array.from({ length: rows }, (_, i) => (
        <mesh key={`b${i}`} position={[0, 0.07 + (i * (h - 0.1)) / rows + 0.17, -0.02]} material={books} geometry={G.box} scale={[w - 0.12, 0.32, d - 0.12]} />
      ))}
    </Group>
  );
}

export function Monitor({ seed = "m", ...g }: Placed & { seed?: string }) {
  const m = mats();
  const scr = texMat(artTexture(seed, "screen"), 0.5);
  return (
    <Group {...g}>
      <Box p={[0, 0.33, 0]} s={[0.62, 0.4, 0.035]} m={m.dark} cast />
      <mesh position={[0, 0.33, 0.019]} material={scr} geometry={G.plane} scale={[0.56, 0.34, 1]} />
      <Box p={[0, 0.1, -0.02]} s={[0.05, 0.2, 0.05]} m={m.steel} />
      <Box p={[0, 0.01, 0]} s={[0.22, 0.02, 0.16]} m={m.steel} />
    </Group>
  );
}

/** Large wall display. */
export function Display({ w = 3, h = 1.7, seed = "d", kind = "chart" as "chart" | "screen" | "art", ...g }: Placed & { w?: number; h?: number; seed?: string; kind?: "chart" | "screen" | "art" }) {
  const m = mats();
  const scr = texMat(artTexture(seed, kind), 0.55);
  return (
    <Group {...g}>
      <Box p={[0, 0, 0]} s={[w + 0.1, h + 0.1, 0.06]} m={m.dark} />
      <mesh position={[0, 0, 0.032]} material={scr} geometry={G.plane} scale={[w, h, 1]} />
    </Group>
  );
}

export function Frame({ w = 0.9, h = 0.7, seed = "f", ...g }: Placed & { w?: number; h?: number; seed?: string }) {
  const m = mats();
  const art = texMat(artTexture(seed, "art"), 0.25);
  return (
    <Group {...g}>
      <Box p={[0, 0, 0]} s={[w + 0.08, h + 0.08, 0.04]} m={m.wood} />
      <mesh position={[0, 0, 0.022]} material={art} geometry={G.plane} scale={[w, h, 1]} />
    </Group>
  );
}

export function PendantLamp({ drop = 1, ...g }: Placed & { drop?: number }) {
  const m = mats();
  return (
    <Group {...g}>
      <CylLow p={[0, -drop / 2, 0]} s={[0.012, drop, 0.012]} m={m.dark} />
      <Cyl p={[0, -drop - 0.1, 0]} s={[0.36, 0.22, 0.36]} m={m.woodLight} />
      <Disc p={[0, -drop - 0.215, 0]} r={[Math.PI / 2, 0, 0]} s={0.3} m={m.lamp} />
    </Group>
  );
}

export function Microscope(g: Placed) {
  const m = mats();
  return (
    <Group {...g}>
      <Box p={[0, 0.02, 0]} s={[0.22, 0.04, 0.28]} m={m.white} />
      <Box p={[0, 0.2, -0.08]} s={[0.06, 0.34, 0.06]} m={m.white} />
      <Cyl p={[0, 0.3, 0]} s={[0.06, 0.24, 0.06]} m={m.dark} r={[0.4, 0, 0]} />
      <Box p={[0, 0.14, 0.02]} s={[0.16, 0.02, 0.14]} m={m.dark} />
    </Group>
  );
}

export function Beakers(g: Placed) {
  const m = mats();
  return (
    <Group {...g}>
      <Cyl p={[0, 0.1, 0]} s={[0.12, 0.2, 0.12]} m={m.glass} />
      <Cyl p={[0, 0.06, 0]} s={[0.11, 0.1, 0.11]} m={m.leaf3} />
      <Cyl p={[0.18, 0.13, 0.05]} s={[0.08, 0.26, 0.08]} m={m.glass} />
      <Cyl p={[0.18, 0.07, 0.05]} s={[0.07, 0.12, 0.07]} m={m.flowerYellow} />
    </Group>
  );
}

export function GlassRail({ length = 4, h = 1, ...g }: Placed & { length?: number; h?: number }) {
  const m = mats();
  return (
    <Group {...g}>
      <Box p={[0, h / 2, 0]} s={[length, h, 0.02]} m={m.glassRail} />
      <Box p={[0, h + 0.02, 0]} s={[length, 0.05, 0.06]} m={m.steel} />
    </Group>
  );
}

/** Floor rug. `layer` stacks rugs (0 = on the floor, 1 = on top of another rug). */
export function Rug({ w = 3, d = 2, color, layer = 0, ...g }: Placed & { w?: number; d?: number; color?: "cream" | "green"; layer?: number }) {
  const m = mats();
  const t = 0.02;
  return (
    <Group {...g}>
      <Box p={[0, 0.002 + layer * (t + 0.006) + t / 2, 0]} s={[w, t, d]} m={color === "green" ? m.fabricGreen : m.rug} receive />
    </Group>
  );
}

/** Wooden vertical slat panel, common accent in the references. */
export function Slats({ w = 1.2, h = 3, count, ...g }: Placed & { w?: number; h?: number; count?: number }) {
  const m = mats();
  const n = count ?? Math.max(3, Math.round(w / 0.14));
  return (
    <Group {...g}>
      {Array.from({ length: n }, (_, i) => (
        <Box key={i} p={[-w / 2 + (i + 0.5) * (w / n), h / 2, 0]} s={[(w / n) * 0.62, h, 0.08]} m={m.wood} />
      ))}
    </Group>
  );
}
