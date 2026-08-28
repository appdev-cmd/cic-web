/* eslint-disable @next/next/no-img-element */
import { notFound } from 'next/navigation';
import { getPublishedServiceBySlug } from '@/features/services/server/queries';
import { LegacyHtml } from '@/web/components/LegacyHtml';
export const dynamic = 'force-dynamic';
export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) { const service = await getPublishedServiceBySlug((await params).slug); if (!service) notFound(); return <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16"><h1 className="text-3xl font-extrabold sm:text-4xl">{service.title}</h1>{service.image && <img src={service.image} alt={service.title} className="mt-8 h-auto w-full rounded-xl object-cover" />}{service.summary && <p className="mt-6 text-lg text-slate-600">{service.summary}</p>}<LegacyHtml html={service.content} className="mt-8" /></article>; }
