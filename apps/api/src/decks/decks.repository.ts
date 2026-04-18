import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { Deck, DeckSettings, Slide } from '@samslide/types';

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
}
