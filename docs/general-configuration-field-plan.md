# CẤU HÌNH CHUNG — KẾ HOẠCH TRƯỜNG DỮ LIỆU

> Trạng thái: Mock frontend để review trước khi triển khai database/backend  
> Nguồn đối chiếu: CMS cũ `Cấu hình → Cấu hình chung`, database migrate PostgreSQL và giao diện CMS mới

## Mục tiêu

Giữ một module duy nhất tên **Cấu hình chung** để Marketing dễ tìm và vận hành. Module chỉ cho chỉnh dữ liệu đã được code định nghĩa; không cho nhập HTML, JavaScript, CSS hoặc tự tạo config key.

Luồng nội dung duy nhất:

`Lưu nháp → Xem trước → Xuất bản`

Public website chỉ đọc Published. CMS và Preview đọc Draft.

## Nhóm trường sử dụng lâu dài

### Thương hiệu

- Tên website, đuôi tiêu đề, slogan.
- Logo nền sáng, logo nền tối, favicon.
- Ảnh chia sẻ mặc định.

Màu sắc, font, spacing và layout thuộc design system trong code.

### Doanh nghiệp và liên hệ

- Tên pháp nhân, mã số thuế, website chính thức.
- Email công khai, email hỗ trợ, giờ làm việc và bản đồ.
- Địa chỉ, điện thoại và email của trụ sở Hà Nội/chi nhánh TP.HCM.

Backend sau này nên lưu văn phòng dưới dạng danh sách có cấu trúc để hỗ trợ nhiều số điện thoại/email và giữ thứ tự hiển thị.

### Footer và mạng xã hội

- Copyright, Facebook, YouTube, LinkedIn, Zalo.
- Ảnh và URL xác minh Bộ Công Thương.

Nền tảng và icon do code định nghĩa; Marketing chỉ nhập URL và bật/tắt khi chức năng được hỗ trợ.

### SEO mặc định

- Meta title, meta description, ảnh share mặc định.
- Meta keywords chỉ giữ để tương thích legacy.
- Robots.txt và verification chỉ dành cho quyền quản trị phù hợp.

SEO mặc định là fallback, không ghi đè SEO của trang/module/entity cụ thể.

### Đo lường và tiếp thị

- Google Analytics 4, Google Tag Manager, Google Ads.
- Meta Pixel, TikTok Pixel, LinkedIn Insight Tag, Microsoft Clarity.

Chỉ lưu ID/config theo schema provider. Không lưu script. Provider mới phải được frontend/backend hỗ trợ và deploy trước khi Marketing cấu hình.

### Trang lỗi 404

- Tiêu đề, mô tả, ảnh, nhãn nút và URL nút.
- Không lưu HTML; layout 404 nằm trong frontend component.

## Trường tạm giữ, có thể bỏ hoặc chuyển sau

Các trường dưới đây vẫn xuất hiện trong mock để review tác động và tránh xóa sớm:

- Màu thương hiệu: có thể bỏ vì thuộc design system.
- Ngôn ngữ mặc định: có thể bỏ khi VI/EN là hai workspace độc lập.
- Gemini, Zalo ZNS, VNPay: bỏ nếu không có tích hợp backend thật.
- SMTP và người nhận thông báo: chuyển sang vận hành/module Email hoặc routing yêu cầu.
- Maintenance, cache TTL và CORS: chuyển khỏi giao diện Marketing.
- Watermark, fallback product image và PDF điều khoản: chỉ giữ khi website có consumer thực tế.
- Legacy Flash Viewer: xóa khi kết thúc đối chiếu legacy.

Mỗi trường tạm giữ phải có note ngay dưới input trong CMS.

## Quy tắc database đề xuất

Chưa viết migration ở giai đoạn mock. Khi triển khai, dùng một bảng cấu hình chung với các trường tối thiểu:

- `workspace_code`
- `config_key`
- `group_code`
- `value_type`
- `draft_value` (`jsonb`)
- `published_value` (`jsonb`)
- `draft_asset_id`
- `published_asset_id`
- `is_active`
- `sort_order`
- `version`
- `updated_by`, `updated_at`
- `published_by`, `published_at`

Unique key: `(workspace_code, config_key)`.

Label, mô tả, input component, validation, nơi sử dụng và provider schema nằm trong code. Secret không lưu plain text trong bảng cấu hình.

## Phạm vi mock hiện tại

- Chỉ thêm registry field và mock UI để Marketing review.
- Chưa thay đổi PostgreSQL schema.
- Chưa có API hoặc backend persistence.
- Các mã đo lường chưa tự động chèn script lên public website.
- Việc xóa/chuyển các trường có note sẽ được quyết định sau khi xác nhận consumer thực tế.
