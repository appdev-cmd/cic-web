import React, { useState } from 'react';
import {
  Eye,
  Edit3,
  Copy,
  Trash2,
  FileText,
  List,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { CustomerRequest, RequestListTabType } from '../types';
import { REQUEST_STATUS_LABELS } from '../../shared/constants/statusTypes';
import { CmsIconButton } from '../../../../components/ui/CmsButton';
import { CmsPagination } from '../../../../components/ui/CmsPagination';

interface RequestListProps {
  requests: CustomerRequest[];
  selectedRequestIds: string[];
  tab: RequestListTabType;
  onToggleSelectAll: () => void;
  onToggleSelectRequest: (id: string) => void;
  onViewRequest: (request: CustomerRequest) => void;
  onDuplicateRequest: (request: CustomerRequest) => void;
  onDeleteRequest: (id: string) => void;
  onQuickStatusToggle: (id: string, currentStatus: string) => void;
}

export const RequestList: React.FC<RequestListProps> = ({
  requests,
  selectedRequestIds,
  tab,
  onToggleSelectAll,
  onToggleSelectRequest,
  onViewRequest,
  onDuplicateRequest,
  onDeleteRequest,
  onQuickStatusToggle,
}) => {
  const isAllSelected = requests.length > 0 && selectedRequestIds.length === requests.length;
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const paginatedRequests = requests.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300',
      processing: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/40 dark:text-yellow-300',
      completed: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300',
      not_suitable: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300',
      cancelled: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300',
    };
    return colors[status] || colors.new;
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, any> = {
      new: Clock,
      processing: AlertCircle,
      completed: CheckCircle,
      not_suitable: XCircle,
      cancelled: XCircle,
    };
    return icons[status] || Clock;
  };

  const getCustomerName = (request: CustomerRequest): string => {
    const nameField = request.submissionValues.find((v) => v.fieldKey === 'full_name' || v.fieldType === 'text');
    if (nameField?.valueText) {
      return nameField.valueText;
    }
    const emailField = request.submissionValues.find((v) => v.fieldKey === 'email' || v.fieldType === 'email');
    if (emailField?.valueText) {
      return emailField.valueText.split('@')[0];
    }
    const phoneField = request.submissionValues.find((v) => v.fieldKey === 'phone' || v.fieldType === 'phone');
    if (phoneField?.valueText) {
      return phoneField.valueText;
    }
    return 'Khách hàng';
  };

  const getCustomerEmail = (request: CustomerRequest): string => {
    const emailField = request.submissionValues.find((v) => v.fieldKey === 'email' || v.fieldType === 'email');
    return emailField?.valueText || '';
  };

  const getCustomerPhone = (request: CustomerRequest): string => {
    const phoneField = request.submissionValues.find((v) => v.fieldKey === 'phone' || v.fieldType === 'phone');
    return phoneField?.valueText || '';
  };

  const getCustomerCompany = (request: CustomerRequest): string => {
    const companyField = request.submissionValues.find((v) => v.fieldKey === 'company' || v.fieldType === 'text');
    return companyField?.valueText || '';
  };

  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString('vi-VN');
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
              <th className="p-3 min-w-[180px]">Khách hàng</th>
              <th className="p-3 min-w-[120px]">Điện thoại</th>
              <th className="p-3 min-w-[140px]">Biểu mẫu</th>
              <th className="p-3 min-w-[130px]">CTA</th>
              <th className="p-3 min-w-[150px]">Trang</th>
              <th className="p-3 min-w-[120px]">Ngày gửi</th>
              <th className="p-3 min-w-[120px]">Trạng thái</th>
              <th className="p-3 w-28 text-right sticky right-0 bg-slate-50/90 dark:bg-slate-850 z-10">Thao tác</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-300">
            {paginatedRequests.map((request) => {
              const isSelected = selectedRequestIds.includes(request.id);
              const StatusIcon = getStatusIcon(request.status);
              const phone = getCustomerPhone(request);
              const email = getCustomerEmail(request);
              const name = getCustomerName(request);

              return (
                <tr
                  key={request.id}
                  className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors ${
                    isSelected ? 'bg-orange-50/40 dark:bg-orange-950/20' : ''
                  }`}
                >
                  {/* Checkbox */}
                  <td className="p-3 sticky left-0 bg-white dark:bg-slate-900 z-10">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelectRequest(request.id)}
                      className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                    />
                  </td>

                  {/* Khách hàng */}
                  <td className="p-3">
                    <button
                      type="button"
                      onClick={() => onViewRequest(request)}
                      className="font-bold text-slate-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 text-left line-clamp-1 transition-colors"
                    >
                      {name}
                    </button>
                    {email && (
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-[160px]">
                        {email}
                      </div>
                    )}
                  </td>

                  {/* Điện thoại */}
                  <td className="p-3">
                    {phone ? (
                      <a
                        href={`tel:${phone}`}
                        className="inline-flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200 hover:text-orange-600 dark:hover:text-orange-400"
                      >
                        <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{phone}</span>
                      </a>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>

                  {/* Biểu mẫu */}
                  <td className="p-3">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                      {request.sourceConfig.formName || '—'}
                    </span>
                  </td>

                  {/* CTA */}
                  <td className="p-3">
                    {request.sourceConfig.ctaName ? (
                      <span className="inline-block bg-orange-50 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded text-[11px] font-medium truncate max-w-[120px]">
                        {request.sourceConfig.ctaName}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>

                  {/* Trang */}
                  <td className="p-3">
                    <div className="line-clamp-1 font-medium text-slate-700 dark:text-slate-300" title={request.sourceConfig.pageUrl}>
                      {request.sourceConfig.pageTitle || request.sourceConfig.pageUrl || '—'}
                    </div>
                  </td>

                  {/* Ngày gửi */}
                  <td className="p-3">
                    <div className="text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {formatRelativeTime(request.sourceConfig.submittedAt || request.createdAt)}
                    </div>
                  </td>

                  {/* Trạng thái */}
                  <td className="p-3">
                    <button
                      type="button"
                      onClick={() => onQuickStatusToggle(request.id, request.status)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-all ${getStatusColor(request.status)}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      <span>{REQUEST_STATUS_LABELS[request.status]}</span>
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="p-3 text-right sticky right-0 bg-white dark:bg-slate-900 z-10">
                    <div className="flex items-center justify-end gap-1">
                      <CmsIconButton
                        onClick={() => onViewRequest(request)}
                        icon={<Eye />}
                        size="sm"
                        aria-label="Xem chi tiết"
                        title="Xem chi tiết"
                      />
                      <CmsIconButton
                        onClick={() => onDuplicateRequest(request)}
                        icon={<Copy />}
                        size="sm"
                        aria-label="Nhân bản"
                        title="Nhân bản"
                      />
                      <CmsIconButton
                        onClick={() => onDeleteRequest(request.id)}
                        icon={<Trash2 />}
                        size="sm"
                        variant="danger"
                        aria-label="Xóa"
                        title="Xóa"
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {requests.length === 0 && (
        <div className="py-12 text-center text-slate-500 dark:text-slate-400">
          <List className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm font-medium">Không có yêu cầu nào</p>
          <p className="text-xs mt-1">Chưa có yêu cầu từ khách hàng</p>
        </div>
      )}
      {requests.length > 0 && <CmsPagination currentPage={currentPage} pageSize={pageSize} totalCount={requests.length} itemLabel="yêu cầu" onPageChange={setCurrentPage} onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }} />}
    </div>
  );
};
