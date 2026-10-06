'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { errorMessage } from '@/lib/api/client';
import { notificationApi } from '@/lib/api/notification';
import { questionsApi, type QuestionCategory } from '@/lib/api/questions';
import type { NotificationItem } from '@/types';

/**
 * Practice links are built server-side as `/practice/{category}/{question_id}`,
 * but the practice route takes a task slug (`read-aloud`, `essay`, …). Resolve
 * the id to its question type before navigating; a failure degrades to the
 * category landing page instead of an error state.
 */
function parsePracticeHref(href: string): { category: QuestionCategory; questionId: number } | null {
  const match = /^\/practice\/(speaking|writing|reading|listening)\/(\d+)$/.exec(href);
  if (!match) return null;
  return { category: match[1] as QuestionCategory, questionId: Number(match[2]) };
}

/**
 * Notification bell and its dropdown.
 *
 * Items are derived server-side from the user's graded attempts and mock tests,
 * so an entry only exists because something real happened. The red dot is
 * driven by `unread_count` rather than hard-coded markup.
 *
 * The panel closes on outside click, Escape, and on choosing an item, and
 * opening it marks everything read so the badge does not get stuck.
 */
export default function NotificationBell({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await notificationApi.list();
      setItems(data.items);
      setUnread(data.unread_count);
    } catch (err) {
      // A failed poll must not take the navbar down or nag the user with an
      // error the bell cannot act on.
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  // Badge is fetched on mount so the count is right before the panel is opened.
  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    function onMouseDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onMouseDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onMouseDown);
    };
  }, [open]);

  async function toggle() {
    const next = !open;
    setOpen(next);
    if (!next) return;
    // Opening the feed counts as reading it.
    if (unread > 0) {
      try {
        const data = await notificationApi.markAllRead();
        setItems(data.items);
        setUnread(data.unread_count);
      } catch {
        // Leave the badge as-is if the cursor could not be advanced.
      }
    }
  }

  function handleNavigate() {
    setOpen(false);
    onNavigate?.();
  }

  async function handleItemClick(href: string) {
    handleNavigate();
    const target = parsePracticeHref(href);
    if (!target) {
      router.push(href);
      return;
    }
    const fallback = `/practice/${target.category}`;
    try {
      const question = await questionsApi.get(target.category, target.questionId);
      router.push(`/practice/${target.category}/${question.type}`);
    } catch {
      router.push(fallback);
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => void toggle()}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={
          unread > 0 ? `Notifications, ${unread} unread` : 'Notifications, none unread'
        }
        className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-indigo-100 transition-colors group"
      >
        <svg
          className="w-5 h-5 text-gray-500 group-hover:text-indigo-600 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unread > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#F5F3FF]" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-xl border border-gray-100 z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <p className="text-[14px] font-bold text-gray-900">Notifications</p>
            {items.length > 0 && (
              <button
                type="button"
                onClick={() => void load()}
                className="text-[12px] font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Refresh
              </button>
            )}
          </div>

          {loading && items.length === 0 ? (
            <p className="px-4 py-6 text-[13px] text-gray-400 text-center">Loading…</p>
          ) : error && items.length === 0 ? (
            <p className="px-4 py-6 text-[13px] text-gray-400 text-center">
              Could not load notifications.
            </p>
          ) : items.length === 0 ? (
            <p className="px-4 py-6 text-[13px] text-gray-400 text-center">
              Nothing yet. Finish a practice question or a mock test and it will show up here.
            </p>
          ) : (
            <ul className="max-h-80 overflow-y-auto py-1">
              {items.map((n) => {
                const inner = (
                  <>
                    <div className="flex items-start gap-2">
                      {!n.read && (
                        <span
                          className="mt-1.5 w-2 h-2 rounded-full bg-indigo-500 shrink-0"
                          aria-hidden="true"
                        />
                      )}
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-gray-800">{n.title}</p>
                        <p className="text-[12px] text-gray-500 break-words">{n.body}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  </>
                );
                return (
                  <li key={n.id}>
                    {n.href ? (
                      <Link
                        href={n.href}
                        onClick={(e) => {
                          e.preventDefault();
                          void handleItemClick(n.href as string);
                        }}
                        className="block px-4 py-2.5 hover:bg-indigo-50 transition-colors"
                      >
                        {inner}
                      </Link>
                    ) : (
                      <div className="px-4 py-2.5">{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
