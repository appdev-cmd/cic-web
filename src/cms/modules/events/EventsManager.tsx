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
  Tag,
  CalendarDays,
  Sliders,
  ExternalLink,
  Zap,
  CheckCircle,
  RotateCcw,
} from 'lucide-react';
import { EventItem, EditorialStatus } from './types';
import type { CmsLocale } from '../../data/CmsDataSource';
import type { EventsModuleData } from '../../data/EditorialContentDataSource';
import { EventsFormView } from './EventsFormView';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { EventPreviewModal } from './EventPreviewModal';
import { EventQuickEditModal } from './EventQuickEditModal';
import { CmsButton, CmsIconButton } from '../../components/ui/CmsButton';
import { CmsPageHeader } from '../../components/ui/CmsPageHeader';
import { CmsBulkActionBar } from '../../components/ui/CmsBulkActionBar';
import { CmsSelectionCheckbox } from '../../components/ui/CmsSelectionCheckbox';
import { CmsPagination } from '../../components/ui/CmsPagination';

interface ColumnVisibility {
  title: boolean;
  time_event: boolean;
  place: boolean;
  editorial_status: boolean;
  progress_status: boolean;
  is_hot: boolean;
  ordering: boolean;
  created_time: boolean;
}

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

interface EventsManagerProps { workspaceLocale: CmsLocale; data?: EventsModuleData; }

type EventProgressStatus = 'upcoming' | 'ended';

function getEventProgressStatus(event: EventItem): EventProgressStatus {
  const startsAt = new Date(event.time_event).getTime();
  return Number.isFinite(startsAt) && startsAt <= Date.now() ? 'ended' : 'upcoming';
}

export const EventsManager: React.FC<EventsManagerProps> = ({ workspaceLocale, data }) => {
  // Main Data States
  const [events, setEvents] = useState<EventItem[]>(() =>
    (data?.events ?? []).map((item) => ({
      ...item,
      editorial_status: item.editorial_status === 'published' ? 'published' : 'draft',
      activity_logs: item.activity_logs?.map((log) => ({
        ...log,
        previous_editorial_status: log.previous_editorial_status === 'published' ? 'published' : 'draft',
        new_editorial_status: log.new_editorial_status === 'published' ? 'published' : 'draft',
      })),
    })),
  );

  // Form View & Modal Mode States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<EventItem | null>(null);

  // Auxiliary Modals & Drawers States
  const [previewEvent, setPreviewEvent] = useState<EventItem | null>(null);
  const [quickEditEvent, setQuickEditEvent] = useState<EventItem | null>(null);

  // Table Column Visibility & Density Config
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    title: true,
    time_event: true,
    place: true,
    editorial_status: true,
    progress_status: true,
    is_hot: true,
    ordering: true,
    created_time: false,
  });
  const [density, setDensity] = useState<'normal' | 'compact'>('normal');

  // Filter States (Dual Statuses)
  const [searchTitle, setSearchTitle] = useState('');
  const [editorialFilter, setEditorialFilter] = useState<string>('all');
  const [eventStatusFilter, setEventStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

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
    
    // Dual Status Matching
    const currentEditorial = ev.editorial_status || (ev.published ? 'published' : 'draft');
    const currentEventStatus = getEventProgressStatus(ev);

    const matchesEditorial = editorialFilter === 'all' || currentEditorial === editorialFilter;
    const matchesEventStatus = eventStatusFilter === 'all' || currentEventStatus === eventStatusFilter;

    return matchesTitle && matchesEditorial && matchesEventStatus;
  });
  const paginatedEvents = filteredEvents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Toggle Single Row Editorial Status directly from table
  const handleTogglePublished = (id: string) => {
    setEvents((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextPublished = !item.published;
          const nextEditorial: EditorialStatus = nextPublished ? 'published' : 'draft';
          showToast(`Đã ${nextPublished ? 'xuất bản' : 'chuyển sang bản nháp'} sự kiện "${item.title}"`);
          return { ...item, published: nextPublished, editorial_status: nextEditorial };
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
  const handleBatchChangeEditorialStatus = (status: EditorialStatus) => {
    if (selectedIds.length === 0) return;
    setEvents((prev) =>
      prev.map((item) => {
        if (selectedIds.includes(item.id)) {
          return {
            ...item,
            editorial_status: status,
            published: status === 'published',
          };
        }
        return item;
      })
    );
    showToast(`Đã đổi trạng thái nội dung ${selectedIds.length} sự kiện sang "${status}"`);
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

  // Quick Edit Save Handler
  const handleSaveQuickEdit = (updatedFields: Partial<EventItem>) => {
    if (!quickEditEvent) return;
    setEvents((prev) =>
      prev.map((item) =>
        item.id === quickEditEvent.id
          ? {
              ...item,
              ...updatedFields,
              ...(typeof updatedFields.published === 'boolean'
                ? { editorial_status: updatedFields.published ? 'published' as const : 'draft' as const }
                : {}),
              updated_time: new Date().toISOString().replace('T', ' ').substring(0, 19),
            }
          : item
      )
    );
    showToast(`Đã cập nhật nhanh sự kiện "${quickEditEvent.title}"!`);
    setQuickEditEvent(null);
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
                editorial_status: data.published ? 'published' : 'draft',
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
        summary: data.summary || '',
        content: data.content || '',
        image: data.image || '',
        time_event: data.time_event || '',
        place: data.place || '',
        specific_time: data.specific_time || '',
        chu_de: data.chu_de || '',
        link_dangky: data.link_dangky || '',
        editorial_status: data.published ? 'published' : 'draft',
        event_related: data.event_related || [],
        news_related: data.news_related || [],
        products_related: data.products_related || [],
        is_hot: data.is_hot ?? false,
        show_in_home: data.show_in_home ?? true,
        published: data.published ?? false,
        ordering: data.ordering || 1,
        seo_title: data.seo_title || '',
        seo_keyword: data.seo_keyword || '',
        seo_description: data.seo_description || '',
        created_time: new Date().toISOString().replace('T', ' ').substring(0, 19),
      };
      setEvents((current) => [newItem, ...current]);
      showToast(`Đã tạo sự kiện mới thành công!`);
    }

    setIsFormOpen(false);
    setEventToEdit(null);
  };

  // Editorial status badge helper
  const renderEditorialBadge = (status?: EditorialStatus) => {
    switch (status) {
      case 'published':
        return <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] rounded-lg border border-emerald-500/20">Xuất bản</span>;
      default:
        return <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold text-[10px] rounded-lg">Bản nháp</span>;
    }
  };

  // Event progress status badge helper
  const renderEventStatusBadge = (status?: EventProgressStatus) => {
    switch (status) {
      case 'ended':
        return <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-[10px] rounded-lg">Kết thúc</span>;
      default:
        return <span className="px-2 py-0.5 bg-orange-600 text-white font-bold text-[10px] rounded-lg">Sắp diễn ra</span>;
    }
  };

  // Render Form View if opened
  if (isFormOpen) {
    return (
      <>
        <EventsFormView
          eventToEdit={eventToEdit}
          relatedEvents={data?.events ?? []}
          relatedArticles={data?.relatedArticles ?? []}
          relatedProducts={data?.relatedProducts ?? []}
          mediaImages={data?.mediaImages ?? []}
          onSave={handleSaveEvent}
          onOpenPreview={setPreviewEvent}
          onCancel={() => {
            setIsFormOpen(false);
            setEventToEdit(null);
          }}
        />
        <EventPreviewModal
          isOpen={!!previewEvent}
          event={previewEvent}
          onClose={() => setPreviewEvent(null)}
        />
      </>
    );
  }

  return (
    <div className="space-y-5">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold animate-in fade-in slide-in-from-bottom-5">
          <Sparkles className="w-4 h-4 text-orange-400 dark:text-orange-600" />
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

      {/* MODAL PREVIEW */}
      <EventPreviewModal
        isOpen={!!previewEvent}
        event={previewEvent}
        onClose={() => setPreviewEvent(null)}
      />

      {/* MODAL QUICK EDIT */}
      <EventQuickEditModal
        isOpen={!!quickEditEvent}
        event={quickEditEvent}
        onSave={handleSaveQuickEdit}
        onClose={() => setQuickEditEvent(null)}
      />

      {/* HEADER CARD */}
      <CmsPageHeader
        icon={<CalendarDays />}
        title="Sự kiện và hội thảo"
        description="Quản lý sự kiện, hội thảo chuyên đề, khóa đào tạo và chương trình trực tuyến."
        meta={<span className="rounded-md bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">{events.length} sự kiện</span>}
        actions={<>
          <CmsButton
            onClick={handleCreateNew}
            variant="primary"
            size="sm"
            leadingIcon={<Plus />}
          >
            Thêm sự kiện
          </CmsButton>
        </>}
      />

      {/* TOOLBAR (Search, Filters & Dual Status Controls) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search input */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm sự kiện theo tiêu đề..."
              value={searchTitle}
              onChange={(e) => { setSearchTitle(e.target.value); setCurrentPage(1); }}
              className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs font-medium text-slate-800 outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200"
            />
          </div>

          {/* Dual Status Filter 1: Editorial */}
          <div className="md:col-span-3">
            <select
              value={editorialFilter}
              onChange={(e) => { setEditorialFilter(e.target.value); setCurrentPage(1); }}
              className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-800 outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200"
            >
              <option value="all">Trạng thái: Tất cả</option>
              <option value="draft">Bản nháp</option>
              <option value="published">Đã xuất bản</option>
            </select>
          </div>

          {/* Dual Status Filter 2: Event Progress */}
          <div className="md:col-span-4">
            <select
              value={eventStatusFilter}
              onChange={(e) => { setEventStatusFilter(e.target.value); setCurrentPage(1); }}
              className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-800 outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200"
            >
              <option value="all">Trạng thái diễn ra: Tất cả</option>
              <option value="upcoming">Sắp diễn ra</option>
              <option value="ended">Đã kết thúc</option>
            </select>
          </div>
          <div className="flex justify-start md:col-span-1 md:justify-end"><button type="button" disabled={!searchTitle && editorialFilter === 'all' && eventStatusFilter === 'all'} onClick={() => { setSearchTitle(''); setEditorialFilter('all'); setEventStatusFilter('all'); setCurrentPage(1); }} className="flex h-9 w-24 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-slate-800"><RotateCcw className="h-3.5 w-3.5" />Đặt lại</button></div>
        </div>

        <CmsBulkActionBar selectedCount={selectedIds.length} itemLabel="sự kiện" onClear={() => setSelectedIds([])} actions={[
          { label: 'Xuất bản', onClick: () => handleBatchChangeEditorialStatus('published'), icon: Eye, variant: 'primary' },
          { label: 'Xóa', onClick: handleOpenBatchDelete, icon: Trash2, variant: 'danger' },
        ]} />
      </div>

      {/* TABLE DATA LIST */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="cms-data-table text-left">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <th className="py-3 px-4 w-10 text-center">
                  <CmsSelectionCheckbox checked={filteredEvents.length > 0 && selectedIds.length === filteredEvents.length} indeterminate={selectedIds.length > 0 && selectedIds.length < filteredEvents.length} onChange={handleSelectAll} label="Chọn tất cả sự kiện" />
                </th>
                {columnVisibility.title && <th className="py-3 px-4 min-w-[260px]">Tiêu đề sự kiện</th>}
                {columnVisibility.time_event && <th className="py-3 px-4 w-40">Thời gian sự kiện</th>}
                {columnVisibility.place && <th className="py-3 px-4 min-w-[180px]">Địa điểm</th>}
                {columnVisibility.editorial_status && <th className="py-3 px-4 w-32 text-center">Trạng thái</th>}
                {columnVisibility.progress_status && <th className="py-3 px-4 w-40 text-center">Trạng thái diễn ra</th>}
                <th className="py-3 px-4 w-28 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredEvents.length > 0 ? (
                paginatedEvents.map((ev) => {
                  const isSelected = selectedIds.includes(ev.id);
                  const isCompact = density === 'compact';
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
                      <td className={`${isCompact ? 'py-2' : 'py-3.5'} px-4 text-center`}>
                        <CmsSelectionCheckbox checked={isSelected} onChange={() => handleSelectOne(ev.id)} label={`Chọn sự kiện ${ev.title}`} />
                      </td>

                      {/* Tiêu đề */}
                      {columnVisibility.title && (
                        <td className={`${isCompact ? 'py-2' : 'py-3.5'} px-4`}>
                          <div className="flex items-start gap-3">
                            {ev.image ? (
                              <img
                                src={ev.image}
                                alt=""
                                className="w-12 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0 mt-0.5"
                              />
                            ) : (
                              <span className="flex h-10 w-12 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-700 dark:bg-slate-800">
                                <Calendar className="h-4 w-4" />
                              </span>
                            )}
                            <div className="space-y-1">
                              <h4
                                onClick={() => handleEdit(ev)}
                                className="font-bold text-slate-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 cursor-pointer line-clamp-2 leading-snug"
                              >
                                {ev.title}
                              </h4>

                              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono flex-wrap">
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
                      )}


                      {/* Thời gian sự kiện */}
                      {columnVisibility.time_event && (
                        <td className={`${isCompact ? 'py-2' : 'py-3.5'} px-4 text-slate-700 dark:text-slate-300 font-mono text-xs font-semibold`}>
                          <div className="flex items-center gap-1.5">
                            <CalendarDays className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400 shrink-0" />
                            <span>{formatEventDateTime(ev.time_event)}</span>
                          </div>
                        </td>
                      )}

                      {/* Địa điểm */}
                      {columnVisibility.place && (
                        <td className={`${isCompact ? 'py-2' : 'py-3.5'} px-4 text-slate-600 dark:text-slate-400`}>
                          <div
                            className="flex items-start gap-1.5 max-w-[200px]"
                            title={ev.place || 'Chưa cập nhật địa điểm'}
                          >
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <span className="truncate">{ev.place ? ev.place : '—'}</span>
                          </div>
                        </td>
                      )}

                      {/* Editorial Status */}
                      {columnVisibility.editorial_status && (
                        <td className={`${isCompact ? 'py-2' : 'py-3.5'} px-4 text-center`}>
                          {renderEditorialBadge(ev.editorial_status || (ev.published ? 'published' : 'draft'))}
                        </td>
                      )}

                      {/* Event Progress Status */}
                      {columnVisibility.progress_status && (
                        <td className={`${isCompact ? 'py-2' : 'py-3.5'} px-4 text-center`}>
                          {renderEventStatusBadge(getEventProgressStatus(ev))}
                        </td>
                      )}

                      {/* Action buttons (Preview, QuickEdit, History, FullEdit, Delete) */}
                      <td className={`${isCompact ? 'py-2' : 'py-3.5'} px-4 text-center`}>
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => setPreviewEvent(ev)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer"
                            title="Xem trước giao diện sự kiện"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setQuickEditEvent(ev)}
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg transition-colors cursor-pointer"
                            title="Sửa nhanh"
                          >
                            <Zap className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEdit(ev)}
                            className="p-1.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/40 rounded-lg transition-colors cursor-pointer"
                            title="Chỉnh sửa chi tiết"
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
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50 text-slate-400" />
                    <p className="text-xs font-medium">Không tìm thấy sự kiện nào phù hợp.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <CmsPagination currentPage={currentPage} pageSize={pageSize} totalCount={filteredEvents.length} itemLabel="sự kiện" onPageChange={setCurrentPage} onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }} />
      </div>
    </div>
  );
};
