# Final Visual Acceptance

## Audit Method

The final pass compares Preview-like production rendering with Edit Mode in the live CMS canvas at desktop and 390px mobile widths. It audits idle chrome, active target density, responsive geometry, motion policy, navigation interception, stale overlays, keyboard labels, and Preview isolation.

Live results:

| Page | Desktop sections rendered | Legacy actions | Idle overlays | Section outlines | Mobile width |
| --- | ---: | ---: | ---: | ---: | --- |
| Home | 10/10 | 0 | 0 | 0 | `390 / 390` |
| About | 7/7 | 0 | 0 | 0 | `390 / 390` |
| Contact | 4/4 | 0 | 0 | 0 | `390 / 390` |
| Legal | 2/2 | 0 | 0 | 0 | `390 / 390` |

The audit scrolled every section into view before measuring, so production `whileInView` content was exercised rather than judged from an unactivated full-page capture. Draft Preview reported zero overlays and zero `contenteditable` nodes.

## Home Full-page Audit

Home retains production section order and layout. Migrated Statistics and Projects expose only active-target overlays. Blocked Hero, Intro, Awards, Ecosystem, Events, News, Partners, and Contact CTA retain the existing editor until their direct-edit adapters are complete, so Phase 8 does not remove previously working editing. Hero autoplay is frozen in Edit. Project filtering/expansion/navigation are frozen for stable item targeting.

## About Full-page Audit

Timeline, Strategy, and Capacity use explicit bindings and generic inline editing. Other About sections are production-like but inert where wiring/representation is blocked. No Capacity title affordance, SVG child editing, award media action, partner duplicate target, or declared-only section UI appears.

## Contact Full-page Audit

Branch fields retain direct inline editing. Header/Form/Security stay production-like and inert. Visitor input values are not registered as editable content. Branch tabs/map remain derived interaction.

## Legal Audit

The CMS Legal renderer consumes draft data, but arbitrary direct rich-text editing remains blocked. Its existing editor remains available; no unsafe descendant-level content editing is added.

## Edit Idle

For migrated direct-edit sections, target noise is 0 and only explicit production bindings can create interaction overlays. Blocked-only contracts do not suppress the existing editor: preserving working functionality takes precedence until the direct interaction path is complete.

## Hover Density

Target: one direct target plus its actions. Text bindings resolve nearest editable text; Project child content resolves one reference root; blocked complex content resolves nothing. Parent and child outlines do not stack. Geometry observers attach only to hovered/selected/drag targets.

## Inline Editing

Statistics, Capacity, Timeline, Strategy core values, and Contact branches retain production typography and direct `plaintext-only` sessions. No input/form/panel replaces production content. Paste remains plain text and IME Enter is guarded.

## Media Replace

No media action is shown because no reviewed complex media field has resolver-backed production wiring. This is a documented blocker, not an acceptance failure. Entity-owned Project images correctly remain non-editable.

## Reference Replace

`home.projects` remains the proven reference interaction: one card-level target, contextual Replace, ID-only picker result, and production rerender. Child text/image fields have no edit bindings.

## Reorder

Statistics embedded items and Project reference items retain generic ID-based reorder. Grip and insertion marker are fixed overlays outside layout. Other collections remain blocked unless capability is explicitly enabled.

## Optional Slots

No optional plus is rendered because none has an approved creation/removal/layout contract. There are no disabled placeholders or generic `+ Card` controls.

## Mobile

Existing migrated sections retain production breakpoints. Project mobile acceptance confirms all three 342px cards fit inside the 390px section. Active overlays follow actual nodes; blocked complex sections add no mobile controls that could clip or shift layout.

## Preview Parity

`VisualEditingOverlay.enabled` is false outside Edit Mode. Preview/Public contain no overlay, grip, Replace action, insertion marker, optional plus, or contenteditable attribute. Production navigation/motion policies are restored through `motionEnabled: true` and normal `editMode` behavior.

## Accessibility

- Inline sessions support keyboard focus, Enter, Escape, blur, paste, and IME composition.
- Sortable grip exposes `Kéo để sắp xếp mục` and keyboard grab/move/drop/cancel behavior.
- Replace exposes `Thay nội dung tham chiếu`.
- Blocked content creates no focusable dead control.

## Performance

Targeting uses one delegated pointer/click listener at the canvas root. Binding lookup uses WeakMap/Map registries. ResizeObserver and scroll/resize geometry listeners observe active targets only. No MutationObserver, whole-page frame scan, or listener-per-bound-element interaction architecture was added.

## Legacy UI Cleanup

Migrated direct-edit sections bypass section borders, badges, toolbar/configure buttons, DOM-patched media controls, old reference controls, and old collection management blocks. Blocked-only sections retain their existing editor as a compatibility fallback. The direct-edit inventory remains limited to hover/selection outline, caret, grip, contextual Replace, and insertion marker.

## Verdict

| Page | Verdict |
| --- | --- |
| Home | PASS WITH BLOCKED CAPABILITIES |
| About | PASS WITH BLOCKED CAPABILITIES |
| Contact | PASS WITH BLOCKED CAPABILITIES |
| Legal | PASS WITH BLOCKED CAPABILITIES |

```text
OVERALL: PASS WITH DOCUMENTED BLOCKERS
```

Edit Mode remains the production website plus sparse active-target infrastructure. Missing media/CTA/optional/rich-text contracts are visible in coverage documentation, not represented by fake controls.
