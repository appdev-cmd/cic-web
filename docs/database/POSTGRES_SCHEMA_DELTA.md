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

## Tổng hợp các đợt audit đã nhập

- Field mới bắt buộc: **0**.
- Bảng mới bắt buộc: **0**.
- Index mới bắt buộc: **8 unique index alias**, chỉ áp dụng sau data profiling.
- Constraint hiện có cần sửa/xác minh: **6 FK của workspace EN đang trỏ sang bảng VI**.
