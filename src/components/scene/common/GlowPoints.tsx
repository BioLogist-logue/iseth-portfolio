"use client";

import { useMemo } from "react";
import * as THREE from "three";

let glowTex: THREE.Texture | null = null;
function glowTexture() {
  if (glowTex) return glowTex;
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.25, "rgba(255,255,255,0.55)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  glowTex = new THREE.CanvasTexture(c);
  return glowTex;
}

/**
 * Soft additive halos around night lights (bollards, downlights, string
 * lights). One Points draw call — a cheap stand-in for bloom.
 */
export function GlowPoints({
  points,
  color = "#ffc37a",
  size = 1.2,
  opacity = 0.7,
}: {
  points: [number, number, number][];
  color?: string;
  size?: number;
  opacity?: number;
}) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(points.flat(), 3));
    return g;
  }, [points]);
  const mat = useMemo(
    () =>
      new THREE.PointsMaterial({
        map: glowTexture(),
        color,
        size,
        sizeAttenuation: true,
        transparent: true,
        opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        fog: false,
      }),
    [color, size, opacity],
  );
  return <points geometry={geo} material={mat} renderOrder={2} />;
}
