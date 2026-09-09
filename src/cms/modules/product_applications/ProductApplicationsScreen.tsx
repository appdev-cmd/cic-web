'use client';

import { useCmsWorkspaceLocale } from '@/cms/context/CmsWorkspaceLocaleContext';
import type { ProductApplicationModuleData } from '@/features/product-applications/types';
import { ProductApplicationsManager } from './ProductApplicationsManager';

type Capabilities = { create: boolean; edit: boolean; delete: boolean };

export function ProductApplicationsScreen({ data, capabilities }: Readonly<{
  data: ProductApplicationModuleData;
  capabilities: Capabilities;
}>) {
  const locale = useCmsWorkspaceLocale();
  return <ProductApplicationsManager key={locale} data={data} locale={locale} capabilities={capabilities} />;
}
