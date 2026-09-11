import React from 'react';
import { BarChart2 } from 'lucide-react';
import { FormItem } from '../../types';

interface FormAnalyticsTabProps {
  form: FormItem | null;
}

export const FormAnalyticsTab: React.FC<FormAnalyticsTabProps> = ({ form }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs max-w-3xl space-y-6">
      <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
        <BarChart2 className="w-4 h-4 text-orange-500" />
        Thống kê chuyển đổi & Vị trí nhúng
      </h2>

      <div className="grid grid-cols-3 gap-4 text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
        <div>
          <span className="text-xs text-slate-400 block">Lượt hiển thị</span>
          <span className="text-xl font-extrabold text-slate-900 dark:text-white">
            {form?.analytics.impressions?.toLocaleString() || 0}
          </span>
        </div>
        <div>
          <span className="text-xs text-slate-400 block">Số lượt điền thành công</span>
          <span className="text-xl font-extrabold text-orange-600 dark:text-orange-400">
            {form?.stats?.submissions || form?.analytics.clicks || 0}
          </span>
        </div>
        <div>
          <span className="text-xs text-slate-400 block">Tỷ lệ hoàn thành</span>
          <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {form?.stats?.conversionRate || form?.analytics.ctr || 0}%
          </span>
        </div>
      </div>
    </div>
  );
};
