# CIC SEO Close Findings

Independent review date: 2026-09-21  
Verdict: **SEO NOT CLOSED**

| Finding | Original Severity | Status | Evidence | Remaining Work |
| --- | --- | --- | --- | --- |
| SEO-001 Canonical host | P0 | VERIFIED_FIXED | www host across local canonical/sitemap/robots/JSON-LD; production origin matrix redirects in one hop | Preserve deployment env authority |
| SEO-002 Legacy redirects | P0 | VERIFIED_FIXED | 276 discovered; 275 correct one-hop 301; ID 448 is explicit NO_TARGET 404 | Document no-target; decide query/case compatibility if required |
| SEO-003 Duplicate News alias | P1 | PARTIALLY_FIXED | Runtime lookup deterministic, but DB has 9 VI and 4 EN duplicate groups | Enforce content identity at write/DB boundary |
| SEO-004 Structured data | P1 | PARTIALLY_FIXED | JSON parses; fabricated Product offers, invalid Article dates, missing Service entity | Emit only authoritative/visible data; ISO dates; complete valid entity coverage |
| SEO-005 LCP/media | P1 | PARTIALLY_FIXED | Home 8.02s desktop/5.09s mobile; About 4.68s/5.29s; ordinary img remains | Responsive LCP images, avoid preload-all, repeat robust lab/field measurement |
| SEO-006 Multilingual SEO | P1 | REGRESSED | VI details inherit homepage hreflang; EN details omit it; same IDs are not reliable translations | Authoritative equivalent mapping or omit unavailable alternate |
| SEO-007 H1 | P1 | PARTIALLY_FIXED | One H1 after hydration, none literal in sampled SSR HTML | Render meaningful H1 server-side without behavior regression |
| SEO-008 Headers/robots | P2 | VERIFIED_FIXED | Local production responses contain required headers; robots disallows CMS/API | Verify after deployment; correct partial DB robots-rule edge case |
| SEO-009 Sitemap | P2 | PARTIALLY_FIXED | 2,339 entries; 2,336 200 and 3 404; fixed caps and false/synthesized routes remain | Remove broken URLs, caps, error masking, and invalid event paths |
| SEO-010 Meta/title | P2 | PARTIALLY_FIXED | Service fallback works; root still double-branded; title cleaner misses edge cases | Normalize only approved terminal brand variants and verify rendered titles |
| SEO-011 OG/Twitter | P2 | PARTIALLY_FIXED | `/og-image.png` returns HTML; detail OG generic; dimensions/og:url incomplete | Provide real image and entity metadata with truthful dimensions |
| SEO-012 Alt text | P3 | PARTIALLY_FIXED | Most sampled routes good; Home has 13 empty alts without explicit decorative semantics | Classify decorative images and ensure meaningful content alternatives |
| SEO-013 Event slugs | P3 | NOT_FIXED | 32 published sitemap URLs still contain colon characters | Normalize aliases with compatibility redirects and data-safe migration |
| SEO-R001 False detail hreflang | P1 | REGRESSED | Rendered detail head evidence | Correct before close |
| SEO-R002 Fabricated Product offers | P1 | REGRESSED | Rendered Product JSON-LD | Remove until authoritative offer data exists |
| SEO-R003 Sitemap 404s | P1 | REGRESSED | Full sitemap HTTP crawl | Remove/correct three routes |
| SEO-R004 Invalid Article dates | P2 | REGRESSED | Rendered JSON-LD date strings | Use authoritative ISO 8601 timestamps |
| SEO-R005 Hard-coded Organization | P2 | REGRESSED | Component source/runtime schema | Source from approved public settings |

## Verification totals

- VERIFIED_FIXED: 3/13
- PARTIALLY_FIXED: 8/13
- NOT_FIXED: 1/13
- REGRESSED: 1/13
- NOT_VERIFIED: 0/13
- New regressions: P0 0, P1 3, P2 2, P3 0

## Close blockers

1. SEO-R001 false hreflang signals.
2. SEO-R002 fabricated Product offer data.
3. SEO-R003 three sitemap 404s.
4. News alias invariant is not fixed.
5. Structured data and OG semantics remain incorrect.
6. SEO-013 is not implemented.
7. Typecheck/lint fail.
8. Critical LCP templates remain poor.
