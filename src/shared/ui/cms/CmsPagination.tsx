'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CmsPaginationProps {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  itemLabel: string;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

interface CmsListFooterProps {
  visibleCount: number;
  totalCount?: number;
  itemLabel: string;
  trailing?: React.ReactNode;
}

export const CmsListFooter: React.FC<CmsListFooterProps> = ({ visibleCount, totalCount = visibleCount, itemLabel, trailing }) => (
  <footer className="cms-list-footer">
    <p className="cms-list-summary">Hiển thị <strong>{visibleCount}</strong> trong <strong>{totalCount}</strong> {itemLabel}</p>
    {trailing}
  </footer>
);

export const CmsPagination: React.FC<CmsPaginationProps> = ({
  currentPage,
  pageSize,
  totalCount,
  itemLabel,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
}) => {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const firstItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastItem = Math.min(currentPage * pageSize, totalCount);
  const [goToPageDraft, setGoToPageDraft] = useState<string | null>(null);
  const goToPage = goToPageDraft ?? String(currentPage);
  const normalizedPageSizeOptions = useMemo(
    () => Array.from(new Set([...pageSizeOptions, pageSize])).sort((a, b) => a - b),
    [pageSize, pageSizeOptions],
  );

  useEffect(() => {
    if (currentPage > totalPages) onPageChange(totalPages);
  }, [currentPage, onPageChange, totalPages]);

  const changePage = (nextPage: number) => {
    setGoToPageDraft(null);
    onPageChange(nextPage);
  };

  const pageItems = useMemo<(number | 'ellipsis-start' | 'ellipsis-end')[]>(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);
    if (currentPage <= 4) return [1, 2, 3, 4, 5, 'ellipsis-end', totalPages];
    if (currentPage >= totalPages - 3) return [1, 'ellipsis-start', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, 'ellipsis-start', currentPage - 1, currentPage, currentPage + 1, 'ellipsis-end', totalPages];
  }, [currentPage, totalPages]);

  const submitGoToPage = () => {
    const parsed = Number(goToPage);
    if (!Number.isFinite(parsed)) return setGoToPageDraft(null);
    const nextPage = Math.min(totalPages, Math.max(1, Math.trunc(parsed)));
    setGoToPageDraft(null);
    onPageChange(nextPage);
  };

  return (
    <nav aria-label="Phân trang danh sách" className="cms-list-footer">
      <p className="cms-list-summary" aria-live="polite">
        Hiển thị <strong>{firstItem}–{lastItem}</strong> trong <strong>{totalCount}</strong> {itemLabel}
      </p>

      <div className="cms-pagination-controls">
        {onPageSizeChange && (
          <label className="cms-page-size">
            <span>Số dòng mỗi trang</span>
            <select value={pageSize} onChange={(event) => onPageSizeChange(Number(event.target.value))}>
              {normalizedPageSizeOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
        )}

        <div className="cms-page-navigation">
          <button type="button" onClick={() => changePage(currentPage - 1)} disabled={currentPage <= 1} aria-label="Trang trước" title="Trang trước">
            <ChevronLeft aria-hidden="true" />
          </button>
          <div className="cms-page-numbers" aria-label={`Trang ${currentPage} trên ${totalPages}`}>
            {pageItems.map((item) => typeof item === 'number' ? (
              <button key={item} type="button" onClick={() => changePage(item)} aria-current={item === currentPage ? 'page' : undefined} className={item === currentPage ? 'is-active' : ''}>{item}</button>
            ) : <span key={item} aria-hidden="true">…</span>)}
          </div>
          <button type="button" onClick={() => changePage(currentPage + 1)} disabled={currentPage >= totalPages} aria-label="Trang sau" title="Trang sau">
            <ChevronRight aria-hidden="true" />
          </button>
        </div>

        {totalPages >= 10 && (
          <form className="cms-go-to-page" onSubmit={(event) => { event.preventDefault(); submitGoToPage(); }}>
            <label htmlFor="cms-go-to-page-input">Đi đến trang</label>
            <input id="cms-go-to-page-input" type="number" min={1} max={totalPages} value={goToPage} onChange={(event) => setGoToPageDraft(event.target.value)} onBlur={submitGoToPage} />
          </form>
        )}
      </div>
    </nav>
  );
};
