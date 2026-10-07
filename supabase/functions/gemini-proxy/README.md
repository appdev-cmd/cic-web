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

2. Kiểm tra endpoint trực tiếp sau khi deploy (Yêu cầu Authorization header):
```bash
curl -i --location --request POST "https://tjkytlstopieiqqiiisy.supabase.co/functions/v1/gemini-proxy" \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY_OR_USER_JWT>" \
  --data '{"operation":"raw.generate","userPrompt":"Xin chào CIC"}'
```

### Cơ chế bảo mật & Guardrails:
- **Xác thực JWT:** Mọi request bắt buộc phải có `Authorization: Bearer <token>`.
- **Phân quyền Role:** Chấp nhận `SUPABASE_SERVICE_ROLE_KEY` (gọi từ Backend Server DAL) hoặc User JWT có cờ `cms_profile: true` / role `admin` / `operator` trong `app_metadata` (cán bộ CMS đã đăng nhập).
- **Chống Prompt Injection từ Browser:** Cấm User JWT gọi `raw.generate`. Trình duyệt chỉ được phép gọi các operation có cấu trúc trong whitelist (`product.prefill`, `field.enrich`). Lệnh `raw.generate` chỉ dành riêng cho internal server gọi qua Service Role Key.
- **Rate Limiting:** Sliding-window rate limit 30 req/phút đối với User JWT và 120 req/phút đối với Service Role Key. Vượt ngưỡng trả về HTTP 429 kèm header `Retry-After`.
- **Input Size Limit:** Giới hạn Content-Length < 500 KB, `userPrompt` tối đa 12.000 ký tự (~3.000 tokens), `systemPrompt` tối đa 4.000 ký tự. Vượt ngưỡng trả về HTTP 413.
- **Output Token Cap:** Đặt trần cứng tối đa 4.096 output tokens.
- **Timeout Protection:** Timeout 10s cho xác thực Supabase Auth, 25s cho Google Gemini API. Bị nghẽn trả về HTTP 504.
- Các request không hợp lệ bị từ chối ngay với HTTP `401 Unauthorized`, `403 Forbidden`, `413 Payload Too Large`, `429 Too Many Requests`, hoặc `504 Gateway Timeout`.

