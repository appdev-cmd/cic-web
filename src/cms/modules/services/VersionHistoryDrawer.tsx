import React from 'react';
import { X, GitCommit, Clock, CheckCircle2, RotateCcw, Eye, FileText } from 'lucide-react';
import { ServiceVersion } from './types';

interface VersionHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  serviceTitle: string;
  versions: ServiceVersion[];
  onRestoreVersion?: (version: ServiceVersion) => void;
}

export const VersionHistoryDrawer: React.FC<VersionHistoryDrawerProps> = ({
  isOpen,
  onClose,
  serviceTitle,
  versions,
  onRestoreVersion,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg">
              <GitCommit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                Lịch sử phiên bản & Working Draft
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">
                {serviceTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 rounded-lg text-xs text-blue-800 dark:text-blue-300">
            <strong>Nguyên tắc Working Version:</strong> Sửa đổi phiên bản Active/Published sẽ tự động tạo bản thảo nháp mới mà không gián đoạn dịch vụ công khai hiện tại.
          </div>

          <div className="space-y-3">
            {versions.map((ver) => (
              <div
                key={ver.id}
                className={`p-4 rounded-xl border transition-all ${
                  ver.is_published_version
                    ? 'border-emerald-300 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                      v{ver.version_number}.0
                    </span>
                    {ver.is_published_version && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Bản đang phát hành
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {ver.updated_at}
                  </span>
                </div>

                <p className="text-xs font-medium text-slate-800 dark:text-slate-200 mb-1">
                  {ver.title}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-3">
                  "{ver.change_log}"
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <span className="text-slate-500">Người cập nhật: {ver.updated_by}</span>
                  <div className="flex items-center gap-2">
                    {!ver.is_published_version && onRestoreVersion && (
                      <button
                        onClick={() => onRestoreVersion(ver)}
                        className="px-2.5 py-1 bg-white hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded text-xs font-medium flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" /> Khôi phục bản này
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-lg transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
