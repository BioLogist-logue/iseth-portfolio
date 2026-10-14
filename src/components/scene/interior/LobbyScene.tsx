"use client";

import { Html } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { directoryOrder, floorLabel, zonesOf } from "@/lib/building";
import { ROOM, ROOM_BACK_Z, ROOM_FRONT_Z } from "@/lib/layout";
import type { Floor, Zone } from "@/lib/types";
import { useTower } from "@/store/tower";
import { Label } from "../common/Label";
import { mats, texMat } from "../common/materials";
import { G, Box, Cyl, Plane } from "../common/primitives";
import {
  Armchair,
  Bookshelf,
  CoffeeTable,
  Counter,
  Display,
  Frame,
  Monitor,
  PendantLamp,
  Plant,
  Rug,
  Slats,
  Sofa,
} from "../common/props";
import { signTexture } from "../common/textures";
import { RoomShell } from "./RoomShell";
import { templateStyle } from "./templates";

const BZ = ROOM_BACK_Z + 0.03;

/** 1F lobby, composed after the lobby reference: reception, directory, featured wall, lounge. */
export default function LobbyScene({ floor }: { floor: Floor }) {
  const m = mats();
  const markReady = useTower((s) => s.markReady);
  useEffect(() => markReady(floor.id), [floor.id, markReady]);
  const stations = useMemo(() => {
    const zs = zonesOf(floor.id);
    const by = (p: Zone["panel"]) => zs.find((z) => z.panel === p);
    return { about: by("about"), featured: by("featured"), updates: by("updates") };
  }, [floor.id]);
  const welcome = useMemo(() => texMat(signTexture("iSETH Portfolio Tower", "Welcome"), 0.2), []);

  return (
    <group>
      <RoomShell style={templateStyle(floor)} />

      {/* ceiling cove (down-facing planes so they vanish from above) */}
      {[
        [0, -6.2, 12.4, 0.12],
        [0, 4.2, 12.4, 0.12],
        [-6.2, -1, 0.12, 10.4],
        [6.2, -1, 0.12, 10.4],
      ].map(([x, z, w, d], i) => (
        <Plane key={i} p={[x, ROOM.h - 0.02, z]} r={[Math.PI / 2, 0, 0]} s={[w, d, 1]} m={m.cove} />
      ))}

      {/* Welcome wall */}
      <mesh position={[-7.4, 3.25, BZ]} material={welcome} geometry={G.plane} scale={[4.6, 1.15, 1]} />
      {[-9.4, -8.1, -6.8, -5.5].map((x, i) => (
        <Frame key={x} position={[x, 2.15, BZ + 0.03]} w={1.1} h={0.9} seed={`lobby-art-${i}`} />
      ))}
      <Bookshelf position={[-7.4, 0, BZ + 0.3]} w={4.6} h={1.15} seed="lobby-shelf" />

      {/* Reception / info desk */}
      <Station zone={stations.about} label="안내 데스크" sub="About" pos={[-7.2, 0, -6.2]} labelY={1.9}>
        <Counter w={3.6} d={1.0} h={1.0} />
        <Cyl p={[2.0, 0.5, 0]} s={[1.0, 1.0, 1.0]} m={m.white} cast />
        <Monitor position={[-0.6, 1.02, -0.15]} seed="reception" />
        <Plant position={[-2.4, 0, 0.6]} variant={1} tall />
      </Station>

      {/* Building directory wall (real DOM text, mapped onto the wall) */}
      <group position={[5.1, 0, BZ]}>
        <Box p={[0, 2.15, 0.02]} s={[3.3, 3.7, 0.06]} m={m.wood} />
        <Box p={[0, 2.15, 0.06]} s={[3.0, 3.4, 0.02]} m={m.lamp} />
        <Slats position={[-2.1, 0, 0.04]} w={0.8} h={ROOM.h - 0.3} />
        <Slats position={[2.1, 0, 0.04]} w={0.8} h={ROOM.h - 0.3} />
        <Html transform position={[0, 2.15, 0.08]} distanceFactor={4} zIndexRange={[18, 10]} pointerEvents="none">
          <WallDirectory currentId={floor.id} />
        </Html>
      </group>

      {/* Featured work display */}
      <Station zone={stations.featured} label="추천 작품" sub="Featured Work" pos={[9.6, 0, BZ]} labelY={3.85}>
        <Display position={[0, 2.35, 0.08]} w={4.2} h={2.3} seed="featured-wall" kind="screen" />
        <Bookshelf position={[0, 0, 0.3]} w={4.2} h={0.95} seed="featured-shelf" />
        <Plant position={[-2.6, 0, 0.9]} variant={0} tall />
      </Station>

      {/* Lounge */}
      <Station zone={stations.updates} label="라운지" sub="최근 소식 · 추천 경로" pos={[8.4, 0, 3.2]} labelY={1.8}>
        <Rug w={5.2} d={3.8} />
        <Armchair position={[-1.9, 0, 0.1]} rotation={Math.PI / 2} />
        <Armchair position={[-0.3, 0, -1.5]} color="cream" />
        <Sofa position={[1.7, 0, 0]} rotation={-Math.PI / 2} />
        <CoffeeTable position={[-0.2, 0, 0.1]} />
        <Box p={[-0.1, 0.48, 0.1]} s={[0.4, 0.06, 0.3]} m={m.woodDark} />
        <Plant position={[3.4, 0, -1.6]} variant={2} tall />
      </Station>
      <PendantLamp position={[8.2, ROOM.h, 3.3]} drop={1.4} />
      <PendantLamp position={[-7.2, ROOM.h, -6.0]} drop={1.6} />
      <PendantLamp position={[-6.2, ROOM.h, -6.0]} drop={1.6} />

      {/* plants + entrance */}
      {[
        [-3.1, -9.1],
        [3.1, -9.1],
        [-11.6, -2.5],
        [-11.4, 8.4],
        [11.6, 8.6],
        [2.6, 8.9],
        [-2.6, 8.9],
      ].map(([x, z], i) => (
        <Plant key={i} position={[x, 0, z]} variant={i} tall={i % 2 === 0} />
      ))}
      <Box p={[0, 0.012, ROOM_FRONT_Z - 1.1]} s={[3.2, 0.02, 1.6]} m={m.fabricGrey} receive />
      {[-1.05, 1.05].map((x) => (
        <Plane key={x} p={[x, 1.4, ROOM_FRONT_Z - 0.03]} r={[0, Math.PI, 0]} s={[0.1, 2.8, 1]} m={m.steel} />
      ))}
      <Plane p={[0, 2.8, ROOM_FRONT_Z - 0.03]} r={[0, Math.PI, 0]} s={[2.2, 0.1, 1]} m={m.steel} />
    </group>
  );
}

function Station({
  zone,
  label,
  sub,
  pos,
  labelY,
  children,
}: {
  zone?: Zone;
  label: string;
  sub: string;
  pos: [number, number, number];
  labelY: number;
  children: React.ReactNode;
}) {
  const focused = useTower((s) => s.sub === "zone" && s.zoneId === zone?.id);
  const inCab = useTower((s) => s.sub === "elevator");
  const open = () => zone && useTower.getState().goZone(zone.id);
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    if (e.delta > 6) return;
    e.stopPropagation();
    open();
  };
  return (
    <group position={pos}>
      <group
        onClick={onClick}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "")}
      >
        {children}
      </group>
      <Label position={[0, labelY, 0.4]} hidden={focused || inCab} className="zone-sign" interactive>
        <button type="button" onClick={open}>
          <i style={{ background: "#c08a4a" }} />
          <span>
            <b>{label}</b>
            <small>{sub}</small>
          </span>
        </button>
      </Label>
    </group>
  );
}

function WallDirectory({ currentId }: { currentId: string }) {
  return (
    <div className="wall-directory" aria-hidden>
      {directoryOrder.map((f) => (
        <div key={f.id} className={f.id === currentId ? "is-current" : ""}>
          <b>{floorLabel(f)}</b>
          <span>{f.name}</span>
        </div>
      ))}
    </div>
  );
}
