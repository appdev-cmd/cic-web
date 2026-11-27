/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { findPageBuilderImage } from '../PageMediaPickerModal';
import { draftSectionSchemas } from '../pageBuilderDraftSchema';
import { entityTypeLabels, sectionDefinitions } from '../pageBuilderRegistry';
import { parseLocaleNumber, parseNumberAndSuffix } from '../../../../shared/visual-editing/inlineTextEditing';
import { serializeInlineElementValue } from '../builder/canvasTextFormatter';
import type { DataDrawerTab } from '../builder/PageBuilderDataDrawer';
import type {
  PageBuilderConfigValue,
  PageBuilderEntityOption,
  PageBuilderEntityType,
  PageBuilderPage,
  PageBuilderSection,
} from '../pageBuilderTypes';

export function editableNodes(root: HTMLElement, page: PageBuilderPage): HTMLElement[] {
  const explicitNodes = Array.from(root.querySelectorAll<HTMLElement>('[data-page-builder-section-key]'));
  if (explicitNodes.length) return explicitNodes;
  if (
    page.pageType === 'home' ||
    page.pageType === 'about' ||
    page.pageType === 'organization' ||
    page.pageType === 'capacity_experience' ||
    page.pageType === 'contact'
  ) {
    return Array.from(root.querySelectorAll<HTMLElement>('section'));
  }
  if (page.pageType === 'legal') {
    const header = root.querySelector<HTMLElement>('header');
    const articleSections = Array.from(root.querySelectorAll<HTMLElement>('article section'));
    return [header, ...articleSections].filter((node): node is HTMLElement => Boolean(node));
  }
  return [];
}

export const inlineEditableKeys = new Set([
  'title',
  'subtitle',
  'sub',
  'description',
  'desc',
  'badge',
  'eyebrow',
  'phone',
  'email',
  'name',
  'address',
  'workingHours',
  'vision',
  'mission',
  'label',
  'text',
  'submitLabel',
  'successTitle',
  'successMessage',
  'categoryTag',
  'readingTime',
  'lastUpdated',
  'ctaLabel',
]);

export function hasHtml(value: string): boolean {
  return /<[a-z][\s\S]*>/i.test(value);
}

export function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function normalizeText(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

export function configValueAtPath(
  config: Record<string, PageBuilderConfigValue>,
  path: Array<string | number>
) {
  return path.reduce<PageBuilderConfigValue | undefined>((value, part) => {
    if (!value || typeof value !== 'object') return undefined;
    if (Array.isArray(value) && typeof part === 'string' && !/^\d+$/.test(part)) {
      const found = value.find(
        (item) =>
          item &&
          typeof item === 'object' &&
          ((item as any).id === part || (item as any).entityId === part || (item as any).key === part)
      );
      if (found) return found;
    }
    return (value as Record<string | number, PageBuilderConfigValue>)[part];
  }, config);
}

export function youtubeVideoId(url: string): string {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{6,})/i);
  return match?.[1] ?? '';
}

export function ctaEntriesForSection(
  section: PageBuilderSection,
  activeHeroSlide = 0,
  sectionRoot?: HTMLElement
) {
  const entries = Object.keys(section.config)
    .filter((key) => key.toLowerCase().endsWith('ctaid') && typeof section.config[key] === 'string')
    .map((key) => ({ key, path: [key] as Array<string | number> }));
  if (section.sectionKey === 'home.intro' && !entries.some((e) => e.key === 'primaryCtaId')) {
    entries.push({ key: 'primaryCtaId', path: ['primaryCtaId'] });
  }
  if (sectionRoot) {
    const explicitCtaNodes = Array.from(
      sectionRoot.querySelectorAll<HTMLElement>('[data-page-builder-cta-key]')
    );
    explicitCtaNodes.forEach((node) => {
      try {
        const path = JSON.parse(node.dataset.pageBuilderCtaKey ?? '[]');
        const key = String(path[path.length - 1] ?? '');
        if (key && !entries.some((e) => JSON.stringify(e.path) === JSON.stringify(path))) {
          entries.push({ key, path });
        }
      } catch {}
    });
  }
  if (section.sectionKey !== 'home.hero' || !Array.isArray(section.config.slides)) return entries;
  const slideIndex = Math.min(activeHeroSlide, Math.max(0, section.config.slides.length - 1));
  const slide = section.config.slides[slideIndex];
  if (!slide || typeof slide !== 'object' || Array.isArray(slide)) return entries;
  ['primaryCtaId', 'secondaryCtaId'].forEach((key) => {
    const p = ['slides', slideIndex, key];
    if (!entries.some((e) => JSON.stringify(e.path) === JSON.stringify(p))) {
      entries.push({ key, path: p });
    }
  });
  return entries;
}

function isExcludedFromHeuristicTextMatch(node: HTMLElement, claimed: Set<HTMLElement>): boolean {
  if (claimed.has(node)) return true;
  if (
    node.closest(
      '[data-page-builder-action], [data-page-collection], [data-ve-semantic~="reference-item"], [data-page-builder-cta-key], [contenteditable="true"]'
    )
  ) {
    return true;
  }
  if (node.querySelector('[contenteditable="true"]')) return true;
  for (const existing of claimed) {
    if (existing.contains(node) || node.contains(existing)) return true;
  }
  return false;
}

export function findTextNode(
  root: HTMLElement,
  value: string,
  claimed: Set<HTMLElement>
): HTMLElement | null {
  const expected = normalizeText(stripHtml(value));
  if (!expected) return null;
  const candidates = Array.from(
    root.querySelectorAll<HTMLElement>('h1,h2,h3,h4,h5,h6,p,span,li,blockquote')
  );
  return (
    candidates.find((node) => {
      if (isExcludedFromHeuristicTextMatch(node, claimed)) return false;
      return normalizeText(node.textContent ?? '').toLowerCase() === expected.toLowerCase();
    }) ?? null
  );
}

export function findFallbackNode(
  root: HTMLElement,
  fieldKey: string,
  claimed: Set<HTMLElement>
): HTMLElement | null {
  const selectors: Record<string, string> = {
    title: 'h1,h2,h3,h4',
    subtitle: 'p',
    description: 'p',
    text: 'p',
    badge: 'span,p',
    eyebrow: 'span,p',
    phone: 'a,p,span',
    email: 'a,p,span',
    submitLabel: 'button',
  };
  const selector = selectors[fieldKey];
  if (!selector) return null;
  return (
    Array.from(root.querySelectorAll<HTMLElement>(selector)).find((node) => {
      if (isExcludedFromHeuristicTextMatch(node, claimed)) return false;
      return normalizeText(node.textContent ?? '').length > 1;
    }) ?? null
  );
}

const ENTITY_ADMIN_HREF: Record<PageBuilderEntityType, string> = {
  project: '/cms/projects',
  event: '/cms/events',
  news: '/cms/news',
  product: '/cms/products',
  service: '/cms/services',
  partner: '/cms/products',
};

export interface CanvasDomEnhancerParams {
  root: HTMLElement | null;
  frame: HTMLIFrameElement | null;
  scale: number;
  page: PageBuilderPage;
  sections: PageBuilderSection[];
  selectedId?: string;
  issueIds: Set<string>;
  viewport: 'desktop' | 'tablet' | 'mobile';
  mode?: 'edit' | 'preview';
  activeHeroSlide?: number;
  entityOptions?: PageBuilderEntityOption[];
  onSelect: (id: string) => void;
  onTextChange?: (sectionId: string, path: Array<string | number>, value: string) => void;
  onConfigValueChange?: (
    sectionId: string,
    path: Array<string | number>,
    value: PageBuilderConfigValue
  ) => void;
  onSectionAction?: (sectionId: string, action: 'toggle' | 'up' | 'down') => void;
  onReferenceSourceChange?: (
    sectionId: string,
    entityType: NonNullable<PageBuilderSection['references']>[number]['entityType'],
    source: NonNullable<NonNullable<PageBuilderSection['references']>[number]['source']>
  ) => void;
  onPickReference?: (
    sectionId: string,
    entityType: NonNullable<PageBuilderSection['references']>[number]['entityType'],
    replaceIndex?: number
  ) => void;
  onReferenceItemsChange?: (
    sectionId: string,
    entityType: NonNullable<PageBuilderSection['references']>[number]['entityType'],
    ids: string[]
  ) => void;
  onCollectionAction?: (
    sectionId: string,
    path: string,
    action: 'add' | 'duplicate' | 'remove' | 'previous' | 'next',
    index: number
  ) => void;
  onHeroAction?: (
    sectionId: string,
    action: 'select' | 'add' | 'duplicate' | 'delete' | 'previous' | 'next' | 'movePrevious' | 'moveNext',
    index?: number
  ) => void;
  onEditMedia?: (sectionId: string, path: Array<string | number>, currentId: string) => void;
  onEditVideo?: (
    sectionId: string,
    path: Array<string | number>,
    currentUrl: string,
    anchor: { left: number; top: number }
  ) => void;
  onEditCta?: (
    sectionId: string,
    path: Array<string | number>,
    currentLabel: string,
    anchor: { left: number; top: number }
  ) => void;
  onOpenDataDrawer?: (tab: DataDrawerTab, sectionId?: string) => void;
}

export function setupCanvasDomEnhancements(params: CanvasDomEnhancerParams): () => void {
  const {
    root,
    frame,
    scale,
    page,
    sections,
    issueIds,
    mode = 'preview',
    activeHeroSlide = 0,
    onSelect,
    onTextChange,
    onConfigValueChange,
    onHeroAction,
    onEditMedia,
    onEditVideo,
    onEditCta,
    onOpenDataDrawer,
  } = params;

  if (!root || page.pageType === 'legal') return () => undefined;

  const doc = root.ownerDocument;
  const isEdit = mode === 'edit' && Boolean(onConfigValueChange || onTextChange);
  const nodes = editableNodes(root, page);

  if (page.pageType === 'home') {
    root.style.display = 'flex';
    root.style.flexDirection = 'column';
  }

  const cleanups: Array<() => void> = [];

  // Shared floating image/video hover pill (exact robot-web cms-overlay-badges UX)
  let floatingMediaBtn: HTMLButtonElement | null = null;
  let activeMediaTarget: {
    node: HTMLElement;
    label: string;
    onClick: () => void;
  } | null = null;
  let hideMediaTimer = 0;

  if (isEdit) {
    floatingMediaBtn = doc.createElement('button');
    floatingMediaBtn.type = 'button';
    floatingMediaBtn.dataset.pageBuilderAction = 'floating-media-pill';
    floatingMediaBtn.style.cssText =
      'position:fixed;z-index:2147483646;display:none;align-items:center;gap:6px;border:1px solid rgba(255,255,255,.35);border-radius:999px;padding:6px 12px;background:rgba(15,23,42,.92);color:#fff;font:700 11px/1.2 system-ui;box-shadow:0 8px 20px rgba(15,23,42,.28);cursor:pointer;backdrop-filter:blur(6px);';

    const onPillEnter = () => doc.defaultView?.clearTimeout(hideMediaTimer);
    const onPillLeave = () => {
      floatingMediaBtn!.style.display = 'none';
      activeMediaTarget = null;
    };
    const onPillClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      activeMediaTarget?.onClick();
    };
    floatingMediaBtn.addEventListener('mouseenter', onPillEnter);
    floatingMediaBtn.addEventListener('mouseleave', onPillLeave);
    floatingMediaBtn.addEventListener('click', onPillClick);
    doc.body.appendChild(floatingMediaBtn);
    cleanups.push(() => {
      doc.defaultView?.clearTimeout(hideMediaTimer);
      floatingMediaBtn?.removeEventListener('mouseenter', onPillEnter);
      floatingMediaBtn?.removeEventListener('mouseleave', onPillLeave);
      floatingMediaBtn?.removeEventListener('click', onPillClick);
      floatingMediaBtn?.remove();
    });
  }

  const showFloatingMediaPill = (
    targetNode: HTMLElement,
    label: string,
    onClick: () => void
  ) => {
    if (!floatingMediaBtn) return;
    doc.defaultView?.clearTimeout(hideMediaTimer);
    const rect = targetNode.getBoundingClientRect();
    if (rect.width < 24 || rect.height < 20) return;
    activeMediaTarget = { node: targetNode, label, onClick };
    floatingMediaBtn.textContent = label;
    floatingMediaBtn.style.left = `${Math.max(8, rect.left + 10)}px`;
    floatingMediaBtn.style.top = `${Math.max(8, rect.top + 10)}px`;
    floatingMediaBtn.style.display = 'inline-flex';
  };

  const scheduleHideFloatingMediaPill = () => {
    if (!floatingMediaBtn) return;
    doc.defaultView?.clearTimeout(hideMediaTimer);
    hideMediaTimer = doc.defaultView?.setTimeout(() => {
      if (floatingMediaBtn) floatingMediaBtn.style.display = 'none';
      activeMediaTarget = null;
    }, 140) ?? 0;
  };

  // Helper to wire any editable text element uniformly across ALL sections
  const wireInlineEditable = (
    section: PageBuilderSection,
    node: HTMLElement,
    path: Array<string | number>,
    rawVal: unknown
  ) => {
    if (!isEdit || path.length === 0) return;
    const isNumeric =
      typeof rawVal === 'number' ||
      (section.sectionKey === 'home.stats' && path[path.length - 1] === 'value');
    const richCapable = !isNumeric;
    const fieldKey = String(path[path.length - 1] ?? '');

    node.contentEditable = 'true';
    node.spellcheck = false;
    node.dataset.pageBuilderInlineEdit = path.join('-');
    node.dataset.pageBuilderSectionRef = section.id;
    node.dataset.pageBuilderFieldPath = JSON.stringify(path);
    if (richCapable) {
      node.dataset.pageBuilderRichInline = 'true';
    }
    node.setAttribute('role', 'textbox');
    node.title = 'Nhấp để gõ sửa trực tiếp hoặc tô chọn để chỉnh cỡ chữ / màu sắc trên thanh công cụ';

    let initialSerialized = richCapable
      ? serializeInlineElementValue(node)
      : (node.textContent?.trim() ?? '');
    let reactOwnedChildren: Node[] = [];

    const onFocus = () => {
      initialSerialized = richCapable
        ? serializeInlineElementValue(node)
        : (node.textContent?.trim() ?? '');
      reactOwnedChildren = Array.from(node.childNodes);
      onSelect(section.id);
    };

    const restoreReactDomBeforeCommit = () => {
      if (reactOwnedChildren.length > 0 && !node.dataset.pageBuilderConfigPath) {
        try {
          node.replaceChildren(...reactOwnedChildren);
        } catch {}
      }
    };

    const commitValue = () => {
      const plainText = (node.textContent ?? '').trim();
      const nextSerialized = richCapable ? serializeInlineElementValue(node) : plainText;
      if (nextSerialized === initialSerialized) return;
      initialSerialized = nextSerialized;
      restoreReactDomBeforeCommit();

      if (isNumeric) {
        const parsed = parseNumberAndSuffix(plainText);
        if (parsed !== null && onConfigValueChange) {
          onConfigValueChange(section.id, path, parsed.value);
          if (path[path.length - 1] === 'value') {
            const suffixPath = [...path.slice(0, -1), 'suffix'];
            const currentSuffix = configValueAtPath(section.config, suffixPath);
            if (
              typeof currentSuffix === 'string' &&
              parsed.suffix !== undefined &&
              parsed.suffix !== currentSuffix
            ) {
              onConfigValueChange(section.id, suffixPath, parsed.suffix);
            }
          }
          return;
        }
        const num = parseLocaleNumber(plainText);
        if (num !== null && onConfigValueChange) {
          onConfigValueChange(section.id, path, num);
        }
        return;
      }

      if (onConfigValueChange) {
        onConfigValueChange(section.id, path, nextSerialized);
      } else if (onTextChange) {
        onTextChange(section.id, path, nextSerialized);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const multiline = [
        'description',
        'desc',
        'subtitle',
        'sub',
        'text',
        'address',
        'vision',
        'mission',
      ].includes(fieldKey) || path[0] === 'paragraphs';
      if (e.key === 'Enter' && !e.shiftKey && !multiline) {
        e.preventDefault();
        node.blur();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        node.blur();
      }
    };

    node.addEventListener('focus', onFocus);
    node.addEventListener('blur', commitValue);
    node.addEventListener('keydown', onKeyDown);
    cleanups.push(() => {
      node.removeEventListener('focus', onFocus);
      node.removeEventListener('blur', commitValue);
      node.removeEventListener('keydown', onKeyDown);
      delete node.dataset.pageBuilderInlineEdit;
      delete node.dataset.pageBuilderRichInline;
      delete node.dataset.pageBuilderSectionRef;
      delete node.dataset.pageBuilderFieldPath;
      node.removeAttribute('contenteditable');
      node.removeAttribute('role');
      node.removeAttribute('title');
    });
  };

  // Helper to wire media hover + click replacement
  const wireMediaReplace = (
    section: PageBuilderSection,
    mediaNode: HTMLElement,
    path: Array<string | number>,
    currentMediaId: string,
    label = '🖼️ Thay ảnh',
    allowDirectClick = true
  ) => {
    if (!isEdit || !onEditMedia) return;
    mediaNode.dataset.pageBuilderMediaPath = JSON.stringify(path);
    mediaNode.dataset.pageBuilderMediaId = currentMediaId;

    const trigger = () => {
      onSelect(section.id);
      onEditMedia(section.id, path, currentMediaId);
    };

    const onEnter = () => showFloatingMediaPill(mediaNode, label, trigger);
    const onLeave = () => scheduleHideFloatingMediaPill();
    mediaNode.addEventListener('mouseenter', onEnter);
    mediaNode.addEventListener('mouseleave', onLeave);

    let onClick: ((e: MouseEvent) => void) | null = null;
    if (allowDirectClick) {
      mediaNode.style.cursor = 'pointer';
      onClick = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        trigger();
      };
      mediaNode.addEventListener('click', onClick);
    }

    cleanups.push(() => {
      mediaNode.removeEventListener('mouseenter', onEnter);
      mediaNode.removeEventListener('mouseleave', onLeave);
      if (onClick) mediaNode.removeEventListener('click', onClick);
      mediaNode.style.cursor = '';
    });
  };

  // Process every section uniformly (NO layout-breaking height overrides!)
  nodes.forEach((node, index) => {
    const section =
      sections.find((item) => item.sectionKey === node.dataset.pageBuilderSectionKey) ??
      sections[index];
    if (!section) return;
    const definition = sectionDefinitions[section.sectionKey];

    node.dataset.pageBuilderSectionId = section.id;
    node.dataset.pageBuilderSectionKey = section.sectionKey;
    node.style.display = section.visible === false ? (isEdit ? '' : 'none') : '';
    node.style.opacity = section.visible === false && isEdit ? '0.32' : '';
    node.style.order = page.pageType === 'home' ? String(section.position) : '';
    // Ensure we NEVER lock height!
    node.style.height = '';
    node.style.minHeight = '';

    if (!isEdit) return;

    const computedPos = doc.defaultView?.getComputedStyle(node).position;
    if (!computedPos || computedPos === 'static') {
      node.style.position = 'relative';
    }

    // Subtle section hover label (top-left, pointer-events: none)
    const hoverBadge = doc.createElement('span');
    hoverBadge.dataset.pageBuilderAction = 'section-hover-label';
    hoverBadge.textContent = `${section.position}. ${definition?.label ?? section.sectionKey}${
      section.visible === false ? ' (Đang ẩn)' : ''
    }`;
    hoverBadge.style.cssText =
      'position:absolute;z-index:45;left:14px;top:10px;display:none;border-radius:999px;padding:4px 10px;background:rgba(234,88,12,.92);color:#fff;font:700 11px/1.2 system-ui;box-shadow:0 4px 12px rgba(15,23,42,.18);pointer-events:none;';
    node.appendChild(hoverBadge);

    const onSecEnter = () => {
      node.style.outline = '1px dashed rgba(234, 88, 12, 0.45)';
      node.style.outlineOffset = '-1px';
      hoverBadge.style.display = 'inline-block';
    };
    const onSecLeave = () => {
      node.style.outline = issueIds.has(section.id) ? '1px solid rgba(239, 68, 68, 0.7)' : '';
      node.style.outlineOffset = '';
      hoverBadge.style.display = 'none';
    };
    node.addEventListener('mouseenter', onSecEnter);
    node.addEventListener('mouseleave', onSecLeave);
    cleanups.push(() => {
      node.removeEventListener('mouseenter', onSecEnter);
      node.removeEventListener('mouseleave', onSecLeave);
      hoverBadge.remove();
      node.style.outline = '';
      node.style.outlineOffset = '';
    });

    // Clean Top-Right Contextual Pill Badge (Exact robot-web cms-overlay-badges style)
    const makePillButton = (
      label: string,
      handler: () => void,
      variant: 'primary' | 'ghost' | 'active' = 'ghost',
      disabled = false
    ) => {
      const btn = doc.createElement('button');
      btn.type = 'button';
      btn.textContent = label;
      btn.disabled = disabled;
      const styles =
        variant === 'primary' || variant === 'active'
          ? 'border:1px solid #ea580c;background:#ea580c;color:#fff;'
          : 'border:1px solid rgba(255,255,255,.22);background:rgba(255,255,255,.12);color:#fff;';
      btn.style.cssText = `${styles}border-radius:999px;padding:4px 9px;font:700 11px/1.2 system-ui;cursor:${
        disabled ? 'not-allowed' : 'pointer'
      };opacity:${disabled ? '0.4' : '1'};white-space:nowrap;`;
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) handler();
      });
      return btn;
    };

    if (section.sectionKey === 'home.hero' && Array.isArray(section.config.slides)) {
      const slides = section.config.slides;
      const slideIdx = Math.min(activeHeroSlide, Math.max(0, slides.length - 1));
      const slide = slides[slideIdx] as Record<string, any> | undefined;
      const currentImg = String(slide?.backgroundImageId || slide?.img || '');

      const heroPill = doc.createElement('div');
      heroPill.dataset.pageBuilderAction = 'hero-pill';
      heroPill.style.cssText =
        'position:absolute;z-index:50;right:16px;top:14px;display:flex;flex-wrap:wrap;align-items:center;gap:5px;padding:5px 8px;border:1px solid rgba(255,255,255,.22);border-radius:999px;background:rgba(15,23,42,.86);color:#fff;box-shadow:0 8px 24px rgba(15,23,42,.28);backdrop-filter:blur(8px);';

      heroPill.appendChild(
        makePillButton('‹', () => onHeroAction?.(section.id, 'previous'), 'ghost', slideIdx <= 0)
      );
      slides.forEach((_, idx) => {
        heroPill.appendChild(
          makePillButton(
            String(idx + 1),
            () => onHeroAction?.(section.id, 'select', idx),
            idx === slideIdx ? 'active' : 'ghost'
          )
        );
      });
      heroPill.appendChild(
        makePillButton(
          '›',
          () => onHeroAction?.(section.id, 'next'),
          'ghost',
          slideIdx >= slides.length - 1
        )
      );

      if (onEditMedia) {
        heroPill.appendChild(
          makePillButton(`🖼️ Đổi ảnh Slide ${slideIdx + 1}`, () => {
            onSelect(section.id);
            onEditMedia(section.id, ['slides', slideIdx, 'backgroundImageId'], currentImg);
          })
        );
      }

      if (onOpenDataDrawer) {
        heroPill.appendChild(
          makePillButton(
            '⚙️ Quản lý Slide',
            () => onOpenDataDrawer('slides', section.id),
            'primary'
          )
        );
      }

      node.appendChild(heroPill);
      cleanups.push(() => heroPill.remove());
    } else if (section.sectionKey === 'about.hero' && onEditMedia) {
      const bgId = String(section.config.backgroundImageId ?? '');
      const aboutHeroPill = doc.createElement('div');
      aboutHeroPill.dataset.pageBuilderAction = 'about-hero-pill';
      aboutHeroPill.style.cssText =
        'position:absolute;z-index:50;right:16px;top:14px;display:flex;align-items:center;gap:6px;padding:5px 8px;border:1px solid rgba(255,255,255,.22);border-radius:999px;background:rgba(15,23,42,.86);color:#fff;backdrop-filter:blur(8px);';
      aboutHeroPill.appendChild(
        makePillButton(
          '🖼️ Đổi ảnh nền Hero',
          () => {
            onSelect(section.id);
            onEditMedia(section.id, ['backgroundImageId'], bgId);
          },
          'primary'
        )
      );
      node.appendChild(aboutHeroPill);
      cleanups.push(() => aboutHeroPill.remove());
    } else if (['home.projects', 'home.events', 'home.news'].includes(section.sectionKey)) {
      const entityType: PageBuilderEntityType =
        section.sectionKey === 'home.projects'
          ? 'project'
          : section.sectionKey === 'home.events'
            ? 'event'
            : 'news';
      const ref = section.references?.find((r) => r.entityType === entityType);
      const isManual = ref?.source?.mode === 'manual';
      const count = ref?.entityIds.length ?? 0;

      const dbBadge = doc.createElement('div');
      dbBadge.dataset.pageBuilderAction = 'dynamic-source-pill';
      dbBadge.style.cssText =
        'position:absolute;z-index:48;right:16px;top:12px;display:flex;align-items:center;gap:6px;padding:4px 6px 4px 10px;border:1px solid #fed7aa;border-radius:999px;background:rgba(255,255,255,.96);color:#0f172a;font:700 11px/1.2 system-ui;box-shadow:0 6px 18px rgba(15,23,42,.08);';

      const infoSpan = doc.createElement('span');
      infoSpan.textContent = `${isManual ? '📌 Thủ công' : '⚡ Tự động'}: ${count} ${entityTypeLabels[
        entityType
      ].toLowerCase()}`;
      infoSpan.style.cssText = 'color:#9a3412;font-weight:800;';
      dbBadge.appendChild(infoSpan);

      if (onOpenDataDrawer) {
        const pickBtn = doc.createElement('button');
        pickBtn.type = 'button';
        pickBtn.textContent = 'Chọn nguồn hiển thị';
        pickBtn.style.cssText =
          'border:0;border-radius:999px;padding:5px 10px;background:#ea580c;color:#fff;font:700 11px/1 system-ui;cursor:pointer;';
        pickBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          onOpenDataDrawer(`source:${entityType}` as DataDrawerTab, section.id);
        });
        dbBadge.appendChild(pickBtn);
      }

      const extLink = doc.createElement('a');
      extLink.href = ENTITY_ADMIN_HREF[entityType];
      extLink.target = '_blank';
      extLink.rel = 'noopener noreferrer';
      extLink.textContent = 'Quản lý gốc ↗';
      extLink.style.cssText =
        'border:1px solid #cbd5e1;border-radius:999px;padding:4px 9px;background:#f8fafc;color:#334155;font:700 11px/1 system-ui;text-decoration:none;';
      extLink.addEventListener('click', (e) => e.stopPropagation());
      dbBadge.appendChild(extLink);

      node.appendChild(dbBadge);
      cleanups.push(() => dbBadge.remove());
    } else if (
      onOpenDataDrawer &&
      [
        'home.awards',
        'about.awards',
        'home.partners',
        'about.partners',
        'home.ecosystem',
      ].includes(section.sectionKey)
    ) {
      const targetTab: DataDrawerTab = section.sectionKey.endsWith('awards')
        ? 'awards'
        : section.sectionKey.endsWith('partners')
          ? 'partners'
          : 'ecosystem';
      const quickBtn = doc.createElement('button');
      quickBtn.type = 'button';
      quickBtn.dataset.pageBuilderAction = 'collection-pill';
      quickBtn.textContent = `⚙️ Quản lý ${definition?.label ?? 'danh sách'}`;
      quickBtn.style.cssText =
        'position:absolute;z-index:48;right:16px;top:12px;border:1px solid #fed7aa;border-radius:999px;padding:6px 12px;background:rgba(255,255,255,.96);color:#c2410c;font:800 11px/1 system-ui;box-shadow:0 6px 18px rgba(15,23,42,.08);cursor:pointer;';
      quickBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        onOpenDataDrawer(targetTab, section.id);
      });
      node.appendChild(quickBtn);
      cleanups.push(() => quickBtn.remove());
    }

    if (section.visible === false) return;

    // --- INLINE TEXT, MEDIA, VIDEO & CTA SCANNING FOR THIS SECTION ---
    const claimed = new Set<HTMLElement>();

    // A) Explicit RichText containers
    node.querySelectorAll<HTMLElement>('[data-page-builder-richtext-path]').forEach((rtNode) => {
      try {
        const path = JSON.parse(rtNode.dataset.pageBuilderRichtextPath ?? '[]') as Array<
          string | number
        >;
        if (!path.length) return;
        claimed.add(rtNode);
        rtNode.contentEditable = 'true';
        const onRtFocus = () => onSelect(section.id);
        const onRtBlur = () => onConfigValueChange?.(section.id, path, rtNode.innerHTML);
        rtNode.addEventListener('focus', onRtFocus);
        rtNode.addEventListener('blur', onRtBlur);
        cleanups.push(() => {
          rtNode.removeEventListener('focus', onRtFocus);
          rtNode.removeEventListener('blur', onRtBlur);
          rtNode.removeAttribute('contenteditable');
        });
      } catch {}
    });

    // B) Explicit [data-page-builder-config-path] & [data-ve-element] bindings
    node
      .querySelectorAll<HTMLElement>('[data-page-builder-config-path], [data-ve-element]')
      .forEach((boundNode) => {
        let path: Array<string | number> = [];
        if (boundNode.dataset.pageBuilderConfigPath) {
          try {
            path = JSON.parse(boundNode.dataset.pageBuilderConfigPath) as Array<string | number>;
          } catch {}
        } else if (boundNode.dataset.veElement && boundNode.dataset.veEditable === 'true') {
          const firstBinding = boundNode.dataset.veElement.split(' ')[0] ?? '';
          path = firstBinding.split('.').map((p) => (/^\d+$/.test(p) ? Number(p) : p));
        }
        if (
          path.length >= 3 &&
          Array.isArray(section.config[path[0] as string]) &&
          typeof path[1] === 'string'
        ) {
          const arr = section.config[path[0] as string] as any[];
          const idx = arr.findIndex(
            (item) =>
              item &&
              typeof item === 'object' &&
              (item.id === path[1] || item.entityId === path[1] || item.key === path[1])
          );
          if (idx >= 0) path[1] = idx;
        }
        if (!path.length) return;
        const val = configValueAtPath(section.config, path);
        if (val !== undefined && typeof val !== 'string' && typeof val !== 'number') return;
        claimed.add(boundNode);
        wireInlineEditable(section, boundNode, path, val);
      });

    // C) Top-level & active Hero Slide string fields (fallback for components without explicit data-* attrs)
    const inlineEntries: Array<{ path: Array<string | number>; value: unknown }> = Object.entries(
      section.config
    ).map(([k, v]) => ({ path: [k], value: v }));

    if (section.sectionKey === 'home.hero' && Array.isArray(section.config.slides)) {
      const slideIdx = Math.min(activeHeroSlide, Math.max(0, section.config.slides.length - 1));
      const slide = section.config.slides[slideIdx];
      if (slide && typeof slide === 'object' && !Array.isArray(slide)) {
        Object.entries(slide).forEach(([k, v]) => {
          inlineEntries.push({ path: ['slides', slideIdx, k], value: v });
        });
      }
    }

    const allowHeuristicFallback = !['home.projects', 'home.events', 'home.news'].includes(
      section.sectionKey
    );
    inlineEntries.forEach(({ path, value }) => {
      const fieldKey = String(path[path.length - 1] ?? '');
      if (!inlineEditableKeys.has(fieldKey) || typeof value !== 'string' || !value.trim()) return;
      const targetNode =
        findTextNode(node, value, claimed) ??
        (allowHeuristicFallback ? findFallbackNode(node, fieldKey, claimed) : null);
      if (!targetNode || claimed.has(targetNode)) return;
      claimed.add(targetNode);
      wireInlineEditable(section, targetNode, path, value);
    });

    // D) Embedded collection items (awards, ecosystem, milestones, coreValues, offerings, experience)
    (draftSectionSchemas[section.sectionKey] ?? [])
      .filter((el) => el.kind === 'collection' && el.key !== 'slides')
      .forEach((el) => {
        const items = section.config[el.key];
        if (!Array.isArray(items)) return;
        const claimedCards = new Set<HTMLElement>();
        items.forEach((item, itemIdx) => {
          const rec =
            item && typeof item === 'object' && !Array.isArray(item)
              ? (item as Record<string, PageBuilderConfigValue>)
              : null;
          if (!rec) return;
          const idText = Object.values(rec).find(
            (v) => typeof v === 'string' && !v.startsWith('/') && !v.startsWith('http') && v.trim().length > 1
          );
          const matchedText =
            typeof idText === 'string' ? findTextNode(node, idText, new Set()) : null;
          let card = matchedText;
          while (
            card?.parentElement &&
            card.parentElement !== node &&
            !/rounded|shadow|border|grid|flex-none|group/.test(card.className)
          ) {
            card = card.parentElement;
          }
          if (!card || card === node || claimedCards.has(card)) return;
          claimedCards.add(card);

          Object.entries(rec).forEach(([fKey, fVal]) => {
            if (typeof fVal !== 'string' && typeof fVal !== 'number') return;
            if (/image|img|logo|media/i.test(fKey)) {
              const imgEl = card!.querySelector<HTMLImageElement>('img');
              if (imgEl && !claimed.has(imgEl)) {
                claimed.add(imgEl);
                wireMediaReplace(
                  section,
                  imgEl,
                  [el.key, itemIdx, fKey],
                  String(fVal),
                  `🖼️ Đổi ảnh #${itemIdx + 1}`
                );
              }
              return;
            }
            if (!String(fVal).trim()) return;
            const fieldEl = findTextNode(card!, String(fVal), claimed);
            if (fieldEl) {
              claimed.add(fieldEl);
              wireInlineEditable(section, fieldEl, [el.key, itemIdx, fKey], fVal);
            }
          });
        });
      });

    // E) Explicit [data-page-builder-media-path] & section top-level image
    const explicitMediaNodes = Array.from(
      node.querySelectorAll<HTMLElement>('[data-page-builder-media-path]')
    );
    if (explicitMediaNodes.length > 0) {
      explicitMediaNodes.forEach((mNode) => {
        if (claimed.has(mNode)) return;
        try {
          const path = JSON.parse(mNode.dataset.pageBuilderMediaPath ?? '[]') as Array<
            string | number
          >;
          const currentVal =
            mNode.dataset.pageBuilderMediaId || String(configValueAtPath(section.config, path) ?? '');
          const asset = findPageBuilderImage(currentVal);
          if (asset && mNode.tagName === 'IMG') {
            (mNode as HTMLImageElement).src = asset.thumbnail_url ?? asset.url;
          }
          claimed.add(mNode);
          const isHeroBg = section.sectionKey === 'home.hero' || section.sectionKey === 'about.hero';
          wireMediaReplace(
            section,
            mNode,
            path,
            currentVal,
            isHeroBg ? '🖼️ Thay ảnh nền Banner' : '🖼️ Thay ảnh',
            !isHeroBg
          );
        } catch {}
      });
    } else if (section.sectionKey !== 'home.hero') {
      const topImgEntry = Object.entries(section.config).find(
        ([k, v]) => ['imageId', 'backgroundImageId'].includes(k) && typeof v === 'string'
      );
      const firstImg = node.querySelector<HTMLImageElement>('img');
      if (topImgEntry && firstImg && !claimed.has(firstImg)) {
        claimed.add(firstImg);
        const isAboutHero = section.sectionKey === 'about.hero';
        wireMediaReplace(
          section,
          firstImg,
          [topImgEntry[0]],
          String(topImgEntry[1]),
          '🖼️ Thay ảnh',
          !isAboutHero
        );
      }
    }

    // F) Video boxes ([data-page-builder-video-path])
    node.querySelectorAll<HTMLElement>('[data-page-builder-video-path]').forEach((vNode) => {
      if (!onEditVideo) return;
      try {
        const path = JSON.parse(vNode.dataset.pageBuilderVideoPath ?? '[]') as Array<
          string | number
        >;
        if (!path.length) return;
        const iframe = vNode.querySelector<HTMLIFrameElement>('iframe');
        const fallbackUrl =
          vNode.dataset.pageBuilderVideoUrl ||
          iframe?.src ||
          'https://www.youtube.com/watch?v=hdLFK_09-tU?start=448';
        const currentUrl = String(configValueAtPath(section.config, path) || fallbackUrl || '');
        const vidId = youtubeVideoId(currentUrl);
        const thumbImg = vNode.querySelector<HTMLImageElement>('img');
        if (iframe && vidId) iframe.src = `https://www.youtube.com/embed/${vidId}`;
        if (thumbImg && vidId) thumbImg.src = `https://img.youtube.com/vi/${vidId}/maxresdefault.jpg`;

        const openVideoEditor = () => {
          onSelect(section.id);
          const rect = vNode.getBoundingClientRect();
          const frameRect = frame?.getBoundingClientRect();
          const liveVal = String(
            configValueAtPath(section.config, path) || vNode.dataset.pageBuilderVideoUrl || currentUrl
          );
          onEditVideo(section.id, path, liveVal, {
            left: (frameRect?.left ?? 0) + rect.left * scale,
            top: (frameRect?.top ?? 0) + rect.bottom * scale + 8,
          });
        };

        const onVEnter = () =>
          showFloatingMediaPill(vNode, '🎬 Đổi Video YouTube / Vimeo', openVideoEditor);
        const onVLeave = () => scheduleHideFloatingMediaPill();
        const onVClick = (e: MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          openVideoEditor();
        };
        vNode.addEventListener('mouseenter', onVEnter);
        vNode.addEventListener('mouseleave', onVLeave);
        vNode.addEventListener('click', onVClick, true);
        cleanups.push(() => {
          vNode.removeEventListener('mouseenter', onVEnter);
          vNode.removeEventListener('mouseleave', onVLeave);
          vNode.removeEventListener('click', onVClick, true);
        });
      } catch {}
    });

    // G) CTA Buttons & Links
    const ctaEntries = ctaEntriesForSection(section, activeHeroSlide, node);
    const actionCandidates = Array.from(node.querySelectorAll<HTMLElement>('a,button')).filter(
      (el) => !el.closest('[data-page-builder-action]')
    );
    const linkCandidates = actionCandidates.filter((el) => el.tagName === 'A');
    const labeledCandidates = actionCandidates.filter(
      (el) => !el.getAttribute('aria-label') && normalizeText(el.textContent ?? '').length > 2
    );
    const ctaNodes = linkCandidates.length >= ctaEntries.length ? linkCandidates : labeledCandidates;

    ctaEntries.forEach(({ key, path }, ctaIdx) => {
      const serializedPath = JSON.stringify(path);
      const ctaNode =
        node.querySelector<HTMLElement>(`[data-page-builder-cta-key='${serializedPath}']`) ??
        ctaNodes[ctaIdx];
      if (!ctaNode) return;
      ctaNode.dataset.pageBuilderCtaKey = serializedPath;

      // Sync stored label/url/newTab overrides (both top-level & slide-level)
      const parentObj =
        path.length > 1
          ? (configValueAtPath(section.config, path.slice(0, -1)) as Record<string, unknown> | undefined)
          : (section.config as Record<string, unknown>);
      const baseKey = key.endsWith('Url') ? key.replace(/Url$/, '') : key;
      const overrideLabel = parentObj?.[`${baseKey}Label`];
      const overrideUrl = key.endsWith('Url') ? parentObj?.[key] : parentObj?.[`${baseKey}Url`];
      const overrideNewTab = parentObj?.[`${baseKey}NewTab`];

      if (typeof overrideLabel === 'string' && overrideLabel.trim()) {
        const span = ctaNode.querySelector('span');
        if (span) span.textContent = overrideLabel;
        else ctaNode.textContent = overrideLabel;
      }
      if (ctaNode.tagName === 'A' && typeof overrideUrl === 'string' && overrideUrl.trim()) {
        ctaNode.setAttribute('href', overrideUrl);
      }
      if (ctaNode.tagName === 'A') {
        if (overrideNewTab) ctaNode.setAttribute('target', '_blank');
        else ctaNode.removeAttribute('target');
      }

      if (onEditCta) {
        ctaNode.title = 'Nhấp để gắn Link, Số điện thoại hoặc Zalo cho nút này';
      }
    });
  });

  return () => {
    cleanups.forEach((fn) => fn());
  };
}
