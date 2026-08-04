import React from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, X } from 'lucide-react';
import { ServiceItem } from './types';

interface ImpactWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceItem | null;
  actionType: 'deactivate' | 'archive' | 'delete';
  onConfirm: () => void;
}

export const ImpactWarningModal: React.FC<ImpactWarningModalProps> = ({
  isOpen,
  onClose,
  service,
  actionType,
  onConfirm,
}) => {
  if (!isOpen || !service) return null;

  const title =
    actionType === 'deactivate'
      ? 'Xác nhận Ngừng cung cấp (Deactivate)'
      : actionType === 'archive'
      ? 'Xác nhận Lưu trữ dịch vụ (Archive)'
      : 'Xác nhận Xóa dịch vụ vĩnh viễn';

  const hasImpacts = service.used_by_count > 0 || service.open_contacts_count > 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-150 p-6 space-y-4">
        {/* Header Icon */}
        <div className="flex items-center gap-3">
          <div
            className={`p-3 rounded-xl shrink-0 ${
              actionType === 'delete'
                ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400'
                : 'bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400'
            }`}
          >
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
              {title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {service.code} - {service.title}
            </p>
          </div>
        </div>

        {/* Warning content */}
        {hasImpacts ? (
          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl space-y-2 text-xs text-amber-900 dark:text-amber-200">
            <div className="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
              <AlertTriangle className="w-4 h-4" /> Phát hiện ảnh hưởng hệ thống (Used-By Check):
            </div>
            <ul className="list-disc pl-5 space-y-1 text-[11px]">
              {service.used_by_count > 0 && (
                <li>
                  Dịch vụ đang được liên kết tại <strong>{service.used_by_count} vị trí</strong> (Menu / Khối trang chủ / Landing Page).
                </li>
              )}
              {service.open_contacts_count > 0 && (
                <li>
                  Đang có <strong>{service.open_contacts_count} yêu cầu tư vấn / báo giá chưa xử lý</strong> thuộc dịch vụ này.
                </li>
              )}
            </ul>
          </div>
        ) : (
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Dịch vụ này hiện không còn liên kết ở vị trí công khai nào. Thao tác này an toàn để tiếp tục.
          </p>
        )}

        <p className="text-xs text-slate-500 dark:text-slate-400">
          {actionType === 'deactivate'
            ? 'Trạng thái Service Status sẽ chuyển sang Inactive. Dịch vụ sẽ tạm ẩn khỏi bảng chọn báo giá công khai.'
            : actionType === 'archive'
            ? 'Dịch vụ sẽ đưa vào kho lưu trữ (Archived) và không thể đăng ký mới.'
            : 'Hành động xóa vĩnh viễn không thể hoàn tác. Mọi dữ liệu liên quan sẽ bị loại bỏ hoàn toàn.'}
        </p>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-lg transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-xs font-medium rounded-lg text-white transition-colors shadow-2xs ${
              actionType === 'delete'
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-amber-600 hover:bg-amber-700'
            }`}
          >
            Xác nhận thực hiện
          </button>
        </div>
      </div>
    </div>
  );
};
