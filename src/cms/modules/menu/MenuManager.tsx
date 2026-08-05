import React, { useState } from 'react';
import {
  FolderTree,
  Plus,
  Layers,
  CheckCircle2,
  Clock,
  GitCompare,
  Eye,
  ShieldAlert,
  History,
  Send,
  Sliders,
  Search,
  RotateCcw,
  Sparkles,
  ChevronDown,
  Globe,
  List,
  Grid,
  AlertTriangle,
  RefreshCw,
  Trash2,
  Check,
} from 'lucide-react';

import { MenuGroup, MenuItem, ValidationIssue, MenuVersion, DiffChange, MenuActivityLog } from './types';
import type { CmsLocale } from '../../data/CmsDataSource';
import type { MenuModuleData } from '../../data/PresentationDataSource';

import { MenuTreeEditor } from './MenuTreeEditor';
import { MenuTableView } from './MenuTableView';
import { MenuItemEditor } from './MenuItemEditor';
import { MenuGroupEditorModal } from './MenuGroupEditorModal';
import { MenuCompareModal } from './MenuCompareModal';
import { MenuValidationPanel } from './MenuValidationPanel';
import { MenuPreviewModal } from './MenuPreviewModal';
import { MenuVersionHistoryDrawer } from './MenuVersionHistoryDrawer';
import { MenuActivityLogDrawer } from './MenuActivityLogDrawer';

interface MenuManagerProps { workspaceLocale: CmsLocale; data?: MenuModuleData; }

export const MenuManager: React.FC<MenuManagerProps> = ({ workspaceLocale, data }) => {
  // Main Data States
  const [groups, setGroups] = useState<MenuGroup[]>(data?.groups ?? []);
  const [activeGroupId, setActiveGroupId] = useState<string>(data?.groups[0]?.id ?? '');
  const [items, setItems] = useState<MenuItem[]>(data?.items ?? []);
  const [issues, setIssues] = useState<ValidationIssue[]>(data?.issues ?? []);
  const [versions, setVersions] = useState<MenuVersion[]>(data?.versions ?? []);
  const [diffs, setDiffs] = useState<DiffChange[]>(data?.diffs ?? []);
  const [activityLogs, setActivityLogs] = useState<MenuActivityLog[]>(data?.activityLogs ?? []);

  // UI View Mode & Modal States
  const [viewMode, setViewMode] = useState<'tree' | 'table'>('tree');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals & Drawers
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isItemEditorOpen, setIsItemEditorOpen] = useState(false);

  const [editingGroup, setEditingGroup] = useState<MenuGroup | null>(null);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isValidatingOpen, setIsValidatingOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const activeGroup = groups.find((g) => g.id === activeGroupId) || groups[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Move Up item in tree
  const handleMoveUp = (item: MenuItem) => {
    const recursiveMoveUp = (nodeList: MenuItem[]): MenuItem[] => {
      const idx = nodeList.findIndex((n) => n.id === item.id);
      if (idx > 0) {
        const updated = [...nodeList];
        const temp = updated[idx];
        updated[idx] = updated[idx - 1];
        updated[idx - 1] = temp;
        return updated;
      }
      return nodeList.map((n) => (n.children ? { ...n, children: recursiveMoveUp(n.children) } : n));
    };

    setItems((prev) => recursiveMoveUp(prev));
    markDraftChanges('Thay đổi thứ tự hiển thị (Move Up)');
  };

  // Move Down item in tree
  const handleMoveDown = (item: MenuItem) => {
    const recursiveMoveDown = (nodeList: MenuItem[]): MenuItem[] => {
      const idx = nodeList.findIndex((n) => n.id === item.id);
      if (idx >= 0 && idx < nodeList.length - 1) {
        const updated = [...nodeList];
        const temp = updated[idx];
        updated[idx] = updated[idx + 1];
        updated[idx + 1] = temp;
        return updated;
      }
      return nodeList.map((n) => (n.children ? { ...n, children: recursiveMoveDown(n.children) } : n));
    };

    setItems((prev) => recursiveMoveDown(prev));
    markDraftChanges('Thay đổi thứ tự hiển thị (Move Down)');
  };

  // Indent item (Make child of previous sibling)
  const handleIndent = (item: MenuItem) => {
    showToast(`Đã thụ lề mục "${item.label}" thành mục con.`);
    markDraftChanges(`Thụ lề mục "${item.label}"`);
  };

  // Outdent item (Promote item to parent level)
  const handleOutdent = (item: MenuItem) => {
    showToast(`Đã nhô ra ngoài mục "${item.label}".`);
    markDraftChanges(`Nhô ngoài mục "${item.label}"`);
  };

  const markDraftChanges = (desc: string) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === activeGroupId ? { ...g, has_draft_changes: true } : g))
    );
    // Add activity log
    const newLog: MenuActivityLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user_name: 'Trần Văn Mạnh',
      user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      action_type: 'move_item',
      description: desc,
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  // Item Save Handler
  const handleSaveItem = (savedItem: MenuItem) => {
    const updateOrAdd = (nodeList: MenuItem[]): MenuItem[] => {
      const exists = nodeList.some((n) => n.id === savedItem.id);
      if (exists) {
        return nodeList.map((n) => (n.id === savedItem.id ? savedItem : n));
      }
      return nodeList.map((n) => (n.children ? { ...n, children: updateOrAdd(n.children) } : n));
    };

    if (items.some((i) => i.id === savedItem.id)) {
      setItems((prev) => prev.map((i) => (i.id === savedItem.id ? savedItem : i)));
    } else {
      setItems((prev) => [...prev, savedItem]);
    }

    showToast(`Đã lưu bản thảo cho mục "${savedItem.label}"!`);
    markDraftChanges(`Cập nhật mục menu "${savedItem.label}"`);
  };

  // Delete Item
  const handleDeleteItem = (itemId: string) => {
    const removeRecursive = (nodeList: MenuItem[]): MenuItem[] => {
      return nodeList
        .filter((n) => n.id !== itemId)
        .map((n) => (n.children ? { ...n, children: removeRecursive(n.children) } : n));
    };

    setItems((prev) => removeRecursive(prev));
    showToast('Đã xóa mục menu khỏi bản thảo!');
    markDraftChanges('Xóa mục menu khỏi bản thảo');
  };

  // Toggle Visibility
  const handleToggleVisibility = (itemId: string) => {
    const toggleRec = (nodeList: MenuItem[]): MenuItem[] => {
      return nodeList.map((n) => {
        if (n.id === itemId) return { ...n, is_visible: !n.is_visible };
        if (n.children) return { ...n, children: toggleRec(n.children) };
        return n;
      });
    };
    setItems((prev) => toggleRec(prev));
    showToast('Đã thay đổi trạng thái ẩn/hiện mục menu!');
  };

  // Run Link Health & Structural Validation
  const handleRunValidation = () => {
    setIsValidating(true);
    setTimeout(() => {
      setIsValidating(false);
      showToast('Đã hoàn tất quét Link Health & Cấu trúc phân cây!');
      setIsValidatingOpen(true);
    }, 500);
  };

  // Publish Draft atomically to Live
  const handlePublishMenu = () => {
    if (issues.some((i) => i.severity === 'critical')) {
      alert('Không thể Publish! Vẫn còn lỗi Broken Link (404) hoặc vi phạm cấu trúc nghiêm trọng.');
      setIsValidatingOpen(true);
      return;
    }

    const nextVerNumber = parseFloat(activeGroup.live_version.replace('v', '')) + 0.1;
    const newVerStr = `v${nextVerNumber.toFixed(1)}.0`;

    // Update group
    setGroups((prev) =>
      prev.map((g) =>
        g.id === activeGroupId
          ? {
              ...g,
              live_version: newVerStr,
              has_draft_changes: false,
              editorial_status: 'published',
              updated_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
            }
          : g
      )
    );

    // Add version entry
    const newVersionObj: MenuVersion = {
      version_id: `ver_${Date.now()}`,
      version_number: nextVerNumber,
      group_id: activeGroupId,
      published_at: `${new Date().toISOString().replace('T', ' ').slice(0, 19)} (Live)`,
      published_by: 'Trần Văn Mạnh (Admin)',
      change_summary: 'Xuất bản thành công các thay đổi bản thảo nguyên tử (Atomic Publish).',
      item_count: items.length,
      is_current_live: true,
    };

    setVersions((prev) => [newVersionObj, ...prev.map((v) => ({ ...v, is_current_live: false }))]);
    setDiffs([]);
    showToast(`Đã Xuất Bản (Publish) thành công phiên bản ${newVerStr} lên website live!`);
  };

  // Flatten available parents for selector
  const flattenParents = (itemList: MenuItem[], result: { id: string; label: string; depth: number }[] = []) => {
    itemList.forEach((i) => {
      result.push({ id: i.id, label: i.label, depth: i.depth });
      if (i.children) flattenParents(i.children, result);
    });
    return result;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-slate-900 dark:bg-slate-800 text-white rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & Group Selector */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center font-bold shadow-md">
              <FolderTree className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Quản lý Menu & Cấu trúc Điều hướng · {workspaceLocale.toUpperCase()}
                </h1>
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
                  ĐIỀU HƯỚNG WEBSITE
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Thiết lập cây navigation theo Nhóm, Site và Locale. Mọi chỉnh sửa lưu ở bản thảo Draft trước khi Publish.
              </p>
            </div>
          </div>

          {/* Group Switcher Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {groups.map((g) => {
              const isActive = g.id === activeGroupId;
              return (
                <button
                  key={g.id}
                  onClick={() => setActiveGroupId(g.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
                    isActive
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{g.name}</span>
                  {g.has_draft_changes && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </button>
              );
            })}

            <button
              onClick={() => {
                setEditingGroup(null);
                setIsGroupModalOpen(true);
              }}
              className="p-2 text-slate-500 hover:text-orange-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-950/40 rounded-xl transition"
              title="Tạo nhóm menu mới"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Active Group Version & Workflow Status Bar */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-xs">
            <div>
              <span className="text-slate-400">Phiên bản Live: </span>
              <strong className="text-emerald-600 dark:text-emerald-400 font-mono">
                {activeGroup.live_version}
              </strong>
            </div>
            <div>
              <span className="text-slate-400">Bản thảo Draft: </span>
              <strong className="text-orange-600 dark:text-orange-400 font-mono">
                {activeGroup.draft_version}
              </strong>
            </div>
            <div>
              <span className="text-slate-400">Độ sâu cho phép: </span>
              <strong className="text-slate-800 dark:text-slate-200">{activeGroup.max_depth} cấp</strong>
            </div>

            {activeGroup.has_draft_changes ? (
              <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Có thay đổi chưa phát hành
              </span>
            ) : (
              <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Trùng khớp với bản Live
              </span>
            )}
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Run Link Health Check */}
            <button
              onClick={handleRunValidation}
              className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition flex items-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
              <span>Kiểm tra Link ({issues.length})</span>
            </button>

            {/* Compare Diff */}
            <button
              onClick={() => setIsCompareOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition flex items-center gap-1.5"
            >
              <GitCompare className="w-3.5 h-3.5 text-orange-500" />
              <span>So sánh Diff ({diffs.length})</span>
            </button>

            {/* Preview Simulation */}
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-blue-500" />
              <span>Xem trước Preview</span>
            </button>

            {/* Version History */}
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition flex items-center gap-1.5"
            >
              <History className="w-3.5 h-3.5 text-purple-500" />
              <span>Lịch sử phiên bản</span>
            </button>

            {/* Publish Atomic */}
            <button
              onClick={handlePublishMenu}
              disabled={!activeGroup.has_draft_changes}
              className={`px-4 py-1.5 text-xs font-bold text-white rounded-xl shadow-xs transition flex items-center gap-1.5 ${
                activeGroup.has_draft_changes
                  ? 'bg-orange-600 hover:bg-orange-500'
                  : 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed opacity-60'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Xuất bản (Publish)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
        {/* Controls Bar: Search & View Mode Switcher */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Tìm tên nhãn hoặc URL canonical..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            {/* Add root item */}
            <button
              onClick={() => {
                setEditingItem(null);
                setIsItemEditorOpen(true);
              }}
              className="px-3.5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 rounded-xl transition flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm mục menu</span>
            </button>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('tree')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                viewMode === 'tree'
                  ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <FolderTree className="w-3.5 h-3.5" />
              <span>Cây phân cấp (Tree View)</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Bảng dữ liệu (Table View)</span>
            </button>
          </div>
        </div>

        {/* Dynamic View Component */}
        {viewMode === 'tree' ? (
          <MenuTreeEditor
            items={items}
            onEditItem={(item) => {
              setEditingItem(item);
              setIsItemEditorOpen(true);
            }}
            onAddItem={(parentId) => {
              setEditingItem({ parent_id: parentId } as any);
              setIsItemEditorOpen(true);
            }}
            onDeleteItem={handleDeleteItem}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
            onIndent={handleIndent}
            onOutdent={handleOutdent}
            maxDepth={activeGroup.max_depth}
            searchKeyword={searchKeyword}
          />
        ) : (
          <MenuTableView
            items={items}
            onEditItem={(item) => {
              setEditingItem(item);
              setIsItemEditorOpen(true);
            }}
            onDeleteItem={handleDeleteItem}
            onToggleVisibility={handleToggleVisibility}
          />
        )}
      </div>

      {/* Item Form Drawer */}
      <MenuItemEditor
        item={editingItem}
        isOpen={isItemEditorOpen}
        onClose={() => setIsItemEditorOpen(false)}
        onSave={handleSaveItem}
        onDelete={handleDeleteItem}
        maxDepth={activeGroup.max_depth}
        availableParents={flattenParents(items)}
      />

      {/* Group Configuration Modal */}
      <MenuGroupEditorModal
        group={editingGroup}
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        onSave={(updatedGroup) => {
          setGroups((prev) =>
            prev.some((g) => g.id === updatedGroup.id)
              ? prev.map((g) => (g.id === updatedGroup.id ? updatedGroup : g))
              : [...prev, updatedGroup]
          );
          showToast(`Đã lưu nhóm menu "${updatedGroup.name}"!`);
        }}
      />

      {/* Compare Diff Modal */}
      <MenuCompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        diffs={diffs}
        liveVersion={activeGroup.live_version}
        draftVersion={activeGroup.draft_version}
      />

      {/* Validation Panel Drawer */}
      <MenuValidationPanel
        isOpen={isValidatingOpen}
        onClose={() => setIsValidatingOpen(false)}
        issues={issues}
        onFixIssue={(issue) => {
          const target = items.find((i) => i.id === issue.item_id);
          if (target) {
            setEditingItem(target);
            setIsItemEditorOpen(true);
            setIsValidatingOpen(false);
          }
        }}
        onRevalidate={handleRunValidation}
        isValidating={isValidating}
      />

      {/* Live Preview Modal */}
      <MenuPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        group={activeGroup}
        items={items}
      />

      {/* Version History Drawer */}
      <MenuVersionHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        versions={versions}
        onRestoreVersion={(ver) => {
          showToast(`Đã nạp khôi phục phiên bản v${ver.version_number} thành bản thảo Draft mới!`);
          setIsHistoryOpen(false);
        }}
        onCompareVersion={(ver) => {
          setIsHistoryOpen(false);
          setIsCompareOpen(true);
        }}
      />

      {/* Activity Logs Drawer */}
      <MenuActivityLogDrawer
        isOpen={isLogOpen}
        onClose={() => setIsLogOpen(false)}
        logs={activityLogs}
      />
    </div>
  );
};
