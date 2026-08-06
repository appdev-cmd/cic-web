import React, { useState, useMemo } from 'react';
import {
  Newspaper,
  Plus,
  Search,
  Filter,
  Trash2,
  Eye,
  EyeOff,
  Edit,
  Star,
  Check,
  RotateCcw,
  RefreshCw,
  Sparkles,
  Calendar,
  Layers,
  ArrowUpDown,
  CheckSquare,
  Square,
  AlertCircle,
  Clock,
  ExternalLink,
  History,
  Activity,
  SlidersHorizontal,
  Bookmark,
  User,
  ShieldCheck,
  Globe,
  AlertTriangle,
} from 'lucide-react';
import { NewsArticle, NewsCategory, WorkflowStatus } from './types';
import type { CmsLocale } from '../../data/CmsDataSource';
import type { NewsModuleData } from '../../data/EditorialContentDataSource';
import { NewsFormView } from './NewsFormView';
import { CmsButton, CmsIconButton } from '../../components/ui/CmsButton';
import { CmsPageHeader } from '../../components/ui/CmsPageHeader';
import { CmsTabs } from '../../components/ui/CmsTabs';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { ArticlePreviewModal } from './components/ArticlePreviewModal';
import { QuickEditModal } from './components/QuickEditModal';
import { ColumnSettingModal, ColumnVisibility, TableDensity } from './components/ColumnSettingModal';
import { VersionHistoryDrawer } from './components/VersionHistoryDrawer';
import { ActivityLogDrawer } from './components/ActivityLogDrawer';
import { CmsBulkActionBar } from '../../components/ui/CmsBulkActionBar';
import { CmsSelectionCheckbox } from '../../components/ui/CmsSelectionCheckbox';
import { CmsListFooter } from '../../components/ui/CmsPagination';

type ViewScopeTab = 'all' | 'my_work' | 'pending' | 'scheduled' | 'trash';

interface NewsManagerProps {
  workspaceLocale: CmsLocale;
  data?: NewsModuleData;
}

export const NewsManager: React.FC<NewsManagerProps> = ({ workspaceLocale, data }) => {
  // Articles State
  const [articles, setArticles] = useState<NewsArticle[]>(data?.articles ?? []);
  const [categories] = useState<NewsCategory[]>(data?.categories ?? []);

  // View Mode: 'list' or 'form'
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);

  // Scope Tabs
  const [activeScopeTab, setActiveScopeTab] = useState<ViewScopeTab>('all');
  const [myWorkSubFilter, setMyWorkSubFilter] = useState<'all' | 'draft' | 'returned' | 'assigned'>('all');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [workflowFilter, setWorkflowFilter] = useState<string>('ALL');

  // Saved Views Quick Filter
  const [activeSavedView, setActiveSavedView] = useState<string | null>(null);

  // Selection for Batch Operations
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals & Drawers
  const [previewArticle, setPreviewArticle] = useState<NewsArticle | null>(null);
  const [quickEditArticle, setQuickEditArticle] = useState<NewsArticle | null>(null);
  const [versionDrawerArticle, setVersionDrawerArticle] = useState<NewsArticle | null>(null);
  const [activityDrawerArticle, setActivityDrawerArticle] = useState<NewsArticle | null>(null);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);

  // Table Density & Column Visibility
  const [tableDensity, setTableDensity] = useState<TableDensity>('normal');
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    category: true,
    author: true,
    status: true,
    publish_time: true,
    updated_time: true,
    actions: true,
  });

  // Delete / Trash Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState<NewsArticle[]>([]);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Scope Filtered Articles
  const scopeFilteredArticles = useMemo(() => {
    return articles.filter((item) => {
      if (activeScopeTab === 'trash') return Boolean(item.in_trash);
      if (item.in_trash) return false;

      if (activeScopeTab === 'my_work') {
        const isMyArticle = item.author?.name?.includes('Nam') || item.assignee?.name?.includes('Nam');
        if (!isMyArticle) return false;
        if (myWorkSubFilter === 'draft') return item.workflow_status === 'draft';
        if (myWorkSubFilter === 'returned') return item.workflow_status === 'returned';
        return true;
      }

      if (activeScopeTab === 'pending') {
        return item.workflow_status === 'pending';
      }

      if (activeScopeTab === 'scheduled') {
        return item.workflow_status === 'scheduled';
      }

      return true;
    });
  }, [articles, activeScopeTab, myWorkSubFilter]);

  // Final Filtered List
  const filteredArticles = useMemo(() => {
    return scopeFilteredArticles.filter((item) => {
      // Search
      const matchSearch =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        item.alias.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        item.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase().trim()));

      // Category
      const matchCat = selectedCategory === 'ALL' || item.category_id === selectedCategory;

      // Workflow
      const matchWorkflow = workflowFilter === 'ALL' || item.workflow_status === workflowFilter;

      // Saved Views
      let matchSavedView = true;
      if (activeSavedView === 'mine') {
        matchSavedView = Boolean(item.author?.name?.includes('Nam'));
      } else if (activeSavedView === 'pending') {
        matchSavedView = item.workflow_status === 'pending';
      } else if (activeSavedView === 'scheduled') {
        matchSavedView = item.workflow_status === 'scheduled';
      }

      return matchSearch && matchCat && matchWorkflow && matchSavedView;
    });
  }, [scopeFilteredArticles, searchQuery, selectedCategory, workflowFilter, activeSavedView]);

  // Handle Select All
  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredArticles.length && filteredArticles.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredArticles.map((a) => a.id));
    }
  };

  const handleToggleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Toggle Hot
  const handleToggleHot = (id: string) => {
    setArticles((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const nextVal = !a.is_hot;
          showToast(nextVal ? `Đã gắn cờ Nổi bật cho bài viết!` : `Đã bỏ cờ Nổi bật bài viết!`);
          return { ...a, is_hot: nextVal };
        }
        return a;
      })
    );
  };

  // Move to Trash or Permanent Delete
  const handleMoveToTrash = (article: NewsArticle) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === article.id ? { ...a, in_trash: true, deleted_at: new Date().toISOString() } : a))
    );
    showToast(`Đã chuyển bài viết "${article.title}" vào thùng rác.`);
  };

  const handleRestoreFromTrash = (article: NewsArticle) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === article.id ? { ...a, in_trash: false, deleted_at: undefined } : a))
    );
    showToast(`Đã khôi phục bài viết "${article.title}" thành công!`);
  };

  const handleTriggerPermanentDelete = (article: NewsArticle) => {
    setItemsToDelete([article]);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmPermanentDelete = () => {
    const idsToRemove = itemsToDelete.map((i) => i.id);
    setArticles((prev) => prev.filter((a) => !idsToRemove.includes(a.id)));
    setSelectedIds((prev) => prev.filter((id) => !idsToRemove.includes(id)));
    showToast(`Đã xóa vĩnh viễn ${itemsToDelete.length} bài viết!`);
    setIsDeleteModalOpen(false);
    setItemsToDelete([]);
  };

  // Batch Workflow Update
  const handleBatchUpdateWorkflow = (targetStatus: WorkflowStatus) => {
    if (selectedIds.length === 0) return;
    setArticles((prev) =>
      prev.map((a) => (selectedIds.includes(a.id) ? { ...a, workflow_status: targetStatus, published: targetStatus === 'published' } : a))
    );
    showToast(`Đã chuyển ${selectedIds.length} bài viết sang trạng thái ${targetStatus}!`);
    setSelectedIds([]);
  };

  // Form Handlers
  const handleOpenCreateForm = () => {
    setEditingArticle(null);
    setViewMode('form');
  };

  const handleOpenEditForm = (article: NewsArticle) => {
    setEditingArticle(article);
    setViewMode('form');
  };

  const handleSaveArticleFromForm = (formData: Partial<NewsArticle>) => {
    if (editingArticle) {
      setArticles((prev) =>
        prev.map((a) =>
          a.id === editingArticle.id
            ? { ...a, ...formData, updated_time: new Date().toISOString().replace('T', ' ').substring(0, 19) }
            : a
        )
      );
      showToast(`Đã cập nhật bài viết thành công!`);
    } else {
      const newArticle: NewsArticle = {
        id: `news_${Date.now()}`,
        title: formData.title || 'Bài viết mới',
        alias: formData.alias || 'bai-viet-moi',
        category_id: formData.category_id || categories[0]?.id || 'cat_news_tech',
        summary: formData.summary || '',
        content: formData.content || '',
        image: formData.image || 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800&auto=format&fit=crop&q=80',
        video: formData.video || '',
        tags: formData.tags || [],
        news_related: formData.news_related || [],
        products_related: formData.products_related || [],
        start_time: formData.start_time || new Date().toISOString().substring(0, 16),
        end_time: formData.end_time || '2026-12-31T23:59',
        workflow_status: formData.workflow_status || 'draft',
        published: formData.workflow_status === 'published',
        is_hot: formData.is_hot ?? false,
        is_new: formData.is_new ?? true,
        show_in_homepage: formData.show_in_homepage ?? true,
        ordering: formData.ordering || 1,
        seo_title: formData.seo_title || formData.title || '',
        seo_keyword: formData.seo_keyword || '',
        seo_description: formData.seo_description || formData.summary || '',
        created_time: new Date().toISOString().replace('T', ' ').substring(0, 19),
        author: { name: 'Nguyễn Văn Nam' },
        working_version_number: 1,
      };
      setArticles([newArticle, ...articles]);
      showToast(`Đã thêm bài viết mới thành công!`);
    }
    setViewMode('list');
    setEditingArticle(null);
  };

  const getCategoryName = (catId: string) => {
    const found = categories.find((c) => c.id === catId);
    return found ? found.name : 'Khác';
  };

  const getRowPadding = () => {
    if (tableDensity === 'compact') return 'p-2';
    if (tableDensity === 'spacious') return 'p-4';
    return 'p-3';
  };

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
          <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {viewMode === 'form' ? (
        <NewsFormView
          articleToEdit={editingArticle}
          categories={categories}
          relatedArticles={data?.articles ?? []}
          relatedProducts={data?.relatedProducts ?? []}
          onSave={handleSaveArticleFromForm}
          onCancel={() => {
            setViewMode('list');
            setEditingArticle(null);
          }}
        />
      ) : (
        <>
          {/* HEADER BAR */}
          <CmsPageHeader
            icon={<Newspaper />}
            title="Tin tức"
            description="Tạo, biên tập, duyệt, lên lịch xuất bản và lưu trữ bài viết công khai."
            meta={<span className="rounded-md bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">{articles.filter((article) => !article.in_trash).length} tin bài</span>}
            actions={<CmsButton
              onClick={handleOpenCreateForm}
              variant="primary"
              size="sm"
              leadingIcon={<Plus />}
            >
              Thêm tin tức
            </CmsButton>}
          />

          {/* VIEW SCOPE NAVIGATION TABS */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CmsTabs
              ariaLabel="Phân loại bài viết"
              value={activeScopeTab}
              onChange={(tab) => {
                setActiveScopeTab(tab as any);
                setActiveSavedView(null);
              }}
              items={[
                { id: 'all', label: 'Tất cả bài viết', count: articles.filter((a) => !a.in_trash).length },
                { id: 'my_work', label: 'Việc của tôi', count: articles.filter((a) => !a.in_trash && (a.author?.name?.includes('Minh') || a.author?.name?.includes('Editor'))).length },
                { id: 'pending', label: 'Hàng chờ duyệt', count: articles.filter((a) => !a.in_trash && a.workflow_status === 'pending').length },
                { id: 'scheduled', label: 'Lịch xuất bản', count: articles.filter((a) => !a.in_trash && a.workflow_status === 'scheduled').length },
                { id: 'trash', label: 'Lưu trữ & thùng rác', count: articles.filter((a) => a.in_trash).length },
              ]}
            />

            {/* Column Setting Trigger */}
            <button
              onClick={() => setIsColumnModalOpen(true)}
              className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Tùy chỉnh cột</span>
            </button>
          </div>

          {/* SAVED VIEWS QUICK PILLS */}
          <div className="flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-slate-400 font-bold flex items-center gap-1 shrink-0">
              <Bookmark className="w-3.5 h-3.5" /> Chế độ xem nhanh:
            </span>
            <button
              onClick={() => setActiveSavedView(activeSavedView === 'mine' ? null : 'mine')}
              className={`px-3 py-1 rounded-xl font-semibold border transition-all cursor-pointer shrink-0 ${
                activeSavedView === 'mine'
                  ? 'bg-orange-600 text-white border-orange-600'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-orange-500'
              }`}
            >
              Bài của tôi
            </button>
            <button
              onClick={() => setActiveSavedView(activeSavedView === 'pending' ? null : 'pending')}
              className={`px-3 py-1 rounded-xl font-semibold border transition-all cursor-pointer shrink-0 ${
                activeSavedView === 'pending'
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-amber-500'
              }`}
            >
              Chờ phê duyệt
            </button>
            <button
              onClick={() => setActiveSavedView(activeSavedView === 'scheduled' ? null : 'scheduled')}
              className={`px-3 py-1 rounded-xl font-semibold border transition-all cursor-pointer shrink-0 ${
                activeSavedView === 'scheduled'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-blue-500'
              }`}
            >
              Đã lên lịch xuất bản
            </button>
          </div>

          {/* SEARCH & FILTERS TOOLBAR */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-5 relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tiêu đề, alias, từ khóa tag..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="md:col-span-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                >
                  <option value="ALL">-- Tất cả Danh mục --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-3">
                <select
                  value={workflowFilter}
                  onChange={(e) => setWorkflowFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                >
                  <option value="ALL">-- Tất cả Trạng thái Quy trình --</option>
                  <option value="draft">Bản nháp (Draft)</option>
                  <option value="pending">Chờ duyệt (Pending)</option>
                  <option value="returned">Bị trả lại (Returned)</option>
                  <option value="approved">Đã duyệt (Approved)</option>
                  <option value="scheduled">Lên lịch (Scheduled)</option>
                  <option value="published">Đã xuất bản (Published)</option>
                  <option value="archived">Lưu trữ (Archived)</option>
                </select>
              </div>
            </div>

            {/* BULK ACTIONS BAR */}
            <CmsBulkActionBar
              selectedCount={selectedIds.length}
              itemLabel="bài viết"
              onClear={() => setSelectedIds([])}
              actions={[
                { label: 'Xuất bản', onClick: () => handleBatchUpdateWorkflow('published'), icon: Check, variant: 'primary' },
                { label: 'Chuyển về nháp', onClick: () => handleBatchUpdateWorkflow('draft'), icon: Edit },
              ]}
            />
          </div>

          {/* DATA TABLE */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xs overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="cms-data-table text-left">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <th className="p-3 w-10 text-center">
                      <CmsSelectionCheckbox
                        checked={filteredArticles.length > 0 && selectedIds.length === filteredArticles.length}
                        indeterminate={selectedIds.length > 0 && selectedIds.length < filteredArticles.length}
                        onChange={handleToggleSelectAll}
                        label="Chọn tất cả bài viết"
                      />
                    </th>
                    <th className="p-3 min-w-[280px]">Bài viết & Cảnh báo</th>
                    {columnVisibility.category && <th className="p-3 min-w-[140px]">Danh mục</th>}
                    {columnVisibility.author && <th className="p-3 min-w-[140px]">Tác giả & Phụ trách</th>}
                    {columnVisibility.status && <th className="p-3 min-w-[120px] text-center">Trạng thái</th>}
                    {columnVisibility.publish_time && <th className="p-3 min-w-[140px]">Xuất bản / Lịch</th>}
                    {columnVisibility.updated_time && <th className="p-3 min-w-[120px]">Cập nhật</th>}
                    {columnVisibility.actions && <th className="p-3 w-32 text-right sticky right-0 bg-slate-50 dark:bg-slate-800">Thao tác</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                  {filteredArticles.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="p-12 text-center text-slate-400">
                        <Newspaper className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="font-semibold">Không tìm thấy bài viết tin tức nào.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredArticles.map((art) => {
                      const isSelected = selectedIds.includes(art.id);
                      return (
                        <tr
                          key={art.id}
                          className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                            isSelected ? 'bg-orange-50/40 dark:bg-orange-950/20' : ''
                          }`}
                        >
                          {/* Checkbox */}
                          <td className={`p-3 text-center ${getRowPadding()}`}>
                            <CmsSelectionCheckbox checked={isSelected} onChange={() => handleToggleSelectRow(art.id)} label={`Chọn bài viết ${art.title}`} />
                          </td>

                          {/* Article Title & Warnings */}
                          <td className={`p-3 ${getRowPadding()}`}>
                            <div className="flex items-start gap-3">
                              {art.image && (
                                <img
                                  src={art.image}
                                  alt=""
                                  className="w-12 h-9 rounded-lg object-cover shrink-0 border border-slate-200 dark:border-slate-700 mt-0.5"
                                />
                              )}
                              <div className="space-y-0.5 max-w-md">
                                <div className="flex items-center gap-2">
                                  <span
                                    onClick={() => handleOpenEditForm(art)}
                                    className="font-bold text-slate-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 cursor-pointer line-clamp-2 leading-snug"
                                  >
                                    {art.title}
                                  </span>
                                </div>
                                <p className="text-[11px] font-mono text-slate-400 truncate">/{art.alias}</p>

                                {/* Quality Warnings */}
                                {art.quality_warnings && art.quality_warnings.length > 0 && (
                                  <div className="pt-0.5 flex flex-wrap gap-1">
                                    {art.quality_warnings.map((w, idx) => (
                                      <span
                                        key={idx}
                                        className="px-2 py-0.5 bg-amber-500/10 text-amber-700 dark:text-amber-400 font-medium text-[10px] rounded-md flex items-center gap-1"
                                      >
                                        <AlertTriangle className="w-3 h-3 text-amber-500" />
                                        <span>{w}</span>
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          {columnVisibility.category && (
                            <td className={`p-3 ${getRowPadding()}`}>
                              <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px] rounded-lg border border-slate-200 dark:border-slate-700">
                                {getCategoryName(art.category_id)}
                              </span>
                            </td>
                          )}

                          {/* Author & Assignee */}
                          {columnVisibility.author && (
                            <td className={`p-3 ${getRowPadding()}`}>
                              <div className="space-y-0.5 text-xs">
                                <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                                  <User className="w-3 h-3 text-slate-400" />
                                  <span>{art.author?.name || 'Nguyễn Văn Nam'}</span>
                                </p>
                                {art.assignee && (
                                  <p className="text-[10px] text-slate-400">
                                    Giao: {art.assignee.name}
                                  </p>
                                )}
                              </div>
                            </td>
                          )}

                          {/* Workflow Status Badge */}
                          {columnVisibility.status && (
                            <td className={`p-3 text-center ${getRowPadding()}`}>
                              <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-full ${
                                art.workflow_status === 'published' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' :
                                art.workflow_status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400' :
                                art.workflow_status === 'returned' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400' :
                                art.workflow_status === 'scheduled' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400' :
                                'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                              }`}>
                                {art.workflow_status || 'draft'}
                              </span>
                            </td>
                          )}

                          {/* Publish / Scheduled Time */}
                          {columnVisibility.publish_time && (
                            <td className={`p-3 text-slate-500 font-mono text-[11px] ${getRowPadding()}`}>
                              {art.start_time || art.created_time}
                            </td>
                          )}

                          {/* Updated Time */}
                          {columnVisibility.updated_time && (
                            <td className={`p-3 text-slate-500 font-mono text-[11px] ${getRowPadding()}`}>
                              {art.updated_time || art.created_time}
                            </td>
                          )}

                          {/* Actions */}
                          {columnVisibility.actions && (
                            <td className={`p-3 text-right sticky right-0 bg-white dark:bg-slate-900 ${getRowPadding()}`}>
                              <div className="flex items-center justify-end gap-1">
                              <CmsIconButton
                                onClick={() => setPreviewArticle(art)}
                                icon={<Eye />}
                                size="sm"
                                aria-label="Xem trước tin tức"
                                title="Xem trước"
                              />

                              <CmsIconButton
                                onClick={() => setQuickEditArticle(art)}
                                icon={<Sparkles />}
                                size="sm"
                                aria-label="Sửa nhanh tin tức"
                                title="Sửa nhanh"
                              />

                              <CmsIconButton
                                onClick={() => handleOpenEditForm(art)}
                                icon={<Edit />}
                                size="sm"
                                aria-label="Chỉnh sửa tin tức"
                                title="Chỉnh sửa toàn bộ"
                              />

                              {art.in_trash ? (
                                <CmsIconButton
                                  onClick={() => handleRestoreFromTrash(art)}
                                  icon={<RotateCcw />}
                                  size="sm"
                                  aria-label="Khôi phục tin tức"
                                  title="Khôi phục"
                                />
                              ) : (
                                <CmsIconButton
                                  onClick={() => handleMoveToTrash(art)}
                                  icon={<Trash2 />}
                                  size="sm"
                                  variant="danger"
                                  aria-label="Chuyển tin tức vào thùng rác"
                                  title="Chuyển vào thùng rác"
                                />
                              )}
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <CmsListFooter visibleCount={filteredArticles.length} totalCount={articles.length} itemLabel="bài viết" />
          </div>
        </>
      )}

      {/* MODALS & OVERLAYS */}
      <ArticlePreviewModal
        isOpen={Boolean(previewArticle)}
        article={previewArticle}
        onClose={() => setPreviewArticle(null)}
      />

      <QuickEditModal
        isOpen={Boolean(quickEditArticle)}
        article={quickEditArticle}
        categories={categories}
        onClose={() => setQuickEditArticle(null)}
        onSave={(updated) => {
          setArticles((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
          showToast(`Đã cập nhật nhanh bài viết "${updated.title}"!`);
        }}
      />

      <ColumnSettingModal
        isOpen={isColumnModalOpen}
        visibility={columnVisibility}
        density={tableDensity}
        onClose={() => setIsColumnModalOpen(false)}
        onToggleColumn={(key) =>
          setColumnVisibility((prev) => ({ ...prev, [key]: !prev[key] }))
        }
        onChangeDensity={setTableDensity}
        onReset={() => {
          setTableDensity('normal');
          setColumnVisibility({
            category: true,
            author: true,
            status: true,
            publish_time: true,
            updated_time: true,
            actions: true,
          });
        }}
      />

      <VersionHistoryDrawer
        isOpen={Boolean(versionDrawerArticle)}
        article={versionDrawerArticle}
        onClose={() => setVersionDrawerArticle(null)}
        onRestoreVersion={(ver) => {
          showToast(`Đã khôi phục phiên bản v${ver.version_number}!`);
          setVersionDrawerArticle(null);
        }}
      />

      <ActivityLogDrawer
        isOpen={Boolean(activityDrawerArticle)}
        article={activityDrawerArticle}
        onClose={() => setActivityDrawerArticle(null)}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        itemsToDelete={itemsToDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setItemsToDelete([]);
        }}
        onConfirm={handleConfirmPermanentDelete}
      />
    </div>
  );
};
