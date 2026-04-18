import { z } from 'zod';
import { SlideBaseSchema } from './common.js';

export const ContentLayoutSchema = z.enum([
  'title',
  'title-body',
  'two-column',
  'image-focus',
  'quote',
]);
export type ContentLayout = z.infer<typeof ContentLayoutSchema>;

export const ContentSlideSchema = SlideBaseSchema.extend({
  kind: z.literal('content'),
  title: z.string().max(200).default(''),
  bodyMarkdown: z.string().max(10_000).default(''),
  layout: ContentLayoutSchema.default('title-body'),
});
export type ContentSlide = z.infer<typeof ContentSlideSchema>;
