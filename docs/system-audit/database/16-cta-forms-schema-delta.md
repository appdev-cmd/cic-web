# Schema Delta — CTA và Biểu mẫu

Tài liệu này chỉ ghi những thay đổi cần **thêm** vào PostgreSQL hiện tại. Chưa sửa database, chưa viết migration và không mô tả lại toàn bộ schema legacy.

## Kết luận đối chiếu

- `httpdocs` không có module/bảng CTA generic hoặc form builder. Nút/link cũ nằm hard-code theo module.
- `fs_contact*`, `fs_product_contact` và `fs_order*` chỉ lưu yêu cầu/đơn đã gửi; PostgreSQL đã giữ chúng thành `cic_contact*`, `cic_product_contact`, `cic_order*`. Không tái sử dụng các bảng này làm định nghĩa Form.
- CMS mới có CTA reusable theo workspace, action allowlist, preview và liên kết Form/Media/Email Template; Form mới có builder field, validation, submit action và lưu submission.
- Hai module là domain mới additive; không cần mở rộng bảng legacy hiện có.

## CTA

### Bảng hiện có cần mở rộng

Không có.

### Bảng mới cần tạo

#### `cic_ctas`

| Column | Type | Constraint / default | CMS mới sử dụng |
| ------ | ---- | -------------------- | --------------- |
| `id` | `bigint` identity | PK | ID/reference reusable |
| `workspace` | `varchar(5)` | NOT NULL, CHECK theo workspace hỗ trợ | VI/EN độc lập, không fallback |
| `code` | `varchar(100)` | NOT NULL | Shortcode và selector |
| `admin_name` | `varchar(255)` | NOT NULL | Tên quản trị |
| `display_text` | `varchar(100)` | NOT NULL | Nhãn nút public |
| `description` | `text` | NULL | Ghi chú quản trị |
| `icon` | `varchar(100)` | NULL | Icon theo allowlist Lucide |
| `style_variant` | `varchar(30)` | NOT NULL DEFAULT `'primary'`, CHECK `primary`, `secondary`, `outline`, `gradient` | Variant design-system |
| `action_type` | `varchar(40)` | NOT NULL, CHECK theo action allowlist | Chọn hành vi CTA |
| `action_config` | `jsonb` | NOT NULL DEFAULT `'{}'::jsonb`, CHECK là object | URL, target, anchor, phone, email và policy action |
| `form_id` | `bigint` | NULL, FK → `cic_forms(id)` ON DELETE RESTRICT | Action `open_form` |
| `media_asset_id` | `bigint` | NULL, FK → `cic_media_assets(id)` ON DELETE RESTRICT | Action `download_file` |
| `email_template_id` | `bigint` | NULL, FK → `cic_email_templates(id)` ON DELETE RESTRICT | Action `send_email` |
| `status` | `varchar(20)` | NOT NULL DEFAULT `'draft'`, CHECK `active`, `inactive`, `draft`, `archived` | Publish/filter |
| `created_by` | `integer` | NULL, FK → `cic_users(id)` ON DELETE SET NULL | Audit actor |
| `created_at` | `timestamptz` | NOT NULL DEFAULT `now()` | Metadata |
| `updated_at` | `timestamptz` | NOT NULL DEFAULT `now()` | Metadata |
| `deleted_at` | `timestamptz` | NULL | Tab Thùng rác hiện tại |

- Unique: (`workspace`, `code`).
- Index: (`workspace`, `status`, `updated_at` DESC), (`form_id`), (`media_asset_id`), (`email_template_id`), partial index cho `deleted_at IS NULL` nếu cần.
- CHECK/application schema phải buộc đúng payload theo `action_type`: `open_form` cần `form_id`; `download_file` cần `media_asset_id`; `send_email` cần email/template; redirect cần URL; scroll cần anchor; call cần phone. Các FK khác loại phải NULL.
- Mức độ: **BẮT BUỘC** — PostgreSQL hiện không có entity CTA reusable.

### Mapping / lưu ý

- `adminName → admin_name`, `displayText → display_text`, `styleVariant → style_variant`, `actionConfig.type → action_type`.
- Chỉ giữ payload linh hoạt không có FK trong `action_config`; không lưu `formId`, `fileId`, `emailTemplateId` trong JSON vì cần integrity quan hệ.
- `reviewBeforeSend`, `openInNewTab`, URL, section anchor, phone và email address là config được validate; không tạo column riêng cho từng action.
- `usedByCount`/`usedByPages` derive từ Page Section/config/reference sử dụng CTA; không tạo snapshot hoặc relation chỉ để phục vụ modal Used By.
- `analytics.impressions`, `clicks`, `ctr`, trend và sort analytics đang là fixture; chưa có tracking write contract nên không thêm column/bảng analytics.
- Kích thước nút trong form CTA hiện là preview/local UI state, không nằm trong `CtaFormData`; không thêm field size hoặc CSS/JS/JSX.
- Không thêm `cta_*` vào News, Product, Service hoặc Page. Các module khác chỉ lưu CTA reference.

## Biểu mẫu

### Bảng hiện có cần mở rộng

Không có. `cic_contact*`, `cic_product_contact` và `cic_order*` tiếp tục là nguồn request/order legacy, không trở thành form definition hoặc submission generic.

### Bảng mới cần tạo

#### `cic_forms`

| Column | Type | Constraint / default | CMS mới sử dụng |
| ------ | ---- | -------------------- | --------------- |
| `id` | `bigint` identity | PK | ID/reference Form |
| `workspace` | `varchar(5)` | NOT NULL, CHECK theo workspace hỗ trợ | Dataset VI/EN độc lập |
| `code` | `varchar(100)` | NOT NULL | Shortcode/selector |
| `admin_name` | `varchar(255)` | NOT NULL | Tên quản trị |
| `title` | `varchar(255)` | NOT NULL | Tiêu đề public |
| `description` | `text` | NULL | Mô tả public/quản trị |
| `status` | `varchar(20)` | NOT NULL DEFAULT `'draft'`, CHECK `active`, `inactive`, `draft`, `archived` | Lifecycle/filter |
| `current_version` | `integer` | NOT NULL DEFAULT `1`, CHECK `>= 1` | CMS tăng khi publish |
| `create_customer_request` | `boolean` | NOT NULL DEFAULT `true` | Đồng bộ vào read model Yêu cầu khách hàng |
| `send_admin_email` | `boolean` | NOT NULL DEFAULT `false` | Submit action |
| `admin_emails` | `text[]` | NOT NULL DEFAULT `'{}'` | Danh sách người nhận quản trị |
| `admin_email_template_id` | `bigint` | NULL, FK → `cic_email_templates(id)` ON DELETE RESTRICT | Mẫu email nội bộ |
| `send_confirmation_email` | `boolean` | NOT NULL DEFAULT `false` | Submit action |
| `confirmation_email_template_id` | `bigint` | NULL, FK → `cic_email_templates(id)` ON DELETE RESTRICT | Mẫu xác nhận khách hàng |
| `submit_button_text` | `varchar(100)` | NOT NULL DEFAULT `'Gửi thông tin'` | Nhãn nút submit |
| `success_message` | `text` | NOT NULL | Kết quả submit thành công |
| `redirect_url` | `text` | NULL | Điều hướng sau submit |
| `created_by` | `integer` | NULL, FK → `cic_users(id)` ON DELETE SET NULL | Audit actor |
| `created_at` | `timestamptz` | NOT NULL DEFAULT `now()` | Metadata |
| `updated_at` | `timestamptz` | NOT NULL DEFAULT `now()` | Metadata |
| `deleted_at` | `timestamptz` | NULL | Tab Thùng rác hiện tại |

- Unique: (`workspace`, `code`).
- Index: (`workspace`, `status`, `updated_at` DESC), (`admin_email_template_id`), (`confirmation_email_template_id`).
- Khi bật gửi email, template tương ứng phải tồn tại, active, đúng workspace/audience; validate tại service trước publish.
- `saveToDatabase` không cần column: Form public hợp lệ luôn lưu submission; CMS hiện cũng bắt buộc cờ này khi publish.
- Mức độ: **BẮT BUỘC**.

#### `cic_form_fields`

| Column | Type | Constraint / default |
| ------ | ---- | -------------------- |
| `id` | `bigint` identity | PK |
| `form_id` | `bigint` | NOT NULL, FK → `cic_forms(id)` ON DELETE CASCADE |
| `field_key` | `varchar(100)` | NOT NULL |
| `field_type` | `varchar(30)` | NOT NULL, CHECK theo allowlist field type |
| `role_type` | `varchar(30)` | NULL, CHECK theo allowlist role type |
| `label` | `varchar(255)` | NOT NULL |
| `placeholder` | `varchar(255)` | NULL |
| `help_text` | `text` | NULL |
| `is_required` | `boolean` | NOT NULL DEFAULT `false` |
| `is_locked` | `boolean` | NOT NULL DEFAULT `false` |
| `position` | `integer` | NOT NULL, CHECK `> 0` |
| `validation_config` | `jsonb` | NOT NULL DEFAULT `'{}'::jsonb`, CHECK là object |
| `options_config` | `jsonb` | NOT NULL DEFAULT `'[]'::jsonb`, CHECK là array |

- Unique: (`form_id`, `field_key`) và (`form_id`, `position`); index (`form_id`, `field_type`).
- `validation_config` chỉ nhận các key allowlist `minLength`, `maxLength`, `pattern`, `min`, `max`, `customMessage`; `required` có nguồn chuẩn là `is_required`, không lưu lặp.
- `options_config` chỉ dùng cho select/radio/checkbox, gồm value/label/order; không lưu component React.
- Mức độ: **BẮT BUỘC**.

#### `cic_form_submissions`

| Column | Type | Constraint / default |
| ------ | ---- | -------------------- |
| `id` | `bigint` identity | PK |
| `form_id` | `bigint` | NOT NULL, FK → `cic_forms(id)` ON DELETE RESTRICT |
| `form_version` | `integer` | NOT NULL, CHECK `>= 1` |
| `source_type` | `varchar(50)` | NULL, CHECK theo allowlist entity/page source |
| `source_id` | `bigint` | NULL |
| `source_path` | `text` | NULL |
| `submitted_at` | `timestamptz` | NOT NULL DEFAULT `now()` |

- Index: (`form_id`, `submitted_at` DESC), (`source_type`, `source_id`), (`submitted_at` DESC).
- Không CASCADE submission khi xóa Form; Form dùng soft delete, còn submission phải giữ để đối soát.
- Mức độ: **BẮT BUỘC** — CMS yêu cầu lưu DB và xem các lượt gửi.

#### `cic_form_submission_values`

| Column | Type | Constraint / default |
| ------ | ---- | -------------------- |
| `id` | `bigint` identity | PK |
| `submission_id` | `bigint` | NOT NULL, FK → `cic_form_submissions(id)` ON DELETE CASCADE |
| `field_id` | `bigint` | NOT NULL, FK → `cic_form_fields(id)` ON DELETE RESTRICT |
| `field_key` | `varchar(100)` | NOT NULL | Snapshot key theo version submit |
| `value_text` | `text` | NULL |
| `value_json` | `jsonb` | NULL |
| `media_asset_id` | `bigint` | NULL, FK → `cic_media_assets(id)` ON DELETE RESTRICT |

- Unique: (`submission_id`, `field_id`); index (`field_id`), (`media_asset_id`).
- CHECK: đúng một dạng giá trị được dùng theo field type; file upload lưu `media_asset_id`, không lưu binary/path tùy ý.
- Mức độ: **BẮT BUỘC**.

### Mapping / lưu ý

- `adminName → admin_name`, `currentVersion → current_version`, `fields → cic_form_fields`, `submitConfig → các policy/quan hệ trên cic_forms`.
- `stats.submissions` được COUNT từ submission; conversion rate/analytics chỉ derive khi có tracking denominator. Không lưu các số mock.
- Submission modal hiện đang dùng sample cứng; dữ liệu thật phải đọc `cic_form_submissions` + values và được Customer Request adapter xem như source type `form_submission` khi `create_customer_request = true`.
- Không copy submission mới vào `cic_contact*`/`cic_product_contact`/`cic_order*`; các bảng legacy vẫn giữ dữ liệu cũ và read model hợp nhất các nguồn.
- `webhookUrl`, `webhookHeaders`, `crmSyncEnabled`, `crmConfig`, download-after-submit và `FileConfig` mới chỉ có trong type/default mock, chưa có control/save contract hoàn chỉnh; không thêm vào PostgreSQL trong audit này.
- Builder drag state, selected field, preview state và filter/sort là UI-only.
- Chưa tạo bảng Form revision riêng: CMS hiện chỉ tăng `current_version` nhưng chưa có màn hình restore/compare version. Nếu cần snapshot bất biến cho từng version, audit bổ sung trước khi triển khai; không tự tạo trước nhu cầu.
