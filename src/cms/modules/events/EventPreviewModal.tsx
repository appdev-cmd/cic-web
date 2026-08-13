import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  Calendar,
  MapPin,
  Clock,
  User,
  CheckCircle,
  Tag,
  Share2,
  Sparkles,
  Monitor,
  Tablet,
  Smartphone,
  Globe,
} from 'lucide-react';
import { EventItem, EditorialStatus } from './types';

interface EventPreviewModalProps {
  isOpen: boolean;
  event: EventItem | null;
  onClose: () => void;
}

export const EventPreviewModal: React.FC<EventPreviewModalProps> = ({
  isOpen,
  event,
  onClose,
}) => {
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  if (!isOpen || !event) return null;


  // Helper for status badge styling
  const getEditorialBadge = (status: EditorialStatus) => {
    switch (status) {
      case 'published':
        return <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs rounded-lg border border-emerald-500/20">Đã xuất bản</span>;
      default:
        return <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold text-xs rounded-lg">Bản nháp</span>;
    }
  };

  const eventHasStarted = new Date(event.time_event).getTime() <= Date.now();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 text-orange-600 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Xem trước giao diện Sự kiện / Webinar</span>
                {getEditorialBadge(event.editorial_status || (event.published ? 'published' : 'draft'))}
                <span className="px-2.5 py-1 bg-orange-600 text-white font-bold text-xs rounded-lg">{eventHasStarted ? 'Đã diễn ra' : 'Sắp diễn ra'}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                /su-kien/{event.alias}
              </p>
            </div>
          </div>

          {/* Device Responsive Mode Toggles */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center p-1 bg-slate-200 dark:bg-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => setDeviceView('desktop')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  deviceView === 'desktop'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
                title="Xem giao diện Desktop"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setDeviceView('tablet')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  deviceView === 'tablet'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
                title="Xem giao diện Tablet"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setDeviceView('mobile')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  deviceView === 'mobile'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
                title="Xem giao diện Mobile"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Content Container with Device Width Scaling */}
        <div className="flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-950 p-4 sm:p-6 flex justify-center">
          <div
            className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transition-all duration-300 ${
              deviceView === 'mobile'
                ? 'w-[375px]'
                : deviceView === 'tablet'
                ? 'w-[768px]'
                : 'w-full max-w-4xl'
            }`}
          >
            {/* Hero Event Banner */}
            <div className="relative aspect-video sm:aspect-[21/9] w-full overflow-hidden bg-slate-800">
              <img
                src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200'}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 bg-orange-600 text-white font-bold text-xs rounded-full">
                    Sự kiện CIC
                  </span>
                  {event.is_hot && (
                    <span className="px-3 py-1 bg-amber-500 text-slate-950 font-bold text-xs rounded-full">
                      Hot Event
                    </span>
                  )}
                </div>
                <h1 className="text-lg sm:text-2xl font-black leading-tight">
                  {event.title}
                </h1>
              </div>
            </div>

            {/* Content Details Grid */}
            <div className="p-5 sm:p-8 space-y-6 text-slate-800 dark:text-slate-200">
              {/* Event Time & Location Summary Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/20 rounded-2xl">
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <Calendar className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Thời gian diễn ra:</p>
                      <p>{event.specific_time || event.time_event}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Địa điểm tổ chức:</p>
                      <p>{event.place || 'Trực tuyến'}</p>
                    </div>
                  </div>

                  {event.link_dangky && (
                    <div className="pt-1">
                      <a
                        href={event.link_dangky}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                      >
                        <span>Đăng ký tham dự ngay</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              </div>


              {/* Event Summary / Lead */}
              {event.summary && (
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-l-4 border-orange-600 rounded-r-xl text-sm italic font-medium text-slate-700 dark:text-slate-300">
                  {event.summary}
                </div>
              )}

              {/* Detailed Rich HTML Content */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Nội dung chương trình chi tiết
                </h3>
                <div
                  className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: event.content || '<p>Chưa có nội dung chi tiết.</p>' }}
                />
              </div>

              {/* SERP SEO Info Footer */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <h4 className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
                  Thông tin SEO & Metadata
                </h4>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-[11px] space-y-1">
                  <p><span className="text-slate-400">SEO Title:</span> {event.seo_title || event.title}</p>
                  <p><span className="text-slate-400">Keywords:</span> {event.seo_keyword || 'N/A'}</p>
                  <p><span className="text-slate-400">Description:</span> {event.seo_description || event.summary}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
