import React, { useState } from 'react';
import {
  X,
  Trash2,
  AlertTriangle,
  Lock,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';
import { TrashedItem } from './types';

interface PermanentDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: TrashedItem | null;
  onConfirmDelete: (item: TrashedItem, reason: string) => void;
}

export const PermanentDeleteModal: React.FC<PermanentDeleteModalProps> = ({
  isOpen,
  onClose,
  item,
  onConfirmDelete,
}) => {
  const [confirmText, setConfirmText] = useState('');
  const [deleteReason, setDeleteReason] = useState('');

  if (!isOpen || !item) return null;

  const isConfirmed = confirmText.trim().toUpperCase() === 'XÓA VĨNH VIỄN';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
        {/* MODAL HEADER */}
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-500/10 text-red-600 rounded-2xl border border-red-500/20">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Xác nhận Xóa Vĩnh viễn (Permanent Delete)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Hành động này KHÔNG THỂ KHÔI PHỤC. Vui lòng xác nhận thận trọng.
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

        {/* LEGAL HOLD CHECK */}
        {item.isLegalHold ? (
          <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-2xl space-y-2 text-purple-900 dark:text-purple-200 text-xs">
            <div className="flex items-center gap-2 font-bold text-purple-700 dark:text-purple-300">
              <Lock className="w-4 h-4 text-purple-600" />
              <span>HÀNH ĐỘNG BỊ CHẶN BỞI LỆNH GIỮ CHÂN PHÁP LÝ (LEGAL HOLD)</span>
            </div>
            <p>
              Đối tượng này hiện không thể bị xóa vĩnh viễn do đang thuộc chính sách bảo lưu hồ sơ thanh tra.
            </p>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            <div className="p-3.5 bg-red-500/5 border border-red-500/20 rounded-2xl space-y-1">
              <div className="font-bold text-red-900 dark:text-red-200">
                Đối tượng tiêu hủy: {item.title}
              </div>
              <p className="text-red-700 dark:text-red-300">
                Loại: {item.itemType} • Scope: {item.scope.siteName}
              </p>
            </div>

            <div className="space-y-2">
              <label className="font-bold text-slate-700 dark:text-slate-300 block">
                Nhập lý do thực hiện tiêu hủy vĩnh viễn (Audit Metadata Requirement):
              </label>
              <textarea
                rows={2}
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="VD: Tiêu hủy dữ liệu cũ tuân thủ chính sách bảo mật / Hết thời hạn lưu trữ GDPR..."
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="space-y-2">
              <label className="font-bold text-slate-700 dark:text-slate-300 block">
                Gõ chính xác cụm từ <span className="text-red-600 font-mono">XÓA VĨNH VIỄN</span> để mở khóa:
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="XÓA VĨNH VIỄN"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-xs focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
        )}

        {/* MODAL ACTIONS */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
          >
            Hủy bỏ
          </button>

          <button
            onClick={() => {
              onConfirmDelete(item, deleteReason);
              onClose();
            }}
            disabled={!isConfirmed || item.isLegalHold}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md shadow-red-600/20 flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            <span>Tiêu hủy Vĩnh viễn (Irreversible)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
