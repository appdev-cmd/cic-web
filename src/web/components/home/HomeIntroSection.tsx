'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight, Play } from 'lucide-react';
import { typeH2, typeProse } from '@shared/components/Typography';
import type { HomeIntroModel } from '@shared/page-content/models';
import { sanitizeHtmlContent } from '@/shared/lib/sanitize';

export interface HomeIntroSectionProps {
  introData?: HomeIntroModel;
  editMode?: boolean;
  setCurrentView: (view: any) => void;
  setActiveLink: (link: any) => void;
  setAboutSubTab: (tab: any) => void;
}

export const HomeIntroSection: React.FC<HomeIntroSectionProps> = ({
  introData,
  editMode = false,
  setCurrentView,
  setActiveLink,
  setAboutSubTab,
}) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  return (
    <section data-page-builder-section-key="home.intro" id="about" className="py-20 bg-white/40 relative overflow-hidden z-10 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 data-page-builder-config-path={JSON.stringify(['title'])} className={`${typeH2} text-[#0b1b36] mb-8 normal-case`}>
              {introData?.title ? (
                /<[a-z][\s\S]*>/i.test(introData.title) ? (
                  <span dangerouslySetInnerHTML={{ __html: sanitizeHtmlContent(introData.title) }} />
                ) : introData.title.includes('đồng hành') ? (
                  <>
                    {introData.title.split('đồng hành')[0]}
                    <span className="text-orange-600">đồng hành</span>
                    {introData.title.split('đồng hành')[1]}
                  </>
                ) : introData.title.includes('Partnering') ? (
                  <>
                    {introData.title.split('Partnering')[0]}
                    <span className="text-orange-600">Partnering</span>
                    {introData.title.split('Partnering')[1]}
                  </>
                ) : introData.title.includes('partnering') ? (
                  <>
                    {introData.title.split('partnering')[0]}
                    <span className="text-orange-600">partnering</span>
                    {introData.title.split('partnering')[1]}
                  </>
                ) : (
                  introData.title
                )
              ) : (
                <>Hơn 35 năm <span className="text-orange-600">đồng hành</span><br className="hidden md:block" /> cùng kỹ thuật Việt Nam</>
              )}
            </h2>
            <div className={`${typeProse} space-y-4 text-slate-600 mb-10 text-justify`}>
              {introData?.paragraphs && introData.paragraphs.length > 0 ? (
                introData.paragraphs.map((p, idx) => (
                  <p key={idx} data-page-builder-config-path={JSON.stringify(['paragraphs', idx])}>
                    {p}
                  </p>
                ))
              ) : (
                <>
                  <p data-page-builder-config-path={JSON.stringify(['paragraphs', 0])}>
                    Thành lập từ năm 1990 trực thuộc Bộ Xây dựng, Công ty Cổ phần Công nghệ và Tư vấn CIC tự hào là đơn vị tiên phong trong lĩnh vực chuyển giao công nghệ phần mềm và tư vấn kỹ thuật tại Việt Nam.
                  </p>
                  <p data-page-builder-config-path={JSON.stringify(['paragraphs', 1])}>
                    Suốt hơn 35 năm, chúng tôi luôn đi đầu ứng dụng ICT, mang đến dịch vụ tư vấn chuyên sâu cho hàng nghìn doanh nghiệp, đối tác trong nước và quốc tế.
                  </p>
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              <button 
                data-page-builder-cta-key={JSON.stringify(['primaryCtaId'])}
                onClick={(e) => {
                  if (editMode) {
                    e.preventDefault();
                    return;
                  }
                  if (introData?.primaryCtaUrl) {
                    window.open(introData.primaryCtaUrl, introData.primaryCtaNewTab ? '_blank' : '_self');
                    return;
                  }
                  setCurrentView('about');
                  setActiveLink('Giới thiệu');
                  setAboutSubTab('overview');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-4 py-2 sm:px-5 sm:py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-bold uppercase tracking-wider text-xs transition-all active:scale-95 shadow-sm shadow-orange-600/20 border-2 border-orange-600 btn-modern-interaction flex items-center gap-2 cursor-pointer"
              >
                <span>{introData?.primaryCtaLabel || "Khám phá hành trình CIC"}</span> <ArrowRight size={15} />
              </button>
              <a 
                href={introData?.profilePdfUrl || "https://www.cic.com.vn/flipbooks/index.html?pdf=CICProfile2024Final.pdf"}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 sm:px-5 sm:py-2.5 bg-white text-slate-900 rounded-lg font-bold uppercase tracking-wider text-xs transition-all active:scale-95 shadow-sm border border-slate-200 hover:bg-slate-100 hover:border-slate-300 btn-modern-interaction flex items-center gap-2 cursor-pointer"
              >
                Hồ sơ năng lực <ArrowUpRight size={15} />
              </a>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            data-page-builder-video-path={JSON.stringify(['videoUrl'])}
            className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-xl border border-slate-200/90 aspect-video bg-slate-900"
          >
            {!isVideoPlaying ? (
              <div 
                className="group relative w-full h-full cursor-pointer"
                onClick={() => setIsVideoPlaying(true)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsVideoPlaying(true); } }}
                role="button"
                tabIndex={0}
                aria-label="Phát video giới thiệu CIC"
              >
                <img 
                  src="https://img.youtube.com/vi/hdLFK_09-tU/maxresdefault.jpg" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://img.youtube.com/vi/hdLFK_09-tU/hqdefault.jpg';
                  }}
                  alt="Video giới thiệu CIC" 
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover scale-[1.18] group-hover:scale-[1.25] transition-transform duration-500 ease-out origin-center"
                />
                <div className="absolute inset-0 bg-transparent group-hover:bg-slate-950/15 transition-all flex items-center justify-center">
                  <div className="relative">
                    <div className="relative w-14 h-14 md:w-16 md:h-16 bg-orange-600 text-white rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                      <Play size={22} fill="white" className="ml-0.5" />
                    </div>
                    <div className="absolute inset-0 w-14 h-14 md:w-16 md:h-16 bg-orange-600 rounded-[8px] animate-ping opacity-20"></div>
                  </div>
                </div>
              </div>
            ) : (
              <iframe 
                className="w-full h-full"
                src="https://www.youtube.com/embed/hdLFK_09-tU?start=448&autoplay=1" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
              ></iframe>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
