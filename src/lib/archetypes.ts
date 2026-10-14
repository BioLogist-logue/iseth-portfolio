import type { Floor, SceneArchetype, SceneTemplate } from "./types";

/**
 * Interior archetype registry.
 *
 * A floor chooses an archetype through `sceneType` in its data. The archetype
 * owns everything *spatial* about that kind of floor — room finish, curated
 * zone layouts, the architectural "frame" around each zone, central-hall
 * architecture, lighting character and camera behaviour. Content (zones,
 * items) stays in data, and no scene code ever checks floor numbers.
 *
 * Every hall floor keeps the same navigation model:
 *   elevator → central hall (arrival camera + directory sign) → zones → objects.
 */

/** Which scene component family renders the floor. */
export type SceneFamily = "lobby" | "hall" | "garden";

/** Architecture framing a zone (see ZoneBooth). */
export type ZoneFrame =
  /** freestanding back panel + rug + glass rail (development lab) */
  | "panel"
  /** wood-panelled back wall with bookshelf side walls (library / archive) */
  | "alcove"
  /** tall white display wall with picture rail and track lights (gallery) */
  | "wall"
  /** warm-toned recessed niche with a wood surround and a low ledge (museum) */
  | "niche"
  /** raised platform with a presentation wall (seminar) */
  | "stage"
  /** wall-mounted board + desk area (operations) */
  | "board"
  /** open bay with a slim board stand (classroom / breakout) */
  | "open";

/** One curated zone placement. Booths face their `rotation` (0 = toward the room front, +z). */
export interface ZonePlacement {
  x: number;
  z: number;
  rotation: number;
  width: number;
  depth: number;
  frame?: ZoneFrame;
}

/** Archetype-specific architecture in the central hall. */
export type HallDecorKind =
  | "none"
  | "library"
  | "lab"
  | "gallery"
  | "classroom"
  | "operations"
  | "archive"
  | "conference"
  | "museum"
  | "homeroom";

/** Low-detail interior shown through the exterior glass. */
export type MiniInteriorKind = "lobby" | "library" | "lab" | "gallery" | "conference" | "classroom" | "office" | "archive";

export interface TemplateStyle {
  floor: "light" | "mid" | "dark" | "carpet" | "stone";
  carpet?: string;
  windows: boolean;
  /** Interior light warmth: 0 neutral daylight → 1 very warm. */
  warmth: number;
}

/** Lighting character — only uniform values change, never the light set. */
export interface LightCharacter {
  /** Hue of the ambient/key light. */
  tint: "warm" | "neutral" | "cool";
  /** Multiplier on the key light (1 = default). */
  key: number;
  /** Pendants along the hall, or flush ceiling panels only. */
  pendants: boolean;
}

export interface HallConfig {
  decor: HallDecorKind;
  /** Floor runner under the arrival path. */
  rug: "aisle" | "center" | "none";
  /** z of the floor directory sign (always on the centre line). */
  signZ: number;
}

export interface CameraConfig {
  /** Pitch (degrees) for zone close-ups. */
  zonePitch: number;
  /** Multiplier on the auto-fitted zone distance. */
  zoneDistance: number;
}

export interface Archetype {
  id: SceneArchetype;
  /** Korean display name (for tooling / future UI). */
  label: string;
  family: SceneFamily;
  style: TemplateStyle;
  /** Curated layouts by zone count. Counts without one fall back to the two-column aisle. */
  layouts: Partial<Record<number, ZonePlacement[]>>;
  /** Default frame for zones in this archetype. */
  frame: ZoneFrame;
  hall: HallConfig;
  light: LightCharacter;
  camera: CameraConfig;
  mini: MiniInteriorKind;
  /** Warm local light used after dark / underground (pergola, reading lamp…). */
  accentLight?: { position: [number, number, number]; color: string; intensity: number; distance: number };
}

const HALF_PI = Math.PI / 2;
/** Shorthand for a placement. */
const P = (x: number, z: number, rotation: number, width: number, depth: number, frame?: ZoneFrame): ZonePlacement => ({
  x,
  z,
  rotation,
  width,
  depth,
  frame,
});

// Room is 26 × 20 (x ±13, z −10 … +10). The elevator vestibule (|x| < 2.6,
// z < −7.5) and the centre line (|x| < 2.6) stay clear in every layout so the
// arrival view and the directory sign are never blocked.

/** Back corners, then side walls, then front side walls. */
const WALL_BAYS = {
  backLeft: (w = 8, d = 5.2) => P(-7.8, -10 + 0.4 + d / 2, 0, w, d),
  backRight: (w = 8, d = 5.2) => P(7.8, -10 + 0.4 + d / 2, 0, w, d),
  left: (z: number, w: number, d = 4.8) => P(-13 + 0.4 + d / 2, z, HALF_PI, w, d),
  right: (z: number, w: number, d = 4.8) => P(13 - 0.4 - d / 2, z, -HALF_PI, w, d),
};

const DEFAULT_CAMERA: CameraConfig = { zonePitch: 22, zoneDistance: 1 };

export const ARCHETYPES: Record<SceneArchetype, Archetype> = {
  lobby: {
    id: "lobby",
    label: "로비",
    family: "lobby",
    style: { floor: "light", windows: true, warmth: 0.4 },
    layouts: {},
    frame: "panel",
    hall: { decor: "none", rug: "none", signZ: 6.6 },
    light: { tint: "warm", key: 1, pendants: true },
    camera: { zonePitch: 14, zoneDistance: 1 },
    mini: "lobby",
  },

  // 2F — teaching archive: bookshelf alcoves around a warm central reading hall.
  library: {
    id: "library",
    label: "도서관 · 수업 아카이브",
    family: "hall",
    style: { floor: "mid", windows: true, warmth: 0.6 },
    layouts: {
      2: [WALL_BAYS.backLeft(), WALL_BAYS.backRight()],
      3: [WALL_BAYS.backLeft(), WALL_BAYS.backRight(), WALL_BAYS.left(1.0, 7)],
      4: [WALL_BAYS.backLeft(), WALL_BAYS.backRight(), WALL_BAYS.left(-0.6, 6.4), WALL_BAYS.right(-0.6, 6.4)],
      5: [
        WALL_BAYS.backLeft(),
        WALL_BAYS.backRight(),
        WALL_BAYS.left(-1.3, 5.6),
        WALL_BAYS.right(-1.3, 5.6),
        WALL_BAYS.left(4.7, 5.6),
      ],
      6: [
        WALL_BAYS.backLeft(),
        WALL_BAYS.backRight(),
        WALL_BAYS.left(-1.3, 5.6),
        WALL_BAYS.right(-1.3, 5.6),
        WALL_BAYS.left(4.7, 5.6),
        WALL_BAYS.right(4.7, 5.6),
      ],
    },
    frame: "alcove",
    hall: { decor: "library", rug: "center", signZ: 7.2 },
    light: { tint: "warm", key: 0.95, pendants: true },
    camera: { zonePitch: 20, zoneDistance: 0.95 },
    mini: "library",
  },

  // 3F — smart classroom + media lab: two classroom wings around a media plaza.
  "smart-classroom": {
    id: "smart-classroom",
    label: "스마트 교실 · 미디어 랩",
    family: "hall",
    style: { floor: "light", windows: true, warmth: 0.25 },
    layouts: {
      2: [P(-8.7, 0.6, HALF_PI, 14, 7.0, "open"), P(8.7, 0.6, -HALF_PI, 14, 7.0, "open")],
    },
    frame: "open",
    hall: { decor: "classroom", rug: "center", signZ: 7.6 },
    light: { tint: "cool", key: 1.05, pendants: false },
    camera: { zonePitch: 26, zoneDistance: 0.85 },
    mini: "classroom",
  },

  // 4F — the reference floor: unchanged two-column aisle with panel booths.
  "development-lab": {
    id: "development-lab",
    label: "개발 연구소",
    family: "hall",
    style: { floor: "light", windows: true, warmth: 0.3 },
    layouts: {},
    frame: "panel",
    hall: { decor: "lab", rug: "aisle", signZ: 6.6 },
    light: { tint: "neutral", key: 1, pendants: true },
    camera: DEFAULT_CAMERA,
    mini: "lab",
  },

  // 5F — seminar centre: a stage, a workshop breakout, a materials wall.
  conference: {
    id: "conference",
    label: "세미나 · 워크숍",
    family: "hall",
    style: { floor: "carpet", carpet: "#c2b6a4", windows: true, warmth: 0.45 },
    layouts: {
      2: [P(7.6, -3.2, 0, 10, 9.2, "stage"), P(-7.4, 4.4, 0, 10, 7.0, "open")],
      3: [P(7.6, -3.2, 0, 10, 9.2, "stage"), P(-7.4, 4.6, 0, 10, 7.0, "open"), P(-7.6, -6.7, 0, 9, 5.0, "panel")],
    },
    frame: "panel",
    hall: { decor: "conference", rug: "none", signZ: 7.0 },
    light: { tint: "warm", key: 0.9, pendants: false },
    camera: { zonePitch: 24, zoneDistance: 0.9 },
    mini: "conference",
  },

  // 6F — personal growth gallery: display walls on the perimeter, open centre.
  gallery: {
    id: "gallery",
    label: "갤러리",
    family: "hall",
    style: { floor: "stone", windows: true, warmth: 0.35 },
    layouts: {
      2: [WALL_BAYS.backLeft(8.6, 4.4), WALL_BAYS.backRight(8.6, 4.4)],
      3: [WALL_BAYS.backLeft(8.6, 4.4), WALL_BAYS.backRight(8.6, 4.4), WALL_BAYS.left(2.0, 11, 4.2)],
      4: [WALL_BAYS.backLeft(8.6, 4.4), WALL_BAYS.backRight(8.6, 4.4), WALL_BAYS.left(2.0, 11, 4.2), WALL_BAYS.right(2.0, 11, 4.2)],
    },
    frame: "wall",
    hall: { decor: "gallery", rug: "none", signZ: 7.4 },
    light: { tint: "neutral", key: 1.05, pendants: false },
    camera: { zonePitch: 14, zoneDistance: 1 },
    mini: "gallery",
  },

  // B1 — back office: workflow boards on the side walls, ops island in the middle.
  operations: {
    id: "operations",
    label: "운영실",
    family: "hall",
    style: { floor: "carpet", carpet: "#aeb1ad", windows: true, warmth: 0.25 },
    layouts: {
      2: [WALL_BAYS.left(0.4, 10, 6.2), WALL_BAYS.right(0.4, 10, 6.2)],
      3: [WALL_BAYS.left(0.4, 10, 6.2), WALL_BAYS.right(0.4, 10, 6.2), WALL_BAYS.backLeft(7, 4.4)],
    },
    frame: "board",
    hall: { decor: "operations", rug: "none", signZ: 7.6 },
    light: { tint: "neutral", key: 1.0, pendants: false },
    camera: { zonePitch: 24, zoneDistance: 0.9 },
    mini: "office",
  },

  // B2 — quiet records room: alcoves at the back, shelving stacks, a reading desk.
  archive: {
    id: "archive",
    label: "기록 · 성찰 아카이브",
    family: "hall",
    style: { floor: "dark", windows: true, warmth: 0.7 },
    layouts: {
      2: [WALL_BAYS.backLeft(), WALL_BAYS.backRight()],
      3: [WALL_BAYS.backLeft(), WALL_BAYS.backRight(), WALL_BAYS.left(-1.0, 5.6)],
    },
    frame: "alcove",
    hall: { decor: "archive", rug: "center", signZ: 7.6 },
    light: { tint: "warm", key: 0.85, pendants: true },
    camera: { zonePitch: 20, zoneDistance: 0.95 },
    mini: "archive",
    accentLight: { position: [0, 3.2, 1.5], color: "#ffbf78", intensity: 7, distance: 14 },
  },

  // B3 — small philosophy museum: niche walls around a central exhibit.
  museum: {
    id: "museum",
    label: "작은 박물관",
    family: "hall",
    style: { floor: "stone", windows: true, warmth: 0.5 },
    layouts: {
      2: [WALL_BAYS.backLeft(8.6, 4.4), WALL_BAYS.backRight(8.6, 4.4)],
      3: [WALL_BAYS.backLeft(8.6, 4.4), WALL_BAYS.backRight(8.6, 4.4), WALL_BAYS.left(2.4, 9, 4.2)],
      4: [WALL_BAYS.backLeft(8.6, 4.4), WALL_BAYS.backRight(8.6, 4.4), WALL_BAYS.left(2.4, 9, 4.2), WALL_BAYS.right(2.4, 9, 4.2)],
    },
    frame: "niche",
    hall: { decor: "museum", rug: "none", signZ: 7.8 },
    light: { tint: "warm", key: 0.9, pendants: false },
    camera: { zonePitch: 14, zoneDistance: 1 },
    mini: "gallery",
    accentLight: { position: [0, 3.4, 1], color: "#ffd6a0", intensity: 8, distance: 12 },
  },

  // B4 — homeroom: a classroom in the middle, class-life corners around it.
  homeroom: {
    id: "homeroom",
    label: "교실 · 담임 아카이브",
    family: "hall",
    style: { floor: "mid", windows: true, warmth: 0.55 },
    layouts: {
      2: [P(-7.8, -6.8, 0, 8, 5.2, "alcove"), P(7.8, -6.8, 0, 8, 5.2, "open")],
      3: [P(-7.8, -6.8, 0, 8, 5.2, "alcove"), P(7.8, -6.8, 0, 8, 5.2, "open"), WALL_BAYS.right(2.8, 8, 4.4)],
    },
    frame: "panel",
    hall: { decor: "homeroom", rug: "none", signZ: 7.6 },
    light: { tint: "warm", key: 1.0, pendants: false },
    camera: { zonePitch: 22, zoneDistance: 0.95 },
    mini: "classroom",
  },

  garden: {
    id: "garden",
    label: "정원",
    family: "garden",
    style: { floor: "light", windows: false, warmth: 0.3 },
    layouts: {},
    frame: "panel",
    hall: { decor: "none", rug: "none", signZ: 6.6 },
    light: { tint: "neutral", key: 1, pendants: false },
    camera: DEFAULT_CAMERA,
    mini: "lobby",
    accentLight: { position: [-8.2, 2.4, -5.2], color: "#ffc27a", intensity: 6, distance: 10 },
  },
};

const LEGACY: Record<string, SceneArchetype> = {
  laboratory: "development-lab",
  classroom: "smart-classroom",
  office: "operations",
  exhibition: "gallery",
};

export function resolveArchetypeId(t: SceneTemplate): SceneArchetype {
  return (LEGACY[t] as SceneArchetype | undefined) ?? (t as SceneArchetype);
}

/** Archetype for a floor, with underground adjustments (no windows, warmer light). */
export function archetypeOf(floor: Floor): Archetype {
  const base = ARCHETYPES[resolveArchetypeId(floor.sceneType)] ?? ARCHETYPES.library;
  if (floor.type !== "basement") return base;
  return { ...base, style: { ...base.style, windows: false, warmth: Math.min(1, base.style.warmth + 0.2) } };
}
