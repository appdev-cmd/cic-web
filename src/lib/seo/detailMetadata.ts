import type { Metadata } from 'next';
import { buildCanonicalUrl, cleanSeoTitle } from './siteUrl';

const DEFAULT_SOCIAL_IMAGE = {
  url: buildCanonicalUrl('/banner_hero/doi_tac_cong_nghe_chien_luoc.png'),
  width: 1690,
  height: 931,
  alt: 'CIC Technology',
};

function plainText(value?: string | null): string | undefined {
  const result = value?.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return result || undefined;
}

export function detailMetadata(title: string, description: string | null | undefined, path: string): Metadata {
  const cleanedTitle = cleanSeoTitle(title);
  const cleanedDescription = plainText(description);
  const url = buildCanonicalUrl(path);
  return {
    title: cleanedTitle,
    description: cleanedDescription,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title: cleanedTitle,
      description: cleanedDescription,
      images: [DEFAULT_SOCIAL_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: cleanedTitle,
      description: cleanedDescription,
      images: [DEFAULT_SOCIAL_IMAGE.url],
    },
  };
}
