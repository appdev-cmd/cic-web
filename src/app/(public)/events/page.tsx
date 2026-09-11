import { getPublishedEventProducts, listPublishedEvents } from '@/features/events/server/queries';
import { EventsRuntimeView } from '@/web/features/events/EventsRuntimeView';

export const dynamic = 'force-dynamic';

export default async function EventsPage() {
  const events = await listPublishedEvents('vi');
  const relatedProductIds = [
    ...new Set(
      events.flatMap((item) =>
        item.productsRelated.map(Number).filter((n) => Number.isFinite(n) && n > 0)
      )
    ),
  ];
  const products = await getPublishedEventProducts('vi', relatedProductIds);

  return <EventsRuntimeView events={events} products={products} />;
}
