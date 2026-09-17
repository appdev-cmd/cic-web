import { ProductsView } from '@/web/components/ProductsView';
import { listPublishedProductsForReference } from '@/features/products/server/queries';
import { listPublishedProductApplications } from '@/features/product-applications/server/queries';
import { listPublishedProductCategories } from '@/features/product-categories/server/queries';
import { listPublishedProductTypes } from '@/features/product-types/server/queries';
import { listPublicProductContacts } from '@/features/sales-owners/server/queries';
import type { Metadata } from 'next';
export const dynamic='force-dynamic';

export const metadata: Metadata = {
  title: 'Sản phẩm & Giải pháp Công nghệ',
  description:
    'Danh mục phần mềm chuyên ngành xây dựng, giải pháp công nghệ kỹ thuật và thiết bị chuyên dụng hàng đầu từ CIC Technology.',
  alternates: {
    canonical: '/products',
  },
};

export default async function ProductsPage(){
  const [products, categories, applications, productTypes, contactsByProductId] = await Promise.all([
    listPublishedProductsForReference(),
    listPublishedProductCategories('vi'),
    listPublishedProductApplications('vi'),
    listPublishedProductTypes('vi'),
    listPublicProductContacts('vi'),
  ]);
  return <ProductsView products={products} contactsByProductId={contactsByProductId} categoryOptions={categories.map((item) => item.name)} applicationOptions={applications.map((item) => item.name)} productTypeOptions={productTypes.map((item) => item.name)}/>;
}
