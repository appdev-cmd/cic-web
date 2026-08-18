import React, { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDot,
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
  Sparkles,
  Info,
  SlidersHorizontal,
} from 'lucide-react';
import type { CmsLocale } from '../../data/CmsDataSource';
import { getDemoFunctionSeoData } from '../../data/FunctionSeoDataSource';
import { CmsButton } from '../../components/ui/CmsButton';
import { CmsPageHeader } from '../../components/ui/CmsPageHeader';
import { CmsPagination } from '../../components/ui/CmsPagination';
import type { FunctionSeoRecord, SeoFacetLevel, SeoOwnerStatus } from './types';

interface Props {
  workspaceLocale: CmsLocale;
  data?: FunctionSeoRecord[];
}

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 dark:border-slate-700 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400';

export const FunctionSeoManager: React.FC<Props> = ({ workspaceLocale, data }) => {
  const initialData = useMemo(() => {
    return data && data.length > 0 ? data : getDemoFunctionSeoData(workspaceLocale);
  }, [data, workspaceLocale]);

  const [records, setRecords] = useState<FunctionSeoRecord[]>(() =>
    initialData.map((item) => ({ ...item, facetLevels: item.facetLevels?.map((f) => ({ ...f })) }))
  );

  useEffect(() => {
    setRecords(
      initialData.map((item) => ({ ...item, facetLevels: item.facetLevels?.map((f) => ({ ...f })) }))
    );
  }, [initialData]);

  const [query, setQuery] = useState('');
  const [editingMain, setEditingMain] = useState<FunctionSeoRecord | null>(null);
  const [editingFacet, setEditingFacet] = useState<{
    recordId: string;
    recordLabel: string;
    facet: SeoFacetLevel;
  } | null>(null);

  const [expandedIds, setExpandedIds] = useState(() => new Set(records.map((item) => item.id)));
  const [toast, setToast] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return records;
    return records.filter((item) => {
      const matchMain = `${item.label} ${item.path} ${item.module}`.toLowerCase().includes(q);
      const matchFacets = item.facetLevels?.some((f) =>
        `${f.title} ${f.pattern}`.toLowerCase().includes(q)
      );
      return matchMain || matchFacets;
    });
  }, [query, records]);

  const paginatedRecords = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    const lastPage = Math.max(1, Math.ceil(filtered.length / pageSize));
    if (currentPage > lastPage) setCurrentPage(lastPage);
  }, [currentPage, filtered.length, pageSize]);

  const saveMainSeo = () => {
    if (!editingMain || !editingMain.title.trim()) return;
    setRecords((current) =>
      current.map((item) =>
        item.id === editingMain.id ? { ...editingMain, updatedAt: new Date().toISOString() } : item
      )
    );
    setEditingMain(null);
    setToast('Đã lưu cấu hình SEO trang chính.');
    window.setTimeout(() => setToast(''), 3000);
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
    setToast(`Đã lưu mẫu SEO cho "${updatedFacet.title}".`);
    window.setTimeout(() => setToast(''), 3000);
  };

  const toggle = (id: string) =>
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const navigateTo = (href: string) => {
    window.history.pushState({}, '', href);
    window.dispatchEvent(new PopStateEvent('popstate'));
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
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xl animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      <CmsPageHeader
        icon={<SearchCheck />}
        title="Cấu hình SEO chức năng"
        description="Quản lý SEO cho trang chủ module, các trang lọc tiêu chí đơn lẻ và trang chi tiết."
        meta={
          <span className="rounded-md bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">
            {workspaceLocale.toUpperCase()} · {records.length} module
          </span>
        }
      />

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
                className="flex w-full items-center justify-between gap-3 p-3.5 text-left hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
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
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2.5">
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                      item.indexable
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {item.indexable ? 'index, follow' : 'noindex'}
                  </span>
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
                      </div>
                      <CmsButton size="sm" variant="secondary" leadingIcon={<Edit3 className="h-3 w-3" />} onClick={() => setEditingMain({ ...item })}>
                        Sửa SEO
                      </CmsButton>
                    </div>

                    {/* Nhánh con của Cấp 1 (1.1, 1.2, 1.3, 1.4) */}
                    {hasFacets && (
                      <div className="relative ml-4 pl-4 sm:ml-6 sm:pl-6 border-l-2 border-slate-200 dark:border-slate-800 space-y-2 py-0.5">
                        {item.facetLevels?.map((facet) => (
                          <div
                            key={facet.id}
                            className="relative flex items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900 transition-all hover:border-slate-300 dark:hover:border-slate-700"
                          >
                            {/* Branch connector line */}
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

                  {/* CẤP 2 (Trang danh mục đối với module Tin tức - ngang hàng Cấp 1) */}
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

                  {/* CẤP CHI TIẾT (ngang hàng Cấp 1, Cấp 2) */}
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
            className="rounded p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
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
            />
          </Field>

          <Field label="Meta Keywords">
            <input
              className={inputClass}
              value={value.keywords}
              onChange={(e) => onChange({ ...value, keywords: e.target.value })}
            />
          </Field>

          <Field label="Meta Description" count={`${value.description.length}/160`}>
            <textarea
              rows={3}
              className={inputClass}
              value={value.description}
              onChange={(e) => onChange({ ...value, description: e.target.value })}
            />
          </Field>

          <label className="flex items-center justify-between rounded-lg border border-slate-200 p-3 text-xs font-semibold dark:border-slate-700">
            <span className="text-slate-800 dark:text-slate-200">Cho phép Google index (lập chỉ mục)</span>
            <input
              type="checkbox"
              checked={value.indexable}
              onChange={(e) => onChange({ ...value, indexable: e.target.checked })}
              className="h-4 w-4 rounded text-orange-600"
            />
          </label>
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
            className="rounded p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
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
                className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
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

          <Field label="Từ khóa (Meta Keywords)">
            <input
              className={inputClass}
              value={formState.keywordsTemplate || ''}
              onChange={(e) => setFormState({ ...formState, keywordsTemplate: e.target.value })}
              placeholder="VD: {Tên danh mục}, phần mềm xây dựng, CIC"
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
