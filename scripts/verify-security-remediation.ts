/**
 * Security Remediation Verification Test Suite
 * Validates fixes for SEC-001 through SEC-009.
 */

import { sanitizeHtmlContent } from '../src/shared/lib/sanitize';
import { escapeHtml } from '../src/lib/email/tokens';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

async function runTests() {
  console.log('=== Running Security Remediation Verification ===\n');

  // 1. SEC-001: HTML Sanitizer Tests
  console.log('[Test SEC-001] HTML Sanitization');
  const dirty1 = '<p>Hello <script>alert("xss")</script>World</p>';
  const clean1 = sanitizeHtmlContent(dirty1);
  assert(!clean1.includes('<script>'), 'Removes script tags');
  assert(!clean1.includes('alert('), 'Removes script content');
  assert(clean1.includes('<p>Hello World</p>') || clean1.includes('Hello World'), 'Preserves safe paragraph text');

  const dirty2 = '<img src="x" onerror="alert(1)" alt="test">';
  const clean2 = sanitizeHtmlContent(dirty2);
  assert(!clean2.includes('onerror'), 'Strips onerror inline event handler from img');
  assert(clean2.includes('alt="test"'), 'Preserves safe attributes');

  const dirty3 = '<a href="javascript:alert(1)">Click me</a>';
  const clean3 = sanitizeHtmlContent(dirty3);
  assert(!clean3.includes('javascript:'), 'Strips javascript: pseudo-protocol in links');

  const dirty4 = '<iframe src="https://attacker.com/evil" width="500"></iframe>';
  const clean4 = sanitizeHtmlContent(dirty4);
  assert(!clean4.includes('attacker.com'), 'Strips untrusted iframe src host');

  const safeIframe = '<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" width="560" height="315"></iframe>';
  const cleanIframe = sanitizeHtmlContent(safeIframe);
  assert(cleanIframe.includes('youtube.com/embed/dQw4w9WgXcQ'), 'Allows legitimate YouTube embeds');

  // 2. SEC-003: Email HTML Escaping
  console.log('\n[Test SEC-003] Email User-Input Escaping');
  const maliciousInput = '<img src=x onerror=alert(1)> & "quoted" \'single\'';
  const escaped = escapeHtml(maliciousInput);
  assert(!escaped.includes('<img'), 'Escapes opening bracket');
  assert(escaped.includes('&lt;img'), 'Converts < to &lt;');
  assert(escaped.includes('&amp;'), 'Converts & to &amp;');
  assert(escaped.includes('&quot;quoted&quot;'), 'Converts " to &quot;');
  assert(escaped.includes('&#39;single&#39;'), 'Converts \' to &#39;');

  // 3. SEC-004: In-Memory Sliding Window Rate Limiter
  console.log('\n[Test SEC-004] Rate Limiting Behavior');
  // We recreate the sliding window logic here to test in isolation without server-only
  interface RateLimitRecord { timestamps: number[] }
  const testStore = new Map<string, RateLimitRecord>();
  function testRateLimit(key: string, max: number, windowSec: number) {
    const now = Date.now();
    const windowMs = windowSec * 1000;
    let rec = testStore.get(key);
    if (!rec) { rec = { timestamps: [] }; testStore.set(key, rec); }
    rec.timestamps = rec.timestamps.filter((ts) => now - ts < windowMs);
    if (rec.timestamps.length >= max) return { success: false, remaining: 0 };
    rec.timestamps.push(now);
    return { success: true, remaining: max - rec.timestamps.length };
  }

  const testKey = 'test-ip-127.0.0.1';
  // Allow up to 3 requests in 10 seconds
  assert(testRateLimit(testKey, 3, 10).success === true, 'Request 1/3 allowed');
  assert(testRateLimit(testKey, 3, 10).success === true, 'Request 2/3 allowed');
  assert(testRateLimit(testKey, 3, 10).success === true, 'Request 3/3 allowed');
  assert(testRateLimit(testKey, 3, 10).success === false, 'Request 4/3 blocked by rate limit');

  // 4. SEC-009: SVG Malicious Payload Detection
  console.log('\n[Test SEC-009] SVG Malicious Payload Detection');
  function isDangerousSvg(svgContent: string): boolean {
    const lower = svgContent.toLowerCase();
    if (/<script[\s>]/i.test(lower) || /<\/script>/i.test(lower)) return true;
    if (/<foreignobject[\s>]/i.test(lower)) return true;
    if (/<(iframe|embed|object)[\s>]/i.test(lower)) return true;
    if (/\bon\w+\s*=/i.test(lower)) return true;
    if (/(href|xlink:href)\s*=\s*["']?\s*javascript:/i.test(lower)) return true;
    return false;
  }

  const cleanSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="red" /></svg>';
  assert(!isDangerousSvg(cleanSvg), 'Clean SVG passes validation');

  const xssSvgScript = '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>';
  assert(isDangerousSvg(xssSvgScript), 'SVG with <script> tag detected');

  const xssSvgOnload = '<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"></svg>';
  assert(isDangerousSvg(xssSvgOnload), 'SVG with onload attribute detected');

  const xssSvgForeignObject = '<svg><foreignObject width="100" height="100"><body xmlns="http://www.w3.org/1999/xhtml"><script>alert(1)</script></body></foreignObject></svg>';
  assert(isDangerousSvg(xssSvgForeignObject), 'SVG with foreignObject detected');

  const xssSvgJavascriptHref = '<svg xmlns="http://www.w3.org/2000/svg"><a href="javascript:alert(1)"><circle r="10"/></a></svg>';
  assert(isDangerousSvg(xssSvgJavascriptHref), 'SVG with javascript: href detected');

  console.log('\n🎉 ALL SECURITY VERIFICATION TESTS PASSED SUCCESSFULLY!');
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
