'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';

function BellIcon({ hasUnread }: { hasUnread: boolean }) {
  return (
    <svg
      className={`w-5 h-5 transition-colors ${
        hasUnread ? 'text-indigo-600' : 'text-gray-500 group-hover:text-indigo-600'
      }`}
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
  );
}

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  // A missing or unparseable timestamp should not render "NaN minutes ago".
  if (Number.isNaN(then)) return '';

  const seconds = Math.round((Date.now() - then) / 1000);
  if (seconds < 60) return 'Just now';

  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;

  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

export default function NotificationBell() {
  const pathname = usePathname();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Don't hit the API at all until we know there is a session: the endpoint is
  // authenticated, and a 401 would clear tokens and bounce the user to /login.
  const enabled = isAuthenticated && !authLoading;
  const { notifications, unreadCount, isLoading, error, refresh, markRead, markAllRead } =
    useNotifications(enabled);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Navigating away should never leave the panel open behind the new page.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={
          unreadCount > 0
            ? `Notifications, ${unreadCount} unread`
            : 'Notifications'
        }
        className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-indigo-100 transition-colors group"
      >
        <BellIcon hasUnread={unreadCount > 0} />

        {/* Badge reflects the real unread count and disappears at zero. */}
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-[#F5F3FF]">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-[340px] max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <p className="text-[14px] font-bold text-gray-800">Notifications</p>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => void markAllRead()}
                className="text-[12px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[360px] overflow-y-auto">
            {isLoading ? (
              <p className="px-4 py-6 text-[13px] text-gray-400 text-center">
                Loading notifications...
              </p>
            ) : error ? (
              <div className="px-4 py-6 text-center">
                <p className="text-[13px] text-red-500">{error}</p>
                <button
                  type="button"
                  onClick={() => void refresh()}
                  className="mt-2 text-[12px] font-bold text-indigo-600 hover:text-indigo-800"
                >
                  Try again
                </button>
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-[13px] text-gray-500 font-semibold">
                  No notifications yet
                </p>
                <p className="mt-1 text-[12px] text-gray-400">
                  Mock test results and study tips will show up here.
                </p>
              </div>
            ) : (
              <ul>
                {notifications.map((n) => {
                  const time = relativeTime(n.created_at);
                  const content = (
                    <>
                      <div className="flex items-start gap-2">
                        {!n.is_read && (
                          <span
                            className="mt-1.5 w-2 h-2 rounded-full bg-indigo-600 flex-shrink-0"
                            aria-label="Unread"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-[13px] leading-snug ${
                              n.is_read
                                ? 'font-semibold text-gray-600'
                                : 'font-bold text-gray-900'
                            }`}
                          >
                            {n.title}
                          </p>
                          <p className="mt-0.5 text-[12px] leading-relaxed text-gray-500">
                            {n.body}
                          </p>
                          {time && (
                            <p className="mt-1 text-[11px] text-gray-400">{time}</p>
                          )}
                        </div>
                      </div>
                    </>
                  );

                  const rowClass = `block w-full text-left px-4 py-3 border-b border-gray-50 transition-colors ${
                    n.is_read ? 'hover:bg-gray-50' : 'bg-indigo-50/40 hover:bg-indigo-50'
                  }`;

                  // Notifications without an href are informational, so they
                  // must not render as a link.
                  return (
                    <li key={n.id}>
                      {n.href ? (
                        <Link
                          href={n.href}
                          onClick={() => {
                            if (!n.is_read) void markRead(n.id);
                            setOpen(false);
                          }}
                          className={rowClass}
                        >
                          {content}
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            if (!n.is_read) void markRead(n.id);
                          }}
                          className={rowClass}
                        >
                          {content}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}