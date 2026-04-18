'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { api, ApiClientError } from '@/lib/api';

export function CreateDeckForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api.createDeck({ title: title.trim(), description: description.trim() });
      setTitle('');
      setDescription('');
      router.refresh();
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError('덱 생성 중 오류가 발생했습니다.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  const canSubmit = title.trim().length > 0 && !submitting;

  return (
    <form onSubmit={onSubmit} className="mt-3 space-y-3">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="덱 제목 (필수)"
        maxLength={200}
        required
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-950"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="설명 (선택)"
        maxLength={2000}
        rows={2}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-950"
      />
      <div className="flex items-center justify-between">
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
        <button
          type="submit"
          disabled={!canSubmit}
          className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? '만드는 중...' : '덱 만들기'}
        </button>
      </div>
    </form>
  );
}
