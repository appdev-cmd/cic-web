import React from 'react';
import { AlertTriangle, Trash2, Archive, X } from 'lucide-react';
import { ProductItem } from './types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  product: ProductItem | null;
  onConfirmArchive: () => void;
  onConfirmPermanentDelete: () => void;
  onClose: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  product,
  onConfirmArchive,
  onConfirmPermanentDelete,
  onClose,
}) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden p-6 space-y-5">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-500/10 text-red-600 rounded-2xl shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Xác nhận Lưu trữ hoặc Xóa sản phẩm
            </h3>
            <p className="text-xs text-slate-500">
              Bạn đang thao tác trên sản phẩm: <span className="font-bold text-slate-900 dark:text-slate-100">"{product.title}"</span> (SKU: {product.sku}).
            </p>
          </div>
        </div>

        {/* Dependent Usage Warning */}
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-xl p-3 text-xs text-amber-800 dark:text-amber-300 space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Cảnh báo liên kết hệ thống:</span>
          </p>
          <p className="text-[11px] leading-relaxed">
            Sản phẩm này có thể đang có yêu cầu báo giá/liên hệ chưa xử lý từ khách hàng hoặc xuất hiện trên danh mục website public.
          </p>
        </div>

        {/* Actions Choice */}
        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={onConfirmArchive}
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-600 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
          >
            <Archive className="w-4 h-4" />
            <span>Chuyển vào lưu trữ — nên chọn</span>
          </button>

          <button
            type="button"
            onClick={onConfirmPermanentDelete}
            className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-red-600/20 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>Xóa vĩnh viễn khỏi hệ thống (Không thể hoàn tác)</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors"
          >
            Hủy bỏ
          </button>
        </div>
      </div>
    </div>
  );
};
