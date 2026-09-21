import { CANONICAL_SITE_URL } from '@/lib/seo/siteUrl';
import { JsonLdScript } from '@/lib/seo/jsonLd';

export interface BreadcrumbItem {
  name: string;
  url?: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const itemListElement = items.map((item, index) => {
    const fullUrl = item.url
      ? item.url.startsWith('http')
        ? item.url
        : `${CANONICAL_SITE_URL}${item.url.startsWith('/') ? item.url : `/${item.url}`}`
      : undefined;

    return {
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(fullUrl ? { item: fullUrl } : {}),
    };
  });

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  };

  return <JsonLdScript data={schema} />;
}
