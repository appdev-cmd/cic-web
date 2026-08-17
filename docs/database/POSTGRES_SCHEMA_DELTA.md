# PostgreSQL Schema Delta

Tài liệu này chỉ tổng hợp những thay đổi cần bổ sung vào PostgreSQL hiện tại sau từng đợt audit. Đây không phải tài liệu mô tả toàn bộ schema, không chứa migration SQL và không thay thế bước profiling dữ liệu legacy.

## Tin tức

### Bảng hiện có cần mở rộng

Không có field nghiệp vụ mới cần thêm. `cic_news` và `cic_news_en` đã đáp ứng contract hiện tại của CMS/website mới.

| Table | Field thêm | Type | FK | Index | Mức độ | CMS mới sử dụng | Ghi chú |
| ----- | ---------- | ---- | -- | ----- | ------ | --------------- | ------- |
| `cic_news` | Không thêm field | — | — | Unique index trên alias chuẩn hóa | **BẮT BUỘC** | Kiểm tra alias khi tạo/sửa bài; website tra cứu bài VI theo alias | Chỉ tạo index sau khi profiling NULL, chuỗi rỗng, khoảng trắng, khác biệt hoa/thường và alias trùng. Có thể dùng partial unique index trong giai đoạn chuyển tiếp. |
| `cic_news_en` | Không thêm field | — | — | Unique index trên alias chuẩn hóa | **BẮT BUỘC** | Kiểm tra alias khi tạo/sửa bài; website tra cứu bài EN theo alias | Profiling độc lập dataset EN trước khi áp dụng; không ép `alias NOT NULL` trong migration đầu nếu dữ liệu legacy chưa đạt. |

### Bảng mới cần tạo

Không có.

### Mapping / lưu ý

- `shortDesc → summary`, `contentMarkdown → content`, `img → image`, `date → created_time`, `views → hits`; thời gian đọc và kích thước file là dữ liệu derived.
- Tác giả lấy qua `author_id`/`author_last_id → cic_users`; chuỗi `author` cũ được giữ làm snapshot/fallback. Không thêm field tác giả mới.
- `news_related` và `products_related` hiện đủ cho compatibility với dữ liệu cũ. Chưa tạo bảng relation chỉ để chuẩn hóa schema; chỉ audit lại nếu backend phát sinh nhu cầu query, sắp thứ tự hoặc bảo đảm toàn vẹn quan hệ độc lập.
- Không thêm `image_alt`, `image_caption`, `timezone`, các field version, activity hoặc trash vào bảng News. Đây là mock/UI concern hoặc thuộc shared entity nếu chức năng dùng chung được duyệt.
- Không thêm các field subtype fixture như `salary`, `deadline`, `programName`, `pdfSize`. Chưa có CMS write contract; nội dung thông thường tiếp tục dùng Rich Text hoặc metadata/file hiện có.
- Cần sửa FK hiện có `cic_news_en.category_id` từ `cic_news_categories(id)` sang `cic_news_categories_en(id)` sau khi kiểm tra orphan. Đây là sửa constraint sai workspace, không phải ADD field/table.

## Danh mục tin tức

### Bảng hiện có cần mở rộng

Không có field nghiệp vụ mới cần thêm. `cic_news_categories` và `cic_news_categories_en` đã đáp ứng contract hiện tại của CMS mới.

| Table | Field thêm | Type | FK | Index | Mức độ | CMS mới sử dụng | Ghi chú |
| ----- | ---------- | ---- | -- | ----- | ------ | --------------- | ------- |
| `cic_news_categories` | Không thêm field | — | — | Unique index trên alias chuẩn hóa | **BẮT BUỘC** | Validation alias; website tra cứu danh mục VI | Chỉ tạo sau khi xử lý NULL/rỗng/trùng và ngoại lệ legacy. |
| `cic_news_categories_en` | Không thêm field | — | — | Unique index trên alias chuẩn hóa | **BẮT BUỘC** | Validation alias; website tra cứu danh mục EN | Profiling độc lập dataset EN trước khi áp dụng. |

### Bảng mới cần tạo

Không có.

### Mapping / lưu ý

- `name`, `title`, `alias`, `summary`, `parent_id`, `ordering`, `image`, trạng thái hiển thị và SEO đã có; không tạo field trùng nghĩa theo tên của ViewModel mới.
- Số bài trong danh mục được tính bằng `COUNT(cic_news.id)` theo `category_id`; không lưu column `count`.
- Cần sửa FK hiện có `cic_news_categories_en.parent_id` từ `cic_news_categories(id)` thành self-reference `cic_news_categories_en(id)` sau khi kiểm tra orphan, sentinel `0`, self-reference và cycle. Đây là sửa constraint sai workspace, không phải ADD field/table.

## Tổng hợp đợt audit

- Field mới bắt buộc: **0**.
- Bảng mới bắt buộc: **0**.
- Index mới bắt buộc: **4 unique index alias**, chỉ áp dụng sau data profiling.
- Constraint hiện có cần sửa: **2 FK của workspace EN đang trỏ sang bảng VI**.
