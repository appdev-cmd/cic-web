/** Local production-build lab observation; not CrUX field data. */
import { chromium } from 'playwright';

const base = (process.argv[2] || 'http://127.0.0.1:3100').replace(/\/+$/, '');
const browser = await chromium.launch({ headless: true });

try {
  for (const route of ['/', '/gioi-thieu']) {
    for (const profile of [
      { name: 'desktop', viewport: { width: 1366, height: 768 }, isMobile: false },
      { name: 'mobile', viewport: { width: 390, height: 844 }, isMobile: true },
    ]) {
      const results = [];
      for (let attempt = 0; attempt < 3; attempt++) {
        const context = await browser.newContext({ viewport: profile.viewport, isMobile: profile.isMobile, deviceScaleFactor: profile.isMobile ? 2 : 1 });
        const page = await context.newPage();
        await page.addInitScript(() => {
          window.__seoLcp = null;
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              window.__seoLcp = {
                time: entry.startTime,
                element: entry.element?.tagName || null,
                src: entry.element?.currentSrc || entry.element?.src || null,
              };
            }
          }).observe({ type: 'largest-contentful-paint', buffered: true });
        });
        const response = await page.goto(`${base}${route}`, { waitUntil: 'domcontentloaded', timeout: 45_000 });
        await page.waitForTimeout(5000);
        const observed = await page.evaluate(() => ({
          lcp: window.__seoLcp,
          ttfb: performance.getEntriesByType('navigation')[0]?.responseStart || null,
          resources: performance.getEntriesByType('resource').length,
        }));
        results.push({ status: response?.status() ?? null, ...observed });
        await context.close();
      }
      console.log(JSON.stringify({ route, profile: profile.name, results }));
    }
  }
} finally {
  await browser.close();
}
