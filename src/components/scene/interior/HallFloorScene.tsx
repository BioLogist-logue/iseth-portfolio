"use client";

import { useEffect, useMemo } from "react";
import { archetypeOf, type Archetype } from "@/lib/archetypes";
import { floorLabel } from "@/lib/building";
import { ROOM, ROOM_BACK_Z, layoutZones } from "@/lib/layout";
import type { Floor } from "@/lib/types";
import { useTower } from "@/store/tower";
import { Label } from "../common/Label";
import { accentMat, mats } from "../common/materials";
import { Box } from "../common/primitives";
import { PendantLamp, Plant, Rug } from "../common/props";
import { HallDecor } from "./HallDecor";
import { RoomShell } from "./RoomShell";
import { ZoneBooth } from "./ZoneBooth";

/**
 * Hall floor template. The floor's archetype supplies the room finish, the
 * curated zone layout + frames, and the central-hall architecture; zones and
 * items come from data. Every hall floor shares the same arrival point,
 * directory sign and navigation model.
 */
export default function HallFloorScene({ floor }: { floor: Floor }) {
  const arch = archetypeOf(floor);
  const slots = useMemo(() => layoutZones(floor.id), [floor.id]);
  const markReady = useTower((s) => s.markReady);
  useEffect(() => markReady(floor.id), [floor.id, markReady]);
  const decor = { density: floor.decor?.density ?? "medium", plants: floor.decor?.plants ?? true } as const;

  return (
    <group>
      <RoomShell style={arch.style} />
      <CentralHall floor={floor} arch={arch} plants={decor.plants} />
      <HallDecor kind={arch.hall.decor} seed={floor.id} accent={floor.accent} density={decor.density} plants={decor.plants} />
      {slots.map((s) => (
        <ZoneBooth key={s.zone.id} slot={s} fallbackAccent={floor.accent} plants={decor.plants} />
      ))}
    </group>
  );
}

/** Shared arrival hall: directory sign on the centre line, optional runner, elevator plants. */
function CentralHall({ floor, arch, plants }: { floor: Floor; arch: Archetype; plants: boolean }) {
  const m = mats();
  const { signZ, rug } = arch.hall;
  const signHidden = useTower((s) => s.sub === "elevator" || s.sub === "zone");
  return (
    <group>
      {rug === "aisle" && <Rug w={4.2} d={ROOM.d - 3} color="cream" />}
      {rug === "center" && <Rug position={[0, 0, 1.6]} w={8.6} d={9.4} color="cream" />}
      {/* floor directory sign (text in the DOM) */}
      <group position={[0, 0, signZ]}>
        <Box p={[0, 1.05, 0]} s={[1.7, 2.1, 0.22]} m={m.white} cast />
        <Box p={[-0.76, 1.05, 0]} s={[0.18, 2.1, 0.26]} m={m.wood} />
        <Box p={[0, 1.05, -0.12]} s={[1.5, 1.9, 0.02]} m={m.wood} />
        <Box p={[0, 0.06, 0]} s={[1.9, 0.12, 0.5]} m={m.wood} />
        <Box p={[0.1, 1.9, 0.12]} s={[1.2, 0.06, 0.02]} m={accentMat(floor.accent, 0.4)} />
        {plants && <Plant position={[1.5, 0, 0.1]} variant={1} tall />}
      </group>
      <Label position={[0, 2.55, signZ + 0.2]} hidden={signHidden} className="floor-sign">
        <b>{floorLabel(floor)}</b>
        <span>{floor.name}</span>
      </Label>
      {plants &&
        [-2.9, 2.9].map((x) => <Plant key={x} position={[x, 0, ROOM_BACK_Z + 0.9]} variant={x > 0 ? 0 : 2} tall />)}
      {/* aisle pendants for the classic two-column layout; other archetypes light their own hall */}
      {arch.light.pendants && rug === "aisle" && [0.5, 7].map((z) => <PendantLamp key={z} position={[0, ROOM.h, z]} drop={0.9} />)}
    </group>
  );
}
