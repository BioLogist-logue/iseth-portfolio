import type { Floor, Zone } from "./types";
import { aboveGround, basements, getFloor, zonesOf } from "./building";
import { archetypeOf, type ZoneFrame } from "./archetypes";

export type Vec3 = [number, number, number];
export interface Pose {
  position: Vec3;
  target: Vec3;
}

// ── Interior room (shared by every floor so the elevator lines up) ──────────
export const ROOM = { w: 26, d: 20, h: 4.6 } as const;
export const ROOM_BACK_Z = -ROOM.d / 2; // elevator wall
export const ROOM_FRONT_Z = ROOM.d / 2;
export const CAB = { w: 2.5, d: 2.9, h: 2.9, doorW: 1.9, doorH: 2.45 } as const;
export const CAB_FLOOR_Z = ROOM_BACK_Z - CAB.d / 2;

export interface ZoneSlot {
  zone: Zone;
  center: Vec3;
  width: number;
  depth: number;
  /** Yaw (radians) of the booth; 0 = facing the front of the room (+z). */
  rotation: number;
  /** Architecture framing the zone, from the archetype. */
  frame: ZoneFrame;
}

const COLS_X = [-7.6, 7.6];
const BOOTH_W = 9;

/**
 * Zone layout for a floor. The archetype supplies curated placements per zone
 * count; counts it doesn't cover fall back to the two-column aisle, so any
 * number of zones (1–6) always lays out sensibly.
 */
export function layoutZones(floorId: string): ZoneSlot[] {
  const floor = getFloor(floorId);
  const zs = zonesOf(floorId);
  if (!floor) return aisleLayout(zs, "panel");
  const arch = archetypeOf(floor);
  const curated = arch.layouts[zs.length];
  if (!curated) return aisleLayout(zs, arch.frame === "wall" || arch.frame === "niche" || arch.frame === "board" ? "panel" : arch.frame);
  return zs.map((zone, i) => {
    const pl = curated[i];
    return {
      zone,
      center: [pl.x, 0, pl.z] as Vec3,
      rotation: pl.rotation,
      width: pl.width,
      depth: pl.depth,
      frame: pl.frame ?? arch.frame,
    };
  });
}

/** Two columns either side of a central aisle for 1–6 zones; all booths face the front (+z). */
function aisleLayout(zs: Zone[], frame: ZoneFrame): ZoneSlot[] {
  const rows = Math.max(1, Math.ceil(zs.length / 2));
  const top = ROOM_BACK_Z + 0.4;
  const bottom = ROOM_FRONT_Z - 2.2;
  const gap = rows > 2 ? 1.2 : 2.0;
  const depth = Math.min(7, (bottom - top - gap * (rows - 1)) / rows);
  return zs.map((zone, i) => {
    const row = Math.floor(i / 2);
    const col = i % 2;
    const cz = top + depth / 2 + row * (depth + gap);
    return { zone, center: [COLS_X[col], 0, cz], width: BOOTH_W, depth, rotation: 0, frame };
  });
}

/** Lobby stations are hand-placed to follow the reference composition. */
const LOBBY_ANCHORS: Vec3[] = [
  [-7.2, 0, -6.2], // reception
  [9.2, 0, -6.4], // featured display
  [8.4, 0, 3.2], // lounge
];

/** Rooftop item stands, scattered along the garden path. */
export const GARDEN_STANDS: { pos: Vec3; rot: number }[] = [
  { pos: [-4.2, 0, -3.5], rot: 0.5 },
  { pos: [4.6, 0, -4.2], rot: -0.5 },
  { pos: [-8.6, 0, 1.8], rot: 0.9 },
  { pos: [2.2, 0, 2.6], rot: -0.2 },
  { pos: [9.2, 0, 2.8], rot: -0.9 },
  { pos: [-3.4, 0, 6.6], rot: 0.3 },
  { pos: [6.0, 0, 7.4], rot: -0.4 },
  { pos: [-10.4, 0, 7.4], rot: 0.7 },
];

export function zoneAnchor(floor: Floor, zoneId: string): { center: Vec3; width: number; rotation: number } | null {
  const family = archetypeOf(floor).family;
  if (family === "lobby") {
    const i = zonesOf(floor.id).findIndex((z) => z.id === zoneId);
    if (i < 0) return null;
    return { center: LOBBY_ANCHORS[i % LOBBY_ANCHORS.length], width: 6, rotation: 0 };
  }
  if (family === "garden") return { center: [0, 0, 1.5], width: 22, rotation: 0 };
  const slot = layoutZones(floor.id).find((s) => s.zone.id === zoneId);
  return slot ? { center: slot.center, width: slot.width, rotation: slot.rotation } : null;
}

// ── Pose helpers ──────────────────────────────────────────────────────────
const deg = Math.PI / 180;

/** Position a camera around a target. yaw 0 = camera on +z side looking −z. */
export function orbitPose(target: Vec3, yawDeg: number, pitchDeg: number, dist: number): Pose {
  const y = yawDeg * deg;
  const p = pitchDeg * deg;
  return {
    target,
    position: [
      target[0] + Math.sin(y) * Math.cos(p) * dist,
      target[1] + Math.sin(p) * dist,
      target[2] + Math.cos(y) * Math.cos(p) * dist,
    ],
  };
}

export interface ViewCtx {
  aspect: number;
  fov: number; // vertical, degrees
}

/** Distance needed for a box of half extents (hw, hh) to fit the view. */
export function fitDistance(hw: number, hh: number, v: ViewCtx) {
  const t = Math.tan((v.fov * deg) / 2);
  return Math.max(hh / t, hw / (t * v.aspect));
}

export function cameraFov(aspect: number) {
  return aspect < 0.8 ? 52 : aspect < 1.2 ? 48 : 42;
}

// Interior poses
export const cabPose = (): Pose => ({
  position: [0, 1.6, ROOM_BACK_Z - CAB.d + 0.3],
  target: [0, 1.45, 4],
});

/** Extra field of view while standing in the cab, so its interior reads. */
export const CAB_FOV_BOOST = 16;

export const elevatorApproachPose = (): Pose => ({
  position: [0, 1.9, ROOM_BACK_Z + 5.2],
  target: [0, 1.45, ROOM_BACK_Z - 1],
});

/** "Step out of the elevator" view into the central hall. */
export const hallPose = (v: ViewCtx): Pose => {
  const back = v.aspect < 0.8 ? 0.8 : 0;
  return { position: [0, 2.0, ROOM_BACK_Z + 3.0 - back], target: [0, 1.3, 6] };
};

export function overviewPose(floor: Floor, v: ViewCtx): Pose {
  if (archetypeOf(floor).family === "lobby") {
    const d = v.aspect < 0.8 ? 1.25 : 1;
    return { position: [-1.2, 4.1 * d, 14 + (d - 1) * 8], target: [-1.2, 1.6, -4] };
  }
  const narrow = v.aspect < 1;
  const dist = fitDistance(narrow ? 9.5 : 16, 8.5, v);
  return orbitPose([narrow ? 0 : -2.6, narrow ? -4 : 0, narrow ? 3 : -0.3], 0, narrow ? 50 : 42, Math.min(dist, 44));
}

export function zonePose(floor: Floor, zoneId: string, v: ViewCtx): Pose | null {
  const a = zoneAnchor(floor, zoneId);
  if (!a) return null;
  const arch = archetypeOf(floor);
  if (arch.family === "garden") return overviewPose(floor, v);
  const [cx, , cz] = a.center;
  const lobbyLike = arch.family === "lobby";
  const narrow = v.aspect < 1;
  const half = narrow ? a.width * 0.36 : a.width * 0.55;
  let dist = Math.min(fitDistance(half, 2.2, v), 17) * arch.camera.zoneDistance;
  // Look at the booth from the direction it faces; front-facing booths get a
  // slight skew toward the room centre so the hall stays in view.
  const r = a.rotation;
  const skew = r === 0 ? -cx * (lobbyLike ? 2.2 : 1.4) : 0;
  const yaw = (r * 180) / Math.PI + skew;
  const pitch = arch.camera.zonePitch;
  const back = 0.4;
  // On phones the bottom sheet covers the lower half: aim lower so the booth sits higher.
  const target: Vec3 = [cx - Math.sin(r) * back, narrow ? -0.4 : 1.15, cz - Math.cos(r) * back];
  // Keep the camera inside the side and back walls (solid); the front wall is cut away.
  let pose = orbitPose(target, yaw, pitch, dist);
  for (let k = 0; k < 12 && (Math.abs(pose.position[0]) > ROOM.w / 2 - 0.6 || pose.position[2] < ROOM_BACK_Z + 0.6); k++) {
    dist *= 0.9;
    pose = orbitPose(target, yaw, pitch, dist);
  }
  return pose;
}

// ── Exterior building geometry ────────────────────────────────────────────
export const EXT = {
  w: 14,
  d: 9,
  coreW: 2.3,
  lobbyH: 3.8,
  floorH: 3.1,
  basementH: 2.5,
  slab: 0.34,
  plazaFront: 11.5,
} as const;

/** Above-ground floors excluding the lobby, bottom → top. */
export const upperFloors = () => aboveGround.filter((f) => f.type !== "lobby");

export function buildingHeight() {
  return EXT.lobbyH + upperFloors().length * EXT.floorH;
}

export function baseDepth() {
  return basements.length * EXT.basementH + 1.4;
}

/**
 * Opening view. Frames the above-ground tower — from the plaza / entrance up
 * to the rooftop trees — rather than the whole diorama, so the building reads
 * as substantial. Basement depth is only hinted at by the section cut's top.
 */
export function exteriorPose(v: ViewCtx): Pose {
  const top = buildingHeight() + 4.4; // roof garden + trees
  const bottom = -1.8; // plaza edge and a sliver of the basement section
  const narrow = v.aspect < 1;
  const cy = (top + bottom) / 2;
  const halfH = (top - bottom) / 2;
  // Phones leave room for the bottom title card; desktop keeps a calm margin.
  // The 1.36 factor compensates for perspective: the facade and roof are
  // nearer the camera than the framing target, so they appear larger.
  const dist = narrow ? fitDistance(10.5, halfH + 5.5, v) * 1.24 : fitDistance(12.5, halfH + 1.1, v) * 1.36;
  // Desktop: the tower sits right of the title card. Phones: above the bottom card.
  const target: Vec3 = narrow ? [0, cy - 5.15, 1.5] : [-6, cy - 2.1, 1.5];
  return orbitPose(target, narrow ? 22 : 24, 14, dist);
}

export function approachPose(v: ViewCtx): Pose {
  const narrow = v.aspect < 1;
  const dist = fitDistance(narrow ? 5.5 : 9, 4.6, v);
  return orbitPose([0, 3.2, EXT.d / 2 + 1], narrow ? 10 : 16, 10, dist);
}

export const doorwayPose = (): Pose => ({
  position: [0, 1.7, EXT.d / 2 + 1.6],
  target: [0, 1.6, -2],
});
