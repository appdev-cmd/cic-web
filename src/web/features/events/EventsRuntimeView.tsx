'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { EventItem, Product } from '@/shared/types';
import type { EventItemViewModel } from '@/features/events/types';
import { EventsView } from '@/web/components/EventsView';
import { setRuntimeEventsData } from './eventsData';

function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return dateStr;
  }
}

export function mapViewModelToPublicEvent(e: EventItemViewModel): EventItem {
  return {
    id: e.id,
    title: e.title,
    shortDesc: e.summary,
    longDesc: e.content,
    img: e.image,
    date: formatDisplayDate(e.timeEvent),
    startDate: e.timeEvent,
    endDate: e.endTime || undefined,
    location: e.place || 'Trực tuyến / Trụ sở CIC',
    address: e.place || '',
    eventType: e.chuDe || 'Hội thảo',
    isFeatured: e.isHot,
    status: e.status,
    isOpenRegistration: e.isOpenRegistration,
    targetAudience: e.tags,
    media: {
      gallery: e.image ? [e.image] : [],
      videoUrl: '',
    },
    documents: [],
  };
}

interface EventsRuntimeViewProps {
  events: EventItemViewModel[];
  products: Product[];
  initialEventId?: string | null;
}

export function EventsRuntimeView({
  events,
  products,
  initialEventId,
}: EventsRuntimeViewProps) {
  const router = useRouter();

  const mappedEvents = useMemo(
    () => events.map(mapViewModelToPublicEvent),
    [events]
  );

  // Synchronously seed the runtime data store before EventsView renders
  useMemo(() => {
    setRuntimeEventsData({
      events: mappedEvents,
      relatedProducts: products,
    });
  }, [mappedEvents, products]);

  return (
    <EventsView
      key={`events-runtime-${initialEventId ?? 'list'}-${mappedEvents.length}`}
      initialEventId={initialEventId ?? null}
      onNavigateHome={() => router.push('/')}
      onNavigateToProduct={(productId) => router.push(`/products/${productId}`)}
      onNavigateToService={(serviceId) => router.push(`/services/${serviceId}`)}
    />
  );
}
