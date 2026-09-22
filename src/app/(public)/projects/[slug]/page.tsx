import { notFound } from 'next/navigation';
import { getPublishedProjectBySlug } from '@/features/projects/server/queries';
import { ProjectDetailRuntimeView } from '@/web/features/projects/ProjectDetailRuntimeView';
import type { Metadata } from 'next';
import { detailMetadata } from '@/lib/seo/detailMetadata';

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
    ...detailMetadata(project.seoTitle || project.title, project.seoDescription || project.summary, `/projects/${slug}`),
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
