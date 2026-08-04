import React from 'react';
import { X, Mail, Phone, Building, Calendar, MessageSquare, Inbox } from 'lucide-react';
import { ServiceRelatedContact } from './types';

interface RelatedContactsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  serviceTitle: string;
  contacts: ServiceRelatedContact[];
}

export const RelatedContactsDrawer: React.FC<RelatedContactsDrawerProps> = ({
  isOpen,
  onClose,
  serviceTitle,
  contacts,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                Yêu cầu liên hệ & Báo giá liên quan ({contacts.length})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">
                {serviceTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {contacts.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Chưa có yêu cầu liên hệ hoặc báo giá nào cho dịch vụ này.
            </div>
          ) : (
            <div className="space-y-4">
              {contacts.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                      {c.customer_name}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${
                        c.status === 'unread'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400'
                          : c.status === 'processing'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                      }`}
                    >
                      {c.status === 'unread' ? 'Mới' : c.status === 'processing' ? 'Đang xử lý' : 'Đã hoàn thành'}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Building className="w-3.5 h-3.5" />
                      <span>{c.company_name}</span>
                    </div>
                    <div className="flex items-center gap-3 pt-1">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Mail className="w-3 h-3" /> {c.customer_email}
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Phone className="w-3 h-3" /> {c.customer_phone}
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200/60 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 italic">
                    "{c.subject}"
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {c.created_at}
                    </span>
                    <button className="text-orange-600 dark:text-orange-400 hover:underline font-medium">
                      Xem trong Khách hàng →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-lg transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
