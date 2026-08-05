import React, { useState, useMemo } from 'react';
import {
  Plus,
  Trash2,
  Search,
  Filter,
  Edit,
  RefreshCw,
  FileText,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Sparkles,
  Home,
  Tag,
  ArrowUpDown,
  Check,
  Globe,
  Square,
  CheckSquare,
  Archive,
  Layers,
  FolderTree,
  ListFilter,
  Sliders,
  Link2,
  History,
  Activity,
  AlertTriangle,
  Send,
  UserCheck,
  Copy,
  ExternalLink,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';
import { StaticPage, StaticPageCategory, WorkflowStatus } from './types';
import type { CmsLocale } from '../../data/CmsDataSource';
import type { StaticPagesModuleData } from '../../data/EditorialContentDataSource';
import { StaticPageFormView } from './StaticPageFormView';
import { CmsButton } from '../../components/ui/CmsButton';
import { CmsPageHeader } from '../../components/ui/CmsPageHeader';
import { CmsBulkActionBar } from '../../components/ui/CmsBulkActionBar';
import { CmsSelectionCheckbox } from '../../components/ui/CmsSelectionCheckbox';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { TreeView } from './TreeView';
import { UsedByDrawer } from './UsedByDrawer';
import { VersionHistoryDrawer } from './VersionHistoryDrawer';
import { ActivityLogDrawer } from './ActivityLogDrawer';
import { PagePreviewModal } from './PagePreviewModal';
import { QuickEditModal } from './QuickEditModal';
import { ColumnSettingModal, ColumnConfig } from './ColumnSettingModal';
import { ImpactWarningModal } from './ImpactWarningModal';

interface StaticPagesManagerProps {
  workspaceLocale: CmsLocale;
  data?: StaticPagesModuleData;
}

export const StaticPagesManager: React.FC<StaticPagesManagerProps> = ({ workspaceLocale, data }) => {
  // Main Pages State
  const [pages, setPages] = useState<StaticPage[]>(data?.pages ?? []);
  const [categories] = useState<StaticPageCategory[]>(data?.categories ?? []);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // View Mode: 'list' (Data Table) vs 'tree' (Content Hierarchy Tree)
  const [viewMode, setViewMode] = useState<'list' | 'tree'>('list');

  // Saved View Tab Filter
  const [savedView, setSavedView] = useState<
    'all' | 'my_work' | 'pending' | 'orphan' | 'trash'
  >('all');

  // Toolbar Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Table Density & Column Settings
  const [density, setDensity] = useState<'compact' | 'normal' | 'spacious'>('normal');
  const [columns, setColumns] = useState<ColumnConfig[]>([
    { id: 'title', label: 'Trang nội dung (Title)', visible: true, required: true },
    { id: 'category', label: 'Danh mục (Category)', visible: true },
    { id: 'path', label: 'Đường dẫn (Alias/Slug)', visible: true },
    { id: 'workflow', label: 'Trạng thái quy trình', visible: true },
    { id: 'used_by', label: 'Nơi sử dụng (Used-By)', visible: true },
    { id: 'updated', label: 'Cập nhật', visible: true },
    { id: 'actions', label: 'Thao tác', visible: true, required: true },
  ]);

  // Form View State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [pageToEdit, setPageToEdit] = useState<StaticPage | null>(null);

  // Active Modals & Drawers State
  const [activeUsedByPage, setActiveUsedByPage] = useState<StaticPage | null>(null);
  const [activeVersionPage, setActiveVersionPage] = useState<StaticPage | null>(null);
  const [activeActivityPage, setActiveActivityPage] = useState<StaticPage | null>(null);
  const [activePreviewPage, setActivePreviewPage] = useState<StaticPage | null>(null);
  const [activeQuickEditPage, setActiveQuickEditPage] = useState<StaticPage | null>(null);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);

  // High Impact Warning Modal
  const [impactPage, setImpactPage] = useState<StaticPage | null>(null);
  const [impactAction, setImpactAction] = useState<'url_change' | 'archive' | 'delete' | 'hierarchy_change'>('archive');
  const [isImpactModalOpen, setIsImpactModalOpen] = useState(false);

  // Delete Confirm Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState<StaticPage[]>([]);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1. Filtered Pages Logic
  const filteredPages = useMemo(() => {
    return pages.filter((page) => {
      // Saved View Filter
      if (savedView === 'trash') return page.in_trash;
      if (page.in_trash) return false;

      if (savedView === 'my_work' && page.author?.name !== 'Nguyễn Văn Nam') return false;
      if (savedView === 'pending' && page.workflow_status !== 'pending') return false;
      if (savedView === 'orphan' && page.used_by && page.used_by.length > 0) return false;

      // Search Query
      const query = searchQuery.toLowerCase().trim();
      const matchSearch =
        !query ||
        page.title.toLowerCase().includes(query) ||
        page.alias.toLowerCase().includes(query);

      // Category
      const matchCategory = selectedCategoryId === 'all' || page.category_id === selectedCategoryId;

      // Status
      const matchStatus = statusFilter === 'all' || page.workflow_status === statusFilter;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [pages, searchQuery, selectedCategoryId, statusFilter, savedView]);

  // Helpers
  const getCategoryName = (catId: string) => {
    const found = categories.find((c) => c.id === catId);
    return found ? found.name : catId;
  };

  const isColumnVisible = (colId: string) => {
    return columns.find((c) => c.id === colId)?.visible ?? true;
  };

  // Refresh Handler
  const handleRefresh = () => {
    showToast('Đã cập nhật lại danh sách trang nội dung!');
  };

  // Selection Handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredPages.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Direct Toggle Published
  const handleTogglePublished = (page: StaticPage) => {
    if (page.published && page.used_by && page.used_by.length > 0) {
      setImpactPage(page);
      setImpactAction('archive');
      setIsImpactModalOpen(true);
      return;
    }

    setPages((prev) =>
      prev.map((p) =>
        p.id === page.id
          ? {
              ...p,
              published: !p.published,
              workflow_status: !p.published ? 'published' : 'archived',
            }
          : p
      )
    );
    showToast(`Đã ${!page.published ? 'Xuất bản' : 'Ẩn/Lưu trữ'} trang "${page.title}"!`);
  };

  // Batch Toggle Published / Archive
  const handleBatchStatus = (status: WorkflowStatus) => {
    if (selectedIds.length === 0) return;
    const isPub = status === 'published';
    setPages((prev) =>
      prev.map((p) =>
        selectedIds.includes(p.id)
          ? { ...p, published: isPub, workflow_status: status }
          : p
      )
    );
    showToast(`Đã cập nhật trạng thái ${selectedIds.length} trang!`);
  };

  // Batch Move to Trash
  const handleTriggerBatchDelete = () => {
    if (selectedIds.length === 0) return;
    const selectedPages = pages.filter((p) => selectedIds.includes(p.id));
    setItemsToDelete(selectedPages);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    const idsToRemove = itemsToDelete.map((i) => i.id);
    setPages((prev) =>
      prev.map((p) =>
        idsToRemove.includes(p.id)
          ? { ...p, in_trash: true, deleted_at: new Date().toISOString() }
          : p
      )
    );
    setSelectedIds((prev) => prev.filter((id) => !idsToRemove.includes(id)));
    setIsDeleteModalOpen(false);
    showToast(`Đã chuyển ${idsToRemove.length} trang vào Thùng rác!`);
  };

  // Quick Edit Save Handler
  const handleQuickEditSave = (id: string, updates: Partial<StaticPage>) => {
    setPages((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              ...updates,
              updated_time: new Date().toISOString().replace('T', ' ').substring(0, 19),
            }
          : p
      )
    );
    showToast('Đã cập nhật nhanh trang tĩnh!');
  };

  // Form Save Handler (Add / Edit)
  const handleSavePage = (pageData: Partial<StaticPage>) => {
    if (pageToEdit) {
      // Edit existing
      setPages((prev) =>
        prev.map((p) =>
          p.id === pageToEdit.id
            ? ({
                ...p,
                ...pageData,
                updated_time: new Date().toISOString().replace('T', ' ').substring(0, 19),
              } as StaticPage)
            : p
        )
      );
      showToast(`Đã lưu thay đổi trang "${pageData.title}"!`);
    } else {
      // Create new
      const newPage: StaticPage = {
        id: `page_${Date.now().toString().slice(-4)}`,
        title: pageData.title || 'Trang nội dung mới',
        alias: pageData.alias || 'trang-noi-dung-moi',
        category_id: pageData.category_id || categories[0]?.id || '',
        parent_id: pageData.parent_id || null,
        template: pageData.template || 'standard',
        summary: pageData.summary || '',
        content: pageData.content || '',
        image:
          pageData.image ||
          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
        tags: pageData.tags || [],
        show_in_homepage: pageData.show_in_homepage ?? false,
        show_in_header: pageData.show_in_header ?? false,
        show_in_footer: pageData.show_in_footer ?? true,
        published: pageData.published ?? false,
        ordering: pageData.ordering || pages.length + 1,
        seo_title: pageData.seo_title || pageData.title || '',
        seo_keyword: pageData.seo_keyword || '',
        seo_description: pageData.seo_description || pageData.summary || '',
        created_time: new Date().toISOString().replace('T', ' ').substring(0, 19),
        author: { name: 'Nguyễn Văn Nam' },
        workflow_status: pageData.workflow_status || 'draft',
        working_version_number: 1,
        published_version_number: pageData.published ? 1 : undefined,
        used_by: [],
      };
      setPages([newPage, ...pages]);
      showToast(`Đã tạo thành công trang mới "${newPage.title}"!`);
    }
    setIsFormOpen(false);
    setPageToEdit(null);
  };

  // Add Child Page from Tree View
  const handleAddChildPage = (parentPage: StaticPage) => {
    setPageToEdit({
      id: '',
      title: '',
      alias: '',
      category_id: parentPage.category_id,
      parent_id: parentPage.id,
      template: 'standard',
      summary: '',
      content: '',
      image: '',
      tags: [],
      show_in_homepage: false,
      published: false,
      ordering: 1,
      seo_title: '',
      seo_keyword: '',
      seo_description: '',
      created_time: '',
      working_version_number: 1,
      workflow_status: 'draft',
    });
    setIsFormOpen(true);
  };

  // Render Form View
  if (isFormOpen) {
    return (
      <StaticPageFormView
        pageToEdit={pageToEdit}
        categories={categories}
        allPages={pages}
        onCancel={() => {
          setIsFormOpen(false);
          setPageToEdit(null);
        }}
        onSave={handleSavePage}
      />
    );
  }

  return (
    <div className="space-y-5">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-slate-900 dark:bg-slate-800 text-white rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs font-semibold animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Module 03 Header Bar */}
      <CmsPageHeader
        icon={<FileText />}
        title="Trang nội dung"
        description="Quản lý các trang giới thiệu, chính sách, điều khoản và trang đích của website."
        meta={<span className="rounded-md bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">{pages.filter((p) => !p.in_trash).length} trang</span>}
        actions={<>
          {/* View Switcher: List Mode vs Tree Mode */}
          <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center gap-1 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-900 text-orange-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" /> Danh sách
            </button>
            <button
              onClick={() => setViewMode('tree')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'tree'
                  ? 'bg-white dark:bg-slate-900 text-orange-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <FolderTree className="w-3.5 h-3.5" /> Cây nội dung (Tree)
            </button>
          </div>

          <CmsButton
            onClick={() => {
              setPageToEdit(null);
              setIsFormOpen(true);
            }}
            variant="primary"
            size="sm"
            leadingIcon={<Plus />}
          >
            Thêm trang
          </CmsButton>
        </>}
      />

      {/* Saved View Tabs Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
        <button
          onClick={() => setSavedView('all')}
          className={`px-3.5 py-2 rounded-xl border transition-all cursor-pointer shrink-0 ${
            savedView === 'all'
              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
          }`}
        >
          Tất cả trang ({pages.filter((p) => !p.in_trash).length})
        </button>

        <button
          onClick={() => setSavedView('my_work')}
          className={`px-3.5 py-2 rounded-xl border transition-all cursor-pointer shrink-0 ${
            savedView === 'my_work'
              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
          }`}
        >
          Việc của tôi
        </button>

        <button
          onClick={() => setSavedView('pending')}
          className={`px-3.5 py-2 rounded-xl border transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
            savedView === 'pending'
              ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
              : 'bg-white dark:bg-slate-900 text-purple-600 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
          }`}
        >
          <span>Hàng chờ duyệt</span>
          <span className="px-1.5 py-0.2 bg-purple-500/20 rounded text-[10px]">
            {pages.filter((p) => !p.in_trash && p.workflow_status === 'pending').length}
          </span>
        </button>

        <button
          onClick={() => setSavedView('orphan')}
          className={`px-3.5 py-2 rounded-xl border transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
            savedView === 'orphan'
              ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
              : 'bg-white dark:bg-slate-900 text-amber-600 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Trang mồ côi (Không liên kết)</span>
          <span className="px-1.5 py-0.2 bg-amber-500/20 rounded text-[10px]">
            {pages.filter((p) => !p.in_trash && (!p.used_by || p.used_by.length === 0)).length}
          </span>
        </button>

        <button
          onClick={() => setSavedView('trash')}
          className={`px-3.5 py-2 rounded-xl border transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
            savedView === 'trash'
              ? 'bg-red-600 text-white border-red-600 shadow-xs'
              : 'bg-white dark:bg-slate-900 text-red-600 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
          }`}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Thùng rác ({pages.filter((p) => p.in_trash).length})</span>
        </button>
      </div>

      {/* Toolbar Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Input */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tiêu đề hoặc slug URL..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Category Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="all">-- Tất cả danh mục --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Workflow Status Filter */}
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="all">Tất cả trạng thái quy trình</option>
              <option value="draft">Bản nháp (Draft)</option>
              <option value="pending">Hàng chờ duyệt (Pending)</option>
              <option value="published">Đã xuất bản (Published)</option>
              <option value="returned">Yêu cầu sửa (Returned)</option>
              <option value="archived">Lưu trữ (Archived)</option>
            </select>
          </div>

          {/* Extra Buttons */}
          <div className="md:col-span-2 flex items-center gap-2 justify-end">
            <button
              onClick={() => setIsColumnModalOpen(true)}
              className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-medium cursor-pointer shrink-0"
              title="Tùy chỉnh cột & Đô hiển thị table"
            >
              <Sliders className="w-4 h-4" />
            </button>
            <button
              onClick={handleRefresh}
              className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-medium cursor-pointer shrink-0"
              title="Làm mới dữ liệu"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Batch Actions Row */}
        <CmsBulkActionBar selectedCount={selectedIds.length} itemLabel="trang" onClear={() => setSelectedIds([])} actions={[
          { label: 'Xuất bản', onClick: () => handleBatchStatus('published'), icon: CheckSquare, variant: 'primary' },
          { label: 'Lưu trữ', onClick: () => handleBatchStatus('archived'), icon: Archive },
          { label: 'Chuyển vào thùng rác', onClick: handleTriggerBatchDelete, icon: Trash2, variant: 'danger' },
        ]} />
      </div>

      {/* Content Main View: LIST vs TREE */}
      {viewMode === 'tree' ? (
        <TreeView
          pages={filteredPages}
          onEditPage={(p) => {
            setPageToEdit(p);
            setIsFormOpen(true);
          }}
          onPreviewPage={(p) => setActivePreviewPage(p)}
          onOpenUsedBy={(p) => setActiveUsedByPage(p)}
          onAddChildPage={handleAddChildPage}
        />
      ) : (
        /* Data Table Display */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="cms-data-table text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4 w-10 text-center">
                    <CmsSelectionCheckbox checked={filteredPages.length > 0 && selectedIds.length === filteredPages.length} indeterminate={selectedIds.length > 0 && selectedIds.length < filteredPages.length} onChange={handleSelectAll} label="Chọn tất cả trang" />
                  </th>

                  {isColumnVisible('title') && <th className="py-3 px-4 min-w-[280px]">Trang nội dung</th>}
                  {isColumnVisible('category') && <th className="py-3 px-4 min-w-[140px]">Danh mục</th>}
                  {isColumnVisible('path') && <th className="py-3 px-4 min-w-[150px]">URL Alias</th>}
                  {isColumnVisible('workflow') && <th className="py-3 px-4 min-w-[130px] text-center">Quy trình</th>}
                  {isColumnVisible('used_by') && <th className="py-3 px-4 min-w-[130px] text-center">Nơi sử dụng</th>}
                  {isColumnVisible('updated') && <th className="py-3 px-4 min-w-[140px]">Cập nhật</th>}
                  {isColumnVisible('actions') && <th className="py-3 px-4 min-w-[120px] text-right">Thao tác</th>}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
                {filteredPages.length > 0 ? (
                  filteredPages.map((page) => {
                    const isSelected = selectedIds.includes(page.id);
                    const isOrphan = !page.used_by || page.used_by.length === 0;

                    return (
                      <tr
                        key={page.id}
                        className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors ${
                          isSelected ? 'bg-orange-50/40 dark:bg-orange-950/20' : ''
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-3.5 px-4 text-center">
                          <CmsSelectionCheckbox checked={isSelected} onChange={() => handleSelectOne(page.id)} label={`Chọn trang ${page.title}`} />
                        </td>

                        {/* Title & Info */}
                        {isColumnVisible('title') && (
                          <td className="py-3.5 px-4">
                            <div className="flex items-start gap-3">
                              <img
                                src={page.image}
                                alt={page.title}
                                className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800"
                              />
                              <div className="space-y-1 min-w-0">
                                <a
                                  onClick={() => {
                                    setPageToEdit(page);
                                    setIsFormOpen(true);
                                  }}
                                  className="font-bold text-slate-900 dark:text-white hover:text-orange-600 line-clamp-2 transition-colors cursor-pointer"
                                >
                                  {page.title}
                                </a>

                                <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
                                  <span className="font-mono text-slate-500">v{page.working_version_number}.0</span>
                                  {page.show_in_homepage && (
                                    <span className="px-1.5 py-0.2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-[10px] rounded flex items-center gap-0.5">
                                      <Home className="w-2.5 h-2.5 text-slate-400" /> Trang chủ
                                    </span>
                                  )}
                                  {isOrphan && (
                                    <span className="px-1.5 py-0.2 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-[10px] rounded">
                                      Mồ côi
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                        )}

                        {/* Category */}
                        {isColumnVisible('category') && (
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-lg border border-slate-200 dark:border-slate-700 inline-block text-[11px]">
                              {getCategoryName(page.category_id)}
                            </span>
                          </td>
                        )}

                        {/* Alias Slug */}
                        {isColumnVisible('path') && (
                          <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 truncate max-w-[160px]">
                            /{page.alias}
                          </td>
                        )}

                        {/* Workflow Status */}
                        {isColumnVisible('workflow') && (
                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={() => handleTogglePublished(page)}
                              className="cursor-pointer inline-block"
                            >
                              {page.published ? (
                                <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] rounded-full flex items-center justify-center gap-1">
                                  <Check className="w-3 h-3" /> Xuất bản
                                </span>
                              ) : page.workflow_status === 'pending' ? (
                                <span className="px-2.5 py-1 bg-purple-500/10 text-purple-600 font-bold text-[11px] rounded-full">
                                  Chờ duyệt
                                </span>
                              ) : page.workflow_status === 'returned' ? (
                                <span className="px-2.5 py-1 bg-red-500/10 text-red-600 font-bold text-[11px] rounded-full">
                                  Yêu cầu sửa
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 bg-slate-100 text-slate-400 font-bold text-[11px] rounded-full">
                                  Bản nháp
                                </span>
                              )}
                            </button>
                          </td>
                        )}

                        {/* Used-by Reference */}
                        {isColumnVisible('used_by') && (
                          <td className="py-3.5 px-4 text-center">
                            {page.used_by && page.used_by.length > 0 ? (
                              <button
                                onClick={() => setActiveUsedByPage(page)}
                                className="px-2.5 py-1 bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 font-bold text-[11px] rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                              >
                                <Link2 className="w-3 h-3" />
                                <span>{page.used_by.length} nơi dùng</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => setActiveUsedByPage(page)}
                                className="px-2.5 py-1 bg-amber-500/10 text-amber-600 font-bold text-[11px] rounded-lg cursor-pointer"
                              >
                                Mồ côi
                              </button>
                            )}
                          </td>
                        )}

                        {/* Updated Time & Author */}
                        {isColumnVisible('updated') && (
                          <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                            <div>{page.created_time.split(' ')[0]}</div>
                            <div className="text-[10px] text-slate-400 font-sans">
                              {page.author?.name || 'Nguyễn Văn Nam'}
                            </div>
                          </td>
                        )}

                        {/* Action buttons */}
                        {isColumnVisible('actions') && (
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => setActivePreviewPage(page)}
                                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg cursor-pointer"
                                title="Xem trước trang công khai"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => setActiveQuickEditPage(page)}
                                className="p-1.5 text-slate-400 hover:text-orange-600 rounded-lg cursor-pointer"
                                title="Chỉnh sửa nhanh"
                              >
                                <Sliders className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => {
                                  setPageToEdit(page);
                                  setIsFormOpen(true);
                                }}
                                className="p-1.5 text-slate-400 hover:text-orange-600 rounded-lg cursor-pointer"
                                title="Chỉnh sửa toàn bộ trang"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-slate-400 space-y-2">
                      <FileText className="w-10 h-10 mx-auto opacity-40" />
                      <p className="text-sm font-medium">Không tìm thấy trang nội dung nào phù hợp</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Drawers & Modals */}
      <UsedByDrawer
        isOpen={!!activeUsedByPage}
        page={activeUsedByPage}
        onClose={() => setActiveUsedByPage(null)}
      />

      <VersionHistoryDrawer
        isOpen={!!activeVersionPage}
        page={activeVersionPage}
        onClose={() => setActiveVersionPage(null)}
      />

      <ActivityLogDrawer
        isOpen={!!activeActivityPage}
        page={activeActivityPage}
        onClose={() => setActiveActivityPage(null)}
      />

      <PagePreviewModal
        isOpen={!!activePreviewPage}
        page={activePreviewPage}
        onClose={() => setActivePreviewPage(null)}
      />

      <QuickEditModal
        isOpen={!!activeQuickEditPage}
        page={activeQuickEditPage}
        categories={categories}
        allPages={pages}
        onClose={() => setActiveQuickEditPage(null)}
        onSave={handleQuickEditSave}
      />

      <ColumnSettingModal
        isOpen={isColumnModalOpen}
        columns={columns}
        density={density}
        onClose={() => setIsColumnModalOpen(false)}
        onToggleColumn={(id) =>
          setColumns((prev) =>
            prev.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c))
          )
        }
        onChangeDensity={setDensity}
      />

      <ImpactWarningModal
        isOpen={isImpactModalOpen}
        page={impactPage}
        actionType={impactAction}
        onClose={() => setIsImpactModalOpen(false)}
        onConfirm={() => {
          if (impactPage) {
            setPages((prev) =>
              prev.map((p) =>
                p.id === impactPage.id
                  ? { ...p, published: false, workflow_status: 'archived' }
                  : p
              )
            );
            showToast(`Đã gỡ trang "${impactPage.title}" khỏi giao diện công khai!`);
          }
          setIsImpactModalOpen(false);
        }}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        itemsToDelete={itemsToDelete}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
