import React, { useState } from 'react';
import { Monitor, Smartphone, Tablet, X } from 'lucide-react';
import { ServicesView } from '../../../web/components/ServicesView';
import type { ServiceDetail } from '../../../web/features/services/types';
import { PublicSitePreviewFooter, PublicSitePreviewHeader } from '../../components/PublicSitePreviewChrome';
import { ResponsiveWebsitePreviewFrame } from '../../components/ResponsiveWebsitePreviewFrame';
import type { ServiceItem } from './types';

interface Props { isOpen: boolean; onClose: () => void; service: ServiceItem | null }

export const ServicePreviewModal: React.FC<Props> = ({ isOpen, onClose, service }) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  if (!isOpen || !service) return null;
  const previewService: ServiceDetail = { id: `cms-preview-${service.id}`, title: service.title, tagline: service.summary, shortDesc: service.summary, category: 'Dịch vụ CIC', image: service.thumbnail_url, htmlContent: service.description };
  return (
    <div className="fixed inset-0 z-[90] flex flex-col bg-slate-950/85" role="dialog" aria-modal="true" aria-label="Xem trước dịch vụ">
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-700 bg-slate-900 px-5 text-white">
        <div><p className="text-xs font-bold">Xem trước trên Website</p><p className="text-[10px] text-slate-400">/dich-vu/{service.slug}</p></div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg bg-slate-800 p-1">{([['desktop', Monitor], ['tablet', Tablet], ['mobile', Smartphone]] as const).map(([value, Icon]) => <button key={value} type="button" onClick={() => setDevice(value)} className={`rounded-md p-1.5 ${device === value ? 'bg-orange-600' : 'text-slate-400'}`} aria-label={`Xem ${value}`}><Icon className="size-4" /></button>)}</div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 hover:bg-slate-800" aria-label="Đóng xem trước"><X className="size-5" /></button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto overscroll-contain bg-slate-800 p-5">
        <ResponsiveWebsitePreviewFrame device={device}>
          <PublicSitePreviewHeader view="services" />
          <ServicesView initialServiceId={previewService.id} previewService={previewService} onNavigateHome={() => undefined} />
          <PublicSitePreviewFooter />
        </ResponsiveWebsitePreviewFrame>
      </div>
    </div>
  );
};
