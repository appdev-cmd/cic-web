import React, { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { CmsButton } from '@/shared/ui/cms/CmsButton';
import type { FunctionSeoRecord, SeoFacetLevel } from '@/features/function-seo/types';
import { inputClass, Field } from './functionSeoUtils';

export interface SeoEditorProps {
  value: FunctionSeoRecord;
  onChange: (value: FunctionSeoRecord) => void;
  onClose: () => void;
  onSave: () => void;
}

export function SeoEditor({ value, onChange, onClose, onSave }: SeoEditorProps) {
  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-4 animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl dark:bg-slate-900">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-900">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">SEO trang chính: {value.label}</h2>
            <p className="font-mono text-xs text-slate-500">{value.path}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="space-y-3.5 p-5">
          <Field label="SEO Title" count={`${value.title.length}/60`}>
            <input
              className={inputClass}
              value={value.title}
              onChange={(e) => onChange({ ...value, title: e.target.value })}
              placeholder="Nhập tiêu đề SEO chuẩn tìm kiếm..."
            />
          </Field>

          <Field label="Meta Keywords (Từ khóa)">
            <input
              className={inputClass}
              value={value.keywords}
              onChange={(e) => onChange({ ...value, keywords: e.target.value })}
              placeholder="VD: phần mềm, công nghệ, giải pháp..."
            />
          </Field>

          <Field label="Meta Description (Mô tả)" count={`${value.description.length}/160`}>
            <textarea
              rows={3}
              className={inputClass}
              value={value.description}
              onChange={(e) => onChange({ ...value, description: e.target.value })}
              placeholder="Nhập mô tả tóm tắt xuất hiện trên Google Search..."
            />
          </Field>

          <Field label="Canonical Path">
            <input
              className={inputClass}
              value={value.canonicalPath}
              onChange={(e) => onChange({ ...value, canonicalPath: e.target.value })}
              placeholder="/duong-dan-chuan"
            />
          </Field>

          <label className="flex items-center justify-between rounded-lg border border-slate-200 p-3 text-xs font-semibold dark:border-slate-700 cursor-pointer">
            <span className="text-slate-800 dark:text-slate-200">Cho phép Google index (lập chỉ mục)</span>
            <input
              type="checkbox"
              checked={value.indexable}
              onChange={(e) => onChange({ ...value, indexable: e.target.checked })}
              className="h-4 w-4 rounded text-orange-600 cursor-pointer"
            />
          </label>

          {/* SERP Preview */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-950/50">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Xem trước kết quả Google (SERP)</p>
            <div className="font-sans space-y-1">
              <p className="text-xs text-[#202124] dark:text-slate-400 font-mono">
                https://cic.com.vn{value.canonicalPath || value.path}
              </p>
              <h3 className="text-sm font-semibold text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer line-clamp-1">
                {value.title || value.label} | CIC Technology
              </h3>
              <p className="text-xs text-[#4d5156] dark:text-[#bdc1c6] line-clamp-2">
                {value.description || 'Chưa có mô tả tóm tắt cho trang này...'}
              </p>
            </div>
          </div>
        </div>

        <footer className="sticky bottom-0 flex justify-end gap-2 border-t border-slate-200 bg-white px-5 py-3 dark:border-slate-800 dark:bg-slate-900">
          <CmsButton variant="secondary" size="sm" onClick={onClose}>
            Hủy
          </CmsButton>
          <CmsButton size="sm" onClick={onSave} disabled={!value.title.trim()}>
            Lưu cấu hình
          </CmsButton>
        </footer>
      </div>
    </div>
  );
}

export interface FacetSeoEditorProps {
  moduleLabel: string;
  facet: SeoFacetLevel;
  onClose: () => void;
  onSave: (updated: SeoFacetLevel) => void;
}

export function FacetSeoEditor({
  moduleLabel,
  facet,
  onClose,
  onSave,
}: FacetSeoEditorProps) {
  const [formState, setFormState] = useState<SeoFacetLevel>({ ...facet });
  const [focusedField, setFocusedField] = useState<'title' | 'keywords' | 'description'>('title');

  const dynamicTags = useMemo(() => {
    switch (formState.facetType) {
      case 'category':
        return ['{Tên danh mục}', '{Mô tả danh mục}'];
      case 'brand':
        return ['{Tên hãng}', '{Quốc gia}'];
      case 'application':
        return ['{Tên ứng dụng}', '{Mô tả ứng dụng}'];
      case 'product_type':
        return ['{Tên loại sản phẩm}'];
      default:
        return ['{Tên bài viết/sản phẩm}', '{Tên danh mục}', '{Tên lĩnh vực}'];
    }
  }, [formState.facetType]);

  const insertTag = (tag: string) => {
    setFormState((prev) => {
      if (focusedField === 'description') {
        const cur = prev.descriptionTemplate || '';
        return { ...prev, descriptionTemplate: cur + (cur ? ' ' : '') + tag };
      }
      if (focusedField === 'keywords') {
        const cur = prev.keywordsTemplate || '';
        return { ...prev, keywordsTemplate: cur + (cur ? ', ' : '') + tag };
      }
      const cur = prev.titleTemplate || '';
      return { ...prev, titleTemplate: cur + (cur ? ' ' : '') + tag };
    });
  };

  const previewTitle = (formState.titleTemplate || formState.title || moduleLabel)
    .replace(/\{.*?\}/g, 'Ví dụ');
  const previewDesc = (formState.descriptionTemplate || formState.description || 'Chưa cấu hình mô tả mẫu...')
    .replace(/\{.*?\}/g, 'Ví dụ');
  const previewPath = (formState.pattern || '/[slug]')
    .replace('[category]', 'phan-mem')
    .replace('[brand]', 'autodesk')
    .replace('[type]', 'ban-quyen')
    .replace('[slug]', 'chi-tiet');

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-4 animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl dark:bg-slate-900">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-900">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Cấu hình SEO: {formState.title}</h2>
            <p className="font-mono text-xs text-orange-600 dark:text-orange-400">URL: {formState.pattern}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="space-y-3.5 p-5">
          <div className="rounded-lg bg-amber-50/70 p-2.5 text-xs text-amber-900 dark:bg-amber-950/30 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/40">
            Bạn có thể nhập nội dung cố định hoặc bấm chèn các biến tự động dưới đây để hệ thống tự điền theo từng mục khi người dùng truy cập. Biến sẽ được chèn vào trường đang chọn (hiện tại: <strong>{focusedField === 'title' ? 'Tiêu đề' : focusedField === 'keywords' ? 'Từ khóa' : 'Mô tả'}</strong>).
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Chèn biến tự động:</span>
            {dynamicTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => insertTag(tag)}
                className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
              >
                + {tag}
              </button>
            ))}
          </div>

          <Field label="Mẫu Tiêu đề SEO (Title Template)" count={`${(formState.titleTemplate || '').length}/60`}>
            <input
              className={inputClass}
              value={formState.titleTemplate || ''}
              onFocus={() => setFocusedField('title')}
              onChange={(e) => setFormState({ ...formState, titleTemplate: e.target.value })}
              placeholder="VD: {Tên danh mục} - Phần mềm & Giải pháp | CIC"
            />
          </Field>

          <Field label="Mẫu Từ khóa (Keywords Template)">
            <input
              className={inputClass}
              value={formState.keywordsTemplate || ''}
              onFocus={() => setFocusedField('keywords')}
              onChange={(e) => setFormState({ ...formState, keywordsTemplate: e.target.value })}
              placeholder="VD: {Tên danh mục}, bản quyền, giải pháp"
            />
          </Field>

          <Field label="Mẫu Mô tả (Description Template)" count={`${(formState.descriptionTemplate || '').length}/160`}>
            <textarea
              rows={3}
              className={inputClass}
              value={formState.descriptionTemplate || ''}
              onFocus={() => setFocusedField('description')}
              onChange={(e) => setFormState({ ...formState, descriptionTemplate: e.target.value })}
              placeholder="VD: Danh sách các giải pháp chuyên dụng thuộc {Tên danh mục}..."
            />
          </Field>

          {/* SERP Preview */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-950/50">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Xem trước kết quả Google mẫu (SERP Preview)</p>
            <div className="font-sans space-y-1">
              <p className="text-xs text-[#202124] dark:text-slate-400 font-mono">
                https://cic.com.vn{previewPath}
              </p>
              <h3 className="text-sm font-semibold text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer line-clamp-1">
                {previewTitle} | CIC Technology
              </h3>
              <p className="text-xs text-[#4d5156] dark:text-[#bdc1c6] line-clamp-2">
                {previewDesc}
              </p>
            </div>
          </div>
        </div>

        <footer className="sticky bottom-0 flex justify-end gap-2 border-t border-slate-200 bg-white px-5 py-3 dark:border-slate-800 dark:bg-slate-900">
          <CmsButton variant="secondary" size="sm" onClick={onClose}>
            Hủy
          </CmsButton>
          <CmsButton size="sm" onClick={() => onSave(formState)}>
            Lưu cấu hình SEO
          </CmsButton>
        </footer>
      </div>
    </div>
  );
}
