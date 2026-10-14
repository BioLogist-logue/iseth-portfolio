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
    id: "philosophy-design-first",
    template: "philosophy",
    title: "도구보다 수업 설계가 먼저입니다",
    floor: "b3",
    zone: "b3-science",
    shortDescription: "AI와 개발 도구를 쓸 줄 아는 것보다, 무엇을 왜 만들어야 하는지 판단하는 것이 교사의 전문성이라고 생각합니다.",
    publishedAt: "2026-10-14",
    theme: "에듀테크와 교사의 전문성",
    belief: "AI와 개발 도구를 쓸 줄 아는 것보다, 무엇을 왜 만들어야 하는지 판단하는 것이 교사의 전문성이라고 생각합니다.",
    whyItMatters:
      "설명만으로는 이해시키기 어려운 순간을 만나면, 학생이 무엇을 배우고 직접 해 봐야 하는지부터 다시 설계합니다. 도구는 그 수업에 꼭 필요할 때만 만듭니다.",
    howItAppearsInPractice:
      "교실을 관찰합니다 — 학생이 어디에서 막히고 무엇을 어려워하는지 확인합니다.\n수업을 먼저 설계합니다 — 학습 목표, 활동, 평가와 피드백의 흐름을 짭니다.\n필요한 도구를 만듭니다 — 기술이 도움이 될 때만 최소한의 도구를 직접 만듭니다.\n실제 교실에서 씁니다 — 학생과 함께 쓰며 예상대로 작동하는지 확인합니다.\n결과를 보고 고칩니다 — 학생 반응, 설문, 관찰을 바탕으로 수정합니다.\n다른 교사와 나눕니다 — 수업 자료와 연수 사례로 정리해 공유합니다.",
    example:
      "세포 구조 추리 게임: 수업에서 사용한 뒤 학생 37명이 익명 설문에 응답했고(2026-07), \"설명이 부족했다\", \"게임이 너무 어려웠다\"는 응답이 각각 13.5%였습니다. v1.1에서 사건과 수사 방법을 먼저 안내하는 인트로를 넣고, 두 번 틀리면 초성 힌트를 주도록 바꿨습니다. (2026-09)",
    tags: ["교육 철학", "수업 설계", "에듀테크", "교사 전문성"],
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
