import { describe, expect, it } from 'vitest';
import {
  MultipleChoiceSlideSchema,
  ShortAnswerSlideSchema,
  SlideSchema,
  matchesShortAnswer,
} from '../src/index.js';

describe('MultipleChoiceSlide', () => {
  const base = {
    id: '00000000-0000-4000-8000-000000000001',
    kind: 'multiple_choice' as const,
    order: 0,
    question: '가장 큰 행성은?',
    options: [
      { id: 'a', text: '지구' },
      { id: 'b', text: '목성' },
      { id: 'c', text: '화성' },
    ],
    correctOptionIds: ['b'],
  };

  it('parses with defaults', () => {
    const slide = MultipleChoiceSlideSchema.parse(base);
    expect(slide.timeLimit).toBe(20);
    expect(slide.points).toBe(1000);
    expect(slide.allowMultiple).toBe(false);
  });

  it('rejects unknown correctOptionIds (via SlideSchema)', () => {
    const result = SlideSchema.safeParse({
      ...base,
      correctOptionIds: ['zzz'],
    });
    expect(result.success).toBe(false);
  });

  it('rejects multi-correct when allowMultiple=false (via SlideSchema)', () => {
    const result = SlideSchema.safeParse({
      ...base,
      correctOptionIds: ['a', 'b'],
    });
    expect(result.success).toBe(false);
  });

  it('accepts multi-correct when allowMultiple=true (via SlideSchema)', () => {
    const result = SlideSchema.safeParse({
      ...base,
      correctOptionIds: ['a', 'b'],
      allowMultiple: true,
    });
    expect(result.success).toBe(true);
  });
});

describe('ShortAnswerSlide', () => {
  const slide = {
    id: '00000000-0000-4000-8000-000000000002',
    kind: 'short_answer' as const,
    order: 0,
    question: '한국의 수도는?',
    acceptedAnswers: ['서울', 'Seoul'],
  };

  it('matches accepted answers case-insensitively by default', () => {
    const parsed = ShortAnswerSlideSchema.parse(slide);
    expect(matchesShortAnswer('seoul', parsed)).toBe(true);
    expect(matchesShortAnswer('  Seoul  ', parsed)).toBe(true);
    expect(matchesShortAnswer('tokyo', parsed)).toBe(false);
  });

  it('respects caseSensitive flag', () => {
    const parsed = ShortAnswerSlideSchema.parse({ ...slide, caseSensitive: true });
    expect(matchesShortAnswer('Seoul', parsed)).toBe(true);
    expect(matchesShortAnswer('seoul', parsed)).toBe(false);
  });
});

describe('SlideSchema (discriminated union)', () => {
  it('discriminates on kind', () => {
    const result = SlideSchema.safeParse({
      id: '00000000-0000-4000-8000-000000000003',
      kind: 'true_false',
      order: 0,
      question: 'samslide는 사내 툴이다',
      answer: true,
    });
    expect(result.success).toBe(true);
  });

  it('rejects unknown kind', () => {
    const result = SlideSchema.safeParse({
      id: '00000000-0000-4000-8000-000000000004',
      kind: 'unknown_kind',
      order: 0,
    });
    expect(result.success).toBe(false);
  });
});
