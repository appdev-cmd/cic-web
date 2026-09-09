import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import type { ProductItem } from './types';

interface DeleteConfirmModalProps { isOpen: boolean; product: ProductItem | null; onConfirmPermanentDelete: () => void; onClose: () => void }

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ isOpen, product, onConfirmPermanentDelete, onClose }) => {
  if (!isOpen || !product) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-200" role="dialog" aria-modal="true" aria-labelledby="product-delete-title">
    <div className="w-full max-w-md space-y-5 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start gap-4"><div className="shrink-0 rounded-2xl bg-red-500/10 p-3 text-red-600"><AlertTriangle className="h-6 w-6" /></div><div className="space-y-1"><h3 id="product-delete-title" className="text-base font-bold text-slate-900 dark:text-white">Đưa sản phẩm vào Thùng rác?</h3><p className="text-xs text-slate-500">Sản phẩm <span className="font-bold text-slate-900 dark:text-slate-100">“{product.name || product.title}”</span> sẽ bị gỡ khỏi website nếu đang xuất bản.</p></div></div>
      <div className="space-y-1 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-800/80 dark:bg-amber-950/40 dark:text-amber-300"><p className="flex items-center gap-1.5 font-bold"><AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />Kiểm tra liên kết hệ thống</p><p className="text-[11px] leading-relaxed">Hệ thống sẽ chặn thao tác nếu sản phẩm còn được Đơn hàng, Liên hệ, Dự án, Dịch vụ hoặc sản phẩm khác sử dụng. Dữ liệu hợp lệ có thể phục hồi từ Thùng rác.</p></div>
      <div className="space-y-2 pt-2"><button type="button" onClick={onConfirmPermanentDelete} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-red-600/20 transition-all hover:bg-red-700"><Trash2 className="h-4 w-4" />Đưa vào Thùng rác</button><button type="button" onClick={onClose} className="min-h-11 w-full rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">Hủy bỏ</button></div>
    </div>
  </div>;
};
