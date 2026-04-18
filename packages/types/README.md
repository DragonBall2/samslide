# @samslide/types

공유 Zod 스키마 및 TypeScript 타입. 프론트(에디터/참가자)와 백엔드(API) 모두 이 패키지로부터 타입을 파생한다.

## 주요 익스포트

- `SlideSchema` — 슬라이드(콘텐츠/질문) 다형성 스키마
- `DeckSchema` — 덱 메타데이터 + 슬라이드 배열
- `SlideKind` — 슬라이드 종류 enum

## 설계 원칙

1. **단일 진실(Source of Truth)**: 이 패키지의 Zod 스키마를 서버 DTO·클라이언트 폼·일괄 입력 파서가 모두 공유한다.
2. **다형성**: 슬라이드는 `kind` discriminator로 구분되는 discriminated union. 서버는 `config_json`(JSONB)에 파싱된 객체를 그대로 저장한다.
3. **엄격 검증**: 모든 경계(API 요청/응답, 파일 업로드)에서 Zod `parse()`로 통과시키는 것을 원칙으로 한다.
