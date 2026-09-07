# Kế hoạch dữ liệu tương thích — Thùng rác

> Trạng thái: Core đã triển khai và kiểm chứng; `[I] Integration pending`
> Phạm vi: Module **Thùng rác** của CMS mới  
> Nguồn đối chiếu: giao diện CMS mới, code xóa của CMS cũ trong `httpdocs/cms` và schema PostgreSQL trong `db_migrate`

## Quyết định chốt

Giữ trải nghiệm **Thùng rác** đang có trên CMS mới, nhưng thay dữ liệu mock bằng một cơ chế backend có thể khôi phục thật.

Tạo một bảng trung tâm `cic_trash_items` để lưu thông tin của mọi mục đã xóa. Bảng này giải quyết việc các bảng legacy không có `deleted_at`, `deleted_by` hoặc trạng thái thùng rác mà không phải thêm các cột đó vào hàng loạt bảng cũ.

Mỗi lần đưa một mục vào Thùng rác, hệ thống phải đồng thời:

1. Kiểm tra quyền xóa.
2. Thu thập dữ liệu cần thiết để phục hồi, bao gồm các quan hệ thuộc bản ghi.
3. Tạo snapshot có version trong `cic_trash_items`.
4. Loại mục khỏi dữ liệu đang hoạt động để public website không còn đọc được.
5. Giữ file vật lý trong thời hạn lưu giữ.
6. Ghi sự kiện vào Nhật ký hoạt động.

Không được tiếp tục gọi trực tiếp logic xóa legacy rồi mới tạo bản ghi Thùng rác, vì khi đó dữ liệu và file cần phục hồi có thể đã mất.

## Hiện trạng hai hệ thống

### CMS cũ

CMS cũ không có Thùng rác tập trung và chủ yếu xóa cứng:

- Model dùng chung chạy `DELETE FROM <table> WHERE id IN (...)`.
- Ảnh gốc và các ảnh resize có thể bị xóa ngay bằng `unlink()`.
- Một số bảng mở rộng và dữ liệu đồng bộ cũng bị xóa theo.
- Một số module có `check_remove()` để chặn xóa khi còn dữ liệu liên quan, nhưng không tạo snapshot.
- Schema cũ không có bộ trường chung như `deleted_at`, `deleted_by`, `retention_until` hoặc `trash_status`.
- Không có cơ chế khôi phục dữ liệu đã xóa.

Hệ quả: dữ liệu đã bị xóa trước khi Thùng rác mới đi vào hoạt động không thể tự động khôi phục hoặc backfill đầy đủ.

### CMS mới

Giao diện mới hiện đã mô phỏng:

- Danh sách mục đã xóa.
- Người xóa và thời gian xóa.
- Thời hạn còn lại.
- Xem dữ liệu snapshot.
- Phục hồi một mục hoặc nhiều mục.
- Xử lý xung đột khi phục hồi.
- Xóa vĩnh viễn.
- Trạng thái phụ thuộc và legal hold.

Tuy nhiên các thao tác hiện chỉ thay đổi React state. Chưa có API, database, transaction, kiểm tra quyền hay ghi audit thật.

## Vì sao cần bảng trung tâm

Nếu thêm `deleted_at` vào từng bảng `news`, `products`, `services`, `projects`, `contents` và các bảng liên quan, hệ thống sẽ phải:

- Sửa rất nhiều bảng legacy.
- Sửa toàn bộ truy vấn public để luôn loại dữ liệu đã xóa.
- Lặp lại các trường người xóa, thời hạn lưu và trạng thái ở nhiều nơi.
- Khó quản lý cùng một màn hình Thùng rác cho nhiều module.

`cic_trash_items` gom metadata xóa về một nơi:

- `deleted_at` cho biết thời điểm xóa.
- `deleted_by` cho biết ai xóa.
- `entity_type` và `entity_id` xác định bản ghi nguồn.
- `snapshot_data` giữ dữ liệu phục hồi.
- `retention_until` xác định thời điểm có thể purge.
- `status` mô tả vòng đời của mục trong Thùng rác.

Như vậy, không cần thêm `deleted_at` vào toàn bộ bảng cũ.

Lưu ý: bảng trung tâm chỉ giải quyết đầy đủ bài toán khi snapshot được tạo **trước** khi xóa dữ liệu nguồn. Nếu vẫn xóa cứng như code cũ rồi mới ghi `deleted_at`, hệ thống chỉ biết một mục từng bị xóa nhưng không còn đủ dữ liệu để phục hồi.

## Mô hình dữ liệu đề xuất

Đây là mô hình logic, chưa phải câu lệnh SQL.

### `cic_trash_items`

Mỗi dòng đại diện cho một bản ghi hoặc một aggregate đã được đưa vào Thùng rác.

| Trường | Kiểu logic | Mục đích |
|---|---|---|
| `id` | UUID | ID ổn định của mục trong Thùng rác |
| `entity_type` | varchar | Loại đối tượng: `news`, `product`, `page`, `media`... |
| `entity_id` | varchar | ID gốc; dùng varchar để hỗ trợ cả legacy integer và UUID mới |
| `module_name` | varchar | Module sở hữu đối tượng |
| `title_snapshot` | varchar | Tên hiển thị tại thời điểm xóa |
| `site_id` | varchar nullable | Website/workspace sở hữu dữ liệu |
| `locale` | varchar nullable | Ngôn ngữ của dữ liệu nếu có |
| `deleted_at` | timestamptz | Thời điểm backend hoàn tất thao tác đưa vào Thùng rác |
| `deleted_by` | FK nullable | Người thực hiện; nullable cho system hoặc khi user về sau bị xóa |
| `deleted_by_name_snapshot` | varchar | Giữ tên người xóa để lịch sử vẫn đọc được |
| `retention_until` | timestamptz | Thời điểm sớm nhất được phép tự động purge |
| `status` | enum | `trashed`, `restoring`, `restored`, `purge_pending`, `purged`, `restore_failed` |
| `restore_state` | varchar | Trạng thái sau phục hồi, mặc định `draft` hoặc `inactive` |
| `original_url` | varchar nullable | Đường dẫn CMS cũ để tham chiếu, không dùng như bằng chứng bản ghi còn tồn tại |
| `snapshot_schema_version` | integer | Version cấu trúc snapshot để backend biết cách đọc dữ liệu cũ |
| `snapshot_data` | jsonb | Dữ liệu cần thiết để phục hồi bản ghi và quan hệ thuộc aggregate |
| `file_manifest` | jsonb nullable | Danh sách file/storage key cần giữ và phục hồi |
| `dependency_status` | varchar | Kết quả kiểm tra gần nhất: `unchecked`, `clear`, `conflict`, `parent_trashed`, `schema_mismatch` |
| `dependency_checked_at` | timestamptz nullable | Thời điểm kiểm tra phụ thuộc gần nhất |
| `purged_at` | timestamptz nullable | Thời điểm xóa vĩnh viễn |
| `purged_by` | FK nullable | Người hoặc system thực hiện purge |
| `purge_reason` | text nullable | Lý do xóa vĩnh viễn |
| `correlation_id` | varchar | Liên kết thao tác với audit log và transaction/job |
| `created_at`, `updated_at` | timestamptz | Thời điểm tạo/cập nhật bản ghi kỹ thuật |

Không lưu HTML giao diện, CSS, JSX hoặc source code component trong bảng này. Snapshot chỉ chứa dữ liệu nghiệp vụ vốn thuộc bản ghi bị xóa.

### `cic_trash_dependencies`

Chỉ cần khi một mục có nhiều quan hệ phải kiểm tra hoặc phục hồi theo thứ tự. Bảng này không thay thế snapshot.

| Trường | Mục đích |
|---|---|
| `id` | ID quan hệ |
| `trash_item_id` | FK tới `cic_trash_items` |
| `related_entity_type` | Loại đối tượng liên quan |
| `related_entity_id` | ID đối tượng liên quan |
| `relation_type` | Ví dụ `parent`, `child`, `reference`, `attachment` |
| `restore_order` | Thứ tự cần phục hồi |
| `state` | Trạng thái đối tượng liên quan khi xóa |
| `metadata` | Context tối thiểu cần cho kiểm tra phụ thuộc |

Không bắt buộc tạo bảng này trong bản đầu nếu snapshot của từng module đã đủ. Chỉ bổ sung khi có nhu cầu phục hồi aggregate phức tạp.

## Snapshot cần chứa gì

Snapshot không phải bản sao tùy ý của toàn bộ database. Mỗi `entity_type` phải có quy tắc allowlist riêng.

Ví dụ một sản phẩm có thể cần:

- Bản ghi sản phẩm chính.
- Danh mục đã gán.
- Danh sách ảnh và thứ tự ảnh.
- Tài liệu đính kèm.
- Quan hệ hãng sản xuất, loại sản phẩm và lĩnh vực ứng dụng.
- Các bảng mở rộng thực sự thuộc vòng đời của sản phẩm.

Không đưa vào snapshot:

- Password hoặc password hash.
- Access token, refresh token, API key hoặc secret.
- Cookie và session.
- Toàn bộ request/response body.
- Dữ liệu của entity khác chỉ vì nó đang được tham chiếu.
- Source code giao diện.

UI không được render thẳng toàn bộ JSON snapshot cho mọi người dùng. Drawer chỉ hiển thị các trường đã được allowlist và phù hợp với quyền hiện tại.

## Vòng đời dữ liệu

### Đưa vào Thùng rác

```text
Người dùng bấm Xóa
        ↓
Backend xác thực và kiểm tra quyền
        ↓
Adapter của module đọc bản ghi, quan hệ và file manifest
        ↓
Tạo snapshot có version trong cùng transaction
        ↓
Loại dữ liệu khỏi nguồn đang hoạt động
        ↓
Ghi audit event thành công/thất bại
        ↓
CMS cập nhật danh sách
```

Không xóa file vật lý ở bước này.

### Phục hồi

```text
Người dùng chọn Phục hồi
        ↓
Kiểm tra quyền restore
        ↓
Khóa mục Thùng rác để tránh xử lý đồng thời
        ↓
Kiểm tra snapshot version, slug, parent và dependency
        ↓
Phục hồi bản ghi + quan hệ + file trong transaction
        ↓
Đưa nội dung về Draft/Inactive
        ↓
Đánh dấu trash item là Restored và ghi audit
```

Phục hồi không tự động xuất bản lại nội dung. Quyền `restore` cũng không đồng nghĩa với quyền `publish`.

### Xóa vĩnh viễn

```text
Người có quyền xác nhận xóa vĩnh viễn
        ↓
Backend kiểm tra retention/policy
        ↓
Xóa snapshot và dữ liệu còn giữ
        ↓
Xóa file vật lý không còn được tham chiếu
        ↓
Ghi người xóa, thời điểm, lý do và audit event
```

Nên giữ lại metadata tối thiểu của thao tác purge trong audit log. Không giữ nguyên snapshot sau khi đã purge nếu policy yêu cầu dữ liệu phải được xóa hoàn toàn.

## Tương thích với database cũ và PostgreSQL mới

### Dữ liệu đã xóa trước đây

Không backfill các mục đã bị CMS cũ xóa cứng. Hệ thống không còn đủ dữ liệu để tái tạo chính xác:

- Bản ghi chính.
- Quan hệ bảng phụ.
- File vật lý.
- Người và thời điểm xóa.

Thùng rác chỉ có dữ liệu đáng tin cậy từ thời điểm backend mới được bật.

### Foreign key của PostgreSQL

Schema PostgreSQL mới có các ràng buộc `ON DELETE CASCADE`, `ON DELETE SET NULL` và khóa ngoại thật, trong khi nhiều bảng MySQL cũ dùng MyISAM.

Do đó không thể bê nguyên thứ tự xóa của code legacy sang backend mới. Adapter của từng module phải:

- Đọc đủ aggregate trước khi xóa.
- Xác định dữ liệu nào thuộc aggregate và dữ liệu nào chỉ được tham chiếu.
- Tạo snapshot trước khi cascade có thể xảy ra.
- Thực hiện trong transaction.
- Không phục hồi quan hệ trỏ tới entity không còn tồn tại nếu chưa có phương án xử lý rõ ràng.

### ID legacy

Giữ nguyên `entity_id` gốc trong trash item. Khi phục hồi:

- Ưu tiên dùng lại ID nếu không xung đột và sequence PostgreSQL vẫn an toàn.
- Nếu không thể dùng lại ID, backend phải tạo ID mới và map lại toàn bộ quan hệ thuộc snapshot trong cùng transaction.
- Không để frontend tự quyết định ID phục hồi.

### Slug và mã duy nhất

Nếu slug, code hoặc trường unique đã được bản ghi mới sử dụng, backend trả conflict rõ ràng. Người dùng có thể:

- Hủy phục hồi.
- Phục hồi với slug mới được backend đề xuất.
- Xử lý bản ghi đang chiếm slug nếu có quyền phù hợp.

Không hard-code suffix theo năm. Slug đề xuất phải ngắn, dễ đọc và được kiểm tra unique tại backend.

## File và media

Snapshot database không đủ để phục hồi ảnh hoặc tài liệu nếu file đã bị xóa khỏi storage.

Quy tắc đề xuất:

- Đưa vào Thùng rác: giữ file, không gọi `unlink()` của code legacy.
- `file_manifest` lưu storage key, loại file, checksum và quan hệ với entity.
- Phục hồi: kiểm tra file vẫn tồn tại trước khi commit.
- Purge: chỉ xóa file nếu không còn entity hoạt động nào tham chiếu.
- Nếu file dùng chung, chỉ gỡ quan hệ của mục bị xóa; không xóa file dùng chung.

## API contract dự kiến

Tên route có thể điều chỉnh theo convention backend, nhưng hành vi phải giữ thống nhất.

### Danh sách

`GET /api/cms/trash`

Hỗ trợ:

- `search`
- `entityType`
- `module`
- `deletedBy`
- `deletedFrom`, `deletedTo`
- `dependencyStatus`
- `page`, `pageSize`

Backend luôn áp dụng permission và site/workspace scope trước khi trả dữ liệu.

### Chi tiết

`GET /api/cms/trash/{trashId}`

Chỉ trả snapshot đã được redact/allowlist theo quyền. Không mặc định trả raw JSON đầy đủ.

### Phục hồi

`POST /api/cms/trash/{trashId}/restore`

Request có thể chứa phương án xử lý conflict đã được backend hỗ trợ, ví dụ `restore_as_draft` hoặc `use_suggested_slug`.

### Xóa vĩnh viễn

`DELETE /api/cms/trash/{trashId}`

Yêu cầu quyền riêng và lý do. Backend không tin câu xác nhận từ frontend như một biện pháp bảo mật; đó chỉ là bước phòng thao tác nhầm.

### Thao tác hàng loạt

- `POST /api/cms/trash/bulk-restore`
- `POST /api/cms/trash/bulk-purge`

Backend phải validate từng mục. Kết quả trả về cần phân biệt `success`, `failed` và lý do cho từng ID; không báo toàn bộ thành công khi chỉ xử lý được một phần.

## Quyền và bảo mật

Tách các quyền tối thiểu:

- `trash.view`
- `trash.restore`
- `trash.purge`
- `trash.view_sensitive_snapshot` nếu thực sự cần

Quyền còn phải chịu giới hạn module và site/workspace. Người dùng chỉ được nhìn và phục hồi dữ liệu vốn thuộc phạm vi họ quản lý.

Mọi thao tác xóa, phục hồi và purge phải được backend ghi vào `cic_audit_events` với cùng `correlation_id`. Frontend không tự tạo audit event đáng tin cậy.

## Retention và legal hold

### Retention

Bản đầu có thể dùng một thời hạn mặc định do hệ thống cấu hình, ví dụ 30 ngày. `daysRemaining` không lưu thành cột; UI tính từ `retention_until` để tránh sai lệch.

Hết hạn retention không nhất thiết phải purge đồng bộ ngay trong request. Worker định kỳ có thể chuyển mục sang `purge_pending`, sau đó purge an toàn và ghi audit.

### Legal hold

CMS mới đang hiển thị legal hold nhưng hệ thống cũ không có nghiệp vụ này. Chỉ giữ tính năng nếu có yêu cầu pháp lý, policy, quyền quản trị và backend enforce thật.

Nếu chưa có các điều kiện đó:

- Ẩn legal hold khỏi giao diện production.
- Không thêm field chỉ để khớp mock UI.
- Không hiển thị câu chữ tạo cảm giác hệ thống đã đáp ứng compliance.

## Những loại dữ liệu nên áp dụng trước

Giai đoạn đầu nên áp dụng cho nội dung Marketing thường xóa nhầm:

- Trang nội dung.
- Tin tức.
- Sản phẩm.
- Dịch vụ.
- Dự án.
- Sự kiện.
- Media/tài liệu sau khi cơ chế file manifest sẵn sàng.

Không dùng cùng một quy tắc xóa cho:

- Người dùng.
- Vai trò và quyền.
- Cấu hình bảo mật.
- Nhật ký hoạt động.
- Secret hoặc credential.

Các dữ liệu này cần archive/deactivate hoặc policy riêng. Audit log không được đưa vào Thùng rác như nội dung thông thường.

## Những điểm cần sửa trong giao diện mock khi kết nối backend

- Thay local state bằng API thật.
- Sửa các chuỗi tiếng Việt đang lỗi encoding.
- Không thông báo “đã ghi audit” trước khi backend xác nhận.
- Bulk restore phải chạy dependency/conflict validation cho từng mục.
- Không render raw `snapshotData` cho mọi người dùng.
- Tính số ngày còn lại từ `retention_until`.
- Không hard-code suffix slug như `-restored-2026`.
- Thống nhất rằng nội dung được phục hồi về Draft/Inactive.
- Hiển thị kết quả partial success của thao tác hàng loạt.
- Ẩn legal hold nếu chưa được triển khai thật.

## Phạm vi triển khai tối thiểu

Để tránh over-engineering, phiên bản đầu chỉ cần:

1. `cic_trash_items`.
2. Adapter cho từng module được hỗ trợ.
3. Snapshot versioned và file manifest khi module có file.
4. List, detail, restore và permanent delete API.
5. Phục hồi mặc định về Draft/Inactive.
6. Kiểm tra permission, site scope, unique conflict và dependency ở backend.
7. Transaction và audit log.
8. Retention mặc định có worker purge.

Chưa cần ngay:

- Legal hold.
- Nhiều policy retention phức tạp.
- Phục hồi xuyên hệ thống ngoài phạm vi CMS.
- Tự động sửa mọi conflict.
- Backfill dữ liệu từng bị xóa trong CMS cũ.

## Acceptance criteria cho bước triển khai sau

- Mọi mục được xóa qua backend mới đều có `deleted_at` và `deleted_by` đáng tin cậy.
- Public API không trả dữ liệu đang nằm trong Thùng rác.
- Không xóa file vật lý khi mới đưa vào Thùng rác.
- Có thể phục hồi đầy đủ bản ghi, quan hệ thuộc aggregate và file trong phạm vi module hỗ trợ.
- Nội dung phục hồi luôn về Draft/Inactive, không tự Published.
- Conflict slug và dependency được backend phát hiện.
- Bulk action trả kết quả cho từng mục.
- Purge bị chặn nếu người dùng không có quyền.
- Mọi thao tác thành công, thất bại hoặc partial đều có audit event.
- Snapshot không chứa secret và UI không lộ raw dữ liệu nhạy cảm.
- Dữ liệu legacy hiện có không bị sửa hoặc xóa chỉ để bổ sung Thùng rác.
- Không tuyên bố có legal hold khi backend chưa enforce.

## Kết luận

`cic_trash_items` là cách phù hợp để bổ sung `deleted_at` và toàn bộ metadata xóa cho hệ thống legacy mà không phải sửa hàng loạt bảng cũ.

Để khôi phục thật, bảng này phải được dùng cùng snapshot có version, transaction theo từng module và chính sách giữ file. Dữ liệu đã bị CMS cũ hard-delete không thể tái tạo đáng tin cậy; Thùng rác bắt đầu có hiệu lực từ thời điểm backend mới được triển khai.

Hướng này giữ được giao diện CMS mới, tương thích tốt hơn với PostgreSQL có foreign key và hạn chế breaking change đối với dữ liệu legacy.

---

## Audit implementation readiness — 2026-09-03

Phần này ghi nhận source và database thật tại ngày audit; khi khác với đề xuất thiết kế ở trên, hiện trạng dưới đây quyết định readiness. Audit không sửa source nghiệp vụ.

### A. Scope Thùng rác

- CMS-only: route chính `/cms/trash`, alias `/cms/recycle-bin`, navigation trong CMS.
- Bao gồm list/search/filter/tab/pagination dự kiến, selection và bulk action, detail drawer, restore conflict, permanent purge, retention/dependency/legal-hold state và audit integration.
- Không có Website public, public card/detail, SEO, CTA, gallery/media picker, create/edit form hoặc publish UI riêng. Website chỉ chịu quy tắc gián tiếp: entity đã trash không được public query trả về.
- Không coi Activity Logs là cùng module: Thùng rác phải gọi Audit Writer dùng chung, không tự insert hoặc triển khai lại audit infrastructure.

### B. UI Reference Map

| Surface | Reference và hierarchy | Data/state/interaction | Responsive audit |
|---|---|---|---|
| CMS shell/header | `CmsPageHeader`, icon Trash, “Thùng rác”, mô tả, badge tổng số; card giới thiệu “Thùng rác & Phục hồi Dữ liệu” | Count từ list/query; route/sidebar active | **KEEP** hierarchy; **ADAPT** title/meta wrap và toolbar stack ở màn hẹp |
| Search/filter/tabs | Search; select module; tab tất cả và sắp hết hạn 7 ngày | Search/filter phải chạy server-side cùng pagination; tab suy từ `purge_after` | **KEEP** concept; **REFACTOR** module options từ registry/live support, không catalogue mock |
| Trash table | Chọn; tiêu đề + module; type/scope; người/thời gian xóa; retention; dependency/conflict; actions | Select row/all; detail, restore, purge; loading/empty/error/partial bulk | **ADAPT/FIX** cuộn ngang truy cập được, sticky identity/action phù hợp, text dài wrap, touch/keyboard; không đổi thành card |
| Bulk action bar | Phục hồi và xóa vĩnh viễn các mục chọn | Server validate từng item và trả partial result; legal hold/dependency có thể chặn từng item | **KEEP** placement/concept; **DO_NOT_COPY** báo success toàn bộ hoặc chỉ xóa local state |
| Detail drawer | Metadata, legal hold, dependency, snapshot preview, restore/purge | Detail query riêng; snapshot allowlist/redact theo entity và permission | **ADAPT/FIX** bounded `dvh`, internal scroll, focus trap, Escape, scroll lock; không render raw JSON |
| Restore conflict modal | Restore as draft/inactive; auto-rename hoặc parent-first khi adapter hỗ trợ | Backend quyết định mode hợp lệ, check unique/parent/relation trong transaction | **KEEP** interaction concept; **DO_NOT_COPY** mode/suffix hard-code không được registry hỗ trợ |
| Permanent-delete modal | Cảnh báo, dependency/legal-hold context, lý do/xác nhận | Permission riêng, server enforce policy, reason vào audit metadata | **KEEP** confirmation; **FIX** mobile height/wrap/focus; client confirmation không phải security control |
| States | Empty state, disabled/legal-hold, conflict badge, toast | Cần loading/error/not-found/stale item/partial bulk thật | **DO_NOT_COPY** toast “đã ghi Audit” trước khi mutation và Audit Writer cùng thành công |

Không có image/video/aspect-ratio requirement. Icon, màu trạng thái, spacing và compact table direction tiếp tục bám React reference/CMS tokens hiện có. Responsive cần kiểm chứng ở 360/390/768/1024/1280/1440 trong bước `MODULE_RESPONSIVE`; audit này chưa tuyên bố visual gate pass.

### C. CMS capability/form/list map

- List columns: selection, title/module, entity type/workspace, deleted actor/time, purge deadline/remaining time, dependency/restore state, legal hold và actions.
- Search/filter/sort/pagination: search title/entity ID; module/entity type/actor/date/status/dependency/legal hold; sort deleted time và purge deadline; server pagination. Hiện Next chỉ filter client trên tối đa 200 item.
- Actions: detail, restore, purge, bulk restore/purge; mỗi mutation phải có per-item result và server authorization.
- Không có create/edit form, preview public, draft/publish editor, relation picker, media picker hoặc SEO. “Restore as draft/inactive” là lifecycle result do adapter kiểm soát, không phải publish form.
- Legal hold setting/unsetting chỉ được thêm khi policy, permission và backend enforcement được duyệt; hiện chỉ có trạng thái DB/UI, không đủ chứng minh capability quản trị.
- History/audit: dùng server-only Audit Writer và action/entity registry chuẩn sau business outcome; actor từ server auth context; không insert `cic_audit_events` trực tiếp.

### D. DB tables + relation map

Live PostgreSQL `cic_trash_items` có 20 cột: `id`, `workspace`, `entity_type`, `entity_id`, `module`, `title_snapshot`, `payload_snapshot`, `original_url`, `status`, `deleted_by`, `deleted_at`, `purge_after`, `restore_state`, `restored_by`, `restored_at`, `purged_by`, `purged_at`, `purge_reason`, `is_legal_hold`, `legal_hold_reason`.

- Live data: 0 row; chưa có source module nào tạo item; vì vậy mock không thể dùng để suy ra schema/data support.
- Actor relations: `deleted_by`, `restored_by`, `purged_by` liên hệ `cic_users`; UI cần projection tên/avatar phù hợp quyền thay vì copy identity vào input.
- Source relation là polymorphic qua `(workspace, entity_type, entity_id)` và bắt buộc resolve bằng typed registry; không có FK chung tới mọi bảng nguồn.
- Có PK, các index đơn actor/entity và unique partial cho một item `trashed` trên `(workspace, entity_type, entity_id)`. Còn thiếu index vận hành `(status, deleted_at desc)`, `(status, purge_after)`, `(deleted_by, deleted_at desc)` và retention partial cho trashed không legal hold.
- RLS hiện tắt (`relrowsecurity=false`, `relforcerowsecurity=false`); grant quan sát chỉ có `postgres`. Đây chưa phải browser/CMS security boundary hoàn chỉnh.
- Không có live `cic_trash_dependencies`; dependency phải do entity adapter/registry tính hoặc chỉ bổ sung persistence khi có use case thật.

### E. Field Usage Map

| Field | Usage | Quy tắc projection/mutation |
|---|---|---|
| `id` | SYSTEM_MANAGED / identity | Server tạo; list/detail/action key |
| `workspace` | RELATION + CMS_OPERATIONAL | Bắt buộc scope query/mutation theo auth context |
| `entity_type`, `entity_id`, `module` | RELATION + CMS_OPERATIONAL | Registry-owned; client không tự khai báo arbitrary type |
| `title_snapshot` | SYSTEM_MANAGED + CMS_OPERATIONAL | Adapter tạo từ allowlist; dùng list, không phải form field |
| `payload_snapshot` | SYSTEM_MANAGED / sensitive | Không có trong CMS list; detail chỉ trả view model allowlist/redacted |
| `original_url` | CMS_OPERATIONAL | Chỉ reference/navigation an toàn, không chứng minh source còn tồn tại |
| `status` | SYSTEM_MANAGED + CMS_OPERATIONAL | State machine backend; không PATCH tùy ý |
| `deleted_by`, `restored_by`, `purged_by` | RELATION + AUDIT | Lấy từ server actor; không tin client |
| `deleted_at`, `restored_at`, `purged_at` | AUDIT + SYSTEM_MANAGED | Timestamp server |
| `purge_after` | SYSTEM_MANAGED + CMS_OPERATIONAL | Retention source; `daysRemaining` chỉ là derived ViewModel |
| `restore_state` | SYSTEM_MANAGED + CMS_OPERATIONAL | Kết quả adapter, mặc định safe state nếu domain hỗ trợ |
| `purge_reason` | AUDIT | CMS nhập reason nhưng server sở hữu persistence/validation |
| `is_legal_hold`, `legal_hold_reason` | SYSTEM_MANAGED + CMS_OPERATIONAL | Không expose arbitrary edit khi hold policy chưa được duyệt |

Không có `PUBLIC_READ` projection và không có CMS create/edit projection. CMS list tuyệt đối không lấy `payload_snapshot`; CMS detail lấy metadata + snapshot đã redact; relation lookup lấy registry/actor/source metadata tối thiểu. Không có cột nào được chứng minh `LEGACY_UNUSED`; payload key/entity type chưa đăng ký là `UNKNOWN` và không được đưa vào UI/validation/default/cleanup.

### F. Website ↔ CMS shared-domain map

```text
Source-module delete action
→ auth/RBAC → typed lifecycle adapter → transaction
→ allowlisted snapshot + remove/hide active source → cic_trash_items
→ Audit Writer

CMS list/detail/action
→ server guard + workspace scope → explicit query projection
→ mapper/domain ViewModel → Trash UI

Restore/purge
→ server guard → lock/state validation → typed adapter transaction
→ source DB/public visibility + trash lifecycle → Audit Writer
→ revalidation/refresh
```

Share entity keys, state machine, permission constants, snapshot-version/adapter contract, conflict result, validation, mapper and audit registry. Không share Website/CMS UI và không tạo data/mobile logic riêng. Public modules chỉ share lifecycle/visibility rule; Thùng rác không có public query.

### G. Hard dependencies

| Dependency | Use case/chiều | Hiện trạng | Block |
|---|---|---|---|
| CMS auth/RBAC + `trash.view/restore/purge` | CMS → auth/permission catalogue | Auth foundation có; live catalogue không có task/view Trash | Có |
| Secured Trash schema | Trash → PostgreSQL/RLS/grants/indexes/constraints | Table có nhưng 0 row, RLS tắt, thiếu operational indexes | Có |
| PostgreSQL transaction/DAL | Adapter → source aggregate + trash item + audit outcome | Chưa có mutation/repository; query hiện dùng browser-style client | Có |
| Typed entity lifecycle registry | Trash → source module snapshot/conflict/restore/purge | Chưa tồn tại | Có |
| Ít nhất một source adapter hoàn chỉnh | Source delete → Trash → source restore/purge | Không module nào chứng minh roundtrip; nhiều nơi hard-delete/mock/local flag | Có |
| Actor relation | Trash → `cic_users` | Identity source tồn tại; cần scoped projection | Không nếu dùng đúng foundation |
| Shared Audit Writer/registry | Trash mutation → Activity Logs | Activity Logs/Audit Writer đã complete; phải reuse, không implement lại | Không |

### H. Soft/integration dependencies

- Mỗi source module bổ sung sau adapter đầu tiên: entity-specific snapshot/version/conflict/relation/visibility contract.
- Media/storage cleanup và reference counting cho entity có file.
- Retention worker/purge scheduler; cần để complete auto-retention nhưng không giả lập trong request UI.
- Dependency graph phức tạp/parent-first và legal-hold administration policy khi có nghiệp vụ thật.
- Các dependency này không được biểu diễn bằng hard-coded option hoặc mock record trước khi integration nguồn tồn tại.

### I. Next KEEP / REFACTOR / REPLACE / REMOVE

- **KEEP:** CMS route/shell/header; search/filter/tab/table hierarchy; selection/bulk action placement; detail drawer; conflict/purge modal concept; empty/legal-hold/dependency states.
- **REFACTOR:** exact DB/domain types; explicit list/detail projections; trusted server query with auth/workspace scope/search/filter/sort/pagination; mapper; responsive/a11y; module options từ typed registry; derived retention; redacted detail.
- **REPLACE:** runtime mock and local-state restore/purge/bulk handlers bằng repository/server workflow; fake dependency/conflict results bằng adapter; fake success/audit toast bằng mutation result.
- **REMOVE:** `initialTrashedItemsMock` khỏi runtime; `select('*')`; raw `Record<string, any>` snapshot rendering; unsupported module/mode/options và compliance claim chưa có backend.

### J. Implementation order bên trong module

1. Hoàn tất hard dependencies: permission catalogue, RLS/grants/indexes, server transaction boundary và typed lifecycle registry.
2. Chọn và hoàn tất một source-module adapter thực với snapshot allowlist/version, delete/hide, restore safe state và purge.
3. Tạo exact domain types, state machine, projections, mapper và server list/detail query.
4. Tạo restore/purge/bulk mutations với permission, lock, per-item validation, transaction và Audit Writer.
5. Wire CMS UI, bỏ mock/local-state/fake toast; chỉ render capability registry thật.
6. Test delete → trash → list/detail → restore/purge → source/public visibility → audit; sau đó nối thêm adapter module khác.
7. Responsive/accessibility/visual regression và quality gate.

### K. Acceptance checklist

- [ ] Không còn mock/fallback/local-state mutation hoặc `select('*')` trong Trash runtime.
- [ ] List/detail/search/filter/sort/pagination dùng projection thật, auth + workspace scope.
- [ ] Ít nhất một entity đi trọn vòng delete/add, change/conflict, restore/remove, purge và visibility.
- [ ] Snapshot có version, allowlist/redaction, không chứa secret/raw PII ngoài quyền.
- [ ] Restore về draft/inactive hoặc safe state đúng domain; không tự publish.
- [ ] Legal hold, retention, relation/media conflict được server enforce theo capability thật.
- [ ] Bulk trả success/failure theo từng ID; stale/concurrent action an toàn.
- [ ] Mọi mutation dùng server actor và Audit Writer registry sau business outcome.
- [ ] Public/source query không lộ entity đang trash; restore/purge revalidate đúng.
- [ ] Loading/empty/error/not-found/disabled/partial states và keyboard/touch/modal behavior pass.
- [ ] Responsive/visual regression pass ở 360/390/768/1024/1280/1440; desktop không lệch reference.
- [ ] Build, typecheck, lint, tests và authenticated DB/browser roundtrip pass.

### Q. Ngôn ngữ VI/EN

Thùng rác không quản lý content đa ngôn ngữ độc lập và không cần schema translation riêng. UI chrome/error/action text vẫn cần i18n VI/EN theo locale CMS dùng chung; title snapshot giữ nguyên ngôn ngữ của entity nguồn và không được machine-translate trong Trash. Nếu CMS locale foundation chưa phủ các key này, lập kế hoạch dictionary VI/EN ở bước implement, không thêm `locale` tùy ý vào live table.

**Kết luận audit ban đầu:** `BLOCKED_BY: typed delete/restore/purge adapter contract for at least one source module`

## Implementation report — 2026-09-03

Audit blocker đã được đóng bằng typed lifecycle registry và adapter `project`/`projects` cho workspace VI. Đây là source adapter thật đầu tiên, không phải fake dependency.

- Data layer: list/detail projection tách biệt; server search/filter/tab/pagination; snapshot detail allowlist; không `select *`.
- Mutation: project delete/bulk delete snapshot bản ghi và product/service relations trước khi xóa nguồn; restore khóa trash row, validate snapshot/dependency/slug, insert lại cùng ID và quan hệ với `published=false`; purge scrub `payload_snapshot` và giữ tombstone/audit metadata.
- Security: `trash.view`, `trash.restore`, `trash.purge`; server guard trên mọi read/action; `cic_trash_items` bật RLS, không cấp raw browser access; constraint/index migration idempotent.
- Audit: `project.trashed`, `trash.restored`, `trash.purged` dùng shared registry/Writer; success nằm cùng transaction, failure được ghi sau rollback mà không che business error.
- CMS: mock/local-state/hard-coded catalogue được thay bằng server data + registry capability; table/drawer/conflict/purge layout giữ reference và được harden responsive/keyboard.
- Live roundtrip: project published → trash snapshot → source/public removal → restore draft + relations → trash lần hai → purge snapshot → Audit; dữ liệu verification đã được dọn và `cic_trash_items` trở lại 0 row.
- Quality: migration verify, roundtrip, typecheck, lint, foundation boundaries, data-foundation, production build và Impeccable detector đều pass.

Pending integration không block core đã triển khai: typed adapter cho các source module ngoài Projects VI; media cleanup/reference count khi entity có file; retention worker; authenticated browser screenshot regression. Trạng thái module: `[I] Integration pending`, chưa đủ `[x] Complete`.

### Re-audit implementation gate — 2026-09-03

Năm blocker của audit ban đầu đã được kiểm tra lại trên source và database thật:

- Typed entity lifecycle registry và adapter Projects VI đã tồn tại, có snapshot version và transaction delete/restore/purge.
- Permission `trash.view`, `trash.restore`, `trash.purge` đã có trong catalogue và mọi read/mutation đều kiểm tra phía server.
- `cic_trash_items` đã bật RLS, revoke raw browser access, có operational indexes và validated constraints.
- Next Trash runtime đã dùng server query/mutation thật; không còn mock hoặc local-state mutation.
- Live roundtrip và Audit integration đã pass, dữ liệu kiểm thử đã được dọn đúng phạm vi.

**Kết luận re-audit:** `READY_TO_IMPLEMENT`

Kết luận này xác nhận gate cho phần core đã triển khai, không đồng nghĩa `[x] Complete`. Trạng thái tiếp tục là `[I] Integration pending`: **PENDING: Trash → các module ngoài Projects VI → typed entity adapter**; media cleanup/reference count, retention worker và authenticated browser visual regression được theo dõi theo dependency tương ứng.
