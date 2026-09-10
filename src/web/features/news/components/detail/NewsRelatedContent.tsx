'use client';

import React from 'react';
import {
  Building2,
  Calendar,
  ChevronRight,
  MapPin,
} from 'lucide-react';
import type { EventItem } from '@/shared/types';
import type { NewsRelatedProject } from '../../types';

interface NewsRelatedContentProps {
  relatedProjects: NewsRelatedProject[];
  relatedEvents: EventItem[];
  onNavigateToProject?: (projectId: string) => void;
  onNavigateToEvent?: (eventId: string) => void;
}

export function NewsRelatedContent({
  relatedProjects,
  relatedEvents,
  onNavigateToProject,
  onNavigateToEvent,
}: NewsRelatedContentProps) {
  if (relatedProjects.length === 0 && relatedEvents.length === 0) return null;

  return (
    <section className="bg-transparent border-0 p-0 shadow-none space-y-8">
      {/* 1. Related Projects Section */}
      {relatedProjects.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-bold text-slate-950 flex items-center gap-2">
            <Building2 size={18} className="text-orange-600" />
            <span>Dự án liên quan</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedProjects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => onNavigateToProject?.(proj.id)}
                className="bg-white border border-slate-200 hover:border-orange-500 rounded-[10px] p-3.5 flex items-start gap-3.5 shadow-2xs transition-all hover:shadow-md cursor-pointer group hover:-translate-y-0.5 duration-200"
              >
                <img
                  src={proj.img || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80'}
                  alt={proj.name}
                  className="w-16 h-16 rounded-[8px] object-cover border border-slate-200 shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="min-w-0 flex-1 space-y-1">
                  <span className="inline-block text-[10px] font-bold px-2 py-0.5 bg-orange-50 text-orange-600 rounded">
                    {proj.sector || 'Dự án tiêu biểu'}
                  </span>
                  <h4 className="text-xs font-bold text-slate-950 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
                    {proj.name}
                  </h4>
                  {proj.customer && (
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {proj.customer}
                    </p>
                  )}
                  <div className="pt-1 flex items-center text-[10px] font-bold text-orange-600 group-hover:translate-x-1 transition-transform">
                    <span>Xem chi tiết dự án</span>
                    <ChevronRight size={12} className="ml-0.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Related Events Section */}
      {relatedEvents.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-bold text-slate-950 flex items-center gap-2">
            <Calendar size={18} className="text-orange-600" />
            <span>Sự kiện liên quan</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedEvents.map((evt) => (
              <div
                key={evt.id}
                onClick={() => onNavigateToEvent?.(String(evt.id))}
                className="bg-white border border-slate-200 hover:border-orange-500 rounded-[10px] p-4 flex items-start gap-3.5 shadow-2xs transition-all hover:shadow-md cursor-pointer group hover:-translate-y-0.5 duration-200"
              >
                <div className="px-3 py-2 bg-orange-600 text-white rounded-[8px] text-center shrink-0 group-hover:bg-orange-700 transition-colors">
                  <span className="block text-[10px] font-extrabold uppercase tracking-wider">
                    {evt.date.split('/')[1] ? `Thg ${evt.date.split('/')[1]}` : 'Sự kiện'}
                  </span>
                  <span className="block text-base font-black leading-none mt-0.5">
                    {evt.date.split('/')[0]}
                  </span>
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <h4 className="text-xs font-bold text-slate-950 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
                    {evt.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <MapPin size={12} className="text-orange-600 shrink-0" />
                    <span className="line-clamp-1">{evt.location}</span>
                  </p>
                  <div className="pt-1 flex items-center text-[10px] font-bold text-orange-600 group-hover:translate-x-1 transition-transform">
                    <span>Xem chi tiết sự kiện</span>
                    <ChevronRight size={12} className="ml-0.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
