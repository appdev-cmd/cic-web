# Schema Delta — Trang nội dung

Phạm vi audit: code cũ `httpdocs/cms/modules/contents` → PostgreSQL hiện tại `cic_contents*` → module React `/cms/static-pages`. Tài liệu chỉ ghi phần cần **THÊM**, không chứa migration SQL và không mô tả lại toàn bộ schema legacy.

## Bảng hiện có cần mở rộng

Không có.

`cic_contents`, `cic_contents_en` và các bảng danh mục liên quan tiếp tục được giữ nguyên để migrate, đọc và đối soát bài tĩnh legacy. Việc thêm các cột Page Builder vào những bảng này không hợp lý vì:

- code cũ lưu một bài HTML với `title`, `alias`, `summary`, `content`, `image`, `published`, ordering và SEO;
- CMS mới quản lý Page theo template code, Draft/Published snapshot, section cố định, config có schema và entity reference có thứ tự;
- một row `cic_contents` không thể biểu diễn nhiều revision và nhiều section mà không nhồi JSON/version không có toàn vẹn quan hệ.

## Bảng mới cần tạo

### `cic_content_pages`

| Column | Type | Null/default | FK / constraint |
| ------ | ---- | ------------ | --------------- |
| `id` | `bigint` identity | NOT NULL | PK |
| `workspace` | `varchar(5)` | NOT NULL | CHECK thuộc `vi`, `en` |
| `code` | `varchar(100)` | NOT NULL | Mã ổn định để frontend tìm Page |
| `name` | `varchar(255)` | NOT NULL | Tên hiển thị trong CMS |
| `slug` | `varchar(512)` | NOT NULL | Đường dẫn trong workspace |
| `page_type` | `varchar(50)` | NOT NULL | CHECK theo allowlist registry đang deploy |
| `template_key` | `varchar(100)` | NOT NULL | Template do code định nghĩa |
| `system_defined` | `boolean` | NOT NULL DEFAULT `false` | Page cố định không được xóa/đổi template |
| `draft_revision_id` | `bigint` | NULL | FK → `cic_content_page_revisions(id)`, thêm sau khi tạo bảng revision |
| `published_revision_id` | `bigint` | NULL | FK → `cic_content_page_revisions(id)`, thêm sau khi tạo bảng revision |
| `created_at` | `timestamptz` | NOT NULL DEFAULT `now()` | — |
| `created_by` | `integer` | NULL | FK → `cic_users(id)` ON DELETE SET NULL |
| `updated_at` | `timestamptz` | NOT NULL DEFAULT `now()` | — |
| `updated_by` | `integer` | NULL | FK → `cic_users(id)` ON DELETE SET NULL |

Index/unique:

- UNIQUE (`workspace`, `code`).
- UNIQUE (`workspace`, `slug`).
- Index (`workspace`, `updated_at` DESC) cho danh sách CMS.
- Hai revision pointer phải thuộc đúng Page; backend bắt buộc kiểm tra trong transaction publish/save draft.

Mức độ: **BẮT BUỘC** — `StaticPagesManager` đang dùng `code`, `slug`, `name`, `pageType`, `templateKey`, `systemDefined` và hai revision hiện hành.

### `cic_content_page_revisions`

| Column | Type | Null/default | FK / constraint |
| ------ | ---- | ------------ | --------------- |
| `id` | `bigint` identity | NOT NULL | PK |
| `page_id` | `bigint` | NOT NULL | FK → `cic_content_pages(id)` ON DELETE CASCADE |
| `version_number` | `integer` | NOT NULL | CHECK `version_number >= 1` |
| `state` | `varchar(20)` | NOT NULL | CHECK thuộc `draft`, `published` |
| `seo_title` | `varchar(255)` | NOT NULL DEFAULT `''` | CMS mới chỉnh SEO theo revision |
| `seo_description` | `text` | NOT NULL DEFAULT `''` | CMS mới chỉnh SEO theo revision |
| `created_at` | `timestamptz` | NOT NULL DEFAULT `now()` | — |
| `created_by` | `integer` | NULL | FK → `cic_users(id)` ON DELETE SET NULL |
| `published_at` | `timestamptz` | NULL | Chỉ có giá trị khi publish |
| `published_by` | `integer` | NULL | FK → `cic_users(id)` ON DELETE SET NULL |

Index/unique:

- UNIQUE (`page_id`, `version_number`).
- Index (`page_id`, `state`, `version_number` DESC).
- CHECK logic publish: `state = 'published'` yêu cầu `published_at IS NOT NULL`; thực hiện bằng constraint phù hợp hoặc transaction service.

Mức độ: **BẮT BUỘC** — Preview đọc Draft, website chỉ đọc Published; publish phải tạo snapshot không bị lần sửa Draft tiếp theo ghi đè.

### `cic_content_page_sections`

| Column | Type | Null/default | FK / constraint |
| ------ | ---- | ------------ | --------------- |
| `id` | `bigint` identity | NOT NULL | PK |
| `revision_id` | `bigint` | NOT NULL | FK → `cic_content_page_revisions(id)` ON DELETE CASCADE |
| `section_key` | `varchar(150)` | NOT NULL | Vị trí nghiệp vụ ổn định, ví dụ `legal.content` |
| `section_type` | `varchar(100)` | NOT NULL | Component type trong template registry |
| `position` | `integer` | NOT NULL | CHECK `position > 0` |
| `config` | `jsonb` | NOT NULL DEFAULT `'{}'::jsonb` | Chỉ chứa config được schema của section cho phép |

Index/unique:

- UNIQUE (`revision_id`, `section_key`).
- UNIQUE (`revision_id`, `position`).
- Không thêm GIN index cho `config` khi ứng dụng không query theo key bên trong JSON.

Mức độ: **BẮT BUỘC** — Page hiện tại có section cố định, config khác nhau theo template và không cho người dùng tự thêm/xóa/đổi section type.

### `cic_content_page_section_references`

| Column | Type | Null/default | FK / constraint |
| ------ | ---- | ------------ | --------------- |
| `id` | `bigint` identity | NOT NULL | PK |
| `section_id` | `bigint` | NOT NULL | FK → `cic_content_page_sections(id)` ON DELETE CASCADE |
| `entity_type` | `varchar(30)` | NOT NULL | CHECK theo allowlist: product, news, service, project, partner, event |
| `entity_id` | `bigint` | NOT NULL | ID entity của module tương ứng |
| `position` | `integer` | NOT NULL | CHECK `position > 0` |

Index/unique:

- UNIQUE (`section_id`, `entity_type`, `entity_id`).
- UNIQUE (`section_id`, `entity_type`, `position`).
- Index (`entity_type`, `entity_id`) cho used-by và kiểm tra tham chiếu ngược.

Quan hệ:

- Section N–N entity được chọn thủ công và giữ đúng thứ tự hiển thị.
- Không tạo FK đa hình giả từ `entity_id` tới nhiều bảng. Backend resolve và kiểm tra tồn tại/published theo `entity_type` trước khi publish.

Mức độ: **BẮT BUỘC** — Home/About và các template thiết kế riêng đang chọn thủ công Product, News, Service, Project, Partner và Event.

## Mapping / lưu ý

- `PageBuilderPage.code/name/slug/pageType/templateKey/systemDefined → cic_content_pages`.
- `draft` và `published → cic_content_page_revisions`; SEO nằm trong revision để Published không đổi khi Draft tiếp tục được sửa.
- `sections[].sectionKey/sectionType/position/config → cic_content_page_sections`.
- `sections[].references → cic_content_page_section_references`.
- Trang Chính sách bảo mật, Điều khoản sử dụng và page legal tạo thêm chỉ có đúng hai section: `legal.header` lưu tiêu đề/subtitle và `legal.content` lưu một Rich Text `richTextHtml`. Không tạo column cho từng heading, đoạn, danh sách hoặc bảng trong bài.
- CTA/Form được chọn qua modal phải lưu ID trong config theo schema section và được backend kiểm tra với `cic_ctas`/`cic_forms`; không nhét HTML của CTA/Form vào Rich Text và chưa tạo column CTA/Form riêng trên Page.
- Media trong config lưu ID asset theo contract Media, không copy URL/metadata vào Page Builder.
- `cic_contents.title/alias/content/image/seo_*` có thể làm nguồn nhập liệu cho legal page tương ứng, nhưng chỉ migrate theo manifest được duyệt; không tự biến mọi bài legacy thành Page Builder.
- `hits`, rating, tags và các display flag legacy không được copy sang domain Page Builder nếu CMS mới không dùng.
- VI/EN là hai workspace độc lập; không fallback, tự dịch hoặc tự seed nội dung VI sang EN.
- Template registry, danh sách section hợp lệ, thứ tự, config schema và reference limit nằm trong code; không tạo bảng template/section-definition chỉ để làm schema động.

## Kết luận delta

- Field thêm vào bảng legacy: **0**.
- Bảng mới bắt buộc: **4**.
- Không xóa, rename hoặc tái diễn giải `cic_contents*`.
