import { notFound } from 'next/navigation';

import { getPublishedProductBySlugForReference, listPublishedProductsForReference } from '@/features/products/server/queries';
import { listPublishedProductApplications } from '@/features/product-applications/server/queries';
import { listPublishedProductCategories } from '@/features/product-categories/server/queries';
import { listPublishedProductTypes } from '@/features/product-types/server/queries';
import { listPublicProductContacts } from '@/features/sales-owners/server/queries';
import { ProductsView } from '@/web/components/ProductsView';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps<'/products/[slug]'>) {
  const slug = (await params).slug;
  const product = await getPublishedProductBySlugForReference(slug);
  return product ? { title: product.seoTitle || `${product.name} | CIC`, description: product.seoDescription || product.description } : {};
}

export default async function ProductPage({ params }: PageProps<'/products/[slug]'>) {
  const slug = (await params).slug;
  const [product, products, categories, applications, productTypes, contactsByProductId] = await Promise.all([
    getPublishedProductBySlugForReference(slug),
    listPublishedProductsForReference(),
    listPublishedProductCategories('vi'),
    listPublishedProductApplications('vi'),
    listPublishedProductTypes('vi'),
    listPublicProductContacts('vi'),
  ]);
  if (!product) notFound();
  return <ProductsView products={products} previewProduct={product} contactsByProductId={contactsByProductId} categoryOptions={categories.map((item) => item.name)} applicationOptions={applications.map((item) => item.name)} productTypeOptions={productTypes.map((item) => item.name)} />;
}
