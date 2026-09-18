import React from 'react';
import { Clock, Package, Newspaper, FileText, MessageSquare, FileCheck, ChevronRight } from 'lucide-react';
import type { ContactMessage, ProductRegistration, PendingContent } from '../../../types';
import type { CmsLocale } from '../../../data/CmsDataSource';
import { getCmsDictionary } from '../../../i18n/cmsDictionary';

interface DashboardCurrentWorkProps {
  contacts: ContactMessage[];
  registrations: ProductRegistration[];
  pendingItems: PendingContent[];
  workspaceLocale: CmsLocale;
  onNavigate: (path: string, title: string) => void;
}

export const DashboardCurrentWork: React.FC<DashboardCurrentWorkProps> = ({
  contacts,
  registrations,
  pendingItems,
  workspaceLocale,
  onNavigate,
}) => {
  const dict = getCmsDictionary(workspaceLocale);
  const t = dict.dashboard;

  const currentWork = [
    ...pendingItems
      .filter((item) => item.status !== 'published')
      .map((item) => ({
        id: item.id,
        title: item.title,
        meta: `${item.author_name} · ${t.draft}`,
        time: item.created_time,
        icon: item.content_type === 'product' ? Package : item.content_type === 'news' ? Newspaper : FileText,
        tone: 'slate',
        path: item.content_type === 'product' ? '/cms/products' : item.content_type === 'news' ? '/cms/news' : '/cms/static-pages',
        moduleName: item.content_type === 'product'
          ? (workspaceLocale === 'en' ? 'Products' : 'Sản phẩm')
          : item.content_type === 'news'
          ? (workspaceLocale === 'en' ? 'News' : 'Tin tức')
          : (workspaceLocale === 'en' ? 'Content Pages' : 'Trang nội dung'),
      })),
    ...contacts
      .filter((item) => item.status === 'unread' || item.status === 'processing')
      .map((item) => ({
        id: item.id,
        title: item.subject,
        meta: `${item.sender_name} · ${item.status === 'unread' ? t.unread : t.processing}`,
        time: item.created_time,
        icon: MessageSquare,
        tone: item.status === 'unread' ? 'red' : 'orange',
        path: '/cms/customer-requests',
        moduleName: workspaceLocale === 'en' ? 'Customer Requests' : 'Yêu cầu khách hàng',
      })),
    ...registrations
      .filter((item) => item.status === 'pending')
      .map((item) => ({
        id: item.id,
        title: `${workspaceLocale === 'en' ? 'Quote Request' : 'Báo giá'} ${item.product_name}`,
        meta: `${item.customer_name} · ${item.company_name}`,
        time: item.created_time,
        icon: FileCheck,
        tone: 'amber',
        path: '/cms/customer-requests',
        moduleName: workspaceLocale === 'en' ? 'Customer Requests' : 'Yêu cầu khách hàng',
      })),
  ]
    .sort((a, b) => b.time.localeCompare(a.time))
    .slice(0, 6);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-orange-500/10 p-2 text-orange-600 dark:text-orange-400">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t.currentWork}</h3>
            <p className="text-[11px] text-slate-400">{t.currentWorkSubtitle}</p>
          </div>
        </div>
        <span className="shrink-0 rounded-lg bg-orange-50 px-2 py-1 text-[11px] font-bold text-orange-700 dark:bg-orange-950/30 dark:text-orange-300">
          {currentWork.length} {t.recentItems}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
        {currentWork.map((work) => {
          const IconComponent = work.icon;
          const toneClass =
            work.tone === 'red'
              ? 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400'
              : work.tone === 'amber'
              ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400'
              : work.tone === 'orange'
              ? 'bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400'
              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300';

          return (
            <button
              key={`${work.moduleName}-${work.id}`}
              onClick={() => onNavigate(work.path, work.moduleName)}
              className="group flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-3 text-left transition-all hover:border-orange-400 hover:bg-orange-50/30 dark:border-slate-800 dark:hover:bg-orange-950/10 cursor-pointer min-h-[44px]"
            >
              <span className={`rounded-lg p-2 shrink-0 ${toneClass}`}>
                <IconComponent className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-bold text-slate-800 group-hover:text-orange-700 dark:text-slate-100 dark:group-hover:text-orange-300">
                  {work.title}
                </span>
                <span className="mt-0.5 block truncate text-[10px] text-slate-500 dark:text-slate-400">
                  {work.meta}
                </span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 group-hover:text-orange-500 transition-colors" />
            </button>
          );
        })}
        {currentWork.length === 0 && (
          <p className="col-span-full rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
            {t.noCurrentWork}
          </p>
        )}
      </div>
    </div>
  );
};
