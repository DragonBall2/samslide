import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  CreateDeckRequest,
  Deck,
  DeckListItem,
  DeckListResponse,
  UpdateDeckRequest,
} from '@samslide/types';
import { DecksRepository } from './decks.repository.js';

@Injectable()
export class DecksService {
  constructor(private readonly repo: DecksRepository) {}

  list(): DeckListResponse {
    const items: DeckListItem[] = this.repo.list().map((d) => ({
      id: d.id,
      title: d.title,
      description: d.description,
      slideCount: d.slides.length,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    }));
    return { items, total: items.length };
  }

  getOne(id: string): Deck {
    const deck = this.repo.findById(id);
    if (!deck) throw new NotFoundException(`deck not found: ${id}`);
    return deck;
  }

  create(input: CreateDeckRequest): Deck {
    return this.repo.create({
      title: input.title,
      description: input.description,
      settings: input.settings,
    });
  }

  update(id: string, patch: UpdateDeckRequest): Deck {
    const updated = this.repo.update(id, patch);
    if (!updated) throw new NotFoundException(`deck not found: ${id}`);
    return updated;
  }

  remove(id: string): void {
    const ok = this.repo.remove(id);
    if (!ok) throw new NotFoundException(`deck not found: ${id}`);
  }
}
