import sanitizeHtml from 'sanitize-html';
import { resolveAllowedIframeEmbedSrc, resolveAllowedVideoEmbedSrc } from './rich-text-embeds';

export const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'b', 'i', 'strong', 'em', 'strike', 'code', 'pre', 'hr', 'br',
    'u', 's', 'del', 'sub', 'sup', 'mark', 'small', 'kbd', 'abbr',
    'ul', 'ol', 'li', 'dl', 'dt', 'dd',
    'blockquote', 'figure', 'figcaption', 'details', 'summary',
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'colgroup', 'col',
    'span', 'div', 'section', 'article', 'aside',
    'a', 'img', 'iframe', 'oembed', 'video', 'audio', 'source',
  ],
  allowedAttributes: {
    '*': ['class', 'style', 'id', 'dir', 'lang', 'title', 'role'],
    a: ['href', 'name', 'target', 'rel'],
    div: [
      'data-cms-reference',
      'data-cta-id',
      'data-form-id',
      'data-reference-label',
      'data-reference-description',
      'data-reference-alignment',
      'data-oembed-url',
    ],
    span: ['data-cms-style', 'data-cms-color', 'data-cms-hover'],
    figure: ['data-align'],
    details: ['open'],
    img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading', 'decoding', 'referrerpolicy', 'data-align'],
    iframe: ['src', 'title', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen', 'loading', 'referrerpolicy'],
    oembed: ['url'],
    video: ['src', 'controls', 'autoplay', 'loop', 'muted', 'playsinline', 'preload', 'poster', 'width', 'height'],
    audio: ['src', 'controls', 'preload'],
    source: ['src', 'type'],
    table: ['width', 'cellpadding', 'cellspacing', 'border'],
    col: ['span', 'width'],
    colgroup: ['span', 'width'],
    td: ['colspan', 'rowspan', 'align', 'valign', 'scope', 'width'],
    th: ['colspan', 'rowspan', 'align', 'valign', 'scope', 'width'],
  },
  allowedStyles: {
    '*': {
      'color': [/^(?:#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})|rgb\(\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*\)|rgba\(\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*,\s*(?:0|1|0?\.\d+)\s*\)|hsl\([^)]+\)|hsla\([^)]+\)|[a-z]+)$/i],
      '--cms-hover-color': [/^(?:#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})|rgb\(\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*\)|rgba\(\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*,\s*(?:0|1|0?\.\d+)\s*\))$/i],
      'background-color': [/^(?:#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})|rgb\(\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*\)|rgba\(\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*,\s*(?:0|1|0?\.\d+)\s*\)|hsl\([^)]+\)|hsla\([^)]+\)|transparent|[a-z]+)$/i],
      'text-align': [/^(?:left|right|center|justify)$/i],
      'font-size': [/^\d+(?:\.\d+)?(?:px|em|rem|%|pt)$/i],
      'font-weight': [/^(?:bold|bolder|lighter|normal|[1-9]00)$/i],
      'font-style': [/^(?:italic|normal|oblique)$/i],
      'font-family': [/^[a-zA-Z0-9\s,"'-]+$/],
      'text-decoration': [/^(?:none|underline|line-through|overline)(?:\s+(?:solid|dashed|dotted|double))?$/i],
      'line-height': [/^(?:normal|\d+(?:\.\d+)?(?:px|em|rem|%)?)$/i],
      'width': [/^(?:auto|\d+(?:\.\d+)?(?:px|em|rem|%|vw))$/i],
      'height': [/^(?:auto|\d+(?:\.\d+)?(?:px|em|rem|%|vh))$/i],
      'max-width': [/^(?:none|\d+(?:\.\d+)?(?:px|em|rem|%|vw))$/i],
      'max-height': [/^(?:none|\d+(?:\.\d+)?(?:px|em|rem|%|vh))$/i],
      'min-width': [/^(?:auto|\d+(?:\.\d+)?(?:px|em|rem|%|vw))$/i],
      'min-height': [/^(?:auto|\d+(?:\.\d+)?(?:px|em|rem|%|vh))$/i],
      'aspect-ratio': [/^\d+(?:\.\d+)?\s*\/\s*\d+(?:\.\d+)?$/],
      'margin': [/^(?:auto|0|\d+(?:\.\d+)?(?:px|em|rem|%))(?:\s+(?:auto|0|\d+(?:\.\d+)?(?:px|em|rem|%))){0,3}$/i],
      'margin-inline': [/^(?:auto|0|\d+(?:\.\d+)?(?:px|em|rem|%))(?:\s+(?:auto|0|\d+(?:\.\d+)?(?:px|em|rem|%)))?$/i],
      'margin-top': [/^(?:auto|0|\d+(?:\.\d+)?(?:px|em|rem|%))$/i],
      'margin-bottom': [/^(?:auto|0|\d+(?:\.\d+)?(?:px|em|rem|%))$/i],
      'margin-left': [/^(?:auto|0|\d+(?:\.\d+)?(?:px|em|rem|%))$/i],
      'margin-right': [/^(?:auto|0|\d+(?:\.\d+)?(?:px|em|rem|%))$/i],
      'padding': [/^(?:0|\d+(?:\.\d+)?(?:px|em|rem|%))(?:\s+(?:0|\d+(?:\.\d+)?(?:px|em|rem|%))){0,3}$/i],
      'padding-top': [/^(?:0|\d+(?:\.\d+)?(?:px|em|rem|%))$/i],
      'padding-bottom': [/^(?:0|\d+(?:\.\d+)?(?:px|em|rem|%))$/i],
      'padding-left': [/^(?:0|\d+(?:\.\d+)?(?:px|em|rem|%))$/i],
      'padding-right': [/^(?:0|\d+(?:\.\d+)?(?:px|em|rem|%))$/i],
      'border': [/^(?:none|hidden|0|dotted|dashed|solid|double|groove|ridge|inset|outset|\d+(?:\.\d+)?px(?:\s+(?:solid|dashed|dotted))?(?:\s+(?:#(?:[0-9a-f]{3}|[0-9a-f]{6})|[a-z]+))?)$/i],
      'border-width': [/^\d+(?:\.\d+)?(?:px|em|rem)(?:\s+\d+(?:\.\d+)?(?:px|em|rem)){0,3}$/i],
      'border-style': [/^(?:none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset)$/i],
      'border-color': [/^(?:#(?:[0-9a-f]{3}|[0-9a-f]{6})|rgb\([^)]+\)|rgba\([^)]+\)|transparent|[a-z]+)$/i],
      'border-radius': [/^(?:0|\d+(?:\.\d+)?(?:px|em|rem|%))(?:\s+(?:0|\d+(?:\.\d+)?(?:px|em|rem|%))){0,3}$/i],
      'border-collapse': [/^(?:collapse|separate)$/i],
      'border-spacing': [/^\d+(?:\.\d+)?(?:px|em)(?:\s+\d+(?:\.\d+)?(?:px|em))?$/i],
      'vertical-align': [/^(?:baseline|sub|super|top|text-top|middle|bottom|text-bottom)$/i],
      'display': [/^(?:inline|block|inline-block|flex|inline-flex|grid|table|table-row|table-cell|none)$/i],
      'flex-direction': [/^(?:row|row-reverse|column|column-reverse)$/i],
      'flex-wrap': [/^(?:nowrap|wrap|wrap-reverse)$/i],
      'align-items': [/^(?:stretch|center|flex-start|flex-end|start|end|baseline)$/i],
      'justify-content': [/^(?:center|flex-start|flex-end|start|end|space-between|space-around|space-evenly)$/i],
      'gap': [/^\d+(?:\.\d+)?(?:px|em|rem|%)$/i],
      'grid-template-columns': [/^[a-zA-Z0-9\s(),.%-]+$/],
      'overflow': [/^(?:visible|hidden|auto|scroll)$/i],
      'overflow-x': [/^(?:visible|hidden|auto|scroll)$/i],
      'object-fit': [/^(?:contain|cover|fill|none|scale-down)$/i],
      'float': [/^(?:left|right|none)$/i],
    },
  },
  allowedIframeHostnames: [
    'www.youtube.com',
    'youtube.com',
    'www.youtube-nocookie.com',
    'youtube-nocookie.com',
    'player.vimeo.com',
  ],
  allowProtocolRelative: false,
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowedSchemesByTag: {
    img: ['http', 'https', 'data'],
  },
  transformTags: {
    h1: (_tagName, attribs) => {
      // SEO: Avoid multiple H1 tags on detail pages by converting body H1 to H2
      return { tagName: 'h2', attribs };
    },
    oembed: (_tagName, attribs): sanitizeHtml.Tag => {
      const safeSrc = resolveAllowedVideoEmbedSrc(attribs.url || '');
      if (!safeSrc) {
        return { tagName: 'span', attribs: {} };
      }
      return {
        tagName: 'iframe',
        attribs: {
          src: safeSrc,
          title: 'Video giới thiệu CIC Technology',
          allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
          referrerpolicy: 'strict-origin-when-cross-origin',
          allowfullscreen: 'allowfullscreen',
          loading: 'lazy',
          class: 'w-full aspect-video rounded-[10px] border-0',
        },
      };
    },
    iframe: (_tagName, attribs) => {
      const safeSrc = resolveAllowedIframeEmbedSrc(attribs.src || '');
      if (!safeSrc) {
        return { tagName: 'iframe', attribs: {} };
      }
      return {
        tagName: 'iframe',
        attribs: {
          ...attribs,
          src: safeSrc,
          title: attribs.title?.trim() || 'Video giới thiệu CIC Technology',
          allow: attribs.allow || 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
          referrerpolicy: 'strict-origin-when-cross-origin',
          allowfullscreen: 'allowfullscreen',
          loading: attribs.loading || 'lazy',
          class: attribs.class || 'w-full aspect-video rounded-[10px] border-0',
        },
      };
    },
    a: (_tagName, attribs) => {
      let href = attribs.href || '';
      if (/phongcachso\.com/i.test(href)) {
        href = href.replace(/https?:\/\/(?:www\.)?phongcachso\.com/gi, '');
        attribs.href = href || '/';
      }
      const isExternal = /^https?:\/\//i.test(href) && !/^https?:\/\/(?:[a-z0-9-]+\.)*cic\.com\.vn/i.test(href);
      if (attribs.target === '_blank' || isExternal) {
        attribs.rel = 'noopener noreferrer';
      }
      return { tagName: 'a', attribs };
    },
    img: (_tagName, attribs) => {
      if (attribs.src && /^data:/i.test(attribs.src)) {
        if (!/^data:image\/(?:png|jpeg|jpg|webp|gif|avif);base64,/i.test(attribs.src)) {
          delete attribs.src;
        }
      }
      attribs.referrerpolicy = attribs.referrerpolicy || 'no-referrer';
      attribs.loading = attribs.loading || 'lazy';
      attribs.decoding = attribs.decoding || 'async';
      if (!attribs.alt || !attribs.alt.trim()) {
        attribs.alt = attribs.title?.trim() || 'Hình ảnh minh họa CIC';
      }
      return { tagName: 'img', attribs };
    },
  },
  exclusiveFilter: (frame) => {
    if (/^h[1-6]$/i.test(frame.tag) && (!frame.text || !frame.text.replace(/\u00a0|&nbsp;/gi, '').trim())) {
      return true;
    }
    if (frame.tag === 'iframe' && (!frame.attribs.src || !frame.attribs.src.trim())) {
      return true;
    }
    if (frame.tag === 'img' && (!frame.attribs.src || !frame.attribs.src.trim())) {
      return true;
    }
    return false;
  },
};

function wrapResponsiveTables(html: string): string {
  if (!/<table\b/i.test(html)) return html;
  const PROTECTED_WRAP_TOKEN = '___CIC_TABLE_WRAPPED_';
  const kept: string[] = [];
  let work = html.replace(
    /<div\b[^>]*class=["'][^"']*overflow-x-auto[^"']*["'][^>]*>\s*<table\b[\s\S]*?<\/table>\s*<\/div>/gi,
    (m) => {
      const idx = kept.length;
      kept.push(m);
      return `${PROTECTED_WRAP_TOKEN}${idx}___`;
    },
  );
  work = work.replace(
    /<table\b[\s\S]*?<\/table>/gi,
    (tableHtml) => `<div class="overflow-x-auto my-4 w-full">${tableHtml}</div>`,
  );
  for (let i = 0; i < kept.length; i++) {
    work = work.replace(`${PROTECTED_WRAP_TOKEN}${i}___`, kept[i]!);
  }
  return work;
}

export function sanitizeHtmlContent(html: string | null | undefined): string {
  if (!html) return '';
  const sanitized = sanitizeHtml(html, SANITIZE_OPTIONS);
  return wrapResponsiveTables(sanitized);
}

export const prepareRichHtmlForRender = sanitizeHtmlContent;

const INLINE_TEXT_SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ['span', 'b', 'strong', 'i', 'em', 'u', 'br'],
  allowedAttributes: {
    span: ['style', 'class', 'data-cms-style', 'data-cms-color', 'data-cms-hover'],
  },
  allowedStyles: {
    span: {
      'color': SANITIZE_OPTIONS.allowedStyles?.['*']?.['color'] ?? [],
      '--cms-hover-color': [
        /^(?:#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})|rgb\(\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*\)|rgba\(\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*,\s*(?:0|1|0?\.\d+)\s*\))$/i,
      ],
      'font-size': [/^\d+(?:\.\d+)?(?:px|em|rem|%)$/i],
      'font-weight': [/^(?:bold|bolder|lighter|normal|[1-9]00)$/i],
      'font-style': [/^(?:italic|normal|oblique)$/i],
      'text-decoration': [/^(?:none|underline|line-through)$/i],
      'text-align': [/^(?:left|right|center|justify)$/i],
      'display': [/^(?:inline|inline-block|block)$/i],
    },
  },
};

export function hasSafeInlineHtml(value: string | null | undefined): boolean {
  if (!value) return false;
  return /<(?:span|b|strong|i|em|u|br)\b/i.test(value);
}

export function sanitizeInlineTextHtml(html: string | null | undefined): string {
  if (!html) return '';
  return sanitizeHtml(html, INLINE_TEXT_SANITIZE_OPTIONS).trim();
}

/**
 * Validates that a URL is safe to use in an href attribute (blocks javascript:, vbscript:, data:, etc.)
 */
export function isSafeUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  return /^(?:https?:\/\/|\/|#|mailto:|tel:)/i.test(trimmed);
}

/**
 * Sanitizes a URL for use in an <a href> link.
 * Returns the URL if safe, or a fallback (default '#') if unsafe (e.g. javascript: attacks).
 */
export function sanitizeHref(url: string | null | undefined, fallback: string = '#'): string {
  if (!url) return fallback;
  const trimmed = url.trim();
  if (isSafeUrl(trimmed)) {
    return trimmed;
  }
  return fallback;
}
