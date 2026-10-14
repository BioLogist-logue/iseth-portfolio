import type { Floor, Zone } from "@/lib/types";
import { TEMPLATES, type PortfolioEntry } from "./schema";

/**
 * Lightweight content checks. Problems are reported in Korean with the
 * entry id so a non-developer can find the line to fix.
 *
 * - error: the entry cannot be shown correctly (it is left out)
 * - warning: shown, but something looks wrong (e.g. a malformed link)
 */
export interface ContentIssue {
  level: "error" | "warning";
  id: string;
  message: string;
}

const REQUIRED = ["id", "template", "title", "shortDescription", "floor", "zone", "publishedAt"] as const;
const ID_RE = /^[a-z0-9][a-z0-9-]*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Site-relative path ("/files/a.pdf") or an absolute http(s) URL. */
function badUrl(url: unknown) {
  if (typeof url !== "string" || !url.trim()) return true;
  if (url.startsWith("/") && !url.startsWith("//")) return /\s/.test(url.trim());
  try {
    const u = new URL(url);
    return u.protocol !== "http:" && u.protocol !== "https:";
  } catch {
    return true;
  }
}

export function validateEntries(entries: PortfolioEntry[], floors: Floor[], zones: Zone[]) {
  const issues: ContentIssue[] = [];
  const valid: PortfolioEntry[] = [];
  const seen = new Set<string>();
  const floorIds = new Set(floors.map((f) => f.id));
  const zoneMap = new Map(zones.map((z) => [z.id, z]));

  entries.forEach((e, index) => {
    const raw = e as unknown as Record<string, unknown>;
    const id = typeof e.id === "string" && e.id ? e.id : `(${index + 1}번째 항목)`;
    const err = (message: string) => issues.push({ level: "error", id, message });
    const warn = (message: string) => issues.push({ level: "warning", id, message });
    let ok = true;

    for (const key of REQUIRED) {
      const v = raw[key];
      if (typeof v !== "string" || !v.trim()) {
        err(`필수 항목 "${key}" 이(가) 비어 있습니다.`);
        ok = false;
      }
    }
    if (!ok) return;

    if (seen.has(e.id)) {
      err(`id "${e.id}" 가 중복됩니다. 다른 id를 써 주세요.`);
      return;
    }
    if (!(e.template in TEMPLATES)) {
      err(`알 수 없는 template "${e.template}" 입니다.`);
      return;
    }
    if (!floorIds.has(e.floor)) {
      err(`층 "${e.floor}" 이(가) 없습니다. src/content/floors.ts 의 id를 확인하세요.`);
      return;
    }
    const zone = zoneMap.get(e.zone);
    if (!zone) {
      err(`구역 "${e.zone}" 이(가) 없습니다. src/content/zones.ts 의 id를 확인하세요.`);
      return;
    }
    if (zone.floorId !== e.floor) {
      err(`구역 "${e.zone}" 은(는) ${zone.floorId} 층의 구역입니다. floor 를 "${zone.floorId}" 로 바꾸거나 구역을 확인하세요.`);
      return;
    }
    if (zone.panel) warn(`구역 "${e.zone}" 은(는) 안내 패널 전용이라 작품이 3D로 전시되지 않습니다.`);

    if (!ID_RE.test(e.id)) warn(`id 는 영문 소문자·숫자·하이픈(-)만 쓰는 것이 안전합니다.`);
    if (!DATE_RE.test(e.publishedAt) || Number.isNaN(Date.parse(e.publishedAt)))
      warn(`publishedAt "${e.publishedAt}" 은(는) YYYY-MM-DD 형식이어야 합니다. (NEW 표시에 쓰입니다)`);

    e.externalLinks?.forEach((l, i) => {
      if (!l.label?.trim()) warn(`externalLinks ${i + 1}번째 링크에 label(버튼 글자)이 없습니다.`);
      if (badUrl(l.url)) warn(`externalLinks 주소 "${l.url}" 이(가) 올바르지 않습니다. https:// 로 시작해야 합니다.`);
    });
    e.attachments?.forEach((a, i) => {
      if (!a.label?.trim()) warn(`attachments ${i + 1}번째 파일에 label 이 없습니다.`);
      if (badUrl(a.url)) warn(`첨부 파일 주소 "${a.url}" 이(가) 올바르지 않습니다. 예: "/files/자료.pdf"`);
    });
    if (e.thumbnail && badUrl(e.thumbnail)) warn(`thumbnail 주소 "${e.thumbnail}" 이(가) 올바르지 않습니다. 예: "/images/사진.png"`);
    e.gallery?.forEach((g) => {
      if (g.src && badUrl(g.src)) warn(`gallery 이미지 주소 "${g.src}" 이(가) 올바르지 않습니다.`);
      if (!g.alt?.trim()) warn(`gallery 이미지에 alt(설명)가 없습니다.`);
    });
    if (e.template === "badge" && e.credentialUrl && badUrl(e.credentialUrl))
      warn(`credentialUrl "${e.credentialUrl}" 이(가) 올바르지 않습니다.`);

    seen.add(e.id);
    valid.push(e);
  });

  return { valid, issues };
}

/**
 * Development: print issues in the console (the site keeps working without the
 * broken entries). Production build: fail loudly so broken content never ships.
 */
export function reportIssues(issues: ContentIssue[]) {
  if (!issues.length) return;
  const errors = issues.filter((i) => i.level === "error");
  const lines = issues.map((i) => `${i.level === "error" ? "✖" : "⚠"} [${i.id}] ${i.message}`).join("\n");
  const headline = `[콘텐츠 점검] 오류 ${errors.length}건, 경고 ${issues.length - errors.length}건`;
  if (errors.length && process.env.NODE_ENV === "production" && typeof window === "undefined") {
    throw new Error(`${headline}\n${lines}`);
  }
  if (process.env.NODE_ENV !== "production") {
    (errors.length ? console.error : console.warn)(`${headline}\n${lines}`);
  }
}
