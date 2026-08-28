export const FEATURED_CONTENT_LIMITS = {
  news: 4,
  event: 1,
  project: 3,
  product: 6,
} as const;

export type FeaturedContentType = keyof typeof FEATURED_CONTENT_LIMITS;
