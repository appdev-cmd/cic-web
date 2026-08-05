import React, { useEffect, useMemo, useState } from 'react';
import {
  Settings,
  Globe,
  Sliders,
  Table as TableIcon,
  ShieldAlert,
  Clock,
  History,
  Shield,
  Layers,
  Save,
  CheckCircle2,
  AlertCircle,
  GitCompare,
  Key,
} from 'lucide-react';

import {
  ConfigScope,
  ConfigScopeId,
  ConfigGroupDef,
  ConfigGroupId,
  ConfigItem,
  ConfigValueRecord,
  ValidationIssue,
  ConfigDraft,
  ConfigVersionHistory,
  ConfigActivityLog,
} from './types';

import type { SystemConfigurationData } from '../../data/ConfigurationDataSource';

import { OverviewTab } from './OverviewTab';
import { SettingsEditorTab } from './SettingsEditorTab';
import { SettingsTableView } from './SettingsTableView';
import { ValidationIssuesTab } from './ValidationIssuesTab';
import { PendingDraftsTab } from './PendingDraftsTab';
import { VersionHistoryTab } from './VersionHistoryTab';
import { ActivityAuditTab } from './ActivityAuditTab';

import { CompareDiffModal } from './CompareDiffModal';
import { SecretRotateModal } from './SecretRotateModal';
import { AssetPickerModal } from './AssetPickerModal';

interface SystemConfigurationProps {
  websiteData?: SystemConfigurationData;
  globalData: SystemConfigurationData;
}

export const SystemConfiguration: React.FC<SystemConfigurationProps> = ({ websiteData, globalData }) => {
  const mergedData = useMemo<SystemConfigurationData>(() => {
    const localized = websiteData ?? { scopes: [], groups: [], items: [], values: {}, issues: [], drafts: [], versions: [], activityLogs: [] };
    const uniqueById = <T extends { id: string }>(items: T[]) => Array.from(new Map(items.map((item) => [item.id, item])).values());
    return {
      scopes: uniqueById([...localized.scopes, ...globalData.scopes]),
      groups: uniqueById([...localized.groups, ...globalData.groups]),
      items: uniqueById([...localized.items, ...globalData.items]),
      values: { ...localized.values, ...globalData.values },
      issues: uniqueById([...localized.issues, ...globalData.issues]),
      drafts: uniqueById([...localized.drafts, ...globalData.drafts]),
      versions: uniqueById([...localized.versions, ...globalData.versions]),
      activityLogs: uniqueById([...localized.activityLogs, ...globalData.activityLogs]),
    };
  }, [websiteData, globalData]);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'editor' | 'table' | 'issues' | 'drafts' | 'versions' | 'audit'
  >('editor');

  const [scopes, setScopes] = useState<ConfigScope[]>(mergedData.scopes);
  const [activeScopeId, setActiveScopeId] = useState<ConfigScopeId>(mergedData.scopes[0]?.id ?? 'site_enjicad');
  const [groups, setGroups] = useState<ConfigGroupDef[]>(mergedData.groups);
  const [items, setItems] = useState<ConfigItem[]>(mergedData.items);

  // Core Value Matrix: [scopeId][settingId] => ConfigValueRecord
  const [valuesRecordMap, setValuesRecordMap] =
    useState<Record<string, Record<string, ConfigValueRecord>>>(mergedData.values);

  const [issues, setIssues] = useState<ValidationIssue[]>(mergedData.issues);
  const [drafts, setDrafts] = useState<ConfigDraft[]>(mergedData.drafts);
  const [versions, setVersions] = useState<ConfigVersionHistory[]>(mergedData.versions);
  const [activityLogs, setActivityLogs] = useState<ConfigActivityLog[]>(mergedData.activityLogs);

  useEffect(() => {
    setScopes(mergedData.scopes);
    setGroups(mergedData.groups);
    setItems(mergedData.items);
    setValuesRecordMap(mergedData.values);
    setIssues(mergedData.issues);
    setDrafts(mergedData.drafts);
    setVersions(mergedData.versions);
    setActivityLogs(mergedData.activityLogs);
    setActiveScopeId((currentScopeId) =>
      mergedData.scopes.some((scope) => scope.id === currentScopeId)
        ? currentScopeId
        : (mergedData.scopes[0]?.id ?? 'site_enjicad'),
    );
  }, [mergedData]);

  // Modals state
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [compareDraftData, setCompareDraftData] = useState<any>(null);

  const [secretModalOpen, setSecretModalOpen] = useState(false);
  const [selectedSecretItem, setSelectedSecretItem] = useState<ConfigItem | null>(null);

  const [assetModalOpen, setAssetModalOpen] = useState(false);
  const [assetModalTitle, setAssetModalTitle] = useState('Chọn Ảnh');
  const [assetModalType, setAssetModalType] = useState<'image' | 'file'>('image');
  const [assetSelectCallback, setAssetSelectCallback] = useState<((url: string) => void) | null>(null);

  // Notification Toast state
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const activeScope = scopes.find((s) => s.id === activeScopeId) || scopes[0];
  const currentScopeValues = valuesRecordMap[activeScopeId] || {};

  // Handlers for value edits
  const handleUpdateDraftValue = (settingId: string, newValue: any) => {
    setValuesRecordMap((prev) => {
      const scopeValues = { ...(prev[activeScopeId] || {}) };
      const currentRec = scopeValues[settingId] || {
        settingId,
        scopeId: activeScopeId,
        liveValue: '',
        inheritanceState: activeScope.isDefault ? 'default' : 'inherited',
        effectiveValue: '',
        lastUpdatedBy: 'admin_cic',
        lastUpdatedAt: new Date().toISOString(),
      };

      scopeValues[settingId] = {
        ...currentRec,
        draftValue: newValue,
      };

      return {
        ...prev,
        [activeScopeId]: scopeValues,
      };
    });
  };

  const handleOverrideField = (settingId: string) => {
    setValuesRecordMap((prev) => {
      const scopeValues = { ...(prev[activeScopeId] || {}) };
      const globalValues = prev['global'] || {};
      const globalVal = globalValues[settingId]?.liveValue ?? '';

      scopeValues[settingId] = {
        settingId,
        scopeId: activeScopeId,
        liveValue: globalVal,
        draftValue: globalVal,
        inheritanceState: 'overridden',
        inheritedFromScopeId: 'global',
        effectiveValue: globalVal,
        lastUpdatedBy: 'admin_cic',
        lastUpdatedAt: new Date().toISOString(),
      };

      return {
        ...prev,
        [activeScopeId]: scopeValues,
      };
    });

    showToast(`Đã bật Ghi đè (Override) cho cài đặt này tại Scope ${activeScope.name}`);
  };

  const handleResetToInherited = (settingId: string) => {
    setValuesRecordMap((prev) => {
      const scopeValues = { ...(prev[activeScopeId] || {}) };
      const globalValues = prev['global'] || {};
      const globalVal = globalValues[settingId]?.liveValue ?? '';

      scopeValues[settingId] = {
        settingId,
        scopeId: activeScopeId,
        liveValue: globalVal,
        draftValue: undefined,
        inheritanceState: 'inherited',
        inheritedFromScopeId: 'global',
        effectiveValue: globalVal,
        lastUpdatedBy: 'admin_cic',
        lastUpdatedAt: new Date().toISOString(),
      };

      return {
        ...prev,
        [activeScopeId]: scopeValues,
      };
    });

    showToast(`Đã khôi phục cài đặt về Kế thừa từ Scope Gốc (Global Default)`);
  };

  const handleSaveSecret = (settingId: string, newSecret: string) => {
    handleUpdateDraftValue(settingId, newSecret);
    showToast(`Đã cập nhật khóa secret mới vào Bản nháp. (Đã ghi nhật ký bảo mật security log)`);

    // Log Activity
    const newLog: ConfigActivityLog = {
      id: `act_${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      actor: 'admin_cic',
      scopeId: activeScopeId,
      scopeName: activeScope.name,
      action: 'secret_rotated',
      settingPath: items.find((i) => i.id === settingId)?.path,
      details: `Đã xoay khóa secret cho trường "${items.find((i) => i.id === settingId)?.label}"`,
      ipAddress: '118.70.182.95',
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  const handleSaveDraft = () => {
    showToast(`Đã lưu Bản nháp cấu hình thành công cho Scope ${activeScope.name}!`);
  };

  const handleSubmitReview = () => {
    // Check if there are draft values
    const changedKeys = Object.keys(currentScopeValues).filter(
      (k) => currentScopeValues[k]?.draftValue !== undefined
    );

    if (changedKeys.length === 0) {
      showToast('Hiện tại chưa có thay đổi nào trong Bản nháp để gửi duyệt!', 'info');
      return;
    }

    const newDraft: ConfigDraft = {
      id: `draft_${activeScopeId}_${Date.now()}`,
      scopeId: activeScopeId,
      scopeName: activeScope.name,
      versionNumber: `${activeScope.liveVersion}-next`,
      status: 'pending_review',
      changedCount: changedKeys.length,
      createdBy: 'admin_cic',
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
      changesSummary: changedKeys.map((k) => ({
        settingId: k,
        label: items.find((i) => i.id === k)?.label || k,
        changeType: 'modified_value',
        oldValue: currentScopeValues[k].liveValue ?? '(Inherited)',
        newValue: currentScopeValues[k].draftValue,
      })),
    };

    setDrafts((prev) => [newDraft, ...prev]);
    showToast(`Đã gửi Bản nháp cho Quản trị viên duyệt!`);
  };

  const handlePublishDraft = (draft: ConfigDraft) => {
    // Atomic publish
    setValuesRecordMap((prev) => {
      const scopeValues = { ...(prev[draft.scopeId] || {}) };
      draft.changesSummary.forEach((ch) => {
        if (scopeValues[ch.settingId]) {
          scopeValues[ch.settingId] = {
            ...scopeValues[ch.settingId],
            liveValue: ch.newValue,
            effectiveValue: ch.newValue,
            draftValue: undefined,
          };
        }
      });
      return { ...prev, [draft.scopeId]: scopeValues };
    });

    // Remove draft
    setDrafts((prev) => prev.filter((d) => d.id !== draft.id));

    // Add to Version History
    const newVer: ConfigVersionHistory = {
      id: `ver_${draft.scopeId}_${Date.now()}`,
      scopeId: draft.scopeId,
      versionNumber: draft.versionNumber,
      publishedAt: new Date().toLocaleString(),
      publishedBy: 'admin_cic',
      releaseNotes: 'Xuất bản thành công các thay đổi từ Bản nháp.',
      changesCount: draft.changedCount,
      status: 'active_live',
      changes: draft.changesSummary.map((c) => ({
        settingId: c.settingId,
        settingLabel: c.label,
        oldValue: c.oldValue,
        newValue: c.newValue,
      })),
    };

    setVersions((prev) => [newVer, ...prev]);
    showToast(`Atomic Publish thành công phiên bản ${draft.versionNumber} cho ${draft.scopeName}!`);
  };

  const handleRestoreAsNewDraft = (ver: ConfigVersionHistory) => {
    showToast(`Đã khôi phục phiên bản ${ver.versionNumber} thành Bản nháp Mới!`);
    setActiveScopeId(ver.scopeId);
    setActiveTab('editor');
  };

  const handleLocateInEditor = (
    scopeId: ConfigScopeId,
    groupId: ConfigGroupId,
    settingId: string
  ) => {
    setActiveScopeId(scopeId);
    setActiveTab('editor');
    showToast(`Đã định vị đến trường cấu hình ${settingId}`, 'info');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* TOAST NOTIFICATION BANNER */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div
            className={`px-4 py-3 rounded-2xl shadow-2xl border text-xs font-bold flex items-center gap-2.5 ${
              toastMessage.type === 'success'
                ? 'bg-slate-900 text-white border-slate-800'
                : 'bg-amber-500 text-slate-950 border-amber-400'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* MODULE HEADER BANNER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-2xl shadow-md shadow-orange-500/20 shrink-0">
            <Settings className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                CẤU HÌNH HỆ THỐNG
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              Cấu hình Hệ thống (System Configuration & Site Scopes)
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Hợp nhất Cấu hình chung, SEO, Thương hiệu & enjiCAD theo Site/Scope với Kế thừa, Quản lý Nháp (Draft), Review & Phục hồi
            </p>
          </div>
        </div>
      </div>

      {/* MODULE TOP NAVIGATION TABS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200 dark:border-slate-800 text-xs font-bold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'overview'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Overview Tổng quan</span>
        </button>

        <button
          onClick={() => setActiveTab('editor')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'editor'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Editor Theo Site/Scope</span>
        </button>

        <button
          onClick={() => setActiveTab('table')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'table'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <TableIcon className="w-4 h-4" />
          <span>Bảng Cấu hình (Data Table)</span>
        </button>

        <button
          onClick={() => setActiveTab('issues')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'issues'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Cảnh báo Lỗi ({issues.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('drafts')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'drafts'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Bản nháp Chờ duyệt ({drafts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('versions')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'versions'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Phiên bản & Rollback</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'audit'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Nhật ký Audit</span>
        </button>
      </div>

      {/* TAB CONTENT VIEWS */}
      {activeTab === 'overview' && (
        <OverviewTab
          scopes={scopes}
          issues={issues}
          drafts={drafts}
          versions={versions}
          onSelectScope={setActiveScopeId}
          onGoToEditor={(sId) => {
            setActiveScopeId(sId);
            setActiveTab('editor');
          }}
          onGoToDrafts={() => setActiveTab('drafts')}
          onGoToIssues={() => setActiveTab('issues')}
        />
      )}

      {activeTab === 'editor' && (
        <SettingsEditorTab
          scopes={scopes}
          activeScopeId={activeScopeId}
          onSelectScope={setActiveScopeId}
          groups={groups}
          items={items}
          valuesRecord={currentScopeValues}
          issues={issues}
          onUpdateDraftValue={handleUpdateDraftValue}
          onResetToInherited={handleResetToInherited}
          onOverrideField={handleOverrideField}
          onOpenSecretModal={(item) => {
            setSelectedSecretItem(item);
            setSecretModalOpen(true);
          }}
          onOpenAssetPicker={(title, type, onSelect) => {
            setAssetModalTitle(title);
            setAssetModalType(type);
            setAssetSelectCallback(() => onSelect);
            setAssetModalOpen(true);
          }}
          onOpenCompareModal={() => {
            setCompareDraftData(null);
            setCompareModalOpen(true);
          }}
          onSaveDraft={handleSaveDraft}
          onSubmitReview={handleSubmitReview}
        />
      )}

      {activeTab === 'table' && (
        <SettingsTableView
          scopes={scopes}
          groups={groups}
          items={items}
          valuesRecordMap={valuesRecordMap}
          onLocateInEditor={handleLocateInEditor}
        />
      )}

      {activeTab === 'issues' && (
        <ValidationIssuesTab
          scopes={scopes}
          issues={issues}
          onFixIssue={(issue) => {
            handleLocateInEditor(issue.scopeId, issue.groupId, issue.settingId);
          }}
          onRunRevalidation={() => {
            showToast('Đã quét lại toàn bộ hệ thống! Đã phát hiện 3 sự cố cảnh báo.');
          }}
        />
      )}

      {activeTab === 'drafts' && (
        <PendingDraftsTab
          drafts={drafts}
          scopes={scopes}
          onOpenCompare={(draft) => {
            setCompareDraftData(draft.changesSummary);
            setCompareModalOpen(true);
          }}
          onApproveDraft={(draftId) => {
            showToast(`Đã duyệt Bản nháp ${draftId}! Sẵn sàng Xuất bản.`);
          }}
          onReturnDraft={(draftId, notes) => {
            setDrafts((prev) => prev.filter((d) => d.id !== draftId));
            showToast(`Đã trả bản nháp về cho biên tập viên kèm ghi chú: ${notes}`);
          }}
          onPublishDraft={handlePublishDraft}
        />
      )}

      {activeTab === 'versions' && (
        <VersionHistoryTab
          versions={versions}
          scopes={scopes}
          onRestoreAsNewDraft={handleRestoreAsNewDraft}
        />
      )}

      {activeTab === 'audit' && (
        <ActivityAuditTab logs={activityLogs} scopes={scopes} />
      )}

      {/* MODALS */}
      <CompareDiffModal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        scope={activeScope}
        configItems={items}
        valuesMap={currentScopeValues}
        draftChanges={compareDraftData}
      />

      <SecretRotateModal
        isOpen={secretModalOpen}
        onClose={() => setSecretModalOpen(false)}
        settingItem={selectedSecretItem}
        scopeName={activeScope.name}
        onSaveSecret={handleSaveSecret}
      />

      <AssetPickerModal
        isOpen={assetModalOpen}
        onClose={() => setAssetModalOpen(false)}
        title={assetModalTitle}
        assetType={assetModalType}
        onSelectAsset={(url) => {
          if (assetSelectCallback) assetSelectCallback(url);
        }}
      />
    </div>
  );
};
