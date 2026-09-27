"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Footer from "@/components/common/Footer";
import {
  emptyAnswerFor,
  QuestionRenderer,
  stateIsAnswered,
  toSubmissionPayload,
} from "@/components/mockTest/MockQuestionRenderer";
import { errorMessage } from "@/lib/api/client";
import { mockTestApi } from "@/lib/api/mockTest";
import type { AnswerValue } from "@/components/mockTest/MockQuestionRenderer";
import type { MockAttemptStart, MockQuestion } from "@/types";

function typeLabel(q: MockQuestion): string {
  return String(q.title ?? q.type.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "));
}

function categoryLabel(cat: string): string {
  return cat.charAt(0).toUpperCase() + cat.slice(1);
}

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const s = Math.floor(totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function MockTestTakePage() {
  const params = useParams<{ testId: string }>();
  const router = useRouter();
  const testId = Number(params.testId);

  const [attempt, setAttempt] = useState<MockAttemptStart | null>(null);
  const [answers, setAnswers] = useState<Record<number, AnswerValue>>({});
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [startError, setStartError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    mockTestApi
      .start(testId)
      .then((data) => {
        if (cancelled) return;
        setAttempt(data);
        setRemaining(data.duration_minutes * 60);
        const initial: Record<number, AnswerValue> = {};
        for (const q of data.questions) initial[q.id] = emptyAnswerFor(q);
        setAnswers(initial);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setStartError(errorMessage(err));
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [testId]);

  useEffect(() => {
    if (remaining === null || remaining <= 0) return;
    const timer = setInterval(() => setRemaining((r) => (r === null || r <= 0 ? r : r - 1)), 1000);
    return () => clearInterval(timer);
  }, [remaining]);

  const questions: MockQuestion[] = useMemo(() => attempt?.questions ?? [], [attempt]);
  const total = questions.length;
  const currentQuestion = questions[current];
  const answeredCount = Object.values(answers).filter((a) => stateIsAnswered(a)).length;

  function setAnswer(id: number, value: AnswerValue) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  async function finish() {
    if (!attempt) return;
    if (submitting) return;
    setSubmitting(true);
    const payload: Record<string, Record<string, unknown>> = {};
    for (const q of attempt.questions) {
      const a = answers[q.id];
      if (a && stateIsAnswered(a)) payload[String(q.id)] = toSubmissionPayload(a);
    }
    try {
      await mockTestApi.submit(attempt.attempt_id, payload);
      router.push(`/mock-test/result/${attempt.attempt_id}`);
    } catch (err) {
      setSubmitting(false);
      setStartError(errorMessage(err));
    }
  }

  if (loading) {
    return (
      <div className="task-page">
        <div className="task-coming-soon"><h1>Starting mock test…</h1><p>Preparing your questions.</p></div>
      </div>
    );
  }

  if (startError || !attempt || !currentQuestion) {
    return (
      <div className="task-page">
        <div className="task-coming-soon">
          <h1>{attempt?.name ?? "Mock Test"}</h1>
          <p>{startError ?? "No questions available for this mock test yet."}</p>
          <button type="button" className="practice-button" onClick={() => router.push("/mock-test")}>
            Back to Mock Tests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="task-page">
      <div className="task-topbar">
        <div className="task-topbar-left">
          <button type="button" className="task-tab" onClick={() => router.push("/mock-test")}>Mock Test</button>
          <span className="task-tab-sep">›</span>
          <span className="task-tab active">{attempt.name}</span>
        </div>
        <div className="task-timer" style={{ marginRight: "1rem" }}>
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>
          {formatTime(remaining ?? 0)}
        </div>
        <button type="button" className="task-exit-btn" onClick={() => router.push("/mock-test")}>✕ Exit</button>
      </div>

      <div className="task-layout">
        <aside className="task-sidebar">
          <h2 className="task-sidebar-title">Your Progress</h2>
          <div className="task-progress-card">
            <h3>{answeredCount} of {total} answered</h3>
            <div className="task-progress-track">
              <div className="task-progress-fill" style={{ width: `${total ? Math.round((answeredCount / total) * 100) : 0}%` }} />
            </div>
            <span className="task-progress-label">{total ? Math.round((answeredCount / total) * 100) : 0}% Completed</span>
          </div>
          <button type="button" className="practice-button task-submit-btn" onClick={finish} disabled={submitting}>
            {submitting ? "Submitting…" : "Finish & Submit"}
          </button>
        </aside>

        <section className="task-main">
          <div className="task-main-header">
            <span className="task-main-header-icon"><span>{currentQuestion.type.charAt(0).toUpperCase()}</span></span>
            <h1>{typeLabel(currentQuestion)}</h1>
            <span className="task-status-pill">{categoryLabel(currentQuestion.category)}</span>
          </div>
          <p className="task-main-sub">Question {current + 1} of {total}</p>
          {currentQuestion && (
            <QuestionRenderer
              question={currentQuestion}
              value={answers[currentQuestion.id] ?? emptyAnswerFor(currentQuestion)}
              onChange={(v) => setAnswer(currentQuestion.id, v)}
            />
          )}
          <div className="task-footer-nav">
            <button type="button" className="task-nav-btn" onClick={() => setCurrent((i) => Math.max(0, i - 1))} disabled={current === 0}>‹ Previous</button>
            <span className="task-question-count">Question {current + 1} of {total}</span>
            {current < total - 1 ? (
              <button type="button" className="practice-button task-nav-btn-next" onClick={() => setCurrent((i) => Math.min(total - 1, i + 1))}>Next →</button>
            ) : (
              <button type="button" className="practice-button task-nav-btn-next" onClick={finish} disabled={submitting}>Submit Mock Test</button>
            )}
          </div>
        </section>

        <aside className="task-side-right">
          <div className="task-info-card">
            <h3 className="task-info-title">Question Progress</h3>
            <div className="task-progress-grid">
              {questions.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`task-progress-box${i === current ? " active" : ""}${stateIsAnswered(answers[questions[i].id]) ? " recorded" : ""}`}
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to question ${i + 1}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button type="button" className="task-progress-view-all" onClick={finish} disabled={submitting}>
              {submitting ? "Submitting…" : `Finish test (${answeredCount}/${total} answered)`}
            </button>
          </div>
        </aside>
      </div>
      <Footer />
    </div>
  );
}
