import React, { useState } from 'react';
import { X, Search, ChevronRight, ChevronDown, CheckSquare, Square, ShieldAlert, Plus, Trash2, Check } from 'lucide-react';
import { PageTreeNode, ScopeRule } from './types';

interface ScopePickerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  scope: ScopeRule;
  pageTree: PageTreeNode[];
  onSaveScope: (newScope: ScopeRule) => void;
}

export const ScopePickerDrawer: React.FC<ScopePickerDrawerProps> = ({
  isOpen,
  onClose,
  scope,
  pageTree,
  onSaveScope,
}) => {
  const [applyAll, setApplyAll] = useState(scope.apply_all_pages);
  const [includedPages, setIncludedPages] = useState<string[]>(scope.included_pages || []);
  const [excludedPages, setExcludedPages] = useState<string[]>(scope.excluded_pages || []);
  const [newExclusionInput, setNewExclusionInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    node_products: true,
    node_services: true,
  });

  if (!isOpen) return null;

  const toggleExpand = (nodeId: string) => {
    setExpandedNodes((prev) => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  const isSelected = (path: string) => includedPages.includes(path);

  const toggleSelectPage = (path: string) => {
    if (applyAll) return; // In apply all, included pages are implicitly all
    if (includedPages.includes(path)) {
      setIncludedPages(includedPages.filter((p) => p !== path));
    } else {
      setIncludedPages([...includedPages, path]);
    }
  };

  const handleAddExclusion = () => {
    if (!newExclusionInput.trim()) return;
    const path = newExclusionInput.trim().startsWith('/') ? newExclusionInput.trim() : `/${newExclusionInput.trim()}`;
    if (!excludedPages.includes(path)) {
      setExcludedPages([...excludedPages, path]);
    }
    setNewExclusionInput('');
  };

  const handleRemoveExclusion = (path: string) => {
    setExcludedPages(excludedPages.filter((p) => p !== path));
  };

  const handleSave = () => {
    onSaveScope({
      ...scope,
      apply_all_pages: applyAll,
      included_pages: applyAll ? [] : includedPages,
      excluded_pages: excludedPages,
    });
    onClose();
  };

  const renderTreeNode = (node: PageTreeNode, level = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isNodeExpanded = expandedNodes[node.id];
    const checked = applyAll || isSelected(node.path);

    // Filter by search query
    if (searchQuery && !node.title.toLowerCase().includes(searchQuery.toLowerCase()) && !node.path.toLowerCase().includes(searchQuery.toLowerCase())) {
      if (!hasChildren || !node.children?.some(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))) {
        return null;
      }
    }

    return (
      <div key={node.id} className="select-none">
        <div
          className={`flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
            level > 0 ? 'ml-5 border-l-2 border-slate-200 dark:border-slate-800 pl-3' : ''
          }`}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {hasChildren ? (
              <button
                type="button"
                onClick={() => toggleExpand(node.id)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {isNodeExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            ) : (
              <span className="w-6" />
            )}

            <button
              type="button"
              disabled={applyAll}
              onClick={() => toggleSelectPage(node.path)}
              className="flex items-center gap-2 min-w-0 text-left disabled:opacity-75"
            >
              {checked ? (
                <CheckSquare className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-slate-400 shrink-0" />
              )}
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                {node.title}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
              {node.path}
            </span>
            <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800">
              {node.type}
            </span>
          </div>
        </div>

        {hasChildren && isNodeExpanded && (
          <div className="mt-0.5">
            {node.children!.map((child) => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end transition-opacity">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-850">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Cấu Hình Phạm Vi Hiển Thị (Scope Tree)</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Chọn các trang/danh mục hiển thị khối nội dung và thiết lập ngoại lệ (Exclusions).
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Mode switch */}
          <div className="bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/40 rounded-xl p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={applyAll}
                onChange={(e) => setApplyAll(e.target.checked)}
                className="mt-1 rounded text-orange-600 focus:ring-orange-500 w-4 h-4"
              />
              <div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  Áp dụng cho TOÀN BỘ WEBSITE (All Pages)
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Khối này sẽ xuất hiện trên tất cả các trang có Vị trí (Placement) tương ứng, ngoại trừ các trang trong danh sách ngoại lệ bên dưới.
                </p>
              </div>
            </label>
          </div>

          {/* Search bar */}
          {!applyAll && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Cây Thư Mục Trang Website ({includedPages.length} trang đã chọn)
                </h3>
                <button
                  type="button"
                  onClick={() => setIncludedPages([])}
                  className="text-xs text-orange-600 hover:underline"
                >
                  Xóa chọn tất cả
                </button>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm trang theo tên hoặc đường dẫn /path..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Tree view list */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-2 max-h-72 overflow-y-auto space-y-1 bg-white dark:bg-slate-900">
                {pageTree.map((node) => renderTreeNode(node))}
              </div>
            </div>
          )}

          {/* Exclusions Section */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-5 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Quy Tắc Ngoại Lệ (Exclusion Rules)
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Các trang hoặc pattern bị LOẠI TRỪ khỏi hiển thị (ví dụ: <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded text-orange-600">/checkout</code>, <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded text-orange-600">/admin/*</code>).
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nhập đường dẫn ngoại lệ (e.g. /cart, /checkout/*)..."
                value={newExclusionInput}
                onChange={(e) => setNewExclusionInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddExclusion())}
                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="button"
                onClick={handleAddExclusion}
                className="px-3 py-2 bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 text-white rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" /> Thêm
              </button>
            </div>

            {excludedPages.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {excludedPages.map((path) => (
                  <span
                    key={path}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/60"
                  >
                    <span>{path}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveExclusion(path)}
                      className="text-rose-400 hover:text-rose-600 dark:hover:text-rose-200"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Chưa có trang ngoại lệ nào được thiết lập.</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Hủy Bỏ
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium text-sm rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" /> Áp Dụng Scope
          </button>
        </div>
      </div>
    </div>
  );
};
