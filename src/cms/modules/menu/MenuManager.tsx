'use client';

import React, { useState, useEffect, useTransition, useMemo } from 'react';
import {
  FolderTree,
  Plus,
  Layers,
  CheckCircle2,
  AlertCircle,
  Eye,
  Search,
  List,
  Loader2,
} from 'lucide-react';

import { MenuGroup, MenuItem } from './types';
import type { CmsLocale } from '../../data/CmsDataSource';
import type { MenuModuleData } from '../../data/PresentationDataSource';
import { useCmsWorkspaceLocale } from '@/cms/context/CmsWorkspaceLocaleContext';
import { buildMenuTree, flattenMenuTree } from '@/features/menu/domain/tree';
import type { ReorderMenuItemInput } from '@/features/menu/domain/types';
import {
  saveMenuItemAction,
  deleteMenuItemAction,
  reorderMenuItemsAction,
  toggleMenuItemVisibilityAction,
  saveMenuGroupAction,
  deleteMenuGroupAction,
} from '@/features/menu/server/actions';

import { MenuTreeEditor } from './MenuTreeEditor';
import { MenuTableView } from './MenuTableView';
import { MenuItemEditor } from './MenuItemEditor';
import { MenuGroupEditorModal } from './MenuGroupEditorModal';
import { MenuPreviewModal } from './MenuPreviewModal';
import { CmsIconButton } from '../../components/ui/CmsButton';
import { CmsPageHeader } from '../../components/ui/CmsPageHeader';
import { CmsTabs } from '../../components/ui/CmsTabs';

interface MenuManagerProps {
  workspaceLocale?: CmsLocale;
  data?: MenuModuleData;
  initialData?: Record<'vi' | 'en', { groups: MenuGroup[]; items: MenuItem[] }>;
  capabilities?: {
    canCreate?: boolean;
    canEdit?: boolean;
    canDelete?: boolean;
    canReorder?: boolean;
    canPublish?: boolean;
  };
}

export const MenuManager: React.FC<MenuManagerProps> = ({
  workspaceLocale: propLocale,
  data,
  initialData,
  capabilities = {
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canReorder: true,
    canPublish: true,
  },
}) => {
  const contextLocale = useCmsWorkspaceLocale();
  const activeLocale: 'vi' | 'en' = (contextLocale || propLocale || 'vi') === 'en' ? 'en' : 'vi';

  const [isPending, startTransition] = useTransition();

  // Multi-locale data source
  const localeDataSource = useMemo(() => {
    if (initialData) return initialData[activeLocale];
    return {
      groups: data?.groups ?? [],
      items: data?.items ?? [],
    };
  }, [initialData, activeLocale, data]);

  // Main Data States
  const [groups, setGroups] = useState<MenuGroup[]>(localeDataSource.groups);
  const [activeGroupId, setActiveGroupId] = useState<string>(localeDataSource.groups[0]?.id ?? '1');
  const [items, setItems] = useState<MenuItem[]>(localeDataSource.items);

  // Sync state when localeDataSource updates
  useEffect(() => {
    setGroups(localeDataSource.groups);
    setActiveGroupId((prev) => {
      const exists = localeDataSource.groups.some((g) => g.id === prev);
      return exists ? prev : (localeDataSource.groups[0]?.id ?? '1');
    });
    setItems(localeDataSource.items);
  }, [localeDataSource]);

  // UI View Mode & Modal States
  const [viewMode, setViewMode] = useState<'tree' | 'table'>('tree');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [toastMessage, setToastMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  // Modals & Drawers
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isItemEditorOpen, setIsItemEditorOpen] = useState(false);

  const [editingGroup, setEditingGroup] = useState<MenuGroup | null>(null);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const activeGroup = groups.find((g) => g.id === activeGroupId) || groups[0];

  const showToast = (msg: string, isError = false) => {
    setToastMessage({ text: msg, isError });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter items belonging to the active group and construct tree
  const activeGroupItems = useMemo(() => {
    return items.filter((i) => String(i.group_id) === String(activeGroup?.id));
  }, [items, activeGroup?.id]);

  const treeData = useMemo(() => {
    return buildMenuTree(activeGroupItems);
  }, [activeGroupItems]);

  // Helper to extract reorder inputs from tree
  const extractReorderInputs = (treeNodes: MenuItem[]): ReorderMenuItemInput[] => {
    const result: ReorderMenuItemInput[] = [];
    const traverse = (list: MenuItem[], parentId: string | null, depth: number) => {
      list.forEach((node, idx) => {
        result.push({
          id: node.id,
          parent_id: parentId,
          depth,
          display_order: idx + 1,
        });
        if (node.children && node.children.length > 0) {
          traverse(node.children, node.id, depth + 1);
        }
      });
    };
    traverse(treeNodes, null, 0);
    return result;
  };

  // Reorder persistence runner
  const persistReorder = (newTree: MenuItem[]) => {
    const reorderPayload = extractReorderInputs(newTree);
    const updatedFlattened = flattenMenuTree(newTree as any);

    // Update local items state for the active group
    setItems((prev) => {
      const otherItems = prev.filter((i) => String(i.group_id) !== String(activeGroup?.id));
      return [...otherItems, ...updatedFlattened];
    });

    startTransition(async () => {
      const res = await reorderMenuItemsAction(reorderPayload, activeLocale);
      if (!res.success) {
        showToast(res.error || 'Lỗi khi lưu thứ tự.', true);
      } else {
        showToast('Đã lưu thứ tự menu vào cơ sở dữ liệu!');
      }
    });
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

    const newTree = recursiveMoveUp(treeData);
    persistReorder(newTree);
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

    const newTree = recursiveMoveDown(treeData);
    persistReorder(newTree);
  };

  // Indent item (Make child of preceding sibling)
  const handleIndent = (item: MenuItem) => {
    const recursiveIndent = (nodeList: MenuItem[]): MenuItem[] => {
      const idx = nodeList.findIndex((n) => n.id === item.id);
      if (idx > 0) {
        const prevSibling = nodeList[idx - 1];
        const target = { ...item, parent_id: prevSibling.id, depth: prevSibling.depth + 1 };
        const updatedPrevSibling = {
          ...prevSibling,
          children: [...(prevSibling.children || []), target],
        };
        const updatedList = [...nodeList];
        updatedList.splice(idx - 1, 2, updatedPrevSibling);
        return updatedList;
      }
      return nodeList.map((n) => (n.children ? { ...n, children: recursiveIndent(n.children) } : n));
    };

    const newTree = recursiveIndent(treeData);
    persistReorder(newTree);
    showToast(`Đã thụ lề mục "${item.label}" thành mục con.`);
  };

  // Outdent item (Promote item to parent level)
  const handleOutdent = (item: MenuItem) => {
    const recursiveOutdent = (nodeList: MenuItem[], parentNode: MenuItem | null): MenuItem[] => {
      const hasChild = nodeList.some((n) => n.id === item.id);
      if (hasChild && parentNode) {
        const target = { ...item, parent_id: parentNode.parent_id, depth: Math.max(0, parentNode.depth) };
        const remainingChildren = nodeList.filter((n) => n.id !== item.id);
        return remainingChildren;
      }
      return nodeList.map((n) => ({
        ...n,
        children: n.children ? recursiveOutdent(n.children, n) : undefined,
      }));
    };

    const currentParentId = item.parent_id;
    if (!currentParentId) return;

    // Find parent's parent
    const currentParent = activeGroupItems.find((i) => i.id === currentParentId);
    const newParentId = currentParent?.parent_id ?? null;
    const newDepth = Math.max(0, (currentParent?.depth ?? 1) - 1);

    const updatedActiveItems = activeGroupItems.map((i) => {
      if (i.id === item.id) {
        return { ...i, parent_id: newParentId, depth: newDepth };
      }
      return i;
    });

    const newTree = buildMenuTree(updatedActiveItems);
    persistReorder(newTree);
    showToast(`Đã đưa mục "${item.label}" ra cấp ngoài.`);
  };

  // Item Save Handler
  const handleSaveItem = (savedItem: MenuItem) => {
    startTransition(async () => {
      const input = {
        id: savedItem.id,
        group_id: savedItem.group_id || activeGroup?.id || '1',
        parent_id: savedItem.parent_id,
        depth: savedItem.depth,
        display_order: savedItem.display_order,
        label: savedItem.label,
        url: savedItem.url,
        open_in_new_tab: savedItem.open_in_new_tab,
        icon_name: savedItem.icon_name,
        is_visible: savedItem.is_visible,
      };

      const res = await saveMenuItemAction(input, activeLocale);
      if (!res.success || !res.data) {
        showToast(res.error || 'Lỗi khi lưu mục menu.', true);
        return;
      }

      const persistedItem = res.data;
      setItems((prev) => {
        const exists = prev.some((i) => i.id === savedItem.id || i.id === persistedItem.id);
        if (exists) {
          return prev.map((i) => (i.id === savedItem.id || i.id === persistedItem.id ? persistedItem : i));
        }
        return [...prev, persistedItem];
      });

      showToast(`Đã lưu mục menu "${persistedItem.label}" vào cơ sở dữ liệu!`);
    });
  };

  // Delete Item Handler
  const handleDeleteItem = (itemId: string) => {
    startTransition(async () => {
      const res = await deleteMenuItemAction(itemId, activeLocale);
      if (!res.success) {
        showToast(res.error || 'Lỗi khi xóa mục menu.', true);
        return;
      }

      // Remove item and any descendant items locally
      const idsToRemove = new Set<string>([itemId]);
      let addedMore = true;
      while (addedMore) {
        addedMore = false;
        for (const item of items) {
          if (item.parent_id && idsToRemove.has(item.parent_id) && !idsToRemove.has(item.id)) {
            idsToRemove.add(item.id);
            addedMore = true;
          }
        }
      }

      setItems((prev) => prev.filter((i) => !idsToRemove.has(i.id)));
      showToast('Đã xóa mục menu khỏi cơ sở dữ liệu!');
    });
  };

  // Toggle Visibility Handler
  const handleToggleVisibility = (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    const newVisibility = !item.is_visible;

    startTransition(async () => {
      const res = await toggleMenuItemVisibilityAction(itemId, newVisibility, activeLocale);
      if (!res.success) {
        showToast(res.error || 'Lỗi khi thay đổi trạng thái.', true);
        return;
      }

      setItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, is_visible: newVisibility } : i))
      );
      showToast(
        newVisibility
          ? `Đã hiển thị mục "${item.label}"!`
          : `Đã ẩn mục "${item.label}"!`
      );
    });
  };

  // Save Group Handler
  const handleSaveGroup = (group: MenuGroup) => {
    startTransition(async () => {
      const res = await saveMenuGroupAction(
        {
          id: group.id,
          name: group.name,
          published: group.published,
          ordering: group.ordering,
        },
        activeLocale
      );

      if (!res.success || !res.data) {
        showToast(res.error || 'Lỗi khi lưu nhóm menu.', true);
        return;
      }

      const savedGroup = res.data;
      setGroups((prev) => {
        const exists = prev.some((g) => g.id === group.id || g.id === savedGroup.id);
        if (exists) {
          return prev.map((g) => (g.id === group.id || g.id === savedGroup.id ? savedGroup : g));
        }
        return [...prev, savedGroup];
      });

      setActiveGroupId(savedGroup.id);
      showToast(`Đã lưu nhóm menu "${savedGroup.name}"!`);
    });
  };

  // Flatten available parents for selector in active group
  const flattenParents = (
    itemList: MenuItem[],
    result: { id: string; label: string; depth: number }[] = []
  ) => {
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
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 text-white rounded-xl shadow-2xl border flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 text-xs font-semibold ${
            toastMessage.isError
              ? 'bg-rose-900 dark:bg-rose-950 border-rose-700 text-rose-100'
              : 'bg-slate-900 dark:bg-slate-800 border-slate-700'
          }`}
        >
          {toastMessage.isError ? (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Banner & Group Selector */}
      <div className="space-y-3">
        <CmsPageHeader
          icon={<FolderTree />}
          title="Menu website"
          description="Thiết lập cấu trúc điều hướng theo từng nhóm menu của website từ cơ sở dữ liệu PostgreSQL."
          meta={
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">
                {groups.length} nhóm menu ({activeLocale.toUpperCase()})
              </span>
              {isPending && (
                <span className="flex items-center gap-1.5 px-2 py-1 text-xs text-orange-600 dark:text-orange-400">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Đang đồng bộ DB...
                </span>
              )}
            </div>
          }
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

          {capabilities.canCreate && (
            <CmsIconButton
              onClick={() => {
                setEditingGroup(null);
                setIsGroupModalOpen(true);
              }}
              icon={<Plus />}
              aria-label="Thêm nhóm menu"
              title="Tạo nhóm menu mới"
            />
          )}
        </div>

        {/* Active group actions */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            <strong>{activeGroupItems.length}</strong> mục menu trong nhóm{' '}
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              &quot;{activeGroup?.name || 'Mặc định'}&quot;
            </span>
          </div>

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
            <div className="relative flex items-center flex-1 sm:w-64">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="w-4 h-4 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Tìm tên nhãn hoặc URL canonical..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            {/* Add root item */}
            {capabilities.canCreate && (
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
            )}
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
            items={treeData}
            onEditItem={(item) => {
              setEditingItem(item);
              setIsItemEditorOpen(true);
            }}
            onAddItem={(parentId) => {
              setEditingItem({
                id: '',
                group_id: activeGroup?.id || '1',
                parent_id: parentId,
                depth: 0,
                display_order: 99,
                label: '',
                url: '/',
                open_in_new_tab: false,
                is_visible: true,
              });
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
            items={treeData}
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
        groupId={activeGroup?.id || '1'}
        isOpen={isItemEditorOpen}
        onClose={() => setIsItemEditorOpen(false)}
        onSave={handleSaveItem}
        onDelete={handleDeleteItem}
        maxDepth={3}
        availableParents={flattenParents(treeData)}
      />

      {/* Group Create/Edit Modal */}
      <MenuGroupEditorModal
        group={editingGroup}
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        onSave={handleSaveGroup}
      />

      {/* Live Preview Modal */}
      {activeGroup && (
        <MenuPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          group={activeGroup}
          items={treeData}
        />
      )}
    </div>
  );
};
