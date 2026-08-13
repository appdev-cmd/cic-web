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

## Tình trạng module

### Boundary tốt

| Module | Boundary hiện tại | Ghi chú |
|---|---|---|
| News website | `getNewsData()` | `NewsView` không import mock; relation liên quan chọn thủ công |
| News CMS | `getCmsNewsData(locale)` | list/form/category/media nhận data qua props/data function |

### Còn import mock trực tiếp hoặc qua demo source tổng hợp

- CMS Dashboard và các module Events, Services, Products, Product Settings, Menu, Media, Users, Permissions, Settings, Activity Logs, Trash, Contacts.
- CTA, Forms, Customer Requests và Email Templates còn import fixture trực tiếp ở manager/editor.
- Function SEO và Translation Strings còn import mock trực tiếp.
- Static Pages còn dùng Page Builder mock và một số picker/editor phụ thuộc fixture module khác.
- Website Home, Product, Service, Event, Project và một số section liên quan còn đọc trực tiếp `src/web/data/**`.

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
