'use client';
import { useCmsWorkspaceLocale } from '@/cms/context/CmsWorkspaceLocaleContext';
import type { getCmsProjects } from '@/features/projects/server/cms-queries';
import { ProjectsManager } from './ProjectsManager';

type Data = Awaited<ReturnType<typeof getCmsProjects>>;

export function ProjectsScreen({
  data,
  capabilities,
}: {
  data: Record<'vi' | 'en', Data>;
  capabilities: { create: boolean; edit: boolean; delete: boolean };
}) {
  const locale = useCmsWorkspaceLocale();
  const current = data[locale];
  const version = (current?.projects ?? []).map((item) => `${item.id}:${item.updated_time ?? item.created_time}`).join('|');

  return (
    <ProjectsManager
      key={`${locale}:${version}`}
      workspaceLocale={locale}
      data={current}
      capabilities={capabilities}
    />
  );
}
