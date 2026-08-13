# Audit hiện trạng website và CMS

> Ngày audit: 2026-08-13  
> Phạm vi: source frontend/CMS mới, mock data, CMS legacy trong `httpdocs`, MySQL legacy và schema PostgreSQL đã patch.  
> Trạng thái: tài liệu phân tích; **không phải migration và không thay đổi source/database**.

## Kết luận điều hành

- PostgreSQL mới đã giữ phần lớn cấu trúc dữ liệu vận hành của CMS cũ. Tin tức, Sự kiện, Sản phẩm, Thiết lập sản phẩm, Dịch vụ, Menu, Người dùng, quyền legacy, cấu hình chung, SEO chức năng và ngôn ngữ có nguồn tương ứng rõ ràng.
- Phần lớn khác biệt tên trong CMS/frontend mới là DTO/view-model: `shortDescription` → `summary`, `slug` → `alias`, `avatar` → `image`, `publishedAt` → `created_time` hoặc thời điểm xuất bản đã thống nhất. Không cần tạo column trùng nghĩa.
- Mock frontend đang mô tả nhiều dữ liệu hơn CMS cũ. Mock không phải bằng chứng để sửa schema. Nội dung bài/dịch vụ/sự kiện thông thường tiếp tục dùng `content` rich text.
- Các chức năng thực sự mới chưa có bảng nguồn phù hợp là Page Builder, Media library chuẩn hóa, CTA, Form, Yêu cầu khách hàng hợp nhất, Mẫu email, role-based permission mở rộng, audit log và Thùng rác. Chúng cần thiết kế bảng riêng khi triển khai backend, không nhồi vào bảng legacy.
- Chỉ có hai trạng thái biên tập nội dung: Draft và Published. Các field/chip/tab “duyệt”, “chờ duyệt”, reviewer/approver trong mock không được đưa vào contract nội dung.

## Nguồn đã kiểm tra

| Lớp | Nguồn |
|---|---|
| CMS mới | `src/cms/modules/**`, route trong CMS, types và mock của từng module |
| Website mới | `src/web/components/**`, `src/web/data/**`, `src/shared/types/index.ts` |
| CMS cũ | `httpdocs/cms/modules/**` và code public legacy liên quan |
| MySQL cũ | `db_migrate/cic14005_cic_fs.sql` |
| PostgreSQL mới | `db_migrate/cic14005_cic_fs_schema_moi_postgresql_PATCHED.sql` |
| Báo cáo migrate | `db_migrate/export_report.json`, `migration_report.json`, `fk_statistics.json` |

## Kiến trúc hiện tại

### Website/CMS mới

Đây vẫn là ứng dụng React dùng mock data. Website render trực tiếp từ các file `src/web/data`; CMS dùng mock/type riêng trong từng module. Vì chưa có backend chung, một entity có thể có ba tên khác nhau ở website, CMS và database. Đây là vấn đề adapter/contract, không phải mặc định là vấn đề schema.

### CMS và database cũ

CMS cũ dùng các bảng `fs_*`; schema PostgreSQL đổi tiền tố thành `cic_*`, bảo toàn nhiều column legacy và nâng kiểu dữ liệu/FK/index. VI và EN thường là hai bảng độc lập (`cic_news`/`cic_news_en`, tương tự với event, product, service...). Không được tự động fallback hoặc trộn workspace.

## Trạng thái theo module

| Module | Nguồn dữ liệu chính | Đánh giá |
|---|---|---|
| Tin tức | `cic_news`, `cic_news_categories` (+ `_en`) | Tương thích cao; chủ yếu map tên và relation liên quan |
| Trang nội dung | `cic_contents` legacy; Page Builder chưa có bảng | Chức năng mới; giữ legacy để migrate/rollback, tạo model Page/Section riêng sau |
| Sự kiện | `cic_event` (+ `_en`) | Tương thích cao; mock detail đang vượt dữ liệu thực |
| Sản phẩm | cụm `cic_products*`, manufactories/application/business/email | Tương thích cao nhưng type CMS mới có nhiều alias/field trình bày trùng nghĩa |
| Thiết lập sản phẩm | categories, types, manufactories, application, business, email | Tương thích cao; “người phụ trách” dùng business/email legacy |
| Dịch vụ | `cic_services` (+ `_en`) | Nội dung chính map được; nên dùng rich text thay các block mock |
| Menu | `cic_menus_groups`, `cic_menus_items` (+ `_en`) | Tương thích; cây/visibility cơ bản có thể map, state UI không lưu DB |
| Media | `cic_image*`, gallery/slideshow/video và path file legacy | Nguồn phân mảnh; cần lớp Media mới nếu muốn asset/version/folder thống nhất |
| CTA | Không có module generic tương ứng | Chức năng mới; link/nút hard-code cũ không đủ làm nguồn quản trị |
| Biểu mẫu | Form legacy nằm rải trong module contact/order/product contact | Chức năng mới; schema form động cần bảng riêng |
| Yêu cầu khách hàng | `cic_contact`, `cic_product_contact`, `cic_order*` | Cần adapter hợp nhất; không làm mất record và loại yêu cầu nguồn |
| Mẫu email | `cic_email`/`cic_types_email` không phải thư viện template | Chức năng mới; không tái sử dụng sai nghĩa bảng nhân viên/routing |
| Người dùng | `cic_users` | Core tương thích; security/status mở rộng là dữ liệu mới có chủ đích |
| Vai trò & quyền | cụm `cic_permission*`, `cic_users_permission*` | Quyền legacy theo user được giữ; role/version là lớp mới |
| Cấu hình hệ thống | `cic_config` (+ workspace variants) | Core key/value tương thích; metadata UI có thể là code |
| SEO chức năng | `cic_config_modules` (+ `_en`) | Có nguồn tương ứng; hierarchy/label có thể compose từ route/module |
| Ngôn ngữ giao diện | `cic_languages*`, `cic_translate_content` | Có nguồn; workflow duyệt trong mock không thuộc yêu cầu hiện tại |
| Nhật ký hoạt động | `cic_history` không đúng nghĩa audit CMS | Cần bảng audit mới; không dùng history nghiệp vụ/tiền dịch vụ |
| Thùng rác | Không có soft-delete thống nhất | Cần bảng trash chung và transaction xóa/khôi phục |

## Phạm vi màn hình đã rà soát

Không phải module nào cũng có route “chi tiết” độc lập; nhiều module dùng drawer/modal hoặc dùng chung form tạo–sửa. Audit đã tính các biến thể này là màn hình nghiệp vụ tương ứng.

| Module | List | Tạo/sửa | Chi tiết/preview và phần bên trong đã kiểm tra |
|---|---|---|---|
| Tin tức | `NewsManager`, category manager | `NewsFormView`, category drawer | preview, quick edit, column config, activity/version mock |
| Trang nội dung | `StaticPagesManager` | `PageBuilderEditor` | visual canvas, preview, entity/media picker, rich text, page template data |
| Sự kiện | `EventsManager` | `EventsFormView` | preview, quick edit, activity, column config |
| Sản phẩm | `ProductsManager` | `ProductsFormView` | preview, quick edit, duplicate, activity, column config |
| Thiết lập sản phẩm | `ProductSettingsManager` | `MasterDataFormDrawer` | usage impact, delete/column config và các tab master data |
| Dịch vụ | `ServicesManager` | `ServiceFormView` | preview, quick edit, related contacts, used-by/version/activity mock |
| Menu | table/tree manager | group/item editor | preview, validation, compare/version/activity mock |
| Media | grid/list/albums | upload/replace flows | asset detail, asset picker, variant/version/license fields |
| CTA | `CtaList` | form/editor modal | preview, used-by và action config |
| Biểu mẫu | `FormList` | builder view/modal | preview, submissions, field/action/validation types |
| Yêu cầu khách hàng | `RequestList` | Không phải nội dung tạo thủ công | detail drawer/modal/page, notes/log/source/value fields |
| Mẫu email | manager | `EmailTemplatesFormView` | event/audience/workspace/content/status mock |
| Người dùng | `CicUsersManager` | `CicUserFormModal` | profile, scope, role và security/history fields trong type/mock |
| Vai trò & quyền | roles/tasks/assignments tabs | role editor | permission matrix, policy issues, access reviews |
| Cấu hình hệ thống | overview/table/editor tabs | editor theo setting | validation, audit, diff, version, asset/secret flows |
| SEO chức năng | `FunctionSeoManager` | editor trong manager | route hierarchy, intent, canonical/indexability fields |
| Ngôn ngữ giao diện | list/progress | translation drawer/batch assign | source diff, workflow fields và dictionary mock |
| Nhật ký hoạt động | audit tab/manager | Không tạo log thủ công | event detail, export jobs và audit types |
| Thùng rác | trash tab/manager | Không tạo item thủ công | item detail, restore conflict, permanent delete |

Website đã kiểm tra cả list và detail/render path tại `NewsView`, `ProductsView` + `ProductDetailView`, `ServicesView`, `EventsView`, các static/about/legal/contact/home view, cùng Header/Footer và các file data/type tương ứng.

## Quy tắc áp dụng sau audit

1. Giữ ID và raw value legacy trong lần migrate đầu.
2. Public chỉ đọc Published; Preview có endpoint/quyền riêng để đọc Draft.
3. DTO/adapter chịu trách nhiệm đổi tên và compose relation.
4. Không lưu state UI, label, icon mặc định, accordion/tab state vào DB.
5. Không tách rich text thành nhiều column nếu không cần filter/search/sort/relation/tái sử dụng.
6. Mọi bảng/column mới phải xuất phát từ gap nhóm D trong tài liệu 04 và được duyệt riêng.
