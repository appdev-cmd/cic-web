import React from 'react';
import { X, AlertTriangle, ShieldAlert, CheckCircle2, RefreshCw, ArrowRight, Wrench } from 'lucide-react';
import { ConflictIssue, BlockItem } from './types';

interface ConflictGuardModalProps {
  isOpen: boolean;
  onClose: () => void;
  issues: ConflictIssue[];
  blocks: BlockItem[];
  onResolveIssue: (issueId: string) => void;
}

export const ConflictGuardModal: React.FC<ConflictGuardModalProps> = ({
  isOpen,
  onClose,
  issues,
  blocks,
  onResolveIssue,
}) => {
  if (!isOpen) return null;

  const severityColors = {
    high: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900',
    medium: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900',
    low: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[85vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Kiểm Tra Chất Lượng & Xung Đột (Quality Audit Guard)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Phát hiện {issues.length} vấn đề cần xử lý để đảm bảo hiển thị đồng bộ trên website
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Issues */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {issues.length > 0 ? (
            issues.map((issue) => (
              <div
                key={issue.id}
                className={`p-4 rounded-xl border transition-all ${severityColors[issue.severity]}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded border bg-white/80 dark:bg-slate-900/80">
                        {issue.issue_type.replace('_', ' ')}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider opacity-75">
                        {issue.severity} priority
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                      {issue.block_title}
                    </h4>
                    <p className="text-xs opacity-90 leading-relaxed mt-1">
                      {issue.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onResolveIssue(issue.id)}
                    className="shrink-0 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold rounded-lg border shadow-2xs flex items-center gap-1 transition-colors text-slate-800 dark:text-slate-200"
                  >
                    <Wrench className="w-3.5 h-3.5 text-orange-500" /> Khắc Phục
                  </button>
                </div>

                {issue.affected_pages.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-current/10 text-xs">
                    <span className="font-semibold">Trang ảnh hưởng: </span>
                    <span className="font-mono">{issue.affected_pages.join(', ')}</span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="py-12 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Hệ thống hoàn toàn sạch xung đột!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Tất cả các khối nội dung đều thỏa mãn giới hạn vị trí, lịch trình và ngôn ngữ.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end bg-slate-50 dark:bg-slate-850">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm rounded-lg transition-colors"
          >
            Hoàn Tất Auditing
          </button>
        </div>
      </div>
    </div>
  );
};
