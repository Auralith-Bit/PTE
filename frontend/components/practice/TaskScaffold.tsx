"use client";

import Link from "next/link";

const TASK_LABELS: Record<string, string> = {
  "summarize-spoken-test": "Summarize Spoken Text",
  "multiple-choice-multiple-answers": "Multiple Choice, Multiple Answers",
  "multiple-choice-single-answer": "Multiple Choice, Single Answer",
  "fill-in-the-blanks": "Fill in the Blanks",
  "highlight-correct-summary": "Highlight Correct Summary",
};

function XIcon() {
  return <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" /></svg>;
}

export default function TaskScaffold({
  category,
  taskId,
}: {
  category: "reading" | "listening" | "writing";
  taskId: string;
}) {
  const label =
    TASK_LABELS[taskId] ??
    taskId
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  return (
    <div className="task-page">
      <div className="task-topbar">
        <div className="task-topbar-left">
          <Link href="/practice" className="task-tab">Practice</Link>
          <span className="task-tab-sep">›</span>
          <Link href={`/practice/${category}`} className="task-tab">
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Link>
          <span className="task-tab-sep">›</span>
          <span className="task-tab active">{label}</span>
        </div>
        <Link href={`/practice/${category}`} className="task-exit-btn">
          <XIcon /> Exit Practice
        </Link>
      </div>
      <div className="task-coming-soon">
        <h1>{label}</h1>
        <p>This task type is coming soon.</p>
        <Link href={`/practice/${category}`} className="practice-button">
          Back to {category.charAt(0).toUpperCase() + category.slice(1)}
        </Link>
      </div>
    </div>
  );
}
