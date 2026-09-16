/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { findPageBuilderImage } from '../PageMediaPickerModal';
import { draftSectionSchemas } from '../pageBuilderDraftSchema';
import { entityTypeLabels, sectionDefinitions } from '../pageBuilderRegistry';
import { directEditingSectionKeys } from '../visualElementEditingAdapters';
import type { 
  PageBuilderConfigValue, 
  PageBuilderEntityOption, 
  PageBuilderPage, 
  PageBuilderSection 
} from '../pageBuilderTypes';

export function editableNodes(root: HTMLElement, page: PageBuilderPage): HTMLElement[] {
  const explicitNodes = Array.from(root.querySelectorAll<HTMLElement>('[data-page-builder-section-key]'));
  if (explicitNodes.length) return explicitNodes;
  if (page.pageType === 'home' || page.pageType === 'about' || page.pageType === 'organization' || page.pageType === 'capacity_experience' || page.pageType === 'contact') {
    return Array.from(root.querySelectorAll<HTMLElement>('section'));
  }
  if (page.pageType === 'legal') {
    const header = root.querySelector<HTMLElement>('header');
    const articleSections = Array.from(root.querySelectorAll<HTMLElement>('article section'));
    return [header, ...articleSections].filter((node): node is HTMLElement => Boolean(node));
  }
  const pageRoot = root.querySelector<HTMLElement>('.max-w-7xl');
  if (!pageRoot) return [];
  const header = pageRoot.firstElementChild as HTMLElement | null;
  const columns = pageRoot.children[1] as HTMLElement | undefined;
  const columnChildren = columns ? Array.from(columns.querySelectorAll<HTMLElement>(':scope > div > div')) : [];
  return [header, ...columnChildren].filter((node): node is HTMLElement => Boolean(node));
}

export const inlineEditableKeys = new Set([
  'title', 'subtitle', 'description', 'badge', 'eyebrow', 'phone', 'email', 'name', 
  'address', 'workingHours', 'vision', 'mission', 'label', 'text', 'submitLabel', 
  'successTitle', 'successMessage', 'categoryTag', 'readingTime', 'lastUpdated',
  'ctaLabel'
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

export function configValueAtPath(config: Record<string, PageBuilderConfigValue>, path: Array<string | number>) {
  return path.reduce<PageBuilderConfigValue | undefined>((value, part) => {
    if (!value || typeof value !== 'object') return undefined;
    return (value as Record<string | number, PageBuilderConfigValue>)[part];
  }, config);
}

export function youtubeVideoId(url: string): string {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{6,})/i);
  return match?.[1] ?? '';
}

export function ctaEntriesForSection(section: PageBuilderSection, activeHeroSlide = 0, sectionRoot?: HTMLElement) {
  const entries = Object.keys(section.config)
    .filter((key) => key.toLowerCase().endsWith('ctaid') && typeof section.config[key] === 'string')
    .map((key) => ({ key, path: [key] as Array<string | number> }));
  if (section.sectionKey === 'home.intro' && !entries.some((e) => e.key === 'primaryCtaId')) {
    entries.push({ key: 'primaryCtaId', path: ['primaryCtaId'] });
  }
  if (sectionRoot) {
    const explicitCtaNodes = Array.from(sectionRoot.querySelectorAll<HTMLElement>('[data-page-builder-cta-key]'));
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
    if (typeof slide[key] === 'string') entries.push({ key, path: ['slides', slideIndex, key] });
  });
  return entries;
}

export function findTextNode(root: HTMLElement, value: string, claimed: Set<HTMLElement>): HTMLElement | null {
  const expected = normalizeText(stripHtml(value));
  if (!expected) return null;
  const candidates = Array.from(root.querySelectorAll<HTMLElement>('h1,h2,h3,h4,h5,h6,p,span,a,button,li,div'));
  return candidates.find((node) => {
    if (claimed.has(node)) return false;
    return normalizeText(node.textContent ?? '') === expected;
  }) ?? null;
}

export function findFallbackNode(root: HTMLElement, fieldKey: string, claimed: Set<HTMLElement>): HTMLElement | null {
  const selectors: Record<string, string> = {
    title: 'h1,h2,h3,h4', subtitle: 'p', description: 'p', text: 'p', badge: 'span,p', eyebrow: 'span,p',
    phone: 'a,p', email: 'a,p', label: 'span', submitLabel: 'button', successTitle: 'h2,h3', successMessage: 'p',
  };
  const selector = selectors[fieldKey];
  if (!selector) return null;
  return Array.from(root.querySelectorAll<HTMLElement>(selector)).find((node) => !claimed.has(node) && !node.dataset.pageBuilderAction) ?? null;
}

export interface CanvasDomEnhancerParams {
  root: HTMLElement | null;
  frame: HTMLIFrameElement | null;
  scale: number;
  page: PageBuilderPage;
  sections: PageBuilderSection[];
  selectedId: string;
  issueIds: Set<string>;
  viewport: 'desktop' | 'tablet' | 'mobile';
  mode?: 'edit' | 'preview';
  activeHeroSlide?: number;
  entityOptions?: PageBuilderEntityOption[];
  onSelect: (id: string) => void;
  onTextChange?: (sectionId: string, path: Array<string | number>, value: string) => void;
  onConfigValueChange?: (sectionId: string, path: Array<string | number>, value: PageBuilderConfigValue) => void;
  onSectionAction?: (sectionId: string, action: 'toggle' | 'up' | 'down') => void;
  onReferenceSourceChange?: (sectionId: string, entityType: NonNullable<PageBuilderSection['references']>[number]['entityType'], source: NonNullable<NonNullable<PageBuilderSection['references']>[number]['source']>) => void;
  onPickReference?: (sectionId: string, entityType: NonNullable<PageBuilderSection['references']>[number]['entityType'], replaceIndex?: number) => void;
  onReferenceItemsChange?: (sectionId: string, entityType: NonNullable<PageBuilderSection['references']>[number]['entityType'], ids: string[]) => void;
  onCollectionAction?: (sectionId: string, path: string, action: 'add' | 'duplicate' | 'remove' | 'previous' | 'next', index: number) => void;
  onHeroAction?: (sectionId: string, action: 'select' | 'add' | 'duplicate' | 'delete' | 'previous' | 'next' | 'movePrevious' | 'moveNext', index?: number) => void;
  onEditMedia?: (sectionId: string, path: Array<string | number>, currentId: string) => void;
  onEditVideo?: (sectionId: string, path: Array<string | number>, currentUrl: string, anchor: { left: number; top: number }) => void;
  onEditCta?: (sectionId: string, path: Array<string | number>, currentLabel: string, anchor: { left: number; top: number }) => void;
}

export function setupCanvasDomEnhancements(params: CanvasDomEnhancerParams): () => void {
  const {
    root,
    frame,
    scale,
    page,
    sections,
    selectedId,
    issueIds,
    viewport,
    mode = 'preview',
    activeHeroSlide = 0,
    entityOptions = [],
    onSelect,
    onTextChange,
    onConfigValueChange,
    onSectionAction,
    onReferenceSourceChange,
    onPickReference,
    onReferenceItemsChange,
    onCollectionAction,
    onHeroAction,
    onEditMedia,
    onEditVideo,
    onEditCta,
  } = params;

  if (!root || page.pageType === 'legal') return () => undefined;

  const nodes = editableNodes(root, page);
  if (page.pageType === 'home') {
    root.style.display = 'flex';
    root.style.flexDirection = 'column';
  }

  const actionCleanups: Array<() => void> = [];

  // 1. Setup Section wrappers, hover borders, and toolbars
  nodes.forEach((node, index) => {
    const section = sections.find((item) => item.sectionKey === node.dataset.pageBuilderSectionKey) ?? sections[index];
    if (!section) return;
    const definition = sectionDefinitions[section.sectionKey];
    const allowsCollectionStructureChanges = 
      section.sectionType === 'hero_carousel' || section.sectionKey === 'home.hero' || 
      section.sectionType === 'award_slider' || section.sectionType === 'awards' || section.sectionKey === 'home.awards' || 
      section.sectionType === 'technology_ecosystem' || section.sectionType === 'ecosystem' || section.sectionKey === 'home.ecosystem' || 
      section.sectionType === 'partner_marquee' || section.sectionType === 'partners' || section.sectionKey === 'home.partners';

    node.dataset.pageBuilderSectionId = section.id;
    node.dataset.pageBuilderSectionKey = section.sectionKey;
    node.style.display = section.visible === false ? (onTextChange ? '' : 'none') : '';
    node.style.opacity = section.visible === false && onTextChange ? '0.28' : '';
    node.style.order = page.pageType === 'home' ? String(section.position) : '';

    if (mode === 'edit' && directEditingSectionKeys.has(section.sectionKey)) {
      node.classList.remove('cursor-pointer', 'transition-[outline,box-shadow]');
      node.style.outline = '';
      node.style.outlineOffset = '';
      node.style.boxShadow = '';
      return;
    }

    node.classList.add('relative');
    if (onTextChange) node.classList.add('cursor-pointer', 'transition-[outline,box-shadow]');
    node.style.outline = onTextChange 
      ? (section.id === selectedId 
          ? (section.sectionKey === 'home.hero' ? '' : '2px solid rgb(249 115 22 / .78)') 
          : issueIds.has(section.id) ? '1px solid rgb(239 68 68 / .8)' : '') 
      : '';
    node.style.outlineOffset = '-2px';
    node.style.boxShadow = '';

    const hoverLabel = node.ownerDocument.createElement('span');
    hoverLabel.dataset.pageBuilderAction = 'hover-label';
    hoverLabel.textContent = definition?.label ?? section.sectionKey;
    hoverLabel.style.cssText = 'position:absolute;z-index:2147483645;left:18px;top:10px;display:none;border-radius:7px;padding:7px 10px;background:#f97316;color:#fff;font:800 12px/1 system-ui;box-shadow:0 6px 18px rgb(15 23 42 / .2);pointer-events:none;';
    node.appendChild(hoverLabel);

    const showHover = () => { 
      if (onTextChange && section.id !== selectedId) { 
        node.style.outline = '2px solid rgb(249 115 22 / .42)'; 
        hoverLabel.style.display = 'block'; 
      } 
    };
    const hideHover = () => { 
      if (onTextChange && section.id !== selectedId) { 
        node.style.outline = issueIds.has(section.id) ? '1px solid rgb(239 68 68 / .8)' : ''; 
        hoverLabel.style.display = 'none'; 
      } 
    };
    node.addEventListener('mouseenter', showHover);
    node.addEventListener('mouseleave', hideHover);
    actionCleanups.push(() => { 
      node.removeEventListener('mouseenter', showHover); 
      node.removeEventListener('mouseleave', hideHover); 
    });

    if (section.id === selectedId && onTextChange) {
      const productionHeight = node.getBoundingClientRect().height;
      const isHero = section.sectionKey === 'home.hero';
      node.style.position = 'relative';
      node.style.height = isHero ? `${productionHeight}px` : 'auto';
      node.style.minHeight = `${productionHeight}px`;
      node.style.overflow = isHero ? 'hidden' : 'visible';

      const toolbar = node.ownerDocument.createElement('div');
      toolbar.dataset.pageBuilderAction = 'context';
      toolbar.style.cssText = isHero
        ? `display:flex;align-items:center;gap:${viewport === 'desktop' ? '7px' : '4px'};max-width:min(920px,100%);min-height:${viewport === 'desktop' ? '48px' : '40px'};padding:${viewport === 'desktop' ? '7px 9px' : '4px 5px'};border:1px solid rgba(255,255,255,.24);border-radius:12px;background:rgba(15,23,42,.92);color:#fff;font:600 12px/1.2 system-ui;white-space:nowrap;overflow-x:${viewport === 'desktop' ? 'auto' : 'hidden'};box-shadow:0 12px 32px rgba(15,23,42,.3);backdrop-filter:blur(10px);`
        : 'display:flex;align-items:center;gap:8px;width:100%;min-height:52px;padding:8px 10px;border-bottom:1px solid #e2e8f0;background:#fff;color:#334155;font:600 13px/1.2 system-ui;white-space:nowrap;overflow-x:auto;';

      const addButton = (label: string, handler: () => void, disabled = false) => {
        const button = node.ownerDocument.createElement('button');
        button.type = 'button'; 
        button.textContent = label; 
        button.disabled = disabled;
        button.style.cssText = isHero
          ? `min-height:${viewport === 'desktop' ? '34px' : '30px'};border:1px solid ${disabled ? 'rgba(255,255,255,.08)' : 'rgba(255,255,255,.2)'};border-radius:8px;padding:${viewport === 'desktop' ? '7px 10px' : '5px 7px'};background:${disabled ? 'rgba(255,255,255,.04)' : 'rgba(255,255,255,.1)'};color:${disabled ? '#64748b' : '#fff'};font:800 ${viewport === 'desktop' ? '12px' : '11px'}/1 system-ui;cursor:${disabled ? 'not-allowed' : 'pointer'};`
          : `min-height:36px;border:1px solid ${disabled ? '#e2e8f0' : '#cbd5e1'};border-radius:8px;padding:8px 11px;background:${disabled ? '#f8fafc' : '#fff'};color:${disabled ? '#94a3b8' : '#334155'};font:700 12px/1 system-ui;cursor:${disabled ? 'not-allowed' : 'pointer'};`;
        const click = (event: MouseEvent) => { 
          event.preventDefault(); 
          event.stopPropagation(); 
          if (!disabled) handler(); 
        };
        button.addEventListener('click', click); 
        toolbar.appendChild(button);
        actionCleanups.push(() => button.removeEventListener('click', click));
      };

      if (section.sectionKey === 'home.hero' && Array.isArray(section.config.slides)) {
        const slides = section.config.slides;
        addButton('‹', () => onHeroAction?.(section.id, 'previous'), activeHeroSlide <= 0);
        const status = node.ownerDocument.createElement('span'); 
        status.textContent = viewport === 'desktop' ? `Slide ${activeHeroSlide + 1} / ${slides.length}` : `${activeHeroSlide + 1}/${slides.length}`; 
        status.style.cssText = 'padding:0 4px;font-weight:800;color:#fff;'; 
        toolbar.appendChild(status);
        addButton('›', () => onHeroAction?.(section.id, 'next'), activeHeroSlide >= slides.length - 1);

        if (viewport === 'desktop') {
          slides.forEach((slide, slideIndex) => {
            const thumbnailButton = node.ownerDocument.createElement('button');
            thumbnailButton.type = 'button';
            thumbnailButton.draggable = true;
            thumbnailButton.title = `Slide ${slideIndex + 1}`;
            thumbnailButton.style.cssText = `width:42px;height:30px;padding:2px;border:${slideIndex === activeHeroSlide ? '2px solid #f97316' : '1px solid #cbd5e1'};border-radius:7px;background:#fff;overflow:hidden;cursor:pointer;flex:0 0 auto;`;
            const imageId = slide && typeof slide === 'object' && !Array.isArray(slide) ? String(slide.backgroundImageId ?? '') : '';
            const asset = imageId ? findPageBuilderImage(imageId) : null;
            if (asset) {
              const image = node.ownerDocument.createElement('img');
              image.src = asset.thumbnail_url ?? asset.url;
              image.alt = `Slide ${slideIndex + 1}`;
              image.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;border-radius:4px;';
              thumbnailButton.appendChild(image);
            } else {
              thumbnailButton.textContent = String(slideIndex + 1);
            }
            const selectSlide = (event: MouseEvent) => { 
              event.preventDefault(); 
              event.stopPropagation(); 
              onHeroAction?.(section.id, 'select', slideIndex); 
            };
            thumbnailButton.addEventListener('click', selectSlide);
            const dragStart = (event: DragEvent) => { 
              event.dataTransfer?.setData('text/page-builder-slide-index', String(slideIndex)); 
              if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move'; 
              thumbnailButton.style.opacity = '.45'; 
            };
            const dragOver = (event: DragEvent) => { 
              event.preventDefault(); 
              thumbnailButton.style.borderColor = '#f97316'; 
            };
            const dragLeave = () => { 
              thumbnailButton.style.borderColor = slideIndex === activeHeroSlide ? '#f97316' : '#cbd5e1'; 
            };
            const drop = (event: DragEvent) => { 
              event.preventDefault(); 
              const from = Number(event.dataTransfer?.getData('text/page-builder-slide-index')); 
              dragLeave(); 
              if (!Number.isInteger(from) || from === slideIndex) return; 
              const reordered = [...slides]; 
              const [moved] = reordered.splice(from, 1); 
              reordered.splice(slideIndex, 0, moved); 
              onConfigValueChange?.(section.id, ['slides'], reordered); 
              onHeroAction?.(section.id, 'select', slideIndex); 
            };
            const dragEnd = () => { 
              thumbnailButton.style.opacity = ''; 
              dragLeave(); 
            };
            thumbnailButton.addEventListener('dragstart', dragStart); 
            thumbnailButton.addEventListener('dragover', dragOver); 
            thumbnailButton.addEventListener('dragleave', dragLeave); 
            thumbnailButton.addEventListener('drop', drop); 
            thumbnailButton.addEventListener('dragend', dragEnd);
            toolbar.appendChild(thumbnailButton);
            actionCleanups.push(() => { 
              thumbnailButton.removeEventListener('click', selectSlide); 
              thumbnailButton.removeEventListener('dragstart', dragStart); 
              thumbnailButton.removeEventListener('dragover', dragOver); 
              thumbnailButton.removeEventListener('dragleave', dragLeave); 
              thumbnailButton.removeEventListener('drop', drop); 
              thumbnailButton.removeEventListener('dragend', dragEnd); 
            });
          });
        }
        addButton('+', () => onHeroAction?.(section.id, 'add'));
        addButton('Nhân bản', () => onHeroAction?.(section.id, 'duplicate'));
        addButton('Xóa', () => onHeroAction?.(section.id, 'delete'), slides.length <= 1);
      } else if (section.sectionKey === 'home.awards' && Array.isArray(section.config.items)) {
        const items = section.config.items;
        const label = node.ownerDocument.createElement('strong');
        label.textContent = `Giải thưởng · ${items.length} mục`;
        label.style.cssText = 'padding:0 5px;color:#0f172a;';
        toolbar.appendChild(label);
        addButton('+ Thêm', () => onCollectionAction?.(section.id, 'items', 'add', items.length));
      } else if ((section.sectionType === 'partner_marquee' || section.sectionType === 'partners' || section.sectionKey === 'home.partners') && Array.isArray(section.config.items)) {
        const items = section.config.items;
        const label = node.ownerDocument.createElement('strong');
        label.textContent = `Logo đối tác · ${items.length} ảnh`;
        label.style.cssText = 'padding:0 5px;color:#0f172a;';
        toolbar.appendChild(label);
        addButton('+ Thêm logo đối tác', () => onCollectionAction?.(section.id, 'items', 'add', items.length));
      } else if (section.references?.length) {
        section.references.forEach((reference) => {
          const entityLabel = node.ownerDocument.createElement('strong');
          entityLabel.textContent = sectionDefinitions[section.sectionKey]?.label ?? reference.entityType;
          entityLabel.style.cssText = 'padding:0 5px;color:#0f172a;';
          toolbar.appendChild(entityLabel);
          if (['home.projects', 'home.events', 'home.news'].includes(section.sectionKey)) {
            const limit = sectionDefinitions[section.sectionKey]?.referenceLimit?.[reference.entityType] ?? reference.source?.limit ?? reference.entityIds.length;
            const mode = (reference.source?.mode as string | undefined) ?? 'featured';
            const isFeatured = mode !== 'manual';
            addButton(
              isFeatured ? `⚡ Tự động: Nổi bật (${reference.entityIds.length})` : 'Chuyển sang Tự động',
              () => onReferenceSourceChange?.(section.id, reference.entityType, { mode: 'featured', limit }),
              isFeatured,
            );
            addButton(
              !isFeatured ? `⚙️ Chọn thủ công (${reference.entityIds.length})` : 'Chuyển sang Thủ công',
              () => onReferenceSourceChange?.(section.id, reference.entityType, { mode: 'manual', limit }),
              !isFeatured,
            );
            if (!isFeatured && reference.entityIds.length < limit) {
              addButton(`+ Thêm ${entityTypeLabels[reference.entityType] || 'mục'}`, () => onPickReference?.(section.id, reference.entityType));
            }
          }
        });
      }

      if (definition?.canHide) addButton(section.visible === false ? 'Hiện' : 'Ẩn', () => onSectionAction?.(section.id, 'toggle'));
      if (definition?.canMove) {
        addButton('↑', () => onSectionAction?.(section.id, 'up'), section.position <= 2);
        addButton('↓', () => onSectionAction?.(section.id, 'down'), section.position >= sections.length - 1);
      }

      const draftLayer = node.ownerDocument.createElement('div');
      draftLayer.dataset.pageBuilderAction = 'draft-layer';
      draftLayer.style.cssText = isHero
        ? `position:absolute;z-index:2147483646;left:50%;bottom:${viewport === 'mobile' ? '14px' : '60px'};transform:translateX(-50%);max-width:100%;background:transparent;color:#fff;font-family:system-ui;pointer-events:auto;`
        : 'position:relative;z-index:2147483646;margin:0;background:transparent;color:#334155;font-family:system-ui;';

      const surfaceHeader = node.ownerDocument.createElement('div');
      surfaceHeader.style.cssText = 'display:none;';
      const surfaceTitle = node.ownerDocument.createElement('strong');
      surfaceTitle.textContent = `${definition?.label ?? section.sectionKey} · Đang chỉnh sửa`;
      surfaceTitle.style.cssText = 'font:800 13px/1.2 system-ui;color:#9a3412;';
      const surfaceHint = node.ownerDocument.createElement('span');
      surfaceHint.textContent = 'Card chính là vùng chỉnh sửa · kéo trực tiếp để sắp xếp';
      surfaceHint.style.cssText = 'font:600 11px/1.2 system-ui;color:#78716c;';
      surfaceHeader.append(surfaceTitle, surfaceHint);
      draftLayer.append(surfaceHeader, toolbar);

      const inventory = node.ownerDocument.createElement('div');
      inventory.style.cssText = 'display:none;';
      (draftSectionSchemas[section.sectionKey] ?? []).forEach((element) => {
        if (element.kind !== 'collection' && element.kind !== 'reference') return;
        const reference = section.references?.find((item) => item.entityType === element.key);
        const value = reference ? reference.entityIds : section.config[element.key];
        const count = Array.isArray(value) ? value.length : undefined;
        const group = node.ownerDocument.createElement('div');
        group.style.cssText = 'min-width:0;padding:2px;';
        const groupHeader = node.ownerDocument.createElement('div');
        groupHeader.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px;';
        const groupLabel = node.ownerDocument.createElement('strong');
        groupLabel.textContent = element.label;
        groupLabel.style.cssText = 'font:800 13px/1.2 system-ui;color:#0f172a;';
        const groupMeta = node.ownerDocument.createElement('span');
        groupMeta.textContent = count === undefined ? (element.optional ? 'Tùy chọn' : 'Nội dung') : `${count} mục`;
        groupMeta.style.cssText = 'border-radius:999px;padding:4px 7px;background:#f1f5f9;color:#64748b;font:700 10px/1 system-ui;';
        groupHeader.append(groupLabel, groupMeta);
        if ((section.sectionType === 'award_slider' || section.sectionType === 'technology_ecosystem') && element.key === 'items') groupHeader.style.display = 'none';
        group.appendChild(groupHeader);

        const makeAction = (label: string, handler: () => void, danger = false) => {
          const button = node.ownerDocument.createElement('button');
          button.type = 'button'; 
          button.textContent = label;
          button.style.cssText = `min-height:38px;border:1px solid ${danger ? '#fecaca' : '#cbd5e1'};border-radius:8px;padding:8px 11px;background:${danger ? '#fff1f2' : '#fff'};color:${danger ? '#be123c' : '#334155'};font:700 12px/1 system-ui;cursor:pointer;`;
          const click = (event: MouseEvent) => { 
            event.preventDefault(); 
            event.stopPropagation(); 
            handler(); 
          };
          button.addEventListener('click', click);
          actionCleanups.push(() => button.removeEventListener('click', click));
          return button;
        };

        const makeInlineText = (
          path: Array<string | number>,
          currentValue: PageBuilderConfigValue,
          placeholder: string,
          variant: 'title' | 'meta' | 'body' | 'cta' = 'body',
        ) => {
          const editable = node.ownerDocument.createElement(variant === 'title' ? 'h3' : variant === 'body' ? 'p' : 'span');
          const valueText = currentValue === null || currentValue === undefined ? '' : String(currentValue);
          editable.textContent = valueText || placeholder;
          editable.contentEditable = 'true';
          editable.spellcheck = true;
          editable.dataset.pageBuilderPlaceholder = valueText ? 'false' : 'true';
          editable.setAttribute('role', 'textbox');
          editable.setAttribute('aria-label', placeholder.replace(/\.\.\.$/, ''));
          const styles = {
            title: 'font:800 18px/1.35 system-ui;color:#0f172a;',
            meta: 'font:700 12px/1.35 system-ui;color:#c2410c;',
            body: 'font:500 13px/1.55 system-ui;color:#475569;',
            cta: 'display:inline-flex;width:max-content;border-radius:8px;padding:9px 13px;background:#f97316;color:#fff;font:800 12px/1 system-ui;',
          };
          editable.style.cssText = `${styles[variant]}min-width:3ch;outline:none;cursor:text;white-space:pre-wrap;`;
          if (!valueText) editable.style.cssText += 'color:#94a3b8;border-radius:6px;box-shadow:inset 0 0 0 1px #fdba74;padding:4px 6px;';
          const focus = () => {
            if (editable.dataset.pageBuilderPlaceholder === 'true') editable.textContent = '';
            editable.style.boxShadow = 'inset 0 0 0 2px #f97316';
          };
          const input = () => {
            editable.dataset.pageBuilderPlaceholder = 'false';
            onConfigValueChange?.(section.id, path, editable.textContent ?? '');
          };
          const blur = () => {
            const nextValue = (editable.textContent ?? '').trim();
            if (!nextValue) {
              editable.textContent = placeholder;
              editable.dataset.pageBuilderPlaceholder = 'true';
              editable.style.color = '#94a3b8';
              editable.style.boxShadow = 'inset 0 0 0 1px #fdba74';
            } else {
              editable.style.boxShadow = '';
            }
          };
          editable.addEventListener('focus', focus);
          editable.addEventListener('input', input);
          editable.addEventListener('blur', blur);
          actionCleanups.push(() => {
            editable.removeEventListener('focus', focus);
            editable.removeEventListener('input', input);
            editable.removeEventListener('blur', blur);
          });
          return editable;
        };

        const revealActionsOnHover = (card: HTMLElement, actions: HTMLElement) => {
          actions.style.opacity = '0';
          actions.style.pointerEvents = 'none';
          actions.style.transform = 'translateY(-4px)';
          actions.style.transition = 'opacity 140ms ease, transform 140ms ease';
          const show = () => { actions.style.opacity = '1'; actions.style.pointerEvents = 'auto'; actions.style.transform = ''; };
          const hide = () => { if (!card.contains(card.ownerDocument.activeElement)) { actions.style.opacity = '0'; actions.style.pointerEvents = 'none'; actions.style.transform = 'translateY(-4px)'; } };
          card.addEventListener('mouseenter', show);
          card.addEventListener('focusin', show);
          card.addEventListener('mouseleave', hide);
          card.addEventListener('focusout', hide);
          actionCleanups.push(() => { 
            card.removeEventListener('mouseenter', show); 
            card.removeEventListener('focusin', show); 
            card.removeEventListener('mouseleave', hide); 
            card.removeEventListener('focusout', hide); 
          });
        };

        const wireDrag = (dragTarget: HTMLElement, itemIndex: number, move: (from: number, to: number) => void, card: HTMLElement = dragTarget) => {
          dragTarget.draggable = true;
          card.style.transition = 'transform 160ms ease, opacity 160ms ease, border-color 160ms ease, box-shadow 160ms ease';
          const dragStart = (event: DragEvent) => {
            event.dataTransfer?.setData('text/page-builder-index', String(itemIndex));
            if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
            card.style.opacity = '0.45';
            card.style.transform = 'scale(.98)';
          };
          const dragOver = (event: DragEvent) => {
            event.preventDefault();
            if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
            card.style.borderColor = '#f97316';
            card.style.boxShadow = 'inset 4px 0 0 #f97316';
          };
          const dragLeave = () => { card.style.borderColor = '#e2e8f0'; card.style.boxShadow = ''; };
          const drop = (event: DragEvent) => {
            event.preventDefault();
            const from = Number(event.dataTransfer?.getData('text/page-builder-index'));
            dragLeave();
            if (Number.isInteger(from) && from !== itemIndex) move(from, itemIndex);
          };
          const dragEnd = () => { card.style.opacity = '1'; card.style.transform = ''; dragLeave(); };
          dragTarget.addEventListener('dragstart', dragStart); 
          card.addEventListener('dragover', dragOver); 
          card.addEventListener('dragleave', dragLeave); 
          card.addEventListener('drop', drop); 
          dragTarget.addEventListener('dragend', dragEnd);
          actionCleanups.push(() => { 
            dragTarget.removeEventListener('dragstart', dragStart); 
            card.removeEventListener('dragover', dragOver); 
            card.removeEventListener('dragleave', dragLeave); 
            card.removeEventListener('drop', drop); 
            dragTarget.removeEventListener('dragend', dragEnd); 
          });
        };

        if (element.kind === 'reference' && reference) {
          const cards = node.ownerDocument.createElement('div');
          cards.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;';
          reference.entityIds.forEach((id, itemIndex) => {
            const card = node.ownerDocument.createElement('div');
            card.style.cssText = 'position:relative;display:flex;flex-direction:column;gap:9px;min-height:240px;border:1px solid #e2e8f0;border-radius:12px;padding:11px;background:#fff;overflow:hidden;';
            const item = entityOptions.find((option) => option.id === id);
            const visual = node.ownerDocument.createElement('div'); 
            visual.style.cssText = 'display:flex;height:105px;align-items:center;justify-content:center;border-radius:9px;background:linear-gradient(135deg,#f1f5f9,#e2e8f0);color:#94a3b8;font:900 28px/1 system-ui;'; 
            visual.textContent = (item?.label ?? id).slice(0, 1).toUpperCase();
            const name = node.ownerDocument.createElement('span');
            name.textContent = item?.label ?? id;
            name.style.cssText = 'min-width:0;font:800 14px/1.35 system-ui;color:#0f172a;';
            const description = node.ownerDocument.createElement('span'); 
            description.textContent = item?.description ?? 'Dữ liệu tham chiếu từ module gốc'; 
            description.style.cssText = 'display:-webkit-box;overflow:hidden;-webkit-line-clamp:2;-webkit-box-orient:vertical;color:#64748b;font:600 11px/1.4 system-ui;';
            const actions = node.ownerDocument.createElement('div'); 
            actions.style.cssText = 'position:absolute;z-index:3;top:9px;left:9px;right:9px;display:flex;align-items:center;gap:7px;padding:7px;border-radius:10px;background:rgba(255,255,255,.96);box-shadow:0 8px 24px rgba(15,23,42,.16);';
            const replace = makeAction('Thay', () => { onPickReference?.(section.id, reference.entityType, itemIndex); });
            actions.append(replace); 
            card.append(visual, name, description, actions); 
            cards.appendChild(card);
            revealActionsOnHover(card, actions);
          });
          group.appendChild(cards);
        } else if (element.kind === 'collection' && Array.isArray(value)) {
          const cards = node.ownerDocument.createElement('div'); 
          cards.style.cssText = `display:grid;grid-template-columns:${section.sectionType === 'hero_carousel' ? '1fr' : 'repeat(auto-fit,minmax(240px,1fr))'};gap:12px;`;
          value.forEach((collectionItem, itemIndex) => {
            const isAward = (section.sectionType === 'award_slider' || section.sectionType === 'awards' || section.sectionKey === 'home.awards') && element.key === 'items';
            const isSlide = (section.sectionType === 'hero_carousel' || section.sectionKey === 'home.hero') && element.key === 'slides';
            const isEcosystem = (section.sectionType === 'technology_ecosystem' || section.sectionType === 'ecosystem' || section.sectionKey === 'home.ecosystem') && element.key === 'items';
            const isPartner = (section.sectionType === 'partner_marquee' || section.sectionType === 'partners' || section.sectionKey === 'home.partners') && element.key === 'items';
            const card = node.ownerDocument.createElement('article');
            card.style.cssText = `position:relative;display:flex;flex-direction:column;gap:9px;border:1px solid #e2e8f0;border-radius:12px;background:#fff;overflow:hidden;${isAward ? 'min-height:310px;padding:20px;align-items:center;box-shadow:0 1px 3px rgba(15,23,42,.08);' : ''}${isEcosystem ? 'min-height:430px;padding:8px;background:#f1f5f9;' : ''}${isSlide ? 'min-height:440px;justify-content:flex-end;background:#0f172a;color:#fff;' : isAward || isEcosystem ? '' : 'padding:12px;'}`;
            const dragHandle = node.ownerDocument.createElement('span'); 
            dragHandle.textContent = '⠿ Kéo'; 
            dragHandle.style.cssText = 'cursor:grab;color:#334155;font:800 11px/1 system-ui;';
            const objectItem = collectionItem && typeof collectionItem === 'object' && !Array.isArray(collectionItem) ? collectionItem as Record<string, PageBuilderConfigValue> : null;
            const fields: Array<[string, PageBuilderConfigValue]> = isAward
              ? ['imageId', 'name'].map((key) => [key, objectItem?.[key] ?? ''])
              : isEcosystem
                ? ['imageId', 'badge', 'description', 'title', 'link'].map((key) => [key, objectItem?.[key] ?? ''])
              : isSlide
                ? ['backgroundImageId', 'mobileImageId', 'title', 'subtitle', 'primaryCtaId', 'secondaryCtaId'].map((key) => [key, objectItem?.[key] ?? ''])
                : isPartner
                  ? [['imageId', objectItem?.imageId ?? '']]
                : objectItem ? Object.entries(objectItem) : [['value', collectionItem]];
            const content = node.ownerDocument.createElement('div');
            content.style.cssText = isSlide
              ? 'position:relative;z-index:2;display:flex;flex-direction:column;align-items:flex-start;gap:10px;padding:32px;max-width:720px;'
              : `display:flex;flex:1;flex-direction:column;gap:8px;${isAward ? 'width:100%;align-items:center;justify-content:space-between;' : ''}${isEcosystem ? 'width:100%;' : ''}`;
            
            fields.forEach(([fieldKey, fieldValue]) => {
              if (typeof fieldValue === 'object' && fieldValue !== null) return;
              const path = fieldKey === 'value' && (typeof collectionItem !== 'object' || collectionItem === null) ? [element.key, itemIndex] : [element.key, itemIndex, fieldKey];
              if (fieldKey.toLowerCase().includes('imageid')) {
                const mediaButton = makeAction('', () => onEditMedia?.(section.id, path, typeof fieldValue === 'string' ? fieldValue : ''));
                const asset = typeof fieldValue === 'string' && fieldValue ? findPageBuilderImage(fieldValue) : null;
                if (isSlide && fieldKey === 'backgroundImageId') {
                  mediaButton.style.cssText = 'position:absolute;inset:0;z-index:0;width:100%;height:100%;border:0;border-radius:0;padding:0;overflow:hidden;background:#1e293b;color:#fff;cursor:pointer;';
                  if (asset) { 
                    const preview = node.ownerDocument.createElement('img'); 
                    preview.src = asset.thumbnail_url ?? asset.url; 
                    preview.alt = ''; 
                    preview.style.cssText = 'width:100%;height:100%;object-fit:cover;opacity:.72;'; 
                    mediaButton.appendChild(preview); 
                    mediaButton.title = 'Thay ảnh'; 
                  } else {
                    mediaButton.textContent = '+ Chọn ảnh nền';
                  }
                  card.prepend(mediaButton);
                } else {
                  mediaButton.style.cssText += `height:${isSlide ? '56px' : isEcosystem ? '260px' : '170px'};width:${isSlide ? 'auto' : '100%'};border-style:dashed;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:${isSlide ? '9px 12px' : isAward ? '8px' : '0'};${isEcosystem ? 'border-radius:9px;background:#0f172a;' : ''}`;
                  if (asset || (typeof fieldValue === 'string' && fieldValue)) { 
                    const preview = node.ownerDocument.createElement('img'); 
                    preview.src = asset?.thumbnail_url ?? asset?.url ?? String(fieldValue); 
                    preview.alt = ''; 
                    preview.style.cssText = `width:${isSlide ? '72px' : '100%'};height:100%;object-fit:${isAward || isPartner ? 'contain' : 'cover'};`; 
                    mediaButton.appendChild(preview); 
                    mediaButton.title = 'Thay ảnh'; 
                    if (isAward || isPartner) mediaButton.style.cssText += 'border-color:transparent;background:transparent;'; 
                  } else {
                    mediaButton.textContent = isSlide ? '+ Ảnh mobile' : '+ Chọn ảnh';
                  }
                  content.appendChild(mediaButton);
                }
              } else {
                const placeholders: Record<string, string> = { 
                  name: 'Nhập tên giải thưởng...', year: 'Nhập năm...', badge: 'Nhập nhãn...', 
                  link: 'Nhập đường dẫn...', description: 'Nhập mô tả...', title: 'Nhập tiêu đề...', 
                  subtitle: 'Nhập mô tả...', primaryCtaId: '+ Thêm CTA chính', secondaryCtaId: '+ Thêm CTA phụ' 
                };
                const variant = fieldKey === 'title' || fieldKey === 'name' ? 'title' : fieldKey === 'year' || fieldKey === 'badge' ? 'meta' : fieldKey === 'link' || fieldKey.toLowerCase().includes('cta') ? 'cta' : 'body';
                const editable = makeInlineText(path, fieldValue as PageBuilderConfigValue, placeholders[fieldKey] ?? 'Nhập nội dung...', variant);
                if (isAward && variant === 'title') editable.style.cssText += 'text-align:center;text-transform:uppercase;letter-spacing:.045em;font-size:13px;';
                if (isEcosystem) {
                  if (fieldKey === 'description') editable.style.cssText += 'margin:-118px 14px 52px;padding:0;color:#f8fafc;position:relative;z-index:2;';
                  else if (fieldKey === 'badge') editable.style.cssText += 'position:absolute;top:24px;left:22px;z-index:3;border-radius:999px;padding:7px 10px;background:#ea580c;color:#fff;';
                  else if (fieldKey === 'title') editable.style.cssText += 'padding:4px 10px 0;font-size:19px;';
                  else if (fieldKey === 'link') editable.style.cssText += 'margin:0 10px 8px;background:#0f172a;';
                }
                if (isSlide) {
                  if (variant === 'title') editable.style.cssText += 'font-size:32px;color:#fff;';
                  else if (variant === 'body') editable.style.cssText += 'color:#e2e8f0;';
                }
                content.appendChild(editable);
              }
            });
            card.appendChild(content);

            if (allowsCollectionStructureChanges) {
              const actions = node.ownerDocument.createElement('div'); 
              actions.style.cssText = 'position:absolute;z-index:4;top:9px;right:9px;display:flex;align-items:center;gap:7px;padding:7px;border-radius:10px;background:rgba(255,255,255,.96);box-shadow:0 8px 24px rgba(15,23,42,.16);';
              actions.append(
                makeAction('Nhân bản', () => onCollectionAction?.(section.id, element.key, 'duplicate', itemIndex)), 
                makeAction('Xóa mục', () => onCollectionAction?.(section.id, element.key, 'remove', itemIndex), true)
              );
              actions.prepend(dragHandle);
              card.appendChild(actions);
              revealActionsOnHover(card, actions);
              wireDrag(dragHandle, itemIndex, (from, to) => { 
                const reordered = [...value]; 
                const [moved] = reordered.splice(from, 1); 
                reordered.splice(to, 0, moved); 
                onConfigValueChange?.(section.id, [element.key], reordered); 
              }, card);
            }
            cards.appendChild(card);
          });

          if (allowsCollectionStructureChanges) {
            cards.appendChild(makeAction(`+ Thêm ${element.label}`, () => onCollectionAction?.(section.id, element.key, 'add', count ?? 0)));
          }
          group.appendChild(cards);
        }
        inventory.appendChild(group);
      });

      const showFullCollectionInventory = false;

      if (showFullCollectionInventory) {
        inventory.style.cssText = 'display:block;margin:18px 0 8px;';
        draftLayer.appendChild(inventory);
      }

      const collectionType = 
        (section.sectionType === 'award_slider' || section.sectionType === 'awards' || section.sectionKey === 'home.awards') ? 'award' : 
        (section.sectionType === 'technology_ecosystem' || section.sectionType === 'ecosystem' || section.sectionKey === 'home.ecosystem') ? 'ecosystem' : 
        (section.sectionType === 'partner_marquee' || section.sectionType === 'partners' || section.sectionKey === 'home.partners') ? 'partner' : 
        section.references?.[0]?.entityType;

      const collectionAnchor = collectionType ? node.querySelector<HTMLElement>(`[data-page-collection~="${collectionType}"]`) : null;
      if (collectionAnchor) collectionAnchor.parentElement?.insertBefore(draftLayer, collectionAnchor);
      else node.insertBefore(draftLayer, node.firstChild);

      if (showFullCollectionInventory && collectionAnchor) {
        const previousDisplay = collectionAnchor.style.display;
        collectionAnchor.style.display = 'none';
        actionCleanups.push(() => { collectionAnchor.style.display = previousDisplay; });
      }

      if (collectionAnchor && !showFullCollectionInventory) {
        const reference = section.references?.find((item) => collectionAnchor.matches(`[data-page-collection~="${item.entityType}"]`));
        const isAwardCollection = section.sectionType === 'award_slider' || section.sectionType === 'awards' || section.sectionKey === 'home.awards';
        const isPartnerCollection = section.sectionType === 'partner_marquee' || section.sectionType === 'partners' || section.sectionKey === 'home.partners';
        const isProjectSection = section.sectionKey === 'home.projects' || section.sectionType === 'projects';
        const isEventSection = section.sectionKey === 'home.events' || section.sectionType === 'events';
        const itemContainer = isAwardCollection
          ? collectionAnchor.querySelector<HTMLElement>('.overflow-hidden > .flex')
          : collectionAnchor;
        const customCards = collectionAnchor.querySelectorAll<HTMLElement>('[data-page-builder-card]');
        const productionCards = customCards.length > 0
          ? Array.from(customCards)
          : itemContainer
            ? (isAwardCollection
              ? Array.from(itemContainer.children).map((wrapper) => wrapper.firstElementChild).filter((item): item is HTMLElement => item instanceof node.ownerDocument.defaultView!.HTMLElement)
              : Array.from(itemContainer.children).filter((item): item is HTMLElement => item instanceof node.ownerDocument.defaultView!.HTMLElement && !item.dataset.pageBuilderAction))
            : [];
        const visibleCards = reference
          ? productionCards.slice(0, reference.entityIds.length)
          : (isAwardCollection || isPartnerCollection) && Array.isArray(section.config.items)
            ? productionCards.slice(0, section.config.items.length)
            : productionCards;

        const createCardAction = (label: string, handler: () => void, danger = false) => {
          const button = node.ownerDocument.createElement('button');
          button.type = 'button'; 
          button.textContent = label;
          button.style.cssText = `min-height:36px;border:1px solid ${danger ? '#fecaca' : '#cbd5e1'};border-radius:8px;padding:8px 10px;background:${danger ? '#fff1f2' : '#fff'};color:${danger ? '#be123c' : '#334155'};font:800 11px/1 system-ui;cursor:pointer;`;
          const click = (event: MouseEvent) => { 
            event.preventDefault(); 
            event.stopPropagation(); 
            handler(); 
          };
          button.addEventListener('click', click);
          actionCleanups.push(() => button.removeEventListener('click', click));
          return button;
        };

        const attachProductionDrag = (handle: HTMLElement, card: HTMLElement, itemIndex: number, reorder: (from: number, to: number) => void) => {
          handle.draggable = true;
          const start = (event: DragEvent) => { 
            event.dataTransfer?.setData('text/page-builder-production-index', String(itemIndex)); 
            card.style.opacity = '.45'; 
          };
          const over = (event: DragEvent) => { 
            event.preventDefault(); 
            card.style.outline = '3px solid #f97316'; 
            card.style.outlineOffset = '-3px'; 
          };
          const leave = () => { 
            card.style.outline = ''; 
            card.style.outlineOffset = ''; 
          };
          const drop = (event: DragEvent) => {
            event.preventDefault();
            const from = Number(event.dataTransfer?.getData('text/page-builder-production-index'));
            leave();
            if (!Number.isInteger(from) || from === itemIndex) return;
            reorder(from, itemIndex);
            const moving = visibleCards[from];
            const target = visibleCards[itemIndex];
            const movingWrapper = isAwardCollection ? moving?.parentElement : moving;
            const targetWrapper = isAwardCollection ? target?.parentElement : target;
            if (movingWrapper && targetWrapper && itemContainer) {
              itemContainer.insertBefore(movingWrapper, from < itemIndex ? targetWrapper.nextSibling : targetWrapper);
            }
          };
          const end = () => { card.style.opacity = ''; leave(); };
          handle.addEventListener('dragstart', start); 
          card.addEventListener('dragover', over); 
          card.addEventListener('dragleave', leave); 
          card.addEventListener('drop', drop); 
          handle.addEventListener('dragend', end);
          actionCleanups.push(() => { 
            handle.removeEventListener('dragstart', start); 
            card.removeEventListener('dragover', over); 
            card.removeEventListener('dragleave', leave); 
            card.removeEventListener('drop', drop); 
            handle.removeEventListener('dragend', end); 
          });
        };

        visibleCards.forEach((card, itemIndex) => {
          card.style.position = 'relative';
          const controls = node.ownerDocument.createElement('div');
          controls.dataset.pageBuilderAction = 'card-controls';
          const isTopLeft = isProjectSection;
          controls.style.cssText = `position:absolute;z-index:20;top:10px;${isTopLeft ? 'left:10px;' : 'right:10px;'}display:flex;align-items:center;gap:6px;padding:6px;border-radius:10px;background:rgba(255,255,255,.97);box-shadow:0 8px 24px rgba(15,23,42,.18);opacity:0;pointer-events:none;transform:translateY(-4px);transition:opacity 140ms ease,transform 140ms ease;`;
          
          if (reference) {
            const isManualMode = reference.source?.mode === 'manual';
            const handle = createCardAction('⠿ Kéo', () => undefined);
            handle.style.cursor = 'grab';
            controls.appendChild(handle);
            if (isManualMode) {
              controls.append(createCardAction('Thay', () => onPickReference?.(section.id, reference.entityType, itemIndex)));
            }
            if (reference.entityIds.length > 1) {
              controls.append(createCardAction('Xóa', () => {
                const next = reference.entityIds.filter((_, idx) => idx !== itemIndex);
                onReferenceItemsChange?.(section.id, reference.entityType, next);
              }, true));
            }
            attachProductionDrag(handle, card, itemIndex, (from, to) => {
              const next = [...reference.entityIds];
              const [moved] = next.splice(from, 1);
              next.splice(to, 0, moved);
              onReferenceItemsChange?.(section.id, reference.entityType, next);
            });
          } else if ((isAwardCollection || isPartnerCollection) && Array.isArray(section.config.items)) {
            const handle = createCardAction('⠿ Kéo', () => undefined);
            handle.style.cursor = 'grab';
            controls.appendChild(handle);
            controls.append(
              createCardAction('Nhân bản', () => onCollectionAction?.(section.id, 'items', 'duplicate', itemIndex)),
              createCardAction('Xóa', () => onCollectionAction?.(section.id, 'items', 'remove', itemIndex), true),
            );
            attachProductionDrag(handle, card, itemIndex, (from, to) => {
              const items = [...section.config.items as PageBuilderConfigValue[]]; 
              const [moved] = items.splice(from, 1); 
              items.splice(to, 0, moved); 
              onConfigValueChange?.(section.id, ['items'], items);
            });
            const itemRecord = (section.config.items[itemIndex] ?? {}) as Record<string, PageBuilderConfigValue>;
            const title = card.querySelector<HTMLElement>('h3, span');
            if (title && (isAwardCollection || !card.querySelector('img'))) {
              title.contentEditable = 'true'; 
              title.setAttribute('role', 'textbox'); 
              title.style.cursor = 'text';
              const updateTitle = () => onConfigValueChange?.(section.id, ['items', itemIndex, 'name'], title.textContent ?? '');
              title.addEventListener('input', updateTitle); 
              actionCleanups.push(() => title.removeEventListener('input', updateTitle));
            }
            const image = card.querySelector<HTMLImageElement>('img');
            if (image) {
              image.style.cursor = 'pointer';
              image.title = isPartnerCollection ? 'Bấm để đổi logo đối tác' : 'Bấm để đổi ảnh';
              const replaceImage = (event: MouseEvent) => { 
                event.preventDefault(); 
                event.stopPropagation(); 
                onEditMedia?.(section.id, ['items', itemIndex, 'imageId'], String(itemRecord.imageId ?? itemRecord.logo ?? '')); 
              };
              image.addEventListener('click', replaceImage); 
              actionCleanups.push(() => image.removeEventListener('click', replaceImage));
            }
          }
          const show = () => { controls.style.opacity = '1'; controls.style.pointerEvents = 'auto'; controls.style.transform = ''; };
          const hide = () => { if (!card.contains(card.ownerDocument.activeElement)) { controls.style.opacity = '0'; controls.style.pointerEvents = 'none'; controls.style.transform = 'translateY(-4px)'; } };
          card.addEventListener('mouseenter', show); 
          card.addEventListener('mouseleave', hide); 
          card.addEventListener('focusin', show); 
          card.addEventListener('focusout', hide);
          actionCleanups.push(() => { 
            card.removeEventListener('mouseenter', show); 
            card.removeEventListener('mouseleave', hide); 
            card.removeEventListener('focusin', show); 
            card.removeEventListener('focusout', hide); 
          });
          card.appendChild(controls);
        });

        if (itemContainer && (isAwardCollection || isPartnerCollection)) {
          const addSlot = node.ownerDocument.createElement('button');
          addSlot.type = 'button'; 
          addSlot.dataset.pageBuilderAction = 'add-slot';
          addSlot.textContent = isAwardCollection ? '+ Thêm giải thưởng' : '+ Thêm logo đối tác';
          addSlot.style.cssText = isAwardCollection
            ? 'min-height:180px;min-width:210px;border:2px dashed #fb923c;border-radius:12px;padding:18px;background:#fff7ed;color:#9a3412;font:800 13px/1.3 system-ui;cursor:pointer;align-self:stretch;'
            : 'min-height:80px;min-width:160px;border:2px dashed #fb923c;border-radius:10px;padding:12px;background:#fff7ed;color:#9a3412;font:800 12px/1.3 system-ui;cursor:pointer;display:flex;align-items:center;justify-content:center;';
          const add = (event: MouseEvent) => {
            event.preventDefault(); 
            event.stopPropagation(); 
            onCollectionAction?.(section.id, 'items', 'add', Array.isArray(section.config.items) ? section.config.items.length : 0);
          };
          addSlot.addEventListener('click', add); 
          actionCleanups.push(() => addSlot.removeEventListener('click', add));
          const wrapper = node.ownerDocument.createElement('div'); 
          wrapper.dataset.pageBuilderAction = 'add-slot-wrapper'; 
          wrapper.className = isAwardCollection 
            ? (productionCards[0]?.parentElement?.className ?? 'flex-none px-3')
            : 'flex items-center justify-center p-2'; 
          wrapper.appendChild(addSlot); 
          itemContainer.appendChild(wrapper);
        } else if (itemContainer && reference && reference.source?.mode === 'manual' && !isProjectSection && !isEventSection) {
          const limit = sectionDefinitions[section.sectionKey]?.referenceLimit?.[reference.entityType] ?? 20;
          if (reference.entityIds.length < limit) {
            const addSlot = node.ownerDocument.createElement('button');
            addSlot.type = 'button';
            addSlot.dataset.pageBuilderAction = 'add-slot';
            addSlot.textContent = `+ Thêm ${entityTypeLabels[reference.entityType] || 'mục'}`;
            addSlot.style.cssText = 'min-height:160px;min-width:200px;border:2px dashed #fb923c;border-radius:12px;padding:16px;background:#fff7ed;color:#9a3412;font:800 13px/1.3 system-ui;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 150ms ease;align-self:stretch;';
            const add = (event: MouseEvent) => {
              event.preventDefault(); 
              event.stopPropagation();
              onPickReference?.(section.id, reference.entityType);
            };
            addSlot.addEventListener('click', add);
            actionCleanups.push(() => addSlot.removeEventListener('click', add));
            const wrapper = node.ownerDocument.createElement('div');
            wrapper.dataset.pageBuilderAction = 'add-slot-wrapper';
            wrapper.className = productionCards[0]?.parentElement?.className ?? 'flex-none px-3';
            wrapper.appendChild(addSlot);
            itemContainer.appendChild(wrapper);
          }
        }
      } else if (!showFullCollectionInventory) {
        const embeddedCollections = (draftSectionSchemas[section.sectionKey] ?? []).filter((element) => element.kind === 'collection');
        embeddedCollections.forEach((element) => {
          const items = section.config[element.key];
          if (!Array.isArray(items) || element.key === 'slides') return;
          const claimedCards = new Set<HTMLElement>();
          const cards = items.map((item) => {
            const itemRecord = item && typeof item === 'object' && !Array.isArray(item) ? item as Record<string, PageBuilderConfigValue> : null;
            const identifyingValue = itemRecord
              ? Object.values(itemRecord).find((value) => typeof value === 'string' && value.trim().length > 1)
              : item;
            const textNode = typeof identifyingValue === 'string' ? findTextNode(node, identifyingValue, new Set()) : null;
            let card = textNode;
            while (card?.parentElement && card.parentElement !== node && !/rounded|shadow|border|grid|flex-none/.test(card.className)) card = card.parentElement;
            if (!card || card === node || claimedCards.has(card)) return null;
            claimedCards.add(card);
            return card;
          }).filter((card): card is HTMLElement => Boolean(card));

          if (!cards.length) return;
          const collectionParent = cards[0].parentElement;
          cards.forEach((card, itemIndex) => {
            const item = items[itemIndex];
            const record = item && typeof item === 'object' && !Array.isArray(item) ? item as Record<string, PageBuilderConfigValue> : null;
            card.style.position = 'relative';
            if (record) {
              Object.entries(record).forEach(([fieldKey, fieldValue]) => {
                if ((typeof fieldValue !== 'string' && typeof fieldValue !== 'number') || !String(fieldValue).trim()) return;
                if (/image|video|media/i.test(fieldKey)) {
                  const asset = findPageBuilderImage(String(fieldValue));
                  const mediaNode = asset ? Array.from(card.querySelectorAll<HTMLImageElement>('img')).find((image) => image.src.includes(asset.url) || image.src.includes(asset.thumbnail_url ?? asset.url)) ?? card.querySelector<HTMLImageElement>('img') : card.querySelector<HTMLImageElement>('img');
                  if (mediaNode) {
                    mediaNode.style.cursor = 'pointer';
                    const replace = (event: MouseEvent) => { 
                      event.preventDefault(); 
                      event.stopPropagation(); 
                      onEditMedia?.(section.id, [element.key, itemIndex, fieldKey], String(fieldValue)); 
                    };
                    mediaNode.addEventListener('click', replace); 
                    actionCleanups.push(() => mediaNode.removeEventListener('click', replace));
                  }
                  return;
                }
                const editable = findTextNode(card, String(fieldValue), new Set());
                if (!editable) return;
                editable.contentEditable = 'true'; 
                editable.setAttribute('role', 'textbox'); 
                editable.style.cursor = 'text'; 
                editable.style.outline = 'none';
                const update = () => onConfigValueChange?.(section.id, [element.key, itemIndex, fieldKey], typeof fieldValue === 'number' ? Number(editable.textContent ?? 0) : editable.textContent ?? '');
                editable.addEventListener('input', update); 
                actionCleanups.push(() => editable.removeEventListener('input', update));
              });
            }

            const controls = node.ownerDocument.createElement('div'); 
            controls.dataset.pageBuilderAction = 'card-controls';
            controls.style.cssText = 'position:absolute;z-index:20;top:8px;right:8px;display:flex;gap:6px;padding:6px;border-radius:10px;background:rgba(255,255,255,.97);box-shadow:0 8px 24px rgba(15,23,42,.18);opacity:0;pointer-events:none;';
            const makeButton = (label: string, handler: () => void, danger = false) => {
              const button = node.ownerDocument.createElement('button'); 
              button.type = 'button'; 
              button.textContent = label;
              button.style.cssText = `min-height:36px;border:1px solid ${danger ? '#fecaca' : '#cbd5e1'};border-radius:8px;padding:8px 10px;background:${danger ? '#fff1f2' : '#fff'};color:${danger ? '#be123c' : '#334155'};font:800 11px/1 system-ui;cursor:pointer;`;
              const click = (event: MouseEvent) => { event.preventDefault(); event.stopPropagation(); handler(); }; 
              button.addEventListener('click', click); 
              actionCleanups.push(() => button.removeEventListener('click', click)); 
              return button;
            };

            if (!allowsCollectionStructureChanges) return;
            const handle = makeButton('⠿ Kéo', () => undefined); 
            handle.draggable = true; 
            handle.style.cursor = 'grab';
            controls.append(
              handle, 
              makeButton('Nhân bản', () => onCollectionAction?.(section.id, element.key, 'duplicate', itemIndex)), 
              makeButton('Xóa', () => onCollectionAction?.(section.id, element.key, 'remove', itemIndex), true)
            );
            const dragStart = (event: DragEvent) => { 
              event.dataTransfer?.setData('text/page-builder-generic-index', String(itemIndex)); 
              card.style.opacity = '.45'; 
            };
            const dragOver = (event: DragEvent) => { 
              event.preventDefault(); 
              card.style.outline = '3px solid #f97316'; 
              card.style.outlineOffset = '-3px'; 
            };
            const dragLeave = () => { card.style.outline = ''; card.style.outlineOffset = ''; };
            const drop = (event: DragEvent) => { 
              event.preventDefault(); 
              const from = Number(event.dataTransfer?.getData('text/page-builder-generic-index')); 
              dragLeave(); 
              if (!Number.isInteger(from) || from === itemIndex) return; 
              const reordered = [...items]; 
              const [moved] = reordered.splice(from, 1); 
              reordered.splice(itemIndex, 0, moved); 
              onConfigValueChange?.(section.id, [element.key], reordered); 
              const moving = cards[from]; 
              if (moving && collectionParent) collectionParent.insertBefore(moving, from < itemIndex ? card.nextSibling : card); 
            };
            const dragEnd = () => { card.style.opacity = ''; dragLeave(); };
            const show = () => { controls.style.opacity = '1'; controls.style.pointerEvents = 'auto'; }; 
            const hide = () => { if (!card.contains(card.ownerDocument.activeElement)) { controls.style.opacity = '0'; controls.style.pointerEvents = 'none'; } };
            handle.addEventListener('dragstart', dragStart); 
            card.addEventListener('dragover', dragOver); 
            card.addEventListener('dragleave', dragLeave); 
            card.addEventListener('drop', drop); 
            handle.addEventListener('dragend', dragEnd); 
            card.addEventListener('mouseenter', show); 
            card.addEventListener('mouseleave', hide); 
            card.addEventListener('focusin', show); 
            card.addEventListener('focusout', hide);
            actionCleanups.push(() => { 
              handle.removeEventListener('dragstart', dragStart); 
              card.removeEventListener('dragover', dragOver); 
              card.removeEventListener('dragleave', dragLeave); 
              card.removeEventListener('drop', drop); 
              handle.removeEventListener('dragend', dragEnd); 
              card.removeEventListener('mouseenter', show); 
              card.removeEventListener('mouseleave', hide); 
              card.removeEventListener('focusin', show); 
              card.removeEventListener('focusout', hide); 
            });
            card.appendChild(controls);
          });

          if (collectionParent && allowsCollectionStructureChanges) {
            const addSlot = cards[0].cloneNode(false) as HTMLElement; 
            addSlot.dataset.pageBuilderAction = 'add-slot'; 
            addSlot.removeAttribute('style'); 
            addSlot.style.cssText = 'display:flex;min-height:140px;align-items:center;justify-content:center;border:2px dashed #fb923c;border-radius:12px;background:#fff7ed;color:#9a3412;cursor:pointer;';
            const addButton = node.ownerDocument.createElement('button'); 
            addButton.type = 'button'; 
            addButton.textContent = `+ Thêm ${element.label}`; 
            addButton.style.cssText = 'border:0;background:transparent;color:inherit;font:800 13px/1.3 system-ui;cursor:pointer;';
            const add = (event: MouseEvent) => { 
              event.preventDefault(); 
              event.stopPropagation(); 
              onCollectionAction?.(section.id, element.key, 'add', items.length); 
            };
            addButton.addEventListener('click', add); 
            actionCleanups.push(() => addButton.removeEventListener('click', add)); 
            addSlot.appendChild(addButton); 
            collectionParent.appendChild(addSlot);
          }
        });
      }
    }
  });

  // 2. Setup Inline Text, Images & CTA Overlays across all sections
  sections.forEach((section) => {
    if (mode === 'edit' && directEditingSectionKeys.has(section.sectionKey)) return;
    const sectionRoot = root.querySelector<HTMLElement>(`[data-page-builder-section-id="${section.id}"]`);
    if (!sectionRoot || section.visible === false) return;
    const claimed = new Set<HTMLElement>();
    const entries: Array<{ key: string; fieldKey: string; value: string }> = Object.entries(section.config)
      .filter(([key, value]) => inlineEditableKeys.has(key) && typeof value === 'string')
      .map(([key, value]) => ({ key, fieldKey: key, value: String(value) }));

    if (section.sectionKey === 'home.hero' && Array.isArray(section.config.slides)) {
      const slideIndex = Math.min(activeHeroSlide, Math.max(0, section.config.slides.length - 1));
      const slide = section.config.slides[slideIndex];
      if (slide && typeof slide === 'object' && !Array.isArray(slide)) {
        Object.entries(slide).forEach(([fieldKey, value]) => {
          if (inlineEditableKeys.has(fieldKey) && typeof value === 'string') {
            entries.push({ key: `slides-${slideIndex}-${fieldKey}`, fieldKey, value });
          }
        });
      }
    }

    entries.forEach(({ key, fieldKey, value }) => {
      const existing = sectionRoot.querySelector<HTMLElement>(`[data-page-builder-inline-edit="${key}"]`);
      const node = existing ?? findTextNode(sectionRoot, value, claimed) ?? findFallbackNode(sectionRoot, fieldKey, claimed);
      if (!node) return;
      claimed.add(node);
      node.dataset.pageBuilderInlineEdit = key;
      if (onTextChange) {
        node.contentEditable = 'true';
        node.setAttribute('role', 'textbox');
        node.style.cursor = 'text';
      }
      if (node !== node.ownerDocument.activeElement) {
        const stripped = stripHtml(value);
        const currentText = normalizeText(node.textContent ?? '');
        if (hasHtml(value)) {
          if (currentText !== normalizeText(stripped)) {
            node.innerHTML = value;
          }
        } else if (currentText !== normalizeText(value)) {
          node.textContent = value;
        }
      }
    });

    let mediaId = typeof section.config.imageId === 'string' ? section.config.imageId : typeof section.config.backgroundImageId === 'string' ? section.config.backgroundImageId : '';
    if (section.sectionKey === 'home.hero' && Array.isArray(section.config.slides)) {
      const slideIndex = Math.min(activeHeroSlide, Math.max(0, section.config.slides.length - 1));
      const slide = section.config.slides[slideIndex];
      if (slide && typeof slide === 'object' && !Array.isArray(slide)) mediaId = String(slide.backgroundImageId || '');
    }
    const image = sectionRoot.querySelector<HTMLImageElement>('img');
    const asset = mediaId ? findPageBuilderImage(mediaId) : null;
    if (image && asset) image.src = asset.thumbnail_url ?? asset.url;
    if (image && mediaId) {
      const mediaPath: Array<string | number> = section.sectionKey === 'home.hero'
        ? ['slides', Math.min(activeHeroSlide, Math.max(0, Array.isArray(section.config.slides) ? section.config.slides.length - 1 : 0)), 'backgroundImageId']
        : [typeof section.config.imageId === 'string' ? 'imageId' : 'backgroundImageId'];
      image.dataset.pageBuilderMediaPath = JSON.stringify(mediaPath);
      image.dataset.pageBuilderMediaId = mediaId;
    }

    const ctaEntries = ctaEntriesForSection(section, activeHeroSlide, sectionRoot);
    const actionCandidates = Array.from(sectionRoot.querySelectorAll<HTMLElement>('a,button')).filter((node) => !node.closest('[data-page-builder-action]'));
    const linkCandidates = actionCandidates.filter((node) => node.tagName === 'A');
    const labeledCandidates = actionCandidates.filter((node) => !node.getAttribute('aria-label') && normalizeText(node.textContent ?? '').length > 2);
    const ctaNodes = linkCandidates.length >= ctaEntries.length ? linkCandidates : labeledCandidates;
    ctaEntries.forEach(({ key, path }, index) => {
      const serializedPath = JSON.stringify(path);
      const node = sectionRoot.querySelector<HTMLElement>(`[data-page-builder-cta-key='${serializedPath}']`) ?? ctaNodes[index];
      if (!node) return;
      node.dataset.pageBuilderCtaKey = serializedPath;
      const label = section.config[`${key}Label`];
      const url = section.config[`${key}Url`];
      const newTab = section.config[`${key}NewTab`];
      if (typeof label === 'string' && label.trim()) {
        const span = node.querySelector('span');
        if (span) span.textContent = label;
        else node.textContent = label;
      }
      if (node.tagName === 'A' && typeof url === 'string' && url.trim()) node.setAttribute('href', url);
      if (node.tagName === 'A') newTab ? node.setAttribute('target', '_blank') : node.removeAttribute('target');
    });
  });

  // 3. Setup Selected Section Direct Controls (RichText, Video, Custom Config Path, Inline Text, Media, CTA)
  const selectedSection = sections.find((item) => item.id === selectedId);
  const selectedSectionRoot = root.querySelector<HTMLElement>(`[data-page-builder-section-id="${selectedId}"]`);
  if (selectedSection && selectedSectionRoot && !(mode === 'edit' && directEditingSectionKeys.has(selectedSection.sectionKey))) {
    const claimed = new Set<HTMLElement>();

    selectedSectionRoot.querySelectorAll<HTMLElement>('[data-page-builder-richtext-path]').forEach((node) => {
      const path = JSON.parse(node.dataset.pageBuilderRichtextPath ?? '[]') as Array<string | number>;
      node.contentEditable = 'true';
      node.setAttribute('role', 'textbox');
      node.style.cursor = 'text';
      node.style.outline = '1px dashed rgb(249 115 22 / 0.65)';
      node.style.outlineOffset = '5px';
      const update = () => onConfigValueChange?.(selectedSection.id, path, node.innerHTML);
      node.addEventListener('input', update);
      actionCleanups.push(() => { 
        node.removeEventListener('input', update); 
        node.removeAttribute('contenteditable'); 
        node.removeAttribute('role'); 
        node.style.cursor = ''; 
        node.style.outline = ''; 
        node.style.outlineOffset = ''; 
      });
    });

    selectedSectionRoot.querySelectorAll<HTMLElement>('[data-page-builder-config-path]').forEach((node) => {
      const path = JSON.parse(node.dataset.pageBuilderConfigPath ?? '[]') as Array<string | number>;
      const value = configValueAtPath(selectedSection.config, path);
      if (!path.length || (value !== undefined && typeof value !== 'string' && typeof value !== 'number')) return;
      claimed.add(node);
      node.contentEditable = 'true';
      node.dataset.pageBuilderInlineEdit = path.join('-');
      node.setAttribute('role', 'textbox');
      node.style.cursor = 'text';
      node.style.outline = '1px dashed rgb(249 115 22 / 0.65)';
      node.style.outlineOffset = '3px';
      const update = () => onConfigValueChange?.(selectedSection.id, path, typeof value === 'number' ? Number(node.textContent ?? 0) : node.textContent ?? '');
      node.addEventListener('input', update);
      actionCleanups.push(() => { 
        node.removeEventListener('input', update); 
        node.removeAttribute('contenteditable'); 
        node.removeAttribute('role'); 
        node.style.cursor = ''; 
        node.style.outline = ''; 
        node.style.outlineOffset = ''; 
      });
    });

    selectedSectionRoot.querySelectorAll<HTMLElement>('[data-page-builder-video-path]').forEach((node) => {
      const path = JSON.parse(node.dataset.pageBuilderVideoPath ?? '[]') as Array<string | number>;
      if (!path.length || !onEditVideo) return;
      const currentUrl = String(configValueAtPath(selectedSection.config, path) ?? '');
      const videoId = youtubeVideoId(currentUrl);
      const iframe = node.querySelector<HTMLIFrameElement>('iframe');
      const image = node.querySelector<HTMLImageElement>('img');
      if (iframe && videoId) iframe.src = `https://www.youtube.com/embed/${videoId}`;
      if (image && videoId) image.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      node.style.position = 'relative';
      const button = node.ownerDocument.createElement('button');
      button.type = 'button';
      button.dataset.pageBuilderAction = 'edit-video';
      button.textContent = 'Thay video';
      button.style.cssText = 'position:absolute;z-index:30;right:14px;top:14px;min-height:42px;border:1px solid #fed7aa;border-radius:10px;padding:10px 14px;background:#fff;color:#9a3412;font:800 12px/1 system-ui;box-shadow:0 8px 24px rgba(15,23,42,.18);cursor:pointer;';
      const open = (event: MouseEvent) => {
        event.preventDefault(); 
        event.stopPropagation();
        const rect = button.getBoundingClientRect();
        const frameRect = frame?.getBoundingClientRect();
        onEditVideo(selectedSection.id, path, currentUrl, { left: (frameRect?.left ?? 0) + rect.left * scale, top: (frameRect?.top ?? 0) + rect.bottom * scale + 8 });
      };
      button.addEventListener('click', open);
      node.appendChild(button);
      actionCleanups.push(() => { button.removeEventListener('click', open); button.remove(); });
    });

    const inlineEntries: Array<{ key: string; path: Array<string | number>; value: unknown }> = Object.entries(selectedSection.config).map(([key, value]) => ({ key, path: [key], value }));
    if (selectedSection.sectionKey === 'home.hero' && Array.isArray(selectedSection.config.slides)) {
      const slideIndex = Math.min(activeHeroSlide, Math.max(0, selectedSection.config.slides.length - 1));
      const slide = selectedSection.config.slides[slideIndex];
      if (slide && typeof slide === 'object' && !Array.isArray(slide)) {
        Object.entries(slide).forEach(([key, value]) => inlineEntries.push({ key: `slides-${slideIndex}-${key}`, path: ['slides', slideIndex, key], value }));
      }
    }

    inlineEntries.forEach(({ key, path, value }) => {
      const fieldKey = String(path.at(-1));
      if (!inlineEditableKeys.has(fieldKey) || typeof value !== 'string') return;
      const existing = selectedSectionRoot.querySelector<HTMLElement>(`[data-page-builder-inline-edit="${key}"]`);
      const node = existing ?? findTextNode(selectedSectionRoot, value, claimed);
      if (!node) return;
      claimed.add(node);
      if (node !== node.ownerDocument.activeElement) {
        const stripped = stripHtml(value);
        const currentText = normalizeText(node.textContent ?? '');
        if (hasHtml(value)) {
          if (currentText !== normalizeText(stripped)) {
            node.innerHTML = value;
          }
        } else if (currentText !== normalizeText(value)) {
          node.textContent = value;
        }
      }
      if (!onTextChange) return;
      node.contentEditable = 'true';
      node.dataset.pageBuilderInlineEdit = key;
      node.setAttribute('role', 'textbox');
      node.setAttribute('aria-label', `Chỉnh sửa ${key}`);
      const editLabel = fieldKey === 'title' ? 'Tiêu đề' : fieldKey === 'subtitle' || fieldKey === 'description' ? 'Mô tả' : fieldKey === 'badge' || fieldKey === 'eyebrow' ? 'Nhãn' : 'Bấm để sửa trực tiếp';
      node.title = editLabel;
      node.style.cursor = 'text';
      node.style.outline = selectedSection.sectionKey === 'home.hero' ? 'none' : '1px dashed rgb(249 115 22 / 0.65)';
      node.style.outlineOffset = '3px';
      node.style.borderRadius = '3px';

      const showOutline = () => { node.style.outline = '2px solid rgb(249 115 22 / .82)'; };
      const hideOutline = () => { if (node !== node.ownerDocument.activeElement) node.style.outline = selectedSection.sectionKey === 'home.hero' ? 'none' : '1px dashed rgb(249 115 22 / 0.65)'; };

      const onBlur = () => {
        const nextValue = normalizeText(node.textContent ?? '');
        if (nextValue !== value) onTextChange(selectedSection.id, path, nextValue);
      };
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Enter' && !['description', 'subtitle', 'text', 'address', 'vision', 'mission'].includes(fieldKey)) {
          event.preventDefault();
          node.blur();
        }
        if (event.key === 'Escape') {
          if (hasHtml(value)) {
            node.innerHTML = value;
          } else {
            node.textContent = value;
          }
          node.blur();
        }
      };
      node.addEventListener('blur', onBlur);
      node.addEventListener('keydown', onKeyDown);
      node.addEventListener('mouseenter', showOutline);
      node.addEventListener('mouseleave', hideOutline);
      node.addEventListener('focus', showOutline);
      actionCleanups.push(() => {
        node.removeEventListener('blur', onBlur);
        node.removeEventListener('keydown', onKeyDown);
        node.removeEventListener('mouseenter', showOutline);
        node.removeEventListener('mouseleave', hideOutline);
        node.removeEventListener('focus', showOutline);
        node.removeAttribute('contenteditable');
        node.removeAttribute('role');
        node.removeAttribute('aria-label');
        node.removeAttribute('title');
        node.style.cursor = '';
        node.style.outline = '';
        node.style.outlineOffset = '';
        node.style.borderRadius = '';
      });
    });

    let imageEntry: { key: string; path: Array<string | number>; value: string } | undefined;
    const topLevelImage = Object.entries(selectedSection.config).find(([key, value]) => ['imageId', 'backgroundImageId'].includes(key) && typeof value === 'string');
    if (topLevelImage) imageEntry = { key: topLevelImage[0], path: [topLevelImage[0]], value: String(topLevelImage[1]) };
    if (!imageEntry && selectedSection.sectionKey === 'home.hero' && Array.isArray(selectedSection.config.slides)) {
      const slideIndex = Math.min(activeHeroSlide, Math.max(0, selectedSection.config.slides.length - 1));
      const slide = selectedSection.config.slides[slideIndex];
      if (slide && typeof slide === 'object' && !Array.isArray(slide)) {
        const field = 'backgroundImageId';
        if (typeof slide[field] === 'string') imageEntry = { key: field, path: ['slides', slideIndex, field], value: String(slide[field]) };
      }
    }
    const imageNode = selectedSectionRoot.querySelector<HTMLElement>('img');
    if (imageEntry && imageNode) {
      const { key, path, value } = imageEntry;
      const asset = findPageBuilderImage(value);
      if (asset && imageNode.tagName === 'IMG') (imageNode as HTMLImageElement).src = asset.thumbnail_url ?? asset.url;
      imageNode.dataset.pageBuilderMediaEdit = key;
      if (onEditMedia) {
        imageNode.title = 'Bấm để thay ảnh';
        imageNode.style.cursor = 'pointer';
        imageNode.style.outline = selectedSection.sectionKey === 'home.hero' ? 'none' : '1px dashed rgb(249 115 22 / 0.65)';
        imageNode.style.outlineOffset = '3px';
        const editImage = (event: MouseEvent) => { 
          event.preventDefault(); 
          event.stopPropagation(); 
          onEditMedia(selectedSection.id, path, value); 
        };
        imageNode.addEventListener('click', editImage);
        actionCleanups.push(() => {
          imageNode.removeEventListener('click', editImage);
          delete imageNode.dataset.pageBuilderMediaEdit;
          imageNode.removeAttribute('title');
          imageNode.style.cursor = '';
          imageNode.style.outline = '';
          imageNode.style.outlineOffset = '';
        });
      }
    }

    if (selectedSection.sectionKey === 'home.hero' && Array.isArray(selectedSection.config.slides) && onEditMedia) {
      const slideIndex = Math.min(activeHeroSlide, Math.max(0, selectedSection.config.slides.length - 1));
      const slide = selectedSection.config.slides[slideIndex];
      if (slide && typeof slide === 'object' && !Array.isArray(slide)) {
        const mediaActions = selectedSectionRoot.ownerDocument.createElement('div');
        mediaActions.dataset.pageBuilderAction = 'hero-media-actions';
        mediaActions.style.cssText = `position:absolute;z-index:2147483646;left:${viewport === 'mobile' ? '10px' : '18px'};top:${viewport === 'mobile' ? '10px' : '18px'};display:flex;gap:7px;padding:${viewport === 'mobile' ? '4px' : '6px'};border:1px solid rgba(255,255,255,.24);border-radius:11px;background:rgba(15,23,42,.88);box-shadow:0 10px 28px rgba(15,23,42,.28);backdrop-filter:blur(8px);`;
        const addMediaAction = (label: string, field: 'backgroundImageId' | 'mobileImageId') => {
          const button = selectedSectionRoot.ownerDocument.createElement('button'); 
          button.type = 'button'; 
          button.textContent = label;
          button.style.cssText = 'min-height:38px;border:1px solid rgba(255,255,255,.18);border-radius:8px;padding:9px 12px;background:rgba(255,255,255,.1);color:#fff;font:800 12px/1 system-ui;cursor:pointer;';
          const click = (event: MouseEvent) => { 
            event.preventDefault(); 
            event.stopPropagation(); 
            onEditMedia(selectedSection.id, ['slides', slideIndex, field], String(slide[field] ?? '')); 
          };
          button.addEventListener('click', click); 
          actionCleanups.push(() => button.removeEventListener('click', click)); 
          mediaActions.appendChild(button);
        };
        addMediaAction(viewport === 'desktop' ? `Thay ảnh Slide ${slideIndex + 1}` : 'Thay ảnh', 'backgroundImageId');
        selectedSectionRoot.appendChild(mediaActions);
        actionCleanups.push(() => mediaActions.remove());
      }
    }

    const ctaEntries = ctaEntriesForSection(selectedSection, activeHeroSlide, selectedSectionRoot);
    const actionCandidates = Array.from(selectedSectionRoot.querySelectorAll<HTMLElement>('a,button')).filter((node) => !node.closest('[data-page-builder-action]'));
    const linkCandidates = actionCandidates.filter((node) => node.tagName === 'A');
    const labeledCandidates = actionCandidates.filter((node) => !node.getAttribute('aria-label') && normalizeText(node.textContent ?? '').length > 2);
    const ctaNodes = linkCandidates.length >= ctaEntries.length ? linkCandidates : labeledCandidates;
    ctaEntries.forEach(({ key, path }, index) => {
      const serializedPath = JSON.stringify(path);
      const node = selectedSectionRoot.querySelector<HTMLElement>(`[data-page-builder-cta-key='${serializedPath}']`) ?? ctaNodes[index];
      if (!node) return;
      const labelKey = `${key}Label`;
      const urlKey = `${key}Url`;
      const overrideLabel = selectedSection.config[labelKey];
      const overrideUrl = selectedSection.config[urlKey];
      const overrideNewTab = selectedSection.config[`${key}NewTab`];
      if (typeof overrideLabel === 'string' && overrideLabel.trim()) {
        const span = node.querySelector('span');
        if (span) span.textContent = overrideLabel;
        else node.textContent = overrideLabel;
      }
      if (node.tagName === 'A' && typeof overrideUrl === 'string' && overrideUrl.trim()) node.setAttribute('href', overrideUrl);
      if (node.tagName === 'A') overrideNewTab ? node.setAttribute('target', '_blank') : node.removeAttribute('target');
      if (!onEditCta) return;
      node.dataset.pageBuilderCtaEdit = key;
      node.title = 'Bấm để sửa CTA';
      node.style.outline = selectedSection.sectionKey === 'home.hero' ? 'none' : '1px dashed rgb(249 115 22 / 0.65)';
      node.style.outlineOffset = '3px';
      const showOutline = () => { node.style.outline = '2px solid rgb(249 115 22 / .82)'; };
      const hideOutline = () => { node.style.outline = selectedSection.sectionKey === 'home.hero' ? 'none' : '1px dashed rgb(249 115 22 / 0.65)'; };
      const editCta = (event: MouseEvent) => {
        event.preventDefault(); 
        event.stopPropagation();
        const nodeRect = node.getBoundingClientRect();
        const frameRect = frame?.getBoundingClientRect();
        const labelSpan = node.querySelector('span');
        onEditCta(selectedSection.id, path, normalizeText(labelSpan?.textContent ?? node.textContent ?? ''), {
          left: (frameRect?.left ?? 0) + nodeRect.left * scale,
          top: (frameRect?.top ?? 0) + nodeRect.bottom * scale + 8,
        });
      };
      node.addEventListener('click', editCta);
      node.addEventListener('mouseenter', showOutline);
      node.addEventListener('mouseleave', hideOutline);
      actionCleanups.push(() => {
        node.removeEventListener('click', editCta);
        node.removeEventListener('mouseenter', showOutline);
        node.removeEventListener('mouseleave', hideOutline);
        delete node.dataset.pageBuilderCtaEdit;
        node.removeAttribute('title');
        node.style.outline = '';
        node.style.outlineOffset = '';
      });
    });
  }

  // Cleanup on unmount / re-render
  return () => {
    actionCleanups.forEach((cleanup) => cleanup());
    nodes.forEach((node) => {
      delete node.dataset.pageBuilderSectionId;
      node.classList.remove('cursor-pointer', 'transition-[outline,box-shadow]');
      node.style.outline = '';
      node.style.outlineOffset = '';
      node.style.boxShadow = '';
      node.style.display = '';
      node.style.opacity = '';
      node.style.order = '';
      node.style.height = '';
      node.style.minHeight = '';
      node.style.overflow = '';
      node.querySelectorAll('[data-page-builder-action]').forEach((action) => action.remove());
    });
    root.style.display = '';
    root.style.flexDirection = '';
  };
}
