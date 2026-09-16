import { can } from '@/server/auth/guards';
import { requireCmsPageAccess } from '@/server/auth/page-guards';
import { getCmsStaticPagesList } from '@/features/static-pages/server/queries';
import { StaticPagesScreen } from './StaticPagesScreen';

export async function StaticPagesRoute() {
  const principal = await requireCmsPageAccess();
  if (!can(principal, 'static_pages', 'view')) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center text-sm font-semibold text-amber-800">
        Bạn không có quyền xem Trang nội dung.
      </div>
    );
  }

  const [viPages, enPages] = await Promise.all([
    getCmsStaticPagesList('vi'),
    getCmsStaticPagesList('en'),
  ]);

  const capabilities = {
    edit: can(principal, 'static_pages', 'edit'),
    publish: can(principal, 'static_pages', 'publish'),
    createLegal: can(principal, 'static_pages', 'create_legal'),
  };

  return (
    <StaticPagesScreen
      pagesByLocale={{ vi: viPages, en: enPages }}
      capabilities={capabilities}
    />
  );
}
