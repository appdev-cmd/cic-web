import { can } from '@/server/auth/guards';
import { requireCmsPageAccess } from '@/server/auth/page-guards';
import { listEmailTemplates } from '@/features/email-templates/server/queries';
import { EmailTemplatesScreen } from './EmailTemplatesScreen';

export async function EmailTemplatesRoute() {
  const principal = await requireCmsPageAccess();
  if (
    !can(principal, 'email_templates', 'view') &&
    !can(principal, 'contents', 'view') &&
    !principal.isAdministrator
  ) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center text-sm font-semibold text-amber-800">
        Bạn không có quyền xem Mẫu email.
      </div>
    );
  }

  const [vi, en] = await Promise.all([
    listEmailTemplates({ workspace: 'vi' }),
    listEmailTemplates({ workspace: 'en' }),
  ]);

  return (
    <EmailTemplatesScreen
      initialData={{ vi, en }}
      capabilities={{
        create: can(principal, 'email_templates', 'create') || can(principal, 'contents', 'create') || principal.isAdministrator,
        edit: can(principal, 'email_templates', 'edit') || can(principal, 'contents', 'edit') || principal.isAdministrator,
        delete: can(principal, 'email_templates', 'delete') || can(principal, 'contents', 'delete') || principal.isAdministrator,
      }}
    />
  );
}
