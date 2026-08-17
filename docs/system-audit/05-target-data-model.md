# Mô hình dữ liệu đích

> Trạng thái: phương án logic cuối cùng để triển khai backend sau này. Không phải SQL hoặc migration.  
> Nguyên tắc: bảo toàn PostgreSQL hiện tại; ưu tiên mapping, relation, computed field và frontend-only trước khi thêm schema.

## 1. Kiến trúc dữ liệu đích

Mô hình đích gồm ba lớp:

1. **Legacy-compatible domain**: các bảng `cic_*` hiện tại tiếp tục là nguồn dữ liệu của Tin tức, Sự kiện, Sản phẩm, Dịch vụ, Menu, Người dùng, cấu hình, SEO chức năng và ngôn ngữ.
2. **New domain**: chỉ thêm bảng cho Page Builder, Media Library chuẩn hóa, CTA, Form, Email Template, RBAC mở rộng, Audit Log và Trash vì PostgreSQL hiện tại không có entity cùng nghĩa.
3. **Application contract**: repository/adapter/DTO đổi tên field, join relation và tính field trình bày cho CMS/frontend. Lớp này không làm thay đổi nghĩa dữ liệu nguồn.

```text
PostgreSQL legacy-compatible tables
        + new domain tables
                 ↓
Repository / compatibility adapter
                 ↓
Domain service + visibility/security rules
                 ↓
Public DTO | CMS DTO | Preview DTO
                 ↓
Website React | CMS React
```

## 2. Domain giữ nguyên

| Domain | Nguồn chính | Quyết định |
|---|---|---|
| News | `cic_news*`, `cic_news_categories*` | Giữ schema; mapping DTO và relation |
| Event | `cic_event*` | Giữ schema; `time_event` là bắt đầu, tái sử dụng `end_time` làm kết thúc sau cleanup legacy |
| Product | `cic_products*`, categories, types, manufactories, application, price/images | Giữ schema và ID/relation legacy |
| Product settings | categories/types/manufactories/application/business/email/types_email | Giữ schema; business/email là người phụ trách, không phải template |
| Service | `cic_services*` | Giữ content rich text; không tạo category/block columns |
| Menu | `cic_menus_groups*`, `cic_menus_items*` | Giữ cây và ordering |
| User | `cic_users` | Giữ profile/auth legacy; mở rộng bảo mật chỉ khi backend thật cần |
| Direct permission | `cic_permission*`, `cic_users_permission*` | Bảo toàn quyền hiệu lực từng user |
| Settings | `cic_config*` | Giữ key/value; schema label/help có thể ở code |
| Function SEO | `cic_config_modules*` | Giữ SEO route/module; hierarchy compose ở application |
| Localization | `cic_languages*`, `cic_translate_content` | Giữ core dictionary/content translation |
| Customer source records | `cic_contact*`, `cic_product_contact`, `cic_order*` | Không gộp vật lý trong lần đầu; hợp nhất bằng read model |

`*` bao gồm biến thể workspace/locale hiện có. VI và EN là dataset độc lập.

## 3. Domain mới thực sự cần thiết

Tên bảng dưới đây là tên logic đề xuất, sẽ được rà convention trước khi viết migration.

### 3.1. Trang nội dung / Page Builder

#### `content_pages`

- `id`, `code`, `name`, `slug`, `template_key`, `workspace`
- draft/published revision reference hoặc cặp version rõ ràng
- `published`, `published_at`
- SEO page-level nếu template là page độc lập và không dùng entity legacy
- audit timestamps/user IDs

#### `content_page_sections`

- `id`, `page_id`, `section_key`, `section_type`, `position`
- `draft_config`, `published_config` hoặc revision-based config
- không lưu HTML layout, CSS, JSX hay component source

#### `content_page_section_references`

- `section_id`, `revision/status scope`
- `entity_type`, `entity_id`, `position`
- unique theo section/revision/entity; position bảo toàn thứ tự thủ công

`template_key`, danh sách section hợp lệ, giới hạn số lượng và config schema nằm trong code. Marketing không được thêm/xóa section hoặc đổi `section_type`.

Trang chính sách/điều khoản và trang tự tạo cùng layout dùng một section rich text; không chia mỗi heading/đoạn thành column.

### 3.2. Media Library

#### `media_assets`

- identity, storage key/path, original filename, MIME, size, dimensions
- title, alt text, caption, ownership/source/license metadata cần vận hành
- status, created/updated actor/time
- `legacy_source_type`, `legacy_source_id`, `legacy_path` để resolve và đối soát

#### `media_folders`, `media_folder_assets`

Dùng cho tổ chức thư viện. Folder không quyết định URL public của asset.

#### `media_variants` và `media_versions`

Chỉ tạo khi UI thay thế/version/variant được giữ trong production. Version là file thực; variant là rendition có kích thước/format xác định.

Entity cũ vẫn giữ path hiện có trong giai đoạn tương thích. API ưu tiên Media relation nếu có, fallback path legacy.

### 3.3. CTA

#### `ctas`

- `id`, `code`, `name`, `label`, `action_type`, `status`, workspace
- `action_config` JSON có schema theo `action_type`
- `style_variant` enum do design system định nghĩa
- audit fields

JSON chỉ chứa payload linh hoạt như URL, phone, email, form ID, file/media ID hoặc anchor. Không lưu CSS/JS/JSX. Không thêm `cta_*` vào từng bảng content.

### 3.4. Form và submission

#### `forms`, `form_fields`

- Form: identity/code/name/status/workspace/submit label/action policy
- Field: form ID, stable key, type, label, required, position, validation config có schema

#### `form_submissions`, `form_submission_values`

- Submission: form/source/entity context, timestamps, request linkage, consent/tracking fields được phê duyệt
- Values: field reference + typed/serialized value phù hợp

Không lưu component React. Field/action type là allowlist backend.

### 3.5. Yêu cầu khách hàng hợp nhất

Giai đoạn đầu không copy `contact`, `product_contact`, `order` vào một bảng mới. Tạo **read adapter** trả contract chung gồm `source_type`, `source_id`, customer summary, status và timestamps.

Chỉ bổ sung bảng `customer_request_notes` và `customer_request_events` nếu CMS thực sự cho ghi chú/phân công/lịch sử xuyên nguồn. Mỗi record phải giữ `source_type + source_id`; dữ liệu đặc thù vẫn ở bảng nguồn.

### 3.6. Mẫu email

#### `email_templates`, `email_template_versions`

- workspace, stable event key, audience, name
- subject/body, status Draft/Active, version
- created/updated/activated actor/time

Routing/sender không hard-code trong content. `cic_email` và `cic_types_email` tiếp tục mang nghĩa người phụ trách/routing legacy, không được dùng làm template.

### 3.7. Người dùng, vai trò và bảo mật

Giữ `cic_users` và direct permissions. Nếu giữ đầy đủ CMS mới thì thêm:

- `roles`, `role_permissions`, `user_roles`; chỉ thêm version/scope khi có nghiệp vụ sử dụng thật.
- nullable/default-safe security state trên user hoặc bảng credential/security riêng.
- security event riêng, không trộn audit content.

Không tự suy quyền review/approve từ mức quyền legacy. Workflow nội dung chỉ có Draft/Published.

### 3.8. Audit Log và Thùng rác

#### `activity_logs`

Append-only: actor, action, entity type/ID, request/IP/user-agent, before/after metadata đã redaction, timestamp. Không chứa password/token/secret.

#### `trash_items`

Source entity type/ID, snapshot tối thiểu, deleted actor/time, restore metadata, purge schedule nếu có. Trash là cơ chế lifecycle; audit log ghi sự kiện. Hai bảng không thay thế nhau.

## 4. JSON/metadata được phép dùng ở đâu

| Dữ liệu | Dùng JSON? | Lý do |
|---|---|---|
| Page section config | Có, có schema theo section type | Linh hoạt, ít query xuyên config, component code kiểm soát |
| CTA action config | Có, có schema theo action type | Payload khác nhau nhưng domain CTA ổn định |
| Form validation/options | Có giới hạn | Cấu trúc linh hoạt; field identity/order vẫn là relational |
| Audit before/after | Có, đã redaction | Không phải nguồn query nghiệp vụ chính |
| Product/category/related entities | Không | Relationship quan trọng, cần integrity/query/order |
| User role/permission | Không | Cần constraint và truy vấn bảo mật |
| Submission identity/form/source | Không | Cần query/filter/index; value linh hoạt có thể tách bảng |

## 5. Quy tắc nội dung Rich Text

Rich text là nguồn cuối cho nội dung biên tập thông thường: body tin tức, nội dung dịch vụ, nội dung sự kiện, mô tả dài sản phẩm và trang legal/article. Ảnh/link/table/list/embed trong bài thuộc rich text đã sanitize. Chỉ tách thành structured field khi cần filter/sort/index/relation/reuse hoặc component frontend cần truy xuất độc lập.
