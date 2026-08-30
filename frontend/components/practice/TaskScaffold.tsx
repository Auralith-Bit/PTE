"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { errorMessage } from "@/lib/api/client";
import { questionsApi } from "@/lib/api/questions";
import type { AnswerResult, Question } from "@/types";

export type ScaffoldCategory = "writing" | "reading" | "listening";

// ══════════════════════════════════════════════
// Metadata
// ══════════════════════════════════════════════
const TASKS: Record<ScaffoldCategory, { id: string; label: string }[]> = {
  writing: [
    { id: "summarize-written-text", label: "Summarize Written Text" },
    { id: "essay", label: "Essay" },
  ],
  reading: [
    { id: "fill-in-the-blanks", label: "Fill in the Blanks" },
    { id: "re-order-paragraphs", label: "Re-order Paragraphs" },
    { id: "multiple-choice-single", label: "Multiple Choice, Single Answer" },
  ],
  listening: [
    { id: "summarize-spoken-test", label: "Summarize Spoken Text" },
    { id: "multiple-choice-single", label: "Multiple Choice, Single Answer" },
    { id: "fill-in-the-blanks", label: "Fill in the Blanks" },
  ],
};

function typeLabel(category: ScaffoldCategory, taskId: string): string {
  return TASKS[category].find((t) => t.id === taskId)?.label ?? taskId
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function categoryTitle(category: ScaffoldCategory): string {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

// ══════════════════════════════════════════════
// Data loading
// ══════════════════════════════════════════════
function useQuestions(category: ScaffoldCategory, taskId: string) {
  const [state, setState] = useState<{
    loading: boolean;
    error: string | null;
    questions: Question[];
  }>({ loading: true, error: null, questions: [] });
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState({ loading: true, error: null, questions: [] });
    questionsApi
      .list(category, { type: taskId, limit: 100 })
      .then((res) => {
        if (!cancelled) setState({ loading: false, error: null, questions: res.items });
      })
      .catch((err) => {
        if (!cancelled) setState({ loading: false, error: errorMessage(err), questions: [] });
      });
    return () => {
      cancelled = true;
    };
  }, [category, taskId, nonce]);

  return { ...state, retry: () => setNonce((n) => n + 1) };
}

// Submits a single question and returns the score result
function useSubmit() {
  const [state, setState] = useState<{
    submitting: boolean;
    error: string | null;
    result: AnswerResult | null;
  }>({ submitting: false, error: null, result: null });

  async function submit(
    category: ScaffoldCategory,
    question: Question,
    answer: Record<string, unknown>,
  ): Promise<AnswerResult | null> {
    setState((s) => ({ ...s, submitting: true, error: null }));
    try {
      const result = await questionsApi.submit(category, {
        question_id: question.id,
        answer,
      });
      setState({ submitting: false, error: null, result });
      return result;
    } catch (err) {
      setState((s) => ({ ...s, submitting: false, error: errorMessage(err) }));
      return null;
    }
  }

  return { ...state, submit };
}

// ══════════════════════════════════════════════
// Icons
// ══════════════════════════════════════════════
function XIcon() {
  return <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" /></svg>;
}
function ChevronLeftIcon() {
  return <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>;
}
function InfoIcon() {
  return <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8v.01" /></svg>;
}
function SpeakerIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}
function ListIcon() {
  return <svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h10" /></svg>;
}
function DocIcon() {
  return <svg viewBox="0 0 24 24"><path d="M6 2h9l5 5v15H6z" /><path d="M14 2v6h6" /></svg>;
}
function CheckIcon() {
  return <svg viewBox="0 0 24 24"><path d="M5 12l5 5 9-11" /></svg>;
}
function OrderIcon() {
  return <svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h10" /></svg>;
}

const TASK_ICONS: Record<string, () => React.ReactNode> = {
  "summarize-written-text": DocIcon,
  "summarize-spoken-test": SpeakerIcon,
  essay: DocIcon,
  "fill-in-the-blanks": ListIcon,
  "re-order-paragraphs": OrderIcon,
  "multiple-choice-single": CheckIcon,
};

// ══════════════════════════════════════════════
// Layout pieces (reuse speaking task CSS)
// ══════════════════════════════════════════════
function TaskTopBar({ category, taskId }: { category: ScaffoldCategory; taskId: string }) {
  return (
    <div className="task-topbar">
      <div className="task-topbar-left">
        <Link href="/practice" className="task-tab">Practice</Link>
        <span className="task-tab-sep">›</span>
        <Link href={`/practice/${category}`} className="task-tab">{categoryTitle(category)}</Link>
        <span className="task-tab-sep">›</span>
        <span className="task-tab active">{typeLabel(category, taskId)}</span>
      </div>
      <Link href={`/practice/${category}`} className="task-exit-btn">
        <XIcon /> Exit Practice
      </Link>
    </div>
  );
}

function TaskSidebar({
  category,
  activeTaskId,
  questionCount,
  total,
  answered,
}: {
  category: ScaffoldCategory;
  activeTaskId: string;
  questionCount: number;
  total: number;
  answered: number;
}) {
  const percent = total ? Math.round((answered / total) * 100) : 0;
  return (
    <aside className="task-sidebar">
      <h2 className="task-sidebar-title">Question Type</h2>
      <ul className="task-type-list">
        {TASKS[category].map((task) => {
          const isActive = task.id === activeTaskId;
          return (
            <li key={task.id}>
              <Link
                href={`/practice/${category}/${task.id}`}
                className={`task-type-item${isActive ? " active" : ""}`}
              >
                <span className="task-type-icon"><span>{taskIcon(task.id)}</span></span>
                <span className="task-type-label">{task.label}</span>
                <span className="task-type-count">
                  {isActive ? `${questionCount}/${total}` : `0/${total}`}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="task-progress-card">
        <h3>Your Progress</h3>
        <div className="task-progress-track">
          <div className="task-progress-fill" style={{ width: `${percent}%` }} />
        </div>
        <span className="task-progress-label">{percent}% Completed</span>
      </div>
    </aside>
  );
}

function taskIcon(taskId: string): React.ReactNode {
  const Icon = TASK_ICONS[taskId] ?? DocIcon;
  return <Icon />;
}

function TaskFooterNav({
  current,
  total,
  onPrevious,
  onNext,
}: {
  current: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <div className="task-footer-nav">
      <button type="button" className="task-nav-btn" onClick={onPrevious} disabled={current === 1}>
        <ChevronLeftIcon /> Previous
      </button>
      <span className="task-question-count">Question {current} of {total}</span>
      <button type="button" className="practice-button task-nav-btn-next" onClick={onNext}>
        Next <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════
// Result / feedback card
// ══════════════════════════════════════════════
function ResultCard({ result }: { result: AnswerResult }) {
  return (
    <div className={`task-result-card${result.correct ? " correct" : " incorrect"}`}>
      <div className="task-result-score">
        {result.score}
        <span className="task-result-max">/{result.max_score}</span>
      </div>
      <div className="task-result-copy">
        <p className="task-result-title">
          {result.correct ? "Great work!" : "Keep practising"}
        </p>
        <p className="task-result-feedback">{result.feedback}</p>
      </div>
    </div>
  );
}

function SubmitError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p className="task-submit-error">
      <span className="task-submit-error-icon">⚠</span> {message}
    </p>
  );
}

function SubmitButton({
  disabled,
  submitting,
  label,
  onPress,
}: {
  disabled: boolean;
  submitting: boolean;
  label?: string;
  onPress: () => void;
}) {
  return (
    <div className="task-submit-row">
      <button
        type="button"
        className="practice-button task-submit-btn"
        onClick={onPress}
        disabled={disabled || submitting}
      >
        {submitting ? "Submitting…" : (label ?? "Submit Answer")}
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════
// Question renderers
// ══════════════════════════════════════════════
function renderPassageWithBlanks(
  text: string,
  options: Record<string, string[]>,
  values: Record<string, string>,
  onChange: (key: string, value: string) => void,
) {
  const parts = text.split(/(\(\d+\))/g);
  return parts.map((part, i) => {
    const m = part.match(/^\((\d+)\)$/);
    if (!m) return <span key={i}>{part}</span>;
    const key = m[1];
    const opts = options[key] ?? [];
    return (
      <select
        key={i}
        className="task-blank-select"
        value={values[key] ?? ""}
        onChange={(e) => onChange(key, e.target.value)}
      >
        <option value="" disabled>Select…</option>
        {opts.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    );
  });
}

function TextTask({
  category,
  question,
  instruction,
  placeholder,
  isListening,
  onAnswered,
}: {
  category: ScaffoldCategory;
  question: Question;
  instruction: string;
  placeholder: string;
  isListening?: boolean;
  onAnswered: () => void;
}) {
  const [value, setValue] = useState("");
  const submitApi = useSubmit();

  function handleSubmit() {
    if (!value.trim()) return;
    submitApi
      .submit(category, question, { response: value })
      .then((r) => { if (r) onAnswered(); });
  }

  const content = question.content as Record<string, unknown>;
  const passage = isListening
    ? String(content.transcript ?? "")
    : String(content.passage ?? "");

  return (
    <div className="task-text-submit">
      {isListening ? (
        <>
          <h3 className="task-block-label">Audio / Transcript</h3>
          <div className="task-audio-box">
            <button type="button" className="task-mic-button" aria-label="Play audio">
              <SpeakerIcon />
            </button>
            <p className="task-recording-title">Audio playback coming soon.</p>
          </div>
          <div className="task-question-box">
            <p style={{ margin: 0, lineHeight: 1.7 }}>{passage}</p>
          </div>
        </>
      ) : (
        <h3 className="task-block-label">{instruction}</h3>
      )}

      {!isListening && (
        <div className="task-question-box">
          <p style={{ margin: 0, lineHeight: 1.7 }}>{passage || String(content.prompt ?? "")}</p>
        </div>
      )}

      <textarea
        className="task-answer-textarea"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        rows={isListening ? 6 : 8}
      />
      <SubmitError message={submitApi.error} />
      {submitApi.result ? (
        <ResultCard result={submitApi.result} />
      ) : (
        <SubmitButton
          disabled={!value.trim()}
          submitting={submitApi.submitting}
          onPress={handleSubmit}
        />
      )}
    </div>
  );
}

function FillBlanksTask({
  category,
  question,
  instruction,
  isListening,
  onAnswered,
}: {
  category: ScaffoldCategory;
  question: Question;
  instruction: string;
  isListening?: boolean;
  onAnswered: () => void;
}) {
  const content = question.content as Record<string, unknown>;
  const text = String(isListening ? content.transcript ?? "" : content.passage ?? "");
  const options = (content.options ?? {}) as Record<string, string[]>;
  const [values, setValues] = useState<Record<string, string>>({});
  const submitApi = useSubmit();

  function handleSubmit() {
    submitApi
      .submit(category, question, { answers: values })
      .then((r) => { if (r) onAnswered(); });
  }

  const blanks = (Object.keys(options)).length;
  const allFilled = blanks > 0 && Object.keys(values).length === blanks;

  return (
    <div className="task-text-submit">
      <h3 className="task-block-label">{instruction}</h3>
      {isListening && (
        <div className="task-audio-box">
          <button type="button" className="task-mic-button" aria-label="Play audio">
            <SpeakerIcon />
          </button>
          <p className="task-recording-title">Audio playback coming soon.</p>
        </div>
      )}
      <div className="task-question-box task-blanks-text">
        {renderPassageWithBlanks(text, options, values, (k, v) =>
          setValues((s) => ({ ...s, [k]: v })),
        )}
      </div>
      <SubmitError message={submitApi.error} />
      {submitApi.result ? (
        <ResultCard result={submitApi.result} />
      ) : (
        <SubmitButton
          disabled={!allFilled}
          submitting={submitApi.submitting}
          onPress={handleSubmit}
        />
      )}
    </div>
  );
}

function ReorderTask({
  category,
  question,
  onAnswered,
}: {
  category: ScaffoldCategory;
  question: Question;
  onAnswered: () => void;
}) {
  const content = question.content as Record<string, unknown>;
  const paragraphs = (content.paragraphs ?? []) as string[];
  const [order, setOrder] = useState<number[]>(paragraphs.map((_, i) => i));
  const submitApi = useSubmit();

  function move(index: number, dir: -1 | 1) {
    setOrder((prev) => {
      const target = index + dir;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      const t = next[index];
      next[index] = next[target];
      next[target] = t;
      return next;
    });
  }

  function handleSubmit() {
    submitApi
      .submit(category, question, { order })
      .then((r) => { if (r) onAnswered(); });
  }

  return (
    <div className="task-text-submit">
      <h3 className="task-block-label">Arrange the paragraphs in the correct order</h3>
      <div className="task-reorder-list">
        {order.map((paraIndex, pos) => (
          <div className="task-reorder-item" key={`${paraIndex}-${pos}`}>
            <span className="task-reorder-pos">{pos + 1}</span>
            <p className="task-reorder-text">{paragraphs[paraIndex]}</p>
            <div className="task-reorder-controls">
              <button
                type="button"
                className="task-reorder-btn"
                onClick={() => move(pos, -1)}
                disabled={pos === 0}
                aria-label="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                className="task-reorder-btn"
                onClick={() => move(pos, 1)}
                disabled={pos === order.length - 1}
                aria-label="Move down"
              >
                ↓
              </button>
            </div>
          </div>
        ))}
      </div>
      <SubmitError message={submitApi.error} />
      {submitApi.result ? (
        <ResultCard result={submitApi.result} />
      ) : (
        <SubmitButton
          disabled={order.length === 0}
          submitting={submitApi.submitting}
          onPress={handleSubmit}
        />
      )}
    </div>
  );
}

function MultipleChoiceTask({
  category,
  question,
  instruction,
  isListening,
  onAnswered,
}: {
  category: ScaffoldCategory;
  question: Question;
  instruction: string;
  isListening?: boolean;
  onAnswered: () => void;
}) {
  const content = question.content as Record<string, unknown>;
  const options = (content.options ?? []) as string[];
  const [selected, setSelected] = useState<number | null>(null);
  const submitApi = useSubmit();

  function handleSubmit() {
    if (selected === null) return;
    submitApi
      .submit(category, question, { selected })
      .then((r) => { if (r) onAnswered(); });
  }

  return (
    <div className="task-text-submit">
      {isListening && (
        <>
          <h3 className="task-block-label">Audio / Transcript</h3>
          <div className="task-audio-box">
            <button type="button" className="task-mic-button" aria-label="Play audio">
              <SpeakerIcon />
            </button>
            <p className="task-recording-title">Audio playback coming soon.</p>
          </div>
          <div className="task-question-box">
            <p style={{ margin: "0 0 0.5rem", fontWeight: 800, fontSize: "1.05rem" }}>
              {String(content.title ?? "")}
            </p>
            <p style={{ margin: 0, lineHeight: 1.7 }}>{String(content.transcript ?? "")}</p>
          </div>
        </>
      )}
      {!isListening && (
        <div className="task-question-box">
          <p style={{ margin: 0, lineHeight: 1.7 }}>{String(content.passage ?? "")}</p>
        </div>
      )}

      <h3 className="task-block-label">{instruction}</h3>
      <div className="task-mc-list">
        {options.map((opt, i) => (
          <label
            key={i}
            className={`task-mc-option${selected === i ? " selected" : ""}`}
          >
            <input
              type="radio"
              name={`mc-${question.id}`}
              checked={selected === i}
              onChange={() => setSelected(i)}
            />
            <span className="task-mc-letter">{String.fromCharCode(65 + i)}</span>
            <span className="task-mc-text">{opt}</span>
          </label>
        ))}
      </div>
      <SubmitError message={submitApi.error} />
      {submitApi.result ? (
        <ResultCard result={submitApi.result} />
      ) : (
        <SubmitButton
          disabled={selected === null}
          submitting={submitApi.submitting}
          onPress={handleSubmit}
        />
      )}
    </div>
  );
}

// ══════════════════════════════════════════════
// Dispatcher — renders the right input for a question type
// ══════════════════════════════════════════════
function QuestionView({
  category,
  taskId,
  question,
  onAnswered,
}: {
  category: ScaffoldCategory;
  taskId: string;
  question: Question;
  onAnswered: () => void;
}) {
  if (taskId === "summarize-written-text" || taskId === "essay") {
    return (
      <TextTask
        category={category}
        question={question}
        instruction={
          taskId === "essay"
            ? "Write an essay on the topic below"
            : "Read the passage and write a one-sentence summary"
        }
        placeholder={
          taskId === "essay"
            ? "Write your essay here…"
            : "Write your one-sentence summary here…"
        }
        onAnswered={onAnswered}
      />
    );
  }
  if (taskId === "summarize-spoken-test") {
    return (
      <TextTask
        category={category}
        question={question}
        instruction="Write a one-sentence summary of what you hear"
        placeholder="Write your summary here…"
        isListening
        onAnswered={onAnswered}
      />
    );
  }
  if (taskId === "fill-in-the-blanks") {
    const isListening = category === "listening";
    return (
      <FillBlanksTask
        category={category}
        question={question}
        instruction={isListening ? "Fill in the missing words as you listen" : "Fill in the missing words"}
        isListening={isListening}
        onAnswered={onAnswered}
      />
    );
  }
  if (taskId === "re-order-paragraphs") {
    return <ReorderTask category={category} question={question} onAnswered={onAnswered} />;
  }
  if (taskId === "multiple-choice-single") {
    return (
      <MultipleChoiceTask
        category={category}
        question={question}
        instruction="Choose the single best answer"
        isListening={category === "listening"}
        onAnswered={onAnswered}
      />
    );
  }
  return <p className="task-recording-sub">This question type is not supported yet.</p>;
}

// ══════════════════════════════════════════════
// Main generic task page
// ══════════════════════════════════════════════
export default function TaskScaffold({
  category,
  taskId,
}: {
  category: "writing" | "reading" | "listening";
  taskId: string;
}) {
  const { loading, error, questions, retry } = useQuestions(category, taskId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answeredSet, setAnsweredSet] = useState<Set<number>>(new Set());

  const supported = TASKS[category].some((t) => t.id === taskId);
  const total = questions.length;
  const current = questions[Math.min(currentIndex, Math.max(0, total - 1))];

  function markAnswered() {
    setAnsweredSet((prev) => new Set(prev).add(currentIndex));
  }

  function goToPrevious() {
    setCurrentIndex((i) => Math.max(0, i - 1));
  }
  function goToNext() {
    setCurrentIndex((i) => Math.min(total - 1, i + 1));
  }

  if (!supported) {
    return (
      <div className="task-page">
        <TaskTopBar category={category} taskId={taskId} />
        <div className="task-coming-soon">
          <h1>{typeLabel(category, taskId)}</h1>
          <p>This task type is coming soon.</p>
          <Link href={`/practice/${category}`} className="practice-button">
            Back to {categoryTitle(category)}
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="task-page">
        <TaskTopBar category={category} taskId={taskId} />
        <div className="task-coming-soon">
          <h1>{typeLabel(category, taskId)}</h1>
          <p>Loading questions…</p>
        </div>
      </div>
    );
  }

  if (error || !current) {
    return (
      <div className="task-page">
        <TaskTopBar category={category} taskId={taskId} />
        <div className="task-coming-soon">
          <h1>{typeLabel(category, taskId)}</h1>
          <p>{error ?? "No questions available for this task type yet."}</p>
          <button type="button" className="task-link-button" onClick={retry}>
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="task-page">
      <TaskTopBar category={category} taskId={taskId} />
      <div className="task-layout">
        <TaskSidebar
          category={category}
          activeTaskId={taskId}
          questionCount={currentIndex + 1}
          total={total}
          answered={answeredSet.size}
        />
        <section className="task-main">
          <div className="task-main-header">
            <span className="task-main-header-icon">
              <span>{taskIcon(taskId)}</span>
            </span>
            <h1>{typeLabel(category, taskId)}</h1>
          </div>
          <p className="task-main-sub">
            Question {currentIndex + 1} of {total}
          </p>
          <QuestionView
            category={category}
            taskId={taskId}
            question={current}
            onAnswered={markAnswered}
          />
          <TaskFooterNav
            current={currentIndex + 1}
            total={total}
            onPrevious={goToPrevious}
            onNext={goToNext}
          />
        </section>
        <aside className="task-side-right">
          <div className="task-info-card">
            <h3 className="task-info-title"><InfoIcon /> Instructions</h3>
            <ul className="task-bullet-list">
              <li>
                <span className="task-bullet-icon"><InfoIcon /></span>
                Read the prompt carefully and complete the answer.
              </li>
              <li>
                <span className="task-bullet-icon"><InfoIcon /></span>
                Submit your answer to get instant feedback and a score.
              </li>
              <li>
                <span className="task-bullet-icon"><InfoIcon /></span>
                Use the navigation to move between questions.
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
