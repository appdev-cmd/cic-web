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

## `about.timeline`

- [x] inventory
- [x] semantics
- [x] wiring
- [x] persistent milestone identity in repository snapshots
- [x] bindings
- [x] inline edit — section title, year, visible milestone description
- [BLOCKED] hidden milestone title — no production representation
- [BLOCKED] reorder — capability not declared
- [BLOCKED] add/remove — constraints and factory missing
- [x] visual check

## `about.strategy.coreValues`

- [x] inventory
- [x] semantics
- [x] wiring
- [x] persistent core-value identity in repository snapshots
- [x] bindings
- [x] inline edit
- [BLOCKED] reorder — capability not declared
- [BLOCKED] add/remove — constraints and factory missing
- [x] visual check

## `contact.branches`

- [x] inventory
- [x] semantics
- [x] wiring
- [x] stable slot-key identity
- [x] bindings
- [x] inline edit — title/name/address/phone/email/working hours
- [BLOCKED] fax — CMS destination missing
- [N/A] reorder — fixed branch slots
- [BLOCKED] add/remove — constraints and factory missing
- [x] visual check

## `home.awards`

- [x] inventory
- [x] semantics
- [BLOCKED] wiring — no approved shared Media resolver for `imageId → URL`
- [MISSING] persistent item identity
- [BLOCKED] inline edit/reorder/add/remove
- [ ] full visual acceptance

## `about.awards`

- [x] inventory
- [x] semantics
- [BLOCKED] wiring — separate About ownership still lacks Media resolution and stable item identity
- [BLOCKED] inline edit/reorder/add/remove
- [ ] full visual acceptance

## `about.partners.gallery`

- [x] inventory
- [x] semantics
- [BLOCKED] wiring — no CMS gallery destination
- [BLOCKED] media/reorder/add/remove
- [ ] full visual acceptance

## `about.experience`

- [x] inventory
- [x] semantics
- [BLOCKED] wiring — CMS `categoryKeys[]` does not represent production item rows
- [BLOCKED] inline edit/reorder/add/remove
- [ ] full visual acceptance

## Phase 7 reference sections

### `home.projects`

- [x] entity-ID production wiring
- [x] item-level reference binding
- [x] Replace
- [x] reorder by entity ID
- [BLOCKED] Add/Remove — complete constraints are missing
- [x] visual check

### `home.news`, `home.events`, `home.partners`, `about.partners` references

- [x] inventory/ownership review
- [BLOCKED] production wiring — PageBuilder IDs have no canonical full-entity resolver
- [BLOCKED] reference interaction

### `home.ecosystem`, `about.offerings`

- [x] inventory/ownership review
- [BLOCKED] slot/reference mapping
- [BLOCKED] Replace/reorder/Add/Remove

### `about.software_partners`, `about.hardware_partners`

- [x] inventory review
- [BLOCKED] visual editing — production renderer missing

## Phase 8 complex/media/optional final review

- [x] generic media/action/optional contracts
- [x] Hero/Intro/About Hero review
- [x] CTA/Form ownership review
- [x] Organization SVG review
- [x] Legal rich-text safety review
- [x] blocked-only sections retain existing editor; only implemented direct-edit sections bypass legacy chrome
- [x] final coverage register
- [x] final visual acceptance
- [BLOCKED] media replacement — no complex media field is production-resolver-wired
- [BLOCKED] optional Add/Remove — defaults/removal/layout contracts missing
- [BLOCKED] CTA replacement/editing — CTA entity/destination production resolver missing
- [BLOCKED] Legal rich-text direct editing — sanitization/selection contract missing

Overall verdict: `PASS WITH DOCUMENTED BLOCKERS`.
