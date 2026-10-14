import type { Recommendation, SiteProfile, UpdateEntry } from "@/lib/types";

/** Lobby profile. Facts come from the iSETH hub's 제작자 소개 (biologue-tools.vercel.app/about.html). */
export const profile: SiteProfile = {
  name: "BioLogist",
  title: "과학 교사 · 수업 설계자 · 에듀테크 제작자",
  headline: "확산을 실천하는 교사, 교실의 문제를 디지털 기반 수업·평가 전문성으로 해결하는 교사",
  intro: [
    "설명만으로는 이해시키기 어려운 순간을 만나면, 학생이 무엇을 배우고 직접 해 봐야 하는지부터 다시 설계합니다. 도구는 그 수업에 꼭 필요할 때만 만듭니다.",
    "만든 도구는 교실에서 학생과 써 보고 고칩니다. 그 경험은 연수로 다른 선생님들과 나눕니다.",
    "지상층에는 눈에 보이는 작업과 성과를, 지하층에는 그 아래에 쌓인 경험과 생각을 담았습니다. 옥상 정원은 자유롭게 만든 것들을 전시하는 곳입니다.",
  ],
  identity: [
    { label: "현재", value: "현직 고등학교 생명과학 교사" },
    { label: "2026 활동", value: "서울시교육청 AI 에듀테크 선도교사단 · 교육부 인공지능 활용 선도교사 · 서울시교육청 AI 디지털 기반 과학 선도교원 · AI 디지털 기반 수업 평가 전문가 프로젝트 1기 · 디벗 전문가(테크니션)" },
    { label: "연수 · 강의", value: "찾아가는 디지털 과학수업 역량강화 연수 강사 · 디지털 도구 활용 과학탐구 직무연수 강사 · 강서양천교육청 교내 AI 디지털 멘토링" },
    { label: "인증", value: "Google for Education 트레이너 · 공인 교육 전문가 등급 1 · 2 · Gemini 공인 교육 전문가 · Gemini 인증 교수진" },
    { label: "에듀테크 개발", value: "교육용 웹앱 기획 및 개발 (수업 도구 13종)" },
  ],
  contact: [
    { label: "이메일 보내기", url: "mailto:iseth.cs@gmail.com", kind: "external" },
    { label: "교사 블로그", url: "https://blog.naver.com/biologue_", kind: "external" },
    { label: "인스타그램", url: "https://www.instagram.com/biologist_logue", kind: "external" },
    { label: "오픈 카톡", url: "https://open.kakao.com/o/sN6C18Ai", kind: "external" },
    { label: "iSETH", url: "https://biologue-tools.vercel.app", kind: "external" },
  ],
};

export const recommendations: Recommendation[] = [
  { id: "first", title: "처음 방문", description: "건물 전체를 가볍게 둘러보는 경로", route: ["1f", "2f", "4f", "6f"] },
  { id: "teaching", title: "수업", description: "수업 설계와 AI 활용 사례", route: ["2f", "3f"] },
  { id: "apps", title: "앱", description: "수업용 앱과 사이드 프로젝트", route: ["4f", "rf"] },
  { id: "training", title: "연수", description: "강의와 연수 자료", route: ["5f"] },
  { id: "growth", title: "성장", description: "성장의 기록과 그 아래의 생각", route: ["6f", "b2", "b3"] },
];

/** Lobby "최근 소식", newest first. `date` may be YYYY-MM-DD or YYYY-MM. */
export const updates: UpdateEntry[] = [
  { date: "2026-10-14", text: "옥상 정원 개장 — 하루체크, 뭐먹지?, pdf 툴킷 모음집", floorId: "rf" },
  { date: "2026-10-14", text: "4F 앱 개발 연구소에 iSETH 수업 도구 입주", floorId: "4f" },
  { date: "2026-10-14", text: "5F에 연수 · 강의 기록 정리 (10/16 · 10/28 연수 예정)", floorId: "5f" },
  { date: "2026-10-14", text: "강서양천 AI WING UP 연수 — 구글 등 기본 툴 안내 및 교원 AI∙디지털 교육 역량체계", floorId: "5f", itemId: "aiwingup-2026-10-14" },
  { date: "2026-09", text: "세포 구조 추리 게임 v1.1 — 인트로와 초성 힌트 추가", floorId: "4f", itemId: "cell-investigation" },
  { date: "2026-09", text: "생물 분류 대시보드 v2.1 — 오답 다시보기와 문항별 해설 추가", floorId: "4f", itemId: "bio-tree" },
];
