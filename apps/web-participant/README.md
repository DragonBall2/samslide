# @samslide/web-participant

참가자용 Next.js 앱. 로그인 없이 6자리 코드로 입장, WebSocket으로 실시간 응답.

## 라우트

- `/` — 코드 입력
- `/join/:code` — 닉네임 입력 → 로비
- `/play` — 현재 질문 응답

## 설계 제약

- 모바일 퍼스트 (터치 타깃 44px+)
- 번들 최소화 (에디터 코드 로드 금지)
- 오프라인/재접속에 강함 (Socket.IO 자동 재연결)
