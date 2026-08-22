# Phase 4B — Hover Targeting & Selection Runtime

> Scope: `home.stats` only. This phase identifies and selects bound production nodes but does not edit data or expose actions.

## Target Resolution

`resolveVisualEditingTarget(...)` starts at the pointer event target and walks through its ancestors only until the editing root. At each node it asks `ElementBindingRegistry` for registered bindings; it does not query or scan the page.

Default resolution rules:

1. consider only bindings from the requested section (`home.stats` in this phase);
2. prefer bindings marked `editable` on the nearest bound node;
3. ignore structural bindings unless a caller explicitly requests structural inspection;
4. return `null` when no eligible binding exists before reaching the root.

This makes a label text descendant resolve to its label binding while blank space in the non-editable statistic item resolves to no visual target.

## Nested Binding Priority

| Pointer location | Resolution |
| --- | --- |
| Counter span | Counter field target |
| Label or its text descendant | Label field target |
| Empty statistic item area | no editable target |
| Collection grid | no editable target |
| Outside `home.stats` | no target in Phase 4B |

The resolver is generic and keyed by binding metadata. It contains no Statistic-specific editor action.

## Shared Node Behavior

The production Counter span contains both `value` and `suffix`. Both bindings remain registered on that one node. Target resolution returns a shared-node target containing both bindings and uses the first registered binding (`value`) as its stable primary `bindingId` for hover/selection state.

The runtime does not claim separate geometry for the suffix. Later editing work must either operate on this compound target or receive an explicitly reviewed production DOM change.

## Hover Visual Contract

Hover renders one pointer-transparent fixed overlay around the resolved production field:

```text
1px orange outline at 46% opacity
2.5% orange surface tint
4px corner radius
3px geometry clearance
```

No label, icon, badge, toolbar, dashed border, section frame, or layout style is added. Hover disappears when the pointer leaves the target. Structural item and collection bindings receive no hover treatment.

## Selection Contract

- Clicking an editable bound field stores its primary `bindingId` as `selectedBindingId`.
- Clicking blank canvas clears selection.
- Escape clears selection.
- A selected element keeps a slightly stronger 1.5px outline while another field may show the lighter hover outline.
- Hovering the selected field does not render a second outline.
- Registry replacement preserves selection when the binding ID is registered on a new node.
- Unmounting the selected binding makes selection unresolved and clears it during registry reconciliation.

The generic controller exposes:

```text
getHoveredBinding()
getSelectedBinding()
selectBinding(bindingId)
clearSelection()
```

## Overlay Geometry

The overlay uses `position: fixed` inside the same iframe document as the production canvas and reads the real node through `getBoundingClientRect()`.

Geometry updates are requestAnimationFrame-batched from:

- viewport resize;
- captured scroll events;
- a `ResizeObserver` attached only to the hovered or selected node;
- registry revision when React replaces or unregisters a node.

No production wrapper or positioning rule is introduced, and no whole-document observer or polling loop is used.

## Pointer Event Strategy

One delegated `pointermove`, `pointerleave`, and capture-phase `click` listener is attached to the production canvas root. Escape is handled on that root's owner document. Overlay elements use `pointer-events: none`, so targeting always originates from production DOM.

The legacy PageBuilder section controls are bypassed specifically for `home.stats`; other sections remain outside Phase 4B. Future link, button, and CTA interception requires a separate interaction policy and is not implemented here.

## Known Limitations

- Value and suffix share one DOM node and one geometry rectangle.
- Draft items without persistent IDs remain unsuitable for persisted selection across versions or reorder.
- Selection is internal to the mounted overlay controller; Phase 4B does not persist it with page drafts.
- Only `home.stats` participates in this targeting layer.

## Visual Acceptance Result

- **Idle Edit Mode:** no Phase 4B overlay is present; `home.stats` retains production layout without its legacy section toolbar/frame.
- **Hover statistic 4 label:** only the fourth label node receives the light hover rectangle.
- **Selected value:** only the production Counter span receives the selected rectangle; no toolbar or layout shift appears.

Final visual-editor acceptance remains open because inline editing and later interactions are intentionally outside Phase 4B.
