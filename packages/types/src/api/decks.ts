import { z } from 'zod';
import { DeckSettingsSchema } from '../deck.js';

export const CreateDeckRequestSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).default(''),
  settings: DeckSettingsSchema.partial().optional(),
});
export type CreateDeckRequest = z.infer<typeof CreateDeckRequestSchema>;

export const UpdateDeckRequestSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  settings: DeckSettingsSchema.partial().optional(),
});
export type UpdateDeckRequest = z.infer<typeof UpdateDeckRequestSchema>;

export const DeckListItemSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  slideCount: z.number().int().nonnegative(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type DeckListItem = z.infer<typeof DeckListItemSchema>;

export const DeckListResponseSchema = z.object({
  items: z.array(DeckListItemSchema),
  total: z.number().int().nonnegative(),
});
export type DeckListResponse = z.infer<typeof DeckListResponseSchema>;

export const ApiErrorSchema = z.object({
  statusCode: z.number().int(),
  message: z.union([z.string(), z.array(z.string())]),
  error: z.string().optional(),
});
export type ApiError = z.infer<typeof ApiErrorSchema>;
