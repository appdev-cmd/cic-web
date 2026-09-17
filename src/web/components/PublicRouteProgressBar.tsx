'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function PublicRouteProgressBarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const isNavigatingRef = useRef(false);
  const delayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const crawlIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startProgress = () => {
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;

    if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);

    // 100ms delay: If navigation is instantaneous or cached, do not flash progress
    delayTimerRef.current = setTimeout(() => {
      if (!isNavigatingRef.current) return;
      setIsVisible(true);
      setProgress(25);

      crawlIntervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 88) {
            if (crawlIntervalRef.current) clearInterval(crawlIntervalRef.current);
            return 88;
          }
          const increment = Math.max(1, (90 - prev) * 0.12);
          return Math.min(88, prev + increment);
        });
      }, 150);
    }, 100);

    safetyTimeoutRef.current = setTimeout(() => {
      finishProgress();
    }, 8000);
  };

  const finishProgress = () => {
    isNavigatingRef.current = false;
    if (delayTimerRef.current) clearTimeout(delayTimerRef.current);
    if (crawlIntervalRef.current) clearInterval(crawlIntervalRef.current);
    if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);

    setProgress(100);
    fadeTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
      setProgress(0);
    }, 250);
  };

  useEffect(() => {
    finishProgress();
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.defaultPrevented) return;
      if (e.button !== 0) return;

      const target = (e.target as HTMLElement)?.closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href) return;

      if (
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('javascript:') ||
        href.startsWith('blob:') ||
        href.startsWith('data:') ||
        target.hasAttribute('download') ||
        target.target === '_blank'
      ) {
        return;
      }

      try {
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) return;
        if (url.pathname === window.location.pathname && url.search === window.location.search) {
          return;
        }
        startProgress();
      } catch {
        // invalid URL
      }
    };

    const handlePopState = () => {
      startProgress();
    };

    const handleCustomNavigate = () => {
      startProgress();
    };

    document.addEventListener('click', handleAnchorClick, { capture: true });
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('public-route-start', handleCustomNavigate);

    return () => {
      document.removeEventListener('click', handleAnchorClick, { capture: true });
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('public-route-start', handleCustomNavigate);
      if (delayTimerRef.current) clearTimeout(delayTimerRef.current);
      if (crawlIntervalRef.current) clearInterval(crawlIntervalRef.current);
      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    };
  }, []);

  if (!isVisible && progress === 0) return null;

  return (
    <div
      role="progressbar"
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none h-[2.5px] bg-transparent"
    >
      <div
        className="h-full bg-gradient-to-r from-[#FC5115] via-orange-500 to-amber-500 shadow-[0_0_8px_rgba(252,81,21,0.5)] transition-all duration-200 ease-out motion-reduce:transition-none"
        style={{
          width: `${progress}%`,
          opacity: isVisible ? 1 : 0,
        }}
      />
    </div>
  );
}

export function PublicRouteProgressBar() {
  return (
    <Suspense fallback={null}>
      <PublicRouteProgressBarInner />
    </Suspense>
  );
}
