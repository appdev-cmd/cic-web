import React from 'react';
import { X, AlertTriangle, ArrowRight, Check, History } from 'lucide-react';
import { TranslationItem } from './types';

interface SourceDiffModalProps {
  isOpen: boolean;
  item: TranslationItem | null;
  onClose: () => void;
  onConfirmRebase: (itemId: string) => void;
}

export const SourceDiffModal: React.FC<SourceDiffModalProps> = ({
  isOpen,
  item,
  onClose,
  onConfirmRebase,
}) => {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                So sánh Diff Nguồn Tiếng Việt (Source Updated Diff)
              </h3>
              <p className="font-mono text-xs text-slate-500">{item.key}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Old Source */}
            <div className="p-4 bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-xl space-y-2">
              <span className="font-bold text-rose-700 dark:text-rose-400 block text-[11px]">
                Nguồn Tiếng Việt cũ (Trước khi sửa):
              </span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans line-through">
                {item.previous_source_text || 'Chưa có lịch sử nguồn cũ'}
              </p>
            </div>

            {/* New Source */}
            <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-xl space-y-2">
              <span className="font-bold text-emerald-700 dark:text-emerald-400 block text-[11px]">
                Nguồn Tiếng Việt mới (Hiện tại):
              </span>
              <p className="text-slate-900 dark:text-slate-100 leading-relaxed font-semibold">
                {item.source_text}
              </p>
            </div>
          </div>

          {/* Current Target reference */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="font-bold text-slate-600 dark:text-slate-400 block text-[11px]">
              Bản dịch Tiếng Anh hiện tại đang lưu (Cần cập nhật theo nguồn mới):
            </span>
            <p className="text-slate-900 dark:text-slate-100 italic">
              {item.target_text || 'Chưa có bản dịch (Empty string)'}
            </p>
          </div>

          <p className="text-slate-500 text-[11px]">
            Nhấn "Xác nhận đã hiểu & Chuyển sang Đang dịch" để mở Trình biên soạn và cập nhật bản dịch tương ứng.
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs"
          >
            Đóng
          </button>
          <button
            onClick={() => {
              onConfirmRebase(item.id);
              onClose();
            }}
            className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors"
          >
            Xác nhận & Cập nhật bản dịch
          </button>
        </div>
      </div>
    </div>
  );
};
