import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';

export interface HomeEcosystemItem {
  id: string;
  title: string;
  description: string;
  badge: string;
  image: string;
  view: 'products' | 'services';
  activeLink: 'Sản phẩm' | 'Dịch vụ';
  serviceId?: string | null;
}

interface HomeEcosystemSectionProps {
  title?: string;
  subtitle?: string;
  items: readonly HomeEcosystemItem[];
  editMode?: boolean;
  onSelect: (item: HomeEcosystemItem) => void;
}

export const HomeEcosystemSection: React.FC<HomeEcosystemSectionProps> = ({
  title = 'Hệ sinh thái Công nghệ CIC',
  subtitle = 'Phần mềm, thiết bị, AI, BIM, Digital Twins cùng năng lực tư vấn và đào tạo chuyên sâu trong một hệ sinh thái công nghệ thống nhất.',
  items,
  editMode = false,
  onSelect,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(items.length > 1);

  const syncScrollState = () => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>('[data-ecosystem-card]');
    const gap = Number.parseFloat(window.getComputedStyle(track).columnGap || '20');
    const step = (card?.getBoundingClientRect().width ?? track.clientWidth * 0.82) + gap;
    const lastReachableIndex = Math.min(items.length - 1, Math.max(0, Math.round((track.scrollWidth - track.clientWidth) / step)));
    setActiveIndex(Math.min(lastReachableIndex, Math.max(0, Math.round(track.scrollLeft / step))));
    setCanScrollLeft(track.scrollLeft > 8);
    setCanScrollRight(track.scrollLeft + track.clientWidth < track.scrollWidth - 8);
  };

  useEffect(() => {
    syncScrollState();
    window.addEventListener('resize', syncScrollState);
    return () => window.removeEventListener('resize', syncScrollState);
  }, [items.length]);

  const move = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>('[data-ecosystem-card]');
    const gap = Number.parseFloat(window.getComputedStyle(track).columnGap || '20');
    const step = (card?.getBoundingClientRect().width ?? track.clientWidth * 0.82) + gap;
    track.scrollBy({ left: direction * step, behavior: 'smooth' });
  };

  if (editMode) {
    return (
      <section data-page-builder-section-key="home.ecosystem" id="solutions" className="relative scroll-mt-24 bg-white py-14 text-slate-950 sm:py-16 lg:scroll-mt-28 lg:py-20">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <h2
              data-page-builder-config-path={JSON.stringify(['title'])}
              className="text-3xl font-black uppercase leading-[1.08] tracking-tighter text-slate-950 sm:text-4xl lg:text-5xl"
            >
              {title}
            </h2>
            <div aria-hidden="true" className="mx-auto my-5 h-1 w-14 rounded-full bg-orange-600" />
            <p
              data-page-builder-config-path={JSON.stringify(['subtitle'])}
              className="text-base leading-7 text-slate-600"
            >
              {subtitle}
            </p>
          </div>

          <div
            ref={trackRef}
            data-page-collection="ecosystem"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full"
          >
            {items.map((item) => (
              <div
                key={item.id}
                data-ecosystem-card
                className="group relative flex flex-col rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] hover:shadow-[0_16px_32px_-8px_rgba(15,23,42,0.14)] transition-all duration-300 text-left"
              >
                <span className="relative block h-[340px] sm:h-[370px] lg:h-[390px] w-full overflow-hidden bg-slate-950">
                  <img src={item.image} alt={item.title} loading="lazy" className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                  <span className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent" aria-hidden="true" />
                  <span className="absolute left-4 top-4 rounded-full bg-orange-600/95 backdrop-blur-xs px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-xs">
                    {item.badge}
                  </span>
                  <span className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                    <span className="line-clamp-3 block text-xs sm:text-sm leading-relaxed text-slate-100/90 font-normal drop-shadow-xs">
                      {item.description}
                    </span>
                  </span>
                </span>
                <span className="flex min-h-[72px] items-center justify-between gap-3 px-4 py-3 bg-white">
                  <span className="text-base sm:text-lg font-bold leading-snug tracking-tight text-slate-900 transition-colors group-hover:text-orange-600 line-clamp-2">
                    {item.title}
                  </span>
                  <span className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-700 border border-slate-200/60 shadow-xs transition-colors group-hover:bg-orange-600 group-hover:border-orange-600 group-hover:text-white" aria-hidden="true">
                    <ArrowUpRight className="size-4 sm:size-4.5" />
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section data-page-builder-section-key="home.ecosystem" id="solutions" className="relative scroll-mt-24 overflow-hidden bg-white py-14 text-slate-950 sm:py-16 lg:scroll-mt-28 lg:py-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-12">
          <div className="lg:col-span-3 xl:col-span-3 lg:sticky lg:top-28">
            <h2
              data-page-builder-config-path={JSON.stringify(['title'])}
              className="max-w-md text-3xl font-black uppercase leading-[1.08] tracking-tighter text-slate-950 sm:text-4xl"
            >
              {title}
            </h2>
            <div aria-hidden="true" className="my-5 h-1 w-14 rounded-full bg-orange-600" />
            <p
              data-page-builder-config-path={JSON.stringify(['subtitle'])}
              className="max-w-md text-base leading-7 text-slate-600"
            >
              {subtitle}
            </p>

            <div className="mt-7 flex items-center gap-4 sm:mt-9">
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => move(-1)}
                  disabled={!canScrollLeft}
                  className="flex size-11 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-800 shadow-sm transition-colors hover:border-slate-950 hover:bg-slate-950 hover:text-white disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-300 cursor-pointer"
                  aria-label="Xem giải pháp trước"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={() => move(1)}
                  disabled={!canScrollRight}
                  className="flex size-11 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-800 shadow-sm transition-colors hover:border-slate-950 hover:bg-slate-950 hover:text-white disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-300 cursor-pointer"
                  aria-label="Xem giải pháp tiếp theo"
                >
                  <ChevronRight className="size-5" />
                </button>
              </div>
              <p className="border-l border-slate-200 pl-4 text-xs font-bold tabular-nums text-slate-400" aria-live="polite">
                <span className="text-sm text-orange-600">{String(activeIndex + 1).padStart(2, '0')}</span>
                <span className="mx-1.5">/</span>
                {String(items.length).padStart(2, '0')}
              </p>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-9 xl:col-span-9">
            <div
              ref={trackRef}
              data-page-collection="ecosystem"
              onScroll={syncScrollState}
              className="flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  data-ecosystem-card
                  onClick={() => { if (!editMode) onSelect(item); }}
                  aria-label={`Xem ${item.title}`}
                  aria-disabled={editMode}
                  className="group shrink-0 snap-start flex flex-col rounded-2xl overflow-hidden bg-white border border-slate-100/90 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] hover:shadow-[0_16px_32px_-8px_rgba(15,23,42,0.14)] hover:-translate-y-1 transition-all duration-300 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 w-[85vw] min-w-[85vw] sm:w-[70vw] sm:min-w-[70vw] md:w-[calc((100%-1.25rem)/2)] md:min-w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2*1.25rem)/3)] lg:min-w-[calc((100%-2*1.25rem)/3)]"
                >
                  <span className="relative block h-[340px] sm:h-[370px] lg:h-[390px] w-full overflow-hidden bg-slate-950">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent" aria-hidden="true" />
                    <span className="absolute left-4 top-4 rounded-full bg-orange-600/95 backdrop-blur-xs px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-xs">
                      {item.badge}
                    </span>
                    <span className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                      <span className="line-clamp-3 block text-xs sm:text-sm leading-relaxed text-slate-100/90 font-normal drop-shadow-xs">
                        {item.description}
                      </span>
                    </span>
                  </span>
                  <span className="flex min-h-[72px] items-center justify-between gap-3 px-4 py-3 bg-white">
                    <span className="text-base sm:text-lg font-bold leading-snug tracking-tight text-slate-900 transition-colors group-hover:text-orange-600 line-clamp-2">
                      {item.title}
                    </span>
                    <span className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-700 border border-slate-200/60 shadow-xs transition-colors group-hover:bg-orange-600 group-hover:border-orange-600 group-hover:text-white" aria-hidden="true">
                      <ArrowUpRight className="size-4 sm:size-4.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
