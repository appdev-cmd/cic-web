import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublicStaticPage } from '@/features/static-pages/server/queries';
import { PublicLegalPageView } from '@/web/components/PublicLegalPageView';

export const dynamic = 'force-dynamic';

interface DynamicSlugPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: DynamicSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPublicStaticPage('vi', slug);
  if (!page) return { title: 'Trang không tồn tại | CIC Technology' };
  return {
    title: page.seoTitle || `${page.name} | CIC Technology`,
    description: page.seoDescription || `Thông tin chi tiết về ${page.name} tại CIC Technology.`,
  };
}

export default async function DynamicSlugPage({ params }: DynamicSlugPageProps) {
  const { slug } = await params;
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
