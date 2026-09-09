import { notFound } from 'next/navigation';

import { listPublishedProductsForReference } from '@/features/products/server/queries';
import { listPublishedProductApplications } from '@/features/product-applications/server/queries';
import { listPublishedProductCategories } from '@/features/product-categories/server/queries';
import { listPublishedProductTypes } from '@/features/product-types/server/queries';
import { ProductsView } from '@/web/components/ProductsView';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps<'/products/[slug]'>) {
  const slug = (await params).slug;
  const product = (await listPublishedProductsForReference()).find((item) => item.slug === slug);
  return product ? { title: `${product.name} | CIC`, description: product.description } : {};
}

export default async function ProductPage({ params }: PageProps<'/products/[slug]'>) {
  const slug = (await params).slug;
  const [products, categories, applications, productTypes] = await Promise.all([
    listPublishedProductsForReference(),
    listPublishedProductCategories('vi'),
    listPublishedProductApplications('vi'),
    listPublishedProductTypes('vi'),
  ]);
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();
  return <ProductsView products={products} previewProduct={product} categoryOptions={categories.map((item) => item.name)} applicationOptions={applications.map((item) => item.name)} productTypeOptions={productTypes.map((item) => item.name)} />;
}
