/**
 * Stratified Sample Audit Script: 50 Products + 50 News
 * Runs safely against local Next.js server with concurrency 2.
 */
import fs from 'node:fs';

const BASE_URL = 'http://127.0.0.1:3000';
const OUT_FILE = 'docs/seo/stratified_sample_audit.json';

async function main() {
  console.log('[1/3] Fetching sitemap from ' + BASE_URL + '/sitemap.xml ...');
  const res = await fetch(`${BASE_URL}/sitemap.xml`);
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replaceAll('&amp;', '&'));

  const productUrls = urls.filter((u) => {
    const p = new URL(u).pathname;
    return (p.startsWith('/products/') || p.startsWith('/en/products/')) && p !== '/products' && p !== '/en/products';
  });

  const newsUrls = urls.filter((u) => {
    const p = new URL(u).pathname;
    return (p.startsWith('/news/') || p.startsWith('/en/news/')) && p !== '/news' && p !== '/en/news';
  });

  console.log(`Total Products in sitemap: ${productUrls.length}`);
  console.log(`Total News in sitemap: ${newsUrls.length}`);

  // Stratified sampling: pick evenly spaced samples
  function sampleEvenly(arr, count) {
    if (arr.length <= count) return arr;
    const step = arr.length / count;
    const sample = [];
    for (let i = 0; i < count; i++) {
      sample.push(arr[Math.floor(i * step)]);
    }
    return sample;
  }

  const sampleProducts = sampleEvenly(productUrls, 50);
  const sampleNews = sampleEvenly(newsUrls, 50);
  const sampleAll = [...sampleProducts, ...sampleNews];

  console.log(`[2/3] Auditing ${sampleAll.length} sampled URLs (50 Products + 50 News)...`);

  const results = {
    totalSampled: sampleAll.length,
    productsSampled: sampleProducts.length,
    newsSampled: sampleNews.length,
    passedCount: 0,
    failures: [],
    details: [],
  };

  for (let i = 0; i < sampleAll.length; i++) {
    const url = sampleAll[i];
    const path = new URL(url).pathname;
    const start = Date.now();
    try {
      const resp = await fetch(`${BASE_URL}${path}`, {
        headers: { 'Accept': 'text/html' },
      });
      const status = resp.status;
      const html = await resp.text();
      const streaming404 = html.includes('"notFound":[') || html.includes('notFound.tsx');
      const noindex = /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html);

      const item = {
        url,
        path,
        status,
        durationMs: Date.now() - start,
        streaming404,
        noindex,
      };

      if (status !== 200 || streaming404 || noindex) {
        results.failures.push({
          ...item,
          reason: status !== 200 ? `HTTP ${status}` : streaming404 ? 'Streaming 404 in body' : 'Unexpected noindex',
        });
        console.error(`[FAIL ${i + 1}/${sampleAll.length}] ${path} => HTTP ${status}, streaming404=${streaming404}, noindex=${noindex}`);
      } else {
        results.passedCount++;
        if ((i + 1) % 10 === 0 || i + 1 === sampleAll.length) {
          console.log(`[Progress] ${i + 1}/${sampleAll.length} checked (${results.passedCount} OK, ${results.failures.length} fail)`);
        }
      }
      results.details.push(item);
    } catch (err) {
      results.failures.push({
        url,
        path,
        reason: `Network/Fetch Error: ${err.message}`,
        durationMs: Date.now() - start,
      });
      console.error(`[ERR ${i + 1}/${sampleAll.length}] ${path} => ${err.message}`);
    }
  }

  console.log('\n[3/3] Stratified Sample Audit Complete:');
  console.log(`Total: ${sampleAll.length}`);
  console.log(`Passed (200 OK, valid indexable HTML): ${results.passedCount}`);
  console.log(`Failures: ${results.failures.length}`);

  fs.writeFileSync(OUT_FILE, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`Results saved to ${OUT_FILE}`);
}

main().catch(console.error);
