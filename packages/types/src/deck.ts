import { z } from 'zod';
import { SlideSchema } from './slides/index.js';

export const DeckSettingsSchema = z.object({
  competitionMode: z.boolean().default(false),
  defaultTimeLimit: z.number().int().min(5).max(300).default(20),
  showLeaderboard: z.boolean().default(false),
  allowAnonymousParticipants: z.boolean().default(true),
});
export type DeckSettings = z.infer<typeof DeckSettingsSchema>;

export const DeckSchema = z
  .object({
    id: z.string().uuid(),
    ownerId: z.string().uuid(),
    title: z.string().min(1).max(200),
    description: z.string().max(2000).default(''),
    slides: z.array(SlideSchema).default([]),
    settings: DeckSettingsSchema.default({
      competitionMode: false,
      defaultTimeLimit: 20,
      showLeaderboard: false,
      allowAnonymousParticipants: true,
    }),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .superRefine((deck, ctx) => {
    const seenOrders = new Set<number>();
    for (const slide of deck.slides) {
      if (seenOrders.has(slide.order)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['slides'],
          message: `duplicate slide order: ${slide.order}`,
        });
      }
      seenOrders.add(slide.order);
    }
  });
export type Deck = z.infer<typeof DeckSchema>;
