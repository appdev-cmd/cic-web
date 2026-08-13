# Kế hoạch dữ liệu tương thích — Người dùng và Vai trò & Quyền

> Trạng thái: Thiết kế để review, chưa phải migration hoặc SQL triển khai  
> Phạm vi: Giữ nguyên trải nghiệm CMS mới, đồng thời bảo toàn dữ liệu CMS cũ  
> Nguồn đối chiếu: `httpdocs/cms/modules/users`, schema MySQL cũ và `db_migrate/cic14005_cic_fs_schema_moi_postgresql_PATCHED.sql`

## 1. Quyết định chốt

Giữ nguyên hai chức năng đang có trên CMS mới:

- **Người dùng**: quản lý hồ sơ, trạng thái tài khoản, vai trò, phạm vi phụ trách và thông tin bảo mật.
- **Vai trò & Quyền**: vai trò, gán vai trò, ma trận quyền, phạm vi áp dụng, phiên bản, cảnh báo xung đột và rà soát quyền.

Không ép giao diện mới quay về giới hạn của CMS cũ. Thay vào đó, dữ liệu được chia thành hai lớp:

1. **Lớp tương thích legacy** giữ nguyên ID và các giá trị đã có trong `fs_users` cùng các bảng permission cũ.
2. **Lớp mở rộng CMS mới** bổ sung bảng chuẩn hóa cho role, scope, version, audit và security.

Nguyên tắc quan trọng nhất là không xóa hoặc ghi đè dữ liệu legacy trong lần chuyển đổi đầu tiên.

## 2. Dữ liệu CMS cũ cần giữ nguyên

### 2.1. Người dùng

Nguồn là `fs_users`, tương ứng với `cic_users` trong schema PostgreSQL hiện tại.

| Trường legacy | Dùng trong CMS mới | Cách xử lý |
|---|---|---|
| `id` | ID người dùng | Giữ nguyên ID khi migrate |
| `username` | Tên đăng nhập | Giữ nguyên, bắt buộc duy nhất |
| `password` | Xác thực | Giữ nguyên hash trong giai đoạn chuyển đổi; nâng hash khi người dùng đăng nhập/đổi mật khẩu |
| `fname`, `lname` | Họ và tên | Giữ để tương thích; đồng bộ với `full_name` |
| `full_name` | Tên hiển thị | Ưu tiên hiển thị; nếu trống thì ghép `lname` + `fname` |
| `email` | Email | Giữ nguyên; kiểm tra trùng trước khi bật ràng buộc unique |
| `phone` | Điện thoại | Giữ nguyên |
| `address`, `country` | Hồ sơ | Giữ nguyên |
| `image` | Ảnh đại diện | Map sang `avatar` ở API, không cần đổi tên cột ngay |
| `summary` | Ghi chú/mô tả | Giữ nguyên |
| `published` | Trạng thái cũ | Map sang trạng thái tài khoản mới theo quy tắc ở mục 4 |
| `ordering` | Thứ tự legacy | Giữ trong giai đoạn tương thích |
| `created_time`, `updated_time` | Audit cơ bản | Giữ nguyên |
| `last_visit_time`, `nums_visit` | Lịch sử truy cập | Giữ nguyên |
| `status_online` | Trạng thái trực tuyến legacy | Giữ tạm; về sau tính từ session thay vì sửa trực tiếp |
| `agencies` | Chi nhánh/phạm vi | Giữ raw value và đồng thời chuẩn hóa sang bảng liên kết |
| `products_categories` | Danh mục sản phẩm phụ trách | Giữ raw value và chuẩn hóa sang bảng liên kết |
| `news_categories` | Danh mục tin tức phụ trách | Giữ raw value và chuẩn hóa sang bảng liên kết |

### 2.2. Phân quyền

Các bảng hiện có phải được giữ và migrate nguyên dữ liệu:

- `fs_permission_tasks` → `cic_permission_tasks`
- `fs_permission_fun` → `cic_permission_fun`
- `fs_permission_field` → `cic_permission_field`
- `fs_users_permission` → `cic_users_permission`
- `fs_users_permission_fun` → `cic_users_permission_fun`
- `fs_users_permission_field` → `cic_users_permission_field`

Quyền số của CMS cũ được diễn giải như sau:

| Mức legacy | Ý nghĩa tương thích |
|---:|---|
| `0` | Không có quyền |
| `3` | Xem |
| `5` | Xem và sửa |
| `7` | Xem, sửa và xóa |

Không suy diễn tự động quyền `review`, `approve`, `publish`, `export` hoặc `configure` từ giá trị legacy. Các quyền đó chỉ được bật khi có task/function cũ tương ứng hoặc quản trị viên cấu hình rõ ràng trong CMS mới.

## 3. Mô hình dữ liệu đề xuất

Đây là mô hình logic, chưa phải câu lệnh SQL.

### 3.1. Bổ sung tối thiểu vào `cic_users`

| Trường mới | Mục đích | Mặc định khi migrate |
|---|---|---|
| `account_status` | `active`, `suspended`, `deactivated`, `pending_invite` | `active` nếu `published = true`, ngược lại `deactivated` |
| `two_factor_enabled` | Hiển thị và quản lý 2FA | `false` |
| `password_changed_at` | Thời điểm đổi mật khẩu gần nhất | `NULL` |
| `failed_login_attempts` | Số lần đăng nhập lỗi liên tiếp | `0` |
| `locked_until` | Khóa tạm thời do đăng nhập sai | `NULL` |

Không thêm `role_id` trực tiếp vào `cic_users`, vì một người có thể có nhiều vai trò hoặc vai trò theo phạm vi. Quan hệ được lưu ở `cic_user_roles`.

### 3.2. Bảng liên kết phạm vi người dùng

| Bảng | Dữ liệu |
|---|---|
| `cic_user_agencies` | `user_id`, `agency_id` |
| `cic_user_product_categories` | `user_id`, `category_id` |
| `cic_user_news_categories` | `user_id`, `category_id` |

Các giá trị legacy `none`, `all` hoặc chuỗi `,1,2,3,` phải được nhận diện rõ:

- `none`: không được phụ trách mục nào.
- `all`: toàn bộ phạm vi tương ứng.
- Danh sách ID: tạo từng bản ghi liên kết theo đúng thứ tự/ID cũ.

Để biểu diễn `all` mà không phải nhân bản toàn bộ ID, bảng liên kết có thể có `scope_mode = all | selected | none`. Không dùng chuỗi CSV cho dữ liệu mới.

### 3.3. Vai trò

#### `cic_roles`

- `id`
- `code`: mã ổn định dùng trong API và source code.
- `name`
- `category`: `system` hoặc `custom`.
- `risk_level`: `standard`, `elevated`, `privileged`.
- `status`: `active`, `draft`, `archived`, `needs_review`.
- `purpose`
- `description`
- `owner_user_id` hoặc `owner_name`
- `reviewer_user_id` hoặc `reviewer_name`
- `active_version_id`
- `review_due_at`
- `created_at`, `created_by`, `updated_at`, `updated_by`
- `is_protected`: không cho xóa vai trò hệ thống/mặc định.

Tên hiển thị có thể sửa; `code` của vai trò hệ thống không được sửa.

#### `cic_role_versions`

- `id`
- `role_id`
- `version_number`
- `status`: `draft`, `active`, `superseded`.
- `change_note`
- `created_at`, `created_by`
- `activated_at`, `activated_by`

Một vai trò chỉ có tối đa một version `active` và một version `draft` tại cùng thời điểm.

#### `cic_role_version_permissions`

- `role_version_id`
- `permission_task_id`
- `action`: `view`, `create`, `edit`, `delete`, `review`, `approve`, `publish`, `export`, `configure`.
- `state`: `allowed`, `denied`, `conditional`.

`permission_task_id` tham chiếu `cic_permission_tasks`, nhờ đó không tạo một danh mục module/quyền thứ hai tách rời legacy.

#### `cic_role_version_scopes`

- `role_version_id`
- `scope_type`: `global`, `site`, `team`, `locale`, `ownership`.
- `scope_value`
- `description`

Mỗi giá trị scope lưu thành một dòng; không lưu mảng tùy ý trong một cột text.

### 3.4. Gán vai trò

#### `cic_user_roles`

- `id`
- `user_id`
- `role_id`
- `assigned_at`, `assigned_by`
- `expires_at`
- `status`: `active`, `revoked`, `expired`.
- `scope_summary`: snapshot để hiển thị nhanh, không phải nguồn kiểm tra quyền.

Không lưu `role_name` lặp lại. API join từ `cic_roles`.

### 3.5. Quyền riêng theo người dùng

Các bảng `cic_users_permission*` hiện tại tiếp tục đóng vai trò **user override**, nhằm giữ nguyên quyền của CMS cũ.

Quy tắc tính quyền hiệu lực:

1. Tập hợp quyền từ tất cả role đang hoạt động và chưa hết hạn.
2. Áp dụng scope của role.
3. Áp dụng quyền trực tiếp đã migrate từ `cic_users_permission*`.
4. Quyền từ dữ liệu legacy không được tự động giảm trong lần migrate đầu tiên.
5. Khi có deny rõ ràng ở mô hình mới, deny thắng allow trong cùng phạm vi.

API phải trả thêm `permissionSource = role | direct_legacy | direct_override` để màn hình mô phỏng quyền giải thích được quyền đến từ đâu.

### 3.6. Bảo mật và lịch sử

#### `cic_user_status_history`

- `id`, `user_id`
- `previous_status`, `new_status`
- `reason`
- `changed_at`, `changed_by`

#### `cic_security_events`

- `id`, `user_id`
- `event_type`: đăng nhập thành công/thất bại, đổi mật khẩu, reset mật khẩu, bật/tắt 2FA, khóa/mở khóa.
- `status`: `success`, `warning`, `failed`.
- `ip_address`, `user_agent`
- `details`
- `created_at`

Không dùng `cic_history` hiện tại cho security log vì bảng đó là lịch sử nghiệp vụ legacy có các trường `money`, `service_name`, không đúng ngữ nghĩa bảo mật.

#### `cic_permission_policy_issues`

Lưu các cảnh báo thực sự được rule engine phát hiện:

- `role_id`, `severity`, `issue_type`
- `title`, `description`, `recommendation`
- `detected_at`, `resolved_at`, `resolved_by`

Không seed cảnh báo giả vào production.

#### `cic_access_reviews`

- `role_id`, `target_user_id`
- `reviewer_user_id`
- `due_at`
- `status`: `pending`, `confirmed`, `reduced`, `revoked`.
- `notes`, `completed_at`

Chức năng này được giữ trong UI nhưng chỉ bật khi có dữ liệu và người phụ trách thực tế.

## 4. Quy tắc map trạng thái người dùng

| Legacy | Trạng thái mới ban đầu |
|---|---|
| `published = 1` | `active` |
| `published = 0` | `deactivated` |
| `published IS NULL` | `deactivated`, đồng thời ghi cảnh báo kiểm tra dữ liệu |

Sau migration:

- `suspended`: khóa tạm thời, có thể kích hoạt lại.
- `deactivated`: ngừng sử dụng chủ động.
- `pending_invite`: chỉ dùng cho tài khoản tạo theo luồng gửi lời mời mới.
- `published` vẫn được đồng bộ từ `account_status` trong giai đoạn tương thích: chỉ `active` tương ứng `true`.

## 5. Cách giữ nguyên giao diện CMS mới

### 5.1. Module Người dùng

| UI hiện tại | Nguồn dữ liệu |
|---|---|
| Hồ sơ người dùng | `cic_users` |
| Vai trò | `cic_user_roles` + `cic_roles` |
| Chi nhánh/danh mục phụ trách | Các bảng `cic_user_*` chuẩn hóa; fallback sang cột CSV legacy |
| Trạng thái nhiều cấp | `cic_users.account_status` |
| 2FA | `two_factor_enabled` và cấu hình xác thực riêng ở backend |
| Lịch sử trạng thái | `cic_user_status_history` |
| Nhật ký bảo mật | `cic_security_events` |
| Lần truy cập cuối/số lần truy cập | Trường legacy trên `cic_users` |

### 5.2. Module Vai trò & Quyền

| Tab UI | Nguồn dữ liệu |
|---|---|
| Danh sách vai trò | `cic_roles`, version active/draft |
| Gán vai trò | `cic_user_roles` |
| Xung đột quyền | `cic_permission_policy_issues` |
| Đợt rà soát | `cic_access_reviews` |
| Ma trận quyền | Role permissions kết hợp user override legacy |
| Danh mục chức năng | `cic_permission_tasks`, `cic_permission_fun`, `cic_permission_field` |

Như vậy không phải bỏ tab nào của CMS mới. Những tab chưa có backend thật phải hiển thị empty state đúng nghĩa, không dùng số liệu mock trong production.

## 6. Thứ tự chuyển đổi dữ liệu

1. Import `fs_users` vào `cic_users`, giữ nguyên ID.
2. Import toàn bộ danh mục task/function/field và quyền trực tiếp theo user.
3. Thêm trạng thái mới và map từ `published`; chưa xóa `published`.
4. Chuẩn hóa chi nhánh/danh mục từ chuỗi legacy sang các bảng liên kết; lưu báo cáo ID không tìm thấy.
5. Tạo một vai trò hệ thống tên `Legacy direct access` để biểu thị nguồn quyền cũ trong UI, nhưng không chuyển quyền user thành quyền role nếu không chứng minh được các user có cùng tập quyền.
6. Nếu đọc được dữ liệu `fs_groups`, import nhóm thành `cic_roles`, giữ mapping `legacy_group_id`.
7. Tạo version `1.0` cho mỗi role được import và map mức quyền `3/5/7`.
8. Chỉ sau khi đối chiếu quyền hiệu lực trước/sau đạt 100% mới cho phép CMS mới ghi quyền thật.

## 7. Kiểm tra bắt buộc trước rollout

- Tổng số user trước và sau phải bằng nhau.
- Mọi `fs_users.id` phải tồn tại đúng ID trong `cic_users`.
- Username, email, trạng thái kích hoạt và password hash không bị thay đổi ngoài quy tắc đã duyệt.
- Mọi task permission legacy phải có bản ghi đích hoặc nằm trong báo cáo lỗi.
- So sánh quyền hiệu lực theo từng user, module và task.
- User đang có quyền ở CMS cũ không được mất quyền âm thầm.
- Role hệ thống không thể bị xóa.
- Không cho tự thu hồi quyền của tài khoản quản trị cuối cùng.
- Tài khoản deactivated/suspended không đăng nhập được dù vẫn còn role.
- Security log không lưu password, token, OTP hoặc secret 2FA.

## 8. Trường giữ tạm và có thể xóa sau

Chỉ xem xét xóa sau ít nhất một chu kỳ production ổn định và đã đối chiếu dữ liệu.

| Trường/bảng | Khi nào có thể bỏ |
|---|---|
| `cic_users.published` | Khi toàn bộ auth/API dùng `account_status` và đã ngừng rollback về backend cũ |
| `cic_users.fname`, `lname` | Khi xác nhận tất cả nghiệp vụ chỉ dùng `full_name`; nếu còn chức năng tách họ/tên thì giữ |
| `cic_users.ordering` | Khi danh sách người dùng không còn nghiệp vụ sắp xếp thủ công |
| `cic_users.status_online` | Khi trạng thái online được tính hoàn toàn từ session/last activity |
| `cic_users.agencies` | Khi bảng `cic_user_agencies` đã đối chiếu đủ |
| `cic_users.products_categories` | Khi bảng liên kết sản phẩm đã đối chiếu đủ |
| `cic_users.news_categories` | Khi bảng liên kết tin tức đã đối chiếu đủ |
| `cic_users_permission*` | Chưa xóa. Chỉ cân nhắc sau khi mọi quyền trực tiếp đã được chủ sở hữu nghiệp vụ chuyển sang role và ký xác nhận |
| `legacy_group_id` | Giữ lâu dài để audit, trừ khi có quyết định ẩn danh/xóa dữ liệu legacy |

Không xóa `username`, password hash đang dùng, ID legacy hoặc dữ liệu audit chỉ vì UI mới không hiển thị trực tiếp.

## 9. Những điểm cần xác nhận trước khi viết migration

1. Có lấy được dữ liệu thật của `fs_groups`, `fs_users_groups`, `fs_groups_permission` hay không; các bảng này có trong code cũ nhưng chưa có trong dump PostgreSQL hiện tại.
2. Một user được phép có nhiều role hay chỉ một role chính.
3. Quyền trực tiếp legacy là override vĩnh viễn hay sẽ được quản trị viên chuyển dần sang role.
4. Có triển khai 2FA thật ngay đợt đầu hay chỉ giữ UI ở trạng thái “chưa cấu hình”.
5. Ai là owner/reviewer thật của từng role và chu kỳ rà soát quyền là bao lâu.
6. Các action `review` và `approve` còn phù hợp hay phải ẩn vì CMS nội dung hiện chỉ còn Lưu nháp/Xuất bản.

Các câu hỏi trên ảnh hưởng migration và enforcement quyền, nhưng không buộc phải thay đổi thiết kế giao diện hiện tại.
