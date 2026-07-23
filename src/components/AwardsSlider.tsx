import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AwardItem {
  name: string;
  img: string;
}

interface AwardsSliderProps {
  awards: AwardItem[];
}

export const AwardsSlider: React.FC<AwardsSliderProps> = ({ awards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Touch swipe refs
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const totalItems = awards.length;

  // Calculate items per page dynamically based on screen width
  const updateItemsPerPage = useCallback(() => {
    const width = window.innerWidth;
    if (width < 480) {
      setItemsPerPage(1);
    } else if (width < 640) {
      setItemsPerPage(2);
    } else if (width < 768) {
      setItemsPerPage(3);
    } else if (width < 1024) {
      setItemsPerPage(4);
    } else {
      setItemsPerPage(5);
    }
  }, []);

  useEffect(() => {
    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, [updateItemsPerPage]);

  // Duplicate items array for seamless looping
  const extendedAwards = [...awards, ...awards, ...awards];

  const handleNext = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, []);

  const handlePrev = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => {
      if (prev === 0) {
        return totalItems - 1;
      }
      return prev - 1;
    });
  }, [totalItems]);

  useEffect(() => {
    if (currentIndex >= totalItems) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(0);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, totalItems]);

  // Auto-play timer
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      handleNext();
    }, 3500);
    return () => clearInterval(interval);
  }, [isHovered, handleNext]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 40;
    const isRightSwipe = distance < -40;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Map itemsPerPage to class for smooth SSR/fallback matching
  const getItemWidthClass = () => {
    switch (itemsPerPage) {
      case 1:
        return 'w-full';
      case 2:
        return 'w-1/2';
      case 3:
        return 'w-1/3';
      case 4:
        return 'w-1/4';
      case 5:
      default:
        return 'w-1/5';
    }
  };

  return (
    <div 
      className="relative w-full py-2 px-8 sm:px-12 md:px-16 group/slider select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Navigation Controls positioned outside card viewport */}
      <button
        onClick={handlePrev}
        aria-label="Previous Award"
        className="absolute left-0 sm:left-1 md:left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 bg-white/80 backdrop-blur-xs border border-slate-200/80 text-slate-600 rounded-full flex items-center justify-center shadow-sm hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all duration-300 opacity-60 hover:opacity-100 group-hover/slider:opacity-90 hover:scale-105 active:scale-95"
      >
        <ChevronLeft size={20} className="sm:hidden" />
        <ChevronLeft size={22} className="hidden sm:block" />
      </button>

      <button
        onClick={handleNext}
        aria-label="Next Award"
        className="absolute right-0 sm:right-1 md:right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 bg-white/80 backdrop-blur-xs border border-slate-200/80 text-slate-600 rounded-full flex items-center justify-center shadow-md hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all duration-300 opacity-60 hover:opacity-100 group-hover/slider:opacity-90 hover:scale-105 active:scale-95"
      >
        <ChevronRight size={20} className="sm:hidden" />
        <ChevronRight size={22} className="hidden sm:block" />
      </button>

      {/* Slider Viewport */}
      <div 
        className="overflow-hidden w-full py-5"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
            transitionProperty: isTransitioning ? 'transform' : 'none',
          }}
        >
          {extendedAwards.map((award, i) => (
            <div 
              key={i} 
              className={`${getItemWidthClass()} flex-none px-2 sm:px-3`}
            >
              <div className="bg-white p-5 sm:p-6 md:p-7 shadow-sm hover:shadow-xl border border-slate-100 rounded-xl flex flex-col items-center group hover:-translate-y-1.5 hover:border-orange-300 transition-all duration-300 h-full min-h-[260px] sm:min-h-[290px] md:min-h-[310px] justify-between">
                <div className="h-32 sm:h-40 md:h-44 flex items-center justify-center overflow-hidden w-full my-auto p-2">
                  <img 
                    src={award.img} 
                    alt={award.name} 
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                <h3 className="text-xs md:text-sm font-bold text-slate-800 text-center uppercase tracking-wider group-hover:text-orange-600 transition-colors line-clamp-2 mt-3 sm:mt-4">
                  {award.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

