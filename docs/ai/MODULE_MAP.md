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
| `[A]` | Users/Identity | account/profile/lifecycle/security | Supabase Auth; `cic_users` bridge; server auth; permission model | audit, notification/email | Có query/actions; chưa kiểm chứng toàn workflow/integration |
| `[A]` | Roles & Permissions | role, task, matrix, assignment, review | users/identity; permission catalog; server enforcement | audit, access review schedule | Có query/actions; chưa chứng minh enforcement toàn CMS |
| `[A]` | System Configuration | workspace config, branch, secret settings | auth/RBAC; approved config schema; secret handling | media, audit, public config cache | Có query/actions cho một phần; module UI còn legacy |
| `[A]` | Function SEO & URL | route/module SEO, indexability, canonical, redirect | route registry; approved config/schema; locale | all public content, sitemap/search | Có locale query/action; redirect persistence chưa được chốt đủ |
| `[A]` | Localization | UI dictionary/progress/workspace | locale/workspace contract; auth/RBAC | all localized domains | CMS vẫn dùng demo dictionary ở nhiều flow |
| `[x]` | Activity Logs | append-only list/detail/filter/export; dashboard/user/entity projections | identity/actor; `audit.*` authorization; redaction/append-only writer; audit DB security/indexes | every governed mutation; dashboard/user/entity drawers; retention policy | Hardening pass: export metadata owner-scoped, CSV formula-safe, Settings mutation + audit atomic, artifact cleanup fail-closed, export CHECK constraints validated live; responsive gate 360/390/768/1024/1280/1440 pass |
| `[A]` | Trash | soft delete/restore/purge/legal hold | auth/RBAC; trash schema; per-entity delete/restore contract | all deletable modules, audit, media cleanup | Read boundary có; integration từng entity chưa đóng |
| `[A]` | Static Pages/Page Builder | page, version, section, preview/publish | auth/RBAC; page schema; media; published/draft read; rich HTML policy | products/news/CTA/forms references, audit, SEO | UI phức tạp vẫn dựa nhiều fixture/legacy adapters |
| `[A]` | News & Categories | article/category/editorial workflow | auth/RBAC; news/category schema; media; validation | SEO, audit/trash, related entities | Server read tồn tại; CMS data source vẫn chủ yếu demo |
| `[A]` | Events | event/editorial/registration links | auth/RBAC; event schema; media; validation | news/products, forms/requests/email, audit | Server read tồn tại; CMS vẫn fixture/mixed |
| `[A]` | Projects | project CRUD/relations | auth/RBAC; project schema; transaction; media | products/services, SEO, audit/trash | Có query/actions; integration/parity chưa đóng |
| `[A]` | Products | product CRUD/publish/files/relations | auth/RBAC; product schema; Product Settings; media | services/projects, CTA/forms, SEO, audit/trash | Public read có; CMS chủ yếu demo source |
| `[A]` | Product Settings | categories, brands, applications, types, sales owners | auth/RBAC; approved taxonomy tables/relations | products usage impact, users/sales scope | Query boundary có; CMS còn demo source |
| `[A]` | Services | service CRUD/relations/version | auth/RBAC; service schema; media | products/projects/contacts, SEO, audit/trash | Read boundary có; CMS còn demo source |
| `[A]` | Menu | menu/group/item/tree/preview | auth/RBAC; menu schema; route/entity reference resolver | all public content, locale, SEO redirects | Query boundary có; CMS còn demo source |
| `[A]` | Media | assets, folders/albums, upload/replace/archive | auth/RBAC; storage policy; media metadata schema; upload validation | every content module, trash/audit | Query boundary có; picker/library vẫn dùng demo ở nhiều nơi |
| `[A]` | Contacts/CRM Inbox | contact requests, PII, assignment, spam/duplicate | auth/RBAC + PII scope; contact schema; submission persistence | users/staff, services, audit, email | Read boundary có; CMS flow vẫn demo source |
| `[A]` | CTA | CTA lifecycle, placement, used-by | auth/RBAC; CTA schema; reference registry | Forms, Static Pages, Media, audit | Query boundary có; CMS còn demo source |
| `[A]` | Forms/Submissions | form builder, validation, submissions | auth/RBAC; form/field schema; validation; submission persistence | CTA, Customer Requests, Email, audit | Query boundary có; builder/submission integrations chưa đóng |
| `[A]` | Customer Requests | lifecycle, notes, assignment, history | auth/RBAC; request/state/note/event schema; Contacts/Forms source | email templates/delivery, audit, SLA | Query boundary có; CMS flow vẫn demo source |
| `[A]` | Email Templates | versioned template/activation/preview | auth/RBAC; approved template/version schema | forms/requests/events, delivery provider, audit | Query boundary có; CMS vẫn demo source |

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
