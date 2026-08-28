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
      <div className="cms-list-search relative flex items-center w-full max-w-lg">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-orange-500">
          <Search className="w-4 h-4" aria-hidden="true" />
        </div>
        <span className="sr-only">Tìm kiếm</span>
        <input 
          value={searchValue} 
          onChange={(event) => onSearchChange(event.target.value)} 
          placeholder={searchPlaceholder} 
          className="w-full pl-10 pr-8 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium min-h-[2.5rem]"
        />
        {searchValue && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            title="Xóa tìm kiếm"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

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
