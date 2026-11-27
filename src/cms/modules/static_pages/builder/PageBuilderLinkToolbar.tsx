import React, { useMemo, useState } from 'react';
import { ExternalLink, FileText, Globe, Link2, Mail, MessageCircle, Phone, Video, X } from 'lucide-react';
import type { PageBuilderConfigValue, PageBuilderEntityOption, PageBuilderSection } from '../pageBuilderTypes';
import { CTA_OPTIONS } from '../editor/editorConstants';
import { siblingPath, valueAtPath } from '../editor/editorUtils';
import { entityTypeLabels } from '../pageBuilderRegistry';
import { resolveAllowedVideoEmbedSrc } from '@/shared/lib/rich-text-embeds';

export interface ActiveLinkTarget {
  mode: 'cta' | 'video';
  sectionId: string;
  path: Array<string | number>;
  fallbackLabel?: string;
  initialUrl?: string;
}

interface PageBuilderLinkToolbarProps {
  target: ActiveLinkTarget;
  section: PageBuilderSection;
  entityOptions: PageBuilderEntityOption[];
  onUpdateConfig: (sectionId: string, path: Array<string | number>, value: PageBuilderConfigValue) => void;
  onClose: () => void;
}

const QUICK_CONTACT_PRESETS = [
  { label: 'Hotline CIC', url: 'tel:02439761381', icon: Phone, newTab: false },
  { label: 'Zalo Tư vấn', url: 'https://zalo.me/0988000000', icon: MessageCircle, newTab: true },
  { label: 'Email CIC', url: 'mailto:info@cic.com.vn', icon: Mail, newTab: false },
  { label: 'Trang Liên hệ', url: '/lien-he', icon: Globe, newTab: false },
  {
    label: 'Hồ sơ năng lực PDF',
    url: 'https://www.cic.com.vn/flipbooks/index.html?pdf=CICProfile2024Final.pdf',
    icon: FileText,
    newTab: true,
  },
];

const STATIC_ROUTE_OPTIONS = [
  { label: 'Trang chủ (/)', value: '/' },
  { label: 'Giới thiệu (/about)', value: '/about' },
  { label: 'Sản phẩm & Giải pháp (/products)', value: '/products' },
  { label: 'Dịch vụ Tư vấn (/services)', value: '/services' },
  { label: 'Dự án tiêu biểu (/projects)', value: '/projects' },
  { label: 'Tin tức & Góc nhìn (/news)', value: '/news' },
  { label: 'Sự kiện & Hội thảo (/events)', value: '/events' },
  { label: 'Liên hệ (/lien-he)', value: '/lien-he' },
  { label: 'Chính sách bảo mật (/chinh-sach-bao-mat)', value: '/chinh-sach-bao-mat' },
  { label: 'Điều khoản sử dụng (/dieu-khoan-su-dung)', value: '/dieu-khoan-su-dung' },
];

function entityPublicUrl(option: PageBuilderEntityOption): string {
  const slug = String((option.meta as Record<string, unknown> | undefined)?.slug || option.id);
  switch (option.entityType) {
    case 'product':
      return `/products/${slug}`;
    case 'service':
      return `/services/${slug}`;
    case 'project':
      return `/projects/${slug}`;
    case 'news':
      return `/news/${slug}`;
    case 'event':
      return `/events/${slug}`;
    default:
      return '/';
  }
}

export const PageBuilderLinkToolbar: React.FC<PageBuilderLinkToolbarProps> = ({
  target,
  section,
  entityOptions,
  onUpdateConfig,
  onClose,
}) => {
  const isVideo = target.mode === 'video';
  const currentVideoVal = String(valueAtPath(section.config, target.path) ?? target.initialUrl ?? '');
  const [videoDraft, setVideoDraft] = useState(currentVideoVal);

  const isDirectUrlField =
    !isVideo &&
    target.path.length > 0 &&
    String(target.path[target.path.length - 1]).toLowerCase().endsWith('url');

  const ctaIdPath = target.path;
  const labelPath = isDirectUrlField
    ? [...target.path.slice(0, -1), String(target.path[target.path.length - 1]).replace(/Url$/, 'Label')]
    : siblingPath(ctaIdPath, 'Label');
  const urlPath = isDirectUrlField ? target.path : siblingPath(ctaIdPath, 'Url');
  const newTabPath = isDirectUrlField
    ? [...target.path.slice(0, -1), String(target.path[target.path.length - 1]).replace(/Url$/, 'NewTab')]
    : siblingPath(ctaIdPath, 'NewTab');

  const currentCtaId = isDirectUrlField ? '' : String(valueAtPath(section.config, ctaIdPath) ?? '');
  const currentLabel = String(valueAtPath(section.config, labelPath) ?? target.fallbackLabel ?? '');
  const currentUrl = String(valueAtPath(section.config, urlPath) ?? '');
  const currentNewTab = Boolean(valueAtPath(section.config, newTabPath));

  const groupedEntities = useMemo(() => {
    const groups: Record<string, PageBuilderEntityOption[]> = {};
    for (const opt of entityOptions) {
      if (opt.entityType === 'partner') continue;
      if ((opt.status ?? 'published') !== 'published') continue;
      const list = groups[opt.entityType] ?? [];
      if (list.length < 25) {
        list.push(opt);
        groups[opt.entityType] = list;
      }
    }
    return groups;
  }, [entityOptions]);

  if (isVideo) {
    const validEmbedSrc = resolveAllowedVideoEmbedSrc(videoDraft);
    return (
      <div className="shrink-0 border-b border-orange-200 bg-orange-50/60 px-4 py-3 shadow-inner dark:border-orange-900/40 dark:bg-slate-900">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-orange-600 px-2.5 py-1.5 text-xs font-bold text-white">
              <Video className="h-3.5 w-3.5" />
              Đường dẫn Video (YouTube / Vimeo)
            </span>
            <input
              type="url"
              value={videoDraft}
              onChange={(e) => setVideoDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onUpdateConfig(section.id, target.path, videoDraft.trim());
                  onClose();
                }
              }}
              placeholder="https://www.youtube.com/watch?v=... hoặc https://youtu.be/..."
              className="min-w-[280px] flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
            {videoDraft.trim() && (
              <span
                className={`rounded-md px-2 py-1 text-[11px] font-bold ${
                  validEmbedSrc
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                    : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                }`}
              >
                {validEmbedSrc ? '✓ Link nhúng hợp lệ' : 'Kiểm tra lại định dạng YouTube/Vimeo'}
              </span>
            )}
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                onUpdateConfig(section.id, target.path, videoDraft.trim());
                onClose();
              }}
              className="rounded-xl bg-orange-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-orange-500 cursor-pointer"
            >
              Áp dụng Video
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 cursor-pointer"
              aria-label="Đóng thanh Video"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shrink-0 border-b border-orange-200 bg-orange-50/50 px-4 py-3 shadow-inner dark:border-orange-900/40 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl space-y-2.5">
        {/* Row 1: Quick Contact Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-orange-600 px-2.5 py-1 text-[11px] font-extrabold text-white">
              <Link2 className="h-3.5 w-3.5" />
              Gắn Link / Liên hệ nhanh
            </span>
            {QUICK_CONTACT_PRESETS.map((preset) => {
              const Icon = preset.icon;
              const active = currentUrl === preset.url;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    onUpdateConfig(section.id, urlPath, preset.url);
                    onUpdateConfig(section.id, newTabPath, preset.newTab);
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-bold transition cursor-pointer ${
                    active
                      ? 'border-orange-500 bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-200'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:bg-orange-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                  }`}
                >
                  <Icon className="h-3 w-3 text-orange-600" />
                  {preset.label}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
            Đóng
          </button>
        </div>

        {/* Row 2: Label, URL, Smart DB Destination Picker, System CTA & New Tab */}
        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-12">
          <label className="block md:col-span-3">
            <span className="mb-1 block text-[11px] font-bold text-slate-600 dark:text-slate-300">
              Chữ hiển thị trên nút (Label)
            </span>
            <input
              type="text"
              value={currentLabel}
              onChange={(e) => onUpdateConfig(section.id, labelPath, e.target.value)}
              placeholder="Ví dụ: Nhận tư vấn ngay"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </label>

          <label className="block md:col-span-4">
            <span className="mb-1 block text-[11px] font-bold text-slate-600 dark:text-slate-300">
              Đường dẫn đích (URL / tel: / mailto: / #anchor)
            </span>
            <input
              type="text"
              value={currentUrl}
              onChange={(e) => onUpdateConfig(section.id, urlPath, e.target.value)}
              placeholder="Nhập /products, tel:02439761381 hoặc chọn bên phải..."
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-mono text-xs text-slate-900 outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </label>

          <label className="block md:col-span-3">
            <span className="mb-1 block text-[11px] font-bold text-slate-600 dark:text-slate-300">
              Chọn nhanh trang / bài viết từ DB
            </span>
            <select
              value=""
              onChange={(e) => {
                if (!e.target.value) return;
                onUpdateConfig(section.id, urlPath, e.target.value);
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-800 outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 cursor-pointer"
            >
              <option value="">-- Chọn đích đến có sẵn --</option>
              <optgroup label="Trang chính của Website">
                {STATIC_ROUTE_OPTIONS.map((route) => (
                  <option key={route.value} value={route.value}>
                    {route.label}
                  </option>
                ))}
              </optgroup>
              {Object.entries(groupedEntities).map(([entityType, items]) => (
                <optgroup
                  key={entityType}
                  label={`${entityTypeLabels[entityType as keyof typeof entityTypeLabels] || entityType} (${items.length})`}
                >
                  {items.map((opt) => {
                    const url = entityPublicUrl(opt);
                    return (
                      <option key={`${entityType}-${opt.id}`} value={url}>
                        {opt.label} ({url})
                      </option>
                    );
                  })}
                </optgroup>
              ))}
            </select>
          </label>

          <div className="flex flex-col justify-between md:col-span-2">
            {!isDirectUrlField ? (
              <label className="block">
                <span className="mb-1 block text-[11px] font-bold text-slate-600 dark:text-slate-300">
                  CTA hệ thống
                </span>
                <select
                  value={currentCtaId}
                  onChange={(e) => onUpdateConfig(section.id, ctaIdPath, e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-800 outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 cursor-pointer"
                >
                  <option value="">-- Tuỳ chỉnh --</option>
                  {CTA_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Tuỳ chọn mở trang</span>
            )}
            <label className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={currentNewTab}
                onChange={(e) => onUpdateConfig(section.id, newTabPath, e.target.checked)}
                className="h-3.5 w-3.5 accent-orange-600"
              />
              <ExternalLink className="h-3 w-3 text-slate-400" />
              Mở tab mới
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
