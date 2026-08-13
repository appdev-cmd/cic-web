# CẤU HÌNH CHUNG — PHẠM VI TRƯỜNG DỮ LIỆU

> Trạng thái: Mock frontend để review trước khi triển khai database/backend  
> Nguồn đối chiếu: CMS cũ `Cấu hình → Cấu hình chung`, schema migrate PostgreSQL và các consumer thực tế của website mới

## Nguyên tắc chốt

Schema migrate phản ánh CMS cũ, không phải danh sách trường bắt buộc của CMS mới. Một trường chỉ xuất hiện trong **Cấu hình chung** khi:

- website hoặc CMS mới có nơi sử dụng rõ ràng;
- Marketing có lý do nghiệp vụ để chỉnh;
- kiểu dữ liệu và validation được code định nghĩa;
- không cho nhập HTML, CSS, JavaScript hoặc tự tạo config key.

Trường legacy không phù hợp và trường dành cho vận hành kỹ thuật bị loại khỏi giao diện. Khi tương lai có tích hợp mới, frontend/backend phải hỗ trợ trước rồi mới bổ sung trường cấu hình tương ứng.

Luồng nội dung: `Lưu nháp → Xem trước → Xuất bản`. Public website chỉ đọc Published; CMS và Preview đọc Draft.

## Các nhóm được giữ

### Thương hiệu

- Tên website và đuôi tiêu đề.
- Logo nền sáng, logo nền tối, favicon và ảnh chia sẻ mặc định.

Màu sắc, font, spacing và layout thuộc design system trong code.

### Doanh nghiệp và liên hệ

- Tên pháp nhân, mã số thuế và website chính thức.
- Email công khai, email hỗ trợ, giờ làm việc và bản đồ.
- Địa chỉ, điện thoại và email văn phòng đang được website hiển thị.

### Footer và mạng xã hội

- Copyright và URL các kênh mạng xã hội đang được giao diện hỗ trợ.
- Ảnh và URL xác minh Bộ Công Thương.

Nền tảng và icon do code định nghĩa; Marketing chỉ nhập URL hoặc dữ liệu hiển thị.

### SEO mặc định

- Meta title, meta description và ảnh chia sẻ mặc định.
- Meta keywords chỉ để tương thích legacy nếu consumer hiện tại còn đọc.
- Robots và mã xác minh chỉ dành cho quyền quản trị phù hợp.

SEO mặc định là fallback, không ghi đè SEO riêng của module, trang hoặc entity.

### Đo lường và tiếp thị

- Google Analytics 4.
- Google Tag Manager.
- Google Ads.
- Meta Pixel.

Chỉ lưu mã định danh theo schema, không lưu script. TikTok Pixel, LinkedIn Insight Tag, Microsoft Clarity và nền tảng khác chưa xuất hiện trong CMS hiện tại; chỉ bổ sung khi đã có adapter và nhu cầu thực tế.

### Trang lỗi 404

- Tiêu đề, mô tả, ảnh, nhãn nút và URL nút.
- Layout và responsive nằm trong frontend component.

## Các trường đã loại khỏi CMS mới

- Slogan, màu thương hiệu và ngôn ngữ mặc định.
- Media/watermark/fallback asset không có consumer xác nhận.
- Gemini, Zalo ZNS, VNPay và tích hợp chưa có backend thật.
- SMTP và danh sách người nhận email; dữ liệu này thuộc module email/routing vận hành.
- Maintenance, cache TTL, CORS và cấu hình hạ tầng khác.
- Legacy Flash Viewer.
- TikTok Pixel, LinkedIn Insight Tag và Microsoft Clarity ở giai đoạn hiện tại.

Các bản ghi trên có thể còn tồn tại trong fixture legacy để đối chiếu migration, nhưng datasource của CMS mới không trả chúng về cho giao diện, Draft, lịch sử phiên bản hoặc activity log.

## Đề xuất database sau này

Chưa viết migration ở giai đoạn mock. Database mới chỉ cần các cột tối thiểu:

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

Label, mô tả, input component, validation và nơi sử dụng nằm trong code. Secret không lưu plain text trong bảng cấu hình.

## Phạm vi mock hiện tại

- Chỉ có registry field và mock UI để review.
- Chưa thay đổi PostgreSQL schema.
- Chưa có API hoặc backend persistence.
- Mã đo lường chưa tự động chèn script lên public website.
