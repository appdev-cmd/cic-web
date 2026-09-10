# Tương thích dữ liệu và backend — Tin tức

> Trạng thái: Core Tin tức và Danh mục đã implement trên PostgreSQL; còn integration được ghi rõ trong `MODULE_MAP.md`.
> Phạm vi: Bài viết và Danh mục tin tức của CMS mới.

## Kết luận

Giữ giao diện Tin tức hiện tại và sử dụng các bảng legacy đã chuyển sang PostgreSQL:

- `cic_news`, `cic_news_en`
- `cic_news_categories`, `cic_news_categories_en`
- `cic_news_keyword` chỉ giữ dữ liệu legacy; chưa triển khai chức năng vì hiện không có dữ liệu export

Module chỉ có hai trạng thái:

- `published = false`: Bản nháp
- `published = true`: Đã xuất bản

Không có quy trình gửi duyệt, người duyệt, trả lại hoặc phê duyệt.

## Field bài viết

Các field CMS mới dùng trực tiếp cùng tên database:

| Field | Cách sử dụng |
|---|---|
| `id` | Giữ ID legacy khi migrate |
| `title` | Tiêu đề bài viết |
| `alias` | Đường dẫn bài viết |
| `category_id` | Danh mục chính |
| `summary` | Tóm tắt |
| `content` | Nội dung rich text |
| `image` | Ảnh đại diện |
| `video` | Video nếu dữ liệu có sử dụng |
| `file_upload` | Tệp đính kèm |
| `tags` | Thẻ bài viết |
| `news_related` | Danh sách tin liên quan có thứ tự |
| `products_related` | Danh sách sản phẩm liên quan có thứ tự |
| `ordering` | Thứ tự |
| `published` | Bản nháp/Đã xuất bản |
| `is_hot` | Tin nổi bật |
| `is_new` | Cờ tin mới legacy |
| `show_in_homepage` | Hiển thị trang chủ |
| `created_time`, `updated_time` | Thời điểm tạo/cập nhật |
| `start_time`, `end_time` | Thời gian hiệu lực legacy nếu còn dùng |
| `author_id`, `author_last_id` | User tạo và sửa gần nhất |
| `author`, `author_last` | Snapshot tên legacy |
| `seo_title`, `seo_keyword`, `seo_description` | SEO từng bài |
| `other_languages1` | Dữ liệu legacy; không dùng để tạo fallback VI/EN tự động |
| `tawk_to` | Giữ tương thích legacy; không mở rộng nghiệp vụ |

Các cột legacy khác vẫn được bảo toàn trong database nhưng không đưa lên form khi code CMS cũ không còn sử dụng thực tế.

## Field danh mục

CMS mới đã chuẩn hóa đúng tên database:

| Field | Cách sử dụng |
|---|---|
| `id` | Giữ ID legacy |
| `name` | Tên danh mục |
| `title` | Tiêu đề hiển thị |
| `alias` | Đường dẫn; không dùng tên `slug` riêng |
| `parent_id` | Danh mục cha |
| `ordering` | Thứ tự trong cây |
| `summary` | Tóm tắt; không dùng tên `description` riêng |
| `image` | Ảnh danh mục |
| `published` | Trạng thái hiển thị |
| `show_in_homepage` | Hiển thị trang chủ |
| `seo_title`, `seo_keyword`, `seo_description` | SEO trang danh mục |
| `created_time`, `updated_time` | Thời điểm tạo/cập nhật |

Không có `is_hot` ở danh mục vì cả MySQL cũ và schema PostgreSQL hiện tại đều không có cột này.

## Mapping kiểu dữ liệu tại API

Tên field được giữ thống nhất; backend chỉ chuyển cách biểu diễn:

| Field | Frontend | Legacy database | Quy tắc API |
|---|---|---|---|
| `tags` | `string[]` | text | Trim, bỏ phần tử rỗng; serialize/deserialize ổn định |
| `news_related` | ID array | CSV ID | Bỏ trùng, kiểm tra tồn tại, giữ đúng thứ tự |
| `products_related` | ID array | CSV ID | Bỏ trùng, kiểm tra tồn tại, giữ đúng thứ tự |
| `author` | Object hiển thị | `author_id` + snapshot tên | Join user khi đọc; không lưu object vào `cic_news` |
| `image` | Media được chọn | Đường dẫn file legacy | API trả metadata media nhưng vẫn bảo toàn đường dẫn cũ |
| Các timestamp | ISO string | `timestamptz` | Backend parse và trả ISO có timezone |
| `count` của danh mục | number | Không phải cột nguồn | Tính bằng truy vấn đếm bài theo danh mục |

Chưa chuẩn hóa CSV thành bảng liên kết ở giai đoạn đầu để hạn chế breaking change. Nếu đổi sau này phải có migration và giữ thứ tự hiển thị.

## Contract backend tối thiểu

### CMS

- Danh sách bài: search, category, published, pagination và sort.
- Chi tiết bài theo ID.
- Tạo/cập nhật bản nháp.
- Xuất bản và chuyển về nháp.
- Chọn tin/sản phẩm liên quan thủ công.
- Quản lý cây danh mục.
- Preview đọc dữ liệu draft theo quyền CMS.
- Xóa dùng cơ chế Thùng rác, không hard-delete trực tiếp.

Backend phải kiểm tra:

- Tiêu đề và danh mục bắt buộc.
- Alias hợp lệ và duy nhất trong đúng workspace.
- Danh mục tồn tại và đang thuộc đúng locale/workspace.
- Related IDs tồn tại, không trùng và không tự tham chiếu.
- User có quyền tạo, sửa, xuất bản hoặc xóa.
- Public website không đọc bài `published = false` hoặc đang ở Thùng rác.

### Public

- Chỉ trả bài `published = true`.
- Chỉ trả bài thuộc danh mục hợp lệ/được hiển thị.
- Entity liên quan đã xóa hoặc chưa xuất bản phải được bỏ an toàn khỏi response.
- Không trả dữ liệu workflow, raw audit hoặc snapshot Thùng rác.

## VI và EN

VI và EN sử dụng hai dataset độc lập:

- VI: `cic_news`, `cic_news_categories`
- EN: `cic_news_en`, `cic_news_categories_en`

Không auto-translate, không fallback tự động và không dùng `other_languages1` để liên kết dữ liệu nếu chưa có quy tắc nghiệp vụ được chốt.

## Dữ liệu legacy giữ lại nhưng chưa dùng trên UI

Ví dụ:

- `is_slide`, `is_video`, `is_new_video`
- `display_column`, `display_title`
- `rating_count`, `rating_sum`
- `comments_*`
- `action_*`
- `icon`, `optimal_seo`

Không xóa các cột này trong lần chuyển đổi đầu. Backend không cho Marketing chỉnh nếu giao diện mới không có field tương ứng.

## Version và audit

Version history nếu được triển khai phải dùng dữ liệu version thật; không suy diễn từ `updated_time`. Nhật ký thao tác ghi vào kiến trúc chung trong `activity-audit-log-data-plan.md`.

Không tạo bảng duyệt riêng cho Tin tức. Các action chính cần audit:

- `news.created`
- `news.draft_saved`
- `news.published`
- `news.unpublished`
- `news.deleted`
- `news.restored`

## Migration và kiểm tra

Live PostgreSQL đã được chuẩn hóa và hậu kiểm ngày 2026-09-10 bằng `20260910_news_hard_data_resolution.sql`.

- Alias unique trong từng locale theo `lower(btrim(alias))`; VI/EN độc lập. Canonical chọn theo published, `start_time`/article date mới nhất, rồi ID lớn nhất. Non-canonical giữ nguyên bài và trạng thái, đổi sang `normalized-old-alias-id`.
- Duplicate legacy URL vốn ambiguous không thể preserve 1:1: canonical giữ URL cũ, các bài khác nhận URL mới; không tạo redirect giả từ một source sang nhiều bài.
- Mỗi locale tối đa 4 Hot News và 4 Home News, hai placement độc lập. Overflow giữ top 4 theo published, `ordering ASC`, date DESC, ID DESC; chỉ tắt cờ tương ứng, không delete/unpublish.
- Unique index + check alias nonblank và trigger cap placement đã tồn tại. Mọi mutation bật placement vẫn phải khóa, đếm và ghi atomically trong cùng PostgreSQL transaction; UI chỉ là UX validation.
- Sau migration: duplicate/blank alias 0; VI Hot/Home 4/4; EN 4/4; tổng bài và published không đổi.

## Implementation core 2026-09-10

CMS VI/EN và public VI cùng đọc/ghi PostgreSQL qua domain validation, projection và repository News. Mutation có permission server, Audit Writer, typed Trash snapshot/restore draft và atomic placement enforcement. Website có list/search/category/server pagination/Hot News và detail theo unique alias với media, file, SEO, CTA và related content. Không còn mock fallback trên `/cms/news`, `/news` hoặc `/news/[slug]`. Public EN locale routing, Home/Header binding và authenticated visual regression là integration pending; module đạt `[I]`, chưa `[x]`.

Các lỗi FK/schema được ghi tại tài liệu dùng chung `postgresql-schema-issues.md` để xử lý độc lập.

## Acceptance criteria

- Form chỉ còn Lưu nháp và Xuất bản.
- Không còn field/component/API contract liên quan duyệt.
- Tên field bài và danh mục khớp database.
- `is_hot` chỉ tồn tại ở bài viết.
- Related IDs giữ đúng thứ tự qua vòng đọc–ghi.
- Public không đọc draft hoặc mục đã xóa.
- Preview CMS đọc được draft theo quyền.
- VI/EN không bị trộn dữ liệu.
- Dữ liệu legacy không dùng vẫn được bảo toàn.
- Báo cáo migrate và các FK đã được xác minh trước production.
