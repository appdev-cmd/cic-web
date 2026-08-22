# Phase 5A — About Capacity Genericity Proof

> Scope: `about.capacity` only. This phase reuses the production data/binding/targeting/inline-edit pipeline and introduces no Capacity editor component, collection actions, or editor form.

## Production Data Wiring

```text
PageBuilder draft about.capacity
→ resolvePageContent({ pageType: "capacity_experience" })
→ CapacityExperiencePageModel.capacity
→ AboutView({ capacityContent, renderPolicy, bindingRegistry })
→ existing Capacity production JSX
```

The draft is resolved before render. Description and metric values are no longer patched into hardcoded DOM. A missing section resolves through the explicit legacy model; an invalid present section produces diagnostics and does not mix legacy fields into draft content.

## Capacity Production Model

```ts
type AboutCapacityMetricModel = {
  id: string;
  value: string;
  label: string;
};

type AboutCapacityModel = {
  description: string;
  metrics: readonly AboutCapacityMetricModel[];
};
```

`value` remains a string because production and CMS values are formatted content such as `150+` and `5.000+`. The Statistics numeric parser is not applied.

## Identity

Repository draft and published mock metrics now have persistent semantic IDs:

```text
capacity_metric_people
capacity_metric_partners
capacity_metric_projects
capacity_metric_experience
```

Binding identity uses those IDs and remains stable when array order changes. Resolver fallback IDs prefixed `unpersisted-about-capacity-metric-` are render-only; the mutation adapter rejects them. External stored versions still require migration.

## Field Contracts

| Field | Value contract | Editing |
| --- | --- | --- |
| `description` | string | inline text |
| `metrics[].value` | formatted string | inline text |
| `metrics[].label` | string | inline text |
| `title` | production rich structure vs CMS plain string | BLOCKED |
| separator | decorative | NO |

```text
CAPACITY_TITLE = BLOCKED
```

The production title contains an intentional line break and highlighted span. The CMS exposes one plain string and provides no reviewed mapping for those presentation segments. The production heading remains unchanged and receives no editable binding.

## Bindings

```text
about.capacity/description
about.capacity/metrics
about.capacity/metrics/<persistent-id>
about.capacity/metrics/<persistent-id>/value
about.capacity/metrics/<persistent-id>/label
```

Bindings attach directly to the existing paragraph, metric grid, metric item, value div, and label div. No wrapper or duplicate renderer is introduced.

## Shared Runtime Reuse

The same generic runtime used by `home.stats` performs:

- DOM-node registration and binding lookup;
- delegated pointer targeting;
- hover and selected geometry;
- direct `contenteditable="plaintext-only"` sessions;
- paste sanitization, IME handling, Enter/blur commit, and Escape cancel.

Targeting no longer filters for `home.stats`; it resolves whatever registered editable binding is under the pointer. The shared `src/shared/visual-editing` modules contain no `home.stats`, `about.capacity`, Statistics, or Capacity behavior branch.

## Section-Specific Data Adapter

`aboutCapacityElementEditing.ts` is the permitted data-boundary adapter. It maps a binding to `description` or a metric found by persistent `itemId`, then returns the same generic `InlineTextEditDescriptor` used by Statistics. `visualElementEditingAdapters.ts` dispatches adapters outside the shared interaction/runtime layer.

Commit remains:

```text
binding + validated string
→ immutable PageBuilder config update
→ resolver
→ AboutCapacityModel
→ AboutView rerender
```

## Blocked Fields

- Title editing is blocked by the rich-structure/plain-string mismatch.
- Reorder is blocked because `about.capacity.metrics` has no reviewed machine-readable `reorderable` capability.
- Add/Remove is blocked because min/max, empty/overflow behavior, and item creation defaults are unknown.
- No blocked capability renders an affordance.

## Constraints

The four current metrics and `grid-cols-2 md:grid-cols-4` describe fixture cardinality and responsive layout only. They do not establish `maxItems = 4`. No Add, Remove, plus slot, delete action, grip, or sortable capability was added.

## Visual Parity

Live CMS browser inspection verified:

- desktop Edit idle: zero visual-editing overlays before hover;
- all nine editable fields registered (description plus value/label for four metrics);
- title has no editable binding;
- metric-label hover produced exactly one tight text overlay;
- click entered `plaintext-only` editing on the production label and Enter rerendered the committed draft value;
- mobile viewport `390px`: production grid remained two columns (`163.2px 163.2px`), with eight metric field bindings, zero idle overlays, and zero reorder handles;
- Edit Mode suppresses the Capacity entrance motion and production card hover motion; Preview/Public defaults remain enabled.

No Capacity section outline, badge, Configure control, toolbar, or form was present. Other legacy sections remain untouched.

## Genericity Audit

| Capability | `home.stats` | `about.capacity` | Runtime |
| --- | --- | --- | --- |
| binding | yes | yes | same |
| hover | yes | yes | same |
| selection | yes | yes | same |
| inline string | label | description/value/label | same |
| numeric edit | value | not applicable | generic value-kind contract |
| reorder | yes | BLOCKED | generic engine unchanged |
| add/remove | BLOCKED | BLOCKED | no invented constraints |

Repository search found no section names or behavior branches in `src/shared/visual-editing`. There is no `CapacityEditor`, `CapacityCardEditor`, or `CapacityMetricEditor`.

## Verification

```text
npm run lint — PASS
npm run build -- --outDir .tmp/phase5a-dist — PASS
live browser desktop/mobile interaction — PASS
verify-about-capacity-genericity.tsx — PASS
```

The standalone script covers resolver propagation, formatted-string preservation, binding identity after order changes, adapter lookup by ID, blocked title/transient identity, and production markup. A process-local `os.userInfo` shim bypassed the environment's `uv_os_get_passwd ENOMEM` startup failure; it does not ship with the application.

## Verdict

```text
PASS WITH BLOCKED CAPABILITIES
```

The second section uses the generic binding, targeting, selection, and inline-edit runtime. Section-specific behavior remains confined to the production model/resolver, binding declarations, and draft mutation adapter.
