"use client";

import { useEffect, useMemo } from "react";
import { floorLabel, itemsOfFloor } from "@/lib/building";
import { CAB, GARDEN_STANDS, ROOM, ROOM_BACK_Z } from "@/lib/layout";
import type { Floor } from "@/lib/types";
import { useTower } from "@/store/tower";
import { Label } from "../common/Label";
import { mats } from "../common/materials";
import { G, Box, Cyl, Disc, Ico, Sphere } from "../common/primitives";
import { Bench, Bush, GlassRail, Planter, Plant, Slats, Table, Tree } from "../common/props";
import { RBox } from "../common/instancing";
import { accentMat } from "../common/materials";
import { floorMaterial } from "../common/surfaces";
import { Bushes, Hedges, Trees, type TreeSpec } from "../common/vegetation";
import { PortfolioObject } from "./PortfolioObject";

const HW = ROOM.w / 2;
const HD = ROOM.d / 2;

/**
 * Rooftop garden: free-form, no booths. Items sit on small stands scattered
 * along the path, around a pergola and a greenhouse.
 */
export default function GardenScene({ floor }: { floor: Floor }) {
  const m = mats();
  const markReady = useTower((s) => s.markReady);
  const zoneFocused = useTower((s) => s.sub === "zone" || s.sub === "overview");
  const mobile = useTower((s) => s.mobile);
  useEffect(() => markReady(floor.id), [floor.id, markReady]);
  const items = useMemo(() => itemsOfFloor(floor.id), [floor.id]);
  const deck = floorMaterial("mid", undefined, [4, 3]);
  const stones = useMemo(() => {
    const out: [number, number][] = [];
    for (let i = 0; i < 18; i++) {
      const t = i / 17;
      out.push([Math.sin(t * Math.PI * 1.6) * 3.2, ROOM_BACK_Z + 1.6 + t * (ROOM.d - 3)]);
    }
    return out;
  }, []);

  return (
    <group>
      {/* roof slab + lawn + deck */}
      <Box p={[0, -0.3, 0]} s={[ROOM.w + 0.8, 0.6, ROOM.d + 0.8]} m={m.white} receive />
      <Box p={[0, 0.0, 0]} s={[ROOM.w, 0.04, ROOM.d]} m={m.grass} receive />
      <mesh position={[-HW / 2 - 0.5, 0.03, -HD / 2]} rotation={[-Math.PI / 2, 0, 0]} material={deck} receiveShadow geometry={G.plane} scale={[11, 8, 1]} />
      {stones.map(([x, z], i) => (
        <Cyl key={i} p={[x, 0.04, z]} s={[0.9, 0.05, 0.75]} m={m.stone} receive />
      ))}
      {/* parapet */}
      <GlassRail position={[0, 0, HD]} length={ROOM.w} />
      <GlassRail position={[-HW, 0, 0]} rotation={Math.PI / 2} length={ROOM.d} />
      <GlassRail position={[HW, 0, 0]} rotation={Math.PI / 2} length={ROOM.d} />

      <ElevatorHouse floor={floor} />

      {/* pergola pavilion */}
      <group position={[-8.2, 0, -5.2]}>
        {[
          [-2.2, -1.8],
          [2.2, -1.8],
          [-2.2, 1.8],
          [2.2, 1.8],
        ].map(([x, z], i) => (
          <Box key={i} p={[x, 1.4, z]} s={[0.18, 2.8, 0.18]} m={m.wood} cast />
        ))}
        {[-1.8, 1.8].map((z) => (
          <Box key={z} p={[0, 2.85, z]} s={[4.8, 0.18, 0.18]} m={m.wood} cast />
        ))}
        {Array.from({ length: 10 }, (_, i) => (
          <Box key={i} p={[-2.25 + i * 0.5, 3.0, 0]} s={[0.1, 0.1, 4.1]} m={m.wood} cast />
        ))}
        {Array.from({ length: 11 }, (_, i) => (
          <Sphere key={i} p={[-2.3 + i * 0.46, 2.7 - Math.sin((i / 10) * Math.PI) * 0.25, 1.8]} s={0.09} m={m.bulb} />
        ))}
        <Ico p={[-2.2, 3.1, 1.6]} s={[1.2, 0.5, 1.0]} m={m.leaf3} />
        <Ico p={[1.8, 3.1, -1.6]} s={[1.0, 0.45, 1.0]} m={m.leaf1} />
        <Table position={[0, 0, 0]} w={2} d={1} h={0.74} />
        <Bench position={[0, 0, -1.1]} length={2} />
        <Bench position={[0, 0, 1.1]} length={2} />
      </group>

      {/* greenhouse */}
      <group position={[8.4, 0, -5.4]}>
        <Box p={[0, 1.2, 0]} s={[4.4, 2.4, 3.4]} m={m.glass} />
        {[
          [-2.2, -1.7],
          [2.2, -1.7],
          [-2.2, 1.7],
          [2.2, 1.7],
        ].map(([x, z], i) => (
          <Box key={i} p={[x, 1.2, z]} s={[0.08, 2.4, 0.08]} m={m.white} />
        ))}
        {[-1, 1].map((s) => (
          <Box key={s} p={[0, 2.85, s * 0.85]} r={[s * 0.55, 0, 0]} s={[4.5, 0.04, 1.95]} m={m.glass} />
        ))}
        <Box p={[0, 3.32, 0]} s={[4.5, 0.08, 0.08]} m={m.white} />
        <Box p={[0, 0.45, -0.9]} s={[3.6, 0.9, 0.9]} m={m.wood} />
        {[-1.2, 0, 1.2].map((x, i) => (
          <Plant key={x} position={[x, 0.9, -0.9]} variant={i} scale={0.8} />
        ))}
        <Plant position={[1.4, 0, 0.9]} variant={1} tall />
      </group>

      {/* planting */}
      <Planter position={[-9.5, 0, 2.6]} w={3.2} d={1.4} />
      <Planter position={[9.8, 0, 7.6]} w={3.6} d={1.4} />
      <Planter position={[-1.5, 0, 8.6]} w={3.2} d={1.2} />
      <Planter position={[4.4, 0, -1.4]} w={2.4} d={1.2} />
      {[
        [-11.5, -8.4, 3.0],
        [11.6, 0.8, 3.2],
        [-5.6, 8.6, 2.6],
        [11.2, -9.0, 2.8],
      ].map(([x, z, h], i) => (
        <Tree key={i} position={[x, 0, z]} height={h} variant={i} />
      ))}
      {[
        [-6.8, -1.2],
        [6.8, 4.8],
        [-11.6, 5.4],
        [1.2, -6.6],
        [-0.6, 4.6],
      ].map(([x, z], i) => (
        <Bush key={i} position={[x, 0, z]} rotation={i} />
      ))}
      <Bench position={[0.5, 0, 6.2]} length={2.2} rotation={Math.PI} />
      <Bench position={[-6.4, 0, 4.8]} length={2} rotation={Math.PI / 2} />

      <GardenPlanting accent={floor.accent} lowDetail={mobile} />

      {/* item stands */}
      {items.map((item, i) => {
        const st = GARDEN_STANDS[i % GARDEN_STANDS.length];
        const lap = Math.floor(i / GARDEN_STANDS.length);
        const pos: [number, number, number] = [st.pos[0] + lap * 0.9, 0, st.pos[2] + lap * 0.9];
        return (
          <group key={item.id}>
            <group position={pos} rotation={[0, st.rot, 0]}>
              <Box p={[0, 0.45, 0]} s={[0.7, 0.9, 0.7]} m={m.wood} cast receive />
              <Box p={[0, 0.91, 0]} s={[0.78, 0.04, 0.78]} m={m.white} />
              <Disc p={[0, 0.05, 0]} r={[-Math.PI / 2, 0, 0]} s={1.4} m={m.stone} />
            </group>
            <PortfolioObject
              item={item}
              slot={{ pos: [pos[0], 0.93, pos[2]], rot: st.rot }}
              accent={floor.accent}
              labelsOn={zoneFocused && !mobile}
            />
          </group>
        );
      })}
    </group>
  );
}

/** Small elevator house on the roof, aligned with the shaft. */
function ElevatorHouse({ floor }: { floor: Floor }) {
  const m = mats();
  const hw = CAB.w / 2;
  const H = 3.6;
  const z = ROOM_BACK_Z;
  const inCab = useTower((s) => s.sub === "elevator");
  return (
    <group>
      <Box p={[-(hw + 0.7), H / 2, z - 1.25]} s={[1.4, H, 2.8]} m={m.white} cast />
      <Box p={[hw + 0.7, H / 2, z - 1.25]} s={[1.4, H, 2.8]} m={m.white} cast />
      <Box p={[0, (H + CAB.h) / 2, z - 0.15]} s={[CAB.w, H - CAB.h, 0.3]} m={m.white} />
      <Box p={[0, H / 2, z - CAB.d - 0.15]} s={[CAB.w + 2.8, H, 0.3]} m={m.white} />
      <Box p={[0, H + 0.12, z - 1.25]} s={[CAB.w + 3.2, 0.24, 3.2]} m={m.wood} cast />
      <Slats position={[-(hw + 0.7), 0, z + 0.17]} w={1.2} h={H - 0.2} />
      <Slats position={[hw + 0.7, 0, z + 0.17]} w={1.2} h={H - 0.2} />
      <Box p={[0, CAB.h + 0.42, z + 0.02]} s={[0.9, 0.36, 0.05]} m={m.dark} />
      <Label position={[-3.6, 2.6, z + 0.4]} hidden={inCab} className="floor-sign">
        <b>{floorLabel(floor)}</b>
        <span>{floor.name}</span>
      </Label>
    </group>
  );
}

// ── Planting polish (instanced; one draw call per vegetation type) ──────────
const EDGE_HEDGES: { p: [number, number, number]; s: [number, number, number] }[] = [
  // along the front parapet, open where the path arrives
  { p: [-9.3, 0.02, HD - 0.45], s: [6.0, 0.55, 0.55] },
  { p: [6.6, 0.02, HD - 0.45], s: [11.4, 0.55, 0.55] },
  // along the side parapets
  { p: [-HW + 0.45, 0.02, 0.2], s: [0.55, 0.6, 11.5] },
  { p: [HW - 0.45, 0.02, 2.0], s: [0.55, 0.6, 8.0] },
  // flanking the elevator house
  { p: [-4.6, 0.02, -8.7], s: [2.4, 0.5, 0.5] },
  { p: [4.6, 0.02, -8.7], s: [2.4, 0.5, 0.5] },
];

const CLUSTERS: { p: [number, number, number]; s: number }[] = [
  // corners
  { p: [-12.0, 0.02, 9.0], s: 0.85 },
  { p: [-11.2, 0.02, 9.3], s: 0.6 },
  { p: [12.0, 0.02, 9.0], s: 0.85 },
  { p: [11.3, 0.02, 9.3], s: 0.6 },
  { p: [12.0, 0.02, -9.2], s: 0.8 },
  { p: [-12.0, 0.02, -9.2], s: 0.8 },
  // around the item stands
  { p: [-3.3, 0.02, -4.2], s: 0.6 },
  { p: [5.5, 0.02, -4.8], s: 0.65 },
  { p: [-9.4, 0.02, 1.0], s: 0.6 },
  { p: [3.1, 0.02, 3.3], s: 0.55 },
  { p: [10.0, 0.02, 3.5], s: 0.6 },
  { p: [-2.5, 0.02, 7.3], s: 0.6 },
  { p: [6.9, 0.02, 8.0], s: 0.55 },
  // round bed
  { p: [-4.6, 0.32, 2.4], s: 0.75 },
  { p: [-4.1, 0.32, 2.0], s: 0.5 },
  { p: [-5.1, 0.32, 2.1], s: 0.5 },
];

const EXTRA_TREES: TreeSpec[] = [
  { p: [-12.0, 0, 4.0], h: 2.4 },
  { p: [12.1, 0, 5.4], h: 2.6 },
  { p: [-6.8, 0, -8.9], h: 2.2 },
  { p: [3.4, 0, -8.9], h: 2.3 },
];

function GardenPlanting({ accent, lowDetail }: { accent: string; lowDetail: boolean }) {
  const m = mats();
  const clusters = useMemo(() => (lowDetail ? CLUSTERS.filter((_, i) => i % 2 === 0) : CLUSTERS), [lowDetail]);
  return (
    <group>
      <Hedges at={EDGE_HEDGES} />
      <Bushes at={clusters} flowerRate={0.7} />
      <Trees trees={EXTRA_TREES} />
      {/* round flower bed */}
      <RBox p={[-4.6, 0.16, 2.2]} size={[2.2, 0.32, 1.6]} radius={0.12} m={m.concrete} receive />
      <Box p={[-4.6, 0.33, 2.2]} s={[2.0, 0.02, 1.4]} m={m.soil} />
      {/* seating nook */}
      <Cyl p={[9.4, 0.42, 5.2]} s={[0.9, 0.05, 0.9]} m={m.wood} cast />
      <Cyl p={[9.4, 0.2, 5.2]} s={[0.12, 0.4, 0.12]} m={m.woodDark} />
      <Bench position={[9.4, 0, 6.2]} length={1.6} rotation={Math.PI} />
      <Bench position={[8.2, 0, 5.2]} length={1.4} rotation={Math.PI / 2} />
      {/* slim display boards near the elevator */}
      {[
        [2.6, -7.2, -0.3],
        [-2.6, -6.6, 0.3],
      ].map(([x, z, r], i) => (
        <group key={i} position={[x, 0, z]} rotation={[0, r, 0]}>
          <Box p={[-0.42, 0.6, 0]} s={[0.06, 1.2, 0.06]} m={m.woodDark} />
          <Box p={[0.42, 0.6, 0]} s={[0.06, 1.2, 0.06]} m={m.woodDark} />
          <RBox p={[0, 1.15, 0]} size={[1.0, 0.7, 0.05]} radius={0.02} m={m.offWhite} cast />
          <Box p={[0, 1.42, 0.03]} s={[0.8, 0.06, 0.01]} m={accentMat(accent, 0.3)} />
        </group>
      ))}
    </group>
  );
}
