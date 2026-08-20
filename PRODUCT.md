# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Khách hàng doanh nghiệp (B2B) trong các ngành Xây dựng, Giao thông và Công nghiệp tại Việt Nam. Họ tìm kiếm đối tác công nghệ để triển khai giải pháp chuyển đổi số, tư vấn kỹ thuật chuyên sâu, hoặc đánh giá năng lực hợp tác lâu dài. Người truy cập website thường là lãnh đạo doanh nghiệp, giám đốc kỹ thuật, hoặc bộ phận mua sắm/đấu thầu đang trong giai đoạn đánh giá nhà cung cấp.

## Product Purpose

Website CIC Technology là kênh đại diện thương hiệu trực tuyến của Công ty CIC — trình bày năng lực, sản phẩm công nghệ, dịch vụ tư vấn, và hồ sơ dự án đã triển khai. Mục tiêu: tạo niềm tin chuyên môn, chuyển đổi khách truy cập thành khách hàng liên hệ tư vấn, và cập nhật tin tức/sự kiện ngành.

## Positioning

CIC Technology sở hữu sản phẩm công nghệ riêng (phần mềm, giải pháp số chuyên ngành) — không chỉ là đơn vị tư vấn thuần túy. Đây là điểm khác biệt cốt lõi so với các công ty tư vấn kỹ thuật truyền thống: CIC vừa hiểu sâu nghiệp vụ ngành vừa tự phát triển công cụ số để giải quyết bài toán thực tế.

## Operating Context

- Khách hàng đánh giá CIC qua hồ sơ năng lực, danh mục dự án đã triển khai, và sản phẩm công nghệ sở hữu.
- Quy trình: truy cập website → xem sản phẩm/dịch vụ → xem dự án tham chiếu → liên hệ tư vấn (form, hotline, Zalo, hoặc chatbot AI).
- Website cũng phục vụ cập nhật tin tức ngành và sự kiện cho cộng đồng chuyên ngành.

## Capabilities and Constraints

- **Sections hiện có**: Trang chủ, Sản phẩm, Giới thiệu (Tổng quan / Cơ cấu / Kinh nghiệm), Dịch vụ, Dự án, Tin tức, Sự kiện, Liên hệ, Tìm kiếm, CMS admin.
- **Tính năng đặc biệt**: AI Chatbot (Gemini API), CMS quản trị nội dung, form tư vấn, floating contact bar (Hotline / Zalo / Facebook / LinkedIn).
- **Stack**: React 19 + Vite + TailwindCSS v4 + TypeScript + Motion (framer-motion) + Recharts + Lucide icons.
- **Dữ liệu**: Hiện tại dùng static data files (sẽ chuyển sang CMS/database).
- **Deploy**: Vercel.

## Brand Commitments

- **Logo**: Logo CIC hiện tại là bắt buộc (`cic-logo-full.png`, `logo.png`, `LOGO - 1990-08.png`).
- **Bảng màu**: Cam (`orange-500/600`) và Đen/Slate là palette chính — bắt buộc giữ nguyên.
- **Tên**: "CIC Technology" là cố định.
- **Slogan**: "Đối tác công nghệ chiến lược" là cố định.
- **Dữ liệu**: Toàn bộ nội dung dữ liệu hiện có (dự án, tin tức, sự kiện, sản phẩm, dịch vụ) phải được giữ nguyên.

## Evidence on Hand

- Ảnh kỷ niệm 35 năm CIC (`35nam_cic_1.JPG`).
- Nhiều logo variants có sẵn trong `/public/`.
- Banner hero images trong `/public/banner_hero/`.
- Dữ liệu thực tế: ~455KB mockData, ~145KB eventsData, ~130KB servicesData, ~102KB newsData, ~86KB newsData, ~68KB productsView, ~50KB projectsData, ~35KB aboutData.
- CMS dashboard đã xây dựng tại route `/cms`.
- Docs đánh giá & đề xuất nâng cấp có sẵn (`docs/Báo cáo đánh giá và đề xuất nâng cấp.md`).

## Product Principles

1. **Uy tín chuyên môn trước hết** — Mọi thông tin phải chính xác, có bằng chứng dự án thực tế, không phóng đại.
2. **Sản phẩm, không chỉ dịch vụ** — Luôn làm nổi bật rằng CIC tự sở hữu giải pháp công nghệ, không chỉ tư vấn.
3. **Chuyển đổi số có gốc rễ** — 35+ năm kinh nghiệm ngành là nền tảng cho mọi giải pháp số hóa.
4. **Dễ tiếp cận, chuyên nghiệp** — Nhiều kênh liên hệ (AI chatbot, Zalo, hotline, form), UX rõ ràng cho đối tượng B2B.
5. **Nội dung sống** — Tin tức, sự kiện, dự án được cập nhật liên tục qua CMS.
