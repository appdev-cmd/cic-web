import React from 'react';
import {
  CheckCircle2,
  Edit,
  ExternalLink,
  FileText,
  Globe,
  HelpCircle,
  LayoutGrid,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Sparkles,
} from 'lucide-react';
import type { CmsLocale } from '../../../data/CmsDataSource';
import type { CmsStaticPageListItem } from '@/features/static-pages/types';
import { CmsButton } from '../../../components/ui/CmsButton';
import {
  PageBuilderGuideCard,
  PageInlineSeoPanel,
  type PageInlineSeoValues,
} from './PageInlineSeoPanel';
import type { PageBuilderPage } from '../pageBuilderTypes';

const PAGE_METADATA_BY_CODE: Record<
  string,
  {
    summaryVi: string;
    summaryEn: string;
    sectionPillsVi: string[];
    sectionPillsEn: string[];
  }
> = {
  home: {
    summaryVi:
      'Trang đích trung tâm: Slide Banner, Giới thiệu, Thống kê, Hệ sinh thái, Dự án, Sự kiện, Tin tức & Đối tác.',
    summaryEn:
      'Main landing page: Hero Carousel, Intro, Key Metrics, Ecosystem, Projects, Events, News & Partners.',
    sectionPillsVi: ['Slide Banner', 'Giới thiệu ngắn', 'Thống kê', 'Dự án DB', 'Sự kiện DB', 'Tin tức DB'],
    sectionPillsEn: ['Hero Slides', 'Intro', 'Metrics', 'Projects DB', 'Events DB', 'News DB'],
  },
  about: {
    summaryVi:
      'Giới thiệu tổng quan CIC hơn 35 năm, Tiến trình lịch sử, Chiến lược, Giải pháp cốt lõi, Giải thưởng & Đối tác.',
    summaryEn:
      '35+ year corporate overview, Historical timeline, Strategy & Core values, Offerings, Awards & Partners.',
    sectionPillsVi: ['Hero Giới thiệu', 'Tổng quan & Video', 'Lịch sử 35 năm', 'Chiến lược', 'Giải thưởng'],
    sectionPillsEn: ['About Hero', 'Overview & Video', 'Timeline', 'Strategy', 'Awards'],
  },
  organization: {
    summaryVi:
      'Sơ đồ tổ chức, Ban lãnh đạo và mạng lưới trung tâm chuyên môn của Công ty CP Công nghệ và Tư vấn CIC.',
    summaryEn:
      'Organizational chart, leadership structure, and specialized engineering centers of CIC.',
    sectionPillsVi: ['Hero Tổ chức', 'Sơ đồ cơ cấu tổ chức'],
    sectionPillsEn: ['Hero Banner', 'Organization Chart'],
  },
  capacity_experience: {
    summaryVi:
      'Hồ sơ năng lực, chỉ số thực thi, mạng lưới đối tác quốc tế và kinh nghiệm triển khai dự án trọng điểm.',
    summaryEn:
      'Corporate capability metrics, global technology partner network, and flagship project experience.',
    sectionPillsVi: ['Chỉ số năng lực', 'Trụ cột kinh nghiệm', 'Mạng lưới đối tác', 'Hồ sơ Profile'],
    sectionPillsEn: ['Capacity Metrics', 'Experience Pillars', 'Partner Network', 'Company Profile'],
  },
  privacy_policy: {
    summaryVi:
      'Chính sách bảo vệ dữ liệu cá nhân và cam kết bảo mật thông tin khách hàng (Soạn thảo bằng CKEditor 5).',
    summaryEn:
      'Personal data protection policy and customer privacy commitments (Rich Text CKEditor 5).',
    sectionPillsVi: ['Tiêu đề pháp lý', 'Nội dung CKEditor 5'],
    sectionPillsEn: ['Legal Header', 'CKEditor 5 Article'],
  },
  terms_of_use: {
    summaryVi:
      'Điều khoản sử dụng website, bản quyền nội dung và quy định tương tác dịch vụ số của CIC (CKEditor 5).',
    summaryEn:
      'Website terms of use, intellectual property rights, and service regulations (Rich Text CKEditor 5).',
    sectionPillsVi: ['Tiêu đề pháp lý', 'Nội dung CKEditor 5'],
    sectionPillsEn: ['Legal Header', 'CKEditor 5 Article'],
  },
};

const formatShortTime = (value: string | null) => {
  if (!value) return 'Chưa cập nhật';
  try {
    return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(
      new Date(value)
    );
  } catch {
    return value;
  }
};

interface PageDirectoryListViewProps {
  workspaceLocale: CmsLocale;
  pages: CmsStaticPageListItem[];
  counterpartPages: CmsStaticPageListItem[];
  filteredPages: CmsStaticPageListItem[];
  query: string;
  onQueryChange: (value: string) => void;
  statusFilter: 'all' | 'has_draft' | 'published';
  onStatusFilterChange: (value: 'all' | 'has_draft' | 'published') => void;
  showGuide: boolean;
  onToggleGuide: () => void;
  isRefreshing: boolean;
  onRefresh: () => void;
  canCreateLegal: boolean;
  onOpenCreateModal: () => void;
  inlineSeoState: {
    page: PageBuilderPage;
    seo: PageInlineSeoValues;
    saving: boolean;
  } | null;
  onToggleInlineSeo: (page: CmsStaticPageListItem) => void;
  onChangeInlineSeo: (patch: Partial<PageInlineSeoValues>) => void;
  onSaveInlineSeo: () => void;
  onCloseInlineSeo: () => void;
  onEditPage: (page: CmsStaticPageListItem, locale?: CmsLocale) => void;
}

export const PageDirectoryListView: React.FC<PageDirectoryListViewProps> = ({
  workspaceLocale,
  pages,
  counterpartPages,
  filteredPages,
  query,
  onQueryChange,
  statusFilter,
  onStatusFilterChange,
  showGuide,
  onToggleGuide,
  isRefreshing,
  onRefresh,
  canCreateLegal,
  onOpenCreateModal,
  inlineSeoState,
  onToggleInlineSeo,
  onChangeInlineSeo,
  onSaveInlineSeo,
  onCloseInlineSeo,
  onEditPage,
}) => {
  const isEn = workspaceLocale === 'en';
  const counterpartLocale: CmsLocale = isEn ? 'vi' : 'en';
  const counterpartByCode = new Map(counterpartPages.map((p) => [p.code, p]));

  const totalCount = pages.length;
  const publishedCount = pages.filter((p) => p.published.version > 0).length;
  const draftDiffCount = pages.filter((p) => p.draft.version > p.published.version).length;
  const bilingualCount = pages.filter((p) => counterpartByCode.has(p.code)).length;
  const allPublished = totalCount > 0 && publishedCount === totalCount;

  return (
    <div className="space-y-4">
      {/* TOP HEADER & READINESS BAR (Modeled after robot-web PageDirectoryListView) */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-600 text-white shadow-xs">
              <LayoutGrid className="h-5 w-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-base font-extrabold text-slate-950 dark:text-white">
                  {isEn ? 'Page Builder & Static Pages' : 'Quản lý Trang & Page Builder'}
                </h1>
                <span className="rounded-md bg-orange-50 px-2 py-0.5 text-[11px] font-extrabold text-orange-700 ring-1 ring-orange-200/70 dark:bg-orange-950/40 dark:text-orange-300 dark:ring-orange-900/50">
                  {totalCount} {isEn ? 'pages' : 'trang'} · {workspaceLocale.toUpperCase()}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {isEn
                  ? 'Click directly on text, images, banners or database sources in the live canvas to edit.'
                  : 'Nhấp trực tiếp vào chữ, ảnh, nút bấm hoặc chọn nguồn Dự án / Sự kiện / Tin tức ngay trên giao diện thật.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onToggleGuide}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                showGuide
                  ? 'border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950/40 dark:text-orange-300'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
              }`}
            >
              <HelpCircle className="h-3.5 w-3.5 text-orange-600" />
              <span>{showGuide ? 'Ẩn hướng dẫn' : 'Hướng dẫn nhanh'}</span>
            </button>

            <button
              type="button"
              onClick={onRefresh}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-orange-600' : ''}`} />
              <span>{isEn ? 'Refresh' : 'Làm mới'}</span>
            </button>

            {canCreateLegal && (
              <CmsButton size="sm" leadingIcon={<Plus />} onClick={onOpenCreateModal}>
                {isEn ? 'New Standard Page' : 'Tạo trang mới'}
              </CmsButton>
            )}
          </div>
        </div>

        {/* Readiness Pills Row */}
        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-bold ${
                allPublished
                  ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300'
                  : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300'
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Đã xuất bản công khai: {publishedCount}/{totalCount} trang
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 font-bold text-blue-700 ring-1 ring-blue-200/70 dark:bg-blue-950/40 dark:text-blue-300">
              Song ngữ VI ↔ EN: {bilingualCount}/{totalCount} trang
            </span>

            <span
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-bold ${
                draftDiffCount > 0
                  ? 'bg-amber-50 text-amber-800 ring-1 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-orange-500" />
              {draftDiffCount > 0
                ? `${draftDiffCount} trang có bản nháp chưa xuất bản`
                : 'Tất cả bản nháp đã đồng bộ bản công khai'}
            </span>
          </div>

          {/* Inline Search & Status Segmented Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[230px]">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                id="static-pages-search"
                name="staticPagesSearch"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder={isEn ? 'Filter by name or route...' : 'Tìm nhanh tên trang, route...'}
                className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-2.5 text-xs font-medium text-slate-800 outline-none focus:border-orange-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-[11px] font-bold dark:border-slate-700 dark:bg-slate-800">
              {(
                [
                  ['all', isEn ? 'All' : 'Tất cả'],
                  ['has_draft', isEn ? 'Drafts' : 'Có nháp'],
                  ['published', isEn ? 'Live' : 'Đã xuất bản'],
                ] as const
              ).map(([val, label]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => onStatusFilterChange(val)}
                  className={`rounded-md px-2.5 py-1 transition cursor-pointer ${
                    statusFilter === val
                      ? 'bg-white text-orange-600 shadow-2xs dark:bg-slate-900 dark:text-orange-400'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {(query || statusFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  onQueryChange('');
                  onStatusFilterChange('all');
                }}
                className="inline-flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                title="Đặt lại bộ lọc"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </section>

      {showGuide && <PageBuilderGuideCard onClose={onToggleGuide} />}

      {/* ZERO-HORIZONTAL-SCROLL DIRECTORY CARDS (Matching robot-web) */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs divide-y divide-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:divide-slate-800">
        {filteredPages.map((page) => {
          const meta = PAGE_METADATA_BY_CODE[page.code];
          const summary = meta
            ? isEn
              ? meta.summaryEn
              : meta.summaryVi
            : page.templateKey === 'legal_standard'
              ? 'Trang nội dung chuẩn soạn thảo trực tiếp bằng CKEditor 5 đầy đủ công cụ.'
              : 'Trang thiết kế trực quan chỉnh sửa trên Visual Page Builder.';
          const pills = meta
            ? isEn
              ? meta.sectionPillsEn
              : meta.sectionPillsVi
            : page.templateKey === 'legal_standard'
              ? ['Tiêu đề trang', 'Nội dung CKEditor 5']
              : [`${page.sectionCount} khu vực nội dung`];
          const visiblePills = pills.slice(0, 3);
          const remainingPills = Math.max(0, Math.max(page.sectionCount, pills.length) - visiblePills.length);

          const hasDraftDiff = page.draft.version > page.published.version;
          const isPublished = page.published.version > 0;
          const publicUrl = isEn ? `/en${page.slug === '/' ? '' : page.slug}` : page.slug;
          const counterpart = counterpartByCode.get(page.code);
          const isSeoOpen = inlineSeoState?.page.id === page.id;
          const isLegal = page.templateKey === 'legal_standard';

          return (
            <div key={page.id} className="transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
              <div className="grid grid-cols-1 items-center gap-3 px-4 py-3.5 lg:grid-cols-12">
                {/* Col 1-5: Status, Route, Title & Summary */}
                <div className="min-w-0 lg:col-span-5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                        hasDraftDiff
                          ? 'bg-amber-50 text-amber-800 ring-1 ring-amber-200 dark:bg-amber-950/50 dark:text-amber-300'
                          : isPublished
                            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          hasDraftDiff
                            ? 'bg-amber-500'
                            : isPublished
                              ? 'bg-emerald-500'
                              : 'bg-slate-400'
                        }`}
                      />
                      {hasDraftDiff
                        ? `Nháp v${page.draft.version} (Chưa xuất bản)`
                        : isPublished
                          ? `Đang hoạt động · v${page.published.version}`
                          : 'Chưa xuất bản'}
                    </span>

                    <code className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {publicUrl}
                    </code>

                    {isLegal && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-violet-50 px-1.5 py-0.5 text-[10px] font-bold text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">
                        <FileText className="h-3 w-3" />
                        CKEditor 5
                      </span>
                    )}
                  </div>

                  <div className="mt-1.5 flex items-baseline gap-2">
                    <button
                      type="button"
                      onClick={() => onEditPage(page, workspaceLocale)}
                      className="truncate text-left text-sm font-extrabold text-slate-900 hover:text-orange-600 dark:text-white dark:hover:text-orange-400 cursor-pointer"
                    >
                      {page.name}
                    </button>
                    <span className="shrink-0 text-[11px] text-slate-400">
                      Cập nhật {formatShortTime(page.draft.updatedAt)}
                    </span>
                  </div>

                  <p className="mt-0.5 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">
                    {summary}
                  </p>
                </div>

                {/* Col 6-9: Structure Pills & Bilingual Direct Jump */}
                <div className="min-w-0 lg:col-span-4">
                  <div className="flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="font-semibold text-slate-600 dark:text-slate-300">
                      Cấu trúc: <strong className="text-slate-900 dark:text-white">{page.sectionCount}</strong> khối hiển thị
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    {counterpart ? (
                      <button
                        type="button"
                        onClick={() => onEditPage(counterpart, counterpartLocale)}
                        title={`Mở bản ${counterpartLocale.toUpperCase()} (${counterpart.name}) ngay trong Builder`}
                        className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-1.5 py-0.5 font-bold text-blue-700 hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-300 cursor-pointer"
                      >
                        <span>{counterpartLocale.toUpperCase()}: Đã có ↗</span>
                      </button>
                    ) : (
                      <span className="text-slate-400">{counterpartLocale.toUpperCase()}: Chưa tạo</span>
                    )}
                  </div>

                  <div className="mt-1.5 flex flex-wrap items-center gap-1">
                    {visiblePills.map((pill) => (
                      <span
                        key={pill}
                        className="rounded-md border border-slate-200/90 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      >
                        {pill}
                      </span>
                    ))}
                    {remainingPills > 0 && (
                      <span className="rounded-md bg-orange-50 px-2 py-0.5 text-[11px] font-bold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">
                        +{remainingPills} khối khác
                      </span>
                    )}
                  </div>
                </div>

                {/* Col 10-12: Compact Actions (Sửa giao diện / SEO / Xem ↗) */}
                <div className="flex flex-wrap items-center justify-start gap-1.5 lg:col-span-3 lg:justify-end">
                  <button
                    type="button"
                    onClick={() => onEditPage(page, workspaceLocale)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-orange-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs transition hover:bg-orange-500 cursor-pointer"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    <span>{isLegal ? 'Soạn nội dung' : 'Sửa giao diện'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleInlineSeo(page)}
                    className={`inline-flex items-center gap-1 rounded-xl border px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                      isSeoOpen
                        ? 'border-orange-400 bg-orange-50 text-orange-700 dark:border-orange-700 dark:bg-orange-950/50 dark:text-orange-300'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:text-orange-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                    }`}
                    title="Chỉnh nhanh Tiêu đề & Mô tả SEO Google"
                  >
                    <Globe className="h-3.5 w-3.5 text-orange-600" />
                    <span>SEO</span>
                  </button>

                  <a
                    href={publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-600 hover:border-orange-300 hover:text-orange-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                    title="Mở trang thật ở tab mới"
                  >
                    <span>Xem</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              {isSeoOpen && inlineSeoState && (
                <div className="border-t border-orange-100 bg-orange-50/25 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/80">
                  <PageInlineSeoPanel
                    compact
                    pageName={inlineSeoState.page.name}
                    slug={inlineSeoState.page.slug}
                    workspaceLocale={workspaceLocale}
                    seo={inlineSeoState.seo}
                    saving={inlineSeoState.saving}
                    onChange={onChangeInlineSeo}
                    onSaveSeoOnly={onSaveInlineSeo}
                    onClose={onCloseInlineSeo}
                  />
                </div>
              )}
            </div>
          );
        })}

        {filteredPages.length === 0 && (
          <div className="py-12 text-center text-sm text-slate-500">
            {isEn
              ? 'No pages match your current filter.'
              : 'Không tìm thấy trang nào khớp với bộ lọc hiện tại.'}
          </div>
        )}
      </section>
    </div>
  );
};
