import { getProductBrandModuleData } from '@/features/product-brands/server/queries';
import { can } from '@/server/auth/guards';
import { requireCmsPageAccess } from '@/server/auth/page-guards';
import { ProductBrandsScreen } from './ProductBrandsScreen';

export async function ProductBrandsRoute() {
  const principal = await requireCmsPageAccess();
  if (!can(principal, 'product_settings', 'view')) {
    return <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center text-sm font-semibold text-amber-800">Bạn không có quyền xem Hãng sản xuất.</div>;
  }
  const data = await getProductBrandModuleData();
  return <ProductBrandsScreen data={data} capabilities={{
    create: can(principal, 'product_settings', 'create'),
    edit: can(principal, 'product_settings', 'edit'),
    delete: can(principal, 'product_settings', 'delete'),
  }} />;
}
