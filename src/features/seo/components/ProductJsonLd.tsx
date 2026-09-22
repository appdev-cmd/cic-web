import { CANONICAL_SITE_URL } from '@/lib/seo/siteUrl';
import { JsonLdScript } from '@/lib/seo/jsonLd';

export interface ProductJsonLdProps {
  name: string;
  description?: string | null;
  image?: string | null;
  sku?: string | null;
  brand?: string | null;
  url?: string;
}

export function ProductJsonLd({ name, description, image, sku, brand, url }: ProductJsonLdProps) {
  const imageUrl = image
    ? image.startsWith('http')
      ? image
      : `${CANONICAL_SITE_URL}${image.startsWith('/') ? image : `/${image}`}`
    : undefined;

  const productUrl = url
    ? url.startsWith('http')
      ? url
      : `${CANONICAL_SITE_URL}${url.startsWith('/') ? url : `/${url}`}`
    : undefined;

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description: description || name,
    ...(imageUrl ? { image: imageUrl } : {}),
    ...(sku ? { sku } : {}),
    ...(productUrl ? { url: productUrl } : {}),
    ...(brand ? { brand: { '@type': 'Brand', name: brand } } : {}),
  };

  return <JsonLdScript data={schema} />;
}
