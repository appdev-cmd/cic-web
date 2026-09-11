'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NewsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getVisiblePages(currentPage: number, totalPages: number): (number | 'ellipsis-start' | 'ellipsis-end')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, 'ellipsis-end', totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [1, 'ellipsis-start', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, 'ellipsis-start', currentPage - 1, currentPage, currentPage + 1, 'ellipsis-end', totalPages];
}

export function NewsPagination({
  currentPage,
  totalPages,
  onPageChange,
}: NewsPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getVisiblePages(currentPage, totalPages);

  return (
    <div className="flex justify-center items-center gap-1.5 sm:gap-2 mt-8 flex-wrap">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        className="w-9 h-9 sm:w-10 sm:h-10 border border-slate-200 flex items-center justify-center transition-colors hover:border-orange-600 disabled:opacity-40 disabled:hover:border-slate-200 disabled:cursor-not-allowed bg-white text-slate-700 rounded-[8px] cursor-pointer"
        aria-label="Trang trước"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((item, idx) => {
        if (item === 'ellipsis-start' || item === 'ellipsis-end') {
          return (
            <span
              key={`ellipsis-${idx}`}
              className="w-7 h-9 sm:w-8 sm:h-10 flex items-center justify-center text-slate-400 font-bold text-xs"
            >
              ...
            </span>
          );
        }

        const page = item as number;
        const isCurrent = currentPage === page;

        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-9 h-9 sm:w-10 sm:h-10 border flex items-center justify-center text-xs font-bold transition-all rounded-[8px] cursor-pointer ${
              isCurrent
                ? 'bg-orange-600 border-orange-600 text-white shadow-sm'
                : 'bg-white border-slate-200 text-slate-700 hover:border-orange-600 hover:text-orange-600'
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        className="w-9 h-9 sm:w-10 sm:h-10 border border-slate-200 flex items-center justify-center transition-colors hover:border-orange-600 disabled:opacity-40 disabled:hover:border-slate-200 disabled:cursor-not-allowed bg-white text-slate-700 rounded-[8px] cursor-pointer"
        aria-label="Trang sau"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
