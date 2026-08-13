# Tương thích dữ liệu và backend — Sự kiện

> Trạng thái: Đã khảo sát CMS cũ, schema PostgreSQL và giao diện CMS mới; frontend đã được làm sạch, chưa triển khai backend hoặc migration.  
> Phạm vi: module **Sự kiện** tại `/cms/events`, dữ liệu VI/EN và các quan hệ nội dung liên quan.

## 1. Kết luận

Giữ giao diện Sự kiện hiện tại và sử dụng hai bảng legacy đã chuyển đổi tên sang PostgreSQL:

- VI: `cic_event`
- EN: `cic_event_en`

Về nghiệp vụ và các trường Marketing nhập, CMS mới bám theo form CMS cũ. Database/backend mới không bổ sung thêm nội dung bắt buộc; phần nâng cấp chủ yếu là:

- chuẩn hóa kiểu dữ liệu;
- chuẩn hóa quan hệ sự kiện/tin tức/sản phẩm liên quan;
- dùng Media thay cho nhập đường dẫn ảnh;
- liên kết người tạo/người sửa bằng user ID;
- dùng audit log và Thùng rác chung;
- bảo vệ Draft khỏi public website.

Module chỉ có hai trạng thái nội dung:

- `published = false`: Bản nháp.
- `published = true`: Đã xuất bản.

Không có gửi duyệt, chờ duyệt, phê duyệt, trả lại, từ chối hoặc người duyệt.

## 2. Nguồn dữ liệu legacy

| Workspace | Bảng MySQL cũ | Bảng PostgreSQL dự kiến | Số bản ghi trong export report |
|---|---|---|---:|
| VI | `fs_event` | `cic_event` | 37 |
| EN | `fs_event_en` | `cic_event_en` | 20 |

`migration_report.json` hiện còn báo `cic_event: ERROR`. Vì vậy số liệu export chứng minh có dữ liệu nguồn nhưng chưa chứng minh migration PostgreSQL đã chạy thành công.

## 3. Field Marketing sử dụng

### Thông tin sự kiện

| Field | Ý nghĩa | Cách xử lý |
|---|---|---|
| `id` | ID sự kiện | Giữ ID legacy khi migrate; API có thể serialize thành string |
| `title` | Tiêu đề sự kiện | Bắt buộc |
| `alias` | Phần đường dẫn sự kiện | Sinh từ tiêu đề nhưng cho phép sửa; duy nhất trong workspace |
| `chu_de` | Chủ đề | Giữ đúng tên legacy |
| `place` | Địa điểm | Text; có thể ghi địa điểm thực hoặc trực tuyến |
| `time_event` | Thời gian diễn ra | Timestamp có timezone |
| `specific_time` | Câu mô tả thời gian | Text phục vụ cách hiển thị legacy |
| `link_dangky` | Link đăng ký | URL; phải validate protocol/domain theo chính sách |
| `summary` | Tóm tắt | Text |
| `content` | Nội dung chi tiết | Rich text do CMS soạn; backend phải sanitize |
| `image` | Ảnh đại diện | UI chọn từ Media; dữ liệu cũ vẫn có thể là đường dẫn file |
| `tags` | Danh sách thẻ | UI dùng mảng, legacy lưu chuỗi |
| `ordering` | Thứ tự | Integer |

### Hiển thị và xuất bản

| Field | Ý nghĩa | Cách xử lý |
|---|---|---|
| `published` | Draft/Published | Nguồn trạng thái duy nhất ở database |
| `is_hot` | Sự kiện nổi bật | Boolean |
| `show_in_home` | Sự kiện lớn/hiển thị ở trang chủ | Boolean; giữ đúng field legacy |
| `created_time` | Thời gian tạo hoặc thời gian xuất bản legacy | Cần bảo toàn dữ liệu cũ; backend mới nên tách rõ audit timestamp nếu cần |
| `updated_time` | Thời gian cập nhật | Backend tự ghi |

Không tạo thêm `editorial_status` trong database. Frontend có thể dùng tên trạng thái hiển thị nhưng API map trực tiếp từ `published`.

### SEO và tích hợp

| Field | Ý nghĩa | Cách xử lý |
|---|---|---|
| `seo_title` | SEO title | Text |
| `seo_keyword` | SEO keyword legacy | Giữ để tương thích |
| `seo_description` | SEO description | Text |
| `tawk_to` | Dữ liệu tích hợp Tawk.to legacy | Giữ tương thích, hạn chế quyền và sanitize; không xếp như field SEO |

`tawk_to` không được trở thành cửa ngõ cho Marketing chèn JavaScript tùy ý. Backend phải áp dụng allowlist hoặc chỉ cho vai trò cấu hình phù hợp sửa.

### Nội dung liên quan

| Field legacy | UI hiện tại | Nghiệp vụ |
|---|---|---|
| `event_related` | Mảng event ID | Sự kiện liên quan được chọn thủ công |
| `news_related` | Mảng news ID | Tin tức liên quan được chọn thủ công |
| `products_related` | Mảng product ID | Sản phẩm liên quan được chọn thủ công |

Không có auto selection, latest hoặc tự suy diễn nội dung liên quan.

## 4. Field không đưa lên CMS mới

### Field legacy giữ tạm trong database

Các cột sau có thể còn trong schema/dữ liệu cũ nhưng không còn là field Marketing chỉnh:

| Field | Lý do không dùng trên UI mới |
|---|---|
| `category_id`, `category_alias`, `category_name`, `category_id_wrapper`, `category_alias_wrapper`, `category_published` | Sự kiện không có danh mục; code legacy đã comment lựa chọn category và còn trỏ nhầm news category |
| `parent_id` | Không có nghiệp vụ cây Sự kiện |
| `show_in_homepage` | Form thực tế dùng `show_in_home` |
| `is_new` | Input legacy đã bị comment; CMS mới không dùng |
| `end_time` | Code legacy ghi thời điểm cập nhật vào field này, không đáng tin là thời gian kết thúc sự kiện |
| `optimal_seo` | Cờ legacy không còn interaction tương ứng |
| `keywords`, `name` | Không phải field đang dùng trên form Sự kiện hiện hành |
| `editor` | Thay bằng user cập nhật và audit log chuẩn |

Không xóa ngay các cột này trong lần migration đầu. Backend không expose cho form; chỉ xem xét bỏ sau khi đối soát dữ liệu production và hết nhu cầu rollback.

### Field từng có trong mock CMS mới nhưng đã loại bỏ

- `organizer`
- `speakers`
- `registration_count`
- `max_seats`
- `event_status` lưu thủ công
- workflow `pending_review`, `approved`, `rejected`

Các field trên không tồn tại trong form/database legacy và chưa có requirement riêng nên không đưa vào backend contract.

## 5. Trạng thái diễn ra

Trạng thái “Sắp diễn ra/Đã diễn ra” là dữ liệu trình bày, được tính từ `time_event` tại thời điểm đọc:

```text
time_event > now  -> Sắp diễn ra
time_event <= now -> Đã diễn ra
```

Không lưu `event_status` vào `cic_event` để tránh trạng thái bị cũ hoặc mâu thuẫn với thời gian.

Hiện chưa có requirement “Hủy sự kiện”. Nếu sau này cần trạng thái hủy, phải chốt nghiệp vụ và ảnh hưởng public trước khi thêm field; không tự suy ra từ mock cũ.

## 6. Mapping kiểu dữ liệu tại API

| Dữ liệu | Frontend | PostgreSQL/legacy | Quy tắc API |
|---|---|---|---|
| `id` | string | integer | Serialize ID thành string nếu convention frontend yêu cầu; không đổi giá trị |
| `published` | boolean | boolean | `false` = Draft, `true` = Published |
| `tags` | `string[]` | `varchar(255)` | Trim, bỏ rỗng/trùng; serialize ổn định trong giai đoạn tương thích |
| `image` | Media item/ID | đường dẫn `varchar(255)` | API trả metadata Media; vẫn resolve được ảnh legacy |
| `time_event` | ISO datetime | `timestamptz` | Parse/trả ISO có timezone Asia/Ho_Chi_Minh phù hợp |
| Related fields | ID array có thứ tự | CSV ID | Đọc tương thích CSV; ghi qua bảng quan hệ sau khi chuẩn hóa |
| Người tạo/sửa | User display object | `author_id`, `author_last_id` và snapshot tên | Join `cic_users`; không lưu object vào event |
| Activity log | Danh sách log | Không thuộc bảng event | Đọc từ hệ thống audit chung |

## 7. Chuẩn hóa quan hệ liên quan

Không nên tiếp tục dùng CSV làm nguồn quan hệ lâu dài. Đề xuất ba bảng quan hệ:

- event ↔ event;
- event ↔ news;
- event ↔ product.

Mỗi bản ghi quan hệ tối thiểu cần:

- `event_id`;
- ID entity liên quan;
- `position`;
- timestamp/người tạo nếu convention chung yêu cầu.

Quy tắc:

- không trùng ID trong cùng nhóm;
- không cho sự kiện tự liên kết chính nó;
- giữ nguyên thứ tự Marketing đã chọn;
- entity phải tồn tại và thuộc đúng workspace;
- public chỉ trả entity đang Published và chưa bị xóa;
- entity không khả dụng được bỏ an toàn khỏi response, không làm lỗi toàn trang.

Trong giai đoạn chuyển đổi, có thể đọc fallback từ CSV legacy. Sau khi backfill và đối soát xong, bảng quan hệ trở thành source of truth; các cột CSV chỉ còn phục vụ rollback rồi mới xem xét bỏ.

## 8. Media

CMS mới chọn ảnh từ Thư viện media thay vì nhập text đường dẫn.

Giai đoạn tương thích:

- ảnh legacy tiếp tục đọc từ `image`;
- ảnh mới lưu reference tới Media theo kiến trúc Media được chốt;
- API trả URL/thumbnail đã resolve;
- không làm mất đường dẫn legacy khi chưa migrate file;
- khi asset bị xóa, public dùng fallback an toàn và CMS cảnh báo.

Không tự thêm cột Media vào schema trước khi rà soát module Thư viện media.

## 9. Người tạo, người sửa và audit

Mapping:

| API | Legacy/PostgreSQL |
|---|---|
| `created_by.id` | `author_id` |
| `created_by.name` | Join user; fallback `author` |
| `updated_by.id` | `author_last_id` |
| `updated_by.name` | Join user; fallback `author_last` |
| `created_at` | `created_time` |
| `updated_at` | `updated_time` |

Activity log không lưu thành JSON trong `cic_event`. Dùng kiến trúc chung tại `activity-audit-log-data-plan.md` với các action tối thiểu:

- `event.created`
- `event.draft_saved`
- `event.published`
- `event.unpublished`
- `event.updated`
- `event.deleted`
- `event.restored`

Không có action gửi duyệt/phê duyệt.

## 10. API contract tối thiểu

### CMS

- Danh sách: search tiêu đề, Draft/Published, trạng thái diễn ra được tính, sort và pagination.
- Lấy chi tiết theo ID.
- Tạo bản nháp.
- Cập nhật bản nháp.
- Xuất bản/chuyển về nháp.
- Preview dữ liệu chưa xuất bản theo quyền CMS.
- Tìm và chọn thủ công sự kiện/tin tức/sản phẩm liên quan.
- Xóa qua cơ chế Thùng rác, không hard-delete trực tiếp.

Backend phải validate:

- `title`, `time_event`, `content` bắt buộc theo form hiện tại;
- alias hợp lệ và duy nhất trong workspace;
- URL đăng ký hợp lệ;
- media/reference tồn tại;
- related ID đúng module, đúng workspace, không trùng và không tự tham chiếu;
- user có quyền tạo, sửa, xuất bản hoặc xóa;
- rich text và `tawk_to` được sanitize đúng chính sách.

### Public

- Chỉ trả `published = true` và bản ghi chưa bị xóa.
- Không có tham số cho phép đọc Draft.
- Preview dùng endpoint CMS có xác thực, không dùng public API.
- Related entity được batch-load để tránh N+1.
- Related entity unpublished/deleted được bỏ an toàn.
- Không trả raw audit, dữ liệu Thùng rác, author nội bộ hoặc config tích hợp nhạy cảm.

## 11. VI và EN

Hai workspace độc lập:

- VI dùng `cic_event`.
- EN dùng `cic_event_en`.

Không auto-translate, không fallback tự động và không nối record VI/EN chỉ vì cùng ID. Mọi search, uniqueness của alias, relation và permission đều phải áp dụng trong đúng workspace.

## 12. Migration

Trình tự logic khi triển khai sau này:

1. Xác minh và sửa nguyên nhân `cic_event: ERROR` trong migration report.
2. Import giữ nguyên ID và dữ liệu VI/EN.
3. Chuẩn hóa sentinel/null và boolean.
4. Đối soát ảnh/file legacy.
5. Parse các CSV related, bỏ ID lỗi/trùng nhưng giữ thứ tự.
6. Backfill bảng quan hệ mới.
7. So sánh số lượng bản ghi và các Page public quan trọng.
8. Chỉ chuyển source of truth sang bảng quan hệ sau khi kiểm tra đạt.

Không coi `end_time` legacy là thời gian kết thúc sự kiện và không tạo dữ liệu organizer/speaker từ suy đoán.

## 13. Acceptance criteria

- Form chỉ có Lưu nháp và Xuất bản; không còn workflow duyệt.
- Không còn danh mục Sự kiện.
- Field Marketing sử dụng khớp form legacy thực tế.
- Không có field mock-only trong API/database contract.
- Database dùng `published` làm nguồn trạng thái duy nhất.
- Trạng thái diễn ra được tính từ `time_event`, không lưu tay.
- Related IDs giữ đúng thứ tự qua vòng đọc–ghi.
- Public không đọc Draft hoặc mục trong Thùng rác.
- Preview CMS đọc Draft theo quyền.
- Media legacy và Media mới đều resolve an toàn.
- VI/EN không bị trộn dữ liệu.
- Audit dùng bảng chung, không nhồi vào event.
- Dữ liệu legacy chưa dùng vẫn được bảo toàn trong lần migration đầu.
- Migration `cic_event` được chạy lại và đối soát trước production.
