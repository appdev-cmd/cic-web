import React from 'react';
import { AlertTriangle, Loader2, Trash2, X } from 'lucide-react';
import { CmsButton } from './CmsButton';

export interface CmsDeleteConfirmModalItem {
  id: string | number;
  label: string;
}

export interface CmsDeleteConfirmModalProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  itemName?: string;
  items?: CmsDeleteConfirmModalItem[];
  confirmLabel?: string;
  cancelLabel?: string;
  isPending?: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
}

export const CmsDeleteConfirmModal: React.FC<CmsDeleteConfirmModalProps> = ({
  isOpen,
  title,
  description,
  itemName,
  items = [],
  confirmLabel = 'Xác nhận chuyển vào thùng rác',
  cancelLabel = 'Hủy bỏ',
  isPending = false,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  const isMultiple = items.length > 1;
  const computedTitle =
    title ||
    (isMultiple
      ? `Xác nhận chuyển ${items.length} mục đã chọn vào Thùng rác?`
      : itemName
      ? `Xác nhận chuyển "${itemName}" vào Thùng rác?`
      : 'Xác nhận xóa dữ liệu?');

  const computedDescription =
    description ||
    'Dữ liệu sẽ được chuyển vào Thùng rác. Bạn có thể khôi phục lại từ phân hệ Thùng rác khi cần thiết.';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors cursor-pointer disabled:pointer-events-none"
        >
          <X className="size-4" />
        </button>

        {/* Warning Icon & Header */}
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-500/10 text-red-600 dark:text-red-400 rounded-2xl shrink-0">
            <AlertTriangle className="size-6" />
          </div>
          <div className="space-y-1 pr-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
              {computedTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {computedDescription}
            </p>
          </div>
        </div>

        {/* Items List Preview */}
        {items.length > 0 && (
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl p-3 max-h-40 overflow-y-auto space-y-2 text-xs">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                <span className="size-1.5 rounded-full bg-red-500 shrink-0" />
                <span className="font-semibold truncate">{item.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <CmsButton
            size="sm"
            variant="secondary"
            onClick={onClose}
            disabled={isPending}
          >
            {cancelLabel}
          </CmsButton>
          <CmsButton
            size="sm"
            variant="danger"
            onClick={onConfirm}
            disabled={isPending}
            leadingIcon={isPending ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
          >
            {confirmLabel}
          </CmsButton>
        </div>
      </div>
    </div>
  );
};
