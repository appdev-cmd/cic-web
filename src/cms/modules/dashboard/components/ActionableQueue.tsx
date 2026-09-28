'use client';

import React from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileEdit,
  Image as ImageIcon,
  Search,
  Sparkles,
} from 'lucide-react';
import type { CmsDashboardData, CmsLocale } from '../../../data/CmsDataSource';

interface ActionableQueueProps {
  data: CmsDashboardData;
  workspaceLocale: CmsLocale;
  onNavigate: (path: string, title: string) => void;
  onOpenHealthDrawer?: () => void;
}

interface ActionTask {
  id: string;
  priority: 'urgent' | 'high' | 'medium' | 'normal' | 'resolved';
  title: string;
  count: number;
  description: string;
  ctaText: string;
  actionPath: string;
  actionTitle: string;
}

export const ActionableQueue: React.FC<ActionableQueueProps> = ({
  data,
  workspaceLocale,
  onNavigate,
}) => {
  const isEn = workspaceLocale === 'en';

  const unprocessedQuotes = data.kpi?.unprocessed_registrations ?? 0;
  const unprocessedContacts = data.kpi?.unprocessed_contacts ?? 0;
  const totalInquiries = unprocessedQuotes + unprocessedContacts;

  const prodMissingSeo = data.health?.items?.find((i) => i.id === 'product_seo')?.count ?? 0;
  const prodMissingImg = data.health?.items?.find((i) => i.id === 'product_media')?.count ?? 0;
  const newsMissingSeo = data.health?.items?.find((i) => i.id === 'news_seo')?.count ?? 0;

  const topDraft = (data.pendingContents ?? []).find((i) => i.status !== 'published');

  const tasks: ActionTask[] = [
    // 1. SLA Customer Inquiries Backlog
    totalInquiries > 0
      ? {
          id: 'task-sla',
          priority: 'urgent',
          title: isEn ? 'Customer Inquiries & Quote Requests Backlog' : 'Tồn đọng yêu cầu báo giá & liên hệ khách hàng',
          count: totalInquiries,
          description: isEn
            ? `${unprocessedQuotes} quote requests and ${unprocessedContacts} contact messages awaiting official response.`
            : `${unprocessedQuotes} yêu cầu báo giá sản phẩm và ${unprocessedContacts} tin nhắn liên hệ cần phản hồi.`,
          ctaText: isEn ? 'Process Now →' : 'Xử lý ngay →',
          actionPath: '/cms/customer-requests',
          actionTitle: isEn ? 'Customer Requests' : 'Yêu cầu khách hàng',
        }
      : {
          id: 'task-sla-clear',
          priority: 'resolved',
          title: isEn ? 'Customer Inquiries Queue Cleared' : 'Hàng đợi yêu cầu khách hàng đã xử lý xong',
          count: 0,
          description: isEn
            ? 'All inbound customer inquiries and quote requests have been processed on time.'
            : 'Toàn bộ yêu cầu khách hàng và báo giá đã được xử lý đúng hạn, không có tồn đọng SLA.',
          ctaText: isEn ? 'View Requests →' : 'Xem yêu cầu →',
          actionPath: '/cms/customer-requests',
          actionTitle: isEn ? 'Customer Requests' : 'Yêu cầu khách hàng',
        },

    // 2. Products Missing SEO Description
    {
      id: 'task-seo-prods',
      priority: prodMissingSeo > 0 ? 'high' : 'resolved',
      title: isEn ? 'Products Missing Meta SEO Description' : 'Sản phẩm chưa có thẻ mô tả SEO',
      count: prodMissingSeo,
      description: isEn
        ? 'Products without meta description impact search discovery and Google SERP rank.'
        : 'Chưa có tóm tắt meta description, ảnh hưởng trực tiếp đến thứ hạng tìm kiếm Google.',
      ctaText: isEn ? 'Add SEO →' : 'Bổ sung SEO →',
      actionPath: '/cms/products',
      actionTitle: isEn ? 'Product Management' : 'Quản lý Sản phẩm',
    },

    // 3. Products Missing Featured Image
    {
      id: 'task-media-prods',
      priority: prodMissingImg > 0 ? 'medium' : 'resolved',
      title: isEn ? 'Products Missing Cover Image' : 'Sản phẩm chưa có ảnh đại diện',
      count: prodMissingImg,
      description: isEn
        ? 'Showing fallback placeholder thumbnails on public catalog, requires real product media.'
        : 'Đang hiển thị hình mặc định ngoài website, cần tải lên hình ảnh sản phẩm chính thức.',
      ctaText: isEn ? 'Upload Media →' : 'Thêm ảnh SP →',
      actionPath: '/cms/products',
      actionTitle: isEn ? 'Product Management' : 'Quản lý Sản phẩm',
    },

    // 4. News Missing SEO Description
    {
      id: 'task-seo-news',
      priority: newsMissingSeo > 0 ? 'medium' : 'resolved',
      title: isEn ? 'News Articles Without Meta Description' : 'Bài viết tin tức thiếu mô tả tóm tắt SEO',
      count: newsMissingSeo,
      description: isEn
        ? 'Needs optimized manual snippet to improve Google organic search CTR.'
        : 'Cần bổ sung đoạn trích dẫn chuẩn SEO để tối ưu tỷ lệ click tìm kiếm tự nhiên.',
      ctaText: isEn ? 'Optimize News →' : 'Tối ưu bài viết →',
      actionPath: '/cms/news',
      actionTitle: isEn ? 'News Management' : 'Quản lý Tin tức',
    },

    // 5. Draft in Progress (if any)
    ...(topDraft
      ? [
          {
            id: `task-draft-${topDraft.id}`,
            priority: 'normal' as const,
            title: isEn ? `Draft in progress: ${topDraft.title}` : `Bản nháp đang soạn: ${topDraft.title}`,
            count: 1,
            description: isEn
              ? `Authored by ${topDraft.author_name} · Last saved at ${topDraft.created_time}`
              : `Biên tập viên: ${topDraft.author_name} · Lưu lúc ${topDraft.created_time}`,
            ctaText: isEn ? 'Continue Editing →' : 'Tiếp tục sửa →',
            actionPath: topDraft.content_type === 'product' ? '/cms/products' : '/cms/news',
            actionTitle: topDraft.content_type === 'product' ? 'Sản phẩm' : 'Tin tức',
          },
        ]
      : []),
  ];

  const getPriorityMeta = (priority: ActionTask['priority']) => {
    switch (priority) {
      case 'urgent':
        return {
          label: isEn ? 'Urgent SLA' : 'Cấp thiết',
          badgeClass: 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/80',
          dotClass: 'bg-red-500',
        };
      case 'high':
        return {
          label: isEn ? 'High' : 'Ưu tiên cao',
          badgeClass: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/80',
          dotClass: 'bg-amber-500',
        };
      case 'medium':
        return {
          label: isEn ? 'Medium' : 'Trung bình',
          badgeClass: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
          dotClass: 'bg-slate-400',
        };
      case 'normal':
        return {
          label: isEn ? 'Draft' : 'Bản nháp',
          badgeClass: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700',
          dotClass: 'bg-slate-300 dark:bg-slate-600',
        };
      case 'resolved':
      default:
        return {
          label: isEn ? 'Optimal' : 'Đã tối ưu',
          badgeClass: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/80',
          dotClass: 'bg-emerald-500',
        };
    }
  };

  const activeIssuesCount = tasks.filter((t) => t.priority !== 'resolved' && t.count > 0).length;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
              {isEn ? 'Action Required Queue' : 'Hàng Đợi Cần Xử Lý'}
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800/60">
              {activeIssuesCount} {isEn ? 'tasks active' : 'việc cần làm'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {isEn
              ? 'Priority operational tasks to maintain website SLA, SEO health, and catalog quality.'
              : 'Tác vụ ưu tiên để đảm bảo SLA phản hồi khách hàng, chất lượng SEO và danh mục.'}
          </p>
        </div>

        <span className="text-[11px] text-slate-400 font-mono self-start sm:self-auto">
          {isEn ? 'Top 5 Actionable Items' : '5 việc ưu tiên hàng đầu'}
        </span>
      </div>

      {/* Task Queue List (Flat, clean, highly actionable) */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
        {tasks.map((task) => {
          const meta = getPriorityMeta(task.priority);
          return (
            <div
              key={task.id}
              onClick={() => onNavigate(task.actionPath, task.actionTitle)}
              className="p-3.5 px-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              {/* Task Details */}
              <div className="flex items-start gap-3 min-w-0">
                <span className={`w-2 h-2 rounded-full ${meta.dotClass} shrink-0 mt-1.5`} />

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold border ${meta.badgeClass}`}>
                      {meta.label}
                    </span>

                    <h4 className="font-semibold text-xs text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      {task.title}
                    </h4>

                    {task.count > 0 && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {task.count}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                    {task.description}
                  </p>
                </div>
              </div>

              {/* Direct CTA Button */}
              <div className="shrink-0 self-end md:self-auto">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(task.actionPath, task.actionTitle);
                  }}
                  className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/90 hover:bg-orange-600 hover:text-white dark:hover:bg-orange-600 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all shadow-2xs group-hover:border-orange-500 cursor-pointer"
                >
                  <span>{task.ctaText}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
