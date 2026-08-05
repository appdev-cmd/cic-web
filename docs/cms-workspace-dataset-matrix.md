# Ma trận workspace dataset của CMS

## 1. Mục đích

Tài liệu này là nguồn quyết định chính thức cho việc một chức năng CMS dùng dữ liệu độc lập theo workspace VI/EN hay dùng dữ liệu chung toàn hệ thống.

Nguồn đối chiếu: `db_migrate/cic14005_cic_fs_schema_moi_postgresql_PATCHED.sql`.

## 2. Quy tắc quyết định

1. Bảng nghiệp vụ có cặp `<table>` và `<table>_en` thì module phải dùng hai dataset độc lập.
2. Không fallback bản ghi nghiệp vụ từ VI sang EN hoặc ngược lại.
3. Bảng không có cặp `_en` mặc định là dữ liệu global, trừ khi có bằng chứng schema khác.
4. Module gồm cả bảng có `_en` và bảng global được đánh dấu `Mixed`; UI phải tách rõ phần nào đổi theo workspace.
5. Chức năng mới chưa có bảng nguồn được đánh dấu `Chưa xác định`; không tự gán locale scope.
6. UI language là preference riêng, không quyết định dataset nghiệp vụ.

## 3. Danh sách đầy đủ 31 cặp bảng VI/EN

| STT | Bảng VI | Bảng EN | Module/nhóm chức năng |
|---:|---|---|---|
| 1 | `cic_address` | `cic_address_en` | Địa điểm/địa chỉ |
| 2 | `cic_cities` | `cic_cities_en` | Tỉnh, thành phố |
| 3 | `cic_regions` | `cic_regions_en` | Khu vực |
| 4 | `cic_menus_groups` | `cic_menus_groups_en` | Nhóm menu website |
| 5 | `cic_menus_items` | `cic_menus_items_en` | Menu website |
| 6 | `cic_config` | `cic_config_en` | Cấu hình website theo ngôn ngữ |
| 7 | `cic_config_modules` | `cic_config_modules_en` | Cấu hình module/SEO theo ngôn ngữ |
| 8 | `cic_contents` | `cic_contents_en` | Trang nội dung |
| 9 | `cic_contents_categories` | `cic_contents_categories_en` | Nhóm trang nội dung |
| 10 | `cic_news` | `cic_news_en` | Tin tức |
| 11 | `cic_news_categories` | `cic_news_categories_en` | Danh mục tin tức |
| 12 | `cic_event` | `cic_event_en` | Sự kiện |
| 13 | `cic_products` | `cic_products_en` | Sản phẩm |
| 14 | `cic_products_categories` | `cic_products_categories_en` | Nhóm sản phẩm |
| 15 | `cic_products_categories_rel` | `cic_products_categories_rel_en` | Quan hệ sản phẩm–nhóm |
| 16 | `cic_products_images` | `cic_products_images_en` | Ảnh gắn với sản phẩm |
| 17 | `cic_products_tables` | `cic_products_tables_en` | Bảng thông số sản phẩm |
| 18 | `cic_products_types` | `cic_products_types_en` | Loại sản phẩm |
| 19 | `cic_manufactories` | `cic_manufactories_en` | Hãng sản xuất |
| 20 | `cic_banners` | `cic_banners_en` | Banner |
| 21 | `cic_banners_categories` | `cic_banners_categories_en` | Vị trí/nhóm banner |
| 22 | `cic_slideshow` | `cic_slideshow_en` | Slideshow |
| 23 | `cic_slideshow_categories` | `cic_slideshow_categories_en` | Nhóm slideshow |
| 24 | `cic_contact` | `cic_contact_en` | Yêu cầu liên hệ |
| 25 | `cic_email` | `cic_email_en` | Mẫu email |
| 26 | `cic_types_email` | `cic_types_email_en` | Loại mẫu email |
| 27 | `cic_business` | `cic_business_en` | Nội dung/lĩnh vực kinh doanh |
| 28 | `cic_services` | `cic_services_en` | Dịch vụ |
| 29 | `cic_image` | `cic_image_en` | Album/thư viện ảnh |
| 30 | `cic_image_images` | `cic_image_images_en` | Ảnh trong thư viện |
| 31 | `cic_application` | `cic_application_en` | Lĩnh vực ứng dụng sản phẩm |

## 4. Ma trận quyết định theo module CMS

| Module CMS | Chế độ | Căn cứ | Hành vi bắt buộc |
|---|---|---|---|
| Dashboard | Mixed | Tổng hợp nhiều module | Mỗi số liệu phải lấy đúng scope của nguồn; không gộp ngầm VI/EN |
| Tin tức | Workspace | `cic_news*`, `cic_news_categories*` | Dataset độc lập; không có chức năng dịch từng bài |
| Trang nội dung | Workspace | `cic_contents*`, `cic_contents_categories*` | Dataset độc lập; không fallback |
| Sự kiện | Workspace | `cic_event*` | Dataset độc lập; dữ liệu liên quan phải cùng workspace |
| Sản phẩm | Workspace | Nhóm `cic_products*` | Dataset độc lập, kể cả ảnh/thông số/quan hệ |
| Nhóm và thuộc tính sản phẩm | Mixed | Category/type/manufacturer/application có `_en`; nhân sự không có | Danh mục đổi theo workspace; nhân sự phụ trách dùng chung |
| Dịch vụ | Workspace | `cic_services*` | Dataset độc lập; không có tiến độ dịch trong record |
| Menu website | Workspace | `cic_menus_groups*`, `cic_menus_items*` | Menu VI và EN độc lập |
| Banner và slideshow | Workspace | `cic_banners*`, `cic_slideshow*` | Dataset độc lập; một menu CMS chung cho cùng màn hình quản lý |
| Khối nội dung | Chưa xác định | Không có bảng content block riêng trong schema | Chưa áp dụng locale contract cho tới khi xác định bảng lưu |
| Thư viện ảnh | Workspace | `cic_image*`, `cic_image_images*` | Record album/ảnh độc lập; file vật lý có thể dùng chung nếu storage hỗ trợ |
| Yêu cầu liên hệ | Workspace | `cic_contact*` | Hai hàng đợi độc lập theo workspace; không dùng `source_locale` để thay thế bảng EN |
| Mẫu email | Workspace | `cic_email*`, `cic_types_email*` | Template độc lập; địa chỉ gửi và routing không lưu lặp trong template |
| Địa điểm | Workspace | `cic_address*`, `cic_cities*`, `cic_regions*` | Dataset độc lập |
| Người dùng | Global | Chỉ có `cic_users` | Không hiển thị hoặc lọc theo workspace |
| Vai trò và quyền | Global | Các bảng `cic_*permission*` không có `_en` | Một hệ quyền dùng chung; không tạo role VI/EN |
| Cấu hình website | Workspace | `cic_config*`, `cic_config_modules*` | Giá trị cấu hình website theo workspace |
| Cấu hình EnjiCAD | Global | Chỉ có `cic_config_enjicad` | Không đổi theo workspace |
| Nhật ký hoạt động | Global | Không có cặp bảng audit `_en` | Một lịch sử hệ thống; event có thể ghi locale của đối tượng nếu cần |
| Thùng rác | Global index | Không có cặp bảng trash `_en` | Một nơi quản lý; từng item phải hiển thị module/workspace nguồn |
| Ngôn ngữ giao diện | Global resource | Không phải business record | Chỉ quản lý label, validation, toast, placeholder và trợ giúp |

## 5. Các contract hiện tại phải sửa

### 5.1 Contacts

Contract hàng đợi global + `source_locale` không khớp schema. Phải đổi thành `contactsByLocale`. Có thể giữ thông tin locale nguồn để audit, nhưng không dùng nó thay cho hai bảng độc lập.

### 5.2 Media

Không dùng một `sharedLibrary` duy nhất cho record album/ảnh. Cần `mediaByLocale`; lớp storage/file có thể là global nhưng nằm ngoài record nghiệp vụ của module.

### 5.3 Product Settings

Không đưa toàn bộ module vào một dataset locale. Cần tách:

- Workspace: nhóm sản phẩm, loại sản phẩm, hãng sản xuất, lĩnh vực ứng dụng.
- Global: nhân sự phụ trách và quy tắc phân công nếu không có bảng `_en` tương ứng.

### 5.4 Content Blocks

Tạm bỏ kết luận `contentBlocksByLocale`. Trước khi nối backend phải xác nhận khối nội dung lưu ở `cic_contents`, cấu hình, hay một bảng mới.

### 5.5 Governance

- Users và Permission là global.
- System Configuration là mixed.
- Audit và Trash là global index; locale chỉ là metadata của item/event, không phải workspace dataset của màn hình.

## 6. Quy tắc UI sau khi áp dụng

- Chỉ màn hình `Workspace` hoặc phần workspace trong màn hình `Mixed` mới phản ứng với bộ chuyển VI/EN.
- Màn hình global không hiển thị hậu tố `· VI`, `· EN`, badge workspace hoặc ghi chú locale.
- Module workspace không hiển thị tab dịch, cột tiến độ dịch hoặc nút “Dịch sang ngôn ngữ khác”.
- Khi workspace không có dữ liệu, hiển thị empty state; không lấy dữ liệu workspace còn lại.
- Với màn hình mixed, phần global phải giữ nguyên khi đổi workspace; chỉ danh mục locale được tải lại.

## 7. Kiểm thử bắt buộc

- Chuyển VI → EN trên từng module workspace không còn record VI.
- Chuyển VI → EN trên Users/Permission không remount hoặc thay đổi dataset.
- Product Settings chỉ đổi category/type/manufacturer/application; staff/routing giữ nguyên.
- Contacts VI và EN là hai danh sách độc lập.
- Media VI và EN có record độc lập; không nhân đôi file storage nếu dùng chung URL.
- Audit/Trash hiển thị workspace nguồn của item nhưng không bị chia thành hai màn hình độc lập.
- Không module nghiệp vụ nào còn chức năng dịch nội bộ sau khi đã tách workspace.
