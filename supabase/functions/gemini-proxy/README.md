# Supabase Edge Function: gemini-proxy (AI Gateway)

## Tổng quan
Edge Function này đóng vai trò là **AI Gateway** cho toàn bộ hệ sinh thái CMS của CIC:
- **Bảo mật khóa API:** `GEMINI_API_KEY` chỉ lưu trữ an toàn trong Supabase Secrets (Frontend và Vercel không nắm khóa).
- **Kiểm soát hoạt động (Operation Registry):** Chuẩn hóa các thao tác AI (`product.prefill`, `field.enrich`, `raw.generate`), ngăn chặn việc client tự ý can thiệp model hay prompt injection.
- **Human-in-the-loop:** AI chỉ đưa ra đề xuất (draft/suggestions) để cán bộ CMS duyệt trước khi lưu vào Database.

---

## Hướng dẫn Triển khai (Deployment)

### 1. Cấu hình Supabase Secret
Chạy lệnh sau trên terminal (hoặc cấu hình tại Supabase Dashboard -> Project Settings -> Edge Functions -> Secrets):
```bash
npx supabase secrets set GEMINI_API_KEY=AIzaSy...
```

### 2. Triển khai Edge Function
```bash
npx supabase functions deploy gemini-proxy --no-verify-jwt
```
*(Next.js Server DAL chịu trách nhiệm kiểm tra session cán bộ CMS và quyền RBAC trước khi gọi tới Gateway).*

---

## Kiểm thử & Xác thực
Chạy kiểm thử bộ quy tắc và prompt builder:
```bash
npm run test:ai-gateway
```
