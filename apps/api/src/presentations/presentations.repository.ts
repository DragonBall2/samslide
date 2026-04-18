import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type {
  CreateSlideRequest,
  Presentation,
  PresentationSettings,
  Slide,
  UpdateSlideRequest,
} from '@samslide/types';

type InternalPresentation = Omit<Presentation, 'slides' | 'settings'> & {
  slides: Slide[];
  settings: PresentationSettings;
};

const DEFAULT_SETTINGS: PresentationSettings = {
  competitionMode: false,
  defaultTimeLimit: 20,
  showLeaderboard: false,
  allowAnonymousParticipants: true,
};

const PLACEHOLDER_OWNER_ID = '00000000-0000-4000-8000-000000000000';

/**
 * 인메모리 프레젠테이션 저장소.
 * M1 후반(PostgreSQL + Prisma) 도입 시 동일 인터페이스의 PrismaPresentationsRepository로 교체 예정.
 */
@Injectable()
export class PresentationsRepository {
  private readonly presentations = new Map<string, InternalPresentation>();

  list(): InternalPresentation[] {
    return [...this.presentations.values()].sort(
      (a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt),
    );
  }

  findById(id: string): InternalPresentation | null {
    return this.presentations.get(id) ?? null;
  }

  create(input: {
    title: string;
    description: string;
    settings?: Partial<PresentationSettings>;
    ownerId?: string;
  }): InternalPresentation {
    const now = new Date().toISOString();
    const id = randomUUID();
    const presentation: InternalPresentation = {
      id,
      ownerId: input.ownerId ?? PLACEHOLDER_OWNER_ID,
      title: input.title,
      description: input.description,
      slides: [],
      settings: { ...DEFAULT_SETTINGS, ...input.settings },
      createdAt: now,
      updatedAt: now,
    };
    this.presentations.set(id, presentation);
    return presentation;
  }

  update(
    id: string,
    patch: {
      title?: string;
      description?: string;
      settings?: Partial<PresentationSettings>;
    },
  ): InternalPresentation | null {
    const existing = this.presentations.get(id);
    if (!existing) return null;
    const updated: InternalPresentation = {
      ...existing,
      title: patch.title ?? existing.title,
      description: patch.description ?? existing.description,
      settings: { ...existing.settings, ...(patch.settings ?? {}) },
      updatedAt: new Date().toISOString(),
    };
    this.presentations.set(id, updated);
    return updated;
  }

  remove(id: string): boolean {
    return this.presentations.delete(id);
  }

  // ===== Slide operations =====

  addSlide(presentationId: string, input: CreateSlideRequest): Slide | null {
    const presentation = this.presentations.get(presentationId);
    if (!presentation) return null;

    const nextOrder =
      input.order ??
      (presentation.slides.length === 0
        ? 0
        : Math.max(...presentation.slides.map((s) => s.order)) + 1);

    // 순서가 기존 슬라이드와 충돌하면 뒤로 밀어낸다.
    const needsShift = presentation.slides.some((s) => s.order === nextOrder);
    const shifted = needsShift
      ? presentation.slides.map((s) =>
          s.order >= nextOrder ? { ...s, order: s.order + 1 } : s,
        )
      : presentation.slides;

    const newSlide = { id: randomUUID(), order: nextOrder, ...stripOrder(input) } as Slide;

    presentation.slides = [...shifted, newSlide].sort((a, b) => a.order - b.order);
    presentation.updatedAt = new Date().toISOString();
    return newSlide;
  }

  updateSlide(
    presentationId: string,
    slideId: string,
    input: UpdateSlideRequest,
  ): Slide | null {
    const presentation = this.presentations.get(presentationId);
    if (!presentation) return null;

    const idx = presentation.slides.findIndex((s) => s.id === slideId);
    if (idx === -1) return null;

    const existing = presentation.slides[idx];
    if (!existing) return null;

    const preservedOrder = input.order ?? existing.order;
    const replaced = {
      id: slideId,
      order: preservedOrder,
      ...stripOrder(input),
    } as Slide;

    presentation.slides = presentation.slides.map((s) => (s.id === slideId ? replaced : s));
    presentation.updatedAt = new Date().toISOString();
    return replaced;
  }

  removeSlide(presentationId: string, slideId: string): boolean {
    const presentation = this.presentations.get(presentationId);
    if (!presentation) return false;
    const before = presentation.slides.length;
    presentation.slides = presentation.slides.filter((s) => s.id !== slideId);
    if (presentation.slides.length === before) return false;
    // 재정렬: 0..n-1 로 컴팩트화
    presentation.slides = presentation.slides
      .sort((a, b) => a.order - b.order)
      .map((s, i) => ({ ...s, order: i } as Slide));
    presentation.updatedAt = new Date().toISOString();
    return true;
  }

  /**
   * slideIds 로 주어진 순서대로 재정렬한다.
   * 주어진 slideIds 에 누락된 id 가 있으면 null 반환 (부분 재정렬 방지).
   */
  reorderSlides(presentationId: string, slideIds: string[]): Slide[] | null {
    const presentation = this.presentations.get(presentationId);
    if (!presentation) return null;

    if (slideIds.length !== presentation.slides.length) return null;
    const existingIds = new Set(presentation.slides.map((s) => s.id));
    for (const id of slideIds) {
      if (!existingIds.has(id)) return null;
    }
    // 중복 검사
    if (new Set(slideIds).size !== slideIds.length) return null;

    const byId = new Map(presentation.slides.map((s) => [s.id, s]));
    presentation.slides = slideIds.map((id, i) => ({ ...byId.get(id)!, order: i } as Slide));
    presentation.updatedAt = new Date().toISOString();
    return presentation.slides;
  }
}

function stripOrder<T extends { order?: unknown }>(input: T): Omit<T, 'order'> {
  const { order: _order, ...rest } = input;
  return rest;
}
