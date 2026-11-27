import React, { useEffect, useMemo, useState } from 'react';
import {
  Check,
  ExternalLink,
  FileText,
  Globe,
  Link2,
  Mail,
  MessageCircle,
  Phone,
  Video,
  X,
} from 'lucide-react';
import type {
  PageBuilderConfigValue,
  PageBuilderEntityOption,
  PageBuilderSection,
} from '../pageBuilderTypes';
import { siblingPath, valueAtPath } from '../editor/editorUtils';
import { entityTypeLabels, sectionDefinitions } from '../pageBuilderRegistry';
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
  onUpdateConfig: (
    sectionId: string,
    path: Array<string | number>,
    value: PageBuilderConfigValue
  ) => void;
  onClose: () => void;
}

type LinkKind = 'url' | 'tel' | 'zalo' | 'mailto' | 'anchor';

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
  { label: 'Giới thiệu (/gioi-thieu)', value: '/gioi-thieu' },
  { label: 'Cơ cấu tổ chức (/gioi-thieu/co-cau-to-chuc)', value: '/gioi-thieu/co-cau-to-chuc' },
  {
    label: 'Năng lực & Kinh nghiệm (/gioi-thieu/nang-luc-kinh-nghiem)',
    value: '/gioi-thieu/nang-luc-kinh-nghiem',
  },
  { label: 'Sản phẩm & Giải pháp (/products)', value: '/products' },
  { label: 'Dịch vụ Tư vấn (/services)', value: '/services' },
  { label: 'Dự án tiêu biểu (/projects)', value: '/projects' },
  { label: 'Tin tức & Góc nhìn (/news)', value: '/news' },
  { label: 'Sự kiện & Hội thảo (/events)', value: '/events' },
  { label: 'Liên hệ (/lien-he)', value: '/lien-he' },
];

function detectLinkKind(href: string): LinkKind {
  const v = href.trim().toLowerCase();
  if (v.startsWith('tel:')) return 'tel';
  if (v.includes('zalo.me/')) return 'zalo';
  if (v.startsWith('mailto:')) return 'mailto';
  if (v.startsWith('#')) return 'anchor';
  return 'url';
}

function formatByKind(kind: LinkKind, raw: string): string {
  const clean = raw
    .trim()
    .replace(/^(tel:|mailto:)/i, '')
    .replace(/^https?:\/\/zalo\.me\//i, '');
  if (!clean) return '';
  switch (kind) {
    case 'tel':
      return `tel:${clean.replace(/\s+/g, '')}`;
    case 'zalo':
      return `https://zalo.me/${clean.replace(/\D+/g, '') || clean}`;
    case 'mailto':
      return `mailto:${clean}`;
    case 'anchor':
      return clean.startsWith('#') ? clean : `#${clean}`;
    default:
      return raw.trim();
  }
}

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

  const storedLabel = String(valueAtPath(section.config, labelPath) ?? target.fallbackLabel ?? '');
  const storedUrl = String(valueAtPath(section.config, urlPath) ?? '');
  const storedNewTab = Boolean(valueAtPath(section.config, newTabPath));

  const [labelDraft, setLabelDraft] = useState(storedLabel);
  const [urlDraft, setUrlDraft] = useState(storedUrl);
  const [linkKind, setLinkKind] = useState<LinkKind>(() => detectLinkKind(storedUrl));
  const [newTabDraft, setNewTabDraft] = useState(storedNewTab);

  useEffect(() => {
    setVideoDraft(currentVideoVal);
  }, [currentVideoVal]);

  useEffect(() => {
    setLabelDraft(storedLabel);
    setUrlDraft(storedUrl);
    setLinkKind(detectLinkKind(storedUrl));
    setNewTabDraft(storedNewTab);
  }, [storedLabel, storedUrl, storedNewTab, section.id, target.path]);

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

  const sectionLabel = sectionDefinitions[section.sectionKey]?.label ?? section.sectionKey;

  if (isVideo) {
    const validEmbedSrc = resolveAllowedVideoEmbedSrc(videoDraft);
    return (
      <div className="shrink-0 border-b border-orange-200 bg-orange-50/60 px-3.5 py-2 dark:border-orange-900/40 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-orange-600 px-2.5 py-1 text-[11px] font-extrabold text-white">
              <Video className="h-3.5 w-3.5" />
              Video YouTube / Vimeo ({sectionLabel})
            </span>
            <input
              id="pb-video-url"
              name="pbVideoUrl"
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
              className="h-8 min-w-[260px] flex-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-900 outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
            {videoDraft.trim() && (
              <span
                className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${
                  validEmbedSrc
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                }`}
              >
                {validEmbedSrc ? '✓ Link nhúng hợp lệ' : 'Kiểm tra lại link YouTube/Vimeo'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                onUpdateConfig(section.id, target.path, videoDraft.trim());
                onClose();
              }}
              className="inline-flex h-8 items-center gap-1 rounded-lg bg-orange-600 px-3 text-xs font-bold text-white hover:bg-orange-500 cursor-pointer"
            >
              <Check className="h-3.5 w-3.5" />
              Áp dụng Video
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 cursor-pointer"
              aria-label="Đóng thanh Video"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const applyCtaChanges = (nextUrl = urlDraft, nextLabel = labelDraft, nextNewTab = newTabDraft) => {
    const formattedUrl = formatByKind(linkKind, nextUrl);
    if (nextLabel.trim()) {
      onUpdateConfig(section.id, labelPath, nextLabel.trim());
    }
    onUpdateConfig(section.id, urlPath, formattedUrl);
    onUpdateConfig(section.id, newTabPath, nextNewTab);
  };

  return (
    <div className="shrink-0 border-b border-orange-200 bg-orange-50/60 px-3.5 py-2 dark:border-orange-900/40 dark:bg-slate-900">
      <div className="space-y-2">
        {/* Top Row: Selected Context + Quick Contact Presets + Close */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-md bg-orange-600 px-2 py-0.5 text-[11px] font-extrabold text-white">
              <Link2 className="h-3 w-3" />
              Đang chọn: {labelDraft || target.fallbackLabel || sectionLabel}
            </span>

            {QUICK_CONTACT_PRESETS.map((preset) => {
              const Icon = preset.icon;
              const active = urlDraft === preset.url;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    const detected = detectLinkKind(preset.url);
                    setLinkKind(detected);
                    setUrlDraft(preset.url);
                    setNewTabDraft(preset.newTab);
                    onUpdateConfig(section.id, urlPath, preset.url);
                    onUpdateConfig(section.id, newTabPath, preset.newTab);
                  }}
                  className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-bold transition cursor-pointer ${
                    active
                      ? 'border-orange-500 bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-200'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-orange-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
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
            className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
          >
            <X className="h-3 w-3" />
            Đóng
          </button>
        </div>

        {/* Bottom Single Compact Controls Row (like robot-web CmsLinkContactToolbar) */}
        <div className="flex flex-wrap items-center gap-2">
          <input
            id="pb-cta-label"
            name="pbCtaLabel"
            type="text"
            value={labelDraft}
            onChange={(e) => setLabelDraft(e.target.value)}
            placeholder="Chữ trên nút..."
            className="h-8 w-44 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />

          <select
            id="pb-link-kind"
            name="pbLinkKind"
            aria-label="Loại liên kết"
            value={linkKind}
            onChange={(e) => {
              const nextKind = e.target.value as LinkKind;
              setLinkKind(nextKind);
              setUrlDraft((curr) => formatByKind(nextKind, curr));
            }}
            className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs font-bold text-slate-700 outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 cursor-pointer"
          >
            <option value="url">Web / Nội bộ</option>
            <option value="tel">Điện thoại (tel:)</option>
            <option value="zalo">Zalo (zalo.me)</option>
            <option value="mailto">Email (mailto:)</option>
            <option value="anchor">Neo trang (#)</option>
          </select>

          <select
            id="pb-db-destination"
            name="pbDbDestination"
            aria-label="Chọn đích đến từ Database"
            value=""
            onChange={(e) => {
              if (!e.target.value) return;
              setLinkKind('url');
              setUrlDraft(e.target.value);
              onUpdateConfig(section.id, urlPath, e.target.value);
            }}
            className="h-8 max-w-[220px] rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium text-slate-700 outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 cursor-pointer"
          >
            <option value="">-- Chọn trang / bài viết DB --</option>
            <optgroup label="Trang chính">
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
                      {opt.label}
                    </option>
                  );
                })}
              </optgroup>
            ))}
          </select>

          <input
            id="pb-cta-url"
            name="pbCtaUrl"
            type="text"
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                applyCtaChanges();
                onClose();
              }
            }}
            placeholder={
              linkKind === 'tel'
                ? 'tel:02439761381'
                : linkKind === 'zalo'
                  ? 'https://zalo.me/0988000000'
                  : linkKind === 'mailto'
                    ? 'mailto:info@cic.com.vn'
                    : '/products hoặc https://...'
            }
            className="h-8 min-w-[200px] flex-1 rounded-lg border border-slate-200 bg-white px-2.5 font-mono text-xs text-slate-900 outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />

          <label className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 cursor-pointer">
            <input
              id="pb-cta-newtab"
              name="pbCtaNewTab"
              type="checkbox"
              checked={newTabDraft}
              onChange={(e) => setNewTabDraft(e.target.checked)}
              className="h-3.5 w-3.5 accent-orange-600"
            />
            <ExternalLink className="h-3 w-3 text-slate-400" />
            <span>Tab mới</span>
          </label>

          <button
            type="button"
            onClick={() => {
              applyCtaChanges();
              onClose();
            }}
            className="inline-flex h-8 items-center gap-1 rounded-lg bg-orange-600 px-3 text-xs font-extrabold text-white hover:bg-orange-500 cursor-pointer"
          >
            <Check className="h-3.5 w-3.5" />
            <span>Áp dụng link</span>
          </button>
        </div>
      </div>
    </div>
  );
};
