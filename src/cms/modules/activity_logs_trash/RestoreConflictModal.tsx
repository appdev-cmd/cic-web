import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import type { TrashItemViewModel as TrashedItem } from '@/features/trash/types';
import type { TrashRestoreMode } from '@/features/trash/types';
import { useDialogA11y } from './useDialogA11y';

interface RestoreConflictModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: TrashedItem | null;
  onConfirmRestore: (item: TrashedItem, mode: TrashRestoreMode) => void;
}

export const RestoreConflictModal: React.FC<RestoreConflictModalProps> = ({
  isOpen,
  onClose,
  item,
  onConfirmRestore,
}) => {
  const [selectedMode, setSelectedMode] = useState<TrashRestoreMode>(() => item?.restoreModes[0] ?? 'as_draft');
  const dialogRef = useDialogA11y(isOpen, onClose);

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-3 backdrop-blur-xs animate-in fade-in duration-200 sm:p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="trash-conflict-title" tabIndex={-1} className="max-h-[calc(100dvh-1.5rem)] w-full max-w-lg space-y-5 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl outline-none animate-in zoom-in-95 duration-200 dark:border-slate-800 dark:bg-slate-900 sm:max-h-[calc(100dvh-2rem)] sm:rounded-3xl sm:p-6">
        {/* MODAL HEADER */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex min-w-0 items-start gap-3">
            <div className="shrink-0 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3 text-amber-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h3 id="trash-conflict-title" className="break-words text-base font-bold text-slate-900 dark:text-white">
                Phát hiện Xung đột / Đứt gãy Liên kết khi Phục hồi
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Vui lòng chọn phương án giải quyết để khôi phục an toàn.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Đóng xử lý xung đột"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:hover:bg-slate-800 dark:hover:text-slate-200 sm:size-9"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* DETAILS OF CONFLICT */}
        <div className="p-3.5 bg-amber-500/5 border border-amber-500/20 rounded-2xl text-xs space-y-1.5">
          <div className="break-words font-bold text-amber-900 dark:text-amber-200">
            Đối tượng: {item.title}
          </div>
          <div className="break-words text-amber-800 dark:text-amber-300">
            <strong>Chi tiết sự cố:</strong> {item.dependencyDetails}
          </div>
        </div>

        {/* RESOLUTION OPTIONS */}
        <div className="space-y-3 text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-300 block">
            Chọn phương án xử lý xung đột (Restore Conflict Policy):
          </span>

          {item.restoreModes.includes('as_draft') && <label
            onClick={() => setSelectedMode('as_draft')}
            className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-2xl border p-3.5 transition-colors ${
              selectedMode === 'as_draft'
                ? 'border-orange-500 bg-orange-500/5 dark:bg-orange-500/10'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <input
              type="radio"
              name="restore_mode"
              checked={selectedMode === 'as_draft'}
              onChange={() => setSelectedMode('as_draft')}
              className="mt-0.5 accent-orange-500"
            />
            <div className="min-w-0">
              <strong className="text-slate-900 dark:text-white block font-semibold">
                1. Phục hồi về Bản nháp (Restore as Draft - Khuyến nghị)
              </strong>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                Đưa bài viết/trang về trạng thái Nháp (Draft) để người quản trị biên tập lại liên kết trước khi xuất bản chính thức.
              </p>
            </div>
          </label>}

          {item.restoreModes.includes('auto_rename') && <label
            onClick={() => setSelectedMode('auto_rename')}
            className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-2xl border p-3.5 transition-colors ${
              selectedMode === 'auto_rename'
                ? 'border-orange-500 bg-orange-500/5 dark:bg-orange-500/10'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <input
              type="radio"
              name="restore_mode"
              checked={selectedMode === 'auto_rename'}
              onChange={() => setSelectedMode('auto_rename')}
              className="mt-0.5 accent-orange-500"
            />
            <div className="min-w-0">
              <strong className="text-slate-900 dark:text-white block font-semibold">
                2. Tự động đổi tên URL/Slug để tránh trùng lặp
              </strong>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                Hệ thống dùng slug ngắn do backend đề xuất sau khi kiểm tra unique; không ghi đè bản ghi đang tồn tại.
              </p>
            </div>
          </label>}

          {item.restoreModes.includes('restore_parent_first') && (
            <label
              onClick={() => setSelectedMode('restore_parent_first')}
              className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-2xl border p-3.5 transition-colors ${
                selectedMode === 'restore_parent_first'
                  ? 'border-orange-500 bg-orange-500/5 dark:bg-orange-500/10'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <input
                type="radio"
                name="restore_mode"
                checked={selectedMode === 'restore_parent_first'}
                onChange={() => setSelectedMode('restore_parent_first')}
                className="mt-0.5 accent-orange-500"
              />
              <div className="min-w-0">
                <strong className="text-slate-900 dark:text-white block font-semibold">
                  3. Đồng thời khôi phục Thư mục Mẹ từ Thùng rác
                </strong>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                  Phục hồi cả đối tượng cha và đối tượng hiện tại để bảo toàn cấu trúc cây thư mục.
                </p>
              </div>
            </label>
          )}
        </div>

        {/* MODAL ACTIONS */}
        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-3 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-end">
          <button
            onClick={onClose}
            className="min-h-11 w-full rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300 sm:w-auto"
          >
            Hủy bỏ
          </button>

          <button
            onClick={() => onConfirmRestore(item, selectedMode)}
            disabled={!item.restoreModes.includes(selectedMode)}
            className="flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Xác nhận Phục hồi An toàn</span>
          </button>
        </div>
      </div>
    </div>
  );
};
