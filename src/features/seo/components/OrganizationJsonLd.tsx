import { CANONICAL_SITE_URL } from '@/lib/seo/siteUrl';
import { JsonLdScript } from '@/lib/seo/jsonLd';

export function OrganizationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${CANONICAL_SITE_URL}/#organization`,
        name: 'CIC Technology',
        alternateName: 'Công ty Cổ phần Công nghệ và Tư vấn CIC',
        url: CANONICAL_SITE_URL,
        logo: {
          '@type': 'ImageObject',
          url: `${CANONICAL_SITE_URL}/banner_hero/doi_tac_cong_nghe_chien_luoc.png`,
          caption: 'CIC Technology',
        },
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: '+84-24-3974-1373',
            contactType: 'customer service',
            areaServed: 'VN',
            availableLanguage: ['Vietnamese', 'English'],
          },
        ],
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Số 37 Lê Đại Hành, Hai Bà Trưng',
          addressLocality: 'Hà Nội',
          addressCountry: 'VN',
        },
        sameAs: [
          'https://www.facebook.com/cicthegioiphanmem',
          'https://www.youtube.com/@cictube',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${CANONICAL_SITE_URL}/#website`,
        url: CANONICAL_SITE_URL,
        name: 'CIC Technology',
        publisher: {
          '@id': `${CANONICAL_SITE_URL}/#organization`,
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${CANONICAL_SITE_URL}/search?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };

  return <JsonLdScript id="organization-schema" data={schema} />;
}
