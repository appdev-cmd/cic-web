# Visual Editor Semantic & Data Wiring Map

> Phase 2 only. Source of truth: [`ELEMENT-INVENTORY.md`](./ELEMENT-INVENTORY.md). This document classifies production semantics and persistence wiring; it does not define or implement editor UI.

## Contract rules

- `Production source` names the value actually read by the rendered production component.
- `CMS destination` names the existing draft field/reference only; it is not proof of runtime wiring.
- Wiring is one of `WIRED`, `PARTIAL`, `UNWIRED`, `MISMATCH`, `UNKNOWN`.
- Editing eligibility is one of `YES`, `NO`, `BLOCKED`, `UNKNOWN`.
- `BLOCKED` means the content is a plausible editing target but the current production/CMS path cannot persist it safely.
- Child fields of a reference entity are `derived` in the landing page: the page owns the entity reference, not the card's title/image/excerpt.

## Architecture-level wiring

```text
PageBuilderPage.draft.sections
→ PageBuilderEditor
→ PageBuilderVisualCanvas
→ page-type production view (HomeView / AboutView / ContactView)
→ hardcoded JSX and src/web/data fixtures
```

The Home, About, Organization, Capacity/Experience, and Contact production views receive neither `section.config` nor `section.references`. Matching occurs after render through `data-page-builder-section-key`; therefore field-name similarity is not runtime wiring.

Legal has two paths:

```text
CMS preview → local LegalPage(draft sections)
Public route → PrivacyPolicyView / TermsOfUseView → LegalArticleLayout(static React content)
```

The CMS path consumes normalized `legal.header`/`legal.content`; the public path does not. These elements are classified `MISMATCH`/`BLOCKED` for production-safe editing.

## `home.hero`

| Element | Semantic | Ownership | Production source | CMS destination | Wiring | Editable candidate |
| --- | --- | --- | --- | --- | --- | --- |
| `slides[]` | collection | static-unwired | `heroSlides` | `config.slides[]` | MISMATCH | BLOCKED |
| `slides[] item` | embedded-item | static-unwired | `HeroSlide` | `config.slides[]` item | MISMATCH | BLOCKED |
| `slides[].img` | background-image | static-unwired | `HeroSlide.img` | `config.slides[].backgroundImageId` | MISMATCH | BLOCKED |
| `slides[].title` | rich-text | static-unwired | `HeroSlide.title` HTML | `config.slides[].title` text | MISMATCH | BLOCKED |
| `slides[].sub` | text | static-unwired | `HeroSlide.sub` | `config.slides[].subtitle` | UNWIRED | BLOCKED |
| `badge` | text | static-unwired | hardcoded badge | `config.badge` | UNWIRED | BLOCKED |
| `primaryAction` | cta | static-unwired | hardcoded Products navigation | `config.slides[].primaryCtaId` | MISMATCH | BLOCKED |
| `secondaryAction` | cta | static-unwired | hardcoded About navigation | `config.slides[].secondaryCtaId` | MISMATCH | BLOCKED |
| `paginationDots[]` | interaction-only | interaction-only | derived from slide count/state | — | WIRED | NO |
| `tickerItems[]` | collection | static-unwired | `marqueeTexts` | `config.tickerItems[]` | UNWIRED | BLOCKED |
| `tickerItems[] item` | text | static-unwired | `marqueeTexts[]` | `config.tickerItems[]` item | UNWIRED | BLOCKED |
| `tickerBadge` | text | static-unwired | hardcoded `HOT NEWS` | — | UNWIRED | BLOCKED |
| `backgroundGradient` | decorative | decorative | JSX gradient layer | — | WIRED | NO |

### Collection Contract

```text
slides: repeatable yes; identity UNSTABLE (array index); minItems UNKNOWN; maxItems UNKNOWN; fixedCount no evidence; wrap no; overflow one active slide; carousel yes; responsive same four source slides.
tickerItems: repeatable yes; identity UNSTABLE (array index); min/max UNKNOWN; nowrap marquee; hidden below md.
```

### Motion

`autoplay` slide every 6 seconds; slide `transition`; ticker `marquee`; badge pulse/bell `animation`.

### Unresolved

- No adapter maps media/CTA IDs to the production `HeroSlide` model.
- Production rich HTML title and CMS plain title have incompatible representation.

## `home.intro`

| Element | Semantic | Ownership | Production source | CMS destination | Wiring | Editable candidate |
| --- | --- | --- | --- | --- | --- | --- |
| `title` | rich-text | static-unwired | hardcoded JSX heading | `config.title` text | MISMATCH | BLOCKED |
| `paragraphs[]` | collection | static-unwired | two hardcoded paragraphs | `config.paragraphs[]` | UNWIRED | BLOCKED |
| `paragraphs[] item` | text | static-unwired | hardcoded paragraph | `config.paragraphs[]` item | UNWIRED | BLOCKED |
| `primaryCTA` | cta | static-unwired | hardcoded About navigation | `config.primaryCtaId` | MISMATCH | BLOCKED |
| `profileLink` | link | static-unwired | fixed flipbook URL | `config.downloadMediaId` | MISMATCH | BLOCKED |
| `video.thumbnail` | image | derived | YouTube URL derived from video | — | WIRED | NO |
| `video.url` | video | static-unwired | fixed YouTube embed URL | `config.videoUrl` | UNWIRED | BLOCKED |
| `video.playControl` | interaction-only | interaction-only | local `isVideoPlaying` | — | WIRED | NO |
| `eyebrow` | optional-slot | section-config | not rendered | `config.eyebrow` | UNWIRED | BLOCKED |
| `image` | optional-slot | section-config | not rendered | `config.imageId` | UNWIRED | BLOCKED |

### Collection Contract

```text
paragraphs: repeatable yes; identity UNSTABLE; min/max UNKNOWN; vertical flow; one-column content.
```

### Motion

Play control pulse `animation`; thumbnail-to-iframe state transition.

### Unresolved

- Whether profile download should resolve a Media entity or remain an external link is not specified.

## `home.stats`

| Element | Semantic | Ownership | Production source | CMS destination | Wiring | Editable candidate |
| --- | --- | --- | --- | --- | --- | --- |
| `items[]` | collection | embedded | `homeStats` fixture | `config.items[]` | MISMATCH | BLOCKED |
| `items[] item` | embedded-item | embedded | `homeStats[]` | `config.items[]` item | MISMATCH | BLOCKED |
| `items[].val` | text | embedded | `homeStats[].val` | `config.items[].value` | MISMATCH | BLOCKED |
| `items[].suffix` | text | embedded | `homeStats[].suffix` | `config.items[].suffix` | UNWIRED | BLOCKED |
| `items[].label` | text | embedded | `homeStats[].label` | `config.items[].label` | UNWIRED | BLOCKED |

### Collection Contract

```text
repeatable: schema yes; identity UNSTABLE; minItems UNKNOWN; maxItems UNKNOWN; production fixture count 4; fixedCount described as 4 but not type-enforced; wrap grid; responsive 2 columns → 4 at md.
```

### Motion

Counter `animation` from zero over 2 seconds.

### Unresolved

- Registry describes four metrics, but no runtime/schema validator enforces exactly four.

## `home.awards`

| Element | Semantic | Ownership | Production source | CMS destination | Wiring | Editable candidate |
| --- | --- | --- | --- | --- | --- | --- |
| `title` | text | static-unwired | hardcoded `SectionHeader` prop | `config.title` | UNWIRED | BLOCKED |
| `subtitle` | text | static-unwired | hardcoded `SectionHeader` prop | `config.subtitle` | UNWIRED | BLOCKED |
| `items[]` | collection | embedded | `homeAwards` fixture | `config.items[]` | MISMATCH | BLOCKED |
| `items[] item` | embedded-item | embedded | award fixture item | `config.items[]` item | MISMATCH | BLOCKED |
| `items[].img` | image | embedded | fixture `img` | `config.items[].imageId` | MISMATCH | BLOCKED |
| `items[].name` | text | embedded | fixture `name` | `config.items[].name` | UNWIRED | BLOCKED |
| `navigation` | interaction-only | interaction-only | slider state | — | WIRED | NO |
| `extendedAwards` | derived | derived | three copies of source array | — | WIRED | NO |

### Collection Contract

```text
repeatable: yes; identity UNSTABLE; min/max UNKNOWN; loop duplicates are derived; carousel yes; responsive items/page 1/2/3/4/5 at <480/480/640/768/1024.
```

### Motion

Carousel `autoplay`; transform `transition`; touch swipe; autoplay pauses on hover/`paused`.

## `home.ecosystem`

| Element | Semantic | Ownership | Production source | CMS destination | Wiring | Editable candidate |
| --- | --- | --- | --- | --- | --- | --- |
| `title` | text | static-unwired | hardcoded JSX | `config.title` | UNWIRED | BLOCKED |
| `subtitle` | text | static-unwired | hardcoded JSX | `config.subtitle` | UNWIRED | BLOCKED |
| `search` | interaction-only | interaction-only | uncontrolled input without filtering | — | PARTIAL | NO |
| `featureCard` | reference-item | reference | hardcoded AI card | Product reference + `config.slots[]` | MISMATCH | BLOCKED |
| `featureCard.badge` | text | derived | hardcoded card | Product/slot-derived | MISMATCH | NO |
| `featureCard.icon` | icon | derived | `BIMIcon` | Product/slot-derived | MISMATCH | NO |
| `featureCard.title` | text | derived | hardcoded card | Product/slot-derived | MISMATCH | NO |
| `featureCard.description` | text | derived | hardcoded card | Product/slot-derived | MISMATCH | NO |
| `featureCard.action` | cta | derived | hardcoded Products navigation | Product reference | MISMATCH | NO |
| `bimCard` | reference-item | reference | hardcoded service card | Service reference + `config.slots[]` | MISMATCH | BLOCKED |
| `compactCards[]` | collection | reference | four inline objects | Product/Service references + `config.slots[]` | MISMATCH | BLOCKED |
| `compactCards[] item` | reference-item | reference | inline object | entity reference keyed by slot | MISMATCH | BLOCKED |
| `compactCards[].title` | text | derived | inline object | referenced entity | MISMATCH | NO |
| `compactCards[].desc` | text | derived | inline object | referenced entity | MISMATCH | NO |
| `industryCard` | reference-item | reference | hardcoded industry card | Product/Service reference + slot | MISMATCH | BLOCKED |
| `industryCard.icon` | icon | derived | `Globe` | referenced entity/slot | MISMATCH | NO |
| `industryCard.title` | text | derived | hardcoded | referenced entity/slot | MISMATCH | NO |
| `industryCard.description` | text | derived | hardcoded | referenced entity/slot | MISMATCH | NO |
| `industryCard.action` | cta | derived | Products navigation | referenced entity | MISMATCH | NO |
| `backgroundLayer` | decorative | decorative | slate overlay | — | WIRED | NO |

### Collection Contract

```text
slots: repeatable yes; identity stable `slotKey`; production expects 7 bespoke positions; CMS reference limits Product=4, Service=3; minItems UNKNOWN; maxItems 7 by registry split; wrap fixed Bento grid; responsive 1 → 2 → asymmetric 12-column.
references: identity entity ID; selection order is array order; production does not consume it.
```

### Motion

Card hover `transition`/transform; no collection autoplay.

### Unresolved

- No proven mapping from each `slotKey` to one reference ID or entity type.
- Slot `title/description` duplicates possible entity presentation but ownership precedence is undefined.
+
## `home.projects`

| Element | Semantic | Ownership | Production source | CMS destination | Wiring | Editable candidate |
| --- | --- | --- | --- | --- | --- | --- |
| `title` | text | static-unwired | hardcoded header | `config.title` | UNWIRED | BLOCKED |
| `subtitle` | text | static-unwired | hardcoded header | `config.subtitle` | UNWIRED | BLOCKED |
| `tabs[]` | interaction-only | interaction-only | inline category list | — | WIRED | NO |
| `search` | interaction-only | interaction-only | local filter state | — | WIRED | NO |
| `projects[]` | collection | reference | `projects` fixture | Project references | UNWIRED | BLOCKED |
| `projects[] item` | reference-item | reference | Project fixture entity | `references[project].entityIds[]` | UNWIRED | BLOCKED |
| `projects[].img` | image | derived | Project entity `img` | Project entity | UNWIRED | NO |
| `projects[].category/type` | text | derived | entity fields/fallback | Project entity | UNWIRED | NO |
| `projects[].location` | text | derived | Project entity | Project entity | UNWIRED | NO |
| `projects[].name` | text | derived | Project entity | Project entity | UNWIRED | NO |
| `projects[].short` | text | derived | entity `short` or name | Project entity | UNWIRED | NO |
| `projects[].client` | text | derived | optional entity field | Project entity | UNWIRED | NO |
| `projects[].tags[]` | collection | derived | entity tags, first two | Project entity | UNWIRED | NO |
| `projects[].ordinal` | derived | derived | visible array index | — | WIRED | NO |
| `projects[].detailCTA` | cta | interaction-only | hardcoded label/action | — | WIRED | NO |
| `emptyState` | derived | derived | filtered result count | — | WIRED | NO |
| `viewAllCTA` | cta | interaction-only | hardcoded Projects navigation | — | WIRED | NO |
| `detailDialog` | interaction-only | interaction-only | `selectedProject` state | — | PARTIAL | NO |

### Collection Contract

```text
projects: repeatable yes; identity stable project.id/entity ID; minItems UNKNOWN; maxItems registry 3 and production slice(0,3); stack below md, flex row at md; hover changes flex width.
tags: entity-owned; identity string/index; display max 2.
```

### Motion

Card `hover-layout-change`, image/overlay `transition`, optional dialog transition.

## `home.events`

| Element | Semantic | Ownership | Production source | CMS destination | Wiring | Editable candidate |
| --- | --- | --- | --- | --- | --- | --- |
| `title` | text | static-unwired | hardcoded header | `config.title` | UNWIRED | BLOCKED |
| `subtitle` | text | static-unwired | hardcoded header | `config.subtitle` | UNWIRED | BLOCKED |
| `tabs[]` | interaction-only | interaction-only | inline state tabs | — | PARTIAL | NO |
| `events[]` | collection | reference | fixed featured + secondary cards | Event references | UNWIRED | BLOCKED |
| `events[] item` | reference-item | reference | hardcoded event data | `references[event].entityIds[]` | UNWIRED | BLOCKED |
| `featured.image` | image | derived | fixed URL | Event entity | UNWIRED | NO |
| `featured.status` | text | derived | hardcoded | Event entity | UNWIRED | NO |
| `featured.logo` | image | derived | `/logo.png` | Event entity/branding | UNKNOWN | NO |
| `featured.title` | text | derived | hardcoded | Event entity | UNWIRED | NO |
| `featured.description` | text | derived | hardcoded | Event entity | UNWIRED | NO |
| `featured.dateTime` | text | derived | hardcoded | Event entity | UNWIRED | NO |
| `featured.location` | text | derived | hardcoded | Event entity | UNWIRED | NO |
| `featured.registrationCTA` | cta | interaction-only | fixed event ID | selected Event entity | UNWIRED | NO |
| `secondary[]` | collection | reference | inline array of three | remaining Event references | UNWIRED | BLOCKED |
| `secondary[] item` | reference-item | reference | inline object | Event entity ID | UNWIRED | BLOCKED |
| `secondary[].img` | image | derived | inline object | Event entity | UNWIRED | NO |
| `secondary[].title` | text | derived | inline object | Event entity | UNWIRED | NO |
| `secondary[].date` | text | derived | inline object | Event entity | UNWIRED | NO |
| `secondary[].loc` | text | derived | inline object | Event entity | UNWIRED | NO |
| `viewAllCTA` | cta | interaction-only | hardcoded Events navigation | — | WIRED | NO |
| `techGrid` | decorative | decorative | background layer | — | WIRED | NO |

### Collection Contract

```text
events: repeatable yes; CMS identity entity ID; production hardcoded cards have no common stable ID; minItems UNKNOWN; maxItems registry 4; fixed 1 featured + 3 secondary; single column → 7/12 + 5/12 at lg.
secondary: identity UNSTABLE; fixedCount 3 in current JSX.
```

### Motion

Card hover `transition`; tabs change local state but not displayed data.

## `home.news`

| Element | Semantic | Ownership | Production source | CMS destination | Wiring | Editable candidate |
| --- | --- | --- | --- | --- | --- | --- |
| `title` | text | static-unwired | hardcoded header | `config.title` | UNWIRED | BLOCKED |
| `subtitle` | text | static-unwired | hardcoded header | `config.subtitle` | UNWIRED | BLOCKED |
| `categories[]` | interaction-only | interaction-only | inline categories | — | WIRED | NO |
| `news[]` | collection | reference | `newsItems` fixture | News references | UNWIRED | BLOCKED |
| `news[] item` | reference-item | reference | News fixture item | `references[news].entityIds[]` | UNWIRED | BLOCKED |
| `news[].img` | image | derived | News item | News entity | UNWIRED | NO |
| `news[].category` | text | derived | category switch | News entity | UNWIRED | NO |
| `news[].date` | text | derived | News item | News entity | UNWIRED | NO |
| `news[].title` | text | derived | News item | News entity | UNWIRED | NO |
| `news[].desc` | text | derived | News item | News entity | UNWIRED | NO |
| `readMore` | link | interaction-only | hardcoded cue | — | WIRED | NO |
| `emptyState` | derived | derived | filter result | — | WIRED | NO |
| `watermark` | decorative | decorative | `/logo.png` | — | WIRED | NO |
| `viewAllCTA` | cta | interaction-only | hardcoded News navigation | — | WIRED | NO |

### Collection Contract

```text
repeatable: yes; CMS identity entity ID; production NewsItem has no ID (UNSTABLE); minItems UNKNOWN; maxItems registry 3 and production slice(0,3); 1/2/3 columns; categories scroll horizontally.
```

### Motion

Card/image/read-more hover `transition`.

## `home.partners`

| Element | Semantic | Ownership | Production source | CMS destination | Wiring | Editable candidate |
| --- | --- | --- | --- | --- | --- | --- |
| `title` | text | static-unwired | hardcoded header | `config.title` | UNWIRED | BLOCKED |
| `subtitle` | text | static-unwired | hardcoded header | `config.subtitle` | UNWIRED | BLOCKED |
| `partners[]` | collection | reference | `partners` fixture | Partner references | UNWIRED | BLOCKED |
| `partners[] item` | reference-item | reference | Partner fixture | `references[partner].entityIds[]` | UNWIRED | BLOCKED |
| `partners[].logo` | image | derived | Partner `logo` | Partner entity | UNWIRED | NO |
| `partners[].name` | text | derived | Partner `name` as alt | Partner entity | UNWIRED | NO |
| `marqueeCopies` | derived | derived | duplicated source array | — | WIRED | NO |
| `gradientMasks` | decorative | decorative | edge overlays | — | WIRED | NO |

### Collection Contract

```text
repeatable: yes; CMS identity entity ID; production fixture has no ID (UNSTABLE); minItems UNKNOWN; maxItems registry 12; nowrap marquee; card 176×80 → 192×96 at md.
```

### Motion

Continuous `marquee`; logo hover `transition`.

## `home.contact_cta`

| Element | Semantic | Ownership | Production source | CMS destination | Wiring | Editable candidate |
| --- | --- | --- | --- | --- | --- | --- |
| `title` | rich-text | static-unwired | hardcoded JSX heading | `config.title` text | MISMATCH | BLOCKED |
| `description` | text | static-unwired | hardcoded JSX | `config.description` | UNWIRED | BLOCKED |
| `phone` | text | static-unwired | hardcoded | `config.phone` | UNWIRED | BLOCKED |
| `email` | text | static-unwired | hardcoded | `config.email` | UNWIRED | BLOCKED |
| `contactItems[]` | collection | static-unwired | two hardcoded blocks | phone/email config | MISMATCH | BLOCKED |
| `form` | config-only | section-config | local React form | `config.formId` | UNWIRED | BLOCKED |
| `form.fullName` | interaction-only | interaction-only | controlled user input | Form entity/runtime | UNKNOWN | NO |
| `form.phoneNumber` | interaction-only | interaction-only | controlled user input | Form entity/runtime | UNKNOWN | NO |
| `form.interestService` | interaction-only | interaction-only | four hardcoded options | Form entity/runtime | UNWIRED | NO |
| `form.message` | interaction-only | interaction-only | controlled user input | Form entity/runtime | UNKNOWN | NO |
| `submitLabel` | text | static-unwired | hardcoded button label | `config.submitLabel` | UNWIRED | BLOCKED |
| `successOverlay` | derived | derived | valid-submit state | — | WIRED | NO |
| `backgroundGlow` | decorative | decorative | JSX blur layer | — | WIRED | NO |

### Collection Contract

```text
contactItems: fixedCount 2; identity static type (phone/email); no CMS collection destination.
service options: fixedCount 4 hardcoded; identity option value; not landing-page content.
```

### Motion

Success overlay timed clear after 5 seconds.

## `about.hero`

| Element | Semantic | Ownership | Production source | CMS destination | Wiring | Editable candidate |
| --- | --- | --- | --- | --- | --- | --- |
| `backgroundImage` | background-image | static-unwired | fixed Unsplash URL | `config.backgroundImageId` | UNWIRED | BLOCKED |
| `backgroundVideo` | video | static-unwired | fixed Pixabay URL | — | UNWIRED | BLOCKED |
| `badge` | text | static-unwired | hardcoded JSX | — | UNWIRED | BLOCKED |
| `title` | rich-text | static-unwired | hardcoded JSX heading | `config.title` text | MISMATCH | BLOCKED |
| `subtitle` | text | static-unwired | hardcoded JSX | `config.subtitle` | UNWIRED | BLOCKED |
| `gradients[]` | decorative | decorative | two JSX overlays | — | WIRED | NO |

### Collection Contract

```text
gradients: implementation-only fixedCount 2; identity not applicable; responsive overlay only.
```

### Motion

Background `video` autoplay/loop; badge pulse `animation`.

## `about.overview`

| Element | Semantic | Ownership | Production source | CMS destination | Wiring | Editable candidate |
| --- | --- | --- | --- | --- | --- | --- |
| `title` | text | static-unwired | hardcoded header | `config.title` | UNWIRED | BLOCKED |
| `paragraphs[]` | collection | static-unwired | three hardcoded paragraphs | `config.paragraphs[]` | UNWIRED | BLOCKED |
| `paragraphs[] item` | text | static-unwired | hardcoded paragraph | config item | UNWIRED | BLOCKED |
| `videoUrl` | video | static-unwired | fixed YouTube iframe URL | `config.videoUrl` | UNWIRED | BLOCKED |
| `image` | optional-slot | section-config | not rendered | `config.imageId` | UNWIRED | BLOCKED |

### Collection Contract

```text
paragraphs: repeatable schema; production fixedCount 3; identity UNSTABLE; min/max UNKNOWN; vertical flow; section 1 column → 2 columns at lg.
```

### Motion

YouTube iframe may contain external player motion; no local autoplay attribute found.

## `about.timeline`

| Element | Semantic | Ownership | Production source | CMS destination | Wiring | Editable candidate |
| --- | --- | --- | --- | --- | --- | --- |
| `badge` | text | static-unwired | hardcoded | — | UNWIRED | BLOCKED |
| `title` | text | static-unwired | hardcoded | `config.title` | UNWIRED | BLOCKED |
| `description` | text | static-unwired | hardcoded | — | UNWIRED | BLOCKED |
| `milestones[]` | collection | embedded | inline array | `config.milestones[]` | MISMATCH | BLOCKED |
| `milestones[] item` | embedded-item | embedded | inline object | milestone config item | MISMATCH | BLOCKED |
| `milestones[].year` | text | embedded | `year` | `year` | UNWIRED | BLOCKED |
| `milestones[].title` | config-only | section-config | present but not rendered | `title` | PARTIAL | BLOCKED |
| `milestones[].desc` | text | embedded | `desc` | `description` | MISMATCH | BLOCKED |
| `connector/dots` | decorative | decorative | responsive JSX/SVG | — | WIRED | NO |

### Collection Contract

```text
repeatable: yes; identity UNSTABLE (array index; year not declared unique); min/max UNKNOWN; production count 5 vs CMS mock 4; vertical below md, five-column horizontal at md.
```

### Motion

Dot ping `animation`.

## `about.strategy`

| Element | Semantic | Ownership | Production source | CMS destination | Wiring | Editable candidate |
| --- | --- | --- | --- | --- | --- | --- |
| `title` | text | static-unwired | hardcoded header | `config.title` | UNWIRED | BLOCKED |
| `subtitle` | text | static-unwired | hardcoded header | `config.subtitle` | UNWIRED | BLOCKED |
| `illustration` | image | static-unwired | `/35nam_cic_1.JPG` | — | UNWIRED | BLOCKED |
| `mission.icon` | icon | decorative | JSX icon | — | WIRED | NO |
| `mission.title` | text | static-unwired | hardcoded | fixed presentation | UNWIRED | BLOCKED |
| `mission.description` | text | static-unwired | hardcoded | `config.mission` | UNWIRED | BLOCKED |
| `vision.icon` | icon | decorative | JSX icon | — | WIRED | NO |
| `vision.title` | text | static-unwired | hardcoded | fixed presentation | UNWIRED | BLOCKED |
| `vision.description` | text | static-unwired | hardcoded | `config.vision` | UNWIRED | BLOCKED |
| `coreValues.icon` | icon | decorative | JSX icon | — | WIRED | NO |
| `coreValues.title` | text | static-unwired | hardcoded | fixed presentation | UNWIRED | BLOCKED |
| `coreValues.items[]` | collection | embedded | inline string array | `config.coreValues[]` | UNWIRED | BLOCKED |
| `coreValues.items[] item` | text | embedded | inline string | config string item | UNWIRED | BLOCKED |
| `illustrationGradient` | decorative | decorative | JSX overlay | — | WIRED | NO |

### Collection Contract

```text
coreValues: repeatable yes; identity UNSTABLE; min/max UNKNOWN; production count 5 and CMS mock count 5; vertical list; illustration hidden below lg.
```

### Motion

Card hover `transition`.

## `about.offerings`

| Element | Semantic | Ownership | Production source | CMS destination | Wiring | Editable candidate |
| --- | --- | --- | --- | --- | --- | --- |
| `title` | text | static-unwired | hardcoded header | `config.title` | UNWIRED | BLOCKED |
| `subtitle` | text | static-unwired | hardcoded header | `config.subtitle` | UNWIRED | BLOCKED |
| `items[]` | collection | reference | seven inline cards | Product + Service references | MISMATCH | BLOCKED |
| `items[] item` | reference-item | reference | inline object | entity reference | MISMATCH | BLOCKED |
| `items[].icon` | icon | derived | JSX icon in object | referenced entity/presentation map | UNKNOWN | NO |
| `items[].title` | text | derived | inline object | referenced entity | MISMATCH | NO |
| `items[].desc` | text | derived | inline object | referenced entity | MISMATCH | NO |

### Collection Contract

```text
repeatable: yes; CMS identity entity ID; production inline cards have no IDs (UNSTABLE); registry max Product=2 + Service=4 (6), production renders 7; minItems UNKNOWN; grid 1/2/4 columns.
```

### Motion

Card hover `transition`.

### Unresolved

- Seven production offerings cannot be reconciled with six allowed references; entity type/order-to-card variant mapping is absent.
+
## `about.awards`

| Element | Semantic | Ownership | Production source | CMS destination | Wiring | Editable candidate |
| --- | --- | --- | --- | --- | --- | --- |
| `title` | text | static-unwired | hardcoded header | `config.title` | UNWIRED | BLOCKED |
| `subtitle` | text | static-unwired | hardcoded header | `config.subtitle` | UNWIRED | BLOCKED |
| `description` | text | static-unwired | hardcoded paragraph | — | UNWIRED | BLOCKED |
| `items[]` | collection | embedded | shared `homeAwards` fixture | `config.items[]` | MISMATCH | BLOCKED |
| `items[] item` | embedded-item | embedded | award fixture item | config item | MISMATCH | BLOCKED |
| `items[].img` | image | embedded | fixture `img` | `imageId` | MISMATCH | BLOCKED |
| `items[].name` | text | embedded | fixture `name` | `name` | UNWIRED | BLOCKED |
| `navigation` | interaction-only | interaction-only | AwardsSlider state | — | WIRED | NO |

### Collection Contract

```text
repeatable: yes; identity UNSTABLE; min/max UNKNOWN; production uses shared Home fixture, CMS About has a separate array; carousel responsive 1/2/3/4/5.
```

### Motion

Carousel `autoplay`, transform `transition`, touch swipe.

## `about.partners`

| Element | Semantic | Ownership | Production source | CMS destination | Wiring | Editable candidate |
| --- | --- | --- | --- | --- | --- | --- |
| `title` | text | static-unwired | hardcoded header | `config.title` | UNWIRED | BLOCKED |
| `subtitle` | text | static-unwired | hardcoded header | `config.subtitle` | UNWIRED | BLOCKED |
| `description` | text | static-unwired | hardcoded paragraph | — | UNWIRED | BLOCKED |
| `gallery[]` | collection | static-unwired | four fixed image URLs | — | UNWIRED | BLOCKED |
| `gallery[] item` | embedded-item | static-unwired | fixed image entry | — | UNWIRED | BLOCKED |
| `gallery[].image` | image | static-unwired | fixed URL | — | UNWIRED | BLOCKED |
| `gallery[].hoverGradient` | decorative | decorative | JSX overlay | — | WIRED | NO |
| `partners[]` | collection | reference | `partners` fixture | Partner references | UNWIRED | BLOCKED |
| `partners[] item` | reference-item | reference | Partner fixture | entity IDs | UNWIRED | BLOCKED |
| `partners[].logo` | image | derived | entity/fixture logo | Partner entity | UNWIRED | NO |
| `partners[].name` | text | derived | entity/fixture name as alt | Partner entity | UNWIRED | NO |
| `gradientMasks` | decorative | decorative | marquee edge masks | — | WIRED | NO |

### Collection Contract

```text
gallery: repeatable in production only; identity UNSTABLE; current fixedCount 4; no CMS destination; Bento 1 column → 12-column at md.
partners: repeatable; CMS identity entity ID; production fixture identity UNSTABLE; maxItems registry 12; nowrap marquee.
```

### Motion

Partner `marquee`; gallery and logo hover `transition`.

## `about.organization`

| Element | Semantic | Ownership | Production source | CMS destination | Wiring | Editable candidate |
| --- | --- | --- | --- | --- | --- | --- |
| `title` | text | static-unwired | hardcoded header | `config.title` | UNWIRED | BLOCKED |
| `chart` | decorative | decorative | inline SVG | — | WIRED | NO |
| `chart.connectors[]` | decorative | decorative | SVG lines | — | WIRED | NO |
| `chart.nodes[]` | collection | static-unwired | inline SVG groups | — | UNWIRED | BLOCKED |
| `chart.nodes[] item` | embedded-item | static-unwired | SVG group | — | UNWIRED | BLOCKED |
| `chart.nodes[].labelLines[]` | collection | static-unwired | SVG text nodes | — | UNWIRED | BLOCKED |
| `chart.nodes[].labelLines[] item` | text | static-unwired | SVG text | — | UNWIRED | BLOCKED |
| `chart.filter/style` | decorative | decorative | SVG definitions | — | WIRED | NO |

### Collection Contract

```text
nodes/labelLines: repeatable in JSX only; identity UNSTABLE; min/max UNKNOWN; chart viewBox 1600×560; horizontally scrollable below lg, fluid SVG at lg.
```

### Motion

No proven active motion.

## `about.capacity`

| Element | Semantic | Ownership | Production source | CMS destination | Wiring | Editable candidate |
| --- | --- | --- | --- | --- | --- | --- |
| `title` | rich-text | static-unwired | hardcoded JSX heading | `config.title` text | MISMATCH | BLOCKED |
| `description` | text | static-unwired | hardcoded JSX | `config.description` | UNWIRED | BLOCKED |
| `metrics[]` | collection | embedded | four hardcoded metric cards | `config.metrics[]` | UNWIRED | BLOCKED |
| `metrics[] item` | embedded-item | embedded | hardcoded metric | config item | UNWIRED | BLOCKED |
| `metrics[].value` | text | embedded | hardcoded | `value` | UNWIRED | BLOCKED |
| `metrics[].label` | text | embedded | hardcoded | `label` | UNWIRED | BLOCKED |
| `separator` | decorative | decorative | orange rule | — | WIRED | NO |

### Collection Contract

```text
repeatable: schema yes; identity UNSTABLE; min/max UNKNOWN; production fixedCount 4; 2 columns → 4 at md.
```

### Motion

No counter component here; hover/typography transitions only.

## `about.experience`

| Element | Semantic | Ownership | Production source | CMS destination | Wiring | Editable candidate |
| --- | --- | --- | --- | --- | --- | --- |
| `title` | optional-slot | section-config | not rendered | `config.title` | UNWIRED | BLOCKED |
| `categoryKeys[]` | config-only | section-config | not consumed | `config.categoryKeys[]` | UNWIRED | BLOCKED |
| `items[]` | collection | static-unwired | three hardcoded rows | no item destination | MISMATCH | BLOCKED |
| `items[] item` | embedded-item | static-unwired | hardcoded row | no item destination | MISMATCH | BLOCKED |
| `items[].image` | image | static-unwired | fixed URL | — | UNWIRED | BLOCKED |
| `items[].title` | text | static-unwired | hardcoded | — | UNWIRED | BLOCKED |
| `items[].description` | text | static-unwired | hardcoded | — | UNWIRED | BLOCKED |

### Collection Contract

```text
items: production fixedCount 3; identity UNSTABLE; min/max UNKNOWN; 1 column → 2 at md, second row reverses order.
categoryKeys: repeatable config; identity string value; no production consumer.
```

### Motion

Image/card hover `transition`.

## `about.software_partners`

| Element | Semantic | Ownership | Production source | CMS destination | Wiring | Editable candidate |
| --- | --- | --- | --- | --- | --- | --- |
| `title` | text | unknown | no renderer | `config.title` | UNKNOWN | UNKNOWN |
| `partners[]` | collection | reference | no renderer; unused fixture exists | Partner references | UNKNOWN | UNKNOWN |
| `partners[] item` | reference-item | reference | no renderer | entity ID | UNKNOWN | UNKNOWN |

### Collection Contract

```text
repeatable: yes by reference model; identity entity ID; minItems UNKNOWN; maxItems registry 12; layout/responsive UNKNOWN.
```

### Motion

UNKNOWN.

### Unresolved

- Key is filtered out of exported templates and has no production component.

## `about.hardware_partners`

| Element | Semantic | Ownership | Production source | CMS destination | Wiring | Editable candidate |
| --- | --- | --- | --- | --- | --- | --- |
| `title` | text | unknown | no renderer | `config.title` | UNKNOWN | UNKNOWN |
| `partners[]` | collection | reference | no renderer; unused fixture exists | Partner references | UNKNOWN | UNKNOWN |
| `partners[] item` | reference-item | reference | no renderer | entity ID | UNKNOWN | UNKNOWN |

### Collection Contract

```text
repeatable: yes by reference model; identity entity ID; minItems UNKNOWN; maxItems registry 12; layout/responsive UNKNOWN.
```

### Motion

UNKNOWN.

### Unresolved

- Key is filtered out of exported templates and has no production component.

## `about.contact_cta`

| Element | Semantic | Ownership | Production source | CMS destination | Wiring | Editable candidate |
| --- | --- | --- | --- | --- | --- | --- |
| `cta.href` | link | static-unwired | fixed flipbook URL | `config.ctaId` | MISMATCH | BLOCKED |
| `cta.label` | text | static-unwired | hardcoded label | CTA entity via `ctaId` | MISMATCH | BLOCKED |
| `cta.icon` | icon | decorative | `ArrowUpRight` | — | WIRED | NO |
| `title` | optional-slot | section-config | not rendered | `config.title` | UNWIRED | BLOCKED |
| `description` | optional-slot | section-config | not rendered | `config.description` | UNWIRED | BLOCKED |

### Collection Contract

None.

### Motion

CTA hover `transition`.

## `contact.header`

| Element | Semantic | Ownership | Production source | CMS destination | Wiring | Editable candidate |
| --- | --- | --- | --- | --- | --- | --- |
| `title` | text | static-unwired | hardcoded JSX | `config.title` | UNWIRED | BLOCKED |
| `subtitle` | text | static-unwired | hardcoded JSX | `config.subtitle` | UNWIRED | BLOCKED |

### Collection Contract

None.

### Motion

No significant motion.
+
## `legal.header`

| Element | Semantic | Ownership | Production source | CMS destination | Wiring | Editable candidate |
| --- | --- | --- | --- | --- | --- | --- |
| `categoryTag` | text | embedded | CMS local config / public static prop | `config.categoryTag` | MISMATCH | BLOCKED |
| `title` | text | embedded | CMS local config / public static prop | `config.title` | MISMATCH | BLOCKED |
| `subtitle` | text | embedded | CMS local config / public static prop | `config.subtitle` | MISMATCH | BLOCKED |
| `lastUpdated` | text | embedded | CMS local config / public static prop | `config.lastUpdated` | MISMATCH | BLOCKED |
| `readingTime` | optional-slot | embedded | CMS local config / public static prop | `config.readingTime` | MISMATCH | BLOCKED |
| `breadcrumb` | interaction-only | interaction-only | public layout only | — | WIRED | NO |
| `companyAttribution` | text | static-unwired | public layout only | — | UNWIRED | BLOCKED |
| `separator/icons` | decorative | decorative | public layout | — | WIRED | NO |

### Collection Contract

None.

### Motion

Minor link/hover transitions only.

### Unresolved

- CMS preview header and public header do not share a read model; no published PageBuilder lookup was found on public routes.

## `legal.content`

| Element | Semantic | Ownership | Production source | CMS destination | Wiring | Editable candidate |
| --- | --- | --- | --- | --- | --- | --- |
| `richTextHtml` | rich-text | embedded | CMS local `dangerouslySetInnerHTML`; public static React nodes | `config.richTextHtml` | MISMATCH | BLOCKED |
| `richTextHtml.*` | UNKNOWN | unknown | arbitrary supplied HTML descendants | same HTML blob | UNKNOWN | UNKNOWN |

### Collection Contract

```text
arbitrary descendants: repeatable/content-dependent; identity none; min/max UNKNOWN; structure controlled by HTML string, not item schema.
```

### Motion

No section-owned motion proven.

### Unresolved

- Sanitization/allowlist contract is unknown.
- Public legal content is not sourced from normalized rich text.

## `privacy.collection`

| Element | Semantic | Ownership | Production source | CMS destination | Wiring | Editable candidate |
| --- | --- | --- | --- | --- | --- | --- |
| `title` | text | static-unwired | public static node | legacy `config.title`, normalized into rich text | MISMATCH | BLOCKED |
| `blocks[]` | collection | embedded | legacy CMS only | legacy `config.blocks[]`, normalized away | PARTIAL | BLOCKED |
| `blocks[] item` | embedded-item | embedded | legacy block | normalized HTML fragment | MISMATCH | BLOCKED |
| `content.paragraphs[]` | collection | static-unwired | public React paragraphs | normalized `legal.content.richTextHtml` | MISMATCH | BLOCKED |
| `content.paragraphs[] item` | rich-text | static-unwired | public React node | HTML fragment | MISMATCH | BLOCKED |
| `content.link` | link | static-unwired | public first paragraph | HTML link inside rich text | MISMATCH | BLOCKED |

### Collection Contract

```text
blocks/paragraphs: repeatable; identity UNSTABLE; active PageBuilder removes this section key; min/max UNKNOWN; shared legal typography.
```

### Motion

Link hover transition only.

## `privacy.usage`

| Element | Semantic | Ownership | Production source | CMS destination | Wiring | Editable candidate |
| --- | --- | --- | --- | --- | --- | --- |
| `title` | text | static-unwired | public static node | legacy title → normalized HTML | MISMATCH | BLOCKED |
| `blocks[]` | collection | embedded | legacy CMS only | blocks → normalized HTML | PARTIAL | BLOCKED |
| `blocks[] item` | embedded-item | embedded | legacy block | HTML fragment | MISMATCH | BLOCKED |
| `content.intro` | text | static-unwired | public React node | normalized rich text | MISMATCH | BLOCKED |
| `content.items[]` | collection | static-unwired | public inline array | normalized rich text list | MISMATCH | BLOCKED |
| `content.items[] item` | text | static-unwired | public inline string | HTML list item | MISMATCH | BLOCKED |
| `content.items[].icon` | icon | decorative | `CheckCircle2` | — | WIRED | NO |
| `content.note` | text | static-unwired | public React node | normalized rich text | MISMATCH | BLOCKED |

### Collection Contract

```text
blocks/items: repeatable; identity UNSTABLE; public list fixedCount 6; active PageBuilder key normalized away; min/max UNKNOWN.
```

### Motion

No significant motion.

## `privacy.retention`

| Element | Semantic | Ownership | Production source | CMS destination | Wiring | Editable candidate |
| --- | --- | --- | --- | --- | --- | --- |
| `title` | text | static-unwired | public static node | legacy title → normalized HTML | MISMATCH | BLOCKED |
| `blocks[]` | collection | embedded | legacy CMS only | blocks → normalized HTML | PARTIAL | BLOCKED |
| `blocks[] item` | embedded-item | embedded | legacy block | HTML fragment | MISMATCH | BLOCKED |
| `content` | text | static-unwired | public paragraph | normalized rich text | MISMATCH | BLOCKED |

### Collection Contract

```text
blocks: repeatable; identity UNSTABLE; active PageBuilder key normalized away; min/max UNKNOWN.
```

### Motion

No significant motion.

## `privacy.access`

| Element | Semantic | Ownership | Production source | CMS destination | Wiring | Editable candidate |
| --- | --- | --- | --- | --- | --- | --- |
| `title` | text | static-unwired | public static node | legacy title → normalized HTML | MISMATCH | BLOCKED |
| `blocks[]` | collection | embedded | legacy CMS only | blocks → normalized HTML | PARTIAL | BLOCKED |
| `blocks[] item` | embedded-item | embedded | legacy block | HTML fragment | MISMATCH | BLOCKED |
| `content.paragraphs[]` | collection | static-unwired | public React paragraphs | normalized rich text | MISMATCH | BLOCKED |
| `content.paragraphs[] item` | rich-text | static-unwired | public React node | HTML fragment | MISMATCH | BLOCKED |
| `content.link` | link | static-unwired | public second paragraph | HTML link | MISMATCH | BLOCKED |

### Collection Contract

```text
blocks/paragraphs: repeatable; identity UNSTABLE; active PageBuilder key normalized away; min/max UNKNOWN.
```

### Motion

Link hover transition only.

## `privacy.commitment`

| Element | Semantic | Ownership | Production source | CMS destination | Wiring | Editable candidate |
| --- | --- | --- | --- | --- | --- | --- |
| `title` | text | static-unwired | public static node | legacy title → normalized HTML | MISMATCH | BLOCKED |
| `blocks[]` | collection | embedded | legacy CMS only | blocks → normalized HTML | PARTIAL | BLOCKED |
| `blocks[] item` | embedded-item | embedded | legacy block | HTML fragment | MISMATCH | BLOCKED |
| `content.paragraphs[]` | collection | static-unwired | public React paragraphs | normalized rich text | MISMATCH | BLOCKED |
| `content.paragraphs[] item` | text | static-unwired | public React node | HTML fragment | MISMATCH | BLOCKED |
| `content.notice` | embedded-item | static-unwired | public highlighted card | normalized HTML only | MISMATCH | BLOCKED |
| `content.notice.title` | text | static-unwired | hardcoded | HTML fragment | MISMATCH | BLOCKED |
| `content.notice.text` | text | static-unwired | hardcoded | HTML fragment | MISMATCH | BLOCKED |

### Collection Contract

```text
blocks/paragraphs: repeatable; identity UNSTABLE; active PageBuilder key normalized away; notice is a fixed singleton without a typed destination.
```

### Motion

No significant motion.

## `legal.assistance`

| Element | Semantic | Ownership | Production source | CMS destination | Wiring | Editable candidate |
| --- | --- | --- | --- | --- | --- | --- |
| `title` | text | static-unwired | public layout hardcoded | legacy `config.title` normalized into rich text | MISMATCH | BLOCKED |
| `description` | text | static-unwired | public layout hardcoded | legacy `config.description` normalized into rich text | MISMATCH | BLOCKED |
| `phone` | link | static-unwired | hardcoded `tel:` | legacy `config.phone` normalized into rich text | MISMATCH | BLOCKED |
| `email` | link | static-unwired | hardcoded `mailto:` | legacy `config.email` normalized into rich text | MISMATCH | BLOCKED |
| `icon` | icon | decorative | `ShieldCheck` | — | WIRED | NO |

### Collection Contract

None.

### Motion

Link hover transition only.

## `contact.branches`

| Element | Semantic | Ownership | Production source | CMS destination | Wiring | Editable candidate |
| --- | --- | --- | --- | --- | --- | --- |
| `title` | text | static-unwired | hardcoded heading | `config.title` | UNWIRED | BLOCKED |
| `branches[]` | collection | embedded | local `branches` object | `config.branches[]` | MISMATCH | BLOCKED |
| `branches[] item` | embedded-item | embedded | branch object | config branch | MISMATCH | BLOCKED |
| `branches[].name` | text | embedded | `name` | `name` | UNWIRED | BLOCKED |
| `branches[].address` | text | embedded | `address` | `address` | UNWIRED | BLOCKED |
| `branches[].tel` | link | embedded | `tel` | `phone` | MISMATCH | BLOCKED |
| `branches[].email` | link | embedded | `email` | `email` | UNWIRED | BLOCKED |
| `branches[].fax` | optional-slot | embedded | optional `fax` | no CMS field | MISMATCH | BLOCKED |
| `branches[].workingHours` | text | embedded | `workingHours` | `workingHours` | UNWIRED | BLOCKED |
| `branches[].searchQuery` | config-only | embedded | `searchQuery` | no CMS field | MISMATCH | BLOCKED |
| `branches[].mapUrl` | config-only | embedded | iframe URL | `mapUrl` | UNWIRED | BLOCKED |
| `branchTabs[]` | interaction-only | interaction-only | hardcoded keys/labels | derived from branches | PARTIAL | NO |
| `map` | derived | derived | active branch iframe | active branch `mapUrl` | UNWIRED | NO |

### Collection Contract

```text
repeatable: yes; production identity stable object key (hanoi/hcm), CMS identity stable config.key; min/max UNKNOWN; registry describes two but does not enforce; only active branch renders; info cards 2 columns at md.
```

### Motion

Tab/map swap `transition`; external iframe behavior.

### Unresolved

- CMS omits production `fax` and `searchQuery`; production uses `tel` while CMS uses `phone`.

## `contact.form`

| Element | Semantic | Ownership | Production source | CMS destination | Wiring | Editable candidate |
| --- | --- | --- | --- | --- | --- | --- |
| `title` | text | static-unwired | hardcoded | `config.title` | UNWIRED | BLOCKED |
| `formId` | config-only | section-config | not resolved | `config.formId` | UNWIRED | BLOCKED |
| `fields.fullName` | interaction-only | interaction-only | local form definition/state | referenced Form entity | UNWIRED | NO |
| `fields.email` | interaction-only | interaction-only | local form definition/state | referenced Form entity | UNWIRED | NO |
| `fields.phone` | interaction-only | interaction-only | local form definition/state | referenced Form entity | UNWIRED | NO |
| `fields.subject` | interaction-only | interaction-only | local form definition/state | referenced Form entity | UNWIRED | NO |
| `fields.note` | interaction-only | interaction-only | local textarea state | referenced Form entity | UNWIRED | NO |
| `captcha` | derived | derived | random arithmetic state | — | WIRED | NO |
| `errors[]` | derived | derived | validation results | — | WIRED | NO |
| `submitLabel` | text | static-unwired | hardcoded/dynamic submit state | `config.submitLabel` | MISMATCH | BLOCKED |
| `successCard` | derived | derived | `successLead` condition | — | WIRED | NO |
| `successCard.leadId` | derived | derived | submitted lead | — | WIRED | NO |
| `successCard.name` | derived | derived | submitted lead | — | WIRED | NO |
| `successCard.subject` | derived | derived | submitted lead | — | WIRED | NO |
| `successCard.email` | derived | derived | submitted lead | — | WIRED | NO |
| `successCard.phone` | derived | derived | submitted lead | — | WIRED | NO |
| `successTitle` | optional-slot | section-config | not rendered from CMS | `config.successTitle` | UNWIRED | BLOCKED |
| `successMessage` | optional-slot | section-config | not rendered from CMS | `config.successMessage` | UNWIRED | BLOCKED |

### Collection Contract

```text
fields/errors: runtime collections, not landing-page content; identity field key; responsive single column with email/phone split at md.
```

### Motion

Submit loading transition; form/success conditional swap.

## `contact.security`

| Element | Semantic | Ownership | Production source | CMS destination | Wiring | Editable candidate |
| --- | --- | --- | --- | --- | --- | --- |
| `icon` | icon | decorative | `ShieldCheck` | — | WIRED | NO |
| `title` | text | static-unwired | hardcoded | `config.title` | UNWIRED | BLOCKED |
| `description` | text | static-unwired | hardcoded | `config.description` | UNWIRED | BLOCKED |
| `policyPageId` | optional-slot | section-config | no production link | `config.policyPageId` | UNWIRED | BLOCKED |

### Collection Contract

None.

### Motion

No significant motion.

## Cross-section motion inventory

| Section | Motion type | Production evidence |
| --- | --- | --- |
| `home.hero` | autoplay, transition, marquee, animation | six-second slide timer, slide transition, ticker marquee, pulse/bell |
| `home.intro` | animation, video state | pulsing play control; thumbnail replaced by iframe |
| `home.stats` | animation | Counter runs for two seconds |
| `home.awards` | autoplay, transition | AwardsSlider looping timer/transform |
| `home.projects` | hover-layout-change, transition | flex expansion, overlays/images |
| `home.events` | transition | card hover |
| `home.news` | transition | cards/images/read-more |
| `home.partners` | marquee, transition | duplicated continuous strip |
| `home.contact_cta` | timed content | success overlay clears after five seconds |
| `about.hero` | video, animation | autoplay/loop background video, pulse |
| `about.timeline` | animation | ping dots |
| `about.strategy` | transition | card hover |
| `about.offerings` | transition | card hover |
| `about.awards` | autoplay, transition | AwardsSlider |
| `about.partners` | marquee, transition | partner strip and gallery hover |
| `about.experience` | transition | row/image hover |
| `contact.branches` | transition | tab/map swap |
| `contact.form` | transition | loading and form/success swap |
| legal sections | transition only | link hover where present |

No source-level parallax implementation was found in the inventoried sections.

## Optional capability reconciliation

| Capability | Production support | CMS support | Current state | Result |
| --- | --- | --- | --- | --- |
| Hero secondary CTA | yes, hardcoded | CTA ID per slide | present | MISMATCH/BLOCKED |
| Home intro eyebrow | no | yes | absent in production | UNWIRED/BLOCKED |
| Home intro standalone image | no | yes | absent in production | UNWIRED/BLOCKED |
| Project short/client/tags | yes, conditional | entity-owned | depends on entity | reference child, not page-editable |
| Contact branch fax | yes | no typed field | present for one branch | MISMATCH/BLOCKED |
| Contact security policy link | no | yes | absent in production | UNWIRED/BLOCKED |
| Legal reading time | yes, optional | yes, optional | varies | MISMATCH/BLOCKED due dual renderer |
| Legal rich-text descendants | content-dependent | HTML blob | arbitrary | UNKNOWN |

## Phase 2 reconciliation

- Phase 1 production element rows checked: **248** (**168** unique path labels).
- Composite Phase 1 labels split into primitive rows: `coreValues.title/icon`, `fields.fullName/email/phone/subject`, `mission.icon/title/description`, `secondary[].img/title/date/loc`, `successCard.leadId/name/subject/email/phone`, and `vision.icon/title/description`.
- Semantic element contracts: **308**.
- Editing eligibility: **YES 0**, **NO 107**, **BLOCKED 194**, **UNKNOWN 7**.
- Semantic collections: **36**; documented unstable collection identities: **21**.
- Element-level wiring classifications: **MISMATCH 91**, **UNWIRED 144**, **UNKNOWN 12**; remaining rows are `WIRED` or `PARTIAL` and are mostly non-editable derived/decorative/interaction behavior.

The zero `YES` result is intentional: no content candidate currently has both a safe CMS destination and a verified production consumption path. It must not be interpreted as “nothing should ever be editable”; it records the current wiring boundary.
