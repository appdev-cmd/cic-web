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
| **BẮT BUỘC** | `cic_news_categories` | unique index trên alias chuẩn hóa | Báo cáo NULL/rỗng/trùng và xử lý ngoại lệ legacy | Route danh mục VI và validation CMS |
| **BẮT BUỘC** | `cic_news_categories_en` | unique index trên alias chuẩn hóa | Kiểm tra độc lập dataset EN | Route danh mục EN và validation CMS |

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

## Blocker phát hiện nhưng không phải ADD

Hai FK EN trong PostgreSQL draft đang trỏ sang dataset VI:

- `cic_news_en.category_id → cic_news_categories(id)`.
- `cic_news_categories_en.parent_id → cic_news_categories(id)`.

CMS mới coi VI/EN là hai workspace độc lập, nên hai FK này phải được audit orphan/cycle và sửa đích sang bảng EN tương ứng trước khi chốt migration. Đây là **sửa constraint hiện có**, không phải thêm field/table, vì vậy không đưa vào danh sách ADD.

## Kết quả cuối

- **Field ADD bắt buộc:** 0.
- **Bảng ADD bắt buộc:** 0.
- **Index/constraint ADD bắt buộc:** 4 unique index alias, sau data profiling.
- **Field/bảng ADD đề xuất:** 0 tại thời điểm audit.
- **Một blocker ngoài ADD:** hai FK EN đang trỏ nhầm workspace VI.
