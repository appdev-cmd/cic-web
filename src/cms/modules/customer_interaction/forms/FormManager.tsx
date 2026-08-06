import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Grid,
  List,
  Download,
  FileCheck2,
} from 'lucide-react';
import { FormItem, FormListTabType, FormFilterState, FormFormData } from './types';
import { FormList } from './components/FormList';
import { FormBuilderView } from './FormBuilderView';
import { FormPreviewModal } from './components/FormPreviewModal';
import { FormSubmissionsModal } from './components/FormSubmissionsModal';
import { MOCK_FORMS } from './mockData';
import { FORM_STATUSES } from '../shared/constants/statusTypes';
import { CmsPageHeader } from '../../../components/ui/CmsPageHeader';
import { CmsButton } from '../../../components/ui/CmsButton';
import { CmsTabs } from '../../../components/ui/CmsTabs';
import { CmsBulkActionBar } from '../../../components/ui/CmsBulkActionBar';

export const FormManager: React.FC = () => {
  const [forms, setForms] = useState<FormItem[]>(MOCK_FORMS);
  const [selectedFormIds, setSelectedFormIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<FormListTabType>('all');
  const [pageMode, setPageMode] = useState<'list' | 'builder'>('list');
  const [filter, setFilter] = useState<FormFilterState>({
    searchQuery: '',
    tab: 'all',
  });
  const [editingForm, setEditingForm] = useState<FormItem | null>(null);
  const [previewForm, setPreviewForm] = useState<FormItem | null>(null);
  const [submissionsForm, setSubmissionsForm] = useState<FormItem | null>(null);

  // Filter forms based on current filters
  const filteredForms = forms.filter((form) => {
    // Tab filter
    if (activeTab === 'trash') {
      if (!form.deletedAt) return false;
    } else {
      if (form.deletedAt) return false;
    }

    if (activeTab === 'active' && form.status !== 'active') return false;
    if (activeTab === 'draft' && form.status !== 'draft') return false;
    if (activeTab === 'archived' && form.status !== 'archived') return false;

    // Search filter
    if (filter.searchQuery.trim()) {
      const query = filter.searchQuery.toLowerCase();
      const matchAdminName = form.adminName.toLowerCase().includes(query);
      const matchTitle = form.title.toLowerCase().includes(query);
      const matchCode = form.code.toLowerCase().includes(query);
      if (!matchAdminName && !matchTitle && !matchCode) return false;
    }

    // Status filter
    if (filter.status && form.status !== filter.status) return false;

    return true;
  });

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

  const handleOpenVersionHistory = (form: FormItem) => {
    // Version history or edit
    setEditingForm(form);
    setPageMode('builder');
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

  const handleTabChange = (tab: FormListTabType) => {
    setActiveTab(tab);
    setSelectedFormIds([]);
  };

  const handleSaveForm = (formData: FormFormData, action: 'draft' | 'submit' | 'publish') => {
    if (editingForm) {
      // Update existing form
      setForms(
        forms.map((f) =>
          f.id === editingForm.id
            ? {
                ...f,
                ...formData,
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
        ...formData,
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
    }

    setPageMode('list');
    setEditingForm(null);
  };

  if (pageMode === 'builder') {
    return (
      <FormBuilderView
        form={editingForm}
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

      {/* Tabs */}
      <CmsTabs
        items={[
          { id: 'all' as const, label: 'Tất cả', count: forms.filter((f) => !f.deletedAt).length },
          { id: 'active' as const, label: 'Đang hoạt động', count: forms.filter((f) => !f.deletedAt && f.status === 'active').length },
          { id: 'draft' as const, label: 'Bản nháp', count: forms.filter((f) => !f.deletedAt && f.status === 'draft').length },
          { id: 'archived' as const, label: 'Lưu trữ', count: forms.filter((f) => !f.deletedAt && f.status === 'archived').length },
          { id: 'trash' as const, label: 'Thùng rác', count: forms.filter((f) => f.deletedAt).length },
        ]}
        value={activeTab}
        onChange={handleTabChange}
        ariaLabel="Form status tabs"
      />

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, mã, tiêu đề..."
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
              {FORM_STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
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
        tab={activeTab}
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
