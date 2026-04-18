# samslide 핸드오프 노트

> 이 프로젝트는 **집 PC(Claude Code)** 와 **회사 PC(사내 코딩 에이전트)** 를 git 으로 오가며 개발한다.
> 두 환경 모두에서 "다음에 무엇을 하면 되는지"가 명확하도록 이 문서와 커밋 메시지가 가장 중요한 핸드오프 매체다.
> **규칙**: 작업 덩어리가 끝나면 이 문서의 §2·§3 을 반드시 갱신한 뒤 커밋한다.

## 1. 환경 셋업 (새 체크아웃 기준)

```bash
# Node 22 이상
corepack enable
corepack prepare pnpm@9.15.0 --activate
pnpm install

# 환경 변수
cp .env.example apps/api/.env                # 필요 시
cp .env.example apps/web-host/.env.local      # 필요 시
cp .env.example apps/web-participant/.env.local

# 건강 체크 (이게 깨지면 진행하지 말 것)
pnpm turbo run typecheck test

# 로컬 실행 (세 터미널 또는 백그라운드)
pnpm --filter @samslide/api build && pnpm --filter @samslide/api start    # :3001
pnpm --filter @samslide/web-host dev                                       # :3000
pnpm --filter @samslide/web-participant dev                                # :3002
```

확인용 URL:
- http://localhost:3001/health — `supportedSlideKinds` 6개 반환
- http://localhost:3000/decks — 덱 관리 UI
- http://localhost:3002 — 참가자 코드 입력 스텁

## 2. 현재까지 완료된 것

아래는 마지막으로 핸드오프된 시점의 코드 상태를 요약한다. 세부 변경 내역은 `git log` 참조.

### M0 (스캐폴드)
- pnpm workspaces + Turbo 모노레포
- `@samslide/types` — Zod 슬라이드 스키마 6종(`content`, `multiple_choice`, `true_false`, `short_answer`, `word_cloud`, `qna`) + `Deck` + `@samslide/types/api` 서브경로
- `@samslide/api` — NestJS 11 (ESM/NodeNext), `/health` 엔드포인트
- `@samslide/web-host` / `@samslide/web-participant` — Next.js 15 + Tailwind
- `@samslide/bulk-parser`, `@samslide/ui` — 스텁

### M1 진행 중
- **Deck CRUD** — 인메모리 저장소(`DecksRepository`). 엔드포인트: `GET/POST /decks`, `GET/PATCH/DELETE /decks/:id`.
- **Slide CRUD + Reorder** — `POST /decks/:id/slides`, `PATCH/DELETE /decks/:id/slides/:slideId`, `POST /decks/:id/slides/reorder`. 6종 kind 모두 지원.
- Zod 기반 `ZodValidationPipe` 범용 검증. `applyCrossFieldValidation`으로 `SlideSchema` ↔ `CreateSlideRequestSchema` 가 동일한 교차검증 공유.
- web-host `/decks` (리스트·생성·삭제), `/decks/[id]` (슬라이드 에디터: 6종 폼 + 추가/편집/삭제/순서변경).
- CORS 열려 있음 (3000, 3002).

## 3. 다음에 할 일 (우선순위 순)

### 3.1 다음 세션 즉시 착수
**PostgreSQL + Prisma 도입** (M1 후반).
- [ ] 로컬 Postgres 기동 방법 결정 (Docker Compose 권장) 후 `docker-compose.yml` 추가
- [ ] `apps/api` 에 `@prisma/client`, `prisma` devDep 추가
- [ ] `prisma/schema.prisma` 작성 — `decks`, `slides` 테이블 (slide는 `kind`, `order`, `config_json` JSONB 컬럼), `media_assets` 는 나중에
- [ ] `DecksRepository` 를 인터페이스로 추출(`InMemoryDecksRepository`, `PrismaDecksRepository` 두 구현)
- [ ] `DecksModule` 이 환경 변수로 구현 선택 (`DATABASE_URL` 존재 시 Prisma, 없으면 인메모리)
- [ ] 마이그레이션 스크립트 + `pnpm --filter @samslide/api db:migrate` 명령

설계 의사결정:
- 슬라이드는 **별도 테이블** 예정 (부분 업데이트, 순서 변경, 버전관리 유리) — `docs/implementation-plan.md` §4.1
- `config_json` JSONB 로 kind별 상세 저장 → 기존 Zod 스키마 그대로 재사용

### 3.2 그 다음 (M1 마무리)
- [ ] 에디터 내 슬라이드 미리보기(렌더 결과) — 현재는 요약 텍스트만 표시
- [ ] 덱 제목·설명 인라인 편집 (현재는 생성 시에만 설정 가능)
- [ ] 슬라이드 폼 클라이언트측 유효성 검증 강화 (정답 없는 객관식 막기 등 — 현재는 서버 400에 의존)

### 3.3 M2 예고 (실시간 세션)
- `DecksRepository` 인터페이스를 추출하고 `InMemoryDecksRepository` / `PrismaDecksRepository` 두 구현 제공.
- Prisma 스키마는 `docs/implementation-plan.md` §4.1 참조 (`slides` 별도 테이블, `config_json` JSONB).
- Docker Compose 또는 사내 DB 로 로컬 PostgreSQL 기동 준비.

실시간 세션 엔진 (Socket.IO + Redis). DB 완성 후 착수.

## 4. 설계 의사결정 기록

| 결정 | 이유 | 기록 위치 |
|---|---|---|
| 슬라이드 저장은 **별도 테이블** 예정 | 부분 업데이트·순서 변경·버전관리 유리 | `docs/implementation-plan.md` §4.1 |
| 에디터 API 는 **슬라이드 단위 엔드포인트** | 덱 전체 교체식으로 만들면 DB 전환 시 UX 재작업 필요 | 이 문서 §3.1 |
| 자동저장·undo 는 **DB 이후로 미룸** | 인메모리 + 실시간 동기화는 복잡도만 높음 | 이 문서 §3.1 |
| 슬라이드 스키마는 **discriminated union + kind 컬럼** | API / UI / 일괄입력이 같은 계약 공유 | `packages/types/src/slides/` |
| 일괄 입력 아직 미구현 | M3 예정, `@samslide/bulk-parser` 스텁 존재 | `packages/bulk-parser/README.md` |

## 5. 주의할 함정

- Windows 개발 환경에서 `git add` 시 CRLF 경고가 뜨지만 `.gitattributes`로 LF 통일되어 있어 커밋 결과는 안전.
- API 는 **인메모리 저장소**이므로 재시작 시 모든 데이터 소실. DB 도입 전까지는 의도된 동작.
- `@samslide/types` 를 수정했으면 반드시 `pnpm --filter @samslide/types build` 를 먼저 돌려야 다른 앱에서 반영됨 (NestJS 는 컴파일된 `dist/` 를 require).
- 포트 3000/3001/3002 가 이전 세션 좀비 프로세스로 잡혀있을 수 있음. `netstat -ano | grep :3001` → `taskkill /F /PID <pid>` (Windows) / `lsof -i :3001` → `kill -9 <pid>` (Unix).
