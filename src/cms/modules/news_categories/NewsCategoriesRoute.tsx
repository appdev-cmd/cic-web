import { getNewsCategoryModuleData } from '@/features/news-categories/server/queries';
import { can } from '@/server/auth/guards';
import { requireCmsPageAccess } from '@/server/auth/page-guards';
import { NewsCategoriesScreen } from './NewsCategoriesScreen';

export async function NewsCategoriesRoute() {
  const principal = await requireCmsPageAccess();
  if (!can(principal,'news','view')) return <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center text-sm font-semibold text-amber-800">Bạn không có quyền xem Danh mục tin tức.</div>;
  const data=await getNewsCategoryModuleData();
  return <NewsCategoriesScreen data={data} capabilities={{create:can(principal,'news','create'),edit:can(principal,'news','edit'),delete:can(principal,'news','delete')}}/>;
}
