// Comprehensive SEO HTML signal verification against http://localhost:3000
async function verifySignals() {
  const base = 'http://localhost:3000';
  const routes = [
    { path: '/', type: 'home' },
    { path: '/gioi-thieu', type: 'about' },
    { path: '/products/lumion-pro', type: 'product' },
    { path: '/news/chuan-doan-nhiet-trong-nha-may-dien-mat-troi', type: 'news' },
    { path: '/services/tu-van-bim', type: 'service' },
    { path: '/events/hoi-thao:-dot-pha-ung-dung-ai-trong-van-hanh-cang-bien-viet-nam-thap-ky-toi', type: 'event' },
    { path: '/en', type: 'home_en' },
    { path: '/en/news/ky-hop-dong-cung-cap-thiet-bi-do-chan-dong-va-song-khong-khi', type: 'news_en' },
  ];

  console.log('=== VERIFYING REAL RENDERED SEO HTML SIGNALS ===\n');

  for (const r of routes) {
    const res = await fetch(`${base}${r.path}`);
    const html = await res.text();
    console.log(`\n--- ROUTE: ${r.path} (${res.status}) ---`);

    // 1. Title
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : 'NONE';
    console.log(`Title: "${title}"`);
    const doubleBrand = /\|\s*CIC\b.*\|\s*CIC/i.test(title) || /CIC Technology.*CIC Technology/i.test(title);
    console.log(`  Title double branding detected?: ${doubleBrand}`);

    // 2. Canonical
    const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
    console.log(`Canonical: ${canonicalMatch ? canonicalMatch[1] : 'NONE'}`);

    // 3. Hreflang / Alternates
    const alternates = [...html.matchAll(/<link[^>]+rel=["']alternate["'][^>]+hreflang=["']([^"']+)["'][^>]+href=["']([^"']+)["']/gi)]
      .map(m => `${m[1]} -> ${m[2]}`);
    console.log(`Hreflang count: ${alternates.length}`, alternates);

    // 4. Open Graph Image
    const ogImageMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
    const ogImage = ogImageMatch ? ogImageMatch[1] : null;
    const ogWidth = html.match(/<meta[^>]+property=["']og:image:width["'][^>]+content=["']([^"']+)["']/i)?.[1];
    const ogHeight = html.match(/<meta[^>]+property=["']og:image:height["'][^>]+content=["']([^"']+)["']/i)?.[1];
    console.log(`OG Image: ${ogImage} (${ogWidth}x${ogHeight})`);
    if (ogImage) {
      try {
        const imgRes = await fetch(ogImage.startsWith('http') ? ogImage : `${base}${ogImage}`);
        console.log(`  OG Image HTTP status: ${imgRes.status}, Content-Type: ${imgRes.headers.get('content-type')}`);
      } catch (err) {
        console.log(`  OG Image fetch error: ${err.message}`);
      }
    }

    // 5. JSON-LD scripts
    const jsonLdBlocks = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
    console.log(`JSON-LD blocks count: ${jsonLdBlocks.length}`);
    for (let i = 0; i < jsonLdBlocks.length; i++) {
      try {
        const parsed = JSON.parse(jsonLdBlocks[i][1]);
        const type = parsed['@type'] || (Array.isArray(parsed['@graph']) ? parsed['@graph'].map(g => g['@type']).join(', ') : 'unknown');
        console.log(`  Block #${i+1} @type: ${type}`);
        // Check Product offers
        if (parsed['@type'] === 'Product') {
          console.log(`    Product offers present?: ${'offers' in parsed}`);
          if ('offers' in parsed) {
            console.log(`    WARNING: offers found:`, JSON.stringify(parsed.offers));
          }
        }
        // Check Article dates
        if (parsed['@type'] === 'Article') {
          console.log(`    datePublished: ${parsed.datePublished} (is ISO?: ${/^\d{4}-\d{2}-\d{2}T/.test(parsed.datePublished)})`);
          console.log(`    dateModified: ${parsed.dateModified}`);
        }
        // Check Organization
        if (parsed['@type'] === 'Organization') {
          console.log(`    Organization name: ${parsed.name}, logo: ${parsed.logo}`);
        }
      } catch (e) {
        console.log(`  Block #${i+1} JSON parse error: ${e.message}`);
      }
    }

    // 6. Image Alt Audit
    const imgTags = [...html.matchAll(/<img\b([^>]*)>/gi)];
    let emptyAlt = 0;
    let missingAlt = 0;
    let validAlt = 0;
    for (const tag of imgTags) {
      const altMatch = tag[1].match(/\balt=(?:["']([^"']*)["']|([^\s>]+))/i);
      if (!altMatch) {
        missingAlt++;
      } else {
        const val = (altMatch[1] ?? altMatch[2] ?? '').trim();
        if (!val) emptyAlt++;
        else validAlt++;
      }
    }
    console.log(`Images total: ${imgTags.length} (Valid alt: ${validAlt}, Empty alt: ${emptyAlt}, Missing alt: ${missingAlt})`);
  }
}

verifySignals();
