# Schema Delta — Dự án

## Kết luận audit

- `httpdocs` không có module nội dung Dự án và không có bảng `fs_projects*`; các chuỗi `project` tìm thấy chỉ là CSS/thư viện hoặc ngữ cảnh khác.
- PostgreSQL hiện tại không có `cic_projects*`. Không tái sử dụng `cic_contents*`, `cic_image*` hay bảng nghiệp vụ khác vì không cùng ý nghĩa.
- CMS/frontend mới đã có list, create/edit, detail, filter, homepage selection, Rich Text, media, factsheet, SEO và quan hệ sản phẩm/dịch vụ.
- Đây là module mới nên cần mô tả đầy đủ bảng mới. Không cần mở rộng bảng legacy hiện có.

## Bảng hiện có cần mở rộng

Không có.

## Bảng mới cần tạo

### `cic_projects` và `cic_projects_en`

Hai bảng có cùng cấu trúc nhưng là hai workspace độc lập; không tạo FK chéo VI/EN.

| Column | Type | Null/default | FK / Index | CMS/frontend sử dụng |
| --- | --- | --- | --- | --- |
| `id` | `bigint GENERATED ALWAYS AS IDENTITY` | NOT NULL | PK | ID nội bộ |
| `title` | `varchar(255)` | NOT NULL | — | Tên dự án, list/detail |
| `alias` | `varchar(255)` | NOT NULL | UNIQUE từng workspace | Tên hiệu/route detail |
| `tagline` | `text` | NULL | — | Câu giới thiệu ở detail |
| `summary` | `text` | NULL | — | Mô tả card/list và search |
| `content` | `text` | NULL | — | Nội dung Rich Text |
| `sector` | `varchar(150)` | NULL | INDEX | Lĩnh vực và filter |
| `solution` | `varchar(255)` | NULL | INDEX | Dịch vụ/giải pháp chính và filter |
| `technologies` | `text[]` | NOT NULL DEFAULT `'{}'` | — | Công nghệ áp dụng; mỗi phần tử là một dòng, có thứ tự |
| `customer_name` | `varchar(255)` | NULL | INDEX | Chủ đầu tư/khách hàng và filter |
| `location` | `varchar(255)` | NULL | — | Địa điểm thực hiện |
| `start_year` | `smallint` | NULL | CHECK năm hợp lệ | Năm bắt đầu |
| `end_year` | `smallint` | NULL | CHECK `end_year >= start_year` | Năm kết thúc |
| `is_ongoing` | `boolean` | NOT NULL DEFAULT `false` | CHECK ongoing thì `end_year IS NULL` | Đang triển khai |
| `image` | `varchar(500)` | NULL | — | Ảnh đại diện/media path hiện tại |
| `is_featured` | `boolean` | NOT NULL DEFAULT `false` | INDEX cùng publish/order | Dự án nổi bật |
| `published` | `boolean` | NOT NULL DEFAULT `false` | INDEX cùng ordering | Trạng thái public |
| `ordering` | `integer` | NOT NULL DEFAULT `0` | CHECK `ordering >= 0` | Thứ tự list |
| `seo_title` | `varchar(255)` | NULL | — | SEO title |
| `seo_keyword` | `varchar(255)` | NULL | — | SEO meta keyword |
| `seo_description` | `varchar(500)` | NULL | — | SEO meta description |
| `created_by` | `integer` | NULL | FK → `cic_users(id)` ON DELETE SET NULL | Người tạo |
| `updated_by` | `integer` | NULL | FK → `cic_users(id)` ON DELETE SET NULL | Người sửa cuối |
| `created_time` | `timestamptz` | NOT NULL DEFAULT `now()` | — | Metadata tạo |
| `updated_time` | `timestamptz` | NOT NULL DEFAULT `now()` | INDEX | Metadata cập nhật |

Index tối thiểu cho mỗi workspace:

- UNIQUE `alias` sau khi chuẩn hóa lowercase/kebab-case.
- `(published, ordering, id)` cho public list.
- `(is_featured, published, ordering, id)` cho danh sách nổi bật.
- Index riêng cho `sector`, `solution`, `customer_name`, `updated_time`.

### Bảng quan hệ sản phẩm

| Table | Columns | PK / FK / Index |
| --- | --- | --- |
| `cic_projects_products_rel` | `project_id bigint`, `product_id integer`, `ordering integer NOT NULL DEFAULT 0` | PK (`project_id`, `product_id`); FK project → `cic_projects(id)` ON DELETE CASCADE; FK product → `cic_products(id)` ON DELETE RESTRICT; INDEX (`product_id`); INDEX (`project_id`, `ordering`) |
| `cic_projects_products_rel_en` | `project_id bigint`, `product_id integer`, `ordering integer NOT NULL DEFAULT 0` | PK (`project_id`, `product_id`); FK project → `cic_projects_en(id)` ON DELETE CASCADE; FK product → `cic_products_en(id)` ON DELETE RESTRICT; INDEX (`product_id`); INDEX (`project_id`, `ordering`) |

### Bảng quan hệ dịch vụ

| Table | Columns | PK / FK / Index |
| --- | --- | --- |
| `cic_projects_services_rel` | `project_id bigint`, `service_id integer`, `ordering integer NOT NULL DEFAULT 0` | PK (`project_id`, `service_id`); FK project → `cic_projects(id)` ON DELETE CASCADE; FK service → `cic_services(id)` ON DELETE RESTRICT; INDEX (`service_id`); INDEX (`project_id`, `ordering`) |
| `cic_projects_services_rel_en` | `project_id bigint`, `service_id integer`, `ordering integer NOT NULL DEFAULT 0` | PK (`project_id`, `service_id`); FK project → `cic_projects_en(id)` ON DELETE CASCADE; FK service → `cic_services_en(id)` ON DELETE RESTRICT; INDEX (`service_id`); INDEX (`project_id`, `ordering`) |

Các bảng nối là **BẮT BUỘC** vì CMS hiện chọn nhiều sản phẩm/dịch vụ và yêu cầu quan hệ có FK. Không lưu các ID này trong `integer[]` hoặc JSONB.

## Mapping / lưu ý

- `name → title`, `shortDesc → summary`, `htmlContent → content`, `customer → customer_name`, `featured → is_featured` qua mapper; không tạo field trùng tên ViewModel.
- `appliedSolutions → technologies` là danh sách text tự do có thứ tự. Đây là “Công nghệ áp dụng”, không phải sản phẩm hoặc dịch vụ liên quan.
- `relatedLinks[products/services]` map qua bốn bảng nối; label, ảnh và metadata luôn đọc từ entity đích, không lưu lặp trong Project.
- `time` của mock được tách thành `start_year`, `end_year`, `is_ongoing`; frontend tự compose nhãn theo locale.
- `scope`, `results`, gallery, video, tài liệu và nội dung bài viết thông thường tiếp tục nằm trong `content` Rich Text; không tách thêm column.
- Homepage dùng reference `entityType = project` và `position` hiện có của Page Builder; không tạo bảng/dataset Project riêng cho trang chủ.
- Related projects trên detail có thể derive theo `sector`; chưa cần relation Project–Project.
- Không tạo taxonomy riêng cho `sector`, `solution`, `technologies` hoặc `customer_name` khi CMS mới vẫn quản lý chúng như text/filter label.
- Không có dữ liệu Project legacy để backfill tự động. Chỉ seed/import các fixture đã được duyệt; không tự phân loại bài `fs_contents*` theo từ khóa.

## Mức độ

- **BẮT BUỘC:** hai bảng Project và bốn bảng quan hệ để đáp ứng contract CMS/frontend hiện tại.
- **ĐỀ XUẤT:** chưa có bổ sung nào khác. Full-text/trigram, media relation và taxonomy chỉ xem xét khi có yêu cầu query hoặc integrity thực tế.

Chưa sửa PostgreSQL và chưa viết migration SQL trong bước audit này.
