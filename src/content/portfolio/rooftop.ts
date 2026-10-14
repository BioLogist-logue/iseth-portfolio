import type { RooftopProjectEntry } from "../schema";

/**
 * RF 옥상 정원
 *
 * 템플릿: rooftop-project
 * 빈 양식: content-templates/rooftop-project-template.ts
 *
 * 새 작품은 아래 목록에 { ... }, 블록을 하나 더 붙여 넣으면 됩니다.
 * `sample: true` 가 붙은 항목은 예시(placeholder)입니다. 실제 내용으로 바꾸거나 지우세요.
 */
export const rooftopEntries: RooftopProjectEntry[] = [
  // ── RF 옥상 정원 ────────────────────────────────────────────
  {
    id: "blackcatmeals",
    template: "rooftop-project",
    title: "뭐먹지?",
    type: "app",
    floor: "rf",
    zone: "rf-garden",
    status: "RELEASED",
    shortDescription: "메뉴 추천을 도와주는 앱입니다. 냉장고에 있는 재료를 선택하면 해먹는 요리도 추천해줍니다.",
    publishedAt: "2026-09-30",
    techStack: ["", ""],
    tags: ["사이드 프로젝트", "음식추천", "재미"],
    externalLinks: [{ label: "앱 열기", url: "https://blackcatmeals.vercel.app", kind: "live" }],
    object: "kiosk",
  },
  {
    id: "my-pdf",
    template: "rooftop-project",
    title: "pdf 툴킷 모음집!",
    type: "app",
    floor: "rf",
    zone: "rf-garden",
    status: "RELEASED",
    featured: true,
    shortDescription: "pdf 변환, 추출, 병합, 워터마크 등 pdf 관련 파일 수정을 도와주는 툴킷입니다. 개인정보를 수집하지 않습니다.",
    publishedAt: "2026-10-13",
    techStack: ["Next.js"],
    tags: ["사이드 프로젝트", "pdf", "업무활용", "유용한앱"],
    // ── 템플릿 필드 예시 ──
    category: "유용한기능",
    whyIMadeIt: "학교 행정에서 쓰는 다양한 pdf 서류들, 온라인에 올려 파일 수정하기엔 불안합니다. 그래서 설치용으로도 사용하고 데이터를 수집하지 않는 pdf 툴킷 웹앱을 따로 만들었습니다.",
    coreFeatures: ["설치가능", "데이터수집없음", "간편한사용", "대용량파일", "오프라인작업"],
    reflection: "기능을 늘리기보다 편하고 쉬운 화면을 만드는 데 집중하고 있습니다.",
    object: "tablet",
    externalLinks: [{ label: "앱 열기", url: "https://my-pdf-amber.vercel.app", kind: "live" }],
  },
  {
    id: "rf-star-map",
    template: "rooftop-project",
    sample: true, // 예시 콘텐츠 — 실제 내용으로 바꾸면 이 줄을 지우세요
    title: "오늘 밤 별자리 지도",
    type: "app",
    floor: "rf",
    zone: "rf-garden",
    status: "RELEASED",
    shortDescription: "현재 위치와 시간에 맞춰 보이는 별자리를 알려 주는 천체 관측 도우미입니다.",
    publishedAt: "2026-02-10",
    techStack: ["Three.js"],
    tags: ["천문", "사이드 프로젝트"],
    object: "screen",
  },
  {
    id: "rf-plant-diary",
    template: "rooftop-project",
    sample: true, // 예시 콘텐츠 — 실제 내용으로 바꾸면 이 줄을 지우세요
    title: "반려식물 물 주기 알림",
    type: "app",
    floor: "rf",
    zone: "rf-garden",
    status: "RELEASED",
    shortDescription: "식물마다 물 주는 주기를 기록하고 알림을 받는 작은 앱입니다.",
    publishedAt: "2025-12-01",
    tags: ["식물", "알림"],
    object: "terrarium",
  },
  {
    id: "rf-pixel-lab",
    template: "rooftop-project",
    sample: true, // 예시 콘텐츠 — 실제 내용으로 바꾸면 이 줄을 지우세요
    title: "픽셀 아트 실험실",
    type: "app",
    floor: "rf",
    zone: "rf-garden",
    status: "IDEA",
    shortDescription: "과학 개념을 픽셀 아트 스티커로 만드는 실험적인 도구입니다.",
    publishedAt: "2026-08-01",
    tags: ["실험", "픽셀 아트"],
    object: "poster",
  },
];
