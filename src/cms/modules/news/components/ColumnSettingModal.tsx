import React from 'react';
import { X, SlidersHorizontal, Eye, EyeOff, LayoutList, AlignJustify, MoveVertical } from 'lucide-react';

export interface ColumnVisibility {
  category: boolean;
  localization: boolean;
  author: boolean;
  status: boolean;
  publish_time: boolean;
  updated_time: boolean;
  actions: boolean;
}

export type TableDensity = 'compact' | 'normal' | 'spacious';

interface ColumnSettingModalProps {
  isOpen: boolean;
  visibility: ColumnVisibility;
  density: TableDensity;
  onClose: () => void;
  onToggleColumn: (columnKey: keyof ColumnVisibility) => void;
  onChangeDensity: (density: TableDensity) => void;
  onReset: () => void;
}

export const ColumnSettingModal: React.FC<ColumnSettingModalProps> = ({
  isOpen,
  visibility,
  density,
  onClose,
  onToggleColumn,
  onChangeDensity,
  onReset,
}) => {
  if (!isOpen) return null;

  const columns: { key: keyof ColumnVisibility; label: string; fixed?: boolean }[] = [
    { key: 'category', label: 'Danh mục bài viết' },
    { key: 'localization', label: 'Ngôn ngữ & Tiến độ dịch' },
    { key: 'author', label: 'Tác giả & Phụ trách' },
    { key: 'status', label: 'Trạng thái quy trình' },
    { key: 'publish_time', label: 'Thời gian xuất bản / Lịch' },
    { key: 'updated_time', label: 'Thời gian cập nhật' },
    { key: 'actions', label: 'Cột thao tác', fixed: true },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Tùy chỉnh cột & Mật độ hiển thị
              </h3>
              <p className="text-[11px] text-slate-400">Điều chỉnh giao diện bảng tin tức</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Density Chooser */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <MoveVertical className="w-3.5 h-3.5 text-indigo-500" />
            <span>Mật độ hàng (Row Density)</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onChangeDensity('compact')}
              className={`p-2.5 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                density === 'compact'
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <AlignJustify className="w-4 h-4" />
              <span>Gọn (Compact)</span>
            </button>
            <button
              onClick={() => onChangeDensity('normal')}
              className={`p-2.5 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                density === 'normal'
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <LayoutList className="w-4 h-4" />
              <span>Vừa (Normal)</span>
            </button>
            <button
              onClick={() => onChangeDensity('spacious')}
              className={`p-2.5 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                density === 'spacious'
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <LayoutList className="w-5 h-5" />
              <span>Rộng (Spacious)</span>
            </button>
          </div>
        </div>

        {/* Toggle Columns */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Hiển thị / Ẩn các cột dữ liệu
          </label>
          <div className="space-y-1.5 max-h-60 overflow-y-auto custom-scrollbar pr-1">
            {columns.map((col) => {
              const isVisible = visibility[col.key];
              return (
                <div
                  key={col.key}
                  onClick={() => !col.fixed && onToggleColumn(col.key)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition-all ${
                    col.fixed
                      ? 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer'
                  }`}
                >
                  <span className="text-slate-800 dark:text-slate-200">{col.label}</span>
                  <div className="flex items-center gap-2">
                    {col.fixed ? (
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Sticky</span>
                    ) : isVisible ? (
                      <Eye className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onReset}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white underline cursor-pointer"
          >
            Mặc định
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
          >
            Hoàn tất
          </button>
        </div>
      </div>
    </div>
  );
};
