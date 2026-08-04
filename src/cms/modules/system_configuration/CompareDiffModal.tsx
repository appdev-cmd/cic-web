import React from 'react';
import { X, ArrowRight, CheckCircle2, ShieldAlert, GitCompare, RefreshCw } from 'lucide-react';
import { ConfigItem, ConfigScope, ConfigValueRecord } from './types';

interface CompareDiffModalProps {
  isOpen: boolean;
  onClose: () => void;
  scope: ConfigScope;
  configItems: ConfigItem[];
  valuesMap: Record<string, ConfigValueRecord>; // current values for this scope
  draftChanges?: {
    settingId: string;
    label: string;
    changeType: string;
    oldValue: any;
    newValue: any;
  }[];
}

export const CompareDiffModal: React.FC<CompareDiffModalProps> = ({
  isOpen,
  onClose,
  scope,
  configItems,
  valuesMap,
  draftChanges,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* MODAL HEADER */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl">
              <GitCompare className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>So sánh Khác biệt: Bản nháp (Draft) vs Đang phát hành (Live)</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Phạm vi Scope: <strong className="text-slate-800 dark:text-slate-200">{scope.name}</strong> ({scope.domain})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENT DIFF BODY */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="flex items-center justify-between p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-xl text-xs text-blue-800 dark:text-blue-300">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-blue-600" />
              <span>
                Tìm thấy <strong>{draftChanges ? draftChanges.length : Object.keys(valuesMap).filter((k) => valuesMap[k].draftValue !== undefined).length}</strong> trường thay đổi giữa Bản nháp và Bản Live.
              </span>
            </div>
            <span className="font-mono font-bold">{scope.liveVersion} → {scope.draftVersion || 'Draft'}</span>
          </div>

          {/* TABLE OF DIFFS */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold text-[11px]">
                  <th className="py-2.5 px-3.5 w-1/3">Trường Cấu hình</th>
                  <th className="py-2.5 px-3.5 w-1/3 bg-red-50/50 dark:bg-red-950/20 text-red-700 dark:text-red-300">
                    Giá trị Hiện tại (Live)
                  </th>
                  <th className="py-2.5 px-3.5 w-1/3 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300">
                    Giá trị Bản nháp (Draft)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                {draftChanges ? (
                  draftChanges.map((change, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3.5 font-sans">
                        <div className="font-bold text-slate-900 dark:text-white">{change.label}</div>
                        <div className="text-[10px] text-slate-400">{change.settingId}</div>
                      </td>
                      <td className="py-3 px-3.5 bg-red-50/30 dark:bg-red-950/10 text-red-700 dark:text-red-300 break-all font-semibold">
                        {String(change.oldValue ?? '(Trống / Mặc định)')}
                      </td>
                      <td className="py-3 px-3.5 bg-emerald-50/30 dark:bg-emerald-950/10 text-emerald-700 dark:text-emerald-300 break-all font-bold">
                        {String(change.newValue)}
                      </td>
                    </tr>
                  ))
                ) : (
                  Object.keys(valuesMap)
                    .filter((k) => valuesMap[k].draftValue !== undefined)
                    .map((settingId) => {
                      const rec = valuesMap[settingId];
                      const itemDef = configItems.find((i) => i.id === settingId);
                      const isSecret = itemDef?.sensitivity === 'secret';

                      return (
                        <tr key={settingId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-3.5 font-sans">
                            <div className="font-bold text-slate-900 dark:text-white">{itemDef?.label || settingId}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{itemDef?.path || settingId}</div>
                          </td>
                          <td className="py-3 px-3.5 bg-red-50/30 dark:bg-red-950/10 text-red-700 dark:text-red-300 break-all">
                            {isSecret ? '••••••••••••••••' : String(rec.liveValue ?? '(Inherited)')}
                          </td>
                          <td className="py-3 px-3.5 bg-emerald-50/30 dark:bg-emerald-950/10 text-emerald-700 dark:text-emerald-300 break-all font-bold">
                            {isSecret ? '•••••••••••••••• (Đã cập nhật khóa bí mật)' : String(rec.draftValue)}
                          </td>
                        </tr>
                      );
                    })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 text-xs">
          <span className="text-slate-500">
            * Mọi secret đều được che khuất tự động nhằm đảm bảo an toàn bảo mật thông tin.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold rounded-xl cursor-pointer"
          >
            Đóng bảng so sánh
          </button>
        </div>
      </div>
    </div>
  );
};
