import React from 'react';
import { X, SlidersHorizontal, Check, RotateCcw } from 'lucide-react';
import { MasterDataType } from './types';

export interface ProductSettingsColumnVisibility {
  code: boolean;
  type_badge: boolean;
  usage_count: boolean;
  status: boolean;
  ordering: boolean;
  scope_or_country: boolean;
  updated_time: boolean;
}

interface ColumnSettingModalProps {
  isOpen: boolean;
  columns: ProductSettingsColumnVisibility;
  density: 'normal' | 'compact';
  activeDataType?: MasterDataType;
  onToggleColumn: (key: keyof ProductSettingsColumnVisibility) => void;
  onChangeDensity: (density: 'normal' | 'compact') => void;
  onReset: () => void;
  onClose: () => void;
}

export const ColumnSettingModal: React.FC<ColumnSettingModalProps> = ({
  isOpen,
  columns,
  density,
  activeDataType,
  onToggleColumn,
  onChangeDensity,
  onReset,
  onClose,
}) => {
  if (!isOpen) return null;

  const columnLabels: { key: keyof ProductSettingsColumnVisibility; label: string }[] = [
    { key: 'code', label: 'Mã nhận diện / Code' },
    { key: 'type_badge', label: 'Loại master data' },
    { key: 'usage_count', label: 'Số sản phẩm đang dùng' },
    { key: 'status', label: 'Trạng thái sử dụng' },
    { key: 'ordering', label: 'Thứ tự hiển thị (Priority/Order)' },
    ...(activeDataType === 'sales_staff'
      ? [{ key: 'scope_or_country' as const, label: 'Thông tin liên hệ (SĐT, Skype, Zalo)' }]
      : []),
    { key: 'updated_time', label: 'Thời gian cập nhật gần nhất' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-orange-500/10 text-orange-600 rounded-xl">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 dark:text-white">
                Cấu hình Hiển thị Cột Bảng
              </h2>
              <p className="text-xs text-slate-500">Chọn các cột thông tin cần hiển thị</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 text-xs">
          {/* Column Checklist */}
          <div className="space-y-2">
            <div className="font-bold text-slate-700 dark:text-slate-300">
              Chọn các cột hiển thị:
            </div>
            <div className="space-y-1.5 border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50/50 dark:bg-slate-800/50">
              {columnLabels.map(({ key, label }) => (
                <label
                  key={key}
                  onClick={() => onToggleColumn(key)}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-white dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <span className="font-medium text-slate-800 dark:text-slate-200">{label}</span>
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                      columns[key]
                        ? 'bg-orange-600 border-orange-600 text-white'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {columns[key] && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Table Density Toggle */}
          <div className="space-y-2">
            <div className="font-bold text-slate-700 dark:text-slate-300">Khoảng cách dòng:</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onChangeDensity('normal')}
                className={`py-2 px-3 rounded-xl border text-center font-bold cursor-pointer transition-all ${
                  density === 'normal'
                    ? 'border-orange-600 bg-orange-500/10 text-orange-600'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                Tiêu chuẩn
              </button>
              <button
                onClick={() => onChangeDensity('compact')}
                className={`py-2 px-3 rounded-xl border text-center font-bold cursor-pointer transition-all ${
                  density === 'compact'
                    ? 'border-orange-600 bg-orange-500/10 text-orange-600'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                Thu gọn
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
          <button
            onClick={onReset}
            className="px-3 py-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Khôi phục mặc định</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
          >
            Áp dụng thay đổi
          </button>
        </div>

      </div>
    </div>
  );
};
