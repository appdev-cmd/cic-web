import React from 'react';
import {
  Globe,
  Layers,
  FileCheck,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Building2,
  Sliders,
  Table as TableIcon,
} from 'lucide-react';
import type { CmsSettingsData, CmsSettingsScopeId } from '@/features/system-settings/domain/model';

interface OverviewTabProps {
  websiteData: CmsSettingsData;
  activeScopeId: CmsSettingsScopeId;
  onSelectScope: (scopeId: CmsSettingsScopeId) => void;
  onGoToEditor: (scopeId: CmsSettingsScopeId) => void;
  onGoToBranches: () => void;
  onGoToTable: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  websiteData,
  activeScopeId,
  onSelectScope,
  onGoToEditor,
  onGoToBranches,
  onGoToTable,
}) => {
  const workspaces = websiteData.workspaces;
  const totalScopes = workspaces.length;
  
  // Total configured settings count across all workspaces
  let totalSettingsCount = 0;
  let filledSettingsCount = 0;
  let totalBranchesCount = 0;

  workspaces.forEach((ws) => {
    totalSettingsCount += ws.settings.length;
    filledSettingsCount += ws.settings.filter((s) => s.value && s.value.trim().length > 0).length;
    totalBranchesCount += ws.branches.length;
  });

  const overallCompletionRate = totalSettingsCount > 0 
    ? Math.round((filledSettingsCount / totalSettingsCount) * 100) 
    : 100;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* TOP SUMMARY KPI BANNER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Tên miền & Scope</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {totalScopes} <span className="text-xs font-normal text-slate-400">Phạm vi</span>
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 3 Bộ dữ liệu độc lập
            </div>
          </div>
          <span className="p-3 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl">
            <Globe className="w-6 h-6" />
          </span>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Trụ sở & Chi nhánh</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {totalBranchesCount} <span className="text-xs font-normal text-slate-400">Địa điểm</span>
            </div>
            <div className="text-[11px] text-orange-600 dark:text-orange-400 font-semibold mt-1 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" /> Hà Nội & TP. Hồ Chí Minh
            </div>
          </div>
          <span className="p-3 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl">
            <Building2 className="w-6 h-6" />
          </span>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Cấu hình Đã thiết lập</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {filledSettingsCount} / {totalSettingsCount}
            </div>
            <div className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Khóa cấu hình chuẩn
            </div>
          </div>
          <span className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
            <Sliders className="w-6 h-6" />
          </span>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Tỷ lệ Hoàn tất</div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {overallCompletionRate}%
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Lưu trực tiếp vào PostgreSQL
            </div>
          </div>
          <span className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <FileCheck className="w-6 h-6" />
          </span>
        </div>
      </div>

      {/* SCOPES CARDS GRID */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-orange-500" />
              <span>Phạm vi Cấu hình Hệ thống (Workspaces)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Cấu hình được phân tách theo từng ngôn ngữ và phân hệ, lưu trực tiếp và đồng bộ công khai tức thì.
            </p>
          </div>
          <button
            type="button"
            onClick={onGoToTable}
            className="self-start sm:self-auto px-3.5 py-2 text-xs font-bold text-orange-600 hover:text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 rounded-xl border border-orange-200 dark:border-orange-900/50 flex items-center gap-1.5 transition cursor-pointer"
          >
            <TableIcon className="w-4 h-4" />
            <span>Xem Bảng tổng hợp tất cả cài đặt</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {workspaces.map((ws) => {
            const isSelected = ws.scope.id === activeScopeId;
            const filledCount = ws.settings.filter((s) => s.value && s.value.trim().length > 0).length;
            const totalCount = ws.settings.length;
            const completionPct = totalCount > 0 ? Math.round((filledCount / totalCount) * 100) : 100;
            const logoSetting = ws.settings.find((s) => s.key === 'logo');
            const siteNameSetting = ws.settings.find((s) => s.key === 'site_name');

            return (
              <div
                key={ws.scope.id}
                className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all ${
                  isSelected
                    ? 'border-orange-500 ring-2 ring-orange-500/20 shadow-md'
                    : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {ws.scope.locale.toUpperCase()}
                        </span>
                        {isSelected && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-orange-500 text-white">
                            Đang chọn
                          </span>
                        )}
                      </div>
                      <h4 className="text-base font-black text-slate-900 dark:text-white mt-1.5 truncate">
                        {ws.scope.name}
                      </h4>
                      <a
                        href={ws.scope.domain.startsWith('http') ? ws.scope.domain : `https://${ws.scope.domain}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700 dark:text-orange-400 font-semibold mt-1"
                      >
                        <span>{ws.scope.domain}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    {logoSetting?.value ? (
                      <div className="w-12 h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1 flex items-center justify-center shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={logoSetting.value} alt="" className="max-w-full max-h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 text-slate-400">
                        <Globe className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span>Tên hiển thị:</span>
                      <span className="font-bold text-slate-900 dark:text-white truncate max-w-[160px]">
                        {siteNameSetting?.value || 'Chưa đặt'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span>Số trường cấu hình:</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {filledCount} / {totalCount} ({completionPct}%)
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-orange-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${completionPct}%` }}
                      />
                    </div>

                    {ws.scope.locale !== 'enjicad' && (
                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                        <span>Trụ sở & Chi nhánh:</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {ws.branches.length} địa điểm
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectScope(ws.scope.id);
                      onGoToEditor(ws.scope.id);
                    }}
                    className="flex-1 min-h-10 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-extrabold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Mở bộ cấu hình</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {ws.scope.locale !== 'enjicad' && (
                    <button
                      type="button"
                      onClick={() => {
                        onSelectScope(ws.scope.id);
                        onGoToBranches();
                      }}
                      className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 transition flex items-center gap-1 cursor-pointer"
                      title="Quản lý chi nhánh"
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Chi nhánh</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
