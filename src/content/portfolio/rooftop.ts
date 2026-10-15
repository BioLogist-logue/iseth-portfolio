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
    id: "iseth-clock",
    template: "rooftop-project",
    title: "iSETH-clock",
    floor: "rf",
    zone: "rf-garden",
    status: "RELEASED",
    shortDescription: "수업 · 연수용 시간 운영 콘솔입니다. 시계, 타임테이블, 타이머, 스톱워치를 한 화면에서 씁니다.",
    publishedAt: "2026-10-15",
    description:
      "'시간 운영 시작'을 누르면 소리가 켜지고 화면이 꺼지지 않으며, 시간표에 맞춰 화면과 음악이 자동으로 바뀝니다.\n\n로그인도 서버 저장도 없습니다. 시간표 · 설정 · 추가한 음악은 모두 이 기기(브라우저)에만 저장됩니다. (현재 v1.0.1)",
    techStack: ["React", "Vite", "PWA (설치형 웹앱)", "Vercel"],
    tags: ["사이드 프로젝트", "수업 도구", "타이머", "시간표", "연수"],
    externalLinks: [{ label: "앱 열기", url: "https://iseth-clock.vercel.app/", kind: "live" }],
    category: "수업 · 연수 운영",
    coreFeatures: [
      "오늘의 일정 — 시간표에 맞춰 지금 활동과 남은 시간을 큰 시계로 표시",
      "타임테이블 — 활동마다 시간 · 색 · BGM · 시작 알림음 · 종료 전 알림 설정, 시간표 여러 개 저장 · 복제",
      "타이머 — 5 · 10 · 15 · 20 · 30분 또는 직접 설정, 종료 5분 · 1분 전 알림",
      "스톱워치",
      "앱에서 만든 저작권 걱정 없는 BGM과 내 음악 파일 추가",
      "인터넷 시간 자동 동기화 (10분마다 보정)",
      "전체 화면(F 키) · 테마 7종 · 숫자 크기 · 화면 꺼짐 방지",
    ],
    object: "kiosk",
  },
];
