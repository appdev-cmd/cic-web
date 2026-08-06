import React from 'react';
import { X, Send, User, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';
import { FormItem } from '../types';

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
  onNavigateToRequests,
}) => {
  if (!isOpen || !form) return null;

  // Mock submissions for this form
  const sampleSubmissions = [
    {
      id: 'sub_001',
      customerName: 'Nguyễn Văn An',
      phone: '0987 123 456',
      email: 'an.nguyen@company.com',
      date: '05/08/2026 14:30',
      status: 'Mới',
      page: 'Trang Giải pháp ERP',
    },
    {
      id: 'sub_002',
      customerName: 'Trần Thị Bích',
      phone: '0912 345 678',
      email: 'bich.tran@tech.vn',
      date: '04/08/2026 09:15',
      status: 'Đang xử lý',
      page: 'Chi tiết sản phẩm IntelliCAD',
    },
    {
      id: 'sub_003',
      customerName: 'Lê Hoàng Nam',
      phone: '0933 888 999',
      email: 'nam.le@cic.com.vn',
      date: '02/08/2026 16:45',
      status: 'Đã hoàn thành',
      page: 'Trang chủ',
    },
  ];

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
              Tổng số lượt gửi ghi nhận: <strong className="font-extrabold">{form.stats?.submissions || 12} yêu cầu</strong>
            </span>
          </div>

          <div className="space-y-2">
            {sampleSubmissions.map((sub) => (
              <div
                key={sub.id}
                className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-orange-500" />
                    <span className="font-bold text-slate-900 dark:text-white">
                      {sub.customerName}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">({sub.phone})</span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    <span>Email: {sub.email}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" /> {sub.date}
                    </span>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    {sub.status}
                  </span>
                  <p className="text-[10px] text-slate-400 truncate max-w-[140px]">
                    Từ: {sub.page}
                  </p>
                </div>
              </div>
            ))}
          </div>
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
