import type {
  ApiError,
  CreateDeckRequest,
  CreateSlideRequest,
  Deck,
  DeckListResponse,
  ReorderSlidesRequest,
  Slide,
  UpdateDeckRequest,
  UpdateSlideRequest,
} from '@samslide/types';
import { API_BASE_URL } from './env';

export class ApiClientError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly body: ApiError | null,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

async function request<T>(
  path: string,
  init?: RequestInit & { expectJson?: boolean },
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    let body: ApiError | null = null;
    try {
      body = (await res.json()) as ApiError;
    } catch {
      // ignore body parse errors
    }
    const message = Array.isArray(body?.message)
      ? body.message.join(', ')
      : (body?.message ?? res.statusText);
    throw new ApiClientError(res.status, message, body);
  }

  if (res.status === 204 || init?.expectJson === false) {
    return undefined as T;
  }
  return (await res.json()) as T;
}

export const api = {
  listDecks(): Promise<DeckListResponse> {
    return request<DeckListResponse>('/decks');
  },
  getDeck(id: string): Promise<Deck> {
    return request<Deck>(`/decks/${id}`);
  },
  createDeck(input: CreateDeckRequest): Promise<Deck> {
    return request<Deck>('/decks', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },
  updateDeck(id: string, patch: UpdateDeckRequest): Promise<Deck> {
    return request<Deck>(`/decks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    });
  },
  deleteDeck(id: string): Promise<void> {
    return request<void>(`/decks/${id}`, {
      method: 'DELETE',
      expectJson: false,
    });
  },
  addSlide(deckId: string, input: CreateSlideRequest): Promise<Slide> {
    return request<Slide>(`/decks/${deckId}/slides`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },
  updateSlide(deckId: string, slideId: string, input: UpdateSlideRequest): Promise<Slide> {
    return request<Slide>(`/decks/${deckId}/slides/${slideId}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  },
  deleteSlide(deckId: string, slideId: string): Promise<void> {
    return request<void>(`/decks/${deckId}/slides/${slideId}`, {
      method: 'DELETE',
      expectJson: false,
    });
  },
  reorderSlides(deckId: string, input: ReorderSlidesRequest): Promise<{ slides: Slide[] }> {
    return request<{ slides: Slide[] }>(`/decks/${deckId}/slides/reorder`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },
};
