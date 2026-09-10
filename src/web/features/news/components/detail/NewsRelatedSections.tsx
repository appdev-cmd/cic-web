'use client';

import React from 'react';
import { ArrowRight, Building2, CalendarDays, MapPin } from 'lucide-react';
import type { EventItem } from '@/shared/types';
import type { NewsRelatedProject } from '../../types';

interface NewsRelatedSectionsProps {
  relatedProjects: NewsRelatedProject[];
  relatedEvents: EventItem[];
  onNavigateToProject?: (id: string) => void;
  onNavigateToEvent?: (id: string) => void;
}

export function NewsRelatedSections({
  relatedProjects,
  relatedEvents,
  onNavigateToProject,
  onNavigateToEvent,
}: NewsRelatedSectionsProps) {
  if (relatedProjects.length === 0 && relatedEvents.length === 0) return null;

  return (
    <div className="space-y-10 pt-8 border-t border-slate-200/80 my-8">
      {/* RELATED PROJECTS */}
      {relatedProjects.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold uppercase tracking-tight text-slate-900 flex items-center gap-2">
              <Building2 size={18} className="text-[#FC5115]" />
              <span>Dự án thực tế ứng dụng công nghệ</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedProjects.slice(0, 2).map((project) => (
              <div
                key={project.id}
                onClick={() => onNavigateToProject?.(project.id)}
                className="group cursor-pointer bg-white border border-slate-200 rounded-[12px] overflow-hidden hover:border-orange-500 hover:shadow-md transition-all flex flex-col"
              >
                {project.img && (
                  <div className="h-40 overflow-hidden relative bg-slate-900">
                    <img 
                      src={project.img} 
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {project.sector && (
                      <span className="absolute top-3 left-3 bg-slate-950/80 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                        {project.sector}
                      </span>
                    )}
                  </div>
                )}

                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    {project.location && (
                      <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                        <MapPin size={11} /> {project.location}
                      </p>
                    )}
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#FC5115] transition-colors line-clamp-2 mt-1">
                      {project.name}
                    </h4>
                    {project.shortDesc && (
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                        {project.shortDesc}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center gap-1 text-xs font-bold text-[#FC5115]">
                    <span>Xem dự án</span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RELATED EVENTS */}
      {relatedEvents.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold uppercase tracking-tight text-slate-900 flex items-center gap-2">
              <CalendarDays size={18} className="text-[#FC5115]" />
              <span>Sự kiện &amp; Hội thảo chuyên ngành</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedEvents.slice(0, 2).map((event) => (
              <div
                key={event.id}
                onClick={() => onNavigateToEvent?.(String(event.id))}
                className="group cursor-pointer bg-white border border-slate-200 rounded-[12px] p-4 hover:border-orange-500 hover:shadow-md transition-all flex items-start gap-4"
              >
                {/* Date Stamp */}
                <div className="w-14 h-14 bg-orange-50 border border-orange-200 rounded-xl flex flex-col items-center justify-center text-[#FC5115] shrink-0 font-black">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Tháng</span>
                  <span className="text-base leading-none">08</span>
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded">
                    {event.eventType || 'Hội thảo'}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#FC5115] transition-colors line-clamp-2 leading-snug">
                    {event.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1">
                    <MapPin size={10} /> {event.location || 'Hà Nội / Online'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
