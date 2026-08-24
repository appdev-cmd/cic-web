# Final Visual Editor Coverage

> Source reconciliation: `ELEMENT-INVENTORY.md`, `SEMANTIC-MAP.md`, current production JSX, PageBuilder contracts, and rollout reports. Grouped rows enumerate every production element family; no section is omitted.

| Section | Element | Semantic | Final behavior | Status | Blocker |
| --- | --- | --- | --- | --- | --- |
| `home.hero` | slides | embedded collection | STRUCTURAL | BLOCKED | production still uses fixture slides; persistent IDs/reorder contract absent |
| `home.hero` | slide background/mobile image | background image | BLOCKED | BLOCKED | PageBuilder media IDs do not feed production Hero model |
| `home.hero` | title | rich text | BLOCKED | BLOCKED | plain CMS title vs intentional production HTML |
| `home.hero` | subtitle | text | BLOCKED | BLOCKED | complete Hero section model unresolved |
| `home.hero` | primary/secondary CTA | CTA reference | BLOCKED | BLOCKED | CTA IDs do not resolve into production controls |
| `home.hero` | badge/ticker text | embedded/static | BLOCKED | BLOCKED | production fixture/hardcoded ownership unresolved |
| `home.hero` | pagination, gradient, pulse | derived/decorative | DERIVED / DECORATIVE | N/A | no content ownership |
| `home.intro` | highlighted title, paragraphs | rich/text | BLOCKED | BLOCKED | production JSX is hardcoded; title representation differs |
| `home.intro` | thumbnail/video/play state | image/video/derived | BLOCKED / DERIVED | BLOCKED | video URL is not resolver-backed; play state is interaction |
| `home.intro` | primary CTA/profile download | CTA/link | BLOCKED | BLOCKED | CTA/media destinations do not feed production controls |
| `home.stats` | items, value, label | embedded collection/text | INLINE_EDIT / REORDER | PASS | suffix remains shared-node BLOCKED |
| `home.stats` | dividers/motion | decorative/render policy | DECORATIVE | N/A | production-owned |
| `home.awards` | header copy | text | BLOCKED | BLOCKED | section production model incomplete |
| `home.awards` | award image/name/items | embedded image/text | BLOCKED | BLOCKED | media resolver and persistent item identity absent |
| `home.awards` | slider navigation/loop copies | derived interaction | DERIVED | N/A | copies must never become edit targets |
| `home.ecosystem` | heading/subtitle/cards/actions | static/bespoke | BLOCKED | BLOCKED | visible values lack proven slot/entity ownership |
| `home.ecosystem` | Product/Service slots | reference/slot | BLOCKED | BLOCKED | slot-to-reference mapping unresolved; reorder changes roles |
| `home.ecosystem` | search/background/icons | interaction/decorative | DERIVED / DECORATIVE | N/A | not content fields |
| `home.projects` | Project card root | reference item | REFERENCE_REPLACE / REORDER | PASS | Add/Remove constraints blocked |
| `home.projects` | image/title/category/location/client/tags | entity-derived | DERIVED | PASS | deliberately non-editable from landing page |
| `home.projects` | filters/search/ordinal/empty/detail CTA/dialog | interaction/derived/static | STRUCTURAL / DERIVED | N/A | production interaction |
| `home.events` | Event roots | reference items | BLOCKED | BLOCKED | no canonical Event resolver; featured-slot semantics unresolved |
| `home.events` | images/text/metadata/CTA/logo | entity-derived/static | DERIVED / BLOCKED | BLOCKED | current production cards are hardcoded |
| `home.events` | tabs/background/view-all | interaction/decorative/static | STRUCTURAL / DECORATIVE | N/A | not landing-page entity fields |
| `home.news` | News roots | reference items | BLOCKED | BLOCKED | PageBuilder IDs lack canonical News resolver |
| `home.news` | image/category/date/title/desc | entity-derived | DERIVED | BLOCKED | no child inline editing by design |
| `home.news` | categories/empty/view-all | interaction/derived/static | STRUCTURAL / DERIVED | N/A | production interaction |
| `home.partners` | canonical Partner roots | reference items | BLOCKED | BLOCKED | production fixture lacks entity IDs |
| `home.partners` | logo/name | entity-derived | DERIVED | BLOCKED | replace must use Partner picker, not Media picker |
| `home.partners` | marquee duplicates/motion | derived | DERIVED | N/A | duplicate visual copies are not targets |
| `home.contact_cta` | title/description/phone/email/submit copy | section text | BLOCKED | BLOCKED | config does not feed production CTA/form model |
| `home.contact_cta` | form reference | reference | BLOCKED | BLOCKED | Form resolver absent |
| `home.contact_cta` | visitor inputs/submission state | interaction | STRUCTURAL | N/A | never CMS content targets |
| `about.hero` | background image/video | media | BLOCKED | BLOCKED | production media is not resolver-backed |
| `about.hero` | badge/title/subtitle | static/rich text | BLOCKED | BLOCKED | title/media representation contract unresolved |
| `about.hero` | gradients | decorative | DECORATIVE | N/A | no content ownership |
| `about.overview` | title/paragraphs | rich/text | BLOCKED | BLOCKED | production model not wired |
| `about.overview` | image/video/play UI | media/derived | BLOCKED / DERIVED | BLOCKED | media/video resolver absent |
| `about.timeline` | title/year/milestone description | embedded text | INLINE_EDIT | PASS | — |
| `about.timeline` | hidden milestone title | non-visible config | BLOCKED | BLOCKED | no production representation |
| `about.timeline` | connector/dots/motion | decorative | DECORATIVE | N/A | frozen by render policy in Edit |
| `about.strategy` | title/subtitle/vision/mission/core values | section/embedded text | INLINE_EDIT | PASS | reorder/Add/Remove blocked |
| `about.strategy` | icons/background/separators | decorative | DECORATIVE | N/A | production-owned |
| `about.offerings` | Product/Service roots | reference/slot | BLOCKED | BLOCKED | 7 production slots vs 2+4 reference contract unresolved |
| `about.offerings` | card child copy/icons/actions | derived/static | DERIVED / BLOCKED | BLOCKED | ownership unresolved; no child editing |
| `about.awards` | header/items/image/name | embedded media/text | BLOCKED | BLOCKED | About ownership, media resolver, identity absent |
| `about.awards` | slider controls/loop copies | derived | DERIVED | N/A | production interaction |
| `about.partners` | gallery images/hover gradient | embedded/static media/decorative | BLOCKED / DECORATIVE | BLOCKED | no CMS gallery destination |
| `about.partners` | Partner roots/logo/name | reference/derived | BLOCKED / DERIVED | BLOCKED | canonical Partner resolver absent |
| `about.partners` | marquee copies | derived | DERIVED | N/A | not separate edit targets |
| `about.organization` | title/SVG nodes/labels/lines | SVG static/decorative | BLOCKED / DECORATIVE | BLOCKED | no SVG node model or stable IDs |
| `about.capacity` | description/metric value/label | embedded text | INLINE_EDIT | PASS | — |
| `about.capacity` | rich title | rich text | BLOCKED | BLOCKED | structured production title vs plain CMS string |
| `about.capacity` | separator/motion | decorative | DECORATIVE | N/A | production-owned |
| `about.experience` | item image/title/description | embedded/static | BLOCKED | BLOCKED | CMS category keys do not represent production rows |
| `about.software_partners` | entire declared section | reference | BLOCKED | BLOCKED | production renderer missing |
| `about.hardware_partners` | entire declared section | reference | BLOCKED | BLOCKED | production renderer missing |
| `about.contact_cta` | title/description/CTA | text/reference | BLOCKED | BLOCKED | CTA ID does not resolve into production CTA |
| `contact.header` | title/subtitle | section text | BLOCKED | BLOCKED | header model not wired |
| `contact.branches` | title/name/address/phone/email/hours | section/embedded text | INLINE_EDIT | PASS | — |
| `contact.branches` | fax | optional text | BLOCKED | BLOCKED | CMS destination missing |
| `contact.branches` | tabs/map/search query/map URL | slot interaction/derived | STRUCTURAL / DERIVED | PASS | not visible authoring text |
| `contact.form` | form entity/title/submit/success copy | reference/page text | BLOCKED | BLOCKED | Form production resolver/ownership missing |
| `contact.form` | visitor inputs/errors/submission | interaction | STRUCTURAL | N/A | never CMS content |
| `contact.security` | icon/copy/privacy link | decorative/static/link | BLOCKED / DECORATIVE | BLOCKED | page content/destination not wired |
| `legal.header` | category/title/subtitle/date/read time | section text | BLOCKED | BLOCKED | CMS preview consumes draft but direct mutation adapter absent |
| `legal.content` | arbitrary HTML block | rich text | BLOCKED | BLOCKED | safe rich-text selection/sanitization contract absent |
| `privacy.collection` | title/paragraph/list | legal content | BLOCKED | BLOCKED | legacy normalized section; no direct rich-text contract |
| `privacy.usage` | title/paragraph/list | legal content | BLOCKED | BLOCKED | legacy normalized section; no direct rich-text contract |
| `privacy.retention` | title/paragraph/list | legal content | BLOCKED | BLOCKED | legacy normalized section; no direct rich-text contract |
| `privacy.access` | title/paragraph/list | legal content | BLOCKED | BLOCKED | legacy normalized section; no direct rich-text contract |
| `privacy.commitment` | title/paragraph/list | legal content | BLOCKED | BLOCKED | legacy normalized section; no direct rich-text contract |
| `legal.assistance` | title/description/phone/email | static/legal contact | BLOCKED | BLOCKED | public static representation not resolver-backed |

## Final Blocked Register

| Blocker class | Affected areas | Required before enabling |
| --- | --- | --- |
| representation mismatch | Hero/Intro/About Hero/Capacity titles | reviewed structured production title model |
| no production wiring | Hero, Intro, Overview, CTA/Form, Contact header/security | resolver plus section-specific production model |
| no entity resolver | News, Events, Partners | canonical published entity repository |
| missing stable identity | Awards and legacy external snapshots | persisted ID migration |
| missing constraints | embedded/reference Add/Remove | min/max, policy, defaults, layout behavior |
| no media resolver | Awards and complex images/videos | media-ID-to-production-asset boundary |
| slot semantics unresolved | Ecosystem, Offerings, Event variants | stable slot keys and movement/replace rules |
| no renderer | software/hardware partner sections | production representation |
| rich-text safety unknown | Legal HTML | sanitized whole-block rich-text session |
| no CMS destination | About gallery, Experience rows, Branch fax | approved schema/data migration |

## Overall Coverage Verdict

```text
PASS WITH DOCUMENTED BLOCKERS
```

Every production section and element family discovered in Phase 1/2 has an explicit final behavior. BLOCKED content receives no fake direct-edit hover, picker, or optional plus. Its existing editor is retained until a complete resolver-backed replacement is available.
