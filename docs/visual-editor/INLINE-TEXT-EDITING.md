# Phase 4C — Inline Text Editing

> Scope: `home.stats` only. The production text nodes remain the editing surface; this phase adds no form, toolbar, panel, collection action, or other section coverage.

## Editing Lifecycle

An editable binding is resolved from the clicked production node. A single click selects it and starts a local editing session on that same node using `contenteditable="plaintext-only"`. Typography, classes, display, width, padding, and production layout remain unchanged. Transient typing stays in the DOM session; it is not the content source of truth.

While a session is active, hover targeting is frozen and selection remains attached to its binding ID. Successful commit updates the PageBuilder draft, then the existing resolver and `HomeView` render the authoritative value again.

## Commit / Cancel

- `Enter` commits single-line content and never inserts a newline.
- Blur/click outside commits a valid value.
- `Escape` restores the pre-edit production display and does not mutate the draft.
- Invalid numeric content does not commit and keeps the production node in its editing session.
- No per-field Save/Cancel buttons are rendered.

The generic mutation request records `binding`, `before`, and `after`, leaving a clean boundary for the existing PageBuilder history mechanism.

## Draft Mutation Path

```text
production node
→ EditableElementBinding
→ persistent itemId lookup
→ home.stats config item field
→ onConfigValueChange
→ PageBuilder draft
→ resolvePageContent
→ HomeStatsModel
→ existing HomeView Statistics JSX
```

The adapter finds the collection item by persistent `id`; it only derives the immutable update path after that identity lookup. A missing or transient `unpersisted-home-stat-*` identity is rejected rather than persisted by array position. Repository mock draft/published snapshots were backfilled with stable IDs for the PoC; external stored versions still require the migration recorded in the wiring decisions.

## Numeric Value Contract

`value` edits keep a transient string so intermediate input such as an empty string or `-` does not corrupt the draft. Commit accepts only a complete finite decimal representation and converts it to `number`. Zero is preserved as `0`; no truthy fallback is used. No minimum, maximum, or non-negative rule is invented because the current schema/validator defines only a finite number.

## Shared Counter Decision

```text
COUNTER_SHARED_NODE_DECISION = B
```

The production Counter exposes value and suffix in one text node, so Phase 4C edits `value` only. Its suffix remains fixed and visible during editing. The runtime does not infer click position or claim separate suffix geometry. Editing suffix remains blocked pending a separately reviewed production representation decision.

## Paste / IME Handling

Paste is intercepted and inserted as plain text, preventing HTML descendants or inline styles from entering production typography. Composition state is tracked: Enter during Vietnamese/Japanese/Chinese IME composition does not commit, and the PageBuilder draft is updated only after the editing session finishes.

## Visual Contract

- Idle and hover remain the Phase 4B production-like states.
- Editing adds only the native caret and the existing subtle selected overlay.
- No input chrome, field label, bubble, toolbar, padding, or layout wrapper appears.
- Edit Mode continues to pass `motionEnabled = false`, so Counter renders the final value and does not restart from zero after commit.

## Known Limitations

- Suffix editing is unavailable because value and suffix share one production text node.
- External persisted PageBuilder versions without item IDs cannot be inline-edited safely until migrated.
- Add, Remove, Reorder, collection constraints, and all sections other than `home.stats` remain outside this phase.
