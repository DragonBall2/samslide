'use client';

import { useState } from 'react';

export default function JoinPage() {
  const [code, setCode] = useState('');

  const sanitized = code.replace(/\D/g, '').slice(0, 6);
  const canJoin = sanitized.length === 6;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-10">
      <h1 className="text-center text-3xl font-bold tracking-tight">samslide</h1>
      <p className="mt-2 text-center text-slate-600 dark:text-slate-400">
        호스트에게 받은 6자리 코드를 입력하세요
      </p>

      <form
        className="mt-10 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          // M2: /api/sessions/by-code 로 조회 후 /join/[code]로 이동
          // eslint-disable-next-line no-alert
          alert(`입력한 코드: ${sanitized} (M2에서 실제 연결 예정)`);
        }}
      >
        <input
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]*"
          maxLength={6}
          value={sanitized}
          onChange={(e) => setCode(e.target.value)}
          placeholder="000000"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-center text-2xl font-mono tracking-widest focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-900"
        />

        <button
          type="submit"
          disabled={!canJoin}
          className="w-full rounded-xl bg-slate-900 px-4 py-3 text-base font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
        >
          참여하기
        </button>
      </form>

      <p className="mt-10 text-center text-xs text-slate-500">
        로그인 없이 참여 · 응답은 세션 종료 시 익명 처리
      </p>
    </main>
  );
}
