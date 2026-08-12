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
  Archive,
  Power,
  RotateCcw,
  SlidersHorizontal,
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
} from 'lucide-react';
import {
  ServiceItem,
  EditorialStatus,
  ServiceStatus,
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
import { QuickEditModal } from './QuickEditModal';
import { ImpactWarningModal } from './ImpactWarningModal';
import { ActivityLogDrawer } from './ActivityLogDrawer';
import { VersionHistoryDrawer } from './VersionHistoryDrawer';
import { UsedByDrawer } from './UsedByDrawer';
import { RelatedContactsDrawer } from './RelatedContactsDrawer';

interface ServicesManagerProps {
  workspaceLocale: CmsLocale;
  data?: ServicesModuleData;
}

export const ServicesManager: React.FC<ServicesManagerProps> = ({ workspaceLocale, data }) => {
  const [services, setServices] = useState<ServiceItem[]>(data?.services ?? []);
  const [activeTab, setActiveTab] = useState<'all' | 'my_tasks' | 'pending' | 'active' | 'low_quality' | 'trash'>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroupId, setFilterGroupId] = useState('all');
  const [filterEditorialStatus, setFilterEditorialStatus] = useState<string>('all');
  const [filterServiceStatus, setFilterServiceStatus] = useState<string>('all');
  const [filterOwnerId, setFilterOwnerId] = useState('all');
  const [filterSavedView, setFilterSavedView] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Edit / Form Mode
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  // Modals & Drawers
  const [previewService, setPreviewService] = useState<ServiceItem | null>(null);
  const [quickEditService, setQuickEditService] = useState<ServiceItem | null>(null);
  const [impactModalState, setImpactModalState] = useState<{
    service: ServiceItem | null;
    actionType: 'deactivate' | 'archive' | 'delete';
  } | null>(null);

  const [activeDrawer, setActiveDrawer] = useState<{
    type: 'logs' | 'versions' | 'used_by' | 'contacts';
    service: ServiceItem;
  } | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const groups = data?.groups ?? [];
  const ownersList = data?.owners ?? [];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Saved views filter logic
  const handleApplySavedView = (viewKey: string) => {
    setFilterSavedView(viewKey);
    if (viewKey === 'view_active') {
      setFilterServiceStatus('active');
    } else if (viewKey === 'view_pending') {
      setFilterEditorialStatus('pending');
    } else if (viewKey === 'view_unlinked') {
      setFilterGroupId('all');
    } else {
      setFilterEditorialStatus('all');
      setFilterServiceStatus('all');
      setFilterGroupId('all');
    }
  };

  // Filtered Services list
  const filteredServices = useMemo(() => {
    return services.filter((item) => {
      // Trash filter
      if (activeTab === 'trash') {
        if (!item.is_deleted) return false;
      } else {
        if (item.is_deleted) return false;
      }

      // Tab filters
      if (activeTab === 'my_tasks' && item.owner_id !== 'usr_002') return false;
      if (activeTab === 'pending' && item.editorial_status !== 'pending') return false;
      if (activeTab === 'active' && item.service_status !== 'active') return false;
      if (activeTab === 'low_quality' && item.quality_score >= 70) return false;

      // Search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(term);
        const matchCode = item.code.toLowerCase().includes(term);
        const matchOwner = item.owner_name.toLowerCase().includes(term);
        if (!matchTitle && !matchCode && !matchOwner) return false;
      }

      // Group filter
      if (filterGroupId !== 'all' && item.group_id !== filterGroupId) return false;

      // Editorial status filter
      if (filterEditorialStatus !== 'all' && item.editorial_status !== filterEditorialStatus)
        return false;

      // Service status filter
      if (filterServiceStatus !== 'all' && item.service_status !== filterServiceStatus)
        return false;

      // Owner filter
      if (filterOwnerId !== 'all' && item.owner_id !== filterOwnerId) return false;

      return true;
    });
  }, [
    services,
    activeTab,
    searchTerm,
    filterGroupId,
    filterEditorialStatus,
    filterServiceStatus,
    filterOwnerId,
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

  // Action Handlers
  const handleCreateNew = () => {
    const newService: ServiceItem = {
      id: `srv_${Date.now()}`,
      code: `DV-MOI-${Math.floor(Math.random() * 90) + 10}`,
      title: '',
      slug: '',
      summary: '',
      group_id: '',
      group_name: '',
      scope: '',
      business_relation: '',
      description: '',
      benefits_process: '',
      supplementary_content: '',
      thumbnail_url: '',
      banner_url: '',
      media_alt: '',
      cta_label: '',
      cta_link: '',
      owner_id: 'usr_002',
      owner_name: 'Trần Văn Mạnh',
      owner_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      owner_email: 'manh.tv@cic.com.vn',
      request_routing: '',
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      og_image: '',
      quality_score: 0,
      editorial_status: 'draft',
      service_status: 'inactive',
      site: 'cic.com.vn',
      placement: ['services_page'],
      display_order: services.length + 1,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      updated_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      updated_by: 'Trần Văn Mạnh',
      version_count: 1,
      used_by_count: 0,
      open_contacts_count: 0,
    };

    setServices([newService, ...services]);
    setEditingService(newService);
  };

  const handleSaveServiceFromForm = (updated: ServiceItem) => {
    setServices((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
  };

  const handleConfirmImpactAction = () => {
    if (!impactModalState) return;
    const { service, actionType } = impactModalState;

    if (actionType === 'deactivate') {
      setServices((prev) =>
        prev.map((s) => (s.id === service.id ? { ...s, service_status: 'inactive' } : s))
      );
      showToast(`Đã chuyển trạng thái dịch vụ ${service.code} sang Inactive.`);
    } else if (actionType === 'archive') {
      setServices((prev) =>
        prev.map((s) => (s.id === service.id ? { ...s, service_status: 'archived' } : s))
      );
      showToast(`Đã lưu trữ (Archive) dịch vụ ${service.code}.`);
    } else if (actionType === 'delete') {
      setServices((prev) =>
        prev.map((s) => (s.id === service.id ? { ...s, is_deleted: true } : s))
      );
      showToast(`Đã di chuyển dịch vụ ${service.code} vào Thùng rác.`);
    }
  };

  // If in Form View
  if (editingService) {
    return (
      <ServiceFormView
        service={editingService}
        groups={groups}
        owners={ownersList}
        activityLogs={data?.activityLogs ?? []}
        versions={data?.versions ?? []}
        usedByReferences={data?.usedByReferences ?? []}
        relatedContacts={data?.relatedContacts ?? []}
        onBack={() => setEditingService(null)}
        onSave={(updated) => {
          handleSaveServiceFromForm(updated);
          setEditingService(updated);
        }}
        onOpenPreview={(item) => setPreviewService(item)}
      />
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
        description="Quản lý nội dung giới thiệu, người phụ trách, lời kêu gọi hành động và trạng thái cung cấp dịch vụ."
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

      {/* View Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'Tất cả dịch vụ', count: services.filter((s) => !s.is_deleted).length },
          { id: 'my_tasks', label: 'Việc của tôi', count: services.filter((s) => !s.is_deleted && s.owner_id === 'usr_002').length },
          { id: 'pending', label: 'Hàng chờ review', count: services.filter((s) => !s.is_deleted && s.editorial_status === 'pending').length },
          { id: 'active', label: 'Đang hoạt động (Active)', count: services.filter((s) => !s.is_deleted && s.service_status === 'active').length },
          { id: 'low_quality', label: 'Chất lượng nội dung thấp', count: services.filter((s) => !s.is_deleted && s.quality_score < 70).length },
          { id: 'trash', label: 'Thùng rác', count: services.filter((s) => s.is_deleted).length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-all whitespace-nowrap flex items-center gap-1.5 border-b-2 ${
              activeTab === tab.id
                ? 'border-orange-600 text-orange-600 dark:text-orange-400 bg-orange-50/50 dark:bg-orange-950/20'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === tab.id
                  ? 'bg-orange-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Toolbar & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm dịch vụ theo tên, mã (DV-BIM-01) hoặc người phụ trách..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Group Filter */}
          <select
            value={filterGroupId}
            onChange={(e) => setFilterGroupId(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
          >
            <option value="all">Tất cả Nhóm dịch vụ</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>

          {/* Editorial Status Filter */}
          <select
            value={filterEditorialStatus}
            onChange={(e) => setFilterEditorialStatus(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
          >
            <option value="all">Tất cả Editorial Status</option>
            <option value="draft">Draft (Nháp)</option>
            <option value="pending">Pending (Chờ duyệt)</option>
            <option value="approved">Approved (Đã duyệt)</option>
            <option value="published">Published (Đã xuất bản)</option>
          </select>

          {/* Service Status Filter */}
          <select
            value={filterServiceStatus}
            onChange={(e) => setFilterServiceStatus(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
          >
            <option value="all">Tất cả Service Status</option>
            <option value="active">Active (Đang hoạt động)</option>
            <option value="inactive">Inactive (Tạm ngừng)</option>
            <option value="archived">Archived (Lưu trữ)</option>
          </select>

          {/* Saved Views */}
          <select
            value={filterSavedView}
            onChange={(e) => handleApplySavedView(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-orange-300 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/20 text-orange-800 dark:text-orange-300 font-semibold"
          >
            <option value="all">Saved View: Mặc định</option>
            <option value="view_active">Saved View: Dịch vụ Active</option>
            <option value="view_pending">Saved View: Chờ review</option>
          </select>
        </div>

        {/* Bulk Actions Bar if items selected */}
        <CmsBulkActionBar
          selectedCount={selectedIds.length}
          itemLabel="dịch vụ"
          onClear={() => setSelectedIds([])}
          actions={[
            { label: 'Kích hoạt', icon: Power, variant: 'primary', onClick: () => {
                  setServices((prev) =>
                    prev.map((s) => (selectedIds.includes(s.id) ? { ...s, service_status: 'active' } : s))
                  );
                  showToast(`Đã kích hoạt ${selectedIds.length} dịch vụ!`);
                  setSelectedIds([]);
                } },
            { label: 'Lưu trữ', icon: Archive, onClick: () => {
                  setServices((prev) =>
                    prev.map((s) => (selectedIds.includes(s.id) ? { ...s, service_status: 'archived' } : s))
                  );
                  showToast(`Đã lưu trữ ${selectedIds.length} dịch vụ!`);
                  setSelectedIds([]);
                } },
            { label: 'Xóa', icon: Trash2, variant: 'danger', onClick: () => {
                  setServices((prev) =>
                    prev.map((s) => (selectedIds.includes(s.id) ? { ...s, is_deleted: true } : s))
                  );
                  showToast(`Đã di chuyển ${selectedIds.length} dịch vụ vào Thùng rác!`);
                  setSelectedIds([]);
                } },
          ]}
        />
      </div>

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
                  Dịch vụ & Mã
                </th>
                <th className="p-3 min-w-[160px]">Nhóm dịch vụ</th>
                <th className="p-3 min-w-[140px]">Người phụ trách</th>
                <th className="p-3 min-w-[130px]">Editorial Status</th>
                <th className="p-3 min-w-[130px]">Service Status</th>
                <th className="p-3 min-w-[150px]">Vị trí hiển thị</th>
                <th className="p-3 min-w-[130px]">Cập nhật</th>
                <th className="p-3 w-28 text-right sticky right-0 bg-slate-50 dark:bg-slate-800 z-10">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {paginatedServices.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-slate-400">
                    Không tìm thấy dịch vụ phù hợp với điều kiện lọc.
                  </td>
                </tr>
              ) : (
                paginatedServices.map((item) => {
                  const isSelected = selectedIds.includes(item.id);
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors ${
                        isSelected ? 'bg-orange-50/30 dark:bg-orange-950/20' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="p-3 text-center sticky left-0 bg-white dark:bg-slate-900 z-10">
                        <CmsSelectionCheckbox checked={isSelected} onChange={() => handleToggleSelect(item.id)} label={`Chọn dịch vụ ${item.title}`} />
                      </td>

                      {/* Title & Code */}
                      <td className="p-3 sticky left-10 bg-white dark:bg-slate-900 z-10">
                        <div className="flex items-start gap-3">
                          <img
                            src={item.thumbnail_url}
                            alt={item.title}
                            className="w-12 h-12 rounded-lg object-cover shrink-0 border border-slate-200 dark:border-slate-800 shadow-2xs"
                          />
                          <div className="space-y-0.5 max-w-xs">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                {item.code}
                              </span>
                              {item.quality_score < 70 && (
                                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/50 px-1.5 py-0.5 rounded border border-rose-200/50">
                                  Cảnh báo chất lượng
                                </span>
                              )}
                            </div>
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

                      {/* Group */}
                      <td className="p-3 font-medium text-slate-800 dark:text-slate-200">
                        {item.group_name}
                      </td>

                      {/* Owner */}
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={item.owner_avatar}
                            alt={item.owner_name}
                            className="w-5 h-5 rounded-full object-cover shrink-0"
                          />
                          <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                            {item.owner_name}
                          </span>
                        </div>
                      </td>

                      {/* Editorial Status */}
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            item.editorial_status === 'published'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : item.editorial_status === 'pending'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                              : item.editorial_status === 'approved'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {item.editorial_status}
                        </span>
                      </td>

                      {/* Service Status */}
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            item.service_status === 'active'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                              : item.service_status === 'archived'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                              : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                        >
                          {item.service_status}
                        </span>
                      </td>

                      {/* Placement Badges */}
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {(item.placement || []).map((p) => (
                            <span
                              key={p}
                              className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                            >
                              {p === 'home_featured' ? 'Trang chủ' : p === 'services_page' ? 'Catalog' : 'Footer'}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Updated By */}
                      <td className="p-3 text-slate-500 text-[11px]">
                        <div>{item.updated_by}</div>
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
                            onClick={() => setQuickEditService(item)}
                            icon={<SlidersHorizontal />}
                            size="sm"
                            aria-label="Sửa nhanh dịch vụ"
                            title="Sửa nhanh"
                          />

                          <CmsIconButton
                            onClick={() =>
                              setImpactModalState({
                                service: item,
                                actionType: item.service_status === 'active' ? 'deactivate' : 'archive',
                              })
                            }
                            icon={<Archive />}
                            size="sm"
                            aria-label={item.service_status === 'active' ? 'Ngừng cung cấp dịch vụ' : 'Lưu trữ dịch vụ'}
                            title={item.service_status === 'active' ? 'Ngừng cung cấp' : 'Lưu trữ'}
                          />

                          <CmsIconButton
                            onClick={() =>
                              setImpactModalState({
                                service: item,
                                actionType: 'delete',
                              })
                            }
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
        <CmsPagination currentPage={currentPage} pageSize={pageSize} totalCount={filteredServices.length} itemLabel="dịch vụ" pageSizeOptions={[10, 25, 50, 100]} onPageChange={setCurrentPage} onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }} />
      </div>

      {/* Overlays & Drawers */}
      <ServicePreviewModal
        isOpen={Boolean(previewService)}
        onClose={() => setPreviewService(null)}
        service={previewService}
      />

      <QuickEditModal
        isOpen={Boolean(quickEditService)}
        onClose={() => setQuickEditService(null)}
        service={quickEditService}
        groups={groups}
        owners={ownersList}
        onSave={(updated) => {
          handleSaveServiceFromForm(updated);
          showToast(`Đã lưu sửa nhanh dịch vụ ${updated.code}!`);
        }}
      />

      <ImpactWarningModal
        isOpen={Boolean(impactModalState)}
        onClose={() => setImpactModalState(null)}
        service={impactModalState?.service || null}
        actionType={impactModalState?.actionType || 'deactivate'}
        onConfirm={handleConfirmImpactAction}
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
