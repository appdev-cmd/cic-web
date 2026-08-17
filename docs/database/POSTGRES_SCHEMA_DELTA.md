# PostgreSQL Schema Delta

Tài liệu này chỉ tổng hợp những thay đổi cần bổ sung vào PostgreSQL hiện tại sau từng đợt audit. Đây không phải tài liệu mô tả toàn bộ schema, không chứa migration SQL và không thay thế bước profiling dữ liệu legacy.

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

- `slug → alias`, `status → published`, `meta_title → seo_title`, `meta_description → seo_description`; `canonical_url` map vào `link` hiện có hoặc derive từ alias.
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

- `logo → image`, `status → published`, `is_featured → show_in_homepage`.
- `country` và `website` là hai dữ liệu form đang chỉnh sửa nhưng PostgreSQL chưa có field tương đương; không nhét website vào Rich Text.
- Checkbox “Trang chủ & Footer” hiện dùng một policy qua `show_in_homepage`; chưa thêm cờ footer riêng khi CMS không quản trị hai vị trí độc lập.

## Lĩnh vực ứng dụng

### Bảng hiện có cần mở rộng

Không có field cần thêm; dùng `cic_application`/`cic_application_en`.

### Bảng mới cần tạo

Không có.

### Mapping / lưu ý

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

- `code`/`type_code → alias`, `icon → image`, `status → published` theo contract hiện tại.
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

## Tổng hợp các đợt audit đã nhập

- Field mới bắt buộc: **6 column trên 4 bảng vật lý**.
- Bảng mới bắt buộc: **0**.
- Index mới bắt buộc: **8 unique index alias**, chỉ áp dụng sau data profiling.
- Constraint hiện có cần sửa/xác minh: **6 FK của workspace EN đang trỏ sang bảng VI**.
