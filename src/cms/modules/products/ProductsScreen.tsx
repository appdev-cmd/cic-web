'use client';

import { useCmsWorkspaceLocale } from '@/cms/context/CmsWorkspaceLocaleContext';
import type { getCmsProducts } from '@/features/products/server/cms-queries';
import { ProductsManager } from './ProductsManager';

type ProductData = Awaited<ReturnType<typeof getCmsProducts>>;

export function ProductsScreen({ data, capabilities }: Readonly<{
  data: Record<'vi' | 'en', ProductData>;
  capabilities: { create: boolean; edit: boolean; delete: boolean };
}>) {
  const locale = useCmsWorkspaceLocale();
  const current = data[locale];
  const version = current.products.map((item) => `${item.id}:${item.updated_time}`).join('|');
  return <ProductsManager key={`${locale}:${version}`} workspaceLocale={locale} data={current} capabilities={capabilities} />;
}
