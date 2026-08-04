import React from 'react';
import { X, Check, Eye, Sliders, CheckSquare, Square } from 'lucide-react';

export interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
  required?: boolean;
}

interface ColumnSettingModalProps {
  isOpen: boolean;
  columns: ColumnConfig[];
  density: 'compact' | 'normal' | 'spacious';
  onClose: () => void;
  onToggleColumn: (id: string) => void;
  onChangeDensity: (density: 'compact' | 'normal' | 'spacious') => void;
}

export const ColumnSettingModal: React.FC<ColumnSettingModalProps> = ({
  isOpen,
  columns,
  density,
  onClose,
  onToggleColumn,
  onChangeDensity,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden space-y-5 p-6 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <Sliders className="w-5 h-5 text-orange-600" />
            <span>Tùy chỉnh cột & Hiển thị Data Table</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Table Density Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Độ cao hàng dữ liệu (Density)
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onChangeDensity('compact')}
              className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                density === 'compact'
                  ? 'bg-orange-500/10 border-orange-500 text-orange-600 dark:text-orange-400'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              Thu nhỏ (Compact)
            </button>
            <button
              onClick={() => onChangeDensity('normal')}
              className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                density === 'normal'
                  ? 'bg-orange-500/10 border-orange-500 text-orange-600 dark:text-orange-400'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              Vừa phải (Normal)
            </button>
            <button
              onClick={() => onChangeDensity('spacious')}
              className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                density === 'spacious'
                  ? 'bg-orange-500/10 border-orange-500 text-orange-600 dark:text-orange-400'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              Rộng rãi (Spacious)
            </button>
          </div>
        </div>

        {/* Columns Toggle List */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Ẩn/Hiện cột hiển thị trong danh sách
          </label>
          <div className="space-y-1.5 max-h-60 overflow-y-auto">
            {columns.map((col) => (
              <label
                key={col.id}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                  col.visible
                    ? 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white'
                    : 'bg-slate-100/50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2.5 text-xs font-medium">
                  <input
                    type="checkbox"
                    disabled={col.required}
                    checked={col.visible}
                    onChange={() => onToggleColumn(col.id)}
                    className="w-4 h-4 accent-orange-600 rounded cursor-pointer"
                  />
                  <span>{col.label}</span>
                </div>
                {col.required && <span className="text-[10px] text-slate-400 italic">Bắt buộc</span>}
              </label>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Hoàn tất
          </button>
        </div>
      </div>
    </div>
  );
};
