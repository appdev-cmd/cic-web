# BÁO CÁO KIỂM TOÁN AN NINH ĐỘC LẬP LẦN 3 (ADVERSARIAL / RED-TEAM VERIFICATION)

**Dự án:** CIC Web Portal (`cic-web`)  
**Ngày kiểm toán:** 21/09/2026  
**Chế độ kiểm toán:** STRICT READ-ONLY AUDIT  
**Phương pháp luận:** Adversarial Verification & Red-Team Assessment (`cloudflare/security-audit-skill`)  
**Mục tiêu:** Kiểm chứng đối kháng, chủ động phá vỡ kết luận PASS của Re-Audit #2, tìm kiếm bypasses, alternate attack paths, false-negatives và các lỗ hổng bị che lấp bởi test suite.

---

## MỤC A: COMMIT VÀ TRẠNG THÁI KIỂM TOÁN (AUDITED COMMIT)

- **Branch:** `refactor/nextjs-fullstack`
- **Audited Commit HEAD:** `a75d4a9a1e0899a2fd60bef18fd8d0ca80294dad`
- **Commit Message:** `fix(security): resolve SEC-R001 through SEC-R006 and residual defects across HTML sinks, SVG pipeline, RBAC, email templates, and rate limiter`
- **Trạng thái Git Working Tree:** STRICT READ-ONLY (Không chỉnh sửa source, không commit, không push).
- **Nguyên tắc đối kháng áp dụng:**
  - Không tin tưởng kết luận PASS của các vòng trước.
  - Không coi việc test suite hiện tại `39/39 PASS` là bằng chứng bảo mật.
  - Không giả định "có helper bảo vệ nghĩa là mọi đường dẫn đều an toàn".
  - Kiểm tra thực tế bằng payload đối kháng mới trên môi trường độc lập.

---

## MỤC B: KHÁM PHÁ BỀ MẶT TẤN CÔNG MỚI (NEWLY DISCOVERED ATTACK SURFACE)

So sánh với Re-Audit #2 (chỉ tập trung vào các điểm đã có trong findings cũ), Re-Audit #3 đã quét toàn bộ repository từ đầu và phát hiện các bề mặt tấn công chưa từng được liệt kê đầy đủ:

1. **Hệ thống 22 Route Handlers nội bộ CMS (`src/app/api/cms/**`):**
   - Các API nhạy cảm: `/api/cms/cta`, `/api/cms/customer-requests`, `/api/cms/email-templates`, `/api/cms/forms`, `/api/cms/projects` và các sub-routes (`reassign`, `bulk-delete`, `priority`, `status`, `notes`, `tags`).
   - Đánh dấu: `PREVIOUSLY_UNCOVERED_SURFACE`.
2. **Public Unauthenticated Dynamic Search (`/search?q=...`):**
   - Route SSR công khai tại `src/app/(public)/search/page.tsx` gọi `searchPublishedContent()`.
   - Thực thi quét đồng thời 5 bảng cơ sở dữ liệu lớn và nạp toàn bộ vào bộ nhớ Node.js để lọc bằng JavaScript mà không hề có cơ chế rate limiting.
   - Đánh dấu: `PREVIOUSLY_UNCOVERED_SURFACE`.
3. **Public Unauthenticated Endpoints khác:**
   - `/api/cta/[code]` (`src/app/api/cta/[code]/route.ts`): Truy vấn CTA công khai.
   - `/san-pham/[slug]` (`src/app/san-pham/[slug]/route.ts`): Xử lý chuyển hướng URL sản phẩm legacy từ hệ thống cũ.

---

## MỤC C: KIỂM CHỨNG ĐỐI KHÁNG CÁC PHÁT HIỆN CŨ (PREVIOUS FINDING ADVERSARIAL VERIFICATION)

| Finding ID | Đánh giá trước | Đánh giá đối kháng tại Re-Audit #3 | Bằng chứng thực tế từ mã nguồn & Thử nghiệm đối kháng |
| :--- | :--- | :--- | :--- |
| **SEC-001 & SEC-R001** (Stored XSS) | VERIFIED_FIXED | **VERIFIED_FIXED** | Đã thử nghiệm đối kháng với payload mixed-case, img onerror, iframe javascript, nested tags, CSS expressions, CSS imports, position overlay defacement. `sanitizeHtmlContent` bóc tách triệt để các thuộc tính nguy hiểm và tuân thủ whitelist CSS nghiêm ngặt. |
| **SEC-002** (Database Dumps in Repo) | VERIFIED_FIXED | **INCOMPLETE (HISTORY LEAK)** | Working tree đã sạch, tuy nhiên lịch sử git vẫn còn lưu giữ trọn vẹn các file dump nhạy cảm tại commits cũ (`c782ead`, `32128de`). *(Xem chi tiết tại Mục N)*. |
| **SEC-003 & SEC-R004** (Email Template Injection) | VERIFIED_FIXED | **VERIFIED_FIXED** | Đã thử nghiệm token collision, nested braces (`{{{{name}}}}`), và chèn payload qua biến form. Khi `isHtml = true`, mọi biến động của người dùng đều bị escape an toàn. Không có luồng nào cho phép user input map vào cú pháp raw `{{{...}}}`. |
| **SEC-004 & SEC-R006** (Rate Limiter IP Extraction) | DEPLOYMENT_DEPENDENT | **DEFECTIVE / DOS VULNERABLE** | Cơ chế trích xuất IP dùng `isIP()` tốt, nhưng bộ lưu trữ in-memory `rateLimitStore` không có giới hạn dung lượng (unbounded Map), cleanup theo chu kỳ 5 phút gây nghẽn event loop, và không đồng bộ trong mô hình multi-instance. |
| **SEC-005** (Media Path Bypass) | VERIFIED_FIXED | **VERIFIED_FIXED** | Route `/api/media/[id]` và `/images/[...path]` bắt buộc query DB và kiểm tra `deleted_at IS NULL`, chống path traversal triệt để. |
| **SEC-006** (CSP Restrictive Controls) | RESIDUAL_RISK | **RESIDUAL_RISK** | Production CSP đã bỏ `unsafe-eval`, giữ `unsafe-inline` cho SSR Next.js. Không có lỗ hổng mới từ chính CSP. |
| **SEC-007 & SEC-R003** (RBAC Privilege Protection) | VERIFIED_FIXED | **VERIFIED_FIXED** | Đã rà soát luồng domain check `assertActorCanManageTargetUser` và `assertRoleAssignmentPrivilege`. Ngăn chặn thành công non-admin can thiệp tài khoản Admin. |
| **SEC-008 & SEC-R005** (Cache Invalidation) | VERIFIED_FIXED | **VERIFIED_FIXED (SINGLE INSTANCE ONLY)** | Invalidation đầy đủ tại mọi mutation. Tuy nhiên bộ nhớ cache là `Map` cục bộ; nếu chạy nhiều instance (multi-instance/clustered), cache giữa các instance sẽ không đồng bộ trong vòng 30s. |
| **SEC-009 & SEC-R002** (SVG Pipeline & Security Headers) | VERIFIED_FIXED | **BROKEN / BYPASS CONFIRMED** | **Bộ kiểm tra `isDangerousSvg` bị bypass hoàn toàn** bởi kỹ thuật XML Entity Encoding (`jav&#x61;script:`), xlink entity, và ký tự xuống dòng/khoảng trắng trong event handlers (`on\nload=`). |

---

## MỤC D: CÁC PHÁT HIỆN LỖ HỔNG MỚI (NEW CONFIRMED FINDINGS)

### FINDING SEC-A001: Bộ Kiểm Duyệt SVG (`isDangerousSvg`) Bị Bypass Hoàn Toàn Bởi XML Entity Encoding và Whitespace Handlers

- **Entry Point:** `POST /api/upload` và Server Action `uploadMediaAction` / `replaceMediaAssetAction` (`src/features/media/server/actions.ts`).
- **Source:** Tệp SVG do người dùng tải lên (`file: File`).
- **Security Boundary:** Module kiểm duyệt an ninh SVG tập trung `assertSafeSvgFile` → `isDangerousSvg` (`src/shared/lib/svg-security.ts`).
- **Sink:** Lưu trữ SVG vào Supabase Storage (`MEDIA_BUCKET`) và phục vụ tải về.
- **Precondition:** Người dùng có tài khoản CMS (kể cả quyền thấp) tải file lên hệ thống.
- **File & Line:** `src/shared/lib/svg-security.ts:20-22`, `src/shared/lib/svg-security.ts:17-18`.
- **Why Current Control Fails:**
  1. **XML Entity Encoding Bypass:**
     Hàm `isDangerousSvg` kiểm tra URI scheme bằng regex:
     ```ts
     /(?:href|xlink:href)\s*=\s*["']?\s*(?:javascript:|data:|vbscript:)/i.test(lower)
     ```
     Khi kẻ tấn công sử dụng XML numeric/hex entity trong thuộc tính `href` của SVG:
     ```xml
     <svg xmlns="http://www.w3.org/2000/svg">
       <a href="jav&#x61;script:alert(1)"><text y="20">Click Me</text></a>
     </svg>
     ```
     Chuỗi `jav&#x61;script:` không khớp với regex `javascript:`. `isDangerousSvg` trả về `false` (Bypass thành công). Khi trình duyệt mở SVG, XML parser tự động giải mã `&#x61;` thành chữ `a`, tạo thành liên kết JavaScript thực thi trực tiếp khi nhấp chuột!
  2. **Whitespace / Newline Event Handler Bypass:**
     Hàm kiểm tra handler:
     ```ts
     /\bon[a-z]+\s*=/i.test(lower)
     ```
     Khi chèn ký tự xuống dòng (`\n`) hoặc tab (`\t`) giữa `on` và tên sự kiện:
     ```xml
     <svg xmlns="http://www.w3.org/2000/svg" on
     load="alert(1)"></svg>
     ```
     Regex `/\bon[a-z]+/` bị gãy do gặp ký tự xuống dòng ngay sau `on`, làm cho `isDangerousSvg` bỏ lọt payload.
- **Evidence (Kiểm thử thực tế trên Red-Team Suite):**
  ```text
  [SVG] XML entity in href: flagged = false ⚠️ BYPASS!
  [SVG] URL encoding in href: flagged = false ⚠️ BYPASS!
  [SVG] Newline in javascript: href: flagged = false ⚠️ BYPASS!
  [SVG] xlink:href entity: flagged = false ⚠️ BYPASS!
  [SVG] handler with newline: flagged = false ⚠️ BYPASS!
  [SVG] handler with tab: flagged = false ⚠️ BYPASS!
  ```
- **Impact:** HIGH. Bộ lọc SVG tạo ra cảm giác an toàn giả tạo (false sense of security). Mặc dù hiện tại route `/api/media/[id]` có chỉ định tham số download cho Supabase Storage, tệp SVG độc hại vẫn nằm trong bucket và có thể kích hoạt XSS nếu người dùng mở tệp hoặc nếu cấu hình storage/CDN phục vụ trực tiếp tệp.

---

### FINDING SEC-A002: Từ Chối Dịch Vụ Bộ Nhớ (Memory Exhaustion DoS) & Tắc Nghẽn Event Loop Trong Rate Limiter

- **Entry Point:** Mọi endpoint gọi `checkRateLimit` (`/cms/login`, `/api/forms/submit`, `submitContactAction`, `registerEventAction`).
- **Source:** Header HTTP từ client (`cf-connecting-ip`, `x-real-ip`, `x-forwarded-for`).
- **Security Boundary:** Module Rate Limiting (`src/server/auth/rate-limit.ts`).
- **Sink:** Bộ nhớ Heap V8 của Node.js (`rateLimitStore = new Map<string, RateLimitRecord>()`).
- **File & Line:** `src/server/auth/rate-limit.ts:9`, `src/server/auth/rate-limit.ts:15-27`.
- **Why Current Control Fails:**
  1. `rateLimitStore` là một `Map` không có giới hạn kích thước tối đa (`MAX_KEYS` hoặc cơ chế LRU Eviction).
  2. Hàm dọn dẹp `cleanupStaleEntries` chỉ chạy mỗi 5 phút một lần (`CLEANUP_INTERVAL_MS = 300,000`).
  3. Khi kẻ tấn công gửi một lượng lớn request kèm theo các IP giả mạo ngẫu nhiên (ví dụ 1 triệu IP khác nhau trong 4 phút), `rateLimitStore` sẽ phình to hàng trăm Megabytes bộ nhớ RAM.
  4. Nguy hiểm hơn: khi `cleanupStaleEntries` được kích hoạt ở phút thứ 5, nó thực hiện vòng lặp `for (const [key, record] of rateLimitStore.entries())` đồng bộ (synchronously) trên Main Thread của Node.js. Việc duyệt và lọc qua hàng triệu phần tử trong một tích tắc sẽ gây nghẽn toàn bộ Event Loop (Event Loop Starvation), khiến server không thể phản hồi bất kỳ request nào khác của người dùng (Application DoS).
- **Impact:** MEDIUM.

---

### FINDING SEC-A003: Lộ Lọt Dữ Liệu SQL Dump Trong Lịch Sử Git (Git History Secret Exposure)

- **Entry Point:** Git commit history của kho mã nguồn.
- **Source:** Các commit cũ (`c782eadd0f9320b78c67df4df72acc28e199a009` và `32128de06f0ac203382eede826f1a7ab90cc99f5`).
- **File:** `db_migrate/cic14005_cic_fs.sql`, `db_migrate/export_data.sql`, `db_migrate/migration_data.sql`.
- **Why Current Control Fails:**
  Vòng Remediation Round 1 chỉ xóa các file SQL khỏi working tree (`git rm`), nhưng toàn bộ nội dung dữ liệu database dump cũ vẫn tồn tại nguyên vẹn trong lịch sử git object của repository. Bất kỳ ai có quyền clone git repo đều có thể khôi phục và đọc toàn bộ dữ liệu này.
- **Action Required:** `SECRET ROTATION REQUIRED` & BFG / `git-filter-repo` history purge.
- **Impact:** HIGH (Nếu dữ liệu dump chứa thông tin người dùng thật, password hash hoặc secret production cũ).

---

## MỤC E: CÁC ĐIỂM CẦN KIỂM CHỨNG THÊM (NEEDS VALIDATION)

1. **Unthrottled Public Search Performance Degradation:**
   - **Vị trí:** `src/app/(public)/search/page.tsx:4` và `src/features/search/server/queries.ts:13`.
   - **Hiện tượng:** Mỗi request gửi tới `/search?q=abc` thực hiện đồng thời 5 truy vấn: `listPublishedProducts()`, `listPublishedProjects()`, `listPublishedServices()`, `listPublishedNews({ query, pageSize: 30 })`, `listPublishedEvents()`.
   - **Cần kiểm chứng:** Đo lường tải chịu đựng của PostgreSQL database khi có 50–100 request tìm kiếm đồng thời từ bot/crawler; xem xét bổ sung rate limiter hoặc caching layer (`unstable_cache` với tag) cho trang search công khai này.

---

## MỤC F: MA TRẬN PHÂN QUYỀN RBAC & IDOR (RBAC / IDOR MATRIX)

Đã rà soát toàn bộ các thao tác nhạy cảm trên tập hợp các đối tượng quản trị:

| Thao tác (Operation) | Actor: Public / Unauth | Actor: Normal CMS User | Actor: Admin / Superadmin | Bằng chứng mã nguồn bảo vệ |
| :--- | :--- | :--- | :--- | :--- |
| **Tạo tài khoản User** | 401 Unauthorized | 403 Forbidden | Cho phép | `requirePermission('users', 'create')` |
| **Sửa quyền/vai trò User khác** | 401 | 403 Forbidden | Cho phép | `assertRoleAssignmentPrivilege` chặn non-admin gán quyền admin |
| **Sửa tài khoản Admin** | 401 | 403 Forbidden | Cho phép | `assertActorCanManageTargetUser` chặn non-admin can thiệp |
| **Đổi mật khẩu tài khoản khác** | 401 | 403 Forbidden | Chặn nếu non-admin | `updatingPassword && targetUserId !== actor.legacyUserId` chặn đổi mật khẩu chéo |
| **Gửi Reset Password Admin** | 401 | 403 Forbidden | Cho phép | `sendCmsPasswordResetAction` bọc `assertActorCanManageTargetUser` |
| **Xóa User vào Thùng rác** | 401 | 403 Forbidden | Cho phép | `assertActorCanManageTargetUser` + chặn tự xóa bản thân |
| **Khôi phục User từ Thùng rác** | 401 | 403 Forbidden | Cho phép | `restoreTrashRecord` yêu cầu quyền admin đối với mục admin |
| **Bulk Status Update chứa Admin** | 401 | 403 Forbidden | Cho phép | Vòng lặp `updateUserStatuses` kiểm tra từng bản ghi; nếu có bất kỳ Admin nào bị tác động bởi non-admin, toàn bộ transaction rollback |

---

## MỤC G: DANH MỤC HTML SINKS (HTML SINK INVENTORY)

Rà soát toàn bộ các sink HTML trong repository (bao gồm `dangerouslySetInnerHTML`, `innerHTML`, `outerHTML`, `document.write`):

1. **`dangerouslySetInnerHTML` (21 vị trí):**
   - 100% các vị trí hiển thị dynamic content đều đã được bảo vệ bằng `sanitizeHtmlContent` (hoặc các wrapper gọi nó như `cleanPostHtml`, `cleanEventHtml`, `cleanProductHtml`, `cleanCmsHtml`).
   - 1 vị trí script JSON-LD (`src/lib/seo/jsonLd.tsx:21`) sử dụng `safeJsonLdString()` để escape `\u003c` và `</script>`.
2. **`innerHTML` (4 vị trí):**
   - Nằm tại `src/cms/modules/static_pages/visual-canvas/canvasDomInjector.ts`. Đây là client-side DOM injector trong iframe của Visual Canvas CMS (chỉ thực thi trong phiên làm việc admin authenticated, không nhận input trực tiếp từ public user).
3. **Các sink khác (`outerHTML`, `document.write`, `DOMParser`):** Không phát hiện sử dụng trong mã nguồn ứng dụng.

---

## MỤC H: DANH MỤC ĐIỂM TẢI LÊN TỆP & NỘI DUNG ĐỘNG (UPLOAD & ACTIVE CONTENT INVENTORY)

| Điểm tiếp nhận Upload | Tệp mã nguồn | MIME cho phép | Kiểm tra an toàn | Đánh giá Red-Team |
| :--- | :--- | :--- | :--- | :--- |
| **Editor Image Upload** | `src/app/api/upload/route.ts` | JPEG, PNG, WebP, AVIF, GIF, SVG, ICO | `assertSafeSvgFile` | **DEFECTIVE:** Cho phép SVG lọt qua nếu dùng XML Entity hoặc Whitespace |
| **CMS Media Upload** | `src/features/media/server/actions.ts:29` | Image, Video, PDF, Docs | `assertSafeSvgFile` | **DEFECTIVE:** Tương tự như trên đối với các tệp SVG |
| **CMS Media Replace** | `src/features/media/server/actions.ts:40` | Khớp MIME tệp gốc | `assertSafeSvgFile` | **DEFECTIVE:** Tương tự như trên đối với các tệp SVG |
| **Local Image Delivery** | `src/app/images/[...path]/route.ts` | Static images & SVG | Header attachment & sandbox CSP | **DEFENSIVE LAYER:** Phục vụ an toàn từ local disk |
| **Supabase Media Proxy** | `src/app/api/media/[id]/route.ts` | Dynamic assets | 307 Redirect sang Supabase Signed URL (`download: true` cho SVG) | **DEFENSIVE LAYER:** Buộc tải về, tuy nhiên header redirect không bảo vệ nếu browser xem trực tiếp signed URL |

---

## MỤC I: ĐÁNH GIÁ CƠ SỞ DỮ LIỆU & TRUY VẤN SQL (DATABASE / INJECTION REVIEW)

- **Sử dụng Parameterized Query:** Toàn bộ các truy vấn qua `sql` (postgres tag) đều sử dụng tham số hóa tự động.
- **Sử dụng `sql.unsafe`:**
  - Rà soát kỹ lưỡng các file `src/features/trash/server/adapters/*.ts`, `src/features/news/server/*.ts`, và `src/features/news-categories/server/*.ts`.
  - Toàn bộ các vị trí gọi `sql.unsafe` đều sử dụng tên bảng tĩnh từ hàm ánh xạ ngôn ngữ `tables(locale)` (chỉ trả về `'cic_news'` hoặc `'cic_news_en'`).
  - Danh sách cột động trong các adapter phục hồi thùng rác đều được kiểm tra nghiêm ngặt bằng regex:
    ```ts
    columns.some(column => !/^[_a-z][_a-z0-9]*$/i.test(column))
    ```
  - Mọi giá trị dữ liệu đều được truyền qua mảng tham số vị trí `$1, $2, ...`.
  - **Kết luận:** Không phát hiện lỗ hổng SQL Injection.

---

## MỤC J: ĐÁNH GIÁ CSRF & QUẢN LÝ PHIÊN (CSRF / SESSION REVIEW)

1. **State-Changing GET Endpoints:**
   - Đã kiểm tra toàn bộ 17 hàm `export async function GET` trong các Route Handlers.
   - Không có bất kỳ endpoint GET nào thực hiện thay đổi trạng thái cơ sở dữ liệu.
2. **Server Actions CSRF:**
   - Server Actions trong Next.js tự động kiểm tra header `Host` và `Origin`.
3. **Cookie Attributes:**
   - Cookie xác thực của Supabase (`@supabase/ssr`) được cấu hình mặc định với `SameSite=Lax`, ngăn chặn việc trình duyệt tự động đính kèm cookie trong các request POST chéo trang (Cross-site POST).
4. **CORS:**
   - `next.config.ts` không bật `Access-Control-Allow-Origin: *`, chặn hoàn toàn việc các trang web độc hại đọc trộm dữ liệu API qua CORS.

---

## MỤC K: ĐÁNH GIÁ CÔ LẬP DỮ LIỆU & TRẠNG THÁI XUẤT BẢN (PUBLICATION & DATA ISOLATION)

1. **Ranh giới Draft vs Published:**
   - `listPublishedProducts`, `getPublishedProductBySlug`, `getPublishedProductById`: Bắt buộc điều kiện `published = true`.
   - `listPublishedEvents`, `getPublishedEventBySlug`: Bắt buộc điều kiện `published = true`.
   - `listPublishedNews`, `getPublishedNewsBySlug`: Bắt buộc `n.published = true AND c.published = true`.
   - Người dùng công khai không thể truy cập bài viết, sự kiện hoặc sản phẩm ở trạng thái nháp (draft) bằng cách đoán slug hoặc id.
2. **Ranh giới Ngôn ngữ (VI vs EN):**
   - Các bảng cơ sở dữ liệu tiếng Anh (`cic_news_en`, `cic_event_en`, `cic_services_en`) được tách biệt độc lập bằng adapter bảng tĩnh, không bị rò rỉ dữ liệu qua lại giữa 2 locale.

---

## MỤC L: ĐÁNH GIÁ RATE LIMITING & TRUSTED PROXY (RATE-LIMIT REVIEW)

1. **Trích xuất IP (`getClientIp`):**
   - Thứ tự ưu tiên: `cf-connecting-ip > x-real-ip > x-forwarded-for`.
   - Đã áp dụng `isIP()` chuẩn để loại bỏ chuỗi không hợp lệ.
   - **Giả định hạ tầng:** Nếu kẻ tấn công kết nối trực tiếp vào Port của Web Server (bỏ qua Cloudflare Reverse Proxy), kẻ tấn công có thể tự do giả mạo các header này để thay đổi IP nhận diện. Cần thiết lập Cloudflare Authenticated Origin Pulls hoặc Firewall chặn direct port access.
2. **Rủi ro cạn kiệt bộ nhớ:** Đã nêu chi tiết tại `FINDING SEC-A002`.

---

## MỤC M: ĐÁNH GIÁ CHẤT LƯỢNG TEST SUITE BẢO MẬT (TEST QUALITY REVIEW)

Đánh giá chi tiết file kiểm thử `scripts/verify-security-remediation.ts`:

- **Phát hiện đánh giá chất lượng (Test Suite Blindspots):**
  1. **Tự viết lại hàm (Mocked logic):** Các bài test rate-limit từ dòng 102–153 trong `verify-security-remediation.ts` **không gọi code thật** trong `src/server/auth/rate-limit.ts` (do file gốc có `import 'server-only'`), mà định nghĩa một hàm giả lập cục bộ `testRateLimit` và `testExtractIp`. Do đó, test suite không hề kiểm tra hành vi thực tế của module rate limit trên production.
  2. **Thiếu kiểm thử hành vi thời gian chạy (Runtime properties):**
     - 0 test kiểm tra RBAC hierarchy (`assertActorCanManageTargetUser`).
     - 0 test kiểm tra cache invalidation (`invalidateCmsPrincipalCache`).
     - 0 test kiểm tra endpoint upload thực tế (`/api/upload`).
     - 0 test kiểm tra bypass SVG qua XML entity.
  3. **Kết luận:** Kết quả `39/39 PASS` của test suite cũ là **FALSE SENSE OF CONFIDENCE** (Chỉ kiểm tra các chuỗi payload cơ bản được hardcode sẵn).

---

## MỤC N: LỘ LỌT DỮ LIỆU TRONG LỊCH SỬ GIT (GIT HISTORY REVIEW)

- **Kết quả kiểm tra Git Log:**
  - Commit `c782eadd0f9320b78c67df4df72acc28e199a009` (Thu Jul 30 2026): Thêm các file `db_migrate/cic14005_cic_fs.sql`, `cic14005_cic_fs_data.sql`, `export_data.sql`, `migration_data.sql`.
  - Commit `32128de06f0ac203382eede826f1a7ab90cc99f5` (Mon Aug 17 2026): Thêm `db_migrate/export_data.sql`.
- **Yêu cầu an ninh bắt buộc:**
  `SECRET ROTATION REQUIRED`
  1. Đổi toàn bộ mật khẩu, API keys, database credentials và Supabase service keys đã từng xuất hiện trong các file dump này.
  2. Sử dụng công cụ chuyên dụng (`git-filter-repo` hoặc BFG Repo-Cleaner) để xóa triệt để các commit chứa tệp dump khỏi lịch sử Git trước khi đưa lên public/shared repository.

---

## MỤC O: CÁC RỦI RO TỒN ĐỌNG (RESIDUAL RISKS)

1. **Đồng bộ Cache Trong Môi Trường Multi-Instance:**
   `principalCache` và `userAuthCache` lưu trên RAM của từng Node process. Nếu chạy nhiều container/cluster, việc xóa cache trên một máy sẽ không lập tức làm mới trên các máy khác (chênh lệch tối đa 30 giây TTL).
2. **Next.js In-line CSP:**
   CSP vẫn giữ `'unsafe-inline'` cho script và style để phục vụ Hydration của Next.js SSR.

---

## MỤC P: PHÁN QUYẾT CUỐI CÙNG (FINAL VERDICT)

Căn cứ trên các bằng chứng kỹ thuật và lỗ hổng đối kháng vừa phát hiện:

```text
================================================================================
FINAL VERDICT:
NEEDS_SECURITY_FIXES
================================================================================
```

### Lý do phán quyết:
1. **Lỗ hổng `SEC-A001` (Bypass bộ kiểm duyệt SVG):** `isDangerousSvg` không thể phát hiện các payload XSS sử dụng XML Entity Encoding (`jav&#x61;script:`) và khoảng trắng/xuống dòng trong event handlers.
2. **Lỗ hổng `SEC-A002` (Memory Exhaustion & Event Loop Starvation trong Rate Limiter):** Bộ lưu trữ in-memory không có giới hạn dung lượng và thuật toán dọn dẹp đồng bộ dễ bị khai thác DoS.
3. **Lỗ hổng `SEC-A003` (Git History Secret Exposure):** Lịch sử Git vẫn lưu giữ các file dump cơ sở dữ liệu nhạy cảm, vi phạm nguyên tắc an toàn dữ liệu.
4. **Test Suite Blindspots:** Bộ kiểm thử bảo mật `verify-security-remediation.ts` có các đoạn code giả lập (mocked logic) và tạo ra sự tự tin sai lệch (`false confidence`).
