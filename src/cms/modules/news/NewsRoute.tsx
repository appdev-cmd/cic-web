import { cookies } from 'next/headers';
import { can } from '@/server/auth/guards';
import { requireCmsPageAccess } from '@/server/auth/page-guards';
import { getCmsNews } from '@/features/news/server/cms-queries';
import { NewsScreen } from './NewsScreen';
import type { NewsLocale } from '@/features/news/server/placement';

export async function NewsRoute() {
  const principal = await requireCmsPageAccess();
  if (!can(principal, 'news', 'view')) {
    return <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center text-sm font-semibold text-amber-800">Bạn không có quyền xem Tin tức.</div>;
  }

  const cookieStore = await cookies();
  const rawLocale = cookieStore.get('cms_workspace_locale')?.value;
  const currentLocale: NewsLocale = rawLocale === 'en' ? 'en' : 'vi';

  const currentNews = await getCmsNews(currentLocale);
  const emptyNews: typeof currentNews = { articles: [], categories: [], relatedProducts: [], mediaImages: [] };

  const data = {
    vi: currentLocale === 'vi' ? currentNews : emptyNews,
    en: currentLocale === 'en' ? currentNews : emptyNews,
  };

  return <NewsScreen data={data} capabilities={{
    create: can(principal, 'news', 'create'),
    edit: can(principal, 'news', 'edit'),
    delete: can(principal, 'news', 'delete'),
  }} />;
}
