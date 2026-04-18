import { describe, expect, it } from 'vitest';
import {
  CreatePresentationRequestSchema,
  CreateSlideRequestSchema,
  ReorderSlidesRequestSchema,
} from '../src/index.js';

describe('CreatePresentationRequest', () => {
  it('accepts minimal valid input', () => {
    expect(CreatePresentationRequestSchema.parse({ title: '테스트' })).toMatchObject({
      title: '테스트',
      description: '',
    });
  });

  it('rejects empty title', () => {
    expect(CreatePresentationRequestSchema.safeParse({ title: '' }).success).toBe(false);
  });
});

describe('CreateSlideRequest', () => {
  it('accepts a content slide without id/order', () => {
    const result = CreateSlideRequestSchema.safeParse({
      kind: 'content',
      title: '인트로',
      bodyMarkdown: '**안녕**',
      layout: 'title-body',
    });
    expect(result.success).toBe(true);
  });

  it('accepts a multiple_choice slide', () => {
    const result = CreateSlideRequestSchema.safeParse({
      kind: 'multiple_choice',
      question: '1+1?',
      options: [
        { id: 'a', text: '1' },
        { id: 'b', text: '2' },
      ],
      correctOptionIds: ['b'],
    });
    expect(result.success).toBe(true);
  });

  it('rejects multiple_choice with unknown correctOptionIds (shared validation)', () => {
    const result = CreateSlideRequestSchema.safeParse({
      kind: 'multiple_choice',
      question: 'q',
      options: [
        { id: 'a', text: 'A' },
        { id: 'b', text: 'B' },
      ],
      correctOptionIds: ['zzz'],
    });
    expect(result.success).toBe(false);
  });

  it('rejects unknown kind', () => {
    const result = CreateSlideRequestSchema.safeParse({
      kind: 'unknown',
      question: 'x',
    });
    expect(result.success).toBe(false);
  });
});

describe('ReorderSlidesRequest', () => {
  it('accepts an array of uuids', () => {
    const result = ReorderSlidesRequestSchema.safeParse({
      slideIds: ['00000000-0000-4000-8000-000000000001'],
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty array', () => {
    expect(
      ReorderSlidesRequestSchema.safeParse({ slideIds: [] }).success,
    ).toBe(false);
  });

  it('rejects non-uuid entries', () => {
    expect(
      ReorderSlidesRequestSchema.safeParse({ slideIds: ['not-a-uuid'] }).success,
    ).toBe(false);
  });
});
