import React from 'react';
import {
  X,
  Trash2,
  RotateCcw,
  Clock,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Globe,
  FileText,
  User,
  Info,
  Calendar,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { TrashedItem } from './types';

interface TrashItemDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  item: TrashedItem | null;
  onRestore: (item: TrashedItem, targetState: 'draft' | 'inactive') => void;
  onPermanentDelete: (item: TrashedItem) => void;
}

export const TrashItemDetailDrawer: React.FC<TrashItemDetailDrawerProps> = ({
  isOpen,
  onClose,
  item,
  onRestore,
  onPermanentDelete,
}) => {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">
        {/* DRAWER HEADER */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/10 text-red-600 border border-red-500/20 shrink-0">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                THÔNG TIN CHI TIẾT ĐỐI TƯỢNG XÓA MỀM
              </span>
              <h2 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                {item.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* RETENTION COUNTDOWN BAR */}
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-5 py-3 flex items-center justify-between text-xs text-amber-800 dark:text-amber-300">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Hạn tự động tiêu hủy vĩnh viễn: <strong>{item.expiresAt}</strong>
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-200">
            Còn {item.daysRemaining} ngày
          </span>
        </div>

        {/* DRAWER BODY */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {/* LEGAL HOLD WARNING IF ANY */}
          {item.isLegalHold && (
            <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-2xl space-y-2 text-purple-900 dark:text-purple-200">
              <div className="flex items-center gap-2 font-bold text-purple-700 dark:text-purple-300">
                <Lock className="w-4 h-4 text-purple-600" />
                <span>CẢNH BÁO: ĐANG TRONG DIỆN GIỮ CHÂN PHÁP LÝ (LEGAL HOLD)</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {item.legalHoldReason || 'Đối tượng này đang bị khóa thao tác Xóa vĩnh viễn theo chỉ thị thanh tra / lưu trữ bắt buộc.'}
              </p>
            </div>
          )}

          {/* METADATA SUMMARY */}
          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-xs">
              <Info className="w-4 h-4 text-orange-500" />
              <span>Thông tin Lịch sử Xóa</span>
            </h4>

            <div className="space-y-2 text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Loại đối tượng:</span>
                <span className="font-bold text-slate-900 dark:text-white">{item.itemType}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Module nguồn:</span>
                <span className="font-medium">{item.moduleName}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Scope Site:</span>
                <span className="font-bold text-orange-600 dark:text-orange-400">{item.scope.siteName}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Người thực hiện xóa:</span>
                <strong className="text-slate-900 dark:text-white">{item.deletedBy.name} ({item.deletedBy.role})</strong>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Thời gian xóa:</span>
                <span className="font-mono">{item.deletedAt}</span>
              </div>

              {item.originalUrl && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Đường dẫn gốc:</span>
                  <span className="font-mono text-blue-500 truncate max-w-[200px]">{item.originalUrl}</span>
                </div>
              )}
            </div>
          </div>

          {/* DEPENDENCY ANALYSIS CARD */}
          <div
            className={`p-4 rounded-2xl border space-y-2 ${
              item.dependencyStatus === 'clear'
                ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                : 'bg-amber-500/5 border-amber-500/20 text-amber-800 dark:text-amber-300'
            }`}
          >
            <div className="flex items-center gap-2 font-bold">
              {item.dependencyStatus === 'clear' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              )}
              <span>Kiểm tra Liên kết Phụ thuộc (Dependency Check): {item.dependencyStatus.toUpperCase()}</span>
            </div>
            <p className="opacity-90">{item.dependencyDetails}</p>
          </div>

          {/* SNAPSHOT DATA */}
          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs">
              Dữ liệu Ảnh chụp thời điểm Xóa (Snapshot Data)
            </h4>

            <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(item.snapshotData, null, 2)}
            </pre>
          </div>
        </div>

        {/* DRAWER FOOTER WITH ACTIONS */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => onPermanentDelete(item)}
            disabled={item.isLegalHold}
            className="w-full sm:w-auto px-4 py-2 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl border border-red-200 dark:border-red-900/50 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            <span>Xóa Vĩnh viễn (Permanent Delete)</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => onRestore(item, 'draft')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Phục hồi về Bản nháp (Draft)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
