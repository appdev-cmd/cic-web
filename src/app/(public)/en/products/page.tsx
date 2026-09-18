import type { Metadata } from 'next';
import { ProductsView } from '@/web/components/ProductsView';
import { listPublishedProductsForReference } from '@/features/products/server/queries';
import { listPublishedProductApplications } from '@/features/product-applications/server/queries';
import { listPublishedProductCategories } from '@/features/product-categories/server/queries';
import { listPublishedProductTypes } from '@/features/product-types/server/queries';
import { listPublicProductContacts } from '@/features/sales-owners/server/queries';

export const revalidate = 120;

export const metadata: Metadata = {
  title: 'Engineering Software & Technology Solutions | CIC',
  description: 'Explore our comprehensive portfolio of licensed structural analysis, BIM, geotechnical software, and specialized engineering technologies.',
  alternates: {
    canonical: '/en/products',
  },
};

export default async function EnProductsPage() {
  const [products, categories, applications, productTypes, contactsByProductId] = await Promise.all([
    listPublishedProductsForReference('en'),
    listPublishedProductCategories('en').catch(() => []),
    listPublishedProductApplications('en').catch(() => []),
    listPublishedProductTypes('en').catch(() => []),
    listPublicProductContacts('en').catch(() => ({})),
  ]);

  return (
    <ProductsView
      products={products}
      contactsByProductId={contactsByProductId}
      categoryOptions={categories.map((item) => item.name)}
      applicationOptions={applications.map((item) => item.name)}
      productTypeOptions={productTypes.map((item) => item.name)}
    />
  );
}
