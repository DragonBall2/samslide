import { z } from 'zod';
import { PointsSchema, SlideBaseSchema, TimeLimitSchema } from './common.js';

export const MultipleChoiceOptionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1).max(500),
});
export type MultipleChoiceOption = z.infer<typeof MultipleChoiceOptionSchema>;

export const MultipleChoiceSlideSchema = SlideBaseSchema.extend({
  kind: z.literal('multiple_choice'),
  question: z.string().min(1).max(1000),
  options: z.array(MultipleChoiceOptionSchema).min(2).max(6),
  correctOptionIds: z.array(z.string()).min(1),
  allowMultiple: z.boolean().default(false),
  timeLimit: TimeLimitSchema.default(20),
  points: PointsSchema.default(1000),
  anonymous: z.boolean().default(false),
});
export type MultipleChoiceSlide = z.infer<typeof MultipleChoiceSlideSchema>;

export function validateMultipleChoice(
  slide: MultipleChoiceSlide,
  ctx: z.RefinementCtx,
): void {
  const validIds = new Set(slide.options.map((o) => o.id));
  for (const id of slide.correctOptionIds) {
    if (!validIds.has(id)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['correctOptionIds'],
        message: `correctOptionIds references unknown option id "${id}"`,
      });
    }
  }
  if (!slide.allowMultiple && slide.correctOptionIds.length > 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['correctOptionIds'],
      message: 'allowMultiple must be true when correctOptionIds has more than one value',
    });
  }
}
