import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Settings,
  Globe,
  Sliders,
  ShieldAlert,
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
  requiresConfigReview,
} from './types';

import type { SystemConfigurationData } from '../../data/ConfigurationDataSource';

import { OverviewTab } from './OverviewTab';
import { SettingsEditorTab } from './SettingsEditorTab';
import { ValidationIssuesTab } from './ValidationIssuesTab';
import { VersionHistoryTab } from './VersionHistoryTab';
import { ActivityAuditTab } from './ActivityAuditTab';

import { CompareDiffModal } from './CompareDiffModal';
import { SecretRotateModal } from './SecretRotateModal';
import { AssetPickerModal } from './AssetPickerModal';
import { CmsPageHeader } from '../../components/ui/CmsPageHeader';
import { CmsTabs } from '../../components/ui/CmsTabs';
import { saveCmsSystemSettingsAction } from '@/features/system-settings/server/actions';

interface SystemConfigurationProps {
  websiteData?: SystemConfigurationData;
  globalData?: SystemConfigurationData;
  capabilities: { edit: boolean };
}

const emptyConfiguration = (): SystemConfigurationData => ({ scopes: [], groups: [], items: [], values: {}, issues: [], drafts: [], versions: [], activityLogs: [] });

export const SystemConfiguration: React.FC<SystemConfigurationProps> = ({ websiteData, globalData, capabilities }) => {
  const router = useRouter();
  const [isMutating, setIsMutating] = useState(false);
  const mergedData = useMemo<SystemConfigurationData>(() => {
    const localized = websiteData ?? emptyConfiguration();
    const global = globalData ?? emptyConfiguration();
    const uniqueById = <T extends { id: string }>(items: T[]) => Array.from(new Map(items.map((item) => [item.id, item])).values());
    return {
      scopes: uniqueById([...localized.scopes, ...global.scopes]), groups: uniqueById([...localized.groups, ...global.groups]), items: uniqueById([...localized.items, ...global.items]), values: { ...localized.values, ...global.values }, issues: uniqueById([...localized.issues, ...global.issues]), drafts: uniqueById([...localized.drafts, ...global.drafts]), versions: uniqueById([...localized.versions, ...global.versions]), activityLogs: uniqueById([...localized.activityLogs, ...global.activityLogs]),
    };
  }, [websiteData, globalData]);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'editor' | 'issues' | 'versions' | 'audit'
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
  const reviewValuesMap = Object.fromEntries(
    Object.entries(currentScopeValues).filter(([settingId, record]) => {
      const item = items.find((candidate) => candidate.id === settingId);
      return record.draftValue !== undefined && item && requiresConfigReview(item);
    }),
  );

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

  const handleSaveDraft = async () => {
    const reviewCount = Object.keys(reviewValuesMap).length;
    if (reviewCount === 0) {
      showToast('Không có cấu hình ảnh hưởng lớn nào cần lưu bản nháp.', 'info');
      return;
    }
    if (!capabilities.edit || isMutating) return;
    setIsMutating(true);
    try {
      await saveCmsSystemSettingsAction({ changes: Object.keys(reviewValuesMap).filter((settingId) => settingId !== 'comp_branches').map((settingId) => ({ scopeId: activeScopeId, settingId, value: reviewValuesMap[settingId].draftValue ?? null })) });
      router.refresh();
    } catch (error) { showToast(error instanceof Error ? error.message : 'Không thể lưu bản nháp.', 'error'); }
    finally { setIsMutating(false); }
    const savedAt = new Date();
    const versionNumber = `${activeScope.liveVersion}-draft`;
    const nextDraft: ConfigDraft = {
      id: `draft_${activeScopeId}`,
      scopeId: activeScopeId,
      scopeName: activeScope.name,
      versionNumber,
      status: 'draft',
      changedCount: reviewCount,
      createdBy: 'admin_cic',
      createdAt: savedAt.toLocaleString(),
      updatedAt: savedAt.toLocaleString(),
      changesSummary: Object.keys(reviewValuesMap).map((settingId) => ({
        settingId,
        label: items.find((item) => item.id === settingId)?.label || settingId,
        changeType: 'modified_value',
        oldValue: reviewValuesMap[settingId].liveValue ?? '(Inherited)',
        newValue: reviewValuesMap[settingId].draftValue,
      })),
    };
    setDrafts((current) => [nextDraft, ...current.filter((draft) => draft.scopeId !== activeScopeId)]);
    setScopes((current) => current.map((scope) => scope.id === activeScopeId ? { ...scope, draftVersion: versionNumber } : scope));
    showToast(`Đã lưu bản nháp ${reviewCount} cấu hình cần kiểm tra tại ${activeScope.name}.`);
  };

  const handleSaveDirect = async () => {
    const directKeys = Object.keys(currentScopeValues).filter((settingId) => {
      const item = items.find((candidate) => candidate.id === settingId);
      return currentScopeValues[settingId]?.draftValue !== undefined && item && !requiresConfigReview(item);
    });

    if (directKeys.length === 0) {
      showToast('Không có cấu hình thông thường nào cần lưu.', 'info');
      return;
    }

    if (!capabilities.edit || isMutating) return;
    const savedAt = new Date();
    setIsMutating(true);
    try {
      await saveCmsSystemSettingsAction({
        changes: directKeys.filter((settingId) => settingId !== 'comp_branches').map((settingId) => ({ scopeId: activeScopeId, settingId, value: currentScopeValues[settingId].draftValue ?? null })),
        branches: directKeys.includes('comp_branches') ? { workspace: activeScopeId === 'site_english' ? 'en' : 'vi', items: currentScopeValues.comp_branches?.draftValue ?? [] } : undefined,
      });
    setValuesRecordMap((current) => {
      const scopeValues = { ...(current[activeScopeId] || {}) };
      directKeys.forEach((settingId) => {
        const record = scopeValues[settingId];
        scopeValues[settingId] = {
          ...record,
          liveValue: record.draftValue,
          effectiveValue: record.draftValue,
          draftValue: undefined,
          lastUpdatedBy: 'admin_cic',
          lastUpdatedAt: savedAt.toISOString(),
        };
      });
      return { ...current, [activeScopeId]: scopeValues };
    });

    setActivityLogs((current) => [{
      id: `act_direct_${savedAt.getTime()}`,
      timestamp: savedAt.toLocaleString(),
      actor: 'admin_cic',
      scopeId: activeScopeId,
      scopeName: activeScope.name,
      action: 'direct_save',
      details: `Lưu trực tiếp ${directKeys.length} cấu hình thông thường`,
      ipAddress: '118.70.182.95',
    }, ...current]);
    showToast(`Đã lưu ${directKeys.length} thay đổi vào PostgreSQL.`);
    router.refresh();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Không thể lưu cấu hình.', 'error');
    } finally {
      setIsMutating(false);
    }
  };

  const handlePublish = async () => {
    // Check if there are draft values
    const changedKeys = Object.keys(reviewValuesMap);

    if (changedKeys.length === 0) {
      showToast('Không có cấu hình ảnh hưởng lớn nào cần xuất bản.', 'info');
      return;
    }
    if (!capabilities.edit || isMutating) return;
    setIsMutating(true);
    try {
      await saveCmsSystemSettingsAction({ changes: changedKeys.filter((settingId) => settingId !== 'comp_branches').map((settingId) => ({ scopeId: activeScopeId, settingId, value: reviewValuesMap[settingId].draftValue ?? null })) });
      router.refresh();
    } catch (error) { showToast(error instanceof Error ? error.message : 'Không thể xuất bản cấu hình.', 'error'); }
    finally { setIsMutating(false); }

    const newDraft: ConfigDraft = {
      id: `draft_${activeScopeId}_${Date.now()}`,
      scopeId: activeScopeId,
      scopeName: activeScope.name,
      versionNumber: `${activeScope.liveVersion}-next`,
      status: 'draft',
      changedCount: changedKeys.length,
      createdBy: 'admin_cic',
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
      changesSummary: changedKeys.map((k) => ({
        settingId: k,
        label: items.find((i) => i.id === k)?.label || k,
        changeType: 'modified_value',
        oldValue: reviewValuesMap[k].liveValue ?? '(Inherited)',
        newValue: reviewValuesMap[k].draftValue,
      })),
    };

    handlePublishDraft(newDraft);
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
    setDrafts((prev) => prev.filter((d) => d.scopeId !== draft.scopeId));
    setScopes((current) => current.map((scope) => scope.id === draft.scopeId ? { ...scope, liveVersion: draft.versionNumber, draftVersion: undefined } : scope));

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
    <div className="space-y-5 animate-in fade-in duration-200" aria-busy={isMutating}>
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

      <CmsPageHeader
        icon={<Settings />}
        title="Cấu hình chung"
        description="Quản lý thông tin thương hiệu, liên hệ, SEO, đo lường và các thiết lập dùng chung trên website."
      />

      {/* MODULE TOP NAVIGATION TABS */}
      <CmsTabs
        ariaLabel="Các khu vực cấu hình hệ thống"
        value={activeTab}
        onChange={(val) => setActiveTab(val as any)}
        items={[
          { id: 'overview', label: 'Tổng quan', icon: Globe },
          { id: 'editor', label: 'Chỉnh sửa', icon: Sliders },
          { id: 'issues', label: 'Cảnh báo', count: issues.length, icon: ShieldAlert },
          { id: 'versions', label: 'Phiên bản quan trọng', icon: History },
          { id: 'audit', label: 'Nhật ký', icon: Shield },
        ]}
      />

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
          onGoToDrafts={() => setActiveTab('editor')}
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
          onSaveDirect={handleSaveDirect}
          onSaveDraft={handleSaveDraft}
          onPublish={handlePublish}
          readOnly={!capabilities.edit || isMutating}
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
        valuesMap={reviewValuesMap}
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
