"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { errorMessage } from "@/lib/api/client";
import { mockTestApi } from "@/lib/api/mockTest";
import type { MockAttemptResult } from "@/types";

function categoryLabel(cat: string): string {
  return cat.charAt(0).toUpperCase() + cat.slice(1);
}

function typeLabel(q: { type: string; title?: string | null }): string {
  return q.title ?? q.type.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export default function MockTestResultPage() {
  const params = useParams<{ attemptId: string }>();
  const router = useRouter();
  const attemptId = Number(params.attemptId);

  const [result, setResult] = useState<MockAttemptResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    mockTestApi
      .result(attemptId)
      .then((data) => {
        if (cancelled) return;
        setResult(data);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(errorMessage(err));
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [attemptId]);

  if (loading) {
    return (
      <div className="task-page">
        <div className="task-coming-soon"><h1>Loading results…</h1></div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="task-page">
        <div className="task-coming-soon">
          <h1>Results</h1>
          <p>{error ?? "Unable to load this result."}</p>
          <button type="button" className="practice-button" onClick={() => router.push("/mock-test")}>Back to Mock Tests</button>
        </div>
      </div>
    );
  }

  const correctCount = result.per_question.filter((q) => q.correct).length;
  const pct = result.max_score ? Math.round((result.total_score / result.max_score) * 100) : 0;

  return (
    <div className="task-page">
      <div className="task-topbar">
        <div className="task-topbar-left">
          <button type="button" className="task-tab" onClick={() => router.push("/mock-test")}>Mock Test</button>
          <span className="task-tab-sep">›</span>
          <span className="task-tab active">Results</span>
        </div>
        <button type="button" className="task-exit-btn" onClick={() => router.push("/mock-test")}>✕ Close</button>
      </div>

      <div className="task-layout" style={{ maxWidth: 960, margin: "0 auto", padding: "2rem 1.5rem" }}>
        <div className="task-result-card" style={{ flexDirection: "column", alignItems: "center", textAlign: "center", padding: "2rem" }}>
          <h1 style={{ margin: 0 }}>{result.test_name} — Results</h1>
          <div className="task-result-score" style={{ fontSize: "3rem" }}>
            {result.total_score}
            <span className="task-result-max">/{result.max_score}</span>
          </div>
          <p className="task-result-feedback">{pct}% · {correctCount} correct of {result.per_question.length} questions</p>
          <button type="button" className="practice-button task-submit-btn" onClick={() => router.push("/mock-test")}>Back to Mock Tests</button>
        </div>

        <h2 style={{ margin: "2rem 0 1rem" }}>Question Breakdown</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {result.per_question.map((q, i) => (
            <div key={q.question_id} className={`task-result-card${q.correct ? " correct" : " incorrect"}`} style={{ alignItems: "center" }}>
              <div className="task-result-score">
                {q.score}<span className="task-result-max">/{q.max_score}</span>
              </div>
              <div className="task-result-copy">
                <p className="task-result-title">
                  <span className="task-status-pill" style={{ marginRight: "0.5rem" }}>{categoryLabel(q.category)}</span>
                  Q{i + 1} · {typeLabel(q)}
                </p>
                <p className="task-result-feedback">{q.feedback}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
