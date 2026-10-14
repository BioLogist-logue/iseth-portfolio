"use client";

import * as THREE from "three";
import type { ThreeElements } from "@react-three/fiber";

/** Shared unit geometries — scaled per mesh instead of re-allocated. */
export const G = {
  box: new THREE.BoxGeometry(1, 1, 1),
  cyl: new THREE.CylinderGeometry(0.5, 0.5, 1, 20),
  cylLow: new THREE.CylinderGeometry(0.5, 0.5, 1, 10),
  cone: new THREE.ConeGeometry(0.5, 1, 10),
  potTaper: new THREE.CylinderGeometry(0.5, 0.38, 1, 16),
  sphere: new THREE.SphereGeometry(0.5, 16, 12),
  ico: new THREE.IcosahedronGeometry(0.5, 1),
  plane: new THREE.PlaneGeometry(1, 1),
  circle: new THREE.CircleGeometry(0.5, 24),
  torus: new THREE.TorusGeometry(0.5, 0.06, 10, 32),
};

type V3 = [number, number, number];
type MeshProps = Omit<ThreeElements["mesh"], "position" | "scale" | "rotation"> & {
  p?: V3;
  s?: V3 | number;
  r?: V3;
  m: THREE.Material;
  cast?: boolean;
  receive?: boolean;
};

function make(geo: THREE.BufferGeometry) {
  return function Prim({ p, s, r, m, cast, receive, ...rest }: MeshProps) {
    return (
      <mesh
        geometry={geo}
        material={m}
        position={p}
        scale={s}
        rotation={r}
        castShadow={cast}
        receiveShadow={receive}
        {...rest}
      />
    );
  };
}

export const Box = make(G.box);
export const Cyl = make(G.cyl);
export const CylLow = make(G.cylLow);
export const Cone = make(G.cone);
export const Sphere = make(G.sphere);
export const Ico = make(G.ico);
export const Plane = make(G.plane);
export const Disc = make(G.circle);
export const Torus = make(G.torus);
export const PotTaper = make(G.potTaper);
