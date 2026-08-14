# Schema Delta — Module Dự án

## 1. Phạm vi và quyết định

Module Dự án là chức năng mới của website/CMS mới. MySQL legacy và PostgreSQL draft hiện không có `fs_projects*` hoặc `cic_projects*`; vì vậy không tái diễn giải `cic_contents*`, `cic_image*` hay `cic_business*` thành dữ liệu dự án.

Chốt bổ sung đúng hai bảng nội dung độc lập:

- `cic_projects`: workspace tiếng Việt.
- `cic_projects_en`: workspace tiếng Anh.

Hai bảng có cùng cấu trúc và không có FK chéo VI → EN hoặc EN → VI. Không tạo bảng taxonomy, gallery hoặc relation riêng trong giai đoạn đầu. Đây là thiết kế tối thiểu đủ phục vụ khối Dự án trang chủ, trang list, filter, detail, SEO và CMS CRUD hiện tại.

## 2. Nguồn yêu cầu đã đối chiếu

- Trang chủ: `HomeView`, section `home.projects`, tìm kiếm/tab và tối đa ba card được chọn.
- Trang Dự án: `ProjectsView`, tìm kiếm, filter lĩnh vực/giải pháp/khách hàng, phân trang.
- Trang chi tiết: nội dung Rich Text, factsheet, ảnh, gallery, video, tài liệu và liên kết sản phẩm/dịch vụ.
- Mock chi tiết: `src/web/data/projectsData.ts`.
- Mock trang chủ: `src/web/data/mockData.ts`.
- Page Builder: `home.projects` đã dùng reference `entityType = project`.
- News: contract đã có project liên quan nhưng chưa có project entity trong PostgreSQL.

Hai bộ mock trang chủ và trang Dự án phải được map về cùng một project entity. Không tạo dataset hoặc bảng riêng cho homepage.

## 3. Cấu trúc hai bảng

Bảng dưới áp dụng giống nhau cho `cic_projects` và `cic_projects_en`.

| Column | PostgreSQL type | Null/default | Constraint/index | Nguồn và ý nghĩa |
|---|---|---|---|---|
| `id` | `bigint GENERATED ALWAYS AS IDENTITY` | required | PK | ID nội bộ; frontend không dùng làm slug |
| `title` | `varchar(255)` | required | index phục vụ search khi cần | `name`, tên dự án |
| `alias` | `varchar(255)` | required | UNIQUE từng bảng | Slug public; mock string ID map vào đây |
| `tagline` | `text` | NULL | không index | Câu giới thiệu nổi bật ở detail |
| `summary` | `text` | NULL | full-text/trigram chỉ khi triển khai search DB | `shortDesc`, dùng ở card/list/search |
| `content` | `text` | NULL | không index B-tree | HTML Rich Text của bài dự án |
| `sector` | `varchar(150)` | NULL | B-tree index | Lĩnh vực; filter list |
| `solution` | `varchar(255)` | NULL | B-tree index | Nhãn giải pháp chính; filter list |
| `customer_name` | `varchar(255)` | NULL | B-tree index | Chủ đầu tư/khách hàng; filter list |
| `location` | `varchar(255)` | NULL | không index mặc định | Địa điểm thực hiện; tham gia text search |
| `start_year` | `smallint` | NULL | CHECK hợp lệ | Năm bắt đầu |
| `end_year` | `smallint` | NULL | CHECK `end_year >= start_year` | Năm kết thúc; NULL nếu chưa rõ/đang làm |
| `is_ongoing` | `boolean` | `NOT NULL DEFAULT false` | CHECK không có `end_year` khi true | Dự án đang triển khai |
| `image` | `varchar(500)` | NULL | không index | Ảnh đại diện; giữ compatibility đường dẫn hiện tại |
| `gallery` | `jsonb` | `NOT NULL DEFAULT '[]'::jsonb` | CHECK phải là array; không GIN mặc định | Danh sách ảnh/media reference có thứ tự |
| `video_title` | `varchar(255)` | NULL | không index | Tiêu đề video |
| `video_url` | `text` | NULL | không index | URL/embed URL video ngoài hệ thống |
| `video_thumbnail` | `varchar(500)` | NULL | không index | Thumbnail video |
| `document_title` | `varchar(255)` | NULL | không index | Tên case study/tài liệu |
| `document_url` | `text` | NULL | không index | URL/path tải tài liệu |
| `document_size` | `varchar(50)` | NULL | không index | Nhãn dung lượng để giữ UI hiện tại; metadata server có thể thay thế sau |
| `products_related` | `integer[]` | `NOT NULL DEFAULT '{}'` | GIN chỉ khi cần reverse lookup | ID sản phẩm liên quan, cùng kiểu ID target hiện tại |
| `services_related` | `integer[]` | `NOT NULL DEFAULT '{}'` | GIN chỉ khi cần reverse lookup | ID dịch vụ liên quan, cùng kiểu ID target hiện tại |
| `is_featured` | `boolean` | `NOT NULL DEFAULT false` | composite index với publish/order | Dự án nổi bật chung; không thay thế selection của Page Builder |
| `published` | `boolean` | `NOT NULL DEFAULT false` | composite index | Trạng thái public |
| `ordering` | `integer` | `NOT NULL DEFAULT 0` | composite index | Thứ tự mặc định trong list |
| `seo_title` | `varchar(255)` | NULL | không index | SEO title |
| `seo_keyword` | `varchar(255)` | NULL | không index | Giữ convention schema hiện tại |
| `seo_description` | `varchar(500)` | NULL | không index | SEO description; mapper có thể fallback từ summary nhưng không backfill giả |
| `created_by` | `integer` | NULL | FK `cic_users(id)`; index | Người tạo; NULL cho seed/system |
| `updated_by` | `integer` | NULL | FK `cic_users(id)`; index khi audit cần | Người sửa cuối |
| `created_time` | `timestamptz` | `NOT NULL DEFAULT now()` | index tùy list sort | Thời gian tạo |
| `updated_time` | `timestamptz` | `NOT NULL DEFAULT now()` | index | Trigger/application cập nhật khi sửa |

## 4. FK và quy tắc quan hệ

### FK được tạo

- `created_by REFERENCES cic_users(id) ON DELETE SET NULL`.
- `updated_by REFERENCES cic_users(id) ON DELETE SET NULL`.

Không dùng `CASCADE` vì xóa user không được làm mất project.

### Không tạo FK cho các field sau

- `sector`, `solution`, `customer_name`: hiện là nhãn nội dung/filter, chưa có master entity đúng nghĩa.
- `image`, `video_url`, `video_thumbnail`, `document_url`: cần giữ được URL/path mock và external URL hiện tại.
- `gallery`: JSON có thứ tự, PostgreSQL không đảm bảo FK cho từng phần tử JSON.
- `products_related`, `services_related`: PostgreSQL không khai báo FK cho từng phần tử array.

CMS/service phải kiểm tra các ID trong `products_related` và `services_related` tồn tại trước khi lưu, đồng thời bỏ ID không hợp lệ khỏi response public. Đây là đánh đổi có chủ đích để chỉ tạo hai bảng. Nếu sau này cần integrity tuyệt đối, reverse lookup/xóa liên đới hoặc relation có metadata, khi đó mới nâng cấp thành junction table; không tạo trước nhu cầu.

### Quan hệ VI/EN

- Không giả định hai bảng có cùng `id`.
- Không FK `cic_projects_en.id` sang `cic_projects.id`.
- Nếu sau này cần ghép bản dịch, thêm một khóa business dùng chung sau khi duyệt; không dùng ID trùng ngẫu nhiên.

## 5. Index đề xuất

Tạo cho từng bảng:

```sql
UNIQUE (alias)
INDEX (published, ordering, id)
INDEX (is_featured, published, ordering, id)
INDEX (sector)
INDEX (solution)
INDEX (customer_name)
INDEX (updated_time)
INDEX (created_by)
```

Chưa tạo mặc định:

- GIN cho `gallery`, vì không query theo từng ảnh.
- GIN cho related arrays, trừ khi CMS cần màn “đang được dùng ở đâu”.
- Trigram/full-text index, cho đến khi Next.js data layer chốt chiến lược tìm kiếm không dấu/tiếng Việt.

Khi triển khai search PostgreSQL, ưu tiên một biểu thức/search document từ `title`, `summary`, `customer_name`, `location`; không dùng nhiều truy vấn `%keyword%` không index trên dữ liệu lớn.

## 6. CHECK constraint

Áp dụng cho cả hai bảng:

```sql
CHECK (start_year IS NULL OR start_year BETWEEN 1800 AND 2200)
CHECK (end_year IS NULL OR end_year BETWEEN 1800 AND 2200)
CHECK (end_year IS NULL OR start_year IS NULL OR end_year >= start_year)
CHECK (NOT is_ongoing OR end_year IS NULL)
CHECK (jsonb_typeof(gallery) = 'array')
CHECK (ordering >= 0)
CHECK (length(btrim(title)) > 0)
CHECK (length(btrim(alias)) > 0)
```

Alias được chuẩn hóa lowercase/kebab-case và kiểm tra ở application layer. Không dùng CHECK regex quá cứng trong migration đầu tiên để tránh khóa các slug hợp lệ ngoài dự kiến.

## 7. Mapping UI/mock → database

| UI/mock | Database | Rule |
|---|---|---|
| `id` dạng `landmark-81-bim` | `alias` | DB `id` là identity |
| `name` | `title` | rename ở mapper |
| `tagline` | `tagline` | direct |
| `shortDesc` | `summary` | rename ở mapper |
| `htmlContent` | `content` | Rich Text, sanitize khi render |
| `sector` | `sector` | direct, dùng filter |
| `solution` | `solution` | direct, dùng filter |
| `customer` | `customer_name` | rename ở mapper |
| `location` | `location` | direct |
| `time = 2022 - 2024` | `start_year=2022`, `end_year=2024` | deterministic parse |
| `time = 2023 - Hiện tại` | `start_year=2023`, `end_year=NULL`, `is_ongoing=true` | frontend compose nhãn theo locale |
| `img` | `image` | direct path trong giai đoạn mock/migration |
| `featured` | `is_featured` | rename ở mapper |
| `gallery` | `gallery` | JSON array có thứ tự |
| `video.*` | ba field video | không lưu object mock nguyên trạng |
| `pdf.*` | ba field document | không lưu object mock nguyên trạng |
| `relatedLinks[product]` | `products_related` | lưu ID, label lấy từ Product |
| `relatedLinks[service]` | `services_related` | lưu ID, label lấy từ Service |
| `scope`, `results` | `content` | biên tập trong Rich Text |
| `appliedSolutions` | `content` | Rich Text; chưa tạo column/JSON riêng |
| testimonial cố định | frontend/page config | UI-only/shared content |
| card `size`, hover state, số thứ tự 01/02/03 | frontend | UI-only |

## 8. Nguồn dữ liệu theo màn hình

### Trang chủ

`home.projects` lấy project theo `cic_content_page_section_references` và giữ `position`; không copy title/image/customer vào Page Builder. `is_featured` chỉ dùng cho truy vấn nổi bật mặc định, không ghi đè lựa chọn thủ công tối đa ba project.

### Trang list

- Public chỉ đọc `published = true`.
- Filter: `sector`, `solution`, `customer_name`.
- Search projection: `title`, `summary`, `customer_name`, `location`.
- Sort mặc định: `ordering`, sau đó `id` để kết quả ổn định.

### Trang detail

- Lookup bằng `alias` trong đúng workspace.
- `content` là nguồn bài viết chính.
- Factsheet lấy từ customer/location/year/sector/solution.
- Related project hiện được derive theo cùng `sector`; không lưu `related_project_ids` ở giai đoạn này.

## 9. Validation CMS

- Bắt buộc: `title`, `alias`.
- Alias unique trong đúng bảng/workspace.
- Nếu `is_ongoing=true`, CMS xóa/không gửi `end_year`.
- `end_year` không nhỏ hơn `start_year`.
- Gallery chỉ nhận item hợp lệ và giữ thứ tự.
- URL video/document phải dùng protocol/path được allowlist; không render embed URL tùy ý chưa sanitize.
- Related product/service phải tồn tại trước khi lưu.
- `published=true` nên yêu cầu tối thiểu summary, content và image ở application validation; không ép NOT NULL trong DB để vẫn lưu Draft.

## 10. Migration và dữ liệu legacy

- Đây là Level 3 — thêm entity mới; migration additive và reversible.
- Legacy không có project table nên không copy/sinh tự động project record.
- Hai bảng khởi tạo rỗng hoặc seed chính các project mock đã được nghiệp vụ duyệt.
- Nếu phát hiện bài cũ trong `fs_contents*` mô tả dự án, chỉ import theo manifest được duyệt; giữ legacy source ID/path trong báo cáo migration, không tự phân loại theo keyword.
- Rollback chỉ drop hai bảng mới khi xác nhận không có dữ liệu production; không tác động 104 bảng legacy/target hiện có.

## 11. Thứ tự triển khai sau khi duyệt

1. Hợp nhất mock homepage và project detail thành một ViewModel/data function.
2. Thiết kế CMS Project list/create/edit theo contract trong tài liệu này.
3. Viết migration tạo `cic_projects`, sau đó `cic_projects_en`, constraint và index.
4. Seed/import chỉ dữ liệu dự án được duyệt.
5. Validate list/filter/detail và section homepage ở cả VI/EN.
6. Khi chuyển Next.js, query server-side và mapper DB → Project ViewModel; không để component dùng raw row.

Không sửa PostgreSQL draft hoặc chạy migration trong bước tài liệu này.
