'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import type {
  ContentLayout,
  ContentSlide,
  CreateSlideRequest,
  MultipleChoiceSlide,
  QnaSlide,
  ShortAnswerSlide,
  Slide,
  SlideKind,
  TrueFalseSlide,
  WordCloudSlide,
} from '@samslide/types';

// ---------------- shared primitives ----------------

export const SLIDE_KIND_LABELS: Record<SlideKind, string> = {
  content: '콘텐츠 슬라이드',
  multiple_choice: '객관식',
  true_false: 'OX',
  short_answer: '단답형',
  word_cloud: '워드클라우드',
  qna: 'Q&A',
};

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-950';

function FormShell({
  onSubmit,
  onCancel,
  submitting,
  error,
  children,
  submitLabel,
}: {
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
  submitting: boolean;
  error: string | null;
  children: ReactNode;
  submitLabel: string;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      {children}
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-40"
        >
          {submitting ? '저장 중...' : submitLabel}
        </button>
      </div>
    </form>
  );
}

type FormProps<T> = {
  initial?: T;
  submitLabel: string;
  submitting: boolean;
  error: string | null;
  onCancel: () => void;
  onSubmit: (body: CreateSlideRequest) => void;
};

// ---------------- content ----------------

const CONTENT_LAYOUTS: ContentLayout[] = [
  'title',
  'title-body',
  'two-column',
  'image-focus',
  'quote',
];

export function ContentForm({
  initial,
  submitLabel,
  submitting,
  error,
  onCancel,
  onSubmit,
}: FormProps<ContentSlide>) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [body, setBody] = useState(initial?.bodyMarkdown ?? '');
  const [layout, setLayout] = useState<ContentLayout>(initial?.layout ?? 'title-body');

  function submit(e: FormEvent) {
    e.preventDefault();
    onSubmit({ kind: 'content', title, bodyMarkdown: body, layout, tags: [] });
  }

  return (
    <FormShell
      onSubmit={submit}
      onCancel={onCancel}
      submitting={submitting}
      error={error}
      submitLabel={submitLabel}
    >
      <Field label="제목">
        <input
          className={inputCls}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          placeholder="슬라이드 제목"
        />
      </Field>
      <Field label="본문 (Markdown)">
        <textarea
          className={inputCls}
          rows={4}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={10000}
          placeholder="**굵게** _기울임_ 등 markdown 지원 예정"
        />
      </Field>
      <Field label="레이아웃">
        <select
          className={inputCls}
          value={layout}
          onChange={(e) => setLayout(e.target.value as ContentLayout)}
        >
          {CONTENT_LAYOUTS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </Field>
    </FormShell>
  );
}

// ---------------- multiple_choice ----------------

function newOptionId(): string {
  return crypto.randomUUID().slice(0, 8);
}

export function MultipleChoiceForm({
  initial,
  submitLabel,
  submitting,
  error,
  onCancel,
  onSubmit,
}: FormProps<MultipleChoiceSlide>) {
  const [question, setQuestion] = useState(initial?.question ?? '');
  const [options, setOptions] = useState(
    initial?.options ?? [
      { id: newOptionId(), text: '' },
      { id: newOptionId(), text: '' },
    ],
  );
  const [correct, setCorrect] = useState<Set<string>>(
    new Set(initial?.correctOptionIds ?? []),
  );
  const [allowMultiple, setAllowMultiple] = useState(initial?.allowMultiple ?? false);
  const [timeLimit, setTimeLimit] = useState(initial?.timeLimit ?? 20);
  const [points, setPoints] = useState(initial?.points ?? 1000);

  function toggleCorrect(id: string) {
    setCorrect((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else {
        if (!allowMultiple) next.clear();
        next.add(id);
      }
      return next;
    });
  }

  function addOption() {
    if (options.length >= 6) return;
    setOptions([...options, { id: newOptionId(), text: '' }]);
  }

  function removeOption(id: string) {
    if (options.length <= 2) return;
    setOptions(options.filter((o) => o.id !== id));
    setCorrect((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    onSubmit({
      kind: 'multiple_choice',
      question,
      options,
      correctOptionIds: [...correct],
      allowMultiple,
      timeLimit,
      points,
      anonymous: false,
      tags: [],
    });
  }

  return (
    <FormShell
      onSubmit={submit}
      onCancel={onCancel}
      submitting={submitting}
      error={error}
      submitLabel={submitLabel}
    >
      <Field label="질문">
        <input
          className={inputCls}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          maxLength={1000}
          required
        />
      </Field>

      <div>
        <p className="mb-1 text-xs font-medium text-slate-600 dark:text-slate-400">
          선택지 (2~6개, 왼쪽 체크가 정답)
        </p>
        <ul className="space-y-2">
          {options.map((opt) => (
            <li key={opt.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={correct.has(opt.id)}
                onChange={() => toggleCorrect(opt.id)}
                className="h-5 w-5"
                aria-label="정답"
              />
              <input
                className={inputCls}
                value={opt.text}
                onChange={(e) =>
                  setOptions(
                    options.map((o) => (o.id === opt.id ? { ...o, text: e.target.value } : o)),
                  )
                }
                maxLength={500}
                placeholder="선택지 텍스트"
              />
              <button
                type="button"
                onClick={() => removeOption(opt.id)}
                disabled={options.length <= 2}
                className="shrink-0 rounded-md border border-slate-300 px-2 py-1 text-xs dark:border-slate-700 disabled:opacity-30"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={addOption}
          disabled={options.length >= 6}
          className="mt-2 rounded-md border border-dashed border-slate-300 px-3 py-1.5 text-xs text-slate-600 disabled:opacity-30 dark:border-slate-700 dark:text-slate-300"
        >
          + 선택지 추가
        </button>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={allowMultiple}
          onChange={(e) => setAllowMultiple(e.target.checked)}
        />
        복수 정답 허용
      </label>

      <div className="grid grid-cols-2 gap-3">
        <Field label="제한 시간(초)">
          <input
            type="number"
            className={inputCls}
            value={timeLimit}
            min={5}
            max={300}
            onChange={(e) => setTimeLimit(Number(e.target.value))}
          />
        </Field>
        <Field label="점수">
          <input
            type="number"
            className={inputCls}
            value={points}
            min={0}
            max={2000}
            onChange={(e) => setPoints(Number(e.target.value))}
          />
        </Field>
      </div>
    </FormShell>
  );
}

// ---------------- true_false ----------------

export function TrueFalseForm({
  initial,
  submitLabel,
  submitting,
  error,
  onCancel,
  onSubmit,
}: FormProps<TrueFalseSlide>) {
  const [question, setQuestion] = useState(initial?.question ?? '');
  const [answer, setAnswer] = useState<boolean>(initial?.answer ?? true);
  const [timeLimit, setTimeLimit] = useState(initial?.timeLimit ?? 10);
  const [points, setPoints] = useState(initial?.points ?? 500);

  function submit(e: FormEvent) {
    e.preventDefault();
    onSubmit({
      kind: 'true_false',
      question,
      answer,
      timeLimit,
      points,
      anonymous: false,
      tags: [],
    });
  }

  return (
    <FormShell
      onSubmit={submit}
      onCancel={onCancel}
      submitting={submitting}
      error={error}
      submitLabel={submitLabel}
    >
      <Field label="질문">
        <input
          className={inputCls}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
      </Field>
      <Field label="정답">
        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={answer === true}
              onChange={() => setAnswer(true)}
            />{' '}
            참 (True)
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={answer === false}
              onChange={() => setAnswer(false)}
            />{' '}
            거짓 (False)
          </label>
        </div>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="제한 시간(초)">
          <input
            type="number"
            className={inputCls}
            value={timeLimit}
            min={5}
            max={300}
            onChange={(e) => setTimeLimit(Number(e.target.value))}
          />
        </Field>
        <Field label="점수">
          <input
            type="number"
            className={inputCls}
            value={points}
            min={0}
            max={2000}
            onChange={(e) => setPoints(Number(e.target.value))}
          />
        </Field>
      </div>
    </FormShell>
  );
}

// ---------------- short_answer ----------------

export function ShortAnswerForm({
  initial,
  submitLabel,
  submitting,
  error,
  onCancel,
  onSubmit,
}: FormProps<ShortAnswerSlide>) {
  const [question, setQuestion] = useState(initial?.question ?? '');
  const [acceptedRaw, setAcceptedRaw] = useState(
    (initial?.acceptedAnswers ?? ['']).join('\n'),
  );
  const [caseSensitive, setCaseSensitive] = useState(initial?.caseSensitive ?? false);
  const [timeLimit, setTimeLimit] = useState(initial?.timeLimit ?? 15);
  const [points, setPoints] = useState(initial?.points ?? 800);

  function submit(e: FormEvent) {
    e.preventDefault();
    const acceptedAnswers = acceptedRaw
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    onSubmit({
      kind: 'short_answer',
      question,
      acceptedAnswers,
      caseSensitive,
      trimWhitespace: true,
      timeLimit,
      points,
      anonymous: false,
      tags: [],
    });
  }

  return (
    <FormShell
      onSubmit={submit}
      onCancel={onCancel}
      submitting={submitting}
      error={error}
      submitLabel={submitLabel}
    >
      <Field label="질문">
        <input
          className={inputCls}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
      </Field>
      <Field label="허용 정답 (한 줄에 하나)">
        <textarea
          className={inputCls}
          rows={3}
          value={acceptedRaw}
          onChange={(e) => setAcceptedRaw(e.target.value)}
          placeholder={`서울\nSeoul\nSEOUL`}
        />
      </Field>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={caseSensitive}
          onChange={(e) => setCaseSensitive(e.target.checked)}
        />
        대소문자 구분
      </label>
      <div className="grid grid-cols-2 gap-3">
        <Field label="제한 시간(초)">
          <input
            type="number"
            className={inputCls}
            value={timeLimit}
            min={5}
            max={300}
            onChange={(e) => setTimeLimit(Number(e.target.value))}
          />
        </Field>
        <Field label="점수">
          <input
            type="number"
            className={inputCls}
            value={points}
            min={0}
            max={2000}
            onChange={(e) => setPoints(Number(e.target.value))}
          />
        </Field>
      </div>
    </FormShell>
  );
}

// ---------------- word_cloud ----------------

export function WordCloudForm({
  initial,
  submitLabel,
  submitting,
  error,
  onCancel,
  onSubmit,
}: FormProps<WordCloudSlide>) {
  const [prompt, setPrompt] = useState(initial?.prompt ?? '');
  const [maxSubmissions, setMaxSubmissions] = useState(initial?.maxSubmissionsPerUser ?? 3);
  const [maxWordLength, setMaxWordLength] = useState(initial?.maxWordLength ?? 30);
  const [timeLimit, setTimeLimit] = useState(initial?.timeLimit ?? 60);

  function submit(e: FormEvent) {
    e.preventDefault();
    onSubmit({
      kind: 'word_cloud',
      prompt,
      maxSubmissionsPerUser: maxSubmissions,
      maxWordLength,
      timeLimit,
      anonymous: true,
      tags: [],
    });
  }

  return (
    <FormShell
      onSubmit={submit}
      onCancel={onCancel}
      submitting={submitting}
      error={error}
      submitLabel={submitLabel}
    >
      <Field label="질문/프롬프트">
        <input
          className={inputCls}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          required
        />
      </Field>
      <div className="grid grid-cols-3 gap-3">
        <Field label="1인 제출 수">
          <input
            type="number"
            className={inputCls}
            value={maxSubmissions}
            min={1}
            max={10}
            onChange={(e) => setMaxSubmissions(Number(e.target.value))}
          />
        </Field>
        <Field label="단어 최대 길이">
          <input
            type="number"
            className={inputCls}
            value={maxWordLength}
            min={1}
            max={100}
            onChange={(e) => setMaxWordLength(Number(e.target.value))}
          />
        </Field>
        <Field label="제한 시간(초)">
          <input
            type="number"
            className={inputCls}
            value={timeLimit}
            min={5}
            max={300}
            onChange={(e) => setTimeLimit(Number(e.target.value))}
          />
        </Field>
      </div>
    </FormShell>
  );
}

// ---------------- qna ----------------

export function QnaForm({
  initial,
  submitLabel,
  submitting,
  error,
  onCancel,
  onSubmit,
}: FormProps<QnaSlide>) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [allowUpvote, setAllowUpvote] = useState(initial?.allowUpvote ?? true);
  const [moderation, setModeration] = useState(initial?.moderation ?? false);

  function submit(e: FormEvent) {
    e.preventDefault();
    onSubmit({
      kind: 'qna',
      title,
      description,
      allowUpvote,
      moderation,
      anonymous: true,
      tags: [],
    });
  }

  return (
    <FormShell
      onSubmit={submit}
      onCancel={onCancel}
      submitting={submitting}
      error={error}
      submitLabel={submitLabel}
    >
      <Field label="제목">
        <input
          className={inputCls}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </Field>
      <Field label="설명 (선택)">
        <textarea
          className={inputCls}
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Field>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={allowUpvote}
          onChange={(e) => setAllowUpvote(e.target.checked)}
        />
        업보트 허용 (공감 많은 질문을 상단으로)
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={moderation}
          onChange={(e) => setModeration(e.target.checked)}
        />
        운영자 승인 후 공개
      </label>
    </FormShell>
  );
}

// ---------------- switcher ----------------

export function SlideForm({
  kind,
  initial,
  ...rest
}: {
  kind: SlideKind;
  initial?: Slide;
  submitLabel: string;
  submitting: boolean;
  error: string | null;
  onCancel: () => void;
  onSubmit: (body: CreateSlideRequest) => void;
}) {
  switch (kind) {
    case 'content':
      return <ContentForm initial={initial?.kind === 'content' ? initial : undefined} {...rest} />;
    case 'multiple_choice':
      return (
        <MultipleChoiceForm
          initial={initial?.kind === 'multiple_choice' ? initial : undefined}
          {...rest}
        />
      );
    case 'true_false':
      return (
        <TrueFalseForm
          initial={initial?.kind === 'true_false' ? initial : undefined}
          {...rest}
        />
      );
    case 'short_answer':
      return (
        <ShortAnswerForm
          initial={initial?.kind === 'short_answer' ? initial : undefined}
          {...rest}
        />
      );
    case 'word_cloud':
      return (
        <WordCloudForm
          initial={initial?.kind === 'word_cloud' ? initial : undefined}
          {...rest}
        />
      );
    case 'qna':
      return <QnaForm initial={initial?.kind === 'qna' ? initial : undefined} {...rest} />;
  }
}
