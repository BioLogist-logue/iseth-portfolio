"use client";

import { memo, useMemo } from "react";
import { EXT, baseDepth } from "@/lib/layout";
import { basements } from "@/lib/building";
import { mats } from "../common/materials";
import { G, Box } from "../common/primitives";
import { Instanced, RBox, type Part } from "../common/instancing";
import { Bench } from "../common/props";
import { Bushes, Hedges, Trees, type TreeSpec } from "../common/vegetation";
import { floorMaterial } from "../common/surfaces";

const X0 = -18;
const X1 = 18;
const Z0 = -13;

/** Floating diorama base: plaza on top, earth body, basement section cut at the front. */
export const Island = memo(function Island({ lowDetail }: { lowDetail: boolean }) {
  const m = mats();
  const F = EXT.plazaFront;
  const depth = baseDepth();
  const secW = EXT.w / 2 + 0.3;
  const secD = 3.6;
  const secBottom = -0.45 - basements.length * EXT.basementH;
  const tiles = floorMaterial("plaza", undefined, [(X1 - X0) / 2.2, (F - Z0) / 2.2]);

  const earthBlock = (x0: number, x1: number, z0: number, z1: number, y0: number, y1: number, key: string) => (
    <Box key={key} p={[(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2]} s={[x1 - x0, y1 - y0, z1 - z0]} m={m.earth} receive />
  );

  return (
    <group>
      {/* earth body with an opening for the basement section */}
      {earthBlock(X0, -secW, Z0, F, -depth, -0.02, "l")}
      {earthBlock(secW, X1, Z0, F, -depth, -0.02, "r")}
      {earthBlock(-secW, secW, Z0, F - secD, -depth, -0.02, "c")}
      {earthBlock(-secW, secW, F - secD, F, -depth, secBottom, "b")}
      {/* strata band */}
      <Box p={[0, -depth + 0.35, F + 0.01]} s={[X1 - X0, 0.7, 0.02]} m={m.earthDark} />
      <Box p={[X1 + 0.01, -depth + 0.35, (Z0 + F) / 2]} s={[0.02, 0.7, F - Z0]} m={m.earthDark} />
      {/* structural slab above the basement section + frame columns */}
      <Box p={[0, -0.24, F - secD / 2]} s={[secW * 2, 0.44, secD]} m={m.concrete} />
      {[-secW, secW].map((x) => (
        <RBox key={x} p={[x, (secBottom - 0.02) / 2, F - 0.2]} size={[0.4, -secBottom, 0.4]} radius={0.05} m={m.facade} />
      ))}
      <RBox p={[0, secBottom - 0.15, F - 0.2]} size={[secW * 2 + 0.4, 0.3, 0.4]} radius={0.05} m={m.facade} />

      {/* plaza surface */}
      <mesh position={[0, 0.0, (Z0 + F) / 2]} rotation={[-Math.PI / 2, 0, 0]} material={tiles} receiveShadow geometry={G.plane} scale={[X1 - X0, F - Z0, 1]} />
      <Box p={[0, -0.075, F - 0.04]} s={[X1 - X0, 0.12, 0.08]} m={m.white} />

      {/* lawns (soft-edged) */}
      {LAWNS.map(([x, z, w, d], i) => (
        <RBox key={i} p={[x, 0.06, z]} size={[w, 0.12, d]} radius={0.05} m={m.grass} receive />
      ))}
      <Landscaping lowDetail={lowDetail} />
    </group>
  );
});

const LAWNS: [number, number, number, number][] = [
  [-14, -5, 7, 15],
  [14, -5, 7, 15],
  [0, -10.5, 22, 4],
  [-14.2, 8.8, 6.6, 4.2],
  [14.2, 8.8, 6.6, 4.2],
];

/** Bollard positions (also used for the night glow). */
export const BOLLARDS: [number, number, number][] = [
  [-2.9, 0, 9.3],
  [2.9, 0, 9.3],
  [-8.6, 0, 9.3],
  [8.6, 0, 9.3],
  [-11, 0, 9.3],
  [11, 0, 9.3],
  [-9.3, 0, -1],
  [9.3, 0, -1],
  [-9.3, 0, 2.8],
  [9.3, 0, 2.8],
];

const PERIMETER_TREES: TreeSpec[] = [
  { p: [-15.5, 0.12, 9.5], h: 3.6 },
  { p: [15.6, 0.12, 9.2], h: 3.4 },
  { p: [-14.5, 0.12, -2], h: 4.2 },
  { p: [14.6, 0.12, -3], h: 4.0 },
  { p: [-15, 0.12, -10], h: 3.6 },
  { p: [15, 0.12, -9.6], h: 3.8 },
  { p: [-9.5, 0.12, -10.6], h: 3.2 },
  { p: [9.8, 0.12, -10.8], h: 3.4 },
  { p: [-11.6, 0.12, 6.5], h: 2.8 },
  { p: [11.8, 0.12, 6.2], h: 2.9 },
  { p: [-16.2, 0.12, 3.4], h: 3.1 },
  { p: [16.0, 0.12, 2.2], h: 3.3 },
];

const Landscaping = memo(function Landscaping({ lowDetail }: { lowDetail: boolean }) {
  const m = mats();
  const HD = EXT.d / 2;
  const plinthFront = HD + 1.6;
  const F = EXT.plazaFront;
  const walkZ0 = plinthFront + 0.9;

  const trees = useMemo<TreeSpec[]>(() => {
    const planterTrees: TreeSpec[] = [-1, 1].flatMap((s) => [
      { p: [s * 7.3, 0.55, 8.1] as [number, number, number], h: 3.3 },
      { p: [s * 4.1, 0.55, 8.2] as [number, number, number], h: 2.6 },
    ]);
    return [...planterTrees, ...PERIMETER_TREES.slice(0, lowDetail ? 7 : PERIMETER_TREES.length)];
  }, [lowDetail]);

  const bushes = useMemo(() => {
    const out: { p: [number, number, number]; s: number }[] = [];
    // planter fill
    for (const s of [-1, 1])
      for (let k = 0; k < 5; k++) out.push({ p: [s * (3.6 + k * 0.95), 0.55, 7.7 + (k % 2) * 0.55], s: 0.55 + (k % 3) * 0.08 });
    // lawn edges + plinth corners
    const pts: [number, number, number][] = [
      [-12.6, 0.12, 2.6], [-12.0, 0.12, 4.1], [12.4, 0.12, 2.4], [12.0, 0.12, 4.2],
      [-8.9, 0, -5.9], [8.9, 0, -5.9], [-8.9, 0, 6.0], [8.9, 0, 6.0],
      [-16.4, 0.12, 7.2], [16.2, 0.12, 7.4], [-12.8, 0.12, 9.8], [12.9, 0.12, 9.9],
      [-15.6, 0.12, -6.4], [15.4, 0.12, -7.0], [-5, 0.12, -10.4], [5.4, 0.12, -10.2],
    ];
    pts.slice(0, lowDetail ? 8 : pts.length).forEach((p, i) => out.push({ p, s: 0.7 + (i % 3) * 0.15 }));
    return out;
  }, [lowDetail]);

  const hedges = useMemo(() => {
    const h: { p: [number, number, number]; s: [number, number, number] }[] = [
      // low hedge along the plaza front edge, open at the central walk
      { p: [-10.0, 0, F - 0.5], s: [13.5, 0.42, 0.5] },
      { p: [10.0, 0, F - 0.5], s: [13.5, 0.42, 0.5] },
      // planter borders
      { p: [-5.6, 0.55, 8.95], s: [5.0, 0.3, 0.3] },
      { p: [5.6, 0.55, 8.95], s: [5.0, 0.3, 0.3] },
    ];
    if (!lowDetail) {
      // along the plinth flanks
      h.push({ p: [-9.0, 0, 0.2], s: [0.5, 0.5, 9.5] }, { p: [9.0, 0, 0.2], s: [0.5, 0.5, 9.5] });
    }
    return h;
  }, [F, lowDetail]);

  const bollards = useMemo(() => {
    const posts: Part[] = BOLLARDS.map((p) => ({ p: [p[0], 0.3, p[2]], s: [0.12, 0.6, 0.12] }));
    const caps: Part[] = BOLLARDS.map((p) => ({ p: [p[0], 0.63, p[2]], s: [0.14, 0.07, 0.14] }));
    return { posts, caps };
  }, []);

  return (
    <group>
      {/* building plinth + entrance steps */}
      <RBox p={[0, 0.15, 0.2]} size={[EXT.w + 2.6, 0.3, plinthFront * 2 - 0.4]} radius={0.05} m={m.stone} cast receive />
      {[0, 1].map((i) => (
        <RBox key={i} p={[0, 0.1 - i * 0.05, plinthFront + 0.2 + i * 0.4]} size={[5.4 - i * 0.2, 0.2 - i * 0.1, 0.42]} radius={0.03} m={m.stone} receive />
      ))}
      {/* entrance walk: lighter paving framed by thin bands */}
      <Box p={[0, 0.012, (walkZ0 + F) / 2]} s={[4.6, 0.02, F - walkZ0]} m={m.stone} receive />
      {[-2.38, 2.38].map((x) => (
        <Box key={x} p={[x, 0.016, (walkZ0 + F) / 2]} s={[0.14, 0.024, F - walkZ0]} m={m.reveal} />
      ))}
      {/* raised planters + benches */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <RBox p={[s * 5.6, 0.275, 8.2]} size={[5.2, 0.55, 1.8]} radius={0.06} m={m.concrete} cast receive />
          <Box p={[s * 5.6, 0.553, 8.2]} s={[5.0, 0.02, 1.6]} m={m.soil} />
          <Bench position={[s * 5.2, 0, 9.95]} length={2.2} />
        </group>
      ))}
      <Trees trees={trees} />
      <Bushes at={bushes} />
      <Hedges at={hedges} />
      <Instanced geometry={G.cyl} material={m.dark} parts={bollards.posts} />
      <Instanced geometry={G.cyl} material={m.bulb} parts={bollards.caps} />
    </group>
  );
});
