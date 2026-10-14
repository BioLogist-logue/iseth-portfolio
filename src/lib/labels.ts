import type { ItemStatus, ItemType } from "./types";

export const typeLabel: Record<ItemType, string> = {
  app: "앱",
  lesson: "수업",
  worksheet: "학습지",
  case: "수업 사례",
  lecture: "강의",
  certificate: "자격",
  badge: "배지",
  milestone: "이정표",
  document: "문서",
  tool: "도구",
  reflection: "성찰",
  essay: "에세이",
  template: "템플릿",
};

export const statusLabel: Record<ItemStatus, string> = {
  IDEA: "IDEA",
  PROTOTYPE: "PROTOTYPE",
  TESTING: "TESTING",
  RELEASE_CANDIDATE: "RELEASE CANDIDATE",
  RELEASED: "RELEASED",
  ARCHIVED: "ARCHIVED",
};

export const statusColor: Record<ItemStatus, string> = {
  IDEA: "#3f7fd6",
  PROTOTYPE: "#e08a2e",
  TESTING: "#2f9a5a",
  RELEASE_CANDIDATE: "#d0453a",
  RELEASED: "#6c7a89",
  ARCHIVED: "#8a8a8a",
};

export function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}
