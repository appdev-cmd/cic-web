/** Canonical URL segment for newly saved Event aliases and the one-time legacy cleanup. */
export function normalizeEventSlug(value: string): string {
  return value.trim().toLowerCase()
    .replace(/đ/g, 'd')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}
