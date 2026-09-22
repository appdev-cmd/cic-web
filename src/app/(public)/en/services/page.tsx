import type { Metadata } from 'next';
import { getPublishedServiceProducts, listPublishedServices } from '@/features/services/server/queries';
import { ServicesRuntimeView } from '@/web/features/services/ServicesRuntimeView';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Specialized Engineering Consulting Services | CIC',
  description: 'Professional engineering advisory, BIM/GIS technology handover, and certified corporate training by CIC experts.',
  alternates: {
    canonical: '/en/services',
  },
};

import type { ServiceViewModel } from '@/features/services/types';

const view = (s: ServiceViewModel) => ({
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

export default async function EnServicesPage() {
  const services = await listPublishedServices('en');
  const allProductIds = Array.from(new Set(services.flatMap((s) => s.relatedProductIds)));
  const products = await getPublishedServiceProducts('en', allProductIds);

  return <ServicesRuntimeView services={services.map(view)} products={products} />;
}
