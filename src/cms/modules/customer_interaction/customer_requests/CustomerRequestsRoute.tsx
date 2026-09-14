import { can } from '@/server/auth/guards';
import { requireCmsPageAccess } from '@/server/auth/page-guards';
import { listCustomerRequests } from '@/features/customer-requests/server/queries';
import { CustomerRequestsScreen } from './CustomerRequestsScreen';

export async function CustomerRequestsRoute() {
  const principal = await requireCmsPageAccess();
  if (
    !can(principal, 'customer_requests', 'view') &&
    !can(principal, 'contents', 'view') &&
    !principal.isAdministrator
  ) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center text-sm font-semibold text-amber-800">
        Bạn không có quyền xem Yêu cầu khách hàng.
      </div>
    );
  }

  const [vi, en] = await Promise.all([
    listCustomerRequests({ workspace: 'vi', page: 1, pageSize: 10 }),
    listCustomerRequests({ workspace: 'en', page: 1, pageSize: 10 }),
  ]);

  return (
    <CustomerRequestsScreen
      initialData={{ vi, en }}
      capabilities={{
        edit:
          can(principal, 'customer_requests', 'edit') ||
          can(principal, 'contents', 'edit') ||
          principal.isAdministrator,
        delete:
          can(principal, 'customer_requests', 'delete') ||
          can(principal, 'contents', 'delete') ||
          principal.isAdministrator,
      }}
    />
  );
}
