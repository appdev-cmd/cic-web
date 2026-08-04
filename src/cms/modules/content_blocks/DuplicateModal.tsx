import React, { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { BlockItem } from './types';

interface DuplicateModalProps {
  isOpen: boolean;
  onClose: () => void;
  block: BlockItem | null;
  onDuplicateConfirm: (newTitle: string, resetWorkflow: boolean) => void;
}

export const DuplicateModal: React.FC<DuplicateModalProps> = ({
  isOpen,
  onClose,
  block,
  onDuplicateConfirm,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [resetWorkflow, setResetWorkflow] = useState(true);

  React.useEffect(() => {
    if (block) {
      setNewTitle(`${block.title} (Bản sao)`);
    }
  }, [block]);

  if (!isOpen || !block) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onDuplicateConfirm(newTitle.trim(), resetWorkflow);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
            <div className="flex items-center gap-2">
              <Copy className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Nhân Bản Khối Nội Dung (Duplicate)
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Tên Khối Nội Dung Mới
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={resetWorkflow}
                  onChange={(e) => setResetWorkflow(e.target.checked)}
                  className="rounded text-orange-600 focus:ring-orange-500"
                />
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  Đặt lại trạng thái về Draft bản thảo (Khuyến nghị)
                </span>
              </label>
              <p className="text-slate-500 dark:text-slate-400 pl-6">
                Giúp bạn chỉnh sửa nội dung hoàn thiện trước khi đưa vào phê duyệt hoặc xuất bản.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2 bg-slate-50 dark:bg-slate-850">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium text-sm rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" /> Xác Nhận Nhân Bản
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
