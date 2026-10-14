import { content } from "@/content";
import type { Floor, PortfolioItem, Zone } from "./types";

const DAY = 24 * 60 * 60 * 1000;
export const NEW_WINDOW_DAYS = 14;

export function floorLabel(floor: Floor): string {
  if (floor.label) return floor.label;
  if (floor.type === "rooftop") return "RF";
  return floor.floorNumber < 0 ? `B${-floor.floorNumber}` : `${floor.floorNumber}F`;
}

/** Short label for elevator buttons ("4", "B2", "RF"). */
export function buttonLabel(floor: Floor): string {
  const l = floorLabel(floor);
  return /^\d+F$/.test(l) ? l.slice(0, -1) : l;
}

function sortKey(f: Floor) {
  return f.type === "rooftop" ? Number.MAX_SAFE_INTEGER : f.floorNumber;
}

/** Bottom → top. The elevator shaft order. */
export const shaftOrder: Floor[] = [...content.floors].sort((a, b) => sortKey(a) - sortKey(b));
/** Top → bottom. Directory display order. */
export const directoryOrder: Floor[] = [...shaftOrder].reverse();

export const aboveGround = shaftOrder.filter((f) => f.type === "lobby" || f.type === "standard");
export const basements = shaftOrder.filter((f) => f.type === "basement").reverse(); // B1, B2, ...
export const rooftop = shaftOrder.find((f) => f.type === "rooftop");
export const lobby = shaftOrder.find((f) => f.type === "lobby") ?? shaftOrder[0];

const floorMap = new Map(content.floors.map((f) => [f.id, f]));
const zoneMap = new Map(content.zones.map((z) => [z.id, z]));
const itemMap = new Map(content.items.map((i) => [i.id, i]));

export const getFloor = (id: string) => floorMap.get(id);
export const getZone = (id: string) => zoneMap.get(id);
export const getItem = (id: string) => itemMap.get(id);

export function zonesOf(floorId: string): Zone[] {
  return content.zones.filter((z) => z.floorId === floorId).sort((a, b) => a.order - b.order);
}

export function itemsOfZone(zoneId: string): PortfolioItem[] {
  return content.items.filter((i) => i.zoneId === zoneId);
}

export function itemsOfFloor(floorId: string): PortfolioItem[] {
  const ids = new Set(zonesOf(floorId).map((z) => z.id));
  return content.items.filter((i) => ids.has(i.zoneId));
}

export function locateItem(item: PortfolioItem) {
  const zone = getZone(item.zoneId);
  const floor = zone ? getFloor(zone.floorId) : undefined;
  return { zone, floor };
}

export function isNew(publishedAt: string, now = Date.now()): boolean {
  const t = Date.parse(publishedAt);
  if (Number.isNaN(t)) return false;
  const diff = now - t;
  return diff >= -DAY && diff <= NEW_WINDOW_DAYS * DAY;
}

export function floorHasNew(floorId: string, now = Date.now()) {
  const f = getFloor(floorId);
  if (f && isNew(f.publishedAt, now)) return true;
  return itemsOfFloor(floorId).some((i) => isNew(i.publishedAt, now));
}

export const shaftIndex = (floorId: string) => shaftOrder.findIndex((f) => f.id === floorId);

/** Floors passed through, excluding origin, including destination. */
export function floorsBetween(fromId: string, toId: string): Floor[] {
  const a = shaftIndex(fromId);
  const b = shaftIndex(toId);
  if (a < 0 || b < 0 || a === b) return [];
  const step = b > a ? 1 : -1;
  const out: Floor[] = [];
  for (let i = a + step; i !== b + step; i += step) out.push(shaftOrder[i]);
  return out;
}

/** Seconds. Proportional to distance, capped for web UX. */
export function travelDuration(fromId: string, toId: string, reducedMotion = false): number {
  const n = Math.abs(shaftIndex(toId) - shaftIndex(fromId));
  if (n === 0) return 0;
  if (reducedMotion) return Math.min(0.9, 0.4 + 0.08 * n);
  return Math.min(2.8, 1.0 + 0.3 * (n - 1));
}

export const featuredItems = content.items.filter((i) => i.featured);
export const latestItems = [...content.items]
  .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
  .slice(0, 6);

if (process.env.NODE_ENV !== "production") {
  for (const z of content.zones) {
    if (!floorMap.has(z.floorId)) console.warn(`[content] zone "${z.id}" references unknown floor "${z.floorId}"`);
  }
  // Portfolio entries are checked in src/content/validate.ts.
}
