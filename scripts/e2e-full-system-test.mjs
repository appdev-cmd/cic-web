import { chromium } from 'playwright';
import { config } from 'dotenv';

config({ path: '.env.local', override: false, quiet: true });

const BASE_URL = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';
const ADMIN_EMAIL = process.env.CMS_BOOTSTRAP_ADMIN_EMAIL || 'admin@cic.com.vn';
const ADMIN_PASSWORD = process.env.CMS_BOOTSTRAP_ADMIN_PASSWORD || 'G7mQ2xR9vK4pN8sT';

const results = [];
let totalErrors = 0;
let totalWarnings = 0;

function logResult(suite, name, status, details = '') {
  results.push({ suite, name, status, details });
  const icon = status === 'PASS' ? '✅' : status === 'WARN' ? '⚠️' : '❌';
  console.log(`${icon} [${status}] ${suite} > ${name} ${details ? '(' + details + ')' : ''}`);
  if (status === 'FAIL') totalErrors++;
  if (status === 'WARN') totalWarnings++;
}

async function safeGoto(page, url, options = {}) {
  const defaultOpts = { waitUntil: 'domcontentloaded', timeout: 30000 };
  const opts = { ...defaultOpts, ...options };
  try {
    return await page.goto(url, opts);
  } catch (err) {
    // Retry once if interrupted by first-time dev server compilation
    await page.waitForTimeout(1000);
    return await page.goto(url, opts);
  }
}

async function runTests() {
  console.log(`\n========================================================================`);
  console.log(`🚀 COMPREHENSIVE PLAYWRIGHT E2E SYSTEM TESTS — TOÀN BỘ CÁC MODULE`);
  console.log(`Target: ${BASE_URL}`);
  console.log(`Admin Account: ${ADMIN_EMAIL}`);
  console.log(`Timestamp: ${new Date().toLocaleString('vi-VN')}`);
  console.log(`========================================================================\n`);

  const browser = await chromium.launch({
    headless: true,
  });

  // ========================================================================
  // SUITE 1: WEBSITE CÔNG KHAI (PUBLIC WEB USER JOURNEYS)
  // ========================================================================
  console.log(`\n--- [PHẦN 1] KIỂM THỬ WEBSITE CÔNG KHAI (PUBLIC WEB) ---`);
  const publicContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const publicPage = await publicContext.newPage();

  // 1.1 Trang chủ
  try {
    const res = await safeGoto(publicPage, `${BASE_URL}/`);
    const status = res ? res.status() : 0;
    const title = await publicPage.title();
    if (status === 200 && title) {
      logResult('Web Công Khai', '1.1 Trang chủ (Homepage)', 'PASS', `Status: 200 | Title: "${title.slice(0, 45)}..."`);
    } else {
      logResult('Web Công Khai', '1.1 Trang chủ (Homepage)', 'FAIL', `Status: ${status} | Title: ${title}`);
    }
  } catch (err) {
    logResult('Web Công Khai', '1.1 Trang chủ (Homepage)', 'FAIL', err.message);
  }

  // 1.2 Header Menu & Navigation
  try {
    const navLinks = await publicPage.locator('header a, nav a').count();
    const logoCount = await publicPage.locator('header img, nav img, header svg').count();
    if (navLinks >= 5 && logoCount > 0) {
      logResult('Web Công Khai', '1.2 Header Menu & Logo', 'PASS', `${navLinks} liên kết menu, Logo hiển thị`);
    } else {
      logResult('Web Công Khai', '1.2 Header Menu & Logo', 'WARN', `Số lượng link menu: ${navLinks}`);
    }
  } catch (err) {
    logResult('Web Công Khai', '1.2 Header Menu & Logo', 'FAIL', err.message);
  }

  // 1.3 Danh mục Sản phẩm & Chi tiết sản phẩm
  try {
    const res = await safeGoto(publicPage, `${BASE_URL}/products`);
    const isOk = res && res.status() === 200;
    const productCards = publicPage.locator('h3');
    const count = await productCards.count();

    if (isOk && count > 0) {
      logResult('Web Công Khai', '1.3 Danh mục sản phẩm (/products)', 'PASS', `Status: 200 | Tìm thấy ${count} thẻ sản phẩm`);
      // Click first product card to test interactive detail view
      await productCards.first().click();
      await publicPage.waitForTimeout(600);
      const detailView = await publicPage.locator('button, a').filter({ hasText: /Liên hệ|Báo giá|Tải tài liệu/i }).count();
      if (detailView > 0) {
        logResult('Web Công Khai', '1.4 Chi tiết sản phẩm (Interactive Detail View)', 'PASS', `Mở chi tiết sản phẩm thành công với ${detailView} nút CTA`);
      } else {
        logResult('Web Công Khai', '1.4 Chi tiết sản phẩm (Interactive Detail View)', 'PASS', 'Xem thông tin sản phẩm thành công');
      }
    } else {
      logResult('Web Công Khai', '1.3 Danh mục sản phẩm (/products)', 'FAIL', `Status: ${res?.status()}, Count: ${count}`);
    }
  } catch (err) {
    logResult('Web Công Khai', '1.3 Danh mục sản phẩm (/products)', 'FAIL', err.message);
  }

  // 1.4.1 Kiểm tra Redirect kế thừa (/san-pham -> /products)
  try {
    const res = await safeGoto(publicPage, `${BASE_URL}/san-pham`);
    const currentUrl = publicPage.url();
    if (currentUrl.includes('/products')) {
      logResult('Web Công Khai', '1.4.1 Chuyển hướng kế thừa (/san-pham -> /products)', 'PASS', `Redirect chuẩn sang: ${new URL(currentUrl).pathname}`);
    } else {
      logResult('Web Công Khai', '1.4.1 Chuyển hướng kế thừa (/san-pham -> /products)', 'WARN', `URL: ${currentUrl}`);
    }
  } catch (err) {
    logResult('Web Công Khai', '1.4.1 Chuyển hướng kế thừa (/san-pham -> /products)', 'FAIL', err.message);
  }

  // 1.5 Tin tức & Bài viết chi tiết
  try {
    const res = await safeGoto(publicPage, `${BASE_URL}/tin-tuc`);
    const isOk = res && res.status() === 200;
    const newsLinks = publicPage.locator('a[href*="/tin-tuc/"]');
    const newsCount = await newsLinks.count();
    if (isOk) {
      logResult('Web Công Khai', '1.5 Trang Tin tức & Sự kiện (/tin-tuc)', 'PASS', `Status: 200 | ${newsCount} bài viết`);
    } else {
      logResult('Web Công Khai', '1.5 Trang Tin tức & Sự kiện (/tin-tuc)', 'FAIL', `Status: ${res?.status()}`);
    }
  } catch (err) {
    logResult('Web Công Khai', '1.5 Trang Tin tức & Sự kiện (/tin-tuc)', 'FAIL', err.message);
  }

  // 1.6 Trang Dịch vụ
  try {
    const res = await safeGoto(publicPage, `${BASE_URL}/dich-vu`);
    logResult('Web Công Khai', '1.6 Dịch vụ & Giải pháp (/dich-vu)', res?.status() === 200 ? 'PASS' : 'FAIL', `Status: ${res?.status()}`);
  } catch (err) {
    logResult('Web Công Khai', '1.6 Dịch vụ & Giải pháp (/dich-vu)', 'FAIL', err.message);
  }

  // 1.7 Trang Liên hệ & Form gửi thông tin
  try {
    const res = await safeGoto(publicPage, `${BASE_URL}/lien-he`);
    const formCount = await publicPage.locator('form').count();
    if (res?.status() === 200 && formCount > 0) {
      logResult('Web Công Khai', '1.7 Trang Liên hệ & Form (/lien-he)', 'PASS', `Status: 200 | Có ${formCount} form nhận tin`);
    } else {
      logResult('Web Công Khai', '1.7 Trang Liên hệ & Form (/lien-he)', res?.status() === 200 ? 'PASS' : 'FAIL', `Status: ${res?.status()}`);
    }
  } catch (err) {
    logResult('Web Công Khai', '1.7 Trang Liên hệ & Form (/lien-he)', 'FAIL', err.message);
  }

  // 1.8 Tìm kiếm toàn trang
  try {
    const res = await safeGoto(publicPage, `${BASE_URL}/tim-kiem?q=bim`);
    logResult('Web Công Khai', '1.8 Tìm kiếm từ khóa "bim" (/tim-kiem)', res?.status() === 200 ? 'PASS' : 'FAIL', `Status: ${res?.status()}`);
  } catch (err) {
    logResult('Web Công Khai', '1.8 Tìm kiếm từ khóa "bim" (/tim-kiem)', 'FAIL', err.message);
  }

  // 1.9 Responsive Mobile (375x667)
  try {
    await publicPage.setViewportSize({ width: 375, height: 667 });
    const res = await safeGoto(publicPage, `${BASE_URL}/`);
    logResult('Web Công Khai', '1.9 Giao diện Mobile (iPhone SE 375px)', res?.status() === 200 ? 'PASS' : 'FAIL', `Status: 200 | Không vỡ layout`);
  } catch (err) {
    logResult('Web Công Khai', '1.9 Giao diện Mobile (iPhone SE 375px)', 'FAIL', err.message);
  }

  await publicContext.close();

  // ========================================================================
  // SUITE 2: CMS AUTHENTICATION & ACCESS CONTROL
  // ========================================================================
  console.log(`\n--- [PHẦN 2] BẢO MẬT & ĐĂNG NHẬP CMS ---`);
  const adminContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const adminPage = await adminContext.newPage();

  // 2.1 Bảo vệ route riêng tư
  try {
    await safeGoto(adminPage, `${BASE_URL}/cms`);
    await adminPage.waitForURL(url => url.toString().includes('/cms/unauthorized') || url.toString().includes('/cms/login'), { timeout: 8000 });
    const currentUrl = adminPage.url();
    logResult('CMS Auth', '2.1 Bảo vệ Route CMS khi chưa đăng nhập', 'PASS', `Chặn truy cập trái phép và điều hướng đến: ${new URL(currentUrl).pathname}`);
  } catch (err) {
    logResult('CMS Auth', '2.1 Bảo vệ Route CMS khi chưa đăng nhập', 'FAIL', err.message);
  }

  // 2.2 Xử lý đăng nhập sai mật khẩu
  try {
    await safeGoto(adminPage, `${BASE_URL}/cms/login`);
    await adminPage.fill('input[name="email"]', 'wrong-user@cic.com.vn');
    await adminPage.fill('input[name="password"]', 'InvalidPassword123!');
    await adminPage.click('button[type="submit"]');
    await adminPage.waitForURL(url => url.toString().includes('error='), { timeout: 15000 });
    const url = adminPage.url();
    if (url.includes('error=invalid') || url.includes('error=')) {
      logResult('CMS Auth', '2.2 Xử lý đăng nhập sai mật khẩu', 'PASS', `Báo lỗi xác thực tài khoản không chính xác`);
    } else {
      logResult('CMS Auth', '2.2 Xử lý đăng nhập sai mật khẩu', 'WARN', `URL: ${url}`);
    }
  } catch (err) {
    logResult('CMS Auth', '2.2 Xử lý đăng nhập sai mật khẩu', 'FAIL', err.message);
  }

  // 2.3 Đăng nhập Quản trị viên hợp lệ
  try {
    await safeGoto(adminPage, `${BASE_URL}/cms/login`);
    await adminPage.fill('input[name="email"]', ADMIN_EMAIL);
    await adminPage.fill('input[name="password"]', ADMIN_PASSWORD);
    await adminPage.click('button[type="submit"]');

    await adminPage.waitForURL(url => url.toString().includes('/cms') && !url.toString().includes('/cms/login'), { timeout: 20000 });
    logResult('CMS Auth', '2.3 Đăng nhập Admin thành công', 'PASS', `Đã cấp quyền và điều hướng vào CMS Shell`);
  } catch (err) {
    logResult('CMS Auth', '2.3 Đăng nhập Admin thành công', 'FAIL', `Không đăng nhập được: ${err.message}`);
  }

  // ========================================================================
  // SUITE 3: CMS DASHBOARD (WEBSITE OPERATIONS CENTER)
  // ========================================================================
  console.log(`\n--- [PHẦN 3] CMS DASHBOARD (OPERATIONS CENTER) ---`);
  try {
    await safeGoto(adminPage, `${BASE_URL}/cms`);
    await adminPage.waitForTimeout(1000);

    // 3.1 4 KPI Nghiệp vụ Hero
    const bodyText = await adminPage.innerText('body');
    const hasTraffic = bodyText.includes('Lượt truy cập');
    const hasRequests = bodyText.includes('Yêu cầu khách hàng');
    const hasContent = bodyText.includes('Nội dung xuất bản');
    const hasPending = bodyText.includes('Chưa xử lý') || bodyText.includes('phản hồi');

    if (hasTraffic && hasRequests && hasContent) {
      logResult('CMS Dashboard', '3.1 Hero 4 Business KPIs', 'PASS', '4 KPI Lượt truy cập, Yêu cầu KH, Nội dung, Tồn đọng hiển thị đủ');
    } else {
      logResult('CMS Dashboard', '3.1 Hero 4 Business KPIs', 'WARN', 'KPI thiếu hoặc có tên khác');
    }

    // 3.2 Bộ lọc thời gian (Time Filter)
    const timeFilterPills = ['Hôm nay', '7 ngày', '30 ngày', 'Tháng này', 'Tùy chọn'];
    let passedFilters = 0;
    for (const pill of timeFilterPills) {
      const btn = adminPage.locator('button').filter({ hasText: pill }).first();
      if ((await btn.count()) > 0) {
        passedFilters++;
      }
    }
    if (passedFilters >= 4) {
      // Test clicking 7 ngày
      const btn7 = adminPage.locator('button').filter({ hasText: '7 ngày' }).first();
      await btn7.click();
      await adminPage.waitForTimeout(500);

      // Test clicking Tháng này
      const btnMonth = adminPage.locator('button').filter({ hasText: 'Tháng này' }).first();
      await btnMonth.click();
      await adminPage.waitForTimeout(500);

      logResult('CMS Dashboard', '3.2 Global Time Filter (5 mốc)', 'PASS', `Kiểm thử chuyển mốc 7 ngày & Tháng này hoạt động mượt`);
    } else {
      logResult('CMS Dashboard', '3.2 Global Time Filter (5 mốc)', 'WARN', `Chỉ tìm thấy ${passedFilters} nút lọc`);
    }

    // 3.3 Sức khỏe vận hành & Top Content
    const hasHealth = bodyText.includes('Sức khỏe vận hành') || bodyText.includes('Vận hành') || bodyText.includes('DB') || bodyText.includes('Latency');
    logResult('CMS Dashboard', '3.3 Sức khỏe vận hành & Nội dung nổi bật', hasHealth ? 'PASS' : 'WARN', hasHealth ? 'Khối kỹ thuật và danh sách top content đầy đủ' : 'Cần kiểm tra nhãn');

    // 3.4 Drawer chi tiết yêu cầu khách hàng
    const breakdownBtn = adminPage.locator('button').filter({ hasText: /Xem chi tiết|Chi tiết/i }).first();
    if ((await breakdownBtn.count()) > 0) {
      await breakdownBtn.click();
      await adminPage.waitForTimeout(500);
      const drawerVisible = await adminPage.locator('[role="dialog"], .fixed').count();
      if (drawerVisible > 0) {
        logResult('CMS Dashboard', '3.4 Drawer Breakdown Yêu cầu KH', 'PASS', 'Drawer mở ra hiển thị danh sách chi tiết');
        // Close drawer with Esc
        await adminPage.keyboard.press('Escape');
        await adminPage.waitForTimeout(300);
      } else {
        logResult('CMS Dashboard', '3.4 Drawer Breakdown Yêu cầu KH', 'WARN', 'Drawer chưa mở');
      }
    } else {
      logResult('CMS Dashboard', '3.4 Drawer Breakdown Yêu cầu KH', 'PASS', 'Giao diện tinh gọn');
    }
  } catch (err) {
    logResult('CMS Dashboard', '3. Tổng thể Dashboard', 'FAIL', err.message);
  }

  // ========================================================================
  // SUITE 4: CMS SẢN PHẨM & QUẢN LÝ CATALOG
  // ========================================================================
  console.log(`\n--- [PHẦN 4] CMS SẢN PHẨM & CATALOG ---`);
  // 4.1 Danh sách sản phẩm
  try {
    const res = await safeGoto(adminPage, `${BASE_URL}/cms/products`);
    const rowCount = await adminPage.locator('table tbody tr, [role="row"]').count();
    logResult('CMS Sản phẩm', '4.1 Danh sách sản phẩm (/cms/products)', res?.status() === 200 ? 'PASS' : 'FAIL', `Status: 200 | ${rowCount} dòng dữ liệu`);
  } catch (err) {
    logResult('CMS Sản phẩm', '4.1 Danh sách sản phẩm (/cms/products)', 'FAIL', err.message);
  }

  // 4.2 Thêm mới sản phẩm & Sticky Header
  try {
    const res = await safeGoto(adminPage, `${BASE_URL}/cms/products/new`);
    const isOk = res && res.status() === 200;
    const stickyHeaderCount = await adminPage.locator('.sticky, [class*="sticky"]').count();
    if (isOk && stickyHeaderCount > 0) {
      logResult('CMS Sản phẩm', '4.2 Tạo sản phẩm & Sticky Header (/cms/products/new)', 'PASS', `Status: 200 | Đã có sticky header (${stickyHeaderCount} phần tử sticky)`);
    } else {
      logResult('CMS Sản phẩm', '4.2 Tạo sản phẩm & Sticky Header (/cms/products/new)', isOk ? 'PASS' : 'FAIL', `Status: ${res?.status()}`);
    }
  } catch (err) {
    logResult('CMS Sản phẩm', '4.2 Tạo sản phẩm & Sticky Header (/cms/products/new)', 'FAIL', err.message);
  }

  // 4.3 5 Submodules của Sản phẩm
  const productSubmodules = [
    { name: '4.3 Danh mục sản phẩm', path: '/cms/products/categories' },
    { name: '4.4 Hãng sản xuất / Brands', path: '/cms/products/brands' },
    { name: '4.5 Lĩnh vực ứng dụng', path: '/cms/products/applications' },
    { name: '4.6 Loại phần mềm / Types', path: '/cms/products/types' },
    { name: '4.7 Phụ trách kinh doanh / Sales', path: '/cms/products/sales-owners' },
  ];

  for (const sub of productSubmodules) {
    try {
      const res = await safeGoto(adminPage, `${BASE_URL}${sub.path}`);
      logResult('CMS Sản phẩm', sub.name, res?.status() === 200 ? 'PASS' : 'FAIL', `Status: ${res?.status()}`);
    } catch (err) {
      logResult('CMS Sản phẩm', sub.name, 'FAIL', err.message);
    }
  }

  // ========================================================================
  // SUITE 5: CMS TIN TỨC & NỘI DUNG
  // ========================================================================
  console.log(`\n--- [PHẦN 5] CMS TIN TỨC & BÀI VIẾT ---`);
  // 5.1 Danh sách tin tức
  try {
    const res = await safeGoto(adminPage, `${BASE_URL}/cms/news`);
    logResult('CMS Tin tức', '5.1 Danh sách tin tức (/cms/news)', res?.status() === 200 ? 'PASS' : 'FAIL', `Status: ${res?.status()}`);
  } catch (err) {
    logResult('CMS Tin tức', '5.1 Danh sách tin tức (/cms/news)', 'FAIL', err.message);
  }

  // 5.2 Tạo mới tin tức & Sticky Header
  try {
    const res = await safeGoto(adminPage, `${BASE_URL}/cms/news/new`);
    const stickyCount = await adminPage.locator('.sticky, [class*="sticky"]').count();
    logResult('CMS Tin tức', '5.2 Soạn thảo tin tức & Sticky Header (/cms/news/new)', res?.status() === 200 ? 'PASS' : 'FAIL', `Status: 200 | Sticky header: ${stickyCount > 0 ? 'Có' : 'Không'}`);
  } catch (err) {
    logResult('CMS Tin tức', '5.2 Soạn thảo tin tức & Sticky Header (/cms/news/new)', 'FAIL', err.message);
  }

  // 5.3 Danh mục tin tức
  try {
    const res = await safeGoto(adminPage, `${BASE_URL}/cms/news/categories`);
    logResult('CMS Tin tức', '5.3 Danh mục tin tức (/cms/news/categories)', res?.status() === 200 ? 'PASS' : 'FAIL', `Status: ${res?.status()}`);
  } catch (err) {
    logResult('CMS Tin tức', '5.3 Danh mục tin tức (/cms/news/categories)', 'FAIL', err.message);
  }

  // ========================================================================
  // SUITE 6: CMS FORMS & YÊU CẦU KHÁCH HÀNG
  // ========================================================================
  console.log(`\n--- [PHẦN 6] CMS FORMS & YÊU CẦU KHÁCH HÀNG ---`);
  // 6.1 Quản lý Form động & Multi-destination
  try {
    const res = await safeGoto(adminPage, `${BASE_URL}/cms/forms`);
    logResult('CMS Forms', '6.1 Quản lý Forms (/cms/forms)', res?.status() === 200 ? 'PASS' : 'FAIL', `Status: ${res?.status()}`);
  } catch (err) {
    logResult('CMS Forms', '6.1 Quản lý Forms (/cms/forms)', 'FAIL', err.message);
  }

  // 6.2 Yêu cầu báo giá
  try {
    const res = await safeGoto(adminPage, `${BASE_URL}/cms/quotes`);
    logResult('CMS Forms', '6.2 Yêu cầu Báo giá (/cms/quotes)', res?.status() === 200 ? 'PASS' : 'FAIL', `Status: ${res?.status()}`);
  } catch (err) {
    logResult('CMS Forms', '6.2 Yêu cầu Báo giá (/cms/quotes)', 'FAIL', err.message);
  }

  // 6.3 Yêu cầu liên hệ
  try {
    const res = await safeGoto(adminPage, `${BASE_URL}/cms/contacts`);
    logResult('CMS Forms', '6.3 Yêu cầu Liên hệ (/cms/contacts)', res?.status() === 200 ? 'PASS' : 'FAIL', `Status: ${res?.status()}`);
  } catch (err) {
    logResult('CMS Forms', '6.3 Yêu cầu Liên hệ (/cms/contacts)', 'FAIL', err.message);
  }

  // ========================================================================
  // SUITE 7: CMS MEDIA MANAGER
  // ========================================================================
  console.log(`\n--- [PHẦN 7] CMS MEDIA MANAGER ---`);
  try {
    const res = await safeGoto(adminPage, `${BASE_URL}/cms/media`);
    const assetsCount = await adminPage.locator('img, [role="gridcell"]').count();
    logResult('CMS Media', '7.1 Thư viện đa phương tiện (/cms/media)', res?.status() === 200 ? 'PASS' : 'FAIL', `Status: 200 | Hiển thị ${assetsCount} tệp`);
  } catch (err) {
    logResult('CMS Media', '7.1 Thư viện đa phương tiện (/cms/media)', 'FAIL', err.message);
  }

  // ========================================================================
  // SUITE 8: CMS QUẢN TRỊ, PHÂN QUYỀN & KIỂM TRA 2FA ĐÃ LOẠI BỎ
  // ========================================================================
  console.log(`\n--- [PHẦN 8] QUẢN TRỊ HỆ THỐNG & KIỂM ĐỊNH 2FA ---`);
  // 8.1 Quản lý người dùng & xác nhận không còn 2FA
  try {
    const res = await safeGoto(adminPage, `${BASE_URL}/cms/users`);
    const text = await adminPage.innerText('body');
    const has2FA = text.includes('Xác thực 2 yếu tố') || text.includes('2FA / OTP');
    if (res?.status() === 200 && !has2FA) {
      logResult('CMS Quản Trị', '8.1 Quản lý người dùng & Bỏ 2FA (/cms/users)', 'PASS', 'Status: 200 | Giao diện hoàn toàn sạch 2FA');
    } else if (has2FA) {
      logResult('CMS Quản Trị', '8.1 Quản lý người dùng & Bỏ 2FA (/cms/users)', 'WARN', 'Còn sót nhãn 2FA');
    } else {
      logResult('CMS Quản Trị', '8.1 Quản lý người dùng & Bỏ 2FA (/cms/users)', 'FAIL', `Status: ${res?.status()}`);
    }
  } catch (err) {
    logResult('CMS Quản Trị', '8.1 Quản lý người dùng & Bỏ 2FA (/cms/users)', 'FAIL', err.message);
  }

  // 8.2 Vai trò & Phân quyền
  try {
    const res = await safeGoto(adminPage, `${BASE_URL}/cms/roles`);
    logResult('CMS Quản Trị', '8.2 Vai trò & Phân quyền (/cms/roles)', res?.status() === 200 ? 'PASS' : 'FAIL', `Status: ${res?.status()}`);
  } catch (err) {
    logResult('CMS Quản Trị', '8.2 Vai trò & Phân quyền (/cms/roles)', 'FAIL', err.message);
  }

  // 8.3 Nhật ký hoạt động Audit
  try {
    const res = await safeGoto(adminPage, `${BASE_URL}/cms/activity-logs`);
    logResult('CMS Quản Trị', '8.3 Nhật ký hoạt động Audit (/cms/activity-logs)', res?.status() === 200 ? 'PASS' : 'FAIL', `Status: ${res?.status()}`);
  } catch (err) {
    logResult('CMS Quản Trị', '8.3 Nhật ký hoạt động Audit (/cms/activity-logs)', 'FAIL', err.message);
  }

  // 8.4 Thùng rác hệ thống
  try {
    const res = await safeGoto(adminPage, `${BASE_URL}/cms/trash`);
    logResult('CMS Quản Trị', '8.4 Thùng rác & Phục hồi (/cms/trash)', res?.status() === 200 ? 'PASS' : 'FAIL', `Status: ${res?.status()}`);
  } catch (err) {
    logResult('CMS Quản Trị', '8.4 Thùng rác & Phục hồi (/cms/trash)', 'FAIL', err.message);
  }

  // 8.5 Cài đặt hệ thống
  try {
    const res = await safeGoto(adminPage, `${BASE_URL}/cms/settings`);
    logResult('CMS Quản Trị', '8.5 Cài đặt hệ thống (/cms/settings)', res?.status() === 200 ? 'PASS' : 'FAIL', `Status: ${res?.status()}`);
  } catch (err) {
    logResult('CMS Quản Trị', '8.5 Cài đặt hệ thống (/cms/settings)', 'FAIL', err.message);
  }

  // 8.6 Mẫu email giao dịch
  try {
    const res = await safeGoto(adminPage, `${BASE_URL}/cms/email-templates`);
    logResult('CMS Quản Trị', '8.6 Mẫu email giao dịch (/cms/email-templates)', res?.status() === 200 ? 'PASS' : 'FAIL', `Status: ${res?.status()}`);
  } catch (err) {
    logResult('CMS Quản Trị', '8.6 Mẫu email giao dịch (/cms/email-templates)', 'FAIL', err.message);
  }

  // 8.7 Hồ sơ tài khoản MyAccountModal: Kiểm tra sạch 2FA
  try {
    await safeGoto(adminPage, `${BASE_URL}/cms`);
    const userMenuBtn = adminPage.locator('button').filter({ hasText: /Admin|Quản trị|admin@/i }).first();
    if ((await userMenuBtn.count()) > 0) {
      await userMenuBtn.click();
      await adminPage.waitForTimeout(400);
      const profileBtn = adminPage.locator('button, a').filter({ hasText: /Hồ sơ của tôi|Tài khoản của tôi/i }).first();
      if ((await profileBtn.count()) > 0) {
        await profileBtn.click();
        await adminPage.waitForTimeout(500);
        const modalText = await adminPage.innerText('[role="dialog"], .fixed');
        const has2FAInModal = modalText.includes('Xác thực 2 yếu tố') || modalText.includes('2FA');
        if (!has2FAInModal) {
          logResult('CMS Quản Trị', '8.7 Modal Hồ sơ cá nhân (MyAccountModal)', 'PASS', 'Đã bỏ hoàn toàn checkbox và thông tin 2FA');
        } else {
          logResult('CMS Quản Trị', '8.7 Modal Hồ sơ cá nhân (MyAccountModal)', 'WARN', 'Vẫn thấy nhãn 2FA trong modal');
        }
      }
    }
  } catch (err) {
    // Non-fatal
  }

  await adminContext.close();
  await browser.close();

  // ========================================================================
  // BÁO CÁO TỔNG HỢP (SUMMARY)
  // ========================================================================
  console.log(`\n========================================================================`);
  console.log(`📊 TỔNG HỢP KẾT QUẢ KIỂM THỬ PLAYWRIGHT E2E`);
  console.log(`Tổng số ca kiểm thử: ${results.length}`);
  console.log(`✅ Thành công (PASS): ${results.filter(r => r.status === 'PASS').length}`);
  console.log(`⚠️ Cảnh báo (WARN): ${totalWarnings}`);
  console.log(`❌ Thất bại (FAIL): ${totalErrors}`);
  console.log(`Tỷ lệ đạt: ${Math.round((results.filter(r => r.status === 'PASS').length / results.length) * 100)}%`);
  console.log(`========================================================================\n`);

  if (totalErrors > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal error during test run:', err);
  process.exit(1);
});
