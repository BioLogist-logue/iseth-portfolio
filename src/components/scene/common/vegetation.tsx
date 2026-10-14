"use client";

import { memo, useMemo } from "react";
import * as THREE from "three";
import { Instanced, roundedBox, type Part, type V3 } from "./instancing";
import { mats } from "./materials";
import { G } from "./primitives";

/**
 * Instanced landscaping. Every tree on the plaza shares three draw calls
 * (trunk + two crown layers); colour variety comes from instance colours.
 */

const LEAF_TONES = ["#6fa45a", "#5d9750", "#7fb35f", "#8dbf62", "#679d55"];
const FLOWER_TONES = ["#f2a7b8", "#fbf6ee", "#f4cf5d", "#e8b0d0", "#f6c89a"];

let foliageMat: THREE.MeshStandardMaterial | null = null;
let flowerMat: THREE.MeshStandardMaterial | null = null;
const foliage = () => (foliageMat ??= new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.92, flatShading: true }));
const flowers = () => (flowerMat ??= new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.85 }));

function hash(n: number) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export interface TreeSpec {
  p: V3;
  h: number;
}

export const Trees = memo(function Trees({ trees, cast = true }: { trees: TreeSpec[]; cast?: boolean }) {
  const m = mats();
  const parts = useMemo(() => {
    const trunk: Part[] = [];
    const crownA: Part[] = [];
    const crownB: Part[] = [];
    trees.forEach(({ p: [x, y, z], h }, i) => {
      const k = hash(i + x * 3.1 + z * 1.7);
      trunk.push({ p: [x, y + h * 0.33, z], s: [0.15 + h * 0.02, h * 0.66, 0.15 + h * 0.02] });
      crownA.push({ p: [x, y + h * 0.76, z], s: [h * 0.56, h * 0.46, h * 0.56], r: k * 6, c: LEAF_TONES[i % LEAF_TONES.length] });
      crownB.push({
        p: [x + (k - 0.5) * h * 0.3, y + h * 0.95, z + (hash(i + 9) - 0.5) * h * 0.3],
        s: h * (0.32 + k * 0.1),
        r: k * 3,
        c: LEAF_TONES[(i + 2) % LEAF_TONES.length],
      });
    });
    return { trunk, crownA, crownB };
  }, [trees]);
  return (
    <>
      <Instanced geometry={G.cylLow} material={m.trunk} parts={parts.trunk} cast={cast} />
      <Instanced geometry={G.ico} material={foliage()} parts={parts.crownA} cast={cast} />
      <Instanced geometry={G.ico} material={foliage()} parts={parts.crownB} cast={cast} />
    </>
  );
});

/** Soft round shrubs with a sprinkle of flowers on top. */
export const Bushes = memo(function Bushes({ at, flowerRate = 0.6 }: { at: { p: V3; s: number }[]; flowerRate?: number }) {
  const parts = useMemo(() => {
    const leaves: Part[] = [];
    const blooms: Part[] = [];
    at.forEach(({ p: [x, y, z], s }, i) => {
      leaves.push({ p: [x, y + s * 0.32, z], s: [s, s * 0.68, s], r: i, c: LEAF_TONES[(i * 3) % LEAF_TONES.length] });
      if (hash(i) < flowerRate) {
        for (let k = 0; k < 3; k++) {
          const a = hash(i * 7 + k) * Math.PI * 2;
          blooms.push({
            p: [x + Math.cos(a) * s * 0.3, y + s * 0.62 + hash(k + i) * 0.06, z + Math.sin(a) * s * 0.3],
            s: 0.085,
            c: FLOWER_TONES[(i + k) % FLOWER_TONES.length],
          });
        }
      }
    });
    return { leaves, blooms };
  }, [at, flowerRate]);
  return (
    <>
      <Instanced geometry={G.ico} material={foliage()} parts={parts.leaves} cast />
      <Instanced geometry={G.sphere} material={flowers()} parts={parts.blooms} />
    </>
  );
});

const HEDGE_GEO = roundedBox(1, 1, 1, 0.22, 3);

/** Clipped hedges: scaled rounded boxes, one draw call. */
export const Hedges = memo(function Hedges({ at }: { at: { p: V3; s: V3; r?: number }[] }) {
  const m = mats();
  const parts = useMemo(() => at.map((h) => ({ p: [h.p[0], h.p[1] + h.s[1] / 2, h.p[2]] as V3, s: h.s, r: h.r })), [at]);
  return <Instanced geometry={HEDGE_GEO} material={m.hedge} parts={parts} cast receive />;
});
