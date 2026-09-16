import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublicStaticPage } from '@/features/static-pages/server/queries';
import { getPublishedHomePage } from '@/features/static-pages/server/homeResolver';
import { HomeRoute } from '../HomeRoute';
import { PublicLegalPageView } from '@/web/components/PublicLegalPageView';

export const dynamic = 'force-dynamic';

interface DynamicSlugPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: DynamicSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (slug === 'en') {
    return {
      title: 'CIC Technology — Strategic Technology Partner',
      description: 'Products, consulting services and engineering technology projects by CIC Technology.',
    };
  }
  const page = await getPublicStaticPage('vi', slug);
  if (!page) return { title: 'Trang không tồn tại | CIC Technology' };
  return {
    title: page.seoTitle || `${page.name} | CIC Technology`,
    description: page.seoDescription || `Thông tin chi tiết về ${page.name} tại CIC Technology.`,
  };
}

export default async function DynamicSlugPage({ params }: DynamicSlugPageProps) {
  const { slug } = await params;
  if (slug === 'en') {
    const enHomeContent = await getPublishedHomePage('en');
    return <HomeRoute initialContent={enHomeContent} />;
  }

  const page = await getPublicStaticPage('vi', slug);
  if (!page) {
    notFound();
  }

  return (
    <PublicLegalPageView
      pageData={page}
      defaultTitle={page.name}
      categoryTag="Pháp lý & Chính sách"
    />
  );
}
