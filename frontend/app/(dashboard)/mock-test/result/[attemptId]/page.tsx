"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { errorMessage } from "@/lib/api/client";
import { mockTestApi } from "@/lib/api/mockTest";
import type { MockAttemptResult, MockPerQuestion } from "@/types";

/**
 * Official PTE task sequence, per section.
 *
 * The backend composes a mock test with `ORDER BY category, type, id`, so
 * questions arrive alphabetically by type — `answer-short-question` first and
 * `read-aloud` last, which is the inverse of the real exam. This table puts the
 * breakdown back into exam order so it reads the way the test was sat.
 *
 * Grouping keys on the category + type *pair*, never `type` alone:
 * `summarize-spoken-test` and `fill-in-the-blanks` each exist under two
 * categories. A type missing from this map falls to the end of its section
 * rather than disappearing.
 */
const PTE_ORDER: Record<string, string[]> = {
  listening: ["summarize-spoken-test", "fill-in-the-blanks", "multiple-choice-single"],
  reading: ["fill-in-the-blanks", "re-order-paragraphs", "multiple-choice-single"],
  speaking: [
    "personal-introduction",
    "read-aloud",
    "repeat-sentence",
    "describe-image",
    "retell-lecture",
    "answer-short-question",
    "summarize-spoken-test",
    "response-to-a-situation",
  ],
  writing: ["summarize-written-text", "essay"],
};

/** The order the four PTE sections are sat in. */
const SECTION_ORDER = ["listening", "reading", "speaking", "writing"];

const SECTION_LABEL: Record<string, string> = {
  listening: "Listening",
  reading: "Reading",
  speaking: "Speaking",
  writing: "Writing",
};

/**
 * Verdicts that carry no information beyond the score chip, so repeating them
 * down the page is just noise. Anything else (`5/7 blanks correct`,
 * `Matched keywords: a, b`, `Partial match (40% similar)`) is shown in full.
 */
const QUIET_FEEDBACK = new Set([
  "Correct answer",
  "Incorrect answer",
  "No answer provided",
  "No response provided",
  "No selection made",
  "No order provided",
  "Unsupported question type",
  "Question not available",
]);

type RowStatus = "full" | "partial" | "none";

const STATUS_LABEL: Record<RowStatus, string> = {
  full: "Full marks",
  partial: "Partly correct",
  none: "No credit",
};

/**
 * `correct` from the backend is `score == max_score`, so partial credit is
 * reported as a plain failure — `5/7 blanks correct` renders exactly like an
 * unanswered question. Deriving three states off the raw score fixes the
 * misleading part without touching the shared scorers.
 */
function statusOf(q: MockPerQuestion): RowStatus {
  if (q.score > 0 && q.score < q.max_score) return "partial";
  if (q.score > 0) return "full";
  return "none";
}

function typeLabel(q: { type: string; title?: string | null }): string {
  if (q.title) return q.title;
  return q.type
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Score bands are an app heuristic, not official PTE grading. */
function bandOf(pct: number): { key: string; label: string } {
  if (pct >= 80) return { key: "strong", label: "Strong" };
  if (pct >= 50) return { key: "developing", label: "Developing" };
  return { key: "needs-work", label: "Needs work" };
}

function formatDuration(startedAt: string, completedAt: string | null): string | null {
  if (!completedAt) return null;
  const start = new Date(startedAt).getTime();
  const end = new Date(completedAt).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return null;
  const mins = Math.round((end - start) / 60000);
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  const rest = mins % 60;
  return rest ? `${hours}h ${rest}m` : `${hours}h`;
}

interface Group {
  key: string;
  label: string;
  questions: Array<{ q: MockPerQuestion; index: number }>;
}

interface Section {
  key: string;
  label: string;
  groups: Group[];
}

export default function MockTestResultPage() {
  const params = useParams<{ attemptId: string }>();
  const router = useRouter();
  const attemptId = Number(params.attemptId);

  const [result, setResult] = useState<MockAttemptResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

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

  /**
   * Group into sections, then into task types in exam order. Questions keep
   * their original relative order inside a type so numbering matches what the
   * user saw while sitting the test.
   */
  const sections = useMemo<Section[]>(() => {
    if (!result) return [];
    const byCategory = new Map<string, Array<{ q: MockPerQuestion; index: number }>>();

    result.per_question.forEach((q, index) => {
      const bucket = byCategory.get(q.category) ?? [];
      bucket.push({ q, index });
      byCategory.set(q.category, bucket);
    });

    const ordered = [
      ...SECTION_ORDER.filter((c) => byCategory.has(c)),
      ...Array.from(byCategory.keys()).filter((c) => !SECTION_ORDER.includes(c)),
    ];

    return ordered.map((category) => {
      const items = byCategory.get(category) ?? [];
      const known = PTE_ORDER[category] ?? [];
      const rank = (t: string) => {
        const i = known.indexOf(t);
        return i === -1 ? known.length : i;
      };

      const byType = new Map<string, Array<{ q: MockPerQuestion; index: number }>>();
      for (const item of items) {
        const bucket = byType.get(item.q.type) ?? [];
        bucket.push(item);
        byType.set(item.q.type, bucket);
      }

      const groups = Array.from(byType.entries())
        .sort((a, b) => rank(a[0]) - rank(b[0]) || a[0].localeCompare(b[0]))
        .map(([type, qs]) => ({
          key: `${category}:${type}`,
          label: typeLabel({ type, title: qs[0].q.title }),
          questions: qs,
        }));

      return { key: category, label: SECTION_LABEL[category] ?? category, groups };
    });
  }, [result]);

  // Default open state: a group opens if anything in it earned credit, so a
  // run of blank rows does not bury the results that matter.
  useEffect(() => {
    if (!result) return;
    const next: Record<string, boolean> = {};
    for (const section of sections) {
      for (const group of section.groups) {
        next[group.key] = group.questions.some(({ q }) => q.score > 0);
      }
    }
    setOpenGroups(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  if (loading) {
    return (
      <div className="mock-result-page">
        <div className="mock-result-inner">
          <div className="mock-result-summary">
            <p className="mock-result-stat-label">Loading results…</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="mock-result-page">
        <div className="mock-result-inner">
          <div className="mock-result-summary">
            <span className="mock-result-eyebrow">Results</span>
            <h1 className="mock-result-title">Unable to load this result</h1>
            <p className="mock-result-row-sub">{error ?? "Please try again."}</p>
            <div className="mock-result-actions">
              <button type="button" className="practice-button" onClick={() => router.push("/mock-test")}>
                Back to Mock Tests
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const total = result.per_question.length;
  const pct = result.max_score ? Math.round((result.total_score / result.max_score) * 100) : 0;
  const fullCount = result.per_question.filter((q) => q.score > 0 && q.score === q.max_score).length;
  const partialCount = result.per_question.filter((q) => q.score > 0 && q.score < q.max_score).length;
  const noneCount = total - fullCount - partialCount;
  const band = bandOf(pct);
  const duration = formatDuration(result.started_at, result.completed_at);

  const sectionStats = sections.map((section) => {
    const qs = section.groups.flatMap((g) => g.questions);
    const score = qs.reduce((sum, { q }) => sum + q.score, 0);
    const max = qs.reduce((sum, { q }) => sum + q.max_score, 0);
    return { ...section, score, max, pct: max ? Math.round((score / max) * 100) : 0 };
  });

  function jumpTo(index: number) {
    const q = result!.per_question[index];
    const key = `${q.category}:${q.type}`;
    setOpenGroups((prev) => ({ ...prev, [key]: true }));
    setCollapsedSections((prev) => ({ ...prev, [q.category]: false }));
    window.requestAnimationFrame(() => {
      document.getElementById(`mr-row-${index}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  return (
    <div className="mock-result-page">
      <div className="mock-result-inner">
        <span className="mock-result-eyebrow">Results</span>
        <h1 className="mock-result-title">{result.test_name}</h1>

        <div className="mock-result-summary">
          <div className="mock-result-stats">
            <div className="mock-result-stat">
              <span className="mock-result-stat-value">
                {result.total_score}
                <small>/{result.max_score}</small>
              </span>
              <span className="mock-result-stat-label">Overall score</span>
            </div>
            <div className="mock-result-stat">
              <span className="mock-result-stat-value">{pct}%</span>
              <span className="mock-result-stat-label">Percentage</span>
            </div>
            <div className="mock-result-stat">
              <span className="mock-result-stat-value">{total}</span>
              <span className="mock-result-stat-label">Questions</span>
            </div>
            <div className="mock-result-stat">
              <span className="mock-result-stat-value">{fullCount}</span>
              <span className="mock-result-stat-label">Full marks</span>
            </div>
            <div className="mock-result-stat">
              <span className="mock-result-stat-value">{partialCount}</span>
              <span className="mock-result-stat-label">Partly correct</span>
            </div>
            <div className="mock-result-stat">
              <span className="mock-result-stat-value">{noneCount}</span>
              <span className="mock-result-stat-label">No credit</span>
            </div>
            {duration && (
              <div className="mock-result-stat">
                <span className="mock-result-stat-value">{duration}</span>
                <span className="mock-result-stat-label">Time taken</span>
              </div>
            )}
          </div>

          <div>
            <span className={`mock-result-band ${band.key}`}>{band.label}</span>
            <span className="mock-result-band-note">
              App estimate, not an official PTE band
            </span>
          </div>

          {sectionStats.length > 0 && (
            <div className="mock-result-sections">
              {sectionStats.map((s) => (
                <div key={s.key} className="mock-result-section-card">
                  <p className="mock-result-section-name">{s.label}</p>
                  <p className="mock-result-section-score">
                    {s.score}
                    <small>/{s.max}</small>
                  </p>
                  <div className="mock-result-section-bar">
                    <span style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mock-result-body">
          <div>
            {sections.length === 0 ? (
              <div className="mock-result-summary">
                <p className="mock-result-empty">
                  This attempt recorded no questions, so there is nothing to break down.
                </p>
              </div>
            ) : (
              sections.map((section) => {
                const collapsed = collapsedSections[section.key] ?? false;
                return (
                  <div key={section.key}>
                    <button
                      type="button"
                      className="mock-result-section-title"
                      onClick={() =>
                        setCollapsedSections((prev) => ({
                          ...prev,
                          [section.key]: !collapsed,
                        }))
                      }
                      aria-expanded={!collapsed}
                    >
                      {section.label}
                      {collapsed && (
                        <span className="mock-result-group-count" style={{ marginLeft: "0.5rem" }}>
                          {section.groups.length} task types
                        </span>
                      )}
                    </button>

                    {!collapsed &&
                      section.groups.map((group) => {
                        const isOpen = openGroups[group.key] ?? false;
                        const scored = group.questions.reduce((sum, { q }) => sum + q.score, 0);
                        const max = group.questions.reduce((sum, { q }) => sum + q.max_score, 0);
                        const groupPct = max ? Math.round((scored / max) * 100) : 0;

                        return (
                          <div
                            key={group.key}
                            className={`mock-result-group${isOpen ? " open" : ""}`}
                          >
                            <button
                              type="button"
                              className="mock-result-group-head"
                              onClick={() =>
                                setOpenGroups((prev) => ({ ...prev, [group.key]: !isOpen }))
                              }
                              aria-expanded={isOpen}
                            >
                              <span className="mock-result-chevron" aria-hidden="true">
                                ▶
                              </span>
                              <span className="mock-result-group-label">{group.label}</span>
                              <span className="mock-result-group-meta">
                                {scored}/{max} · {groupPct}%
                              </span>
                              <span className="mock-result-group-count">
                                {group.questions.length} q
                              </span>
                            </button>

                            {isOpen && (
                              <div className="mock-result-group-body">
                                {group.questions.map(({ q, index }) => {
                                  const status = statusOf(q);
                                  const quiet = !q.feedback || QUIET_FEEDBACK.has(q.feedback);
                                  return (
                                    <div
                                      key={q.question_id}
                                      id={`mr-row-${index}`}
                                      className="mock-result-row"
                                    >
                                      <span className="mock-result-row-num">
                                        {index + 1}
                                      </span>
                                      <div className="mock-result-row-copy">
                                        <p className="mock-result-row-title">
                                          {typeLabel(q)}
                                        </p>
                                        <p
                                          className={`mock-result-row-sub${quiet ? " is-quiet" : ""}`}
                                        >
                                          {quiet ? "No feedback for this attempt" : q.feedback}
                                        </p>
                                      </div>
                                      <span className={`mock-result-chip ${status}`}>
                                        {STATUS_LABEL[status]}
                                      </span>
                                      <span className="mock-result-row-score">
                                        {q.score}
                                        <small>/{q.max_score}</small>
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                );
              })
            )}

            <div className="mock-result-actions">
              <button type="button" className="practice-button" onClick={() => router.push("/mock-test")}>
                Back to Mock Tests
              </button>
              <button
                type="button"
                className="practice-button"
                style={{ background: "#fff", color: "var(--brand-blue)" }}
                onClick={() => router.push("/practice")}
              >
                Practise weak spots
              </button>
            </div>
          </div>

          {total > 0 && (
            <aside className="mock-result-map-card">
              <p className="mock-result-map-title">Question map</p>
              <div className="mock-result-map-grid">
                {result.per_question.map((q, index) => (
                  <button
                    key={q.question_id}
                    type="button"
                    className={`mock-result-map-cell ${statusOf(q)}`}
                    onClick={() => jumpTo(index)}
                    aria-label={`Go to question ${index + 1}: ${STATUS_LABEL[statusOf(q)]}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <div className="mock-result-map-legend">
                <div>
                  <span className="mock-result-map-swatch full" /> Full marks ({fullCount})
                </div>
                <div>
                  <span className="mock-result-map-swatch partial" /> Partly correct ({partialCount})
                </div>
                <div>
                  <span className="mock-result-map-swatch none" /> No credit ({noneCount})
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}