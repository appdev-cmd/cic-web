# Các vấn đề schema PostgreSQL cần xử lý

> Đây là danh sách issue dùng chung cho toàn hệ thống. Chỉ ghi lỗi đã được xác minh; chưa phải migration hoặc SQL triển khai.

Mỗi issue cần ngắn gọn theo bốn ý: module, hiện trạng, ảnh hưởng và hướng sửa dự kiến. Khi rà soát module mới, bổ sung lỗi schema vào file này thay vì tạo thêm tài liệu FK riêng.

## Tin tức

### `cic_news.category_id` chưa có foreign key

- Hiện trạng: Cột chỉ khai báo `integer`, dù comment DDL nói là FK.
- Ảnh hưởng: Bài VI có thể trỏ tới danh mục không tồn tại.
- Hướng sửa: Sau khi dọn orphan/sentinel, tham chiếu `cic_news_categories(id)`; không dùng cascade xóa bài.

### `cic_news_en.category_id` chưa có foreign key

- Hiện trạng: Cột chỉ khai báo `integer`.
- Ảnh hưởng: Bài EN có thể trỏ tới danh mục không tồn tại hoặc sai workspace.
- Hướng sửa: Sau khi đối soát dữ liệu, tham chiếu `cic_news_categories_en(id)`.

### Parent danh mục EN trỏ sang bảng VI

- Hiện trạng: `cic_news_categories_en.parent_id` tham chiếu `cic_news_categories(id)`.
- Ảnh hưởng: Cây danh mục EN phụ thuộc dữ liệu VI, trái với mô hình hai workspace độc lập.
- Hướng sửa: Đổi thành self-reference tới `cic_news_categories_en(id)` sau khi kiểm tra orphan, sentinel `0`, self-reference và cycle.

## Menu

### Nhóm và parent của menu EN trỏ sang bảng VI

- Hiện trạng: `cic_menus_items_en.group_id` tham chiếu `cic_menus_groups(id)` và `cic_menus_items_en.parent_id` tham chiếu `cic_menus_items(id)`.
- Ảnh hưởng: Cây menu EN phụ thuộc ID của nhóm và mục menu VI, không đúng với mô hình hai workspace độc lập.
- Hướng sửa: Đổi lần lượt sang `cic_menus_groups_en(id)` và self-reference `cic_menus_items_en(id)` sau khi kiểm tra orphan, sentinel `0`, self-reference và cycle.

## Sự kiện

### Migration `cic_event` chưa được xác minh thành công

- Hiện trạng: `export_report.json` có 37 bản ghi VI và 20 bản ghi EN nhưng `migration_report.json` vẫn báo `cic_event: ERROR`.
- Ảnh hưởng: Chưa thể coi bảng PostgreSQL Sự kiện là nguồn dữ liệu sẵn sàng cho backend.
- Hướng sửa: Chạy lại migration/report theo schema hiện hành, giữ nguyên ID và đối soát số lượng, timestamp, boolean cùng các chuỗi related trước khi kết nối API.
