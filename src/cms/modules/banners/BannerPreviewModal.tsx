import React, { useState } from 'react';
import {
  X,
  Monitor,
  Laptop,
  Tablet,
  Smartphone,
  Globe,
  Sliders,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { BannerContent } from './types';

interface BannerPreviewModalProps {
  item: BannerContent | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BannerPreviewModal: React.FC<BannerPreviewModalProps> = ({ item, isOpen, onClose }) => {
  const [device, setDevice] = useState<'desktop' | 'laptop' | 'tablet' | 'mobile'>('desktop');
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  if (!isOpen || !item) return null;

  const slides = item.type === 'slideshow' && item.slides.length > 0 ? item.slides : [];
  const activeSlide = slides.length > 0 ? slides[activeSlideIdx] : null;

  const getContainerWidth = () => {
    switch (device) {
      case 'desktop':
        return 'w-full max-w-5xl';
      case 'laptop':
        return 'w-full max-w-3xl';
      case 'tablet':
        return 'w-[640px]';
      case 'mobile':
        return 'w-[375px]';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-950 border border-slate-800 w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Preview Header Toolbar */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <span>Xem Trước Hiển Thị Live (Contextual Preview)</span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-orange-500/20 text-orange-400 border border-orange-500/40">
                  {item.placement_name}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Mô phỏng trải nghiệm người dùng thực tế theo tỷ lệ màn hình và site được chọn.
              </p>
            </div>
          </div>

          {/* Breakpoint Switcher */}
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
            {[
              { id: 'desktop', icon: Monitor, label: 'Desktop (1920px)' },
              { id: 'laptop', icon: Laptop, label: 'Laptop (1366px)' },
              { id: 'tablet', icon: Tablet, label: 'Tablet (768px)' },
              { id: 'mobile', icon: Smartphone, label: 'Mobile (375px)' },
            ].map((d) => {
              const IconComp = d.icon;
              return (
                <button
                  key={d.id}
                  onClick={() => setDevice(d.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    device === d.id
                      ? 'bg-orange-600 text-white shadow-2xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{d.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview Canvas Stage */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-900/40 flex items-center justify-center min-h-[400px]">
          <div className={`transition-all duration-300 ${getContainerWidth()}`}>
            {/* Mock Website Container Frame */}
            <div className="rounded-2xl border border-slate-700 bg-slate-900 overflow-hidden shadow-2xl space-y-0">
              {/* Mock Browser Header Bar */}
              <div className="px-4 py-2 bg-slate-800 border-b border-slate-700 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <div className="px-3 py-1 rounded-md bg-slate-900 text-[11px] font-mono text-slate-300 border border-slate-700 w-64 text-center truncate">
                  https://cic.com.vn{item.link_url}
                </div>
                <div className="flex items-center gap-1 text-[11px]">
                  <Globe className="w-3 h-3 text-orange-400" /> {item.site_id}
                </div>
              </div>

              {/* Banner / Slideshow Stage */}
              <div className="relative overflow-hidden bg-slate-950 group">
                <img
                  src={activeSlide ? activeSlide.media_url : item.media_url}
                  alt={item.title}
                  className="w-full h-[320px] md:h-[400px] object-cover transition-all duration-500"
                />

                {/* Overlay Banner Copy */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-6 md:p-10 flex flex-col justify-end text-white space-y-2">
                  <span className="px-3 py-1 bg-orange-600 text-white font-extrabold text-[10px] rounded-md uppercase tracking-wider w-fit shadow-md">
                    {item.placement_name}
                  </span>

                  <h2 className="text-xl md:text-3xl font-black text-white tracking-tight leading-tight max-w-2xl drop-shadow-md">
                    {activeSlide ? activeSlide.title : item.title}
                  </h2>

                  <p className="text-xs md:text-sm text-slate-200 max-w-xl line-clamp-2">
                    {activeSlide?.subtitle || item.copy_text || item.caption}
                  </p>

                  <div className="pt-2">
                    <button className="px-5 py-2.5 text-xs font-extrabold text-white bg-orange-600 hover:bg-orange-500 rounded-xl transition shadow-lg flex items-center gap-2">
                      <span>{item.cta_text || 'Khám phá ngay'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Slideshow Controls Navigation */}
                {slides.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setActiveSlideIdx((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/60 text-white hover:bg-orange-600 transition"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        setActiveSlideIdx((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/60 text-white hover:bg-orange-600 transition"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Pagination Dots */}
                    <div className="absolute bottom-3 right-6 flex items-center gap-1.5 z-10">
                      {slides.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveSlideIdx(idx)}
                          className={`w-2.5 h-2.5 rounded-full transition ${
                            activeSlideIdx === idx ? 'bg-orange-500 w-6' : 'bg-white/50 hover:bg-white'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
