import React, { useState, useEffect } from 'react';
import {
  X,
  Sliders,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Check,
  Grid,
  Globe,
  Layout,
} from 'lucide-react';

import { DashboardPreference, WidgetConfig } from './types';

interface DashboardCustomizerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  preference: DashboardPreference;
  onSavePreference: (newPref: DashboardPreference) => void;
  onOpenResetModal: () => void;
}

export const DashboardCustomizerDrawer: React.FC<DashboardCustomizerDrawerProps> = ({
  isOpen,
  onClose,
  preference,
  onSavePreference,
  onOpenResetModal,
}) => {
  const [tempPref, setTempPref] = useState<DashboardPreference>(preference);

  useEffect(() => {
    setTempPref(preference);
  }, [preference, isOpen]);

  if (!isOpen) return null;

  const toggleWidget = (id: string) => {
    setTempPref((prev) => ({
      ...prev,
      widgets: prev.widgets.map((w) =>
        w.id === id ? { ...w, visible: !w.visible } : w
      ),
    }));
  };

  const moveWidget = (id: string, direction: 'up' | 'down') => {
    setTempPref((prev) => {
      const sorted = [...prev.widgets].sort((a, b) => a.order - b.order);
      const index = sorted.findIndex((w) => w.id === id);
      if (index === -1) return prev;

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= sorted.length) return prev;

      // Swap orders
      const tempOrder = sorted[index].order;
      sorted[index].order = sorted[targetIndex].order;
      sorted[targetIndex].order = tempOrder;

      return {
        ...prev,
        widgets: sorted,
      };
    });
  };

  const handleSave = () => {
    onSavePreference(tempPref);
    onClose();
  };

  const sortedWidgets = [...tempPref.widgets].sort((a, b) => a.order - b.order);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between">
          {/* DRAWER HEADER */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Tùy chỉnh Bố cục Dashboard
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Cá nhân hóa Widget, mật độ hiển thị & phạm vi
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* DRAWER BODY */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* SECTION 1: WIDGET MANAGEMENT */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                  <Layout className="w-4 h-4 text-orange-500" />
                  <span>Danh sách Widget hiển thị</span>
                </h3>
                <span className="text-[11px] text-slate-400">
                  {tempPref.widgets.filter((w) => w.visible).length}/{tempPref.widgets.length} Bật
                </span>
              </div>

              <div className="space-y-2">
                {sortedWidgets.map((widget, idx) => (
                  <div
                    key={widget.id}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                      widget.visible
                        ? 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 shadow-2xs'
                        : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200/50 dark:border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleWidget(widget.id)}
                        className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          widget.visible
                            ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                        }`}
                        title={widget.visible ? 'Ẩn widget' : 'Hiện widget'}
                      >
                        {widget.visible ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </button>

                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {widget.name}
                        </p>
                        <span className="text-[10px] text-slate-400 font-medium">
                          Phân loại: {widget.category}
                        </span>
                      </div>
                    </div>

                    {/* Move up / down buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveWidget(widget.id, 'up')}
                        disabled={idx === 0}
                        className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        title="Di chuyển lên"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveWidget(widget.id, 'down')}
                        disabled={idx === sortedWidgets.length - 1}
                        className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        title="Di chuyển xuống"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 2: DISPLAY DENSITY */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <Grid className="w-4 h-4 text-purple-500" />
                <span>Mật độ hiển thị Task Rows</span>
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() =>
                    setTempPref((prev) => ({ ...prev, density: 'comfortable' }))
                  }
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    tempPref.density === 'comfortable'
                      ? 'border-orange-500 bg-orange-500/5 text-slate-900 dark:text-white font-bold shadow-2xs'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="text-xs font-bold block">Comfortable</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Thoải mái (Spacious padding)
                  </span>
                </button>

                <button
                  onClick={() =>
                    setTempPref((prev) => ({ ...prev, density: 'compact' }))
                  }
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    tempPref.density === 'compact'
                      ? 'border-orange-500 bg-orange-500/5 text-slate-900 dark:text-white font-bold shadow-2xs'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="text-xs font-bold block">Compact</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Thu gọn (Tối ưu không gian)
                  </span>
                </button>
              </div>
            </div>

            {/* SECTION 3: DEFAULT LOCALE SCOPE */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-emerald-500" />
                <span>Phạm vi Dữ liệu Mặc định</span>
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() =>
                    setTempPref((prev) => ({ ...prev, localeScope: 'current' }))
                  }
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    tempPref.localeScope === 'current'
                      ? 'border-emerald-500 bg-emerald-500/5 text-slate-900 dark:text-white font-bold shadow-2xs'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="text-xs font-bold block">Locale hiện hành</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Chỉ hiển thị dữ liệu VI/EN đang chọn
                  </span>
                </button>

                <button
                  onClick={() =>
                    setTempPref((prev) => ({ ...prev, localeScope: 'all' }))
                  }
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    tempPref.localeScope === 'all'
                      ? 'border-emerald-500 bg-emerald-500/5 text-slate-900 dark:text-white font-bold shadow-2xs'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="text-xs font-bold block">Tất cả Locales</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Tổng hợp VI + EN (Phân bộc theo tab)
                  </span>
                </button>
              </div>
            </div>

            {/* SECTION 4: RESET ACTION */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={onOpenResetModal}
                className="w-full py-2.5 px-3 rounded-xl border border-amber-300 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 text-xs font-bold flex items-center justify-center gap-2 hover:bg-amber-100 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Đặt lại Cấu hình Bố cục Mặc định</span>
              </button>
            </div>
          </div>

          {/* DRAWER FOOTER */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-orange-600/20 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Lưu Cấu hình</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
