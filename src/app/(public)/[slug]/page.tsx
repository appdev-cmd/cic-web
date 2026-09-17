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
  if (slug === 'gioi-thieu') {
    return {
      title: 'Về CIC Technology | Đối tác công nghệ chiến lược',
      description: 'Tìm hiểu về lịch sử hình thành, tầm nhìn sứ mệnh và các cột mốc phát triển của CIC Technology.',
    };
  }
  if (slug === 'lien-he' || slug === 'contact') {
    return {
      title: 'Liên hệ | CIC Technology',
      description: 'Thông tin liên hệ, trụ sở chính và các chi nhánh của CIC Technology.',
    };
  }
  if (slug === 'en') {
    return {
      title: 'CIC Technology — Strategic Technology Partner',
      description: 'Products, consulting services and engineering technology projects by CIC Technology.',
    };
  }
  const page = (await getPublicStaticPage('vi', slug)) ?? (await getPublicStaticPage('en', slug));
  if (!page) return { title: 'Trang không tồn tại | CIC Technology' };
  return {
    title: page.seoTitle || `${page.name} | CIC Technology`,
    description: page.seoDescription || `Thông tin chi tiết về ${page.name} tại CIC Technology.`,
  };
}

export default async function DynamicSlugPage({ params }: DynamicSlugPageProps) {
  const { slug } = await params;
  if (slug === 'gioi-thieu') {
    const { redirect } = await import('next/navigation');
    redirect('/gioi-thieu');
  }
  if (slug === 'lien-he') {
    const { redirect } = await import('next/navigation');
    redirect('/lien-he');
  }
  if (slug === 'contact') {
    const { redirect } = await import('next/navigation');
    redirect('/contact');
  }
  if (slug === 'en') {
    const enHomeContent = await getPublishedHomePage('en');
    return <HomeRoute initialContent={enHomeContent} />;
  }

  const page = (await getPublicStaticPage('vi', slug)) ?? (await getPublicStaticPage('en', slug));
  if (!page) {
    notFound();
  }

  const categoryTag = page.code.includes('privacy')
    ? 'BẢO VỆ DỮ LIỆU CÁ NHÂN'
    : page.code.includes('terms')
    ? 'QUY ĐỊNH & PHÁP LÝ'
    : 'THÔNG TIN CHUẨN';

  return (
    <PublicLegalPageView
      pageData={page}
      defaultTitle={page.name}
      categoryTag={categoryTag}
    />
  );
}
