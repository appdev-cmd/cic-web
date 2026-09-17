import type { MetadataRoute } from 'next';
import { getPublicSitemapUrls } from '@/features/function-seo/server/queries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cic.com.vn';
  const entries = await getPublicSitemapUrls(baseUrl);

  return entries.map((entry) => ({
    url: entry.url,
    lastModified: entry.lastModified,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
