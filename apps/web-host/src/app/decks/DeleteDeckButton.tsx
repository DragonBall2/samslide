'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api, ApiClientError } from '@/lib/api';

export function DeleteDeckButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    if (!confirm(`덱 "${title}"을(를) 삭제하시겠습니까?`)) return;
    setBusy(true);
    try {
      await api.deleteDeck(id);
      router.refresh();
    } catch (err) {
      const message =
        err instanceof ApiClientError ? err.message : '삭제 중 오류가 발생했습니다.';
      alert(message);
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={busy}
      className="shrink-0 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-40 dark:border-red-900 dark:bg-slate-900 dark:text-red-400 dark:hover:bg-red-950"
    >
      {busy ? '삭제 중...' : '삭제'}
    </button>
  );
}
