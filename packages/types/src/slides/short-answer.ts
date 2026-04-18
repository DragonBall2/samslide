import { z } from 'zod';
import { PointsSchema, SlideBaseSchema, TimeLimitSchema } from './common.js';

export const ShortAnswerSlideSchema = SlideBaseSchema.extend({
  kind: z.literal('short_answer'),
  question: z.string().min(1).max(1000),
  acceptedAnswers: z.array(z.string().min(1).max(200)).min(1).max(20),
  caseSensitive: z.boolean().default(false),
  trimWhitespace: z.boolean().default(true),
  timeLimit: TimeLimitSchema.default(15),
  points: PointsSchema.default(800),
  anonymous: z.boolean().default(false),
});
export type ShortAnswerSlide = z.infer<typeof ShortAnswerSlideSchema>;

export function normalizeAnswer(
  value: string,
  options: { caseSensitive: boolean; trimWhitespace: boolean },
): string {
  let v = value;
  if (options.trimWhitespace) v = v.trim().replace(/\s+/g, ' ');
  if (!options.caseSensitive) v = v.toLowerCase();
  return v;
}

export function matchesShortAnswer(
  submission: string,
  slide: Pick<ShortAnswerSlide, 'acceptedAnswers' | 'caseSensitive' | 'trimWhitespace'>,
): boolean {
  const opts = { caseSensitive: slide.caseSensitive, trimWhitespace: slide.trimWhitespace };
  const normalizedSubmission = normalizeAnswer(submission, opts);
  return slide.acceptedAnswers.some(
    (accepted) => normalizeAnswer(accepted, opts) === normalizedSubmission,
  );
}
