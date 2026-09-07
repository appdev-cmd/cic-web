'use client';

import { useCmsWorkspaceLocale } from '@/cms/context/CmsWorkspaceLocaleContext';
import type { ProductCategoryModuleData } from '@/features/product-categories/types';
import { ProductCategoriesManager } from './ProductCategoriesManager';

type Capabilities = { create: boolean; edit: boolean; delete: boolean };

export function ProductCategoriesScreen({ data, capabilities }: Readonly<{ data: ProductCategoryModuleData; capabilities: Capabilities }>) {
  const locale = useCmsWorkspaceLocale();
  return <ProductCategoriesManager key={locale} data={data} locale={locale} capabilities={capabilities} />;
}
