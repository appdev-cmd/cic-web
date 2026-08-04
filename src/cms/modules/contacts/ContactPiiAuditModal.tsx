import React from 'react';
import { Eye, ShieldCheck, Lock, X } from 'lucide-react';
import { TimelineEvent } from './types';

interface ContactPiiAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  timelineEvents: TimelineEvent[];
}

export const ContactPiiAuditModal: React.FC<ContactPiiAuditModalProps> = ({
  isOpen,
  onClose,
  timelineEvents,
}) => {
  if (!isOpen) return null;

  const piiEvents = timelineEvents.filter((e) => e.event_type === 'pii_revealed');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Nhật ký Truy cập PII (Security Audit)
              </h3>
              <p className="text-xs text-slate-500">Kiểm toán bảo mật thông tin cá nhân khách hàng</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-800 dark:text-amber-200 text-xs flex items-start gap-2.5">
            <Lock className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div>
              <span className="font-bold">Chính sách Bảo mật PII:</span> Mọi thao tác hiển thị đầy đủ Email/Số điện thoại khách hàng đều được ghi lại vào Audit Log của hệ thống phục vụ tuân thủ Nghị định 13/2023/NĐ-CP về Bảo vệ dữ liệu cá nhân.
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Lịch sử mở xem PII trong yêu cầu này
            </h4>
            {piiEvents.length === 0 ? (
              <div className="p-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center text-xs text-slate-400">
                Chưa có thao tác giải mã PII nào được thực hiện trong phiên này.
              </div>
            ) : (
              <div className="space-y-2">
                {piiEvents.map((evt) => (
                  <div key={evt.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-emerald-500" />
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{evt.actor_name}</div>
                        <div className="text-[11px] text-slate-500">{evt.description}</div>
                      </div>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">{evt.timestamp}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-xs font-semibold rounded-xl transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
