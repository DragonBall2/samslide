import { z } from 'zod';
import { applyCrossFieldValidation } from '../slides/index.js';
import { ContentSlideSchema } from '../slides/content.js';
import { MultipleChoiceSlideSchema } from '../slides/multiple-choice.js';
import { QnaSlideSchema } from '../slides/qna.js';
import { ShortAnswerSlideSchema } from '../slides/short-answer.js';
import { TrueFalseSlideSchema } from '../slides/true-false.js';
import { WordCloudSlideSchema } from '../slides/word-cloud.js';

/**
 * Create/Update 요청 body — id, order 는 서버가 채운다.
 * 각 kind 별로 원본 슬라이드 스키마에서 id 제거 + order optional 처리.
 * (generic helper 를 쓰면 `kind` 리터럴 타입이 discriminated union 요건을
 *  만족하지 못해 컴파일 실패하므로 각 kind 를 명시한다.)
 */
const OptionalOrder = { order: z.number().int().nonnegative().optional() };

const CreateSlideUnion = z.discriminatedUnion('kind', [
  ContentSlideSchema.omit({ id: true, order: true }).extend(OptionalOrder),
  MultipleChoiceSlideSchema.omit({ id: true, order: true }).extend(OptionalOrder),
  TrueFalseSlideSchema.omit({ id: true, order: true }).extend(OptionalOrder),
  ShortAnswerSlideSchema.omit({ id: true, order: true }).extend(OptionalOrder),
  WordCloudSlideSchema.omit({ id: true, order: true }).extend(OptionalOrder),
  QnaSlideSchema.omit({ id: true, order: true }).extend(OptionalOrder),
]);

export const CreateSlideRequestSchema = CreateSlideUnion.superRefine((slide, ctx) => {
  applyCrossFieldValidation(slide, ctx);
});
export type CreateSlideRequest = z.infer<typeof CreateSlideRequestSchema>;

/**
 * Update 는 교체형(PATCH but replace). kind 변경 허용.
 * 전체 슬라이드 본문을 새로 보내면 서버가 기존 id 를 보존한 채 교체한다.
 */
export const UpdateSlideRequestSchema = CreateSlideRequestSchema;
export type UpdateSlideRequest = z.infer<typeof UpdateSlideRequestSchema>;

export const ReorderSlidesRequestSchema = z.object({
  slideIds: z.array(z.string().uuid()).min(1),
});
export type ReorderSlidesRequest = z.infer<typeof ReorderSlidesRequestSchema>;
