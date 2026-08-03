import React, { useState, useMemo } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Search,
  Trash2,
  Eye,
  EyeOff,
  Edit,
  Copy,
  Check,
  CheckSquare,
  Square,
  LayoutGrid,
  List,
  Clock,
  AlertTriangle,
  Link as LinkIcon,
} from 'lucide-react';
import { Banner, BANNER_STATUS_OPTIONS } from './types';
import { mockBanners } from './mockData';
import { mockBannerCategories } from '../banner_categories/mockData';
import { BannerFormView } from './BannerFormView';
import { DeleteConfirmModal } from './DeleteConfirmModal';

export const BannersManager: React.FC = () => {
  // Main items list
  const [banners, setBanners] = useState<Banner[]>(mockBanners);

  // View mode state: 'grid' (Pattern 2 default) vs 'table'
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Active view: 'list' vs 'form'
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Multi-select row state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Delete Modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState<Banner[]>([]);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Helper check if expired
  const isBannerExpired = (b: Banner) => {
    if (b.status === 'expired') return true;
    const todayStr = new Date().toISOString().split('T')[0];
    return b.date_end < todayStr;
  };

  // Format short date string: '2026-07-01' -> '01/07'
  const formatShortDate = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}`;
    }
    return dateStr;
  };

  // Filtered Banners list
  const filteredBanners = useMemo(() => {
    return banners.filter((item) => {
      const matchQuery =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        (item.alias && item.alias.toLowerCase().includes(searchQuery.toLowerCase().trim())) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase().trim()));

      const matchCategory = categoryFilter === 'all' || item.category_id === categoryFilter;

      let matchStatus = true;
      if (statusFilter === 'running') matchStatus = item.status === 'running' && !isBannerExpired(item);
      else if (statusFilter === 'expired') matchStatus = isBannerExpired(item);
      else if (statusFilter === 'pending') matchStatus = item.status === 'pending';
      else if (statusFilter === 'published') matchStatus = item.published;
      else if (statusFilter === 'hidden') matchStatus = !item.published;

      return matchQuery && matchCategory && matchStatus;
    });
  }, [banners, searchQuery, categoryFilter, statusFilter]);

  // Row selection handlers
  const handleToggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredBanners.length && filteredBanners.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredBanners.map((b) => b.id));
    }
  };

  // Single Toggle Published
  const handleTogglePublished = (id: string) => {
    setBanners((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const nextVal = !b.published;
          showToast(
            nextVal
              ? `Đã xuất bản banner "${b.name}"`
              : `Đã tạm ẩn banner "${b.name}"`
          );
          return { ...b, published: nextVal };
        }
        return b;
      })
    );
  };

  // Batch Publish / Hide
  const handleBatchSetPublished = (publishedState: boolean) => {
    if (selectedIds.length === 0) return;
    setBanners((prev) =>
      prev.map((b) => (selectedIds.includes(b.id) ? { ...b, published: publishedState } : b))
    );
    showToast(
      publishedState
        ? `Đã xuất bản ${selectedIds.length} banner đã chọn!`
        : `Đã ẩn ${selectedIds.length} banner đã chọn!`
    );
    setSelectedIds([]);
  };

  // Duplicate Banner Handler
  const handleDuplicateBanner = (bannerToDup: Banner, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newId = `banner_${Date.now()}`;
    const duplicated: Banner = {
      ...bannerToDup,
      id: newId,
      name: `${bannerToDup.name} (Bản sao)`,
      alias: bannerToDup.alias ? `${bannerToDup.alias}-copy` : '',
      created_time: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    setBanners([duplicated, ...banners]);
    showToast(`Đã nhân bản banner thành công!`);
  };

  // Trigger Delete Single
  const handleTriggerDeleteSingle = (banner: Banner, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setItemsToDelete([banner]);
    setIsDeleteModalOpen(true);
  };

  // Trigger Delete Batch
  const handleTriggerDeleteBatch = () => {
    if (selectedIds.length === 0) return;
    const items = banners.filter((b) => selectedIds.includes(b.id));
    setItemsToDelete(items);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    const idsToRemove = itemsToDelete.map((i) => i.id);
    setBanners((prev) => prev.filter((b) => !idsToRemove.includes(b.id)));
    setSelectedIds((prev) => prev.filter((id) => !idsToRemove.includes(id)));
    showToast(`Đã xóa thành công ${itemsToDelete.length} banner!`);
    setIsDeleteModalOpen(false);
    setItemsToDelete([]);
  };

  // Open Form Create
  const handleOpenCreateForm = () => {
    setEditingBanner(null);
    setIsFormOpen(true);
  };

  // Open Form Edit
  const handleOpenEditForm = (banner: Banner, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingBanner(banner);
    setIsFormOpen(true);
  };

  // Save Banner Handler
  const handleSaveBanner = (formData: Partial<Banner>) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    if (editingBanner) {
      setBanners((prev) =>
        prev.map((b) =>
          b.id === editingBanner.id
            ? {
                ...b,
                ...formData,
                updated_time: nowStr,
              }
            : b
        )
      );
      showToast(`Đã cập nhật banner "${formData.name}"!`);
    } else {
      const newBanner: Banner = {
        id: `banner_${Date.now()}`,
        name: formData.name || 'Banner mới',
        alias: formData.alias || '',
        description: formData.description || '',
        image:
          formData.image ||
          'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?q=80&w=1200&auto=format&fit=crop',
        width: formData.width || 1200,
        height: formData.height || 300,
        link: formData.link || '',
        category_id: formData.category_id || mockBannerCategories[0]?.id || 'bcat_001',
        category_name: formData.category_name || 'Banner Header Trang chủ',
        date_start: formData.date_start || '2026-08-01',
        date_end: formData.date_end || '2026-08-31',
        is_use: formData.is_use ?? true,
        status: formData.status || 'running',
        link_video: formData.link_video || '',
        icon: formData.icon || 'Sparkles',
        el_user_name: formData.el_user_name || '',
        el_info: formData.el_info || '',
        el_address: formData.el_address || '',
        el_mobilephone: formData.el_mobilephone || '',
        el_link_website: formData.el_link_website || '',
        el_link_facebook: formData.el_link_facebook || '',
        published: formData.published ?? true,
        ordering: formData.ordering || 1,
        created_time: nowStr,
      };

      setBanners([newBanner, ...banners]);
      showToast(`Đã thêm mới banner "${newBanner.name}"!`);
    }

    setIsFormOpen(false);
    setEditingBanner(null);
  };

  // IF FORM IS OPEN -> RENDER FULL PAGE FORM VIEW
  if (isFormOpen) {
    return (
      <BannerFormView
        bannerToEdit={editingBanner}
        onSave={handleSaveBanner}
        onCancel={() => {
          setIsFormOpen(false);
          setEditingBanner(null);
        }}
      />
    );
  }

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
              <ImageIcon className="w-5 h-5" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Quản lý Banner Quảng cáo
            </h1>
            <span className="px-2.5 py-0.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold rounded-full">
              {banners.length} banner
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Hiển thị giao diện Pattern 2 (Ảnh làm trọng tâm). Quản lý danh sách banner theo vị trí, lịch chạy và trạng thái.
          </p>
        </div>

        {/* Top Action Button */}
        <button
          onClick={handleOpenCreateForm}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm banner mới</span>
        </button>
      </div>

      {/* 2. TOOLBAR (Search, Filters, Batch Actions & VIEW MODE TOGGLE) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm banner theo tên, alias..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Category Filter Dropdown */}
          <div className="md:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="all">Tất cả vị trí danh mục</option>
              {mockBannerCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter & View Mode Switch */}
          <div className="md:col-span-4 flex items-center gap-2 justify-end">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="running">Đang chạy</option>
              <option value="expired">Hết hạn</option>
              <option value="pending">Chờ duyệt</option>
              <option value="published">Đã xuất bản</option>
              <option value="hidden">Đang ẩn</option>
            </select>

            {/* Pattern 2: View Mode Switch (Grid Card vs Table) */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Hiển thị Dạng lưới ảnh (Grid Card)"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Lưới</span>
              </button>

              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Hiển thị Dạng bảng (Table)"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">Bảng</span>
              </button>
            </div>
          </div>
        </div>

        {/* Batch Action Toolbar Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2 font-medium text-slate-600 dark:text-slate-400">
            <span>
              Hiển thị: <strong>{filteredBanners.length}</strong> / {banners.length} banner
            </span>
            {selectedIds.length > 0 && (
              <span className="px-2 py-0.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold rounded-lg">
                Đã chọn: {selectedIds.length} banner
              </span>
            )}
          </div>

          {/* Batch Action buttons */}
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

      {/* 3. CONTENT AREA (PATTERN 2: GRID CARD vs TABLE VIEW) */}
      {viewMode === 'grid' ? (
        /* PATTERN 2: DẠNG LƯỚI ẢNH (GRID CARD) */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredBanners.length === 0 ? (
            <div className="col-span-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-400">
              <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="font-semibold">Không tìm thấy banner quảng cáo phù hợp.</p>
            </div>
          ) : (
            filteredBanners.map((banner) => {
              const expired = isBannerExpired(banner);
              const isSelected = selectedIds.includes(banner.id);
              const wNum = banner.width || 300;
              const hNum = banner.height || 250;
              const aspectRatioVal = `${wNum} / ${hNum}`;

              const categoryObj = mockBannerCategories.find((c) => c.id === banner.category_id);

              return (
                <div
                  key={banner.id}
                  className={`group relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border transition-all duration-200 shadow-2xs hover:shadow-lg flex flex-col justify-between ${
                    expired
                      ? 'border-red-500/80 dark:border-red-500/60 ring-2 ring-red-500/20'
                      : isSelected
                      ? 'border-orange-500 dark:border-orange-500 ring-2 ring-orange-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {/* Top Image Container with aspect ratio matching width/height */}
                  <div className="relative w-full bg-slate-950/80 overflow-hidden">
                    <div
                      style={{ aspectRatio: aspectRatioVal }}
                      className="w-full flex items-center justify-center overflow-hidden bg-slate-100 dark:bg-slate-800"
                    >
                      <img
                        src={banner.image}
                        alt={banner.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Multi-select checkbox top-left */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleSelect(banner.id);
                      }}
                      className="absolute top-2.5 left-2.5 z-10 p-1 bg-slate-900/60 backdrop-blur-xs text-white rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-orange-400" />
                      ) : (
                        <Square className="w-4 h-4 text-white/80" />
                      )}
                    </button>

                    {/* Top-right Badges */}
                    <div className="absolute top-2.5 right-2.5 z-10 flex flex-col items-end gap-1">
                      {expired && (
                        <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded-md shadow-xs flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Hết hạn</span>
                        </span>
                      )}
                      {!banner.published && (
                        <span className="px-2 py-0.5 bg-slate-800/90 text-slate-200 text-[10px] font-bold rounded-md shadow-xs">
                          Đang ẩn
                        </span>
                      )}
                    </div>

                    {/* HOVER OVERLAY WITH 2 ICON BUTTONS (Edit & Duplicate) + Quick Delete */}
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                      <button
                        onClick={(e) => handleOpenEditForm(banner, e)}
                        className="p-2.5 bg-white text-slate-900 hover:bg-orange-600 hover:text-white rounded-xl shadow-lg transition-all transform hover:scale-110 cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                        title="Chỉnh sửa banner"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Sửa</span>
                      </button>

                      <button
                        onClick={(e) => handleDuplicateBanner(banner, e)}
                        className="p-2.5 bg-white text-slate-900 hover:bg-blue-600 hover:text-white rounded-xl shadow-lg transition-all transform hover:scale-110 cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                        title="Nhân bản banner"
                      >
                        <Copy className="w-4 h-4" />
                        <span>Nhân bản</span>
                      </button>

                      <button
                        onClick={(e) => handleTriggerDeleteSingle(banner, e)}
                        className="p-2 bg-red-600 text-white hover:bg-red-700 rounded-xl shadow-lg transition-all transform hover:scale-110 cursor-pointer"
                        title="Xóa banner"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Bottom Info Section */}
                  <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Name */}
                      <h3
                        onClick={(e) => handleOpenEditForm(banner, e)}
                        className="text-xs font-bold text-slate-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 line-clamp-2 cursor-pointer transition-colors leading-snug"
                        title={banner.name}
                      >
                        {banner.name}
                      </h3>

                      {/* Category Badge */}
                      <div className="mt-2 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold rounded-md truncate max-w-[180px]">
                          {categoryObj?.name || banner.category_name || 'Danh mục Banner'}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-slate-400 shrink-0">
                          {banner.width}x{banner.height}
                        </span>
                      </div>
                    </div>

                    {/* Date range "Chạy: dd/mm - dd/mm" */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>
                          Chạy: {formatShortDate(banner.date_start)} - {formatShortDate(banner.date_end)}
                        </span>
                      </div>

                      {/* Publish switch direct control */}
                      <button
                        onClick={() => handleTogglePublished(banner.id)}
                        className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out ${
                          banner.published ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                        title={banner.published ? 'Đã xuất bản' : 'Đang ẩn'}
                      >
                        <span
                          className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                            banner.published ? 'translate-x-3' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* PATTERN 2: DẠNG BẢNG THUẦN (TABLE VIEW) */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="p-3.5 w-10 text-center">
                    <button
                      onClick={handleToggleSelectAll}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {selectedIds.length === filteredBanners.length && filteredBanners.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-orange-600" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="p-3.5 w-24">Ảnh thu nhỏ</th>
                  <th className="p-3.5 min-w-[260px]">Tên Banner</th>
                  <th className="p-3.5 w-48">Danh mục</th>
                  <th className="p-3.5 w-44">Link liên kết</th>
                  <th className="p-3.5 w-32 text-center">Trạng thái</th>
                  <th className="p-3.5 w-36">Thời gian chạy</th>
                  <th className="p-3.5 w-32 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {filteredBanners.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-slate-400">
                      <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p className="font-semibold">Không tìm thấy banner quảng cáo phù hợp.</p>
                    </td>
                  </tr>
                ) : (
                  filteredBanners.map((banner) => {
                    const expired = isBannerExpired(banner);
                    const isSelected = selectedIds.includes(banner.id);
                    const categoryObj = mockBannerCategories.find((c) => c.id === banner.category_id);

                    return (
                      <tr
                        key={banner.id}
                        className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                          isSelected ? 'bg-orange-50/40 dark:bg-orange-950/20' : ''
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="p-3.5 text-center">
                          <button
                            onClick={() => handleToggleSelect(banner.id)}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-orange-600" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </td>

                        {/* Thumbnail Image (80x50px) */}
                        <td className="p-3.5">
                          <div className="w-20 h-12 bg-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 relative">
                            <img
                              src={banner.image}
                              alt={banner.name}
                              className="w-full h-full object-cover"
                            />
                            {expired && (
                              <div className="absolute inset-0 bg-red-900/60 flex items-center justify-center">
                                <span className="text-[9px] font-bold text-white px-1 bg-red-600 rounded">
                                  Hết hạn
                                </span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Name */}
                        <td className="p-3.5">
                          <div className="space-y-1">
                            <p
                              onClick={(e) => handleOpenEditForm(banner, e)}
                              className="font-bold text-slate-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 cursor-pointer transition-colors leading-snug"
                            >
                              {banner.name}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono">
                              Kích thước: {banner.width} x {banner.height} px
                            </p>
                          </div>
                        </td>

                        {/* Category Badge */}
                        <td className="p-3.5">
                          <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold rounded-lg inline-block truncate max-w-[180px]">
                            {categoryObj?.name || banner.category_name}
                          </span>
                        </td>

                        {/* Link */}
                        <td className="p-3.5">
                          {banner.link ? (
                            <a
                              href={banner.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 max-w-[150px] truncate"
                              title={banner.link}
                            >
                              <LinkIcon className="w-3 h-3 shrink-0" />
                              <span className="truncate">{banner.link}</span>
                            </a>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Không có link</span>
                          )}
                        </td>

                        {/* Status (published toggle switch) */}
                        <td className="p-3.5 text-center">
                          <button
                            onClick={() => handleTogglePublished(banner.id)}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              banner.published ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                            }`}
                            title={banner.published ? 'Banner đang xuất bản' : 'Banner đang ẩn'}
                          >
                            <span
                              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                banner.published ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </td>

                        {/* Date range */}
                        <td className="p-3.5">
                          <div className="text-[11px] font-medium text-slate-700 dark:text-slate-300 space-y-0.5">
                            <div>{banner.date_start}</div>
                            <div className="text-slate-400">đến {banner.date_end}</div>
                          </div>
                        </td>

                        {/* Actions (Edit, Duplicate, Delete) */}
                        <td className="p-3.5 text-right space-x-1">
                          <button
                            onClick={(e) => handleOpenEditForm(banner, e)}
                            className="p-1.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/50 rounded-lg transition-colors cursor-pointer"
                            title="Chỉnh sửa banner"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleDuplicateBanner(banner, e)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-colors cursor-pointer"
                            title="Nhân bản banner"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleTriggerDeleteSingle(banner, e)}
                            className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors cursor-pointer"
                            title="Xóa banner"
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
