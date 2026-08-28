import { notFound } from 'next/navigation';
import { getPublishedEventBySlug } from '@/features/events/server/queries';
import { LegacyHtml } from '@/web/components/LegacyHtml';
export const dynamic = 'force-dynamic';
export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) { const event = await getPublishedEventBySlug((await params).slug); if (!event) notFound(); return <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16"><h1 className="text-3xl font-extrabold sm:text-4xl">{event.title}</h1>{event.summary && <p className="mt-6 text-lg text-slate-600">{event.summary}</p>}<LegacyHtml html={event.content} className="mt-8" /></article>; }
