import React from 'react';
import { SlidersHorizontal, Check, RotateCcw, X, Layers } from 'lucide-react';

export interface ColumnVisibility {
  title: boolean;
  sku: boolean;
  category: boolean;
  brand: boolean;
  owner: boolean;
  editorial_status: boolean;
  catalog_status: boolean;
  updated_time: boolean;
  completeness: boolean;
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

  const columnLabels: Array<{ key: keyof ColumnVisibility; label: string; desc: string }> = [
    { key: 'title', label: 'Tên & Nhận diện sản phẩm', desc: 'Thumbnail, tiêu đề và chất lượng' },
    { key: 'sku', label: 'Mã SKU / Mã nhận diện', desc: 'Mã SKU duy nhất của sản phẩm' },
    { key: 'category', label: 'Danh mục & Loại sản phẩm', desc: 'Phân loại catalog' },
    { key: 'brand', label: 'Hãng sản xuất', desc: 'Thương hiệu / Đối tác' },
    { key: 'owner', label: 'Người phụ trách', desc: 'Chuyên viên quản lý sản phẩm' },
    { key: 'editorial_status', label: 'Trạng thái Biên tập', desc: 'Draft, Pending, Approved, Published' },
    { key: 'catalog_status', label: 'Trạng thái Kinh doanh', desc: 'Active, Inactive, Archived' },
    { key: 'completeness', label: 'Điểm hoàn thiện (%)', desc: 'Completeness checklist score' },
    { key: 'updated_time', label: 'Thời gian cập nhật', desc: 'Người sửa & thời điểm gần nhất' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-orange-500/10 text-orange-600 rounded-xl">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Cấu hình Hiển thị Cột & Mật độ
              </h3>
              <p className="text-[11px] text-slate-500">Tùy chỉnh giao diện bảng danh sách sản phẩm</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-5 overflow-y-auto flex-1 text-xs">
          {/* Row Density Settings */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-orange-600" />
              <span>Mật độ hàng (Table Density):</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onChangeDensity('normal')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  density === 'normal'
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 shadow-2xs'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                }`}
              >
                <span>Thoải mái (Normal)</span>
                {density === 'normal' && <Check className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => onChangeDensity('compact')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  density === 'compact'
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 shadow-2xs'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                }`}
              >
                <span>Nén gọn (Compact)</span>
                {density === 'compact' && <Check className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Columns Visibility Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Các cột hiển thị trên bảng:
              </label>
              <button
                type="button"
                onClick={onReset}
                className="text-[11px] text-orange-600 dark:text-orange-400 font-bold hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Đặt lại mặc định</span>
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {columnLabels.map((col) => {
                const isChecked = columns[col.key];
                const isTitleCol = col.key === 'title';
                return (
                  <div
                    key={col.key}
                    onClick={() => !isTitleCol && onToggleColumn(col.key)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-colors ${
                      isTitleCol ? 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 opacity-80 cursor-not-allowed' : 'hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 cursor-pointer'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{col.label}</p>
                      <p className="text-[10px] text-slate-400">{col.desc}</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                        isChecked
                          ? 'bg-orange-600 border-orange-600 text-white'
                          : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors"
          >
            Đóng & Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
};
