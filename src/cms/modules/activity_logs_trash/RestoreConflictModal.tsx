import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  FolderTree,
  FileCode,
  ShieldAlert,
} from 'lucide-react';
import { TrashedItem } from './types';

interface RestoreConflictModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: TrashedItem | null;
  onConfirmRestore: (item: TrashedItem, mode: 'as_draft' | 'auto_rename' | 'restore_parent_first') => void;
}

export const RestoreConflictModal: React.FC<RestoreConflictModalProps> = ({
  isOpen,
  onClose,
  item,
  onConfirmRestore,
}) => {
  const [selectedMode, setSelectedMode] = useState<'as_draft' | 'auto_rename' | 'restore_parent_first'>('as_draft');

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
        {/* MODAL HEADER */}
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 text-amber-600 rounded-2xl border border-amber-500/20">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Phát hiện Xung đột / Đứt đứt gãy Liên kết khi Phục hồi
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Vui lòng chọn phương án giải quyết để khôi phục an toàn.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* DETAILS OF CONFLICT */}
        <div className="p-3.5 bg-amber-500/5 border border-amber-500/20 rounded-2xl text-xs space-y-1.5">
          <div className="font-bold text-amber-900 dark:text-amber-200">
            Đối tượng: {item.title}
          </div>
          <div className="text-amber-800 dark:text-amber-300">
            <strong>Chi tiết sự cố:</strong> {item.dependencyDetails}
          </div>
        </div>

        {/* RESOLUTION OPTIONS */}
        <div className="space-y-3 text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-300 block">
            Chọn phương án xử lý xung đột (Restore Conflict Policy):
          </span>

          <label
            onClick={() => setSelectedMode('as_draft')}
            className={`p-3.5 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
              selectedMode === 'as_draft'
                ? 'border-orange-500 bg-orange-500/5 dark:bg-orange-500/10'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <input
              type="radio"
              name="restore_mode"
              checked={selectedMode === 'as_draft'}
              onChange={() => setSelectedMode('as_draft')}
              className="mt-0.5 accent-orange-500"
            />
            <div>
              <strong className="text-slate-900 dark:text-white block font-semibold">
                1. Phục hồi về Bản nháp (Restore as Draft - Khuyến nghị)
              </strong>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                Đưa bài viết/trang về trạng thái Nháp (Draft) để người quản trị biên tập lại liên kết trước khi xuất bản chính thức.
              </p>
            </div>
          </label>

          <label
            onClick={() => setSelectedMode('auto_rename')}
            className={`p-3.5 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
              selectedMode === 'auto_rename'
                ? 'border-orange-500 bg-orange-500/5 dark:bg-orange-500/10'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <input
              type="radio"
              name="restore_mode"
              checked={selectedMode === 'auto_rename'}
              onChange={() => setSelectedMode('auto_rename')}
              className="mt-0.5 accent-orange-500"
            />
            <div>
              <strong className="text-slate-900 dark:text-white block font-semibold">
                2. Tự động đổi tên URL/Slug để tránh trùng lặp
              </strong>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                Hệ thống dùng slug ngắn do backend đề xuất sau khi kiểm tra unique; không ghi đè bản ghi đang tồn tại.
              </p>
            </div>
          </label>

          {item.dependencyStatus === 'parent_trashed' && (
            <label
              onClick={() => setSelectedMode('restore_parent_first')}
              className={`p-3.5 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                selectedMode === 'restore_parent_first'
                  ? 'border-orange-500 bg-orange-500/5 dark:bg-orange-500/10'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <input
                type="radio"
                name="restore_mode"
                checked={selectedMode === 'restore_parent_first'}
                onChange={() => setSelectedMode('restore_parent_first')}
                className="mt-0.5 accent-orange-500"
              />
              <div>
                <strong className="text-slate-900 dark:text-white block font-semibold">
                  3. Đồng thời khôi phục Thư mục Mẹ từ Thùng rác
                </strong>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                  Phục hồi cả đối tượng cha và đối tượng hiện tại để bảo toàn cấu trúc cây thư mục.
                </p>
              </div>
            </label>
          )}
        </div>

        {/* MODAL ACTIONS */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
          >
            Hủy bỏ
          </button>

          <button
            onClick={() => onConfirmRestore(item, selectedMode)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Xác nhận Phục hồi An toàn</span>
          </button>
        </div>
      </div>
    </div>
  );
};
