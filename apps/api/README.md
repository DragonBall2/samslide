# @samslide/api

NestJS 기반 백엔드. REST API + Socket.IO WebSocket 게이트웨이.

## 현재 상태 (M0 스캐폴드)

- Nest 11 + TypeScript ESM(NodeNext)
- `GET /health` 엔드포인트
- `@samslide/types` 연동 검증됨

## 실행

```bash
pnpm --filter @samslide/api build
pnpm --filter @samslide/api start
# → http://localhost:3001/health
```

## 구현 로드맵 (계획서 §5 참조)

- **M0**: ✅ Nest 스캐폴드, 헬스체크 / ⏳ 사내 SSO(OIDC), PostgreSQL·Redis 연결
- **M1**: decks/slides CRUD, PostgreSQL + Prisma
- **M2**: Socket.IO 게이트웨이, Redis pub/sub, 세션 엔진
- **M3**: 일괄 입력 REST + BullMQ 워커
- **M4**: 리포트 집계, CSV 내보내기
