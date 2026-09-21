# BÁO CÁO HIỆU NĂNG & CORE WEB VITALS (LAB & FIELD DATA)

> **Dự án**: CIC Technology Web Portal  
> **Thời gian đo lường**: 21/09/2026  
> **Công cụ đo**: Playwright Chromium (Headless) + Navigation/PerformanceObserver Timing API.  
> **Môi trường đo**: Next.js 16.3.3 Turbopack Local Runtime (http://localhost:3000).  
> **Tiêu chuẩn**: Google Web Vitals & addyosmani/web-quality-skills.

---

## 1. PHÂN LOẠI DỮ LIỆU ĐO LƯỜNG (EVIDENCE CLASSIFICATION)

- **LAB DATA (Phòng thí nghiệm)**: **`RUNTIME VERIFIED`**
  - Thực thi tự động trên 6 template trang trọng yếu (Home, Products, Product Detail, News, News Detail, About).
  - Thu thập qua PerformanceObserver chuẩn W3C cho FCP, LCP, CLS, TTFB, DOMContentLoaded và Resource Transfer Payload.
- **FIELD DATA (Thực tế người dùng - CrUX / Google Search Console)**: **`NOT VERIFIED`**
  - Không có quyền truy cập Google Search Console / Chrome User Experience Report (CrUX) chính thức của domain production tại thời điểm audit. Các chỉ số Field Data cần được theo dõi liên tục sau khi triển khai production.

---

## 2. BẢNG KẾT QUẢ ĐO ĐẠC LAB METRICS THEO THIẾT BỊ

### 2.1 Cấu hình Máy tính để bàn (Desktop - Viewport 1366 x 768)

| Trang kiểm tra (Route) | HTTP Status | TTFB (ms) | FCP (ms) | LCP (ms) | LCP Element | CLS | Total Payload (KB) | Image Payload (KB) | JS Payload (KB) |
| :--- | :---: | :---: | :---: | :---: | :--- | :---: | :---: | :---: | :---: |
| **Trang chủ (`/`)** | 200 | 172 | 1,604 | 11,856 | `DIV.whitespace-nowrap` | **0.0043** | 13,176 KB | 6,556 KB | 1,131 KB |
| **Danh mục SP (`/products`)** | 200 | 131 | 1,368 | 5,468 | `H1.text-4xl` | **0.0088** | 1,234 KB | 78 KB | 1,118 KB |
| **Chi tiết SP (`/products/geostudio`)** | 200 | 272 | 1,200 | 2,944 | `IMG.object-contain` | **0.0016** | 2,074 KB | 890 KB | 1,118 KB |
| **Trang Tin tức (`/news`)** | 200 | 251 | 1,132 | 1,784 | `IMG.absolute` | **0.0000** | 3,333 KB | 2,165 KB | 1,129 KB |
| **Chi tiết Tin (`/news/plaxis-...`)** | 200 | 244 | 1,428 | 3,096 | `P.text-sm` | **0.0047** | 3,866 KB | 2,670 KB | 1,129 KB |
| **Giới thiệu (`/gioi-thieu`)** | 200 | 618 | 2,064 | 6,284 | `IMG.object-cover` | **0.0011** | **26,778 KB** | **14,071 KB** | 1,198 KB |

### 2.2 Cấu hình Di động (Mobile - iPhone 14 Viewport 390 x 844)

| Trang kiểm tra (Route) | HTTP Status | TTFB (ms) | FCP (ms) | LCP (ms) | LCP Element | CLS | Total Payload (KB) | Image Payload (KB) | JS Payload (KB) |
| :--- | :---: | :---: | :---: | :---: | :--- | :---: | :---: | :---: | :---: |
| **Trang chủ (`/`)** | 200 | 378 | 2,148 | 6,400 | `IMG.h-16` | **0.0241** | 13,176 KB | 6,556 KB | 1,131 KB |
| **Danh mục SP (`/products`)** | 200 | 173 | 1,400 | 10,268 | `P.text-slate-600` | **0.0000** | 1,207 KB | 50 KB | 1,118 KB |
| **Chi tiết SP (`/products/geostudio`)** | 200 | 275 | 1,652 | 3,020 | `IMG.object-contain` | **0.0000** | 2,046 KB | 890 KB | 1,118 KB |
| **Trang Tin tức (`/news`)** | 200 | 165 | 1,060 | 4,328 | `IMG.absolute` | **0.0000** | 3,048 KB | 1,880 KB | 1,129 KB |
| **Chi tiết Tin (`/news/plaxis-...`)** | 200 | 213 | 1,092 | 3,132 | `P.text-sm` | **0.0023** | 3,866 KB | 2,670 KB | 1,129 KB |
| **Giới thiệu (`/gioi-thieu`)** | **Timeout** | 207 | 4,380 | 10,192 | `IMG.object-cover` | **0.0000** | **20,128 KB** | **14,071 KB** | 1,198 KB |

---

## 3. ĐÁNH GIÁ CHỈ SỐ CORE WEB VITALS SO VỚI TIÊU CHUẨN GOOGLE

### 3.1 Cumulative Layout Shift (CLS) — **ĐẠT XUẤT SẮC (GOOD)**
- **Tiêu chuẩn Google**: Tốt khi CLS ≤ 0.1; Cần cải thiện: 0.1 - 0.25; Kém: > 0.25.
- **Thực tế CIC**: **CLS nằm trong khoảng 0.0000 - 0.0241** trên cả Desktop và Mobile.
- **Nhận định**: Giao diện Tailwind CSS có khung bao cố định tốt, hầu như không bị giật nhảy layout khi tải trang.

### 3.2 Time to First Byte (TTFB) — **ĐẠT TỐT (GOOD)**
- **Tiêu chuẩn Google**: Tốt khi TTFB ≤ 800ms.
- **Thực tế CIC**: **TTFB đạt 131ms - 378ms** (Ngoại trừ lần tải đầu cold-cache của `/gioi-thieu` đạt 618ms).
- **Nhận định**: Kiến trúc Next.js SSR kết hợp PostgreSQL queries xử lý tốt, thời gian phản hồi server đáp ứng chuẩn của Googlebot.

### 3.3 First Contentful Paint (FCP) — **KHÁ (NEEDS IMPROVEMENT ĐẾN GOOD)**
- **Tiêu chuẩn Google**: Tốt khi FCP ≤ 1.8s; Cần cải thiện: 1.8s - 3.0s.
- **Thực tế CIC**:
  - Hầu hết các trang đạt 1.0s - 1.6s (Đạt mức Tốt).
  - Trang Giới thiệu `/gioi-thieu` trên Mobile đạt 4.38s (Mức Kém) do render-blocking assets.

### 3.4 Largest Contentful Paint (LCP) — **NGHIÊM TRỌNG (POOR)**
- **Tiêu chuẩn Google**: Tốt khi LCP ≤ 2.5s; Cần cải thiện: 2.5s - 4.0s; Kém: > 4.0s.
- **Thực tế CIC**:
  - Desktop: 1.78s - 11.85s (Trang chủ và Giới thiệu vượt ngưỡng nghiêm trọng).
  - Mobile: 3.02s - 10.26s (100% các trang vượt ngưỡng 2.5s).
- **Nguyên nhân cốt lõi**:
  1. Frontend sử dụng thẻ `<img>` HTML thuần, không có srcset kích thước phù hợp màn hình mobile.
  2. Trang `/gioi-thieu` tải trực tiếp **14 MB hình ảnh** gốc không nén.
  3. Thiếu thuộc tính `fetchpriority="high"` cho hình ảnh Hero đầu trang.
  4. Trọng lượng JavaScript bundle khá lớn (~1.1 MB uncompressed trên môi trường dev).

---

## 4. CHI TIẾT TÀI NGUYÊN & ĐỀ XUẤT TỐI ƯU HÓA TÀI NGUYÊN

### 4.1 Bảng phân tích Payload theo loại tài nguyên
| Loại tài nguyên | Dung lượng trung bình | Đánh giá | Đề xuất khắc phục |
| :--- | :---: | :---: | :--- |
| **Hình ảnh (Images)** | 5 MB - 14 MB | **RẤT NẶNG (POOR)** | Thay thế bằng `next/image`, kích hoạt WebP/AVIF tự động, lazy load off-screen |
| **JavaScript (Scripts)** | ~1.1 MB | Trung bình | Code-splitting, dynamic imports cho các modal và sliders |
| **CSS Stylesheets** | 39 KB - 67 KB | **XUẤT SẮC (GOOD)** | Tailwind CSS compile gọn gàng, không có CSS thừa |

### 4.2 Hành động kỹ thuật bắt buộc để đưa LCP về < 2.5s:
1. **Chuyển đổi toàn bộ thẻ `<img>` sang `next/image`**: Tự động chuyển đổi WebP/AVIF và tự động thu nhỏ theo viewport di động.
2. **Kích hoạt `priority` cho Hero Banner**: Thêm thuộc tính `priority` vào ảnh đại diện đầu trang để browser preload ngay lập tức.
3. **Thêm Cache-Control HTTP Headers**: Cấu hình static asset cache `max-age=31536000, immutable` trong `next.config.ts`.
