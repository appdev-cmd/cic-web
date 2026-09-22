'use client';

import React, { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileEdit,
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
  Mail,
  Search,
  Sparkles,
} from 'lucide-react';
import type { CmsDashboardData, CmsLocale } from '../../../data/CmsDataSource';

interface ActionableQueueProps {
  data: CmsDashboardData;
  workspaceLocale: CmsLocale;
  onNavigate: (path: string, title: string) => void;
  onOpenHealthDrawer: () => void;
}

interface ActionQueueItem {
  id: string;
  category: 'sla' | 'seo' | 'media' | 'draft';
  severity: 'urgent' | 'high' | 'medium' | 'normal';
  title: string;
  description: string;
  count?: number;
  badgeLabel: string;
  actionText: string;
  actionPath: string;
  actionTitle: string;
}

export const ActionableQueue: React.FC<ActionableQueueProps> = ({
  data,
  workspaceLocale,
  onNavigate,
}) => {
  const isEn = workspaceLocale === 'en';
  const [filter, setFilter] = useState<'all' | 'sla' | 'seo' | 'draft'>('all');

  const unprocessedQuotes = data.kpi?.unprocessed_registrations ?? 705;
  const unprocessedContacts = data.kpi?.unprocessed_contacts ?? 56;
  const totalInquiries = unprocessedQuotes + unprocessedContacts;

  const draftItems = (data.pendingContents ?? []).filter((i) => i.status !== 'published');

  const items: ActionQueueItem[] = [
    {
      id: 'sla-inquiries',
      category: 'sla',
      severity: 'urgent',
      title: isEn ? 'Customer Inquiries & Quote Requests Backlog' : 'Tồn đọng yêu cầu báo giá & liên hệ khách hàng',
      description: isEn
        ? `${unprocessedQuotes} quote requests and ${unprocessedContacts} contact messages awaiting official response.`
        : `${unprocessedQuotes} yêu cầu báo giá sản phẩm và ${unprocessedContacts} tin nhắn liên hệ cần phản hồi cho đối tác.`,
      count: totalInquiries,
      badgeLabel: isEn ? 'Urgent SLA' : 'Cấp thiết SLA',
      actionText: isEn ? 'Process Inquiries' : 'Xử lý ngay',
      actionPath: '/cms/customer-requests',
      actionTitle: isEn ? 'Customer Requests' : 'Yêu cầu khách hàng',
    },
    {
      id: 'seo-products',
      category: 'seo',
      severity: 'high',
      title: isEn ? 'Products Missing SEO Meta Description' : '39 Sản phẩm thiếu thẻ mô tả SEO & từ khóa',
      description: isEn
        ? 'Products without meta description impact Google SERP indexing and search discovery.'
        : 'Chưa có tóm tắt meta description, ảnh hưởng trực tiếp đến thứ hạng tìm kiếm Google.',
      count: 39,
      badgeLabel: isEn ? 'High Priority' : 'Ưu tiên cao',
      actionText: isEn ? 'Update SEO' : 'Bổ sung SEO',
      actionPath: '/cms/products',
      actionTitle: isEn ? 'Product Management' : 'Quản lý Sản phẩm',
    },
    {
      id: 'media-products',
      category: 'media',
      severity: 'medium',
      title: isEn ? 'Products Missing Featured Images' : '21 Sản phẩm chưa có hình ảnh đại diện',
      description: isEn
        ? 'Missing thumbnail images lowers product presentation quality on storefront catalog.'
        : 'Sản phẩm hiển thị hình mặc định (placeholder), cần tải lên hình ảnh sản phẩm chính thức.',
      count: 21,
      badgeLabel: isEn ? 'Visual Quality' : 'Bổ sung ảnh',
      actionText: isEn ? 'Upload Media' : 'Thêm ảnh SP',
      actionPath: '/cms/products',
      actionTitle: isEn ? 'Product Management' : 'Quản lý Sản phẩm',
    },
    {
      id: 'seo-news',
      category: 'seo',
      severity: 'medium',
      title: isEn ? 'News Articles Without Meta Description' : '369 Bài viết tin tức thiếu mô tả tóm tắt SEO',
      description: isEn
        ? 'Search engines generate snippets automatically; manual SEO summary improves search CTR.'
        : 'Cần bổ sung trích đoạn mô tả chuẩn SEO để tối ưu tỷ lệ click tìm kiếm tự nhiên.',
      count: 369,
      badgeLabel: isEn ? 'SEO Optimize' : 'Tối ưu SEO',
      actionText: isEn ? 'Review News' : 'Duyệt bài viết',
      actionPath: '/cms/news',
      actionTitle: isEn ? 'News Management' : 'Quản lý Tin tức',
    },
    ...(draftItems.length > 0
      ? draftItems.slice(0, 2).map((draft) => ({
          id: `draft-${draft.id}`,
          category: 'draft' as const,
          severity: 'normal' as const,
          title: `${isEn ? 'Draft in progress:' : 'Bản nháp đang soạn:'} ${draft.title}`,
          description: isEn
            ? `Authored by ${draft.author_name} · Last updated ${draft.created_time}`
            : `Biên tập viên: ${draft.author_name} · Cập nhật gần nhất lúc ${draft.created_time}`,
          badgeLabel: isEn ? 'Draft' : 'Bản nháp',
          actionText: isEn ? 'Continue Editing' : 'Tiếp tục sửa',
          actionPath: draft.content_type === 'product' ? '/cms/products' : draft.content_type === 'news' ? '/cms/news' : '/cms/static-pages',
          actionTitle: draft.content_type === 'product' ? 'Sản phẩm' : draft.content_type === 'news' ? 'Tin tức' : 'Trang nội dung',
        }))
      : []),
  ];

  const filteredItems = items.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'sla') return item.category === 'sla';
    if (filter === 'seo') return item.category === 'seo' || item.category === 'media';
    if (filter === 'draft') return item.category === 'draft';
    return true;
  });

  const getSeverityStyle = (sev: ActionQueueItem['severity']) => {
    switch (sev) {
      case 'urgent':
        return {
          bar: 'bg-red-500',
          badge: 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/80',
        };
      case 'high':
        return {
          bar: 'bg-amber-500',
          badge: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/80',
        };
      case 'medium':
        return {
          bar: 'bg-slate-400 dark:bg-slate-500',
          badge: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
        };
      default:
        return {
          bar: 'bg-slate-300 dark:bg-slate-700',
          badge: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700',
        };
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
              {isEn ? 'Prioritized Action Queue' : 'Hàng Đợi Cần Xử Lý'}
            </h3>
            <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
              {items.length} {isEn ? 'tasks' : 'tác vụ'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {isEn
              ? 'Operational tasks prioritized by urgency and service impact'
              : 'Tác vụ vận hành ưu tiên theo mức độ khẩn cấp và ảnh hưởng dịch vụ'}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-lg self-start sm:self-auto text-xs font-medium">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer text-xs ${
              filter === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-2xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            {isEn ? 'All' : 'Tất cả'} ({items.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('sla')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer text-xs ${
              filter === 'sla'
                ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 font-semibold shadow-2xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            {isEn ? 'SLA Queue' : 'Yêu cầu SLA'}
          </button>
          <button
            type="button"
            onClick={() => setFilter('seo')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer text-xs ${
              filter === 'seo'
                ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 font-semibold shadow-2xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            {isEn ? 'SEO & Media' : 'SEO & Ảnh'}
          </button>
          <button
            type="button"
            onClick={() => setFilter('draft')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer text-xs ${
              filter === 'draft'
                ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold shadow-2xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            {isEn ? 'Drafts' : 'Bản nháp'}
          </button>
        </div>
      </div>

      {/* Action Items List (Tabular Rows with Hairline Dividers - NO NESTED CARDS) */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
        {filteredItems.map((item) => {
          const style = getSeverityStyle(item.severity);
          return (
            <div
              key={item.id}
              className="py-3 px-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group relative"
            >
              {/* Left subtle priority indicator line */}
              <div className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-xs ${style.bar}`} />

              <div className="min-w-0 pl-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">
                    {item.title}
                  </span>
                  <span
                    className={`px-2 py-0.2 rounded text-[10px] font-bold border uppercase tracking-wider ${style.badge}`}
                  >
                    {item.badgeLabel}
                  </span>
                  {item.count !== undefined && (
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {item.count}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1 sm:line-clamp-none">
                  {item.description}
                </p>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => onNavigate(item.actionPath, item.actionTitle)}
                className="self-end sm:self-auto shrink-0 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-orange-600 dark:hover:bg-orange-600 text-slate-700 dark:text-slate-200 hover:text-white dark:hover:text-white border border-slate-200 dark:border-slate-700 rounded-md text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>{item.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
