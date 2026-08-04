import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { StaticPage } from './types';

interface ImpactWarningModalProps {
  isOpen: boolean;
  page: StaticPage | null;
  actionType: 'url_change' | 'archive' | 'delete' | 'hierarchy_change';
  newValue?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const ImpactWarningModal: React.FC<ImpactWarningModalProps> = ({
  isOpen,
  page,
  actionType,
  newValue,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !page) return null;

  const usedByList = page.used_by || [];

  const getTitle = () => {
    switch (actionType) {
      case 'url_change':
        return 'Cảnh báo tác động: Thay đổi đường dẫn URL';
      case 'archive':
        return 'Cảnh báo tác động: Lưu trữ (Archive) trang';
      case 'delete':
        return 'Cảnh báo tác động: Xóa vĩnh viễn trang';
      case 'hierarchy_change':
        return 'Cảnh báo tác động: Thay đổi quan hệ cha - con';
    }
  };

  const getMessage = () => {
    switch (actionType) {
      case 'url_change':
        return `Bạn đang chuẩn bị thay đổi URL từ "/${page.alias}" sang "/${newValue}". Thao tác này có thể khiến ${usedByList.length} vị trí liên kết bị hỏng (Broken links).`;
      case 'archive':
        return `Trang "${page.title}" sẽ bị gỡ khỏi giao diện công khai. Hiện tại có ${usedByList.length} menu/block đang liên kết đến trang này.`;
      case 'delete':
        return `Xóa trang "${page.title}" sẽ xóa vĩnh viễn toàn bộ dữ liệu. Thao tác này ảnh hưởng tới ${usedByList.length} vị trí đang sử dụng.`;
      case 'hierarchy_change':
        return `Thay đổi cấp phân nhánh cho trang "${page.title}" sẽ thay đổi cấu trúc URL breadcrumbs và cây nội dung.`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-red-200 dark:border-red-950 overflow-hidden space-y-5 p-6 animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 rounded-2xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {getTitle()}
              </h3>
              <p className="text-xs text-red-600 dark:text-red-400 font-semibold mt-0.5">
                Cảnh báo ảnh hưởng liên kết (High-Impact Action)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          {getMessage()}
        </p>

        {/* Affected locations list */}
        {usedByList.length > 0 && (
          <div className="p-3.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-red-800 dark:text-red-300">
              <AlertCircle className="w-4 h-4" />
              <span>Các vị trí bị ảnh hưởng trực tiếp ({usedByList.length}):</span>
            </div>
            <ul className="space-y-1 pl-6 list-disc text-[11px] text-red-700 dark:text-red-300 font-medium">
              {usedByList.map((item) => (
                <li key={item.id}>
                  <strong>{item.location_name}</strong> ({item.link_url})
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-600/20 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Xác nhận thực hiện</span>
          </button>
        </div>
      </div>
    </div>
  );
};
