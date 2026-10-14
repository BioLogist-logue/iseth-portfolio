"use client";

import type { ThreeEvent } from "@react-three/fiber";
import { memo, useMemo } from "react";
import type { ZoneFrame } from "@/lib/archetypes";
import { itemsOfZone } from "@/lib/building";
import type { ZoneSlot } from "@/lib/layout";
import type { ItemStatus } from "@/lib/types";
import { useTower } from "@/store/tower";
import { ShelfBlock, Stage, TrackLights } from "../common/fixtures";
import { RBox } from "../common/instancing";
import { Label } from "../common/Label";
import { accentMat, mats } from "../common/materials";
import { Box } from "../common/primitives";
import { GlassRail, Plant, Rug, Slats } from "../common/props";
import { PortfolioObject } from "./PortfolioObject";
import { ZoneFurniture, slotsFor } from "./ZoneFurniture";

const STATUS_ORDER: ItemStatus[] = ["IDEA", "PROTOTYPE", "TESTING", "RELEASE_CANDIDATE", "RELEASED", "ARCHIVED"];

/**
 * A zone inside a floor. The archetype's `frame` decides the architecture
 * around it (panel, bookshelf alcove, gallery wall, stage, board, open bay);
 * the zone's own `sceneType` decides the furniture and where objects sit.
 * Signage, click-to-focus and object interaction are identical for every frame.
 */
export const ZoneBooth = memo(function ZoneBooth({
  slot,
  fallbackAccent,
  plants = true,
}: {
  slot: ZoneSlot;
  fallbackAccent: string;
  plants?: boolean;
}) {
  const { zone, center, width: w, depth: d, rotation, frame } = slot;
  const accent = zone.accent ?? fallbackAccent;
  const focused = useTower((s) => s.sub === "zone" && s.zoneId === zone.id);
  const signHidden = useTower((s) => s.sub === "zone" || s.sub === "elevator");
  const mobile = useTower((s) => s.mobile);

  const items = useMemo(() => {
    const list = itemsOfZone(zone.id);
    if (zone.sceneType === "dev-desk")
      list.sort((a, b) => STATUS_ORDER.indexOf(a.status ?? "RELEASED") - STATUS_ORDER.indexOf(b.status ?? "RELEASED"));
    return list;
  }, [zone.id, zone.sceneType]);
  const slots = useMemo(() => slotsFor(zone.sceneType, items.length, w, d), [zone.sceneType, items.length, w, d]);

  // Local x direction (±1) pointing toward the room centre. The booth's local
  // +x axis in world space is (cos r, 0, -sin r).
  const aisle = -center[0] * Math.cos(rotation) + center[2] * Math.sin(rotation) >= 0 ? 1 : -1;
  const b = -d / 2;
  const signX = frame === "open" ? -w * 0.31 + 0.6 : -w / 2 + 0.75;

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    if (e.delta > 6) return;
    e.stopPropagation();
    if (!focused) useTower.getState().goZone(zone.id);
  };

  return (
    <group position={center} rotation={[0, rotation, 0]}>
      <group onClick={onClick}>
        <FrameArchitecture frame={frame} w={w} d={d} accent={accent} aisle={aisle} plants={plants} seed={zone.id} order={zone.order} />
        <ZoneFurniture scene={zone.sceneType} w={w} d={d} accent={accent} seed={zone.id} slots={slots} />
      </group>

      {items.map((item, i) =>
        slots[i] ? <PortfolioObject key={item.id} item={item} slot={slots[i]} accent={accent} labelsOn={focused && !mobile} /> : null,
      )}

      <Label position={[signX, 2.85, b + 0.3]} hidden={signHidden} className="zone-sign" interactive>
        <button type="button" onClick={() => useTower.getState().goZone(zone.id)} style={{ borderColor: accent }}>
          <i style={{ background: accent }} />
          <span>
            <b>{zone.name}</b>
            {zone.nameEn && <small>{zone.nameEn}</small>}
          </span>
        </button>
      </Label>
    </group>
  );
});

/** Architecture around a zone, in booth-local space (back at z = -d/2, facing +z). */
const FrameArchitecture = memo(function FrameArchitecture({
  frame,
  w,
  d,
  accent,
  aisle,
  plants,
  seed,
  order,
}: {
  frame: ZoneFrame;
  w: number;
  d: number;
  accent: string;
  aisle: number;
  plants: boolean;
  seed: string;
  order: number;
}) {
  const m = mats();
  const b = -d / 2;
  const accentStrip = (y: number, z: number) => <Box p={[-w / 2 + 0.55, y, z]} s={[0.1, 0.42, 0.02]} m={accentMat(accent, 0.3)} />;

  switch (frame) {
    case "alcove": {
      // Wood-panelled back wall, bookshelf side walls: a curated teaching archive corner.
      const sideLen = Math.min(d - 1.0, 3.4);
      return (
        <group>
          <Rug position={[0, 0, 0.2]} w={w - 1.2} d={d - 0.9} />
          <RBox p={[0, 1.45, b + 0.09]} size={[w - 0.2, 2.9, 0.18]} radius={0.03} m={m.woodLight} receive />
          <Box p={[0, 2.93, b + 0.12]} s={[w - 0.1, 0.08, 0.26]} m={m.woodDark} />
          {accentStrip(2.62, b + 0.19)}
          {[-1, 1].map((s) => (
            <ShelfBlock key={s} position={[s * (w / 2 - 0.25), 0, b + 0.35 + sideLen / 2]} rotation={(-s * Math.PI) / 2} w={sideLen} h={2.3} seed={`${seed}-side${s}`} />
          ))}
          {plants && <Plant position={[aisle * (w / 2 - 0.7), 0, b + d - 0.5]} variant={order} tall />}
        </group>
      );
    }
    case "wall":
      // Tall gallery wall with a picture rail and track lighting; no rug on stone.
      return (
        <group>
          {/* front face at b+0.2: furniture hangs frames at b+0.28 with a clear stand-off */}
          <RBox p={[0, 1.75, b + 0.1]} size={[w - 0.2, 3.5, 0.2]} radius={0.04} m={m.plaster} receive />
          <Box p={[0, 0.07, b + 0.23]} s={[w - 0.2, 0.14, 0.06]} m={m.woodDark} />
          <Box p={[0, 3.0, b + 0.23]} s={[w - 0.3, 0.04, 0.04]} m={m.wood} />
          {accentStrip(3.25, b + 0.21)}
          <TrackLights position={[0, 4.25, b + 1.1]} w={w - 1.2} n={Math.max(3, Math.round(w / 1.8))} />
        </group>
      );
    case "niche":
      // Calm museum niche: toned recess inside a wood surround, a low ledge, soft spots.
      return (
        <group>
          <RBox p={[0, 1.75, b + 0.1]} size={[w - 0.2, 3.5, 0.2]} radius={0.04} m={m.plaster} receive />
          <Box p={[0, 1.75, b + 0.21]} s={[w - 0.9, 2.9, 0.02]} m={accentMat("#e6d6c2")} />
          {[-1, 1].map((s) => (
            <Box key={s} p={[s * (w / 2 - 0.42), 1.75, b + 0.25]} s={[0.12, 3.0, 0.1]} m={m.wood} />
          ))}
          <Box p={[0, 3.25, b + 0.25]} s={[w - 0.72, 0.12, 0.1]} m={m.wood} />
          <RBox p={[0, 0.22, b + 0.6]} size={[w - 1.0, 0.44, 0.5]} radius={0.04} m={m.woodLight} receive />
          {accentStrip(3.45, b + 0.21)}
          <TrackLights position={[0, 4.25, b + 1.0]} w={w - 2} n={3} />
        </group>
      );
    case "stage":
      // Presentation wall + low stage; the audience area stays open.
      return (
        <group>
          <RBox p={[0, 1.6, b + 0.1]} size={[w * 0.84, 3.2, 0.2]} radius={0.04} m={m.plaster} receive />
          <Box p={[0, 3.24, b + 0.12]} s={[w * 0.84 + 0.1, 0.08, 0.26]} m={m.wood} />
          {accentStrip(2.9, b + 0.21)}
          <Stage position={[0, 0, b + 1.2]} w={w * 0.8} d={2.0} />
          {plants && <Plant position={[-aisle * (w / 2 - 0.6), 0, b + 0.8]} variant={order + 1} tall />}
        </group>
      );
    case "board":
      // Wall-mounted workspace: a slim panel with a light strip; furniture adds the boards/desks.
      return (
        <group>
          <RBox p={[0, 1.45, b + 0.06]} size={[w - 0.4, 2.9, 0.12]} radius={0.03} m={m.offWhite} receive />
          <Box p={[0, 2.95, b + 0.1]} s={[w - 0.3, 0.06, 0.2]} m={m.woodDark} />
          <Box p={[0, 2.88, b + 0.16]} s={[w - 0.8, 0.03, 0.02]} m={m.cove} />
          {accentStrip(2.6, b + 0.13)}
          <Rug position={[0, 0, 0.3]} w={w - 1.4} d={d - 1.2} />
        </group>
      );
    case "open":
      // Open bay: a slim board stand behind the furniture, rug underneath.
      return (
        <group>
          <Rug position={[0, 0, 0.2]} w={w - 0.8} d={d - 0.6} />
          <RBox p={[0, 1.95, b + 0.15]} size={[w * 0.62, 2.0, 0.1]} radius={0.03} m={m.offWhite} />
          {[-1, 1].map((s) => (
            <Box key={s} p={[s * w * 0.29, 0.5, b + 0.15]} s={[0.08, 1.0, 0.08]} m={m.woodDark} />
          ))}
          {plants && <Plant position={[aisle * (w / 2 - 0.6), 0, b + d - 0.6]} variant={order} tall />}
        </group>
      );
    case "panel":
    default:
      return (
        <group>
          <Rug position={[0, 0, 0.1]} w={w - 0.6} d={d - 0.5} />
          <RBox p={[0, 1.55, b + 0.1]} size={[w - 0.4, 3.1, 0.2]} radius={0.03} m={m.white} cast receive />
          <Box p={[0, 3.12, b + 0.1]} s={[w - 0.3, 0.08, 0.26]} m={m.wood} />
          {accentStrip(2.82, b + 0.215)}
          <Slats position={[-aisle * (w / 2 - 0.15), 0, b + 0.9]} rotation={Math.PI / 2} w={1.4} h={3.1} />
          <GlassRail position={[aisle * (w / 2 - 0.1), 0, b + d * 0.62]} rotation={Math.PI / 2} length={d * 0.5} h={0.95} />
          {plants && <Plant position={[aisle * (w / 2 - 0.5), 0, b + d - 0.5]} variant={order} tall />}
        </group>
      );
  }
});
