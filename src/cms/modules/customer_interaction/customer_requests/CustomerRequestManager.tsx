import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { CustomerRequest, RequestListTabType, RequestFilterState } from './types';
import { RequestList } from './components/RequestList';
import { RequestDetailPage } from './components/RequestDetailPage';
import { MOCK_CUSTOMER_REQUESTS } from './mockData';
import { REQUEST_STATUSES } from '../shared/constants/statusTypes';
import { CmsPageHeader } from '../../../components/ui/CmsPageHeader';
import { CmsButton } from '../../../components/ui/CmsButton';
import { CmsTabs } from '../../../components/ui/CmsTabs';
import { CmsBulkActionBar } from '../../../components/ui/CmsBulkActionBar';

export const CustomerRequestManager: React.FC = () => {
  const [requests, setRequests] = useState<CustomerRequest[]>(MOCK_CUSTOMER_REQUESTS);
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

  // Calculate summary statistics
  const totalRequests = requests.length;
  const todayRequests = requests.filter((r) => {
    const today = new Date().toDateString();
    return new Date(r.sourceConfig.submittedAt).toDateString() === today;
  }).length;
  const newRequests = requests.filter((r) => r.status === 'new').length;
  const processingRequests = requests.filter((r) => r.status === 'processing').length;
  const completedRequests = requests.filter((r) => r.status === 'completed').length;

  // Filter requests based on current filters
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

    // Search filter
    if (filter.searchQuery.trim()) {
      const query = filter.searchQuery.toLowerCase();
      const customerName = request.submissionValues.find(
        (v) => v.fieldKey === 'full_name' || v.fieldType === 'text'
      )?.valueText?.toLowerCase() || '';
      const customerEmail = request.submissionValues.find(
        (v) => v.fieldKey === 'email' || v.fieldType === 'email'
      )?.valueText?.toLowerCase() || '';
      const customerPhone = request.submissionValues.find(
        (v) => v.fieldKey === 'phone' || v.fieldType === 'phone'
      )?.valueText?.toLowerCase() || '';
      const formName = request.sourceConfig.formName.toLowerCase();
      const pageTitle = request.sourceConfig.pageTitle.toLowerCase();

      if (
        !customerName.includes(query) &&
        !customerEmail.includes(query) &&
        !customerPhone.includes(query) &&
        !formName.includes(query) &&
        !pageTitle.includes(query)
      ) {
        return false;
      }
    }

    // Status filter
    if (filter.status && request.status !== filter.status) return false;

    // Form filter
    if (filter.formId && request.sourceConfig.formId !== filter.formId) return false;

    // Page filter
    if (filter.pageId && request.sourceConfig.pageId !== filter.pageId) return false;

    // Assignee filter
    if (filter.assignedUserId && request.assignedUserId !== filter.assignedUserId) return false;

    return true;
  });

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
    // TODO: Implement user assignment modal
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
            description="Quản lý và xử lý yêu cầu từ biểu mẫu"
            meta={<span className="rounded-md bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">{requests.filter((r) => !r.deletedAt).length} yêu cầu</span>}
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

          {/* Filter Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs space-y-3">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
              {/* Search Input */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên, email, điện thoại..."
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
                  {REQUEST_STATUSES.map((status) => (
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

          {/* Request List */}
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
