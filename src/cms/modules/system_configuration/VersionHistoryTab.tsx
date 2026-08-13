import React, { useState } from 'react';
import {
  History,
  RotateCcw,
  CheckCircle2,
  GitCommit,
  Globe,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ConfigVersionHistory, ConfigScope } from './types';

interface VersionHistoryTabProps {
  versions: ConfigVersionHistory[];
  scopes: ConfigScope[];
  onRestoreAsNewDraft: (version: ConfigVersionHistory) => void;
}

export const VersionHistoryTab: React.FC<VersionHistoryTabProps> = ({
  versions,
  scopes,
  onRestoreAsNewDraft,
}) => {
  const [selectedScopeId, setSelectedScopeId] = useState<string>('site_cic');

  const filteredVersions = versions.filter((v) => v.scopeId === selectedScopeId);

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* HEADER BAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-5 h-5 text-orange-500" />
            <span>Lịch sử Phiên bản & Khôi phục Cấu hình (Version History & Rollback)</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Mọi đợt xuất bản thành công được lưu vết vĩnh viễn. Hành động "Phục hồi" sẽ tự động tạo một <strong>Bản nháp Mới (New Draft)</strong> để kiểm tra lại trước khi áp dụng.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 text-xs">
          <span className="font-bold text-slate-500">Scope:</span>
          <select
            value={selectedScopeId}
            onChange={(e) => setSelectedScopeId(e.target.value)}
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
          >
            {scopes.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.domain})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TIMELINE OF VERSIONS */}
      <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 space-y-6 pt-2">
        {filteredVersions.length === 0 ? (
          <div className="pl-6 text-xs text-slate-400">
            Chưa tìm thấy lịch sử phiên bản nào thuộc Scope này.
          </div>
        ) : (
          filteredVersions.map((ver) => (
            <div key={ver.id} className="relative pl-6 space-y-3 group">
              {/* TIMELINE DOT */}
              <div
                className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 bg-white dark:bg-slate-900 ${
                  ver.status === 'active_live'
                    ? 'border-emerald-500 ring-4 ring-emerald-500/20'
                    : 'border-slate-400'
                }`}
              />

              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-base font-bold text-slate-900 dark:text-white">
                      {ver.versionNumber}
                    </span>
                    {ver.status === 'active_live' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Đang phát hành (ACTIVE LIVE)
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500">
                        Phiên bản cũ (Archived)
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-400">
                    Phát hành vào lúc {ver.publishedAt} bởi <strong>{ver.publishedBy}</strong>
                  </div>
                </div>

                <div className="text-xs text-slate-800 dark:text-slate-200">
                  <strong>Ghi chú phát hành:</strong> {ver.releaseNotes}
                </div>

                {/* CHANGES TABLE */}
                <div className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
                  <table className="cms-data-table text-left">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold text-[11px]">
                        <th className="py-2 px-3">Tên cài đặt</th>
                        <th className="py-2 px-3">Giá trị Trước</th>
                        <th className="py-2 px-3 text-emerald-600">Giá trị Cấu hình</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {ver.changes.map((ch, idx) => (
                        <tr key={idx}>
                          <td className="py-2 px-3 font-bold text-slate-800 dark:text-slate-200">
                            {ch.settingLabel}
                          </td>
                          <td className="py-2 px-3 font-mono text-slate-400">
                            {String(ch.oldValue)}
                          </td>
                          <td className="py-2 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {String(ch.newValue)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* RESTORE ACTION */}
                {ver.status !== 'active_live' && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => onRestoreAsNewDraft(ver)}
                      className="px-3.5 py-1.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 font-bold text-xs rounded-xl border border-orange-500/20 flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Phục hồi thành Bản nháp Mới (Restore to New Draft)</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
