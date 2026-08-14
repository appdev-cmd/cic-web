import React, { useState } from 'react';
import {
  FolderTree,
  Plus,
  Layers,
  CheckCircle2,
  Eye,
  Search,
  List,
} from 'lucide-react';

import { MenuGroup, MenuItem } from './types';
import type { CmsLocale } from '../../data/CmsDataSource';
import type { MenuModuleData } from '../../data/PresentationDataSource';

import { MenuTreeEditor } from './MenuTreeEditor';
import { MenuTableView } from './MenuTableView';
import { MenuItemEditor } from './MenuItemEditor';
import { MenuGroupEditorModal } from './MenuGroupEditorModal';
import { MenuPreviewModal } from './MenuPreviewModal';
import { CmsIconButton } from '../../components/ui/CmsButton';
import { CmsPageHeader } from '../../components/ui/CmsPageHeader';
import { CmsTabs } from '../../components/ui/CmsTabs';

interface MenuManagerProps { workspaceLocale: CmsLocale; data?: MenuModuleData; }

export const MenuManager: React.FC<MenuManagerProps> = ({ workspaceLocale, data }) => {
  // Main Data States
  const [groups, setGroups] = useState<MenuGroup[]>(data?.groups ?? []);
  const [activeGroupId, setActiveGroupId] = useState<string>(data?.groups[0]?.id ?? '');
  const [items, setItems] = useState<MenuItem[]>(data?.items ?? []);

  // UI View Mode & Modal States
  const [viewMode, setViewMode] = useState<'tree' | 'table'>('tree');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals & Drawers
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isItemEditorOpen, setIsItemEditorOpen] = useState(false);

  const [editingGroup, setEditingGroup] = useState<MenuGroup | null>(null);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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
    showToast('Đã thay đổi thứ tự mục menu.');
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
    showToast('Đã thay đổi thứ tự mục menu.');
  };

  // Indent item (Make child of previous sibling)
  const handleIndent = (item: MenuItem) => {
    showToast(`Đã thụ lề mục "${item.label}" thành mục con.`);
  };

  // Outdent item (Promote item to parent level)
  const handleOutdent = (item: MenuItem) => {
    showToast(`Đã nhô ra ngoài mục "${item.label}".`);
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

    showToast(`Đã lưu mục menu "${savedItem.label}"!`);
  };

  // Delete Item
  const handleDeleteItem = (itemId: string) => {
    const removeRecursive = (nodeList: MenuItem[]): MenuItem[] => {
      return nodeList
        .filter((n) => n.id !== itemId)
        .map((n) => (n.children ? { ...n, children: removeRecursive(n.children) } : n));
    };

    setItems((prev) => removeRecursive(prev));
    showToast('Đã xóa mục menu!');
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
      <div className="space-y-3">
        <CmsPageHeader
          icon={<FolderTree />}
          title="Menu website"
          description="Thiết lập cấu trúc điều hướng theo từng nhóm menu của website."
          meta={<span className="rounded-md bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">{groups.length} nhóm menu</span>}
        />

          {/* Group Switcher Tabs */}
          <div className="flex items-center justify-between gap-2">
            <CmsTabs
              ariaLabel="Nhóm menu"
              value={activeGroupId}
              onChange={(id) => setActiveGroupId(id)}
              items={groups.map((g) => ({
                id: g.id,
                label: g.name,
                icon: Layers,
              }))}
            />

            <CmsIconButton
              onClick={() => {
                setEditingGroup(null);
                setIsGroupModalOpen(true);
              }}
              icon={<Plus />}
              aria-label="Thêm nhóm menu"
              title="Tạo nhóm menu mới"
            />
          </div>

        {/* Active group actions */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400">{items.length} mục menu trong nhóm đang chọn</div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Preview Simulation */}
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-blue-500" />
              <span>Xem trước</span>
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
            maxDepth={3}
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
        maxDepth={3}
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

      {/* Live Preview Modal */}
      <MenuPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        group={activeGroup}
        items={items}
      />

    </div>
  );
};
