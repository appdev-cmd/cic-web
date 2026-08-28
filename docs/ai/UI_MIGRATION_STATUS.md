# UI Migration Status (React legacy → Next.js)

Inventory only. React/Vite is the visual and behavior reference; Next App Router is the target implementation. `[x]` = route and target boundary exist, `[~]` = partial/adapter/legacy reuse, `[ ]` = not migrated or not verified.

## Public website

| Status | Next route | React source (reference) | Business module | Backend binding | UI verification |
|---|---|---|---|---|---|
| `[~]` | `/` | `src/web/components/HomeView.tsx` | home, navigation, CTA | partial server/page-builder adapter | not formally verified |
| `[~]` | `/products`, `/products/[slug]` | `ProductsView.tsx`, `ProductDetailView.tsx` | products | PostgreSQL published queries | parity not verified |
| `[~]` | `/news`, `/news/[slug]` | `NewsView.tsx` | news, rich HTML | query boundary + HTML content | page composition refactored; MCP desktop/tablet/mobile render checked; parity/related projections still pending |
| `[~]` | `/services`, `/services/[slug]` | `ServicesView.tsx` | services, rich HTML | query boundary + HTML content | not verified |
| `[~]` | `/projects`, `/projects/[slug]` | `ProjectsView.tsx` | projects, rich HTML | PostgreSQL published queries | not verified |
| `[~]` | `/events`, `/events/[slug]` | `EventsView.tsx` | events, rich HTML | query boundary + HTML content | not verified |
| `[~]` | `/about` | `AboutView.tsx` | about, partners | config-backed read boundary | not verified |
| `[~]` | `/contact` | `ContactView.tsx` | contact/CRM, CTA | Server Action + PostgreSQL | not verified |
| `[~]` | `/search` | `SearchView.tsx` | public search | aggregate published queries | not verified |
| `[x]` | `/privacy`, `/terms`, `/_not-found` | legal and `NotFoundView.tsx` | legal/platform | static boundary | not verified |

`[~]` does not mean visual parity: several routes are thin server pages or adapters and do not yet compose the complete legacy sections.

## CMS

| Status | Next route/surface | React source | Business module | Backend binding | UI verification |
|---|---|---|---|---|---|
| `[~]` | `/cms`, `/cms/dashboard` | `src/cms/modules/dashboard/*` | dashboard | PostgreSQL aggregates | shell smoke check only |
| `[~]` | `/cms/search` | `search/*` | global search | authenticated server index | not verified |
| `[~]` | `/cms/users`, `/cms/permissions` | `cic_users/*`, `permission_management/*` | users/RBAC | Server Actions + PostgreSQL | not verified |
| `[~]` | `/cms/settings` | `system_configuration/*` | configuration | transactional PostgreSQL actions | not verified |
| `[~]` | `/cms/news`, `/cms/events`, `/cms/services`, `/cms/projects`, `/cms/products` | matching `src/cms/modules/*` | editorial/catalog | mixed server boundaries | not verified |
| `[~]` | `/cms/media`, `/cms/menu`, `/cms/static-pages` | matching modules | assets/navigation/page builder | data boundaries exist | not verified |
| `[~]` | `/cms/contacts`, `/cms/customer-requests`, `/cms/forms`, `/cms/cta` | matching modules | customer interaction | server boundaries/actions | not verified |
| `[~]` | `/cms/localization`, `/cms/function-seo`, `/cms/email-templates`, `/cms/activity-logs`, `/cms/trash`, `/cms/product-settings` | matching modules | governance/support | boundaries vary | not verified |
| `[~]` | `/cms/login` | auth shell components | authentication | Supabase auth action | not verified |

CMS screens are mostly legacy client modules inside the Next shell. They become `[x]` only after independent Next rendering and desktop/tablet/mobile regression checks.

## Recommended next migration

**Next page:** Services detail (`/services/[slug]`) after the News published-data/slug blocker is resolved. News detail remains `[~]` until a real published backend record is available for visual QA.
