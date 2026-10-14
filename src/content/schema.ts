import type { GalleryImage, ItemLink, ItemStatus, ItemType, ObjectKind } from "@/lib/types";
import type { FloorId } from "./floors";
import type { ZoneId } from "./zones";

/**
 * 포트폴리오 콘텐츠 작성 형식 (Content authoring schema)
 *
 * 모든 작품은 공통 필드(BaseEntry) + 템플릿별 필드로 이루어집니다.
 * `template` 값이 어떤 추가 필드를 쓸 수 있는지 정합니다.
 * 작성한 항목은 src/content/portfolio/ 의 파일에 넣으면 해당 층·구역에 자동으로 전시됩니다.
 * 복사해서 쓰는 빈 양식은 프로젝트 루트의 content-templates/ 폴더에 있습니다.
 */

export type TemplateId =
  | "teaching"
  | "ai-case"
  | "ai-literacy"
  | "app"
  | "lecture"
  | "badge"
  | "milestone"
  | "workflow"
  | "reflection"
  | "philosophy"
  | "homeroom"
  | "rooftop-project"
  | "general";

/** 여러 줄 글. 빈 줄로 문단을 나눕니다. */
export type Text = string;
/** 항목 목록. 예: ["첫째", "둘째"] */
export type TextList = string[];

/** 첨부 파일. 파일은 public/files/ 에 넣고 url 은 "/files/파일이름.pdf" 처럼 씁니다. */
export interface AttachmentInput {
  label: string;
  url: string;
  /** 생략하면 파일 확장자로 자동 판단합니다. */
  kind?: "pdf" | "image" | "slide" | "doc" | "sheet" | "zip" | "other";
  /** PDF/이미지를 패널 안에서 바로 미리 보기 */
  preview?: boolean;
  /** 예: "2.4MB", "12쪽" */
  sizeLabel?: string;
  /** 생략 가능 (자동 생성) */
  id?: string;
}

/** 모든 템플릿이 공유하는 공통 필드 */
export interface BaseEntry {
  // ── 필수 ─────────────────────────────
  /** 고유 id. 영문 소문자·숫자·하이픈만. 예: "lesson-genetics-unit" */
  id: string;
  template: TemplateId;
  /** 제목 */
  title: string;
  /** 한두 문장 요약. 카드와 패널 첫 줄에 보입니다. */
  shortDescription: string;
  /** 층 id: "rf" | "6f" … "1f" | "b1" … "b4" */
  floor: FloorId;
  /** 구역 id (src/content/zones.ts 참고). 해당 층의 구역이어야 합니다. */
  zone: ZoneId;
  /** 게시일 YYYY-MM-DD. 14일 동안 NEW 표시가 붙습니다. */
  publishedAt: string;

  // ── 선택 ─────────────────────────────
  /** 긴 본문. 빈 줄로 문단을 나눕니다. */
  description?: Text;
  /** 화면에 보이는 기간/날짜. 예: "2026년 1학기", "2025.03 – 2025.07" */
  date?: string;
  /** 유형 표시를 바꾸고 싶을 때만. 생략하면 템플릿 기본값 */
  type?: ItemType;
  /** 대표 이미지. 예: "/images/my-app.png" (없으면 자동 그림) */
  thumbnail?: string;
  /** 대표 이미지 설명 (생략하면 제목) */
  thumbnailAlt?: string;
  /** "contain" 이면 이미지를 자르지 않고 전체를 보여 줍니다 (배지 · 로고). 기본은 꽉 채우기 */
  thumbnailFit?: "cover" | "contain";
  /** 추가 이미지 */
  gallery?: GalleryImage[];
  /** 내려받을 파일 */
  attachments?: AttachmentInput[];
  /** 외부 링크 버튼. kind: "live"(강조) | "github" | "video" | "external" */
  externalLinks?: ItemLink[];
  /** 검색용 태그 */
  tags?: string[];
  /** 진행 상태 (주로 앱): IDEA | PROTOTYPE | TESTING | RELEASE_CANDIDATE | RELEASED | ARCHIVED */
  status?: ItemStatus;
  /** true 면 1층 '추천 작품'에 표시 */
  featured?: boolean;
  /** 맡은 역할. 예: "기획 · 개발" */
  role?: string;
  /** 3D 모형 모양을 직접 고를 때만 (생략하면 유형에 맞춰 자동) */
  object?: ObjectKind;
  /** 예시(placeholder) 콘텐츠 표시. 실제 내용으로 바꾸면 이 줄을 지우세요. */
  sample?: boolean;
}

// ── 템플릿별 필드 ─────────────────────────────────────────────

/** 2F 수업 설계 */
export interface TeachingEntry extends BaseEntry {
  template: "teaching";
  subject?: string;
  grade?: string;
  unit?: string;
  learningGoals?: TextList;
  lessonFlow?: TextList;
  materials?: TextList;
  assessment?: Text;
  reflection?: Text;
}

/** 3F AI · 디지털 수업 사례 */
export interface AiCaseEntry extends BaseEntry {
  template: "ai-case";
  subject?: string;
  grade?: string;
  problem?: Text;
  toolUsed?: TextList;
  whyThisTool?: Text;
  lessonFlow?: TextList;
  studentUse?: Text;
  teacherRole?: Text;
  outcome?: Text;
  reflection?: Text;
}

/** 3F AI 리터러시 */
export interface AiLiteracyEntry extends BaseEntry {
  template: "ai-literacy";
  topic?: string;
  targetStudents?: string;
  coreQuestion?: Text;
  learningGoals?: TextList;
  activity?: Text;
  concepts?: TextList;
  studentOutput?: Text;
  reflection?: Text;
}

/** 4F 앱 */
export interface AppEntry extends BaseEntry {
  template: "app";
  version?: string;
  targetUsers?: string;
  problem?: Text;
  solution?: Text;
  coreFeatures?: TextList;
  techStack?: TextList;
  developmentNotes?: Text;
  reflection?: Text;
}

/** 5F 강의 · 연수 */
export interface LectureEntry extends BaseEntry {
  template: "lecture";
  audience?: string;
  organization?: string;
  duration?: string;
  format?: string;
  objectives?: TextList;
  topics?: TextList;
  activities?: TextList;
  materials?: TextList;
  feedback?: Text;
  reflection?: Text;
}

/** 6F 배지 · 자격 */
export interface BadgeEntry extends BaseEntry {
  template: "badge";
  issuer?: string;
  credentialType?: string;
  /** 인증 확인 페이지 주소 (https://…) */
  credentialUrl?: string;
  whatILearned?: Text;
  reflection?: Text;
}

/** 6F 성장 이정표 */
export interface MilestoneEntry extends BaseEntry {
  template: "milestone";
  careerYear?: string;
  event?: Text;
  significance?: Text;
  reflection?: Text;
}

/** B1 업무 시스템 */
export interface WorkflowEntry extends BaseEntry {
  template: "workflow";
  problem?: Text;
  previousProcess?: Text;
  newProcess?: Text;
  tools?: TextList;
  automation?: Text;
  result?: Text;
  timeSaved?: string;
  reflection?: Text;
}

/** B2 성찰 */
export interface ReflectionEntry extends BaseEntry {
  template: "reflection";
  context?: Text;
  problem?: Text;
  whatHappened?: Text;
  whatDidNotWork?: Text;
  changeMade?: Text;
  result?: Text;
  lessonLearned?: Text;
  nextStep?: Text;
}

/** B3 교육 철학 */
export interface PhilosophyEntry extends BaseEntry {
  template: "philosophy";
  theme?: string;
  belief?: Text;
  whyItMatters?: Text;
  howItAppearsInPractice?: Text;
  example?: Text;
  reflection?: Text;
}

/** B4 담임 아카이브 — 학생을 알아볼 수 있는 정보는 절대 넣지 마세요. */
export interface HomeroomEntry extends BaseEntry {
  template: "homeroom";
  category?: string;
  problemOrNeed?: Text;
  approach?: Text;
  materialsUsed?: TextList;
  process?: TextList;
  result?: Text;
  reflection?: Text;
  /** 익명화·개인정보 보호 안내 (패널에 강조되어 보입니다) */
  privacyNote?: Text;
}

/** RF 개인 프로젝트 */
export interface RooftopProjectEntry extends BaseEntry {
  template: "rooftop-project";
  category?: string;
  whyIMadeIt?: Text;
  coreFeatures?: TextList;
  techStack?: TextList;
  reflection?: Text;
}

/** 공통 필드만 쓰는 일반 항목 */
export interface GeneralEntry extends BaseEntry {
  template: "general";
}

export type PortfolioEntry =
  | TeachingEntry
  | AiCaseEntry
  | AiLiteracyEntry
  | AppEntry
  | LectureEntry
  | BadgeEntry
  | MilestoneEntry
  | WorkflowEntry
  | ReflectionEntry
  | PhilosophyEntry
  | HomeroomEntry
  | RooftopProjectEntry
  | GeneralEntry;

// ── 화면 표시 규칙 ─────────────────────────────────────────────

/**
 * How a template field is shown in the detail panel:
 * - fact:  short value in the info box (과목, 학년 …)
 * - tools: chips in the info box's 도구 row
 * - link:  a button next to the external links
 * - text / list / steps / notice: a titled section (hidden when empty)
 */
export type FieldKind = "fact" | "tools" | "link" | "text" | "list" | "steps" | "notice";

type ExtraKeys<T> = Exclude<keyof T, keyof BaseEntry>;

export interface TemplateSpec<T extends PortfolioEntry> {
  /** 템플릿 이름 (안내용) */
  label: string;
  /** 기본 유형 (`type` 생략 시) */
  type: ItemType;
  /** 화면에 보이는 순서대로 */
  fields: { key: ExtraKeys<T>; label: string; kind: FieldKind }[];
}

type SpecMap = { [K in TemplateId]: TemplateSpec<Extract<PortfolioEntry, { template: K }>> };

export const TEMPLATES: SpecMap = {
  teaching: {
    label: "2F 수업 설계",
    type: "lesson",
    fields: [
      { key: "subject", label: "과목", kind: "fact" },
      { key: "grade", label: "학년", kind: "fact" },
      { key: "unit", label: "단원", kind: "fact" },
      { key: "learningGoals", label: "학습 목표", kind: "list" },
      { key: "lessonFlow", label: "수업 흐름", kind: "steps" },
      { key: "materials", label: "수업 자료", kind: "list" },
      { key: "assessment", label: "평가", kind: "text" },
      { key: "reflection", label: "성찰", kind: "text" },
    ],
  },
  "ai-case": {
    label: "3F AI · 디지털 수업 사례",
    type: "case",
    fields: [
      { key: "subject", label: "과목", kind: "fact" },
      { key: "grade", label: "학년", kind: "fact" },
      { key: "toolUsed", label: "사용 도구", kind: "tools" },
      { key: "problem", label: "수업의 고민", kind: "text" },
      { key: "whyThisTool", label: "도구 선택 이유", kind: "text" },
      { key: "lessonFlow", label: "수업 흐름", kind: "steps" },
      { key: "studentUse", label: "학생 활동", kind: "text" },
      { key: "teacherRole", label: "교사 역할", kind: "text" },
      { key: "outcome", label: "결과", kind: "text" },
      { key: "reflection", label: "성찰", kind: "text" },
    ],
  },
  "ai-literacy": {
    label: "3F AI 리터러시",
    type: "lesson",
    fields: [
      { key: "topic", label: "주제", kind: "fact" },
      { key: "targetStudents", label: "대상", kind: "fact" },
      { key: "coreQuestion", label: "핵심 질문", kind: "notice" },
      { key: "learningGoals", label: "학습 목표", kind: "list" },
      { key: "activity", label: "활동", kind: "text" },
      { key: "concepts", label: "핵심 개념", kind: "list" },
      { key: "studentOutput", label: "학생 산출물", kind: "text" },
      { key: "reflection", label: "성찰", kind: "text" },
    ],
  },
  app: {
    label: "4F 앱",
    type: "app",
    fields: [
      { key: "version", label: "버전", kind: "fact" },
      { key: "targetUsers", label: "대상 사용자", kind: "fact" },
      { key: "techStack", label: "기술 스택", kind: "tools" },
      { key: "problem", label: "해결하려는 문제", kind: "text" },
      { key: "solution", label: "해결 방법", kind: "text" },
      { key: "coreFeatures", label: "핵심 기능", kind: "list" },
      { key: "developmentNotes", label: "개발 노트", kind: "text" },
      { key: "reflection", label: "성찰", kind: "text" },
    ],
  },
  lecture: {
    label: "5F 강의 · 연수",
    type: "lecture",
    fields: [
      { key: "audience", label: "대상", kind: "fact" },
      { key: "organization", label: "주최 · 기관", kind: "fact" },
      { key: "duration", label: "시간", kind: "fact" },
      { key: "format", label: "형식", kind: "fact" },
      { key: "objectives", label: "목표", kind: "list" },
      { key: "topics", label: "다룬 내용", kind: "list" },
      { key: "activities", label: "활동", kind: "list" },
      { key: "materials", label: "자료", kind: "list" },
      { key: "feedback", label: "참여자 피드백", kind: "text" },
      { key: "reflection", label: "성찰", kind: "text" },
    ],
  },
  badge: {
    label: "6F 배지 · 자격",
    type: "badge",
    fields: [
      { key: "issuer", label: "발급 기관", kind: "fact" },
      { key: "credentialType", label: "인증 종류", kind: "fact" },
      { key: "credentialUrl", label: "인증 확인", kind: "link" },
      { key: "whatILearned", label: "배운 점", kind: "text" },
      { key: "reflection", label: "성찰", kind: "text" },
    ],
  },
  milestone: {
    label: "6F 성장 이정표",
    type: "milestone",
    fields: [
      { key: "careerYear", label: "연차", kind: "fact" },
      { key: "event", label: "무슨 일이 있었나", kind: "text" },
      { key: "significance", label: "의미", kind: "text" },
      { key: "reflection", label: "성찰", kind: "text" },
    ],
  },
  workflow: {
    label: "B1 업무 시스템",
    type: "tool",
    fields: [
      { key: "timeSaved", label: "절약한 시간", kind: "fact" },
      { key: "tools", label: "도구", kind: "tools" },
      { key: "problem", label: "문제", kind: "text" },
      { key: "previousProcess", label: "이전 방식", kind: "text" },
      { key: "newProcess", label: "새 방식", kind: "text" },
      { key: "automation", label: "자동화한 부분", kind: "text" },
      { key: "result", label: "결과", kind: "text" },
      { key: "reflection", label: "성찰", kind: "text" },
    ],
  },
  reflection: {
    label: "B2 성찰",
    type: "reflection",
    fields: [
      { key: "context", label: "배경", kind: "text" },
      { key: "problem", label: "문제", kind: "text" },
      { key: "whatHappened", label: "무슨 일이 있었나", kind: "text" },
      { key: "whatDidNotWork", label: "잘 되지 않은 점", kind: "text" },
      { key: "changeMade", label: "바꾼 점", kind: "text" },
      { key: "result", label: "결과", kind: "text" },
      { key: "lessonLearned", label: "배운 점", kind: "text" },
      { key: "nextStep", label: "다음 단계", kind: "text" },
    ],
  },
  philosophy: {
    label: "B3 교육 철학",
    type: "essay",
    fields: [
      { key: "theme", label: "주제", kind: "fact" },
      { key: "belief", label: "믿음", kind: "notice" },
      { key: "whyItMatters", label: "왜 중요한가", kind: "text" },
      { key: "howItAppearsInPractice", label: "실천 속 모습", kind: "text" },
      { key: "example", label: "사례", kind: "text" },
      { key: "reflection", label: "성찰", kind: "text" },
    ],
  },
  homeroom: {
    label: "B4 담임 아카이브",
    type: "document",
    fields: [
      { key: "category", label: "분류", kind: "fact" },
      { key: "privacyNote", label: "개인정보 보호", kind: "notice" },
      { key: "problemOrNeed", label: "필요 · 문제", kind: "text" },
      { key: "approach", label: "접근", kind: "text" },
      { key: "materialsUsed", label: "사용 자료", kind: "list" },
      { key: "process", label: "진행 과정", kind: "steps" },
      { key: "result", label: "결과", kind: "text" },
      { key: "reflection", label: "성찰", kind: "text" },
    ],
  },
  "rooftop-project": {
    label: "RF 개인 프로젝트",
    type: "app",
    fields: [
      { key: "category", label: "분류", kind: "fact" },
      { key: "techStack", label: "기술 스택", kind: "tools" },
      { key: "whyIMadeIt", label: "만든 이유", kind: "text" },
      { key: "coreFeatures", label: "핵심 기능", kind: "list" },
      { key: "reflection", label: "성찰", kind: "text" },
    ],
  },
  general: { label: "일반", type: "document", fields: [] },
};
