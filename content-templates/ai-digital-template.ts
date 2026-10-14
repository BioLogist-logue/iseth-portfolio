import type { AiCaseEntry } from "@/content/schema";

/**
 * 3F AI · 디지털 수업 사례 — 빈 양식
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
export const aiDigitalTemplate: AiCaseEntry = {
  // ━━ 필수 항목 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  id: "", // 고유 id. 영문 소문자 · 숫자 · 하이픈(-)만. 예: "my-new-work-2026"
  template: "ai-case", // 바꾸지 마세요
  title: "", // 제목. 길어도 괜찮습니다.
  shortDescription: "", // 한두 문장 요약 (카드와 패널 첫 줄)
  floor: "3f", // 층 id
  zone: "3f-cases", // 구역 id — "3f-cases"
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

  // ━━ AI · 디지털 수업 사례 항목 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  subject: "", // 과목
  grade: "", // 학년
  problem: "", // 어떤 고민에서 시작했나요?
  toolUsed: [], // 사용한 도구. 예: ["ChatGPT", "Padlet"]
  whyThisTool: "", // 그 도구를 고른 이유
  lessonFlow: [], // 수업 흐름 (단계 순서대로)
  studentUse: "", // 학생들은 도구를 어떻게 썼나요?
  teacherRole: "", // 교사의 역할
  outcome: "", // 결과
  reflection: "", // 성찰
};
