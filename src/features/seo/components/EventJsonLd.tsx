import { CANONICAL_SITE_URL } from '@/lib/seo/siteUrl';
import { JsonLdScript } from '@/lib/seo/jsonLd';

export interface EventJsonLdProps {
  name: string;
  description?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  place?: string | null;
  image?: string | null;
  url?: string;
  registrationUrl?: string | null;
}

function toIsoDate(value?: string | null): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export function EventJsonLd({
  name,
  description,
  startDate,
  endDate,
  place,
  image,
  url,
  registrationUrl,
}: EventJsonLdProps) {
  const startIso = toIsoDate(startDate);
  if (!startIso) return null; // Schema.org Event requires a valid startDate

  const endIso = toIsoDate(endDate);

  const imageUrl = image
    ? image.startsWith('http')
      ? image
      : `${CANONICAL_SITE_URL}${image.startsWith('/') ? image : `/${image}`}`
    : undefined;

  const eventUrl = url
    ? url.startsWith('http')
      ? url
      : `${CANONICAL_SITE_URL}${url.startsWith('/') ? url : `/${url}`}`
    : undefined;

  const isOnline = place ? /online|trực tuyến|webinar|zoom|teams/i.test(place) : false;

  const location = isOnline
    ? {
        '@type': 'VirtualLocation',
        url: registrationUrl || eventUrl || CANONICAL_SITE_URL,
      }
    : {
        '@type': 'Place',
        name: place?.trim() || 'Hà Nội, Việt Nam',
        address: {
          '@type': 'PostalAddress',
          addressLocality: place?.trim() || 'Hà Nội',
          addressCountry: 'VN',
        },
      };

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name,
    description: description?.trim() || name,
    startDate: startIso,
    ...(endIso ? { endDate: endIso } : {}),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: isOnline
      ? 'https://schema.org/OnlineEventAttendanceMode'
      : 'https://schema.org/OfflineEventAttendanceMode',
    location,
    ...(imageUrl ? { image: [imageUrl] } : {}),
    ...(eventUrl ? { url: eventUrl } : {}),
    organizer: { '@id': `${CANONICAL_SITE_URL}/#organization` },
    ...(registrationUrl?.trim()
      ? {
          offers: {
            '@type': 'Offer',
            url: registrationUrl.trim(),
            availability: 'https://schema.org/InStock',
            price: '0',
            priceCurrency: 'VND',
          },
        }
      : {}),
  };

  return <JsonLdScript data={schema} />;
}
