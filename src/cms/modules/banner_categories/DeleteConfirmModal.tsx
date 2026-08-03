import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { BannerCategory } from './types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  itemsToDelete: BannerCategory[];
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  itemsToDelete,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || itemsToDelete.length === 0) return null;

  const isBatch = itemsToDelete.length > 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-500/10 text-red-600 dark:text-red-400 rounded-2xl shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isBatch
                ? `Xác nhận xóa ${itemsToDelete.length} danh mục banner`
                : 'Xác nhận xóa danh mục banner'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Hành động này không thể hoàn tác.
            </p>
          </div>
        </div>

        {/* List of items to delete */}
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 max-h-40 overflow-y-auto space-y-1.5 border border-slate-200/60 dark:border-slate-700/60">
          {itemsToDelete.map((item) => (
            <div
              key={item.id}
              className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              <span className="truncate">{item.name}</span>
              <span className="text-[11px] font-mono text-slate-400 shrink-0">
                ({item.width}x{item.height}px)
              </span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Xác nhận xóa</span>
          </button>
        </div>
      </div>
    </div>
  );
};
