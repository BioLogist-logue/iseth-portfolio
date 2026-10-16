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
    id: "student-record-drafter",
    template: "workflow",
    title: "학생부 초안 작성 보조 AI",
    floor: "b1",
    zone: "b1-automation",
    status: "TESTING",
    shortDescription: "학생 활동 내용을 입력하면 학생부 기록에 참고할 수 있는 초안 문장 작성을 도와주는 AI 도구입니다.",
    publishedAt: "2026-06-01",
    date: "v3.5 · 2026.06 업데이트",
    description:
      "학생부 초안을 더 빠르고 쉽게 잘 작성할 수는 없을까요? 교사는 학생 활동을 잘 정리하기만 하면 됩니다.\n\n직접 만든 이유 — 시중의 세특 작성 유료 서비스는 어떤 AI 모델을 쓰는지, 어떤 프롬프트를 쓰는지 공개되지 않고, 사용 이력이 서비스 개선에 수집되며, 여러 학생 자료를 올리는 틀이 실제 활동과 맞지 않는 경우가 많았습니다. 그래서 모델(Gemini 2.5 Flash)과 수집 항목 · 목적을 투명하게 밝히고, 연수에서 쓴 프롬프트를 바탕으로 한 무료 도구를 만들었습니다.\n\n쓰는 방법 — 이메일로 간단히 가입 → 항목에 맞게 학생 활동 입력(파일을 첨부하면 글자를 추출) → 원하는 글자 수 설정 → 결과 창에서 바로 수정. 만족도 조사와 문의하기로 계속 개선합니다.\n\n관련 연수: 5F AI WING UP 연수 'AI 기반 학생부 세특 작성 효율화'",
    problem:
      "학생부 기록 작성은 교사에게 많은 시간과 노력이 필요한 업무입니다. 특히 학생 활동 내용을 바탕으로 적절한 문장을 구성하는 것은 어려운 작업입니다. 시중에 유료 서비스는 많지만 학생부 기록에 특화된 무료 도구는 부족합니다.",
    newProcess: "학생 활동 내용 입력 → AI가 초안 문장 생성 → 교사가 초안 문장 검토 및 수정",
    tools: ["Python", "Streamlit", "Google Gemini API (2.5 Flash)"],
    automation: "학생 활동 내용을 입력하면 AI가 참고할 수 있는 초안 문장을 생성합니다.",
    result: "학생부 기록을 더 빠르고 쉽게 작성할 수 있게 되었고, 학생 활동 내용을 보다 효과적으로 기록할 수 있습니다.",
    reflection:
      "AI를 활용한 초안 작성 보조 도구입니다. 생성된 문장의 사실 관계 확인과 최종 기재 책임은 작성 교사 본인에게 있으며, 교육부의 기재 요령을 준수해야 합니다. 개인 유료 API를 사용 중이라 한도를 넘으면 개인 무료 API로 바꿔 쓰도록 안내합니다.",
    tags: ["학생부", "AI", "업무 효율화", "Streamlit"],
    externalLinks: [
      { label: "웹앱 열기", url: "https://haksangbu.streamlit.app/", kind: "live" },
      { label: "개발 기록", url: "https://blog.naver.com/biologue_/224273378890", kind: "external" },
    ],
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
