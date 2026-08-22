import React, { useState } from 'react';
import { Monitor, Smartphone, Tablet, X } from 'lucide-react';
import { NewsView } from '../../../../web/components/NewsView';
import type { DetailedNewsItem, PublicNewsCategory } from '../../../../web/features/news/types';
import { PublicSitePreviewFooter, PublicSitePreviewHeader } from '../../../components/PublicSitePreviewChrome';
import { ResponsiveWebsitePreviewFrame } from '../../../components/ResponsiveWebsitePreviewFrame';
import type { NewsArticle } from '../types';

interface Props { isOpen: boolean; article: NewsArticle | null; onClose: () => void }

const getCategory = (categoryId: string): PublicNewsCategory => {
  const value = categoryId.toLowerCase();
  if (value.includes('special')) return 'specialty';
  if (value.includes('international')) return 'international';
  if (value.includes('recruit')) return 'recruitment';
  if (value.includes('promotion')) return 'promotion';
  if (value.includes('shareholder')) return 'shareholder';
  return 'company';
};

export const ArticlePreviewModal: React.FC<Props> = ({ isOpen, article, onClose }) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  if (!isOpen || !article) return null;
  const previewNews: DetailedNewsItem = {
    id: `cms-preview-${article.id}`, category: getCategory(article.category_id), title: article.title,
    date: article.start_time || article.created_time, shortDesc: article.summary, img: article.image,
    author: article.author?.name, tags: article.tags, contentMarkdown: article.content,
    gallery: article.image ? [article.image] : [],
    attachments: article.file_upload ? [{ title: 'Tài liệu đính kèm', size: '', url: article.file_upload }] : [],
    relatedArticleIds: article.news_related, relatedProductIds: article.products_related.map((id) => Number(id)).filter(Number.isFinite),
    seoTitle: article.seo_title, seoDesc: article.seo_description, seoKeywords: article.seo_keyword ? article.seo_keyword.split(',').map((item) => item.trim()) : [],
  };
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
          <NewsView previewNews={previewNews} onNavigateHome={() => undefined} />
          <PublicSitePreviewFooter />
        </ResponsiveWebsitePreviewFrame>
      </div>
    </div>
  );
};
