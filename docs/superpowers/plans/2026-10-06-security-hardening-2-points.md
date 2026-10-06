# Security Hardening: Error Leakage Prevention & Open Redirect Safeguards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Triển khai 2 điểm tối ưu bảo mật đã phát hiện trong quá trình Security Audit: (1) Ngăn chặn rò rỉ thông tin lỗi/schema nội bộ qua API Route Handlers bằng cơ chế `createSafeErrorResponse`, và (2) Triệt tiêu nguy cơ Open Redirect qua giao thức tương đối (`//...`) đồng thời bổ sung cảnh báo trực quan cho Redirects trỏ ra ngoài tên miền trong CMS SEO.

**Architecture:** 
1. Xây dựng utility `createSafeErrorResponse` trong `@/server/errors` với phân tầng theo môi trường (`NODE_ENV === 'production'`), tự động ánh xạ mã lỗi `AppError` và che giấu các ngoại lệ DB/Postgres thô đối với người dùng cuối, đồng thời áp dụng cho các API endpoint công khai và nhạy cảm (`/api/forms/submit`, `/api/upload`, `/api/cta/[code]`).
2. Cập nhật schema `redirectInputSchema` và Server Action `saveRedirect` trong `@/features/function-seo`: chặn đứng URL giao thức tương đối (`//...`), chuẩn hóa logic kiểm tra tại route công khai `[slug]/page.tsx`, và tích hợp cảnh báo External Domain trực tiếp trên UI `RedirectWorkspaceTab.tsx`.

**Tech Stack:** Next.js (App Router, Server Actions, Route Handlers), TypeScript, Zod, Tailwind CSS, Lucide Icons.

---

## Global Constraints
- Tuân thủ quy trình Git đã định nghĩa: `pull -> code -> commit -> pull -> push`.
- Không làm gián đoạn hoặc phá vỡ các chức năng hiện có của Form Submission và SEO Redirects.
- Bảo toàn thông tin lỗi chi tiết trong console server (`console.error`) để phục vụ giám sát và gỡ lỗi.

---

### Task 1: Xây dựng Safe Error Response Utility cho API Routes

**Files:**
- Modify: `src/server/errors/index.ts`
- Modify: `src/app/api/forms/submit/route.ts`
- Modify: `src/app/api/cta/[code]/route.ts`
- Modify: `src/app/api/upload/route.ts`

**Interfaces:**
- Produces: `createSafeErrorResponse(error: unknown, fallbackMessage?: string, defaultStatus?: number): NextResponse`

- [ ] **Step 1: Mở rộng `src/server/errors/index.ts` với hàm `createSafeErrorResponse`**
  - Kiểm tra `error instanceof AppError`: nếu là lỗi người dùng an toàn (`VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `RATE_LIMITED`), trả về mã HTTP tương ứng và message.
  - Nếu là lỗi không xác định / DB exception: trong production trả về thông điệp fallback an toàn (`"Có lỗi xảy ra trên hệ thống. Vui lòng thử lại sau."`), trong non-production trả về `error.message` để lập trình viên tiện debug.
  - Ghi log chi tiết ra server bằng `console.error('[API Error]', error)`.

- [ ] **Step 2: Áp dụng `createSafeErrorResponse` vào `src/app/api/forms/submit/route.ts`**
  - Thay thế khối `catch (error: unknown)` hiện tại bằng `return createSafeErrorResponse(error, 'Có lỗi xảy ra khi gửi biểu mẫu.');`.

- [ ] **Step 3: Áp dụng `createSafeErrorResponse` vào `src/app/api/cta/[code]/route.ts` và `src/app/api/upload/route.ts`**
  - Đảm bảo các route này không leak raw error khi gặp sự cố database hoặc lưu trữ.

- [ ] **Step 4: Chạy TypeScript check để đảm bảo không có lỗi type**
  - Chạy `npx tsc --noEmit` hoặc kiểm tra các file liên quan.

---

### Task 2: Chặn Protocol-Relative Open Redirect và Thêm Cảnh Báo External Domain trong Function SEO

**Files:**
- Modify: `src/features/function-seo/schemas/redirectInput.ts`
- Modify: `src/features/function-seo/server/actions.ts`
- Modify: `src/app/(public)/[slug]/page.tsx`
- Modify: `src/cms/modules/function_seo/components/RedirectWorkspaceTab.tsx`

**Interfaces:**
- Consumes: `redirectInputSchema`
- Produces: Ngăn chặn triệt để `targetPath.startsWith('//')`, hiển thị cảnh báo UI khi `targetPath` trỏ ra domain ngoài (`http://`, `https://`).

- [ ] **Step 1: Cập nhật `src/features/function-seo/schemas/redirectInput.ts`**
  - Thêm điều kiện `.refine((val) => !val.startsWith('//'), { message: 'URL không được sử dụng tiền tố // (protocol-relative URL).' })` cho cả `sourcePath` và `targetPath`.

- [ ] **Step 2: Cập nhật `src/features/function-seo/server/actions.ts`**
  - Đảm bảo `saveRedirect` kiểm tra loại bỏ các tiền tố nguy hiểm và hỗ trợ định dạng URL đích chuẩn.

- [ ] **Step 3: Cập nhật route công khai `src/app/(public)/[slug]/page.tsx`**
  - Kiểm tra `redirectMatch.targetPath`: nếu bắt đầu bằng `//`, từ chối chuyển hướng để tránh bypass Open Redirect.

- [ ] **Step 4: Bổ sung cảnh báo trực quan trong `RedirectWorkspaceTab.tsx`**
  - Khi người dùng nhập `targetPath` có tiền tố `http://` hoặc `https://`, hiển thị thông báo nhãn vàng (Amber Badge / Alert) bên dưới ô nhập: *"Lưu ý: URL đích trỏ ra ngoài tên miền website (External Redirect). Vui lòng đảm bảo đích đến an toàn và tin cậy."*
  - Trong bảng danh sách redirects, nếu URL mới là external domain, thêm biểu tượng `ExternalLink` nhỏ để người quản trị dễ dàng nhận diện.

---

### Task 3: Kiểm thử toàn diện và Kiểm tra Git

**Files:**
- Toàn bộ các file đã chỉnh sửa.

- [ ] **Step 1: Kiểm tra tính đúng đắn của code (Type check & Build dry run)**
  - Chạy `npm run build` hoặc `npx tsc --noEmit` để xác nhận toàn bộ hệ thống biên dịch sạch sẽ không có lỗi.

- [ ] **Step 2: Xác nhận hoạt động trên dev server**
  - Kiểm tra API Route handler và giao diện CMS Redirects.

- [ ] **Step 3: Thực hiện quy trình Git chuẩn**
  - Commit thay đổi: `git add . && git commit -m "fix(security): harden error leakage in api routes and prevent open redirect vectors"`
  - Pull kiểm tra conflict: `git pull origin main`
  - Push lên repository: `git push origin main`
