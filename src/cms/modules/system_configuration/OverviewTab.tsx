import React from 'react';
import {
  Globe,
  Layers,
  AlertTriangle,
  FileCheck,
  ArrowRight,
  ShieldAlert,
  GitBranch,
  ExternalLink,
  CheckCircle2,
  Clock,
  Settings,
  Sparkles,
} from 'lucide-react';
import { ConfigScope, ValidationIssue, ConfigDraft, ConfigVersionHistory } from './types';

interface OverviewTabProps {
  scopes: ConfigScope[];
  issues: ValidationIssue[];
  drafts: ConfigDraft[];
  versions: ConfigVersionHistory[];
  onSelectScope: (scopeId: ConfigScope['id']) => void;
  onGoToEditor: (scopeId: ConfigScope['id']) => void;
  onGoToDrafts: () => void;
  onGoToIssues: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  scopes,
  issues,
  drafts,
  versions,
  onSelectScope,
  onGoToEditor,
  onGoToDrafts,
  onGoToIssues,
}) => {
  const totalIssues = issues.length;
  const criticalIssues = issues.filter((i) => i.severity === 'critical').length;
  const pendingDraftsCount = scopes.filter((scope) => Boolean(scope.draftVersion)).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* TOP SUMMARY KPI BANNER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Tên miền & Scope</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {scopes.length} <span className="text-xs font-normal text-slate-400">Phạm vi</span>
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 1 Scope Gốc Kế thừa
            </div>
          </div>
          <span className="p-3 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl">
            <Globe className="w-6 h-6" />
          </span>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Bản nháp cấu hình</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {pendingDraftsCount} <span className="text-xs font-normal text-slate-400">Bản nháp</span>
            </div>
            <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Có thể xem lại và xuất bản trực tiếp
            </div>
          </div>
          <span className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
            <GitBranch className="w-6 h-6" />
          </span>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Cảnh báo Cấu hình</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {totalIssues} <span className="text-xs font-normal text-slate-400">Lỗi/Cảnh báo</span>
            </div>
            <div className="text-[11px] text-red-600 dark:text-red-400 font-semibold mt-1 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> {criticalIssues} Lỗi Nghiêm trọng (SMTP/API)
            </div>
          </div>
          <span className="p-3 bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl">
            <ShieldAlert className="w-6 h-6" />
          </span>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Trạng thái Đồng bộ</div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              98.5%
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Tối ưu Kế thừa & Tốc độ Cache
            </div>
          </div>
          <span className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <FileCheck className="w-6 h-6" />
          </span>
        </div>
      </div>

      {/* SCOPES CARDS GRID */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-orange-500" />
            <span>Danh sách Scope / Tên miền Cấu hình Hệ thống</span>
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Mọi thay đổi cấu hình được phân tách theo phạm vi và có thể phục hồi
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scopes.map((scope) => (
            <div
              key={scope.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 hover:border-orange-500/50 transition-all shadow-xs flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${scope.badgeColor}`}>
                      {scope.isDefault ? 'GLOBAL SCOPE GỐC' : 'SITE SCOPE'}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                      {scope.domain}
                    </span>
                  </div>

                  <a
                    href={`https://${scope.domain}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-slate-400 hover:text-orange-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <h4 className="text-base font-bold text-slate-900 dark:text-white mt-2.5 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  {scope.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {scope.description}
                </p>
              </div>

              {/* SCOPE METRICS */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-xs">
                <div>
                  <div className="text-[11px] text-slate-400">Phiên bản Live</div>
                  <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {scope.liveVersion}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400">Bản nháp (Draft)</div>
                  <div className="font-mono font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                    {scope.draftVersion || 'Không có'}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400">Số Ghi đè (Override)</div>
                  <div className="font-mono font-bold text-slate-700 dark:text-slate-200 mt-0.5">
                    {scope.overrideCount} trường
                  </div>
                </div>
              </div>

              {/* ACTION FOOTER */}
              <div className="flex items-center justify-between pt-1">
                <div className="text-[11px] text-slate-400">
                  Xuất bản gần nhất: {scope.lastPublished}
                </div>
                <button
                  onClick={() => {
                    onSelectScope(scope.id);
                    onGoToEditor(scope.id);
                  }}
                  className="px-3.5 py-1.5 bg-slate-900 dark:bg-slate-800 hover:bg-orange-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Chỉnh cấu hình Site</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LOWER SECTION: DRAFTS & VALIDATION ISSUES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* DRAFTS LIST */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Bản nháp cấu hình gần đây</span>
            </h4>
            <button
              onClick={onGoToDrafts}
              className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Xem tất cả</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-xs flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{draft.scopeName}</span>
                    <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono font-bold rounded-md">
                      {draft.versionNumber}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Tạo bởi <strong>{draft.createdBy}</strong> lúc {draft.createdAt} ({draft.changedCount} thay đổi)
                  </div>
                </div>

                <button
                  onClick={onGoToDrafts}
                  className="px-3 py-1 bg-white dark:bg-slate-700 hover:bg-orange-50 dark:hover:bg-orange-950/30 text-orange-600 dark:text-orange-400 font-bold rounded-lg border border-slate-200 dark:border-slate-600 cursor-pointer"
                >
                  Mở chỉnh sửa
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ACTIVE VALIDATION ISSUES */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              <span>Cảnh báo & Lỗi Cấu hình Cần xử lý</span>
            </h4>
            <button
              onClick={onGoToIssues}
              className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Chi tiết Lỗi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {issues.map((issue) => (
              <div
                key={issue.id}
                className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                  issue.severity === 'critical'
                    ? 'bg-red-50/60 dark:bg-red-950/20 border-red-200 dark:border-red-900/40 text-red-900 dark:text-red-300'
                    : 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">{issue.settingLabel}</span>
                  <span className="font-mono text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10">
                    {issue.code}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed">{issue.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
