import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Layers,
  AlertTriangle,
  Sliders,
  Image as ImageIcon,
  CheckCircle2,
  Eye,
  Edit,
} from 'lucide-react';
import { BannerContent, BannerPlacementConfig } from './types';

interface BannerCalendarViewProps {
  items: BannerContent[];
  placements: BannerPlacementConfig[];
  onEdit: (item: BannerContent) => void;
  onPreview: (item: BannerContent) => void;
}

export const BannerCalendarView: React.FC<BannerCalendarViewProps> = ({
  items,
  placements,
  onEdit,
  onPreview,
}) => {
  const [calendarMode, setCalendarMode] = useState<'month' | 'week' | 'agenda' | 'lanes'>('lanes');
  const [currentMonth, setCurrentMonth] = useState('Tháng 8 / 2026');

  return (
    <div className="space-y-4">
      {/* Calendar Header Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
              <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            </button>
            <span className="text-sm font-extrabold text-slate-900 dark:text-white min-w-[120px] text-center">
              {currentMonth}
            </span>
            <button className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
              <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            </button>
          </div>
          <button className="px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition">
            Hôm nay (04/08)
          </button>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          {[
            { id: 'lanes', label: 'Theo Vị Trí (Placement Lanes)' },
            { id: 'agenda', label: 'Danh Sách Lịch (Agenda)' },
            { id: 'month', label: 'Tháng (Month)' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setCalendarMode(mode.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                calendarMode === mode.id
                  ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mode 1: Placement Lanes Timeline */}
      {calendarMode === 'lanes' && (
        <div className="space-y-4">
          {placements.map((plc) => {
            const plcItems = items.filter((i) => i.placement_id === plc.id);
            return (
              <div
                key={plc.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3"
              >
                {/* Placement Header */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{plc.name}</h3>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500">
                        Sức chứa tối đa: <strong>{plc.max_capacity} banner</strong> | Tỷ lệ đề xuất:{' '}
                        <strong>{plc.recommended_ratio} ({plc.recommended_resolution})</strong>
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {plcItems.length} nội dung được gán
                  </span>
                </div>

                {/* Timeline Lane Items */}
                <div className="space-y-2">
                  {plcItems.length === 0 ? (
                    <p className="text-xs text-slate-400 dark:text-slate-500 italic py-2">
                      Chưa có nội dung nào được đặt lịch trong vị trí này.
                    </p>
                  ) : (
                    plcItems.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 transition ${
                          item.effective_status === 'conflict'
                            ? 'border-rose-300 dark:border-rose-800/80 bg-rose-50/40 dark:bg-rose-950/20'
                            : item.effective_status === 'running'
                            ? 'border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/30 dark:bg-emerald-950/20'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.media_url}
                            alt={item.title}
                            className="w-14 h-9 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                          />
                          <div className="space-y-0.5 min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-0.5 text-[9px] font-extrabold rounded ${
                                  item.type === 'slideshow'
                                    ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                                    : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                                }`}
                              >
                                {item.type.toUpperCase()}
                              </span>
                              <h4 className="font-bold text-slate-900 dark:text-white text-xs truncate max-w-sm">
                                {item.title}
                              </h4>
                            </div>
                            <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                              <span>
                                <Clock className="w-3 h-3 inline mr-1" />
                                {item.start_time} ➔ {item.end_time}
                              </span>
                              <span className="font-sans font-bold text-orange-600">
                                Ưu tiên: W{item.priority_weight}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 justify-end">
                          {item.effective_status === 'running' && (
                            <span className="px-2 py-1 text-[10px] font-bold rounded-md bg-emerald-500 text-white">
                              Live Now
                            </span>
                          )}
                          {item.effective_status === 'conflict' && (
                            <span className="px-2 py-1 text-[10px] font-bold rounded-md bg-rose-600 text-white animate-pulse flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> Trùng lịch
                            </span>
                          )}
                          <button
                            onClick={() => onPreview(item)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 transition"
                            title="Xem trước Preview"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEdit(item)}
                            className="p-1.5 text-slate-500 hover:text-orange-600 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/40 transition"
                            title="Sửa lịch & nội dung"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mode 2: Agenda View */}
      {calendarMode === 'agenda' && (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs divide-y divide-slate-200 dark:divide-slate-800">
          {items.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs">{item.title}</h4>
                  <p className="text-[11px] text-slate-400">
                    Vị trí: <strong>{item.placement_name}</strong> | Lịch: {item.start_time} - {item.end_time}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(item)}
                  className="px-3 py-1 text-xs font-bold text-orange-600 bg-orange-50 dark:bg-orange-950/40 hover:bg-orange-100 rounded-lg transition"
                >
                  Điều chỉnh
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mode 3: Month View Mock Grid */}
      {calendarMode === 'month' && (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-2">
            <div>Thứ 2</div>
            <div>Thứ 3</div>
            <div>Thứ 4</div>
            <div>Thứ 5</div>
            <div>Thứ 6</div>
            <div>Thứ 7</div>
            <div>Chủ nhật</div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 31 }).map((_, i) => (
              <div
                key={i}
                className={`min-h-[80px] p-1.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-xs ${
                  i === 3 ? 'ring-2 ring-orange-500 bg-orange-50/30 dark:bg-orange-950/20' : ''
                }`}
              >
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">{i + 1}</span>
                {i === 3 && (
                  <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-emerald-500 text-white block truncate">
                    Hero Slider Live
                  </span>
                )}
                {i === 4 && (
                  <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-blue-500 text-white block truncate mt-1">
                    GeoSlope Pop-up
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
