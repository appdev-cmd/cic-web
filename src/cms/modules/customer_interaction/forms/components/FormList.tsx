import React, { useState } from 'react';
import {
  Eye,
  Edit3,
  Copy,
  Trash2,
  FileText,
  List,
  CheckCircle,
  Clock,
  FilePlus,
} from 'lucide-react';
import { FormItem, FormListTabType } from '../types';
import { FORM_STATUS_LABELS } from '../../shared/constants/statusTypes';
import { CmsIconButton } from '../../../../components/ui/CmsButton';
import { CmsPagination } from '../../../../components/ui/CmsPagination';

interface FormListProps {
  forms: FormItem[];
  selectedFormIds: string[];
  tab: FormListTabType;
  onToggleSelectAll: () => void;
  onToggleSelectForm: (id: string) => void;
  onEditForm: (form: FormItem) => void;
  onOpenPreview: (form: FormItem) => void;
  onOpenSubmissions: (form: FormItem) => void;
  onDuplicateForm: (form: FormItem) => void;
  onDeleteForm: (id: string) => void;
  onQuickStatusToggle: (id: string, currentStatus: string) => void;
}

export const FormList: React.FC<FormListProps> = ({
  forms,
  selectedFormIds,
  tab,
  onToggleSelectAll,
  onToggleSelectForm,
  onEditForm,
  onOpenPreview,
  onOpenSubmissions,
  onDuplicateForm,
  onDeleteForm,
  onQuickStatusToggle,
}) => {
  const isAllSelected = forms.length > 0 && selectedFormIds.length === forms.length;
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const paginatedForms = forms.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300',
      inactive: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300',
      draft: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/40 dark:text-yellow-300',
      archived: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300',
    };
    return colors[status] || colors.draft;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="cms-data-table text-left">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-850 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 select-none">
              <th className="p-3 w-10 sticky left-0 bg-slate-50/90 dark:bg-slate-850 z-10">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onToggleSelectAll}
                  className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                />
              </th>
              <th className="p-3 min-w-[200px]">Tên quản trị</th>
              <th className="p-3 min-w-[150px]">Tiêu đề</th>
              <th className="p-3 min-w-[100px]">Trường</th>
              <th className="p-3 min-w-[120px]">Thống kê</th>
              <th className="p-3 min-w-[120px]">Trạng thái</th>
              <th className="p-3 min-w-[100px]">Ngày tạo</th>
              <th className="p-3 w-28 text-right sticky right-0 bg-slate-50/90 dark:bg-slate-850 z-10">Thao tác</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-300">
            {paginatedForms.map((form) => {
              const isSelected = selectedFormIds.includes(form.id);

              return (
                <tr
                  key={form.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                >
                  {/* Checkbox */}
                  <td className="p-3 sticky left-0 bg-white dark:bg-slate-900 z-10">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelectForm(form.id)}
                      className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                    />
                  </td>

                  {/* Admin Name */}
                  <td className="p-3">
                    <button
                      type="button"
                      onClick={() => onEditForm(form)}
                      className="font-bold text-slate-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 text-left line-clamp-1 transition-colors"
                    >
                      {form.adminName}
                    </button>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-[10px] text-slate-400">{form.code}</span>
                      {form.description && (
                        <span className="text-[10px] text-slate-400 truncate max-w-[100px]">
                          {form.description}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Title */}
                  <td className="p-3">
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {form.title}
                    </span>
                  </td>

                  {/* Fields Count */}
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <FilePlus className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[10px] text-slate-600 dark:text-slate-400">
                        {form.fields.length} trường
                      </span>
                    </div>
                  </td>

                  {/* Analytics */}
                  <td className="p-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {formatNumber(form.stats.submissions)}
                        </span>
                        <span className="text-[10px] text-slate-400">lượt gửi</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {form.stats.conversionRate}%
                        </span>
                        <span className="text-[10px] text-slate-400">tỷ lệ</span>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="p-3">
                    <button
                      type="button"
                      onClick={() => onQuickStatusToggle(form.id, form.status)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-all ${getStatusColor(form.status)}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      <span>{FORM_STATUS_LABELS[form.status]}</span>
                    </button>
                  </td>

                  {/* Created Date */}
                  <td className="p-3">
                    <div className="text-slate-600 dark:text-slate-400">
                      {new Date(form.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="p-3 text-right sticky right-0 bg-white dark:bg-slate-900 z-10">
                    <div className="flex items-center justify-end gap-1">
                      <CmsIconButton
                        onClick={() => onOpenPreview(form)}
                        icon={<Eye />}
                        size="sm"
                        aria-label="Xem trước biểu mẫu"
                        title="Xem trước biểu mẫu"
                      />
                      <CmsIconButton
                        onClick={() => onOpenSubmissions(form)}
                        icon={<CheckCircle />}
                        size="sm"
                        aria-label="Yêu cầu đã gửi"
                        title="Yêu cầu đã gửi"
                      />
                      <CmsIconButton
                        onClick={() => onDuplicateForm(form)}
                        icon={<Copy />}
                        size="sm"
                        aria-label="Nhân bản biểu mẫu"
                        title="Nhân bản biểu mẫu"
                      />
                      <CmsIconButton
                        onClick={() => onEditForm(form)}
                        icon={<Edit3 />}
                        size="sm"
                        aria-label="Chỉnh sửa biểu mẫu"
                        title="Chỉnh sửa biểu mẫu"
                      />
                      <CmsIconButton
                        onClick={() => onDeleteForm(form.id)}
                        icon={<Trash2 />}
                        size="sm"
                        variant="danger"
                        aria-label="Xóa biểu mẫu"
                        title="Xóa biểu mẫu"
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {forms.length === 0 && (
        <div className="py-12 text-center text-slate-500 dark:text-slate-400">
          <List className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm font-medium">Không có biểu mẫu nào</p>
          <p className="text-xs mt-1">Hãy tạo biểu mẫu mới để bắt đầu</p>
        </div>
      )}
      {forms.length > 0 && <CmsPagination currentPage={currentPage} pageSize={pageSize} totalCount={forms.length} itemLabel="biểu mẫu" onPageChange={setCurrentPage} onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }} />}
    </div>
  );
};
