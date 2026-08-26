# HỆ THỐNG QUẢN TRỊ NỘI DUNG WEBSITE CIC

> CMS giúp CIC chủ động vận hành Website trên một nền tảng tập trung: từ quản lý nội dung, sản phẩm và hình ảnh doanh nghiệp đến tiếp nhận nhu cầu khách hàng, phân công trách nhiệm và kiểm soát thay đổi.

**Truy cập CMS:** [https://cic-web-sandy.vercel.app/cms/](https://cic-web-sandy.vercel.app/cms/)

## Mục lục

- [HỆ THỐNG QUẢN TRỊ NỘI DUNG WEBSITE CIC](#hệ-thống-quản-trị-nội-dung-website-cic)
  - [Mục lục](#mục-lục)
  - [1. CMS mới mở rộng những gì?](#1-cms-mới-mở-rộng-những-gì)
  - [2. Danh mục chức năng CMS — Tra cứu](#2-danh-mục-chức-năng-cms--tra-cứu)
    - [2.1. Tổng quan](#21-tổng-quan)
    - [2.2. Nội dung](#22-nội-dung)
      - [Tin tức](#tin-tức)
      - [Danh mục tin tức](#danh-mục-tin-tức)
      - [Trang nội dung](#trang-nội-dung)
      - [Sự kiện](#sự-kiện)
      - [Dự án](#dự-án)
      - [Dịch vụ](#dịch-vụ)
    - [2.3. Sản phẩm](#23-sản-phẩm)
      - [Sản phẩm](#sản-phẩm)
      - [Danh mục sản phẩm](#danh-mục-sản-phẩm)
      - [Hãng sản xuất](#hãng-sản-xuất)
      - [Lĩnh vực ứng dụng](#lĩnh-vực-ứng-dụng)
      - [Loại sản phẩm](#loại-sản-phẩm)
      - [Người phụ trách kinh doanh](#người-phụ-trách-kinh-doanh)
    - [2.4. Website](#24-website)
      - [Menu](#menu)
      - [Thư viện media](#thư-viện-media)
    - [2.5. Tương tác khách hàng](#25-tương-tác-khách-hàng)
      - [Hai nhóm CTA và Biểu mẫu](#hai-nhóm-cta-và-biểu-mẫu)
      - [Phạm vi CTA và Biểu mẫu](#phạm-vi-cta-và-biểu-mẫu)
      - [CTA](#cta)
      - [Biểu mẫu](#biểu-mẫu)
      - [Yêu cầu khách hàng](#yêu-cầu-khách-hàng)
      - [Mẫu email](#mẫu-email)
    - [2.6. Quản trị hệ thống](#26-quản-trị-hệ-thống)
      - [Người dùng](#người-dùng)
      - [Vai trò \& quyền](#vai-trò--quyền)
      - [Cấu hình hệ thống](#cấu-hình-hệ-thống)
      - [SEO \& URL](#seo--url)
      - [Ngôn ngữ giao diện](#ngôn-ngữ-giao-diện)
      - [Nhật ký hoạt động](#nhật-ký-hoạt-động)
      - [Thùng rác](#thùng-rác)
    - [2.7. Tìm kiếm toàn cục](#27-tìm-kiếm-toàn-cục)

## 1. CMS mới mở rộng những gì?

CMS mới không làm lại toàn bộ nghiệp vụ của CMS cũ. Hệ thống tiếp tục sử dụng dữ liệu còn giá trị, đồng thời nâng cấp hoặc thay đổi nơi quản lý để người vận hành làm việc theo nội dung và trách nhiệm thay vì phải hiểu cấu trúc module kỹ thuật cũ.

| Phạm vi / chức năng | CMS cũ | CMS mới | Kết luận |
| --- | --- | --- | --- |
| **Dashboard** | Trang đầu chủ yếu cung cấp menu và lối tắt tới từng module | Tổng quan số lượng Sản phẩm, Tin tức, Trang nội dung và Thành viên; hiển thị Yêu cầu khách hàng chưa xử lý, biểu đồ lượt truy cập Website, thống kê nội dung xuất bản theo tuần và lịch sử hoạt động gần đây. | **Thêm mới** |
| **Tin tức** | Đã quản lý bài viết, ảnh, tệp, tin nổi bật, hiển thị Trang chủ, SEO và liên kết với tin hoặc sản phẩm khác | Kế thừa toàn bộ nội dung Tin tức hiện có; bổ sung bản nháp, xem trước trước khi công bố và sử dụng tài nguyên tập trung từ Thư viện media. | **Kế thừa + nâng cấp** |
| **Danh mục tin tức** | Đã tổ chức tin theo danh mục nhiều cấp và lựa chọn hiển thị Trang chủ | Kế thừa cây Danh mục tin tức và các liên kết với bài viết; bổ sung kiểm tra đường dẫn trùng và quản lý trạng thái, thứ tự rõ ràng hơn. | **Kế thừa + nâng cấp** |
| **Sự kiện** | Đã có nội dung, thời gian, địa điểm, liên kết đăng ký, sự kiện nổi bật, hiển thị Trang chủ, SEO và nội dung liên quan | Kế thừa nội dung Sự kiện hiện có; bổ sung xem trước trước khi công bố và tự phân nhóm sắp diễn ra, đang diễn ra, đã kết thúc theo thời gian sự kiện. | **Kế thừa + nâng cấp** |
| **Dịch vụ** | Đã có module Dịch vụ; một số nội dung dịch vụ còn được lưu trong Trang tĩnh | Nội dung Dịch vụ hiện có được giữ lại nhưng tập trung về một chức năng Dịch vụ thay vì nằm cả ở Dịch vụ và Trang tĩnh; bổ sung chọn Sản phẩm liên quan theo thứ tự. | **Tổ chức lại + nâng cấp** |
| **Sản phẩm** | Đã quản lý nội dung, ảnh, video, tài liệu, giá, SEO, sản phẩm liên quan và nhiều loại email theo hành động | Kế thừa hồ sơ Sản phẩm hiện có; ảnh và tài liệu được chọn từ Thư viện media, còn các hành động đăng ký, tải tài liệu và yêu cầu báo giá dùng CTA, Biểu mẫu và Mẫu email chung. | **Kế thừa + nâng cấp** |
| **Danh mục, hãng, ứng dụng và loại sản phẩm** | Đã có các danh mục phân loại riêng phục vụ quản lý và hiển thị sản phẩm | Kế thừa các dữ liệu phân loại và liên kết Sản phẩm hiện có; tiếp tục quản lý riêng thành Danh mục sản phẩm, Hãng sản xuất, Lĩnh vực ứng dụng và Loại sản phẩm. | **Kế thừa + nâng cấp** |
| **Nhân viên kinh doanh** | Đã lưu tên, số điện thoại, Skype/Zalo và gắn với sản phẩm | Kế thừa danh sách nhân viên kinh doanh và phạm vi Sản phẩm đang phụ trách; quản lý dưới tên **Người phụ trách kinh doanh** và không sử dụng như tài khoản CMS. | **Kế thừa + nâng cấp** |
| **Trang tĩnh / Trang nội dung** | Đã có Trang tĩnh cho Giới thiệu, Chính sách và một số Dịch vụ; nội dung các trang còn được phối hợp qua Block, Banner và Slideshow | Kế thừa nội dung còn sử dụng và quản lý lại thành hai nhóm: các trang mặc định có thiết kế riêng như Trang chủ, nhóm Giới thiệu và Liên hệ; các trang dùng **mẫu trang thông tin chuẩn** như Chính sách bảo mật và Điều khoản sử dụng. Mẫu chuẩn gồm phần đầu trang và một vùng nội dung soạn thảo; trang mặc định chỉ được sửa, không được xóa, còn người quản trị có thể tạo thêm trang theo mẫu này. | **Kế thừa Trang tĩnh + tổ chức lại** |
| **Block** | Xác định loại nội dung, vị trí và nơi xuất hiện để ghép các phần của trang | Không còn module Block riêng. Nội dung còn sử dụng được chuyển vào các khu vực tương ứng của Trang nội dung hoặc được chọn trực tiếp từ Tin tức, Sản phẩm, Dịch vụ và các chức năng liên quan. | **Thay thế**; không tiếp tục module Block riêng |
| **Banner** | Quản lý ảnh, liên kết, nội dung, danh mục và nơi xuất hiện; dữ liệu thực tế phục vụ nhiều mục đích như đối tác hoặc khu vực trình bày | Không còn module Banner dùng chung. Banner dạng slide được chuyển vào khu vực Banner của Trang nội dung; ảnh được quản lý trong Media, còn dữ liệu thuộc chức năng khác được chọn từ danh sách tương ứng. | **Tổ chức lại**; không tiếp tục module Banner riêng |
| **Slideshow** | Đã quản lý ảnh, ảnh thu nhỏ, liên kết, tóm tắt, danh mục và thứ tự; có thể được gọi qua Block tại các vị trí trình bày | Không còn module Slideshow riêng. Các slideshow còn phù hợp được chuyển vào khu vực slide/carousel của Trang nội dung; ảnh cũ còn giá trị được đưa vào Thư viện media. | **Tổ chức lại / bỏ module cũ**; không xóa tài nguyên còn giá trị |
| **Thư viện ảnh / Media** | Đã có Thư viện ảnh, nhưng ảnh và tệp vẫn nằm rải rác trong Tin tức, Sản phẩm, Banner, Slideshow và các module khác | Kế thừa tài nguyên của Thư viện ảnh và tập trung thêm ảnh, video, tài liệu đang nằm rải rác ở các module. Tài nguyên được dùng lại, tổ chức theo thư mục hoặc album và kiểm tra nơi đang sử dụng. | **Kế thừa + mở rộng + tập trung hóa** |
| **Dự án** | Không có module quản lý hồ sơ dự án | Thêm chức năng quản lý danh sách và trang chi tiết Dự án tiêu biểu, gồm nội dung giới thiệu, khách hàng, lĩnh vực, giải pháp, công nghệ, thời gian thực hiện và các Sản phẩm hoặc Dịch vụ liên quan. | **Thêm mới** |
| **Menu** | Đã có nhóm menu và danh sách mục menu với liên kết, thứ tự và trạng thái | Kế thừa các nhóm và mục Menu hiện có; bổ sung quản lý cây nhiều cấp và xem trước toàn bộ cấu trúc trước khi lưu. | **Kế thừa + nâng cấp** |
| **CTA** | Các nút hoặc liên kết hành động nằm trong sản phẩm, sự kiện, banner hay từng vị trí cố định; chưa có nơi quản lý CTA dùng chung | Thêm nơi quản lý dùng chung các nút như **Đăng ký tư vấn**, **Yêu cầu báo giá**, **Tải tài liệu**, **Liên hệ** và **Xem thêm**. CTA có thể dẫn tới trang, tài liệu, kênh liên hệ hoặc mở Biểu mẫu. | **Thêm mới ở cấp chức năng quản trị**; kế thừa các hành động cũ còn dùng |
| **Biểu mẫu** | Có các biểu mẫu cố định cho Liên hệ Website và đăng ký sản phẩm; chưa có chức năng thiết kế biểu mẫu dùng chung | Thêm nơi quản lý các Biểu mẫu như **Liên hệ**, **Đăng ký tư vấn** và **Yêu cầu báo giá**, gồm các trường khách cần nhập và cách tiếp nhận sau khi gửi. Lượt gửi được lưu và có thể tạo Yêu cầu khách hàng. | **Thêm mới ở cấp chức năng quản trị**; tổ chức lại các biểu mẫu cố định |
| **Liên hệ Website** | Được lưu thành danh sách liên hệ riêng với thông tin người gửi và nội dung | Không còn theo dõi riêng tại Danh sách Liên hệ Website. Dữ liệu cũ được giữ và hiển thị trong Yêu cầu khách hàng với nguồn là Trang Liên hệ. | **Tổ chức lại / hợp nhất** |
| **Đăng ký mua, liên hệ sản phẩm và tải tài liệu** | Được lưu chung trong Danh sách đăng ký sản phẩm nhưng tách khỏi Liên hệ Website và chưa có quy trình xử lý thống nhất | Không còn theo dõi riêng trong Danh sách đăng ký sản phẩm. Dữ liệu cũ được giữ và đưa vào Yêu cầu khách hàng cùng Sản phẩm và loại yêu cầu đã phát sinh. | **Tổ chức lại / hợp nhất** |
| **Yêu cầu khách hàng** | Nhu cầu khách hàng nằm ở các danh sách Liên hệ Website và Đăng ký sản phẩm riêng | Hợp nhất Liên hệ Website, đăng ký mua, liên hệ Sản phẩm và lượt gửi Biểu mẫu vào một nơi xử lý chung. Nhân viên có thể phân công người phụ trách, đặt ưu tiên, cập nhật trạng thái, ghi chú và theo dõi quá trình xử lý. | **Tổ chức lại + nâng cấp** |
| **Email theo hành động sản phẩm / Mẫu email** | Đã có mẫu email cho các hành động như liên hệ, đăng ký mua, tải sản phẩm và nhận báo giá | Kế thừa các mẫu email còn sử dụng và tập trung thành chức năng Mẫu email dùng chung. Biểu mẫu hoặc CTA chọn mẫu xác nhận khách hàng và mẫu thông báo nội bộ phù hợp. | **Kế thừa + tổ chức lại + nâng cấp** |
| **Người dùng** | Đã quản lý tài khoản, họ tên, email, điện thoại, địa chỉ, trạng thái và mật khẩu | Kế thừa tài khoản và hồ sơ người dùng hiện có; bổ sung trạng thái tài khoản chi tiết, gán Vai trò & quyền và lưu lịch sử thay đổi trạng thái. | **Kế thừa + nâng cấp** |
| **Vai trò & quyền** | Quyền Task được cấp trực tiếp cho từng tài khoản theo module | Thay việc cấp quyền trực tiếp cho từng tài khoản bằng Vai trò & quyền. Quản trị viên tạo vai trò như **Biên tập viên**, **Quản lý**, **Admin**, chọn chức năng được phép sử dụng rồi gán vai trò cho người dùng. | **Thay thế cơ chế quản trị**; quyền trực tiếp cũ chỉ dùng để xác định quyền tương đương khi chuyển đổi |
| **Cấu hình chung** | Đã quản lý thông tin Website như tên, logo, hotline, email, chân trang, mạng xã hội, mã theo dõi và một số nội dung Trang chủ | Kế thừa các thiết lập Website còn sử dụng; nội dung riêng của từng trang chuyển sang Trang nội dung, ảnh và tệp chuyển sang Media, còn thông tin dùng chung tiếp tục quản lý tại Cấu hình hệ thống. | **Kế thừa + tổ chức lại** |
| **Địa chỉ liên hệ** | Có module riêng lưu địa chỉ và thông tin liên hệ doanh nghiệp | Không còn module Địa chỉ liên hệ riêng. Danh sách trụ sở và chi nhánh chuyển vào Cấu hình hệ thống; Trang Liên hệ và Footer cùng sử dụng nguồn dữ liệu này. | **Tổ chức lại**; không tiếp tục module Địa chỉ liên hệ riêng và không nhập lặp địa chỉ trong Page Builder |
| **Cấu hình Enjicad** | Có module riêng chứa cả cấu hình chung, nội dung giới thiệu, hình ảnh, SEO và các thông tin dành riêng cho Enjicad | Không còn module Cấu hình Enjicad riêng. Dữ liệu còn sử dụng được chuyển theo mục đích sang Cấu hình hệ thống, Trang nội dung, Sản phẩm hoặc Dịch vụ, Media và SEO & URL. | **Tách theo mục đích / bỏ module riêng**; không hiểu là xóa toàn bộ dữ liệu |
| **SEO** | Đã có SEO chung, SEO theo module và SEO riêng trên Tin tức, Sản phẩm, Sự kiện, Trang tĩnh | Kế thừa SEO chung, SEO theo module và SEO từng nội dung; tập trung việc kiểm tra trang còn thiếu thông tin, quản lý địa chỉ chính thức, chuyển đường dẫn cũ và sitemap tại SEO & URL. | **Kế thừa + tập trung + mở rộng** |
| **Ngôn ngữ giao diện** | Đã quản lý câu chữ tiếng Việt/Anh riêng cho frontend và backend | Kế thừa câu chữ tiếng Việt và tiếng Anh hiện có; tách rõ câu chữ dùng cho Website và CMS, đồng thời bổ sung lọc nội dung còn thiếu bản dịch. | **Kế thừa + nâng cấp** |
| **Nhật ký hoạt động** | Một số module lưu người tạo hoặc người sửa, nhưng không có nhật ký thống nhất cho toàn CMS | Thêm chức năng ghi và tra cứu hoạt động trên toàn CMS: ai thực hiện, thời gian, dữ liệu bị tác động, kết quả và nội dung trước–sau khi thay đổi. | **Thêm mới** |
| **Thùng rác** | Không có nơi tập trung để kiểm tra và phục hồi dữ liệu đã xóa | Thêm nơi tập trung nội dung đã xóa để xem người xóa, thời điểm và dữ liệu liên quan; cho phép phục hồi về trạng thái an toàn hoặc xác nhận xóa vĩnh viễn. | **Thêm mới** |
| **Tìm kiếm toàn cục** | Người dùng phải mở từng module để tìm dữ liệu | Thêm một ô tìm kiếm chung cho Tin tức, Sản phẩm, Dịch vụ, Dự án, Yêu cầu khách hàng và các dữ liệu được hỗ trợ; kết quả mở thẳng tới đúng màn quản lý mà người dùng có quyền truy cập. | **Thêm mới** |

**Nhìn nhanh thay đổi**

- **Kế thừa và nâng cấp:** Tin tức · Danh mục tin tức · Sự kiện · Dịch vụ · Sản phẩm · Danh mục sản phẩm · Hãng sản xuất · Lĩnh vực ứng dụng · Loại sản phẩm · Người phụ trách kinh doanh · Menu · Người dùng · Cấu hình hệ thống · SEO & URL · Ngôn ngữ giao diện.
- **Tổ chức lại / thay thế:** Trang nội dung · Thư viện media · CTA và Biểu mẫu Hệ thống · Yêu cầu khách hàng · Mẫu email · Vai trò & quyền.
- **Thêm mới:** Dashboard · Dự án · Chức năng quản trị CTA · Chức năng quản trị Biểu mẫu · Nhật ký hoạt động · Thùng rác · Tìm kiếm toàn cục.
- **Không tiếp tục dưới dạng module riêng:** Block · Banner · Slideshow · Thư viện ảnh cũ · Danh sách Liên hệ Website · Danh sách đăng ký sản phẩm · Email theo hành động sản phẩm · Địa chỉ liên hệ · Cấu hình Enjicad · quyền Task trực tiếp.

**Ví dụ Trang chủ — trước và sau**

`CMS cũ: Trang tĩnh + Block + Banner + Slideshow + dữ liệu từ Tin tức, Sản phẩm, Sự kiện và các module khác`

↓

`CMS mới: Trang nội dung → Trang chủ → các khu vực rõ nghĩa + Media + nội dung tham chiếu từ các chức năng nghiệp vụ`

Trong CMS cũ, người vận hành phải biết nội dung Trang chủ đang nằm trong module nào và được gọi ở vị trí nào. Trong CMS mới, người biên tập mở **Trang nội dung → Trang chủ**, sau đó chọn trực tiếp các khu vực như **Hero, Giới thiệu, Số liệu, Thành tựu & Giải thưởng, Dự án, Sự kiện, Tin tức, Đối tác** hoặc **Liên hệ/CTA**.

Block không còn được cấu hình riêng theo vị trí; Banner và Slideshow không còn là các thùng chứa nội dung dùng chung. Nội dung còn giá trị được đưa về đúng khu vực của trang, hình ảnh và tệp được quản lý trong Media, còn Tin tức, Sản phẩm, Sự kiện, Dự án và Dịch vụ tiếp tục được lấy từ các chức năng nghiệp vụ tương ứng. Nhờ đó, bố cục Website vẫn được kiểm soát theo thiết kế nhưng nơi cập nhật nội dung trở nên rõ ràng hơn.

## 2. Danh mục chức năng CMS — Tra cứu

Phần này dùng để tra cứu mục đích, khả năng chính và cách sử dụng của 27 chức năng CMS.

| Nhóm | Chức năng | Mục đích chính | Người sử dụng chính |
| --- | --- | --- | --- |
| Tổng quan | Dashboard | Theo dõi tổng quan hoạt động và công việc trên CMS | Lãnh đạo, quản lý, cán bộ vận hành |
| Nội dung | Tin tức | Quản lý tin tức và bài viết trên Website | Truyền thông, nội dung |
| Nội dung | Danh mục tin tức | Quản lý cấu trúc phân loại tin tức trên Website | Truyền thông, nội dung |
| Nội dung | Trang nội dung | Quản lý nội dung các trang cố định trên Website | Truyền thông, nội dung |
| Nội dung | Sự kiện | Quản lý thông tin sự kiện của CIC trên Website | Truyền thông, nội dung |
| Nội dung | Dự án | Quản lý hồ sơ dự án tiêu biểu của CIC | Truyền thông, kinh doanh |
| Nội dung | Dịch vụ | Quản lý thông tin dịch vụ CIC cung cấp trên Website | Sản phẩm, kinh doanh, nội dung |
| Sản phẩm | Sản phẩm | Quản lý thông tin sản phẩm kinh doanh trên Website | Sản phẩm, kinh doanh |
| Sản phẩm | Danh mục sản phẩm | Quản lý cấu trúc phân loại sản phẩm trên Website | Sản phẩm, kinh doanh |
| Sản phẩm | Hãng sản xuất | Quản lý thông tin hãng sản xuất và đối tác sản phẩm | Sản phẩm, kinh doanh |
| Sản phẩm | Lĩnh vực ứng dụng | Quản lý lĩnh vực ứng dụng dùng để phân nhóm sản phẩm | Sản phẩm, kinh doanh |
| Sản phẩm | Loại sản phẩm | Quản lý loại sản phẩm dùng cho phân loại | Sản phẩm, kinh doanh |
| Sản phẩm | Người phụ trách kinh doanh | Quản lý đầu mối kinh doanh theo sản phẩm và khu vực | Kinh doanh, quản lý |
| Website | Menu | Quản lý cấu trúc điều hướng của Website | Nội dung, quản trị hệ thống |
| Website | Thư viện media | Quản lý tập trung ảnh, video và tài liệu dùng chung | Nội dung và các bộ phận vận hành |
| Tương tác khách hàng | CTA | Quản lý điểm kêu gọi hành động trên Website | Nội dung, kinh doanh |
| Tương tác khách hàng | Biểu mẫu | Quản lý biểu mẫu thu thập thông tin khách hàng | Nội dung, kinh doanh, chăm sóc khách hàng |
| Tương tác khách hàng | Yêu cầu khách hàng | Quản lý các yêu cầu khách hàng gửi từ Website | Kinh doanh, chăm sóc khách hàng, quản lý |
| Tương tác khách hàng | Mẫu email | Quản lý mẫu email gửi khách hàng và nội bộ | Nội dung, chăm sóc khách hàng |
| Quản trị hệ thống | Người dùng | Quản lý tài khoản truy cập CMS | Quản trị hệ thống |
| Quản trị hệ thống | Vai trò & quyền | Quản lý vai trò và quyền truy cập CMS | Quản trị hệ thống, quản lý |
| Quản trị hệ thống | Cấu hình hệ thống | Quản lý thông tin chung dùng trên CMS và Website | Quản trị hệ thống |
| Quản trị hệ thống | SEO & URL | Kiểm soát cách Website hiển thị trên công cụ tìm kiếm | Nội dung, quản trị Website |
| Quản trị hệ thống | Ngôn ngữ giao diện | Quản lý câu chữ giao diện tiếng Việt và tiếng Anh | Nội dung, quản trị hệ thống |
| Quản trị hệ thống | Nhật ký hoạt động | Theo dõi hoạt động và thay đổi thực hiện trên CMS | Quản lý, quản trị hệ thống |
| Quản trị hệ thống | Thùng rác | Quản lý dữ liệu đã xóa và khả năng phục hồi | Quản trị hệ thống |
| Tiện ích CMS | Tìm kiếm toàn cục | Hỗ trợ tìm nhanh dữ liệu và chức năng trên CMS | Tất cả người dùng CMS |

---

### 2.1. Tổng quan

**Dùng để làm gì?** Cung cấp bức tranh nhanh về nội dung, yêu cầu khách hàng, hoạt động gần đây và các công việc cần chú ý.

**Có thể làm gì?**

- Theo dõi các chỉ số tổng hợp và danh sách đang chờ xử lý.
- Xem liên hệ, đăng ký và hoạt động gần đây.
- Lọc theo khoảng thời gian; thay đổi thứ tự hoặc ẩn/hiện khu vực theo dõi.
- Đi thẳng từ một chỉ số hoặc danh sách tới nơi xử lý tương ứng.

**Cách sử dụng:**  
`Chọn khoảng thời gian → xem chỉ số và danh sách cần chú ý → mở công việc ưu tiên → xử lý tại chức năng tương ứng`

![Màn hình Dashboard CMS](https://lh3.googleusercontent.com/d/1jP62uZuE6-VpQOSMylA6aMaIfGMXC9qi=w1600)

> **Hình 1.** Các chỉ số và danh sách cần chú ý giúp người quản lý xác định nhanh công việc ưu tiên.

---

### 2.2. Nội dung

#### Tin tức

**Dùng để làm gì?** Quản lý các bài viết truyền thông, tin doanh nghiệp và tin chuyên ngành đăng trên Website.

**Có thể làm gì?**

- Tạo, sửa, phân loại, tìm kiếm, lọc và theo dõi trạng thái bài viết.
- Quản lý tóm tắt, ảnh đại diện, thông tin tìm kiếm và tin nổi bật.
- Xem trước, xuất bản hoặc chuyển nhiều bài về bản nháp.
- Xem lịch sử, phiên bản; chuyển vào thùng rác, phục hồi hoặc xóa vĩnh viễn.

**Cách sử dụng:**  
`Tạo hoặc chọn bài → nhập nội dung, danh mục và hình ảnh → xem trước → lưu nháp hoặc xuất bản`

![Màn hình quản lý Tin tức](https://lh3.googleusercontent.com/d/1uN0v7HDn2Yeof10fNJUtmBFB5iBCtJph=w1600)

> **Hình 2.** Bài viết được tập trung theo trạng thái để theo dõi và công bố có kiểm soát.

#### Danh mục tin tức

**Dùng để làm gì?** Tổ chức tin tức thành các nhóm cha–con để người đọc dễ tìm và người biên tập phân loại thống nhất.

**Có thể làm gì?**  
Tạo · Sửa · Sắp xếp cấp cha–con · Đặt thứ tự và trạng thái · Chọn hiển thị trên trang chủ · Thiết lập thông tin tìm kiếm · Xem số bài đang sử dụng · Xóa khi không còn ràng buộc.

**Cách sử dụng:**  
`Tạo danh mục → chọn cấp và vị trí → cập nhật trạng thái, thông tin tìm kiếm → lưu → dùng khi phân loại tin`

![Màn hình quản lý Danh mục tin tức](https://lh3.googleusercontent.com/d/1Bhyl8fI0yTL2IgMdF6lpE0qYO0OfLkw8=w1600)

> **Hình 3.** Cấu trúc cha–con cho biết vị trí và phạm vi sử dụng của từng danh mục.

#### Trang nội dung

**Dùng để làm gì?** Quản lý các trang mặc định của Website gồm Trang chủ, các trang Giới thiệu, Liên hệ, Chính sách bảo mật và Điều khoản sử dụng; đồng thời cho phép tạo thêm trang theo **mẫu trang thông tin chuẩn**. Khác với trình soạn bài thông thường, người dùng sửa nội dung theo từng khu vực; hệ thống giữ cố định bố cục tổng thể để hạn chế làm sai thiết kế Website.

Chức năng này thay thế cách CMS cũ quản lý các khu vực Website bằng từng Block theo module và vị trí. Thay vì cấu hình các Block riêng lẻ, người dùng mở một trang và cập nhật các khu vực thuộc bố cục của trang đó.

> **Nguyên tắc phân chia:** Trang nội dung quản lý cách một trang cố định được trình bày; Tin tức, Sản phẩm, Dịch vụ, Dự án và các chức năng nghiệp vụ quản lý dữ liệu được trang đó sử dụng. Ví dụ, Dự án xuất hiện trên Trang chủ vẫn được sửa tại chức năng **Dự án**; trong **Trang nội dung → Trang chủ**, người biên tập chỉ chọn Dự án nào được đưa vào khu vực tương ứng khi bố cục hỗ trợ.

Trang nội dung gồm hai nhóm:

- **Trang mặc định:** Trang chủ, các trang Giới thiệu, Liên hệ, Chính sách bảo mật và Điều khoản sử dụng. Đây là các trang Website cần có, được tạo sẵn theo đúng bố cục; người quản trị có thể sửa nội dung nhưng không xóa trang.
- **Trang thông tin bổ sung:** Do người quản trị tạo khi cần thêm nội dung như quy chế, hướng dẫn hoặc thông báo dài hạn. Trang mới dùng cùng mẫu với Chính sách bảo mật và Điều khoản sử dụng, gồm:
  - **Phần đầu trang cố định:** phân loại, tiêu đề, mô tả ngắn, ngày cập nhật và thời gian đọc nếu cần.
  - **Một vùng nội dung soạn thảo:** nhập tiêu đề mục, đoạn văn, danh sách, liên kết và các nội dung định dạng được trình soạn thảo hỗ trợ.

Mẫu này không có các khu vực thiết kế riêng như Hero, carousel, danh sách thẻ, số liệu hoặc khối Dự án/Sản phẩm; người quản trị không thêm, xóa hay sắp xếp các khu vực bố cục của trang.

**Có thể làm gì?**

- Chọn từng khu vực trên danh sách hoặc vùng xem trước để sửa đúng loại dữ liệu: tiêu đề, mô tả, ảnh, video, số liệu, CTA, biểu mẫu hoặc nội dung lấy từ chức năng khác.
- Quản lý riêng các khu vực của Trang chủ và nhóm trang Giới thiệu mà không phải sửa mã nguồn hay bố cục.
- Tạo trang thông tin mới theo mẫu trang thông tin chuẩn; hệ thống tự tạo đường dẫn, người dùng nhập thông tin đầu trang và nội dung soạn thảo.
- Sửa nhưng không xóa các trang mặc định của Website.
- Lưu bản nháp mà chưa ảnh hưởng Website hiện tại.
- Xem trước toàn trang trên máy tính, máy tính bảng và điện thoại trước khi công bố.
- Phân biệt phiên bản nháp, phiên bản đã công bố và nội dung còn thay đổi chưa xuất bản.

**Ví dụ thực tế:** Muốn đổi banner Trang chủ, người biên tập mở **Trang chủ → khu vực mở đầu (Hero)**, thay tiêu đề, mô tả, ảnh nền hoặc CTA, lưu nháp, xem trước rồi mới công bố.

**Cách sử dụng:**

- `Trang mặc định: chọn trang → chọn khu vực → cập nhật nội dung → lưu bản nháp → xem trước toàn trang → công bố`
- `Trang bổ sung: tạo trang → nhập tên trang → hệ thống tạo đường dẫn và mẫu gồm phần đầu trang + vùng nội dung → cập nhật nội dung → xem trước → công bố`

![Màn hình quản lý Trang nội dung](https://lh3.googleusercontent.com/d/10vpyNYbrzq1VP8fPT4NTrirpJMoVobwX=w1600)

> **Hình 4.** Mỗi trang được quản lý theo khu vực nội dung, bản nháp và phiên bản đã công bố.

#### Sự kiện

**Dùng để làm gì?** Quản lý hội thảo, đào tạo, chương trình giới thiệu sản phẩm và các sự kiện của CIC.

Trạng thái sắp diễn ra, đang diễn ra hoặc đã kết thúc được xác định theo thời gian sự kiện; việc sự kiện có xuất hiện trên Website được kiểm soát riêng bằng trạng thái bản nháp hoặc đã xuất bản.

**Có thể làm gì?**

- Quản lý nội dung, hình ảnh, thời gian, địa điểm và thông tin đăng ký.
- Theo dõi trạng thái sắp diễn ra, đang diễn ra hoặc đã kết thúc.
- Gắn tin tức, sản phẩm và sự kiện liên quan; đánh dấu nổi bật hoặc hiển thị trên trang chủ.
- Tìm kiếm, lọc, xem trước, xuất bản hoặc xử lý nhiều sự kiện cùng lúc.

**Cách sử dụng:**  
`Tạo sự kiện → nhập nội dung, thời gian, địa điểm và đăng ký → gắn nội dung liên quan → xem trước → công bố`

![Màn hình quản lý Sự kiện](https://lh3.googleusercontent.com/d/1_LhkrbnDvVr-XdIKytvZQmXFpR1yea_J=w1600)

> **Hình 5.** Thời gian, trạng thái công bố và thông tin đăng ký được theo dõi tại cùng một nơi.

#### Dự án

**Dùng để làm gì?** Quản lý hồ sơ dự án tiêu biểu để giới thiệu năng lực và kinh nghiệm của CIC.

**Có thể làm gì?**

- Quản lý mô tả, khách hàng, địa điểm, lĩnh vực, giải pháp, công nghệ và thời gian thực hiện.
- Chọn một ảnh đại diện; hình ảnh, video và tài liệu khác được chèn trực tiếp trong nội dung chi tiết.
- Đánh dấu dự án nổi bật, sắp xếp thứ tự hiển thị.
- Tìm kiếm, lưu nháp, xem trước, công bố hoặc xử lý nhiều dự án cùng lúc.

**Cách sử dụng:**  
`Tạo dự án → nhập hồ sơ và nội dung chi tiết → chọn ảnh đại diện → gắn sản phẩm, dịch vụ liên quan → xem trước → công bố`

![Màn hình quản lý Dự án](https://lh3.googleusercontent.com/d/1aYJVY8xE8QfZfpqOUBTk_yGJPRqvQ3Wk=w1600)

> **Hình 6.** Hồ sơ dự án kết nối nội dung chi tiết, ảnh đại diện và các giải pháp liên quan.

#### Dịch vụ

**Dùng để làm gì?** Quản lý nội dung các dịch vụ tư vấn, triển khai và hỗ trợ CIC cung cấp.

**Có thể làm gì?**

- Quản lý mô tả, hình ảnh và thông tin hỗ trợ tìm kiếm.
- Gắn sản phẩm liên quan; xem yêu cầu khách hàng và vị trí đang sử dụng dịch vụ.
- Theo dõi phiên bản và hoạt động chỉnh sửa.
- Khi sửa một dịch vụ đã công bố, hệ thống tạo bản nháp làm việc mới; phiên bản đang công khai vẫn được giữ cho đến lần công bố tiếp theo.
- Tìm kiếm, lọc, lưu nháp, xem trước, công bố hoặc chuyển vào thùng rác.

**Cách sử dụng:**
`Tạo dịch vụ → cập nhật nội dung và hình ảnh → gắn sản phẩm liên quan → xem trước → công bố`

![Màn hình quản lý Dịch vụ](https://lh3.googleusercontent.com/d/1QiW8ayBKB6Oc46bj95Zf2PUFrTflgJNt=w1600)

> **Hình 7.** Dịch vụ được quản lý cùng trạng thái công bố và sản phẩm hỗ trợ liên quan.


---

### 2.3. Sản phẩm

Các dữ liệu phân loại và đầu mối đang được sản phẩm sử dụng không thể xóa vĩnh viễn. Khi không còn dùng cho dữ liệu mới, người quản trị có thể chuyển chúng sang trạng thái ngừng sử dụng; các sản phẩm cũ vẫn giữ nguyên liên kết.

#### Sản phẩm

**Dùng để làm gì?** Quản lý tập trung thông tin về phần mềm, sản phẩm và giải pháp CIC cung cấp, từ nội dung giới thiệu đến dữ liệu phục vụ tư vấn.

**Có thể làm gì?**

- Quản lý tên, mã, mô tả, trạng thái và thông tin chi tiết sản phẩm.
- Phân loại theo danh mục, hãng, lĩnh vực ứng dụng và loại sản phẩm.
- Quản lý ảnh, video, tài liệu và nội dung tải xuống.
- Gắn người phụ trách kinh doanh; đánh dấu sản phẩm tiêu biểu.
- Tìm kiếm, lọc, xem trước, nhân bản và theo dõi hoạt động liên quan.
- Xuất bản, chuyển về bản nháp hoặc xử lý nhiều sản phẩm cùng lúc.

**Ví dụ thực tế:** Khi thêm một phần mềm mới, bộ phận sản phẩm nhập nội dung, chọn dữ liệu phân loại, bổ sung tài liệu và gắn người phụ trách. Sau khi xem trước và công bố, khách hàng có đủ thông tin và biết đúng đầu mối tư vấn.

**Cách sử dụng:**  
`Tạo sản phẩm → nhập thông tin và phân loại → thêm hình ảnh, video và tài liệu → gắn người phụ trách → xem trước → công bố`

![Màn hình quản lý Sản phẩm](https://lh3.googleusercontent.com/d/11YjXnU4DG3gdYZ0rV4xqml8i2dLhfup3=w1600)

> **Hình 8.** Sản phẩm được quản lý cùng dữ liệu phân loại, tài liệu và đầu mối phụ trách.

#### Danh mục sản phẩm

**Dùng để làm gì?** Tổ chức sản phẩm theo cấu trúc nhiều cấp để quản lý và tra cứu thống nhất.

**Có thể làm gì?**  
Tạo · Sửa · Chọn cấp cha–con · Sắp xếp · Bật/tắt hiển thị · Xem số lượng và phạm vi sản phẩm đang sử dụng trước khi thay đổi.

**Cách sử dụng:**  
`Tạo danh mục → chọn cấp và thứ tự → cập nhật trạng thái → lưu → dùng khi phân loại sản phẩm`

![Màn hình quản lý Danh mục sản phẩm](https://lh3.googleusercontent.com/d/1xG-LpiMJ3Watc0Cyb2tnKb3j3eBdCA27=w1600)

> **Hình 9.** Danh mục nhiều cấp tạo cấu trúc thống nhất cho danh sách sản phẩm.

#### Hãng sản xuất

**Dùng để làm gì?** Quản lý thông tin hãng sản xuất, nhà phát triển hoặc đối tác gắn với sản phẩm.

**Có thể làm gì?**  
Tạo · Sửa tên, logo, quốc gia và Website · Sắp xếp · Quản lý trạng thái hiển thị · Xem sản phẩm đang sử dụng · Tìm kiếm hoặc ngừng sử dụng một hay nhiều hãng.

**Cách sử dụng:**  
`Tạo hãng → cập nhật thông tin nhận diện → bật trạng thái → lưu → gắn với sản phẩm`

![Màn hình quản lý Hãng sản xuất](https://lh3.googleusercontent.com/d/1apaBZAWCBL0bSnHBF4hQA2G2q5-VbiuB=w1600)

> **Hình 10.** Thông tin nhận diện của hãng được dùng chung cho các sản phẩm liên quan.

#### Lĩnh vực ứng dụng

**Dùng để làm gì?** Phân nhóm sản phẩm theo ngành nghề hoặc bài toán ứng dụng thực tế.

**Có thể làm gì?**  
Tạo · Sửa tên, biểu tượng và màu nhận diện · Quản lý trạng thái · Gắn sản phẩm · Xem phạm vi đang sử dụng · Hỗ trợ lọc và trình bày sản phẩm.

**Cách sử dụng:**  
`Tạo lĩnh vực → cập nhật thông tin hiển thị → lưu → gắn các sản phẩm phù hợp`

![Màn hình quản lý Lĩnh vực ứng dụng](https://lh3.googleusercontent.com/d/1H7e-j88SeDaQzGwpswj7NwZPduyJGRNd=w1600)

> **Hình 11.** Lĩnh vực giúp khách hàng thu hẹp sản phẩm theo nhu cầu thực tế.

#### Loại sản phẩm

**Dùng để làm gì?** Chuẩn hóa các loại sản phẩm theo đặc điểm cung cấp hoặc hình thức sử dụng để phục vụ phân loại, lọc và thống kê.

**Có thể làm gì?**  
Tạo · Sửa tên và biểu tượng · Quản lý trạng thái · Sắp xếp · Gắn cho sản phẩm · Tra cứu sản phẩm đang sử dụng.

**Cách sử dụng:**  
`Tạo loại → cập nhật thông tin → lưu → sử dụng khi phân loại sản phẩm`

![Màn hình quản lý Loại sản phẩm](https://lh3.googleusercontent.com/d/1htITc9yC0DXqfTu9A4hBeNg3BpdOXlEv=w1600)

> **Hình 12.** Loại sản phẩm là dữ liệu chuẩn dùng cho phân loại, bộ lọc và thống kê.

#### Người phụ trách kinh doanh

**Dùng để làm gì?** Quản lý đầu mối tư vấn, kinh doanh hoặc hỗ trợ kỹ thuật theo sản phẩm và khu vực.

Đây là hồ sơ đầu mối kinh doanh gắn với sản phẩm và phạm vi phụ trách, không phải tài khoản dùng để đăng nhập CMS.

**Có thể làm gì?**  
Quản lý thông tin liên hệ · Xác định vai trò · Gắn sản phẩm và khu vực phụ trách · Bật/tắt hiển thị · Tìm kiếm, sắp xếp · Xem phạm vi đang phụ trách.

**Cách sử dụng:**  
`Tạo đầu mối → nhập thông tin liên hệ và vai trò → chọn sản phẩm, khu vực → lưu`

![Màn hình quản lý Người phụ trách kinh doanh](https://lh3.googleusercontent.com/d/1ZjXfLijl-at6TRGVzeGN87L4-rWVsBns=w1600)

> **Hình 13.** Mỗi đầu mối được gắn với vai trò và phạm vi sản phẩm cụ thể.

---

### 2.4. Website

#### Menu

**Dùng để làm gì?** Quản lý cấu trúc điều hướng để người xem đi tới đúng khu vực và nội dung trên Website.

**Có thể làm gì?**  
Chọn nhóm menu theo vị trí · Tạo nhiều cấp · Sửa tên, liên kết, cách mở và biểu tượng · Sắp xếp · Đổi cấp cha–con · Bật/tắt hiển thị · Xem trước.

**Cách sử dụng:**  
`Chọn nhóm menu → thêm hoặc sửa mục → sắp xếp cấp và thứ tự → xem trước → lưu`

![Màn hình quản lý Menu](https://lh3.googleusercontent.com/d/1RCRQfB78BoGsSJOZmxV-WCxvc20E4Lum=w1600)

> **Hình 14.** Cây menu cho biết rõ cấp điều hướng, thứ tự và trạng thái hiển thị.


#### Thư viện media

**Dùng để làm gì?** Lưu trữ tập trung ảnh, video và tài liệu để các bộ phận dùng lại trong CMS.

**Có thể làm gì?**

- Tải lên, tìm kiếm, phân loại và tổ chức tệp theo thư mục hoặc album.
- Quản lý tiêu đề, mô tả, nội dung thay thế, thẻ và thông tin bản quyền.
- Xem nơi đang sử dụng và lịch sử thay thế tệp.
- Phát hiện tệp thiếu thông tin, trùng lặp hoặc không còn sử dụng.
- Thay tệp nhưng giữ liên kết hiện có; chuyển tệp không còn cần thiết vào thùng rác.

**Cách sử dụng:**  
`Tải tệp lên → bổ sung thông tin → xếp vào thư mục hoặc album → chọn tệp khi biên tập nội dung`

![Màn hình Thư viện media](https://lh3.googleusercontent.com/d/1JMwdZVE1bH1f8cmD89ZNNu7EtuBkE6Ma=w1600)

> **Hình 15.** Tài nguyên được tổ chức tập trung và có thể kiểm tra nơi đang sử dụng.

---

### 2.5. Tương tác khách hàng

Nhóm này gồm bốn chức năng có vai trò riêng nhưng phối hợp trong cùng quá trình thu hút và tiếp nhận nhu cầu khách hàng:

- **CTA** tạo điểm bắt đầu hành động, chẳng hạn Đăng ký tư vấn, Yêu cầu báo giá, Tải tài liệu, Liên hệ hoặc Xem thêm.
- **Biểu mẫu** thu thập thông tin khi hành động yêu cầu khách hàng cung cấp dữ liệu.
- **Yêu cầu khách hàng** là hồ sơ công việc được tạo từ dữ liệu khách gửi để bộ phận phụ trách tiếp nhận, phân công và theo dõi xử lý.
- **Mẫu email** chuẩn hóa nội dung xác nhận cho khách hàng và thông báo cho bộ phận tiếp nhận.

Một luồng phổ biến là:

**Khách chọn CTA → CTA mở Biểu mẫu → khách gửi thông tin → CMS tạo Yêu cầu khách hàng → gửi email nếu được cấu hình → bộ phận phụ trách tiếp nhận và xử lý**

CTA không bắt buộc phải mở Biểu mẫu. CTA cũng có thể dẫn tới một trang, Website bên ngoài, tài liệu, địa chỉ email hoặc kênh liên hệ được Website hỗ trợ. Chỉ khi khách hàng thực sự gửi thông tin qua Website thì CMS mới phát sinh dữ liệu cần tiếp nhận và theo dõi trong **Yêu cầu khách hàng**.

#### Hai nhóm CTA và Biểu mẫu

> **Hiểu nhanh:** **Hệ thống** = Website đã có sẵn vị trí sử dụng; **Bổ sung** = người quản trị tự tạo để dùng tại các vùng CMS cho phép.

CTA và Biểu mẫu được phân thành hai nhóm để người quản trị hiểu rõ phạm vi sử dụng:

| Nhóm | Nguồn hình thành | Cách sử dụng | Giới hạn |
| --- | --- | --- | --- |
| **Hệ thống** | Được cấu hình cho các vị trí và nghiệp vụ chính của Website | Cập nhật nội dung, hành động, trường thông tin và cấu hình tiếp nhận trong phạm vi được phép | Không xóa, không đổi mã định danh và không tự chuyển sang vị trí khác làm thay đổi bố cục cố định |
| **Bổ sung** | Do người quản trị tạo khi phát sinh chiến dịch hoặc nhu cầu nội dung mới | Chèn vào vùng soạn thảo được hỗ trợ hoặc liên kết CTA với Biểu mẫu | Không tự tạo thêm khu vực mới và không thay đổi cấu trúc, thành phần hay bố cục cố định của Website |

Ví dụ về nhóm **Hệ thống** gồm nút **Đăng ký tư vấn** tại trang sản phẩm, Biểu mẫu **Gửi yêu cầu** tại trang Liên hệ hoặc CTA **Yêu cầu báo giá** tại khu vực giới thiệu dịch vụ. Người quản trị không phải tạo lại các thành phần này từ đầu.

Ví dụ về nhóm **Bổ sung** là CTA **Nhận tư vấn về sản phẩm** được tạo cho một bài Tin tức hoặc Biểu mẫu đăng ký riêng cho một chiến dịch. Các thành phần này chỉ được chèn vào Tin tức, Sự kiện, Sản phẩm, Dịch vụ, Trang nội dung hoặc vùng soạn thảo khác khi vùng đó được CMS cho phép.

#### Phạm vi CTA và Biểu mẫu

Phạm vi hiện tại được giới hạn như sau:

- Biểu mẫu dùng các loại trường và quy tắc nhập liệu Website hỗ trợ. **Mã trường do hệ thống tự sinh và không cho sửa trực tiếp** để dữ liệu gửi về, Mẫu email và Yêu cầu khách hàng không bị sai liên kết.
- Sau khi gửi, hệ thống có thể lưu lượt gửi, tạo Yêu cầu khách hàng, thông báo nội bộ và gửi xác nhận cho khách theo cấu hình.
- Phạm vi hiện tại không phải công cụ dựng landing page, không thiết kế luồng nhiều bước hoặc điều kiện rẽ nhánh, không chấm điểm lead, không tự chạy chiến dịch marketing và không thay thế CRM. Khả năng kết nối CRM chỉ là hướng tích hợp trong tương lai được nêu tại phần Yêu cầu khách hàng.

#### CTA

**Dùng để làm gì?** Quản lý các nút hoặc điểm kêu gọi khách hàng thực hiện một hành động, chẳng hạn **Đăng ký tư vấn**, **Yêu cầu báo giá**, **Tải tài liệu**, **Liên hệ** hoặc **Xem thêm**.

**Có thể làm gì?**

- Soạn nội dung hiển thị, mô tả, biểu tượng và hình thức trình bày theo các lựa chọn Website hỗ trợ.
- Cấu hình CTA để mở Biểu mẫu, đi tới đường dẫn trong hoặc ngoài Website, tải tài liệu, mở email hoặc kênh liên hệ được hỗ trợ.
- Với CTA **Hệ thống**, cập nhật nội dung và hành động nhưng giữ nguyên mã định danh và vị trí thuộc bố cục cố định.
- Với CTA **Bổ sung**, tạo mới rồi chèn vào vùng nội dung được CMS hỗ trợ.
- Xem trước, kiểm tra vị trí đang sử dụng, tìm kiếm, lọc và nhân bản.
- Quản lý trạng thái bản nháp, hoạt động, ngừng hoạt động, lưu trữ hoặc thùng rác theo quyền.

**Ví dụ thực tế:** Nút **Đăng ký tư vấn** thuộc nhóm Hệ thống trên trang sản phẩm được cấu hình để mở Biểu mẫu đăng ký tư vấn. Trong một bài Tin tức, người biên tập có thể tạo CTA **Nhận tư vấn về sản phẩm** thuộc nhóm Bổ sung và chèn CTA đó vào giữa hoặc cuối bài.

**Cách sử dụng:**  

- `CTA Hệ thống: chọn CTA → cập nhật nội dung hoặc hành động → xem trước → công bố`
- `CTA Bổ sung: tạo CTA → nhập nội dung → chọn hành động đích → xem trước → công bố → chèn vào vùng nội dung được hỗ trợ`

![Màn hình quản lý CTA](https://lh3.googleusercontent.com/d/1saL74haBHyPeDaxgZgey1GAnXB-Mxlkf=w1600)

> **Hình 16.** CTA có thể được tái sử dụng tại nhiều vị trí và dẫn tới đúng hành động.

#### Biểu mẫu

**Dùng để làm gì?** Thu thập thông tin khách hàng theo cấu trúc phù hợp với từng nhu cầu như tư vấn, báo giá hoặc đăng ký sự kiện.

**Có thể làm gì?**

- Với Biểu mẫu **Hệ thống**, điều chỉnh các trường được phép cấu hình mà không phải tạo lại biểu mẫu của trang.
- Với Biểu mẫu **Bổ sung**, tạo biểu mẫu mới rồi chèn vào vùng nội dung được hỗ trợ hoặc liên kết với CTA.
- Thêm và sắp xếp trường; quy định trường bắt buộc, kiểu dữ liệu và quy tắc nhập liệu.
- Mã của từng trường được hệ thống tự sinh và chỉ hiển thị để đối chiếu; người quản trị không nhập hoặc sửa mã này.
- Cấu hình việc lưu lượt gửi thành Yêu cầu khách hàng, gửi thông báo nội bộ và gửi email xác nhận cho khách.
- Xem trước biểu mẫu và theo dõi lượt gửi.
- Tìm kiếm, lọc, nhân bản; quản lý trạng thái hoạt động, bản nháp, lưu trữ hoặc thùng rác.
- Ghi nhận nguồn phát sinh gồm Biểu mẫu, CTA, trang hoặc nội dung, vị trí sử dụng và đường dẫn để bộ phận tiếp nhận hiểu khách hàng đang quan tâm đến nội dung nào.

**Ví dụ thực tế:** CTA **Yêu cầu báo giá** tại trang sản phẩm mở Biểu mẫu báo giá. Khách hàng nhập họ tên, số điện thoại, email và nội dung cần tư vấn rồi gửi. CMS lưu lượt gửi, tạo một Yêu cầu khách hàng, đồng thời ghi nhận CTA, sản phẩm và đường dẫn phát sinh. Nếu email đã được cấu hình, khách hàng nhận xác nhận và bộ phận phụ trách nhận thông báo.

**Cách sử dụng:**  

- `Biểu mẫu Hệ thống: chọn Biểu mẫu → cập nhật trường và cấu hình tiếp nhận → xem trước → công bố`
- `Biểu mẫu Bổ sung: tạo Biểu mẫu → thêm và sắp xếp trường → thiết lập tiếp nhận, thông báo → xem trước → công bố → chèn vào nội dung hoặc liên kết với CTA`

![Màn hình quản lý Biểu mẫu](https://lh3.googleusercontent.com/d/1A_ZvREUePRr9f7ZLKw-7Ve4FClXmJqCb=w1600)

> **Hình 17.** Các trường và quy tắc được cấu hình theo mục tiêu thu thập thông tin.

#### Yêu cầu khách hàng

**Dùng để làm gì?** Tiếp nhận tập trung nhu cầu khách hàng từ Website và quản lý toàn bộ quá trình xử lý đến khi hoàn thành. Chức năng này khác Biểu mẫu: Biểu mẫu thu thập dữ liệu, còn Yêu cầu khách hàng là hồ sơ công việc để phân công và theo dõi.

**Có thể làm gì?**

- Xem thông tin khách gửi và nguồn phát sinh gồm Biểu mẫu, CTA, trang hoặc nội dung, vị trí và đường dẫn liên quan.
- Lọc theo trạng thái, mức ưu tiên, nguồn tiếp nhận và người phụ trách.
- Đặt hoặc thay đổi mức ưu tiên; phân công hoặc đổi người xử lý.
- Ghi chú, gắn thẻ, cập nhật trạng thái và theo dõi lịch sử diễn biến.
- Xử lý nhiều yêu cầu cùng lúc, chuyển yêu cầu không còn sử dụng vào thùng rác.
- Xuất danh sách phục vụ báo cáo và phối hợp công việc.

> **Khả năng tích hợp CRM trong tương lai:** CMS hiện vẫn tiếp nhận và quản lý đầy đủ Yêu cầu khách hàng, từ phân công, đặt mức ưu tiên đến cập nhật trạng thái, ghi chú và lịch sử xử lý. Nếu CIC triển khai CRM hoặc hệ thống quản lý lead tập trung, CMS có thể tự động chuyển lead cùng nguồn phát sinh từ Website — Biểu mẫu, CTA, trang hoặc Sản phẩm liên quan, đường dẫn và chiến dịch nếu có — sang hệ thống đó.
>
> Khi đó, Sales có thể chăm sóc và cập nhật lead tại CRM; trạng thái, người phụ trách hoặc kết quả cần hiển thị trên CMS sẽ được đồng bộ trở lại. Không nhập tay cùng một dữ liệu nghiệp vụ ở cả hai nơi: CIC cần xác định hệ thống quản lý chính cho từng loại dữ liệu và đồng bộ sang hệ thống còn lại.

**Ví dụ thực tế:** Một khách gửi biểu mẫu từ trang sản phẩm. CMS ghi nhận sản phẩm và đường dẫn phát sinh; trưởng nhóm đặt ưu tiên “Cao”, giao cho nhân viên kinh doanh. Nhân viên cập nhật **Mới → Đang xử lý → Hoàn thành** và toàn bộ diễn biến được giữ trong lịch sử.

**Cách sử dụng:**  
`Tiếp nhận → xác định nguồn → đặt ưu tiên → phân công → xử lý và ghi chú → cập nhật trạng thái → hoàn thành`

![Màn hình quản lý Yêu cầu khách hàng](https://lh3.googleusercontent.com/d/1SctN7u8-IcuQhDAtg8sFA1-sCQwdhoci=w1600)

> **Hình 18.** Yêu cầu khách hàng được tập trung để theo dõi trạng thái, mức ưu tiên và người phụ trách.

#### Mẫu email

**Dùng để làm gì?** Chuẩn hóa email gửi khách hàng hoặc nội bộ trong các tình huống như xác nhận đã nhận yêu cầu.

**Có thể làm gì?**

- Tạo mẫu theo tình huống sử dụng và đối tượng nhận là khách hàng hoặc nội bộ.
- Soạn tiêu đề, nội dung; chèn dữ liệu khách hàng, sản phẩm, Biểu mẫu hoặc Yêu cầu khách hàng.
- Chọn mẫu trong cấu hình Biểu mẫu để gửi email xác nhận hoặc thông báo khi có lượt gửi.
- Lọc theo trạng thái, lưu nháp, xem trước bằng dữ liệu mẫu, nhân bản, công bố và xem nơi đang sử dụng.

**Cách sử dụng:**  
`Chọn tình huống → soạn mẫu và chèn dữ liệu → xem trước → công bố → chọn mẫu trong Biểu mẫu hoặc luồng thông báo`

![Màn hình quản lý Mẫu email](https://lh3.googleusercontent.com/d/166vpIVCN3csb2xnz-wETZ7hdu2dV1SD4=w1600)

> **Hình 19.** Mẫu email được quản lý theo tình huống và đối tượng nhận.

---

### 2.6. Quản trị hệ thống

#### Người dùng

**Dùng để làm gì?** Quản lý tài khoản của những người được phép truy cập CMS. Mỗi tài khoản đại diện cho một người cụ thể và được gán vai trò, phạm vi làm việc phù hợp.

**Có thể làm gì?**

- Tạo và cập nhật hồ sơ người dùng.
- Kích hoạt, tạm khóa hoặc ngừng sử dụng tài khoản mà không làm mất lịch sử công việc.
- Gán vai trò, xem quyền có hiệu lực và quản lý phạm vi phụ trách.
- Đổi mật khẩu, gửi yêu cầu đặt lại mật khẩu và quản lý thông tin bảo mật.
- Theo dõi lịch sử trạng thái; tìm kiếm, lọc và đổi trạng thái nhiều tài khoản.

**Cách sử dụng:**  
`Tạo tài khoản → cập nhật hồ sơ → gán vai trò và phạm vi → kích hoạt → điều chỉnh trạng thái khi nhân sự thay đổi`

![Màn hình quản lý Người dùng](https://lh3.googleusercontent.com/d/1LyjiAxAQt76G9VBlDX0fYmHfwtpicPr6=w1600)

> **Hình 20.** Danh sách tài khoản cho biết trạng thái, vai trò và phạm vi của từng người.

#### Vai trò & quyền

**Dùng để làm gì?** Quy định một nhóm người dùng được thực hiện thao tác nào trong CMS. Mô hình vận hành chính là **Người dùng → Vai trò → Quyền**; phạm vi chỉ là thiết lập nâng cao khi nghiệp vụ thực tế yêu cầu.

Ví dụ về phạm vi: một người dùng có quyền sửa **Sản phẩm**, nhưng nếu được giới hạn theo phạm vi phụ trách thì chỉ sửa được các Sản phẩm được giao cho mình. Phạm vi không phải một tầng quyền bắt buộc; khi không thiết lập giới hạn, quyền có hiệu lực trên toàn bộ dữ liệu mà vai trò được phép truy cập.

**Có thể làm gì?**

- Tạo vai trò theo trách nhiệm công việc.
- Chọn quyền xem, tạo, sửa, công bố hoặc xóa theo từng phân hệ.
- Gán hoặc thu hồi vai trò của người dùng.
- Nếu người dùng không có bất kỳ quyền nào trong một chức năng, chức năng đó không xuất hiện trên menu CMS. Khi được cấp ít nhất một quyền phù hợp, menu mới được hiển thị; hệ thống vẫn kiểm tra quyền khi người dùng mở hoặc thao tác trên chức năng.
- Bật hoặc tắt vai trò; khi tắt, quyền tạm ngừng hiệu lực nhưng các lượt gán được giữ để có thể bật lại.
- Giới hạn theo nội dung phụ trách hoặc chi nhánh trong phần nâng cao khi thật sự cần.
- Danh mục quyền được định nghĩa trong code/backend, không cho quản trị viên tự tạo Task hoặc quyền trường dữ liệu trên giao diện.
- Mọi thay đổi quyền được ghi vào Nhật ký hoạt động thay cho quy trình versioning riêng của vai trò.

**Ví dụ thực tế:** “Biên tập viên Tin tức” được xem, tạo và sửa bài nhưng không được công bố. “Trưởng phòng Truyền thông” có thêm quyền công bố và xuất dữ liệu. Nhờ đó, hai người cùng làm việc trong chức năng Tin tức nhưng chịu trách nhiệm ở các bước khác nhau.

**Cách sử dụng:**  
`Tạo hoặc chọn vai trò → chọn quyền theo phân hệ → lưu → gán cho người dùng`

![Màn hình quản lý Vai trò và quyền](https://lh3.googleusercontent.com/d/1dEAgQT8nNcxsLjQlKbuTisMnw-h0XcCd=w1600)

> **Hình 21.** Ma trận quyền xác định rõ mỗi vai trò được xem và thực hiện công việc nào.


#### Cấu hình hệ thống

**Dùng để làm gì?** Quản lý thông tin chung được sử dụng trên toàn Website và CMS, giúp thông tin doanh nghiệp hiển thị thống nhất và các kết nối của hệ thống hoạt động đúng.

**Có thể làm gì?**

- Cập nhật hotline, email, logo và liên kết mạng xã hội của CIC tại một nơi.
- Thêm, sửa, ẩn, xóa và sắp thứ tự nhiều trụ sở/chi nhánh; chọn một địa điểm làm trụ sở chính và nhập thông tin liên hệ, giờ làm việc, bản đồ riêng cho từng địa điểm.
- Trang Liên hệ và Footer tự lấy các chi nhánh đang hiển thị theo đúng workspace/ngôn ngữ; không phải nhập lại địa chỉ hoặc map trong Trang nội dung.
- Quản lý thông tin dùng chung và thông tin thay đổi theo ngôn ngữ.
- Lưu trực tiếp các thay đổi thông thường; hệ thống ghi lại người thực hiện và nội dung đã sửa.
- Với thiết lập quan trọng liên quan bảo mật hoặc kết nối dịch vụ khác, hệ thống yêu cầu kiểm tra giá trị cũ–mới trước khi áp dụng.
- Xem lại lịch sử các lần thay đổi quan trọng khi cần đối chiếu.

**Cách sử dụng:**  
- `Thông tin thông thường: chọn nhóm → cập nhật → lưu`
- `Chi nhánh: Doanh nghiệp & liên hệ → Trụ sở & chi nhánh → thêm/sắp thứ tự → lưu`
- `Thiết lập quan trọng: cập nhật → kiểm tra thay đổi → áp dụng`

![Màn hình Cấu hình hệ thống](https://lh3.googleusercontent.com/d/1LuposJ1B5UxPKeT1-lKNtgPCAdP5e-e4=w1600)

> **Hình 22.** Thông tin dùng chung của CIC được tập trung theo nhóm để cập nhật và kiểm soát thống nhất.

#### SEO & URL

**Dùng để làm gì?** Kiểm soát cách Website CIC xuất hiện trên Google và các công cụ tìm kiếm, đồng thời bảo đảm người dùng vẫn đến đúng nội dung khi địa chỉ trang thay đổi.

**Có thể làm gì?**

- Phát hiện trang đang thiếu tiêu đề, mô tả hoặc chưa được phép xuất hiện trên công cụ tìm kiếm.
- Quy định tiêu đề và mô tả mặc định cho từng loại trang; từng bài viết hoặc sản phẩm vẫn có thể dùng nội dung riêng.
- Xác định địa chỉ chính thức của một nội dung khi có nhiều đường dẫn cùng trỏ tới nội dung đó.
- Chuyển người dùng từ đường dẫn cũ sang đường dẫn mới để tránh trang lỗi khi đổi URL.
- Kiểm tra danh sách các trang Website cung cấp cho công cụ tìm kiếm thu thập.
- Đi tới đúng bài viết, sản phẩm hoặc trang nội dung để bổ sung thông tin còn thiếu.

**Cách sử dụng:**
`Kiểm tra trang còn thiếu thông tin → cập nhật cách hiển thị tìm kiếm hoặc đường dẫn → lưu → kiểm tra kết quả`

![Màn hình SEO & URL](https://lh3.googleusercontent.com/d/1TzzvXTPToe5ZCogveir4C7YamIkAkAu0=w1600)

> **Hình 23.** Màn hình cho biết trang nào cần bổ sung thông tin tìm kiếm và đường dẫn nào cần điều chỉnh.


#### Ngôn ngữ giao diện

**Dùng để làm gì?** Quản lý các câu chữ tiếng Việt và tiếng Anh hiển thị trên Website và CMS.

**Có thể làm gì?**  
Tìm kiếm và sửa câu chữ · Lọc theo Website/CMS, nhóm sử dụng và ngôn ngữ · Phát hiện nội dung thiếu hoặc chưa đồng nhất · Kiểm tra độ dài và thông tin bắt buộc phải giữ nguyên khi dịch.

**Cách sử dụng:**  
`Chọn khu vực và ngôn ngữ → tìm câu chữ → cập nhật bản dịch → kiểm tra ràng buộc → lưu`

![Màn hình quản lý Ngôn ngữ giao diện](https://lh3.googleusercontent.com/d/1y5UPwazZ5kDUm-f44GYw22YTpcA6Um2s=w1600)

> **Hình 24.** Câu chữ hai ngôn ngữ được kiểm soát theo khu vực sử dụng.

#### Nhật ký hoạt động

**Dùng để làm gì?** Ghi nhận và tra cứu hoạt động quản trị để biết ai đã thao tác, vào thời điểm nào, kết quả ra sao và nội dung đã thay đổi.

**Có thể làm gì?**

- Lọc theo người dùng, thời gian, chức năng và kết quả.
- Xem dữ liệu trước và sau thay đổi.
- Rà soát riêng hoạt động quan trọng như đổi quyền hoặc xóa dữ liệu.
- Nhật ký dùng để tra cứu và xuất báo cáo; người dùng không sửa hoặc xóa từng sự kiện đã ghi nhận.
- Tạo và theo dõi yêu cầu xuất thông tin phục vụ kiểm tra, đối soát hoặc báo cáo.

**Cách sử dụng:**  
`Chọn khoảng thời gian và chức năng → lọc sự kiện → mở chi tiết → đối chiếu người thực hiện và thay đổi`

#### Thùng rác

**Dùng để làm gì?** Giữ nội dung đã xóa để quản trị viên có thể kiểm tra, phục hồi hoặc xác nhận loại bỏ vĩnh viễn.

**Có thể làm gì?**

- Tìm và lọc nội dung đã xóa; xem thời điểm và người thực hiện.
- Phục hồi nội dung về trạng thái an toàn là bản nháp hoặc ngừng hoạt động; xử lý trường hợp đường dẫn, dữ liệu cha hoặc liên kết bị trùng khi khôi phục.
- Kiểm tra liên kết phụ thuộc trước khi xóa vĩnh viễn.
- Giữ lại dữ liệu cần bảo toàn hoặc loại bỏ vĩnh viễn khi đã xác nhận.

**Cách sử dụng:**  
`Tìm nội dung đã xóa → kiểm tra thông tin và ảnh hưởng → phục hồi hoặc xác nhận xóa vĩnh viễn`

**Tình huống chung với Nhật ký hoạt động:**  
`Phát hiện nội dung bị sửa hoặc xóa nhầm → dùng Nhật ký xác định người và thay đổi → dùng phiên bản phù hợp hoặc Thùng rác để phục hồi khi có thể`

![Màn hình Thùng rác](https://lh3.googleusercontent.com/d/1XvPGCwiNGQanuLF9yGkbyOtCgSF3l4SS=w1600)

> **Hình 25.** Dữ liệu đã xóa được giữ lại để kiểm tra trước khi phục hồi hoặc xóa vĩnh viễn.

---

### 2.7. Tìm kiếm toàn cục

**Dùng để làm gì?** Tìm nhanh nội dung và chức năng trên toàn CMS từ một điểm duy nhất.

**Có thể làm gì?**  
Tìm theo từ khóa · Lọc theo chức năng, sản phẩm, tin tức, yêu cầu khách hàng, sự kiện, dự án, trang nội dung, dịch vụ, biểu mẫu, CTA hoặc media · Chỉ hiển thị dữ liệu và chức năng người dùng có quyền truy cập · Xem tóm tắt · Sao chép thông tin · Đi thẳng tới nơi xử lý.

**Cách sử dụng:**  
`Nhập từ khóa → lọc nhóm kết quả nếu cần → xem tóm tắt → mở đúng nội dung hoặc chức năng`

![Màn hình Tìm kiếm toàn cục](https://lh3.googleusercontent.com/d/1bZCyH6-Opcz2r0eNeWzP5UpLzCBPcncS=w1600)

> **Hình 26.** Một từ khóa trả về kết quả từ nhiều nhóm dữ liệu và dẫn tới đúng nơi xử lý.
