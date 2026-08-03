import React, { useState, useMemo } from 'react';
import {
  Grid,
  Plus,
  Search,
  Filter,
  Trash2,
  Eye,
  EyeOff,
  Edit,
  Check,
  RefreshCw,
  CheckSquare,
  Square,
  Maximize2,
  DollarSign,
  Calendar,
  Layers,
  Link as LinkIcon,
} from 'lucide-react';
import { BannerCategory } from './types';
import { mockBannerCategories } from './mockData';
import { BannerCategoryDrawerForm } from './BannerCategoryDrawerForm';
import { DeleteConfirmModal } from './DeleteConfirmModal';

export const BannerCategoriesManager: React.FC = () => {
  // Banner Categories state
  const [categories, setCategories] = useState<BannerCategory[]>(mockBannerCategories);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'hidden'>('all');

  // Multi-select row state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Drawer Form state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BannerCategory | null>(null);

  // Delete Modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState<BannerCategory[]>([]);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRefresh = () => {
    showToast('Đã làm mới danh sách danh mục banner!');
  };

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return categories.filter((item) => {
      const matchQuery =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase().trim());

      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'published' && item.published) ||
        (statusFilter === 'hidden' && !item.published);

      return matchQuery && matchStatus;
    });
  }, [categories, searchQuery, statusFilter]);

  // Select Row Toggle
  const handleToggleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Select All Toggle
  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredCategories.length && filteredCategories.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCategories.map((c) => c.id));
    }
  };

  // Direct Toggle Published Switch
  const handleTogglePublished = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextVal = !c.published;
          showToast(
            nextVal
              ? `Đã kích hoạt xuất bản "${c.name}"`
              : `Đã tạm ẩn danh mục "${c.name}"`
          );
          return { ...c, published: nextVal };
        }
        return c;
      })
    );
  };

  // Batch Publish / Hide
  const handleBatchSetPublished = (publishedState: boolean) => {
    if (selectedIds.length === 0) return;
    setCategories((prev) =>
      prev.map((c) => (selectedIds.includes(c.id) ? { ...c, published: publishedState } : c))
    );
    showToast(
      publishedState
        ? `Đã xuất bản ${selectedIds.length} danh mục banner đã chọn!`
        : `Đã ẩn ${selectedIds.length} danh mục banner đã chọn!`
    );
    setSelectedIds([]);
  };

  // Trigger Single Delete
  const handleTriggerDeleteSingle = (cat: BannerCategory) => {
    setItemsToDelete([cat]);
    setIsDeleteModalOpen(true);
  };

  // Trigger Batch Delete
  const handleTriggerDeleteBatch = () => {
    if (selectedIds.length === 0) return;
    const items = categories.filter((c) => selectedIds.includes(c.id));
    setItemsToDelete(items);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    const idsToRemove = itemsToDelete.map((i) => i.id);
    setCategories((prev) => prev.filter((c) => !idsToRemove.includes(c.id)));
    setSelectedIds((prev) => prev.filter((id) => !idsToRemove.includes(id)));
    showToast(`Đã xóa thành công ${itemsToDelete.length} danh mục banner!`);
    setIsDeleteModalOpen(false);
    setItemsToDelete([]);
  };

  // Open Drawer Create
  const handleOpenCreateDrawer = () => {
    setEditingCategory(null);
    setIsDrawerOpen(true);
  };

  // Open Drawer Edit
  const handleOpenEditDrawer = (cat: BannerCategory) => {
    setEditingCategory(cat);
    setIsDrawerOpen(true);
  };

  // Save Category Handler
  const handleSaveCategory = (formData: Partial<BannerCategory>) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    if (editingCategory) {
      // Update existing
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id
            ? {
                ...c,
                ...formData,
                updated_time: nowStr,
              }
            : c
        )
      );
      showToast(`Đã cập nhật danh mục banner "${formData.name}"!`);
    } else {
      // Create new
      const newCat: BannerCategory = {
        id: `bcat_${Date.now()}`,
        name: formData.name || 'Danh mục banner mới',
        summary: formData.summary || '',
        width: formData.width || 300,
        height: formData.height || 250,
        price: formData.price || 0,
        days: formData.days || 30,
        quantity: formData.quantity || 1,
        link_post: formData.link_post || '',
        published: formData.published ?? true,
        ordering: formData.ordering || 1,
        created_time: nowStr,
      };

      setCategories([newCat, ...categories]);
      showToast(`Đã thêm mới danh mục banner "${newCat.name}"!`);
    }

    setIsDrawerOpen(false);
    setEditingCategory(null);
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

      {/* 1. HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl">
              <Grid className="w-5 h-5" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Quản lý Danh mục Banner
            </h1>
            <span className="px-2.5 py-0.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold rounded-full">
              {categories.length} vị trí
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Quản lý vị trí, kích thước chuẩn, đơn giá và số lượng banner cho phép đặt trên toàn hệ thống.
          </p>
        </div>

        {/* Top Action Button */}
        <button
          onClick={handleOpenCreateDrawer}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm danh mục mới</span>
        </button>
      </div>

      {/* 2. TOOLBAR (Search, Filters & Batch Actions) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search input */}
          <div className="md:col-span-7 relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm danh mục banner theo tên hoặc mô tả..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Status filter dropdown */}
          <div className="md:col-span-5 flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="published">Đã xuất bản</option>
              <option value="hidden">Đang ẩn</option>
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
            <span>
              Hiển thị: <strong>{filteredCategories.length}</strong> / {categories.length} danh mục
            </span>
            {selectedIds.length > 0 && (
              <span className="px-2 py-0.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold rounded-lg">
                Đã chọn: {selectedIds.length} dòng
              </span>
            )}
          </div>

          {/* Batch Action buttons - Only show when items selected */}
          {selectedIds.length > 0 && (
            <div className="flex items-center flex-wrap gap-2">
              <button
                onClick={() => handleBatchSetPublished(true)}
                className="px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Xuất bản ({selectedIds.length})</span>
              </button>

              <button
                onClick={() => handleBatchSetPublished(false)}
                className="px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 hover:bg-amber-100"
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span>Ẩn ({selectedIds.length})</span>
              </button>

              <button
                onClick={handleTriggerDeleteBatch}
                className="px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-800 hover:bg-red-100"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa ({selectedIds.length})</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. TABLE LIST (Bảng thường, cấu hình không dùng dạng lưới) */}
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
                    {selectedIds.length === filteredCategories.length && filteredCategories.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-orange-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="p-3.5 min-w-[280px]">Tên danh mục</th>
                <th className="p-3.5 w-44">Kích thước</th>
                <th className="p-3.5 w-44">Giá gói</th>
                <th className="p-3.5 w-32 text-center">Trạng thái</th>
                <th className="p-3.5 w-28 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400">
                    <Grid className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="font-semibold">Không tìm thấy danh mục banner phù hợp.</p>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => {
                  const isSelected = selectedIds.includes(cat.id);
                  return (
                    <tr
                      key={cat.id}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                        isSelected ? 'bg-orange-50/40 dark:bg-orange-950/20' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => handleToggleSelectRow(cat.id)}
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-orange-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Tên danh mục (name, chữ đậm) & Mô tả */}
                      <td className="p-3.5">
                        <div className="space-y-1 max-w-lg">
                          <p
                            onClick={() => handleOpenEditDrawer(cat)}
                            className="font-bold text-slate-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 cursor-pointer transition-colors leading-snug"
                          >
                            {cat.name}
                          </p>
                          {cat.summary && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                              {cat.summary}
                            </p>
                          )}
                          {cat.link_post && (
                            <a
                              href={cat.link_post}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 w-fit"
                            >
                              <LinkIcon className="w-3 h-3" />
                              <span className="truncate max-w-[200px]">{cat.link_post}</span>
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Kích thước (width x height, hiển thị dạng "300 x 250 px") */}
                      <td className="p-3.5">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono font-bold text-xs rounded-lg border border-slate-200 dark:border-slate-700">
                          <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            {cat.width} x {cat.height} px
                          </span>
                        </div>
                      </td>

                      {/* Giá (price, format có dấu phân cách nghìn + đơn vị "đ") */}
                      <td className="p-3.5">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-900 dark:text-white text-xs">
                            {cat.price > 0
                              ? `${cat.price.toLocaleString('vi-VN')} đ`
                              : 'Miễn phí'}
                          </span>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1">
                            <span>{cat.days} ngày</span>
                            <span>•</span>
                            <span>{cat.quantity} vị trí</span>
                          </div>
                        </div>
                      </td>

                      {/* Trạng thái (published, công tắc switch) */}
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => handleTogglePublished(cat.id)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            cat.published ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                          }`}
                          title={cat.published ? 'Danh mục đang hoạt động' : 'Danh mục đang ẩn'}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                              cat.published ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </td>

                      {/* Thao tác (nút Sửa, Xóa) */}
                      <td className="p-3.5 text-right space-x-1">
                        <button
                          onClick={() => handleOpenEditDrawer(cat)}
                          className="p-1.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/50 rounded-lg transition-colors cursor-pointer"
                          title="Chỉnh sửa danh mục"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleTriggerDeleteSingle(cat)}
                          className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors cursor-pointer"
                          title="Xóa danh mục"
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

      {/* Slide-over Drawer Form */}
      <BannerCategoryDrawerForm
        isOpen={isDrawerOpen}
        categoryToEdit={editingCategory}
        onSave={handleSaveCategory}
        onClose={() => {
          setIsDrawerOpen(false);
          setEditingCategory(null);
        }}
      />

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
