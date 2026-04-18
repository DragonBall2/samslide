// TODO(M3): CSV / XLSX / ZIP 번들 파서 구현
// - papaparse 기반 CSV 파서 (인코딩 자동 감지)
// - exceljs 기반 XLSX 파서 (Questions/Settings/README 시트)
// - yauzl 기반 ZIP 번들 추출 (zip slip 방어)
// - 통합 스키마 → @samslide/types Slide[] 변환
// - 행별 에러 리포트 구조 { row, column, code, message, suggestion }

export const BULK_PARSER_PLACEHOLDER = true;
