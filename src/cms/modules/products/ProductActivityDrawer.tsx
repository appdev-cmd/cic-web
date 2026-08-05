import React from 'react';
import { X, History, GitBranch, CheckCircle, Clock, User, ShieldCheck, ArrowRight, Tag } from 'lucide-react';
import { ProductItem, ProductActivityLog } from './types';

interface ProductActivityDrawerProps {
  isOpen: boolean;
  product: ProductItem | null;
  activityLogs: ProductActivityLog[];
  onClose: () => void;
}

export const ProductActivityDrawer: React.FC<ProductActivityDrawerProps> = ({
  isOpen,
  product,
  activityLogs,
  onClose,
}) => {
  if (!isOpen || !product) return null;

  const productLogs = activityLogs.filter((l) => l.product_id === product.id);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-2xs animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/80">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-500/10 text-blue-600 rounded-xl">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Nhật ký Hoạt động & Phiên bản
                </h3>
                <p className="text-[11px] text-slate-500 truncate max-w-xs">{product.title}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6 text-xs">
            {/* Version Overview Card */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <GitBranch className="w-4 h-4 text-orange-600" />
                  <span>Trạng thái phiên bản:</span>
                </span>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 font-bold text-[10px] rounded-full border border-emerald-500/20">
                  {product.editorial_status === 'published' ? 'Đang hiển thị công khai' : product.editorial_status}
                </span>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between text-slate-500">
                  <span>Mã SKU:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{product.sku}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Phiên bản đang chỉnh sửa:</span>
                  <span className="font-mono font-bold text-orange-600">
                    {product.working_version_id || 'Không có (Dùng bản Live)'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Cập nhật gần nhất:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{product.updated_time}</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] text-slate-400">
                Lịch sử thay đổi gần đây
              </h4>

              {productLogs.length > 0 ? (
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                  {productLogs.map((log) => (
                    <div key={log.id} className="relative space-y-1">
                      {/* Bullet icon */}
                      <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-white dark:bg-slate-900 border-2 border-orange-500 flex items-center justify-center text-orange-600 shadow-2xs">
                        <Clock className="w-2.5 h-2.5" />
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          {log.user_avatar ? (
                            <img src={log.user_avatar} alt="" className="w-4 h-4 rounded-full" />
                          ) : (
                            <User className="w-3.5 h-3.5 text-slate-400" />
                          )}
                          <span>{log.user_name}</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{log.timestamp}</span>
                      </div>

                      <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-600 font-bold text-[9px] rounded uppercase">
                            {log.action}
                          </span>
                          {log.version_tag && (
                            <span className="text-[10px] font-mono text-slate-400 font-bold">
                              [{log.version_tag}]
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                          {log.details}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 italic text-xs">
                  Chưa có thêm ghi nhận lịch sử nào cho sản phẩm này.
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-right">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
