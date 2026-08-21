import React, { useState } from 'react';
import {
  Eye,
  Edit3,
  Trash2,
  FileText,
  List,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  UserCheck,
  UserPlus,
  MessageSquare,
  Plus,
  StickyNote,
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
  onDeleteRequest: (id: string) => void;
  onQuickStatusToggle: (id: string, currentStatus: string) => void;
  onReassignRequest?: (request: CustomerRequest) => void;
  onOpenNotesModal?: (request: CustomerRequest) => void;
}

export const RequestList: React.FC<RequestListProps> = ({
  requests,
  selectedRequestIds,
  tab,
  onToggleSelectAll,
  onToggleSelectRequest,
  onViewRequest,
  onDeleteRequest,
  onQuickStatusToggle,
  onReassignRequest,
  onOpenNotesModal,
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
              <th className="p-3 min-w-[170px]">Khách hàng</th>
              <th className="p-3 min-w-[110px]">Điện thoại</th>
              <th className="p-3 min-w-[130px]">Biểu mẫu & CTA</th>
              <th className="p-3 min-w-[130px]">Trang gửi</th>
              <th className="p-3 min-w-[110px]">Ngày gửi</th>
              <th className="p-3 min-w-[160px]">Người phụ trách</th>
              <th className="p-3 min-w-[160px]">Ghi chú</th>
              <th className="p-3 min-w-[110px]">Trạng thái</th>
              <th className="p-3 w-32 text-right sticky right-0 bg-slate-50/90 dark:bg-slate-850 z-10">Thao tác</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-300">
            {paginatedRequests.map((request) => {
              const isSelected = selectedRequestIds.includes(request.id);
              const StatusIcon = getStatusIcon(request.status);
              const phone = getCustomerPhone(request);
              const email = getCustomerEmail(request);
              const name = getCustomerName(request);
              const notesCount = request.internalNotes?.length || 0;
              const latestNote = notesCount > 0 ? request.internalNotes[notesCount - 1] : null;

              return (
                <tr
                  key={request.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
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
                      className="font-bold text-slate-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 text-left line-clamp-1 transition-colors cursor-pointer"
                    >
                      {name}
                    </button>
                    {email && (
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-[150px]">
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

                  {/* Biểu mẫu & CTA */}
                  <td className="p-3">
                    <div className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                      {request.sourceConfig.formName || '—'}
                    </div>
                    {request.sourceConfig.ctaName && (
                      <span className="inline-block bg-orange-50 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300 px-1.5 py-0.5 rounded text-[10px] font-medium truncate max-w-[130px] mt-0.5">
                        {request.sourceConfig.ctaName}
                      </span>
                    )}
                  </td>

                  {/* Trang */}
                  <td className="p-3">
                    <div className="line-clamp-1 font-medium text-slate-700 dark:text-slate-300 max-w-[140px]" title={request.sourceConfig.pageUrl}>
                      {request.sourceConfig.pageTitle || request.sourceConfig.pageUrl || '—'}
                    </div>
                  </td>

                  {/* Ngày gửi */}
                  <td className="p-3">
                    <div className="text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {formatRelativeTime(request.sourceConfig.submittedAt || request.createdAt)}
                    </div>
                  </td>

                  {/* Người phụ trách (Assignee Column) */}
                  <td className="p-3">
                    {request.assignedUserName ? (
                      <div className="flex items-center gap-2 group">
                        <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 font-bold flex items-center justify-center text-[10px] shrink-0 border border-orange-200 dark:border-orange-900">
                          {request.assignedUserName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <button
                            type="button"
                            onClick={() => onReassignRequest?.(request)}
                            className="font-bold text-slate-800 dark:text-slate-200 hover:text-orange-600 dark:hover:text-orange-400 truncate block text-left transition-colors cursor-pointer text-xs"
                            title="Bấm để đổi người phụ trách"
                          >
                            {request.assignedUserName}
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => onReassignRequest?.(request)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 rounded transition-all cursor-pointer"
                          title="Đổi người phụ trách"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onReassignRequest?.(request)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-400 text-[11px] font-medium transition-colors cursor-pointer bg-slate-50/50 dark:bg-slate-800/40"
                        title="Bấm để gán nhân sự phụ trách"
                      >
                        <UserPlus className="w-3 h-3" />
                        <span>Chưa phân công</span>
                      </button>
                    )}
                  </td>

                  {/* Ghi chú (Notes Column) */}
                  <td className="p-3">
                    {notesCount > 0 && latestNote ? (
                      <div className="space-y-1">
                        <button
                          type="button"
                          onClick={() => onOpenNotesModal?.(request)}
                          className="flex items-center gap-1.5 text-left group cursor-pointer"
                          title={`Xem toàn bộ ${notesCount} ghi chú`}
                        >
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10px] font-bold shrink-0 border border-blue-200/60 dark:border-blue-900/60">
                            <MessageSquare className="w-2.5 h-2.5" />
                            {notesCount}
                          </span>
                          <span className="text-[11px] text-slate-600 dark:text-slate-300 truncate max-w-[110px] group-hover:text-orange-600 dark:group-hover:text-orange-400">
                            {latestNote.content}
                          </span>
                        </button>
                        <div className="text-[9px] text-slate-400 truncate">
                          bởi {latestNote.createdByName}
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onOpenNotesModal?.(request)}
                        className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 font-medium transition-colors cursor-pointer"
                        title="Thêm ghi chú xử lý"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Thêm ghi chú</span>
                      </button>
                    )}
                  </td>

                  {/* Trạng thái */}
                  <td className="p-3">
                    <button
                      type="button"
                      onClick={() => onQuickStatusToggle(request.id, request.status)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-all cursor-pointer ${getStatusColor(request.status)}`}
                      title="Bấm để đổi nhanh trạng thái tiếp theo"
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
                        onClick={() => onReassignRequest?.(request)}
                        icon={<UserCheck />}
                        size="sm"
                        aria-label="Gán người phụ trách"
                        title="Gán người phụ trách"
                      />
                      <CmsIconButton
                        onClick={() => onOpenNotesModal?.(request)}
                        icon={<MessageSquare />}
                        size="sm"
                        aria-label="Ghi chú nội bộ"
                        title="Ghi chú nội bộ"
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
      {requests.length > 0 && (
        <CmsPagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalCount={requests.length}
          itemLabel="yêu cầu"
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      )}
    </div>
  );
};
