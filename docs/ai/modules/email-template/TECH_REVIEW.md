# Tech Review — Mẫu email

> Review date: 2026-09-14  
> Mode: read-only post-implementation review  
> Worker: AGY; Tech Lead verification: Codex  
> Repository: `D:\Workspace\CIC\old_page\cic-web`

## A. Module inventory

| File/area | Responsibility | Runtime consumer | Classification |
|---|---|---|---|
| `src/features/email-templates/types/index.ts` | Domain/read-model types | query, mutation, API, CMS | ACTIVE_REQUIRED |
| `src/features/email-templates/constants/events.ts` | Event/token/sample registry | CMS editor, scripts | SHARED_REQUIRED |
| `src/features/email-templates/server/queries.ts` | List/detail/runtime template/usage reads | RSC, API, dispatcher | ACTIVE_REQUIRED |
| `src/features/email-templates/server/mutations.ts` | Create/version/publish/duplicate/trash writes | API routes, verification | ACTIVE_REQUIRED |
| `src/cms/modules/email_templates/EmailTemplatesRoute.tsx` | RSC auth and initial VI/EN composition | CMS catch-all | ACTIVE_REQUIRED |
| `EmailTemplatesScreen.tsx`, `EmailTemplatesManager.tsx`, `EmailTemplatesFormView.tsx` | Client boundary, list/actions/editor/preview | EmailTemplatesRoute | ACTIVE_REQUIRED |
| `src/app/api/cms/email-templates/**` | Authenticated read/write endpoints | CMS manager | ACTIVE_REQUIRED |
| `src/lib/email/{dispatcher,tokens,transporter}.ts` | Active-template dispatch, interpolation, SMTP | integration scripts; future Form/CTA trigger | SHARED_REQUIRED |
| `src/lib/mail.ts` | Transporter compatibility facade | compatibility/documented contract | LEGACY_COMPATIBILITY |
| `src/features/trash/server/adapters/email-template.ts` | Lossless snapshot/restore | Trash registry and mutations | SHARED_REQUIRED |
| `scripts/{seed-email-templates,verify-email-templates,test-live-email}.ts` | Seed and verification tooling | package/maintenance commands | ACTIVE_REQUIRED |
| `src/cms/modules/email_templates/DeleteConfirmModal.tsx` | Superseded delete modal | no importer; shared dialog is used | SAFE_TO_REMOVE |
| `src/app/api/cms/email-templates/bulk-archive/route.ts` | Duplicate alias of bulk-delete behavior | no UI caller found | LIKELY_DEAD_NEEDS_VERIFY |
| `src/cms/modules/email_templates/mockData.ts` | Old demo source | demo customer-interaction source only | LEGACY_COMPATIBILITY |
| `src/cms/modules/email_templates/types.ts` | CMS types/constants duplicated from feature | CMS and Form consumers | ACTIVE_REQUIRED; POSSIBLE_DUPLICATE |

## B. Docs ↔ implementation alignment

- IMPLEMENTED_CORRECTLY: PostgreSQL authority; VI/EN workspace; event/audience model; immutable versions with draft/active pointers; list/detail/editor/preview; publish; duplicate; token interpolation; permission checks at RSC/API; Audit registry/writer; typed Trash adapter; SMTP dispatcher.
- IMPLEMENTED_PARTIALLY: lifecycle schema documents `draft/active/inactive/archived`, while application contracts expose only `draft/active`; usage lookup exists but its implementation is unsafe and swallows schema/query errors.
- IMPLEMENTED_DIFFERENTLY: approved schema doc says not to backfill templates from `cic_email*`, but `scripts/seed-email-templates.ts:19-112` does so and `MODULE_MAP.md:114` records that migration as completed. This is a source-of-truth conflict requiring an explicit documentation/data decision, not an inferred cleanup.
- NOT_IMPLEMENTED: automatic Form/CTA submission → dispatcher and production SMTP delivery remain explicitly pending; required composite indexes documented for lookup/list are absent from the migration/live-index evidence collected by AGY.
- EXTRA_IMPLEMENTATION: legacy token normalization and Ethereal transport verification are compatible additions, not defects by themselves.

## C. Architecture review

- Server/client split is generally sound: RSC performs initial query/auth, interactive manager/editor stay client-side, DB modules remain server-only.
- The primary architecture defect is transaction ownership. Create, update/version, and Trash execute multi-statement invariants on a shared client without `withTransaction/sql.begin`. Pointer/version/template consistency can be partially committed.
- Audit writes are invoked with `void ...catch`, so the business mutation can report success without a durable audit event; this conflicts with the shared Audit contract for governed CMS mutations.
- Domain and CMS each define Email Template types/event constants. Existing Form consumers import presentation-owned types, weakening dependency direction and making lifecycle/event changes require edits in multiple locations.
- HTTP route handlers are an acceptable boundary; using API routes instead of Server Actions is not itself a defect.

## D. Maintainability review

- Query/mutation responsibilities are identifiable and files are not god services.
- `any` row mapping and duplicated CMS/domain contracts reduce type safety.
- Usage discovery performs information-schema probes on every request and suppresses every error, making real schema drift indistinguishable from “unused”.
- `deleteEmailTemplates()` is an exported permanent-delete path outside the shared Trash workflow; no runtime consumer was found, but it must be consumer-verified before removal.

## E. Dead/unused/temporary files

- SAFE_TO_REMOVE: `src/cms/modules/email_templates/DeleteConfirmModal.tsx` (zero import; replaced by `CmsTrashConfirmDialog`).
- LIKELY_DEAD_NEEDS_VERIFY: `bulk-archive/route.ts` (zero UI caller and same Trash mutation as `bulk-delete`); `deleteEmailTemplates()` (no consumer found in current trace).
- KEEP: mock data while `demoCustomerInteractionDataSource` still imports it; CMS `types.ts` while Form/CTA consumers remain; `src/lib/mail.ts` until compatibility consumers/docs are deliberately migrated.

## F. Data layer review

- Explicit projections are used; no `select *` in runtime Email Template queries.
- Version rows are append-only in normal update behavior and active/draft pointers are modeled correctly.
- MUST FIX: `getEmailTemplateUsage()` interpolates route `id` into `sql.unsafe` and does not validate it first.
- MUST FIX: multi-statement create/update/trash operations are non-atomic. Bulk Trash also catches each error and can return partial success without an explicit partial-result contract.
- Missing documented composite indexes should be added only through a reviewed migration after verifying live schema.
- Seed behavior conflicts with the approved “manifest only; no legacy backfill” statement and requires a policy decision before data cleanup.

## G. Server/client boundary

- KEEP: RSC initial data loading and isolated client manager/editor.
- FIX UX capability propagation: `EmailTemplatesRoute` computes capabilities, but `EmailTemplatesScreen` does not pass them to `EmailTemplatesManager`. Server API authorization still prevents unauthorized mutation, so this is not a security bypass.
- No DB helper is imported into client code and no full DB row is serialized directly.

## H. Auth / Permission / Audit / Trash / Media

- Auth/Permission server enforcement: implemented on route and each API mutation/read endpoint.
- Permission UI: partial because capabilities are dropped before manager.
- Audit: registry/actions exist; duplicate passes only `legacyUserId`, bypassing writer; other audit writes are fire-and-forget and not atomic with mutations.
- Trash: typed VI/EN adapters are registered and preserve template plus versions; move operation is not transaction-safe.
- Media: no direct Media relation is specified for this domain. Rich HTML support alone is not evidence that a Media selector is required; AGY's suggestion to add one is rejected as requirement invention.

## I. Mock/fallback/temporary code

- Production `/cms/email-templates` reads PostgreSQL through `EmailTemplatesRoute`; no runtime mock fallback was found on that route.
- Demo fixtures remain behind an older demo data source and are compatibility debt, not current production authority.
- SMTP simulation when credentials are absent is acceptable for explicit local/test execution, but production readiness must reject missing credentials rather than silently count simulation as delivery success.

## J. Extensibility

- Adding a supported event/token is localized reasonably in the feature registry/token mapper.
- Duplicated CMS/domain registries make event/status expansion unnecessarily cross-cutting.
- Versioning supports new versions without overwriting active content, but transaction and pointer-ownership checks must be fixed before relying on it under failures/concurrency.

## K. Verification

- AGY ran read-only repository inspection and live PostgreSQL metadata/count queries; reported 56 templates, 56 versions, one Email Template Trash item and seven audit rows on 2026-09-14. Treat these counts as environment snapshots.
- The module verification script was not executed because it mutates DB. Static inspection confirms its import of nonexistent `archiveEmailTemplates` at `scripts/verify-email-templates.ts:13`.
- Automated module roundtrip: NOT COVERED in this read-only review.
- Authenticated browser regression: NOT COVERED.
- Full lint/build results from the earlier wrong-repository AGY run are rejected and are not evidence for this checkout.
- Source was not changed in this review. `git diff --check` was run before report creation and returned clean.

## L. Findings

### ET-01 — P1 — Unsafe usage query

- File: `src/features/email-templates/server/queries.ts:188-215`
- Evidence: route-controlled `id` is embedded in `sql.unsafe` strings; endpoint does not validate numeric identity.
- Impact: SQL injection/data exposure risk and fragile schema behavior.
- Direction: validate/coerce ID at boundary and use parameterized SQL against canonical `cic_forms`/`cic_cta` columns.

### ET-02 — P1 — Version/template/Trash writes are not atomic

- File: `src/features/email-templates/server/mutations.ts:35-151,258-281`; `src/features/trash/server/adapters/email-template.ts:41-135`
- Evidence: dependent insert/update/delete statements use the shared client without `withTransaction/sql.begin`.
- Impact: orphan template/version or Trash snapshot, lost pointers, and partial bulk outcome after mid-operation failure.
- Direction: make each business operation transactional; define deliberate atomic/partial semantics for bulk Trash.

### ET-03 — P1 — Audit contract is bypassed/non-atomic

- File: `src/app/api/cms/email-templates/[id]/duplicate/route.ts:25`; `src/features/email-templates/server/mutations.ts:72-88,151-169,213-230,258-277`
- Evidence: duplicate passes a number so create skips object-only Audit; all writers are `void` fire-and-forget without the mutation transaction.
- Impact: successful governed mutations can lack required audit evidence.
- Direction: pass server principal, await shared writer inside the same transaction after the business write.

### ET-04 — P2 — Approved seed policy conflicts with applied implementation/docs

- File: `scripts/seed-email-templates.ts:19-112`; `docs/system-audit/database/17-customer-requests-email-templates-schema-delta.md:83-145`; `docs/ai/MODULE_MAP.md:113-114`
- Evidence: schema authority forbids legacy backfill, while script and module status explicitly perform/claim it.
- Impact: unclear provenance and approval of production template content.
- Direction: obtain a policy decision; then align seed manifest, data provenance and docs. Do not delete existing templates automatically.

### ET-05 — P2 — Usage errors are silently converted to empty usage

- File: `src/features/email-templates/server/queries.ts:177-225`
- Evidence: two broad empty `catch` blocks.
- Impact: Trash/used-by decisions can be made on false “not used” data during schema/query failure.
- Direction: use canonical schema query and surface operational failures; keep “zero usage” distinct from “lookup failed”.

### ET-06 — P2 — Verification script does not compile

- File: `scripts/verify-email-templates.ts:13`
- Evidence: imports `archiveEmailTemplates`, which is not exported by mutations.
- Impact: documented `verify:email-templates` evidence cannot currently be reproduced from source.
- Direction: align verification script with approved Trash/archive semantics and rerun it in an isolated transaction/test database.

### ET-07 — P2 — Documented indexes/lifecycle contract are incomplete

- File: `docs/system-audit/database/17-customer-requests-email-templates-schema-delta.md:97-138`; `src/features/email-templates/types/index.ts:1-35`
- Evidence: required composite indexes were not found; schema supports inactive/archived while types expose draft/active only.
- Impact: query scalability and lifecycle behavior differ from the approved model.
- Direction: verify intended lifecycle; implement only approved states and add the documented indexes through migration.

### ET-08 — P3 — Capabilities are dropped at client boundary

- File: `src/cms/modules/email_templates/EmailTemplatesScreen.tsx:10-48`
- Evidence: capabilities received but not forwarded; manager has no capability contract.
- Impact: unauthorized actions remain visible and fail only at API authorization.
- Direction: forward capability flags and hide/disable controls; retain server checks.

### ET-09 — P3 — Verified dead/duplicate artifacts

- File: `DeleteConfirmModal.tsx`; `bulk-archive/route.ts`; duplicated CMS/domain types.
- Evidence: consumer trace in inventory.
- Impact: lifecycle ambiguity and maintenance overhead.
- Direction: remove only SAFE_TO_REMOVE item; verify compatibility before consolidating the other paths/contracts.

## Tech Lead classification and verdict

- MUST_FIX_BEFORE_COMPLETE: ET-01, ET-02, ET-03.
- SHOULD_REFACTOR: ET-05, canonicalize domain/CMS types and event registry.
- SAFE_CLEANUP: unused `DeleteConfirmModal.tsx` only.
- NON_BLOCKING_DEBT: capability UX, likely duplicate bulk route, compatibility mock/facade.
- FALSE_POSITIVE / KEEP: API route architecture; lack of Media selector; UUID rationale for publish version. Version IDs are bigint strings, though conversion through JavaScript `Number` remains a precision debt.

**Overall verdict: NEEDS_FIX_BEFORE_COMPLETE**  
**Current module status recommendation: keep `[I]`; do not promote to `[x]`.** Core exists, but integration remains pending and the P1 integrity/security/audit defects must be fixed before completion.
