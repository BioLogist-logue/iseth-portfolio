import type { PhilosophyEntry } from "../schema";

/**
 * B3 교육 철학
 *
 * 템플릿: philosophy
 * 빈 양식: content-templates/philosophy-template.ts
 *
 * 새 작품은 아래 목록에 { ... }, 블록을 하나 더 붙여 넣으면 됩니다.
 * `sample: true` 가 붙은 항목은 예시(placeholder)입니다. 실제 내용으로 바꾸거나 지우세요.
 */
export const philosophyEntries: PhilosophyEntry[] = [
  // ── B3 교육 철학 ────────────────────────────────────────────
  {
    id: "philosophy-teaching",
    template: "philosophy",
    sample: true, // 예시 콘텐츠 — 실제 내용으로 바꾸면 이 줄을 지우세요
    title: "질문이 머무는 교실",
    type: "essay",
    floor: "b3",
    zone: "b3-teaching",
    shortDescription: "정답보다 좋은 질문이 오래 남는 수업을 지향합니다.",
    description:
      "학생이 ‘왜?’라고 물을 수 있을 때 배움이 시작된다고 믿습니다.\n\n그래서 수업의 첫 10분은 설명보다 질문을 모으는 데 씁니다.",
    publishedAt: "2026-03-05",
    tags: ["교육 철학", "질문", "학생 중심"],
    object: "frame",
  },
  {
    id: "philosophy-digital",
    template: "philosophy",
    sample: true, // 예시 콘텐츠 — 실제 내용으로 바꾸면 이 줄을 지우세요
    title: "도구는 질문을 따라온다",
    type: "essay",
    floor: "b3",
    zone: "b3-science",
    shortDescription: "디지털 도구와 AI는 탐구 질문을 돕기 위해 존재한다는 관점입니다.",
    publishedAt: "2026-03-05",
    tags: ["디지털 도구", "AI 교육", "과학교육"],
    object: "frame",
  },
  {
    id: "philosophy-assessment",
    template: "philosophy",
    sample: true, // 예시 콘텐츠 — 실제 내용으로 바꾸면 이 줄을 지우세요
    title: "평가는 다음 배움을 위한 지도",
    type: "essay",
    floor: "b3",
    zone: "b3-assessment",
    shortDescription: "평가는 줄 세우기가 아니라 학생이 다음 걸음을 정하도록 돕는 도구라고 생각합니다.",
    publishedAt: "2026-03-05",
    tags: ["평가 철학", "피드백"],
    object: "frame",
  },
];
