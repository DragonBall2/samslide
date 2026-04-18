import Link from 'next/link';
import { notFound } from 'next/navigation';
import { api, ApiClientError } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function DeckDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let deck;
  try {
    deck = await api.getDeck(id);
  } catch (err) {
    if (err instanceof ApiClientError && err.statusCode === 404) {
      notFound();
    }
    throw err;
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <Link href="/decks" className="text-sm text-slate-500 hover:underline">
        ← 덱 목록
      </Link>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">{deck.title}</h1>
      {deck.description && (
        <p className="mt-2 text-slate-600 dark:text-slate-400">{deck.description}</p>
      )}

      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <Chip label={`slides: ${deck.slides.length}`} />
        <Chip label={`competition: ${deck.settings.competitionMode ? 'on' : 'off'}`} />
        <Chip label={`defaultTimeLimit: ${deck.settings.defaultTimeLimit}s`} />
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">슬라이드</h2>
        {deck.slides.length === 0 ? (
          <div className="mt-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900">
            <p className="font-medium">아직 슬라이드가 없습니다.</p>
            <p className="mt-1 text-xs">
              M1 후속 스프린트에서 슬라이드 에디터가 추가됩니다. (질문 5종 + 콘텐츠 슬라이드)
            </p>
          </div>
        ) : (
          <ul className="mt-3 space-y-2">
            {deck.slides.map((slide) => (
              <li
                key={slide.id}
                className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
              >
                <p className="font-mono text-xs text-slate-500">#{slide.order} · {slide.kind}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Raw JSON</h2>
        <pre className="mt-3 overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs dark:border-slate-800 dark:bg-slate-950">
{JSON.stringify(deck, null, 2)}
        </pre>
      </section>
    </main>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 font-mono text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
      {label}
    </span>
  );
}
