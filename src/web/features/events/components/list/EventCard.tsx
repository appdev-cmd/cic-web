import React from 'react';
import { motion } from 'motion/react';
import { Clock, MapPin } from 'lucide-react';
import type { EventItem } from '@shared/types';
import { getDaysRemaining } from '../eventUtils';

interface EventCardProps {
  event: EventItem;
  onSelect: (event: EventItem) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onSelect }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      onClick={() => {
        const sel = window.getSelection();
        if (sel && sel.toString().trim().length > 0) return;
        onSelect(event);
      }}
      className="bg-transparent border-0 p-0 shadow-none transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer group"
    >
      <div>
        {/* Thumbnail Image */}
        <div className="aspect-[16/10] bg-slate-950 rounded-[12px] overflow-hidden relative">
          <img
            src={event.img}
            alt={event.title}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.04]"
          />

          {/* Status Indicator Badge in Top-Left */}
          <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 flex-wrap">
            {event.status === 'upcoming' && (
              <span className="bg-orange-600 text-white px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-sm rounded-[6px]">
                SẮP DIỄN RA
              </span>
            )}
            {event.status === 'ongoing' && (
              <span className="bg-emerald-600 text-white px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-sm rounded-[6px]">
                ĐANG DIỄN RA
              </span>
            )}
            {event.status === 'past' && (
              <span className="bg-slate-800 text-white px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-sm rounded-[6px]">
                ĐÃ KẾT THÚC
              </span>
            )}
            {event.isFeatured && (
              <span className="bg-amber-500 text-white px-2 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-sm rounded-[6px]">
                NỔI BẬT
              </span>
            )}
          </div>

          {/* Days Remaining Pill for Upcoming */}
          {event.status === 'upcoming' && (
            <div className="absolute bottom-2.5 right-2.5 bg-slate-950/90 text-orange-400 border border-slate-800 text-[10px] font-bold px-2 py-0.5 shadow-sm rounded-[8px]">
              Còn {getDaysRemaining(event.startDate)} ngày
            </div>
          )}
        </div>

        {/* Content */}
        <div className="pt-3 pb-1 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] text-[#6B7280] font-semibold">
            <span className="flex items-center gap-1.5">
              <Clock size={12} className="text-[#FC5115] shrink-0" />
              {event.date}
            </span>
            <span className="flex items-center gap-1 truncate max-w-[120px]">
              <MapPin size={12} className="text-slate-400 shrink-0" />
              {event.location}
            </span>
          </div>

          <h3 className="text-sm font-semibold text-[#333] group-hover:text-[#FC5115] transition-colors leading-snug line-clamp-2 min-h-[2.5rem]">
            {event.title}
          </h3>

          <p className="text-sm text-[#6B7280] line-clamp-2 leading-relaxed pt-0.5">
            {event.shortDesc}
          </p>

          <div className="pt-2 flex items-center text-[11px] font-bold text-[#FC5115] group-hover:translate-x-1 transition-transform">
            <span>Xem chi tiết</span>
            <span className="ml-1">→</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
