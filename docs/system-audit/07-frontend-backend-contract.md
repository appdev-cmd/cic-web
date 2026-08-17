# Contract frontend–backend đích

## 1. Quy tắc chung

- API dùng camelCase; database giữ nguyên snake_case/legacy name.
- DTO public không lộ raw workflow, trash snapshot, permission hoặc audit.
- Public query luôn enforce `published = true` và loại entity đã xóa.
- CMS DTO có raw editable fields, validation metadata và relation options theo quyền.
- Preview đọc Draft theo token/session CMS; không dùng public endpoint và không đổi trạng thái Publish.
- Relation được trả theo đúng thứ tự lưu. Entity liên quan draft/deleted/missing bị loại an toàn và có warning trong CMS.
- Rich text trả dạng sanitized HTML. Source HTML chỉ mở cho quyền CMS phù hợp.

## 2. Mapping nền tảng

| API field | Source | Loại |
|---|---|---|
| `id` | entity ID legacy/new | Column |
| `slug` | `alias` | MAP |
| `shortDescription` | `summary` | MAP |
| `contentHtml` | sanitized `content` | Rich Text |
| `thumbnail` | Media relation hoặc `image` legacy fallback | Relation/MAP |
| `published` | `published` | Column |
| `statusLabel` | published/time/account state | Computed |
| `seo` | entity SEO hoặc function SEO theo route | Compose |
| `breadcrumbs` | menu/route/entity title | Computed |

## 3. News detail

### Data-access boundary đã áp dụng cho React mockup

- `NewsView` đọc qua `getNewsData()`; route CMS đọc qua `getCmsNewsData(locale)`.
- Hai function hiện đọc mock data. Component không import trực tiếp các file mock và không biết vị trí raw fixture.
- Chưa tạo REST endpoint, HTTP client, repository interface hoặc backend giả. Khi chuyển Next.js, implementation của data function sẽ được thay bằng server-side data access/mapper.
- View model frontend vẫn dùng tên rõ nghĩa như `shortDesc`, `img`; PostgreSQL sau này vẫn giữ `summary`, `image`, `alias`, `content` và mapper chịu trách nhiệm chuyển đổi.
- CMS state tạo/sửa/xóa hiện chỉ phục vụ mockup. Server Action/service thật sẽ được nối sau khi chuyển Next.js; không giả lập persistence bằng HTTP trong React hiện tại.
- Sản phẩm, dự án và sự kiện liên quan không được suy từ keyword hoặc tự lấy item mới nhất. Chỉ hiển thị ID được chọn thủ công.

| Section/item | Nguồn cuối | Loại | Ghi chú |
|---|---|---|---|
| Breadcrumb | route + news category + title | Computed | Không lưu breadcrumb |
| Category | `category_id` → `cic_news_categories*` | Relation | Chỉ category Published |
| Title | `cic_news.title` | Column | |
| Slug | `cic_news.alias` | MAP | |
| Date | timestamp đã chốt theo module | Column + format | Frontend format locale |
| Author | `author_id` → user, fallback snapshot | Relation/compose | |
| Summary | `summary` | MAP | `shortDescription` trong DTO |
| Thumbnail | Media mapping hoặc `image` | Relation/fallback | |
| Body | `content` | Rich Text | Không tách heading/table/list |
| Tags | `tags` parse ổn định | MAP | |
| Attachment | `file_upload` + media/storage metadata | Column/relation | Size/type computed |
| Gallery/video | Media relation nếu có; nếu không nằm trong body | Relation/Rich Text | Không thêm URL columns theo mock |
| Related news/products | related legacy → ordered resolved entities | Relation adapter | Chọn thủ công |
| Share UI | current URL + title | Frontend-only | |
| SEO | news `seo_*`; fallback rule trong application | Column/compose | Không duplicate với Function SEO |

## 4. Product detail

| Section/item | Nguồn cuối | Loại | Ghi chú |
|---|---|---|---|
| Breadcrumb | menu + category relation + product | Computed | |
| Title/name | product name/title hiện có | Column | DTO chọn một canonical field theo source |
| Slug | `alias` | MAP | |
| Summary | `summary` | MAP | |
| Body/overview/features | content/legacy content fields đang dùng | Rich Text/MAP | Không tạo column theo từng tab chỉ vì UI |
| Thumbnail | product image → Media adapter | Column/relation | |
| Gallery | `cic_products_images*` ordered | Relation | |
| Category | product-category relation | Relation | Many-to-many nếu legacy hỗ trợ |
| Type | `cic_products_types*` | Relation | |
| Brand | `cic_manufactories*` | Relation | |
| Application | `cic_application*` | Relation | |
| Price/contact label | product/price tables + pricing rule | Column/compose | “Liên hệ” là presentation |
| Specifications | product tables/filter/value fields hiện có; fallback rich text | Relation/Rich Text | Chỉ structured nếu cần so sánh/filter |
| Video/document | legacy file/video + Media metadata | Column/relation | Không lưu file size lặp lại |
| CTA | CTA reference/config theo page/module | CTA module | Không thêm `cta_*` vào product |
| Related products | existing related/category logic có kiểm soát | Relation | Nếu marketing chọn thì giữ order, không auto featured |
| SEO | product `seo_*` | Column/compose | Function SEO chỉ là fallback cho route `/san-pham` |

## 5. Service detail

| Section/item | Nguồn cuối | Loại | Ghi chú |
|---|---|---|---|
| Breadcrumb/title/slug | route + `title` + `alias` | Column/computed | |
| Short description/tagline | `summary` | MAP | Không tạo tagline column trùng nghĩa |
| Thumbnail | `image`/Media | Column/relation | |
| Main sections | `content` | Rich Text | why/process/benefit/collaboration nằm trong body |
| Category badge/filter | Không có source đã chứng minh | Frontend-only hoặc bỏ | Không thêm DB |
| Related products | products-related source nếu có | Relation | Chọn thủ công, giữ order |
| Consultation form | Form reference theo page/module | Form module | Submission ghi source service ID |
| CTA/support contacts | CTA + system settings | CTA/settings | Không nhân vào service |
| SEO | service `seo_*` | Column/compose | |

## 6. Event detail

### Data-access boundary đã áp dụng cho React mockup

- Website list/detail gọi `getEventsData()`; `EventsView` không import trực tiếp `eventsData` hoặc `productsData`.
- CMS route gọi `getCmsEventsData(locale)` và truyền Events, News/Product relation options cùng Media images vào manager/form qua props.
- VI và EN độc lập; khi chưa có fixture EN, CMS trả dataset rỗng thay vì fallback VI.
- `editorial_status` là ViewModel suy từ `published`, không phải column mới. `created_time` là metadata thời gian tạo, không dùng làm lịch xuất bản.
- Mapper Next.js tương lai chịu trách nhiệm đổi `summary → shortDesc`, `content → longDesc/contentHtml`, `time_event → startDate`, `place → location`, `chu_de → eventType`, `image → img` và resolve relation có thứ tự.
- Các mock field `agenda`, `speakers`, `targetAudience` không tạo column riêng; nội dung biên tập nằm trong Rich Text. Gallery/document chỉ dùng Media relation khi có nguồn thật.

| Section/item | Nguồn cuối | Loại | Ghi chú |
|---|---|---|---|
| Breadcrumb/title/slug | route + title/alias | Column/computed | |
| Topic | `chu_de` | MAP | `eventType` DTO |
| Summary/body | `summary`, `content` | Column/Rich Text | |
| Thumbnail | `image`/Media | Column/relation | |
| Start/date label | `time_event`, `specific_time` | Column/format | Logic dùng time_event |
| End time | `end_time` | Column/map | Giá trị legacy phải qua cleanup; CMS mới ghi đúng nghĩa |
| Status | now so với start; ongoing chỉ khi có end thật | Computed | Không lưu manual status |
| Place/address | `place`, body nếu cần chi tiết | Column/Rich Text | |
| Registration CTA | `link_dangky` hoặc CTA reference tương lai | Column/CTA | `isOpenRegistration` computed |
| Agenda/speaker/audience | `content` | Rich Text | Không structured hóa lúc này |
| Gallery/documents | Media/file relation nếu có hoặc body | Relation/Rich Text | |
| Related event/news/product | existing related source | Relation adapter | Chọn thủ công |
| SEO | event `seo_*` | Column/compose | |

## 7. Static page

### Data-access boundary đã áp dụng cho React mockup

- Route CMS lấy `StaticPagesModuleData` qua `getCmsStaticPagesData(locale)`; manager/editor/entity picker/media picker không tự import raw Page Builder fixture.
- `sectionDefinitions` và giới hạn entity là registry do code sở hữu, không phải content lưu database.
- VI và EN là dataset độc lập. Khi chưa có fixture/template EN, danh sách EN rỗng và không dùng nội dung VI làm fallback hoặc seed ngầm.
- Draft/Publish hiện vẫn là local state phục vụ mockup. Backend tương lai phải validate template, section type/config, reference limit và transaction publish ở server.

| Section/item | Nguồn cuối | Loại | Ghi chú |
|---|---|---|---|
| Page identity/URL/template | Page table | Column | `template_key` quyết định component code |
| Fixed sections/order | Page template registry + section instances | Code + relation | Marketing không add/delete/change type |
| Text/image/video | section config + Media reference | JSON schema/relation | Không lưu layout/code |
| Legal/custom page title | section `legal.header` | Page config/MAP | Section tiêu đề cố định theo layout website |
| Legal/custom page body | `legal.content.richTextHtml` hoặc legacy contents `content` | Rich Text | Một body linh hoạt; không chia mỗi heading/đoạn thành section riêng |
| Product/news/service/project/partner highlights | ordered section references | Relation table | Chọn thủ công; không auto query |
| CTA | CTA ID/reference | CTA module | Không duplicate text/url nếu CTA reusable |
| Form | Form ID/reference | Form module | |
| SEO | page-level SEO; route fallback Function SEO | Column/compose | Không nhân đôi hai nguồn cùng cấp |
| Preview | draft revision | CMS-only | Public luôn published revision |

## 8. Contract response tối thiểu

```json
{
  "id": 123,
  "slug": "ten-noi-dung",
  "title": "Tên nội dung",
  "shortDescription": "Mapped từ summary",
  "contentHtml": "<p>Nội dung đã sanitize</p>",
  "thumbnail": {
    "id": null,
    "url": "/legacy/path.jpg",
    "alt": "Tên nội dung"
  },
  "published": true,
  "seo": {
    "title": "...",
    "description": "...",
    "keywords": "...",
    "canonicalUrl": "...",
    "indexable": true
  }
}
```

Đây là shape minh họa; field module-specific nằm trong DTO riêng, không tạo một DTO khổng lồ chứa mọi field.
