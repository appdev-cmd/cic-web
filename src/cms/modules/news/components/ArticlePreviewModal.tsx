import React, { useState } from 'react';
import { CalendarDays, Download, Monitor, Smartphone, Tablet, X } from 'lucide-react';
import { PublicSitePreviewFooter, PublicSitePreviewHeader } from '../../../components/PublicSitePreviewChrome';
import { ResponsiveWebsitePreviewFrame } from '../../../components/ResponsiveWebsitePreviewFrame';
import type { NewsArticle } from '../types';

interface Props { isOpen: boolean; article: NewsArticle | null; onClose: () => void }

const displayDate = (value?: string) => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? value : new Intl.DateTimeFormat('vi-VN').format(date);
};

export const ArticlePreviewModal: React.FC<Props> = ({ isOpen, article, onClose }) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  if (!isOpen || !article) return null;

  return (
    <div className="fixed inset-0 z-[90] flex flex-col bg-slate-950/85" role="dialog" aria-modal="true" aria-label="Xem trước bài viết">
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-700 bg-slate-900 px-5 text-white">
        <div><p className="text-xs font-bold">Xem trước trên Website</p><p className="text-[10px] text-slate-400">/tin-tuc/{article.alias}</p></div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg bg-slate-800 p-1">{([['desktop', Monitor], ['tablet', Tablet], ['mobile', Smartphone]] as const).map(([value, Icon]) => <button key={value} type="button" onClick={() => setDevice(value)} className={`rounded-md p-1.5 ${device === value ? 'bg-orange-600' : 'text-slate-400'}`} aria-label={`Xem ${value}`}><Icon className="size-4" /></button>)}</div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 hover:bg-slate-800" aria-label="Đóng xem trước"><X className="size-5" /></button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto overscroll-contain bg-slate-800 p-5">
        <ResponsiveWebsitePreviewFrame device={device}>
          <PublicSitePreviewHeader view="news" />
          <main className="bg-white px-5 py-10 text-slate-900 sm:px-8 lg:px-12">
            <article className="mx-auto max-w-4xl">
              <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-orange-600"><CalendarDays className="size-4" />{displayDate(article.start_time || article.created_time)}</p>
              <h1 className="text-3xl font-black leading-tight sm:text-4xl">{article.title}</h1>
              {article.summary && <p className="mt-5 border-l-4 border-orange-500 pl-4 text-base leading-7 text-slate-600">{article.summary}</p>}
              {article.image && <img src={article.image} alt={article.title} className="mt-7 aspect-video w-full rounded-2xl object-cover" />}
              <div className="ck-content mt-8 leading-7" dangerouslySetInnerHTML={{ __html: article.content }} />
              {article.video && <div className="mt-8 aspect-video overflow-hidden rounded-2xl [&_iframe]:h-full [&_iframe]:w-full" dangerouslySetInnerHTML={{ __html: article.video }} />}
              {article.file_upload && <a href={article.file_upload} className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-sm font-bold text-white"><Download className="size-4" />Tải tài liệu đính kèm</a>}
              {article.tags?.length > 0 && <div className="mt-8 flex flex-wrap gap-2">{article.tags.map((tag) => <span key={tag} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">#{tag}</span>)}</div>}
            </article>
          </main>
          <PublicSitePreviewFooter />
        </ResponsiveWebsitePreviewFrame>
      </div>
    </div>
  );
};
