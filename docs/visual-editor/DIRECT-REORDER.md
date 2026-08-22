# Phase 4D — Direct Item Reorder

> Scope: `home.stats` only. Reorder is direct manipulation of bound production items; no list, toolbar, sidebar, Add, Remove, or other section behavior is introduced.

## Reorder Identity

The drag payload is `{ sectionKey, collectionPath, itemId }`. A sortable item must expose a persistent ID through its `embedded-item` binding. IDs prefixed `unpersisted-`, `legacy-`, or `fallback-` are rejected, and a collection containing any item without a persistent ID cannot be committed. Array position is never item identity.

`sectionDefinitions['home.stats'].collectionCapabilities.items.reorderable` is the only new machine-readable capability. It authorizes reorder only; collection min/max and Add/Remove remain undefined and blocked.

## Drag Entry

Field hover continues to target value/label for inline editing. Hovering production whitespace belonging to an eligible statistic resolves its structural item binding and reveals one small fixed-position grip. Drag begins only from that grip, so text selection, caret editing, and IME sessions cannot accidentally start reorder.

The original production item is the drag visual. A temporary transform and reduced opacity follow the pointer; they are cleared on drop or cancel and are never persisted as layout state.

## Hit Testing

The generic sortable runtime obtains item nodes from `ElementBindingRegistry`, reads their current rectangles, and chooses the nearest bound item. Placement is inferred from the pointer relative to that item geometry. It does not query CSS selectors, scan the page, or encode a column count.

## Draft Mutation

```text
stable source/target item IDs
→ lookup current config.items positions
→ create reordered immutable array
→ onConfigValueChange
→ PageBuilder draft/history
→ resolvePageContent
→ HomeStatsModel
→ existing HomeView grid
```

DOM order is never manually persisted. The mutation record includes `itemId`, `targetItemId`, `beforeIndex`, and `afterIndex` for the existing history boundary.

## Responsive Grid Behavior

Hit testing uses live item geometry, so the same algorithm operates with the production `grid-cols-2 md:grid-cols-4` layout. CSS remains responsible for columns and wrapping; the reorder runtime does not calculate rows or replace the grid.

## Inline Edit Conflict

Reorder is disabled while `editingBindingId` is active. Drag starts by clearing field hover but does not turn the item into a text target. After production rerender, field binding identities remain based on item ID, so inline editing continues to address the same semantic item regardless of its new position.

## Keyboard Behavior

The contextual grip is a labelled button. `Space`/`Enter` grabs it, arrow keys choose the adjacent position in current collection order, `Space`/`Enter` drops, and `Escape` cancels without draft mutation. No permanent Move Up/Move Down controls are rendered.

## Visual Contract

- Idle remains visually identical to production.
- Value/label hover retains the subtle text treatment with no reorder chrome over text.
- Item whitespace hover reveals only a 28px grip outside document flow.
- Drag uses the production item plus a 2px insertion marker.
- Drop rerenders the unchanged production grid from draft data.

## Known Limitations

- Externally stored versions without migrated persistent IDs remain non-sortable.
- Pointer reorder requires production whitespace within the item to reveal the contextual grip; text itself remains reserved for editing.
- Add, Remove, suffix editing, cross-collection moves, and every section other than `home.stats` remain outside Phase 4D.
