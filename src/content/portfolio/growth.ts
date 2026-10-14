import type { BadgeEntry, MilestoneEntry } from "../schema";

/**
 * 6F 성장 전시관
 *
 * 템플릿: badge (배지·자격) · milestone (이정표)
 * 빈 양식: content-templates/badge-template.ts, milestone-template.ts
 *
 * 새 작품은 아래 목록에 { ... }, 블록을 하나 더 붙여 넣으면 됩니다.
 * `sample: true` 가 붙은 항목은 예시(placeholder)입니다. 실제 내용으로 바꾸거나 지우세요.
 */
export const growthEntries: (BadgeEntry | MilestoneEntry)[] = [
  // ── 6F 성장 전시관 ──────────────────────────────────────────
  {
    id: "badge-google-educator",
    template: "badge",
    sample: true, // 예시 콘텐츠 — 실제 내용으로 바꾸면 이 줄을 지우세요
    title: "Google 공인 교육자 배지",
    type: "badge",
    floor: "6f",
    zone: "6f-badges",
    shortDescription: "디지털 도구 활용 역량 인증 배지입니다.",
    publishedAt: "2025-11-02",
    tags: ["배지", "디지털 역량"],
    // ── 템플릿 필드 예시 ──
    issuer: "발급 기관 이름 (예시)",
    credentialType: "디지털 배지",
    credentialUrl: "https://example.com",
    whatILearned: "수업에서 공동 편집 도구와 설문 도구를 활용하는 방법을 체계적으로 익혔습니다.",
    object: "badge",
  },
  {
    id: "badge-ai-teacher",
    template: "badge",
    sample: true, // 예시 콘텐츠 — 실제 내용으로 바꾸면 이 줄을 지우세요
    title: "AI 교육 선도교사",
    type: "badge",
    floor: "6f",
    zone: "6f-badges",
    shortDescription: "AI 교육 선도교사 활동 인증입니다.",
    publishedAt: "2026-02-20",
    tags: ["배지", "AI 교육"],
    object: "badge",
  },
  {
    id: "cert-data-analysis",
    template: "badge",
    sample: true, // 예시 콘텐츠 — 실제 내용으로 바꾸면 이 줄을 지우세요
    title: "데이터 분석 전문 과정 수료",
    type: "certificate",
    floor: "6f",
    zone: "6f-certs",
    shortDescription: "교육 데이터 분석 전문 연수 과정 수료증입니다.",
    publishedAt: "2025-08-30",
    tags: ["수료", "데이터 분석"],
    object: "frame",
  },
  {
    id: "milestone-first-app",
    template: "milestone",
    sample: true, // 예시 콘텐츠 — 실제 내용으로 바꾸면 이 줄을 지우세요
    title: "첫 수업용 앱 배포",
    type: "milestone",
    floor: "6f",
    zone: "6f-timeline",
    shortDescription: "직접 만든 앱을 처음으로 수업에 사용한 날입니다.",
    publishedAt: "2024-04-15",
    date: "2024.04",
    tags: ["이정표", "앱 개발"],
    object: "frame",
  },
  {
    id: "milestone-first-lecture",
    template: "milestone",
    sample: true, // 예시 콘텐츠 — 실제 내용으로 바꾸면 이 줄을 지우세요
    title: "첫 교사 연수 강의",
    type: "milestone",
    floor: "6f",
    zone: "6f-timeline",
    shortDescription: "동료 교사들 앞에서 처음으로 수업 사례를 나눈 연수입니다.",
    publishedAt: "2025-07-20",
    date: "2025.07",
    tags: ["이정표", "연수"],
    object: "frame",
  },
];
