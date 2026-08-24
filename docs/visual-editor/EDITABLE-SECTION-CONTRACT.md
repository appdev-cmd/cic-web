# Phase 5B — Reusable Editable Section Contract

> This contract is extracted from two working integrations: `home.stats` and `about.capacity`. It describes semantics and data operations only. It does not render production UI or define editor chrome.

## Architecture

```text
PAGEBUILDER DATA
       ↓
SECTION/PAGE RESOLVER
       ↓
SECTION-SPECIFIC PRODUCTION MODEL
       ↓
PRODUCTION JSX
       +
EDITABLE CONTRACT / EXPLICIT BINDINGS
       ↓
GENERIC INTERACTION RUNTIME
       ↓
SECTION-SPECIFIC DATA MUTATION ADAPTER
       ↓
PAGEBUILDER DRAFT
```

The reusable contract lives in `src/shared/visual-editing/editableSectionContract.ts`. Concrete PageBuilder declarations live in `pageBuilderRegistry.ts`; they are integration metadata, not a production renderer.

## Proven Common Ground

| Concern | `home.stats` | `about.capacity` | Generic? |
| --- | --- | --- | --- |
| production model | yes | yes | pattern only; models remain specific |
| resolver | yes | yes | page/section-specific mapping |
| persistent item ID | yes | yes | generic requirement |
| field binding | yes | yes | generic |
| hover | yes | yes | generic |
| selection | yes | yes | generic |
| inline string | label | description/value/label | generic |
| numeric parser | value | no | value-kind codec |
| formatted string | no | metric value | value-kind codec |
| reorder | enabled | blocked | capability-driven |
| title mismatch | n/a | blocked | section data contract |
| add/remove | blocked | blocked | constraint-driven |

## Responsibilities

### Production Model

Production models remain section-specific: `HomeStatsModel` and `AboutCapacityModel`. They contain content needed by production JSX and no hover, selection, editing, toolbar, or draft state.

There is intentionally no `GenericSectionData`, generic `items` model, or schema-rendered production component.

### Editable Contract

`EditableSectionContract` declares:

```ts
type EditableSectionContract = {
  sectionKey: string;
  fields: readonly EditableFieldContract[];
  collections?: Readonly<Record<string, EditableCollectionContract>>;
  references?: Readonly<Record<string, EditableReferenceContract>>;
};
```

It answers what a field means, who owns it, how its value is interpreted, whether interaction is enabled, and which collection capabilities are proven. It contains no label, icon, toolbar placement, border, button, card editor, or panel setting.

### Binding Layer

Production JSX remains explicit:

```tsx
<div {...bindElement(createElementBinding(...))}>{value}</div>
```

Bindings attach semantic identity to the real production node. The contract does not generate JSX, scan descendants, or decide layout. A stable item ID is part of item-scoped bindings; array index is never persistent identity.

The current two production integrations keep explicit binding declarations because converting handcrafted JSX to a schema renderer would remove presentation authority without eliminating meaningful duplication.

### Interaction Runtime

The shared runtime owns only presentation-neutral behavior:

- DOM registration and lookup;
- delegated target resolution;
- hover/selection state and geometry;
- transient inline text sessions;
- value codec invocation;
- paste and IME handling;
- generic sortable mechanics when capability is enabled.

It does not know PageBuilder section keys, `HomeView`, `AboutView`, or CMS data shapes.

### Mutation Adapter

`PageBuilderVisualElementEditingAdapter` standardizes the implemented text boundary:

```ts
type PageBuilderVisualElementEditingAdapter = {
  sectionKey: string;
  resolveInlineTextEdit(sections, binding): PageBuilderResolvedElementEdit | null;
};
```

The adapter maps semantic binding identity to the current draft location, verifies persisted item identity, supplies the field contract/codec, and validates the committed typed value. It renders no UI.

`visualElementEditingAdapters.ts` is a data-adapter registry:

```text
section key → data mutation adapter
```

It is not a section editor registry. Registration does not create a component, toolbar, panel, or affordance.

### Render Policy

Three concerns remain separate:

```text
production content model
render policy (motionEnabled)
editing interaction state
```

Edit passes `motionEnabled: false`; Preview/Public use the production default. Neither mode nor selection state is stored in content models.

## Field Contract

```ts
type EditableFieldContract = {
  path: string;
  semantic: EditableElementSemantic;
  ownership: EditableElementOwnership;
  valueKind?: 'string' | 'number';
  editing: 'enabled' | 'disabled' | 'blocked';
  blockedReason?:
    | 'representation-mismatch'
    | 'data-unwired'
    | 'identity-unresolved'
    | 'contract-missing';
};
```

`*` in a contract path means an item selected by stable identity, not an array index. Example: `metrics.*.label`.

An enabled inline field must declare `valueKind`. Decorative or structural declarations need no codec.

## Value Kinds

The two proven value kinds are:

```text
string
number
```

The generic interaction path is:

```text
transient text
→ FieldValueCodec.parse
→ typed value or invalid result
→ mutation adapter
```

Built-in codecs:

- string: preserves input exactly;
- number: accepts only a complete finite decimal representation.

Selection is driven by `valueKind`, never `sectionKey` or a field named `value`. `home.stats.items.*.value` uses the number codec; `about.capacity.metrics.*.value` uses the string codec.

Business validation beyond these proven primitives remains an adapter/schema responsibility. No speculative validation framework was added.

## Collection Contract

```ts
type EditableCollectionContract = {
  path: string;
  identity: 'persistent-item-id' | 'entity-id' | 'slot-key';
  capabilities: {
    reorder: CapabilityState;
    add: CapabilityState;
    remove: CapabilityState;
  };
  minItems?: number;
  maxItems?: number;
  layoutBehavior?: { wrap?: boolean };
};
```

Only proven or explicitly blocked concerns are represented. There is no editor layout, card style, action label, or toolbar metadata.

## Identity

Persisted item interactions require a stable identity supplied by the production model/binding integration:

- `persistent-item-id` for embedded items;
- `entity-id` for future reference items;
- `slot-key` for fixed presentation slots.

The runtime consumes identity but does not create or persist it. Transient/fallback IDs remain ineligible for persisted mutation. Array position may be calculated after an ID lookup but is never identity.

## Capabilities

```ts
type CapabilityState = 'enabled' | 'disabled' | 'blocked';
```

- `enabled`: reviewed and available;
- `disabled`: intentionally unsupported;
- `blocked`: expected or plausible, but missing a safe contract/wiring decision.

Absence means undeclared, not enabled. Runtime gates use `state === 'enabled'`; truthiness is insufficient.

Current declarations:

| Collection | Reorder | Add | Remove |
| --- | --- | --- | --- |
| `home.stats.items` | enabled | blocked | blocked |
| `about.capacity.metrics` | blocked | blocked | blocked |

No numeric min/max is inferred from a four-column layout.

## Blocked Elements

A production element may be visible and have a CMS field yet remain blocked. `about.capacity.title` is declared:

```text
semantic: rich-text
ownership: static-unwired
editing: blocked
reason: representation-mismatch
```

Blocked fields receive no editable binding, hover target, selection, or fake affordance. Reasons remain contract/diagnostic data and are not exposed in the DOM.

The Capacity separator is declared decorative and disabled. Visible production content is not automatically editable.

## Forbidden Coupling

Shared visual-editing runtime must not:

- import `HomeView`, `AboutView`, or PageBuilder implementation modules;
- branch on `home.stats`, `about.capacity`, Statistics, or Capacity;
- render production UI from metadata;
- own draft paths or entity resolution;
- infer editable fields by scanning arbitrary DOM descendants;
- store editor state in production models.

`scripts/check-visual-editing-boundary.mjs` enforces section-name and import boundaries across `src/shared/visual-editing`.

## Existing Implementations

### `home.stats`

- section-specific production model/resolver;
- persistent embedded item IDs;
- number codec for value and string codec for label;
- shared binding/hover/selection/inline runtime;
- capability-enabled generic reorder;
- suffix representation mismatch and Add/Remove blocked.

### `about.capacity`

- section-specific production model/resolver;
- persistent embedded metric IDs;
- string codec for description, formatted value, and label;
- same binding/hover/selection/inline runtime;
- title mismatch, reorder, and Add/Remove blocked.

## Future Extension Rules

- Add a section only after production wiring and ownership are proven.
- Extend semantics/codecs only after a real implemented case needs them.
- Reference items retain entity ownership; their child text/image must not become embedded edits. `EditableReferenceContract` declares entity/slot identity plus tri-state Replace/Reorder/Add/Remove capabilities, while entity resolution and ID mutation stay outside the interaction runtime.
- Optional fields may later add `optional` metadata when an actual optional-slot interaction is implemented; Phase 5B does not add it speculatively.
- Media/reference mutation APIs belong in future phases after a real section proves their contract.
- New presentation stays in handcrafted production JSX, not a schema renderer.

## Before onboarding a new section

- [ ] production inventory exists
- [ ] data source is wired
- [ ] production model exists
- [ ] semantic ownership known
- [ ] persistent identity exists where required
- [ ] representation mismatches resolved or BLOCKED
- [ ] bindings declared on real production nodes
- [ ] generic runtime reused
- [ ] mutation adapter contains data mapping only
- [ ] no section editor component
- [ ] no layout change

## Regression Result

```text
shared runtime boundary audit — PASS
TypeScript typecheck — PASS after capability narrowing
production build — PASS
home.stats wiring/binding/hover/edit/reorder regression — PASS
about.capacity resolver/binding/identity/edit regression — PASS
new editing capability — none
```

Phase 5B stops at contract extraction. It does not onboard a third section.
