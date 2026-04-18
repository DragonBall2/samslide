# @samslide/web-host

호스트와 에디터용 Next.js 앱. 프레젠테이션 작성, 일괄 입력 미리보기, 발표자 뷰, 세션 제어 포함.

## 라우트 (계획서 §6.1 참조)

- `/presentations` — 프레젠테이션 목록
- `/presentations/:id` — 에디터 (슬라이드 추가/편집/삭제/순서변경)
- `/presentations/:id/import` — 일괄 입력 (M3)
- `/sessions/:id/present` — 발표자 뷰 (M2)
- `/sessions/:id/control` — 제어 패널 (M2)
- `/sessions/:id/report` — 결과 리포트 (M4)
