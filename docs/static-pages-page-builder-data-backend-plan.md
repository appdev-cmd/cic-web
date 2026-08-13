# Trang nội dung — thiết kế dữ liệu và backend Page Builder

> Phạm vi: module **Trang nội dung** tại `/cms/static-pages`.  
> Trạng thái: tài liệu thiết kế cho chức năng mới; frontend hiện dùng mock, chưa có database/API thật.  
> Nguyên tắc: đây là Section-Based Page Builder cho các trang đã có thiết kế, không phải Website Builder hoặc Landing Page Builder.

## 1. Kết luận kiến trúc

Trang nội dung mới không tiếp tục mô hình bài viết HTML của `fs_contents`/`cic_contents`.

- Mỗi Page dùng một template được code định nghĩa.
- Template quyết định chính xác Page có những Section nào và thứ tự Section.
- Marketing chỉ sửa config được cho phép và chọn dữ liệu liên kết.
- Không có Add Section, Delete Section hoặc đổi `section_type`.
- Không cho chỉnh layout, grid, responsive, typography, spacing, CSS hoặc source code.
- Chỉ có hai trạng thái làm việc: **Draft** và **Published**; không có bước duyệt.
- Preview đọc Draft; website công khai chỉ đọc Published.

Các component React và thiết kế website hiện tại tiếp tục là source of truth.

## 2. Phạm vi Page

### Page thiết kế riêng, do hệ thống định nghĩa

| Code | Đường dẫn | Template | Có được tạo/xóa trong CMS? |
|---|---|---|---|
| `home` | `/` | `home` | Không |
| `about` | `/gioi-thieu` | `about` | Không |
| `organization` | `/gioi-thieu/co-cau-to-chuc` | `organization` | Không |
| `capacity_experience` | `/gioi-thieu/nang-luc-kinh-nghiem` | `capacity_experience` | Không |
| `contact` | `/lien-he` | `contact` | Không |
| `privacy_policy` | `/chinh-sach-bao-mat` | `legal_standard` | Không |
| `terms_of_use` | `/dieu-khoan-su-dung` | `legal_standard` | Không |

`contact` đã có trong mock gốc nhưng hiện chưa được đưa vào danh sách Page của CMS. Khi hoàn thiện mock/frontend phải bổ sung lại Page này, không tạo một thiết kế Liên hệ mới.

### Page nội dung có thể tạo thêm

CMS chỉ cho tạo Page mới theo template `legal_standard`, cùng kiểu thiết kế với Chính sách bảo mật và Điều khoản sử dụng.

- Người dùng nhập tên Page.
- Hệ thống sinh slug ngắn từ tên.
- Nếu trùng, thêm hậu tố `-2`, `-3`...
- Page mới bắt đầu ở Draft và chỉ có link công khai sau khi Publish.
- Người dùng không được chọn template tùy ý.

## 3. Mô hình dữ liệu đề xuất

### `pages`

Lưu định danh và quy tắc cố định của Page:

| Trường | Ý nghĩa |
|---|---|
| `id` | Khóa chính |
| `workspace` | Dataset độc lập, ví dụ `vi`, `en` |
| `code` | Mã ổn định để code/frontend tìm Page |
| `name` | Tên hiển thị trong CMS |
| `slug` | Đường dẫn duy nhất trong workspace |
| `page_type` | Loại Page nghiệp vụ |
| `template_key` | Template component đã được deploy |
| `system_defined` | Page cố định của hệ thống hay Page legal được tạo thêm |
| `draft_version_id` | Version Draft hiện tại |
| `published_version_id` | Version đang công khai; có thể null |
| `created_at`, `created_by` | Dấu vết tạo |
| `updated_at`, `updated_by` | Dấu vết cập nhật |

Ràng buộc cần có:

- `(workspace, code)` duy nhất.
- `(workspace, slug)` duy nhất.
- Không cho API thay `template_key`, `page_type` hoặc `system_defined` của Page hệ thống.
- Page hệ thống không được xóa.

### `page_versions`

Lưu snapshot nội dung của từng lần Save Draft/Publish:

| Trường | Ý nghĩa |
|---|---|
| `id` | Khóa chính version |
| `page_id` | Page sở hữu version |
| `version_number` | Số tăng dần trong Page |
| `state` | `draft` hoặc `published` |
| `seo_title` | SEO title của Page |
| `seo_description` | SEO description của Page |
| `created_at`, `created_by` | Người và thời điểm tạo version |
| `published_at`, `published_by` | Có giá trị khi version được Publish |

Publish phải tạo/cố định một snapshot Published, không để public đọc trực tiếp bản Draft đang tiếp tục chỉnh.

### `page_sections`

Lưu Section instance thuộc một version:

| Trường | Ý nghĩa |
|---|---|
| `id` | Khóa chính |
| `page_version_id` | Version chứa Section |
| `section_key` | Vị trí nghiệp vụ ổn định, ví dụ `home.hero` |
| `section_type` | Loại component do code định nghĩa |
| `position` | Thứ tự cố định theo template |
| `config` | JSON config đã validate theo `section_type` |

`config` chỉ chứa dữ liệu như text, media ID, CTA ID, form ID và các thuộc tính nội dung được component hỗ trợ. Không chứa HTML layout, CSS, JSX, JavaScript hoặc source component.

Backend không nhận tùy ý danh sách Section từ client. Khi Save Draft, backend đối chiếu danh sách Section với registry template trong code và từ chối nếu:

- thiếu hoặc thừa Section;
- thay đổi `section_key`/`section_type`;
- thay đổi thứ tự cố định;
- config có field không được khai báo;
- config sai kiểu, thiếu field bắt buộc hoặc vượt giới hạn thiết kế.

### `page_section_references`

Lưu entity được Marketing chọn thủ công:

| Trường | Ý nghĩa |
|---|---|
| `id` | Khóa chính |
| `page_section_id` | Section sử dụng dữ liệu |
| `entity_type` | `product`, `news`, `service`, `project`, `partner`, `event` |
| `entity_id` | ID bản ghi module tương ứng |
| `position` | Thứ tự hiển thị do Marketing sắp xếp |

Không có `query`, `latest`, `featured`, `auto_select` hoặc rule lấy tự động.

Backend phải kiểm tra:

- entity tồn tại và đúng loại;
- không trùng entity trong cùng Section;
- số lượng không vượt giới hạn template;
- `position` liên tục và không trùng;
- khi Publish, entity tham chiếu phải đang Published/khả dụng.

Không nên tạo một FK đa hình giả tới nhiều bảng. Backend kiểm tra theo `entity_type`; nếu cần tính toàn vẹn mạnh hơn có thể tách bảng reference theo module ở giai đoạn thiết kế schema chi tiết.

## 4. Section registry trong code

Backend và frontend cần dùng cùng một contract version cho registry:

```text
template_key
  -> section_key
      -> section_type
      -> position
      -> config schema
      -> entity types được phép
      -> giới hạn số entity
```

Ví dụ:

```json
{
  "sectionKey": "home.news",
  "sectionType": "news_highlight",
  "position": 8,
  "configSchema": {
    "title": "string|required|max:120"
  },
  "references": {
    "news": { "max": 3, "manualOnly": true }
  }
}
```

Registry nằm trong code và được deploy cùng component. Database không phải nơi tạo Section hay layout mới.

## 5. API contract dự kiến

### CMS

- `GET /api/cms/pages` — danh sách Page trong workspace.
- `GET /api/cms/pages/{id}/draft` — lấy Draft để chỉnh sửa.
- `PUT /api/cms/pages/{id}/draft` — validate và lưu Draft.
- `GET /api/cms/pages/{id}/preview` — payload Preview từ Draft.
- `POST /api/cms/pages/{id}/publish` — validate toàn bộ rồi tạo Published snapshot.
- `POST /api/cms/pages` — chỉ tạo Page `legal_standard`.
- `GET /api/cms/page-builder/entities?type=news&search=...` — tìm entity để chọn thủ công.

Request Save Draft chỉ gửi config và reference có thể chỉnh. Backend lấy template registry làm chuẩn, không tin `section_type` do client gửi.

### Public website

- `GET /api/public/pages/by-code/{code}`
- hoặc `GET /api/public/pages/by-slug?slug=...`

Public API:

- chỉ trả `published_version_id`;
- trả 404 nếu Page chưa từng Publish;
- không nhận cờ `draft=true`;
- loại an toàn reference đã bị xóa/unpublish và không làm lỗi toàn Page;
- có thể hydrate entity theo batch để tránh N+1.

Preview phải dùng endpoint CMS có xác thực và quyền, không dùng public endpoint.

## 6. Permission tối thiểu

| Quyền | Hành động |
|---|---|
| `static_pages.view` | Xem danh sách và Published |
| `static_pages.edit` | Đọc/sửa Draft và chọn entity |
| `static_pages.preview` | Xem Preview Draft |
| `static_pages.publish` | Publish |
| `static_pages.create_legal` | Tạo Page theo `legal_standard` |

Không có quyền thêm/xóa Section hoặc chỉnh template vì các thao tác đó không tồn tại trong API.

## 7. Xử lý dữ liệu CMS cũ

`cic_contents`, `cic_contents_en` và các bảng category là dữ liệu legacy kiểu bài viết HTML. Chúng không được dùng làm bảng cho Page Builder mới.

- Giữ bảng legacy trong giai đoạn đối chiếu và lưu trữ.
- Không map `content` HTML thành `page_sections.config` tự động.
- Nội dung còn giá trị được nhập/chuyển thủ công vào đúng field của Section.
- Không chuyển các field không còn nghiệp vụ như rating, hits, tags, display flags vào Page Builder.
- SEO legacy chỉ dùng làm nguồn đối chiếu khi khởi tạo SEO cho Page tương ứng.
- VI và EN là hai workspace độc lập; không fallback hoặc tự dịch.

Sau khi xác nhận toàn bộ nội dung cần giữ đã được Publish trong hệ thống mới, việc archive/drop bảng legacy là một quyết định migration riêng, không thuộc implementation Page Builder.

## 8. Luồng hoạt động

1. CMS lấy Draft của Page.
2. Người dùng click Section trên giao diện trực tiếp.
3. CMS chỉ hiển thị form config được registry cho phép.
4. Entity nổi bật được tìm, chọn thủ công và sắp xếp.
5. Save Draft gọi backend validation; website chưa thay đổi.
6. Preview đọc đúng Draft trong phiên CMS.
7. Publish kiểm tra config, giới hạn và trạng thái reference.
8. Backend tạo Published snapshot trong transaction.
9. Public website đọc Published snapshot và hydrate entity theo batch.

## 9. Phần frontend hiện tại cần hoàn thiện sau

- Bổ sung Page Liên hệ vào danh sách mock đang chạy.
- Làm cho Home/About/Organization/Capacity thực sự render từ Section config; hiện canvas chủ yếu đang bọc component hard-code.
- Thay state/mock bằng API adapter nhưng giữ nguyên UI hiện tại.
- Chuyển validation hiện có thành validation dùng chung với backend contract.
- Hiển thị rõ entity bị xóa/unpublish và chặn Publish cho đến khi thay thế.
- Kiểm tra responsive trực tiếp ở desktop/tablet/mobile bằng component website thật.

## 10. Phần legacy frontend đã loại bỏ

Đã loại bỏ nhánh Trang nội dung trung gian không còn được route sử dụng, gồm generic template/Section, workflow duyệt, quick edit, used-by, version drawer và mock category cũ.

Vẫn giữ:

- `RichTextEditor.tsx` vì các module nghiệp vụ khác đang dùng chung.
- `PageMediaPickerModal.tsx` vì Tin tức, Sản phẩm, Dịch vụ và Sự kiện đang dùng chung.
- Toàn bộ file `PageBuilder*`, `pageBuilderData.ts`, `pageBuilderTypes.ts` và mock Page Builder hiện hành.

## 11. Tiêu chí nghiệm thu backend sau này

- Draft không xuất hiện trên public website.
- Preview hiển thị Draft có xác thực.
- Publish tạo snapshot nhất quán.
- Không API nào thêm/xóa Section hoặc đổi `section_type`.
- Config sai schema bị backend từ chối.
- Giới hạn entity được backend enforce.
- Không có Auto selection.
- Thứ tự entity được lưu và trả đúng.
- Reference không khả dụng được xử lý an toàn.
- Public load Page không phát sinh N+1.
- Không lưu layout/source code trong database.
- Không thay đổi design và responsive của component website hiện tại.
