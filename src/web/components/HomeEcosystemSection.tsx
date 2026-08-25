import React, { useRef, useState } from 'react';
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
  items: readonly HomeEcosystemItem[];
  editMode?: boolean;
  onSelect: (item: HomeEcosystemItem) => void;
}

export const HomeEcosystemSection: React.FC<HomeEcosystemSectionProps> = ({ items, editMode = false, onSelect }) => {
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

  const move = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>('[data-ecosystem-card]');
    const gap = Number.parseFloat(window.getComputedStyle(track).columnGap || '20');
    const step = (card?.getBoundingClientRect().width ?? track.clientWidth * 0.82) + gap;
    track.scrollBy({ left: direction * step, behavior: 'smooth' });
  };

  return (
    <section data-page-builder-section-key="home.ecosystem" id="solutions" className="relative scroll-mt-24 overflow-hidden bg-white py-14 text-slate-950 sm:py-16 lg:scroll-mt-28 lg:py-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="grid items-start gap-9 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <h2 className="max-w-md text-3xl font-black uppercase leading-[1.08] tracking-tighter text-slate-950 sm:text-4xl lg:text-5xl">
              Hệ sinh thái Công nghệ CIC
            </h2>
            <div aria-hidden="true" className="my-5 h-1 w-14 rounded-full bg-orange-600" />
            <p className="max-w-md text-base leading-7 text-slate-600">
              Phần mềm, thiết bị, AI, BIM, Digital Twins cùng năng lực tư vấn và đào tạo chuyên sâu trong một hệ sinh thái công nghệ thống nhất.
            </p>

            <div className="mt-7 flex items-center gap-4 sm:mt-9">
              <div className="flex gap-2.5">
                <button type="button" onClick={() => move(-1)} disabled={!canScrollLeft} className="flex size-11 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-800 shadow-sm transition-colors hover:border-slate-950 hover:bg-slate-950 hover:text-white disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-300" aria-label="Xem giải pháp trước">
                  <ChevronLeft className="size-5" />
                </button>
                <button type="button" onClick={() => move(1)} disabled={!canScrollRight} className="flex size-11 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-800 shadow-sm transition-colors hover:border-slate-950 hover:bg-slate-950 hover:text-white disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-300" aria-label="Xem giải pháp tiếp theo">
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

          <div className="min-w-0 lg:col-span-8">
            <div ref={trackRef} onScroll={syncScrollState} className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-5" style={{ WebkitOverflowScrolling: 'touch' }}>
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  data-ecosystem-card
                  onClick={() => { if (!editMode) onSelect(item); }}
                  aria-label={`Xem ${item.title}`}
                  aria-disabled={editMode}
                  className="group w-[82vw] max-w-[390px] shrink-0 snap-start rounded-[10px] border border-slate-200/80 bg-slate-100 p-2 text-left shadow-[0_6px_24px_-12px_rgba(15,23,42,0.18)] transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_18px_38px_-18px_rgba(15,23,42,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 sm:w-[350px] lg:w-[380px]"
                >
                  <span className="relative block h-[350px] overflow-hidden rounded-[8px] bg-slate-900 sm:h-[390px] lg:h-[410px]">
                    <img src={item.image} alt="" loading="lazy" className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.035]" />
                    <span className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-transparent" aria-hidden="true" />
                    <span className="absolute left-4 top-4 rounded-full bg-orange-600 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white shadow-sm">
                      {item.badge}
                    </span>
                    <span className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                      <span className="line-clamp-4 block text-sm leading-6 text-slate-100 drop-shadow-sm">
                        {item.description}
                      </span>
                    </span>
                  </span>
                  <span className="flex min-h-20 items-center justify-between gap-3 px-3 py-3 sm:px-4">
                    <span className="text-lg font-black leading-tight tracking-tight text-slate-950 transition-colors group-hover:text-orange-600 sm:text-xl">
                      {item.title}
                    </span>
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-slate-900 shadow-sm transition-colors group-hover:bg-slate-950 group-hover:text-white" aria-hidden="true">
                      <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
