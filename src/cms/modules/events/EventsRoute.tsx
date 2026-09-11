import { can } from '@/server/auth/guards';
import { requireCmsPageAccess } from '@/server/auth/page-guards';
import { getCmsEvents } from '@/features/events/server/cms-queries';
import { EventsScreen } from './EventsScreen';

export async function EventsRoute() {
  const principal = await requireCmsPageAccess();
  if (!can(principal, 'events', 'view')) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center text-sm font-semibold text-amber-800">
        Bạn không có quyền xem Sự kiện.
      </div>
    );
  }

  const [vi, en] = await Promise.all([
    getCmsEvents('vi'),
    getCmsEvents('en'),
  ]);

  return (
    <EventsScreen
      data={{ vi, en }}
      capabilities={{
        create: can(principal, 'events', 'create'),
        edit: can(principal, 'events', 'edit'),
        delete: can(principal, 'events', 'delete'),
      }}
    />
  );
}
