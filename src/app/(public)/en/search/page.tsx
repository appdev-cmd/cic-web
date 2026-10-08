import type { Metadata } from 'next';
import { searchPublishedContent } from '@/features/search/server/queries';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }): Promise<Metadata> {
  const query = (await searchParams).q ?? '';
  return {
    title: query ? `Search: "${query}" | CIC Technology` : 'Search | CIC Technology',
    description: 'Search engineering software, consulting services, projects, news and events at CIC Technology.',
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: '/en/search',
    },
  };
}

const labels = {
  product: 'Product',
  project: 'Project',
  service: 'Service',
  news: 'News',
  event: 'Event',
};

export default async function EnSearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const query = (await searchParams).q ?? '';
  const results = await searchPublishedContent(query);

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-4xl font-extrabold text-slate-900">Search</h1>
      <form className="mt-8 flex gap-3" action="/en/search" method="GET">
        <input
          name="q"
          defaultValue={query}
          aria-label="Search keywords"
          placeholder="Search products, services, projects, news..."
          className="min-w-0 flex-1 rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button type="submit" className="rounded-lg bg-orange-600 px-6 py-3 font-bold text-white hover:bg-orange-700 transition-colors">
          Search
        </button>
      </form>

      {query && (
        <p className="mt-6 text-sm text-slate-500">
          {results.length} result{results.length !== 1 ? 's' : ''} for “{query}”
        </p>
      )}

      <div className="mt-6 space-y-4">
        {results.map((item) => {
          const enHref = item.href.startsWith('/en') ? item.href : `/en${item.href}`;
          return (
            <a
              key={`${item.type}-${item.id}`}
              href={enHref}
              className="block rounded-xl border border-slate-200 p-5 transition hover:border-orange-500 bg-white"
            >
              <span className="text-xs font-bold uppercase text-orange-600 tracking-wider">
                {labels[item.type]}
              </span>
              <h2 className="mt-1 text-lg font-bold text-slate-900">{item.title}</h2>
              {item.summary && (
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">{item.summary}</p>
              )}
            </a>
          );
        })}

        {query && results.length === 0 && (
          <p className="rounded-xl bg-slate-50 p-6 text-slate-600 border border-slate-100">
            No matching results found for your search term.
          </p>
        )}
      </div>
    </section>
  );
}
