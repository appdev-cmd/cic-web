# BẢNG TỔNG HỢP CÁC LỖI & PHÁT HIỆN SEO (SEO FINDINGS REGISTER)

> **Dự án**: CIC Technology Web Portal  
> **Thời gian cập nhật**: 21/09/2026  
> **Quy ước mã lỗi**: `SEO-001`, `SEO-002`, v.v.  
> **Phân cấp nghiêm trọng**:
> - **P0 (Critical)**: Chặn lập chỉ mục, đứt gãy lượng lớn backlink, xung đột tên miền chính thức.
> - **P1 (High)**: Sập runtime 500, thiếu toàn bộ Schema, phá vỡ LCP, sai lệch đa ngôn ngữ.
> - **P2 (Medium)**: Thiếu Heading H1, lọt trang test vào sitemap, thiếu meta description, thiếu security headers.
> - **P3 (Low)**: Ký tự slug chưa chuẩn hóa, thiếu alt một số hình ảnh phụ.

---

## BẢNG DANH MỤC LỖI TỔNG QUAN

| Mã lỗi | Mức độ | Nhóm chuyên môn | Tiêu đề lỗi | Trạng thái xác minh |
| :---: | :---: | :--- | :--- | :---: |
| **SEO-001** | **P0** | Technical SEO / Host | Xung đột Host và Canonical giữa www.cic.com.vn và cic.com.vn | `RUNTIME & PRODUCTION VERIFIED` |
| **SEO-002** | **P0** | Migration / Redirects | 276+ URL sản phẩm cũ dạng /san-pham/*-p*.html trả về mã 404 | `RUNTIME & PRODUCTION VERIFIED` |
| **SEO-003** | **P1** | Runtime / Routing | Lỗi 500 sập trang khi alias tin tức bị trùng lặp trong cơ sở dữ liệu | `SOURCE & RUNTIME VERIFIED` |
| **SEO-004** | **P1** | Structured Data | Thiếu hoàn toàn Schema.org JSON-LD trên 100% các trang | `SOURCE & RUNTIME VERIFIED` |
| **SEO-005** | **P1** | Performance / CWV | Hình ảnh nguyên bản không nén phá vỡ chỉ số LCP (> 6s - 10s) | `RUNTIME VERIFIED` |
| **SEO-006** | **P1** | Multi-language SEO | Thiếu hreflang, sitemap thiếu bản /en, thẻ html lang="vi" cố định | `SOURCE & RUNTIME VERIFIED` |
| **SEO-007** | **P1** | On-page SEO | Thiếu thẻ Heading H1 trên hàng loạt trang danh mục và trang tĩnh | `RUNTIME VERIFIED` |
| **SEO-008** | **P2** | Security & Headers | Thiếu các HTTP Security Headers thiết yếu và lộ thông tin máy chủ | `PRODUCTION VERIFIED` |
| **SEO-009** | **P2** | Crawlability / Sitemap | Sitemap XML chứa URL thử nghiệm /test, /search và bị giới hạn 1000 | `SOURCE & RUNTIME VERIFIED` |
| **SEO-010** | **P2** | On-page SEO | Thiếu Meta Description dịch vụ và lặp thương hiệu trong Title | `SOURCE & RUNTIME VERIFIED` |
| **SEO-011** | **P2** | Social SEO | Thiếu OpenGraph Image và Twitter Card mặc định | `SOURCE & RUNTIME VERIFIED` |
| **SEO-012** | **P2** | Accessibility | 16.3% hình ảnh trên hệ thống có thuộc tính alt="" rỗng | `RUNTIME VERIFIED` |
| **SEO-013** | **P3** | Technical SEO | URL Slug sự kiện chứa ký tự hai chấm `:` không chuẩn hóa RFC 3986 | `SOURCE & RUNTIME VERIFIED` |

---

## CHI TIẾT TỪNG LỖI KỸ THUẬT

### SEO-001: Xung đột Host và Canonical giữa www.cic.com.vn và cic.com.vn
- **Mức độ nghiêm trọng**: **P0 (Critical)**
- **Nhóm**: Technical SEO / Canonical Host Strategy
- **Trạng thái xác minh**: `RUNTIME & PRODUCTION VERIFIED`
- **Thành phần ảnh hưởng**: `src/app/layout.tsx` (metadataBase), `src/app/sitemap.ts`, `src/app/robots.txt/route.ts`.
- **Hiện trạng & Bằng chứng**:
  - Production server (LiteSpeed) định tuyến 301 toàn bộ HTTP và `https://cic.com.vn` về **`https://www.cic.com.vn/`**.
  - Tuy nhiên, trong `src/app/layout.tsx` fallback là `siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cic.com.vn'`.
  - Toàn bộ 1,349 URL trong `sitemap.xml` và thẻ `<link rel="canonical">` trên toàn bộ trang web đều có domain `https://cic.com.vn`.
  - Trong khi đó, file `src/app/robots.txt/route.ts` lại khai báo: `Sitemap: https://www.cic.com.vn/sitemap.xml`.
- **Tác động kỹ thuật**: Googlebot nhận tín hiệu mâu thuẫn giữa Robots.txt, Sitemap.xml, Canonical tag và HTTP 301 Response, dẫn đến lãng phí crawl budget và mất thứ hạng tìm kiếm.
- **Giải pháp đề xuất**:
  1. Đồng bộ giá trị mặc định trong toàn bộ source code thành `https://www.cic.com.vn` (chuẩn www).
  2. Cấu hình biến môi trường `NEXT_PUBLIC_SITE_URL=https://www.cic.com.vn` trên môi trường production.
  3. Đảm bảo toàn bộ URL trong Sitemap và thẻ Canonical đồng nhất 100% theo `https://www.cic.com.vn`.

---

### SEO-002: 276+ URL sản phẩm cũ dạng /san-pham/*-p*.html trả về mã 404
- **Mức độ nghiêm trọng**: **P0 (Critical)**
- **Nhóm**: SEO Migration / Redirects & Backlinks
- **Trạng thái xác minh**: `RUNTIME & PRODUCTION VERIFIED`
- **Thành phần ảnh hưởng**: Routing hệ thống Next.js, bảng `cic_redirects`.
- **Hiện trạng & Bằng chứng**:
  - Production sitemap cũ chứa 276 URL sản phẩm dạng: `/san-pham/[alias]-p[id].html` (ví dụ: `/san-pham/phan-mem-etabs-p1.html`).
  - Khi truy cập URL này trên Next.js mới: Hệ thống trả về mã **HTTP 404 Not Found**.
  - Route `[slug]` hiện tại chỉ bắt 1 segment, không bắt được prefix `/san-pham/...`.
- **Tác động kỹ thuật**: Toàn bộ backlink cũ từ các diễn đàn xây dựng, báo chí, đối tác quốc tế và thứ hạng từ khóa Google của 276 sản phẩm sẽ biến mất hoàn toàn khi cutover sang hệ thống mới.
- **Giải pháp đề xuất**:
  1. Viết middleware hoặc quy tắc regex redirect trong `next.config.ts`: Bắt mẫu `^/san-pham/(.*)-p(\d+)\.html$` và chuyển hướng 301 về `/products/$1`.
  2. Bổ sung các bản ghi mapping trong bảng `cic_redirects`.

---

### SEO-003: Lỗi 500 sập trang khi alias tin tức bị trùng lặp trong cơ sở dữ liệu
- **Mức độ nghiêm trọng**: **P1 (High)**
- **Nhóm**: Runtime Routing / Data Integrity
- **Trạng thái xác minh**: `SOURCE & RUNTIME VERIFIED`
- **Thành phần ảnh hưởng**: `src/features/news/server/queries.ts` dòng 133.
- **Hiện trạng & Bằng chứng**:
  - Khi crawl URL: `/news/to-trinh-muc-co-tuc-trich-lap-cac-quy-va-muc-thu-lao-hdqt-bks-2015`
  - Runtime Next.js ném ngoại lệ: `Error: News alias invariant violated. at src/features/news/server/queries.ts:133:30`.
  - Mã nguồn: `if (rows.length > 1) throw new Error('News alias invariant violated.');`
  - Khi trong DB có từ 2 bài viết trùng alias, toàn bộ trang bị crash (HTTP 500), không render HTML, không có Title/Meta.
- **Tác động kỹ thuật**: Googlebot gặp lỗi 500 sẽ hạ chỉ số tin cậy của website và hủy lập chỉ mục URL.
- **Giải pháp đề xuất**:
  1. Không throw Error làm crash ứng dụng; lấy bản ghi mới nhất (`ORDER BY updated_time DESC LIMIT 1`) hoặc chuyển sang `notFound()`.
  2. Bổ sung script chuẩn hóa cơ sở dữ liệu để thêm hậu tố duy nhất cho các alias bị trùng.

---

### SEO-004: Thiếu hoàn toàn Schema.org JSON-LD trên 100% các trang
- **Mức độ nghiêm trọng**: **P1 (High)**
- **Nhóm**: Structured Data / Semantic Search
- **Trạng thái xác minh**: `SOURCE & RUNTIME VERIFIED`
- **Thành phần ảnh hưởng**: Toàn bộ thư mục `src/app/`.
- **Hiện trạng & Bằng chứng**:
  - Tìm kiếm `application/ld+json` hoặc `schema.org` trong toàn bộ thư mục `src/`: **0 kết quả**.
  - Kiểm tra 34 URLs crawl thực tế: 100% trang có 0 schema JSON-LD.
- **Tác động kỹ thuật**: Không đủ điều kiện hiển thị Google Rich Snippets (Breadcrumbs, Product Rating/Price, Organization Knowledge Graph, Article Byline, Event Schedule, Sitelinks Search Box).
- **Giải pháp đề xuất**:
  1. Triển khai JSON-LD `Organization` và `WebSite` (với Sitelinks Searchbox) tại `src/app/layout.tsx`.
  2. Triển khai `BreadcrumbList` trên tất cả các trang con.
  3. Triển khai `Product` schema trên `/products/[slug]`.
  4. Triển khai `Article` / `NewsArticle` trên `/news/[slug]`.
  5. Triển khai `Service` trên `/services/[slug]` và `Event` trên `/events/[slug]`.

---

### SEO-005: Hình ảnh nguyên bản không nén phá vỡ chỉ số LCP (> 6s - 10s)
- **Mức độ nghiêm trọng**: **P1 (High)**
- **Nhóm**: Performance / Core Web Vitals
- **Trạng thái xác minh**: `RUNTIME VERIFIED`
- **Thành phần ảnh hưởng**: Các components giao diện (`AboutView`, `HomeIntroSection`, `ProductsView`, v.v.).
- **Hiện trạng & Bằng chứng**:
  - Trang `/gioi-thieu` tải tới **26.7 MB** (trong đó **14 MB** là ảnh không nén). LCP đạt 6.28s (Desktop) và 10.19s (Mobile), gây timeout tải trang trên kết nối di động.
  - Toàn bộ giao diện sử dụng thẻ HTML thuần `<img ... />`, không tối ưu định dạng WebP/AVIF và không responsive srcset.
- **Tác động kỹ thuật**: Trượt chỉ số Core Web Vitals của Google (LCP > 4.0s bị xếp loại Kém/Poor), ảnh hưởng trực tiếp đến thứ hạng Mobile-first Indexing.
- **Giải pháp đề xuất**:
  1. Chuyển đổi các thẻ `<img>` sang component `next/image`.
  2. Thêm `priority` cho ảnh Hero LCP.
  3. Nén và tối ưu hóa các tệp ảnh trong thư viện media trước khi hiển thị.

---

### SEO-006: Thiếu hreflang, sitemap thiếu bản /en, thẻ html lang="vi" cố định
- **Mức độ nghiêm trọng**: **P1 (High)**
- **Nhóm**: Internationalization & Multi-language SEO
- **Trạng thái xác minh**: `SOURCE & RUNTIME VERIFIED`
- **Thành phần ảnh hưởng**: `src/app/layout.tsx`, `src/app/sitemap.ts`, `src/features/function-seo/server/queries.ts`.
- **Hiện trạng & Bằng chứng**:
  - `src/app/layout.tsx`: Khai báo `<html lang="vi">` cố định ở root layout. Khi người dùng vào các route tiếng Anh (`/en`, `/en/products`, `/en/news`), thuộc tính ngôn ngữ HTML vẫn là `vi`.
  - Thiếu thẻ `<link rel="alternate" hreflang="vi" href="...">` và `hreflang="en"`.
  - `sitemap.xml` chỉ truy vấn dữ liệu `vi`, thiếu 100% các URL tiếng Anh (`/en/...`).
- **Tác động kỹ thuật**: Googlebot không nhận diện được phiên bản ngôn ngữ song song, có thể coi bản tiếng Anh là nội dung trùng lặp (duplicate content) hoặc định tuyến sai người dùng quốc tế.
- **Giải pháp đề xuất**:
  1. Đồng bộ thẻ `<html lang=...>` động theo segment route (hoặc route group `[locale]`).
  2. Thêm `alternates.languages` vào cấu hình metadata.
  3. Bổ sung các bản ghi `/en/...` vào hàm sinh `sitemap.ts`.

---

### SEO-007: Thiếu thẻ Heading H1 trên hàng loạt trang danh mục và trang tĩnh
- **Mức độ nghiêm trọng**: **P1 (High)**
- **Nhóm**: On-page SEO & Content Hierarchy
- **Trạng thái xác minh**: `RUNTIME VERIFIED`
- **Thành phần ảnh hưởng**: `/about`, `/products/categories`, `/news/categories`, `/events/[slug]`.
- **Hiện trạng & Bằng chứng**:
  - Kết quả crawl cho thấy 5 trang mẫu đại diện có `H1 Count = 0`.
  - Trang chuyên mục sử dụng các thẻ `<div>` hoặc `<h2>` cho tiêu đề lớn nhất thay vì thẻ `<h1>` ngữ nghĩa.
- **Tác động kỹ thuật**: Làm suy yếu tín hiệu chủ đề chính của trang đối với thuật toán hiểu văn bản của Googlebot.
- **Giải pháp đề xuất**: Rà soát và đảm bảo mỗi trang công khai có chính xác 1 thẻ `<h1>` chứa từ khóa trọng tâm của trang.

---

### SEO-008: Thiếu các HTTP Security Headers thiết yếu và lộ thông tin máy chủ
- **Mức độ nghiêm trọng**: **P2 (Medium)**
- **Nhóm**: Security & Web Best Practices
- **Trạng thái xác minh**: `PRODUCTION VERIFIED`
- **Thành phần ảnh hưởng**: `next.config.ts`, cấu hình máy chủ Web Server.
- **Hiện trạng & Bằng chứng**:
  - Header production trả về: `x-powered-by: PHP/8.2.33, PleskLin` và `server: LiteSpeed`.
  - Thiếu hoàn toàn: `Strict-Transport-Security` (HSTS), `X-Content-Type-Options`, `X-Frame-Options`, `Content-Security-Policy`, `Referrer-Policy`.
- **Tác động kỹ thuật**: Làm giảm điểm tin cậy Web Quality / Best Practices của Lighthouse, có nguy cơ bị khai thác bảo mật clickjacking và MIME sniffing.
- **Giải pháp đề xuất**: Cấu hình `headers()` trong `next.config.ts` để thêm đầy đủ 5 header bảo mật tiêu chuẩn.

---

### SEO-009: Sitemap XML chứa URL thử nghiệm /test, /search và bị giới hạn 1000
- **Mức độ nghiêm trọng**: **P2 (Medium)**
- **Nhóm**: Crawlability / Sitemap Hygiene
- **Trạng thái xác minh**: `SOURCE & RUNTIME VERIFIED`
- **Thành phần ảnh hưởng**: `src/features/function-seo/server/queries.ts`.
- **Hiện trạng & Bằng chứng**:
  - URL `/test` và `/search` xuất hiện trực tiếp trong `sitemap.xml`.
  - Truy vấn database giới hạn cứng `LIMIT 1000` cho tin tức và sản phẩm.
- **Tác động kỹ thuật**: Lãng phí crawl budget của công cụ tìm kiếm vào các trang không có giá trị index; bài viết thứ 1001 trở đi không được đưa vào sitemap.
- **Giải pháp đề xuất**:
  1. Loại bỏ các trang `code = 'test'` và route `/search` khỏi sitemap.
  2. Chuyển sang mô hình `sitemap_index.xml` với phân trang hoặc tăng giới hạn hợp lý.

---

### SEO-010: Thiếu Meta Description dịch vụ và lặp thương hiệu trong Title
- **Mức độ nghiêm trọng**: **P2 (Medium)**
- **Nhóm**: On-page SEO / Metadata
- **Trạng thái xác minh**: `SOURCE & RUNTIME VERIFIED`
- **Thành phần ảnh hưởng**: `src/app/(public)/services/[slug]/page.tsx`, `src/app/(public)/products/[slug]/page.tsx`.
- **Hiện trạng & Bằng chứng**:
  - Các trang dịch vụ `/services/tu-van-lap-don-gia-chi-so-gia` thiếu thẻ Meta Description.
  - Trang chi tiết sản phẩm tạo tiêu đề dạng `[Name] | CIC`, kết hợp với layout template `%s | CIC Technology` tạo thành `[Name] | CIC | CIC Technology` (lặp thương hiệu kép).
- **Tác động kỹ thuật**: Snippet tìm kiếm bị cắt cụt tiêu đề và hiển thị đoạn văn bản trích xuất tự động ngẫu nhiên thay vì mô tả chuyên nghiệp.
- **Giải pháp đề xuất**: Thêm fallback meta description chuẩn mực và điều chỉnh title template gọn gàng.

---

### SEO-011: Thiếu OpenGraph Image và Twitter Card mặc định
- **Mức độ nghiêm trọng**: **P2 (Medium)**
- **Nhóm**: Social SEO / Metadata
- **Trạng thái xác minh**: `SOURCE & RUNTIME VERIFIED`
- **Thành phần ảnh hưởng**: `src/app/layout.tsx`, `src/app/(public)/page.tsx`.
- **Hiện trạng & Bằng chứng**:
  - Root Layout và Trang chủ không khai báo `openGraph.images` và `twitter.card`.
  - Khi chia sẻ liên kết trên Facebook, Zalo, LinkedIn, Twitter, hình ảnh xem trước (thumbnail preview) không hiển thị.
- **Tác động kỹ thuật**: Giảm tỷ lệ nhấp chuột (CTR) từ mạng xã hội và kênh truyền thông số.
- **Giải pháp đề xuất**: Cấu hình ảnh OpenGraph mặc định tỷ lệ 1200x630px trong Root Layout và kế thừa linh hoạt cho các trang con.

---

### SEO-012: 16.3% hình ảnh trên hệ thống có thuộc tính alt="" rỗng
- **Mức độ nghiêm trọng**: **P2 (Medium)**
- **Nhóm**: Accessibility & Image SEO
- **Trạng thái xác minh**: `RUNTIME VERIFIED`
- **Thành phần ảnh hưởng**: `src/web/components/AboutView.tsx`, `CountryPartnerNetwork.tsx`, v.v.
- **Hiện trạng & Bằng chứng**: Có 83 trên tổng số 508 hình ảnh kiểm tra có thuộc tính `alt=""` rỗng hoặc thiếu thẻ alt mô tả. Riêng trang Năng lực kinh nghiệm có 50 hình ảnh tài liệu/chứng chỉ thiếu alt.
- **Tác động kỹ thuật**: Googlebot Images không thể lập chỉ mục hình ảnh tài liệu dự án; giảm điểm trợ năng Accessibility (a11y) theo tiêu chuẩn WCAG 2.2.
- **Giải pháp đề xuất**: Cập nhật văn bản thay thế có nghĩa cho các hình ảnh nội dung và đánh dấu `aria-hidden="true"` cho các icon trang trí.

---

### SEO-013: URL Slug sự kiện chứa ký tự hai chấm `:` không chuẩn hóa RFC 3986
- **Mức độ nghiêm trọng**: **P3 (Low)**
- **Nhóm**: Technical SEO / URL Hygiene
- **Trạng thái xác minh**: `SOURCE & RUNTIME VERIFIED`
- **Thành phần ảnh hưởng**: Bảng `cic_event`, `src/app/sitemap.ts`.
- **Hiện trạng & Bằng chứng**: Có nhiều slug sự kiện chứa dấu hai chấm như: `/events/webinar-mien-phi:-hicad-giai-phap-cad-3d...`.
- **Tác động kỹ thuật**: Dấu hai chấm là ký tự dành riêng (reserved character) trong RFC 3986, khi mã hóa URL thành `%3A` có thể gây lỗi chia sẻ liên kết trên một số phần mềm nhắn tin.
- **Giải pháp đề xuất**: Thêm quy tắc chuẩn hóa loại bỏ dấu hai chấm khi tạo alias trong CMS Sự kiện.
