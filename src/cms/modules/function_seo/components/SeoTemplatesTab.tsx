import React from 'react';
import {
  Building2,
  ChevronDown,
  ChevronRight,
  Edit3,
  ExternalLink,
  FolderTree,
  Globe2,
  Layers,
  Search,
  SlidersHorizontal,
  Tag,
  X,
} from 'lucide-react';
import { CmsButton } from '@/shared/ui/cms/CmsButton';
import { CmsPagination } from '@/shared/ui/cms/CmsPagination';
import type { FunctionSeoRecord, SeoFacetLevel } from '@/features/function-seo/types';
import { inputClass } from './functionSeoUtils';

export interface SeoTemplatesTabProps {
  filtered: FunctionSeoRecord[];
  paginatedRecords: FunctionSeoRecord[];
  query: string;
  setQuery: (query: string) => void;
  healthFilter: 'all' | 'noindex' | 'missing-description' | 'missing-owner';
  setHealthFilter: (filter: 'all' | 'noindex' | 'missing-description' | 'missing-owner') => void;
  expandedIds: Set<string>;
  toggleExpanded: (id: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  canEdit?: boolean;
  onEditMain: (record: FunctionSeoRecord) => void;
  onEditFacet: (params: { recordId: string; recordLabel: string; facet: SeoFacetLevel }) => void;
  onToggleIndexable: (record: FunctionSeoRecord) => void;
  onNavigate: (href: string) => void;
}

export function SeoTemplatesTab({
  filtered,
  paginatedRecords,
  query,
  setQuery,
  healthFilter,
  setHealthFilter,
  expandedIds,
  toggleExpanded,
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize,
  canEdit = true,
  onEditMain,
  onEditFacet,
  onToggleIndexable,
  onNavigate,
}: SeoTemplatesTabProps) {
  return (
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
              <div className="flex w-full items-center justify-between gap-3 p-3.5 text-left hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                <button
                  type="button"
                  onClick={() => toggleExpanded(item.id)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left cursor-pointer focus:outline-none"
                  aria-expanded={expanded}
                >
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
                </button>

                <div className="flex shrink-0 items-center gap-2.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (canEdit) void onToggleIndexable(item);
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
                  <button
                    type="button"
                    onClick={() => toggleExpanded(item.id)}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer focus:outline-none"
                    aria-label={expanded ? 'Thu gọn' : 'Mở rộng'}
                  >
                    {expanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

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
                      {canEdit && (
                        <CmsButton
                          size="sm"
                          variant="secondary"
                          leadingIcon={<Edit3 className="h-3 w-3" />}
                          onClick={() => onEditMain({ ...item })}
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
                              {canEdit && (
                                <CmsButton
                                  size="sm"
                                  variant="secondary"
                                  leadingIcon={<Edit3 className="h-3 w-3" />}
                                  onClick={() =>
                                    onEditFacet({
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
                                  variant="ghost"
                                  trailingIcon={<ExternalLink className="h-3 w-3" />}
                                  onClick={() => onNavigate(facet.href!)}
                                  title="Chuyển đến trang quản lý dữ liệu nguồn"
                                >
                                  Mở nguồn
                                </CmsButton>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* CẤP 2 (Trang danh mục) */}
                  {!hasFacets && item.categoryPattern && (() => {
                    const existingCatFacet = item.facetLevels?.find((f) => f.id === `cat_${item.id}`);
                    const catFacet: SeoFacetLevel = existingCatFacet || {
                      id: `cat_${item.id}`,
                      number: '2',
                      title: `Danh mục ${item.label}`,
                      facetType: 'category',
                      pattern: item.categoryPattern || '',
                      owner: item.categoryOwner || 'Ban Biên Tập',
                      status: 'available',
                      href: item.categoryPath,
                      description: `Mẫu SEO cho trang danh mục ${item.label}`,
                      titleTemplate: `${item.label} theo danh mục | {Tên danh mục}`,
                      keywordsTemplate: `{Tên danh mục}, ${item.label.toLowerCase()}, danh mục`,
                      descriptionTemplate: `Danh sách các mục thuộc danh mục {Tên danh mục} của ${item.label}.`,
                    };

                    return (
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
                          {catFacet.titleTemplate && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                              Mẫu Title: <span className="font-mono text-orange-600 dark:text-orange-400">{catFacet.titleTemplate}</span>
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {canEdit && (
                            <CmsButton
                              size="sm"
                              variant="secondary"
                              leadingIcon={<Edit3 className="h-3 w-3" />}
                              onClick={() =>
                                onEditFacet({
                                  recordId: item.id,
                                  recordLabel: item.label,
                                  facet: { ...catFacet },
                                })
                              }
                            >
                              Sửa SEO
                            </CmsButton>
                          )}
                          {item.categoryPath && (
                            <CmsButton
                              size="sm"
                              variant="ghost"
                              trailingIcon={<ExternalLink className="h-3 w-3" />}
                              onClick={() => onNavigate(item.categoryPath!)}
                              title="Chuyển đến trang quản lý dữ liệu nguồn"
                            >
                              Mở nguồn
                            </CmsButton>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* CẤP CHI TIẾT */}
                  {(() => {
                    const existingDetailFacet = item.facetLevels?.find((f) => f.id === `detail_${item.id}`);
                    const detailFacet: SeoFacetLevel = existingDetailFacet || {
                      id: `detail_${item.id}`,
                      number: hasFacets ? '2' : item.categoryPattern ? '3' : '2',
                      title: `Trang chi tiết ${item.label}`,
                      facetType: 'custom',
                      pattern: item.detailPattern || '',
                      owner: item.detailOwner || 'Quản trị viên',
                      status: 'available',
                      href: item.detailPath,
                      description: `Mẫu SEO mặc định cho trang chi tiết ${item.label}`,
                      titleTemplate: `{Tên bài viết/sản phẩm} | ${item.label} - CIC`,
                      keywordsTemplate: `{Tên bài viết/sản phẩm}, ${item.label.toLowerCase()}`,
                      descriptionTemplate: `Thông tin chi tiết về {Tên bài viết/sản phẩm}. Đơn vị cung cấp giải pháp CIC.`,
                    };

                    return (
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
                          {detailFacet.titleTemplate && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                              Mẫu Title: <span className="font-mono text-orange-600 dark:text-orange-400">{detailFacet.titleTemplate}</span>
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {canEdit && (
                            <CmsButton
                              size="sm"
                              variant="secondary"
                              leadingIcon={<Edit3 className="h-3 w-3" />}
                              onClick={() =>
                                onEditFacet({
                                  recordId: item.id,
                                  recordLabel: item.label,
                                  facet: { ...detailFacet },
                                })
                              }
                            >
                              Sửa SEO mẫu
                            </CmsButton>
                          )}
                          {item.detailPath && item.detailStatus === 'available' && (
                            <CmsButton
                              size="sm"
                              variant="ghost"
                              trailingIcon={<ExternalLink className="h-3 w-3" />}
                              onClick={() => onNavigate(item.detailPath!)}
                              title="Chuyển đến trang quản lý dữ liệu nguồn"
                            >
                              Mở nguồn
                            </CmsButton>
                          )}
                        </div>
                      </div>
                    );
                  })()}
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
            onPageSizeChange={(size: number) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        </div>
      )}
    </>
  );
}
