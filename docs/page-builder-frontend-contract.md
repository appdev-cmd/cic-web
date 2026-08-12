# TRANG NỘI DUNG — PAGE BUILDER FRONTEND CONTRACT

> Phạm vi: contract tạm thời cho frontend/CMS và mock data.  
> Chưa triển khai database, backend, migration hoặc API thật.  
> Source of truth giao diện: các component website hiện tại.

## A. Data model đề xuất

### Page

Một Page là một trang chính/nội dung tĩnh do module **Trang nội dung** quản lý.

Phạm vi giao diện hiện tại gồm hai nhóm:

- Thiết kế riêng, do code định nghĩa: Trang chủ, Giới thiệu, Cơ cấu tổ chức, Năng lực & Kinh nghiệm.
- Template nội dung chuẩn dùng chung: Chính sách bảo mật, Điều khoản sử dụng và các trang do CMS tạo mới. Trang mới chỉ nhập nội dung/config trong các section cố định của template; hệ thống sinh slug/link riêng sau khi xuất bản.

CMS không cho tạo thêm trang thuộc nhóm thiết kế riêng. Việc tạo trang mới chỉ áp dụng cho template `legal_standard`, không đồng nghĩa với Add Section hoặc Custom Layout.

```ts
type Page = {
  id: string;
  code: "home" | "about" | "contact" | "privacy_policy";
  slug: string;
  name: string;
  pageType: "home" | "about" | "contact" | "legal";
  draft: PageVersion;
  published: PageVersion | null;
};
```

`code` và `pageType` xác định Page Definition trong code. Marketing không được đổi hai giá trị này.

### PageVersion

```ts
type PageVersion = {
  version: number;
  status: "draft" | "published";
  updatedAt: string;
  publishedAt?: string;
  seo: {
    title: string;
    description: string;
    imageId?: string;
  };
  sections: PageSection[];
};
```

`draft` và `published` là hai snapshot độc lập. Chỉnh Draft không làm thay đổi Published.

### PageSection

```ts
type PageSection = {
  id: string;
  sectionKey: string;
  sectionType: string;
  position: number;
  config: Record<string, JSONValue>;
  references?: SectionReference[];
};
```

- `sectionKey`, `sectionType` và `position` được Page Definition trong code quy định.
- CMS chỉ cập nhật `config` và `references` mà Section cho phép.
- Không hỗ trợ thêm Section, xóa Section, đổi loại hoặc kéo thả thứ tự Section.
- `config` chỉ chứa JSON data; không chứa HTML, CSS, JSX, class name hoặc layout rule.

### SectionReference

```ts
type SectionReference = {
  entityType: "product" | "news" | "service" | "project" | "partner" | "event";
  entityIds: string[];
};
```

Thứ tự phần tử trong `entityIds` là thứ tự hiển thị. CMS chỉ có entity picker thủ công và thao tác đổi thứ tự các entity đã chọn. Không có `latest`, `featured`, filter tự động hoặc auto-query.

`event` được giữ vì Trang chủ hiện có Section Sự kiện. Đây là phản ánh thiết kế hiện tại, không phải Section được bổ sung bởi Page Builder.

### Page Definition nằm trong code

| Page | Section cố định |
|---|---|
| Trang chủ | Hero, Giới thiệu ngắn, Thống kê, Giải thưởng, Hệ sinh thái công nghệ, Dự án tiêu biểu, Sự kiện, Tin tức, Đối tác, CTA liên hệ |
| Giới thiệu | Hero, Tổng quan, Timeline, Định hướng chiến lược, Sản phẩm/Dịch vụ cung cấp, Giải thưởng, Đối tác, Cơ cấu tổ chức, Năng lực, Hợp đồng/kinh nghiệm, Đối tác phần mềm, Đối tác thiết bị, CTA liên hệ |
| Liên hệ | Header, Chi nhánh/bản đồ, Form liên hệ, Thông báo bảo mật |
| Chính sách bảo mật | Legal header, 5 mục chính sách, Hỗ trợ pháp lý |

## B. Mock JSON

Mock dùng cho frontend/CMS nằm tại:

`src/cms/modules/static_pages/pageBuilderMockData.json`

Quy ước:

- Có đúng bốn Page: Trang chủ, Giới thiệu, Liên hệ và Chính sách bảo mật.
- Mỗi Page có `draft` và `published` riêng.
- Draft có thể khác Published để kiểm tra Preview.
- Mảng ID reference đã được sắp theo thứ tự hiển thị.
- Mock không được hiểu là API hoặc persistence production.

## C. API contract dự kiến

### Đọc Published cho website

```http
GET /api/public/pages/{code-or-slug}
```

Response `200`:

```json
{
  "data": {
    "id": "page_home_vi",
    "code": "home",
    "slug": "/",
    "name": "Trang chủ",
    "pageType": "home",
    "version": 3,
    "status": "published",
    "seo": {},
    "sections": []
  }
}
```

Endpoint public chỉ trả Published. Nếu Page chưa publish, trả `404`.

### Đọc Draft cho CMS và Preview

```http
GET /api/cms/pages/{pageId}/draft
```

Response trả Page metadata và toàn bộ draft snapshot. CMS editor và Preview dùng cùng payload này.

### Cập nhật Draft

```http
PUT /api/cms/pages/{pageId}/draft
Content-Type: application/json
```

Request:

```json
{
  "version": 4,
  "seo": {
    "title": "CIC Technology",
    "description": "Giải pháp công nghệ cho ngành xây dựng"
  },
  "sections": [
    {
      "id": "home_projects",
      "sectionKey": "home.projects",
      "sectionType": "project_highlight",
      "position": 6,
      "config": {
        "title": "Dự án tiêu biểu",
        "subtitle": "Các dự án nổi bật của CIC"
      },
      "references": [
        {
          "entityType": "project",
          "entityIds": ["project_03", "project_01", "project_02"]
        }
      ]
    }
  ]
}
```

Backend sau này phải từ chối nếu request:

- thiếu hoặc thừa Section so với Page Definition;
- đổi `sectionKey`, `sectionType` hoặc `position`;
- chứa HTML/source code;
- dùng sai entity type;
- vượt số lượng item của Section;
- tham chiếu entity không tồn tại.

Response `200` trả draft snapshot đã lưu và version mới. `409` khi `version` cũ để tránh ghi đè thay đổi của người khác.

### Preview Draft

```http
GET /api/cms/pages/{pageId}/preview
```

Response có cùng shape với public Page nhưng lấy Draft và có `status: "draft"`. Preview phải dùng cùng Page Renderer/Section component với website, không dựng layout preview riêng.

### Publish

```http
POST /api/cms/pages/{pageId}/publish
Content-Type: application/json

{
  "draftVersion": 5
}
```

Response `200` trả published snapshot mới. Publish sao chép snapshot Draft hợp lệ thành Published; không để website đọc trực tiếp object Draft.

## D. Luồng hoạt động

```text
CMS mở Trang nội dung
  → GET Draft
  → sửa các config/reference được Section cho phép
  → PUT Draft
  → GET Preview (render bằng component website thật)
  → POST Publish
  → Published snapshot được thay thế nguyên tử
  → website GET Published theo code/slug
```

Các invariant bắt buộc:

1. Save Draft không ảnh hưởng website.
2. Preview chỉ đọc Draft.
3. Website chỉ đọc Published.
4. Publish chỉ thành công khi toàn bộ Page đúng Page Definition và config schema.
5. Marketing chỉ chọn thủ công entity và sắp xếp entity trong Section được hỗ trợ.
6. Muốn đổi layout hoặc thêm Section phải thay component/Page Definition trong code và deploy.
