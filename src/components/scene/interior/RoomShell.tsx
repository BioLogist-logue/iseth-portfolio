"use client";

import { memo } from "react";
import * as THREE from "three";
import { CAB, ROOM, ROOM_BACK_Z, ROOM_FRONT_Z } from "@/lib/layout";
import { mats } from "../common/materials";
import { Box, Disc, Plane } from "../common/primitives";
import { Slats } from "../common/props";
import { floorMaterial } from "../common/surfaces";
import type { TemplateStyle } from "./templates";

const HW = ROOM.w / 2;
const T = 0.3; // wall thickness
const DOOR_HALF = CAB.w / 2;
const SLAB_GAP = 0.04;
const FLOOR_GEO = new THREE.PlaneGeometry(ROOM.w, ROOM.d);

/**
 * Diorama room. Back/side walls are solid boxes; the front wall and ceiling
 * are single-sided planes facing inward, so they vanish automatically when
 * the camera is outside (overview) and appear when standing inside.
 */
export const RoomShell = memo(function RoomShell({ style }: { style: TemplateStyle }) {
  const m = mats();
  const floorMat = floorMaterial(style.floor, style.carpet);

  const H = ROOM.h;
  const sideZ0 = ROOM_BACK_Z - T;
  const sideLen = ROOM.d + T;

  return (
    <group>
      {/* Visible floor plane at y=0. The structural slab sits clearly below it
          (top at -SLAB_GAP) so the two surfaces are never coplanar. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} geometry={FLOOR_GEO} material={floorMat} receiveShadow />
      <Box p={[0, -SLAB_GAP - 0.2, 0]} s={[ROOM.w + 2 * T, 0.4, ROOM.d + 2 * T]} m={m.white} />

      {/* back wall with elevator doorway */}
      <Box p={[-(HW + DOOR_HALF) / 2 - T / 2, H / 2, ROOM_BACK_Z - T / 2]} s={[HW - DOOR_HALF + T, H, T]} m={m.plaster} receive />
      <Box p={[(HW + DOOR_HALF) / 2 + T / 2, H / 2, ROOM_BACK_Z - T / 2]} s={[HW - DOOR_HALF + T, H, T]} m={m.plaster} receive />
      <Box p={[0, (H + CAB.h) / 2, ROOM_BACK_Z - T / 2]} s={[DOOR_HALF * 2, H - CAB.h, T]} m={m.plaster} />
      {/* cove light along the top of the back wall */}
      <Box p={[0, H - 0.1, ROOM_BACK_Z + 0.04]} s={[ROOM.w - 0.4, 0.06, 0.06]} m={m.cove} />

      {/* side walls */}
      {[-1, 1].map((side) =>
        style.windows ? (
          <WindowWall key={side} side={side} />
        ) : (
          <group key={side}>
            <Box p={[side * (HW + T / 2), H / 2, sideZ0 + sideLen / 2]} s={[T, H, sideLen]} m={m.plaster} receive />
            {[-6, 0, 6].map((z) => (
              <Slats key={z} position={[side * (HW - 0.05), 0, z]} rotation={(side * Math.PI) / 2} w={2.2} h={H - 0.3} />
            ))}
          </group>
        ),
      )}

      {/* front wall: inward-facing planes only (culled from outside) */}
      <FrontWall windows={style.windows} />

      {/* ceiling: faces down, invisible from above */}
      <Plane p={[0, H, 0]} r={[Math.PI / 2, 0, 0]} s={[ROOM.w, ROOM.d, 1]} m={m.ceiling} />
      {Array.from({ length: 4 }, (_, i) =>
        Array.from({ length: 3 }, (_, j) => (
          <Disc key={`${i}${j}`} p={[-9 + i * 6, H - 0.01, -6 + j * 6]} r={[Math.PI / 2, 0, 0]} s={0.34} m={m.lamp} />
        )),
      )}

      {/* elevator surround on the hall side */}
      <group position={[0, 0, ROOM_BACK_Z + 0.02]}>
        <Slats position={[-(DOOR_HALF + 0.75), 0, 0.04]} w={1.3} h={H - 0.3} />
        <Slats position={[DOOR_HALF + 0.75, 0, 0.04]} w={1.3} h={H - 0.3} />
        <Box p={[-(DOOR_HALF + 0.06), CAB.h / 2 + 0.1, 0.06]} s={[0.05, CAB.h + 0.2, 0.05]} m={m.cove} />
        <Box p={[DOOR_HALF + 0.06, CAB.h / 2 + 0.1, 0.06]} s={[0.05, CAB.h + 0.2, 0.05]} m={m.cove} />
        <Box p={[0, CAB.h + 0.08, 0.06]} s={[CAB.w + 0.2, 0.08, 0.05]} m={m.steel} />
        <Box p={[0, CAB.h + 0.42, 0.05]} s={[0.9, 0.36, 0.05]} m={m.dark} />
        {/* call button */}
        <Box p={[DOOR_HALF + 0.35, 1.2, 0.05]} s={[0.14, 0.32, 0.03]} m={m.steel} />
        <Disc p={[DOOR_HALF + 0.35, 1.25, 0.07]} s={0.07} m={m.bulb} />
        <Box p={[0, 0.036, 0.6]} s={[CAB.w + 0.4, 0.02, 1.0]} m={m.rug} />
      </group>
    </group>
  );
});

function WindowWall({ side }: { side: number }) {
  const m = mats();
  const H = ROOM.h;
  const x = side * (HW + T / 2);
  const z0 = ROOM_BACK_Z - T;
  const z1 = ROOM_FRONT_Z;
  const n = 4;
  const pier = 1.4;
  const win = (z1 - z0 - pier * (n + 1)) / n;
  const sill = 0.55;
  const head = 3.75;
  const parts: React.ReactNode[] = [];
  for (let i = 0; i <= n; i++) {
    const zc = z0 + pier / 2 + i * (pier + win);
    parts.push(<Box key={`p${i}`} p={[x, H / 2, zc]} s={[T, H, pier]} m={m.plaster} receive />);
    parts.push(<Box key={`w${i}`} p={[x - side * 0.17, (H - 0.3) / 2, zc]} s={[0.06, H - 0.3, pier * 0.55]} m={m.wood} />);
  }
  for (let i = 0; i < n; i++) {
    const zc = z0 + pier + win / 2 + i * (pier + win);
    parts.push(<Box key={`s${i}`} p={[x, sill / 2, zc]} s={[T, sill, win]} m={m.plaster} />);
    parts.push(<Box key={`h${i}`} p={[x, (H + head) / 2, zc]} s={[T, H - head, win]} m={m.plaster} />);
    parts.push(<Box key={`g${i}`} p={[x, (sill + head) / 2, zc]} s={[0.03, head - sill, win]} m={m.glass} />);
    parts.push(<Box key={`m${i}`} p={[x - side * 0.02, (sill + head) / 2, zc]} s={[0.05, head - sill, 0.06]} m={m.white} />);
  }
  return <group>{parts}</group>;
}

function FrontWall({ windows }: { windows: boolean }) {
  const m = mats();
  const H = ROOM.h;
  const z = ROOM_FRONT_Z;
  // Planes face −z (into the room): rotate 180° about Y.
  const r: [number, number, number] = [0, Math.PI, 0];
  if (!windows) return <Plane p={[0, H / 2, z]} r={r} s={[ROOM.w, H, 1]} m={m.plaster} />;
  const n = 6;
  const bay = ROOM.w / n;
  return (
    <group>
      <Plane p={[0, 0.3, z]} r={r} s={[ROOM.w, 0.6, 1]} m={m.plaster} />
      <Plane p={[0, H - 0.4, z]} r={r} s={[ROOM.w, 0.8, 1]} m={m.plaster} />
      {Array.from({ length: n + 1 }, (_, i) => (
        <Plane key={i} p={[-ROOM.w / 2 + i * bay, H / 2, z - 0.01]} r={r} s={[0.16, H, 1]} m={m.white} />
      ))}
      <Plane p={[0, H / 2, z + 0.01]} r={r} s={[ROOM.w, H - 1.4, 1]} m={m.glass} />
    </group>
  );
}
