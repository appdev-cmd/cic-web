import React from 'react';
import { Copy, Image, MoveDown, MoveUp, Plus, Trash2 } from 'lucide-react';
import type { CmsMediaPickerItem } from '../../../data/MediaPickerDataSource';
import type { PageBuilderConfigValue, PageBuilderEntityOption } from '../pageBuilderTypes';
import { RichTextEditor } from '../RichTextEditor';
import { findPageBuilderImage } from '../PageMediaPickerModal';
import { HeroSlidesEditor } from './HeroSlidesEditor';
import { MilestonesEditor } from './MilestonesEditor';
import { BranchesEditor } from './BranchesEditor';
import { HotNewsTickerEditor } from './HotNewsTickerEditor';
import {
  imageKeys,
  readOnlyKeys,
  longTextKeys,
  FORM_OPTIONS,
  CTA_OPTIONS,
  POLICY_PAGE_OPTIONS,
  CATEGORY_TAG_OPTIONS,
  DOWNLOAD_MEDIA_OPTIONS,
  SLOT_KEY_OPTIONS,
} from './editorConstants';
import { deepClone, labelFor } from './editorUtils';
import { getLegacyAboutPageContent } from '@/shared/page-content/legacyPageContent';

export interface ConfigFieldProps {
  fieldKey: string;
  value: PageBuilderConfigValue;
  path: Array<string | number>;
  onChange: (path: Array<string | number>, value: PageBuilderConfigValue) => void;
  onPickImage: (path: Array<string | number>, currentId: string) => void;
  mediaImages: CmsMediaPickerItem[];
  entityOptions?: PageBuilderEntityOption[];
  onActiveHeroSlideChange?: (index: number) => void;
}

export function ConfigField({
  fieldKey,
  value,
  path,
  onChange,
  onPickImage,
  mediaImages,
  entityOptions,
  onActiveHeroSlideChange,
}: ConfigFieldProps) {
  if (fieldKey === 'syncWithHome' || typeof value === 'boolean') {
    const isChecked = value !== false;
    return (
      <div className="flex items-center justify-between p-4 bg-orange-50/60 dark:bg-slate-900 border border-orange-200/70 dark:border-slate-800 rounded-xl md:col-span-2">
        <div className="space-y-1 pr-4">
          <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            {labelFor(fieldKey)}
            {isChecked && <span className="text-[10px] px-2 py-0.5 bg-orange-600 text-white font-semibold rounded-full">Đang đồng bộ</span>}
          </span>
          <span className="block text-[11px] text-slate-500 leading-relaxed">
            {fieldKey === 'syncWithHome'
              ? 'Tự động hiển thị dữ liệu từ Trang chủ. Tắt tùy chọn này nếu muốn cấu hình danh sách giải thưởng/đối tác riêng cho trang Giới thiệu.'
              : 'Bật hoặc tắt cấu hình này.'}
          </span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer shrink-0">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => onChange(path, e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
        </label>
      </div>
    );
  }

  if (fieldKey === 'richTextHtml') {
    return (
      <div className="space-y-1.5 md:col-span-2">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{labelFor(fieldKey)}</span>
        <RichTextEditor value={String(value ?? '')} onChange={(nextValue) => onChange(path, nextValue)} minHeight="420px" allowedEmbeds={['cta', 'form']} />
        <span className="block text-[11px] text-slate-400">Dùng heading, đoạn văn, danh sách, bảng, link và ảnh trong cùng một nội dung.</span>
      </div>
    );
  }

  if (fieldKey === 'videoUrl') {
    return (
      <label className="block space-y-1.5 md:col-span-2">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
          {labelFor(fieldKey)} (Link YouTube hoặc video trực tiếp)
        </span>
        <input
          type="text"
          placeholder="https://www.youtube.com/watch?v=... hoặc https://youtu.be/..."
          value={String(value ?? '')}
          onChange={(event) => onChange(path, event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950 font-mono text-xs"
        />
        <span className="block text-[11px] text-slate-400">
          Hỗ trợ link YouTube tiêu chuẩn, link rút gọn youtu.be, link embed hoặc tham số thời gian bắt đầu (?t=... hoặc &t=...s).
        </span>
      </label>
    );
  }

  if (fieldKey === 'slides' && Array.isArray(value)) {
    return <HeroSlidesEditor slides={value as any} path={path} onChange={onChange} onPickImage={onPickImage} mediaImages={mediaImages} onActiveSlideChange={onActiveHeroSlideChange} />;
  }

  if (fieldKey === 'milestones') {
    const rawList = Array.isArray(value) ? value : [];
    const safeMilestones = rawList.length > 0 ? rawList : getLegacyAboutPageContent().timeline.milestones;
    return <MilestonesEditor milestones={safeMilestones as any} path={path} onChange={onChange} />;
  }

  if (fieldKey === 'branches' && Array.isArray(value)) {
    return <BranchesEditor branches={value as any} path={path} onChange={onChange} />;
  }

  if (fieldKey === 'tickerItems' && Array.isArray(value) && value.every((item) => typeof item === 'string')) {
    return <HotNewsTickerEditor items={value as string[]} path={path} onChange={onChange} entityOptions={entityOptions} />;
  }

  if (Array.isArray(value)) {
    if (value.every((item) => typeof item === 'string')) {
      return (
        <label className="block space-y-1.5 md:col-span-2">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{labelFor(fieldKey)}</span>
          <textarea rows={Math.min(5, Math.max(2, value.length))} value={value.join('\n')} onChange={(event) => onChange(path, event.target.value.split('\n').filter(Boolean))} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950" />
          <span className="block text-[11px] text-slate-400">Mỗi dòng là một mục. Thứ tự dòng là thứ tự hiển thị.</span>
        </label>
      );
    }
    const moveItem = (fromIndex: number, toIndex: number) => {
      if (toIndex < 0 || toIndex >= value.length) return;
      const next = [...value];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      onChange(path, next);
    };

    const duplicateItem = (targetIndex: number) => {
      const next = [...value];
      const itemToClone = deepClone(next[targetIndex]);
      if (typeof itemToClone === 'object' && itemToClone !== null && 'id' in itemToClone) {
        (itemToClone as any).id = `${(itemToClone as any).id}_copy_${Date.now()}`;
      }
      next.splice(targetIndex + 1, 0, itemToClone);
      onChange(path, next);
    };

    const removeItem = (targetIndex: number) => {
      const next = value.filter((_, idx) => idx !== targetIndex);
      onChange(path, next);
    };

    const addItem = () => {
      const sample = value[value.length - 1] ?? value[0];
      let newItem: PageBuilderConfigValue;
      if (sample && typeof sample === 'object' && !Array.isArray(sample)) {
        const fresh: Record<string, PageBuilderConfigValue> = {};
        for (const [k, v] of Object.entries(sample)) {
          if (k === 'id') fresh[k] = `item_${Date.now()}`;
          else if (typeof v === 'number') fresh[k] = 0;
          else if (typeof v === 'boolean') fresh[k] = false;
          else fresh[k] = '';
        }
        newItem = fresh;
      } else if (typeof sample === 'string') {
        newItem = '';
      } else if (typeof sample === 'number') {
        newItem = 0;
      } else {
        newItem = { id: `item_${Date.now()}`, title: '', description: '' };
      }
      onChange(path, [...value, newItem]);
    };

    return (
      <div className="space-y-3 md:col-span-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{labelFor(fieldKey)} ({value.length} mục)</p>
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-1 rounded-lg border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-700 hover:bg-orange-100 dark:border-orange-800 dark:bg-orange-950/40 dark:text-orange-300"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Thêm mục</span>
          </button>
        </div>
        {value.map((item, index) => (
          <div key={index} className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-700 dark:bg-slate-800/60">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Mục {index + 1}</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => moveItem(index, index - 1)}
                  disabled={index === 0}
                  className="rounded-md p-1 text-slate-500 hover:bg-slate-200 disabled:opacity-30 dark:hover:bg-slate-700"
                  title="Di chuyển lên"
                >
                  <MoveUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(index, index + 1)}
                  disabled={index === value.length - 1}
                  className="rounded-md p-1 text-slate-500 hover:bg-slate-200 disabled:opacity-30 dark:hover:bg-slate-700"
                  title="Di chuyển xuống"
                >
                  <MoveDown className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => duplicateItem(index)}
                  className="rounded-md p-1 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
                  title="Nhân bản"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  disabled={value.length <= 1}
                  className="rounded-md p-1 text-red-500 hover:bg-red-50 disabled:opacity-30 dark:hover:bg-red-950/40"
                  title="Xóa mục"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            {typeof item === 'object' && item !== null ? (
              <div className="grid gap-3 md:grid-cols-2">
                {Object.entries(item).map(([key, child]) => (
                  <ConfigField
                    key={key}
                    fieldKey={key}
                    value={child}
                    path={[...path, index, key]}
                    onChange={onChange}
                    onPickImage={onPickImage}
                    mediaImages={mediaImages}
                    entityOptions={entityOptions}
                    onActiveHeroSlideChange={onActiveHeroSlideChange}
                  />
                ))}
              </div>
            ) : (
              <ConfigField
                fieldKey={`${fieldKey}_${index + 1}`}
                value={item}
                path={[...path, index]}
                onChange={onChange}
                onPickImage={onPickImage}
                mediaImages={mediaImages}
                entityOptions={entityOptions}
                onActiveHeroSlideChange={onActiveHeroSlideChange}
              />
            )}
          </div>
        ))}
      </div>
    );
  }

  if (typeof value === 'object' && value !== null) {
    return <div className="grid gap-3 md:grid-cols-2">{Object.entries(value).map(([key, child]) => <ConfigField key={key} fieldKey={key} value={child} path={[...path, key]} onChange={onChange} onPickImage={onPickImage} mediaImages={mediaImages} entityOptions={entityOptions} onActiveHeroSlideChange={onActiveHeroSlideChange} />)}</div>;
  }

  if (imageKeys.has(fieldKey)) {
    const currentId = typeof value === 'string' ? value : '';
    const asset = findPageBuilderImage(currentId, mediaImages);
    const displaySrc = asset?.thumbnail_url ?? asset?.url ?? (currentId && (currentId.startsWith('/') || currentId.startsWith('http') || currentId.startsWith('data:')) ? currentId : '');
    return (
      <div className="space-y-1.5">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <Image className="h-3.5 w-3.5 text-slate-400" />
          {labelFor(fieldKey)}
        </span>
        <button
          type="button"
          onClick={() => onPickImage(path, currentId)}
          className="group w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 text-left hover:border-orange-400 dark:border-slate-700 dark:bg-slate-800"
        >
          {displaySrc ? (
            <>
              <img src={displaySrc} alt="" className="aspect-[16/7] w-full object-contain bg-white p-2" />
              <span className="block truncate px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
                {asset?.title ?? currentId}
              </span>
            </>
          ) : (
            <span className="flex min-h-24 flex-col items-center justify-center gap-2 p-4 text-xs font-semibold text-slate-500">
              <Image className="h-7 w-7" />
              Chọn hoặc tải ảnh
            </span>
          )}
        </button>
      </div>
    );
  }

  if (fieldKey === 'formId') {
    return (
      <label className="block space-y-1.5">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{labelFor(fieldKey)}</span>
        <select
          value={String(value ?? '')}
          onChange={(e) => onChange(path, e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950 font-medium cursor-pointer"
        >
          <option value="">-- Chọn biểu mẫu (Form) --</option>
          {FORM_OPTIONS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </label>
    );
  }

  if (fieldKey === 'ctaId' || fieldKey === 'primaryCtaId' || fieldKey === 'secondaryCtaId') {
    return (
      <label className="block space-y-1.5">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{labelFor(fieldKey)}</span>
        <select
          value={String(value ?? '')}
          onChange={(e) => onChange(path, e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950 font-medium cursor-pointer"
        >
          <option value="">-- Chọn nút hành động (CTA) --</option>
          {CTA_OPTIONS.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </label>
    );
  }

  if (fieldKey === 'policyPageId') {
    return (
      <label className="block space-y-1.5">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{labelFor(fieldKey)}</span>
        <select
          value={String(value ?? '')}
          onChange={(e) => onChange(path, e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950 font-medium cursor-pointer"
        >
          <option value="">-- Chọn trang chính sách --</option>
          {POLICY_PAGE_OPTIONS.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </label>
    );
  }

  if (fieldKey === 'categoryTag') {
    return (
      <label className="block space-y-1.5">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{labelFor(fieldKey)}</span>
        <select
          value={String(value ?? '')}
          onChange={(e) => onChange(path, e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950 font-medium cursor-pointer"
        >
          {CATEGORY_TAG_OPTIONS.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </label>
    );
  }

  if (fieldKey === 'downloadMediaId') {
    return (
      <label className="block space-y-1.5">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{labelFor(fieldKey)}</span>
        <select
          value={String(value ?? '')}
          onChange={(e) => onChange(path, e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950 font-medium cursor-pointer"
        >
          <option value="">-- Chọn tệp tài liệu --</option>
          {DOWNLOAD_MEDIA_OPTIONS.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
      </label>
    );
  }

  if (fieldKey === 'slotKey') {
    return (
      <label className="block space-y-1.5">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{labelFor(fieldKey)}</span>
        <select
          value={String(value ?? '')}
          onChange={(e) => onChange(path, e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950 font-medium cursor-pointer"
        >
          {SLOT_KEY_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </label>
    );
  }

  const isReadOnly = readOnlyKeys.has(fieldKey);
  const commonClass = `w-full rounded-xl border px-3 py-2.5 text-sm outline-none ${isReadOnly ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-700 dark:bg-slate-800' : 'border-slate-200 bg-white focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950'}`;
  return (
    <label className={`block space-y-1.5 ${longTextKeys.has(fieldKey) ? 'md:col-span-2' : ''}`}>
      <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">{fieldKey.toLowerCase().includes('image') && <Image className="h-3.5 w-3.5 text-slate-400" />}{labelFor(fieldKey)}{isReadOnly && <span className="font-normal text-slate-400">(cố định)</span>}</span>
      {longTextKeys.has(fieldKey) ? (
        <textarea rows={3} disabled={isReadOnly} value={String(value ?? '')} onChange={(event) => onChange(path, event.target.value)} className={commonClass} />
      ) : (
        <input type={typeof value === 'number' ? 'number' : 'text'} disabled={isReadOnly} value={String(value ?? '')} onChange={(event) => onChange(path, typeof value === 'number' ? Number(event.target.value) : event.target.value)} className={commonClass} />
      )}
    </label>
  );
}
