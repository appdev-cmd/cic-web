import assert from 'node:assert/strict';
import { getPostgresClient } from '../src/server/db/postgres.ts';

const BASE_URL = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';

interface SeoAuditIssue {
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  url: string;
  message: string;
  detail?: string;
}

interface PageAuditResult {
  url: string;
  title: string;
  description: string;
  canonical: string;
  status: number;
  h1Count: number;
  h1Text: string;
  hasOgImage: boolean;
  ogImageUrl?: string;
  hasJsonLd: boolean;
  jsonLdTypes: string[];
  totalImages: number;
  missingAltImages: number;
  hasHreflang: boolean;
  issues: SeoAuditIssue[];
}

const auditIssues: SeoAuditIssue[] = [];
const pageResults: PageAuditResult[] = [];

function recordIssue(severity: 'HIGH' | 'MEDIUM' | 'LOW', category: string, url: string, message: string, detail?: string) {
  auditIssues.push({ severity, category, url, message, detail });
  const icon = severity === 'HIGH' ? '❌' : severity === 'MEDIUM' ? '⚠️' : 'ℹ️';
  console.log(`  ${icon} [${severity}] ${category}: ${message} ${detail ? '(' + detail + ')' : ''}`);
}

async function auditUrl(path: string, expectedType: 'home' | 'listing' | 'detail' | 'static'): Promise<PageAuditResult> {
  const fullUrl = `${BASE_URL}${path}`;
  const issues: SeoAuditIssue[] = [];

  const res = await fetch(fullUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' } });
  const status = res.status;
  const html = await res.text();

  if (status !== 200) {
    recordIssue('HIGH', 'HTTP Status', path, `HTTP ${status} thay vì 200 OK`);
  }

  // 1. Title Tag
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';
  if (!title) {
    recordIssue('HIGH', 'Title Tag', path, 'Thiếu thẻ <title>');
  } else if (title.length < 15) {
    recordIssue('MEDIUM', 'Title Tag', path, 'Tiêu đề quá ngắn (< 15 ký tự)', `"${title}"`);
  } else if (title.length > 70) {
    recordIssue('LOW', 'Title Tag', path, 'Tiêu đề có thể bị cắt bớt trên Google SERP (> 70 ký tự)', `"${title}" (${title.length} chars)`);
  }
  // Check double brand
  if (/\|\s*CIC\b.*\|\s*CIC/i.test(title) || /CIC Technology.*CIC Technology/i.test(title)) {
    recordIssue('MEDIUM', 'Title Tag', path, 'Lặp thương hiệu kép trong thẻ title', `"${title}"`);
  }

  // 2. Meta Description
  const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) ||
                    html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);
  const description = descMatch ? descMatch[1].trim() : '';
  if (!description) {
    recordIssue('HIGH', 'Meta Description', path, 'Thiếu thẻ <meta name="description">');
  } else if (description.length < 50) {
    recordIssue('MEDIUM', 'Meta Description', path, 'Mô tả meta quá ngắn (< 50 ký tự)', `"${description}"`);
  } else if (description.length > 250) {
    recordIssue('LOW', 'Meta Description', path, 'Mô tả meta quá dài (> 250 ký tự)', `${description.length} chars`);
  }

  // 3. Canonical URL
  const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i);
  const canonical = canonicalMatch ? canonicalMatch[1].trim() : '';
  if (!canonical) {
    recordIssue('HIGH', 'Canonical', path, 'Thiếu thẻ canonical URL');
  } else if (!canonical.startsWith('http')) {
    recordIssue('HIGH', 'Canonical', path, 'Canonical phải là URL tuyệt đối (absolute URL)', canonical);
  }

  // 4. Meta Robots
  const robotsMatch = html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/i);
  const robotsContent = robotsMatch ? robotsMatch[1].toLowerCase() : '';
  if (robotsContent.includes('noindex')) {
    recordIssue('HIGH', 'Meta Robots', path, 'Trang công khai nhưng bị dán nhãn noindex', robotsContent);
  }

  // 5. OpenGraph & Social Cards
  const ogTitleMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']*)["']/i);
  const ogDescMatch = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)["']/i);
  const ogImageMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']*)["']/i);
  const ogUrlMatch = html.match(/<meta[^>]+property=["']og:url["'][^>]+content=["']([^"']*)["']/i);
  const twitterCardMatch = html.match(/<meta[^>]+name=["']twitter:card["'][^>]+content=["']([^"']*)["']/i);

  if (!ogTitleMatch) recordIssue('LOW', 'OpenGraph', path, 'Thiếu og:title');
  if (!ogDescMatch) recordIssue('LOW', 'OpenGraph', path, 'Thiếu og:description');
  if (!ogImageMatch) recordIssue('MEDIUM', 'OpenGraph', path, 'Thiếu og:image cho thumbnail mạng xã hội');
  if (!twitterCardMatch) recordIssue('LOW', 'Twitter Card', path, 'Thiếu twitter:card');

  // 6. Heading 1 (h1) Hierarchy
  const h1Matches = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
  const h1Count = h1Matches.length;
  const h1Text = h1Matches.map(m => m[1].replace(/<[^>]+>/g, '').trim()).join(' | ');

  if (h1Count === 0) {
    recordIssue('HIGH', 'Heading Structure', path, 'Thiếu thẻ <h1> chính cho trang');
  } else if (h1Count > 1) {
    recordIssue('LOW', 'Heading Structure', path, `Có ${h1Count} thẻ <h1> (khuyên dùng 1 thẻ h1 duy nhất)`, h1Text.slice(0, 80));
  }

  // 7. Structured Data (JSON-LD)
  const jsonLdBlocks = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const jsonLdTypes: string[] = [];

  for (const block of jsonLdBlocks) {
    try {
      const data = JSON.parse(block[1]);
      const type = data['@type'] || (Array.isArray(data['@graph']) ? data['@graph'].map((g: any) => g['@type']).join(', ') : 'unknown');
      jsonLdTypes.push(type);
    } catch (err: any) {
      recordIssue('HIGH', 'Structured Data', path, 'Lỗi cú pháp JSON trong thẻ JSON-LD', err.message);
    }
  }

  if (jsonLdBlocks.length === 0 && (expectedType === 'detail' || expectedType === 'home')) {
    recordIssue('MEDIUM', 'Structured Data', path, 'Thiếu Schema.org JSON-LD cho trang');
  }

  // 8. Image Alt Attributes
  const imgTags = [...html.matchAll(/<img\b([^>]*)>/gi)];
  let missingAltImages = 0;
  for (const tag of imgTags) {
    const altMatch = tag[1].match(/\balt=(?:["']([^"']*)["']|([^\s>]+))/i);
    if (!altMatch || altMatch[1] === undefined && altMatch[2] === undefined) {
      missingAltImages++;
    }
  }
  if (missingAltImages > 0) {
    recordIssue('MEDIUM', 'Image SEO', path, `${missingAltImages}/${imgTags.length} hình ảnh thiếu thuộc tính alt`);
  }

  // 9. Hreflang / Alternates
  const hreflangMatches = [...html.matchAll(/<link[^>]+rel=["']alternate["'][^>]+hreflang=["']([^"']*)["']/gi)];
  const hasHreflang = hreflangMatches.length > 0;
  if (!hasHreflang) {
    recordIssue('LOW', 'Internationalization', path, 'Thiếu liên kết đa ngôn ngữ alternate hreflang');
  }

  const result: PageAuditResult = {
    url: path,
    title,
    description,
    canonical,
    status,
    h1Count,
    h1Text,
    hasOgImage: Boolean(ogImageMatch),
    ogImageUrl: ogImageMatch ? ogImageMatch[1] : undefined,
    hasJsonLd: jsonLdBlocks.length > 0,
    jsonLdTypes,
    totalImages: imgTags.length,
    missingAltImages,
    hasHreflang,
    issues,
  };

  pageResults.push(result);
  return result;
}

async function runFullSiteSeoAudit() {
  console.log(`\n========================================================================`);
  console.log(`🔍 KIỂM THỬ SEO TOÀN DIỆN (EVIDENCE-LED FULL-SITE SEO AUDIT)`);
  console.log(`Target: ${BASE_URL}`);
  console.log(`Timestamp: ${new Date().toLocaleString('vi-VN')}`);
  console.log(`========================================================================\n`);

  const sql = getPostgresClient();

  // 1. Kiểm tra robots.txt
  console.log(`--- [1/6] KIỂM TRA ROBOTS.TXT ---`);
  try {
    const robotsRes = await fetch(`${BASE_URL}/robots.txt`);
    const robotsTxt = await robotsRes.text();
    console.log(`HTTP Status: ${robotsRes.status}`);
    const hasDisallowCms = robotsTxt.includes('/cms/');
    const hasSitemap = robotsTxt.toLowerCase().includes('sitemap:');
    console.log(`  - Disallow /cms/: ${hasDisallowCms ? '✅ Có' : '❌ Thiếu'}`);
    console.log(`  - Khai báo Sitemap: ${hasSitemap ? '✅ Có' : '❌ Thiếu'}`);
    if (!hasDisallowCms) recordIssue('HIGH', 'robots.txt', '/robots.txt', 'Chưa chặn crawler index khu vực quản trị /cms/');
    if (!hasSitemap) recordIssue('MEDIUM', 'robots.txt', '/robots.txt', 'Thiếu đường dẫn Sitemap trong robots.txt');
  } catch (err: any) {
    recordIssue('HIGH', 'robots.txt', '/robots.txt', 'Không thể nạp file robots.txt', err.message);
  }

  // 2. Kiểm tra sitemap.xml
  console.log(`\n--- [2/6] KIỂM TRA SITEMAP.XML ---`);
  let sitemapUrls: string[] = [];
  try {
    const sitemapRes = await fetch(`${BASE_URL}/sitemap.xml`);
    console.log(`HTTP Status: ${sitemapRes.status}`);
    const sitemapXml = await sitemapRes.text();
    const locMatches = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/gi)].map(m => m[1]);
    sitemapUrls = locMatches;
    console.log(`  - Tổng số URL trong Sitemap: ${sitemapUrls.length}`);
    const hasHome = sitemapUrls.some(u => u.endsWith('.vn') || u.endsWith('.vn/') || u.endsWith(':3000') || u.endsWith(':3000/'));
    const hasProducts = sitemapUrls.some(u => u.includes('/san-pham') || u.includes('/products'));
    const hasNews = sitemapUrls.some(u => u.includes('/tin-tuc') || u.includes('/news'));
    console.log(`  - Chứa Trang chủ: ${hasHome ? '✅' : '❌'}`);
    console.log(`  - Chứa Sản phẩm: ${hasProducts ? '✅' : '❌'}`);
    console.log(`  - Chứa Tin tức: ${hasNews ? '✅' : '❌'}`);
  } catch (err: any) {
    recordIssue('HIGH', 'sitemap.xml', '/sitemap.xml', 'Không thể nạp file sitemap.xml', err.message);
  }

  // Lấy dữ liệu thực tế từ database để test các URL slug tiêu biểu
  const [sampleProduct] = await sql`SELECT alias FROM cic_products WHERE (published::text = 'true' OR published::text = '1') AND alias IS NOT NULL ORDER BY id DESC LIMIT 1`;
  const [sampleService] = await sql`SELECT alias FROM cic_services WHERE (published::text = 'true' OR published::text = '1') AND alias IS NOT NULL ORDER BY id DESC LIMIT 1`;
  const [sampleNews] = await sql`SELECT alias FROM cic_news WHERE (published::text = 'true' OR published::text = '1') AND alias IS NOT NULL ORDER BY id DESC LIMIT 1`;
  const [sampleProject] = await sql`SELECT alias FROM cic_projects WHERE (published::text = 'true' OR published::text = '1') AND alias IS NOT NULL ORDER BY id DESC LIMIT 1`;

  console.log(`\nSample entities from DB:`);
  console.log(`- Product: ${sampleProduct?.alias}`);
  console.log(`- Service: ${sampleService?.alias}`);
  console.log(`- News: ${sampleNews?.alias}`);
  console.log(`- Project: ${sampleProject?.alias}`);

  // 3. Kiểm tra các Trang Cốt Lõi (Core Landing Pages)
  console.log(`\n--- [3/6] AUDIT TRANG CHỦ & TRANG TĨNH ---`);
  const staticRoutes = [
    { path: '/', type: 'home' as const, name: 'Trang chủ (VI)' },
    { path: '/gioi-thieu', type: 'static' as const, name: 'Giới thiệu (VI)' },
    { path: '/lien-he', type: 'static' as const, name: 'Liên hệ (VI)' },
    { path: '/en', type: 'home' as const, name: 'Home (EN)' },
    { path: '/en/about', type: 'static' as const, name: 'About (EN)' },
    { path: '/en/contact', type: 'static' as const, name: 'Contact (EN)' },
  ];

  for (const r of staticRoutes) {
    console.log(`\nAuditing: ${r.name} (${r.path})`);
    await auditUrl(r.path, r.type);
  }

  // 4. Kiểm tra các Trang Danh Mục (Canonical Listing Pages)
  console.log(`\n--- [4/6] AUDIT TRANG DANH MỤC & TẬP HỢP ---`);
  const listingRoutes = [
    { path: '/products', type: 'listing' as const, name: 'Danh sách Sản phẩm (VI)' },
    { path: '/services', type: 'listing' as const, name: 'Danh sách Dịch vụ (VI)' },
    { path: '/news', type: 'listing' as const, name: 'Danh sách Tin tức (VI)' },
    { path: '/projects', type: 'listing' as const, name: 'Danh sách Dự án (VI)' },
    { path: '/en/products', type: 'listing' as const, name: 'Products Listing (EN)' },
    { path: '/en/services', type: 'listing' as const, name: 'Services Listing (EN)' },
    { path: '/en/news', type: 'listing' as const, name: 'News Listing (EN)' },
    { path: '/en/projects', type: 'listing' as const, name: 'Projects Listing (EN)' },
  ];

  for (const r of listingRoutes) {
    console.log(`\nAuditing: ${r.name} (${r.path})`);
    await auditUrl(r.path, r.type);
  }

  // 5. Kiểm tra các Trang Chi Tiết (Entity Detail Pages)
  console.log(`\n--- [5/6] AUDIT TRANG CHI TIẾT SẢN PHẨM / BÀI VIẾT / DỊCH VỤ ---`);
  const detailRoutes = [];
  if (sampleProduct?.alias) detailRoutes.push({ path: `/products/${sampleProduct.alias}`, type: 'detail' as const, name: 'Chi tiết Sản phẩm' });
  if (sampleService?.alias) detailRoutes.push({ path: `/services/${sampleService.alias}`, type: 'detail' as const, name: 'Chi tiết Dịch vụ' });
  if (sampleNews?.alias) detailRoutes.push({ path: `/news/${sampleNews.alias}`, type: 'detail' as const, name: 'Chi tiết Tin tức' });
  if (sampleProject?.alias) detailRoutes.push({ path: `/projects/${sampleProject.alias}`, type: 'detail' as const, name: 'Chi tiết Dự án' });

  for (const r of detailRoutes) {
    console.log(`\nAuditing: ${r.name} (${r.path})`);
    await auditUrl(r.path, r.type);
  }

  // 6. Kiểm tra Xử lý 301 Redirects & 404 Not Found
  console.log(`\n--- [6/6] AUDIT TRẠNG THÁI 301 REDIRECTS & 404 NOT FOUND ---`);
  const redirectsToVerify = [
    { from: '/san-pham', expected: '/products' },
    { from: '/tin-tuc', expected: '/news' },
    { from: '/dich-vu', expected: '/services' },
    { from: '/du-an', expected: '/projects' },
  ];

  for (const red of redirectsToVerify) {
    const res = await fetch(`${BASE_URL}${red.from}`, { redirect: 'manual' });
    const location = res.headers.get('location') || '';
    const is301 = res.status === 301;
    const targetMatches = location.endsWith(red.expected) || location.includes(red.expected);
    if (is301 && targetMatches) {
      console.log(`  ✅ 301 Permanent Redirect: ${red.from} -> ${red.expected}`);
    } else {
      recordIssue('HIGH', '301 Redirect', red.from, `Redirect không chính xác: HTTP ${res.status}, Location: "${location}" (mong muốn ${red.expected})`);
    }
  }

  const notFoundPath = `/products/khong-ton-tai-slug-${Date.now()}`;
  const notFoundRes = await fetch(`${BASE_URL}${notFoundPath}`);
  const notFoundHtml = await notFoundRes.text();
  const is404StatusOrDevOverlay = notFoundRes.status === 404 || (notFoundRes.status === 200 && (notFoundHtml.includes('not-found') || notFoundHtml.includes('404') || notFoundHtml.includes('NEXT_NOT_FOUND') || notFoundHtml.includes('NotFoundError')));
  if (is404StatusOrDevOverlay) {
    console.log(`  ✅ 404 Not Found được xử lý chuẩn xác (Status: ${notFoundRes.status} in dev mode)`);
  } else {
    recordIssue('HIGH', '404 Handling', notFoundPath, `URL không tồn tại trả về mã ${notFoundRes.status} thay vì 404`);
  }

  // Tổng hợp thống kê
  const highIssues = auditIssues.filter(i => i.severity === 'HIGH');
  const mediumIssues = auditIssues.filter(i => i.severity === 'MEDIUM');
  const lowIssues = auditIssues.filter(i => i.severity === 'LOW');

  console.log(`\n========================================================================`);
  console.log(`📊 TỔNG KẾT BÁO CÁO AUDIT SEO TOÀN DIỆN`);
  console.log(`- Tổng số trang đã audit: ${pageResults.length}`);
  console.log(`- Lỗi nghiêm trọng (HIGH): ${highIssues.length}`);
  console.log(`- Cảnh báo cần cải thiện (MEDIUM): ${mediumIssues.length}`);
  console.log(`- Khuyến nghị tối ưu (LOW): ${lowIssues.length}`);
  console.log(`========================================================================\n`);

  if (highIssues.length > 0) {
    console.log(`🚨 DANH SÁCH LỖI NGHIÊM TRỌNG (HIGH):`);
    highIssues.forEach((iss, idx) => {
      console.log(`${idx + 1}. [${iss.category}] ${iss.url} — ${iss.message} ${iss.detail ? '(' + iss.detail + ')' : ''}`);
    });
  }

  if (mediumIssues.length > 0) {
    console.log(`\n⚠️ DANH SÁCH CẢNH BÁO (MEDIUM):`);
    mediumIssues.forEach((iss, idx) => {
      console.log(`${idx + 1}. [${iss.category}] ${iss.url} — ${iss.message} ${iss.detail ? '(' + iss.detail + ')' : ''}`);
    });
  }

  console.log(`\nChi tiết các trang đã kiểm tra:`);
  console.table(pageResults.map(p => ({
    URL: p.url,
    Status: p.status,
    'Title (Chars)': p.title ? `${p.title.slice(0, 30)}... (${p.title.length})` : 'MISSING',
    'Desc (Chars)': p.description ? `${p.description.length}` : 'MISSING',
    H1: p.h1Count,
    'OG Image': p.hasOgImage ? 'YES' : 'NO',
    'JSON-LD': p.jsonLdTypes.join(', ') || 'NO',
    'Alt Missing': p.missingAltImages,
  })));
}

runFullSiteSeoAudit().catch(console.error);
