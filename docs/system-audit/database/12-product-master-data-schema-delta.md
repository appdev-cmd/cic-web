# Schema Delta — Master data sản phẩm

Phạm vi: Hãng sản xuất, Lĩnh vực ứng dụng, Loại sản phẩm và Người phụ trách kinh doanh.

## Nguồn đối chiếu

- Legacy CMS: `httpdocs/cms/modules/products` với các model/view `manufactories`, `application`, `types` và `business`.
- PostgreSQL: `cic_manufactories*`, `cic_application*`, `cic_products_types*`, `cic_business*` trong `db_migrate/cic14005_cic_fs_schema_moi_postgresql_PATCHED.sql`.
- React CMS mới: phần tương ứng trong `src/cms/modules/product_settings`, `src/cms/data/CatalogDataSource.ts` và select của form Sản phẩm.
- Chỉ ghi delta cần thêm; không mô tả toàn bộ schema và không chứa migration SQL.

## Field cần thêm

| Mức độ | Table | Field mới | Type | Nullable/default | FK | Index/unique | CMS mới sử dụng | Lý do |
|---|---|---|---|---|---|---|---|---|
| **BẮT BUỘC** | `cic_manufactories` | `country` | `varchar(255)` | `NULL`, mặc định `NULL` | Không | Không | Form Hãng sản xuất: “Quốc gia sản xuất” | Không có field PostgreSQL hiện tại cùng nghĩa; đây là dữ liệu domain cần lưu và chỉnh sửa độc lập. Record legacy nhận `NULL`. |
| **BẮT BUỘC** | `cic_manufactories` | `website` | `varchar(2048)` | `NULL`, mặc định `NULL` | Không | Không | Form Hãng sản xuất: “Website chính thức Hãng” | URL cần validate/render độc lập; không nhét vào `description` hoặc Rich Text. Record legacy nhận `NULL`. |
| **BẮT BUỘC** | `cic_manufactories_en` | `country` | `varchar(255)` | `NULL`, mặc định `NULL` | Không | Không | Form Hãng sản xuất workspace EN | Giữ contract tương ứng của workspace EN; không tự sinh nội dung khi migrate. |
| **BẮT BUỘC** | `cic_manufactories_en` | `website` | `varchar(2048)` | `NULL`, mặc định `NULL` | Không | Không | Form Hãng sản xuất workspace EN | Giữ contract tương ứng của workspace EN; record legacy nhận `NULL`. |
| **BẮT BUỘC** | `cic_products_types` | `updated_time` | `timestamptz` | `NULL`, mặc định `NULL` trong migration đầu | Không | Không | List master data hiển thị thời gian cập nhật; form luôn tạo `updated_time` khi lưu | Bảng loại sản phẩm chỉ có `created_time`, trong khi các master data còn lại đã có timestamp cập nhật. Không backfill thời gian giả cho legacy; ứng dụng ghi khi record được sửa. |
| **BẮT BUỘC** | `cic_products_types_en` | `updated_time` | `timestamptz` | `NULL`, mặc định `NULL` trong migration đầu | Không | Không | List/form Loại sản phẩm workspace EN | Cùng contract với bảng VI; record legacy giữ `NULL` tới lần cập nhật đầu. |

Không có field **ĐỀ XUẤT** chưa bắt buộc trong phạm vi audit này.

## Bảng mới cần tạo

Không có.

## Mapping / lưu ý theo module

### Hãng sản xuất

- Tái sử dụng `name`, `code`, `description`, `image`, `published`, `ordering`, `created_time`, `updated_time`.
- Form dùng trực tiếp `name` cho “Tiêu đề dữ liệu” và `alias` cho “Tên hiệu”; alias được application tự sinh từ tiêu đề. Không thêm field định danh mới.
- CMS mới không hiển thị/chỉnh sửa `description` trong form hoặc list Hãng; field legacy vẫn được giữ nguyên để bảo toàn dữ liệu cũ.
- `logo → image`, `status → published`, `is_featured → show_in_homepage`.
- Checkbox mới đang diễn đạt chung “Trang chủ & Footer”; application layer dùng `show_in_homepage` theo đúng một policy hiển thị, không thêm hai cờ trùng lặp khi UI chưa quản trị chúng độc lập.
- Chỉ `country` và `website` là dữ liệu form đang ghi nhưng chưa có nguồn tương đương.

### Lĩnh vực ứng dụng

- Dùng `cic_application`/`cic_application_en`; `name`, `code`, `description`, `image`, `color_code`, trạng thái, ordering và timestamps đã có.
- “Tiêu đề dữ liệu” map vào `name`; “Tên hiệu” map thẳng vào `alias` và được application tự sinh.
- CMS mới không hiển thị/chỉnh sửa `description` trong form hoặc list Lĩnh vực; field legacy vẫn được giữ nguyên.
- `icon → image`, `color_badge → color_code`, `status → published`.
- `sector_group` hiện chỉ là state/default trong mock payload, không có control chỉnh sửa và chưa được frontend đọc độc lập. Không thêm field.
- Sản phẩm hiện lưu danh sách application ID trong `cic_products.application` để tương thích legacy. Chưa tạo relation table chỉ nhằm làm schema đẹp hơn.

### Loại sản phẩm

- Dùng `cic_products_types`/`cic_products_types_en`; `name`, `alias`, `description`, `image`, `published`, `ordering`, `created_time` đã có.
- “Tiêu đề dữ liệu” map vào `name`; “Tên hiệu” map thẳng vào `alias` và được application tự sinh. `icon → image`, `status → published`.
- CMS mới không hiển thị/chỉnh sửa `description` trong form hoặc list Loại sản phẩm; field legacy vẫn được giữ nguyên.
- `requires_license_key` và `pricing_model_default` chỉ được gán từ default/mock, chưa có control chỉnh sửa và chưa tham gia logic sản phẩm/frontend. Không thêm field.
- Chỉ bổ sung `updated_time`; khi triển khai schema sau này cần cơ chế cập nhật timestamp nhất quán với các master table khác.

### Người phụ trách kinh doanh

- CMS cũ quản lý nhân viên này bằng `fs_business`; PostgreSQL tương ứng là `cic_business`/`cic_business_en`. Không tạo entity nhân viên mới và không dùng `cic_email` làm bảng nhân sự.
- `name`, `code`, `alias`, `phone`, `Skype`, `Zalo`, `image`, trạng thái, ordering và timestamps đã có.
- Năm nhóm chọn sản phẩm map trực tiếp: `contact_product_ids → lienhe`, `sales_product_ids → lienhe_kd`, `technical_support_product_ids → lienhe_kt`, `north_sales_product_ids → lienhe_kdmb`, `south_sales_product_ids → lienhe_kdmn`.
- Các field `lienhe*` tiếp tục lưu danh sách ID legacy trong giai đoạn compatibility. Chưa tạo năm relation table vì CMS cũ, PostgreSQL hiện tại và form mới đã cùng một semantics; chỉ audit lại nếu backend cần FK/query/reorder từng quan hệ.
- `usage_count` là derived từ các assignment; `updated_by` thuộc audit/user context. Không thêm hai field này vào `cic_business*`.

## Kết quả cuối

- **Field ADD bắt buộc:** 6 column trên 4 bảng vật lý.
- **Field ADD đề xuất:** 0.
- **Bảng ADD:** 0.
- **Index/FK ADD:** 0.
- Dữ liệu legacy cho các field mới giữ `NULL`; migration không tự sinh quốc gia, website hoặc thời gian cập nhật không tồn tại.
