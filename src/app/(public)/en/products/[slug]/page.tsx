import type { Metadata } from 'next';
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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const slug = (await params).slug;
  const product = await getPublishedProductBySlugForReference(slug, 'en');
  if (!product) return {};
  return {
    title: cleanSeoTitle(product.seoTitle || product.name),
    description: product.seoDescription || product.description,
    alternates: {
      canonical: `/en/products/${slug}`,
    },
  };
}

export default async function EnProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const [product, products, categories, applications, productTypes, contactsByProductId] = await Promise.all([
    getPublishedProductBySlugForReference(slug, 'en'),
    listPublishedProductsForReference('en'),
    listPublishedProductCategories('en').catch(() => []),
    listPublishedProductApplications('en').catch(() => []),
    listPublishedProductTypes('en').catch(() => []),
    listPublicProductContacts('en').catch(() => ({})),
  ]);

  if (!product) notFound();

  return (
    <>
      <ProductJsonLd
        name={product.name}
        description={product.description}
        image={product.img}
        brand={product.brand}
        url={`/en/products/${slug}`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/en' },
          { name: 'Products', url: '/en/products' },
          { name: product.name },
        ]}
      />
      <ProductsView
        products={products}
        previewProduct={product}
        contactsByProductId={contactsByProductId}
        categoryOptions={categories.map((item) => item.name)}
        applicationOptions={applications.map((item) => item.name)}
        productTypeOptions={productTypes.map((item) => item.name)}
      />
    </>
  );
}
