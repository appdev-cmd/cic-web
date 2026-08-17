# Schema Delta — Sản phẩm và Danh mục sản phẩm

## Phạm vi và nguồn đối chiếu

- Legacy CMS/website: `httpdocs/cms/modules/products`, `httpdocs/modules/products` và các bảng `fs_products*`, `fs_manufactories`, `fs_application` được code cũ truy cập.
- PostgreSQL baseline: `db_migrate/cic14005_cic_fs_schema_moi_postgresql_PATCHED.sql`.
- React CMS/frontend: `src/cms/modules/products`, phần `categories` trong `src/cms/modules/product_settings`, `src/cms/data/CatalogDataSource.ts`, `src/web/features/products` và các component list/detail sản phẩm.
- Tài liệu chỉ ghi phần cần **thêm**. Không mô tả lại toàn bộ schema và không chứa migration SQL.

## Kết luận ngắn

Không cần thêm column nghiệp vụ và không cần tạo bảng mới cho Sản phẩm hoặc Danh mục sản phẩm theo save/read contract hiện tại.

Các nguồn đã có đáp ứng được chức năng mới:

- Sản phẩm dùng các field legacy hiện có cho tên/alias/code, tóm tắt, Rich Text, tính năng, video, ảnh/icon, giá, hiển thị, SEO và sáu nhóm file tải xuống.
- Danh mục N-N đã có `cic_products_categories_rel`/`cic_products_categories_rel_en`; `category_id` dạng CSV chỉ giữ để migrate và compatibility.
- Hãng, ứng dụng và loại sản phẩm đã có entity/bảng nguồn. CMS nhận object/select option qua query/mapper, không nhân bản tên hiển thị thành field mới.
- Gallery dùng `cic_products_images*`; tài liệu tải xuống dùng các field file/link legacy. Metadata như loại và kích thước file được derive khi đọc.
- Danh mục đã có cây cha/con, alias, mô tả, ảnh/icon, trạng thái, ordering, SEO và timestamps.

## ADD bắt buộc

Không có field mới và không có bảng mới bắt buộc.

### Unique index cho alias

PostgreSQL hiện chỉ có index thường trên alias. CMS tạo alias và website tra cứu detail/category bằng alias, do đó cần unique index sau khi profiling dữ liệu thật.

| Mức độ | Bảng | Bổ sung | Điều kiện trước khi áp dụng | Lý do |
|---|---|---|---|---|
| **BẮT BUỘC** | `cic_products` | unique index trên alias chuẩn hóa | Kiểm tra NULL/rỗng/trùng sau trim và so sánh không phân biệt hoa thường | Route sản phẩm VI phải xác định đúng một record |
| **BẮT BUỘC** | `cic_products_en` | unique index trên alias chuẩn hóa | Profiling độc lập dataset EN | Route sản phẩm EN phải xác định đúng một record |
| **BẮT BUỘC** | `cic_products_categories` | unique index trên alias chuẩn hóa | Kiểm tra NULL/rỗng/trùng và ngoại lệ legacy | Route danh mục VI và validation CMS |
| **BẮT BUỘC** | `cic_products_categories_en` | unique index trên alias chuẩn hóa | Profiling độc lập dataset EN | Route danh mục EN và validation CMS |

Không ép `alias NOT NULL` trong migration đầu nếu dữ liệu legacy chưa đạt. Có thể dùng partial unique index loại NULL/rỗng trong giai đoạn chuyển tiếp; quy tắc chính xác chỉ chốt sau data profiling.

## ADD đề xuất

Không có đề xuất thêm column/table riêng cho hai module tại thời điểm audit.

Các property sau không được chấp nhận là Schema Delta:

- `title`, `sku`, `short_description`, `content_html`, `video_url`, `meta_*`, `brand_id`, `product_type`: map lần lượt vào `name`, `code`, `summary`, `description`, `video`, `seo_*`, `manufactory`, `types_id`/`types`.
- `gallery`: dùng `cic_products_images*`; không lưu thêm mảng URL trong `cic_products`.
- `documents`, `file_type`, `file_size`, `version`, `access`: form hiện lưu vào các field file/link legacy; size/type derive từ file. Chưa có write contract quản lý document entity/version/access độc lập.
- `highlights`, `tech_specs`: form hiện không ghi các object mock này. Nội dung thông thường dùng `feature_details`/Rich Text và cơ chế field/filter legacy; không tạo JSON/column theo fixture.
- `unit`, `origin`, `availability_signal`, `canonical_url`, `inquiry_routing`, `site_placement`, `scheduled_publish_time`: chỉ nằm trong type/mock hoặc chưa xuất hiện trong save form. Không thêm field khi chưa có write contract thật.
- `owner_id`, trạng thái kép, completeness/version/activity: dùng user/business relation, mapping từ trạng thái hiện có hoặc UI-derived/shared audit; không thêm vào bảng Product.
- `site_scope` của danh mục: state/payload hiện tồn tại trong mock form nhưng không có control chỉnh sửa và không được website đọc. Chưa đủ cơ sở persistent storage.
- `canonical_url` của danh mục: có thể map vào `link` hiện có hoặc derive từ `alias`; không thêm field trùng nghĩa.
- `usage_count`/`count`: tính từ bảng relation hoặc dùng `total_products` legacy làm cache sau khi xác minh; không tạo count column mới.

## Blocker phát hiện nhưng không phải ADD

Các FK workspace EN sau đang trỏ sang bảng VI và cần audit dữ liệu trước khi sửa constraint:

- `cic_products_categories_en.parent_id → cic_products_categories(id)` cần self-reference tới `cic_products_categories_en(id)`.
- `cic_products_categories_en.root_id → cic_products_categories(id)` cần self-reference tới `cic_products_categories_en(id)`.
- `cic_products_en.types_id → cic_products_types(id)` cần xác minh mô hình workspace; nếu loại sản phẩm EN độc lập thì trỏ `cic_products_types_en(id)`.
- `cic_products_images_en.record_id → cic_products(id)` cần trỏ `cic_products_en(id)` nếu gallery EN độc lập.

Đây là sửa constraint hiện có, không phải thêm field/table. Trước khi đổi phải kiểm tra orphan, sentinel `0`, tính tương ứng ID VI/EN và dữ liệu đang dùng chung có chủ đích hay không.

## Kết quả cuối

- **Field ADD bắt buộc:** 0.
- **Bảng ADD bắt buộc:** 0.
- **Index ADD bắt buộc:** 4 unique index alias, sau data profiling.
- **Field/bảng ADD đề xuất:** 0 tại thời điểm audit.
- **Blocker ngoài ADD:** 4 FK EN cần xác minh/sửa đích theo workspace.
