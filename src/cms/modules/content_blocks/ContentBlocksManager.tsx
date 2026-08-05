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
} from 'lucide-react';
import { BlockItem, MainTabType, SavedFilterView, ScopeRule, BlockVersion, ConflictIssue } from './types';
import type { ContentBlocksModuleData } from '../../data/PresentationDataSource';
import { ContentBlocksListView } from './ContentBlocksListView';
import { CmsBulkActionBar } from '../../components/ui/CmsBulkActionBar';
import { ContentBlocksPlacementView } from './ContentBlocksPlacementView';
import { ContentBlockEditorDrawer } from './ContentBlockEditorDrawer';
import { ScopePickerDrawer } from './ScopePickerDrawer';
import { UsedByDrawer } from './UsedByDrawer';
import { ContentBlockPreviewModal } from './ContentBlockPreviewModal';
import { ConflictGuardModal } from './ConflictGuardModal';
import { VersionHistoryDrawer } from './VersionHistoryDrawer';
import { DuplicateModal } from './DuplicateModal';
import { CmsButton } from '../../components/ui/CmsButton';
import { CmsPageHeader } from '../../components/ui/CmsPageHeader';
import { CmsTabs } from '../../components/ui/CmsTabs';

interface ContentBlocksManagerProps { data: ContentBlocksModuleData; }

export const ContentBlocksManager: React.FC<ContentBlocksManagerProps> = ({ data }) => {
  // State
  const [blocks, setBlocks] = useState<BlockItem[]>(data.blocks);
  const [issues, setIssues] = useState<ConflictIssue[]>(data.issues);
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
    const targetPlc = data.placements.find((placement) => placement.id === plcId);
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
      <CmsPageHeader
        icon={<Grid />}
        title="Khối nội dung"
        description="Quản lý các khối nội dung dùng lại, vị trí hiển thị, phạm vi áp dụng và phiên bản."
        meta={<span className="rounded-md bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">{blocks.filter((block) => !block.deleted_at).length} khối</span>}
        actions={<>
          <CmsButton
            onClick={() => setIsConflictGuardOpen(true)}
            variant="secondary"
            size="sm"
            leadingIcon={<ShieldAlert />}
          >
            Kiểm tra xung đột ({issues.length})
          </CmsButton>

          <CmsButton
            onClick={handleCreateNew}
            variant="primary"
            size="sm"
            leadingIcon={<Plus />}
          >
            Thêm khối nội dung
          </CmsButton>
        </>}
      />

      {/* Main Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <CmsTabs
          ariaLabel="Phân loại khối nội dung"
          value={activeTab}
          onChange={(tab) => {
            setActiveTab(tab as any);
            if (tab === 'placement_view') setViewMode('placement');
            else setViewMode('list');
          }}
          items={[
            { id: 'all', label: 'Tất cả khối', count: blocks.filter((b) => !b.deleted_at).length },
            { id: 'placement_view', label: 'Phân loại theo vị trí', count: data.placements.length },
            { id: 'my_tasks', label: 'Việc của tôi', count: blocks.filter((b) => !b.deleted_at && b.owner_name === 'Nguyễn Văn Minh').length },
            { id: 'pending_queue', label: 'Hàng chờ duyệt', count: blocks.filter((b) => !b.deleted_at && b.workflow_status === 'pending_review').length },
            { id: 'issues', label: 'Cần khắc phục', count: issues.length },
            { id: 'trash', label: 'Thùng rác', count: blocks.filter((b) => b.deleted_at).length },
          ]}
        />

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
      <CmsBulkActionBar selectedCount={selectedBlockIds.length} itemLabel="khối nội dung" onClear={() => setSelectedBlockIds([])} actions={[
        { label: 'Xuất bản', onClick: handleBulkPublish, icon: CheckCircle2, variant: 'primary' },
        { label: 'Chuyển vào thùng rác', onClick: handleBulkDelete, icon: Trash2, variant: 'danger' },
      ]} />

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
          placements={data.placements}
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
        placements={data.placements}
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
        pageTree={data.pageTree}
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
        versions={data.versions}
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
