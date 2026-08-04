import React from 'react';
import { X, ExternalLink, Globe, AlertCircle, Eye, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { BlockItem } from './types';

interface UsedByDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  block: BlockItem | null;
  onOpenPreview: (block: BlockItem, pagePath?: string) => void;
}

export const UsedByDrawer: React.FC<UsedByDrawerProps> = ({
  isOpen,
  onClose,
  block,
  onOpenPreview,
}) => {
  if (!isOpen || !block) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-850">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Danh Sách Trang Sử Dụng (Used-By Impact)</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Khối: <span className="font-semibold text-slate-800 dark:text-slate-200">{block.title}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Summary Box */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold text-lg">
                {block.used_by_count}
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Tổng Vị Trí Ảnh Hưởng</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {block.scope.apply_all_pages ? 'Toàn bộ website (All Pages)' : `${block.used_by_pages.length} nhóm trang chỉ định`}
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50">
              <ShieldCheck className="w-3.5 h-3.5" /> Hoạt động
            </span>
          </div>

          {/* Placement details */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Vị Trí Cấu Hình Trên Trang (Placement Zone)
            </h3>
            <div className="p-3 bg-slate-100/70 dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700 text-sm">
              <span className="text-xs text-slate-400 block font-mono uppercase">PLACEMENT CODE: {block.placement_id || 'CHƯA GÁN'}</span>
              <span className="font-semibold text-slate-900 dark:text-white">{block.placement_name}</span>
            </div>
          </div>

          {/* List of Pages */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Trang Đang Tích Hợp Live ({block.used_by_pages.length})
            </h3>

            {block.used_by_pages.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 overflow-hidden">
                {block.used_by_pages.map((p, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {p.page_title}
                        </p>
                        <p className="text-xs font-mono text-orange-600 dark:text-orange-400 truncate">
                          {p.page_path}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenPreview(block, p.page_path)}
                        className="px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> Xem Demo
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                <AlertCircle className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Khối này chưa được gắn vào trang nào (Khối mồ côi/Draft).
                </p>
              </div>
            )}
          </div>

          {/* Policy notes */}
          <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl space-y-1.5 text-xs text-amber-900 dark:text-amber-200">
            <span className="font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-600" /> Lưu ý Tác động khi Cập nhật
            </span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Mọi thay đổi khi xuất bản (Publish) phiên bản mới sẽ lập tức áp dụng cho toàn bộ các trang trên danh sách. Để chạy thử nghiệm A/B, bạn có thể nhân bản thành khối riêng.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end bg-slate-50 dark:bg-slate-850">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm rounded-lg transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
