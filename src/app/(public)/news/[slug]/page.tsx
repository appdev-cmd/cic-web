import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublishedNewsBySlug, listPublishedNews } from '@/features/news/server/queries';
import { LegacyHtml } from '@/web/components/LegacyHtml';
import { NewsDetailActions } from '@/web/components/NewsDetailActions';
import { NewsConsultationForm } from '@/web/components/NewsConsultationForm';
import { Calendar, Eye } from 'lucide-react';
import { NewsTicker } from '@/web/components/NewsTicker';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const item = await getPublishedNewsBySlug((await params).slug);
  return item ? { title: item.title, description: item.summary ?? undefined } : {};
}

function headingsFromHtml(html: string) {
  const result: Array<{ id: string; title: string }> = [];
  const re = /<h([2-4])[^>]*>([\s\S]*?)<\/h\1>/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html)) && result.length < 12) {
    const title = match[2].replace(/<[^>]+>/g, '').trim();
    if (title) result.push({ id: `article-heading-${result.length + 1}`, title });
  }
  return result;
}

export default async function NewsArticle({ params }: { params: Promise<{ slug: string }> }) {
  const item = await getPublishedNewsBySlug((await params).slug);
  if (!item) notFound();
  const all = await listPublishedNews();
  const latest = all.filter((entry) => entry.id !== item.id).slice(0, 5);
  const ticker = all.filter((entry) => entry.id !== item.id).slice(0, 6);
  const headings = headingsFromHtml(item.content);
  return (
    <main className="relative bg-slate-50/50 pb-20 pt-28">
      <div className="fixed left-0 top-[72px] z-[45] h-1 w-full bg-slate-200/80"><div className="h-full w-2/3 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700" /></div>
      <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden border border-slate-200/80 bg-slate-100/90 p-6 shadow-sm sm:p-10">
          <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#131b2e 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="relative z-10 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-medium text-slate-500"><nav className="flex flex-wrap items-center gap-2" aria-label="Breadcrumb"><a href="/" className="hover:text-orange-600">Trang chủ</a><span>/</span><a href="/news" className="hover:text-orange-600">Tin tức</a><span>/</span><span className="line-clamp-1 max-w-xs font-semibold text-slate-900 sm:max-w-md">{item.title}</span></nav><a href="/news" className="inline-flex rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:text-orange-600">← Quay lại</a></div>
            <div className="flex flex-wrap items-center gap-3 text-xs"><span className="border border-orange-500/20 bg-orange-600/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-orange-600">Tin tức</span>{item.date && <span className="flex items-center gap-1 text-slate-500"><Calendar className="h-3.5 w-3.5 text-orange-600" />{new Date(item.date).toLocaleDateString('vi-VN')}</span>}{item.views > 0 && <span className="flex items-center gap-1 text-slate-500"><Eye className="h-3.5 w-3.5 text-orange-600" />{item.views} lượt xem</span>}</div>
            <h1 className="text-2xl font-black uppercase leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">{item.title}</h1>
            <NewsDetailActions />
          </div>
        </section>
        <div className="overflow-hidden border border-orange-100 bg-white px-4 py-3 text-xs"><div className="flex min-w-max items-center gap-4"><span className="font-black uppercase tracking-wider text-orange-600">HOT NEWS</span>{ticker.map((entry) => <a key={entry.id} href={`/news/${entry.slug}`} className="text-slate-600 hover:text-orange-600">{entry.title} •</a>)}</div></div>
        <NewsTicker items={ticker} />
        <div className="grid items-start gap-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
            <article className="space-y-8 rounded-[10px] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-10 lg:p-12">
              {item.summary && <p className="rounded-r-lg border-l-4 border-orange-500 bg-orange-50/60 px-4 py-3 text-sm font-medium italic leading-relaxed text-slate-800 sm:text-base">{item.summary}</p>}
              {item.image && <div className="group relative h-72 w-full overflow-hidden rounded-[10px] sm:h-[460px] lg:h-[500px]"><img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /></div>}
              <LegacyHtml html={item.content} className="prose prose-slate max-w-none text-xs leading-relaxed sm:text-sm" />
            </article>
            <section className="rounded-[10px] border border-orange-200 border-l-4 border-l-orange-500 bg-orange-50/50 p-6 shadow-sm sm:p-8"><h2 className="text-base font-bold uppercase tracking-tight text-slate-900">Đăng ký nhận tư vấn</h2><p className="mt-2 text-xs leading-relaxed text-slate-600">Nhận thông tin tư vấn từ chuyên gia CIC Tech.</p><NewsConsultationForm /></section>
            <section className="rounded-[10px] border border-orange-200 border-l-4 border-l-orange-500 bg-orange-50/50 p-6 shadow-sm sm:p-8"><h2 className="text-base font-bold uppercase tracking-tight text-slate-900">Đăng ký nhận tư vấn</h2><p className="mt-2 text-xs leading-relaxed text-slate-600">Nhận thông tin tư vấn bản quyền, giải pháp phần mềm kỹ thuật hoặc chuyển đổi số từ chuyên gia CIC Tech.</p><a href="/contact" className="mt-4 inline-flex rounded-lg bg-[#FC5115] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-orange-600">Gửi yêu cầu tư vấn</a></section>
          </div>
          <aside className="space-y-6 lg:col-span-4">
            {headings.length > 0 && <section className="overflow-hidden rounded-[10px] border border-slate-200/80 bg-white shadow-sm"><h2 className="border-b border-slate-100 p-4 text-xs font-black uppercase tracking-wider text-orange-600">Mục lục bài viết</h2><nav className="space-y-1 p-4">{headings.map((heading) => <a key={heading.id} href={`#${heading.id}`} className="block text-xs leading-5 text-slate-600 hover:text-orange-600">{heading.title}</a>)}</nav></section>}
            <section className="rounded-[10px] border border-slate-200/80 bg-white p-5 shadow-sm"><h2 className="border-b border-slate-200 pb-3 text-sm font-black uppercase tracking-wider text-slate-900">Tin mới nhất</h2>{latest.map((entry) => <a key={entry.id} href={`/news/${entry.slug}`} className="block border-b border-slate-100 py-4 text-sm font-semibold leading-6 text-slate-700 hover:text-orange-600">{entry.title}</a>)}</section>
          </aside>
        </div>
      </div>
    </main>
  );
}
