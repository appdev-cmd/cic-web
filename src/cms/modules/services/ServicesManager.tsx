import React, { useState, useMemo } from 'react';
import {
  Layers,
  Plus,
  Search,
  Filter,
  CheckSquare,
  Square,
  Eye,
  Edit,
  Trash2,
  RotateCcw,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Globe,
  AlertCircle,
  FileCheck,
  Send,
  UserCheck,
  Sparkles,
  Link2,
  Inbox,
  ShieldCheck,
  CheckCircle2,
  GitCommit,
  History,
  X,
} from 'lucide-react';
import {
  ServiceItem,
  EditorialStatus,
} from './types';
import type { CmsLocale } from '../../data/CmsDataSource';
import type { ServicesModuleData } from '../../data/EditorialContentDataSource';
import { ServiceFormView } from './ServiceFormView';
import { CmsButton, CmsIconButton } from '../../components/ui/CmsButton';
import { CmsPageHeader } from '../../components/ui/CmsPageHeader';
import { CmsBulkActionBar } from '../../components/ui/CmsBulkActionBar';
import { CmsSelectionCheckbox } from '../../components/ui/CmsSelectionCheckbox';
import { CmsPagination } from '../../components/ui/CmsPagination';
import { ServicePreviewModal } from './ServicePreviewModal';
import { ActivityLogDrawer } from './ActivityLogDrawer';
import { VersionHistoryDrawer } from './VersionHistoryDrawer';
import { UsedByDrawer } from './UsedByDrawer';
import { RelatedContactsDrawer } from './RelatedContactsDrawer';

interface ServicesManagerProps {
  workspaceLocale: CmsLocale;
  data?: ServicesModuleData;
}

const editorialStatusLabels: Record<EditorialStatus, string> = {
  draft: 'Bản nháp',
  published: 'Đã xuất bản',
};

export const ServicesManager: React.FC<ServicesManagerProps> = ({ workspaceLocale, data }) => {
  const [services, setServices] = useState<ServiceItem[]>(() => (data?.services ?? []).map((item) => ({ ...item, editorial_status: item.editorial_status === 'published' ? 'published' : 'draft' })));
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEditorialStatus, setFilterEditorialStatus] = useState<string>('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Edit / Form Mode
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  // Modals & Drawers
  const [previewService, setPreviewService] = useState<ServiceItem | null>(null);
  const [activeDrawer, setActiveDrawer] = useState<{
    type: 'logs' | 'versions' | 'used_by' | 'contacts';
    service: ServiceItem;
  } | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered Services list
  const filteredServices = useMemo(() => {
    return services.filter((item) => {
      if (item.is_deleted) return false;

      // Search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(term);
        const matchSummary = item.summary.toLowerCase().includes(term);
        if (!matchTitle && !matchSummary) return false;
      }

      // Editorial status filter
      if (filterEditorialStatus !== 'all' && item.editorial_status !== filterEditorialStatus)
        return false;

      return true;
    });
  }, [
    services,
    searchTerm,
    filterEditorialStatus,
  ]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredServices.length / pageSize) || 1;
  const paginatedServices = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredServices.slice(start, start + pageSize);
  }, [filteredServices, currentPage, pageSize]);

  // Bulk selections
  const handleSelectAll = () => {
    if (selectedIds.length === paginatedServices.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedServices.map((s) => s.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const isFilterActive = Boolean(searchTerm || filterEditorialStatus !== 'all');

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterEditorialStatus('all');
    setCurrentPage(1);
  };

  // Action Handlers
  const handleCreateNew = () => {
    const newService: ServiceItem = {
      id: `srv_${Date.now()}`,
      title: '',
      slug: '',
      summary: '',
      description: '',
      thumbnail_url: '',
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      editorial_status: 'draft',
      display_order: services.length + 1,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      updated_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    setServices([newService, ...services]);
    setEditingService(newService);
  };

  const handleSaveServiceFromForm = (updated: ServiceItem) => {
    setServices((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
  };

  // If in Form View
  if (editingService) {
    return (
      <>
        <ServiceFormView
          service={editingService}
          onBack={() => setEditingService(null)}
          onSave={(updated) => {
            handleSaveServiceFromForm(updated);
            setEditingService(updated);
          }}
          onOpenPreview={(item) => setPreviewService(item)}
        />
        <ServicePreviewModal
          isOpen={Boolean(previewService)}
          onClose={() => setPreviewService(null)}
          service={previewService}
        />
      </>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5">
          <Sparkles className="w-4 h-4 text-orange-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Main Actions */}
      <CmsPageHeader
        icon={<Layers />}
        title="Dịch vụ"
        description="Quản lý nội dung, hình ảnh, SEO và trạng thái xuất bản dịch vụ."
        meta={<span className="rounded-md bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">{filteredServices.length} dịch vụ</span>}
        actions={<CmsButton
          onClick={handleCreateNew}
          variant="primary"
          size="sm"
          leadingIcon={<Plus />}
        >
          Thêm dịch vụ
        </CmsButton>}
      />

      {/* TOOLBAR & FILTERS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Ô Tìm kiếm (Search Box) */}
          <div className="relative flex items-center w-full sm:w-56 lg:w-64 shrink-0">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Tìm theo tên hoặc tóm tắt..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-9.5 pl-9 pr-8 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 placeholder:text-slate-400 outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setCurrentPage(1);
                }}
                className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                title="Xóa tìm kiếm"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Editorial Status Filter */}
          <div className="min-w-[140px] flex-1 max-w-[200px]">
            <select
              value={filterEditorialStatus}
              onChange={(e) => {
                setFilterEditorialStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-9.5 px-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-slate-900 transition-colors cursor-pointer truncate"
              title="Lọc theo Trạng thái nội dung"
            >
              <option value="all">Tất cả trạng thái nội dung</option>
              <option value="draft">Bản nháp</option>
              <option value="published">Đã xuất bản</option>
            </select>
          </div>

          {/* Cụm nút thao tác bên phải: Đặt lại */}
          <div className="flex items-center gap-2 ml-auto shrink-0">
            <button
              type="button"
              disabled={!isFilterActive}
              onClick={handleResetFilters}
              className={`flex h-9.5 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isFilterActive
                  ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-900/60 hover:bg-orange-100 dark:hover:bg-orange-900/80 shadow-xs'
                  : 'text-slate-400 dark:text-slate-600 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 disabled:cursor-not-allowed disabled:opacity-50'
              }`}
              title="Đặt lại tất cả bộ lọc và tìm kiếm"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Đặt lại</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar if items selected */}
      <CmsBulkActionBar
        selectedCount={selectedIds.length}
        itemLabel="dịch vụ"
        onClear={() => setSelectedIds([])}
        actions={[
          {
            label: 'Xuất bản',
            icon: FileCheck,
            variant: 'primary',
            onClick: () => {
              setServices((prev) =>
                prev.map((s) => (selectedIds.includes(s.id) ? { ...s, editorial_status: 'published' } : s))
              );
              showToast(`Đã xuất bản ${selectedIds.length} dịch vụ!`);
              setSelectedIds([]);
            },
          },
          {
            label: 'Chuyển bản nháp',
            icon: RotateCcw,
            onClick: () => {
              setServices((prev) =>
                prev.map((s) => (selectedIds.includes(s.id) ? { ...s, editorial_status: 'draft' } : s))
              );
              showToast(`Đã chuyển ${selectedIds.length} dịch vụ về Bản nháp!`);
              setSelectedIds([]);
            },
          },
          {
            label: 'Xóa',
            icon: Trash2,
            variant: 'danger',
            onClick: () => {
              setServices((prev) =>
                prev.map((s) => (selectedIds.includes(s.id) ? { ...s, is_deleted: true } : s))
              );
              showToast(`Đã di chuyển ${selectedIds.length} dịch vụ vào Thùng rác!`);
              setSelectedIds([]);
            },
          },
        ]}
      />

      {/* Main Full-Width Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="cms-data-table text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-3 w-10 text-center sticky left-0 bg-slate-50 dark:bg-slate-800 z-10">
                  <CmsSelectionCheckbox checked={paginatedServices.length > 0 && selectedIds.length === paginatedServices.length} indeterminate={selectedIds.length > 0 && selectedIds.length < paginatedServices.length} onChange={handleSelectAll} label="Chọn tất cả dịch vụ trên trang" />
                </th>
                <th className="p-3 min-w-[280px] sticky left-10 bg-slate-50 dark:bg-slate-800 z-10">
                  Dịch vụ
                </th>
                <th className="p-3 min-w-[130px]">Trạng thái xuất bản</th>
                <th className="p-3 min-w-[130px]">Cập nhật</th>
                <th className="p-3 w-28 text-right sticky right-0 bg-slate-50 dark:bg-slate-800 z-10">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {paginatedServices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400">
                    Không tìm thấy dịch vụ phù hợp với điều kiện lọc.
                  </td>
                </tr>
              ) : (
                paginatedServices.map((item) => {
                  const isSelected = selectedIds.includes(item.id);
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      {/* Checkbox */}
                      <td className="p-3 text-center sticky left-0 bg-white dark:bg-slate-900 z-10">
                        <CmsSelectionCheckbox checked={isSelected} onChange={() => handleToggleSelect(item.id)} label={`Chọn dịch vụ ${item.title}`} />
                      </td>

                      {/* Title */}
                      <td className="p-3 sticky left-10 bg-white dark:bg-slate-900 z-10">
                        <div className="flex items-start gap-3">
                          <img
                            src={item.thumbnail_url}
                            alt={item.title}
                            className="w-12 h-12 rounded-lg object-cover shrink-0 border border-slate-200 dark:border-slate-800 shadow-2xs"
                          />
                          <div className="space-y-0.5 max-w-xs">
                            <h4
                              onClick={() => setEditingService(item)}
                              className="font-bold text-slate-900 dark:text-slate-100 hover:text-orange-600 dark:hover:text-orange-400 cursor-pointer line-clamp-1"
                            >
                              {item.title}
                            </h4>
                            <p className="text-[11px] text-slate-400 line-clamp-1">
                              {item.summary}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Editorial Status */}
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            item.editorial_status === 'published'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {editorialStatusLabels[item.editorial_status]}
                        </span>
                      </td>

                      {/* Updated */}
                      <td className="p-3 text-slate-500 text-[11px]">
                        <div className="text-[10px] text-slate-400">{item.updated_at}</div>
                      </td>

                      {/* Actions Sticky Right */}
                      <td className="p-3 text-right sticky right-0 bg-white dark:bg-slate-900 z-10">
                        <div className="flex items-center justify-end gap-1">
                          <CmsIconButton
                            onClick={() => setPreviewService(item)}
                            icon={<Eye />}
                            size="sm"
                            aria-label="Xem trước dịch vụ"
                            title="Xem trước"
                          />

                          <CmsIconButton
                            onClick={() => setEditingService(item)}
                            icon={<Edit />}
                            size="sm"
                            aria-label="Chỉnh sửa dịch vụ"
                            title="Chỉnh sửa chi tiết"
                          />

                          <CmsIconButton
                            onClick={() => setServices((prev) => prev.map((service) => service.id === item.id ? { ...service, is_deleted: true } : service))}
                            icon={<Trash2 />}
                            size="sm"
                            variant="danger"
                            aria-label="Xóa dịch vụ"
                            title="Xóa dịch vụ"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer & Pagination */}
        <CmsPagination currentPage={currentPage} pageSize={pageSize} totalCount={filteredServices.length} itemLabel="dịch vụ" pageSizeOptions={[10, 20, 50, 100]} onPageChange={setCurrentPage} onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }} />
      </div>

      {/* Overlays & Drawers */}
      <ServicePreviewModal
        isOpen={Boolean(previewService)}
        onClose={() => setPreviewService(null)}
        service={previewService}
      />

      {activeDrawer && (
        <>
          {activeDrawer.type === 'logs' && (
            <ActivityLogDrawer
              isOpen={true}
              onClose={() => setActiveDrawer(null)}
              serviceTitle={activeDrawer.service.title}
              logs={data?.activityLogs ?? []}
            />
          )}

          {activeDrawer.type === 'versions' && (
            <VersionHistoryDrawer
              isOpen={true}
              onClose={() => setActiveDrawer(null)}
              serviceTitle={activeDrawer.service.title}
              versions={data?.versions ?? []}
            />
          )}

          {activeDrawer.type === 'used_by' && (
            <UsedByDrawer
              isOpen={true}
              onClose={() => setActiveDrawer(null)}
              serviceTitle={activeDrawer.service.title}
              references={data?.usedByReferences ?? []}
            />
          )}

          {activeDrawer.type === 'contacts' && (
            <RelatedContactsDrawer
              isOpen={true}
              onClose={() => setActiveDrawer(null)}
              serviceTitle={activeDrawer.service.title}
              contacts={data?.relatedContacts ?? []}
            />
          )}
        </>
      )}
    </div>
  );
};
