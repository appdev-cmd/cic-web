import { notFound } from 'next/navigation';
import { getPublishedServiceBySlug, getPublishedServiceProducts, listPublishedServices } from '@/features/services/server/queries';
import { BreadcrumbJsonLd, ServiceJsonLd } from '@/features/seo/components';
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
import { detailMetadata } from '@/lib/seo/detailMetadata';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const rawSlug = (await params).slug;
  const slug = decodeURIComponent(rawSlug);
  let service = await getPublishedServiceBySlug(slug, 'vi');
  if (!service && /-s\d+$/i.test(slug)) {
    service = await getPublishedServiceBySlug(slug.replace(/-s\d+$/i, ''), 'vi');
  }
  if (!service) return {};
  const rawTitle = service.seoTitle || service.title;
  return {
    ...detailMetadata(cleanSeoTitle(rawTitle), service.seoDescription || service.summary || `Tìm hiểu chi tiết về dịch vụ ${service.title} được cung cấp chuyên nghiệp bởi CIC Technology.`, `/services/${service.slug || slug}`),
    keywords: service.seoKeywords,
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const rawSlug = (await params).slug;
  const slug = decodeURIComponent(rawSlug);
  let service = await getPublishedServiceBySlug(slug, 'vi');

  if (!service && /-s\d+$/i.test(slug)) {
    const cleanSlug = slug.replace(/-s\d+$/i, '');
    service = await getPublishedServiceBySlug(cleanSlug, 'vi');
    if (service) {
      const { redirect, RedirectType } = await import('next/navigation');
      redirect(`/services/${service.slug || cleanSlug}`, RedirectType.replace);
    }
  }

  if (!service) notFound();
  const all = await listPublishedServices('vi');
  const products = await getPublishedServiceProducts('vi', service.relatedProductIds);

  return (
    <>
      <ServiceJsonLd name={service.title} description={service.summary} image={service.image} url={`/services/${service.slug}`} />
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
