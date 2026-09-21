export const CANONICAL_SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.cic.com.vn'
).replace(/\/+$/, '');

export function buildCanonicalUrl(path: string = ''): string {
  if (!path || path === '/') return CANONICAL_SITE_URL;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${CANONICAL_SITE_URL}${normalizedPath}`;
}
