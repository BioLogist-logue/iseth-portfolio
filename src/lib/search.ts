import { content } from "@/content";
import { floorLabel, getFloor, getZone } from "./building";
import { typeLabel } from "./labels";

export type SearchKind = "item" | "zone" | "floor";

export interface SearchEntry {
  kind: SearchKind;
  id: string;
  title: string;
  subtitle: string;
  floorId: string;
  zoneId?: string;
  tags: string[];
  haystack: string;
  initials: string;
}

const CHO = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";

/** Hangul initial consonants, so "ㄷㄴㅇ" finds "DNA 이중나선…" style queries. */
function initialsOf(s: string) {
  let out = "";
  for (const ch of s) {
    const c = ch.charCodeAt(0);
    if (c >= 0xac00 && c <= 0xd7a3) out += CHO[Math.floor((c - 0xac00) / 588)];
    else out += ch.toLowerCase();
  }
  return out.replace(/\s+/g, "");
}

export const normalize = (s: string) => s.normalize("NFC").toLowerCase().replace(/\s+/g, "");

function buildIndex(): SearchEntry[] {
  const out: SearchEntry[] = [];
  for (const f of content.floors) {
    const label = floorLabel(f);
    out.push({
      kind: "floor",
      id: f.id,
      title: `${label} ${f.name}`,
      subtitle: f.nameEn ?? f.tagline,
      floorId: f.id,
      tags: [],
      haystack: normalize([label, f.name, f.nameEn, f.tagline].join(" ")),
      initials: initialsOf(f.name),
    });
  }
  for (const z of content.zones) {
    const f = getFloor(z.floorId);
    out.push({
      kind: "zone",
      id: z.id,
      title: z.name,
      subtitle: f ? `${floorLabel(f)} ${f.name}` : "",
      floorId: z.floorId,
      zoneId: z.id,
      tags: [],
      haystack: normalize([z.name, z.nameEn, z.description].join(" ")),
      initials: initialsOf(z.name),
    });
  }
  for (const i of content.items) {
    const z = getZone(i.zoneId);
    const f = z ? getFloor(z.floorId) : undefined;
    if (!z || !f) continue;
    out.push({
      kind: "item",
      id: i.id,
      title: i.title,
      subtitle: `${floorLabel(f)} · ${z.name} · ${typeLabel[i.type]}`,
      floorId: f.id,
      zoneId: z.id,
      tags: i.tags,
      haystack: normalize([i.title, i.description, typeLabel[i.type], i.type, ...i.tags, ...(i.tools ?? []), i.searchText ?? ""].join(" ")),
      initials: initialsOf(i.title),
    });
  }
  return out;
}

let index: SearchEntry[] | null = null;

export function search(query: string, limit = 20): SearchEntry[] {
  index ??= buildIndex();
  const q = normalize(query);
  if (!q) return [];
  const isChoOnly = /^[ㄱ-ㅎ]+$/.test(q);
  const scored: { e: SearchEntry; s: number }[] = [];
  for (const e of index) {
    let s = 0;
    const title = normalize(e.title);
    if (title.startsWith(q)) s += 10;
    else if (title.includes(q)) s += 6;
    if (e.tags.some((t) => normalize(t) === q)) s += 8;
    else if (e.tags.some((t) => normalize(t).includes(q))) s += 4;
    if (!s && e.haystack.includes(q)) s += 2;
    if (isChoOnly && e.initials.includes(q)) s += 5;
    if (s) scored.push({ e, s: s + (e.kind === "item" ? 0.5 : 0) });
  }
  return scored.sort((a, b) => b.s - a.s).slice(0, limit).map((x) => x.e);
}
