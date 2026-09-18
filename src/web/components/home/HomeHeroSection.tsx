'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Users, Bell } from 'lucide-react';
import { typeBadge, typeBodyLead, typeButton, typeHero } from '@shared/components/Typography';
import type { HomeHeroSlideModel } from '@shared/page-content/models';

export function formatHeroHeading(rawTitle?: string): string {
  if (!rawTitle) return '';
  if (/<[a-z][\s\S]*>/i.test(rawTitle)) return rawTitle;

  const trimmed = rawTitle.trim();
  const knownPresets: Record<string, { main: string; highlight: string }> = {
    'Đối tác công nghệ chiến lược': { main: 'Đối tác công nghệ', highlight: 'chiến lược' },
    'Hệ sinh thái giải pháp số': { main: 'Hệ sinh thái', highlight: 'giải pháp số' },
    'Dẫn đầu chuyển đổi số': { main: 'Dẫn đầu', highlight: 'chuyển đổi số' },
    'Phần mềm bản quyền chính hãng': { main: 'Phần mềm bản quyền', highlight: 'chính hãng' },
    'Strategic Technology Partner': { main: 'Strategic Technology', highlight: 'Partner' },
    'Digital Solutions Ecosystem': { main: 'Digital Solutions', highlight: 'Ecosystem' },
    'Leading Digital Transformation': { main: 'Leading', highlight: 'Digital Transformation' },
    'Genuine Licensed Software': { main: 'Genuine', highlight: 'Licensed Software' },
  };

  if (knownPresets[trimmed]) {
    const { main, highlight } = knownPresets[trimmed];
    return `${main} <br /><span class="text-orange-600 whitespace-nowrap">${highlight}</span>`;
  }

  if (trimmed.includes('\n')) {
    const [line1, ...rest] = trimmed.split('\n');
    return `${line1.trim()} <br /><span class="text-orange-600 whitespace-nowrap">${rest.join(' ').trim()}</span>`;
  }

  const words = trimmed.split(/\s+/);
  if (words.length >= 3) {
    const highlightCount = words.length >= 4 ? 2 : 1;
    const main = words.slice(0, words.length - highlightCount).join(' ');
    const highlight = words.slice(words.length - highlightCount).join(' ');
    return `${main} <br /><span class="text-orange-600 whitespace-nowrap">${highlight}</span>`;
  }

  return trimmed;
}

export interface HomeHeroSectionProps {
  heroSlides: HomeHeroSlideModel[];
  marqueeTexts: string[];
  heroBadge: string;
  defaultHeroSlide?: HomeHeroSlideModel;
  previewSlideIndex?: number;
  editMode?: boolean;
  setCurrentView: (view: any) => void;
  setActiveLink: (link: any) => void;
  setAboutSubTab: (tab: any) => void;
}

export const HomeHeroSection: React.FC<HomeHeroSectionProps> = ({
  heroSlides,
  marqueeTexts,
  heroBadge,
  defaultHeroSlide,
  previewSlideIndex,
  editMode = false,
  setCurrentView,
  setActiveLink,
  setAboutSubTab,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const activeSlideIndex = Math.min(Math.max(0, currentSlide), Math.max(0, heroSlides.length - 1));
  const currentHeroSlide = heroSlides[activeSlideIndex] ?? defaultHeroSlide ?? heroSlides[0];

  useEffect(() => {
    // Preload hero slide images for instant loading
    heroSlides.forEach((slide) => {
      if (slide?.img) {
        const img = new Image();
        img.src = slide.img;
      }
    });

    if (editMode) return undefined;
    if (heroSlides.length <= 1) return undefined;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [editMode, heroSlides]);

  useEffect(() => {
    if (typeof previewSlideIndex === 'number' && heroSlides.length > 0) {
      setCurrentSlide(Math.min(Math.max(0, previewSlideIndex), heroSlides.length - 1));
    }
  }, [heroSlides.length, previewSlideIndex]);

  return (
    <section data-page-builder-section-key="home.hero" id="home" className="relative h-[520px] sm:h-[560px] md:h-[600px] lg:h-[640px] xl:h-[660px] flex items-center overflow-hidden bg-slate-950 z-10 border-b border-orange-500/60 shadow-lg">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <AnimatePresence mode="wait">
          {currentHeroSlide?.img ? (
            <motion.img 
              key={activeSlideIndex}
              src={currentHeroSlide.img} 
              alt="Slide" 
              fetchPriority={activeSlideIndex === 0 ? "high" : "auto"}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="w-full h-full object-cover animate-none"
            />
          ) : null}
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 via-60% to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center relative z-10 w-full mb-4">
        <motion.div
          key={activeSlideIndex}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-8 xl:col-span-9"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg mb-5 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-orange-600 animate-pulse"></span>
            <span className={`${typeBadge} text-white`}>
              {heroBadge}
            </span>
          </div>
          
          <h1 
            className={`${typeHero} text-white mb-4`}
            dangerouslySetInnerHTML={{ __html: formatHeroHeading(currentHeroSlide?.title) }}
          />
          
          <p className={`${typeBodyLead} text-slate-300 mb-8 max-w-xl`}>
            {currentHeroSlide?.sub || ''}
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

      {!editMode && heroSlides.length > 1 && (
        <div className="absolute bottom-16 md:bottom-20 left-1/2 -translate-x-1/2 flex gap-3 z-40">
          {heroSlides.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-[8px] transition-all duration-300 ${i === activeSlideIndex ? 'w-10 bg-orange-600' : 'w-4 bg-white/20 hover:bg-white/40'}`}
              title={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}

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
  );
};
