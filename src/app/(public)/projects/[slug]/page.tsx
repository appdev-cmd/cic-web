import { notFound } from 'next/navigation';
import { getPublishedProjectBySlug } from '@/features/projects/server/queries';
import { ProjectDetailRuntimeView } from '@/web/features/projects/ProjectDetailRuntimeView';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);
  if (!project) return { title: 'Không tìm thấy dự án | CIC Technology' };

  return {
    title: `${project.seoTitle || project.title} | CIC Technology`,
    description: project.seoDescription || project.summary || undefined,
    keywords: project.seoKeyword || undefined,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);
  if (!project) notFound();

  return <ProjectDetailRuntimeView project={project} />;
}
