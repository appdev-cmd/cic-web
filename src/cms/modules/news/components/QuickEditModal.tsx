import React, { useState, useEffect } from 'react';
import { X, Save, RotateCcw, AlertTriangle, Check, Layers, User, Calendar, Flame, Sparkles, Eye } from 'lucide-react';
import { NewsArticle, NewsCategory, WorkflowStatus } from '../types';

interface QuickEditModalProps {
  isOpen: boolean;
  article: NewsArticle | null;
  categories: NewsCategory[];
  onClose: () => void;
  onSave: (updatedArticle: NewsArticle) => void;
}

export const QuickEditModal: React.FC<QuickEditModalProps> = ({
  isOpen,
  article,
  categories,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<NewsArticle>>({});
  const [initialData, setInitialData] = useState<Partial<NewsArticle>>({});
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (article) {
      const data = {
        title: article.title,
        alias: article.alias,
        category_id: article.category_id,
        workflow_status: article.workflow_status,
        published: article.published,
        is_hot: article.is_hot,
        is_new: article.is_new,
        show_in_homepage: article.show_in_homepage,
        ordering: article.ordering,
        start_time: article.start_time,
      };
      setFormData(data);
      setInitialData(data);
      setIsDirty(false);
    }
  }, [article]);

  if (!isOpen || !article) return null;

  const handleChange = (field: keyof NewsArticle, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    setIsDirty(JSON.stringify(updated) !== JSON.stringify(initialData));
  };

  const handleReset = () => {
    setFormData(initialData);
    setIsDirty(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...article,
      ...formData,
      published: formData.workflow_status === 'published',
      updated_time: new Date().toISOString().replace('T', ' ').substring(0, 19),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Chỉnh sửa nhanh bài viết (Quick Edit)
              </h3>
              <p className="text-[11px] text-slate-400">#{article.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dirty State Warning Bar */}
        {isDirty && (
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between text-xs text-amber-700 dark:text-amber-400">
            <span className="flex items-center gap-1.5 font-medium">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Có thay đổi chưa lưu</span>
            </span>
            <button
              onClick={handleReset}
              className="text-[11px] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Khôi phục ban đầu (Undo)</span>
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Title */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">Tiêu đề bài viết</label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:ring-2 focus:ring-orange-500/50 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Category */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Danh mục chính</label>
              <select
                value={formData.category_id || ''}
                onChange={(e) => handleChange('category_id', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:ring-2 focus:ring-orange-500/50 outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Workflow Status */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Trạng thái quy trình</label>
              <select
                value={formData.workflow_status || 'draft'}
                onChange={(e) => handleChange('workflow_status', e.target.value as WorkflowStatus)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:ring-2 focus:ring-orange-500/50 outline-none"
              >
                <option value="draft">Bản nháp (Draft)</option>
                <option value="pending">Chờ duyệt (Pending)</option>
                <option value="returned">Bị trả lại (Returned)</option>
                <option value="approved">Đã duyệt (Approved)</option>
                <option value="scheduled">Lên lịch (Scheduled)</option>
                <option value="published">Đã xuất bản (Published)</option>
                <option value="archived">Lưu trữ (Archived)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Start Time */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Thời gian bắt đầu</label>
              <input
                type="datetime-local"
                value={formData.start_time || ''}
                onChange={(e) => handleChange('start_time', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:ring-2 focus:ring-orange-500/50 outline-none"
              />
            </div>

            {/* Ordering */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Thứ tự ưu tiên</label>
              <input
                type="number"
                value={formData.ordering || 0}
                onChange={(e) => handleChange('ordering', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:ring-2 focus:ring-orange-500/50 outline-none"
              />
            </div>
          </div>

          {/* Quick Checkboxes */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_hot || false}
                onChange={(e) => handleChange('is_hot', e.target.checked)}
                className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300"
              />
              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-red-500" /> Tin Nổi Bật (Hot)
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_new || false}
                onChange={(e) => handleChange('is_new', e.target.checked)}
                className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300"
              />
              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" /> Tin Mới (New)
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.show_in_homepage || false}
                onChange={(e) => handleChange('show_in_homepage', e.target.checked)}
                className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300"
              />
              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-emerald-500" /> Trang chủ
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={!isDirty}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Cập nhật thay đổi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
