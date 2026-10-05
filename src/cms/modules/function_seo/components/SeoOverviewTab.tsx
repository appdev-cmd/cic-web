import React, { useMemo } from 'react';
import { AlertTriangle, Edit3, ExternalLink, FileText, Info, Map } from 'lucide-react';
import { CmsButton } from '@/shared/ui/cms/CmsButton';
import type { FunctionSeoRecord, SeoHealthMetrics, SeoWarningItem } from '@/features/function-seo/types';

export interface SeoOverviewTabProps {
  records: FunctionSeoRecord[];
  metrics?: SeoHealthMetrics;
  onOpenTemplates: (filter?: 'all' | 'noindex' | 'missing-description' | 'missing-owner') => void;
  onOpenRedirects: () => void;
  onNavigate: (href: string) => void;
  onEditDirect?: (recordId: string) => void;
}

export function SeoOverviewTab({
  records,
  metrics,
  onOpenTemplates,
  onOpenRedirects,
  onNavigate,
  onEditDirect,
}: SeoOverviewTabProps) {
  const totalPages = metrics?.totalPages ?? records.length;
  const noindexCount = records.filter((r) => !r.indexable).length;
  const missingDescription = records.filter((r) => !r.description.trim()).length;
  const missingTitles = records.filter((r) => !r.title.trim()).length;

  const activeWarnings = useMemo(() => {
    const baseWarnings = metrics?.warnings ?? [];
    if (!baseWarnings || baseWarnings.length === 0) {
      const generated: SeoWarningItem[] = [];
      for (const r of records) {
        const issues: string[] = [];
        if (!r.title.trim()) issues.push('Chưa cấu hình Tiêu đề SEO (Title)');
        if (!r.description.trim()) issues.push('Thiếu thẻ mô tả Meta Description');
        if (!r.indexable) issues.push('Đang tắt lập chỉ mục Google (noindex)');
        if (issues.length > 0) {
          generated.push({
            id: r.id,
            path: r.path,
            label: r.label,
            severity: !r.indexable || !r.title.trim() ? 'high' : 'medium',
            issues,
            editUrl: r.module === 'products' ? '/cms/products' : r.module === 'news' ? '/cms/news' : '/cms/function-seo',
          });
        }
      }
      return generated;
    }

    return baseWarnings
      .map((w) => {
        const live = records.find((r) => r.id === w.id || r.path === w.path);
        if (!live) return w;
        const issues: string[] = [];
        if (!live.title.trim()) issues.push('Chưa cấu hình Tiêu đề SEO (Title)');
        if (!live.description.trim()) issues.push('Thiếu thẻ mô tả Meta Description');
        if (!live.indexable) issues.push('Đang tắt lập chỉ mục Google (noindex)');
        return {
          ...w,
          label: live.label,
          issues,
          severity: (!live.indexable || !live.title.trim()) ? ('high' as const) : ('medium' as const),
        };
      })
      .filter((w) => w.issues.length > 0);
  }, [metrics?.warnings, records]);

  const healthItems = [
    { label: 'Tổng số trang', value: totalPages, note: 'Trang hệ thống và bài viết', tone: 'blue', filter: 'all' },
    { label: 'Chưa cấu hình Title', value: missingTitles, note: 'Cần bổ sung tiêu đề meta', tone: 'rose', filter: 'missing-description' },
    { label: 'Thiếu mô tả Meta', value: missingDescription, note: 'Cần bổ sung meta description', tone: 'amber', filter: 'missing-description' },
    { label: 'Đang tắt index (noindex)', value: noindexCount, note: 'Trang đang chặn Google bot', tone: 'slate', filter: 'noindex' },
  ] as const;

  return (
    <div className="space-y-4">
      <section className="flex items-start gap-3 rounded-xl border border-orange-200 bg-orange-50/60 p-4 dark:border-orange-900/60 dark:bg-orange-950/20">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-orange-600 shadow-xs dark:bg-orange-950/50 dark:text-orange-300">
          <Info className="size-4" />
        </span>
        <div>
          <h2 className="text-sm font-bold text-slate-800 dark:text-orange-100">Kiến trúc SEO 3 tầng</h2>
          <p className="mt-1 max-w-4xl text-xs leading-5 text-slate-600 dark:text-orange-200/80">
            <strong>Tầng 1:</strong> Mặc định toàn website quản lý tại <em>Cấu hình hệ thống</em>;{' '}
            <strong>Tầng 2:</strong> Cấu hình theo view và template hệ thống quản lý tại đây;{' '}
            <strong>Tầng 3:</strong> Bài viết, sản phẩm, trang tĩnh cụ thể được biên tập trực tiếp trong từng form chi tiết.
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:p-5">
        <div className="mb-4">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white">Chỉ số sức khỏe SEO</h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Tổng hợp tình trạng lập chỉ mục và mức độ hoàn thiện của siêu dữ liệu trên toàn hệ thống.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          {healthItems.map((item) => (
            <button
              type="button"
              onClick={() => onOpenTemplates(item.filter as any)}
              key={item.label}
              className="rounded-xl bg-slate-50 p-4 text-left ring-1 ring-inset ring-slate-200/80 transition hover:bg-orange-50 hover:ring-orange-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:bg-slate-800/50 dark:ring-slate-700 cursor-pointer"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">{item.label}</p>
                <span
                  className={`size-2 rounded-full ${
                    item.tone === 'rose'
                      ? 'bg-rose-500'
                      : item.tone === 'amber'
                      ? 'bg-amber-500'
                      : item.tone === 'blue'
                      ? 'bg-blue-500'
                      : 'bg-slate-400'
                  }`}
                />
              </div>
              <p className="mt-2 text-2xl font-bold tabular-nums text-slate-800 dark:text-white">{item.value}</p>
              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{item.note}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Cảnh báo trang cần xử lý ngay */}
      {activeWarnings.length > 0 && (
        <section className="rounded-xl border border-amber-200 bg-white shadow-xs dark:border-amber-900/50 dark:bg-slate-900 overflow-hidden">
          <div className="flex items-center justify-between border-b border-amber-100 bg-amber-50/60 px-5 py-3 dark:border-amber-900/40 dark:bg-amber-950/20">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />
              <h3 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                Các trang phát hiện thiếu SEO cần khắc phục ({activeWarnings.length})
              </h3>
            </div>
            <span className="text-[11px] text-amber-700 dark:text-amber-300">
              Sửa trực tiếp bằng modal hoặc mở trang nguồn
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {activeWarnings.map((w) => (
              <div key={w.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{w.label}</span>
                    <span className="font-mono text-[11px] text-slate-500">{w.path}</span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                        w.severity === 'high'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}
                    >
                      {w.severity === 'high' ? 'Ưu tiên cao' : 'Cần bổ sung'}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {w.issues.map((issue: string, idx: number) => (
                      <span key={idx} className="text-xs text-rose-600 dark:text-rose-400">
                        • {issue}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {onEditDirect && (
                    <CmsButton
                      size="sm"
                      variant="primary"
                      leadingIcon={<Edit3 className="size-3.5" />}
                      onClick={() => onEditDirect(w.id)}
                    >
                      Sửa SEO trực tiếp
                    </CmsButton>
                  )}
                  {w.editUrl && (
                    <CmsButton
                      size="sm"
                      variant="ghost"
                      trailingIcon={<ExternalLink className="size-3.5" />}
                      onClick={() => {
                        if (w.editUrl === '/cms/function-seo') {
                          onOpenTemplates('missing-description');
                        } else {
                          onNavigate(w.editUrl);
                        }
                      }}
                      title="Chuyển đến trang nguồn module"
                    >
                      Mở nguồn
                    </CmsButton>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        <button
          type="button"
          onClick={() => onOpenTemplates('all')}
          className="group flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-xs transition-colors hover:border-orange-300 hover:bg-orange-50/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-orange-800 dark:hover:bg-orange-950/10 cursor-pointer"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-300">
            <FileText className="size-5" />
          </span>
          <span>
            <span className="block text-sm font-bold text-slate-800 dark:text-white">Trang hệ thống & Mẫu SEO</span>
            <span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">
              Quản lý title, description, canonical và indexability của trang danh sách, bộ lọc và trang chi tiết.
            </span>
          </span>
        </button>
        <button
          type="button"
          onClick={onOpenRedirects}
          className="group flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-xs transition-colors hover:border-orange-300 hover:bg-orange-50/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-orange-800 dark:hover:bg-orange-950/10 cursor-pointer"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-300">
            <Map className="size-5" />
          </span>
          <span>
            <span className="block text-sm font-bold text-slate-800 dark:text-white">Chuyển hướng (Redirects) & Sitemap</span>
            <span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">
              Quản lý URL cũ chuyển hướng 301/302, kiểm tra vòng lặp tự động và theo dõi sơ đồ sitemap.xml.
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}
