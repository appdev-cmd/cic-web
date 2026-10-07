import { motion } from 'motion/react';
import { Building2, Users, Award, Layers } from 'lucide-react';
import { createElementBinding } from '@shared/visual-editing/elementBindingTypes';
import type { ElementBindingRegistry } from '@shared/visual-editing/elementBindingRegistry';
import type { PageRenderPolicy } from '@shared/page-content/models';
import { useI18n } from '@/shared/i18n';
import { bindElement, textFrom } from './aboutUtils';

export type AboutTabKey = 'overview' | 'ecosystem' | 'structure' | 'experience';

interface AboutHeroBannerProps {
  heroConfig: Record<string, unknown>;
  activeTab: AboutTabKey;
  onTabChange: (tab: AboutTabKey) => void;
  bindingRegistry: ElementBindingRegistry;
  renderPolicy: PageRenderPolicy;
  resolveMediaUrl: (id: string) => string;
}

export function AboutHeroBanner({
  heroConfig,
  activeTab,
  onTabChange,
  bindingRegistry,
  renderPolicy,
  resolveMediaUrl,
}: AboutHeroBannerProps) {
  const { locale } = useI18n();
  const isEn = locale === 'en';

  const tabs: Array<{ id: AboutTabKey; label: string }> = [
    { id: 'overview', label: isEn ? 'Corporate Overview' : 'Tổng quan doanh nghiệp' },
    { id: 'ecosystem', label: isEn ? 'Solutions Ecosystem' : 'Hệ sinh thái giải pháp' },
    { id: 'structure', label: isEn ? 'Organization Structure' : 'Cơ cấu tổ chức' },
    { id: 'experience', label: isEn ? 'Capacity & Experience' : 'Năng lực & Kinh nghiệm' },
  ];

  return (
    <>
      {/* Visual Top Hero Banner */}
      <section
        data-page-builder-section-key="about.hero"
        className="relative pt-10 pb-12 lg:pt-14 lg:pb-16 overflow-hidden bg-slate-900 z-10 border-b border-slate-800"
      >
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            data-page-builder-media-path={JSON.stringify(['backgroundImageId'])}
            data-page-builder-media-id={textFrom(heroConfig, 'backgroundImageId', '')}
            src={resolveMediaUrl(
              textFrom(
                heroConfig,
                'backgroundImageId',
                'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80'
              )
            )}
            alt="CIC Technology Banner"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover opacity-75 scale-105 filter brightness-105 contrast-105"
          />
          <video
            autoPlay={renderPolicy.motionEnabled}
            loop={renderPolicy.motionEnabled}
            muted
            playsInline
            preload="none"
            className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-screen scale-105"
            src="https://cdn.pixabay.com/video/2020/01/31/31755-388274351_large.mp4"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-slate-950/20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 via-transparent to-slate-950/40"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/60 border border-white/20 rounded-[8px] mb-4 lg:mb-6 backdrop-blur-md shadow-lg">
            <span
              className={`flex h-2 w-2 rounded-full bg-orange-600 ${
                renderPolicy.motionEnabled ? 'animate-pulse' : ''
              }`}
            ></span>
            <span
              {...bindElement(
                bindingRegistry,
                createElementBinding({
                  sectionKey: 'about.hero',
                  elementPath: 'badge',
                  semantic: 'text',
                  ownership: 'section-config',
                  editable: true,
                })
              )}
              data-page-builder-config-path={JSON.stringify(['badge'])}
              className="text-[10px] font-black uppercase tracking-[0.3em] text-white"
            >
              {textFrom(heroConfig, 'badge', isEn ? 'About Us' : 'Về chúng tôi')}
            </span>
          </div>

          <h1
            {...bindElement(
              bindingRegistry,
              createElementBinding({
                sectionKey: 'about.hero',
                elementPath: 'title',
                semantic: 'text',
                ownership: 'section-config',
                editable: true,
              })
            )}
            data-page-builder-config-path={JSON.stringify(['title'])}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-3 lg:mb-4 tracking-tighter max-w-4xl mx-auto [text-shadow:_0_4px_12px_rgb(0_0_0_/_80%)]"
          >
            {textFrom(heroConfig, 'title', isEn ? 'OVER 35 YEARS OF ADVANCING WITH TECHNOLOGY' : 'HƠN 35 NĂM NHỊP BƯỚC CÙNG CÔNG NGHỆ')}
          </h1>

          <p
            {...bindElement(
              bindingRegistry,
              createElementBinding({
                sectionKey: 'about.hero',
                elementPath: 'subtitle',
                semantic: 'text',
                ownership: 'section-config',
                editable: true,
              })
            )}
            data-page-builder-config-path={JSON.stringify(['subtitle'])}
            className="text-slate-100 text-sm md:text-base max-w-2xl mx-auto font-medium leading-relaxed [text-shadow:_0_2px_8px_rgb(0_0_0_/_80%)]"
          >
            {textFrom(
              heroConfig,
              'subtitle',
              isEn
                ? 'Pioneering in engineering software solutions, technological equipment, and comprehensive digital transformation consulting for Vietnam construction industry.'
                : 'Tiên phong cung cấp giải pháp phần mềm kỹ thuật, thiết bị công nghệ và tư vấn chuyển đổi số toàn diện cho ngành Xây dựng Việt Nam.'
            )}
          </p>
        </div>
      </section>

      {/* Modern Tab Menu Bar */}
      <div className="bg-white border-b border-slate-200 z-30 relative shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-1 md:space-x-8 overflow-x-auto scrollbar-hide py-1">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    onTabChange(tab.id);
                    window.scrollTo({ top: 320, behavior: 'smooth' });
                  }}
                  className={`relative px-4 py-4 text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap shrink-0 flex items-center gap-2 rounded-[8px] ${
                    active ? 'text-orange-600' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {tab.id === 'overview' && <Building2 size={14} />}
                  {tab.id === 'ecosystem' && <Layers size={14} />}
                  {tab.id === 'structure' && <Users size={14} />}
                  {tab.id === 'experience' && <Award size={14} />}
                  {tab.label}
                  {active && (
                    <motion.div
                      layoutId="activeAboutTabLine"
                      className="absolute bottom-0 left-0 right-0 h-[3px] bg-orange-600"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
