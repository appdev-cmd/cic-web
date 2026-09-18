import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublishedServiceBySlug, getPublishedServiceProducts, listPublishedServices } from '@/features/services/server/queries';
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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const slug = (await params).slug;
  const service = await getPublishedServiceBySlug(slug, 'en');
  if (!service) return {};
  return {
    title: service.seoTitle || `${service.title} | CIC Consulting`,
    description: service.seoDescription || service.summary,
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
    <ServicesRuntimeView
      services={[view(service), ...all.filter((item) => item.id !== service.id).map(view)]}
      products={products}
      initialServiceId={service.id}
    />
  );
}
