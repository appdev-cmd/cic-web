'use client';

import React, { useEffect, useState } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export function NetworkStatusNotifier() {
  const [isOffline, setIsOffline] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    // Initial check
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setIsOffline(true);
      setWasOffline(true);
    }

    const handleOffline = () => {
      setIsOffline(true);
      setWasOffline(true);
    };

    const handleOnline = () => {
      setIsOffline(false);
      // Auto-hide the "Back online" toast after 3.5 seconds
      const timer = setTimeout(() => {
        setWasOffline(false);
      }, 3500);
      return () => clearTimeout(timer);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (!isOffline && !wasOffline) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 right-5 z-[99999] max-w-sm pointer-events-none transition-all duration-300 animate-in fade-in slide-in-from-bottom-3"
    >
      {isOffline ? (
        <div className="pointer-events-auto flex items-center gap-3 rounded-xl bg-slate-900 border border-red-500/40 px-4 py-3 text-white shadow-2xl backdrop-blur-md">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/20 text-red-400">
            <WifiOff size={18} />
          </div>
          <div className="text-xs">
            <p className="font-bold text-red-400">Mất kết nối Internet</p>
            <p className="text-slate-300 mt-0.5">Vui lòng kiểm tra lại đường truyền của bạn.</p>
          </div>
        </div>
      ) : (
        <div className="pointer-events-auto flex items-center gap-3 rounded-xl bg-slate-900 border border-emerald-500/40 px-4 py-3 text-white shadow-2xl backdrop-blur-md">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
            <Wifi size={18} />
          </div>
          <div className="text-xs">
            <p className="font-bold text-emerald-400">Đã kết nối lại</p>
            <p className="text-slate-300 mt-0.5">Đã khôi phục kết nối mạng Internet thành công.</p>
          </div>
        </div>
      )}
    </div>
  );
}
