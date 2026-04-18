import Link from 'next/link';
import { SlideKindSchema } from '@samslide/types';

export default function HomePage() {
  const kinds = SlideKindSchema.options;

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">samslide · Host</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        사내 인터랙티브 프레젠테이션 / 퀴즈 툴 — 호스트 및 에디터 앱
      </p>

      <div className="mt-8">
        <Link
          href="/presentations"
          className="inline-flex items-center rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          프레젠테이션 관리로 이동 →
        </Link>
      </div>

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
          지원 슬라이드 유형
        </h2>
        <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {kinds.map((kind) => (
            <li
              key={kind}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-mono dark:border-slate-800 dark:bg-slate-900"
            >
              {kind}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
