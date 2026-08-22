# Phase 3A — Wiring Decisions

> Status: architecture decision only. Sources: `ELEMENT-INVENTORY.md`, `SEMANTIC-MAP.md`, and `DATA-WIRING-GAPS.md`. This document does not authorize editor implementation or production wiring changes.

## Chosen Architecture

### Decision

Choose **Option C, a page-content composition boundary before every production view**. It is the generalized form of Option A:

```text
Page content source selector
→ resolvePageContent({ pageType, version, legacyFallback })
→ page-specific production view model
→ existing production view
```

For Home:

```text
PageBuilderVersion / no published source
→ resolvePageContent(...)
→ HomePageModel
→ HomeView({ content, renderPolicy })
```

`WebsitePage` is a caller of this boundary in CMS, not the owner of mapping logic. The public application must call the same boundary before rendering `HomeView`.

### Why this boundary

- `HomeView` already has an embryonic data boundary through `getHomeData()`, but it currently resolves only fixtures.
- Resolving before the view keeps raw PageBuilder config and legacy fallback conditions out of production JSX.
- CMS Edit and Preview can pass the draft version through the same resolver used for published public content.
- The production component continues to own layout, responsive behavior, typography, and motion rendering; it receives only a production-shaped model.

### Explicitly rejected boundary

`HomeView` must not find PageBuilder sections or merge CMS fields with hardcoded values inside JSX. Section-level expressions such as `draft?.value || fixtureValue` are outside the chosen architecture.

## Source Precedence

### Edit

```text
page.draft
→ resolvePageContent
→ HomePageModel
→ HomeView
```

The current working draft is authoritative. Empty strings, zeroes, and empty arrays must not be treated as “missing” through truthy fallback.

### Preview

```text
page.draft
→ resolvePageContent
→ HomePageModel
→ HomeView
```

Preview uses the same draft data and resolver as Edit. The difference is render policy, not content source.

### Public production target

```text
published PageBuilder version selected by page/slug and locale
→ resolvePageContent
→ HomePageModel
→ HomeView
```

The repository currently has PageBuilder `published` versions only inside CMS mock/state. `App.tsx` renders `HomeView` directly and performs no published PageBuilder lookup.

**`PUBLIC_PUBLISHING_BLOCKER`**: public production cannot become PageBuilder-authoritative until a published page lookup/source is supplied to the public application. Phase 3A does not invent that backend or persistence service.

### Transitional public behavior

Until `PUBLIC_PUBLISHING_BLOCKER` is resolved, the public caller has no published version and the resolver returns the legacy production model. This preserves the current website, but CMS publishing must not be described as updating the public site during that transition.

## Resolver Boundary

### Chosen module responsibilities

The future boundary belongs in a shared page-content feature, usable by both CMS preview and the public application:

```text
src/shared/page-content/models.ts
```

- Own production-facing page models such as `HomePageModel`, `HomeStatsModel`, and `HomeStatModel`.
- Contain no React, editor state, PageBuilder controls, or fixture reads.

```text
src/shared/page-content/resolvePageContent.ts
```

- Own page-type dispatch and CMS-to-production mapping.
- Accept a selected `PageBuilderVersion | undefined`, page type, and an explicit legacy fallback provider.
- Validate/narrow raw `PageBuilderConfigValue` before creating typed production models.
- Return resolution diagnostics separately from render content; production JSX must not interpret raw CMS errors.

```text
src/shared/page-content/legacyPageContent.ts
```

- Adapt current fixture providers, including existing `getHomeData()`, into the same production models.
- Be the only legacy fallback source used by the resolver.

### Component contract

`HomeView` receives `HomePageModel`; it must not import raw PageBuilder types, search section keys, resolve entity IDs, or call fixtures after the migration completes.

Render behavior is separate from content:

```ts
type PageRenderPolicy = {
  motionEnabled: boolean;
};
```

The production view receives both `content` and `renderPolicy`. Edit/Preview differences must not alter the resolved content model.

## Legacy Fallback

### Single fallback location

Fallback exists only in `resolvePageContent` and its page/section resolver helpers:

```text
resolvePageContent
└── resolveHomeContent
    └── resolveHomeStats(section, legacyHomeStats)
```

No production JSX fallback is allowed.

### Fallback rules

1. A valid PageBuilder section wins as a complete section source.
2. During migration, if the entire section is absent and migration fallback is explicitly enabled, use the legacy section model.
3. A present but invalid section produces resolver diagnostics; it must not silently mix individual legacy fields into CMS content.
4. If neither a valid section nor legacy source exists, return an explicit safe empty/error model according to the page contract, not scattered hardcoded JSX.
5. Fallback is section-granular, not field-granular.

This prevents hybrid output such as a CMS label combined accidentally with a fixture value.

## PoC

```text
PHASE_3B_POC = home.stats
```

`home.stats` remains the correct proof of concept because it has:

- a small production structure with no reference-entity lookup;
- a confirmed production source (`homeStats`);
- a confirmed CMS source (`config.items[]`);
- one explicit shape mismatch (`val` versus `value`);
- known responsive behavior (2 columns to 4 columns at `md`);
- known motion behavior (`motion.div` entrance plus `Counter` number animation);
- an exposed identity/constraint problem that must be solved correctly before broader collection work.

Hero, Awards, and reference collections are outside the PoC.

## Statistics Contract

### Production model decision

```ts
type HomeStatModel = {
  id: string;
  value: number;
  suffix?: string;
  label: string;
};

type HomeStatsModel = {
  items: readonly HomeStatModel[];
};
```

Rationale:

- `value` is a number because `Counter` currently requires `number` and performs arithmetic.
- `suffix` remains optional because `CounterProps.suffix` is optional.
- `label` remains a required string because production always renders it.
- `id` is required only because a repeatable editable collection needs stable identity; it is not presentation data.
- No style, column count, animation duration, or editor metadata belongs in this content model.

### Mapping contract

```text
CMS config.items[].id     → HomeStatModel.id
CMS config.items[].value  → HomeStatModel.value
CMS config.items[].suffix → HomeStatModel.suffix
CMS config.items[].label  → HomeStatModel.label

legacy homeStats[].val    → HomeStatModel.value
legacy homeStats[].suffix → HomeStatModel.suffix
legacy homeStats[].label  → HomeStatModel.label
```

Legacy fallback IDs are assigned by the legacy adapter only for rendering stability. They do not qualify as persistent CMS item identity and must never be written back as if migration had occurred.

## Statistics Identity

### Decision

Choose **A + C** from Phase 3A's identity choices:

```text
Add a required persistent item ID to CMS config
+ migrate existing draft, published, and history versions
```

The CMS item contract becomes conceptually:

```ts
type HomeStatConfigItem = {
  id: string;
  value: number;
  suffix?: string;
  label: string;
};
```

### Identity rules

- The ID is generated once when an item is created and persisted with the item.
- Migration must assign IDs to every existing item in draft, published, and retained history snapshots.
- IDs must survive edits, reorder, draft save, publish, restore, and cloning of page versions.
- ID must not be derived from array index, label, value, or suffix because all are mutable or positional.
- Array index may still be used for visual iteration, but never as persistent editor identity.

### Current status

`home.stats` reorder remains **BLOCKED** until persistent IDs and migration exist. Phase 3A does not modify the schema or data.

## Statistics Constraints

### Evidence

- Production currently renders four fixture items.
- CMS draft/published mock currently contains four items.
- Registry description says “Bốn chỉ số theo thiết kế hiện tại.”
- Production grid is `grid-cols-2 md:grid-cols-4`.
- Neither `SectionDefinition`, `draftSectionSchemas`, `PageBuilderSection`, nor a validator declares machine-readable `minItems` or `maxItems` for `home.stats.items`.

The number four is therefore a current fixture/design observation, not an enforceable collection constraint.

### Decision table

| Constraint | Decision |
| --- | --- |
| `minItems` | UNKNOWN — constraint contract missing |
| `maxItems` | UNKNOWN — constraint contract missing |
| `canAdd` | BLOCKED until min/max and empty/overflow behavior are declared |
| `canRemove` | BLOCKED until minimum and empty-state behavior are declared |
| `canReorder` | BLOCKED until persistent item IDs are migrated; layout itself does not prohibit reorder |

### Future declaration location

Collection constraints should be machine-readable in the section registry, alongside existing section capabilities, keyed by collection path—for example a future `collectionConstraints.items` entry on `sectionDefinitions['home.stats']`. Draft schema labels and prose descriptions are not constraint sources.

Phase 3A does not choose numeric min/max without evidence and does not implement the registry extension.

## Motion Contract

### Decision

Use a content-independent render policy:

```ts
type PageRenderPolicy = {
  motionEnabled: boolean;
};
```

Policy values:

| Mode | `motionEnabled` |
| --- | --- |
| Edit | `false` |
| Preview | `true` |
| Public production | `true` |

For the Counter boundary, the minimal future API is:

```ts
type CounterProps = {
  value: number;
  suffix?: string;
  motionEnabled?: boolean; // default true
};
```

When `motionEnabled` is false, Counter must render the final formatted value immediately and schedule no `requestAnimationFrame`. The same policy must suppress the surrounding statistics `motion.div` entrance/hover motion; freezing only the number while the card animates would not satisfy Edit Mode.

Defaulting to `true` preserves current Preview/Public behavior. The generic policy name avoids coupling production components to `editMode` or CMS concepts.

## Blocking Decisions

### Must be resolved before Phase 3B production wiring can be complete

1. **`PUBLIC_PUBLISHING_BLOCKER`** — define how the public application obtains the published PageBuilder version by page/slug and locale.
2. **Persistent Statistics identity migration** — add and backfill item IDs across draft, published, and history snapshots.
3. **Machine-readable Statistics constraints** — decide min/max and empty/overflow behavior before enabling Add/Remove; do not infer `maxItems = 4` from the visual grid.
4. **Resolver diagnostics policy** — decide how invalid present CMS data is surfaced while avoiding silent field-level legacy mixing.

### Not blocking the narrow resolver PoC, but still intentionally unresolved

- Backend/API/storage mechanism for published pages.
- Resolver contracts for Hero, Awards, Legal, and all reference collections.
- General entity resolver for Product, Service, Project, Event, News, and Partner.
- Wider motion policy adoption beyond `home.stats`.

## Phase 3A answers

1. Draft enters production through `resolvePageContent` before the production view.
2. Resolver and production models live in a shared page-content boundary, not in `PageBuilderVisualCanvas` or `HomeView` JSX.
3. `HomeView` receives `HomePageModel`; Statistics uses `HomeStatsModel`.
4. Legacy fallback exists only inside resolver helpers and is section-granular.
5. Statistics uses a persisted item ID added by schema/data migration; array index is rejected.
6. Statistics Add/Remove/Reorder remain blocked until constraints and identity migration are complete.
7. Future Edit Mode freezes Counter and its surrounding motion through `PageRenderPolicy.motionEnabled = false` and a default-true Counter prop.
8. Public published lookup, identity migration, and machine-readable collection constraints are blockers before complete wiring.

**Stop after Phase 3A. Do not proceed to Phase 3B without review.**
