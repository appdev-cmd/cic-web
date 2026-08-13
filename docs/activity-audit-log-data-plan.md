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
