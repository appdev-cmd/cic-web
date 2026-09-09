# UI Migration Status

## UI Reference Map — Loại sản phẩm (audit 2026-09-08)

| Surface | Reference/structure | Data & interaction | Responsive disposition |
|---|---|---|---|
| CMS list `/cms/product-settings/product-types` (`/cms/product-types`) | CMS shell; `CmsPageHeader`/FolderTree; tiêu đề “Loại sản phẩm”; CTA “Thêm loại sản phẩm”; toolbar; compact sticky table; pagination | Search tên/alias; status/reset; checkbox + bulk deactivate; cột Tên+alias, Thứ tự, Trạng thái, Thao tác; edit/delete | **KEEP** hierarchy/table direction; **ADAPT** toolbar stack/local table scroll; **FIX** long name wrap và touch target; không đưa mock-only field thành cột |
| CMS create/edit | `MasterDataFormDrawer`, drawer phải, sticky header/footer | Dùng đúng form chung của Product Settings: tiêu đề dữ liệu, alias tự sinh/read-only, trạng thái hoạt động, thứ tự ưu tiên. Không có control cho `image/type_code/requires_license_key/pricing_model_default` | **KEEP** nguyên common form hierarchy; **DO_NOT_COPY** field DB/mock không xuất hiện trong form reference |
| CMS usage/delete/history | `DeleteConfirmModal`; `UsageImpactDrawer` là concept liên quan nhưng chưa được nối từ list | Usage từ `cic_products*.types_id`; dữ liệu đang dùng không được hard delete; deactivate giữ relation; Trash/restore/Audit theo shared foundation | **FIX** bounded modal/drawer, focus/Escape/scroll/action wrap; **DO_NOT_COPY** local/permanent delete dựa mock `usage_count` |
| Product CMS consumer | `ProductsFormView` có `SearchableSelect` “Loại sản phẩm”; `ProductsManager` có filter/cột Loại sản phẩm | Selector là quan hệ đơn qua `types_id`, chỉ chọn type active; list/filter resolve master identity đúng locale | **KEEP** placement/select visual; **REPLACE** object/string dual matching và demo dataset bằng ID relation thật |
| Public Product listing/detail | `ProductsView` accordion “Loại sản phẩm” + Tag, selected count/clear/check/count/active chip; detail nhận `productType` | Option/count/matching và label phải resolve `types_id → cic_products_types*`; public chỉ dùng published. Không dùng mảng `PRODUCT_TYPES`, `types_name` hoặc heuristic tên | **KEEP** accordion/chip/detail visual; **ADAPT** mobile filter/touch/long label; **DO_NOT_COPY** hard-code/inference |
| States/stress | Loading, empty, error, permission; tên dài; type không usage; Product chưa gắn type; inactive type vẫn được dữ liệu cũ tham chiếu | Server/network error khác empty; Product chưa gắn type không được tự gán “Khác”; selector không hiện inactive cho quan hệ mới nhưng readback cũ vẫn giữ identity | Chuyển regression 360/390/768/1024/1280/1440 sang MODULE_RESPONSIVE; audit này chưa sửa UI |

Không có CMS detail/preview/SEO riêng hoặc public Product Type route được chứng minh. `ProductSettingsManager` (491 dòng), `MasterDataFormDrawer` (539 dòng) và `ProductsView` (1335 dòng) trộn nhiều module/state/behavior: giữ làm visual reference nhưng phân loại **EXTRACT_AND_REBUILD/REFERENCE_ONLY**, không import nguyên khối vào production domain/server. `DeleteConfirmModal` và primitives CMS có thể **REUSE_PRESENTATION** sau khi bỏ local mutation contract.

Live browser/DB audit xác nhận public filter hiện có đúng hierarchy nhưng data authority sai: `PRODUCT_TYPES` hard-code và heuristic; live DB có 4 identity VI/EN, 0 orphan, nhưng 148 `types_name` EN sai locale. Implementation phải dùng FK/master projection, không fallback silent.

**Implementation 2026-09-08:** CMS list/form/delete flow đã chuyển sang route-specific DB-backed UI; form thêm/sửa giữ đúng cấu trúc chung của React Product Settings và không render trường Biểu tượng. Drawer/modal bounded theo viewport và touch target tối thiểu 44px. Public Product filter/detail dùng master type published theo `types_id`, không còn hard-code/heuristic. Browser regression đã kiểm tra CMS desktop và mobile 390px, gồm list/table scroll và create drawer. Product CMS selector còn integration pending theo owner module Products.

---

## UI Reference Map — Lĩnh vực ứng dụng (audit 2026-09-08)

| Surface | Reference/structure | Data & interaction | Responsive disposition |
|---|---|---|---|
| CMS list `/cms/product-settings/applications` (`/cms/applications`) | CMS shell; `CmsPageHeader` + FolderTree; tiêu đề “Lĩnh vực ứng dụng”; CTA “Thêm lĩnh vực ứng dụng”; toolbar; compact table; pagination | Search tên/alias; status/reset; checkbox + bulk deactivate; cột Tên+alias, Thứ tự, Trạng thái, Thao tác; edit/delete | **KEEP** hierarchy/table visual; **ADAPT** toolbar stack và local horizontal scroll; **FIX** touch target/long-text wrap; không nhồi field legacy xuống mobile |
| CMS create/edit | `MasterDataFormDrawer`, drawer phải, sticky header/footer | Chỉ bốn control React render: tên, alias application tự sinh/read-only, trạng thái, thứ tự. `sector_group/color_badge/icon` chỉ ở type/mock payload, không phải field form | **KEEP** field set/hierarchy; **ADAPT** một cột mobile và drawer bounded `dvh`; **DO_NOT_COPY** type/mock fields không có control |
| CMS delete/usage | `DeleteConfirmModal`, `UsageImpactDrawer` concept | Usage phải tính từ các token ID trong `cic_products*.application`; deactivate/Trash/restore + Audit; chặn quyết định delete khi còn relation | **FIX** modal clipping/scroll/action wrap; **DO_NOT_COPY** permanent/local delete dựa vào mock `usage_count` |
| Public Product listing | Accordion “Ứng dụng” + FileText; selected count; clear; checkbox/count; show more sau 10; active chips; mobile filter drawer | Resolve option/count/matching từ Application published và CSV Product relation đúng locale; cùng nguồn DB với CMS | **KEEP** accordion/chip/count hierarchy; **ADAPT** mobile drawer/touch; **DO_NOT_COPY** raw `application_name` hoặc hover-only action |
| Public Product detail | Badge `product.app` + FileText trong detail | Hiển thị identity Application published; hỗ trợ nhiều relation thay vì ép một string không có identity | **KEEP** badge visual/icon; **ADAPT** wrap nhiều/nhãn dài; không tạo application detail route mới |
| States/stress | Loading, empty, network/error, permission; tên/alias dài; >10 option; ít/nhiều relation; orphan relation | Network error không được báo thành empty; orphan không được biến thành nhãn giả | Chuyển regression 360/390/768/1024/1280/1440 sang MODULE_RESPONSIVE sau implement; audit này chưa phải visual pass |

Không có CMS detail/preview/media selector/tab riêng hoặc public Application listing/detail/hero/gallery/CTA được chứng minh trong React reference. Responsive: **KEEP** shell/accordion/badge; **ADAPT** toolbar, drawer và mobile filters; **FIX** clipping/touch/wrapping; **DO_NOT_COPY** local mutation, hover-only action, mock usage và field không được form render.

Relation integrity re-audit trực tiếp 2026-09-08 không thay đổi UI map: junction VI/EN đã có đủ 249/89 relation, không còn orphan; IDs VI `8`, EN `13`,`14` là stub unpublished để bảo toàn identity đã mất. UI không hiển thị stub như option/nhãn giả; phục hồi tên thật là data-quality follow-up, không block implementation core. Public detail Next hiện tại không bám `ProductDetailView`, vì vậy consumer này là **REPLACE**, không phải UI Application đã hoàn tất.

### Implementation Lĩnh vực ứng dụng — 2026-09-08

- CMS Application đã tách thành Server route + client manager chuyên biệt, dùng PostgreSQL VI/EN thật và permission capabilities; list/search/status/pagination, bulk deactivate, create/edit drawer, usage guard và Trash dialog giữ hierarchy reference với table scroll, touch target 44px, bounded drawer/modal và long-text wrapping.
- Public Product list/detail lấy Application published từ junction; detail route dùng lại `ProductsView`/`ProductDetailView`, không còn article tối giản và không còn `application_name` fallback.
- Public desktop/mobile route HTTP 200; mobile filter drawer mở và heading Application hiển thị. Authenticated CMS visual regression chưa có session. Product reference type chỉ có một chuỗi `app`, nên multi-relation đang hiển thị nhãn ghép thay vì facet độc lập; trạng thái module `[I]`, chưa `[x]`.

## UI Reference Map — Hãng sản xuất (audit 2026-09-04)

| Surface | Reference/structure | Data & interaction | Responsive disposition |
|---|---|---|---|
| CMS list `/cms/product-settings/brands` | CMS shell; header FolderTree; CTA “Thêm hãng sản xuất”; toolbar; compact table sticky | Search tên/alias; status; reset; select/bulk deactivate; Tên+alias, thứ tự, trạng thái, action; pagination | **KEEP** visual/hierarchy; **ADAPT** toolbar stack và local table scroll; **FIX** touch target; không nhồi thêm cột DB legacy |
| CMS create/edit | `MasterDataFormDrawer`, drawer phải; sticky header/footer | Đúng form React reference: tên, alias application tự sinh/read-only, trạng thái, thứ tự; usage read-only trước delete | **KEEP** nguyên field set và hierarchy của form; **ADAPT** một cột mobile; **DO_NOT_COPY** các field chỉ xuất hiện trong mock type nhưng không được form render (`logo/country/website/is_featured`) |
| CMS delete/usage | `DeleteConfirmModal`, `UsageImpactDrawer` concept | Đếm Product theo `cic_products.manufactory`; deactivate hoặc Trash; restore inactive; audit mutation | **FIX** không xóa local/permanent; modal bounded `dvh`; **DO_NOT_COPY** hard delete dựa local state |
| Public Product list/detail | `ProductsView` filter “Hãng sản xuất”; card/detail hiện tên hãng | Chỉ hãng published; filter/count lấy Brand identity + Product relation | **KEEP** filter accordion/show-more/card/detail; **ADAPT** mobile filter; **DO_NOT_COPY** mock-derived brand hoặc hover-only action |

Không có route list/detail hãng công khai, hero hãng, gallery, CTA hay preview riêng được chứng minh; không tự tạo. Audit responsive chuyển sang MODULE_RESPONSIVE tại 360/390/768/1024/1280/1440.

## UI Reference Map — Danh mục sản phẩm (audit 2026-09-04)

| Surface | Reference/structure | Data & interaction | Responsive disposition |
|---|---|---|---|
| CMS list `/cms/product-settings/categories` | Shell CMS, breadcrumb, header icon cây + tiêu đề/mô tả, CTA “Thêm danh mục sản phẩm”, toolbar, table | Search tên/mã/mô tả; trạng thái; reset; checkbox/bulk ngừng dùng; cột Tên+mã, Thứ tự, Trạng thái, Thao tác; edit/delete; loading/empty/error cần bổ sung bằng dữ liệu thật | **KEEP** hierarchy/card/table visual; **ADAPT** toolbar stack và table overflow/card-row theo convention CMS; không bỏ action/thông tin quan trọng |
| CMS create/edit | Drawer/page header + save/cancel; form tên, mã/alias, mô tả, cha, thứ tự, trạng thái; media/SEO/placement chỉ khi reference/form contract có control thật | Alias validation; parent selector loại self/descendant; save PATCH-owned; usage impact trước status/delete; history từ Audit | **ADAPT** 1 cột mobile, 2 cột khi đủ rộng, sticky actions không che field; modal/drawer giới hạn viewport và cuộn body |
| CMS usage/delete | UsageImpact drawer và confirm modal | Đếm/list Product từ relation; chặn permanent delete khi còn Product/con; deactivate hoặc Trash/restore theo permission; không local delete | **FIX** modal max-height/scroll, action wrap; **DO_NOT_COPY** xóa cứng chỉ dựa vào hover/local state |
| Product public listing | Legacy `ProductsView`: heading/catalog, mobile filter toggle, search + taxonomy filter, active chips, result count/A–Z, 1/2/3-column cards, empty state, pagination, consultation/buy/download modal | Category options/count và product matching phải từ relation; cùng dataset với CMS; card giữ logo/name/price/summary/actions/detail | **KEEP** section hierarchy/grid/chips; **ADAPT** mobile filter drawer and touch actions; **DO_NOT_COPY** CTA chỉ xuất hiện qua `group-hover` vì touch không truy cập được |
| Product detail/embedded references | Breadcrumb/detail và related products; Home/Menu/Footer chỉ khi placement flags đang được consumer dùng | Category label/path/SEO từ published category đúng locale; related resolution không dùng category mock/string | **ADAPT** long breadcrumb/category wrap; không tạo category detail page mới nếu route reference chưa có bằng chứng |
| States/content stress | Long name/alias, nhiều cấp, thiếu media, ít/nhiều relation, inactive, empty, validation/network/permission error | Không che mất nội dung; server error khác validation; optimistic state phải reconcile DB | Audit tiếp ở bước MODULE_RESPONSIVE tại 360/390/768/1024/1280/1440; chưa được coi là regression pass trong audit này |

Không có CMS category detail/preview độc lập, gallery, tab hoặc public category-detail route được chứng minh trong reference hiện tại; không tự tạo. Product listing/detail là consumer của taxonomy, không thuộc quyền redesign của module category.

### Implementation Danh mục sản phẩm — 2026-09-04

- CMS route category dùng dataset PostgreSQL VI/EN thật, table/search/status/pagination/bulk deactivate, form cha–con/thứ tự/trạng thái, relation count và Trash confirmation; action ẩn theo capability và mutation kiểm tra permission server-side.
- Website `/products` dùng trực tiếp presentation `ProductsView` của React reference với dữ liệu PostgreSQL explicit: hero, bộ lọc đa nhóm, active state, A–Z, 15 item/trang, card, detail và modal/form được giữ nguyên; không fetch bằng client effect.
- CMS category giữ table compact/sticky của reference và form drawer trượt phải; bổ sung parent/description theo mapping đã duyệt, focus trap/Escape/scroll lock, `dvh`/body scroll và action stack. Không đưa Media/SEO/placement chưa có ownership vào form.
- Production build, full typecheck và lint pass. DB roundtrip create/update/public/Trash/restore/Audit pass và fixture đã dọn; Audit event giữ append-only theo policy.
- Chưa công nhận visual gate authenticated: local 3001 timeout khi browser automation điều hướng qua các route, chưa hoàn tất đủ viewport. Public locale EN cũng chờ routing/i18n Website dùng chung. Trạng thái category là `[I]`, không phải `[x]`.

> Status module authoritative nằm trong `MODULE_MAP.md`. File này chỉ là inventory UI; không định nghĩa ký hiệu riêng và không chỉ định “next module”.

## Kết luận audit 2026-08-31

- React/Vite legacy là source of truth cho giao diện, layout, text/content hiển thị, icon, interaction, responsive behavior, UX và trạng thái hiển thị.
- Next route/component tồn tại không đồng nghĩa UI parity.
- Tất cả public/CMS surface hiện chỉ được công nhận mức `[A]` theo `MODULE_MAP.md`.
- Không redesign, cleanup hoặc sửa React legacy để làm baseline giống Next hiện tại.

## Public inventory

| Next surface | React reference | Kết luận audit |
|---|---|---|
| `/` | `HomeView`, public shell/widgets | Route có; dùng legacy presentation/content adapter; chưa có full parity gate |
| `/products`, `/products/[slug]` | `ProductsView`, `ProductDetailView` | Published data boundary có; composition/interaction/integration chưa đủ bằng chứng |
| `/services`, `/services/[slug]` | `ServicesView` | Route/query có; parity và relation chưa đóng |
| `/projects`, `/projects/[slug]` | `ProjectsView` | Route/query/action có; CMS/relations/parity chưa đóng |
| `/news`, `/news/[slug]` | `NewsView` và news detail components | Route/query có; rich content/related content/parity chưa đóng |
| `/events`, `/events/[slug]` | `EventsView` | Route/query có; registration/integration/parity chưa đóng |
| `/about` | `AboutView`, partner/map/awards | Route/read boundary có; cross-module và visual parity chưa đóng |
| `/contact` | `ContactView`, consultation flow | Server Action có; workflow/abuse protection/email/audit chưa đủ bằng chứng |
| `/search` | `SearchView`, Header search | Aggregate query có; coverage phụ thuộc các source module |
| `/privacy`, `/terms`, not-found | legal/not-found views | Route có; vẫn phải kiểm chứng text/layout/interaction/responsive |

## CMS inventory

CMS Next shell tái sử dụng `CmsDashboard` và nhiều legacy module dưới một client boundary. Dashboard, global search, users, permissions, settings và function SEO nhận một phần server data; nhiều module khác vẫn lazy-load `demo*DataSource`/`mockData`.

Các nhóm phải regression riêng khi được phép migrate:

- shell: header/sidebar/breadcrumb/footer, theme, locale, command palette, account flows;
- content/catalog: pages, news, events, projects, products, product settings, services;
- website: menu, media, SEO, localization;
- customer interaction: contacts, CTA, forms, requests, email templates;
- governance: users, permissions, activity logs, trash, dashboard/search;
- browser-heavy: CKEditor, Page Builder, visual editing, iframe preview, chart, drag/drop, modal/drawer/table states.

## UI completion gate

Một module chỉ có thể lên `[x]` sau khi kiểm chứng cùng content/asset/icon, layout, breakpoint, keyboard/touch, loading/empty/error/success, hover/focus/selected/disabled, modal/drawer/detail/editor, animation/scroll và workflow bắt buộc so với React reference.

## Audit Vai trò & Quyền — 2026-09-03

- Product scope được duyệt theo UI Next hiện tại: header/tóm tắt, danh sách role, search/filter, nhân sự được gán/gán nhân sự và modal tạo/sửa với ma trận task/action đơn giản.
- Các tab governance phức tạp trong React legacy — assignment riêng, SoD issues, access reviews, user effective-access matrix, task catalogue, role version/scope — là `DO_NOT_COPY`/out of scope, không phải blocker và không được tạo persistence chỉ để giữ mock UI.
- `KEEP`: shell, visual direction, list/table và modal editor hiện tại.
- `ADAPT/FIX` khi implement: table/search/actions không overflow; form matrix stack hợp lý; touch target, focus trap, Escape, scroll lock và narrow-viewport inset đầy đủ.
- Không có Website public, SEO, media/gallery, CTA, preview, Trash hoặc multilingual content surface.
- Implementation dùng dữ liệu live đã nối list/search/filter/create/edit, nhân sự được gán/gán/thu hồi và task-action matrix; các component governance ngoài scope đã loại khỏi module. UI giữ table hierarchy cũ, typography compact, permission search, checkbox 28px, narrow toast, scrollable filters/matrix và bounded modal.
- Permission tasks `menu/menus` đang bị loại khỏi editor cho đến khi Menu hoàn thành: live hiện chỉ có resources `groups/items`, `_task='1'` và actions legacy `add/save/remove/apply/published/unpublished`; target cần map sang `view/create/edit/delete/publish/configure`.
- Không bật xóa role: `cic_trash_items` tồn tại nhưng Trash UI/mutation restore/purge hiện vẫn mock/local-state; cần đóng live Trash contract trước để tránh tạo dữ liệu không thể khôi phục.
- Production build/typecheck/lint pass. Authenticated browser mutation roundtrip chưa xác nhận do mật khẩu bootstrap local không khớp Supabase Auth; module giữ `[C]`.
- Responsive hardening 2026-09-03: tăng nhẹ typography form/permission matrix; input/select giữ 16px trên mobile để tránh Safari zoom; filter và bảng có horizontal-scroll strategy; ma trận có affordance “vuốt ngang”; modal dùng `100dvh`, nội dung và footer cuộn/tách đúng. Static audit bao phủ 360/390/768/1024/1280/1440 nhưng browser visual regression có auth vẫn pending, nên chưa công nhận responsive gate pass.

## Audit Người dùng — 2026-09-03

- Reference route là `/cms/users`; không có Website public/list/detail/SEO/CTA/gallery surface. Người dùng ở đây là tài khoản quản trị CMS (`cic_users`), không phải thành viên Website (`cic_members`) hay Người phụ trách kinh doanh.
- `KEEP`: shell CMS; header “Người dùng CMS”; 6 thẻ thống kê; search; filter trạng thái/vai trò/chi nhánh; bảng tài khoản; phân trang; modal tạo/sửa; status dialog; security drawer; icon, màu trạng thái và hierarchy hiện có.
- List reference gồm Username + email, avatar, họ tên + điện thoại, vai trò, chi nhánh/scope, trạng thái, online, lần truy cập cuối + số lượt, thao tác sửa/xem log/reset mật khẩu/khóa-kích hoạt; có chọn dòng và bulk status.
- Modal reference gồm: (1) Hồ sơ và đăng nhập; (2) Vai trò và phạm vi; (3) Quyền được cấp dạng read-only; (4) Bảo mật và nhật ký chỉ khi sửa. Không có detail route/preview/media picker/SEO/draft-publish.
- `ADAPT`: stats 2/3/6 cột theo viewport; filter stack rồi thành grid; tab cuộn ngang; modal bounded theo `dvh`; role/scope cards 1/2/3 cột; footer action không che form.
- `FIX` ở bước responsive: table cần horizontal-scroll có sticky identity/action hợp lý; drawer/modal phải có inset mobile, focus trap, Escape và scroll lock; action icon/toggle/checkbox phải đạt touch target; status/security rows phải wrap nội dung dài.
- `DO_NOT_COPY`: nhồi đủ 10 cột vào chiều rộng mobile; phụ thuộc hover/title cho action quan trọng; animation pulse/ping khi `prefers-reduced-motion`; coi nút bật 2FA, trạng thái online hoặc security log mock là capability thật khi chưa có provider/producer.
- Next hiện đã nhận PostgreSQL data nhưng vẫn còn client-derived actor/history/timestamp, effective-access suy từ suffix task legacy, role đơn trong khi schema cho nhiều assignment, security/2FA chưa nối auth provider, và Auth↔DB mutation chưa atomic/compensated đầy đủ. Đây là các điểm phải xử lý khi implement, không sửa trong audit.

## Implementation Người dùng — 2026-09-03

- `[C] Core complete`: `/cms/users` đọc PostgreSQL thật; không có Website public surface để tạo thêm.
- Server mutations đã kiểm tra `users.create/edit`, chỉ PATCH field thuộc form, đồng bộ Supabase Auth qua `cic_users.auth_user_id`, giữ email fallback cho hồ sơ legacy và ngăn vô hiệu hóa quản trị viên cuối cùng.
- Create/update/status/reset dùng Audit Writer chung; status history và audit được tạo từ actor server. Password/token và PII hồ sơ không được đưa vào audit payload.
- Migration identity hardening đã áp dụng và verify live: status/normalized uniqueness hợp lệ, 4 bảng bật RLS, browser mutation bị revoke. Dữ liệu hiện có 37 user, 1 user có Auth bridge; không tự tạo Auth account giả cho 36 profile legacy.
- UI giữ list/stats/search/filter/table/modal/status/security surfaces; 2FA hiển thị “Chưa tích hợp”, không còn toggle giả. Mock user không được dùng cho `/cms/users` runtime.
- Quality gate pass: build, foundation + legacy typecheck, lint, foundation boundaries và data-foundation. Gate production toàn CMS vẫn fail do mock của nhiều module khác; authenticated browser/visual roundtrip của Người dùng chưa có bằng chứng nên chưa nâng `[x]`.
- Responsive hardening 2026-09-03: filter/input đạt touch target 44px và 16px trên mobile; table chỉ sticky identity/action từ `lg` để tránh che cột ở 360–768; vùng cuộn ngang có label/focus; toast, status dialog, form modal và security drawer được bound theo viewport, wrap dữ liệu dài và reflow footer/actions; animation online tôn trọng reduced motion. Static breakpoint audit bao phủ 360/390/768/1024/1280/1440, nhưng authenticated screenshot regression chưa chạy nên responsive gate chưa được công nhận hoàn toàn.

## Close Người dùng — 2026-09-03

- Đã bỏ eager query toàn bộ `cic_user_status_history`/`cic_security_events`; editor và security drawer gọi projection theo đúng user, giới hạn 200 event gần nhất và vẫn kiểm tra `users.view` phía server.
- Đã loại coupling runtime kéo `cic_users/mockData` qua Trash lazy loader. `/cms/users` và user activity không còn import demo/mock/fallback.
- Identity/RLS và Audit foundation verify live pass; lint, full typecheck, boundaries, data-foundation và production build pass.
- Không có Website public surface hoặc CMS↔Website roundtrip cho tài khoản quản trị. Role/agency/status/Auth/Audit relation dùng nguồn thật; không thay đổi field ownership.
- `invite`, delete/Trash không thuộc scope đã duyệt. Security/2FA/presence vẫn là integration bên ngoài chưa có producer; `status_online` hiện chỉ là projection legacy, không được coi là realtime.
- Trạng thái `[I] Integration pending`: **PENDING: Người dùng → Auth/session security producer → realtime online, last visit, login/security events và 2FA.** Chưa đủ điều kiện `[x]`.

## Audit Thùng rác — 2026-09-03

- Chỉ có CMS surface tại `/cms/trash` (alias `/cms/recycle-bin`); không có Website public/list/detail/SEO/locale content surface.
- `KEEP`: CMS shell/header, search, module filter, tab tất cả/sắp hết hạn, bảng, chọn hàng/bulk actions, empty state, detail drawer, restore-conflict modal, permanent-delete modal và legal-hold/dependency visual state.
- `ADAPT`: bảng giữ cấu trúc data table nhưng cần chiến lược cuộn ngang và cột nhận diện/action; toolbar/filter phải stack; drawer/modal phải bound theo viewport; text snapshot/dependency dài phải wrap; touch target và keyboard flow cần theo CMS convention.
- `FIX`: plain horizontal scroll khó truy cập trên mobile, modal/drawer có nguy cơ vượt chiều cao, action nhỏ/phụ thuộc title, thiếu focus trap/Escape/scroll lock được chứng minh và raw snapshot không thể render trực tiếp.
- `DO_NOT_COPY`: success toast khi chưa có mutation/audit thật; restore/purge/bulk chỉ xóa local state; hard-code module/entity hoặc conflict mode chưa có adapter; coi legal hold mock là compliance thật.
- Next runtime vẫn truyền `initialTrashedItemsMock` từ `CmsDashboard`; query hiện dùng browser-style client, `select('*')`, limit 200, không permission/workspace scope/pagination/mapper. Live `cic_trash_items` có 0 dòng, RLS tắt và permission catalogue không có task Trash.
- UI chỉ là reference, chưa phải implementation thật. Audit kết luận module bị block bởi typed delete/restore/purge adapter contract cho ít nhất một source module; chưa sửa source trong bước này.

## Implementation Thùng rác — 2026-09-03

- Blocker audit đã đóng cho source đầu tiên: Projects VI có typed snapshot v1 chứa exact project fields + product/service relations; delete, bulk delete, restore draft, slug-conflict auto-rename và purge chạy trong PostgreSQL transaction.
- `/cms/trash` nhận server data thật; list/detail dùng projection riêng, search/module/tab/pagination chạy server-side; detail chỉ render snapshot summary allowlist. `initialTrashedItemsMock`, local-state mutation, hard-coded module catalogue và fake Audit toast không còn trong Next runtime.
- Permission `trash.view/restore/purge` đã phát hành; server actions luôn recheck permission. Live `cic_trash_items` bật RLS, revoke browser access, có 4 operational indexes và 3 validated constraints.
- UI giữ data-table/drawer/conflict/purge visual direction; dùng shared sticky-scroll data-grid, sticky header/identity/action, touch-sized controls, bounded `dvh`, focus trap, Escape, scroll lock, server loading/error/empty/partial-result states.
- Live verification pass: Dự án tạm published → Trash → public/source không còn row → restore cùng ID/relations với `published=false` → Trash lần hai → purge scrub payload → Audit; dữ liệu test được dọn sạch và table trở lại 0 row.
- Re-audit implementation gate: năm blocker nền tảng ban đầu đã đóng; kết luận hiện tại là `READY_TO_IMPLEMENT` cho core đã triển khai và kiểm chứng.
- `[I] Integration pending`: **Trash → các module ngoài Projects VI → typed entity adapter**; media file cleanup/reference count và retention worker vẫn cần khi source tương ứng được nối. Authenticated screenshot regression chưa có bằng chứng nên chưa nâng `[x]`.

### Responsive audit continuation — 2026-09-04

- Surface xác nhận: Thùng rác là CMS-only; Website không có listing/detail/card/hero/filter/modal riêng. Public chỉ dùng cùng source rule để loại entity đã trash.
- Static audit phủ header, filter/search, tabs, bulk bar, table, pagination, loading/empty/error toast, detail drawer, restore-conflict và permanent-delete modal; Impeccable detector trả `[]`.
- Hardening hiện có giữ table structure nhưng stack toolbar/filter, cung cấp horizontal scroll + floating rail, chỉ sticky identity/action từ `lg`, dùng control 44px trên màn hẹp, wrap content dài và bound drawer/modal bằng `dvh`; không render hai desktop/mobile tree.
- Browser run đã thử các viewport 360/390/768/1024/1280/1440 nhưng credential local không tạo được authenticated CMS principal và bị chuyển khỏi module. Không dùng trang unauthorized làm visual evidence, không tự relink/rotate tài khoản.
- Kết luận responsive vẫn **chưa pass visual gate** cho tới khi có authenticated browser evidence; không còn static P0/P1 đã biết và không nâng module khỏi `[I]`.

## Audit Thư viện Media — 2026-09-04

- Scope là CMS cross-module tại `/cms/media` (alias `/cms/media-library`, `/cms/albums`) và modal picker nhúng trong form nội dung. Không có Website Media Library listing/detail riêng; Website chỉ consume asset qua module sở hữu nội dung.
- `KEEP` reference: page header + tổng số tệp + upload/album actions; tabs Tất cả/Ảnh/Video/PDF/Album/Cần meta/Vấn đề; folder sidebar; search + saved filters; grid/list; selection/bulk trash; pagination; empty state; quick preview; upload queue; metadata/detail drawer; replace modal; album grid/editor; embedded multi-select picker.
- Grid giữ thumbnail `4:3`, status/usage/meta badges, title/file metadata và preview/edit/trash actions. List giữ các cột selection, asset/title/filename, loại-kích thước, dung lượng, trạng thái metadata/workflow, folder, nơi dùng, cập nhật và actions; table hiện cần min-width 900px.
- Detail drawer giữ preview + technical metadata và bốn tab: Metadata/Alt, crop-variants, used-by, versions. CMS editable có title, description, alt, credit/license và album title/alias/status/description/order/cover; caption, tags, license expiry/folder assignment có trong contract/spec nhưng UI form hiện chưa đầy đủ. Technical dimensions/MIME/size/path/timestamps/owner/status là operational/system data.
- States/interaction reference: hover/focus/selected, processing/restricted/archived, complete/incomplete/issues, unused/missing-alt, image/video/document preview, empty used-by/version, upload queued→processing→completed/error, replace note, delete-to-Trash, reorder/remove album item. Các mutation hiện chỉ đổi client state và toast nên không phải behavior production.
- Responsive: `KEEP` grid 2→3→4/6 cột, album 1→2→3→4, main layout stack rồi 3/9 tại `lg`, toolbar stack rồi row. `ADAPT` tabs/filter pills thành vùng cuộn có affordance, folder thành compact/collapsible control trên mobile và detail forms/footer stack. `FIX` list horizontal-scroll accessibility, 28–32px icon actions/touch targets, toast/upload drawer inset, tabs/variant/used-by/version rows wrap, modal/drawer `dvh` + focus trap/Escape/scroll lock. `DO_NOT_COPY` fixed right upload drawer `w-full max-w-lg` gây tràn ở 360px, hover/title-only actions, `prompt()` tạo folder, autoplay video, empty `img alt`, hard-coded Japanese-alt warning và desktop-like dense table trên mobile.
- Impeccable static detector trên 8 Media components trả `[]`; đây không thay thế browser regression. Audit chưa sửa UI và chưa công nhận responsive gate.
- Next classification: `KEEP` component hierarchy/visual direction and typed data-source boundary; `REFACTOR` types thành DB/domain/view projections + server pagination/filters and accessible responsive overlays; `REPLACE` demo datasource/local mutations, `select('*')`, raw storage URL assumptions and client-derived issue/usage/version truth; `REMOVE` runtime mock import, fake success/toast, `prompt()`, hard-coded actor/variant rows/Japanese text and unsupported fake rollback.

### Media foundation readiness — 2026-09-04

- Đã đóng blocker trước implementation bằng migration idempotent `20260904_media_foundation_hardening.sql`: permission `media.view/create/edit/delete/replace`; RLS và authenticated read policy trên đủ 8 bảng; browser không có quyền mutation trực tiếp trên bảng; 8 index phục vụ list/filter/relation/version.
- Đã tạo private Supabase Storage bucket `cms-media`, giới hạn 100 MiB và allowlist ảnh/video/PDF/Office; object policies tách read/create/replace/delete theo Media permission và path bắt đầu bằng `vi`, `en` hoặc `global`. Public asset về sau phải qua server Media resolver, không dùng public bucket URL.
- Audit Registry đã có `media.created/updated/replaced/trashed` với entity `media_asset`. Trash có snapshot contract v1 chứa asset identity, storage paths, translations và folder/album relations; chưa register adapter cho tới khi restore/purge + object cleanup chạy thật.
- Live verification pass: permission task=true, RLS tables=8, read policies=8, operational indexes=8, private bucket=true, storage policies=4.
- Media chuyển `[I] Integration pending`: `/cms/media` dùng dữ liệu thật theo route; upload, metadata PATCH, folder, album, replace/version, bulk trash, live picker VI/EN, explicit projections, signed private URL, Audit và typed Trash restore đã nối. Live roundtrip create → update → public resolver → trash hidden → restore restricted pass; typecheck/lint/build và foundation/security checks pass. Chưa nâng `[x]` vì business module vẫn cần chuyển raw legacy path sang Media ID, purge object cần durable cleanup worker/outbox, variant generation cần processor, và chưa có authenticated browser screenshot regression trên đủ viewport.

### Media responsive hardening — 2026-09-04

- Authenticated browser regression chạy trên instance riêng `127.0.0.1:3001` tại 360, 390, 768, 1024, 1280 và 1440. Đã kiểm tra empty state và fixture DB/Storage thật có title dài, Unicode/emoji, chuỗi không ngắt và ảnh 16:9; fixture được xóa sau kiểm tra.
- Grid/list, folder/search/filter, Album/editor, asset detail, preview, replace, upload queue, picker nhúng và pagination không tạo document-level horizontal overflow. Table nhiều cột giữ scroll cục bộ với cột selection/action sticky; tab/filter dùng cùng semantic tree và scroll ngang trên viewport hẹp.
- Đã bỏ phụ thuộc hover cho action card trên touch; chuẩn hóa vùng chạm Media tối thiểu 44px; input mobile dùng cỡ chữ tránh iOS auto-zoom; drawer/modal dùng `dvh`, safe-area footer, focus trap/Escape và label cho icon button. Album có empty state và reorder bằng nút lên/xuống thay cho chỉ dẫn kéo-thả không hoạt động.
- Impeccable detector trên 8 Media surfaces trả `[]`; typecheck, lint và production build pass sau hardening. Responsive gate Media: PASS, không còn P0/P1 quan sát được. Trạng thái toàn module vẫn `[I]` do các integration data/worker đã nêu ở trên, không phải do responsive.

## Audit Người phụ trách kinh doanh — 2026-09-09

- CMS route reference `/cms/product-settings/sales-staff` (alias `/cms/sales-staff`); public chỉ có contact sidebar nhúng trong Product detail, không có route/list/detail riêng cho đầu mối.
- List giữ header `FolderTree`, CTA “Thêm người phụ trách”, search theo tên, status + Product searchable filter, bulk deactivate, bảng sticky có tên, thứ tự, SĐT/Skype/Zalo, trạng thái, ngày tạo/ID, edit/delete, empty state và phân trang 10/20/50/100.
- Form mở dạng page, sticky action header và body tối đa `6xl`: tên nhân viên, tên hiệu tự sinh/read-only ở hàng đầu, kích hoạt, thứ tự, SĐT, Skype, Zalo, Alias có nút tạo tự động, rồi năm searchable multi-select Product. React đang hiển thị alias hai lần; giữ một authority field nhưng phải bám đúng vị trí/behavior reference, không invent field khác.
- Dialog lifecycle giữ phương án ngừng sử dụng; permanent delete bị khóa khi còn assignment. `UsageImpactDrawer` có danh sách phụ thuộc và CTA “Bàn giao phụ trách”, nhưng không được mount từ manager hiện tại: chỉ là reference capability; handover chỉ implement khi có mutation atomically chuyển đủ năm bucket.
- Public Product detail giữ card “Hỗ trợ trực tuyến”, bốn nhóm Đại diện kinh doanh/Hỗ trợ kỹ thuật/Kinh doanh Miền Bắc/Miền Nam, Phone icon, link `tel:`, hierarchy/spacing/card styling; dữ liệu hard-code hiện tại phải được thay bằng staff published được resolve theo Product. Zalo/Skype không tự thêm vào public card vì reference chỉ render tên + phone.
- `KEEP`: CMS shell, route/menu, header/table/form/contact-card visual hierarchy, icons/colors, search/filter/pagination interactions. `REFACTOR`: tách domain/server projection khỏi generic client manager; tách client islands cho filter/form/dialog. `REPLACE`: demo source, local mutations, mock usage, hard-coded public contacts. `REMOVE`: fake success, mock Product IDs và các dead/unmounted column/usage controls khỏi production runtime.
- Responsive: `KEEP` page stacking và desktop two-column Product detail; `ADAPT` toolbar/filter stack, assignment selectors và action header wrap; `FIX` table local horizontal scroll/sticky overlap, 28–32px touch targets, full-page form height/scroll, dialog focus trap/Escape/scroll lock, long names/phones and `dvh`; `DO_NOT_COPY` desktop-dense table on mobile, hover/title-only actions, unbounded overlay and motion without reduced-motion handling.
- Loading/error/no-permission server states chưa có trong generic route; create/edit local state không phải production behavior. Audit không sửa UI/source và chưa công nhận responsive/browser gate.
- Implementation 2026-09-09 giữ hierarchy CMS reference và thay data/mutation mock bằng PostgreSQL thật. Toolbar tự stack, bảng scroll cục bộ, form toàn trang dùng `dvh`, action wrap, selector Product có vùng cuộn/touch target, dialog có focus trap/Escape và long text wrap. Public Product detail giữ đúng bốn nhóm contact của reference nhưng resolve staff published từ DB; trạng thái rỗng không fallback dữ liệu mẫu. Static detector chỉ báo advisory từ token/pattern visual kế thừa, không có lỗi blocking; browser automation không hoàn tất do Chromium local treo khi khởi chạy nên không dùng kết quả đó để tuyên bố screenshot pixel-parity.

## Audit Sản phẩm — 2026-09-09

- CMS reference: list header/tabs, năm chiều search/filter, density/column controls, bulk actions, table + pagination, preview/activity/duplicate/delete; form page có sticky action, content hai cột, taxonomy/related, rich text overview/features/video, file catalogue/driver + 6 download slots, Media, display và SEO.
- Public list reference: hero, mobile filter toggle, sticky accordion filter theo lĩnh vực/hãng/ứng dụng/loại, active chips, sort, grid card, empty state, pagination và modal contact/buy/download. Detail giữ gallery, badges/name/price/tags/CTA, bốn tab, contact sidebar và related Products.
- Responsive classification: `KEEP` hierarchy và desktop grids; `ADAPT` CMS toolbar/form/table và public sidebar/card grid; `FIX` sticky overlap, local table overflow, hover-only actions, modal viewport/focus, long content, touch targets và pagination; `DO_NOT_COPY` simulated submit/download và overlay không giới hạn.
- Next hiện tại chỉ đạt partial parity: public presentation gần reference nhưng DB projection thiếu gallery/files/SEO và còn fallback/static/simulated interactions; CMS dùng demo/local mutations. Chưa có loading/error/no-permission/roundtrip/browser gate cho Product. Audit không sửa source và không công nhận implementation complete.
- Implementation 2026-09-09 giữ nguyên composition CMS/public reference, nhưng chuyển CMS route và mutation sang PostgreSQL VI/EN thật; full-page form vẫn nằm trong content shell nên không che header/sidebar/footer. Public bỏ runtime fallback, gallery/download/related dùng projection DB. Ảnh cũ giữ contract `/images/**`, ảnh upload mới đi qua Media foundation; video iframe HTML legacy được chuẩn hóa thành URL embed và preview đọc dữ liệu form hiện tại. Toolbar/table/form tiếp tục kế thừa responsive ADAPT của reference. Contact/buy/download đã persistence qua contact foundation; email delivery/download artifact còn là integration pending. Chưa có authenticated browser screenshot gate.
- Legacy asset ADAPT: `/images/**` phục vụ trực tiếp cây file legacy được bàn giao; Product mapper đổi URL CIC `/images/**` về local. Video tab tách `src` từ iframe HTML legacy thay vì dùng cả HTML làm URL. Preview form dùng đúng field DB/form và resolve category/application/brand/type, ảnh, gallery, feature HTML, video và download slots.
- Product presentation correction 2026-09-09: thumbnail ở CMS list, public card và related card lấy từ `cic_products.icon`; ảnh lớn/detail tiếp tục lấy `image`/gallery. Public detail bỏ badge category/hãng màu đen phía trên và `Thông tin phân loại` chỉ render giá trị từ `cic_products.tags`, không suy từ category, brand hoặc application. Public shell đã tự chừa chiều cao fixed header nên Products list/detail chỉ giữ khoảng cách section 2rem, không cộng lại header offset.
