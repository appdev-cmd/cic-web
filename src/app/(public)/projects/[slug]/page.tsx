import { notFound } from 'next/navigation';
import { getPublishedProjectBySlug } from '@/features/projects/server/queries';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const project = await getPublishedProjectBySlug((await params).slug);
  return project ? { title: project.title, description: project.summary ?? undefined } : { title: 'Project not found' };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);
  if (!project) notFound();
  return <article className="mx-auto max-w-4xl px-6 py-16"><p className="text-sm uppercase tracking-wide text-slate-500">{project.sector ?? 'Project'}</p><h1 className="mt-2 text-4xl font-semibold">{project.title}</h1>{project.summary && <p className="mt-4 text-lg text-slate-600">{project.summary}</p>}<dl className="mt-8 grid gap-4 sm:grid-cols-2">{project.customerName && <div><dt className="text-sm text-slate-500">Customer</dt><dd>{project.customerName}</dd></div>}{project.location && <div><dt className="text-sm text-slate-500">Location</dt><dd>{project.location}</dd></div>}</dl></article>;
}
