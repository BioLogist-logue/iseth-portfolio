import type { LectureEntry } from "../schema";

/**
 * 5F 연수 · 강의
 *
 * 템플릿: lecture
 * 빈 양식: content-templates/lecture-template.ts
 *
 * 새 작품은 아래 목록에 { ... }, 블록을 하나 더 붙여 넣으면 됩니다.
 * `sample: true` 가 붙은 항목은 예시(placeholder)입니다. 실제 내용으로 바꾸거나 지우세요.
 */
export const lectureEntries: LectureEntry[] = [
  // ── 5F 연수 · 강의 ──────────────────────────────────────────
  {
    id: "lecture-edutech-2026",
    template: "lecture",
    sample: true, // 예시 콘텐츠 — 실제 내용으로 바꾸면 이 줄을 지우세요
    title: "교사가 직접 만드는 수업용 앱",
    type: "lecture",
    floor: "5f",
    zone: "5f-lectures",
    featured: true,
    shortDescription: "코딩 경험이 적은 교사도 수업에 필요한 작은 앱을 만들 수 있도록 안내한 연수입니다.",
    publishedAt: "2026-07-24",
    date: "2026.07 · 교사 연수 (3시간)",
    role: "강사",
    tags: ["교사 연수", "에듀테크", "앱 개발"],
    attachments: [{ id: "a1", label: "발표 자료", kind: "pdf", url: "/files/sample.pdf", preview: true }],
    // ── 템플릿 필드 예시 ──
    audience: "중등 교사 30명",
    organization: "○○교육청 (예시)",
    duration: "3시간",
    format: "강의 + 실습",
    objectives: ["수업에 필요한 작은 앱의 아이디어를 구체화한다.", "노코드 · 로우코드 도구로 첫 화면을 만들어 본다."],
    topics: ["교사가 앱을 만드는 이유", "아이디어를 화면으로 옮기기", "수업 적용과 개선"],
    activities: ["내 수업의 불편함 찾기", "종이 프로토타입", "도구로 첫 화면 만들기"],
    feedback: "\"생각보다 빨리 만들 수 있어 놀랐다\"는 의견이 많았습니다. (예시)",
    reflection: "실습 시간이 부족했습니다. 다음에는 예제 파일을 미리 나눠 드리려 합니다.",
    object: "screen",
  },
  {
    id: "workshop-apps-script",
    template: "lecture",
    sample: true, // 예시 콘텐츠 — 실제 내용으로 바꾸면 이 줄을 지우세요
    title: "Apps Script로 업무 자동화하기 워크숍",
    type: "lecture",
    floor: "5f",
    zone: "5f-workshops",
    shortDescription: "출결·과제 확인 업무를 자동화하는 실습형 워크숍입니다.",
    publishedAt: "2026-08-12",
    tags: ["워크숍", "Apps Script", "자동화"],
    object: "monitor",
  },
  {
    id: "material-ai-guide",
    template: "lecture",
    sample: true, // 예시 콘텐츠 — 실제 내용으로 바꾸면 이 줄을 지우세요
    title: "수업 속 AI 활용 안내서",
    type: "document",
    floor: "5f",
    zone: "5f-materials",
    shortDescription: "연수 참여 교사를 위한 AI 활용 수업 설계 안내서입니다.",
    publishedAt: "2026-06-30",
    tags: ["연수 자료", "AI 활용"],
    attachments: [{ id: "a1", label: "안내서 내려받기", kind: "pdf", url: "/files/sample.pdf" }],
    object: "book",
  },
];
