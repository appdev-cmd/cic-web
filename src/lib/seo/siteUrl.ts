export const CANONICAL_SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.cic.com.vn'
).replace(/\/+$/, '');

export function buildCanonicalUrl(path: string = ''): string {
  if (!path || path === '/') return CANONICAL_SITE_URL;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${CANONICAL_SITE_URL}${normalizedPath}`;
}

/**
 * Strips legacy hardcoded brand suffixes (e.g., "| CIC", "| CIC Technology", "| CIC Consulting")
 * from database titles so the Next.js layout metadata template can append the canonical suffix cleanly without duplication.
 */
export function cleanSeoTitle(title?: string | null): string {
  if (!title) return '';
  let result = title.trim();
  let previous: string;
  do {
    previous = result;
    result = result.replace(/\s*\|\s*CIC(?:\s+(?:Technology|Consulting)(?:\s+Consulting)?)?\s*$/i, '').trim();
  } while (result && result !== previous);
  return result || title.trim();
}
