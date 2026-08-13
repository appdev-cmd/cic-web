import React from 'react';
import { X, Check, SlidersHorizontal, Eye } from 'lucide-react';

export interface ColumnVisibility {
  title: boolean;
  time_event: boolean;
  place: boolean;
  editorial_status: boolean;
  progress_status: boolean;
  is_hot: boolean;
  ordering: boolean;
  created_time: boolean;
}

interface ColumnSettingModalProps {
  isOpen: boolean;
  columns: ColumnVisibility;
  density: 'normal' | 'compact';
  onToggleColumn: (colKey: keyof ColumnVisibility) => void;
  onChangeDensity: (density: 'normal' | 'compact') => void;
  onReset: () => void;
  onClose: () => void;
}

export const ColumnSettingModal: React.FC<ColumnSettingModalProps> = ({
  isOpen,
  columns,
  density,
  onToggleColumn,
  onChangeDensity,
  onReset,
  onClose,
}) => {
  if (!isOpen) return null;

  const columnLabels: { key: keyof ColumnVisibility; label: string }[] = [
    { key: 'title', label: 'Tiêu đề sự kiện' },
    { key: 'time_event', label: 'Thời gian diễn ra' },
    { key: 'place', label: 'Địa điểm tổ chức' },
    { key: 'editorial_status', label: 'Trạng thái nội dung' },
    { key: 'progress_status', label: 'Trạng thái diễn ra (tự tính)' },
    { key: 'is_hot', label: 'Hội thảo / Sự kiện Nổi bật (Hot)' },
    { key: 'ordering', label: 'Thứ tự hiển thị (Ordering)' },
    { key: 'created_time', label: 'Ngày tạo dữ liệu' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-orange-500/10 text-orange-600 rounded-xl">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Cấu hình Cột & Mật độ hiển thị
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tùy chỉnh cột xuất hiện trên bảng Quản lý Sự kiện
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5 text-xs">
          {/* Density selection */}
          <div className="space-y-2">
            <label className="font-bold text-slate-700 dark:text-slate-300">
              Mật độ hiển thị dòng (Row Density)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onChangeDensity('normal')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  density === 'normal'
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30 text-orange-600'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Tiêu chuẩn (Normal)
              </button>
              <button
                type="button"
                onClick={() => onChangeDensity('compact')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  density === 'compact'
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30 text-orange-600'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Thu nhỏ (Compact)
              </button>
            </div>
          </div>

          {/* Columns list checkboxes */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Các cột hiển thị</span>
              <button
                type="button"
                onClick={onReset}
                className="text-[11px] text-orange-600 hover:underline font-semibold"
              >
                Khôi phục mặc định
              </button>
            </label>

            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {columnLabels.map((col) => (
                <label
                  key={col.key}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                >
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {col.label}
                  </span>
                  <input
                    type="checkbox"
                    checked={columns[col.key]}
                    onChange={() => onToggleColumn(col.key)}
                    className="w-4 h-4 accent-orange-600 rounded"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
            >
              Hoàn tất
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
