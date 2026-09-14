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
  UserCheck,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import type { CustomerRequest, RequestFilterState, RequestListTabType } from './types';
import type { CustomerRequestModuleData } from '../../../data/CustomerInteractionDataSource';
import type { CustomerRequestListResponse } from '@/features/customer-requests/types';
import { RequestList } from './components/RequestList';
import { RequestDetailPage } from './components/RequestDetailPage';
import { RequestReassignModal, type AssignableStaffItem } from './components/RequestReassignModal';
import { RequestQuickNotesModal } from './components/RequestQuickNotesModal';
import { REQUEST_STATUSES, REQUEST_STATUS_LABELS, PRIORITY_LABELS } from '../shared/constants/statusTypes';
import type { PriorityLevel, RequestStatus } from '../shared/constants/statusTypes';
import { CmsPageHeader } from '../../../components/ui/CmsPageHeader';
import { CmsButton } from '../../../components/ui/CmsButton';
import { CmsBulkActionBar } from '../../../components/ui/CmsBulkActionBar';
import { MOCK_STAFF_MEMBERS } from '../../contacts/mockData';
import { CmsTrashConfirmDialog } from '@/shared/ui/cms/CmsTrashConfirmDialog';

export interface CustomerRequestManagerProps {
  data?: CustomerRequestModuleData;
  serverData?: CustomerRequestListResponse;
  workspaceLocale?: 'vi' | 'en';
  capabilities?: {
    edit?: boolean;
    delete?: boolean;
  };
  onRefresh?: () => void;
}

export const CustomerRequestManager: React.FC<CustomerRequestManagerProps> = ({
  data,
  serverData,
  workspaceLocale = 'vi',
  capabilities = { edit: true, delete: true },
  onRefresh,
}) => {
  const initialRequests = serverData?.requests ?? data?.requests ?? [];
  const [requests, setRequests] = useState<CustomerRequest[]>(initialRequests);
  const [selectedRequestIds, setSelectedRequestIds] = useState<string[]>([]);
  const [filter, setFilter] = useState<RequestFilterState>({
    searchQuery: '',
    tab: 'all',
  });
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [selectedRequest, setSelectedRequest] = useState<CustomerRequest | null>(null);

  // Modals state
  const [reassignModalData, setReassignModalData] = useState<{
    isOpen: boolean;
    requests: CustomerRequest[];
  }>({
    isOpen: false,
    requests: [],
  });

  const [notesModalData, setNotesModalData] = useState<{
    isOpen: boolean;
    request: CustomerRequest | null;
  }>({
    isOpen: false,
    request: null,
  });

  const [trashTargets, setTrashTargets] = useState<CustomerRequest[] | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync with serverData updates
  useEffect(() => {
    if (serverData?.requests) {
      setRequests(serverData.requests);
    }
  }, [serverData]);

  // Fallback client fetch if neither serverData nor data was provided
  useEffect(() => {
    if (!serverData && !data) {
      let ignore = false;
      fetch(`/api/cms/customer-requests?workspace=${workspaceLocale}&pageSize=100`)
        .then((res) => (res.ok ? res.json() : null))
        .then((json: CustomerRequestListResponse | null) => {
          if (!ignore && json?.requests) {
            setRequests(json.requests);
          }
        })
        .catch((err) => {
          console.error('[CustomerRequestManager] Failed to fetch requests:', err);
        });
      return () => {
        ignore = true;
      };
    }
  }, [serverData, data, workspaceLocale]);

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

  // Extract available staff members from serverData (cic_users) or mock fallback
  const staffMembers: AssignableStaffItem[] = useMemo(() => {
    if (serverData?.staffMembers && serverData.staffMembers.length > 0) {
      return serverData.staffMembers.map((s) => ({
        id: s.id,
        name: s.name,
        email: s.email,
        username: s.username,
        role: s.role,
      }));
    }
    return MOCK_STAFF_MEMBERS as AssignableStaffItem[];
  }, [serverData?.staffMembers]);

  // Extract filter options from serverData or local dataset
  const formOptions = useMemo(() => {
    if (serverData?.formOptions && serverData.formOptions.length > 0) {
      return serverData.formOptions;
    }
    const map = new Map<string, string>();
    requests.forEach((r) => {
      if (r.sourceConfig?.formId && r.sourceConfig?.formName) {
        map.set(r.sourceConfig.formId, r.sourceConfig.formName);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [serverData?.formOptions, requests]);

  const ctaOptions = useMemo(() => {
    if (serverData?.ctaOptions && serverData.ctaOptions.length > 0) {
      return serverData.ctaOptions;
    }
    const map = new Map<string, string>();
    requests.forEach((r) => {
      if (r.sourceConfig?.ctaId && r.sourceConfig?.ctaName) {
        map.set(r.sourceConfig.ctaId, r.sourceConfig.ctaName);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [serverData?.ctaOptions, requests]);

  const assigneeOptions = useMemo(() => {
    const map = new Map<string, string>();
    staffMembers.forEach((m) => {
      map.set(m.id, m.name);
    });
    requests.forEach((r) => {
      if (r.assignedUserId && r.assignedUserName) {
        map.set(r.assignedUserId, r.assignedUserName);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [staffMembers, requests]);

  // Overall counts for tabs
  const stats = useMemo(() => {
    if (serverData?.stats) {
      return serverData.stats;
    }
    const active = requests.filter((r) => !r.deletedAt);
    return {
      all: active.length,
      new: active.filter((r) => r.status === 'new').length,
      processing: active.filter((r) => ['received', 'processing', 'contacted'].includes(r.status)).length,
      completed: active.filter((r) => r.status === 'completed').length,
      not_suitable: active.filter((r) => r.status === 'not_suitable').length,
      cancelled: active.filter((r) => r.status === 'cancelled').length,
    };
  }, [serverData?.stats, requests]);

  // Check if any filters are active
  const hasActiveFilters = Boolean(
    filter.searchQuery.trim() ||
      filter.status ||
      filter.formId ||
      filter.ctaId ||
      filter.assignedUserId ||
      filter.dateFrom ||
      filter.dateTo ||
      filter.tab !== 'all'
  );

  const handleResetFilters = () => {
    setFilter({
      searchQuery: '',
      status: undefined,
      formId: undefined,
      ctaId: undefined,
      assignedUserId: undefined,
      tab: 'all',
      dateFrom: undefined,
      dateTo: undefined,
    });
  };

  // Multi-condition filtering
  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      if (request.deletedAt) return false;

      // Tab filter
      if (filter.tab && filter.tab !== 'all') {
        if (filter.tab === 'new' && request.status !== 'new') return false;
        if (
          filter.tab === 'processing' &&
          !['received', 'processing', 'contacted'].includes(request.status)
        )
          return false;
        if (filter.tab === 'completed' && request.status !== 'completed') return false;
        if (filter.tab === 'not_suitable' && request.status !== 'not_suitable') return false;
        if (filter.tab === 'cancelled' && request.status !== 'cancelled') return false;
      }

      // Search filter across submission values, metadata, form/CTA/page names
      if (filter.searchQuery.trim()) {
        const query = filter.searchQuery.toLowerCase();
        const valuesString = (request.submissionValues || [])
          .map((v) => `${v.fieldLabel} ${v.valueText || ''}`)
          .join(' ')
          .toLowerCase();
        const formName = (request.sourceConfig?.formName || '').toLowerCase();
        const ctaName = (request.sourceConfig?.ctaName || '').toLowerCase();
        const pageTitle = (request.sourceConfig?.pageTitle || '').toLowerCase();
        const pageUrl = (request.sourceConfig?.pageUrl || '').toLowerCase();
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
      if (filter.formId && request.sourceConfig?.formId !== filter.formId) return false;

      // CTA filter
      if (filter.ctaId && request.sourceConfig?.ctaId !== filter.ctaId) return false;

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
        const reqDate = new Date(request.sourceConfig?.submittedAt || request.createdAt);
        if (reqDate < fromDate) return false;
      }

      if (filter.dateTo) {
        const toDate = new Date(filter.dateTo);
        toDate.setHours(23, 59, 59, 999);
        const reqDate = new Date(request.sourceConfig?.submittedAt || request.createdAt);
        if (reqDate > toDate) return false;
      }

      return true;
    });
  }, [requests, filter]);

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
  const handleToggleSelectAll = (pageIds?: string[]) => {
    if (pageIds && pageIds.length > 0) {
      const allSelected = pageIds.every((id) => selectedRequestIds.includes(id));
      if (allSelected) {
        setSelectedRequestIds((prev) => prev.filter((id) => !pageIds.includes(id)));
      } else {
        setSelectedRequestIds((prev) => Array.from(new Set([...prev, ...pageIds])));
      }
      return;
    }
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
    window.history.pushState({}, '', `/cms/customer-requests/detail/${encodeURIComponent(request.id)}`);
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedRequest(null);
    window.history.pushState({}, '', '/cms/customer-requests');
  };

  const handleDeleteRequest = (id: string) => {
    const target = requests.find((r) => r.id === id);
    if (target) {
      setTrashTargets([target]);
    }
  };

  // 1. Add Note Mutation
  const handleAddNote = async (requestId: string, noteContent: string) => {
    const trimmed = noteContent.trim();
    if (!trimmed) return;

    try {
      const res = await fetch(`/api/cms/customer-requests/${encodeURIComponent(requestId)}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: trimmed }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        showToast(`Không thể thêm ghi chú: ${err.error || 'Lỗi hệ thống'}`);
        return;
      }

      const result = await res.json();
      const updatedNote = result.note;
      const updatedLog = result.log;

      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === requestId) {
            const updated: CustomerRequest = {
              ...r,
              internalNotes: [...(r.internalNotes || []), updatedNote],
              logs: updatedLog ? [...(r.logs || []), updatedLog] : r.logs,
              updatedAt: new Date().toISOString(),
            };
            if (selectedRequest?.id === requestId) {
              setSelectedRequest(updated);
            }
            if (notesModalData.isOpen && notesModalData.request?.id === requestId) {
              setNotesModalData({ isOpen: true, request: updated });
            }
            return updated;
          }
          return r;
        })
      );

      showToast('Đã thêm ghi chú nội bộ thành công!');
      onRefresh?.();
    } catch (e: any) {
      showToast(`Lỗi kết nối: ${e.message}`);
    }
  };

  // 2. Reassign Mutation
  const handleConfirmReassign = async (
    requestIds: string[],
    targetStaff: AssignableStaffItem,
    reason: string
  ) => {
    try {
      const res = await fetch('/api/cms/customer-requests/reassign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids: requestIds,
          targetUserId: targetStaff.id,
          reason,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        showToast(`Không thể phân công: ${err.error || 'Lỗi hệ thống'}`);
        return;
      }

      const now = new Date().toISOString();
      setRequests((prev) =>
        prev.map((r) => {
          if (requestIds.includes(r.id)) {
            const oldName = r.assignedUserName || 'Chưa phân công';
            const updated: CustomerRequest = {
              ...r,
              assignedUserId: targetStaff.id,
              assignedUserName: targetStaff.name,
              updatedAt: now,
              internalNotes: reason.trim()
                ? [
                    ...(r.internalNotes || []),
                    {
                      id: `note_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
                      content: `[Chuyển giao người phụ trách] Từ "${oldName}" sang "${targetStaff.name}". Lý do: ${reason.trim()}`,
                      createdBy: 'current_user',
                      createdByName: 'Quản trị viên',
                      createdAt: now,
                    },
                  ]
                : r.internalNotes,
              logs: [
                ...(r.logs || []),
                {
                  id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
                  actionType: 'reassigned',
                  oldValue: oldName,
                  newValue: targetStaff.name,
                  createdBy: 'current_user',
                  createdByName: 'Quản trị viên',
                  createdAt: now,
                },
              ],
            };
            if (selectedRequest?.id === r.id) {
              setSelectedRequest(updated);
            }
            return updated;
          }
          return r;
        })
      );

      setSelectedRequestIds([]);
      setReassignModalData({ isOpen: false, requests: [] });
      showToast(`Đã phân công ${requestIds.length} yêu cầu cho ${targetStaff.name}!`);
      onRefresh?.();
    } catch (e: any) {
      showToast(`Lỗi kết nối: ${e.message}`);
    }
  };

  const handleOpenReassignSingle = (request: CustomerRequest) => {
    setReassignModalData({
      isOpen: true,
      requests: [request],
    });
  };

  const handleOpenReassignBulk = () => {
    const targets = requests.filter((r) => selectedRequestIds.includes(r.id));
    if (targets.length > 0) {
      setReassignModalData({
        isOpen: true,
        requests: targets,
      });
    }
  };

  const handleOpenNotesModal = (request: CustomerRequest) => {
    setNotesModalData({
      isOpen: true,
      request,
    });
  };

  const handleBulkDelete = () => {
    const targets = requests.filter((r) => selectedRequestIds.includes(r.id));
    if (targets.length > 0) {
      setTrashTargets(targets);
    }
  };

  const handleConfirmDelete = async () => {
    if (!trashTargets || trashTargets.length === 0) return;
    setIsDeleting(true);
    try {
      const ids = trashTargets.map((r) => r.id);
      const res = await fetch('/api/cms/customer-requests/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        showToast(`Không thể xóa yêu cầu: ${err.error || 'Lỗi hệ thống'}`);
        return;
      }

      setRequests((prev) => prev.filter((r) => !ids.includes(r.id)));
      setSelectedRequestIds((prev) => prev.filter((id) => !ids.includes(id)));
      showToast(
        trashTargets.length === 1
          ? 'Đã chuyển yêu cầu vào Thùng rác!'
          : `Đã chuyển ${trashTargets.length} yêu cầu vào Thùng rác!`
      );
      setTrashTargets(null);
      onRefresh?.();
    } catch (e: any) {
      showToast(`Lỗi kết nối: ${e.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // 3. Status Mutation
  const handleQuickStatusToggle = async (id: string, currentStatus: string) => {
    const statusFlow: Record<string, RequestStatus> = {
      new: 'processing',
      received: 'processing',
      processing: 'completed',
      contacted: 'completed',
      completed: 'new',
      not_suitable: 'new',
      cancelled: 'new',
    };
    const nextStatus = statusFlow[currentStatus] || 'new';

    // Optimistic update
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: nextStatus, updatedAt: new Date().toISOString() } : r))
    );

    try {
      const res = await fetch(`/api/cms/customer-requests/${encodeURIComponent(id)}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: currentStatus as RequestStatus } : r))
        );
        showToast(`Không thể cập nhật trạng thái: ${err.error || 'Lỗi hệ thống'}`);
        return;
      }

      showToast(`Đã chuyển trạng thái sang "${REQUEST_STATUS_LABELS[nextStatus]}"`);
      onRefresh?.();
    } catch (e: any) {
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: currentStatus as RequestStatus } : r))
      );
      showToast(`Lỗi kết nối: ${e.message}`);
    }
  };

  const handleChangeStatus = async (id: string, newStatus: string) => {
    const targetStatus = newStatus as RequestStatus;
    const current = requests.find((r) => r.id === id);
    const prevStatus = current?.status || 'new';

    if (prevStatus === targetStatus) return;

    // Optimistic update
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const updated = { ...r, status: targetStatus, updatedAt: new Date().toISOString() };
          if (selectedRequest?.id === id) setSelectedRequest(updated);
          return updated;
        }
        return r;
      })
    );

    try {
      const res = await fetch(`/api/cms/customer-requests/${encodeURIComponent(id)}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: targetStatus }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setRequests((prev) =>
          prev.map((r) => {
            if (r.id === id) {
              const reverted = { ...r, status: prevStatus };
              if (selectedRequest?.id === id) setSelectedRequest(reverted);
              return reverted;
            }
            return r;
          })
        );
        showToast(`Không thể cập nhật trạng thái: ${err.error || 'Lỗi hệ thống'}`);
        return;
      }

      showToast(`Đã cập nhật trạng thái: ${REQUEST_STATUS_LABELS[targetStatus]}`);
      onRefresh?.();
    } catch (e: any) {
      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === id) {
            const reverted = { ...r, status: prevStatus };
            if (selectedRequest?.id === id) setSelectedRequest(reverted);
            return reverted;
          }
          return r;
        })
      );
      showToast(`Lỗi kết nối: ${e.message}`);
    }
  };

  const handleAssignUser = (id: string, userId: string) => {
    const staff = staffMembers.find((s) => s.id === userId);
    if (staff) {
      void handleConfirmReassign([id], staff, 'Phân công trực tiếp');
    }
  };

  // 4. Priority Mutation
  const handleUpdatePriority = async (id: string, newPriority: PriorityLevel) => {
    const current = requests.find((r) => r.id === id);
    const prevPriority = current?.priority || 'medium';

    if (prevPriority === newPriority) return;

    // Optimistic update
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const updated = { ...r, priority: newPriority, updatedAt: new Date().toISOString() };
          if (selectedRequest?.id === id) setSelectedRequest(updated);
          return updated;
        }
        return r;
      })
    );

    try {
      const res = await fetch(`/api/cms/customer-requests/${encodeURIComponent(id)}/priority`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority: newPriority }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setRequests((prev) =>
          prev.map((r) => {
            if (r.id === id) {
              const reverted = { ...r, priority: prevPriority };
              if (selectedRequest?.id === id) setSelectedRequest(reverted);
              return reverted;
            }
            return r;
          })
        );
        showToast(`Không thể cập nhật độ ưu tiên: ${err.error || 'Lỗi hệ thống'}`);
        return;
      }

      showToast(`Đã cập nhật độ ưu tiên: ${PRIORITY_LABELS[newPriority]}`);
      onRefresh?.();
    } catch (e: any) {
      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === id) {
            const reverted = { ...r, priority: prevPriority };
            if (selectedRequest?.id === id) setSelectedRequest(reverted);
            return reverted;
          }
          return r;
        })
      );
      showToast(`Lỗi kết nối: ${e.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5">
          <Sparkles className="w-4 h-4 text-orange-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {viewMode === 'list' ? (
        <>
          {/* Header */}
          <CmsPageHeader
            icon={<MessageSquareText />}
            title="Yêu cầu khách hàng"
            description="Quản lý, phân loại và xử lý yêu cầu tiếp nhận từ các biểu mẫu tương tác"
            meta={
              <span className="rounded-md bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">
                {requests.filter((r) => !r.deletedAt).length} yêu cầu
              </span>
            }
          />

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-b border-slate-200 dark:border-slate-800">
            {[
              { key: 'all' as const, label: 'Tất cả', count: stats.all },
              { key: 'new' as const, label: 'Mới tiếp nhận', count: stats.new },
              { key: 'processing' as const, label: 'Đang xử lý', count: stats.processing },
              { key: 'completed' as const, label: 'Hoàn thành', count: stats.completed },
              { key: 'not_suitable' as const, label: 'Không phù hợp', count: stats.not_suitable },
              { key: 'cancelled' as const, label: 'Đã hủy', count: stats.cancelled },
            ].map((tab) => {
              const isActive = filter.tab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setFilter((prev) => ({ ...prev, tab: tab.key }))}
                  className={`px-3.5 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Multi-condition Filter Panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-4">
            {/* Top Row: Search & Export & Reset */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Keyword Search Input */}
              <div className="relative flex items-center flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="w-4 h-4 text-slate-400" />
                </div>
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
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
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
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
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
          {/* Bulk Actions Bar */}
          {selectedRequestIds.length > 0 && (
            <CmsBulkActionBar
              selectedCount={selectedRequestIds.length}
              itemLabel="yêu cầu"
              onClear={() => setSelectedRequestIds([])}
              actions={[
                ...(capabilities.edit
                  ? [
                      {
                        label: 'Gán người phụ trách',
                        onClick: handleOpenReassignBulk,
                      },
                    ]
                  : []),
                ...(capabilities.delete
                  ? [
                      {
                        label: 'Xóa',
                        variant: 'danger' as const,
                        onClick: handleBulkDelete,
                      },
                    ]
                  : []),
              ]}
            />
          )}

          {/* Request List Table */}
          <RequestList
            requests={filteredRequests}
            selectedRequestIds={selectedRequestIds}
            onToggleSelectAll={handleToggleSelectAll}
            onToggleSelectRequest={handleToggleSelectRequest}
            onViewRequest={handleViewDetail}
            onDeleteRequest={capabilities.delete ? handleDeleteRequest : () => {}}
            onQuickStatusToggle={capabilities.edit ? handleQuickStatusToggle : () => {}}
            onReassignRequest={capabilities.edit ? handleOpenReassignSingle : undefined}
            onOpenNotesModal={capabilities.edit ? handleOpenNotesModal : undefined}
          />
        </>
      ) : (
        /* Request Detail Page */
        selectedRequest && (
          <RequestDetailPage
            requestId={selectedRequest.id}
            request={selectedRequest}
            onBack={handleBackToList}
            onAssignUser={capabilities.edit ? handleAssignUser : undefined}
            onReassignRequest={capabilities.edit ? handleOpenReassignSingle : undefined}
            onUpdateStatus={capabilities.edit ? handleChangeStatus : () => {}}
            onUpdatePriority={capabilities.edit ? handleUpdatePriority : () => {}}
            onAddNote={capabilities.edit ? handleAddNote : () => {}}
          />
        )
      )}

      {/* Modal: Gán / Chuyển giao người phụ trách */}
      <RequestReassignModal
        isOpen={reassignModalData.isOpen}
        requests={reassignModalData.requests}
        staffMembers={staffMembers}
        onClose={() => setReassignModalData({ isOpen: false, requests: [] })}
        onConfirmReassign={handleConfirmReassign}
      />

      {/* Modal: Ghi chú nội bộ nhanh */}
      <RequestQuickNotesModal
        isOpen={notesModalData.isOpen}
        request={notesModalData.request}
        onClose={() => setNotesModalData({ isOpen: false, request: null })}
        onAddNote={handleAddNote}
      />

      <CmsTrashConfirmDialog
        open={Boolean(trashTargets && trashTargets.length > 0)}
        itemName={
          trashTargets && trashTargets.length === 1
            ? 'yêu cầu khách hàng này'
            : `${trashTargets?.length ?? 0} yêu cầu đã chọn`
        }
        busy={isDeleting}
        onClose={() => setTrashTargets(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
