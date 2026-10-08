import { CANONICAL_SITE_URL } from '@/lib/seo/siteUrl';
import { JsonLdScript } from '@/lib/seo/jsonLd';

export interface ProductJsonLdProps {
  name: string;
  description?: string | null;
  image?: string | null;
  sku?: string | null;
  brand?: string | null;
  url?: string;
  price?: string | number | null;
}

export function ProductJsonLd({ name, description, image, sku, brand, url, price }: ProductJsonLdProps) {
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

  // Only emit an Offer if there is an actual positive numeric price in the database.
  // Never emit fake prices (e.g., "0", "Liên hệ") in accordance with Google Search guidelines.
  const numericPrice = typeof price === 'number'
    ? price
    : typeof price === 'string'
    ? Number(price.replace(/[^0-9]/g, ''))
    : NaN;

  const offers = Number.isFinite(numericPrice) && numericPrice > 0
    ? {
        '@type': 'Offer',
        price: String(numericPrice),
        priceCurrency: 'VND',
        availability: 'https://schema.org/InStock',
        ...(productUrl ? { url: productUrl } : {}),
      }
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
    ...(offers ? { offers } : {}),
  };

  return <JsonLdScript data={schema} />;
}
