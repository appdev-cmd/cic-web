import { can } from '@/server/auth/guards';
import { requireCmsPageAccess } from '@/server/auth/page-guards';
import { getCmsServices } from '@/features/services/server/cms-queries';
import { ServicesScreen } from './ServicesScreen';
export async function ServicesRoute(){const principal=await requireCmsPageAccess();if(!can(principal,'services','view'))return <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center text-sm font-semibold text-amber-800">Bạn không có quyền xem Dịch vụ.</div>;const[vi,en]=await Promise.all([getCmsServices('vi'),getCmsServices('en')]);return <ServicesScreen data={{vi,en}} capabilities={{create:can(principal,'services','create'),edit:can(principal,'services','edit'),delete:can(principal,'services','delete')}}/>;}
