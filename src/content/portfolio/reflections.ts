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
    id: "iteration-cell-investigation-v1-1",
    template: "reflection",
    title: "세포 구조 추리 게임 v1.1 — 설명이 부족하다는 학생들의 목소리",
    floor: "b2",
    zone: "b2-iterations",
    shortDescription: "학생 설문에서 '설명이 부족했다', '너무 어려웠다'는 응답을 보고 인트로와 초성 힌트를 넣은 과정입니다.",
    publishedAt: "2026-09-01",
    date: "2026.07 설문 → 2026.09 v1.1",
    context: "세포 구조 추리 게임을 통합과학1 수업에 적용한 뒤, 학생 37명에게 구글 설문지로 익명 설문을 받았습니다. (2026-07)",
    problem: "사건 상황과 수사 방법을 안내받지 못한 채 바로 게임이 시작되었습니다.",
    whatHappened: "\"설명이 부족했다\", \"게임이 너무 어려웠다\"는 응답이 각각 13.5%였습니다. 화면 조작이 어려웠다는 응답도 13.5%였습니다.",
    changeMade: "v1.1에서 인트로 모달로 사건 상황과 수사 방법을 먼저 안내하고, 두 번 틀리면 초성 힌트를 주도록 바꿨습니다. (2026-09)",
    tags: ["앱 반복 개선", "학생 설문", "세포 구조 추리 게임"],
    externalLinks: [{ label: "Case Study", url: "https://biologue-tools.vercel.app/case-study.html?slug=cell-investigation", kind: "external" }],
    object: "folder",
  },
  {
    id: "iteration-bio-tree-v2-1",
    template: "reflection",
    title: "생물 분류 대시보드 v2.1 — 틀린 문제를 다시 보고 싶어요",
    floor: "b2",
    zone: "b2-iterations",
    shortDescription: "퀴즈를 끝낸 뒤 오답을 확인할 수 없다는 의견을 반영해 오답 다시보기와 해설을 추가한 과정입니다.",
    publishedAt: "2026-09-01",
    date: "2026.07 설문 → 2026.09 v2.1",
    context: "생물 분류 대시보드/게임을 수업에 적용한 뒤 학생 37명에게 익명 설문을 받았습니다. (2026-07)",
    problem: "퀴즈를 끝낸 뒤 틀린 문제를 다시 확인할 수 없었습니다.",
    whatHappened: "학생 설문 의견: \"재미있었던 것 같아요. 근데 틀린 문제를 다시 볼 수 없어서 아쉬웠던 것 같아요.\" 화면 이동이나 확대 · 축소가 어렵다(18.9%), 문제가 너무 쉬웠다(18.9%)는 응답도 있었습니다.",
    changeMade: "결과창에 오답 다시보기와 문항별 해설, 전체 문제 보기를 추가했습니다. (v2.1, 2026-09)",
    tags: ["앱 반복 개선", "학생 설문", "생물 분류"],
    externalLinks: [{ label: "Case Study", url: "https://biologue-tools.vercel.app/case-study.html?slug=bio-tree", kind: "external" }],
    object: "folder",
  },
  {
    id: "iteration-lab-detective",
    template: "reflection",
    title: "세포 속 시약 탐정 — 관찰로 말할 수 있는 범위 정하기",
    floor: "b2",
    zone: "b2-iterations",
    shortDescription: "배포 후 세 차례 업데이트와, 앱이 관찰 결과를 어디까지 설명할지 정한 설계 판단의 기록입니다.",
    publishedAt: "2026-09-01",
    date: "2026.07 배포 → 2026.09",
    context: "2026-07 배포 이후 교사 관리함 추가(v1.1), 물관 오개념 문항 제거와 진행도 오류 수정(v1.5), 보안 강화(v1.6)를 거쳤습니다.",
    problem: "현미경 관찰 결과를 앱이 어디까지 설명해 줄지 정해야 했습니다. 표본에서 붉게 염색된 입자를 보는 것만으로는 그 입자의 정확한 세포 위치나 이동 경로까지 알 수 없습니다.",
    changeMade:
      "교재 · 지도서 용어를 벗어난 단정을 하지 않는다는 표현 원칙을 문서로 고정하고, 화면에 \"이 관찰만으로 단정할 수 없습니다\"라는 주의 문구를 넣었습니다. 판정 근거가 대부분 색 변화이기 때문에, 색상과 함께 항상 기호와 텍스트를 쓰고 염색된 입자에는 점선 원형 마커를 함께 그렸습니다.",
    lessonLearned: "관찰 결과로 말할 수 있는 것과 말할 수 없는 것을 구분하는 것 자체가 이 수업의 학습 목표입니다.",
    tags: ["앱 반복 개선", "설계 판단", "접근성", "세포 속 시약 탐정"],
    externalLinks: [{ label: "Case Study", url: "https://biologue-tools.vercel.app/case-study.html?slug=lab-detective", kind: "external" }],
    object: "folder",
  },
];
