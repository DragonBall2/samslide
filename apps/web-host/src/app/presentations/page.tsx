import Link from 'next/link';
import { api } from '@/lib/api';
import { CreatePresentationForm } from './CreatePresentationForm';
import { DeletePresentationButton } from './DeletePresentationButton';

export const dynamic = 'force-dynamic';

export default async function PresentationsPage() {
  const list = await api.listPresentations();

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <header className="flex items-center justify-between">
        <div>
          <Link href="/" className="text-sm text-slate-500 hover:underline">
            ← 홈
          </Link>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">프레젠테이션 관리</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            총 {list.total}개
          </p>
        </div>
      </header>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold">새 프레젠테이션 만들기</h2>
        <CreatePresentationForm />
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">내 프레젠테이션</h2>

        {list.items.length === 0 ? (
          <p className="mt-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900">
            아직 프레젠테이션이 없습니다. 위에서 첫 프레젠테이션을 만들어 보세요.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {list.items.map((presentation) => (
              <li
                key={presentation.id}
                className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/presentations/${presentation.id}`}
                    className="block truncate text-base font-semibold hover:underline"
                  >
                    {presentation.title}
                  </Link>
                  {presentation.description && (
                    <p className="mt-0.5 truncate text-sm text-slate-500">
                      {presentation.description}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-slate-400">
                    슬라이드 {presentation.slideCount}개 · 수정{' '}
                    {new Date(presentation.updatedAt).toLocaleString('ko-KR')}
                  </p>
                </div>
                <DeletePresentationButton id={presentation.id} title={presentation.title} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
