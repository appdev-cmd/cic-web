import { can } from '@/server/auth/guards';
import { requireCmsPageAccess } from '@/server/auth/page-guards';
import { getCmsProducts } from '@/features/products/server/cms-queries';
import { ProductsScreen } from './ProductsScreen';

export async function ProductsRoute() {
  const principal = await requireCmsPageAccess();
  if (!can(principal, 'products', 'view')) {
    return <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center text-sm font-semibold text-amber-800">Bạn không có quyền xem Sản phẩm.</div>;
  }
  // Keep instant workspace switching while avoiding two five-query locale bursts.
  const vi = await getCmsProducts('vi');
  const en = await getCmsProducts('en');
  return <ProductsScreen data={{ vi, en }} capabilities={{
    create: can(principal, 'products', 'create'),
    edit: can(principal, 'products', 'edit'),
    delete: can(principal, 'products', 'delete'),
  }} />;
}
