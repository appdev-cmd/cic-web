import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Database,
  ExternalLink,
  Eye,
  EyeOff,
  GripVertical,
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
import { HeroSlidesEditor } from '../editor/HeroSlidesEditor';

export type DataDrawerTab = 'section' | 'slides' | 'sources' | 'layout';

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
  onUpdateSectionConfig: (sectionId: string, path: Array<string | number>, value: PageBuilderConfigValue) => void;
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
  project: { label: 'Quản lý Dự án', href: '/cms/projects' },
  event: { label: 'Quản lý Sự kiện', href: '/cms/events' },
  news: { label: 'Quản lý Tin tức', href: '/cms/news' },
  product: { label: 'Quản lý Sản phẩm', href: '/cms/products' },
  service: { label: 'Quản lý Dịch vụ', href: '/cms/services' },
  partner: { label: 'Quản lý Hãng & Đối tác', href: '/cms/products' },
};

const HIDDEN_CONFIG_KEYS = new Set(['_referenceSources', '_fieldStyles']);

export const PageBuilderDataDrawer: React.FC<PageBuilderDataDrawerProps> = ({
  open,
  initialTab = 'section',
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
  const heroSection = page.draft.sections.find((s) => s.sectionKey === 'home.hero' && Array.isArray(s.config.slides));
  const referenceSections = useMemo(
    () =>
      page.draft.sections.filter((s) => {
        const def = sectionDefinitions[s.sectionKey];
        return def?.referenceLimit && Object.keys(def.referenceLimit).length > 0;
      }),
    [page.draft.sections]
  );

  const [activeTab, setActiveTab] = useState<DataDrawerTab>(initialTab);
  const [sourceSearch, setSourceSearch] = useState<Record<string, string>>({});
  const [draggedIdx, setDraggedIdx] = useState<{ key: string; index: number } | null>(null);

  useEffect(() => {
    if (open) {
      setActiveTab(initialTab);
    }
  }, [open, initialTab]);

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

  const tabs: Array<{ id: DataDrawerTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }> = [
    { id: 'section', label: 'Khu vực đang chọn', icon: SlidersHorizontal },
    ...(heroSection
      ? [
          {
            id: 'slides' as const,
            label: 'Slide Banner',
            icon: Layers,
            badge: Array.isArray(heroSection.config.slides) ? heroSection.config.slides.length : 0,
          },
        ]
      : []),
    ...(referenceSections.length > 0
      ? [
          {
            id: 'sources' as const,
            label: 'Nguồn dữ liệu DB',
            icon: Database,
            badge: referenceSections.length,
          },
        ]
      : []),
    { id: 'layout', label: 'Ẩn/Hiện & Thứ tự', icon: LayoutList, badge: page.draft.sections.length },
  ];

  return (
    <div className="fixed inset-0 z-[72] flex justify-end bg-slate-950/45 backdrop-blur-[2px]" onClick={onClose}>
      <aside
        className="flex h-full w-full max-w-2xl flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
        aria-label="Ngăn quản lý dữ liệu và cấu hình trang"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-extrabold text-slate-950 dark:text-white">
              Quản lý Slide, Nguồn dữ liệu DB & Cấu hình Khu vực
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Mọi thay đổi được đồng bộ trực tiếp lên khung xem trước của trang {page.name}.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
            aria-label="Đóng ngăn cấu hình"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 overflow-x-auto border-b border-slate-200 bg-slate-50/80 px-4 py-2 dark:border-slate-800 dark:bg-slate-950/60">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition cursor-pointer ${
                  active
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-orange-300 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
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

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto p-5 space-y-5">
          {/* TAB 1: SELECTED SECTION CONFIG */}
          {activeTab === 'section' && selectedSection && (
            <div className="space-y-4">
              <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3.5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-800/50">
                <div className="min-w-0">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-600">
                    Đang chỉnh sửa khu vực
                  </span>
                  <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                    #{selectedSection.position} ·{' '}
                    {sectionDefinitions[selectedSection.sectionKey]?.label ?? selectedSection.sectionKey}
                  </p>
                  <p className="text-xs text-slate-500">
                    {sectionDefinitions[selectedSection.sectionKey]?.description ?? ''}
                  </p>
                </div>
                <select
                  value={selectedSection.id}
                  onChange={(e) => onSelectSection(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white cursor-pointer"
                >
                  {page.draft.sections.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      #{sec.position} — {sectionDefinitions[sec.sectionKey]?.label ?? sec.sectionKey}
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
                      onChange={(path, nextValue) => onUpdateSectionConfig(selectedSection.id, path, nextValue)}
                      onPickImage={(path, currentId) => onPickImage(selectedSection.id, path, currentId)}
                      mediaImages={mediaImages}
                      entityOptions={entityOptions}
                      onActiveHeroSlideChange={onActiveHeroSlideChange}
                    />
                  ))}
              </div>
            </div>
          )}

          {/* TAB 2: DEDICATED HERO SLIDES */}
          {activeTab === 'slides' && heroSection && Array.isArray(heroSection.config.slides) && (
            <HeroSlidesEditor
              slides={heroSection.config.slides as any}
              path={['slides']}
              onChange={(path, nextValue) => onUpdateSectionConfig(heroSection.id, path, nextValue)}
              onPickImage={(path, currentId) => onPickImage(heroSection.id, path, currentId)}
              mediaImages={mediaImages}
              onActiveSlideChange={(idx) => {
                onSelectSection(heroSection.id);
                onActiveHeroSlideChange(idx);
              }}
            />
          )}

          {/* TAB 3: DYNAMIC DATABASE SOURCES (Featured vs Manual with Search + Drag & Drop) */}
          {activeTab === 'sources' && (
            <div className="space-y-5">
              {referenceSections.map((sec) => {
                const def = sectionDefinitions[sec.sectionKey];
                const entityTypes = Object.keys(def?.referenceLimit ?? {}) as PageBuilderEntityType[];

                return entityTypes.map((entityType) => {
                  const defaultMax = def?.referenceLimit?.[entityType] ?? 6;
                  const ref = sec.references?.find((r) => r.entityType === entityType) ?? {
                    entityType,
                    entityIds: [],
                  };
                  const source = ref.source ?? { mode: 'featured' as const, limit: defaultMax };
                  const isFeatured = source.mode === 'featured';
                  const limit = source.limit || defaultMax;
                  const cardKey = `${sec.id}:${entityType}`;
                  const query = (sourceSearch[cardKey] ?? '').trim().toLowerCase();

                  const allTypeOptions = entityOptions.filter(
                    (opt) => opt.entityType === entityType && (opt.status ?? 'published') === 'published'
                  );

                  const selectedEntities = ref.entityIds.map((id) => {
                    const found = entityOptions.find((o) => o.entityType === entityType && o.id === id);
                    return found ?? { id, entityType, label: `Mục #${id}`, status: 'published' as const };
                  });

                  const candidateOptions = allTypeOptions
                    .filter((opt) => !ref.entityIds.includes(opt.id))
                    .filter(
                      (opt) =>
                        !query ||
                        opt.label.toLowerCase().includes(query) ||
                        (opt.description || opt.meta?.summary || '').toLowerCase().includes(query) ||
                        opt.id.toLowerCase().includes(query)
                    )
                    .slice(0, 15);

                  const switchToFeatured = (nextLimit = limit) => {
                    const featured = allTypeOptions
                      .filter((opt) => Boolean((opt.meta as Record<string, unknown> | undefined)?.isFeatured))
                      .slice(0, nextLimit);
                    const fallback = allTypeOptions.slice(0, nextLimit);
                    const autoIds = (featured.length > 0 ? featured : fallback).map((i) => i.id);
                    onUpdateReferenceSource(sec.id, entityType, { mode: 'featured', limit: nextLimit });
                    if (autoIds.length > 0) {
                      onUpdateReference(sec.id, entityType, autoIds);
                    }
                  };

                  const switchToManual = () => {
                    onUpdateReferenceSource(sec.id, entityType, { mode: 'manual', limit });
                  };

                  const moveItem = (from: number, to: number) => {
                    if (to < 0 || to >= ref.entityIds.length || from === to) return;
                    const next = [...ref.entityIds];
                    const [moved] = next.splice(from, 1);
                    next.splice(to, 0, moved!);
                    onUpdateReference(sec.id, entityType, next);
                  };

                  const moduleInfo = ENTITY_MODULE_LINKS[entityType];

                  return (
                    <div
                      key={cardKey}
                      className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-2xs space-y-3.5 dark:border-slate-800 dark:bg-slate-800/40"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="rounded-md bg-orange-100 px-2 py-0.5 text-[10px] font-extrabold uppercase text-orange-800 dark:bg-orange-950/60 dark:text-orange-300">
                              Khu vực #{sec.position}
                            </span>
                            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                              {def?.label ?? sec.sectionKey} — {entityTypeLabels[entityType]}
                            </h3>
                          </div>
                          <p className="mt-0.5 text-xs text-slate-500">
                            Đang hiển thị {ref.entityIds.length}/{limit} {entityTypeLabels[entityType].toLowerCase()} từ cơ sở dữ liệu thật.
                          </p>
                        </div>

                        <a
                          href={moduleInfo.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-slate-700 hover:border-orange-300 hover:text-orange-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                        >
                          <span>{moduleInfo.label}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>

                      {/* Mode Toggle + Limit */}
                      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-900">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => switchToFeatured(limit)}
                            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                              isFeatured
                                ? 'bg-orange-600 text-white shadow-2xs'
                                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                            }`}
                          >
                            <Sparkles className="h-3.5 w-3.5" />
                            Tự động: Nổi bật
                          </button>
                          <button
                            type="button"
                            onClick={switchToManual}
                            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                              !isFeatured
                                ? 'bg-orange-600 text-white shadow-2xs'
                                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                            }`}
                          >
                            Chọn thủ công & Xếp hạng
                          </button>
                        </div>

                        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
                          <span>Tối đa:</span>
                          <select
                            value={limit}
                            onChange={(e) => {
                              const nextLim = Number(e.target.value);
                              if (isFeatured) {
                                switchToFeatured(nextLim);
                              } else {
                                onUpdateReferenceSource(sec.id, entityType, { mode: 'manual', limit: nextLim });
                                if (ref.entityIds.length > nextLim) {
                                  onUpdateReference(sec.id, entityType, ref.entityIds.slice(0, nextLim));
                                }
                              }
                            }}
                            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-bold outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800 cursor-pointer"
                          >
                            {[2, 3, 4, 6, 8, 12].map((n) => (
                              <option key={n} value={n}>
                                {n} mục
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>

                      {isFeatured ? (
                        <div className="rounded-xl border border-orange-200/80 bg-orange-50/70 p-3 text-xs text-orange-900 dark:border-orange-900/50 dark:bg-orange-950/30 dark:text-orange-200">
                          Hệ thống đang tự động lấy các <strong>{entityTypeLabels[entityType]}</strong> được đánh dấu{' '}
                          <strong>Nổi bật (Featured)</strong> mới nhất. Chuyển sang <strong>Chọn thủ công</strong> nếu bạn muốn ghim cố định thứ tự #1, #2, #3.
                        </div>
                      ) : (
                        /* Manual Search & Add */
                        <div className="space-y-2">
                          <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                            <input
                              type="search"
                              value={sourceSearch[cardKey] ?? ''}
                              onChange={(e) =>
                                setSourceSearch((curr) => ({ ...curr, [cardKey]: e.target.value }))
                              }
                              placeholder={`Tìm ${entityTypeLabels[entityType].toLowerCase()} trong Database để ghim lên trang...`}
                              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-8 pr-3 text-xs outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950"
                            />
                          </div>

                          {(query.length > 0 || ref.entityIds.length < limit) && candidateOptions.length > 0 && (
                            <div className="max-h-44 overflow-y-auto rounded-xl border border-slate-200 bg-white divide-y divide-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:divide-slate-800">
                              {candidateOptions.map((cand) => {
                                const canAdd = ref.entityIds.length < limit;
                                return (
                                  <div
                                    key={cand.id}
                                    className="flex items-center justify-between gap-2 px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-900"
                                  >
                                    <div className="min-w-0 flex-1">
                                      <p className="truncate font-semibold text-slate-800 dark:text-slate-200">
                                        {cand.label}
                                      </p>
                                      {(cand.description || cand.meta?.summary) && (
                                        <p className="truncate text-[11px] text-slate-400">{cand.description || cand.meta?.summary}</p>
                                      )}
                                    </div>
                                    <button
                                      type="button"
                                      disabled={!canAdd}
                                      onClick={() =>
                                        onUpdateReference(sec.id, entityType, [...ref.entityIds, cand.id])
                                      }
                                      className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-orange-50 px-2.5 py-1 text-[11px] font-bold text-orange-700 hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-orange-950/50 dark:text-orange-300 cursor-pointer"
                                    >
                                      <Plus className="h-3 w-3" />
                                      Chọn
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Selected Ranked Items List */}
                      <div className="space-y-1.5">
                        {selectedEntities.map((item, idx) => (
                          <div
                            key={`${item.id}-${idx}`}
                            draggable={!isFeatured}
                            onDragStart={() => setDraggedIdx({ key: cardKey, index: idx })}
                            onDragOver={(e) => {
                              if (!isFeatured && draggedIdx?.key === cardKey) e.preventDefault();
                            }}
                            onDrop={() => {
                              if (!isFeatured && draggedIdx?.key === cardKey) {
                                moveItem(draggedIdx.index, idx);
                              }
                              setDraggedIdx(null);
                            }}
                            onDragEnd={() => setDraggedIdx(null)}
                            className={`flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-2xs dark:border-slate-700 dark:bg-slate-900 ${
                              !isFeatured ? 'cursor-grab active:cursor-grabbing' : ''
                            }`}
                          >
                            <div className="flex min-w-0 flex-1 items-center gap-2">
                              {!isFeatured && <GripVertical className="h-3.5 w-3.5 shrink-0 text-slate-400" />}
                              <span className="flex h-5 w-6 shrink-0 items-center justify-center rounded bg-orange-100 font-mono text-[10px] font-extrabold text-orange-800 dark:bg-orange-950/60 dark:text-orange-300">
                                #{idx + 1}
                              </span>
                              <span className="truncate font-semibold text-slate-800 dark:text-slate-100">
                                {item.label}
                              </span>
                            </div>

                            {!isFeatured && (
                              <div className="flex shrink-0 items-center gap-1">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => moveItem(idx, idx - 1)}
                                  className="rounded p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800 cursor-pointer"
                                  title="Đưa lên trên"
                                >
                                  <ArrowUp className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === selectedEntities.length - 1}
                                  onClick={() => moveItem(idx, idx + 1)}
                                  className="rounded p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800 cursor-pointer"
                                  title="Đưa xuống dưới"
                                >
                                  <ArrowDown className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    onUpdateReference(
                                      sec.id,
                                      entityType,
                                      ref.entityIds.filter((_, i) => i !== idx)
                                    )
                                  }
                                  className="rounded p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                                  title="Gỡ khỏi danh sách"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                });
              })}
            </div>
          )}

          {/* TAB 4: PAGE SECTIONS VISIBILITY & ORDER */}
          {activeTab === 'layout' && (
            <div className="space-y-2.5">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Nhấp vào tên khu vực để cuộn tới và chỉnh sửa. Các khu vực cho phép ẩn hoặc đổi vị trí sẽ hiện nút tương ứng.
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
                    className={`flex items-center justify-between gap-3 rounded-xl border p-3 transition ${
                      isSelected
                        ? 'border-orange-400 bg-orange-50/50 dark:border-orange-700 dark:bg-orange-950/20'
                        : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        onSelectSection(sec.id);
                        setActiveTab('section');
                      }}
                      className="flex min-w-0 flex-1 items-center gap-3 text-left cursor-pointer"
                    >
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold ${
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
                          className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-[11px] font-bold cursor-pointer ${
                            isVisible
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300'
                              : 'border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                          title={isVisible ? 'Nhấn để ẩn khu vực này' : 'Nhấn để hiện khu vực này'}
                        >
                          {isVisible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                          <span>{isVisible ? 'Hiện' : 'Ẩn'}</span>
                        </button>
                      )}
                      {def.canMove && (
                        <>
                          <button
                            type="button"
                            disabled={idx === 0 || !sectionDefinitions[page.draft.sections[idx - 1]?.sectionKey ?? '']?.canMove}
                            onClick={() => onUpdateSectionStructure(sec.id, 'up')}
                            className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-30 dark:border-slate-700 dark:text-slate-300 cursor-pointer"
                            title="Di chuyển lên"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={
                              idx === page.draft.sections.length - 1 ||
                              !sectionDefinitions[page.draft.sections[idx + 1]?.sectionKey ?? '']?.canMove
                            }
                            onClick={() => onUpdateSectionStructure(sec.id, 'down')}
                            className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-30 dark:border-slate-700 dark:text-slate-300 cursor-pointer"
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
        </div>
      </aside>
    </div>
  );
};
