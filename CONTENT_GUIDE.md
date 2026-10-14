# 콘텐츠 추가 안내서

포트폴리오 타워에 새 작품을 올리는 방법입니다. **3D 코드는 건드리지 않습니다.** 글자 데이터만 고치면 알맞은 층과 구역에 작품이 자동으로 놓입니다.

---

## 1. 파일은 어디에 있나요?

| 무엇 | 위치 |
| --- | --- |
| 작품 데이터 (여기를 고칩니다) | `src/content/portfolio/` |
| 복사해서 쓰는 빈 양식 | `content-templates/` |
| 이미지 | `public/images/` |
| PDF 등 내려받을 파일 | `public/files/` |
| 층 · 구역 목록 (보통은 고치지 않음) | `src/content/floors.ts`, `src/content/zones.ts` |

## 2. 층마다 어떤 양식을 쓰나요?

| 층 | 작품을 넣는 파일 | 빈 양식 | 구역 id (`zone`) |
| --- | --- | --- | --- |
| 2F 수업 설계 | `portfolio/teaching.ts` | `teaching-template.ts` | `2f-biology` 생명과학 · `2f-integrated` 통합과학 · `2f-inquiry` 탐구 활동 · `2f-assessment` 수행평가 · `2f-worksheets` 학습지 |
| 3F AI · 디지털 수업 사례 | `portfolio/aiDigital.ts` | `ai-digital-template.ts` | `3f-cases` |
| 3F AI 리터러시 | `portfolio/aiDigital.ts` | `ai-literacy-template.ts` | `3f-literacy` |
| 4F 앱 | `portfolio/apps.ts` | `app-template.ts` | `4f-dev` 개발 중 · `4f-integrated` 통합과학 · `4f-biology` 생명과학 · `4f-inquiry` 기타 탐구 도구 |
| 5F 강의 · 연수 | `portfolio/lectures.ts` | `lecture-template.ts` | `5f-lectures` 강의 · `5f-workshops` 워크숍 · `5f-materials` 자료실 |
| 6F 배지 · 자격 | `portfolio/growth.ts` | `badge-template.ts` | `6f-badges` 배지 · `6f-certs` 자격 · 수료 |
| 6F 성장 이정표 | `portfolio/growth.ts` | `milestone-template.ts` | `6f-timeline` |
| B1 업무 시스템 | `portfolio/workflows.ts` | `workflow-template.ts` | `b1-automation` 자동화 · `b1-data` 데이터 · 평가 |
| B2 성찰 | `portfolio/reflections.ts` | `reflection-template.ts` | `b2-lessons` 수업 개선 · `b2-iterations` 앱 개선 |
| B3 교육 철학 | `portfolio/philosophy.ts` | `philosophy-template.ts` | `b3-teaching` · `b3-science` · `b3-assessment` |
| B4 담임 아카이브 | `portfolio/homeroom.ts` | `homeroom-template.ts` | `b4-management` · `b4-communication` · `b4-templates` |
| RF 옥상 정원 | `portfolio/rooftop.ts` | `rooftop-project-template.ts` | `rf-garden` |

`floor` 에는 층 id(`"2f"`, `"b1"`, `"rf"` …)를 씁니다. 구역 id 앞부분과 같습니다.

## 3. 꼭 채워야 하는 항목

| 항목 | 설명 | 예 |
| --- | --- | --- |
| `id` | 작품마다 다른 이름. 영문 소문자, 숫자, `-` 만 | `"lesson-photosynthesis-2026"` |
| `template` | 양식 종류. 양식에 이미 적혀 있으니 바꾸지 마세요 | `"teaching"` |
| `title` | 제목 | `"광합성 탐구 수업"` |
| `shortDescription` | 한두 문장 요약. 카드와 패널 첫 줄에 보입니다 | `"빛의 세기에 따른 …"` |
| `floor` | 층 id | `"2f"` |
| `zone` | 구역 id (위 표 참고) | `"2f-biology"` |
| `publishedAt` | 게시일. 반드시 `YYYY-MM-DD` | `"2026-11-03"` |

## 4. 채우지 않아도 되는 항목

나머지는 전부 **선택**입니다. 비워 두거나 줄째 지우면 화면에서도 그 부분이 사라집니다. 빈 제목만 덩그러니 남지 않습니다.

- `description` 긴 본문 · `date` 화면에 보일 기간 · `role` 맡은 역할
- `thumbnail` 대표 이미지 · `gallery` 추가 이미지 · `attachments` 첨부 파일 · `externalLinks` 링크 버튼
- `tags` 검색용 태그 · `status` 진행 상태 · `featured` 추천 작품
- 양식별 항목: 학습 목표, 수업 흐름, 성찰 등 (양식 파일의 주석을 참고하세요)

## 5. 새 작품 하나 추가하기

1. `content-templates/` 에서 알맞은 빈 양식을 엽니다. 예: 2F 수업이면 `teaching-template.ts`
2. `=` 뒤의 `{` 부터 맨 끝 `}` 까지 복사합니다.
3. 작품을 넣을 파일을 엽니다. 예: `src/content/portfolio/teaching.ts`
4. 목록 `[ … ]` 안, 마지막 작품의 `},` 다음 줄에 붙여 넣고, 붙여 넣은 블록 끝에 쉼표 `,` 를 붙입니다.
5. `""` 안을 채웁니다. 쓰지 않는 선택 항목은 지워도 됩니다.
6. 저장하면 끝입니다. 해당 층 · 구역에 작품이 자동으로 놓이고, 검색에도 나옵니다.

```ts
export const teachingEntries: TeachingEntry[] = [
  { …기존 작품… },
  {
    id: "lesson-photosynthesis-2026",
    template: "teaching",
    title: "광합성 탐구 수업",
    shortDescription: "빛의 세기에 따른 광합성 속도를 모둠별로 측정합니다.",
    floor: "2f",
    zone: "2f-biology",
    publishedAt: "2026-11-03",
    subject: "생명과학",
    learningGoals: ["광합성에 영향을 주는 요인을 설명할 수 있다."],
    lessonFlow: ["질문 만들기", "실험 설계", "측정", "결과 발표"],
    reflection: "측정 시간을 더 확보해야겠습니다.",
  },
];
```

### 글 쓰는 요령

- 한국어, 영어, 섞어 쓰기 모두 괜찮습니다. 긴 제목도 화면에 맞게 줄바꿈됩니다.
- **문단을 나누려면** 글 안에 `\n\n` 을 넣습니다. 예: `"첫 문단입니다.\n\n둘째 문단입니다."`
- **목록 항목**(학습 목표, 핵심 기능 등)은 `["첫째", "둘째"]` 처럼 대괄호 안에 쉼표로 나눕니다. 수업 흐름 · 진행 과정은 자동으로 1, 2, 3 번호가 붙습니다.
- 글 안에 큰따옴표 `"` 를 쓰려면 `\"` 로 씁니다. 또는 ‘작은따옴표’나 「」를 쓰세요.

## 6. 이미지와 PDF 붙이기

1. 이미지는 `public/images/`, PDF 등 파일은 `public/files/` 에 넣습니다. (폴더가 없으면 만드세요)
2. 주소는 `public` 을 빼고 `/` 부터 씁니다.

```ts
thumbnail: "/images/photosynthesis.png",
thumbnailAlt: "모둠별 실험 장면",
gallery: [
  { src: "/images/photosynthesis-1.png", alt: "측정 결과 그래프" },
],
attachments: [
  { label: "지도안 내려받기", url: "/files/photosynthesis.pdf", preview: true },
],
```

- `preview: true` 를 쓰면 PDF를 패널 안에서 바로 볼 수 있습니다.
- 파일 종류(PDF, 한글, PPT 등)는 확장자로 자동 판단합니다.
- 파일 이름은 영문 · 숫자로 짓는 것이 안전합니다. (예: `photosynthesis-2026.pdf`)
- `thumbnail` 이 없으면 자동으로 색 그림이 들어갑니다.

## 7. 외부 링크 버튼 달기

```ts
externalLinks: [
  { label: "앱 열기", url: "https://my-app.example.com", kind: "live" },
  { label: "소스 코드", url: "https://github.com/…", kind: "github" },
  { label: "수업 영상", url: "https://youtu.be/…", kind: "video" },
],
```

- 주소는 반드시 `https://` 로 시작합니다.
- `kind: "live"` 버튼은 강조 색으로 보입니다.
- 6F 배지의 `credentialUrl` 을 채우면 '인증 확인' 버튼이 자동으로 생깁니다.

## 8. NEW 표시는 어떻게 붙나요?

`publishedAt` 날짜로부터 **14일 동안** 작품, 구역, 층, 엘리베이터 버튼에 NEW 가 붙습니다. 날짜가 지나면 저절로 사라집니다.

## 9. 추천 작품으로 걸기

`featured: true` 를 넣으면 1층 로비의 **추천 작품** 목록에 나옵니다.

## 10. 진행 상태 (주로 앱)

`status` 는 다음 중 하나입니다. 4F '개발 중' 구역에서는 이 순서대로 정렬됩니다.

`"IDEA"` 아이디어 → `"PROTOTYPE"` 시제품 → `"TESTING"` 테스트 중 → `"RELEASE_CANDIDATE"` 출시 후보 → `"RELEASED"` 출시 → `"ARCHIVED"` 보관

## 11. 예시 콘텐츠 정리하기

지금 들어 있는 작품은 모두 **예시(placeholder)** 입니다. `sample: true` 줄이 붙어 있고, 상세 패널에 `예시` 표시가 보입니다.

- 예시를 실제 내용으로 고쳤다면 `sample: true` 줄을 지우세요.
- 필요 없는 예시는 `{` 부터 `},` 까지 블록째 지우면 됩니다.
- 구역에 작품이 하나도 없으면 "아직 전시된 작품이 없습니다" 라고 나옵니다.

## 12. 잘 들어갔는지 확인하기

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 을 엽니다. 주소 뒤에 `?item=작품id` 를 붙이면 그 작품으로 바로 갑니다. 예: `http://localhost:3000/?item=lesson-photosynthesis-2026`

자동 점검이 다음을 확인합니다.

- 같은 `id` 가 두 번 쓰였는지
- 없는 층 · 구역을 적었는지, 구역이 그 층의 것이 맞는지
- 필수 항목이 비어 있는지
- 날짜 형식, 링크 · 파일 주소가 이상한지

문제가 있으면 개발 화면 왼쪽 아래 N 옆에 **빨간 `1 Issue` 표시**가 뜹니다. 누르면 `[콘텐츠 점검]` 으로 시작하는 한국어 설명이 나옵니다. (브라우저 콘솔 F12 에도 같은 내용이 나옵니다) 문제가 있는 작품은 화면에서 빠지고, 나머지는 그대로 보입니다.

배포용으로 만들 때(`npm run build`)는 오류가 있으면 **만들기가 멈춥니다.** 잘못된 내용이 그대로 올라가지 않게 하기 위해서입니다.

## 13. 꼭 지켜 주세요

- **B4 담임 아카이브와 모든 층**: 학생 이름, 사진, 학번, 상담 내용 등 학생을 알아볼 수 있는 정보는 넣지 마세요. 사례는 익명화하고, 담임 양식의 `privacyNote` 에 익명화 사실을 적어 주세요.
- 쉼표 `,` 와 따옴표 `"` 가 빠지면 화면이 뜨지 않습니다. 붙여 넣은 블록의 끝 `},` 를 꼭 확인하세요.
- 새 층이나 구역을 만드는 일은 `src/content/floors.ts`, `zones.ts` 에서 합니다. 개발용 안내는 `README.md` 에 있습니다.
