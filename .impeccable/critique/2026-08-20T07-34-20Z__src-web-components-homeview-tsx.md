---
target: Main website homepage
total_score: 17
max_score: 32
na_heuristics: 7,10
p0_count: 1
p1_count: 1
p2_count: 3
p3_count: 0
timestamp: 2026-08-20T07-34-20Z
slug: src-web-components-homeview-tsx
---
Method: dual-agent (A: 2ac34928 · B: detect.mjs + browser visualization)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2/4 | No scroll progress indicator or section awareness |
| 2 | Match System / Real World | 3/4 | "Hệ sinh thái Công nghệ CIC" header is abstract |
| 3 | User Control and Freedom | 1/4 | Fixed scroll transitions, no overlay escape mechanism |
| 4 | Consistency and Standards | 4/4 | Strong - consistent patterns throughout |
| 5 | Error Prevention | 2/4 | Basic validation only, no phone format checking |
| 6 | Recognition Rather Than Recall | 3/4 | Filter tabs reset context unexpectedly |
| 7 | Flexibility and Efficiency | n/a | Marketing landing page - not applicable |
| 8 | Aesthetic and Minimalist Design | 2/4 | Information-dense with 12 solution cards, 7 news categories |
| 9 | Error Recovery | 0/4 | No error states, no undo functionality |
| 10 | Help and Documentation | n/a | Marketing landing page - not applicable |
| **Total** | | **17/32** | **Acceptable** |

## Design Specificity Verdict

**LLM assessment**: Moderately product-specific. While the content (hero slides, project case studies like Landmark 81/highway construction, industry-specific partners like Autodesk/Bentley, construction terminology) is deeply grounded in CIC's domain, the visual language and interaction patterns (orange/slate color scheme, card grids, marquee animations, accordion layouts) are interchangeable with other B2B tech companies. A different B2B enterprise could reuse this template by swapping content—the design system is not uniquely tied to construction/transport/industrial, though the content execution is strong.

**Deterministic scan**: Found 4 instances of gray text on colored backgrounds (anti-pattern: gray-on-color) at lines 472, 565, 846, and 972. These cause contrast issues where slate-400/500/600 text appears on orange-600 or orange-50 backgrounds, making text difficult to read. The detector also identified these as quality warnings that should be addressed for better accessibility.

**Visual overlays**: Browser visualization was attempted but the injected detector reported "No anti-patterns found" in the console, which conflicts with the CLI scan results. The CLI scan is more reliable for this assessment.

## Overall Impression

The homepage establishes strong credibility through industry-specific content and polished motion design, but suffers from decision paralysis due to information density. The hero section peaks early with compelling messaging, but the middle sections (solutions grid, project accordion) create cognitive overload that undermines momentum. Accessibility is a significant concern with hover-only interactions and missing keyboard support.

## What's Working

- **Strong visual hierarchy with consistent motion design**: The hero section establishes authority with animated slides, and the Counter component in stats creates engagement. Hover states and transitions (project accordion expansion, card lifts) provide clear feedback, making the interface feel responsive and polished.

- **Industry-specific content builds credibility**: Real project case studies (Landmark 81, highway digital twins), legitimate partner logos (Autodesk, Bentley), and specific awards (Sao Khuê, VIFOTEC) create trust. The "35+ years" stat and government recognition (Labor Medal) are particularly effective for B2B buyers.

## Priority Issues

- **[P0] What: Missing accessibility attributes**
  - **Why it matters**: No ARIA labels on search inputs, no skip navigation link, focus states inconsistent. Project accordion uses hover-only interaction (inaccessible to keyboard users). Violates WCAG.
  - **Fix**: Add proper ARIA labels, ensure all interactive elements are keyboard-accessible, add skip link, ensure focus visible.
  - **Suggested command**: `/impeccable audit` HomeView.tsx for accessibility

- **[P1] What: Competing CTAs and navigation overwhelm**
  - **Why it matters**: Hero has two equal-weight buttons ("Khám phá giải pháp" vs "Về chúng tôi"), solutions section has 12 interactive cards, projects section has 4 tabs plus search. Users don't know where to start, increasing bounce rate.
  - **Fix**: Establish single primary CTA in hero. Collapse solutions to 3-4 featured items with "View all" link. Reduce project tabs to 2-3 or use visual filters instead of tabs.
  - **Suggested command**: `/impeccable distill` HomeView.tsx hero and solutions section

- **[P2] What: No escape mechanism for overlays**
  - **Why it matters**: Project detail overlay covers entire screen. Users can't close with Escape key or click outside. Mobile users may get trapped. Violates WCAG 2.1.1 (keyboard accessible).
  - **Fix**: Add Escape key handler, backdrop click to close, and visible close button that works on mobile.
  - **Suggested command**: `/impeccable harden` HomeView.tsx overlay interactions

- **[P2] What: Form validation is insufficient**
  - **Why it matters**: Phone number field only checks "required", no format validation. Users can submit invalid numbers, wasting sales team time. No inline error messages.
  - **Fix**: Add phone format validation (Vietnam: +84 or 10 digits), show inline errors, prevent submission until valid.
  - **Suggested command**: `/impeccable harden` contact form validation

- **[P2] What: Gray text on colored backgrounds**
  - **Why it matters**: Four instances of slate-400/500/600 text on orange-600 or orange-50 backgrounds create poor contrast, making content difficult to read and violating WCAG AA standards.
  - **Fix**: Replace gray text with white/near-white on dark backgrounds, or use darker shades of the background color for better contrast.
  - **Suggested command**: `/impeccable colorize` fix contrast issues in HomeView.tsx

## Persona Red Flags

**Jordan (First-Timer)**: Confused by 12 solution cards with no clear entry point. Doesn't know whether to click "Khám phá giải pháp" or "Về chúng tôi" in hero. May bounce before reaching contact form.

**Casey (Mobile User)**: Project accordion requires hover - impossible on touch devices. Mobile menu is complex with nested dropdowns. Contact form fields may be small on mobile. News ticker marquee is hidden on mobile.

**Riley (Stress Tester)**: Will try to break the search by entering nonsense - gets empty state with no guidance. Will test form with invalid phone numbers - succeeds when it shouldn't. Will try to close project modal with Escape - fails.

## Minor Observations

- News ticker marquee is hidden on mobile - mobile users miss this dynamic content
- Event section has hardcoded data instead of using upcomingHomeEvents/pastHomeEvents from data source
- Footer newsletter form has no validation or success state
- Project search filters real-time but may be slow with large datasets - no loading state
- YouTube video iframe loads with autoplay - may be blocked by browsers or annoy users with auto-play audio
- Language toggle is non-functional (Header shows VN/EN buttons but EN does nothing)

## Questions to Consider

- Why are there 12 solution cards when users typically only consider 2-3 options? Should this be collapsed to featured items with a "View all" link?
- Should the project accordion be click-to-expand instead of hover-only for better accessibility on touch devices?
- Is the "Tư vấn ngay" button in header competing with the contact form at the bottom? Should they serve different purposes?
- Why does the news section show 7 category tabs when only 4-5 categories have content?
- Should the hero carousel auto-play (6-second interval) or let users control it? Auto-play may distract from the message.
