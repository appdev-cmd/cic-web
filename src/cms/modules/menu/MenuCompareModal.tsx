import React from 'react';
import { X, GitCompare, ArrowRight, PlusCircle, CheckCircle, RefreshCw, Trash2, ShieldAlert } from 'lucide-react';
import { DiffChange } from './types';

interface MenuCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  diffs: DiffChange[];
  liveVersion: string;
  draftVersion: string;
}

export const MenuCompareModal: React.FC<MenuCompareModalProps> = ({
  isOpen,
  onClose,
  diffs,
  liveVersion,
  draftVersion,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs animate-in fade-in p-4">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                So sánh Biến động (Diff Check): <span className="text-emerald-600 dark:text-emerald-400">{liveVersion}</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
                <span className="text-orange-600 dark:text-orange-400">{draftVersion}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Đối soát danh sách các thay đổi chi tiết giữa phiên bản Live và Bản thảo hiện tại.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {diffs.length === 0 ? (
            <div className="py-12 text-center">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-900 dark:text-white">Không có sự thay đổi nào!</p>
              <p className="text-xs text-slate-500 mt-1">Bản thảo Draft hiện trùng khớp hoàn toàn với bản Live đang chạy.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span>Tổng cộng {diffs.length} mục có biến động</span>
                <span>Kiểm duyệt an toàn hạt nhân</span>
              </div>

              {diffs.map((diff) => {
                const isAdded = diff.change_type === 'added';
                const isMoved = diff.change_type === 'moved';
                const isChanged = diff.change_type === 'changed';
                const isRemoved = diff.change_type === 'removed';

                return (
                  <div
                    key={diff.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isAdded && (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                            <PlusCircle className="w-3 h-3" /> Thêm mới (Added)
                          </span>
                        )}
                        {isMoved && (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center gap-1">
                            <RefreshCw className="w-3 h-3" /> Di chuyển vị trí (Moved)
                          </span>
                        )}
                        {isChanged && (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center gap-1">
                            <GitCompare className="w-3 h-3" /> Thay đổi thuộc tính (Changed)
                          </span>
                        )}
                        {isRemoved && (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 flex items-center gap-1">
                            <Trash2 className="w-3 h-3" /> Đã xóa (Removed)
                          </span>
                        )}

                        <span className="text-xs font-bold text-slate-900 dark:text-white">{diff.label}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">ID: {diff.item_id}</span>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 font-mono space-y-1">
                      {diff.old_path && (
                        <p className="text-slate-400">
                          <span className="text-rose-500 font-bold">- Cũ (Live):</span> {diff.old_path}
                        </p>
                      )}
                      {diff.new_path && (
                        <p className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          <span className="text-emerald-500 font-bold">+ Mới (Draft):</span> {diff.new_path}
                        </p>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">{diff.details}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition"
          >
            Đóng bảng đối soát
          </button>
        </div>
      </div>
    </div>
  );
};
