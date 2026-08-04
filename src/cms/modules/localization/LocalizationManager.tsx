import React, { useState, useEffect, useMemo } from 'react';
import {
  Globe,
  Sparkles,
  Cpu,
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  Search,
  SlidersHorizontal,
  Download,
  Plus,
  RotateCcw,
  Check,
  X,
  Layers,
  Inbox,
  Filter,
} from 'lucide-react';

import {
  FilterState,
  MainTabType,
  SavedFilterView,
  StaffUser,
  TranslationItem,
  TranslationStatus,
} from './types';
import {
  CURRENT_LOCALIZATION_USER_ID,
  INITIAL_TRANSLATION_ITEMS,
  MOCK_LOCALIZATION_STAFF,
} from './mockData';
import { computeProgressStats, filterTranslationItems } from './utils';
import { ProgressDashboard } from './ProgressDashboard';
import { LocalizationListView } from './LocalizationListView';
import { TranslationEditorDrawer } from './TranslationEditorDrawer';
import { BatchAssignModal } from './BatchAssignModal';
import { SourceDiffModal } from './SourceDiffModal';

export const LocalizationManager: React.FC = () => {
  // Main Items State
  const [items, setItems] = useState<TranslationItem[]>(INITIAL_TRANSLATION_ITEMS);
  const [activeTab, setActiveTab] = useState<MainTabType>('overview');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filter State
  const [filter, setFilter] = useState<FilterState>({
    searchQuery: '',
    itemTypes: [],
    scopes: [],
    statuses: [],
    modules: [],
    assigneeId: 'all',
    reviewerId: 'all',
    targetLocale: 'all',
    hasPlaceholderIssue: false,
    dateRange: 'all',
  });

  const [activeSavedView, setActiveSavedView] = useState<SavedFilterView>('all');
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);

  // Editor & Modals State
  const [selectedItem, setSelectedItem] = useState<TranslationItem | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isBatchAssignOpen, setIsBatchAssignOpen] = useState(false);
  const [diffItem, setDiffItem] = useState<TranslationItem | null>(null);

  // Toast alert
  const [toast, setToast] = useState<{ message: string; type?: 'info' | 'success' | 'warning' } | null>(null);

  const showToast = (message: string, type: 'info' | 'success' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Shortcut key listener for '/' search focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        const searchInput = document.getElementById('localization_search_input');
        if (searchInput) searchInput.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute Statistics
  const stats = useMemo(() => computeProgressStats(items), [items]);

  // Tab count metrics
  const tabCounts = useMemo(() => {
    const all = items.length;
    const frontend = items.filter((i) => i.scope === 'frontend').length;
    const backend = items.filter((i) => i.scope === 'backend').length;
    const content = items.filter((i) => i.scope === 'content_module').length;
    const myQueue = items.filter((i) => i.assignee_id === CURRENT_LOCALIZATION_USER_ID && i.status !== 'complete').length;
    const reviewQueue = items.filter((i) => i.status === 'review').length;
    const missing = items.filter((i) => i.status === 'missing' || !i.target_text).length;
    const outdated = items.filter((i) => i.status === 'outdated').length;

    return { all, frontend, backend, content, myQueue, reviewQueue, missing, outdated };
  }, [items]);

  // Displayed items filtered based on activeTab + search/filters
  const displayedItems = useMemo(() => {
    let result = filterTranslationItems(items, filter, CURRENT_LOCALIZATION_USER_ID);

    switch (activeTab) {
      case 'frontend':
        result = result.filter((i) => i.scope === 'frontend');
        break;
      case 'backend':
        result = result.filter((i) => i.scope === 'backend');
        break;
      case 'content':
        result = result.filter((i) => i.scope === 'content_module');
        break;
      case 'my_queue':
        result = result.filter((i) => i.assignee_id === CURRENT_LOCALIZATION_USER_ID && i.status !== 'complete');
        break;
      case 'review_queue':
        result = result.filter((i) => i.status === 'review');
        break;
      case 'missing':
        result = result.filter((i) => i.status === 'missing' || !i.target_text);
        break;
      case 'outdated':
        result = result.filter((i) => i.status === 'outdated');
        break;
      case 'all':
      case 'overview':
      default:
        break;
    }

    return result;
  }, [items, filter, activeTab]);

  // Apply Saved Filter Views
  const applySavedView = (view: SavedFilterView) => {
    setActiveSavedView(view);
    switch (view) {
      case 'my_queue':
        setActiveTab('my_queue');
        setFilter((prev) => ({ ...prev, assigneeId: 'me' }));
        showToast('Đã mở góc nhìn "Việc của tôi"');
        break;
      case 'en_missing':
        setActiveTab('missing');
        setFilter((prev) => ({ ...prev, statuses: ['missing'], scopes: ['backend'] }));
        showToast('Đã lọc góc nhìn "Chuỗi EN Backend còn thiếu"');
        break;
      case 'outdated':
        setActiveTab('outdated');
        setFilter((prev) => ({ ...prev, statuses: ['outdated'] }));
        showToast('Đã áp dụng góc nhìn "Nguồn vừa thay đổi (Outdated)"');
        break;
      case 'review_pending':
        setActiveTab('review_queue');
        setFilter((prev) => ({ ...prev, statuses: ['review'] }));
        showToast('Đã lọc "Hàng chờ Reviewer duyệt"');
        break;
      case 'all':
      default:
        setActiveTab('all');
        setFilter({
          searchQuery: '',
          itemTypes: [],
          scopes: [],
          statuses: [],
          modules: [],
          assigneeId: 'all',
          reviewerId: 'all',
          targetLocale: 'all',
          hasPlaceholderIssue: false,
          dateRange: 'all',
        });
        showToast('Đã đặt lại bộ lọc về mặc định');
        break;
    }
  };

  // Item Action Handlers
  const handleSaveDraft = (itemId: string, newTargetText: string) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.id === itemId) {
          return {
            ...i,
            target_text: newTargetText,
            status: i.status === 'missing' ? 'in_progress' : i.status,
            updated_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
            history: [
              ...i.history,
              {
                id: `h_${Date.now()}`,
                timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
                actor_name: 'Đặng Mai Chi',
                event_type: 'draft_saved',
                description: 'Đã lưu bản nháp dịch thuật (Draft)',
              },
            ],
          };
        }
        return i;
      })
    );
    showToast('Đã lưu bản nháp bản dịch tiếng Anh!');
  };

  const handleSubmitReview = (itemId: string, newTargetText: string) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.id === itemId) {
          return {
            ...i,
            target_text: newTargetText,
            status: 'review',
            updated_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
            history: [
              ...i.history,
              {
                id: `h_${Date.now()}`,
                timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
                actor_name: 'Đặng Mai Chi',
                event_type: 'submitted_review',
                description: 'Đã gửi bản dịch cho Reviewer phê duyệt',
              },
            ],
          };
        }
        return i;
      })
    );
    showToast('Đã gửi bản dịch tới Reviewer!');
    setIsEditorOpen(false);
  };

  const handleComplete = (itemId: string, newTargetText: string) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.id === itemId) {
          return {
            ...i,
            target_text: newTargetText,
            status: 'complete',
            updated_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
            history: [
              ...i.history,
              {
                id: `h_${Date.now()}`,
                timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
                actor_name: 'Phạm Vũ Bảo Châu',
                event_type: 'completed',
                description: 'Đã duyệt bản dịch đạt chuẩn hoàn thành (Complete)',
              },
            ],
          };
        }
        return i;
      })
    );
    showToast('Đã xác nhận hoàn thành bản dịch!');
    setIsEditorOpen(false);
  };

  const handleReturnReview = (itemId: string, reason: string) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.id === itemId) {
          const newComment = {
            id: `c_${Date.now()}`,
            author_id: 'usr_rev_1',
            author_name: 'Phạm Vũ Bảo Châu',
            author_avatar: MOCK_LOCALIZATION_STAFF[2].avatar,
            content: `Trả lại bản dịch yêu cầu sửa: ${reason}`,
            created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
            type: 'return_reason' as const,
          };
          return {
            ...i,
            status: 'in_progress',
            comments: [newComment, ...i.comments],
            history: [
              ...i.history,
              {
                id: `h_${Date.now()}`,
                timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
                actor_name: 'Phạm Vũ Bảo Châu',
                event_type: 'returned',
                description: `Yêu cầu chỉnh sửa lại bản dịch. Lý do: ${reason}`,
              },
            ],
          };
        }
        return i;
      })
    );
    showToast('Đã trả lại bản dịch kèm ghi chú phản hồi!', 'warning');
    setIsEditorOpen(false);
  };

  const handleQuickSaveTarget = (id: string, newTarget: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, target_text: newTarget, status: 'in_progress' } : i))
    );
    showToast('Đã cập nhật nhanh bản dịch tiếng Anh!');
  };

  const handleConfirmRebase = (itemId: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === itemId
          ? {
              ...i,
              status: 'in_progress',
              history: [
                ...i.history,
                {
                  id: `h_${Date.now()}`,
                  timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
                  actor_name: 'Đặng Mai Chi',
                  event_type: 'draft_saved',
                  description: 'Xác nhận rebase nguồn mới và chuyển trạng thái sang Đang dịch',
                },
              ],
            }
          : i
      )
    );
    showToast('Đã xác nhận rebase nguồn mới thành công!');
  };

  // Preflight Navigation in Editor (Next/Previous incomplete)
  const handleNavigateNextIncomplete = (direction: 'prev' | 'next') => {
    if (!selectedItem) return;
    const incompleteList = displayedItems.filter((i) => i.status !== 'complete');
    if (incompleteList.length === 0) return;

    const currentIndex = incompleteList.findIndex((i) => i.id === selectedItem.id);
    let targetIndex = 0;
    if (direction === 'next') {
      targetIndex = (currentIndex + 1) % incompleteList.length;
    } else {
      targetIndex = (currentIndex - 1 + incompleteList.length) % incompleteList.length;
    }

    setSelectedItem(incompleteList[targetIndex]);
  };

  // Bulk Handlers
  const handleToggleSelectAll = () => {
    if (selectedIds.length === displayedItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(displayedItems.map((i) => i.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleConfirmBatchAssign = (assignee: StaffUser, reviewer: StaffUser, dueDate: string) => {
    setItems((prev) =>
      prev.map((i) =>
        selectedIds.includes(i.id)
          ? {
              ...i,
              assignee_id: assignee.id,
              assignee_name: assignee.name,
              assignee_avatar: assignee.avatar,
              reviewer_id: reviewer.id,
              reviewer_name: reviewer.name,
              reviewer_avatar: reviewer.avatar,
              due_date: dueDate,
              status: i.status === 'missing' ? 'in_progress' : i.status,
            }
          : i
      )
    );
    showToast(`Đã phân công thành công ${selectedIds.length} mục cho ${assignee.name}!`);
    setSelectedIds([]);
    setIsBatchAssignOpen(false);
  };

  const handleBulkStatus = (status: TranslationStatus) => {
    setItems((prev) => prev.map((i) => (selectedIds.includes(i.id) ? { ...i, status } : i)));
    showToast(`Đã chuyển ${selectedIds.length} mục sang trạng thái "${status}"!`);
    setSelectedIds([]);
  };

  const handleBulkExport = () => {
    showToast(`Đã khởi tạo xuất file XLSX cho ${selectedIds.length} bản ghi!`);
    setSelectedIds([]);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. SITEMAP WORKSPACE TABS */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-1">
          {[
            { key: 'overview', label: 'Tổng quan tiến độ', count: 0, icon: Globe },
            { key: 'all', label: 'Tất cả mục', count: tabCounts.all, icon: Layers },
            { key: 'frontend', label: 'Chuỗi Frontend (79 UI)', count: tabCounts.frontend, icon: Sparkles },
            { key: 'backend', label: 'Chuỗi Backend (90 System)', count: tabCounts.backend, icon: Cpu },
            { key: 'content', label: 'Nội dung CMS', count: tabCounts.content, icon: FileText },
            { key: 'my_queue', label: 'Việc của tôi', count: tabCounts.myQueue, icon: UserCheck },
            { key: 'review_queue', label: 'Hàng chờ review', count: tabCounts.reviewQueue, icon: Clock },
            { key: 'missing', label: 'Bản dịch còn thiếu', count: tabCounts.missing, icon: AlertCircle },
            { key: 'outdated', label: 'Nguồn vừa thay đổi', count: tabCounts.outdated, icon: AlertTriangle },
          ].map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as MainTabType)}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
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

      {/* 2. PROGRESS DASHBOARD VIEW */}
      {activeTab === 'overview' && (
        <ProgressDashboard
          stats={stats}
          items={items}
          onNavigateTab={(t) => setActiveTab(t)}
          onSelectQuickAction={(act) => {
            if (act === 'missing_en') applySavedView('en_missing');
            if (act === 'outdated') applySavedView('outdated');
            if (act === 'review') applySavedView('review_pending');
            if (act === 'my_queue') applySavedView('my_queue');
          }}
        />
      )}

      {/* 3. LIST VIEW & TOOLBAR (WHEN NOT OVERVIEW) */}
      {activeTab !== 'overview' && (
        <div className="space-y-4">
          
          {/* SEARCH & ADVANCED TOOLBAR */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 shadow-2xs">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              
              {/* Search input */}
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="localization_search_input"
                  type="text"
                  value={filter.searchQuery}
                  onChange={(e) => setFilter((prev) => ({ ...prev, searchQuery: e.target.value }))}
                  placeholder="Tìm key, module, nội dung VI/EN, ngữ cảnh (Phím '/')..."
                  className="w-full text-xs pl-10 pr-12 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500 outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 border border-slate-300 dark:border-slate-700 px-1.5 py-0.5 rounded">
                  /
                </span>
              </div>

              {/* Saved View & Toolbar Controls */}
              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                <select
                  value={activeSavedView}
                  onChange={(e) => applySavedView(e.target.value as SavedFilterView)}
                  className="text-xs font-semibold px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl outline-none cursor-pointer"
                >
                  <option value="all">👁️ Xem mặc định</option>
                  <option value="my_queue">🔥 Việc của tôi</option>
                  <option value="en_missing">🚨 Chuỗi EN còn thiếu (44 BE)</option>
                  <option value="outdated">⚠️ Nguồn vừa thay đổi (Outdated)</option>
                  <option value="review_pending">✅ Hàng chờ Reviewer duyệt</option>
                </select>

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

                <button
                  onClick={handleBulkExport}
                  className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Xuất báo cáo</span>
                </button>
              </div>

            </div>

            {/* ADVANCED FILTER PANEL */}
            {isAdvancedFilterOpen && (
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs animate-in fade-in duration-150">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Phạm vi (Scope)</label>
                  <select
                    value={filter.scopes[0] || ''}
                    onChange={(e) =>
                      setFilter((prev) => ({
                        ...prev,
                        scopes: e.target.value ? [e.target.value as any] : [],
                      }))
                    }
                    className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="">Tất cả Scope</option>
                    <option value="frontend">Frontend UI (79 chuỗi)</option>
                    <option value="backend">Backend API (90 chuỗi - 44 thiếu)</option>
                    <option value="content_module">Content CMS (Bài viết/SP)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Trạng thái bản dịch</label>
                  <select
                    value={filter.statuses[0] || ''}
                    onChange={(e) =>
                      setFilter((prev) => ({
                        ...prev,
                        statuses: e.target.value ? [e.target.value as any] : [],
                      }))
                    }
                    className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="">Tất cả trạng thái</option>
                    <option value="missing">Còn thiếu (Missing)</option>
                    <option value="in_progress">Đang dịch (In Progress)</option>
                    <option value="review">Chờ duyệt (Review)</option>
                    <option value="complete">Hoàn thành (Complete)</option>
                    <option value="outdated">Nguồn vừa đổi (Outdated)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Biên dịch viên (Assignee)</label>
                  <select
                    value={filter.assigneeId}
                    onChange={(e) => setFilter((prev) => ({ ...prev, assigneeId: e.target.value }))}
                    className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="all">Tất cả biên dịch viên</option>
                    <option value="me">Chỉ việc của tôi</option>
                    <option value="unassigned">Chưa gán (Unassigned)</option>
                    {MOCK_LOCALIZATION_STAFF.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.role})
                      </option>
                    ))}
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

          {/* MAIN DATA TABLE VIEW */}
          <LocalizationListView
            items={displayedItems}
            selectedIds={selectedIds}
            onToggleSelectAll={handleToggleSelectAll}
            onToggleSelectOne={handleToggleSelectOne}
            onSelectItem={(item) => {
              setSelectedItem(item);
              setIsEditorOpen(true);
            }}
            onQuickSaveTarget={handleQuickSaveTarget}
            onOpenSourceDiff={(item) => setDiffItem(item)}
            onBulkAssign={() => setIsBatchAssignOpen(true)}
            onBulkStatus={handleBulkStatus}
            onBulkExport={handleBulkExport}
            currentUserId={CURRENT_LOCALIZATION_USER_ID}
          />
        </div>
      )}

      {/* 4. MODALS & DRAWERS */}
      <TranslationEditorDrawer
        isOpen={isEditorOpen}
        item={selectedItem}
        onClose={() => {
          setIsEditorOpen(false);
          setSelectedItem(null);
        }}
        currentUserId={CURRENT_LOCALIZATION_USER_ID}
        onSaveDraft={handleSaveDraft}
        onSubmitReview={handleSubmitReview}
        onComplete={handleComplete}
        onReturnReview={handleReturnReview}
        onNavigateNextIncomplete={handleNavigateNextIncomplete}
        onOpenSourceDiff={(item) => setDiffItem(item)}
      />

      <BatchAssignModal
        isOpen={isBatchAssignOpen}
        selectedCount={selectedIds.length}
        onClose={() => setIsBatchAssignOpen(false)}
        onConfirm={handleConfirmBatchAssign}
      />

      <SourceDiffModal
        isOpen={!!diffItem}
        item={diffItem}
        onClose={() => setDiffItem(null)}
        onConfirmRebase={handleConfirmRebase}
      />
    </div>
  );
};
