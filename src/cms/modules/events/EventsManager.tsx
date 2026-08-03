import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Search,
  Filter,
  Edit,
  Eye,
  EyeOff,
  Calendar,
  MapPin,
  Clock,
  CheckSquare,
  Square,
  Sparkles,
  Star,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  RefreshCw,
  Tag,
  CalendarDays,
} from 'lucide-react';
import { EventItem, EventCategory } from './types';
import { mockEvents, mockEventCategories } from './mockData';
import { EventsFormView } from './EventsFormView';
import { DeleteConfirmModal } from './DeleteConfirmModal';

// Helper to format date string to "dd/mm/yyyy HH:mm"
function formatEventDateTime(dateStr: string): string {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${mins}`;
  } catch (e) {
    return dateStr;
  }
}

export const EventsManager: React.FC = () => {
  // Main Data States
  const [events, setEvents] = useState<EventItem[]>(mockEvents);
  const [categories] = useState<EventCategory[]>(mockEventCategories);

  // Form View & Modal Mode States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<EventItem | null>(null);

  // Filter States
  const [searchTitle, setSearchTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'hidden'>('all');

  // Multi-Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState<EventItem[]>([]);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered Events
  const filteredEvents = events.filter((ev) => {
    const matchesTitle = ev.title.toLowerCase().includes(searchTitle.toLowerCase().trim());
    const matchesCategory = selectedCategory === 'all' || ev.category_id === selectedCategory;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && ev.published) ||
      (statusFilter === 'hidden' && !ev.published);
    return matchesTitle && matchesCategory && matchesStatus;
  });

  // Toggle Single Row Published status directly from table
  const handleTogglePublished = (id: string) => {
    setEvents((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextState = !item.published;
          showToast(`Đã ${nextState ? 'xuất bản' : 'ẩn'} sự kiện "${item.title}"`);
          return { ...item, published: nextState };
        }
        return item;
      })
    );
  };

  // Selection Checkbox Logic
  const handleSelectAll = () => {
    if (selectedIds.length === filteredEvents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredEvents.map((item) => item.id));
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Batch Operations
  const handleBatchPublish = (targetPublishedState: boolean) => {
    if (selectedIds.length === 0) return;
    setEvents((prev) =>
      prev.map((item) => {
        if (selectedIds.includes(item.id)) {
          return { ...item, published: targetPublishedState };
        }
        return item;
      })
    );
    showToast(
      `Đã ${targetPublishedState ? 'chuyển sang Xuất bản' : 'Ẩn'} ${selectedIds.length} sự kiện đã chọn!`
    );
  };

  const handleOpenBatchDelete = () => {
    const targets = events.filter((e) => selectedIds.includes(e.id));
    setItemsToDelete(targets);
    setIsDeleteModalOpen(true);
  };

  const handleOpenSingleDelete = (ev: EventItem) => {
    setItemsToDelete([ev]);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    const idsToRemove = itemsToDelete.map((i) => i.id);
    setEvents((prev) => prev.filter((item) => !idsToRemove.includes(item.id)));
    setSelectedIds((prev) => prev.filter((id) => !idsToRemove.includes(id)));
    setIsDeleteModalOpen(false);
    showToast(`Đã xóa ${itemsToDelete.length} sự kiện thành công!`);
  };

  // Open Edit / Create Form
  const handleCreateNew = () => {
    setEventToEdit(null);
    setIsFormOpen(true);
  };

  const handleEdit = (ev: EventItem) => {
    setEventToEdit(ev);
    setIsFormOpen(true);
  };

  // Save Form Handler
  const handleSaveEvent = (data: Partial<EventItem>) => {
    if (eventToEdit) {
      // Edit existing
      setEvents((prev) =>
        prev.map((item) =>
          item.id === eventToEdit.id
            ? ({
                ...item,
                ...data,
                updated_time: new Date().toISOString().replace('T', ' ').substring(0, 19),
              } as EventItem)
            : item
        )
      );
      showToast(`Đã cập nhật sự kiện "${data.title}"!`);
    } else {
      // Add new
      const newItem: EventItem = {
        id: `ev_${Date.now()}`,
        title: data.title || '',
        alias: data.alias || '',
        category_id: data.category_id || categories[0]?.id || '',
        summary: data.summary || '',
        content: data.content || '',
        image: data.image || '',
        time_event: data.time_event || '',
        end_time: data.end_time || '',
        place: data.place || '',
        specific_time: data.specific_time || '',
        chu_de: data.chu_de || '',
        link_dangky: data.link_dangky || '',
        event_related: data.event_related || [],
        news_related: data.news_related || [],
        products_related: data.products_related || [],
        is_new: data.is_new ?? true,
        is_hot: data.is_hot ?? false,
        show_in_home: data.show_in_home ?? true,
        published: data.published ?? true,
        ordering: data.ordering || 1,
        seo_title: data.seo_title || '',
        seo_keyword: data.seo_keyword || '',
        seo_description: data.seo_description || '',
        created_time: new Date().toISOString().replace('T', ' ').substring(0, 19),
      };
      setEvents([newItem, ...events]);
      showToast(`Đã tạo sự kiện mới thành công!`);
    }

    setIsFormOpen(false);
    setEventToEdit(null);
  };

  // Helper function to resolve category name
  const getCategoryBadge = (catId: string) => {
    const cat = categories.find((c) => c.id === catId);
    return cat ? cat.name : 'Chưa phân loại';
  };

  // Render Form View if opened
  if (isFormOpen) {
    return (
      <EventsFormView
        eventToEdit={eventToEdit}
        categories={categories}
        onSave={handleSaveEvent}
        onCancel={() => {
          setIsFormOpen(false);
          setEventToEdit(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-5">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold animate-in fade-in slide-in-from-bottom-5">
          <Sparkles className="w-4 h-4 text-purple-400 dark:text-purple-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* MODAL CONFIRM DELETE */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        itemsToDelete={itemsToDelete}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      {/* HEADER CARD */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl">
              <CalendarDays className="w-5 h-5" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Quản lý Sự kiện & Hội thảo
            </h1>
            <span className="px-2.5 py-0.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold rounded-full">
              {events.length} sự kiện
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Quản lý lịch trình sự kiện, hội thảo chuyên đề, khóa đào tạo và webinar trực tuyến của CIC Technology.
          </p>
        </div>

        {/* Top Right Action Button */}
        <button
          type="button"
          onClick={handleCreateNew}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm sự kiện mới</span>
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
              placeholder="Tìm kiếm sự kiện theo tiêu đề..."
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Category filter dropdown */}
          <div className="md:col-span-4 relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
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

          {/* Status filter dropdown */}
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
              type="button"
              onClick={() => showToast('Đã làm mới danh sách sự kiện!')}
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
            <span>Hiển thị: <strong>{filteredEvents.length}</strong> / {events.length} sự kiện</span>
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
                type="button"
                onClick={() => handleBatchPublish(true)}
                className="px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Xuất bản ({selectedIds.length})</span>
              </button>

              <button
                type="button"
                onClick={() => handleBatchPublish(false)}
                className="px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 hover:bg-amber-100"
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span>Ẩn ({selectedIds.length})</span>
              </button>

              <button
                type="button"
                onClick={handleOpenBatchDelete}
                className="px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-800 hover:bg-red-100"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa ({selectedIds.length})</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* TABLE DATA LIST */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <th className="py-3 px-4 w-10 text-center">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {selectedIds.length > 0 && selectedIds.length === filteredEvents.length ? (
                      <CheckSquare className="w-4 h-4 text-orange-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-4 min-w-[280px]">Tiêu đề sự kiện</th>
                <th className="py-3 px-4 w-40">Danh mục</th>
                <th className="py-3 px-4 w-40">Thời gian sự kiện</th>
                <th className="py-3 px-4 min-w-[200px]">Địa điểm</th>
                <th className="py-3 px-4 w-28 text-center">Trạng thái</th>
                <th className="py-3 px-4 w-20 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((ev) => {
                  const isSelected = selectedIds.includes(ev.id);
                  return (
                    <tr
                      key={ev.id}
                      className={`group transition-colors ${
                        isSelected
                          ? 'bg-orange-50/40 dark:bg-orange-950/20'
                          : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleSelectOne(ev.id)}
                          className="text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-orange-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Tiêu đề (bold text + image preview thumbnail) */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-start gap-3">
                          <img
                            src={ev.image}
                            alt=""
                            className="w-12 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0 mt-0.5"
                          />
                          <div className="space-y-1">
                            <h4
                              onClick={() => handleEdit(ev)}
                              className="font-bold text-slate-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 cursor-pointer line-clamp-2 leading-snug"
                            >
                              {ev.title}
                            </h4>

                            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                              <span>/{ev.alias}</span>
                              {ev.is_hot && (
                                <span className="px-1.5 py-0.2 bg-amber-500/10 text-amber-500 font-bold rounded flex items-center gap-0.5">
                                  <Star className="w-3 h-3 fill-amber-500" /> Hot
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Danh mục (Badge xám/xanh) */}
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[11px] rounded-lg border border-slate-200 dark:border-slate-700 inline-block">
                          {getCategoryBadge(ev.category_id)}
                        </span>
                      </td>

                      {/* Thời gian sự kiện (formatted "dd/mm/yyyy HH:mm") */}
                      <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-mono text-xs font-semibold">
                        <div className="flex items-center gap-1.5">
                          <CalendarDays className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400 shrink-0" />
                          <span>{formatEventDateTime(ev.time_event)}</span>
                        </div>
                      </td>

                      {/* Địa điểm (cắt bớt + dấu "..." nếu dài, hiện tooltip đầy đủ khi hover) */}
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                        <div
                          className="flex items-start gap-1.5 max-w-[220px]"
                          title={ev.place || 'Chưa cập nhật địa điểm'}
                        >
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span className="truncate">{ev.place ? ev.place : '—'}</span>
                        </div>
                      </td>

                      {/* Trạng thái (Published, công tắc bật/tắt trực tiếp) */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePublished(ev.id)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            ev.published ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                          }`}
                          title={ev.published ? 'Đang xuất bản (Click để ẩn)' : 'Đang ẩn (Click để xuất bản)'}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                              ev.published ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </td>

                      {/* Action buttons (Sửa / Xóa) */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleEdit(ev)}
                            className="p-1.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/40 rounded-lg transition-colors cursor-pointer"
                            title="Chỉnh sửa sự kiện"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenSingleDelete(ev)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                            title="Xóa sự kiện"
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
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50 text-slate-400" />
                    <p className="text-xs font-medium">Không tìm thấy sự kiện nào phù hợp.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER PAGINATION SUMMARY */}
        <div className="p-4 bg-slate-50/80 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>
            Hiển thị <strong>{filteredEvents.length}</strong> / <strong>{events.length}</strong> sự kiện
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled
              className="p-1 rounded-lg border border-slate-200 dark:border-slate-700 opacity-50 cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-slate-800 dark:text-slate-200">Trang 1 / 1</span>
            <button
              disabled
              className="p-1 rounded-lg border border-slate-200 dark:border-slate-700 opacity-50 cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
