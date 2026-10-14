import type { AiCaseEntry, AiLiteracyEntry } from "../schema";

/**
 * 3F AI · 디지털 실천
 *
 * 템플릿: ai-case (수업 사례) · ai-literacy (AI 리터러시)
 * 빈 양식: content-templates/ai-digital-template.ts, ai-literacy-template.ts
 *
 * 새 작품은 아래 목록에 { ... }, 블록을 하나 더 붙여 넣으면 됩니다.
 * `sample: true` 가 붙은 항목은 예시(placeholder)입니다. 실제 내용으로 바꾸거나 지우세요.
 */
export const aiDigitalEntries: (AiCaseEntry | AiLiteracyEntry)[] = [
  // ── 3F AI · 디지털 실천 ─────────────────────────────────────
  {
    id: "case-ai-hypothesis",
    template: "ai-case",
    sample: true, // 예시 콘텐츠 — 실제 내용으로 바꾸면 이 줄을 지우세요
    title: "생성형 AI와 함께 가설 다듬기",
    type: "case",
    floor: "3f",
    zone: "3f-cases",
    featured: true,
    shortDescription: "학생이 세운 가설을 AI와 대화하며 검증 가능한 형태로 다듬어 보는 수업 사례입니다.",
    publishedAt: "2026-06-02",
    date: "2026년 1학기 · 고1",
    role: "수업 설계 · 운영",
    toolUsed: ["ChatGPT", "Padlet"],
    tags: ["생성형 AI", "가설", "수업 사례"],
    // ── 템플릿 필드 예시 ──
    subject: "통합과학",
    grade: "고등학교 1학년",
    problem: "학생들이 세운 가설이 검증하기 어려운 막연한 문장인 경우가 많았습니다.",
    whyThisTool: "학생 질문에 즉시 반응하면서도 정답을 주지 않도록 프롬프트를 설계할 수 있었기 때문입니다.",
    lessonFlow: ["가설 작성", "AI에게 반례 요청", "모둠 토론", "가설 수정", "교사 피드백"],
    studentUse: "모둠별로 AI에게 자신의 가설에 대한 반례를 요청하고, 그 반례가 타당한지 토론했습니다.",
    teacherRole: "AI의 응답을 그대로 받아들이지 않도록 근거를 묻는 질문을 던지는 데 집중했습니다.",
    outcome: "수정된 가설의 대부분이 측정 가능한 변인을 포함하게 되었습니다.",
    reflection: "AI가 제시한 반례 중 일부는 과학적으로 부정확했고, 이것이 오히려 좋은 토론 거리가 되었습니다.",
    object: "screen",
  },
  {
    id: "case-digital-textbook",
    template: "ai-case",
    sample: true, // 예시 콘텐츠 — 실제 내용으로 바꾸면 이 줄을 지우세요
    title: "디지털 도구로 만드는 협업 실험 보고서",
    type: "case",
    floor: "3f",
    zone: "3f-cases",
    shortDescription: "공동 편집 문서로 모둠 실험 보고서를 작성하고 상호 피드백한 사례입니다.",
    publishedAt: "2026-05-19",
    tags: ["협업", "디지털 도구", "실험 보고서"],
    object: "monitor",
  },
  {
    id: "literacy-hallucination",
    template: "ai-literacy",
    sample: true, // 예시 콘텐츠 — 실제 내용으로 바꾸면 이 줄을 지우세요
    title: "AI는 언제 틀릴까? — 환각 찾기 활동",
    type: "lesson",
    floor: "3f",
    zone: "3f-literacy",
    shortDescription: "AI 응답 속 사실 오류를 찾아 출처를 확인하고, 응답의 신뢰도를 평가해 보는 활동입니다.",
    publishedAt: "2026-10-09",
    tags: ["AI 리터러시", "환각", "출처 확인"],
    object: "screen",
  },
  {
    id: "literacy-ethics",
    template: "ai-literacy",
    sample: true, // 예시 콘텐츠 — 실제 내용으로 바꾸면 이 줄을 지우세요
    title: "책임 있는 AI 사용 약속 만들기",
    type: "lesson",
    floor: "3f",
    zone: "3f-literacy",
    shortDescription: "AI 윤리 사례를 토론한 뒤 우리 반의 AI 사용 원칙을 함께 정합니다.",
    publishedAt: "2026-04-22",
    tags: ["AI 윤리", "책임 있는 사용"],
    object: "poster",
  },
];
