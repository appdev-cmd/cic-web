import React, { useState } from 'react';
import { X, CheckCircle2, Clock, Mail, Phone, Building, User, FileText, Send, AlertCircle } from 'lucide-react';
import { ContactMessage, ProductRegistration, PendingContent, ActivityLog } from '../types';

export type DrawerItem =
  | { type: 'contact'; data: ContactMessage }
  | { type: 'registration'; data: ProductRegistration }
  | { type: 'pending'; data: PendingContent }
  | { type: 'activity'; data: ActivityLog };

interface CmsRightDrawerProps {
  item: DrawerItem | null;
  onClose: () => void;
  onUpdateStatus?: (type: string, id: string, newStatus: string) => void;
}

export const CmsRightDrawer: React.FC<CmsRightDrawerProps> = ({
  item,
  onClose,
  onUpdateStatus,
}) => {
  const [noteText, setNoteText] = useState('');
  const [isSuccessToast, setIsSuccessToast] = useState(false);

  if (!item) return null;

  const handleAction = (statusLabel: string) => {
    if (onUpdateStatus) {
      if (item.type === 'contact') onUpdateStatus('contact', item.data.id, statusLabel);
      else if (item.type === 'registration') onUpdateStatus('registration', item.data.id, statusLabel);
      else if (item.type === 'pending') onUpdateStatus('pending', item.data.id, statusLabel);
    }
    setIsSuccessToast(true);
    setTimeout(() => setIsSuccessToast(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Dimmed Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Slide-over Panel */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 z-10 flex flex-col animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
              Chi tiết xử lý dữ liệu
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {item.type === 'contact' && 'Tin nhắn liên hệ mới'}
              {item.type === 'registration' && 'Đăng ký tư vấn sản phẩm'}
              {item.type === 'pending' && 'Chi tiết nội dung bài viết'}
              {item.type === 'activity' && 'Lịch sử hoạt động'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {isSuccessToast && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Đã cập nhật trạng thái xử lý dữ liệu thành công!</span>
            </div>
          )}

          {/* CONTACT MESSAGE DETAILS */}
          {item.type === 'contact' && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 border border-slate-200/80 dark:border-slate-700/80">
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-sm">
                  <User className="w-4 h-4 text-orange-500" />
                  <span>{item.data.sender_name}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.data.sender_email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.data.sender_phone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Thời gian gửi: {item.data.created_time}</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                  Tiêu đề yêu cầu:
                </label>
                <div className="p-2.5 bg-orange-50 dark:bg-orange-950/20 text-orange-900 dark:text-orange-300 rounded-lg font-semibold border border-orange-200 dark:border-orange-900/50">
                  {item.data.subject}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                  Nội dung phản hồi từ khách hàng:
                </label>
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-800 dark:text-slate-200 leading-relaxed border border-slate-200 dark:border-slate-700">
                  {item.data.content}
                </div>
              </div>
            </div>
          )}

          {/* PRODUCT REGISTRATION DETAILS */}
          {item.type === 'registration' && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 border border-slate-200/80 dark:border-slate-700/80">
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-sm">
                  <Building className="w-4 h-4 text-orange-500" />
                  <span>{item.data.company_name}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Người đại diện: {item.data.customer_name}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.data.customer_email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.data.customer_phone}</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                  Sản phẩm quan tâm:
                </label>
                <div className="p-3 bg-blue-50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-300 rounded-xl font-bold text-sm border border-blue-200 dark:border-blue-900/50">
                  {item.data.product_name}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                  Ghi chú nội bộ Sale:
                </label>
                <textarea
                  rows={3}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Nhập ghi chú phản hồi báo giá cho khách hàng..."
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          )}

          {/* PENDING CONTENT DETAILS */}
          {item.type === 'pending' && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 border border-slate-200/80 dark:border-slate-700/80">
                <span className="px-2 py-0.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold rounded-md">
                  Loại: {item.data.content_type.toUpperCase()}
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2">
                  {item.data.title}
                </h4>
                <div className="flex items-center justify-between text-slate-400 text-[11px] pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span>Tác giả: {item.data.author_name}</span>
                  <span>Tạo lúc: {item.data.created_time}</span>
                </div>
              </div>

              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-700 dark:text-emerald-400 text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <span>
                  Trạng thái hiện tại: <strong>{item.data.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}</strong>. Quản trị viên có quyền chỉnh sửa trực tiếp.
                </span>
              </div>
            </div>
          )}

          {/* ACTIVITY LOG DETAILS */}
          {item.type === 'activity' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 border border-slate-200/80 dark:border-slate-700/80">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {item.data.username}
                  </span>
                  <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded font-mono text-[10px]">
                    {item.data.activity_type}
                  </span>
                </div>
                <p className="text-slate-700 dark:text-slate-200 text-sm">
                  {item.data.description}
                </p>
                <p className="text-slate-400 text-[11px]">Thực hiện lúc: {item.data.created_time}</p>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer Action Buttons */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg cursor-pointer"
          >
            Đóng
          </button>

          {item.type === 'contact' && (
            <button
              onClick={() => handleAction('completed')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Đánh dấu Đã xử lý</span>
            </button>
          )}

          {item.type === 'registration' && (
            <button
              onClick={() => handleAction('quoted')}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Gửi báo giá & Đã liên hệ</span>
            </button>
          )}

          {item.type === 'pending' && (
            <button
              onClick={() => handleAction('published')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Cập nhật & Xuất bản</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
