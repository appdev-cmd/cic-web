# Phase 4E — Collection Add/Remove Decision

> Scope: `home.stats` only. Evidence review did not establish enforceable collection bounds, so Add/Remove implementation is intentionally blocked. No production JSX, editor UI, placeholder, mutation runtime, schema, or registry capability was added in this phase.

## Constraint Source

The reviewed sources establish that `home.stats.config.items` is repeatable, but none defines an enforceable minimum or maximum:

- `src/cms/modules/static_pages/pageBuilderDraftSchema.ts` declares `items` as a collection only.
- `src/cms/modules/static_pages/pageBuilderRegistry.ts` declares only `reorderable: true`; its description says that the current design has four statistics, but prose is not a constraint contract.
- `src/shared/page-content/resolvePageContent.ts` validates that `items` is an array and validates each item shape. It does not reject an empty array or enforce an item count.
- `src/web/components/HomeView.tsx` maps every resolved item into `grid-cols-2 md:grid-cols-4`. Those classes define responsive columns, not collection capacity.
- Current fixture and mock data contain four items. Fixture cardinality is not a business rule.
- `docs/visual-editor/WIRING-DECISIONS.md` explicitly records `minItems` and `maxItems` as unknown and Add/Remove as blocked.

Consequently, neither the number of columns nor the current four-item fixture is promoted into a machine-readable business constraint.

## Statistics min/max Decision

```text
HOME_STATS_MIN_ITEMS = UNKNOWN
HOME_STATS_MAX_ITEMS = UNKNOWN
HOME_STATS_ADD = BLOCKED
HOME_STATS_REMOVE = BLOCKED
```

Phase 4E cannot safely choose whether zero, one, two, four, or another item count is valid. It also cannot determine whether a fifth item is supported merely because CSS Grid would wrap it.

## canAdd / canRemove Contract

No `addable`, `removable`, `minItems`, or `maxItems` capability was added. Publishing incomplete capabilities would make the runtime appear authoritative while still relying on an invented number.

The future generic evaluation remains:

```text
canAdd = addable is true
  AND maxItems is explicitly declared
  AND itemCount < maxItems

canRemove = removable is true
  AND minItems is explicitly declared
  AND itemCount > minItems
```

Until all required operands are present in the reviewed contract, both results must be false and may emit developer-only diagnostics.

## Add Placement

Not implemented. No `+` or virtual grid item is rendered. Once Add is authorized, its affordance must occupy the natural next cell of the existing production grid only in Edit Mode; it must not become a toolbar, panel, or block below the section.

## New Item Identity

Not implemented. Existing statistics have persistent IDs in repository mock snapshots, but no approved creation contract defines:

- the ID generator and persistence boundary for newly created items;
- the valid initial `value`;
- the valid initial `label`;
- whether `suffix` is absent or an empty string.

A future Add operation must create the persistent ID once before appending the draft item. It must not introduce a transient ID that changes after save.

## Remove Interaction

Not implemented. No contextual Remove action is rendered because the minimum count is unknown. The existing contextual reorder grip remains unchanged.

## Draft Mutation

No Add/Remove mutation was introduced. Production continues to render the existing PageBuilder draft through:

```text
draft home.stats.config.items
→ resolvePageContent
→ HomeStatsModel
→ HomeView production Statistics JSX
```

When constraints are approved, Add and Remove must update this draft array immutably and identify removals by persistent `itemId`, never by positional identity.

## Grid/Layout Behavior

The production grid remains unchanged. Its `grid-cols-2 md:grid-cols-4` classes prove responsive placement but do not establish fixed count, wrapping policy, or maximum capacity as a content contract.

An approved constraint decision must explicitly state whether the collection is fixed-count or wrapping and must define the expected production behavior outside the current four-item fixture.

## Preview Behavior

Unchanged. Because no collection affordance was added, Preview contains no Add slot or Remove control. Existing reorder and inline-edit controls remain scoped to Edit Mode as implemented in prior phases.

## Known Limitations

- Business/design ownership has not supplied an enforceable minimum or maximum.
- Empty-state behavior is not defined.
- More-than-four-item production behavior is visually possible through CSS wrapping but is not contractually approved.
- A valid new-item factory/default state has not been approved.
- Persistent-ID migration for externally stored draft/published/history versions remains outstanding.

## Decision Required to Unblock

Before implementation resumes, the reviewed contract must explicitly provide:

1. `minItems`;
2. `maxItems`;
3. `addable` and `removable` policy;
4. fixed-count versus wrapping behavior;
5. the valid initial statistic payload and persistent-ID creation policy.

Until then, rendering Add or Remove would violate the Phase 4E constraint rules.
