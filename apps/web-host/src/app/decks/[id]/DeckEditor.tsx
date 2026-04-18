'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { CreateSlideRequest, Deck, Slide, SlideKind } from '@samslide/types';
import { SlideKindSchema } from '@samslide/types';
import { api, ApiClientError } from '@/lib/api';
import { SLIDE_KIND_LABELS, SlideForm } from './slide-forms';

type Mode =
  | { t: 'view' }
  | { t: 'picking-kind' }
  | { t: 'adding'; kind: SlideKind }
  | { t: 'editing'; slide: Slide };

export function DeckEditor({ deck: initialDeck }: { deck: Deck }) {
  const router = useRouter();
  const [deck, setDeck] = useState(initialDeck);
  const [mode, setMode] = useState<Mode>({ t: 'view' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const kinds = SlideKindSchema.options;

  function resetMode() {
    setMode({ t: 'view' });
    setError(null);
  }

  async function handleCreate(body: CreateSlideRequest) {
    setBusy(true);
    setError(null);
    try {
      const slide = await api.addSlide(deck.id, body);
      setDeck({ ...deck, slides: [...deck.slides, slide] });
      resetMode();
      router.refresh();
    } catch (e) {
      setError(e instanceof ApiClientError ? e.message : '추가 중 오류가 발생했습니다.');
    } finally {
      setBusy(false);
    }
  }

  async function handleUpdate(slideId: string, body: CreateSlideRequest) {
    setBusy(true);
    setError(null);
    try {
      const slide = await api.updateSlide(deck.id, slideId, body);
      setDeck({
        ...deck,
        slides: deck.slides.map((s) => (s.id === slideId ? slide : s)),
      });
      resetMode();
      router.refresh();
    } catch (e) {
      setError(e instanceof ApiClientError ? e.message : '수정 중 오류가 발생했습니다.');
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(slide: Slide) {
    if (!confirm(`슬라이드 #${slide.order + 1} (${slide.kind}) 을(를) 삭제하시겠습니까?`)) return;
    setBusy(true);
    try {
      await api.deleteSlide(deck.id, slide.id);
      // 서버가 재정렬하므로 다시 가져온다
      const fresh = await api.getDeck(deck.id);
      setDeck(fresh);
      router.refresh();
    } catch (e) {
      alert(e instanceof ApiClientError ? e.message : '삭제 실패');
    } finally {
      setBusy(false);
    }
  }

  async function handleMove(slide: Slide, delta: -1 | 1) {
    const sorted = [...deck.slides].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((s) => s.id === slide.id);
    const target = idx + delta;
    if (target < 0 || target >= sorted.length) return;
    const reordered = [...sorted];
    const [moved] = reordered.splice(idx, 1);
    if (!moved) return;
    reordered.splice(target, 0, moved);
    const slideIds = reordered.map((s) => s.id);
    setBusy(true);
    try {
      const res = await api.reorderSlides(deck.id, { slideIds });
      setDeck({ ...deck, slides: res.slides });
      router.refresh();
    } catch (e) {
      alert(e instanceof ApiClientError ? e.message : '순서 변경 실패');
    } finally {
      setBusy(false);
    }
  }

  const sortedSlides = [...deck.slides].sort((a, b) => a.order - b.order);

  return (
    <section className="mt-8">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">슬라이드 ({deck.slides.length})</h2>
        {mode.t === 'view' && (
          <button
            type="button"
            onClick={() => setMode({ t: 'picking-kind' })}
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            + 슬라이드 추가
          </button>
        )}
      </header>

      {mode.t === 'picking-kind' && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="mb-3 text-sm font-medium">어떤 슬라이드를 만드시겠어요?</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {kinds.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setMode({ t: 'adding', kind: k })}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm hover:border-brand-500 hover:bg-brand-50 dark:border-slate-700 dark:bg-slate-950"
              >
                <span className="block font-semibold">{SLIDE_KIND_LABELS[k]}</span>
                <span className="block font-mono text-xs text-slate-500">{k}</span>
              </button>
            ))}
          </div>
          <div className="mt-3 text-right">
            <button type="button" onClick={resetMode} className="text-sm text-slate-500 underline">
              취소
            </button>
          </div>
        </div>
      )}

      {mode.t === 'adding' && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="mb-3 text-sm font-semibold">
            새 슬라이드: {SLIDE_KIND_LABELS[mode.kind]}
          </p>
          <SlideForm
            kind={mode.kind}
            submitLabel="추가"
            submitting={busy}
            error={error}
            onCancel={resetMode}
            onSubmit={handleCreate}
          />
        </div>
      )}

      {sortedSlides.length === 0 && mode.t === 'view' ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900">
          <p className="font-medium">아직 슬라이드가 없습니다.</p>
          <p className="mt-1 text-xs">위 "+ 슬라이드 추가" 버튼으로 시작하세요.</p>
        </div>
      ) : (
        <ul className="mt-4 space-y-2">
          {sortedSlides.map((slide, i) => (
            <li
              key={slide.id}
              className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
            >
              {mode.t === 'editing' && mode.slide.id === slide.id ? (
                <>
                  <p className="mb-3 text-sm font-semibold">
                    편집 중: #{slide.order + 1} · {SLIDE_KIND_LABELS[slide.kind]}
                  </p>
                  <SlideForm
                    kind={slide.kind}
                    initial={slide}
                    submitLabel="저장"
                    submitting={busy}
                    error={error}
                    onCancel={resetMode}
                    onSubmit={(body) => handleUpdate(slide.id, body)}
                  />
                </>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-mono text-slate-500">
                      #{slide.order + 1} · {slide.kind}
                    </p>
                    <p className="mt-0.5 truncate font-medium">{summarize(slide)}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleMove(slide, -1)}
                      disabled={busy || i === 0}
                      className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs disabled:opacity-30 dark:border-slate-700 dark:bg-slate-900"
                      aria-label="위로"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(slide, 1)}
                      disabled={busy || i === sortedSlides.length - 1}
                      className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs disabled:opacity-30 dark:border-slate-700 dark:bg-slate-900"
                      aria-label="아래로"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode({ t: 'editing', slide })}
                      disabled={busy}
                      className="rounded-md border border-slate-200 bg-white px-3 py-1 text-xs dark:border-slate-700 dark:bg-slate-900"
                    >
                      편집
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(slide)}
                      disabled={busy}
                      className="rounded-md border border-red-200 bg-white px-3 py-1 text-xs text-red-600 dark:border-red-900 dark:bg-slate-900 dark:text-red-400"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function summarize(slide: Slide): string {
  switch (slide.kind) {
    case 'content':
      return slide.title || '(제목 없음)';
    case 'multiple_choice':
    case 'true_false':
    case 'short_answer':
      return slide.question;
    case 'word_cloud':
      return slide.prompt;
    case 'qna':
      return slide.title;
  }
}
