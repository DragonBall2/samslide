# samslide 구현 계획

> 전제: 벤치마크 문서(`benchmark-ahaslides-kahoot.md`)의 §6.2 v1 Must Have 범위를 **첫 릴리스 목표**로 삼는다.
> 작성일: 2026-04-18

---

## 1. 목표와 범위

### 1.1 v1 목표 (약 4.5개월 이내 사내 GA)
- 웹 기반 슬라이드 에디터
- 질문 유형 5종: 객관식 / OX / 단답 / 워드클라우드 / Q&A
- **일반 콘텐츠 슬라이드**(텍스트/이미지) — 인터랙션 없는 정적 슬라이드
- CSV·XLSX 일괄 입력 (미디어 ZIP 번들 포함)
- 6자리 코드 입장 / 호스트·참가자 화면 분리
- **사내 SSO(OIDC) 기반 호스트 인증** — 참가자는 코드만으로 익명 입장
- 실시간 응답 집계 + 기본 차트
- 세션 리포트 CSV 내보내기

> **범위 확장 근거**: 일반 콘텐츠 슬라이드와 SSO는 "v2로 미룰 경우 v1 에디터·인증 구조를 되짚어 리팩토링해야 하는 항목"이다. 뒤로 미루는 것이 오히려 비용이 크기 때문에 v1에 포함한다. 그 외 v2 항목(경쟁 모드, 브레인스토밍 등)은 v1 데이터 수집 이후 재우선순위화한다.

### 1.2 비목표 (v1 제외)
- 경쟁 모드·리더보드
- 브레인스토밍 + 업보트
- MS Teams 연동
- 비동기 과제 / 고급 질문 유형(짝맞추기·분류·슬라이더 등)
- Confluence import
- 미디어 외부 URL 참조 (v1은 ZIP 번들 업로드만)

### 1.3 품질 기준
- 동시 세션 **100개**, 세션당 **500명** 참가자 안정 처리
- 응답 제출 → 집계 반영 **p95 < 500ms**
- 가용성 **99.9%** (사내 SLA 수준)

---

## 2. 기술 스택

| 레이어 | 선택 | 근거 |
|---|---|---|
| 언어 (통합) | **TypeScript** | 프론트·백 타입 공유, API 계약 일원화 |
| 프론트엔드 | **Next.js 15 (App Router) + React 19** | 사내 표준, SSR 필요 낮음 → CSR 중심 |
| 상태관리 | **Zustand + TanStack Query** | 가벼움, 실시간 이벤트와 궁합 좋음 |
| UI | **Tailwind + shadcn/ui** | 사내 디자인 시스템 오버라이드 용이 |
| 백엔드 | **NestJS (Node.js 22)** | 모듈화, DI, WebSocket·REST 혼재 용이 |
| 실시간 | **Socket.IO + Redis Adapter** | 다중 인스턴스 scale-out, 자동 재연결 |
| DB | **PostgreSQL 16** | 관계형, JSONB로 질문 다형성 표현 |
| 캐시/세션 | **Redis 7** | 세션 상태·응답 카운터·pub/sub |
| 오브젝트 스토리지 | **MinIO (사내)** 또는 사내 S3 호환 | 미디어 에셋 저장 |
| 인증 | **사내 SSO(OIDC)** + JWT | 호스트 인증. 참가자는 세션 토큰. |
| 배포 | **Docker + 사내 Kubernetes** | 수평 확장 |
| 관측 | **OpenTelemetry + Grafana + Loki** | 사내 표준 |
| 모노레포 | **pnpm workspaces + Turborepo** | 패키지 공유 (`@samslide/types` 등) |

### 2.1 모노레포 구조
```
samslide/
├── apps/
│   ├── web-host        # 호스트/에디터 (Next.js)
│   ├── web-participant # 참가자 (Next.js, 경량)
│   └── api             # 백엔드 (NestJS)
├── packages/
│   ├── types           # 공유 타입 / Zod 스키마
│   ├── bulk-parser     # CSV/XLSX/ZIP 파서 (Node·브라우저 공용)
│   └── ui              # 공용 컴포넌트
└── docs/
```

---

## 3. 시스템 아키텍처

```
  ┌─────────────┐          ┌─────────────┐
  │  Host Web   │          │ Participant │
  │ (에디터+    │          │    Web      │
  │  세션 제어) │          │  (모바일)   │
  └──────┬──────┘          └──────┬──────┘
         │  REST + WS              │  WS (가벼움)
         ▼                         ▼
  ┌────────────────────────────────────────┐
  │         API Gateway / Ingress          │
  └────────────────────┬───────────────────┘
                       │
    ┌──────────────────┼───────────────────┐
    ▼                  ▼                   ▼
┌─────────┐      ┌───────────┐      ┌──────────────┐
│  REST   │      │  WS Node  │      │ Bulk Import  │
│ (CRUD)  │      │ (세션)    │      │   Worker     │
└────┬────┘      └─────┬─────┘      └──────┬───────┘
     │                 │                   │
     │            ┌────┴────┐              │
     │            │  Redis  │◀─────────────┤
     │            │ pub/sub │              │
     │            └────┬────┘              │
     ▼                 ▼                   ▼
┌─────────────────────────────┐     ┌──────────┐
│        PostgreSQL           │     │  MinIO   │
│ (decks/questions/responses) │     │ (media)  │
└─────────────────────────────┘     └──────────┘
```

**핵심 결정**
- **WS 노드는 무상태**, 세션 상태는 Redis에만 있다 → 수평 확장 가능.
- Bulk Import는 **별도 워커 프로세스**에서 처리 (큰 ZIP이 웹 요청 스레드를 막지 않도록 BullMQ 큐 사용).
- 참가자 앱은 별도 Next.js 앱으로 분리해 **번들 사이즈 최소화** (에디터 코드 로드 X).

---

## 4. 데이터 모델 (핵심)

```
Deck 1---N Question 0---N MediaAsset
 │
 │                   Session N---1 Deck
 └────────────────── Session 1---N Participant
                     Session 1---N Response
```

### 4.1 테이블 요약

**decks**
- `id, owner_id, title, description, settings_json, created_at, updated_at`

**slides** (다형성 — 질문 슬라이드 + 콘텐츠 슬라이드 통합 테이블)
- `id, deck_id, order, kind, config_json, media_asset_id, tags[]`
- `kind`: `content` / `multiple_choice` / `true_false` / `short_answer` / `word_cloud` / `qna`
- `config_json`에 종류별 상세 저장 (콘텐츠 슬라이드는 `title`·`body_markdown`·`layout`, 질문은 `options`·`answer`·`time_limit`·`points` 등). Zod 스키마로 검증.
- 단일 테이블로 두어 **렌더 순서·재정렬이 단순**하고, 일괄 입력 스키마와 자연스럽게 매핑된다.

**media_assets**
- `id, owner_id, type(image/video), storage_key, mime, size_bytes, duration_sec, checksum, created_at`

**sessions** (실행 인스턴스)
- `id, deck_id, host_id, join_code(unique), status(lobby/running/ended), started_at, ended_at`

**participants**
- `id, session_id, nickname, user_id(nullable: SSO 사용 시), joined_at, left_at`

**responses**
- `id, session_id, question_id, participant_id, answer_json, submitted_at, latency_ms`

### 4.2 Redis 키 구조
- `session:{id}:state` — 현재 질문 인덱스, 상태
- `session:{id}:participants` — Set
- `session:{code}:id` — 코드 → 세션 ID 매핑 (TTL = 세션 종료 시점)
- `q:{session_id}:{question_id}:counters` — 실시간 집계 (HINCRBY)
- `q:{session_id}:{question_id}:wordcloud` — 워드클라우드용 ZSET

---

## 5. API 설계

### 5.1 REST (호스트·에디터)
```
POST   /api/decks                       # 덱 생성
GET    /api/decks/:id                   # 덱 조회
PATCH  /api/decks/:id                   # 덱 수정
POST   /api/decks/:id/questions         # 질문 추가
POST   /api/decks/:id/questions/bulk    # 일괄 JSON 주입
POST   /api/decks/:id/import            # CSV/XLSX/ZIP 업로드 → 워커 큐잉
GET    /api/imports/:job_id             # 임포트 진행상황 / 에러 리포트
POST   /api/media                       # 미디어 업로드 (프리사인드)
POST   /api/sessions                    # 세션 시작 → join_code 반환
GET    /api/sessions/:id/report         # 리포트 CSV
```

### 5.2 WebSocket 이벤트

**호스트 → 서버**
- `host:start` / `host:next` / `host:prev` / `host:reveal` / `host:end`

**서버 → 모두**
- `session:state` — 현재 상태 스냅샷
- `question:show` / `question:close` / `question:reveal`
- `participant:join` / `participant:leave`
- `response:aggregate` — 집계 업데이트 (throttled 100ms)

**참가자 → 서버**
- `participant:join { code, nickname }`
- `response:submit { question_id, answer }`

### 5.3 API 계약 정의
- `packages/types`에서 **Zod 스키마** 정의 → NestJS DTO·프론트 TanStack Query 타입 모두 여기서 파생.
- OpenAPI 스펙은 NestJS `@nestjs/swagger`로 자동 생성.

---

## 6. 프론트엔드 구조

### 6.1 호스트/에디터 앱 (`web-host`)
- `/decks` — 덱 목록
- `/decks/:id/edit` — 에디터 (슬라이드 썸네일 + 편집 패널)
- `/decks/:id/import` — 일괄 입력 (드롭존, 미리보기, 에러 인라인 수정)
- `/sessions/:id/present` — 발표자 뷰 (프로젝터용)
- `/sessions/:id/control` — 발표자 제어 패널 (다음/공개/종료)
- `/sessions/:id/report` — 세션 결과

### 6.2 참가자 앱 (`web-participant`)
- `/` — 코드 입력 화면
- `/join/:code` — 닉네임 입력 → 로비
- `/play` — 현재 질문에 응답하는 단일 화면 (WS 이벤트로 상태 변경)

### 6.3 디자인 시스템
- 사내 브랜드 디자인 토큰(색/폰트)을 Tailwind 테마로 주입
- 다크/라이트 모드 지원
- 참가자 화면은 **모바일 퍼스트**, 버튼 최소 44px 터치 타깃

---

## 7. 일괄 입력 구현 (CSV / XLSX / ZIP)

### 7.1 파이프라인
```
[업로드] → [검증 큐] → [파싱] → [스키마 검증] → [미디어 추출]
   → [미리보기 저장] → [사용자 승인] → [DB 커밋]
```

### 7.2 주요 라이브러리
- CSV: `papaparse` (브라우저/노드 공용, 인코딩 자동 감지)
- XLSX: `exceljs` (스트리밍 읽기, XLSX 쓰기 양방향 지원)
- ZIP: `yauzl` (스트리밍, 경로 탈출 방어 내장)
- 스키마: `zod` (공통 타입 + 에러 메시지 커스터마이징)

### 7.3 인코딩 처리
- 파일 헤더(BOM) 검사 → UTF-8/UTF-16 감지
- 실패 시 `chardet`로 휴리스틱 감지 (CP949 포함)
- 디코딩 실패 바이트는 `U+FFFD`로 치환하고 **경고 로그**

### 7.4 보안
- ZIP **zip slip**(`../` 경로 탈출) 차단: 추출 경로 정규화 후 루트 prefix 검증
- 파일 매직 넘버 vs 확장자 교차 검증
- 업로드 총량 500MB 초과 시 **스트림 중단**
- 미디어 URL은 사내 도메인 화이트리스트만 통과
- 처리는 **별도 워커 컨테이너**에서 — 악성 입력이 API 프로세스에 직접 영향 못 줌

### 7.5 에러 리포팅
- 각 행/파일별 에러를 `{ row, column, code, message, suggestion }` 구조로 수집
- 미리보기 UI에서 에러 행만 필터링·인라인 수정 가능
- 정상 행은 **부분 커밋 허용**

---

## 8. 실시간 세션 엔진

### 8.1 세션 수명주기
```
CREATED → LOBBY → RUNNING (per-question) → ENDED
```

### 8.2 질문 한 사이클
1. 호스트 `host:next` → 서버: 질문 스냅샷 저장, Redis 상태 업데이트
2. 서버 → 모두 `question:show { question, deadline_ts }`
3. 참가자 `response:submit` → 서버: 중복 체크(Redis SETNX) → 카운터 증가
4. 서버가 100ms throttle로 `response:aggregate` 브로드캐스트
5. 타이머 만료 또는 호스트 `host:reveal` → `question:close { correct_answer, stats }`

### 8.3 성능 설계
- 집계는 **Redis 원자 연산** (`HINCRBY`)로 경합 없이 처리
- 브로드캐스트는 **Socket.IO room**(`session:{id}`)으로 제한
- 집계 이벤트는 **throttle + diff 전송** (전체 카운트 대신 변화분)
- 응답 저장은 배치로 PostgreSQL에 플러시 (큐 → 1초 간격 또는 100건)

### 8.4 장애 내성
- WS 노드 재시작 시 클라이언트 **자동 재연결** (Socket.IO 기본)
- 세션 상태는 Redis에 있으므로 어느 노드로 재붙어도 복원 가능
- 호스트가 끊기면 30초 grace → 자동 일시정지 (세션 파기 X)

---

## 9. 마일스톤 & 일정

총 **18주** (약 4.5개월). 2주 단위 스프린트 9회.

| 마일스톤 | 기간 | 산출물 |
|---|---|---|
| **M0: 셋업** | 주 1–2 | 모노레포, CI/CD, **SSO(OIDC) 실연동**, 기본 스켈레톤, 디자인 토큰 |
| **M1: 에디터 MVP** | 주 3–7 | 덱 CRUD, 질문 유형 5종 + **일반 콘텐츠 슬라이드**(텍스트/이미지), 에디터 내 미리보기 |
| **M2: 실시간 세션** | 주 8–10 | WS 엔진, 코드 입장, 호스트/참가자 앱, 집계 차트 |
| **M3: 일괄 입력** | 주 11–13 | CSV/XLSX/ZIP 파서, 미디어 업로드, 미리보기 UI, 에러 인라인 수정 |
| **M4: 리포트** | 주 14–15 | 세션 종료 리포트, CSV 내보내기, 관측/로깅 |
| **M5: QA & 베타** | 주 16–18 | 부하 테스트(세션 100×500명), 사내 베타, 버그 수정 → GA |

### 9.1 스프린트별 핵심 이정표
- **Sprint 1 (M0)**: 첫 배포 + **사내 SSO로 실제 로그인** 성공
- **Sprint 3~4 (M1 종료)**: 에디터로 만든 덱(질문+콘텐츠 슬라이드 혼합)을 **수동 모드**로 발표 가능
- **Sprint 5 (M2 종료)**: 처음부터 끝까지 **실제 세션** 실행 가능 (내부 드레스 리허설)
- **Sprint 7 (M3 종료)**: XLSX 한 파일로 **50문항 덱 자동 생성** 시연
- **Sprint 9 (GA)**: 사내 GA + 타운홀에서 첫 실사용

---

## 10. 팀 구성

| 역할 | 인원 | 주 책임 |
|---|---|---|
| Tech Lead | 1 | 아키텍처, API 계약, 코드 리뷰 |
| Frontend | 2 | 에디터 / 호스트 / 참가자 앱 |
| Backend | 2 | API, WS 엔진, 일괄 입력 워커 |
| Designer | 0.5 | 디자인 시스템, 모바일 UX |
| QA | 1 | 자동화 테스트, 부하 테스트 |
| PM | 0.5 | 백로그, 사내 이해관계자 조율 |

**총 약 7 FTE**. 사내 인프라/SSO 담당과는 별도 협업.

---

## 11. 테스트 전략

| 계층 | 도구 | 커버리지 목표 |
|---|---|---|
| 단위 | Vitest | 핵심 로직(파서·집계) 90%+ |
| 통합 | Vitest + Testcontainers (PostgreSQL/Redis) | 주요 API 경로 100% |
| E2E | Playwright | 골든 패스 5종 (세션 생성→응답→리포트) |
| 부하 | k6 | 100 세션 × 500명 × 60분 시나리오 |
| 보안 | OWASP ZAP + `npm audit` | 매 릴리스 |
| 접근성 | axe-core | 참가자 앱 AA 준수 |

### 11.1 일괄 입력 전용 테스트 자산
- `fixtures/bulk/` 하위에 **정상·에러 샘플** XLSX/CSV/ZIP 수십 개
- CP949 파일, BOM 없는 UTF-8, 셀 병합, zip slip 공격 샘플 포함
- 스냅샷 테스트로 파싱 결과 JSON 고정

---

## 12. 리스크 & 완화

| 리스크 | 영향 | 완화 방안 |
|---|---|---|
| 사내 프록시가 WebSocket 차단 | 치명 | Long-polling fallback(Socket.IO 기본) + 사내 네트워크팀 사전 협의 |
| 동시 접속 성능 미달 | 높음 | M2 끝에 **부하 테스트 게이트**, Redis 샤딩 대비 설계 |
| CP949/UTF-8 인코딩 이슈 | 중 | chardet + 사용자 인코딩 선택 옵션 |
| 동영상 대용량 업로드 부담 | 중 | 프리사인드 URL로 객체 스토리지 직접 업로드, API 미경유 |
| 참가자 화면 저사양 브라우저 | 중 | 사내 지원 브라우저 목록 확정(IE 제외) + 폴리필 최소화 |
| SSO 연동 지연 | 중 | M0에서 가짜 SSO로 개발 진행, 실 SSO는 M4 이전 연결 |
| 디자이너 리소스 부족 | 낮 | shadcn/ui로 기본 UI 선행, 디자인 패스는 M2–M3에 집중 |

---

## 13. 릴리스 이후 (v2 준비)

v1 GA 직후 수집할 지표:
- 세션당 평균 참가자 수 / 응답 완주율
- 일괄 입력 사용 비율 (vs 에디터 수동 입력)
- 가장 많이 쓰인 질문 유형 Top 3
- 사내 CSAT 설문

이 지표를 보고 **v2 우선순위** (경쟁 모드 / 비동기 / MS Teams 연동) 중 어떤 것을 먼저 할지 판단한다.

---

## 14. 즉시 착수할 작업 (Week 1)

1. **GitHub(사내 GitLab) 리포지토리 생성**, 모노레포 스캐폴딩
2. **기술 스택 ADR 문서** 5~6건 작성 (`docs/adr/`)
3. **사내 SSO 담당자와 미팅** — OIDC 클라이언트 등록 절차 확인
4. **사내 k8s 네임스페이스 신청** 및 기본 CI/CD 파이프라인 구성
5. **PoC: 100 클라이언트 Socket.IO 연결** — 사내 네트워크에서 WS 실제 통과 여부 검증
6. **디자인 킥오프** — 호스트/참가자 화면 와이어프레임 초안

이 6개가 모두 끝나면 M1 본격 개발이 안전하게 시작된다.
