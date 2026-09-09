import { normalizeHtmlContent } from '@/shared/lib/content';

export function normalizeProductMediaUrl(value: unknown): string {
  const raw = String(value ?? '').trim();
  if (!raw) return '';
  try {
    const url = new URL(raw.startsWith('//') ? `https:${raw}` : raw);
    if (/^(www\.)?cic\.com\.vn$/i.test(url.hostname) && url.pathname.startsWith('/images/')) return `${url.pathname}${url.search}`;
    return url.toString();
  } catch {
    const normalized = `/${raw.replace(/^\/+/, '')}`;
    return normalized.startsWith('/images/') ? normalized : raw;
  }
}

export function normalizeProductHtml(value: unknown): string {
  const html = String(value ?? '');
  return normalizeHtmlContent(html).replace(/(\s(?:src|href)\s*=\s*["'])(https?:\/\/(?:www\.)?cic\.com\.vn\/images\/[^"']+)(["'])/gi, (_match, prefix, url, suffix) => `${prefix}${normalizeProductMediaUrl(url)}${suffix}`);
}

export function extractProductVideoUrl(value: unknown): string | undefined {
  const raw = String(value ?? '').trim();
  if (!raw) return undefined;
  const source = raw.match(/<iframe\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/i)?.[1] ?? raw;
  const decoded = source.replace(/&amp;/g, '&').replace(/https\\:\/?/i, 'https://').trim();
  if (!/^https?:\/\//i.test(decoded)) return undefined;
  return decoded;
}
