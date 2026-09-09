import { getProductTypeModuleData } from '@/features/product-types/server/queries';
import { can } from '@/server/auth/guards';
import { requireCmsPageAccess } from '@/server/auth/page-guards';
import { ProductTypesScreen } from './ProductTypesScreen';

export async function ProductTypesRoute() {
  const principal = await requireCmsPageAccess();
  if (!can(principal, 'product_settings', 'view')) return <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center text-sm font-semibold text-amber-800">Bạn không có quyền xem Loại sản phẩm.</div>;
  const data = await getProductTypeModuleData();
  return <ProductTypesScreen data={data} capabilities={{ create:can(principal,'product_settings','create'), edit:can(principal,'product_settings','edit'), delete:can(principal,'product_settings','delete') }} />;
}
