import type { Attachment, DetailFact, DetailSection, ItemLink, PortfolioItem } from "@/lib/types";
import { TEMPLATES, type AttachmentInput, type PortfolioEntry } from "./schema";

/**
 * Turns an authored entry (src/content/portfolio) into the runtime
 * `PortfolioItem` the 3D scene and panels already understand. Template fields
 * become labelled facts / sections, so the UI never needs per-template code.
 */
export function toPortfolioItem(entry: PortfolioEntry): PortfolioItem {
  const spec = TEMPLATES[entry.template];
  const extra = entry as unknown as Record<string, unknown>;
  const facts: DetailFact[] = [];
  const sections: DetailSection[] = [];
  const tools: string[] = [];
  const links: ItemLink[] = [...(entry.externalLinks ?? [])];
  const search: string[] = [];

  for (const f of spec.fields) {
    const raw = extra[f.key as string];
    const list = asList(raw);
    const text = asText(raw);
    if (!list.length && !text) continue; // empty fields render nothing
    search.push(text || list.join(" "));
    switch (f.kind) {
      case "fact":
        facts.push({ label: f.label, value: text || list.join(", ") });
        break;
      case "tools":
        tools.push(...(list.length ? list : [text]));
        break;
      case "link":
        links.push({ label: f.label, url: text, kind: "external" });
        break;
      case "list":
      case "steps":
        if (list.length) sections.push({ label: f.label, kind: f.kind, items: list });
        else sections.push({ label: f.label, kind: "text", text });
        break;
      default:
        sections.push({ label: f.label, kind: f.kind, text: text || list.join("\n") });
    }
  }

  return {
    id: entry.id,
    title: entry.title,
    type: entry.type ?? spec.type,
    zoneId: entry.zone,
    description: entry.shortDescription,
    details: entry.description?.trim() || undefined,
    thumbnail: entry.thumbnail || undefined,
    thumbnailAlt: entry.thumbnailAlt,
    publishedAt: entry.publishedAt,
    date: entry.date || undefined,
    role: entry.role || undefined,
    tools: tools.length ? [...new Set(tools)] : undefined,
    links: links.filter((l) => l.url).length ? links.filter((l) => l.url) : undefined,
    attachments: entry.attachments?.filter((a) => a.url).map(toAttachment),
    gallery: entry.gallery?.filter((g) => g.src || g.seed || g.alt),
    tags: entry.tags?.filter(Boolean) ?? [],
    status: entry.status,
    featured: entry.featured,
    object: entry.object,
    template: entry.template,
    facts: facts.length ? facts : undefined,
    sections: sections.length ? sections : undefined,
    sample: entry.sample,
    searchText: search.join(" ") || undefined,
  };
}

function asText(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function asList(v: unknown): string[] {
  return Array.isArray(v) ? v.map((x) => String(x).trim()).filter(Boolean) : [];
}

const KIND_BY_EXT: Record<string, Attachment["kind"]> = {
  pdf: "pdf",
  png: "image",
  jpg: "image",
  jpeg: "image",
  gif: "image",
  webp: "image",
  svg: "image",
  ppt: "slide",
  pptx: "slide",
  key: "slide",
  doc: "doc",
  docx: "doc",
  hwp: "doc",
  hwpx: "doc",
  txt: "doc",
  xls: "sheet",
  xlsx: "sheet",
  csv: "sheet",
  zip: "zip",
};

function toAttachment(a: AttachmentInput, i: number): Attachment {
  const ext = a.url.split(/[?#]/)[0].split(".").pop()?.toLowerCase() ?? "";
  return {
    id: a.id ?? `file-${i + 1}`,
    label: a.label,
    url: a.url,
    kind: a.kind ?? KIND_BY_EXT[ext] ?? "other",
    preview: a.preview,
    sizeLabel: a.sizeLabel,
  };
}
