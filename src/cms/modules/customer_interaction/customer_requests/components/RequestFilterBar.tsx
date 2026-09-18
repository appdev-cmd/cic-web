import React from 'react';
import { Search, X, Calendar, FileSpreadsheet, RotateCcw } from 'lucide-react';
import type { RequestFilterState } from '../types';
import { REQUEST_STATUSES } from '../../shared/constants/statusTypes';

export interface RequestFilterOption {
  id: string;
  name: string;
}

export interface RequestFilterBarProps {
  workspaceLocale?: 'vi' | 'en';
  filter: RequestFilterState;
  onFilterChange: (newFilter: RequestFilterState) => void;
  onResetFilters: () => void;
  onExportCSV: () => void;
  hasActiveFilters: boolean;
  totalCount: number;
  formOptions: RequestFilterOption[];
  ctaOptions: RequestFilterOption[];
  assigneeOptions: RequestFilterOption[];
}

export const RequestFilterBar: React.FC<RequestFilterBarProps> = ({
  workspaceLocale = 'vi',
  filter,
  onFilterChange,
  onResetFilters,
  onExportCSV,
  hasActiveFilters,
  totalCount,
  formOptions,
  ctaOptions,
  assigneeOptions,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-4">
      {/* Top Row: Search & Export & Reset */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Keyword Search Input */}
        <div className="relative flex items-center flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="w-4 h-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder={workspaceLocale === "en" ? "Search by name, email, phone, company, message, code..." : "Tìm kiếm theo tên, email, sđt, công ty, nội dung, mã yêu cầu..."}
            value={filter.searchQuery}
            onChange={(e) => {
              onFilterChange({ ...filter, searchQuery: e.target.value });
            }}
            className="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 transition-colors"
          />
          {filter.searchQuery && (
            <button
              type="button"
              onClick={() => {
                onFilterChange({ ...filter, searchQuery: '' });
              }}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Date Range Inputs */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-600 dark:text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-orange-500 shrink-0" />
            <span className="text-[11px] text-slate-400">{workspaceLocale === "en" ? "From:" : "Từ:"}</span>
            <input
              type="date"
              value={filter.dateFrom || ''}
              onChange={(e) => {
                onFilterChange({ ...filter, dateFrom: e.target.value || undefined });
              }}
              className="bg-transparent focus:outline-none text-xs text-slate-800 dark:text-slate-200 cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-600 dark:text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-orange-500 shrink-0" />
            <span className="text-[11px] text-slate-400">{workspaceLocale === "en" ? "To:" : "Đến:"}</span>
            <input
              type="date"
              value={filter.dateTo || ''}
              onChange={(e) => {
                onFilterChange({ ...filter, dateTo: e.target.value || undefined });
              }}
              className="bg-transparent focus:outline-none text-xs text-slate-800 dark:text-slate-200 cursor-pointer"
            />
          </div>

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={onExportCSV}
            className="px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold rounded-xl text-xs flex items-center gap-1.5 shrink-0 shadow-2xs transition-all cursor-pointer"
            title="Xuất file CSV danh sách yêu cầu đang lọc"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{workspaceLocale === "en" ? `Export CSV (${totalCount})` : `Xuất CSV (${totalCount})`}</span>
          </button>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="ml-auto flex h-9 w-24 shrink-0 items-center justify-center gap-1 rounded-xl bg-slate-100 px-0 text-xs font-semibold text-slate-600 transition-all hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer"
              title="Xóa tất cả điều kiện lọc"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{workspaceLocale === "en" ? "Reset filters" : "Xóa bộ lọc"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Row: Specific Dropdown Filters */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
        {/* Form Filter */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">
            {workspaceLocale === "en" ? "Form" : "Biểu mẫu"}
          </label>
          <select
            value={filter.formId || ''}
            onChange={(e) => {
              onFilterChange({ ...filter, formId: e.target.value || undefined });
            }}
            className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-orange-500 cursor-pointer truncate"
          >
            <option value="">{workspaceLocale === "en" ? "All Forms" : "Tất cả Biểu mẫu"}</option>
            {formOptions.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        {/* CTA Filter */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">
            CTA
          </label>
          <select
            value={filter.ctaId || ''}
            onChange={(e) => {
              onFilterChange({ ...filter, ctaId: e.target.value || undefined });
            }}
            className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-orange-500 cursor-pointer truncate"
          >
            <option value="">{workspaceLocale === "en" ? "All CTAs" : "Tất cả CTA"}</option>
            {ctaOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">
            {workspaceLocale === "en" ? "Status" : "Trạng thái"}
          </label>
          <select
            value={filter.status || ''}
            onChange={(e) => {
              onFilterChange({ ...filter, status: (e.target.value as any) || undefined });
            }}
            className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-orange-500 cursor-pointer truncate"
          >
            <option value="">{workspaceLocale === "en" ? "All Statuses" : "Tất cả Trạng thái"}</option>
            {REQUEST_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        {/* Assignee Filter */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">
            {workspaceLocale === "en" ? "Assignee" : "Người phụ trách"}
          </label>
          <select
            value={filter.assignedUserId || ''}
            onChange={(e) => {
              onFilterChange({ ...filter, assignedUserId: e.target.value || undefined });
            }}
            className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-orange-500 cursor-pointer truncate"
          >
            <option value="">{workspaceLocale === "en" ? "All Staff" : "Tất cả Người phụ trách"}</option>
            <option value="unassigned">Chưa phân công</option>
            {assigneeOptions.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
