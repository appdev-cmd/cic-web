'use client';

import { useCmsWorkspaceLocale } from '@/cms/context/CmsWorkspaceLocaleContext';
import type { ProductTypeModuleData } from '@/features/product-types/types';
import { ProductTypesManager } from './ProductTypesManager';

export function ProductTypesScreen({ data, capabilities }: Readonly<{ data: ProductTypeModuleData; capabilities: {create:boolean;edit:boolean;delete:boolean} }>) {
  const locale = useCmsWorkspaceLocale();
  return <ProductTypesManager key={locale} data={data} locale={locale} capabilities={capabilities} />;
}
