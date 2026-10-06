'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getCmsNotificationsAction,
  markNotificationAsReadAction,
  markAllNotificationsAsReadAction,
} from '@/server/notifications/actions';
import type { CmsNotificationItem } from '@/server/notifications/types';
import { playNotificationSound } from '../utils/soundAlert';

const SOUND_STORAGE_KEY = 'cic_cms_notification_sound_enabled';
const POLLING_INTERVAL_MS = 30_000;

export interface UseCmsNotificationsReturn {
  notifications: CmsNotificationItem[];
  unreadCount: number;
  isLoading: boolean;
  soundEnabled: boolean;
  toggleSound: () => void;
  markAsRead: (id: string | number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useCmsNotifications(): UseCmsNotificationsReturn {
  const [notifications, setNotifications] = useState<CmsNotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const prevLatestIdRef = useRef<string | null>(null);
  const isMountedRef = useRef<boolean>(false);

  // Initialize sound preference safely after mount
  useEffect(() => {
    isMountedRef.current = true;
    try {
      const stored = localStorage.getItem(SOUND_STORAGE_KEY);
      if (stored !== null) {
        setSoundEnabled(stored === 'true');
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SOUND_STORAGE_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const fetchNotifications = useCallback(async (isBackground = false) => {
    if (!isBackground) setIsLoading(true);
    try {
      const res = await getCmsNotificationsAction({ limit: 15 });
      setNotifications(res.notifications);
      setUnreadCount(res.unreadCount);

      // Detect new arrival
      if (res.notifications.length > 0) {
        const latestId = res.notifications[0].id;
        if (
          prevLatestIdRef.current !== null &&
          latestId !== prevLatestIdRef.current &&
          res.unreadCount > 0
        ) {
          // Play chime if enabled
          const sound = localStorage.getItem(SOUND_STORAGE_KEY) !== 'false';
          if (sound) {
            playNotificationSound();
          }
        }
        prevLatestIdRef.current = latestId;
      }
    } catch (error) {
      console.error('[useCmsNotifications Error]:', error);
    } finally {
      if (!isBackground) setIsLoading(false);
    }
  }, []);

  // Initial fetch and SWR Polling
  useEffect(() => {
    void fetchNotifications(false);

    const intervalTimer = setInterval(() => {
      // Only poll when tab is visible
      if (typeof document !== 'undefined' && !document.hidden) {
        void fetchNotifications(true);
      }
    }, POLLING_INTERVAL_MS);

    const handleFocus = () => {
      void fetchNotifications(true);
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(intervalTimer);
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchNotifications]);

  const markAsRead = useCallback(async (id: string | number) => {
    const numId = Number(id);
    if (isNaN(numId)) return;

    // Optimistic update
    setNotifications((prev) =>
      prev.map((item) => (item.id === String(id) ? { ...item, unread: false } : item))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await markNotificationAsReadAction(numId);
    } catch (err) {
      console.error('[markAsRead Error]:', err);
      // Revert if error
      void fetchNotifications(true);
    }
  }, [fetchNotifications]);

  const markAllAsRead = useCallback(async () => {
    // Optimistic update
    setNotifications((prev) => prev.map((item) => ({ ...item, unread: false })));
    setUnreadCount(0);

    try {
      await markAllNotificationsAsReadAction();
    } catch (err) {
      console.error('[markAllAsRead Error]:', err);
      void fetchNotifications(true);
    }
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    isLoading,
    soundEnabled,
    toggleSound,
    markAsRead,
    markAllAsRead,
    refresh: () => fetchNotifications(false),
  };
}
