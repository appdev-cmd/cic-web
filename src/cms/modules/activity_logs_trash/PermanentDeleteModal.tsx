import React, { useState } from 'react';
import {
  X,
  Trash2,
  Lock,
} from 'lucide-react';
import type { TrashItemViewModel as TrashedItem } from '@/features/trash/types';
import { useDialogA11y } from './useDialogA11y';

interface PermanentDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: TrashedItem | null;
  onConfirmDelete: (item: TrashedItem, reason: string) => void;
}

export const PermanentDeleteModal: React.FC<PermanentDeleteModalProps> = ({
  isOpen,
  onClose,
  item,
  onConfirmDelete,
}) => {
  const [confirmText, setConfirmText] = useState('');
  const [deleteReason, setDeleteReason] = useState('');
  const dialogRef = useDialogA11y(isOpen, onClose);

  if (!isOpen || !item) return null;

  const isConfirmed = confirmText.trim().toUpperCase() === 'XÓA VĨNH VIỄN' && deleteReason.trim().length >= 5;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-3 backdrop-blur-xs animate-in fade-in duration-200 sm:p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div ref={dialogRef} role="alertdialog" aria-modal="true" aria-labelledby="trash-purge-title" tabIndex={-1} className="max-h-[calc(100dvh-1.5rem)] w-full max-w-lg space-y-5 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl outline-none animate-in zoom-in-95 duration-200 dark:border-slate-800 dark:bg-slate-900 sm:max-h-[calc(100dvh-2rem)] sm:rounded-3xl sm:p-6">
        {/* MODAL HEADER */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex min-w-0 items-start gap-3">
            <div className="shrink-0 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-red-600">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h3 id="trash-purge-title" className="break-words text-base font-bold text-slate-900 dark:text-white">
                Xác nhận Xóa Vĩnh viễn (Permanent Delete)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Hành động này KHÔNG THỂ KHÔI PHỤC. Vui lòng xác nhận thận trọng.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Đóng xác nhận xóa vĩnh viễn"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:hover:bg-slate-800 dark:hover:text-slate-200 sm:size-9"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* LEGAL HOLD CHECK */}
        {item.isLegalHold ? (
          <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-2xl space-y-2 text-purple-900 dark:text-purple-200 text-xs">
            <div className="flex items-start gap-2 font-bold text-purple-700 dark:text-purple-300">
              <Lock className="mt-0.5 h-4 w-4 shrink-0 text-purple-600" />
              <span className="min-w-0 break-words">HÀNH ĐỘNG BỊ CHẶN BỞI LỆNH GIỮ CHÂN PHÁP LÝ (LEGAL HOLD)</span>
            </div>
            <p>
              Đối tượng này hiện không thể bị xóa vĩnh viễn do đang thuộc chính sách bảo lưu hồ sơ thanh tra.
            </p>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            <div className="space-y-1 rounded-2xl border border-red-500/20 bg-red-500/5 p-3.5">
              <div className="break-words font-bold text-red-900 dark:text-red-200">
                Đối tượng tiêu hủy: {item.title}
              </div>
              <p className="break-words text-red-700 dark:text-red-300">
                Loại: {item.itemType} • Scope: {item.scope.siteName}
              </p>
            </div>

            <div className="space-y-2">
              <label className="font-bold text-slate-700 dark:text-slate-300 block">
                Nhập lý do thực hiện tiêu hủy vĩnh viễn (Audit Metadata Requirement):
              </label>
              <textarea
                rows={2}
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="VD: Tiêu hủy dữ liệu cũ tuân thủ chính sách bảo mật / Hết thời hạn lưu trữ GDPR..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-base focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:border-slate-700 dark:bg-slate-800 sm:text-sm"
              />
              {deleteReason.length > 0 && deleteReason.trim().length < 5 && <p className="text-[11px] font-semibold text-red-600 dark:text-red-300">Lý do phải có ít nhất 5 ký tự.</p>}
            </div>

            <div className="space-y-2">
              <label className="font-bold text-slate-700 dark:text-slate-300 block">
                Gõ chính xác cụm từ <span className="text-red-600 font-mono">XÓA VĨNH VIỄN</span> để mở khóa:
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="XÓA VĨNH VIỄN"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-mono text-base focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:border-slate-700 dark:bg-slate-800 sm:text-sm"
              />
            </div>
          </div>
        )}

        {/* MODAL ACTIONS */}
        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-3 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-end">
          <button
            onClick={onClose}
            className="min-h-11 w-full rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300 sm:w-auto"
          >
            Hủy bỏ
          </button>

          <button
            onClick={() => {
              onConfirmDelete(item, deleteReason);
              onClose();
            }}
            disabled={!isConfirmed || item.isLegalHold}
            className="flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-red-600/20 transition-all hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
          >
            <Trash2 className="w-4 h-4" />
            <span>Tiêu hủy Vĩnh viễn (Irreversible)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
