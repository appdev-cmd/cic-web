# Phase 6 — Embedded Sections Rollout

> Scope: embedded/custom-content sections only. Production JSX remains authoritative. Reference collections, media picking, Add/Remove, Hero, CTA, and optional-slot behavior are outside this rollout.

## Batch Summary

Seven requested sections were reviewed. `about.timeline`, `about.strategy.coreValues`, and `contact.branches` are production-wired and inline-editable through the shared runtime. Awards, Partners Gallery, and Experience remain blocked or partial because their missing media/schema contracts cannot be safely invented.

## Section Status Matrix

| Section | Wiring | Identity | Inline text | Reorder | Media | Add/Remove | Visual |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `about.timeline` | PASS | PASS | PASS | BLOCKED | N/A | BLOCKED | PASS |
| `about.strategy.coreValues` | PASS | PASS | PASS | BLOCKED | N/A | BLOCKED | PASS |
| `contact.branches` | PASS | PASS (`slot-key`) | PASS | N/A | N/A | BLOCKED | PASS |
| `home.awards` | BLOCKED | MISSING | BLOCKED | BLOCKED | BLOCKED | BLOCKED | PARTIAL |
| `about.awards` | BLOCKED | MISSING | BLOCKED | BLOCKED | BLOCKED | BLOCKED | PARTIAL |
| `about.partners.gallery` | BLOCKED | MISSING | N/A | BLOCKED | BLOCKED | BLOCKED | PARTIAL |
| `about.experience` | BLOCKED | MISSING | BLOCKED | BLOCKED | BLOCKED | BLOCKED | PARTIAL |

## Timeline

`about.timeline.config` now resolves before render into `AboutTimelineModel`. The existing responsive production timeline consumes `title` and `milestones[].year/description`. Repository draft/published milestones carry persistent IDs; bindings address those IDs, not positions.

The CMS milestone `title` remains BLOCKED because production does not render it. The production badge and explanatory paragraph remain static-unwired and have no affordance. Connector and dots are decorative. Edit Mode disables pulse/ping and hover scaling. Reorder and Add/Remove remain BLOCKED because capabilities and collection constraints are undeclared.

## Strategy Core Values

`about.strategy.config` resolves into `AboutStrategyModel`. Title, subtitle, vision, mission, and persistent `{id,value}` core-value items drive the existing production JSX. Core-value editing uses the same string codec and delegated interaction runtime as Statistics and Capacity.

Repository mock string arrays were migrated to persistent objects. Reorder and Add/Remove remain BLOCKED; no constraints or item factory were introduced. The illustration remains code-owned and receives no media affordance. Edit Mode suppresses its production hover transform.

## Contact Branches

`contact.branches.config` resolves into `ContactBranchesModel`, explicitly mapping CMS `phone` to production `phone` (formerly local `tel`). The existing stable branch `key` is the slot identity. Title, name, address, phone, email, and working hours are inline-editable on their production nodes.

`fax` remains BLOCKED where no destination exists. `searchQuery` derives from address when absent; `mapUrl` drives the iframe but is not exposed as inline text. Branch tabs are interaction state and the iframe is derived presentation. Edit Mode freezes branch entrance/exit motion.

## Home Awards

BLOCKED for production-data onboarding. CMS owns `{imageId,name}` while production `AwardsSlider` requires `{img,name}` and no approved shared Media resolver exists at the page-content boundary. Item IDs are also missing. Wiring names alone would create a field-level CMS/fixture hybrid, so no award field receives an editable binding. Existing slider pause behavior in Edit Mode remains intact.

## About Awards

BLOCKED for the same Media/identity reasons as Home Awards. The current production view also consumes the Home awards fixture, while About owns a separate config. This ownership leak is documented but not hidden behind a partial adapter. No About award affordance is rendered.

## About Partners Gallery

BLOCKED. The four gallery images are fixed production URLs and no CMS gallery destination is proven. Partner references are deliberately excluded from Phase 6. Gradient/hover layers remain decorative; no fake `config.gallery[]`, ID migration, or image picker was introduced.

## About Experience

BLOCKED. Production renders three image/title/description rows, whereas CMS stores only section title plus `categoryKeys[]`. No approved schema migration supplies equivalent items. Production remains static-unwired and shows no direct-edit affordance.

## Shared Runtime Changes

- Added no section behavior to `src/shared/visual-editing`.
- Extended `SectionHeader` with presentation-neutral DOM props so real heading/description nodes can carry bindings without wrappers.
- Added one data-layer adapter factory that maps explicit section bindings to immutable PageBuilder paths; it renders no UI.
- Expanded page-content models/resolvers only with section-specific production models.

## Data/Schema Migrations

- `about.strategy.coreValues[]`: string values → `{id,value}` in repository draft and published mocks.
- `about.timeline.milestones[]`: added persistent `id` in repository draft and published mocks.
- No external stored draft/published/history migration was performed.
- No Media, Awards, Gallery, or Experience schema was invented.

## Blocked Capabilities

- Reorder is BLOCKED for Timeline/Core Values because the registry does not enable it.
- Add/Remove is BLOCKED everywhere because min/max, creation defaults, and layout policy are incomplete.
- Award and gallery image editing is BLOCKED pending shared Media resolution/picking.
- Awards text is BLOCKED until complete section resolution and stable item identity exist.
- Timeline hidden milestone title, gallery, and Experience item fields have no valid visible/persistent contract.

## Visual Acceptance

The migrated sections preserve existing DOM hierarchy/classes and attach metadata/refs directly to real production nodes. Edit idle adds no visual chrome. Hover/edit treatment is supplied by the already accepted generic overlay. Timeline, Strategy, and Branches retain their desktop/mobile layouts; Edit Mode freezes section motion while Preview/Public behavior remains enabled. No Add, Remove, grip, toolbar, form, or media control appears for blocked capabilities.

## Genericity Audit

Shared targeting, selection, editing, geometry, and sortable modules contain no Timeline, Awards, Gallery, Experience, Branches, or Core Values behavior branches. Section names exist only in resolvers, contracts, binding declarations, data mutation adapters, and tests. No `TimelineEditor`, `AwardsEditor`, `GalleryEditor`, `ExperienceEditor`, or `BranchEditor` exists.

## Regression Results

`home.stats` retains resolver-driven inline edit/reorder behavior. `about.capacity` retains description/value/label editing, blocked title behavior, and production-like idle presentation. Verification results are recorded with the Phase 6 handoff.
