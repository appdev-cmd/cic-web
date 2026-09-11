import { notFound } from 'next/navigation';
import {
  getPublishedEventBySlug,
  getPublishedEventProducts,
  listPublishedEvents,
} from '@/features/events/server/queries';
import { EventsRuntimeView } from '@/web/features/events/EventsRuntimeView';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getPublishedEventBySlug(slug, 'vi');
  if (!event) return {};

  return {
    title: event.seoTitle || event.title,
    description: event.seoDescription || event.summary,
    keywords: event.seoKeyword || undefined,
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getPublishedEventBySlug(slug, 'vi');
  if (!event) notFound();

  const allEvents = await listPublishedEvents('vi');
  const relatedProductIds = [
    ...new Set(
      [event, ...allEvents].flatMap((item) =>
        item.productsRelated.map(Number).filter((n) => Number.isFinite(n) && n > 0)
      )
    ),
  ];
  const products = await getPublishedEventProducts('vi', relatedProductIds);

  return (
    <EventsRuntimeView
      events={allEvents}
      products={products}
      initialEventId={event.id}
    />
  );
}
