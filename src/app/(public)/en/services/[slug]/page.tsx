import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublishedServiceBySlug, getPublishedServiceProducts, listPublishedServices } from '@/features/services/server/queries';
import { BreadcrumbJsonLd } from '@/features/seo/components';
import { ServicesRuntimeView } from '@/web/features/services/ServicesRuntimeView';

export const dynamic = 'force-dynamic';

const view = (s: any) => ({
  id: s.id,
  slug: s.slug,
  title: s.title,
  tagline: s.summary,
  shortDesc: s.summary,
  category: 'CIC Consulting Services',
  image: s.image,
  htmlContent: s.content,
  relatedProductIds: s.relatedProductIds,
});

import { cleanSeoTitle } from '@/lib/seo/siteUrl';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const slug = (await params).slug;
  const service = await getPublishedServiceBySlug(slug, 'en');
  if (!service) return {};
  const rawTitle = service.seoTitle || service.title;
  return {
    title: cleanSeoTitle(rawTitle),
    description: service.seoDescription || service.summary || `Discover professional ${service.title} services provided by CIC Technology.`,
    keywords: service.seoKeywords,
    alternates: {
      canonical: `/en/services/${slug}`,
    },
  };
}

export default async function EnServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const service = await getPublishedServiceBySlug(slug, 'en');
  if (!service) notFound();

  const [all, products] = await Promise.all([
    listPublishedServices('en'),
    getPublishedServiceProducts('en', service.relatedProductIds),
  ]);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/en' },
          { name: 'Services', url: '/en/services' },
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
