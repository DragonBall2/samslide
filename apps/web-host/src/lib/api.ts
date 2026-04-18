import type {
  ApiError,
  CreateDeckRequest,
  Deck,
  DeckListResponse,
  UpdateDeckRequest,
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
};
