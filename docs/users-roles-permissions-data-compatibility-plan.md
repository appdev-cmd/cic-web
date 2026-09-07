# Kế hoạch dữ liệu tương thích — Người dùng và Vai trò & Quyền

> Trạng thái: Thiết kế để review, chưa phải migration hoặc SQL triển khai  
> Phạm vi: Giữ nguyên trải nghiệm CMS mới, đồng thời bảo toàn dữ liệu CMS cũ  
> Nguồn đối chiếu: `httpdocs/cms/modules/users`, schema MySQL cũ và `db_migrate/cic14005_cic_fs_schema_moi_postgresql_PATCHED.sql`

> Quyết định scope 2026-09-03: module Vai trò & Quyền giữ UI Next hiện tại (role list + create/edit + nhân sự được gán/gán nhân sự + task/action matrix). Các thiết kế role version/scope, SoD, access review và tab governance nâng cao bên dưới là phương án lịch sử, không còn thuộc implementation scope và không phải lý do tạo schema mới.

## 1. Quyết định chốt

Giữ nguyên hai chức năng đang có trên CMS mới:

- **Người dùng**: quản lý hồ sơ, trạng thái tài khoản, vai trò, phạm vi phụ trách và thông tin bảo mật.
- **Vai trò & Quyền**: danh sách vai trò, tạo/sửa vai trò, nhân sự được gán/gán nhân sự và ma trận task/action theo UI Next hiện tại.

Không ép giao diện mới quay về giới hạn của CMS cũ. Thay vào đó, dữ liệu được chia thành hai lớp:

1. **Lớp tương thích legacy** giữ nguyên ID và các giá trị đã có trong `fs_users` cùng các bảng permission cũ.
2. **Lớp CMS mới tối thiểu** dùng bảng role, role-permission và user-role hiện có; audit dùng shared Activity Logs infrastructure.

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

### 3.4. Gán vai trò

#### `cic_user_roles`

- `id`
- `user_id`
- `role_id`
- `assigned_at`, `assigned_by`
- `expires_at`
- `status`: `active`, `revoked`, `expired`.

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
| Danh sách vai trò | `cic_roles` |
| Tạo/sửa vai trò | `cic_roles` + `cic_role_permissions` |
| Ma trận task/action trong editor | `cic_permission_tasks` + `cic_role_permissions` |

Không tạo tab/persistence cho version/scope, SoD, access review, effective-access matrix hoặc catalogue editor. Dữ liệu legacy vẫn được bảo toàn nhưng không được đưa vào form mới.

## 6. Thứ tự chuyển đổi dữ liệu

1. Import `fs_users` vào `cic_users`, giữ nguyên ID.
2. Import toàn bộ danh mục task/function/field và quyền trực tiếp theo user.
3. Thêm trạng thái mới và map từ `published`; chưa xóa `published`.
4. Chuẩn hóa chi nhánh/danh mục từ chuỗi legacy sang các bảng liên kết; lưu báo cáo ID không tìm thấy.
5. Tạo một vai trò hệ thống tên `Legacy direct access` để biểu thị nguồn quyền cũ trong UI, nhưng không chuyển quyền user thành quyền role nếu không chứng minh được các user có cùng tập quyền.
6. Nếu đọc được dữ liệu `fs_groups`, import nhóm thành `cic_roles`, giữ mapping `legacy_group_id`.
7. Map quyền role trực tiếp vào `cic_role_permissions` theo action được chứng minh; không suy diễn action mới.
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
5. Bộ action tối thiểu nào được phép xuất hiện trong task/action matrix hiện tại.

Các câu hỏi trên ảnh hưởng migration và enforcement quyền, nhưng không buộc phải thay đổi thiết kế giao diện hiện tại.

## 10. Audit module Vai trò & Quyền — 2026-09-03

### A. Scope

Chỉ audit CMS Vai trò & Quyền theo product scope đã duyệt: role list, search/filter, create/edit role, quản lý nhân sự ngay trong role và ma trận task/action. Không có Website public surface. Assignment tab riêng, effective-access matrix, catalogue editor, SoD, access review và role version/scope là out of scope.

### B. UI Reference Map

| Màn hình/section | Reference và dữ liệu | UI/interaction/state | Responsive audit |
|---|---|---|---|
| Shell/header | Tiêu đề Vai trò & Quyền, mô tả, CTA tạo role | Hierarchy trái→phải, icon/action theo reference; permission-gated | KEEP shell; ADAPT CTA khi hẹp |
| Tóm tắt | Tổng role và trạng thái cần cho màn hình hiện tại | Read-only summary; không tạo KPI governance giả | KEEP grid hiện tại; stack khi hẹp |
| Role list | code/name, mô tả, trạng thái và số quyền cần hiển thị | search/filter; edit/status theo guard hiện có | FIX table/action overflow và touch targets |
| Role editor | name, description, status và ma trận task/action | create/edit, validation, save/cancel | ADAPT nhóm/cột ma trận; modal phải bounded, focus-trapped, Escape/scroll-lock |

Không có detail route riêng, preview, gallery/media, SEO, public CTA/form hoặc Trash surface trong bằng chứng reference. Animation chỉ là transition/state feedback của tab, modal, drawer và controls; không có media aspect ratio cần bảo toàn.

### C. CMS capability/form/list map

- List: role columns, summary, search/filter và actions đúng giao diện Next hiện tại.
- Form thật hiện chứng minh được: role name, description, status và permission task/action; protected/code/actors/timestamps do hệ thống quản lý.
- Create/edit/status phải authorize server-side và ghi Audit Writer sau mutation thành công.
- Bulk action, preview, trash/restore, media, SEO và publish workflow nội dung không có bằng chứng nghiệp vụ cho module này.
- Assignment tab riêng là out of scope nhưng gán/thu hồi nhân sự trong role list là capability bắt buộc. SoD, access review, effective-access matrix, catalogue editor và role version/scope vẫn out of scope; không tạo backend cho chúng.

### D. DB tables + relation map

- Core live: `cic_roles` ← `cic_role_permissions` → `cic_permission_tasks`; `cic_users` ← `cic_user_roles` → `cic_roles`.
- Catalogue: `cic_permission_tasks`, `cic_permission_fun`, `cic_permission_field`.
- Legacy retained: `cic_users_permission`, `cic_users_permission_fun`, `cic_users_permission_field`; không còn là authority theo cutover đã duyệt và không được mutation/cleanup trong module.
- Các bảng version/SoD/review không tồn tại và không cần tạo cho scope đã duyệt.
- Live snapshot: roles 1; role permissions 0; active assignments 1; tasks 76; functions 16; fields 0; legacy user-task/function/field permissions 920/57/2.
- Constraints đã thấy: normalized unique role code; role status `active|inactive`; composite PK role/task/action; active user-role unique; actor/user/role/task FKs. RLS bật; `authenticated` chỉ có SELECT trên nhóm bảng đã audit, `service_role` bypass theo kiến trúc server.

### E. Field Usage Map

| Table/fields | Classification |
|---|---|
| `cic_roles.name, description, status` | CMS_EDITABLE; status đồng thời CMS_OPERATIONAL |
| `cic_roles.id, code, is_protected` | SYSTEM_MANAGED; protected đồng thời CMS_OPERATIONAL |
| `cic_roles.created_at/by, updated_at/by` | AUDIT; actor IDs đồng thời RELATION |
| `cic_role_permissions.role_id, permission_task_id` | RELATION |
| `cic_role_permissions.action, allowed` | CMS_EDITABLE/CMS_OPERATIONAL |
| `cic_role_permissions.updated_at/by` | AUDIT |
| `cic_user_roles.user_id, role_id` | RELATION và input selector được quản trị |
| `cic_user_roles.status` | CMS_OPERATIONAL; chỉ editable theo approved assignment workflow |
| `cic_user_roles.id, assigned_at/by` | SYSTEM_MANAGED/AUDIT |
| `cic_permission_tasks.module, view, _task, description, published, ordering` | CMS_OPERATIONAL; chỉ CMS_EDITABLE nếu catalogue governance được duyệt |
| `cic_permission_tasks.trigger, list_field, list_function, is_contents` | UNKNOWN; không select/input/write |
| `cic_permission_fun`, `cic_permission_field` keys/relations | CMS_OPERATIONAL/RELATION; edit chưa được chứng minh |
| `cic_users_permission*` | LEGACY_UNUSED đối với authority mới; giữ nguyên, không UI/validation/default/null/delete |

Projection: không có public list/detail. CMS role list chỉ lấy identity/status/protected/count cần render; role form lấy editable fields + task/action relations + audit metadata; assignment lookup chỉ lấy user identity/status và role identity; catalogue lookup chỉ lấy key/label/published/order cần hiển thị. Không dùng `select *`.

### F. Website ↔ CMS shared-domain map

Không có Website consumer. CMS nên dùng chung typed canonical role status, action/task registry, role input validation, explicit row mapper, effective-access resolver, permission guard và Audit registry/writer. UI tab/modal/table không share với Website. Flow mục tiêu: CMS form → validation → server authorization → transactional PATCH-owned fields → Audit Writer → revalidation/refresh → CMS read projection.

### G. Hard dependencies

| Dependency | Use case/chiều | Hiện trạng | Block? |
|---|---|---|---|
| Users/Identity + server auth | assignment/actor; Roles → Users | Có | Không |
| Permission task/action catalogue | role matrix/enforcement; Roles → Catalogue | Có 76 tasks, nhưng 0 role grants | Không cho core; cần seed/config trước rollout |
| Server permission enforcement | mọi CMS action; CMS → RBAC | Có foundation/superadmin bypass; chưa chứng minh role grants toàn CMS | Không cho audit; acceptance implementation phải chứng minh |

### H. Soft dependencies

- Activity Logs đã complete: module phải reuse server-only writer, registry và redaction; cần bổ sung canonical role/permission events khi implement producer, không insert trực tiếp.
- Dashboard/global search có thể consume role projections sau; không block module.

### I. Next KEEP / REFACTOR / REPLACE / REMOVE

- KEEP: `/cms/permissions`, lazy boundary, explicit projections, transaction, normalized code uniqueness và protected-role disable guard.
- REFACTOR: capability naming `roles|permissions` so với server action đang chỉ check `roles`; Audit Writer integration; responsive/accessibility của table/modal.
- REPLACE: module-only matrix nếu nó tự gán một action cho mọi task thay vì phản ánh grant thật.
- REMOVE: disconnected governance tabs/components, fabricated owner/reviewer/version/risk, local effective-access simulator, runtime permission fixtures và client-generated actor/ID/timestamp. Không xóa legacy DB rows.

### J. Implementation order bên trong module

1. Chốt shared role/task/action types, explicit projections, mapper, validation và server authorization.
2. Hoàn thiện role CRUD/PATCH và task-action grants; bootstrap catalogue/grants idempotent nếu cần.
3. Tích hợp Audit Writer trong transaction boundary phù hợp.
4. Nối role list/search/filter/editor/matrix hiện tại bằng dữ liệu thật; loại runtime mock và component governance ngoài scope.
5. Regression responsive 360/390/768/1024/1280/1440; test auth/RLS/mass-assignment/audit/fresh reset.

### K. Acceptance checklist

- [ ] Đủ list/search/filter/create/edit/task-action matrix và mọi loading/empty/error/permission state, không fixture runtime.
- [ ] Form chỉ ghi field sở hữu; protected/system/audit fields không nhận tùy ý từ client.
- [ ] Mọi read/action authorize server-side; RLS/grants hỗ trợ least privilege.
- [ ] Role grants được seed/config thật và enforcement được chứng minh toàn flow chọn mẫu.
- [ ] Mutation role/permission/assignment dùng Audit Writer + typed registry, actor từ server, event được đọc lại ở Activity Logs.
- [ ] Không chạm `LEGACY_UNUSED`/`UNKNOWN`; không `select *`.
- [ ] Responsive/keyboard/touch pass và không làm hỏng desktop reference.
- [ ] Migrations/bootstrap/fresh reset tái lập được không cần Dashboard thủ công.

### Q. VI/EN

Không cần bảng content VI/EN cho module hiện tại. `role.code`, module/action/task key, status, scope, FK và permission source là CANONICAL_SYSTEM_DATA, không dịch/duplicate. Role name/description là dữ liệu tổ chức nội bộ dùng chung locale trừ khi nghiệp vụ tương lai yêu cầu bản dịch độc lập. Label/menu/button/help/error là UI_TRANSLATION và phải đi qua i18n VI/EN hiện có. Không tạo role hoặc permission row riêng theo locale.

**Kết luận audit:** scope đơn giản đã đủ dependency để bắt đầu implementation. Core identity, permission catalogue, RLS read boundary và shared Audit infrastructure đã có. Không tạo version/scope, SoD hoặc access-review persistence và không giữ mock UI của các capability ngoài scope.

### 10.1. Implementation status — 2026-09-03

- Đã nối role list, search/filter, pagination và task/action editor với PostgreSQL projections thật.
- Đã nối danh sách nhân sự được gán, gán và thu hồi assignment với `cic_user_roles`; mutation authorize và ghi Audit atomic.
- Mutation chỉ ghi `name`, `description`, `status` và exact `permission_task_id + action`; không còn nhân action cho mọi task cùng module.
- Create/update/status kiểm tra `roles|permissions` server-side, bảo vệ system role và ghi Audit event atomic bằng shared writer/registry.
- Đã loại năm component governance ngoài scope khỏi module runtime; không tạo schema version/SoD/review.
- Build, full typecheck, scoped ESLint và Audit foundation verification pass. Authenticated CMS create/update roundtrip còn pending vì `CMS_BOOTSTRAP_ADMIN_PASSWORD` local không khớp Supabase Auth; chưa nâng module lên `[x]`.
- Tạm loại `menu/menus` khỏi permission editor. Live catalogue Menu chỉ có `groups/items`, `_task='1'` và action legacy `add/save/remove/apply/published/unpublished`; khi Menu hoàn thành cần chuẩn hóa thành `view/create/edit/delete/publish/configure` theo từng resource rồi mới reconnect.
- Chưa bật xóa role dù bảng `cic_trash_items` đã tồn tại: Trash CMS hiện vẫn dùng mock/local-state và chưa có restore/purge mutation thật. Xóa chỉ được reconnect sau khi Trash dependency đóng để bảo đảm khôi phục được.

## 11. Audit module Người dùng — 2026-09-03

### A. Scope Người dùng

Module chỉ quản lý tài khoản có quyền truy cập CMS: danh sách, tìm kiếm/lọc/phân trang, tạo/sửa hồ sơ đăng nhập, trạng thái vòng đời, gán vai trò và phạm vi, xem quyền hiệu lực, gửi reset mật khẩu và xem lịch sử trạng thái/bảo mật. Phân biệt rõ với `cic_members` (khách/thành viên Website) và `cic_business` (người phụ trách kinh doanh). Không có Website public surface và không có CMS preview, SEO, nội dung draft/publish, gallery hay related content.

### B. UI Reference Map

| Surface/section | Dữ liệu và visual hierarchy | Interaction/state | Responsive reference |
|---|---|---|---|
| Route/shell `/cms/users` | CMS shell; Shield/User icon; heading “Người dùng CMS”, badge số tài khoản, mô tả và CTA “Thêm người dùng” | menu active, permission-gated CTA, loading/no-access/error phải có | KEEP shell; ADAPT header stack trên mobile |
| Summary cards | tổng, active, suspended, deactivated, pending invite, online; số lớn dưới label uppercase; màu slate/green/amber/blue/teal | read-only, derive từ dataset đã authorize | KEEP hierarchy; ADAPT 2/3/6 cột |
| Filter toolbar | search Username/họ tên/email/SĐT; status, role, branch; refresh; result count; bulk status khi có selection | reset page khi filter; empty/no-result; selected state | ADAPT stack/grid; controls full-width khi hẹp |
| User table | checkbox; username/email; avatar tròn; họ tên/phone; role badge; scope chips; status; online; last visit/count; action icons | row hover, select/all, edit, security log, reset password, lock/activate; pagination | FIX overflow: horizontal scroll + sticky identity/action; không ép 10 cột vào mobile |
| Create/edit modal: profile | login identity, password/confirm or change-password toggle; first/last name, phone, address, summary, avatar URL/upload concept, lifecycle radio + reason | required/duplicate/format/password errors; create/edit/save/cancel; selected/disabled | ADAPT 1→2 columns, `dvh` bounded modal and wrapping footer |
| Modal: role/scope | role cards (name/description/permission count), agency checkboxes | one selected primary role in current reference; multi-agency selection | ADAPT cards 1/2/3 columns; whole card keyboard-operable |
| Modal: effective access | selected role/scope summary and read-only module/action badges | recalculates from selected role; no direct user-permission edit | KEEP concept; REPLACE suffix guessing with canonical role grants |
| Modal/security drawer | 2FA state, last password change, visit count, status history and security events | edit-only tab; drawer opened from table; empty states | DO_NOT_COPY fake 2FA/security/online data; FIX focus trap, Escape, scroll lock and long log wrapping |
| Feedback/states | status confirm dialog, toast, loading/mutating, empty list/log and permission-denied surface | reason required for standalone status change; actions disabled while saving | KEEP concise feedback; respect reduced motion |

Không có detail route riêng. Ảnh chỉ là avatar vuông được crop tròn (`object-cover`); không có video/gallery/aspect-sensitive media. Reference desktop được đối chiếu từ React route và ảnh `docs/assets/cms-guide/cms-guide-21-nguoi-dung.png`; responsive legacy chỉ là ý đồ, không phải acceptance tuyệt đối.

### C. CMS capability/form/list map

- List columns/sort: projection nêu trên; mặc định theo `ordering`, rồi `id`. Search/filter/pagination và bulk status có trong reference.
- Create: username, email, password + confirm, first/last name, phone, address, summary, avatar, account status, one primary role và agency scopes. Email/username unique phải kiểm tra server/DB, không chỉ trên client.
- Edit: cùng hồ sơ; password chỉ gửi khi bật đổi mật khẩu; status change cần reason; system/security/audit fields read-only.
- Special actions: gửi reset password; activate/suspend/deactivate; xem security/status history. `pending_invite` có trong list contract nhưng create flow hiện chưa có invite workflow thật.
- Permission: `users.view/create/edit`; nếu duyệt delete về sau phải có `users.delete` và Trash lifecycle thật. Server action/API luôn authorize, không chỉ ẩn nút.
- Không có bằng chứng nghiệp vụ cho delete/trash/restore hiện tại, media library picker, SEO, preview, publish workflow hoặc user-level direct permission editor; không tự thêm.

### D. DB tables + relation map

- Identity/profile: Supabase `auth.users` ↔ `public.cic_users` qua normalized email trong auth guard hiện tại; chưa có immutable auth UUID FK/unique bridge được chứng minh.
- Role: `cic_users ← cic_user_roles → cic_roles → cic_role_permissions → cic_permission_tasks`.
- Lifecycle: `cic_user_status_history.user_id → cic_users.id`; `changed_by → cic_users.id`.
- Security: `cic_security_events.user_id → cic_users.id`; chỉ có giá trị khi auth/security producer ghi thật.
- Legacy compatibility: `cic_users_permission`, `_fun`, `_field` giữ nguyên read-only/out of authority; `agencies`, `products_categories`, `news_categories` vẫn là CSV trên `cic_users`.
- Related lookups: `cic_branches`, `cic_products_categories`, `cic_news_categories`. Không coi các CSV này là FK thật.
- Dữ liệu live gần nhất đã ghi nhận trong cùng environment ngày 2026-09-03: 1 role, 1 active role assignment, 76 permission tasks, 0 role grant; vì vậy UI role/access không được dùng fixture 5 role làm runtime authority.

### E. Field Usage Map

| Table/field | Classification | Quy tắc projection/write |
|---|---|---|
| `cic_users.id` | SYSTEM_MANAGED, RELATION | list/detail identity; không nhận từ form |
| `username`, `email`, `fname`, `lname`, `phone`, `address`, `summary`, `image` | CMS_EDITABLE | PATCH exact owned fields; email đồng bộ Auth |
| `full_name` | SYSTEM_MANAGED, CMS_OPERATIONAL | server derive từ họ/tên; list/search |
| `account_status` | CMS_EDITABLE, CMS_OPERATIONAL | enum 4 trạng thái; transition ghi history/audit |
| `published` | LEGACY_UNUSED cho UI, SYSTEM_MANAGED compatibility | server mirror từ status; không form input |
| `password` | LEGACY_UNUSED/credential | không select/response/mutation; Supabase Auth là authority |
| `ordering` | CMS_EDITABLE chỉ nếu reference giữ sắp xếp; CMS_OPERATIONAL | không tự reset khi payload thiếu |
| `agencies` | CMS_EDITABLE legacy scope, RELATION-like CSV | validate ID lookup; PATCH khi form sở hữu |
| `products_categories`, `news_categories` | CMS_EDITABLE chỉ khi scope UI được duyệt; hiện Next form không hiển thị | không gửi mảng rỗng để ghi đè; giữ nguyên khi thiếu |
| `country` | UNKNOWN trong requirement hiện tại | không tự default/overwrite nếu form không quản lý |
| `two_factor_enabled` | SYSTEM_MANAGED bởi auth/2FA workflow | không cho toggle giả chỉ sửa boolean |
| `password_changed_at`, `failed_login_attempts` | SYSTEM_MANAGED, AUDIT/security | read-only; cập nhật từ auth workflow thật |
| `status_online`, `last_visit_time`, `nums_visit` | SYSTEM_MANAGED, CMS_OPERATIONAL | read-only; session/login producer quản lý |
| `created_time`, `updated_time` | AUDIT, SYSTEM_MANAGED | server/trigger quản lý |
| status history fields | AUDIT; `user_id/changed_by` RELATION | actor từ server context; append, không client ID/time |
| security-event fields | AUDIT/security; `user_id` RELATION | server producer; redact token/secret/credential |
| user-role fields | RELATION; assignment status CMS_OPERATIONAL; actor/time AUDIT | role assignment transaction; không client actor/time |
| `cic_users_permission*` | LEGACY_UNUSED | không UI/select contract/write/cleanup |

Projection chuẩn: không có public list/detail. CMS list chỉ lấy identity, avatar/contact summary, status, role/scope projection và visit summary; CMS form/detail lấy editable fields + read-only metadata/history cần tab đang mở; relation lookup chỉ lấy `id/name/code/status`; security events nên tải theo user khi mở drawer/tab, không tải toàn bảng cho mọi user. Tuyệt đối không `select *`.

### F. Website ↔ CMS shared-domain/data flow

Không có Website consumer của hồ sơ admin. Shared contract chỉ nên gồm user ID/profile tối thiểu dùng làm actor/assignee/author, canonical account status, role assignment/effective permission resolver, validation và explicit mapper. Không share UI CMS với Website.

Flow mục tiêu: CMS form → Zod/server validation → `users.*` authorization → phối hợp Supabase Auth + DB có compensation/idempotency rõ → PATCH owned profile/status/assignment → shared Audit Writer trong transaction DB phù hợp → revalidate CMS. Website nội dung không đổi; các module nội bộ nhận actor/assignee mới qua cùng `cic_users` projection.

### G. Hard dependencies

| Dependency | Use case/chiều | Hiện trạng | Block audit/implementation? |
|---|---|---|---|
| Supabase Auth + identity bridge | login/create/update/reset/status; Users ↔ Auth | Có, nhưng bridge bằng email và cross-system consistency còn yếu | Không block bắt đầu; phải harden trước acceptance |
| Roles & Permissions + server guard | assign role và enforce `users.*`; Users → RBAC | Core live; role grants rollout chưa đầy đủ | Không block superadmin implementation; block non-admin acceptance nếu chưa seed grant |
| PostgreSQL schema/migrations | profile/status/history/relations | Bảng/field đã có trong versioned schema; cần verify grants/RLS cho exact flow | Không |
| Activity Logs | user mutation producer | `[x]`, writer/registry/redaction có sẵn | Không; bắt buộc reuse |

### H. Soft/integration dependencies

- Email delivery/template cho invitation/reset-password UX và delivery observability; Supabase reset hiện có nhưng template/delivery end-to-end chưa chứng minh.
- Security event producer, lockout và 2FA provider; không block profile/role/status core, nhưng block tuyên bố tab Security hoàn chỉnh.
- Trash chỉ cần nếu product owner duyệt delete user. Hiện requirement ưu tiên deactivate; không tạo delete giả.
- Global Search/Dashboard và các assignee/author selectors có thể consume user projection sau; không block core.

### I. Next KEEP / REFACTOR / REPLACE / REMOVE

- KEEP: server-only query/repository split; explicit Supabase projections; parallel independent reads; server `requirePermission`; transaction cho DB profile/role/status; visual list/modal/status/history structure.
- REFACTOR: tách CMS row/form/security projections; server pagination/filter thay vì tải toàn bộ rồi lọc; actor label join; load history/security theo user; PATCH semantics để không ghi đè country/category scopes; role assignment contract; error/result mapping và accessible modal/drawer behavior.
- REPLACE: email-only Auth bridge bằng stable identity mapping đã duyệt; DB-first update rồi Auth update bằng workflow có compensation/idempotency; client-generated status history/ID/actor/time; effective access suy bằng suffix `_list/_add/_edit/_del` bằng canonical grants/action registry.
- REMOVE khỏi runtime: `cic_users/mockData.ts` qua `demoGovernanceDataSource` khi module live; fake role/agency/security/status fixtures; 2FA toggle nếu chưa có provider; direct legacy user permission editing. Không xóa dữ liệu/bảng legacy.

### J. Implementation order bên trong module

1. Chốt identity bridge, canonical statuses, field ownership/projections và server result contract.
2. Hoàn thiện server list/detail/relation queries có permission, pagination/filter và lazy history/security load.
3. Hoàn thiện create/update/reset/status/role-scope workflow với Auth↔DB compensation, PATCH semantics và invariant chống tự khóa admin cuối cùng.
4. Tích hợp Audit Writer/typed registry cho create/update/status/role/reset; redact email/phone/address theo sensitive policy và không log password/token.
5. Nối UI reference bằng dữ liệu thật; bỏ runtime mock và disable capability 2FA/security chưa có producer.
6. Test authorized/unauthorized, duplicate/concurrency, Auth failure compensation, audit, RLS/grants và responsive 360/390/768/1024/1280/1440.

### K. Acceptance checklist

- [x] List/search/filter/sort/pagination/stats dùng DB thật, projection tối thiểu và đủ loading/empty/error/no-access.
- [x] Create/edit/reset/status/role-scope authorize server-side; không mass assignment hoặc tin actor/time/permission từ client.
- [ ] Auth và `cic_users` không để tài khoản mồ côi/split-brain khi một phía lỗi; email/username unique/concurrency được xử lý.
- [x] Password/token/OTP/2FA secret không lưu trong profile/audit/response; `cic_users.password` không được đọc hoặc ghi bởi module mới.
- [x] Status transition có reason, history append và ngăn vô hiệu hóa quản trị viên hợp lệ cuối cùng.
- [x] Effective access đến từ role grants thật; không suffix guessing/fixture/direct permission legacy.
- [x] User mutations ghi shared Audit Writer với actor server và đọc lại được ở Nhật ký hoạt động.
- [ ] 2FA, online, failed login và security log chỉ được công nhận là live capability khi Auth/session producer/provider thật hoàn thành; hiện `status_online` là projection legacy read-only và 2FA ghi rõ “Chưa tích hợp”.
- [x] Không ghi đè `LEGACY_UNUSED/UNKNOWN`; category/country không bị set rỗng/default khi form không sở hữu.
- [ ] RLS/grants, fresh reset, bootstrap admin, build/typecheck/lint/tests và responsive/reference regression pass.

### Q. VI/EN

Không cần content translation VI/EN cho tài khoản quản trị. Username, email, account status, role/permission keys, IDs và security event types là CANONICAL_SYSTEM_DATA, không duplicate theo locale. Họ tên, điện thoại, địa chỉ và ghi chú là dữ liệu hồ sơ của một người, không tạo bản VI/EN độc lập. Chỉ label/menu/button/help/validation/error/status label thuộc UI_TRANSLATION và phải dùng i18n VI/EN hiện có; không tạo `cic_users_vi/en` hay user row theo locale.

**Kết luận audit:** dependency cứng đã tồn tại đủ để bắt đầu. Các thiếu sót nêu trên là công việc nằm trong chính module Người dùng hoặc integration mềm, không cần fake dependency và không yêu cầu redesign UI.

READY_TO_IMPLEMENT
