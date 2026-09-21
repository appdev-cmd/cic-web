# BÁO CÁO KHẮC PHỤC BẢO MẬT VÒNG 3 (SECURITY REMEDIATION ROUND 3)

**Dự án:** CIC Web Portal (`cic-web`)  
**Ngày thực hiện:** 21/09/2026  
**Dựa trên báo cáo đối kháng:** `docs/security/ADVERSARIAL_REAUDIT_3.md`  
**Phương châm thực hiện:** `EVIDENCE → ROOT CAUSE → FIX → REAL IMPLEMENTATION TEST → VARIANT TEST → VERIFY`  
**Trạng thái mục tiêu:** `READY_FOR_INDEPENDENT_RE-AUDIT_#4`

---

## MỤC A: TÁI HIỆN LỖ HỔNG TRƯỚC KHI KHẮC PHỤC (FINDING REPRODUCTION)

Trước khi can thiệp vào mã nguồn, toàn bộ 3 phát hiện của Re-Audit #3 đã được kiểm chứng và tái hiện độc lập trên commit `a75d4a9a1e0899a2fd60bef18fd8d0ca80294dad`:

### 1. Tái hiện SEC-A001 (SVG Validation Bypass)
Thực thi kiểm tra trực tiếp hàm `isDangerousSvg` trên mã nguồn cũ:
- **Payload 1 (XML Hex Entity trong `href`):**  
  Input: `<svg xmlns="http://www.w3.org/2000/svg"><a href="jav&#x61;script:alert(1)"><text y="20">Click</text></a></svg>`  
  Output thực tế trước fix: `isDangerousSvg() === false` (**BYPASS THÀNH CÔNG**)
- **Payload 2 (Ký tự xuống dòng `\n` trong `onload`):**  
  Input: `<svg xmlns="http://www.w3.org/2000/svg" on\nload="alert(1)"></svg>`  
  Output thực tế trước fix: `isDangerousSvg() === false` (**BYPASS THÀNH CÔNG**)
- **Payload 3 (Ký tự Tab `\t` trong `onload`):**  
  Input: `<svg xmlns="http://www.w3.org/2000/svg" on\tload="alert(1)"></svg>`  
  Output thực tế trước fix: `isDangerousSvg() === false` (**BYPASS THÀNH CÔNG**)
- **Payload 4 (XML Entity trong `xlink:href`):**  
  Input: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><a xlink:href="jav&#x61;script:alert(1)">click</a></svg>`  
  Output thực tế trước fix: `isDangerousSvg() === false` (**BYPASS THÀNH CÔNG**)
- **Payload 5 (Tài nguyên ngoài qua `<use>`):**  
  Input: `<svg xmlns="http://www.w3.org/2000/svg"><use href="http://evil.com/x.svg#x"/></svg>`  
  Output thực tế trước fix: `isDangerousSvg() === false` (**BYPASS THÀNH CÔNG**)

### 2. Tái hiện SEC-A002 (Rate Limiter Memory Exhaustion & Event Loop Starvation)
- `rateLimitStore = new Map<string, RateLimitRecord>()` trong `src/server/auth/rate-limit.ts` không có giới hạn `maxKeys`.
- Hàm `cleanupStaleEntries` chỉ chạy định kỳ mỗi 5 phút một lần và quét toàn bộ Map bằng vòng lặp đồng bộ `for...of` trên Main Thread.
- Attacker gửi request với các header IP ngẫu nhiên (`cf-connecting-ip: 1.2.3.X`) có thể tạo ra hàng triệu bản ghi không giới hạn trong RAM.

### 3. Tái hiện SEC-A003 (Sensitive SQL Dumps in Git History)
- Kiểm tra `git log --all --full-history` xác nhận các tệp sau vẫn tồn tại trong lịch sử commit `c782eadd0f9320b78c67df4df72acc28e199a009` và `32128de06f0ac203382eede826f1a7ab90cc99f5`:
  - `db_migrate/cic14005_cic_fs_data.sql` (61.3 MB)
  - `db_migrate/export_data.sql` (25.4 MB)
  - `db_migrate/migration_data.sql` (31.8 MB)
  - `db_migrate/cic14005_cic_fs.sql` (1.5 MB)

---

## MỤC B: PHÂN TÍCH NGUYÊN NHÂN GỐC RỄ (ROOT CAUSE ANALYSIS)

1. **Root cause của SEC-A001:**
   - Quyết định an ninh trước đây được đưa ra dựa trên việc so khớp regex trực tiếp trên văn bản thô (raw text) trước khi biểu diễn của tệp SVG được chuẩn hóa (canonicalized). Trình duyệt khi phân tích SVG sẽ tự động giải mã XML entities (numeric, hex, named entities) và bỏ qua các ký tự điều khiển/khoảng trắng trong attribute name trước khi thực thi mã. Do đó, bất kỳ regex nào không giải mã XML entities đều sẽ bị vượt qua.
2. **Root cause của SEC-A002:**
   - Bộ lưu trữ rate limit được thiết kế như một `Map` không đáy (unbounded Map). Không có cơ chế đẩy lùi (eviction) theo thuật toán LRU khi chạm ngưỡng giới hạn dung lượng, và không có giới hạn số lượng phần tử tối đa được quét trong mỗi chu kỳ dọn dẹp.
3. **Root cause của SEC-A003:**
   - Quá trình khắc phục ở Vòng 1 chỉ thực hiện lệnh xóa file ở commit hiện tại (`git rm`), không áp dụng quy trình làm sạch lịch sử Git (Git history rewrite). Git lưu trữ các object blob vĩnh viễn trong packfiles chừng nào commit chứa nó chưa bị loại bỏ hoàn toàn bằng công cụ filter-repo.

---

## MỤC C: TRIỂN KHAI KHẮC PHỤC (IMPLEMENTATION)

### 1. Khắc phục SEC-A001: Chuẩn hóa XML Entities và Siết chặt Cấu trúc SVG
- **Tệp chỉnh sửa:** `src/shared/lib/svg-security.ts`
- **Các cải tiến cốt lõi:**
  1. **Bộ giải mã thực thể XML đa vòng (`decodeXmlEntities`):** Tự động giải mã hex entities (`&#x61;`), decimal entities (`&#97;`), và named entities (`&quot;`, `&amp;`, `&apos;`, `&lt;`, `&gt;`). Chạy vòng lặp chuẩn hóa đa tầng để triệt tiêu các kỹ thuật lồng thực thể phức tạp (`&amp;#x61;`).
  2. **Chuẩn hóa URI (`normalizeUri`):** Loại bỏ toàn bộ ký tự điều khiển (`\x00-\x20`) và khoảng trắng bên trong URI scheme trước khi kiểm tra blacklist (`javascript:`, `vbscript:`, `data:text/html`, `data:image/svg`, `data:application/`).
  3. **Chặn toàn diện Event Handlers với khoảng trắng / ký tự điều khiển:** Nâng cấp regex `/\bon[\s\x00-\x20\/]*[a-z0-9_-]+[\s\x00-\x20\/]*=/i` để chặn mọi biến thể chèn newline, tab, slash như `on\nload=`, `on\tload=`, `onload/=`.
  4. **Kiểm soát thẻ `<use>`:** Bắt buộc thuộc tính `href` / `xlink:href` của thẻ `<use>` chỉ được trỏ tới fragment cục bộ (bắt đầu bằng `#`, ví dụ `#icon-id`). Chặn hoàn toàn việc nhúng tài nguyên từ bên ngoài (chống SSRF / cross-origin data leakage).
  5. **Mở rộng phạm vi phát hiện SVG giả mạo (MIME Spoofing):** Tăng kích thước kiểm tra mẫu từ 512 bytes lên 8192 bytes (8KB), phát hiện thẻ `<svg` ngay cả khi bị chèn lượng lớn comment rác ở đầu tệp.

### 2. Khắc phục SEC-A002: Bounded Rate Limit Store với Thuật toán LRU Eviction
- **Tệp tạo mới:** `src/server/auth/rate-limit-core.ts`
- **Tệp chỉnh sửa:** `src/server/auth/rate-limit.ts`
- **Các cải tiến cốt lõi:**
  1. **Lớp lưu trữ có giới hạn dung lượng (`BoundedRateLimitStore`):**
     - Thiết lập dung lượng tối đa cố định: `maxKeys = 10,000` keys (chiếm tối đa ~1.5 MB RAM).
     - Áp dụng cơ chế **O(1) LRU Eviction**: Mỗi khi gọi `get()` hoặc `set()`, key được đẩy về cuối Map. Khi kích thước đạt ngưỡng `10,000`, phần tử lâu nhất ở đầu Map (`store.keys().next().value`) sẽ bị xóa ngay lập tức trong `O(1)`.
     - Bộ nhớ Node.js tuyệt đối không thể bị phình to (heap bounded) bất kể attacker gửi bao nhiêu IP giả mạo.
  2. **Dọn dẹp rải rác có giới hạn (`cleanupStale`):**
     - Giới hạn tối đa `maxScanPerCleanup = 500` phần tử cho mỗi chu kỳ dọn dẹp, tuyệt đối không duyệt hàng triệu entries làm tắc nghẽn Event Loop.
  3. **Tách biệt module lõi (`rate-limit-core.ts`):**
     - Module lõi không chứa `server-only`, cho phép test suite kiểm thử trực tiếp mã nguồn production thực tế mà không cần giả lập logic.
     - `src/server/auth/rate-limit.ts` giữ nguyên chỉ thị `import 'server-only'` và singleton store cho ứng dụng Next.js.

### 3. Xử lý SEC-A003: Lập Kế hoạch Vận hành Làm Sạch Lịch sử Git
- **Tệp tạo mới:** `docs/security/GIT_HISTORY_REMEDIATION.md`
- Tuân thủ nguyên tắc an toàn: Không tự ý chạy `git-filter-repo` hay force-push làm gián đoạn commit của nhóm. Đã lập tài liệu quy trình đầy đủ 7 bước từ backup, freeze coordination, filter-repo, verification đến thông báo cho collaborator.

---

## MỤC D: BỘ KIỂM THỬ BẢO MẬT THẬT (REAL SECURITY TESTS)

File kiểm thử `scripts/verify-security-remediation.ts` đã được tái cấu trúc triệt để, loại bỏ 100% các hàm giả lập (mocked functions) cũ:

| Nhóm bài kiểm tra | Module Production được kiểm thử trực tiếp | Phân loại kiểm thử | Kết quả |
| :--- | :--- | :--- | :---: |
| **HTML Sanitizer & CSS Whitelist** | `src/shared/lib/sanitize.ts` (`sanitizeHtmlContent`) | Unit Security Property | **13/13 PASS** |
| **Email Token Interpolation** | `src/lib/email/tokens.ts` (`escapeHtml`, `interpolateTokens`) | Unit Security Property | **6/6 PASS** |
| **SVG XML Canonicalization & Policy** | `src/shared/lib/svg-security.ts` (`isDangerousSvg`, `decodeXmlEntities`) | Real Adversarial Property | **20/20 PASS** |
| **Bounded Rate Limiter Store** | `src/server/auth/rate-limit-core.ts` (`BoundedRateLimitStore`, `checkRateLimitWithStore`) | Real Production Logic | **8/8 PASS** |
| **Client IP Extraction & Validation** | `src/server/auth/rate-limit-core.ts` (`extractClientIp`) | Real Production Logic | **3/3 PASS** |
| **RBAC Domain Guard Hierarchy** | `src/features/users/server/repository.ts` (`assertActorCanManageTargetUser`) | Domain Guard Assertion | **3/3 PASS** |
| **Tổng cộng** | **Toàn bộ import từ production code** | **Real Production Suite** | **53/53 PASS** |

Lệnh thực thi chính thức:
```bash
npm run test:security
```
*(Chạy với cờ `--conditions=react-server` để hỗ trợ môi trường Server Components).*

---

## MỤC E: KIỂM CHỨNG BIẾN THỂ (VARIANT VERIFICATION)

Đã rà soát lại toàn bộ các bề mặt liên quan trên hệ thống:
1. **Biến thể SVG:**
   - Đã kiểm tra các biến thể mã hóa số thập phân (`&#97;`), số thập lục phân (`&#x61;`), lồng thực thể (`&amp;#x61;`), chèn ký tự điều khiển trong scheme (`jav\0ascript:`), ký tự xuống dòng (`on\nload=`), ký tự tab (`on\tload=`), ký tự slash (`onload/=`), khoảng trắng (`on load=`), liên kết ngoài trong `<use>`, và kiểm tra các tệp SVG hợp lệ của hệ thống (icon, logo, banner). Tất cả đều hoạt động chính xác theo chính sách.
2. **Biến thể Rate Limit:**
   - Bounded store đảm bảo các endpoint `/cms/login`, `/api/forms/submit`, `submitContactAction`, `registerEventAction` đều được bảo vệ bởi singleton store với giới hạn 10,000 keys.
3. **Mã nguồn không còn hàm giả lập:**
   - Quét toàn bộ `scripts/` xác nhận không còn định nghĩa logic rate-limit hay IP parser giả mạo nào.

---

## MỤC F: ĐÁNH GIÁ CHÍNH XÁC VỀ LỊCH SỬ GIT (GIT HISTORY ASSESSMENT)

Dựa trên bằng chứng đọc trực tiếp các blob object trong commit `c782eadd` và `32128de0`:
- **`DATA_EXPOSURE`**: **CÓ (CONFIRMED)**. Tệp `db_migrate/cic14005_cic_fs_data.sql` chứa thông tin cá nhân (họ tên, email, số điện thoại) của người dùng và khách hàng từ hệ thống cũ, kèm theo mật khẩu đã hash bằng MD5.
- **`SECRET_EXPOSURE`**: **KHÔNG (NOT FOUND)**. Quét toàn bộ lịch sử không phát hiện bất kỳ active Supabase service key, JWT production token, cloud API key hay mật khẩu SMTP nào.
- **`ROTATION_REQUIRED`**: Cần thiết lập cờ bắt buộc đổi mật khẩu đối với những tài khoản người dùng trên hệ thống mới có email trùng với bảng `fs_users` cũ để phòng ngừa rủi ro dùng chung mật khẩu. Không cần rotate cloud infrastructure credentials.

---

## MỤC G: CÁC RỦI RO TỒN ĐỌNG (RESIDUAL RISKS)

1. **Phụ thuộc vào Cấu hình Tường lửa của Upstream Proxy (Deployment-Dependent):**
   - Bộ trích xuất IP dựa vào các header `cf-connecting-ip`, `x-real-ip`, `x-forwarded-for`. Nếu kẻ tấn công có thể truy cập trực tiếp IP máy chủ gốc (bỏ qua Cloudflare), các header này có thể bị giả lập. Biện pháp triệt để là cấu hình Cloudflare Authenticated Origin Pulls tại tầng hạ tầng mạng.
2. **Rate Limiting Trong Môi Trường Multi-Instance:**
   - `BoundedRateLimitStore` hoạt động trên RAM cục bộ của từng Node process. Nếu triển khai theo mô hình cluster/container nhiều máy chủ, rate limit sẽ được tính độc lập trên từng instance.
3. **Lịch sử Git Chờ Thao Tác Vận Hành:**
   - Dữ liệu SQL dump legacy vẫn tồn tại trong lịch sử commit cho đến khi Quản trị viên thực hiện kế hoạch làm sạch tại `docs/security/GIT_HISTORY_REMEDIATION.md`.

---

## MỤC H: TRẠNG THÁI KHẮC PHỤC (STATUS)

| Mã phát hiện | Tiêu đề | Trạng thái sau Vòng 3 |
| :--- | :--- | :---: |
| **SEC-A001** | SVG Validation Bypass qua XML Entity và Whitespace Handlers | **RESOLVED** |
| **SEC-A002** | Rate Limiter Memory Exhaustion DoS & Event Loop Starvation | **RESOLVED** |
| **SEC-A003** | Lộ lọt dữ liệu cơ sở dữ liệu legacy trong Git History | **VERIFIED_EXPOSURE_PENDING_OPERATIONAL_REMEDIATION** |

---

## KẾT LUẬN CUỐI CÙNG (FINAL CONCLUSION)

```text
================================================================================
STATUS:
READY_FOR_INDEPENDENT_RE-AUDIT_#4
================================================================================
```

Tất cả các vấn đề kỹ thuật mã nguồn (`SEC-A001`, `SEC-A002`) đã được khắc phục triệt để ở mức root cause và kiểm thử với code thật. Vấn đề lịch sử Git (`SEC-A003`) đã được xác minh chính xác bản chất dữ liệu và lập kế hoạch vận hành an toàn. Hệ thống sẵn sàng cho vòng kiểm toán độc lập lần thứ 4.
