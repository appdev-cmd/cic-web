# CORE REVIEW GATE

Ngày review: 2026-09-04. Phạm vi: Auth, Users, RBAC, Audit Log, Trash và database/SQL trực tiếp liên quan.

## A. Kết luận

**Ready with known debt**, với điều kiện vận hành: chạy `npm run bootstrap:cms-admin` để liên kết `cic_users.auth_user_id` trước khi phát hành guard fail-closed; thu hồi/xoay các credential từng xuất hiện trong Git history; đưa dump nguồn vào kho artifact hạn chế truy cập trước khi xóa bản local.

Boundary hiện tại đủ rõ và không cần thêm repository framework, event bus, factory hay base class. Request đi qua session Supabase, `src/server/auth/guards.ts`, feature action/query, PostgreSQL transaction và audit writer. Business module dùng Trash qua typed lifecycle adapter registry.

## B. P0/P1 phát hiện

| Mức | Vấn đề / nguyên nhân | Ảnh hưởng | Xử lý | Trạng thái |
|---|---|---|---|---|
| P0 | Credential ETL được hard-code; dump/export chứa dữ liệu nhạy cảm được Git track | Lộ secret/PII qua source và history | `config.py` chỉ đọc environment; dump/export/cache bỏ khỏi index; thêm gate repository security | Code đã xử lý; credential rotation và history purge còn là vận hành bắt buộc |
| P0 | Runtime từng nhận diện profile theo email thay vì identity bridge | Có thể gắn nhầm Auth identity với legacy profile | Guard chỉ lookup `auth_user_id`; bootstrap kiểm tra conflict rồi persist bridge | Đã xử lý; cần chạy bootstrap trước deploy |
| P1 | Supabase Auth và PostgreSQL không có distributed transaction | Auth thành công nhưng DB/audit fail có thể lệch trạng thái dù đã compensation | Giữ flow explicit; bổ sung reconciliation/outbox khi có worker/lifecycle requirement thật | Known debt |
| P1 | Một số feature server query import CMS read-model types | Dependency presentation ngược vào feature, tăng coupling migration UI | Chưa mass-move; chuyển type sang feature-owned khi từng UI được migrate hoặc có consumer thứ hai | Known debt |
| P1 | Trash dependency query/revalidation còn Project-specific | News/Products có relation phức tạp sẽ cần sửa Trash core | Giữ adapter registry hiện tại; chỉ mở rộng typed adapter contract khi module thứ hai chứng minh cùng nhu cầu | Known debt |

Không phát hiện circular dependency, server action thiếu permission có hệ thống, hoặc duplicate Audit/Trash/RBAC framework nghiêm trọng.

## C. Cấu trúc code

- **Giữ:** `src/server/auth`, `src/server/audit`, `src/server/db`, `src/server/supabase`; `src/features/{users,permissions,activity-logs,trash}`. Đây là boundary theo capability, file lớn nhất vẫn có responsibility tập trung và kích thước vừa phải.
- **Giữ:** một permission guard (`guards.ts`), một audit registry/writer/redaction, một typed Trash registry và adapter theo entity.
- **Refactor:** guard nhận diện CMS profile theo `auth_user_id`; bootstrap trở thành nơi claim identity bridge có conflict checks.
- **Không move/merge/split:** không có bằng chứng file quá lớn, folder một-file gây flow khó hiểu, hoặc abstraction trùng cần tái cấu trúc hàng loạt.
- **Delete khỏi Git index, giữ local:** hai dump dữ liệu ETL và Python bytecode generated. Không xóa dump local trước khi có secure archive/checksum.

## D. Database/SQL

| Artifact | Loại / responsibility | Quyết định |
|---|---|---|
| `20260903_activity_audit_foundation.sql` | Migration Audit foundation: schema hardening, permission seed, indexes, RLS, append-only/storage policy | Giữ nguyên; rộng nhưng cùng một capability |
| `20260903_trash_foundation.sql` | Migration Trash: permissions, constraints, operational indexes, RLS/revoke | Giữ riêng theo capability |
| `20260903_users_identity_hardening.sql` | Migration identity bridge: uniqueness, status constraints, indexes, privilege hardening | Giữ riêng theo capability |
| `cic14005_cic_fs_schema_moi_postgresql_PATCHED.sql` | Baseline DDL legacy PostgreSQL | Giữ; không trộn với incremental core migration |
| `cic14005_cic_fs.sql` | Source data dump nhạy cảm | Không track; lưu secure artifact có provenance/checksum |
| `export_data.sql` | Generated ETL export nhạy cảm | Không track; tái tạo bằng script khi cần |
| `config.py` | Development ETL configuration | Giữ, environment-only |
| `manifest.json`, migration scripts | ETL mapping/tooling | Giữ; không phải deploy migration |
| verify/audit scripts | Audit/verification SQL | Giữ tách khỏi migration; không mutate schema |

Ba migration không gom chung vì Audit, Trash và identity là ba logical change độc lập. Không có lý do tách theo từng table/index.

## E. Migration safety

- Activity Audit migration đã nằm trong Git history: coi là immutable/deployed-history candidate, không squash/rewrite.
- Trash và Users Identity migration hiện là file development chưa commit; DB verification cho thấy capability đã hiện diện trên database đang kiểm tra. Vì vậy không được suy ra rằng chúng chưa từng chạy ở môi trường nào.
- Không squash migration nào trong review này. Trước mọi squash cần inventory migration ledger theo từng environment.
- Fresh path dự kiến: baseline DDL → ba core migrations theo capability → seed trong migration → bootstrap explicit admin identity. Dump dữ liệu không còn là dependency ngầm trong Git.

## F. Technical debt cố ý giữ lại

1. **Auth/Postgres reconciliation:** chờ requirement worker/job đáng tin cậy; review lại trước bulk user provisioning hoặc lifecycle bất đồng bộ.
2. **Feature-owned read models:** chờ từng CMS surface được migrate khỏi legacy contracts; review khi News/Products bắt đầu dùng cùng type.
3. **Trash relation/revalidation contract:** chờ News hoặc Products có delete/restore relation thật; khi đó mở rộng typed adapter, không thêm generic framework trước.
4. **Legacy permission tables:** vẫn tồn tại để compatibility/đối soát; runtime RBAC mới dùng role assignments và role permissions. Chỉ retire sau data migration acceptance riêng.

## G. Extension test

Nếu thêm News và Products ngày mai, developer có thể khai báo permission task, gọi `requirePermission`, ghi audit bằng registry/writer chung, và đăng ký typed Trash lifecycle adapter mà không tạo framework mới. Basic delete/snapshot/restore/purge không cần đổi kiến trúc lớn.

Bottleneck còn lại là dependency summary và cache/path revalidation có logic Project-specific. Khi News/Products chứng minh cùng pattern, contract adapter nên nhận responsibility này; hiện tại chưa đủ bằng chứng để generic hóa.

## H. Verification

- `check:repository-security`: pass.
- `check:env`, `check:boundaries`, `check:data-foundation`: pass; 160 source files, không cycle hoặc privileged client access.
- `verify:audit-foundation`: pass, gồm permission, CMS read, append-only, redaction và storage policies.
- `verify:users-identity`: pass; 37 users, 1 identity mapped, unique/status/RLS/privilege checks đạt.
- `verify:trash-foundation`: pass; RLS, revoke, 4 operational indexes, 3 constraints đạt.
- `verify:trash-roundtrip`: pass; delete/snapshot/public removal/restore/relations/purge/audit.
- `verify:user-role-trash-roundtrip`: pass; Auth deprovision, CMS visibility, restore inactive, assignments, purge safety và audit.
- `audit:db-security`, `audit:auth-foundation`: pass as read-only catalog audits.
- `check:cms-production`: chạy thành công nhưng báo các business module chưa migrate vẫn dùng mock. Đây không phải duplicate runtime của core Users/RBAC/Trash và nằm ngoài scope review này.
- `typecheck`: pass cho foundation và legacy.
- `lint`: pass với zero warnings trên phạm vi lint hiện có và security gate mới.
- `build`: pass trên Next.js 16.3.3/Turbopack.
- Tests: project không khai báo script test tổng quát; các integration verification/roundtrip nêu trên là test trực tiếp cho core capability.
