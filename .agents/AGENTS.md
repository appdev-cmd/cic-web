# Quy tắc tự động khởi động Server Local

## Quy trình kiểm tra và khởi chạy
Mỗi khi khởi động một phiên làm việc mới với người dùng (ở lượt phản hồi đầu tiên hoặc sau khi hệ thống ghi nhận server bị restart):

1. **Kiểm tra tác vụ đang chạy:** 
   Sử dụng tool `manage_task` với hành động `list` để kiểm tra danh sách các tác vụ chạy ngầm hiện tại.

2. **Khởi chạy Server:**
   - Nếu **CHƯA CÓ** tác vụ nào đang chạy lệnh `npm run dev` (hoặc `vite`), hãy tự động khởi chạy lệnh `npm run dev` tại thư mục gốc của dự án bằng tool `run_command`.
   - Thiết lập `WaitMsBeforeAsync` ở mức hợp lý (ví dụ: `500` ms) để lệnh được đẩy vào chạy ngầm (background task).

3. **Tránh khởi chạy trùng lặp:**
   - Nếu **ĐÃ CÓ** tác vụ chạy server đang hoạt động, tuyệt đối **KHÔNG** chạy thêm lệnh khởi động để tránh xung đột tài nguyên và cổng kết nối (port).
   - Thông báo ngắn gọn cho người dùng biết trạng thái của server kèm theo link truy cập (ví dụ: http://localhost:3000).

# Quy tắc tự động kích hoạt Caveman theo Model AI

## Kiểm tra và chuyển đổi chế độ hội thoại
Khi bạn (AI Agent) nhận được yêu cầu từ người dùng, hãy tự động thực hiện các quy tắc sau:

1. **Khi model hoạt động là Claude:**
   - Nếu model hiện tại thuộc dòng **Claude** (ví dụ: Claude 3.5 Sonnet, Claude 3 Opus, v.v.), hãy **tự động kích hoạt** kỹ năng `caveman` ở chế độ `full` để phản hồi người dùng nhằm tối ưu hóa và tiết kiệm token đầu ra.

2. **Khi model hoạt động là Gemini:**
   - Nếu model hiện tại thuộc dòng **Gemini** (ví dụ: Gemini 3.5 Flash, Gemini 1.5 Pro, v.v.), hãy **giao tiếp ở chế độ bình thường (normal mode)**, không sử dụng phong cách caveman trừ khi người dùng yêu cầu bật rõ ràng.

# Quy trình làm việc với Git (Pull/Push)

Khi thực hiện viết code hay chỉnh sửa source code, bạn (AI Agent) hoặc người dùng BẮT BUỘC phải tuân thủ quy trình sau:

**Bước 1: Pull trước khi code**
`git pull origin main`
(Luôn pull trước khi bắt đầu code để đảm bảo có phiên bản mới nhất)

**Bước 2: Code xong → Commit**
`git add .`
`git commit -m "feat: mô tả thay đổi"`

**Bước 3: Pull lại trước khi push**
`git pull origin main`
(Phòng trường hợp người khác đã push trong lúc đang code)

**Bước 4: Push (nếu không có conflict)**
`git push origin main`

**Tóm tắt nhanh:**
`pull → code → commit → pull → push`
