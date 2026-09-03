# UI Migration Status

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
