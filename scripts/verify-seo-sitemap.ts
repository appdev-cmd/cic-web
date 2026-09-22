/** HTTP-check every sitemap entry against a locally running server. Read-only. */
const base = (process.argv[2] || 'http://localhost:3000').replace(/\/+$/, '');
console.log(`Fetching sitemap from ${base}/sitemap.xml ...`);
const sitemapResponse = await fetch(`${base}/sitemap.xml`, { signal: AbortSignal.timeout(60_000) });
if (!sitemapResponse.ok) throw new Error(`Sitemap returned ${sitemapResponse.status}`);
const sitemapXml = await sitemapResponse.text();
const urls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].replaceAll('&amp;', '&'));

console.log(`Found ${urls.length} URLs in sitemap.`);

// Assertions on sitemap content before crawl
const prohibitedKnown404s = [
  '/en/gioi-thieu',
  '/about/organization',
  '/about/capacity-experience',
  '/products/categories',
  '/news/categories',
  '/en/products/categories',
  '/en/news/categories',
];
const foundProhibited = prohibitedKnown404s.filter((p) => urls.some((u) => u.endsWith(p)));
if (foundProhibited.length) {
  console.error('ERROR: Sitemap contains prohibited/invalid URLs:', foundProhibited);
} else {
  console.log('PASS: Zero prohibited 404 or category placeholder URLs in sitemap.');
}

const failures: { url: string; reason: string; status?: number }[] = [];
const statusCounts = new Map<string, number>();
let checked = 0;

async function crawl(list: string[], concurrency: number) {
  let next = 0;
  async function worker() {
    while (next < list.length) {
      const url = list[next++];
      const path = new URL(url).pathname;
      try {
        const response = await fetch(`${base}${path}`, {
          method: 'GET',
          redirect: 'manual',
          signal: AbortSignal.timeout(30_000),
        });
        const status = response.status;
        const key = String(status);
        statusCounts.set(key, (statusCounts.get(key) ?? 0) + 1);

        if (status !== 200) {
          failures.push({ url, reason: `HTTP status ${status}`, status });
        } else {
          const body = await response.text();
          // Detect Next.js streaming 404
          if (body.includes('"notFound":[') || body.includes('notFound.tsx')) {
            failures.push({ url, reason: 'Streaming 404 detected in body', status: 404 });
          }
          // Detect noindex
          if (body.includes('content="noindex') || body.includes("content='noindex")) {
            failures.push({ url, reason: 'Unexpected noindex header/meta on public sitemap URL', status: 200 });
          }
        }
      } catch (error) {
        const errType = error instanceof DOMException && error.name === 'TimeoutError' ? 'timeout' : 'error';
        statusCounts.set(errType, (statusCounts.get(errType) ?? 0) + 1);
        failures.push({ url, reason: `Network/Request ${errType}` });
      }

      checked++;
      if (checked % 250 === 0 || checked === urls.length) {
        console.log(`Checked ${checked}/${urls.length} (${failures.length} failures so far)`);
      }
    }
  }
  await Promise.all(Array.from({ length: concurrency }, () => worker()));
}

const eventUrls = urls.filter((url) => new URL(url).pathname.startsWith('/events/'));
const nonEventUrls = urls.filter((url) => !new URL(url).pathname.startsWith('/events/'));

await crawl(nonEventUrls, 4);
await crawl(eventUrls, 2);

const summary = {
  total: urls.length,
  unique: new Set(urls).size,
  status: Object.fromEntries([...statusCounts.entries()].sort()),
  prohibitedFound: foundProhibited,
  failuresCount: failures.length,
  failures: failures.slice(0, 50),
};

console.log('\n=== SITEMAP CRAWL SUMMARY ===\n', JSON.stringify(summary, null, 2));

if (failures.length > 0 || foundProhibited.length > 0) {
  process.exitCode = 1;
}
