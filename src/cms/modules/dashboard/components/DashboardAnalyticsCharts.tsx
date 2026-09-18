import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import type { TrafficStat, WeeklyContentStat } from '../../../types';
import type { CmsLocale } from '../../../data/CmsDataSource';

interface DashboardAnalyticsChartsProps {
  traffic7Days: TrafficStat[];
  traffic30Days: TrafficStat[];
  weeklyContent: WeeklyContentStat[];
  workspaceLocale: CmsLocale;
}

export const DashboardAnalyticsCharts: React.FC<DashboardAnalyticsChartsProps> = ({
  traffic7Days,
  traffic30Days,
  weeklyContent,
  workspaceLocale,
}) => {
  const [timeRange, setTimeRange] = useState<'7' | '30'>('7');
  const isEn = workspaceLocale === 'en';

  const trafficData = timeRange === '7' ? traffic7Days : traffic30Days;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Line Chart: Lượt truy cập Website */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              {isEn ? 'Website Traffic Analytics' : 'Biểu đồ Lượt truy cập Website'}
            </h3>
            <p className="text-[11px] text-slate-400">
              {isEn
                ? 'Track visitors (Visits) and page views (Pageviews)'
                : 'Theo dõi số lượt ghé thăm (Visits) và xem trang (Pageviews)'}
            </p>
          </div>

          {/* Range Switch */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
            <button
              onClick={() => setTimeRange('7')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-xs ${
                timeRange === '7'
                  ? 'bg-orange-600 text-white font-bold shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              {isEn ? '7 Days' : '7 Ngày'}
            </button>
            <button
              onClick={() => setTimeRange('30')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-xs ${
                timeRange === '30'
                  ? 'bg-orange-600 text-white font-bold shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              {isEn ? '30 Days' : '30 Ngày'}
            </button>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={trafficData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
              <XAxis dataKey="date_label" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="visits_count"
                name={isEn ? 'Visits' : 'Lượt ghé thăm (Visits)'}
                stroke="#ea580c"
                strokeWidth={3}
                dot={{ r: 4, fill: '#ea580c' }}
              />
              <Line
                type="monotone"
                dataKey="page_views_count"
                name={isEn ? 'Pageviews' : 'Lượt xem trang (Pageviews)'}
                stroke="#3b82f6"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3, fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart: Nội dung xuất bản theo tuần */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              {isEn ? 'Weekly Published Content' : 'Thống kê Nội dung xuất bản theo tuần'}
            </h3>
            <p className="text-[11px] text-slate-400">
              {isEn
                ? 'Breakdown across 3 content types: News, Products, Events'
                : 'Phân bổ 3 loại nội dung: Tin tức, Sản phẩm, Sự kiện'}
            </p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weeklyContent}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
              <XAxis dataKey="week_label" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="news_count" name={isEn ? 'News' : 'Tin tức'} fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="product_count" name={isEn ? 'Products' : 'Sản phẩm'} fill="#ea580c" radius={[4, 4, 0, 0]} />
              <Bar dataKey="event_count" name={isEn ? 'Events' : 'Sự kiện'} fill="#a855f7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
