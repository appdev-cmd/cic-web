import { useMemo, useState } from 'react';

import type { ProductCategoryItem } from '@/features/product-categories/types';

export type CategoryStatusFilter = 'all' | 'active' | 'inactive';

export function useCategoryListState(categories: readonly ProductCategoryItem[]) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<CategoryStatusFilter>('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredCategories = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return categories.filter((category) =>
      (status === 'all' || (status === 'active') === category.published) &&
      `${category.name} ${category.alias} ${category.code ?? ''} ${category.description ?? ''}`
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [categories, query, status]);
  const visibleCategories = filteredCategories.slice((page - 1) * pageSize, page * pageSize);
  const allVisibleSelected = visibleCategories.length > 0 &&
    visibleCategories.every((category) => selectedIds.includes(category.id));
  const hasVisibleSelection = visibleCategories.some((category) =>
    selectedIds.includes(category.id));

  const changeQuery = (nextQuery: string) => {
    setQuery(nextQuery);
    setPage(1);
  };
  const changeStatus = (nextStatus: CategoryStatusFilter) => {
    setStatus(nextStatus);
    setPage(1);
  };
  const resetFilters = () => {
    setQuery('');
    setStatus('all');
    setPage(1);
  };
  const clearSelection = () => setSelectedIds([]);
  const toggleVisibleSelection = () => setSelectedIds((currentIds) =>
    allVisibleSelected
      ? currentIds.filter((id) => !visibleCategories.some((category) => category.id === id))
      : [...new Set([...currentIds, ...visibleCategories.map((category) => category.id)])]);
  const toggleCategorySelection = (categoryId: string) => setSelectedIds((currentIds) =>
    currentIds.includes(categoryId)
      ? currentIds.filter((id) => id !== categoryId)
      : [...currentIds, categoryId]);
  const changePageSize = (nextPageSize: number) => {
    setPageSize(nextPageSize);
    setPage(1);
  };

  return {
    query,
    status,
    page,
    pageSize,
    selectedIds,
    filteredCategories,
    visibleCategories,
    allVisibleSelected,
    hasVisibleSelection,
    setPage,
    changeQuery,
    changeStatus,
    resetFilters,
    clearSelection,
    toggleVisibleSelection,
    toggleCategorySelection,
    changePageSize,
  };
}
