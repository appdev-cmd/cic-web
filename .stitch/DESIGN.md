---
name: RAG CIC Admin
colors:
  background: '#f8fafc'
  surface: '#ffffff'
  surface-muted: '#f1f5f9'
  primary: '#2563eb'
  primary-strong: '#1d4ed8'
  primary-soft: '#eff6ff'
  text: '#0f172a'
  text-secondary: '#475569'
  text-muted: '#94a3b8'
  border: '#e2e8f0'
  success: '#059669'
  warning: '#d97706'
  error: '#e11d48'
typography:
  heading:
    fontFamily: Arial
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: '-0.01em'
  body:
    fontFamily: Arial
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: '0'
  label:
    fontFamily: Arial
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: '0.02em'
rounded:
  sm: 0.375rem
  DEFAULT: 0.5rem
  lg: 0.75rem
  xl: 1rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 24px
---

# Design System: RAG CIC Admin

## 1. Visual Theme & Atmosphere

RAG CIC dùng phong cách quản trị chuyên nghiệp, sáng và thiên về dữ liệu. Nền slate rất nhạt giữ cảm giác sạch; surface trắng, đường viền mảnh và bóng nhẹ phân tách khu vực mà không tạo độ sâu quá mức.

Màu xanh dương là điểm nhấn duy nhất cho hành động chính, trạng thái active và focus. Mật độ giao diện vừa phải: bảng dữ liệu có nhiều thông tin nhưng header, filter và trạng thái được chia thành khối rõ ràng.

## 2. Color Palette & Roles

### Primary Foundation

- **Slate Canvas** `#f8fafc`: nền ứng dụng.
- **Clean White** `#ffffff`: sidebar, header, card và form surface.
- **Muted Slate** `#f1f5f9`: hover, table header và vùng phụ.
- **Hairline Slate** `#e2e8f0`: border và divider.

### Accent & Interactive

- **CIC Blue** `#2563eb`: CTA, active navigation, focus.
- **Deep CIC Blue** `#1d4ed8`: hover/pressed.
- **Pale CIC Blue** `#eff6ff`: active/selected background.

### Typography & Text Hierarchy

- **Ink Slate** `#0f172a`: nội dung chính.
- **Secondary Slate** `#475569`: mô tả và metadata.
- **Quiet Slate** `#94a3b8`: placeholder và icon phụ.

### Functional States

- Success `#059669`, warning `#d97706`, error `#e11d48`; luôn kèm nhãn hoặc icon, không chỉ dùng màu.

## 3. Typography Rules

### Hierarchy & Weights

Arial/sans-serif hiện là font hệ thống. Heading trang 24px/700; heading card 18–20px/700; body 14px/400; label 12–14px/600. Các nhãn kỹ thuật có thể uppercase với tracking nhẹ nhưng không dùng cho đoạn dài.

### Spacing Principles

Nhịp cơ sở 4px, khoảng cách chính 8/16/24/32px. Body có line-height thoáng vừa đủ; heading gọn và gần nội dung liên quan.

## 4. Component Stylings

### Buttons

Bo 8px, cao tối thiểu 40px; primary xanh chữ trắng, outline nền trắng, destructive rose. Luôn có focus ring rõ, disabled giảm opacity và chặn interaction.

### Cards & Data Containers

Surface trắng, border slate 1px, bo 12–16px, shadow rất nhẹ. Padding 20–24px. Bảng có header nền muted, row hover nhẹ và overflow ngang trên mobile.

### Navigation

Sidebar desktop 256px, active item dùng pale blue + blue text. Mobile chuyển thành header/drawer hoặc vùng điều hướng có thể thu gọn; action logout tách khỏi navigation chính.

### Inputs & Forms

Input cao 40px, border slate, bo 6–8px; label luôn hiển thị. Focus dùng ring xanh 2px. Error text rose và liên kết bằng semantic attributes.

### RAG Sources & Status

Nguồn RAG là accordion/card nhỏ có title, page, source type và nội dung mở rộng. Status badge dạng pill luôn kèm text/icon.

## 5. Layout Principles

### Grid & Structure

Admin shell gồm sidebar + top header + content. Nội dung dùng `max-w-7xl`, gutter 24px, card stack và bảng full width.

### Whitespace Strategy

Khoảng cách giữa section 24px, trong control group 8–16px. Không dồn action destructive cạnh primary nếu không có phân tách.

### Alignment & Visual Balance

Tiêu đề và nội dung căn trái; số liệu và tiền có thể căn phải. Header trang đặt mô tả bên trái, action chính bên phải và stack dọc trên màn hình nhỏ.

### Responsive Behavior & Touch

Mobile-first; layout chuyển cột ở `sm/md`, bảng scroll ngang, action wrap. Touch target tối thiểu 40px và ưu tiên 44px cho icon-only button.

## 6. Design System Notes for Stitch Generation

### Language to Use

“Vietnamese enterprise admin portal, clean slate canvas, white bordered surfaces, restrained CIC blue accents, information-dense but calm, accessible focus and status states.”

### Color References

Giữ Slate Canvas, Clean White, CIC Blue và semantic emerald/amber/rose; không thêm gradient hoặc màu thương hiệu mới khi chưa có căn cứ.

### Component Prompts

- “Create a responsive admin data table card with slate header, subtle row hover, blue primary action, search and filters.”
- “Create a legal RAG chat panel with white message surfaces, blue user bubble and expandable citation cards.”
- “Create a compact sidebar navigation with pale-blue active state and clear permission-aware groups.”

### Incremental Iteration

Giữ cấu trúc và palette trước; cải thiện responsive, states và accessibility từng màn hình. Không redesign toàn bộ navigation và data tables trong cùng một bước với thay đổi backend.
