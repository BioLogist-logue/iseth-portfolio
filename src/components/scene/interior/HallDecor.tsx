"use client";

import { memo } from "react";
import type { HallDecorKind } from "@/lib/archetypes";
import { ROOM, ROOM_BACK_Z } from "@/lib/layout";
import { DocumentStand, MediaKiosk, PartitionWall, ShelfBlock, TrackLights, WallBoard } from "../common/fixtures";
import { RBox } from "../common/instancing";
import { accentMat, mats } from "../common/materials";
import { Box, Cyl, Sphere, Torus } from "../common/primitives";
import { Bench, Chair, Display, Frame, Monitor, PendantLamp, Plant, Pouf, Stool, Table } from "../common/props";

type V3 = [number, number, number];
type Density = "low" | "medium" | "high";

/**
 * Central-hall architecture per archetype. Each composition is laid out to
 * clear its archetype's zone placements (lib/archetypes.ts), the elevator
 * vestibule and the centre line used by the arrival camera and the sign.
 */
export const HallDecor = memo(function HallDecor({
  kind,
  seed,
  accent,
  density = "medium",
  plants = true,
}: {
  kind: HallDecorKind;
  seed: string;
  accent: string;
  density?: Density;
  plants?: boolean;
}) {
  switch (kind) {
    case "library":
      return <LibraryHall seed={seed} accent={accent} density={density} plants={plants} />;
    case "classroom":
      return <MediaPlaza seed={seed} plants={plants} />;
    case "conference":
      return <SeminarHall seed={seed} accent={accent} plants={plants} />;
    case "gallery":
      return <GalleryHall seed={seed} />;
    case "operations":
      return <OperationsHall seed={seed} accent={accent} />;
    case "archive":
      return <ArchiveHall seed={seed} accent={accent} density={density} />;
    case "museum":
      return <MuseumHall seed={seed} accent={accent} />;
    case "homeroom":
      return <HomeroomHall accent={accent} plants={plants} />;
    case "lab":
      return <LabHall />;
    default:
      return null;
  }
});

/** Reading table with chairs on both long sides and a desk lamp. */
function ReadingTable({ position, w = 3, lamp = true, seed }: { position: V3; w?: number; lamp?: boolean; seed: string }) {
  const m = mats();
  const n = Math.max(2, Math.round(w / 1.1));
  return (
    <group position={position}>
      <Table w={w} d={1.1} h={0.75} />
      {Array.from({ length: n }, (_, i) => {
        const x = -w / 2 + ((i + 0.5) * w) / n;
        return (
          <group key={i}>
            <Chair position={[x, 0, -0.85]} />
            <Chair position={[x, 0, 0.85]} rotation={Math.PI} />
          </group>
        );
      })}
      {lamp && (
        <group position={[w / 2 - 0.45, 0.78, 0]}>
          <CylBase />
          <Cyl p={[0, 0.42, 0]} s={[0.32, 0.14, 0.32]} m={accentMat("#4a7a5a")} />
          <Cyl p={[0, 0.34, 0]} s={[0.2, 0.02, 0.2]} m={m.lamp} />
        </group>
      )}
      {/* folders / open notebooks */}
      <Box p={[-w / 2 + 0.6, 0.8, -0.15]} s={[0.36, 0.06, 0.28]} m={accentMat(seed.length % 2 ? "#3f7fd6" : "#c96a5a")} />
      <Box p={[-w / 2 + 0.62, 0.86, -0.13]} s={[0.34, 0.05, 0.26]} m={m.offWhite} />
      <Box p={[0.1, 0.785, 0.2]} r={[0, 0.2, 0]} s={[0.5, 0.01, 0.36]} m={m.flowerWhite} />
    </group>
  );
}

function CylBase() {
  const m = mats();
  return <Cyl p={[0, 0.17, 0]} s={[0.04, 0.34, 0.04]} m={m.woodDark} />;
}

// ── 2F Library: warm reading hall between the bookshelf alcoves ────────────
function LibraryHall({ seed, accent, density, plants }: { seed: string; accent: string; density: Density; plants: boolean }) {
  return (
    <group>
      <ReadingTable position={[-3.3, 0, 0.4]} seed={seed} />
      <ReadingTable position={[3.3, 0, 0.4]} seed={`${seed}b`} />
      {[-3.3, 3.3].map((x) => (
        <PendantLamp key={x} position={[x, ROOM.h, 0.4]} drop={1.4} />
      ))}
      {/* teaching-material displays + a digital reading station */}
      <DocumentStand position={[-1.5, 0, 3.6]} seed={`${seed}-doc1`} />
      <DocumentStand position={[1.5, 0, 3.6]} seed={`${seed}-doc2`} />
      {density !== "low" && <MediaKiosk position={[-4.6, 0, 4.4]} rotation={0.4} seed={`${seed}-reader`} />}
      {/* low shelves framing the front of the hall */}
      <ShelfBlock position={[-4.4, 0, 8.7]} w={3} h={1.1} seed={`${seed}-low1`} />
      <ShelfBlock position={[4.4, 0, 8.7]} w={3} h={1.1} seed={`${seed}-low2`} />
      {density === "high" && <ShelfBlock position={[4.6, 0, 4.4]} rotation={-0.4} w={2.2} h={1.4} seed={`${seed}-low3`} />}
      <Box p={[0, 3.62, ROOM_BACK_Z + 0.06]} s={[4.6, 0.04, 0.02]} m={accentMat(accent, 0.35)} />
      {plants && <Plant position={[4.6, 0, 6.2]} variant={2} tall />}
    </group>
  );
}

// ── 3F Smart classroom: media plaza between the two classroom wings ─────────
function MediaPlaza({ seed, plants }: { seed: string; plants: boolean }) {
  const m = mats();
  const digital = accentMat("#9fd3f0", 0.6); // cooler digital accent
  return (
    <group>
      {/* collaboration table with tablets */}
      <Cyl p={[0, 0.74, 1.2]} s={[2.4, 0.06, 2.4]} m={m.white} cast receive />
      <Cyl p={[0, 0.37, 1.2]} s={[0.3, 0.74, 0.3]} m={m.steel} />
      {Array.from({ length: 5 }, (_, i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <group key={i}>
            <Stool position={[Math.sin(a) * 1.65, 0, 1.2 + Math.cos(a) * 1.65]} />
            <Box p={[Math.sin(a) * 0.75, 0.78, 1.2 + Math.cos(a) * 0.75]} r={[0, a, 0]} s={[0.36, 0.02, 0.26]} m={m.screen} />
          </group>
        );
      })}
      {/* media-analysis stations */}
      <MediaKiosk position={[-2.8, 0, 4.6]} rotation={0.45} seed={`${seed}-m1`} />
      <MediaKiosk position={[2.8, 0, 4.6]} rotation={-0.45} seed={`${seed}-m2`} />
      {/* digital boards in the back corners + a cool light line */}
      {[-7.6, 7.6].map((x, i) => (
        <Display key={x} position={[x, 2.3, ROOM_BACK_Z + 0.08]} w={3.8} h={1.9} seed={`${seed}-wall${i}`} kind={i ? "chart" : "screen"} />
      ))}
      <Box p={[0, 3.9, ROOM_BACK_Z + 0.05]} s={[ROOM.w - 1, 0.03, 0.02]} m={digital} />
      {plants && [-3.6, 3.6].map((x) => <Plant key={x} position={[x, 0, 8.6]} variant={x > 0 ? 1 : 0} tall />)}
    </group>
  );
}

// ── 5F Conference: material stands, breakout tables, side display ──────────
function SeminarHall({ seed, accent, plants }: { seed: string; accent: string; plants: boolean }) {
  return (
    <group>
      {/* lecture material stands in the free bay beside the materials wall */}
      {[-10.0, -7.6, -5.2].map((x, i) => (
        <DocumentStand key={x} position={[x, 0, -1.6]} seed={`${seed}-lec${i}`} />
      ))}
      {/* workshop breakout: round tables with stools */}
      {(
        [
          [6.0, 4.6],
          [9.8, 6.6],
        ] as const
      ).map(([x, z], t) => (
        <group key={t} position={[x, 0, z]}>
          <Cyl p={[0, 0.74, 0]} s={[1.4, 0.05, 1.4]} m={mats().wood} cast />
          <Cyl p={[0, 0.37, 0]} s={[0.14, 0.74, 0.14]} m={mats().woodDark} />
          {[0, 1, 2, 3].map((k) => (
            <Stool key={k} position={[Math.sin((k * Math.PI) / 2 + 0.6) * 1.05, 0, Math.cos((k * Math.PI) / 2 + 0.6) * 1.05]} />
          ))}
        </group>
      ))}
      <WallBoard position={[ROOM.w / 2 - 0.08, 1.9, 5.4]} rotation={-Math.PI / 2} w={3.2} h={1.6} kind="screen" seed={`${seed}-side`} />
      <WallBoard position={[ROOM.w / 2 - 0.08, 1.9, 1.6]} rotation={-Math.PI / 2} w={2.0} h={1.4} kind="cork" accent={accent} />
      {plants && <Plant position={[3.4, 0, 8.8]} variant={2} tall />}
    </group>
  );
}

// ── 6F Gallery: freestanding partitions, bench, a single pedestal ──────────
function GalleryHall({ seed }: { seed: string }) {
  const m = mats();
  return (
    <group>
      <PartitionWall position={[5.4, 0, 1.0]} rotation={-0.3} w={3.6} h={3.0} art={[`${seed}-p1a`, `${seed}-p1b`]} />
      <PartitionWall position={[8.8, 0, 5.8]} rotation={0.25} w={3.2} h={2.8} art={[`${seed}-p2a`, `${seed}-p2b`]} />
      <TrackLights position={[5.4, 4.25, 2.1]} rotation={-0.3} w={3.2} n={3} />
      <TrackLights position={[8.8, 4.25, 6.8]} rotation={0.25} w={2.8} n={3} />
      {/* bench facing the timeline wall */}
      <Bench position={[-4.2, 0, 2.2]} length={2.4} rotation={Math.PI / 2} />
      {/* a single quiet pedestal piece (not a trophy) */}
      <group position={[3.4, 0, -2.8]}>
        <RBox p={[0, 0.55, 0]} size={[0.7, 1.1, 0.7]} radius={0.04} m={m.white} cast />
        <Torus p={[0, 1.45, 0]} r={[0, 0.6, 0]} s={0.55} m={m.wood} />
        <Sphere p={[0, 1.45, 0]} s={0.18} m={m.offWhite} />
      </group>
    </group>
  );
}

// ── B1 Operations: ops island, process maps, storage, document station ─────
function OperationsHall({ seed, accent }: { seed: string; accent: string }) {
  const m = mats();
  return (
    <group>
      <group position={[0, 0, 0.8]}>
        <Table w={3.6} d={1.4} h={0.76} top="white" />
        {[-1.1, 0, 1.1].map((x, i) => (
          <Monitor key={x} position={[x, 0.79, -0.25]} seed={`${seed}-ops${i}`} />
        ))}
        {[-1.1, 0, 1.1].map((x) => (
          <Chair key={x} position={[x, 0, 0.95]} rotation={Math.PI} />
        ))}
      </group>
      {[-7.6, 7.6].map((x, i) => (
        <WallBoard key={x} position={[x, 2.1, ROOM_BACK_Z + 0.06]} w={4.2} h={1.6} kind="process" accent={accent} seed={`${seed}-proc${i}`} />
      ))}
      {[-11.2, 11.2].map((x, i) => (
        <ShelfBlock key={x} position={[x, 0, ROOM_BACK_Z + 0.6]} w={2.4} h={2.0} seed={`${seed}-store${i}`} />
      ))}
      {/* standing document station */}
      <group position={[0, 0, 4.4]}>
        <RBox p={[0, 0.52, 0]} size={[1.6, 1.04, 0.7]} radius={0.04} m={m.offWhite} />
        <Box p={[-0.3, 1.08, 0]} s={[0.4, 0.08, 0.3]} m={accentMat(accent)} />
        <Box p={[0.3, 1.07, 0.05]} s={[0.4, 0.05, 0.3]} m={m.flowerWhite} />
      </group>
      <Pouf position={[3.4, 0, 6.8]} color={2} />
    </group>
  );
}

// ── B2 Archive: shelving stacks, reading desk, before/after stand ──────────
function ArchiveHall({ seed, accent, density }: { seed: string; accent: string; density: Density }) {
  const m = mats();
  const xs = density === "low" ? [5.6, 8.4] : [5.4, 7.8, 10.2];
  return (
    <group>
      {xs.flatMap((x) =>
        [-1, 1].map((s) => (
          <ShelfBlock key={`${s}${x}`} position={[s * x, 0, 4.4]} rotation={Math.PI / 2} w={4.6} h={2.2} d={0.5} double seed={`${seed}-stack${x}`} />
        )),
      )}
      <group position={[0, 0, 1.2]}>
        <Table w={2.0} d={0.9} h={0.75} />
        <Chair position={[0, 0, 0.7]} rotation={Math.PI} />
        <Cyl p={[0.7, 0.95, -0.2]} s={[0.04, 0.34, 0.04]} m={m.woodDark} />
        <Cyl p={[0.7, 1.18, -0.2]} s={[0.3, 0.14, 0.3]} m={accentMat("#4a7a5a")} />
        <Cyl p={[0.7, 1.1, -0.2]} s={[0.18, 0.02, 0.18]} m={m.lamp} />
        <Box p={[-0.5, 0.8, -0.1]} s={[0.36, 0.08, 0.28]} m={accentMat(accent)} />
        <Box p={[0.0, 0.785, 0.15]} r={[0, -0.15, 0]} s={[0.5, 0.01, 0.36]} m={m.flowerWhite} />
      </group>
      {/* before / after display */}
      <group position={[-2.4, 0, 4.4]} rotation={[0, 0.25, 0]}>
        {[-0.48, 0.48].map((x, i) => (
          <Frame key={x} position={[x, 1.35, 0]} w={0.82} h={0.62} seed={`${seed}-ba${i}`} />
        ))}
        <Box p={[0, 0.65, -0.05]} s={[0.06, 1.3, 0.06]} m={m.woodDark} />
        <Box p={[0, 0.03, -0.05]} s={[0.7, 0.06, 0.4]} m={m.woodDark} />
      </group>
      <PendantLamp position={[0, ROOM.h, 1.2]} drop={1.6} />
    </group>
  );
}

// ── B3 Museum: central exhibit, statement panels, calm seating ─────────────
function MuseumHall({ seed, accent }: { seed: string; accent: string }) {
  const m = mats();
  return (
    <group>
      <group position={[0, 0, 0.6]}>
        <Cyl p={[0, 0.3, 0]} s={[3.0, 0.6, 3.0]} m={m.white} cast receive />
        <Cyl p={[0, 0.62, 0]} s={[2.6, 0.04, 2.6]} m={m.woodLight} />
        <Torus p={[0, 1.7, 0]} r={[0, 0.5, 0]} s={1.5} m={m.wood} />
        <Torus p={[0, 1.7, 0]} r={[Math.PI / 2, 0, 0.6]} s={1.2} m={accentMat(accent, 0.25)} />
        <Sphere p={[0, 1.7, 0]} s={0.42} m={m.bulb} />
        {[0, 1, 2, 3].map((i) => {
          const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
          return <Cyl key={i} p={[Math.sin(a) * 2.6, 0.45, Math.cos(a) * 2.6]} s={[0.08, 0.9, 0.08]} m={m.steel} />;
        })}
      </group>
      {/* freestanding statement panels (text lives in the DOM, not on the panel) */}
      {(
        [
          [5.4, 3.2, -0.5],
          [7.8, 6.6, -0.3],
          [4.6, -2.4, -0.15],
        ] as const
      ).map(([x, z, r], i) => (
        <group key={i} position={[x, 0, z]} rotation={[0, r, 0]}>
          <RBox p={[0, 1.2, 0]} size={[1.3, 2.4, 0.12]} radius={0.03} m={m.plaster} cast />
          <Box p={[0, 2.1, 0.065]} s={[0.7, 0.04, 0.01]} m={accentMat(accent, 0.3)} />
          <Frame position={[0, 1.35, 0.08]} w={0.8} h={0.9} seed={`${seed}-st${i}`} />
        </group>
      ))}
      {/* framed statements on the right wall, between the wall slats */}
      {[-3, 3].map((z, i) => (
        <Frame key={z} position={[ROOM.w / 2 - 0.08, 1.9, z]} rotation={-Math.PI / 2} w={1.0} h={1.2} seed={`${seed}-wall${i}`} />
      ))}
      <Bench position={[0, 0, 4.6]} length={2.4} />
    </group>
  );
}

// ── B4 Homeroom: a real classroom in the middle of the archive ─────────────
function HomeroomHall({ accent, plants }: { accent: string; plants: boolean }) {
  const lx = -ROOM.w / 2 + 0.08; // left wall face
  return (
    <group>
      <WallBoard position={[lx, 1.75, 2.0]} rotation={Math.PI / 2} w={5.2} h={1.5} kind="blackboard" />
      <WallBoard position={[lx, 1.8, 6.6]} rotation={Math.PI / 2} w={2.4} h={1.3} kind="cork" accent={accent} />
      <WallBoard position={[lx, 1.8, -2.6]} rotation={Math.PI / 2} w={2.2} h={1.2} kind="schedule" accent={accent} />
      {/* teacher's desk facing the class */}
      <group position={[-10.6, 0, 2.0]} rotation={[0, Math.PI / 2, 0]}>
        <Table w={1.6} d={0.8} h={0.75} />
        <Chair position={[0, 0, -0.65]} />
        <Box p={[0.45, 0.8, 0]} s={[0.4, 0.08, 0.3]} m={accentMat(accent)} />
      </group>
      {/* student desks (no names or identifying details anywhere) */}
      {[-7.6, -5.4, -3.2].map((x) =>
        [0.2, 2.2, 4.2].map((z) => (
          <group key={`${x}${z}`}>
            <Table position={[x, 0, z]} w={0.6} d={1.0} h={0.7} />
            <Chair position={[x + 0.55, 0, z]} rotation={-Math.PI / 2} />
          </group>
        )),
      )}
      {plants && <Plant position={[-11.6, 0, 8.4]} variant={0} tall />}
      {plants && <Plant position={[-4.4, 0, 8.6]} variant={1} />}
    </group>
  );
}

// ── 4F Development lab (reference floor, unchanged) ─────────────────────────
function LabHall() {
  const z = 8.4;
  return (
    <group>
      {[-1.4, 0, 1.4].map((x, i) => (
        <Pouf key={x} position={[x, 0, z]} color={i} />
      ))}
    </group>
  );
}
