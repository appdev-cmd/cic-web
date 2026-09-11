import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence } from 'motion/react';
import { getEventsData } from '../features/events/eventsData';
import type { EventItem } from '@shared/types';
import { EventListView } from '../features/events/components/list/EventListView';
import { EventDetailView } from '../features/events/components/detail/EventDetailView';
import { EventRegistrationView } from '../features/events/components/registration/EventRegistrationView';

export interface EventsViewProps {
  key?: string | number;
  initialEventId?: string | null;
  initialIsRegistering?: boolean;
  onNavigateHome?: () => void;
  onNavigateToService?: (serviceId: string) => void;
  onNavigateToProduct?: (productId: string) => void;
  onOpenConsultation?: () => void;
  previewEvent?: EventItem;
}

export const EventsView: React.FC<EventsViewProps> = ({
  initialEventId,
  initialIsRegistering,
  onNavigateToProduct,
  onOpenConsultation,
  previewEvent,
}) => {
  const { events: sourceEvents, relatedProducts: productsData } = useMemo(getEventsData, []);
  const eventsData = useMemo(
    () =>
      previewEvent
        ? [previewEvent, ...sourceEvents.filter((item) => item.id !== previewEvent.id)]
        : sourceEvents,
    [previewEvent, sourceEvents]
  );

  // Navigation & views state
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [registerEvent, setRegisterEvent] = useState<EventItem | null>(null);

  // Countdown timer for hero & detail view
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Handle initial event selection / registration view routing
  useEffect(() => {
    if (initialEventId) {
      const found = eventsData.find((e) => e.id === initialEventId);
      if (found) {
        if (initialIsRegistering) {
          setRegisterEvent(found);
          setSelectedEvent(found);
        } else {
          setSelectedEvent(found);
        }
      }
    }
  }, [initialEventId, initialIsRegistering, eventsData]);

  // Hero Event: Ưu tiên sự kiện sắp diễn ra (upcoming/ongoing) và mới nhất
  const heroEvent = useMemo(() => {
    if (eventsData.length === 0) return null;
    const activeEvents = eventsData.filter((e) => e.status === 'upcoming' || e.status === 'ongoing');
    if (activeEvents.length > 0) {
      const featuredActive = activeEvents.find((e) => e.isFeatured);
      return featuredActive || activeEvents[0];
    }
    const featuredPast = eventsData.find((e) => e.isFeatured);
    return featuredPast || eventsData[0];
  }, [eventsData]);

  // Countdown timer effect
  useEffect(() => {
    const targetEvent = selectedEvent || heroEvent;
    if (!targetEvent || !targetEvent.startDate) return;

    const calculateTimeLeft = () => {
      const targetTime = new Date(targetEvent.startDate).getTime();
      if (isNaN(targetTime)) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const difference = Math.max(0, targetTime - Date.now());
      let left = { days: 0, hours: 0, minutes: 0, seconds: 0 };

      if (difference > 0) {
        left = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      setTimeLeft(left);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [selectedEvent, heroEvent]);

  return (
    <div className="pt-24 pb-20 relative min-h-screen bg-[#F5F6F8] text-slate-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AnimatePresence mode="wait">
          {registerEvent ? (
            <EventRegistrationView
              event={registerEvent}
              fromDetail={Boolean(selectedEvent)}
              onCancel={() => {
                setRegisterEvent(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ) : selectedEvent ? (
            <EventDetailView
              event={selectedEvent}
              eventsData={eventsData}
              productsData={productsData}
              timeLeft={timeLeft}
              onBack={() => {
                setSelectedEvent(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSelectEvent={(evt) => {
                setSelectedEvent(evt);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenRegistration={(evt) => {
                setRegisterEvent(evt);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNavigateToProduct={onNavigateToProduct}
            />
          ) : (
            <EventListView
              eventsData={eventsData}
              heroEvent={heroEvent}
              timeLeft={timeLeft}
              onSelectEvent={(evt) => {
                setSelectedEvent(evt);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenRegistration={(evt) => {
                setRegisterEvent(evt);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenConsultation={onOpenConsultation}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
