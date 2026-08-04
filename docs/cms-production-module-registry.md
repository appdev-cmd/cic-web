# CMS PRODUCTION MODULE REGISTRY

> Baseline ngày 2026-08-04. Registry dùng để kiểm soát cleanup; mục `VERIFY` chưa được phép xóa hoặc đưa vào production navigation.

| Spec | Phạm vi sản phẩm | Thư mục hiện tại | Canonical path | Quyết định cleanup |
|---:|---|---|---|---|
| 01 | Dashboard | `dashboard` | `/cms/dashboard` | KEEP; `CmsDashboard` chỉ là app shell, `DashboardOverview` là page |
| 02 | Tin tức | `news` | `/cms/news` | KEEP |
| 03 | Trang nội dung | `static_pages` | `/cms/static-pages` | KEEP |
| 04 | Sự kiện | `events` | `/cms/events` | KEEP |
| 05 | Sản phẩm | `products` | `/cms/products` | KEEP |
| 06 | Thiết lập/Danh mục sản phẩm | `product_settings` | `/cms/product-settings` | KEEP; không coi email notification là routing khi chưa xác minh |
| 07 | Dịch vụ | `services` | `/cms/services` | KEEP; trang giới thiệu dịch vụ, không phải service-delivery workflow |
| 08 | Menu | `menu` | `/cms/frontend-menus` | KEEP |
| 09 | Banner & Slideshow | `banners` | `/cms/banners` | KEEP; một workspace chung |
| 09 | Vị trí Banner | `banners` | `/cms/banners` | MERGED; quản lý bằng action “Vị trí Website” trong Banner & Slideshow, không có module/category manager riêng |
| 10 | Khối nội dung | `content_blocks` | `/cms/home-blocks` | KEEP; CTA của Dịch vụ dùng từ đây |
| 11 | Thư viện media | `media` | `/cms/media` | KEEP |
| 12 | Khách hàng liên hệ | `contacts` | `/cms/contact-requests` | KEEP; các path liên hệ là filtered views, không phải module khác |
| 13 | Bản địa hóa UI | `localization` | `/cms/translation-strings` | KEEP WITH SCOPE; Source–Target chỉ cho UI strings, không ép đồng bộ business records |
| 14 | Người dùng | `cic_users` | `/cms/users` | KEEP |
| 15 | Vai trò & quyền | `permission_management` | `/cms/permissions` | KEEP |
| 16 | Cấu hình hệ thống | `system_configuration` | `/cms/settings` | KEEP |
| 16/VERIFY | Mẫu email | `email_templates` | `/cms/email-templates` | VERIFY; có route nhưng không có sidebar entry, cần chốt là subview Cấu hình hay loại bỏ |
| 17 | Nhật ký hoạt động | `activity_logs_trash` | `/cms/activity-logs` | KEEP; menu độc lập trong Governance |
| 17 | Thùng rác | `activity_logs_trash` | `/cms/trash` | KEEP; menu độc lập trong Governance |
| 17 | Lịch sử CIC cũ | Đã loại bỏ | `/cms/activity-logs` | MERGED; prototype `cic_history` không có consumer và trùng Nhật ký hoạt động chuẩn |

## Quy tắc route

- Mỗi phạm vi có đúng một canonical path.
- Alias chỉ giữ khi có deep link cũ hoặc migration requirement được xác nhận.
- Sidebar, Command Palette, notification và deep link dùng cùng registry.
- Locale là context của route/workspace, không tạo bản sao menu module cho VI và EN.
- Registry runtime nằm tại `src/cms/routing.ts`; route không xác định hiển thị Not Found và không fallback về Dashboard.
- Page manager được lazy-load theo module để không tải toàn bộ CMS ngay khi mở một route.

## Quyết định đang chờ

1. `email_templates`: subview Cấu hình/Notification hay loại khỏi production.

Cho tới khi quyết định này được chốt, không thêm Email Templates vào navigation mới và không xóa dữ liệu/file liên quan.
