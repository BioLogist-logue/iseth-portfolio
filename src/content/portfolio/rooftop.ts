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
    techStack: ["React", "Vite", "Vercel"],
    tags: ["사이드 프로젝트", "음식추천", "재미"],
    externalLinks: [{ label: "앱 열기", url: "https://blackcatmeals.vercel.app", kind: "live" }],
    category: "생활 · 음식",
    coreFeatures: [
      "집에서 먹자 — 냉장고에 있는 재료를 골라 해 먹을 요리 추천",
      "사 먹자 — 당기는 것만 골라 메뉴 추천",
      "'아 몰라, 그냥 골라줘' 바로 추천",
      "단백질 · 채소 · 탄수화물 · 기타로 나눈 재료 선택 (기본 양념은 있다고 가정)",
    ],
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
    techStack: ["React", "Vite", "PWA (설치형 웹앱)", "Vercel"],
    tags: ["사이드 프로젝트", "pdf", "업무활용", "유용한앱"],
    description:
      "PDF → 이미지, 이미지 → PDF, PDF → 텍스트 변환과 편집 · 정리 기능을 한곳에 모았습니다.\n\n회원가입 · 업로드 · 추적이 없습니다. 선택한 PDF는 서버에 올라가지 않고 이 기기의 브라우저 안에서만 처리됩니다. 한 번 불러온 뒤에는 오프라인에서도 대부분의 작업을 쓸 수 있고, 파일은 하나에 최대 1GB까지 넣을 수 있습니다.",
    category: "유용한기능",
    whyIMadeIt: "학교 행정에서 쓰는 다양한 pdf 서류들, 온라인에 올려 파일 수정하기엔 불안합니다. 그래서 설치용으로도 사용하고 데이터를 수집하지 않는 pdf 툴킷 웹앱을 따로 만들었습니다.",
    coreFeatures: ["설치가능", "데이터수집없음", "간편한사용", "대용량파일", "오프라인작업"],
    reflection: "기능을 늘리기보다 편하고 쉬운 화면을 만드는 데 집중하고 있습니다.",
    object: "tablet",
    externalLinks: [{ label: "앱 열기", url: "https://my-pdf-amber.vercel.app", kind: "live" }],
  },
  {
    id: "haru-check",
    template: "rooftop-project",
    title: "하루체크",
    floor: "rf",
    zone: "rf-garden",
    status: "RELEASED",
    shortDescription: "일상의 건강과 생리 주기를 한곳에 기록하는 개인 기록 앱입니다.",
    publishedAt: "2026-10-14",
    description:
      "마음, 몸의 변화, 수면, 물, 활동을 하루 단위로 가볍게 남깁니다. 전부 채우지 않아도 되고, 필요한 항목부터 기록하면 됩니다.\n\n기록은 서버가 아니라 이 기기에 저장됩니다.",
    techStack: ["React", "Vite", "PWA (설치형 웹앱)", "Vercel"],
    tags: ["사이드 프로젝트", "건강", "기록", "생리 주기"],
    externalLinks: [{ label: "앱 열기", url: "https://haru-check-kappa.vercel.app", kind: "live" }],
    category: "건강 · 기록",
    coreFeatures: [
      "오늘의 마음 · 에너지 · 스트레스 기록",
      "몸의 변화(증상) 체크와 증상 목록 편집",
      "취침 · 기상 시간으로 수면 시간 자동 계산",
      "물 마신 컵 수와 활동 시간 기록",
      "생리량을 기록하면 주기 시작일을 자동 인식",
      "주기 달력 · 건강 흐름 · 복용 관리",
    ],
    object: "device",
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
