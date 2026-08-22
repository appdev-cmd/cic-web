import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowUpDown,
  Bell,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  Copy,
  Eye,
  FileCode2,
  Flame,
  Image,
  Layers,
  Link2,
  ListFilter,
  MapPin,
  Maximize2,
  Minimize2,
  Monitor,
  MoveDown,
  MoveUp,
  Plus,
  Radio,
  RefreshCw,
  Save,
  Search,
  Send,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Tablet,
  Trash2,
  X,
} from 'lucide-react';
import { CmsButton } from '../../components/ui/CmsButton';
import type { CmsMediaPickerItem } from '../../data/MediaPickerDataSource';
import { entityTypeLabels, sectionDefinitions } from './pageBuilderRegistry';
import { PageEntityPickerModal } from './PageEntityPickerModal';
import { findPageBuilderImage, PageMediaPickerModal } from './PageMediaPickerModal';
import { PageBuilderVisualCanvas } from './PageBuilderVisualCanvas';
import { RichTextEditor } from './RichTextEditor';
import { mockArticles } from '../news/mockData';
import type { PageBuilderConfigValue, PageBuilderEntityOption, PageBuilderEntityType, PageBuilderPage, PageBuilderSection } from './pageBuilderTypes';

interface PageBuilderEditorProps {
  page: PageBuilderPage;
  onBack: () => void;
  onSaveDraft: (page: PageBuilderPage) => void;
  onPreview: (page: PageBuilderPage) => void;
  onPublish: (page: PageBuilderPage) => void;
  entityOptions: PageBuilderEntityOption[];
  mediaImages: CmsMediaPickerItem[];
}

const fieldLabels: Record<string, string> = {
  title: 'Tiêu đề', subtitle: 'Mô tả ngắn', description: 'Nội dung mô tả', badge: 'Nhãn', eyebrow: 'Nhãn giới thiệu',
  phone: 'Số điện thoại', email: 'Email', videoUrl: 'Video URL', mapUrl: 'Google Maps URL', imageId: 'Ảnh',
  backgroundImageId: 'Ảnh nền', primaryCtaId: 'CTA chính', secondaryCtaId: 'CTA phụ', ctaId: 'CTA', formId: 'Form',
  submitLabel: 'Nhãn nút gửi', successTitle: 'Tiêu đề thành công', successMessage: 'Nội dung thành công', lastUpdated: 'Ngày cập nhật',
  readingTime: 'Thời gian đọc', categoryTag: 'Nhãn danh mục', vision: 'Tầm nhìn', mission: 'Sứ mệnh', policyPageId: 'Trang chính sách',
  name: 'Tên', address: 'Địa chỉ', workingHours: 'Giờ làm việc', year: 'Năm', value: 'Giá trị', suffix: 'Hậu tố', label: 'Nhãn',
  text: 'Nội dung', richTextHtml: 'Nội dung', downloadMediaId: 'Hồ sơ năng lực', mediaId: 'Media', targetId: 'Dữ liệu liên kết', slotKey: 'Vị trí cố định',
};

const readOnlyKeys = new Set(['key', 'targetId', 'categoryKeys']);
const longTextKeys = new Set(['description', 'subtitle', 'text', 'vision', 'mission', 'address', 'workingHours']);

const FORM_OPTIONS = [
  { value: 'form_home_consultation', label: 'Form tư vấn trang chủ (form_home_consultation)' },
  { value: 'form_contact_request', label: 'Form tiếp nhận liên hệ (form_contact_request)' },
  { value: 'form_001', label: 'Form Đăng ký tư vấn giải pháp ERP (form_001)' },
  { value: 'form_002', label: 'Form Báo giá bản quyền phần mềm (form_002)' },
  { value: 'form_003', label: 'Form Tải Hồ sơ năng lực CIC (form_003)' },
  { value: 'form_004', label: 'Form Khảo sát Đào tạo BIM (form_004)' },
];

const CTA_OPTIONS = [
  { value: 'cta_explore_products', label: 'Khám phá sản phẩm (cta_explore_products)' },
  { value: 'cta_about_cic', label: 'Tìm hiểu về CIC (cta_about_cic)' },
  { value: 'cta_contact', label: 'Liên hệ ngay (cta_contact)' },
  { value: 'cta_tuvan_erp', label: 'Tư vấn giải pháp (cta_tuvan_erp)' },
  { value: 'cta_baogia_intellicad', label: 'Báo giá phần mềm (cta_baogia_intellicad)' },
  { value: 'cta_download_profile', label: 'Tải Hồ sơ năng lực (cta_download_profile)' },
  { value: 'cta_bim_consulting', label: 'Tư vấn giải pháp BIM (cta_bim_consulting)' },
];

const POLICY_PAGE_OPTIONS = [
  { value: 'page_privacy_vi', label: 'Chính sách bảo mật thông tin (/chinh-sach-bao-mat)' },
  { value: 'page_terms_vi', label: 'Điều khoản sử dụng dịch vụ (/dieu-khoan-su-dung)' },
  { value: 'page_iso_compliance', label: 'Tiêu chuẩn bảo mật ISO 27001' },
];

const CATEGORY_TAG_OPTIONS = [
  { value: 'Trang nội dung', label: 'Trang nội dung' },
  { value: 'Chính sách pháp lý', label: 'Chính sách pháp lý' },
  { value: 'Điều khoản sử dụng', label: 'Điều khoản sử dụng' },
  { value: 'Giới thiệu doanh nghiệp', label: 'Giới thiệu doanh nghiệp' },
  { value: 'Dịch vụ công nghệ', label: 'Dịch vụ công nghệ' },
  { value: 'Tin tức & Sự kiện', label: 'Tin tức & Sự kiện' },
];

const DOWNLOAD_MEDIA_OPTIONS = [
  { value: 'media_company_profile', label: 'Hồ sơ năng lực CIC (PDF Tiếng Việt)' },
  { value: 'media_company_profile_en', label: 'CIC Company Profile (PDF English)' },
  { value: 'media_bim_catalog', label: 'Catalogue Giải pháp BIM & Digital Twins' },
  { value: 'media_software_brochure', label: 'Brochure Phần mềm Kỹ thuật Bản quyền' },
];

const SLOT_KEY_OPTIONS = [
  { value: 'primary', label: 'Ô chính (AI & Công nghệ thông minh)' },
  { value: 'secondary', label: 'Ô nổi bật (BIM & Digital Twins)' },
  { value: 'small_1', label: 'Ô nhỏ 1 (Phần mềm kỹ thuật bản quyền)' },
  { value: 'small_2', label: 'Ô nhỏ 2 (Thiết bị công nghệ)' },
  { value: 'small_3', label: 'Ô nhỏ 3 (Net Zero & Phát triển bền vững)' },
  { value: 'small_4', label: 'Ô nhỏ 4 (Tư vấn & Đào tạo)' },
  { value: 'full', label: 'Ô toàn chiều rộng (Giải pháp theo ngành)' },
];

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function labelFor(key: string): string {
  return fieldLabels[key] ?? key.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase());
}

function updateAtPath(config: Record<string, PageBuilderConfigValue>, path: Array<string | number>, value: PageBuilderConfigValue) {
  const next = deepClone(config);
  let cursor: PageBuilderConfigValue = next;
  path.slice(0, -1).forEach((part) => {
    cursor = (cursor as Record<string | number, PageBuilderConfigValue>)[part];
  });
  (cursor as Record<string | number, PageBuilderConfigValue>)[path[path.length - 1]] = value;
  return next;
}

function HeroSlidesEditor({
  slides,
  path,
  onChange,
  onPickImage,
  mediaImages,
}: {
  slides: Array<{
    title?: string;
    subtitle?: string;
    backgroundImageId?: string;
    primaryCtaId?: string;
    secondaryCtaId?: string;
    [key: string]: unknown;
  }>;
  path: Array<string | number>;
  onChange: (path: Array<string | number>, value: PageBuilderConfigValue) => void;
  onPickImage: (path: Array<string | number>, currentId: string) => void;
  mediaImages: CmsMediaPickerItem[];
}) {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const currentIdx = Math.min(Math.max(0, activeSlideIndex), Math.max(0, slides.length - 1));
  const currentSlide = slides[currentIdx] ?? {
    title: '',
    subtitle: '',
    backgroundImageId: '',
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
              onClick={() => setActiveSlideIndex(idx)}
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
                {s.title ? s.title : `Slide ${idx + 1}`}
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
            <h4 className="text-base font-bold leading-snug line-clamp-2">
              {currentSlide.title || '(Chưa nhập tiêu đề slide)'}
            </h4>
            <p className="text-xs text-slate-300 line-clamp-2">
              {currentSlide.subtitle || '(Chưa nhập mô tả phụ)'}
            </p>
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

function MilestonesEditor({
  milestones,
  path,
  onChange,
}: {
  milestones: Array<{ year?: string | number; title?: string; description?: string; [key: string]: unknown }>;
  path: Array<string | number>;
  onChange: (path: Array<string | number>, value: PageBuilderConfigValue) => void;
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const current = milestones[activeIdx] ?? milestones[0] ?? { year: '2026', title: '', description: '' };

  const handleUpdateField = (field: string, val: unknown) => {
    const next = milestones.map((m, idx) => (idx === activeIdx ? { ...m, [field]: val } : m));
    onChange(path, next as any);
  };

  const handleAdd = () => {
    const next = [...milestones, { year: `${new Date().getFullYear()}`, title: 'Cột mốc phát triển mới', description: 'Mô tả chi tiết về sự kiện hoặc thành tựu nổi bật.' }];
    onChange(path, next as any);
    setActiveIdx(next.length - 1);
  };

  const handleDelete = (idx: number) => {
    if (milestones.length <= 1) return;
    const next = milestones.filter((_, i) => i !== idx);
    onChange(path, next as any);
    setActiveIdx(Math.max(0, idx - 1));
  };

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50 md:col-span-2">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-orange-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Tiến trình lịch sử ({milestones.length} mốc)
          </h3>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1.5 rounded-xl bg-orange-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-orange-700"
        >
          <Plus className="h-3.5 w-3.5" />
          Thêm mốc lịch sử
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
        {milestones.map((m, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveIdx(idx)}
            className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 font-bold transition ${
              idx === activeIdx
                ? 'bg-orange-600 text-white shadow-xs'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            <span className="rounded bg-black/10 px-1 py-0.5 text-[10px]">{m.year || 'Năm'}</span>
            <span className="max-w-[120px] truncate">{m.title || `Mục ${idx + 1}`}</span>
          </button>
        ))}
      </div>

      <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
          <span className="text-xs font-bold text-orange-700 dark:text-orange-400">
            Đang sửa: Mốc {activeIdx + 1} ({current.year})
          </span>
          <button
            type="button"
            onClick={() => handleDelete(activeIdx)}
            className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline"
          >
            <Trash2 className="h-3.5 w-3.5" /> Xóa mốc này
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="block space-y-1 sm:col-span-1">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Năm mốc thời gian</span>
            <input
              type="text"
              value={String(current.year ?? '')}
              onChange={(e) => handleUpdateField('year', e.target.value)}
              placeholder="VD: 1990, 2006..."
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-orange-600 outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950"
            />
          </label>
          <label className="block space-y-1 sm:col-span-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Tiêu đề cột mốc</span>
            <input
              type="text"
              value={String(current.title ?? '')}
              onChange={(e) => handleUpdateField('title', e.target.value)}
              placeholder="Nhập tên sự kiện cột mốc..."
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950"
            />
          </label>
        </div>
        <label className="block space-y-1">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Mô tả sự kiện</span>
          <textarea
            rows={3}
            value={String(current.description ?? '')}
            onChange={(e) => handleUpdateField('description', e.target.value)}
            placeholder="Mô tả chi tiết những bước ngoặt trong giai đoạn này..."
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
      </div>
    </div>
  );
}

function BranchesEditor({
  branches,
  path,
  onChange,
}: {
  branches: Array<{ name?: string; address?: string; phone?: string; email?: string; workingHours?: string; mapUrl?: string; [key: string]: unknown }>;
  path: Array<string | number>;
  onChange: (path: Array<string | number>, value: PageBuilderConfigValue) => void;
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const current = branches[activeIdx] ?? branches[0] ?? {};

  const handleUpdateField = (field: string, val: unknown) => {
    const next = branches.map((b, idx) => (idx === activeIdx ? { ...b, [field]: val } : b));
    onChange(path, next as any);
  };

  const handleAdd = () => {
    const next = [
      ...branches,
      {
        name: 'Văn phòng đại diện mới',
        address: 'Địa chỉ chi nhánh mới...',
        phone: '024 3974 1373',
        email: 'contact@cic.com.vn',
        workingHours: 'Thứ 2 - Thứ 6: 08:00 - 17:30',
        mapUrl: 'https://maps.google.com',
      },
    ];
    onChange(path, next as any);
    setActiveIdx(next.length - 1);
  };

  const handleDelete = (idx: number) => {
    if (branches.length <= 1) return;
    const next = branches.filter((_, i) => i !== idx);
    onChange(path, next as any);
    setActiveIdx(Math.max(0, idx - 1));
  };

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50 md:col-span-2">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-orange-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Danh sách Chi nhánh & Trụ sở ({branches.length})
          </h3>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1.5 rounded-xl bg-orange-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-orange-700"
        >
          <Plus className="h-3.5 w-3.5" />
          Thêm chi nhánh
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
        {branches.map((b, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveIdx(idx)}
            className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 font-bold transition ${
              idx === activeIdx
                ? 'bg-orange-600 text-white shadow-xs'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            <MapPin className="h-3.5 w-3.5" />
            <span className="max-w-[140px] truncate">{b.name || `Chi nhánh ${idx + 1}`}</span>
          </button>
        ))}
      </div>

      <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
          <span className="text-xs font-bold text-orange-700 dark:text-orange-400">
            Đang sửa: {current.name || `Chi nhánh ${activeIdx + 1}`}
          </span>
          <button
            type="button"
            onClick={() => handleDelete(activeIdx)}
            className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline"
          >
            <Trash2 className="h-3.5 w-3.5" /> Xóa chi nhánh này
          </button>
        </div>
        <label className="block space-y-1">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Tên chi nhánh / Văn phòng</span>
          <input
            type="text"
            value={String(current.name ?? '')}
            onChange={(e) => handleUpdateField('name', e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Địa chỉ cụ thể</span>
          <textarea
            rows={2}
            value={String(current.address ?? '')}
            onChange={(e) => handleUpdateField('address', e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block space-y-1">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Số điện thoại</span>
            <input
              type="text"
              value={String(current.phone ?? '')}
              onChange={(e) => handleUpdateField('phone', e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email liên hệ</span>
            <input
              type="text"
              value={String(current.email ?? '')}
              onChange={(e) => handleUpdateField('email', e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950"
            />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block space-y-1">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Giờ làm việc</span>
            <input
              type="text"
              value={String(current.workingHours ?? '')}
              onChange={(e) => handleUpdateField('workingHours', e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Google Maps URL</span>
            <input
              type="text"
              value={String(current.mapUrl ?? '')}
              onChange={(e) => handleUpdateField('mapUrl', e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950"
            />
          </label>
        </div>
      </div>
    </div>
  );
}

function HotNewsTickerEditor({
  items,
  path,
  onChange,
  entityOptions = [],
}: {
  items: string[];
  path: Array<string | number>;
  onChange: (path: Array<string | number>, value: PageBuilderConfigValue) => void;
  entityOptions?: PageBuilderEntityOption[];
}) {
  const [mode, setMode] = useState<'auto_hot' | 'manual_news' | 'custom_text'>('auto_hot');
  const [autoLimit, setAutoLimit] = useState(4);
  const [onlyPublished, setOnlyPublished] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [newItem, setNewItem] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Consolidate available news from mockArticles and entityOptions
  const allNews = useMemo(() => {
    const list: Array<{ id: string; title: string; is_hot: boolean; published: boolean; date?: string; category?: string }> = [];
    const seen = new Set<string>();

    mockArticles.forEach((art) => {
      seen.add(art.id);
      list.push({
        id: art.id,
        title: art.title,
        is_hot: Boolean(art.is_hot),
        published: Boolean(art.published),
        date: art.created_time?.split(' ')[0] || '2026-08-01',
        category: art.category_id,
      });
    });

    entityOptions
      .filter((opt) => opt.entityType === 'news')
      .forEach((opt) => {
        if (!seen.has(opt.id)) {
          seen.add(opt.id);
          list.push({
            id: opt.id,
            title: opt.label,
            is_hot: true,
            published: true,
            date: '2026-08-01',
            category: opt.description,
          });
        }
      });

    return list;
  }, [entityOptions]);

  // Compute hot news items based on filters
  const hotNewsArticles = useMemo(() => {
    return allNews
      .filter((n) => n.is_hot && (!onlyPublished || n.published))
      .slice(0, autoLimit);
  }, [allNews, onlyPublished, autoLimit]);

  // Auto-sync titles when in auto_hot mode if items differ
  const handleApplyAutoHot = () => {
    const titles = hotNewsArticles.map((n) => n.title);
    onChange(path, titles as any);
  };

  // Toggle selection for manual news mode
  const handleToggleNewsId = (id: string) => {
    let nextIds: string[];
    if (selectedIds.includes(id)) {
      nextIds = selectedIds.filter((item) => item !== id);
    } else {
      nextIds = [...selectedIds, id];
    }
    setSelectedIds(nextIds);
    const titles = nextIds
      .map((nid) => allNews.find((n) => n.id === nid)?.title)
      .filter((t): t is string => Boolean(t));
    onChange(path, titles as any);
  };

  const handleMoveSelected = (idx: number, dir: 'up' | 'down') => {
    const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= selectedIds.length) return;
    const nextIds = [...selectedIds];
    const item = nextIds[idx];
    nextIds[idx] = nextIds[targetIdx];
    nextIds[targetIdx] = item;
    setSelectedIds(nextIds);
    const titles = nextIds
      .map((nid) => allNews.find((n) => n.id === nid)?.title)
      .filter((t): t is string => Boolean(t));
    onChange(path, titles as any);
  };

  // Custom text handlers
  const handleAddCustom = () => {
    if (!newItem.trim()) return;
    onChange(path, [...items, newItem.trim()] as any);
    setNewItem('');
  };

  const handleRemoveCustom = (idx: number) => {
    onChange(path, items.filter((_, i) => i !== idx) as any);
  };

  const handleUpdateCustom = (idx: number, val: string) => {
    onChange(path, items.map((it, i) => (i === idx ? val : it)) as any);
  };

  const filteredNewsForPicker = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return allNews;
    return allNews.filter((n) => n.title.toLowerCase().includes(q));
  }, [allNews, searchQuery]);

  return (
    <div className="space-y-4 rounded-2xl border border-orange-200 bg-gradient-to-b from-orange-50/40 via-white to-slate-50/50 p-4 shadow-xs dark:border-orange-900/40 dark:from-slate-900/80 dark:to-slate-950 md:col-span-2">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-orange-100 pb-3 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-600 text-white shadow-xs">
            <Flame className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Dải tin chạy chân Hero (Hot News Ticker)
              </h3>
              <span className="rounded bg-orange-100 px-1.5 py-0.5 text-[10px] font-black text-orange-700 dark:bg-orange-950 dark:text-orange-300">
                HOT NEWS
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Cấu hình nội dung chữ chạy ngang chân Banner trang chủ ({items.length} tin đang hiển thị)
            </p>
          </div>
        </div>
      </div>

      {/* Live Marquee Preview */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950 p-2.5 shadow-inner">
        <div className="flex items-center gap-3">
          <span className="flex shrink-0 items-center gap-1.5 rounded-md bg-orange-600 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-white shadow-xs">
            <Bell className="h-3 w-3 animate-bounce" />
            HOT NEWS
          </span>
          <div className="flex-1 overflow-hidden whitespace-nowrap text-xs font-medium text-slate-200">
            {items.length > 0 ? (
              <span className="inline-block animate-pulse">
                {items.join('  •  ')}
              </span>
            ) : (
              <span className="italic text-slate-500">Chưa có tin nào trong dải chữ chạy...</span>
            )}
          </div>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-1 gap-2 rounded-xl bg-slate-100 p-1 sm:grid-cols-3 dark:bg-slate-800/80">
        <button
          type="button"
          onClick={() => {
            setMode('auto_hot');
            handleApplyAutoHot();
          }}
          className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition ${
            mode === 'auto_hot'
              ? 'bg-white text-orange-600 shadow-xs dark:bg-slate-900 dark:text-orange-400'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Tự động từ Tin HOT</span>
        </button>
        <button
          type="button"
          onClick={() => setMode('manual_news')}
          className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition ${
            mode === 'manual_news'
              ? 'bg-white text-orange-600 shadow-xs dark:bg-slate-900 dark:text-orange-400'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <ListFilter className="h-3.5 w-3.5" />
          <span>Tự chọn bài viết Tin tức</span>
        </button>
        <button
          type="button"
          onClick={() => setMode('custom_text')}
          className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition ${
            mode === 'custom_text'
              ? 'bg-white text-orange-600 shadow-xs dark:bg-slate-900 dark:text-orange-400'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Nhập tin vắn tùy chỉnh</span>
        </button>
      </div>

      {/* Mode 1: Auto Hot News */}
      {mode === 'auto_hot' && (
        <div className="space-y-3 rounded-xl border border-orange-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Lấy tối đa:</span>
              <select
                value={autoLimit}
                onChange={(e) => {
                  const lim = Number(e.target.value);
                  setAutoLimit(lim);
                  const titles = allNews
                    .filter((n) => n.is_hot && (!onlyPublished || n.published))
                    .slice(0, lim)
                    .map((n) => n.title);
                  onChange(path, titles as any);
                }}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-800 outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value={3}>Top 3 tin Hot nhất</option>
                <option value={4}>Top 4 tin Hot nhất</option>
                <option value={5}>Top 5 tin Hot nhất</option>
                <option value={8}>Top 8 tin Hot nhất</option>
                <option value={20}>Tất cả tin đánh dấu Hot</option>
              </select>
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <input
                type="checkbox"
                checked={onlyPublished}
                onChange={(e) => {
                  const val = e.target.checked;
                  setOnlyPublished(val);
                  const titles = allNews
                    .filter((n) => n.is_hot && (!val || n.published))
                    .slice(0, autoLimit)
                    .map((n) => n.title);
                  onChange(path, titles as any);
                }}
                className="h-4 w-4 rounded accent-orange-600"
              />
              <span>Chỉ lấy bài đã Publish</span>
            </label>

            <button
              type="button"
              onClick={handleApplyAutoHot}
              className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-orange-700"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Đồng bộ ngay ({hotNewsArticles.length} bài)
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Các bài viết Tin tức đánh dấu HOT đang được hệ thống tự động đưa vào dải chữ chạy:
            </p>
            {hotNewsArticles.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-500">
                Không tìm thấy bài viết nào được đánh dấu Hot và xuất bản. Bạn có thể chuyển sang chế độ Tự chọn bài viết hoặc Tùy chỉnh tin vắn.
              </div>
            ) : (
              <div className="space-y-1.5">
                {hotNewsArticles.map((article, idx) => (
                  <div
                    key={article.id}
                    className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-xs dark:border-slate-800 dark:bg-slate-800/60"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-orange-100 text-[10px] font-bold text-orange-700 dark:bg-orange-950 dark:text-orange-400">
                      {idx + 1}
                    </span>
                    <span className="shrink-0 rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-black text-red-700 dark:bg-red-950 dark:text-red-300">
                      🔥 HOT
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-900 dark:text-white">{article.title}</p>
                      <p className="mt-0.5 text-[10px] text-slate-400">ID: {article.id} · Ngày đăng: {article.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mode 2: Manual News Selection */}
      {mode === 'manual_news' && (
        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm bài viết theo tiêu đề..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
          </div>

          {/* Selected items order */}
          {selectedIds.length > 0 && (
            <div className="space-y-2 rounded-xl bg-orange-50/50 p-3 dark:bg-orange-950/20">
              <span className="text-xs font-bold text-orange-800 dark:text-orange-300">
                Thứ tự các bài viết đã chọn ({selectedIds.length}):
              </span>
              <div className="space-y-1.5">
                {selectedIds.map((sid, idx) => {
                  const art = allNews.find((n) => n.id === sid);
                  return (
                    <div
                      key={sid}
                      className="flex items-center justify-between gap-2 rounded-lg border border-orange-200 bg-white px-3 py-2 text-xs shadow-xs dark:border-slate-700 dark:bg-slate-800"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-orange-100 text-[10px] font-bold text-orange-700">
                          {idx + 1}
                        </span>
                        <span className="truncate font-semibold text-slate-800 dark:text-slate-200">
                          {art?.title ?? sid}
                        </span>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveSelected(idx, 'up')}
                          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 dark:hover:bg-slate-700"
                          title="Lên trước"
                        >
                          <MoveUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === selectedIds.length - 1}
                          onClick={() => handleMoveSelected(idx, 'down')}
                          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 dark:hover:bg-slate-700"
                          title="Xuống sau"
                        >
                          <MoveDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleNewsId(sid)}
                          className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                          title="Bỏ chọn"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* List of articles to choose from */}
          <div className="max-h-60 space-y-1.5 overflow-y-auto pr-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Chọn các bài viết từ kho Tin tức:
            </span>
            {filteredNewsForPicker.map((article) => {
              const isSelected = selectedIds.includes(article.id);
              return (
                <button
                  key={article.id}
                  type="button"
                  onClick={() => handleToggleNewsId(article.id)}
                  className={`flex w-full items-start gap-2.5 rounded-xl border p-2.5 text-left text-xs transition ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50 text-orange-950 dark:border-orange-600 dark:bg-orange-950/40 dark:text-orange-100'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300'
                  }`}
                >
                  <div
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                      isSelected
                        ? 'border-orange-600 bg-orange-600 text-white'
                        : 'border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-900'
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {article.is_hot && (
                        <span className="rounded bg-red-100 px-1.5 py-0.2 text-[9px] font-black text-red-700 dark:bg-red-950 dark:text-red-300">
                          🔥 HOT
                        </span>
                      )}
                      <span className="font-semibold">{article.title}</span>
                    </div>
                    <p className="mt-0.5 text-[10px] text-slate-400">{article.date} · ID: {article.id}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Mode 3: Custom Text */}
      {mode === 'custom_text' && (
        <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Nhập trực tiếp các dòng tin vắn tùy chỉnh ({items.length} dòng):
          </span>
          <div className="space-y-2">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-xs font-bold text-orange-700">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleUpdateCustom(idx, e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveCustom(idx)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-1">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustom())}
              placeholder="Nhập nội dung tin vắn / thông báo mới..."
              className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950"
            />
            <button
              type="button"
              onClick={handleAddCustom}
              className="flex items-center gap-1 rounded-xl bg-orange-600 px-3 py-2 text-xs font-bold text-white hover:bg-orange-700"
            >
              <Plus className="h-3.5 w-3.5" /> Thêm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const imageKeys = new Set(['imageId', 'backgroundImageId']);

function ConfigField({
  fieldKey,
  value,
  path,
  onChange,
  onPickImage,
  mediaImages,
  entityOptions,
}: {
  fieldKey: string;
  value: PageBuilderConfigValue;
  path: Array<string | number>;
  onChange: (path: Array<string | number>, value: PageBuilderConfigValue) => void;
  onPickImage: (path: Array<string | number>, currentId: string) => void;
  mediaImages: CmsMediaPickerItem[];
  entityOptions?: PageBuilderEntityOption[];
}) {
  if (fieldKey === 'richTextHtml') {
    return (
      <div className="space-y-1.5 md:col-span-2">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{labelFor(fieldKey)}</span>
        <RichTextEditor value={String(value ?? '')} onChange={(nextValue) => onChange(path, nextValue)} minHeight="420px" />
        <span className="block text-[11px] text-slate-400">Dùng heading, đoạn văn, danh sách, bảng, link và ảnh trong cùng một nội dung.</span>
      </div>
    );
  }

  if (fieldKey === 'slides' && Array.isArray(value)) {
    return <HeroSlidesEditor slides={value as any} path={path} onChange={onChange} onPickImage={onPickImage} mediaImages={mediaImages} />;
  }

  if (fieldKey === 'milestones' && Array.isArray(value)) {
    return <MilestonesEditor milestones={value as any} path={path} onChange={onChange} />;
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
    return (
      <div className="space-y-2 md:col-span-2">
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{labelFor(fieldKey)}</p>
        {value.map((item, index) => (
          <div key={index} className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/60">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">Mục {index + 1}</p>
            {typeof item === 'object' && item !== null ? (
              <div className="grid gap-3 md:grid-cols-2">
                {Object.entries(item).map(([key, child]) => <ConfigField key={key} fieldKey={key} value={child} path={[...path, index, key]} onChange={onChange} onPickImage={onPickImage} mediaImages={mediaImages} entityOptions={entityOptions} />)}
              </div>
            ) : <ConfigField fieldKey={`${fieldKey}_${index + 1}`} value={item} path={[...path, index]} onChange={onChange} onPickImage={onPickImage} mediaImages={mediaImages} entityOptions={entityOptions} />}
          </div>
        ))}
      </div>
    );
  }

  if (typeof value === 'object' && value !== null) {
    return <div className="grid gap-3 md:grid-cols-2">{Object.entries(value).map(([key, child]) => <ConfigField key={key} fieldKey={key} value={child} path={[...path, key]} onChange={onChange} onPickImage={onPickImage} mediaImages={mediaImages} entityOptions={entityOptions} />)}</div>;
  }

  if (imageKeys.has(fieldKey)) {
    const currentId = typeof value === 'string' ? value : '';
    const asset = findPageBuilderImage(currentId, mediaImages);
    return <div className="space-y-1.5"><span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300"><Image className="h-3.5 w-3.5 text-slate-400" />{labelFor(fieldKey)}</span><button type="button" onClick={() => onPickImage(path, currentId)} className="group w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 text-left hover:border-orange-400 dark:border-slate-700 dark:bg-slate-800">{asset ? <><img src={asset.thumbnail_url ?? asset.url} alt="" className="aspect-[16/7] w-full object-cover" /><span className="block truncate px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200">{asset.title}</span></> : <span className="flex min-h-28 flex-col items-center justify-center gap-2 p-4 text-xs font-semibold text-slate-500"><Image className="h-7 w-7" />Chọn hoặc tải ảnh</span>}</button></div>;
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

function validate(page: PageBuilderPage, entityOptions: PageBuilderEntityOption[]): Record<string, string[]> {
  const issues: Record<string, string[]> = {};
  if (!page.draft.seo.title.trim()) issues.seo = ['SEO title không được để trống.'];
  page.draft.sections.forEach((section) => {
    const sectionIssues: string[] = [];
    const title = section.config.title;
    if (typeof title === 'string' && !title.trim()) sectionIssues.push('Tiêu đề không được để trống.');
    if (section.sectionKey === 'home.hero') {
      const slides = section.config.slides;
      if (!Array.isArray(slides) || slides.length === 0) sectionIssues.push('Hero phải có ít nhất một slide.');
    }
    const limits = sectionDefinitions[section.sectionKey]?.referenceLimit;
    section.references?.forEach((reference) => {
      const limit = limits?.[reference.entityType];
      if (limit && reference.entityIds.length > limit) sectionIssues.push(`${entityTypeLabels[reference.entityType]} vượt giới hạn ${limit} mục.`);
      if (new Set(reference.entityIds).size !== reference.entityIds.length) sectionIssues.push(`${entityTypeLabels[reference.entityType]} có mục bị trùng.`);
      const unavailableCount = reference.entityIds.filter((id) => {
        const option = entityOptions.find((item) => item.id === id && item.entityType === reference.entityType);
        return !option || (option.status ?? 'published') !== 'published';
      }).length;
      if (unavailableCount > 0) sectionIssues.push(`${unavailableCount} ${entityTypeLabels[reference.entityType].toLowerCase()} không còn khả dụng hoặc chưa publish.`);
    });
    if (sectionIssues.length > 0) issues[section.id] = sectionIssues;
  });
  return issues;
}

export const PageBuilderEditor: React.FC<PageBuilderEditorProps> = ({ page, onBack, onSaveDraft, onPreview, onPublish, entityOptions, mediaImages }) => {
  const [workingPage, setWorkingPage] = useState(() => deepClone(page));
  const [selectedSectionId, setSelectedSectionId] = useState(page.draft.sections[0]?.id ?? '');
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [picker, setPicker] = useState<{ sectionId: string; entityType: PageBuilderEntityType; selectedIds: string[]; limit: number } | null>(null);
  const [mediaPicker, setMediaPicker] = useState<{ sectionId: string; path: Array<string | number>; currentId: string } | null>(null);
  const [showValidation, setShowValidation] = useState(false);
  const [showMobileCanvas, setShowMobileCanvas] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const issues = useMemo(() => validate(workingPage, entityOptions), [entityOptions, workingPage]);
  const issueCount = Object.values(issues).reduce((total, values) => total + values.length, 0);

  const updateSectionConfig = (sectionId: string, path: Array<string | number>, value: PageBuilderConfigValue) => {
    setWorkingPage((current) => ({ ...current, draft: { ...current.draft, sections: current.draft.sections.map((section) => section.id === sectionId ? { ...section, config: updateAtPath(section.config, path, value) } : section) } }));
  };

  const updateReference = (sectionId: string, entityType: PageBuilderEntityType, ids: string[]) => {
    setWorkingPage((current) => ({ ...current, draft: { ...current.draft, sections: current.draft.sections.map((section) => section.id === sectionId ? { ...section, references: (section.references ?? []).map((reference) => reference.entityType === entityType ? { ...reference, entityIds: ids } : reference) } : section) } }));
  };

  const runValidAction = (action: (value: PageBuilderPage) => void) => {
    setShowValidation(true);
    if (issueCount === 0) action(workingPage);
  };

  return (
    <div className="space-y-5">
      <div className="cms-sticky-action rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <button onClick={onBack} className="rounded-xl bg-slate-100 p-2 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300" aria-label="Quay lại"><ArrowLeft className="h-5 w-5" /></button>
            <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="rounded-md bg-orange-50 px-2 py-1 text-[11px] font-bold text-orange-700">Draft v{workingPage.draft.version}</span><span className="rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700">Published v{workingPage.published.version}</span></div><h1 className="mt-1 truncate text-xl font-bold text-slate-950 dark:text-white">{workingPage.name}</h1><p className="text-xs text-slate-500">{workingPage.slug} · {workingPage.draft.sections.length} Section cố định</p></div>
          </div>
          <div className="flex flex-wrap gap-2"><CmsButton variant="secondary" leadingIcon={<Save />} onClick={() => runValidAction(onSaveDraft)}>Save Draft</CmsButton><CmsButton variant="secondary" leadingIcon={<Eye />} onClick={() => runValidAction(onPreview)}>Preview</CmsButton><CmsButton leadingIcon={<Send />} onClick={() => runValidAction(onPublish)}>Publish</CmsButton></div>
        </div>
      </div>

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-200"><div className="flex gap-2"><FileCode2 className="mt-0.5 h-4 w-4 shrink-0" /><p>Section và layout được định nghĩa trong code. Bạn chỉ có thể chỉnh các trường nội dung và dữ liệu liên kết được hiển thị bên dưới.</p></div></div>

      {showValidation && issueCount > 0 && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><div className="flex items-center gap-2 font-bold"><AlertCircle className="h-4 w-4" />Có {issueCount} lỗi cần sửa trước khi tiếp tục.</div></div>}

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">SEO</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2"><label className="space-y-1.5"><span className="text-xs font-semibold text-slate-700 dark:text-slate-300">SEO title</span><input value={workingPage.draft.seo.title} onChange={(event) => setWorkingPage({ ...workingPage, draft: { ...workingPage.draft, seo: { ...workingPage.draft.seo, title: event.target.value } } })} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950" /></label><label className="space-y-1.5"><span className="text-xs font-semibold text-slate-700 dark:text-slate-300">SEO description</span><input value={workingPage.draft.seo.description} onChange={(event) => setWorkingPage({ ...workingPage, draft: { ...workingPage.draft, seo: { ...workingPage.draft.seo, description: event.target.value } } })} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950" /></label></div>
        {showValidation && issues.seo?.map((issue) => <p key={issue} className="mt-2 text-xs font-semibold text-red-600">{issue}</p>)}
      </section>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_480px] 2xl:grid-cols-[minmax(0,1fr)_540px]">
        <section className="min-w-0 rounded-xl border border-slate-200 bg-slate-100 p-3 shadow-xs dark:border-slate-800 dark:bg-slate-950">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3 px-1">
            <div><h2 className="text-sm font-bold text-slate-900 dark:text-white">Giao diện Draft trực tiếp</h2><p className="text-xs text-slate-500">Click vào Section trên giao diện để chỉnh nội dung.</p></div>
            <div className="flex items-center gap-2"><button type="button" onClick={() => setShowMobileCanvas((value) => !value)} className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-bold text-slate-600 lg:hidden dark:border-slate-700 dark:bg-slate-900">{showMobileCanvas ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}{showMobileCanvas ? 'Thu gọn' : 'Hiện xem trước'}</button><div className="hidden rounded-lg border border-slate-200 bg-white p-1 sm:flex dark:border-slate-700 dark:bg-slate-900">
              {([['desktop', Monitor, 'Desktop'], ['tablet', Tablet, 'Tablet'], ['mobile', Smartphone, 'Mobile']] as const).map(([value, Icon, label]) => <button key={value} type="button" title={label} aria-label={label} onClick={() => setViewport(value)} className={`rounded-md p-2 ${viewport === value ? 'bg-orange-600 text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><Icon className="h-4 w-4" /></button>)}
            </div></div>
          </div>
          <div className={`${showMobileCanvas ? 'block' : 'hidden'} max-h-[70vh] overflow-auto rounded-xl bg-slate-300/60 p-3 lg:block lg:max-h-[calc(100vh-190px)] dark:bg-slate-900`}>
            <PageBuilderVisualCanvas page={workingPage} sections={workingPage.draft.sections} selectedId={selectedSectionId} issueIds={new Set(Object.keys(issues))} viewport={viewport} onSelect={setSelectedSectionId} />
          </div>
        </section>

        {(() => {
          const section = workingPage.draft.sections.find((item) => item.id === selectedSectionId) ?? workingPage.draft.sections[0];
          if (!section) return null;
          const definition = sectionDefinitions[section.sectionKey] ?? { label: section.sectionKey, description: '' };
          
          const content = (
            <div className="space-y-5">
              <div className="sticky top-0 z-10 -mx-4 -mt-4 mb-4 flex items-center justify-between border-b border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-xs font-bold text-orange-700">
                    {section.position}
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-sm font-bold text-slate-950 dark:text-white">{definition.label}</h2>
                    <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">{definition.description}</p>
                    <span className="mt-1.5 inline-block rounded bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-500 dark:bg-slate-800">
                      {section.sectionType} · cố định
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  title={isExpanded ? 'Thu nhỏ về cột bên' : 'Mở rộng toàn màn hình để dễ chỉnh sửa'}
                >
                  {isExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                  <span className="hidden sm:inline">{isExpanded ? 'Thu nhỏ' : 'Mở rộng'}</span>
                </button>
              </div>

              <div className="space-y-5">
                <div className="grid gap-4">
                  {Object.entries(section.config).map(([key, value]) => (
                    <ConfigField
                      key={key}
                      fieldKey={key}
                      value={value}
                      path={[key]}
                      onChange={(path, nextValue) => updateSectionConfig(section.id, path, nextValue)}
                      onPickImage={(path, currentId) => setMediaPicker({ sectionId: section.id, path, currentId })}
                      mediaImages={mediaImages}
                      entityOptions={entityOptions}
                    />
                  ))}
                </div>

                {section.references?.map((reference) => {
                  const limit = definition.referenceLimit?.[reference.entityType] ?? 20;
                  return (
                    <div key={reference.entityType} className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{entityTypeLabels[reference.entityType]} đã chọn</p>
                          <p className="text-xs text-slate-500">{reference.entityIds.length}/{limit} mục · đúng thứ tự hiển thị</p>
                        </div>
                        <CmsButton size="sm" variant="secondary" leadingIcon={<Link2 />} onClick={() => setPicker({ sectionId: section.id, entityType: reference.entityType, selectedIds: reference.entityIds, limit })}>Chọn</CmsButton>
                      </div>
                      <div className="mt-3 space-y-1.5">
                        {reference.entityIds.map((id, index) => (
                          <div key={id} className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                            {index + 1}. {entityOptions.find((item) => item.id === id)?.label ?? id}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {showValidation && issues[section.id]?.map((issue) => (
                  <p key={issue} className="flex items-center gap-1.5 text-xs font-semibold text-red-600">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {issue}
                  </p>
                ))}
              </div>
            </div>
          );

          if (isExpanded) {
            return (
              <>
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs transition-opacity" onClick={() => setIsExpanded(false)} />
                <div className="fixed inset-4 z-50 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:inset-10 lg:inset-x-24 lg:inset-y-12">
                  <div className="flex-1 overflow-y-auto p-6">
                    {content}
                  </div>
                </div>
              </>
            );
          }

          return (
            <aside className="sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              {content}
            </aside>
          );
        })()}
      </div>

      {picker && <PageEntityPickerModal isOpen entityType={picker.entityType} selectedIds={picker.selectedIds} limit={picker.limit} options={entityOptions} onClose={() => setPicker(null)} onConfirm={(ids) => updateReference(picker.sectionId, picker.entityType, ids)} />}
      {mediaPicker && <PageMediaPickerModal currentId={mediaPicker.currentId} images={mediaImages} onClose={() => setMediaPicker(null)} onConfirm={(mediaId) => updateSectionConfig(mediaPicker.sectionId, mediaPicker.path, mediaId)} />}
    </div>
  );
};
