import React, { useState } from 'react';
import {
  Plus,
  Search,
  FileCheck2,
  Calendar,
  X,
  RotateCcw,
} from 'lucide-react';
import { FormItem, FormFilterState, FormFormData } from './types';
import { FormList } from './components/FormList';
import { FormBuilderView } from './FormBuilderView';
import { FormPreviewModal } from './components/FormPreviewModal';
import { FormSubmissionsModal } from './components/FormSubmissionsModal';
import { FORM_STATUSES, FormStatus } from '../shared/constants/statusTypes';
import { CmsPageHeader } from '../../../components/ui/CmsPageHeader';
import { CmsButton } from '../../../components/ui/CmsButton';
import { CmsBulkActionBar } from '../../../components/ui/CmsBulkActionBar';
import type { CmsLocale } from '../../../data/CmsDataSource';
import type { FormModuleData } from '../../../data/CustomerInteractionDataSource';

interface FormManagerProps {
  workspaceLocale: CmsLocale;
  data?: FormModuleData;
}

export const FormManager: React.FC<FormManagerProps> = ({ workspaceLocale, data }) => {
  const [forms, setForms] = useState<FormItem[]>(data?.forms ?? []);
  const [selectedFormIds, setSelectedFormIds] = useState<string[]>([]);
  const [pageMode, setPageMode] = useState<'list' | 'builder'>('list');
  const [filter, setFilter] = useState<FormFilterState>({
    searchQuery: '',
    tab: 'all',
  });
  const [editingForm, setEditingForm] = useState<FormItem | null>(null);
  const [previewForm, setPreviewForm] = useState<FormItem | null>(null);
  const [submissionsForm, setSubmissionsForm] = useState<FormItem | null>(null);

  // Filter & sort forms based on current filters
  const filteredForms = forms
    .filter((form) => {
      if (form.deletedAt) return false;

      // Status filter
      if (filter.status && form.status !== filter.status) return false;

      // Search filter
      if (filter.searchQuery.trim()) {
        const query = filter.searchQuery.toLowerCase();
        const matchAdminName = form.adminName.toLowerCase().includes(query);
        const matchTitle = form.title.toLowerCase().includes(query);
        const matchCode = form.code.toLowerCase().includes(query);
        if (!matchAdminName && !matchTitle && !matchCode) return false;
      }

      // Date range filter
      if (filter.dateFrom) {
        const fromDate = new Date(filter.dateFrom);
        fromDate.setHours(0, 0, 0, 0);
        const created = new Date(form.createdAt);
        if (created < fromDate) return false;
      }

      if (filter.dateTo) {
        const toDate = new Date(filter.dateTo);
        toDate.setHours(23, 59, 59, 999);
        const created = new Date(form.createdAt);
        if (created > toDate) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (filter.sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (filter.sortBy === 'submissions') {
        const subA = a.stats?.submissions || a.analytics?.clicks || 0;
        const subB = b.stats?.submissions || b.analytics?.clicks || 0;
        return subB - subA;
      }
      if (filter.sortBy === 'conversionRate') {
        const crA = a.stats?.conversionRate || a.analytics?.ctr || 0;
        const crB = b.stats?.conversionRate || b.analytics?.ctr || 0;
        return crB - crA;
      }
      if (filter.sortBy === 'name') {
        return a.title.localeCompare(b.title, 'vi');
      }
      // Default: newest first
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const hasActiveFilters =
    !!filter.searchQuery ||
    !!filter.status ||
    !!filter.dateFrom ||
    !!filter.dateTo ||
    !!filter.sortBy;

  const handleResetFilters = () => {
    setFilter({
      searchQuery: '',
      status: undefined,
      dateFrom: undefined,
      dateTo: undefined,
      sortBy: undefined,
      tab: 'all',
    });
  };

  // Handlers
  const handleToggleSelectAll = () => {
    if (selectedFormIds.length === filteredForms.length) {
      setSelectedFormIds([]);
    } else {
      setSelectedFormIds(filteredForms.map((f) => f.id));
    }
  };

  const handleToggleSelectForm = (id: string) => {
    if (selectedFormIds.includes(id)) {
      setSelectedFormIds(selectedFormIds.filter((item) => item !== id));
    } else {
      setSelectedFormIds([...selectedFormIds, id]);
    }
  };

  const handleEditForm = (form: FormItem) => {
    setEditingForm(form);
    setPageMode('builder');
  };

  const handleCreateNew = () => {
    setEditingForm(null);
    setPageMode('builder');
  };

  const handleOpenPreview = (form: FormItem) => {
    setPreviewForm(form);
  };

  const handleDuplicateForm = (form: FormItem) => {
    const newForm: FormItem = {
      ...form,
      id: `form_${Date.now()}`,
      adminName: `${form.adminName} (Bản sao)`,
      code: `${form.code}_copy`,
      currentVersion: 1,
      analytics: {
        impressions: 0,
        clicks: 0,
        ctr: 0,
      },
      createdBy: 'Current User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setForms([newForm, ...forms]);
  };

  const handleDeleteForm = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa biểu mẫu này?')) {
      setForms(forms.map((f) => (f.id === id ? { ...f, deletedAt: new Date().toISOString() } : f)));
    }
  };

  const handleQuickStatusToggle = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'inactive' : 'active';
    setForms(
      forms.map((f) =>
        f.id === id
          ? {
              ...f,
              status: nextStatus as any,
              updatedAt: new Date().toISOString(),
            }
          : f
      )
    );
  };

  const handleOpenSubmissions = (form: FormItem) => {
    setSubmissionsForm(form);
  };

  const handleStatusFilterChange = (statusVal: string) => {
    const newStatus = statusVal ? (statusVal as FormStatus) : undefined;
    setFilter((prev) => ({ ...prev, status: newStatus }));
  };

  const handleSaveForm = (formData: FormFormData, action: 'draft' | 'publish') => {
    const normalizedData: FormFormData = {
      ...formData,
      status: action === 'publish' ? 'active' : 'draft',
    };
    if (editingForm) {
      // Update existing form
      setForms(
        forms.map((f) =>
          f.id === editingForm.id
            ? {
                ...f,
                ...normalizedData,
                currentVersion: action === 'publish' ? f.currentVersion + 1 : f.currentVersion,
                updatedAt: new Date().toISOString(),
              }
            : f
        )
      );
    } else {
      // Create new form
      const newForm: FormItem = {
        id: `form_${Date.now()}`,
        ...normalizedData,
        currentVersion: 1,
        analytics: {
          impressions: 0,
          clicks: 0,
          ctr: 0,
        },
        createdBy: 'Current User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        governance: { origin: 'custom', allowedPlacements: ['rich_text', 'cta_action'] },
      };
      setForms([newForm, ...forms]);
    }

    setPageMode('list');
    setEditingForm(null);
  };

  if (pageMode === 'builder') {
    return (
      <FormBuilderView
        form={editingForm}
        workspaceLocale={workspaceLocale}
        emailTemplates={data?.emailTemplates ?? []}
        onSave={handleSaveForm}
        onCancel={() => {
          setPageMode('list');
          setEditingForm(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <CmsPageHeader
        icon={<FileCheck2 />}
        title="Quản lý Biểu mẫu"
        description="Quản lý biểu mẫu thu thập thông tin khách hàng"
        meta={<span className="rounded-md bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">{forms.filter((f) => !f.deletedAt).length} biểu mẫu</span>}
        actions={
          <CmsButton variant="primary" size="sm" onClick={handleCreateNew} leadingIcon={<Plus />}>
            Tạo biểu mẫu mới
          </CmsButton>
        }
      />

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex items-center flex-1 max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="w-4 h-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, mã, tiêu đề..."
              value={filter.searchQuery}
              onChange={(e) => setFilter({ ...filter, searchQuery: e.target.value })}
              className="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 transition-colors"
            />
            {filter.searchQuery && (
              <button
                type="button"
                onClick={() => setFilter({ ...filter, searchQuery: '' })}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns & Controls */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs flex-wrap lg:flex-nowrap">
            {/* Status filter */}
            <select
              value={filter.status || ''}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="">Tất cả Trạng thái</option>
              {FORM_STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
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
              <option value="submissions">Lượt gửi nhiều nhất</option>
              <option value="conversionRate">Tỷ lệ chuyển đổi cao nhất</option>
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
        selectedCount={selectedFormIds.length}
        itemLabel="biểu mẫu"
        onClear={() => setSelectedFormIds([])}
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

      {/* Form List */}
      <FormList
        forms={filteredForms}
        selectedFormIds={selectedFormIds}
        onToggleSelectAll={handleToggleSelectAll}
        onToggleSelectForm={handleToggleSelectForm}
        onEditForm={handleEditForm}
        onOpenPreview={handleOpenPreview}
        onOpenSubmissions={handleOpenSubmissions}
        onDuplicateForm={handleDuplicateForm}
        onDeleteForm={handleDeleteForm}
        onQuickStatusToggle={handleQuickStatusToggle}
      />

      {/* Modals */}
      <FormPreviewModal
        isOpen={!!previewForm}
        form={previewForm}
        onClose={() => setPreviewForm(null)}
      />

      <FormSubmissionsModal
        isOpen={!!submissionsForm}
        form={submissionsForm}
        onClose={() => setSubmissionsForm(null)}
      />
    </div>
  );
};
