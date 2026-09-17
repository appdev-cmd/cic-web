import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  History,
  Layers,
  Link2,
  ListFilter,
  MapPin,
  Monitor,
  MoveDown,
  MoveUp,
  Plus,
  Radio,
  RefreshCw,
  Redo2,
  Save,
  Search,
  Send,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Tablet,
  Trash2,
  Undo2,
  X,
} from 'lucide-react';
import { CmsButton } from '../../components/ui/CmsButton';
import type { CmsMediaPickerItem } from '../../data/MediaPickerDataSource';
import type { CmsLocale } from '../../data/CmsDataSource';
import { entityTypeLabels, sectionDefinitions } from './pageBuilderRegistry';
import { PageEntityPickerModal } from './PageEntityPickerModal';
import { PageMediaPickerModal } from './PageMediaPickerModal';
import { PageBuilderVisualCanvas } from './PageBuilderVisualCanvas';
import { registerEntityOptions } from '@/shared/page-content/resolveReferenceEntity';
import { getLegacyAboutPageContent, getLegacyAboutCapacityContent } from '@/shared/page-content/legacyPageContent';
import type { PageBuilderConfigValue, PageBuilderEntityOption, PageBuilderEntityType, PageBuilderPage, PageBuilderSection } from './pageBuilderTypes';
import { CTA_OPTIONS } from './editor/editorConstants';
import { deepClone, updateAtPath, valueAtPath, siblingPath } from './editor/editorUtils';
import { ConfigField } from './editor/ConfigField';

interface PageBuilderEditorProps {
  page: PageBuilderPage;
  onBack: () => void;
  onSaveDraft: (page: PageBuilderPage) => void;
  onPreview: (page: PageBuilderPage) => void;
  onPublish: (page: PageBuilderPage) => void;
  entityOptions: PageBuilderEntityOption[];
  mediaImages: CmsMediaPickerItem[];
  workspaceLocale: CmsLocale;
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

export const PageBuilderEditor: React.FC<PageBuilderEditorProps> = ({ page, onBack, onSaveDraft, onPreview, onPublish, entityOptions, mediaImages, workspaceLocale }) => {
  const [workingPage, setWorkingPage] = useState(() => deepClone(page));
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [picker, setPicker] = useState<{ sectionId: string; entityType: PageBuilderEntityType; selectedIds: string[]; excludedIds?: string[]; limit: number; replaceIndex?: number } | null>(null);
  const [mediaPicker, setMediaPicker] = useState<{ sectionId: string; path: Array<string | number>; currentId: string } | null>(null);
  const [showValidation, setShowValidation] = useState(false);
  const [showMobileCanvas, setShowMobileCanvas] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [ctaPopover, setCtaPopover] = useState<{ sectionId: string; path: Array<string | number>; fallbackLabel: string; anchor: { left: number; top: number } } | null>(null);
  const [videoPopover, setVideoPopover] = useState<{ sectionId: string; path: Array<string | number>; url: string; anchor: { left: number; top: number } } | null>(null);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [past, setPast] = useState<PageBuilderPage[]>([]);
  const [future, setFuture] = useState<PageBuilderPage[]>([]);
  const issues = useMemo(() => validate(workingPage, entityOptions), [entityOptions, workingPage]);
  const issueCount = Object.values(issues).reduce((total, values) => total + values.length, 0);

  useEffect(() => {
    if (entityOptions && entityOptions.length > 0) {
      registerEntityOptions(entityOptions);
    }
  }, [entityOptions]);

  useEffect(() => {
    if (!ctaPopover) return;
    const close = (event: PointerEvent) => {
      if (!(event.target as HTMLElement).closest('[data-cta-popover]')) setCtaPopover(null);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [ctaPopover]);

  const seedDefaultCollectionIfEmpty = (section: PageBuilderSection, path: Array<string | number>): Record<string, PageBuilderConfigValue> => {
    const cfg = { ...(section.config || {}) };
    if (section.sectionKey === 'about.timeline' && path[0] === 'milestones') {
      if (!Array.isArray(cfg.milestones) || cfg.milestones.length === 0) {
        cfg.milestones = deepClone(getLegacyAboutPageContent().timeline.milestones) as any;
      }
    } else if (section.sectionKey === 'about.strategy' && path[0] === 'coreValues') {
      if (!Array.isArray(cfg.coreValues) || cfg.coreValues.length === 0) {
        cfg.coreValues = deepClone(getLegacyAboutPageContent().strategy.coreValues) as any;
      }
    } else if (section.sectionKey === 'about.capacity' && path[0] === 'metrics') {
      if (!Array.isArray(cfg.metrics) || cfg.metrics.length === 0) {
        cfg.metrics = deepClone(getLegacyAboutCapacityContent().metrics) as any;
      }
    }
    return cfg;
  };

  const updateSectionConfig = (sectionId: string, path: Array<string | number>, value: PageBuilderConfigValue) => {
    setWorkingPage((current) => {
      setPast((items) => [...items.slice(-49), deepClone(current)]);
      setFuture([]);
      return {
        ...current,
        draft: {
          ...current.draft,
          sections: current.draft.sections.map((section) => {
            if (section.id !== sectionId) return section;
            const seededConfig = seedDefaultCollectionIfEmpty(section, path);
            return { ...section, config: updateAtPath(seededConfig, path, value) };
          }),
        },
      };
    });
  };

  const updateInlineText = useCallback((sectionId: string, path: Array<string | number>, value: string) => {
    setWorkingPage((current) => {
      setPast((items) => [...items.slice(-49), deepClone(current)]);
      setFuture([]);
      return {
        ...current,
        draft: {
          ...current.draft,
          sections: current.draft.sections.map((section) => {
            if (section.id !== sectionId) return section;
            const seededConfig = seedDefaultCollectionIfEmpty(section, path);
            return { ...section, config: updateAtPath(seededConfig, path, value) };
          }),
        },
      };
    });
  }, []);

  const updateReference = (sectionId: string, entityType: PageBuilderEntityType, ids: string[]) => {
    setWorkingPage((current) => {
      setPast((items) => [...items.slice(-49), deepClone(current)]);
      setFuture([]);
      return {
        ...current,
        draft: {
          ...current.draft,
          sections: current.draft.sections.map((section) => {
            if (section.id !== sectionId) return section;
            const existing = section.references ?? [];
            const hasType = existing.some((reference) => reference.entityType === entityType);
            const nextRefs = hasType
              ? existing.map((reference) => (reference.entityType === entityType ? { ...reference, entityIds: ids } : reference))
              : [...existing, { entityType, entityIds: ids }];
            return { ...section, references: nextRefs };
          }),
        },
      };
    });
  };

  const updateReferenceSource = (sectionId: string, entityType: PageBuilderEntityType, source: NonNullable<PageBuilderSection['references']>[number]['source']) => {
    setWorkingPage((current) => {
      setPast((items) => [...items.slice(-49), deepClone(current)]);
      setFuture([]);
      return {
        ...current,
        draft: {
          ...current.draft,
          sections: current.draft.sections.map((section) => {
            if (section.id !== sectionId) return section;
            return {
              ...section,
              references: (section.references ?? []).map((reference) => {
                if (reference.entityType !== entityType) return reference;
                let nextEntityIds = reference.entityIds;
                if (source?.mode === 'featured') {
                  const limit = sectionDefinitions[section.sectionKey]?.referenceLimit?.[entityType] ?? source?.limit ?? 4;
                  const featuredEntities = entityOptions
                    .filter((opt) => opt.entityType === entityType && (opt.status ?? 'published') === 'published' && opt.meta?.isFeatured)
                    .slice(0, limit)
                    .map((opt) => opt.id);
                  if (featuredEntities.length > 0) {
                    nextEntityIds = featuredEntities;
                  }
                }
                return { ...reference, source, entityIds: nextEntityIds };
              }),
            };
          }),
        },
      };
    });
  };

  const updateCollection = (sectionId: string, path: string, action: 'add' | 'duplicate' | 'remove' | 'previous' | 'next', index: number) => {
    const section = workingPage.draft.sections.find((item) => item.id === sectionId);
    let current = section?.config[path];
    if (!Array.isArray(current)) {
      if (path === 'items' && (section?.sectionKey === 'about.awards' || section?.sectionKey === 'about.partners')) {
        current = [];
      } else {
        return;
      }
    }
    const items = [...current];
    if (action === 'add') {
      const isAwards = section?.sectionType === 'award_slider' || section?.sectionType === 'awards' || section?.sectionKey === 'home.awards' || section?.sectionKey === 'about.awards';
      const isEcosystem = section?.sectionType === 'technology_ecosystem' || section?.sectionType === 'ecosystem' || section?.sectionKey === 'home.ecosystem';
      const isPartners = section?.sectionType === 'partner_marquee' || section?.sectionType === 'partners' || section?.sectionKey === 'home.partners' || section?.sectionKey === 'about.partners';
      const defaults: Record<string, PageBuilderConfigValue> = {
        slides: { title: '', subtitle: '', backgroundImageId: '', mobileImageId: '', primaryCtaId: '', secondaryCtaId: '' },
        items: isAwards
          ? { name: 'Giải thưởng mới', imageId: '', img: '' }
          : isEcosystem
            ? { id: `ecosystem_${items.length + 1}`, title: 'Giải pháp mới', description: 'Nhập mô tả giải pháp.', badge: 'Công nghệ', imageId: '', link: '/products' }
            : isPartners
              ? { id: `partner_${items.length + 1}`, name: 'Đối tác mới', imageId: '', logo: '', link: '/' }
            : { value: 0, suffix: '+', label: '' },
        paragraphs: 'Nhập đoạn nội dung mới',
        tickerItems: 'Nhập thông báo mới',
        milestones: { year: '2026', title: 'Cột mốc mới', description: 'Nhập mô tả cột mốc.' },
        coreValues: { title: 'Giá trị mới', description: 'Nhập mô tả.' },
        slots: { slotKey: `slot_${items.length + 1}`, title: 'Giải pháp mới', description: 'Nhập mô tả.' },
        branches: { key: `branch_${items.length + 1}`, name: 'Chi nhánh mới', address: '', phone: '', email: '', workingHours: '', mapUrl: '' },
        blocks: { type: 'paragraph', text: 'Nhập nội dung mới.' },
        categoryKeys: `category_${items.length + 1}`,
      };
      items.push(defaults[path] ?? 'Mục mới');
    } else if (action === 'duplicate') {
      if (items[index] !== undefined) items.splice(index + 1, 0, deepClone(items[index]));
    } else if (action === 'remove') {
      if (path === 'slides' && items.length <= 1) return;
      items.splice(index, 1);
    } else {
      const target = action === 'previous' ? index - 1 : index + 1;
      if (target < 0 || target >= items.length) return;
      [items[index], items[target]] = [items[target], items[index]];
    }
    if (section && (section.sectionKey === 'about.awards' || section.sectionKey === 'about.partners') && section.config.syncWithHome !== false) {
      recordHistory(`Cập nhật ${path}`);
      setWorkingPage((current) => ({
        ...current,
        draft: {
          ...current.draft,
          sections: current.draft.sections.map((s) => {
            if (s.id !== sectionId) return s;
            const updatedConfig = updateConfigByPath(s.config, [path], items);
            return {
              ...s,
              config: {
                ...updatedConfig,
                syncWithHome: false,
              },
            };
          }),
        },
      }));
      return;
    }
    updateSectionConfig(sectionId, [path], items);
  };

  const undo = () => setPast((items) => {
    const previous = items.at(-1);
    if (!previous) return items;
    setFuture((next) => [deepClone(workingPage), ...next].slice(0, 50));
    setWorkingPage(deepClone(previous));
    return items.slice(0, -1);
  });

  const redo = () => setFuture((items) => {
    const next = items[0];
    if (!next) return items;
    setPast((previous) => [...previous.slice(-49), deepClone(workingPage)]);
    setWorkingPage(deepClone(next));
    return items.slice(1);
  });

  const updateSectionStructure = (sectionId: string, action: 'toggle' | 'up' | 'down') => {
    setWorkingPage((current) => {
      setPast((items) => [...items.slice(-49), deepClone(current)]);
      setFuture([]);
      const sections = current.draft.sections.map((section) => ({ ...section }));
      const index = sections.findIndex((section) => section.id === sectionId);
      if (index < 0) return current;
      const definition = sectionDefinitions[sections[index].sectionKey];
      if (action === 'toggle') {
        if (!definition?.canHide) return current;
        sections[index].visible = sections[index].visible === false;
      }
      else {
        const target = action === 'up' ? index - 1 : index + 1;
        if (target < 0 || target >= sections.length || !definition?.canMove) return current;
        [sections[index], sections[target]] = [sections[target], sections[index]];
      }
      sections.forEach((section, position) => { section.position = position + 1; });
      return { ...current, draft: { ...current.draft, sections } };
    });
  };

  const restoreVersion = (version: PageBuilderPage['published']) => {
    setPast((items) => [...items.slice(-49), deepClone(workingPage)]);
    setFuture([]);
    setWorkingPage((current) => ({ ...current, draft: { ...deepClone(version), status: 'draft', version: current.draft.version, updatedAt: new Date().toISOString(), publishedAt: undefined } }));
    setShowHistory(false);
  };

  const handleHeroAction = (sectionId: string, action: 'select' | 'add' | 'duplicate' | 'delete' | 'previous' | 'next' | 'movePrevious' | 'moveNext', index?: number) => {
    const section = workingPage.draft.sections.find((item) => item.id === sectionId);
    const slides = Array.isArray(section?.config.slides) ? [...section.config.slides] : [];
    if (action === 'select' && typeof index === 'number') { setActiveHeroSlide(index); return; }
    if (action === 'previous') { setActiveHeroSlide((current) => Math.max(0, current - 1)); return; }
    if (action === 'next') { setActiveHeroSlide((current) => Math.min(slides.length - 1, current + 1)); return; }
    if (action === 'add') {
      slides.push({ title: '', subtitle: '', backgroundImageId: '', mobileImageId: '', primaryCtaId: '', secondaryCtaId: '' });
      updateSectionConfig(sectionId, ['slides'], slides);
      setActiveHeroSlide(slides.length - 1);
      return;
    }
    if (action === 'duplicate' && slides[activeHeroSlide]) {
      slides.splice(activeHeroSlide + 1, 0, deepClone(slides[activeHeroSlide]));
      updateSectionConfig(sectionId, ['slides'], slides);
      setActiveHeroSlide(activeHeroSlide + 1);
      return;
    }
    if (action === 'delete' && slides.length > 1) {
      slides.splice(activeHeroSlide, 1);
      updateSectionConfig(sectionId, ['slides'], slides);
      setActiveHeroSlide((current) => Math.max(0, Math.min(current, slides.length - 1)));
      return;
    }
    const target = action === 'movePrevious' ? activeHeroSlide - 1 : activeHeroSlide + 1;
    if (target < 0 || target >= slides.length) return;
    [slides[activeHeroSlide], slides[target]] = [slides[target], slides[activeHeroSlide]];
    updateSectionConfig(sectionId, ['slides'], slides);
    setActiveHeroSlide(target);
  };

  const runValidAction = (action: (value: PageBuilderPage) => void) => {
    setShowValidation(true);
    if (issueCount === 0) action(workingPage);
  };

  const selectedSection = workingPage.draft.sections.find((item) => item.id === selectedSectionId) ?? workingPage.draft.sections[0];

  return (
    <div className="fixed inset-0 z-[60] flex min-h-0 flex-col bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="z-20 shrink-0 border-b border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <button onClick={onBack} className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300" aria-label="Quay lại Trang nội dung"><ArrowLeft className="h-4 w-4" /><span className="hidden sm:inline">Trang nội dung</span></button>
            <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className={`rounded-md px-2 py-1 text-[11px] font-bold ${past.length > 0 || workingPage.draft.version > workingPage.published.version ? 'bg-amber-50 text-amber-700' : workingPage.published.version > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{past.length > 0 || workingPage.draft.version > workingPage.published.version ? 'Có thay đổi chưa xuất bản' : workingPage.published.version > 0 ? 'Đã xuất bản' : 'Bản nháp'}</span></div><h1 className="mt-1 truncate text-lg font-bold text-slate-950 dark:text-white">{workingPage.name}</h1><p className="text-xs text-slate-500">{workingPage.slug}</p></div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800">{([['desktop', Monitor, 'Desktop'], ['tablet', Tablet, 'Tablet'], ['mobile', Smartphone, 'Mobile']] as const).map(([value, Icon, label]) => <button key={value} type="button" title={label} aria-label={label} onClick={() => setViewport(value)} className={`rounded-md p-2 ${viewport === value ? 'bg-orange-600 text-white' : 'text-slate-500 hover:bg-white dark:hover:bg-slate-700'}`}><Icon className="h-4 w-4" /></button>)}</div>
            <div className="flex rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900"><button type="button" onClick={undo} disabled={past.length === 0} className="rounded-md p-2 text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 dark:text-slate-300 dark:hover:bg-slate-800" aria-label="Hoàn tác" title="Hoàn tác"><Undo2 className="h-4 w-4" /></button><button type="button" onClick={redo} disabled={future.length === 0} className="rounded-md p-2 text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 dark:text-slate-300 dark:hover:bg-slate-800" aria-label="Làm lại" title="Làm lại"><Redo2 className="h-4 w-4" /></button></div>
            <button type="button" onClick={() => { setShowHistory((value) => !value); setIsExpanded(false); }} className={`rounded-lg border p-2 ${showHistory ? 'border-orange-300 bg-orange-50 text-orange-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'}`} aria-label="Lịch sử phiên bản" title="Lịch sử phiên bản"><History className="h-4 w-4" /></button>
            <CmsButton variant="secondary" leadingIcon={<Save />} onClick={() => runValidAction(onSaveDraft)}>Lưu bản nháp</CmsButton><CmsButton variant="secondary" leadingIcon={<Eye />} onClick={() => runValidAction(onPreview)}>Xem trước</CmsButton><CmsButton leadingIcon={<Send />} onClick={() => runValidAction(onPublish)}>Xuất bản</CmsButton>
          </div>
        </div>
      </div>

      {showValidation && issueCount > 0 && <div className="shrink-0 border-b border-red-200 bg-red-50 px-5 py-2 text-sm text-red-700"><div className="flex items-center gap-2 font-bold"><AlertCircle className="h-4 w-4" />Có {issueCount} lỗi cần sửa trước khi tiếp tục.</div></div>}

      <div className={`grid min-h-0 flex-1 gap-3 overflow-y-auto p-3 lg:overflow-hidden ${showHistory ? 'lg:grid-cols-[minmax(0,1fr)_400px] 2xl:grid-cols-[minmax(0,1fr)_440px]' : 'lg:grid-cols-1'}`}>
        <aside className="hidden">
          <div className="px-2 pb-3"><h2 className="text-sm font-bold text-slate-900 dark:text-white">Khu vực trang</h2><p className="mt-1 text-xs text-slate-500">Chọn khu vực để sửa nội dung.</p></div>
          <nav className="space-y-1" aria-label="Các khu vực của trang">{workingPage.draft.sections.map((item) => { const definition = sectionDefinitions[item.sectionKey] ?? { label: item.sectionKey, description: '' }; const active = item.id === selectedSectionId; const hasIssue = Boolean(issues[item.id]?.length); return <button key={item.id} type="button" onClick={() => setSelectedSectionId(item.id)} className={`flex w-full items-start gap-3 rounded-lg px-2.5 py-2.5 text-left transition ${active ? 'bg-orange-50 text-orange-800 ring-1 ring-orange-200 dark:bg-orange-950/30 dark:text-orange-200' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'}`}><span className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md text-[10px] font-bold ${active ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>{item.position}</span><span className="min-w-0 flex-1"><span className="block truncate text-xs font-bold">{definition.label}</span><span className="mt-0.5 block truncate text-[10px] text-slate-400">{definition.description}</span></span>{hasIssue && <span className="mt-1 size-2 shrink-0 rounded-full bg-red-500" aria-label="Có lỗi" />}</button>; })}</nav>
          <details className="mt-4 border-t border-slate-200 pt-3 dark:border-slate-800"><summary className="cursor-pointer rounded-lg px-2 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800">SEO & đường dẫn</summary><div className="mt-3 space-y-3 px-2"><label className="block space-y-1.5"><span className="text-xs font-semibold">Tiêu đề SEO</span><input value={workingPage.draft.seo.title} onChange={(event) => setWorkingPage({ ...workingPage, draft: { ...workingPage.draft, seo: { ...workingPage.draft.seo, title: event.target.value } } })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950" /></label><label className="block space-y-1.5"><span className="text-xs font-semibold">Mô tả SEO</span><textarea rows={4} value={workingPage.draft.seo.description} onChange={(event) => setWorkingPage({ ...workingPage, draft: { ...workingPage.draft, seo: { ...workingPage.draft.seo, description: event.target.value } } })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950" /></label>{showValidation && issues.seo?.map((issue) => <p key={issue} className="text-xs font-semibold text-red-600">{issue}</p>)}</div></details>
        </aside>
        <section className="flex min-h-0 min-w-0 flex-col rounded-xl bg-slate-100 p-1 dark:bg-slate-950">
          <div className="mb-1 flex justify-end lg:hidden">
            <button type="button" onClick={() => setShowMobileCanvas((value) => !value)} className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-bold text-slate-600 lg:hidden dark:border-slate-700 dark:bg-slate-900">{showMobileCanvas ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}{showMobileCanvas ? 'Thu gọn' : 'Hiện xem trước'}</button>
          </div>
          <div className={`${showMobileCanvas ? 'block' : 'hidden'} min-h-0 flex-1 overflow-auto rounded-xl bg-slate-300/60 p-1 lg:block dark:bg-slate-900`}>
            <PageBuilderVisualCanvas
              mode="edit"
              page={workingPage}
              sections={workingPage.draft.sections}
              selectedId={selectedSectionId}
              issueIds={new Set(Object.keys(issues))}
              viewport={viewport}
              activeHeroSlide={activeHeroSlide}
              entityOptions={entityOptions}
              onSelect={(id) => { setSelectedSectionId(id); setIsExpanded(false); }}
              onTextChange={updateInlineText}
              onConfigValueChange={updateSectionConfig}
              onEditMedia={(sectionId, path, currentId) => setMediaPicker({ sectionId, path, currentId })}
              onEditVideo={(sectionId, path, currentUrl, anchor) => {
                const section = workingPage.draft.sections.find((item) => item.id === sectionId);
                const fallbackUrl = section?.sectionKey === 'about.overview' ? 'https://www.youtube.com/watch?v=hdLFK_09-tU?start=448' : '';
                const initialUrl = currentUrl || fallbackUrl;
                setSelectedSectionId(sectionId);
                setVideoPopover({ sectionId, path, url: initialUrl, anchor });
              }}
              onEditCta={(sectionId, path, currentLabel, anchor) => { setSelectedSectionId(sectionId); setCtaPopover({ sectionId, path, fallbackLabel: currentLabel, anchor }); }}
              onSectionAction={updateSectionStructure}
              onReferenceSourceChange={updateReferenceSource}
              onReferenceItemsChange={updateReference}
              onCollectionAction={updateCollection}
              onPickReference={(sectionId, entityType, replaceIndex) => { const section = workingPage.draft.sections.find((item) => item.id === sectionId); const reference = section?.references?.find((item) => item.entityType === entityType); const limit = sectionDefinitions[section?.sectionKey ?? '']?.referenceLimit?.[entityType] ?? 20; setPicker({ sectionId, entityType, selectedIds: replaceIndex === undefined ? reference?.entityIds ?? [] : [], excludedIds: replaceIndex === undefined ? [] : reference?.entityIds.filter((_, index) => index !== replaceIndex), limit: replaceIndex === undefined ? limit : 1, replaceIndex }); }}
              onHeroAction={handleHeroAction}
            />
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
                  onClick={() => setIsExpanded(false)}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  title="Đóng bảng cấu hình"
                >
                  <X className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Đóng</span>
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
                      onActiveHeroSlideChange={setActiveHeroSlide}
                    />
                  ))}
                </div>

                {(() => {
                  const supportedEntityTypes = Object.keys(definition.referenceLimit ?? {}) as PageBuilderEntityType[];
                  if (supportedEntityTypes.length === 0) return null;

                  return supportedEntityTypes.map((entityType) => {
                    const reference = section.references?.find((item) => item.entityType === entityType) ?? { entityType, entityIds: [] };
                    const limit = definition.referenceLimit?.[entityType] ?? 20;
                    const source = reference.source ?? { mode: 'manual' as const, limit };
                    const isFeatured = source.mode === 'featured';

                    const moveRef = (from: number, to: number) => {
                      if (to < 0 || to >= reference.entityIds.length) return;
                      const next = [...reference.entityIds];
                      const [moved] = next.splice(from, 1);
                      next.splice(to, 0, moved);
                      updateReference(section.id, entityType, next);
                    };

                    const removeRef = (targetIndex: number) => {
                      const next = reference.entityIds.filter((_, idx) => idx !== targetIndex);
                      updateReference(section.id, entityType, next);
                    };

                    const switchToFeatured = () => {
                      const featuredItems = entityOptions
                        .filter((opt) => opt.entityType === entityType && (opt.meta as any)?.isFeatured)
                        .slice(0, limit);
                      const fallbackItems = entityOptions
                        .filter((opt) => opt.entityType === entityType)
                        .slice(0, limit);
                      const autoIds = (featuredItems.length > 0 ? featuredItems : fallbackItems).map((i) => i.id);
                      updateReferenceSource(section.id, entityType, { mode: 'featured', limit });
                      if (autoIds.length > 0) {
                        updateReference(section.id, entityType, autoIds);
                      }
                    };

                    const switchToManual = () => {
                      updateReferenceSource(section.id, entityType, { mode: 'manual', limit });
                    };

                    return (
                      <div key={entityType} className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{entityTypeLabels[entityType]} đã chọn</p>
                            <p className="text-xs text-slate-500">{reference.entityIds.length}/{limit} mục · đúng thứ tự hiển thị</p>
                          </div>
                          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-0.5 dark:border-slate-700 dark:bg-slate-900">
                            <button
                              type="button"
                              onClick={switchToFeatured}
                              className={`rounded-md px-2.5 py-1 text-xs font-bold transition ${
                                isFeatured
                                  ? 'bg-orange-600 text-white shadow-xs'
                                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                              }`}
                            >
                              Tự động: Nổi bật
                            </button>
                            <button
                              type="button"
                              onClick={switchToManual}
                              className={`rounded-md px-2.5 py-1 text-xs font-bold transition ${
                                !isFeatured
                                  ? 'bg-orange-600 text-white shadow-xs'
                                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                              }`}
                            >
                              Chọn thủ công
                            </button>
                          </div>
                        </div>

                        {isFeatured && (
                          <div className="rounded-lg bg-orange-50/80 p-2.5 text-xs text-orange-900 border border-orange-200/80 dark:bg-orange-950/30 dark:border-orange-800/60 dark:text-orange-200">
                            <p className="font-semibold">Hệ thống đang tự động hiển thị {reference.entityIds.length} mục nổi bật từ cơ sở dữ liệu.</p>
                          </div>
                        )}

                        <div className="space-y-1.5">
                          {reference.entityIds.map((id, index) => (
                            <div key={id} className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                              <span className="min-w-0 flex-1 truncate">
                                <span className="text-slate-400 mr-1.5">{index + 1}.</span>
                                {entityOptions.find((item) => item.id === id)?.label ?? id}
                              </span>
                              {!isFeatured && (
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => moveRef(index, index - 1)}
                                    disabled={index === 0}
                                    className="rounded p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800"
                                    title="Di chuyển lên"
                                  >
                                    <MoveUp className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => moveRef(index, index + 1)}
                                    disabled={index === reference.entityIds.length - 1}
                                    className="rounded p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800"
                                    title="Di chuyển xuống"
                                  >
                                    <MoveDown className="h-3.5 w-3.5" />
                                  </button>
                                  <CmsButton
                                    size="sm"
                                    variant="secondary"
                                    leadingIcon={<Link2 />}
                                    onClick={() => setPicker({
                                      sectionId: section.id,
                                      entityType,
                                      selectedIds: [],
                                      excludedIds: reference.entityIds.filter((_, itemIndex) => itemIndex !== index),
                                      limit: 1,
                                      replaceIndex: index
                                    })}
                                  >
                                    Thay
                                  </CmsButton>
                                  <button
                                    type="button"
                                    onClick={() => removeRef(index)}
                                    className="rounded p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                                    title="Xóa mục"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {!isFeatured && reference.entityIds.length < limit && (
                          <button
                            type="button"
                            onClick={() => setPicker({
                              sectionId: section.id,
                              entityType,
                              selectedIds: reference.entityIds,
                              limit,
                            })}
                            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-300 py-2 text-xs font-bold text-slate-600 hover:border-orange-500 hover:text-orange-600 dark:border-slate-700 dark:text-slate-300"
                          >
                            <Plus className="h-3.5 w-3.5" /> Thêm {entityTypeLabels[entityType] || 'mục'}
                          </button>
                        )}
                      </div>
                    );
                  });
                })()}

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
              <aside className="min-h-[520px] overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:min-h-0">
                {content}
              </aside>
            );
          }

          return null;
        })()}
        {showHistory && <aside className="min-h-[420px] overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:min-h-0">
          <div className="sticky top-0 z-10 -mx-4 -mt-4 flex items-center justify-between border-b border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"><div><h2 className="text-sm font-bold">Lịch sử phiên bản</h2><p className="mt-1 text-xs text-slate-500">Khôi phục thành bản nháp mới, không thay đổi Website ngay.</p></div><button type="button" onClick={() => setShowHistory(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Đóng lịch sử"><X className="h-4 w-4" /></button></div>
          <div className="mt-4 space-y-2">
            {[workingPage.published, ...(workingPage.history ?? [])].filter((version) => version.version > 0).map((version, index) => <article key={`${version.version}-${version.publishedAt ?? index}`} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold text-slate-900 dark:text-white">Phiên bản v{version.version}</p><p className="mt-1 text-[11px] text-slate-500">{version.publishedAt ? new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(version.publishedAt)) : 'Bản đã xuất bản'}</p></div>{index === 0 && <span className="rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">Đang xuất bản</span>}</div><button type="button" onClick={() => restoreVersion(version)} className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:border-orange-300 hover:bg-orange-50 dark:border-slate-700 dark:text-slate-200">Khôi phục thành bản nháp</button></article>)}
            {workingPage.published.version === 0 && (workingPage.history?.length ?? 0) === 0 && <p className="py-8 text-center text-xs text-slate-500">Chưa có phiên bản đã xuất bản.</p>}
          </div>
        </aside>}
      </div>

      {ctaPopover && selectedSection && <div data-cta-popover className="fixed z-[75] w-[min(360px,calc(100vw-2rem))] rounded-xl border border-slate-200 bg-white p-4 text-left shadow-2xl dark:border-slate-700 dark:bg-slate-900" style={{ left: Math.max(16, Math.min(ctaPopover.anchor.left, window.innerWidth - 376)), top: Math.max(16, Math.min(ctaPopover.anchor.top, window.innerHeight - 330)) }} onPointerDown={(event) => event.stopPropagation()}><div className="flex items-center justify-between gap-3"><h3 className="text-sm font-bold">Chỉnh sửa CTA</h3><button type="button" onClick={() => setCtaPopover(null)} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Đóng chỉnh sửa CTA"><X className="h-4 w-4" /></button></div><div className="mt-3 space-y-3"><label className="block space-y-1.5"><span className="text-xs font-semibold">CTA liên kết</span><select value={String(valueAtPath(selectedSection.config, ctaPopover.path) ?? '')} onChange={(event) => updateSectionConfig(selectedSection.id, ctaPopover.path, event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950">{CTA_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label><label className="block space-y-1.5"><span className="text-xs font-semibold">Nhãn</span><input value={String(valueAtPath(selectedSection.config, siblingPath(ctaPopover.path, 'Label')) ?? ctaPopover.fallbackLabel)} onChange={(event) => updateSectionConfig(selectedSection.id, siblingPath(ctaPopover.path, 'Label'), event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950" /></label><label className="block space-y-1.5"><span className="text-xs font-semibold">Link</span><input value={String(valueAtPath(selectedSection.config, siblingPath(ctaPopover.path, 'Url')) ?? '')} onChange={(event) => updateSectionConfig(selectedSection.id, siblingPath(ctaPopover.path, 'Url'), event.target.value)} placeholder="Dùng link của CTA nếu để trống" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950" /></label><label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300"><input type="checkbox" checked={Boolean(valueAtPath(selectedSection.config, siblingPath(ctaPopover.path, 'NewTab')))} onChange={(event) => updateSectionConfig(selectedSection.id, siblingPath(ctaPopover.path, 'NewTab'), event.target.checked)} className="h-4 w-4 accent-orange-600" />Mở tab mới</label></div></div>}

      {picker && <PageEntityPickerModal isOpen entityType={picker.entityType} selectedIds={picker.selectedIds} limit={picker.limit} options={entityOptions.filter((option) => !picker.excludedIds?.includes(option.id))} onClose={() => setPicker(null)} onConfirm={(ids) => {
        if (picker.replaceIndex === undefined) updateReference(picker.sectionId, picker.entityType, ids);
        else {
          const section = workingPage.draft.sections.find((item) => item.id === picker.sectionId);
          const reference = section?.references?.find((item) => item.entityType === picker.entityType);
          if (reference && ids[0]) { const next = [...reference.entityIds]; next[picker.replaceIndex] = ids[0]; updateReference(picker.sectionId, picker.entityType, next); }
        }
      }} />}
      {videoPopover && <div data-video-popover className="fixed z-[75] w-[min(420px,calc(100vw-2rem))] rounded-xl border border-slate-200 bg-white p-4 text-left shadow-2xl dark:border-slate-700 dark:bg-slate-900" style={{ left: Math.max(16, Math.min(videoPopover.anchor.left, window.innerWidth - 436)), top: Math.max(16, Math.min(videoPopover.anchor.top, window.innerHeight - 210)) }} onPointerDown={(event) => event.stopPropagation()}><div className="flex items-center justify-between gap-3"><h3 className="text-sm font-bold">Thay video</h3><button type="button" onClick={() => setVideoPopover(null)} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Đóng chỉnh sửa video"><X className="h-4 w-4" /></button></div><label className="mt-3 block space-y-1.5"><span className="text-xs font-semibold">Đường dẫn YouTube hoặc video</span><input autoFocus value={videoPopover.url} onChange={(event) => setVideoPopover((current) => current ? { ...current, url: event.target.value } : current)} onKeyDown={(event) => { if (event.key === 'Enter') { updateSectionConfig(videoPopover.sectionId, videoPopover.path, videoPopover.url); setVideoPopover(null); } }} placeholder="https://www.youtube.com/watch?v=..." className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950" /></label><div className="mt-3 flex justify-end gap-2"><button type="button" onClick={() => setVideoPopover(null)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600">Hủy</button><button type="button" onClick={() => { updateSectionConfig(videoPopover.sectionId, videoPopover.path, videoPopover.url); setVideoPopover(null); }} className="rounded-lg bg-orange-600 px-3 py-2 text-xs font-bold text-white hover:bg-orange-500">Áp dụng</button></div></div>}
      {mediaPicker && (
        <PageMediaPickerModal
          locale={workspaceLocale}
          currentId={mediaPicker.currentId}
          images={mediaImages}
          returnValue="url"
          onClose={() => setMediaPicker(null)}
          onConfirm={(mediaUrl: string) => {
            updateSectionConfig(mediaPicker.sectionId, mediaPicker.path, mediaUrl);
            const lastKey = mediaPicker.path[mediaPicker.path.length - 1];
            if (mediaPicker.path.length >= 3 && mediaPicker.path[0] === 'items') {
              const itemIdx = mediaPicker.path[1];
              if (lastKey === 'logo' || lastKey === 'imageId') {
                updateSectionConfig(mediaPicker.sectionId, ['items', itemIdx, 'logo'], mediaUrl);
                updateSectionConfig(mediaPicker.sectionId, ['items', itemIdx, 'imageId'], mediaUrl);
              } else if (lastKey === 'img' || lastKey === 'imageId') {
                updateSectionConfig(mediaPicker.sectionId, ['items', itemIdx, 'img'], mediaUrl);
                updateSectionConfig(mediaPicker.sectionId, ['items', itemIdx, 'imageId'], mediaUrl);
              } else if (lastKey === 'image' || lastKey === 'imageId') {
                updateSectionConfig(mediaPicker.sectionId, ['items', itemIdx, 'image'], mediaUrl);
                updateSectionConfig(mediaPicker.sectionId, ['items', itemIdx, 'imageId'], mediaUrl);
              }
            }
          }}
        />
      )}
    </div>
  );
};
