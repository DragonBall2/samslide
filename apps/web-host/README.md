# @samslide/web-host

호스트와 에디터용 Next.js 앱. 덱 작성, 일괄 입력 미리보기, 발표자 뷰, 세션 제어 포함.

## 라우트 (계획서 §6.1 참조)

- `/decks` — 덱 목록
- `/decks/:id/edit` — 에디터
- `/decks/:id/import` — 일괄 입력
- `/sessions/:id/present` — 발표자 뷰
- `/sessions/:id/control` — 제어 패널
- `/sessions/:id/report` — 결과 리포트

## 스캐폴드 (다음 단계)

```bash
pnpm dlx create-next-app@latest . --typescript --tailwind --app --src-dir --eslint --use-pnpm
```
