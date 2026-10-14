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
    id: "rf-weather-haiku",
    template: "rooftop-project",
    sample: true, // 예시 콘텐츠 — 실제 내용으로 바꾸면 이 줄을 지우세요
    title: "날씨 하이쿠",
    type: "app",
    floor: "rf",
    zone: "rf-garden",
    status: "RELEASED",
    shortDescription: "오늘의 날씨를 짧은 시 한 줄로 바꿔 주는 장난감 같은 앱입니다.",
    publishedAt: "2026-10-08",
    techStack: ["Next.js", "Weather API"],
    tags: ["사이드 프로젝트", "날씨", "재미"],
    externalLinks: [{ label: "앱 열기", url: "https://example.com", kind: "live" }],
    object: "kiosk",
  },
  {
    id: "rf-habit-garden",
    template: "rooftop-project",
    sample: true, // 예시 콘텐츠 — 실제 내용으로 바꾸면 이 줄을 지우세요
    title: "습관 정원",
    type: "app",
    floor: "rf",
    zone: "rf-garden",
    status: "PROTOTYPE",
    featured: true,
    shortDescription: "매일의 작은 습관을 지키면 화면 속 정원에 꽃이 하나씩 피어나는 습관 기록 앱입니다.",
    publishedAt: "2026-09-21",
    techStack: ["React Native"],
    tags: ["사이드 프로젝트", "습관", "게이미피케이션"],
    // ── 템플릿 필드 예시 ──
    category: "생활 · 습관",
    whyIMadeIt: "작은 습관을 지키는 일이 눈에 보이면 더 오래 이어질 것 같았습니다.",
    coreFeatures: ["습관 체크", "꽃이 피는 정원 화면", "주간 기록 보기"],
    reflection: "기능을 늘리기보다 매일 열고 싶은 화면을 만드는 데 집중하고 있습니다.",
    object: "tablet",
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
