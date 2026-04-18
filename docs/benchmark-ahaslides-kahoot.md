# AhaSlides & Kahoot 벤치마킹 리포트

> 사내 인터랙티브 프레젠테이션/퀴즈 툴(samslide) 기획을 위한 경쟁 제품 조사 문서
> 작성일: 2026-04-17

---

## 1. 개요

사내 미팅, 교육, 워크숍, 타운홀에서 활용할 인터랙티브 프레젠테이션 툴을 개발하기 위해 시장 대표 제품 두 가지를 조사했다.

| 구분 | AhaSlides | Kahoot! |
|---|---|---|
| 포지셔닝 | **인터랙티브 프레젠테이션** 플랫폼 | **게임 기반 학습(퀴즈)** 플랫폼 |
| 주 타깃 | 기업/고등교육/전문 이벤트 | K-12 교실, 가족·친구 캐주얼 게임 |
| 핵심 경험 | 슬라이드 중에 폴/워드클라우드/Q&A 삽입 | 6자리 PIN으로 입장하는 경쟁형 퀴즈 게임 |
| 분위기 | 비즈니스 톤, 정제된 UI | 컬러풀·게임스러운 UI, BGM/효과음 강조 |
| 사용자 규모 | 400만+ 사용자 | 연간 10억+ 플레이어 |

두 제품은 "발표자가 만든 콘텐츠에 청중이 모바일로 실시간 참여한다"는 구조는 동일하지만, **콘텐츠의 성격(슬라이드 vs 게임)** 과 **사용 맥락(업무 vs 교실)** 에서 차이가 크다.

---

## 2. AhaSlides

### 2.1 제품 개요
- 전통적인 슬라이드 프레젠테이션 + 인터랙티브 요소(폴·퀴즈·Q&A)를 **한 덱 안에 섞어** 사용하는 하이브리드 툴.
- 사내 교육, 워크숍, 웨비나, 타운홀, 올핸즈 미팅 같은 **비즈니스/전문 이벤트** 용도에 강점.

### 2.2 질문·슬라이드 유형

**여론 수집(Polls & Opinions)**
- Poll: 객관식 실시간 투표 (막대·도넛·파이차트)
- Word Cloud: 키워드를 모아 밀도 시각화
- Open-Ended: 자유 서술형 답변 수집
- Q&A: 청중 질문 받기 + 업보트
- Rating Scales: 척도/만족도
- Brainstorm: 아이디어 제출 + 업보트

**퀴즈 & 학습 게임**
- Pick Answer: 객관식/OX/이미지 기반
- Short Answer: 단답형
- Match Pairs: 짝 맞추기
- Categorize: 분류하기
- Correct Order: 순서 맞추기

**기타**
- Spinner Wheel: 랜덤 뽑기
- 일반 콘텐츠 슬라이드 (텍스트/이미지/동영상)

### 2.3 주요 기능
- **PowerPoint / Google Slides 플러그인**: 기존 덱 안에서 바로 인터랙션 삽입
- **Zoom / MS Teams 연동**
- **Reports & Analytics**: 세션 종료 후 참여 데이터 내보내기
- **Branding**: 로고/테마/배경 커스터마이징 (유료 티어)
- **AI generator**: 프롬프트로 퀴즈·슬라이드 생성
- **99.9% uptime** 유지 (공식 수치)

### 2.4 요금제 (2026 기준, 연간 결제)
| 플랜 | 가격 | 특징 |
|---|---|---|
| Free | $0 | 퀴즈 5개 / 폴 3개 / 세션당 50명 |
| Educator | $2.95~/월 | 교육자용 |
| Professional | $7.95~/월 | 비즈니스용 |
| Full Branding | $15.95~/월 | 전체 브랜딩 |

### 2.5 강점 / 약점
- ✅ 슬라이드 흐름을 유지하며 인터랙션 삽입 → **프레젠테이션 본연의 맥락 보존**
- ✅ 질문 유형이 다양 (여론형 + 퀴즈형 모두)
- ✅ Kahoot 대비 68~77% 저렴
- ❌ 게임성·경쟁 몰입감은 Kahoot보다 약함
- ❌ 브랜드 인지도는 Kahoot보다 낮음

---

## 3. Kahoot!

### 3.1 제품 개요
- **게임 기반 학습** 플랫폼. "Kahoot"이라는 고유 포맷(경쟁 랭킹·타이머·효과음) 자체가 브랜드.
- 정답 속도에 따라 점수가 차등 배분되어 **경쟁 몰입**을 극대화.
- 프레젠테이션 툴이라기보다는 **퀴즈 쇼 엔진**. 슬라이드 기능은 보조적.

### 3.2 질문 유형
- **Multiple Choice**: 2개 이상의 선택지 (Kahoot의 상징적 4색 도형 UI)
- **True / False**: OX
- **Type Answer**: 단답 입력
- **Puzzle**: 순서 맞추기
- **Slider**: 수치형 슬라이더 (연도·값 맞추기)
- **Pin Answer**: 이미지 위 좌표 찍기
- **Poll / Open-ended**: 여론형 (학습 외 용도)

### 3.3 게임 모드
| 모드 | 특징 |
|---|---|
| Classic Live | 호스트 주도 실시간 동시 플레이 (PIN 입장) |
| Self-paced (Color Kingdoms 등) | 각자 속도로, 같이 플레이 |
| Assignments | 비동기 과제 모드 |
| Solo | 혼자 학습 |

### 3.4 입장 & 참여 UX
- 호스트가 세션 시작 → **6자리 Game PIN** 자동 생성
- 참가자는 `kahoot.it` / 앱 / QR / 공유 링크로 입장 (계정 불필요)
- PIN은 **세션 종료 시 만료** → 보안·일회성 보장
- 닉네임 설정 후 바로 참여

### 3.5 요금제 (2026 기준)
| 플랜 | 가격 | 특징 |
|---|---|---|
| Basic | 무료 | 제한적 |
| Starter | $10/월~ | 최대 20명 |
| Educator | $12.99/월~ | 로고 추가 |
| Professional | $25/월~ | |
| Full Branding | $59/월~ | 전체 브랜딩 |

### 3.6 강점 / 약점
- ✅ 압도적인 **브랜드 인지도** — "Kahoot 하자"가 고유명사화
- ✅ 랭킹 보드·BGM·효과음 등 **게임 연출** 완성도
- ✅ 즉시성·경쟁성에서 몰입감 최고
- ❌ 프레젠테이션용으로는 부적절 (별도 슬라이드 툴과 병행 필요)
- ❌ 업무 톤에는 컬러풀한 UI가 어울리지 않을 수 있음
- ❌ AhaSlides 대비 가격이 3~4배 비쌈

---

## 4. 기능 비교 매트릭스

| 기능 | AhaSlides | Kahoot! |
|---|---|---|
| 객관식 퀴즈 | ✅ | ✅ |
| OX 퀴즈 | ✅ | ✅ |
| 단답형 | ✅ | ✅ |
| 슬라이더/척도 | ✅ | ✅ |
| 순서 맞추기 | ✅ | ✅ (Puzzle) |
| 짝 맞추기 | ✅ | ❌ |
| 분류하기 | ✅ | ❌ |
| 이미지 위 좌표 찍기 | ❌ | ✅ (Pin Answer) |
| 워드클라우드 | ✅ | ❌ |
| 브레인스토밍 + 업보트 | ✅ | ❌ |
| Q&A (청중 질문) | ✅ | ❌ |
| 스피너 휠(랜덤 추첨) | ✅ | ❌ |
| 일반 콘텐츠 슬라이드 | ✅ (강력) | △ (제한적) |
| 실시간 랭킹 리더보드 | △ | ✅ (핵심 UX) |
| 속도 기반 점수 | ✅ | ✅ (핵심 UX) |
| 비동기 과제 | △ | ✅ |
| PowerPoint / Google Slides 통합 | ✅ | △ |
| Zoom / Teams 통합 | ✅ | ✅ |
| AI 콘텐츠 생성 | ✅ | ✅ |
| 세션 분석 리포트 | ✅ | ✅ |

---

## 5. 공통 UX 패턴 (벤치마킹할 핵심)

두 제품 모두 다음 흐름을 공유한다. 사내 툴도 이 기본 축은 따라야 한다.

1. **호스트가 덱/퀴즈 제작** (웹 에디터)
2. **세션 시작 → 단축 코드/PIN 생성**
3. **참가자는 코드·링크·QR로 입장** (가능하면 **로그인 없이**)
4. **닉네임 입력 → 대기 로비 → 시작**
5. **슬라이드별 실시간 응답 수집**
6. **결과 시각화** (차트/랭킹/워드클라우드)
7. **세션 종료 → 리포트/분석**

### 중요한 세부 디테일
- 코드는 **짧고(4~6자리), 세션 종료 시 만료** — 보안 + UX.
- 참가자 디바이스는 **모바일 웹**이 기본 (앱 설치 강요 X).
- 호스트 화면과 참가자 화면은 **분리** (프로젝터/공유 화면 vs 개인 모바일).
- 지연 시간: 수백 명 동시 응답 처리를 위한 **실시간 인프라**(WebSocket/PubSub) 필수.

---

## 6. 사내 툴(samslide) 설계 제언

### 6.1 포지셔닝 제안
> "**업무 맥락에 최적화된 AhaSlides형 하이브리드 툴**, 단 Kahoot 수준의 경쟁 몰입 모드도 선택 가능"

사내 활용 시나리오가 다양하므로(타운홀 Q&A, 신규 입사자 교육 퀴즈, 워크숍 브레인스토밍, 회식 아이스브레이커 등), **AhaSlides처럼 질문 유형을 다양화**하되 Kahoot의 **경쟁 게임 모드**를 옵션으로 제공하는 방향이 합리적.

### 6.2 MVP 기능 우선순위

**Must Have (v1)**
- 웹 기반 슬라이드 에디터
- 객관식 / OX / 단답 / 워드클라우드 / Q&A 5종
- **일반 콘텐츠 슬라이드 (텍스트/이미지)** — 에디터 구조 영향이 커 v1에 포함
- **CSV / Excel 일괄 문제 입력** (자세한 스펙은 §6.5)
- 6자리 코드 입장 (참가자는 로그인 X)
- **SSO (사내 계정 연동)** — 호스트 인증은 사내 툴 특성상 v1 필수
- 호스트/참가자 화면 분리
- 실시간 응답 집계 + 기본 차트
- 세션 리포트 CSV 내보내기

**Should Have (v2)**
- 경쟁 모드 (속도 점수 + 리더보드)
- 브레인스토밍 + 업보트
- 업로드 시 이미지·미디어 URL 참조 지원

**Nice to Have (v3+)**
- MS Teams 연동
- 비동기 과제 모드
- 짝 맞추기·분류하기 등 고급 유형
- Confluence import

### 6.3 사내 특화 기회 요소
경쟁 제품 대비 사내 툴이 가질 수 있는 차별점:
- **SSO 기반 자동 참가자 인증** — 닉네임 익명성 대신 실명·부서 집계 가능 (HR 리포팅에 유리)
- **사내 메신저 연동** — MS Teams 채널에 세션 링크 원클릭 공유
- **사내 브랜드 디자인 시스템 기본 적용** — 별도 브랜딩 요금제 불필요
- **데이터 주권** — 외부 SaaS에 민감한 사내 논의가 저장되지 않음 (타운홀 Q&A 등)
- **무료·무제한 참가자** — 외부 툴은 인원·세션당 과금이 가장 큰 불만

### 6.4 주의할 점
- Kahoot의 "경쟁" 연출은 **사내 문화에 따라 역효과**가 날 수 있음 (예: 시니어가 부담). 경쟁 모드는 **기본 OFF**가 적절.
- 익명성 ↔ 실명성은 질문 유형마다 다르게 처리해야 함. 솔직한 피드백을 원하는 폴은 익명, 랭킹 게임은 실명 등.
- Q&A 업보트는 **심리적 안전감**을 위해 필수.

---

### 6.5 문제 일괄 입력 (Bulk Import)

교육 담당자나 현업 강사가 웹 에디터에서 문제를 하나씩 만드는 것은 수십~수백 문항 규모 퀴즈에서는 큰 병목이다. **CSV / Excel(XLSX)** 파일을 업로드하면 문제 세트가 일괄 생성되는 기능을 v1 Must Have로 포함한다.

#### 6.5.1 벤치마크 레퍼런스
- **Kahoot**: "Import spreadsheet" 기능 제공 — 공식 XLSX 템플릿을 내려받아 채워 업로드하면 Kahoot 덱으로 변환됨. 다만 **객관식/OX 위주**로 유형이 제한적.
- **AhaSlides**: CSV 임포트 지원. 역시 퀴즈 계열 위주.
- → samslide는 **모든 질문 유형에 대해 일괄 입력을 지원**하여 두 경쟁 제품의 한계를 넘는다.

#### 6.5.2 지원 포맷
| 포맷 | 용도 |
|---|---|
| **CSV (UTF-8 BOM 포함)** | 가장 가벼운 기본 포맷. 개발자·파워유저. |
| **XLSX** | 비개발자가 가장 자주 쓰는 형식. 시트 하나당 퀴즈 세트 하나. |
| **JSON** (옵션) | API/자동화 파이프라인용. |

모든 포맷에서 **동일한 스키마**를 공유하도록 설계한다(공통 파서 + 포맷별 어댑터).

#### 6.5.3 통합 스키마 (권장안)

하나의 시트/파일에 **여러 질문 유형을 혼합**할 수 있도록 `type` 컬럼을 1열에 둔다. 유형별로 의미가 달라지는 컬럼은 공통 이름(`option1`~`optionN`, `answer`, `time_limit` 등)으로 통일한다.

**공통 컬럼**
| 컬럼 | 타입 | 설명 | 기본값 |
|---|---|---|---|
| `type` | enum | 질문 유형 (아래 표 참조) | (필수) |
| `question` | string | 질문 본문 | (필수) |
| `media_type` | enum | `image` / `video` / `none` | `none` |
| `media_src` | string | 미디어 위치 — URL 또는 ZIP 내 상대경로(`media/q1.png`) | null |
| `media_position` | enum | `top` / `bottom` / `background` | `top` |
| `media_autoplay` | bool | 동영상 자동재생 여부 | `false` |
| `media_start_sec` | int | 동영상 시작 타임스탬프(초) | 0 |
| `media_end_sec` | int | 동영상 종료 타임스탬프(초) | null |
| `media_alt` | string | 접근성용 대체 텍스트 | null |
| `time_limit` | int(sec) | 제한 시간 | 20 |
| `points` | int | 만점 점수 | 1000 |
| `anonymous` | bool | 익명 응답 여부 | type별 기본값 |
| `tags` | csv | 분류용 태그 | null |

> 기존 `image_url` 컬럼은 하위호환으로 계속 읽되, 내부적으로 `media_type=image, media_src=<url>`로 자동 변환한다.

**유형별 컬럼 매핑**

| 유형(`type`) | 추가 컬럼 | 예시 |
|---|---|---|
| `multiple_choice` | `option1`~`option6`, `answer` (정답 인덱스, `1\|3` 복수 허용) | `2` |
| `true_false` | `answer` (`true`/`false`) | `true` |
| `short_answer` | `answer` (정답, `\|`로 허용 동의어 구분) | `서울\|Seoul\|SEOUL` |
| `poll` | `option1`~`option6`, `allow_multiple` | `false` |
| `rating` | `min_label`, `max_label`, `min_value`, `max_value` | `1`, `5` |
| `word_cloud` | `max_submissions_per_user` | `3` |
| `open_ended` | `max_length` | `500` |
| `qna` | `allow_upvote`, `moderation` | `true`, `true` |
| `brainstorm` | `allow_upvote`, `max_submissions_per_user` | `true`, `5` |
| `match_pairs` | `left_items`, `right_items` (`\|` 구분, 같은 인덱스가 정답쌍) | `한국\|일본`, `서울\|도쿄` |
| `correct_order` | `items_in_order` (`\|` 구분, 순서대로 정답) | `계획\|실행\|리뷰\|회고` |
| `categorize` | `categories`, `item_category_pairs` (`item:category` 형태) | `포유류\|조류`, `사자:포유류\|독수리:조류` |
| `slider` | `min_value`, `max_value`, `answer`, `tolerance` | `0`, `100`, `42`, `2` |

**예시 CSV (혼합 유형)**
```csv
type,question,option1,option2,option3,option4,answer,time_limit,points,image_url
multiple_choice,"Kahoot은 어느 나라에서 시작됐나요?",노르웨이,스웨덴,덴마크,핀란드,1,20,1000,
true_false,"samslide는 사내 툴이다.",,,,,true,10,500,
short_answer,"한국의 수도는?",,,,,서울|Seoul,15,800,
word_cloud,"오늘 기분을 한 단어로?",,,,,,60,0,
poll,"점심 메뉴?",한식,중식,양식,일식,,30,0,
correct_order,"스프린트 순서",,,,,계획|실행|리뷰|회고,25,1000,
```

**XLSX 권장 구조**
- 시트 1: `Questions` (위 스키마)
- 시트 2: `Settings` (덱 제목, 설명, 경쟁 모드 ON/OFF, 기본 time_limit 등)
- 시트 3: `README` (작성 가이드 — 사용자에게 친숙하도록)

#### 6.5.4 이미지·동영상 첨부 방식

`media_src`가 가리키는 대상에 따라 세 가지 방식을 모두 지원한다.

| 방식 | `media_src` 예시 | 적합한 경우 |
|---|---|---|
| **① 사내 스토리지 URL 참조** | `https://storage.samsung.intra/assets/2026/q1.png` | 이미 사내 공유 드라이브/CDN에 올려둔 미디어 재사용. 대용량 동영상. |
| **② ZIP 번들 내 상대경로** | `media/q1.png` | 스프레드시트 + 미디어를 **하나의 ZIP으로 자기완결적 공유**. 가장 권장. |
| **③ 사전 업로드 에셋 ID** | `asset://a1b2c3` | 에셋 라이브러리에 먼저 올려 재사용. API·자동화용. |

**ZIP 번들 구조 예시**
```
my-quiz.zip
├── questions.xlsx        ← Questions/Settings/README 시트
└── media/
    ├── q1.png
    ├── q2.jpg
    └── intro.mp4
```

**지원 미디어 사양**
- 이미지: PNG / JPG / GIF / WebP, 파일당 **최대 10MB**
- 동영상: MP4(H.264) / WebM, 파일당 **최대 200MB**, 권장 길이 ≤ 2분
- ZIP 번들 전체: **최대 500MB**
- 동영상 임베드: 사내 허용 도메인(예: 사내 비디오 플랫폼)만 iframe 허용. YouTube·Vimeo는 기본 차단(정책에 따라 화이트리스트로 열 수 있음).

**검증 규칙 (미디어)**
- `media_src`가 URL이면 **허용 도메인 화이트리스트** 대조 + HEAD 요청으로 접근성/MIME 확인
- ZIP 상대경로면 번들 내 실제 존재 여부 확인, **경로 탈출(`../`) 차단**
- 파일 확장자와 실제 매직 넘버(file signature) 교차 검증 — 가짜 확장자 차단
- `media_type=video`인데 이미지 확장자이거나 그 반대일 경우 명시적 에러

#### 6.5.5 업로드 흐름 (UX)

```
[1] 템플릿 다운로드 ──→ [2] 파일 업로드 (CSV / XLSX)
            ↓
   [3] 서버 파싱 + 검증
            ↓
   [4] 미리보기 화면 (유효 문항 / 에러 문항 분리)
            ↓
   [5] 에러 행 인라인 수정 OR 원본 수정 후 재업로드
            ↓
   [6] "덱에 추가" 클릭 → 에디터 반영
```

- **미리보기에서 각 문항을 렌더링된 슬라이드 프리뷰로 표시** (WYSIWYG).
- 에러 행은 빨간 배경 + 에러 메시지 인라인, **나머지 정상 행은 그대로 저장 가능** (부분 성공 허용).
- 인라인 수정 후 재검증은 클라이언트에서 즉시 수행.

#### 6.5.6 검증 규칙 (파서 스펙)
- `type`은 whitelist 대조 — 오탈자 시 유사어 추천 (`multi_choice` → `multiple_choice`?).
- `multiple_choice`는 `option` 2~6개, `answer`는 존재하는 인덱스만 허용.
- `short_answer.answer` 동의어 파이프(`|`)는 내부적으로 소문자·공백 정규화 후 매칭.
- `time_limit`·`points`는 정수 + 범위 검증 (time_limit: 5~300s, points: 0~2000).
- `image_url`은 HTTPS + 확장자 검증 + 사내 허용 도메인 화이트리스트.
- 중복 질문 감지(정규화 문자열 해시 비교) → 경고 표시, 차단은 아님.
- 인코딩 자동 감지 (UTF-8 BOM, CP949 혼용 처리 — 한국 사내 환경에서 중요).

#### 6.5.7 템플릿 제공 방식
- **유형별 단일 시트 템플릿** (XLSX 8종) — 초보자용, 한 파일 한 유형.
- **통합 템플릿** (XLSX 1종) — `type` 컬럼으로 혼합, 파워유저용.
- 에디터 UI에 **"템플릿 다운로드"** 드롭다운 (유형별 선택).
- 시트 상단에 drop-down validation(데이터 유효성 검사)로 `type`, `true/false` 등을 고정.

#### 6.5.8 역방향 기능 (Export ↔ Import 대칭)
- 에디터에서 만든 덱을 **같은 스키마 CSV/XLSX로 내보내기** 지원 → 편집·공유·버전 관리를 스프레드시트에서 할 수 있음.
- 이로써 "**에디터/스프레드시트 어느 쪽에서 편집해도 항상 동기화되는 단일 진실**" 구조가 완성됨.

#### 6.5.9 확장 고려
- **행 단위 API (`POST /decks/{id}/questions/bulk`)**: 같은 스키마를 JSON 배열로 받는 엔드포인트를 함께 제공하면, 사내 LMS·자동화 스크립트에서 그대로 사용 가능.
- **템플릿 버전 관리**: 스키마 변경 시에도 구버전 템플릿을 `schema_version` 컬럼/메타로 자동 마이그레이션하여 사용자 혼란 방지.

---

## 7. 출처

- [AhaSlides 공식 사이트](https://ahaslides.com/)
- [AhaSlides Features 페이지](https://ahaslides.com/features/)
- [AhaSlides vs Kahoot 공식 비교](https://ahaslides.com/compare/ahaslides-vs-kahoot/)
- [AhaSlides 가격 정책](https://ahaslides.com/pricing/)
- [Kahoot! 공식 사이트](https://kahoot.com/)
- [Kahoot Question Types 공식 문서](https://support.kahoot.com/hc/en-us/articles/115002308428-Kahoot-question-types)
- [Kahoot PIN & Join 공식 문서](https://support.kahoot.com/hc/en-us/articles/360039890713-Kahoot-join-How-to-join-a-Kahoot-game)
- [G2: AhaSlides vs Kahoot](https://www.g2.com/compare/ahaslides-vs-kahoot)
- [Software Advice: AhaSlides vs Kahoot](https://www.softwareadvice.com/polling/ahaslides-profile/vs/kahoot/)
- [Rigorous Themes: AhaSlides vs Kahoot 10 Features](https://rigorousthemes.com/blog/ahaslides-vs-kahoot/)
- [Atomi Systems: Kahoot Review 2026](https://atomisystems.com/elearning/kahoot-review-2026-features-pricing-better-alternatives/)
