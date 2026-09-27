"use client";

import { useState } from "react";

import type { MockQuestion } from "@/types";

// Answer value types that this renderer manages.
export type AnswerValue =
  | { type: "text"; value: string }
  | { type: "blanks"; value: Record<string, string> }
  | { type: "order"; value: number[] }
  | { type: "mc"; value: number | null };

export function emptyAnswerFor(q: MockQuestion): AnswerValue {
  if (q.type === "fill-in-the-blanks") return { type: "blanks", value: {} };
  if (q.type === "re-order-paragraphs") return { type: "order", value: [] };
  if (q.type === "multiple-choice-single") return { type: "mc", value: null };
  return { type: "text", value: "" };
}

export function toSubmissionPayload(value: AnswerValue): Record<string, unknown> {
  switch (value.type) {
    case "blanks":
      return { answers: value.value };
    case "order":
      return { order: value.value };
    case "mc":
      return { selected: value.value };
    default:
      return { response: value.value };
  }
}

function speaker(): React.ReactNode {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" fill="none" stroke="currentColor" />
    </svg>
  );
}

function renderBlanks(
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

function stateIsAnswered(value: AnswerValue): boolean {
  if (value.type === "text") return value.value.trim().length > 0;
  if (value.type === "blanks") return Object.keys(value.value).length > 0;
  if (value.type === "order") return value.value.length > 0;
  return value.value !== null;
}

function QuestionRenderer({
  question,
  value,
  onChange,
}: {
  question: MockQuestion;
  value: AnswerValue;
  onChange: (value: AnswerValue) => void;
}) {
  const content = question.content as Record<string, unknown>;
  const passage = String(
    content.passage ?? content.transcript ?? content.text ?? content.prompt ?? content.question ?? "",
  );
  const instruction = question.instructions ?? String(content.instruction ?? "");

  if (question.type === "fill-in-the-blanks") {
    const text = String(content.passage ?? content.transcript ?? "");
    const options = (content.options ?? {}) as Record<string, string[]>;
    const v = value.type === "blanks" ? value.value : {};
    return (
      <div className="task-text-submit">
        {(question.category === "listening" || !!content.transcript) && (
          <div className="task-audio-box">
            <button type="button" className="task-mic-button" aria-label="Play audio">{speaker()}</button>
            <p className="task-recording-title">Audio playback coming soon.</p>
          </div>
        )}
        {instruction && <h3 className="task-block-label">{instruction}</h3>}
        <div className="task-question-box task-blanks-text">
          {renderBlanks(
            text,
            options,
            v,
            (k, val) => onChange({ type: "blanks", value: { ...v, [k]: val } }),
          )}
        </div>
      </div>
    );
  }

  if (question.type === "re-order-paragraphs") {
    const paragraphs = (content.paragraphs ?? []) as string[];
    const isFirst = value.type !== "order" || value.value.length === 0;
    const order = isFirst ? paragraphs.map((_, i) => i) : value.value;
    const move = (index: number, dir: -1 | 1) => {
      const target = index + dir;
      if (target < 0 || target >= order.length) return;
      const next = [...order];
      const t = next[index];
      next[index] = next[target];
      next[target] = t;
      onChange({ type: "order", value: next });
    }
    return (
      <div className="task-text-submit">
        {instruction && <h3 className="task-block-label">{instruction}</h3>}
        <div className="task-reorder-list">
          {order.map((paraIndex, pos) => (
            <div className="task-reorder-item" key={`${paraIndex}-${pos}`}>
              <span className="task-reorder-pos">{pos + 1}</span>
              <p className="task-reorder-text">{paragraphs[paraIndex]}</p>
              <div className="task-reorder-controls">
                <button type="button" className="task-reorder-btn" onClick={() => move(pos, -1)} disabled={pos === 0} aria-label="Move up">↑</button>
                <button type="button" className="task-reorder-btn" onClick={() => move(pos, 1)} disabled={pos === order.length - 1} aria-label="Move down">↓</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (question.type === "multiple-choice-single") {
    const options = (content.options ?? []) as string[];
    const selected = value.type === "mc" ? value.value : null;
    return (
      <div className="task-text-submit">
        {(question.category === "listening" || !!content.transcript) && (
          <>
            <div className="task-audio-box">
              <button type="button" className="task-mic-button" aria-label="Play audio">{speaker()}</button>
              <p className="task-recording-title">Audio playback coming soon.</p>
            </div>
            <div className="task-question-box">
              {content.title ? <p style={{ margin: "0 0 0.5rem", fontWeight: 800 }}>{String(content.title)}</p> : null}
              <p style={{ margin: 0, lineHeight: 1.7 }}>{passage}</p>
            </div>
          </>
        )}
        {!content.transcript && passage && (
          <div className="task-question-box">
            <p style={{ margin: 0, lineHeight: 1.7 }}>{passage}</p>
          </div>
        )}
        {instruction && <h3 className="task-block-label">{instruction}</h3>}
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
                onChange={() => onChange({ type: "mc", value: i })}
              />
              <span className="task-mc-letter">{String.fromCharCode(65 + i)}</span>
              <span className="task-mc-text">{opt}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  // Default: any text-based question (writing summarize/essay, speaking text tasks).
  const isListening = question.category === "listening" || !!content.transcript;
  const v = value.type === "text" ? value.value : "";
  return (
    <div className="task-text-submit">
      {isListening && (
        <>
          <div className="task-audio-box">
            <button type="button" className="task-mic-button" aria-label="Play audio">{speaker()}</button>
            <p className="task-recording-title">Audio playback coming soon.</p>
          </div>
          {passage && (
            <div className="task-question-box">
              <p style={{ margin: 0, lineHeight: 1.7 }}>{passage}</p>
            </div>
          )}
        </>
      )}
      {!isListening && passage && (
        <div className="task-question-box">
          <p style={{ margin: 0, lineHeight: 1.7 }}>{passage}</p>
        </div>
      )}
      {instruction && <h3 className="task-block-label">{instruction}</h3>}
      <textarea
        className="task-answer-textarea"
        value={v}
        onChange={(e) => onChange({ type: "text", value: e.target.value })}
        rows={isListening ? 6 : 8}
        placeholder="Type your answer here…"
      />
    </div>
  );
}

export { QuestionRenderer, stateIsAnswered };
