import type { LectureEntry } from "../schema";

/**
 * 5F 연수 · 강의
 *
 * 템플릿: lecture
 * 빈 양식: content-templates/lecture-template.ts
 *
 * 새 작품은 아래 목록에 { ... }, 블록을 하나 더 붙여 넣으면 됩니다.
 * 내용 출처: iSETH 허브 연수/강의 기록(https://biologue-tools.vercel.app/lectures.html).
 * `sample: true` 가 붙은 항목은 예시(placeholder)입니다. 실제 내용으로 바꾸거나 지우세요.
 *
 * 구역
 * - 5f-lectures  과학 교사 연수 (서울시교육청)
 * - 5f-workshops AI WING UP 연수 (강서양천교육지원청)
 * - 5f-materials 연수 자료실
 */
const LECTURES = "https://biologue-tools.vercel.app/lectures.html";
const record = (id: string) => ({ label: "연수 기록 보기", url: `${LECTURES}#${id}`, kind: "external" as const });

export const lectureEntries: LectureEntry[] = [
  // ── 과학 교사 연수 (서울시교육청) ──────────────────────────
  {
    id: "science-webapp-2026-10-28",
    template: "lecture",
    title: "탐구형 과학 웹앱 제작하기 · 구로구",
    floor: "5f",
    zone: "5f-lectures",
    shortDescription: "구로구 고등학교 과학 교사와 함께 탐구형 과학 웹앱을 만들어 보는 연수입니다. (예정)",
    publishedAt: "2026-10-14", // 타워에 올린 날 (연수 날짜는 date)
    date: "2026.10.28 (수) · 예정",
    role: "강사",
    audience: "구로구 고등학교 과학 교사",
    organization: "서울시교육청",
    duration: "2시간",
    format: "집합 연수",
    materials: ["준비물: 개별 노트북, SEN스쿨 계정"],
    tags: ["교사 연수", "웹앱 제작", "탐구 수업"],
    externalLinks: [record("science-webapp-2026-10-28")],
    object: "screen",
  },
  {
    id: "sensor-inquiry-2026-10-16",
    template: "lecture",
    title: "센서 데이터로 탐구하는 수업 (가제)",
    floor: "5f",
    zone: "5f-lectures",
    shortDescription: "서울시 중등 과학 교사 대상으로 센서 수업, 데이터 처리 · 분석, 센서 기반 융합탐구수업을 다루는 10시간 연수입니다. (예정)",
    publishedAt: "2026-10-14", // 타워에 올린 날 (연수 날짜는 date)
    date: "2026.10.16 (금) ~ 10.17 (토) · 예정",
    role: "강사",
    description: "연수에서 함께 쓰는 도구: 탐구 실험에 맞는 센서 고르기, 과학 실험 데이터 분석·탐구실 (4F 탐구 · 교사용 도구에 전시)",
    audience: "서울시 중등 과학 교사",
    organization: "서울시교육청",
    duration: "10시간",
    format: "집합 연수",
    topics: ["회사별 센서 비교 안내", "센서 수업, 왜 필요한가요?", "데이터 처리 및 분석 실제", "센서 기반 실험으로 하나되는 융합탐구수업"],
    materials: ["준비물: 개별 노트북"],
    tags: ["교사 연수", "센서", "데이터 분석", "융합탐구"],
    externalLinks: [record("sensor-inquiry-2026-10-16")],
    object: "monitor",
  },
  {
    id: "science-webapp-2026-09-07",
    template: "lecture",
    title: "탐구형 과학 웹앱 제작하기 · 관악구",
    floor: "5f",
    zone: "5f-lectures",
    shortDescription: "관악구 고등학교 과학 교사와 함께 탐구형 과학 웹앱을 만들어 본 연수입니다.",
    publishedAt: "2026-09-07",
    date: "2026.09.07",
    role: "강사",
    audience: "관악구 고등학교 과학 교사",
    organization: "서울시교육청",
    duration: "2시간",
    format: "집합 연수",
    materials: ["준비물: 개별 노트북, SEN스쿨 계정"],
    tags: ["교사 연수", "웹앱 제작", "탐구 수업"],
    externalLinks: [record("science-webapp-2026-09-07")],
    object: "screen",
  },
  {
    id: "science-webapp-2026-08-24",
    template: "lecture",
    title: "탐구형 과학 웹앱 제작하기 · 양천구",
    floor: "5f",
    zone: "5f-lectures",
    shortDescription: "양천구 고등학교 과학 교사와 함께 탐구형 과학 웹앱을 만들어 본 연수입니다.",
    publishedAt: "2026-08-24",
    date: "2026.08.24",
    role: "강사",
    audience: "양천구 고등학교 과학 교사",
    organization: "서울시교육청",
    duration: "2시간",
    format: "집합 연수",
    materials: ["준비물: 개별 노트북, SEN스쿨 계정"],
    tags: ["교사 연수", "웹앱 제작", "탐구 수업"],
    externalLinks: [record("science-webapp-2026-08-24")],
    object: "screen",
  },

  // ── AI WING UP 연수 (강서양천교육지원청) ───────────────────
  {
    id: "aiwingup-2026-10-14",
    template: "lecture",
    title: "구글 등 기본 툴 안내 및 교원 AI∙디지털 교육 역량체계",
    floor: "5f",
    zone: "5f-workshops",
    shortDescription: "에듀테크가 처음인 교사에게 구글 툴, 디벗 사용법과 교원 AI∙디지털 교육 역량체계를 안내한 연수입니다.",
    publishedAt: "2026-10-14",
    date: "2026.10.14 (수)",
    role: "멘토 강사",
    audience: "에듀테크가 처음인 교사",
    organization: "강서양천교육지원청",
    duration: "2시간",
    format: "집합 연수",
    topics: ["구글 툴 기본 사용법 안내", "디벗 사용법 안내", "교원 AI∙디지털 교육 역량체계 안내"],
    materials: ["준비물: 개별 노트북, 지식샘터 계정"],
    tags: ["교사 연수", "AI WING UP", "구글 툴", "디벗"],
    externalLinks: [record("aiwingup-2026-10-14")],
    object: "screen",
  },
  {
    id: "aiwingup-2026-08-27",
    template: "lecture",
    title: "SEN스쿨 안내, 수업용 웹앱 제작하기",
    floor: "5f",
    zone: "5f-workshops",
    shortDescription: "에듀테크가 처음인 교사와 SEN스쿨을 살펴보고 수업용 웹앱을 만들어 본 연수입니다.",
    publishedAt: "2026-08-27",
    date: "2026.08.27",
    role: "멘토 강사",
    audience: "에듀테크가 처음인 교사",
    organization: "강서양천교육지원청",
    duration: "2시간",
    format: "집합 연수",
    topics: ["SEN스쿨 안내", "수업용 웹앱 제작하기"],
    materials: ["준비물: 개별 노트북, SEN스쿨 계정"],
    tags: ["교사 연수", "AI WING UP", "SEN스쿨", "웹앱 제작"],
    externalLinks: [record("aiwingup-2026-08-27")],
    object: "monitor",
  },
  {
    id: "aiwingup-2026-07-15",
    template: "lecture",
    title: "AI 기반 학생부 작성 효율화",
    floor: "5f",
    zone: "5f-workshops",
    shortDescription: "에듀테크가 처음인 교사와 AI를 활용해 학생부 작성 업무를 효율화하는 방법을 다룬 연수입니다.",
    publishedAt: "2026-07-15",
    date: "2026.07.15",
    role: "멘토 강사",
    description: "관련 도구: 학생부 초안 작성 보조 AI (B1 업무 시스템에 전시)",
    audience: "에듀테크가 처음인 교사",
    organization: "강서양천교육지원청",
    duration: "2시간",
    format: "집합 연수",
    materials: ["준비물: 개별 노트북"],
    tags: ["교사 연수", "AI WING UP", "학생부", "AI 활용"],
    externalLinks: [record("aiwingup-2026-07-15")],
    object: "screen",
  },

  // ── 연수 자료실 ────────────────────────────────────────────
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
