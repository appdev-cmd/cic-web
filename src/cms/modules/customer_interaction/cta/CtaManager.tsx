import React, { useState } from 'react';
import {
  Plus,
  Search,
  MousePointer2,
  Download,
} from 'lucide-react';
import { CtaItem, CtaListTabType, CtaFilterState, CtaFormData } from './types';
import { CtaList } from './components/CtaList';
import { CtaFormView } from './CtaFormView';
import { CtaPreviewModal } from './components/CtaPreviewModal';
import { CtaUsedByModal } from './components/CtaUsedByModal';
import { MOCK_CTAS } from './mockData';
import { CTA_STATUSES } from '../shared/constants/statusTypes';
import { ACTION_TYPES } from '../shared/constants/actionTypes';
import { CmsPageHeader } from '../../../components/ui/CmsPageHeader';
import { CmsButton } from '../../../components/ui/CmsButton';
import { CmsTabs } from '../../../components/ui/CmsTabs';
import { CmsBulkActionBar } from '../../../components/ui/CmsBulkActionBar';

export const CtaManager: React.FC = () => {
  const [ctas, setCtas] = useState<CtaItem[]>(MOCK_CTAS);
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

  // Filter ctas based on current filters
  const filteredCtas = ctas.filter((cta) => {
    // Tab filter
    if (activeTab === 'trash') {
      if (!cta.deletedAt) return false;
    } else {
      if (cta.deletedAt) return false;
    }

    if (activeTab === 'active' && cta.status !== 'active') return false;
    if (activeTab === 'draft' && cta.status !== 'draft') return false;
    if (activeTab === 'archived' && cta.status !== 'archived') return false;

    // Search filter
    if (filter.searchQuery.trim()) {
      const query = filter.searchQuery.toLowerCase();
      const matchAdminName = cta.adminName.toLowerCase().includes(query);
      const matchDisplayText = cta.displayText.toLowerCase().includes(query);
      const matchCode = cta.code.toLowerCase().includes(query);
      if (!matchAdminName && !matchDisplayText && !matchCode) return false;
    }

    // Status filter
    if (filter.status && cta.status !== filter.status) return false;

    // Action type filter
    if (filter.actionType && cta.actionConfig.type !== filter.actionType) return false;

    return true;
  });

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
  };

  const handleSaveCta = (ctaData: CtaFormData, action: 'draft' | 'submit' | 'publish') => {
    if (editingCta) {
      // Update existing CTA
      setCtas(
        ctas.map((c) =>
          c.id === editingCta.id
            ? {
                ...c,
                ...ctaData,
                updatedAt: new Date().toISOString(),
              }
            : c
        )
      );
    } else {
      // Create new CTA
      const newCta: CtaItem = {
        id: `cta_${Date.now()}`,
        ...ctaData,
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
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <select
              value={filter.status || ''}
              onChange={(e) => setFilter({ ...filter, status: e.target.value as any || undefined })}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="">Tất cả Trạng thái</option>
              {CTA_STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>

            <select
              value={filter.actionType || ''}
              onChange={(e) => setFilter({ ...filter, actionType: e.target.value as any || undefined })}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="">Tất cả Hành động</option>
              {ACTION_TYPES.map((action) => (
                <option key={action.value} value={action.value}>
                  {action.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-orange-600" />
              <span>Export</span>
            </button>
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
