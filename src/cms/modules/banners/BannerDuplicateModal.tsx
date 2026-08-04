import React, { useState } from 'react';
import { X, Copy, Check, Sparkles, RefreshCw } from 'lucide-react';
import { BannerContent } from './types';

interface BannerDuplicateModalProps {
  item: BannerContent | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmDuplicate: (duplicatedItem: BannerContent) => void;
}

export const BannerDuplicateModal: React.FC<BannerDuplicateModalProps> = ({
  item,
  isOpen,
  onClose,
  onConfirmDuplicate,
}) => {
  const [resetSchedule, setResetSchedule] = useState(true);
  const [resetWorkflow, setResetWorkflow] = useState(true);
  const [copyTranslations, setCopyTranslations] = useState(true);
  const [newTitle, setNewTitle] = useState('');

  React.useEffect(() => {
    if (item) {
      setNewTitle(`[Bản sao] ${item.title}`);
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleExecuteDuplicate = () => {
    const duplicated: BannerContent = {
      ...item,
      id: `ban_${Date.now()}`,
      title: newTitle || `[Bản sao] ${item.title}`,
      alias: `${item.alias}-copy-${Date.now().toString().slice(-4)}`,
      workflow_status: resetWorkflow ? 'draft' : item.workflow_status,
      effective_status: resetWorkflow ? 'upcoming' : item.effective_status,
      live_version: 'v1.0.0',
      draft_version: 'v1.0.0-draft',
      has_draft_changes: true,
      start_time: resetSchedule ? '2026-09-01 00:00' : item.start_time,
      end_time: resetSchedule ? '2026-12-31 23:59' : item.end_time,
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
      updated_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };

    onConfirmDuplicate(duplicated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
              <Copy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Tạo Bản Sao Nội Dung (Duplicate)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sao chép cấu hình {item.type === 'slideshow' ? 'Slideshow' : 'Banner'} để tái sử dụng.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Tên tiêu đề bản sao mới <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={resetWorkflow}
                onChange={(e) => setResetWorkflow(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-orange-600 focus:ring-orange-500"
              />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Reset quy trình duyệt về Bản thảo (Draft) mới
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={resetSchedule}
                onChange={(e) => setResetSchedule(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-orange-600 focus:ring-orange-500"
              />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Reset thời gian đặt lịch hiển thị
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={copyTranslations}
                onChange={(e) => setCopyTranslations(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-orange-600 focus:ring-orange-500"
              />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Giữ nguyên tất cả dữ liệu bản dịch đa ngôn ngữ
              </span>
            </label>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 rounded-xl transition"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleExecuteDuplicate}
            className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition flex items-center gap-1.5 shadow-2xs"
          >
            <Copy className="w-4 h-4" /> Xác nhận sao chép
          </button>
        </div>
      </div>
    </div>
  );
};
