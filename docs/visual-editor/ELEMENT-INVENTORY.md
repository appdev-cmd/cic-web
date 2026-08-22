# Production Element Inventory

> Phase: **DISCOVER only**. This document records the production structures found in source code. It does not define editor behavior and does not treat the CMS draft schema as proof that a value is wired into production.

## A. Rendering Architecture

### Public website

```text
App state (`currentView`, `aboutSubTab`)
→ `src/App.tsx`
→ `HomeView` / `AboutView` / `ContactView` / `PrivacyPolicyView` / `TermsOfUseView`
→ section JSX embedded in the selected view
→ shared children (`SectionHeader`, `AwardsSlider`, `Counter`, icons)
```

The public website has no general section registry or dynamic production section renderer. Home, About, and Contact sections are JSX inside large view components. Legal public pages assemble static React nodes and pass them to `LegalArticleLayout`.

### CMS Visual Page preview

```text
`PageBuilderPage.draft.sections`
→ `PageBuilderEditor`
→ `PageBuilderVisualCanvas`
→ `WebsitePage(page.pageType)`
→ existing production view (`HomeView`, `AboutView`, `ContactView`)
   or local `LegalPage`
→ DOM matching by `data-page-builder-section-key`
```

Principal files:

- `src/cms/modules/static_pages/pageBuilderTypes.ts` — page, version, section, reference, and entity types.
- `src/cms/modules/static_pages/pageBuilderData.ts` — template construction, page filtering, and legal normalization.
- `src/cms/modules/static_pages/pageBuilderMockData.json` — source CMS fixtures.
- `src/cms/modules/static_pages/pageBuilderRegistry.ts` — labels/capabilities; not a production component registry.
- `src/cms/modules/static_pages/pageBuilderDraftSchema.ts` — draft-field declarations; not the production DOM schema.
- `src/cms/modules/static_pages/PageBuilderVisualCanvas.tsx` — page-type dispatch, production-view portal, DOM matching, and the separate local legal renderer.
- `src/web/components/HomeView.tsx`, `AboutView.tsx`, `ContactView.tsx` — actual production section JSX.
- `src/web/components/LegalArticleLayout.tsx`, `PrivacyPolicyView.tsx`, `TermsOfUseView.tsx` — public legal production path.
- `src/web/features/home/homeData.ts`, `src/web/data/homeData.ts`, `src/web/data/mockData.ts`, `src/web/data/aboutData.ts` — current production fixture sources.

### Confirmed data-flow constraint

For Home, About, Organization, Capacity/Experience, and Contact, `WebsitePage` selects a production view by `page.pageType`, but it does **not** pass section config or references into those views. Most production text/cards therefore still come from hardcoded JSX or static fixtures. The canvas later finds rendered nodes and applies draft-facing DOM behavior. Legal pages are the exception: the local CMS `LegalPage` directly receives draft sections.

## B. Section Coverage Table

`Schema found` means present in `draftSectionSchemas`, the registry, or source page data. `Renderer found` means a production or CMS-preview rendering path was found. “Legacy only” means normalized out of the active Page Builder page.

| Section | Schema found | Renderer found | Production component | Inspected |
| --- | --- | --- | --- | --- |
| `home.hero` | yes | yes | `HomeView` | yes |
| `home.intro` | yes | yes | `HomeView` | yes |
| `home.stats` | yes | yes | `HomeView` → `Counter` | yes |
| `home.awards` | yes | yes | `HomeView` → `AwardsSlider` | yes |
| `home.ecosystem` | yes | yes | `HomeView` | yes |
| `home.projects` | yes | yes | `HomeView` | yes |
| `home.events` | yes | yes | `HomeView` | yes |
| `home.news` | yes | yes | `HomeView` | yes |
| `home.partners` | yes | yes | `HomeView` | yes |
| `home.contact_cta` | yes | yes | `HomeView` | yes |
| `about.hero` | yes | yes | `AboutView` | yes |
| `about.overview` | yes | yes | `AboutView` | yes |
| `about.timeline` | yes | yes | `AboutView` | yes |
| `about.strategy` | yes | yes | `AboutView` | yes |
| `about.offerings` | yes | yes | `AboutView` | yes |
| `about.awards` | yes | yes | `AboutView` → `AwardsSlider` | yes |
| `about.partners` | yes | yes | `AboutView` | yes |
| `about.organization` | yes | yes | `AboutView` | yes |
| `about.capacity` | yes | yes | `AboutView` | yes |
| `about.experience` | yes | yes | `AboutView` | yes |
| `about.software_partners` | yes | no | none found | no — declared only |
| `about.hardware_partners` | yes | no | none found | no — declared only |
| `about.contact_cta` | yes | yes | `AboutView` | yes |
| `contact.header` | yes | yes | `ContactView` | yes |
| `contact.branches` | yes | yes | `ContactView` | yes |
| `contact.form` | yes | yes | `ContactView` | yes |
| `contact.security` | yes | yes | `ContactView` | yes |
| `legal.header` | yes | yes | CMS `LegalPage`; public `LegalArticleLayout` header | yes |
| `legal.content` | yes | yes | CMS `LegalPage` rich text | yes |
| `privacy.collection` | yes | legacy only | public `PrivacyPolicyView` → `LegalArticleLayout` | yes |
| `privacy.usage` | yes | legacy only | public `PrivacyPolicyView` → `LegalArticleLayout` | yes |
| `privacy.retention` | yes | legacy only | public `PrivacyPolicyView` → `LegalArticleLayout` | yes |
| `privacy.access` | yes | legacy only | public `PrivacyPolicyView` → `LegalArticleLayout` | yes |
| `privacy.commitment` | yes | legacy only | public `PrivacyPolicyView` → `LegalArticleLayout` | yes |
| `legal.assistance` | yes | public static only | `LegalArticleLayout` assistance box | yes |

Coverage counts: **35 section keys found**, **33 production/preview structures inspected**, **2 declared-only keys without a renderer**.

## C. Detailed Element Inventory

### `home.hero`

#### Production files

```text
src/web/components/HomeView.tsx
src/web/data/mockData.ts
src/shared/types/index.ts
```

#### Production structure

```text
Hero
├── slides[] → active Slide
│   ├── background image
│   ├── gradient overlay
│   ├── static badge + pulse dot
│   ├── HTML heading
│   ├── description
│   ├── primary action + icon
│   └── secondary action + icon
├── pagination dots[]
└── desktop headline ticker
    ├── HOT NEWS badge + animated bell
    └── marquee texts[]
```

#### Elements

| Path | Representation | Ownership | Optional | Repeatable | Source |
| --- | --- | --- | --- | --- | --- |
| `slides[]` | slide | static | no | yes | `heroSlides` |
| `slides[].img` | background-image | static | no | no | `HeroSlide.img` |
| `slides[].title` | rich-text | static | no | no | `HeroSlide.title`, rendered with `dangerouslySetInnerHTML` |
| `slides[].sub` | text | static | no | no | `HeroSlide.sub` |
| `badge` | badge | static | no | no | hardcoded “Leading Innovation since 1990” |
| `primaryAction` | button | static | no | no | hardcoded navigation to Products |
| `secondaryAction` | button | static | no | no | hardcoded navigation to About |
| `paginationDots[]` | decorative | derived | yes | yes | derived from `heroSlides`; hidden in edit mode |
| `tickerItems[]` | list-item | static | no | yes | `marqueeTexts` |
| `tickerBadge` | badge | static | no | no | hardcoded |
| `backgroundGradient` | decorative | static | no | no | JSX layer |

#### Conditional behavior

- Active slide is state-driven. Production auto-advances every six seconds; explicit `previewSlideIndex` can select it.
- Pagination dots render only when `editMode === false`.
- Ticker exists at all times but is hidden below the `md` breakpoint.

#### Responsive behavior

- Fixed responsive height: 520/560/600/640/660 px across breakpoints.
- Content becomes a 12-column grid at `lg`; CTA buttons stack until `sm`.
- Ticker is desktop/tablet-only (`hidden md:block`).

#### Unknowns

- CMS slide config uses `backgroundImageId`, CTA IDs, and additional fields, but production `HomeView` reads `HeroSlide.img/title/sub` and hardcoded actions. No runtime adapter between these models was found.

### `home.intro`

#### Production files

```text
src/web/components/HomeView.tsx
```

#### Production structure

```text
Intro
├── heading with highlighted span
├── paragraphs[2]
├── primary navigation button
├── profile download link
└── video area
    ├── YouTube thumbnail
    ├── play control + ping decoration
    └── iframe after activation
```

#### Elements

| Path | Representation | Ownership | Optional | Repeatable | Source |
| --- | --- | --- | --- | --- | --- |
| `title` | rich-text | static | no | no | hardcoded JSX heading |
| `paragraphs[]` | text | static | no | yes | two hardcoded paragraphs |
| `primaryCTA` | button | static | no | no | About navigation |
| `profileLink` | link | static | no | no | fixed flipbook URL |
| `video.thumbnail` | image | derived | no | no | YouTube thumbnail URL |
| `video.url` | video | static | no | no | fixed YouTube embed URL |
| `video.playControl` | button | derived | no | no | local `isVideoPlaying` state |

#### Conditional behavior

- Thumbnail/play UI is replaced by an iframe only after activation.
- CMS `eyebrow`, `imageId`, CTA ID and download media ID have no matching production values in this JSX.

#### Responsive behavior

- One column until `lg`, then two columns.
- Heading line break is hidden below `md`; video play control grows at `md`.

### `home.stats`

#### Production files

```text
src/web/components/HomeView.tsx
src/web/data/homeData.ts
src/shared/components/Counter.tsx
```

#### Production structure

```text
Statistics
└── items[]
    ├── animated numeric value
    ├── suffix
    └── label
```

#### Elements

| Path | Representation | Ownership | Optional | Repeatable | Source |
| --- | --- | --- | --- | --- | --- |
| `items[]` | grid-item | embedded | no | yes | `homeStats` fixture |
| `items[].val` | statistic-value | embedded | no | no | `homeStats[].val` |
| `items[].suffix` | label | embedded | no | no | `homeStats[].suffix` |
| `items[].label` | label | embedded | no | no | `homeStats[].label` |

#### Conditional behavior

- `Counter` animates from zero to the value over two seconds after mount.

#### Responsive behavior

- Two columns by default, four at `md`; dividing borders start at `md`.

### `home.awards`

#### Production files

```text
src/web/components/HomeView.tsx
src/web/components/AwardsSlider.tsx
src/web/data/homeData.ts
```

#### Production structure

```text
Awards
├── SectionHeader(title, subtitle, separator)
└── AwardsSlider
    ├── previous/next controls
    └── repeated viewport items[]
        └── award card(image, name)
```

#### Elements

| Path | Representation | Ownership | Optional | Repeatable | Source |
| --- | --- | --- | --- | --- | --- |
| `title` | text | static | no | no | hardcoded `SectionHeader` prop |
| `subtitle` | text | static | no | no | hardcoded `SectionHeader` prop |
| `items[]` | slide | embedded | no | yes | `homeAwards` |
| `items[].img` | image | embedded | no | no | award fixture |
| `items[].name` | text | embedded | no | no | award fixture |
| `navigation` | button | derived | no | yes | slider state |
| `extendedAwards` | hidden/config-only | derived | no | yes | three copies for looping |

#### Conditional behavior

- Auto-play pauses on hover or when the `paused` prop is true.
- The loop resets after reaching the source item count.

#### Responsive behavior

- Items per page: 1 below 480, then 2/3/4, and 5 from 1024 px.
- Supports touch swipe; control and card sizes increase at `sm`/`md`.

### `home.ecosystem`

#### Production files

```text
src/web/components/HomeView.tsx
```

#### Production structure

```text
Technology ecosystem
├── clickable heading, separator, subtitle/link hint
├── search field
└── mixed solution grid
    ├── large AI feature card
    ├── BIM service card
    ├── four compact solution cards
    └── full-width industry CTA card
```

#### Elements

| Path | Representation | Ownership | Optional | Repeatable | Source |
| --- | --- | --- | --- | --- | --- |
| `title` | text | static | no | no | hardcoded JSX |
| `subtitle` | text | static | no | no | hardcoded JSX |
| `search` | hidden/config-only | derived | no | no | uncontrolled input; no filtering found |
| `featureCard.badge` | badge | static | no | no | hardcoded |
| `featureCard.icon` | icon | static | no | no | `BIMIcon` |
| `featureCard.title` | text | static | no | no | hardcoded |
| `featureCard.description` | text | static | no | no | hardcoded |
| `featureCard.action` | button | static | no | no | hardcoded Products navigation |
| `bimCard` | card | static | no | no | hardcoded service content/navigation |
| `compactCards[]` | grid-item | static | no | yes | inline array of four objects |
| `compactCards[].title` | text | static | no | no | inline object |
| `compactCards[].desc` | text | static | no | no | inline object |
| `industryCard.icon` | icon | static | no | no | `Globe` |
| `industryCard.title` | text | static | no | no | hardcoded |
| `industryCard.description` | text | static | no | no | hardcoded |
| `industryCard.action` | button | static | no | no | Products navigation |
| `backgroundLayer` | decorative | static | no | no | slate overlay |

#### Conditional behavior

- Individual cards navigate to Product or Service views; one service card supplies a fixed service ID.
- CMS declares Product and Service references, but the rendered cards are not created from them.

#### Responsive behavior

- One-column grid, two columns at `md`, asymmetric 12-column Bento layout at `lg`.
- Industry card changes from stacked to row at `md`.

### `home.projects`

#### Production files

```text
src/web/components/HomeView.tsx
src/web/data/mockData.ts
src/shared/types/index.ts
```

#### Production structure

```text
Projects
├── SectionHeader
├── category tabs + search input
├── filtered project cards[0..3]
│   ├── image
│   ├── ordinal badge
│   ├── normal summary(category, short/name, client/location)
│   └── expanded overlay(category, location, name, client?, tags[0..2], detail CTA)
├── empty result
├── view-all CTA
└── optional project detail dialog
```

#### Elements

| Path | Representation | Ownership | Optional | Repeatable | Source |
| --- | --- | --- | --- | --- | --- |
| `title` | text | static | no | no | hardcoded header prop |
| `subtitle` | text | static | no | no | hardcoded header prop |
| `tabs[]` | button | static | no | yes | inline filter list |
| `search` | hidden/config-only | derived | no | no | local filter state |
| `projects[]` | reference-card | reference | no | yes | declared Project references; runtime `projects` fixture |
| `projects[].img` | image | derived | no | no | Project entity/fixture |
| `projects[].category/type` | badge | derived | yes | no | Project entity/fixture with type fallback |
| `projects[].location` | label | derived | no | no | Project entity/fixture |
| `projects[].name` | text | derived | no | no | Project entity/fixture |
| `projects[].short` | text | derived | yes | no | fallback to name |
| `projects[].client` | text | derived | yes | no | conditional |
| `projects[].tags[]` | badge | derived | yes | yes | first two in card |
| `projects[].ordinal` | badge | derived | no | no | visible index |
| `projects[].detailCTA` | button | static | no | no | hardcoded label |
| `emptyState` | text | derived | yes | no | when no filtered projects |
| `viewAllCTA` | button | static | no | no | hardcoded |
| `detailDialog` | card | derived | yes | no | rendered only when `selectedProject` is set |

#### Conditional behavior

- Category/search filters derive the list and only the first three render.
- Hover/focus changes card flex width and swaps below-card text for an overlay.
- Client and tags are conditional. The detail dialog exists in code, although normal card navigation currently leaves the Home view.

#### Responsive behavior

- Cards stack below `md`; become a flex row with hover expansion from `md`.
- Filter controls stack until `md`; image aspect remains 16:9.

### `home.events`

#### Production files

```text
src/web/components/HomeView.tsx
```

#### Production structure

```text
Events
├── SectionHeader
├── three state tabs
├── featured event card
│   ├── image, status badge, logo overlay
│   ├── title, description
│   ├── date/time, location
│   └── registration CTA
├── secondary event cards[3]
│   └── image, watermark, title, date, location, detail cue
└── view-all CTA
```

#### Elements

| Path | Representation | Ownership | Optional | Repeatable | Source |
| --- | --- | --- | --- | --- | --- |
| `title` | text | static | no | no | hardcoded header prop |
| `subtitle` | text | static | no | no | hardcoded header prop |
| `tabs[]` | button | static | no | yes | inline list; state does not change displayed data |
| `events[]` | reference-card | reference | no | yes | Event reference declared; runtime cards hardcoded |
| `featured.image` | image | static | no | no | fixed URL |
| `featured.status` | badge | static | no | no | hardcoded |
| `featured.logo` | logo | static | no | no | `/logo.png` |
| `featured.title` | text | static | no | no | hardcoded |
| `featured.description` | text | static | no | no | hardcoded |
| `featured.dateTime` | label | static | no | no | hardcoded |
| `featured.location` | label | static | no | no | hardcoded |
| `featured.registrationCTA` | button | static | no | no | fixed event ID |
| `secondary[]` | list-item | static | no | yes | inline array of three |
| `secondary[].img/title/date/loc` | card | static | no | no | inline object fields |
| `viewAllCTA` | button | static | no | no | hardcoded |
| `techGrid` | decorative | static | no | no | background layer |

#### Conditional behavior

- Tabs update local state but all branches currently render the same fixed event cards.

#### Responsive behavior

- Single column until `lg`, then featured card spans 7/12 and secondary list 5/12.
- Featured image height increases at `sm` and `md`.

### `home.news`

#### Production files

```text
src/web/components/HomeView.tsx
src/web/data/mockData.ts
src/shared/types/index.ts
```

#### Production structure

```text
News
├── SectionHeader
├── category buttons[]
├── first three filtered news cards[]
│   ├── image, logo watermark, category badge
│   ├── date, title, excerpt
│   └── read-more cue
├── empty state
└── view-all CTA
```

#### Elements

| Path | Representation | Ownership | Optional | Repeatable | Source |
| --- | --- | --- | --- | --- | --- |
| `title` | text | static | no | no | hardcoded header prop |
| `subtitle` | text | static | no | no | hardcoded header prop |
| `categories[]` | button | static | no | yes | inline list |
| `news[]` | reference-card | reference | no | yes | News reference declared; runtime `newsItems` fixture |
| `news[].img` | image | derived | no | no | News entity/fixture |
| `news[].category` | badge | derived | no | no | category-to-label switch |
| `news[].date` | label | derived | no | no | News entity/fixture |
| `news[].title` | text | derived | no | no | News entity/fixture |
| `news[].desc` | text | derived | no | no | News entity/fixture |
| `readMore` | link | static | no | no | hardcoded cue |
| `emptyState` | card | derived | yes | no | when filtered list is empty |
| `watermark` | decorative | static | no | no | `/logo.png` |
| `viewAllCTA` | button | static | no | no | hardcoded |

#### Conditional behavior

- “All” excludes investor news; other categories filter exactly. Only three cards render.
- Empty state replaces the card grid when no item matches.

#### Responsive behavior

- One/two/three columns at base/`md`/`lg`.
- Category row horizontally scrolls when needed.

### `home.partners`

#### Production files

```text
src/web/components/HomeView.tsx
src/web/data/mockData.ts
```

#### Production structure

```text
Partners
├── SectionHeader
├── left/right gradient masks
└── marquee of duplicated partner cards[]
    └── logo image + alt name
```

#### Elements

| Path | Representation | Ownership | Optional | Repeatable | Source |
| --- | --- | --- | --- | --- | --- |
| `title` | text | static | no | no | hardcoded header prop |
| `subtitle` | text | static | no | no | hardcoded header prop |
| `partners[]` | reference-card | reference | no | yes | Partner reference declared; runtime `partners` fixture |
| `partners[].logo` | logo | derived | no | no | Partner entity/fixture |
| `partners[].name` | label | derived | no | no | used as image alt text |
| `marqueeCopies` | hidden/config-only | derived | no | yes | array duplicated for loop |
| `gradientMasks` | decorative | static | no | yes | left/right overlays |

#### Conditional behavior

- No data condition; an empty list yields an empty marquee.

#### Responsive behavior

- Cards grow from 176×80 to 192×96 at `md`; logo max height also increases.

### `home.contact_cta`

#### Production files

```text
src/web/components/HomeView.tsx
```

#### Production structure

```text
Contact CTA
├── heading + highlighted line
├── description
├── hotline item(icon, label, value)
├── email item(icon, label, value)
└── consultation form
    ├── title
    ├── name, phone, service, message fields
    ├── submit button
    └── conditional success overlay
```

#### Elements

| Path | Representation | Ownership | Optional | Repeatable | Source |
| --- | --- | --- | --- | --- | --- |
| `title` | rich-text | static | no | no | hardcoded JSX |
| `description` | text | static | no | no | hardcoded JSX |
| `phone` | text | static | no | no | hardcoded |
| `email` | text | static | no | no | hardcoded |
| `contactItems[]` | list-item | static | no | yes | two hardcoded blocks |
| `form` | hidden/config-only | config | no | no | local React form, not resolved from CMS `formId` |
| `form.fullName` | label | derived | no | no | controlled input |
| `form.phoneNumber` | label | derived | no | no | controlled input |
| `form.interestService` | list-item | static | no | yes | four hardcoded options |
| `form.message` | text | derived | yes | no | controlled textarea |
| `submitLabel` | button | static | no | no | hardcoded |
| `successOverlay` | card | derived | yes | no | shown after valid submit |
| `backgroundGlow` | decorative | static | no | no | blurred orange circle |

#### Conditional behavior

- Success overlay appears after name and phone are non-empty and clears after five seconds.

#### Responsive behavior

- Main columns split at `lg`; name/phone split at `sm`.

### `about.hero`

#### Production files

```text
src/web/components/AboutView.tsx
```

#### Production structure

```text
About hero
├── background image
├── autoplay background video
├── two gradient overlays
├── badge + pulse dot
├── heading with highlighted span
└── subtitle
```

#### Elements

| Path | Representation | Ownership | Optional | Repeatable | Source |
| --- | --- | --- | --- | --- | --- |
| `backgroundImage` | background-image | static | no | no | fixed Unsplash URL |
| `backgroundVideo` | video | static | no | no | fixed Pixabay URL |
| `badge` | badge | static | no | no | hardcoded |
| `title` | rich-text | static | no | no | hardcoded JSX |
| `subtitle` | text | static | no | no | hardcoded JSX |
| `gradients[]` | decorative | static | no | yes | two overlays |

#### Conditional behavior

- Background video is always mounted with autoplay, loop, muted, and playsInline.

#### Responsive behavior

- Padding increases at `lg`; heading uses viewport-relative size on the smallest viewport and breakpoint sizes above `sm`.

### `about.overview`

#### Production files

```text
src/web/components/AboutView.tsx
src/shared/components/Typography.tsx
```

#### Production structure

```text
Overview
├── SectionHeader(title)
├── paragraphs[3]
└── YouTube iframe
```

#### Elements

| Path | Representation | Ownership | Optional | Repeatable | Source |
| --- | --- | --- | --- | --- | --- |
| `title` | text | static | no | no | hardcoded header prop |
| `paragraphs[]` | text | static | no | yes | three hardcoded paragraphs |
| `videoUrl` | video | static | no | no | fixed YouTube URL |

#### Conditional behavior

- Section renders only when the About tab is `overview`.
- CMS `imageId` exists but no standalone production image is rendered.

#### Responsive behavior

- One column until `lg`, then text and 16:9 video share two columns.

### `about.timeline`

#### Production files

```text
src/web/components/AboutView.tsx
```

#### Production structure

```text
Timeline
├── badge + pulse dot
├── heading
├── description
├── desktop connector line
└── milestones[5]
    ├── desktop dot + ping
    ├── year
    └── description
```

#### Elements

| Path | Representation | Ownership | Optional | Repeatable | Source |
| --- | --- | --- | --- | --- | --- |
| `badge` | badge | static | no | no | hardcoded |
| `title` | text | static | no | no | hardcoded |
| `description` | text | static | no | no | hardcoded |
| `milestones[]` | list-item | embedded | no | yes | inline array |
| `milestones[].year` | statistic-value | embedded | no | no | inline object |
| `milestones[].title` | hidden/config-only | embedded | no | no | present in inline data but not rendered |
| `milestones[].desc` | text | embedded | no | no | inline object |
| `connector/dots` | decorative | static | yes | yes | hidden on mobile |

#### Conditional behavior

- Section exists only in the `overview` tab.
- `milestones[].title` is data present but unused by JSX.

#### Responsive behavior

- Vertical stack below `md`; five-column horizontal timeline with connector/dots from `md`.

### `about.strategy`

#### Production files

```text
src/web/components/AboutView.tsx
```

#### Production structure

```text
Strategy
├── SectionHeader
├── desktop illustration + gradient
└── strategy cards
    ├── mission(icon, title, description)
    ├── vision(icon, title, description)
    └── core values(icon, title, values[5])
```

#### Elements

| Path | Representation | Ownership | Optional | Repeatable | Source |
| --- | --- | --- | --- | --- | --- |
| `title` | text | static | no | no | hardcoded header prop |
| `subtitle` | text | static | no | no | hardcoded header prop |
| `illustration` | image | static | yes | no | `/35nam_cic_1.JPG`, desktop only |
| `mission.icon/title/description` | card | static | no | no | hardcoded JSX |
| `vision.icon/title/description` | card | static | no | no | hardcoded JSX |
| `coreValues.title/icon` | card | static | no | no | hardcoded JSX |
| `coreValues.items[]` | list-item | embedded | no | yes | inline string array |
| `illustrationGradient` | decorative | static | yes | no | follows desktop image |

#### Conditional behavior

- Section exists only in `overview`; illustration is hidden below `lg`.
- Imported `coreValues` data is not used for this rendered list.

#### Responsive behavior

- Single content column below `lg`; illustration/content split at `lg`.
- Strategy cards switch to row internals at `sm`.

### `about.offerings`

#### Production files

```text
src/web/components/AboutView.tsx
```

#### Production structure

```text
Offerings
├── SectionHeader
└── offering cards[7]
    ├── icon
    ├── title
    └── description
```

#### Elements

| Path | Representation | Ownership | Optional | Repeatable | Source |
| --- | --- | --- | --- | --- | --- |
| `title` | text | static | no | no | hardcoded header prop |
| `subtitle` | text | static | no | no | hardcoded header prop |
| `items[]` | grid-item | static | no | yes | inline array of seven |
| `items[].icon` | icon | static | no | no | JSX icon in inline object |
| `items[].title` | text | static | no | no | inline object |
| `items[].desc` | text | static | no | no | inline object |

#### Conditional behavior

- Section is in `overview` only.
- CMS declares Product and Service references, but production renders neither Product nor Service entities here.

#### Responsive behavior

- One/two/four columns at base/`md`/`lg`.

### `about.awards`

#### Production files

```text
src/web/components/AboutView.tsx
src/web/components/AwardsSlider.tsx
src/web/data/homeData.ts
```

#### Production structure

```text
About awards
├── SectionHeader
├── explanatory paragraph
└── AwardsSlider → award cards(image, name)
```

#### Elements

| Path | Representation | Ownership | Optional | Repeatable | Source |
| --- | --- | --- | --- | --- | --- |
| `title` | text | static | no | no | hardcoded |
| `subtitle` | text | static | no | no | hardcoded |
| `description` | text | static | no | no | hardcoded paragraph; absent from CMS schema |
| `items[]` | slide | embedded | no | yes | same `homeAwards` fixture as Home |
| `items[].img` | image | embedded | no | no | award fixture |
| `items[].name` | text | embedded | no | no | award fixture |
| `navigation` | button | derived | no | yes | `AwardsSlider` |

#### Conditional behavior

- Renders in `overview`; slider auto-plays because no `paused` prop is supplied.

#### Responsive behavior

- Same 1/2/3/4/5 item slider behavior documented for `home.awards`.

### `about.partners`

#### Production files

```text
src/web/components/AboutView.tsx
src/web/data/mockData.ts
```

#### Production structure

```text
About partners
├── SectionHeader
├── explanatory paragraph
├── static photo gallery[4]
│   └── image + hover gradient
└── duplicated partner marquee[]
    └── logo image
```

#### Elements

| Path | Representation | Ownership | Optional | Repeatable | Source |
| --- | --- | --- | --- | --- | --- |
| `title` | text | static | no | no | hardcoded |
| `subtitle` | text | static | no | no | hardcoded |
| `description` | text | static | no | no | hardcoded; absent from CMS schema |
| `gallery[]` | gallery-item | static | no | yes | four fixed Unsplash images |
| `gallery[].image` | image | static | no | no | fixed URL |
| `gallery[].hoverGradient` | decorative | static | no | no | JSX overlay |
| `partners[]` | reference-card | reference | no | yes | declared Partner refs; runtime `partners` fixture |
| `partners[].logo` | logo | derived | no | no | Partner entity/fixture |
| `partners[].name` | label | derived | no | no | image alt |
| `gradientMasks` | decorative | static | no | yes | marquee edges |

#### Conditional behavior

- Renders in `overview`; partner array is duplicated for the continuous marquee.

#### Responsive behavior

- Photo gallery is one column below `md`, then a 12-column Bento grid.
- Partner card/logo sizing increases at `md`.

### `about.organization`

#### Production files

```text
src/web/components/AboutView.tsx
```

#### Production structure

```text
Organization
├── SectionHeader
└── SVG organization chart
    ├── definitions/style/filter
    ├── connector lines
    └── organization nodes
        ├── rect
        └── one or two text lines
```

#### Elements

| Path | Representation | Ownership | Optional | Repeatable | Source |
| --- | --- | --- | --- | --- | --- |
| `title` | text | static | no | no | hardcoded header prop |
| `chart` | image | static | no | no | inline SVG, viewBox 1600×560 |
| `chart.connectors[]` | decorative | static | no | yes | inline SVG lines |
| `chart.nodes[]` | card | static | no | yes | inline SVG groups |
| `chart.nodes[].labelLines[]` | text | static | no | yes | inline SVG text |
| `chart.filter/style` | decorative | static | no | no | inline SVG definitions |

#### Conditional behavior

- Rendered only for the `structure` About tab. Several state variables for structure modes/zoom/fullscreen are declared but not used in the shown chart.

#### Responsive behavior

- SVG scales fluidly to width. Container can scroll horizontally below `lg`; overflow becomes visible at `lg`.

### `about.capacity`

#### Production files

```text
src/web/components/AboutView.tsx
```

#### Production structure

```text
Capacity
├── heading with highlighted line
├── separator
├── description
└── metrics[4]
    ├── value
    └── label
```

#### Elements

| Path | Representation | Ownership | Optional | Repeatable | Source |
| --- | --- | --- | --- | --- | --- |
| `title` | rich-text | static | no | no | hardcoded JSX |
| `description` | text | static | no | no | hardcoded JSX |
| `metrics[]` | grid-item | embedded | no | yes | four hardcoded JSX cards |
| `metrics[].value` | statistic-value | embedded | no | no | hardcoded |
| `metrics[].label` | label | embedded | no | no | hardcoded |
| `separator` | decorative | static | no | no | orange rule |

#### Conditional behavior

- Rendered only for the `experience` tab.

#### Responsive behavior

- Two columns by default, four at `md`; font/padding increase by breakpoint.

### `about.experience`

#### Production files

```text
src/web/components/AboutView.tsx
```

#### Production structure

```text
Experience
└── experience rows[3]
    ├── image
    ├── title
    └── description
```

#### Elements

| Path | Representation | Ownership | Optional | Repeatable | Source |
| --- | --- | --- | --- | --- | --- |
| `items[]` | list-item | static | no | yes | three hardcoded JSX rows |
| `items[].image` | image | static | no | no | fixed Unsplash URL |
| `items[].title` | text | static | no | no | hardcoded |
| `items[].description` | text | static | no | no | hardcoded |

#### Conditional behavior

- Nested inside the `about.capacity` production subtree and rendered only for the `experience` tab.
- CMS stores `title` and `categoryKeys`; neither drives these three rows.

#### Responsive behavior

- Rows are one column below `md`, two columns above; the second row reverses visual order at `md`.

### `about.software_partners`

#### Production files

```text
src/cms/modules/static_pages/pageBuilderRegistry.ts
src/cms/modules/static_pages/pageBuilderDraftSchema.ts
src/cms/modules/static_pages/pageBuilderMockData.json
src/web/data/aboutData.ts
```

#### Production structure

```text
UNKNOWN — no `data-page-builder-section-key` node, switch branch, or rendered use of `softwarePartners` found.
```

#### Elements

| Path | Representation | Ownership | Optional | Repeatable | Source |
| --- | --- | --- | --- | --- | --- |
| `title` | UNKNOWN | config | unknown | no | CMS config only |
| `partners[]` | reference-card | reference | unknown | yes | Partner references; unused `softwarePartners` fixture also exists |

#### Conditional behavior

- This key is filtered out of all exported Page Builder templates.

#### Responsive behavior

- UNKNOWN.

#### Unknowns

- No production component was found.

### `about.hardware_partners`

#### Production files

```text
src/cms/modules/static_pages/pageBuilderRegistry.ts
src/cms/modules/static_pages/pageBuilderDraftSchema.ts
src/cms/modules/static_pages/pageBuilderMockData.json
src/web/data/aboutData.ts
```

#### Production structure

```text
UNKNOWN — no production renderer found.
```

#### Elements

| Path | Representation | Ownership | Optional | Repeatable | Source |
| --- | --- | --- | --- | --- | --- |
| `title` | UNKNOWN | config | unknown | no | CMS config only |
| `partners[]` | reference-card | reference | unknown | yes | Partner references; unused `hardwarePartners` fixture also exists |

#### Conditional behavior

- This key is filtered out of all exported Page Builder templates.

#### Responsive behavior

- UNKNOWN.

#### Unknowns

- No production component was found.

### `about.contact_cta`

#### Production files

```text
src/web/components/AboutView.tsx
```

#### Production structure

```text
Profile CTA link
├── icon
└── label
```

#### Elements

| Path | Representation | Ownership | Optional | Repeatable | Source |
| --- | --- | --- | --- | --- | --- |
| `cta.href` | link | static | no | no | fixed flipbook URL |
| `cta.label` | text | static | no | no | hardcoded |
| `cta.icon` | icon | static | no | no | `ArrowUpRight` |

#### Conditional behavior

- Rendered only in the `experience` tab. CMS `title`, `description`, and `ctaId` do not drive this production link.

#### Responsive behavior

- Inline-flex CTA with fixed responsive-safe padding; no structural breakpoint branch.

### `contact.header`

#### Production files

```text
src/web/components/ContactView.tsx
```

#### Production structure

```text
Contact header
├── title
└── subtitle
```

#### Elements

| Path | Representation | Ownership | Optional | Repeatable | Source |
| --- | --- | --- | --- | --- | --- |
| `title` | text | static | no | no | hardcoded JSX |
| `subtitle` | text | static | no | no | hardcoded JSX |

#### Conditional behavior

- Always rendered on Contact.

#### Responsive behavior

- Column layout below `md`, row/end-aligned layout from `md`.

### `contact.branches`

#### Production files

```text
src/web/components/ContactView.tsx
```

#### Production structure

```text
Branches
├── heading + accent
├── branch tabs[2]
└── active branch
    ├── name
    ├── address
    ├── phone, email, optional fax
    ├── working hours
    ├── external Google Maps link
    └── lazy Google Maps iframe
```

#### Elements

| Path | Representation | Ownership | Optional | Repeatable | Source |
| --- | --- | --- | --- | --- | --- |
| `title` | text | static | no | no | hardcoded heading |
| `branches[]` | list-item | embedded | no | yes | local `branches` object |
| `branches[].name` | text | embedded | no | no | branch object |
| `branches[].address` | text | embedded | no | no | branch object |
| `branches[].tel` | link | embedded | no | no | displayed as text |
| `branches[].email` | link | embedded | no | no | displayed as text |
| `branches[].fax` | text | embedded | yes | no | truthy condition |
| `branches[].workingHours` | label | embedded | no | no | branch object |
| `branches[].searchQuery` | hidden/config-only | embedded | no | no | Maps link query |
| `branches[].mapUrl` | hidden/config-only | embedded | no | no | iframe URL |
| `branchTabs[]` | button | derived | no | yes | keys/labels hardcoded |
| `map` | video | derived | no | no | active branch iframe |

#### Conditional behavior

- Only the active branch subtree renders; fax appears only when truthy.

#### Responsive behavior

- Header/tabs stack below `sm`; info cards split into two columns at `md`.
- Contact page main layout becomes 7/12 + 5/12 at `lg`.

### `contact.form`

#### Production files

```text
src/web/components/ContactView.tsx
```

#### Production structure

```text
Contact form
├── title
├── form state
│   ├── full name
│   ├── email
│   ├── phone
│   ├── subject
│   ├── note
│   ├── arithmetic captcha
│   ├── per-field errors
│   └── submit action
└── conditional success card
    ├── status title + lead ID
    ├── customer/subject/contact summary
    └── reset button
```

#### Elements

| Path | Representation | Ownership | Optional | Repeatable | Source |
| --- | --- | --- | --- | --- | --- |
| `title` | text | static | no | no | hardcoded |
| `formId` | hidden/config-only | config | no | no | declared by CMS but not resolved in production |
| `fields.fullName/email/phone/subject` | label | config | no | yes | local controlled fields |
| `fields.note` | text | config | yes | no | local textarea |
| `captcha` | hidden/config-only | derived | no | no | random arithmetic state |
| `errors[]` | label | derived | yes | yes | validation result |
| `submitLabel` | button | static | no | no | changes while submitting |
| `successCard` | card | derived | yes | no | `successLead` condition |
| `successCard.leadId/name/subject/email/phone` | text | derived | yes | no | submitted lead state |

#### Conditional behavior

- Form and success card are mutually exclusive.
- Validation errors render per required field; submit is disabled while submitting.

#### Responsive behavior

- Email/phone fields split at `md`; otherwise form is single-column.

### `contact.security`

#### Production files

```text
src/web/components/ContactView.tsx
```

#### Production structure

```text
Security notice
├── shield icon
├── title
└── description
```

#### Elements

| Path | Representation | Ownership | Optional | Repeatable | Source |
| --- | --- | --- | --- | --- | --- |
| `icon` | icon | static | no | no | `ShieldCheck` |
| `title` | text | static | no | no | hardcoded |
| `description` | text | static | no | no | hardcoded |
| `policyPageId` | hidden/config-only | config | yes | no | CMS schema only; no production link is rendered |

#### Conditional behavior

- Always rendered below the form.

#### Responsive behavior

- Text size increases at `sm`; no structural layout change.

### `legal.header`

#### Production files

```text
src/cms/modules/static_pages/PageBuilderVisualCanvas.tsx
src/web/components/LegalArticleLayout.tsx
src/web/components/PrivacyPolicyView.tsx
src/web/components/TermsOfUseView.tsx
```

#### Production structure

```text
CMS preview header
├── category tag
├── title
├── subtitle
└── updated date + reading time

Public legal header
├── breadcrumb
├── category tag
├── title
├── subtitle
├── updated date + reading time
└── static company attribution
```

#### Elements

| Path | Representation | Ownership | Optional | Repeatable | Source |
| --- | --- | --- | --- | --- | --- |
| `categoryTag` | badge | embedded | no | no | CMS header config / public view props |
| `title` | text | embedded | no | no | CMS header config / public view props |
| `subtitle` | text | embedded | no | no | CMS header config / public view props |
| `lastUpdated` | label | embedded | no | no | CMS header config / public view props |
| `readingTime` | label | embedded | yes | no | CMS header config / public view props |
| `breadcrumb` | link | static | no | no | public layout only |
| `companyAttribution` | label | static | no | no | public layout only |
| `separator/icons` | decorative | static | no | yes | public layout only |

#### Conditional behavior

- CMS preview assumes the first draft section is the header.
- Public legal header values are hardcoded separately in each public legal view, not read from Page Builder data.

#### Responsive behavior

- Header padding and heading size increase at `sm`/`lg`; metadata wraps.

### `legal.content`

#### Production files

```text
src/cms/modules/static_pages/pageBuilderData.ts
src/cms/modules/static_pages/PageBuilderVisualCanvas.tsx
```

#### Production structure

```text
Legal content
└── rich-text HTML subtree
    └── arbitrary headings, paragraphs, lists, links, and inline content
```

#### Elements

| Path | Representation | Ownership | Optional | Repeatable | Source |
| --- | --- | --- | --- | --- | --- |
| `richTextHtml` | rich-text | embedded | no | no | normalized legacy sections or legal-page authoring |
| `richTextHtml.*` | UNKNOWN | embedded | yes | yes | arbitrary HTML supplied to `dangerouslySetInnerHTML` |

#### Conditional behavior

- CMS renderer uses rich text when `richTextHtml` is a string; otherwise it falls back to legacy `blocks` or `description`.

#### Responsive behavior

- Container padding changes at `sm`/`lg`; HTML structure itself is content-dependent.

#### Unknowns

- Allowed/sanitized rich-text element set is not defined in the production renderer.

### `privacy.collection`

#### Production files

```text
src/cms/modules/static_pages/pageBuilderMockData.json
src/cms/modules/static_pages/pageBuilderData.ts
src/web/components/PrivacyPolicyView.tsx
src/web/components/LegalArticleLayout.tsx
```

#### Production structure

```text
Legacy legal section
├── numbered heading
└── paragraphs[2], including one external link
```

#### Elements

| Path | Representation | Ownership | Optional | Repeatable | Source |
| --- | --- | --- | --- | --- | --- |
| `title` | text | embedded | no | no | legacy CMS block / public static section |
| `blocks[]` | list-item | embedded | no | yes | legacy CMS data |
| `content.paragraphs[]` | rich-text | static | no | yes | public `PrivacyPolicyView` React nodes |
| `content.link` | link | static | yes | no | public first paragraph |

#### Conditional behavior

- Normalized into `legal.content.richTextHtml` in active Page Builder pages; not retained as an active section key.

#### Responsive behavior

- Uses shared `LegalArticleLayout` typography/padding.

### `privacy.usage`

#### Production files

```text
src/cms/modules/static_pages/pageBuilderMockData.json
src/cms/modules/static_pages/pageBuilderData.ts
src/web/components/PrivacyPolicyView.tsx
src/web/components/LegalArticleLayout.tsx
```

#### Production structure

```text
Legacy legal section
├── numbered heading
├── introductory paragraph
├── bullet items[6] with check icons
└── italic legal note
```

#### Elements

| Path | Representation | Ownership | Optional | Repeatable | Source |
| --- | --- | --- | --- | --- | --- |
| `title` | text | embedded | no | no | legacy CMS/public static section |
| `blocks[]` | list-item | embedded | no | yes | legacy CMS data |
| `content.intro` | text | static | no | no | public React node |
| `content.items[]` | list-item | static | no | yes | public inline array |
| `content.items[].icon` | icon | static | no | no | `CheckCircle2` |
| `content.note` | text | static | no | no | public React node |

#### Conditional behavior

- Normalized into `legal.content` for CMS pages.

#### Responsive behavior

- Shared legal layout only.

### `privacy.retention`

#### Production files

```text
src/cms/modules/static_pages/pageBuilderMockData.json
src/cms/modules/static_pages/pageBuilderData.ts
src/web/components/PrivacyPolicyView.tsx
```

#### Production structure

```text
Legacy legal section
├── numbered heading
└── paragraph
```

#### Elements

| Path | Representation | Ownership | Optional | Repeatable | Source |
| --- | --- | --- | --- | --- | --- |
| `title` | text | embedded | no | no | legacy CMS/public static section |
| `blocks[]` | list-item | embedded | no | yes | legacy CMS data |
| `content` | text | static | no | no | public React paragraph |

#### Conditional behavior

- Normalized into `legal.content` for CMS pages.

#### Responsive behavior

- Shared legal layout only.

### `privacy.access`

#### Production files

```text
src/cms/modules/static_pages/pageBuilderMockData.json
src/cms/modules/static_pages/pageBuilderData.ts
src/web/components/PrivacyPolicyView.tsx
```

#### Production structure

```text
Legacy legal section
├── numbered heading
└── paragraphs[2], including an external link
```

#### Elements

| Path | Representation | Ownership | Optional | Repeatable | Source |
| --- | --- | --- | --- | --- | --- |
| `title` | text | embedded | no | no | legacy CMS/public static section |
| `blocks[]` | list-item | embedded | no | yes | legacy CMS data |
| `content.paragraphs[]` | rich-text | static | no | yes | public React nodes |
| `content.link` | link | static | yes | no | public second paragraph |

#### Conditional behavior

- Normalized into `legal.content` for CMS pages.

#### Responsive behavior

- Shared legal layout only.

### `privacy.commitment`

#### Production files

```text
src/cms/modules/static_pages/pageBuilderMockData.json
src/cms/modules/static_pages/pageBuilderData.ts
src/web/components/PrivacyPolicyView.tsx
```

#### Production structure

```text
Legacy legal section
├── numbered heading
├── paragraphs[2]
└── highlighted notice(title, paragraph)
```

#### Elements

| Path | Representation | Ownership | Optional | Repeatable | Source |
| --- | --- | --- | --- | --- | --- |
| `title` | text | embedded | no | no | legacy CMS/public static section |
| `blocks[]` | list-item | embedded | no | yes | legacy CMS data |
| `content.paragraphs[]` | text | static | no | yes | public React nodes |
| `content.notice` | card | static | no | no | public React node |
| `content.notice.title` | label | static | no | no | hardcoded |
| `content.notice.text` | text | static | no | no | hardcoded |

#### Conditional behavior

- Normalized into `legal.content` for CMS pages.

#### Responsive behavior

- Shared legal layout only.

### `legal.assistance`

#### Production files

```text
src/cms/modules/static_pages/pageBuilderMockData.json
src/cms/modules/static_pages/pageBuilderData.ts
src/web/components/LegalArticleLayout.tsx
```

#### Production structure

```text
Legal assistance card
├── shield icon + title
├── description
├── phone link
└── email link
```

#### Elements

| Path | Representation | Ownership | Optional | Repeatable | Source |
| --- | --- | --- | --- | --- | --- |
| `title` | text | static | no | no | public layout hardcoded; legacy CMS has parallel value |
| `description` | text | static | no | no | public layout hardcoded; legacy CMS has parallel value |
| `phone` | link | static | no | no | hardcoded `tel:` value |
| `email` | link | static | no | no | hardcoded `mailto:` value |
| `icon` | icon | static | no | no | `ShieldCheck` |

#### Conditional behavior

- Always appended by public `LegalArticleLayout`; the legacy CMS section is flattened into `legal.content` during Page Builder normalization.

#### Responsive behavior

- Assistance padding and text sizes increase at `sm`; links wrap.

## D. Coverage Gaps

1. **No shared production section registry exists.** The registry in `pageBuilderRegistry.ts` contains labels and limits, not production components. Production routing is page-level and section JSX is embedded in view files.
2. **Two declared sections have no renderer:** `about.software_partners` and `about.hardware_partners`. They occur in source mock data/schema/registry and have corresponding fixture arrays, but are filtered out of exported templates and absent from production JSX.
3. **CMS data is not the runtime source for most production sections.** Home/About/Contact views read hardcoded JSX and fixtures. Draft config/references are parallel models, not a verified production read model.
4. **Declared reference collections do not currently drive cards.** Product, Service, Project, Event, News, and Partner references exist in Page Builder data, but production Home/About cards use inline data or `src/web/data/*` fixtures.
5. **Schema/production shape mismatches exist:**
   - Hero schema has badge, CTA IDs, ticker items, and media IDs; production uses static badge/actions and `HeroSlide.img/title/sub`.
   - `home.intro` declares eyebrow/image/media IDs; production lacks eyebrow and standalone image.
   - `home.ecosystem` and `about.offerings` declare references, while production renders static bespoke cards.
   - `home.events` references events, while production event cards are hardcoded and tab state does not alter content.
   - `about.timeline` data includes milestone `title`, but production does not render it.
   - `about.experience` declares `title/categoryKeys`, while production renders three hardcoded image/text rows.
   - Contact form IDs and security policy page ID are not resolved by production.
6. **Legal production has two distinct renderers.** CMS preview uses local `LegalPage`; public routes use `PrivacyPolicyView`/`TermsOfUseView` plus `LegalArticleLayout`. They do not consume the same data at runtime and are not structurally identical.
7. **Legacy legal keys are normalized away.** The five `privacy.*` sections and `legal.assistance` exist in source fixtures/registry, but active Page Builder pages collapse them into one `legal.content` rich-text section. Public privacy still renders a separate static five-section structure and a static assistance box.
8. **Arbitrary rich-text descendants are unknown.** No explicit production allowlist/sanitization contract for `legal.content.richTextHtml` was found.
9. **Imported About datasets are broader than rendered section structures.** `aboutData.ts` exports core values, business fields/pillars, HR, experience, capacity, contracts, categories, and partner lists; several are unused by the currently rendered About section JSX. They are data candidates, not proof of production elements.
10. **Page-level chrome is outside section inventory.** `Header`, `Footer`, consultation modal, chatbot, and global contact controls are rendered by `App` around page views, not by Page Builder sections. They were located but intentionally excluded from section counts.

## Completeness Reconciliation

| Source | Count | Notes |
| --- | ---: | --- |
| `sectionDefinitions` keys | 35 | All appear in this document |
| `draftSectionSchemas` keys | 35 | Same key set as registry |
| Raw mock-data section keys | 34 | Does not contain normalized `legal.content`; contains legacy privacy/assistance keys |
| Production `data-page-builder-section-key` annotations | 25 | 10 Home + 11 About + 4 Contact |
| Additional CMS legal renderer keys | 2 | `legal.header`, `legal.content` |
| Declared-only without renderer | 2 | Software/hardware partner sections |
| Inventory section entries | 35 | Reconciles registry/schema completely |
