# UI Preservation

## Source of truth

Giao diện React hiện tại là **source of truth** cho migration. Mục tiêu là tái tạo gần như nguyên trạng UI/UX, không diễn giải audit này thành redesign. Cần so sánh migration theo từng public view, CMS route, breakpoint và interaction state.

## Design system/tokens tìm thấy

### Brand và màu

- Brand primary: orange `#ea580c` (orange-600), hover `#c2410c`, active `#9a3412`; orange-500 `#f97316` xuất hiện nhiều ở focus/active.
- Neutral: Slate 50–950; dark canvas chủ đạo `#020617`/`#0f172a`.
- Corporate navy: `#0b1b36`, dark `#060f20`, light `#152a4d`.
- Semantic success/warning/error/info dùng green/amber/red/blue.
- Public identity còn gồm logo CIC hiện tại, orange glow, tech grid, slate/navy panels và white content surfaces.

### Typography

- Font sans/display: Roboto với system fallback; font được khai báo trong global CSS/tokens.
- Scale từ 11/12/14/16/18/20/24/30/36/48 đến 72px.
- Heading thường bold/black, tracking âm; label/badge/button thường uppercase, bold/black và tracking rộng.
- Rich content có rhythm riêng cho service/article/event và CKEditor output; phải giữ line-height, heading margins, image/caption/link styles.

### Spacing, radius, shadow

- Container: mobile 16px, tablet 24px, desktop 32px; max width thường 1280px (`max-w-7xl`).
- Section rhythm: 24/48/64/96px; card padding 16/24/32px.
- Control radius 8px; card/container tiêu chuẩn 10px; large modal 16px; pill/circle 9999px. Code thực tế cũng dùng `rounded-xl/2xl/3xl`; phải lấy rendered UI làm chuẩn khi khác token comment.
- Shadow từ xs đến 2xl, cộng orange brand glow và modal/floating elevation.

Tokens được định nghĩa trong `src/shared/tokens`, nhưng phần lớn JSX vẫn dùng Tailwind classes/hard-coded colors. Khi có chênh lệch, rendered component + `index.css` là bằng chứng trực tiếp cần bảo toàn.

## Shared UI patterns phải giữ

### Website public

- Header trong suốt/solid tùy view và scroll context; desktop mega/dropdown navigation, mobile drawer/menu, search affordance và CTA tư vấn.
- Footer đa cột với navigation, contact/social/legal actions.
- Hero lớn, orange accent, tech/canvas background, section container/rhythm và card grid.
- List/detail chuyển ngay trong cùng view; breadcrumb/back, tabs/categories, filters, sort, pagination và related-content blocks.
- Floating speed-dial bên phải dưới: contact links, chatbot, expand/collapse tooltip và mobile sizing.
- Consultation modal, chatbot widget, product/event forms và success state.
- Partner network/world map với SVG paths, marker/logo/curve, hover/focus tooltip; edit mode có pointer drag và copy JSON.
- Rich content cho products/services/projects/news/events, gồm ảnh, heading, list, link và caption.

### CMS

- Fixed/sticky header; collapsible desktop sidebar và mobile sidebar; breadcrumb/action bar; content shell; footer.
- Light/dark themes, orange active/focus color và slate surfaces.
- Reusable page header, tabs, list toolbar, search/filter panel, active filter chips, table shell, bulk action bar và pagination footer.
- List/grid toggle, row selection, column setting, status badges và empty/loading states.
- Form/editor screens với sticky actions, preview desktop/tablet/mobile, media picker, searchable select, quality panel.
- Modal centered overlay, right drawer, confirmation dialog, detail drawer, command palette và global keyboard shortcuts.
- Page Builder visual canvas, inline content editing, drag/reorder overlay, responsive preview frame và CKEditor skin.

## Responsive behavior quan trọng

- Tailwind breakpoints `sm`, `md`, `lg`, `xl` xuất hiện xuyên public/CMS; giữ đúng thay đổi số cột, padding, font size, visibility và navigation mode.
- Public header chuyển sang mobile menu; hero/card grids co từ multi-column về single column.
- Floating utilities đổi kích thước/vị trí theo `sm` và giữ trên nội dung với z-index cao.
- CMS sidebar có collapsed/mobile overlay state; toolbar/footer/pagination chuyển từ hàng sang cột dưới 640px.
- `.cms-sticky-action` bị tắt sticky dưới 768px; `.cms-sticky-aside` chỉ sticky từ 1024px.
- Tables dùng horizontal scroll thay vì ép cột; một số page numbers bị ẩn trên mobile.
- Preview modals hỗ trợ desktop/tablet/mobile viewport; behavior này là chức năng, không chỉ trang trí.
- Partner map dùng viewBox/SVG positioning và responsive sizing; không thay bằng layout DOM thông thường nếu chưa kiểm chứng pixel/interaction.

## Interaction và animation phải giữ

- `motion/react`: `AnimatePresence`, fade/slide/scale, hover/tap scale, stagger và carousel transitions.
- Smooth scroll khi chuyển list/detail/section; reset key đang bảo đảm quay lại list khi click nav.
- Auto-advance interval ở hero, awards/projects/products/news; giữ timing và cleanup behavior tương đương.
- Canvas constellation/tech background phản ứng mouse/click/scroll/resize và chạy `requestAnimationFrame`.
- Hover/focus rings, orange focus border/glow, card lift/shadow, selected/active states và custom scrollbar/select skin.
- Modal/drawer phải giữ overlay, z-index, scroll container, close action, preview device switching và success/confirmation flow.
- CMS command palette/global shortcuts; Contacts `/` focus search; copy-to-clipboard/toast; draft note persistence.
- Drag/drop: product file drop, page-builder reorder/inline editing và partner map edit interaction.

## Vùng dễ sai giao diện khi migrate

1. Header/public mega menu và mobile navigation vì state hiện truyền xuyên `App`/Header và không gắn route URL.
2. Fixed/sticky stacking: public floating bar/chatbot/modals; CMS header/sidebar/breadcrumb/sticky action/drawers.
3. Canvas backgrounds do phụ thuộc kích thước viewport, mouse và scroll; SSR placeholder/hydration có thể làm lệch first paint.
4. Rich content do CSS global + CKEditor CSS + HTML inline; class/load order khác sẽ đổi typography và spacing.
5. CMS dark mode vì class được gắn trực tiếp lên `documentElement` và `body`, đồng thời preference đọc localStorage/system theme.
6. Page Builder/visual editing do direct DOM mutation, iframe document cloning, contentEditable và geometry observers.
7. Recharts dashboard do container measurement/client render.
8. Tables/filter/pagination vì mỗi module vẫn có logic riêng ngoài shared primitives; không được chuẩn hóa khiến behavior thay đổi ngoài ý muốn.
9. Large view components có nhiều responsive/interaction state nằm cùng markup; tách boundary có thể vô tình reset state hoặc đổi animation.
10. Global CSS selectors (`select`, `button/a cursor`, CKEditor, rich content, CMS dark selectors) phụ thuộc cascade/order.

## Migration Risks

- Browser-only code phải nằm trong client boundary: `window`, `document`, `navigator`, local/session storage, observers, canvas, History API và CKEditor.
- Initial render đọc browser state có nguy cơ hydration mismatch hoặc flash theme/content.
- `dangerouslySetInnerHTML` cần giữ visual output đồng thời xác lập sanitation tin cậy; hiện service/product có helper riêng, project/news có chỗ render trực tiếp.
- Không thấy xử lý `prefers-reduced-motion` có hệ thống; khi thêm hỗ trợ accessibility sau này phải giữ hierarchy/state feedback, nhưng audit này không thay animation.
- Detector kỹ thuật báo nhiều trường hợp text slate trên nền màu cần đo contrast trong browser; một số là false positive do class nằm ở nhánh/descendant khác. Không đổi palette ở bước audit, chỉ yêu cầu visual regression + contrast verification khi migrate.
- Token system và JSX utility chưa hoàn toàn đồng bộ; không được “chuẩn hóa” token trong migration nếu làm thay đổi rendered pixels.

## Checklist bảo toàn khi triển khai migration sau này

- Chụp baseline desktop/tablet/mobile cho từng public view và từng CMS route chính.
- Ghi baseline cho closed/open/hover/focus/selected/loading/empty/error/modal/drawer/detail/editor/dark states.
- So sánh typography, container width, section rhythm, grid columns, radius, shadow, z-index và scroll behavior.
- Xác minh keyboard, touch, responsive table, preview device, drag/drop, carousel timing và canvas behavior.
- Xác minh cùng nội dung/asset/logo và cùng quan hệ điều hướng giữa các module.
