# Current Structure

## Cấu trúc kiến trúc có ý nghĩa

```text
index.html
src/
  main.tsx                 React bootstrap + global CSS
  App.tsx                  public shell, view coordinator, CMS switch
  index.css                Tailwind import, fonts, global/public/CMS/editor CSS
  web/
    components/            public views và public shared widgets
    data/                  public fixtures/business content
    features/              typed adapters theo domain
    services/              customer-interaction submission boundary
  cms/
    components/            CMS app shell và shared chrome/control
    components/ui/         shared list primitives
    data/                  data-source interfaces + demo implementations
    modules/               20 domain folders; customer_interaction có 3 module con
    services/              global search index/service
    routing.ts             route registry/resolver tự viết
    types/                 CMS shell/dashboard types
  shared/
    components/            Typography, Counter, shared icons
    tokens/                color/spacing/radius/shadow/typography tokens
    types/                 public domain types
    page-content/          page models, legacy adapters, resolvers
    visual-editing/        binding, geometry, inline editing, sortable contracts
    configuration/         public website configuration adapter
    customerInteractionContract.ts
public/                    logos, hero images, world/partner JSON và partner logos
```

`src/data/worldMapPaths.ts` tồn tại song song với `src/web/data/worldMapPaths.ts`; public component dùng bản trong `src/web/data`.

## Entry points và build

- `index.html` cung cấp `#root` và load `/src/main.tsx`.
- `main.tsx` dùng `createRoot(...).render(<StrictMode><App /></StrictMode>)` và import `index.css`.
- Vite aliases map `@web`, `@cms`, `@shared` (xem `vite.config.ts`/`tsconfig.json`).
- Vite build/preview; `vercel.json` phục vụ SPA rewrite. Không có server code trong `src`.

## Routing

### Public

Không có route registry/package. `WebsiteView` trong `App.tsx` gồm `home`, `products`, `about`, `services`, `projects`, `news`, `events`, `contact`, `privacy`, `terms`, `search`, `not-found`, `cms`.

- `/` khởi tạo `home`.
- `/cms` hoặc `/cms/*` khởi tạo CMS.
- Path khác khởi tạo 404.
- Sau khi click navigation public, view đổi bằng state nhưng URL được giữ/đưa về `/`.
- Detail sản phẩm/dịch vụ/dự án/tin/sự kiện và about subtab không có URL riêng.

### CMS

Canonical routes: `/cms/dashboard`, `/cms/search`, `/cms/users`, `/cms/permissions`, `/cms/settings`, `/cms/function-seo`, `/cms/activity-logs`, `/cms/trash`, `/cms/static-pages`, `/cms/news`, `/cms/events`, `/cms/projects`, `/cms/email-templates`, `/cms/product-settings`, `/cms/products`, `/cms/services`, `/cms/frontend-menus`, `/cms/media`, `/cms/contact-requests`, `/cms/translation-strings`, `/cms/cta`, `/cms/forms`, `/cms/customer-requests`.

`CMS_ROUTES` còn giữ aliases như `/cms`, `/cms/pages`, `/cms/articles`, `/cms/catalog`, `/cms/menu`, `/cms/media-library`, `/cms/contacts`, `/cms/localization`, `/cms/requests`; nested prefix mở form/detail/category. Product settings còn chọn taxonomy bằng alias/path/query `tab`.

## Layouts

### Public shell

- `App.tsx`: page canvas, floating utility/contact bar và global modal/widget.
- `Header.tsx`: desktop/mobile nav, mega/sub menus, search và consultation CTA.
- `Footer.tsx`: navigation, company/contact/social/legal links.
- `LegalArticleLayout.tsx`: layout dùng chung cho Privacy/Terms.
- View tự chứa hero, breadcrumb, list/detail, filter và pagination của domain.

### CMS shell

- `CmsDashboard.tsx`: lazy outlet và shell state.
- `CmsHeader.tsx`, `CmsSidebar.tsx`, `CmsBreadcrumb.tsx`, `CmsFooter.tsx`.
- `CmsCommandPalette.tsx`, `CmsRightDrawer.tsx`, account/password modals.
- CSS shell dùng biến `--cms-header-height`, sidebar widths, sticky action/aside và dark-mode selectors.

## Shared code

### Thực sự shared xuyên public/CMS

- `src/shared/tokens/*`: primitive + semantic color, spacing, radius, shadow, typography; `designTokens` và CSS variable generator.
- `src/shared/components/Typography.tsx`, `Counter.tsx`, `Icons.tsx`.
- `src/shared/types/index.ts`: Product, Project, NewsItem, Partner, HeroSlide, NavLink, Event types.
- `src/shared/page-content/*`: model/resolver/legacy fallback cho home/about/contact và reference entity.
- `src/shared/visual-editing/*`: binding registry, editable contract, DOM geometry, inline text, sortable collection, target resolver.
- `customerInteractionContract.ts`: system form/CTA IDs và submission contract.

### Shared trong public

Header, Footer, ConsultationModal, ChatbotWidget, legal article layout, backgrounds, partner map/network, awards slider, ecosystem section. `src/web/features/*` cung cấp typed read adapters cho navigation/home/products/services/projects/news/events.

### Shared trong CMS

- Chrome: header/sidebar/breadcrumb/footer/command palette/drawers.
- `components/ui`: `CmsButton`, `CmsTabs`, `CmsSelectionCheckbox`, `CmsPagination`, `CmsPageHeader`, `CmsListToolbar`, `CmsBulkActionBar`.
- `SearchableSelect`, responsive/public preview frames, content quality panel.
- Shared customer-interaction constants/types/validation helpers.
- Data-source interfaces tách catalog, editorial, governance, configuration, media, contacts, presentation và customer interaction.

### Duplicate đáng lưu ý

- Public fixtures có cả `src/web/data/*` và adapter `src/web/features/*`; `mockData.ts` vẫn chứa products/projects/news/nav/home data lớn trong khi domain files khác cũng có bản chi tiết.
- `src/data/worldMapPaths.ts` và `src/web/data/worldMapPaths.ts` trùng vai trò.
- CMS có nhiều `DeleteConfirmModal`, preview modal, column setting modal, activity/version drawer theo module.
- List screens lặp local search/filter/sort/pagination/bulk selection dù đã có `components/ui`.
- Rich content CSS lặp giữa `.service-cms-content`, `.event-rich-content`, `.article-rich-content`; sanitation helper được viết riêng theo view.
- Public list/detail views lặp breadcrumb, share, scroll-to-top, auto-slide interval và filter/pagination logic.

## State và data flow

### UI-only state

- `App.tsx`: current view, active nav/subtab/detail ID, reset keys, search query, modal/chatbot/FAB state.
- CMS shell: theme, locale workspace, sidebar/mobile state, active path/title, command palette, drawers/modals, toast và traffic range.
- Module/view: active tab, search/filter/sort, selected row/card, pagination, list/grid mode, preview, modal/drawer, carousel index, hover/focus/drag state.
- Không có React Context, Redux/Zustand hoặc shared external store; state đi bằng props/callbacks và local hooks.

### Mock business data

- Public: `src/web/data/mockData.ts`, `aboutData.ts`, `servicesData.ts`, `projectsData.ts`, `newsData.ts`, `eventsData.ts`, `homeData.ts`, map/partner data; feature adapters expose các collection này.
- CMS: module `mockData.ts`/data files, `mockCmsData.ts`, `staticPagesData.ts`, page-builder JSON/data; `demo*DataSource` gom và clone fixture.
- Một số constant/list option được hard-code ngay trong component/data-source, ví dụ product options bổ sung trong `demoCatalogDataSource`, floating contact items trong `App.tsx`.

### Dữ liệu cần backend/database sau này

Products và taxonomy; services; projects; news/categories; events/registrations; static pages/page-builder versions; menu; media/albums/files; CTAs/forms/email templates/submissions/customer requests; contacts/PII/assignment/notes; users/roles/permissions/reviews; configuration/secrets/version/audit; SEO function records; localization strings/progress; audit logs/trash/export jobs; dashboard aggregates.

### Persistence browser hiện có

- `localStorage`: CMS theme; chatbot webhook URL và auto-fallback setting.
- `sessionStorage`: draft note theo contact.
- Không thấy client data-fetching/cache library; data được import đồng bộ từ source.

## Dependencies thực sự xuất hiện trong code

| Nhóm | Dependency | Vị trí/vai trò |
|---|---|---|
| Runtime | React, React DOM | toàn app, lazy/Suspense, hooks, root render |
| Styling | Tailwind CSS 4, `@tailwindcss/vite` | utility class + `src/index.css` |
| Routing | Không có library | History API + local state + `src/cms/routing.ts` |
| Animation | `motion` (`motion/react`) | public transitions, modal, carousel, hover/tap |
| Icon | `lucide-react` | public và toàn CMS |
| Chart | `recharts` | `DashboardOverview.tsx` |
| Rich text/editor | `ckeditor5`, `@ckeditor/ckeditor5-react` | `RichTextEditor.tsx`, static page builder |
| Drag/drop | Native pointer/HTML5 drag | partner-map edit mode, product file drop, page builder; không có DnD library |
| Form/validation/table/date/upload | Không có library chuyên dụng | native controls/local state/helpers; table/upload/date formatting tự viết |

`dotenv` có trong package nhưng không thấy import runtime trong `src`. Playwright là dev dependency; không phải UI runtime.

## Migration Risks

- Root `App.tsx` là client coordinator lớn; toàn bộ public navigation/state cần được map mà không làm mất UI behavior.
- `window`/`document` xuất hiện rộng: history, scroll, resize, keyboard, clipboard, confirm/prompt, download, DOM query/edit.
- Canvas (`Constellation`, `TechAboutBackground`) chạy animation loop và global mouse/resize listeners.
- CKEditor, direct `contentEditable`, draggable DOM và iframe preview là browser-only; page builder có direct DOM mutation dày đặc.
- `dangerouslySetInnerHTML` ở product/service/project/news/event/page preview; sanitizer không có một contract chung.
- Component lớn: `NewsView` ~2,029 dòng, `PageBuilderEditor` ~1,773, `ProductsView` ~1,427, `EventsView` ~1,340, `PageBuilderVisualCanvas` ~1,317, `HomeView` ~1,250; UI và behavior/business rules trộn nhau.
- CMS dùng lazy import tốt cho bundle hiện tại, nhưng CKEditor/Recharts/public view boundaries phải được đánh giá lại theo client bundle của Next.js.
- Không có form schema/validation library; validation nằm rải rác và nhiều submit chỉ mô phỏng.
- Dữ liệu locale, ID/reference và mock duplicate cần kiểm kê trước khi coi là dữ liệu database canonical.

