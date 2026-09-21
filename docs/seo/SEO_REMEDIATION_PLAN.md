# CIC SEO Remediation Plan

Plan date: 2026-09-21  
Inputs: `SEO_POST_IMPLEMENTATION_REVIEW.md`, `SEO_CLOSE_FINDINGS.md`, `SEO_FINDINGS.md`, and current directly affected source.  
Mode: planning only; no implementation or data mutation.

## 1. Scope and ID authority

This plan covers only original findings that are not `VERIFIED_FIXED` and regressions SEO-R001 through SEO-R005.

The authoritative original ID mapping from `SEO_FINDINGS.md` is:

- SEO-010: service meta description and duplicated title brand.
- SEO-011: default/dynamic Open Graph and Twitter metadata.
- SEO-012: image alt semantics.
- SEO-013: event aliases containing `:` and their compatibility redirects.

SEO-001, SEO-002, and SEO-008 remain closed and must not be rewritten. The one legacy product URL for ID 448 is an accepted `NO_TARGET`, not a wrong redirect; it must remain 404 unless a content owner supplies an authoritative replacement.

## 2. Findings to remediate

### SEO-003 — Duplicate News aliases

- **Current problem:** Runtime lookup no longer throws, but 9 VI and 4 EN duplicate normalized alias groups remain. `ORDER BY ... LIMIT 1` silently hides published records.
- **Root cause:** Legacy data violated the invariant `one normalized alias + one locale = at most one article`. Current repository validation protects new writes, but live data and DB-level uniqueness are not reconciled.
- **Files/data affected:** `src/features/news/server/queries.ts`, `src/features/news/server/repository.ts`, `src/features/news/schemas/newsInput.ts`, `src/features/function-seo/server/queries.ts`, `cic_news`, `cic_news_en`, News migration/mapping documents.
- **How to fix:**
  1. Reconfirm the duplicate groups and blank aliases in a read-only precheck.
  2. Apply the approved deterministic canonical policy per locale: published first, authoritative article/publish date descending, ID descending.
  3. Keep the canonical alias; assign each non-canonical row a deterministic collision-safe alias such as `<normalized-alias>-<id>`. Do not delete or unpublish content.
  4. Produce before/after mapping and preserve the limitation that one ambiguous legacy source URL cannot redirect to multiple articles.
  5. After zero duplicates are verified, add partial unique indexes on `lower(btrim(alias))` independently to both locale tables and nonblank constraints if absent.
  6. Keep repository validation for user-facing errors, but make the DB index the race-safe invariant.
  7. Remove `LIMIT 1` as the integrity mechanism after the invariant exists; an optional defensive limit may remain only with an explicit invariant comment.
  8. Make sitemap generation fail/report duplicate logical URLs rather than silently hiding them through final Set de-duplication.
- **How to verify:** pre/post duplicate queries return 13 groups then zero; article counts and published states unchanged; unique indexes exist; concurrent duplicate create/update test yields one success and one constraint/domain failure; every renamed record resolves at its new URL; sitemap contains one URL per article alias.
- **Risk/dependency:** Data migration must be transactional and backed up. Canonical date authority must be confirmed before execution. Existing News policy/migration documents must be reconciled with the live schema before applying.

### SEO-004 — Structured data semantics

- **Current problem:** JSON parses but Product offers are fabricated, Article dates are non-ISO, Service/Event entity schema is missing, and Organization is hard-coded.
- **Root cause:** Schema components were built from validator-shaped defaults instead of authoritative public projections and visible page content.
- **Files/data affected:** `src/features/seo/components/ProductJsonLd.tsx`, `ArticleJsonLd.tsx`, `OrganizationJsonLd.tsx`, new narrowly scoped Service/Event schema components if warranted, `src/app/layout.tsx`, VI/EN Product/News/Service/Event detail pages, public settings query/types.
- **How to fix:**
  1. Remove Product `offers` entirely until real price, currency, availability, and URL are both authoritative and visible. Do not emit zero price or assumed stock.
  2. Pass authoritative timestamps from the News read model and serialize with `toISOString()` server-side. Omit unknown `dateModified`; never substitute request time.
  3. Add Service/Event entities only for fields actually rendered and persisted; otherwise keep valid Breadcrumb/WebPage schema rather than invent fields.
  4. Convert Organization JSON-LD to accept the approved public Settings projection: site name, canonical URL, logo, public contact, address/branches, and validated social URLs. Omit missing values.
  5. Use stable `@id` values so Organization, WebSite, publisher, and page entities reference one graph identity.
  6. Keep SearchAction only while `/search?q=` is indexable and functionally correct; describe it as schema, not a guaranteed rich result.
- **How to verify:** parse rendered JSON-LD for home plus VI/EN Product, News, Service, Event; validate semantic source-to-page equality; assert no Product `offers` without real visible data; assert ISO dates; assert absolute canonical image/entity URLs; run schema tests against null/empty fields.
- **Risk/dependency:** Depends on the approved System Settings public manifest for Organization fields. Adding Service/Event schema must not invent a persistence model.

### SEO-005 — LCP and media

- **Current problem:** Home LCP remains 8.02s desktop/5.09s mobile and About 4.68s/5.29s. Home loads/preloads multiple hero assets; About serves very large original images. Ordinary `<img>` elements do not receive Next image optimization.
- **Root cause:** The actual LCP images are oversized and non-responsive; `HomeHeroSection` preloads every slide, while `fetchPriority` alone does not reduce bytes.
- **Files/assets affected:** `src/web/components/home/HomeHeroSection.tsx`, its server/home model producer, `src/web/components/AboutView.tsx`, referenced hero/About assets, `next.config.ts` only if `next/image` remote/local policy requires it.
- **How to fix:**
  1. Re-measure actual LCP element and resource URL before each template change.
  2. Load only the initial hero eagerly/high priority; remove the `new Image()` preload-all loop. Load the next slide after idle/interaction or immediately before transition.
  3. Use `next/image` or a standards-based responsive `<picture>` for actual LCP images with truthful width/height, `sizes`, and mobile/desktop variants. Preserve the current crop and visual behavior.
  4. Generate/reuse optimized assets through the existing Media foundation; do not rename production URLs without compatibility handling.
  5. Keep below-fold media lazy and verify video poster/source does not load the full video initially.
  6. Do not claim AVIF/WebP unless the network response for the LCP request actually uses that format.
- **How to verify:** production build; three cold runs per Desktop/Mobile route using the same throttling and median; record TTFB/FCP/LCP/CLS/bytes/requests and LCP element; inspect `srcset`, `sizes`, intrinsic dimensions, content type, initial video bytes; visual regression on Desktop/Tablet/Mobile.
- **Risk/dependency:** Image conversion can change crop/quality and CLS. Requires approved optimized derivatives or Media variants. Target: no LCP regression elsewhere and Home/About median LCP no longer poor in the agreed lab profile.

### SEO-006 / SEO-R001 — Multilingual SEO and false detail hreflang

- **Current problem:** VI detail pages inherit homepage alternates; EN details omit alternates. Same numeric IDs across locale tables are not reliable translations.
- **Root cause:** `alternates.languages` is global in `src/app/layout.tsx`, while entity metadata lacks an authoritative translation-equivalence relation.
- **Files/data affected:** `src/app/layout.tsx`; VI/EN Product, News, Service detail `page.tsx`; list/static page metadata; Product/News/Service query projections; possibly `other_languages1` only if proven authoritative.
- **How to fix:**
  1. Remove global language alternates from RootLayout; keep root metadata generic and self-canonical only where appropriate.
  2. Define alternates at route level. Static/list pairs may use explicit known equivalents (`/products` ↔ `/en/products`, etc.).
  3. For detail pages, emit VI/EN/x-default only when a validated relation resolves both published entities and their real aliases.
  4. Until that relation is approved, emit only the self canonical and omit detail hreflang. Never map by shared ID, guessed slug, or language homepage.
  5. If `other_languages1` is selected as authority, validate it as an internal canonical path, verify reciprocal/target existence, and keep relation lookup server-side. Otherwise introduce an approved mapping contract/migration rather than UI inference.
- **How to verify:** rendered head for root/list/static pairs and a matrix of detail records with valid translation, no translation, unpublished counterpart, broken mapping, and unrelated same ID; alternates must be reciprocal, 200, canonical, locale-correct, and page-equivalent.
- **Risk/dependency:** Full SEO-006 closure depends on an authoritative VI↔EN mapping decision. The safe regression fix—removing false alternates—is independently implementable.

### SEO-007 — Server-rendered H1

- **Current problem:** Sampled pages have one H1 after hydration but none in raw SSR HTML.
- **Root cause:** Primary headings live behind client runtime branches; Event detail selection is initialized inside a client component even though the server already resolved the event.
- **Files affected:** `src/app/(public)/events/[slug]/page.tsx`, `src/web/features/events/EventsRuntimeView.tsx`, `src/web/components/EventsView.tsx`, Event list/detail components, and the server wrappers for `/about`, `/products/categories`, `/news/categories` identified in the original finding.
- **How to fix:** Render the primary route heading in the server-rendered tree or pass a fully resolved initial view that produces identical server and hydrated markup. Do not add a duplicate visually-hidden H1 when the detail component already renders one. Preserve selected-event state and SPA interactions after hydration.
- **How to verify:** raw response and hydrated DOM each contain one meaningful primary H1; no hydration warning; direct URL, refresh, Back/Forward, event switch, category navigation, and mobile layout remain correct.
- **Risk/dependency:** Moving heading ownership can duplicate H1 or alter layout. Review per route, not via a blanket wrapper.

### SEO-009 / SEO-R003 — Sitemap and indexability

- **Current problem:** Three generated URLs return 404; queries have fixed caps, some EN failures are swallowed, EN Service/Project URLs may be synthesized from VI data, and deduplication masks duplicate logical content.
- **Root cause:** Sitemap combines configuration records, hard-coded routes, and locale data without verifying the real route/data authority.
- **Files/data affected:** `src/features/function-seo/server/queries.ts`, `src/app/sitemap.ts`, `cic_config_modules*`, `cic_content_pages`, Product/News/Service/Project/Event tables and route inventory.
- **How to fix:**
  1. Remove or correct the exact sources for `/en/gioi-thieu`, `/about/organization`, `/about/capacity-experience`; choose the canonical implemented route, not a redirecting placeholder.
  2. Replace hard-coded EN paths with an approved static route registry that is tested against actual routes.
  3. Query each locale from its own authoritative table; do not generate EN Service/Project URLs from VI aliases unless the route intentionally uses the same published entity.
  4. Stop converting DB/query failure to an empty locale sitemap. Fail build/monitoring visibly or return a controlled error according to deployment policy.
  5. Remove arbitrary 1,000/10,000 caps or implement deterministic batched pagination until exhaustion.
  6. Use stored update timestamps only; do not set `lastModified` to build time for unchanged content.
  7. Detect and report duplicate canonical URLs before final output; do not silently Set-deduplicate integrity violations.
  8. Integrate the resolved SEO-003 and SEO-013 invariants before final crawl.
- **How to verify:** parse all entries; total equals authoritative published/indexable counts; every URL is unique, canonical, 200, indexable, correct host/locale, and non-legacy; zero 3xx/404/5xx/timeouts; simulate >1,000 and >10,000 rows in a test to prove no cap; simulate an EN query failure and assert it is visible.
- **Risk/dependency:** Depends on route ownership and locale data availability. Do not create missing pages merely to satisfy sitemap output.

### SEO-010 — Meta description and title cleaning

- **Current problem:** Service fallback improved, but root title remains double-branded and `cleanSeoTitle()` misses repeated suffixes/trailing whitespace/approved brand variants.
- **Root cause:** Both DB/public settings title values and nested metadata templates can append branding; cleanup handles only one simple suffix.
- **Files/data affected:** `src/lib/seo/siteUrl.ts`, `src/app/layout.tsx`, `src/app/(public)/layout.tsx`, Product/Service detail metadata, approved public settings keys (`title`, `main_title`, `meta_des`).
- **How to fix:** Establish one title-template owner. Normalize whitespace first, remove only repeated terminal approved brand tokens in a bounded loop, and never remove legitimate `CIC` in the content portion. Keep service descriptions from SEO description → plain-text summary → bounded deterministic page-specific fallback; strip HTML.
- **How to verify:** unit matrix for all cases listed in the review plus empty/null/HTML descriptions; rendered titles on root and VI/EN details have one brand suffix; descriptions are meaningful, deterministic, plain text, and page-specific.
- **Risk/dependency:** Requires an explicit approved canonical brand suffix from Settings. Regex must not rewrite legitimate names.

### SEO-011 — OG/Twitter

- **Current problem:** `/og-image.png` returns HTML, detail metadata is generic, `og:url`/dimensions are missing, and declared Twitter/OG dimensions do not match the actual asset.
- **Root cause:** Public layout fallback references a nonexistent asset and overrides root defaults without complete image metadata; detail generators do not provide entity-level social metadata.
- **Files/assets affected:** `src/app/(public)/layout.tsx`, root metadata, VI/EN Product/News/Service/Event metadata, `public/` social assets or Media projection.
- **How to fix:** Provide one real default social image with verified content type and actual dimensions, or use an approved Media URL. Populate absolute `openGraph.url`, locale, title, description, image width/height/alt, and matching Twitter metadata. Detail pages should use the entity image when valid, otherwise the verified fallback. Do not declare guessed dimensions.
- **How to verify:** rendered tag matrix by locale/template; every image returns 200 `image/*`; decoded dimensions match metadata; canonical and `og:url` agree; title/description/image match visible entity content; fallback behavior tested with missing images.
- **Risk/dependency:** Needs an approved 1200×630 (or truthfully declared) asset and Media URL normalization.

### SEO-012 — Alt semantics

- **Current problem:** Most sampled pages improved, but Home has 13 empty alts whose decorative status is not explicit.
- **Root cause:** Alt cleanup optimized for non-empty counts instead of classifying content versus decoration.
- **Files affected:** `src/web/components/home/HomeHeroSection.tsx`, repeated logo/banner components on Home, and any shared image component producing the sampled empty alts.
- **How to fix:** Classify each image. Content images get concise data-derived alt with safe fallback; linked logos identify destination/partner once; decorative duplicates keep `alt=""` and are removed from assistive semantics (`aria-hidden` only where appropriate). Avoid filename/generic/duplicated keyword text.
- **How to verify:** accessibility-tree and DOM sample for Home plus Product/News/Service/About; no `undefined`/`null`; every informative image has useful alt; decorative images are intentionally empty; linked images retain an accessible name.
- **Risk/dependency:** Do not turn decorative watermark/backgrounds into noisy announcements.

### SEO-013 — Event slug normalization

- **Current problem:** 32 published sitemap URLs still contain `:`. This ID was incorrectly conflated with alt text in prior reporting; the authoritative finding is event slug normalization.
- **Root cause:** Legacy aliases were persisted with colon characters; current Event query/routes/sitemap use aliases unchanged and no compatibility redirect migration was implemented.
- **Files/data affected:** `cic_event` and, if in public use, `cic_event_en`; `cic_redirects`; `src/features/events/server/queries.ts`; Event create/update validation; Event detail route; sitemap query; redirect resolution/proxy path.
- **How to fix:**
  1. Define one event slug normalizer for new writes: lowercase/trim, transliterate consistently with current slug rules, replace colon and invalid runs with `-`, collapse separators, reject blank output.
  2. Precompute old→new mapping for all affected locale rows and detect collisions before mutation. Resolve collision deterministically with an approved suffix (prefer stable event ID), never random text.
  3. In one transaction, update aliases and insert one active 301 redirect per unique old public path into `cic_redirects`. Do not create ambiguous redirects.
  4. Validate normalized uniqueness per locale at repository and DB level after cleanup.
  5. Ensure redirect resolution supports the full `/events/...` path before changing data; the current catch-all static-page resolver alone is insufficient evidence.
  6. Sitemap emits only new aliases; internal links/search use new URLs.
- **How to verify:** mapping report; zero published aliases/URLs containing colon; zero normalized collisions; old URLs one-hop 301 to new URL; new URLs 200/self-canonical; counts/published status/content unchanged; create/update rejects future invalid/colliding aliases; VI/EN tested independently.
- **Risk/dependency:** Data migration and redirect route support are coupled and must deploy atomically. Collision policy and EN table participation require precheck confirmation.

## 3. Regression consolidation

Regression work is intentionally folded into the owning fixes to avoid duplicate code:

| Regression | Owner |
| --- | --- |
| SEO-R001 false detail hreflang | SEO-006 |
| SEO-R002 fabricated Product offers | SEO-004 |
| SEO-R003 sitemap 404s | SEO-009 |
| SEO-R004 invalid Article dates | SEO-004 |
| SEO-R005 hard-coded Organization | SEO-004 |

## 4. Phased implementation plan

### Phase 0 — Baseline and safety contracts

- **Findings:** supporting gate for all open work.
- **Files:** test/verification tooling only; no production behavior change.
- **Implementation:** Freeze the 2,339-URL sitemap and representative rendered-head fixtures as comparison inputs; record current DB counts/duplicate groups/event mappings; document which current typecheck/lint failures are SEO-introduced versus pre-existing.
- **Tests:** rerun current focused checks to make the baseline reproducible.
- **Exit criteria:** deterministic fixtures and precheck reports exist; no DB mutation; unrelated dirty-tree files are excluded.

### Phase 1 — P1 regressions and crawl-signal safety

- **Findings:** SEO-006/R001, SEO-004/R002/R004/R005 safety subset, SEO-009/R003, SEO-007.
- **Files:** `src/app/layout.tsx`, locale detail pages, SEO components, sitemap query, Event H1 route/runtime files.
- **Implementation:** remove false global detail hreflang; omit unproven detail alternates; remove fabricated Product offers; serialize only authoritative Article dates; remove the three known 404 sources; make H1 server-rendered.
- **Tests:** rendered head/schema/H1 matrix; full sitemap HTTP crawl; unit tests for absent translation/offer/date.
- **Exit criteria:** no false hreflang, fabricated offers, sitemap 404s, non-ISO Article dates, or client-only primary H1. No new 3xx/404/5xx.

### Phase 2 — Data and indexability invariants

- **Findings:** SEO-003, SEO-009 remainder, SEO-013.
- **Files/data:** News repository/query/schema and migrations; Event query/write validation and redirect support; `cic_news*`, `cic_event*`, `cic_redirects`; sitemap query.
- **Implementation:** transactional News alias cleanup + unique indexes; transactional Event alias normalization + collision-safe redirects + future-write guard; remove sitemap caps/error masking/false locale synthesis.
- **Tests:** migration dry-run reports, preservation assertions, uniqueness/concurrency tests, old/new URL roundtrip, authoritative count-to-sitemap reconciliation.
- **Exit criteria:** zero News duplicates, zero invalid Event aliases, unique protection exists, old Event URLs redirect exactly once, sitemap count matches published/indexable authority with all URLs 200.

### Phase 3 — Semantic metadata and schema completion

- **Findings:** SEO-004 remainder, SEO-010, SEO-011.
- **Files:** SEO JSON-LD components, public/root layouts, locale detail metadata, Settings/Media public projections.
- **Implementation:** authoritative Organization graph; truthful Service/Event/Product/Article schema; one title-template owner; robust bounded title cleaning; real default/dynamic OG/Twitter assets and metadata.
- **Tests:** JSON parsing plus semantic assertions, title/description unit matrix, asset HTTP/content-type/dimension checks, rendered metadata across locales.
- **Exit criteria:** schema reflects visible authoritative content, no generated-now historical data, one brand suffix, OG/Twitter images are real and correctly described.

### Phase 4 — Performance remediation

- **Findings:** SEO-005.
- **Files/assets:** Home hero, About hero/media, existing Media variants/config.
- **Implementation:** stop preload-all, responsive LCP delivery, truthful dimensions, below-fold lazy behavior, preserve visuals.
- **Tests:** production build; three cold Desktop/Mobile runs per baseline route; network/media audit; responsive visual regression.
- **Exit criteria:** Home/About LCP is no longer poor in the agreed lab profile, bytes materially decrease, CLS remains good, and no visual/interaction regression exists.

### Phase 5 — Remaining P2/P3 semantics and quality debt

- **Findings:** SEO-012 plus implementation hygiene; SEO-010/011 residual edge cases.
- **Files:** Home/shared image components, SEO-touched lint files, only directly related whitespace/errors.
- **Implementation:** explicit decorative/content alt policy; remove SEO-introduced `any` and whitespace issues. Pre-existing System Configuration/Product typing failures go to their owners unless they block the final build gate.
- **Tests:** accessibility-tree sampling, targeted lint/typecheck, `git diff --check`.
- **Exit criteria:** alt semantics are intentional, SEO-touched files are lint/type clean, and no unrelated cleanup is included.

### Phase 6 — Final close verification

- **Findings:** all SEO-003 through SEO-007 and SEO-009 through SEO-013 plus R001–R005.
- **Files:** verification reports only after implementation is complete.
- **Implementation:** no feature work; repeat independent close review.
- **Tests:** production build, typecheck, lint, available tests; full sitemap HTTP crawl; full legacy Product redirect set; full affected Event redirect set; rendered browser matrix; JSON-LD validation; hreflang reciprocity; three-run performance comparison.
- **Exit criteria:** every original finding is `VERIFIED_FIXED`; R001–R005 closed; zero P0/P1; sitemap has zero redirect/404/5xx/noindex entries; build/typecheck/lint pass or any proven unrelated failure is formally owned and does not invalidate the SEO runtime; performance does not regress.

## 5. DB/data cleanup required

Required:

1. News VI/EN duplicate alias normalization and per-locale normalized unique protection.
2. Event VI and applicable EN invalid alias normalization, collision report, and old-path 301 records.
3. Read-only validation of the authoritative VI↔EN relation source before any detail hreflang mapping.

Not required:

- No Product legacy ID rewrite.
- No arbitrary redirect for legacy Product ID 448.
- No price/availability columns solely to make Product schema eligible.
- No content deletion/unpublish as a shortcut for alias cleanup.

## 6. Typecheck and lint ownership

- SEO-introduced: fix the explicit `any` in the SEO-touched EN service detail and whitespace in the reviewed SEO files.
- Pre-existing/outside SEO: missing `system_configuration/mockData` and Product list fields (`availability_signal`, `origin`, `tagline`) must be assigned to their owning modules. Do not broaden SEO remediation into CMS architecture cleanup.
- Final gate: rerun full checks and report both categories. A failing full typecheck cannot be reported as PASS even if the remaining errors are outside SEO.

## 7. Blocking questions / decisions

All five implementation questions are resolved from the current source, approved compatibility documents, live schema/data, and physical assets. No business decision remains.

### Decision 1 — VI/EN translation authority: RESOLVED

- **Evidence:** VI and EN are independent datasets. The compatibility contract explicitly prohibits using `other_languages1` as an automatic relation. Live data has that field populated for only 2/1,553 VI News rows and 1/300 EN rows; its values are legacy URLs or free-form paths, not a validated reciprocal key. Products contain similarly legacy `other_languages*` columns, while Services and Events have no translation relation. Shared numeric IDs were already proven not to represent equivalent content reliably.
- **Decision:** There is currently **no authoritative entity-level VI↔EN relation**. Implementation must remove inherited/global detail alternates and emit self-canonical only for Product, News, Service, Project, and Event detail pages. Hreflang remains allowed only for explicit static/list route pairs whose equivalence is defined by code (`/`↔`/en`, `/products`↔`/en/products`, etc.). Do not create a mapping table, infer by ID/alias/title, or consume `other_languages1`.
- **Affected:** `src/app/layout.tsx`; VI/EN detail `page.tsx` metadata for Product, News, Service, Project/Event where routes exist; no DB change.

### Decision 2 — News canonical date authority: RESOLVED

- **Evidence:** Public list/detail mapping exposes `date = start_time ?? created_time`; every News ordering query uses `coalesce(start_time, created_time) DESC`; the CMS form owns `start_time`; the approved compatibility document states canonical selection by published status, newest `start_time`/article date, then highest ID. `updated_time` is edit/audit time and must not outrank the article publication date.
- **Decision:** For each normalized duplicate alias inside one locale, rank by `published DESC NULLS LAST`, then `COALESCE(start_time, created_time) DESC NULLS LAST`, then `id DESC`. Use `updated_time` only for audit/`dateModified`, never to select the canonical article. Canonical keeps the alias; non-canonical rows receive the approved deterministic `normalized-old-alias-id` alias without deletion or unpublishing.
- **Affected:** News cleanup migration/report, `cic_news`, `cic_news_en`, `src/features/news/server/queries.ts`, and DB normalized unique indexes.

### Decision 3 — Event alias collision policy and EN scope: RESOLVED

- **Evidence:** Live data has 33 colon aliases in VI (32 published) and 16 in EN (15 published). A read-only normalization precheck replacing colon runs with hyphens and collapsing hyphens found **zero normalized collisions** in either locale. CMS/query/repository support both `cic_event` and `cic_event_en`, but current public routes and sitemap expose Event detail only under VI `/events/[slug]`; there is no `/en/events/[slug]` route.
- **Decision:** Normalize colon aliases in **both** locale tables to keep the CMS/domain invariant consistent. Collision rule remains deterministic: if a future/full normalizer target collides, use `<normalized-alias>-<event-id>`. Create compatibility 301 records only for currently routable VI old paths (`/events/<old-alias>` → `/events/<new-alias>`). Do not create fake `/en/events/...` redirects, sitemap entries, or public routes. Enforce normalized per-locale uniqueness after cleanup and validate future CMS writes in both locales.
- **Affected:** `cic_event`, `cic_event_en`, `cic_redirects` for VI paths only, Event repository/schema, redirect resolution for full Event paths, and sitemap generation.

### Decision 4 — Organization Settings authority: RESOLVED

- **Evidence:** `APPROVED_SETTINGS_MANIFEST` owns and publicly exposes `site_name`, `legal_name`, `logo`, `public_email`, `tel`, `address`, and social URL keys. Live VI/EN Settings contain published legal/site names, `/api/media/2` logo, public email, Facebook, and YouTube; blank fields are allowed. `cic_branches` contains published VI/EN head-office rows with authoritative address, phone, and email. The raw `domain` value is non-canonical (`https://cic.com.vn`) and therefore cannot override the already verified canonical host.
- **Decision:** Build the global Organization schema from the **VI published public Settings projection plus the published VI head-office branch**: `name = legal_name || site_name`, `url = CANONICAL_SITE_URL`, `logo = absolute resolved Settings logo`, contact/address = head-office branch with `public_email` fallback, and `sameAs` = nonblank validated published social URLs only. Omit any empty value. EN pages reference the same corporate Organization `@id`; they do not create a second organization. Never read raw config rows or use `admin_email`; never use Settings `domain` as canonical authority.
- **Affected:** `src/features/system-settings/server/queries.ts` public projection (consumer only unless a narrow SEO mapper is needed), `src/features/seo/components/OrganizationJsonLd.tsx`, `src/app/layout.tsx`; no new Settings key or DB field.

### Decision 5 — Default social image: RESOLVED

- **Evidence:** Both live VI/EN `og_image` values are published but blank. `/og-image.png` does not exist. The existing fallback asset `public/banner_hero/doi_tac_cong_nghe_chien_luoc.png` was opened and visually checked; it is a valid PNG, **1690×931**, 2,159,104 bytes, and represents CIC's technology/construction positioning. The Media table currently has no ready 1200×630 social asset; its only ready non-icon image is the logo without recorded dimensions.
- **Decision:** Use `/banner_hero/doi_tac_cong_nghe_chien_luoc.png` as the deterministic default until a nonblank validated `og_image` is configured. Declare its truthful dimensions `1690×931` and MIME-compatible URL; do not claim 1200×630 and do not reference `/og-image.png`. A configured `og_image` may override only after its resolved URL returns `200 image/*` and its actual dimensions are known; otherwise retain the verified fallback.
- **Affected:** `src/app/(public)/layout.tsx`, root OG/Twitter metadata, and detail metadata fallback logic; existing asset only, no new image or DB mutation.

### Legacy Product ID 448 — confirmed non-blocker

No action is needed under the approved 275/276 redirect contract. Keep 404 unless a content owner later identifies an authoritative target; never redirect it by similarity.

## 8. Readiness

**READY_TO_IMPLEMENT: YES**

Implementation can begin phase-by-phase. The five decision gates are closed. Data-changing phases must still run their documented transactional prechecks and abort if live state differs from the evidence above; that is an execution safety gate, not an unresolved business requirement.
