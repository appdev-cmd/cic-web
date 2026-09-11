import React from 'react';
import { BarChart2 } from 'lucide-react';
import { CtaItem, CtaFormData } from '../types';
import { CTA_STATUSES, CtaStatus } from '../../shared/constants/statusTypes';

interface CtaAnalyticsSidebarProps {
  cta: CtaItem | null;
  formData: CtaFormData;
  setFormData: React.Dispatch<React.SetStateAction<CtaFormData>>;
}

export const CtaAnalyticsSidebar: React.FC<CtaAnalyticsSidebarProps> = ({
  cta,
  formData,
  setFormData,
}) => {
  return (
    <div className="space-y-6">
      {/* Sidebar 1: Trạng thái CTA */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Trạng thái lưu
        </h3>

        <div className="space-y-2">
          {CTA_STATUSES.map((status) => (
            <label
              key={status.value}
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                formData.status === status.value
                  ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/30'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <input
                type="radio"
                name="status"
                checked={formData.status === status.value}
                onChange={() => setFormData((prev) => ({ ...prev, status: status.value as CtaStatus }))}
                className="w-4 h-4 text-orange-600 focus:ring-orange-500"
              />
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  {status.label}
                </span>
                <span className="text-[11px] text-slate-400">
                  {status.value === 'active' && 'Hiển thị hoạt động bình thường trên web'}
                  {status.value === 'draft' && 'Lưu bản nháp chưa công khai'}
                  {status.value === 'archived' && 'Tạm ẩn lưu trữ lịch sử'}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Sidebar 2: Usage Locations & Analytics (if editing) */}
      {cta && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <BarChart2 className="w-4 h-4 text-orange-500" />
            Hiệu quả & Vị trí nhúng
          </h3>

          <div className="grid grid-cols-3 gap-2 text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <div>
              <span className="text-[10px] text-slate-400 block">Lượt xem</span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                {cta.analytics.impressions.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Lượt nhấn</span>
              <span className="text-sm font-extrabold text-orange-600 dark:text-orange-400">
                {cta.analytics.clicks.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">CTR</span>
              <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                {cta.analytics.ctr}%
              </span>
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
              Trang đang sử dụng CTA này ({cta.usedByCount}):
            </span>
            <div className="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar">
              {cta.usedByPages.map((page, idx) => (
                <div
                  key={idx}
                  className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs flex items-center justify-between"
                >
                  <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[160px]">
                    {page.pageTitle}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {page.placementKey}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
