import React, { useState, useEffect } from 'react';
import { X, Send, User, Calendar, Loader2 } from 'lucide-react';
import { FormItem } from '../types';
import type { FormSubmissionDetail } from '@/features/forms/types';

interface FormSubmissionsModalProps {
  isOpen: boolean;
  form: FormItem | null;
  onClose: () => void;
  onNavigateToRequests?: () => void;
}

export const FormSubmissionsModal: React.FC<FormSubmissionsModalProps> = ({
  isOpen,
  form,
  onClose,
}) => {
  const [submissions, setSubmissions] = useState<FormSubmissionDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !form) return;

    let ignore = false;
    setIsLoading(true);
    setError(null);

    fetch(`/api/cms/forms/${form.id}/submissions?limit=50`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('Lỗi khi tải dữ liệu lượt gửi.'))))
      .then((json) => {
        if (!ignore) {
          setSubmissions(json.submissions || []);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error('[FormSubmissionsModal] Fetch failed:', err);
          setError(err.message || 'Không thể tải danh sách lượt gửi.');
        }
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [isOpen, form]);

  if (!isOpen || !form) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4 text-orange-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Yêu cầu đã gửi từ biểu mẫu: "{form.title}"
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Submissions List */}
        <div className="p-5 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/60 rounded-xl text-xs">
            <span className="text-orange-900 dark:text-orange-300">
              Tổng số lượt gửi ghi nhận: <strong className="font-extrabold">{form.stats?.submissions ?? submissions.length} yêu cầu</strong>
            </span>
          </div>

          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
              <span className="text-xs">Đang tải danh sách lượt gửi...</span>
            </div>
          ) : error ? (
            <div className="py-8 text-center text-xs text-rose-500 font-medium">
              {error}
            </div>
          ) : submissions.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Chưa có lượt gửi nào được ghi nhận cho biểu mẫu này.
            </div>
          ) : (
            <div className="space-y-2">
              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-orange-500" />
                      <span className="font-bold text-slate-900 dark:text-white">
                        {sub.customerName || 'Khách vãng lai'}
                      </span>
                      {sub.phone && (
                        <span className="text-[11px] text-slate-400 font-mono">({sub.phone})</span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 flex-wrap">
                      {sub.email && <span>Email: {sub.email}</span>}
                      {sub.email && <span>•</span>}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />{' '}
                        {new Date(sub.submittedAt).toLocaleString('vi-VN')}
                      </span>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      Mới
                    </span>
                    {sub.sourcePath && (
                      <p className="text-[10px] text-slate-400 truncate max-w-[140px]" title={sub.sourcePath}>
                        Từ: {sub.sourcePath}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <span className="text-xs text-slate-400">
            Dữ liệu được đồng bộ tự động tới Yêu cầu khách hàng
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

