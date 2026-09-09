import { getProductApplicationModuleData } from '@/features/product-applications/server/queries';
import { can } from '@/server/auth/guards';
import { requireCmsPageAccess } from '@/server/auth/page-guards';
import { ProductApplicationsScreen } from './ProductApplicationsScreen';

export async function ProductApplicationsRoute() {
  const principal = await requireCmsPageAccess();
  if (!can(principal, 'product_settings', 'view')) {
    return <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center text-sm font-semibold text-amber-800">Bạn không có quyền xem Lĩnh vực ứng dụng.</div>;
  }
  const data = await getProductApplicationModuleData();
  return <ProductApplicationsScreen data={data} capabilities={{
    create: can(principal, 'product_settings', 'create'),
    edit: can(principal, 'product_settings', 'edit'),
    delete: can(principal, 'product_settings', 'delete'),
  }} />;
}
