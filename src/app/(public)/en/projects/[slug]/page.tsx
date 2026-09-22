import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublishedProjectBySlug } from '@/features/projects/server/queries';
import { ProjectDetailRuntimeView } from '@/web/features/projects/ProjectDetailRuntimeView';
import { detailMetadata } from '@/lib/seo/detailMetadata';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug, 'en');
  if (!project) return { title: 'Project Not Found | CIC Technology' };

  return {
    ...detailMetadata(project.seoTitle || project.title, project.seoDescription || project.summary, `/en/projects/${slug}`),
    keywords: project.seoKeyword || undefined,
  };
}

export default async function EnProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug, 'en');
  if (!project) notFound();

  return <ProjectDetailRuntimeView project={project} />;
}
