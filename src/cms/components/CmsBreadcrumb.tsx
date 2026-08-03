import React from 'react';
import { ChevronRight, Home, RefreshCw, Download, Plus } from 'lucide-react';

interface CmsBreadcrumbProps {
  items: { label: string; path?: string }[];
  pageTitle: string;
  pageDescription?: string;
  onRefresh?: () => void;
  onExport?: () => void;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  hideHeaderBar?: boolean;
}

export const CmsBreadcrumb: React.FC<CmsBreadcrumbProps> = ({
  items,
  pageTitle,
  pageDescription,
  onRefresh,
  onExport,
  primaryActionLabel,
  onPrimaryAction,
  hideHeaderBar = false,
}) => {
  return (
    <div className="space-y-3 mb-6">
      {/* Breadcrumb Trail */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer">
          <Home className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
          <span>CIC Admin</span>
        </span>

        {items.map((item, idx) => (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
            <span
              className={
                idx === items.length - 1
                  ? 'font-medium text-slate-800 dark:text-slate-200'
                  : 'hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer'
              }
            >
              {item.label}
            </span>
          </React.Fragment>
        ))}
      </nav>

      {/* Page Header Bar (Only rendered when not hidden) */}
      {!hideHeaderBar && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {pageTitle}
            </h1>
            {pageDescription && (
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {pageDescription}
              </p>
            )}
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Tải lại dữ liệu"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden md:inline">Làm mới</span>
              </button>
            )}

            {onExport && (
              <button
                onClick={onExport}
                className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Xuất file báo cáo"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden md:inline">Xuất báo cáo</span>
              </button>
            )}

            {primaryActionLabel && onPrimaryAction && (
              <button
                onClick={onPrimaryAction}
                className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{primaryActionLabel}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
