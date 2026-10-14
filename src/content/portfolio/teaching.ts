import type { TeachingEntry } from "../schema";

/**
 * 2F 수업 설계
 *
 * 템플릿: teaching
 * 빈 양식: content-templates/teaching-template.ts
 *
 * 새 작품은 아래 목록에 { ... }, 블록을 하나 더 붙여 넣으면 됩니다.
 * `sample: true` 가 붙은 항목은 예시(placeholder)입니다. 실제 내용으로 바꾸거나 지우세요.
 */
export const teachingEntries: TeachingEntry[] = [
  // ── 2F 수업 설계 ───────────────────────────────────────────
  {
    id: "lesson-genetics-unit",
    template: "teaching",
    sample: true, // 예시 콘텐츠 — 실제 내용으로 바꾸면 이 줄을 지우세요
    title: "유전 단원 개념 중심 수업 설계",
    type: "lesson",
    floor: "2f",
    zone: "2f-biology",
    shortDescription: "멘델 유전부터 사람의 유전까지, 핵심 개념을 질문 중심으로 재구성한 8차시 수업입니다.",
    publishedAt: "2026-03-20",
    date: "2026년 1학기",
    role: "수업 설계 · 운영",
    tags: ["생명과학", "유전", "개념 중심 수업"],
    attachments: [{ id: "a1", label: "차시별 지도안", kind: "pdf", url: "/files/sample.pdf", preview: true }],
    // ── 템플릿 필드 예시 ──
    subject: "생명과학",
    grade: "고등학교 2학년",
    unit: "Ⅲ. 유전",
    learningGoals: [
      "멘델 유전의 원리를 교배 결과로 설명할 수 있다.",
      "사람의 유전 형질을 가계도로 분석할 수 있다.",
    ],
    lessonFlow: [
      "도입 — '나는 왜 부모님을 닮았을까?' 질문 모으기",
      "탐구 — 모둠별 가상 교배 실험과 결과 정리",
      "개념 정리 — 우열의 원리와 분리의 법칙",
      "적용 — 가계도 분석 과제",
    ],
    materials: ["차시별 지도안", "가상 교배 카드", "가계도 분석 학습지"],
    assessment: "가계도 분석 과제를 루브릭(근거 제시 · 개념 적용 · 표현)으로 평가했습니다.",
    reflection: "질문으로 시작하니 학생들이 개념을 외우기보다 이유를 찾으려 했습니다.\n\n다음에는 탐구 시간을 한 차시 더 확보하려고 합니다.",
    object: "book",
  },
  {
    id: "lesson-homeostasis",
    template: "teaching",
    sample: true, // 예시 콘텐츠 — 실제 내용으로 바꾸면 이 줄을 지우세요
    title: "항상성과 몸의 조절",
    type: "lesson",
    floor: "2f",
    zone: "2f-biology",
    shortDescription: "혈당 조절 사례를 중심으로 한 문제 기반 학습 수업입니다.",
    publishedAt: "2026-04-11",
    tags: ["생명과학", "항상성", "PBL"],
    object: "book",
  },
  {
    id: "lesson-system-interaction",
    template: "teaching",
    sample: true, // 예시 콘텐츠 — 실제 내용으로 바꾸면 이 줄을 지우세요
    title: "지구 시스템의 상호작용",
    type: "lesson",
    floor: "2f",
    zone: "2f-integrated",
    shortDescription: "지권·수권·기권·생물권의 상호작용을 사례 카드로 연결하는 통합과학 수업입니다.",
    publishedAt: "2026-03-28",
    tags: ["통합과학", "지구 시스템"],
    object: "book",
  },
  {
    id: "inquiry-enzyme",
    template: "teaching",
    sample: true, // 예시 콘텐츠 — 실제 내용으로 바꾸면 이 줄을 지우세요
    title: "효소 활성 탐구 실험",
    type: "lesson",
    floor: "2f",
    zone: "2f-inquiry",
    shortDescription: "온도와 pH에 따른 카탈레이스 활성 변화를 모둠별로 설계하고 측정합니다.",
    publishedAt: "2026-05-08",
    tags: ["탐구 활동", "효소", "실험 설계"],
    object: "folder",
  },
  {
    id: "assessment-rubric",
    template: "teaching",
    sample: true, // 예시 콘텐츠 — 실제 내용으로 바꾸면 이 줄을 지우세요
    title: "탐구 보고서 수행평가 루브릭",
    type: "document",
    floor: "2f",
    zone: "2f-assessment",
    shortDescription: "탐구 질문, 실험 설계, 자료 해석, 결론의 네 영역으로 구성된 분석적 루브릭입니다.",
    publishedAt: "2026-04-15",
    tags: ["수행평가", "루브릭", "피드백"],
    attachments: [{ id: "a1", label: "루브릭 양식", kind: "pdf", url: "/files/sample.pdf" }],
    object: "folder",
  },
  {
    id: "worksheet-cell",
    template: "teaching",
    sample: true, // 예시 콘텐츠 — 실제 내용으로 바꾸면 이 줄을 지우세요
    title: "세포 분열 관찰 학습지",
    type: "worksheet",
    floor: "2f",
    zone: "2f-worksheets",
    shortDescription: "체세포 분열 단계별 관찰 기록지와 개념 확인 문항입니다.",
    publishedAt: "2026-09-30",
    tags: ["학습지", "세포 분열"],
    attachments: [{ id: "a1", label: "학습지 내려받기", kind: "pdf", url: "/files/sample.pdf" }],
    object: "folder",
  },
];
