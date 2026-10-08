import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getPublishedEventBySlug,
  getPublishedEventProducts,
  listPublishedEvents,
} from '@/features/events/server/queries';
import { EventsRuntimeView } from '@/web/features/events/EventsRuntimeView';
import { BreadcrumbJsonLd, EventJsonLd } from '@/features/seo/components';
import { detailMetadata } from '@/lib/seo/detailMetadata';
import { cleanSeoTitle } from '@/lib/seo/siteUrl';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  let event = await getPublishedEventBySlug(slug, 'en');
  if (!event) {
    event = await getPublishedEventBySlug(slug, 'vi');
  }
  if (!event) return {};

  return {
    ...detailMetadata(cleanSeoTitle(event.seoTitle || event.title), event.seoDescription || event.summary, `/en/events/${slug}`),
    keywords: event.seoKeyword || undefined,
  };
}

export default async function EnEventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let event = await getPublishedEventBySlug(slug, 'en');
  let isFallback = false;
  if (!event) {
    event = await getPublishedEventBySlug(slug, 'vi');
    isFallback = true;
  }
  if (!event) notFound();

  let allEvents = await listPublishedEvents(isFallback ? 'vi' : 'en');
  if (allEvents.length === 0) {
    allEvents = await listPublishedEvents('vi');
  }

  const relatedProductIds = [
    ...new Set(
      [event, ...allEvents].flatMap((item) =>
        item.productsRelated.map(Number).filter((n) => Number.isFinite(n) && n > 0)
      )
    ),
  ];

  let products = await getPublishedEventProducts(isFallback ? 'vi' : 'en', relatedProductIds);
  if (products.length === 0 && relatedProductIds.length > 0) {
    products = await getPublishedEventProducts('vi', relatedProductIds);
  }

  return (
    <>
      <EventJsonLd
        name={event.title}
        description={event.summary || event.chuDe}
        startDate={event.timeEvent}
        endDate={event.endTime}
        place={event.place}
        image={event.image}
        url={`/en/events/${slug}`}
        registrationUrl={event.linkDangky}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/en' },
          { name: 'Events', url: '/en/events' },
          { name: event.title },
        ]}
      />
      <EventsRuntimeView
        events={allEvents}
        products={products}
        initialEventId={event.id}
      />
    </>
  );
}
