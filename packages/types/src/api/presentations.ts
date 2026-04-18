import { z } from 'zod';
import { PresentationSettingsSchema } from '../presentation.js';

export const CreatePresentationRequestSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).default(''),
  settings: PresentationSettingsSchema.partial().optional(),
});
export type CreatePresentationRequest = z.infer<typeof CreatePresentationRequestSchema>;

export const UpdatePresentationRequestSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  settings: PresentationSettingsSchema.partial().optional(),
});
export type UpdatePresentationRequest = z.infer<typeof UpdatePresentationRequestSchema>;

export const PresentationListItemSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  slideCount: z.number().int().nonnegative(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type PresentationListItem = z.infer<typeof PresentationListItemSchema>;

export const PresentationListResponseSchema = z.object({
  items: z.array(PresentationListItemSchema),
  total: z.number().int().nonnegative(),
});
export type PresentationListResponse = z.infer<typeof PresentationListResponseSchema>;

export const ApiErrorSchema = z.object({
  statusCode: z.number().int(),
  message: z.union([z.string(), z.array(z.string())]),
  error: z.string().optional(),
});
export type ApiError = z.infer<typeof ApiErrorSchema>;
