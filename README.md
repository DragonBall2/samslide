# samslide

사내 인터랙티브 프레젠테이션/퀴즈 툴.

AhaSlides와 Kahoot을 벤치마킹해 사내 맥락(SSO·데이터 주권·무제한 참가자)에 맞춘 내부 도구.

## 문서

- 벤치마크 리포트: [`docs/benchmark-ahaslides-kahoot.md`](docs/benchmark-ahaslides-kahoot.md)
- 구현 계획: [`docs/implementation-plan.md`](docs/implementation-plan.md)

## 저장소 구조

```
samslide/
├── apps/
│   ├── api              # NestJS 백엔드 (REST + WebSocket)
│   ├── web-host         # 호스트/에디터 앱 (Next.js)
│   └── web-participant  # 참가자 앱 (Next.js, 경량)
├── packages/
│   ├── types            # 공유 Zod 스키마 + TS 타입
│   ├── bulk-parser      # CSV/XLSX/ZIP 파서 (Node·브라우저 공용)
│   └── ui               # 공용 UI 컴포넌트
└── docs/                # 기획·설계 문서
```

## 개발 환경

- Node.js **22+** (`.nvmrc` 참조)
- pnpm **9.15+** (`corepack enable` 후 자동 설치)

## 빠른 시작

```bash
corepack enable
pnpm install
pnpm turbo run build typecheck test   # 전체 검증
pnpm --filter @samslide/api start     # http://localhost:3001/health
pnpm --filter @samslide/web-host dev  # http://localhost:3000
pnpm --filter @samslide/web-participant dev  # http://localhost:3002
```

## 포트 컨벤션

| 앱 | 포트 |
|---|---|
| `@samslide/api` | 3001 |
| `@samslide/web-host` | 3000 |
| `@samslide/web-participant` | 3002 |

## 현재 진행 상황

| 마일스톤 | 상태 | 비고 |
|---|---|---|
| M0 — 셋업 | 🟡 부분 완료 | 코드 스캐폴드 완료. SSO 실연동·k8s·CI/CD는 사내 협업 트랙 |
| M1 — 에디터 MVP | 대기 | |
| M2 — 실시간 세션 | 대기 | |
| M3 — 일괄 입력 | 대기 | |
| M4 — 리포트 | 대기 | |
| M5 — QA & 베타 | 대기 | |

### M0 달성 현황 (코드)

- ✅ 모노레포 + pnpm workspaces + Turbo
- ✅ `@samslide/types` — Zod 스키마 6종 + 교차 검증 + 단위 테스트 8건
- ✅ `@samslide/api` — NestJS 11, `/health` 엔드포인트
- ✅ `@samslide/web-host` — Next.js 15 + Tailwind, 랜딩
- ✅ `@samslide/web-participant` — Next.js 15 + Tailwind, 코드 입장 화면 스텁
- ✅ `@samslide/bulk-parser`, `@samslide/ui` — 패키지 스텁
- ✅ `pnpm turbo run build typecheck test` → 15/15 태스크 통과
