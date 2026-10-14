import type { ReflectionEntry } from "../schema";

/**
 * B2 성찰 아카이브
 *
 * 템플릿: reflection
 * 빈 양식: content-templates/reflection-template.ts
 *
 * 새 작품은 아래 목록에 { ... }, 블록을 하나 더 붙여 넣으면 됩니다.
 * `sample: true` 가 붙은 항목은 예시(placeholder)입니다. 실제 내용으로 바꾸거나 지우세요.
 */
export const reflectionEntries: ReflectionEntry[] = [
  // ── B2 성찰 아카이브 ────────────────────────────────────────
  {
    id: "reflection-failed-lab",
    template: "reflection",
    sample: true, // 예시 콘텐츠 — 실제 내용으로 바꾸면 이 줄을 지우세요
    title: "너무 많은 변인을 열어 둔 탐구 수업",
    type: "reflection",
    floor: "b2",
    zone: "b2-lessons",
    shortDescription: "자율성을 주려다 탐구가 흩어졌던 수업과, 그 뒤 ‘선택지가 있는 구조’로 바꾼 과정입니다.",
    publishedAt: "2026-05-25",
    tags: ["성찰", "수업 개선", "탐구 설계"],
    // ── 템플릿 필드 예시 ──
    context: "학생 주도 탐구를 처음 시도한 수업이었습니다.",
    problem: "모둠마다 변인을 자유롭게 정하게 했더니 탐구 방향이 흩어졌습니다.",
    whatHappened: "실험이 끝나도 결과를 비교할 수 없었고, 정리 시간이 부족했습니다.",
    whatDidNotWork: "자율성만 주고 탐구를 이끌 구조를 주지 않았습니다.",
    changeMade: "변인 선택지를 3개로 제한한 '선택지가 있는 구조'로 바꾸었습니다.",
    result: "모둠별 결과를 서로 비교하며 토론할 수 있게 되었습니다.",
    lessonLearned: "자율성은 구조 안에서 더 잘 자랍니다.",
    nextStep: "선택지를 학생이 함께 정하는 단계로 넓혀 보려 합니다.",
    object: "book",
  },
  {
    id: "reflection-app-v1",
    template: "reflection",
    sample: true, // 예시 콘텐츠 — 실제 내용으로 바꾸면 이 줄을 지우세요
    title: "아무도 쓰지 않았던 앱 v1",
    type: "reflection",
    floor: "b2",
    zone: "b2-iterations",
    shortDescription: "기능은 많았지만 수업 흐름과 맞지 않았던 첫 버전과, 기능을 덜어낸 v2 이야기입니다.",
    publishedAt: "2026-06-18",
    tags: ["성찰", "앱 반복 개선", "배운 점"],
    object: "folder",
  },
];
