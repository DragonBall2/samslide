import { SlideKindSchema } from '@samslide/types';

export default function HomePage() {
  const kinds = SlideKindSchema.options;

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">samslide · Host</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        사내 인터랙티브 프레젠테이션 / 퀴즈 툴 — 호스트 및 에디터 앱 (M0 스캐폴드)
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">지원 예정 슬라이드 유형</h2>
        <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
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

      <footer className="mt-16 text-sm text-slate-500">
        M1부터 /decks, /decks/[id]/edit, /decks/[id]/import 라우트가 추가됩니다.
      </footer>
    </main>
  );
}
