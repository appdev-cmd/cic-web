import React from 'react';
import {
  AlertTriangle,
  Shield,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sliders,
  Filter,
  Check,
} from 'lucide-react';
import { PolicyIssue, CmsRole } from './types';

interface PolicyIssuesTabProps {
  issues: PolicyIssue[];
  roles: CmsRole[];
  onOpenEditRole: (role: CmsRole) => void;
  onResolveIssue: (issueId: string) => void;
}

export const PolicyIssuesTab: React.FC<PolicyIssuesTabProps> = ({
  issues,
  roles,
  onOpenEditRole,
  onResolveIssue,
}) => {
  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-600 text-white rounded-xl shadow-md">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Cảnh báo An toàn Phân quyền & SoD ({issues.length} Phát hiện)
            </h3>
            <p className="text-xs text-slate-500">
              Tự động quét các vi phạm Tách biệt Trách nhiệm (Separation of Duties), Quyền quá rộng (Overbroad Scope) và Quá hạn rà soát.
            </p>
          </div>
        </div>
      </div>

      {/* ISSUES LIST */}
      <div className="space-y-3">
        {issues.length === 0 ? (
          <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-center text-slate-400">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="font-bold text-slate-700 dark:text-slate-200">Không có vi phạm an toàn phân quyền nào được ghi nhận!</p>
          </div>
        ) : (
          issues.map((iss) => {
            const matchedRole = roles.find((r) => r.id === iss.roleId);

            return (
              <div
                key={iss.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-3 hover:border-slate-300 transition-colors"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        iss.severity === 'high'
                          ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200 border border-red-300'
                          : iss.severity === 'medium'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200 border border-amber-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200 border border-blue-300'
                      }`}
                    >
                      {iss.severity} SEVERITY
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{iss.title}</span>
                  </div>

                  <div className="text-[11px] font-mono text-slate-400">
                    Phát hiện lúc: {iss.detectedAt}
                  </div>
                </div>

                {/* Body Details */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                  <div className="md:col-span-8 space-y-2">
                    <div>
                      <span className="font-bold text-slate-700 dark:text-slate-300">Vai trò ảnh hưởng: </span>
                      <span className="font-bold text-orange-600 dark:text-orange-400">{iss.roleName}</span>
                    </div>

                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{iss.description}</p>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                      <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-[11px]">
                        <Shield className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Khuyến nghị Xử lý Security:</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-[11px]">{iss.recommendation}</p>
                    </div>
                  </div>

                  {/* Action Column */}
                  <div className="md:col-span-4 flex flex-col justify-end gap-2 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-3 md:pt-0 md:pl-4">
                    {matchedRole && (
                      <button
                        onClick={() => onOpenEditRole(matchedRole)}
                        className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <Sliders className="w-4 h-4" />
                        <span>Điều chỉnh Ma trận Quyền</span>
                      </button>
                    )}

                    <button
                      onClick={() => onResolveIssue(iss.id)}
                      className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-300 hover:text-emerald-600 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Đánh dấu Đã xử lý / Bỏ qua</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
