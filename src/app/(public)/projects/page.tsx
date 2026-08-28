/* eslint-disable @next/next/no-img-element -- project media URLs are database-managed legacy assets. */
import { listPublishedProjects } from '@/features/projects/server/queries';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const projects = await listPublishedProjects();
  return <section className="mx-auto max-w-7xl px-6 py-16"><div className="mb-10"><p className="text-sm font-bold uppercase tracking-wider text-orange-600">Dự án tiêu biểu</p><h1 className="mt-2 text-4xl font-extrabold text-slate-950">Dự án đã triển khai</h1><p className="mt-3 text-slate-600">Khám phá {projects.length} dự án đã được CIC Technology triển khai.</p></div><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{projects.map((project) => <a key={project.id} href={`/projects/${project.slug}`} className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:border-orange-500 hover:shadow-lg">{project.image ? <img src={project.image} alt={project.title} className="aspect-video w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="aspect-video bg-slate-100" />}<div className="space-y-2 p-5"><p className="text-xs font-bold uppercase tracking-wider text-orange-600">{project.solution ?? project.sector ?? 'Dự án'}</p><h2 className="text-lg font-bold text-slate-950 group-hover:text-orange-600">{project.title}</h2>{project.summary && <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">{project.summary}</p>}</div></a>)}</div></section>;
}
