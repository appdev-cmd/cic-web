import React from 'react';
import { X, ExternalLink, Link2, AlertTriangle, ShieldAlert, LayoutGrid, Menu as MenuIcon, CheckCircle2 } from 'lucide-react';
import { StaticPage } from './types';

interface UsedByDrawerProps {
  isOpen: boolean;
  page: StaticPage | null;
  onClose: () => void;
}

export const UsedByDrawer: React.FC<UsedByDrawerProps> = ({ isOpen, page, onClose }) => {
  if (!isOpen || !page) return null;

  const usedByList = page.used_by || [];
  const isOrphan = usedByList.length === 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Nơi sử dụng (Used-By)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[260px]">
                {page.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {/* Summary Banner */}
          {isOrphan ? (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  Trang chưa được liên kết (Trang mồ côi)
                </h4>
                <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-1 leading-relaxed">
                  Trang này hiện không được trỏ từ Menu, Footer hay Block giao diện nào. Khách truy cập khó có thể tìm thấy nếu không có đường dẫn trực tiếp.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                  Đang được liên kết tại {usedByList.length} vị trí
                </h4>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-1 leading-relaxed">
                  Thay đổi đường dẫn (URL Alias) hoặc ẩn/xóa trang này có thể làm gãy các liên kết bên dưới.
                </p>
              </div>
            </div>
          )}

          {/* List of references */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Danh sách vị trí trỏ tới trang
            </h4>

            {usedByList.length > 0 ? (
              <div className="space-y-2.5">
                {usedByList.map((ref) => (
                  <div
                    key={ref.id}
                    className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 hover:border-orange-300 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wide bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 flex items-center gap-1">
                        {ref.type === 'menu' && <MenuIcon className="w-3 h-3" />}
                        {ref.type === 'footer' && <LayoutGrid className="w-3 h-3" />}
                        {ref.type === 'block' && <LayoutGrid className="w-3 h-3" />}
                        {ref.type}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">ID: {ref.id}</span>
                    </div>

                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {ref.location_name}
                    </p>

                    <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-slate-500">
                      <span className="truncate max-w-[240px] text-slate-600 dark:text-slate-400">
                        {ref.link_url}
                      </span>
                      <a
                        href={`https://cic.com.vn${ref.link_url}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-orange-600 hover:underline flex items-center gap-0.5 shrink-0"
                      >
                        Mở link <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs italic">
                Không có dữ liệu trỏ tới trang này.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
