import React, { useState } from 'react';
import { X, UserCheck, Calendar, Clock, Sparkles } from 'lucide-react';
import { StaffUser } from './types';
import { MOCK_LOCALIZATION_STAFF } from './mockData';

interface BatchAssignModalProps {
  isOpen: boolean;
  selectedCount: number;
  onClose: () => void;
  onConfirm: (assignee: StaffUser, reviewer: StaffUser, dueDate: string) => void;
}

export const BatchAssignModal: React.FC<BatchAssignModalProps> = ({
  isOpen,
  selectedCount,
  onClose,
  onConfirm,
}) => {
  const translators = MOCK_LOCALIZATION_STAFF.filter((s) => s.role === 'translator' || s.role === 'editor');
  const reviewers = MOCK_LOCALIZATION_STAFF.filter((s) => s.role === 'reviewer' || s.role === 'manager' || s.role === 'admin');

  const [selectedTranslatorId, setSelectedTranslatorId] = useState<string>(translators[0]?.id || '');
  const [selectedReviewerId, setSelectedReviewerId] = useState<string>(reviewers[0]?.id || '');
  const [dueDate, setDueDate] = useState<string>('2026-08-10');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const assignee = MOCK_LOCALIZATION_STAFF.find((s) => s.id === selectedTranslatorId) || translators[0];
    const reviewer = MOCK_LOCALIZATION_STAFF.find((s) => s.id === selectedReviewerId) || reviewers[0];
    onConfirm(assignee, reviewer, dueDate);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Phân công dịch thuật hàng loạt (Batch Assignment)
              </h3>
              <p className="text-xs text-slate-500">
                Đang chọn <b>{selectedCount}</b> chuỗi / nội dung
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Translator (Biên dịch viên phụ trách)
            </label>
            <select
              value={selectedTranslatorId}
              onChange={(e) => setSelectedTranslatorId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none font-medium"
            >
              {translators.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Reviewer (Người duyệt bản dịch)
            </label>
            <select
              value={selectedReviewerId}
              onChange={(e) => setSelectedReviewerId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none font-medium"
            >
              {reviewers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.role.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Hạn hoàn thành (Due Date)
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none font-medium"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md transition-colors"
            >
              Xác nhận phân công
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
