"use client";

import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { buttonLabel, floorLabel, getFloor } from "@/lib/building";
import { CAB, ROOM_BACK_Z } from "@/lib/layout";
import { useTower } from "@/store/tower";
import { Label } from "../common/Label";
import { mats } from "../common/materials";
import { Box, Cyl, Disc, Plane } from "../common/primitives";
import { Slats } from "../common/props";

const Z0 = ROOM_BACK_Z; // door plane
const ZB = ROOM_BACK_Z - CAB.d; // cab back wall
const HW = CAB.w / 2;
const PANEL_W = 1.0;

/**
 * The single elevator cab. It lives outside the floor scenes so it persists
 * while the floor behind the closed doors is swapped.
 */
export function ElevatorCab() {
  const m = mats();
  const left = useRef<THREE.Mesh>(null);
  const right = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.PointLight>(null);
  const open = useRef(0);

  useFrame((_, dt) => {
    const s = useTower.getState();
    const target = s.doorsOpen ? 1 : 0;
    const dur = s.reducedMotion ? 0.3 : target ? 0.85 : 0.75;
    const step = Math.min(dt, 0.05) / dur;
    open.current = target > open.current ? Math.min(1, open.current + step) : Math.max(0, open.current - step);
    const e = open.current < 0.5 ? 2 * open.current * open.current : 1 - Math.pow(-2 * open.current + 2, 2) / 2;
    const off = PANEL_W / 2 + e * (PANEL_W - 0.04);
    if (left.current) left.current.position.x = -off;
    if (right.current) right.current.position.x = off;

    const inCab = s.sub === "elevator";
    if (light.current) light.current.intensity = THREE.MathUtils.damp(light.current.intensity, inCab ? 6 : 0, 6, dt);
    // No camera shake while travelling: so close to the doors, even a 1 cm
    // jitter reads as the doors themselves wobbling. The hum and the floor
    // indicator carry the sense of motion.
  });

  const enter = (e: ThreeEvent<MouseEvent>) => {
    if (e.delta > 6) return;
    e.stopPropagation();
    const s = useTower.getState();
    if (s.sub !== "elevator") void s.enterElevator();
  };

  return (
    <group>
      {/* Door panels (shared by hall and cab) */}
      <group onClick={enter} onPointerOver={() => (document.body.style.cursor = "pointer")} onPointerOut={() => (document.body.style.cursor = "")}>
        <mesh ref={left} geometry={GEO_PANEL} material={m.steel} position={[-PANEL_W / 2, CAB.doorH / 2, Z0 - 0.14]} />
        <mesh ref={right} geometry={GEO_PANEL} material={m.steel} position={[PANEL_W / 2, CAB.doorH / 2, Z0 - 0.14]} />
        {/* jambs */}
        {[-1, 1].map((s) => (
          <Box key={s} p={[s * (HW - 0.12), CAB.h / 2, Z0 - 0.15]} s={[0.24, CAB.h, 0.3]} m={m.steel} />
        ))}
        <Box p={[0, CAB.doorH + (CAB.h - CAB.doorH) / 2, Z0 - 0.15]} s={[CAB.w, CAB.h - CAB.doorH, 0.3]} m={m.steel} />
      </group>
      <HallIndicator />

      {/* Cab interior: inward-facing planes */}
      <Box p={[0, -0.02, (Z0 + ZB) / 2 - 0.15]} s={[CAB.w, 0.04, CAB.d]} m={m.woodLight} />
      <Plane p={[0, CAB.h / 2, ZB]} s={[CAB.w, CAB.h, 1]} m={m.offWhite} />
      <Slats position={[0, 0, ZB + 0.05]} w={1.3} h={CAB.h} />
      <Plane p={[-HW, CAB.h / 2, (Z0 + ZB) / 2 - 0.15]} r={[0, Math.PI / 2, 0]} s={[CAB.d, CAB.h, 1]} m={m.offWhite} />
      <Plane p={[HW, CAB.h / 2, (Z0 + ZB) / 2 - 0.15]} r={[0, -Math.PI / 2, 0]} s={[CAB.d, CAB.h, 1]} m={m.offWhite} />
      {[-1, 1].map((s) => (
        <group key={s}>
          <Slats position={[s * (HW - 0.05), 0, ZB + 0.35]} rotation={Math.PI / 2} w={0.5} h={CAB.h} />
          <Cyl p={[s * (HW - 0.08), 0.95, (Z0 + ZB) / 2 - 0.2]} r={[Math.PI / 2, 0, 0]} s={[0.05, CAB.d - 0.6, 0.05]} m={m.steel} />
        </group>
      ))}
      {/* directory panel (left) + button panel (right) — readable versions live in the 2D UI */}
      <Plane p={[HW - 0.02, 1.55, (Z0 + ZB) / 2 - 0.25]} r={[0, -Math.PI / 2, 0]} s={[1.3, 1.6, 1]} m={m.lamp} />
      <Box p={[-HW + 0.03, 1.3, Z0 - 0.5]} s={[0.04, 1.1, 0.32]} m={m.steel} />
      {Array.from({ length: 6 }, (_, i) => (
        <Disc key={i} p={[-HW + 0.06, 0.9 + i * 0.15, Z0 - 0.5]} r={[0, Math.PI / 2, 0]} s={0.06} m={m.bulb} />
      ))}
      <Plane p={[0, CAB.h - 0.01, (Z0 + ZB) / 2 - 0.15]} r={[Math.PI / 2, 0, 0]} s={[CAB.w, CAB.d, 1]} m={m.ceiling} />
      <Plane p={[0, CAB.h - 0.02, (Z0 + ZB) / 2 - 0.15]} r={[Math.PI / 2, 0, 0]} s={[CAB.w - 0.6, CAB.d - 0.6, 1]} m={m.lamp} />
      <pointLight ref={light} position={[0, CAB.h - 0.4, (Z0 + ZB) / 2]} intensity={0} distance={5} color="#ffd9a6" />
    </group>
  );
}

const GEO_PANEL = new THREE.BoxGeometry(PANEL_W, CAB.doorH, 0.05);

/** Floor indicator above the hall doors (DOM text, so labels stay crisp). */
function HallIndicator() {
  const display = useTower((s) => s.elevator.displayFloorId);
  const inCab = useTower((s) => s.sub === "elevator");
  const floor = getFloor(display);
  if (!floor) return null;
  return (
    <Label position={[0, CAB.h + 0.42, Z0 + 0.1]} hidden={inCab} className="scene-indicator">
      {floorLabel(floor)}
      <span className="sr-only">{buttonLabel(floor)}</span>
    </Label>
  );
}
