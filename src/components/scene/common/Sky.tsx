"use client";

import { Stars } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { memo, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { skyGradientTexture } from "./textures";

type Theme = "light" | "dark";

export const SKY = {
  light: { top: "#5f9fe6", mid: "#a9d1f3", bottom: "#f7e6cc", fog: "#d9e6ef" },
  dark: { top: "#060c24", mid: "#13214f", bottom: "#33365e", fog: "#1b2246" },
};

export function SkyDome({ theme }: { theme: Theme }) {
  const c = SKY[theme];
  const mat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: skyGradientTexture(c.top, c.mid, c.bottom),
        side: THREE.BackSide,
        fog: false,
        depthWrite: false,
      }),
    [c.top, c.mid, c.bottom],
  );
  return (
    <mesh material={mat} renderOrder={-1}>
      <sphereGeometry args={[260, 32, 16]} />
    </mesh>
  );
}

/** Fluffy low-poly clouds, drifting slowly (disabled for reduced motion). */
export const Clouds = memo(function Clouds({ animate }: { animate: boolean }) {
  const group = useRef<THREE.Group>(null);
  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#ffffff", emissive: "#ffffff", emissiveIntensity: 0.35, roughness: 1, flatShading: true }),
    [],
  );
  const geo = useMemo(() => new THREE.IcosahedronGeometry(1, 1), []);
  const clouds = useMemo(() => {
    const out: { pos: [number, number, number]; puffs: [number, number, number, number][] }[] = [];
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 1.4 - Math.PI * 0.95;
      const r = 120 + (i % 3) * 25;
      const puffs: [number, number, number, number][] = [];
      for (let k = 0; k < 5; k++) puffs.push([(k - 2) * 4.2, Math.sin(k * 1.7) * 1.4, Math.cos(k * 2.3) * 2, 3.2 + ((k * 7) % 4)]);
      out.push({ pos: [Math.sin(a) * r, 34 + (i % 4) * 9, Math.cos(a) * r * -1], puffs });
    }
    return out;
  }, []);
  useFrame((_, dt) => {
    if (animate && group.current) group.current.rotation.y += dt * 0.004;
  });
  return (
    <group ref={group}>
      {clouds.map((c, i) => (
        <group key={i} position={c.pos} scale={[1.4, 0.8, 1]}>
          {c.puffs.map(([x, y, z, s], k) => (
            <mesh key={k} geometry={geo} material={mat} position={[x, y, z]} scale={s} />
          ))}
        </group>
      ))}
    </group>
  );
});

/** Distant hills with a scattering of small buildings, like the reference backdrop. */
export const Backdrop = memo(function Backdrop({ theme, lowDetail }: { theme: Theme; lowDetail: boolean }) {
  const night = theme === "dark";
  const hillMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: night ? "#1d2a3e" : "#8fae84", roughness: 1, flatShading: true }),
    [night],
  );
  const hillGeo = useMemo(() => new THREE.IcosahedronGeometry(1, 2), []);
  const hills = useMemo(() => {
    const out: { p: [number, number, number]; s: [number, number, number] }[] = [];
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      const r = 215 + ((i * 37) % 30);
      out.push({ p: [Math.sin(a) * r, -62, Math.cos(a) * r], s: [70 + ((i * 13) % 30), 48 + ((i * 7) % 20), 45] });
    }
    return out;
  }, []);

  const houses = useRef<THREE.InstancedMesh>(null);
  const lights = useRef<THREE.InstancedMesh>(null);
  const count = lowDetail ? 120 : 260;
  useLayoutEffect(() => {
    const mesh = houses.current;
    const lm = lights.current;
    if (!mesh) return;
    const o = new THREE.Object3D();
    const col = new THREE.Color();
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < count; i++) {
      const a = rnd() * Math.PI * 2;
      const r = 105 + rnd() * 80;
      const x = Math.sin(a) * r;
      const z = Math.cos(a) * r;
      const h = 1.2 + rnd() * 3;
      o.position.set(x, -34 + rnd() * 5 + h / 2, z);
      o.scale.set(1.6 + rnd() * 2.4, h, 1.6 + rnd() * 2.4);
      o.rotation.y = rnd() * Math.PI;
      o.updateMatrix();
      mesh.setMatrixAt(i, o.matrix);
      col.set(night ? "#2c3550" : rnd() > 0.5 ? "#f2ece2" : "#e8d6c2");
      mesh.setColorAt(i, col);
      if (lm) {
        o.position.y += h / 2 + 0.2;
        o.scale.set(0.6, 0.6, 0.6);
        o.updateMatrix();
        lm.setMatrixAt(i, o.matrix);
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    if (lm) lm.instanceMatrix.needsUpdate = true;
  }, [count, night]);

  return (
    <group>
      {hills.map((h, i) => (
        <mesh key={i} geometry={hillGeo} material={hillMat} position={h.p} scale={h.s} />
      ))}
      <instancedMesh ref={houses} args={[undefined, undefined, count]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={1} />
      </instancedMesh>
      {night && (
        <instancedMesh ref={lights} args={[undefined, undefined, count]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#ffc777" />
        </instancedMesh>
      )}
    </group>
  );
});

export function NightStars({ animate }: { animate: boolean }) {
  const ref = useRef<THREE.Points>(null);
  useLayoutEffect(() => {
    // Keep stars out of the scene fog.
    const m = ref.current?.material as THREE.ShaderMaterial | undefined;
    if (m) m.fog = false;
  }, []);
  return <Stars ref={ref} radius={160} depth={50} count={2600} factor={6} saturation={0} fade speed={animate ? 0.4 : 0} />;
}
