# Migration Status

## Audit checkpoint — 2026-08-31

Đây là checkpoint audit, không phải lệnh bắt đầu migration.

- React/Vite legacy còn nguyên và là reference implementation cho UI/behavior.
- Next.js App Router đã là build chính và có foundation/server boundaries cùng một số implementation slice.
- CMS/public hiện là mixed state: PostgreSQL-backed, legacy adapter và demo/mock cùng tồn tại.
- Không có module nào được công nhận `[x]` theo completion gate mới.
- Status authoritative nằm duy nhất trong `MODULE_MAP.md`; mọi claim `[x]`, “complete” hoặc “next module” của lịch sử trước audit đã bị supersede.

## Trạng thái audit

| Hạng mục | Trạng thái | Kết luận |
|---|---|---|
| Project context/source of truth | `[A]` | Đã khóa trong `PROJECT_CONTEXT.md` |
| Current structure | `[A]` | Đã đối chiếu React legacy, Next, feature/server và mixed data sources |
| Domain/module inventory | `[A]` | Đã chuẩn hóa trong `MODULE_MAP.md` |
| Migration architecture | `[A]` | Đã khóa trong `ARCHITECTURE.md` |
| Database mapping rules | `[A]` | DB/schema docs authoritative; mock React không phải contract |
| UI preservation | `[A]` | React legacy authoritative cho presentation/behavior |
| Business module migration | `[ ]` | Không module nào được bắt đầu hoặc nâng trạng thái trong đợt audit này |

## Implementation hiện có nhưng chưa được công nhận complete

Các surface sau tồn tại trong source và phải được audit lại khi module tương ứng được phép tiếp tục:

- Next public routes cho home/about/contact/search/legal và các domain products/services/projects/news/events;
- CMS login/authenticated shell/catch-all;
- server queries/actions/repositories ở nhiều feature;
- dashboard/global search/users/permissions/settings/function SEO có server data được đưa vào CMS shell;
- nhiều CMS modules khác vẫn lấy `demo*DataSource`/`mockData`;
- public/CMS presentation vẫn tái sử dụng nhiều legacy Client Components.

Route tồn tại, build pass, query chạy hoặc UI render không đủ để kết luận `[C]`, `[I]` hay `[x]`.

## Gate trước mọi bước migration tiếp theo

1. Có yêu cầu rõ module nào được phép làm.
2. Đọc source of truth và tài liệu schema/CMS tương ứng.
3. Xác nhận hard dependencies trong `MODULE_MAP.md` tồn tại thật.
4. Xác nhận DB contract; không suy field/relation từ mock.
5. Ghi acceptance cho UI/behavior, workflow, permission và integration bắt buộc.
6. Không sửa/xóa/cleanup React legacy; không dùng fake dependency.

## Unresolved cấp hệ thống

- Chưa có runtime/rehearsal evidence trong audit này để xác nhận toàn bộ schema delta đã được apply vào database đích.
- Chưa có end-to-end permission matrix evidence cho toàn bộ CMS query/mutation.
- Chưa có visual regression đầy đủ giữa React legacy và tất cả Next public/CMS surfaces.
- Chưa chốt đầy đủ external integrations: email delivery, chatbot/webhook, anti-spam/rate limiting, upload/storage processing và export worker.
- Chưa có field-level mapping toàn DB; đây là chủ ý ngoài phạm vi audit hiện tại.

## Application foundation checkpoint

### Phân loại trước khi sửa

| Nhóm | Kết luận |
|---|---|
| KEEP | App Router/route groups, server-only Supabase clients, PostgreSQL transaction/env/error foundation, tokens và shared CMS primitives |
| REFACTOR | application states, locale ownership, CMS client prop typing, request-scoped DB/auth deduplication, import/cycle verification |
| REPLACE | generic auth failure rơi vào 500 được thay ở page boundary bằng unauthorized/forbidden routes; locale type thuộc CMS được thay bằng shared application locale contract |
| REMOVE | Không có code nào đủ chắc chắn để xóa; legacy, mock và Route Handler chưa rõ consumer đều được giữ |

Foundation đã được chuẩn hóa mà không bắt đầu module nghiệp vụ:

- giữ App Router, public/CMS route groups, server-only Supabase/PostgreSQL infrastructure, tokens và shared CMS primitives;
- thêm typed locale contract, application state shells, CMS unauthorized/forbidden routes và page auth guard;
- bỏ `any` tại `CmsShellClient` bằng prop contract của CMS shell;
- memoize request-scoped DB/auth reads và giữ các query độc lập chạy song song ở CMS composition;
- thêm `check:boundaries` để chặn import ngược/circular dependency rõ ràng;
- không xóa React legacy, mock/module source hoặc Route Handler chưa đủ dependency evidence.

Các lỗi type/lint hiện hữu trong legacy/business module không được sửa lẫn vào foundation task; phải xử lý khi module tương ứng được phép làm hoặc trong task technical-debt riêng có regression gate.

## Supabase/data-access foundation checkpoint — 2026-09-01

- Giữ request-aware server client, server-only admin client, env validation, direct SQL transaction helper và feature-local query/action layout.
- Thêm session refresh proxy, typed database error/result convention, direct SQL timeouts và automated secret/client-boundary checks.
- Không tạo browser client vì chưa có approved browser DB/realtime/Storage use case.
- Không generate/invent global database types; per-module mapping vẫn để cho từng migration slice.
- Không thay schema, RLS, grant hoặc policy.

Read-only database security audit phát hiện:

- PostgreSQL 17.6, 146 public tables;
- RLS enabled: `0`, forced: `0`, policies: `0`;
- `anon` và `authenticated` đều có `SELECT` trên 146 bảng;
- direct `DATABASE_URL` đăng nhập bằng role `postgres`, role này có `BYPASSRLS`;
- không thấy grant cho `PUBLIC` trong audit scope.

Connectivity verification: direct PostgreSQL catalog audit và Supabase REST/SDK read bằng publishable key đều trả thành công (`cic_languages`, HTTP 200, count 2). Production `/api/health` chạy trong sandbox local trả 503 vì process bị chặn outbound network; đây là giới hạn môi trường kiểm thử, không phải lỗi credential/query. CMS login/session proxy boundary vẫn trả 200.

Đây là security blocker cần một nhiệm vụ schema/policy/role riêng: phân loại public/private table, thiết kế RLS policy theo capability, thu hẹp grant và cấp pooled least-privileged application credential. Foundation task không tự thay đổi các policy này.

## CMS auth foundation checkpoint — 2026-09-01

- KEEP: Supabase password login/logout, request-aware cookie client, session refresh proxy, active `cic_users` identity bridge và các server action đã gọi permission guard.
- REFACTOR: auth/current-user/role/capability được gom thành request-scoped `CmsPrincipal`; login có validation + safe return path; CMS header dùng identity thật và logout thật; CMS page không còn tự query/tính role-permission.
- REPLACE: Projects Route Handler chuyển từ auth-only + `select('*')` + mọi lỗi 500 sang module `view` permission, explicit projection và 401/403/500 rõ ràng.
- REMOVE: không xóa React legacy hay business module. Chỉ bỏ logic permission trùng trong CMS page và logout giả chuyển về website.

Verification tĩnh/type/boundary đã chứng minh guest/forbidden/allowed convention ở server. Live authenticated E2E chưa thể kết luận vì `auth.users = 0`, `cic_roles = 0`, `cic_user_roles = 0` và live DB thiếu `cic_role_permissions`. `cic_users_permission*` vẫn giữ nguyên, nhưng foundation không tự suy numeric semantics. Users/Roles/Permissions management UI, provisioning, role assignment, permission parity và schema/policy change cố tình để nhiệm vụ được phê duyệt riêng.
