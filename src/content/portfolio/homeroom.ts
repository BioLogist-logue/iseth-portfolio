import type { HomeroomEntry } from "../schema";

/**
 * B4 담임 아카이브
 *
 * 템플릿: homeroom
 * 빈 양식: content-templates/homeroom-template.ts
 *
 * 새 작품은 아래 목록에 { ... }, 블록을 하나 더 붙여 넣으면 됩니다.
 * `sample: true` 가 붙은 항목은 예시(placeholder)입니다. 실제 내용으로 바꾸거나 지우세요.
 */
export const homeroomEntries: HomeroomEntry[] = [
  // ── B4 담임 아카이브 ────────────────────────────────────────
  {
    id: "homeroom-routine",
    template: "homeroom",
    sample: true, // 예시 콘텐츠 — 실제 내용으로 바꾸면 이 줄을 지우세요
    title: "아침 10분 학급 루틴",
    type: "document",
    floor: "b4",
    zone: "b4-management",
    shortDescription: "출결 확인, 오늘의 한 문장, 일정 공유로 이루어진 아침 루틴입니다.",
    publishedAt: "2026-03-02",
    tags: ["학급 운영", "루틴"],
    // ── 템플릿 필드 예시 ──
    category: "학급 운영",
    privacyNote: "학생 이름, 사진, 개인 기록은 포함하지 않았습니다. 모든 내용은 일반화된 예시입니다.",
    problemOrNeed: "아침 시간이 산만하게 흘러가 하루를 차분히 시작하기 어려웠습니다.",
    approach: "매일 같은 순서의 짧은 루틴으로 하루를 여는 방식을 택했습니다.",
    materialsUsed: ["오늘의 한 문장 카드", "주간 일정표"],
    process: ["출결 확인", "오늘의 한 문장 함께 읽기", "하루 일정 공유"],
    result: "아침 조회 시간이 일정해지고 학생들이 스스로 준비하는 모습이 늘었습니다.",
    reflection: "루틴은 짧고 예측 가능할수록 오래 유지되었습니다.",
    object: "book",
  },
  {
    id: "homeroom-parent-letter",
    template: "homeroom",
    sample: true, // 예시 콘텐츠 — 실제 내용으로 바꾸면 이 줄을 지우세요
    title: "학기 초 학부모 안내문 예시 (익명화)",
    type: "template",
    floor: "b4",
    zone: "b4-communication",
    shortDescription: "학급 운영 방향과 소통 방법을 안내하는 학부모 안내문 예시입니다.",
    publishedAt: "2026-03-03",
    tags: ["학부모 소통", "안내문", "익명화"],
    object: "folder",
  },
  {
    id: "homeroom-counsel-template",
    template: "homeroom",
    sample: true, // 예시 콘텐츠 — 실제 내용으로 바꾸면 이 줄을 지우세요
    title: "학생 상담 기록 템플릿",
    type: "template",
    floor: "b4",
    zone: "b4-templates",
    shortDescription: "상담 주제, 학생의 말, 합의한 다음 단계를 간단히 남기는 템플릿입니다.",
    publishedAt: "2026-03-04",
    tags: ["템플릿", "상담"],
    attachments: [{ id: "a1", label: "템플릿 내려받기", kind: "doc", url: "/files/sample.pdf" }],
    object: "folder",
  },
];
