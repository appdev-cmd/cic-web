import type { Metadata } from 'next';
import { getPublishedHomePage } from '@/features/static-pages/server/homeResolver';
import { HomeRoute } from '../HomeRoute';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'CIC Technology — Strategic Engineering Technology Partner',
  description: 'Licensed engineering software, BIM technologies, digital transformation, and specialized consulting by CIC Technology.',
  alternates: {
    canonical: '/en',
  },
};

export default async function EnHomePage() {
  const homeContent = await getPublishedHomePage('en');
  return <HomeRoute initialContent={homeContent} />;
}
