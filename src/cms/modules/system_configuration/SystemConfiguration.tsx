'use client';
/* eslint-disable @next/next/no-img-element -- settings accepts reviewed legacy/public media URLs */

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Globe,
  Save,
  Settings,
  Sliders,
  Table as TableIcon,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { BranchesSettingsEditor, type BranchSetting } from './BranchesSettingsEditor';
import { OverviewTab } from './OverviewTab';
import { SettingsEditorTab } from './SettingsEditorTab';
import { SettingsTableView } from './SettingsTableView';
import type { CmsSettingsData, CmsSettingsScopeId } from '@/features/system-settings/domain/model';
import { saveCmsSystemSettingsAction } from '@/features/system-settings/server/actions';

type Props = { websiteData: CmsSettingsData; capabilities: { edit: boolean } };

type TabId = 'overview' | 'editor' | 'table' | 'branches';

const EMPTY_VALUES: Record<string, string> = {};
const EMPTY_BRANCHES: BranchSetting[] = [];

export const SystemConfiguration = ({ websiteData, capabilities }: Props) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<TabId>('editor');
  const [scopeId, setScopeId] = useState<CmsSettingsScopeId>(
    websiteData.workspaces[0]?.scope.id ?? 'site_cic'
  );

  const [valuesByScope, setValuesByScope] = useState<Record<string, Record<string, string>>>(() =>
    Object.fromEntries(
      websiteData.workspaces.map((item) => [
        item.scope.id,
        Object.fromEntries(item.settings.map((setting) => [setting.key, setting.value])),
      ])
    )
  );

  const [branchesByScope, setBranchesByScope] = useState<Record<string, BranchSetting[]>>(() =>
    Object.fromEntries(
      websiteData.workspaces.map((item) => [
        item.scope.id,
        item.branches.map((branch) => ({ ...branch })),
      ])
    )
  );

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const workspace = websiteData.workspaces.find((item) => item.scope.id === scopeId) ?? websiteData.workspaces[0];
  const values = valuesByScope[scopeId] ?? EMPTY_VALUES;
  const branches = branchesByScope[scopeId] ?? EMPTY_BRANCHES;

  const changedKeys = useMemo(
    () => workspace?.settings.filter((item) => values[item.key] !== item.value).map((item) => item.key) ?? [],
    [values, workspace]
  );

  const branchesChanged = useMemo(
    () =>
      workspace?.scope.locale !== 'enjicad' &&
      JSON.stringify(branches) !== JSON.stringify(workspace?.branches ?? []),
    [branches, workspace]
  );

  const totalModifications = changedKeys.length + (branchesChanged ? 1 : 0);

  if (!workspace) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        Không có cấu hình được phép hiển thị.
      </div>
    );
  }

  const handleSave = () => {
    if ((!changedKeys.length && !branchesChanged) || pending || !capabilities.edit) return;
    setMessage(null);
    startTransition(async () => {
      try {
        await saveCmsSystemSettingsAction({
          changes: changedKeys.map((key) => ({ scopeId, key, value: values[key] ?? '' })),
          branches: branchesChanged ? { workspace: workspace.scope.locale, items: branches } : undefined,
        });
        setMessage({
          type: 'success',
          text: `Đã lưu thành công ${totalModifications} thay đổi vào PostgreSQL và cập nhật dữ liệu công khai.`,
        });
        router.refresh();
      } catch (error) {
        setMessage({
          type: 'error',
          text: error instanceof Error ? error.message : 'Không thể lưu cấu hình. Vui lòng kiểm tra dữ liệu và thử lại.',
        });
      }
    });
  };

  const handleReset = () => {
    setValuesByScope((current) => ({
      ...current,
      [scopeId]: Object.fromEntries(workspace.settings.map((s) => [s.key, s.value])),
    }));
    setBranchesByScope((current) => ({
      ...current,
      [scopeId]: workspace.branches.map((b) => ({ ...b })),
    }));
    setMessage(null);
  };

  const handleChangeValue = (key: string, val: string) => {
    setValuesByScope((current) => ({
      ...current,
      [scopeId]: {
        ...current[scopeId],
        [key]: val,
      },
    }));
  };

  return (
    <div className="space-y-6 pb-24 md:pb-6 animate-in fade-in duration-300" aria-busy={pending}>
      {/* MODULE HEADER BANNER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-2xl shadow-md shadow-orange-500/20 shrink-0">
            <Settings className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                MODULE 16 — CẤU HÌNH HỆ THỐNG
              </span>
              <span className="text-xs text-slate-400 font-mono">v2.5.0</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              Cấu hình Hệ thống & Phạm vi Site (System Settings)
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Hợp nhất cấu hình chung, thông tin liên hệ, logo thương hiệu, mạng xã hội và chi nhánh theo từng phân hệ. Lưu trực tiếp vào PostgreSQL.
            </p>
          </div>
        </div>
      </div>

      {/* FEEDBACK BANNER */}
      {message && (
        <div
          role="status"
          className={`rounded-2xl border p-4 text-sm font-semibold flex items-center justify-between gap-3 shadow-xs ${
            message.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200'
              : 'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setMessage(null)}
            className="text-xs font-bold underline cursor-pointer"
          >
            Đóng
          </button>
        </div>
      )}

      {/* TOP NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200 dark:border-slate-800 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`min-h-11 px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'overview'
              ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Overview Tổng quan</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('editor')}
          className={`min-h-11 px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'editor'
              ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Editor Theo Site/Scope</span>
          {changedKeys.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-amber-400 text-slate-950 font-bold">
              {changedKeys.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('table')}
          className={`min-h-11 px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'table'
              ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <TableIcon className="w-4 h-4" />
          <span>Bảng Cấu hình (Data Table)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('branches')}
          className={`min-h-11 px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'branches'
              ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Trụ sở & Chi nhánh</span>
          {branchesChanged && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-amber-400 text-slate-950 font-bold">
              1
            </span>
          )}
        </button>
      </div>

      {/* TAB CONTENT VIEWS */}
      {activeTab === 'overview' && (
        <OverviewTab
          websiteData={websiteData}
          activeScopeId={scopeId}
          onSelectScope={setScopeId}
          onGoToEditor={(sId) => {
            setScopeId(sId);
            setActiveTab('editor');
          }}
          onGoToBranches={() => setActiveTab('branches')}
          onGoToTable={() => setActiveTab('table')}
        />
      )}

      {activeTab === 'editor' && (
        <SettingsEditorTab
          workspace={workspace}
          allWorkspaces={websiteData.workspaces}
          values={values}
          activeScopeId={scopeId}
          onSelectScope={setScopeId}
          onChangeValue={handleChangeValue}
          onSave={handleSave}
          onReset={handleReset}
          changedKeys={changedKeys}
          pending={pending}
          capabilities={capabilities}
          onGoToBranches={() => setActiveTab('branches')}
        />
      )}

      {activeTab === 'table' && (
        <SettingsTableView
          websiteData={websiteData}
          valuesByScope={valuesByScope}
          onLocateInEditor={(sId) => {
            setScopeId(sId);
            setActiveTab('editor');
          }}
        />
      )}

      {activeTab === 'branches' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-orange-500" />
                <span>Trụ sở chính & Chi nhánh ({workspace.scope.name})</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Dữ liệu địa điểm văn phòng có cấu trúc cho Trang Liên hệ và Chân trang Footer.
              </p>
            </div>

            {/* SCOPE SELECTOR FOR BRANCHES */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Phạm vi:</span>
              <select
                value={scopeId}
                onChange={(e) => setScopeId(e.target.value as CmsSettingsScopeId)}
                className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
              >
                {websiteData.workspaces
                  .filter((w) => w.scope.locale !== 'enjicad')
                  .map((w) => (
                    <option key={w.scope.id} value={w.scope.id}>
                      {w.scope.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
            {workspace.scope.locale === 'enjicad' ? (
              <div className="p-8 text-center text-xs text-slate-400">
                Phân hệ enjiCAD sử dụng thông tin trụ sở kế thừa từ Tiếng Việt (VI). Vui lòng chuyển sang Scope Tiếng Việt để chỉnh sửa.
              </div>
            ) : (
              <BranchesSettingsEditor
                value={branches}
                disabled={!capabilities.edit || pending}
                onChange={(next) =>
                  setBranchesByScope((current) => ({
                    ...current,
                    [scopeId]: next,
                  }))
                }
              />
            )}
          </div>
        </div>
      )}

      {/* MOBILE / TABLET FLOATING STICKY BOTTOM ACTION BAR */}
      {totalModifications > 0 && (
        <aside
          aria-label="Thanh tác vụ lưu thay đổi"
          className="fixed bottom-4 inset-x-4 z-50 rounded-2xl bg-slate-900/95 text-white p-3.5 shadow-2xl backdrop-blur-md flex items-center justify-between border border-slate-800 animate-in slide-in-from-bottom-5 duration-300"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
            </span>
            <div>
              <div className="text-xs font-bold">
                {totalModifications} thay đổi chưa lưu
              </div>
              <div className="text-[11px] text-slate-400 hidden sm:block">
                Lưu trực tiếp vào PostgreSQL cho Scope {workspace.scope.name}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              disabled={pending}
              className="min-h-11 px-3.5 py-2 text-xs font-bold text-slate-300 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
            >
              Hủy
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={!capabilities.edit || pending}
              className="min-h-11 px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-orange-600/30 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {pending ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{pending ? 'Đang lưu...' : 'Lưu trực tiếp'}</span>
            </button>
          </div>
        </aside>
      )}
    </div>
  );
};

