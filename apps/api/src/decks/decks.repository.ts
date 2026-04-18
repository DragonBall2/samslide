import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type {
  CreateSlideRequest,
  Deck,
  DeckSettings,
  Slide,
  UpdateSlideRequest,
} from '@samslide/types';

type InternalDeck = Omit<Deck, 'slides' | 'settings'> & {
  slides: Slide[];
  settings: DeckSettings;
};

const DEFAULT_SETTINGS: DeckSettings = {
  competitionMode: false,
  defaultTimeLimit: 20,
  showLeaderboard: false,
  allowAnonymousParticipants: true,
};

const PLACEHOLDER_OWNER_ID = '00000000-0000-4000-8000-000000000000';

/**
 * 인메모리 덱 저장소.
 * M1 후반(PostgreSQL + Prisma) 도입 시 동일 인터페이스의 PrismaDecksRepository로 교체 예정.
 */
@Injectable()
export class DecksRepository {
  private readonly decks = new Map<string, InternalDeck>();

  list(): InternalDeck[] {
    return [...this.decks.values()].sort(
      (a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt),
    );
  }

  findById(id: string): InternalDeck | null {
    return this.decks.get(id) ?? null;
  }

  create(input: {
    title: string;
    description: string;
    settings?: Partial<DeckSettings>;
    ownerId?: string;
  }): InternalDeck {
    const now = new Date().toISOString();
    const id = randomUUID();
    const deck: InternalDeck = {
      id,
      ownerId: input.ownerId ?? PLACEHOLDER_OWNER_ID,
      title: input.title,
      description: input.description,
      slides: [],
      settings: { ...DEFAULT_SETTINGS, ...input.settings },
      createdAt: now,
      updatedAt: now,
    };
    this.decks.set(id, deck);
    return deck;
  }

  update(
    id: string,
    patch: {
      title?: string;
      description?: string;
      settings?: Partial<DeckSettings>;
    },
  ): InternalDeck | null {
    const existing = this.decks.get(id);
    if (!existing) return null;
    const updated: InternalDeck = {
      ...existing,
      title: patch.title ?? existing.title,
      description: patch.description ?? existing.description,
      settings: { ...existing.settings, ...(patch.settings ?? {}) },
      updatedAt: new Date().toISOString(),
    };
    this.decks.set(id, updated);
    return updated;
  }

  remove(id: string): boolean {
    return this.decks.delete(id);
  }

  // ===== Slide operations =====

  addSlide(deckId: string, input: CreateSlideRequest): Slide | null {
    const deck = this.decks.get(deckId);
    if (!deck) return null;

    const nextOrder =
      input.order ??
      (deck.slides.length === 0
        ? 0
        : Math.max(...deck.slides.map((s) => s.order)) + 1);

    // 순서가 기존 슬라이드와 충돌하면 뒤로 밀어낸다.
    const needsShift = deck.slides.some((s) => s.order === nextOrder);
    const shifted = needsShift
      ? deck.slides.map((s) =>
          s.order >= nextOrder ? { ...s, order: s.order + 1 } : s,
        )
      : deck.slides;

    const newSlide = { id: randomUUID(), order: nextOrder, ...stripOrder(input) } as Slide;

    deck.slides = [...shifted, newSlide].sort((a, b) => a.order - b.order);
    deck.updatedAt = new Date().toISOString();
    return newSlide;
  }

  updateSlide(
    deckId: string,
    slideId: string,
    input: UpdateSlideRequest,
  ): Slide | null {
    const deck = this.decks.get(deckId);
    if (!deck) return null;

    const idx = deck.slides.findIndex((s) => s.id === slideId);
    if (idx === -1) return null;

    const existing = deck.slides[idx];
    if (!existing) return null;

    const preservedOrder = input.order ?? existing.order;
    const replaced = {
      id: slideId,
      order: preservedOrder,
      ...stripOrder(input),
    } as Slide;

    deck.slides = deck.slides.map((s) => (s.id === slideId ? replaced : s));
    deck.updatedAt = new Date().toISOString();
    return replaced;
  }

  removeSlide(deckId: string, slideId: string): boolean {
    const deck = this.decks.get(deckId);
    if (!deck) return false;
    const before = deck.slides.length;
    deck.slides = deck.slides.filter((s) => s.id !== slideId);
    if (deck.slides.length === before) return false;
    // 재정렬: 0..n-1 로 컴팩트화
    deck.slides = deck.slides
      .sort((a, b) => a.order - b.order)
      .map((s, i) => ({ ...s, order: i } as Slide));
    deck.updatedAt = new Date().toISOString();
    return true;
  }

  /**
   * slideIds 로 주어진 순서대로 재정렬한다.
   * 주어진 slideIds 에 누락된 id 가 있으면 null 반환 (부분 재정렬 방지).
   */
  reorderSlides(deckId: string, slideIds: string[]): Slide[] | null {
    const deck = this.decks.get(deckId);
    if (!deck) return null;

    if (slideIds.length !== deck.slides.length) return null;
    const existingIds = new Set(deck.slides.map((s) => s.id));
    for (const id of slideIds) {
      if (!existingIds.has(id)) return null;
    }
    // 중복 검사
    if (new Set(slideIds).size !== slideIds.length) return null;

    const byId = new Map(deck.slides.map((s) => [s.id, s]));
    deck.slides = slideIds.map((id, i) => ({ ...byId.get(id)!, order: i } as Slide));
    deck.updatedAt = new Date().toISOString();
    return deck.slides;
  }
}

function stripOrder<T extends { order?: unknown }>(input: T): Omit<T, 'order'> {
  const { order: _order, ...rest } = input;
  return rest;
}
