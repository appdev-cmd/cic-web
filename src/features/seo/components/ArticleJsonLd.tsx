import { CANONICAL_SITE_URL } from '@/lib/seo/siteUrl';
import { JsonLdScript } from '@/lib/seo/jsonLd';

export interface ArticleJsonLdProps {
  headline: string;
  description?: string | null;
  image?: string | null;
  datePublished?: string | null;
  dateModified?: string | null;
  authorName?: string | null;
  url?: string;
}

function toIsoDate(value?: string | null): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export function ArticleJsonLd({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  authorName,
  url,
}: ArticleJsonLdProps) {
  const imageUrl = image
    ? image.startsWith('http')
      ? image
      : `${CANONICAL_SITE_URL}${image.startsWith('/') ? image : `/${image}`}`
    : undefined;

  const articleUrl = url
    ? url.startsWith('http')
      ? url
      : `${CANONICAL_SITE_URL}${url.startsWith('/') ? url : `/${url}`}`
    : undefined;

  const publishedIso = toIsoDate(datePublished);
  const modifiedIso = toIsoDate(dateModified);
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline,
    description: description || headline,
    ...(imageUrl ? { image: [imageUrl] } : {}),
    ...(publishedIso ? { datePublished: publishedIso } : {}),
    ...(modifiedIso ? { dateModified: modifiedIso } : {}),
    ...(authorName?.trim() ? { author: { '@type': 'Person', name: authorName.trim() } } : {}),
    publisher: { '@id': `${CANONICAL_SITE_URL}/#organization` },
    ...(articleUrl ? { mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl } } : {}),
  };

  return <JsonLdScript data={schema} />;
}
