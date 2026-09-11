import { can } from '@/server/auth/guards';
import { requireCmsPageAccess } from '@/server/auth/page-guards';
import { getCmsProjects } from '@/features/projects/server/cms-queries';
import { ProjectsScreen } from './ProjectsScreen';

export async function ProjectsRoute() {
  const principal = await requireCmsPageAccess();
  if (!can(principal, 'projects', 'view') && !can(principal, 'contents', 'view') && !principal.isAdministrator) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center text-sm font-semibold text-amber-800">
        Bạn không có quyền xem Dự án.
      </div>
    );
  }

  const [vi, en] = await Promise.all([
    getCmsProjects('vi'),
    getCmsProjects('en'),
  ]);

  return (
    <ProjectsScreen
      data={{ vi, en }}
      capabilities={{
        create: can(principal, 'projects', 'create') || can(principal, 'contents', 'create') || principal.isAdministrator,
        edit: can(principal, 'projects', 'edit') || can(principal, 'contents', 'edit') || principal.isAdministrator,
        delete: can(principal, 'projects', 'delete') || can(principal, 'contents', 'delete') || principal.isAdministrator,
      }}
    />
  );
}
