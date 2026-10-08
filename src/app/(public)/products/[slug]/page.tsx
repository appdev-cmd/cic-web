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

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const rawSlug = (await params).slug;
  const slug = decodeURIComponent(rawSlug);
  let product = await getPublishedProductBySlugForReference(slug);
  if (!product && /-p\d+$/i.test(slug)) {
    product = await getPublishedProductBySlugForReference(slug.replace(/-p\d+$/i, ''));
  }
  return product ? detailMetadata(cleanSeoTitle(product.seoTitle || product.name), product.seoDescription || product.description, `/products/${product.slug || slug}`) : {};
}

export default async function ProductPage({ params }: ProductPageProps) {
  const rawSlug = (await params).slug;
  const slug = decodeURIComponent(rawSlug);
  let [product, products, categories, applications, productTypes, contactsByProductId] = await Promise.all([
    getPublishedProductBySlugForReference(slug),
    listPublishedProductsForReference(),
    listPublishedProductCategories('vi'),
    listPublishedProductApplications('vi'),
    listPublishedProductTypes('vi'),
    listPublicProductContacts('vi'),
  ]);

  if (!product && /-p\d+$/i.test(slug)) {
    const cleanSlug = slug.replace(/-p\d+$/i, '');
    product = await getPublishedProductBySlugForReference(cleanSlug);
    if (product) {
      const { redirect, RedirectType } = await import('next/navigation');
      redirect(`/products/${product.slug || cleanSlug}`, RedirectType.replace);
    }
  }

  if (!product) notFound();
  return (
    <>
      <ProductJsonLd
        name={product.name}
        description={product.description}
        image={product.img}
        brand={product.brand}
        price={product.price}
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
