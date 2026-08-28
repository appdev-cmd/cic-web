/* eslint-disable @next/next/no-img-element */
import { listPublishedNews } from '@/features/news/server/queries';
export const dynamic = 'force-dynamic';
export default async function NewsPage() { const items = await listPublishedNews(); return <section className="mx-auto max-w-7xl px-6 py-16"><h1 className="text-4xl font-extrabold">Tin tức</h1><div className="mt-10 grid gap-6 md:grid-cols-3">{items.map((n) => <a key={n.id} href={`/news/${n.slug}`} className="overflow-hidden rounded-xl border border-slate-200 bg-white">{n.image && <img src={n.image} alt={n.title} className="aspect-video w-full object-cover" />}<div className="p-5"><h2 className="font-bold">{n.title}</h2>{n.summary && <p className="mt-2 text-sm text-slate-600">{n.summary}</p>}</div></a>)}</div></section>; }
