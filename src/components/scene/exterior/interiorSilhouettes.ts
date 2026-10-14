import type * as THREE from "three";
import type { MiniInteriorKind } from "@/lib/archetypes";
import { statusColor } from "@/lib/labels";
import type { Part, V3 } from "../common/instancing";
import { roundedBox } from "../common/instancing";
import { accentMat, glowTier, mats, texMat } from "../common/materials";
import { G } from "../common/primitives";
import { artTexture, booksTexture } from "../common/textures";

/**
 * Low-detail interiors seen through the exterior glass, generated as data.
 *
 * Every floor contributes a handful of large, readable silhouettes (shelves,
 * desks, screens, seating, plants…) chosen by its archetype. Building.tsx
 * gathers the parts of all floors and draws them as instanced batches, so the
 * whole tower's interiors cost a few dozen draw calls in total.
 *
 * Coordinates are wing-local: origin at the room-floor centre, back wall at
 * z = -d/2, glass side at z = +d/2. `side` is -1 (left wing) or +1 (right).
 */

export type GeoKey = "box" | "rbox" | "cyl" | "ico" | "plane";
export type MatKey =
  | "wall"
  | "floor"
  | "lamp"
  | "furn"
  | "wood"
  | "woodDark"
  | "fabric"
  | "fabricGreen"
  | "seat"
  | "dark"
  | "pot"
  | "leaf"
  | "books"
  | "screenA"
  | "screenB"
  | "chartA"
  | "artA"
  | "artB"
  | "artC"
  | "gold"
  | `accent:${string}`;

export interface SPart extends Part {
  g: GeoKey;
  m: MatKey;
}

export interface RoomSpec {
  origin: V3;
  w: number;
  d: number;
  h: number;
  side: -1 | 1;
  tier: number;
  accent: string;
  lowDetail: boolean;
}

const LEAF = ["#6fa45a", "#5d9750", "#7fb35f", "#8dbf62"];

export function interiorSilhouette(kind: MiniInteriorKind, r: RoomSpec): SPart[] {
  const out: SPart[] = [];
  const [ox, oy, oz] = r.origin;
  const { w, d, h, side, lowDetail } = r;
  const back = -d / 2;
  const front = d / 2;
  /** Inner (core-facing) x edge of the room in wing-local space. */
  const inner = -side * (w / 2);
  const add = (g: GeoKey, m: MatKey, p: V3, s: V3, rot?: number, c?: string) =>
    out.push({ g, m, p: [ox + p[0], oy + p[1], oz + p[2]], s, r: rot, c });
  /** Mirror x so the two wings of a floor aren't identical. */
  const mx = (x: number) => x * side;

  // ── Shell: recessed interior planes + light ───────────────────────────
  add("box", "floor", [0, 0.01, 0], [w, 0.02, d]);
  add("box", "wall", [0, h / 2, back + 0.03], [w, h, 0.06]);
  add("box", "wall", [inner + side * 0.03, h / 2, 0], [0.06, h, d]);
  for (const z of [back + 1.6, 0.8, front - 1.2]) add("box", "lamp", [0, h - 0.04, z], [w * 0.7, 0.04, 0.22]);

  const plant = (x: number, z: number, tall = 1) => {
    if (lowDetail) return;
    add("cyl", "pot", [x, 0.2, z], [0.4, 0.4, 0.4]);
    add("ico", "leaf", [x, 0.55 + tall * 0.3, z], [0.6, 0.65 * tall + 0.3, 0.6], undefined, LEAF[Math.abs(Math.round(x * 7 + z)) % LEAF.length]);
  };
  const table = (x: number, z: number, tw: number, td: number, mat: MatKey = "wood", th = 0.74) => {
    add("rbox", mat, [x, th, z], [tw, 0.06, td]);
    add("box", "woodDark", [x, th / 2, z], [Math.min(0.12, tw * 0.1), th, Math.min(0.12, td * 0.2)]);
  };
  const chairRow = (x0: number, x1: number, z: number, n: number) => {
    if (lowDetail) return;
    for (let i = 0; i < n; i++) {
      const x = x0 + ((x1 - x0) * (i + 0.5)) / n;
      add("rbox", "seat", [x, 0.42, z], [0.42, 0.08, 0.42]);
      add("rbox", "seat", [x, 0.7, z + 0.19], [0.42, 0.5, 0.06]);
    }
  };
  const monitor = (x: number, y: number, z: number, screen: MatKey = "screenA", sw = 0.7) => {
    add("box", "dark", [x, y + 0.24, z], [sw + 0.06, 0.46, 0.04]);
    add("plane", screen, [x, y + 0.24, z + 0.025], [sw, 0.4, 1]);
    add("box", "dark", [x, y + 0.04, z], [0.08, 0.08, 0.08]);
  };
  const bookcase = (x: number, z: number, bw: number, bh: number) => {
    add("box", "wood", [x, bh / 2, z], [bw, bh, 0.42]);
    add("plane", "books", [x, bh / 2, z + 0.215], [bw - 0.12, bh - 0.16, 1]);
  };

  switch (kind) {
    case "lobby":
      if (side < 0) {
        // reception desk + art wall
        add("rbox", "furn", [mx(-0.4), 0.52, -0.6], [2.6, 1.04, 0.8]);
        add("box", "wood", [mx(-0.4), 0.48, -0.19], [2.5, 0.8, 0.02]);
        add("plane", "artA", [mx(-0.6), 2.2, back + 0.07], [2.6, 1.3, 1]);
        add("plane", "artB", [mx(1.5), 2.2, back + 0.07], [1.1, 1.3, 1]);
        for (const x of [-1.4, -0.4, 0.6]) add("cyl", "lamp", [mx(x), h - 0.7, 0.3], [0.3, 0.22, 0.3]);
        plant(mx(1.9), front - 0.7, 1.4);
        plant(mx(-2.1), -1.4, 1.2);
      } else {
        // lounge + directory / display
        add("rbox", "fabric", [mx(0.4), 0.28, 1.2], [2.3, 0.46, 0.85]);
        add("rbox", "fabric", [mx(0.4), 0.62, 0.86], [2.3, 0.5, 0.2]);
        add("rbox", "fabricGreen", [mx(-1.6), 0.36, 1.9], [0.9, 0.6, 0.85]);
        add("cyl", "wood", [mx(-0.4), 0.42, 2.0], [1.0, 0.05, 1.0]);
        add("box", "dark", [mx(1.3), 1.9, back + 0.08], [1.5, 2.2, 0.06]);
        add("plane", "screenB", [mx(1.3), 1.9, back + 0.115], [1.36, 2.04, 1]);
        add("plane", "artC", [mx(-1.0), 2.1, back + 0.07], [1.6, 1.1, 1]);
        plant(mx(-2.2), front - 0.8, 1.3);
      }
      break;

    case "library":
      // tall bookcases on the back wall, freestanding stacks, reading table
      for (const x of [-1.8, 0, 1.8]) bookcase(mx(x), back + 0.3, 1.6, h - 0.5);
      if (side < 0) {
        for (const z of [-1.2, 0.4]) {
          add("box", "wood", [mx(-1.0), 0.8, z], [1.8, 1.6, 0.4]);
          add("plane", "books", [mx(-1.0), 0.8, z + 0.205], [1.7, 1.45, 1]);
        }
        table(mx(1.1), 1.8, 1.9, 0.9);
        chairRow(mx(0.4), mx(1.8), 2.45, 3);
        add("cyl", "lamp", [mx(1.1), 1.0, 1.8], [0.18, 0.28, 0.18]);
      } else {
        // archive storage cabinets + long reading table
        for (const x of [-1.6, -0.5, 0.6]) add("rbox", "furn", [mx(x), 0.65, -1.0], [1.0, 1.3, 0.55]);
        table(0, 1.6, 3.2, 1.0);
        chairRow(-1.4, 1.4, 2.3, 4);
      }
      plant(mx(2.2), front - 0.6, 1.2);
      break;

    case "classroom":
      // interactive board, rows of desks with tablets
      add("box", "dark", [0, 1.85, back + 0.08], [3.4, 1.5, 0.06]);
      add("plane", side < 0 ? "screenA" : "screenB", [0, 1.85, back + 0.115], [3.26, 1.36, 1]);
      if (side < 0) {
        for (const z of [0.2, 1.5])
          for (const x of [-1.5, 0, 1.5]) {
            table(mx(x), z, 1.1, 0.55, "wood", 0.72);
            add("plane", "screenB", [mx(x), 0.77, z], [0.36, 0.26, 1], undefined);
          }
      } else {
        // media lab: monitor desks + display panel
        table(mx(-0.7), -0.9, 2.6, 0.8, "furn");
        monitor(mx(-1.3), 0.77, -1.1, "chartA");
        monitor(mx(-0.1), 0.77, -1.1, "screenA");
        add("box", "furn", [mx(1.7), 1.2, 0.6], [0.12, 2.0, 1.6]);
        add("plane", "artB", [mx(1.63), 1.3, 0.6], [1.4, 1.2, 1], side * -Math.PI / 2);
        chairRow(mx(-1.6), mx(0.4), 0.0, 3);
      }
      plant(mx(2.2), front - 0.7, 1.1);
      break;

    case "lab":
      if (side < 0) {
        // development desks + prototype board (status columns)
        const cols = [statusColor.IDEA, statusColor.PROTOTYPE, statusColor.TESTING, statusColor.RELEASE_CANDIDATE];
        add("box", "furn", [0, 1.95, back + 0.07], [3.8, 1.0, 0.04]);
        cols.forEach((c, i) => {
          const x = -1.42 + i * 0.95;
          add("box", `accent:${c}`, [x, 2.38, back + 0.1], [0.85, 0.1, 0.02]);
          add("box", "wall", [x, 1.85, back + 0.1], [0.6, 0.45, 0.02]);
        });
        table(0, -1.0, 3.6, 0.85, "furn");
        for (const x of [-1.2, 0, 1.2]) monitor(mx(x), 0.77, -1.2, x === 0 ? "chartA" : "screenA");
        chairRow(-1.6, 1.6, -0.2, 3);
      } else {
        // lab counter with devices + science wall graphic + shelving
        add("plane", "chartA", [mx(-0.4), 2.0, back + 0.07], [3.0, 1.3, 1]);
        add("rbox", "furn", [mx(-0.2), 0.48, 0.9], [3.0, 0.96, 0.95]);
        add("box", "wood", [mx(-0.2), 0.45, 1.38], [2.9, 0.7, 0.02]);
        for (const x of [-1.2, -0.2, 0.8]) add("rbox", "furn", [mx(x), 1.1, 0.8], [0.4, 0.28, 0.3]);
        add("box", "furn", [mx(2.0), 1.1, -1.4], [0.9, 2.2, 0.45]);
        for (const y of [0.5, 1.1, 1.7]) add("box", `accent:${r.accent}`, [mx(2.0), y, -1.15], [0.7, 0.22, 0.04]);
      }
      plant(mx(2.2), front - 0.6, 1.2);
      break;

    case "conference":
      if (side < 0) {
        // presentation screen + seminar rows + podium
        add("box", "dark", [0, 1.75, back + 0.08], [3.6, 1.8, 0.06]);
        add("plane", "screenA", [0, 1.75, back + 0.115], [3.46, 1.66, 1]);
        add("rbox", "wood", [mx(2.0), 0.55, back + 1.4], [0.6, 1.1, 0.45]);
        chairRow(-1.8, 1.8, 0.3, 5);
        chairRow(-1.8, 1.8, 1.3, 5);
      } else {
        // workshop tables
        table(mx(-0.9), 0.2, 2.0, 1.0);
        table(mx(1.2), 1.5, 1.6, 1.0);
        chairRow(mx(-1.8), mx(0.0), 0.9, 3);
        add("plane", "artA", [mx(0.3), 2.1, back + 0.07], [2.4, 1.2, 1]);
        add("box", "furn", [mx(-2.0), 1.0, -1.6], [0.6, 2.0, 0.6]);
      }
      plant(mx(-2.3), front - 0.6, 1.3);
      break;

    case "gallery":
      // freestanding gallery panels with art, pedestals, badge wall
      for (const [x, z] of [
        [-1.3, -0.4],
        [1.3, 0.5],
      ] as const) {
        add("rbox", "furn", [mx(x), 1.15, z], [1.7, 2.1, 0.14]);
        add("plane", side < 0 ? "artA" : "artC", [mx(x), 1.3, z + 0.075], [1.2, 1.0, 1]);
      }
      if (side < 0) {
        for (let i = 0; i < 5; i++) add("cyl", "gold", [-1.8 + i * 0.9, 2.1, back + 0.1], [0.45, 0.04, 0.45], undefined);
      } else {
        add("plane", "artB", [0, 2.0, back + 0.07], [2.8, 1.2, 1]);
      }
      for (const x of [-0.2, 2.1]) {
        add("rbox", "furn", [mx(x), 0.5, 1.9], [0.55, 1.0, 0.55]);
        add("ico", "gold", [mx(x), 1.15, 1.9], [0.32, 0.32, 0.32]);
      }
      plant(mx(-2.3), front - 0.6, 1.1);
      break;

    case "office":
      // operations: monitor desks + dashboard wall
      add("box", "dark", [0, 1.95, back + 0.08], [3.0, 1.1, 0.06]);
      add("plane", "chartA", [0, 1.95, back + 0.115], [2.86, 0.96, 1]);
      table(mx(-0.6), -0.4, 3.0, 0.8, "furn");
      for (const x of [-1.6, -0.6, 0.4]) monitor(mx(x), 0.77, -0.6, "screenA", 0.6);
      chairRow(mx(-1.9), mx(0.7), 0.4, 3);
      add("rbox", "furn", [mx(1.9), 0.6, 1.2], [1.0, 1.2, 0.55]);
      plant(mx(2.2), front - 0.6, 1.0);
      break;

    case "archive":
      for (const x of [-1.8, -0.6, 0.6, 1.8]) add("rbox", "furn", [mx(x), 0.8, back + 0.5], [1.05, 1.6, 0.6]);
      bookcase(mx(-1.2), 0.2, 1.8, 1.4);
      table(mx(1.0), 1.4, 1.8, 0.9);
      add("cyl", "lamp", [mx(1.0), 1.0, 1.4], [0.18, 0.28, 0.18]);
      break;
  }
  return out;
}

/** Resolve a material key to the shared material instance. */
export function silhouetteMaterial(key: MatKey, tier: number): THREE.Material {
  const m = mats();
  const t = glowTier(tier);
  switch (key) {
    case "wall":
      return t.wall;
    case "floor":
      return t.floor;
    case "lamp":
      return t.lamp;
    case "furn":
      return m.silhouette;
    case "seat":
      return m.fabricGrey;
    case "wood":
      return m.wood;
    case "woodDark":
      return m.woodDark;
    case "fabric":
      return m.fabricCream;
    case "fabricGreen":
      return m.fabricGreen;
    case "dark":
      return m.dark;
    case "pot":
      return m.pot;
    case "leaf":
      return leafMaterial();
    case "books":
      return texMat(booksTexture("exterior"), 0.35);
    case "screenA":
      return texMat(artTexture("ext-screen-a", "screen"), 0.7);
    case "screenB":
      return texMat(artTexture("ext-screen-b", "screen"), 0.7);
    case "chartA":
      return texMat(artTexture("ext-chart-a", "chart"), 0.7);
    case "artA":
      return texMat(artTexture("ext-art-a", "art"), 0.5);
    case "artB":
      return texMat(artTexture("ext-art-b", "art"), 0.5);
    case "artC":
      return texMat(artTexture("ext-art-c", "art"), 0.5);
    case "gold":
      return accentMat("#d9b24a", 0.25);
    default:
      return accentMat(key.slice("accent:".length), 0.35);
  }
}

let leaf: THREE.Material | null = null;
function leafMaterial() {
  // Instance colours tint a white base (shared with the plaza vegetation look).
  if (!leaf) {
    const m = mats().leaf1.clone();
    m.color.set("#ffffff");
    leaf = m;
  }
  return leaf;
}

export function silhouetteGeometry(key: GeoKey): THREE.BufferGeometry {
  switch (key) {
    case "box":
      return G.box;
    case "rbox":
      return ROUNDED;
    case "cyl":
      return G.cylLow;
    case "ico":
      return G.ico;
    case "plane":
      return G.plane;
  }
}
const ROUNDED = roundedBox(1, 1, 1, 0.12, 2);
