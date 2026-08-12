import React, { useState } from 'react';
import { Monitor, Smartphone, Tablet, X } from 'lucide-react';
import { PageBuilderVisualCanvas } from './PageBuilderVisualCanvas';
import type { PageBuilderPage } from './pageBuilderTypes';

interface PageBuilderPreviewModalProps {
  page: PageBuilderPage | null;
  onClose: () => void;
}

export const PageBuilderPreviewModal: React.FC<PageBuilderPreviewModalProps> = ({ page, onClose }) => {
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  if (!page) return null;

  return (
    <div className="fixed inset-0 z-[65] flex flex-col bg-slate-950/90 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-950 px-5 py-3 text-white">
        <div><div className="flex items-center gap-2"><span className="rounded-md bg-amber-500/20 px-2 py-1 text-[10px] font-bold uppercase text-amber-300">Draft preview</span><h2 className="text-sm font-bold">{page.name}</h2></div><p className="mt-1 text-xs text-slate-400">Draft v{page.draft.version} · Nội dung chưa xuất bản</p></div>
        <div className="flex items-center gap-3"><div className="flex rounded-xl border border-slate-700 bg-slate-900 p-1">{([{ id: 'desktop', icon: Monitor }, { id: 'tablet', icon: Tablet }, { id: 'mobile', icon: Smartphone }] as const).map(({ id, icon: Icon }) => <button key={id} onClick={() => setViewport(id)} className={`rounded-lg p-2 ${viewport === id ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'}`} aria-label={id}><Icon className="h-4 w-4" /></button>)}</div><button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white" aria-label="Đóng"><X className="h-5 w-5" /></button></div>
      </div>
      <div className="flex flex-1 justify-center overflow-auto p-4 sm:p-7">
        <PageBuilderVisualCanvas page={page} sections={page.draft.sections} selectedId="" issueIds={new Set()} viewport={viewport} onSelect={() => undefined} />
      </div>
    </div>
  );
};
