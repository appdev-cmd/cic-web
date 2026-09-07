import { Search } from 'lucide-react';

import type { SavedFilterView } from './types';

const SAVED_FILTERS: ReadonlyArray<{ id: SavedFilterView; label: string }> = [
  { id: 'all', label: 'Tất cả' },
  { id: 'missing_alt', label: 'Thiếu Alt' },
  { id: 'unused', label: 'Chưa dùng (Unused)' },
  { id: 'issues', label: 'Có xung đột' },
];

export function MediaFilterToolbar({ searchQuery, savedFilter, onSearchChange, onSavedFilterChange }: { searchQuery: string; savedFilter: SavedFilterView; onSearchChange: (query: string) => void; onSavedFilterChange: (filter: SavedFilterView) => void }) {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-50/60 dark:bg-slate-850 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800">
      <div className="relative flex items-center flex-1 max-w-md">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><Search className="w-4 h-4 text-slate-400" /></div>
        <input type="text" placeholder="Tìm kiếm theo tên file, alt text, tag hoặc tác giả..." value={searchQuery} onChange={(event) => onSearchChange(event.target.value)} className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 sm:text-xs" />
      </div>
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
        {SAVED_FILTERS.map((filter) => (
          <button key={filter.id} onClick={() => onSavedFilterChange(filter.id)} className={`min-h-11 px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap sm:min-h-0 sm:py-1 sm:text-[11px] ${savedFilter === filter.id ? 'bg-slate-800 text-white dark:bg-slate-700 font-bold' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300'}`}>{filter.label}</button>
        ))}
      </div>
    </div>
  );
}
