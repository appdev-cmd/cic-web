import React from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';
import { NewsArticle } from './types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  itemsToDelete: NewsArticle[];
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  itemsToDelete,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  const isMultiple = itemsToDelete.length > 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Warning Icon & Header */}
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-500/10 text-red-600 dark:text-red-400 rounded-2xl shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isMultiple
                ? `Xác nhận xóa ${itemsToDelete.length} bài viết tin tức?`
                : 'Xác nhận xóa bài viết tin tức?'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Thao tác này sẽ xóa hoàn toàn bài viết khỏi hệ thống CMS. Hành động này không thể hoàn tác.
            </p>
          </div>
        </div>

        {/* Items List Preview */}
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl p-3 max-h-40 overflow-y-auto space-y-2 text-xs">
          {itemsToDelete.map((item) => (
            <div key={item.id} className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              <span className="font-semibold truncate">{item.title}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Xác nhận xóa</span>
          </button>
        </div>
      </div>
    </div>
  );
};
