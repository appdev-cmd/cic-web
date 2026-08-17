# Schema Delta — Yêu cầu khách hàng và Mẫu email

Tài liệu này chỉ ghi những thay đổi cần **thêm** vào PostgreSQL hiện tại. Chưa sửa database, chưa viết migration và không mô tả lại toàn bộ schema legacy.

## Yêu cầu khách hàng

### Kết luận đối chiếu

- `httpdocs` ghi dữ liệu thật vào nhiều nguồn có nghĩa khác nhau: `fs_contact*`, `fs_product_contact`, `fs_order*`; PostgreSQL đã giữ tương ứng trong `cic_contact*`, `cic_product_contact`, `cic_order*`.
- Form mới bổ sung nguồn `cic_form_submissions`; không copy submission vào bảng contact/order cũ.
- CMS mới dùng một read model hợp nhất và đang ghi chú nội bộ, đổi trạng thái, hiển thị phân công/ưu tiên/tags và timeline.
- Không tạo một bảng Customer Request mới để copy toàn bộ customer/submission values. Chỉ thêm lớp trạng thái vận hành theo khóa nguồn và các record phát sinh mới.

### Bảng hiện có cần mở rộng

Không có. Không thêm cùng một bộ status/assignee/note vào từng bảng legacy vì sẽ tạo nhiều nguồn ghi không nhất quán.

### Bảng mới cần tạo

#### `cic_customer_request_states`

| Column | Type | Constraint / default | CMS mới sử dụng |
| ------ | ---- | -------------------- | --------------- |
| `id` | `bigint` identity | PK | ID nội bộ của operational overlay |
| `workspace` | `varchar(5)` | NOT NULL, CHECK theo workspace hỗ trợ | Tách list VI/EN |
| `source_type` | `varchar(30)` | NOT NULL, CHECK `contact`, `product_contact`, `order`, `form_submission` | Xác định bảng nguồn |
| `source_id` | `bigint` | NOT NULL | ID record nguồn |
| `status` | `varchar(30)` | NOT NULL DEFAULT `'new'`, CHECK theo request status allowlist | Filter và cập nhật trạng thái |
| `assigned_user_id` | `integer` | NULL, FK → `cic_users(id)` ON DELETE SET NULL | Phân công xử lý |
| `priority` | `varchar(20)` | NOT NULL DEFAULT `'medium'`, CHECK `low`, `medium`, `high`, `urgent` | List/detail |
| `tags` | `text[]` | NOT NULL DEFAULT `'{}'` | Nhãn vận hành |
| `created_at` | `timestamptz` | NOT NULL DEFAULT `now()` | Metadata overlay |
| `updated_at` | `timestamptz` | NOT NULL DEFAULT `now()` | Sort/audit |

- Unique: (`workspace`, `source_type`, `source_id`).
- Index: (`workspace`, `status`, `updated_at` DESC), (`assigned_user_id`, `status`), (`source_type`, `source_id`); GIN (`tags`) chỉ khi backend giữ filter tag.
- Không thể khai báo một FK đa hình từ `source_id`; service phải resolve source table theo allowlist và xác nhận record tồn tại trước khi tạo/cập nhật state.
- Quan hệ: một source record có tối đa một operational state; dữ liệu khách hàng và nội dung yêu cầu vẫn đọc từ bảng nguồn.
- Mức độ: **BẮT BUỘC** — CMS cần một trạng thái/phân công thống nhất mà không thay đổi nghĩa status riêng của contact/order legacy.

#### `cic_customer_request_notes`

| Column | Type | Constraint / default |
| ------ | ---- | -------------------- |
| `id` | `bigint` identity | PK |
| `request_state_id` | `bigint` | NOT NULL, FK → `cic_customer_request_states(id)` ON DELETE RESTRICT |
| `content` | `text` | NOT NULL, CHECK nội dung sau trim không rỗng |
| `created_by` | `integer` | NULL, FK → `cic_users(id)` ON DELETE SET NULL |
| `created_at` | `timestamptz` | NOT NULL DEFAULT `now()` |

- Index: (`request_state_id`, `created_at` DESC), (`created_by`).
- Không lưu lặp `createdByName`; join `cic_users`, fallback nhãn System khi actor NULL.
- Mức độ: **BẮT BUỘC** — `handleAddNote` đang tạo ghi chú mới trong CMS.

#### `cic_customer_request_events`

| Column | Type | Constraint / default |
| ------ | ---- | -------------------- |
| `id` | `bigint` identity | PK |
| `request_state_id` | `bigint` | NOT NULL, FK → `cic_customer_request_states(id)` ON DELETE RESTRICT |
| `event_type` | `varchar(50)` | NOT NULL, CHECK theo allowlist |
| `old_value` | `jsonb` | NULL |
| `new_value` | `jsonb` | NULL |
| `actor_id` | `integer` | NULL, FK → `cic_users(id)` ON DELETE SET NULL |
| `created_at` | `timestamptz` | NOT NULL DEFAULT `now()` |

- Index: (`request_state_id`, `created_at` DESC), (`event_type`, `created_at` DESC), (`actor_id`).
- Append-only; event tối thiểu gồm `note_added`, `status_changed`, `assignment_changed`, `priority_changed`, `tags_changed`.
- Không dùng `cic_history`: bảng đó mang nghĩa nghiệp vụ khác, không phải audit CMS.
- Mức độ: **BẮT BUỘC** — CMS đang tạo log khi thêm note/đổi trạng thái và render timeline.

### Mapping / lưu ý

- Read model trả `source_type + source_id`, source config và submission values; không copy tên/email/phone/company/message vào `cic_customer_request_states`.
- Với `form_submission`, Form/CTA/page/source metadata lấy từ `cic_form_submissions`, Form và CTA relation; các label `formName`, `ctaName`, `pageTitle` là join/snapshot nguồn, không thêm vào state.
- Với legacy, adapter map field customer/status/time theo từng source; không ép status lịch sử vào allowlist mới nếu chưa có rule đã duyệt.
- `assignedUserName`, tên actor và avatar đều join `cic_users`; không lưu chuỗi lặp.
- Device/UTM/referrer trong `SourceConfig` chưa có write contract ở Form Submission audit; không thêm vào Customer Request để tránh lưu tracking tùy tiện.
- `handleAssignUser` hiện còn `console.log`, còn chỉnh priority/tags chưa nối save hoàn chỉnh. Các field vẫn thuộc operational contract đang hiển thị/filter; service implementation phải hoàn thiện trước migration/seed production.
- Thao tác Duplicate Request trong mock không phải nghiệp vụ hợp lệ; không tạo bản sao source record hoặc field phục vụ duplicate.
- Xóa/thùng rác dùng shared Trash khi module đó được audit; không thêm `deleted_at` vào mọi source legacy trong bước này.

## Mẫu email

### Kết luận đối chiếu

- `fs_email`/`fs_types_email` và `cic_email`/`cic_types_email` lưu người phụ trách hoặc routing legacy, không phải subject/body template.
- CMS mới quản lý template theo workspace, event, audience, status; mỗi lần lưu tăng version và Form/CTA tham chiếu template bằng FK.
- Không đổi nghĩa hoặc backfill template từ bảng email legacy.

### Bảng hiện có cần mở rộng

Không có.

### Bảng mới cần tạo

#### `cic_email_templates`

| Column | Type | Constraint / default | CMS mới sử dụng |
| ------ | ---- | -------------------- | --------------- |
| `id` | `bigint` identity | PK | Identity được Form/CTA tham chiếu |
| `workspace` | `varchar(5)` | NOT NULL, CHECK theo workspace hỗ trợ | VI/EN độc lập |
| `name` | `varchar(255)` | NOT NULL | Tên quản trị |
| `event_key` | `varchar(50)` | NOT NULL, CHECK theo event registry | Filter/routing sự kiện |
| `audience` | `varchar(20)` | NOT NULL, CHECK `customer`, `internal` | Đối tượng nhận |
| `status` | `varchar(20)` | NOT NULL DEFAULT `'draft'`, CHECK `draft`, `active`, `inactive`, `archived` | Lifecycle/filter |
| `draft_version_id` | `bigint` | NULL, FK → `cic_email_template_versions(id)` | Bản mới nhất đang soạn |
| `active_version_id` | `bigint` | NULL, FK → `cic_email_template_versions(id)` | Bản website/service đang dùng |
| `created_by` | `integer` | NULL, FK → `cic_users(id)` ON DELETE SET NULL | Audit actor |
| `created_at` | `timestamptz` | NOT NULL DEFAULT `now()` | Metadata |
| `updated_by` | `integer` | NULL, FK → `cic_users(id)` ON DELETE SET NULL | Người sửa cuối |
| `updated_at` | `timestamptz` | NOT NULL DEFAULT `now()` | Sort/list |
| `activated_by` | `integer` | NULL, FK → `cic_users(id)` ON DELETE SET NULL | Người publish bản Active |
| `activated_at` | `timestamptz` | NULL | Thời điểm publish gần nhất |

- Index: (`workspace`, `event_key`, `audience`, `status`), (`updated_at` DESC), (`draft_version_id`), (`active_version_id`).
- Không unique (`workspace`, `event_key`, `audience`) vì CMS có thể có nhiều template cho cùng event/audience và Form/CTA chọn template cụ thể.
- Service phải xác nhận hai version pointer thuộc đúng template; FK pointer được thêm sau khi tạo bảng version để xử lý dependency vòng.
- Mức độ: **BẮT BUỘC** — PostgreSQL hiện không có thư viện Email Template.

#### `cic_email_template_versions`

| Column | Type | Constraint / default |
| ------ | ---- | -------------------- |
| `id` | `bigint` identity | PK |
| `template_id` | `bigint` | NOT NULL, FK → `cic_email_templates(id)` ON DELETE CASCADE |
| `version_number` | `integer` | NOT NULL, CHECK `>= 1` |
| `subject` | `text` | NOT NULL, CHECK sau trim không rỗng |
| `content` | `text` | NOT NULL, CHECK sau trim không rỗng |
| `created_by` | `integer` | NULL, FK → `cic_users(id)` ON DELETE SET NULL |
| `created_at` | `timestamptz` | NOT NULL DEFAULT `now()` |

- Unique: (`template_id`, `version_number`); index (`template_id`, `version_number` DESC).
- Version là immutable. Save tạo version mới; Publish chỉ đổi `active_version_id` và status sau khi validate token/preview.
- Mức độ: **BẮT BUỘC** — CMS tăng version khi lưu và cần không ghi đè nội dung đang Active.

### Mapping / lưu ý

- `event → event_key`, `version → version_number`, `subject/content → cic_email_template_versions`; status và identity nằm trên template.
- Form dùng `admin_email_template_id`/`confirmation_email_template_id`; CTA send-email dùng `email_template_id`. Used-by được reverse query các FK này, không lưu usage count/pages.
- Token như `{{customer.email}}` thuộc registry allowlist trong code. Không tạo bảng variable và không lưu sample values vào PostgreSQL.
- Preview viewport/sample replacement là UI-only. Không lưu HTML preview đã render.
- Sender, reply-to và routing tiếp tục lấy từ Settings/routing legacy đã được duyệt; không hard-code hoặc nhân bản trong template khi form hiện không quản trị các field này.
- Chỉ seed template Draft từ manifest được duyệt. Không suy diễn template từ email lịch sử, người phụ trách hoặc chuỗi hard-code trong `httpdocs`.
