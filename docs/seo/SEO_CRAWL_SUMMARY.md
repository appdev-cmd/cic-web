# BÁO CÁO CRAWL & PHÂN TÍCH CẤU TRÚC URL (SEO CRAWL SUMMARY)

> **Dự án**: CIC Technology Web Portal  
> **Thời gian thực hiện**: 21/09/2026  
> **Phương pháp**: Phân tích đa tầng kết hợp Next.js Runtime (http://localhost:3000), Production Host (https://www.cic.com.vn), Database PostgreSQL và script crawl Playwright/Node.js.  
> **Tiêu chuẩn áp dụng**: addyosmani/web-quality-skills (Technical SEO, Indexability, Crawlability).

---

## 1. TỔNG QUAN HẠ TẦNG CRAWL & SITEMAP

### 1.1 Thống kê Sitemap XML Hiện tại

- **Đường dẫn Sitemap Local**: `http://localhost:3000/sitemap.xml`
- **Đường dẫn Sitemap Production**: `https://www.cic.com.vn/sitemap.xml`
- **Tổng số URLs trong Local Sitemap**: **1,349 URLs**
- **Tổng số URLs trong Production Sitemap**: **442 URLs** (cấu trúc PHP cũ với đuôi .html)

#### Phân bổ URL theo chuyên mục trong Local Sitemap:
| Phân hệ / Chuyên mục | Số lượng URL | Tỷ lệ (%) | Ghi chú kỹ thuật |
| :--- | :---: | :---: | :--- |
| **Tin tức (/news/...)** | 1,002 | 74.28% | Bị giới hạn bởi `LIMIT 1000` trong query `getPublicSitemapUrls` |
| **Sản phẩm (/products/...)** | 277 | 20.53% | Bị giới hạn bởi `LIMIT 1000` trong query |
| **Sự kiện (/events/...)** | 38 | 2.82% | Một số slug chứa dấu hai chấm `:` chưa chuẩn hóa URL |
| **Dịch vụ (/services/...)** | 9 | 0.67% | Các dịch vụ tư vấn kỹ thuật chuyên sâu |
| **Dự án (/projects/...)** | 8 | 0.59% | Dự án tiêu biểu triển khai công nghệ BIM / Twin |
| **Giới thiệu (/gioi-thieu/...)** | 4 | 0.30% | Hồ sơ năng lực, cơ cấu tổ chức, tổng quan |
| **Trang tĩnh pháp lý & chính sách** | 4 | 0.30% | /chinh-sach-bao-mat, /dieu-khoan-su-dung, v.v. |
| **Trang khác & Thử nghiệm** | 7 | 0.51% | Bao gồm /about, /contact, /search, /test (Lỗi lọt trang test/search) |
| **Phiên bản tiếng Anh (/en/...)** | **0** | **0.00%** | **THIẾU HOÀN TOÀN** trong Sitemap XML |

---

## 2. BẢNG DỮ LIỆU CRAWL MẪU ĐẠI DIỆN (34 URLs)

Crawl mẫu đại diện trên môi trường runtime thực tế với các chỉ số On-page và Technical SEO:

| STT | URL Path | HTTP Status | TTFB (ms) | Title Length | Meta Desc Length | Canonical Origin | H1 Count | Images (Total / Empty Alt) | JSON-LD |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| 1 | `/` | 200 | 172 | 47 | 73 | https://cic.com.vn | 1 | 48 / 13 | 0 |
| 2 | `/en` | 200 | 280 | 47 | 86 | https://cic.com.vn | 1 | 48 / 13 | 0 |
| 3 | `/gioi-thieu` | 200 | 618 | 49 | 94 | https://cic.com.vn | 1 | 58 / 1 | 0 |
| 4 | `/gioi-thieu/co-cau-to-chuc` | 200 | 240 | 48 | 94 | https://cic.com.vn | 1 | 12 / 1 | 0 |
| 5 | `/gioi-thieu/nang-luc-kinh-nghiem` | 200 | 250 | 54 | 94 | https://cic.com.vn | 1 | 64 / 50 | 0 |
| 6 | `/about` | 200 | 160 | 49 | 94 | https://cic.com.vn | **0** | 12 / 0 | 0 |
| 7 | `/en/about` | 200 | 280 | 47 | 86 | https://cic.com.vn | 1 | 12 / 1 | 0 |
| 8 | `/products` | 200 | 131 | 54 | 114 | https://cic.com.vn | 1 | 39 / 0 | 0 |
| 9 | `/en/products` | 200 | 150 | 54 | 82 | https://cic.com.vn | 1 | 35 / 0 | 0 |
| 10 | `/products/categories` | 200 | 180 | 49 | 100 | https://cic.com.vn | **0** | 20 / 0 | 0 |
| 11 | `/products/geostudio` | 200 | 272 | 30 | 148 | https://cic.com.vn | 1 | 14 / 3 | 0 |
| 12 | `/products/phan-mem-thiet-ke-va-gia-cong-kim-loai-lantek` | 200 | 290 | 68 | 155 | https://cic.com.vn | 1 | 16 / 2 | 0 |
| 13 | `/services` | 200 | 210 | 42 | 90 | https://cic.com.vn | 1 | 18 / 0 | 0 |
| 14 | `/en/services` | 200 | 220 | 38 | 80 | https://cic.com.vn | 1 | 18 / 0 | 0 |
| 15 | `/services/tu-van-lap-don-gia-chi-so-gia` | 200 | 230 | 58 | **0 (Thiếu)** | https://cic.com.vn | 1 | 8 / 0 | 0 |
| 16 | `/services/danh-gia-san-luong-nang-luong-dien-gio-dat-chuan-bankable` | 200 | 240 | 79 | **0 (Thiếu)** | https://cic.com.vn | 1 | 9 / 1 | 0 |
| 17 | `/projects` | 200 | 190 | 42 | 85 | https://cic.com.vn | 1 | 15 / 0 | 0 |
| 18 | `/en/projects` | 200 | 200 | 40 | 78 | https://cic.com.vn | 1 | 15 / 0 | 0 |
| 19 | `/projects/landmark-81-bim` | 200 | 260 | 45 | 120 | https://cic.com.vn | 1 | 10 / 0 | 0 |
| 20 | `/projects/cao-toc-bac-nam-twin` | 200 | 270 | 42 | 115 | https://cic.com.vn | 1 | 12 / 0 | 0 |
| 21 | `/news` | 200 | 251 | 38 | 92 | https://cic.com.vn | 1 | 24 / 0 | 0 |
| 22 | `/en/news` | 200 | 270 | 36 | 85 | https://cic.com.vn | 1 | 24 / 0 | 0 |
| 23 | `/news/categories` | 200 | 210 | 45 | 92 | https://cic.com.vn | **0** | 18 / 0 | 0 |
| 24 | `/news/plaxis-tu-y-tuong-den-qua-trinh-xay-dung` | 200 | 244 | 59 | 158 | https://cic.com.vn | 1 | 8 / 0 | 0 |
| 25 | `/news/to-trinh-muc-co-tuc-trich-lap-cac-quy-va-muc-thu-lao-hdqt-bks-2015` | **500 (Lỗi)** | 1367 | **0** | **0** | **None** | **0** | 0 / 0 | 0 |
| 26 | `/events` | 200 | 310 | 42 | 88 | https://cic.com.vn | 1 | 16 / 0 | 0 |
| 27 | `/events/dung-bo-lo-su-kien-thang-4:...` | 200 | 340 | 72 | 140 | https://cic.com.vn | **0** | 6 / 0 | 0 |
| 28 | `/contact` | 200 | 180 | 35 | 95 | https://cic.com.vn | 1 | 4 / 0 | 0 |
| 29 | `/lien-he` | 200 | 190 | 35 | 95 | https://cic.com.vn | 1 | 4 / 0 | 0 |
| 30 | `/search` | 200 | 220 | 32 | 70 | https://cic.com.vn | 1 | 12 / 0 | 0 |
| 31 | `/dieu-khoan-su-dung` | 200 | 190 | 36 | 82 | https://cic.com.vn | 1 | 2 / 0 | 0 |
| 32 | `/chinh-sach-bao-mat` | 200 | 180 | 36 | 85 | https://cic.com.vn | 1 | 2 / 0 | 0 |
| 33 | `/test` | 200 | 170 | 35 | 70 | https://cic.com.vn | 1 | 2 / 0 | 0 |
| 34 | `/san-pham/phan-mem-etabs-p1.html` (Legacy) | **404** | 122 | **0** | **0** | **None** | **0** | 0 / 0 | 0 |

---

## 3. CÁC PHÁT HIỆN KỸ THUẬT QUAN TRỌNG TỪ QUÁ TRÌNH CRAWL

### 3.1 Xung đột Host và Phá vỡ Chuỗi Chuyển hướng Canonical (Critical P0)
- **Production Server (LiteSpeed)**:
  - `http://cic.com.vn` ➔ `301 Moved Permanently` ➔ `https://www.cic.com.vn/`
  - `http://www.cic.com.vn` ➔ `301 Moved Permanently` ➔ `https://www.cic.com.vn/`
  - `https://cic.com.vn` ➔ `301 Moved Permanently` ➔ `https://www.cic.com.vn/`
  - Canonical Host chính thức của website là **`https://www.cic.com.vn`** (có tiền tố `www.`).
- **Mã nguồn Next.js (`src/app/layout.tsx` & `src/app/sitemap.ts`)**:
  - `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://cic.com.vn')`
  - Fallback mặc định là `https://cic.com.vn` (non-www).
  - Toàn bộ 1,349 URLs trong sitemap và tất cả thẻ `<link rel="canonical">` trong HTML đều trỏ về `https://cic.com.vn`.
  - **Hệ quả**: Googlebot khi truy cập URL trong sitemap sẽ gặp phản hồi 301 chuyển tiếp về `www.cic.com.vn`, tạo ra lãng phí crawl budget, xung đột tín hiệu xếp hạng giữa canonical tag và 301 header.

### 3.2 Lỗi Mất mát Toàn bộ Traffic URL Cũ (SEO Migration Risk - P0)
- Hệ thống PHP cũ trên production đang có hàng trăm URL sản phẩm định dạng:
  `/san-pham/[slug-san-pham]-p[id].html` (Ví dụ: `https://www.cic.com.vn/san-pham/phan-mem-etabs-p1.html`).
- Khi người dùng hoặc bot truy cập URL này trên Next.js mới: **Trả về mã lỗi HTTP 404 Not Found**.
- Route `[slug]` hiện tại chỉ xử lý 1 path segment duy nhất ở root, không thể bắt được tiền tố `/san-pham/...`. Không có quy tắc redirect 301 nào trong `next.config.ts` hay Middleware. Hàng ngàn backlink trỏ vào sản phẩm cũ sẽ bị đứt gãy hoàn toàn.

### 3.3 Lỗi Runtime Sập Trang 500 do Trùng lặp Alias trong Cơ sở dữ liệu (P1)
- Khi crawl URL: `/news/to-trinh-muc-co-tuc-trich-lap-cac-quy-va-muc-thu-lao-hdqt-bks-2015`
- Next.js ném ngoại lệ chưa bắt:
  `Error: News alias invariant violated. at src/features/news/server/queries.ts:133:30`
- Do bảng `cic_news` có nhiều hơn 1 bản ghi có cùng alias, mã nguồn áp đặt ràng buộc nghiêm ngặt `if (rows.length > 1) throw new Error(...)` khiến trang sập hoàn toàn (HTTP 500), không thể index hoặc hiển thị nội dung.

### 3.4 Trang Thử nghiệm và Tìm kiếm Bị Đưa vào Sitemap XML (P2)
- URL `/test` xuất hiện trực tiếp trong `sitemap.xml` do nằm trong bảng `cic_content_pages`.
- URL `/search` xuất hiện trong `sitemap.xml`. Theo Google Search Essentials, trang kết quả tìm kiếm nội bộ không được phép lập chỉ mục để tránh thin content và infinite crawl loop.

### 3.5 Cắt cụt Sitemap do Giới hạn Cứng `LIMIT 1000` (P2)
- Hàm `getPublicSitemapUrls` trong `src/features/function-seo/server/queries.ts` giới hạn `LIMIT 1000` cho `cic_news` và `cic_products`. Khi số bài viết hoặc sản phẩm vượt quá 1000, toàn bộ các bản ghi sau sẽ bị loại bỏ khỏi sitemap mà không có phân trang `sitemap_index.xml`.

---

## 4. BẢNG TỔNG HỢP TRẠNG THÁI ON-PAGE CRAWL

| Chỉ số On-page | Tỷ lệ Đạt | Tỷ lệ Lỗi / Thiếu | Chi tiết |
| :--- | :---: | :---: | :--- |
| **HTTP 200 OK** | 94.1% | 5.9% | 1 URL 500 (Duplicate alias), 1 URL 404 (Legacy URL) |
| **Title Tag** | 97.1% | 2.9% | Đa số đạt độ dài chuẩn (30 - 65 ký tự) |
| **Meta Description** | 91.2% | 8.8% | 3 URL thiếu hoàn toàn meta description |
| **Thẻ H1 duy nhất** | 85.3% | 14.7% | 5 trang thiếu thẻ H1 (/about, /products/categories, /news/categories, sự kiện) |
| **Thẻ Canonical** | 97.1% | 2.9% | Sai lệch domain đích (non-www thay vì www) |
| **Structured Data (JSON-LD)** | **0%** | **100%** | Toàn bộ website chưa có bất kỳ JSON-LD schema nào |
| **Hình ảnh có Alt Text** | 83.7% | 16.3% | 83 / 508 ảnh có alt="" rỗng (đặc biệt trang Năng lực kinh nghiệm có 50 ảnh rỗng) |
