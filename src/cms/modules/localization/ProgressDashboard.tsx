import React from 'react';
import {
  Globe,
  Sparkles,
  Cpu,
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  ArrowRight,
  TrendingUp,
  Layers,
  ShieldAlert,
  Search,
} from 'lucide-react';
import { MainTabType, TranslationItem, TranslationProgressStats } from './types';

interface ProgressDashboardProps {
  stats: TranslationProgressStats;
  items: TranslationItem[];
  onNavigateTab: (tab: MainTabType) => void;
  onSelectQuickAction: (action: 'missing_en' | 'outdated' | 'review' | 'my_queue') => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  stats,
  items,
  onNavigateTab,
  onSelectQuickAction,
}) => {
  const recentActivities = items
    .flatMap((item) =>
      item.history.map((h) => ({
        ...h,
        key: item.key,
        scope: item.scope,
        itemId: item.id,
      }))
    )
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 6);

  return (
    <div className="space-y-6">
      {/* 1. TOP STATS OVERVIEW & HIGHLIGHT BANNER FOR 44 MISSING EN STRINGS */}
      {stats.missingEnCount > 0 && (
        <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-rose-500/15 border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl shrink-0 mt-0.5">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Cảnh báo tiến độ: Còn {stats.missingEnCount} chuỗi tiếng Anh (EN) Backend chưa có bản dịch!
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-amber-500 text-slate-950 rounded-full">
                  Ưu tiên Cao
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Hệ thống phát hiện {stats.missingEnCount} thông báo lỗi & email mẫu backend tiếng Việt chưa có bản dịch tương ứng tiếng Anh. Hãy dùng bộ lọc "Chuỗi EN còn thiếu" để hoàn thiện theo quy trình.
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectQuickAction('missing_en')}
            className="w-full md:w-auto px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <span>Xử lý {stats.missingEnCount} chuỗi EN ngay</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. PROGRESS METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Completion */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Tiến độ tổng thể (VI → EN)</span>
            <Globe className="w-4 h-4 text-orange-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {stats.overallCompletionPercentage}%
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              {stats.completedCount}/{stats.totalItems} đã xong
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${stats.overallCompletionPercentage}%` }}
            />
          </div>
        </div>

        {/* Frontend Strings Progress */}
        <div
          onClick={() => onNavigateTab('frontend')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-orange-500/50 rounded-2xl p-4 shadow-2xs space-y-3 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span className="group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
              Chuỗi Frontend (79 UI)
            </span>
            <Sparkles className="w-4 h-4 text-sky-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {stats.frontendCompletionPercentage}%
            </span>
            <span className="text-xs text-slate-500">
              {stats.frontendCount} chuỗi
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-sky-500 rounded-full transition-all duration-500"
              style={{ width: `${stats.frontendCompletionPercentage}%` }}
            />
          </div>
        </div>

        {/* Backend API Strings Progress */}
        <div
          onClick={() => onNavigateTab('backend')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 shadow-2xs space-y-3 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span className="group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              Chuỗi Backend API (90 System)
            </span>
            <Cpu className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {stats.backendCompletionPercentage}%
            </span>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
              {stats.missingEnCount} chuỗi thiếu EN
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${stats.backendCompletionPercentage}%` }}
            />
          </div>
        </div>

        {/* CMS Content Items Progress */}
        <div
          onClick={() => onNavigateTab('content')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 rounded-2xl p-4 shadow-2xs space-y-3 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span className="group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Nội dung CMS (Localized)
            </span>
            <FileText className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {stats.contentCompletionPercentage}%
            </span>
            <span className="text-xs text-slate-500">
              {stats.contentCount} bài viết/sản phẩm
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${stats.contentCompletionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. WORK QUEUE CARDS & RECENT ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Work Queues Navigation */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-orange-500" />
              <span>Hàng chờ xử lý dịch thuật (Work Queues)</span>
            </h3>
            <span className="text-xs text-slate-500">Chọn góc nhìn làm việc</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Missing Queue Card */}
            <div
              onClick={() => onSelectQuickAction('missing_en')}
              className="p-4 rounded-xl border border-rose-200 dark:border-rose-950/60 bg-rose-50/50 dark:bg-rose-950/20 hover:bg-rose-100/60 dark:hover:bg-rose-950/40 cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-700 dark:text-rose-300">
                  Bản dịch còn thiếu
                </span>
                <AlertCircle className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl font-black text-rose-700 dark:text-rose-300">
                {stats.missingEnCount}
              </div>
              <p className="text-[11px] text-rose-600/80 dark:text-rose-400">
                Chuỗi chưa có nội dung tiếng Anh
              </p>
            </div>

            {/* Outdated Queue Card */}
            <div
              onClick={() => onSelectQuickAction('outdated')}
              className="p-4 rounded-xl border border-amber-200 dark:border-amber-950/60 bg-amber-50/50 dark:bg-amber-950/20 hover:bg-amber-100/60 dark:hover:bg-amber-950/40 cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
                  Nguồn vừa thay đổi (Outdated)
                </span>
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-amber-700 dark:text-amber-300">
                {stats.outdatedCount}
              </div>
              <p className="text-[11px] text-amber-600/80 dark:text-amber-400">
                Nguồn tiếng Việt đã được chỉnh sửa
              </p>
            </div>

            {/* Review Pending Queue Card */}
            <div
              onClick={() => onSelectQuickAction('review')}
              className="p-4 rounded-xl border border-sky-200 dark:border-sky-950/60 bg-sky-50/50 dark:bg-sky-950/20 hover:bg-sky-100/60 dark:hover:bg-sky-950/40 cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-700 dark:text-sky-300">
                  Hàng chờ Reviewer duyệt
                </span>
                <Clock className="w-4 h-4 text-sky-500" />
              </div>
              <div className="text-2xl font-black text-sky-700 dark:text-sky-300">
                {stats.reviewPendingCount}
              </div>
              <p className="text-[11px] text-sky-600/80 dark:text-sky-400">
                Translator đã gửi chờ phê duyệt
              </p>
            </div>
          </div>
        </div>

        {/* Recent Translation Activity Log */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-500" />
              <span>Hoạt động bản dịch mới nhất</span>
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            {recentActivities.length > 0 ? (
              recentActivities.map((act) => (
                <div
                  key={act.id}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {act.actor_name}
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">
                      {act.timestamp.substring(11, 16)}
                    </span>
                  </div>
                  <div className="text-slate-600 dark:text-slate-300 font-mono text-[11px] truncate">
                    {act.key}
                  </div>
                  <div className="text-[11px] text-slate-500 italic">
                    {act.description}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-slate-400 py-6">
                Chưa có hoạt động mới ghi nhận.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
