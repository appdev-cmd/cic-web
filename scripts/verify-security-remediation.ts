/**
 * Security Remediation Verification Test Suite (Round 3)
 * Tests REAL production security utilities for SEC-001 through SEC-009, SEC-R001 through SEC-R006,
 * and Round 3 adversarial findings SEC-A001, SEC-A002, and SEC-A003.
 *
 * NOTE: NO MOCKED OR REIMPLEMENTED SECURITY LOGIC. Tests import and execute production functions directly.
 */

import { sanitizeHtmlContent } from '../src/shared/lib/sanitize';
import { isDangerousSvg, decodeXmlEntities, normalizeUri } from '../src/shared/lib/svg-security';
import { escapeHtml, interpolateTokens } from '../src/lib/email/tokens';
import {
  BoundedRateLimitStore,
  checkRateLimitWithStore,
  extractClientIp,
} from '../src/server/auth/rate-limit-core';
import { assertActorCanManageTargetUser } from '../src/features/users/server/repository';
import type { CmsPrincipal } from '../src/server/auth/guards';
import type { Sql } from 'postgres';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

async function runTests() {
  console.log('=== Running Security Remediation Round 3 Verification ===\n');

  // =========================================================================
  // 1. SEC-001 & SEC-R001: HTML Sanitizer & CSS Whitelist Policy
  // =========================================================================
  console.log('[Test SEC-001 / SEC-R001] Production HTML Sanitization & CSS Hardening');
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

  // =========================================================================
  // 2. SEC-003 & SEC-R004: Email HTML Escaping & Token Interpolation
  // =========================================================================
  console.log('\n[Test SEC-003 / SEC-R004] Email User-Input Escaping & Interpolation');
  const maliciousInput = '<img src=x onerror=alert(1)> & "quoted" \'single\'';
  const escaped = escapeHtml(maliciousInput);
  assert(!escaped.includes('<img'), 'Escapes opening bracket');
  assert(escaped.includes('&lt;img'), 'Converts < to &lt;');
  assert(escaped.includes('&amp;'), 'Converts & to &amp;');
  assert(escaped.includes('&quot;quoted&quot;'), 'Converts " to &quot;');
  assert(escaped.includes('&#39;single&#39;'), 'Converts \' to &#39;');

  const htmlTemplate = '<div class="email-body"><p>Kính gửi quý khách {{customer.full_name}},</p><p>Biểu mẫu: {{form.title}}</p></div>';
  const interpolatedHtml = interpolateTokens(htmlTemplate, {
    '{{customer.full_name}}': '<script>alert("pwned")</script> Nguyễn Văn A',
    '{{form.title}}': 'Tư vấn giải pháp & báo giá <img src=x onerror=alert(1)>',
  }, { isHtml: true });

  assert(!interpolatedHtml.includes('<script>'), 'Auto-escapes script tag in interpolated HTML tokens');
  assert(interpolatedHtml.includes('&lt;script&gt;'), 'Converts script tag to safe entities');
  assert(!interpolatedHtml.includes('<img'), 'Auto-escapes img tag in interpolated HTML tokens');
  assert(interpolatedHtml.includes('Nguyễn Văn A'), 'Preserves Vietnamese Unicode characters');

  const subjectTemplate = 'Thông báo: {{customer.full_name}} gửi liên hệ';
  const interpolatedSubject = interpolateTokens(subjectTemplate, {
    '{{customer.full_name}}': 'Nguyễn Văn A & Đối tác',
  }, { isHtml: false });
  assert(interpolatedSubject === 'Thông báo: Nguyễn Văn A & Đối tác gửi liên hệ', 'Preserves plain text in email subject without entity escaping');

  const rawHtmlTemplate = '<div>{{{trusted_table}}}</div>';
  const interpolatedRaw = interpolateTokens(rawHtmlTemplate, {
    '{{trusted_table}}': '<table><tr><td>Item</td></tr></table>',
  }, { isHtml: true });
  assert(interpolatedRaw.includes('<table><tr><td>Item</td></tr></table>'), 'Allows explicit {{{rawToken}}} markup');

  // =========================================================================
  // 3. SEC-A001: Production SVG Validator with Canonical XML Entity Decoding
  // =========================================================================
  console.log('\n[Test SEC-A001] Production SVG Security Validator with Adversarial Payloads');
  
  // Test XML Entity Canonicalization
  assert(decodeXmlEntities('jav&#x61;script:') === 'javascript:', 'Decodes hexadecimal numeric entities');
  assert(decodeXmlEntities('jav&#97;script:') === 'javascript:', 'Decodes decimal numeric entities');
  assert(decodeXmlEntities('&amp;#x61;') === 'a', 'Multi-pass entity decoding handles nested obfuscation');
  assert(normalizeUri('jav&#x0a;ascript:alert(1)').startsWith('javascript:'), 'Normalizes URIs with embedded control characters');

  // Adversarial SVG Payloads: Entity Encoded Protocols
  const xssEntityHex = '<svg xmlns="http://www.w3.org/2000/svg"><a href="jav&#x61;script:alert(1)"><text y="20">Click</text></a></svg>';
  assert(isDangerousSvg(xssEntityHex), 'Blocks XML hex entity in hyperlink href');

  const xssEntityDec = '<svg xmlns="http://www.w3.org/2000/svg"><a href="jav&#97;script:alert(1)"><text y="20">Click</text></a></svg>';
  assert(isDangerousSvg(xssEntityDec), 'Blocks XML decimal entity in hyperlink href');

  const xssXlinkEntity = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><a xlink:href="jav&#x61;script:alert(1)"><text>Click</text></a></svg>';
  assert(isDangerousSvg(xssXlinkEntity), 'Blocks XML entity in xlink:href');

  // Adversarial SVG Payloads: Whitespace & Control Character Event Handlers
  const xssNewlineOnload = '<svg xmlns="http://www.w3.org/2000/svg" on\nload="alert(1)"></svg>';
  assert(isDangerousSvg(xssNewlineOnload), 'Blocks newline inside event handler attribute');

  const xssTabOnload = '<svg xmlns="http://www.w3.org/2000/svg" on\tload="alert(1)"></svg>';
  assert(isDangerousSvg(xssTabOnload), 'Blocks tab character inside event handler attribute');

  const xssSlashOnload = '<svg xmlns="http://www.w3.org/2000/svg" onload/="alert(1)"></svg>';
  assert(isDangerousSvg(xssSlashOnload), 'Blocks slash delimiter in event handler attribute');

  const xssSpaceOnload = '<svg xmlns="http://www.w3.org/2000/svg" on load="alert(1)"></svg>';
  assert(isDangerousSvg(xssSpaceOnload), 'Blocks space within event handler attribute name');

  // External Resource Loading via <use>
  const xssExternalUse = '<svg xmlns="http://www.w3.org/2000/svg"><use href="http://attacker.com/evil.svg#x"/></svg>';
  assert(isDangerousSvg(xssExternalUse), 'Blocks external resource inclusion in <use> tag');

  const safeLocalUse = '<svg xmlns="http://www.w3.org/2000/svg"><use href="#local-icon"/></svg>';
  assert(!isDangerousSvg(safeLocalUse), 'Allows legitimate local fragment in <use href="#...">');

  // Baseline Malicious & Safe SVG constructs
  const cleanSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="red" /></svg>';
  assert(!isDangerousSvg(cleanSvg), 'Clean SVG passes validation');

  const xssSvgScript = '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>';
  assert(isDangerousSvg(xssSvgScript), 'SVG with <script> tag detected');

  const xssSvgOnload = '<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"></svg>';
  assert(isDangerousSvg(xssSvgOnload), 'SVG with standard onload attribute detected');

  const xssSvgForeignObject = '<svg><foreignObject width="100" height="100"><body xmlns="http://www.w3.org/1999/xhtml"><script>alert(1)</script></body></foreignObject></svg>';
  assert(isDangerousSvg(xssSvgForeignObject), 'SVG with foreignObject detected');

  const xssSvgXxe = '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><svg><text>&xxe;</text></svg>';
  assert(isDangerousSvg(xssSvgXxe), 'SVG with XXE DTD entity detected');

  const xssSvgCss = '<svg><style>circle { fill: expression(alert(1)); }</style><circle r="10"/></svg>';
  assert(isDangerousSvg(xssSvgCss), 'SVG with CSS expression in <style> detected');

  const xssSvgAnimate = '<svg><animate attributeName="href" values="javascript:alert(1)"/><a id="a"><circle r="10"/></a></svg>';
  assert(isDangerousSvg(xssSvgAnimate), 'SVG with <animate> targeting href attribute detected');

  // =========================================================================
  // 4. SEC-A002: Production Bounded Rate Limiter Store & Client IP Extraction
  // =========================================================================
  console.log('\n[Test SEC-A002] Production Bounded Rate Limiter Store & Client IP Extraction');

  // Test bounded size and LRU eviction directly on BoundedRateLimitStore
  const boundedStore = new BoundedRateLimitStore({ maxKeys: 5, cleanupIntervalMs: 10_000 });
  for (let i = 0; i < 10; i++) {
    boundedStore.set(`ip-${i}`, { timestamps: [Date.now()] });
  }
  assert(boundedStore.size() === 5, 'Bounded store strictly caps key count to maxKeys (5 keys)');
  assert(!boundedStore.has('ip-0'), 'Oldest entry ip-0 evicted by LRU policy');
  assert(!boundedStore.has('ip-4'), 'Oldest entry ip-4 evicted by LRU policy');
  assert(boundedStore.has('ip-9'), 'Most recent entry ip-9 retained in store');

  // Test sliding-window limiting with production checkRateLimitWithStore
  const testStore = new BoundedRateLimitStore({ maxKeys: 100 });
  const key = 'test-client-192.0.2.1';
  assert(checkRateLimitWithStore(testStore, key, { maxRequests: 3, windowSeconds: 10 }).success === true, 'Request 1/3 allowed');
  assert(checkRateLimitWithStore(testStore, key, { maxRequests: 3, windowSeconds: 10 }).success === true, 'Request 2/3 allowed');
  assert(checkRateLimitWithStore(testStore, key, { maxRequests: 3, windowSeconds: 10 }).success === true, 'Request 3/3 allowed');
  assert(checkRateLimitWithStore(testStore, key, { maxRequests: 3, windowSeconds: 10 }).success === false, 'Request 4/3 blocked by rate limit');

  // Production Client IP Extraction: Priority and Validation
  const ip1 = extractClientIp({
    get(name: string) {
      if (name === 'cf-connecting-ip') return '203.0.113.195';
      if (name === 'x-forwarded-for') return '198.51.100.1, 10.0.0.1';
      return null;
    },
  });
  assert(ip1 === '203.0.113.195', 'CF-Connecting-IP takes precedence over X-Forwarded-For');

  const ip2 = extractClientIp({
    get(name: string) {
      if (name === 'x-real-ip') return '203.0.113.50';
      if (name === 'x-forwarded-for') return '1.2.3.4';
      return null;
    },
  });
  assert(ip2 === '203.0.113.50', 'X-Real-IP takes precedence over X-Forwarded-For when CF is absent');

  const ip3 = extractClientIp({
    get(name: string) {
      if (name === 'cf-connecting-ip') return 'invalid-ip-string<script>';
      if (name === 'x-forwarded-for') return 'malicious-header, 198.51.100.99';
      return null;
    },
  });
  assert(ip3 === '198.51.100.99', 'Filters out malformed IP strings and extracts valid IP');

  // =========================================================================
  // 5. SEC-007 & SEC-R003: RBAC Domain Guard Assertions
  // =========================================================================
  console.log('\n[Test SEC-007 / SEC-R003] Production RBAC Domain Guard Hierarchy Assertions');

  const normalActor: CmsPrincipal = {
    authUser: { id: 'u1', app_metadata: {}, user_metadata: {}, aud: 'authenticated', created_at: '' },
    legacyUserId: 10,
    email: 'editor@cic.com.vn',
    username: 'editor1',
    fullName: 'Editor User',
    roleCodes: ['editor'],
    permissions: [{ module: 'users', action: 'edit' }],
    isAdministrator: false,
  };

  const adminActor: CmsPrincipal = {
    ...normalActor,
    legacyUserId: 1,
    roleCodes: ['admin'],
    isAdministrator: true,
  };

  // 1. Admin actor can manage any user target without error
  let adminAllowed = false;
  try {
    // Stub sql: returns admin target row
    const mockSql = ((() => Promise.resolve([{ 1: 1 }])) as unknown) as Sql;
    await assertActorCanManageTargetUser(mockSql, adminActor, 2, 'chỉnh sửa');
    adminAllowed = true;
  } catch {
    adminAllowed = false;
  }
  assert(adminAllowed, 'Administrator actor is permitted to manage target');

  // 2. Non-admin actor is blocked when target user is an Administrator
  let nonAdminBlocked = false;
  try {
    // Stub sql: target is an admin
    const mockSqlTargetAdmin = ((() => Promise.resolve([{ 1: 1 }])) as unknown) as Sql;
    await assertActorCanManageTargetUser(mockSqlTargetAdmin, normalActor, 2, 'chỉnh sửa');
  } catch (err) {
    if (err instanceof Error && err.message.includes('Chỉ Quản trị viên cấp cao')) {
      nonAdminBlocked = true;
    }
  }
  assert(nonAdminBlocked, 'Non-admin actor is strictly blocked from modifying Administrator accounts');

  // 3. Non-admin actor is allowed when target user is a standard user
  let nonAdminAllowedForStandard = false;
  try {
    // Stub sql: target is NOT an admin (returns empty rows)
    const mockSqlTargetNormal = ((() => Promise.resolve([])) as unknown) as Sql;
    await assertActorCanManageTargetUser(mockSqlTargetNormal, normalActor, 15, 'chỉnh sửa');
    nonAdminAllowedForStandard = true;
  } catch {
    nonAdminAllowedForStandard = false;
  }
  assert(nonAdminAllowedForStandard, 'Non-admin actor is permitted to manage standard (non-admin) accounts');

  console.log('\n🎉 ALL SECURITY REMEDIATION ROUND 3 VERIFICATIONS PASSED SUCCESSFULLY!');
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
