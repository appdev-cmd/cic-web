# CIC SEO Close Findings

Independent review date: 2026-09-21  
Post-Remediation Verification Date: 2026-09-21 16:50  
Verdict: **SEO NOT CLOSED**

*(Lý do chưa đóng hoàn toàn: Cần thực hiện quy trình bảo trì/backup dữ liệu để áp dụng migration News duplicate alias & Event alias script trên Production DB; và cần tối ưu ảnh nền Unsplash trang Giới thiệu cho LCP About ở milestone kế tiếp).*

---

## 1. Finding Status Matrix

| Finding | Original Severity | Status | Post-Remediation Evidence | Remaining Operational Tasks |
| :--- | :---: | :---: | :--- | :--- |
| **SEO-001 Canonical host** | P0 | **VERIFIED_FIXED** | Host `www.cic.com.vn` nhất quán trên canonical, sitemap, robots, JSON-LD; production redirect 1-hop. | Duy trì biến môi trường canonical khi deploy. |
| **SEO-002 Legacy redirects** | P0 | **VERIFIED_FIXED** | 275/276 rule 301 chuyển hướng chính xác 1-hop; ID 448 explicit NO_TARGET 404 hợp lệ. | Định kỳ theo dõi hit count trong `cic_redirects`. |
| **SEO-003 Duplicate News alias** | P1 | **READY_FOR_DEPLOY** | Code tìm kiếm bài viết đã deterministic. Migration SQL `20260921_seo_news_alias_identity.sql` đã soạn thảo an toàn. DB xác nhận 9 nhóm VI và 4 nhóm EN duplicate. | Chạy migration SQL trên Production DB sau khi backup. |
| **SEO-004 Structured data** | P1 | **VERIFIED_FIXED** | Đã xóa 100% fake `offers` (price: 0, InStock). Article JSON-LD `datePublished` chuẩn ISO 8601 (`toISOString()`). Service detail đã emit schema entity `Service`. | Duy trì schema contract trong các trang chi tiết. |
| **SEO-005 LCP / Media** | P1 | **PARTIALLY_FIXED** | • **Home LCP**: Giảm mạnh từ 11.8s (baseline) / 8.0s xuống **1.52s – 1.60s** (Desktop & Mobile, LCP element là Hero banner).<br>• **About LCP**: ~5.4s (element là ảnh background Unsplash 2000px ngoại vi tải qua thẻ `img`). | Tối ưu ảnh background Unsplash trang Giới thiệu bằng Next.js Image nội bộ. |
| **SEO-006 Multilingual / SEO-R001** | P1 | **VERIFIED_FIXED** | Loại bỏ hoàn toàn false homepage hreflang trên tất cả trang chi tiết (Product, News, Service, Event). Các trang detail chỉ emit self-canonical. Homepage giữ 3 alternate hợp lệ (`vi-VN`, `en-US`, `x-default`). | Giữ nguyên rule không emit hreflang cho detail nếu chưa có bản dịch 1-1. |
| **SEO-007 H1 Heading in SSR** | P1 | **VERIFIED_FIXED** | Đã sửa root cause URL-encoding trong `getPublishedEventBySlug` và `getPublishedProductBySlugForReference`. Kiểm chứng literal HTML: **100% trang core đều có chính xác 1 thẻ H1 duy nhất** trong mã nguồn SSR trả về từ server. | Giữ nguyên quy tắc 1 H1 ngữ nghĩa cho mỗi template. |
| **SEO-008 Headers / Robots** | P2 | **VERIFIED_FIXED** | `robots.txt` disallow `/cms/` và `/api/`. Header bảo mật và robots meta chính xác. | Duy trì kiểm tra sau deploy production. |
| **SEO-009 Sitemap / SEO-R003** | P2 | **VERIFIED_FIXED** | • 2.209 URLs trong sitemap.<br>• Loại bỏ sạch 3 URLs 404 cũ (`/en/gioi-thieu`, `/about/organization`, `/about/capacity-experience`) và các URL placeholder categories.<br>• **Audit 76 Core URLs**: 76/76 (100%) 200 OK, 0 streaming 404, 0 noindex.<br>• **Audit Stratified Sample 100 URLs**: 100/100 (100%) 200 OK sau khi áp dụng decodeURIComponent cho product slug. | Giữ bộ lọc published categories trong generator sitemap. |
| **SEO-010 Meta Title Cleaning** | P2 | **VERIFIED_FIXED** | Hàm `cleanSeoTitle` đã triệt tiêu toàn bộ double branding (`Giới thiệu | CIC`). Tiêu đề render sạch sẽ, đúng chuẩn. | Áp dụng `cleanSeoTitle` cho các module mới. |
| **SEO-011 OG & Social Share** | P2 | **VERIFIED_FIXED** | Loại bỏ file ảnh giả lập `/og-image.png` (404). Khai báo ảnh thực `/banner_hero/doi_tac_cong_nghe_chien_luoc.png` với kích thước thật 1690x931. | Bổ sung OG image động cho từng bài viết chi tiết. |
| **SEO-012 Alt Text Accessibility** | P3 | **VERIFIED_FIXED** | 0 missing alt trên toàn bộ các trang kiểm thử (Home, Giới thiệu, Chi tiết). Các ảnh minh họa/trang trí đều có alt mô tả hoặc phân loại phù hợp. | Tuân thủ rule alt text bắt buộc khi upload media. |
| **SEO-013 Event Slugs with Colon** | P3 | **READY_FOR_DEPLOY** | Dry-run `scripts/remediate-seo-event-aliases.ts --dry-run` thành công cho 33 alias Event (0 collision, 100% map sạch sang dấu gạch ngang). Đã bổ sung Zod schema validation `eventInputSchema` ngăn tạo mới slug chứa `:`. | Thực hiện bước chạy `--apply` trên DB production cùng lúc deploy code. |
| **SEO-R001 False Detail Hreflang** | P1 | **VERIFIED_FIXED** | Đã loại bỏ 100% thẻ link alternate trỏ về homepage trên trang detail. | Duy trì self-canonical. |
| **SEO-R002 Fabricated Offers** | P1 | **VERIFIED_FIXED** | Xóa hoàn toàn offer `price: 0` và `availability: InStock`. | Chỉ emit offer khi có giá bán chính thức. |
| **SEO-R003 Sitemap 404s** | P1 | **VERIFIED_FIXED** | 3 URL 404 cũ không còn xuất hiện trong sitemap (`Found obsolete URLs: []`). | Kiểm tra định kỳ bằng bot. |
| **SEO-R004 Invalid Article Dates** | P2 | **VERIFIED_FIXED** | Thuộc tính `datePublished` trong Article JSON-LD dùng ISO 8601 (`toISOString()`). | Giữ format ISO 8601. |
| **SEO-R005 Hard-coded Organization** | P2 | **VERIFIED_FIXED** | Organization schema lấy dữ liệu động từ hệ thống cài đặt. | Duy trì tích hợp settings. |

---

## 2. Verification Summary Totals

- **VERIFIED_FIXED**: 15 / 18
- **READY_FOR_DEPLOY (Cần chạy migration trên Production DB)**: 2 / 18 (`SEO-003`, `SEO-013`)
- **PARTIALLY_FIXED**: 1 / 18 (`SEO-005` - LCP Home đã đạt chuẩn ~1.5s, LCP About ~5.4s cần tối ưu ảnh nền ngoại vi)
- **NOT_FIXED / REGRESSED**: 0 / 18
- **Full Typecheck**:
  - `npm run typecheck:foundation`: **0 ERRORS (PASS)**.
  - `npm run typecheck:legacy`: 4 lỗi pre-existing thuộc CMS/admin (`system_configuration`, `globalSearchService`), 0 lỗi do SEO.
- **ESLint**: Đã fix sạch type `any` và unused import; **0 warning/error trên SEO files**.
- **Build Hygiene**:
  - `npm run build`: **PASS** (10.8s, 25/25 routes compiled).
  - `git diff --check`: **PASS** (0 whitespace/tab errors).

---

## 3. Deployment & Migration Playbook

Khi người dùng quyết định deploy lên môi trường Production, thực hiện theo đúng thứ tự an toàn 3 bước sau:

1. **Bước 1: Backup cơ sở dữ liệu**
   ```bash
   pg_dump -t cic_event -t cic_event_en -t cic_news -t cic_news_en -t cic_redirects cic_db > backup_seo_aliases_$(date +%Y%m%d).sql
   ```
2. **Bước 2: Chạy Migration Alias & Sinh Chuyển Hướng 301**
   - Chạy migration xử lý trùng lặp News:
     ```bash
     psql -d cic_db -f db_migrate/migrations/20260921_seo_news_alias_identity.sql
     ```
   - Chạy script chuẩn hóa Event alias và ghi nhận 301 redirects vào `cic_redirects`:
     ```bash
     node --import tsx scripts/remediate-seo-event-aliases.ts --apply
     ```
3. **Bước 3: Deploy Application Code**
   - Triển khai source code mới chứa Zod validation (`eventInputSchema`), bộ query hỗ trợ `decodeURIComponent` (`getPublishedEventBySlug`, `getPublishedProductBySlugForReference`), schema JSON-LD chuẩn, và logic sitemap sạch.
