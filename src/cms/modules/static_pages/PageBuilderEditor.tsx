import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, AlertTriangle, ChevronDown, ChevronUp, History, Loader2, RefreshCw, X } from 'lucide-react';
import type { CmsMediaPickerItem } from '../../data/MediaPickerDataSource';
import type { CmsLocale } from '../../data/CmsDataSource';
import { entityTypeLabels, sectionDefinitions } from './pageBuilderRegistry';
import { PageEntityPickerModal } from './PageEntityPickerModal';
import { PageMediaPickerModal } from './PageMediaPickerModal';
import { PageBuilderVisualCanvas } from './PageBuilderVisualCanvas';
import { registerEntityOptions } from '@/shared/page-content/resolveReferenceEntity';
import {
  getLegacyAboutPageContent,
  getLegacyAboutCapacityContent,
  getLegacyHomePageContent,
} from '@/shared/page-content/legacyPageContent';
import type {
  PageBuilderConfigValue,
  PageBuilderEntityOption,
  PageBuilderEntityType,
  PageBuilderPage,
  PageBuilderSection,
  PageBuilderVersion,
} from './pageBuilderTypes';
import { deepClone, updateAtPath } from './editor/editorUtils';
import {
  applyCanvasFormatCommand,
  DEFAULT_CANVAS_FORMAT_STATE,
  readCanvasFormatState,
  type CanvasFormatState,
  type FormatCommandInput,
} from './builder/canvasTextFormatter';
import { PageBuilderToolbar } from './builder/PageBuilderToolbar';
import { PageInlineSeoPanel } from './builder/PageInlineSeoPanel';
import { PageBuilderLinkToolbar, type ActiveLinkTarget } from './builder/PageBuilderLinkToolbar';
import { PageBuilderDataDrawer, type DataDrawerTab } from './builder/PageBuilderDataDrawer';

interface PageBuilderEditorProps {
  page: PageBuilderPage;
  onBack: () => void;
  onSaveDraft: (page: PageBuilderPage) => Promise<void> | void;
  onPreview: (page: PageBuilderPage) => void;
  onPublish: (page: PageBuilderPage) => Promise<void> | void;
  onRestoreRevision?: (version: PageBuilderVersion) => Promise<PageBuilderVersion | null>;
  hasAvailableCounterpartLocale?: boolean;
  onSwitchLocale?: (locale: CmsLocale) => void;
  entityOptions: PageBuilderEntityOption[];
  mediaImages: CmsMediaPickerItem[];
  workspaceLocale: CmsLocale;
}

function validate(page: PageBuilderPage, entityOptions: PageBuilderEntityOption[]): Record<string, string[]> {
  const issues: Record<string, string[]> = {};
  const effectiveSeoTitle = page.draft.seo.title?.trim() || page.name?.trim();
  if (!effectiveSeoTitle) issues.seo = ['SEO title không được để trống.'];
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
      if (limit && reference.entityIds.length > limit) {
        sectionIssues.push(`${entityTypeLabels[reference.entityType]} vượt giới hạn ${limit} mục.`);
      }
      if (new Set(reference.entityIds).size !== reference.entityIds.length) {
        sectionIssues.push(`${entityTypeLabels[reference.entityType]} có mục bị trùng.`);
      }
      const unavailableCount = reference.entityIds.filter((id) => {
        const option = entityOptions.find((item) => item.id === id && item.entityType === reference.entityType);
        return !option || (option.status ?? 'published') !== 'published';
      }).length;
      if (unavailableCount > 0) {
        sectionIssues.push(
          `${unavailableCount} ${entityTypeLabels[reference.entityType].toLowerCase()} không còn khả dụng hoặc chưa publish.`
        );
      }
    });
    if (sectionIssues.length > 0) issues[section.id] = sectionIssues;
  });
  return issues;
}

function resolveDefaultLinkTargetForSection(
  section: PageBuilderSection | undefined,
  activeHeroSlide: number
): ActiveLinkTarget | null {
  if (!section) return null;
  if (section.sectionKey === 'home.hero' && Array.isArray(section.config.slides)) {
    const idx = Math.min(activeHeroSlide, Math.max(0, section.config.slides.length - 1));
    return {
      mode: 'cta',
      sectionId: section.id,
      path: ['slides', idx, 'primaryCtaId'],
      fallbackLabel: 'Khám phá giải pháp',
    };
  }
  if ('videoUrl' in section.config || section.sectionKey === 'about.overview') {
    if (!('primaryCtaId' in section.config) && !('ctaUrl' in section.config)) {
      return {
        mode: 'video',
        sectionId: section.id,
        path: ['videoUrl'],
        initialUrl: String(section.config.videoUrl ?? ''),
      };
    }
  }
  if ('ctaUrl' in section.config) {
    return {
      mode: 'cta',
      sectionId: section.id,
      path: ['ctaUrl'],
      fallbackLabel: String(section.config.ctaLabel ?? 'Xem tất cả'),
    };
  }
  return {
    mode: 'cta',
    sectionId: section.id,
    path: ['primaryCtaId'],
    fallbackLabel: String(section.config.primaryCtaLabel ?? 'Tìm hiểu thêm'),
  };
}

export const PageBuilderEditor: React.FC<PageBuilderEditorProps> = ({
  page,
  onBack,
  onSaveDraft,
  onPreview,
  onPublish,
  onRestoreRevision,
  hasAvailableCounterpartLocale = false,
  onSwitchLocale,
  entityOptions,
  mediaImages,
  workspaceLocale,
}) => {
  const [editorHistory, setEditorHistory] = useState<{
    present: PageBuilderPage;
    past: PageBuilderPage[];
    future: PageBuilderPage[];
  }>(() => {
    const cloned = deepClone(page);
    if (!cloned.draft.seo.title?.trim()) {
      cloned.draft.seo.title = cloned.name ? `${cloned.name} | CIC Technology` : 'CIC Technology';
    }
    return { present: cloned, past: [], future: [] };
  });
  const workingPage = editorHistory.present;
  const past = editorHistory.past;
  const future = editorHistory.future;

  const commitWorkingPage = useCallback((updater: (current: PageBuilderPage) => PageBuilderPage) => {
    setEditorHistory((state) => {
      const next = updater(state.present);
      if (next === state.present) return state;
      return {
        present: next,
        past: [...state.past.slice(-49), deepClone(state.present)],
        future: [],
      };
    });
  }, []);

  const clearHistory = useCallback(() => {
    setEditorHistory((state) => ({ ...state, past: [], future: [] }));
  }, []);

  const [selectedSectionId, setSelectedSectionId] = useState<string>(
    () => page.draft.sections[0]?.id ?? ''
  );
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [canvasMode, setCanvasMode] = useState<'edit' | 'preview'>('edit');
  const [picker, setPicker] = useState<{
    sectionId: string;
    entityType: PageBuilderEntityType;
    selectedIds: string[];
    excludedIds?: string[];
    limit: number;
    replaceIndex?: number;
  } | null>(null);
  const [mediaPicker, setMediaPicker] = useState<{
    sectionId: string;
    path: Array<string | number>;
    currentId: string;
  } | null>(null);
  const [showValidation, setShowValidation] = useState(false);
  const [showMobileCanvas, setShowMobileCanvas] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [showSeoPanel, setShowSeoPanel] = useState(false);
  const [linkTarget, setLinkTarget] = useState<ActiveLinkTarget | null>(null);
  const [dataDrawerState, setDataDrawerState] = useState<{ open: boolean; tab: DataDrawerTab }>({
    open: false,
    tab: 'section',
  });
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [frameDoc, setFrameDoc] = useState<Document | null>(null);
  const [formatState, setFormatState] = useState<CanvasFormatState>(DEFAULT_CANVAS_FORMAT_STATE);
  const [pendingLeaveAction, setPendingLeaveAction] = useState<(() => void) | null>(null);
  const [restoringVersion, setRestoringVersion] = useState<number | null>(null);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const hasUnsavedEdits = past.length > 0;
  const issues = useMemo(() => validate(workingPage, entityOptions), [entityOptions, workingPage]);
  const issueCount = Object.values(issues).reduce((total, values) => total + values.length, 0);

  useEffect(() => {
    if (entityOptions && entityOptions.length > 0) {
      registerEntityOptions(entityOptions);
    }
  }, [entityOptions]);

  // Warn before closing browser tab if there are unsaved in-memory edits
  useEffect(() => {
    if (!hasUnsavedEdits) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [hasUnsavedEdits]);

  // Track active text selection inside iframe for Format Controls
  useEffect(() => {
    if (!frameDoc || canvasMode !== 'edit') {
      setFormatState(DEFAULT_CANVAS_FORMAT_STATE);
      return;
    }
    const syncFormat = () => {
      setFormatState(readCanvasFormatState(frameDoc));
    };
    frameDoc.addEventListener('selectionchange', syncFormat);
    frameDoc.addEventListener('focusin', syncFormat);
    frameDoc.addEventListener('focusout', syncFormat);
    frameDoc.addEventListener('keyup', syncFormat);
    frameDoc.addEventListener('mouseup', syncFormat);
    return () => {
      frameDoc.removeEventListener('selectionchange', syncFormat);
      frameDoc.removeEventListener('focusin', syncFormat);
      frameDoc.removeEventListener('focusout', syncFormat);
      frameDoc.removeEventListener('keyup', syncFormat);
      frameDoc.removeEventListener('mouseup', syncFormat);
    };
  }, [frameDoc, canvasMode]);

  const seedDefaultCollectionIfEmpty = (
    section: PageBuilderSection,
    path: Array<string | number>
  ): Record<string, PageBuilderConfigValue> => {
    const cfg = { ...(section.config || {}) };
    if (section.sectionKey === 'home.stats' && path[0] === 'items') {
      if (!Array.isArray(cfg.items) || cfg.items.length === 0) {
        cfg.items = deepClone(getLegacyHomePageContent().stats?.items ?? []) as any;
      }
    } else if (
      (section.sectionKey === 'home.awards' || section.sectionKey === 'about.awards') &&
      path[0] === 'items'
    ) {
      if (!Array.isArray(cfg.items) || cfg.items.length === 0) {
        cfg.items = deepClone(getLegacyHomePageContent().awards?.items ?? []) as any;
      }
    } else if (section.sectionKey === 'about.offerings' && path[0] === 'items') {
      if (!Array.isArray(cfg.items) || cfg.items.length === 0) {
        cfg.items = [
          {
            title: 'Phần mềm và Giải pháp Kỹ thuật',
            desc: 'Cung cấp bản quyền và giải pháp phần mềm chuyên ngành Xây dựng, Giao thông, Thủy lợi, Địa kỹ thuật từ các hãng hàng đầu thế giới.',
          },
          {
            title: 'Tư vấn Chuyển đổi số & BIM',
            desc: 'Tư vấn lộ trình chuyển đổi số, áp dụng Mô hình thông tin công trình (BIM), đào tạo và chuyển giao công nghệ cho doanh nghiệp.',
          },
          {
            title: 'Giải pháp Công nghệ thông minh',
            desc: 'Cung cấp và tư vấn ứng dụng các giải pháp công nghệ thông minh, AI, Big Data, IoT vào quản lý vận hành.',
          },
          {
            title: 'Giải pháp phát triển bền vững',
            desc: 'Tư vấn phát triển bền vững, Net Zero, EPD, ESG cho các doanh nghiệp xây dựng hướng tới tương lai xanh.',
          },
        ];
      }
    } else if (section.sectionKey === 'about.timeline' && path[0] === 'milestones') {
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
    } else if (
      (section.sectionKey === 'home.partners' || section.sectionKey === 'about.partners') &&
      path[0] === 'items'
    ) {
      if (!Array.isArray(cfg.items) || cfg.items.length === 0) {
        cfg.items = deepClone(getLegacyHomePageContent().partners?.items ?? []) as any;
      }
    } else if (section.sectionKey === 'about.partners' && path[0] === 'galleryImages') {
      if (!Array.isArray(cfg.galleryImages) || cfg.galleryImages.length === 0) {
        cfg.galleryImages = [
          'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&q=80',
        ];
      }
    } else if (section.sectionKey === 'about.experience' && path[0] === 'items') {
      if (!Array.isArray(cfg.items) || cfg.items.length === 0) {
        cfg.items = [
          {
            title: 'Phát triển nguồn nhân lực chất lượng cao',
            description:
              'Chú trọng đào tạo, phát triển nguồn nhân sự chất lượng cao, thu hút nhân sự trẻ, chất lượng, nhiệt huyết và sẵn sàng học hỏi, tiếp cận công nghệ mới.',
            imageId: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80',
          },
          {
            title: 'Đối tác chiến lược với các hãng công nghệ danh tiếng',
            description:
              'Hợp tác sâu rộng với hơn 100 hãng công nghệ, sản xuất phần mềm, thiết bị danh tiếng trên thế giới. Là partner chính thức tại Việt Nam.',
            imageId: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80',
          },
          {
            title: 'Cập nhật xu hướng công nghệ hàng đầu',
            description:
              'Đa dạng sản phẩm, dịch vụ về các giải pháp phần mềm, khoa học công nghệ hàng đầu trong các ngành kỹ thuật.',
            imageId: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80',
          },
        ];
      }
    }
    return cfg;
  };

  const updateSectionConfig = useCallback(
    (sectionId: string, path: Array<string | number>, value: PageBuilderConfigValue) => {
      commitWorkingPage((current) => ({
        ...current,
        draft: {
          ...current.draft,
          sections: current.draft.sections.map((section) => {
            if (section.id !== sectionId) return section;
            const seededConfig = seedDefaultCollectionIfEmpty(section, path);
            return { ...section, config: updateAtPath(seededConfig, path, value) };
          }),
        },
      }));
    },
    [commitWorkingPage]
  );

  const updateInlineText = useCallback(
    (sectionId: string, path: Array<string | number>, value: string) => {
      updateSectionConfig(sectionId, path, value);
    },
    [updateSectionConfig]
  );

  const handleApplyFormat = useCallback(
    (command: FormatCommandInput) => {
      const committed = applyCanvasFormatCommand(frameDoc, command);
      if (committed) {
        updateSectionConfig(committed.sectionId, committed.path, committed.value);
        setFormatState(readCanvasFormatState(frameDoc));
      }
    },
    [frameDoc, updateSectionConfig]
  );

  const updateReference = (sectionId: string, entityType: PageBuilderEntityType, ids: string[]) => {
    commitWorkingPage((current) => ({
      ...current,
      draft: {
        ...current.draft,
        sections: current.draft.sections.map((section) => {
          if (section.id !== sectionId) return section;
          const existing = section.references ?? [];
          const hasType = existing.some((reference) => reference.entityType === entityType);
          const nextRefs = hasType
            ? existing.map((reference) =>
                reference.entityType === entityType ? { ...reference, entityIds: ids } : reference
              )
            : [...existing, { entityType, entityIds: ids }];
          return { ...section, references: nextRefs };
        }),
      },
    }));
  };

  const updateReferenceSource = (
    sectionId: string,
    entityType: PageBuilderEntityType,
    source: NonNullable<PageBuilderSection['references']>[number]['source']
  ) => {
    commitWorkingPage((current) => ({
      ...current,
      draft: {
        ...current.draft,
        sections: current.draft.sections.map((section) => {
          if (section.id !== sectionId) return section;
          const existing = section.references ?? [];
          const hasType = existing.some((r) => r.entityType === entityType);
          const baseRefs = hasType ? existing : [...existing, { entityType, entityIds: [] }];
          return {
            ...section,
            references: baseRefs.map((reference) => {
              if (reference.entityType !== entityType) return reference;
              let nextEntityIds = reference.entityIds;
              if (source?.mode === 'featured') {
                const limit =
                  source?.limit ??
                  sectionDefinitions[section.sectionKey]?.referenceLimit?.[entityType] ??
                  4;
                const featuredEntities = entityOptions
                  .filter(
                    (opt) =>
                      opt.entityType === entityType &&
                      (opt.status ?? 'published') === 'published' &&
                      opt.meta?.isFeatured
                  )
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
    }));
  };

  const updateCollection = (
    sectionId: string,
    path: string,
    action: 'add' | 'duplicate' | 'remove' | 'previous' | 'next',
    index: number
  ) => {
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
      const isAwards =
        section?.sectionType === 'award_slider' ||
        section?.sectionType === 'awards' ||
        section?.sectionKey === 'home.awards' ||
        section?.sectionKey === 'about.awards';
      const isEcosystem =
        section?.sectionType === 'technology_ecosystem' ||
        section?.sectionType === 'ecosystem' ||
        section?.sectionKey === 'home.ecosystem';
      const isPartners =
        section?.sectionType === 'partner_marquee' ||
        section?.sectionType === 'partners' ||
        section?.sectionKey === 'home.partners' ||
        section?.sectionKey === 'about.partners';
      const defaults: Record<string, PageBuilderConfigValue> = {
        slides: {
          title: '',
          subtitle: '',
          backgroundImageId: '',
          mobileImageId: '',
          primaryCtaId: '',
          secondaryCtaId: '',
        },
        items: isAwards
          ? { name: 'Giải thưởng mới', imageId: '', img: '' }
          : isEcosystem
            ? {
                id: `ecosystem_${items.length + 1}`,
                title: 'Giải pháp mới',
                description: 'Nhập mô tả giải pháp.',
                badge: 'Công nghệ',
                imageId: '',
                link: '/products',
              }
            : isPartners
              ? { id: `partner_${items.length + 1}`, name: 'Đối tác mới', imageId: '', logo: '', link: '/' }
              : { value: 0, suffix: '+', label: '' },
        paragraphs: 'Nhập đoạn nội dung mới',
        tickerItems: 'Nhập thông báo mới',
        milestones: { year: '2026', title: 'Cột mốc mới', description: 'Nhập mô tả cột mốc.' },
        coreValues: { title: 'Giá trị mới', description: 'Nhập mô tả.' },
        slots: { slotKey: `slot_${items.length + 1}`, title: 'Giải pháp mới', description: 'Nhập mô tả.' },
        branches: {
          key: `branch_${items.length + 1}`,
          name: 'Chi nhánh mới',
          address: '',
          phone: '',
          email: '',
          workingHours: '',
          mapUrl: '',
        },
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
    if (
      section &&
      (section.sectionKey === 'about.awards' || section.sectionKey === 'about.partners') &&
      section.config.syncWithHome !== false
    ) {
      commitWorkingPage((curr) => ({
        ...curr,
        draft: {
          ...curr.draft,
          sections: curr.draft.sections.map((s) => {
            if (s.id !== sectionId) return s;
            const updatedConfig = updateAtPath(s.config, [path], items);
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

  const undo = useCallback(() => {
    setEditorHistory((state) => {
      const previous = state.past.at(-1);
      if (!previous) return state;
      return {
        present: deepClone(previous),
        past: state.past.slice(0, -1),
        future: [deepClone(state.present), ...state.future].slice(0, 50),
      };
    });
  }, []);

  const redo = useCallback(() => {
    setEditorHistory((state) => {
      const next = state.future[0];
      if (!next) return state;
      return {
        present: deepClone(next),
        past: [...state.past.slice(-49), deepClone(state.present)],
        future: state.future.slice(1),
      };
    });
  }, []);

  const updateSectionStructure = (sectionId: string, action: 'toggle' | 'up' | 'down') => {
    commitWorkingPage((current) => {
      const sections = current.draft.sections.map((section) => ({ ...section }));
      const index = sections.findIndex((section) => section.id === sectionId);
      if (index < 0) return current;
      const definition = sectionDefinitions[sections[index]!.sectionKey];
      if (action === 'toggle') {
        if (!definition?.canHide) return current;
        sections[index]!.visible = sections[index]!.visible === false;
      } else {
        const target = action === 'up' ? index - 1 : index + 1;
        if (target < 0 || target >= sections.length || !definition?.canMove) return current;
        [sections[index], sections[target]] = [sections[target]!, sections[index]!];
      }
      sections.forEach((section, position) => {
        section.position = position + 1;
      });
      return { ...current, draft: { ...current.draft, sections } };
    });
  };

  const restoreVersion = async (version: PageBuilderVersion) => {
    let resolvedVersion = version;
    if ((!version.sections || version.sections.length === 0) && onRestoreRevision) {
      setRestoringVersion(version.version);
      try {
        const loaded = await onRestoreRevision(version);
        if (!loaded) return;
        resolvedVersion = loaded;
      } finally {
        setRestoringVersion(null);
      }
    }
    commitWorkingPage((current) => ({
      ...current,
      draft: {
        ...deepClone(resolvedVersion),
        status: 'draft',
        version: current.draft.version,
        updatedAt: new Date().toISOString(),
        publishedAt: undefined,
      },
    }));
    setShowHistory(false);
  };

  const handleHeroAction = (
    sectionId: string,
    action: 'select' | 'add' | 'duplicate' | 'delete' | 'previous' | 'next' | 'movePrevious' | 'moveNext',
    index?: number
  ) => {
    const section = workingPage.draft.sections.find((item) => item.id === sectionId);
    const slides = Array.isArray(section?.config.slides) ? [...section.config.slides] : [];
    if (action === 'select' && typeof index === 'number') {
      setActiveHeroSlide(index);
      return;
    }
    if (action === 'previous') {
      setActiveHeroSlide((current) => Math.max(0, current - 1));
      return;
    }
    if (action === 'next') {
      setActiveHeroSlide((current) => Math.min(slides.length - 1, current + 1));
      return;
    }
    if (action === 'add') {
      slides.push({
        title: 'Slide mới — Giải pháp công nghệ CIC',
        subtitle: 'Nhập mô tả thông điệp cho slide này.',
        backgroundImageId: '',
        mobileImageId: '',
        primaryCtaId: '',
        secondaryCtaId: '',
      });
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

  const guardUnsavedThen = (action: () => void) => {
    if (hasUnsavedEdits) {
      setPendingLeaveAction(() => action);
    } else {
      action();
    }
  };

  const buildPageWithNormalizedSeo = () => ({
    ...workingPage,
    draft: {
      ...workingPage.draft,
      seo: {
        ...workingPage.draft.seo,
        title: workingPage.draft.seo.title?.trim() || `${workingPage.name} | CIC Technology`,
      },
    },
  });

  const handleSaveDraft = async () => {
    setShowValidation(true);
    if (issueCount === 0) {
      setIsSavingDraft(true);
      try {
        await onSaveDraft(buildPageWithNormalizedSeo());
        clearHistory();
      } finally {
        setIsSavingDraft(false);
      }
    }
  };

  const handlePublish = async () => {
    setShowValidation(true);
    if (issueCount === 0) {
      setIsPublishing(true);
      try {
        await onPublish(buildPageWithNormalizedSeo());
        clearHistory();
      } finally {
        setIsPublishing(false);
      }
    }
  };

  const selectedSection =
    workingPage.draft.sections.find((item) => item.id === selectedSectionId) ??
    workingPage.draft.sections[0];

  const handleSelectAndScrollSection = (sectionId: string) => {
    setSelectedSectionId(sectionId);
    if (frameDoc) {
      const targetNode = frameDoc.querySelector<HTMLElement>(
        `[data-page-builder-section-id="${sectionId}"]`
      );
      targetNode?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Deduplicate published version from history list
  const historyList = useMemo(() => {
    const seen = new Set<number>();
    const list: Array<PageBuilderVersion & { isCurrentPublished?: boolean }> = [];
    if (workingPage.published.version > 0) {
      seen.add(workingPage.published.version);
      list.push({ ...workingPage.published, isCurrentPublished: true });
    }
    for (const item of workingPage.history ?? []) {
      if (item.version > 0 && !seen.has(item.version)) {
        seen.add(item.version);
        list.push(item);
      }
    }
    return list;
  }, [workingPage.published, workingPage.history]);

  const activeLinkSection = linkTarget
    ? workingPage.draft.sections.find((s) => s.id === linkTarget.sectionId) ?? selectedSection
    : selectedSection;

  return (
    <div className="fixed inset-0 z-[60] flex min-h-0 flex-col bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* 2-TIER COLLAPSIBLE STICKY TOOLBAR */}
      <PageBuilderToolbar
        page={workingPage}
        workspaceLocale={workspaceLocale}
        hasAvailableCounterpartLocale={hasAvailableCounterpartLocale}
        onSwitchLocale={
          onSwitchLocale
            ? (nextLocale) => guardUnsavedThen(() => onSwitchLocale(nextLocale))
            : undefined
        }
        selectedSectionId={selectedSection?.id ?? ''}
        onSelectSection={handleSelectAndScrollSection}
        onSectionStructureAction={updateSectionStructure}
        viewport={viewport}
        onViewportChange={setViewport}
        canvasMode={canvasMode}
        onCanvasModeChange={setCanvasMode}
        formatState={formatState}
        onApplyFormat={handleApplyFormat}
        showSeoPanel={showSeoPanel}
        onToggleSeoPanel={() => setShowSeoPanel((v) => !v)}
        showLinkToolbar={Boolean(linkTarget)}
        onToggleLinkToolbar={() => {
          if (linkTarget) {
            setLinkTarget(null);
          } else {
            const resolved = resolveDefaultLinkTargetForSection(selectedSection, activeHeroSlide);
            if (resolved) setLinkTarget(resolved);
          }
        }}
        onOpenDataDrawer={(tab) => setDataDrawerState({ open: true, tab: tab ?? 'slides' })}
        showHistory={showHistory}
        onToggleHistory={() => setShowHistory((v) => !v)}
        canUndo={past.length > 0}
        canRedo={future.length > 0}
        hasUnsavedEdits={hasUnsavedEdits}
        onUndo={undo}
        onRedo={redo}
        isSavingDraft={isSavingDraft}
        isPublishing={isPublishing}
        onBack={() => guardUnsavedThen(onBack)}
        onSaveDraft={handleSaveDraft}
        onOpenPreviewModal={() => {
          setShowValidation(true);
          if (issueCount === 0) onPreview(buildPageWithNormalizedSeo());
        }}
        onPublish={handlePublish}
      />

      {/* INLINE GOOGLE SERP SEO PANEL */}
      {showSeoPanel && (
        <PageInlineSeoPanel
          pageName={workingPage.name}
          slug={workingPage.slug}
          workspaceLocale={workspaceLocale}
          seo={workingPage.draft.seo}
          onChange={(patch) => {
            commitWorkingPage((curr) => ({
              ...curr,
              draft: {
                ...curr.draft,
                seo: { ...curr.draft.seo, ...patch },
              },
            }));
          }}
          onClose={() => setShowSeoPanel(false)}
        />
      )}

      {/* INLINE LINK / CONTACT / VIDEO TOOLBAR */}
      {linkTarget && activeLinkSection && (
        <PageBuilderLinkToolbar
          target={linkTarget}
          section={activeLinkSection}
          entityOptions={entityOptions}
          onUpdateConfig={updateSectionConfig}
          onClose={() => setLinkTarget(null)}
        />
      )}

      {/* VALIDATION ISSUES BANNER */}
      {showValidation && issueCount > 0 && (
        <div className="shrink-0 border-b border-red-200 bg-red-50 px-5 py-2.5 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
          <div className="mb-1 flex items-center gap-2 font-bold">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Có {issueCount} điểm cần kiểm tra trước khi lưu hoặc xuất bản:</span>
          </div>
          <ul className="list-disc space-y-0.5 pl-6 text-xs">
            {Object.entries(issues).flatMap(([key, msgs]) =>
              msgs.map((msg, idx) => <li key={`${key}-${idx}`}>{msg}</li>)
            )}
          </ul>
        </div>
      )}

      {/* MAIN VISUAL WORKSPACE + OPTIONAL HISTORY PANEL */}
      <div
        className={`grid min-h-0 flex-1 gap-3 overflow-y-auto p-2.5 lg:overflow-hidden ${
          showHistory
            ? 'lg:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_400px]'
            : 'lg:grid-cols-1'
        }`}
      >
        <section className="flex min-h-0 min-w-0 flex-col rounded-xl bg-slate-100 dark:bg-slate-950">
          <div className="mb-1 flex justify-end lg:hidden">
            <button
              type="button"
              onClick={() => setShowMobileCanvas((value) => !value)}
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            >
              {showMobileCanvas ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {showMobileCanvas ? 'Thu gọn khung trang' : 'Hiện khung trang'}
            </button>
          </div>
          <div
            className={`${
              showMobileCanvas ? 'block' : 'hidden'
            } min-h-0 flex-1 overflow-auto rounded-xl bg-slate-200/80 p-2 lg:block dark:bg-slate-900`}
          >
            <PageBuilderVisualCanvas
              mode={canvasMode}
              workspaceLocale={workspaceLocale}
              page={workingPage}
              sections={workingPage.draft.sections}
              selectedId={selectedSectionId}
              issueIds={new Set(Object.keys(issues))}
              viewport={viewport}
              activeHeroSlide={activeHeroSlide}
              entityOptions={entityOptions}
              onFrameDocumentReady={setFrameDoc}
              onOpenDataDrawer={(tab, secId) => {
                if (secId) setSelectedSectionId(secId);
                setDataDrawerState({ open: true, tab });
              }}
              onSelect={(id) => {
                if (id) setSelectedSectionId(id);
              }}
              onTextChange={updateInlineText}
              onConfigValueChange={updateSectionConfig}
              onEditMedia={(sectionId, path, currentId) =>
                setMediaPicker({ sectionId, path, currentId })
              }
              onEditVideo={(sectionId, path, currentUrl) => {
                const section = workingPage.draft.sections.find((item) => item.id === sectionId);
                const fallbackUrl =
                  section?.sectionKey === 'about.overview'
                    ? 'https://www.youtube.com/watch?v=hdLFK_09-tU?start=448'
                    : '';
                setSelectedSectionId(sectionId);
                setLinkTarget({
                  mode: 'video',
                  sectionId,
                  path,
                  initialUrl: currentUrl || fallbackUrl,
                });
              }}
              onEditCta={(sectionId, path, currentLabel) => {
                setSelectedSectionId(sectionId);
                setLinkTarget({
                  mode: 'cta',
                  sectionId,
                  path,
                  fallbackLabel: currentLabel,
                });
              }}
              onSectionAction={updateSectionStructure}
              onReferenceSourceChange={updateReferenceSource}
              onReferenceItemsChange={updateReference}
              onCollectionAction={updateCollection}
              onPickReference={(sectionId, entityType, replaceIndex) => {
                const section = workingPage.draft.sections.find((item) => item.id === sectionId);
                const reference = section?.references?.find(
                  (item) => item.entityType === entityType
                );
                const limit =
                  sectionDefinitions[section?.sectionKey ?? '']?.referenceLimit?.[entityType] ?? 20;
                setPicker({
                  sectionId,
                  entityType,
                  selectedIds: replaceIndex === undefined ? reference?.entityIds ?? [] : [],
                  excludedIds:
                    replaceIndex === undefined
                      ? []
                      : reference?.entityIds.filter((_, index) => index !== replaceIndex),
                  limit: replaceIndex === undefined ? limit : 1,
                  replaceIndex,
                });
              }}
              onHeroAction={handleHeroAction}
            />
          </div>
        </section>

        {/* VERSION HISTORY SIDEBAR */}
        {showHistory && (
          <aside className="min-h-[420px] overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:min-h-0">
            <div className="sticky top-0 z-10 -mx-4 -mt-4 flex items-center justify-between border-b border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-orange-600" />
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">Lịch sử phiên bản</h2>
                  <p className="text-[11px] text-slate-500">
                    Khôi phục vào bản nháp, không ghi đè Website ngay.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowHistory(false)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                aria-label="Đóng lịch sử"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-2.5">
              {historyList.map((version) => {
                const isRestoringThis = restoringVersion === version.version;
                return (
                  <article
                    key={`${version.version}-${version.revisionId ?? version.publishedAt ?? 'pub'}`}
                    className="rounded-xl border border-slate-200 p-3 dark:border-slate-700"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-extrabold text-slate-900 dark:text-white">
                          Phiên bản v{version.version}
                        </p>
                        <p className="mt-0.5 text-[11px] text-slate-500">
                          {version.publishedAt
                            ? new Intl.DateTimeFormat('vi-VN', {
                                dateStyle: 'short',
                                timeStyle: 'short',
                              }).format(new Date(version.publishedAt))
                            : version.updatedAt
                              ? new Intl.DateTimeFormat('vi-VN', {
                                  dateStyle: 'short',
                                  timeStyle: 'short',
                                }).format(new Date(version.updatedAt))
                              : 'Phiên bản lưu trữ'}
                        </p>
                      </div>
                      {version.isCurrentPublished ? (
                        <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                          Đang xuất bản
                        </span>
                      ) : (
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                          {version.status === 'published' ? 'Đã xuất bản cũ' : 'Bản nháp cũ'}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      disabled={restoringVersion !== null}
                      onClick={() => void restoreVersion(version)}
                      className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 cursor-pointer"
                    >
                      {isRestoringThis && <Loader2 className="h-3.5 w-3.5 animate-spin text-orange-600" />}
                      <span>{isRestoringThis ? 'Đang tải phiên bản...' : 'Khôi phục thành bản nháp'}</span>
                    </button>
                  </article>
                );
              })}

              {historyList.length === 0 && (
                <p className="py-8 text-center text-xs text-slate-500">
                  Chưa có phiên bản lịch sử nào được ghi nhận.
                </p>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* SLIDE, DB SOURCES & SECTION CONFIG DRAWER */}
      <PageBuilderDataDrawer
        open={dataDrawerState.open}
        initialTab={dataDrawerState.tab}
        page={workingPage}
        selectedSectionId={selectedSection?.id ?? ''}
        activeHeroSlide={activeHeroSlide}
        issues={issues}
        entityOptions={entityOptions}
        mediaImages={mediaImages}
        onClose={() => setDataDrawerState((curr) => ({ ...curr, open: false }))}
        onSelectSection={handleSelectAndScrollSection}
        onActiveHeroSlideChange={setActiveHeroSlide}
        onUpdateSectionConfig={updateSectionConfig}
        onPickImage={(sectionId, path, currentId) => setMediaPicker({ sectionId, path, currentId })}
        onUpdateReference={updateReference}
        onUpdateReferenceSource={updateReferenceSource}
        onUpdateSectionStructure={updateSectionStructure}
      />

      {/* ENTITY PICKER MODAL */}
      {picker && (
        <PageEntityPickerModal
          isOpen
          entityType={picker.entityType}
          selectedIds={picker.selectedIds}
          limit={picker.limit}
          options={entityOptions.filter((option) => !picker.excludedIds?.includes(option.id))}
          onClose={() => setPicker(null)}
          onConfirm={(ids) => {
            if (picker.replaceIndex === undefined) {
              updateReference(picker.sectionId, picker.entityType, ids);
            } else {
              const section = workingPage.draft.sections.find((item) => item.id === picker.sectionId);
              const reference = section?.references?.find((item) => item.entityType === picker.entityType);
              if (reference && ids[0]) {
                const next = [...reference.entityIds];
                next[picker.replaceIndex] = ids[0];
                updateReference(picker.sectionId, picker.entityType, next);
              }
            }
          }}
        />
      )}

      {/* MEDIA LIBRARY PICKER MODAL */}
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
              const itemIdx = mediaPicker.path[1]!;
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

      {/* UNSAVED CHANGES GUARD MODAL */}
      {pendingLeaveAction && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
          onClick={() => setPendingLeaveAction(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                <AlertTriangle className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Bạn có thay đổi chưa lưu nháp
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  Các chỉnh sửa vừa thực hiện trên trang <strong>{workingPage.name}</strong> chưa được lưu vào Bản nháp. Bạn muốn lưu lại trước khi rời đi?
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingLeaveAction(null)}
                className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
              >
                Ở lại chỉnh tiếp
              </button>
              <button
                type="button"
                onClick={() => {
                  const next = pendingLeaveAction;
                  setPendingLeaveAction(null);
                  next();
                }}
                className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300 cursor-pointer"
              >
                Bỏ thay đổi & Rời đi
              </button>
              <button
                type="button"
                onClick={async () => {
                  const next = pendingLeaveAction;
                  setPendingLeaveAction(null);
                  await handleSaveDraft();
                  next();
                }}
                className="rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white hover:bg-orange-500 cursor-pointer"
              >
                Lưu nháp & Rời đi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PUBLISHING OVERLAY */}
      {isPublishing && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="flex max-w-sm flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400">
              <RefreshCw className="h-6 w-6 animate-spin" />
            </div>
            <p className="text-base font-bold text-slate-900 dark:text-white">Đang xuất bản trang...</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Hệ thống đang đồng bộ nội dung và xuất bản ra Website công khai. Vui lòng đợi trong giây lát.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
