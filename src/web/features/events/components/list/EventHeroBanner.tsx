import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import type { EventItem } from '@shared/types';
import { EventCountdownTimer } from '../shared/EventCountdownTimer';

interface EventHeroBannerProps {
  heroEvent: EventItem;
  timeLeft: { days: number; hours: number; minutes: number; seconds: number };
  onSelectEvent: (event: EventItem) => void;
  onOpenRegistration: (event: EventItem) => void;
}

export const EventHeroBanner: React.FC<EventHeroBannerProps> = ({
  heroEvent,
  timeLeft,
  onSelectEvent,
  onOpenRegistration,
}) => {
  return (
    <section className="relative bg-white border border-slate-200/80 rounded-[12px] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden mb-8 group">
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[360px] lg:min-h-[400px]">
        {/* Left: Image Hero Banner (65-70% width) */}
        <div
          onClick={() => onSelectEvent(heroEvent)}
          className="lg:col-span-8 relative bg-slate-900 min-h-[260px] sm:min-h-[320px] lg:min-h-[400px] overflow-hidden cursor-pointer flex items-center justify-center select-none"
        >
          <img
            src={heroEvent.img}
            alt={heroEvent.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />

          {/* Overlay gradient for contrast on mobile/tablet */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent lg:hidden pointer-events-none" />
        </div>

        {/* Right: Content Details & Action (30-35% width) */}
        <div className="lg:col-span-4 p-6 sm:p-7 lg:p-8 bg-slate-50/70 border-t lg:border-t-0 lg:border-l border-slate-100 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            {/* Status Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              {heroEvent.status === 'upcoming' ? (
                <span className="inline-block px-2.5 py-0.5 bg-orange-600 text-white text-[10px] font-black uppercase tracking-wider rounded-[4px] shadow-xs">
                  SẮP DIỄN RA
                </span>
              ) : heroEvent.status === 'ongoing' ? (
                <span className="inline-block px-2.5 py-0.5 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider rounded-[4px] shadow-xs">
                  ĐANG DIỄN RA
                </span>
              ) : heroEvent.isFeatured ? (
                <span className="inline-block px-2.5 py-0.5 bg-orange-600 text-white text-[10px] font-black uppercase tracking-wider rounded-[4px] shadow-xs">
                  NỔI BẬT
                </span>
              ) : (
                <span className="inline-block px-2.5 py-0.5 bg-slate-700 text-white text-[10px] font-black uppercase tracking-wider rounded-[4px] shadow-xs">
                  ĐÃ KẾT THÚC
                </span>
              )}

              {heroEvent.isOpenRegistration && (
                <span className="inline-block px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider rounded-[4px] shadow-xs">
                  MỞ ĐĂNG KÝ
                </span>
              )}
            </div>

            {/* Event Title */}
            <h2
              onClick={() => onSelectEvent(heroEvent)}
              className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 leading-snug tracking-tight hover:text-orange-600 cursor-pointer transition-colors line-clamp-3"
              title={heroEvent.title}
            >
              {heroEvent.title}
            </h2>

            {/* Date & Time */}
            <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-700">
              <Calendar size={18} className="text-orange-600 shrink-0" />
              <span>{heroEvent.date}</span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-700">
              <MapPin size={18} className="text-orange-600 shrink-0" />
              <span className="line-clamp-1">{heroEvent.location}</span>
            </div>

            {/* Countdown Widget Mini if Upcoming */}
            {heroEvent.status === 'upcoming' && (
              <EventCountdownTimer
                days={timeLeft.days}
                hours={timeLeft.hours}
                minutes={timeLeft.minutes}
                seconds={timeLeft.seconds}
                variant="hero"
              />
            )}
          </div>

          {/* CTA Button */}
          <div className="pt-2">
            {heroEvent.isOpenRegistration ? (
              <button
                type="button"
                onClick={() => onOpenRegistration(heroEvent)}
                className="w-full py-3.5 px-6 bg-orange-600 hover:bg-orange-500 text-white font-black text-sm uppercase tracking-wider rounded-full shadow-md shadow-orange-600/25 hover:shadow-lg hover:shadow-orange-600/35 transition-all text-center flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                ĐĂNG KÝ NGAY
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onSelectEvent(heroEvent)}
                className="w-full py-3.5 px-6 bg-orange-600 hover:bg-orange-500 text-white font-black text-sm uppercase tracking-wider rounded-full shadow-md shadow-orange-600/25 hover:shadow-lg hover:shadow-orange-600/35 transition-all text-center flex items-center justify-center cursor-pointer active:scale-95"
              >
                XEM CHI TIẾT
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
