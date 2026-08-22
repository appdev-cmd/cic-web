import React, { useState } from 'react';
import { Monitor, Smartphone, Tablet, X } from 'lucide-react';
import type { EventItem as PublicEventItem } from '@shared/types';
import { EventsView } from '../../../web/components/EventsView';
import { PublicSitePreviewFooter, PublicSitePreviewHeader } from '../../components/PublicSitePreviewChrome';
import { ResponsiveWebsitePreviewFrame } from '../../components/ResponsiveWebsitePreviewFrame';
import type { EventItem } from './types';

interface Props { isOpen: boolean; event: EventItem | null; onClose: () => void }

export const EventPreviewModal: React.FC<Props> = ({ isOpen, event, onClose }) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  if (!isOpen || !event) return null;
  const now = Date.now();
  const start = new Date(event.time_event).getTime();
  const end = new Date(event.end_time).getTime();
  const status: PublicEventItem['status'] = now < start ? 'upcoming' : Number.isFinite(end) && now < end ? 'ongoing' : 'past';
  const previewEvent: PublicEventItem = {
    id: `cms-preview-${event.id}`, title: event.title, shortDesc: event.summary, longDesc: event.content,
    img: event.image, date: new Date(event.time_event).toLocaleDateString('vi-VN'), startDate: event.time_event,
    endDate: event.end_time, location: event.place, address: event.place, eventType: event.chu_de || 'Sự kiện CIC',
    isFeatured: event.is_hot, status, isOpenRegistration: Boolean(event.link_dangky) && status !== 'past', media: { gallery: event.image ? [event.image] : [] }, documents: [],
  };
  return (
    <div className="fixed inset-0 z-[90] flex flex-col bg-slate-950/85" role="dialog" aria-modal="true" aria-label="Xem trước sự kiện">
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-700 bg-slate-900 px-5 text-white">
        <div><p className="text-xs font-bold">Xem trước trên Website</p><p className="text-[10px] text-slate-400">/su-kien/{event.alias}</p></div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg bg-slate-800 p-1">{([['desktop', Monitor], ['tablet', Tablet], ['mobile', Smartphone]] as const).map(([value, Icon]) => <button key={value} type="button" onClick={() => setDevice(value)} className={`rounded-md p-1.5 ${device === value ? 'bg-orange-600' : 'text-slate-400'}`} aria-label={`Xem ${value}`}><Icon className="size-4" /></button>)}</div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 hover:bg-slate-800" aria-label="Đóng xem trước"><X className="size-5" /></button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto overscroll-contain bg-slate-800 p-5">
        <ResponsiveWebsitePreviewFrame device={device}>
          <PublicSitePreviewHeader view="events" />
          <EventsView initialEventId={previewEvent.id} previewEvent={previewEvent} />
          <PublicSitePreviewFooter />
        </ResponsiveWebsitePreviewFrame>
      </div>
    </div>
  );
};
