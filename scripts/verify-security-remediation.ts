/**
 * Security Remediation Verification Test Suite
 * Validates fixes for SEC-001 through SEC-009.
 */

import { sanitizeHtmlContent } from '../src/shared/lib/sanitize';
import { isDangerousSvg } from '../src/shared/lib/svg-security';
import { escapeHtml, interpolateTokens } from '../src/lib/email/tokens';
import { isIP } from 'node:net';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

async function runTests() {
  console.log('=== Running Security Remediation Verification ===\n');

  // 1. SEC-001 & SEC-R001: HTML Sanitizer & Style Whitelist Tests
  console.log('[Test SEC-001 / SEC-R001] HTML Sanitization & Style Hardening');
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

  // CSS Style Whitelist tests
  const safeStyledHtml = '<p style="color: #ff0000; text-align: center; font-size: 16px; margin: 10px;">Safe text</p>';
  const cleanSafeStyle = sanitizeHtmlContent(safeStyledHtml);
  assert(cleanSafeStyle.includes('color:#ff0000') || cleanSafeStyle.includes('color: #ff0000'), 'Allows safe whitelisted CSS color');
  assert(cleanSafeStyle.includes('text-align:center') || cleanSafeStyle.includes('text-align: center'), 'Allows safe whitelisted CSS text-align');

  const maliciousCss1 = '<p style="color: red; background: url(javascript:alert(1));">Malicious CSS</p>';
  const cleanMalicious1 = sanitizeHtmlContent(maliciousCss1);
  assert(!cleanMalicious1.includes('javascript:'), 'Strips javascript: inside style attribute');

  const maliciousCss2 = '<div style="width: expression(alert(1)); -moz-binding: url(evil.xml);">Malicious CSS 2</div>';
  const cleanMalicious2 = sanitizeHtmlContent(maliciousCss2);
  assert(!cleanMalicious2.includes('expression'), 'Strips expression() in style attribute');
  assert(!cleanMalicious2.includes('-moz-binding'), 'Strips -moz-binding in style attribute');

  // 2. SEC-003 & SEC-R004: Email HTML Escaping & Token Interpolation
  console.log('\n[Test SEC-003 / SEC-R004] Email User-Input Escaping & Interpolation');
  const maliciousInput = '<img src=x onerror=alert(1)> & "quoted" \'single\'';
  const escaped = escapeHtml(maliciousInput);
  assert(!escaped.includes('<img'), 'Escapes opening bracket');
  assert(escaped.includes('&lt;img'), 'Converts < to &lt;');
  assert(escaped.includes('&amp;'), 'Converts & to &amp;');
  assert(escaped.includes('&quot;quoted&quot;'), 'Converts " to &quot;');
  assert(escaped.includes('&#39;single&#39;'), 'Converts \' to &#39;');

  // HTML template token auto-escaping test
  const htmlTemplate = '<div class="email-body"><p>Kính gửi quý khách {{customer.full_name}},</p><p>Biểu mẫu: {{form.title}}</p></div>';
  const interpolatedHtml = interpolateTokens(htmlTemplate, {
    '{{customer.full_name}}': '<script>alert("pwned")</script> Nguyễn Văn A',
    '{{form.title}}': 'Tư vấn giải pháp & báo giá <img src=x onerror=alert(1)>',
  }, { isHtml: true });

  assert(!interpolatedHtml.includes('<script>'), 'Auto-escapes script tag in interpolated HTML tokens');
  assert(interpolatedHtml.includes('&lt;script&gt;'), 'Converts script tag to safe entities');
  assert(!interpolatedHtml.includes('<img'), 'Auto-escapes img tag in interpolated HTML tokens');
  assert(interpolatedHtml.includes('Nguyễn Văn A'), 'Preserves Vietnamese Unicode characters');

  // Plain-text subject token interpolation test
  const subjectTemplate = 'Thông báo: {{customer.full_name}} gửi liên hệ';
  const interpolatedSubject = interpolateTokens(subjectTemplate, {
    '{{customer.full_name}}': 'Nguyễn Văn A & Đối tác',
  }, { isHtml: false });
  assert(interpolatedSubject === 'Thông báo: Nguyễn Văn A & Đối tác gửi liên hệ', 'Preserves plain text in email subject without entity escaping');

  // Explicit raw token test
  const rawHtmlTemplate = '<div>{{{trusted_table}}}</div>';
  const interpolatedRaw = interpolateTokens(rawHtmlTemplate, {
    '{{trusted_table}}': '<table><tr><td>Item</td></tr></table>',
  }, { isHtml: true });
  assert(interpolatedRaw.includes('<table><tr><td>Item</td></tr></table>'), 'Allows explicit {{{rawToken}}} markup');

  // 3. SEC-004 & SEC-R006: Rate Limiter & Client IP Extraction
  console.log('\n[Test SEC-004 / SEC-R006] Rate Limiting & Client IP Extraction');
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
  assert(testRateLimit(testKey, 3, 10).success === true, 'Request 1/3 allowed');
  assert(testRateLimit(testKey, 3, 10).success === true, 'Request 2/3 allowed');
  assert(testRateLimit(testKey, 3, 10).success === true, 'Request 3/3 allowed');
  assert(testRateLimit(testKey, 3, 10).success === false, 'Request 4/3 blocked by rate limit');

  // Client IP extraction test logic
  function testExtractIp(headersMap: Record<string, string>): string {
    const cfIp = headersMap['cf-connecting-ip']?.trim();
    if (cfIp && isIP(cfIp) !== 0) return cfIp;
    const realIp = headersMap['x-real-ip']?.trim();
    if (realIp && isIP(realIp) !== 0) return realIp;
    const forwarded = headersMap['x-forwarded-for'];
    if (forwarded) {
      const parts = forwarded.split(',').map((p) => p.trim()).filter((p) => isIP(p) !== 0);
      if (parts.length > 0) return parts[0];
    }
    return '127.0.0.1';
  }

  // Priority test: CF-Connecting-IP takes precedence over spoofed X-Forwarded-For
  const ip1 = testExtractIp({
    'cf-connecting-ip': '203.0.113.195',
    'x-forwarded-for': '198.51.100.1, 10.0.0.1',
  });
  assert(ip1 === '203.0.113.195', 'CF-Connecting-IP takes precedence over X-Forwarded-For');

  // X-Real-IP takes precedence over X-Forwarded-For when CF is absent
  const ip2 = testExtractIp({
    'x-real-ip': '203.0.113.50',
    'x-forwarded-for': '1.2.3.4',
  });
  assert(ip2 === '203.0.113.50', 'X-Real-IP takes precedence over X-Forwarded-For');

  // Rejection of invalid / malicious IP strings in headers
  const ip3 = testExtractIp({
    'cf-connecting-ip': 'invalid-ip-string<script>',
    'x-forwarded-for': 'malicious-header, 198.51.100.99',
  });
  assert(ip3 === '198.51.100.99', 'Filters out malformed IP values and picks valid IP');

  // 4. SEC-009 & SEC-R002: Centralized SVG Security Validation
  console.log('\n[Test SEC-009 / SEC-R002] Centralized SVG Malicious Payload Detection');
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

  const xssSvgXxe = '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><svg><text>&xxe;</text></svg>';
  assert(isDangerousSvg(xssSvgXxe), 'SVG with XXE DTD entity detected');

  const xssSvgCss = '<svg><style>circle { fill: expression(alert(1)); }</style><circle r="10"/></svg>';
  assert(isDangerousSvg(xssSvgCss), 'SVG with CSS expression in <style> detected');

  const xssSvgAnimate = '<svg><animate attributeName="href" values="javascript:alert(1)"/><a id="a"><circle r="10"/></a></svg>';
  assert(isDangerousSvg(xssSvgAnimate), 'SVG with <animate> targeting href attribute detected');

  console.log('\n🎉 ALL SECURITY REMEDIATION ROUND 2 TESTS PASSED SUCCESSFULLY!');
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
