# Edge Function JWT & Role Validation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Triển khai 2 hạng mục bảo mật trọng yếu còn thiếu: (1) Edge Function Validate JWT và (2) Edge Function Kiểm tra Role/Phân quyền cho Supabase Edge Function `gemini-proxy`.

**Architecture:** 
1. Tích hợp module xác thực trong `supabase/functions/gemini-proxy/index.ts`: Trích xuất `Authorization: Bearer <token>`, xác thực token đối với `SUPABASE_SERVICE_ROLE_KEY` (cho các lệnh gọi nội bộ từ backend server) hoặc qua `supabase.auth.getUser(token)` (đối với JWT người dùng).
2. Kiểm tra cờ danh tính `cms_profile: true` trong `user.app_metadata` để đảm bảo chỉ có cán bộ quản trị CMS đã xác thực mới được quyền kích hoạt AI Gateway.
3. Đồng bộ client gọi phía Next.js tại `src/features/ai-operator/server/llm-provider.ts` để luôn truyền đúng Bearer Token xác thực.

**Tech Stack:** Supabase Edge Functions (Deno Runtime, `@supabase/supabase-js`), TypeScript, Next.js.

---

## Global Constraints
- Tuân thủ quy trình Git: `pull -> code -> commit -> pull -> push`.
- Duy trì khả năng tương thích ngược cho cả lệnh gọi server-to-server và lệnh gọi từ user session.
- Trả về mã lỗi HTTP chuẩn (401 Unauthorized, 403 Forbidden).

---

### Task 1: Bổ sung xác thực JWT và kiểm tra Role trong Edge Function `gemini-proxy`

**Files:**
- Modify: `supabase/functions/gemini-proxy/index.ts`
- Modify: `supabase/functions/gemini-proxy/README.md`

**Interfaces:**
- Consumes: `Authorization` header (`Bearer <token>`), env vars `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
- Produces: 401 nếu thiếu/sai token, 403 nếu không phải CMS user, cho phép thực thi nếu hợp lệ.

- [ ] **Step 1: Cập nhật `supabase/functions/gemini-proxy/index.ts`**
  - Import `createClient` từ `npm:@supabase/supabase-js@2` hoặc `jsr:@supabase/supabase-js@2`.
  - Viết hàm `authenticateRequest(req: Request)`:
    - Lấy header `Authorization`. Nếu không có -> 401 Unauthorized (`Missing Authorization header`).
    - Lấy token: `authHeader.replace(/^Bearer\s+/i, '').trim()`.
    - Kiểm tra `serviceRoleKey`: Nếu token trùng với `Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')`, cho phép ngay.
    - Nếu không trùng, khởi tạo `createClient(supabaseUrl, supabaseAnonKey)` và gọi `supabase.auth.getUser(token)`:
      - Nếu lỗi hoặc không có user -> 401 Unauthorized (`Invalid or expired token`).
      - Nếu user không có cờ `cms_profile` trong `app_metadata` -> 403 Forbidden (`Insufficient privileges: CMS profile required`).

- [ ] **Step 2: Cập nhật script deploy trong `README.md`**
  - Giải thích cơ chế bảo vệ 2 lớp (tầng Gateway + tầng Mã nguồn In-Code Validation).

---

### Task 2: Đồng bộ cấu hình gọi Gateway trong `src/features/ai-operator/server/llm-provider.ts`

**Files:**
- Modify: `src/features/ai-operator/server/llm-provider.ts`

- [ ] **Step 1: Kiểm tra và tối ưu header Authorization trong `SupabaseGeminiGatewayProvider`**
  - Ưu tiên truyền `SUPABASE_SERVICE_ROLE_KEY` nếu có, đảm bảo request gửi đến Edge Function luôn được chứng thực hợp lệ.

---

### Task 3: Kiểm thử và Hoàn tất Git

**Files:**
- Toàn bộ file liên quan.

- [ ] **Step 1: Chạy kiểm thử TypeScript (`npx tsc --noEmit`)**
  - Đảm bảo dự án Next.js biên dịch hoàn toàn sạch sẽ.

- [ ] **Step 2: Chạy unit test của AI Gateway nếu có (`npm run test:ai-gateway`)**

- [ ] **Step 3: Thực hiện quy trình Git chuẩn**
  - `git add . && git commit -m "feat(security): enforce jwt validation and role checking in edge function gemini-proxy"`
  - `git pull origin refactor/nextjs-fullstack`
  - `git push origin refactor/nextjs-fullstack`
