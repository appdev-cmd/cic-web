import React, { useState } from 'react';
import { X, Monitor, Tablet, Smartphone, Globe } from 'lucide-react';
import { ServiceItem } from './types';

interface ServicePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceItem | null;
}

export const ServicePreviewModal: React.FC<ServicePreviewModalProps> = ({
  isOpen,
  onClose,
  service,
}) => {
  if (!isOpen || !service) return null;

  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeLocale, setActiveLocale] = useState<'vi' | 'en'>('vi');

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/80 backdrop-blur-xs flex flex-col">
      {/* Top Controls Bar */}
      <div className="h-14 px-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <span className="font-bold text-xs bg-orange-600 px-2.5 py-1 rounded-md text-white">
            PREVIEW LIVE
          </span>
          <span className="text-xs text-slate-300 font-mono truncate max-w-sm">
            https://cic.com.vn/dich-vu/{service.slug}?lang={activeLocale}
          </span>
        </div>

        {/* Viewport controls */}
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setDevice('desktop')}
            className={`p-1.5 rounded-md text-xs flex items-center gap-1 transition-colors ${
              device === 'desktop' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Desktop View"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDevice('tablet')}
            className={`p-1.5 rounded-md text-xs flex items-center gap-1 transition-colors ${
              device === 'tablet' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Tablet View"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDevice('mobile')}
            className={`p-1.5 rounded-md text-xs flex items-center gap-1 transition-colors ${
              device === 'mobile' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Mobile View"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Locale & Close */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs">
            <Globe className="w-4 h-4 text-slate-400" />
            <button
              onClick={() => setActiveLocale('vi')}
              className={`px-2 py-0.5 rounded text-xs font-semibold ${
                activeLocale === 'vi' ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              VI
            </button>
            <button
              onClick={() => setActiveLocale('en')}
              className={`px-2 py-0.5 rounded text-xs font-semibold ${
                activeLocale === 'en' ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Container Simulation */}
      <div className="flex-1 bg-slate-950 overflow-auto p-6 flex justify-center items-start">
        <div
          className={`bg-white text-slate-900 shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 ${
            device === 'desktop'
              ? 'w-full max-w-5xl my-4 min-h-[700px]'
              : device === 'tablet'
              ? 'w-[768px] my-4 min-h-[700px]'
              : 'w-[375px] my-4 min-h-[667px]'
          }`}
        >
          {/* Header Banner */}
          <div className="relative h-64 w-full bg-slate-900 overflow-hidden">
            <img
              src={service.thumbnail_url}
              alt={service.title}
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent flex items-end p-8">
              <div className="space-y-2 text-white max-w-2xl">
                <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500 text-white">
                  Dịch vụ CIC
                </span>
                <h1 className="text-xl md:text-2xl font-bold leading-tight">
                  {service.title}
                </h1>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-8 space-y-8">
            {/* Short summary card */}
            <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl text-slate-800 text-sm leading-relaxed font-medium">
              {service.summary}
            </div>

            {/* Main description */}
            <div className="prose prose-slate max-w-none text-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b pb-2">
                Chi tiết dịch vụ
              </h3>
              <div dangerouslySetInnerHTML={{ __html: service.description }} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
