# Phase 4A — Element Binding Runtime

> Scope: invisible binding infrastructure for `home.stats` only. This phase adds no editing interaction, selection state, overlay, toolbar, or visual treatment.

## Binding Contract

The presentation-neutral contract lives in `src/shared/visual-editing/elementBindingTypes.ts`:

```ts
type EditableElementBinding = {
  bindingId: string;
  sectionKey: string;
  elementPath: string;
  semantic:
    | 'text'
    | 'rich-text'
    | 'image'
    | 'background-image'
    | 'video'
    | 'icon'
    | 'cta'
    | 'link'
    | 'embedded-item'
    | 'reference-item'
    | 'collection'
    | 'optional-slot';
  ownership:
    | 'embedded'
    | 'reference'
    | 'section-config'
    | 'derived'
    | 'static-unwired';
  editable: boolean;
  itemId?: string;
  collectionPath?: string;
};
```

Binding identity is deterministic:

```text
section key / element-path segments
```

Examples:

```text
home.stats/items
home.stats/items/stat_01/value
home.stats/items/stat_01/label
```

Collection item paths use the model's item ID, never the render position. A PageBuilder item without a persistent ID still carries the transient Phase 3B resolver ID for rendering, but that source remains explicitly unsuitable for reorder or persisted interaction.

## Registry Lifecycle

`ElementBindingRegistry` maintains:

- `WeakMap<Element, Map<bindingId, binding>>` for DOM node to semantic binding lookup;
- `Map<bindingId, Element>` for binding identity to current production node lookup.

React callback refs call `registerElement` on mount and `unregisterElement` on ref replacement/unmount. Registering the same binding ID on a replacement node removes its prior reverse association. Unregistering a stale node cannot remove a newer node registered under the same ID.

Available inspection operations:

```text
getBinding(node)
getBindings(node)
getNode(bindingId)
listBindings()
```

`listBindings()` is the internal read-only inspection helper for tests and developer tooling. The runtime does not install a production global or render debug UI.

## DOM Strategy

`bindElement(...)` returns a React callback ref plus two compact attributes:

```html
data-ve-section="home.stats"
data-ve-element="items.stat_01.value"
```

The props are spread directly onto existing production nodes. No wrapper, layout class, positioning, padding, margin, or visual style is introduced. Geometry for a later overlay can be read from the registered production node.

When multiple semantic fields share one production node, their paths are space-separated in the single `data-ve-element` attribute and all bindings register against that same node.

## Statistics Bindings

| Production node | Element path | Semantic | Ownership | Editable |
| --- | --- | --- | --- | --- |
| Existing statistics grid | `items` | `collection` | `embedded` | no |
| Existing statistic `motion.div` | `items.<id>` | `embedded-item` | `embedded` | no |
| Existing `Counter` span | `items.<id>.value` | `text` | `embedded` | yes |
| Existing `Counter` span | `items.<id>.suffix` | `text` | `embedded` | yes |
| Existing label div | `items.<id>.label` | `text` | `embedded` | yes |

Collection and item bindings describe semantic boundaries only. They are not marked editable because Add, Remove, and Reorder remain blocked by the Phase 3A identity migration and collection-constraint decisions.

## Known Limitations

- Production `Counter` renders the formatted value and suffix in one text node inside one `<span>`. Phase 4A registers both field identities on that real span without splitting the DOM. A future interaction layer cannot give value and suffix separate geometry until an explicitly reviewed production representation change is made.
- Legacy fallback and draft items missing persistent IDs receive transient Phase 3B rendering IDs. Their bindings are deterministic for that resolved render only and are not reorder-safe persistent identities.
- Persistent Statistics item migration and machine-readable collection constraints remain incomplete.
- Only `home.stats` is bound. No contract in this phase implies coverage for other sections.

## Visual Parity

The binding layer changes neither production layout nor visible styles. Statistics retains its existing grid, responsive columns, typography, divider behavior, Counter output, and motion policy. Static rendering verification confirms the same visible values while the new metadata is present; production build and typecheck are part of Phase 4A verification.
