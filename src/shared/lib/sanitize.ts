import sanitizeHtml from 'sanitize-html';

export const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'b', 'i', 'strong', 'em', 'strike', 'code', 'pre', 'hr', 'br',
    'u', 's', 'sub', 'sup', 'mark',
    'ul', 'ol', 'li',
    'blockquote', 'figure', 'figcaption',
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
    'span', 'div',
    'a', 'img', 'iframe', 'video', 'source',
  ],
  allowedAttributes: {
    '*': ['class', 'style', 'id', 'dir', 'lang', 'title'],
    a: ['href', 'name', 'target', 'rel'],
    img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading', 'referrerpolicy'],
    iframe: ['src', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen'],
    video: ['src', 'controls', 'autoplay', 'loop', 'muted', 'poster', 'width', 'height'],
    source: ['src', 'type'],
    td: ['colspan', 'rowspan', 'align', 'valign'],
    th: ['colspan', 'rowspan', 'align', 'valign'],
  },
  allowedStyles: {
    '*': {
      'color': [/^(?:#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})|rgb\(\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*\)|rgba\(\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*,\s*(?:0|1|0?\.\d+)\s*\)|hsl\([^)]+\)|hsla\([^)]+\)|[a-z]+)$/i],
      'background-color': [/^(?:#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})|rgb\(\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*\)|rgba\(\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*,\s*(?:0|1|0?\.\d+)\s*\)|hsl\([^)]+\)|hsla\([^)]+\)|transparent|[a-z]+)$/i],
      'text-align': [/^(?:left|right|center|justify)$/i],
      'font-size': [/^\d+(?:\.\d+)?(?:px|em|rem|%|pt)$/i],
      'font-weight': [/^(?:bold|bolder|lighter|normal|[1-9]00)$/i],
      'font-style': [/^(?:italic|normal|oblique)$/i],
      'text-decoration': [/^(?:none|underline|line-through|overline)(?:\s+(?:solid|dashed|dotted|double))?$/i],
      'line-height': [/^(?:normal|\d+(?:\.\d+)?(?:px|em|rem|%)?)$/i],
      'width': [/^(?:auto|\d+(?:\.\d+)?(?:px|em|rem|%|vw))$/i],
      'height': [/^(?:auto|\d+(?:\.\d+)?(?:px|em|rem|%|vh))$/i],
      'max-width': [/^(?:none|\d+(?:\.\d+)?(?:px|em|rem|%|vw))$/i],
      'max-height': [/^(?:none|\d+(?:\.\d+)?(?:px|em|rem|%|vh))$/i],
      'min-width': [/^(?:auto|\d+(?:\.\d+)?(?:px|em|rem|%|vw))$/i],
      'min-height': [/^(?:auto|\d+(?:\.\d+)?(?:px|em|rem|%|vh))$/i],
      'margin': [/^(?:auto|0|\d+(?:\.\d+)?(?:px|em|rem|%))(?:\s+(?:auto|0|\d+(?:\.\d+)?(?:px|em|rem|%))){0,3}$/i],
      'margin-top': [/^(?:auto|0|\d+(?:\.\d+)?(?:px|em|rem|%))$/i],
      'margin-bottom': [/^(?:auto|0|\d+(?:\.\d+)?(?:px|em|rem|%))$/i],
      'margin-left': [/^(?:auto|0|\d+(?:\.\d+)?(?:px|em|rem|%))$/i],
      'margin-right': [/^(?:auto|0|\d+(?:\.\d+)?(?:px|em|rem|%))$/i],
      'padding': [/^(?:0|\d+(?:\.\d+)?(?:px|em|rem|%))(?:\s+(?:0|\d+(?:\.\d+)?(?:px|em|rem|%))){0,3}$/i],
      'padding-top': [/^(?:0|\d+(?:\.\d+)?(?:px|em|rem|%))$/i],
      'padding-bottom': [/^(?:0|\d+(?:\.\d+)?(?:px|em|rem|%))$/i],
      'padding-left': [/^(?:0|\d+(?:\.\d+)?(?:px|em|rem|%))$/i],
      'padding-right': [/^(?:0|\d+(?:\.\d+)?(?:px|em|rem|%))$/i],
      'border': [/^(?:none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset|\d+(?:\.\d+)?px(?:\s+(?:solid|dashed|dotted))?(?:\s+(?:#(?:[0-9a-f]{3}|[0-9a-f]{6})|[a-z]+))?)$/i],
      'border-width': [/^\d+(?:\.\d+)?(?:px|em|rem)(?:\s+\d+(?:\.\d+)?(?:px|em|rem)){0,3}$/i],
      'border-style': [/^(?:none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset)$/i],
      'border-color': [/^(?:#(?:[0-9a-f]{3}|[0-9a-f]{6})|rgb\([^)]+\)|rgba\([^)]+\)|transparent|[a-z]+)$/i],
      'border-collapse': [/^(?:collapse|separate)$/i],
      'border-spacing': [/^\d+(?:\.\d+)?(?:px|em)(?:\s+\d+(?:\.\d+)?(?:px|em))?$/i],
      'vertical-align': [/^(?:baseline|sub|super|top|text-top|middle|bottom|text-bottom)$/i],
      'display': [/^(?:inline|block|inline-block|flex|inline-flex|grid|table|table-row|table-cell|none)$/i],
      'float': [/^(?:left|right|none)$/i],
    },
  },
  allowedIframeHostnames: ['www.youtube.com', 'youtube.com', 'player.vimeo.com'],
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowedSchemesByTag: {
    img: ['http', 'https', 'data'],
  },
  transformTags: {
    a: (tagName, attribs) => {
      if (attribs.target === '_blank') {
        attribs.rel = 'noopener noreferrer';
      }
      return { tagName: 'a', attribs };
    },
    img: (tagName, attribs) => {
      attribs.referrerpolicy = attribs.referrerpolicy || 'no-referrer';
      return { tagName: 'img', attribs };
    },
  },
};

export function sanitizeHtmlContent(html: string | null | undefined): string {
  if (!html) return '';
  return sanitizeHtml(html, SANITIZE_OPTIONS);
}
