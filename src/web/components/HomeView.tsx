/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, FormEvent, CSSProperties } from 'react';
import { submitCustomerInteraction } from '../services/customerInteractionSubmission';
import { SYSTEM_FORM_IDS } from '../../shared/customerInteractionContract';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Play, 
  Phone, 
  Mail, 
  ChevronRight, 
  ChevronLeft, 
  ArrowUpRight, 
  Download, 
  ShieldCheck, 
  Users, 
  Bell, 
  Search, 
  X, 
  Calendar, 
  MapPin, 
  Award, 
  Menu, 
  User, 
  Building, 
  Briefcase, 
  Send, 
  CheckCircle, 
  Check,
  FileText
} from 'lucide-react';

import { Counter } from '@shared/components/Counter';
import { SectionHeader, typeBadge, typeBodyLead, typeButton, typeHero, typeH2, typeProse, typeStat, typeMeta } from '@shared/components/Typography';
import { AwardsSlider } from './AwardsSlider';
import { HomeEcosystemSection, type HomeEcosystemItem } from './HomeEcosystemSection';

import { getHomeData } from '../features/home/homeData';

import { Project } from '@shared/types';
import type { HomePageModel, PageRenderPolicy } from '@shared/page-content/models';
import { productionRenderPolicy } from '@shared/page-content/models';
import { bindElement } from '@shared/visual-editing/bindElement';
import { elementBindingRegistry, type ElementBindingRegistry } from '@shared/visual-editing/elementBindingRegistry';
import { createCollectionItemPath, createElementBinding } from '@shared/visual-editing/elementBindingTypes';

interface HomeViewProps {
  content: HomePageModel;
  renderPolicy?: PageRenderPolicy;
  setCurrentView: (view: 'home' | 'products' | 'about' | 'services' | 'projects' | 'news' | 'events' | 'contact' | 'privacy' | 'terms' | 'search') => void;
  setActiveLink: (link: string) => void;
  setActiveServiceId: (id: string | null) => void;
  setActiveProjectId: (id: string | null) => void;
  setPreSelectedNewsCategory: (category: string | null) => void;
  setAboutSubTab: (tab: 'overview' | 'structure' | 'experience') => void;
  setActiveEventId?: (id: string | null) => void;
  setIsRegisteringEvent?: (isReg: boolean) => void;
  previewSlideIndex?: number;
  editMode?: boolean;
  bindingRegistry?: ElementBindingRegistry;
}

export const HomeView = ({
  content,
  renderPolicy = productionRenderPolicy,
  setCurrentView,
  setActiveLink,
  setActiveServiceId,
  setActiveProjectId,
  setPreSelectedNewsCategory,
  setAboutSubTab,
  setActiveEventId,
  setIsRegisteringEvent,
  previewSlideIndex,
  editMode = false,
  bindingRegistry = elementBindingRegistry,
}: HomeViewProps) => {
  const {
    heroSlides,
    newsItems,
    partners,
    marqueeTexts,
    upcomingHomeEvents,
    pastHomeEvents,
    homeAwards,
  } = React.useMemo(getHomeData, []);
  const homeStats = content.stats.items;
  const projects = content.projects.items;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeEventTab, setActiveEventTab] = useState('upcoming');
  const [activeProjectTab, setActiveProjectTab] = useState('all');
  const [activeNewsCategory, setActiveNewsCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectSearchQuery, setProjectSearchQuery] = useState('');
  const [hoveredProjectIndex, setHoveredProjectIndex] = useState<number | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  
  // Contact form states
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [interestService, setInterestService] = useState('Phần mềm kỹ thuật');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Preload hero slide images for instant loading
    heroSlides.forEach((slide) => {
      const img = new Image();
      img.src = slide.img;
    });

    if (editMode) return undefined;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [editMode, heroSlides]);

  useEffect(() => {
    if (typeof previewSlideIndex === 'number' && heroSlides.length > 0) setCurrentSlide(Math.min(Math.max(0, previewSlideIndex), heroSlides.length - 1));
  }, [heroSlides.length, previewSlideIndex]);

  useEffect(() => {
    if (!editMode) return;
    setActiveProjectTab('all');
    setProjectSearchQuery('');
    setHoveredProjectIndex(null);
  }, [editMode]);

  const filteredProjects = projects.filter(p => {
    const matchesTab = activeProjectTab === 'all' || p.type === activeProjectTab;
    const searchLower = projectSearchQuery.toLowerCase();
    const matchesSearch = 
      p.name.toLowerCase().includes(searchLower) ||
      p.location.toLowerCase().includes(searchLower) ||
      p.tags.some(tag => tag.toLowerCase().includes(searchLower));
    return matchesTab && matchesSearch;
  });

  const filteredNews = newsItems.filter(n => {
    if (activeNewsCategory === 'all') {
      return n.category !== 'investor';
    }
    return n.category === activeNewsCategory;
  });

  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (fullName.trim() && phoneNumber.trim()) {
      await submitCustomerInteraction({
        formId: SYSTEM_FORM_IDS.homeConsultation,
        formName: 'Tư vấn trang chủ',
        values: { fullName, phoneNumber, message },
        source: { pageType: 'home', pageId: 'home', pageUrl: '/', pageTitle: 'Trang chủ', placementKey: 'home.contact_cta' },
      });
      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        setFullName('');
        setPhoneNumber('');
        setMessage('');
      }, 5000);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section data-page-builder-section-key="home.hero" id="home" className="relative h-[520px] sm:h-[560px] md:h-[600px] lg:h-[640px] xl:h-[660px] flex items-center overflow-hidden bg-slate-950 z-10 border-b border-orange-500/60 shadow-lg">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.img 
              key={currentSlide}
              src={heroSlides[currentSlide].img} 
              alt="Slide" 
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="w-full h-full object-cover animate-none"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 via-60% to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center relative z-10 w-full mb-4">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-8 xl:col-span-9"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg mb-5 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-orange-600 animate-pulse"></span>
              <span className={`${typeBadge} text-white`}>
                Leading Innovation since 1990
              </span>
            </div>
            
            <h1 
              className={`${typeHero} text-white mb-4`}
              dangerouslySetInnerHTML={{ __html: heroSlides[currentSlide].title }}
            />
            
            <p className={`${typeBodyLead} text-slate-300 mb-8 max-w-xl`}>
              {heroSlides[currentSlide].sub}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => {
                  setCurrentView('products');
                  setActiveLink('Sản phẩm');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-5 py-2.5 bg-orange-600 text-white rounded-lg ${typeButton} transition-all active:scale-95 shadow-lg shadow-orange-600/20 border-2 border-orange-600 btn-modern-interaction flex items-center justify-center gap-3 cursor-pointer`}
              >
                Khám phá giải pháp <ArrowRight size={20} />
              </button>
              <button 
                onClick={() => {
                  setCurrentView('about');
                  setActiveLink('Giới thiệu');
                  setAboutSubTab('overview');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-5 py-2.5 bg-white/5 text-white rounded-lg ${typeButton} transition-all hover:bg-white/10 border-2 border-white/10 flex items-center justify-center gap-3 btn-modern-interaction cursor-pointer`}
              >
                <Users size={20} /> Về chúng tôi
              </button>
            </div>
          </motion.div>
        </div>

        {!editMode && <div className="absolute bottom-16 md:bottom-20 left-1/2 -translate-x-1/2 flex gap-3 z-40">
          {heroSlides.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-[8px] transition-all duration-300 ${i === currentSlide ? 'w-10 bg-orange-600' : 'w-4 bg-white/20 hover:bg-white/40'}`}
              title={`Slide ${i + 1}`}
            />
          ))}
        </div>}

        {/* Headline Ticker */}
        <div className="absolute bottom-0 left-0 right-0 bg-slate-950/80 border-t border-white/10 backdrop-blur-md z-30 hidden md:block">
          <div className="max-w-7xl mx-auto px-6 h-12 flex items-center gap-4 relative overflow-hidden">
            <div className="flex bg-orange-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shrink-0 gap-2 items-center z-10 shadow-xs">
              <div className="relative flex items-center justify-center shrink-0">
                <Bell size={13} className="animate-[bounce_1.2s_infinite] text-white shrink-0" />
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-yellow-400"></span>
                </span>
              </div>
              <span>HOT NEWS</span>
            </div>
            <div className="flex-1 overflow-hidden relative h-full flex items-center group">
              <motion.div 
                animate={{ x: ["100vw", "-100%"] }}
                transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                className="whitespace-nowrap text-sm text-slate-300 font-medium"
              >
                {marqueeTexts.join(" • ")}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Section (Hơn 35 năm đồng hành) */}
      <section data-page-builder-section-key="home.intro" id="about" className="py-20 bg-white/40 relative overflow-hidden z-10 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <h2 className={`${typeH2} text-[#0b1b36] mb-8 normal-case`}>
                Hơn 35 năm <span className="text-orange-600">đồng hành</span><br className="hidden md:block" /> cùng kỹ thuật Việt Nam
              </h2>
              <div className={`${typeProse} space-y-4 text-slate-600 mb-10 text-justify`}>
                <p data-page-builder-config-path={JSON.stringify(['paragraphs', 0])}>
                  CIC (tiền thân là Trung tâm Tin học - Bộ Xây dựng, thành lập năm 1990) là đơn vị hàng đầu cung cấp phần mềm, thiết bị và giải pháp số cho ngành xây dựng.
                </p>
                <p data-page-builder-config-path={JSON.stringify(['paragraphs', 1])}>
                  Suốt hơn 35 năm, chúng tôi luôn đi đầu ứng dụng ICT, mang đến dịch vụ tư vấn chuyên sâu cho hàng nghìn doanh nghiệp, đối tác trong nước và quốc tế.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => {
                    setCurrentView('about');
                    setActiveLink('Giới thiệu');
                    setAboutSubTab('overview');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 sm:px-5 sm:py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-bold uppercase tracking-wider text-xs transition-all active:scale-95 shadow-sm shadow-orange-600/20 border-2 border-orange-600 btn-modern-interaction flex items-center gap-2 cursor-pointer"
                >
                  Khám phá hành trình CIC <ArrowRight size={15} />
                </button>
                <a 
                  href="https://www.cic.com.vn/flipbooks/index.html?pdf=CICProfile2024Final.pdf"
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

      {/* Stats Section */}
      <section data-page-builder-section-key="home.stats" className="py-20 bg-slate-50/30 relative overflow-hidden border-y border-slate-200 z-10">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div
            {...bindElement<HTMLDivElement>(createElementBinding({
              sectionKey: 'home.stats',
              elementPath: 'items',
              semantic: 'collection',
              ownership: 'embedded',
              editable: false,
              collectionPath: 'items',
            }), bindingRegistry)}
            className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8 md:divide-x divide-slate-200"
          >
            {homeStats.map((stat, i) => {
              const itemPath = createCollectionItemPath('items', stat.id);
              const valueBinding = createElementBinding({
                sectionKey: 'home.stats',
                elementPath: `${itemPath}.value`,
                semantic: 'text',
                ownership: 'embedded',
                editable: true,
                itemId: stat.id,
                collectionPath: 'items',
              });
              const suffixBinding = createElementBinding({
                sectionKey: 'home.stats',
                elementPath: `${itemPath}.suffix`,
                semantic: 'text',
                ownership: 'embedded',
                editable: true,
                itemId: stat.id,
                collectionPath: 'items',
              });

              return (
                <motion.div
                  key={stat.id}
                {...bindElement<HTMLDivElement>(createElementBinding({
                    sectionKey: 'home.stats',
                    elementPath: itemPath,
                    semantic: 'embedded-item',
                    ownership: 'embedded',
                    editable: false,
                    itemId: stat.id,
                    collectionPath: 'items',
                }), bindingRegistry)}
                  {...(renderPolicy.motionEnabled ? {
                    initial: { opacity: 0, y: 40 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true, margin: "-100px" },
                    transition: { delay: i * 0.1, duration: 0.8 },
                  } : { initial: false })}
                  className="text-center group"
                >
                  <div className={`${typeStat} text-slate-800 mb-4 flex items-center justify-center h-16 ${renderPolicy.motionEnabled ? 'group-hover:scale-110 group-hover:text-orange-500 transition-all duration-500' : ''}`}>
                    <Counter
                      value={stat.value}
                      suffix={stat.suffix}
                      motionEnabled={renderPolicy.motionEnabled}
                      elementProps={bindElement<HTMLSpanElement>([valueBinding, suffixBinding], bindingRegistry)}
                    />
                  </div>
                  <div
                    {...bindElement<HTMLDivElement>(createElementBinding({
                      sectionKey: 'home.stats',
                      elementPath: `${itemPath}.label`,
                      semantic: 'text',
                      ownership: 'embedded',
                      editable: true,
                      itemId: stat.id,
                      collectionPath: 'items',
                    }), bindingRegistry)}
                    className={`${typeMeta} text-slate-500`}
                  >
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section data-page-builder-section-key="home.awards" className="py-16 bg-white/40 relative overflow-hidden z-10 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <SectionHeader 
            title="Thành tựu & Giải thưởng" 
            sub="Minh chứng cho nỗ lực không ngừng nghỉ" 
          />
          <div className="mt-6">
            <AwardsSlider awards={homeAwards} paused={editMode} />
          </div>
        </div>
      </section>

      {/* Ecosystem Section */}
      <HomeEcosystemSection
        editMode={editMode}
        items={[
          {
            id: 'ai-smart-tech',
            title: 'AI & Công nghệ thông minh',
            description: 'Ứng dụng AI, dữ liệu lớn, IoT và tự động hóa vào các bài toán kỹ thuật phức tạp, giúp tối ưu quy trình và hỗ trợ ra quyết định dựa trên dữ liệu thực tế.',
            badge: 'Advanced Technology',
            image: heroSlides[2]?.img ?? heroSlides[1]?.img,
            view: 'products',
            activeLink: 'Sản phẩm',
          },
          {
            id: 'bim-digital-twins',
            title: 'BIM & Digital Twins',
            description: 'Đào tạo, tạo lập và thẩm tra mô hình BIM, số hóa công trình từ thiết kế đến vận hành.',
            badge: 'BIM & Digital Twins',
            image: projects[0]?.img ?? heroSlides[1]?.img,
            view: 'services',
            activeLink: 'Dịch vụ',
            serviceId: 'tu-van-bim',
          },
          {
            id: 'licensed-software',
            title: 'Phần mềm kỹ thuật bản quyền',
            description: 'Hệ sinh thái CAD, BIM, kết cấu, hạ tầng và năng lượng do CIC phát triển và phân phối.',
            badge: 'Phần mềm',
            image: heroSlides[3]?.img ?? heroSlides[1]?.img,
            view: 'products',
            activeLink: 'Sản phẩm',
          },
          {
            id: 'technology-equipment',
            title: 'Thiết bị công nghệ',
            description: 'Thiết bị khảo sát, kiểm định, đo đạc, UAV, LiDAR và GPR phục vụ ngành kỹ thuật.',
            badge: 'Thiết bị & IoT',
            image: projects.find((project) => project.type === 'equipment')?.img ?? heroSlides[1]?.img,
            view: 'products',
            activeLink: 'Sản phẩm',
          },
          {
            id: 'net-zero',
            title: 'Net Zero và phát triển bền vững',
            description: 'Giải pháp kiểm kê phát thải, LCA, EPD, CBAM và xây dựng lộ trình Net Zero.',
            badge: 'Sustainability',
            image: newsItems.find((item) => item.category === 'specialty')?.img ?? heroSlides[1]?.img,
            view: 'services',
            activeLink: 'Dịch vụ',
            serviceId: 'tu-van-kiem-ke-khi-nha-kinh',
          },
          {
            id: 'consulting-training',
            title: 'Tư vấn & Đào tạo',
            description: 'Đồng hành chuyển đổi số, triển khai công nghệ AI, Net Zero và BIM chuyên sâu.',
            badge: 'Tư vấn chuyên sâu',
            image: newsItems.find((item) => item.category === 'international')?.img ?? heroSlides[1]?.img,
            view: 'services',
            activeLink: 'Dịch vụ',
            serviceId: null,
          },
        ] satisfies readonly HomeEcosystemItem[]}
        onSelect={(item) => {
          setCurrentView(item.view);
          setActiveLink(item.activeLink);
          if (item.view === 'services' && setActiveServiceId) setActiveServiceId(item.serviceId ?? null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Featured Projects - 3 Cards Expanding Accordion */}
      <section data-page-builder-section-key="home.projects" id="projects" className="py-16 bg-white relative overflow-hidden border-t border-slate-100 z-10">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <SectionHeader 
             title="Dự án tiêu biểu" 
             sub="Kiến tạo hệ sinh thái giải pháp công nghệ kỹ thuật số toàn diện" 
          />
          
          {/* Project Tabs and Search */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'software', label: 'Phần mềm' },
                { id: 'equipment', label: 'Thiết bị' },
                { id: 'services', label: 'Dịch vụ' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (editMode) return;
                    setActiveProjectTab(tab.id);
                    setHoveredProjectIndex(null);
                  }}
                  className={`px-8 py-2.5 rounded-[8px] font-black text-xs uppercase tracking-widest transition-all ${
                    activeProjectTab === tab.id ? 'bg-orange-600 text-white shadow-lg' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="relative flex items-center w-full md:w-auto min-w-[280px]">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <Search className="text-slate-400" size={18} />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm dự án..."
                value={projectSearchQuery}
                readOnly={editMode}
                onChange={(e) => {
                  setProjectSearchQuery(e.target.value);
                  setHoveredProjectIndex(null);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              />
            </div>
          </div>

          {/* 3 Cards 16:9 Expanding Accordion Container */}
          <div 
            data-page-collection="project"
            onMouseLeave={() => setHoveredProjectIndex(null)}
            className="flex flex-col md:flex-row items-start justify-start gap-4 lg:gap-4 w-full"
          >
            {filteredProjects.length > 0 ? (
              (() => {
                const displayProjects = filteredProjects.slice(0, 3);
                const totalVisible = displayProjects.length;

                return displayProjects.map((proj, i) => {
                  const isHovered = !editMode && hoveredProjectIndex === i;

                  // Base 1/3 column width matching "Tất cả" grid layout
                  const baseWidth = '0 0 calc((100% - 2 * 1.5rem) / 3)';

                  let flexStyle = baseWidth;

                  if (totalVisible === 3) {
                    if (hoveredProjectIndex !== null) {
                      flexStyle = isHovered ? '1.8 1 0%' : '1 1 0%';
                    } else {
                      flexStyle = '1 1 0%';
                    }
                  } else if (totalVisible === 2) {
                    if (hoveredProjectIndex !== null) {
                      flexStyle = isHovered ? '0 0 calc(((100% - 2 * 1.5rem) / 3) * 1.4)' : baseWidth;
                    } else {
                      flexStyle = baseWidth;
                    }
                  } else if (totalVisible === 1) {
                    if (isHovered) {
                      flexStyle = '0 0 calc(((100% - 2 * 1.5rem) / 3) * 1.35)';
                    } else {
                      flexStyle = baseWidth;
                    }
                  }

                  const targetId =
                    proj.id === 1 ? 'landmark-81-bim' :
                    proj.id === 2 ? 'cao-toc-bac-nam-twin' :
                    proj.id === 3 ? 'dien-gio-mui-dinh' :
                    proj.id === 4 ? 'ham-duong-bo-deo-ca-pro' :
                    String(proj.id);

                  const handleProjectClick = () => {
                    setActiveProjectId(targetId);
                    setCurrentView('projects');
                    setActiveLink('Dự án');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  };

                  return (
                    <div
                      key={proj.entityId}
                      {...bindElement<HTMLDivElement>(createElementBinding({
                        sectionKey: 'home.projects',
                        elementPath: createCollectionItemPath('items', proj.entityId),
                        semantic: 'reference-item',
                        ownership: 'reference',
                        editable: false,
                        itemId: proj.entityId,
                        collectionPath: 'items',
                      }), bindingRegistry)}
                      onMouseEnter={() => { if (!editMode) setHoveredProjectIndex(i); }}
                      onFocus={() => { if (!editMode) setHoveredProjectIndex(i); }}
                      onClick={() => {
                        if (editMode) return;
                        // Toggle expansion on click for touch devices
                        if (hoveredProjectIndex === i) {
                          handleProjectClick();
                        } else {
                          setHoveredProjectIndex(i);
                        }
                      }}
                      onKeyDown={(e) => { 
                        if (editMode) return;
                        if (e.key === 'Enter' || e.key === ' ') { 
                          e.preventDefault(); 
                          if (hoveredProjectIndex === i) {
                            handleProjectClick();
                          } else {
                            setHoveredProjectIndex(i);
                          }
                        } 
                      }}
                      tabIndex={0}
                      role="button"
                      aria-expanded={isHovered}
                      aria-label={`${i + 1}. ${proj.name}`}
                      style={{
                        ['--card-flex' as string]: flexStyle,
                        transition: 'flex 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                      } as CSSProperties}
                      className={`group relative flex flex-col cursor-pointer w-full md:flex-[var(--card-flex)] ${
                        isHovered ? 'z-20' : 'z-10'
                      }`}
                    >
                      {/* 16:9 Aspect Ratio Image Box */}
                      <div className={`relative w-full aspect-video md:aspect-[16/9] overflow-hidden rounded-xl border transition-all duration-300 bg-slate-950 ${
                        isHovered 
                          ? 'shadow-xl border-orange-500/60 ring-2 ring-orange-500/20 -translate-y-1' 
                          : 'shadow-sm border-slate-200 group-hover:border-slate-300'
                      }`}>
                        <img 
                          src={proj.img} 
                          alt={proj.name} 
                          className={`w-full h-full object-cover transition-all duration-300 rounded-lg ${
                            isHovered ? 'scale-105 brightness-100' : 'scale-100 brightness-95 group-hover:scale-105'
                          }`}
                          referrerPolicy="no-referrer"
                        />

                        {/* Top Right Number Badge */}
                        <div className="absolute top-3.5 right-3.5 z-20">
                          <span className={`inline-flex items-center justify-center min-w-[36px] h-8 px-2.5 rounded-lg font-black text-xs tracking-wider shadow-sm transition-all duration-300 ${
                            isHovered 
                              ? 'bg-orange-600 text-white border border-orange-400/50 scale-105' 
                              : 'bg-slate-950/60 text-white/90 backdrop-blur-md border border-white/20'
                          }`}>
                            {String(i + 1).padStart(2, '0')}
                          </span>
                        </div>

                        {/* Text Content INSIDE Card Overlay (Shown ONLY when hovered) */}
                        <AnimatePresence>
                          {isHovered && (
                            <>
                              <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-slate-950/10 z-10"
                              />

                              <motion.div 
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 4 }}
                                transition={{ duration: 0.25, ease: 'easeOut' }}
                                className="absolute inset-x-4 bottom-4 md:inset-x-5 md:bottom-5 z-20 text-white"
                              >
                                <div className="flex items-center gap-2 mb-1.5">
                                  <span className="px-2.5 py-0.5 bg-orange-600/90 text-white text-[10px] font-black uppercase tracking-widest rounded-[8px] backdrop-blur-sm">
                                    {proj.category || (proj.type === 'software' ? 'Phần mềm' : proj.type === 'equipment' ? 'Thiết bị' : 'Tư vấn')}
                                  </span>
                                  <span className="text-slate-300 text-xs font-semibold">• {proj.location}</span>
                                </div>

                                <h3 className="text-base sm:text-lg md:text-xl font-black text-white leading-snug mb-1.5 tracking-tight drop-shadow-sm line-clamp-2">
                                  {proj.name}
                                </h3>

                                {proj.client && (
                                  <p className="text-slate-300 text-xs font-medium mb-2.5 line-clamp-1">
                                    <span className="text-orange-400 font-bold">Khách hàng:</span> {proj.client}
                                  </p>
                                )}

                                <div className="flex items-center justify-between gap-3 mt-1">
                                  <div className="flex flex-wrap gap-1.5">
                                    {proj.tags?.slice(0, 2).map((tag: string) => (
                                      <span key={tag} className="px-2 py-0.5 bg-white/10 text-white text-[10px] font-bold rounded-[8px] border border-white/20 backdrop-blur-sm">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>

                                  <button className="inline-flex items-center gap-1 px-3 py-1 bg-orange-600 hover:bg-orange-500 text-white text-xs font-black uppercase tracking-wider rounded-[8px] shadow-md transition-all shrink-0">
                                    Chi tiết <ArrowUpRight size={15} />
                                  </button>
                                </div>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Text Content BELOW Card (Hides on hover with fixed layout space to prevent flicker loop) */}
                      <div className={`mt-3 px-1 transition-all duration-300 ${
                        isHovered ? 'opacity-0 invisible pointer-events-none' : 'opacity-100 visible'
                      }`}>
                        <div className="text-orange-600 text-[11px] font-extrabold uppercase tracking-wider mb-1 truncate">
                          {proj.category || (proj.type === 'software' ? 'Phần mềm' : proj.type === 'equipment' ? 'Thiết bị' : 'Tư vấn')}
                        </div>
                        <h3 className="text-slate-900 font-black text-base leading-snug line-clamp-2 group-hover:text-orange-600 transition-colors">
                          {proj.short || proj.name}
                        </h3>
                        <p className="text-slate-500 text-xs font-medium line-clamp-1 mt-1">
                          {proj.client || proj.location}
                        </p>
                      </div>
                    </div>
                  );
                });
              })()
            ) : (
              <div className="w-full flex flex-col items-center justify-center py-16 text-slate-500 font-medium bg-slate-50 rounded-[10px] border border-slate-200">
                Không tìm thấy dự án nào phù hợp với từ khóa tìm kiếm.
              </div>
            )}
          </div>

          <div className="text-center mt-5 md:mt-6">
            <button 
              onClick={() => {
                setCurrentView('projects');
                setActiveLink('Dự án');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-black uppercase tracking-widest text-xs transition-all group btn-modern-interaction shadow-sm inline-flex items-center gap-1.5"
            >
              Xem tất cả dự án <ChevronRight className="inline-block group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Project Detail Backdrop (Page Transition Simulation) */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] bg-white p-6 md:p-20 overflow-y-auto"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setSelectedProject(null);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setSelectedProject(null);
                }
              }}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-detail-title"
            >
              <div className="max-w-7xl mx-auto">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="mb-12 flex items-center gap-3 text-slate-500 font-black uppercase tracking-widest hover:text-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-lg px-2 py-1"
                  id="project-detail-close"
                >
                  <ChevronLeft size={24} /> Quay lại danh sách
                </button>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                  <motion.div layoutId={`project-${selectedProject.id}`}>
                     <img src={selectedProject.img} className="w-full rounded-[10px] shadow-2xl" alt="" />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="text-orange-600 text-sm font-black uppercase tracking-widest mb-4">{selectedProject.location}</div>
                    <h2 id="project-detail-title" className="text-5xl md:text-6xl font-black text-slate-950 mb-8 leading-tight">{selectedProject.name}</h2>
                    <div className="space-y-8 text-lg text-slate-600 leading-relaxed">
                       <p>Mô tả chi tiết dự án: Dự án triển khai hạ tầng số với quy mô lớn, ứng dụng các giải pháp tiên tiến nhất từ đối tác Bentley Systems và giải pháp AI do CIC phát triển.</p>
                       <div className="flex gap-4">
                         {selectedProject.tags.map((tag: string) => (
                           <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-950 font-black rounded-[8px] uppercase text-xs tracking-widest">{tag}</span>
                         ))}
                       </div>
                    </div>
                    <button className="mt-12 px-5 py-2 bg-orange-600 text-white rounded-[8px] font-black uppercase tracking-widest shadow-xl hover:bg-white hover:text-orange-600 border-2 border-orange-600 transition-all active:scale-95 btn-modern-interaction">
                      Tải Portfolio Dự án
                    </button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
      {/* Events Section */}
      <section data-page-builder-section-key="home.events" id="events" className="py-12 bg-slate-950/90 text-white relative overflow-hidden border-t border-white/5 z-10">
        <div className="absolute inset-0 bg-tech-grid opacity-10 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <SectionHeader 
            title="Sự kiện & Hội thảo" 
            sub="Kết nối chuyên gia - Chia sẻ tri thức công nghệ" 
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

      {/* News & Perspectives Section */}
      <section data-page-builder-section-key="home.news" id="news" className="py-12 bg-slate-50/40 border-t border-slate-100 z-10 relative">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader 
            title="Tin tức và Góc nhìn" 
            sub="Cập nhật xu hướng công nghệ & chuyển đổi số mới nhất" 
          />

          {/* News Categories */}
          <div className="flex flex-wrap gap-2.5 mb-8 scrollbar-hide overflow-x-auto pb-2">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'company', label: 'Tin Công ty' },
              { id: 'specialty', label: 'Tin Chuyên ngành' },
              { id: 'international', label: 'Hợp tác Quốc tế' },
              { id: 'promo', label: 'Tin Khuyến mại' },
              { id: 'career', label: 'Tuyển dụng' },
              { id: 'investor', label: 'Quan hệ Cổ đông' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveNewsCategory(cat.id)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-[8px] uppercase font-medium text-xs tracking-wider border transition-all ${
                  activeNewsCategory === cat.id 
                    ? 'bg-orange-600 text-white border-orange-600 shadow-sm' 
                    : 'bg-white text-slate-700 border-slate-200 hover:border-orange-600 hover:text-orange-600 hover:bg-orange-50/50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div data-page-collection="news" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {filteredNews.length > 0 ? filteredNews.slice(0, 4).map((news, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                onClick={() => {
                  setCurrentView('news');
                  setActiveLink('Tin tức');
                  setPreSelectedNewsCategory(news.category);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group bg-slate-50 rounded-[10px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col relative cursor-pointer"
              >
                <div className="h-56 overflow-hidden relative rounded-[10px]">
                  <img src={news.img} alt={news.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 rounded-[10px]" />
                  
                  {/* Watermark */}
                  <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-20 transition-all w-10">
                    <img src="/logo.png" alt="" className="w-full invert" />
                  </div>

                  <div className="absolute top-4 left-4 px-3 py-1 bg-orange-600 text-white rounded-[8px] text-[10px] font-black uppercase tracking-widest shadow-lg">
                    {news.category === 'company' ? 'Tin Công ty' : news.category === 'international' ? 'Hợp tác Quốc tế' : news.category === 'specialty' ? 'Tin Chuyên ngành' : news.category === 'promo' ? 'Khuyến mại' : news.category === 'career' ? 'Tuyển dụng' : news.category === 'investor' ? 'Cổ đông' : 'Tech News'}
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <div className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">{news.date}</div>
                  <h3 className="text-xl font-black text-slate-950 mb-4 line-clamp-2 group-hover:text-orange-600 transition-colors">{news.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">{news.desc}</p>
                  <div className="mt-auto">
                    <span className="inline-flex items-center gap-2 text-orange-600 font-black text-xs uppercase tracking-widest group/link">
                      Đọc tiếp <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full py-16 px-6 text-center bg-white rounded-[10px] border border-dashed border-slate-200 shadow-sm flex flex-col items-center justify-center">
                <FileText className="w-10 h-10 text-slate-300 mb-3" />
                <p className="text-slate-500 font-bold text-sm tracking-wide">Đang cập nhật bài viết...</p>
                <p className="text-xs text-slate-400 mt-1">Nội dung chuyên mục này sẽ sớm được phát hành.</p>
              </div>
            )}
          </div>

          <div className="text-center mt-5 md:mt-6">
            <button
              onClick={() => {
                setCurrentView('news');
                setActiveLink('Tin tức');
                if (setPreSelectedNewsCategory) {
                  setPreSelectedNewsCategory(activeNewsCategory !== 'all' ? activeNewsCategory : 'all');
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-black uppercase tracking-widest text-xs transition-all group btn-modern-interaction shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
            >
              Xem tất cả tin tức <ChevronRight size={16} className="inline-block group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Partners & Strategic Clients Section (Relocated & Optimized to Marquee) */}
      <section data-page-builder-section-key="home.partners" className="py-10 bg-white/40 border-t border-slate-100 overflow-hidden relative z-10">
        <div className="max-w-7xl mx-auto px-6 mb-6 relative z-10">
          <SectionHeader 
            title="Đối tác chiến lược" 
            sub="Hợp tác cùng các tập đoàn công nghệ hàng đầu thế giới" 
          />
        </div>
        
        <div className="relative group z-10">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>
          
          <motion.div 
            data-page-collection="partner"
            {...(renderPolicy.motionEnabled ? { animate: { x: ["0%", "-50%"] }, transition: { repeat: Infinity, duration: 40, ease: "linear" } } : { initial: false })}
            className={renderPolicy.motionEnabled ? 'flex gap-4 whitespace-nowrap' : 'mx-auto grid max-w-7xl grid-cols-2 gap-4 px-6 md:grid-cols-4'}
          >
            {(renderPolicy.motionEnabled ? [...partners, ...partners] : partners).map((partner, i) => (
              <motion.div 
                key={i}
                {...(renderPolicy.motionEnabled ? { whileHover: { scale: 1.05, y: -5 } } : {})}
                className="flex-shrink-0 flex items-center justify-center p-4 md:p-6 rounded-[10px] bg-white border border-slate-100 hover:shadow-xl hover:border-orange-200 transition-all cursor-pointer h-20 md:h-24 w-44 md:w-48 group"
              >
                {partner.logo ? <img
                  src={partner.logo} 
                  alt={partner.name} 
                  className="max-h-12 md:max-h-14 w-full object-contain grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500" 
                /> : <span className="whitespace-normal text-center text-sm font-bold capitalize text-slate-700">{partner.name}</span>}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA & Contact Section */}
      <section data-page-builder-section-key="home.contact_cta" id="contact" className="py-12 bg-slate-50/50 overflow-hidden relative z-10">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-600 opacity-5 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-5xl font-black text-slate-950 mb-8 leading-[1.1] tracking-tighter">
                Sẵn sàng kiến tạo <br /> <span className="text-orange-600">Tương lai số</span>
              </h2>
              <p className="text-slate-600 text-base mb-10 max-w-xl font-medium leading-relaxed">
                Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng lắng nghe và cung cấp những giải pháp công nghệ tối ưu nhất cho doanh nghiệp của bạn.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-[8px] bg-slate-100 flex items-center justify-center text-slate-950 flex-shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <div className="text-slate-500 font-black uppercase text-[10px] tracking-widest mb-1">Hotline tư vấn</div>
                    <div className="text-xl text-slate-950 font-black">024 3976 1381</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-[8px] bg-slate-100 flex items-center justify-center text-slate-950 flex-shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <div className="text-slate-500 font-black uppercase text-[10px] tracking-widest mb-1">Email liên hệ</div>
                    <div className="text-xl text-slate-950 font-black">info@cic.com.vn</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-slate-50 rounded-[10px] p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 relative"
            >
              <h3 className="text-2xl font-black text-slate-950 mb-8">Gửi yêu cầu tư vấn</h3>
              
              <AnimatePresence>
                {formSubmitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center p-8 text-center z-10"
                  >
                    <div className="w-16 h-16 bg-orange-100 text-orange-600 flex items-center justify-center rounded-full mb-6">
                      <ShieldCheck size={32} />
                    </div>
                    <h4 className="text-xl font-black text-slate-900 mb-2 uppercase">Gửi thông tin thành công!</h4>
                    <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
                      Cảm ơn bạn đã gửi yêu cầu. Đội ngũ chuyên gia của CIC sẽ liên hệ lại với bạn trong vòng 24 giờ làm việc.
                    </p>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <form className="space-y-6" onSubmit={handleContactSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Họ tên</label>
                    <input 
                      type="text" 
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-lg px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-bold" 
                      placeholder="Nhập họ và tên" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Số điện thoại</label>
                    <input 
                      type="tel" 
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-lg px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-bold" 
                      placeholder="Nhập số điện thoại" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Dịch vụ quan tâm</label>
                  <select 
                    value={interestService}
                    onChange={(e) => setInterestService(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-lg px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-bold cursor-pointer"
                  >
                    <option>Phần mềm kỹ thuật bản quyền</option>
                    <option>Thiết bị & IoT</option>
                    <option>BIM/Digital Twins</option>
                    <option>Chuyển đổi số & Net Zero</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Nội dung</label>
                  <textarea 
                    rows={4} 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-lg px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-bold resize-none" 
                    placeholder="Mô tả nhu cầu của bạn..."
                  />
                </div>
                <button type="submit" className="w-full py-4 bg-orange-600 text-white rounded-[8px] font-black uppercase tracking-widest text-xs btn-modern-interaction shadow-xl shadow-orange-600/20">
                  Gửi thông tin ngay
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};
