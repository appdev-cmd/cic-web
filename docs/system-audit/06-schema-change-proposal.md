# Đề xuất thay đổi schema

> Chưa có SQL. Mỗi thay đổi Level 2–3 cần review riêng trước migration.

## 1. Phân cấp thay đổi

- **Level 0**: không đổi DB; rename/mapping/derive/frontend-only.
- **Level 1**: repository, mapper, DTO, service, visibility/security logic.
- **Level 2**: thêm nullable field/default-safe, reversible.
- **Level 3**: thêm table/relation cho domain rõ ràng.
- **Level 4**: breaking change; phương án hiện tại không yêu cầu Level 4.

## 2. Proposal theo module

| Module | Requirement | Existing source | Proposed solution | DB change | Risk |
|---|---|---|---|---|---|
| News | short description, slug, author, gallery/file, related, SEO | `cic_news*`, category/user/media/file/related fields | DTO rename + joins + rich text | Level 0–1 | Thấp; cần parse CSV/order |
| News | subtype tuyển dụng/khuyến mại/cổ đông | Category + content/file hiện có | Rich text/category; bỏ field mock chưa chứng minh | Level 0 | Thấp |
| Static pages | Page/Section Draft/Published | `cic_contents*` không biểu diễn builder | Bảng Page/Section/revision/reference mới; giữ contents legacy | Level 3 | Trung bình; cần seed đúng template |
| Event | detail core, registration, related, SEO | `cic_event*` | Mapping + derive registration/status hai trạng thái | Level 0–1 | Thấp |
| Event | ongoing chính xác | Chỉ có `time_event`; `end_time` sai nghĩa | REVIEW `event_end_time` nullable chỉ khi nghiệp vụ xác nhận | Level 2, chưa duyệt | Trung bình; dữ liệu cũ null |
| Event | agenda/speaker/audience | `content` và file/media | Giữ trong rich text; không thêm schema | Level 0 | Thấp |
| Product | detail, category/type/brand/app, price, gallery/docs/related | cụm `cic_products*` | Mapping/join/adapter | Level 0–1 | Trung bình do nhiều bảng/CSV legacy |
| Product settings | master data/sales owner | categories/types/manufactories/application/business/email | Giữ nguồn; adapter select/filter | Level 0–1 | Thấp |
| Service | summary/tagline/content/image/related product | `cic_services*` và relation hiện có | tagline map summary; body dùng rich text | Level 0–1 | Thấp |
| Service | category và structured blocks mock | Không có domain nguồn | Bỏ mock/filter; giữ content | Level 0 | Thấp |
| Menu | tree, order, visibility, breadcrumb | `cic_menus_*` | Giữ bảng; compose breadcrumb | Level 0–1 | Thấp |
| Media | thống nhất asset picker/library | Nhiều bảng/path legacy | Media tables + legacy mapping/fallback | Level 3 | Cao; file/path orphan |
| CTA | CTA reusable | Không có source generic | `ctas` + action config có schema | Level 3 | Trung bình |
| Forms | form builder/submission | Form hard-code, request tables | forms/fields/submissions tables | Level 3 | Trung bình; validation/security |
| Customer requests | list chung không mất dữ liệu | contact/product_contact/order | Read adapter; notes/events table chỉ khi cần ghi mới | Level 1; Level 3 tùy chọn | Trung bình |
| Email templates | template theo event/audience/workspace | Không có; email legacy khác nghĩa | template + version tables | Level 3 | Trung bình |
| Users | profile/status/avatar | `cic_users` | Mapping; giữ ID/hash/profile | Level 0–1 | Thấp |
| Users | 2FA/lock/security state | Chưa có đầy đủ | Chỉ thêm nullable/default-safe khi auth triển khai thật | Level 2–3 | Cao về security |
| Roles & permissions | giữ UI RBAC mới và quyền legacy | direct permission tables | Giữ direct legacy; thêm roles/user_roles/role_permissions tối thiểu | Level 3 | Cao; privilege drift |
| Settings | config dễ dùng | `cic_config*` | Metadata field/schema ở code; DB giữ value | Level 0–1 | Thấp |
| Function SEO | SEO route/list page | `cic_config_modules*` | Mapping route/module/view; derive hierarchy | Level 0–1 | Thấp |
| Translation | key/value/locale | `cic_languages*` | Mapping; bỏ workflow duyệt mock | Level 0–1 | Thấp |
| Activity logs | audit actor/action/change | `cic_history` sai nghĩa | `activity_logs` append-only | Level 3 | Trung bình; privacy/storage |
| Trash | delete/restore entity không có deleted_at | Không có lifecycle chung | `trash_items` + service transaction | Level 3 | Cao; restore conflict/FK |

## 3. Level 2 duy nhất đang REVIEW

`event_end_time` chưa được đưa vào danh sách ADD. Chỉ chuyển thành ADD nếu đồng thời thỏa mãn:

1. Frontend production phải phân biệt Upcoming/Ongoing/Past.
2. Marketing có quy trình nhập thời gian kết thúc.
3. Sự kiện nhiều ngày hoặc thời lượng có ý nghĩa nghiệp vụ.
4. Không dùng `cic_event.end_time` vì field legacy này mang nghĩa cập nhật không ổn định.

Nếu được duyệt: thêm `event_end_time timestamptz NULL`, constraint `event_end_time >= time_event` khi cả hai có giá trị; record legacy để NULL; migration reversible bằng drop column sau khi xác nhận không có dữ liệu mới cần giữ.

## 4. Không có Level 4

Không rename/drop column legacy, không gộp vật lý bảng request, không đổi ID, không thay bảng VI/EN và không chuẩn hóa CSV bằng cách xóa ngay dữ liệu nguồn. Mọi nâng cấp dùng bảng/column bổ sung hoặc adapter song song.

## 5. Danh sách quyết định

### KEEP

- Tất cả bảng/ID/field legacy đã migrate trong các domain News, Event, Product, Product Settings, Service, Menu, User, permission, Config, Function SEO và Localization.
- `summary`, `alias`, `content`, `image`, `published`, `ordering`, SEO fields, timestamps và author IDs theo nghĩa từng module.
- `cic_contact`, `cic_product_contact`, `cic_order*` làm nguồn record khách hàng.
- `cic_email`, `cic_types_email` theo đúng nghĩa người phụ trách/routing legacy.
- `cic_contents*` để bảo toàn static content legacy và rollback.

### MAP

- `shortDescription/shortDesc/description/desc` → `summary`.
- `slug` → `alias`; ID không dùng thay slug.
- `longDesc/htmlContent/contentMarkdown/overviewHtml` → `content` rich text phù hợp module.
- `img/avatar` → `image` hoặc Media DTO.
- `brand/field/app/productType` → relation manufactories/category/application/type.
- `seoTitle/seoDesc/seoKeywords` → các field `seo_*`.
- `isOpenRegistration` → computed từ `link_dangky` và thời gian.
- author/category/file metadata/breadcrumb/count/status label → join hoặc computed.

### ADD

- Page Builder: Page, Section/revision, ordered entity references.
- Media Library: asset và legacy mapping; folder/variant/version chỉ theo chức năng đã giữ.
- CTA và Form/submission.
- Email Template/version.
- Role/user-role/role-permission tối thiểu nếu CMS RBAC mới được vận hành.
- Activity Log và Trash.
- Customer request notes/events chỉ nếu CMS thật sự cho ghi dữ liệu này.

### REMOVE FROM MOCK

- Workflow nội dung chờ duyệt/phê duyệt/từ chối/reviewer/approver.
- Service category/filter chưa có nguồn và các block `whyNeed/process/benefits/collaboration` dạng schema riêng.
- Event status hard-code, `isOpenRegistration` persistent, category sự kiện, agenda/speaker/audience structured fields chưa có requirement.
- Các field subtype news chuyên biệt chưa có nguồn vận hành.
- Used-By, Working Draft version, quality score, request count, saved preset và audit metric giả.
- UI state, label, placeholder, helper text, icon mặc định, CSS/layout/responsive.

### REVIEW

- `event_end_time`.
- Mức độ Media version/variant/license thực sự cần ở production.
- Role version/scope/access review vượt mô hình RBAC tối thiểu.
- Customer request common index/notes/events.
- Tracking/consent fields nào được phép lưu trong form submissions.

