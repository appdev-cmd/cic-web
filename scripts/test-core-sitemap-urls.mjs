async function runTest() {
  const sitemapRes = await fetch('http://127.0.0.1:3000/sitemap.xml');
  const xml = await sitemapRes.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].replaceAll('&amp;', '&'));

  const nonNewsProdUrls = urls.filter(u => {
    const p = new URL(u).pathname;
    return !p.startsWith('/news') && !p.startsWith('/en/news') && !p.startsWith('/products') && !p.startsWith('/en/products');
  });

  console.log(`[Testing Core URLs] Total: ${nonNewsProdUrls.length}`);
  const failures = [];
  const valid = [];

  for (const url of nonNewsProdUrls) {
    const p = new URL(url).pathname;
    try {
      const res = await fetch(`http://127.0.0.1:3000${p}`, {
        headers: { 'Accept': 'text/html' }
      });
      if (res.status !== 200) {
        failures.push({ url, status: res.status, reason: `HTTP ${res.status}` });
        continue;
      }
      const html = await res.text();
      const streaming404 = html.includes('"notFound":[') || html.includes('notFound.tsx');
      const noindex = /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html);
      if (streaming404 || noindex) {
        failures.push({ url, status: 200, streaming404, noindex, reason: 'Streaming 404 or unexpected noindex' });
      } else {
        valid.push(url);
      }
    } catch (err) {
      failures.push({ url, reason: `Error: ${err.message}` });
    }
  }

  console.log(`[Core URLs Result] Valid: ${valid.length}/${nonNewsProdUrls.length}`);
  console.log(`[Core URLs Result] Failures: ${failures.length}`);
  if (failures.length > 0) {
    console.log('Failures:', JSON.stringify(failures, null, 2));
  } else {
    console.log('PASS: 100% Core non-news/products URLs are 200 OK with valid indexable HTML!');
  }
}

runTest().catch(console.error);
