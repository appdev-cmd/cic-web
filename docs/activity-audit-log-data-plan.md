# Đề xuất dữ liệu — Nhật ký hoạt động

> Trạng thái: Thiết kế để review, chưa phải migration hoặc SQL triển khai  
> Phạm vi: Module **Nhật ký hoạt động** của CMS mới  
> Nguồn đối chiếu: code CMS mới, `httpdocs/cms/modules/users` và schema PostgreSQL trong `db_migrate`

## 1. Quyết định chốt

Giữ nguyên định hướng và trải nghiệm của module **Nhật ký hoạt động** trên CMS mới:

- Theo dõi ai thực hiện hành động nào.
- Xác định đối tượng và module bị tác động.
- Hiển thị kết quả thành công, thất bại hoặc bị từ chối.
- Lọc theo thời gian, người dùng, module, mức độ và kết quả.
- Xem chi tiết sự kiện và dữ liệu thay đổi trước/sau.
- Theo dõi hành động nhạy cảm.
- Xuất báo cáo theo bộ lọc.
- Dùng cùng nguồn dữ liệu để hiển thị nhật ký trong từng module và trong hồ sơ người dùng.

Đây là chức năng mới. CMS cũ không có bảng audit tương đương, vì vậy cần tạo bảng mới thay vì sửa hoặc tái sử dụng sai bảng legacy.

## 2. Không sử dụng `cic_history` làm audit log

`fs_history` của CMS cũ, hiện được migrate thành `cic_history`, có các trường liên quan đến lịch sử giao dịch:

- `username`
- `money`
- `type`
- `description`
- `created_time`
- `service_name`
- `service_id`

Bảng này từng phục vụ lịch sử nạp tiền, tiêu tiền hoặc dịch vụ. Nó không lưu đủ actor, action, target, IP, kết quả và dữ liệu trước/sau của thao tác quản trị.

Quyết định:

- Giữ nguyên `cic_history` cho dữ liệu legacy.
- Không đổi tên `cic_history` thành audit log.
- Không chuyển bản ghi `cic_history` thành sự kiện audit.
- Không tạo lịch sử giả từ `updated_time`, `last_visit_time` hoặc `nums_visit`.
- Nhật ký đầy đủ chỉ bắt đầu từ thời điểm backend audit mới được kích hoạt.

## 3. Mô hình dữ liệu đề xuất

Đây là mô hình logic, chưa phải câu lệnh SQL.

### 3.1. `cic_audit_events`

Bảng trung tâm, mỗi dòng là một sự kiện bất biến sau khi được ghi nhận.

| Trường | Kiểu logic | Mục đích |
|---|---|---|
| `id` | UUID | ID sự kiện; không dùng số tăng dần làm mã công khai |
| `occurred_at` | timestamptz | Thời điểm sự kiện theo giờ máy chủ |
| `actor_user_id` | FK nullable | User thực hiện; nullable cho system/service account |
| `actor_type` | enum | `user`, `system`, `service` |
| `actor_name_snapshot` | varchar | Giữ tên hiển thị kể cả khi user bị xóa |
| `actor_email_snapshot` | varchar nullable | Snapshot email nếu policy cho phép |
| `actor_role_snapshot` | varchar nullable | Vai trò hiệu lực tại thời điểm thao tác |
| `ip_address` | inet nullable | IP nguồn; có thể rút gọn/ẩn theo policy |
| `user_agent` | text nullable | Thiết bị/trình duyệt nguồn |
| `action_code` | varchar | Mã ổn định như `content.publish`, `user.suspend` |
| `action_label` | varchar | Snapshot nhãn dễ đọc |
| `category` | varchar | Nhóm sự kiện phục vụ filter |
| `severity` | enum | `low`, `medium`, `high`, `critical` |
| `is_sensitive` | boolean | Đánh dấu hành động nhạy cảm |
| `target_type` | varchar nullable | Loại đối tượng: user, page, product, setting... |
| `target_id` | varchar nullable | ID đối tượng; dùng varchar để hỗ trợ UUID và legacy ID |
| `target_title_snapshot` | varchar nullable | Tên đối tượng tại thời điểm thao tác |
| `target_module` | varchar | Module sở hữu đối tượng |
| `target_url` | varchar nullable | Deep link CMS nếu đối tượng còn tồn tại |
| `site_id` | varchar nullable | Website/workspace chịu tác động |
| `locale` | varchar nullable | Locale dữ liệu nếu hành động có scope ngôn ngữ |
| `result` | enum | `success`, `failed`, `partial`, `denied` |
| `result_message` | text nullable | Thông tin kết quả đã được làm sạch |
| `session_id` | varchar nullable | Liên kết các hành động trong một phiên |
| `correlation_id` | varchar nullable | Truy vết xuyên request/job/service |
| `source_app` | varchar | Ví dụ `cms-web`, `cms-api`, `worker` |
| `environment` | enum | `production`, `staging` |
| `http_method` | varchar nullable | Phương thức HTTP nếu có |
| `endpoint` | varchar nullable | Route đã chuẩn hóa, không chứa secret/query nhạy cảm |
| `execution_time_ms` | integer nullable | Thời gian thực thi |
| `metadata` | jsonb nullable | Context bổ sung theo allowlist |
| `retention_until` | timestamptz nullable | Thời điểm hết hạn lưu theo policy |
| `legal_hold` | boolean | Không được purge khi đang giữ pháp lý |
| `created_at` | timestamptz | Thời điểm ghi vào audit store |

### 3.2. `cic_audit_event_changes`

Lưu dữ liệu thay đổi trước/sau theo từng field để drawer chi tiết có thể hiển thị diff.

| Trường | Mục đích |
|---|---|
| `id` | ID bản ghi thay đổi |
| `event_id` | FK tới `cic_audit_events` |
| `field_name` | Tên field chuẩn hóa |
| `old_value` | Giá trị trước, dạng JSONB |
| `new_value` | Giá trị sau, dạng JSONB |
| `is_redacted` | Giá trị đã được che |
| `redaction_reason` | Lý do che dữ liệu |
| `display_order` | Thứ tự hiển thị trong drawer |

Không tạo change row nếu giá trị không thay đổi.

### 3.3. `cic_audit_export_jobs`

Hỗ trợ chức năng tạo và tải báo cáo nhật ký.

| Trường | Mục đích |
|---|---|
| `id` | ID job |
| `requested_at` | Thời điểm yêu cầu |
| `requested_by` | FK người yêu cầu |
| `date_from`, `date_to` | Khoảng thời gian xuất |
| `filter_payload` | Snapshot bộ lọc đã áp dụng |
| `scope_summary` | Mô tả phạm vi dễ đọc |
| `status` | `queued`, `processing`, `completed`, `failed`, `expired` |
| `total_records` | Tổng bản ghi trong file |
| `storage_key` | Khóa file trong storage, không phải URL công khai cố định |
| `file_size_bytes` | Dung lượng file |
| `expires_at` | Hạn tải file |
| `error_code`, `error_message` | Lỗi đã làm sạch nếu job thất bại |
| `completed_at` | Thời điểm hoàn thành |

Job phải được xử lý bất đồng bộ khi dữ liệu lớn. Không đánh dấu `completed` ngay khi người dùng bấm tạo báo cáo.

## 4. Danh mục sự kiện

`action_code` phải ổn định, không lấy trực tiếp từ câu tiếng Việt hiển thị.

### 4.1. Tài khoản và bảo mật

- `auth.login.success`
- `auth.login.failed`
- `auth.logout`
- `auth.password.changed`
- `auth.password.reset_requested`
- `auth.two_factor.enabled`
- `auth.two_factor.disabled`
- `user.created`
- `user.updated`
- `user.suspended`
- `user.activated`
- `user.deactivated`

### 4.2. Vai trò và quyền

- `role.created`
- `role.updated`
- `role.activated`
- `role.archived`
- `role.assigned`
- `role.revoked`
- `permission.direct_override_updated`
- `permission.access_denied`

### 4.3. Nội dung

Các module dùng cùng quy tắc:

- `{module}.created`
- `{module}.draft_saved`
- `{module}.published`
- `{module}.unpublished`
- `{module}.deleted`
- `{module}.restored`

Ví dụ: `news.published`, `page.draft_saved`, `product.deleted`.

Không có event `approved` hoặc `reviewed` cho các module chỉ còn Lưu nháp/Xuất bản.

### 4.4. Cấu hình và dữ liệu nhạy cảm

- `settings.updated`
- `settings.published`
- `secret.rotated`
- `pii.accessed`
- `data.export_requested`
- `data.export_completed`
- `data.export_downloaded`
- `trash.permanent_delete`

## 5. Category dùng trên giao diện

Nên dùng các category dễ hiểu và bám dữ liệu thật:

- `all`
- `authentication`
- `users_permissions`
- `content_publish`
- `configuration`
- `data_export`
- `sensitive`

`Export Jobs` không phải category riêng của event. Drawer Export Jobs đọc từ `cic_audit_export_jobs`; các hành động yêu cầu/hoàn thành/tải file vẫn xuất hiện trong audit dưới category `data_export`.

## 6. Dữ liệu tuyệt đối không được ghi

Audit store không được lưu, kể cả trong `metadata`, diff hoặc message:

- Mật khẩu hoặc password hash.
- Access token, refresh token, API key.
- Cookie, session secret hoặc toàn bộ Authorization header.
- OTP và recovery code.
- Secret 2FA.
- SMTP password, webhook secret hoặc private key.
- Nội dung file nhạy cảm.
- Request/response body nguyên bản nếu chưa qua allowlist và redaction.

Chỉ lưu request header theo allowlist nếu thực sự cần. Mặc định không lưu `requestHeaders` như type frontend mock hiện tại.

## 7. Quy tắc ghi log

### 7.1. Backend là nguồn ghi duy nhất

Frontend không tự tạo audit event được tin cậy. Backend ghi log sau khi xác định:

- User đã xác thực.
- Quyền đã được kiểm tra.
- Transaction thành công hoặc thất bại.
- Target ID và trạng thái cuối cùng đã rõ.

### 7.2. Thời điểm ghi

- Ghi `success` sau khi transaction nghiệp vụ commit.
- Ghi `failed` nếu action bắt đầu nhưng xử lý thất bại.
- Ghi `denied` khi có yêu cầu hợp lệ nhưng bị từ chối quyền.
- Không ghi mỗi lần render trang hoặc gọi GET thông thường, trừ truy cập PII/secret hoặc policy yêu cầu.

### 7.3. Không sửa/xóa thông thường

API nghiệp vụ không cung cấp UPDATE/DELETE cho audit event.

- Correction được ghi thành event mới.
- Purge chỉ do retention job có quyền hệ thống thực hiện.
- Bản ghi `legal_hold = true` không được purge.

## 8. API contract dự kiến

### 8.1. Danh sách

`GET /api/cms/audit-events`

Query hỗ trợ:

- `search`
- `dateFrom`, `dateTo`
- `actorUserId`
- `category`
- `module`
- `severity`
- `result`
- `siteId`, `locale`
- `page`, `pageSize`
- `sort=occurredAt:desc`

Public website không có quyền gọi API này.

### 8.2. Chi tiết

`GET /api/cms/audit-events/{id}`

Response gồm event, changes đã redaction và các event liên quan theo `correlationId` nếu người dùng có quyền xem.

### 8.3. Nhật ký theo đối tượng

`GET /api/cms/audit-events?targetType=product&targetId=123`

Các drawer nhật ký trong Sản phẩm, Tin tức, Dịch vụ, Menu và Trang nội dung dùng contract này; không duy trì mock log riêng trong từng module.

### 8.4. Nhật ký người dùng

`GET /api/cms/audit-events?actorUserId=123`

Nhật ký bảo mật trong hồ sơ Người dùng có thể thêm `category=authentication` hoặc target user tương ứng.

### 8.5. Export

- `POST /api/cms/audit-export-jobs`
- `GET /api/cms/audit-export-jobs`
- `GET /api/cms/audit-export-jobs/{id}`
- `POST /api/cms/audit-export-jobs/{id}/download-token`

Download token có thời hạn ngắn; không trả storage URL cố định.

## 9. Permission

Tối thiểu cần các quyền:

- `audit.view`
- `audit.view_sensitive`
- `audit.export`
- `audit.manage_retention`
- `audit.manage_legal_hold`

Người có `audit.view` không mặc nhiên thấy PII, IP đầy đủ hoặc diff nhạy cảm.

Mọi lần xem sự kiện nhạy cảm và tải export phải tự tạo audit event mới.

## 10. Index và hiệu năng

Index cần dự kiến cho:

- `occurred_at DESC`
- `actor_user_id, occurred_at DESC`
- `target_type, target_id, occurred_at DESC`
- `target_module, occurred_at DESC`
- `category, occurred_at DESC`
- `result, occurred_at DESC`
- `severity, occurred_at DESC`
- `correlation_id`

Danh sách luôn phân trang phía server. Không tải toàn bộ audit event rồi lọc ở frontend.

Với dữ liệu lớn, cân nhắc partition theo tháng dựa trên `occurred_at`; chưa cần áp dụng ngay nếu lưu lượng chưa đủ lớn.

## 11. Retention và quyền riêng tư

Retention phải được chốt với Security/Legal trước production. Đề xuất baseline để review:

- Audit quản trị thông thường: 12 tháng.
- Thao tác quyền, user, secret và permanent delete: 24 tháng.
- Export file: tự xóa sau 7 ngày; audit metadata của việc export vẫn giữ theo retention.
- Failed login chi tiết: thời hạn ngắn hơn nếu policy privacy yêu cầu.

IP, email snapshot và user agent là dữ liệu có thể định danh, cần giới hạn quyền xem và masking phù hợp.

Không ghi tuyên bố “tuân thủ ISO 27001” trên UI chỉ dựa vào việc có audit table. Chỉ hiển thị khi hệ thống và quy trình đã được đánh giá chính thức.

## 12. Rollout

1. Tạo bảng và writer service.
2. Ghi thử ở staging cho login, user, permission, publish và configuration.
3. Kiểm tra redaction bằng test tự động.
4. Bật dual observation: nghiệp vụ chạy bình thường, audit lỗi không làm mất transaction chính nhưng phải có cảnh báo vận hành.
5. Nối module Nhật ký hoạt động với API thật.
6. Thay các drawer log mock của từng module bằng query theo target.
7. Bật export bất đồng bộ.
8. Chốt retention/legal hold trước production.
9. Hiển thị mốc: “Nhật ký đầy đủ được ghi nhận từ {goLiveAt}”.

Không backfill sự kiện giả trước thời điểm go-live.

## 13. Kiểm tra bắt buộc

- Sự kiện success chỉ xuất hiện sau khi nghiệp vụ commit.
- Sự kiện denied không làm lộ target hoặc lý do nội bộ quá mức cần thiết.
- Password, token, cookie, OTP và secret không xuất hiện trong bất kỳ cột nào.
- Actor/target snapshot vẫn đọc được sau khi bản ghi nguồn bị xóa.
- Filter thời gian thực sự áp dụng `dateFrom/dateTo` ở backend.
- `failed`, `partial` và `denied` được lọc độc lập.
- Người không có `audit.view_sensitive` chỉ nhận dữ liệu redacted.
- Export tôn trọng đúng filter và scope quyền của người yêu cầu.
- File export hết hạn và không dùng public URL cố định.
- Audit event không thể sửa/xóa qua API thông thường.
- Drawer nhật ký trong các module trả cùng dữ liệu với trang Nhật ký hoạt động.

## 14. Trường cần bỏ sau này

Không có trường legacy nào cần bỏ vì toàn bộ audit schema là mới.

`cic_history` vẫn được giữ nguyên như dữ liệu giao dịch legacy và không nằm trong phạm vi cleanup của module Nhật ký hoạt động.

Sau khi nối backend thật, chỉ cần xóa **mock data và logic giả lập frontend**, không xóa cột database:

- Mock `AuditEvent`.
- Mock export jobs.
- Mock saved views nếu đã dùng user preference thật.
- Các activity log mock riêng trong từng module.

Không tạo cột tạm chỉ để khớp mock frontend; mọi trường mới phải có nguồn ghi backend và mục đích audit rõ ràng.

## 15. Điểm cần xác nhận trước khi viết migration

1. Retention chính thức cho từng category.
2. Có lưu IP đầy đủ hay masked.
3. Các vai trò nào được xem event nhạy cảm và export.
4. Danh mục action code chính thức của từng module.
5. Audit writer dùng cùng database hay storage/queue riêng.
6. Chính sách khi audit writer tạm lỗi: retry/outbox và cảnh báo vận hành.
7. Có yêu cầu legal hold thực tế hay chỉ giữ khả năng mở rộng.

Các quyết định này ảnh hưởng backend và vận hành, nhưng không yêu cầu thay đổi bố cục chính của giao diện CMS mới.

---

## 16. Audit module từ bốn nguồn — 2026-09-03

### A. Scope Nhật ký hoạt động

Phạm vi gồm route `/cms/activity-logs`, list/filter/pagination, event detail, export jobs, dashboard timeline, global-search command, user/security/config/PII views và drawer theo entity. Website public không có surface hoặc quyền đọc audit. Thùng rác là module khác; nó chỉ là producer/consumer integration của audit writer.

### B. UI Reference Map

| Surface/reference | Dữ liệu và hierarchy | Visual/interaction/state | Responsive classification |
|---|---|---|---|
| `CmsDashboard` → `ActivityLogsManager` | Page header: Shield, “Nhật ký hoạt động”, mô tả, badge tổng bản ghi; dưới là Audit tab và hai drawer | `space-y-5`, fade 200ms, palette orange/slate, dark mode; không image/video/gallery/CTA | **KEEP** cấu trúc; header/meta phải wrap ở màn hẹp |
| `AuditTab` toolbar | Shield tím + heading/mô tả; Download + “Tạo Báo cáo Export” | Card bo `2xl`, padding 4/5, column→row ở `md` | **ADAPT** nút full-width/touch ≥44px trên mobile |
| Search/filter/category | Search actor/event ID/target/action; time today/7/30/all; severity; result; tabs all/sensitive/permissions-users/config-publish/export | Grid 1→12 cột; Search/Calendar/Lock icons; focus border cam; active tab | **FIX** date state không lọc; “Denied / Failed” chỉ match denied; filter đổi không reset page; tab dài có thể overflow |
| Main table | Time; Actor + IP/role; Action + code/sensitive Lock; Target + module; Scope; Result; Eye detail | Hover row, monospace metadata, result badges, empty row, shared pagination/page-size | **ADAPT** horizontal-scroll table không đủ làm mobile acceptance; **FIX** failed/partial presentation và filtering |
| `EventDetailDrawer` | Header ID/copy/action/severity; immutable notice; tabs Summary, Before/After, Technical; actor, result, target/scope, diff/redaction, session/correlation/HTTP; close footer | Right drawer `max-w-2xl`, full height, backdrop/blur, slide 300ms; copy feedback; empty diff | **FIX** dialog semantics, labels, focus trap/restore, Escape, scroll lock, tabs ARIA; **ADAPT** long tabs/key-value rows. **DO_NOT_COPY** ISO 27001 claim without formal evidence |
| `ExportJobsDrawer` | Range 7/30 days; create request; job history with requester/scope/filter/status/count/size/expiry/download | Right drawer `max-w-xl`; fake 1.2s processing spinner; completed download; close | **REPLACE behavior** with async job; **FIX** keyboard/dialog semantics; **ADAPT** mobile actions/touch targets |
| Dashboard timeline | 10 recent events; actor/avatar, action, target, time; “Xem chi tiết log” | Vertical timeline, hover background/dot scale, click opens `CmsRightDrawer` | **KEEP** compact view; add real empty/loading/error later; same audit source required |
| Global search command | “Đi tới → Nhật ký hoạt động & Lịch sử thao tác”, navigation keywords | Command-only result to `/cms/activity-logs` | **KEEP**; never index sensitive event content without permission |
| Entity drawers | Product “Nhật ký Hoạt động & Phiên bản”; News/Services/Events timelines; planned Menu/Pages target logs | Module-owned compact presentation filtered by entity | **KEEP UI**, **REPLACE data** mocks/fallbacks by shared target query; do not share main-table UI |
| User/security surfaces | User audit drawer + Security tab: visits/2FA/password metadata, status history, login/action log, IP/UA, empty states | Right drawer/cards/timeline | **KEEP UI**, query by actor/target/category; sensitive permission required |
| Configuration/PII | Config audit table; secret rotation entries; contact PII access modal | Scope/action/IP table and security messaging | **REFACTOR data** to common writer/query/redaction; unverified compliance copy is **DO_NOT_COPY** |

Reference has no create/edit/preview page, hero, gallery, media selector, SEO form, relation selector, bulk edit, draft/publish or per-event trash/restore. Loading/error states are missing; empty states exist. These absences must not be filled by invented CRUD.

### C. CMS capability/form/list map

- List columns: Time, Actor, Action, Target, Scope, Result, Detail. Default sort is newest first; pagination must be server-side.
- Search/filter requirement from CMS docs: user, date/time, function/module and result; design/docs additionally support event ID/target/action, category, severity, workspace/site and locale.
- No CMS editable fields and no create/edit form. Events are read-only and immutable through normal APIs.
- Detail: summary, actor, result/severity, target/scope, redacted before/after and technical correlation.
- No bulk update/delete. Special actions are copy event ID, open target where allowed, create/list/download export job.
- Export is asynchronous. User cannot fabricate `completed` state or receive a permanent public storage URL.
- Permissions: `audit.view`, `audit.view_sensitive`, `audit.export`; future `audit.manage_retention` and `audit.manage_legal_hold`. UI hiding is not enforcement.

### D. DB tables + relation map

| Source | Authority finding | Relation/status |
|---|---|---|
| `cic_activity_logs` | **Tồn tại live**, 28 columns đúng contract, 0 rows tại 2026-09-03 | UUID PK; nullable `actor_id → cic_users(id) ON DELETE SET NULL`; target là controlled polymorphic identity |
| `cic_audit_export_jobs` | **Tồn tại live**, 12 columns, 0 rows tại 2026-09-03 | UUID PK; nullable `requested_by → cic_users(id) ON DELETE SET NULL`; worker/storage lifecycle chưa được chứng minh |
| `cic_users` | Actor identity source | join current actor profile, with `actor_label` snapshot/fallback |
| `cic_history` | Existing legacy table but wrong domain | money/service history; never use or backfill as CMS audit |
| Domain entities | No universal FK | resolve `entity_type/entity_id/module` through approved registry; preserve `entity_title` snapshot |

Live catalog audit ngày 2026-09-03 xác nhận cả hai bảng đã được apply. `cic_activity_logs` có CHECK cho `severity`, `result`, `execution_time_ms`; hai bảng có PK/FK/NOT NULL cơ bản. Tuy nhiên live chỉ có PK và index đơn `actor_id`, `entity_id`, `requested_by`; thiếu time/composite/filter indexes trong schema docs. Cả hai bảng chưa bật/force RLS, không có policy hoặc trigger; catalog chỉ thấy owner `postgres` có toàn quyền. “Append-only” hiện là application contract, chưa được DB enforcement chứng minh.

### E. Field Usage Map

There are no `CMS_EDITABLE` and no `PUBLIC_READ` fields.

| Class | `cic_activity_logs` fields |
|---|---|
| `CMS_OPERATIONAL` | `occurred_at`, `actor_id`, `actor_label`, `action_code`, `category`, `severity`, `is_sensitive`, `entity_type`, `entity_id`, `entity_title`, `module`, `workspace`, `locale`, `result`, `result_message` |
| `SYSTEM_MANAGED` | `id`, `session_id`, `correlation_id`, `source_app`, `environment`, `ip_address`, `user_agent`, `http_method`, `endpoint`, `execution_time_ms`, `before_data`, `after_data`, `redacted_fields` |
| `RELATION` | `actor_id`; `entity_type + entity_id` is polymorphic reference, not FK |
| `AUDIT` | all fields in the table; `occurred_at` is authoritative event time |
| `LEGACY_UNUSED` | all `cic_history` fields for this module: `username`, `money`, `type`, `description`, `created_time`, `service_name`, `service_id` |
| `UNKNOWN` | retention/legal-hold columns described by an older logical proposal but absent from final `POSTGRES_SCHEMA_DELTA`; do not add/default/null/delete without a later decision |

Explicit projections:

- Public list/detail: none.
- CMS list: event ID/time, actor ID/label, action/category/severity/sensitive, entity identity/title/module, workspace/locale, result/message.
- CMS detail: list fields plus session/correlation/source/environment/IP/UA/HTTP/endpoint/duration and redacted before/after.
- Dashboard: ID/time, minimal actor display/avatar projection, action label, entity display, result.
- Target/user lookup: list/detail fields constrained by target or actor/category and permission scope.
- Export jobs: ID/request time/requester/workspace/filter/status/count/file size/expiry/error/completion; `file_path` remains server-only.

### F. Website ↔ CMS shared-domain map and data flow

Website has no audit UI/query. Shared server/domain assets should be action-code registry, category/severity/result constants, redaction policy, immutable event-input schema, writer, target resolver and list/detail mapper. Website and CMS must not share presentation components merely because a governed public entity appears as an audit target.

Read: `cic_activity_logs → permission/scope-aware server query → explicit row type → mapper/redaction → list/detail/dashboard/target ViewModel → CMS UI`.

Write: `CMS/business input → validation → authentication/authorization → domain transaction (business mutation + server audit writer/redaction) → commit → cic_activity_logs → uncached/request-scoped CMS read refresh`. Producer cần audit thành công dùng chung transaction để không commit nghiệp vụ mà thiếu event. Frontend never creates a trusted event. There is no `CMS Form → audit mutation → Website read` flow because audit has no editable form and no public consumer.

### G. Hard dependencies

| Dependency | Direction/use | Exists? | Blocks implementation? |
|---|---|---|---|
| Complete audit indexes + append-only grants/RLS enforcement | Activity Logs → persistence/security/performance | tables/PK/FK/check tồn tại; indexes/security enforcement chưa đủ | **Yes** |
| Auth principal + approved `audit.*` permissions | query/detail/export → authorization and actor | auth foundation exists; live permission catalog/assignments incomplete | **Yes** |
| Redaction allowlist + append-only writer | every governed mutation → trustworthy event | not implemented | **Yes** |
| Action/entity/workspace registry | writer/query → stable code, label, route, scope | not finalized | **Yes** |
| Real producer events + audit go-live timestamp | list/detail → truthful records | absent | **Yes** |

Required modules/foundations to run first: database schema/security approval, Auth/RBAC permission contract, then shared audit writer/redaction/registry. No fake repository/event is acceptable.

### H. Soft/integration dependencies

- Dashboard, user/security, configuration/PII and entity drawers can connect after core list/detail; they must use the same source before module can reach `[x]`.
- Trash and all governed domains are producers. Individual missing producer integrations do not prevent initial core query, but keep final status at `[I]`.
- Export worker, private storage, expiring token and cleanup block export integration only, not core read-only list/detail.
- Security/Legal retention, IP masking and legal-hold decisions block production completion and management capabilities, not the initial read core.

### I. Next KEEP / REFACTOR / REPLACE / REMOVE

- **KEEP:** route resolver; CMS shell; page/header/table/drawer visual composition as reference; shared page header/tabs/pagination; global command; feature-local `src/features/activity-logs` boundary.
- **REFACTOR:** CMS-owned types (`any` in changes); query into explicit row + mapper + typed ViewModels; permission/scope filtering; server pagination/filtering; result/category vocabulary; accessibility and responsive issues; inject current-user-sensitive data at server boundary.
- **REPLACE:** `select('*').limit(200)` and raw-row return; client-only filtering/pagination; lazy demo-data import; fake export timer/download; news fallback event and all per-module audit mocks; unsupported ISO claims.
- **REMOVE only after real replacement works:** runtime `demoGovernanceDataSource.audit`, `initialAuditLogsMock`, `initialExportJobsMock` and the replaced module-local activity mocks/fallbacks. Do not remove React reference or Trash fixtures in this task.

### J. Implementation order inside module

1. Giữ schema live hiện có; review và verify missing indexes, least-privileged grants/RLS/append-only enforcement cùng action/entity/workspace registries trong task DB được duyệt.
2. Approve permission, privacy/redaction, retention/IP and writer-failure semantics.
3. Implement/test server-only append writer and a small approved producer set: auth, users/permissions, publish and configuration, including denied/failed paths.
4. Implement typed list/detail query, permission scope, explicit projections, mapper and server filtering/pagination.
5. Inject real read model into the existing CMS route while preserving reference UI; fix documented responsive/accessibility defects in `MODULE_RESPONSIVE`.
6. Connect dashboard/user/config/target projections; remove only replaced mocks.
7. Implement export only after worker/storage/expiry infrastructure exists.
8. Verify cross-module coverage, redaction, immutability, performance and go-live disclosure before raising status.

### K. Acceptance checklist

- [ ] Live table/PK/FK/check đã verified; missing indexes và grant/RLS/append-only enforcement được xử lý; không dùng `cic_history` hoặc synthetic backfill.
- [ ] Trusted writer is server-only and append-only; success occurs after commit; failed/denied and writer-failure policy are tested.
- [ ] Password/token/cookie/OTP/secret/raw sensitive payload never persists; redaction happens before insert and at read scope.
- [ ] Guest/public cannot query audit; view/sensitive/export permissions are enforced server-side and on direct URLs.
- [ ] List/detail use explicit projections, server sort/filter/pagination and bounded queries.
- [ ] Success/failed/partial/denied remain independently filterable and visually distinguishable.
- [ ] Events cannot be edited/deleted through ordinary API; retention/legal hold uses approved policy.
- [ ] Dashboard/user/config/entity projections reconcile with the same source and permission scope.
- [ ] Export respects exact filter/scope, is asynchronous/private/expiring and audits request/download.
- [ ] Loading, empty, error and forbidden states exist; drawers pass keyboard/focus/Escape/scroll and mobile checks.
- [ ] UI hierarchy/copy/icons/colors/spacing/interactions match reference except documented `FIX`/`DO_NOT_COPY` items.
- [ ] Full-history start timestamp is disclosed; no unsupported ISO-compliance claim is shown.

### 17. Infrastructure closure — 2026-09-03

- Shared writer: `src/server/audit/writer.ts`; actor chỉ nhận từ `CmsPrincipal`, action/entity/workspace qua typed registry và payload được redact trước INSERT.
- Permission catalog bootstrap: module `audit`, actions `view`, `view_sensitive`, `export`; không tự gán cho role.
- Migration tái lập: `db_migrate/migrations/20260903_activity_audit_foundation.sql`, chạy idempotent bằng `npm run db:apply-audit-foundation`.
- Raw audit tables deny browser roles; server DAL authorize trước khi đọc. Activity log có append-only trigger, retention chỉ được mở bằng transaction setting riêng.
- Export CSV đồng bộ tối đa 50.000 dòng, bucket `audit-exports` private, object thuộc requester, hết hạn một giờ, signed URL 60 giây và cleanup opportunistic khi tạo export mới.
- Producer thật đã tích hợp: `saveCmsSystemSettingsAction` → validation → `settings.edit` → DB mutation → shared writer. Role `superadmin` protected và assignment cho `admin@cic.com.vn` được migration bootstrap idempotent theo phê duyệt; runtime roundtrip còn chờ tạo Supabase Auth identity tương ứng.
- Verification DB pass: permission allow/deny, sensitive action, raw-table denial, append-only, private bucket và ba storage policy; state kiểm thử được tạo/xóa trong cùng transaction.

Fresh setup: apply base schema/data → `npm run db:apply-audit-foundation` → cấu hình server-only `SUPABASE_SERVICE_ROLE_KEY`, `CMS_BOOTSTRAP_ADMIN_EMAIL`, `CMS_BOOTSTRAP_ADMIN_PASSWORD` → `npm run bootstrap:cms-admin` → `npm run verify:audit-foundation` → start app. Bootstrap dùng Supabase Auth Admin API, không ghi trực tiếp `auth.users`, không có mật khẩu mặc định và chạy lặp an toàn.

**COMPLETE:** CMS read tables cần cho shell được cấp `SELECT` riêng cho `authenticated` và RLS theo permission module; raw audit tables vẫn server-DAL-only. Live roundtrip đã pass: Supabase Auth → Settings mutation → `settings.updated` actor `9` → Audit CMS read → private CSV export completed → short-lived signed download. Giá trị kiểm thử `cic_config.id=63` đã phục hồi chính xác về `NULL`. Activity Logs đạt `[x]` theo sáu infrastructure gates; các projection producer của module nghiệp vụ tương lai tiếp tục reuse writer/registry, không tạo audit system khác.

### 18. Module implementation closure — 2026-09-03

- Route CMS dùng read model thật với projection tường minh; search, date, severity, result, category, count và phân trang đều chạy server-side, giới hạn 10–100 dòng/trang.
- List có loading/error/empty state; total header và pagination dùng tổng số bản ghi từ DB, không dùng độ dài page hiện tại.
- Detail/export drawer giữ visual reference và bổ sung dialog semantics, focus entry/restore, Tab wrapping, Escape, backdrop close và body scroll lock.
- QA live pass tại desktop 1440×1000, tablet 820×1000 và mobile 390×844 với event producer thật `settings.updated`; không có public website surface theo scope audit đã duyệt.
- Các timeline/drawer thuộc module nghiệp vụ chưa migrate vẫn là integration của chính module đó. Chúng phải chuyển sang query projection chung khi module tương ứng được migrate và không được dùng làm producer giả cho Audit.

### 19. Responsive hardening — 2026-09-03

- **KEEP:** hierarchy, orange/slate tokens, CMS shell, toolbar/filter/tab/table/detail/export structure và desktop density của React reference.
- **ADAPT:** toolbar action full-width trên mobile; footer 1→2→12-column layout; drawer padding/header/meta rows; touch targets tối thiểu 44px; long IDs, URLs và JSON được wrap trong container.
- **FIX:** Tailwind `source(none)` trước đây không scan Header, Footer và CMS nên breakpoint utilities không được sinh; source discovery đã bổ sung đúng cây. Header desktop hiện nav tại `lg`, hamburger chỉ dưới `lg`; footer không còn nowrap/form overflow.
- **DO_NOT_COPY:** reference mobile che các cột nghiệp vụ của bảng. Implementation giữ một semantic table, min-width ổn định và vùng cuộn ngang bằng touch/keyboard thay vì render hai tree hoặc xóa cột.
- Visual regression đối chiếu `https://cic-web-sandy.vercel.app/cms/activity-logs`; automated layout checks pass ở 360, 390, 768, 1024, 1280 và 1440, không có document-level horizontal overflow, overlap hoặc drawer vượt viewport. Desktop reference không bị thay hierarchy/design direction.

### 20. Post-implementation hardening — 2026-09-03

- Export-job metadata chỉ được đọc khi có `audit.export` và chỉ theo `requested_by` của principal hiện tại; signed download vẫn kiểm tra permission, ownership, trạng thái và expiry trên server.
- CSV neutralize ký tự công thức `=`, `+`, `-`, `@` sau khi chuẩn hóa newline để tránh spreadsheet formula injection.
- Producer Cấu hình hệ thống ghi mutation và `settings.updated` trong cùng PostgreSQL transaction; writer lỗi làm rollback mutation thay vì để dữ liệu và audit lệch nhau.
- Cleanup chỉ chuyển job sang `expired` sau khi Storage xác nhận xóa artifact; lỗi xóa không còn bị bỏ qua. Export job có bốn CHECK đã validate cho status, workspace và counter không âm.
- Bộ lọc `today` dùng ngày tại `Asia/Ho_Chi_Minh`, không phụ thuộc timezone runtime. Initial server data không bị fetch lại trong production ngay sau hydration.
- Redaction che cả secret-key fields và credential pattern trong chuỗi tự do (`token=`, Bearer token, JWT); `entityTitle`/`resultMessage` cũng đi qua policy trước khi persist. Verification policy chạy từ code thật trong `src/server/audit/redaction.ts`.
- Live apply/verification pass: permission allow/deny, sensitive permission, CMS RLS, raw-table denial, append-only, private bucket/policies và bốn validated constraints. Build, typecheck, lint server Audit, boundary và data-foundation checks đều pass.
- Audit data là canonical system data: action/entity/workspace/result/severity không dịch hoặc nhân bản theo locale; `locale` chỉ ghi scope chịu tác động. Module không có public content/slug/SEO và không cần bảng nội dung VI/EN riêng.
