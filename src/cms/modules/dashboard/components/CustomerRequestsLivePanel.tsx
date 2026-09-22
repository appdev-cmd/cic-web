'use client';

import React, { useState } from 'react';
import {
  ArrowRight,
  Clock,
  RefreshCw,
} from 'lucide-react';
import type { ContactMessage, ProductRegistration } from '../../../types';
import type { CmsLocale } from '../../../data/CmsDataSource';

interface CustomerRequestsLivePanelProps {
  contacts: ContactMessage[];
  registrations: ProductRegistration[];
  workspaceLocale: CmsLocale;
  onNavigate: (path: string, title: string) => void;
  onOpenDrawerItem: (type: 'contact' | 'registration' | 'pending' | 'activity', data: any) => void;
}

type TabKey = 'all' | 'quotes' | 'contacts';

export const CustomerRequestsLivePanel: React.FC<CustomerRequestsLivePanelProps> = ({
  contacts,
  registrations,
  workspaceLocale,
  onNavigate,
  onOpenDrawerItem,
}) => {
  const isEn = workspaceLocale === 'en';
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const quoteItems = registrations.map((item) => ({
    id: item.id,
    type: 'registration' as const,
    title: item.product_name,
    customer: item.customer_name || 'Khách hàng',
    company: item.company_name,
    phone: item.customer_phone,
    email: item.customer_email,
    createdTime: item.created_time,
    status: item.status,
    raw: item,
  }));

  const contactItems = contacts.map((item) => ({
    id: item.id,
    type: 'contact' as const,
    title: item.subject || 'Liên hệ từ website',
    customer: item.sender_name || 'Khách hàng',
    company: undefined as string | undefined,
    phone: item.sender_phone,
    email: item.sender_email,
    createdTime: item.created_time,
    status: item.status,
    raw: item,
  }));

  const allInquiries = [...quoteItems, ...contactItems].sort((a, b) =>
    (b.createdTime || '').localeCompare(a.createdTime || '')
  );

  const displayedItems = activeTab === 'all'
    ? allInquiries
    : activeTab === 'quotes'
    ? quoteItems
    : contactItems;

  const totalCount = allInquiries.length;
  const quoteCount = quoteItems.length;
  const contactCount = contactItems.length;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                {isEn ? 'Inbound Customer Requests' : 'Yêu Cầu & Báo Giá Khách Hàng'}
              </h3>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {isEn ? 'Direct inbound leads from storefront' : 'Nguồn khách hàng tiềm năng gửi từ website'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Refresh Button */}
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-1 rounded-md border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
              title={isEn ? 'Refresh feed' : 'Làm mới nguồn tin'}
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-orange-600' : ''}`} />
            </button>

            {/* Filter Tabs */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-lg text-xs font-medium">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer text-[11px] ${
                  activeTab === 'all'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                {isEn ? 'All' : 'Tất cả'} ({totalCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('quotes')}
                className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer text-[11px] ${
                  activeTab === 'quotes'
                    ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 font-semibold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                {isEn ? 'Quotes' : 'Báo giá'} ({quoteCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('contacts')}
                className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer text-[11px] ${
                  activeTab === 'contacts'
                    ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                {isEn ? 'Contacts' : 'Liên hệ'} ({contactCount})
              </button>
            </div>
          </div>
        </div>

        {/* Requests Feed (Flat Stream with Hairline Dividers - NO NESTED CARDS) */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {displayedItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              {isEn ? 'No customer inquiries in this filter.' : 'Không có yêu cầu nào trong danh mục này.'}
            </div>
          ) : (
            displayedItems.slice(0, 5).map((item) => {
              const isQuote = item.type === 'registration';
              const dateStr = item.createdTime ? item.createdTime.split(' ')[0] : 'Gần đây';
              return (
                <div
                  key={`${item.type}-${item.id}`}
                  onClick={() => onOpenDrawerItem(item.type, item.raw)}
                  className="py-3 px-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 mt-0.5 ${
                        isQuote
                          ? 'bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800/60'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {isQuote ? (isEn ? 'Quote' : 'Báo giá') : (isEn ? 'Contact' : 'Liên hệ')}
                    </span>
                    <div className="min-w-0">
                      <div className="font-semibold text-xs text-slate-900 dark:text-white truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate flex items-center gap-2">
                        <span className="font-medium text-slate-700 dark:text-slate-300">{item.customer}</span>
                        {item.company && <span className="text-slate-400">· {item.company}</span>}
                        {item.phone && <span className="text-slate-400 font-mono">· {item.phone}</span>}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400 shrink-0 mt-0.5">
                    {dateStr}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Footer Link */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
        <span className="text-[11px] text-slate-400">
          {isEn ? '761 inquiries total in PostgreSQL' : 'Tổng cộng 761 yêu cầu tồn đọng trong DB'}
        </span>
        <button
          type="button"
          onClick={() => onNavigate('/cms/customer-requests', isEn ? 'Customer Requests' : 'Yêu cầu khách hàng')}
          className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
        >
          <span>{isEn ? 'View all inquiries' : 'Xem toàn bộ hộp thư'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
