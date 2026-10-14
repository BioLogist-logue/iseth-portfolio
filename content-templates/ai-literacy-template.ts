import type { AiLiteracyEntry } from "@/content/schema";

/**
 * 3F AI 리터러시 — 빈 양식
 *
 * 사용법
 * 1. 아래 = 뒤의 { 부터 맨 끝 } 까지를 통째로 복사합니다.
 * 2. src/content/portfolio/aiDigital.ts 의 목록 [ … ] 안, 마지막 항목의 "}," 다음 줄에 붙여 넣고
 *    끝에 쉼표(,)를 붙입니다.
 * 3. "" 안을 채웁니다. 필요 없는 선택 항목은 줄째 지워도 됩니다.
 * 4. 저장하면 해당 층 · 구역에 자동으로 전시됩니다.
 *
 * 이 파일 자체는 화면에 나타나지 않습니다. (복사용 양식)
 */
export const aiLiteracyTemplate: AiLiteracyEntry = {
  // ━━ 필수 항목 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  id: "", // 고유 id. 영문 소문자 · 숫자 · 하이픈(-)만. 예: "my-new-work-2026"
  template: "ai-literacy", // 바꾸지 마세요
  title: "", // 제목. 길어도 괜찮습니다.
  shortDescription: "", // 한두 문장 요약 (카드와 패널 첫 줄)
  floor: "3f", // 층 id
  zone: "3f-literacy", // 구역 id — "3f-literacy"
  publishedAt: "2026-01-01", // 게시일 YYYY-MM-DD (14일 동안 NEW 표시)

  // ━━ 선택 항목 (필요 없으면 줄째 지워도 됩니다) ━━━━━━━━━━━━━━━━━
  description: "", // 긴 본문. 빈 줄(\n\n)로 문단을 나눕니다.
  date: "", // 화면에 보일 기간. 예: "2026년 1학기"
  role: "", // 맡은 역할. 예: "기획 · 운영"
  thumbnail: "", // 대표 이미지. 예: "/images/my-work.png" (비우면 자동 그림)
  thumbnailAlt: "", // 대표 이미지 설명
  gallery: [
    // { src: "/images/my-work-1.png", alt: "활동 장면" },
  ],
  attachments: [
    // { label: "지도안 내려받기", url: "/files/my-work.pdf", preview: true },
  ],
  externalLinks: [
    // { label: "바로가기", url: "https://example.com", kind: "live" },
  ],
  tags: [], // 검색용 태그. 예: ["생명과학", "탐구"]
  featured: false, // true 면 1층 '추천 작품'에 표시

  // ━━ AI 리터러시 항목 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  topic: "", // 주제. 예: "AI 환각 찾기"
  targetStudents: "", // 대상. 예: "중학교 3학년"
  coreQuestion: "", // 핵심 질문 (패널에 강조되어 보입니다). 예: "AI는 언제 틀릴까?"
  learningGoals: [], // 학습 목표
  activity: "", // 활동 내용
  concepts: [], // 핵심 개념. 예: ["환각", "출처 확인"]
  studentOutput: "", // 학생 산출물
  reflection: "", // 성찰
};
