'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, ArrowRight, ChevronRight } from 'lucide-react';
import { SectionHeader } from '@shared/components/Typography';
export type HomeEventDisplayItem = {
  id?: string | number;
  title: string;
  date: string;
  time?: string;
  loc?: string;
  attendees?: string;
  isPast?: boolean;
};

export interface HomeEventsSectionProps {
  title?: string;
  subtitle?: string;
  upcomingEvents?: readonly HomeEventDisplayItem[];
  pastEvents?: readonly HomeEventDisplayItem[];
  setCurrentView: (view: any) => void;
  setActiveLink: (link: any) => void;
  setActiveEventId?: (id: any) => void;
  setIsRegisteringEvent?: (val: boolean) => void;
}

export const HomeEventsSection: React.FC<HomeEventsSectionProps> = ({
  title,
  subtitle,
  upcomingEvents = [],
  pastEvents = [],
  setCurrentView,
  setActiveLink,
  setActiveEventId,
  setIsRegisteringEvent,
}) => {
  const [activeEventTab, setActiveEventTab] = useState('upcoming');

  return (
    <section data-page-builder-section-key="home.events" id="events" className="py-12 bg-slate-950/90 text-white relative overflow-hidden border-t border-white/5 z-10">
      <div className="absolute inset-0 bg-tech-grid opacity-10 pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionHeader 
          title={title || "Sự kiện & Hội thảo"} 
          sub={subtitle || "Kết nối chuyên gia - Chia sẻ tri thức công nghệ"} 
          titleProps={{ 'data-page-builder-config-path': JSON.stringify(['title']) } as any}
          subProps={{ 'data-page-builder-config-path': JSON.stringify(['subtitle']) } as any}
          dark
        />
        
        {/* Event Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {[
            { id: 'upcoming', label: 'Sắp diễn ra' },
            { id: 'ongoing', label: 'Đang diễn ra' },
            { id: 'featured', label: 'Sự kiện nổi bật' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveEventTab(tab.id)}
              className={`px-6 py-2 rounded-[8px] font-bold text-sm transition-all ${
                activeEventTab === tab.id ? 'bg-orange-600 text-white shadow-lg' : 'bg-slate-900/50 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div data-page-collection="event" className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 bg-slate-900/40 rounded-[10px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white/5 group"
          >
            <div className="h-[280px] sm:h-[340px] md:h-[380px] overflow-hidden relative bg-slate-950 flex items-center justify-center">
              <img src="https://www.cic.com.vn/images/news/2026/08/resized/tphngdngAItrongvnhnhcngbin1_1785830161.png" alt="Hội thảo AI Cảng biển" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute top-4 left-4 px-3 py-1 bg-red-600 text-white rounded-[4px] text-xs font-black uppercase tracking-wider shadow-xl">Sắp diễn ra</div>
              {/* Logo Overlay */}
              <div className="absolute top-4 right-4 z-10 transition-all duration-300 group-hover:scale-105">
                <img src="/logo.png" alt="CIC Logo" className="h-6 md:h-8 w-auto object-contain drop-shadow-xl" />
              </div>
            </div>
            <div className="p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-black text-white mb-3 group-hover:text-orange-600 transition-colors">Hội thảo: Đột Phá Ứng Dụng AI Trong Vận Hành Cảng Biển Việt Nam Thập Kỷ Tới</h3>
              <p className="text-slate-400 mb-5 leading-relaxed text-sm md:text-base">
                Khám phá xu hướng Smart Port, Digital Twin kết hợp Terminal Operating System (TOS) và các giải pháp AI tối ưu hóa hoạt động khai thác cảng biển.
              </p>
              <div className="flex flex-wrap gap-4 text-slate-300 mb-6">
                <div className="flex items-center gap-2.5 font-bold text-sm md:text-base"><Calendar size={18} className="text-orange-600" /> 19/08/2026 08:30</div>
                <div className="flex items-center gap-2.5 font-bold text-sm md:text-base"><MapPin size={18} className="text-orange-600" /> Online (Zoom)</div>
              </div>
              <button 
                onClick={() => {
                  if (setActiveEventId && setIsRegisteringEvent) {
                    setActiveEventId('ai-smartport-vietnam-2026');
                    setIsRegisteringEvent(true);
                  }
                  setCurrentView('events');
                  setActiveLink('Sự kiện');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 bg-orange-600 hover:bg-white text-white hover:text-orange-600 rounded-[8px] font-black uppercase tracking-wide border-2 border-orange-600 transition-all shadow-xl active:scale-95 btn-modern-interaction text-xs sm:text-sm cursor-pointer inline-flex items-center gap-2"
              >
                Đăng ký tham dự ngay <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>

          <div className="lg:col-span-5 space-y-2.5 flex flex-col">
            {[
              { title: 'Tư vấn Chuyển đổi số & BIM cho Doanh nghiệp', date: '20/05', loc: 'TP. Hồ Chí Minh', img: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop' },
              { title: 'Hội thảo Lộ trình Net Zero và Tín chỉ Carbon', date: '08/06', loc: 'Hà Nội', img: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2070&auto=format&fit=crop' },
              { title: 'Workshop: Ứng dụng AI trong Giám sát Công trình', date: '15/06', loc: 'Online (Zoom)', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop' },
            ].map((ev, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ x: 6, backgroundColor: 'rgba(30, 41, 59, 0.5)' }}
                onClick={() => {
                  setCurrentView('events');
                  setActiveLink('Sự kiện');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex gap-4 p-4 md:p-4.5 rounded-[10px] border border-transparent hover:border-white/10 transition-all cursor-pointer group relative shadow-orange-600/10 hover:shadow-xl text-left bg-slate-900/20"
              >
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-[10px] overflow-hidden shadow-inner flex-shrink-0 relative">
                  <img src={ev.img} alt="Event" className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500 rounded-[10px]" />
                  {/* Watermark */}
                  <div className="absolute bottom-2 right-2 opacity-10 group-hover:opacity-40 transition-all w-7">
                     <img src="/logo.png" alt="" className="w-full invert" />
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="font-black text-white mb-1.5 leading-snug group-hover:text-orange-600 transition-colors line-clamp-2 text-sm md:text-base">{ev.title}</h4>
                  <div className="text-[11px] text-slate-400 font-black uppercase tracking-widest mb-1.5">{ev.date} • {ev.loc}</div>
                  <div className="flex items-center gap-1 text-orange-600 text-[11px] font-black uppercase tracking-tighter">Chi tiết <ChevronRight size={12} /></div>
                </div>
              </motion.div>
            ))}
            
            <div className="pt-10">
              <button 
                onClick={() => {
                  setCurrentView('events');
                  setActiveLink('Sự kiện');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-2.5 border-2 border-orange-600/20 text-orange-600 rounded-[8px] font-bold text-sm hover:bg-orange-600 hover:text-white transition-all uppercase tracking-widest shadow-sm btn-modern-interaction"
              >
                Xem tất cả sự kiện
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
