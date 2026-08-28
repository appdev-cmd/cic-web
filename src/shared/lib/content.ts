/** Canonical origin for legacy CIC uploads and HTML content. */
export const CIC_ORIGIN = 'https://www.cic.com.vn';

export function normalizeMediaUrl(value: string | null | undefined): string {
  if (!value) return '';
  const raw = String(value).trim();
  if (!raw) return '';
  if (/^(https?:|data:|blob:|\/\/)/i.test(raw)) return raw.startsWith('//') ? `https:${raw}` : raw;
  return `${CIC_ORIGIN}/${raw.replace(/^\/+/, '')}`;
}

/** Resolve legacy relative image URLs while preserving all other HTML. */
export function normalizeHtmlContent(html: string | null | undefined): string {
  if (!html) return '';
  let headingIndex = 0;
  const normalized = html.replace(/(\s(?:src|href)\s*=\s*["'])([^"']+)(["'])/gi, (_m, prefix, url, suffix) => {
    if (/^src$/i.test(prefix.trim().split('=')[0])) return `${prefix}${normalizeMediaUrl(url)}${suffix}`;
    return `${prefix}${url}${suffix}`;
  }).replace(/<h([2-4])([^>]*)>/gi, (_m, level, attrs) => {
    headingIndex += 1;
    return attrs.includes('id=') ? `<h${level}${attrs}>` : `<h${level}${attrs} id="article-heading-${headingIndex}">`;
  });
  return normalized;
}
