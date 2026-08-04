import React from 'react';
import {
  X,
  AlertTriangle,
  Package,
  Mail,
  UserCheck,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';
import { AnyMasterItem, UsageImpactRecord } from './types';
import { mockUsageImpactRecords } from './mockData';

interface UsageImpactDrawerProps {
  isOpen: boolean;
  item: AnyMasterItem | null;
  onClose: () => void;
  onOpenHandover?: (item: AnyMasterItem) => void;
}

export const UsageImpactDrawer: React.FC<UsageImpactDrawerProps> = ({
  isOpen,
  item,
  onClose,
  onOpenHandover,
}) => {
  if (!isOpen || !item) return null;

  const records = mockUsageImpactRecords;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between animate-in slide-in-from-right duration-250">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-500/10 text-orange-600 rounded-xl">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Nơi sử dụng & Tác động Dependency
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Kiểm tra danh sách các Sản phẩm, Đơn hàng & Liên hệ đang dùng mục này
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Master Item Banner */}
        <div className="p-4 bg-orange-500/5 border-b border-orange-500/15 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-orange-600 text-white font-mono text-[10px] font-bold rounded uppercase">
                {item.type}
              </span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                {item.name}
              </span>
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-3">
              <span>Mã: <strong className="font-mono text-slate-700 dark:text-slate-300">{item.code}</strong></span>
              <span>•</span>
              <span>Đang sử dụng trong: <strong className="text-orange-600">{item.usage_count} đối tượng</strong></span>
            </div>
          </div>

          <span
            className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border ${
              item.status === 'active'
                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
            }`}
          >
            {item.status}
          </span>
        </div>

        {/* Drawer Body - List of Affected Items */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {/* Policy Info Card */}
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <strong className="font-bold block text-amber-900 dark:text-amber-200 mb-0.5">
                Quy tắc an toàn dữ liệu Master Data:
              </strong>
              <p className="leading-relaxed text-[11px]">
                Khi ngưng sử dụng (Deactivate), giá trị này sẽ không còn xuất hiện trong ô chọn mới của Form Sản phẩm, nhưng tất cả các sản phẩm cũ dưới đây vẫn được giữ nguyên để bảo tồn lịch sử kinh doanh.
              </p>
            </div>
          </div>

          {/* Affected List Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
              <span>Danh sách đối tượng liên quan ({records.length})</span>
              <span className="text-[11px] text-slate-400 font-normal">Phạm vi sử dụng hiện tại</span>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {records.map((rec) => (
                <div key={rec.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg shrink-0">
                      {rec.type === 'product' ? (
                        <Package className="w-4 h-4 text-orange-600" />
                      ) : (
                        <Mail className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white line-clamp-1">
                        {rec.title}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-slate-600 dark:text-slate-300 font-medium">
                          {rec.sku_or_code}
                        </span>
                        {rec.owner_name && (
                          <>
                            <span>•</span>
                            <span>{rec.owner_name}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 font-mono text-[10px] font-bold rounded">
                      {rec.status}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">{rec.updated_time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between gap-3">
          {item.type === 'sales_staff' ? (
            <button
              onClick={() => onOpenHandover && onOpenHandover(item)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Bàn giao phụ trách (Handover)</span>
            </button>
          ) : (
            <div className="text-[11px] text-slate-500">
              Cần thay đổi hàng loạt? Dùng tính năng Chuyển danh mục / Hãng trong Sản phẩm.
            </div>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl cursor-pointer"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
