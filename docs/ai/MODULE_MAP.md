# Module Map

## Quy ước trạng thái bắt buộc

- `[ ]` Not started: chưa audit/chưa bắt đầu.
- `[A]` Audited: đã xác định scope, source of truth và dependency; **không có nghĩa đã migrate**.
- `[C]` Core complete: core capability chạy bằng implementation thật; integration bắt buộc chưa đóng.
- `[I]` Integration pending: core hoạt động nhưng còn soft/integration dependency đã ghi rõ.
- `[x]` Complete: UI/behavior, persistence, workflow, permission và mọi integration bắt buộc đã được kiểm chứng.

Audit ngày 2026-08-31 chuẩn hóa toàn bộ module thành `[A]`. Code Next, query/action hoặc route đã tồn tại chỉ được ghi ở cột “hiện trạng quan sát”; không tự nâng trạng thái. Không module nào đủ bằng chứng `[x]` theo gate mới.

## Website public

| Status | Domain/module | Public surface | Persistence/CMS owner | Hard dependency | Soft/integration dependency | Hiện trạng quan sát |
|---|---|---|---|---|---|---|
| `[A]` | Home | `/`, hero, ecosystem, highlights, stats | Static Pages/Page Builder, config | public shell; published page/config read model | products, services, projects, news, events, partners, CTA | Next route dùng legacy presentation/content adapter; integration còn mixed |
| `[A]` | About/company/partners | `/about` | Static Pages, config, media | public shell; published about/config | partners/map assets, awards, contact | Next route có read boundary; parity/integration chưa chứng minh |
| `[A]` | Products | `/products`, `/products/[slug]` | Products + Product Settings | product schema/query/mapper; taxonomy; media; published visibility | projects, services, CTA/forms, SEO | Có published query/routes nhưng UI/CMS/integration chưa đóng |
| `[A]` | Services | `/services`, `/services/[slug]` | Services | service schema/query/mapper; media; published visibility | products, projects, contacts, SEO | Có query/routes; legacy view và backend coverage chưa đủ parity |
| `[A]` | Projects | `/projects`, `/projects/[slug]` | Projects | project schema/query/mapper; media; published visibility | products, services, CTA, SEO | Có read/write boundary và route; CMS/relations/parity chưa đóng |
| `[A]` | News | `/news`, `/news/[slug]` | News + Categories | news/category schema; published query; media; rich HTML policy | products, services, projects, events, SEO | Có query/routes và client islands; relation/parity chưa đóng |
| `[A]` | Events | `/events`, `/events/[slug]` | Events | event schema/query/mapper; media; published visibility | news, products, forms/customer requests, email | Có query/routes; registration/integration/parity chưa đóng |
| `[A]` | Contact/consultation | `/contact`, global consultation | Contacts, CTA, Forms, Customer Requests | form/CTA contract; validated submission; anti-spam/rate limit; persistence | staff assignment, email template/delivery, audit | Có Server Action nhưng end-to-end workflow chưa đủ bằng chứng |
| `[A]` | Public search | `/search` | Search projection | published read models của các domain được index; visibility/locale | ranking, SEO analytics | Có aggregate query; coverage phụ thuộc module nguồn |
| `[A]` | Menu/navigation | Header, Footer, route links | Menu | route registry; published menu query; locale | referenced content visibility, SEO redirects | Legacy navigation và Next route semantics đang cùng tồn tại |
| `[A]` | Legal/static content | `/privacy`, `/terms`, 404 | Static Pages/config hoặc approved static source | public shell; approved content authority | SEO, localization | Routes tồn tại; privacy/terms đang hard-code presentation content |
| `[A]` | Public widgets | chatbot, floating contact, consultation | Config, CTA/Forms/Requests | public shell; approved config/submission boundary | external webhook/chat provider, audit | Phần lớn vẫn legacy/client-config |

## CMS/business modules

| Status | Domain/module | CMS quản lý | Hard dependency | Soft/integration dependency | Hiện trạng quan sát |
|---|---|---|---|---|---|
| `[A]` | Dashboard | aggregates, notifications, work queues | CMS auth/RBAC; read models từ domain nguồn | analytics, audit, workflow queues | Có PostgreSQL aggregate; một số dataset vẫn demo/empty |
| `[A]` | CMS Global Search | tìm entity toàn CMS | CMS auth/RBAC; visibility projection từ domain nguồn | command palette, recent searches | Có server index nhưng coverage phụ thuộc module nguồn |
| `[I]` | Users/Identity | danh sách tài khoản CMS, hồ sơ/đăng nhập, trạng thái, role/phạm vi, quyền hiệu lực và lịch sử bảo mật | Supabase Auth; `cic_users.auth_user_id`; Roles & Permissions; server auth/RBAC | Auth/session security-event + presence/2FA producer | Core live và verified: list/filter/pagination, create/edit/status/reset, role/scope, lazy per-user history/security, Auth sync, Audit Writer, normalized uniqueness và DB/RLS. Không có Website public surface; delete/Trash và invite không thuộc scope đã duyệt. PENDING: Users → Auth/session producer → realtime online/last-visit/login-security/2FA. |
| `[C]` | Roles & Permissions | danh sách, tạo/sửa role, nhân sự được gán/gán nhân sự, ma trận task/action | users/identity; permission catalog; server enforcement | Menu permission catalogue; live Trash mutations; authenticated CMS roundtrip | Role/grant/assignment dùng projection và mutation thật + Audit atomic. Tạm loại task `menu/menus` vì live taxonomy còn legacy; xóa role chờ Trash restore/purge thật, không tạo nút xóa giả |
| `[A]` | System Configuration | workspace config, branch, secret settings | auth/RBAC; approved config schema; secret handling | media, audit, public config cache | Có query/actions cho một phần; module UI còn legacy |
| `[A]` | Function SEO & URL | route/module SEO, indexability, canonical, redirect | route registry; approved config/schema; locale | all public content, sitemap/search | Có locale query/action; redirect persistence chưa được chốt đủ |
| `[A]` | Localization | UI dictionary/progress/workspace | locale/workspace contract; auth/RBAC | all localized domains | CMS vẫn dùng demo dictionary ở nhiều flow |
| `[x]` | Activity Logs | append-only list/detail/filter/export; dashboard/user/entity projections | identity/actor; `audit.*` authorization; redaction/append-only writer; audit DB security/indexes | every governed mutation; dashboard/user/entity drawers; retention policy | Hardening pass: export metadata owner-scoped, CSV formula-safe, Settings mutation + audit atomic, artifact cleanup fail-closed, export CHECK constraints validated live; responsive gate 360/390/768/1024/1280/1440 pass |
| `[I]` | Trash | danh sách mục đã xóa, chi tiết snapshot, phục hồi an toàn, purge, bulk action; legal hold chỉ khi có policy thật | auth/RBAC với `trash.*`; secured `cic_trash_items`; PostgreSQL transaction; typed entity lifecycle registry; source adapter; Audit Writer | adapter cho các module ngoài Projects; media cleanup/reference count; retention worker; authenticated visual regression | Core live 2026-09-03: server list/detail/search/filter/pagination; restore/purge/bulk; projection redacted; permission/RLS/index/constraint hardening; typed registry và Projects VI adapter. DB roundtrip delete → snapshot → public removal → restore draft + relations → purge scrub + Audit pass. Next Trash runtime không còn mock/local-state. |
| `[A]` | Static Pages/Page Builder | page, version, section, preview/publish | auth/RBAC; page schema; media; published/draft read; rich HTML policy | products/news/CTA/forms references, audit, SEO | UI phức tạp vẫn dựa nhiều fixture/legacy adapters |
| `[A]` | News & Categories | article/category/editorial workflow | auth/RBAC; news/category schema; media; validation | SEO, audit/trash, related entities | Server read tồn tại; CMS data source vẫn chủ yếu demo |
| `[A]` | Events | event/editorial/registration links | auth/RBAC; event schema; media; validation | news/products, forms/requests/email, audit | Server read tồn tại; CMS vẫn fixture/mixed |
| `[A]` | Projects | project CRUD/relations | auth/RBAC; project schema; transaction; media | products/services, SEO, audit/trash | Delete/bulk delete VI đã nối typed Trash adapter, snapshot relation và Audit trong transaction; CMS data/parity còn chưa đóng toàn module |
| `[A]` | Products | product CRUD/publish/files/relations | auth/RBAC; product schema; Product Settings; media | services/projects, CTA/forms, SEO, audit/trash | Public read có; CMS chủ yếu demo source |
| `[A]` | Product Settings | categories, brands, applications, types, sales owners | auth/RBAC; approved taxonomy tables/relations | products usage impact, users/sales scope | Query boundary có; CMS còn demo source |
| `[A]` | Services | service CRUD/relations/version | auth/RBAC; service schema; media | products/projects/contacts, SEO, audit/trash | Read boundary có; CMS còn demo source |
| `[A]` | Menu | menu/group/item/tree/preview | auth/RBAC; menu schema; route/entity reference resolver | all public content, locale, SEO redirects | Query boundary có; CMS còn demo source |
| `[I]` | Media | assets, translations VI/EN, folders/albums, upload/replace/version/variant, used-by, archive/trash | auth/RBAC; private `cms-media` Storage; Media table RLS; Audit Registry/Writer; typed Trash snapshot contract | every content module, CMS search, CTA/forms, page builder | Core Media đã nối dữ liệu thật: explicit projections, signed private URLs, upload/metadata PATCH/folder/album/replace, permission server + UI, Audit, typed Trash adapter, live picker VI/EN và public resolver. Roundtrip create → update → public → trash → restore restricted pass. Integration còn lại: business modules chuyển raw legacy path sang Media ID; durable Storage purge/variant processor; authenticated browser visual regression. |
| `[A]` | Contacts/CRM Inbox | contact requests, PII, assignment, spam/duplicate | auth/RBAC + PII scope; contact schema; submission persistence | users/staff, services, audit, email | Read boundary có; CMS flow vẫn demo source |
| `[A]` | CTA | CTA lifecycle, placement, used-by | auth/RBAC; CTA schema; reference registry | Forms, Static Pages, Media, audit | Query boundary có; CMS còn demo source |
| `[A]` | Forms/Submissions | form builder, validation, submissions | auth/RBAC; form/field schema; validation; submission persistence | CTA, Customer Requests, Email, audit | Query boundary có; builder/submission integrations chưa đóng |
| `[A]` | Customer Requests | lifecycle, notes, assignment, history | auth/RBAC; request/state/note/event schema; Contacts/Forms source | email templates/delivery, audit, SLA | Query boundary có; CMS flow vẫn demo source |
| `[A]` | Email Templates | versioned template/activation/preview | auth/RBAC; approved template/version schema | forms/requests/events, delivery provider, audit | Query boundary có; CMS vẫn demo source |

### Audit Danh mục sản phẩm — 2026-09-04

- **Scope:** taxonomy sản phẩm VI/EN, cây cha–con, trạng thái/thứ tự, usage impact với Product, public filter/category projection và lifecycle CMS. Không gồm CRUD Product, Hãng, Lĩnh vực ứng dụng, Loại sản phẩm hoặc Người phụ trách.
- **Hard dependency đã có:** Auth/RBAC server context; `cic_products_categories*`; `cic_products_categories_rel*`; Product identity để đếm/phòng xóa; Audit Writer/Registry; Trash lifecycle registry. Khi implement phải thêm permission/action/entity contract và category Trash adapter trong chính module, không insert log/trash trực tiếp.
- **Soft dependency:** Media picker/resolver cho `image/icon/banner`; Function SEO; menu/home/footer placement. Media core đã dùng dữ liệu thật nên không block category core; consumer raw path được chuyển dần theo owner module.
- **Live DB:** VI 14 category/535 relation; EN 9 category/255 relation; 0 parent/relation orphan; PK kép và FK đúng workspace. Dataset hiện có 14/9 node gốc, nhưng schema/form phải giữ capability nhiều cấp. Alias hiện đủ và không trùng theo chuẩn hóa, song live DB chưa có unique normalized index.
- **Next:** route `/cms/product-settings/categories` và UI reference có thể giữ presentation; datasource demo, local-state mutation, `select('*')`, query gộp mọi Product Settings và save ép `parent_id=null/level=1` phải thay/refactor. Public `/products` hiện chưa dùng category relation/reference UI đầy đủ.
- **Implementation 2026-09-04:** Danh mục sản phẩm chuyển `[I]`: explicit VI/EN projections, normalized Product relation count, server validation/tree rebuild, create/PATCH/status/bulk/Trash/restore, permission server-side và Audit Writer đã nối dữ liệu thật. Public `/products` đọc category published từ cùng relation; roundtrip draft-hidden → publish-visible → trash-hidden → restore-inactive + Audit pass. Pending: public locale routing EN của toàn Website và authenticated browser screenshot regression (local 3001 timeout khi điều hướng qua các route); các nhóm Product Settings khác vẫn giữ trạng thái riêng, không được coi đã migrate theo category.

### Audit Hãng sản xuất — 2026-09-04

- **Scope:** master data Hãng VI/EN đúng form React reference: `name`, alias tự sinh/read-only, `published`, `ordering`; usage impact với Product và bộ lọc/nhãn hãng trên public Product. Không gồm CRUD Product hoặc trang public hãng độc lập (reference không có). `image/country/website/show_in_homepage` là cột legacy không thuộc ownership của form Hãng.
- **Live DB:** `cic_manufactories` 86 row/83 published; `cic_manufactories_en` 49/48; alias không thiếu. `country/website` đã tồn tại đúng hai bảng nhưng 0 row có dữ liệu. Product VI có 283/374 row gắn hãng, 73 giá trị ID khác nhau, không có giá trị phi số hoặc orphan.
- **Dependencies:** Auth/RBAC, Audit Writer, Trash registry và Product identity đã tồn tại; không có hard dependency ngoài module bị thiếu. Khi implement phải thêm normalized unique alias, typed Trash adapter và action/entity audit trong transaction, không xây lại foundation. Media không phải dependency của form Hãng vì reference không có trường media.
- **Next:** `/cms/product-settings/brands` đang dùng `ProductSettingsManager` với mock/local mutation và query Product Settings gộp; public Product đã đọc `manufactory_name` nhưng chưa có shared Brand projection. Kết luận audit: `READY_TO_IMPLEMENT`.
- **Implementation `[x]` 2026-09-05:** contract CMS và mutation đã được thu hẹp đúng bốn field form-owned; public Product resolve tên Hãng published từ cùng nguồn PostgreSQL; create/PATCH/status/Trash/restore và Audit dùng server permission. PATCH không select/write các cột legacy ngoài form; Trash chỉ snapshot chúng nội bộ để phục hồi nguyên trạng. Roundtrip DB thật pass, gồm draft/public/publish/Product relation/usage guard/Trash/restore/Audit và bảo toàn field legacy; CMS form + public header/hero/footer regression đã kiểm tra tại local 3001. Trạng thái `[A]` của Product Settings tổng vẫn giữ nguyên vì các nhóm applications/types/sales owners là module độc lập chưa hoàn tất.

### Audit Lĩnh vực ứng dụng — 2026-09-08

- **Scope:** master data Lĩnh vực ứng dụng VI/EN theo đúng form React reference (`name`, alias tự sinh/read-only, `published`, `ordering`), usage impact với Product, bộ lọc “Ứng dụng” trên Product listing và badge trên Product detail. Không có bằng chứng về route public application độc lập; không tự tạo listing/detail/hero/gallery/CTA.
- **Live DB 2026-09-08:** `cic_application` có 13 row (12 published), `cic_application_en` có 11 (9 published); junction `cic_products_applications_rel`/`_en` đã tồn tại đủ 249/89 relation và không còn orphan. Ba identity legacy bị xóa đã được bảo toàn bằng stub unpublished: VI `8` (7 relation), EN `13`,`14` (mỗi ID 1 relation); stub cố ý có alias rỗng và không được public render. Các cột `image/color_code/description/content/code` chưa có dữ liệu sử dụng; alias hiện mới có index thường, chưa unique.
- **Data-quality follow-up, không block core:** tên nghiệp vụ thật của ba stub chưa có nguồn authority để phục hồi. Implementation phải giữ nguyên ID/relation, không cho stub vào public option, không tự sinh nhãn/default và không dùng `application_name`/mock fallback; chỉ thay stub khi có quyết định dữ liệu có thẩm quyền.
- **Dependencies:** Auth/RBAC, Audit Writer/Registry, Trash registry và Product identity/parser đã tồn tại nhưng Application cần action/entity registry, typed Trash adapter, normalized unique alias/sequence hardening trong bước implement. Media không phải dependency của form hiện được duyệt vì React không render media/icon/color control.
- **Next:** giữ presentation CMS/public; refactor route-specific dataset và shared Application projection; replace demo/local mutation, `application_name` authority và mock `usage_count`; remove `sector_group/color_badge/icon` khỏi input contract vì chỉ có trong type/mock payload, không có form control. Public detail Next hiện là article tối giản riêng, phải **REPLACE** bằng composition bám `ProductDetailView` khi Product consumer được nối. Audit đủ điều kiện bắt đầu nhưng chưa implement: `READY_TO_IMPLEMENT`.
- **Implementation `[I]` 2026-09-08:** Application VI/EN có domain/input schema, projection riêng, server query/repository/action, normalized unique alias + sequence hardening, permission-guarded create/PATCH/status/bulk/Trash, typed lossless Trash adapter và Audit registry/writer. CMS route `/cms/product-settings/applications` đọc DB thật, giữ list/search/status/pagination/drawer/modal reference và không còn demo/local mutation. Public Product list/detail resolve tên Application published từ junction thật; `/products/[slug]` dùng lại `ProductsView`/`ProductDetailView`. DB roundtrip pass cho draft/publish/Product consumer/relation guard/Trash/restore/Audit và bảo toàn legacy fields; junction 249/89, 0 orphan, fixture sạch. Còn integration Product presentation: một Product nhiều Application hiện hiển thị nhãn ghép theo reference type một `app`, chưa tách thành nhiều facet độc lập; authenticated CMS browser regression chưa có session. Không sửa React reference hoặc mở rộng refactor Product trong module này, nên chưa `[x]`.

### Audit Loại sản phẩm — 2026-09-08

- **Scope:** master data Loại sản phẩm VI/EN, CMS list/create/edit/status/order/usage, selector trong form Product, filter “Loại sản phẩm” và nhãn trên public Product. Không có bằng chứng về route public loại sản phẩm độc lập; không tạo listing/detail/hero/gallery/CTA riêng.
- **Live DB:** `cic_products_types` và `_en` đều có 4 row, toàn bộ published, tên/alias đầy đủ; `image/description/tablenames/updated_time` đều chưa có dữ liệu. `cic_products.types_id → cic_products_types.id` và bản EN → `_en` có FK thật, 0 orphan. Usage VI: Phần mềm 211, Thiết bị 72, Giải pháp tích hợp/Khác 0; 92 Product VI chưa gắn loại. Usage EN: Softwares 143, Devices 17, hai loại còn lại 0; 32 Product EN chưa gắn loại.
- **Data-quality:** 148 Product EN có `types_name` khác identity EN (131 row ID 1 vẫn lưu “Phần mềm”, 17 row ID 2 lưu “Thiết bị”). `types_id` + bảng master đúng locale là authority; không dùng `types_name`, hard-code hoặc suy loại từ tên Product làm fallback. Alias hiện chỉ có index thường, chưa unique normalized; `updated_time` đã có nhưng legacy đều NULL.
- **Dependencies:** Auth/RBAC, Product identity/FK, Audit Writer/Registry và typed Trash registry đã tồn tại nên không block. Khi implement phải bổ sung action/entity registry và adapter Trash riêng trong module. Media không thuộc form Loại sản phẩm đã duyệt.
- **Next hiện tại:** `/cms/product-settings/product-types` rơi vào `ProductSettingsManager` + `demoCatalogDataSource`, local mutation/mock usage và mock-only fields. Public `/products` dùng `PRODUCT_TYPES` hard-code, `types_name` và heuristic theo tên sản phẩm. Giữ presentation/reference; tách route/query/domain; replace data authority/mutation/inference; không import nguyên mega-component vào server/domain.
- **Kết luận audit:** hard dependency đã có và đủ thông tin để bắt đầu implementation; module vẫn `[A]`, chưa implement và chưa complete. `READY_TO_IMPLEMENT`.
- **Implementation `[I]` 2026-09-08:** Đã tách feature/domain Loại sản phẩm VI/EN với projection CMS/public riêng, validation, repository/action server-only và normalized unique alias/sequence hardening. CMS `/cms/product-settings/product-types` đọc PostgreSQL thật, có search/status/pagination, create/PATCH đúng form chung (`name/alias/published/ordering`), bulk deactivate, usage count, permission server, relation guard, Audit Writer và typed lossless Trash restore inactive. `image` không thuộc form/input và được bảo toàn như field legacy. Public Product resolve nhãn/bộ lọc qua `cic_products.types_id → cic_products_types`, đã bỏ `types_name`, mảng hard-code và heuristic theo tên. DB roundtrip thật pass draft/publish/public Product/relation guard/Trash/restore/Audit và bảo toàn `image/description/tablenames`; build, typecheck, boundary check và browser regression desktop/mobile pass. **Pending integration:** form Product CMS vẫn thuộc module Products chưa migrate và còn lấy master data từ demo source; khi Products được triển khai phải dùng `listPublishedProductTypes`/ID relation này. Product Settings tổng vẫn giữ `[A]`; riêng Loại sản phẩm là `[I]`, không nâng `[x]` vì integration Product CMS chưa đóng.

## Foundation/cross-module

| Status | Foundation | Hard dependency đối với | Ghi chú audit |
|---|---|---|---|
| `[A]` | Environment, server-only DB/Supabase clients, transaction | mọi persistence module | Foundation có nhưng cần schema/runtime verification theo môi trường thật |
| `[A]` | Authentication, identity bridge, authorization guard | toàn CMS và mutation nhạy cảm | Phải enforce server-side; UI hiding không đủ |
| `[A]` | Domain type + query + mapper + ViewModel convention | mọi public/CMS data module | Không để DB row hoặc CMS presentation type thành domain contract |
| `[A]` | Shared validation/error/result contract | mọi mutation/submission | Client validation chỉ hỗ trợ UX |
| `[A]` | Locale/workspace convention | mọi domain VI/EN | Không fallback chéo locale nếu capability không cho phép |
| `[A]` | Media/storage/reference contract | content/catalog/page builder | Upload, replacement, reference integrity và cleanup phải có owner rõ |
| `[A]` | Publish/Draft/Preview + cache/revalidation | content/catalog/public reads | Public chỉ đọc Published; preview không dùng public cache |
| `[A]` | Audit event writer | mọi mutation governed | Append-only, redaction, không ghi secret/credential/raw PII |
| `[A]` | Trash/entity lifecycle contract | mọi entity deletable | Restore relation/media conflict phải định nghĩa theo entity |
| `[A]` | Rich HTML/editor sanitation policy | news/services/projects/events/pages | Sanitize server-side và giữ visual output |
| `[A]` | Route/entity reference registry | menu, SEO, search, page references | Tránh string/path logic phân tán |
| `[A]` | Observability, pagination, caching and revalidation | cross-module | Chỉ abstraction theo use case thật |
| `[A]` | Visual/behavior regression harness | mọi module | So React reference theo route, breakpoint và interaction state |

## Dependency rule

### HARD DEPENDENCY

Không có dependency thì module không thể hoạt động đúng. Module phải chờ dependency thật; không được dùng mock, fake repository, fake component, hard-coded response hoặc bypass authorization để đánh dấu core/complete.

Ví dụ: Products cần taxonomy + media + published query; CMS mutation cần auth/RBAC + validation + persistence; public submission cần form/CTA contract + persistence + abuse protection.

### SOFT/INTEGRATION DEPENDENCY

Core module vẫn hoạt động đúng độc lập, nhưng projection/workflow liên module chưa hoàn thiện. Có thể để pending và dùng `[I]` chỉ khi core thật đã đạt `[C]`.

Ví dụ: Product core có thể hoạt động trước related projects; News core có thể hoạt động trước recommendation projection. Nếu integration là yêu cầu bắt buộc của CMS functional docs hoặc public reference, nó không còn là soft gate để lên `[x]`.

## Quy tắc nâng trạng thái

1. `[A] → [C]`: có implementation thật cho core, DB contract đúng, không mock hard dependency, auth/validation đúng và core UI/behavior đã kiểm chứng.
2. `[C] → [I]`: core đạt, chỉ còn integration được phân loại soft và có owner/gate rõ.
3. `[C]` hoặc `[I] → [x]`: mọi integration bắt buộc, permission, persistence, relation/media/SEO/rich-text và visual/behavior parity đã đóng.
4. Build/typecheck/route existence hoặc query chạy riêng lẻ không đủ để nâng trạng thái.
