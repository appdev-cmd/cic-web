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

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline,
    description: description || headline,
    ...(imageUrl ? { image: [imageUrl] } : {}),
    ...(datePublished ? { datePublished } : {}),
    dateModified: dateModified || datePublished || new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: authorName || 'Ban Biên Tập CIC',
    },
    publisher: {
      '@type': 'Organization',
      name: 'CIC Technology',
      url: CANONICAL_SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${CANONICAL_SITE_URL}/banner_hero/doi_tac_cong_nghe_chien_luoc.png`,
      },
    },
    ...(articleUrl ? { mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl } } : {}),
  };

  return <JsonLdScript data={schema} />;
}
