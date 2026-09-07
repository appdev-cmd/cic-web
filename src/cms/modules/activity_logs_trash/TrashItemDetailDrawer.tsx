import React from 'react';
import {
  X,
  Trash2,
  RotateCcw,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Info,
  Lock,
} from 'lucide-react';
import type { TrashItemViewModel as TrashedItem } from '@/features/trash/types';
import { useDialogA11y } from './useDialogA11y';

interface TrashItemDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  item: TrashedItem | null;
  onRestore: (item: TrashedItem, targetState: 'draft' | 'inactive') => void;
  onPermanentDelete: (item: TrashedItem) => void;
  canRestore?: boolean;
  canPurge?: boolean;
}

export const TrashItemDetailDrawer: React.FC<TrashItemDetailDrawerProps> = ({
  isOpen,
  onClose,
  item,
  onRestore,
  onPermanentDelete,
  canRestore = true,
  canPurge = true,
}) => {
  const dialogRef = useDialogA11y(isOpen, onClose);
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end overflow-hidden bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="trash-detail-title" tabIndex={-1} className="flex h-[100dvh] w-full max-w-xl flex-col border-l border-slate-200 bg-white shadow-2xl outline-none animate-in slide-in-from-right duration-300 dark:border-slate-800 dark:bg-slate-900">
        {/* DRAWER HEADER */}
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/80 sm:p-5">
          <div className="flex min-w-0 items-start gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/10 text-red-600 border border-red-500/20 shrink-0">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                THÔNG TIN CHI TIẾT ĐỐI TƯỢNG XÓA MỀM
              </span>
              <h2 id="trash-detail-title" className="break-words text-base font-bold text-slate-900 dark:text-white">
                {item.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Đóng chi tiết Thùng rác"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-200/60 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:hover:bg-slate-800 dark:hover:text-slate-200 sm:size-9"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* RETENTION COUNTDOWN BAR */}
        <div className="flex shrink-0 flex-col items-start gap-2 border-b border-amber-500/20 bg-amber-500/10 px-4 py-3 text-xs text-amber-800 dark:text-amber-300 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex min-w-0 items-start gap-2 sm:items-center">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Hạn tự động tiêu hủy vĩnh viễn: <strong>{item.expiresAt}</strong>
            </span>
          </div>
          <span className="shrink-0 rounded-full bg-amber-500/20 px-2.5 py-0.5 font-mono text-[10px] font-bold text-amber-700 dark:text-amber-200">
            Còn {item.daysRemaining} ngày
          </span>
        </div>

        {/* DRAWER BODY */}
        <div className="flex-1 space-y-5 overflow-y-auto p-4 text-xs sm:p-5">
          {/* LEGAL HOLD WARNING IF ANY */}
          {item.isLegalHold && (
            <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-2xl space-y-2 text-purple-900 dark:text-purple-200">
              <div className="flex items-start gap-2 font-bold text-purple-700 dark:text-purple-300">
                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-purple-600" />
                <span className="min-w-0 break-words">CẢNH BÁO: ĐANG TRONG DIỆN GIỮ CHÂN PHÁP LÝ (LEGAL HOLD)</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {item.legalHoldReason || 'Đối tượng này đang bị khóa thao tác Xóa vĩnh viễn theo chỉ thị thanh tra / lưu trữ bắt buộc.'}
              </p>
            </div>
          )}

          {/* METADATA SUMMARY */}
          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-xs">
              <Info className="w-4 h-4 text-orange-500" />
              <span>Thông tin Lịch sử Xóa</span>
            </h4>

            <div className="space-y-2 text-slate-600 dark:text-slate-300">
              <div className="grid gap-0.5 sm:grid-cols-[minmax(8rem,auto)_minmax(0,1fr)] sm:gap-4">
                <span className="text-slate-400">Loại đối tượng:</span>
                <span className="break-words font-bold text-slate-900 sm:text-right dark:text-white">{item.itemType}</span>
              </div>

              <div className="grid gap-0.5 sm:grid-cols-[minmax(8rem,auto)_minmax(0,1fr)] sm:gap-4">
                <span className="text-slate-400">Module nguồn:</span>
                <span className="break-words font-medium sm:text-right">{item.moduleName}</span>
              </div>

              <div className="grid gap-0.5 sm:grid-cols-[minmax(8rem,auto)_minmax(0,1fr)] sm:gap-4">
                <span className="text-slate-400">Scope Site:</span>
                <span className="break-words font-bold text-orange-600 sm:text-right dark:text-orange-400">{item.scope.siteName}</span>
              </div>

              <div className="grid gap-0.5 sm:grid-cols-[minmax(8rem,auto)_minmax(0,1fr)] sm:gap-4">
                <span className="text-slate-400">Người thực hiện xóa:</span>
                <strong className="break-words text-slate-900 sm:text-right dark:text-white">{item.deletedBy.name} ({item.deletedBy.role})</strong>
              </div>

              <div className="grid gap-0.5 sm:grid-cols-[minmax(8rem,auto)_minmax(0,1fr)] sm:gap-4">
                <span className="text-slate-400">Thời gian xóa:</span>
                <span className="break-words font-mono sm:text-right">{item.deletedAt}</span>
              </div>

              {item.originalUrl && (
                <div className="grid gap-0.5 sm:grid-cols-[minmax(8rem,auto)_minmax(0,1fr)] sm:gap-4">
                  <span className="text-slate-400">Đường dẫn gốc:</span>
                  <span className="break-all font-mono text-blue-500 sm:text-right">{item.originalUrl}</span>
                </div>
              )}
            </div>
          </div>

          {/* DEPENDENCY ANALYSIS CARD */}
          <div
            className={`p-4 rounded-2xl border space-y-2 ${
              item.dependencyStatus === 'clear'
                ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                : 'bg-amber-500/5 border-amber-500/20 text-amber-800 dark:text-amber-300'
            }`}
          >
            <div className="flex items-start gap-2 font-bold">
              {item.dependencyStatus === 'clear' ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              ) : (
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              )}
              <span className="min-w-0 break-words">Kiểm tra Liên kết Phụ thuộc (Dependency Check): {item.dependencyStatus.toUpperCase()}</span>
            </div>
            <p className="break-words opacity-90">{item.dependencyDetails}</p>
          </div>

          {/* SNAPSHOT DATA */}
          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs">
              Dữ liệu Ảnh chụp thời điểm Xóa (Snapshot Data)
            </h4>

            <pre className="max-w-full overflow-x-auto whitespace-pre-wrap break-all rounded-xl bg-slate-900 p-3 font-mono text-[11px] text-slate-100">
              {JSON.stringify(item.snapshotData, null, 2)}
            </pre>
          </div>
          {!item.supportsPurge && item.purgeBlockedReason && <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs leading-5 text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300"><strong className="block text-slate-900 dark:text-white">Không thể xóa vĩnh viễn</strong>{item.purgeBlockedReason}</div>}
        </div>

        {/* DRAWER FOOTER WITH ACTIONS */}
        <div className="flex shrink-0 flex-col items-stretch justify-between gap-3 border-t border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/90 sm:flex-row sm:items-center">
          {canPurge && <button
            onClick={() => onPermanentDelete(item)}
            disabled={item.isLegalHold}
            className="flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900/50 dark:bg-red-950/40 sm:w-auto"
          >
            <Trash2 className="w-4 h-4" />
            <span>Xóa Vĩnh viễn (Permanent Delete)</span>
          </button>}

          <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
            {canRestore && <button
              onClick={() => onRestore(item, 'draft')}
              className="flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 sm:w-auto"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Phục hồi về Bản nháp (Draft)</span>
            </button>}
          </div>
        </div>
      </div>
    </div>
  );
};
