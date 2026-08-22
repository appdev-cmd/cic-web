# Visual Editor Data Wiring Gaps

> Phase 2 only. This register separates persistence/data-contract problems from future editor implementation. No adapter, schema change, production refactor, or editing UI is proposed here.

## Critical

### C1 — PageBuilder draft does not feed Home/About/Contact production views

`PageBuilderVisualCanvas` selects `HomeView`, `AboutView`, or `ContactView` from `page.pageType` but passes no `section.config` or `section.references`. The views render hardcoded JSX and fixtures. Consequently, editing a draft field can persist inside PageBuilder data without changing the actual production value.

Affected scope: all Home sections, all rendered About/Organization/Capacity sections, and all Contact sections.

Required decision before implementation: establish a single production read contract for section config/references. Phase 2 does not choose or build it.

### C2 — Legal preview and public legal pages use different read models

CMS preview renders normalized `legal.header` and `legal.content`. Public routes render static props/React nodes through `PrivacyPolicyView`, `TermsOfUseView`, and `LegalArticleLayout`. A draft can therefore look correct in CMS preview while public output remains unchanged.

Affected scope: `legal.header`, `legal.content`, all `privacy.*` legacy keys, and `legal.assistance`.

### C3 — Reference IDs are stored but not resolved into production entities

The PageBuilder model contains ordered `entityIds`, but production cards use unrelated inline/fixture arrays. There is no verified reference resolver/adapter from PageBuilder section to production card input.

Affected entities: Product, Service, Project, Event, News, Partner.

### C4 — No stable identity for many embedded collections

Slides, awards, statistics, timeline milestones, capacity metrics, gallery entries, organization nodes, experience rows, legal blocks, and several text arrays are index-addressed. Reorder/update operations could target the wrong item after concurrent or prior structural changes.

### C5 — CMS schema describes fields that production does not render

Examples include `home.intro.eyebrow`, `home.intro.imageId`, `about.overview.imageId`, `about.experience.title/categoryKeys`, `contact.form.successTitle/successMessage`, and `contact.security.policyPageId`. These are persistence destinations without a production representation.

## Reference wiring

| Section | Entity | CMS reference exists | Production consumes reference | Actual production source | Production card/shape | Identity | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `home.ecosystem` | Product | yes, max 4 | no | hardcoded bespoke cards | mixed Bento variants | slot stable; entity mapping absent | MISMATCH |
| `home.ecosystem` | Service | yes, max 3 | no | hardcoded bespoke cards | mixed Bento variants | slot stable; entity mapping absent | MISMATCH |
| `home.projects` | Project | yes, max 3 | no | `projects` fixture | inline project card | `project.id` available | UNWIRED |
| `home.events` | Event | yes, max 4 | no | fixed featured + three inline cards | two incompatible variants | production IDs incomplete | UNWIRED |
| `home.news` | News | yes, max 3 | no | `newsItems` fixture | inline news card | production item has no ID | UNWIRED |
| `home.partners` | Partner | yes, max 12 | no | `partners` fixture | marquee logo card | production item has no ID | UNWIRED |
| `about.offerings` | Product | yes, max 2 | no | seven inline offering cards | icon/title/description | production item has no ID | MISMATCH |
| `about.offerings` | Service | yes, max 4 | no | same seven inline cards | icon/title/description | production item has no ID | MISMATCH |
| `about.partners` | Partner | yes, max 12 | no | `partners` fixture | marquee logo card | production item has no ID | UNWIRED |
| `about.software_partners` | Partner | yes, max 12 | no renderer | unused fixture | none found | entity ID only | UNKNOWN |
| `about.hardware_partners` | Partner | yes, max 12 | no renderer | unused fixture | none found | entity ID only | UNKNOWN |

### Reference-specific mismatches

- `home.ecosystem`: seven stable presentation slots exist, but the contract does not bind a slot to an entity ID/type or state whether slot title/description override entity fields.
- `home.events`: production has a featured variant plus secondary variant; reference order-to-variant mapping is not implemented.
- `about.offerings`: registry permits 2 Product + 4 Service references (six total), while production renders seven cards.
- `home.news` and both rendered Partner marquees: fixture types do not expose stable entity IDs, so production identity cannot be reconciled with CMS IDs.
- Reference card child values remain entity-owned. Landing-page fields must not be invented for title/image/excerpt merely because those values are visible.

## Static-unwired content

The following production content is hardcoded/fixture-backed and has a plausible editing use case, but either has no CMS destination or the destination is not consumed.

| Section | Static-unwired production content | Existing destination | Gap |
| --- | --- | --- | --- |
| `home.hero` | slide media/title/subtitle, badge, actions, ticker | parallel slide/badge/ticker config | source/shape mismatch; CTA/media resolution absent |
| `home.intro` | title, paragraphs, CTA, profile link, video | parallel config | production does not consume it |
| `home.stats` | four metrics | `config.items[]` | `val` vs `value`; no runtime feed |
| `home.awards` | title/subtitle and award fixture | parallel config | fixture uses `img`; CMS uses `imageId` |
| `home.ecosystem` | section heading and seven bespoke cards | config slots + references | slot/reference contract absent |
| `home.projects` | heading | title/subtitle config | not consumed |
| `home.events` | heading and all event presentation | config + Event refs | not consumed |
| `home.news` | heading | title/subtitle config | not consumed |
| `home.partners` | heading | title/subtitle config | not consumed |
| `home.contact_cta` | rich heading, contact details, form labels/options | config + form ID | local form ignores form entity/config |
| `about.hero` | image, video, badge, rich title, subtitle | only title/subtitle/image config | partial destination and no feed |
| `about.overview` | title, three paragraphs, video | parallel config | not consumed; CMS image has no production slot |
| `about.timeline` | badge/title/description and five milestones | partial parallel config | item count/name mismatch and unused milestone title |
| `about.strategy` | all strategy copy and illustration | partial config | headings/icons/image lack typed destinations; config not consumed |
| `about.awards` | title/subtitle/description and shared Home awards | separate About config | shared fixture conflicts with page ownership |
| `about.partners` | title/subtitle/description and four gallery images | heading + Partner refs only | gallery/description have no destination |
| `about.organization` | title and SVG node labels | title only | topology/labels are code-owned with no content model |
| `about.capacity` | rich title/description/four metrics | parallel config | not consumed; rich/plain mismatch |
| `about.experience` | three image/title/description rows | title/category keys only | no item destination |
| `about.contact_cta` | fixed link and label | CTA ID + unused title/description | link/entity mismatch |
| `contact.header` | title/subtitle | parallel config | not consumed |
| `contact.branches` | title and branch data | partial branch config | field mismatch and no runtime feed |
| `contact.form` | title, field definitions, submit/success copy | form ID + labels | form entity unresolved; copy not consumed |
| `contact.security` | title/description and missing policy link | parallel config/page ID | config not consumed; link absent |
| public legal | all header/content/assistance copy | normalized PageBuilder legal config | different renderer/read model |

## Schema mismatch

| Area | Production shape | CMS shape | Status |
| --- | --- | --- | --- |
| Hero title | HTML string rendered as rich text | plain `title` | MISMATCH |
| Hero media | direct URL `img` | `backgroundImageId` + `mobileImageId` | MISMATCH |
| Hero CTA | fixed navigation/action label | CTA IDs per slide | MISMATCH |
| Home intro profile | fixed external flipbook link | `downloadMediaId` | MISMATCH |
| Statistics | `val/suffix/label` | `value/suffix/label` | MISMATCH |
| Awards | `img/name` | `imageId/name` | MISMATCH |
| Ecosystem | seven bespoke card variants | seven slots plus split Product/Service references | MISMATCH |
| Events | featured + three secondary hardcoded shapes | ordered Event IDs | MISMATCH |
| About timeline | five `{year,title,desc}`, title hidden | four `{year,title,description}` in mock | MISMATCH |
| About offerings | seven inline items | max six references | MISMATCH |
| About capacity title | rich JSX | plain text | MISMATCH |
| About experience | three embedded rows | title + category key list | MISMATCH |
| Contact branches | `tel`, optional `fax`, `searchQuery`, `mapUrl` | `phone`, no fax/searchQuery, `mapUrl` | MISMATCH |
| Contact submit copy | label changes with local submitting state | one static `submitLabel` | MISMATCH |
| Legal | typed legacy sections/public React nodes | normalized HTML blob | MISMATCH |

## Identity gaps

| Collection | Current identity | Gap |
| --- | --- | --- |
| `home.hero.slides[]` | array index | UNSTABLE |
| `home.hero.tickerItems[]` | array index/string | UNSTABLE |
| `home.intro.paragraphs[]` | array index | UNSTABLE |
| `home.stats.items[]` | array index | UNSTABLE |
| `home.awards.items[]` | array index | UNSTABLE |
| `home.events.secondary[]` | array index | UNSTABLE |
| production `home.news.news[]` | array index; entity ID absent | UNSTABLE |
| production `home.partners.partners[]` | array index; entity ID absent | UNSTABLE |
| `about.overview.paragraphs[]` | array index | UNSTABLE |
| `about.timeline.milestones[]` | array index; year not declared unique | UNSTABLE |
| `about.strategy.coreValues[]` | array index/string | UNSTABLE |
| production `about.offerings.items[]` | array index; entity ID absent | UNSTABLE |
| `about.awards.items[]` | array index | UNSTABLE |
| `about.partners.gallery[]` | array index | UNSTABLE |
| production `about.partners.partners[]` | array index; entity ID absent | UNSTABLE |
| `about.organization.chart.nodes[]` | JSX order | UNSTABLE |
| `about.organization.labelLines[]` | JSX order | UNSTABLE |
| `about.capacity.metrics[]` | array/card index | UNSTABLE |
| `about.experience.items[]` | JSX order | UNSTABLE |
| legacy `privacy.*.blocks[]` | array index | UNSTABLE |
| public privacy paragraph/item arrays | React/array order | UNSTABLE |

Stable identities proven:

- PageBuilder reference collections use entity IDs.
- Production Projects expose `project.id`.
- Ecosystem slots expose `slotKey`, although reference binding is missing.
- Contact branches expose stable object/config keys.
- Runtime form fields use stable field keys but are interaction state, not landing-page collection content.

## Unknowns requiring a contract decision

- Rich-text sanitization and supported descendant set for `legal.content.richTextHtml`.
- Whether media IDs are opaque library IDs or may legally contain direct paths (the mock contains paths).
- CTA entity resolution and which presentation fields belong to CTA versus the section.
- Form entity resolution for `home.contact_cta` and `contact.form`.
- Entity DTOs used by the future reference resolver, especially Event and Partner identity.
- Renderer/layout for the declared-only software/hardware partner sections.
- Minimum item counts and empty-state behavior for most embedded collections.
- Whether production hardcoded content without a schema destination should become configurable or remain intentionally code-owned.

## Phase boundary

No item in this file authorizes editor implementation. Critical wiring and ownership decisions must be resolved before an editing eligibility marked `BLOCKED` can become `YES`.
