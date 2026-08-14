# Mức độ sẵn sàng cho Next.js Fullstack

> Trạng thái: định hướng sau khi hoàn thiện React mockup. Không triển khai Next.js trong giai đoạn hiện tại.

## Kiến trúc hiện tại

Project là React + Vite. Website và CMS đang dùng mock data để hoàn thiện giao diện. PostgreSQL là database đích nhưng chưa được kết nối runtime. Kiến trúc phù hợp trong giai đoạn này là:

```text
Page / Feature
      ↓
Data-access function + mapper khi cần
      ↓
Mock fixture
```

Không tạo REST API/backend giả chỉ để mô phỏng kiến trúc tương lai.

## Quyết định giữ để hỗ trợ refactor

- UI dùng ViewModel rõ nghĩa; không ép tên field giống PostgreSQL.
- Mock được gom sau data-access function theo từng feature khi module được triển khai.
- Rich Text tiếp tục là một content field cho nội dung bài viết thông thường.
- Relation quan trọng dùng ID/entity selection; không suy tự động bằng keyword/latest.
- Interactive state ở component; dữ liệu đọc và mapping tách khỏi component khi hợp lý.
- Không đổi layout, section, responsive hoặc design để phục vụ kiến trúc.

## Documentation gate trước mỗi module

Trước khi sửa một module, đối chiếu theo thứ tự: audit hiện trạng → field mapping → target database/schema decision → frontend/backend contract → implementation hiện tại. Nếu phát hiện sai hoặc thiếu nguồn dữ liệu, cập nhật tài liệu trong `docs/system-audit/` trước rồi mới thay code. Chỉ field được phân loại ADD và được duyệt mới có thể đi vào migration; mock/UI không phải bằng chứng thêm schema.

Sau khi sửa, kiểm tra CMS list/create/edit/detail, frontend list/detail nếu có, relation/media/SEO/Rich Text, mock fallback, locale/workspace, migration compatibility, typecheck và build. Một module chỉ được đánh dấu hoàn thành khi các điểm này có nguồn rõ ràng và UI không thay đổi đáng kể.

## Tình trạng module

### Boundary tốt

| Module | Boundary hiện tại | Ghi chú |
|---|---|---|
| News website | `getNewsData()` | `NewsView` không import mock; relation liên quan chọn thủ công |
| News CMS | `getCmsNewsData(locale)` | list/form/category/media nhận data qua props/data function |
| Static Pages CMS | `getCmsStaticPagesData(locale)` | Page/entity/media đi qua một boundary; registry section cố định nằm trong code |
| Events website | `getEventsData()` | list/detail và product relation không import raw fixture trong component |
| Events CMS | `getCmsEventsData(locale)` | list/form/relation/media nhận dataset theo workspace qua props |
| Products website | `getProductsData()` | catalog/detail/search và các consumer liên quan không import raw product fixture trong component |
| Products CMS | `ProductsModuleData` | list/form nhận product, taxonomy, relation option và audit data qua demo data source |
| Product Settings CMS | `ProductTaxonomyModuleData` + `ProductSettingsGlobalData` | taxonomy, người phụ trách, product option và usage impact nhận qua Catalog data source; không giữ routing email/history giả trong contract |
| Services website | `getServicesData()` | list/detail/search không import fixture trực tiếp; `shortDesc` là ViewModel của `summary`, nội dung dài giữ trong Rich Text |
| Services CMS | `ServicesModuleData` | list/form/preview nhận dataset theo workspace qua Editorial data source; workflow chỉ còn Draft/Published |
| Frontend Menus website | `getNavigationData()` | Header/Footer nhận navigation qua một boundary; giữ nguyên nhãn, thứ tự, dropdown và hành vi điều hướng hiện tại |
| Frontend Menus CMS | `MenuModuleData` | group/item/validation/version/log nhận theo workspace qua Presentation data source; trạng thái chỉ còn Draft/Published |

### Còn import mock trực tiếp hoặc qua demo source tổng hợp

- CMS Dashboard và các module Media, Users, Permissions, Settings, Activity Logs, Trash, Contacts.
- CTA, Forms, Customer Requests và Email Templates còn import fixture trực tiếp ở manager/editor.
- Function SEO và Translation Strings còn import mock trực tiếp.
- Static Pages vẫn dùng fixture phía sau data function; EN không fallback sang Page VI và chưa được tạo legal page khi chưa có template EN được duyệt.
- Website Home (bao gồm event/service highlight riêng), Project và một số section liên quan còn đọc trực tiếp `src/web/data/**`.

Các module này được xử lý lần lượt theo thứ tự triển khai đã chốt; không refactor hàng loạt.

## Phân chia Server/Client sau này

### Nên là Server Component hoặc server-rendered page

- Public list/detail của News, Product, Service, Event và Static Page.
- Header/Footer/Menu/Breadcrumb sau khi lấy menu/settings.
- SEO metadata theo route/entity.
- Section Page Builder chỉ render dữ liệu Published.
- CMS read-only summary ban đầu nếu không phụ thuộc browser state.

### Cần Client Component

- Search/filter/pagination tương tác tại client khi không đi qua URL/server query.
- Form create/edit, Rich Text Editor, media/entity picker.
- Modal, drawer, slider, tabs, dropdown, drag/reorder.
- Bulk selection/action và interactive table settings.
- Preview canvas có tương tác trực tiếp.

Không nên đặt toàn bộ page thành Client Component chỉ vì một modal/filter; phần tương tác có thể tách thành island riêng.

## Phần cần Service/Repository khi chuyển Next.js

- Permission và scope enforcement.
- Draft/Preview/Publish transaction.
- Page Builder revision/config validation/reference resolution.
- Media upload, variant, replacement và usage check.
- Form submission, Customer Request, Email Template routing.
- Activity Log và Trash restore/purge.
- Quan hệ legacy dạng CSV cần compatibility adapter.
- Migration/read fallback giữa path legacy và relation mới.

Không bắt buộc tạo repository interface cho mọi bảng. Chỉ dùng khi có nhiều nguồn dữ liệu, compatibility logic hoặc transaction/domain rule đáng kể.

## Có thể query PostgreSQL qua server-side data layer

- News/category, Event, Product/taxonomy, Service và Menu.
- Settings, Function SEO và Translation Strings.
- User/permission với service bảo mật bắt buộc.
- Các bảng mới Page Builder, CTA, Form, Media, Email Template, Audit và Trash sau khi migration được duyệt.

Server Component không query raw DB rải rác. Query đơn giản có thể dùng data function server-side; nghiệp vụ phức tạp đi qua service/repository phù hợp.

## Technical debt khi chuyển Next.js

1. Thay từng mock data function bằng server-only data function/ORM query.
2. Tạo mapper PostgreSQL → ViewModel; không đổi component để dùng raw row.
3. Chuyển mutation CMS local-state thành Server Action hoặc Route Handler khi thực sự cần HTTP.
4. Chuẩn hóa locale/workspace trong route và server data access.
5. Enforce Published trên server; Preview dùng auth/token riêng.
6. Sanitize Rich Text phía server và kiểm thử HTML legacy.
7. Chuyển image/file URL legacy qua Media resolver có fallback.
8. Tách interactive island khỏi phần render tĩnh của các page lớn hiện tại.
9. Thêm cache/revalidation theo module sau khi đã có backend thật.
10. Xóa mock chỉ sau khi từng module đạt parity và không còn fallback cần thiết.

## Điều không làm ở giai đoạn React mockup

- Không thêm Next.js, ORM hoặc Server Action.
- Không tạo controller/fake REST endpoint/HTTP client giả.
- Không xây repository/gateway/interface chỉ để bọc một mảng mock.
- Không sửa PostgreSQL vì property trình bày trong mock.
- Không redesign UI để thuận tiện cho refactor.
