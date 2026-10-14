import type { Recommendation, SiteProfile, UpdateEntry } from "@/lib/types";

/** Sample profile — replace with the real introduction. */
export const profile: SiteProfile = {
  name: "BioLogist",
  title: "과학 교사 · 에듀테크 메이커",
  headline: "확산을 실천하는 교사, 교실의 문제를 디지털 기반 수업·평가 전문성으로 해결하는 교사",
  intro: [
    "생명과학과 통합과학을 가르치며, 학생들이 스스로 질문하고 탐구하는 수업을 고민합니다.",
    "수업에 꼭 맞는 도구가 없을 때는 직접 앱을 만들고, 그 과정과 시행착오를 이 건물에 차곡차곡 쌓아 가고 있습니다.",
    "지상층에는 눈에 보이는 작업과 성과를, 지하층에는 그 아래에 쌓인 경험과 생각을 담았습니다. 옥상 정원은 자유롭게 만든 것들을 전시하는 곳입니다.",
  ],
  identity: [
    { label: "담당 교과", value: "생명과학 · 통합과학" },
    { label: "관심 분야", value: "탐구 수업, AI 리터러시, 수업용 앱 개발" },
    { label: "주요 활동", value: "교사 연수 강사, 수업 도구 개발" },
  ],
  contact: [{ label: "이메일 보내기", url: "mailto:iseth.cs@gmail.com", kind: "external" },
            { label: "교사 블로그", url: "https://blog.naver.com/biologue_", kind: "external" },
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

export const updates: UpdateEntry[] = [
  { date: "2026-10-06", text: "3F에 ‘AI는 언제 틀릴까? — 환각 찾기 활동’ 추가", floorId: "3f", itemId: "literacy-hallucination" },
  { date: "2026-10-07", text: "4F 광합성 변인 시뮬레이터가 출시 후보 단계로 이동", floorId: "4f", itemId: "app-photosynthesis-sim" },
  { date: "2026-10-14", text: "옥상 정원 개장", floorId: "rf" },
  { date: "2026-10-02", text: "4F 탐구 과정 워크플로 보드 공개", floorId: "4f", itemId: "app-inquiry-workflow" },
];
