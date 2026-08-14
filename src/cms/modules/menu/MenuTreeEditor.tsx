import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Plus,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Edit,
  Trash2,
  Link,
  Eye,
  EyeOff,
  CornerDownRight,
} from 'lucide-react';
import { MenuItem } from './types';

interface MenuTreeEditorProps {
  items: MenuItem[];
  onEditItem: (item: MenuItem) => void;
  onAddItem: (parentId: string | null) => void;
  onDeleteItem: (itemId: string) => void;
  onMoveUp: (item: MenuItem) => void;
  onMoveDown: (item: MenuItem) => void;
  onIndent: (item: MenuItem) => void;
  onOutdent: (item: MenuItem) => void;
  maxDepth: number;
  searchKeyword: string;
}

export const MenuTreeEditor: React.FC<MenuTreeEditorProps> = ({
  items,
  onEditItem,
  onAddItem,
  onDeleteItem,
  onMoveUp,
  onMoveDown,
  onIndent,
  onOutdent,
  maxDepth,
  searchKeyword,
}) => {
  const [expandedIds, setExpandedIds] = useState<string[]>(['item_02', 'item_03', 'item_03_1', 'item_04', 'item_05']);
  const [selectedItemId, setSelectedItemId] = useState<string | null>('item_03');

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const renderTreeNode = (node: MenuItem, isLastChild: boolean = false) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedIds.includes(node.id);
    const isSelected = selectedItemId === node.id;

    // Search keyword filter
    if (
      searchKeyword &&
      !node.label.toLowerCase().includes(searchKeyword.toLowerCase()) &&
      !node.url.toLowerCase().includes(searchKeyword.toLowerCase()) &&
      !node.children?.some((c) => c.label.toLowerCase().includes(searchKeyword.toLowerCase()))
    ) {
      return null;
    }

    return (
      <div key={node.id} className="select-none">
        {/* Item Node Row */}
        <div
          onClick={() => setSelectedItemId(node.id)}
          className={`group flex items-center justify-between p-2.5 rounded-xl border transition cursor-pointer my-1 ${
            isSelected
              ? 'bg-orange-50/80 dark:bg-orange-950/40 border-orange-400 dark:border-orange-600 shadow-2xs'
              : 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
          }`}
          style={{ marginLeft: `${node.depth * 28}px` }}
        >
          {/* Left Node Metadata */}
          <div className="flex items-center gap-2 overflow-hidden flex-1">
            {/* Expand / Collapse Toggle Button */}
            {hasChildren ? (
              <button
                onClick={(e) => toggleExpand(node.id, e)}
                className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition shrink-0"
              >
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            ) : (
              <div className="w-6 shrink-0 flex justify-center">
                <CornerDownRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
              </div>
            )}

            {/* Target Type Icon */}
            <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 shrink-0">
              <Link className="w-3.5 h-3.5 text-slate-500" />
            </div>

            {/* Label and Path */}
            <div className="truncate">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {node.label}
                </span>

              </div>

              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">
                {node.url} {node.open_in_new_tab ? '(_blank)' : ''}
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 shrink-0 ml-2">
            {/* Visibility toggle icon */}
            <span
              title={node.is_visible ? 'Đang hiển thị' : 'Đã ẩn'}
              className={`p-1 rounded ${node.is_visible ? 'text-emerald-500' : 'text-slate-400'}`}
            >
              {node.is_visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </span>

            {/* Tree Reparenting & Move Controls */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-700/60 p-0.5 rounded-lg border border-slate-200 dark:border-slate-600">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveUp(node);
                }}
                title="Di chuyển lên trên"
                className="p-1 hover:bg-white dark:hover:bg-slate-600 rounded text-slate-600 dark:text-slate-300"
              >
                <ArrowUp className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveDown(node);
                }}
                title="Di chuyển xuống dưới"
                className="p-1 hover:bg-white dark:hover:bg-slate-600 rounded text-slate-600 dark:text-slate-300"
              >
                <ArrowDown className="w-3 h-3" />
              </button>
              {node.depth > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOutdent(node);
                  }}
                  title="Nhô ra ngoài (Outdent)"
                  className="p-1 hover:bg-white dark:hover:bg-slate-600 rounded text-slate-600 dark:text-slate-300"
                >
                  <ArrowLeft className="w-3 h-3" />
                </button>
              )}
              {node.depth < maxDepth - 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onIndent(node);
                  }}
                  title="Thụ lề làm mục con (Indent)"
                  className="p-1 hover:bg-white dark:hover:bg-slate-600 rounded text-slate-600 dark:text-slate-300"
                >
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Add Child */}
            {node.depth < maxDepth - 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddItem(node.id);
                }}
                title="Thêm mục con"
                className="p-1.5 text-orange-600 hover:bg-orange-100 dark:hover:bg-orange-950/60 rounded-lg transition"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Edit Form */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEditItem(node);
              }}
              title="Chỉnh sửa chi tiết"
              className="p-1.5 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>

            {/* Delete */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteItem(node.id);
              }}
              title="Xóa khỏi bản thảo"
              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/60 rounded-lg transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Child Items Recursion */}
        {hasChildren && isExpanded && (
          <div className="space-y-1">
            {node.children!.map((child, idx) =>
              renderTreeNode(child, idx === node.children!.length - 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-500 pb-1 border-b border-slate-200 dark:border-slate-800">
        <span>Cấu trúc phân cây (Interactive Hierarchy Tree)</span>
        <span>Hỗ trợ kéo thả / Phân cấp {maxDepth} tầng</span>
      </div>

      <div className="space-y-1">
        {items.map((node, index) => renderTreeNode(node, index === items.length - 1))}
      </div>
    </div>
  );
};
