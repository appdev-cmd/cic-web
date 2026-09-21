# BÁO CÁO TOÀN DIỆN AUDIT SEO & CHẤT LƯỢNG WEB (COMPREHENSIVE SEO & WEB QUALITY AUDIT)

> **Dự án**: CIC Technology Web Portal  
> **Khách hàng**: Công ty Cổ phần Công nghệ và Tư vấn CIC (CIC Technology)  
> **Thời điểm Audit**: 21/09/2026  
> **Tiêu chuẩn kiểm thử**: Bộ nguyên tắc chất lượng web `addyosmani/web-quality-skills`  
> **Phạm vi kiểm thử**: Mã nguồn (Next.js 16.3.3 Turbopack, React 19) ➔ Runtime SSR (http://localhost:3000) ➔ Hệ thống Production (https://www.cic.com.vn)  
> **Nguyên tắc thực thi**: **AUDIT ONLY** (Không can thiệp source code, không tự ý sửa đổi DB hay cấu hình).

---

## 1. TỔNG QUAN ĐIỀU HÀNH (EXECUTIVE SUMMARY)

Đợt audit toàn diện này được thực hiện nhằm đánh giá mức độ sẵn sàng về mặt SEO kỹ thuật (Technical SEO), trải nghiệm người dùng (UX/Core Web Vitals), khả năng tiếp cận (Accessibility), và chiến lược chuyển đổi hệ thống (SEO Migration) của cổng thông tin CIC Technology phiên bản mới xây dựng trên nền tảng Next.js App Router.

### Các kết quả nổi bật nhất:
1. **Kiến trúc Server-Side Rendering (SSR) & Thời gian phản hồi (TTFB) xuất sắc**: Next.js 16 kết hợp PostgreSQL cho thời gian phản hồi server TTFB trung bình từ **130ms đến 280ms**, cấu trúc HTML tĩnh đầy đủ giúp bot thu thập dữ liệu nhanh chóng.
2. **Độ ổn định bố cục (CLS) đạt chuẩn Google Core Web Vitals**: Chỉ số Cumulative Layout Shift trên toàn bộ các trang đạt mức cực tốt (**CLS < 0.025**, so với ngưỡng khắt khe 0.1 của Google).
3. **CẢNH BÁO RỦI RO CHUYỂN ĐỔI HỆ THỐNG CẤP ĐỘ CAO (P0)**:
   - **Xung đột Host Canonical**: Server Production chuyển hướng toàn bộ về `https://www.cic.com.vn`, trong khi mã nguồn và Sitemap mặc định lại trỏ về `https://cic.com.vn`.
   - **Đứt gãy URL Sản phẩm Cũ**: Hơn 276 URL sản phẩm cũ dạng `/san-pham/*-p*.html` đang trả về mã **404 Not Found** trên hệ thống mới do thiếu cơ chế chuyển tiếp 301.
4. **THIẾU HOÀN TOÀN DỮ LIỆU CẤU TRÚC (STRUCTURED DATA - P1)**: Toàn bộ 100% các trang chưa có bất kỳ mã JSON-LD Schema nào (`Organization`, `WebSite`, `BreadcrumbList`, `Product`, `Article`).
5. **ĐỘ TRỄ LCP TRÊN DI ĐỘNG DO HÌNH ẢNH NẶNG (P1)**: Trang Giới thiệu tải tới **26.7 MB** (trong đó **14 MB hình ảnh** gốc không nén), khiến LCP vượt quá 10 giây trên thiết bị di động.

---

## 2. PHƯƠNG PHÁP LUẬN & PHÂN LOẠI BẰNG CHỨNG (METHODOLOGY & EVIDENCE)

Quá trình audit tuân thủ nghiêm ngặt nguyên tắc đối chiếu chéo đa nguồn:
- **`SOURCE VERIFIED`**: Xác minh trực tiếp qua việc phân tích mã nguồn TypeScript/TSX, queries SQL, routes Next.js.
- **`RUNTIME VERIFIED`**: Xác minh qua việc chạy crawler tự động và Playwright trên máy chủ phát triển cục bộ (`http://localhost:3000`).
- **`PRODUCTION VERIFIED`**: Xác minh qua các truy vấn HTTP HEAD/GET thực tế tới tên miền production (`https://www.cic.com.vn` và `https://cic.com.vn`).
- **`NOT VERIFIED`**: Các dữ liệu chưa thể tiếp cận (Field Data người dùng thực từ Google Search Console / CrUX).
- **`NOT APPLICABLE`**: Các tính năng không thuộc phạm vi hệ thống.

---

## 3. PHẠM VI AUDIT & DANH MỤC PUBLIC ROUTES (SCOPE & ROUTES INVENTORY)

Hệ thống có tổng cộng **1,349 URLs** công khai trong Sitemap. Quá trình kiểm tra tập trung vào 8 nhóm route cốt lõi:
1. **Trang chủ**: `/` (VI) và `/en` (EN).
2. **Giới thiệu**: `/gioi-thieu`, `/gioi-thieu/co-cau-to-chuc`, `/gioi-thieu/nang-luc-kinh-nghiem`, `/about`, `/en/about`.
3. **Sản phẩm**: `/products`, `/products/categories`, `/products/[slug]`, `/en/products`, `/en/products/[slug]`.
4. **Tin tức**: `/news`, `/news/categories`, `/news/[slug]`, `/en/news`, `/en/news/[slug]`.
5. **Dịch vụ**: `/services`, `/services/[slug]`, `/en/services`, `/en/services/[slug]`.
6. **Dự án**: `/projects`, `/projects/[slug]`, `/en/projects`, `/en/projects/[slug]`.
7. **Sự kiện**: `/events`, `/events/[slug]`.
8. **Trang tĩnh & Tiện ích**: `/contact`, `/lien-he`, `/search`, `/chinh-sach-bao-mat`, `/dieu-khoan-su-dung`.

---

## 4. CHUẨN HÓA TÊN MIỀN & CHIẾN LƯỢC CANONICAL HOST (HOST NORMALIZATION)

### 4.1 Thực trạng 4 biến thể URL trên Production:
- `http://cic.com.vn` ➔ **HTTP 301** ➔ `https://www.cic.com.vn/`
- `http://www.cic.com.vn` ➔ **HTTP 301** ➔ `https://www.cic.com.vn/`
- `https://cic.com.vn` ➔ **HTTP 301** ➔ `https://www.cic.com.vn/`
- `https://www.cic.com.vn` ➔ **HTTP 200 OK** (LiteSpeed Web Server).

### 4.2 Xung đột trong Source Code (Lỗi SEO-001 - P0):
- Trong `src/app/layout.tsx`: `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://cic.com.vn')`.
- Fallback mặc định thiếu tiền tố `www.`.
- **Hậu quả**: Thẻ `<link rel="canonical">` trên toàn trang render ra `https://cic.com.vn`, tạo ra một vòng lặp chuyển hướng và mâu thuẫn chỉ mục với Googlebot.

---

## 5. ĐÁNH GIÁ TỆP ROBOTS.TXT

- **Vị trí tệp**: `src/app/robots.txt/route.ts` (Dynamic Route Handler).
- **Trạng thái HTTP**: 200 OK.
- **Nội dung trả về**:
  ```text
  User-agent: *
  Allow: /

  Sitemap: https://www.cic.com.vn/sitemap.xml
  ```
- **Đánh giá**:
  - Tệp cho phép tất cả bot thu thập dữ liệu hợp lệ.
  - **Điểm cần lưu ý**: Khai báo Sitemap trỏ về `www.cic.com.vn`, trong khi chính sitemap lại chứa toàn bộ URL không có `www.`.
  - Chưa chặn các đường dẫn quản trị nhạy cảm như `/cms/`, `/api/`.

---

## 6. ĐÁNH GIÁ SITEMAP XML & CẤU TRÚC PHÂN TÁCH

- **Đường dẫn**: `/sitemap.xml` (được sinh tự động qua `src/app/sitemap.ts`).
- **Quy mô**: 1,349 URLs.
- **Vấn đề phát hiện**:
  1. **Lọt trang rác**: URL `/test` và `/search` bị đưa vào sitemap (Lỗi SEO-009).
  2. **Cắt cụt dữ liệu**: Truy vấn DB đặt `LIMIT 1000` cho bài viết và sản phẩm, dẫn đến nguy cơ bỏ sót nội dung lớn khi dữ liệu tăng trưởng.
  3. **Thiếu phiên bản quốc tế**: 100% các trang tiếng Anh (`/en/...`) không có mặt trong Sitemap.
  4. **Ký tự đặc biệt**: Một số slug sự kiện chứa ký tự hai chấm `:` chưa được url-encode an toàn.

---

## 7. KHẢ NĂNG THU THẬP & PHÂN TÍCH MÃ TRẠNG THÁI HTTP (CRAWLABILITY)

- **Tỷ lệ phản hồi HTTP 200**: Đạt **94.1%** trên mẫu kiểm tra.
- **Lỗi 500 Unhandled Exception (SEO-003 - P1)**:
  - Khi truy cập `/news/to-trinh-muc-co-tuc-trich-lap-cac-quy-va-muc-thu-lao-hdqt-bks-2015`, hệ thống ném ngoại lệ `News alias invariant violated` do cơ sở dữ liệu có 2 bài viết cùng alias.
- **Lỗi 404 Legacy URLs (SEO-002 - P0)**:
  - Các trang sản phẩm cũ không được chuyển tiếp, trả về mã 404 trực tiếp.

---

## 8. TRIỂN KHAI THẺ CANONICAL & LIÊN KẾT THAY THẾ (ALTERNATES)

- Root Layout triển khai `alternates: { canonical: './' }`.
- **Hạn chế**: Khi kết hợp với `metadataBase`, tất cả URL con kế thừa canonical tương đối. Tuy nhiên, do `metadataBase` mặc định sai tên miền (thiếu `www.`), toàn bộ canonical tags trên website đều bị sai lệch so với tên miền đích chính thức của máy chủ.

---

## 9. ĐA NGÔN NGỮ & QUỐC TẾ HÓA (INTERNATIONALIZATION - VI/EN)

- **Thẻ ngôn ngữ HTML**:
  - `src/app/layout.tsx` đặt cứng `<html lang="vi">`.
  - Khi người dùng hoặc Googlebot truy cập `/en`, `/en/products`, `/en/news`, mã HTML vẫn là `lang="vi"`.
- **Thiếu thẻ hreflang**:
  - Không có bất kỳ thẻ `<link rel="alternate" hreflang="vi" href="...">` hay `hreflang="en"` nào được tạo ra.
  - Googlebot không thể liên kết bài viết tương đương giữa tiếng Việt và tiếng Anh.

---

## 10. KIẾN TRÚC METADATA & TITLE/DESCRIPTION TEMPLATES

- **Title Template**:
  - Cấu hình tại Root Layout: `template: '%s | CIC Technology'`.
  - Một số trang con (như sản phẩm) lại trả về `product.name | CIC`, dẫn đến tiêu đề hiển thị bị lặp: `ETABS 2026 | CIC | CIC Technology`.
- **Độ dài Title & Meta Description**:
  - Title trung bình: 42 - 58 ký tự (Đạt chuẩn hiển thị SERP 50-60 ký tự).
  - Meta Description trung bình: 80 - 150 ký tự (Đạt chuẩn SERP 120-160 ký tự).
  - Một số dịch vụ thiếu hoàn toàn Meta Description (`tu-van-lap-don-gia-chi-so-gia`).

---

## 11. ON-PAGE SEO & PHÂN CẤP TIÊU ĐỀ (HEADING HIERARCHY H1-H6)

- **Thẻ H1**:
  - Đa số các trang nội dung chi tiết (Sản phẩm, Tin tức) có 1 thẻ H1 chuẩn xác.
  - **Lỗi nghiêm trọng (SEO-007 - P1)**: 5 trang quan trọng gồm `/about`, `/products/categories`, `/news/categories`, và một số sự kiện **hoàn toàn không có thẻ H1 nào**.
- **Thứ bậc H2/H3**: Được cấu trúc tốt bằng Tailwind CSS trên các view hiển thị.

---

## 12. DỮ LIỆU CẤU TRÚC SCHEMA.ORG (STRUCTURED DATA)

- **Hiện trạng**: **0%** (Hoàn toàn chưa triển khai).
- **Đánh giá rủi ro**: CIC là đơn vị công nghệ B2B hàng đầu, việc thiếu Schema khiến website mất đi cơ hội hiển thị:
  - Knowledge Graph Doanh nghiệp (`Organization`).
  - Đánh giá sản phẩm phần mềm (`SoftwareApplication` / `Product`).
  - Tác giả & Ngày xuất bản tin bài (`NewsArticle`).
  - Lộ trình sự kiện webinar (`Event`).
  - Hộp tìm kiếm mở rộng trên Google (`WebSite` với `SearchAction`).

---

## 13. THIẾT KẾ ĐƯỜNG DẪN (URL DESIGN & SLUGS)

- Cấu trúc URL mới hiện đại, ngắn gọn, thân thiện người dùng:
  - `/products/[slug]`
  - `/news/[slug]`
  - `/services/[slug]`
  - `/projects/[slug]`
- Điểm cần khắc phục: Loại bỏ dấu hai chấm `:` trong slug sự kiện và ký tự đặc biệt tiếng Việt chưa lọc sạch trong một số bài viết lịch sử.

---

## 14. QUẢN TRỊ CHUYỂN HƯỚNG & DI CHUYỂN DỮ LIỆU (SEO MIGRATION & 301)

- Đã có bảng `cic_redirects` và hàm `resolveRedirect`.
- **Tuy nhiên**:
  1. Chỉ được gọi trong `[slug]/page.tsx` (chỉ bắt 1 segment đường dẫn).
  2. Bỏ sót toàn bộ các đường dẫn có 2 segment của hệ thống cũ như `/san-pham/[slug-san-pham]-p[id].html`.
  3. Lệnh chuyển hướng của Next.js Server Component `redirect()` mặc định trả về mã HTTP 307/308 thay vì HTTP 301 Permanent Redirect chuẩn SEO.

---

## 15. LIÊN KẾT NỘI BỘ & ĐỘ SÂU CRAWL (INTERNAL LINKING)

- Hệ thống Header & Mega Menu cung cấp liên kết xuyên suốt đến các danh mục cấp 1 và cấp 2.
- Breadcrumbs trực quan đã có trên giao diện người dùng nhưng cần bổ sung Schema JSON-LD tương ứng.
- Độ sâu crawl tối đa không vượt quá 3 clicks từ trang chủ.

---

## 16. TỐI ƯU HÓA HÌNH ẢNH & TRUYỀN TẢI MEDIA (IMAGE DELIVERY)

- **Vấn đề lớn nhất của website hiện tại**:
  - Gần như 100% hình ảnh dùng thẻ `<img>` thường, không tận dụng bộ tối ưu của Next.js.
  - Hình ảnh không được chuyển đổi sang định dạng nén thế hệ mới (AVIF/WebP).
  - Trang `/gioi-thieu` tải tới 14 MB hình ảnh dung lượng gốc, gây nghẽn đường truyền trên thiết bị di động.
  - 83 ảnh bị rỗng thẻ `alt=""`.

---

## 17. HIỆU NĂNG & CORE WEB VITALS (PHÒNG THÍ NGHIỆM - LAB DATA)

Dữ liệu đo đạc thực tế qua Playwright Chromium:
- **CLS**: Rất tốt (0.0000 - 0.0241).
- **TTFB**: Rất tốt (130ms - 280ms).
- **FCP**: Khá (1.0s - 2.1s).
- **LCP**: Kém (vượt 2.5s trên hầu hết các trang và đạt đỉnh > 10s trên di động ở trang Giới thiệu).

---

## 18. CHỈ SỐ CORE WEB VITALS THỰC TẾ (FIELD DATA / CRUX)

- **Trạng thái**: `NOT VERIFIED`.
- Do chưa kết nối dữ liệu Google Search Console và CrUX từ người dùng thực, nhóm kiểm thử khuyến nghị thiết lập đo đạc `next/vitals` gửi về Google Analytics 4 ngay khi deploy.

---

## 19. TRẢI NGHIỆM TRÊN THIẾT BỊ DI ĐỘNG (MOBILE FRIENDLINESS)

- Giao diện đáp ứng (responsive) linh hoạt từ 375px đến 1920px.
- Navigation Drawer và Mobile Menu hoạt động mượt mà.
- Điểm yếu duy nhất là trọng lượng ảnh quá nặng làm chậm thời gian tải trên mạng di động 3G/4G.

---

## 20. KHẢ NĂNG TIẾP CẬN (ACCESSIBILITY - A11Y)

- Cấu trúc màu sắc có độ tương phản cao, phông chữ dễ đọc.
- Cần bổ sung thuộc tính `aria-label` cho các nút icon không có nhãn text (nút đóng modal, nút tìm kiếm kính lúp).
- Bổ sung văn bản mô tả cho 83 hình ảnh còn để trống thuộc tính alt.

---

## 21. BẢO MẬT & THỰC THI CHUẨN MỰC WEB (SECURITY & BEST PRACTICES)

- Tên miền đã có chứng chỉ bảo mật HTTPS hợp lệ.
- **Hạn chế**:
  - Thiếu toàn bộ các HTTP Security Headers (`Strict-Transport-Security`, `X-Frame-Options`, `X-Content-Type-Options`, `Content-Security-Policy`).
  - Header của server cũ làm lộ thông tin hệ điều hành và phiên bản phần mềm (`PHP/8.2.33, PleskLin, LiteSpeed`).

---

## 22. QUẢN TRỊ KỸ THUẬT SEO TRÊN CMS (CMS GOVERNANCE)

- Module `function-seo` và bảng `cic_config_modules` đã hỗ trợ quản trị Tiêu đề, Từ khóa, Mô tả và trạng thái Index/Noindex cho từng trang chức năng.
- Cần bổ sung giao diện quản lý chuyển hướng 301 nâng cao hỗ trợ quy tắc biểu thức chính quy (Regex Pattern Matching).

---

## 23. LỘ TRÌNH KHẮC PHỤC THEO THỨ TỰ ƯU TIÊN (REMEDIATION ROADMAP)

### Giai đoạn 1: Khắc phục sự cố khẩn cấp trước khi Go-Live (Khung thời gian: 1 - 2 ngày)
1. **[P0] Đồng bộ Canonical Host**: Đổi fallback `metadataBase` thành `https://www.cic.com.vn` và cấu hình biến môi trường production.
2. **[P0] Chuyển tiếp 301 URL sản phẩm cũ**: Viết regex redirect cho mẫu `/san-pham/*-p*.html` sang `/products/*`.
3. **[P1] Vá lỗi sập 500 do trùng alias**: Xử lý an toàn khi truy vấn tin tức trả về nhiều hơn 1 bản ghi trong DB.

### Giai đoạn 2: Tối ưu hóa chỉ mục & Tải trang (Khung thời gian: 3 - 5 ngày)
4. **[P1] Triển khai Schema.org JSON-LD**: Tích hợp `Organization`, `WebSite`, `BreadcrumbList`, `Product`, `Article`.
5. **[P1] Chuyển đổi sang Next/Image**: Tối ưu hóa tự động WebP/AVIF và nén ảnh trang Giới thiệu.
6. **[P1] Hoàn thiện Đa ngôn ngữ**: Bổ sung `html lang` động, thẻ `hreflang`, và đưa URL tiếng Anh vào Sitemap.
7. **[P1] Bổ sung thẻ H1**: Bổ sung thẻ H1 chuẩn xác cho các trang danh mục.

### Giai đoạn 3: Hoàn thiện nâng cao & Tiêu chuẩn Web (Khung thời gian: 1 tuần)
8. **[P2] Bổ sung HTTP Security Headers**: Cấu hình HSTS, CSP, X-Frame-Options trong `next.config.ts`.
9. **[P2] Làm sạch Sitemap**: Loại bỏ `/test`, `/search` và nâng cấp phân trang sitemap.
10. **[P2] Bổ sung OpenGraph Image & Twitter Cards**.
11. **[P2] Cập nhật Alt Text cho 83 hình ảnh**.

---

## 24. ĐÁNH GIÁ CUỐI CÙNG & KẾT LUẬN MỨC ĐỘ SẴN SÀNG (FINAL VERDICT)

### **FINAL VERDICT: `NEEDS_FIX` (CẦN KHẮC PHỤC TRƯỚC KHI TRIỂN KHAI CHÍNH THỨC)**

> **Lý do đánh giá**:
> Mặc dù nền tảng Next.js App Router mới có kiến trúc SSR hiện đại, tốc độ phản hồi server cực nhanh (TTFB < 300ms) và bố cục giao diện vô cùng vững chắc (CLS < 0.025), nhưng dự án hiện đang tồn tại **2 lỗi P0 nghiêm trọng** (Xung đột host canonical và mất liên kết 404 của 276+ sản phẩm cũ) cùng **5 lỗi P1** (Sập trang 500 do duplicate slug, thiếu 100% structured data, thiếu đa ngôn ngữ hreflang, thiếu thẻ H1 và hình ảnh chưa tối ưu gây nghẽn LCP).
>
> Nếu triển khai phiên bản này lên production thay thế hệ thống cũ mà chưa khắc phục các lỗi P0 và P1, website sẽ bị sụt giảm thứ hạng tìm kiếm và mất lượng lớn lưu lượng truy cập lịch sử. Dự án cần thực hiện Giai đoạn 1 và 2 của Lộ trình khắc phục để đạt trạng thái **`READY`**.
