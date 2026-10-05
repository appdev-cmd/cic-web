# Kế hoạch Triển khai Supabase AI Gateway (`gemini-proxy`) cho Hệ thống CMS CIC

> **Mục tiêu:** Xây dựng Edge Function `gemini-proxy` trên Supabase đóng vai trò **AI Gateway** bảo mật và độc lập cho CIC CMS: lưu trữ `GEMINI_API_KEY` tập trung trong Supabase Secrets, kiểm soát chặt chẽ operations/chi phí, chống timeout mạng, tích hợp liền mạch với Next.js Server DAL hiện có mà không làm thay đổi bất kỳ luồng thao tác UX nào của cán bộ CMS.

---

## 1. Kiến trúc Tổng thể (Hybrid AI Gateway)

```mermaid
flowchart TD
    subgraph Client ["CMS Frontend (Browser)"]
        User["Cán bộ CMS"]
        Form["Form Sản phẩm / Tin tức"]
        Button["Bấm 'Tự động điền phần còn lại với AI' / Đũa thần"]
    end

    subgraph NextServer ["Next.js Server DAL (Vercel / Node.js)"]
        Action["Server Action (actions.ts / shared-actions.ts)"]
        AuthCheck["Kiểm tra quyền: requireCmsAccess()"]
        Audit["Ghi nhận Audit: writeAuditEvent()"]
        Provider["LlmProvider: SupabaseAiGatewayProvider"]
    end

    subgraph SupabaseEdge ["Supabase Edge Function (Deno Deploy)"]
        Gateway["AI Gateway (gemini-proxy)"]
        Secrets["Supabase Secrets: GEMINI_API_KEY"]
        OpRouter["Operation Router & Guardrails"]
        RateLimit["Rate Limiting & Token Cap"]
    end

    subgraph GoogleAI ["Google Cloud"]
        Gemini["Gemini 2.5 Flash / Lite API"]
    end

    User -->|Nhập anchor fields| Form
    Form -->|Kích hoạt| Button
    Button -->|Gọi Server Action| Action
    Action --> AuthCheck
    AuthCheck --> Audit
    Audit --> Provider
    Provider -->|HTTP POST JSON (operation, input)| Gateway
    Gateway --> OpRouter
    OpRouter --> RateLimit
    RateLimit --> Secrets
    Secrets --> Gemini
    Gemini -->|Trả kết quả| Gateway
    Gateway -->|Chuẩn hóa JSON đề xuất| Provider
    Provider -->|Trả về UI| Form
    Form -->|Cán bộ xem trước -> Lưu| DB[("Database PostgreSQL")]
```

---

## 2. Danh sách các File được tạo & chỉnh sửa

| STT | Đường dẫn File | Trách nhiệm |
| :---: | :--- | :--- |
| 1 | `supabase/functions/gemini-proxy/index.ts` | Edge Function chính (Deno runtime): AI Gateway xử lý định tuyến operation, prompt guardrail, gọi Google Gemini với `GEMINI_API_KEY` từ Supabase Secrets. |
| 2 | `supabase/functions/gemini-proxy/operations.ts` | Định nghĩa logic nghiệp vụ, system instructions, temperature, cấu trúc JSON cho từng operation (`product.prefill`, `content.enrich`, `seo.optimize`). |
| 3 | `src/features/ai-operator/server/llm-provider.ts` | Bổ sung class `SupabaseAiGatewayProvider` kế thừa `LlmProvider`, định tuyến qua Edge Function và tự động fallback nếu mạng gián đoạn. |
| 4 | `src/features/ai-operator/server/actions.ts` | Bổ sung hỗ trợ gateway operation metadata, đảm bảo phân quyền RBAC và luồng audit log nhất quán. |
| 5 | `scripts/test-ai-gateway.mjs` | Script kiểm thử độc lập kiểm tra kết nối, định tuyến operation, xác thực bảo mật và khả năng phục hồi lỗi của AI Gateway. |
| 6 | `package.json` | Bổ sung script chạy test AI Gateway (`npm run test:ai-gateway`). |

---

## 3. Các bước triển khai chi tiết (Bite-sized Tasks)

### Task 1: Xây dựng Supabase Edge Function `gemini-proxy`
- [ ] Tạo thư mục `supabase/functions/gemini-proxy`.
- [ ] Viết `operations.ts`: Định nghĩa danh mục operations cho phép (`product.prefill`, `field.enrich`, `raw.generate`), giới hạn token, nhiệt độ (temperature) và schema đầu ra JSON.
- [ ] Viết `index.ts`: Xử lý CORS, kiểm tra token xác thực, tiếp nhận `{ operation, input }`, kiểm tra guardrails, gọi Google Gemini API và trả về JSON chuẩn hóa.

### Task 2: Tích hợp `SupabaseAiGatewayProvider` vào Next.js Server DAL
- [ ] Cập nhật `src/features/ai-operator/server/llm-provider.ts`:
  - Thêm class `SupabaseAiGatewayProvider` kết nối tới `${NEXT_PUBLIC_SUPABASE_URL}/functions/v1/gemini-proxy`.
  - Tích hợp cơ chế fallback: Nếu Edge Function chưa deploy hoặc gặp lỗi timeout, tự động chuyển về `GeminiLlmProvider` trực tiếp hoặc `DeterministicLlmProvider` để đảm bảo hệ thống không bao giờ bị gián đoạn (Zero downtime).
  - Cập nhật factory `getLlmProvider()` để ưu tiên AI Gateway khi có cấu hình.

### Task 3: Viết Script Kiểm thử & Xác thực Toàn diện
- [ ] Tạo `scripts/test-ai-gateway.mjs`:
  - Kiểm thử gửi request với operation hợp lệ.
  - Kiểm thử từ chối operation không hợp lệ hoặc thiếu dữ liệu.
  - Kiểm thử cơ chế fallback khi Edge Function offline.
- [ ] Thêm lệnh `test:ai-gateway` vào `package.json`.
- [ ] Chạy kiểm tra TypeScript `npm run typecheck:foundation`.

### Task 4: Kiểm thử Tích hợp & Đồng bộ Git
- [ ] Chạy kiểm thử an ninh toàn diện `npm run test:security`.
- [ ] Kiểm tra typecheck toàn dự án.
- [ ] Thực hiện quy trình Git: `pull` $\rightarrow$ `commit` $\rightarrow$ `pull` $\rightarrow$ `push` lên nhánh `refactor/nextjs-fullstack`.
