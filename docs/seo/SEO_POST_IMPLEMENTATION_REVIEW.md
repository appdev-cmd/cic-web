# CIC SEO Post-Implementation Review

Review date: 2026-09-21  
Mode: independent, read-only post-implementation review  
Reviewed range: `ce9e6dc^..f3d34e9`

## 1. Executive Summary

The implementation is not ready for SEO closure. Three findings are independently verified fixed, eight are partially fixed, one regressed, and one is not fixed. The local production build succeeds, but typecheck and lint do not. A complete HTTP crawl of the generated 2,339-entry sitemap found three 404 URLs. Runtime inspection also found false page-equivalence hreflang on VI detail pages, absent hreflang on EN detail pages, fabricated Product `offers`, non-ISO Article dates, a broken Open Graph fallback image, and 32 published event URLs retaining colon characters.

Final verdict: **SEO NOT CLOSED**.

## 2. Review Scope

Reviewed the five approved baseline documents, the six named implementation commits, current source, read-only PostgreSQL data, the current local production build, the current production host redirect matrix, all sitemap URLs by HTTP, all identifiable legacy product URLs, and a stratified browser-rendered sample.

The original documents number SEO-010 as meta/title, SEO-011 as OG/Twitter, SEO-012 as alt text, and SEO-013 as event-slug normalization. This report preserves that approved numbering while covering every check requested in the review brief.

No source, database, environment, migration, test, commit, push, or deployment change was made. Only this report and `SEO_CLOSE_FINDINGS.md` were created.

## 3. Evidence & Methodology

Evidence classes were kept separate:

- Source evidence: exact current code and `git show`/diff for the six commits.
- Data evidence: read-only queries against `cic_products*`, `cic_news*`, services, and events.
- HTTP evidence: local production build at `127.0.0.1:3100`; current production used only for canonical redirect/baseline checks.
- Browser evidence: Playwright Chromium rendered DOM/head and PerformanceObserver measurements.
- Full coverage: HTTP status crawl of all 2,339 generated sitemap URLs and all 276 identifiable legacy product URLs.
- Sample coverage: rendered metadata, hreflang, H1, JSON-LD, images, and alt text on representative route families. This was not a 2,339-page browser-rendered crawl.

Lighthouse was not installed. Performance was re-measured with the same Playwright/PerformanceObserver family of methodology as the baseline, one production-build run per route/device. These lab results are directional, not field data or a three-run median.

## 4. Git Change Review

| Commit | Primary change | Classification | Review |
| --- | --- | --- | --- |
| `ce9e6dc` | canonical host, headers, legacy product redirect | REQUIRED / JUSTIFIED_SUPPORTING_CHANGE | Canonical and redirect direction are sound; no secret found. |
| `beec354` | duplicate news lookup ordering + `LIMIT 1` | RISKY | Prevents runtime failure but masks a violated uniqueness invariant. |
| `c2304e1` | sitemap, locale proxy/header, root alternates | REQUIRED + RISKY | Introduces false global detail hreflang and sitemap 404s. |
| `5d464ff` | JSON-LD components and detail integration | REQUIRED + RISKY | Product offer is fabricated; Article dates are invalid SEO dates. |
| `69b0610` | H1/media/meta/title/alt changes | REQUIRED / JUSTIFIED_SUPPORTING_CHANGE | Several improvements, but H1 SSR and LCP acceptance are incomplete. |
| `f3d34e9` | robots rules | REQUIRED | Correct local output; robots is not access control. |

No material business feature outside SEO was identified. No committed credential was found in this diff. No test/debug artifact was found. The combined implementation diff fails `git diff --check` because of trailing whitespace/new EOF whitespace in multiple edited files; this is hygiene debt rather than an SEO runtime blocker.

Risky/redundant design points:

- Root global `alternates.languages` is not an entity-level translation contract.
- Sitemap generation synthesizes some EN URLs from VI sources and silently suppresses some EN query failures.
- JSON-LD helpers hard-code operational organization data and invented commerce values.
- `next.config.ts` image formats do not optimize ordinary `<img>` elements.

## 5. Build / Type / Lint Results

| Check | Result | Evidence |
| --- | --- | --- |
| `npm run build` | PASS | Production build completed after allowing read-only DB network access. `/products` prerender timed out once at 60s and succeeded on retry. |
| `npm run typecheck` | FAIL | Missing `../modules/system_configuration/mockData`; `CmsProductListItem` lacks `availability_signal`, `origin`, `tagline`. |
| `npm run lint` | FAIL | 22 issues: 19 errors, 3 warnings. SEO-touched EN service detail contains explicit `any`; unrelated existing findings were not changed. |
| `npm test` | NOT_AVAILABLE | No `test` script in `package.json`. |
| implementation-range `git diff --check` | FAIL | Whitespace errors exist in the reviewed six-commit range. |

## 6. SEO-001 Verification — Canonical Host

**Status: VERIFIED_FIXED**  
**Implementation quality: GOOD**

- Current application authority resolves to `https://www.cic.com.vn` when no environment override is set.
- Local runtime canonical, sitemap, robots sitemap, representative JSON-LD URLs, and homepage hreflang use the `www` HTTPS host.
- All 2,339 sitemap entries use that host.
- Current production redirect matrix is one hop for the three non-canonical origins and 200 at `https://www.cic.com.vn/`.
- `NEXT_PUBLIC_SITE_URL` can override the value operationally; deployment configuration therefore remains part of the contract.

## 7. SEO-002 Verification — Legacy Redirects

**Status: VERIFIED_FIXED**  
**Implementation quality: ACCEPTABLE**

The old production sitemap yielded 276 unique legacy product URLs. Read-only DB matching found current published products for 275 IDs. ID 448 has no current target.

Full local production-build HTTP validation:

| Classification | Count |
| --- | ---: |
| VALID_301 | 275 |
| NO_TARGET (404) | 1 |
| WRONG_TARGET | 0 |
| REDIRECT_CHAIN | 0 |
| LOOP/TIMEOUT | 0 |

The 15 apparent string mismatches in a raw comparison were percent-encoding/Unicode representation differences; redirect paths decode to the same DB aliases. The 275 targets are also present in the full sitemap crawl and return 200.

Edge behavior:

- valid ID: one-hop 301 to the DB alias;
- unknown/missing ID: 404;
- malformed ID: 404;
- wrong slug + valid ID: ID wins;
- valid-looking slug + another valid ID: ID wins;
- uppercase legacy route prefix: 404;
- query parameters are not retained.

The route is parameterized and uses a primary-key lookup with `published = true`; it is not an obvious bot-traffic query risk. The one unresolved URL is explicitly a `NO_TARGET`, matching the approved 275/276 acceptance boundary, not a wrong redirect.

## 8. SEO-003 Verification — Duplicate News Alias

**Status: PARTIALLY_FIXED**  
**Implementation quality: RISKY**

Runtime 500 behavior is mitigated by deterministic ordering and `LIMIT 1`, but the root data/content identity invariant is not fixed.

Read-only live data found:

- VI: 9 normalized duplicate alias groups; several have two published rows.
- EN: 4 duplicate alias groups; every group has two published rows.
- One VI group contains three rows.

Older rows are silently hidden at lookup time. Sitemap string de-duplication also hides the fact that multiple published logical records share one URL. No unique constraint or demonstrated CMS prevention was added. Classification: **RUNTIME_FIXED_DATA_DEBT_REMAINS**, not a full fix.

## 9. SEO-004 Verification — Structured Data

**Status: PARTIALLY_FIXED**  
**Implementation quality: INCORRECT**

Rendered JSON parses, and Product/News pages include Breadcrumb entities. Semantic validation fails:

- Product detail always emits `price: "0"`, `VND`, `InStock`, and a fixed `priceValidUntil`, although those values are not established by visible content or the audited data contract.
- Article dates render JavaScript locale strings rather than ISO 8601 values; missing modification dates may become current time.
- Service detail pages only emit Breadcrumb schema, not a Service entity.
- Organization name, phone, address, logo, and social links are hard-coded rather than sourced from approved settings.
- SearchAction points to a real search route, but it is not evidence of a Google sitelinks search box; that feature is not guaranteed.

This is a false/wrong SEO-signal risk, not merely validator polish.

## 10. SEO-005 Verification — LCP / Media

**Status: PARTIALLY_FIXED**  
**Implementation quality: ACCEPTABLE**

Production-build lab results improved on several templates, but critical image-heavy pages remain poor.

| Route/device | Baseline LCP | Review LCP | Delta | Verdict |
| --- | ---: | ---: | ---: | --- |
| Home desktop | 11,856 ms | 8,020 ms | -3,836 ms | Improved, still poor |
| Home mobile | 6,400 ms | 5,088 ms | -1,312 ms | Improved, still poor |
| About desktop | 6,284 ms | 4,684 ms | -1,600 ms | Improved, still poor |
| About mobile | 10,192 ms | 5,288 ms | -4,904 ms | Improved, still poor |
| Product detail desktop | 2,944 ms | 1,352 ms | -1,592 ms | Good in this run |
| Product detail mobile | 3,020 ms | 688 ms | -2,332 ms | Good in this run |

Home still transferred about 12.7 MB with about 4.5 MB images in the desktop run; About transferred about 14.8 MB with about 14.4 MB images. Actual LCP remained an image on the problematic pages. Home code still preloads all hero slides and renders ordinary `<img>`/motion images without responsive `srcset`/`sizes`. Network inspection did not establish automatic AVIF/WebP delivery for those ordinary image elements. CLS remained low. Performance verdict: **Improved, not fixed**.

## 11. SEO-006 Verification — Multilingual SEO

**Status: REGRESSED**  
**Implementation quality: INCORRECT**

- `<html lang>` follows the locale header correctly.
- Home has reasonable VI/EN/x-default alternates.
- VI Product, News, and Service detail pages inherit root homepage alternates (`/`, `/en`, `/`) instead of entity-equivalent URLs.
- EN detail pages set canonical metadata but render no language alternates.
- Shared numeric IDs are not a reliable translation relation: sampled same-ID VI/EN Product, News, and Service rows often represent unrelated content.

Therefore the implementation creates false page-equivalence signals and must not be called complete. Global RootLayout alternates are unsafe for dynamic detail metadata. This is SEO-R001.

## 12. SEO-007 Verification — H1

**Status: PARTIALLY_FIXED**  
**Implementation quality: ACCEPTABLE**

Hydrated browser DOM showed one meaningful H1 on `/about`, `/products/categories`, `/news/categories`, and a representative event detail. Raw SSR HTML contained no literal H1 for those same routes. The requested acceptance criterion required both SSR HTML and hydrated DOM. Event initial selection did not show a hydration warning in the sampled runtime, but the H1 remains client-render-dependent.

## 13. SEO-008 Verification — Security Headers / Robots

**Status: VERIFIED_FIXED**  
**Implementation quality: ACCEPTABLE**

Local production responses contain HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, and Permissions-Policy. Local robots output disallows `/cms/` and `/api/` and points to the `www` sitemap.

The current public production host is still serving the prior PHP/LiteSpeed application and does not demonstrate these Next.js headers, so deployment verification remains separate. Robots exclusion is crawler guidance, not CMS/API access control. A source edge case remains: if DB robots text contains `/cms/` but omits `/api/`, the current conditional may fail to append `/api/`.

## 14. SEO-009 Verification — Sitemap / Indexability

**Status: PARTIALLY_FIXED**  
**Implementation quality: RISKY**

Full generated sitemap inspection:

| Metric | Result |
| --- | ---: |
| Total / unique | 2,339 / 2,339 |
| Correct host | 2,339 |
| VI / EN | 1,861 / 478 |
| 200 | 2,336 |
| 3xx | 0 |
| 404 | 3 |
| 5xx | 0 |
| timeout | 0 |

The three 404s are:

- `/en/gioi-thieu`
- `/about/organization`
- `/about/capacity-experience`

No `/search`, `/test`, CMS, API, or legacy URL appeared. However, the sitemap has explicit caps (`LIMIT 10000` and remaining `LIMIT 1000` queries), synthesizes some EN routes from VI tables, catches some EN DB failures as empty arrays, and changes some `lastModified` values to build time. It also contains 32 published event URLs with colon characters. “2,339 valid URLs” is false. This includes SEO-R003.

## 15. SEO-010 Verification — Meta Description / Title Cleaning

**Status: PARTIALLY_FIXED**  
**Implementation quality: ACCEPTABLE**

Service description fallback is deterministic for the sampled VI/EN records and did not emit object strings or raw markup. `cleanSeoTitle()` safely removes simple terminal `| CIC`, `| CIC Technology`, and `| CIC Consulting` suffixes without removing legitimate in-title CIC text.

It does not fully normalize repeated suffixes, suffixes with trailing whitespace, or `CIC Technology Consulting`. Rendered home title remains `CIC Technology — Đối tác công nghệ chiến lược | CIC Technology`, demonstrating unresolved branding duplication.

## 16. SEO-011 Verification — Open Graph / Twitter

**Status: PARTIALLY_FIXED**  
**Implementation quality: INCORRECT**

Rendered pages contain OG and Twitter tags, but key signals are not correct:

- Public metadata points OG image to `/og-image.png`; that file does not exist and the route returns a 200 HTML fallback, not `image/*`.
- Dynamic detail pages use generic site-wide OG title/description/image instead of entity metadata.
- Sampled OG output omitted `og:url` and image dimensions.
- The Twitter fallback image is reachable, but its actual dimensions are 1690x931 while root metadata declares 1200x630; public metadata may omit dimensions entirely.

Presence of tags is not sufficient for a pass.

## 17. SEO-012 Verification — Alt Text

**Status: PARTIALLY_FIXED**  
**Implementation quality: ACCEPTABLE**

Representative Product, News, Service, About, and capability pages had no missing/empty alt values in the sampled rendered DOM, and no `undefined`/`null` alt was seen. Home had 13 empty alt values among 65 images: hero/background and repeated logo images. Empty alt can be correct for decoration, but these elements were not marked `aria-hidden` or `role=presentation`, so semantic intent is unresolved. The implementation improved coverage but does not prove every non-decorative image has meaningful text.

## 18. SEO-013 Verification — Event Slug Normalization

**Status: NOT_FIXED**  
**Implementation quality: INCORRECT**

No event slug normalization/compatibility redirect implementation was found in the reviewed commits. The generated sitemap contains 32 published event URLs whose decoded paths include `:`; live data has 33 colon aliases, 32 published. The original finding remains open.

## 19. Full Sitemap Validation

All 2,339 entries were parsed and HTTP-checked with bounded concurrency against the current local production build. Coverage includes URL syntax, uniqueness, host, locale grouping, prohibited path classes, and status. It does not claim browser-rendered canonical/noindex inspection of every URL; those were checked on a stratified sample. HTTP latency was p50 ~2.16s, p95 ~4.09s, maximum ~18.81s during this crawl.

## 20. Legacy Redirect Validation

All 276 identifiable production legacy product paths were requested without auto-follow, checked for status/location, and matched to read-only DB ID/alias data. The 275 mapped targets are one-hop 301 destinations and return 200 as part of the full sitemap crawl. ID 448 is the sole explicit no-target 404. No false redirect was discovered.

## 21. Structured Data Validation

JSON-LD was extracted from rendered HTML on home, VI/EN Product detail, VI/EN News detail, and VI/EN Service detail. Parsing succeeded, but content validity did not: fabricated Product offers, non-ISO Article dates, missing Service entities, and hard-coded Organization data are material semantic defects. Breadcrumb hierarchy was structurally present on sampled detail pages.

## 22. Multilingual / Hreflang Validation

Homepage alternates work; detail-page alternates do not. VI details incorrectly point to language homepages, EN details have no alternates, and same-ID DB rows cannot be assumed translations. No reliable entity translation relationship was found. Alternate generation must omit unavailable translations rather than fabricate equivalence.

## 23. Performance Before vs After

| Metric | Before | After | Delta | Verdict |
| --- | ---: | ---: | ---: | --- |
| Sitemap URLs | baseline did not include EN set | 2,339 | not comparable | Expanded, contains 3 broken URLs |
| Broken sitemap URLs | not established for same set | 3 | n/a | Fail |
| Legacy mapped redirects | 0 implemented | 275 correct | +275 | Pass within approved no-target boundary |
| Duplicate-news runtime 500 | present | not reproduced | improved | Root debt remains |
| Home desktop LCP | 11,856 ms | 8,020 ms | -3,836 ms | Improved, poor |
| Home mobile LCP | 6,400 ms | 5,088 ms | -1,312 ms | Improved, poor |
| About desktop LCP | 6,284 ms | 4,684 ms | -1,600 ms | Improved, poor |
| About mobile LCP | 10,192 ms | 5,288 ms | -4,904 ms | Improved, poor |
| CLS | 0.0000–0.0241 baseline | 0.0000–0.0072 sampled | lower in sample | Neutral/good |

Absolute transfer comparisons are not asserted where browser cache and the baseline dev-runtime methodology differ.

## 24. Regression Findings

### SEO-R001 — P1 — False detail-page hreflang

- Introduced by commit: `c2304e1`
- Evidence: rendered VI detail heads point alternates to `/` and `/en`; EN detail heads omit alternates; same-ID locale rows can be unrelated.
- Impact: search engines may cluster unrelated content or lose valid locale relationships.
- Recommended correction: build alternates only from an authoritative translation relationship; omit unavailable peers.

### SEO-R002 — P1 — Fabricated Product offer data

- Introduced by commit: `5d464ff`
- Evidence: every sampled Product emits price 0, VND, InStock, fixed validity despite no matching page/data authority.
- Impact: misleading structured data and rich-result policy risk.
- Recommended correction: omit offers unless real, visible, authoritative commerce data exists.

### SEO-R003 — P1 — Generated sitemap contains 404 URLs

- Introduced by commit: `c2304e1`
- Evidence: full crawl found three explicit 404 routes listed above.
- Impact: wasted crawl budget and invalid indexability signal.
- Recommended correction: generate only implemented/published canonical routes and verify route mapping.

### SEO-R004 — P2 — Invalid Article date values

- Introduced by commit: `5d464ff`
- Evidence: rendered JSON-LD uses locale-formatted JavaScript date strings, not ISO 8601.
- Impact: Article schema dates may be ignored or misinterpreted.
- Recommended correction: serialize authoritative timestamps with ISO 8601; do not substitute current time for unknown history.

### SEO-R005 — P2 — Hard-coded Organization authority

- Introduced by commit: `5d464ff`
- Evidence: organization contact/address/social values are embedded in component source rather than approved settings.
- Impact: structured data can drift from visible/public business data.
- Recommended correction: map from the approved public settings projection.

## 25. Claims That Were Overstated

Eight claims are overstated:

1. `13/13 FINDINGS COMPLETE` — only 3 are verified fixed.
2. `27/27 VERIFICATION PASS` — full independent coverage produces failures.
3. `100% PASS` — contradicted by build-adjacent checks, sitemap, schema, hreflang, and performance.
4. `2339 valid URLs` — 3 return 404.
5. Complete hreflang — detail alternates are false or absent.
6. Complete schema — offers/dates/services/organization fail semantic checks.
7. LCP optimized — home/about remain above 4 seconds in sampled production runs.
8. AVIF/WebP enabled as an effective media fix — ordinary `<img>` elements are not transformed by the Next image configuration.

The `275/276` redirect claim is **VERIFIED**, provided the remaining URL is explicitly reported as `NO_TARGET` and not hidden inside “100%”.

## 26. Remaining Technical Debt

- Enforce normalized News alias uniqueness at the domain/DB write boundary.
- Establish a real cross-locale entity mapping before detail hreflang.
- Remove invented structured data and source Organization from approved settings.
- Finish event alias normalization and compatibility redirects.
- Remove sitemap 404s, silent EN failure masking, and unsafe fixed caps.
- Convert actual LCP images to responsive delivery; avoid preloading every hero slide.
- Fix typecheck/lint and add repeatable SEO/runtime tests.
- Verify deployed Next.js headers/metadata after rollout; current production is the prior stack.

## 27. Final Verification Matrix

| Finding | Status | Quality | Close blocker |
| --- | --- | --- | --- |
| SEO-001 | VERIFIED_FIXED | GOOD | No |
| SEO-002 | VERIFIED_FIXED | ACCEPTABLE | No |
| SEO-003 | PARTIALLY_FIXED | RISKY | Yes |
| SEO-004 | PARTIALLY_FIXED | INCORRECT | Yes |
| SEO-005 | PARTIALLY_FIXED | ACCEPTABLE | Yes |
| SEO-006 | REGRESSED | INCORRECT | Yes, P1 |
| SEO-007 | PARTIALLY_FIXED | ACCEPTABLE | Yes |
| SEO-008 | VERIFIED_FIXED | ACCEPTABLE | No (deployment pending) |
| SEO-009 | PARTIALLY_FIXED | RISKY | Yes, P1 |
| SEO-010 | PARTIALLY_FIXED | ACCEPTABLE | Yes |
| SEO-011 | PARTIALLY_FIXED | INCORRECT | Yes |
| SEO-012 | PARTIALLY_FIXED | ACCEPTABLE | No P0/P1, but incomplete |
| SEO-013 | NOT_FIXED | INCORRECT | Yes |

## 28. Final Verdict

**SEO NOT CLOSED**

Blocking issues:

- P1 false multilingual alternates.
- P1 fabricated Product offer structured data.
- P1 sitemap includes three 404 entries.
- Duplicate News alias root invariant remains unresolved.
- Structured data semantic defects remain.
- Event colon-slug finding is not implemented.
- Typecheck and lint fail.
- Home/About LCP remains poor; performance acceptance is not met.

