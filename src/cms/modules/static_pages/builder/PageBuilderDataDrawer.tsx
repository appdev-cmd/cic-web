import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Award,
  Check,
  Database,
  ExternalLink,
  Eye,
  EyeOff,
  GripVertical,
  Handshake,
  Image as ImageIcon,
  Layers,
  LayoutList,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import type { CmsMediaPickerItem } from '../../../data/MediaPickerDataSource';
import type {
  PageBuilderConfigValue,
  PageBuilderEntityOption,
  PageBuilderEntityType,
  PageBuilderPage,
  PageBuilderSection,
} from '../pageBuilderTypes';
import { entityTypeLabels, sectionDefinitions } from '../pageBuilderRegistry';
import { ConfigField } from '../editor/ConfigField';
import { findPageBuilderImage } from '../PageMediaPickerModal';

export type DataDrawerTab =
  | 'slides'
  | 'source:project'
  | 'source:event'
  | 'source:news'
  | 'sources'
  | 'awards'
  | 'partners'
  | 'ecosystem'
  | 'layout'
  | 'section';

interface PageBuilderDataDrawerProps {
  open: boolean;
  initialTab?: DataDrawerTab;
  page: PageBuilderPage;
  selectedSectionId: string;
  activeHeroSlide: number;
  issues: Record<string, string[]>;
  entityOptions: PageBuilderEntityOption[];
  mediaImages: CmsMediaPickerItem[];
  onClose: () => void;
  onSelectSection: (sectionId: string) => void;
  onActiveHeroSlideChange: (index: number) => void;
  onUpdateSectionConfig: (
    sectionId: string,
    path: Array<string | number>,
    value: PageBuilderConfigValue
  ) => void;
  onPickImage: (sectionId: string, path: Array<string | number>, currentId: string) => void;
  onUpdateReference: (sectionId: string, entityType: PageBuilderEntityType, ids: string[]) => void;
  onUpdateReferenceSource: (
    sectionId: string,
    entityType: PageBuilderEntityType,
    source: NonNullable<PageBuilderSection['references']>[number]['source']
  ) => void;
  onUpdateSectionStructure: (sectionId: string, action: 'toggle' | 'up' | 'down') => void;
}

const ENTITY_MODULE_LINKS: Record<PageBuilderEntityType, { label: string; href: string }> = {
  project: { label: 'Quản lý Dự án gốc', href: '/cms/projects' },
  event: { label: 'Quản lý Sự kiện gốc', href: '/cms/events' },
  news: { label: 'Quản lý Tin tức gốc', href: '/cms/news' },
  product: { label: 'Quản lý Sản phẩm gốc', href: '/cms/products' },
  service: { label: 'Quản lý Dịch vụ gốc', href: '/cms/services' },
  partner: { label: 'Quản lý Đối tác gốc', href: '/cms/products' },
};

const HIDDEN_CONFIG_KEYS = new Set(['_referenceSources', '_fieldStyles', '_visible']);

function resolvePreviewImageUrl(raw: string, mediaImages: CmsMediaPickerItem[]): string {
  if (!raw) return '';
  if (raw.startsWith('/') || raw.startsWith('http://') || raw.startsWith('https://')) return raw;
  const foundMedia = mediaImages.find((m) => m.id === raw || m.url === raw);
  if (foundMedia) return foundMedia.thumbnail_url || foundMedia.url;
  const legacy = findPageBuilderImage(raw);
  return legacy?.thumbnail_url || legacy?.url || raw;
}

export const PageBuilderDataDrawer: React.FC<PageBuilderDataDrawerProps> = ({
  open,
  initialTab,
  page,
  selectedSectionId,
  activeHeroSlide,
  issues,
  entityOptions,
  mediaImages,
  onClose,
  onSelectSection,
  onActiveHeroSlideChange,
  onUpdateSectionConfig,
  onPickImage,
  onUpdateReference,
  onUpdateReferenceSource,
  onUpdateSectionStructure,
}) => {
  const heroSection = page.draft.sections.find(
    (s) => s.sectionKey === 'home.hero' && Array.isArray(s.config.slides)
  );
  const awardsSection = page.draft.sections.find(
    (s) => s.sectionKey === 'home.awards' || s.sectionKey === 'about.awards'
  );
  const partnersSection = page.draft.sections.find(
    (s) => s.sectionKey === 'home.partners' || s.sectionKey === 'about.partners'
  );
  const ecosystemSection = page.draft.sections.find((s) => s.sectionKey === 'home.ecosystem');

  const referenceEntries = useMemo(() => {
    const entries: Array<{
      tabId: DataDrawerTab;
      section: PageBuilderSection;
      entityType: PageBuilderEntityType;
      tabLabel: string;
    }> = [];
    for (const sec of page.draft.sections) {
      const def = sectionDefinitions[sec.sectionKey];
      const types = Object.keys(def?.referenceLimit ?? {}) as PageBuilderEntityType[];
      for (const entityType of types) {
        if (!['project', 'event', 'news'].includes(entityType)) continue;
        const tabId = `source:${entityType}` as DataDrawerTab;
        entries.push({
          tabId,
          section: sec,
          entityType,
          tabLabel: `Nguồn ${entityTypeLabels[entityType]}`,
        });
      }
    }
    return entries;
  }, [page.draft.sections]);

  const availableTabs = useMemo(() => {
    const list: Array<{
      id: DataDrawerTab;
      label: string;
      badge?: number | string;
      icon: React.ComponentType<{ className?: string }>;
    }> = [];

    if (heroSection && Array.isArray(heroSection.config.slides)) {
      list.push({
        id: 'slides',
        label: 'Slide Banner',
        badge: heroSection.config.slides.length,
        icon: Layers,
      });
    }

    for (const entry of referenceEntries) {
      const ref = entry.section.references?.find((r) => r.entityType === entry.entityType);
      list.push({
        id: entry.tabId,
        label: entry.tabLabel,
        badge: ref?.entityIds.length ?? 0,
        icon: Database,
      });
    }

    if (ecosystemSection && Array.isArray(ecosystemSection.config.items)) {
      list.push({
        id: 'ecosystem',
        label: 'Hệ sinh thái',
        badge: ecosystemSection.config.items.length,
        icon: Sparkles,
      });
    }

    if (awardsSection) {
      const count = Array.isArray(awardsSection.config.items) ? awardsSection.config.items.length : 0;
      list.push({
        id: 'awards',
        label: 'Giải thưởng',
        badge: count,
        icon: Award,
      });
    }

    if (partnersSection) {
      const count = Array.isArray(partnersSection.config.items)
        ? partnersSection.config.items.length
        : 0;
      list.push({
        id: 'partners',
        label: 'Logo Đối tác',
        badge: count,
        icon: Handshake,
      });
    }

    list.push({
      id: 'layout',
      label: 'Ẩn/Hiện khu vực',
      badge: `${page.draft.sections.filter((s) => s.visible !== false).length}/${page.draft.sections.length}`,
      icon: LayoutList,
    });

    list.push({
      id: 'section',
      label: 'Chi tiết mục chọn',
      icon: SlidersHorizontal,
    });

    return list;
  }, [
    awardsSection,
    ecosystemSection,
    heroSection,
    page.draft.sections,
    partnersSection,
    referenceEntries,
  ]);

  const resolveSmartInitialTab = (): DataDrawerTab => {
    if (initialTab) {
      if (initialTab === 'sources' && referenceEntries[0]) return referenceEntries[0].tabId;
      if (availableTabs.some((t) => t.id === initialTab)) return initialTab;
    }
    const sec = page.draft.sections.find((s) => s.id === selectedSectionId);
    if (sec?.sectionKey === 'home.hero' && availableTabs.some((t) => t.id === 'slides')) return 'slides';
    if (sec?.sectionKey === 'home.projects' && availableTabs.some((t) => t.id === 'source:project'))
      return 'source:project';
    if (sec?.sectionKey === 'home.events' && availableTabs.some((t) => t.id === 'source:event'))
      return 'source:event';
    if (sec?.sectionKey === 'home.news' && availableTabs.some((t) => t.id === 'source:news'))
      return 'source:news';
    if (sec?.sectionKey?.endsWith('.awards') && availableTabs.some((t) => t.id === 'awards'))
      return 'awards';
    if (sec?.sectionKey?.endsWith('.partners') && availableTabs.some((t) => t.id === 'partners'))
      return 'partners';
    if (sec?.sectionKey === 'home.ecosystem' && availableTabs.some((t) => t.id === 'ecosystem'))
      return 'ecosystem';
    return availableTabs[0]?.id ?? 'layout';
  };

  const [activeTab, setActiveTab] = useState<DataDrawerTab>(resolveSmartInitialTab);
  const [sourceSearch, setSourceSearch] = useState<Record<string, string>>({});
  const [draggedRankIndex, setDraggedRankIndex] = useState<number | null>(null);

  useEffect(() => {
    if (open) {
      setActiveTab(resolveSmartInitialTab());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialTab, selectedSectionId]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const selectedSection =
    page.draft.sections.find((s) => s.id === selectedSectionId) ?? page.draft.sections[0];
  const activeRefEntry = referenceEntries.find((e) => e.tabId === activeTab);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/55 p-3 sm:p-5 backdrop-blur-[2px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Quản lý Slide Banner, Nguồn dữ liệu DB và Bố cục trang"
    >
      <div
        className="flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header (Matching robot-web CmsPageDataDrawer) */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-extrabold text-slate-950 dark:text-white">
              Quản lý Dữ liệu Trang & Chọn nguồn hiển thị — {page.name}
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Thay đổi được cập nhật tức thì trên khung giao diện bên dưới. Nhấn <strong>Lưu nháp</strong> hoặc <strong>Xuất bản</strong> khi hoàn tất.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
            <span>Đóng</span>
          </button>
        </div>

        {/* Clean Horizontal Tab Pills */}
        <div className="flex gap-1.5 overflow-x-auto border-b border-slate-200 bg-slate-50/90 px-4 py-2 dark:border-slate-800 dark:bg-slate-950/60">
          {availableTabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                  active
                    ? 'bg-orange-600 text-white shadow-2xs'
                    : 'border border-slate-200 bg-white text-slate-600 hover:border-orange-300 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-extrabold ${
                      active
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {/* 1. VISUAL 3-COLUMN HERO SLIDES EDITOR (Matching robot-web) */}
          {activeTab === 'slides' && heroSection && Array.isArray(heroSection.config.slides) && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Danh sách Slide mở đầu ({heroSection.config.slides.length} Slide)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Nhấp vào từng Slide để xem ngay trên Canvas, đổi ảnh nền hoặc sửa tiêu đề / mô tả.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const nextSlides = [
                      ...(heroSection.config.slides as any[]),
                      {
                        title: 'Slide mới — Giải pháp số CIC',
                        subtitle: 'Nhập thông điệp mô tả ngắn gọn cho slide.',
                        backgroundImageId: '/banner_hero/doi_tac_cong_nghe_chien_luoc.png',
                      },
                    ];
                    onUpdateSectionConfig(heroSection.id, ['slides'], nextSlides);
                    onActiveHeroSlideChange(nextSlides.length - 1);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-orange-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-orange-500 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Thêm Slide mới
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                {(heroSection.config.slides as Array<Record<string, any>>).map((slide, idx) => {
                  const slidesArr = heroSection.config.slides as Array<Record<string, any>>;
                  const rawImg = String(
                    slide?.backgroundImageId || slide?.img || slide?.image || ''
                  );
                  const imgSrc =
                    resolvePreviewImageUrl(rawImg, mediaImages) ||
                    '/banner_hero/doi_tac_cong_nghe_chien_luoc.png';
                  const isActiveSlide = activeHeroSlide === idx;

                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        onSelectSection(heroSection.id);
                        onActiveHeroSlideChange(idx);
                      }}
                      className={`flex flex-col overflow-hidden rounded-xl border bg-white transition dark:bg-slate-950 cursor-pointer ${
                        isActiveSlide
                          ? 'border-orange-500 ring-2 ring-orange-500/20'
                          : 'border-slate-200 hover:border-orange-300 dark:border-slate-800'
                      }`}
                    >
                      <div className="group relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                        <img
                          src={imgSrc}
                          alt={`Slide ${idx + 1}`}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-slate-950/30" />
                        <span
                          className={`absolute left-2.5 top-2.5 rounded-md px-2 py-0.5 text-[10px] font-extrabold text-white ${
                            isActiveSlide ? 'bg-orange-600' : 'bg-slate-900/80'
                          }`}
                        >
                          Slide {idx + 1} {isActiveSlide ? '• Đang xem' : ''}
                        </span>

                        <div className="absolute right-2 top-2 flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={(e) => {
                              e.stopPropagation();
                              const next = [...slidesArr];
                              [next[idx - 1], next[idx]] = [next[idx]!, next[idx - 1]!];
                              onUpdateSectionConfig(heroSection.id, ['slides'], next);
                              onActiveHeroSlideChange(idx - 1);
                            }}
                            className="rounded bg-slate-900/75 p-1 text-white hover:bg-orange-600 disabled:opacity-30 cursor-pointer"
                            title="Đưa lên trước"
                          >
                            <ArrowUp className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === slidesArr.length - 1}
                            onClick={(e) => {
                              e.stopPropagation();
                              const next = [...slidesArr];
                              [next[idx + 1], next[idx]] = [next[idx]!, next[idx + 1]!];
                              onUpdateSectionConfig(heroSection.id, ['slides'], next);
                              onActiveHeroSlideChange(idx + 1);
                            }}
                            className="rounded bg-slate-900/75 p-1 text-white hover:bg-orange-600 disabled:opacity-30 cursor-pointer"
                            title="Đưa ra sau"
                          >
                            <ArrowDown className="h-3 w-3" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onPickImage(
                              heroSection.id,
                              ['slides', idx, 'backgroundImageId'],
                              rawImg
                            );
                          }}
                          className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 rounded-lg bg-white/95 px-2.5 py-1 text-[11px] font-bold text-slate-900 shadow-md hover:bg-orange-600 hover:text-white cursor-pointer"
                        >
                          <ImageIcon className="h-3 w-3" />
                          Đổi ảnh Slide {idx + 1}
                        </button>
                      </div>

                      <div className="flex flex-1 flex-col gap-2 p-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={String(slide?.title ?? '').replace(/<[^>]*>/g, '')}
                          onChange={(e) =>
                            onUpdateSectionConfig(
                              heroSection.id,
                              ['slides', idx, 'title'],
                              e.target.value
                            )
                          }
                          placeholder="Tiêu đề chính Slide..."
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-900 outline-none focus:border-orange-500 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                        />
                        <textarea
                          rows={2}
                          value={String(slide?.subtitle ?? slide?.sub ?? '').replace(/<[^>]*>/g, '')}
                          onChange={(e) =>
                            onUpdateSectionConfig(
                              heroSection.id,
                              ['slides', idx, 'subtitle'],
                              e.target.value
                            )
                          }
                          placeholder="Mô tả phụ..."
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-orange-500 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                        />
                        <div className="mt-auto flex justify-end pt-1">
                          <button
                            type="button"
                            disabled={slidesArr.length <= 1}
                            onClick={() => {
                              const next = slidesArr.filter((_, i) => i !== idx);
                              onUpdateSectionConfig(heroSection.id, ['slides'], next);
                              onActiveHeroSlideChange(Math.max(0, Math.min(activeHeroSlide, next.length - 1)));
                            }}
                            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-30 dark:hover:bg-rose-950/40 cursor-pointer"
                          >
                            <Trash2 className="h-3 w-3" />
                            Xóa Slide
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Hot News Ticker Quick Editor */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100">
                    Dòng chữ chạy Tin nóng (HOT NEWS dưới chân Hero)
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const curr = Array.isArray(heroSection.config.tickerItems)
                        ? [...heroSection.config.tickerItems]
                        : [];
                      curr.push('Thông báo tin tức nổi bật mới của CIC');
                      onUpdateSectionConfig(heroSection.id, ['tickerItems'], curr);
                    }}
                    className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-[11px] font-bold text-orange-700 ring-1 ring-slate-200 hover:bg-orange-50 dark:bg-slate-900 dark:text-orange-300 dark:ring-slate-700 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    Thêm tin chạy
                  </button>
                </div>
                <div className="space-y-1.5">
                  {(Array.isArray(heroSection.config.tickerItems)
                    ? heroSection.config.tickerItems
                    : []
                  ).map((txt, tIdx, arr) => (
                    <div key={tIdx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={String(txt)}
                        onChange={(e) => {
                          const next = [...arr];
                          next[tIdx] = e.target.value;
                          onUpdateSectionConfig(heroSection.id, ['tickerItems'], next);
                        }}
                        className="flex-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const next = arr.filter((_, i) => i !== tIdx);
                          onUpdateSectionConfig(heroSection.id, ['tickerItems'], next);
                        }}
                        className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. INLINE SOURCE SECTION (Exact robot-web UX: 2-col Mode Toggle + Pill Counts + 2-Col Checkbox Grid with Ranked Top Items) */}
          {activeRefEntry && (() => {
            const { section: sec, entityType } = activeRefEntry;
            const def = sectionDefinitions[sec.sectionKey];
            const defaultMax = def?.referenceLimit?.[entityType] ?? 4;
            const ref = sec.references?.find((r) => r.entityType === entityType) ?? {
              entityType,
              entityIds: [],
            };
            const source = ref.source ?? { mode: 'featured' as const, limit: defaultMax };
            const isFeatured = source.mode !== 'manual';
            const limit = source.limit || defaultMax;
            const cardKey = `${sec.id}:${entityType}`;
            const searchQ = (sourceSearch[cardKey] ?? '').trim().toLowerCase();
            const moduleInfo = ENTITY_MODULE_LINKS[entityType];

            const allPublishedOptions = entityOptions.filter(
              (opt) => opt.entityType === entityType && (opt.status ?? 'published') === 'published'
            );

            const switchToFeatured = (nextLimit = limit) => {
              const featured = allPublishedOptions
                .filter((opt) => Boolean((opt.meta as Record<string, unknown> | undefined)?.isFeatured))
                .slice(0, nextLimit);
              const fallback = allPublishedOptions.slice(0, nextLimit);
              const autoIds = (featured.length > 0 ? featured : fallback).map((i) => i.id);
              onUpdateReferenceSource(sec.id, entityType, { mode: 'featured', limit: nextLimit });
              if (autoIds.length > 0) {
                onUpdateReference(sec.id, entityType, autoIds);
              }
            };

            const switchToManual = () => {
              onUpdateReferenceSource(sec.id, entityType, { mode: 'manual', limit });
            };

            const toggleCheckedId = (id: string) => {
              if (ref.entityIds.includes(id)) {
                onUpdateReference(
                  sec.id,
                  entityType,
                  ref.entityIds.filter((item) => item !== id)
                );
              } else {
                const nextIds =
                  ref.entityIds.length >= limit
                    ? [...ref.entityIds.slice(0, limit - 1), id]
                    : [...ref.entityIds, id];
                onUpdateReference(sec.id, entityType, nextIds);
              }
            };

            const moveSelected = (fromIdx: number, toIdx: number) => {
              if (toIdx < 0 || toIdx >= ref.entityIds.length || fromIdx === toIdx) return;
              const next = [...ref.entityIds];
              const [moved] = next.splice(fromIdx, 1);
              next.splice(toIdx, 0, moved!);
              onUpdateReference(sec.id, entityType, next);
            };

            // Sort checked items first (in exact #1, #2, #3 rank order!), followed by unchecked items matching search
            const selectedSet = new Set(ref.entityIds);
            const rankedSelectedOptions: PageBuilderEntityOption[] = ref.entityIds
              .map((id): PageBuilderEntityOption => {
                const found = allPublishedOptions.find((o) => o.id === id);
                return found ?? { id, entityType, label: `Mục #${id}`, description: '', status: 'published' };
              })
              .filter(
                (opt) =>
                  !searchQ ||
                  opt.label.toLowerCase().includes(searchQ) ||
                  (opt.description || opt.meta?.summary || '').toLowerCase().includes(searchQ)
              );

            const unselectedOptions = allPublishedOptions
              .filter((opt) => !selectedSet.has(opt.id))
              .filter(
                (opt) =>
                  !searchQ ||
                  opt.label.toLowerCase().includes(searchQ) ||
                  (opt.description || opt.meta?.summary || '').toLowerCase().includes(searchQ)
              );

            return (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {def?.label ?? sec.sectionKey} — Chọn nguồn {entityTypeLabels[entityType]}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Đang hiển thị <strong>{ref.entityIds.length}</strong> / tối đa <strong>{limit}</strong>{' '}
                      {entityTypeLabels[entityType].toLowerCase()} từ Database thật.
                    </p>
                  </div>

                  <a
                    href={moduleInfo.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-orange-300 hover:text-orange-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <span>{moduleInfo.label}</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>

                {/* 2-Column Mode Segmented Cards (Exact robot-web style) */}
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => switchToFeatured(limit)}
                    className={`flex items-start gap-3 rounded-xl border p-3.5 text-left transition cursor-pointer ${
                      isFeatured
                        ? 'border-orange-500 bg-orange-50/70 ring-2 ring-orange-500/15 dark:border-orange-500 dark:bg-orange-950/30'
                        : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950'
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                        isFeatured
                          ? 'bg-orange-600 text-white'
                          : 'border border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-800'
                      }`}
                    >
                      {isFeatured && <Check className="h-3 w-3" />}
                    </span>
                    <div>
                      <p className="text-xs font-extrabold text-slate-900 dark:text-white">
                        Tự động lấy Nổi bật ({limit} mục)
                      </p>
                      <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                        Tự động đồng bộ các {entityTypeLabels[entityType].toLowerCase()} mới nhất đánh dấu Featured.
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={switchToManual}
                    className={`flex items-start gap-3 rounded-xl border p-3.5 text-left transition cursor-pointer ${
                      !isFeatured
                        ? 'border-orange-500 bg-orange-50/70 ring-2 ring-orange-500/15 dark:border-orange-500 dark:bg-orange-950/30'
                        : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950'
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                        !isFeatured
                          ? 'bg-orange-600 text-white'
                          : 'border border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-800'
                      }`}
                    >
                      {!isFeatured && <Check className="h-3 w-3" />}
                    </span>
                    <div>
                      <p className="text-xs font-extrabold text-slate-900 dark:text-white">
                        Chọn thủ công từ Database ({ref.entityIds.length} đã chọn)
                      </p>
                      <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                        Tích chọn từng bài và kéo thả sắp xếp thứ tự ưu tiên #1, #2, #3.
                      </p>
                    </div>
                  </button>
                </div>

                {/* Count Pill Selector */}
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 dark:border-slate-800 dark:bg-slate-800/50">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    Số lượng hiển thị tối đa trên trang:
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[2, 3, 4, 6, 8, 12].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => {
                          if (isFeatured) {
                            switchToFeatured(n);
                          } else {
                            onUpdateReferenceSource(sec.id, entityType, { mode: 'manual', limit: n });
                            if (ref.entityIds.length > n) {
                              onUpdateReference(sec.id, entityType, ref.entityIds.slice(0, n));
                            }
                          }
                        }}
                        className={`rounded-lg px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                          limit === n
                            ? 'bg-orange-600 text-white shadow-2xs'
                            : 'border border-slate-200 bg-white text-slate-600 hover:border-orange-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                        }`}
                      >
                        {n} mục
                      </button>
                    ))}
                  </div>
                </div>

                {/* Items Preview (Auto Mode) OR 2-Column Search + Ranked Checkbox Grid (Manual Mode) */}
                {isFeatured ? (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      Các mục đang tự động hiển thị ({rankedSelectedOptions.length} mục):
                    </p>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {rankedSelectedOptions.map((item, idx) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs dark:border-slate-800 dark:bg-slate-900"
                        >
                          <span className="flex h-5 w-6 shrink-0 items-center justify-center rounded bg-orange-100 font-mono text-[10px] font-extrabold text-orange-800 dark:bg-orange-950/60 dark:text-orange-300">
                            #{idx + 1}
                          </span>
                          <span className="truncate font-semibold text-slate-800 dark:text-slate-100">
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                      <input
                        type="search"
                        value={sourceSearch[cardKey] ?? ''}
                        onChange={(e) =>
                          setSourceSearch((curr) => ({ ...curr, [cardKey]: e.target.value }))
                        }
                        placeholder={`Tìm nhanh ${entityTypeLabels[entityType].toLowerCase()} trong Database (${allPublishedOptions.length} bản ghi)...`}
                        className="h-9 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs font-medium outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950"
                      />
                    </div>

                    <div className="grid max-h-80 grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                      {/* Checked items first with #1, #2, #3 rank + drag & drop */}
                      {rankedSelectedOptions.map((opt) => {
                        const rankIdx = ref.entityIds.indexOf(opt.id);
                        return (
                          <div
                            key={`sel-${opt.id}`}
                            draggable
                            onDragStart={() => setDraggedRankIndex(rankIdx)}
                            onDragOver={(e) => {
                              if (draggedRankIndex !== null) e.preventDefault();
                            }}
                            onDrop={() => {
                              if (draggedRankIndex !== null) {
                                moveSelected(draggedRankIndex, rankIdx);
                              }
                              setDraggedRankIndex(null);
                            }}
                            onDragEnd={() => setDraggedRankIndex(null)}
                            className="flex items-center justify-between gap-2 rounded-xl border border-orange-400 bg-orange-50/50 px-3 py-2 text-xs shadow-2xs dark:border-orange-700 dark:bg-orange-950/25 cursor-grab active:cursor-grabbing"
                          >
                            <label className="flex min-w-0 flex-1 items-center gap-2 cursor-pointer">
                              <GripVertical className="h-3.5 w-3.5 shrink-0 text-orange-400" />
                              <input
                                type="checkbox"
                                checked
                                onChange={() => toggleCheckedId(opt.id)}
                                className="h-4 w-4 shrink-0 rounded accent-orange-600 cursor-pointer"
                              />
                              <span className="rounded bg-orange-600 px-1.5 py-0.5 font-mono text-[10px] font-extrabold text-white">
                                #{rankIdx + 1}
                              </span>
                              <span className="truncate font-bold text-slate-900 dark:text-white">
                                {opt.label}
                              </span>
                            </label>

                            <div className="flex shrink-0 items-center gap-0.5">
                              <button
                                type="button"
                                disabled={rankIdx <= 0}
                                onClick={() => moveSelected(rankIdx, rankIdx - 1)}
                                className="rounded p-1 text-slate-500 hover:bg-white disabled:opacity-30 dark:hover:bg-slate-800 cursor-pointer"
                                title="Tăng hạng"
                              >
                                <ArrowUp className="h-3 w-3" />
                              </button>
                              <button
                                type="button"
                                disabled={rankIdx >= ref.entityIds.length - 1}
                                onClick={() => moveSelected(rankIdx, rankIdx + 1)}
                                className="rounded p-1 text-slate-500 hover:bg-white disabled:opacity-30 dark:hover:bg-slate-800 cursor-pointer"
                                title="Giảm hạng"
                              >
                                <ArrowDown className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      {/* Unchecked items */}
                      {unselectedOptions.map((opt) => (
                        <label
                          key={`unsel-${opt.id}`}
                          className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs transition hover:border-orange-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={false}
                            onChange={() => toggleCheckedId(opt.id)}
                            className="h-4 w-4 shrink-0 rounded accent-orange-600 cursor-pointer"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold text-slate-800 dark:text-slate-200">
                              {opt.label}
                            </p>
                            {(opt.description || opt.meta?.summary) && (
                              <p className="truncate text-[10px] text-slate-400">
                                {opt.description || String(opt.meta?.summary ?? '')}
                              </p>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* 3. VISUAL ECOSYSTEM CARDS GRID */}
          {activeTab === 'ecosystem' && ecosystemSection && Array.isArray(ecosystemSection.config.items) && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Hệ sinh thái công nghệ ({ecosystemSection.config.items.length} giải pháp)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Sửa nhanh ảnh minh họa, nhãn, tiêu đề và mô tả từng thẻ giải pháp.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = [
                      ...(ecosystemSection.config.items as any[]),
                      {
                        id: `eco_${Date.now()}`,
                        badge: 'Giải pháp số',
                        title: 'Giải pháp công nghệ mới',
                        description: 'Mô tả ngắn gọn giá trị cốt lõi của giải pháp.',
                        imageId: '/banner_hero/He_sinh_thai_giai_phap_so.png',
                        link: '/products',
                      },
                    ];
                    onUpdateSectionConfig(ecosystemSection.id, ['items'], next);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-orange-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-orange-500 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Thêm giải pháp
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {(ecosystemSection.config.items as Array<Record<string, any>>).map((item, idx, arr) => {
                  const rawImg = String(item?.imageId || item?.image || '');
                  const imgSrc =
                    resolvePreviewImageUrl(rawImg, mediaImages) ||
                    '/banner_hero/He_sinh_thai_giai_phap_so.png';
                  return (
                    <div
                      key={item?.id ?? idx}
                      className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-950"
                    >
                      <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-lg bg-slate-900">
                        <img src={imgSrc} alt="" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() =>
                            onPickImage(ecosystemSection.id, ['items', idx, 'imageId'], rawImg)
                          }
                          className="absolute inset-x-1.5 bottom-1.5 rounded bg-white/95 py-1 text-[10px] font-extrabold text-slate-900 shadow hover:bg-orange-600 hover:text-white cursor-pointer"
                        >
                          Đổi ảnh
                        </button>
                      </div>
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={String(item?.badge ?? '')}
                            onChange={(e) =>
                              onUpdateSectionConfig(
                                ecosystemSection.id,
                                ['items', idx, 'badge'],
                                e.target.value
                              )
                            }
                            placeholder="Nhãn..."
                            className="w-28 rounded border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-orange-700 outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-900"
                          />
                          <input
                            type="text"
                            value={String(item?.title ?? '')}
                            onChange={(e) =>
                              onUpdateSectionConfig(
                                ecosystemSection.id,
                                ['items', idx, 'title'],
                                e.target.value
                              )
                            }
                            placeholder="Tên giải pháp..."
                            className="min-w-0 flex-1 rounded border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-slate-900 outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const next = arr.filter((_, i) => i !== idx);
                              onUpdateSectionConfig(ecosystemSection.id, ['items'], next);
                            }}
                            className="rounded p-1 text-rose-500 hover:bg-rose-50 cursor-pointer"
                            title="Xóa"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <textarea
                          rows={2}
                          value={String(item?.description ?? item?.desc ?? '')}
                          onChange={(e) =>
                            onUpdateSectionConfig(
                              ecosystemSection.id,
                              ['items', idx, 'description'],
                              e.target.value
                            )
                          }
                          className="w-full rounded border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-600 outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. VISUAL 3-COLUMN AWARDS EDITOR (Matching robot-web CmsAwardsEditor) */}
          {activeTab === 'awards' && awardsSection && (
            <div className="space-y-4">
              {awardsSection.sectionKey === 'about.awards' && (
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-orange-200 bg-orange-50/60 px-3.5 py-2.5 text-xs dark:border-orange-900/40 dark:bg-slate-800">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {awardsSection.config.syncWithHome !== false
                      ? 'Đang tự động đồng bộ danh sách Giải thưởng từ Trang chủ.'
                      : 'Đang sử dụng danh sách Giải thưởng riêng cho trang Giới thiệu.'}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateSectionConfig(
                        awardsSection.id,
                        ['syncWithHome'],
                        awardsSection.config.syncWithHome === false
                      )
                    }
                    className="rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-orange-700 ring-1 ring-orange-300 hover:bg-orange-100 cursor-pointer"
                  >
                    {awardsSection.config.syncWithHome !== false
                      ? 'Chuyển sang chỉnh riêng'
                      : 'Đồng bộ theo Trang chủ'}
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Danh sách Giải thưởng ({Array.isArray(awardsSection.config.items) ? awardsSection.config.items.length : 0})
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    const curr = Array.isArray(awardsSection.config.items)
                      ? [...awardsSection.config.items]
                      : [];
                    curr.push({ name: 'Giải thưởng mới', imageId: '', img: '' });
                    if (awardsSection.sectionKey === 'about.awards') {
                      onUpdateSectionConfig(awardsSection.id, ['syncWithHome'], false);
                    }
                    onUpdateSectionConfig(awardsSection.id, ['items'], curr);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-orange-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-orange-500 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Thêm Giải thưởng
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {(Array.isArray(awardsSection.config.items)
                  ? (awardsSection.config.items as Array<Record<string, any>>)
                  : []
                ).map((item, idx, arr) => {
                  const rawImg = String(item?.img || item?.imageId || '');
                  const imgSrc = resolvePreviewImageUrl(rawImg, mediaImages);
                  return (
                    <div
                      key={idx}
                      className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-950"
                    >
                      <div className="relative flex h-28 items-center justify-center overflow-hidden rounded-lg border border-slate-200/80 bg-white p-2 dark:border-slate-800 dark:bg-slate-900">
                        {imgSrc ? (
                          <img src={imgSrc} alt="" className="max-h-full max-w-full object-contain" />
                        ) : (
                          <Award className="h-8 w-8 text-slate-300" />
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            onPickImage(awardsSection.id, ['items', idx, 'imageId'], rawImg)
                          }
                          className="absolute bottom-1.5 right-1.5 rounded-md bg-slate-900/85 px-2 py-1 text-[10px] font-bold text-white hover:bg-orange-600 cursor-pointer"
                        >
                          Đổi ảnh
                        </button>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={String(item?.name ?? '')}
                          onChange={(e) =>
                            onUpdateSectionConfig(
                              awardsSection.id,
                              ['items', idx, 'name'],
                              e.target.value
                            )
                          }
                          placeholder="Tên giải thưởng..."
                          className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-800 outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const next = arr.filter((_, i) => i !== idx);
                            onUpdateSectionConfig(awardsSection.id, ['items'], next);
                          }}
                          className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 cursor-pointer"
                          title="Xóa giải thưởng"
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

          {/* 5. VISUAL 4-COLUMN PARTNER LOGOS EDITOR (Matching robot-web CmsPartnersEditor) */}
          {activeTab === 'partners' && partnersSection && (
            <div className="space-y-4">
              {partnersSection.sectionKey === 'about.partners' && (
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-orange-200 bg-orange-50/60 px-3.5 py-2.5 text-xs dark:border-orange-900/40 dark:bg-slate-800">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {partnersSection.config.syncWithHome !== false
                      ? 'Đang tự động đồng bộ Logo đối tác từ Trang chủ.'
                      : 'Đang sử dụng danh sách Logo đối tác riêng cho trang Giới thiệu.'}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateSectionConfig(
                        partnersSection.id,
                        ['syncWithHome'],
                        partnersSection.config.syncWithHome === false
                      )
                    }
                    className="rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-orange-700 ring-1 ring-orange-300 hover:bg-orange-100 cursor-pointer"
                  >
                    {partnersSection.config.syncWithHome !== false
                      ? 'Chuyển sang chỉnh riêng'
                      : 'Đồng bộ theo Trang chủ'}
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Logo Đối tác chiến lược ({Array.isArray(partnersSection.config.items) ? partnersSection.config.items.length : 0})
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    const curr = Array.isArray(partnersSection.config.items)
                      ? [...partnersSection.config.items]
                      : [];
                    curr.push({
                      id: `partner_${Date.now()}`,
                      name: 'Đối tác mới',
                      imageId: '',
                      logo: '',
                    });
                    if (partnersSection.sectionKey === 'about.partners') {
                      onUpdateSectionConfig(partnersSection.id, ['syncWithHome'], false);
                    }
                    onUpdateSectionConfig(partnersSection.id, ['items'], curr);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-orange-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-orange-500 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Thêm Logo đối tác
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {(Array.isArray(partnersSection.config.items)
                  ? (partnersSection.config.items as Array<Record<string, any>>)
                  : []
                ).map((item, idx, arr) => {
                  const rawLogo = String(item?.logo || item?.imageId || '');
                  const logoSrc = resolvePreviewImageUrl(rawLogo, mediaImages);
                  return (
                    <div
                      key={item?.id ?? idx}
                      className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50/60 p-2.5 dark:border-slate-800 dark:bg-slate-950"
                    >
                      <div className="relative flex h-20 items-center justify-center overflow-hidden rounded-lg border border-slate-200/80 bg-white p-2 dark:border-slate-800 dark:bg-slate-900">
                        {logoSrc ? (
                          <img src={logoSrc} alt="" className="max-h-full max-w-full object-contain" />
                        ) : (
                          <span className="text-[11px] font-bold text-slate-400">Chưa có Logo</span>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            onPickImage(partnersSection.id, ['items', idx, 'imageId'], rawLogo)
                          }
                          className="absolute bottom-1 right-1 rounded bg-slate-900/85 px-1.5 py-0.5 text-[10px] font-bold text-white hover:bg-orange-600 cursor-pointer"
                        >
                          Đổi Logo
                        </button>
                      </div>
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={String(item?.name ?? '')}
                          onChange={(e) =>
                            onUpdateSectionConfig(
                              partnersSection.id,
                              ['items', idx, 'name'],
                              e.target.value
                            )
                          }
                          placeholder="Tên hãng..."
                          className="min-w-0 flex-1 rounded border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-800 outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const next = arr.filter((_, i) => i !== idx);
                            onUpdateSectionConfig(partnersSection.id, ['items'], next);
                          }}
                          className="rounded p-1 text-rose-500 hover:bg-rose-50 cursor-pointer"
                          title="Xóa"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 6. SECTION VISIBILITY & ORDERING */}
          {activeTab === 'layout' && (
            <div className="space-y-2">
              <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
                Bật/tắt hiển thị từng khu vực hoặc đổi thứ tự xuất hiện trên trang. Nhấp vào tên khu vực để cuộn nhanh tới khu vực đó.
              </p>
              {page.draft.sections.map((sec, idx) => {
                const def = sectionDefinitions[sec.sectionKey] ?? {
                  label: sec.sectionKey,
                  description: '',
                };
                const isSelected = sec.id === selectedSection?.id;
                const isVisible = sec.visible !== false;
                const hasIssue = Boolean(issues[sec.id]?.length);

                return (
                  <div
                    key={sec.id}
                    className={`flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 transition ${
                      isSelected
                        ? 'border-orange-400 bg-orange-50/40 dark:border-orange-700 dark:bg-orange-950/20'
                        : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        onSelectSection(sec.id);
                        onClose();
                      }}
                      className="flex min-w-0 flex-1 items-center gap-3 text-left cursor-pointer"
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-extrabold ${
                          isSelected
                            ? 'bg-orange-600 text-white'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {sec.position}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`truncate text-xs font-bold ${
                              isVisible
                                ? 'text-slate-900 dark:text-white'
                                : 'line-through text-slate-400'
                            }`}
                          >
                            {def.label}
                          </span>
                          {!isVisible && (
                            <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                              Đang ẩn
                            </span>
                          )}
                          {hasIssue && (
                            <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-700">
                              Cần kiểm tra
                            </span>
                          )}
                        </div>
                        <p className="truncate text-[11px] text-slate-500">{def.description}</p>
                      </div>
                    </button>

                    <div className="flex shrink-0 items-center gap-1">
                      {def.canHide && (
                        <button
                          type="button"
                          onClick={() => onUpdateSectionStructure(sec.id, 'toggle')}
                          className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-bold cursor-pointer ${
                            isVisible
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300'
                              : 'border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                        >
                          {isVisible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                          <span>{isVisible ? 'Đang hiện' : 'Đang ẩn'}</span>
                        </button>
                      )}
                      {def.canMove && (
                        <>
                          <button
                            type="button"
                            disabled={
                              idx === 0 ||
                              !sectionDefinitions[page.draft.sections[idx - 1]?.sectionKey ?? '']
                                ?.canMove
                            }
                            onClick={() => onUpdateSectionStructure(sec.id, 'up')}
                            className="rounded-lg border border-slate-200 p-1 text-slate-600 hover:bg-slate-100 disabled:opacity-30 dark:border-slate-700 dark:text-slate-300 cursor-pointer"
                            title="Di chuyển lên"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={
                              idx === page.draft.sections.length - 1 ||
                              !sectionDefinitions[page.draft.sections[idx + 1]?.sectionKey ?? '']
                                ?.canMove
                            }
                            onClick={() => onUpdateSectionStructure(sec.id, 'down')}
                            className="rounded-lg border border-slate-200 p-1 text-slate-600 hover:bg-slate-100 disabled:opacity-30 dark:border-slate-700 dark:text-slate-300 cursor-pointer"
                            title="Di chuyển xuống"
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 7. SELECTED SECTION STRUCTURED FORM (For Timeline, Strategy, Offerings, Capacity, etc.) */}
          {activeTab === 'section' && selectedSection && (
            <div className="space-y-4">
              <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-800/50">
                <div className="min-w-0">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-600">
                    Khu vực đang chọn
                  </span>
                  <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                    #{selectedSection.position} ·{' '}
                    {sectionDefinitions[selectedSection.sectionKey]?.label ??
                      selectedSection.sectionKey}
                  </p>
                </div>
                <select
                  value={selectedSection.id}
                  onChange={(e) => onSelectSection(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white cursor-pointer"
                >
                  {page.draft.sections.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      #{sec.position} —{' '}
                      {sectionDefinitions[sec.sectionKey]?.label ?? sec.sectionKey}
                    </option>
                  ))}
                </select>
              </div>

              {issues[selectedSection.id]?.length ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
                  {issues[selectedSection.id]!.map((msg) => (
                    <p key={msg} className="flex items-center gap-1.5 font-semibold">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {msg}
                    </p>
                  ))}
                </div>
              ) : null}

              <div className="grid gap-4">
                {Object.entries(selectedSection.config)
                  .filter(([key]) => !HIDDEN_CONFIG_KEYS.has(key))
                  .map(([key, value]) => (
                    <ConfigField
                      key={`${selectedSection.id}-${key}`}
                      fieldKey={key}
                      value={value}
                      path={[key]}
                      onChange={(path, nextValue) =>
                        onUpdateSectionConfig(selectedSection.id, path, nextValue)
                      }
                      onPickImage={(path, currentId) =>
                        onPickImage(selectedSection.id, path, currentId)
                      }
                      mediaImages={mediaImages}
                      entityOptions={entityOptions}
                      onActiveHeroSlideChange={onActiveHeroSlideChange}
                    />
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
