import type { Metadata } from 'next';
import { listPublishedProjects } from '@/features/projects/server/queries';
import { ProjectsRuntimeView } from '@/web/features/projects/ProjectsRuntimeView';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Key Case Studies & Engineering Projects | CIC',
  description: 'Explore landmark structural, infrastructure, and BIM engineering projects powered by CIC Technology solutions.',
  alternates: {
    canonical: '/en/projects',
  },
};

export default async function EnProjectsPage() {
  const projects = await listPublishedProjects('en');
  return <ProjectsRuntimeView projects={projects} />;
}
