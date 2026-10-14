import type { Floor } from "@/lib/types";

/**
 * Building directory. Add a floor here and the elevator buttons, directory,
 * search index and exterior stack all update automatically.
 *
 * - Above ground: floorNumber 1, 2, 3 ...
 * - Basement:     floorNumber -1, -2 ...
 * - Rooftop:      type "rooftop" (always placed on top)
 */
const floorsList = [
  {
    id: "rf",
    floorNumber: 99,
    label: "RF",
    name: "옥상 정원",
    nameEn: "Rooftop Garden",
    tagline: "자유롭게 만든 앱과 사이드 프로젝트",
    description:
      "정해진 분류 없이 개인 앱과 실험적인 프로젝트를 정원 곳곳에 전시합니다. 가볍게 산책하듯 둘러보세요.",
    type: "rooftop",
    publishedAt: "2026-10-06",
    sceneType: "garden",
    accent: "#6f9e5a",
  },
  {
    id: "6f",
    floorNumber: 6,
    name: "성장 전시관",
    nameEn: "Growth Exhibition",
    tagline: "배지, 자격, 그리고 성장의 기록",
    description:
      "교사로서의 성장 과정을 차분하게 전시합니다. 자격과 배지, 주요 이정표, 경력의 흐름을 한눈에 볼 수 있습니다.",
    type: "standard",
    publishedAt: "2026-03-01",
    sceneType: "gallery",
    accent: "#c9a14a",
  },
  {
    id: "5f",
    floorNumber: 5,
    name: "연수 · 강의",
    nameEn: "Training & Lectures",
    tagline: "강의 기록, 연수 자료, 워크숍",
    description:
      "교사 연수와 강의, 워크숍에서 나눈 내용과 자료를 모았습니다. 발표 자료와 참여자 피드백도 함께 볼 수 있습니다.",
    type: "standard",
    publishedAt: "2026-03-01",
    sceneType: "conference",
    accent: "#d07a4f",
  },
  {
    id: "4f",
    floorNumber: 4,
    name: "앱 개발 연구소",
    nameEn: "App Development Lab",
    tagline: "수업을 위해 직접 만든 탐구 도구와 앱",
    description:
      "과학 수업과 탐구 활동을 위해 직접 설계하고 개발한 앱을 분야별로 전시합니다. 개발 중인 프로젝트의 진행 상황도 확인할 수 있습니다.",
    type: "standard",
    publishedAt: "2026-03-01",
    sceneType: "development-lab",
    accent: "#3f7fd6",
  },
  {
    id: "3f",
    floorNumber: 3,
    name: "AI · 디지털 실천",
    nameEn: "AI & Digital Practice",
    tagline: "AI·디지털 기반 수업 사례와 AI 리터러시",
    description:
      "AI와 디지털 도구를 실제 수업에 적용한 사례, 그리고 학생들과 함께 다룬 AI 리터러시 활동을 정리했습니다.",
    type: "standard",
    publishedAt: "2026-03-01",
    sceneType: "smart-classroom",
    accent: "#5b6fd6",
  },
  {
    id: "2f",
    floorNumber: 2,
    name: "수업 설계",
    nameEn: "Teaching Design",
    tagline: "생명과학·통합과학 수업과 평가 설계",
    description:
      "도서관처럼 수업 설계 자료를 정리한 공간입니다. 과목별 수업, 탐구 활동, 수행평가, 학습지를 찾아볼 수 있습니다.",
    type: "standard",
    publishedAt: "2026-03-01",
    sceneType: "library",
    accent: "#4a9a7c",
    decor: { density: "medium", plants: true },
  },
  {
    id: "1f",
    floorNumber: 1,
    name: "로비",
    nameEn: "Lobby",
    tagline: "환영합니다",
    description: "iSETH 포트폴리오 타워의 안내 데스크입니다. 소개, 추천 작품, 최신 소식, 층별 안내를 확인하세요.",
    type: "lobby",
    publishedAt: "2026-03-01",
    sceneType: "lobby",
    accent: "#c08a4a",
  },
  {
    id: "b1",
    floorNumber: -1,
    name: "업무 시스템",
    nameEn: "Work Systems",
    tagline: "자동화, 업무 흐름, 데이터 관리",
    description:
      "학교 업무를 덜 번거롭게 만드는 시스템을 모았습니다. Apps Script 자동화, 평가 시스템, 데이터 관리 도구 등이 있습니다.",
    type: "basement",
    publishedAt: "2026-03-01",
    sceneType: "operations",
    accent: "#6c7a89",
  },
  {
    id: "b2",
    floorNumber: -2,
    name: "성찰 아카이브",
    nameEn: "Reflection Archive",
    tagline: "실패, 수정, 그리고 배운 것들",
    description:
      "잘 되지 않았던 수업과 앱, 그 이후의 수정 과정을 조용히 기록해 둔 공간입니다.",
    type: "basement",
    publishedAt: "2026-03-01",
    sceneType: "archive",
    accent: "#8a7a66",
  },
  {
    id: "b3",
    floorNumber: -3,
    name: "교육 철학",
    nameEn: "Educational Philosophy",
    tagline: "가르침과 배움에 대한 생각",
    description:
      "수업, 학생, 과학교육, 디지털 도구, AI, 평가에 대한 생각을 작은 박물관처럼 전시합니다.",
    type: "basement",
    publishedAt: "2026-03-01",
    sceneType: "museum",
    accent: "#9a6f8a",
  },
  {
    id: "b4",
    floorNumber: -4,
    name: "담임 아카이브",
    nameEn: "Homeroom Archive",
    tagline: "학급 운영과 소통의 기록",
    description:
      "담임교사로서의 학급 운영, 학생·학부모 소통, 템플릿과 루틴을 정리했습니다. 모든 사례는 익명화되어 있습니다.",
    type: "basement",
    publishedAt: "2026-03-01",
    sceneType: "homeroom",
    accent: "#c27a5a",
  },
] as const satisfies readonly Floor[];

/** Every valid floor id — used by the content schema for autocomplete. */
export type FloorId = (typeof floorsList)[number]["id"];
export const floors: Floor[] = [...floorsList];
