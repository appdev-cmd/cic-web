# Current Structure

## Tổng quan

Repository hiện chứa hai implementation cùng tồn tại:

```text
React/Vite legacy reference       Next.js current implementation
  index.html                        src/app/**
  src/main.tsx                      src/features/**
  src/App.tsx                       src/server/**
  src/web/**                        src/shared/**
  src/cms/**
  src/index.css

Persistence/docs
  db_migrate/database.html và schema/report
  docs/database/POSTGRES_SCHEMA_DELTA.md
  docs/system-audit/database/** và compatibility plans
```

`package.json` dùng Next.js làm `dev/build/start` mặc định và giữ `dev:legacy`, `build:legacy`, `preview:legacy` cho React/Vite reference.

## React/Vite legacy reference

`src/App.tsx` điều phối public view bằng local state. Header/Footer đổi view qua callback; list/detail và nhiều subflow không có deep-link riêng. UI public nằm trong `src/web/components/**`, fixture trong `src/web/data/**` và typed adapter trong `src/web/features/**`.

`src/cms/components/CmsDashboard.tsx` là client shell lớn, lazy-load module theo `src/cms/routing.ts`. UI module nằm dưới `src/cms/modules/**`; data-source interface ở `src/cms/data/**` nhưng phần lớn implementation vẫn là `demo*DataSource` lấy dữ liệu từ fixture/module mock.

Nhóm code đặc biệt:

- `activity_logs_trash`: hai module độc lập là Activity Logs và Trash;
- `customer_interaction`: ba module độc lập là CTA, Forms và Customer Requests;
- static pages/page builder: CKEditor, visual canvas, inline editing, iframe/DOM integration;
- shell/search/navigation: History API và client state tự quản.

Legacy là authority presentation nhưng không phải kiến trúc, persistence hay backend contract.

## Next.js hiện tại

### App Router

- `src/app/(public)/**`: home, products, services, projects, news, events, about, contact, search, privacy, terms.
- `src/app/cms/**`: login, auth-protected shell, catch-all và error/loading boundaries.
- `src/app/api/**`: health check và CMS projects endpoint.
- Root: layout, loading, error và not-found.

Các public routes không đồng đều: có route dùng PostgreSQL query, route tái sử dụng legacy view/client wrapper và route chỉ render composition mỏng. Route tồn tại không đồng nghĩa UI/data/integration parity.

### Feature/server boundaries

`src/features/**` có server query/action/repository/schema ở các mức khác nhau cho users, permissions, system settings, function SEO, projects, products, news, events, services, static pages, menu, media, contacts/forms/customer requests, CTA, email templates, localization, activity logs, trash, dashboard và search.

`src/server/**` cung cấp environment validation, Supabase server/admin client, PostgreSQL client/transaction helper, auth guard, pagination, error và logging foundation.

Foundation chuẩn hóa thêm:

- `src/server/auth/page-guards.ts`: chuyển lỗi unauthenticated/forbidden của CMS page thành route state rõ, không đổi semantics action/handler;
- `src/shared/ui/application/**`: shell server-compatible tối thiểu cho loading/error/auth states;
- `src/shared/i18n/config.ts`: locale contract `vi/en` dùng chung, không thay schema đa ngôn ngữ;
- `scripts/check-foundation-boundaries.mjs`: kiểm import direction và circular dependency trong `app/server/shared/features`;
- DB/auth reads được memoize request-scoped để tránh lặp trong cùng render request.

Auth foundation hiện tại:

- `src/server/auth/guards.ts` resolve request-scoped `CmsPrincipal` từ Supabase Auth → active `cic_users` profile → active role assignments → allowed module/action;
- `can()` phục vụ server composition/UI capability; `requirePermission()` là enforcement bắt buộc cho action/handler nhạy cảm;
- `/cms` và catch-all dùng page guard; login/unauthorized/forbidden là public auth-state routes; public website không đi qua CMS guard;
- login dùng password auth, safe internal `returnTo`; CMS header gọi server logout thật; Route Handler phân biệt 401/403/500;
- current CMS header identity lấy từ authenticated profile, không còn mặc định dùng demo identity trong Next composition.

Live DB chưa có `auth.users`, role assignment hoặc `cic_role_permissions`, nên authenticated production E2E chưa thể chạy và permission provider được giữ fail closed. Các bảng direct legacy không được diễn giải tạm khi numeric semantics/parity chưa được authoritative sign-off.

Data-access foundation bổ sung:

- `src/proxy.ts` + `src/server/supabase/proxy.ts`: refresh Supabase session cookie ở request boundary;
- `src/server/db/errors.ts`: typed/safe mapping từ PostgREST error sang `DataAccessError`;
- `src/server/db/result.ts`: discriminated result chỉ dành cho action/HTTP boundary;
- direct PostgreSQL singleton có connection/idle/lifetime timeout và tiếp tục `prepare:false` cho transaction pooler;
- `check:data-foundation` kiểm privileged client import và secret leak trong browser bundle;
- `audit:db-security` audit read-only connection, RLS, policy, role và grant; không mutate schema.

Không có browser Supabase client vì chưa có realtime/direct Storage use case được duyệt. Feature server query/action hiện hữu tiếp tục ở gần domain; không có global repository framework.

Đây là implementation đã có để audit, không phải bằng chứng tự động rằng workflow, permission, schema mapping, UI parity hoặc integration đã hoàn tất.

### Shared code và coupling

`src/shared/**` chứa tokens, typography/icons/counter, CMS UI primitives, page-content/visual-editing contracts, configuration và customer-interaction contract.

Rủi ro coupling quan sát được:

- một số server feature import type từ `src/cms/modules/**` thay vì domain-owned type;
- `CmsShellClient` nhận props kiểu `any` và đưa phần lớn CMS legacy vào một client boundary;
- `WebsiteShell` giữ local navigation state/no-op callback trong khi App Router sở hữu URL;
- fixture legacy và PostgreSQL data cùng tồn tại trong CMS/public composition.

## Data flow hiện tại

```text
Legacy fixture → legacy adapter/data source → React UI
PostgreSQL/Supabase → feature server query/action → Next route/CMS props
Legacy content adapter → Next client wrapper → legacy presentation
```

Luồng thứ hai là hướng đích. Hai luồng còn lại chỉ là reference/transition và không được dùng để tuyên bố persistence complete.

## Domain inventory cấp cao

- Public/content: home, about/company/partners, products và taxonomy, services, projects, news/categories, events, static/legal pages, menu/navigation, media, public search.
- Customer interaction: contact/CRM inbox, CTA, forms/submissions, customer requests, email templates, consultation/product/event registration.
- Governance/system: dashboard, users/identity, roles/permissions, system configuration, function SEO/URL, localization, activity logs, trash, CMS global search.
- Cross-module: publish/draft/preview, media/reference resolution, SEO/URL, locale/workspace, audit/trash, auth/authorization, validation/errors, caching/revalidation, notification và search projections.

## Rủi ro kiến trúc hiện tại

1. Next và legacy cùng nằm dưới `src`; import chéo có thể kéo presentation type hoặc browser-only code vào server/domain boundary.
2. CMS shell là Client Component lớn và nhiều module vẫn nạp demo source; server data chỉ phủ một số module.
3. Public shell dùng App Router nhưng vẫn giữ state navigation kiểu legacy và callback no-op; semantics UI/URL có thể lệch reference.
4. Một số route list/detail là markup Next tối giản thay vì composition đầy đủ của reference.
5. Query/action/repository phân bố không đồng đều; module có thể read-only, write một phần, mock hoặc mixed-source.
6. Mọi assumption table/relation trong code phải đối chiếu `database.html` + `POSTGRES_SCHEMA_DELTA`.
7. Browser-only surfaces dày: History API, storage, canvas, observers, CKEditor, iframe, DOM editing, clipboard, drag/drop, animation.
8. Rich HTML sanitation chưa có một contract server thống nhất cho mọi consumer.
9. Auth/RBAC có foundation và một số enforcement nhưng chưa đủ bằng chứng cho mọi CMS query/mutation/capability/scope.
10. Claim lịch sử trong `MIGRATION_STATUS.md` không thay thế status gate mới trong `MODULE_MAP.md`.
