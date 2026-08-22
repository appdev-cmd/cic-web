# Visual Editor Section Status

## `home.stats`

- [x] inventory
- [x] semantics
- [x] wiring decision
- [x] resolver PoC
- [x] element binding
- [x] hover targeting
- [x] selection
- [x] inline text editing
- [x] reorder
- [BLOCKED] add/remove
- [x] visual acceptance

The repository mock snapshots now carry persistent Statistics item IDs for this PoC. Migration of externally stored draft/published/history data remains outstanding.

Phase 4E constraint review is documented in `COLLECTION-ADD-REMOVE.md`. Add/Remove remains blocked because no reviewed source defines `minItems`, `maxItems`, empty/overflow behavior, or a valid new-item factory. The four-item fixture and four-column desktop grid are not treated as collection constraints.

Phase 4F visual acceptance is recorded in `HOME-STATS-VISUAL-ACCEPTANCE.md` with verdict `PASS WITH NON-BLOCKING LIMITATIONS`.

## `about.capacity`

- [x] inventory
- [x] semantics
- [x] production wiring
- [x] stable identity for editable items
- [x] element binding
- [x] hover targeting
- [x] selection
- [x] inline editing
- [BLOCKED] title editing — production rich title and plain CMS title do not share an approved contract
- [BLOCKED] reorder — no reviewed machine-readable capability
- [BLOCKED] add/remove — min/max, empty behavior, and creation defaults are unknown
- [ ] full visual acceptance
