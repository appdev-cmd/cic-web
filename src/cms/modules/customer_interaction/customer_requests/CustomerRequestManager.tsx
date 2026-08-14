import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  Download,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquareText,
  Calendar,
  RotateCcw,
  FileSpreadsheet,
  X,
  FileText,
  MousePointer2,
  Globe,
} from 'lucide-react';
import { CustomerRequest, RequestListTabType, RequestFilterState } from './types';
import type { CustomerRequestModuleData } from '../../../data/CustomerInteractionDataSource';
import { RequestList } from './components/RequestList';
import { RequestDetailPage } from './components/RequestDetailPage';
import { REQUEST_STATUSES, REQUEST_STATUS_LABELS, PRIORITY_LABELS } from '../shared/constants/statusTypes';
import { CmsPageHeader } from '../../../components/ui/CmsPageHeader';
import { CmsButton } from '../../../components/ui/CmsButton';
import { CmsTabs } from '../../../components/ui/CmsTabs';
import { CmsBulkActionBar } from '../../../components/ui/CmsBulkActionBar';

interface CustomerRequestManagerProps {
  data: CustomerRequestModuleData;
}

export const CustomerRequestManager: React.FC<CustomerRequestManagerProps> = ({ data }) => {
  const [requests, setRequests] = useState<CustomerRequest[]>(data.requests);
  const [selectedRequestIds, setSelectedRequestIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<RequestListTabType>('all');
  const [filter, setFilter] = useState<RequestFilterState>({
    searchQuery: '',
    tab: 'all',
  });
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [selectedRequest, setSelectedRequest] = useState<CustomerRequest | null>(null);

  // Handle URL-based navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const detailMatch = path.match(/\/cms\/customer-requests\/detail\/(.+)/);
      
      if (detailMatch) {
        const requestId = detailMatch[1];
        const request = requests.find((r) => r.id === requestId);
        if (request) {
          setSelectedRequest(request);
          setViewMode('detail');
        } else {
          setViewMode('list');
          setSelectedRequest(null);
        }
      } else {
        setViewMode('list');
        setSelectedRequest(null);
      }
    };

    // Initial check
    handlePopState();
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [requests]);

  // Extract unique filter options from request dataset
  const formOptions = useMemo(() => {
    const map = new Map<string, string>();
    requests.forEach((r) => {
      if (r.sourceConfig?.formId && r.sourceConfig?.formName) {
        map.set(r.sourceConfig.formId, r.sourceConfig.formName);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [requests]);

  const ctaOptions = useMemo(() => {
    const map = new Map<string, string>();
    requests.forEach((r) => {
      if (r.sourceConfig?.ctaId && r.sourceConfig?.ctaName) {
        map.set(r.sourceConfig.ctaId, r.sourceConfig.ctaName);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [requests]);

  const pageOptions = useMemo(() => {
    const map = new Map<string, string>();
    requests.forEach((r) => {
      if (r.sourceConfig?.pageId && r.sourceConfig?.pageTitle) {
        map.set(r.sourceConfig.pageId, r.sourceConfig.pageTitle);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [requests]);

  const assigneeOptions = useMemo(() => {
    const map = new Map<string, string>();
    requests.forEach((r) => {
      if (r.assignedUserId && r.assignedUserName) {
        map.set(r.assignedUserId, r.assignedUserName);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [requests]);

  // Check if any filters are active
  const hasActiveFilters = Boolean(
    filter.searchQuery.trim() ||
    filter.status ||
    filter.formId ||
    filter.ctaId ||
    filter.pageId ||
    filter.assignedUserId ||
    filter.dateFrom ||
    filter.dateTo
  );

  const handleResetFilters = () => {
    setFilter({
      searchQuery: '',
      status: undefined,
      formId: undefined,
      ctaId: undefined,
      pageId: undefined,
      assignedUserId: undefined,
      tab: activeTab,
      dateFrom: undefined,
      dateTo: undefined,
    });
  };

  // Multi-condition filtering
  const filteredRequests = requests.filter((request) => {
    // Tab filter
    if (activeTab === 'trash') {
      if (!request.deletedAt) return false;
    } else {
      if (request.deletedAt) return false;
    }

    if (activeTab === 'new' && request.status !== 'new') return false;
    if (activeTab === 'processing' && request.status !== 'processing') return false;
    if (activeTab === 'completed' && request.status !== 'completed') return false;
    if (activeTab === 'not_suitable' && request.status !== 'not_suitable') return false;
    if (activeTab === 'cancelled' && request.status !== 'cancelled') return false;

    // Search filter across submission values, metadata, form/CTA/page names
    if (filter.searchQuery.trim()) {
      const query = filter.searchQuery.toLowerCase();
      const valuesString = request.submissionValues
        .map((v) => `${v.fieldLabel} ${v.valueText || ''}`)
        .join(' ')
        .toLowerCase();
      const formName = (request.sourceConfig.formName || '').toLowerCase();
      const ctaName = (request.sourceConfig.ctaName || '').toLowerCase();
      const pageTitle = (request.sourceConfig.pageTitle || '').toLowerCase();
      const pageUrl = (request.sourceConfig.pageUrl || '').toLowerCase();
      const reqId = request.id.toLowerCase();
      const assigneeName = (request.assignedUserName || '').toLowerCase();

      const matches =
        valuesString.includes(query) ||
        formName.includes(query) ||
        ctaName.includes(query) ||
        pageTitle.includes(query) ||
        pageUrl.includes(query) ||
        reqId.includes(query) ||
        assigneeName.includes(query);

      if (!matches) return false;
    }

    // Status filter
    if (filter.status && request.status !== filter.status) return false;

    // Form filter
    if (filter.formId && request.sourceConfig.formId !== filter.formId) return false;

    // CTA filter
    if (filter.ctaId && request.sourceConfig.ctaId !== filter.ctaId) return false;

    // Page filter
    if (filter.pageId && request.sourceConfig.pageId !== filter.pageId) return false;

    // Assignee filter
    if (filter.assignedUserId) {
      if (filter.assignedUserId === 'unassigned') {
        if (request.assignedUserId) return false;
      } else if (request.assignedUserId !== filter.assignedUserId) {
        return false;
      }
    }

    // Date range filter
    if (filter.dateFrom) {
      const fromDate = new Date(filter.dateFrom);
      fromDate.setHours(0, 0, 0, 0);
      const reqDate = new Date(request.sourceConfig.submittedAt);
      if (reqDate < fromDate) return false;
    }

    if (filter.dateTo) {
      const toDate = new Date(filter.dateTo);
      toDate.setHours(23, 59, 59, 999);
      const reqDate = new Date(request.sourceConfig.submittedAt);
      if (reqDate > toDate) return false;
    }

    return true;
  });

  // Export CSV based on filtered dataset
  const handleExportCSV = () => {
    if (filteredRequests.length === 0) {
      alert('Không có dữ liệu yêu cầu nào phù hợp để xuất file.');
      return;
    }

    const headers = [
      'Mã Yêu cầu',
      'Thời gian gửi',
      'Họ và tên',
      'Email',
      'Số điện thoại',
      'Công ty',
      'Biểu mẫu',
      'CTA',
      'Trang gửi',
      'Trạng thái',
      'Người phụ trách',
      'Độ ưu tiên',
      'Thẻ (Tags)',
      'Nội dung / Nhu cầu',
    ];

    const rows = filteredRequests.map((r) => {
      const getVal = (keys: string[], types: string[]) => {
        const found = r.submissionValues.find(
          (v) => keys.includes(v.fieldKey.toLowerCase()) || types.includes(v.fieldType)
        );
        return found?.valueText || '';
      };

      const name = getVal(['full_name', 'name', 'ho_ten'], ['text']);
      const email = getVal(['email'], ['email']);
      const phone = getVal(['phone', 'sdt', 'dien_thoai'], ['phone']);
      const company = getVal(['company', 'cong_ty'], []);
      const message = getVal(['message', 'noi_dung', 'note'], ['textarea']);

      const statusLabel = REQUEST_STATUS_LABELS[r.status] || r.status;
      const priorityLabel = PRIORITY_LABELS[r.priority] || r.priority;
      const tagsStr = (r.tags || []).join('; ');
      const dateStr = new Date(r.sourceConfig.submittedAt).toLocaleString('vi-VN');

      return [
        r.id,
        dateStr,
        name,
        email,
        phone,
        company,
        r.sourceConfig.formName || '',
        r.sourceConfig.ctaName || '',
        r.sourceConfig.pageTitle || '',
        statusLabel,
        r.assignedUserName || 'Chưa phân công',
        priorityLabel,
        tagsStr,
        message,
      ].map((field) => `"${(field || '').toString().replace(/"/g, '""')}"`);
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const nowStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `Yeu_cau_khach_hang_${nowStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handlers
  const handleToggleSelectAll = () => {
    if (selectedRequestIds.length === filteredRequests.length) {
      setSelectedRequestIds([]);
    } else {
      setSelectedRequestIds(filteredRequests.map((r) => r.id));
    }
  };

  const handleToggleSelectRequest = (id: string) => {
    if (selectedRequestIds.includes(id)) {
      setSelectedRequestIds(selectedRequestIds.filter((item) => item !== id));
    } else {
      setSelectedRequestIds([...selectedRequestIds, id]);
    }
  };

  const handleViewDetail = (request: CustomerRequest) => {
    setSelectedRequest(request);
    setViewMode('detail');
    window.history.pushState({}, '', `/cms/customer-requests/detail/${request.id}`);
  };

  const handleDeleteRequest = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa yêu cầu này?')) {
      setRequests(requests.filter((r) => r.id !== id));
    }
  };

  const handleAddNote = (requestId: string, noteContent: string) => {
    setRequests(
      requests.map((r) =>
        r.id === requestId
          ? {
              ...r,
              internalNotes: [
                ...r.internalNotes,
                {
                  id: `note_${Date.now()}`,
                  content: noteContent,
                  createdBy: 'Current User',
                  createdByName: 'Current User',
                  createdAt: new Date().toISOString(),
                },
              ],
              logs: [
                ...r.logs,
                {
                  id: `log_${Date.now()}`,
                  actionType: 'note_added',
                  createdBy: 'Current User',
                  createdByName: 'Current User',
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : r
      )
    );
  };

  const handleTabChange = (tab: RequestListTabType) => {
    setActiveTab(tab);
    setSelectedRequestIds([]);
  };

  const handleQuickStatusToggle = (id: string, currentStatus: string) => {
    const statusFlow: Record<string, string> = {
      new: 'processing',
      processing: 'completed',
      completed: 'new',
      not_suitable: 'new',
      cancelled: 'new',
    };
    const newStatus = statusFlow[currentStatus] || 'new';
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus as any } : r))
    );
  };

  const handleDuplicateRequest = (request: CustomerRequest) => {
    const newRequest: CustomerRequest = {
      ...request,
      id: `req_${Date.now()}`,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    setRequests((prev) => [newRequest, ...prev]);
  };

  const handleAssignUser = (id: string, userId: string) => {
    console.log('Assign user:', id, userId);
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedRequest(null);
    window.history.pushState({}, '', '/cms/customer-requests');
  };

  const handleChangeStatus = (id: string, currentStatus: string) => {
    const statusOptions = ['new', 'received', 'processing', 'contacted', 'completed', 'not_suitable', 'cancelled'];
    const currentIndex = statusOptions.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % statusOptions.length;
    const nextStatus = statusOptions[nextIndex];

    setRequests(
      requests.map((r) =>
        r.id === id
          ? {
              ...r,
              status: nextStatus as any,
              updatedAt: new Date().toISOString(),
              logs: [
                ...r.logs,
                {
                  id: `log_${Date.now()}`,
                  actionType: 'status_changed',
                  oldValue: currentStatus,
                  newValue: nextStatus,
                  createdBy: 'Current User',
                  createdByName: 'Current User',
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : r
      )
    );
  };

  return (
    <div className="space-y-6">
      {viewMode === 'list' ? (
        <>
          {/* Header */}
          <CmsPageHeader
            icon={<MessageSquareText />}
            title="Yêu cầu khách hàng"
            description="Quản lý, phân loại và xử lý yêu cầu tiếp nhận từ các biểu mẫu"
            meta={
              <span className="rounded-md bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">
                {requests.filter((r) => !r.deletedAt).length} yêu cầu
              </span>
            }
          />

          {/* Tabs */}
          <CmsTabs
            items={[
              { id: 'all' as const, label: 'Tất cả', count: requests.filter((r) => !r.deletedAt).length },
              { id: 'new' as const, label: 'Mới', count: requests.filter((r) => !r.deletedAt && r.status === 'new').length },
              { id: 'processing' as const, label: 'Đang xử lý', count: requests.filter((r) => !r.deletedAt && r.status === 'processing').length },
              { id: 'completed' as const, label: 'Hoàn thành', count: requests.filter((r) => !r.deletedAt && r.status === 'completed').length },
              { id: 'not_suitable' as const, label: 'Không phù hợp', count: requests.filter((r) => !r.deletedAt && r.status === 'not_suitable').length },
              { id: 'cancelled' as const, label: 'Hủy', count: requests.filter((r) => !r.deletedAt && r.status === 'cancelled').length },
            ]}
            value={activeTab}
            onChange={handleTabChange}
            ariaLabel="Request status tabs"
          />

          {/* Multi-condition Filter Panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-4">
            {/* Top Row: Search & Export & Reset */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Keyword Search Input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên, email, sđt, công ty, nội dung, mã yêu cầu..."
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

              {/* Date Range Inputs */}
              <div className="flex items-center gap-2 flex-wrap">
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

                {/* Export CSV Button */}
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold rounded-xl text-xs flex items-center gap-1.5 shrink-0 shadow-2xs transition-all cursor-pointer"
                  title="Xuất file CSV danh sách yêu cầu đang lọc"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Xuất CSV ({filteredRequests.length})</span>
                </button>

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

            {/* Bottom Row: Specific Dropdown Filters */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
              {/* Form Filter */}
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                  Biểu mẫu
                </label>
                <select
                  value={filter.formId || ''}
                  onChange={(e) => setFilter({ ...filter, formId: e.target.value || undefined })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-orange-500 cursor-pointer truncate"
                >
                  <option value="">Tất cả Biểu mẫu</option>
                  {formOptions.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* CTA Filter */}
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                  CTA
                </label>
                <select
                  value={filter.ctaId || ''}
                  onChange={(e) => setFilter({ ...filter, ctaId: e.target.value || undefined })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-orange-500 cursor-pointer truncate"
                >
                  <option value="">Tất cả CTA</option>
                  {ctaOptions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Page Filter */}
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                  Trang
                </label>
                <select
                  value={filter.pageId || ''}
                  onChange={(e) => setFilter({ ...filter, pageId: e.target.value || undefined })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-orange-500 cursor-pointer truncate"
                >
                  <option value="">Tất cả Trang</option>
                  {pageOptions.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                  Trạng thái
                </label>
                <select
                  value={filter.status || ''}
                  onChange={(e) => setFilter({ ...filter, status: (e.target.value as any) || undefined })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-orange-500 cursor-pointer truncate"
                >
                  <option value="">Tất cả Trạng thái</option>
                  {REQUEST_STATUSES.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Assignee Filter */}
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                  Người phụ trách
                </label>
                <select
                  value={filter.assignedUserId || ''}
                  onChange={(e) => setFilter({ ...filter, assignedUserId: e.target.value || undefined })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-orange-500 cursor-pointer truncate"
                >
                  <option value="">Tất cả Người phụ trách</option>
                  <option value="unassigned">Chưa phân công</option>
                  {assigneeOptions.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Bulk Actions Bar */}
          <CmsBulkActionBar
            selectedCount={selectedRequestIds.length}
            itemLabel="yêu cầu"
            onClear={() => setSelectedRequestIds([])}
            actions={[
              {
                label: 'Phân công',
                onClick: () => console.log('Assign'),
              },
              {
                label: 'Đổi trạng thái',
                onClick: () => console.log('Change status'),
              },
              {
                label: 'Thêm tag',
                onClick: () => console.log('Add tag'),
              },
              {
                label: 'Xóa',
                variant: 'danger',
                onClick: () => console.log('Delete'),
              },
            ]}
          />

          {/* Request List Table */}
          <RequestList
            requests={filteredRequests}
            selectedRequestIds={selectedRequestIds}
            tab={activeTab}
            onToggleSelectAll={handleToggleSelectAll}
            onToggleSelectRequest={handleToggleSelectRequest}
            onViewRequest={handleViewDetail}
            onDuplicateRequest={handleDuplicateRequest}
            onDeleteRequest={handleDeleteRequest}
            onQuickStatusToggle={handleQuickStatusToggle}
          />
        </>
      ) : (
        /* Request Detail Page */
        selectedRequest && (
          <RequestDetailPage
            requestId={selectedRequest.id}
            request={selectedRequest}
            onBack={handleBackToList}
            onAssignUser={handleAssignUser}
            onUpdateStatus={handleChangeStatus}
            onAddNote={handleAddNote}
          />
        )
      )}
    </div>
  );
};
