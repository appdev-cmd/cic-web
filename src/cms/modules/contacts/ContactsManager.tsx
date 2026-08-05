import React, { useState, useEffect, useMemo } from 'react';
import {
  Inbox,
  UserCheck,
  Clock,
  AlertTriangle,
  MessageSquare,
  FileCheck,
  CheckCircle2,
  ShieldAlert,
  Trash2,
  Search,
  Filter,
  RotateCcw,
  Plus,
  SlidersHorizontal,
  Bookmark,
  Check,
  X,
  Eye,
  Sparkles,
  Command,
} from 'lucide-react';

import {
  ContactRequest,
  ContactSource,
  ContactStatus,
  FilterState,
  MainTabType,
  PriorityLevel,
  SavedFilterView,
  SlaStatus,
  StaffMember,
} from './types';
import type { CmsLocale } from '../../data/CmsDataSource';
import type { ContactsModuleData } from '../../data/ContactsDataSource';
import { filterContactRequests } from './utils';
import { ContactListView } from './ContactListView';
import { ContactDetailDrawer } from './ContactDetailDrawer';
import { ContactReassignModal } from './ContactReassignModal';
import { ContactSpamDuplicateModal } from './ContactSpamDuplicateModal';
import { ContactPiiAuditModal } from './ContactPiiAuditModal';

interface ContactsManagerProps {
  workspaceLocale: CmsLocale;
  data: ContactsModuleData;
}

export const ContactsManager: React.FC<ContactsManagerProps> = ({ workspaceLocale, data }) => {
  // Main Data State
  const [contacts, setContacts] = useState<ContactRequest[]>(data.contacts);
  const [activeTab, setActiveTab] = useState<MainTabType>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filter State
  const [filter, setFilter] = useState<FilterState>({
    searchQuery: '',
    sources: [],
    statuses: [],
    priority: [],
    slaStatuses: [],
    ownerId: 'all',
    team: 'all',
    dateRange: 'all',
    productId: 'all',
    isUnreadOnly: false,
  });

  const [activeSavedView, setActiveSavedView] = useState<SavedFilterView>('all');
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);

  // Modals & Drawers State
  const [selectedContact, setSelectedContact] = useState<ContactRequest | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [reassignContact, setReassignContact] = useState<ContactRequest | null>(null);
  const [spamDupModalState, setSpamDupModalState] = useState<{
    isOpen: boolean;
    type: 'spam' | 'duplicate';
    contact: ContactRequest | null;
  }>({ isOpen: false, type: 'spam', contact: null });

  const [isAuditPiiOpen, setIsAuditPiiOpen] = useState(false);
  const [auditContact, setAuditContact] = useState<ContactRequest | null>(null);

  // Toast & Undo Notification
  const [toast, setToast] = useState<{ message: string; type?: 'info' | 'success' | 'warning' } | null>(null);

  // Keyboard shortcut listener (/ for search, C for claim)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search on '/'
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        const searchInput = document.getElementById('contacts_search_input');
        if (searchInput) searchInput.focus();
      }
      // Quick claim on 'C'
      if (e.key === 'c' || e.key === 'C') {
        if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA' && selectedContact && !selectedContact.owner_id) {
          e.preventDefault();
          handleClaim(selectedContact.id);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedContact]);

  // Tab count calculations
  const counts = useMemo(() => {
    const all = contacts.filter((c) => c.status !== 'spam' && c.status !== 'duplicate' && !c.deleted_at).length;
    const myQueue = contacts.filter((c) => c.owner_id === data.currentUserId && c.status !== 'closed' && !c.deleted_at).length;
    const unassigned = contacts.filter((c) => !c.owner_id && c.status !== 'spam' && c.status !== 'duplicate' && !c.deleted_at).length;
    const overdue = contacts.filter((c) => c.sla_status === 'overdue' && c.status !== 'resolved' && c.status !== 'closed' && !c.deleted_at).length;
    const general = contacts.filter((c) => c.source === 'general_contact' && !c.deleted_at).length;
    const product = contacts.filter((c) => c.source === 'product_registration' && !c.deleted_at).length;
    const resolved = contacts.filter((c) => (c.status === 'resolved' || c.status === 'closed') && !c.deleted_at).length;
    const spam = contacts.filter((c) => (c.status === 'spam' || c.status === 'duplicate') && !c.deleted_at).length;
    const trash = contacts.filter((c) => !!c.deleted_at).length;

    return { all, myQueue, unassigned, overdue, general, product, resolved, spam, trash };
  }, [contacts]);

  // Apply tab filter on top of search/filter state
  const displayedContacts = useMemo(() => {
    let result = filterContactRequests(contacts, filter, data.currentUserId ?? '');

    switch (activeTab) {
      case 'my_queue':
        result = result.filter((c) => c.owner_id === data.currentUserId && !c.deleted_at);
        break;
      case 'unassigned':
        result = result.filter((c) => !c.owner_id && c.status !== 'spam' && c.status !== 'duplicate' && !c.deleted_at);
        break;
      case 'overdue':
        result = result.filter((c) => c.sla_status === 'overdue' && c.status !== 'resolved' && c.status !== 'closed' && !c.deleted_at);
        break;
      case 'general':
        result = result.filter((c) => c.source === 'general_contact' && !c.deleted_at);
        break;
      case 'product':
        result = result.filter((c) => c.source === 'product_registration' && !c.deleted_at);
        break;
      case 'resolved':
        result = result.filter((c) => (c.status === 'resolved' || c.status === 'closed') && !c.deleted_at);
        break;
      case 'spam':
        result = result.filter((c) => (c.status === 'spam' || c.status === 'duplicate') && !c.deleted_at);
        break;
      case 'trash':
        result = result.filter((c) => !!c.deleted_at);
        break;
      case 'all':
      default:
        result = result.filter((c) => c.status !== 'spam' && c.status !== 'duplicate' && !c.deleted_at);
        break;
    }

    return result;
  }, [contacts, filter, activeTab]);

  // Saved View Presets
  const applySavedView = (view: SavedFilterView) => {
    setActiveSavedView(view);
    switch (view) {
      case 'my_urgent':
        setActiveTab('my_queue');
        setFilter((prev) => ({ ...prev, priority: ['urgent', 'high'] }));
        showToast('Đã áp dụng góc nhìn "Việc khẩn cấp của tôi"');
        break;
      case 'unassigned_today':
        setActiveTab('unassigned');
        setFilter((prev) => ({ ...prev, ownerId: 'unassigned' }));
        showToast('Đã áp dụng góc nhìn "Yêu cầu chưa phân công"');
        break;
      case 'overdue_sales':
        setActiveTab('overdue');
        setFilter((prev) => ({ ...prev, slaStatuses: ['overdue'] }));
        showToast('Đã áp dụng góc nhìn "Cảnh báo quá hạn SLA"');
        break;
      case 'product_quotes':
        setActiveTab('product');
        setFilter((prev) => ({ ...prev, sources: ['product_registration'] }));
        showToast('Đã lọc "Liên hệ & Báo giá sản phẩm"');
        break;
      case 'awaiting_close':
        setActiveTab('resolved');
        setFilter((prev) => ({ ...prev, statuses: ['resolved'] }));
        showToast('Đã lọc "Yêu cầu chờ nghiệm thu / đóng"');
        break;
      case 'all':
      default:
        setActiveTab('all');
        setFilter({
          searchQuery: '',
          sources: [],
          statuses: [],
          priority: [],
          slaStatuses: [],
          ownerId: 'all',
          team: 'all',
          dateRange: 'all',
          productId: 'all',
          isUnreadOnly: false,
        });
        showToast('Đã lập lại bộ lọc về mặc định');
        break;
    }
  };

  const showToast = (message: string, type: 'info' | 'success' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Handlers for Request Actions
  const handleClaim = (contactId: string) => {
    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === contactId) {
          const currentUser = data.staffMembers.find((staff) => staff.id === data.currentUserId);
          return {
            ...c,
            owner_id: data.currentUserId,
            owner_name: currentUser?.name || 'Nguyễn Văn Minh',
            owner_avatar: currentUser?.avatar,
            assigned_team: currentUser?.team || 'Sales CAD/BIM',
            status: c.status === 'new' ? 'assigned' : c.status,
            timeline: [
              ...c.timeline,
              {
                id: `tl_${Date.now()}`,
                timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                actor_name: currentUser?.name || 'Nguyễn Văn Minh',
                event_type: 'assigned',
                description: 'Đã nhận phụ trách yêu cầu (Claim task)',
                old_value: 'Unassigned',
                new_value: currentUser?.name || 'Nguyễn Văn Minh',
              },
            ],
          };
        }
        return c;
      })
    );
    showToast(`Đã nhận phụ trách thành công yêu cầu ${contactId}!`);
  };

  const handleConfirmReassign = (targetStaff: StaffMember, reason: string) => {
    if (!reassignContact) return;
    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === reassignContact.id) {
          return {
            ...c,
            owner_id: targetStaff.id,
            owner_name: targetStaff.name,
            owner_avatar: targetStaff.avatar,
            assigned_team: targetStaff.team,
            status: c.status === 'new' ? 'assigned' : c.status,
            internal_notes: [
              ...c.internal_notes,
              {
                id: `note_${Date.now()}`,
                author_id: data.currentUserId ?? '',
                author_name: 'Nguyễn Văn Minh',
                author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
                content: `Chuyển giao cho ${targetStaff.name}. Lý do: ${reason}`,
                created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
              },
            ],
            timeline: [
              ...c.timeline,
              {
                id: `tl_${Date.now()}`,
                timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                actor_name: 'Nguyễn Văn Minh',
                event_type: 'reassigned',
                description: `Chuyển giao yêu cầu cho ${targetStaff.name} (${targetStaff.team}). Lý do: ${reason}`,
                old_value: c.owner_name || 'Unassigned',
                new_value: targetStaff.name,
              },
            ],
          };
        }
        return c;
      })
    );
    showToast(`Đã chuyển giao ${reassignContact.id} cho ${targetStaff.name}!`);
  };

  const handleUpdateStatus = (contactId: string, newStatus: ContactStatus, resolutionSummary?: string) => {
    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === contactId) {
          return {
            ...c,
            status: newStatus,
            resolution_summary: resolutionSummary || c.resolution_summary,
            resolved_at: newStatus === 'resolved' ? new Date().toISOString() : c.resolved_at,
            closed_at: newStatus === 'closed' ? new Date().toISOString() : c.closed_at,
            timeline: [
              ...c.timeline,
              {
                id: `tl_${Date.now()}`,
                timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                actor_name: 'Nguyễn Văn Minh',
                event_type: 'status_changed',
                description: `Cập nhật trạng thái sang "${newStatus}"`,
                old_value: c.status,
                new_value: newStatus,
              },
            ],
          };
        }
        return c;
      })
    );
    showToast(`Đã chuyển trạng thái ${contactId} sang "${newStatus}"!`);
  };

  const handleUpdatePriority = (contactId: string, newPriority: PriorityLevel) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === contactId ? { ...c, priority: newPriority } : c))
    );
    showToast(`Đã cập nhật mức ưu tiên thành "${newPriority.toUpperCase()}"`);
  };

  const handleAddInternalNote = (contactId: string, noteContent: string, isPinned: boolean) => {
    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === contactId) {
          const newNote = {
            id: `note_${Date.now()}`,
            author_id: data.currentUserId ?? '',
            author_name: 'Nguyễn Văn Minh',
            author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
            content: noteContent,
            is_pinned: isPinned,
            created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
          };
          return {
            ...c,
            internal_notes: [newNote, ...c.internal_notes],
            timeline: [
              ...c.timeline,
              {
                id: `tl_${Date.now()}`,
                timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                actor_name: 'Nguyễn Văn Minh',
                event_type: 'note_added',
                description: 'Đã thêm ghi chú nội bộ mới',
              },
            ],
          };
        }
        return c;
      })
    );
    showToast('Đã lưu ghi chú xử lý nội bộ!');
  };

  const handleConfirmSpam = (reason: string) => {
    const contact = spamDupModalState.contact;
    if (!contact) return;
    setContacts((prev) =>
      prev.map((c) =>
        c.id === contact.id
          ? {
              ...c,
              status: 'spam',
              spam_reason: reason,
              timeline: [
                ...c.timeline,
                {
                  id: `tl_${Date.now()}`,
                  timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                  actor_name: 'Nguyễn Văn Minh',
                  event_type: 'marked_spam',
                  description: `Đã đánh dấu Spam / Rác. Lý do: ${reason}`,
                },
              ],
            }
          : c
      )
    );
    showToast(`Đã chuyển ${contact.id} vào danh sách Spam / Rác`);
  };

  const handleConfirmDuplicate = (originalId: string, reason: string) => {
    const contact = spamDupModalState.contact;
    if (!contact) return;
    setContacts((prev) =>
      prev.map((c) =>
        c.id === contact.id
          ? {
              ...c,
              status: 'duplicate',
              duplicate_of_id: originalId,
              timeline: [
                ...c.timeline,
                {
                  id: `tl_${Date.now()}`,
                  timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                  actor_name: 'Nguyễn Văn Minh',
                  event_type: 'status_changed',
                  description: `Đã liên kết đánh dấu trùng lặp với bản ghi gốc ${originalId}`,
                },
              ],
            }
          : c
      )
    );
    showToast(`Đã liên kết trùng lặp ${contact.id} với ${originalId}`);
  };

  const handleLogPiiReveal = (contactId: string) => {
    setContacts((prev) =>
      prev.map((c) =>
        c.id === contactId
          ? {
              ...c,
              timeline: [
                ...c.timeline,
                {
                  id: `tl_${Date.now()}`,
                  timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                  actor_name: 'Nguyễn Văn Minh',
                  event_type: 'pii_revealed',
                  description: 'Đã giải mã hiển thị thông tin PII đầy đủ (Email/Số điện thoại)',
                },
              ],
            }
          : c
      )
    );
  };

  // Bulk Selection Controls
  const handleToggleSelectAll = () => {
    if (selectedIds.length === displayedContacts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(displayedContacts.map((c) => c.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleBulkAssign = () => {
    setContacts((prev) =>
      prev.map((c) =>
        selectedIds.includes(c.id)
          ? {
              ...c,
              owner_id: data.currentUserId,
              owner_name: 'Nguyễn Văn Minh',
              assigned_team: 'Sales CAD/BIM',
              status: c.status === 'new' ? 'assigned' : c.status,
            }
          : c
      )
    );
    showToast(`Đã phân công ${selectedIds.length} yêu cầu cho bạn!`);
    setSelectedIds([]);
  };

  const handleBulkStatus = (status: ContactStatus) => {
    setContacts((prev) => prev.map((c) => (selectedIds.includes(c.id) ? { ...c, status } : c)));
    showToast(`Đã chuyển ${selectedIds.length} yêu cầu sang trạng thái "${status}"!`);
    setSelectedIds([]);
  };

  const handleBulkSpam = () => {
    setContacts((prev) => prev.map((c) => (selectedIds.includes(c.id) ? { ...c, status: 'spam' } : c)));
    showToast(`Đã chuyển ${selectedIds.length} yêu cầu vào Spam!`);
    setSelectedIds([]);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert with Dismiss */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-xs text-blue-800 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300">
        <span>Hàng đợi liên hệ dùng chung toàn hệ thống; ngôn ngữ nguồn được giữ trên từng yêu cầu.</span>
        <span className="font-bold uppercase">Workspace {workspaceLocale}</span>
      </div>

      {/* 1. HEADER STATS SUMMARY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div
          onClick={() => setActiveTab('all')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            activeTab === 'all'
              ? 'bg-orange-50 dark:bg-orange-950/30 border-orange-500 shadow-xs'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tất cả yêu cầu</span>
            <Inbox className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">{counts.all}</div>
        </div>

        <div
          onClick={() => setActiveTab('my_queue')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            activeTab === 'my_queue'
              ? 'bg-orange-50 dark:bg-orange-950/30 border-orange-500 shadow-xs'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Việc của tôi</span>
            <UserCheck className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">{counts.myQueue}</div>
        </div>

        <div
          onClick={() => setActiveTab('unassigned')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            activeTab === 'unassigned'
              ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-500 shadow-xs'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Chưa phân công</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2">{counts.unassigned}</div>
        </div>

        <div
          onClick={() => setActiveTab('overdue')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            activeTab === 'overdue'
              ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-500 shadow-xs'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Quá hạn SLA</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-2">{counts.overdue}</div>
        </div>

        <div
          onClick={() => setActiveTab('general')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            activeTab === 'general'
              ? 'bg-sky-50 dark:bg-sky-950/30 border-sky-500 shadow-xs'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Liên hệ chung</span>
            <MessageSquare className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">{counts.general}</div>
        </div>

        <div
          onClick={() => setActiveTab('product')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            activeTab === 'product'
              ? 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-500 shadow-xs'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Liên hệ sản phẩm</span>
            <FileCheck className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">{counts.product}</div>
        </div>
      </div>

      {/* 2. SYSTEM WORKSPACE VIEW TABS (SITEMAP VIEWS) */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-1">
          {[
            { key: 'all', label: 'Tất cả yêu cầu', count: counts.all, icon: Inbox },
            { key: 'my_queue', label: 'Việc của tôi', count: counts.myQueue, icon: UserCheck },
            { key: 'unassigned', label: 'Chưa phân công', count: counts.unassigned, icon: Clock },
            { key: 'overdue', label: 'Quá hạn SLA', count: counts.overdue, icon: AlertTriangle },
            { key: 'general', label: 'Liên hệ chung', count: counts.general, icon: MessageSquare },
            { key: 'product', label: 'Liên hệ sản phẩm', count: counts.product, icon: FileCheck },
            { key: 'resolved', label: 'Đã giải quyết', count: counts.resolved, icon: CheckCircle2 },
            { key: 'spam', label: 'Spam / Trùng', count: counts.spam, icon: ShieldAlert },
            { key: 'trash', label: 'Thùng rác', count: counts.trash, icon: Trash2 },
          ].map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as MainTabType)}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] rounded-full ${
                      isActive
                        ? 'bg-orange-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. SEARCH & ADVANCED TOOLBAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Search Input with Shortcut indicator */}
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="contacts_search_input"
              type="text"
              value={filter.searchQuery}
              onChange={(e) => setFilter((prev) => ({ ...prev, searchQuery: e.target.value }))}
              placeholder="Tìm mã REQ, tên người gửi, email, công ty, nội dung (Phím '/')..."
              className="w-full text-xs pl-10 pr-12 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500 outline-none"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 border border-slate-300 dark:border-slate-700 px-1.5 py-0.5 rounded">
              /
            </span>
          </div>

          {/* Quick Filters & Saved Views */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            {/* Saved Views Dropdown */}
            <select
              value={activeSavedView}
              onChange={(e) => applySavedView(e.target.value as SavedFilterView)}
              className="text-xs font-semibold px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl outline-none cursor-pointer"
            >
              <option value="all">👁️ Xem mặc định</option>
              <option value="my_urgent">🔥 Việc khẩn cấp của tôi</option>
              <option value="unassigned_today">⏳ Yêu cầu chưa phân công</option>
              <option value="overdue_sales">⚠️ Cảnh báo quá hạn SLA</option>
              <option value="product_quotes">📦 Báo giá sản phẩm</option>
              <option value="awaiting_close">✅ Chờ đóng / nghiệm thu</option>
            </select>

            {/* Toggle Advanced Filter */}
            <button
              onClick={() => setIsAdvancedFilterOpen(!isAdvancedFilterOpen)}
              className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-colors flex items-center gap-1.5 ${
                isAdvancedFilterOpen
                  ? 'bg-orange-50 dark:bg-orange-950/40 border-orange-500 text-orange-600'
                  : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Bộ lọc nâng cao</span>
            </button>

          </div>

        </div>

        {/* ADVANCED FILTER PANEL */}
        {isAdvancedFilterOpen && (
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs animate-in fade-in duration-150">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Mức ưu tiên</label>
              <select
                value={filter.priority[0] || ''}
                onChange={(e) =>
                  setFilter((prev) => ({
                    ...prev,
                    priority: e.target.value ? ([e.target.value] as PriorityLevel[]) : [],
                  }))
                }
                className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                <option value="">Tất cả mức ưu tiên</option>
                <option value="urgent">Khẩn cấp</option>
                <option value="high">Cao</option>
                <option value="normal">Bình thường</option>
                <option value="low">Thấp</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Nhân sự phụ trách</label>
              <select
                value={filter.ownerId}
                onChange={(e) => setFilter((prev) => ({ ...prev, ownerId: e.target.value }))}
                className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                <option value="all">Tất cả nhân sự</option>
                <option value="me">Chỉ việc của tôi</option>
                <option value="unassigned">Chưa phân công (Unassigned)</option>
                {data.staffMembers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.team})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Trạng thái SLA</label>
              <select
                value={filter.slaStatuses[0] || ''}
                onChange={(e) =>
                  setFilter((prev) => ({
                    ...prev,
                    slaStatuses: e.target.value ? ([e.target.value] as SlaStatus[]) : [],
                  }))
                }
                className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                <option value="">Tất cả SLA</option>
                <option value="on_time">Đang trong hạn</option>
                <option value="near_overdue">Gần quá hạn</option>
                <option value="overdue">Đã quá hạn SLA</option>
              </select>
            </div>

            <div className="flex items-end gap-2">
              <button
                onClick={() => applySavedView('all')}
                className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-colors"
              >
                Xóa lọc
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. MAIN DATA TABLE VIEW */}
      <ContactListView
        contacts={displayedContacts}
        selectedIds={selectedIds}
        onToggleSelectAll={handleToggleSelectAll}
        onToggleSelectOne={handleToggleSelectOne}
        onSelectContact={(c) => {
          setSelectedContact(c);
          setIsDetailOpen(true);
        }}
        onClaim={handleClaim}
        onOpenReassign={(c) => setReassignContact(c)}
        onQuickUpdateStatus={handleUpdateStatus}
        onMarkSpam={(c) => setSpamDupModalState({ isOpen: true, type: 'spam', contact: c })}
        onMarkDuplicate={(c) => setSpamDupModalState({ isOpen: true, type: 'duplicate', contact: c })}
        onBulkAssign={handleBulkAssign}
        onBulkStatus={handleBulkStatus}
        onBulkSpam={handleBulkSpam}
      />

      {/* 5. MODALS & DRAWERS */}
      {/* Detail Drawer */}
      <ContactDetailDrawer
        isOpen={isDetailOpen}
        contact={selectedContact}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedContact(null);
        }}
        currentUserId={data.currentUserId ?? ''}
        onClaim={handleClaim}
        onOpenReassign={(c) => setReassignContact(c)}
        onUpdateStatus={handleUpdateStatus}
        onUpdatePriority={handleUpdatePriority}
        onAddInternalNote={handleAddInternalNote}
        onMarkSpam={(c) => setSpamDupModalState({ isOpen: true, type: 'spam', contact: c })}
        onMarkDuplicate={(c) => setSpamDupModalState({ isOpen: true, type: 'duplicate', contact: c })}
        onOpenAuditPii={(c) => {
          setAuditContact(c);
          setIsAuditPiiOpen(true);
        }}
        onLogPiiReveal={handleLogPiiReveal}
      />

      {/* Reassign Modal */}
      <ContactReassignModal
        isOpen={!!reassignContact}
        contact={reassignContact}
        staffMembers={data.staffMembers}
        onClose={() => setReassignContact(null)}
        onConfirmReassign={handleConfirmReassign}
      />

      {/* Spam & Duplicate Modal */}
      <ContactSpamDuplicateModal
        isOpen={spamDupModalState.isOpen}
        type={spamDupModalState.type}
        contact={spamDupModalState.contact}
        allContacts={contacts}
        onClose={() => setSpamDupModalState({ isOpen: false, type: 'spam', contact: null })}
        onConfirmSpam={handleConfirmSpam}
        onConfirmDuplicate={handleConfirmDuplicate}
      />

      {/* PII Audit Log Modal */}
      <ContactPiiAuditModal
        isOpen={isAuditPiiOpen}
        onClose={() => setIsAuditPiiOpen(false)}
        timelineEvents={auditContact?.timeline || []}
      />
    </div>
  );
};
