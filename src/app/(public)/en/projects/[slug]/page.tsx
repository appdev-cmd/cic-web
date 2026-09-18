import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublishedProjectBySlug } from '@/features/projects/server/queries';
import { ProjectDetailRuntimeView } from '@/web/features/projects/ProjectDetailRuntimeView';

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
    title: `${project.seoTitle || project.title} | CIC Technology`,
    description: project.seoDescription || project.summary || undefined,
    keywords: project.seoKeyword || undefined,
    alternates: {
      canonical: `/en/projects/${slug}`,
    },
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
