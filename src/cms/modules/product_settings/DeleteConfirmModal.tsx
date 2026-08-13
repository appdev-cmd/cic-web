import React from 'react';
import { AlertTriangle, Trash2, PauseCircle, X, ShieldAlert } from 'lucide-react';
import { AnyMasterItem } from './types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  item: AnyMasterItem | null;
  onConfirmDeactivate: () => void;
  onConfirmPermanentDelete: () => void;
  onClose: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  item,
  onConfirmDeactivate,
  onConfirmPermanentDelete,
  onClose,
}) => {
  if (!isOpen || !item) return null;

  const hasUsage = item.usage_count > 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-red-500/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-600 text-white rounded-xl shadow-md">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 dark:text-white">
                Xác nhận thay đổi dữ liệu
              </h2>
              <p className="text-xs text-red-600 font-bold">Mã: {item.code}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-slate-500 text-[11px] block">Mục đang xử lý:</span>
            <div className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
              {item.name}
            </div>
            {hasUsage && (
              <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-amber-600 font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Đang có {item.usage_count} sản phẩm/liên hệ phụ thuộc mục này!</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="font-bold text-slate-700 dark:text-slate-300">Vui lòng chọn phương án xử lý:</div>
            
            {/* Action 1: Deactivate */}
            <button
              onClick={onConfirmDeactivate}
              className="w-full p-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl text-left flex items-start gap-3 cursor-pointer transition-all"
            >
              <PauseCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-amber-900 dark:text-amber-300 block">
                  1. Ngừng sử dụng — nên chọn
                </strong>
                <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5">
                  Ẩn khỏi các dropdown lựa chọn mới. Tất cả các sản phẩm cũ giữ nguyên dữ liệu không bị lỗi.
                </p>
              </div>
            </button>

            {/* Action 2: Permanent Delete */}
            <button
              disabled={hasUsage}
              onClick={onConfirmPermanentDelete}
              className={`w-full p-3 border rounded-xl text-left flex items-start gap-3 cursor-pointer transition-all ${
                hasUsage
                  ? 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 opacity-60 cursor-not-allowed'
                  : 'bg-red-500/10 hover:bg-red-500/20 border-red-500/30 text-red-600'
              }`}
            >
              <Trash2 className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block">
                  2. Xóa vĩnh viễn khỏi hệ thống (Delete)
                </strong>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {hasUsage
                    ? 'Chức năng bị khóa do mục này đang được dùng trong sản phẩm. Hãy đổi danh mục sản phẩm trước khi xóa.'
                    : 'Hành động này không thể hoàn tác.'}
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl cursor-pointer"
          >
            Hủy bỏ
          </button>
        </div>

      </div>
    </div>
  );
};
