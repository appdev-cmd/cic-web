import React, { useState } from 'react';
import { X, Check, Save, Layers, ArrowUpDown, Tag } from 'lucide-react';
import { StaticPage, StaticPageCategory, PageTemplateType } from './types';

interface QuickEditModalProps {
  isOpen: boolean;
  page: StaticPage | null;
  categories: StaticPageCategory[];
  allPages: StaticPage[];
  onClose: () => void;
  onSave: (id: string, updates: Partial<StaticPage>) => void;
}

export const QuickEditModal: React.FC<QuickEditModalProps> = ({
  isOpen,
  page,
  categories,
  allPages,
  onClose,
  onSave,
}) => {
  if (!isOpen || !page) return null;

  const [title, setTitle] = useState(page.title);
  const [alias, setAlias] = useState(page.alias);
  const [categoryId, setCategoryId] = useState(page.category_id);
  const [parentId, setParentId] = useState<string | null>(page.parent_id || null);
  const [template, setTemplate] = useState<PageTemplateType>(page.template || 'standard');
  const [ordering, setOrdering] = useState(page.ordering);
  const [published, setPublished] = useState(page.published);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(page.id, {
      title,
      alias,
      category_id: categoryId,
      parent_id: parentId,
      template,
      ordering: Number(ordering) || 1,
      published,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden space-y-5 p-6 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <Layers className="w-5 h-5 text-orange-600" />
            <span>Chỉnh sửa nhanh (Quick Edit)</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Title */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-200">Tiêu đề trang</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 font-bold focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Alias */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-200">Alias (Slug URL)</label>
            <input
              type="text"
              required
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 font-mono focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Category */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-200">Danh mục</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Parent Page */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-200">Trang cha (Parent)</label>
              <select
                value={parentId || ''}
                onChange={(e) => setParentId(e.target.value ? e.target.value : null)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
              >
                <option value="">-- Trang gốc (Top Level) --</option>
                {allPages
                  .filter((p) => p.id !== page.id && p.parent_id !== page.id)
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Template */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-200">Mẫu giao diện (Template)</label>
              <select
                value={template}
                onChange={(e) => setTemplate(e.target.value as PageTemplateType)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
              >
                <option value="standard">Tiêu chuẩn (Standard)</option>
                <option value="landing">Landing Page</option>
                <option value="policy">Chính sách & Pháp lý</option>
                <option value="corporate_intro">Giới thiệu Doanh nghiệp</option>
              </select>
            </div>

            {/* Ordering */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-200">Thứ tự sắp xếp</label>
              <input
                type="number"
                min={1}
                value={ordering}
                onChange={(e) => setOrdering(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 font-mono focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Published Toggle */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">Trạng thái xuất bản</p>
              <p className="text-[10px] text-slate-400">Hiển thị công khai ra website</p>
            </div>
            <button
              type="button"
              onClick={() => setPublished(!published)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                published ? 'bg-orange-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  published ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md shadow-orange-600/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Cập nhật nhanh</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
