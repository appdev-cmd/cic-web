import { notFound } from 'next/navigation';

import { getPublishedProductBySlugForReference, listPublishedProductsForReference } from '@/features/products/server/queries';
import { listPublishedProductApplications } from '@/features/product-applications/server/queries';
import { listPublishedProductCategories } from '@/features/product-categories/server/queries';
import { listPublishedProductTypes } from '@/features/product-types/server/queries';
import { listPublicProductContacts } from '@/features/sales-owners/server/queries';
import { BreadcrumbJsonLd, ProductJsonLd } from '@/features/seo/components';
import { ProductsView } from '@/web/components/ProductsView';

export const dynamic = 'force-dynamic';

import { cleanSeoTitle } from '@/lib/seo/siteUrl';
import { detailMetadata } from '@/lib/seo/detailMetadata';

export async function generateMetadata({ params }: PageProps<'/products/[slug]'>) {
  const slug = (await params).slug;
  const product = await getPublishedProductBySlugForReference(slug);
  return product ? detailMetadata(cleanSeoTitle(product.seoTitle || product.name), product.seoDescription || product.description, `/products/${slug}`) : {};
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
  return (
    <>
      <ProductJsonLd
        name={product.name}
        description={product.description}
        image={product.img}
        brand={product.brand}
        url={`/products/${slug}`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Trang chủ', url: '/' },
          { name: 'Sản phẩm', url: '/products' },
          { name: product.name },
        ]}
      />
      <ProductsView products={products} previewProduct={product} contactsByProductId={contactsByProductId} categoryOptions={categories.map((item) => item.name)} applicationOptions={applications.map((item) => item.name)} productTypeOptions={productTypes.map((item) => item.name)} />
    </>
  );
}
