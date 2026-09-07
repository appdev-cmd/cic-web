'use client';

import { FolderTree, Plus } from 'lucide-react';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import {
  bulkSetProductCategoriesPublishedAction,
  saveProductCategoryAction,
  trashProductCategoryAction,
} from '@/features/product-categories/server/actions';
import type {
  ProductCategoryItem,
  ProductCategoryLocale,
  ProductCategoryModuleData,
} from '@/features/product-categories/types';
import { CmsButton } from '../../components/ui/CmsButton';
import { CmsPageHeader } from '../../components/ui/CmsPageHeader';
import { CategoryDeleteDialog } from './CategoryDeleteDialog';
import { CategoryFormDrawer, type CategoryFormValues } from './CategoryFormDrawer';
import { CategoryTable } from './CategoryTable';
import { CategoryToolbar } from './CategoryToolbar';
import { useCategoryListState } from './useCategoryListState';

export type ProductCategoryCapabilities = {
  create: boolean;
  edit: boolean;
  delete: boolean;
};

type ProductCategoriesManagerProps = {
  data: ProductCategoryModuleData;
  locale: ProductCategoryLocale;
  capabilities: ProductCategoryCapabilities;
};

export function ProductCategoriesManager({
  data,
  locale,
  capabilities,
}: ProductCategoriesManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingCategory, setEditingCategory] = useState<ProductCategoryItem | null | undefined>();
  const [deletingCategory, setDeletingCategory] = useState<ProductCategoryItem | null>(null);
  const [message, setMessage] = useState('');
  const categories = data[locale];
  const list = useCategoryListState(categories);

  const runMutation = (mutation: () => Promise<unknown>, successMessage: string) => {
    startTransition(async () => {
      try {
        await mutation();
        setMessage(successMessage);
        list.clearSelection();
        setEditingCategory(undefined);
        setDeletingCategory(null);
        router.refresh();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Không thể hoàn tất thao tác.');
      }
    });
  };

  const handleBulkDeactivate = () => runMutation(
    () => bulkSetProductCategoriesPublishedAction(locale, list.selectedIds, false),
    `Đã ngừng sử dụng ${list.selectedIds.length} danh mục.`,
  );

  const handleSave = (values: CategoryFormValues) => runMutation(
    () => saveProductCategoryAction(locale, editingCategory?.id ?? null, values),
    editingCategory ? 'Đã cập nhật danh mục.' : 'Đã tạo danh mục.',
  );

  const handleDeactivate = (category: ProductCategoryItem) => runMutation(
    () => bulkSetProductCategoriesPublishedAction(locale, [category.id], false),
    `Đã ngừng sử dụng “${category.name}”.`,
  );

  const handleTrash = (category: ProductCategoryItem) => runMutation(
    () => trashProductCategoryAction(locale, category.id),
    `Đã chuyển “${category.name}” vào Thùng rác.`,
  );

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-200">
      {message && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-40 max-w-[calc(100vw-3rem)] rounded-xl bg-slate-900 px-4 py-3 text-xs font-bold text-white shadow-2xl"
        >
          {message}
        </div>
      )}
      <CmsPageHeader
        icon={<FolderTree />}
        title="Danh mục sản phẩm"
        description="Quản lý cấu trúc danh mục sản phẩm."
        actions={capabilities.create ? (
          <CmsButton
            variant="primary"
            size="sm"
            leadingIcon={<Plus />}
            onClick={() => setEditingCategory(null)}
          >
            Thêm danh mục sản phẩm
          </CmsButton>
        ) : undefined}
      />
      <CategoryToolbar
        query={list.query}
        status={list.status}
        selectedCount={list.selectedIds.length}
        canEdit={capabilities.edit}
        onQueryChange={list.changeQuery}
        onStatusChange={list.changeStatus}
        onReset={list.resetFilters}
        onClearSelection={list.clearSelection}
        onBulkDeactivate={handleBulkDeactivate}
      />
      <CategoryTable
        categories={list.visibleCategories}
        selectedIds={list.selectedIds}
        allVisibleSelected={list.allVisibleSelected}
        hasVisibleSelection={list.hasVisibleSelection}
        canEdit={capabilities.edit}
        canDelete={capabilities.delete}
        page={list.page}
        pageSize={list.pageSize}
        totalCount={list.filteredCategories.length}
        onToggleVisible={list.toggleVisibleSelection}
        onToggleCategory={list.toggleCategorySelection}
        onEdit={setEditingCategory}
        onDelete={setDeletingCategory}
        onPageChange={list.setPage}
        onPageSizeChange={list.changePageSize}
      />
      {editingCategory !== undefined && (
        <CategoryFormDrawer
          item={editingCategory}
          items={categories}
          locale={locale}
          pending={isPending}
          onClose={() => setEditingCategory(undefined)}
          onSave={handleSave}
        />
      )}
      {deletingCategory && (
        <CategoryDeleteDialog
          item={deletingCategory}
          pending={isPending}
          onClose={() => setDeletingCategory(null)}
          onDeactivate={() => handleDeactivate(deletingCategory)}
          onTrash={() => handleTrash(deletingCategory)}
        />
      )}
    </div>
  );
}
