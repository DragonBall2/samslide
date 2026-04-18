import { z } from 'zod';
import { ContentSlideSchema } from './content.js';
import { MultipleChoiceSlideSchema, validateMultipleChoice } from './multiple-choice.js';
import { QnaSlideSchema } from './qna.js';
import { ShortAnswerSlideSchema } from './short-answer.js';
import { TrueFalseSlideSchema } from './true-false.js';
import { WordCloudSlideSchema } from './word-cloud.js';

export * from './common.js';
export * from './content.js';
export * from './multiple-choice.js';
export * from './qna.js';
export * from './short-answer.js';
export * from './true-false.js';
export * from './word-cloud.js';

const SlideUnion = z.discriminatedUnion('kind', [
  ContentSlideSchema,
  MultipleChoiceSlideSchema,
  TrueFalseSlideSchema,
  ShortAnswerSlideSchema,
  WordCloudSlideSchema,
  QnaSlideSchema,
]);

/**
 * kind 별 교차 필드 검증. SlideSchema 와 CreateSlideRequestSchema 양쪽에서 공유한다.
 * discriminated union 은 top-level refinement 를 허용하지 않기 때문에 이렇게 분리한다.
 */
export function applyCrossFieldValidation(
  slide: { kind: string; [k: string]: unknown },
  ctx: z.RefinementCtx,
): void {
  if (slide.kind === 'multiple_choice') {
    validateMultipleChoice(slide as Parameters<typeof validateMultipleChoice>[0], ctx);
  }
}

export const SlideSchema = SlideUnion.superRefine((slide, ctx) => {
  applyCrossFieldValidation(slide, ctx);
});
export type Slide = z.infer<typeof SlideSchema>;

export const SlideKindSchema = z.enum([
  'content',
  'multiple_choice',
  'true_false',
  'short_answer',
  'word_cloud',
  'qna',
]);
export type SlideKind = z.infer<typeof SlideKindSchema>;

export const INTERACTIVE_SLIDE_KINDS: readonly SlideKind[] = [
  'multiple_choice',
  'true_false',
  'short_answer',
  'word_cloud',
  'qna',
];

export function isInteractiveSlide(
  slide: Slide,
): slide is Exclude<Slide, { kind: 'content' }> {
  return slide.kind !== 'content';
}
