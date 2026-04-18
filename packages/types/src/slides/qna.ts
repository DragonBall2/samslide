import { z } from 'zod';
import { SlideBaseSchema } from './common.js';

export const QnaSlideSchema = SlideBaseSchema.extend({
  kind: z.literal('qna'),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).default(''),
  allowUpvote: z.boolean().default(true),
  moderation: z.boolean().default(false),
  anonymous: z.boolean().default(true),
});
export type QnaSlide = z.infer<typeof QnaSlideSchema>;
