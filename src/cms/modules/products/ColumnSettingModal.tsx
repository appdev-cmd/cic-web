import React from 'react';
import { SlidersHorizontal, Check, RotateCcw, X, Layers } from 'lucide-react';

export interface ColumnVisibility {
  product: boolean;
  code: boolean;
  category: boolean;
  brand: boolean;
  product_type: boolean;
  application: boolean;
  price: boolean;
  ordering: boolean;
  is_hot: boolean;
  teamview: boolean;
  editorial_status: boolean;
  updated_time: boolean;
}

export const defaultColumnVisibility: ColumnVisibility = {
  product: true,
  code: true,
  category: true,
  brand: true,
  product_type: true,
  application: true,
  price: true,
  ordering: true,
  is_hot: true,
  teamview: false,
  editorial_status: true,
  updated_time: true,
};

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
    { key: 'product', label: 'Tên & Ảnh sản phẩm', desc: 'Ảnh đại diện, tên sản phẩm và nhãn nổi bật' },
    { key: 'code', label: 'Biệt danh / Mã', desc: 'Mã định danh biệt danh của sản phẩm' },
    { key: 'category', label: 'Lĩnh vực', desc: 'Danh mục lĩnh vực chuyên ngành' },
    { key: 'brand', label: 'Hãng sản xuất', desc: 'Thương hiệu / Đối tác công nghệ' },
    { key: 'product_type', label: 'Loại sản phẩm', desc: 'Phần mềm, Thiết bị, Bản quyền...' },
    { key: 'application', label: 'Ứng dụng', desc: 'Các lĩnh vực ứng dụng của sản phẩm' },
    { key: 'price', label: 'Giá', desc: 'Giá sản phẩm hoặc báo giá license' },
    { key: 'ordering', label: 'Thứ tự', desc: 'Thứ tự hiển thị ưu tiên' },
    { key: 'is_hot', label: 'Sản phẩm tiêu biểu', desc: 'Đánh dấu nổi bật trang chủ' },
    { key: 'teamview', label: 'Link TeamViewer', desc: 'Hỗ trợ kết nối từ xa' },
    { key: 'editorial_status', label: 'Trạng thái', desc: 'Đã xuất bản, Bản nháp, Lưu trữ' },
    { key: 'updated_time', label: 'Thời gian cập nhật', desc: 'Thời điểm chỉnh sửa gần nhất' },
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
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
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
              <span>Khoảng cách dòng:</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onChangeDensity('normal')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  density === 'normal'
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 shadow-2xs'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>Tiêu chuẩn</span>
                {density === 'normal' && <Check className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => onChangeDensity('compact')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  density === 'compact'
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 shadow-2xs'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>Thu gọn</span>
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
                className="text-[11px] text-orange-600 dark:text-orange-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Đặt lại mặc định</span>
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {columnLabels.map((col) => {
                const isChecked = columns[col.key];
                const isTitleCol = col.key === 'product';
                return (
                  <div
                    key={col.key}
                    onClick={() => !isTitleCol && onToggleColumn(col.key)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-colors ${
                      isTitleCol
                        ? 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 opacity-80 cursor-not-allowed'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 cursor-pointer'
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
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors cursor-pointer"
          >
            Đóng & Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
};
