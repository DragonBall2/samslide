import Link from 'next/link';
import { notFound } from 'next/navigation';
import { api, ApiClientError } from '@/lib/api';
import { DeckEditor } from './DeckEditor';

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

      <DeckEditor deck={deck} />
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
