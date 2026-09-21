import { notFound } from 'next/navigation';
import { getPublishedServiceBySlug, getPublishedServiceProducts, listPublishedServices } from '@/features/services/server/queries';
import { BreadcrumbJsonLd } from '@/features/seo/components';
import { ServicesRuntimeView } from '@/web/features/services/ServicesRuntimeView';

export const dynamic = 'force-dynamic';

const view = (service: NonNullable<Awaited<ReturnType<typeof getPublishedServiceBySlug>>>) => ({
  id: service.id,
  slug: service.slug,
  title: service.title,
  tagline: service.summary,
  shortDesc: service.summary,
  category: 'Dịch vụ CIC',
  image: service.image,
  htmlContent: service.content,
  relatedProductIds: service.relatedProductIds,
});

import { cleanSeoTitle } from '@/lib/seo/siteUrl';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const service = await getPublishedServiceBySlug((await params).slug, 'vi');
  if (!service) return {};
  const rawTitle = service.seoTitle || service.title;
  return {
    title: cleanSeoTitle(rawTitle),
    description: service.seoDescription || service.summary || `Tìm hiểu chi tiết về dịch vụ ${service.title} được cung cấp chuyên nghiệp bởi CIC Technology.`,
    keywords: service.seoKeywords,
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const service = await getPublishedServiceBySlug((await params).slug, 'vi');
  if (!service) notFound();
  const all = await listPublishedServices('vi');
  const products = await getPublishedServiceProducts('vi', service.relatedProductIds);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Trang chủ', url: '/' },
          { name: 'Dịch vụ', url: '/services' },
          { name: service.title },
        ]}
      />
      <ServicesRuntimeView
        services={[view(service), ...all.filter((item) => item.id !== service.id).map(view)]}
        products={products}
        initialServiceId={service.id}
      />
    </>
  );
}

