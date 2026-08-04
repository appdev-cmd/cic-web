import React, { useState } from 'react';
import { ChevronRight, ChevronDown, FileText, Plus, Edit, Eye, Link2, ArrowUp, ArrowDown, Folder, Layers } from 'lucide-react';
import { StaticPage } from './types';

interface TreeViewProps {
  pages: StaticPage[];
  onEditPage: (page: StaticPage) => void;
  onPreviewPage: (page: StaticPage) => void;
  onOpenUsedBy: (page: StaticPage) => void;
  onAddChildPage: (parentPage: StaticPage) => void;
}

export const TreeView: React.FC<TreeViewProps> = ({
  pages,
  onEditPage,
  onPreviewPage,
  onOpenUsedBy,
  onAddChildPage,
}) => {
  // Store expanded state per parent page ID
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    page_001: true,
    page_002: true,
  });

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Build tree hierarchy array
  const topLevelPages = pages.filter((p) => !p.parent_id);

  const renderTreeNode = (page: StaticPage, level: number = 0) => {
    const children = pages.filter((p) => p.parent_id === page.id);
    const hasChildren = children.length > 0;
    const isExpanded = expandedIds[page.id] ?? true;

    return (
      <div key={page.id} className="space-y-1">
        <div
          style={{ paddingLeft: `${level * 24 + 16}px` }}
          className="pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-orange-300 dark:hover:border-orange-800 transition-all flex items-center justify-between group shadow-2xs"
        >
          {/* Left: Expand toggle icon + Title + Path */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {hasChildren ? (
              <button
                type="button"
                onClick={() => toggleExpand(page.id)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded cursor-pointer"
              >
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            ) : (
              <span className="w-6 shrink-0" />
            )}

            <div className="p-2 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-lg shrink-0">
              {hasChildren ? <Folder className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                  {page.title}
                </span>
                {page.published ? (
                  <span className="px-2 py-0.2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] rounded">
                    Xuất bản
                  </span>
                ) : (
                  <span className="px-2 py-0.2 bg-slate-100 dark:bg-slate-800 text-slate-400 text-[10px] rounded">
                    Nháp
                  </span>
                )}
                {page.used_by && page.used_by.length > 0 ? (
                  <button
                    onClick={() => onOpenUsedBy(page)}
                    className="px-2 py-0.2 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[10px] rounded hover:underline cursor-pointer"
                  >
                    {page.used_by.length} liên kết
                  </button>
                ) : (
                  <span className="px-2 py-0.2 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-[10px] rounded">
                    Mồ côi
                  </span>
                )}
              </div>
              <p className="text-[11px] font-mono text-slate-400 truncate mt-0.5">
                /{page.alias} • Mẫu: {page.template || 'standard'} • Thứ tự: #{page.ordering}
              </p>
            </div>
          </div>

          {/* Right: Quick actions */}
          <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              onClick={() => onAddChildPage(page)}
              className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-950/40 text-slate-700 dark:text-slate-300 hover:text-orange-600 text-[11px] font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
              title="Thêm trang con trực thuộc trang này"
            >
              <Plus className="w-3.5 h-3.5" /> Thêm trang con
            </button>

            <button
              onClick={() => onPreviewPage(page)}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Xem trước"
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              onClick={() => onEditPage(page)}
              className="p-1.5 text-slate-400 hover:text-orange-600 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/40 transition-colors cursor-pointer"
              title="Sửa trang"
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Child nodes recursive render */}
        {hasChildren && isExpanded && (
          <div className="space-y-1">
            {children.map((child) => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-3">
      <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-orange-600" />
          <span>
            Hiển thị cây phân cấp quan hệ Trang cha - Trang con ({pages.length} trang)
          </span>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">
          Bấm dấu mũi tên để mở rộng/thu gọn phân nhánh
        </span>
      </div>

      <div className="space-y-2">
        {topLevelPages.map((topPage) => renderTreeNode(topPage, 0))}
      </div>
    </div>
  );
};
