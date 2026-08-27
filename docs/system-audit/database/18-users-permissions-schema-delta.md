# Schema Delta — Người dùng và Vai trò & quyền

Phạm vi audit: code CMS cũ trong `httpdocs` → PostgreSQL hiện tại → code CMS mới. Tài liệu chỉ ghi phần cần **thêm**; chưa phải migration SQL.

## Người dùng

### Bảng hiện có cần mở rộng

`cic_users` tiếp tục là bảng tài khoản quản trị chính. Các field hồ sơ, đăng nhập, phạm vi legacy, trạng thái online và thời gian truy cập đã đáp ứng phần lớn CMS mới.

| Table | Field thêm | Type | Nullable / Default | FK | Index | Mức độ | CMS mới sử dụng | Lý do cần thêm |
| ----- | ---------- | ---- | ------------------ | -- | ----- | ------ | --------------- | -------------- |
| `cic_users` | `account_status` | `varchar(32)` | `NOT NULL DEFAULT 'active'` sau backfill | — | Index thường | **BẮT BUỘC** | Form/list/filter với `active`, `suspended`, `deactivated`, `pending_invite` | `published` chỉ biểu diễn bật/tắt, không đủ phân biệt bốn trạng thái tài khoản. Backfill: `published=true → active`, còn lại → `deactivated`; tiếp tục đồng bộ `published` trong giai đoạn compatibility. |
| `cic_users` | `two_factor_enabled` | `boolean` | `NOT NULL DEFAULT false` | — | — | **BẮT BUỘC** | Tab Vai trò & phạm vi/Bảo mật cho phép bật tắt 2FA | Không có field legacy tương đương; chỉ lưu cờ trạng thái, secret 2FA phải thuộc lớp xác thực riêng. |
| `cic_users` | `password_changed_at` | `timestamptz` | Nullable, default `NULL` | — | — | **BẮT BUỘC** | Form đổi mật khẩu và phần thông tin bảo mật | `updated_time` không tương đương vì còn thay đổi khi sửa hồ sơ/quyền. |
| `cic_users` | `failed_login_attempts` | `integer` | `NOT NULL DEFAULT 0` | — | — | **ĐỀ XUẤT** | Màn hình audit tài khoản đang hiển thị số lần đăng nhập lỗi | Chỉ bật ghi thật khi backend xác thực/lockout được triển khai; dữ liệu hiện tại là mock. |

### Bảng mới cần tạo

#### `cic_user_status_history` — **BẮT BUỘC**

- Columns: `id bigint identity`, `user_id integer`, `previous_status varchar(32)`, `new_status varchar(32)`, `reason text`, `changed_at timestamptz`, `changed_by integer`.
- PK: `id`.
- FK: `user_id → cic_users(id)`; `changed_by → cic_users(id)`; nên dùng `ON DELETE RESTRICT` cho user và `ON DELETE SET NULL` cho người thao tác.
- Index: `(user_id, changed_at DESC)`.
- Quan hệ: một user có nhiều lần đổi trạng thái.
- Lý do: CMS mới tạo và hiển thị lịch sử mỗi khi trạng thái tài khoản thay đổi; không thể nhét lịch sử nhiều dòng vào `cic_users`.

#### `cic_security_events` — **ĐỀ XUẤT**

- Columns: `id bigint identity`, `user_id integer NULL`, `event_type varchar(64)`, `status varchar(16)`, `ip_address inet NULL`, `user_agent text NULL`, `details text NULL`, `created_at timestamptz`.
- PK: `id`.
- FK: `user_id → cic_users(id)` với `ON DELETE SET NULL`.
- Index: `(user_id, created_at DESC)`, `(event_type, created_at DESC)`.
- Lý do: tab Bảo mật đang đọc security log mock. Chỉ tạo khi lớp authentication thực sự phát event; không tái sử dụng `cic_history` vì bảng đó mang ngữ nghĩa giao dịch/nghiệp vụ khác.

### Mapping / lưu ý

- `avatar → image`, `status_online → isOnline`; `fname`, `lname`, `full_name`, `email`, `phone`, `country`, `address`, `summary`, `ordering`, `created_time`, `updated_time`, `last_visit_time`, `nums_visit` dùng trực tiếp từ `cic_users`.
- Phạm vi chi nhánh/danh mục tiếp tục dùng `agencies`, `products_categories`, `news_categories` để tương thích các giá trị legacy `none`, `all` hoặc danh sách ID. Chưa tạo bảng relation chỉ để chuẩn hóa khi contract hiện tại chưa cần query/FK độc lập.
- `primaryRoleId` là projection từ `cic_user_roles`; không thêm `role_id` vào `cic_users`.
- Password map vào `cic_users.password`, nhưng form React hiện validate password rồi không đưa password vào object `CicUser`. Đây là lỗi contract implementation cần sửa khi nối backend, không phải lý do tạo field mới.
- Username và email đang được CMS kiểm tra trùng. Trước khi thêm unique index chuẩn hóa cần profiling NULL, chuỗi rỗng, khoảng trắng, khác biệt hoa/thường và dữ liệu trùng legacy.

## Vai trò & quyền

### Bảng hiện có cần mở rộng

Không có field bắt buộc cần thêm vào các bảng quyền legacy. Tiếp tục tái sử dụng:

- `cic_permission_tasks`, `cic_permission_fun`, `cic_permission_field` làm danh mục task/function/field;
- `cic_users_permission`, `cic_users_permission_fun`, `cic_users_permission_field` làm quyền trực tiếp theo user và lớp compatibility/override.

### Bảng mới cần tạo

#### `cic_roles` — **BẮT BUỘC**

- Columns: `id bigint identity`, `code varchar(100)`, `name varchar(255)`, `category varchar(16)`, `risk_level varchar(16)`, `status varchar(24)`, `purpose text NULL`, `description text NULL`, `owner_name varchar(255) NULL`, `reviewer_name varchar(255) NULL`, `review_due_at timestamptz NULL`, `is_protected boolean NOT NULL DEFAULT false`, `created_at timestamptz`, `created_by integer NULL`, `updated_at timestamptz`, `updated_by integer NULL`.
- PK: `id`.
- FK: `created_by`, `updated_by → cic_users(id)` với `ON DELETE SET NULL`.
- Index/unique: unique trên `lower(trim(code))`; index `(status, category)` và `review_due_at`.
- Quan hệ: role có nhiều version và nhiều assignment.
- Lý do: PostgreSQL hiện chỉ có quyền trực tiếp theo user; không biểu diễn được danh sách role mới. `code` là mã ổn định do backend sinh một lần, dù UI hiện chỉ nhập tên.

#### `cic_role_versions` — **BẮT BUỘC**

- Columns: `id bigint identity`, `role_id bigint`, `version_number numeric(10,1)`, `status varchar(16)`, `change_note text NULL`, `created_at timestamptz`, `created_by integer NULL`, `activated_at timestamptz NULL`, `activated_by integer NULL`.
- PK: `id`.
- FK: `role_id → cic_roles(id) ON DELETE CASCADE`; user audit FK dùng `ON DELETE SET NULL`.
- Index/unique: unique `(role_id, version_number)`; partial unique `(role_id)` cho mỗi trạng thái `active` và `draft`.
- Lý do: modal Role đang lưu draft/activate, so sánh diff và hiển thị lịch sử version; không thể lưu đè trực tiếp lên role mà vẫn giữ contract đó.

#### `cic_role_version_permissions` — **BẮT BUỘC**

- Columns: `role_version_id bigint`, `permission_task_id integer`, `action varchar(24)`, `state varchar(16)`.
- PK/unique: `(role_version_id, permission_task_id, action)`.
- FK: `role_version_id → cic_role_versions(id) ON DELETE CASCADE`; `permission_task_id → cic_permission_tasks(id) ON DELETE RESTRICT`.
- Index: `permission_task_id`.
- Quan hệ: mapper đổi matrix `module/action/state` của ViewModel sang task legacy tương ứng; không tạo danh mục permission thứ hai.
- Lý do: CMS mới ghi `allowed`, `denied`, `conditional` cho từng action của từng role version.

#### `cic_user_roles` — **BẮT BUỘC**

- Columns: `id bigint identity`, `user_id integer`, `role_id bigint`, `assigned_at timestamptz`, `assigned_by integer NULL`, `expires_at timestamptz NULL`, `status varchar(16) NOT NULL DEFAULT 'active'`.
- PK: `id`.
- FK: `user_id → cic_users(id) ON DELETE CASCADE`; `role_id → cic_roles(id) ON DELETE RESTRICT`; `assigned_by → cic_users(id) ON DELETE SET NULL`.
- Index/unique: index `(user_id, status, expires_at)` và `(role_id, status)`; unique active assignment `(user_id, role_id)` nếu một user không được gán lặp cùng role.
- Lý do: CMS mới gán/thu hồi role, hỗ trợ thời hạn và hiển thị phạm vi. Không lưu lặp `role_name`, username hoặc email.

#### `cic_permission_policy_issues` — **ĐỀ XUẤT**

- Columns tối thiểu: `id`, `role_id`, `severity`, `issue_type`, `title`, `description`, `recommendation`, `detected_at`, `resolved_at NULL`, `resolved_by NULL`.
- PK/FK: `id`; `role_id → cic_roles(id)`, `resolved_by → cic_users(id)`.
- Index: `(role_id, resolved_at)`, `(severity, resolved_at)`.
- Lý do: tab xung đột hiện chỉ chạy rule đơn giản trên mock/local state. Chỉ tạo khi có rule engine và yêu cầu lưu vòng đời cảnh báo thật.

#### `cic_access_reviews` — **ĐỀ XUẤT**

- Columns tối thiểu: `id`, `role_id`, `target_user_id NULL`, `reviewer_user_id`, `due_at`, `status`, `notes NULL`, `completed_at NULL`.
- PK/FK: `id`; các FK tới `cic_roles`/`cic_users`.
- Index: `(reviewer_user_id, status, due_at)`, `(role_id, status)`.
- Lý do: UI hiện chỉ xác nhận/thu hồi các record mock và chưa có luồng tạo campaign. Chỉ tạo khi nghiệp vụ access review được duyệt.

### Mapping / lưu ý

- Nhóm `fs_users_groups` cũ có thể dùng làm nguồn tham khảo/import role, nhưng không đủ contract version, scope và trạng thái quyền của CMS mới; không dùng tên nhóm làm permission source duy nhất.
- `assignedUsersCount`, `assignedGroupCount`, `conflictIssuesCount`, `reviewDueDays` là dữ liệu đếm/derive; không tạo column riêng. CMS hiện chưa có luồng gán role cho group nên không tạo bảng role-group.
- Quyền trực tiếp legacy phải tiếp tục có hiệu lực trong giai đoạn chuyển đổi. Không tự suy diễn role rộng từ các user có bộ quyền gần giống nhau.
- Trước khi bật RBAC làm nguồn quyết định quyền, phải chụp manifest quyền hiệu lực từng user và chứng minh parity 100%; mọi chênh lệch phải được phê duyệt rõ ràng.
- Task Definition tiếp tục ghi `cic_permission_tasks`; quyền function/field tiếp tục dùng các bảng legacy tương ứng, không tạo field JSON/matrix trên `cic_roles`.

## Kết luận delta

- `cic_users`: **3 field bắt buộc**, **1 field đề xuất**.
- Bảng mới bắt buộc: `cic_user_status_history`, `cic_roles`, `cic_role_versions`, `cic_role_version_permissions`, `cic_user_roles`.
- Bảng mới đề xuất, chưa triển khai khi chỉ có mock: `cic_security_events`, `cic_permission_policy_issues`, `cic_access_reviews`.
- Không thay thế hoặc xóa các bảng quyền trực tiếp legacy; không thêm `role_id` vào `cic_users`.
