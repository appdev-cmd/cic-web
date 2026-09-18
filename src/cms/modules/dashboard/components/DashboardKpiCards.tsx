import React from 'react';
import { Package, Newspaper, FileText, CalendarDays, MessageSquare } from 'lucide-react';
import type { KpiStats } from '../../../types';
import type { CmsLocale } from '../../../data/CmsDataSource';
import { getCmsDictionary } from '../../../i18n/cmsDictionary';

interface DashboardKpiCardsProps {
  kpi: KpiStats;
  workspaceLocale: CmsLocale;
  onNavigate: (path: string, title: string) => void;
}

export const DashboardKpiCards: React.FC<DashboardKpiCardsProps> = ({
  kpi,
  workspaceLocale,
  onNavigate,
}) => {
  const dict = getCmsDictionary(workspaceLocale);
  const t = dict.dashboard;

  const cards = [
    {
      id: 'products',
      title: t.kpiProducts,
      subtitle: t.kpiActive,
      count: kpi.published_products,
      icon: Package,
      color: 'orange',
      path: '/cms/products',
      pageTitle: workspaceLocale === 'en' ? 'Product Management' : 'Quản lý Sản phẩm',
    },
    {
      id: 'news',
      title: t.kpiNews,
      subtitle: t.kpiPublished,
      count: kpi.published_news,
      icon: Newspaper,
      color: 'orange',
      path: '/cms/news',
      pageTitle: workspaceLocale === 'en' ? 'News Management' : 'Quản lý Tin tức',
    },
    {
      id: 'static_pages',
      title: t.kpiStaticPages,
      subtitle: t.kpiActive,
      count: kpi.static_pages,
      icon: FileText,
      color: 'purple',
      path: '/cms/static-pages',
      pageTitle: workspaceLocale === 'en' ? 'Content Pages' : 'Quản lý Trang nội dung',
    },
    {
      id: 'events',
      title: t.kpiEvents,
      subtitle: t.kpiUpcoming,
      count: kpi.upcoming_events,
      icon: CalendarDays,
      color: 'emerald',
      path: '/cms/events?progress=upcoming',
      pageTitle: workspaceLocale === 'en' ? 'Upcoming Events' : 'Sự kiện sắp diễn ra',
    },
    {
      id: 'requests',
      title: t.kpiCustomerRequests,
      subtitle: t.kpiRequestsPending,
      count: kpi.unprocessed_contacts + kpi.unprocessed_registrations,
      icon: MessageSquare,
      color: 'red',
      path: '/cms/customer-requests',
      pageTitle: workspaceLocale === 'en' ? 'Customer Requests' : 'Yêu cầu khách hàng',
      badge: t.kpiActionRequired,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5">
      {cards.map((card) => {
        const IconComponent = card.icon;
        const isRed = card.color === 'red';
        const isPurple = card.color === 'purple';
        const isEmerald = card.color === 'emerald';

        const hoverBorder = isRed
          ? 'hover:border-red-500'
          : isPurple
          ? 'hover:border-purple-500/50'
          : isEmerald
          ? 'hover:border-emerald-500/50'
          : 'hover:border-orange-500/50';

        const iconBg = isRed
          ? 'bg-red-500/10 text-red-600 dark:text-red-400'
          : isPurple
          ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
          : isEmerald
          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
          : 'bg-orange-500/10 text-orange-600 dark:text-orange-400';

        return (
          <div
            key={card.id}
            onClick={() => onNavigate(card.path, card.pageTitle)}
            className={`bg-white dark:bg-slate-900 border ${
              isRed ? 'border-red-200 dark:border-red-900/50' : 'border-slate-200/80 dark:border-slate-800'
            } rounded-2xl p-4 shadow-xs ${hoverBorder} transition-all cursor-pointer flex flex-col justify-between group min-h-[110px]`}
          >
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
              <span className="truncate mr-2">{card.title}</span>
              <div className={`p-1.5 rounded-xl ${iconBg} group-hover:scale-110 transition-transform shrink-0`}>
                <IconComponent className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline justify-between gap-2">
                <span className={`text-2xl font-black ${isRed ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                  {card.count}
                </span>
                {card.badge && card.count > 0 && (
                  <span className="px-1.5 py-0.5 bg-red-500/10 text-red-600 border border-red-500/20 text-[10px] font-bold rounded animate-pulse shrink-0">
                    {card.badge}
                  </span>
                )}
              </div>
              <p className={`text-[11px] mt-0.5 ${isRed ? 'text-red-500 font-semibold' : 'text-slate-400'}`}>
                {card.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
