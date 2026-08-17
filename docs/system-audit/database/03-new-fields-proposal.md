# New fields/tables proposal

> Mọi mục ADD dưới đây đã vượt qua kiểm tra map/relation/derive/UI/Rich Text. Event không cần ADD: tái sử dụng `cic_event.end_time` đúng nghĩa nghiệp vụ sau khi làm sạch giá trị legacy.

## Page Builder

| Field | Used by | Why persistent | Type | Null/default | Index/unique/FK | Legacy value |
|---|---|---|---|---|---|---|
| page `code` | CMS list/template lookup | Stable system identity; không derive từ title | varchar(100) | required | unique(workspace,code) | seed theo page được duyệt |
| `name`,`slug` | CMS/public route | Content/URL độc lập | varchar(255) | required | unique(workspace,slug) | seed; không tự đoán ngoài mapping duyệt |
| `template_key` | Renderer | Chọn component code; không phải layout tùy ý | varchar(100) | required | index | seed `home/about/.../article` |
| `workspace` | VI/EN | Dataset isolation | varchar(10) | required | composite indexes | theo bảng/source page |
| revision `status` | Draft/Published | Preview/public isolation | enum/check varchar | required `draft` | unique active draft/published per page | seed cả hai khi có content |
| revision metadata | Publish/audit | Persistent lifecycle | timestamps/user FK | nullable | indexes by page/status | NULL actor nếu chưa map được |
| section `section_key/type/position` | Fixed sections | Component identity/order | varchar/int | required | unique(revision,section_key/position) | seed theo template code |
| section `config` | Editable section content | Flexible per fixed type; ít cross-query | jsonb | `{}` | GIN không mặc định | seed từ mock/current design được duyệt |
| reference entity/type/id/order | highlight sections | M:N reusable/query/order | varchar/bigint/int | required | unique + indexes | none nếu không có source; không auto-select |

Config JSON không chứa HTML layout/CSS/JSX. Rich article body là content HTML trong config của section type `rich_content`.

## Media

| Field | Used by | Type | Null/default | Index/constraint | Legacy value |
|---|---|---|---|---|---|
| storage key/path, filename, MIME, size | picker/render/download | text/varchar/bigint | required cho asset mới | unique storage key | derive/index từ raw file path; missing file vẫn giữ legacy mapping |
| width/height/duration | validation/variant UI | integer | nullable | check >=0 | NULL nếu không đọc được metadata |
| title/alt/caption | CMS/accessibility | text | nullable | optional search index | fallback title filename; alt NULL, không tự bịa |
| status | lifecycle | varchar/check | `ready` cho verified; `missing` cho absent | index | theo file verification |
| legacy source type/id/path | migration/rollback | varchar/bigint/text | nullable | unique partial theo source | copy source identity/path |
| folder relation | organization | FK table | nullable | unique(folder,asset) | no folder/default root |
| versions/variants | replacement/rendition | tables | nullable | FK cascade/restrict per spec | original only; không tự sinh variant trong migration |

## CTA

| Field | Reason | Type | Null/default | Constraint | Legacy value |
|---|---|---|---|---|---|
| code/name/label | reusable identity/content | varchar | required | unique(workspace,code) | NULL/no row unless explicit seed |
| action_type | domain behavior | varchar check | required | allowlist | seed only known CTA |
| action_config | flexible validated payload | jsonb | `{}` | schema validation application | mapped URL/form/media only when source known |
| style_variant | design-system choice | varchar | `primary` | allowlist | `primary` |
| status/workspace/audit | CMS lifecycle | varchar/timestamps/FK | draft/current workspace | indexes | Draft |

No `cta_title/button/url` columns are added to News/Product/Service/Page.

## Forms and submissions

| Entity/field | Type | Required/default | Why not Rich Text/JSON only | Legacy value |
|---|---|---|---|---|
| form code/name/status/workspace/submit_label | varchar | code/name required; draft | reusable/queryable definition | no row unless form seed approved |
| field form_id/key/type/label/position/required | FK/varchar/int/bool | required; false/0 | ordered 1:N, stable validation identity | seed from actual legacy/public form definition |
| field config | jsonb | `{}` | flexible options/validation only | seed known constraints |
| submission form/source/entity/time | FK/varchar/bigint/time | required except entity | filter/audit/relation | new submissions only; legacy requests remain source tables |
| submission values | relation + typed text/json value | required relation | independent fields/query/export | no synthetic legacy submission |

## Email Templates

Template: `workspace`, `event_key`, `audience`, `name`; version: `version_no`, `subject`, `body`, `status`, audit timestamps/users. Required fields have no legacy default because templates are new rows seeded Draft from approved baseline. Do not map `cic_email` into templates.

## RBAC/security

Minimal ADD: roles (`code`,`name`,`status`,`is_protected`), role_permissions (`role_id`,`task_id`,`action`,`effect`), user_roles (`user_id`,`role_id`,`assigned/expiry/status`). Legacy direct permission stays authoritative during migration. New tables start empty or with explicitly approved system roles; never infer broad roles from similar permission sets.

Security fields (`account_status`, `two_factor_enabled`, `failed_login_attempts`, `locked_until`, `password_changed_at`) are ADD only when authentication implementation is approved. Defaults: map active/deactivated from `published`; false/0/NULL. Never store OTP/secret in audit.

## Audit and Trash

`activity_logs`: UUID/bigint ID, actor FK nullable, action, entity_type/id, request/IP/user-agent, before/after JSON redacted, timestamp. Required action/entity/timestamp; actor nullable for system/legacy.

`trash_items`: entity_type/id/source workspace, title snapshot, payload snapshot JSON, deleted_by/time, restored_by/time, purge_after. Required identity/deleted time; no migration row is synthesized for ordinary legacy data.

## Customer Request extensions

Notes/events tables only if feature is used. Use `(source_type, source_id)` rather than copying base request. Legacy rows receive no note/event. Allowed source types are contact/product_contact/order/form_submission.

## Event end time — MAP/REUSE, không ADD

Dùng `cic_event.end_time timestamptz NULL` hiện có làm thời gian kết thúc. Thêm CHECK `end_time > time_event` khi cả hai có giá trị và chỉ thêm index theo `(published, time_event, end_time)` khi truy vấn trạng thái thực tế cần. Giá trị legacy do code cũ ghi như audit timestamp phải được đối soát với `updated_time`, lưu báo cáo và chuẩn hóa về NULL; không tạo `event_end_time`.
