import { can } from '@/server/auth/guards';
import { requireCmsPageAccess } from '@/server/auth/page-guards';
import { getMenuGroups, getAllMenuItems } from '@/features/menu/server/queries';
import { MenuManager } from './MenuManager';

export async function MenuRoute() {
  const principal = await requireCmsPageAccess();
  if (!can(principal, 'menu', 'view')) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center text-sm font-semibold text-amber-800">
        Bạn không có quyền xem Quản lý Menu.
      </div>
    );
  }

  const [viGroups, enGroups, viItems, enItems] = await Promise.all([
    getMenuGroups('vi'),
    getMenuGroups('en'),
    getAllMenuItems('vi'),
    getAllMenuItems('en'),
  ]);

  const capabilities = {
    canCreate: can(principal, 'menu', 'create'),
    canEdit: can(principal, 'menu', 'edit'),
    canDelete: can(principal, 'menu', 'delete'),
    canReorder: can(principal, 'menu', 'reorder'),
    canPublish: can(principal, 'menu', 'publish'),
  };

  return (
    <MenuManager
      initialData={{
        vi: { groups: viGroups, items: viItems },
        en: { groups: enGroups, items: enItems },
      }}
      capabilities={capabilities}
    />
  );
}
