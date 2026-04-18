import type {
  ApiError,
  CreatePresentationRequest,
  CreateSlideRequest,
  Presentation,
  PresentationListResponse,
  ReorderSlidesRequest,
  Slide,
  UpdatePresentationRequest,
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
  listPresentations(): Promise<PresentationListResponse> {
    return request<PresentationListResponse>('/presentations');
  },
  getPresentation(id: string): Promise<Presentation> {
    return request<Presentation>(`/presentations/${id}`);
  },
  createPresentation(input: CreatePresentationRequest): Promise<Presentation> {
    return request<Presentation>('/presentations', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },
  updatePresentation(id: string, patch: UpdatePresentationRequest): Promise<Presentation> {
    return request<Presentation>(`/presentations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    });
  },
  deletePresentation(id: string): Promise<void> {
    return request<void>(`/presentations/${id}`, {
      method: 'DELETE',
      expectJson: false,
    });
  },
  addSlide(presentationId: string, input: CreateSlideRequest): Promise<Slide> {
    return request<Slide>(`/presentations/${presentationId}/slides`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },
  updateSlide(
    presentationId: string,
    slideId: string,
    input: UpdateSlideRequest,
  ): Promise<Slide> {
    return request<Slide>(`/presentations/${presentationId}/slides/${slideId}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  },
  deleteSlide(presentationId: string, slideId: string): Promise<void> {
    return request<void>(`/presentations/${presentationId}/slides/${slideId}`, {
      method: 'DELETE',
      expectJson: false,
    });
  },
  reorderSlides(
    presentationId: string,
    input: ReorderSlidesRequest,
  ): Promise<{ slides: Slide[] }> {
    return request<{ slides: Slide[] }>(`/presentations/${presentationId}/slides/reorder`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },
};
