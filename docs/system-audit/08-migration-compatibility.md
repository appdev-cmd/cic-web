# Tương thích migration và rollout dữ liệu

## 1. Mục tiêu bất biến

- Mọi record legacy được giữ nguyên ID và ý nghĩa.
- Không drop/rename/overwrite field nguồn trong lần triển khai đầu.
- Số lượng record, relation và file path được đối soát.
- VI/EN giữ độc lập.
- Backend mới có thể rollback về đọc schema legacy-compatible.

## 2. Chiến lược migration

### Giai đoạn A — Baseline legacy

1. Chốt checksum/schema version của MySQL export và PostgreSQL target.
2. Chạy lại migration rehearsal vì report hiện còn lỗi.
3. So count theo từng bảng, min/max ID, null rate và checksum field quan trọng.
4. Lập orphan report cho FK/CSV relation; không tự xóa record lỗi.
5. Xác minh các issue trong `docs/postgresql-schema-issues.md` trước khi enforce FK.

### Giai đoạn B — Compatibility application layer

1. Repository đọc các bảng `cic_*` hiện tại.
2. Mapper đổi tên sang contract mới.
3. Resolver join category/user/product/media và parse relation legacy có thứ tự.
4. Public visibility filter Published + not trashed.
5. Preview đi qua CMS authorization và draft source riêng.

Giai đoạn này hỗ trợ phần lớn frontend mà không đổi schema.

### Giai đoạn C — Bảng domain mới

Tạo từng domain Level 3 độc lập, nullable/default-safe và không sửa record legacy:

1. Audit + Trash foundation.
2. Media asset mapping, chỉ index file/path cũ trước; chưa di chuyển/xóa file.
3. CTA + Form nếu frontend/CMS bắt đầu dùng thật.
4. Page Builder và seed page/section theo template code.
5. Email Template.
6. RBAC mở rộng sau khi có bộ so sánh effective permission.

Thứ tự thực tế cần theo dependency triển khai, nhưng không domain nào được đổi nghĩa bảng legacy để tiết kiệm một bảng mới.

### Giai đoạn D — Backfill có kiểm soát

- Page Builder: seed Draft và Published từ thiết kế/current content đã được chốt; trang legacy chưa map vẫn đọc `cic_contents*`.
- Media: tạo asset mapping theo path; lưu `legacy_path`; missing file thành warning, không xóa reference.
- Permission: import role chỉ khi mapping chắc chắn; direct permission legacy vẫn có hiệu lực.
- Customer requests: giữ record ở bảng nguồn; common read model dùng source key.

## 3. Quy tắc tương thích theo loại dữ liệu

| Loại | Quy tắc |
|---|---|
| ID | Giữ nguyên ID legacy; bảng mới dùng ID riêng và lưu legacy source key khi cần |
| Boolean | Chuẩn hóa tại mapper; không đổi `NULL` mù thành false nếu NULL mang nghĩa chưa xác định |
| Timestamp | Parse timezone rõ ràng; không suy nghĩa chung cho `created_time`/`end_time` giữa module |
| CSV relation | Trim, bỏ empty, phát hiện duplicate/orphan, giữ thứ tự; lưu raw value trong giai đoạn đầu |
| Image/file path | Giữ raw path; Media mapping là lớp bổ sung/fallback |
| Rich text | Sanitize tương thích; test HTML/embed/table/image cũ trước khi ghi lại |
| Workspace | VI/EN độc lập; không fallback/auto translate |
| Password/secret | Không log/snapshot; giữ hash và nâng cấp theo auth flow được duyệt |

## 4. Kiểm thử bắt buộc

### Dữ liệu

- Count trước/sau bằng nhau cho mọi bảng legacy.
- 100% legacy IDs có target hoặc có lỗi được ghi rõ.
- Relation count/order và orphan report theo module.
- Sample checksum title/alias/content/image/SEO/status theo từng bảng.
- File existence/mime/size report; không coi thiếu file là lý do bỏ record.

### Nghiệp vụ

- Draft không xuất hiện trên public.
- Preview đọc đúng Draft mà không Publish.
- Related entity draft/deleted/missing bị bỏ khỏi public và cảnh báo trong CMS.
- Product category/brand/type/application và sales owner resolve đúng.
- Event không dùng mù giá trị `end_time` legacy: đối soát với `updated_time`, chuẩn hóa timestamp audit về NULL, sau đó CMS mới dùng cột này làm ngày kết thúc.
- Function SEO route list và entity SEO detail không ghi đè sai cấp intent.
- Effective permission từng user trước/sau không giảm hoặc tăng âm thầm.
- Trash restore xử lý FK/slug conflict theo transaction.

### Giao diện

- Snapshot/visual regression cho News/Product/Service/Event/Static detail.
- Rich text legacy giữ heading, ảnh, bảng, list, link và embed hợp lệ.
- Missing optional data chỉ ẩn section/widget, không làm vỡ responsive/layout.

## 5. Rollback

- Level 0–1 rollback bằng deploy application trước đó.
- Level 2 chỉ dùng nullable/default-safe; rollback code trước, drop column sau khi xác nhận không có dữ liệu duy nhất.
- Level 3 là additive. Rollback chuyển read path về bảng legacy; giữ bảng mới để điều tra, không drop ngay.
- Media không di chuyển/xóa file legacy trong rollout đầu.
- Page Builder không xóa `cic_contents*` hoặc redirect cũ trước khi đối soát URL.
- Không rollback bằng cách restore database toàn cục nếu có thể rollback theo feature flag/read path.

## 6. Điều kiện cho phép triển khai schema

Chỉ viết migration sau khi:

1. Proposal Level 2–3 tương ứng được duyệt.
2. Tên bảng/column tuân convention PostgreSQL project.
3. FK target trong schema issue đã được xác nhận.
4. Có migration up/down hoặc rollback strategy thực tế.
5. Có script count/checksum/orphan verification.
6. Có contract test cho public/CMS/preview.
7. Có owner xử lý dữ liệu legacy không hợp lệ thay vì tự bỏ.

## 7. Kết luận

PostgreSQL hiện tại không cần redesign. Phần lớn website/CMS mới được đáp ứng bằng Level 0–1. Các Level 3 là domain mới tách biệt; chúng bổ sung khả năng mới mà không phá dữ liệu cũ. Event tái sử dụng `end_time` nên không cần Level 2 `event_end_time`; không có Level 4 trong phương án cuối hiện tại.
