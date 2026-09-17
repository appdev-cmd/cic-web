'use client';

import React, { useEffect, useMemo, useState, useTransition } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Edit3,
  ExternalLink,
  FileText,
  FolderTree,
  Globe2,
  Search,
  SearchCheck,
  X,
  Building2,
  Layers,
  Tag,
  Info,
  SlidersHorizontal,
  Link2,
  ListChecks,
  Map,
  AlertTriangle,
  ArrowRight,
  RotateCw,
} from 'lucide-react';
import type { CmsLocale } from '../../data/CmsDataSource';
import { useCmsWorkspaceLocale } from '@/cms/context/CmsWorkspaceLocaleContext';
import {
  updateFunctionSeo,
  saveRedirect,
  toggleRedirect,
  deleteRedirect,
} from '@/features/function-seo/server/actions';
import { CmsButton } from '../../components/ui/CmsButton';
import { CmsPageHeader } from '../../components/ui/CmsPageHeader';
import { CmsPagination } from '../../components/ui/CmsPagination';
import { CmsTabs } from '../../components/ui/CmsTabs';
import type { FunctionSeoRecord, SeoFacetLevel, RedirectRule, SeoHealthMetrics } from '@/features/function-seo/types';

interface Props {
  workspaceLocale?: CmsLocale;
  data?: FunctionSeoRecord[];
  initialData?: Record<'vi' | 'en', FunctionSeoRecord[]>;
  initialRedirects?: RedirectRule[];
  healthMetrics?: SeoHealthMetrics;
  capabilities?: {
    canEdit?: boolean;
  };
}

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 dark:border-slate-700 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400';

export const FunctionSeoManager: React.FC<Props> = ({
  workspaceLocale: propLocale,
  data,
  initialData,
  initialRedirects = [],
  healthMetrics,
  capabilities = { canEdit: true },
}) => {
  const contextLocale = useCmsWorkspaceLocale();
  const activeLocale: 'vi' | 'en' = (contextLocale || propLocale || 'vi') === 'en' ? 'en' : 'vi';

  const currentRecords = useMemo(() => {
    if (initialData) return initialData[activeLocale] ?? [];
    return data ?? [];
  }, [initialData, activeLocale, data]);

  const [records, setRecords] = useState<FunctionSeoRecord[]>(() =>
    currentRecords.map((item) => ({ ...item, facetLevels: item.facetLevels?.map((f) => ({ ...f })) }))
  );

  useEffect(() => {
    setRecords(
      currentRecords.map((item) => ({ ...item, facetLevels: item.facetLevels?.map((f) => ({ ...f })) }))
    );
  }, [currentRecords]);

  const [query, setQuery] = useState('');
  const [editingMain, setEditingMain] = useState<FunctionSeoRecord | null>(null);
  const [editingFacet, setEditingFacet] = useState<{
    recordId: string;
    recordLabel: string;
    facet: SeoFacetLevel;
  } | null>(null);

  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());
  const [toast, setToast] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeSection, setActiveSection] = useState<'overview' | 'templates' | 'redirects'>('overview');
  const [healthFilter, setHealthFilter] = useState<'all' | 'noindex' | 'missing-description' | 'missing-owner'>('all');

  const notify = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(''), 3500);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const healthFiltered = records.filter((item) => {
      if (healthFilter === 'noindex') return !item.indexable;
      if (healthFilter === 'missing-description') return !item.description.trim();
      if (healthFilter === 'missing-owner') return item.detailStatus === 'missing' || item.facetLevels?.some((facet) => facet.status === 'missing');
      return true;
    });
    if (!q) return healthFiltered;
    return healthFiltered.filter((item) => {
      const matchMain = `${item.label} ${item.path} ${item.module}`.toLowerCase().includes(q);
      const matchFacets = item.facetLevels?.some((f) =>
        `${f.title} ${f.pattern}`.toLowerCase().includes(q)
      );
      return matchMain || matchFacets;
    });
  }, [healthFilter, query, records]);

  const paginatedRecords = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    const lastPage = Math.max(1, Math.ceil(filtered.length / pageSize));
    if (currentPage > lastPage) setCurrentPage(lastPage);
  }, [currentPage, filtered.length, pageSize]);

  const saveMainSeo = async () => {
    if (!editingMain || !editingMain.title.trim()) return;
    try {
      await updateFunctionSeo({
        id: editingMain.id,
        locale: activeLocale,
        title: editingMain.title,
        keywords: editingMain.keywords,
        description: editingMain.description,
        indexable: editingMain.indexable,
      });
      setRecords((current) =>
        current.map((item) =>
          item.id === editingMain.id ? { ...editingMain, updatedAt: new Date().toISOString() } : item
        )
      );
      setEditingMain(null);
      notify('Đã lưu cấu hình SEO trang chính vào cơ sở dữ liệu.');
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Không thể lưu cấu hình SEO.');
    }
  };

  const toggleIndexable = async (record: FunctionSeoRecord) => {
    const updated = !record.indexable;
    try {
      await updateFunctionSeo({
        id: record.id,
        locale: activeLocale,
        title: record.title,
        keywords: record.keywords,
        description: record.description,
        indexable: updated,
      });
      setRecords((current) =>
        current.map((item) => (item.id === record.id ? { ...item, indexable: updated } : item))
      );
      notify(`Đã ${updated ? 'bật' : 'tắt'} lập chỉ mục cho "${record.label}".`);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Không thể cập nhật chỉ số lập chỉ mục.');
    }
  };

  const saveFacetSeo = (updatedFacet: SeoFacetLevel) => {
    if (!editingFacet) return;
    setRecords((current) =>
      current.map((item) => {
        if (item.id !== editingFacet.recordId) return item;
        return {
          ...item,
          updatedAt: new Date().toISOString(),
          facetLevels: item.facetLevels?.map((f) => (f.id === updatedFacet.id ? updatedFacet : f)),
        };
      })
    );
    setEditingFacet(null);
    notify(`Đã lưu mẫu SEO cho "${updatedFacet.title}".`);
  };

  const toggle = (id: string) =>
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const navigateTo = (href: string) => {
    window.location.href = href;
  };

  const getFacetIcon = (type: string) => {
    switch (type) {
      case 'category':
        return <FolderTree className="h-3.5 w-3.5 text-orange-500" />;
      case 'brand':
        return <Building2 className="h-3.5 w-3.5 text-blue-500" />;
      case 'application':
        return <Layers className="h-3.5 w-3.5 text-emerald-500" />;
      case 'product_type':
        return <Tag className="h-3.5 w-3.5 text-purple-500" />;
      default:
        return <SlidersHorizontal className="h-3.5 w-3.5 text-indigo-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-xs font-semibold text-emerald-800 shadow-lg animate-in fade-in slide-in-from-bottom-2 dark:border-emerald-900/60 dark:bg-slate-900 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      <CmsPageHeader
        icon={<SearchCheck />}
        title="SEO & URL"
        description="Kiểm soát khả năng hiển thị trên công cụ tìm kiếm, template SEO và vòng đời URL của website."
        meta={
          <span className="rounded-md bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">
            {activeLocale.toUpperCase()} · {records.length} module hệ thống
          </span>
        }
      />

      <CmsTabs
        ariaLabel="Khu vực SEO và URL"
        value={activeSection}
        onChange={(value) => setActiveSection(value as typeof activeSection)}
        items={[
          { id: 'overview', label: 'Tổng quan sức khỏe', icon: ListChecks },
          { id: 'templates', label: 'Trang hệ thống & Mẫu SEO', icon: FileText },
          { id: 'redirects', label: 'Chuyển hướng (301/302) & Sitemap', icon: Link2 },
        ]}
      />

      {activeSection === 'overview' && (
        <SeoOverview
          records={records}
          metrics={healthMetrics}
          onOpenTemplates={(filter = 'all') => {
            setHealthFilter(filter);
            setActiveSection('templates');
          }}
          onOpenRedirects={() => setActiveSection('redirects')}
          onNavigate={navigateTo}
        />
      )}

      {activeSection === 'redirects' && (
        <RedirectWorkspace
          records={records}
          initialRedirects={initialRedirects}
          canEdit={capabilities.canEdit}
          onNotify={notify}
        />
      )}

      {activeSection === 'templates' && (
        <>
          {healthFilter !== 'all' && (
            <div className="flex items-center justify-between rounded-xl border border-orange-200 bg-orange-50/60 px-3 py-2 text-xs text-orange-800 dark:border-orange-900/60 dark:bg-orange-950/20 dark:text-orange-200">
              <span>Đang lọc theo cảnh báo từ Tổng quan.</span>
              <button
                type="button"
                onClick={() => setHealthFilter('all')}
                className="inline-flex items-center gap-1 font-bold hover:text-orange-600 cursor-pointer"
              >
                <X className="size-3.5" /> Xóa lọc
              </button>
            </div>
          )}

          {/* Filter search */}
          <div className="relative flex items-center">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm module hoặc tiêu chí lọc (Danh mục, Hãng sản xuất, Lĩnh vực ứng dụng, Loại SP)..."
              className={`${inputClass} pl-10 pr-9`}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                title="Xóa tìm kiếm"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Records list */}
          <div className="space-y-3">
            {paginatedRecords.map((item) => {
              const expanded = expandedIds.has(item.id);
              const hasFacets = item.facetLevels && item.facetLevels.length > 0;

              return (
                <section
                  key={item.id}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900"
                >
                  {/* Header Bar */}
                  <button
                    type="button"
                    onClick={() => toggle(item.id)}
                    className="flex w-full items-center justify-between gap-3 p-3.5 text-left hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                    aria-expanded={expanded}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
                        <Globe2 className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white text-sm">{item.label}</span>
                          <span className="font-mono text-xs font-semibold text-orange-600 dark:text-orange-400">
                            {item.path}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {item.title || '(Chưa cấu hình Title)'}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (capabilities.canEdit) void toggleIndexable(item);
                        }}
                        className={`rounded px-2.5 py-1 text-[11px] font-bold transition-colors cursor-pointer ${
                          item.indexable
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300'
                            : 'bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300'
                        }`}
                        title="Bấm để bật/tắt lập chỉ mục"
                      >
                        {item.indexable ? 'index, follow' : 'noindex'}
                      </button>
                      {expanded ? (
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Body: Tree View */}
                  {expanded && (
                    <div className="border-t border-slate-100 p-4 sm:p-5 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30 space-y-3">
                      {/* CẤP 1: Trang chính module */}
                      <div className="space-y-2.5">
                        <div className="relative flex items-center justify-between gap-3 rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                          <div className="min-w-0 space-y-0.5">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-orange-100 font-mono text-[11px] font-bold text-orange-700 dark:bg-orange-950 dark:text-orange-300">
                                1
                              </span>
                              <span>Trang chính module</span>
                              <span className="font-mono text-[11px] font-normal text-slate-500">{item.path}</span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1">{item.title}</p>
                            {item.description && (
                              <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-1 italic">
                                {item.description}
                              </p>
                            )}
                          </div>
                          {capabilities.canEdit && (
                            <CmsButton
                              size="sm"
                              variant="secondary"
                              leadingIcon={<Edit3 className="h-3 w-3" />}
                              onClick={() => setEditingMain({ ...item })}
                            >
                              Sửa SEO
                            </CmsButton>
                          )}
                        </div>

                        {/* Nhánh con của Cấp 1 (Facets) */}
                        {hasFacets && (
                          <div className="relative ml-4 pl-4 sm:ml-6 sm:pl-6 border-l-2 border-slate-200 dark:border-slate-800 space-y-2 py-0.5">
                            {item.facetLevels?.map((facet) => (
                              <div
                                key={facet.id}
                                className="relative flex items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900 transition-all hover:border-slate-300 dark:hover:border-slate-700"
                              >
                                <span className="absolute -left-[18px] sm:-left-[26px] top-1/2 -translate-y-1/2 h-[2px] w-4 sm:w-6 bg-slate-200 dark:bg-slate-800" />

                                <div className="min-w-0 space-y-0.5">
                                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                                    <span className="flex h-5 px-1.5 items-center justify-center rounded-md bg-slate-100 font-mono text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                      {facet.number}
                                    </span>
                                    <span>{facet.title}</span>
                                    <span className="font-mono text-[11px] font-normal text-slate-500">
                                      {facet.pattern}
                                    </span>
                                  </div>
                                  {facet.titleTemplate && (
                                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                                      {facet.titleTemplate}
                                    </p>
                                  )}
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  {capabilities.canEdit && (
                                    <CmsButton
                                      size="sm"
                                      variant="secondary"
                                      leadingIcon={<Edit3 className="h-3 w-3" />}
                                      onClick={() =>
                                        setEditingFacet({
                                          recordId: item.id,
                                          recordLabel: item.label,
                                          facet: { ...facet },
                                        })
                                      }
                                    >
                                      Sửa SEO
                                    </CmsButton>
                                  )}
                                  {facet.href && (
                                    <CmsButton
                                      size="sm"
                                      variant="secondary"
                                      trailingIcon={<ExternalLink className="h-3 w-3" />}
                                      onClick={() => navigateTo(facet.href!)}
                                    >
                                      Quản lý
                                    </CmsButton>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* CẤP 2 (Trang danh mục) */}
                      {!hasFacets && item.categoryPattern && (
                        <div className="relative flex items-center justify-between gap-3 rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                          <div className="min-w-0 space-y-0.5">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-slate-100 font-mono text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                2
                              </span>
                              <span>Trang danh mục</span>
                              <span className="font-mono text-[11px] font-normal text-slate-500">{item.categoryPattern}</span>
                            </div>
                            <p className="text-[11px] text-slate-500">Quản lý tại: {item.categoryOwner}</p>
                          </div>
                          {item.categoryPath && (
                            <CmsButton
                              size="sm"
                              variant="secondary"
                              trailingIcon={<ExternalLink className="h-3 w-3" />}
                              onClick={() => navigateTo(item.categoryPath!)}
                            >
                              Quản lý
                            </CmsButton>
                          )}
                        </div>
                      )}

                      {/* CẤP CHI TIẾT */}
                      <div className="relative flex items-center justify-between gap-3 rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-slate-100 font-mono text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                              {hasFacets ? '2' : item.categoryPattern ? '3' : '2'}
                            </span>
                            <span>Trang chi tiết</span>
                            <span className="font-mono text-[11px] font-normal text-slate-500">{item.detailPattern}</span>
                          </div>
                          <p className="text-[11px] text-slate-500">Quản lý SEO trực tiếp tại: {item.detailOwner}</p>
                        </div>
                        {item.detailPath && item.detailStatus === 'available' && (
                          <CmsButton
                            size="sm"
                            variant="secondary"
                            trailingIcon={<ExternalLink className="h-3 w-3" />}
                            onClick={() => navigateTo(item.detailPath)}
                          >
                            Quản lý
                          </CmsButton>
                        )}
                      </div>
                    </div>
                  )}
                </section>
              );
            })}
          </div>

          {filtered.length > 0 && (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <CmsPagination
                currentPage={currentPage}
                pageSize={pageSize}
                totalCount={filtered.length}
                itemLabel="module"
                onPageChange={setCurrentPage}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
              />
            </div>
          )}
        </>
      )}

      {/* Main Page SEO Editor */}
      {editingMain && (
        <SeoEditor
          value={editingMain}
          onChange={setEditingMain}
          onClose={() => setEditingMain(null)}
          onSave={saveMainSeo}
        />
      )}

      {/* Facet Filter SEO Editor Modal */}
      {editingFacet && (
        <FacetSeoEditor
          moduleLabel={editingFacet.recordLabel}
          facet={editingFacet.facet}
          onClose={() => setEditingFacet(null)}
          onSave={saveFacetSeo}
        />
      )}
    </div>
  );
};

function SeoOverview({
  records,
  metrics,
  onOpenTemplates,
  onOpenRedirects,
  onNavigate,
}: {
  records: FunctionSeoRecord[];
  metrics?: SeoHealthMetrics;
  onOpenTemplates: (filter?: 'all' | 'noindex' | 'missing-description' | 'missing-owner') => void;
  onOpenRedirects: () => void;
  onNavigate: (href: string) => void;
}) {
  const totalPages = metrics?.totalPages ?? records.length;
  const noindexCount = metrics?.noindexCount ?? records.filter((r) => !r.indexable).length;
  const missingDescription = metrics?.missingDescriptionCount ?? records.filter((r) => !r.description.trim()).length;
  const missingTitles = metrics?.missingTitleCount ?? records.filter((r) => !r.title.trim()).length;
  const warnings = metrics?.warnings ?? [];

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
      {warnings.length > 0 && (
        <section className="rounded-xl border border-amber-200 bg-white shadow-xs dark:border-amber-900/50 dark:bg-slate-900 overflow-hidden">
          <div className="flex items-center justify-between border-b border-amber-100 bg-amber-50/60 px-5 py-3 dark:border-amber-900/40 dark:bg-amber-950/20">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />
              <h3 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                Các trang phát hiện thiếu SEO cần khắc phục ({warnings.length})
              </h3>
            </div>
            <span className="text-[11px] text-amber-700 dark:text-amber-300">
              Đối chiếu theo mục 2.3 functional spec
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {warnings.map((w) => (
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
                    {w.issues.map((issue, idx) => (
                      <span key={idx} className="text-xs text-rose-600 dark:text-rose-400">
                        • {issue}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="shrink-0">
                  <CmsButton
                    size="sm"
                    variant="secondary"
                    trailingIcon={<ArrowRight className="size-3.5" />}
                    onClick={() => {
                      if (w.editUrl === '/cms/function-seo') {
                        onOpenTemplates('missing-description');
                      } else {
                        onNavigate(w.editUrl);
                      }
                    }}
                  >
                    Sửa tại nguồn
                  </CmsButton>
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

function RedirectWorkspace({
  records,
  initialRedirects = [],
  canEdit = true,
  onNotify,
}: {
  records: FunctionSeoRecord[];
  initialRedirects?: RedirectRule[];
  canEdit?: boolean;
  onNotify?: (msg: string) => void;
}) {
  const [redirects, setRedirects] = useState<RedirectRule[]>(initialRedirects);
  const [showForm, setShowForm] = useState(false);
  const [sourcePath, setSourcePath] = useState('');
  const [targetPath, setTargetPath] = useState('');
  const [redirectType, setRedirectType] = useState<'301' | '302'>('301');
  const [note, setNote] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const saveRedirectHandler = () => {
    const from = sourcePath.trim();
    const to = targetPath.trim();
    if (!from || !to) return setError('Vui lòng nhập đủ URL cũ và URL đích.');
    if (from === to) return setError('URL cũ và URL đích không được giống nhau.');

    setError('');
    startTransition(async () => {
      try {
        const res = await saveRedirect({
          id: editingId ?? undefined,
          sourcePath: from,
          targetPath: to,
          statusCode: redirectType === '302' ? 302 : 301,
          source: 'Thủ công',
          isActive: true,
          note: note || undefined,
        });

        if (editingId) {
          setRedirects((curr) =>
            curr.map((r) =>
              r.id === editingId
                ? { ...r, from, to, type: redirectType, note }
                : r
            )
          );
          onNotify?.('Cập nhật quy tắc chuyển hướng thành công.');
        } else {
          setRedirects((curr) => [
            {
              id: res.id ?? Date.now(),
              from,
              to,
              type: redirectType,
              source: 'Thủ công',
              active: true,
              hitCount: 0,
              note,
            },
            ...curr,
          ]);
          onNotify?.('Tạo quy tắc chuyển hướng thành công.');
        }

        setSourcePath('');
        setTargetPath('');
        setNote('');
        setEditingId(null);
        setShowForm(false);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Có lỗi khi lưu redirect.');
      }
    });
  };

  const handleToggle = (redirect: RedirectRule) => {
    startTransition(async () => {
      try {
        await toggleRedirect(redirect.id, !redirect.active);
        setRedirects((curr) =>
          curr.map((r) => (r.id === redirect.id ? { ...r, active: !r.active } : r))
        );
        onNotify?.(`Đã ${!redirect.active ? 'bật' : 'tắt'} chuyển hướng.`);
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : 'Không thể thay đổi trạng thái.');
      }
    });
  };

  const handleDelete = (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa quy tắc chuyển hướng này không?')) return;
    startTransition(async () => {
      try {
        await deleteRedirect(id);
        setRedirects((curr) => curr.filter((r) => r.id !== id));
        onNotify?.('Đã xóa quy tắc chuyển hướng.');
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : 'Không thể xóa redirect.');
      }
    });
  };

  const indexableCount = records.filter((record) => record.indexable).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-sm font-bold text-slate-950 dark:text-white">Danh sách Chuyển hướng URL (Redirects)</h2>
          <p className="mt-1 text-xs text-slate-500">
            Tự động chuyển hướng từ URL cũ sang URL mới. Tích hợp thuật toán chống vòng lặp (Redirect loop detection).
          </p>
        </div>
        {canEdit && (
          <CmsButton
            size="sm"
            leadingIcon={<Link2 className="size-4" />}
            onClick={() => {
              setEditingId(null);
              setSourcePath('');
              setTargetPath('');
              setNote('');
              setRedirectType('301');
              setError('');
              setShowForm((value) => !value);
            }}
          >
            Thêm redirect mới
          </CmsButton>
        )}
      </div>

      {showForm && (
        <div className="space-y-3 rounded-xl border border-orange-200 bg-orange-50/60 p-4 dark:border-orange-900/60 dark:bg-orange-950/20">
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 sm:items-end">
            <label className="space-y-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>URL cũ (Nguồn)</span>
              <input
                value={sourcePath}
                onChange={(e) => {
                  setSourcePath(e.target.value);
                  setError('');
                }}
                placeholder="/san-pham-cu.html"
                className={inputClass}
              />
            </label>
            <label className="space-y-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>URL mới (Đích)</span>
              <input
                value={targetPath}
                onChange={(e) => {
                  setTargetPath(e.target.value);
                  setError('');
                }}
                placeholder="/products"
                className={inputClass}
              />
            </label>
            <label className="space-y-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>Loại mã HTTP</span>
              <select
                value={redirectType}
                onChange={(e) => setRedirectType(e.target.value as '301' | '302')}
                className={inputClass}
              >
                <option value="301">301 (Vĩnh viễn - Khuyên dùng)</option>
                <option value="302">302 (Tạm thời)</option>
              </select>
            </label>
            <label className="space-y-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>Ghi chú lý do</span>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="VD: Đổi cấu trúc link"
                className={inputClass}
              />
            </label>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-rose-50 p-2 text-xs font-semibold text-rose-700 border border-rose-200">
              <AlertTriangle className="size-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <CmsButton
              size="sm"
              variant="secondary"
              onClick={() => {
                setShowForm(false);
                setError('');
              }}
            >
              Hủy
            </CmsButton>
            <CmsButton size="sm" onClick={saveRedirectHandler} disabled={isPending}>
              {isPending ? (
                <span className="flex items-center gap-1.5">
                  <RotateCw className="size-3.5 animate-spin" /> Đang lưu...
                </span>
              ) : editingId ? (
                'Cập nhật'
              ) : (
                'Lưu quy tắc'
              )}
            </CmsButton>
          </div>
        </div>
      )}

      {/* Redirects Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full min-w-[800px] text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800/70">
            <tr>
              <th className="px-4 py-3">URL cũ (Nguồn)</th>
              <th className="px-4 py-3">URL mới (Đích)</th>
              <th className="px-4 py-3">Loại</th>
              <th className="px-4 py-3">Nguồn</th>
              <th className="px-4 py-3">Số lần chuyển</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {redirects.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                  Chưa có quy tắc chuyển hướng nào trong cơ sở dữ liệu.
                </td>
              </tr>
            ) : (
              redirects.map((redirect) => (
                <tr key={redirect.id}>
                  <td className="px-4 py-3 font-mono font-semibold text-slate-900 dark:text-slate-100">
                    {redirect.from}
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-300">
                    {redirect.to}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded px-1.5 py-0.5 font-bold ${
                        redirect.type === '301'
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                      }`}
                    >
                      {redirect.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{redirect.source}</td>
                  <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-400">
                    {redirect.hitCount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`font-semibold ${
                        redirect.active
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {redirect.active ? 'Hoạt động' : 'Tạm tắt'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      {canEdit && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(redirect.id);
                              setSourcePath(redirect.from);
                              setTargetPath(redirect.to);
                              setRedirectType(redirect.type);
                              setNote(redirect.note ?? '');
                              setShowForm(true);
                              setError('');
                            }}
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-orange-600 dark:hover:bg-slate-800 cursor-pointer"
                            aria-label="Sửa redirect"
                          >
                            <Edit3 className="size-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggle(redirect)}
                            className="rounded-lg px-2 py-1 font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                          >
                            {redirect.active ? 'Tắt' : 'Bật'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(redirect.id)}
                            className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 cursor-pointer"
                            aria-label="Xóa redirect"
                          >
                            <X className="size-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Dynamic Sitemap Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div>
          <p className="text-sm font-bold text-slate-950 dark:text-white">Sơ đồ trang web (Sitemap XML)</p>
          <p className="mt-1 text-xs text-slate-500">
            {indexableCount} module hệ thống và toàn bộ bài viết, sản phẩm, trang tĩnh đã xuất bản đủ điều kiện lập chỉ mục.
          </p>
        </div>
        <a
          href="/sitemap.xml"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 transition-colors"
        >
          <ExternalLink className="size-3.5" />
          <span>Mở sitemap.xml</span>
        </a>
      </div>
    </div>
  );
}

function SeoEditor({
  value,
  onChange,
  onClose,
  onSave,
}: {
  value: FunctionSeoRecord;
  onChange: (value: FunctionSeoRecord) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-4 animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl dark:bg-slate-900">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-900">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">SEO trang chính: {value.label}</h2>
            <p className="font-mono text-xs text-slate-500">{value.path}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="space-y-3.5 p-5">
          <Field label="SEO Title" count={`${value.title.length}/60`}>
            <input
              className={inputClass}
              value={value.title}
              onChange={(e) => onChange({ ...value, title: e.target.value })}
              placeholder="Nhập tiêu đề SEO chuẩn tìm kiếm..."
            />
          </Field>

          <Field label="Meta Keywords (Từ khóa)">
            <input
              className={inputClass}
              value={value.keywords}
              onChange={(e) => onChange({ ...value, keywords: e.target.value })}
              placeholder="VD: phần mềm, công nghệ, giải pháp..."
            />
          </Field>

          <Field label="Meta Description (Mô tả)" count={`${value.description.length}/160`}>
            <textarea
              rows={3}
              className={inputClass}
              value={value.description}
              onChange={(e) => onChange({ ...value, description: e.target.value })}
              placeholder="Nhập mô tả tóm tắt xuất hiện trên Google Search..."
            />
          </Field>

          <Field label="Canonical Path">
            <input
              className={inputClass}
              value={value.canonicalPath}
              onChange={(e) => onChange({ ...value, canonicalPath: e.target.value })}
              placeholder="/duong-dan-chuan"
            />
          </Field>

          <label className="flex items-center justify-between rounded-lg border border-slate-200 p-3 text-xs font-semibold dark:border-slate-700 cursor-pointer">
            <span className="text-slate-800 dark:text-slate-200">Cho phép Google index (lập chỉ mục)</span>
            <input
              type="checkbox"
              checked={value.indexable}
              onChange={(e) => onChange({ ...value, indexable: e.target.checked })}
              className="h-4 w-4 rounded text-orange-600 cursor-pointer"
            />
          </label>

          {/* SERP Preview */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-950/50">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Xem trước kết quả Google (SERP)</p>
            <div className="font-sans space-y-1">
              <p className="text-xs text-[#202124] dark:text-slate-400 font-mono">
                https://cic.com.vn{value.canonicalPath || value.path}
              </p>
              <h3 className="text-sm font-semibold text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer line-clamp-1">
                {value.title || value.label} | CIC Technology
              </h3>
              <p className="text-xs text-[#4d5156] dark:text-[#bdc1c6] line-clamp-2">
                {value.description || 'Chưa có mô tả tóm tắt cho trang này...'}
              </p>
            </div>
          </div>
        </div>

        <footer className="sticky bottom-0 flex justify-end gap-2 border-t border-slate-200 bg-white px-5 py-3 dark:border-slate-800 dark:bg-slate-900">
          <CmsButton variant="secondary" size="sm" onClick={onClose}>
            Hủy
          </CmsButton>
          <CmsButton size="sm" onClick={onSave} disabled={!value.title.trim()}>
            Lưu cấu hình
          </CmsButton>
        </footer>
      </div>
    </div>
  );
}

function FacetSeoEditor({
  moduleLabel,
  facet,
  onClose,
  onSave,
}: {
  moduleLabel: string;
  facet: SeoFacetLevel;
  onClose: () => void;
  onSave: (updated: SeoFacetLevel) => void;
}) {
  const [formState, setFormState] = useState<SeoFacetLevel>({ ...facet });

  const dynamicTags = useMemo(() => {
    switch (formState.facetType) {
      case 'category':
        return ['{Tên danh mục}', '{Mô tả danh mục}'];
      case 'brand':
        return ['{Tên hãng}', '{Quốc gia}'];
      case 'application':
        return ['{Tên ứng dụng}', '{Mô tả ứng dụng}'];
      case 'product_type':
        return ['{Tên loại sản phẩm}'];
      default:
        return ['{Tên lĩnh vực}'];
    }
  }, [formState.facetType]);

  const insertTag = (tag: string) => {
    setFormState((prev) => ({
      ...prev,
      titleTemplate: (prev.titleTemplate || '') + (prev.titleTemplate ? ' ' : '') + tag,
    }));
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-4 animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl dark:bg-slate-900">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-900">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Cấu hình SEO: {formState.title}</h2>
            <p className="font-mono text-xs text-orange-600 dark:text-orange-400">URL: {formState.pattern}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="space-y-3.5 p-5">
          <div className="rounded-lg bg-amber-50/70 p-2.5 text-xs text-amber-900 dark:bg-amber-950/30 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/40">
            Bạn có thể nhập nội dung cố định hoặc bấm chèn các biến tự động dưới đây để hệ thống tự điền theo từng mục khi người dùng truy cập.
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Chèn biến tự động:</span>
            {dynamicTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => insertTag(tag)}
                className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
              >
                + {tag}
              </button>
            ))}
          </div>

          <Field label="Tiêu đề SEO (Title)" count={`${(formState.titleTemplate || '').length}/60`}>
            <input
              className={inputClass}
              value={formState.titleTemplate || ''}
              onChange={(e) => setFormState({ ...formState, titleTemplate: e.target.value })}
              placeholder="VD: {Tên danh mục} - Phần mềm & Giải pháp | CIC"
            />
          </Field>

          <Field label="Mô tả (Meta Description)" count={`${(formState.descriptionTemplate || '').length}/160`}>
            <textarea
              rows={3}
              className={inputClass}
              value={formState.descriptionTemplate || ''}
              onChange={(e) => setFormState({ ...formState, descriptionTemplate: e.target.value })}
              placeholder="VD: Danh sách các giải pháp chuyên dụng thuộc {Tên danh mục}..."
            />
          </Field>
        </div>

        <footer className="sticky bottom-0 flex justify-end gap-2 border-t border-slate-200 bg-white px-5 py-3 dark:border-slate-800 dark:bg-slate-900">
          <CmsButton variant="secondary" size="sm" onClick={onClose}>
            Hủy
          </CmsButton>
          <CmsButton size="sm" onClick={() => onSave(formState)}>
            Lưu cấu hình SEO
          </CmsButton>
        </footer>
      </div>
    </div>
  );
}

function Field({
  label,
  count,
  children,
}: {
  label: string;
  count?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1">
      <span className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
        <span>{label}</span>
        {count && <span className="font-normal text-slate-400">{count}</span>}
      </span>
      {children}
    </label>
  );
}
