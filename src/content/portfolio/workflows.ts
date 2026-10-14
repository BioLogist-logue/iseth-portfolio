import type { WorkflowEntry } from "../schema";

/**
 * B1 업무 시스템
 *
 * 템플릿: workflow
 * 빈 양식: content-templates/workflow-template.ts
 *
 * 새 작품은 아래 목록에 { ... }, 블록을 하나 더 붙여 넣으면 됩니다.
 * `sample: true` 가 붙은 항목은 예시(placeholder)입니다. 실제 내용으로 바꾸거나 지우세요.
 */
export const workflowEntries: WorkflowEntry[] = [
  // ── B1 업무 시스템 ──────────────────────────────────────────
  {
    id: "system-attendance",
    template: "workflow",
    sample: true, // 예시 콘텐츠 — 실제 내용으로 바꾸면 이 줄을 지우세요
    title: "과제 제출 현황 자동 알림",
    type: "tool",
    floor: "b1",
    zone: "b1-automation",
    shortDescription: "Google Forms 제출 기록을 정리해 미제출 학생 명단을 매일 아침 자동으로 정리합니다.",
    publishedAt: "2026-03-10",
    tools: ["Google Apps Script", "Google Forms"],
    tags: ["Apps Script", "자동화", "업무 흐름"],
    // ── 템플릿 필드 예시 ──
    problem: "과제 미제출 학생을 매번 손으로 확인하느라 시간이 오래 걸렸습니다.",
    previousProcess: "제출 기록을 내려받아 명렬표와 하나씩 대조했습니다.",
    newProcess: "제출 기록이 시트에 쌓이면 스크립트가 미제출 명단을 정리합니다.",
    automation: "매일 아침 7시에 미제출 명단을 정리해 교사에게만 보이는 시트에 기록합니다.",
    result: "확인 작업이 하루 한 번, 1분 안으로 줄었습니다.",
    timeSaved: "주당 약 1시간 (예시)",
    reflection: "학생 이름이 담긴 데이터는 교사 계정 안에서만 다루도록 설계했습니다.",
    object: "monitor",
  },
  {
    id: "system-grade",
    template: "workflow",
    sample: true, // 예시 콘텐츠 — 실제 내용으로 바꾸면 이 줄을 지우세요
    title: "수행평가 점수 관리 시트",
    type: "tool",
    floor: "b1",
    zone: "b1-data",
    shortDescription: "루브릭 점수를 입력하면 영역별 통계와 개별 피드백 문장을 생성하는 시트입니다.",
    publishedAt: "2026-04-05",
    tools: ["Google Sheets", "Apps Script"],
    tags: ["평가 시스템", "데이터 관리"],
    object: "folder",
  },
];
