# Target Architecture

## 1. Phạm vi và nguyên tắc

Tài liệu này định nghĩa kiến trúc đích cho một project **Next.js App Router fullstack** duy nhất, deploy trên Vercel và dùng PostgreSQL/Supabase. Đây là thiết kế cho migration; chưa tạo Next.js, chưa chuyển module, chưa tạo API/schema và không thay UI.

Các quyết định hiện có trong `docs/system-audit/` và `docs/system-audit/database/` tiếp tục có hiệu lực:

- UI React hiện tại là source of truth.
- PostgreSQL draft 104 bảng là baseline; migration ban đầu additive, không rename/drop/merge phá vỡ.
- UI nhận ViewModel có nghĩa nghiệp vụ, không nhận raw database row.
- Server-side data access là mặc định; không dựng REST API cho mọi feature.
- Mock chỉ được gỡ theo từng module sau khi đạt parity và rollback gate.

## 2. Cấu trúc project đích

```text
app/
  (public)/
    layout.tsx
    page.tsx
    products/page.tsx
    products/[slug]/page.tsx
    services/page.tsx
    services/[slug]/page.tsx
    projects/page.tsx
    projects/[slug]/page.tsx
    news/page.tsx
    news/[slug]/page.tsx
    events/page.tsx
    events/[slug]/page.tsx
    about/page.tsx
    contact/page.tsx
    search/page.tsx
    privacy/page.tsx
    terms/page.tsx
    loading.tsx
    error.tsx
    not-found.tsx
  cms/
    layout.tsx
    page.tsx
    dashboard/page.tsx
    search/page.tsx
    users/...
    permissions/...
    settings/...
    function-seo/...
    activity-logs/...
    trash/...
    static-pages/...
    news/...
    events/...
    projects/...
    email-templates/...
    product-settings/...
    products/...
    services/...
    frontend-menus/...
    media/...
    contact-requests/...
    translation-strings/...
    cta/...
    forms/...
    customer-requests/...
    loading.tsx
    error.tsx
    not-found.tsx
  api/
    webhooks/[provider]/route.ts
    uploads/route.ts                 # chỉ khi upload cần HTTP stream/boundary
    submissions/route.ts             # chỉ khi public/external client cần HTTP
    integrations/[name]/route.ts
  layout.tsx
  globals.css

features/
  news/
    public/                           # public Server UI + client islands riêng
    cms/                              # CMS UI của domain
    server/                           # query, mutation service, repository khi cần
      queries.ts
      actions.ts
      service.ts                      # chỉ khi có rule/transaction
      repository.ts                   # chỉ khi có compatibility/multiple sources
      mapper.ts
    schemas/                          # input schemas
    types/                            # domain DTO/ViewModel
    constants.ts
  products/
  product-settings/
  services/
  projects/
  events/
  static-pages/
  menus/
  media/
  contacts/
  customer-requests/
  cta/
  forms/
  email-templates/
  users/
  permissions/
  system-settings/
  function-seo/
  localization/
  activity-logs/
  trash/
  dashboard/
  search/

shared/
  ui/                                 # primitive UI thật sự generic, giữ visual contract
  components/                         # composition xuyên domain: Header/Footer/CMS shell
  hooks/                              # browser/UI hooks generic, không chứa business data
  utils/                              # pure generic helpers
  types/                              # technical cross-cutting types tối thiểu
  config/                             # typed app/env/public configuration
  tokens/                             # design tokens hiện tại
  visual-editing/                     # contract/runtime dùng bởi public + page builder

server/
  auth/                               # session, requireUser/Permission, CMS guards
  db/                                 # server-only client, generated DB types, transactions
  supabase/                           # server client/admin client factories
  cache/                              # tag names và invalidation helpers
  errors/                             # shared server error taxonomy/normalization
  audit/                              # append-only audit writer/redaction
  security/                           # origin/rate-limit/upload/rich-text policies

supabase/
  migrations/                         # versioned, forward migration SQL
  seed/                               # approved deterministic seed manifests only
  tests/                              # schema/RLS/data migration checks
  config.toml

public/                               # immutable/static assets giữ nguyên URL khi cần
types/                                # framework/global declaration only
```

Tên thư mục cụ thể có thể được điều chỉnh nhẹ ở Prompt 2 nếu Next.js version/tooling yêu cầu, nhưng dependency direction và domain ownership trong tài liệu này là bắt buộc.

### Route groups và layouts

- `(public)` không tạo segment URL; layout giữ Header, Footer và public global widgets như React hiện tại.
- `cms/layout.tsx` là protected shell, giữ CmsHeader/CmsSidebar/Breadcrumb/Footer, theme và responsive behavior.
- Canonical CMS route giữ nguyên theo `CURRENT_STRUCTURE.md`. Alias cũ dùng redirect rõ ràng, không nhân đôi page implementation.
- Public routes mới là deep-link thật. Khi migrate từng view phải giữ hành vi list/detail hiện tại nhưng chuyển navigation sang URL mà không đổi presentation.
- `app` chỉ compose route/layout, metadata, loading/error boundary; không chứa business query phức tạp.

## 3. Feature/domain ownership

Một domain sở hữu public UI, CMS UI, server behavior, schema validation và ViewModel của chính nó. Ví dụ `features/news` phục vụ public list/detail, CMS list/form/category, publish service, mapper và query.

Không ép mọi feature có đủ mọi folder. Read đơn giản có thể chỉ cần `server/queries.ts` + `mapper.ts`; repository/service chỉ xuất hiện khi có rule thật.

Cross-cutting domains vẫn độc lập:

- `activity-logs` và `trash` đang chung folder React nhưng là hai feature/routing/business responsibility khác nhau.
- `product-settings` là domain taxonomy/master-data liên quan Products nhưng có mutation và permission riêng.
- `search` là read-model/composition feature; không sở hữu data nguồn của feature khác.
- `dashboard` là read-model tổng hợp; không trở thành repository chung.
- `static-pages` sở hữu page/revision/section config; `shared/visual-editing` chỉ giữ runtime contract generic đã thật sự dùng chung.

## 4. Server Component và Client Component

### Mặc định Server Component

- Route page/layout, public list/detail, Header/Footer/menu/breadcrumb, SEO metadata.
- Published Page Builder renderer và static content sections khi không có browser interaction.
- CMS initial read/summary có thể server-render nếu dữ liệu serializable và không phụ thuộc browser.
- Server Component gọi typed server query/use-case, không truy cập Supabase client trực tiếp trong JSX.

### Client Component chỉ cho interactive island

Thêm `"use client"` tại boundary nhỏ nhất cần:

- modal, drawer, dropdown, tabs, carousel, command palette;
- search/filter/pagination tức thời không đi qua URL;
- CMS form state, selection/bulk action, table setting;
- CKEditor, Recharts, media/entity picker, drag/drop, page-builder visual canvas;
- canvas, ResizeObserver, Web Storage, clipboard, History/DOM APIs và animation `motion`;
- form cần optimistic/pending UX hoặc browser validation.

Server page lấy dữ liệu và truyền serializable ViewModel xuống island. Không truyền Supabase client, class instance, Error object, function server tùy ý hoặc raw row qua RSC boundary.

Browser-only package dùng client wrapper/dynamic import khi package không SSR-safe. Không biến toàn page/layout thành client component chỉ để chứa một widget.

### Form interactive

- Input state/visual validation có thể ở client island.
- Mutation nội bộ CMS ưu tiên Server Action colocated trong feature server boundary.
- Server Action luôn authenticate, authorize, parse/validate lại, execute service/transaction, audit và revalidate.
- Client validation chỉ cải thiện UX; không phải security boundary.

## 5. Data flow

### Read đơn giản

```text
Server Page/Component
  → feature server query
  → PostgreSQL/Supabase server client
  → mapper
  → serializable ViewModel
  → public/CMS UI
```

### Nghiệp vụ có rule/transaction

```text
Server Action / Route Handler / server query
  → authenticate + authorize + validate
  → feature service/use-case
  → repository/query functions
  → PostgreSQL transaction / Storage / integration
  → mapper/result
  → audit + cache invalidation
```

Quy tắc:

- Component không query DB trực tiếp và không import `server/db`/`server/supabase`.
- Query function chịu SQL/select/join/pagination/workspace visibility và tránh N+1.
- Mapper đổi snake_case/legacy fields sang ViewModel camelCase, resolve fallback/snapshot và loại field nhạy cảm.
- Service/use-case chỉ dùng khi cần permission scope, transaction, publish, restore, media lifecycle, routing hoặc compatibility rule.
- Repository interface chỉ dùng khi cần đổi implementation, nhiều nguồn, compatibility legacy/new schema hoặc test boundary đáng giá. Không tạo interface cho một query CRUD đơn giản.
- DTO riêng chỉ tạo khi read/write shape khác raw row hoặc cần bảo vệ boundary. Không nhân bản type giống hệt nhau vô ích.
- Cross-domain relation đi qua public server contract/query được feature sở hữu công bố; không import repository private của feature khác.

## 6. Backend strategy

| Cơ chế | Dùng khi | Không dùng khi |
|---|---|---|
| Server Component | đọc/render dữ liệu nội bộ, metadata, public/CMS initial view | mutation hoặc browser event/API |
| Server Action | CMS/internal form mutation, publish, assignment, setting update | external client/webhook, stream/file protocol đặc biệt |
| Route Handler | webhook, upload/download, chatbot/integration, public/external submission/API | tạo REST wrapper cho query nội bộ chỉ để “đúng layer” |
| Server function/query | read nội bộ hoặc helper server-only | export sang client bundle |
| Service/repository | transaction, security/rule/compatibility phức tạp | CRUD/read đơn giản không có abstraction value |

Mọi Server Action và Route Handler được xem như public security boundary: không tin client payload, session hay hidden field.

## 7. Supabase/PostgreSQL

### Client và credentials

- `server/supabase/server.ts`: request-aware server client dùng publishable/anon key + user session khi cần RLS.
- `server/supabase/admin.ts`: service-role/admin client, có `server-only`, chỉ dùng cho use-case được allowlist; không export qua feature client code.
- Browser Supabase client chỉ tạo khi có nhu cầu thực như Auth realtime/client session hoặc direct Storage flow đã được duyệt. Public/CMS UI không query business tables trực tiếp mặc định.
- Chỉ biến public-safe mới có prefix `NEXT_PUBLIC_`. Service-role key, DB URL, webhook secret, SMTP/API keys tuyệt đối không có prefix này và không được serialize/log.

### DB access và connection

- Business access ở server-only query/repository. RLS/privilege là defense-in-depth, không thay application authorization.
- Với Vercel/serverless, dùng Supabase-supported pooled connection cho workload phù hợp; direct connection dành migration/administration theo môi trường. Không tạo unbounded connection per request.
- Nếu dùng Supabase JS làm data client, generated database types nằm trong `server/db/database.types.ts`; không để generated raw types trở thành UI contract.
- Query phải chọn cột cần thiết, paginate list, batch relation, index FK/filter/sort thực tế và kiểm tra query plan khi có volume.

### Schema/migration

- Baseline và schema decisions trong `docs/system-audit/database` là authoritative; mock/UI không tự cấp phép thêm field.
- Mọi thay đổi DB là migration versioned trong `supabase/migrations`, review được, forward-safe và có rollback/compatibility plan.
- Không chỉnh schema production bằng dashboard rồi bỏ qua migration source.
- Migration legacy → PostgreSQL rehearsal, orphan/FK checks và validation plan phải pass trước backend rollout.
- Seed chỉ chứa system data/manifest đã duyệt; không suy diễn production content/role từ fixture.
- RLS policy/GRANT được test theo anonymous/authenticated/CMS role. FK columns và policy predicates cần index phù hợp.

## 8. Auth và CMS permission

- `/cms` được bảo vệ ở server bằng session check tại layout/request boundary; unauthenticated redirect về login route được chốt khi foundation triển khai.
- Authentication dự kiến dùng Supabase Auth/session cookie tương thích SSR, nhưng mapping identity → `cic_users` và legacy password migration phải theo schema/security approval; tài liệu này không tự chọn chiến lược chuyển password.
- `requireUser()` xác thực; `requirePermission(task, action, scope)` tính effective permission từ role + direct legacy permission trong giai đoạn chuyển tiếp.
- UI có thể ẩn/disable action để cải thiện UX, nhưng Server Action/query vẫn kiểm tra quyền, workspace/scope và entity ownership.
- Public query chỉ trả Published/current revision và loại Trash/private field. Draft preview cần authenticated permission và query riêng, không tái dùng public cached query.
- Permission update, impersonation/security action, secret access, publish, delete/restore/purge đều audit phía server.
- RLS/DB privileges giới hạn blast radius; service-role bypass chỉ nằm trong allowlisted server use-case.

## 9. Validation và error handling

### Validation

- Mỗi feature sở hữu schema input tại `features/<domain>/schemas` (dự kiến dùng một schema library duy nhất khi foundation chốt dependency).
- Validate tại Server Action/Route Handler trước service; validate relation ID, locale/workspace, enum/status, HTML/media policy và optimistic concurrency/version khi cần.
- DB constraints bảo vệ invariant dữ liệu; không thay server validation và user-facing errors.

### Error taxonomy

Server dùng tập lỗi thống nhất: `ValidationError`, `UnauthenticatedError`, `ForbiddenError`, `NotFoundError`, `ConflictError`, `RateLimitError`, `ExternalServiceError`, `UnexpectedError`.

- Expected errors được map thành typed action result/HTTP status và message an toàn.
- Database/provider error được normalize, log correlation ID; không trả SQL, stack, secret hoặc raw provider response cho client.
- `notFound()` dùng cho entity public/CMS không tồn tại hoặc không visible.
- `error.tsx` xử lý unexpected route error; loading/empty/error state giữ đúng visual language đã audit.
- Audit/log không chứa password, token, OTP, secret, raw PII payload hoặc unredacted request headers.

## 10. Caching và revalidation

### Public

- Public Published data có thể cache theo feature/entity tags: `news`, `news:<id>`, `products`, `menu:<locale>`, `settings:<locale>`, v.v.
- Query độc lập được khởi chạy song song khi có thể; dùng Suspense/loading boundary cho phần tốn thời gian thay vì waterfall.
- Publish/unpublish/update/delete/menu/settings/SEO action invalidates đúng tag/path sau transaction thành công.
- Search hoặc dữ liệu thay đổi nhanh có TTL/request strategy riêng; không mặc định cache vô hạn.

### CMS/nhạy cảm

- Draft, preview, user, permission, contacts/customer requests, audit, trash, secrets/config nhạy cảm là request-scoped hoặc uncached.
- Không chia sẻ cached result giữa user/workspace nếu cache key không encode scope an toàn.
- Preview không đọc public cache; publish invalidation chỉ xảy ra sau commit.
- Chưa thêm Redis. Chỉ đánh giá khi metrics chứng minh Next.js/Supabase cache không đủ.

## 11. Shared code boundaries

| Boundary | Được chứa | Không được chứa |
|---|---|---|
| `shared/ui` | button, tabs, pagination, selection primitive đã có reuse thực | product/news-specific card hoặc business rule |
| `shared/components` | Header/Footer/CMS shell/legal layout/preview chrome thực sự xuyên route/domain | wrapper chỉ dùng một feature |
| `shared/hooks` | generic keyboard, media query, outside-click, storage preference | fetch business data hoặc permission decision |
| `shared/utils` | pure formatting/sanitized generic helpers | query, mutation, feature mapping |
| `shared/types` | technical primitives/cross-cutting contract ổn định | “god types” union của mọi domain |
| `features/<domain>` | domain UI, schema, ViewModel, query/service/repository | import server private của domain khác |
| `server/*` | infrastructure cross-cutting server-only | UI hoặc presentation-specific types |

Chỉ đưa vào shared khi responsibility thực sự dùng chung và có contract ổn định. Hai đoạn code giống nhau chưa đủ lý do tạo abstraction.

## 12. Dependency direction

```text
app
 ├─→ features/*/public|cms
 ├─→ shared/components|ui
 └─→ server/auth (route guard only)

features/<domain>/public|cms
 ├─→ feature types/schemas/public contracts
 └─→ shared/*

features/<domain>/server
 ├─→ feature types/schemas
 ├─→ server/db|auth|cache|audit
 └─→ approved public server contract of another feature

shared/* ─X→ features/*
client code ─X→ server/* or features/*/server
```

- Dùng aliases `@/app`, `@/features`, `@/shared`, `@/server` hoặc `@/*`; tránh relative import sâu xuyên domain.
- Server modules thêm `server-only` ở entry point nhạy cảm.
- Không dùng barrel lớn khiến client kéo server/heavy package hoặc làm mờ dependency.
- Cross-domain mutation được orchestrate bởi use-case sở hữu workflow hoặc explicit application service; không gọi repository feature khác tùy tiện.
- Cross-domain read dùng projection/contract nhỏ, batch được; không expose raw table/query builder.

## 13. Mapping toàn bộ module hiện tại

Tất cả module trong `MODULE_MAP.md` có chỗ trong kiến trúc đích. Các điểm cần xử lý cẩn thận, không được bỏ qua:

| Hiện trạng | Vấn đề | Vị trí đích |
|---|---|---|
| Public view đều ở `/` và điều phối bằng state | chưa có deep-link/metadata độc lập | `(public)` routes + giữ interactive island/visual parity |
| Dashboard/global search tổng hợp nhiều mock | dễ thành god repository | feature read-model chỉ gọi public query contracts |
| Activity Logs và Trash cùng folder | khác lifecycle/quyền/transaction | hai feature độc lập, dùng chung audit/security infra có chọn lọc |
| Product Settings nằm sát Products | taxonomy/master-data có quyền và impact riêng | feature riêng; Products dùng contract công bố |
| Static Pages/Page Builder + visual editing | direct DOM/CKEditor/browser-only, publish transaction phức tạp | server page/revision service + client editor islands + shared visual contract |
| Contacts và Customer Requests | nguồn vật lý khác nhưng UI quan hệ | không merge table ban đầu; Customer Request unified read service |
| Menu/Header/Footer | public và CMS cùng domain nhưng UI khác | `features/menus` data/server; public/CMS presentation riêng |
| CMS route aliases/nested view | router React tự viết | canonical App Router + redirects/nested segments |
| Browser-only canvas/map/chart/editor | không SSR-safe | client islands/dynamic import; server parent giữ data/markup boundary |
| Mock duplicate public/CMS | ID/field không chắc canonical | mapper/compatibility per module; không bulk delete fixture |

## 14. Rollout/gates

1. Prompt 2 chỉ dựng foundation, aliases, layouts và infrastructure tối thiểu; không tự migrate domain.
2. Mỗi module: đọc audit → mapping → schema decision → contract → implementation hiện tại.
3. Thay data function mock bằng server implementation sau khi DB gate pass.
4. Kiểm tra public/CMS data parity, permission, relations, media, SEO, rich text, locale/workspace.
5. Chạy typecheck/lint/build, functional test và responsive visual regression.
6. Gỡ mock riêng module khi parity + rollback đều đạt; không xóa mock toàn cục.

## 15. Out of scope của Prompt 1

- Không khởi tạo Next.js/package/dependency.
- Không tạo Supabase project/client/schema/migration/API.
- Không implement auth/RBAC/caching.
- Không chuyển route/component/module.
- Không refactor/redesign UI.

