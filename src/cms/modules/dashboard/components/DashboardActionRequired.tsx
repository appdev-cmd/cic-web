import React from 'react';
import { MessageSquare, Sparkles, ChevronRight } from 'lucide-react';
import type { ContactMessage, ProductRegistration, PendingContent } from '../../../types';
import type { CmsLocale } from '../../../data/CmsDataSource';
import { getCmsDictionary } from '../../../i18n/cmsDictionary';

interface DashboardActionRequiredProps {
  contacts: ContactMessage[];
  registrations: ProductRegistration[];
  pendingItems: PendingContent[];
  density?: 'comfortable' | 'compact';
  workspaceLocale: CmsLocale;
  onNavigate: (path: string, title: string) => void;
  onOpenDrawerItem: (type: 'contact' | 'registration' | 'pending' | 'activity', data: any) => void;
}

export const DashboardActionRequired: React.FC<DashboardActionRequiredProps> = ({
  contacts,
  registrations,
  pendingItems,
  density = 'comfortable',
  workspaceLocale,
  onNavigate,
  onOpenDrawerItem,
}) => {
  const dict = getCmsDictionary(workspaceLocale);
  const t = dict.dashboard;
  const isEn = workspaceLocale === 'en';

  const customerRequests = [
    ...contacts.map((item) => ({
      id: item.id,
      kind: 'contact' as const,
      title: item.subject,
      customer: item.sender_name,
      secondary: item.sender_phone,
      status: item.status === 'unread' ? (isEn ? 'Unread' : 'Chưa đọc') : (isEn ? 'Processing' : 'Đang xử lý'),
      createdTime: item.created_time,
      source: item,
    })),
    ...registrations.map((item) => ({
      id: item.id,
      kind: 'registration' as const,
      title: item.product_name,
      customer: item.company_name,
      secondary: item.customer_name,
      status: item.status === 'pending' ? (isEn ? 'Pending Quote' : 'Chờ báo giá') : (isEn ? 'Quoted' : 'Đã báo giá'),
      createdTime: item.created_time,
      source: item,
    })),
  ].sort((a, b) => b.createdTime.localeCompare(a.createdTime));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Block A: Yêu cầu khách hàng hợp nhất */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">{t.customerRequests}</h3>
              <p className="text-[11px] text-slate-400">{t.customerRequestsSubtitle}</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('/cms/customer-requests', isEn ? 'Customer Requests' : 'Yêu cầu khách hàng')}
            className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>{t.viewAll}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/80 flex-1">
          {customerRequests.slice(0, 6).map((request) => (
            <div
              key={`${request.kind}-${request.id}`}
              onClick={() => onOpenDrawerItem(request.kind, request.source)}
              className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl px-2 transition-colors cursor-pointer space-y-1 group ${
                density === 'compact' ? 'py-2' : 'py-3'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs truncate max-w-[200px]">
                  {request.customer}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {request.createdTime ? request.createdTime.split(' ')[0] : ''}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium line-clamp-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                {request.title}
              </p>
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span className="truncate mr-2">{request.secondary}</span>
                <span
                  className={`px-1.5 py-0.5 font-semibold rounded shrink-0 ${
                    request.kind === 'registration'
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                      : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                  }`}
                >
                  {request.status}
                </span>
              </div>
            </div>
          ))}
          {customerRequests.length === 0 && (
            <p className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
              {isEn ? 'No pending customer requests' : 'Không có yêu cầu nào đang chờ xử lý'}
            </p>
          )}
        </div>
      </div>

      {/* Block B: Nội dung mới cập nhật */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                {isEn ? 'Recently Created Content' : 'Nội dung mới cập nhật'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {isEn ? 'Products, news & content drafts' : 'Sản phẩm, Tin tức & Trang nội dung vừa tạo'}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('/cms/news', isEn ? 'News Management' : 'Quản lý Tin tức')}
            className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>{t.viewAll}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/80 flex-1">
          {pendingItems.slice(0, 5).map((item) => (
            <div
              key={item.id}
              onClick={() => onOpenDrawerItem('pending', item)}
              className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl px-2 transition-colors cursor-pointer space-y-1 group ${
                density === 'compact' ? 'py-2' : 'py-3'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs line-clamp-1 flex-1 mr-2">
                  {item.title}
                </span>
                <span className="px-1.5 py-0.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-bold rounded uppercase shrink-0">
                  {item.content_type === 'product'
                    ? (isEn ? 'Product' : 'Sản phẩm')
                    : item.content_type === 'news'
                    ? (isEn ? 'News' : 'Tin tức')
                    : (isEn ? 'Page' : 'Trang nội dung')}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>{isEn ? 'Author' : 'Tác giả'}: {item.author_name}</span>
                <span className={`font-semibold ${item.status === 'published' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>
                  {item.status === 'published' ? (isEn ? 'Published' : 'Đã xuất bản') : (isEn ? 'Draft' : 'Bản nháp')}
                </span>
              </div>
            </div>
          ))}
          {pendingItems.length === 0 && (
            <p className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
              {isEn ? 'No recently drafted content' : 'Không có nội dung nháp nào'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
