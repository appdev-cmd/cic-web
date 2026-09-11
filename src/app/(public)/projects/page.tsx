import { listPublishedProjects } from '@/features/projects/server/queries';
import { ProjectsRuntimeView } from '@/web/features/projects/ProjectsRuntimeView';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Dự Án Thực Tế | CIC Technology',
  description:
    'Minh chứng năng lực triển khai thực tế của CIC Technology qua hàng loạt công trình trọng điểm quốc gia.',
};

export default async function ProjectsPage() {
  const projects = await listPublishedProjects();
  return <ProjectsRuntimeView projects={projects} />;
}
