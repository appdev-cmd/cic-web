import React, { useState, useMemo } from 'react';
import {
  Image as ImageIcon,
  Sliders,
  Plus,
  Search,
  Filter,
  Calendar,
  Layers,
  History,
  AlertTriangle,
  Eye,
  CheckCircle2,
  Clock,
  Trash2,
  Copy,
  Send,
  ShieldAlert,
  RotateCcw,
  Sparkles,
  List,
  Grid,
  ChevronDown,
  Globe,
  UserCheck,
  Inbox,
  FileCheck,
} from 'lucide-react';

import {
  BannerContent,
  BannerPlacementConfig,
  ScheduleConflict,
  BannerVersion,
  MainTabType,
  SavedFilterView,
  WorkflowStatus,
} from './types';

import type { CmsLocale } from '../../data/CmsDataSource';
import type { BannersModuleData } from '../../data/PresentationDataSource';

import { BannerListView } from './BannerListView';
import { BannerCalendarView } from './BannerCalendarView';
import { BannerEditorDrawer } from './BannerEditorDrawer';
import { BannerPreviewModal } from './BannerPreviewModal';
import { BannerConflictModal } from './BannerConflictModal';
import { BannerVersionDrawer } from './BannerVersionDrawer';
import { BannerPlacementModal } from './BannerPlacementModal';
import { BannerDuplicateModal } from './BannerDuplicateModal';
import { CmsButton } from '../../components/ui/CmsButton';
import { CmsPageHeader } from '../../components/ui/CmsPageHeader';

interface BannersManagerProps { workspaceLocale: CmsLocale; data?: BannersModuleData; }

export const BannersManager: React.FC<BannersManagerProps> = ({ workspaceLocale, data }) => {
  // Main Items & Data States
  const [items, setItems] = useState<BannerContent[]>(data?.banners ?? []);
  const [placements, setPlacements] = useState<BannerPlacementConfig[]>(data?.placements ?? []);
  const [conflicts, setConflicts] = useState<ScheduleConflict[]>(data?.conflicts ?? []);
  const [versions, setVersions] = useState<BannerVersion[]>(data?.versions ?? []);

  // Sub-Navigation Tabs & Views
  const [activeMainTab, setActiveMainTab] = useState<MainTabType>('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [savedView, setSavedView] = useState<SavedFilterView>('all');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlacement, setSelectedPlacement] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('all');

  // Selected Row IDs for Bulk Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals & Drawers States
  const [editingItem, setEditingItem] = useState<BannerContent | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const [previewItem, setPreviewItem] = useState<BannerContent | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [duplicatingItem, setDuplicatingItem] = useState<BannerContent | null>(null);
  const [isDuplicateOpen, setIsDuplicateOpen] = useState(false);

  const [isConflictOpen, setIsConflictOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isPlacementOpen, setIsPlacementOpen] = useState(false);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered items logic
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Main tab filter
      if (activeMainTab === 'trash') {
        if (!item.deleted_at) return false;
      } else {
        if (item.deleted_at) return false;
      }

      if (activeMainTab === 'my_tasks') {
        if (!item.owner_name.includes('Manh') && !item.owner_name.includes('Editor')) return false;
      }

      if (activeMainTab === 'pending_queue') {
        if (item.workflow_status !== 'pending_review') return false;
      }

      // Search query
      const matchSearch =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.alias.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.placement_name.toLowerCase().includes(searchQuery.toLowerCase());

      // Placement filter
      const matchPlacement = selectedPlacement === 'all' || item.placement_id === selectedPlacement;

      // Type filter
      const matchType = selectedType === 'all' || item.type === selectedType;

      // Workflow filter
      const matchWorkflow = selectedWorkflow === 'all' || item.workflow_status === selectedWorkflow;

      // Saved view filter
      let matchSavedView = true;
      if (savedView === 'running') matchSavedView = item.effective_status === 'running';
      else if (savedView === 'upcoming') matchSavedView = item.effective_status === 'upcoming';
      else if (savedView === 'pending') matchSavedView = item.workflow_status === 'pending_review';
      else if (savedView === 'conflicts') matchSavedView = item.effective_status === 'conflict';
      else if (savedView === 'ended') matchSavedView = item.effective_status === 'ended';

      return matchSearch && matchPlacement && matchType && matchWorkflow && matchSavedView;
    });
  }, [items, activeMainTab, searchQuery, selectedPlacement, selectedType, selectedWorkflow, savedView]);

  // Selection handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map((i) => i.id));
    }
  };

  // Actions
  const handleCreateNew = (type: 'banner' | 'slideshow') => {
    setEditingItem({ type } as any);
    setIsEditorOpen(true);
  };

  const handleSaveItem = (savedItem: BannerContent) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === savedItem.id);
      if (exists) {
        return prev.map((i) => (i.id === savedItem.id ? savedItem : i));
      }
      return [savedItem, ...prev];
    });

    showToast(`Đã lưu thành công ${savedItem.type === 'slideshow' ? 'Slideshow' : 'Banner'} "${savedItem.title}"!`);
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, deleted_at: new Date().toISOString() } : i))
    );
    showToast('Đã chuyển mục quảng bá vào Thùng rác!');
  };

  const handleDuplicateConfirm = (duplicated: BannerContent) => {
    setItems((prev) => [duplicated, ...prev]);
    showToast(`Đã tạo bản sao thành công: "${duplicated.title}"!`);
  };

  const handleResolveConflict = (conflictId: string, action: string) => {
    setConflicts((prev) => prev.filter((c) => c.id !== conflictId));
    setItems((prev) =>
      prev.map((i) => (i.effective_status === 'conflict' ? { ...i, effective_status: 'upcoming' } : i))
    );
    showToast('Đã tự động xử lý xung đột lịch hiển thị!');
  };

  // Bulk actions
  const handleBulkPublish = () => {
    setItems((prev) =>
      prev.map((i) => (selectedIds.includes(i.id) ? { ...i, workflow_status: 'published' as WorkflowStatus } : i))
    );
    showToast(`Đã Xuất Bản (Publish) đồng loạt ${selectedIds.length} mục!`);
    setSelectedIds([]);
  };

  const handleBulkArchive = () => {
    setItems((prev) =>
      prev.map((i) => (selectedIds.includes(i.id) ? { ...i, workflow_status: 'archived' as WorkflowStatus } : i))
    );
    showToast(`Đã chuyển ${selectedIds.length} mục sang trạng thái Lưu trữ (Archived)!`);
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    setItems((prev) =>
      prev.map((i) => (selectedIds.includes(i.id) ? { ...i, deleted_at: new Date().toISOString() } : i))
    );
    showToast(`Đã xóa ${selectedIds.length} mục vào Thùng rác!`);
    setSelectedIds([]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-slate-900 dark:bg-slate-800 text-white rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Banner */}
      <div className="space-y-3">
        <CmsPageHeader
          icon={<ImageIcon />}
          title="Banner và slideshow"
          description="Quản lý nội dung trình chiếu theo vị trí hiển thị, lịch chạy và phiên bản."
          meta={<span className="rounded-md bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">{items.filter((item) => !item.deleted_at).length} nội dung</span>}
          actions={<>
            <CmsButton
              onClick={() => handleCreateNew('banner')}
              variant="primary"
              leadingIcon={<Plus />}
            >
              Thêm banner
            </CmsButton>

            <CmsButton
              onClick={() => handleCreateNew('slideshow')}
              variant="secondary"
              leadingIcon={<Sliders />}
            >
              Thêm slideshow
            </CmsButton>
          </>}
        />

        {/* Global Toolbar Status Summary & Tools */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-xs">
            <div>
              <span className="text-slate-400">Tổng số nội dung: </span>
              <strong className="text-slate-900 dark:text-white font-bold">{items.filter((i) => !i.deleted_at).length}</strong>
            </div>
            <div>
              <span className="text-slate-400">Đang chạy (Live): </span>
              <strong className="text-emerald-600 font-bold">
                {items.filter((i) => i.effective_status === 'running' && !i.deleted_at).length}
              </strong>
            </div>
            <div>
              <span className="text-slate-400">Xung đột lịch: </span>
              <strong className="text-rose-600 font-bold">{conflicts.length}</strong>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Conflict Guard Button */}
            <button
              onClick={() => setIsConflictOpen(true)}
              className={`px-3 py-1.5 text-xs font-semibold border rounded-xl transition flex items-center gap-1.5 ${
                conflicts.length > 0
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 text-rose-700 dark:text-rose-300 animate-pulse'
                  : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              <span>Kiểm tra xung đột ({conflicts.length})</span>
            </button>

            {/* Placements Config Button */}
            <button
              onClick={() => setIsPlacementOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-100 transition flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-orange-500" />
              <span>Vị trí Website ({placements.length})</span>
            </button>

            {/* Version History Button */}
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-100 transition flex items-center gap-1.5"
            >
              <History className="w-3.5 h-3.5 text-purple-500" />
              <span>Lịch sử phiên bản</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Sitemap Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'Tất cả nội dung', icon: ImageIcon },
          { id: 'schedule', label: 'Lịch hiển thị (Timeline)', icon: Calendar },
          { id: 'my_tasks', label: 'Việc của tôi', icon: UserCheck },
          { id: 'pending_queue', label: 'Hàng chờ duyệt', icon: Inbox },
          { id: 'trash', label: 'Thùng rác', icon: Trash2 },
        ].map((t) => {
          const IconComponent = t.icon;
          const isActive = activeMainTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveMainTab(t.id as MainTabType)}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-orange-600 text-white shadow-2xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Filter & View Mode Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm tiêu đề banner, alias hoặc vị trí..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          {/* Filters & View Switcher */}
          <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
            {/* Filter by Placement */}
            <select
              value={selectedPlacement}
              onChange={(e) => setSelectedPlacement(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="all">Tất cả Vị trí</option>
              {placements.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            {/* Filter by Type */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="all">Tất cả Loại</option>
              <option value="banner">Single Banner</option>
              <option value="slideshow">Slideshow</option>
            </select>

            {/* View Mode List vs Calendar */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <List className="w-3.5 h-3.5" /> Bảng
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  viewMode === 'calendar'
                    ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" /> Lịch Timeline
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions Floating Bar */}
        {selectedIds.length > 0 && (
          <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/40 flex items-center justify-between gap-3 text-xs">
            <span className="font-bold text-orange-900 dark:text-orange-200">
              Đã chọn <strong>{selectedIds.length}</strong> mục quảng bá
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkPublish}
                className="px-3 py-1.5 font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition"
              >
                Xuất bản đồng loạt
              </button>
              <button
                onClick={handleBulkArchive}
                className="px-3 py-1.5 font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 rounded-lg border border-slate-300 dark:border-slate-700 transition"
              >
                Chuyển vào Lưu trữ
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1.5 font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition"
              >
                Xóa được chọn
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Display View */}
        {viewMode === 'list' ? (
          <BannerListView
            items={filteredItems}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onSelectAll={handleSelectAll}
            onEdit={(item) => {
              setEditingItem(item);
              setIsEditorOpen(true);
            }}
            onPreview={(item) => {
              setPreviewItem(item);
              setIsPreviewOpen(true);
            }}
            onDuplicate={(item) => {
              setDuplicatingItem(item);
              setIsDuplicateOpen(true);
            }}
            onDelete={handleDeleteItem}
            onQuickToggleStatus={(item) => {
              showToast(`Đã đổi trạng thái nhanh của "${item.title}"`);
            }}
            savedView={savedView}
            onSelectSavedView={setSavedView}
          />
        ) : (
          <BannerCalendarView
            items={filteredItems}
            placements={placements}
            onEdit={(item) => {
              setEditingItem(item);
              setIsEditorOpen(true);
            }}
            onPreview={(item) => {
              setPreviewItem(item);
              setIsPreviewOpen(true);
            }}
          />
        )}
      </div>

      {/* Editor Drawer */}
      <BannerEditorDrawer
        item={editingItem}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveItem}
        placements={placements}
      />

      {/* Live Contextual Preview Modal */}
      <BannerPreviewModal
        item={previewItem}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />

      {/* Schedule Conflict Guard Modal */}
      <BannerConflictModal
        isOpen={isConflictOpen}
        onClose={() => setIsConflictOpen(false)}
        conflicts={conflicts}
        items={items}
        onResolveConflict={handleResolveConflict}
      />

      {/* Version History Drawer */}
      <BannerVersionDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        versions={versions}
        onRestoreVersion={(ver) => {
          showToast(`Đã khôi phục thành công phiên bản v${ver.version_number.toFixed(1)}!`);
          setIsHistoryOpen(false);
        }}
      />

      {/* Duplicate Options Modal */}
      <BannerDuplicateModal
        item={duplicatingItem}
        isOpen={isDuplicateOpen}
        onClose={() => setIsDuplicateOpen(false)}
        onConfirmDuplicate={handleDuplicateConfirm}
      />

      {/* Website Placement Management Modal */}
      <BannerPlacementModal
        isOpen={isPlacementOpen}
        onClose={() => setIsPlacementOpen(false)}
        placements={placements}
      />
    </div>
  );
};
