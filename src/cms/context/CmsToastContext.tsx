'use client';

import React, { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface CmsToastContextValue {
  toast: {
    show: (message: string, duration?: number) => void;
    success: (message: string, duration?: number) => void;
    error: (message: string, duration?: number) => void;
    info: (message: string, duration?: number) => void;
    warning: (message: string, duration?: number) => void;
  };
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  dismissToast: (id: string) => void;
}

const CmsToastContext = createContext<CmsToastContextValue | null>(null);

const iconMap: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />,
  error: <AlertCircle className="size-4 text-rose-400 shrink-0" />,
  warning: <AlertTriangle className="size-4 text-amber-400 shrink-0" />,
  info: <Info className="size-4 text-sky-400 shrink-0" />,
};

const borderMap: Record<ToastType, string> = {
  success: 'border-emerald-500/30 dark:border-emerald-500/20',
  error: 'border-rose-500/30 dark:border-rose-500/20',
  warning: 'border-amber-500/30 dark:border-amber-500/20',
  info: 'border-sky-500/30 dark:border-sky-500/20',
};

export function CmsToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const dismissToast = useCallback((id: string) => {
    const existingTimer = timersRef.current.get(id);
    if (existingTimer) {
      clearTimeout(existingTimer);
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'success', duration = 3500) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const newItem: ToastItem = { id, type, message, duration };

    setToasts((prev) => [...prev.slice(-4), newItem]);

    if (duration > 0) {
      const timer = setTimeout(() => {
        dismissToast(id);
      }, duration);
      timersRef.current.set(id, timer);
    }
  }, [dismissToast]);

  const toast = useMemo(() => ({
    show: (msg: string, dur?: number) => showToast(msg, 'success', dur),
    success: (msg: string, dur?: number) => showToast(msg, 'success', dur),
    error: (msg: string, dur?: number) => showToast(msg, 'error', dur),
    info: (msg: string, dur?: number) => showToast(msg, 'info', dur),
    warning: (msg: string, dur?: number) => showToast(msg, 'warning', dur),
  }), [showToast]);

  const contextValue = useMemo(() => ({
    toast,
    showToast,
    dismissToast,
  }), [toast, showToast, dismissToast]);

  return (
    <CmsToastContext.Provider value={contextValue}>
      {children}
      {/* Toast Viewport Container */}
      <aside
        aria-label="Thông báo hệ thống"
        aria-live="polite"
        className="pointer-events-none fixed bottom-6 right-6 z-[9999] flex flex-col gap-2.5 max-w-md w-full px-4 sm:px-0"
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            role="status"
            className={`pointer-events-auto flex items-center justify-between gap-3 rounded-xl border bg-slate-900/95 dark:bg-slate-900/95 text-white px-4 py-3 shadow-2xl backdrop-blur-md text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200 ${borderMap[item.type]}`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {iconMap[item.type]}
              <span className="leading-snug break-words">{item.message}</span>
            </div>
            <button
              type="button"
              onClick={() => dismissToast(item.id)}
              aria-label="Đóng thông báo"
              className="p-1 text-slate-400 hover:text-white rounded-md transition-colors cursor-pointer shrink-0"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}
      </aside>
    </CmsToastContext.Provider>
  );
}

export function useCmsToast() {
  const ctx = useContext(CmsToastContext);
  if (!ctx) {
    throw new Error('useCmsToast must be used within a CmsToastProvider');
  }
  return ctx;
}
