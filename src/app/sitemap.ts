import type { MetadataRoute } from 'next';
import { getPublicSitemapUrls } from '@/features/function-seo/server/queries';

import { CANONICAL_SITE_URL } from '@/lib/seo/siteUrl';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await getPublicSitemapUrls(CANONICAL_SITE_URL);

  return entries.map((entry) => ({
    url: entry.url,
    lastModified: entry.lastModified,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
