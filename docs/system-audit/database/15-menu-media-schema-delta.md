# Schema Delta — Menu và Thư viện media

Tài liệu này chỉ ghi những thay đổi cần **thêm** vào PostgreSQL hiện tại. Chưa sửa database, chưa viết migration và không mô tả lại toàn bộ field legacy.

## Menu

### Đối chiếu

- CMS/website cũ dùng `fs_menus_groups*`, `fs_menus_items*` để quản lý nhóm, cây cha–con, link, target, trạng thái và ordering.
- PostgreSQL đã có `cic_menus_groups*`, `cic_menus_items*` với mapping trực tiếp từ legacy.
- CMS mới dùng đúng các khả năng trên: nhóm menu, cây tối đa nhiều cấp, label, URL, target cửa sổ mới, icon, hiển thị và thứ tự.

### Bảng hiện có cần mở rộng

Không có field mới.

### Bảng mới cần tạo

Không có.

### Mapping / lưu ý

- `MenuGroup.name → group_name`, `published → published`, `ordering → ordering`.
- `label → name`, `url → link`, `open_in_new_tab → target` (`true = '_blank'`, `false = '_self'`), `is_visible → published`, `display_order → ordering`.
- `parent_id` và `group_id` dùng quan hệ hiện có. `depth`, `children`, số lượng item và preview tree đều derive; không thêm column.
- `icon_name` có thể tái sử dụng field `image`/icon string hiện có sau khi mapper giới hạn allowlist Lucide; không thêm column chỉ để đổi tên theo React.
- Tab “Phân quyền & Hiển thị” hiện chỉ ghi `is_visible`; không có rule phân quyền/schedule thực nên không thêm visibility JSON, role hoặc thời gian hiệu lực.
- Cần sửa constraint hiện có của workspace EN: `cic_menus_items_en.group_id → cic_menus_groups_en(id)` và `parent_id → cic_menus_items_en(id)`. Đây là sửa FK sai workspace, không phải thêm field/bảng.
- Trước khi sửa FK phải kiểm tra orphan, sentinel `0`, self-reference và cycle. Nên có index (`group_id`, `parent_id`, `ordering`) cho mỗi workspace nếu PostgreSQL hiện chưa có.

## Thư viện media

### Đối chiếu

- Legacy `fs_image*`, gallery, banner, slideshow, video và các path file theo từng module là các nguồn media phân mảnh; `fs_image` còn mang nghĩa bài/thư viện ảnh public, không phải asset dùng chung.
- PostgreSQL giữ các bảng `cic_image*` để migrate và đối soát legacy nhưng chưa có một asset identity dùng chung cho picker, folder, album, metadata và replacement.
- CMS mới quản lý ảnh, video, tài liệu; metadata theo workspace; folder, album có thứ tự; soft delete; thay file giữ nguyên asset ID; xem version và adaptive variant.

### Bảng hiện có cần mở rộng

Không có. Không nhồi metadata Media Library vào `cic_image*` hoặc các bảng nội dung đang giữ compatibility legacy.

### Bảng mới cần tạo

#### `cic_media_assets`

| Column | Type | Constraint / default |
| ------ | ---- | -------------------- |
| `id` | `bigint` identity | PK |
| `filename` | `varchar(255)` | NOT NULL |
| `media_type` | `varchar(20)` | NOT NULL, CHECK `image`, `video`, `document` |
| `mime_type` | `varchar(150)` | NOT NULL |
| `storage_path` | `text` | NOT NULL |
| `thumbnail_path` | `text` | NULL |
| `file_size_bytes` | `bigint` | NOT NULL, CHECK `>= 0` |
| `width` | `integer` | NULL, CHECK `> 0` |
| `height` | `integer` | NULL, CHECK `> 0` |
| `duration_seconds` | `numeric(12,3)` | NULL, CHECK `>= 0` |
| `credit_author` | `varchar(255)` | NULL |
| `license_type` | `varchar(30)` | NULL, CHECK theo allowlist CMS |
| `license_expiry` | `date` | NULL |
| `tags` | `text[]` | NOT NULL DEFAULT `'{}'` |
| `workflow_status` | `varchar(20)` | NOT NULL DEFAULT `'processing'`, CHECK `processing`, `ready`, `restricted`, `archived` |
| `created_by` | `integer` | NULL, FK → `cic_users(id)` ON DELETE SET NULL |
| `created_at` | `timestamptz` | NOT NULL DEFAULT `now()` |
| `updated_at` | `timestamptz` | NOT NULL DEFAULT `now()` |
| `deleted_at` | `timestamptz` | NULL |
| `legacy_source_table` | `varchar(100)` | NULL |
| `legacy_source_id` | `bigint` | NULL |
| `legacy_path` | `text` | NULL |

- Index: (`media_type`, `workflow_status`, `deleted_at`), (`updated_at` DESC), (`created_by`), GIN (`tags`) nếu backend giữ filter tag.
- Partial unique: (`legacy_source_table`, `legacy_source_id`) khi cả hai khác NULL; chỉ áp dụng sau profiling nguồn trùng.
- Không unique toàn cục `filename` hoặc `storage_path` trước khi kiểm kê file legacy trùng tên/path.
- Mức độ: **BẮT BUỘC** — picker và toàn CMS cần một asset ID ổn định dùng chung.

#### `cic_media_asset_translations`

| Column | Type | Constraint / default |
| ------ | ---- | -------------------- |
| `asset_id` | `bigint` | NOT NULL, FK → `cic_media_assets(id)` ON DELETE CASCADE |
| `locale` | `varchar(5)` | NOT NULL, CHECK theo workspace được hỗ trợ |
| `title` | `varchar(255)` | NOT NULL |
| `description` | `text` | NULL |
| `alt_text` | `text` | NOT NULL DEFAULT `''` |
| `caption` | `text` | NULL |
| `updated_at` | `timestamptz` | NOT NULL DEFAULT `now()` |
| `updated_by` | `integer` | NULL, FK → `cic_users(id)` ON DELETE SET NULL |

- PK: (`asset_id`, `locale`); index (`locale`, `updated_at` DESC).
- Quan hệ: một file vật lý có metadata hiển thị riêng theo locale; không duplicate binary/path giữa VI và EN.
- Mức độ: **BẮT BUỘC** — data source mới đã project `alt_text`/`caption` theo workspace và không fallback VI sang EN.

#### `cic_media_folders`

| Column | Type | Constraint / default |
| ------ | ---- | -------------------- |
| `id` | `bigint` identity | PK |
| `workspace` | `varchar(5)` | NOT NULL |
| `name` | `varchar(255)` | NOT NULL |
| `alias` | `varchar(150)` | NOT NULL |
| `icon` | `varchar(100)` | NULL |
| `ordering` | `integer` | NOT NULL DEFAULT `0`, CHECK `>= 0` |
| `created_at` | `timestamptz` | NOT NULL DEFAULT `now()` |
| `updated_at` | `timestamptz` | NOT NULL DEFAULT `now()` |

- Unique: (`workspace`, `alias`); index (`workspace`, `ordering`, `id`).
- `Tất cả thư mục` là filter ảo, không tạo record folder root.
- Mức độ: **BẮT BUỘC** — CMS đang lọc và gán asset theo folder trong từng workspace.

#### `cic_media_folder_assets`

| Column | Type | Constraint / default |
| ------ | ---- | -------------------- |
| `folder_id` | `bigint` | NOT NULL, FK → `cic_media_folders(id)` ON DELETE CASCADE |
| `asset_id` | `bigint` | NOT NULL, FK → `cic_media_assets(id)` ON DELETE CASCADE |
| `ordering` | `integer` | NOT NULL DEFAULT `0`, CHECK `>= 0` |

- PK: (`folder_id`, `asset_id`); index (`asset_id`), (`folder_id`, `ordering`).
- Quan hệ: folder N–N asset để cùng asset có thể được tổ chức độc lập theo workspace mà không copy file.
- Mức độ: **BẮT BUỘC**.

#### `cic_media_albums`

| Column | Type | Constraint / default |
| ------ | ---- | -------------------- |
| `id` | `bigint` identity | PK |
| `workspace` | `varchar(5)` | NOT NULL |
| `title` | `varchar(255)` | NOT NULL |
| `alias` | `varchar(150)` | NOT NULL |
| `description` | `text` | NULL |
| `cover_asset_id` | `bigint` | NULL, FK → `cic_media_assets(id)` ON DELETE SET NULL |
| `workflow_status` | `varchar(20)` | NOT NULL DEFAULT `'draft'`, CHECK `draft`, `published`, `archived` |
| `ordering` | `integer` | NOT NULL DEFAULT `0`, CHECK `>= 0` |
| `created_by` | `integer` | NULL, FK → `cic_users(id)` ON DELETE SET NULL |
| `created_at` | `timestamptz` | NOT NULL DEFAULT `now()` |
| `updated_at` | `timestamptz` | NOT NULL DEFAULT `now()` |

- Unique: (`workspace`, `alias`); index (`workspace`, `workflow_status`, `ordering`, `id`).
- `cover_asset_id` phải thuộc album tại application/service layer trước khi publish.
- Mức độ: **BẮT BUỘC** — CMS có create/edit/delete album và chọn cover.

#### `cic_media_album_assets`

| Column | Type | Constraint / default |
| ------ | ---- | -------------------- |
| `album_id` | `bigint` | NOT NULL, FK → `cic_media_albums(id)` ON DELETE CASCADE |
| `asset_id` | `bigint` | NOT NULL, FK → `cic_media_assets(id)` ON DELETE CASCADE |
| `position` | `integer` | NOT NULL, CHECK `> 0` |

- PK: (`album_id`, `asset_id`); unique (`album_id`, `position`); index (`asset_id`).
- Quan hệ: album N–N asset có thứ tự. `item_count` được COUNT, `cover_asset_url` join từ asset; không lưu hai field derived này.
- Mức độ: **BẮT BUỘC**.

#### `cic_media_versions`

| Column | Type | Constraint / default |
| ------ | ---- | -------------------- |
| `id` | `bigint` identity | PK |
| `asset_id` | `bigint` | NOT NULL, FK → `cic_media_assets(id)` ON DELETE CASCADE |
| `version_number` | `integer` | NOT NULL, CHECK `>= 1` |
| `filename` | `varchar(255)` | NOT NULL |
| `storage_path` | `text` | NOT NULL |
| `file_size_bytes` | `bigint` | NOT NULL, CHECK `>= 0` |
| `replacement_note` | `text` | NULL |
| `created_by` | `integer` | NULL, FK → `cic_users(id)` ON DELETE SET NULL |
| `created_at` | `timestamptz` | NOT NULL DEFAULT `now()` |

- Unique: (`asset_id`, `version_number`); index (`asset_id`, `version_number` DESC).
- Quan hệ: thay file giữ nguyên asset ID và lưu bản cũ có audit rõ ràng.
- Mức độ: **BẮT BUỘC** — CMS hiện có thao tác Replace Global Asset và lịch sử phiên bản.

#### `cic_media_variants` — ĐỀ XUẤT

| Column | Type | Constraint / default |
| ------ | ---- | -------------------- |
| `id` | `bigint` identity | PK |
| `asset_id` | `bigint` | NOT NULL, FK → `cic_media_assets(id)` ON DELETE CASCADE |
| `preset_name` | `varchar(50)` | NOT NULL |
| `width` | `integer` | NOT NULL, CHECK `> 0` |
| `height` | `integer` | NOT NULL, CHECK `> 0` |
| `format` | `varchar(20)` | NOT NULL |
| `storage_path` | `text` | NOT NULL |
| `file_size_bytes` | `bigint` | NOT NULL, CHECK `>= 0` |
| `focal_x` | `numeric(5,2)` | NULL, CHECK từ `0` đến `100` |
| `focal_y` | `numeric(5,2)` | NULL, CHECK từ `0` đến `100` |
| `processing_status` | `varchar(20)` | NOT NULL DEFAULT `'processing'` |

- Unique: (`asset_id`, `preset_name`, `format`); index (`asset_id`, `processing_status`).
- Mức độ: **ĐỀ XUẤT** — UI có tab variant/focal point nhưng focal point hiện chỉ đổi local state và chưa được lưu khi Save. Chỉ tạo bảng khi backend xử lý crop/variant được triển khai thật.

### Mapping / lưu ý

- `file_size_kb` derive từ `file_size_bytes`; `owner_name`/`owner_avatar` join `created_by → cic_users`; không lưu snapshot tên/avatar trên asset.
- `folder_name`, `album_ids`, `item_count`, `used_by_count`, `used_by_refs`, `metadata_status` và URL cover là join/derived, không tạo column tương ứng.
- `used_by_refs` phải query các FK/reference của content modules hoặc một shared reference registry khi được duyệt; không lưu JSON snapshot trong Asset.
- `MediaIssue` hiện là fixture/read-only; duplicate, missing-alt, low-resolution, large-file và license-expired có thể derive bằng job/query. Chưa tạo bảng issue.
- Upload queue `progress`, `error_message`, preview URL và trạng thái client là transient; không đưa vào PostgreSQL trong audit này.
- `legacy_source_*` chỉ phục vụ trace/import. Không xóa hoặc rewrite path trong `cic_image*`; resolver giữ fallback cho dữ liệu chưa nhập Media Library.
- Không lưu URL CDN tuyệt đối nếu có thể derive từ `storage_path`; external legacy URL được giữ nguyên trong `legacy_path` hoặc theo policy storage adapter.
- Soft delete `deleted_at` chỉ áp dụng cho asset mới; album delete hiện là thao tác riêng. Restore/conflict cần được xử lý bởi service khi module Trash được triển khai.
