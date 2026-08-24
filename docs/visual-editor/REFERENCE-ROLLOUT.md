# Phase 7 — Reference Sections Rollout

> Scope: reference-owned content only. Entity child fields remain derived and are never inline-edited from a landing page.

## Reference Architecture

```text
PageBuilder ordered entity IDs
→ shared entity-resolution boundary
→ section-specific production model
→ existing production JSX
+ item-level reference binding
→ generic selection / Replace / sortable behavior
→ reference-ID draft mutation
```

Production JSX remains the renderer. The visual-editing runtime neither fetches entities nor copies entity fields into section config.

## Section Status Matrix

| Section | Entity | Wiring | Replace | Reorder | Remove | Add | Visual |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `home.projects` | Project | PASS | PASS | PASS | BLOCKED | BLOCKED | PASS |
| `home.news` | News | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | N/A |
| `home.events` | Event | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | N/A |
| `home.partners` | Partner | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | N/A |
| `about.partners` refs | Partner | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | N/A |
| `home.ecosystem` | Product/Service | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | N/A |
| `about.offerings` | Product/Service | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | N/A |
| `about.software_partners` | Partner | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | N/A |
| `about.hardware_partners` | Partner | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | N/A |

## Entity Ownership Rules

A reference item owns only entity identity, order, and reviewed slot presentation metadata. Project image, name, category, location, client, and tags are derived from the Project entity. They have no editable field bindings. Hovering any child resolves the nearest `reference-item`; no text cursor, image action, or inline session is offered.

## Generic Reference Contract

`EditableReferenceContract` declares `entityType`, `entity-id` or `slot-key` identity, duplicate policy, layout facts, and tri-state Replace/Reorder/Add/Remove capabilities. It contains no toolbar, picker layout, label, or card component. Undeclared/blocked capability is never treated as enabled.

## Projects

`home.projects` is the only fully resolvable reference collection in the current repository. Three PageBuilder IDs have explicit identity mappings to the matching production Project records. The resolver never uses array position:

```text
references.project.entityIds[]
→ resolveProjectEntity(entityId)
→ HomeProjectsModel
→ existing HomeView project JSX
```

Project cards bind at their existing root with `semantic: reference-item`, `ownership: reference`, and `itemId: entityId`. Edit Mode resets/freezes category/search and expansion so the configured ordered collection is visible and geometrically stable. Card navigation is suppressed only in Edit Mode.

Replace opens the existing entity picker and replaces one ID at the same position. Other selected IDs are excluded because duplicates are invalid. Reorder uses the shared geometry/sortable runtime and commits the reordered ID array. Add is blocked despite `maxItems: 3` because no explicit addable/layout contract exists. Remove is blocked because `minItems` is unknown.

## News

BLOCKED. PageBuilder provides News IDs and display labels, while the production fixture has no stable entity IDs. There is no approved News repository/resolver connecting those identities to full card data. No index mapping or copied card fields were introduced.

## Events

BLOCKED. Event IDs do not resolve to the current featured/secondary production records. The semantic rule mapping position zero to featured and the remaining positions to secondary is also not machine-readable. Cross-variant reorder is therefore not enabled.

## Partners

`home.partners` and the reference strip in `about.partners` remain BLOCKED. The current production partner fixture has no entity IDs and does not constitute a Partner repository. The marquee's duplicated render array is derived presentation and must never create duplicate edit targets. No Partner picker is attached until canonical entities resolve.

## Ecosystem

BLOCKED. The seven bespoke Product/Service presentation slots lack a reviewed slot-to-reference mapping. `slotKey` must remain the placement identity; generic entity-ID reorder would change visual role semantics and is not enabled.

## Offerings

BLOCKED. Seven production cards cannot be safely reconciled with the historical two Product plus four Service reference limits. Product/Service ownership and presentation slots are unresolved, so no position-based mapping or child editing is provided.

## Declared-only Partner Sections

`about.software_partners` and `about.hardware_partners` have no production renderer. They therefore have no visual bindings or actions.

## Replace Interaction

The generic interaction descriptor carries section key, collection path, entity type, and entity ID. Its contextual Replace button is attached to the exact production item geometry and returns only the selected ID. It does not edit or persist title/image/excerpt data.

## Reorder

The shared sortable descriptor now accepts both `embedded-item` and `reference-item`. Identity remains stable ID; position is calculated only at mutation time. Only `home.projects.items` declares reorder enabled. Complex slots and variant layouts remain blocked.

## Remove/Add Constraints

No reference section gained Add or Remove. Maximum reference counts alone are insufficient: Remove needs an approved minimum, and Add additionally needs explicit addability, layout behavior, duplicate policy, and a picker-backed insertion contract. No disabled plus/remove control is rendered.

## Motion Freeze

The migrated Project section keeps production markup but disables filter changes, accordion expansion, navigation, and card movement in Edit Mode. Preview/Public retain normal behavior. Other reference sections were not bound, so no partial editor chrome or false motion treatment was added.

## Visual Acceptance

For `home.projects`, live Playwright inspection found three canonical card bindings and zero idle overlays. Hovering a child image produced exactly one item outline, one Replace action, and one grip; the card contained zero editable child bindings. Click produced one selected overlay after the legacy section click conflict was removed. At the 390px mobile canvas all three 342px cards stayed within the 390px section. Replace and grip remain compact fixed overlays outside layout. Preview has no reference controls and normal navigation remains available.

## Genericity Audit

Shared modules contain only generic `ReferenceItemDescriptor`, binding semantics, target resolution, and sortable behavior. Project-specific identity mapping, capability declaration, and draft mutation dispatch remain outside shared runtime. No `ProjectEditor`, `NewsEditor`, `EventEditor`, `PartnerEditor`, or `ReferenceCardEditor` exists.

## Regression

Phase 7 adds no inline-edit behavior and does not change embedded data adapters. `home.stats`, `about.capacity`, and Phase 6 embedded sections remain on their existing generic paths. Verification covers resolver order, unresolved-ID diagnostics, item binding, derived child non-editability, and ID-based reorder.

```text
npm run lint — PASS
npm run build -- --outDir .tmp/phase7-dist — PASS
verify-reference-rollout.tsx — PASS
check-visual-editing-boundary.mjs — PASS
home.stats wiring/reorder regression — PASS
about.capacity regression — PASS
Phase 6 embedded regression — PASS
Playwright desktop/mobile acceptance — PASS
```

## Verdict

```text
PARTIAL — home.projects onboarded; other reference sections correctly blocked by missing entity or slot contracts
```
