import React, { useState } from 'react';
import { Monitor, Smartphone, Tablet, X } from 'lucide-react';
import { sectionDefinitions } from './pageBuilderData';
import type { PageBuilderPage } from './pageBuilderTypes';

interface PageBuilderPreviewModalProps {
  page: PageBuilderPage | null;
  onClose: () => void;
}

export const PageBuilderPreviewModal: React.FC<PageBuilderPreviewModalProps> = ({ page, onClose }) => {
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  if (!page) return null;
  const width = viewport === 'mobile' ? 'w-[375px]' : viewport === 'tablet' ? 'w-[768px]' : 'w-full max-w-6xl';

  return (
    <div className="fixed inset-0 z-[65] flex flex-col bg-slate-950/90 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-950 px-5 py-3 text-white">
        <div><div className="flex items-center gap-2"><span className="rounded-md bg-amber-500/20 px-2 py-1 text-[10px] font-bold uppercase text-amber-300">Draft preview</span><h2 className="text-sm font-bold">{page.name}</h2></div><p className="mt-1 text-xs text-slate-400">Draft v{page.draft.version} · Nội dung chưa xuất bản</p></div>
        <div className="flex items-center gap-3"><div className="flex rounded-xl border border-slate-700 bg-slate-900 p-1">{([{ id: 'desktop', icon: Monitor }, { id: 'tablet', icon: Tablet }, { id: 'mobile', icon: Smartphone }] as const).map(({ id, icon: Icon }) => <button key={id} onClick={() => setViewport(id)} className={`rounded-lg p-2 ${viewport === id ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'}`} aria-label={id}><Icon className="h-4 w-4" /></button>)}</div><button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white" aria-label="Đóng"><X className="h-5 w-5" /></button></div>
      </div>
      <div className="flex flex-1 justify-center overflow-auto p-4 sm:p-7">
        <div className={`${width} min-h-full overflow-hidden rounded-xl bg-white shadow-2xl transition-all`}>
          <div className="border-b border-slate-200 bg-slate-900 px-6 py-4 text-sm font-bold text-white">CIC TECHNOLOGY</div>
          <main>
            {page.draft.sections.map((section) => {
              const title = typeof section.config.title === 'string' ? section.config.title : sectionDefinitions[section.sectionKey]?.label;
              const subtitle = typeof section.config.subtitle === 'string' ? section.config.subtitle : typeof section.config.description === 'string' ? section.config.description : '';
              const referenceCount = section.references?.reduce((sum, reference) => sum + reference.entityIds.length, 0) ?? 0;
              return <section key={section.id} className="border-b border-slate-100 px-6 py-8 sm:px-10"><span className="text-[10px] font-bold uppercase tracking-widest text-orange-600">{sectionDefinitions[section.sectionKey]?.label}</span><h2 className="mt-2 text-xl font-black text-slate-950 sm:text-2xl">{title}</h2>{subtitle && <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{subtitle}</p>}{referenceCount > 0 && <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">{Array.from({ length: referenceCount }).map((_, index) => <div key={index} className="flex aspect-[4/3] items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-400">Dữ liệu {index + 1}</div>)}</div>}</section>;
            })}
          </main>
        </div>
      </div>
    </div>
  );
};
