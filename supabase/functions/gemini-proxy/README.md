# Supabase Edge Function: gemini-proxy (AI Gateway)

## Tổng quan
Edge Function này đóng vai trò là **AI Gateway** cho toàn bộ hệ sinh thái CMS của CIC:
- **Bảo mật khóa API:** `GEMINI_API_KEY` chỉ lưu trữ an toàn trong Supabase Secrets (Frontend và Vercel không nắm khóa).
- **Kiểm soát hoạt động (Operation Registry):** Chuẩn hóa các thao tác AI (`product.prefill`, `field.enrich`, `raw.generate`), ngăn chặn việc client tự ý can thiệp model hay prompt injection.
- **Human-in-the-loop:** AI chỉ đưa ra đề xuất (draft/suggestions) để cán bộ CMS duyệt trước khi lưu vào Database.
- **Project Ref CIC:** `tjkytlstopieiqqiiisy`

---

## Hướng dẫn Triển khai (Deployment)

### Bước 1: Đăng nhập Supabase CLI (Chỉ cần làm 1 lần)
Mở PowerShell hoặc Command Prompt và chạy:
```bash
npx supabase login
```
Trình duyệt sẽ tự động mở trang Supabase để bạn xác thực tài khoản. Hoặc bạn có thể tạo Access Token tại:
[https://supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens) rồi dán vào terminal.

### Bước 2: Cài đặt Khóa bí mật GEMINI_API_KEY trên Supabase
Bạn đã làm xong bước này trên Supabase Dashboard (Settings -> Edge Functions -> Secrets).
Nếu muốn set qua CLI:
```bash
npx supabase secrets set GEMINI_API_KEY=AIzaSy... --project-ref tjkytlstopieiqqiiisy
```

### Bước 3: Deploy Function lên Supabase
Chỉ cần chạy lệnh npm đã tạo sẵn:
```bash
npm run deploy:ai-gateway
```
Hoặc lệnh Supabase CLI tương đương:
```bash
npx supabase functions deploy gemini-proxy --project-ref tjkytlstopieiqqiiisy --no-verify-jwt
```

---

## Kiểm thử & Xác thực
1. Kiểm tra bộ quy tắc nghiệp vụ:
```bash
npm run test:ai-gateway
```

2. Kiểm tra endpoint trực tiếp sau khi deploy:
```bash
curl -i --location --request POST "https://tjkytlstopieiqqiiisy.supabase.co/functions/v1/gemini-proxy" \
  --header "Content-Type: application/json" \
  --data '{"operation":"raw.generate","userPrompt":"Xin chào CIC"}'
```
