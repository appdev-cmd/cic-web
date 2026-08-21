# Kiểm kê chức năng CMS/Admin

Phạm vi kiểm kê chỉ gồm hệ thống CMS/Admin. Danh sách được đối chiếu từ sidebar CMS, router `/cms/...`, module được render và các màn quản trị thực tế. Alias route, tab, drawer, modal và thao tác con không được tính thành chức năng chính riêng.

| STT | Tên chức năng | Route | Mục đích chính | Nhóm chức năng |
| ---: | --- | --- | --- | --- |
| 1 | Tổng quan | `/cms/dashboard` | Tổng hợp KPI, nội dung chờ xử lý, liên hệ, đăng ký sản phẩm và hoạt động gần đây. | Tổng quan |
| 2 | Tin tức | `/cms/news` | Quản lý danh sách, nội dung, trạng thái xuất bản, phiên bản và SEO của tin tức. | Quản lý nội dung |
| 3 | Danh mục tin tức | `/cms/news/categories` | Quản lý cây danh mục và thông tin hiển thị của danh mục tin tức. | Quản lý nội dung |
| 4 | Trang nội dung | `/cms/static-pages` | Quản lý trang nội dung theo template, section, bản nháp, bản xuất bản và xem trước. | Quản lý nội dung |
| 5 | Sự kiện | `/cms/events` | Quản lý nội dung, thời gian, địa điểm, đăng ký và trạng thái xuất bản sự kiện. | Quản lý nội dung |
| 6 | Dự án | `/cms/projects` | Quản lý nội dung, media và các sản phẩm, dịch vụ liên quan của dự án. | Quản lý nội dung |
| 7 | Sản phẩm | `/cms/products` | Quản lý thông tin, phân loại, media, file, trạng thái và nội dung chi tiết sản phẩm. | Sản phẩm/Dịch vụ |
| 8 | Danh mục sản phẩm | `/cms/product-settings/categories` | Quản lý cây danh mục dùng để phân loại sản phẩm. | Sản phẩm/Dịch vụ |
| 9 | Hãng sản xuất | `/cms/product-settings/brands` | Quản lý thông tin hãng sản xuất hoặc đơn vị phát triển sản phẩm. | Sản phẩm/Dịch vụ |
| 10 | Lĩnh vực ứng dụng | `/cms/product-settings/applications` | Quản lý các lĩnh vực ứng dụng dùng cho sản phẩm. | Sản phẩm/Dịch vụ |
| 11 | Loại sản phẩm | `/cms/product-settings/product-types` | Quản lý các loại sản phẩm dùng trong danh mục và bộ lọc. | Sản phẩm/Dịch vụ |
| 12 | Người phụ trách kinh doanh | `/cms/product-settings/sales-staff` | Quản lý người phụ trách liên hệ, kinh doanh và hỗ trợ theo sản phẩm. | Sản phẩm/Dịch vụ |
| 13 | Dịch vụ | `/cms/services` | Quản lý nội dung, trạng thái xuất bản và sản phẩm liên quan của dịch vụ. | Sản phẩm/Dịch vụ |
| 14 | Menu | `/cms/frontend-menus` | Quản lý nhóm menu, cây mục menu, liên kết, thứ tự và trạng thái hiển thị. | Trình bày Website |
| 15 | Thư viện media | `/cms/media` | Quản lý ảnh, video, tài liệu, thư mục, album, metadata, phiên bản và nơi sử dụng. | Media |
| 16 | CTA | `/cms/cta` | Quản lý lời kêu gọi hành động dùng lại và hành động đích trên website. | Tương tác khách hàng |
| 17 | Biểu mẫu | `/cms/forms` | Quản lý biểu mẫu, trường nhập, cấu hình gửi, xem trước và lượt gửi. | Tương tác khách hàng |
| 18 | Yêu cầu khách hàng | `/cms/customer-requests` | Theo dõi, lọc, phân công, ghi chú và cập nhật trạng thái yêu cầu khách hàng. | Tương tác khách hàng |
| 19 | Mẫu email | `/cms/email-templates` | Quản lý mẫu email, phiên bản nội dung, sự kiện sử dụng và đối tượng nhận. | Tương tác khách hàng |
| 20 | Liên hệ & đăng ký sản phẩm | `/cms/contact-requests` | Tổng hợp liên hệ chung, liên hệ sản phẩm và yêu cầu đăng ký để xử lý vận hành. | Tương tác khách hàng |
| 21 | Người dùng | `/cms/users` | Quản lý hồ sơ, trạng thái, bảo mật và phạm vi truy cập của người dùng CMS. | Người dùng & phân quyền |
| 22 | Vai trò & quyền | `/cms/permissions` | Quản lý vai trò, ma trận quyền, phân công, định nghĩa tác vụ và rà soát truy cập. | Người dùng & phân quyền |
| 23 | Cấu hình hệ thống | `/cms/settings` | Quản lý cấu hình theo nhóm, workspace, bản nháp, kiểm tra hợp lệ và lịch sử thay đổi. | Cấu hình hệ thống |
| 24 | Ngôn ngữ giao diện | `/cms/translation-strings` | Quản lý từ điển chuỗi giao diện website và CMS theo ngôn ngữ. | Cấu hình hệ thống |
| 25 | Nhật ký hoạt động | `/cms/activity-logs` | Tra cứu, lọc, xem chi tiết và xuất dữ liệu hoạt động quản trị. | Cấu hình hệ thống |
| 26 | Thùng rác | `/cms/trash` | Quản lý dữ liệu đã xóa, phục hồi, xử lý xung đột và xóa vĩnh viễn. | Cấu hình hệ thống |
| 27 | Cấu hình SEO chức năng | `/cms/function-seo` | Quản lý metadata SEO và chính sách lập chỉ mục theo chức năng hoặc route. | SEO |
| 28 | Tìm kiếm toàn cục | `/cms/search` | Tìm kiếm dữ liệu và điều hướng nhanh tới nhiều module quản trị. | Tiện ích CMS |

## Tổng kết

- Tổng số chức năng CMS tìm thấy: **28**.
- Trong đó: **26** chức năng xuất hiện trên sidebar và **2** chức năng có route/module thực tế nhưng không có mục sidebar riêng.

## Chức năng có route nhưng chưa hoàn thiện

- **CTA** — `/cms/cta`: màn danh sách, tạo/sửa, xem trước và nơi sử dụng đã có; các thao tác hàng loạt đổi trạng thái, lưu trữ và xóa vẫn chỉ gọi xử lý giả lập.
- **Biểu mẫu** — `/cms/forms`: builder, xem trước và màn lượt gửi đã có; dữ liệu lượt gửi còn là mock và các thao tác hàng loạt đổi trạng thái, lưu trữ, xóa chưa nối xử lý hoàn chỉnh.
- **Liên hệ & đăng ký sản phẩm** — `/cms/contact-requests`: route và module vẫn được render nhưng không còn xuất hiện trên sidebar; cần xác nhận đây là module vận hành hay lớp tương thích cũ.
- Toàn bộ các module CMS hiện lấy dữ liệu qua `demo*DataSource`, fixture hoặc state phía client; mức độ kết nối backend thật cần được đánh giá ở bước riêng và không làm phát sinh thêm chức năng trong danh sách này.

## Chức năng có dấu hiệu trùng hoặc thuộc chức năng cha

- **Danh mục tin tức** thuộc module cha **Tin tức**: `/cms/news/categories` được router nhận bằng nested route của `/cms/news`, nhưng có mục sidebar và màn quản trị riêng nên vẫn được tính là một chức năng.
- **Danh mục sản phẩm**, **Hãng sản xuất**, **Lĩnh vực ứng dụng**, **Loại sản phẩm** và **Người phụ trách kinh doanh** cùng thuộc module cha `/cms/product-settings`; route cha này mặc định mở cấu hình danh mục và không được tính thành chức năng thứ 29.
- **Liên hệ & đăng ký sản phẩm** và **Yêu cầu khách hàng** có phạm vi dữ liệu giao nhau: module đầu quản lý nguồn liên hệ/đăng ký kiểu cũ, module sau quản lý luồng yêu cầu khách hàng hợp nhất.
- **Nhật ký hoạt động** và **Thùng rác** dùng chung nhóm component/dữ liệu quản trị nhưng có route, manager và mục sidebar độc lập nên được tính là hai chức năng.
- Các alias như `/cms`, `/cms/articles`, `/cms/pages`, `/cms/menu`, `/cms/media-library`, `/cms/requests` và `/cms/global-search` chỉ trỏ về chức năng đã liệt kê, không phải chức năng mới.
