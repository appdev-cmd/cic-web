import { can } from '@/server/auth/guards';
import { requireCmsPageAccess } from '@/server/auth/page-guards';
import { getCmsNews } from '@/features/news/server/cms-queries';
import { NewsScreen } from './NewsScreen';

export async function NewsRoute(){const principal=await requireCmsPageAccess();if(!can(principal,'news','view'))return <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center text-sm font-semibold text-amber-800">Bạn không có quyền xem Tin tức.</div>;const [vi,en]=await Promise.all([getCmsNews('vi'),getCmsNews('en')]);return <NewsScreen data={{vi,en}} capabilities={{create:can(principal,'news','create'),edit:can(principal,'news','edit'),delete:can(principal,'news','delete')}}/>;}
