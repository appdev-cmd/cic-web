import React, { useState } from 'react';
import {
  Globe,
  Search,
  Save,
  CheckCircle2,
  RotateCcw,
  Key,
  FileImage,
  GitCompare,
  Send,
  AlertTriangle,
  Info,
  ShieldAlert,
  Layers,
  Sparkles,
  ChevronRight,
  Eye,
  RefreshCw,
  HelpCircle,
  FileText,
  Sliders,
  Check,
} from 'lucide-react';
import {
  ConfigScope,
  ConfigGroupDef,
  ConfigItem,
  ConfigValueRecord,
  ConfigGroupId,
  ValidationIssue,
} from './types';

interface SettingsEditorTabProps {
  scopes: ConfigScope[];
  activeScopeId: ConfigScope['id'];
  onSelectScope: (scopeId: ConfigScope['id']) => void;
  groups: ConfigGroupDef[];
  items: ConfigItem[];
  valuesRecord: Record<string, ConfigValueRecord>;
  issues: ValidationIssue[];
  onUpdateDraftValue: (settingId: string, newValue: any) => void;
  onResetToInherited: (settingId: string) => void;
  onOverrideField: (settingId: string) => void;
  onOpenSecretModal: (item: ConfigItem) => void;
  onOpenAssetPicker: (title: string, type: 'image' | 'file', onSelect: (url: string) => void) => void;
  onOpenCompareModal: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
}

export const SettingsEditorTab: React.FC<SettingsEditorTabProps> = ({
  scopes,
  activeScopeId,
  onSelectScope,
  groups,
  items,
  valuesRecord,
  issues,
  onUpdateDraftValue,
  onResetToInherited,
  onOverrideField,
  onOpenSecretModal,
  onOpenAssetPicker,
  onOpenCompareModal,
  onSaveDraft,
  onPublish,
}) => {
  const [activeGroupId, setActiveGroupId] = useState<ConfigGroupId>('general');
  const [searchTerm, setSearchTerm] = useState('');
  const [resetConfirmId, setResetConfirmId] = useState<string | null>(null);

  const activeScope = scopes.find((s) => s.id === activeScopeId) || scopes[0];

  // Filter items by search or active group
  const filteredItems = items.filter((item) => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        item.label.toLowerCase().includes(q) ||
        item.path.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    }
    return item.groupId === activeGroupId;
  });

  // Calculate draft modified count for active scope
  const draftModifiedCount = Object.keys(valuesRecord).filter(
    (key) => valuesRecord[key]?.draftValue !== undefined
  ).length;

  const scopeIssues = issues.filter((i) => i.scopeId === activeScopeId);

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* SCOPE SELECTOR & ACTION HEADER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* LEFT: SCOPE SWITCHER */}
          <div className="flex min-w-0 items-start gap-3">
            <span className="p-3 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl shrink-0">
              <Globe className="w-6 h-6" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-xs text-slate-500 dark:text-slate-400">Phạm vi đang chỉnh sửa:</div>
              <div className="mt-1 flex min-w-0 flex-wrap items-center gap-2">
                <select
                  value={activeScopeId}
                  onChange={(e) => onSelectScope(e.target.value as any)}
                  className="min-w-0 max-w-full flex-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
                >
                  {scopes.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — {s.domain} {s.isDefault ? '[Mặc định]' : ''}
                    </option>
                  ))}
                </select>

                <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Đang dùng {activeScope.liveVersion}
                </span>

                {draftModifiedCount > 0 && (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse">
                    Bản nháp: {draftModifiedCount} thay đổi
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: STICKY ACTIONS */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onOpenCompareModal}
              disabled={draftModifiedCount === 0}
              className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
            >
              <GitCompare className="w-4 h-4 text-blue-500" />
              <span>So sánh thay đổi</span>
            </button>

            <button
              onClick={onSaveDraft}
              className="px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4 text-orange-400" />
              <span>Lưu bản nháp</span>
            </button>

            <button
              onClick={onPublish}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-md shadow-orange-600/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Xuất bản</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT: LEFT GROUP NAV + CENTRAL FORM + RIGHT CONTEXT DRAWER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT NAV: 9 GROUPS & SEARCH (3 COLS) */}
        <div className="lg:col-span-3 space-y-3 lg:sticky lg:top-20 lg:self-start">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 shadow-xs space-y-2">
            {/* SEARCH BOX */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Lọc từ khóa / path..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* GROUPS LIST */}
            <div className="space-y-1">
              {groups.map((group) => {
                const isActive = !searchTerm && activeGroupId === group.id;
                const itemCountInGroup = items.filter((i) => i.groupId === group.id).length;

                return (
                  <button
                    key={group.id}
                    onClick={() => {
                      setSearchTerm('');
                      setActiveGroupId(group.id);
                    }}
                    className={`w-full p-2.5 rounded-xl text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer border ${
                      isActive
                        ? 'bg-white dark:bg-slate-800 text-orange-600 dark:text-orange-400 font-bold border-orange-500/80 shadow-xs ring-2 ring-orange-500/10 border-l-4 border-l-orange-500'
                        : 'bg-transparent text-slate-700 dark:text-slate-300 border-transparent hover:bg-white dark:hover:bg-slate-800 hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-200 dark:hover:border-orange-900/50'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="truncate">{group.title}</div>
                    </div>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                        isActive
                          ? 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-900/40'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {itemCountInGroup}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* CENTRAL FORM EDITOR (6 COLS) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-6">
            {/* SECTION TITLE */}
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{groups.find((g) => g.id === activeGroupId)?.title}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {groups.find((g) => g.id === activeGroupId)?.description}
              </p>
            </div>

            {/* RENDER FIELD ITEMS */}
            {filteredItems.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                Không tìm thấy cấu hình nào khớp với từ khóa "{searchTerm}".
              </div>
            ) : (
              filteredItems.map((item) => {
                const rec = valuesRecord[item.id] || {
                  settingId: item.id,
                  scopeId: activeScopeId,
                  liveValue: '',
                  inheritanceState: activeScope.isDefault ? 'default' : 'inherited',
                  effectiveValue: '',
                  lastUpdatedBy: 'system',
                  lastUpdatedAt: 'N/A',
                };

                const isDraftModified = rec.draftValue !== undefined;
                const isOverridden = rec.inheritanceState === 'overridden';
                const isInherited = rec.inheritanceState === 'inherited';
                const isDefault = rec.inheritanceState === 'default';

                const displayValue = isDraftModified ? rec.draftValue : rec.effectiveValue;

                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border transition-all space-y-3 ${
                      isDraftModified
                        ? 'border-amber-400/80 bg-amber-50/20 dark:bg-amber-950/10'
                        : isOverridden
                        ? 'border-blue-300 dark:border-blue-900/60 bg-blue-50/10 dark:bg-blue-950/10'
                        : 'border-slate-200/80 dark:border-slate-800'
                    }`}
                  >
                    {/* FIELD HEADER BAR */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <label className="text-xs font-bold text-slate-900 dark:text-white">
                            {item.label}
                          </label>

                          {/* INHERITANCE TAG */}
                          {isDefault && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                              [Gốc Default]
                            </span>
                          )}
                          {isInherited && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                              [Kế thừa từ Global]
                            </span>
                          )}
                          {isOverridden && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                              [Ghi đè - Site Specific]
                            </span>
                          )}

                          {/* SENSITIVITY TAG */}
                          {item.sensitivity === 'secret' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 flex items-center gap-1">
                              <Key className="w-3 h-3" /> API Secret
                            </span>
                          )}
                          {item.sensitivity === 'sensitive' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                              Sensitive
                            </span>
                          )}
                          {item.isDeprecated && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-500 line-through">
                              Deprecated
                            </span>
                          )}
                        </div>

                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                          {item.path}
                        </div>
                      </div>

                      {/* INHERITANCE CONTROL BUTTONS */}
                      {!activeScope.isDefault && (
                        <div>
                          {isInherited && (
                            <button
                              type="button"
                              onClick={() => onOverrideField(item.id)}
                              className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-700 dark:text-blue-300 font-bold text-[11px] rounded-lg border border-blue-200 dark:border-blue-800 cursor-pointer transition-all"
                            >
                              + Ghi đè cho Site này
                            </button>
                          )}
                          {isOverridden && (
                            <div>
                              {resetConfirmId === item.id ? (
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      onResetToInherited(item.id);
                                      setResetConfirmId(null);
                                    }}
                                    className="px-2 py-0.5 bg-red-600 text-white font-bold text-[10px] rounded cursor-pointer"
                                  >
                                    Xác nhận Reset
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setResetConfirmId(null)}
                                    className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] rounded cursor-pointer"
                                  >
                                    Hủy
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setResetConfirmId(item.id)}
                                  className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 font-bold text-[11px] rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer transition-all flex items-center gap-1"
                                >
                                  <RotateCcw className="w-3 h-3" />
                                  <span>Reset về Kế thừa</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {item.description}
                    </p>

                    {item.usedBy && item.usedBy.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="font-bold">Hiển thị tại:</span>
                        {item.usedBy.map((place) => (
                          <span key={place} className="rounded-md bg-slate-100 px-2 py-0.5 font-semibold dark:bg-slate-800">{place}</span>
                        ))}
                      </div>
                    )}

                    {item.futureNote && (
                      <div className="rounded-lg border border-blue-200 bg-blue-50/70 p-2 text-[11px] text-blue-800 dark:border-blue-900/60 dark:bg-blue-950/20 dark:text-blue-300">
                        <span className="font-bold">Ghi chú triển khai:</span> {item.futureNote}
                      </div>
                    )}

                    {item.impactDescription && (
                      <div className="p-2 bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-lg text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                        <span>{item.impactDescription}</span>
                      </div>
                    )}

                    {/* INPUT FORM ELEMENTS DEPENDING ON TYPE */}
                    <div className="pt-1">
                      {item.type === 'text' && (
                        <input
                          type="text"
                          value={displayValue ?? ''}
                          disabled={isInherited}
                          onChange={(e) => onUpdateDraftValue(item.id, e.target.value)}
                          placeholder={item.placeholder}
                          className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 disabled:opacity-60"
                        />
                      )}

                      {item.type === 'textarea' && (
                        <textarea
                          rows={3}
                          value={displayValue ?? ''}
                          disabled={isInherited}
                          onChange={(e) => onUpdateDraftValue(item.id, e.target.value)}
                          placeholder={item.placeholder}
                          className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 font-mono disabled:opacity-60"
                        />
                      )}

                      {item.type === 'number' && (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={displayValue ?? 0}
                            disabled={isInherited}
                            onChange={(e) => onUpdateDraftValue(item.id, Number(e.target.value))}
                            className="w-48 px-3.5 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 disabled:opacity-60 font-mono font-bold"
                          />
                          {item.unit && (
                            <span className="text-xs font-bold text-slate-500">{item.unit}</span>
                          )}
                        </div>
                      )}

                      {item.type === 'boolean' && (
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(displayValue)}
                            disabled={isInherited}
                            onChange={(e) => onUpdateDraftValue(item.id, e.target.checked)}
                            className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500 cursor-pointer"
                          />
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {displayValue ? 'ĐANG BẬT (ACTIVE)' : 'ĐANG TẮT (DISABLED)'}
                          </span>
                        </label>
                      )}

                      {item.type === 'select' && item.options && (
                        <select
                          value={displayValue ?? ''}
                          disabled={isInherited}
                          onChange={(e) => onUpdateDraftValue(item.id, e.target.value)}
                          className="w-full sm:w-64 px-3.5 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 disabled:opacity-60 cursor-pointer"
                        >
                          {item.options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      )}

                      {/* SECRET FIELD */}
                      {item.type === 'secret' && (
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl font-mono text-xs font-bold text-slate-500 tracking-widest border border-slate-200 dark:border-slate-700">
                            ••••••••••••••••
                          </div>

                          {rec.isTestedOk && (
                            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Kiểm tra kết nối OK ({rec.testLastRun})
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => onOpenSecretModal(item)}
                            className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
                          >
                            <Key className="w-3.5 h-3.5" />
                            <span>Cập nhật / Xoay Khóa Secret</span>
                          </button>
                        </div>
                      )}

                      {/* IMAGE & FILE FIELD */}
                      {(item.type === 'image' || item.type === 'file') && (
                        <div className="flex items-center gap-3 flex-wrap">
                          {displayValue && item.type === 'image' && (
                            <img
                              src={displayValue}
                              alt="Asset preview"
                              className="w-16 h-12 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                            />
                          )}

                          <div className="flex-1 truncate font-mono text-xs text-slate-600 dark:text-slate-300">
                            {displayValue || '(Chưa chọn tài nguyên)'}
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              onOpenAssetPicker(item.label, item.type as any, (url) =>
                                onUpdateDraftValue(item.id, url)
                              )
                            }
                            disabled={isInherited}
                            className="px-3.5 py-1.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 font-bold text-xs rounded-xl border border-orange-500/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            <FileImage className="w-3.5 h-3.5" />
                            <span>Chọn từ Thư viện Media</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT CONTEXT DRAWER (3 COLS) */}
        <div className="lg:col-span-3 space-y-4 lg:sticky lg:top-20 lg:self-start">
          {/* SCOPE INHERITANCE SUMMARY */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
              <Layers className="w-4 h-4 text-orange-500" />
              <span>Cây Kế thừa Cấu hình</span>
            </h4>

            <div className="space-y-2">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                <div className="text-[10px] text-slate-400">Gốc Kế thừa (Global)</div>
                <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                  Global Default Scope
                </div>
              </div>

              {!activeScope.isDefault && (
                <div className="pl-4 border-l-2 border-orange-500 space-y-1">
                  <div className="p-2.5 bg-orange-500/10 text-orange-900 dark:text-orange-300 rounded-xl border border-orange-500/20">
                    <div className="text-[10px] text-orange-600 dark:text-orange-400 font-bold">
                      Scope Hiện tại ({activeScope.name})
                    </div>
                    <div className="text-[11px] mt-0.5">
                      Kế thừa <strong>{items.length - activeScope.overrideCount}</strong> giá trị; Ghi đè <strong>{activeScope.overrideCount}</strong> giá trị.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ACTIVE ISSUES FOR THIS SCOPE */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              <span>Cảnh báo Scope ({scopeIssues.length})</span>
            </h4>

            {scopeIssues.length === 0 ? (
              <div className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Không phát hiện lỗi cấu hình nào tại Scope này.</span>
              </div>
            ) : (
              scopeIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="p-2.5 bg-red-50/60 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-xl text-red-900 dark:text-red-300 space-y-1"
                >
                  <div className="font-bold">{issue.settingLabel}</div>
                  <div className="text-[11px]">{issue.message}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
