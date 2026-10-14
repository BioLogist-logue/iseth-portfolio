"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

/**
 * Instancing + softened-edge geometry helpers for repeated architecture and
 * landscaping. One draw call per (geometry, material) group instead of one
 * per element.
 */

export type V3 = [number, number, number];

export interface Part {
  p: V3;
  s?: V3 | number;
  /** Yaw in radians, or full Euler. */
  r?: number | V3;
  /** Optional per-instance colour (multiplies the material colour). */
  c?: string;
}

const tmp = new THREE.Object3D();
const col = new THREE.Color();

export function Instanced({
  geometry,
  material,
  parts,
  cast = false,
  receive = false,
}: {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  parts: Part[];
  cast?: boolean;
  receive?: boolean;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const hasColor = useMemo(() => parts.some((x) => x.c), [parts]);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    parts.forEach((x, i) => {
      tmp.position.set(...x.p);
      if (typeof x.r === "number") tmp.rotation.set(0, x.r, 0);
      else if (x.r) tmp.rotation.set(...x.r);
      else tmp.rotation.set(0, 0, 0);
      if (x.s === undefined) tmp.scale.set(1, 1, 1);
      else if (typeof x.s === "number") tmp.scale.setScalar(x.s);
      else tmp.scale.set(...x.s);
      tmp.updateMatrix();
      mesh.setMatrixAt(i, tmp.matrix);
      if (hasColor) mesh.setColorAt(i, col.set(x.c ?? "#ffffff"));
    });
    mesh.count = parts.length;
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [parts, hasColor]);
  if (!parts.length) return null;
  return (
    <instancedMesh
      // Re-create when the instance count changes (buffer is sized at construction).
      key={parts.length}
      ref={ref}
      args={[geometry, material, parts.length]}
      castShadow={cast}
      receiveShadow={receive}
    />
  );
}

const roundedCache = new Map<string, THREE.BufferGeometry>();

/**
 * Box with softly rounded edges, cached by size. Use the real size (not a
 * scaled unit box) so the bevel radius stays even on every edge.
 */
export function roundedBox(w: number, h: number, d: number, radius = 0.04, segments = 2) {
  const key = `${w.toFixed(3)}|${h.toFixed(3)}|${d.toFixed(3)}|${radius}|${segments}`;
  let g = roundedCache.get(key);
  if (!g) {
    const r = Math.min(radius, w / 2 - 0.001, h / 2 - 0.001, d / 2 - 0.001);
    g = new RoundedBoxGeometry(w, h, d, segments, Math.max(0.001, r));
    roundedCache.set(key, g);
  }
  return g;
}

/** Single rounded box mesh. */
export function RBox({
  p,
  size,
  radius = 0.04,
  m,
  r,
  cast,
  receive,
}: {
  p: V3;
  size: V3;
  radius?: number;
  m: THREE.Material;
  r?: V3;
  cast?: boolean;
  receive?: boolean;
}) {
  return <mesh geometry={roundedBox(size[0], size[1], size[2], radius)} material={m} position={p} rotation={r} castShadow={cast} receiveShadow={receive} />;
}
