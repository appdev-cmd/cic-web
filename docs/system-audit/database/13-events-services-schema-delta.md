# Schema Delta — Sự kiện và Dịch vụ

Phạm vi audit: code cũ trong `httpdocs` → PostgreSQL hiện tại trong `db_migrate/cic14005_cic_fs_schema_moi_postgresql_PATCHED.sql` → CMS/frontend React hiện tại. Tài liệu này chỉ ghi thay đổi cần **THÊM**, không mô tả lại toàn bộ schema và không chứa migration SQL.

## Sự kiện

### Bảng hiện có cần mở rộng

Không có field nghiệp vụ mới cần thêm. `cic_event` và `cic_event_en` đã có nội dung, media, thời gian, địa điểm, đăng ký, quan hệ legacy, SEO, trạng thái và audit metadata mà CMS/website hiện tại cần.

| Table | Field thêm | Type | FK | Index / constraint | Mức độ | CMS mới sử dụng | Ghi chú |
| ----- | ---------- | ---- | -- | ------------------ | ------ | --------------- | ------- |
| `cic_event` | Không thêm field | — | — | Unique index trên alias chuẩn hóa | **BẮT BUỘC** | Tạo/kiểm tra alias; website tra cứu chi tiết sự kiện VI | Index `idx_cic_event_alias` hiện tại không unique. Chỉ thêm unique sau khi profiling NULL, rỗng, khoảng trắng, hoa/thường và alias trùng. |
| `cic_event_en` | Không thêm field | — | — | Unique index trên alias chuẩn hóa | **BẮT BUỘC** | Tạo/kiểm tra alias; website tra cứu chi tiết sự kiện EN | Profiling dataset EN độc lập trước khi áp dụng. |
| `cic_event` | Không thêm field | — | — | `CHECK (end_time IS NULL OR time_event IS NULL OR end_time > time_event)` | **BẮT BUỘC** | Form bắt buộc thời gian kết thúc sau thời gian bắt đầu; trạng thái sắp/đang/đã diễn ra được derive từ hai mốc | Thêm constraint sau cleanup `end_time` legacy; có thể triển khai `NOT VALID` rồi validate sau. |
| `cic_event_en` | Không thêm field | — | — | CHECK tương ứng bảng VI | **BẮT BUỘC** | Contract thời gian của workspace EN | Không validate trên dữ liệu legacy chưa được đối soát. |
| `cic_event`, `cic_event_en` | Không thêm field | — | — | Index `(published, time_event, end_time)` | **ĐỀ XUẤT** | Danh sách website lọc/sắp sự kiện theo trạng thái thời gian | Chỉ tạo khi query plan thực tế cần; đây là tối ưu truy vấn, không phải field nghiệp vụ. |

### Bảng mới cần tạo

Không có.

### Mapping / lưu ý

- `startDate → time_event`, `endDate → end_time`, `location → place`, `eventType → chu_de`, `registrationUrl → link_dangky`, `shortDescription → summary`, `body → content`.
- `editorial_status` của ViewModel map vào `published`; không thêm column trạng thái biên tập trùng nghĩa.
- `event_related`, `news_related`, `products_related` tiếp tục dùng các field legacy hiện có trong giai đoạn compatibility. Chưa tạo relation table chỉ để làm schema đẹp hơn.
- `tags` của UI được serialize vào `tags`; không thêm array column mới.
- Agenda, diễn giả, đối tượng tham dự và nội dung chương trình tiếp tục nằm trong Rich Text `content`; không tách structured columns.
- `activity_logs` thuộc module audit dùng chung, không lưu vào `cic_event*`.
- Code cũ từng ghi `end_time` như thời gian cập nhật. Trước khi dùng làm thời gian kết thúc nghiệp vụ phải đối chiếu `updated_time`; giá trị không chứng minh được là thời gian kết thúc nhận `NULL`.
- `migration_report.json` hiện báo `cic_event: ERROR`; đây là lỗi cần xử lý trong bước migration/validation, không phải lý do thêm field hoặc bảng.

## Dịch vụ

### Bảng hiện có cần mở rộng

| Table | Field thêm | Type | FK | Index / constraint | Mức độ | CMS mới sử dụng | Ghi chú |
| ----- | ---------- | ---- | -- | ------------------ | ------ | --------------- | ------- |
| `cic_services` | Không thêm field | — | — | Unique index trên alias chuẩn hóa | **BẮT BUỘC** | CMS kiểm tra alias; website tra cứu dịch vụ VI | Index alias hiện tại không unique; profiling dữ liệu trước khi áp dụng. |
| `cic_services_en` | Không thêm field | — | — | Unique index trên alias chuẩn hóa | **BẮT BUỘC** | CMS kiểm tra alias; website tra cứu dịch vụ EN | Profiling dataset EN độc lập. |

### Bảng mới cần tạo

#### `cic_services_products_rel`

| Column | Type | Constraint |
| ------ | ---- | ---------- |
| `service_id` | `integer` | NOT NULL, FK → `cic_services(id)` ON DELETE CASCADE |
| `product_id` | `integer` | NOT NULL, FK → `cic_products(id)` ON DELETE RESTRICT |
| `ordering` | `integer` | NOT NULL DEFAULT `0`, CHECK `ordering >= 0` |

- PK: (`service_id`, `product_id`).
- Index bổ sung: (`product_id`) để truy vấn ngược dịch vụ theo sản phẩm; PK đã phục vụ truy vấn theo `service_id`.
- Quan hệ: Dịch vụ VI N–N Sản phẩm VI.
- Mức độ: **BẮT BUỘC** — website hiện dùng `relatedProductIds` để render sản phẩm liên quan; `cic_services` không có field hoặc relation tương đương.
- Lý do tạo bảng: đây là quan hệ N–N cần FK và ordering; thêm CSV/JSON vào `cic_services` sẽ làm mất toàn vẹn tham chiếu và khó query.

#### `cic_services_products_rel_en`

| Column | Type | Constraint |
| ------ | ---- | ---------- |
| `service_id` | `integer` | NOT NULL, FK → `cic_services_en(id)` ON DELETE CASCADE |
| `product_id` | `integer` | NOT NULL, FK → `cic_products_en(id)` ON DELETE RESTRICT |
| `ordering` | `integer` | NOT NULL DEFAULT `0`, CHECK `ordering >= 0` |

- PK: (`service_id`, `product_id`).
- Index bổ sung: (`product_id`).
- Quan hệ: Dịch vụ EN N–N Sản phẩm EN; không FK chéo sang workspace VI.
- Mức độ: **BẮT BUỘC** để contract EN không phải dùng quan hệ của VI.

### Mapping / lưu ý

- `slug → alias`, `description/htmlContent → content`, `thumbnail_url/image → image`, `summary/tagline → summary`, `display_order → ordering`, `meta_* → seo_*`, `editorial_status → published`.
- `tags` đã có trong `cic_services*`; không thêm field tag khác.
- `benefits_process`, `supplementary_content`, `scope`, quy trình và lợi ích trong fixture website phải compose vào Rich Text `content`; không tạo column theo từng section mockup.
- `banner_url`, `video_url`, `media_alt` và `og_image` chưa có control ghi dữ liệu trong form hiện tại. Ảnh chính dùng `image`; chưa thêm các field media chỉ vì type/mock còn khai báo.
- `group_id`/`group_name` chưa được form hiện tại quản trị. Dữ liệu legacy `category_id` không có bảng danh mục dịch vụ hợp lệ và mọi record khảo sát cùng một giá trị; chưa tạo bảng nhóm dịch vụ.
- Contract CMS đã bỏ `code`, `service_status`, owner, placement, CTA, publish scheduling và các field fixture không có nguồn DB. Trạng thái `editorial_status` map trực tiếp vào `published`.
- Activity log, used-by, trash và yêu cầu khách hàng thuộc shared modules/relation, không thêm trực tiếp vào `cic_services*`. Riêng version không thể tiếp tục mặc định là shared: functional reference yêu cầu working Draft tách khỏi Published đang live, nhưng audit 2026-09-11 không tìm thấy Service revision store/pointer hoặc generic adapter đã chứng minh. Cần chốt persistence contract trước implementation.
- `migration_report.json` hiện báo `cic_services: ERROR`; xử lý trong migration/validation, không mở rộng schema để che lỗi migrate.

### Live verification 2026-09-11

- `cic_services`: 9 rows, 9 published; `cic_services_en`: 6 rows, 6 published.
- Mỗi locale có 0 alias blank và 0 nhóm trùng `lower(btrim(alias))`; tuy vậy chỉ có index alias thường, chưa có unique normalized protection.
- `cic_services_products_rel` và `_en` đã tồn tại đúng PK/FK/index nhưng đều 0 row; đây là dữ liệu chưa được gán, không phải lý do tạo mock relation.
- Cả 15 row đều chưa có `image`; Media là dependency cho nội dung mới, còn UI phải có empty-image behavior đúng reference.
- `category_id/category_*` không có category master đáng tin cậy, nên giữ legacy và không tạo filter/selector nghiệp vụ.
- **BLOCKED_BY:** Service Draft/Published revision persistence contract.

## Kết luận delta

- Sự kiện: **0 column mới, 0 bảng mới**; thêm constraint/index sau profiling và cleanup `end_time`.
- Dịch vụ: hai bảng relation N–N đã tồn tại; unique normalized alias vẫn cần hardening. Số “4 column mới” trước đây không khớp schema/live DB và bị loại khỏi kết luận. Thay đổi version/revision chưa được tự thiết kế trong audit này.
- Không đề xuất structured content columns cho Event hoặc Service.
