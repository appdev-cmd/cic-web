import React, { useState, useMemo } from 'react';
import {
  MailCheck,
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
  AlertCircle,
  Package,
} from 'lucide-react';
import { EmailTemplate, EMAIL_TYPES } from './types';
import { mockEmailTemplates } from './mockData';
import { EmailTemplatesFormView } from './EmailTemplatesFormView';
import { DeleteConfirmModal } from './DeleteConfirmModal';

export const EmailTemplatesManager: React.FC = () => {
  // Templates State
  const [templates, setTemplates] = useState<EmailTemplate[]>(mockEmailTemplates);

  // View Mode: 'list' or 'form'
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'hidden'>('all');

  // Multi-select Row State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState<EmailTemplate[]>([]);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRefresh = () => {
    showToast('Đã làm mới danh sách mẫu email!');
  };

  // Filtered Templates List
  const filteredTemplates = useMemo(() => {
    return templates.filter((item) => {
      const matchQuery =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase().trim());

      const matchType = selectedType === 'ALL' || item.types === selectedType;

      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'published' && item.published) ||
        (statusFilter === 'hidden' && !item.published);

      return matchQuery && matchType && matchStatus;
    });
  }, [templates, searchQuery, selectedType, statusFilter]);

  // Single Row Select Toggle
  const handleToggleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Select All Rows Toggle
  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredTemplates.length && filteredTemplates.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTemplates.map((t) => t.id));
    }
  };

  // Direct Toggle Published
  const handleTogglePublished = (id: string) => {
    setTemplates((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextVal = !t.published;
          showToast(
            nextVal
              ? `Đã kích hoạt xuất bản mẫu email "${t.name}"`
              : `Đã tạm ẩn mẫu email "${t.name}"`
          );
          return { ...t, published: nextVal };
        }
        return t;
      })
    );
  };

  // Batch Set Published / Hide
  const handleBatchSetPublished = (publishedState: boolean) => {
    if (selectedIds.length === 0) return;
    setTemplates((prev) =>
      prev.map((t) => (selectedIds.includes(t.id) ? { ...t, published: publishedState } : t))
    );
    showToast(
      publishedState
        ? `Đã xuất bản ${selectedIds.length} mẫu email đã chọn!`
        : `Đã ẩn ${selectedIds.length} mẫu email đã chọn!`
    );
    setSelectedIds([]);
  };

  // Trigger Single Delete
  const handleTriggerDeleteSingle = (tpl: EmailTemplate) => {
    setItemsToDelete([tpl]);
    setIsDeleteModalOpen(true);
  };

  // Trigger Batch Delete
  const handleTriggerDeleteBatch = () => {
    if (selectedIds.length === 0) return;
    const items = templates.filter((t) => selectedIds.includes(t.id));
    setItemsToDelete(items);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    const idsToRemove = itemsToDelete.map((i) => i.id);
    setTemplates((prev) => prev.filter((t) => !idsToRemove.includes(t.id)));
    setSelectedIds((prev) => prev.filter((id) => !idsToRemove.includes(id)));
    showToast(`Đã xóa thành công ${itemsToDelete.length} mẫu email!`);
    setIsDeleteModalOpen(false);
    setItemsToDelete([]);
  };

  // Open Form Create
  const handleOpenCreateForm = () => {
    setEditingTemplate(null);
    setViewMode('form');
  };

  // Open Form Edit
  const handleOpenEditForm = (tpl: EmailTemplate) => {
    setEditingTemplate(tpl);
    setViewMode('form');
  };

  // Save Template
  const handleSaveTemplate = (formData: Partial<EmailTemplate>) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    if (editingTemplate) {
      // Update existing
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === editingTemplate.id
            ? {
                ...t,
                ...formData,
                updated_time: nowStr,
              }
            : t
        )
      );
      showToast(`Đã cập nhật mẫu email "${formData.name}" thành công!`);
    } else {
      // Create new
      const newTemplate: EmailTemplate = {
        id: `tpl_${Date.now()}`,
        name: formData.name || 'Mẫu email mới',
        types: formData.types || 'quote_registration',
        products: formData.products || [],
        content: formData.content || '',
        lienhe_kd: formData.lienhe_kd || '',
        lienhe_kt: formData.lienhe_kt || '',
        lienhe_kdmb: formData.lienhe_kdmb || '',
        lienhe_kdmn: formData.lienhe_kdmn || '',
        published: formData.published ?? true,
        ordering: formData.ordering || 1,
        created_time: nowStr,
      };

      setTemplates([newTemplate, ...templates]);
      showToast(`Đã thêm mới mẫu email "${newTemplate.name}"!`);
    }

    setViewMode('list');
    setEditingTemplate(null);
  };

  // Helper to render type badge
  const renderTypeBadge = (typeVal: string) => {
    const typeObj = EMAIL_TYPES.find((t) => t.value === typeVal);
    if (!typeObj) {
      return (
        <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px] rounded-lg border border-slate-200 dark:border-slate-700">
          Khác
        </span>
      );
    }
    return (
      <span
        className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border ${typeObj.badgeClass} ${typeObj.badgeDarkClass}`}
      >
        {typeObj.label}
      </span>
    );
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

      {/* RENDER FORM VIEW OR LIST VIEW */}
      {viewMode === 'form' ? (
        <EmailTemplatesFormView
          templateToEdit={editingTemplate}
          onSave={handleSaveTemplate}
          onCancel={() => {
            setViewMode('list');
            setEditingTemplate(null);
          }}
        />
      ) : (
        <>
          {/* HEADER BAR */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl">
                  <MailCheck className="w-5 h-5" />
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  Quản lý Mẫu Email thông báo
                </h1>
                <span className="px-2.5 py-0.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold rounded-full">
                  {templates.length} mẫu email
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Quản lý nội dung các mẫu email tự động phục vụ liên hệ khách hàng, báo giá và thông báo phòng ban.
              </p>
            </div>

            {/* Top Right Action Button */}
            <button
              onClick={handleOpenCreateForm}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm mẫu email mới</span>
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
                  placeholder="Tìm kiếm mẫu email theo tên hoặc nội dung..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Email Type Filter */}
              <div className="md:col-span-4 relative">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
                >
                  <option value="ALL">-- Tất cả Loại Email ({EMAIL_TYPES.length}) --</option>
                  {EMAIL_TYPES.map((tOpt) => (
                    <option key={tOpt.value} value={tOpt.value}>
                      {tOpt.label}
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
                  Hiển thị: <strong>{filteredTemplates.length}</strong> / {templates.length} mẫu email
                </span>
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

          {/* TABLE LIST */}
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
                        {selectedIds.length === filteredTemplates.length && filteredTemplates.length > 0 ? (
                          <CheckSquare className="w-4 h-4 text-orange-600" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </th>
                    <th className="p-3.5 min-w-[300px]">Tên mẫu email</th>
                    <th className="p-3.5 w-60">Loại email</th>
                    <th className="p-3.5 w-32 text-center">Trạng thái</th>
                    <th className="p-3.5 w-28 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                  {filteredTemplates.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-slate-400">
                        <MailCheck className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="font-semibold">Không tìm thấy mẫu email phù hợp.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredTemplates.map((tpl) => {
                      const isSelected = selectedIds.includes(tpl.id);
                      return (
                        <tr
                          key={tpl.id}
                          className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                            isSelected ? 'bg-orange-50/40 dark:bg-orange-950/20' : ''
                          }`}
                        >
                          {/* Checkbox */}
                          <td className="p-3.5 text-center">
                            <button
                              onClick={() => handleToggleSelectRow(tpl.id)}
                              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                            >
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-orange-600" />
                              ) : (
                                <Square className="w-4 h-4" />
                              )}
                            </button>
                          </td>

                          {/* Tên mẫu (bold) */}
                          <td className="p-3.5">
                            <div className="space-y-1 max-w-xl">
                              <p
                                onClick={() => handleOpenEditForm(tpl)}
                                className="font-bold text-slate-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 cursor-pointer transition-colors leading-snug"
                              >
                                {tpl.name}
                              </p>

                              {/* Products chip preview */}
                              {tpl.products && tpl.products.length > 0 && (
                                <div className="flex flex-wrap items-center gap-1 pt-0.5">
                                  {tpl.products.map((p) => (
                                    <span
                                      key={p}
                                      className="px-1.5 py-0.2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-medium rounded border border-slate-200 dark:border-slate-700"
                                    >
                                      {p}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Loại email (Badge màu theo loại) */}
                          <td className="p-3.5">{renderTypeBadge(tpl.types)}</td>

                          {/* Trạng thái (Direct Switch Toggle) */}
                          <td className="p-3.5 text-center">
                            <button
                              onClick={() => handleTogglePublished(tpl.id)}
                              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                tpl.published ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                              }`}
                              title={tpl.published ? 'Mẫu email đang hoạt động' : 'Mẫu email dạng nháp/tạm ẩn'}
                            >
                              <span
                                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                  tpl.published ? 'translate-x-4' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </td>

                          {/* Nút Sửa & Single Delete */}
                          <td className="p-3.5 text-right space-x-1">
                            <button
                              onClick={() => handleOpenEditForm(tpl)}
                              className="p-1.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/50 rounded-lg transition-colors cursor-pointer"
                              title="Chỉnh sửa mẫu email"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleTriggerDeleteSingle(tpl)}
                              className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors cursor-pointer"
                              title="Xóa mẫu email"
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
        </>
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
