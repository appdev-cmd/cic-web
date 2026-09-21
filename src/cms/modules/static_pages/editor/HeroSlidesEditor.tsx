import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Copy, Image, Layers, Plus, Smartphone, Trash2 } from 'lucide-react';
import type { CmsMediaPickerItem } from '../../../data/MediaPickerDataSource';
import type { PageBuilderConfigValue } from '../pageBuilderTypes';
import { findPageBuilderImage } from '../PageMediaPickerModal';
import { formatHeroHeading } from '../../../../web/components/HomeView';
import { CTA_OPTIONS } from './editorConstants';
import { sanitizeHtmlContent } from '@/shared/lib/sanitize';

interface HeroSlidesEditorProps {
  slides: Array<{
    title?: string;
    subtitle?: string;
    backgroundImageId?: string;
    mobileImageId?: string;
    primaryCtaId?: string;
    secondaryCtaId?: string;
    [key: string]: unknown;
  }>;
  path: Array<string | number>;
  onChange: (path: Array<string | number>, value: PageBuilderConfigValue) => void;
  onPickImage: (path: Array<string | number>, currentId: string) => void;
  mediaImages: CmsMediaPickerItem[];
  onActiveSlideChange?: (index: number) => void;
}

export function HeroSlidesEditor({
  slides,
  path,
  onChange,
  onPickImage,
  mediaImages,
  onActiveSlideChange,
}: HeroSlidesEditorProps) {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const currentIdx = Math.min(Math.max(0, activeSlideIndex), Math.max(0, slides.length - 1));
  const currentSlide = slides[currentIdx] ?? {
    title: '',
    subtitle: '',
    backgroundImageId: '',
    mobileImageId: '',
    primaryCtaId: '',
    secondaryCtaId: '',
  };

  const updateSlideField = (field: string, val: unknown) => {
    const next = slides.map((s, idx) => (idx === currentIdx ? { ...s, [field]: val } : s));
    onChange(path, next as any);
  };

  const handleAddSlide = () => {
    const newSlide = {
      title: 'Slide mới — Giải pháp tiên phong',
      subtitle: 'Mô tả ngắn gọn về giải pháp công nghệ hoặc dịch vụ của CIC.',
      backgroundImageId: 'media_hero_01',
      mobileImageId: 'media_hero_01',
      primaryCtaId: 'cta_explore_products',
      secondaryCtaId: 'cta_about_cic',
    };
    const next = [...slides, newSlide];
    onChange(path, next as any);
    setActiveSlideIndex(next.length - 1);
  };

  const handleDuplicateSlide = (idx: number) => {
    const toCopy = slides[idx];
    if (!toCopy) return;
    const cloned = { ...toCopy, title: `${toCopy.title ?? 'Slide'} (Bản sao)` };
    const next = [...slides.slice(0, idx + 1), cloned, ...slides.slice(idx + 1)];
    onChange(path, next as any);
    setActiveSlideIndex(idx + 1);
  };

  const handleDeleteSlide = (idx: number) => {
    if (slides.length <= 1) {
      alert('Slider Hero phải có ít nhất 1 slide.');
      return;
    }
    const next = slides.filter((_, i) => i !== idx);
    onChange(path, next as any);
    setActiveSlideIndex(Math.max(0, idx - 1));
  };

  const handleMoveSlide = (idx: number, direction: 'prev' | 'next') => {
    const targetIdx = direction === 'prev' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= slides.length) return;
    const next = [...slides];
    const item = next[idx];
    next[idx] = next[targetIdx];
    next[targetIdx] = item;
    onChange(path, next as any);
    setActiveSlideIndex(targetIdx);
  };

  const bgAsset = findPageBuilderImage(String(currentSlide.backgroundImageId ?? ''), mediaImages);
  const mobileAsset = findPageBuilderImage(String(currentSlide.mobileImageId ?? ''), mediaImages);

  return (
    <div className="space-y-4 rounded-2xl border border-orange-200/90 bg-gradient-to-b from-orange-50/50 to-white p-4 shadow-xs dark:border-orange-900/40 dark:from-slate-900/80 dark:to-slate-950 md:col-span-2">
      {/* Header with Slide Tabs and Add Button */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-600 text-white shadow-xs">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Quản lý Slider Hero ({slides.length} slide)
            </h3>
            <p className="text-[11px] text-slate-500">Chuyển qua lại giữa các slide để chỉnh sửa nội dung chi tiết</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleAddSlide}
          className="flex items-center gap-1.5 rounded-xl bg-orange-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs transition hover:bg-orange-700 active:scale-95"
        >
          <Plus className="h-3.5 w-3.5" />
          Thêm Slide mới
        </button>
      </div>

      {/* Slide Tabs Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
        {slides.map((s, idx) => {
          const isActive = idx === currentIdx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => { setActiveSlideIndex(idx); onActiveSlideChange?.(idx); }}
              className={`group flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 font-medium transition-all ${
                isActive
                  ? 'bg-orange-600 text-white shadow-sm ring-2 ring-orange-400/30'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-orange-300 hover:bg-orange-50/50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
              }`}
            >
              <span className={`flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-bold ${
                isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
              }`}>
                {idx + 1}
              </span>
              <span className="max-w-[140px] truncate text-xs font-semibold">
                {s.title ? String(s.title).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() : `Slide ${idx + 1}`}
              </span>
            </button>
          );
        })}
      </div>

      {/* Current Slide Editor Card */}
      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {/* Slide Actions Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-orange-100 px-2.5 py-1 text-xs font-bold text-orange-800 dark:bg-orange-950 dark:text-orange-300">
              Đang chỉnh sửa: Slide {currentIdx + 1}/{slides.length}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentIdx === 0}
              onClick={() => handleMoveSlide(currentIdx, 'prev')}
              title="Di chuyển sang trước"
              className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-30 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled={currentIdx === slides.length - 1}
              onClick={() => handleMoveSlide(currentIdx, 'next')}
              title="Di chuyển sang sau"
              className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-30 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => handleDuplicateSlide(currentIdx)}
              title="Nhân bản slide này"
              className="flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Copy className="h-3.5 w-3.5" />
              Nhân bản
            </button>
            <button
              type="button"
              onClick={() => handleDeleteSlide(currentIdx)}
              title="Xóa slide này"
              className="flex items-center gap-1 rounded-lg border border-red-200 px-2 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Xóa
            </button>
          </div>
        </div>

        {/* Slide Preview Banner */}
        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-900 text-white dark:border-slate-800">
          <div className="absolute inset-0 bg-cover bg-center opacity-40 blur-[1px]" style={{ backgroundImage: bgAsset ? `url(${bgAsset.thumbnail_url ?? bgAsset.url})` : undefined }} />
          <div className="relative z-10 p-4 space-y-1.5">
            <span className="inline-block rounded-md bg-orange-600/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              Xem trước slide {currentIdx + 1}
            </span>
            <h4 
              className="text-base font-bold leading-snug line-clamp-2"
              dangerouslySetInnerHTML={{ __html: sanitizeHtmlContent(formatHeroHeading(currentSlide.title)) || '(Chưa nhập tiêu đề slide)' }}
            />
            <p 
              className="text-xs text-slate-300 line-clamp-2"
              dangerouslySetInnerHTML={{ __html: sanitizeHtmlContent(currentSlide.subtitle) || '(Chưa nhập mô tả phụ)' }}
            />
          </div>
        </div>

        {/* Form Fields for Active Slide */}
        <div className="space-y-3.5">
          {/* Tiêu đề Slide */}
          <label className="block space-y-1.5">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Tiêu đề Slide (Heading chính) <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              value={String(currentSlide.title ?? '')}
              onChange={(e) => updateSlideField('title', e.target.value)}
              placeholder="Nhập tiêu đề mở đầu ấn tượng..."
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </label>

          {/* Mô tả phụ Slide */}
          <label className="block space-y-1.5">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Mô tả ngắn Slide (Subtitle)
            </span>
            <textarea
              rows={2}
              value={String(currentSlide.subtitle ?? '')}
              onChange={(e) => updateSlideField('subtitle', e.target.value)}
              placeholder="Mô tả thông điệp cốt lõi của slide..."
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
            />
          </label>

          {/* Ảnh nền Slide */}
          <div className="space-y-1.5">
            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Image className="h-3.5 w-3.5 text-orange-600" />
              Ảnh nền Slide (Background Image)
            </span>
            <button
              type="button"
              onClick={() => onPickImage([...path, currentIdx, 'backgroundImageId'], String(currentSlide.backgroundImageId ?? ''))}
              className="group flex w-full items-center gap-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2 text-left hover:border-orange-400 dark:border-slate-700 dark:bg-slate-800"
            >
              {bgAsset ? (
                <>
                  <img src={bgAsset.thumbnail_url ?? bgAsset.url} alt="" className="h-14 w-24 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-100">{bgAsset.title}</p>
                    <p className="text-[11px] text-orange-600 font-medium group-hover:underline">Nhấn để thay đổi ảnh</p>
                  </div>
                </>
              ) : (
                <div className="flex h-14 w-full items-center justify-center gap-2 text-xs font-semibold text-slate-500">
                  <Image className="h-5 w-5 text-slate-400" />
                  <span>Chọn hoặc tải ảnh nền</span>
                </div>
              )}
            </button>
          </div>

          <div className="space-y-1.5">
            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200"><Smartphone className="h-3.5 w-3.5 text-orange-600" />Ảnh Mobile</span>
            <button type="button" onClick={() => onPickImage([...path, currentIdx, 'mobileImageId'], String(currentSlide.mobileImageId ?? ''))} className="group flex w-full items-center gap-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2 text-left hover:border-orange-400 dark:border-slate-700 dark:bg-slate-800">{mobileAsset ? <><img src={mobileAsset.thumbnail_url ?? mobileAsset.url} alt="" className="h-16 w-12 rounded-lg object-cover" /><div className="min-w-0 flex-1"><p className="truncate text-xs font-bold text-slate-800 dark:text-slate-100">{mobileAsset.title}</p><p className="text-[11px] font-medium text-orange-600 group-hover:underline">Nhấn để thay ảnh mobile</p></div></> : <div className="flex h-14 w-full items-center justify-center gap-2 text-xs font-semibold text-slate-500"><Smartphone className="h-5 w-5 text-slate-400" /><span>Dùng ảnh desktop nếu để trống</span></div>}</button>
          </div>

          {/* CTA Buttons in a 2-column layout */}
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block space-y-1.5">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Nút hành động chính (Primary CTA)
              </span>
              <select
                value={String(currentSlide.primaryCtaId ?? '')}
                onChange={(e) => updateSlideField('primaryCtaId', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950 cursor-pointer"
              >
                <option value="">-- Không dùng CTA --</option>
                {CTA_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Nút hành động phụ (Secondary CTA)
              </span>
              <select
                value={String(currentSlide.secondaryCtaId ?? '')}
                onChange={(e) => updateSlideField('secondaryCtaId', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950 cursor-pointer"
              >
                <option value="">-- Không dùng CTA --</option>
                {CTA_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
