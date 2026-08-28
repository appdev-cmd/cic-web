# Project Context

## Project hiện tại

Đây là frontend mockup/demo cho website **CIC Technology**, gồm hai bề mặt trong cùng một ứng dụng React:

- website public giới thiệu công ty, sản phẩm, dịch vụ, dự án, nội dung và các kênh liên hệ;
- CMS quản trị nội dung, catalog, media, tương tác khách hàng, phân quyền và cấu hình.

Ứng dụng hiện chưa có backend hay database thật trong repository. Các thao tác tạo/sửa/xóa chủ yếu thay đổi state trong bộ nhớ; refresh sẽ trả dữ liệu về fixture ban đầu, ngoại trừ một số preference/draft lưu bằng Web Storage.

## Công nghệ hiện tại

- React 19, React DOM 19, TypeScript 5.8.
- Vite 6; entry HTML là `index.html`, entry React là `src/main.tsx`, root application là `src/App.tsx`.
- Tailwind CSS 4 qua `@tailwindcss/vite`, kết hợp CSS toàn cục lớn trong `src/index.css`.
- `motion/react` cho animation và transition.
- `lucide-react` cho icon.
- Recharts cho chart dashboard CMS.
- CKEditor 5 cho rich-text trong CMS static page/page builder.
- Không có React Router, state manager, form library hoặc validation library bên thứ ba.

## Tổ chức website và CMS

### Website public

`App.tsx` giữ `currentView` và render view bằng chuỗi điều kiện. Header/Footer nhận callback để đổi view; các màn hình list/detail dùng local state và các reset key. URL public không biểu diễn module/detail: ngoài `/`, `/cms...` và đường dẫn không hợp lệ, mọi chuyển trang public được đưa về `/` bằng `history.replaceState`.

Layout public gồm Header, vùng `<main>`, Footer, background canvas theo màn hình, floating contact speed-dial, consultation modal, chatbot và design-token modal. Dữ liệu đến từ `src/web/data`, các adapter trong `src/web/features`, và resolver/fallback trong `src/shared/page-content`.

### CMS

`CmsDashboard.tsx` là app shell: header, sidebar, breadcrumb, content outlet tự chọn theo route, footer, command palette, right drawer và account modals. CMS lazy-load từng module. `src/cms/routing.ts` map pathname/alias/nested prefix sang module; navigation dùng `window.history.pushState` và `popstate`, không dùng router package.

CMS đã có ranh giới data-source bằng interface trong `src/cms/data`, nhưng implementation hiện tại vẫn là `demo*DataSource` ghép từ `mockData.ts`, data module và JSON fixture. Chưa có authentication/authorization thực thi phía server.

## Trạng thái dữ liệu mock

- Public business content nằm chủ yếu trong `src/web/data/*.ts`; một phần được expose qua `src/web/features/*`.
- CMS fixture nằm theo module (`src/cms/modules/*/mockData.ts`) và được gom bởi các `demo*DataSource`.
- Dashboard CMS dùng `src/cms/data/mockCmsData.ts`.
- Static page/page builder dùng `staticPagesData.ts`, `pageBuilderData.ts`, `pageBuilderMockData.json` và shared page-content models/resolvers.
- Form submit public đi qua `customerInteractionSubmission.ts`, nhưng gateway hiện là ranh giới frontend, không phải persistence backend trong project.

## Mục tiêu migration đã xác nhận

Sau này migrate sang **một project Next.js fullstack duy nhất** chứa public website, CMS và backend/data layer; PostgreSQL đặt trên Supabase, deploy Vercel. Audit này không thiết kế kiến trúc Next.js, schema, API hoặc chuyển component.

## Nguyên tắc bắt buộc cho AI ở các bước sau

1. React UI/UX hiện tại là **source of truth**; giữ gần như nguyên trạng layout, nội dung, responsive behavior và interaction.
2. Không dùng migration như lý do để redesign, đổi brand, đổi navigation hoặc cleanup UI ngoài phạm vi được yêu cầu.
3. Giữ logo CIC, palette cam + slate/navy, Roboto, nội dung business và quan hệ giữa sản phẩm/dịch vụ/dự án/tin tức/sự kiện.
4. Phân biệt UI-only state với business data cần persistence; không đưa modal state, tab state hoặc hover state vào database.
5. Bảo toàn route alias/nested flow CMS khi thay router; đồng thời ghi nhận public app hiện chưa có deep-link thực.
6. Browser-only code phải được cô lập đúng client boundary khi sang Next.js; không gọi `window`, `document`, storage, canvas hoặc CKEditor trong server render.
7. Data-source interfaces hiện tại là bằng chứng hữu ích về ranh giới module, nhưng không phải backend hoàn chỉnh hay schema chuẩn cuối cùng.
8. Không coi dữ liệu mock trùng lặp là hai nguồn business độc lập; phải xác minh nguồn canonical trước khi nhập database.

## Migration Risks

- `App.tsx` đọc `window.location` trong initializer và điều phối toàn bộ public site bằng local state; không tương thích trực tiếp với SSR/deep linking.
- CMS router, nested view state và global search đều tự thao tác History API; cần giữ semantics khi đổi sang routing của Next.js.
- Nhiều browser-only integration: canvas/requestAnimationFrame, ResizeObserver, direct DOM editing, iframe preview, clipboard, Web Storage, media/download link và global event listeners.
- Các file view/manager rất lớn trộn UI, filter, pagination, detail và business action; ranh giới server/client sẽ cần xác định cẩn thận.
- Mock content bị lặp giữa public data, feature adapter và CMS fixtures; ID/relationship có thể không đồng nhất.
- HTML rich content được render bằng `dangerouslySetInnerHTML`; sanitation hiện không nhất quán giữa view.
- CMS demo có locale `vi/en` trong type nhưng nhiều data-source chỉ có `vi`; workspace `en` có thể trả empty data.
- Không có auth/backend authorization thật; permission UI hiện không chứng minh enforcement.

