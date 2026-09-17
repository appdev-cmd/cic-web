'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function startCmsProgressBar() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cms:progress-start'));
  }
}

export function stopCmsProgressBar() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cms:progress-stop'));
  }
}

export function CmsRouteProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setVisible(true);
    setProgress(18);

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev < 65) return prev + Math.random() * 14;
        if (prev < 88) return prev + Math.random() * 4;
        return prev;
      });
    }, 180);
  }, []);

  const complete = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setProgress(100);

    timeoutRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 280);
  }, []);

  // Complete progress on route change
  useEffect(() => {
    complete();
  }, [pathname, searchParams, complete]);

  // Listen for custom events
  useEffect(() => {
    const handleStart = () => start();
    const handleStop = () => complete();

    window.addEventListener('cms:progress-start', handleStart);
    window.addEventListener('cms:progress-stop', handleStop);

    // Intercept clicks on internal CMS links
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest<HTMLAnchorElement>('a[href^="/cms/"]');
      if (anchor && anchor.href && !anchor.target && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
        const url = new URL(anchor.href, window.location.origin);
        if (url.pathname !== window.location.pathname || url.search !== window.location.search) {
          start();
        }
      }
    };

    document.addEventListener('click', handleDocumentClick, { capture: true });

    return () => {
      window.removeEventListener('cms:progress-start', handleStart);
      window.removeEventListener('cms:progress-stop', handleStop);
      document.removeEventListener('click', handleDocumentClick, { capture: true });
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [start, complete]);

  if (!visible && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[99999] h-[2.5px] pointer-events-none bg-transparent overflow-hidden"
    >
      <div
        className="h-full bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 shadow-[0_1px_8px_rgba(249,115,22,0.6)] transition-all duration-200 ease-out"
        style={{
          width: `${progress}%`,
          opacity: visible ? 1 : 0,
          transitionProperty: 'width, opacity',
        }}
      />
    </div>
  );
}
