import React, { useState, useEffect } from 'react';
import { X, Send, User, Calendar, Loader2, Database, FileSpreadsheet, Mail, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { FormItem } from '../types';
import type { FormSubmissionDetail, FormSubmissionDeliveryEntity } from '@/features/forms/types';

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
  const [retryingDeliveryId, setRetryingDeliveryId] = useState<string | null>(null);

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

  const handleRetryDelivery = async (subId: string, delId: string) => {
    if (!form || retryingDeliveryId) return;

    setRetryingDeliveryId(delId);
    try {
      const res = await fetch(`/api/cms/forms/${form.id}/submissions/${subId}/deliveries/${delId}/retry`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || data.result?.lastError || 'Gửi lại thất bại.');
      } else {
        // Update local submission state with the new delivery status
        setSubmissions((prev) =>
          prev.map((sub) => {
            if (sub.id !== subId) return sub;
            const updatedDeliveries = (sub.deliveries || []).map((d) => {
              if (d.id !== delId) return d;
              return {
                ...d,
                status: 'success' as const,
                lastError: null,
                attemptCount: d.attemptCount + 1,
                deliveredAt: new Date().toISOString(),
              };
            });
            return { ...sub, deliveries: updatedDeliveries };
          })
        );
      }
    } catch (err: any) {
      alert(err?.message || 'Lỗi khi gửi lại.');
    } finally {
      setRetryingDeliveryId(null);
    }
  };

  if (!isOpen || !form) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4 text-orange-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Lượt gửi biểu mẫu: "{form.title}"
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
            <span className="text-[11px] text-orange-700 dark:text-orange-400">
              CSDL luôn lưu trữ · Kiểm tra trạng thái chuyển phát bên dưới
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
            <div className="space-y-2.5">
              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex flex-col gap-2.5 text-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-orange-500" />
                        <span className="font-bold text-slate-900 dark:text-white">
                          {sub.customerName || 'Khách vãng lai'}
                        </span>
                        {sub.phone && (
                          <span className="text-[11px] text-slate-400 font-mono">({sub.phone})</span>
                        )}
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-mono">
                          ID: #{sub.id}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 flex-wrap">
                        {sub.email && <span>Email: {sub.email}</span>}
                        {sub.email && <span>•</span>}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />{' '}
                          {new Date(sub.submittedAt).toLocaleString('vi-VN')}
                        </span>
                        {sub.sourcePath && (
                          <>
                            <span>•</span>
                            <span className="text-slate-400 truncate max-w-[200px]" title={sub.sourcePath}>
                              Từ: {sub.sourcePath}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        Lượt gửi #{sub.id}
                      </span>
                    </div>
                  </div>

                  {/* Delivery Status Badges */}
                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] text-slate-400 font-medium">Trạng thái chuyển phát:</span>

                    {/* Database status (Always Success) */}
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      <Database className="w-3 h-3" />
                      Database: Đã lưu
                    </span>

                    {/* External destinations deliveries */}
                    {sub.deliveries && sub.deliveries.length > 0 ? (
                      sub.deliveries.map((del) => {
                        const isSheets = del.destinationType === 'google_sheets';
                        const isEmail = del.destinationType === 'email';
                        const icon = isSheets ? (
                          <FileSpreadsheet className="w-3 h-3" />
                        ) : isEmail ? (
                          <Mail className="w-3 h-3" />
                        ) : (
                          <Send className="w-3 h-3" />
                        );
                        const label = isSheets ? 'Google Sheets' : isEmail ? 'Email' : del.destinationType;

                        if (del.status === 'success') {
                          return (
                            <span
                              key={del.id}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                              title={del.deliveredAt ? `Đã gửi lúc: ${new Date(del.deliveredAt).toLocaleString('vi-VN')}` : undefined}
                            >
                              {icon}
                              {label}: Đã gửi
                              <CheckCircle className="w-2.5 h-2.5 text-emerald-500" />
                            </span>
                          );
                        }

                        if (del.status === 'failed') {
                          return (
                            <span
                              key={del.id}
                              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10.5px] font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                              title={del.lastError || 'Lỗi gửi'}
                            >
                              {icon}
                              <span>{label}: Thất bại</span>
                              <AlertTriangle className="w-2.5 h-2.5 text-rose-500" />
                              <button
                                type="button"
                                onClick={() => handleRetryDelivery(sub.id, del.id)}
                                disabled={retryingDeliveryId === del.id}
                                className="ml-1 text-[10px] text-rose-800 dark:text-rose-200 underline hover:no-underline font-bold cursor-pointer inline-flex items-center gap-0.5"
                              >
                                {retryingDeliveryId === del.id ? (
                                  <Loader2 className="w-2.5 h-2.5 animate-spin" />
                                ) : (
                                  <RefreshCw className="w-2.5 h-2.5" />
                                )}
                                Thử lại
                              </button>
                            </span>
                          );
                        }

                        return (
                          <span
                            key={del.id}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                          >
                            {icon}
                            {label}: Đang gửi...
                            <Loader2 className="w-2.5 h-2.5 animate-spin" />
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-[10.5px] text-slate-400 italic">Không có destination ngoại vi nào kích hoạt</span>
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
            Dữ liệu được lưu trữ an toàn trong Database và đồng bộ theo cấu hình của từng biểu mẫu.
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
