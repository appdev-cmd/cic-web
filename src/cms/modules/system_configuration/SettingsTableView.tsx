import React, { useState } from 'react';
import {
  Search,
  Filter,
  Key,
  Globe,
  CornerDownRight,
  SlidersHorizontal,
  ExternalLink,
  ShieldAlert,
  ArrowUpRight,
  Layers,
} from 'lucide-react';
import {
  ConfigScope,
  ConfigGroupDef,
  ConfigItem,
  ConfigValueRecord,
  SensitivityLevel,
} from './types';

interface SettingsTableViewProps {
  scopes: ConfigScope[];
  groups: ConfigGroupDef[];
  items: ConfigItem[];
  valuesRecordMap: Record<string, Record<string, ConfigValueRecord>>;
  onLocateInEditor: (scopeId: ConfigScope['id'], groupId: ConfigGroupDef['id'], settingId: string) => void;
}

export const SettingsTableView: React.FC<SettingsTableViewProps> = ({
  scopes,
  groups,
  items,
  valuesRecordMap,
  onLocateInEditor,
}) => {
  const [selectedScopeId, setSelectedScopeId] = useState<string>('site_cic');
  const [selectedGroupId, setSelectedGroupId] = useState<string>('all');
  const [selectedSensitivity, setSelectedSensitivity] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const currentValues = valuesRecordMap[selectedScopeId] || {};

  const filteredItems = items.filter((item) => {
    if (selectedGroupId !== 'all' && item.groupId !== selectedGroupId) return false;
    if (selectedSensitivity !== 'all' && item.sensitivity !== selectedSensitivity) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        item.label.toLowerCase().includes(q) ||
        item.path.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* FILTER BAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          {/* SEARCH */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo Tên cài đặt, Path hệ thống hoặc Mô tả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* SCOPE SELECTOR */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-bold text-slate-500">Scope:</span>
            <select
              value={selectedScopeId}
              onChange={(e) => setSelectedScopeId(e.target.value)}
              className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              {scopes.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.domain})
                </option>
              ))}
            </select>
          </div>

          {/* GROUP SELECTOR */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-bold text-slate-500">Nhóm:</span>
            <select
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="all">Tất cả Nhóm Cấu hình (9 Nhóm)</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.title}
                </option>
              ))}
            </select>
          </div>

          {/* SENSITIVITY */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-bold text-slate-500">Mức độ:</span>
            <select
              value={selectedSensitivity}
              onChange={(e) => setSelectedSensitivity(e.target.value)}
              className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="all">Tất cả Mức bảo mật</option>
              <option value="standard">Standard</option>
              <option value="sensitive">Sensitive</option>
              <option value="secret">Secret (API Keys)</option>
            </select>
          </div>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="cms-data-table text-left">
            <thead>
              <tr className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-800">
                <th className="py-3 px-4">Tên Cấu hình & Path</th>
                <th className="py-3 px-4">Nhóm Cấu hình</th>
                <th className="py-3 px-4">Trạng thái Kế thừa</th>
                <th className="py-3 px-4">Bảo mật</th>
                <th className="py-3 px-4">Giá trị Hiện tại (Effective Value)</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredItems.map((item) => {
                const rec = currentValues[item.id] || {
                  settingId: item.id,
                  scopeId: selectedScopeId,
                  liveValue: '',
                  inheritanceState: selectedScopeId === 'global' ? 'default' : 'inherited',
                  effectiveValue: '',
                  lastUpdatedBy: 'system',
                  lastUpdatedAt: 'N/A',
                };

                const groupDef = groups.find((g) => g.id === item.groupId);
                const isDraftModified = rec.draftValue !== undefined;
                const isOverridden = rec.inheritanceState === 'overridden';
                const isInherited = rec.inheritanceState === 'inherited';
                const isDefault = rec.inheritanceState === 'default';

                return (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>{item.label}</span>
                        {item.isDeprecated && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-red-500/10 text-red-500 line-through">
                            Deprecated
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-[10px] text-slate-400 mt-0.5">{item.path}</div>
                    </td>

                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">
                      {groupDef?.title || item.groupId}
                    </td>

                    <td className="py-3 px-4 font-bold">
                      {isDefault && (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          [Default]
                        </span>
                      )}
                      {isInherited && (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                          [Kế thừa Global]
                        </span>
                      )}
                      {isOverridden && (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                          [Ghi đè Site]
                        </span>
                      )}
                      {isDraftModified && (
                        <span className="ml-1.5 px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-600 font-mono">
                          [Có Nháp]
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      {item.sensitivity === 'secret' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-600 dark:text-red-400 flex items-center gap-1 w-fit">
                          <Key className="w-3 h-3" /> Secret
                        </span>
                      ) : item.sensitivity === 'sensitive' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 w-fit">
                          Sensitive
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Standard</span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono break-all max-w-xs text-slate-700 dark:text-slate-200">
                      {item.sensitivity === 'secret'
                        ? '••••••••••••••••'
                        : String(rec.effectiveValue ?? '(Trống)')}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onLocateInEditor(selectedScopeId as any, item.groupId, item.id)}
                        className="px-3 py-1.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 font-bold rounded-xl border border-orange-500/20 flex items-center gap-1.5 ml-auto cursor-pointer transition-all shrink-0"
                      >
                        <span>Đến Editor</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
