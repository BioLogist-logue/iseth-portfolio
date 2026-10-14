"use client";

import { memo, useMemo } from "react";
import { archetypeOf } from "@/lib/archetypes";
import { basements } from "@/lib/building";
import { EXT, buildingHeight, upperFloors } from "@/lib/layout";
import type { Floor } from "@/lib/types";
import { Instanced, RBox, roundedBox, type Part } from "../common/instancing";
import { mats, texMat } from "../common/materials";
import { G, Box, Disc, Ico, Sphere, Torus } from "../common/primitives";
import { signTexture } from "../common/textures";
import { Hedges, Trees } from "../common/vegetation";
import { MiniInterior } from "./MiniInterior";
import { interiorSilhouette, silhouetteGeometry, silhouetteMaterial, type SPart } from "./interiorSilhouettes";

const HW = EXT.w / 2;
const HD = EXT.d / 2;
const HC = EXT.coreW / 2;
const WING_W = HW - HC;
const WING_X = (HW + HC) / 2;
const PLINTH = 0.3;
const CORE_FRONT = HD + 0.5;
const CORE_BACK = HD - 1.3;
/** Glass line is set back from the slab edge so slabs read as projecting bands. */
const GZ = HD - 0.25;
const SLAB_OVER = 0.35;

/** Facade treatment per floor, rotated through the stack for gentle variety. */
type Variant = "fins" | "balcony" | "louvres";
const VARIANTS: Variant[] = ["fins", "balcony", "louvres"];

interface Level {
  floor?: Floor;
  /** y of the room floor (top of the slab below). */
  yb: number;
  h: number;
  slabY?: number;
  variant: Variant | "lobby";
}

function levels(): Level[] {
  const out: Level[] = [{ yb: PLINTH, h: EXT.lobbyH - PLINTH, variant: "lobby" }];
  upperFloors().forEach((floor, i) => {
    const slabY = EXT.lobbyH + i * EXT.floorH;
    out.push({ floor, slabY, yb: slabY + EXT.slab, h: EXT.floorH - EXT.slab, variant: VARIANTS[i % VARIANTS.length] });
  });
  return out;
}

/**
 * The tower as a modular stack: lobby module → N repeatable floor modules →
 * rooftop module, with one continuous glass elevator core. Adding a floor to
 * the content data inserts a module and pushes the roof up automatically.
 *
 * Repeated facade elements (slabs, glass, frames, fins…) are gathered across
 * all floors and drawn as instanced meshes — one draw call per part type.
 */
export const Building = memo(function Building({ lowDetail }: { lowDetail: boolean }) {
  const H = buildingHeight();
  const lv = useMemo(levels, []);
  return (
    <group>
      <FacadeInstances levels={lv} lowDetail={lowDetail} />
      <InteriorSilhouettes levels={lv} lowDetail={lowDetail} />
      <LobbyModule />
      <RoofModule y0={H} lowDetail={lowDetail} />
      <ElevatorCore height={H} floors={lv.length - 1} />
    </group>
  );
});

function FacadeInstances({ levels: lv, lowDetail }: { levels: Level[]; lowDetail: boolean }) {
  const m = mats();
  const parts = useMemo(() => {
    const slabs: Part[] = [];
    const curbs: Part[] = [];
    const glass: Part[] = [];
    const frames: Part[] = [];
    const innerFrames: Part[] = [];
    const spandrels: Part[] = [];
    const backs: Part[] = [];
    const fins: Part[] = [];
    const slats: Part[] = [];
    const rails: Part[] = [];
    const railCaps: Part[] = [];
    const planters: Part[] = [];
    const hedges: { p: [number, number, number]; s: [number, number, number] }[] = [];
    const columns: Record<string, Part[]> = {};
    const addColumn = (h: number, p: [number, number, number]) => ((columns[h.toFixed(3)] ??= []).push({ p }));

    for (const l of lv) {
      const { yb, h } = l;
      const cy = yb + h / 2;
      if (l.slabY !== undefined) {
        slabs.push({ p: [0, l.slabY + EXT.slab / 2, 0] });
        // Shallow upstand set back from the slab nose: a second line of depth.
        curbs.push({ p: [0, yb + 0.03, 0], s: [EXT.w + 0.2, 0.06, EXT.d + 0.2] });
      }
      backs.push({ p: [0, cy, -HD + 0.08], s: [EXT.w - 0.3, h, 0.14] });

      for (const side of [-1, 1]) {
        const wx = side * WING_X;
        // glass: front (recessed) + side
        glass.push({ p: [wx, cy, GZ], s: [WING_W - 0.1, h, 0.03] });
        glass.push({ p: [side * (HW - 0.2), cy, -0.15], s: [0.03, h, EXT.d - 0.8] });
        // head + sill frames give the glazing real thickness
        frames.push({ p: [wx, yb + h - 0.06, GZ + 0.03], s: [WING_W, 0.12, 0.14] });
        frames.push({ p: [wx, yb + 0.05, GZ + 0.04], s: [WING_W, 0.1, 0.16] });
        // mullions: depth varies by facade treatment; a darker inner face sits behind the glass
        const n = l.variant === "lobby" || l.variant === "balcony" ? 4 : 3;
        const depth = l.variant === "balcony" ? 0.18 : l.variant === "louvres" ? 0.1 : 0.14;
        for (let k = 1; k < n; k++) {
          const x = wx - WING_W / 2 + (k * WING_W) / n;
          frames.push({ p: [x, cy, GZ + depth / 2 - 0.01], s: [0.07, h, depth] });
          innerFrames.push({ p: [x, cy, GZ - 0.05], s: [0.05, h, 0.07] });
        }
        innerFrames.push({ p: [wx, yb + h - 0.09, GZ - 0.05], s: [WING_W, 0.06, 0.07] });
        // opaque lower panel in the outer bay of "fins" floors, inner bay of lobby
        if (l.variant === "fins") {
          const bay = WING_W / n;
          spandrels.push({ p: [wx + side * (WING_W / 2 - bay / 2), yb + 0.36, GZ - 0.03], s: [bay - 0.08, 0.62, 0.04] });
        }
        if (l.variant === "balcony" || l.variant === "lobby") frames.push({ p: [wx, yb + h * 0.74, GZ + 0.04], s: [WING_W, 0.05, 0.09] });
        for (const z of [-2.2, 1.4]) frames.push({ p: [side * (HW - 0.16), cy, z], s: [0.1, h, 0.07] });
        // corner columns (rounded)
        addColumn(h, [side * (HW - 0.17), cy, GZ - 0.02]);
        addColumn(h, [side * (HW - 0.17), cy, -HD + 0.17]);

        if (l.variant === "fins" || l.variant === "lobby") {
          fins.push({ p: [side * (HW - 0.62), cy, GZ + 0.2], s: [0.34, h, 0.24] });
          fins.push({ p: [side * (HC + 0.42), cy, GZ + 0.2], s: [0.34, h, 0.24] });
        } else if (l.variant === "louvres" && !lowDetail) {
          for (let k = 0; k < 7; k++) slats.push({ p: [side * (HW - 0.45 - k * 0.2), cy, GZ + 0.22], s: [0.07, h - 0.12, 0.2] });
          fins.push({ p: [side * (HC + 0.42), cy, GZ + 0.2], s: [0.34, h, 0.24] });
        } else if (l.variant === "balcony") {
          const rw = WING_W - 0.4;
          rails.push({ p: [wx, yb + 0.42, HD + 0.26], s: [rw, 0.8, 0.02] });
          railCaps.push({ p: [wx, yb + 0.84, HD + 0.26], s: [rw, 0.04, 0.06] });
          if (!lowDetail) {
            const px = wx + side * (WING_W * 0.18);
            planters.push({ p: [px, yb + 0.17, GZ + 0.32], s: [WING_W * 0.42, 0.34, 0.3] });
            hedges.push({ p: [px, yb + 0.32, GZ + 0.32], s: [WING_W * 0.4, 0.26, 0.28] });
          }
        }
      }
    }
    return { slabs, curbs, glass, frames, innerFrames, spandrels, backs, fins, slats, rails, railCaps, planters, hedges, columns };
  }, [lv, lowDetail]);

  const slabGeo = roundedBox(EXT.w + SLAB_OVER * 2, EXT.slab, EXT.d + SLAB_OVER * 2, 0.07, 2);
  const finGeo = roundedBox(1, 1, 1, 0.08, 2);
  return (
    <group>
      <Instanced geometry={slabGeo} material={m.facade} parts={parts.slabs} cast receive />
      <Instanced geometry={G.box} material={m.reveal} parts={parts.curbs} receive />
      <Instanced geometry={G.box} material={m.facade} parts={parts.backs} cast />
      <Instanced geometry={G.box} material={m.frame} parts={parts.frames} cast />
      <Instanced geometry={G.box} material={m.frameInner} parts={parts.innerFrames} />
      <Instanced geometry={G.box} material={m.spandrel} parts={parts.spandrels} />
      {Object.entries(parts.columns).map(([h, ps]) => (
        <Instanced key={h} geometry={roundedBox(0.34, Number(h), 0.34, 0.06)} material={m.facade} parts={ps} cast />
      ))}
      <Instanced geometry={finGeo} material={m.wood} parts={parts.fins} cast />
      <Instanced geometry={G.box} material={m.wood} parts={parts.slats} cast />
      <Instanced geometry={roundedBox(1, 1, 1, 0.1)} material={m.concrete} parts={parts.planters} />
      <Hedges at={parts.hedges} />
      <Instanced geometry={G.box} material={m.steel} parts={parts.railCaps} />
      {/* transparent layers last */}
      <Instanced geometry={G.box} material={m.glassRail} parts={parts.rails} />
      <Instanced geometry={G.box} material={m.glass} parts={parts.glass} />
    </group>
  );
}

/**
 * Interior silhouettes for every above-ground floor, batched by
 * (geometry, material) into instanced meshes. Floors cycle through three glow
 * tiers so brightness varies slightly from floor to floor.
 */
function InteriorSilhouettes({ levels: lv, lowDetail }: { levels: Level[]; lowDetail: boolean }) {
  const groups = useMemo(() => {
    const byKey = new Map<string, { g: SPart["g"]; m: SPart["m"]; tier: number; parts: Part[] }>();
    lv.forEach((l, i) => {
      const kind = l.floor ? archetypeOf(l.floor).mini : "lobby";
      const tier = i % 3;
      for (const side of [-1, 1] as const) {
        const parts = interiorSilhouette(kind, {
          origin: [side * WING_X, l.yb, -0.15],
          w: WING_W - 0.3,
          d: EXT.d - 0.9,
          h: l.h,
          side,
          tier,
          accent: l.floor?.accent ?? "#c08a4a",
          lowDetail,
        });
        for (const sp of parts) {
          const tiered = sp.m === "wall" || sp.m === "floor" || sp.m === "lamp";
          const key = `${sp.g}|${sp.m}|${tiered ? tier : ""}`;
          let grp = byKey.get(key);
          if (!grp) byKey.set(key, (grp = { g: sp.g, m: sp.m, tier, parts: [] }));
          grp.parts.push({ p: sp.p, s: sp.s, r: sp.r, c: sp.c });
        }
      }
    });
    return [...byKey.entries()];
  }, [lv, lowDetail]);
  return (
    <group>
      {groups.map(([key, grp]) => (
        <Instanced key={key} geometry={silhouetteGeometry(grp.g)} material={silhouetteMaterial(grp.m, grp.tier)} parts={grp.parts} />
      ))}
    </group>
  );
}

const LobbyModule = memo(function LobbyModule() {
  const m = mats();
  const sign = useMemo(() => texMat(signTexture("iSETH Portfolio Tower"), 0.2), []);
  const canopyY = PLINTH + 2.95;
  const canopyZ = CORE_FRONT + 0.8;
  return (
    <group>
      {/* Entrance at the base of the elevator core */}
      <group position={[0, PLINTH, CORE_FRONT]}>
        <Box p={[0, 1.35, 0]} s={[1.9, 2.7, 0.05]} m={m.glass} />
        <Box p={[0, 1.35, 0.02]} s={[0.05, 2.7, 0.06]} m={m.steel} />
        <Box p={[-0.98, 1.35, 0.02]} s={[0.07, 2.7, 0.1]} m={m.frame} />
        <Box p={[0.98, 1.35, 0.02]} s={[0.07, 2.7, 0.1]} m={m.frame} />
        <Box p={[0, 1.3, -0.4]} s={[1.8, 2.6, 0.05]} m={m.litWhite} />
      </group>
      {/* Entrance canopy with the brand sign on its fascia (English only; Korean stays in the DOM) */}
      <RBox p={[0, canopyY, canopyZ]} size={[5.0, 0.42, 1.9]} radius={0.06} m={m.facade} cast />
      <Box p={[0, canopyY - 0.215, canopyZ]} s={[4.7, 0.01, 1.7]} m={m.woodLight} />
      {[-1.6, 0, 1.6].map((x) => (
        <Disc key={x} p={[x, canopyY - 0.222, canopyZ + 0.2]} r={[Math.PI / 2, 0, 0]} s={0.22} m={m.lamp} />
      ))}
      <mesh material={sign} geometry={G.plane} scale={[4.2, 0.34, 1]} position={[0, canopyY, canopyZ + 0.955]} />
    </group>
  );
});

const RoofModule = memo(function RoofModule({ y0, lowDetail }: { y0: number; lowDetail: boolean }) {
  const m = mats();
  const top = y0 + 0.45;
  const L = EXT.w + 0.4;
  const D = EXT.d + 0.4;
  const posts = useMemo(() => {
    const out: Part[] = [];
    const s: [number, number, number] = [0.05, 0.92, 0.05];
    for (let x = -L / 2; x <= L / 2 + 0.01; x += L / 8) out.push({ p: [x, top + 0.46, D / 2], s }, { p: [x, top + 0.46, -D / 2], s });
    for (let z = -D / 2 + D / 5; z < D / 2 - 0.01; z += D / 5) out.push({ p: [L / 2, top + 0.46, z], s }, { p: [-L / 2, top + 0.46, z], s });
    return out;
  }, [L, D, top]);
  const trees = useMemo(
    () => [
      { p: [-6.2, top, -3.2] as [number, number, number], h: 2.6 },
      { p: [5.9, top, -3.0] as [number, number, number], h: 2.8 },
      { p: [2.6, top, -2.6] as [number, number, number], h: 2.2 },
      { p: [6.0, top, 1.0] as [number, number, number], h: 2.0 },
    ],
    [top],
  );
  return (
    <group>
      <RBox p={[0, y0 + 0.225, 0]} size={[EXT.w + SLAB_OVER * 2, 0.45, EXT.d + SLAB_OVER * 2]} radius={0.08} m={m.facade} cast receive />
      <Box p={[0, top + 0.02, 0]} s={[EXT.w - 0.6, 0.04, EXT.d - 0.6]} m={m.woodLight} receive />
      {/* glass parapet with slim posts */}
      <Box p={[0, top + 0.45, D / 2]} s={[L, 0.86, 0.03]} m={m.glassRail} />
      <Box p={[0, top + 0.45, -D / 2]} s={[L, 0.86, 0.03]} m={m.glassRail} />
      <Box p={[L / 2, top + 0.45, 0]} s={[0.03, 0.86, D]} m={m.glassRail} />
      <Box p={[-L / 2, top + 0.45, 0]} s={[0.03, 0.86, D]} m={m.glassRail} />
      <Instanced geometry={G.box} material={m.steel} parts={posts} />
      {[D / 2, -D / 2].map((z) => (
        <Box key={z} p={[0, top + 0.92, z]} s={[L, 0.04, 0.06]} m={m.steel} />
      ))}
      {[L / 2, -L / 2].map((x) => (
        <Box key={x} p={[x, top + 0.92, 0]} s={[0.06, 0.04, D]} m={m.steel} />
      ))}
      {/* pergola */}
      <group position={[-4.3, top, -0.6]}>
        {[
          [-1.8, -1.9],
          [1.8, -1.9],
          [-1.8, 1.9],
          [1.8, 1.9],
        ].map(([x, z], i) => (
          <RBox key={i} p={[x, 1.2, z]} size={[0.16, 2.4, 0.16]} radius={0.03} m={m.wood} cast />
        ))}
        {[-1.9, 1.9].map((z) => (
          <RBox key={z} p={[0, 2.42, z]} size={[4.0, 0.16, 0.16]} radius={0.03} m={m.wood} cast />
        ))}
        {Array.from({ length: 8 }, (_, i) => (
          <Box key={i} p={[-1.75 + i * 0.5, 2.55, 0]} s={[0.1, 0.1, 4.2]} m={m.wood} cast />
        ))}
        {!lowDetail && Array.from({ length: 9 }, (_, i) => <Sphere key={i} p={[-1.9 + i * 0.475, 2.28, 1.9]} s={0.08} m={m.bulb} />)}
        <RBox p={[0, 0.4, 0]} size={[2.2, 0.08, 0.9]} radius={0.03} m={m.wood} />
        <Ico p={[-1.9, 2.7, 1.6]} s={[0.9, 0.5, 0.9]} m={m.leaf3} />
        <Ico p={[1.4, 2.7, -1.7]} s={[0.8, 0.45, 0.8]} m={m.leaf1} />
      </group>
      {/* planters along the front edge */}
      {[
        [-5.9, 3.3],
        [-1.9, 3.5],
        [2.9, 3.5],
        [6.1, 3.3],
      ].map(([x, z], i) => (
        <group key={i} position={[x, top, z]}>
          <RBox p={[0, 0.25, 0]} size={[1.6, 0.5, 0.8]} radius={0.06} m={m.concrete} />
          <Ico p={[0, 0.6, 0]} s={[1.4, 0.5, 0.7]} m={m.leaf2} />
          <Sphere p={[0.3, 0.8, 0.1]} s={0.12} m={m.flowerPink} />
          <Sphere p={[-0.4, 0.78, -0.1]} s={0.11} m={m.flowerYellow} />
        </group>
      ))}
      <Trees trees={trees} />
      {!lowDetail && (
        <Hedges
          at={[
            { p: [-1.0, top, -3.6], s: [3.2, 0.5, 0.5] },
            { p: [4.4, top, -3.7], s: [1.6, 0.45, 0.45] },
          ]}
        />
      )}
      {/* iSETH emblem: open book + ring */}
      <group position={[3.6, top, 0.6]}>
        <RBox p={[0, 0.35, 0]} size={[0.5, 0.7, 0.5]} radius={0.05} m={m.facade} />
        <Box p={[-0.42, 0.86, 0]} r={[0, 0, 0.32]} s={[0.85, 0.06, 0.7]} m={m.offWhite} cast />
        <Box p={[0.42, 0.86, 0]} r={[0, 0, -0.32]} s={[0.85, 0.06, 0.7]} m={m.offWhite} cast />
        <Torus p={[0, 1.55, 0]} s={0.6} m={m.wood} />
        <Sphere p={[0, 1.55, 0]} s={0.22} m={m.white} />
      </group>
    </group>
  );
});

function ElevatorCore({ height, floors }: { height: number; floors: number }) {
  const m = mats();
  const top = height + 2.3;
  const zc = (CORE_FRONT + CORE_BACK) / 2;
  const dz = CORE_FRONT - CORE_BACK;
  const y0 = EXT.lobbyH - 0.5;
  const bands = useMemo<Part[]>(
    () => Array.from({ length: floors + 1 }, (_, i) => ({ p: [0, EXT.lobbyH + i * EXT.floorH + 0.12, zc] })),
    [floors, zc],
  );
  return (
    <group>
      {/* columns */}
      {[-HC, HC].map((x) =>
        [CORE_BACK, CORE_FRONT].map((z) => <RBox key={`${x}${z}`} p={[x, top / 2, z]} size={[0.24, top, 0.24]} radius={0.05} m={m.facade} cast />),
      )}
      <Box p={[0, top / 2, CORE_BACK + 0.05]} s={[EXT.coreW - 0.2, top, 0.06]} m={m.litWhite} />
      {[-0.45, 0.45].map((x) => (
        <Box key={x} p={[x, top / 2, CORE_BACK + 0.15]} s={[0.05, top, 0.05]} m={m.steel} />
      ))}
      <Instanced geometry={roundedBox(EXT.coreW + 0.14, 0.14, dz + 0.14, 0.04)} material={m.facade} parts={bands} cast />
      <RBox p={[0, top + 0.12, zc]} size={[EXT.coreW + 0.4, 0.26, dz + 0.4]} radius={0.06} m={m.facade} cast />
      {/* the cab, waiting just above the lobby */}
      <group position={[0, EXT.lobbyH + 0.3, zc]}>
        <Box p={[0, 1.1, 0]} s={[1.5, 2.2, 1.1]} m={m.litWhite} />
        <Box p={[0, 1.1, 0.56]} s={[1.2, 2.0, 0.02]} m={m.cove} />
        <Box p={[0, 2.25, 0]} s={[1.6, 0.1, 1.2]} m={m.steel} />
        <Box p={[0, -0.05, 0]} s={[1.6, 0.1, 1.2]} m={m.steel} />
      </group>
      {/* glass skin (transparent, drawn after the opaque parts) */}
      <Box p={[0, (y0 + top) / 2, CORE_FRONT]} s={[EXT.coreW, top - y0, 0.04]} m={m.glass} />
      {[-HC, HC].map((x) => (
        <Box key={x} p={[x, (y0 + top) / 2, zc]} s={[0.04, top - y0, dz]} m={m.glass} />
      ))}
    </group>
  );
}

/** Basement levels exposed in the diorama's section cut, under the plaza. */
export const BasementSection = memo(function BasementSection({ front, lowDetail }: { front: number; lowDetail: boolean }) {
  const m = mats();
  const depth = 3.4;
  const w = EXT.w;
  return (
    <group>
      {basements.map((f, i) => {
        const yTop = -0.45 - i * EXT.basementH;
        const yBot = yTop - EXT.basementH;
        const midY = (yTop + yBot + 0.3) / 2;
        return (
          <group key={f.id}>
            <Box p={[0, yBot + 0.15, front - depth / 2]} s={[w + 0.3, 0.3, depth]} m={m.concrete} />
            <group position={[0, yBot + 0.3, front - depth / 2 - 0.1]}>
              <MiniInterior type={archetypeOf(f).mini} w={w - 0.2} d={depth - 0.3} h={EXT.basementH - 0.3} seed={f.id} lowDetail={lowDetail} />
            </group>
            <Box p={[0, midY, front - 0.12]} s={[w, EXT.basementH - 0.3, 0.03]} m={m.glass} />
            {[-w / 4, 0, w / 4].map((x) => (
              <Box key={x} p={[x, midY, front - 0.08]} s={[0.08, EXT.basementH - 0.3, 0.12]} m={m.frame} />
            ))}
          </group>
        );
      })}
    </group>
  );
});
