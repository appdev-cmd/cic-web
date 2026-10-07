import type { Metadata } from 'next';
import { notFound, redirect, RedirectType } from 'next/navigation';
import { getPublicStaticPage } from '@/features/static-pages/server/queries';
import { PublicLegalPageView } from '@/web/components/PublicLegalPageView';
import { cleanSeoTitle } from '@/lib/seo/siteUrl';

export const dynamic = 'force-dynamic';

interface EnDynamicSlugPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: EnDynamicSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (slug === 'about' || slug === 'gioi-thieu') {
    return {
      title: 'About CIC | Strategic Engineering Partner',
      description: 'Learn about CIC journey, corporate leadership, technological capabilities, and strategic vision.',
    };
  }
  if (slug === 'contact' || slug === 'lien-he') {
    return {
      title: 'Contact Us | CIC Technology',
      description: 'Contact information, headquarters and branch offices of CIC Technology.',
    };
  }

  const page = (await getPublicStaticPage('en', slug)) ?? (await getPublicStaticPage('vi', slug));
  if (!page) {
    const { resolveRedirect } = await import('@/features/function-seo/server/queries');
    const redirectMatch = (await resolveRedirect(`/en/${slug}`)) ?? (await resolveRedirect(`/${slug}`));
    if (redirectMatch && !redirectMatch.targetPath.startsWith('//')) {
      redirect(redirectMatch.targetPath, redirectMatch.statusCode === 301 ? RedirectType.replace : RedirectType.push);
    }
    return { title: 'Page Not Found | CIC Technology' };
  }

  return {
    title: cleanSeoTitle(page.seoTitle || `${page.name} | CIC Technology`),
    description: page.seoDescription || `Information about ${page.name} at CIC Technology.`,
    alternates: {
      canonical: `/en/${slug}`,
    },
  };
}

export default async function EnDynamicSlugPage({ params }: EnDynamicSlugPageProps) {
  const { slug } = await params;

  // Aliases and canonical redirects
  if (slug === 'about' || slug === 'gioi-thieu') {
    redirect('/en/about');
  }
  if (slug === 'contact' || slug === 'lien-he') {
    redirect('/en/contact');
  }
  if (slug === 'events') {
    redirect('/en/events');
  }
  if (slug === 'products') {
    redirect('/en/products');
  }
  if (slug === 'services') {
    redirect('/en/services');
  }
  if (slug === 'projects') {
    redirect('/en/projects');
  }
  if (slug === 'news') {
    redirect('/en/news');
  }

  const page = (await getPublicStaticPage('en', slug)) ?? (await getPublicStaticPage('vi', slug));
  if (!page) {
    const { resolveRedirect } = await import('@/features/function-seo/server/queries');
    const redirectMatch = (await resolveRedirect(`/en/${slug}`)) ?? (await resolveRedirect(`/${slug}`));
    if (redirectMatch && !redirectMatch.targetPath.startsWith('//')) {
      redirect(redirectMatch.targetPath, redirectMatch.statusCode === 301 ? RedirectType.replace : RedirectType.push);
    }
    notFound();
  }

  const categoryTag = page.code.includes('privacy')
    ? 'DATA PRIVACY & PROTECTION'
    : page.code.includes('terms')
    ? 'TERMS & LEGAL'
    : 'OFFICIAL INFORMATION';

  return (
    <PublicLegalPageView
      pageData={page}
      defaultTitle={page.name}
      categoryTag={categoryTag}
    />
  );
}
