# PostgreSQL Schema Delta

Tài liệu này chỉ tổng hợp những thay đổi cần bổ sung vào PostgreSQL hiện tại sau từng đợt audit. Đây không phải tài liệu mô tả toàn bộ schema, không chứa migration SQL và không thay thế bước profiling dữ liệu legacy.

Nguyên tắc migrate là bảo toàn bảng/cột nghiệp vụ legacy hoặc ánh xạ rõ ràng sang tên PostgreSQL đã tối ưu. Ngoại lệ là 11 bảng backup/copy đã được đánh dấu gạch bỏ trong `database.html`; các bảng này không được tạo và không được nhập vào PostgreSQL.

Các cặp bảng dữ liệu VI/EN dùng cùng contract vật lý: cùng danh sách cột và cùng kiểu dữ liệu theo bảng VI. Dữ liệu ngôn ngữ vẫn nằm độc lập; constraint/FK có thể trỏ tới bảng cùng workspace tương ứng.

## Tin tức

### Bảng hiện có cần mở rộng

Không có field nghiệp vụ mới cần thêm. `cic_news` và `cic_news_en` đã đáp ứng contract hiện tại của CMS/website mới.

| Table | Field thêm | Type | FK | Index | Mức độ | CMS mới sử dụng | Ghi chú |
| ----- | ---------- | ---- | -- | ----- | ------ | --------------- | ------- |
| `cic_news` | Không thêm field | — | — | Unique index trên alias chuẩn hóa | **BẮT BUỘC** | Kiểm tra alias khi tạo/sửa bài; website tra cứu bài VI theo alias | Chỉ tạo index sau khi profiling NULL, chuỗi rỗng, khoảng trắng, khác biệt hoa/thường và alias trùng. Có thể dùng partial unique index trong giai đoạn chuyển tiếp. |
| `cic_news_en` | Không thêm field | — | — | Unique index trên alias chuẩn hóa | **BẮT BUỘC** | Kiểm tra alias khi tạo/sửa bài; website tra cứu bài EN theo alias | Profiling độc lập dataset EN trước khi áp dụng; không ép `alias NOT NULL` trong migration đầu nếu dữ liệu legacy chưa đạt. |

### Bảng mới cần tạo

Không có.

### Mapping / lưu ý

- `shortDesc → summary`, `contentMarkdown → content`, `img → image`, `date → created_time`, `views → hits`; thời gian đọc và kích thước file là dữ liệu derived.
- Tác giả lấy qua `author_id`/`author_last_id → cic_users`; chuỗi `author` cũ được giữ làm snapshot/fallback. Không thêm field tác giả mới.
- `news_related` và `products_related` hiện đủ cho compatibility với dữ liệu cũ. Chưa tạo bảng relation chỉ để chuẩn hóa schema; chỉ audit lại nếu backend phát sinh nhu cầu query, sắp thứ tự hoặc bảo đảm toàn vẹn quan hệ độc lập.
- Không thêm `image_alt`, `image_caption`, `timezone`, các field version, activity hoặc trash vào bảng News. Đây là mock/UI concern hoặc thuộc shared entity nếu chức năng dùng chung được duyệt.
- Không thêm các field subtype fixture như `salary`, `deadline`, `programName`, `pdfSize`. Chưa có CMS write contract; nội dung thông thường tiếp tục dùng Rich Text hoặc metadata/file hiện có.
- Cần sửa FK hiện có `cic_news_en.category_id` từ `cic_news_categories(id)` sang `cic_news_categories_en(id)` sau khi kiểm tra orphan. Đây là sửa constraint sai workspace, không phải ADD field/table.

## Danh mục tin tức

### Bảng hiện có cần mở rộng

Không có field nghiệp vụ mới cần thêm. `cic_news_categories` và `cic_news_categories_en` đã đáp ứng contract hiện tại của CMS mới.

| Table | Field thêm | Type | FK | Index | Mức độ | CMS mới sử dụng | Ghi chú |
| ----- | ---------- | ---- | -- | ----- | ------ | --------------- | ------- |
| `cic_news_categories` | Không thêm field | — | — | Unique index trên alias chuẩn hóa | **BẮT BUỘC** | Validation alias; website tra cứu danh mục VI | Chỉ tạo sau khi xử lý NULL/rỗng/trùng và ngoại lệ legacy. |
| `cic_news_categories_en` | Không thêm field | — | — | Unique index trên alias chuẩn hóa | **BẮT BUỘC** | Validation alias; website tra cứu danh mục EN | Profiling độc lập dataset EN trước khi áp dụng. |

### Bảng mới cần tạo

Không có.

### Mapping / lưu ý

- `name`, `title`, `alias`, `summary`, `parent_id`, `ordering`, `image`, trạng thái hiển thị và SEO đã có; không tạo field trùng nghĩa theo tên của ViewModel mới.
- Số bài trong danh mục được tính bằng `COUNT(cic_news.id)` theo `category_id`; không lưu column `count`.
- Cần sửa FK hiện có `cic_news_categories_en.parent_id` từ `cic_news_categories(id)` thành self-reference `cic_news_categories_en(id)` sau khi kiểm tra orphan, sentinel `0`, self-reference và cycle. Đây là sửa constraint sai workspace, không phải ADD field/table.

## Sản phẩm

### Bảng hiện có cần mở rộng

Không có field nghiệp vụ mới cần thêm. `cic_products`, `cic_products_en` và các bảng relation/media/file hiện tại đã đáp ứng save/read contract của CMS/website mới.

| Table | Field thêm | Type | FK | Index | Mức độ | CMS mới sử dụng | Ghi chú |
| ----- | ---------- | ---- | -- | ----- | ------ | --------------- | ------- |
| `cic_products` | Không thêm field | — | — | Unique index trên alias chuẩn hóa | **BẮT BUỘC** | CMS tạo/kiểm tra alias; website tra cứu sản phẩm VI | Chỉ tạo sau khi profiling NULL/rỗng/trùng, khoảng trắng và khác biệt hoa/thường. Có thể dùng partial unique index trong giai đoạn chuyển tiếp. |
| `cic_products_en` | Không thêm field | — | — | Unique index trên alias chuẩn hóa | **BẮT BUỘC** | CMS tạo/kiểm tra alias; website tra cứu sản phẩm EN | Profiling độc lập dataset EN; không ép `alias NOT NULL` trong migration đầu nếu legacy chưa đạt. |

### Bảng mới cần tạo

Không có.

### Mapping / lưu ý

- `title → name`, `sku → code`, `short_description → summary`, `content_html → description`, `video_url → video`, `meta_* → seo_*`, `brand_id → manufactory`, `product_type → types_id`/`types`.
- Danh mục N-N dùng `cic_products_categories_rel*`; không tạo relation khác và không loại bỏ `category_id` CSV trong giai đoạn compatibility.
- Gallery dùng `cic_products_images*`. Các file/link tải xuống đã có trong Product; loại và kích thước file là dữ liệu derived.
- `highlights`, `tech_specs`, document metadata/version/access, `availability_signal`, `site_placement` và các field completeness/version/activity chỉ có trong mock/type hoặc chưa nằm trong save form; không thêm vào DB.
- Hãng, ứng dụng, loại sản phẩm và người phụ trách sử dụng entity/relation legacy hiện có; DTO trả object hiển thị, không lưu lặp tên theo ViewModel.
- Cần xác minh/sửa hai FK EN hiện có: `cic_products_en.types_id` đang trỏ bảng loại VI và `cic_products_images_en.record_id` đang trỏ Product VI. Đây là sửa constraint, không phải ADD field/table.

## Danh mục sản phẩm

### Bảng hiện có cần mở rộng

Không có field nghiệp vụ mới cần thêm. `cic_products_categories` và `cic_products_categories_en` đã có cây phân cấp, alias, mô tả, media, trạng thái, ordering, SEO và timestamps.

| Table | Field thêm | Type | FK | Index | Mức độ | CMS mới sử dụng | Ghi chú |
| ----- | ---------- | ---- | -- | ----- | ------ | --------------- | ------- |
| `cic_products_categories` | Không thêm field | — | — | Unique index trên alias chuẩn hóa | **BẮT BUỘC** | Validation alias; website tra cứu danh mục VI | Chỉ tạo sau khi xử lý NULL/rỗng/trùng và ngoại lệ legacy. |
| `cic_products_categories_en` | Không thêm field | — | — | Unique index trên alias chuẩn hóa | **BẮT BUỘC** | Validation alias; website tra cứu danh mục EN | Profiling độc lập dataset EN trước khi áp dụng. |

### Bảng mới cần tạo

Không có.

### Mapping / lưu ý

- `slug → alias`, `status → published`, `meta_title → seo_title`, `meta_keyword → seo_keyword`, `meta_description → seo_description`.
- Cấu hình SEO của Danh mục sản phẩm chỉ gồm ba field legacy trên. Không dùng `canonical_url` thay cho `link`; `link` là field legacy riêng và cần được map độc lập khi đưa vào form.
- `usage_count`/`count` được tính từ relation; có thể dùng `total_products` legacy như cache sau khi xác minh. Không tạo count column mới.
- `site_scope` tồn tại trong state/payload mock nhưng không có control chỉnh sửa và website chưa đọc; chưa đủ cơ sở đưa vào PostgreSQL.
- Cần sửa `parent_id` và `root_id` của `cic_products_categories_en` đang trỏ bảng VI thành self-reference tới bảng EN sau khi kiểm tra orphan, sentinel `0`, self-reference và cycle. Đây là sửa constraint, không phải ADD field/table.

## Hãng sản xuất

### Bảng hiện có cần mở rộng

| Table | Field thêm | Type | FK | Index | Mức độ | CMS mới sử dụng | Ghi chú |
| ----- | ---------- | ---- | -- | ----- | ------ | --------------- | ------- |
| `cic_manufactories` | `country` | `varchar(255)` | — | — | **BẮT BUỘC** | Form Hãng sản xuất: Quốc gia sản xuất | Nullable, mặc định `NULL`; legacy nhận `NULL`, không tự sinh dữ liệu. |
| `cic_manufactories` | `website` | `varchar(2048)` | — | — | **BẮT BUỘC** | Form Hãng sản xuất: Website chính thức Hãng | Nullable, mặc định `NULL`; URL được validate/render độc lập. |
| `cic_manufactories_en` | `country` | `varchar(255)` | — | — | **BẮT BUỘC** | Form Hãng sản xuất workspace EN | Nullable, mặc định `NULL`; giữ contract tương ứng với VI. |
| `cic_manufactories_en` | `website` | `varchar(2048)` | — | — | **BẮT BUỘC** | Form Hãng sản xuất workspace EN | Nullable, mặc định `NULL`; không backfill nội dung không tồn tại. |

### Bảng mới cần tạo

Không có.

### Mapping / lưu ý

- “Tiêu đề dữ liệu” dùng `name`; “Tên hiệu” dùng trực tiếp `alias` và được application tự sinh. Không thêm field định danh khác.
- `description` legacy vẫn được giữ nhưng CMS mới không hiển thị/chỉnh sửa trong form hoặc list Hãng.
- `logo → image`, `status → published`, `is_featured → show_in_homepage`.
- `country` và `website` là hai dữ liệu form đang chỉnh sửa nhưng PostgreSQL chưa có field tương đương; không nhét website vào Rich Text.
- Checkbox “Trang chủ & Footer” hiện dùng một policy qua `show_in_homepage`; chưa thêm cờ footer riêng khi CMS không quản trị hai vị trí độc lập.

## Lĩnh vực ứng dụng

### Bảng hiện có cần mở rộng

Không có field cần thêm; dùng `cic_application`/`cic_application_en`.

### Bảng mới cần tạo

Không có.

### Mapping / lưu ý

- “Tiêu đề dữ liệu” dùng `name`; “Tên hiệu” dùng trực tiếp `alias` và được application tự sinh.
- `description` legacy vẫn được giữ nhưng CMS mới không hiển thị/chỉnh sửa trong form hoặc list Lĩnh vực.
- `icon → image`, `color_badge → color_code`, `status → published`; các field nội dung, ordering và timestamps đã có.
- `sector_group` mới chỉ là state/default trong mock payload, chưa có control chỉnh sửa và chưa được frontend đọc độc lập; không thêm field.
- Danh sách application của sản phẩm tiếp tục dùng `cic_products.application` trong giai đoạn compatibility; chưa tạo relation table chỉ để chuẩn hóa.

## Loại sản phẩm

### Bảng hiện có cần mở rộng

| Table | Field thêm | Type | FK | Index | Mức độ | CMS mới sử dụng | Ghi chú |
| ----- | ---------- | ---- | -- | ----- | ------ | --------------- | ------- |
| `cic_products_types` | `updated_time` | `timestamptz` | — | — | **BẮT BUỘC** | List hiển thị thời gian cập nhật; form ghi khi lưu | Nullable, mặc định `NULL` trong migration đầu; legacy giữ `NULL` tới lần sửa đầu. |
| `cic_products_types_en` | `updated_time` | `timestamptz` | — | — | **BẮT BUỘC** | List/form workspace EN | Nullable, mặc định `NULL`; cần cơ chế cập nhật nhất quán khi triển khai schema. |

### Bảng mới cần tạo

Không có.

### Mapping / lưu ý

- “Tiêu đề dữ liệu” dùng `name`; “Tên hiệu” dùng trực tiếp `alias` và được application tự sinh. `icon → image`, `status → published`.
- `description` legacy vẫn được giữ nhưng CMS mới không hiển thị/chỉnh sửa trong form hoặc list Loại sản phẩm.
- `requires_license_key` và `pricing_model_default` chỉ được gán từ default/mock, chưa có control chỉnh sửa hoặc logic frontend; không thêm field.

## Người phụ trách kinh doanh

### Bảng hiện có cần mở rộng

Không có field cần thêm; tái sử dụng `cic_business`/`cic_business_en`, tương ứng module nhân viên `fs_business` của CMS cũ.

### Bảng mới cần tạo

Không có.

### Mapping / lưu ý

- `contact_product_ids → lienhe`, `sales_product_ids → lienhe_kd`, `technical_support_product_ids → lienhe_kt`, `north_sales_product_ids → lienhe_kdmb`, `south_sales_product_ids → lienhe_kdmn`.
- `name`, `code`, `alias`, `phone`, `Skype`, `Zalo`, media, trạng thái, ordering và timestamps đã có. Không dùng `cic_email` làm bảng nhân viên.
- Giữ danh sách ID trong các field `lienhe*` để tương thích legacy; chưa tạo năm relation table khi chưa có nhu cầu FK/query/reorder độc lập.
- `usage_count` là derived; `updated_by` thuộc audit/user context. Không thêm vào `cic_business*`.

## Sự kiện

### Bảng hiện có cần mở rộng

Không có field nghiệp vụ mới cần thêm. `cic_event` và `cic_event_en` đã đáp ứng contract hiện tại.

| Table | Field thêm | Type | FK | Index | Mức độ | CMS mới sử dụng | Ghi chú |
| ----- | ---------- | ---- | -- | ----- | ------ | --------------- | ------- |
| `cic_event` | Không thêm field | — | — | Unique index trên alias chuẩn hóa | **BẮT BUỘC** | Validation alias; website tra cứu sự kiện VI | Index alias hiện tại không unique; chỉ áp dụng sau profiling NULL/rỗng/trùng, khoảng trắng và hoa/thường. |
| `cic_event_en` | Không thêm field | — | — | Unique index trên alias chuẩn hóa | **BẮT BUỘC** | Validation alias; website tra cứu sự kiện EN | Profiling dataset EN độc lập. |
| `cic_event` | Không thêm field | — | — | CHECK `end_time IS NULL OR time_event IS NULL OR end_time > time_event` | **BẮT BUỘC** | Form kiểm tra thời gian kết thúc; website derive trạng thái sự kiện | Chỉ validate sau khi cleanup `end_time` legacy; có thể tạo constraint `NOT VALID` trước. |
| `cic_event_en` | Không thêm field | — | — | CHECK tương ứng bảng VI | **BẮT BUỘC** | Contract thời gian workspace EN | Không validate dữ liệu chưa đối soát. |
| `cic_event`, `cic_event_en` | Không thêm field | — | — | Index `(published, time_event, end_time)` | **ĐỀ XUẤT** | Lọc/sắp sự kiện sắp, đang và đã kết thúc | Chỉ thêm nếu query plan thực tế cần. |

### Bảng mới cần tạo

Không có.

### Mapping / lưu ý

- `startDate → time_event`, `endDate → end_time`, `location → place`, `eventType → chu_de`, `registrationUrl → link_dangky`, `shortDescription → summary`, `body → content`.
- `editorial_status → published`; không thêm trạng thái biên tập trùng nghĩa. `event_related`, `news_related`, `products_related` tiếp tục dùng field legacy hiện có.
- Agenda, diễn giả, đối tượng tham dự và chương trình tiếp tục nằm trong Rich Text `content`; không tạo structured columns theo mock.
- Code cũ từng ghi `end_time` như audit timestamp. Phải đối chiếu `updated_time`; giá trị không chứng minh được là thời gian kết thúc nhận `NULL`.
- `migration_report.json` còn báo `cic_event: ERROR`; đây là việc migration/validation, không phải Schema Delta.

## Dịch vụ

### Bảng hiện có cần mở rộng

| Table | Field thêm | Type | FK | Index | Mức độ | CMS mới sử dụng | Ghi chú |
| ----- | ---------- | ---- | -- | ----- | ------ | --------------- | ------- |
| `cic_services` | Không thêm field | — | — | Unique index trên alias chuẩn hóa | **BẮT BUỘC** | Validation alias; website tra cứu dịch vụ VI | Index hiện tại không unique; profiling trước khi áp dụng. |
| `cic_services_en` | Không thêm field | — | — | Unique index trên alias chuẩn hóa | **BẮT BUỘC** | Validation alias; website tra cứu dịch vụ EN | Profiling dataset EN độc lập. |

### Bảng mới cần tạo

#### `cic_services_products_rel`

| Column | Type | Constraint |
| ------ | ---- | ---------- |
| `service_id` | `integer` | NOT NULL, FK → `cic_services(id)` ON DELETE CASCADE |
| `product_id` | `integer` | NOT NULL, FK → `cic_products(id)` ON DELETE RESTRICT |
| `ordering` | `integer` | NOT NULL DEFAULT `0`, CHECK `ordering >= 0` |

- PK/unique: (`service_id`, `product_id`).
- Index: (`product_id`) cho truy vấn ngược; PK đã phục vụ truy vấn theo `service_id`.
- Quan hệ: Dịch vụ VI N–N Sản phẩm VI.
- Mức độ: **BẮT BUỘC** vì website đang render `relatedProductIds` nhưng PostgreSQL chưa có field/relation tương đương.
- Lý do tạo: quan hệ N–N cần FK và ordering; không thêm CSV/JSON vào `cic_services`.

#### `cic_services_products_rel_en`

| Column | Type | Constraint |
| ------ | ---- | ---------- |
| `service_id` | `integer` | NOT NULL, FK → `cic_services_en(id)` ON DELETE CASCADE |
| `product_id` | `integer` | NOT NULL, FK → `cic_products_en(id)` ON DELETE RESTRICT |
| `ordering` | `integer` | NOT NULL DEFAULT `0`, CHECK `ordering >= 0` |

- PK/unique: (`service_id`, `product_id`).
- Index: (`product_id`).
- Quan hệ: Dịch vụ EN N–N Sản phẩm EN; không FK chéo workspace VI.
- Mức độ: **BẮT BUỘC** để workspace EN có quan hệ độc lập.

### Mapping / lưu ý

- `slug → alias`, `description/htmlContent → content`, `thumbnail_url → image`, `summary/tagline → summary`, `display_order → ordering`, `meta_* → seo_*`, `editorial_status → published`.
- `benefits_process`, `supplementary_content`, scope, quy trình và lợi ích trong fixture website tiếp tục compose vào Rich Text `content`; không tạo column theo từng section.
- CMS đã bỏ `code`, `service_status`, `group_id`, owner, placement, CTA, `publish_at` và các field fixture không có nguồn DB. `editorial_status` map trực tiếp vào `published`; không thêm column trạng thái khác.
- Version, activity log, used-by, trash và yêu cầu khách hàng thuộc shared module/relation, không thêm vào `cic_services*`.
- `migration_report.json` còn báo `cic_services: ERROR`; xử lý tại migration/validation, không mở rộng schema để che lỗi migrate.

## Trang nội dung

### Bảng hiện có cần mở rộng

Không có. Giữ nguyên `cic_contents*` để migrate, đọc và đối soát bài tĩnh legacy. Không nhồi revision/section/config Page Builder vào bảng bài viết cũ.

### Bảng mới cần tạo

#### `cic_content_pages`

| Column | Type | Constraint |
| ------ | ---- | ---------- |
| `id` | `bigint` identity | PK |
| `workspace` | `varchar(5)` | NOT NULL, CHECK thuộc `vi`, `en` |
| `code` | `varchar(100)` | NOT NULL |
| `name` | `varchar(255)` | NOT NULL |
| `slug` | `varchar(512)` | NOT NULL |
| `page_type` | `varchar(50)` | NOT NULL, CHECK theo allowlist registry |
| `template_key` | `varchar(100)` | NOT NULL |
| `system_defined` | `boolean` | NOT NULL DEFAULT `false` |
| `draft_revision_id` | `bigint` | NULL, FK → `cic_content_page_revisions(id)` |
| `published_revision_id` | `bigint` | NULL, FK → `cic_content_page_revisions(id)` |
| `created_at` | `timestamptz` | NOT NULL DEFAULT `now()` |
| `created_by` | `integer` | NULL, FK → `cic_users(id)` ON DELETE SET NULL |
| `updated_at` | `timestamptz` | NOT NULL DEFAULT `now()` |
| `updated_by` | `integer` | NULL, FK → `cic_users(id)` ON DELETE SET NULL |

- Unique: (`workspace`, `code`) và (`workspace`, `slug`).
- Index: (`workspace`, `updated_at` DESC).
- Quan hệ: một Page có nhiều revision và giữ pointer tới Draft/Published hiện hành; service phải xác nhận pointer thuộc đúng Page.
- Mức độ: **BẮT BUỘC** — CMS đang dùng định danh, template, workspace, slug và hai version hiện hành.
- Lý do tạo: `cic_contents*` là bài HTML đơn, không biểu diễn Page theo template và revision.

#### `cic_content_page_revisions`

| Column | Type | Constraint |
| ------ | ---- | ---------- |
| `id` | `bigint` identity | PK |
| `page_id` | `bigint` | NOT NULL, FK → `cic_content_pages(id)` ON DELETE CASCADE |
| `version_number` | `integer` | NOT NULL, CHECK `version_number >= 1` |
| `state` | `varchar(20)` | NOT NULL, CHECK thuộc `draft`, `published` |
| `seo_title` | `varchar(255)` | NOT NULL DEFAULT `''` |
| `seo_description` | `text` | NOT NULL DEFAULT `''` |
| `created_at` | `timestamptz` | NOT NULL DEFAULT `now()` |
| `created_by` | `integer` | NULL, FK → `cic_users(id)` ON DELETE SET NULL |
| `published_at` | `timestamptz` | NULL |
| `published_by` | `integer` | NULL, FK → `cic_users(id)` ON DELETE SET NULL |

- Unique: (`page_id`, `version_number`).
- Index: (`page_id`, `state`, `version_number` DESC).
- Quan hệ: Page 1–N revision; Preview đọc Draft, website chỉ đọc Published snapshot.
- Mức độ: **BẮT BUỘC**.
- Lý do tạo: lần sửa Draft tiếp theo không được ghi đè nội dung đang Published.

#### `cic_content_page_sections`

| Column | Type | Constraint |
| ------ | ---- | ---------- |
| `id` | `bigint` identity | PK |
| `revision_id` | `bigint` | NOT NULL, FK → `cic_content_page_revisions(id)` ON DELETE CASCADE |
| `section_key` | `varchar(150)` | NOT NULL |
| `section_type` | `varchar(100)` | NOT NULL |
| `position` | `integer` | NOT NULL, CHECK `position > 0` |
| `config` | `jsonb` | NOT NULL DEFAULT `'{}'::jsonb` |

- Unique: (`revision_id`, `section_key`) và (`revision_id`, `position`).
- Không thêm GIN index cho `config` khi ứng dụng không query theo key JSON.
- Quan hệ: Revision 1–N section; section key/type/order phải khớp template registry trong code.
- Mức độ: **BẮT BUỘC**.
- Lý do tạo: config từng section khác nhau nhưng layout/component vẫn cố định, không thể lưu như một row bài viết.

#### `cic_content_page_section_references`

| Column | Type | Constraint |
| ------ | ---- | ---------- |
| `id` | `bigint` identity | PK |
| `section_id` | `bigint` | NOT NULL, FK → `cic_content_page_sections(id)` ON DELETE CASCADE |
| `entity_type` | `varchar(30)` | NOT NULL, CHECK theo allowlist product/news/service/project/partner/event |
| `entity_id` | `bigint` | NOT NULL |
| `position` | `integer` | NOT NULL, CHECK `position > 0` |

- Unique: (`section_id`, `entity_type`, `entity_id`) và (`section_id`, `entity_type`, `position`).
- Index: (`entity_type`, `entity_id`) cho used-by/đối chiếu ngược.
- Quan hệ: Section N–N entity được chọn thủ công và có thứ tự. Không tạo FK đa hình giả; backend kiểm tra entity tồn tại và published theo `entity_type`.
- Mức độ: **BẮT BUỘC**.
- Lý do tạo: Home/About và template thiết kế riêng đang chọn Product, News, Service, Project, Partner và Event có thứ tự.

### Mapping / lưu ý

- `PageBuilderPage → cic_content_pages`; `draft/published → cic_content_page_revisions`; `sections → cic_content_page_sections`; `references → cic_content_page_section_references`.
- Chính sách bảo mật, Điều khoản sử dụng và legal page tạo thêm chỉ có `legal.header` và `legal.content`; toàn bộ bài viết thường nằm trong một Rich Text `richTextHtml`.
- CTA/Form ở khu vực bố cục cố định lưu ID trong section config; CTA/Form chèn trong Rich Text lưu reference có cấu trúc tại `cic_content_embeds`. Backend kiểm tra với `cic_ctas`/`cic_forms`; không nhét payload/HTML của CTA/Form vào nội dung và không thêm column riêng trên Page.
- Media config lưu asset ID, không copy URL/metadata. Template registry, config schema, section order và reference limit nằm trong code, không tạo bảng template động.
- `cic_contents*` chỉ là nguồn nhập liệu legacy theo manifest được duyệt; không tự chuyển mọi bài cũ thành Page Builder, không migrate hits/rating/tags/display flags khi CMS mới không dùng.
- VI/EN là hai workspace độc lập; không fallback hoặc tự seed nội dung VI sang EN.

## Dự án

### Bảng hiện có cần mở rộng

Không có. Legacy `httpdocs` và PostgreSQL hiện tại không có module/bảng Dự án tương đương; không tái diễn giải `cic_contents*`, `cic_image*` hoặc bảng nghiệp vụ khác.

### Bảng mới cần tạo

#### `cic_projects` và `cic_projects_en`

Hai workspace có cùng cấu trúc nhưng quản lý dataset độc lập, không FK chéo VI/EN.

| Column | Type | Constraint |
| ------ | ---- | ---------- |
| `id` | `bigint` identity | PK |
| `title` | `varchar(255)` | NOT NULL |
| `alias` | `varchar(255)` | NOT NULL, UNIQUE từng workspace |
| `tagline` | `text` | NULL |
| `summary` | `text` | NULL |
| `content` | `text` | NULL; Rich Text |
| `sector` | `varchar(150)` | NULL, INDEX |
| `solution` | `varchar(255)` | NULL, INDEX |
| `technologies` | `text[]` | NOT NULL DEFAULT `'{}'`; giữ thứ tự |
| `customer_name` | `varchar(255)` | NULL, INDEX |
| `location` | `varchar(255)` | NULL |
| `start_year` | `smallint` | NULL, CHECK năm hợp lệ |
| `end_year` | `smallint` | NULL, CHECK không nhỏ hơn `start_year` |
| `is_ongoing` | `boolean` | NOT NULL DEFAULT `false`; CHECK ongoing thì `end_year IS NULL` |
| `image` | `varchar(500)` | NULL |
| `is_featured` | `boolean` | NOT NULL DEFAULT `false` |
| `published` | `boolean` | NOT NULL DEFAULT `false` |
| `ordering` | `integer` | NOT NULL DEFAULT `0`, CHECK `ordering >= 0` |
| `seo_title` | `varchar(255)` | NULL |
| `seo_keyword` | `varchar(255)` | NULL |
| `seo_description` | `varchar(500)` | NULL |
| `created_by` | `integer` | NULL, FK → `cic_users(id)` ON DELETE SET NULL |
| `updated_by` | `integer` | NULL, FK → `cic_users(id)` ON DELETE SET NULL |
| `created_time` | `timestamptz` | NOT NULL DEFAULT `now()` |
| `updated_time` | `timestamptz` | NOT NULL DEFAULT `now()`, INDEX |

- Index: (`published`, `ordering`, `id`), (`is_featured`, `published`, `ordering`, `id`), cùng index riêng cho `sector`, `solution`, `customer_name`, `updated_time`.
- Quan hệ: Project là nguồn chung cho CMS CRUD, homepage selection và website list/detail; VI/EN không dùng chung ID.
- Mức độ: **BẮT BUỘC** — module mới không có bảng legacy phù hợp để mở rộng.

#### `cic_projects_products_rel` và `cic_projects_products_rel_en`

| Column | Type | Constraint |
| ------ | ---- | ---------- |
| `project_id` | `bigint` | NOT NULL, FK → Project đúng workspace ON DELETE CASCADE |
| `product_id` | `integer` | NOT NULL, FK → Product đúng workspace ON DELETE RESTRICT |
| `ordering` | `integer` | NOT NULL DEFAULT `0`, CHECK `ordering >= 0` |

- PK/unique: (`project_id`, `product_id`).
- Index: (`product_id`) và (`project_id`, `ordering`).
- Quan hệ: Dự án N–N Sản phẩm, tách độc lập theo workspace.
- Mức độ: **BẮT BUỘC** — CMS đang chọn nhiều sản phẩm liên quan và quan hệ phải có FK.

#### `cic_projects_services_rel` và `cic_projects_services_rel_en`

| Column | Type | Constraint |
| ------ | ---- | ---------- |
| `project_id` | `bigint` | NOT NULL, FK → Project đúng workspace ON DELETE CASCADE |
| `service_id` | `integer` | NOT NULL, FK → Service đúng workspace ON DELETE RESTRICT |
| `ordering` | `integer` | NOT NULL DEFAULT `0`, CHECK `ordering >= 0` |

- PK/unique: (`project_id`, `service_id`).
- Index: (`service_id`) và (`project_id`, `ordering`).
- Quan hệ: Dự án N–N Dịch vụ, tách độc lập theo workspace.
- Mức độ: **BẮT BUỘC** — CMS đang chọn nhiều dịch vụ liên quan và quan hệ phải có FK.

### Mapping / lưu ý

- `name → title`, `shortDesc → summary`, `htmlContent → content`, `customer → customer_name`, `featured → is_featured`; chỉ đổi tên tại DTO/mapper.
- `appliedSolutions → technologies` là danh sách text tự do có thứ tự cho “Công nghệ áp dụng”, không phải FK Product/Service.
- `relatedLinks` map qua bốn bảng nối; không lưu lặp label, ảnh hoặc metadata của entity đích và không lưu ID bằng array/JSONB.
- `time` trong fixture map thành `start_year`, `end_year`, `is_ongoing`; frontend compose nhãn theo locale.
- `scope`, `results`, gallery, video, tài liệu và nội dung bài thông thường nằm trong Rich Text `content`; không tạo column riêng theo từng heading hoặc loại nội dung.
- Homepage tiếp tục dùng reference `entityType = project` và `position` của Page Builder; không tạo dataset Project riêng cho trang chủ.
- Chưa tạo taxonomy cho `sector`, `solution`, `technologies`, `customer_name`; chưa tạo relation Project–Project.
- Không có dữ liệu Project legacy để backfill tự động. Chỉ seed/import fixture đã được nghiệp vụ duyệt.

## Menu

### Bảng hiện có cần mở rộng

Không có field mới. `cic_menus_groups*` và `cic_menus_items*` đã đáp ứng nhóm, cây cha–con, link, target, trạng thái và ordering của CMS mới.

### Bảng mới cần tạo

Không có.

### Mapping / lưu ý

- `MenuGroup.name → group_name`; `label → name`, `url → link`, `open_in_new_tab → target`, `is_visible → published`, `display_order → ordering`.
- `depth`, `children`, count và preview tree derive từ `parent_id`; không thêm column.
- `icon_name` có thể map vào field `image`/icon string hiện có với allowlist Lucide; không thêm field chỉ để theo tên React.
- UI hiện chưa ghi permission/schedule/visibility rule riêng; không thêm JSON rule, role hoặc thời gian hiệu lực.
- Cần sửa hai FK hiện có của workspace EN: `cic_menus_items_en.group_id → cic_menus_groups_en(id)` và `parent_id → cic_menus_items_en(id)` sau khi kiểm tra orphan, sentinel `0`, self-reference và cycle. Đây không phải ADD field/table.
- Thêm index (`group_id`, `parent_id`, `ordering`) cho từng workspace nếu PostgreSQL hiện chưa có.

## Thư viện media

### Bảng hiện có cần mở rộng

Không có. `cic_image*`, gallery/banner/slideshow/video và path file legacy tiếp tục được giữ để migrate, đối soát và fallback; không nhồi metadata Media Library vào các bảng nội dung này.

### Bảng mới cần tạo

#### `cic_media_assets`

| Column | Type | Constraint |
| ------ | ---- | ---------- |
| `id` | `bigint` identity | PK |
| `filename` | `varchar(255)` | NOT NULL |
| `media_type` | `varchar(20)` | NOT NULL, CHECK `image`, `video`, `document` |
| `mime_type` | `varchar(150)` | NOT NULL |
| `storage_path` | `text` | NOT NULL |
| `thumbnail_path` | `text` | NULL |
| `file_size_bytes` | `bigint` | NOT NULL, CHECK `>= 0` |
| `width` | `integer` | NULL, CHECK `> 0` |
| `height` | `integer` | NULL, CHECK `> 0` |
| `duration_seconds` | `numeric(12,3)` | NULL, CHECK `>= 0` |
| `credit_author` | `varchar(255)` | NULL |
| `license_type` | `varchar(30)` | NULL, CHECK theo allowlist CMS |
| `license_expiry` | `date` | NULL |
| `tags` | `text[]` | NOT NULL DEFAULT `'{}'` |
| `workflow_status` | `varchar(20)` | NOT NULL DEFAULT `'processing'`, CHECK theo workflow CMS |
| `created_by` | `integer` | NULL, FK → `cic_users(id)` ON DELETE SET NULL |
| `created_at` | `timestamptz` | NOT NULL DEFAULT `now()` |
| `updated_at` | `timestamptz` | NOT NULL DEFAULT `now()` |
| `deleted_at` | `timestamptz` | NULL |
| `legacy_source_table` | `varchar(100)` | NULL |
| `legacy_source_id` | `bigint` | NULL |
| `legacy_path` | `text` | NULL |

- Index: (`media_type`, `workflow_status`, `deleted_at`), (`updated_at` DESC), (`created_by`); GIN (`tags`) nếu giữ filter tag.
- Partial unique: (`legacy_source_table`, `legacy_source_id`) sau profiling nguồn trùng. Không unique toàn cục filename/path trước khi kiểm kê legacy.
- Quan hệ: asset ID ổn định dùng chung cho picker và các content module; `legacy_source_*` giữ dấu vết import.
- Mức độ: **BẮT BUỘC**.

#### `cic_media_asset_translations`

| Column | Type | Constraint |
| ------ | ---- | ---------- |
| `asset_id` | `bigint` | NOT NULL, FK → `cic_media_assets(id)` ON DELETE CASCADE |
| `locale` | `varchar(5)` | NOT NULL, CHECK theo workspace hỗ trợ |
| `title` | `varchar(255)` | NOT NULL |
| `description` | `text` | NULL |
| `alt_text` | `text` | NOT NULL DEFAULT `''` |
| `caption` | `text` | NULL |
| `updated_at` | `timestamptz` | NOT NULL DEFAULT `now()` |
| `updated_by` | `integer` | NULL, FK → `cic_users(id)` ON DELETE SET NULL |

- PK: (`asset_id`, `locale`); index (`locale`, `updated_at` DESC).
- Quan hệ: một file vật lý có metadata hiển thị riêng theo locale; không duplicate binary/path VI/EN.
- Mức độ: **BẮT BUỘC** — data source mới project alt/caption theo workspace và không fallback VI sang EN.

#### `cic_media_folders`

| Column | Type | Constraint |
| ------ | ---- | ---------- |
| `id` | `bigint` identity | PK |
| `workspace` | `varchar(5)` | NOT NULL |
| `name` | `varchar(255)` | NOT NULL |
| `alias` | `varchar(150)` | NOT NULL |
| `icon` | `varchar(100)` | NULL |
| `ordering` | `integer` | NOT NULL DEFAULT `0`, CHECK `>= 0` |
| `created_at` | `timestamptz` | NOT NULL DEFAULT `now()` |
| `updated_at` | `timestamptz` | NOT NULL DEFAULT `now()` |

- Unique: (`workspace`, `alias`); index (`workspace`, `ordering`, `id`).
- `Tất cả thư mục` là filter ảo, không tạo record root.
- Mức độ: **BẮT BUỘC**.

#### `cic_media_folder_assets`

| Column | Type | Constraint |
| ------ | ---- | ---------- |
| `folder_id` | `bigint` | NOT NULL, FK → `cic_media_folders(id)` ON DELETE CASCADE |
| `asset_id` | `bigint` | NOT NULL, FK → `cic_media_assets(id)` ON DELETE CASCADE |
| `ordering` | `integer` | NOT NULL DEFAULT `0`, CHECK `>= 0` |

- PK: (`folder_id`, `asset_id`); index (`asset_id`) và (`folder_id`, `ordering`).
- Quan hệ: folder N–N asset để tổ chức độc lập theo workspace mà không copy file.
- Mức độ: **BẮT BUỘC**.

#### `cic_media_albums`

| Column | Type | Constraint |
| ------ | ---- | ---------- |
| `id` | `bigint` identity | PK |
| `workspace` | `varchar(5)` | NOT NULL |
| `title` | `varchar(255)` | NOT NULL |
| `alias` | `varchar(150)` | NOT NULL |
| `description` | `text` | NULL |
| `cover_asset_id` | `bigint` | NULL, FK → `cic_media_assets(id)` ON DELETE SET NULL |
| `workflow_status` | `varchar(20)` | NOT NULL DEFAULT `'draft'`, CHECK `draft`, `published`, `archived` |
| `ordering` | `integer` | NOT NULL DEFAULT `0`, CHECK `>= 0` |
| `created_by` | `integer` | NULL, FK → `cic_users(id)` ON DELETE SET NULL |
| `created_at` | `timestamptz` | NOT NULL DEFAULT `now()` |
| `updated_at` | `timestamptz` | NOT NULL DEFAULT `now()` |

- Unique: (`workspace`, `alias`); index (`workspace`, `workflow_status`, `ordering`, `id`).
- Service phải xác nhận cover thuộc album trước khi publish.
- Mức độ: **BẮT BUỘC** — CMS có create/edit/delete album và chọn cover.

#### `cic_media_album_assets`

| Column | Type | Constraint |
| ------ | ---- | ---------- |
| `album_id` | `bigint` | NOT NULL, FK → `cic_media_albums(id)` ON DELETE CASCADE |
| `asset_id` | `bigint` | NOT NULL, FK → `cic_media_assets(id)` ON DELETE CASCADE |
| `position` | `integer` | NOT NULL, CHECK `> 0` |

- PK: (`album_id`, `asset_id`); unique (`album_id`, `position`); index (`asset_id`).
- Quan hệ: album N–N asset có thứ tự; `item_count` được COUNT và cover URL join từ asset.
- Mức độ: **BẮT BUỘC**.

#### `cic_media_versions`

| Column | Type | Constraint |
| ------ | ---- | ---------- |
| `id` | `bigint` identity | PK |
| `asset_id` | `bigint` | NOT NULL, FK → `cic_media_assets(id)` ON DELETE CASCADE |
| `version_number` | `integer` | NOT NULL, CHECK `>= 1` |
| `filename` | `varchar(255)` | NOT NULL |
| `storage_path` | `text` | NOT NULL |
| `file_size_bytes` | `bigint` | NOT NULL, CHECK `>= 0` |
| `replacement_note` | `text` | NULL |
| `created_by` | `integer` | NULL, FK → `cic_users(id)` ON DELETE SET NULL |
| `created_at` | `timestamptz` | NOT NULL DEFAULT `now()` |

- Unique: (`asset_id`, `version_number`); index (`asset_id`, `version_number` DESC).
- Quan hệ: Replace Global Asset giữ nguyên asset ID và lưu bản cũ có audit.
- Mức độ: **BẮT BUỘC**.

#### `cic_media_variants` — ĐỀ XUẤT

| Column | Type | Constraint |
| ------ | ---- | ---------- |
| `id` | `bigint` identity | PK |
| `asset_id` | `bigint` | NOT NULL, FK → `cic_media_assets(id)` ON DELETE CASCADE |
| `preset_name` | `varchar(50)` | NOT NULL |
| `width` | `integer` | NOT NULL, CHECK `> 0` |
| `height` | `integer` | NOT NULL, CHECK `> 0` |
| `format` | `varchar(20)` | NOT NULL |
| `storage_path` | `text` | NOT NULL |
| `file_size_bytes` | `bigint` | NOT NULL, CHECK `>= 0` |
| `focal_x` | `numeric(5,2)` | NULL, CHECK `0..100` |
| `focal_y` | `numeric(5,2)` | NULL, CHECK `0..100` |
| `processing_status` | `varchar(20)` | NOT NULL DEFAULT `'processing'` |

- Unique: (`asset_id`, `preset_name`, `format`); index (`asset_id`, `processing_status`).
- Mức độ: **ĐỀ XUẤT** — UI có variant/focal point nhưng focal point hiện chỉ là local state, chưa được lưu khi Save. Chỉ tạo khi backend crop/variant được triển khai thật.

### Mapping / lưu ý

- `file_size_kb` derive từ bytes; `owner_name`/`owner_avatar` join `created_by → cic_users`.
- `folder_name`, `album_ids`, `item_count`, `used_by_count`, `used_by_refs`, `metadata_status` và cover URL là join/derived; không tạo column tương ứng.
- `MediaIssue` hiện là fixture/read-only; duplicate, missing-alt, low-resolution, large-file và license-expired có thể derive bằng job/query. Chưa tạo bảng issue.
- Upload progress/error/preview là client state transient; không đưa vào PostgreSQL.
- Không xóa/rewrite path trong `cic_image*`; media resolver giữ fallback cho record legacy chưa nhập Asset Library.
- Không lưu URL CDN tuyệt đối nếu có thể derive từ `storage_path`; external legacy URL được giữ trong `legacy_path` hoặc qua storage adapter.

## CTA

### Bảng hiện có cần mở rộng

Không có. Legacy và PostgreSQL hiện tại không có entity CTA generic; link/nút hard-code cũ không phải nguồn quản trị reusable.

### Bảng mới cần tạo

#### `cic_ctas`

| Column | Type | Constraint |
| ------ | ---- | ---------- |
| `id` | `bigint` identity | PK |
| `workspace` | `varchar(5)` | NOT NULL, CHECK theo workspace hỗ trợ |
| `code` | `varchar(100)` | NOT NULL |
| `is_system` | `boolean` | NOT NULL DEFAULT `false` |
| `admin_name` | `varchar(255)` | NOT NULL |
| `display_text` | `varchar(100)` | NOT NULL |
| `description` | `text` | NULL |
| `icon` | `varchar(100)` | NULL, validate allowlist Lucide |
| `style_variant` | `varchar(30)` | NOT NULL DEFAULT `'primary'`, CHECK theo design system |
| `action_type` | `varchar(40)` | NOT NULL, CHECK theo action allowlist |
| `action_config` | `jsonb` | NOT NULL DEFAULT `'{}'::jsonb`, CHECK là object |
| `form_id` | `bigint` | NULL, FK → `cic_forms(id)` ON DELETE RESTRICT |
| `media_asset_id` | `bigint` | NULL, FK → `cic_media_assets(id)` ON DELETE RESTRICT |
| `email_template_id` | `bigint` | NULL, FK → `cic_email_templates(id)` ON DELETE RESTRICT |
| `status` | `varchar(20)` | NOT NULL DEFAULT `'draft'`, CHECK `active`, `inactive`, `draft`, `archived` |
| `created_by` | `integer` | NULL, FK → `cic_users(id)` ON DELETE SET NULL |
| `created_at` | `timestamptz` | NOT NULL DEFAULT `now()` |
| `updated_at` | `timestamptz` | NOT NULL DEFAULT `now()` |
| `deleted_at` | `timestamptz` | NULL |

- Unique: (`workspace`, `code`).
- Index: (`workspace`, `status`, `updated_at` DESC), các FK action và partial index record chưa xóa nếu cần.
- `is_system = true` xác định CTA thuộc nhóm **Hệ thống**; `false` xác định CTA thuộc nhóm **Bổ sung**. CTA Hệ thống cho phép cập nhật nội dung/hành động nhưng không cho xóa hoặc đổi `code`. Các hằng semantic ở frontend map vào `code`, không map vào PK `id`.
- Quan hệ/action validation: `open_form` cần `form_id`; `download_file` cần `media_asset_id`; `send_email` cần template/email; redirect, scroll và call dùng payload allowlist. FK không thuộc action phải NULL.
- Mức độ: **BẮT BUỘC** — CMS mới đang quản lý CTA reusable và các module khác chỉ lưu CTA reference.

### Mapping / lưu ý

- `adminName → admin_name`, `displayText → display_text`, `styleVariant → style_variant`, `actionConfig.type → action_type`.
- ID Form, Media và Email Template dùng column FK, không giấu trong `action_config`; JSON chỉ giữ URL, target, anchor, phone, email và policy linh hoạt.
- `usedByCount`/`usedByPages` derive từ Page/config/reference. Analytics, CTR, trend và sort theo clicks đang là fixture, chưa có tracking write contract nên không thêm schema.
- Size, preview state, CSS/JS/JSX là UI-only. Không thêm `cta_*` vào News, Product, Service hoặc Page.

#### `cic_content_embeds`

| Column | Type | Constraint |
| ------ | ---- | ---------- |
| `id` | `bigint` identity | PK |
| `workspace` | `varchar(5)` | NOT NULL, CHECK theo workspace hỗ trợ |
| `owner_type` | `varchar(30)` | NOT NULL, CHECK `news`, `event`, `product`, `service`, `content_page` |
| `owner_id` | `bigint` | NOT NULL |
| `field_key` | `varchar(100)` | NOT NULL |
| `embed_type` | `varchar(20)` | NOT NULL, CHECK `cta`, `form` |
| `cta_id` | `bigint` | NULL, FK → `cic_ctas(id)` ON DELETE RESTRICT |
| `form_id` | `bigint` | NULL, FK → `cic_forms(id)` ON DELETE RESTRICT |
| `position` | `integer` | NOT NULL, CHECK `> 0` |
| `display_config` | `jsonb` | NOT NULL DEFAULT `'{}'::jsonb`, CHECK là object |
| `created_at` | `timestamptz` | NOT NULL DEFAULT `now()` |

- CHECK theo `embed_type`: `cta` chỉ có `cta_id`; `form` chỉ có `form_id`.
- Unique: (`workspace`, `owner_type`, `owner_id`, `field_key`, `position`).
- Index: (`workspace`, `owner_type`, `owner_id`, `field_key`), (`cta_id`), (`form_id`).
- Bảng này chỉ lưu tham chiếu và thứ tự CTA/Biểu mẫu trong vùng Rich Text được hỗ trợ; không lưu bản sao nội dung CTA/Form và không cho phép thêm thành phần vào vùng bố cục cố định.
- `owner_type` là polymorphic allowlist nên FK tới owner được kiểm tra ở service; khi xóa owner, service phải xóa các embed trong cùng transaction.
- Mức độ: **BẮT BUỘC** — tách contract chèn nội dung khỏi HTML và giúp lần refactor editor/backend sau không phải đổi schema domain.

## Biểu mẫu

### Bảng hiện có cần mở rộng

Không có. `cic_contact*`, `cic_product_contact` và `cic_order*` tiếp tục giữ request/order legacy, không đại diện form definition hoặc submission generic.

### Bảng mới cần tạo

#### `cic_forms`

| Column | Type | Constraint |
| ------ | ---- | ---------- |
| `id` | `bigint` identity | PK |
| `workspace` | `varchar(5)` | NOT NULL, CHECK theo workspace hỗ trợ |
| `code` | `varchar(100)` | NOT NULL |
| `is_system` | `boolean` | NOT NULL DEFAULT `false` |
| `admin_name` | `varchar(255)` | NOT NULL |
| `title` | `varchar(255)` | NOT NULL |
| `description` | `text` | NULL |
| `status` | `varchar(20)` | NOT NULL DEFAULT `'draft'`, CHECK `active`, `inactive`, `draft`, `archived` |
| `current_version` | `integer` | NOT NULL DEFAULT `1`, CHECK `>= 1` |
| `create_customer_request` | `boolean` | NOT NULL DEFAULT `true` |
| `send_admin_email` | `boolean` | NOT NULL DEFAULT `false` |
| `admin_emails` | `text[]` | NOT NULL DEFAULT `'{}'` |
| `admin_email_template_id` | `bigint` | NULL, FK → `cic_email_templates(id)` ON DELETE RESTRICT |
| `send_confirmation_email` | `boolean` | NOT NULL DEFAULT `false` |
| `confirmation_email_template_id` | `bigint` | NULL, FK → `cic_email_templates(id)` ON DELETE RESTRICT |
| `submit_button_text` | `varchar(100)` | NOT NULL DEFAULT `'Gửi thông tin'` |
| `success_message` | `text` | NOT NULL |
| `redirect_url` | `text` | NULL |
| `created_by` | `integer` | NULL, FK → `cic_users(id)` ON DELETE SET NULL |
| `created_at` | `timestamptz` | NOT NULL DEFAULT `now()` |
| `updated_at` | `timestamptz` | NOT NULL DEFAULT `now()` |
| `deleted_at` | `timestamptz` | NULL |

- Unique: (`workspace`, `code`).
- Index: (`workspace`, `status`, `updated_at` DESC) và hai FK Email Template.
- `is_system = true` xác định Biểu mẫu thuộc nhóm **Hệ thống**; `false` xác định Biểu mẫu thuộc nhóm **Bổ sung**. Biểu mẫu Hệ thống được chỉnh các trường cho phép nhưng không được xóa hoặc đổi `code`. Các hằng semantic ở frontend map vào `code`, không map vào PK `id`.
- Khi bật gửi email, service phải kiểm tra template tồn tại, active, đúng workspace và audience trước publish.
- `saveToDatabase` không cần column: Form public hợp lệ luôn lưu submission và CMS hiện bắt buộc điều này khi publish.
- Mức độ: **BẮT BUỘC**.

#### `cic_form_fields`

| Column | Type | Constraint |
| ------ | ---- | ---------- |
| `id` | `bigint` identity | PK |
| `form_id` | `bigint` | NOT NULL, FK → `cic_forms(id)` ON DELETE CASCADE |
| `field_key` | `varchar(100)` | NOT NULL |
| `field_type` | `varchar(30)` | NOT NULL, CHECK theo allowlist |
| `role_type` | `varchar(30)` | NULL, CHECK theo allowlist |
| `label` | `varchar(255)` | NOT NULL |
| `placeholder` | `varchar(255)` | NULL |
| `help_text` | `text` | NULL |
| `is_required` | `boolean` | NOT NULL DEFAULT `false` |
| `is_locked` | `boolean` | NOT NULL DEFAULT `false` |
| `position` | `integer` | NOT NULL, CHECK `> 0` |
| `validation_config` | `jsonb` | NOT NULL DEFAULT `'{}'::jsonb`, CHECK là object |
| `options_config` | `jsonb` | NOT NULL DEFAULT `'[]'::jsonb`, CHECK là array |

- Unique: (`form_id`, `field_key`) và (`form_id`, `position`); index (`form_id`, `field_type`).
- Validation JSON chỉ nhận key allowlist; `required` có nguồn chuẩn là `is_required`. Options chỉ dùng cho select/radio/checkbox và không chứa component React.
- Mức độ: **BẮT BUỘC**.

#### `cic_form_submissions`

| Column | Type | Constraint |
| ------ | ---- | ---------- |
| `id` | `bigint` identity | PK |
| `form_id` | `bigint` | NOT NULL, FK → `cic_forms(id)` ON DELETE RESTRICT |
| `form_version` | `integer` | NOT NULL, CHECK `>= 1` |
| `source_type` | `varchar(50)` | NULL, CHECK theo allowlist source |
| `source_id` | `bigint` | NULL |
| `source_path` | `text` | NULL |
| `cta_id` | `bigint` | NULL, FK → `cic_ctas(id)` ON DELETE SET NULL |
| `placement_key` | `varchar(150)` | NULL |
| `submitted_at` | `timestamptz` | NOT NULL DEFAULT `now()` |

- Index: (`form_id`, `submitted_at` DESC), (`source_type`, `source_id`), (`cta_id`, `submitted_at` DESC), (`placement_key`), (`submitted_at` DESC).
- Form dùng soft delete; không cascade làm mất submission đã nhận.
- `cta_id` lưu CTA đã mở form nếu có; `placement_key` lưu vị trí cố định hoặc vùng Rich Text phát sinh lượt gửi. Tên CTA, tên trang và tiêu đề nội dung được derive bằng join/read model, không snapshot lặp vào submission.
- Mức độ: **BẮT BUỘC** — CMS yêu cầu lưu DB và xem lượt gửi.

#### `cic_form_submission_values`

| Column | Type | Constraint |
| ------ | ---- | ---------- |
| `id` | `bigint` identity | PK |
| `submission_id` | `bigint` | NOT NULL, FK → `cic_form_submissions(id)` ON DELETE CASCADE |
| `field_id` | `bigint` | NOT NULL, FK → `cic_form_fields(id)` ON DELETE RESTRICT |
| `field_key` | `varchar(100)` | NOT NULL, snapshot key theo version submit |
| `value_text` | `text` | NULL |
| `value_json` | `jsonb` | NULL |
| `media_asset_id` | `bigint` | NULL, FK → `cic_media_assets(id)` ON DELETE RESTRICT |

- Unique: (`submission_id`, `field_id`); index (`field_id`), (`media_asset_id`).
- CHECK đúng một dạng value theo field type; file upload lưu Media FK, không lưu binary/path tùy ý.
- Mức độ: **BẮT BUỘC**.

### Mapping / lưu ý

- `adminName → admin_name`, `currentVersion → current_version`, `fields → cic_form_fields`; submit config map vào các policy/FK trên `cic_forms`.
- Submission modal hiện dùng sample cứng; dữ liệu thật đọc từ submission/value và Customer Request adapter xem `form_submission` là một source khi `create_customer_request = true`.
- Không copy submission mới vào `cic_contact*`, `cic_product_contact` hoặc `cic_order*`; read model hợp nhất nguồn cũ và mới.
- Submission count được COUNT; analytics/conversion rate chỉ derive khi có tracking denominator, không lưu số mock.
- Webhook, CRM, download-after-submit và FileConfig mới chỉ có trong type/default mock, chưa có control/save contract hoàn chỉnh; chưa thêm schema.
- Builder drag/selection/preview/filter là UI-only. Chưa tạo Form revision table vì CMS chưa có restore/compare version; cần audit riêng nếu nghiệp vụ này được giữ.

## Yêu cầu khách hàng

### Bảng hiện có cần mở rộng

Không có. Giữ nguyên `cic_contact*`, `cic_product_contact`, `cic_order*` và `cic_form_submissions` theo đúng nghĩa từng nguồn; không copy dữ liệu khách hàng vào một bảng request hợp nhất.

### Bảng mới cần tạo

#### `cic_customer_request_states`

| Column | Type | Constraint |
| ------ | ---- | ---------- |
| `id` | `bigint` identity | PK |
| `workspace` | `varchar(5)` | NOT NULL, CHECK theo workspace hỗ trợ |
| `source_type` | `varchar(30)` | NOT NULL, CHECK `contact`, `product_contact`, `order`, `form_submission` |
| `source_id` | `bigint` | NOT NULL |
| `status` | `varchar(30)` | NOT NULL DEFAULT `'new'`, CHECK theo request status allowlist |
| `assigned_user_id` | `integer` | NULL, FK → `cic_users(id)` ON DELETE SET NULL |
| `priority` | `varchar(20)` | NOT NULL DEFAULT `'medium'`, CHECK `low`, `medium`, `high`, `urgent` |
| `tags` | `text[]` | NOT NULL DEFAULT `'{}'` |
| `created_at` | `timestamptz` | NOT NULL DEFAULT `now()` |
| `updated_at` | `timestamptz` | NOT NULL DEFAULT `now()` |

- Unique: (`workspace`, `source_type`, `source_id`).
- Index: (`workspace`, `status`, `updated_at` DESC), (`assigned_user_id`, `status`), (`source_type`, `source_id`); GIN (`tags`) chỉ khi giữ filter tag.
- Quan hệ: một record nguồn có tối đa một operational state; service resolve bảng nguồn theo allowlist vì PostgreSQL không có FK đa hình.
- Mức độ: **BẮT BUỘC** — CMS cần status/phân công thống nhất nhưng không được thay đổi nghĩa status riêng của bảng legacy.

#### `cic_customer_request_notes`

| Column | Type | Constraint |
| ------ | ---- | ---------- |
| `id` | `bigint` identity | PK |
| `request_state_id` | `bigint` | NOT NULL, FK → `cic_customer_request_states(id)` ON DELETE RESTRICT |
| `content` | `text` | NOT NULL, CHECK sau trim không rỗng |
| `created_by` | `integer` | NULL, FK → `cic_users(id)` ON DELETE SET NULL |
| `created_at` | `timestamptz` | NOT NULL DEFAULT `now()` |

- Index: (`request_state_id`, `created_at` DESC), (`created_by`).
- Mức độ: **BẮT BUỘC** — CMS đang tạo ghi chú nội bộ.

#### `cic_customer_request_events`

| Column | Type | Constraint |
| ------ | ---- | ---------- |
| `id` | `bigint` identity | PK |
| `request_state_id` | `bigint` | NOT NULL, FK → `cic_customer_request_states(id)` ON DELETE RESTRICT |
| `event_type` | `varchar(50)` | NOT NULL, CHECK theo allowlist |
| `old_value` | `jsonb` | NULL |
| `new_value` | `jsonb` | NULL |
| `actor_id` | `integer` | NULL, FK → `cic_users(id)` ON DELETE SET NULL |
| `created_at` | `timestamptz` | NOT NULL DEFAULT `now()` |

- Index: (`request_state_id`, `created_at` DESC), (`event_type`, `created_at` DESC), (`actor_id`).
- Append-only; event allowlist gồm note/status/assignment/priority/tags changes.
- Mức độ: **BẮT BUỘC** — CMS đang ghi log và render timeline. Không dùng `cic_history` vì bảng đó có nghĩa nghiệp vụ khác.

### Mapping / lưu ý

- Read model giữ `source_type + source_id`; tên, email, phone, company, message và submission values luôn đọc từ nguồn, không lưu lặp trong state.
- Form/CTA/page name và actor/assignee name là join, không tạo snapshot column.
- Legacy status chỉ map khi có rule đã duyệt; không ép giá trị lịch sử vào workflow mới.
- Assignment hiện còn `console.log`, priority/tags chưa nối save hoàn chỉnh. Các field thuộc operational contract nhưng service phải hoàn thiện trước migration production.
- Duplicate Request là thao tác mock không hợp lệ; không nhân bản source record. Xóa/restore chờ shared Trash, không thêm `deleted_at` vào mọi bảng legacy.

## Mẫu email

### Bảng hiện có cần mở rộng

Không có. `cic_email` và `cic_types_email` tiếp tục mang nghĩa người phụ trách/routing legacy, không phải template subject/body.

### Bảng mới cần tạo

#### `cic_email_templates`

| Column | Type | Constraint |
| ------ | ---- | ---------- |
| `id` | `bigint` identity | PK |
| `workspace` | `varchar(5)` | NOT NULL, CHECK theo workspace hỗ trợ |
| `name` | `varchar(255)` | NOT NULL |
| `event_key` | `varchar(50)` | NOT NULL, CHECK theo event registry |
| `audience` | `varchar(20)` | NOT NULL, CHECK `customer`, `internal` |
| `status` | `varchar(20)` | NOT NULL DEFAULT `'draft'`, CHECK `draft`, `active`, `inactive`, `archived` |
| `draft_version_id` | `bigint` | NULL, FK → `cic_email_template_versions(id)` |
| `active_version_id` | `bigint` | NULL, FK → `cic_email_template_versions(id)` |
| `created_by` | `integer` | NULL, FK → `cic_users(id)` ON DELETE SET NULL |
| `created_at` | `timestamptz` | NOT NULL DEFAULT `now()` |
| `updated_by` | `integer` | NULL, FK → `cic_users(id)` ON DELETE SET NULL |
| `updated_at` | `timestamptz` | NOT NULL DEFAULT `now()` |
| `activated_by` | `integer` | NULL, FK → `cic_users(id)` ON DELETE SET NULL |
| `activated_at` | `timestamptz` | NULL |

- Index: (`workspace`, `event_key`, `audience`, `status`), (`updated_at` DESC), hai version pointer.
- Không unique workspace/event/audience vì nhiều template có thể phục vụ cùng event; Form/CTA chọn ID cụ thể.
- Service xác nhận Draft/Active pointer thuộc đúng template. FK pointer được thêm sau bảng version để xử lý dependency vòng.
- Mức độ: **BẮT BUỘC**.

#### `cic_email_template_versions`

| Column | Type | Constraint |
| ------ | ---- | ---------- |
| `id` | `bigint` identity | PK |
| `template_id` | `bigint` | NOT NULL, FK → `cic_email_templates(id)` ON DELETE CASCADE |
| `version_number` | `integer` | NOT NULL, CHECK `>= 1` |
| `subject` | `text` | NOT NULL, CHECK sau trim không rỗng |
| `content` | `text` | NOT NULL, CHECK sau trim không rỗng |
| `created_by` | `integer` | NULL, FK → `cic_users(id)` ON DELETE SET NULL |
| `created_at` | `timestamptz` | NOT NULL DEFAULT `now()` |

- Unique: (`template_id`, `version_number`); index (`template_id`, `version_number` DESC).
- Version immutable: Save tạo version mới; Publish đổi `active_version_id` sau validation/preview, không ghi đè bản Active.
- Mức độ: **BẮT BUỘC**.

### Mapping / lưu ý

- `event → event_key`, `version → version_number`; subject/content nằm trong version, còn status/identity nằm trên template.
- Form và CTA tham chiếu Template bằng FK. Used-by reverse query các FK, không lưu usage count/pages.
- Token/variable thuộc registry allowlist trong code; không tạo bảng variable và không lưu sample preview values.
- Sender/reply-to/routing tiếp tục lấy từ Settings/routing đã duyệt; form hiện không quản trị nên không nhân bản vào template.
- Chỉ seed Draft từ manifest được duyệt; không suy diễn template từ email lịch sử, người phụ trách hoặc chuỗi hard-code legacy.

## Người dùng

### Bảng hiện có cần mở rộng

| Table | Field thêm | Type | FK | Index | Mức độ | CMS mới sử dụng | Ghi chú |
| ----- | ---------- | ---- | -- | ----- | ------ | --------------- | ------- |
| `cic_users` | `account_status` | `varchar(32) NOT NULL DEFAULT 'active'` sau backfill | — | Index thường | **BẮT BUỘC** | Form/list/filter với `active`, `suspended`, `deactivated`, `pending_invite` | `published` không đủ bốn trạng thái. Backfill `published=true → active`, còn lại → `deactivated`; tiếp tục đồng bộ `published` trong giai đoạn compatibility. |
| `cic_users` | `two_factor_enabled` | `boolean NOT NULL DEFAULT false` | — | — | **BẮT BUỘC** | Form cho phép bật/tắt 2FA và tab Bảo mật | Chỉ lưu cờ trạng thái; secret 2FA thuộc lớp xác thực riêng. |
| `cic_users` | `password_changed_at` | `timestamptz NULL` | — | — | **BẮT BUỘC** | Form đổi mật khẩu và thông tin bảo mật | Không map vào `updated_time` vì field đó thay đổi khi sửa cả hồ sơ/quyền. |
| `cic_users` | `failed_login_attempts` | `integer NOT NULL DEFAULT 0` | — | — | **ĐỀ XUẤT** | Màn hình audit hiển thị số lần đăng nhập lỗi | Chỉ ghi thật khi backend authentication/lockout được triển khai; dữ liệu hiện tại là mock. |

### Bảng mới cần tạo

#### `cic_user_status_history`

- Columns: `id bigint identity`, `user_id integer`, `previous_status varchar(32)`, `new_status varchar(32)`, `reason text`, `changed_at timestamptz`, `changed_by integer NULL`.
- PK: `id`.
- FK: `user_id → cic_users(id) ON DELETE RESTRICT`; `changed_by → cic_users(id) ON DELETE SET NULL`.
- Index: (`user_id`, `changed_at` DESC).
- Quan hệ: một user có nhiều lần đổi trạng thái.
- Mức độ: **BẮT BUỘC** — CMS đang tạo và hiển thị lịch sử khi trạng thái tài khoản thay đổi.

#### `cic_security_events`

- Columns: `id bigint identity`, `user_id integer NULL`, `event_type varchar(64)`, `status varchar(16)`, `ip_address inet NULL`, `user_agent text NULL`, `details text NULL`, `created_at timestamptz`.
- PK: `id`.
- FK: `user_id → cic_users(id) ON DELETE SET NULL`.
- Index: (`user_id`, `created_at` DESC), (`event_type`, `created_at` DESC).
- Mức độ: **ĐỀ XUẤT** — chỉ tạo khi lớp authentication phát security event thật; không tái sử dụng `cic_history` vì khác ngữ nghĩa nghiệp vụ.

### Mapping / lưu ý

- `avatar → image`, `status_online → isOnline`; các field hồ sơ, thời gian truy cập và số lượt truy cập đã có trên `cic_users`.
- Tiếp tục dùng `agencies` để tương thích `none`, `all` và danh sách ID legacy; chưa tạo relation chỉ để chuẩn hóa.
- `primaryRoleId` là projection từ `cic_user_roles`; không thêm `role_id` vào `cic_users`.
- Password dùng `cic_users.password`. Form React hiện validate password nhưng chưa đưa password vào object lưu; đây là lỗi implementation contract, không phải field DB còn thiếu.
- Chỉ thêm unique index username/email chuẩn hóa sau khi profiling NULL, chuỗi rỗng, khoảng trắng, hoa/thường và dữ liệu trùng legacy.

## Vai trò & quyền

### Bảng hiện có cần mở rộng

Không có. `cic_permission_tasks` tiếp tục là danh mục quyền do hệ thống/backend quản lý. `cic_permission_fun`, `cic_permission_field` và `cic_users_permission*` chỉ được giữ trong giai đoạn migration để đối chiếu quyền legacy; giao diện mới không cho tạo Task Definition, không cấp quyền trường dữ liệu và không vận hành quyền trực tiếp song song với role.

### Bảng mới cần tạo

#### `cic_roles`

- Columns: `id bigint identity`, `code varchar(100)`, `name varchar(255)`, `description text NULL`, `status varchar(16) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive'))`, `is_protected boolean NOT NULL DEFAULT false`, `created_at timestamptz`, `created_by integer NULL`, `updated_at timestamptz`, `updated_by integer NULL`.
- PK: `id`.
- FK: `created_by`, `updated_by → cic_users(id) ON DELETE SET NULL`.
- Unique/index: unique `lower(trim(code))`; index (`status`).
- Quan hệ: một role có nhiều permission và user assignment.
- Mức độ: **BẮT BUỘC** — biểu diễn vai trò ổn định trong mô hình `User → Role → Permission`.

#### `cic_role_permissions`

- Columns: `role_id bigint`, `permission_task_id integer`, `action varchar(24)`, `allowed boolean NOT NULL DEFAULT false`, `updated_at timestamptz`, `updated_by integer NULL`.
- PK/unique: (`role_id`, `permission_task_id`, `action`).
- FK: `role_id → cic_roles(id) ON DELETE CASCADE`; `permission_task_id → cic_permission_tasks(id) ON DELETE RESTRICT`; `updated_by → cic_users(id) ON DELETE SET NULL`.
- Index: `permission_task_id`.
- Mức độ: **BẮT BUỘC** — lưu trực tiếp quyền hiệu lực của role; không có `conditional` và không phụ thuộc role version.

#### `cic_user_roles`

- Columns: `id bigint identity`, `user_id integer`, `role_id bigint`, `assigned_at timestamptz`, `assigned_by integer NULL`, `status varchar(16) NOT NULL DEFAULT 'active'`.
- PK: `id`.
- FK: `user_id → cic_users(id) ON DELETE CASCADE`; `role_id → cic_roles(id) ON DELETE RESTRICT`; `assigned_by → cic_users(id) ON DELETE SET NULL`.
- Unique/index: unique active (`user_id`, `role_id`) nếu không cho gán lặp; index (`user_id`, `status`) và (`role_id`, `status`).
- Mức độ: **BẮT BUỘC** — CMS gán và thu hồi role theo mô hình đơn giản.

### Mapping / lưu ý

- Có thể tham khảo/import `fs_users_groups` cũ nhưng phải map sang role ổn định; không dùng tên nhóm làm permission source duy nhất.
- `assignedUsersCount` là dữ liệu derive; không tạo column. Không tạo relation role-group khi UI chưa có luồng gán group.
- Quyền trực tiếp legacy được snapshot và đối chiếu trong migration, sau đó ngừng làm nguồn cấp quyền thường trực. Trường hợp ngoại lệ phải được xử lý thành role rõ ràng.
- Vai trò không dùng quy trình lưu trữ riêng. `inactive` tạm ngừng hiệu lực quyền nhưng giữ nguyên quan hệ gán người dùng để có thể kích hoạt lại; backend chỉ tính quyền từ role `active`.
- Trước khi chuyển RBAC thành nguồn quyết định quyền phải chứng minh parity quyền hiệu lực 100%; mọi chênh lệch cần được phê duyệt và ghi Audit Log.
- `cic_permission_tasks` là catalog do code/backend phát hành. UI không tạo/sửa/xóa Task Definition.
- Không tạo `cic_role_versions`, `cic_role_version_permissions`, policy issue hoặc access review chỉ để phục vụ mock UI cũ. Lịch sử thay đổi role dùng shared Activity Log.

## Cấu hình hệ thống

### Bảng hiện có cần mở rộng

Không có field cần thêm. Tiếp tục dùng `cic_config`, `cic_config_en` và `cic_config_enjicad`; các bảng đã có key `name`, `value`, `data_type`, trạng thái, ordering và title.

### Bảng mới cần tạo

#### `cic_branches`

| Column | Type | Constraint |
| ------ | ---- | ---------- |
| `id` | `bigint` identity | PK |
| `workspace` | `varchar(5)` | NOT NULL, CHECK thuộc `vi`, `en` |
| `code` | `varchar(100)` | NOT NULL |
| `name` | `varchar(255)` | NOT NULL |
| `address` | `text` | NOT NULL, CHECK sau trim không rỗng |
| `phone` | `varchar(255)` | NULL |
| `email` | `varchar(255)` | NULL |
| `fax` | `varchar(100)` | NULL |
| `working_hours` | `varchar(255)` | NULL |
| `map_embed_url` | `text` | NULL |
| `map_search_query` | `text` | NULL |
| `is_head_office` | `boolean` | NOT NULL DEFAULT `false` |
| `published` | `boolean` | NOT NULL DEFAULT `true` |
| `ordering` | `integer` | NOT NULL DEFAULT `0`, CHECK `ordering >= 0` |
| `created_by` | `integer` | NULL, FK → `cic_users(id)` ON DELETE SET NULL |
| `updated_by` | `integer` | NULL, FK → `cic_users(id)` ON DELETE SET NULL |
| `created_at` | `timestamptz` | NOT NULL DEFAULT `now()` |
| `updated_at` | `timestamptz` | NOT NULL DEFAULT `now()` |

- Unique: (`workspace`, `code`); partial unique (`workspace`) WHERE `is_head_office = true AND published = true` để mỗi workspace chỉ có một trụ sở chính đang hiển thị.
- Index: (`workspace`, `published`, `ordering`, `id`), (`created_by`), (`updated_by`).
- Quan hệ: mỗi workspace quản lý tập chi nhánh độc lập; Trang Liên hệ và Footer đọc các record `published = true` theo `ordering`.
- Mức độ: **BẮT BUỘC** — một cặp `address/map` trong `cic_config*` không biểu diễn được nhiều chi nhánh và làm phát sinh field cố định theo tên thành phố.
- Không lưu iframe HTML; `map_embed_url` chỉ nhận URL nhúng đã qua allowlist/validation. `map_search_query` là fallback để frontend tạo liên kết mở bản đồ.

### Mapping / lưu ý

- `settingId/path → name`, `liveValue/effectiveValue → value`, kiểu điều khiển → `data_type`; scope map vào đúng bảng `cic_config*` hiện có.
- `system.company.branches` trong CMS là màn quản trị collection trên `cic_branches`, không serialize cả danh sách vào một row `cic_config.value`.
- Dữ liệu pháp nhân, hotline và email chung tiếp tục nằm trong `cic_config*`; địa chỉ, điện thoại, email, giờ làm việc và map gắn với từng địa điểm nằm trong `cic_branches`.
- Page Builder chỉ giữ nội dung và cấu hình trình bày của section Liên hệ. Không lưu bản sao danh sách chi nhánh trong section config/reference; website resolve dữ liệu theo workspace khi đọc Published revision.
- Label, group, description, options, sensitivity, regex, unit và used-by là metadata manifest/application; không nhân bản thành column DB.
- Chính sách lưu cũng nằm trong manifest: cấu hình `standard` không có cảnh báo ảnh hưởng dùng `edit → save → Activity Log`; cấu hình `sensitive`, `secret` hoặc có `impactDescription` mới dùng `draft → compare → publish → version`.
- Inheritance/effective value và các số liệu issue/override là dữ liệu derive.
- Draft, atomic publish và version history chỉ áp dụng cho cấu hình ảnh hưởng lớn. Hiện chúng vẫn là local state/mock; chưa tạo bảng config workflow chỉ để giữ mockup. Lưu trực tiếp và publish đều phải ghi vào shared Activity Log khi backend được triển khai.
- Secret test/rotate hiện là mô phỏng. Không lưu secret thô hoặc lịch sử secret trong `cic_config*`; production cần cơ chế mã hóa/secret store được duyệt.

## SEO & URL

### Bảng hiện có cần mở rộng

| Table | Field thêm | Type | FK | Index | Mức độ | CMS mới sử dụng | Ghi chú |
| ----- | ---------- | ---- | -- | ----- | ------ | --------------- | ------- |
| `cic_config_modules` | `value_seo_keyword` | `varchar(255) NULL` | — | — | **TƯƠNG THÍCH** | Chỉ hiện trong phần legacy nâng cao | Giữ để đọc dữ liệu cũ; không còn là field chính của SEO UI. |
| `cic_config_modules` | `value_seo_description` | `varchar(255) NULL` | — | — | **BẮT BUỘC** | Editor Meta description route/module VI | Field legacy dùng thật; PostgreSQL draft hiện chỉ giữ `value_seo_title`. |
| `cic_config_modules` | `seo_indexable` | `boolean NOT NULL DEFAULT true` | — | Chỉ thêm index có điều kiện khi sitemap/noindex query cần | **BẮT BUỘC** | Checkbox cho phép lập chỉ mục VI | `published` là trạng thái cấu hình module, không phải robots index/noindex. |
| `cic_config_modules` | `canonical_path` | `varchar(500) NULL` | — | — | **BẮT BUỘC** | Canonical path của route/module VI | Chuẩn hóa path nội bộ; URL tuyệt đối được compose từ domain của workspace. |
| `cic_config_modules_en` | `value_seo_keyword` | `varchar(255) NULL` | — | — | **TƯƠNG THÍCH** | Chỉ hiện trong phần legacy nâng cao | Giữ để đọc dữ liệu cũ; không dùng làm tiêu chí health chính. |
| `cic_config_modules_en` | `value_seo_description` | `varchar(255) NULL` | — | — | **BẮT BUỘC** | Editor Meta description workspace EN | Giữ contract SEO title/keyword/description độc lập cho EN. |
| `cic_config_modules_en` | `seo_indexable` | `boolean NOT NULL DEFAULT true` | — | Chỉ thêm index có điều kiện khi sitemap/noindex query cần | **BẮT BUỘC** | Checkbox cho phép lập chỉ mục EN | Không dùng `published` thay cho robots policy. |
| `cic_config_modules_en` | `canonical_path` | `varchar(500) NULL` | — | — | **BẮT BUỘC** | Canonical path của route/module EN | Không suy diễn bằng cách nối `/en` nếu route registry có mapping riêng. |

Ngoài column, thêm unique index chuẩn hóa (`module`, `view`, `COALESCE(task, '')`) trên từng bảng VI/EN sau khi profiling NULL, khoảng trắng và record trùng. Mức độ **BẮT BUỘC** vì CMS dùng bộ ba này làm identity route/module.

### Bảng mới cần tạo

#### `cic_url_redirects`

- Columns: `id bigint identity`, `workspace varchar(16)`, `source_path varchar(1000)`, `target_path varchar(1000)`, `redirect_type smallint`, `source varchar(24)`, `status varchar(16) NOT NULL DEFAULT 'active'`, `created_at timestamptz`, `created_by integer NULL`, `updated_at timestamptz`, `updated_by integer NULL`.
- Constraint: `redirect_type IN (301, 302)`; source và target phải khác nhau; path phải được normalize trước khi unique check.
- FK: user audit FK dùng `ON DELETE SET NULL`.
- Unique/index: unique active (`workspace`, `lower(source_path)`); index (`workspace`, `status`) và (`target_path`).
- Mức độ: **BẮT BUỘC** — hỗ trợ redirect thủ công và redirect sinh tự động khi đổi slug; backend phải chặn loop và redirect chain không cần thiết.

Sitemap được derive từ route registry cùng content đã publish và `seo_indexable = true`; chưa tạo bảng sitemap riêng. Chỉ thêm bảng snapshot/job khi có yêu cầu lưu lịch sử generate hoặc submit thực tế.

### Mapping / lưu ý

- `title → value_seo_title`, `keywords → value_seo_keyword` (legacy), `description → value_seo_description`, `indexable → seo_indexable`, `canonicalPath → canonical_path`.
- `routeKey`, path, label, intent, category/detail hierarchy và owner/status compose từ `module + view + task` cùng route registry; không tạo column.
- Canonical mặc định có thể derive từ route registry; khi người dùng lưu override, ghi `canonical_path`. Backend phải kiểm tra canonical cùng workspace hoặc nằm trong allowlist domain.
- `fields_seo_*` tiếp tục giữ công thức SEO detail legacy; màn này chỉ sửa SEO trang chính của module.
- Không thêm `updated_at` chỉ vì ViewModel gán timestamp khi save; lịch sử thay đổi thuộc shared Activity Log sau audit riêng.
- Default title/description/social image và robots vẫn nằm trong `cic_config*`; GA/GTM thuộc nhóm Đo lường & tiếp thị, không thuộc SEO content.
- Khi slug của entity thay đổi, transaction publish phải tạo `cic_url_redirects` từ URL cũ sang URL mới hoặc yêu cầu người dùng xác nhận không tạo redirect.

## Ngôn ngữ giao diện

### Bảng hiện có cần mở rộng

Không có field cần thêm. Dùng `cic_languages_text` cho website, `cic_languages_text_admin` cho CMS và `cic_languages` làm danh mục locale.

Cần unique index `lower(trim(lang_key))` độc lập trên `cic_languages_text` và `cic_languages_text_admin` sau khi profiling key rỗng/trùng. Mức độ **BẮT BUỘC**; code cũ đã kiểm tra trùng ở application nhưng PostgreSQL chưa cưỡng chế.

### Bảng mới cần tạo

Không có.

### Mapping / lưu ý

- `key → lang_key`, `values.vi → lang_vi`, `values.en → lang_en`; `application` chọn bảng web/admin; `namespace → module` khi có mapping rõ ràng.
- `missing` và `active` có thể derive từ giá trị locale. `new`, `needs_check`, `deprecated` chỉ là fixture/filter, chưa có workflow ghi thật nên không thêm `status`.
- Description, context, default locale/value, required variables và length hint thuộc dictionary manifest, không thêm vào bảng legacy.
- `updatedAt`, `updatedBy`, `history` đang là mock; save hiện không tạo history record nên chưa tạo revision/history table.
- Không dùng `cic_languages_contents` hoặc `cic_translate_content` cho UI dictionary vì chúng mang ngữ nghĩa dịch nội dung/entity.

## Nhật ký hoạt động

### Bảng hiện có cần mở rộng

Không có. `cic_history`/`fs_history` là lịch sử tiền và dịch vụ với `money`, `service_name`, `service_id`; không đúng ngữ nghĩa audit quản trị và không nên mở rộng thành event log dùng chung.

### Bảng mới cần tạo

#### `cic_activity_logs`

| Column | Type | Constraint / ý nghĩa |
| ------ | ---- | -------------------- |
| `id` | `uuid` | PK, default UUID do PostgreSQL sinh |
| `occurred_at` | `timestamptz` | NOT NULL DEFAULT `now()` |
| `actor_id` | `integer` | NULL, FK → `cic_users(id)` ON DELETE SET NULL |
| `actor_label` | `varchar(255)` | NULL, snapshot/fallback cho system/legacy actor |
| `action_code` | `varchar(100)` | NOT NULL, mã ổn định từ action registry |
| `category` | `varchar(50)` | NOT NULL |
| `severity` | `varchar(16)` | NOT NULL, CHECK `low`, `medium`, `high`, `critical` |
| `is_sensitive` | `boolean` | NOT NULL DEFAULT `false` |
| `entity_type` | `varchar(100)` | NOT NULL |
| `entity_id` | `varchar(100)` | NULL, hỗ trợ ID legacy/new khác kiểu |
| `entity_title` | `text` | NULL, snapshot để log vẫn đọc được sau khi target đổi/xóa |
| `module` | `varchar(100)` | NULL |
| `workspace` | `varchar(50)` | NOT NULL |
| `locale` | `varchar(10)` | NULL |
| `result` | `varchar(16)` | NOT NULL, CHECK `success`, `failed`, `partial`, `denied` |
| `result_message` | `text` | NULL |
| `session_id` | `varchar(100)` | NULL |
| `correlation_id` | `varchar(100)` | NULL |
| `source_app` | `varchar(100)` | NULL |
| `environment` | `varchar(20)` | NULL, CHECK theo environment được hỗ trợ |
| `ip_address` | `inet` | NULL |
| `user_agent` | `text` | NULL |
| `http_method` | `varchar(10)` | NULL |
| `endpoint` | `text` | NULL |
| `execution_time_ms` | `integer` | NULL, CHECK `>= 0` |
| `before_data` | `jsonb` | NULL, dữ liệu trước thay đổi đã redaction |
| `after_data` | `jsonb` | NULL, dữ liệu sau thay đổi đã redaction |
| `redacted_fields` | `text[]` | NULL |

- Index: (`occurred_at` DESC), (`actor_id`, `occurred_at` DESC), (`action_code`, `occurred_at` DESC), (`entity_type`, `entity_id`, `occurred_at` DESC), (`category`, `result`, `occurred_at` DESC), `correlation_id` khi khác NULL.
- Quan hệ: actor dùng FK tùy chọn; target dùng polymorphic identity, không tạo FK giả tới các bảng domain.
- Append-only; retention/purge là job riêng có policy và quyền rõ ràng.
- Mức độ: **BẮT BUỘC** — CMS cần lọc/xem actor, action, target, scope, kết quả, request context và diff trước/sau.

#### `cic_audit_export_jobs`

- Columns: `id uuid`, `requested_at timestamptz`, `requested_by integer NULL`, `workspace varchar(50)`, `filter_payload jsonb`, `status varchar(16)`, `total_records integer NULL`, `file_path text NULL`, `file_size_bytes bigint NULL`, `expires_at timestamptz NULL`, `error_message text NULL`, `completed_at timestamptz NULL`.
- PK: `id`.
- FK: `requested_by → cic_users(id) ON DELETE SET NULL`.
- Index: (`requested_by`, `requested_at` DESC), (`status`, `requested_at`), (`expires_at`).
- Mức độ: **ĐỀ XUẤT** — drawer hiện chỉ tạo job bằng local state/timer; chỉ tạo khi worker xuất file thật được duyệt.

### Mapping / lưu ý

- Actor profile chủ yếu join từ `cic_users`/RBAC; chỉ giữ `actor_label` fallback, không lặp toàn bộ profile.
- Action label lấy từ registry theo `action_code`; không lưu chuỗi dịch trong log.
- DTO tạo `changes[]` từ `before_data`, `after_data`, `redacted_fields`. Secret, password, OTP và token phải được che trước INSERT.
- URL/site/module label có thể compose từ registry; `entity_title` là snapshot có chủ đích vì target có thể bị xóa.
- Không backfill log giả từ timestamps hoặc `cic_history`; chỉ import legacy event có mapping actor/action/entity kiểm chứng được.

## Thùng rác

### Bảng hiện có cần mở rộng

Không có. Không thêm `is_trash`, `deleted_at`, payload hoặc metadata restore vào từng bảng domain. Cơ chế `is_trash` riêng ở một số code Sản phẩm cũ không đáp ứng lifecycle dùng chung của CMS mới.

### Bảng mới cần tạo

#### `cic_trash_items`

| Column | Type | Constraint / ý nghĩa |
| ------ | ---- | -------------------- |
| `id` | `uuid` | PK, default UUID do PostgreSQL sinh |
| `workspace` | `varchar(50)` | NOT NULL |
| `entity_type` | `varchar(100)` | NOT NULL, theo registry entity được phép xóa |
| `entity_id` | `varchar(100)` | NOT NULL |
| `module` | `varchar(100)` | NOT NULL |
| `title_snapshot` | `text` | NOT NULL |
| `payload_snapshot` | `jsonb` | NOT NULL |
| `original_url` | `text` | NULL |
| `status` | `varchar(16)` | NOT NULL DEFAULT `'trashed'`, CHECK `trashed`, `restored`, `purged` |
| `deleted_by` | `integer` | NULL, FK → `cic_users(id)` ON DELETE SET NULL |
| `deleted_at` | `timestamptz` | NOT NULL DEFAULT `now()` |
| `purge_after` | `timestamptz` | NULL |
| `restore_state` | `varchar(20)` | NULL |
| `restored_by` | `integer` | NULL, FK → `cic_users(id)` ON DELETE SET NULL |
| `restored_at` | `timestamptz` | NULL |
| `purged_by` | `integer` | NULL, FK → `cic_users(id)` ON DELETE SET NULL |
| `purged_at` | `timestamptz` | NULL |
| `purge_reason` | `text` | NULL |
| `is_legal_hold` | `boolean` | NOT NULL DEFAULT `false` |
| `legal_hold_reason` | `text` | NULL |

- Unique: partial unique (`workspace`, `entity_type`, `entity_id`) WHERE `status='trashed'`.
- Index: (`status`, `deleted_at` DESC), (`status`, `purge_after`), (`deleted_by`, `deleted_at` DESC), (`entity_type`, `entity_id`), partial `purge_after` WHERE `status='trashed' AND is_legal_hold=false`.
- Quan hệ: polymorphic reference tới entity nguồn; các user lifecycle dùng FK thật.
- Mức độ: **BẮT BUỘC** — CMS cần snapshot, restore, conflict handling, retention, permanent purge và legal hold cho nhiều module.

### Mapping / lưu ý

- `itemType/moduleName → entity_type/module`, scope → `workspace`, `snapshotData → payload_snapshot`; `expiresAt/daysRemaining` derive từ `purge_after`.
- Dependency status/details phải được service tính lại khi xem/restore, không lưu thành nguồn cố định.
- Delete, restore và purge chạy transaction theo adapter từng entity; không giả định JSON snapshot tự khôi phục được mọi FK/media/relation.
- Legal hold phải chặn purge ở service và retention job, không chỉ disable nút UI.
- Restore mặc định Draft/Inactive; conflict mode và kết quả được ghi vào `cic_activity_logs`.
- Sau permanent purge, giữ lifecycle row `purged` nhưng redaction/xóa payload theo retention/privacy policy.
- Không tạo trash item cho dữ liệu legacy đang hoạt động; chỉ import record thật sự ở trạng thái trash và có mapping kiểm chứng được.

## Tổng hợp các đợt audit đã nhập

- Field mới bắt buộc trên bảng hiện có: **19 column trên 11 bảng vật lý**.
- Field mới đề xuất có điều kiện trên bảng hiện có: **1** — `cic_users.failed_login_attempts`, chỉ dùng khi authentication/lockout được triển khai thật.
- Bảng mới bắt buộc: **37** — đã bỏ ba bảng role-version không còn thuộc contract, bổ sung `cic_url_redirects`, `cic_content_embeds` và `cic_branches`.
- Bảng mới đề xuất có điều kiện: **3** — `cic_media_variants`, `cic_security_events`, `cic_audit_export_jobs`.
- Unique index alias mới bắt buộc: **16**, trong đó alias của bảng legacy chỉ áp dụng sau data profiling.
- Unique index code mới bắt buộc: **3** — (`workspace`, `code`) cho CTA và Form, cùng code chuẩn hóa của Role.
- Unique index identity Function SEO mới bắt buộc: **2** — (`module`, `view`, `COALESCE(task, '')`) độc lập cho VI/EN, chỉ áp dụng sau profiling.
- Unique index từ điển giao diện mới bắt buộc: **2** — `lower(trim(lang_key))` độc lập cho bảng Web/CMS, chỉ áp dụng sau profiling.
- Constraint thời gian Event mới bắt buộc: **2 CHECK**, chỉ validate sau cleanup legacy.
- Constraint hiện có cần sửa/xác minh: **8 FK của workspace EN đang trỏ sang bảng VI**, gồm thêm 2 FK Menu.

## Kết luận và kiểm tra độ đầy đủ

### Phạm vi đã bao phủ

File đã tổng hợp đủ các nhóm module được audit và không còn nhóm nào trong phạm vi đã giao bị thiếu:

- Nội dung: Tin tức, Danh mục tin tức, Trang nội dung, Sự kiện, Dự án, Dịch vụ.
- Sản phẩm: Sản phẩm, Danh mục sản phẩm, Hãng sản xuất, Lĩnh vực ứng dụng, Loại sản phẩm, Người phụ trách kinh doanh.
- Website dùng chung: Menu, Thư viện media, CTA, Biểu mẫu.
- Tương tác khách hàng: Yêu cầu khách hàng, Mẫu email.
- Quản trị: Người dùng, Vai trò & quyền, Cấu hình hệ thống, SEO & URL, Ngôn ngữ giao diện, Nhật ký hoạt động, Thùng rác.

Các tài liệu audit chi tiết tương ứng đã có từ `09-projects-schema-delta.md` đến `20-activity-logs-trash-schema-delta.md`. File này chỉ giữ kết quả cần ADD/sửa constraint/index, không chép lại toàn bộ PostgreSQL hiện hữu.

### Delta đã chốt trong phạm vi hiện tại

- Mở rộng bảng hiện có: **19 field bắt buộc trên 11 bảng vật lý**.
- Field có điều kiện: **1 field** bảo mật tài khoản, chỉ triển khai cùng authentication/lockout thật.
- Bảng mới bắt buộc: **37 bảng**.
- Bảng mới có điều kiện: **3 bảng**, không tạo cho đến khi chức năng backend tương ứng được duyệt: `cic_media_variants`, `cic_security_events`, `cic_audit_export_jobs`.
- Không thêm field trùng nghĩa chỉ để khớp tên DTO/ViewModel.
- Không xóa hoặc rename field legacy.
- Không rải `deleted_at`, `is_trash`, version, activity hoặc workflow field vào mọi bảng domain.
- Không tạo bảng mới cho dữ liệu derive như count, breadcrumb, usage, display owner, route label hoặc file size.

### Những phần đã xác nhận tái sử dụng, không cần ADD

- Core nội dung, sản phẩm, sự kiện, dịch vụ, menu và master data tiếp tục dùng các bảng `cic_*` đã migrate từ legacy.
- Cấu hình hệ thống tiếp tục dùng `cic_config*`; metadata field/editor nằm trong application manifest.
- Từ điển giao diện tiếp tục dùng `cic_languages_text` và `cic_languages_text_admin`.
- Catalog quyền tiếp tục dùng `cic_permission_tasks`; quyền trực tiếp `cic_users_permission*` chỉ dùng để đối chiếu và chuyển đổi trong giai đoạn migration.
- SEO entity tiếp tục dùng các field `seo_*` hiện có; SEO & URL dùng `cic_config_modules*` cùng `cic_url_redirects` sau khi bổ sung đúng các field bị thiếu.
- `cic_history` giữ nguyên nghĩa lịch sử tiền/dịch vụ, không dùng làm audit log quản trị.

### Gate bắt buộc trước khi viết migration

1. Profiling NULL, chuỗi rỗng, khoảng trắng, hoa/thường và dữ liệu trùng trước mọi unique index alias, code, route identity và `lang_key`.
2. Kiểm tra orphan, sentinel `0`, self-reference và cycle trước khi sửa **8 FK workspace EN** đang trỏ sang bảng VI.
3. Đối soát `cic_event.end_time` với `updated_time`; dữ liệu audit cũ phải về `NULL` trước khi validate hai CHECK thời gian.
4. Chốt manifest route/action/entity/workspace và allowlist polymorphic trước khi tạo SEO & URL, Activity Log, Trash và Customer Request overlay.
5. Chốt ownership, delete rule và restore transaction cho toàn bộ FK/relation/media của các bảng mới; không dựa vào JSON snapshot như cơ chế khôi phục duy nhất.
6. Chụp manifest quyền hiệu lực từng user và chứng minh parity **100%** trước khi RBAC mới tham gia quyết định quyền.
7. Kiểm tra dependency vòng của các cặp pointer/version và chỉ thêm FK pointer sau khi bảng đích tồn tại, dữ liệu đã hợp lệ.
8. Lập migration additive theo từng module, có rollback và backfill riêng; không gộp toàn bộ delta thành một migration lớn.

### Kết quả kiểm tra

- **Đủ về phạm vi audit và tài liệu Schema Delta**: tất cả module đã yêu cầu đều có section và nguồn audit chi tiết tương ứng.
- **Chưa sẵn sàng chạy migration ngay**: các bước profiling, xác minh FK, cleanup Event, permission parity và phê duyệt năm bảng có điều kiện vẫn phải hoàn thành.
- Không phát hiện nhu cầu thiết kế lại toàn bộ database. Hướng triển khai vẫn là mở rộng additive, giữ dữ liệu legacy và thay mock bằng data boundary theo từng module.
- Tài liệu này chưa phải migration SQL và không tự cấp phép sửa database production.
