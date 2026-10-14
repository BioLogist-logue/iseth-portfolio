/**
 * Core content model. Everything rendered in the tower — floors, zones,
 * portfolio objects, elevator buttons, the exterior stack — derives from these.
 */

export type FloorType = "lobby" | "standard" | "basement" | "rooftop";

/**
 * Interior scene archetypes. A floor picks one via `sceneType`; the archetype
 * decides room finish, zone layout, hall decor and which scene family renders it.
 * See src/lib/archetypes.ts.
 */
export type SceneArchetype =
  | "lobby"
  | "library"
  | "smart-classroom"
  | "development-lab"
  | "conference"
  | "gallery"
  | "operations"
  | "archive"
  | "museum"
  | "homeroom"
  | "garden";

/** Older template names, still accepted and mapped to an archetype. */
export type LegacySceneTemplate = "laboratory" | "classroom" | "office" | "exhibition";

export type SceneTemplate = SceneArchetype | LegacySceneTemplate;

/** Furniture set used to dress a zone booth inside a floor template. */
export type ZoneScene =
  | "bookshelf"
  | "lab-bench"
  | "dev-desk"
  | "inquiry-desk"
  | "gallery-wall"
  | "seminar"
  | "archive-cabinet"
  | "smart-classroom"
  | "badge-wall"
  | "timeline"
  | "lounge"
  | "garden-stand";

export type ItemType =
  | "app"
  | "lesson"
  | "worksheet"
  | "case"
  | "lecture"
  | "certificate"
  | "badge"
  | "milestone"
  | "document"
  | "tool"
  | "reflection"
  | "essay"
  | "template"
  | "role";

export type ItemStatus =
  | "IDEA"
  | "PROTOTYPE"
  | "TESTING"
  | "RELEASE_CANDIDATE"
  | "RELEASED"
  | "ARCHIVED";

export type LinkKind = "live" | "github" | "external" | "video";

export interface ItemLink {
  label: string;
  url: string;
  kind?: LinkKind;
}

export interface Attachment {
  id: string;
  label: string;
  kind: "pdf" | "image" | "slide" | "doc" | "sheet" | "zip" | "other";
  url: string;
  /** Show inline preview (PDF iframe / image). */
  preview?: boolean;
  sizeLabel?: string;
}

export interface GalleryImage {
  src?: string;
  alt: string;
  /** Used to generate placeholder art when `src` is missing. */
  seed?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  type: ItemType;
  zoneId: string;
  description: string;
  /** Longer body text. Paragraphs separated by blank lines. */
  details?: string;
  thumbnail?: string;
  /** Alt text for the thumbnail. Falls back to the title. */
  thumbnailAlt?: string;
  /** "contain" shows the whole image (badges, logos); default "cover" fills the frame. */
  thumbnailFit?: "cover" | "contain";
  publishedAt: string; // ISO date (YYYY-MM-DD)
  date?: string; // display date / period, e.g. "2025.03 – 2025.07"
  role?: string;
  tools?: string[];
  links?: ItemLink[];
  attachments?: Attachment[];
  gallery?: GalleryImage[];
  tags: string[];
  status?: ItemStatus;
  featured?: boolean;
  /** Optional visual hint for the 3D object; otherwise derived from `type`. */
  object?: ObjectKind;
  /** Content template the entry was written with (see src/content/schema.ts). */
  template?: string;
  /** Short labelled facts from the template (과목, 학년, 버전 …), shown in the info box. */
  facts?: DetailFact[];
  /** Labelled body sections from the template (학습 목표, 수업 흐름, 성찰 …). */
  sections?: DetailSection[];
  /** Placeholder / example content, marked in the detail panel. */
  sample?: boolean;
  /** Extra text from template fields, for search. */
  searchText?: string;
}

export interface DetailFact {
  label: string;
  value: string;
}

export interface DetailSection {
  label: string;
  /** text: paragraphs · list: bullets · steps: numbered · notice: highlighted note */
  kind: "text" | "list" | "steps" | "notice";
  text?: string;
  items?: string[];
}

export type ObjectKind =
  | "tablet"
  | "monitor"
  | "book"
  | "folder"
  | "poster"
  | "frame"
  | "badge"
  | "screen"
  | "device"
  | "model-dna"
  | "model-cell"
  | "terrarium"
  | "kiosk";

export interface Zone {
  id: string;
  floorId: string;
  name: string;
  /** Short English sub-label shown under Korean names. */
  nameEn?: string;
  sceneType: ZoneScene;
  description: string;
  /** Accent colour for signage. */
  accent?: string;
  /** Lobby info stations open a special panel instead of an item list. */
  panel?: "about" | "featured" | "updates";
  order: number;
}

/** Light-touch scene hints a floor can pass to its archetype (all optional). */
export interface FloorDecor {
  /** How full the central hall is furnished. Default "medium". */
  density?: "low" | "medium" | "high";
  /** Decorative plants in the hall and zones. Default true. */
  plants?: boolean;
}

export interface Floor {
  id: string;
  /** Positive above ground (1 = lobby), negative below. Ignored for rooftop. */
  floorNumber: number;
  /** Overrides the auto label ("4F", "B2", "RF"). */
  label?: string;
  name: string;
  nameEn?: string;
  tagline: string;
  description: string;
  type: FloorType;
  publishedAt: string;
  sceneType: SceneTemplate;
  /** Accent colour used in signage and exterior interior-glow tint. */
  accent: string;
  /** Optional presentation hints for the floor's scene archetype. */
  decor?: FloorDecor;
  order?: number;
}

export interface Recommendation {
  id: string;
  title: string;
  description?: string;
  /** Floor ids in visiting order. */
  route: string[];
}

export interface SiteProfile {
  name: string;
  title: string;
  headline: string;
  intro: string[];
  identity: { label: string; value: string }[];
  contact?: ItemLink[];
}

export interface UpdateEntry {
  date: string;
  text: string;
  floorId?: string;
  itemId?: string;
}
