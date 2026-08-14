import React from 'react';
import { Filter, RotateCcw, Search, X } from 'lucide-react';
import { CmsButton } from './CmsButton';

export interface CmsActiveFilter {
  id: string;
  label: string;
  onRemove: () => void;
}

interface CmsListToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  filterCount?: number;
  filtersOpen?: boolean;
  onToggleFilters?: () => void;
  onReset?: () => void;
  resetDisabled?: boolean;
  actions?: React.ReactNode;
  filters?: React.ReactNode;
  activeFilters?: CmsActiveFilter[];
}

export const CmsListToolbar: React.FC<CmsListToolbarProps> = ({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  filterCount = 0,
  filtersOpen = false,
  onToggleFilters,
  onReset,
  resetDisabled = false,
  actions,
  filters,
  activeFilters = [],
}) => (
  <section className="cms-list-toolbar" aria-label="Tìm kiếm và lọc danh sách">
    <div className="cms-list-toolbar-row">
      <label className="cms-list-search">
        <Search aria-hidden="true" />
        <span className="sr-only">Tìm kiếm</span>
        <input value={searchValue} onChange={(event) => onSearchChange(event.target.value)} placeholder={searchPlaceholder} />
      </label>

      <div className="cms-list-toolbar-actions">
        {onToggleFilters && <CmsButton type="button" variant={filtersOpen || filterCount > 0 ? 'primary' : 'secondary'} size="sm" leadingIcon={<Filter />} onClick={onToggleFilters}>Bộ lọc{filterCount > 0 ? ` (${filterCount})` : ''}</CmsButton>}
        {actions}
        {onReset && <CmsButton type="button" variant="ghost" size="sm" className="ml-auto h-9 w-24 px-0" leadingIcon={<RotateCcw />} onClick={onReset} disabled={resetDisabled}>Đặt lại</CmsButton>}
      </div>
    </div>

    {filtersOpen && filters && <div className="cms-filter-panel">{filters}</div>}
    {activeFilters.length > 0 && (
      <div className="cms-active-filters" aria-label="Bộ lọc đang áp dụng">
        <span>Đang lọc:</span>
        {activeFilters.map((filter) => <button key={filter.id} type="button" onClick={filter.onRemove}>{filter.label}<X aria-hidden="true" /></button>)}
      </div>
    )}
  </section>
);

interface CmsTableShellProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const CmsTableShell: React.FC<CmsTableShellProps> = ({ children, footer, className = '' }) => (
  <section className={`cms-table-shell ${className}`.trim()}>
    <div className="cms-table-scroll">{children}</div>
    {footer}
  </section>
);

interface CmsTableEmptyStateProps {
  filtered?: boolean;
  onReset?: () => void;
  action?: React.ReactNode;
  colSpan: number;
}

export const CmsTableEmptyState: React.FC<CmsTableEmptyStateProps> = ({ filtered = false, onReset, action, colSpan }) => (
  <tr><td colSpan={colSpan}><div className="cms-table-empty"><strong>{filtered ? 'Không tìm thấy kết quả phù hợp' : 'Chưa có dữ liệu'}</strong><span>{filtered ? 'Hãy thay đổi hoặc xóa các điều kiện lọc.' : 'Danh sách hiện chưa có bản ghi nào.'}</span>{filtered && onReset ? <CmsButton size="sm" variant="secondary" onClick={onReset}>Xóa bộ lọc</CmsButton> : action}</div></td></tr>
);

export const CmsTableLoadingState: React.FC<{ colSpan: number; rows?: number }> = ({ colSpan, rows = 5 }) => (
  <>{Array.from({ length: rows }, (_, row) => <tr key={row} aria-hidden="true"><td colSpan={colSpan}><div className="cms-table-loading"><span /><span /><span /></div></td></tr>)}</>
);
