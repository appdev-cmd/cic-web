import React from 'react';

interface CmsTableSkeletonRowsProps {
  columns?: number;
  rows?: number;
  className?: string;
}

/**
 * Pulse skeleton rows for insertion directly into a <tbody>
 * Renders multiple table rows with varied placeholder widths to simulate realistic data.
 */
export function CmsTableSkeletonRows({
  columns = 6,
  rows = 5,
  className = '',
}: CmsTableSkeletonRowsProps) {
  // Predefined varying width percentages for a natural look
  const widthProfiles = [
    ['w-8', 'w-3/4', 'w-1/2', 'w-24', 'w-20', 'w-16'],
    ['w-8', 'w-2/3', 'w-1/3', 'w-28', 'w-16', 'w-16'],
    ['w-8', 'w-4/5', 'w-2/5', 'w-20', 'w-24', 'w-16'],
    ['w-8', 'w-1/2', 'w-3/5', 'w-24', 'w-16', 'w-16'],
    ['w-8', 'w-3/5', 'w-1/2', 'w-32', 'w-20', 'w-16'],
  ];

  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => {
        const profile = widthProfiles[rowIndex % widthProfiles.length];
        return (
          <tr
            key={rowIndex}
            className={`border-b border-slate-100 dark:border-slate-800/60 ${className}`}
            aria-hidden="true"
          >
            {Array.from({ length: columns }).map((_, colIndex) => {
              const widthClass = profile[colIndex % profile.length] || 'w-24';
              return (
                <td key={colIndex} className="p-3.5">
                  <div
                    className={`h-4 rounded bg-slate-200/80 dark:bg-slate-800 animate-pulse ${widthClass}`}
                  />
                </td>
              );
            })}
          </tr>
        );
      })}
    </>
  );
}

interface CmsTableSkeletonProps {
  columns?: number;
  rows?: number;
  hasHeader?: boolean;
  className?: string;
}

/**
 * Standalone table skeleton with an optional pulsing header row.
 */
export function CmsTableSkeleton({
  columns = 6,
  rows = 5,
  hasHeader = true,
  className = '',
}: CmsTableSkeletonProps) {
  return (
    <div className={`overflow-x-auto ${className}`} aria-busy="true" aria-label="Đang tải dữ liệu...">
      <table className="cms-data-table w-full text-left">
        {hasHeader && (
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-800/60">
              {Array.from({ length: columns }).map((_, colIdx) => (
                <th key={colIdx} className="p-3">
                  <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
          <CmsTableSkeletonRows columns={columns} rows={rows} />
        </tbody>
      </table>
    </div>
  );
}
