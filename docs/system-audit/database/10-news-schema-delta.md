# Schema Delta — Tin tức và Danh mục tin tức

## Phạm vi và nguồn đối chiếu

- Legacy CMS/website: `httpdocs/cms/modules/news`, `httpdocs/modules/news`, các block đọc `fs_news*`.
- PostgreSQL baseline: `db_migrate/cic14005_cic_fs_schema_moi_postgresql_PATCHED.sql`.
- React CMS/frontend: `src/cms/modules/news`, `src/cms/data/EditorialContentDataSource.ts`, `src/web/data/newsData.ts`, `src/web/components/NewsView.tsx`.
- Tài liệu này chỉ ghi phần cần **thêm**. Không lặp lại toàn bộ schema và chưa chứa migration SQL.

## Kết luận ngắn

Không cần thêm column nghiệp vụ và không cần thêm bảng riêng cho chức năng Tin tức/Danh mục tin tức đang có.

Các nguồn hiện tại đã đáp ứng:

- `title`, `alias`, `summary`, `content`, `category_id`, `image`, `video`, `file_upload`, `tags`, SEO, publish/home/hot/order và timestamps nằm trong `cic_news`/`cic_news_en`.
- Tác giả map từ `author_id`/`author_last_id` sang `cic_users`; chuỗi `author` legacy tiếp tục là fallback/snapshot.
- Tin và sản phẩm liên quan dùng `news_related`/`products_related` hiện có trong giai đoạn compatibility; chưa tạo relation table chỉ để làm schema đẹp hơn.
- Danh mục đã có `name`, `title`, `alias`, `summary`, `parent_id`, `ordering`, `image`, publish/home và SEO trong `cic_news_categories`/`cic_news_categories_en`.
- Số bài của danh mục là `COUNT(cic_news.id)` theo `category_id`; không thêm column `count`.
- `shortDesc`, `contentMarkdown`, `img`, `date`, `views`, author object, thời gian đọc và file size là mapping/derived từ `summary`, `content`, `image`, `created_time`, `hits`, user relation và metadata file.

## ADD bắt buộc

Không có field mới và không có bảng mới bắt buộc.

### Unique index cho alias

Đây là delta constraint/index, không phải field mới. CMS mới kiểm tra alias duy nhất và website mở chi tiết bằng alias; PostgreSQL hiện mới có index thường.

| Mức độ | Bảng | Bổ sung | Điều kiện trước khi áp dụng | Lý do |
|---|---|---|---|---|
| **BẮT BUỘC** | `cic_news` | unique index trên alias chuẩn hóa | Báo cáo NULL/rỗng/trùng sau trim và so sánh không phân biệt hoa thường | Route chi tiết phải trả đúng một bài VI |
| **BẮT BUỘC** | `cic_news_en` | unique index trên alias chuẩn hóa | Kiểm tra độc lập dataset EN | Route chi tiết phải trả đúng một bài EN |
| **BẮT BUỘC** | `cic_news_categories` | unique index trên alias chuẩn hóa | Live audit 2026-09-10: 10/10 alias có giá trị, không trùng sau chuẩn hóa | Route danh mục VI và validation CMS |
| **BẮT BUỘC** | `cic_news_categories_en` | unique index trên alias chuẩn hóa | Live audit 2026-09-10: 9/9 alias có giá trị, không trùng sau chuẩn hóa | Route danh mục EN và validation CMS |

Không ép `alias NOT NULL` trong migration đầu nếu dữ liệu legacy chưa đạt. Có thể dùng partial unique index loại NULL/rỗng trong giai đoạn chuyển tiếp; quy tắc cụ thể chỉ chốt sau profiling dữ liệu thật.

## ADD đề xuất

Không có đề xuất thêm column/table riêng cho hai module này.

Các mục sau **không được chấp nhận là Schema Delta ở thời điểm này**:

- `image_alt`, `image_caption`: có trong TypeScript/mock nhưng form Tin tức hiện không ghi; frontend đang fallback alt từ title. Khi Media Library hoạt động, metadata lấy từ Media relation.
- `timezone`: chỉ có trong mock/type; ứng dụng hiện dùng timezone hệ thống. Không cần lưu lặp trên từng bài.
- `working_version_number`, `published_version_number`, `has_unpublished_changes`, `versions`: UI lịch sử phiên bản hiện là demo, save flow chưa tạo revision. Chưa đủ cơ sở thêm bảng revision cho News.
- `activity_logs`: không thêm vào `cic_news`; nếu chức năng audit chung được duyệt, dùng bảng shared `cic_activity_logs` đã nằm trong proposal hệ thống.
- `in_trash`, `deleted_at`: không thêm vào từng bảng News; nếu giữ Thùng rác chung, dùng `cic_trash_items` shared.
- Field riêng cho tuyển dụng/khuyến mại/cổ đông như `salary`, `deadline`, `programName`, `pdfSize`: chỉ xuất hiện trong fixture frontend, chưa có CMS write contract. Nội dung biên tập dùng Rich Text hoặc metadata/file hiện có; không tạo column theo subtype mock.
- Bảng relation cho `news_related`/`products_related`: có lợi về integrity nhưng chưa bắt buộc vì field legacy hiện đáp ứng đúng UI. Chỉ xem xét khi backend cần filter/join/reorder độc lập ở quy mô thực tế.

## Kiểm tra constraint live

Live audit 2026-09-10 xác nhận hai FK EN đã được sửa đúng workspace:

- `cic_news_en.category_id → cic_news_categories_en(id)`.
- `cic_news_categories_en.parent_id → cic_news_categories_en(id)`.

Không có orphan ở quan hệ bài viết–danh mục hoặc cây cha–con, và không phát hiện cycle ở cả VI/EN. Vì vậy không còn blocker constraint cho implementation Danh mục tin tức.

Profiling trước migration ngày 2026-09-10 xác nhận: VI 1.553 row/1.521 published, EN 300/300; duplicate normalized alias 9 VI/4 EN; `is_hot/show_in_homepage` là 1.178/1.035 VI và 145/144 EN. Migration `20260910_news_hard_data_resolution.sql` đã chọn canonical deterministic theo published/date/ID, đổi 14 non-canonical thành `alias-id`, và giữ nguyên tổng bài/published. Sau migration duplicate/blank alias bằng 0, Hot/Home bằng 4/4 mỗi locale.

## Kết quả cuối

- **Field ADD bắt buộc:** 0.
- **Bảng ADD bắt buộc:** 0.
- **Index/constraint đã áp dụng cho bài viết:** `ux_cic_news_alias_norm`, `ux_cic_news_en_alias_norm`; check alias nonblank đã validate; trigger cap placement đã tồn tại trên VI/EN.
- **Field/bảng ADD đề xuất:** 0 tại thời điểm audit.
- **Blocker ngoài ADD cho Danh mục:** không còn; hai FK EN đã đúng workspace.
- **Blocker cho bài viết News:** hard-data blocker đã resolved; schema/data đủ để bắt đầu implementation, chưa có nghĩa CMS/Public News complete.

Policy source of truth: alias unique theo `lower(btrim(alias))` trong từng locale; duplicate canonical theo published → `start_time`/article date mới nhất → ID lớn nhất; non-canonical dùng `alias-id`, không delete/unpublish. URL duplicate cũ không thể redirect 1:1: canonical giữ URL, các bài khác nhận URL mới. Mỗi locale tối đa 4 Hot và 4 Home độc lập; ưu tiên `ordering ASC`, date DESC, ID DESC; mutation phải enforce atomically server-side trong PostgreSQL transaction.
