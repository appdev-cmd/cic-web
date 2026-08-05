import React from 'react';
import { X, ShieldAlert, AlertTriangle, Info, CheckCircle2, ArrowUpRight, Wrench } from 'lucide-react';
import { ValidationIssue } from './types';

interface MenuValidationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  issues: ValidationIssue[];
  onFixIssue: (issue: ValidationIssue) => void;
  onRevalidate: () => void;
  isValidating: boolean;
}

export const MenuValidationPanel: React.FC<MenuValidationPanelProps> = ({
  isOpen,
  onClose,
  issues,
  onFixIssue,
  onRevalidate,
  isValidating,
}) => {
  if (!isOpen) return null;

  const criticalCount = issues.filter((i) => i.severity === 'critical').length;
  const warningCount = issues.filter((i) => i.severity === 'warning').length;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Kiểm tra Cấu trúc & Link Health</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Phát hiện liên kết gãy, cấu trúc lặp vòng hoặc menu vượt quá độ sâu cho phép.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Bar */}
        <div className="p-4 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 text-xs font-bold rounded-lg bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300">
              {criticalCount} Lỗi nghiêm trọng
            </span>
            <span className="px-2 py-1 text-xs font-bold rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
              {warningCount} Cảnh báo
            </span>
          </div>

          <button
            onClick={onRevalidate}
            disabled={isValidating}
            className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white rounded-lg shadow-2xs hover:bg-slate-50 transition flex items-center gap-1"
          >
            <Wrench className={`w-3.5 h-3.5 ${isValidating ? 'animate-spin text-orange-500' : ''}`} />
            <span>{isValidating ? 'Đang quét...' : 'Quét lại cây'}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          {issues.length === 0 ? (
            <div className="py-16 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-900 dark:text-white">Cây Menu hoàn toàn hợp lệ!</p>
              <p className="text-xs text-slate-500 mt-1">
                Không có lỗi broken link hoặc vi phạm quy tắc độ sâu. Sẵn sàng Publish.
              </p>
            </div>
          ) : (
            issues.map((issue) => {
              const isCritical = issue.severity === 'critical';
              return (
                <div
                  key={issue.id}
                  className={`p-4 rounded-xl border transition ${
                    isCritical
                      ? 'border-red-200 bg-red-50/40 dark:border-red-900/60 dark:bg-red-950/20'
                      : 'border-amber-200 bg-amber-50/40 dark:border-amber-900/60 dark:bg-amber-950/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      {isCritical ? (
                        <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                      ) : (
                        <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      )}
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {issue.item_label}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        isCritical
                          ? 'bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-amber-200 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                      }`}
                    >
                      {issue.code}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 mb-2">{issue.message}</p>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-400 space-y-1.5">
                    <p className="font-semibold text-slate-900 dark:text-slate-200">Gợi ý khắc phục:</p>
                    <p>{issue.suggested_action}</p>
                    <button
                      onClick={() => onFixIssue(issue)}
                      className="mt-1 text-xs font-bold text-orange-600 hover:text-orange-700 dark:text-orange-400 flex items-center gap-1 hover:underline"
                    >
                      <span>Mở Form sửa mục này</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition"
          >
            Đóng bảng kiểm soát
          </button>
        </div>
      </div>
    </div>
  );
};
