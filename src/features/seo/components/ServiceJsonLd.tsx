import { JsonLdScript } from '@/lib/seo/jsonLd';
import { buildCanonicalUrl } from '@/lib/seo/siteUrl';

interface ServiceJsonLdProps {
  name: string;
  description?: string | null;
  image?: string | null;
  url: string;
}

export function ServiceJsonLd({ name, description, image, url }: ServiceJsonLdProps) {
  const imageUrl = image
    ? /^https?:\/\//i.test(image) ? image : buildCanonicalUrl(image)
    : undefined;

  return <JsonLdScript data={{
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    url: buildCanonicalUrl(url),
    provider: { '@id': `${buildCanonicalUrl()}/#organization` },
    ...(description?.trim() ? { description: description.trim() } : {}),
    ...(imageUrl ? { image: imageUrl } : {}),
  }} />;
}
