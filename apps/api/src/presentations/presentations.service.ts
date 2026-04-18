import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  CreatePresentationRequest,
  Presentation,
  PresentationListItem,
  PresentationListResponse,
  UpdatePresentationRequest,
} from '@samslide/types';
import { PresentationsRepository } from './presentations.repository.js';

@Injectable()
export class PresentationsService {
  constructor(private readonly repo: PresentationsRepository) {}

  list(): PresentationListResponse {
    const items: PresentationListItem[] = this.repo.list().map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      slideCount: p.slides.length,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
    return { items, total: items.length };
  }

  getOne(id: string): Presentation {
    const presentation = this.repo.findById(id);
    if (!presentation) throw new NotFoundException(`presentation not found: ${id}`);
    return presentation;
  }

  create(input: CreatePresentationRequest): Presentation {
    return this.repo.create({
      title: input.title,
      description: input.description,
      settings: input.settings,
    });
  }

  update(id: string, patch: UpdatePresentationRequest): Presentation {
    const updated = this.repo.update(id, patch);
    if (!updated) throw new NotFoundException(`presentation not found: ${id}`);
    return updated;
  }

  remove(id: string): void {
    const ok = this.repo.remove(id);
    if (!ok) throw new NotFoundException(`presentation not found: ${id}`);
  }
}
