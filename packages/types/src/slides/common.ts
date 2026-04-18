import { z } from 'zod';

export const MediaPositionSchema = z.enum(['top', 'bottom', 'background']);
export type MediaPosition = z.infer<typeof MediaPositionSchema>;

export const MediaTypeSchema = z.enum(['none', 'image', 'video']);
export type MediaType = z.infer<typeof MediaTypeSchema>;

export const MediaRefSchema = z
  .object({
    type: MediaTypeSchema.default('none'),
    src: z.string().max(2048).nullable().default(null),
    position: MediaPositionSchema.default('top'),
    autoplay: z.boolean().default(false),
    startSec: z.number().int().nonnegative().default(0),
    endSec: z.number().int().nonnegative().nullable().default(null),
    alt: z.string().max(500).nullable().default(null),
  })
  .refine((m) => m.type === 'none' || m.src !== null, {
    message: 'media.src is required when media.type is not "none"',
    path: ['src'],
  })
  .refine((m) => m.endSec === null || m.endSec > m.startSec, {
    message: 'media.endSec must be greater than media.startSec',
    path: ['endSec'],
  });
export type MediaRef = z.infer<typeof MediaRefSchema>;

export const SlideBaseSchema = z.object({
  id: z.string().uuid(),
  order: z.number().int().nonnegative(),
  media: MediaRefSchema.optional(),
  tags: z.array(z.string().max(50)).max(20).default([]),
});

export const TimeLimitSchema = z.number().int().min(5).max(300);
export const PointsSchema = z.number().int().min(0).max(2000);
