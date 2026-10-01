'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { notificationsApi } from '@/lib/api/notifications';
import { errorMessage } from '@/lib/api/client';
import type { Notification } from '@/types';

export function useNotifications(enabled: boolean) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // A panel can be opened by a click that lands after the route already
  // changed, so a late response for the previous page would otherwise render.
  const requestIdRef = useRef(0);

  const load = useCallback(async () => {
    if (!enabled) return;
    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    setError(null);
    try {
      const data = await notificationsApi.list();
      if (requestId !== requestIdRef.current) return;
      setNotifications(data.items);
      setUnreadCount(data.unread_count);
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      setError(errorMessage(err));
    } finally {
      if (requestId === requestIdRef.current) setIsLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      // Signed out, or still resolving auth: drop the previous user's feed
      // rather than leaving their notifications on screen.
      setNotifications([]);
      setUnreadCount(0);
      setError(null);
      return;
    }
    void load();
  }, [enabled, load]);

  const markRead = useCallback(
    async (id: number) => {
      const target = notifications.find((n) => n.id === id);
      // Already read: nothing to persist, so skip the request entirely.
      if (!target || target.is_read) return;

      // Optimistic: the badge and the row highlight both update immediately,
      // then reconcile against the server response.
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));

      try {
        const updated = await notificationsApi.markRead(id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? updated : n))
        );
      } catch (err) {
        setError(errorMessage(err));
        void load();
      }
    },
    [notifications, load]
  );

  const markAllRead = useCallback(async () => {
    if (unreadCount === 0) return;
    const previous = notifications;
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);

    try {
      const data = await notificationsApi.markAllRead();
      setNotifications(data.items);
      setUnreadCount(data.unread_count);
    } catch (err) {
      setNotifications(previous);
      setError(errorMessage(err));
    }
  }, [notifications, unreadCount]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    refresh: load,
    markRead,
    markAllRead,
  };
}