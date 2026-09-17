'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { CmsTableSkeleton } from './CmsTableSkeleton';

interface CmsDataGridFrameProps {
  children: React.ReactNode;
  toolbar?: React.ReactNode;
  footer?: React.ReactNode;
  ariaLabel: string;
  refreshKey?: string | number;
  isLoading?: boolean;
  loadingMode?: 'skeleton' | 'overlay';
  skeletonColumns?: number;
  skeletonRows?: number;
  loadingText?: string;
}

export function CmsDataGridFrame({
  children,
  toolbar,
  footer,
  ariaLabel,
  refreshKey,
  isLoading = false,
  loadingMode = 'overlay',
  skeletonColumns = 6,
  skeletonRows = 5,
  loadingText = 'Đang tải...',
}: CmsDataGridFrameProps) {
  const tableScrollRef = useRef<HTMLDivElement>(null);
  const floatingScrollRef = useRef<HTMLDivElement>(null);
  const [rail, setRail] = useState({ visible: false, left: 0, width: 0, contentWidth: 0 });

  useEffect(() => {
    const tableScroller = tableScrollRef.current;
    if (!tableScroller) return;
    let syncing = false;
    const updateRail = () => {
      const rect = tableScroller.getBoundingClientRect();
      const left = Math.max(0, rect.left);
      setRail({
        visible: rect.top < window.innerHeight && rect.bottom > window.innerHeight && tableScroller.scrollWidth > tableScroller.clientWidth,
        left,
        width: Math.max(0, Math.min(rect.width, window.innerWidth - left)),
        contentWidth: tableScroller.scrollWidth,
      });
    };
    const syncFloating = () => {
      if (syncing || !floatingScrollRef.current) return;
      syncing = true;
      floatingScrollRef.current.scrollLeft = tableScroller.scrollLeft;
      syncing = false;
    };
    const resizeObserver = new ResizeObserver(updateRail);
    resizeObserver.observe(tableScroller);
    tableScroller.addEventListener('scroll', syncFloating, { passive: true });
    window.addEventListener('scroll', updateRail, { passive: true });
    window.addEventListener('resize', updateRail);
    updateRail();
    return () => {
      resizeObserver.disconnect();
      tableScroller.removeEventListener('scroll', syncFloating);
      window.removeEventListener('scroll', updateRail);
      window.removeEventListener('resize', updateRail);
    };
  }, [refreshKey]);

  const scrollbarClasses = '[scrollbar-color:#94a3b8_#f1f5f9] [scrollbar-width:thin] dark:[scrollbar-color:#64748b_#1e293b] [&::-webkit-scrollbar]:h-2.5 [&::-webkit-scrollbar-track]:bg-slate-100 dark:[&::-webkit-scrollbar-track]:bg-slate-800 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-solid [&::-webkit-scrollbar-thumb]:border-slate-100 [&::-webkit-scrollbar-thumb]:bg-slate-400 hover:[&::-webkit-scrollbar-thumb]:bg-slate-500 dark:[&::-webkit-scrollbar-thumb]:border-slate-800 dark:[&::-webkit-scrollbar-thumb]:bg-slate-500 dark:hover:[&::-webkit-scrollbar-thumb]:bg-slate-400';

  const showSkeleton = isLoading && loadingMode === 'skeleton';
  const showOverlay = isLoading && loadingMode === 'overlay';

  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      {toolbar && (
        <div className="flex items-center justify-end border-b border-slate-200 bg-slate-50/80 px-3 py-2 dark:border-slate-800 dark:bg-slate-800/50">
          {toolbar}
        </div>
      )}

      {/* Top indeterminate progress line during overlay loading */}
      {showOverlay && (
        <div className="absolute top-0 left-0 right-0 z-40 h-[2px] overflow-hidden bg-orange-100 dark:bg-orange-950">
          <div className="h-full w-1/3 animate-pulse rounded-full bg-gradient-to-r from-orange-500 to-amber-500" />
        </div>
      )}

      <div className="relative">
        {/* Soft overlay for refetch / search / pagination without layout shift */}
        {showOverlay && (
          <div
            className="absolute inset-0 z-30 flex items-center justify-center bg-white/60 dark:bg-slate-950/60 backdrop-blur-[0.5px] transition-opacity duration-200 pointer-events-none"
            aria-live="polite"
            aria-busy="true"
          >
            <div className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-white/95 px-4 py-2 text-xs font-semibold text-slate-700 shadow-md dark:border-slate-800 dark:bg-slate-900/95 dark:text-slate-200">
              <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
              <span>{loadingText}</span>
            </div>
          </div>
        )}

        <div
          ref={tableScrollRef}
          className={`max-h-[calc(100dvh-12rem)] overflow-auto overscroll-contain ${scrollbarClasses}`}
          role="region"
          aria-label={ariaLabel}
          tabIndex={0}
        >
          {showSkeleton ? (
            <CmsTableSkeleton columns={skeletonColumns} rows={skeletonRows} />
          ) : (
            children
          )}
        </div>
      </div>

      {rail.visible && !showSkeleton && (
        <div
          ref={floatingScrollRef}
          role="region"
          aria-label={`Thanh cuộn ngang cố định của ${ariaLabel.toLowerCase()}`}
          tabIndex={0}
          onScroll={(event) => {
            if (tableScrollRef.current) tableScrollRef.current.scrollLeft = event.currentTarget.scrollLeft;
          }}
          className={`fixed bottom-[env(safe-area-inset-bottom)] z-50 overflow-x-auto border-y border-slate-300 bg-slate-100/95 shadow-[0_-5px_16px_rgba(15,23,42,0.14)] backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/95 ${scrollbarClasses}`}
          style={{ left: rail.left, width: rail.width }}
        >
          <div style={{ width: rail.contentWidth, height: 1 }} />
        </div>
      )}
      {footer}
    </section>
  );
}
