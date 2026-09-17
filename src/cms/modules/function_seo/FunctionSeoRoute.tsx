import { can } from '@/server/auth/guards';
import { requireCmsPageAccess } from '@/server/auth/page-guards';
import { getFunctionSeoData, getRedirects, getSeoHealthMetrics } from '@/features/function-seo/server/queries';
import { FunctionSeoManager } from './FunctionSeoManager';

export async function FunctionSeoRoute() {
  const principal = await requireCmsPageAccess();
  if (!can(principal, 'function_seo', 'view')) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center text-sm font-semibold text-amber-800">
        Bạn không có quyền xem Cấu hình SEO & URL.
      </div>
    );
  }

  const [viData, enData, redirects, healthMetrics] = await Promise.all([
    getFunctionSeoData('vi'),
    getFunctionSeoData('en'),
    getRedirects(),
    getSeoHealthMetrics('vi'),
  ]);

  const capabilities = {
    canEdit: can(principal, 'function_seo', 'edit'),
  };

  return (
    <FunctionSeoManager
      initialData={{
        vi: viData,
        en: enData,
      }}
      initialRedirects={redirects}
      healthMetrics={healthMetrics}
      capabilities={capabilities}
    />
  );
}
