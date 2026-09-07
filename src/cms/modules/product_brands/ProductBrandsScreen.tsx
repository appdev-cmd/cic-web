'use client';

import { useCmsWorkspaceLocale } from '@/cms/context/CmsWorkspaceLocaleContext';
import type { ProductBrandModuleData } from '@/features/product-brands/types';
import { ProductBrandsManager } from './ProductBrandsManager';

type Capabilities = { create: boolean; edit: boolean; delete: boolean };

export function ProductBrandsScreen({ data, capabilities }: Readonly<{ data: ProductBrandModuleData; capabilities: Capabilities }>) {
  const locale = useCmsWorkspaceLocale();
  return <ProductBrandsManager key={locale} data={data} locale={locale} capabilities={capabilities} />;
}
