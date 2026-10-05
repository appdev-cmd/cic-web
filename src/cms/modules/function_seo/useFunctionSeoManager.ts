import { useEffect, useMemo, useState } from 'react';
import type { CmsLocale } from '../../data/CmsDataSource';
import { useCmsWorkspaceLocale } from '@/cms/context/CmsWorkspaceLocaleContext';
import { useCmsToast } from '@/cms/context/CmsToastContext';
import { getCmsDictionary } from '@/cms/i18n/cmsDictionary';
import { updateFunctionSeo } from '@/features/function-seo/server/actions';
import type { FunctionSeoRecord, SeoFacetLevel } from '@/features/function-seo/types';

export interface UseFunctionSeoManagerProps {
  workspaceLocale?: CmsLocale;
  data?: FunctionSeoRecord[];
  initialData?: Record<'vi' | 'en', FunctionSeoRecord[]>;
}

export function useFunctionSeoManager({
  workspaceLocale: propLocale,
  data,
  initialData,
}: UseFunctionSeoManagerProps) {
  const contextLocale = useCmsWorkspaceLocale();
  const activeLocale: 'vi' | 'en' = (contextLocale || propLocale || 'vi') === 'en' ? 'en' : 'vi';
  const dict = getCmsDictionary(activeLocale);

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

  const { toast } = useCmsToast();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeSection, setActiveSection] = useState<'overview' | 'templates' | 'redirects'>('overview');
  const [healthFilter, setHealthFilter] = useState<'all' | 'noindex' | 'missing-description' | 'missing-owner'>('all');

  const notify = (msg: string) => {
    toast.success(msg);
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
      toast.error(err instanceof Error ? err.message : 'Không thể lưu cấu hình SEO.');
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
      toast.error(err instanceof Error ? err.message : 'Không thể cập nhật chỉ số lập chỉ mục.');
    }
  };

  const saveFacetSeo = (updatedFacet: SeoFacetLevel) => {
    if (!editingFacet) return;
    setRecords((current) =>
      current.map((item) => {
        if (item.id !== editingFacet.recordId) return item;
        const existing = item.facetLevels || [];
        const index = existing.findIndex((f) => f.id === updatedFacet.id);
        const updatedLevels =
          index >= 0
            ? existing.map((f, i) => (i === index ? updatedFacet : f))
            : [...existing, updatedFacet];
        return {
          ...item,
          updatedAt: new Date().toISOString(),
          facetLevels: updatedLevels,
        };
      })
    );
    setEditingFacet(null);
    notify(`Đã lưu mẫu SEO cho "${updatedFacet.title}".`);
  };

  const handleEditWarningDirect = (recordId: string) => {
    const target =
      records.find((r) => r.id === recordId || r.path === recordId || r.routeKey === recordId) ||
      records.find((r) => recordId.includes(r.path) || r.path.includes(recordId));

    if (target) {
      setEditingMain({ ...target });
    } else {
      toast.error('Không tìm thấy bản ghi cấu hình SEO tương ứng.');
    }
  };

  const toggleExpanded = (id: string) =>
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const navigateTo = (href: string) => {
    window.location.href = href;
  };

  return {
    activeLocale,
    dict,
    records,
    query,
    setQuery,
    editingMain,
    setEditingMain,
    editingFacet,
    setEditingFacet,
    expandedIds,
    toggleExpanded,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    activeSection,
    setActiveSection,
    healthFilter,
    setHealthFilter,
    filtered,
    paginatedRecords,
    saveMainSeo,
    toggleIndexable,
    saveFacetSeo,
    handleEditWarningDirect,
    navigateTo,
    notify,
  };
}
