/* eslint-disable @next/next/no-img-element -- media previews */
import React, { useState } from 'react';
import {
  Globe,
  Search,
  Save,
  CheckCircle2,
  FileImage,
  Layers,
  Sparkles,
  Eye,
  Info,
  Building2,
  ExternalLink,
  ShieldCheck,
  LockKeyhole,
} from 'lucide-react';
import type {
  CmsSettingsData,
  CmsSettingsScopeId,
  CmsSettingsWorkspace,
} from '@/features/system-settings/domain/model';
import { PageMediaPickerModal } from '../static_pages/PageMediaPickerModal';

export const GROUPS = [
  { id: 'identity', title: 'Nhận diện chung', description: 'Tên hiển thị và tên miền định tuyến của hệ thống.' },
  { id: 'contact', title: 'Thông tin liên hệ', description: 'Tên admin, email nhận thư, hotline và số điện thoại hỗ trợ.' },
  { id: 'branding', title: 'Thương hiệu', description: 'Logo màu và logo trắng phục vụ header/footer giao diện.' },
  { id: 'social', title: 'Mạng xã hội', description: 'Liên kết mạng xã hội chính thức: Facebook, X/Twitter, YouTube.' },
  { id: 'support', title: 'Hỗ trợ kỹ thuật', description: 'Đường dẫn công cụ hỗ trợ trực tuyến từ xa (TeamViewer, v.v.).' },
  { id: 'measurement', title: 'Đo lường & Phân tích', description: 'Mã theo dõi Google Analytics (GA4 / G-XXXXX).' },
] as const;

interface SettingsEditorTabProps {
  workspace: CmsSettingsWorkspace;
  allWorkspaces: readonly CmsSettingsWorkspace[];
  values: Record<string, string>;
  activeScopeId: CmsSettingsScopeId;
  onSelectScope: (scopeId: CmsSettingsScopeId) => void;
  onChangeValue: (key: string, value: string) => void;
  onSave: () => void;
  onReset: () => void;
  changedKeys: string[];
  pending: boolean;
  capabilities: { edit: boolean };
  onGoToBranches?: () => void;
}

export const SettingsEditorTab: React.FC<SettingsEditorTabProps> = ({
  workspace,
  allWorkspaces,
  values,
  activeScopeId,
  onSelectScope,
  onChangeValue,
  onSave,
  onReset,
  changedKeys,
  pending,
  capabilities,
  onGoToBranches,
}) => {
  const [activeGroupId, setActiveGroupId] = useState<string>('identity');
  const [searchTerm, setSearchTerm] = useState('');
  const [mediaPickerKey, setMediaPickerKey] = useState<string | null>(null);

  // Filter items by search or active group
  const filteredItems = workspace.settings.filter((item) => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        item.label.toLowerCase().includes(q) ||
        item.key.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    }
    return item.group === activeGroupId;
  });

  const activeGroupDef = GROUPS.find((g) => g.id === activeGroupId) || GROUPS[0];

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
              <div className="text-xs text-slate-500 dark:text-slate-400">Phạm vi đang chỉnh sửa (Scope):</div>
              <div className="mt-1 flex min-w-0 flex-wrap items-center gap-2">
                <select
                  value={activeScopeId}
                  onChange={(e) => onSelectScope(e.target.value as CmsSettingsScopeId)}
                  className="min-w-0 max-w-full px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
                >
                  {allWorkspaces.map((ws) => (
                    <option key={ws.scope.id} value={ws.scope.id}>
                      {ws.scope.name} — {ws.scope.domain}
                    </option>
                  ))}
                </select>

                <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  LIVE (PostgreSQL)
                </span>

                {changedKeys.length > 0 && (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 animate-pulse">
                    {changedKeys.length} thay đổi chưa lưu
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: DESKTOP STICKY ACTIONS */}
          <div className="flex items-center gap-2 flex-wrap">
            {changedKeys.length > 0 && (
              <button
                type="button"
                onClick={onReset}
                disabled={pending}
                className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 transition cursor-pointer disabled:opacity-50"
              >
                Hủy thay đổi
              </button>
            )}

            <button
              type="button"
              onClick={onSave}
              disabled={!capabilities.edit || pending || changedKeys.length === 0}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-md shadow-orange-600/20 flex items-center gap-2 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pending ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>
                {pending ? 'Đang lưu...' : `Lưu trực tiếp${changedKeys.length > 0 ? ` (${changedKeys.length})` : ''}`}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT: LEFT GROUP NAV + CENTRAL FORM + RIGHT CONTEXT DRAWER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT NAV: GROUPS & SEARCH (3 COLS) */}
        <div className="lg:col-span-3 space-y-3 lg:sticky lg:top-20 lg:self-start">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 shadow-xs space-y-2">
            {/* SEARCH BOX */}
            <div className="relative flex items-center">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="w-4 h-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Lọc cài đặt / key..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* GROUPS LIST */}
            <div className="space-y-1">
              {GROUPS.map((group) => {
                const isActive = !searchTerm && activeGroupId === group.id;
                const itemCountInGroup = workspace.settings.filter((i) => i.group === group.id).length;
                const changedCountInGroup = workspace.settings.filter(
                  (i) => i.group === group.id && changedKeys.includes(i.key)
                ).length;

                return (
                  <button
                    key={group.id}
                    type="button"
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
                    <div className="flex items-center gap-1">
                      {changedCountInGroup > 0 && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500 text-white">
                          +{changedCountInGroup}
                        </span>
                      )}
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                          isActive
                            ? 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-900/40'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {itemCountInGroup}
                      </span>
                    </div>
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
                <span>{activeGroupDef.title}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {activeGroupDef.description}
              </p>
            </div>

            {/* RENDER FIELD ITEMS */}
            {filteredItems.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                Không tìm thấy cấu hình nào khớp với từ khóa "{searchTerm}".
              </div>
            ) : (
              filteredItems.map((item) => {
                const currentValue = values[item.key] ?? item.value;
                const isModified = changedKeys.includes(item.key);

                return (
                  <div
                    key={item.key}
                    className={`p-4 rounded-xl border transition-all space-y-3 ${
                      isModified
                        ? 'border-amber-400/80 bg-amber-50/20 dark:bg-amber-950/10'
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
                          {isModified && (
                            <span className="rounded px-2 py-0.5 text-[10px] font-bold border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
                              Chưa lưu
                            </span>
                          )}
                          {item.publicReadable && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1" title="Dữ liệu được dùng trên website công khai">
                              <Eye className="w-3 h-3" /> Website Public
                            </span>
                          )}
                        </div>

                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                          {item.key}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {item.description}
                    </p>

                    {/* INPUT FORM ELEMENTS DEPENDING ON TYPE */}
                    <div className="pt-1">
                      {item.type === 'image' ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            {currentValue ? (
                              <img
                                src={currentValue}
                                alt={item.label}
                                className="h-12 max-w-28 object-contain rounded-lg border border-slate-200 dark:border-slate-700 p-1 bg-white"
                              />
                            ) : null}

                            <input
                              type="text"
                              value={currentValue ?? ''}
                              disabled={!capabilities.edit || pending}
                              onChange={(e) => onChangeValue(item.key, e.target.value)}
                              placeholder="Nhập link ảnh hoặc chọn từ Thư viện Media..."
                              className="flex-1 min-h-10 px-3.5 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 disabled:opacity-60 font-mono"
                            />

                            <button
                              type="button"
                              onClick={() => setMediaPickerKey(item.key)}
                              disabled={!capabilities.edit || pending}
                              className="px-3 py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 font-bold text-xs rounded-xl border border-orange-500/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                            >
                              <FileImage className="w-4 h-4" />
                              <span className="hidden sm:inline">Chọn Media</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <input
                          type={item.type === 'email' ? 'email' : item.type === 'url' ? 'url' : 'text'}
                          value={currentValue ?? ''}
                          maxLength={item.maxLength}
                          disabled={!capabilities.edit || pending}
                          onChange={(e) => onChangeValue(item.key, e.target.value)}
                          placeholder={`Nhập ${item.label.toLowerCase()}...`}
                          className="w-full min-h-10 px-3.5 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 disabled:opacity-60"
                        />
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
          {/* SCOPE INFO */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3 text-xs">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <Globe className="w-4 h-4 text-orange-500" />
              <span>{workspace.scope.name}</span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Dữ liệu của Scope này được lưu vào bảng PostgreSQL tương ứng (
              <code className="text-[11px] text-orange-600 font-mono">
                {workspace.scope.locale === 'vi'
                  ? 'cic_config'
                  : workspace.scope.locale === 'en'
                  ? 'cic_config_en'
                  : 'cic_config_enjicad'}
              </code>
              ).
            </p>
            <a
              href={workspace.scope.domain.startsWith('http') ? workspace.scope.domain : `https://${workspace.scope.domain}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-orange-600 hover:underline"
            >
              <span>{workspace.scope.domain}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* BRANCHES QUICK SHORTCUT */}
          {workspace.scope.locale !== 'enjicad' && onGoToBranches && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <Building2 className="w-4 h-4 text-orange-500" />
                <span>Trụ sở & Chi nhánh</span>
              </div>
              <p className="text-slate-500 leading-relaxed">
                Quản lý các địa điểm văn phòng, hotline, email và bản đồ Google Maps nhúng.
              </p>
              <button
                type="button"
                onClick={onGoToBranches}
                className="w-full mt-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl border border-slate-200 dark:border-slate-700 transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Mở tab Chi nhánh ({workspace.branches.length})</span>
              </button>
            </div>
          )}

          {/* SECURITY NOTE */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <LockKeyhole className="w-4 h-4 text-slate-500" />
              <span>Thông tin nhạy cảm</span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              API key, secret tokens, mật khẩu và SMTP credentials chỉ được cấu hình an toàn qua file biến môi trường <code>.env</code> phía máy chủ.
            </p>
          </div>
        </div>
      </div>

      {/* MEDIA PICKER MODAL */}
      {mediaPickerKey && (
        <PageMediaPickerModal
          currentId={values[mediaPickerKey] ?? ''}
          returnValue="url"
          locale={workspace.scope.locale === 'en' ? 'en' : 'vi'}
          onClose={() => setMediaPickerKey(null)}
          onConfirm={(selectedUrl) => {
            onChangeValue(mediaPickerKey, selectedUrl);
            setMediaPickerKey(null);
          }}
        />
      )}
    </div>
  );
};
