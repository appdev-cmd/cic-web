# Migration Status

## Prompt 7.x-AH — Customer Requests

- `[x]` Customer Requests: server-only PostgreSQL read foundation now targets the approved `cic_contact` intake records with newest-first ordering; no unapproved request table is introduced.
- Next module: (roadmap complete).

## Prompt 7.x-AG — Forms

- `[x]` Forms: server-only PostgreSQL read foundation now targets `cic_forms` and nested `cic_form_fields` records with deterministic ordering.
- Next module: Customer Requests.

## Prompt 7.x-AF — CTA

- `[x]` CTA: server-only PostgreSQL read foundation now targets `cic_ctas` with newest-first ordering.
- Next module: Forms.

## Prompt 7.x-AE — Localization

- `[x]` Localization: server-only PostgreSQL read foundation now targets `cic_translate_content` with stable ordering.
- Next module: CTA.

## Prompt 7.x-AD — Liên hệ/CRM inbox

- `[x]` Liên hệ/CRM inbox: server-only PostgreSQL read foundation now targets `cic_contact` with newest-first ordering.
- Next module: Localization.

## Prompt 7.x-AC — Media

- `[x]` Media: server-only PostgreSQL read foundation now targets `cic_media_assets` with deterministic newest-first ordering.
- Next module: Liên hệ/CRM inbox.

## Prompt 7.x-AB — Menu website

- `[x]` Menu website: server-only PostgreSQL read foundation now targets locale-specific `cic_menus_items` / `cic_menus_items_en` records with deterministic ordering.
- Next module: Media.

## Prompt 7.x-AA — Dịch vụ

- `[x]` Dịch vụ: server-only PostgreSQL read foundation now targets locale-specific `cic_services` / `cic_services_en` records with deterministic ordering.
- Next module: Menu website.

## Prompt 7.x-Z — Product Settings/Taxonomy

- `[x]` Product Settings/Taxonomy: server-only PostgreSQL read foundation now aggregates approved category, manufacturer, application and product-type tables with deterministic ordering.
- Next module: Sản phẩm.

## Prompt 7.x-Y — Email Templates

- `[x]` Email Templates: server-only PostgreSQL read foundation now targets `cic_email_templates` with deterministic ordering.
- Next module: Product Settings/Taxonomy.

## Prompt 7.x-X — Sự kiện

- `[x]` Sự kiện: server-only PostgreSQL read foundation now targets locale-specific `cic_event` / `cic_event_en` records with deterministic ordering.
- Next module: Dự án.

## Prompt 7.x-W — Tin tức

- `[x]` Tin tức: server-only PostgreSQL read foundation now targets locale-specific `cic_news` / `cic_news_en` records with deterministic ordering.
- Next module: Sự kiện.

## Prompt 7.x-V — Trang tĩnh & Page Builder

- `[x]` Trang tĩnh & Page Builder: server-only PostgreSQL read foundation now targets `cic_content_pages`; page-builder UI remains presentation-compatible while persisted page records are sourced from the database.
- Next module: Tin tức.

## Prompt 7.x-U — Thùng rác

- `[x]` Thùng rác: server-only PostgreSQL read foundation now targets `cic_trash_items` with trashed-status filtering and deterministic ordering.
- Next module: Trang tĩnh & Page Builder.

## Prompt 7.x-T — Nhật ký hoạt động

- `[x]` Nhật ký hoạt động: server-only PostgreSQL read foundation for `cic_activity_logs` is available and legacy UI remains compatible.
- Next module: Thùng rác.

## Prompt 7.x-S — Function SEO

- `[x]` Function SEO: locale-specific SEO module metadata now reads and persists through PostgreSQL `cic_config_modules` / `cic_config_modules_en` with validated permission-checked Server Action updates. Facet and redirect metadata remains non-persisted because no approved schema table exists.
- Next module: Nhật ký hoạt động.

## Prompt 7.x-R — Cấu hình hệ thống

- `[x]` Cấu hình hệ thống: CMS settings now reads real workspace configuration and branches from PostgreSQL (`cic_config`, `cic_config_en`, `cic_config_enjicad`, `cic_branches`) through a server-only ViewModel. Standard changes, reviewed changes, draft/publish saves, branch CRUD/reordering and inherited scope values are validated server-side, permission-checked and persisted transactionally through Server Actions; secrets remain masked and no demo configuration source is used at runtime.
- Next module: Function SEO.

## Prompt 7.x-Q — Phân quyền

- `[x]` Phân quyền: `/cms/permissions` và nested route dùng PostgreSQL `cic_roles`, `cic_role_permissions`, `cic_user_roles`, `cic_permission_tasks` và `cic_users`; danh sách/tìm kiếm/lọc/phân trang, tạo-sửa-nhân bản-kích hoạt vai trò, ma trận quyền, gán và thu hồi vai trò đều chạy qua Server Actions có RBAC, validation và transaction. Production runtime không còn lấy dữ liệu hoặc CRUD từ `demoGovernanceDataSource.permissions`.
- Next module: Cấu hình hệ thống.

## Prompt 7.x-P — Người dùng CIC

- `[x]` Người dùng CIC: `/cms/users` và các alias/nested route dùng server-rendered PostgreSQL data từ `cic_users`, vai trò, phạm vi, lịch sử trạng thái và sự kiện bảo mật; create/update, đồng bộ vai trò, đổi trạng thái đơn/hàng loạt và khôi phục mật khẩu chạy qua Server Actions có RBAC, validation và transaction cho mọi mutation nhiều bảng. Supabase Auth là credential authority; mật khẩu không được ghi vào bảng legacy và module không còn dùng demo/local CRUD ở production runtime.
- Next module: Phân quyền.

## Prompt 7.x-O — CMS Global Search

- `[x]` CMS Global Search: full-page search and command palette now consume an authenticated server-built PostgreSQL index across CMS content, contacts, media, forms/CTA, and permission-filtered users; all search/filter/grouping/highlight/recent-history interactions preserve the existing client UI without demo/fixture business data.
- Next module: Người dùng CIC.

## Prompt 7.x-N — CMS Dashboard

- `[x]` CMS Dashboard: `/cms` and `/cms/dashboard` now load authenticated, server-rendered PostgreSQL aggregates for published content, upcoming events, and recent/unprocessed contacts; Dashboard business data no longer falls back to demo fixtures.
- Next module: Global Search.

## Prompt 7.x-M — Homepage

- `[x]` Homepage: `/` now renders the existing React `HomeView` through an App Router client interaction adapter, preserving page-content resolution, motion, tabs, forms, and responsive presentation.
- Next module: CMS Dashboard.

## Prompt 7.x-L — 404

- `[x]` 404: Next global not-found boundary now reuses the existing responsive `NotFoundView`, preserving home/back navigation and visual behavior.
- Next module: Homepage.

## Prompt 7.x-K — Terms of use

- `[x]` Terms of use: existing React legal article UI is mounted at `/terms` through a minimal client navigation adapter, with route metadata and unchanged presentation/content.
- Next module: 404.

## Prompt 7.x-J — Privacy policy

- `[x]` Privacy policy: existing React legal article UI is mounted at `/privacy` through a minimal client navigation adapter, with route metadata and unchanged presentation/content.
- Next module: Terms of use.

## Prompt 7.x-I — Search

- `[x]` Search: server-side aggregate search across PostgreSQL-backed published Products, Projects, Services, News, and Events implemented.
- Next module: Privacy policy.

## Prompt 7.x-H — Global interaction/widgets

- `[x]` Global interaction/widgets: consultation/contact submissions persist through a validated Server Action into `cic_contact`; browser mock/localStorage persistence was removed.
- Next module: Search.

## Prompt 7.x-G — About

- `[x]` About: published configuration-backed server read boundary and public route implemented.
- Next module: Global interaction/widgets.

## Prompt 7.x-F — Contact

- `[x]` Contact: server-validated contact submission action and PostgreSQL-backed public form implemented.
- Next module: About.

## Prompt 7.x-E — Events

- `[x]` Events: PostgreSQL published read foundation and public list/detail routes implemented.
- Next module: Contact.

## Prompt 7.x-D — News

- `[x]` News published read boundary is prepared for the next migration pass.

## Prompt 7.x-C — Services

- `[x]` Services: PostgreSQL published read foundation and public list/detail routes implemented.
- Next module: News.

## Projects migration update (2026-08-28)

## Prompt 7.x-B — Products (in progress)

- `[x]` Products: PostgreSQL published read foundation and public list/detail routes implemented.

- PostgreSQL project writes and relation synchronization use a single transaction with FK validation.
- Server Actions enforce CMS permission checks and revalidate public/CMS paths after mutations.
- Public project listing now renders published PostgreSQL records rather than a placeholder.
- Projects vertical slice is complete for the current Next migration boundary; next module should follow the first `[ ]` entry in `MODULE_MAP.md`.

## Prompt 7.x-A — Projects (in progress)

- `[x]` Projects: PostgreSQL-backed public and CMS vertical slice completed.
- Added `ProjectViewModel`, mapper and `listPublishedProjects()` using `cic_projects` with published/order filtering.
- Added Next route `/projects` as a server-rendered listing boundary.
- Added `/projects/[slug]` published detail route with server-side not-found handling.
- Added PostgreSQL-aligned project input validation schema; mutation remains gated on CMS auth/permission.
- Added route-level metadata generation for published project detail pages.
- CMS CRUD, detail/relations, write validation and mock removal remain for the next Projects slice.

## Tổng quan

| Giai đoạn | Trạng thái | Kết quả |
|---|---|---|
| Prompt 0 — Audit React project | Completed | `PROJECT_CONTEXT.md`, `CURRENT_STRUCTURE.md`, `MODULE_MAP.md`, `UI_PRESERVATION.md` |
| Prompt 1 — Next.js Fullstack Architecture | Completed | `ARCHITECTURE.md`, `CODING_RULES.md`, `DECISIONS.md`, file trạng thái này |
| Prompt 2 — Next.js Foundation | Completed | App Router, strict TS/ESLint, env validation, Supabase server foundation, route/error skeleton |
| Prompt 3 — Shared UI Foundation | Completed | Tokens/global base, typography/icons/counter, CMS/form/list/table primitives và visual regression |
| Prompt 4 — Data/Backend Foundation | Not started | Next task |

## Đã làm trong Prompt 1

- Đọc và đối chiếu toàn bộ tài liệu trong `docs/ai/`.
- Đối chiếu architecture với toàn bộ module trong `MODULE_MAP.md` và boundaries trong `CURRENT_STRUCTURE.md`.
- Kế thừa các quyết định readiness/data contract/schema hiện có trong `docs/system-audit/`; không thiết kế lại schema đã chốt.
- Định nghĩa target structure cho App Router, public routes, CMS routes, features, shared, server, Supabase và config.
- Khóa rules cho Server/Client Components, data flow, Server Actions/Route Handlers, Supabase/PostgreSQL, auth/permissions, validation/errors, caching và imports.
- Ghi architecture decisions cấp project.
- Không tạo Next.js, dependency, database, API hoặc migrate UI/module.

## Chưa làm sau Prompt 1 (lịch sử)

- Tại thời điểm kết thúc Prompt 1, chưa khởi tạo Next.js, package, route hoặc Supabase foundation; các mục foundation này đã được thực hiện trong Prompt 2 bên dưới.
- Chưa implement auth/session/RBAC/RLS.
- Chưa chuyển mock sang backend và chưa gỡ fixture.
- Chưa migrate public/CMS module hoặc thực hiện visual regression của bản Next.js.

## Verification Prompt 1

- `npm.cmd run lint` (`tsc --noEmit`): **Passed**.
- `npm.cmd run build`: source transform hoàn tất 3.828 modules nhưng Vite build bị chặn bởi filesystem `EPERM` tại `dist/35nam_cic_1.JPG` khi dọn output.
- Retry `npm.cmd run build -- --emptyOutDir=false`: vẫn bị `EPERM` khi copy `public/35nam_cic_1.JPG` sang file đích đang bị khóa.
- `git diff --check -- docs/ai`: **Passed**.
- Không có code/UI runtime thay đổi trong Prompt 1, nên chưa có surface Next.js để chạy visual regression. UI preservation contract đã được khóa trong `ARCHITECTURE.md` và `CODING_RULES.md`.

## Đã làm trong Prompt 2

- Chuyển scripts chính sang Next.js 16 App Router; giữ scripts Vite legacy làm baseline tạm thời.
- Tạo root layout/metadata, public route group, `/`, `/cms`, loading, error và not-found tối giản.
- Tạo strict foundation `tsconfig.json`, `tsconfig.legacy.json`, aliases và flat ESLint config chỉ lint code Next mới.
- Tạo typed env schema/fail-fast parser và `.env.example`; không commit secret.
- Tạo request-aware Supabase SSR server client, server-only admin factory và DB foundation không gắn domain/schema.
- Tạo server-only structured error logger và Next instrumentation `onRequestError`.
- Bỏ Vercel SPA rewrite cũ để App Router sở hữu routing.
- Không migrate module/shared UI, không tạo browser Supabase client, health API, auth flow, repository hoặc schema nghiệp vụ.

## Verification Prompt 2

- `npm.cmd run check:env`: **Passed**; case hợp lệ pass và case thiếu `APP_URL`, Supabase URL/key fail với message rõ.
- `npm.cmd run typecheck:foundation`: **Passed**.
- `npm.cmd run typecheck:legacy`: **Passed**.
- `npm.cmd run lint`: **Passed**, zero warnings.
- `npm.cmd run build`: **Passed** với Next.js 16.3.3; `/`, `/_not-found`, `/cms` được prerender static.
- Production server: `/` trả 200, `/cms` trả 200 + robots `noindex`, route thiếu trả 404.
- Secret scan `.next/static`: không thấy `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL` hoặc admin client marker.
- Playwright fallback (Browser plugin không có trong phiên): kiểm tra `/` ở 1440×900 và `/cms` ở 390×844; placeholder tối giản render đúng, không overflow/clipping.
- Không có visual concept mới: user đã yêu cầu không redesign/migrate UI trong Prompt 2. React/Vite hiện tại vẫn là visual source of truth cho Prompt 3+.

## Chưa làm sau Prompt 2

- Chưa migrate shared design tokens, Header/Footer, CMS shell hoặc UI primitives.
- Chưa migrate bất kỳ public/CMS business module nào.
- Chưa implement auth/session/permission, browser Supabase client, middleware/proxy hoặc database connection thật.
- Chưa tạo schema/migration/repository theo domain và chưa gỡ mock.
- Chưa thay placeholder bằng UI React hiện tại.

## Đã làm trong Prompt 3

- Kích hoạt Tailwind CSS 4 cho Next qua `@tailwindcss/postcss`, giới hạn source scan vào App và shared code đã migrate.
- Migrate nguyên design token definitions hiện có: color, spacing, radius, shadow và typography; expose CSS variables nền tương ứng mà không đổi giá trị.
- Migrate global base styles cần dùng chung: Roboto, text rendering, selection, typography baseline và dark color-scheme contract.
- Đưa Typography roles/`SectionHeader`, `BIMIcon`, `ZaloIcon` và `Counter` vào strict Next foundation; Counter là client island duy nhất trong nhóm này vì dùng animation frame/state.
- Chuyển implementation authority của `CmsButton`/`CmsIconButton`, `CmsPageHeader`, `CmsTabs`, `CmsSelectionCheckbox`, `CmsPagination`/`CmsListFooter`, `CmsBulkActionBar`, `CmsListToolbar`, `CmsTableShell` và table empty/loading states sang `src/shared/ui/cms`.
- Chuyển `SearchableSelect`/`SearchableMultiSelect` sang shared client boundary, giữ nguyên click-outside, search, selected chips và dropdown behavior.
- Thêm form primitives mỏng từ class contract đang lặp ở News/Products/Events/Projects: `CmsField`, `CmsInput`, `CmsTextarea`, `CmsSelect`; không chứa form/business state.
- Giữ compatibility re-export ở đường dẫn CMS cũ để React/Vite baseline tiếp tục typecheck mà không nhân đôi implementation.
- `/cms` hiện là shared-foundation preview không nghiệp vụ để kiểm tra states; Prompt 6 sẽ thay bằng CMS shell thật.

## Verification Prompt 3

- `npm.cmd run typecheck`: **Passed** cho cả strict Next foundation và React/Vite legacy baseline.
- `npm.cmd run lint`: **Passed**, zero warnings.
- `npm.cmd run build`: **Passed**; `/`, `/_not-found`, `/cms` prerender thành công.
- Playwright fallback (Browser plugin không có): so sánh React CMS baseline 1440×1000 với Next shared preview 1440×1000; kiểm tra Next mobile 390×844.
- Interaction checks: primary hover đổi state, input focus đổi border, tabs chuyển content/empty state và SearchableSelect mở search dropdown; pagination/selection default-disabled geometry được render trong cùng preview.
- Responsive check: không body-level horizontal overflow ở 390px; table overflow nằm trong `CmsTableShell`; action/pagination wrap theo contract cũ.
- Client boundary audit: chỉ Counter, Pagination, SelectionCheckbox, SearchableSelect và preview composition có `"use client"`; tokens/Typography/Icons/Button/PageHeader/table shell vẫn server-compatible.
- Dependency/cycle audit: shared implementation không import `src/cms`, feature hoặc server code; legacy paths chỉ re-export một chiều về shared.

## Cố ý để lại cho các prompt sau

- Prompt 5: website Header, Footer, Navigation và global public widgets.
- Prompt 6: CMS Sidebar, Topbar/Header, Breadcrumb, Footer, command palette, account modals và app shell hoàn chỉnh.
- Prompt 6/7.x: modal/dialog/drawer/status badge/card/form patterns chưa có shared contract thống nhất; không tạo generic API ở Prompt 3.
- Prompt 7.x: Product/News/Event/Service cards, filters, forms, rich-content/editor/page-specific sections và table column/business actions.
- Page Builder/CKEditor/visual editing, backend/data access và business validation vẫn chưa migrate.

## Next task

Prompt 7.x-B — Products (catalog and public published slice), subject to schema/dependency review.

**Prompt 4 — Data/Backend Foundation**

Prompt 4 phải đọc toàn bộ `docs/ai/`, chỉ dựng data/backend boundary theo architecture; không tự migrate business module hoặc thay shared UI đã chốt.

## Gate trước Prompt 4

- Không dùng raw database row làm UI contract; chỉ tạo server-only data foundation và mapper boundary khi có nguồn/schema được duyệt.
- Không tạo repository theo module, schema nghiệp vụ hoặc fake REST API ngoài Prompt 4.
- Không import server/data code vào shared client components.
- Không thay `/cms` preview thành CMS business screen; shell và module vẫn thuộc Prompt 6/7.x.

## Blockers/điểm cần nhớ cho backend về sau

- `cic_regions` migration draft đang có lỗi mapping/load.
- `cic_products_categories_rel` cần loader hỗ trợ composite/synthetic relation key.
- Event `end_time` cần đối soát với legacy audit meaning trước khi normalize.
- Security fields và Customer Request notes/events chỉ được thêm cùng implementation đã duyệt.
- Public deep-link là thay đổi routing kỹ thuật cần visual/behavior regression, không phải redesign.
