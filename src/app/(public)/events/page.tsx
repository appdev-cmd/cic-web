/* eslint-disable @next/next/no-img-element */
import { listPublishedEvents } from '@/features/events/server/queries';
export const dynamic = 'force-dynamic';
export default async function EventsPage() { const events = await listPublishedEvents(); return <section className="mx-auto max-w-7xl px-6 py-16"><h1 className="text-4xl font-extrabold">Sự kiện</h1><div className="mt-10 grid gap-6 md:grid-cols-3">{events.map((e) => <a key={e.id} href={`/events/${e.slug}`} className="overflow-hidden rounded-xl border border-slate-200 bg-white">{e.image && <img src={e.image} alt={e.title} className="aspect-video w-full object-cover" />}<div className="p-5"><h2 className="font-bold">{e.title}</h2>{e.summary && <p className="mt-2 text-sm text-slate-600">{e.summary}</p>}</div></a>)}</div></section>; }
