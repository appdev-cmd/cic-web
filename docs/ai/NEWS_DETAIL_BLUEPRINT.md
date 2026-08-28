# News detail page blueprint

Source of truth: `src/web/components/NewsView.tsx`, detail branch beginning at `VIEW 1: NEWS DETAIL VIEW`.

## Dependency trace

- Shell: `src/app/(public)/WebsiteShell.tsx` → `Header`, `Footer`, global widgets.
- Page coordinator (reference only): `NewsView` receives navigation callbacks from the legacy SPA.
- Detail sections: progress bar; hero/breadcrumb/meta/actions; ticker; article card; category-specific info boxes; rich content renderer; consultation form; related projects; related events; TOC; related products; latest-news; footer ticker.
- Data: legacy `getNewsData()` (reference); Next `features/news/server/queries.ts` and `NewsViewModel` (target). Related projections must come from approved project/event/product public queries, never fixtures.
- Shared normalization: `src/shared/lib/content.ts` resolves relative media to `https://www.cic.com.vn/` and injects stable heading anchors while preserving HTML.

## Responsive contract

- Desktop: `max-w-7xl`, `px-4 sm:px-6 lg:px-8`; detail grid `lg:grid-cols-12`; article `lg:col-span-8`; sidebar `lg:col-span-4`; article image `h-72 sm:h-[460px] lg:h-[500px]`.
- Tablet: single-column content until `lg`; cards/forms use `sm:grid-cols-2`; actions wrap; image uses `sm` height.
- Mobile: one column, `p-6` hero/article, hidden “Chia sẻ” label, wrapped actions/ticker, sidebar follows article, no horizontal overflow; touch targets remain at least 36px.
- Interactions: smooth TOC scrolling, ticker pause/subscribe, share/copy/PDF, consultation submit/success/error, hover image/card transitions, reduced-motion compatibility.

## Next mapping

Next route keeps this section order with a Server Component parent and small client islands (`NewsDetailActions`, consultation form, ticker/TOC only where state is required). Backend data is loaded server-side; no initial client fetch or mock runtime data.
