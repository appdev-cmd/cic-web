import type { Metadata } from 'next';
import { getPublishedEventProducts, listPublishedEvents } from '@/features/events/server/queries';
import { EventsRuntimeView } from '@/web/features/events/EventsRuntimeView';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Events & Webinars | CIC Technology',
    description: 'Explore upcoming engineering seminars, BIM & Digital Twin workshops, and technology conferences organized by CIC Technology.',
    alternates: {
      canonical: '/en/events',
    },
  };
}

export default async function EnEventsPage() {
  let events = await listPublishedEvents('en');
  // Graceful fallback to VI events if EN events are empty
  if (events.length === 0) {
    events = await listPublishedEvents('vi');
  }

  const relatedProductIds = [
    ...new Set(
      events.flatMap((item) =>
        item.productsRelated.map(Number).filter((n) => Number.isFinite(n) && n > 0)
      )
    ),
  ];

  let products = await getPublishedEventProducts('en', relatedProductIds);
  if (products.length === 0 && relatedProductIds.length > 0) {
    products = await getPublishedEventProducts('vi', relatedProductIds);
  }

  return <EventsRuntimeView events={events} products={products} />;
}
