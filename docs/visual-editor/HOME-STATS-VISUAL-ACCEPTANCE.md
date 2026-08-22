# Phase 4F — Home Statistics Visual Acceptance

> Scope: visual and interaction cleanup for `home.stats` only. The audit introduced no content capability, Add/Remove behavior, suffix editing, toolbar, menu, or other section coverage.

## Production Baseline

Browser inspection used the CMS Draft Preview as the production-like baseline and the same resolved draft in Edit Mode.

Desktop measurements at the production node level:

```text
section: 1440 × 257.59 px
grid: 1232 × 95.99 px
item: 284 × 95.99 px
layout: 4 columns
```

The value, suffix, label, divider positions, section borders, typography, and section height were unchanged between Preview and idle Edit Mode. Production continues to own `grid-cols-2 md:grid-cols-4`, spacing, font metrics, dividers, and wrapping.

## Idle Edit Mode

**Result: PASS — visual-noise score 0.**

With no pointer target, `home.stats` renders no outline, section frame, label, grip, toolbar, badge, debug visualization, Add slot, or Remove action. The only DOM differences are invisible binding metadata and React refs. The previous section-level editor chrome remains bypassed for this section.

## Hover

### Text fields

**Result: PASS — visual-noise score 1.**

- Value hover resolves only the production Counter text node.
- Label hover resolves only the actual rendered text bounds rather than the label's full-width layout container.
- The overlay uses a transparent background and a low-opacity 1px outline.
- Text fields use the `text` cursor only in Edit Mode.
- Hovering value or label does not expose the reorder grip.

Cleanup performed:

| Problem | Symptom | Change | Why less intrusive |
| --- | --- | --- | --- |
| Label geometry followed its full-width div | A short label appeared to select the whole statistic width | Text bindings now measure their direct text range | The cue follows the words the user intends to edit |
| Text used the default cursor | Editability was not communicated by the native pointer | Added Edit-only `cursor: text` to bound value/label nodes | Uses a browser-native affordance without extra chrome |
| Hover tint was visible on the content | Cue resembled a design-tool box | Removed fill and reduced outline opacity | Typography remains visually untouched |

### Structural item

**Result: PASS — visual-noise score 1.**

Item whitespace shows one contextual grip for the item under the pointer. It does not create an item outline or intercept text targets.

## Selection

**Result: PASS — visual-noise score 1.**

The selected outline is now a transparent 1px treatment around the rendered text bounds. Hover and selection never stack on the same target. Clicking blank canvas clears selection.

Escape cancellation previously left the selected overlay and browser selection visible. The inline session now clears the DOM selection, blurs the production node, and calls the generic `cancelEditing()` state path. No stale overlay remains.

## Inline Editing

**Result: PASS — visual-noise score 1.**

- Click enters editing directly on the production value or label.
- Typography, padding, display, line height, alignment, and grid geometry remain production-owned.
- Editing presents only the caret, native text selection, and subtle selected geometry.
- There is no input rectangle, form label, Save/Cancel control, popup, or toolbar.
- Enter commits through draft → resolver → `HomeView`; blur commits valid content; Escape cancels and clears visual state.
- `motionEnabled = false` remains active, so edited numbers do not animate from zero.

Value and suffix still share one production node. The reviewed Phase 4C value-only decision remains unchanged.

## Reorder

**Result: PASS — visual-noise score 1 while idle/hover, 1.5 while dragging.**

- Reorder starts from the contextual grip, not the text surface.
- The grip was reduced from 28px to 24px and changed from orange admin-button styling to a neutral translucent surface with a lighter shadow.
- The production item remains the drag visual.
- The insertion marker remains outside layout flow and does not reflow the grid.
- Draft order remains authoritative; production DOM is not manually persisted.
- After reorder, bindings remain keyed by persistent item ID, so inline editing continues to target the same semantic item.

No Add, Remove, duplicate, directional controls, or collection toolbar was introduced.

## Responsive

**Result: PASS.**

Desktop was inspected in the four-column production layout. Mobile was inspected in the two-column production layout at a 390px content viewport:

```text
mobile section: approximately 390 × 401.58 px
layout: 2 columns
```

The grid wraps through production CSS. Text geometry remains attached to each rendered node, the contextual grip stays outside document flow, and no editor wrapper changes the section width or height. Scroll and viewport changes continue to update overlay geometry through the existing targeted `ResizeObserver` and scroll/resize listeners.

## Keyboard / Accessibility

**Result: PASS.**

- The contextual grip retains the accessible name `Kéo để sắp xếp chỉ số`.
- Grip cursor states remain `grab` and `grabbing`.
- Keyboard grab/drop and arrow movement remain the Phase 4D behavior.
- Text surfaces expose the text cursor and native caret.
- Escape priority is preserved: active edit cancels first; active drag cancels through its controller; otherwise selection clears.
- Cancel now removes browser text selection and stale focus from the production node.

## Legacy UI Removed

For `home.stats`, the legacy section behavior remains bypassed. Browser inspection confirmed the absence of:

- section outline and section name badge;
- section/context toolbar;
- fixed Edit/Configure controls;
- duplicate hover/selection frames;
- legacy Add slot;
- Remove icon or disabled collection action;
- form, panel, sidebar, or properties UI.

The complete intentional editor visual inventory is:

```text
hover outline
selected/editing outline
native caret/text selection
contextual reorder grip
drag insertion marker
```

## Remaining Blocks

- Add/Remove remains **BLOCKED** because `minItems`, `maxItems`, empty/overflow behavior, and new-item defaults are not approved.
- Suffix editing remains intentionally deferred because value and suffix share one production node.
- External persisted versions without migrated item IDs remain non-sortable/non-editable by identity.
- The standalone TSX verification scripts pass when launched with a process-local `os.userInfo` shim that bypasses this environment's `uv_os_get_passwd ENOMEM` startup failure. The shim is verification-only and does not ship with the application.

## Acceptance Verdict

```text
PASS WITH NON-BLOCKING LIMITATIONS
```

The core question is answered **yes**: in idle and direct interaction states, `home.stats` feels like the production website receiving lightweight targeting behavior rather than a CMS component layered over it. The remaining limitations are explicitly deferred capabilities, not visual acceptance failures.

## Verification Evidence

The live browser review covered:

1. Draft Preview baseline;
2. Edit idle;
3. value hover;
4. label hover with tight text geometry;
5. label editing;
6. numeric value targeting/editing behavior;
7. contextual grip;
8. drag treatment and insertion contract regression;
9. post-reorder identity/inline-edit continuity regression;
10. mobile two-column Edit Mode;
11. Escape cleanup with zero remaining overlays and zero selection ranges.

Verification commands:

```text
npm run lint — PASS
npm run build -- --outDir .tmp/phase4f-dist — PASS
verify-hover-selection-runtime.ts — PASS
verify-inline-text-editing.ts — PASS
verify-direct-reorder.ts — PASS
```

The temporary build output was removed after verification.
