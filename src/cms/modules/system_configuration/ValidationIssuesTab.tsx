import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle2,
  ArrowUpRight,
  RefreshCw,
  Globe,
  Filter,
} from 'lucide-react';
import { ValidationIssue, ConfigScope } from './types';

interface ValidationIssuesTabProps {
  scopes: ConfigScope[];
  issues: ValidationIssue[];
  onFixIssue: (issue: ValidationIssue) => void;
  onRunRevalidation: () => void;
}

export const ValidationIssuesTab: React.FC<ValidationIssuesTabProps> = ({
  scopes,
  issues,
  onFixIssue,
  onRunRevalidation,
}) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [isValidating, setIsValidating] = useState(false);

  const filteredIssues = issues.filter(
    (i) => selectedSeverity === 'all' || i.severity === selectedSeverity
  );

  const handleRunTest = () => {
    setIsValidating(true);
    setTimeout(() => {
      setIsValidating(false);
      onRunRevalidation();
    }, 1000);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* HEADER BAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            <span>Trung tâm Kiểm tra & Cảnh báo Lỗi Cấu hình (Validation Issues)</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tự động kiểm tra tính sẵn sàng của SMTP Mail, API Keys, Liên kết hỏng, và Tham số lỗi thời
          </p>
        </div>

        <button
          onClick={handleRunTest}
          disabled={isValidating}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-md shadow-orange-600/20 flex items-center gap-2 cursor-pointer transition-all shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${isValidating ? 'animate-spin' : ''}`} />
          <span>{isValidating ? 'Đang chạy quét hệ thống...' : 'Quét lại Cấu hình (Re-validate All)'}</span>
        </button>
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-2 text-xs">
        <span className="font-bold text-slate-500 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Lọc mức độ:
        </span>
        <button
          onClick={() => setSelectedSeverity('all')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            selectedSeverity === 'all'
              ? 'bg-slate-900 dark:bg-slate-800 text-white'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Tất cả ({issues.length})
        </button>

        <button
          onClick={() => setSelectedSeverity('critical')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            selectedSeverity === 'critical'
              ? 'bg-red-600 text-white'
              : 'bg-white dark:bg-slate-900 text-red-600 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Critical Lỗi ({issues.filter((i) => i.severity === 'critical').length})
        </button>

        <button
          onClick={() => setSelectedSeverity('warning')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            selectedSeverity === 'warning'
              ? 'bg-amber-600 text-white'
              : 'bg-white dark:bg-slate-900 text-amber-600 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Warning Cảnh báo ({issues.filter((i) => i.severity === 'warning').length})
        </button>
      </div>

      {/* ISSUES LIST */}
      <div className="space-y-3">
        {filteredIssues.length === 0 ? (
          <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              Tuyệt vời! Không phát hiện lỗi cấu hình nào.
            </h4>
            <p className="text-xs text-slate-500">
              Mọi kết nối SMTP, Gemini API Key và tham số phụ thuộc đều hoạt động hoàn hảo.
            </p>
          </div>
        ) : (
          filteredIssues.map((issue) => {
            const scope = scopes.find((s) => s.id === issue.scopeId);

            return (
              <div
                key={issue.id}
                className={`p-5 rounded-2xl border transition-all space-y-3 bg-white dark:bg-slate-900 shadow-xs ${
                  issue.severity === 'critical'
                    ? 'border-red-300 dark:border-red-900/60'
                    : 'border-amber-300 dark:border-amber-900/60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-md font-mono text-[10px] font-bold uppercase tracking-wider ${
                        issue.severity === 'critical'
                          ? 'bg-red-500/10 text-red-600 border border-red-500/20'
                          : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                      }`}
                    >
                      {issue.severity}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-500">
                      [{issue.code}]
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {issue.settingLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      Scope: {scope?.name || issue.scopeId}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                  <strong>Mô tả sự cố:</strong> {issue.message}
                </p>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3">
                  <div>
                    <strong className="text-slate-900 dark:text-white">Gợi ý khắc phục:</strong>{' '}
                    {issue.recommendation}
                  </div>

                  <button
                    onClick={() => onFixIssue(issue)}
                    className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 shrink-0 cursor-pointer transition-all"
                  >
                    <span>Sửa trong Editor</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
