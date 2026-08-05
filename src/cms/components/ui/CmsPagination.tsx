import React from 'react';
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

export const CmsPagination: React.FC<CmsPaginationProps> = ({
  currentPage,
  pageSize,
  totalCount,
  itemLabel,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [25, 50, 100],
}) => {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const firstItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastItem = Math.min(currentPage * pageSize, totalCount);

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
              {pageSizeOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
        )}

        <div className="cms-page-navigation">
          <button type="button" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1} aria-label="Trang trước" title="Trang trước">
            <ChevronLeft aria-hidden="true" />
          </button>
          <span>Trang <strong>{currentPage}</strong> / {totalPages}</span>
          <button type="button" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages} aria-label="Trang sau" title="Trang sau">
            <ChevronRight aria-hidden="true" />
          </button>
        </div>
      </div>
    </nav>
  );
};
