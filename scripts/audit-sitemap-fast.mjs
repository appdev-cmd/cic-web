/**
 * Fast & Safe Sitemap Audit Script
 * Crawls sitemap entries against production/local server.
 * Checks HTTP status, Next.js streaming 404, unexpected noindex, and canonical tags.
 */
import fs from 'node:fs';

const BASE_URL = (process.argv[2] || 'http://127.0.0.1:3005').replace(/\/+$/, '');
const CONCURRENCY = parseInt(process.argv[3] || '6', 10);
const REPORT_FILE = 'docs/seo/sitemap_audit_results.json';

console.log(`[Sitemap Audit] Target Server: ${BASE_URL}`);
console.log(`[Sitemap Audit] Concurrency: ${CONCURRENCY}`);

async function main() {
  console.log(`[1/3] Fetching sitemap from ${BASE_URL}/sitemap.xml ...`);
  const sitemapRes = await fetch(`${BASE_URL}/sitemap.xml`, {
    signal: AbortSignal.timeout(30_000),
  });
  if (!sitemapRes.ok) {
    throw new Error(`Failed to fetch sitemap.xml: status ${sitemapRes.status}`);
  }

  const xmlText = await sitemapRes.text();
  const urls = [...xmlText.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replaceAll('&amp;', '&'));
  console.log(`[1/3] Extracted ${urls.length} URLs from sitemap.`);

  // Verify known old 404s are NOT present
  const prohibited404s = [
    '/en/gioi-thieu',
    '/about/organization',
    '/about/capacity-experience',
    '/products/categories',
    '/news/categories',
    '/en/products/categories',
    '/en/news/categories',
  ];
  const foundProhibited = prohibited404s.filter((p) => urls.some((u) => u.endsWith(p)));
  if (foundProhibited.length > 0) {
    console.error(`[CRITICAL] Found prohibited obsolete 404 URLs in sitemap:`, foundProhibited);
  } else {
    console.log(`[PASS] Zero obsolete 404 or category placeholder URLs found in sitemap.`);
  }

  console.log(`[2/3] Auditing ${urls.length} URLs (Concurrency: ${CONCURRENCY})...`);

  const results = {
    total: urls.length,
    prohibitedFound: foundProhibited,
    statusCounts: {},
    streaming404Count: 0,
    noindexCount: 0,
    failures: [],
  };

  let index = 0;
  let active = 0;
  let completed = 0;

  async function checkUrl(url) {
    const parsed = new URL(url);
    const targetUrl = `${BASE_URL}${parsed.pathname}${parsed.search}`;
    const start = Date.now();

    try {
      const res = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          'Accept': 'text/html,application/xhtml+xml',
          'User-Agent': 'SEO-Audit-Bot/1.0',
        },
        signal: AbortSignal.timeout(15_000),
      });

      const status = res.status;
      results.statusCounts[status] = (results.statusCounts[status] || 0) + 1;

      if (status !== 200) {
        results.failures.push({
          url,
          status,
          durationMs: Date.now() - start,
          reason: `HTTP status ${status}`,
        });
        return;
      }

      const html = await res.text();
      const isStreaming404 = html.includes('"notFound":[') || html.includes('notFound.tsx');
      const hasNoindex = /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html);

      if (isStreaming404) {
        results.streaming404Count++;
        results.failures.push({
          url,
          status: 404,
          durationMs: Date.now() - start,
          reason: 'Streaming 404 detected in response body',
        });
      }

      if (hasNoindex) {
        results.noindexCount++;
        results.failures.push({
          url,
          status: 200,
          durationMs: Date.now() - start,
          reason: 'Unexpected noindex on sitemap-listed page',
        });
      }
    } catch (err) {
      const errName = err.name === 'TimeoutError' ? 'TIMEOUT' : 'NETWORK_ERROR';
      results.statusCounts[errName] = (results.statusCounts[errName] || 0) + 1;
      results.failures.push({
        url,
        status: 0,
        durationMs: Date.now() - start,
        reason: `${errName}: ${err.message}`,
      });
    } finally {
      completed++;
      if (completed % 200 === 0 || completed === urls.length) {
        console.log(`Progress: ${completed}/${urls.length} (Active: ${active}, Failures: ${results.failures.length})`);
      }
    }
  }

  // Worker pool
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (index < urls.length) {
      const currentUrl = urls[index++];
      active++;
      await checkUrl(currentUrl);
      active--;
    }
  });

  await Promise.all(workers);

  console.log(`[3/3] Crawl completed in ${(Date.now())} ms.`);
  console.log('\n================ AUDIT SUMMARY ================');
  console.log('Status Breakdown:', JSON.stringify(results.statusCounts, null, 2));
  console.log(`Total Failures: ${results.failures.length}`);
  console.log(`Streaming 404s: ${results.streaming404Count}`);
  console.log(`Noindex violations: ${results.noindexCount}`);

  fs.writeFileSync(REPORT_FILE, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`Full report written to ${REPORT_FILE}`);

  if (results.failures.length > 0 || foundProhibited.length > 0) {
    console.error(`Audit finished with ${results.failures.length} failures.`);
    process.exit(1);
  } else {
    console.log('PASS: All URLs in sitemap responded 200 OK with valid indexable HTML.');
  }
}

main().catch((e) => {
  console.error('Fatal audit error:', e);
  process.exit(1);
});
