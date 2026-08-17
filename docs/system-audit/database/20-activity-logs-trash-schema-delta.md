# Schema Delta — Nhật ký hoạt động và Thùng rác

Phạm vi audit: code CMS cũ trong `httpdocs` → PostgreSQL hiện tại → code CMS mới. Tài liệu chỉ ghi phần cần **thêm**; chưa phải migration SQL.

## Nhật ký hoạt động

### Bảng hiện có cần mở rộng

Không có.

`cic_history`/`fs_history` là lịch sử tiền và dịch vụ với các field `username`, `money`, `type`, `service_name`, `service_id`; không đúng ngữ nghĩa audit quản trị và không nên mở rộng thành bảng sự kiện dùng chung.

### Bảng mới cần tạo

#### `cic_activity_logs` — **BẮT BUỘC**

| Column | Type | Constraint / ý nghĩa |
| ------ | ---- | -------------------- |
| `id` | `uuid` | PK, default UUID do PostgreSQL sinh |
| `occurred_at` | `timestamptz` | NOT NULL DEFAULT `now()` |
| `actor_id` | `integer` | NULL, FK → `cic_users(id)` ON DELETE SET NULL; NULL cho system/legacy actor |
| `actor_label` | `varchar(255)` | NULL, snapshot/fallback khi actor hệ thống hoặc tài khoản đã đổi thông tin |
| `action_code` | `varchar(100)` | NOT NULL, mã ổn định từ action registry |
| `category` | `varchar(50)` | NOT NULL |
| `severity` | `varchar(16)` | NOT NULL, CHECK `low`, `medium`, `high`, `critical` |
| `is_sensitive` | `boolean` | NOT NULL DEFAULT `false` |
| `entity_type` | `varchar(100)` | NOT NULL |
| `entity_id` | `varchar(100)` | NULL; dùng text vì ID legacy/new không đồng nhất kiểu |
| `entity_title` | `text` | NULL, snapshot để log vẫn đọc được sau khi entity đổi/xóa |
| `module` | `varchar(100)` | NULL |
| `workspace` | `varchar(50)` | NOT NULL |
| `locale` | `varchar(10)` | NULL |
| `result` | `varchar(16)` | NOT NULL, CHECK `success`, `failed`, `partial`, `denied` |
| `result_message` | `text` | NULL |
| `session_id` | `varchar(100)` | NULL |
| `correlation_id` | `varchar(100)` | NULL |
| `source_app` | `varchar(100)` | NULL |
| `environment` | `varchar(20)` | NULL, CHECK theo environment được hỗ trợ |
| `ip_address` | `inet` | NULL |
| `user_agent` | `text` | NULL |
| `http_method` | `varchar(10)` | NULL |
| `endpoint` | `text` | NULL |
| `execution_time_ms` | `integer` | NULL, CHECK `>= 0` |
| `before_data` | `jsonb` | NULL, dữ liệu trước thay đổi đã redaction |
| `after_data` | `jsonb` | NULL, dữ liệu sau thay đổi đã redaction |
| `redacted_fields` | `text[]` | NULL, danh sách field đã che |

- Index: (`occurred_at` DESC), (`actor_id`, `occurred_at` DESC), (`action_code`, `occurred_at` DESC), (`entity_type`, `entity_id`, `occurred_at` DESC), (`category`, `result`, `occurred_at` DESC), `correlation_id` khi khác NULL.
- Quan hệ: actor là FK tùy chọn; target dùng polymorphic identity, không tạo FK giả tới hơn 100 bảng domain.
- Dữ liệu append-only: application role không UPDATE/DELETE event; retention/purge phải là job riêng có quyền hạn và policy rõ ràng.
- Lý do: CMS mới lọc và xem actor, action, target, scope, kết quả, request context và diff trước/sau; không bảng hiện có nào đáp ứng đúng nghĩa.

#### `cic_audit_export_jobs` — **ĐỀ XUẤT**

- Columns: `id uuid`, `requested_at timestamptz`, `requested_by integer NULL`, `workspace varchar(50)`, `filter_payload jsonb`, `status varchar(16)`, `total_records integer NULL`, `file_path text NULL`, `file_size_bytes bigint NULL`, `expires_at timestamptz NULL`, `error_message text NULL`, `completed_at timestamptz NULL`.
- PK: `id`.
- FK: `requested_by → cic_users(id) ON DELETE SET NULL`.
- Index: (`requested_by`, `requested_at` DESC), (`status`, `requested_at`), (`expires_at`) cho cleanup.
- Lý do: drawer hiện chỉ tạo export job bằng local state/timer. Chỉ tạo bảng khi worker xuất file thật được duyệt; file kết quả không lưu trực tiếp trong DB.

### Mapping / lưu ý

- Actor name/email/role/avatar chủ yếu join từ `cic_users`/RBAC; chỉ giữ `actor_label` fallback, không lưu lặp toàn bộ profile trong event.
- Action label và metadata mô tả lấy từ action registry theo `action_code`; không lưu label dịch vào log.
- DTO tính danh sách `changes[]` từ `before_data`/`after_data` và `redacted_fields`; secret, token, password, OTP và dữ liệu nhạy cảm phải được che **trước khi INSERT**.
- `target.url`, site name và module label có thể compose từ route/workspace registry. `entity_title` là snapshot có chủ đích vì target có thể bị xóa.
- Không backfill log giả từ timestamps hoặc `cic_history`; chỉ import nguồn legacy nào có mapping actor/action/entity rõ và kiểm chứng được.

## Thùng rác

### Bảng hiện có cần mở rộng

Không có. Không thêm `is_trash`, `deleted_at`, payload hoặc metadata restore vào từng bảng domain.

Code CMS cũ chỉ có cơ chế `is_trash` riêng trong một số luồng Sản phẩm; PostgreSQL draft không có lifecycle chung và cơ chế đó không đáp ứng media, nội dung, cấu hình cùng conflict/legal hold của CMS mới.

### Bảng mới cần tạo

#### `cic_trash_items` — **BẮT BUỘC**

| Column | Type | Constraint / ý nghĩa |
| ------ | ---- | -------------------- |
| `id` | `uuid` | PK, default UUID do PostgreSQL sinh |
| `workspace` | `varchar(50)` | NOT NULL |
| `entity_type` | `varchar(100)` | NOT NULL, theo registry loại entity được phép xóa |
| `entity_id` | `varchar(100)` | NOT NULL |
| `module` | `varchar(100)` | NOT NULL |
| `title_snapshot` | `text` | NOT NULL |
| `payload_snapshot` | `jsonb` | NOT NULL |
| `original_url` | `text` | NULL |
| `status` | `varchar(16)` | NOT NULL DEFAULT `'trashed'`, CHECK `trashed`, `restored`, `purged` |
| `deleted_by` | `integer` | NULL, FK → `cic_users(id)` ON DELETE SET NULL |
| `deleted_at` | `timestamptz` | NOT NULL DEFAULT `now()` |
| `purge_after` | `timestamptz` | NULL |
| `restore_state` | `varchar(20)` | NULL, target state đã chọn khi restore |
| `restored_by` | `integer` | NULL, FK → `cic_users(id)` ON DELETE SET NULL |
| `restored_at` | `timestamptz` | NULL |
| `purged_by` | `integer` | NULL, FK → `cic_users(id)` ON DELETE SET NULL |
| `purged_at` | `timestamptz` | NULL |
| `purge_reason` | `text` | NULL |
| `is_legal_hold` | `boolean` | NOT NULL DEFAULT `false` |
| `legal_hold_reason` | `text` | NULL |

- Unique: partial unique (`workspace`, `entity_type`, `entity_id`) WHERE `status = 'trashed'`.
- Index: (`status`, `deleted_at` DESC), (`status`, `purge_after`), (`deleted_by`, `deleted_at` DESC), (`entity_type`, `entity_id`), partial index `purge_after` WHERE `status='trashed' AND is_legal_hold=false`.
- Quan hệ: polymorphic reference tới entity nguồn; user lifecycle fields dùng FK thật. Không tạo FK polymorphic giả.
- Lý do: CMS mới cần list/detail snapshot, restore, conflict handling, retention, permanent purge và legal hold trên nhiều module.

### Mapping / lưu ý

- `itemType` và `moduleName` map từ `entity_type/module`; scope map `workspace`; `deletedBy` join user; `expiresAt/daysRemaining` derive từ `purge_after`; `snapshotData → payload_snapshot`.
- `dependencyStatus` và `dependencyDetails` phải được dependency service tính tại thời điểm xem/restore vì quan hệ có thể thay đổi; không lưu thành dữ liệu nguồn cố định.
- Delete, restore và purge phải chạy transaction theo adapter của từng entity. Không giả định một JSON snapshot có thể tự khôi phục mọi FK/media/relation.
- Legal hold chặn purge ở cả service và job retention; UI disable nút không phải cơ chế bảo vệ đủ.
- Restore mặc định về Draft/Inactive; nếu alias/FK/parent xung đột, service áp dụng mode được người dùng chọn và ghi kết quả vào `cic_activity_logs`.
- Permanent purge giữ row lifecycle ở trạng thái `purged` nhưng phải redaction/xóa `payload_snapshot` theo retention/privacy policy; lý do và audit event vẫn được giữ.
- Không sinh trash item cho dữ liệu legacy đang hoạt động. Chỉ chuyển record cũ đã thực sự nằm trong trash khi xác minh được entity, trạng thái và snapshot cần thiết.

## Kết luận delta

- Field mới trên bảng hiện có: **0**.
- Bảng mới bắt buộc: `cic_activity_logs`, `cic_trash_items`.
- Bảng mới đề xuất có điều kiện: `cic_audit_export_jobs`.
- Không tái sử dụng `cic_history` làm audit chung và không rải field trash vào từng bảng domain.
