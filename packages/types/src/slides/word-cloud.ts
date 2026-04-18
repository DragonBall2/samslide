import { z } from 'zod';
import { SlideBaseSchema, TimeLimitSchema } from './common.js';

export const WordCloudSlideSchema = SlideBaseSchema.extend({
  kind: z.literal('word_cloud'),
  prompt: z.string().min(1).max(1000),
  maxSubmissionsPerUser: z.number().int().min(1).max(10).default(3),
  maxWordLength: z.number().int().min(1).max(100).default(30),
  timeLimit: TimeLimitSchema.default(60),
  anonymous: z.boolean().default(true),
});
export type WordCloudSlide = z.infer<typeof WordCloudSlideSchema>;
