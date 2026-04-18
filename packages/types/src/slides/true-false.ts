import { z } from 'zod';
import { PointsSchema, SlideBaseSchema, TimeLimitSchema } from './common.js';

export const TrueFalseSlideSchema = SlideBaseSchema.extend({
  kind: z.literal('true_false'),
  question: z.string().min(1).max(1000),
  answer: z.boolean(),
  timeLimit: TimeLimitSchema.default(10),
  points: PointsSchema.default(500),
  anonymous: z.boolean().default(false),
});
export type TrueFalseSlide = z.infer<typeof TrueFalseSlideSchema>;
