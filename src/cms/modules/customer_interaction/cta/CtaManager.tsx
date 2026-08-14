import React, { useState } from 'react';
import {
  Plus,
  Search,
  MousePointer2,
  Calendar,
  X,
  RotateCcw,
} from 'lucide-react';
import { CtaItem, CtaListTabType, CtaFilterState, CtaFormData } from './types';
import { CtaList } from './components/CtaList';
import { CtaFormView } from './CtaFormView';
import { CtaPreviewModal } from './components/CtaPreviewModal';
import { CtaUsedByModal } from './components/CtaUsedByModal';
import { CTA_STATUSES, CTA_STATUS_LABELS, CtaStatus } from '../shared/constants/statusTypes';
import { ACTION_TYPES } from '../shared/constants/actionTypes';
import { CmsPageHeader } from '../../../components/ui/CmsPageHeader';
import { CmsButton } from '../../../components/ui/CmsButton';
import { CmsTabs } from '../../../components/ui/CmsTabs';
import { CmsBulkActionBar } from '../../../components/ui/CmsBulkActionBar';
import type { CmsLocale } from '../../../data/CmsDataSource';
import type { CtaModuleData } from '../../../data/CustomerInteractionDataSource';

interface CtaManagerProps {
  workspaceLocale: CmsLocale;
  data?: CtaModuleData;
}

export const CtaManager: React.FC<CtaManagerProps> = ({ workspaceLocale, data }) => {
  const [ctas, setCtas] = useState<CtaItem[]>(data?.ctas ?? []);
  const [selectedCtaIds, setSelectedCtaIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<CtaListTabType>('all');
  const [filter, setFilter] = useState<CtaFilterState>({
    searchQuery: '',
    tab: 'all',
  });
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
  const [editingCta, setEditingCta] = useState<CtaItem | null>(null);
  const [previewCta, setPreviewCta] = useState<CtaItem | null>(null);
  const [usedByCta, setUsedByCta] = useState<CtaItem | null>(null);

  // Filter & sort ctas based on current filters
  const filteredCtas = ctas
    .filter((cta) => {
      // Tab filter
      if (activeTab === 'trash') {
        if (!cta.deletedAt) return false;
      } else {
        if (cta.deletedAt) return false;
      }

      if (activeTab === 'active' && cta.status !== 'active') return false;
      if (activeTab === 'draft' && cta.status !== 'draft') return false;
      if (activeTab === 'archived' && cta.status !== 'archived') return false;

      // Status filter
      if (filter.status && cta.status !== filter.status) return false;

      // Search filter
      if (filter.searchQuery.trim()) {
        const query = filter.searchQuery.toLowerCase();
        const matchAdminName = cta.adminName.toLowerCase().includes(query);
        const matchDisplayText = cta.displayText.toLowerCase().includes(query);
        const matchCode = cta.code.toLowerCase().includes(query);
        if (!matchAdminName && !matchDisplayText && !matchCode) return false;
      }

      // Action type filter
      if (filter.actionType && cta.actionConfig.type !== filter.actionType) return false;

      // Date range filter
      if (filter.dateFrom) {
        const fromDate = new Date(filter.dateFrom);
        fromDate.setHours(0, 0, 0, 0);
        const created = new Date(cta.createdAt);
        if (created < fromDate) return false;
      }

      if (filter.dateTo) {
        const toDate = new Date(filter.dateTo);
        toDate.setHours(23, 59, 59, 999);
        const created = new Date(cta.createdAt);
        if (created > toDate) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (filter.sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (filter.sortBy === 'clicks') {
        return (b.analytics?.clicks || 0) - (a.analytics?.clicks || 0);
      }
      if (filter.sortBy === 'ctr') {
        return (b.analytics?.ctr || 0) - (a.analytics?.ctr || 0);
      }
      if (filter.sortBy === 'name') {
        return a.adminName.localeCompare(b.adminName, 'vi');
      }
      // Default: newest first
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const hasActiveFilters =
    !!filter.searchQuery ||
    !!filter.status ||
    !!filter.actionType ||
    !!filter.dateFrom ||
    !!filter.dateTo ||
    !!filter.sortBy;

  const handleResetFilters = () => {
    setFilter({
      searchQuery: '',
      status: undefined,
      actionType: undefined,
      dateFrom: undefined,
      dateTo: undefined,
      sortBy: undefined,
      tab: 'all',
    });
    setActiveTab('all');
  };

  // Handlers
  const handleToggleSelectAll = () => {
    if (selectedCtaIds.length === filteredCtas.length) {
      setSelectedCtaIds([]);
    } else {
      setSelectedCtaIds(filteredCtas.map((c) => c.id));
    }
  };

  const handleToggleSelectCta = (id: string) => {
    if (selectedCtaIds.includes(id)) {
      setSelectedCtaIds(selectedCtaIds.filter((item) => item !== id));
    } else {
      setSelectedCtaIds([...selectedCtaIds, id]);
    }
  };

  const handleEditCta = (cta: CtaItem) => {
    setEditingCta(cta);
    setViewMode('form');
  };

  const handleCreateNew = () => {
    setEditingCta(null);
    setViewMode('form');
  };

  const handleOpenPreview = (cta: CtaItem) => {
    setPreviewCta(cta);
  };

  const handleOpenUsedBy = (cta: CtaItem) => {
    setUsedByCta(cta);
  };

  const handleDuplicateCta = (cta: CtaItem) => {
    const newCta: CtaItem = {
      ...cta,
      id: `cta_${Date.now()}`,
      adminName: `${cta.adminName} (Bản sao)`,
      code: `${cta.code}_copy`,
      usedByCount: 0,
      usedByPages: [],
      analytics: {
        impressions: 0,
        clicks: 0,
        ctr: 0,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCtas([newCta, ...ctas]);
  };

  const handleDeleteCta = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa CTA này?')) {
      setCtas(ctas.map((c) => (c.id === id ? { ...c, deletedAt: new Date().toISOString() } : c)));
    }
  };

  const handleQuickStatusToggle = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'inactive' : 'active';
    setCtas(
      ctas.map((c) =>
        c.id === id
          ? {
              ...c,
              status: nextStatus as any,
              updatedAt: new Date().toISOString(),
            }
          : c
      )
    );
  };

  const handleTabChange = (tab: CtaListTabType) => {
    setActiveTab(tab);
    setSelectedCtaIds([]);

    // Map top tab selection directly to status filter
    if (tab === 'active') {
      setFilter((prev) => ({ ...prev, status: 'active' }));
    } else if (tab === 'draft') {
      setFilter((prev) => ({ ...prev, status: 'draft' }));
    } else if (tab === 'archived') {
      setFilter((prev) => ({ ...prev, status: 'archived' }));
    } else {
      setFilter((prev) => ({ ...prev, status: undefined }));
    }
  };

  const handleStatusFilterChange = (statusVal: string) => {
    const newStatus = statusVal ? (statusVal as CtaStatus) : undefined;
    setFilter((prev) => ({ ...prev, status: newStatus }));

    // Synchronize tab when status filter changes
    if (!statusVal) {
      setActiveTab('all');
    } else if (statusVal === 'active') {
      setActiveTab('active');
    } else if (statusVal === 'draft') {
      setActiveTab('draft');
    } else if (statusVal === 'archived') {
      setActiveTab('archived');
    } else {
      setActiveTab('all');
    }
  };

  const handleSaveCta = (ctaData: CtaFormData, action: 'draft' | 'publish') => {
    const normalizedData: CtaFormData = {
      ...ctaData,
      status: action === 'publish' ? 'active' : 'draft',
    };
    if (editingCta) {
      // Update existing CTA
      setCtas(
        ctas.map((c) =>
          c.id === editingCta.id
            ? {
                ...c,
                ...normalizedData,
                updatedAt: new Date().toISOString(),
              }
            : c
        )
      );
    } else {
      // Create new CTA
      const newCta: CtaItem = {
        id: `cta_${Date.now()}`,
        ...normalizedData,
        usedByCount: 0,
        usedByPages: [],
        analytics: {
          impressions: 0,
          clicks: 0,
          ctr: 0,
        },
        createdBy: 'Current User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCtas([newCta, ...ctas]);
    }

    setViewMode('list');
    setEditingCta(null);
  };

  if (viewMode === 'form') {
    return (
      <CtaFormView
        cta={editingCta}
        workspaceLocale={workspaceLocale}
        forms={data?.forms ?? []}
        emailTemplates={data?.emailTemplates ?? []}
        downloadFiles={data?.downloadFiles ?? []}
        onSave={handleSaveCta}
        onCancel={() => {
          setViewMode('list');
          setEditingCta(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <CmsPageHeader
        icon={<MousePointer2 />}
        title="Quản lý CTA"
        description="Quản lý nút kêu gọi hành động trên toàn website"
        meta={<span className="rounded-md bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">{ctas.filter((c) => !c.deletedAt).length} CTA</span>}
        actions={
          <CmsButton variant="primary" size="sm" onClick={handleCreateNew} leadingIcon={<Plus />}>
            Tạo CTA mới
          </CmsButton>
        }
      />

      {/* Tabs */}
      <CmsTabs
        items={[
          { id: 'all' as const, label: 'Tất cả', count: ctas.filter((c) => !c.deletedAt).length },
          { id: 'active' as const, label: 'Đang hoạt động', count: ctas.filter((c) => !c.deletedAt && c.status === 'active').length },
          { id: 'draft' as const, label: 'Bản nháp', count: ctas.filter((c) => !c.deletedAt && c.status === 'draft').length },
          { id: 'archived' as const, label: 'Lưu trữ', count: ctas.filter((c) => !c.deletedAt && c.status === 'archived').length },
          { id: 'trash' as const, label: 'Thùng rác', count: ctas.filter((c) => c.deletedAt).length },
        ]}
        value={activeTab}
        onChange={handleTabChange}
        ariaLabel="CTA status tabs"
      />

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, mã, nội dung..."
              value={filter.searchQuery}
              onChange={(e) => setFilter({ ...filter, searchQuery: e.target.value })}
              className="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 transition-colors"
            />
            {filter.searchQuery && (
              <button
                type="button"
                onClick={() => setFilter({ ...filter, searchQuery: '' })}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns & Controls */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs flex-wrap lg:flex-nowrap">
            {/* Status Dropdown mapped to activeTab */}
            <select
              value={filter.status || ''}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="">Tất cả Trạng thái</option>
              {CTA_STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>

            {/* Action Type Dropdown */}
            <select
              value={filter.actionType || ''}
              onChange={(e) => setFilter({ ...filter, actionType: (e.target.value as any) || undefined })}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="">Tất cả Hành động</option>
              {ACTION_TYPES.map((action) => (
                <option key={action.value} value={action.value}>
                  {action.label}
                </option>
              ))}
            </select>

            {/* Date Range Inputs */}
            <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-600 dark:text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              <span className="text-[11px] text-slate-400">Từ:</span>
              <input
                type="date"
                value={filter.dateFrom || ''}
                onChange={(e) => setFilter({ ...filter, dateFrom: e.target.value || undefined })}
                className="bg-transparent focus:outline-none text-xs text-slate-800 dark:text-slate-200 cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-600 dark:text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              <span className="text-[11px] text-slate-400">Đến:</span>
              <input
                type="date"
                value={filter.dateTo || ''}
                onChange={(e) => setFilter({ ...filter, dateTo: e.target.value || undefined })}
                className="bg-transparent focus:outline-none text-xs text-slate-800 dark:text-slate-200 cursor-pointer"
              />
            </div>

            {/* Sort Dropdown */}
            <select
              value={filter.sortBy || 'newest'}
              onChange={(e) => setFilter({ ...filter, sortBy: e.target.value as any })}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="clicks">Lượt nhấp nhiều nhất</option>
              <option value="ctr">Tỷ lệ CTR cao nhất</option>
              <option value="name">Tên (A-Z)</option>
            </select>

            {/* Reset Filters Button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="ml-auto flex h-9 w-24 shrink-0 items-center justify-center gap-1 rounded-xl bg-slate-100 px-0 text-xs font-semibold text-slate-600 transition-all hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer"
                title="Xóa tất cả điều kiện lọc"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Xóa bộ lọc</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      <CmsBulkActionBar
        selectedCount={selectedCtaIds.length}
        itemLabel="CTA"
        onClear={() => setSelectedCtaIds([])}
        actions={[
          {
            label: 'Đổi trạng thái',
            onClick: () => console.log('Change status'),
          },
          {
            label: 'Lưu trữ',
            onClick: () => console.log('Archive'),
          },
          {
            label: 'Xóa',
            variant: 'danger',
            onClick: () => console.log('Delete'),
          },
        ]}
      />

      {/* CTA List */}
      <CtaList
        ctas={filteredCtas}
        selectedCtaIds={selectedCtaIds}
        tab={activeTab}
        onToggleSelectAll={handleToggleSelectAll}
        onToggleSelectCta={handleToggleSelectCta}
        onEditCta={handleEditCta}
        onOpenPreview={handleOpenPreview}
        onOpenUsedBy={handleOpenUsedBy}
        onDuplicateCta={handleDuplicateCta}
        onDeleteCta={handleDeleteCta}
        onQuickStatusToggle={handleQuickStatusToggle}
      />

      {/* Modals */}
      <CtaPreviewModal
        isOpen={!!previewCta}
        cta={previewCta}
        onClose={() => setPreviewCta(null)}
      />

      <CtaUsedByModal
        isOpen={!!usedByCta}
        cta={usedByCta}
        onClose={() => setUsedByCta(null)}
      />
    </div>
  );
};
