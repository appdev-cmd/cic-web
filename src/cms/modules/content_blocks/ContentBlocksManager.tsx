import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Grid,
  List,
  Layers,
  ShieldAlert,
  Trash2,
  Copy,
  CheckCircle2,
  Clock,
  RefreshCw,
  FolderTree,
  Eye,
  SlidersHorizontal,
  Download,
  Check,
  X,
  Sparkles,
  HelpCircle,
  FileCode,
  Languages,
} from 'lucide-react';
import { BlockItem, MainTabType, SavedFilterView, ScopeRule, BlockVersion, ConflictIssue } from './types';
import type { CmsLocale } from '../../data/CmsDataSource';
import type { ContentBlocksModuleData } from '../../data/PresentationDataSource';
import { ContentBlocksListView } from './ContentBlocksListView';
import { ContentBlocksPlacementView } from './ContentBlocksPlacementView';
import { ContentBlockEditorDrawer } from './ContentBlockEditorDrawer';
import { ScopePickerDrawer } from './ScopePickerDrawer';
import { UsedByDrawer } from './UsedByDrawer';
import { ContentBlockPreviewModal } from './ContentBlockPreviewModal';
import { ConflictGuardModal } from './ConflictGuardModal';
import { VersionHistoryDrawer } from './VersionHistoryDrawer';
import { DuplicateModal } from './DuplicateModal';

interface ContentBlocksManagerProps { workspaceLocale: CmsLocale; data?: ContentBlocksModuleData; }

export const ContentBlocksManager: React.FC<ContentBlocksManagerProps> = ({ workspaceLocale, data }) => {
  // State
  const [blocks, setBlocks] = useState<BlockItem[]>(data?.blocks ?? []);
  const [issues, setIssues] = useState<ConflictIssue[]>(data?.issues ?? []);
  const [activeTab, setActiveTab] = useState<MainTabType>('all');
  const [viewMode, setViewMode] = useState<'list' | 'placement'>('list');
  const [savedFilter, setSavedFilter] = useState<SavedFilterView>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBlockIds, setSelectedBlockIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Drawers & Modals state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<BlockItem | null>(null);

  const [isScopePickerOpen, setIsScopePickerOpen] = useState(false);
  const [activeScope, setActiveScope] = useState<ScopeRule | null>(null);
  const [scopeSaveCallback, setScopeSaveCallback] = useState<((s: ScopeRule) => void) | null>(null);

  const [isUsedByOpen, setIsUsedByOpen] = useState(false);
  const [usedByBlock, setUsedByBlock] = useState<BlockItem | null>(null);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewBlock, setPreviewBlock] = useState<BlockItem | null>(null);
  const [previewPagePath, setPreviewPagePath] = useState<string>('/');

  const [isConflictGuardOpen, setIsConflictGuardOpen] = useState(false);

  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const [versionHistoryBlock, setVersionHistoryBlock] = useState<BlockItem | null>(null);

  const [isDuplicateOpen, setIsDuplicateOpen] = useState(false);
  const [duplicateBlock, setDuplicateBlock] = useState<BlockItem | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter logic
  const filteredBlocks = blocks.filter((b) => {
    // Trash tab filter
    if (activeTab === 'trash') {
      if (!b.deleted_at) return false;
    } else {
      if (b.deleted_at) return false;
    }

    if (activeTab === 'my_tasks') {
      if (b.owner_name !== 'Nguyễn Văn Minh') return false;
    }

    if (activeTab === 'pending_queue') {
      if (b.workflow_status !== 'pending_review') return false;
    }

    if (activeTab === 'issues') {
      const isBlockInIssues = issues.some((i) => i.block_id === b.id);
      if (!isBlockInIssues) return false;
    }

    // Saved filter view pills
    if (savedFilter === 'high_usage' && b.used_by_count < 2) return false;
    if (savedFilter === 'pending' && b.workflow_status !== 'pending_review') return false;
    if (savedFilter === 'unused' && b.used_by_count > 0) return false;
    if (savedFilter === 'conflicts' && !issues.some((i) => i.block_id === b.id)) return false;
    if (savedFilter === 'missing_translation' && !Object.values(b.locale_status).some((s) => s === 'missing' || s === 'outdated')) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = b.title.toLowerCase().includes(q);
      const matchCode = b.code_alias.toLowerCase().includes(q);
      const matchOwner = b.owner_name.toLowerCase().includes(q);
      const matchPlacement = b.placement_name.toLowerCase().includes(q);
      if (!matchTitle && !matchCode && !matchOwner && !matchPlacement) return false;
    }

    return true;
  });

  // Handlers
  const handleCreateNew = () => {
    setEditingBlock(null);
    setIsEditorOpen(true);
  };

  const handleCreateBlockInPlacement = (plcId: string) => {
    const targetPlc = data?.placements.find((placement) => placement.id === plcId);
    setEditingBlock({
      id: `blk_${Date.now()}`,
      title: 'Khối mới tại vị trí',
      code_alias: 'new-block-alias',
      type: 'hero_cta',
      show_title: true,
      layout_variant: 'standard',
      site_id: 'main_site',
      placement_id: plcId,
      placement_name: targetPlc ? targetPlc.name : 'Vị trí mới',
      scope: { site_id: 'main_site', apply_all_pages: false, included_pages: ['/'], excluded_pages: [] },
      used_by_count: 1,
      used_by_pages: [{ page_id: 'node_home', page_title: 'Trang chủ', page_path: '/' }],
      content: { headline: '', subtitle: '' },
      display_order: 1,
      priority_weight: 5,
      start_time: new Date().toISOString(),
      end_time: '2026-12-31T23:59:59Z',
      auto_deactivate: true,
      locale_status: { vi: 'complete', en: 'missing', ja: 'missing' },
      workflow_status: 'draft',
      effective_status: 'inactive',
      live_version: '-',
      draft_version: 'v0.1-draft',
      has_draft_changes: true,
      owner_name: 'Nguyễn Văn Minh',
      owner_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    setIsEditorOpen(true);
  };

  const handleEditBlock = (block: BlockItem) => {
    setEditingBlock(block);
    setIsEditorOpen(true);
  };

  const handleSaveBlock = (updatedBlock: BlockItem, action: 'draft' | 'submit' | 'publish') => {
    setBlocks((prev) => {
      const exists = prev.some((b) => b.id === updatedBlock.id);
      if (exists) {
        return prev.map((b) => (b.id === updatedBlock.id ? updatedBlock : b));
      } else {
        return [updatedBlock, ...prev];
      }
    });

    setIsEditorOpen(false);

    if (action === 'draft') showToast(`Đã lưu bản thảo (Draft) thành công!`);
    if (action === 'submit') showToast(`Đã gửi khối "${updatedBlock.title}" cho Content Manager duyệt!`);
    if (action === 'publish') showToast(`Đã Xuất Bản (Publish Live) khối "${updatedBlock.title}" lên website!`);
  };

  const handleToggleSelectAll = () => {
    if (selectedBlockIds.length === filteredBlocks.length) {
      setSelectedBlockIds([]);
    } else {
      setSelectedBlockIds(filteredBlocks.map((b) => b.id));
    }
  };

  const handleToggleSelectBlock = (id: string) => {
    if (selectedBlockIds.includes(id)) {
      setSelectedBlockIds(selectedBlockIds.filter((item) => item !== id));
    } else {
      setSelectedBlockIds([...selectedBlockIds, id]);
    }
  };

  const handleQuickStatusToggle = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'published' ? 'draft' : 'published';
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              workflow_status: nextStatus as any,
              effective_status: nextStatus === 'published' ? 'running' : 'inactive',
              updated_at: new Date().toISOString(),
            }
          : b
      )
    );
    showToast(`Đã chuyển trạng thái sang "${nextStatus}"`);
  };

  const handleDeleteBlock = (id: string) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, deleted_at: new Date().toISOString() } : b))
    );
    showToast(`Đã chuyển khối vào Thùng Rác`);
  };

  const handleDuplicateConfirm = (newTitle: string, resetWorkflow: boolean) => {
    if (!duplicateBlock) return;
    const cloned: BlockItem = {
      ...duplicateBlock,
      id: `blk_${Date.now()}`,
      title: newTitle,
      code_alias: `${duplicateBlock.code_alias}-copy`,
      workflow_status: resetWorkflow ? 'draft' : duplicateBlock.workflow_status,
      effective_status: resetWorkflow ? 'inactive' : duplicateBlock.effective_status,
      live_version: resetWorkflow ? '-' : duplicateBlock.live_version,
      draft_version: 'v0.1-draft',
      has_draft_changes: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setBlocks([cloned, ...blocks]);
    showToast(`Đã nhân bản khối thành "${newTitle}"!`);
  };

  const handleResolveIssue = (issueId: string) => {
    setIssues((prev) => prev.filter((i) => i.id !== issueId));
    showToast(`Đã giải quyết vấn đề kiểm định!`);
  };

  const handleRollbackVersion = (ver: BlockVersion) => {
    if (!versionHistoryBlock) return;
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === versionHistoryBlock.id
          ? {
              ...b,
              live_version: `v${ver.version_number.toFixed(1)}`,
              updated_at: new Date().toISOString(),
            }
          : b
      )
    );
    setIsVersionHistoryOpen(false);
    showToast(`Đã rollback khối về phiên bản v${ver.version_number.toFixed(1)}!`);
  };

  // Bulk actions
  const handleBulkPublish = () => {
    setBlocks((prev) =>
      prev.map((b) =>
        selectedBlockIds.includes(b.id)
          ? { ...b, workflow_status: 'published', effective_status: 'running', updated_at: new Date().toISOString() }
          : b
      )
    );
    setSelectedBlockIds([]);
    showToast(`Đã Xuất Bản hàng loạt ${selectedBlockIds.length} khối nội dung!`);
  };

  const handleBulkDelete = () => {
    setBlocks((prev) =>
      prev.map((b) =>
        selectedBlockIds.includes(b.id)
          ? { ...b, deleted_at: new Date().toISOString() }
          : b
      )
    );
    setSelectedBlockIds([]);
    showToast(`Đã chuyển ${selectedBlockIds.length} khối vào Thùng Rác`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white border border-slate-700 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Module Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Quản Lý Khối Nội Dung (Content Blocks) · {workspaceLocale.toUpperCase()}
            </h1>
            <span className="text-xs font-bold uppercase bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300 px-2.5 py-0.5 rounded-full border border-orange-200 dark:border-orange-900">
              KHỐI NỘI DUNG
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Quản trị các đơn vị nội dung tái sử dụng (Hero, Banner, CTA, FAQ, Feature Grid), phân vùng vị trí, phạm vi hiển thị và quản lý phiên bản.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsConflictGuardOpen(true)}
            className="px-3 py-2 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <span>Audit Xung Đột ({issues.length})</span>
          </button>

          <button
            type="button"
            onClick={handleCreateNew}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> + Tạo Khối Nội Dung Mới
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1">
          {[
            { id: 'all', label: 'Tất cả khối', count: blocks.filter((b) => !b.deleted_at).length },
            { id: 'placement_view', label: 'Phân loại theo vị trí', count: data?.placements.length ?? 0 },
            { id: 'my_tasks', label: 'Việc của tôi', count: blocks.filter((b) => !b.deleted_at && b.owner_name === 'Nguyễn Văn Minh').length },
            { id: 'pending_queue', label: 'Hàng chờ duyệt', count: blocks.filter((b) => !b.deleted_at && b.workflow_status === 'pending_review').length },
            { id: 'issues', label: 'Cần khắc phục', count: issues.length },
            { id: 'trash', label: 'Thùng rác', count: blocks.filter((b) => b.deleted_at).length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                if (tab.id === 'placement_view') setViewMode('placement');
                else setViewMode('list');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeTab === tab.id ? 'bg-orange-700 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-1">
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
              viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-400'
            }`}
            title="Dạng bảng chi tiết (List)"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('placement')}
            className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
              viewMode === 'placement' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-400'
            }`}
            title="Dạng phân nhóm vị trí (Placement lanes)"
          >
            <Grid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Toolbar & Saved Views Pills */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-50/60 dark:bg-slate-850 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm khối theo tên, alias, vị trí hoặc người quản lý..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Saved View Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'high_usage', label: 'Dùng nhiều nơi (High Usage)' },
            { id: 'pending', label: 'Chờ duyệt' },
            { id: 'unused', label: 'Chưa gắn vị trí (Orphan)' },
            { id: 'conflicts', label: 'Có xung đột' },
            { id: 'missing_translation', label: 'Thiếu bản dịch' },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setSavedFilter(pill.id as any)}
              className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-colors whitespace-nowrap ${
                savedFilter === pill.id
                  ? 'bg-slate-800 text-white dark:bg-slate-700 font-bold'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedBlockIds.length > 0 && (
        <div className="bg-orange-950 text-white p-3 rounded-xl flex items-center justify-between animate-in fade-in duration-150">
          <span className="text-xs font-bold">
            Đã chọn {selectedBlockIds.length} khối nội dung
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBulkPublish}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Xuất Bản Hàng Loạt
            </button>
            <button
              type="button"
              onClick={handleBulkDelete}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Thùng Rác
            </button>
          </div>
        </div>
      )}

      {/* Main View Display */}
      {viewMode === 'list' ? (
        <ContentBlocksListView
          blocks={filteredBlocks}
          selectedBlockIds={selectedBlockIds}
          onToggleSelectAll={handleToggleSelectAll}
          onToggleSelectBlock={handleToggleSelectBlock}
          onEditBlock={handleEditBlock}
          onOpenPreview={(b) => {
            setPreviewBlock(b);
            setIsPreviewOpen(true);
          }}
          onOpenUsedBy={(b) => {
            setUsedByBlock(b);
            setIsUsedByOpen(true);
          }}
          onDuplicateBlock={(b) => {
            setDuplicateBlock(b);
            setIsDuplicateOpen(true);
          }}
          onDeleteBlock={handleDeleteBlock}
          onQuickStatusToggle={handleQuickStatusToggle}
        />
      ) : (
        <ContentBlocksPlacementView
          placements={data?.placements ?? []}
          blocks={filteredBlocks}
          onEditBlock={handleEditBlock}
          onOpenPreview={(b) => {
            setPreviewBlock(b);
            setIsPreviewOpen(true);
          }}
          onCreateBlockInPlacement={handleCreateBlockInPlacement}
        />
      )}

      {/* MODALS AND DRAWERS INTEGRATION */}
      <ContentBlockEditorDrawer
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        block={editingBlock}
        placements={data?.placements ?? []}
        onSave={handleSaveBlock}
        onOpenScopePicker={(scope, saveCb) => {
          setActiveScope(scope);
          setScopeSaveCallback(() => saveCb);
          setIsScopePickerOpen(true);
        }}
        onOpenPreview={(b) => {
          setPreviewBlock(b);
          setIsPreviewOpen(true);
        }}
      />

      <ScopePickerDrawer
        isOpen={isScopePickerOpen}
        onClose={() => setIsScopePickerOpen(false)}
        scope={activeScope || { site_id: 'main_site', apply_all_pages: false, included_pages: [], excluded_pages: [] }}
        pageTree={data?.pageTree ?? []}
        onSaveScope={(newScope) => {
          if (scopeSaveCallback) scopeSaveCallback(newScope);
        }}
      />

      <UsedByDrawer
        isOpen={isUsedByOpen}
        onClose={() => setIsUsedByOpen(false)}
        block={usedByBlock}
        onOpenPreview={(b, path) => {
          setPreviewBlock(b);
          setPreviewPagePath(path || '/');
          setIsPreviewOpen(true);
        }}
      />

      <ContentBlockPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        block={previewBlock}
        initialPagePath={previewPagePath}
      />

      <ConflictGuardModal
        isOpen={isConflictGuardOpen}
        onClose={() => setIsConflictGuardOpen(false)}
        issues={issues}
        blocks={blocks}
        onResolveIssue={handleResolveIssue}
      />

      <VersionHistoryDrawer
        isOpen={isVersionHistoryOpen}
        onClose={() => setIsVersionHistoryOpen(false)}
        block={versionHistoryBlock}
        versions={data?.versions ?? []}
        onRollback={handleRollbackVersion}
      />

      <DuplicateModal
        isOpen={isDuplicateOpen}
        onClose={() => setIsDuplicateOpen(false)}
        block={duplicateBlock}
        onDuplicateConfirm={handleDuplicateConfirm}
      />
    </div>
  );
};
