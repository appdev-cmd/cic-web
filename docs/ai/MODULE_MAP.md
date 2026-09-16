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
| `[I]` | About/company/partners | `/about`, `/gioi-thieu/*` | Static Pages/Page Builder | public shell; published about snapshot | products, services, media, partner assets, awards | Hoàn tất core implementation 2026-09-16: Tạo `aboutResolver.ts` map đủ 8 sections (about), 2 sections (organization), 4 sections (capacity_experience) từ DB với fail-safe fallback; Chuẩn hóa route `/gioi-thieu` (slug DB) và redirect 301 từ `/about`; Đồng bộ Visual Canvas CMS; Server action revalidate; Soft integration: các liên kết external flipbook PDF và form tư vấn popup |
| `[I]` | Products | `/products`, `/products/[slug]` | Products + Product Settings | product schema/query/mapper; taxonomy; media; published visibility | projects, services, CTA/forms, SEO | Core DB-backed: published list/detail, gallery/files/relations; CTA submission còn integration pending |
| `[I]` | Services | `/services`, `/services/[slug]` | Services | service schema/query/mapper; media; published visibility | products, projects, contacts, SEO | Core DB-backed: danh sách, chi tiết, quan hệ sản phẩm, form tư vấn nối submitCustomerInteractionAction thật vào DB; SEO/public EN routing còn pending |
| `[I]` | Projects | `/projects`, `/projects/[slug]` | Projects | project schema/query/mapper; media; published visibility | products, services, CTA, SEO | Core DB-backed: danh sách studio portfolio 2 cột bất đối xứng 7-5/5-7, chi tiết 8/4, factsheet, công nghệ, quan hệ sản phẩm & dịch vụ, 3 dự án liên quan cùng sector, consultation modal; public EN routing còn pending |
| `[I]` | News | `/news`, `/news/[slug]` | News + Categories | news/category schema; published query; media; rich HTML policy | public EN locale routing; Home/Header binding; authenticated visual regression | Core DB-backed list/detail/CMS đã hoàn thành; các integration nêu rõ vẫn pending |
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
| `[I]` | System Configuration | workspace config, branch, reviewed non-secret settings | auth/RBAC `settings.view/edit`; approved Settings manifest; config/branch schema | Media selector; public Contact consumer | Core 2026-09-14: CMS direct-save, manifest projection, transactional Audit, structured VI/EN branches và published Footer projection đã hoàn tất. `PENDING: System Configuration → Media → chọn/tải logo mới qua Media foundation; Contact → published branch projection → trang Contact vẫn thuộc integration task riêng.` |
| `[A]` | Function SEO & URL | route/module SEO, indexability, canonical, redirect | route registry; approved config/schema; locale | all public content, sitemap/search | Có locale query/action; redirect persistence chưa được chốt đủ |
| `[A]` | Localization | UI dictionary/progress/workspace | locale/workspace contract; auth/RBAC | all localized domains | CMS vẫn dùng demo dictionary ở nhiều flow |
| `[x]` | Activity Logs | append-only list/detail/filter/export; dashboard/user/entity projections | identity/actor; `audit.*` authorization; redaction/append-only writer; audit DB security/indexes | every governed mutation; dashboard/user/entity drawers; retention policy | Hardening pass: export metadata owner-scoped, CSV formula-safe, Settings mutation + audit atomic, artifact cleanup fail-closed, export CHECK constraints validated live; responsive gate 360/390/768/1024/1280/1440 pass |
| `[I]` | Trash | danh sách mục đã xóa, chi tiết snapshot, phục hồi an toàn, purge, bulk action; legal hold chỉ khi có policy thật | auth/RBAC với `trash.*`; secured `cic_trash_items`; PostgreSQL transaction; typed entity lifecycle registry; source adapter; Audit Writer | adapter cho các module ngoài Projects; media cleanup/reference count; retention worker; authenticated visual regression | Core live 2026-09-03: server list/detail/search/filter/pagination; restore/purge/bulk; projection redacted; permission/RLS/index/constraint hardening; typed registry và Projects VI adapter. DB roundtrip delete → snapshot → public removal → restore draft + relations → purge scrub + Audit pass. Next Trash runtime không còn mock/local-state. |
| `[A]` | Static Pages/Page Builder | page, version, section, preview/publish | auth/RBAC; page schema; media; published/draft read; rich HTML policy | products/news/CTA/forms references, audit, SEO | UI phức tạp vẫn dựa nhiều fixture/legacy adapters |
| `[I]` | News | article/editorial workflow | auth/RBAC; news schema; media; validation; unique alias + atomic placement invariant | Home/Header binding, public EN locale routing, authenticated visual regression | Core DB-backed CMS/Public, Audit/Trash/Media và roundtrip đã pass; không còn runtime mock trên route News |
| `[I]` | News Categories | category tree, VI/EN CRUD, publish/home visibility, SEO/media | auth/RBAC `news`; news/category schema; media; Audit/Trash | Page Builder/Home/Header binding; Function SEO/sitemap; full News completion | Core DB-backed: CMS VI/EN, public filter, explicit projections, guarded transactional mutation, Audit/Trash và normalized alias index; soft integrations còn pending |
| `[I]` | Events | event/editorial/registration links, CMS VI/EN CRUD, public list/detail view | auth/RBAC; event schema; media; validation | news/products, forms/requests/email, audit | Core DB-backed: migration hardening (alias unique, end_time > time_event constraint, 1 featured event policy, sequence sync), CMS VI/EN với Server Actions + permission enforcement, PageMediaPickerModal nối Media, SearchableMultiSelect tin tức/sản phẩm liên quan, Trash adapter + Audit logging, Public website `/events` và `/events/[slug]` nối EventsRuntimeView trực tiếp DB thật. |
| `[I]` | Events | event/editorial/registration links, CMS VI/EN CRUD, public list/detail view | auth/RBAC; event schema; media; validation | news/products, forms/requests/email, audit | Core DB-backed: migration hardening (alias unique, end_time > time_event constraint, 1 featured event policy, sequence sync), CMS VI/EN với Server Actions + permission enforcement, PageMediaPickerModal nối Media, SearchableMultiSelect tin tức/sản phẩm liên quan, Trash adapter + Audit logging, Public website `/events` và `/events/[slug]` nối EventsRuntimeView trực tiếp DB thật. |
| `[I]` | Projects | project CRUD/relations | auth/RBAC; project schema; transaction; media | products/services, SEO, audit/trash | Core DB-backed: CMS nối DB thật qua API & Server Actions, CRUD/bulk actions với RBAC, modal preview 3 thiết bị, toggle dự án nổi bật cap-3 policy, relation selector sản phẩm/dịch vụ từ DB, Trash adapter + Audit roundtrip. |
| `[I]` | Products | product CRUD/publish/files/relations | auth/RBAC; product schema; Product Settings; media | services/projects, CTA/forms, SEO, audit/trash | CMS VI/EN đã dùng DB thật, permission/Audit/Trash/transaction; CTA workflow còn pending |
| `[A]` | Product Settings | categories, brands, applications, types, sales owners | auth/RBAC; approved taxonomy tables/relations | products usage impact, users/sales scope | Query boundary có; CMS còn demo source |
| `[I]` | Services | service CRUD/relations/version | auth/RBAC; service schema; media | products/projects/contacts, SEO, audit/trash | Core DB-backed: CMS VI/EN lấy dữ liệu thật, CRUD/Bulk Actions với Server Actions + permission enforcement, PageMediaPickerModal nối Media Foundation, SearchableMultiSelect sản phẩm liên quan, Trash adapter + Audit roundtrip. |
| `[A]` | Menu | menu/group/item/tree/preview | auth/RBAC; menu schema; route/entity reference resolver | all public content, locale, SEO redirects | Query boundary có; CMS còn demo source |
| `[I]` | Media | assets, translations VI/EN, folders/albums, upload/replace/version/variant, used-by, archive/trash | auth/RBAC; private `cms-media` Storage; Media table RLS; Audit Registry/Writer; typed Trash snapshot contract | every content module, CMS search, CTA/forms, page builder | Core Media đã nối dữ liệu thật: explicit projections, signed private URLs, upload/metadata PATCH/folder/album/replace, permission server + UI, Audit, typed Trash adapter, live picker VI/EN và public resolver. Roundtrip create → update → public → trash → restore restricted pass. Integration còn lại: business modules chuyển raw legacy path sang Media ID; durable Storage purge/variant processor; authenticated browser visual regression. |
| `[A]` | Contacts/CRM Inbox | contact requests, PII, assignment, spam/duplicate | auth/RBAC + PII scope; contact schema; submission persistence | users/staff, services, audit, email | Read boundary có; CMS flow vẫn demo source |
| `[I]` | CTA | CTA lifecycle, placement, used-by | auth/RBAC; CTA schema; reference registry | Forms, Static Pages, Media, audit | Core DB-backed: Seeded 14 CTAs (7 VI + 7 EN) vào bảng `cic_ctas`; domain types & server queries (`listCtas`, `getCtaById`, `getCtaByCode`), mutations (`createCta`, `updateCta`, `updateCtaStatus`, `deleteCtas`) kèm Audit Writer (`cta.created`, `cta.updated`, `cta.status_changed`, `cta.trashed`); API routes CMS (`/api/cms/cta`, `/api/cms/cta/[id]`, `/api/cms/cta/bulk-delete`); CtaScreen & CtaRoute tích hợp CMS catch-all `/cms/cta`; CtaManager nối API thật với bảo vệ CTA hệ thống (`is_system = true`), quyền hạn RBAC, tra cứu liên kết Thư viện Media & Biểu mẫu. Pending: Runtime dynamic placement trên Static Pages & Public page rendering. |
| `[I]` | Forms/Submissions | form builder, validation, submissions | auth/RBAC; form/field schema; validation; submission persistence | CTA, Customer Requests, Email, audit | Core DB-backed: Seed 8 forms hệ thống & mẫu (4 VI + 4 EN) với `cic_forms` và `cic_form_fields`; domain types & server queries (`listForms`, `getFormById`, `getFormSubmissions`), mutations transaction (`createForm`, `updateForm`, `updateFormStatus`, `deleteForms`) kèm Audit Writer (`form.created`, `form.updated`, `form.status_changed`, `form.trashed`); API routes CMS; FormManager nối API thật; FormSubmissionsModal tải submissions thật; mount FormsRoute trên CMS catch-all page `/cms/forms`. Soft pending: CTA runtime action embedding & public form submit trigger gửi email thông báo thật qua Nodemailer. |
| `[I]` | Customer Requests | lifecycle, notes, assignment, history | auth/RBAC; request/state/note/event schema; Contacts/Forms source | email templates/delivery, audit, SLA | Core DB-backed: Unified read model (UNION ALL cic_contact, cic_product_contact, cic_order, cic_form_submissions, cic_contact_en) + overlay tables (cic_customer_request_states, cic_customer_request_notes, cic_customer_request_events), CMS VI/EN kết nối API/Route thật, phân trang, lọc đa điều kiện, chuyển trạng thái/độ ưu tiên/tags, ghi chú nội bộ, phân công nhân sự từ cic_users. Public submit sync overlay tự động. Soft pending: trigger email thông báo nhân sự khi phân công, SLA alert worker. |
| `[I]` | Email Templates | versioned template/activation/preview | auth/RBAC; approved template/version schema | forms/requests/events, delivery provider, audit | Core DB-backed: seed 58 templates từ legacy `cic_email` & `cic_email_en` + bộ chuẩn, CMS kết nối API thật, CRUD/versioning/publish/duplicate/archive, preview sample data, usage lookup; Nodemailer transporter & token dispatcher (`lib/mail.ts`). Pending: Trigger tự động khi Form/CTA submit DB thật và SMTP production credentials. |

### Audit Trang nội dung – Core — 2026-09-15

- **A. Scope:** CMS `/cms/static-pages` (alias `/cms/pages`), Page list/create legal, visual Section editor, Draft preview, Publish/history; public consumers là `/`, nhóm Giới thiệu, `/privacy`, `/terms` và legal page tạo thêm. Theo functional authority, Contact không thuộc Page Builder mà dùng Settings/Branches + Contact Form. Không audit sâu module entity được tham chiếu.
- **B. UI Reference Map:** list giữ header/count/workspace, create CTA, search, Draft/Published filter, desktop table/mobile cards, pagination, preview/edit và create-legal modal. Editor giữ back/title/slug, Desktop–Tablet–Mobile switch, undo/redo/history, Save Draft/Preview/Publish, canvas dùng component website thật, section inspector, validation, Media/CTA/Form/entity picker, collection/reference controls và preview overlay. Template Home gồm Hero/Intro/Stats/Awards/Ecosystem/Projects/Events/News/Partners/CTA; About gồm hero/overview/timeline/strategy/offerings/awards/partners/organization/capacity/experience/software+hardware partners/CTA; legal chỉ có header + rich body.
- **C. Legacy classification:** `REUSE_PRESENTATION` cho CMS primitives, `RichTextEditor`, picker/modal shell và public components khi nhận read-model sạch; `EXTRACT_AND_REBUILD` cho list/editor/canvas binding, validation và preview composition; `REFERENCE_ONLY` cho `pageBuilderMockData.json`, `pageBuilderData.ts`, `staticPagesData.ts`, local create/save/publish/history/toast, hard-coded CTA/Form options và DOM-overlay inference. Không import nguyên editor/canvas mega-component làm server/domain contract.
- **D. CMS capability:** page hệ thống không xóa/đổi template; chỉ tạo thêm `legal_standard`; workspace VI/EN độc lập; save Draft, authenticated Draft preview, publish immutable snapshot, history restore thành Draft mới; sửa allowlisted config và ordered references. Functional authority cho phép reference `auto featured` hoặc `manual`; không có approval workflow, arbitrary template/section creation hay layout/CSS editor.
- **E/F. DB + Field Usage:** live có đủ `cic_content_pages`, revisions, sections, references nhưng cả bốn bảng đều **0 row**; `cic_contents` 12 và `_en` 9 chỉ là nguồn legacy-preserve/import có kiểm soát. Page identity/template/pointers là operational/system; revision SEO/state/timestamps là editable/system/audit; section key/type/position là registry-owned, chỉ `config` allowlist editable; reference entity/type/position là relation. `hits/rating/tags/display_*` legacy không vào contract mới. Projection phải tách CMS list, CMS Draft/detail, preview, public Published và entity lookup; không `select *`.
- **G. Runtime authority:** CMS hiện vẫn VI mock/local state, EN rỗng; create/save/publish/history chỉ đổi React state. `getStaticPagesData()` query DB thật nhưng `select('*')`, không có consumer cho route CMS và không compose revision/section. Public Home dùng legacy fixture; About đọc config khác; Privacy/Terms hard-code; không public route nào đọc Published Page snapshot. Target authority duy nhất: PostgreSQL → repository/domain registry → CMS/Public renderer, không fallback mock.
- **H/I. Shared domain + boundary:** share page/workspace/status/template registry, section/config validation, reference-source rule, read models và mapper; không share CMS UI. Server sở hữu DB/auth/RBAC/transaction/publish snapshot/reference validation/sanitize/revalidation; client chỉ giữ canvas selection, undo/redo chưa lưu, viewport, picker/modal và unsaved Draft. Hiện toàn module ở lazy client boundary và server query chưa được wire.
- **J. Hard dependencies:** schema/transaction/Auth/Media/Audit và các entity module cơ bản tồn tại. Còn thiếu (1) permission catalogue chuẩn `static_pages` cho `view/edit/preview/publish/create_legal`; live chỉ có task legacy `contents` với action `add/save/remove/apply/published/unpublished`; (2) approved persistence contract cho `reference.source.mode` auto/manual vì functional doc yêu cầu nhưng bảng reference không lưu source; (3) approved VI/EN page/template seed + legacy import manifest, trong khi bốn bảng core đều rỗng. Không fake từ mock.
- **K. Soft dependencies:** Product/News/Service/Project/Event/Partner availability and ordering, CTA/Form, Function SEO/sitemap/menu, global search, Trash cho legal page tạo thêm và visual regression. Contact/Branches là owner khác, không phải Page Builder dependency.
- **L. Next classification:** `KEEP` CMS routing/shell, public components, content resolver direction và registry concepts; `REFACTOR` explicit projections, domain types ngoài CMS, shared server validation and batched hydration; `REPLACE` mock/local mutations, `select('*')`, static entity/media options, hard-coded CTA/Form IDs, legacy public sources; `REMOVE` fake Date.now IDs, fake version/history/success và Contact template khỏi production Page Builder scope.
- **M. Responsive:** `KEEP` desktop canvas hierarchy, card/table modes và 3-device preview intent; `ADAPT` action bar/viewport controls/inspector to wrap or local-scroll, mobile canvas collapse and table→card; `FIX` modal/popover viewport bounds, focus trap/Escape/scroll lock, long slug/copy, touch targets, fixed-position popover coordinates and reduced-motion; `DO_NOT_COPY` hover-only editing, desktop-dense inspector on mobile, unbounded overlay and DOM order manipulation as persistence logic.
- **N. Cross-cutting:** server authorization required for every CMS read/mutation; Save/Publish/Create/restore must Audit after atomic business operation; rich HTML sanitized server-side; Media stores asset IDs; reference resolver validates existence/locale/published at Publish and hydrates in batch. Trash applies only to deletable legal pages after adapter/guard is defined; system pages are not deletable.
- **O. i18n:** `BILINGUAL_CONTENT`; workspace VI/EN independent, no fallback/auto-translation/ID pairing. Current mock only supplies VI and is not production authority.
- **P. Implementation order:** close reference-source + page seed manifest → publish RBAC task → explicit domain/projections → transactional Draft/Publish/Create Legal + Audit → Media/entity resolver → CMS wiring → public Published composition → Trash where applicable → roundtrip/responsive regression.
- **Q. Acceptance:** no runtime mock or `select *`; server-enforced fixed templates/sections/config/reference limits; auto/manual source persisted deterministically; Draft invisible public; preview authorized; Publish immutable and atomic; VI/EN isolated; public surfaces read same Published source; batch hydration/no N+1; system pages protected; Audit/Media/Trash/RBAC and responsive states pass.
- **Unblock decision 2026-09-15:**
  - RBAC: Task `static_pages` (id 90) đã được publish vào `cic_permission_tasks` với 5 capabilities: `view,edit,preview,publish,create_legal`.
  - Reference Source: Chuẩn hóa persistence contract `referenceSource: { mode: 'manual' | 'auto_featured' }` trong `cic_content_page_sections.config`.
  - Seed & Manifest: Seed thành công 12 canonical pages (6 VI + 6 EN) vào `cic_content_pages` (Contact đã loại hoàn toàn khỏi Page Builder scope, thuộc System Settings/Branches + Contact Form); seed 12 revisions và 56 sections; `privacy_policy` (VI) seed `PUBLISHED_FROM_APPROVED_LEGACY` từ `cic_contents` ID 12, 11 trang còn lại ở trạng thái `DRAFT_ONLY`.
  - Legacy manifest: Phân loại đầy đủ 12 bản ghi VI và 9 bản ghi EN.
- **Kết luận:** Giữ `[A]` (Audited & Unblocked). **READY_TO_IMPLEMENT**.


### Audit Trang chủ và Page Builder Trang chủ — 2026-09-16

- **A. Scope & Boundaries:**
  - Public Website surface: Tuyến đường `/` (Trang chủ tiếng Việt) và `/en` (Trang chủ tiếng Anh).
  - CMS Page Builder surface: Quản lý bản ghi `code = 'home'` (VI: ID 1, EN: ID 7, `template_key = 'home'`, `system_defined = true`) tại `/cms/static-pages`.
  - Cấu trúc gồm chính xác 10 Sections theo thứ tự: `home.hero`, `home.intro`, `home.stats`, `home.awards`, `home.ecosystem`, `home.projects`, `home.events`, `home.news`, `home.partners`, `home.contact_cta`.
  - Giới hạn: Trang chủ là consumer (bộ tổng hợp dữ liệu) hiển thị; không sở hữu nghiệp vụ gốc của các module liên kết (`cic_projects`, `cic_event`, `cic_news`, `cic_banners`, `cic_forms`).
- **B. UI Reference Map (10 Sections):**
  1. `home.hero`: Carousel banner mở đầu, tiêu đề HTML rich-text, phụ đề, nút CTA kép ("Khám phá giải pháp", "Về chúng tôi"), ticker thông báo "HOT NEWS" chạy chữ marquee.
  2. `home.intro`: Giới thiệu 35 năm đồng hành, 2 đoạn văn tóm lược, video popover (YouTube modal), ảnh đại diện doanh nghiệp, nút tải hồ sơ năng lực.
  3. `home.stats`: Bốn chỉ số thống kê năng lực quy mô (35+ Năm kinh nghiệm, 300+ Giải pháp, 5000+ Dự án, 100+ Đối tác).
  4. `home.awards`: Slider danh sách bằng khen, huân chương, cúp Sao Khuê / VIFOTEC.
  5. `home.ecosystem`: Hệ sinh thái 6 mảng công nghệ (AI, BIM/Digital Twins, Phần mềm, Thiết bị, Net Zero, Tư vấn & Đào tạo) với điều hướng chuyên biệt.
  6. `home.projects`: Lưới 3 dự án tiêu biểu (Landmark 81, Cao tốc Bắc - Nam, Điện gió Mũi Dinh), tab phân loại, modal chi tiết.
  7. `home.events`: Sự kiện nổi bật sắp diễn ra / đã diễn ra, thông tin ngày giờ, địa điểm, form đăng ký.
  8. `home.news`: 4 tin tức và góc nhìn chuyển đổi số tiêu biểu, tab phân loại danh mục.
  9. `home.partners`: Dải marquee đối tác chiến lược chạy vô tận (Bentley, Autodesk, Instantel, VC Group...).
  10. `home.contact_cta`: Form tư vấn nhanh trang chủ gửi về `SYSTEM_FORM_IDS.homeConsultation`.
- **C. Legacy Classification:**
  - `REUSE_PRESENTATION`: `HomeView.tsx`, `HomeEcosystemSection.tsx`, `AwardsSlider.tsx`, typography, các icons Lucide.
  - `EXTRACT_AND_REBUILD`: Data adapter / hydrator chuyển đổi cấu hình 10 sections từ DB thành props; dynamic reference resolver cho projects, events, news.
  - `REFERENCE_ONLY`: `homeData.ts`, `mockData.ts`, `pageBuilderMockData.json`, fixture IDs (`project_landmark_81`).
- **D. CMS Page Builder Governance:**
  - Trang hệ thống bất biến: Không cho phép xóa, không đổi slug (`/`), không thêm bớt section ngoài 10 section chuẩn, không đổi `section_type`.
  - Bật/tắt (`canHide`) và thứ tự (`canMove`): Theo `pageBuilderRegistry.ts` (`home.hero` cố định đầu trang).
  - Quản lý tham chiếu (`referenceSource`): Hỗ trợ `auto_featured` (tự động lấy theo cờ nổi bật) và `manual` (danh sách ID cụ thể lưu tại `cic_content_page_section_references`).
- **E. Database & Schema Realities:**
  - Bảng core: `cic_content_pages` (VI ID 1, EN ID 7), `cic_content_page_sections` (10 rows đã seed cho mỗi locale). Cả 2 trang hiện đang ở `draft_revision_id` với config rỗng `{}`; `published_revision_id = NULL`.
  - Bảng liên kết thật:
    - `cic_projects`: 8 dự án (có cột `is_featured`, `ordering`, `published`, `title`, `alias`, `image`; 3 dự án nổi bật ID 3, 4, 5 trùng khớp với landmark 81, cao tốc, điện gió).
    - `cic_event`: 39 sự kiện (`time_event`, `end_time`, `is_hot`, `show_in_homepage`, `published`).
    - `cic_news`: 1553 tin tức (`is_hot`, `show_in_homepage`, `published`, `start_time`).
    - `cic_banners`: 100 banners (nguồn media cho slide & awards).
    - `cic_forms`: Hệ thống form tương tác khách hàng.
- **F. Field Usage Map & Data Contract:**
  - `home.hero`: `badge` (string), `slides` (array: `title`, `subtitle`, `backgroundImageId`, `primaryCtaId`, `secondaryCtaId`), `tickerItems` (string[]).
  - `home.intro`: `eyebrow` (string), `title` (string), `paragraphs` (string[]), `imageId`, `videoUrl`, `downloadMediaId`.
  - `home.stats`: `items` (array: `id`, `value` number, `suffix` string, `label` string).
  - `home.awards`: `title`, `subtitle`, `items` (array: `name`, `imageId`).
  - `home.ecosystem`: `title`, `subtitle`, `items` (array: `id`, `title`, `description`, `badge`, `imageId`, `link`).
  - `home.projects`: `title`, `subtitle`, `referenceSource` (`mode`: `auto_featured` | `manual`, `limit`: 3).
  - `home.events`: `title`, `subtitle`, `referenceSource` (`mode`: `auto_featured` | `manual`, `limit`: 1).
  - `home.news`: `title`, `subtitle`, `referenceSource` (`mode`: `auto_featured` | `manual`, `limit`: 4).
  - `home.partners`: `title`, `subtitle`, `items` (`id`, `name`, `imageId`, `link`) hoặc `referenceSource` (`manual`, limit: 12).
  - `home.contact_cta`: `title`, `description`, `phone`, `email`, `formId`, `submitLabel`.
- **G. Runtime Authority:**
  - Hiện tại: `HomeRoute.tsx` chỉ nhận `content: HomePageModel` (chứa `stats` và `projects`), còn 8 sections khác lấy trực tiếp từ mock `getHomeData()`.
  - Target: `page.tsx` nạp snapshot `published_revision_id` từ `cic_content_pages` -> Hydrate toàn bộ 10 sections qua database resolver -> Chuyển vào `HomeView`. Khi chưa publish, duy trì fallback giao diện an toàn (fail-safe).
- **H/I. Server/Client Boundary:**
  - Server: DB query, batch reference resolution, security sanitization, draft/publish mutations, audit logging.
  - Client: UI rendering, animations (Framer Motion), video modal popover, client tabs filter, customer interaction submit.
- **J/K. Dependencies:**
  - Hard: RBAC task 90 (`static_pages`), `cic_content_pages*`, `cic_projects`, `cic_event`, `cic_news`.
  - Soft: `cic_forms`, Thư viện Media asset URLs, Contact CTA action.
- **L. Next.js Classification:**
  - `KEEP`: UI design components của `HomeView` và `HomeEcosystemSection`.
  - `REFACTOR`: `resolvePageContent.ts` để map đầy đủ cả 10 sections; mở rộng `HomeViewProps` nhận config của các section thay vì đọc trực tiếp `getHomeData()`.
  - `REPLACE`: `resolveReferenceEntity.ts` bỏ fixture IDs, thay bằng query DB thật.
  - `REMOVE`: Tránh hardcode dữ liệu tĩnh trong các subcomponents khi chạy môi trường production.
- **M. Responsive & Performance:**
  - Carousel hero tự động chuyển động với fallback reduced-motion, ticker marquee hardware-accelerated.
  - Tối ưu tải trước ảnh slide đầu tiên (`preload`).
- **N. Cross-cutting:**
  - Audit logging khi xuất bản bản ghi Home.
  - Tách biệt hoàn toàn bản ghi Trang chủ VI (`/`) và EN (`/en`).
- **Q. Kết luận Audit:**
  - Module Trang chủ và Page Builder Trang chủ: **READY_TO_UNBLOCK_AND_IMPLEMENT**.
  - Không có rủi ro phá vỡ schema database do schema `cic_content_pages*` đã sẵn sàng.


### Audit Nhóm trang Giới thiệu và Page Builder của chúng — 2026-09-16

- **A. Scope & Boundaries:**
  - Nhóm 3 trang thông tin doanh nghiệp cố định thuộc hệ thống (`system_defined = true`) cho cả 2 workspace:
    1. **Giới thiệu chung (About Us)**: VI ID 2 (`code: 'about'`, `slug: '/gioi-thieu'`), EN ID 8 (`code: 'about'`, `slug: '/about'`). Gồm 8 sections: `about.hero`, `about.overview`, `about.timeline`, `about.strategy`, `about.offerings`, `about.awards`, `about.partners`, `about.contact_cta`.
    2. **Cơ cấu tổ chức (Organization Structure)**: VI ID 3 (`code: 'organization'`, `slug: '/gioi-thieu/co-cau-to-chuc'`), EN ID 9 (`code: 'organization'`, `slug: '/about/organization'`). Gồm 2 sections: `about.hero`, `about.organization`.
    3. **Năng lực & Kinh nghiệm (Capacity & Experience)**: VI ID 4 (`code: 'capacity_experience'`, `slug: '/gioi-thieu/nang-luc-kinh-nghiem'`), EN ID 10 (`code: 'capacity_experience'`, `slug: '/about/capacity-experience'`). Gồm 4 sections: `about.hero`, `about.capacity`, `about.experience`, `about.contact_cta`.
  - Giới hạn: Nhóm trang Giới thiệu là trang trình bày tĩnh và tổng hợp thông tin thể chế doanh nghiệp; sơ đồ tổ chức là code-owned SVG; hồ sơ năng lực liên kết flipbook PDF bên ngoài; các đối tác/sản phẩm tham chiếu từ các module nguồn tương ứng.

- **B. UI Reference Map (React Legacy & Presentation):**
  - Component trình chiếu cốt lõi: `src/web/components/AboutView.tsx` (888 dòng) bọc dưới dạng 1 shell tabbed 3 view (`overview`, `structure`, `experience`):
    1. **Banner chung (`about.hero`)**: Background image + video loop hòa trộn lớp phủ tối, badge "Về chúng tôi", tiêu đề lớn (Hơn 35 năm nhịp bước cùng công nghệ) và đoạn dẫn phụ đề.
    2. **Tab 1: Tổng quan doanh nghiệp (`overview`)**:
       - `about.overview`: Tiêu đề, 3 đoạn văn giới thiệu lịch sử hình thành (1990 thuộc Bộ Xây dựng -> VC Group), khung video nhúng YouTube (`https://www.youtube.com/embed/hdLFK_09-tU?start=448`).
       - `about.timeline`: Trục thời gian 5 cột mốc lớn (1990, 2000, 2006, 2019, 2025).
       - `about.strategy`: Định hướng chiến lược, ảnh banner minh họa, 3 khối card: Sứ mệnh, Tầm nhìn, 5 Giá trị cốt lõi.
       - `about.offerings`: "Sản phẩm và dịch vụ cung cấp", lưới 7 card nghiệp vụ (Phần mềm xây dựng, Phần mềm ngoại nhập, Thiết bị công nghệ, Tư vấn XD, BIM/Digital Twins, Công nghệ thông minh, Phát triển bền vững).
       - `about.awards`: "Thành tựu & Giải thưởng", slider chứng nhận/huân chương (Huân chương Lao động hạng Ba, Bằng khen Thủ tướng, Sao Khuê, Sao Vàng Đất Việt, VIFOTEC).
       - `about.partners`: "Đối tác chiến lược & Khách hàng tiêu biểu", Bento grid 4 ảnh album hoạt động đối tác + dải marquee logo đối tác vô tận.
    3. **Tab 2: Cơ cấu tổ chức (`structure`)**:
       - `about.organization`: Sơ đồ cây tổ chức trực quan dạng vector SVG kích thước 1600x560 (Đại hội đồng cổ đông -> HĐQT & Ban kiểm soát -> TGĐ & 2 PTGĐ -> 2 Phòng ban hành chính giữa -> 3 Trung tâm nghiệp vụ kỹ thuật -> 5 Đơn vị/Chi nhánh cấp cơ sở).
    4. **Tab 3: Năng lực & Kinh nghiệm (`experience`)**:
       - `about.capacity`: Tiêu đề lớn "Tiềm lực vững vàng, vươn tầm quốc tế", mô tả quy mô, 4 chỉ số KPI năng lực (150+ Nhân sự, 100+ Đối tác toàn cầu, 5.000+ Dự án, 35+ Năm kinh nghiệm).
       - `about.experience`: 3 trụ cột năng lực kèm ảnh (Nhân lực chất lượng cao, Đối tác chiến lược, Xu hướng công nghệ) + Bản đồ mạng lưới đối tác toàn cầu `<GlobalPartnerMap />`.
       - `about.contact_cta`: Nút bấm "Hồ sơ năng lực (Profile)" dẫn tới flipbook PDF (`https://www.cic.com.vn/flipbooks/index.html?pdf=CICProfile2024Final.pdf`).

- **C. Next.js Hiện trạng & Kiến trúc Routing:**
  - Tuyến đường công khai:
    - `/about`: Route Next.js tại `src/app/(public)/about/page.tsx` nạp `getPublicStaticPage('vi', 'about')`, chạy qua `resolvePageContent({ pageType: 'about' })`, render `<PublicAboutRoute activeTab="overview" />`.
    - `/gioi-thieu/co-cau-to-chuc`: Route tại `src/app/(public)/gioi-thieu/co-cau-to-chuc/page.tsx` nạp `getPublicStaticPage('vi', 'organization')`, render `<PublicAboutRoute activeTab="structure" />`.
    - `/gioi-thieu/nang-luc-kinh-nghiem`: Route tại `src/app/(public)/gioi-thieu/nang-luc-kinh-nghiem/page.tsx` nạp `getPublicStaticPage('vi', 'capacity_experience')`, render `<PublicAboutRoute activeTab="experience" />`.
  - **Phát hiện xung đột & khiếm khuyết kiến trúc nghiêm trọng:**
    1. **Xung đột định tuyến (Routing Conflict)**: Trong DB `cic_content_pages`, Page 2 có slug là `/gioi-thieu`. Nhưng Next.js chỉ có route file `/about/page.tsx` mà KHÔNG có route `/gioi-thieu/page.tsx`. Khi người dùng truy cập `/gioi-thieu`, route động `[slug]/page.tsx` bắt lấy slug này và render nhầm thành `<PublicLegalPageView categoryTag="Pháp lý & Chính sách" />`!
    2. **Xung đột điều hướng tab**: `PublicAboutRoute.tsx` điều hướng tab `overview` về `/about`, nhưng tab `structure` và `experience` lại điều hướng về subpath của `/gioi-thieu` (`/gioi-thieu/co-cau-to-chuc` và `/gioi-thieu/nang-luc-kinh-nghiem`).
    3. **Lỗi Revalidation khi Publish**: Trong `actions.ts`, khi xuất bản trang 2, hàm revalidate theo `result.slug` (`/gioi-thieu`), do đó trang thật `/about` không hề được revalidate.
    4. **Resolver phân mảnh (Fragmented Resolver)**: `src/shared/page-content/resolvePageContent.ts` chỉ parse 2 section là `about.timeline` và `about.strategy`. Cả 6 sections còn lại (`about.hero`, `about.overview`, `about.offerings`, `about.awards`, `about.partners`, `about.contact_cta`) bị bỏ qua hoàn toàn, buộc `AboutView.tsx` phải tự đọc sống từ `configFor()` nội bộ.
    5. **Visual Canvas thiếu props**: Tại `WebsitePageRenderer.tsx`, khi `pageType === 'organization'` và `pageType === 'capacity_experience'`, component không hề truyền prop `pageSections={page.draft.sections}` vào `AboutView`, khiến canvas không thể hiển thị cấu hình draft của `about.hero` trên các trang này.
    6. **Offerings bị ngắt kết nối**: `pageBuilderRegistry.ts` khai báo `referenceLimit: { product: 2, service: 4 }` cho `about.offerings`, nhưng `AboutView.tsx` lại render cứng (hardcoded) 7 cards giải pháp cố định, không nhận sản phẩm/dịch vụ tham chiếu.

- **D. Database Schema & Data Thật (PostgreSQL / Supabase):**
  - Bảng core:
    - `cic_content_pages`: 6 trang thuộc nhóm Giới thiệu (VI ID 2, 3, 4; EN ID 8, 9, 10) đều đã được seed với `system_defined = true`, `draft_revision_id` trỏ đúng revision nháp, `published_revision_id = NULL`.
    - `cic_content_page_revisions`: 6 revisions (ID 2, 3, 4, 8, 9, 10) đều ở trạng thái `state = 'draft'`, `version_number = 1`.
    - `cic_content_page_sections`:
      - Trang 2 & 8 (`about`): 8 sections, toàn bộ config hiện là rỗng (`{}` hoặc `{ milestones: [] }`, `{ coreValues: [] }`, `{ items: [] }`).
      - Trang 3 & 9 (`organization`): 2 sections (`about.hero`, `about.organization` với config `{ imageId: null }`).
      - Trang 4 & 10 (`capacity_experience`): 4 sections (`about.hero`, `about.capacity` với `{ metrics: [] }`, `about.experience`, `about.contact_cta`).
    - `cic_content_page_section_references`: 0 bản ghi cho toàn bộ nhóm trang Giới thiệu.
  - Dữ liệu lịch sử legacy (`cic_contents`):
    - ID 1: "Giới thiệu CIC" (`alias: 'gioi-thieu'`, `category_id: 1`, 15KB HTML bài viết năm 2019).
    - ID 2: "Cơ cấu tổ chức" (`alias: 'co-cau-to-chuc'`, 177 bytes HTML chứa đường dẫn ảnh sơ đồ cũ).
    - ID 3: "Năng lực và kinh nghiệm" (`alias: 'nang-luc-va-kinh-nghiem'`, 120KB HTML chứa văn bản năng lực và bảng biểu).
    - ID 4: "Một số thành tựu đạt được" (Hình ảnh bằng khen, giải thưởng).
    - ID 13: "HỒ SƠ NĂNG LỰC" (Chứa link flipbook PDF `CICProfile2024Final.pdf`).
  - Phân loại import legacy theo `manifest.ts`: Toàn bộ các bản ghi trên đều được xếp loại `PARTIAL_REFERENCE` (chỉ dùng tham khảo nội dung/ảnh để biên tập vào sections cấu trúc, tuyệt đối không nhồi HTML thô vào Page Builder).

- **E. Field Contract & Governance trong Page Builder Registry:**
  - `about.hero`: `title` (text, editable), `subtitle` (text, editable), `backgroundImageId` (media image, editable).
  - `about.overview`: `title` (text, editable), `videoUrl` (media video, editable).
  - `about.timeline`: `title` (text, editable), `description` (text, editable), `milestones` (collection: `year`, `description` editable; `reorder/add/remove` blocked).
  - `about.strategy`: `title`, `subtitle`, `vision`, `mission`, `coreValues` (collection: `value` editable; `reorder/add/remove` blocked), `imageId` (media, editable).
  - `about.offerings`: `title`, `subtitle` (editable). Cần liên kết thực tế với `product` (tối đa 2) và `service` (tối đa 4).
  - `about.awards`: `title`, `subtitle`, `items` (collection: `name`, `imageId` editable; `reorder/add/remove` enabled).
  - `about.partners`: `title`, `subtitle`, `description`, `items` (collection: `name`, `imageId` editable; `reorder/add/remove` enabled).
  - `about.organization`: `blockedContract` (code-owned SVG topology diagram; bảo lưu kiến trúc SVG trong code).
  - `about.capacity`: `description` (text, editable), `metrics` (collection: `value`, `label` editable; `reorder/add/remove` blocked; `title` blocked vì representation mismatch).
  - `about.experience`: `blockedContract` (3 khối trụ cột năng lực + GlobalPartnerMap).
  - `about.contact_cta`: `blockedContract` (nút liên kết tải Hồ sơ năng lực PDF).

- **F. Dependencies & Quyền hạn:**
  - Hard: RBAC task `static_pages` (id 90, capabilities: `view,edit,preview,publish,create_legal`), `cic_content_pages*`, Media foundation.
  - Soft: `cic_products`, `cic_services` (cho section offerings), Thư viện Media (cho logo đối tác, bằng khen, banner).

- **G. Khuyến nghị chuẩn bị trước khi Implementation / Migration:**
  1. **Thống nhất URL Slug**: Cần quyết định chuẩn hóa slug trang Giới thiệu tiếng Việt là `/gioi-thieu` (đồng bộ với DB và subpages `/gioi-thieu/co-cau-to-chuc`, `/gioi-thieu/nang-luc-kinh-nghiem`) hoặc đổi DB slug thành `/about`. Đồng thời bổ sung route hoặc redirect `/gioi-thieu` để không rơi vào `[slug]/page.tsx` (tránh bị hiển thị nhầm thành trang pháp lý).
  2. **Hoàn thiện Resolver `aboutResolver`**: Tách logic resolve nhóm Giới thiệu thành resolver độc lập, map đầy đủ cả 8 sections thay vì chỉ có 2 section như hiện tại.
  3. **Truyền `pageSections` vào Visual Canvas**: Đảm bảo `WebsitePageRenderer` truyền đủ `pageSections` cho cả 3 trang để xem trước chính xác.
  4. **Giữ nguyên sơ đồ tổ chức SVG**: Sơ đồ tổ chức đã được thiết kế tinh xảo dưới dạng SVG responsive sắc nét, tiếp tục duy trì dưới dạng code-owned contract.

- **Q. Kết luận Audit:**
  - Nhóm trang Giới thiệu và Page Builder của chúng: **AUDITED & CLEARLY_SCOPED**.
  - Đã làm rõ toàn bộ nguồn dữ liệu, contract section, quan hệ database và các điểm nghẽn kiến trúc trước khi bước vào giai đoạn implementation.

- **Implementation 2026-09-16:**
  - **Data Layer & Resolver**: Xây dựng `src/features/static-pages/server/aboutResolver.ts` query từ PostgreSQL database thật (`getPublicPublishedPage`), phân giải đầy đủ 8 sections (Trang 2 Giới thiệu), 2 sections (Trang 3 Cơ cấu tổ chức), 4 sections (Trang 4 Năng lực & Kinh nghiệm). Kèm theo fail-safe fallback sang `getLegacyAboutPageContent()` và `getLegacyAboutCapacityContent()` nếu DB chưa publish hoặc config rỗng.
  - **Routing Alignment**: Tạo route chuẩn `src/app/(public)/gioi-thieu/page.tsx` đồng bộ với DB slug `/gioi-thieu`. Cấu hình redirect 301 từ `/about` về `/gioi-thieu`. Cập nhật `[slug]/page.tsx` loại trừ `/gioi-thieu` để không bị nhận nhầm thành Legal page. Cập nhật `PublicAboutRoute.tsx` điều hướng tab overview về `/gioi-thieu`. Cập nhật 2 subroutes `/gioi-thieu/co-cau-to-chuc` và `/gioi-thieu/nang-luc-kinh-nghiem` nạp data qua `aboutResolver.ts`.
  - **CMS Visual Canvas Preview**: Cập nhật `WebsitePageRenderer.tsx` truyền đầy đủ `pageSections` và `resolveMediaUrl` cho cả 3 trang (`about`, `organization`, `capacity_experience`), đảm bảo xem trước WYSIWYG chính xác.
  - **Cache Revalidation**: Cập nhật `actions.ts` revalidate đồng thời cả `/gioi-thieu` và `/about` khi publish trang.
  - **Testing & Parity**: Xác minh HTTP 200/307, Typecheck pass 100%, giữ nguyên toàn bộ giao diện và SVG responsive. Trạng thái: `[I]`.



### Audit Cấu hình hệ thống — 2026-09-14

- **A. Scope:** CMS route `/cms/settings` (alias `/cms/system-settings`) quản lý cấu hình dùng chung theo ba scope `site_cic`, `site_english`, `site_enjicad` và collection trụ sở/chi nhánh VI/EN. Public không có route Cấu hình riêng; Trang Liên hệ, Footer, Header/widget và metadata chỉ là consumer của projection published/allowlisted. Function SEO, Page Builder, Mẫu email và cấu hình nội dung riêng từng module không thuộc ownership này.
- **B. UI Reference Map:** `SystemConfiguration` giữ page header, năm tab Tổng quan/Chỉnh sửa/Cảnh báo/Phiên bản quan trọng/Nhật ký, scope selector, action save/review/publish và toast. `OverviewTab` gồm bốn KPI, card scope/domain, draft và issue summaries. `SettingsEditorTab` gồm scope/action header, search, nhóm điều hướng, field cards theo text/editor/number/boolean/select/secret/image/file/list, preview 404 và context sidebar. `BranchesSettingsEditor` quản lý thêm/sửa/ẩn/xóa/sắp thứ tự, head office, liên hệ, giờ làm việc và map. Reference còn có table view, compare modal, secret rotate/test, media picker, validation list, version detail/restore và audit table. Dữ liệu draft/version/issue/test/sync trong reference là UI copy/state, không phải production truth.
- **C. Legacy classification:** `REUSE_PRESENTATION`: `CmsPageHeader`, `CmsTabs`, field/card/table primitives và visual hierarchy. `EXTRACT_AND_REBUILD`: editor, branch editor, overview, compare modal, asset picker vì UI có giá trị nhưng đang trộn local controller, fake metrics và mutation. `REFERENCE_ONLY`: `mockData.ts`, `demoConfigurationDataSource.ts`, validation/version/audit fixtures, inheritance/global-scope simulation, secret test/rotate simulation và fake IP/actor.
- **D. CMS capability:** Functional authority yêu cầu cập nhật hotline/email/logo/social/support/measurement/shared localized values; thêm/sửa/ẩn/xóa/reorder branches, một published head office/workspace; mọi setting thuộc module dùng direct-save + Audit. Có thể compare old/new trước xác nhận nhưng không tạo draft/version persistence. Không có requirement cho generic create/delete config key, arbitrary edit mọi legacy row, inheritance override, automated validation scanner hoặc secret editor/rotate/test.
- **E. DB/relation:** Live `cic_config` 35 rows (30 published), `cic_config_en` 34 (30), `cic_config_enjicad` 57 (55); tổng 126 key, không blank hoặc normalized duplicate. Ba bảng độc lập theo locale/scope, unique `name`. Live `cic_branches` có schema/constraints/index/RLS đúng delta nhưng 0 rows. Nguồn legacy `cic_address` và `_en` mỗi bảng có 1 row chứa trụ sở Hà Nội và chi nhánh TP.HCM trong `more_info` HTML cùng iframe map; implementation phải migration bằng mapping/report được review, không runtime parse HTML và không silent fallback.
- **F. Field Usage Map:** `cic_config*.value` chỉ `CMS_EDITABLE`/`PUBLIC_READ` với key nằm trong `APPROVED_SETTINGS_MANIFEST`; manifest hiện gồm identity (`site_name`, Enjicad `domain`), contact (`admin_name`, `admin_email`, `tel`, `tel2`), branding (`logo`, `logo_white`), social (`facebook`, `twitter`, `youtube`), support (`teamview`) và measurement (`google_analytics`). `name,data_type,title,is_common,published,ordering` là `CMS_OPERATIONAL`; `id` là `SYSTEM_MANAGED`. Branch fields giữ mapping audit trước. Keys thuộc Function SEO, Page Builder, Product, Email Template và Enjicad content có owner riêng; `address,slogan,google,tawk_to` là `LEGACY_PRESERVE_ONLY`. Pattern credential/API key/token/password/secret/SMTP là `SECRET_ENV_ONLY`, không được xuất hiện trong manifest.
- **G. Runtime authority:** Production authority mong muốn là PostgreSQL only: DB → explicit projection → domain mapper/manifest → CMS/public consumer. Hiện CMS read dùng DB thật, không runtime-import demo source trên route, nhưng các tab issue/draft/version/audit và secret/media behavior vẫn empty hoặc local simulation. Public Contact/Footer chưa đọc `cic_branches`; About chỉ đọc prefix `about_` từ `cic_config`.
- **H. Shared domain:** Dùng chung scope/workspace mapping, approved key manifest (owner, group, control type, sensitivity, validation, public exposure), scalar parser/serializer, branch model/validation, old-new diff và public allowlist. Không share CMS UI. Media ID/path resolution thuộc Media; audit history thuộc Audit.
- **I. Server/client boundary:** Server sở hữu DB query, key allowlist, secret redaction, authorization, validation, transaction, Audit và revalidation. Client chỉ giữ tab/search/group, unsaved form state, compare confirmation, modal/media selection và reorder interaction. Hiện `queries.ts` import `SystemConfigurationData`/`ConfigItem` từ CMS presentation, tạo reverse dependency; toàn module nằm dưới `CmsDashboard` client boundary và hai component 561/657 dòng trộn controller/workflow/presentation.
- **J. Hard dependencies:** PostgreSQL transaction + Audit Writer/registry đã có. Migration `20260914_system_settings_readiness.sql` đã publish duy nhất task `settings` với `view,edit`; live verification xác nhận task và RLS trên bốn bảng. Secret được chốt là ENV/server-only và ngoài ownership Settings, nên không còn cần secret store/rotate foundation để bắt đầu module.
- **K. Soft dependencies:** Media picker/resolver cho logo/file; public Contact/Footer/Header consumers và cache tags; Function SEO/Page Builder/About/Product/Email ownership handoff. Các module này không được kéo vào core ngoài projection/revalidation contract trực tiếp.
- **L. Next classification:** `KEEP` route/shell, server auth guard, explicit DB projections, transaction + awaited Audit, branch table constraints. `REFACTOR` domain types ra khỏi CMS, key manifest, query mapper, PATCH ownership, branch upsert/delete guard và client islands. `REPLACE` derive `data_type` sơ sài, expose mọi config row, scope-item merge sai, direct DB write giả danh save-draft/publish, local issue/version/audit/secret/media workflows. `REMOVE` runtime mock/demo consumers, fake actor/IP/sync %, fake test/revalidation/success and local version restore from production route.
- **M. Responsive:** `KEEP` card hierarchy, stacked mobile grids and desktop editor/sidebar direction. `ADAPT` top actions/tabs/group navigation thành wrap/scroll có affordance, tables local horizontal scroll, branch form/action rows và diff table theo viewport. `FIX` icon/toggle actions dưới 44px, modal height/focus trap/Escape/scroll lock, fixed toast inset/safe area, long key/value/URL wrapping và mobile editor density. `DO_NOT_COPY` desktop table nhồi vào mobile, hover-only affordance, unbounded modal, motion không có reduced-motion alternative. Impeccable detector ghi hai advisory tại side accent và amber toast contrast; chưa có authenticated browser regression.
- **N. Cross-cutting:** Permission bắt buộc server-side và cần catalog `settings.view/edit`; Audit dùng `SETTINGS_UPDATED`/`SYSTEM_SETTINGS`, nhưng event chỉ ghi allowlisted/redacted diff, không ghi raw secret. Trash không áp dụng cho scalar config; branch delete là hard delete theo functional requirement nhưng phải relation/last-head-office guard và Audit trong transaction. Media chỉ áp dụng logo/file picker qua foundation. Secret tuyệt đối không lưu/đọc/ghi log thô trong `cic_config*`.
- **O. i18n:** `BILINGUAL_CONTENT` cho `cic_config` và `cic_config_en`, độc lập, không fallback chéo; Enjicad là scope riêng, không phải locale EN. Branch VI/EN là hai workspace độc lập; không suy ID tương ứng.
- **P. Implementation order:** manifest/domain/projections → one-time migration `cic_address*` sang `cic_branches` có report → guarded transactional direct-save + redacted Audit → CMS editor/branch/compare/history wiring → Media selector → published Contact/Footer consumers + cache revalidation → roundtrip và responsive regression.
- **Q. Acceptance:** không `select *`; không arbitrary-write ngoài manifest; PATCH preserve legacy/external-owned keys; không secret trong manifest/client/Audit; không fake draft/publish; branch VI/EN CRUD/order/head-office pass; CMS→DB→public roundtrip, permission/RLS và responsive checks pass.
- **Unblock decision 2026-09-14:** `SECRET_POLICY = server-side ENV only`; `SETTINGS_CONTRACT = src/features/system-settings/domain/settingsManifest.ts`; `RBAC = settings.view/edit` đã apply/verify trên live PostgreSQL. Branch seed là bước one-time migration bên trong implementation, không phải foundation blocker. Giữ `[A]` vì chưa implement module. **READY_TO_IMPLEMENT**.
- **Implementation 2026-09-14:** Core dùng manifest allowlist thay vì raw config table; CMS chỉ có direct-save, server validation + `settings.edit`, mutation và `settings.updated` cùng PostgreSQL transaction. Legacy `cic_address*` đã được map một lần thành 2 branch VI + 2 branch EN; runtime không parse HTML. Footer đọc published projection cùng DB. Không có secret, mock fallback, draft/version giả trong runtime Settings. Trạng thái `[I]`: core complete; Media selector cho logo và Contact consumer là hai soft integration cụ thể còn lại.

### Audit Danh mục tin tức — 2026-09-10

- **Scope/UI map:** CMS `/cms/news/categories` gồm page header + số danh mục + CTA, search tên/alias, bảng cây cha–con (tên/title, URL, số bài, thứ tự, Trang chủ, trạng thái, edit/delete), empty state và drawer create/edit gồm thông tin, cha/thứ tự, tóm tắt, ảnh, publish/home, SEO + Google preview. Public consumer gồm tab/filter danh mục ở trang Tin tức, submenu Quan hệ cổ đông, nhãn category/card ở Trang chủ và navigation Header; không có bằng chứng route detail danh mục độc lập đã hoàn thiện trong Next.
- **Legacy classification:** `REUSE_PRESENTATION` cho `CmsPageHeader`, button/icon primitives và cấu trúc table/drawer; `EXTRACT_AND_REBUILD` cho `NewsCategoryManager`/`NewsCategoryFormDrawer` vì presentation đúng nhưng CRUD/toggle/delete/slug/media đang trộn local state và mock; `REFERENCE_ONLY` cho `NewsManager`, `NewsModulePage`, `newsData.ts`, fixtures và mapping category theo tên/SPA callback hard-code.
- **CMS capability:** tạo/sửa, tree cha–con, order, publish/unpublish, show homepage, search, SEO/media, usage count và delete chỉ khi không còn bài/con. Không có requirement bulk action, preview riêng, revision riêng hoặc pagination trong reference; lịch sử phải đọc Audit chung, delete đi Trash chung. Permission dùng task `news` với view/create/edit/delete/publish tương ứng; server là enforcement authority.
- **Live DB:** `cic_news_categories` 10 row/9 published và `_en` 9/9; mỗi locale có 4 node con; alias đầy đủ, không trùng chuẩn hóa; không orphan/cycle. `cic_news` 1.553 row dùng 10 category và `_en` 300 row dùng 9 category. Cả FK article→category và parent self-FK đều đúng locale; ghi chú FK EN sai trong docs cũ đã được cập nhật. Normalized unique alias index chưa có nhưng dataset đã đủ sạch để thêm trong implementation.
- **Field/data authority:** PostgreSQL VI/EN là production authority. Form sở hữu `name,title,alias,summary,parent_id,ordering,image,published,show_in_homepage,seo_*`; server sở hữu identity, timestamps và hierarchy cache. Usage count derive từ article FK. Các `display_*` bắt buộc đều đang `true`, chỉ là compatibility policy khi create, không phải form field; các field legacy/unknown khác phải preserve và không nằm trong input/projection thường. Public/CMS/form/lookup/Trash dùng projection riêng, không `select *`.
- **Runtime/shared boundary:** Next public News đang đọc DB nhưng category vẫn là cached string/hard-code; CMS category là demo/local state, EN mock rỗng. Shared domain cần locale, category identity/tree, slug/status rules, cycle/delete guard, mapper và projections; server query/auth/business/mutation/audit/trash/revalidation ở server, client chỉ giữ search, drawer/media picker/toggle interaction. Không để domain/server import CMS hoặc public UI types.
- **Dependencies:** hard dependencies đã đủ để bắt đầu: category/article schema + đúng FK, Auth/RBAC task `news`, Audit Writer, typed Trash registry, Media picker/resolver và public News consumer. Trong implementation phải đăng ký action/entity Audit riêng cho News Category, adapter Trash lossless, normalized alias index và query/mutation category; đây là việc nội bộ module, không phải foundation blocker. Soft integration: Function SEO/sitemap, global search, Page Builder/home/menu binding và hoàn thiện toàn module News.
- **Next classification:** `KEEP` shell/primitives/visual hierarchy; `REFACTOR` tree mapper, domain type, server/client split và public category consumption; `REPLACE` demo datasource, local CRUD/toggle/delete, `select('*')`, hard-code English mapping/label-by-name và raw mock media; `REMOVE` mock fallback, fake timestamp/ID/toast thành công và SPA pathname/navigation contract khỏi production runtime.
- **Responsive:** `KEEP` hierarchy/table/drawer intent; `ADAPT` header/search/actions, tree table local horizontal scroll và drawer theo viewport; `FIX` long name/alias wrapping, 32px action/toggle touch targets, focus trap/Escape/scroll lock, `dvh`/safe-area footer và loading/error states; `DO_NOT_COPY` desktop-dense table nhồi vào mobile, full-screen overlay thiếu focus management, mapping category bằng chuỗi tên và local success trước server confirmation.
- **i18n:** `BILINGUAL_CONTENT`; hai bảng VI/EN là dataset độc lập, không fallback chéo, không suy ID tương ứng (VI có thêm id 16), không tạo translation table mới.
- **Implementation order:** alias/index + domain/projections → server CMS reads → validation/tree/delete guards → authorized transactional mutations + Audit/Trash → CMS wiring → public News/Header/Home category consumption → revalidation → DB/CMS/public and responsive regression.
- **Kết luận audit:** module vẫn `[A]`, chưa implement hoặc complete. Hard dependency không thiếu. `READY_TO_IMPLEMENT`.
- **Implementation `[I]` 2026-09-10:** `/cms/news/categories` đã đọc PostgreSQL VI/EN thật, giữ hierarchy list/search/table/drawer của reference và hỗ trợ create/PATCH, đổi publish/home, SEO/media, delete có guard bài viết/con. Domain schema, tree rule và projection tách khỏi UI; mutation được server authorize bằng task `news`, ghi Audit Writer và đưa snapshot đầy đủ vào typed Trash adapter trong transaction. Public `/news` lấy danh mục published và bài viết qua FK thật, không còn category label hard-code hoặc mock fallback. Migration normalized partial unique alias đã áp dụng; roundtrip draft ẩn public → PATCH bảo toàn legacy → publish hiện public → Trash ẩn → restore inactive bảo toàn snapshot, kèm Audit, đã pass. Legacy/unknown ngoài ownership form không nằm trong payload update và được giữ nguyên. Responsive đã ADAPT/FIX cho toolbar, table scroll, tên/alias dài, touch target, drawer `dvh`, safe-area, focus/Escape và empty/loading/error. **Pending integration:** Page Builder/Home/Header binding, Function SEO/sitemap và hoàn thiện toàn bộ News article workflow; vì vậy module là `[I]`, chưa phải `[x]`.

### Audit Tin tức — 2026-09-10

- **A. Scope:** bài viết VI/EN trong CMS `/cms/news`; public `/news`, `/news/[slug]`; Hot News, Home News, Header/search consumers; category, author, Media, related news/products, CTA/contact, SEO, Audit/Trash/Permission là dependency trực tiếp. Không audit sâu Category đã `[I]`, Products, Page Builder, Contact hay Function SEO ngoài contract News dùng.
- **B. UI Reference Map:** CMS list gồm header/count/CTA, search, category/status, reset, bulk draft/publish, column+density, table và pagination 10; form giữ full content-shell header, main information/rich text/relations và sidebar quality/media/file/tags/two placement flags/time/SEO, cùng preview/history/activity/delete. Public list phải giữ Hot News hero+side list, category icons, shareholder subtype/year filters, search/filter, card/document variants, pagination, newsletter và subscription modal. Detail phải giữ progress, hero/breadcrumb/meta/share, một ticker, 8/4 article/sidebar, lead/image/rich content, conditional category blocks/TOC, consultation, attachment/relations/latest/related.
- **C. Legacy classification:** `REUSE_PRESENTATION` cho primitives, `NewsTicker`, `NewsToc`, `NewsDetailActions`, small cards/modal shell sau khi tách data; `EXTRACT_AND_REBUILD` cho `NewsFormView` và detail composition; `REFERENCE_ONLY` cho `NewsManager`/`NewsView` mega-components, `NewsModulePage`, `newsData.ts`, mocks, fake versions/activity, local CRUD, `setTimeout`/SPA callbacks và hard-coded category/subtype inference.
- **D. CMS map:** capability bắt buộc là list/search/filter/sort/pagination, create/edit, draft/publish, bulk draft/publish, max 4 Hot News và max 4 Home độc lập, preview, category/media/file/news/product selectors, SEO, history/version, Trash/restore/purge và permission. Không có workflow submit/approve/reject; form không được tự thêm subtype fixture fields.
- **E/F. DB + Field usage:** authority là `cic_news/cic_news_en`; category FK tới bảng category cùng locale, author FK tới `cic_users`; related news/products vẫn là ordered legacy text. Editable/public/operational/system/relation/audit/legacy/unknown mapping đã ghi tại `02-module-field-mapping.md`. Create/update chỉ ghi form-owned fields; full-row Trash snapshot phải preserve legacy/unknown.
- **G. Runtime authority:** public Next đang đọc DB thật nhưng partial; CMS đang hybrid sai — VI mock/local state, EN empty. Production phải là PostgreSQL → explicit repository/mapper → server composition → UI, không fallback mock. Sau hardening, detail lookup dựa vào unique normalized alias và không còn dùng `LIMIT 1` để che duplicate.
- **H/I. Shared domain + boundary:** share locale, identifiers, slug/status/placement rules, related-ID parser+validator, projections và mapper; không share CMS/public UI. Server giữ DB/auth/permission/business/HTML policy/metadata/composition; client chỉ giữ filters, selection, editor, picker, preview/dialog, share/clipboard/print. Không fetch toàn DB bằng `useEffect` hay serialize full rows.
- **J. Hard dependencies:** Category `[I]`, Auth/RBAC task `news`, PostgreSQL transaction, Media, Audit registry/writer và Trash foundation đều tồn tại. Hard-data prerequisite đã đạt: migration `20260910_news_hard_data_resolution.sql` đưa duplicate normalized alias VI/EN về 0, placement về đúng 4/locale/vùng, thêm unique/check/trigger và contract khóa–đếm–ghi server-only.
- **K. Soft integrations:** Page Builder/Home manual-vs-auto selection, global search, Function SEO/sitemap/redirect, Contact/CTA delivery, related Products và version store thật. Core không được fake các integration này.
- **L. Next classification:** `KEEP` published category join, local `/images` compatibility, metadata/not-found, shared contact action và small client actions; `REFACTOR` explicit paged projections, typed read models, conditional parallel relations, sanitized rich HTML and server/client islands; `REPLACE` CMS demo/local mutations, full-list public query, static progress, incomplete public list/detail and name/string inference; `REMOVE` fake IDs/timestamps/toasts/version/activity, duplicate consultation, mock fallback and unused subtype contracts from production runtime.
- **M. Responsive:** `KEEP` reference hierarchy and responsive grids; `ADAPT` CMS toolbar/table/form, public category/filter/hero/card/sidebar and modal sizing; `FIX` <44px targets, long title/alias/file wrapping, sticky header/column overlap, modal focus/Escape/scroll, horizontal affordance and reduced-motion alternative; `DO_NOT_COPY` desktop-dense mobile table, hover-only controls, unbounded overlay or marquee/bounce without motion preference.
- **N. Cross-cutting:** server permission là bắt buộc; mutation dùng Audit Writer chung sau business operation thành công; News VI/EN đã đăng ký typed Trash adapter để snapshot/restore/purge/revalidation; legacy `/images/**` tiếp tục đọc được và upload mới dùng Media foundation; rich HTML/embeds được sanitize phía server, không tin raw client input.
- **O. i18n:** `BILINGUAL_CONTENT`; VI/EN are independent tables and category relations. `other_languages1` is not translation authority; no automatic cross-locale fallback or invented translation table.
- **P. Implementation order:** domain/schema/projections dựa trên invariant đã harden → authorized transactional CRUD/status/placement dùng shared lock contract → Audit+Trash → CMS list/form/preview/history → public list/detail parity → Home/Header/Search/SEO integrations → DB roundtrip and responsive regression.
- **Q. Acceptance:** unique deterministic public URL; public excludes draft/trash/hidden category; CMS and public share DB; PATCH preserves legacy; related IDs valid/ordered; two cap-4 rules enforced atomically; VI/EN isolated; preview draft authorized; Audit/Trash roundtrip; all reference sections/states/responsive checks pass; no runtime mock, duplicate query mapping or root client boundary.
- **Hard-data resolution 2026-09-10:** canonical theo `published DESC → start_time/article date DESC → id DESC`; 14 non-canonical giữ nguyên bài/published và đổi thành `normalized-old-alias-id`. URL duplicate legacy vốn ambiguous chỉ tiếp tục trỏ canonical; không tạo redirect giả. `ordering` nhỏ hơn được xác minh là ưu tiên cao hơn; từng placement độc lập giữ top 4 theo published/order/date/id, chỉ tắt cờ overflow. Tổng bài 1.553 VI/300 EN và published 1.521/300 không đổi. Unique normalized alias, alias nonblank và cap placement đã được hậu kiểm trên DB thật.
- **Kết luận re-audit:** module giữ `[A]`, chưa implement hoặc complete; không còn hard data prerequisite. `READY_TO_IMPLEMENT`.
- **Implementation `[I]` 2026-09-10:** CMS `/cms/news` VI/EN đọc PostgreSQL thật qua projection riêng, giữ list/search/category/status/default-10 pagination/full-page form/preview của React reference; create/PATCH, publish/draft, bulk status, Hot/Home và Trash chạy qua Server Action có RBAC. Hot/Home dùng khóa advisory + count + write trong cùng transaction, DB trigger tiếp tục chặn mục thứ 5. Form dùng Media foundation, relation selector News/Product thật, rich content/video/file/tags/SEO và không ghi full row. Typed Trash adapter snapshot toàn bộ row legacy, restore cùng ID về draft và tắt placement; Audit Writer dùng registry chung. Public `/news` và `/news/[slug]` giữ nguyên presentation hierarchy, DOM/CSS, animation và responsive của `NewsView` trên `main`; `NewsRuntimeView` chỉ adapter read-model PostgreSQL và URL navigation vào component reference, không dựng lại layout. Query chỉ trả published data có giới hạn, detail dùng unique slug và metadata/not-found thật; không còn runtime mock trên hai route. Roundtrip DB thật pass draft ẩn → publish hiện → PATCH preserve legacy → Trash ẩn → restore draft + Audit; build/typecheck/lint và HTTP route pass. **Pending integration:** public EN chưa có locale routing dùng chung; Home/Header selection binding và authenticated screenshot regression desktop/tablet/mobile chưa đóng, nên không nâng `[x]`.

### Audit Dịch vụ — 2026-09-11

- **Scope/UI:** CMS list + full-page form + preview/drawers; public `/services` list/search/pagination/sidebar consultation and `/services/[slug]` detail/breadcrumb/rich content/consultation/related Products/related Services/Product modal. `ServicesView` is the React visual/behavior authority; current minimal App Router pages are not parity authority.
- **Legacy classification:** `REUSE_PRESENTATION` for CMS primitives, pagination, media picker and small drawers/modal shells; `EXTRACT_AND_REBUILD` for `ServiceFormView`, preview adapter and the list/detail sections of `ServicesView`; `REFERENCE_ONLY` for whole `ServicesManager`/`ServicesView`, mock fixtures, local CRUD, `setTimeout` submission, SPA ID navigation and inferred category grouping.
- **Live PostgreSQL:** `cic_services` has 9 rows/9 published and `cic_services_en` 6/6; blank or normalized duplicate alias = 0 in both locales. All 15 rows currently have no `image`. `cic_services_products_rel*` exist with locale-correct FK, ordered composite PK and reverse indexes, but both contain 0 rows. Alias indexes are non-unique. Legacy `category_id/category_*` has no trustworthy category table and is not a CMS relation authority.
- **Authority/ownership:** PostgreSQL is production authority. Editable fields proven by CMS/function docs are title, alias, summary, tags, rich content, image, SEO, publish state, ordering and ordered related Products. System/audit fields and legacy category/cache/rating/source/chat/technical fields are preserved outside PATCH ownership. Public reads only the published snapshot and explicit list/detail/relation projections; no `select *`, mock fallback or cross-locale fallback.
- **Dependencies:** Auth/RBAC and Media exist; Service Audit actions/entity are registered. Product tables and ordered Service–Product junctions exist. Service-specific typed Trash adapter is absent. Used-by, customer requests, Function SEO/Home placement and locale routing are integrations. Business decision 2026-09-11 adopts the same single-row Draft/Published workflow as News; no parallel working revision is required.
- **Hard-data resolution:** migration `20260911_services_hardening.sql` validates nonblank/unique normalized aliases independently for VI/EN, adds check + unique indexes and resynchronizes identity sequences without changing Service content or status.
- **Responsive:** `KEEP` reference hierarchy, desktop grids and image ratios; `ADAPT` toolbar/table, list/sidebar and detail/related grids; `FIX` long text, local table overflow, sticky overlap, modal/drawer `dvh`/focus/Escape, touch targets and mobile form stacking; `DO_NOT_COPY` hover-only actions, full-screen CMS overlays outside the content shell and simulated submit/progress behavior.
- **i18n:** `BILINGUAL_CONTENT`; VI/EN tables and Product junctions are independent. No translation table or automatic fallback is justified.
- **Conclusion:** module remains `[A]`; audit only, no implementation status claimed. Draft/Published policy and hard-data prerequisites are now defined. `READY_TO_IMPLEMENT`.

### Audit & Implementation Mẫu email — 2026-09-11

- **Scope & Bề mặt:** CMS surface tại `/cms/email-templates` (và alias `/cms/email_templates`), không có public surface trực tiếp (là transactional & messaging backend capability phục vụ Form/CTA/Auth/Orders). Quản lý danh sách theo workspace (`vi`/`en`), tìm kiếm, bộ lọc Sự kiện/Đối tượng nhận/Trạng thái, tạo mới, chỉnh sửa nội dung, chèn biến động (tokens), lưu bản nháp tạo version mới, xuất bản (publish), nhân bản (duplicate), lưu trữ (archive đơn/hàng loạt), xem trước dữ liệu mẫu (preview modal) và tra cứu nơi sử dụng (usage modal).
- **Database & Data Seeding:**
  - Production authority: Bảng PostgreSQL `cic_email_templates` và `cic_email_template_versions`.
  - Giữ nguyên các bảng legacy `cic_email` và `cic_email_en` (13 templates tiếng Việt, 13 templates tiếng Anh).
  - Đã seed thành công 58 templates vào database: Nạp toàn bộ template thực tế từ `cic_email` và `cic_email_en`, tự động chuẩn hóa các token cũ `{name}`, `{name1}`, `{link1}` sang `{{customer.full_name}}`, `{{product.name}}`, `{{document.download_url}}`, kèm theo 20 template chuẩn cho cả 5 sự kiện sản phẩm (`product_contact`, `product_download`, `product_purchase`, `product_quote`, `product_hardlock`), xác thực kích hoạt tài khoản (`auth_activate`), khôi phục OTP (`auth_forgot_password`), xác nhận đơn hàng (`order_confirmation`), thanh toán thành công (`order_payment_success`) cho cả khách hàng và nội bộ trên 2 workspace `vi` và `en`.
- **Hạ tầng Mail & Token Engine:**
  - Token engine: `src/lib/email/tokens.ts` giải mã cả định dạng mới `{{variable.field}}` và định dạng cũ `{field}`.
  - Transporter: `src/lib/email/transporter.ts` (kèm alias `src/lib/mail.ts`) sử dụng Nodemailer, hỗ trợ SMTP an toàn hoặc simulated transport (tránh crash khi dev/local chưa có cấu hình SMTP).
  - Dispatcher: `src/lib/email/dispatcher.ts` tra cứu template active theo `(workspace, eventKey, audience)` từ DB, render tokens và gửi mail.
- **CMS API & UI:**
  - API Routes: `/api/cms/email-templates` (GET list, POST create), `.../[id]` (GET detail, PUT update version, DELETE archive), `.../[id]/publish` (POST publish), `.../[id]/duplicate` (POST duplicate), `.../[id]/usage` (GET lookup), `.../bulk-archive` (POST bulk archive).
  - Route CMS: `EmailTemplatesRoute` gắn vào `/cms/email-templates` trong `src/app/cms/[...path]/page.tsx`, hỗ trợ chuyển nhanh Workspace VI/EN, kết nối trực tiếp API thật.
- **Kiểm thử & Roundtrip:**
  - Verification test `npm run verify:email-templates` pass 100%: CRUD, tạo version, update tăng version number, publish active version, nhân bản, token interpolation và simulated send email.
  - TypeScript build pass 100% (`typecheck:foundation` & `typecheck:legacy`).
- **Kết luận:** Module đạt trạng thái `[I]` (Core DB-backed hoàn thành đầy đủ; Pending integration: kích hoạt tự động gửi mail khi form/CTA submit trên production database và cấu hình SMTP credentials môi trường production).

### Audit & Implementation Dự án — 2026-09-11

- **Scope/UI Reference:** CMS list + full-page form + modal preview 3 thiết bị; Public `/projects` danh sách studio portfolio (bất đối xứng 2 cột 7-5 / 5-7, pill tabs lĩnh vực, dropdowns tìm kiếm/sắp xếp, hover overlay trượt lên viền cam, phân trang) và `/projects/[slug]` chi tiết 8/4 (Breadcrumbs, H1, Tagline, Rich Text, Factsheet bên phải, Công nghệ áp dụng, link sản phẩm/dịch vụ liên quan, nút mở `ConsultationModal`, block Quote, 3 dự án liên quan, banner CTA).
- **Live PostgreSQL:** Seed và nạp 8 dự án thực tế vào `cic_projects`, `cic_projects_products_rel`, `cic_projects_services_rel` với đầy đủ Rich Text, factsheet, công nghệ, thời gian và liên kết quan hệ.
- **Authority/Ownership:** PostgreSQL là nguồn dữ liệu thật duy nhất. Public reads chỉ lấy dự án `published = true` với các projection chi tiết `ProjectListItemViewModel` và `ProjectDetailViewModel`. Form CMS cập nhật trực tiếp DB qua Server Actions + API endpoint `/api/cms/projects`. Giới hạn dự án nổi bật (`FEATURED_CONTENT_LIMITS.project = 3`) được kiểm soát chặt chẽ.
- **CMS Surface:** Đầy đủ CRUD, tìm kiếm, lọc theo lĩnh vực/trạng thái, phân trang, bulk actions, modal preview 3 thiết bị (Desktop, Tablet, Mobile), toggle dự án nổi bật, xóa chuyển vào Thùng rác (`cic_trash_items`) với Audit Writer (`project.trashed`).
- **Public Surface:** Tái hiện 100% UI/UX và responsive của React reference (`ProjectsView.tsx`), Server Component SSR với `generateMetadata` chuẩn SEO, tích hợp `ConsultationModal` liên kết hệ thống yêu cầu tư vấn.
- **Dependencies:** Auth/RBAC task `projects`, Media Foundation, Audit Writer, Trash Adapter, Products & Services relation master data.
- **Kết luận:** Module đạt trạng thái `[I]` (Core DB-backed hoàn chỉnh cả Public và CMS surface; pending integration: routing đa ngôn ngữ EN và liên kết dynamic selector của Page Builder).

### Audit Sản phẩm — 2026-09-09

- **Scope:** CMS Product VI/EN, public `/products` và `/products/[slug]`, card/list/detail, bốn taxonomy, related Product, gallery/video/file, SEO, trạng thái/nổi bật/thứ tự và contact sidebar. CTA đăng ký/tải/báo giá chỉ là integration trực tiếp; không audit sâu Forms/Requests/Email ngoài contract Product cần gọi.
- **UI authority:** React `ProductsManager`/`ProductsFormView` và `ProductsView`/`ProductDetailView` là reference về hierarchy. CMS gồm header/tabs, search + category/brand/type/application filters, column/density controls, bulk draft/publish/featured/delete, table, pagination, preview/activity/duplicate/delete và full-page form. Public gồm hero, mobile filter toggle, sticky accordion sidebar, active chips/sort/grid/empty/pagination; detail có back, gallery, badges/name/price/tags/CTA, tabs Overview/Features/Video/Documents, contact card và related Products; action modal có contact/buy/download tabs.
- **Legacy classification:** `REUSE_PRESENTATION` cho các UI primitive, file input và modal/drawer nhỏ sau khi tách data; `EXTRACT_AND_REBUILD` cho form Product và public detail vì có giá trị UI nhưng trộn state, mapping, HTML/media và interaction; `REFERENCE_ONLY` cho `ProductsManager`/`ProductsView` mega-component, mock types/data, local CRUD, simulated submission/download và SPA selected-product navigation.
- **Live DB:** `cic_products` 375 row/275 published/43 featured, `_en` 192/155/10; không thiếu name nhưng alias rỗng 92/32, không có alias chuẩn hóa bị trùng trong các alias có giá trị. Relation category 535/255, application 249/89, related 655/152 đều 0 orphan. FK category tree, type, gallery và relation EN hiện đã trỏ đúng bảng EN. Product VI/EN có dữ liệu thật đáng kể ở description 281/157, image 257/84, features 81/43, video 72/30; SEO EN chỉ 5 row.
- **Field ownership:** form được duyệt ghi name/alias/code/other language URL, summary/description/feature/video, price, image/icon, published/is_hot/teamview/ordering/landing page, SEO, các file/link và relation category/brand/application/type/related. Junction là authority cho category/application/related; `types_id` và numeric `manufactory` là relation hiện tại. Các cache/CSV legacy chỉ preserve/compatibility, không làm read authority hoặc bị ghi đè ngoài ownership. Các mock field unit/origin/availability/highlights/tech_specs/gallery array/owner/completeness/version/site placement không tự đưa vào input.
- **Data authority/Next:** public đang đọc PostgreSQL thật nhưng detail gọi `listPublishedProductsForReference()` rồi tìm trong memory, projection thiếu gallery/file/SEO đầy đủ và có presentation fallback “Khác/Đang cập nhật”; CMS route vẫn `demoCatalogDataSource`, local mutation/fake toast/delete/duplicate/activity. `ProductsView` còn fallback `getProductsData()`, action form/download dùng `setTimeout`; server query đang import shared presentation `Product` type. Giữ presentation; refactor domain/server/client boundaries; replace mock/fallback/simulation và duplicated mapping; remove dead mock-only contracts khỏi production runtime.
- **Dependencies:** hard dependency đã có ở mức đủ triển khai: Auth/RBAC, PostgreSQL Product schema, Product Settings master/relation, Media core/picker/resolver, Audit Writer/Registry, typed Trash foundation và public shell. Trong implementation phải thêm Product action/entity registry, lossless Trash adapter, server sanitizer, normalized partial unique alias + sequence hardening và transaction relation writes. Soft integration: CTA/Forms/Customer Requests/Email delivery, Function SEO dashboard/sitemap, Services/Projects used-by và Media migration từ raw legacy path.
- **Responsive:** `KEEP` public hierarchy, desktop filter/detail grids, tabs và CMS full-page form; `ADAPT` toolbar/actions/filter sidebar/gallery/grid/table/form columns; `FIX` sticky header/filter overlap, table local overflow, hover-only card actions, modal `dvh`/focus/scroll lock, long text/file names/touch targets and pagination wrapping; `DO_NOT_COPY` desktop-dense mobile table, simulated progress/download, unbounded overlays và whole-list detail fetch.
- **i18n:** `BILINGUAL_CONTENT`; `cic_products` và `_en` cùng các junction/gallery `_en` là dataset độc lập. Không fallback chéo locale hoặc tự tạo translation table.
- **Kết luận audit:** schema và hard dependencies đủ để bắt đầu implementation. Alias rỗng legacy phải được preserve; alias mới/sửa phải hợp lệ và unique. Module vẫn `[A]`, chưa implement hoặc complete. `READY_TO_IMPLEMENT`.
- **Implementation `[I]` 2026-09-09:** CMS `/cms/products` đọc PostgreSQL VI/EN thật và giữ hierarchy list/full-page form của React; create/PATCH, draft/publish, featured, duplicate và delete-to-Trash chạy qua Server Action có RBAC. Repository chỉ ghi field form sở hữu, transaction các junction category/application/related, bảo toàn field legacy, sanitize rich HTML, Audit Writer và giới hạn featured. Public đã bỏ fallback static, chỉ đọc published, lấy gallery, 6 download slot và related Product từ DB. Contact/buy/download đã ghi nhận yêu cầu qua contact foundation; phần gửi email/cấp file sau yêu cầu vẫn là integration ngoài Product. Ảnh legacy tiếp tục đọc từ `/images/**`, ảnh mới dùng Media foundation; iframe HTML legacy được bóc URL trước khi render và preview dùng trực tiếp dữ liệu form. Migration sequence + partial normalized unique alias đã áp dụng; DB roundtrip draft → publish → public → Trash/restore draft + gallery/Audit pass; build và foundation typecheck/lint pass. **Pending integration:** Email delivery/download artifact, Media-ID conversion cho tài sản mới, Services/Projects used-by, Function SEO/sitemap và authenticated browser regression chưa đóng, nên không nâng `[x]`.
- **Legacy media compatibility 2026-09-09:** thư mục repository `images/` là read authority cho kho ảnh legacy đã bàn giao và được phục vụ an toàn qua `/images/[...path]`; URL DB dạng relative hoặc `https://www.cic.com.vn/images/...` được normalize về local, không import lại hàng loạt vào Media. Upload mới trong CMS tiếp tục dùng Media foundation. Product video giữ nguyên HTML legacy trong DB nhưng mapper chỉ tách URL `iframe[src]` hợp lệ để render, tránh request `/%3Cp...` 404. Preview map trực tiếp payload form (`name/summary/description/feature_details/video`, taxonomy, gallery và 6 file slots), không dùng các mock field cũ.

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

### Audit Người phụ trách kinh doanh — 2026-09-09

- **Scope:** master hồ sơ đầu mối VI/EN trong `cic_business*`, list/search/status/order, thông tin liên hệ và năm nhóm gán Product (`lienhe*`); embedded contact sidebar trên Product detail. Không phải `cic_users`, không có public route/list/detail/SEO riêng.
- **UI authority:** giữ hierarchy React tại `/cms/product-settings/sales-staff`: header + CTA, search, status/Product filter, bulk deactivate, bảng tên/thứ tự/SĐT-Skype-Zalo/trạng thái/ngày tạo-ID/action, form toàn trang và dialog xử lý lifecycle. Form-owned là `name`, `alias`, `phone`, `Skype`, `Zalo`, `published`, `ordering` và năm nhóm Product; không tự thêm ảnh, SEO, mô tả hoặc field khu vực riêng.
- **Functional conflict:** tài liệu yêu cầu vai trò/khu vực; React biểu diễn bằng năm bucket quan hệ (liên hệ, kinh doanh, kỹ thuật, kinh doanh Bắc/Nam), không có control `khuvuc*`. Giữ bucket làm contract đã có; không expose `khuvuc/khuvuc_name` nếu chưa có quyết định UI/nghiệp vụ mới.
- **Live DB:** VI 25 row/23 published, EN 18/14; không thiếu name/alias/phone. `Skype` có dữ liệu 16/25 VI và 18/18 EN; `Zalo` 21/25 VI và 18/18 EN. Năm field `lienhe*` là CSV ID Product, toàn bộ token đều numeric nhưng có orphan legacy: VI 2 token, EN 4 token. Chỉ có PK + index alias thường, chưa có FK/unique normalized alias.
- **Dependencies:** Auth/RBAC, Product identity/query, Audit Writer/Registry và Trash registry đã có; khi implement phải bổ sung action/entity registry + typed lossless adapter trong module. Product CMS đang demo và public Product contact sidebar đang hard-code là integration trực tiếp cần thay bằng shared read model, nhưng không block core master/assignment vì bảng Product thật và IDs đã tồn tại.
- **Next hiện tại:** route và presentation giữ làm reference; `ProductSettingsManager` dùng demo source/local mutation, types nằm trong UI, năm assignment không có server validation, usage/handover component không được mount, public contact hard-code. Kết luận: giữ shell/presentation; refactor boundary; replace authority/mutations/contact composition; remove runtime mock/fake success/dead controls. Module vẫn `[A]`, chưa implement hoặc complete.
- **Kết luận audit:** đủ schema và hard dependency để bắt đầu implementation; orphan phải được preserve/hiển thị cảnh báo, không tự xóa hoặc default. `READY_TO_IMPLEMENT`.
- **Implementation `[C]` 2026-09-09:** Đã tách domain/query/repository/action cho `cic_business` và `cic_business_en` với projection tường minh, validation server, PATCH đúng field form-owned và hardening sequence/unique alias. CMS route thật có list/search/status/Product filter/pagination, create/edit, năm nhóm gán Product, bulk deactivate, permission server, relation guard, Audit và typed lossless Trash restore inactive. Product detail public đã bỏ toàn bộ contact hard-code và đọc cùng PostgreSQL read model, chỉ trả staff published. Roundtrip DB thật pass draft-hidden → publish-visible, preserve orphan + `khuvuc/khuvuc_name/products` legacy, chặn Trash khi còn assignment, restore inactive và Audit event. Không có public route riêng; Media/SEO/handover không thuộc surface bắt buộc đã duyệt. Riêng module Người phụ trách kinh doanh đạt `[C]`; chưa nâng `[x]` vì authenticated browser screenshot regression desktop/tablet/mobile chưa hoàn tất. Product Settings tổng vẫn giữ trạng thái riêng theo các module con còn lại.

### Audit Yêu cầu khách hàng — 2026-09-14

- **A. Scope:** CMS `/cms/customer-requests` và `/cms/customer-requests/detail/[id]`; tiếp nhận và theo dõi hồ sơ yêu cầu khách hàng từ mọi nguồn tương tác trên Website (Liên hệ, Đăng ký mua/Download sản phẩm, Đơn hàng, Biểu mẫu động); các dependency trực tiếp: `cic_contact`, `cic_contact_en`, `cic_product_contact`, `cic_order`, `cic_form_submissions`, `cic_customer_request_states`, `cic_customer_request_notes`, `cic_customer_request_events`, `cic_users` (nhân sự phân công), Auth/RBAC, Audit Writer và Trash foundation. Không bao gồm chỉnh sửa Form Builder, CTA Builder hay Email Template editor.
- **B. UI Reference Map:** Giữ nguyên cấu trúc giao diện và trải nghiệm của React reference:
  - **List view (`RequestList`):** Thanh công cụ tìm kiếm full-text; bộ lọc trạng thái (7 status), Form, CTA, người phụ trách (kèm filter `unassigned`), khoảng ngày gửi; 6 tab trạng thái (`all`, `new`, `processing`, `completed`, `not_suitable`, `cancelled`); bảng danh sách yêu cầu (checkbox chọn đơn/hàng loạt, khách hàng kèm email, số điện thoại `tel:`, Biểu mẫu & CTA badge, trang phát sinh kèm URL title, thời gian tương đối `formatRelativeTime`, avatar và nút gán người phụ trách nhanh, cột ghi chú nhanh kèm badge số lượng và snippet mới nhất, badge trạng thái kèm click đổi trạng thái nhanh theo vòng lặp, nút thao tác: Xem chi tiết, Gán người phụ trách, Ghi chú nội bộ, Xóa vào Thùng rác); phân trang 10 dòng/trang; thanh thao tác hàng loạt `CmsBulkActionBar` (gán người phụ trách hàng loạt, chuyển vào Thùng rác hàng loạt); xuất dữ liệu CSV định dạng UTF-8 BOM (`\uFEFF`) đầy đủ 14 cột nghiệp vụ.
  - **Detail view (`RequestDetailPage`):** Thanh điều hướng quay lại danh sách; thẻ tóm tắt khách hàng và thông tin liên hệ (copy to clipboard); dropdown cập nhật Trạng thái, dropdown cập nhật Độ ưu tiên (`low`, `medium`, `high`, `urgent`), khu vực quản lý thẻ nhãn (Tags); 3 tab nội dung:
    - Tab `info`: Toàn bộ các giá trị trường gửi (`submissionValues`), khu vực thảo luận/ghi chú nội bộ (danh sách ghi chú hiển thị người tạo, thời gian, nội dung và form nhập gửi ghi chú mới).
    - Tab `source`: Thông tin nguồn phát sinh (Form ID, version, tên Form; CTA ID, tên CTA; loại trang, ID, URL, tiêu đề trang; vị trí placement; thời điểm gửi; tham số UTM `utm_source`, `utm_medium`, `utm_campaign`; `referrer`; thông tin thiết bị user-agent/browser/os/device).
    - Tab `logs`: Nhật ký xử lý / Timeline lịch sử hoạt động (loại hành động: `created`, `status_changed`, `reassigned`, `note_added`, `priority_changed`, `tags_changed`, giá trị cũ, giá trị mới, người thực hiện, thời gian).
  - **Modals:** Modal gán/chuyển giao nhân sự phụ trách `RequestReassignModal` (hỗ trợ gán đơn lẻ và hàng loạt, tìm kiếm nhân sự, bắt buộc/tuỳ chọn lý do chuyển giao để tự động ghi log và note nội bộ); modal ghi chú nhanh `RequestQuickNotesModal`; modal xác nhận xoá `CmsTrashConfirmDialog`.
- **C. Phân loại Legacy/Reference:**
  - `REUSE_PRESENTATION`: Toàn bộ visual presentation của `RequestList`, `RequestDetailPage`, `RequestReassignModal`, `RequestQuickNotesModal`, màu sắc badge trạng thái và độ ưu tiên.
  - `EXTRACT_AND_REBUILD`: `CustomerRequestManager` cần tách rõ ranh giới Server/Client (tải dữ liệu qua Server Component, server-side pagination/filtering thay vì `slice` 10 dòng trên client memory; các mutation chuyển thành Server Actions / API routes chuẩn).
  - `REFERENCE_ONLY`: `mockData.ts` (`MOCK_CUSTOMER_REQUESTS`, `MOCK_STAFF_MEMBERS`), demo datasource `getDemoCustomerRequestModuleData`, local `useState` mutations, `window.history.pushState`.
- **D. Khảo sát Database thực tế & Data Authority:**
  - **Quy tắc thiết kế bất di bất dịch (Decision 6):** KHÔNG gộp bảng vật lý. Toàn bộ bản ghi nguồn được giữ nguyên vẹn tại các bảng nguồn riêng biệt (`cic_contact`, `cic_contact_en`, `cic_product_contact`, `cic_order`, `cic_form_submissions`).
  - **3 bảng operational overlay ĐÃ TỒN TẠI trên PostgreSQL:**
    - `cic_customer_request_states`: id, workspace, source_type, source_id, status, assigned_user_id, priority, tags, created_at, updated_at. Unique `(workspace, source_type, source_id)`.
    - `cic_customer_request_notes`: id, request_state_id, content, created_by, created_at.
    - `cic_customer_request_events`: id, request_state_id, event_type, old_value, new_value, actor_id, created_at.
  - **Dữ liệu nguồn thật hiện có trong DB (tổng 2.607 bản ghi):**
    - `cic_contact`: 216 bản ghi (Liên hệ website VI).
    - `cic_contact_en`: 132 bản ghi (Liên hệ website EN).
    - `cic_product_contact`: 2.257 bản ghi (Đăng ký mua, Download sản phẩm, Liên hệ sản phẩm).
    - `cic_order`: 2 bản ghi (Đơn hàng trực tiếp).
    - `cic_form_submissions`: 0 bản ghi.
    - Cả 3 bảng overlay hiện có 0 dòng.
  - **Nhân sự phụ trách (`assigned_user_id`):** Phải lấy từ tài khoản CMS thật `cic_users(id, full_name, email, username)` đang active; loại bỏ hoàn toàn `MOCK_STAFF_MEMBERS`.
- **E. Ranh giới Runtime & Next.js:**
  - Public submission: `submitCustomerInteractionAction` hiện mới chỉ ghi `cic_contact` mà chưa tạo overlay `cic_customer_request_states`. Khi hoàn thiện, submission phải ghi atomic bản ghi nguồn kèm state khởi tạo ban đầu.
  - CMS read model: Unified read model tổng hợp đa nguồn theo `workspace` (VI/EN). Khi truy vấn, query union/join có phân trang server-side kết hợp trạng thái từ `cic_customer_request_states` (nếu chưa có dòng state thì default `status='new', priority='medium'`).
  - Server actions / API: Thao tác cập nhật trạng thái, đổi độ ưu tiên, gán nhân sự, thêm ghi chú, gắn thẻ tag và chuyển vào Thùng rác phải ghi đồng thời vào `cic_customer_request_states` + append row vào `cic_customer_request_events` (và `cic_customer_request_notes`) trong cùng một database transaction.
- **F. Quyền hạn (RBAC) & Audit:**
  - Quyền hạn: Bảng `cic_permission_tasks` chưa có module riêng `customer_requests`. Server guard áp dụng: `can(principal, 'customer_requests', action) || can(principal, 'contents', action) || principal.isAdministrator`.
  - Audit Trail: Đăng ký đầy đủ các action hệ thống trong `src/server/audit/registry.ts` (`CUSTOMER_REQUEST_STATUS_CHANGED`, `CUSTOMER_REQUEST_REASSIGNED`, `CUSTOMER_REQUEST_TRASHED`) và ghi nhận qua Audit Writer chung.
- **G. Phân loại Next.js (KEEP / REFACTOR / REPLACE / REMOVE):**
  - `KEEP`: Layout bảng, drawer/page chi tiết 3 tabs, modals gán nhân sự và ghi chú nhanh, CSV export format.
  - `REFACTOR`: `CustomerRequestManager` nhận paged read model và filter options từ server; URL detail dùng Next.js App Router hoặc query param `/cms/customer-requests?id=...` / modal; nhân sự phụ trách lấy từ `cic_users`.
  - `REPLACE`: Demo data source `getDemoCustomerRequestModuleData` thay bằng `listCustomerRequests` server query đa nguồn; `getCustomerRequestsData` sơ sài (9 dòng) thay bằng Unified Customer Request Service; local `useState` mutation thay bằng Server Actions/API có transaction.
  - `REMOVE`: `MOCK_CUSTOMER_REQUESTS`, `MOCK_STAFF_MEMBERS`, thao tác `pushState` thủ công, các trường device/UTM giả lập không có nguồn ghi.
- **H. i18n:**
  - Workspace độc lập `vi` và `en`:
    - Workspace `vi`: tổng hợp `cic_contact` (216 rows), `cic_product_contact` (2.257 rows), `cic_order` (2 rows) và các submission tiếng Việt.
    - Workspace `en`: tổng hợp `cic_contact_en` (132 rows) và các submission tiếng Anh.
  - Không gộp lẫn lộn giữa hai workspace; bộ lọc workspace CMS điều khiển phạm vi hiển thị.
- **I. Kết luận audit:** Module hiện đang ở trạng thái `[A]`. Đã hiểu rõ toàn diện 4 nguồn: React reference, Next.js codebase, Database schema và tài liệu migration. Hard dependencies (schema overlay, DB nguồn, auth, transaction, audit) đã sẵn sàng. **READY_TO_IMPLEMENT**.

### Audit Biểu mẫu (Forms & Submissions) — 2026-09-14

- **A. Phạm vi & Bề mặt (Surfaces):**
  - CMS Surface tại `/cms/forms`: Quản lý danh sách Biểu mẫu theo workspace (`vi`/`en`), tìm kiếm, lọc theo trạng thái (`active`, `draft`, `inactive`, `archived`), khoảng ngày tạo, sắp xếp theo tên/ngày/lượt gửi/tỷ lệ chuyển đổi.
  - CMS Form Builder: Đã tách module thành các phần riêng biệt: Canvas dựng trường kéo thả, Field Palette (các loại trường: text, email, phone, textarea, select, checkbox, radio, date, file, consent), Field Inspector (cấu hình nhãn, placeholder, validate, roleType `customer_name`/`email`/`phone`), Tabs Cài đặt cơ bản (Tên quản trị, tiêu đề, mô tả, shortcode), Tab Cấu hình Xử lý sau gửi (lưu DB, tạo Yêu cầu khách hàng, gửi email thông báo Admin + template nội bộ, gửi email xác nhận cho Khách + template khách hàng, nhãn nút submit, thông báo thành công, URL điều hướng), Tab Thống kê (lượt gửi, chuyển đổi).
  - CMS Modals: Xem trước biểu mẫu theo thiết bị (Desktop / Mobile), Xem danh sách lượt gửi ghi nhận (`FormSubmissionsModal`), Xem trước email template tương ứng.
  - Public Surface: Render biểu mẫu động theo cấu hình trường trên các trang tĩnh (`StaticPages`), các section cố định (ví dụ Form tư vấn chân trang/hero), hoặc nhúng trong Rich Text (`cic_content_embeds`), hoặc mở qua CTA Action `open_form`.
- **B. Đối chiếu Legacy (React Reference & PHP):**
  - Hệ thống PHP legacy (`httpdocs`) không có form builder generic; các form liên hệ được hard-code theo từng module (`contact`, `product_contact`, `order`).
  - React reference (`FormManager.tsx`, `FormBuilderView.tsx`, `mockData.ts` 483 dòng) là chuẩn về visual và tương tác nghiệp vụ.
  - Hiện tại Next.js CMS route `/cms/forms` chưa được mount vào `CmsCatchAllPage` (đang fallback qua `CmsFoundationRoute` vào mock data `getDemoFormModuleData`).
- **C. Database Schema & Data Authority:**
  - Production authority gồm 4 bảng PostgreSQL đã được tạo sẵn trong database:
    1. `cic_forms` (22 cột): `id`, `workspace`, `code`, `is_system`, `admin_name`, `title`, `description`, `status`, `current_version`, `create_customer_request`, `send_admin_email`, `admin_emails`, `admin_email_template_id`, `send_confirmation_email`, `confirmation_email_template_id`, `submit_button_text`, `success_message`, `redirect_url`, `created_by`, `created_at`, `updated_at`, `deleted_at`. (Hiện có 0 rows).
    2. `cic_form_fields` (13 cột): `id`, `form_id`, `field_key`, `field_type`, `role_type`, `label`, `placeholder`, `help_text`, `is_required`, `is_locked`, `position`, `validation_config`, `options_config`. (Hiện có 0 rows).
    3. `cic_form_submissions` (9 cột): `id`, `form_id`, `form_version`, `source_type`, `source_id`, `source_path`, `cta_id`, `placement_key`, `submitted_at`. (Hiện có 0 rows).
    4. `cic_form_submission_values` (7 cột): `id`, `submission_id`, `field_id`, `field_key`, `value_text`, `value_json`, `media_asset_id`. (Hiện có 0 rows).
  - Seed Data: Cần seed 4 biểu mẫu chuẩn ban đầu (tương ứng với MOCK_FORMS: Tư vấn ERP, Báo giá, Liên hệ chung, Đăng ký dùng thử) vào `cic_forms` và `cic_form_fields` cho cả 2 workspace `vi` và `en` với cờ `is_system` phù hợp.
- **D. Quan hệ & Ràng buộc toàn vẹn (Integrity & Dependencies):**
  - Ràng buộc Email Templates: `admin_email_template_id` và `confirmation_email_template_id` có FK tới `cic_email_templates(id)` ON DELETE RESTRICT. Khi form bật gửi mail, template phải tồn tại, active và đúng audience (`internal` cho admin, `customer` cho xác nhận).
  - Ràng buộc Yêu cầu khách hàng: Khi `create_customer_request = true`, việc khách gửi biểu mẫu tại website public sẽ ghi đồng thời vào `cic_form_submissions` + `cic_form_submission_values` và được Unified Customer Request Service nhận diện là `source_type = 'form_submission'`.
  - CTA Action `open_form`: Bảng `cic_ctas.form_id` trỏ FK tới `cic_forms(id)` ON DELETE RESTRICT.
- **E. Quyền hạn (RBAC) & Audit:**
  - Quyền hạn: Server guard áp dụng `can(principal, 'forms', action) || can(principal, 'contents', action) || principal.isAdministrator`.
  - Audit Trail: Đăng ký đầy đủ các action hệ thống trong `src/server/audit/registry.ts` (`FORM_CREATED`, `FORM_UPDATED`, `FORM_STATUS_CHANGED`, `FORM_TRASHED`) và ghi nhận qua Audit Writer chung.
- **F. Phân loại Next.js (KEEP / REFACTOR / REPLACE / REMOVE):**
  - `KEEP`: Component `FormFieldPalette`, `FormFieldCanvas`, `FormFieldInspector`, `FormBasicSettingsTab`, `FormSubmitActionsTab`, `FormLivePreviewModal`, `FormEmailPreviewModal`.
  - `REFACTOR`: `FormManager.tsx` nhận dữ liệu forms thật từ PostgreSQL qua API route `/api/cms/forms` hoặc Server Component; mount `FormsRoute` trực tiếp trong `CmsCatchAllPage`.
  - `REPLACE`: `FormSubmissionsModal` mẫu tĩnh thay bằng component gọi API đọc submissions thật từ `cic_form_submissions` và `cic_form_submission_values`.
  - `REMOVE`: `mockData.ts`, `MOCK_FORMS`, `sampleSubmissions` hard-code.
- **G. Kết luận audit:** Module Biểu mẫu giữ trạng thái `[A]`. Đã hiểu rõ toàn bộ 4 nguồn tài liệu, cấu trúc DB thật, ràng buộc nghiệp vụ. **READY_TO_IMPLEMENT**.

### Audit Nút kêu gọi hành động (CTA) — 2026-09-14

- **A. Phạm vi & Bề mặt (Surfaces):**
  - CMS Surface tại `/cms/cta`: Quản lý danh sách CTA tái sử dụng (reusable CTAs) theo workspace (`vi`/`en`), tìm kiếm theo tên/mã/nội dung hiển thị, lọc theo trạng thái (`active`, `draft`, `inactive`, `archived`), loại hành động (Action Type: 7 loại), khoảng ngày tạo, sắp xếp theo mới nhất, cũ nhất, tên (A-Z), lượt nhấp (clicks), CTR.
  - CMS CTA Form View (`CtaFormView`): Chỉnh sửa hoặc tạo mới CTA với 4 khối thẻ chính:
    1. Thông tin định danh (`CtaIdentityCard`): Tên quản trị (`adminName`), Mã CTA (`code`), Ghi chú nội bộ (`description`), Copy mã nhúng shortcode (`{{cta:code}}`).
    2. Cấu hình hiển thị (`CtaDisplayCard`): Nội dung nút (`displayText`), Biểu tượng Lucide (`icon`), Kiểu nút (`styleVariant`: `primary`, `secondary`, `outline`, `gradient`), Kích thước nút preview (`buttonSize`: `sm`, `md`, `lg`).
    3. Cấu hình hành động (`CtaActionConfigCard`): 7 loại hành động độc quyền với cấu hình tương ứng:
       - `open_form`: Chọn Biểu mẫu tương tác mở Popup (FK trỏ tới `cic_forms(id)`).
       - `redirect_internal`: Chọn trang nội bộ từ danh sách hoặc nhập đường dẫn tùy chỉnh, chọn mở cùng tab (`_self`) hoặc tab mới (`_blank`).
       - `redirect_external`: Nhập URL bên ngoài (`url`), mở tab mới (`_blank`) hoặc cùng tab (`_self`).
       - `scroll_to_section`: Chọn section từ danh sách trang thực tế hoặc nhập `#id` tùy chỉnh.
       - `download_file`: Chọn tệp tài liệu từ Thư viện Media (FK trỏ tới `cic_media_assets(id)`).
       - `call_phone`: Nhập số điện thoại hotline (`phoneNumber`).
       - `send_email`: Nhập email nhận (`emailAddress`), chọn mẫu email (FK trỏ tới `cic_email_templates(id)`), bắt buộc bật xác nhận xem trước (`reviewBeforeSend: true`), nút xem trước email (`CtaEmailPreviewModal`).
    4. Sidebar Xem trước & Thống kê (`CtaLivePreviewCard`, `CtaAnalyticsSidebar`): Preview nút động thời gian thực theo cấu hình hiển thị và màu sắc, hiển thị thông số thống kê hiệu suất (Lượt xem, Lượt nhấp, Tỷ lệ nhấp CTR, Xu hướng).
  - CMS Modals: Xem trước CTA (`CtaPreviewModal`), Xem danh sách trang đang nhúng CTA (`CtaUsedByModal`), Modal xác nhận xóa chuyển Thùng rác (`CmsTrashConfirmDialog`).
  - Public Surface: Render nút CTA tái sử dụng thông qua shortcode nhúng trong bài viết/trang (`{{cta:code}}`) hoặc các CTA cố định theo layout (như `SYSTEM_CTA_IDS` trên Header hotline, Hero trang chủ, Banner tư vấn chân trang).
- **B. Đối chiếu Legacy (React Reference & PHP):**
  - Hệ thống PHP legacy (`httpdocs`) không có bảng hoặc module CTA generic; toàn bộ các nút liên hệ/gọi điện được hard-code trực tiếp trong giao diện của từng module.
  - React reference (`CtaManager.tsx`, `CtaFormView.tsx`, `mockData.ts` 327 dòng, các component con trong `cta/components/`) là chuẩn về mặt visual hierarchy và tương tác nghiệp vụ.
  - Hiện tại Next.js CMS route `/cms/cta` chưa được mount vào `CmsCatchAllPage` (đang fallback qua `CmsFoundationRoute` vào mock data `getDemoCtaModuleData`).
- **C. Database Schema & Data Authority:**
  - Production authority là bảng PostgreSQL `cic_ctas` (19 cột) ĐÃ TỒN TẠI trong database:
    - `id` (`bigint` identity PK)
    - `workspace` (`varchar` NOT NULL, `vi`/`en`)
    - `code` (`varchar` NOT NULL, Unique `(workspace, code)`)
    - `is_system` (`boolean` NOT NULL DEFAULT false)
    - `admin_name` (`varchar` NOT NULL)
    - `display_text` (`varchar` NOT NULL)
    - `description` (`text` NULL)
    - `icon` (`varchar` NULL)
    - `style_variant` (`varchar` NOT NULL DEFAULT 'primary')
    - `action_type` (`varchar` NOT NULL, CHECK 7 loại hành động chuẩn)
    - `action_config` (`jsonb` NOT NULL DEFAULT '{}'::jsonb)
    - `form_id` (`bigint` NULL, FK → `cic_forms(id)` ON DELETE RESTRICT)
    - `media_asset_id` (`bigint` NULL, FK → `cic_media_assets(id)` ON DELETE RESTRICT)
    - `email_template_id` (`bigint` NULL, FK → `cic_email_templates(id)` ON DELETE RESTRICT)
    - `status` (`varchar` NOT NULL DEFAULT 'draft')
    - `created_by` (`integer` NULL, FK → `cic_users(id)` ON DELETE SET NULL)
    - `created_at` (`timestamptz` NOT NULL DEFAULT now())
    - `updated_at` (`timestamptz` NOT NULL DEFAULT now())
    - `deleted_at` (`timestamptz` NULL)
  - Dữ liệu thực tế: Hiện có 0 dòng trong `cic_ctas`. Cần seed dữ liệu CTA ban đầu cho cả 2 workspace `vi` và `en` tương ứng với 7 CTA trong `mockData.ts` (`cta_explore_products`, `cta_about_cic`, `cta_contact`, `cta_tuvan_erp`, `cta_baogia_intellicad`, `cta_tai_catalogue`, `cta_goi_hotline`).
  - Phân định rõ: `form_id`, `media_asset_id`, `email_template_id` được lưu trực tiếp ở các cột FK chuyên biệt trên bảng `cic_ctas` (không nhét vào JSON `action_config`) nhằm đảm bảo tính toàn vẹn quan hệ (foreign key integrity). `action_config` chỉ lưu các tham số phi quan hệ (`url`, `openInNewTab`, `sectionId`, `phoneNumber`, `emailAddress`, `reviewBeforeSend`).
- **D. Quan hệ & Ràng buộc toàn vẹn (Integrity & Dependencies):**
  - Ràng buộc Form: Khi `action_type = 'open_form'`, `form_id` bắt buộc có giá trị và trỏ tới bản ghi active trong `cic_forms`. Khi xóa Form, DB chặn nếu đang được CTA tham chiếu (`ON DELETE RESTRICT`).
  - Ràng buộc Email Template: Khi `action_type = 'send_email'`, `email_template_id` bắt buộc trỏ tới `cic_email_templates(id)` đang active và đúng workspace.
  - Ràng buộc Media: Khi `action_type = 'download_file'`, `media_asset_id` trỏ tới `cic_media_assets(id)`.
  - Quản trị hệ thống (`is_system`): Các CTA hệ thống (`is_system = true`, ví dụ: `cta_explore_products`, `cta_about_cic`, `cta_contact`) được bảo vệ không cho phép xóa khỏi hệ thống.
- **E. Quyền hạn (RBAC) & Audit:**
  - Quyền hạn: Bảng `cic_permission_tasks` chưa có module riêng `cta`. Áp dụng fallback chuẩn của hệ thống: `can(principal, 'cta', action) || can(principal, 'contents', action) || principal.isAdministrator`.
  - Audit Trail: Đăng ký các action hệ thống trong `src/server/audit/registry.ts` (`CTA_CREATED`, `CTA_UPDATED`, `CTA_STATUS_CHANGED`, `CTA_TRASHED`) và ghi nhận qua `writeAuditEvent`.
- **F. Phân loại Next.js (KEEP / REFACTOR / REPLACE / REMOVE):**
  - `KEEP`: `CtaIdentityCard`, `CtaDisplayCard`, `CtaActionConfigCard`, `CtaLivePreviewCard`, `CtaAnalyticsSidebar`, `CtaPreviewModal`, `CtaUsedByModal`, `CtaEmailPreviewModal`.
  - `REFACTOR`: `CtaManager.tsx` chuyển sang gọi API/Server queries thay vì mutate local state; mount `CtaRoute` vào `CmsCatchAllPage`.
  - `REPLACE`: Demo data source `getDemoCtaModuleData` thay bằng Server Component `CtaRoute` và query PostgreSQL thật.
  - `REMOVE`: `MOCK_CTAS` hard-code và `MOCK_PLACEMENTS` giả lập.
- **G. Kết luận audit:** Module CTA ở trạng thái `[A]`. Đã hoàn tất audit toàn diện 4 nguồn (React reference, Next.js codebase, Database PostgreSQL thật, schema delta docs). Bảng `cic_ctas` cùng các FK đã tồn tại sẵn trên database thật. **READY_TO_IMPLEMENT**.

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
