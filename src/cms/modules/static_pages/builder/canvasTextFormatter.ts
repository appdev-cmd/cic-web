import { hasSafeInlineHtml, sanitizeInlineTextHtml } from '@/shared/lib/sanitize';

export interface CanvasFormatState {
  canFormat: boolean;
  fieldLabel: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  fontSize: string;
  fontWeight: string;
  color: string;
  hoverColor: string;
  textAlign: 'left' | 'center' | 'right' | '';
}

export const DEFAULT_CANVAS_FORMAT_STATE: CanvasFormatState = {
  canFormat: false,
  fieldLabel: '',
  bold: false,
  italic: false,
  underline: false,
  fontSize: '',
  fontWeight: '',
  color: '#0f172a',
  hoverColor: '#ea580c',
  textAlign: '',
};

export interface FormatCommandInput {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  fontSize?: number | null;
  fontWeight?: string | null;
  color?: string | null;
  hoverColor?: string | null;
  textAlign?: 'left' | 'center' | 'right' | '';
  clearFormat?: boolean;
}

function rgbToHex(raw: string): string {
  if (!raw) return '';
  if (raw.startsWith('#')) return raw;
  const match = raw.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (!match) return '';
  const r = Number(match[1]).toString(16).padStart(2, '0');
  const g = Number(match[2]).toString(16).padStart(2, '0');
  const b = Number(match[3]).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

export function findActiveRichInlineElement(doc: Document | null | undefined): HTMLElement | null {
  if (!doc) return null;
  const active = doc.activeElement as HTMLElement | null;
  if (active?.dataset?.pageBuilderRichInline === 'true') {
    return active;
  }
  const sel = doc.getSelection();
  if (sel && sel.rangeCount > 0) {
    const anchor = sel.anchorNode;
    const el = anchor instanceof HTMLElement ? anchor : anchor?.parentElement;
    const richParent = el?.closest<HTMLElement>('[data-page-builder-rich-inline="true"]');
    if (richParent) return richParent;
  }
  return null;
}

export function readCanvasFormatState(doc: Document | null | undefined): CanvasFormatState {
  const el = findActiveRichInlineElement(doc);
  if (!doc || !el) return DEFAULT_CANVAS_FORMAT_STATE;

  const win = doc.defaultView ?? window;
  const sel = doc.getSelection();
  let targetEl: HTMLElement = el;
  if (sel && sel.rangeCount > 0 && sel.anchorNode && el.contains(sel.anchorNode)) {
    const candidate = sel.anchorNode instanceof HTMLElement ? sel.anchorNode : sel.anchorNode.parentElement;
    if (candidate && el.contains(candidate)) {
      targetEl = candidate;
    }
  }

  const cs = win.getComputedStyle(targetEl);
  let bold = false;
  let italic = false;
  let underline = false;
  try {
    bold = doc.queryCommandState('bold') || Number(cs.fontWeight) >= 700;
    italic = doc.queryCommandState('italic') || cs.fontStyle === 'italic';
    underline = doc.queryCommandState('underline') || cs.textDecorationLine.includes('underline');
  } catch {
    bold = Number(cs.fontWeight) >= 700;
    italic = cs.fontStyle === 'italic';
    underline = cs.textDecorationLine.includes('underline');
  }

  const styledSpan = targetEl.closest<HTMLElement>('[data-cms-style="1"]');
  const inlineSize = styledSpan?.style.fontSize ? parseInt(styledSpan.style.fontSize, 10) : NaN;
  const computedSize = Math.round(parseFloat(cs.fontSize || '0'));
  const fontSize = Number.isFinite(inlineSize) ? String(inlineSize) : computedSize ? String(computedSize) : '';

  const fontWeight = styledSpan?.style.fontWeight || cs.fontWeight || '';
  const color = rgbToHex(styledSpan?.style.color || cs.color) || '#0f172a';
  const hoverColor =
    rgbToHex(styledSpan?.style.getPropertyValue('--cms-hover-color') || el.style.getPropertyValue('--cms-hover-color')) ||
    '#ea580c';

  const alignWrapper = el.querySelector<HTMLElement>('[data-cms-align="1"]');
  const rawAlign = alignWrapper?.style.textAlign || el.style.textAlign || '';
  const textAlign =
    rawAlign === 'left' || rawAlign === 'center' || rawAlign === 'right'
      ? rawAlign
      : '';

  return {
    canFormat: true,
    fieldLabel: el.title || 'Văn bản đang chọn',
    bold,
    italic,
    underline,
    fontSize,
    fontWeight,
    color,
    hoverColor,
    textAlign,
  };
}

function applySpanStyleInElement(
  doc: Document,
  el: HTMLElement,
  mutate: (span: HTMLElement) => void
) {
  el.focus();
  const sel = doc.getSelection();
  if (!sel) return;

  let range: Range;
  if (sel.rangeCount > 0 && !sel.isCollapsed && el.contains(sel.anchorNode)) {
    range = sel.getRangeAt(0);
  } else {
    range = doc.createRange();
    range.selectNodeContents(el);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  const singleNode =
    range.startContainer === range.endContainer && range.startContainer.nodeType === Node.ELEMENT_NODE
      ? (range.startContainer.childNodes[range.startOffset] as HTMLElement | undefined)
      : range.commonAncestorContainer instanceof HTMLElement
        ? range.commonAncestorContainer
        : range.commonAncestorContainer.parentElement;

  if (
    singleNode &&
    singleNode !== el &&
    el.contains(singleNode) &&
    singleNode.tagName === 'SPAN' &&
    singleNode.dataset.cmsStyle === '1' &&
    (singleNode.textContent ?? '').trim() === range.toString().trim()
  ) {
    mutate(singleNode);
    return;
  }

  // If whole element only has one top-level styled span and whole element is selected, reuse it
  if (
    el.childElementCount === 1 &&
    el.firstElementChild instanceof HTMLElement &&
    el.firstElementChild.tagName === 'SPAN' &&
    el.firstElementChild.dataset.cmsStyle === '1' &&
    (el.textContent ?? '').trim() === range.toString().trim()
  ) {
    mutate(el.firstElementChild);
    return;
  }

  const span = doc.createElement('span');
  span.dataset.cmsStyle = '1';
  mutate(span);

  try {
    const contents = range.extractContents();
    span.appendChild(contents);
    range.insertNode(span);
    const nextRange = doc.createRange();
    nextRange.selectNodeContents(span);
    sel.removeAllRanges();
    sel.addRange(nextRange);
  } catch {
    // Fallback if selection crosses complex boundaries: wrap entire innerHTML
    const inner = el.innerHTML;
    el.innerHTML = '';
    span.innerHTML = inner;
    el.appendChild(span);
  }
}

export function serializeInlineElementValue(el: HTMLElement): string {
  const rawHtml = el.innerHTML;
  if (hasSafeInlineHtml(rawHtml)) {
    const sanitized = sanitizeInlineTextHtml(rawHtml);
    if (hasSafeInlineHtml(sanitized)) {
      return sanitized;
    }
  }
  return (el.textContent ?? '').replace(/\s+/g, ' ').trim();
}

export function applyCanvasFormatCommand(
  doc: Document | null | undefined,
  command: FormatCommandInput
): { sectionId: string; path: Array<string | number>; value: string } | null {
  const el = findActiveRichInlineElement(doc);
  if (!doc || !el) return null;

  const sectionId = el.dataset.pageBuilderSectionRef ?? '';
  let path: Array<string | number> = [];
  try {
    path = JSON.parse(el.dataset.pageBuilderFieldPath ?? '[]') as Array<string | number>;
  } catch {
    path = [];
  }
  if (!sectionId || path.length === 0) return null;

  el.focus();
  const sel = doc.getSelection();

  const ensureSelectionForToggle = () => {
    if (!sel) return;
    if (sel.rangeCount === 0 || sel.isCollapsed || !el.contains(sel.anchorNode)) {
      const r = doc.createRange();
      r.selectNodeContents(el);
      sel.removeAllRanges();
      sel.addRange(r);
    }
  };

  if (command.clearFormat) {
    const plain = (el.textContent ?? '').replace(/\s+/g, ' ').trim();
    el.textContent = plain;
    el.style.textAlign = '';
    return { sectionId, path, value: plain };
  }

  if (command.bold !== undefined) {
    ensureSelectionForToggle();
    doc.execCommand('bold', false);
  }
  if (command.italic !== undefined) {
    ensureSelectionForToggle();
    doc.execCommand('italic', false);
  }
  if (command.underline !== undefined) {
    ensureSelectionForToggle();
    doc.execCommand('underline', false);
  }

  if (command.fontSize !== undefined) {
    applySpanStyleInElement(doc, el, (span) => {
      if (command.fontSize && command.fontSize >= 10) {
        span.style.fontSize = `${command.fontSize}px`;
      } else {
        span.style.removeProperty('font-size');
      }
    });
  }

  if (command.fontWeight !== undefined) {
    applySpanStyleInElement(doc, el, (span) => {
      if (command.fontWeight) {
        span.style.fontWeight = command.fontWeight;
      } else {
        span.style.removeProperty('font-weight');
      }
    });
  }

  if (command.color !== undefined) {
    applySpanStyleInElement(doc, el, (span) => {
      if (command.color) {
        span.style.color = command.color;
        span.dataset.cmsColor = '1';
      } else {
        span.style.removeProperty('color');
        delete span.dataset.cmsColor;
      }
    });
  }

  if (command.hoverColor !== undefined) {
    applySpanStyleInElement(doc, el, (span) => {
      if (command.hoverColor) {
        span.style.setProperty('--cms-hover-color', command.hoverColor);
        span.dataset.cmsHover = '1';
      } else {
        span.style.removeProperty('--cms-hover-color');
        delete span.dataset.cmsHover;
      }
    });
  }

  if (command.textAlign !== undefined) {
    applySpanStyleInElement(doc, el, (span) => {
      if (command.textAlign) {
        span.style.display = 'block';
        span.style.textAlign = command.textAlign;
      } else {
        span.style.removeProperty('text-align');
        if (span.style.display === 'block') span.style.removeProperty('display');
      }
    });
  }

  const nextValue = serializeInlineElementValue(el);
  return { sectionId, path, value: nextValue };
}
