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
} from 'lucide-react';
import { NewsArticle, NewsCategory } from './types';
import { mockArticles, mockNewsCategories } from './mockData';
import { NewsFormView } from './NewsFormView';
import { DeleteConfirmModal } from './DeleteConfirmModal';

export const NewsManager: React.FC = () => {
  // Articles Data State
  const [articles, setArticles] = useState<NewsArticle[]>(mockArticles);
  const [categories] = useState<NewsCategory[]>(mockNewsCategories);

  // View Mode: 'list' or 'form'
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'hidden'>('all');

  // Row Selection State for Batch Operations
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState<NewsArticle[]>([]);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRefresh = () => {
    showToast('Đã làm mới danh sách tin tức & bài viết!');
  };

  // Filtered Articles List
  const filteredArticles = useMemo(() => {
    return articles.filter((item) => {
      const matchQuery =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        item.alias.toLowerCase().includes(searchQuery.toLowerCase().trim());

      const matchCategory =
        selectedCategory === 'ALL' || item.category_id === selectedCategory;

      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'published' && item.published) ||
        (statusFilter === 'hidden' && !item.published);

      return matchQuery && matchCategory && matchStatus;
    });
  }, [articles, searchQuery, selectedCategory, statusFilter]);

  // Handle Single Checkbox Toggle
  const handleToggleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Handle Select All Rows
  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredArticles.length && filteredArticles.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredArticles.map((a) => a.id));
    }
  };

  // Direct Toggle Published
  const handleTogglePublished = (id: string) => {
    setArticles((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const nextVal = !a.published;
          showToast(
            nextVal ? `Đã xuất bản bài viết "${a.title}"` : `Đã chuyển bài viết "${a.title}" về bản nháp`
          );
          return { ...a, published: nextVal };
        }
        return a;
      })
    );
  };

  // Direct Toggle Is Hot
  const handleToggleHot = (id: string) => {
    setArticles((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const nextVal = !a.is_hot;
          showToast(
            nextVal ? `Đã đánh dấu Nổi bật cho "${a.title}"` : `Đã bỏ Nổi bật bài viết "${a.title}"`
          );
          return { ...a, is_hot: nextVal };
        }
        return a;
      })
    );
  };

  // Batch Publish Toggle (Batch Xuất bản / Ẩn)
  const handleBatchSetPublished = (publishedState: boolean) => {
    if (selectedIds.length === 0) return;
    setArticles((prev) =>
      prev.map((a) => (selectedIds.includes(a.id) ? { ...a, published: publishedState } : a))
    );
    showToast(
      publishedState
        ? `Đã xuất bản ${selectedIds.length} bài viết đã chọn!`
        : `Đã chuyển ${selectedIds.length} bài viết về bản nháp!`
    );
    setSelectedIds([]);
  };

  // Single Delete Trigger
  const handleTriggerDeleteSingle = (article: NewsArticle) => {
    setItemsToDelete([article]);
    setIsDeleteModalOpen(true);
  };

  // Batch Delete Trigger
  const handleTriggerDeleteBatch = () => {
    if (selectedIds.length === 0) return;
    const items = articles.filter((a) => selectedIds.includes(a.id));
    setItemsToDelete(items);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    const idsToRemove = itemsToDelete.map((i) => i.id);
    setArticles((prev) => prev.filter((a) => !idsToRemove.includes(a.id)));
    setSelectedIds((prev) => prev.filter((id) => !idsToRemove.includes(id)));
    showToast(`Đã xóa thành công ${itemsToDelete.length} bài viết!`);
    setIsDeleteModalOpen(false);
    setItemsToDelete([]);
  };

  // Open Form for Create
  const handleOpenCreateForm = () => {
    setEditingArticle(null);
    setViewMode('form');
  };

  // Open Form for Edit
  const handleOpenEditForm = (article: NewsArticle) => {
    setEditingArticle(article);
    setViewMode('form');
  };

  // Save Article (Create or Update)
  const handleSaveArticle = (formData: Partial<NewsArticle>) => {
    if (editingArticle) {
      // Update existing
      setArticles((prev) =>
        prev.map((a) =>
          a.id === editingArticle.id
            ? {
                ...a,
                ...formData,
                updated_time: new Date().toISOString().replace('T', ' ').substring(0, 19),
              }
            : a
        )
      );
      showToast(`Đã cập nhật bài viết "${formData.title}" thành công!`);
    } else {
      // Create new
      const newArticle: NewsArticle = {
        id: `news_${Date.now()}`,
        title: formData.title || 'Bài viết mới',
        alias: formData.alias || 'bai-viet-moi',
        category_id: formData.category_id || categories[0]?.id || 'cat_news_tech',
        summary: formData.summary || '',
        content: formData.content || '',
        image:
          formData.image ||
          'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800&auto=format&fit=crop&q=80',
        video: formData.video || '',
        tags: formData.tags || [],
        news_related: formData.news_related || [],
        products_related: formData.products_related || [],
        start_time: formData.start_time || new Date().toISOString().substring(0, 16),
        end_time: formData.end_time || '2026-12-31T23:59',
        is_hot: formData.is_hot ?? false,
        is_new: formData.is_new ?? true,
        show_in_homepage: formData.show_in_homepage ?? true,
        published: formData.published ?? true,
        ordering: formData.ordering || 1,
        seo_title: formData.seo_title || formData.title || '',
        seo_keyword: formData.seo_keyword || '',
        seo_description: formData.seo_description || formData.summary || '',
        created_time: new Date().toISOString().replace('T', ' ').substring(0, 19),
      };

      setArticles([newArticle, ...articles]);
      showToast(`Đã thêm bài viết mới "${newArticle.title}"!`);
    }

    setViewMode('list');
    setEditingArticle(null);
  };

  // Helper to get Category Name
  const getCategoryName = (catId: string) => {
    const found = categories.find((c) => c.id === catId);
    return found ? found.name : 'Khác';
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-3 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
          <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* RENDER FORM VIEW OR LIST VIEW */}
      {viewMode === 'form' ? (
        <NewsFormView
          articleToEdit={editingArticle}
          categories={categories}
          onSave={handleSaveArticle}
          onCancel={() => {
            setViewMode('list');
            setEditingArticle(null);
          }}
        />
      ) : (
        <>
          {/* HEADER BAR */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
                  <Newspaper className="w-5 h-5" />
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  Quản lý Tin tức & Bài viết
                </h1>
                <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full">
                  {articles.length} bài viết
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Quản lý danh sách tin tức chuyên ngành, bài viết kỹ thuật và thông tin doanh nghiệp CIC Technology.
              </p>
            </div>

            {/* Top Right Action Button */}
            <button
              onClick={handleOpenCreateForm}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm tin tức mới</span>
            </button>
          </div>

          {/* TOOLBAR (Search, Filters & Batch Actions) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* Search input */}
              <div className="md:col-span-5 relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết theo tiêu đề hoặc alias..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Category filter dropdown */}
              <div className="md:col-span-4 relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="ALL">-- Tất cả Danh mục ({categories.length}) --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status filter dropdown */}
              <div className="md:col-span-3 flex items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="published">Đã xuất bản</option>
                  <option value="hidden">Đang ẩn (Nháp)</option>
                </select>

                <button
                  onClick={handleRefresh}
                  className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-medium cursor-pointer shrink-0"
                  title="Làm mới danh sách"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Batch Action Toolbar Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2 font-medium text-slate-600 dark:text-slate-400">
                <span>Hiển thị: <strong>{filteredArticles.length}</strong> / {articles.length} bài viết</span>
                {selectedIds.length > 0 && (
                  <span className="px-2 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold rounded-lg">
                    Đã chọn: {selectedIds.length} dòng
                  </span>
                )}
              </div>

              {/* Batch Action buttons */}
              <div className="flex items-center flex-wrap gap-2">
                <button
                  disabled={selectedIds.length === 0}
                  onClick={() => handleBatchSetPublished(true)}
                  className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    selectedIds.length > 0
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 cursor-not-allowed'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Xuất bản ({selectedIds.length})</span>
                </button>

                <button
                  disabled={selectedIds.length === 0}
                  onClick={() => handleBatchSetPublished(false)}
                  className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    selectedIds.length > 0
                      ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 hover:bg-amber-100'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 cursor-not-allowed'
                  }`}
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Ẩn ({selectedIds.length})</span>
                </button>

                <button
                  disabled={selectedIds.length === 0}
                  onClick={handleTriggerDeleteBatch}
                  className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    selectedIds.length > 0
                      ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-800 hover:bg-red-100'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 cursor-not-allowed'
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa ({selectedIds.length})</span>
                </button>

                <button
                  onClick={handleOpenCreateForm}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm mới</span>
                </button>
              </div>
            </div>
          </div>

          {/* TABLE LIST */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {/* Checkbox Header */}
                    <th className="p-3.5 w-10 text-center">
                      <button
                        onClick={handleToggleSelectAll}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      >
                        {selectedIds.length === filteredArticles.length && filteredArticles.length > 0 ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </th>
                    <th className="p-3.5 min-w-[280px]">Tiêu đề bài viết</th>
                    <th className="p-3.5 w-48">Danh mục</th>
                    <th className="p-3.5 w-24 text-center">Nổi bật</th>
                    <th className="p-3.5 w-32 text-center">Trạng thái</th>
                    <th className="p-3.5 w-40">Ngày tạo</th>
                    <th className="p-3.5 w-24 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                  {filteredArticles.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-12 text-center text-slate-400">
                        <Newspaper className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="font-semibold">Không tìm thấy bài viết tin tức phù hợp.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredArticles.map((art) => {
                      const isSelected = selectedIds.includes(art.id);
                      return (
                        <tr
                          key={art.id}
                          className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                            isSelected ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                          }`}
                        >
                          {/* Checkbox */}
                          <td className="p-3.5 text-center">
                            <button
                              onClick={() => handleToggleSelectRow(art.id)}
                              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                            >
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-blue-600" />
                              ) : (
                                <Square className="w-4 h-4" />
                              )}
                            </button>
                          </td>

                          {/* Tiêu đề (bold + alias underneath) */}
                          <td className="p-3.5">
                            <div className="flex items-start gap-3">
                              {art.image && (
                                <img
                                  src={art.image}
                                  alt=""
                                  className="w-12 h-9 rounded-lg object-cover shrink-0 border border-slate-200 dark:border-slate-700 mt-0.5"
                                />
                              )}
                              <div className="space-y-0.5 max-w-lg">
                                <p
                                  onClick={() => handleOpenEditForm(art)}
                                  className="font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors leading-snug line-clamp-2"
                                >
                                  {art.title}
                                </p>
                                <p className="text-[11px] font-mono text-slate-400 truncate">
                                  /{art.alias}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Danh mục (Grey Badge) */}
                          <td className="p-3.5">
                            <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px] rounded-lg border border-slate-200/80 dark:border-slate-700/80">
                              {getCategoryName(art.category_id)}
                            </span>
                          </td>

                          {/* Nổi bật (Gold Star Icon toggle) */}
                          <td className="p-3.5 text-center">
                            <button
                              onClick={() => handleToggleHot(art.id)}
                              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                              title={art.is_hot ? 'Bỏ nổi bật' : 'Đánh dấu nổi bật'}
                            >
                              <Star
                                className={`w-4 h-4 mx-auto ${
                                  art.is_hot
                                    ? 'fill-amber-400 text-amber-500'
                                    : 'text-slate-300 dark:text-slate-600'
                                }`}
                              />
                            </button>
                          </td>

                          {/* Trạng thái (Direct Toggle Switch) */}
                          <td className="p-3.5 text-center">
                            <button
                              onClick={() => handleTogglePublished(art.id)}
                              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                art.published ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                              }`}
                              title={art.published ? 'Bài viết đang xuất bản' : 'Bài viết dạng nháp'}
                            >
                              <span
                                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                  art.published ? 'translate-x-4' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </td>

                          {/* Ngày tạo */}
                          <td className="p-3.5 text-slate-500 font-mono text-[11px]">
                            {art.created_time}
                          </td>

                          {/* Nút Sửa & Single Delete */}
                          <td className="p-3.5 text-right space-x-1">
                            <button
                              onClick={() => handleOpenEditForm(art)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-colors cursor-pointer"
                              title="Chỉnh sửa tin tức"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleTriggerDeleteSingle(art)}
                              className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors cursor-pointer"
                              title="Xóa bài viết"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        itemsToDelete={itemsToDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setItemsToDelete([]);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
