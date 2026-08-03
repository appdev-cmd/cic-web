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
} from 'lucide-react';
import { StaticPage, StaticPageCategory } from './types';
import { staticPagesMock, staticPageCategoriesMock } from './mockData';
import { StaticPageFormView } from './StaticPageFormView';
import { DeleteConfirmModal } from './DeleteConfirmModal';

export const StaticPagesManager: React.FC = () => {
  // State
  const [pages, setPages] = useState<StaticPage[]>(staticPagesMock);
  const [categories] = useState<StaticPageCategory[]>(staticPageCategoriesMock);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'hidden'>('all');

  // Form Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [pageToEdit, setPageToEdit] = useState<StaticPage | null>(null);

  // Delete Confirm Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState<StaticPage[]>([]);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1. Filtered Static Pages
  const filteredPages = useMemo(() => {
    return pages.filter((page) => {
      // Search by title
      const query = searchQuery.toLowerCase().trim();
      const matchSearch = !query || page.title.toLowerCase().includes(query) || page.alias.toLowerCase().includes(query);

      // Filter by Category
      const matchCategory = selectedCategoryId === 'all' || page.category_id === selectedCategoryId;

      // Filter by Published status
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'published' && page.published) ||
        (statusFilter === 'hidden' && !page.published);

      return matchSearch && matchCategory && matchStatus;
    });
  }, [pages, searchQuery, selectedCategoryId, statusFilter]);

  // Map category ID to Category Name
  const getCategoryName = (catId: string) => {
    const found = categories.find((c) => c.id === catId);
    return found ? found.name : catId;
  };

  // 2. Refresh Handler
  const handleRefresh = () => {
    showToast('Đã làm mới danh sách trang tĩnh!');
  };

  // 3. Selection Handlers
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

  // 4. Toggle Published direct on list item
  const handleTogglePublished = (id: string, currentStatus: boolean) => {
    setPages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, published: !currentStatus } : p))
    );
    showToast(`Đã ${!currentStatus ? 'Xuất bản' : 'Ẩn'} trang tĩnh!`);
  };

  // 5. Batch Toggle Published / Hide
  const handleBatchTogglePublished = (targetStatus: boolean) => {
    if (selectedIds.length === 0) return;
    setPages((prev) =>
      prev.map((p) => (selectedIds.includes(p.id) ? { ...p, published: targetStatus } : p))
    );
    showToast(
      `Đã ${targetStatus ? 'Xuất bản' : 'Ẩn'} ${selectedIds.length} trang tĩnh được chọn!`
    );
  };

  // 6. Delete Handlers
  const handleTriggerSingleDelete = (page: StaticPage) => {
    setItemsToDelete([page]);
    setIsDeleteModalOpen(true);
  };

  const handleTriggerBatchDelete = () => {
    if (selectedIds.length === 0) return;
    const selectedPages = pages.filter((p) => selectedIds.includes(p.id));
    setItemsToDelete(selectedPages);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    const idsToRemove = itemsToDelete.map((i) => i.id);
    setPages((prev) => prev.filter((p) => !idsToRemove.includes(p.id)));
    setSelectedIds((prev) => prev.filter((id) => !idsToRemove.includes(id)));
    setIsDeleteModalOpen(false);
    showToast(`Đã xóa thành công ${idsToRemove.length} trang tĩnh!`);
  };

  // 7. Form Save Handler (Add / Edit)
  const handleSavePage = (pageData: Partial<StaticPage>) => {
    if (pageToEdit) {
      // Edit existing
      setPages((prev) =>
        prev.map((p) =>
          p.id === pageToEdit.id
            ? {
                ...p,
                ...pageData,
                updated_time: new Date().toISOString().replace('T', ' ').substring(0, 19),
              } as StaticPage
            : p
        )
      );
      showToast(`Đã cập nhật trang tĩnh "${pageData.title}"!`);
    } else {
      // Create new
      const newPage: StaticPage = {
        id: `page_${Date.now().toString().slice(-4)}`,
        title: pageData.title || 'Trang tĩnh mới',
        alias: pageData.alias || 'trang-tinh-moi',
        category_id: pageData.category_id || categories[0]?.id || '',
        summary: pageData.summary || '',
        content: pageData.content || '',
        image:
          pageData.image ||
          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
        tags: pageData.tags || [],
        show_in_homepage: pageData.show_in_homepage ?? false,
        published: pageData.published ?? true,
        ordering: pageData.ordering || pages.length + 1,
        seo_title: pageData.seo_title || pageData.title || '',
        seo_keyword: pageData.seo_keyword || '',
        seo_description: pageData.seo_description || pageData.summary || '',
        created_time: new Date().toISOString().replace('T', ' ').substring(0, 19),
      };
      setPages([newPage, ...pages]);
      showToast(`Đã thêm mới trang tĩnh "${newPage.title}"!`);
    }
    setIsFormOpen(false);
    setPageToEdit(null);
  };

  if (isFormOpen) {
    return (
      <StaticPageFormView
        pageToEdit={pageToEdit}
        categories={categories}
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

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Quản lý Trang tĩnh
            </h1>
            <span className="px-2.5 py-0.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold rounded-full">
              {pages.length} trang
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Quản lý các trang thông tin giới thiệu, chính sách pháp lý, quy trình tư vấn và hướng dẫn dịch vụ.
          </p>
        </div>

        {/* Top Right Action Button */}
        <button
          onClick={() => {
            setPageToEdit(null);
            setIsFormOpen(true);
          }}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm trang tĩnh mới</span>
        </button>
      </div>

      {/* TOOLBAR (Search, Filters & Batch Actions) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Ô tìm kiếm theo tiêu đề */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm trang tĩnh theo tiêu đề hoặc alias..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Bộ lọc chọn Danh mục */}
          <div className="md:col-span-4 relative">
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="all">-- Tất cả Danh mục ({categories.length}) --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Bộ lọc trạng thái */}
          <div className="md:col-span-3 flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
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
            <span>Hiển thị: <strong>{filteredPages.length}</strong> / {pages.length} bản ghi</span>
            {selectedIds.length > 0 && (
              <span className="px-2 py-0.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold rounded-lg">
                Đã chọn: {selectedIds.length} dòng
              </span>
            )}
          </div>

          {/* Batch Action buttons - Only show when items are selected */}
          {selectedIds.length > 0 && (
            <div className="flex items-center flex-wrap gap-2">
              <button
                onClick={() => handleBatchTogglePublished(true)}
                className="px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Xuất bản ({selectedIds.length})</span>
              </button>

              <button
                onClick={() => handleBatchTogglePublished(false)}
                className="px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 hover:bg-amber-100"
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span>Ẩn ({selectedIds.length})</span>
              </button>

              <button
                onClick={handleTriggerBatchDelete}
                className="px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-800 hover:bg-red-100"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa ({selectedIds.length})</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* DATA TABLE DISPLAY */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4 w-10 text-center">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {filteredPages.length > 0 && selectedIds.length === filteredPages.length ? (
                      <CheckSquare className="w-4 h-4 text-orange-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-4 min-w-[280px]">Tiêu đề (title)</th>
                <th className="py-3 px-4 min-w-[150px]">Danh mục (category_id)</th>
                <th className="py-3 px-4 min-w-[130px] text-center">Trạng thái (published)</th>
                <th className="py-3 px-4 min-w-[150px]">Ngày tạo (created_time)</th>
                <th className="py-3 px-4 min-w-[110px] text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
              {filteredPages.length > 0 ? (
                filteredPages.map((page) => {
                  const isSelected = selectedIds.includes(page.id);

                  return (
                    <tr
                      key={page.id}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors ${
                        isSelected ? 'bg-orange-50/40 dark:bg-orange-950/20' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleSelectOne(page.id)}
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-orange-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Tiêu đề (title) & Detail Preview */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-start gap-3">
                          <img
                            src={page.image}
                            alt={page.title}
                            className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800"
                          />
                          <div className="space-y-1">
                            <a
                              onClick={() => {
                                setPageToEdit(page);
                                setIsFormOpen(true);
                              }}
                              className="font-bold text-slate-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 line-clamp-2 transition-colors cursor-pointer"
                            >
                              {page.title}
                            </a>

                            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                              <span className="text-slate-500">/{page.alias}</span>
                              {page.show_in_homepage && (
                                <span className="px-1.5 py-0.2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-sans font-bold text-[10px] rounded flex items-center gap-0.5">
                                  <Home className="w-2.5 h-2.5 text-slate-400" />
                                  Trang chủ
                                </span>
                              )}
                              <span className="text-slate-400 font-sans">
                                • Thứ tự: <strong>#{page.ordering}</strong>
                              </span>
                            </div>

                            {page.tags && page.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 pt-0.5">
                                {page.tags.map((t, idx) => (
                                  <span
                                    key={idx}
                                    className="px-1.5 py-0.2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] rounded"
                                  >
                                    #{t}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Danh mục (category_id) */}
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-lg border border-slate-200 dark:border-slate-700 inline-block text-[11px]">
                          {getCategoryName(page.category_id)}
                        </span>
                      </td>

                      {/* Trạng thái (published) - TOGGLE DIRECTLY ON LIST */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleTogglePublished(page.id, page.published)}
                            title={page.published ? 'Bấm để Ẩn trang tĩnh' : 'Bấm để Xuất bản trang tĩnh'}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              page.published ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                                page.published ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                          <span
                            className={`text-[11px] font-bold ${
                              page.published ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
                            }`}
                          >
                            {page.published ? 'Xuất bản' : 'Ẩn'}
                          </span>
                        </div>
                      </td>

                      {/* Ngày tạo (created_time) */}
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                        <div>{page.created_time}</div>
                        {page.updated_time && (
                          <div className="text-[10px] text-slate-400 font-sans italic">
                            Sửa: {page.updated_time.split(' ')[0]}
                          </div>
                        )}
                      </td>

                      {/* Action buttons: Sửa, Xóa */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Nút Sửa */}
                          <button
                            onClick={() => {
                              setPageToEdit(page);
                              setIsFormOpen(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/40 rounded-lg transition-colors cursor-pointer"
                            title="Chỉnh sửa trang tĩnh"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Nút Xóa */}
                          <button
                            onClick={() => handleTriggerSingleDelete(page)}
                            className="p-1.5 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                            title="Xóa trang tĩnh này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 space-y-2">
                    <FileText className="w-10 h-10 mx-auto opacity-40" />
                    <p className="text-sm font-medium">Không tìm thấy trang tĩnh nào phù hợp</p>
                    <p className="text-xs text-slate-400">
                      Hãy thử thay đổi từ khóa tìm kiếm hoặc bỏ bộ lọc.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>Tổng số: <strong>{filteredPages.length}</strong> trang tĩnh</span>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <span>Mẹo: Bạn có thể bật tắt Xuất bản/Ẩn trực tiếp trên công tắc ở danh sách</span>
          </div>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        itemsToDelete={itemsToDelete}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
