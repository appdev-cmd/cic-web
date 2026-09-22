import { getPublicSystemSettings } from '@/features/system-settings/server/queries';
import { CANONICAL_SITE_URL } from '@/lib/seo/siteUrl';
import { JsonLdScript } from '@/lib/seo/jsonLd';

function publicUrl(value?: string): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return `${CANONICAL_SITE_URL}${trimmed}`;
  try {
    const url = new URL(trimmed);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : undefined;
  } catch {
    return undefined;
  }
}

export async function OrganizationJsonLd() {
  const settings = await getPublicSystemSettings('vi');
  const values = settings.values;
  const headOffice = settings.branches.find((branch) => branch.isHeadOffice);
  const name = values.legal_name?.trim() || values.site_name?.trim();
  if (!name) return null;

  const sameAs = ['facebook', 'youtube', 'linkedin_url', 'twitter', 'zalo_url']
    .map((key) => publicUrl(values[key]))
    .filter((url): url is string => Boolean(url));
  const email = headOffice?.email?.trim() || values.public_email?.trim();
  const telephone = headOffice?.phone?.trim() || values.tel?.trim();
  const address = headOffice?.address?.trim() || values.address?.trim();
  const logo = publicUrl(values.logo);

  const organization = {
    '@type': 'Organization',
    '@id': `${CANONICAL_SITE_URL}/#organization`,
    name,
    url: CANONICAL_SITE_URL,
    ...(logo ? { logo: { '@type': 'ImageObject', url: logo } } : {}),
    ...(email || telephone ? { contactPoint: [{
      '@type': 'ContactPoint',
      contactType: 'customer service',
      ...(email ? { email } : {}),
      ...(telephone ? { telephone } : {}),
    }] } : {}),
    ...(address ? { address: { '@type': 'PostalAddress', streetAddress: address, addressCountry: 'VN' } } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };

  return <JsonLdScript id="organization-schema" data={{
    '@context': 'https://schema.org',
    '@graph': [
      organization,
      {
        '@type': 'WebSite',
        '@id': `${CANONICAL_SITE_URL}/#website`,
        url: CANONICAL_SITE_URL,
        name: values.site_name?.trim() || name,
        publisher: { '@id': `${CANONICAL_SITE_URL}/#organization` },
        potentialAction: {
          '@type': 'SearchAction',
          target: { '@type': 'EntryPoint', urlTemplate: `${CANONICAL_SITE_URL}/search?q={search_term_string}` },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  }} />;
}
