# HỆ THỐNG QUẢN TRỊ NỘI DUNG WEBSITE CIC

> CMS giúp CIC chủ động vận hành Website trên một nền tảng tập trung: từ quản lý nội dung, sản phẩm và hình ảnh doanh nghiệp đến tiếp nhận nhu cầu khách hàng, phân công trách nhiệm và kiểm soát thay đổi.

**Truy cập CMS:** [https://cic-web-sandy.vercel.app/cms/](https://cic-web-sandy.vercel.app/cms/)

## Mục lục

- [HỆ THỐNG QUẢN TRỊ NỘI DUNG WEBSITE CIC](#hệ-thống-quản-trị-nội-dung-website-cic)
  - [Mục lục](#mục-lục)
  - [1. CMS mới mở rộng những gì?](#1-cms-mới-mở-rộng-những-gì)
    - [1.1. Dữ liệu CMS cũ được giữ, chuyển đổi hay thay thế như thế nào?](#11-dữ-liệu-cms-cũ-được-giữ-chuyển-đổi-hay-thay-thế-như-thế-nào)
      - [Trường hợp cụ thể của Trang chủ](#trường-hợp-cụ-thể-của-trang-chủ)
  - [2. Mỗi bộ phận sử dụng CMS như thế nào?](#2-mỗi-bộ-phận-sử-dụng-cms-như-thế-nào)
    - [Lãnh đạo và cán bộ quản lý](#lãnh-đạo-và-cán-bộ-quản-lý)
    - [Truyền thông và nội dung](#truyền-thông-và-nội-dung)
    - [Sản phẩm](#sản-phẩm)
    - [Kinh doanh và tiếp nhận yêu cầu](#kinh-doanh-và-tiếp-nhận-yêu-cầu)
    - [Quản trị hệ thống](#quản-trị-hệ-thống)
  - [3. Danh mục chức năng CMS — Tra cứu](#3-danh-mục-chức-năng-cms--tra-cứu)
    - [3.1. Dashboard](#31-dashboard)
    - [3.2. Quản lý nội dung](#32-quản-lý-nội-dung)
      - [Tin tức](#tin-tức)
      - [Danh mục tin tức](#danh-mục-tin-tức)
      - [Trang nội dung](#trang-nội-dung)
      - [Sự kiện](#sự-kiện)
      - [Dự án](#dự-án)
    - [3.3. Sản phẩm/Dịch vụ](#33-sản-phẩmdịch-vụ)
      - [Sản phẩm](#sản-phẩm-1)
      - [Danh mục sản phẩm](#danh-mục-sản-phẩm)
      - [Hãng sản xuất](#hãng-sản-xuất)
      - [Lĩnh vực ứng dụng](#lĩnh-vực-ứng-dụng)
      - [Loại sản phẩm](#loại-sản-phẩm)
      - [Người phụ trách kinh doanh](#người-phụ-trách-kinh-doanh)
      - [Dịch vụ](#dịch-vụ)
    - [3.4. Trình bày Website](#34-trình-bày-website)
      - [Menu](#menu)
    - [3.5. Media](#35-media)
      - [Thư viện media](#thư-viện-media)
    - [3.6. Tương tác khách hàng](#36-tương-tác-khách-hàng)
      - [Hai nhóm CTA và Biểu mẫu](#hai-nhóm-cta-và-biểu-mẫu)
      - [CTA](#cta)
      - [Biểu mẫu](#biểu-mẫu)
      - [Yêu cầu khách hàng](#yêu-cầu-khách-hàng)
      - [Mẫu email](#mẫu-email)
    - [3.7. Người dùng \& phân quyền](#37-người-dùng--phân-quyền)
      - [Người dùng](#người-dùng)
      - [Vai trò \& quyền](#vai-trò--quyền)
    - [3.8. Cấu hình hệ thống](#38-cấu-hình-hệ-thống)
      - [Cấu hình hệ thống](#cấu-hình-hệ-thống)
      - [Ngôn ngữ giao diện](#ngôn-ngữ-giao-diện)
      - [Nhật ký hoạt động](#nhật-ký-hoạt-động)
      - [Thùng rác](#thùng-rác)
    - [3.9. SEO](#39-seo)
      - [SEO \& URL](#seo--url)
    - [3.10. Tiện ích CMS](#310-tiện-ích-cms)
      - [Tìm kiếm toàn cục](#tìm-kiếm-toàn-cục)

## 1. CMS mới mở rộng những gì?

CMS cũ đã quản lý tin tức, danh mục tin, sự kiện, sản phẩm cùng các dữ liệu phân loại, dịch vụ, menu, Block, người dùng, quyền trực tiếp, cấu hình, ngôn ngữ và thông tin SEO. CMS mới tiếp tục sử dụng các dữ liệu và nghiệp vụ cốt lõi này; phần khác biệt tập trung ở sáu phạm vi được tổ chức lại hoặc bổ sung:

- **Nội dung Website:** Với các trang có bố cục riêng, **Trang nội dung** thay cách cấu hình từng Block theo module và vị trí của CMS cũ bằng một hồ sơ trang gồm các khu vực cố định. Người biên tập mở trang, sửa từng khu vực, lưu bản nháp, xem trước toàn trang rồi công bố. **Dự án** là chức năng mới; CMS cũ không có module hoặc dữ liệu dự án tương ứng.
- **Tài nguyên dùng chung:** CMS cũ lưu ảnh và tệp trong các bảng hoặc trường của từng module, còn CMS mới có **Thư viện media** dùng chung với mã tài nguyên ổn định, thư mục, album, metadata, nơi sử dụng và lịch sử thay tệp.
- **CTA, Biểu mẫu và Mẫu email:** Nhóm **Hệ thống** gồm các CTA và Biểu mẫu được cấu hình cho những vị trí, mục đích chính của Website như liên hệ, đăng ký tư vấn hoặc yêu cầu báo giá. Người quản trị có thể sửa nội dung CTA, thay đổi các trường cần khách hàng cung cấp và cấu hình email xác nhận nhưng không thay đổi vị trí thuộc thiết kế cố định. Khi phát sinh nhu cầu khác, người quản trị tạo CTA hoặc Biểu mẫu thuộc nhóm **Bổ sung** rồi chèn vào các vùng nội dung được hỗ trợ. Khách chọn CTA, gửi Biểu mẫu và dữ liệu được chuyển thành Yêu cầu khách hàng cùng thông tin về trang hoặc nội dung phát sinh.
- **Nhu cầu khách hàng:** CMS cũ đã lưu liên hệ, đăng ký sản phẩm và đơn hàng ở các nguồn riêng. CMS mới không bỏ các dữ liệu này mà hợp nhất chúng khi vận hành thành **Yêu cầu khách hàng**, bổ sung nguồn phát sinh, mức ưu tiên, người phụ trách, trạng thái xử lý, ghi chú và lịch sử diễn biến.
- **Người dùng và phân quyền:** CMS mới chuẩn hóa luồng vận hành thành **Người dùng → Vai trò → Quyền**. Danh mục quyền do hệ thống định nghĩa; quản trị viên chỉ tạo vai trò, chọn quyền theo phân hệ và gán vai trò cho người dùng. Quyền trực tiếp legacy chỉ phục vụ chuyển đổi dữ liệu, không còn là một cơ chế quản trị song song trên giao diện.
- **Kiểm soát và tra cứu liên chức năng:** **Nhật ký hoạt động** ghi thống nhất người thực hiện, hành động, đối tượng, kết quả và dữ liệu trước–sau; **Thùng rác** giữ bản ghi để phục hồi và xử lý xung đột thay cho cách xóa cứng của phần lớn module cũ. **Tìm kiếm toàn cục** cho phép tìm qua nhiều nhóm dữ liệu từ một điểm và chỉ trả về nội dung người dùng có quyền truy cập.

### 1.1. Dữ liệu CMS cũ được giữ, chuyển đổi hay thay thế như thế nào?

Việc chuyển đổi không thực hiện theo nguyên tắc “mỗi bảng cũ tạo một chức năng mới tương ứng”. Một số module cũ được đặt tên theo cách trình bày trên Website, nhưng bên trong lại chứa nhiều loại dữ liệu có ý nghĩa khác nhau. CMS mới phân loại lại dữ liệu theo **nghiệp vụ thực tế và vị trí sử dụng**, sau đó mới xác định nơi quản lý phù hợp.

Có bốn cách xử lý:

- **Kế thừa:** giữ nghiệp vụ và dữ liệu cốt lõi, đồng thời chuẩn hóa trạng thái, liên kết, media và quy trình công bố.
- **Chuyển đổi:** giữ dữ liệu còn giá trị nhưng đưa về đúng chức năng hoặc khu vực nội dung mới.
- **Không tiếp tục thành module riêng:** không tái tạo một màn hình CMS chỉ để giữ cách tổ chức cũ; tệp và dữ liệu cần thiết vẫn được chuyển đổi hoặc lưu để đối soát.
- **Bổ sung mới:** tạo dữ liệu và nghiệp vụ mà CMS cũ chưa có.

| CMS cũ | Thực tế đang quản lý | Cách xử lý trong CMS mới | Kết luận |
| --- | --- | --- | --- |
| **Tin tức, Sự kiện, Sản phẩm, Dịch vụ và các danh mục** | Nội dung và dữ liệu phân loại cốt lõi | Kế thừa, chuẩn hóa trạng thái, bản nháp/công bố, liên kết và media | Giữ và nâng cấp |
| **Block** | Các mảnh nội dung được gắn theo module và vị trí để ghép thành trang | Chuyển nội dung còn dùng sang từng khu vực cố định của **Trang nội dung**; dữ liệu tham chiếu tiếp tục lấy từ Tin tức, Sản phẩm, Sự kiện, Dự án hoặc Dịch vụ | Thay bằng cách quản lý theo trang và khu vực |
| **Banner** | Một nhóm dữ liệu trình bày hỗn hợp: ảnh Hero Trang chủ, logo đối tác, thành tựu/giải thưởng và có thể có banner chiến dịch | Không chuyển nguyên bảng thành một module Banner chung. Mỗi bản ghi được phân loại theo nơi sử dụng: Hero vào **Trang chủ → Hero**; giải thưởng vào **Trang chủ/Giới thiệu → Thành tựu & Giải thưởng**; đối tác vào khu vực **Đối tác**; ảnh gốc vào **Thư viện media** | Tách theo ý nghĩa, không giữ “Banner” như một thùng chứa chung |
| **Slideshow** | Tên module gợi ý là trình chiếu, nhưng dữ liệu thực tế đang được dùng làm nhóm ảnh/icon ở phần Hero của Trang chủ cũ | Không tạo module Slideshow tương ứng nếu Website mới không còn sử dụng cấu trúc này. Tệp còn giá trị được đưa vào Media; chỉ dữ liệu nào có vị trí tương ứng trong thiết kế mới mới được ánh xạ sang khu vực đó | Không tiếp tục thành module riêng; chuyển chọn lọc |
| **Ảnh và tệp nằm trong từng module** | Đường dẫn ảnh, icon, video hoặc tài liệu được lưu rải rác | Tạo tài nguyên trong **Thư viện media**, giữ mã ổn định và ghi nhận nơi sử dụng; bản ghi nội dung chỉ tham chiếu tài nguyên | Chuyển sang tài nguyên dùng chung |
| **Liên hệ, đăng ký sản phẩm và đơn hàng** | Nhu cầu khách hàng nằm ở các nguồn và luồng xử lý riêng | Giữ dữ liệu nguồn để đối soát, đồng thời chuẩn hóa thành **Yêu cầu khách hàng** để ưu tiên, phân công, ghi chú và theo dõi trạng thái | Hợp nhất khi vận hành, không làm mất dữ liệu gốc |
| **Quyền trực tiếp theo tài khoản/Task** | Quyền được cấp rời rạc cho từng người dùng | Chuyển sang **Người dùng → Vai trò → Quyền**; quyền trực tiếp cũ chỉ dùng để lập bảng ánh xạ và kiểm tra tương đương khi chuyển đổi | Thay cơ chế quản trị |
| **Dự án, Trang nội dung, Media, CTA, Biểu mẫu, Mẫu email, Nhật ký hoạt động, Thùng rác và Tìm kiếm toàn cục** | Không có module tương ứng đầy đủ trong CMS cũ | Tạo mới hoặc tổ chức lại để hỗ trợ vận hành liên chức năng | Bổ sung mới |

#### Trường hợp cụ thể của Trang chủ

Trang chủ cũ đang được quản lý rời rạc: nội dung hiển thị có thể nằm trong **Banner**, **Slideshow**, **Block** và các module nghiệp vụ khác nhau. Vì vậy, người vận hành phải biết tên module kỹ thuật và vị trí cũ mới xác định được nơi sửa.

Trong CMS mới, Trang chủ là một hồ sơ duy nhất trong **Trang nội dung**, gồm các khu vực có ý nghĩa rõ ràng như **Hero**, **Giới thiệu**, **Số liệu**, **Thành tựu & Giải thưởng**, **Dự án**, **Sự kiện**, **Tin tức**, **Đối tác** và **Liên hệ/CTA**. Mỗi khu vực xác định rõ trường nào được nhập trực tiếp, tài nguyên nào lấy từ Media và nội dung nào tham chiếu từ chức năng khác. Việc này không biến Trang chủ thành trình kéo–thả tự do; bố cục và loại khu vực vẫn do thiết kế Website quy định.

Ví dụ chuyển đổi:

`Banner ảnh Hero cũ → Trang nội dung → Trang chủ → Hero`

`Banner thành tựu/giải thưởng cũ → Trang chủ hoặc Giới thiệu → Thành tựu & Giải thưởng`

`Banner logo đối tác cũ → dữ liệu Đối tác + Media → khu vực Đối tác của Trang chủ/Giới thiệu`

`Icon trong Slideshow chỉ phục vụ Hero cũ → lưu Media nếu cần đối soát; không đưa vào Website mới nếu thiết kế mới không sử dụng`

> **Nguyên tắc kiểm kê trước chuyển đổi:** Tên bảng và cấu trúc schema chỉ cho biết khả năng lưu trữ, không đủ để xác nhận ý nghĩa của từng bản ghi. Danh sách chuyển đổi cuối cùng cần đối chiếu dữ liệu thật, danh mục, đường dẫn tệp và vị trí mà Website cũ đang gọi. Mỗi bản ghi phải được đánh dấu **chuyển sang đâu**, **chỉ lưu đối soát** hoặc **không còn sử dụng**, thay vì sao chép toàn bộ Banner/Slideshow sang hệ thống mới.

Như vậy, các module nội dung và danh mục cốt lõi chủ yếu được kế thừa; CMS mới tập trung thay đổi cách các module phối hợp, tái sử dụng dữ liệu và kiểm soát toàn bộ quá trình vận hành. Riêng các module trình bày cũ như Block, Banner và Slideshow được tháo tách theo ý nghĩa dữ liệu, không được giữ nguyên chỉ vì chúng tồn tại trong database cũ.

## 2. Mỗi bộ phận sử dụng CMS như thế nào?

### Lãnh đạo và cán bộ quản lý

**Dashboard** tập hợp các chỉ số về sản phẩm, tin tức, trang nội dung, người dùng và yêu cầu khách hàng; đồng thời hiển thị nội dung chờ xử lý và hoạt động gần đây. Từ một chỉ số hoặc danh sách, người quản lý có thể mở đúng hồ sơ cần xem. **Yêu cầu khách hàng** cho biết nguồn phát sinh, mức ưu tiên, trạng thái và người phụ trách; **Nhật ký hoạt động** được dùng khi người quản lý có quyền cần kiểm tra một thay đổi cụ thể.

**Xem Dashboard → mở nội dung hoặc yêu cầu cần chú ý → kiểm tra trạng thái và người phụ trách → theo dõi kết quả**

![Màn hình Dashboard CMS](https://lh3.googleusercontent.com/d/1jP62uZuE6-VpQOSMylA6aMaIfGMXC9qi=w1600)

> **Hình 1.** Các chỉ số và danh sách cần chú ý giúp người quản lý xác định nhanh công việc ưu tiên.

### Truyền thông và nội dung

Bộ phận truyền thông quản lý **Tin tức, Trang nội dung, Sự kiện** và **Dự án**; sử dụng **Thư viện media** để chọn tài nguyên và **Menu** để sắp xếp đường dẫn trên Website. Tại các khu vực cần thu hút khách hàng, người phụ trách cập nhật CTA/Biểu mẫu **Hệ thống** hoặc tạo CTA/Biểu mẫu **Bổ sung** để chèn vào vùng nội dung được hỗ trợ. Người biên tập lưu bản nháp và xem trước; việc công bố do tài khoản có quyền thực hiện.

**Chuẩn bị nội dung → chọn media, CTA hoặc biểu mẫu cần dùng → lưu nháp → xem trước → người có quyền công bố**

![Màn hình quản lý Trang nội dung](https://lh3.googleusercontent.com/d/10vpyNYbrzq1VP8fPT4NTrirpJMoVobwX=w1600)

> **Hình 2.** Mỗi trang được quản lý theo khu vực nội dung, bản nháp và phiên bản đã công bố.

### Sản phẩm

Bộ phận sản phẩm duy trì hồ sơ **Sản phẩm, Dịch vụ** và các dữ liệu dùng để phân loại gồm danh mục, hãng sản xuất, lĩnh vực ứng dụng và loại sản phẩm. Mỗi sản phẩm có thể được bổ sung ảnh, video, tài liệu và gắn hồ sơ **Người phụ trách kinh doanh** theo sản phẩm hoặc khu vực.

**Cập nhật hồ sơ → chọn dữ liệu phân loại → thêm tài nguyên → gắn đầu mối kinh doanh → xem trước → công bố theo quyền**

![Màn hình quản lý Sản phẩm](https://lh3.googleusercontent.com/d/11YjXnU4DG3gdYZ0rV4xqml8i2dLhfup3=w1600)

> **Hình 3.** Sản phẩm được quản lý cùng dữ liệu phân loại, tài liệu và đầu mối phụ trách.

### Kinh doanh và tiếp nhận yêu cầu

**Yêu cầu khách hàng** tập hợp dữ liệu liên hệ, đăng ký sản phẩm, đơn hàng cũ và các lượt gửi từ Biểu mẫu mới. Cán bộ tiếp nhận xem được biểu mẫu, CTA, trang hoặc nội dung đã phát sinh yêu cầu; sau đó đặt mức ưu tiên, giao người xử lý, ghi chú và cập nhật trạng thái. **Mẫu email** được chọn trong luồng thông báo hoặc xác nhận để nội dung gửi khách hàng và nội bộ thống nhất theo từng tình huống.

**Tiếp nhận yêu cầu → kiểm tra nguồn và nội dung khách gửi → đặt ưu tiên → phân công → ghi chú, cập nhật trạng thái → hoàn thành**

![Màn hình quản lý Yêu cầu khách hàng](https://lh3.googleusercontent.com/d/1SctN7u8-IcuQhDAtg8sFA1-sCQwdhoci=w1600)

> **Hình 4.** Yêu cầu khách hàng được tập trung để theo dõi trạng thái, mức ưu tiên và người phụ trách.

### Quản trị hệ thống

Quản trị viên tạo và thay đổi trạng thái **Người dùng**, gán vai trò và kiểm tra quyền theo vai trò. Phạm vi nội dung chỉ cấu hình trong phần nâng cao khi có nghiệp vụ theo chi nhánh hoặc nội dung phụ trách. Quản trị viên duy trì **Cấu hình hệ thống**; việc biên soạn **Ngôn ngữ giao diện** có thể giao cho tài khoản nội dung hoặc biên dịch theo quyền. Khi xử lý sự cố, quản trị viên dùng **Nhật ký hoạt động** để xác định thao tác và **Thùng rác** để kiểm tra ảnh hưởng trước khi phục hồi hoặc xóa vĩnh viễn.

**Tạo tài khoản → gán vai trò và phạm vi → kiểm tra quyền có hiệu lực → duy trì cấu hình → tra cứu hoặc phục hồi khi cần**

![Màn hình quản lý Vai trò và quyền](https://lh3.googleusercontent.com/d/1dEAgQT8nNcxsLjQlKbuTisMnw-h0XcCd=w1600)

> **Hình 5.** Ma trận quyền xác định rõ mỗi vai trò được xem và thực hiện công việc nào.

## 3. Danh mục chức năng CMS — Tra cứu

Phần này dùng để tra cứu mục đích, khả năng chính và cách sử dụng của 27 chức năng CMS.

| Nhóm | Chức năng | Mục đích chính | Người sử dụng chính |
| --- | --- | --- | --- |
| Dashboard | Dashboard | Theo dõi chỉ số và công việc cần chú ý | Lãnh đạo, quản lý, cán bộ vận hành |
| Quản lý nội dung | Tin tức | Quản lý bài viết và quá trình công bố | Truyền thông, nội dung |
| Quản lý nội dung | Danh mục tin tức | Tổ chức tin tức theo cấu trúc | Truyền thông, nội dung |
| Quản lý nội dung | Trang nội dung | Cập nhật các khu vực và trang thông tin của Website | Truyền thông, nội dung |
| Quản lý nội dung | Sự kiện | Quản lý chương trình, thời gian và thông tin đăng ký | Truyền thông, nội dung |
| Quản lý nội dung | Dự án | Quản lý hồ sơ dự án và nội dung thể hiện năng lực | Truyền thông, kinh doanh |
| Sản phẩm/Dịch vụ | Sản phẩm | Quản lý thông tin, tài liệu, phân loại và đầu mối | Sản phẩm, kinh doanh |
| Sản phẩm/Dịch vụ | Danh mục sản phẩm | Tổ chức sản phẩm theo cấu trúc nhiều cấp | Sản phẩm, kinh doanh |
| Sản phẩm/Dịch vụ | Hãng sản xuất | Quản lý thông tin hãng và đối tác sản phẩm | Sản phẩm, kinh doanh |
| Sản phẩm/Dịch vụ | Lĩnh vực ứng dụng | Phân nhóm sản phẩm theo nhu cầu và ngành nghề | Sản phẩm, kinh doanh |
| Sản phẩm/Dịch vụ | Loại sản phẩm | Chuẩn hóa loại sản phẩm phục vụ phân loại | Sản phẩm, kinh doanh |
| Sản phẩm/Dịch vụ | Người phụ trách kinh doanh | Quản lý đầu mối theo sản phẩm và phạm vi | Kinh doanh, quản lý |
| Sản phẩm/Dịch vụ | Dịch vụ | Quản lý nội dung dịch vụ và sản phẩm liên quan | Sản phẩm, kinh doanh, nội dung |
| Trình bày Website | Menu | Quản lý cấu trúc điều hướng Website | Nội dung, quản trị hệ thống |
| Media | Thư viện media | Tập trung ảnh, video và tài liệu dùng chung | Nội dung và các bộ phận vận hành |
| Tương tác khách hàng | CTA | Quản lý các điểm kêu gọi khách hàng hành động | Nội dung, kinh doanh |
| Tương tác khách hàng | Biểu mẫu | Thu thập thông tin khách hàng có cấu trúc | Nội dung, kinh doanh, chăm sóc khách hàng |
| Tương tác khách hàng | Yêu cầu khách hàng | Tiếp nhận, ưu tiên, phân công và theo dõi xử lý | Kinh doanh, chăm sóc khách hàng, quản lý |
| Tương tác khách hàng | Mẫu email | Chuẩn hóa email phản hồi và thông báo | Nội dung, chăm sóc khách hàng |
| Người dùng & phân quyền | Người dùng | Quản lý tài khoản, trạng thái và phạm vi truy cập | Quản trị hệ thống |
| Người dùng & phân quyền | Vai trò & quyền | Xác định quyền và trách nhiệm theo vai trò | Quản trị hệ thống, quản lý |
| Cấu hình hệ thống | Cấu hình hệ thống | Quản lý các thiết lập dùng chung | Quản trị hệ thống |
| Cấu hình hệ thống | Ngôn ngữ giao diện | Quản lý câu chữ tiếng Việt và tiếng Anh | Nội dung, quản trị hệ thống |
| Cấu hình hệ thống | Nhật ký hoạt động | Tra cứu người thực hiện và nội dung thay đổi | Quản lý, quản trị hệ thống |
| Cấu hình hệ thống | Thùng rác | Phục hồi hoặc loại bỏ dữ liệu đã xóa | Quản trị hệ thống |
| SEO | SEO & URL | Quản lý template SEO, canonical, redirect và sitemap | Nội dung, quản trị Website |
| Tiện ích CMS | Tìm kiếm toàn cục | Tìm dữ liệu trên toàn CMS và đi tới nơi xử lý | Tất cả người dùng CMS |

> **Quy ước hình ảnh:** Ảnh chụp được lấy từ CMS hiện tại và lưu trên Google Drive dùng chung. Dữ liệu trong ảnh mang tính minh họa và có thể thay đổi khi hệ thống vận hành chính thức.

---

### 3.1. Dashboard

**Dùng để làm gì?** Cung cấp bức tranh nhanh về nội dung, yêu cầu khách hàng, hoạt động gần đây và các công việc cần chú ý.

**Có thể làm gì?**

- Theo dõi các chỉ số tổng hợp và danh sách đang chờ xử lý.
- Xem liên hệ, đăng ký và hoạt động gần đây.
- Lọc theo khoảng thời gian; thay đổi thứ tự hoặc ẩn/hiện khu vực theo dõi.
- Đi thẳng từ một chỉ số hoặc danh sách tới nơi xử lý tương ứng.

**Cách sử dụng:**  
`Chọn khoảng thời gian → xem chỉ số và danh sách cần chú ý → mở công việc ưu tiên → xử lý tại chức năng tương ứng`

---

### 3.2. Quản lý nội dung

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

> **Hình 6.** Bài viết được tập trung theo trạng thái để theo dõi và công bố có kiểm soát.

#### Danh mục tin tức

**Dùng để làm gì?** Tổ chức tin tức thành các nhóm cha–con để người đọc dễ tìm và người biên tập phân loại thống nhất.

**Có thể làm gì?**  
Tạo · Sửa · Sắp xếp cấp cha–con · Đặt thứ tự và trạng thái · Chọn hiển thị trên trang chủ · Thiết lập thông tin tìm kiếm · Xem số bài đang sử dụng · Xóa khi không còn ràng buộc.

**Cách sử dụng:**  
`Tạo danh mục → chọn cấp và vị trí → cập nhật trạng thái, thông tin tìm kiếm → lưu → dùng khi phân loại tin`

![Màn hình quản lý Danh mục tin tức](https://lh3.googleusercontent.com/d/1Bhyl8fI0yTL2IgMdF6lpE0qYO0OfLkw8=w1600)

> **Hình 7.** Cấu trúc cha–con cho biết vị trí và phạm vi sử dụng của từng danh mục.

#### Trang nội dung

**Dùng để làm gì?** Quản lý các trang có bố cục riêng như Trang chủ, Giới thiệu, Cơ cấu tổ chức, Năng lực & Kinh nghiệm và Liên hệ. Khác với trình soạn bài thông thường, người dùng sửa nội dung theo từng khu vực; hệ thống giữ cố định bố cục tổng thể để hạn chế làm sai thiết kế Website.

Chức năng này thay thế cách CMS cũ quản lý các khu vực Website bằng từng Block theo module và vị trí. Thay vì cấu hình các Block riêng lẻ, người dùng mở một trang và cập nhật các khu vực thuộc bố cục của trang đó.

CMS cũng cho phép tạo trang thông tin đơn giản theo mẫu dùng chung, tương tự Chính sách bảo mật hoặc Điều khoản sử dụng.

**Có thể làm gì?**

- Chọn từng khu vực trên danh sách hoặc vùng xem trước để sửa đúng loại dữ liệu: tiêu đề, mô tả, ảnh, video, số liệu, CTA, biểu mẫu hoặc nội dung lấy từ chức năng khác.
- Quản lý riêng các khu vực của Trang chủ và nhóm trang Giới thiệu mà không phải sửa mã nguồn hay bố cục.
- Tạo trang thông tin mới theo mẫu chuẩn; hệ thống tự tạo đường dẫn, người dùng nhập phần đầu trang và nội dung.
- Lưu bản nháp mà chưa ảnh hưởng Website hiện tại.
- Xem trước toàn trang trên máy tính, máy tính bảng và điện thoại trước khi công bố.
- Phân biệt phiên bản nháp, phiên bản đã công bố và nội dung còn thay đổi chưa xuất bản.

**Ví dụ thực tế:** Muốn đổi banner Trang chủ, người biên tập mở **Trang chủ → khu vực mở đầu (Hero)**, thay tiêu đề, mô tả, ảnh nền hoặc CTA, lưu nháp, xem trước rồi mới công bố.

**Cách sử dụng:**  
`Chọn trang → chọn khu vực → cập nhật nội dung → lưu bản nháp → xem trước toàn trang → công bố`

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

> **Hình 8.** Thời gian, trạng thái công bố và thông tin đăng ký được theo dõi tại cùng một nơi.

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

> **Hình 9.** Hồ sơ dự án kết nối nội dung chi tiết, ảnh đại diện và các giải pháp liên quan.

---

### 3.3. Sản phẩm/Dịch vụ

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

#### Danh mục sản phẩm

**Dùng để làm gì?** Tổ chức sản phẩm theo cấu trúc nhiều cấp để quản lý và tra cứu thống nhất.

**Có thể làm gì?**  
Tạo · Sửa · Chọn cấp cha–con · Sắp xếp · Bật/tắt hiển thị · Xem số lượng và phạm vi sản phẩm đang sử dụng trước khi thay đổi.

**Cách sử dụng:**  
`Tạo danh mục → chọn cấp và thứ tự → cập nhật trạng thái → lưu → dùng khi phân loại sản phẩm`

![Màn hình quản lý Danh mục sản phẩm](https://lh3.googleusercontent.com/d/1xG-LpiMJ3Watc0Cyb2tnKb3j3eBdCA27=w1600)

> **Hình 10.** Danh mục nhiều cấp tạo cấu trúc thống nhất cho danh sách sản phẩm.

#### Hãng sản xuất

**Dùng để làm gì?** Quản lý thông tin hãng sản xuất, nhà phát triển hoặc đối tác gắn với sản phẩm.

**Có thể làm gì?**  
Tạo · Sửa tên, logo, quốc gia và Website · Sắp xếp · Quản lý trạng thái hiển thị · Xem sản phẩm đang sử dụng · Tìm kiếm hoặc ngừng sử dụng một hay nhiều hãng.

**Cách sử dụng:**  
`Tạo hãng → cập nhật thông tin nhận diện → bật trạng thái → lưu → gắn với sản phẩm`

![Màn hình quản lý Hãng sản xuất](https://lh3.googleusercontent.com/d/1apaBZAWCBL0bSnHBF4hQA2G2q5-VbiuB=w1600)

> **Hình 11.** Thông tin nhận diện của hãng được dùng chung cho các sản phẩm liên quan.

#### Lĩnh vực ứng dụng

**Dùng để làm gì?** Phân nhóm sản phẩm theo ngành nghề hoặc bài toán ứng dụng thực tế.

**Có thể làm gì?**  
Tạo · Sửa tên, biểu tượng và màu nhận diện · Quản lý trạng thái · Gắn sản phẩm · Xem phạm vi đang sử dụng · Hỗ trợ lọc và trình bày sản phẩm.

**Cách sử dụng:**  
`Tạo lĩnh vực → cập nhật thông tin hiển thị → lưu → gắn các sản phẩm phù hợp`

![Màn hình quản lý Lĩnh vực ứng dụng](https://lh3.googleusercontent.com/d/1H7e-j88SeDaQzGwpswj7NwZPduyJGRNd=w1600)

> **Hình 12.** Lĩnh vực giúp khách hàng thu hẹp sản phẩm theo nhu cầu thực tế.

#### Loại sản phẩm

**Dùng để làm gì?** Chuẩn hóa các loại sản phẩm theo đặc điểm cung cấp hoặc hình thức sử dụng để phục vụ phân loại, lọc và thống kê.

**Có thể làm gì?**  
Tạo · Sửa tên và biểu tượng · Quản lý trạng thái · Sắp xếp · Gắn cho sản phẩm · Tra cứu sản phẩm đang sử dụng.

**Cách sử dụng:**  
`Tạo loại → cập nhật thông tin → lưu → sử dụng khi phân loại sản phẩm`

![Màn hình quản lý Loại sản phẩm](https://lh3.googleusercontent.com/d/1htITc9yC0DXqfTu9A4hBeNg3BpdOXlEv=w1600)

> **Hình 13.** Loại sản phẩm là dữ liệu chuẩn dùng cho phân loại, bộ lọc và thống kê.

#### Người phụ trách kinh doanh

**Dùng để làm gì?** Quản lý đầu mối tư vấn, kinh doanh hoặc hỗ trợ kỹ thuật theo sản phẩm và khu vực.

Đây là hồ sơ đầu mối kinh doanh gắn với sản phẩm và phạm vi phụ trách, không phải tài khoản dùng để đăng nhập CMS.

**Có thể làm gì?**  
Quản lý thông tin liên hệ · Xác định vai trò · Gắn sản phẩm và khu vực phụ trách · Bật/tắt hiển thị · Tìm kiếm, sắp xếp · Xem phạm vi đang phụ trách.

**Cách sử dụng:**  
`Tạo đầu mối → nhập thông tin liên hệ và vai trò → chọn sản phẩm, khu vực → lưu`

![Màn hình quản lý Người phụ trách kinh doanh](https://lh3.googleusercontent.com/d/1ZjXfLijl-at6TRGVzeGN87L4-rWVsBns=w1600)

> **Hình 14.** Mỗi đầu mối được gắn với vai trò và phạm vi sản phẩm cụ thể.

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

> **Hình 15.** Dịch vụ được quản lý cùng trạng thái công bố và sản phẩm hỗ trợ liên quan.

---

### 3.4. Trình bày Website

#### Menu

**Dùng để làm gì?** Quản lý cấu trúc điều hướng để người xem đi tới đúng khu vực và nội dung trên Website.

**Có thể làm gì?**  
Chọn nhóm menu theo vị trí · Tạo nhiều cấp · Sửa tên, liên kết, cách mở và biểu tượng · Sắp xếp · Đổi cấp cha–con · Bật/tắt hiển thị · Xem trước.

**Cách sử dụng:**  
`Chọn nhóm menu → thêm hoặc sửa mục → sắp xếp cấp và thứ tự → xem trước → lưu`

![Màn hình quản lý Menu](https://lh3.googleusercontent.com/d/1RCRQfB78BoGsSJOZmxV-WCxvc20E4Lum=w1600)

> **Hình 16.** Cây menu cho biết rõ cấp điều hướng, thứ tự và trạng thái hiển thị.

---

### 3.5. Media

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

> **Hình 17.** Tài nguyên được tổ chức tập trung và có thể kiểm tra nơi đang sử dụng.

---

### 3.6. Tương tác khách hàng

Nhóm này gồm bốn chức năng có vai trò riêng nhưng phối hợp trong cùng quá trình thu hút và tiếp nhận nhu cầu khách hàng:

- **CTA** tạo điểm bắt đầu hành động, chẳng hạn Đăng ký tư vấn, Yêu cầu báo giá, Tải tài liệu, Liên hệ hoặc Xem thêm.
- **Biểu mẫu** thu thập thông tin khi hành động yêu cầu khách hàng cung cấp dữ liệu.
- **Yêu cầu khách hàng** là hồ sơ công việc được tạo từ dữ liệu khách gửi để bộ phận phụ trách tiếp nhận, phân công và theo dõi xử lý.
- **Mẫu email** chuẩn hóa nội dung xác nhận cho khách hàng và thông báo cho bộ phận tiếp nhận.

Một luồng phổ biến là:

**Khách chọn CTA → CTA mở Biểu mẫu → khách gửi thông tin → CMS tạo Yêu cầu khách hàng → gửi email nếu được cấu hình → bộ phận phụ trách tiếp nhận và xử lý**

CTA không bắt buộc phải mở Biểu mẫu. CTA cũng có thể dẫn tới một trang, Website bên ngoài, tài liệu, địa chỉ email hoặc kênh liên hệ được Website hỗ trợ. Chỉ khi khách hàng thực sự gửi thông tin qua Website thì CMS mới phát sinh dữ liệu cần tiếp nhận và theo dõi trong **Yêu cầu khách hàng**.

#### Hai nhóm CTA và Biểu mẫu

CTA và Biểu mẫu được phân thành hai nhóm để người quản trị hiểu rõ phạm vi sử dụng:

| Nhóm | Nguồn hình thành | Cách sử dụng | Giới hạn |
| --- | --- | --- | --- |
| **Hệ thống** | Được cấu hình cho các vị trí và nghiệp vụ chính của Website | Cập nhật nội dung, hành động, trường thông tin và cấu hình tiếp nhận trong phạm vi được phép | Không xóa, không đổi mã định danh và không tự chuyển sang vị trí khác làm thay đổi bố cục cố định |
| **Bổ sung** | Do người quản trị tạo khi phát sinh chiến dịch hoặc nhu cầu nội dung mới | Chèn vào vùng soạn thảo được hỗ trợ hoặc liên kết CTA với Biểu mẫu | Không tự tạo thêm khu vực mới và không thay đổi cấu trúc, thành phần hay bố cục cố định của Website |

Ví dụ về nhóm **Hệ thống** gồm nút **Đăng ký tư vấn** tại trang sản phẩm, Biểu mẫu **Gửi yêu cầu** tại trang Liên hệ hoặc CTA **Yêu cầu báo giá** tại khu vực giới thiệu dịch vụ. Người quản trị không phải tạo lại các thành phần này từ đầu.

Ví dụ về nhóm **Bổ sung** là CTA **Nhận tư vấn về sản phẩm** được tạo cho một bài Tin tức hoặc Biểu mẫu đăng ký riêng cho một chiến dịch. Các thành phần này chỉ được chèn vào Tin tức, Sự kiện, Sản phẩm, Dịch vụ, Trang nội dung hoặc vùng soạn thảo khác khi vùng đó được CMS cho phép.

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

> **Hình 18.** CTA có thể được tái sử dụng tại nhiều vị trí và dẫn tới đúng hành động.

#### Biểu mẫu

**Dùng để làm gì?** Thu thập thông tin khách hàng theo cấu trúc phù hợp với từng nhu cầu như tư vấn, báo giá hoặc đăng ký sự kiện.

**Có thể làm gì?**

- Với Biểu mẫu **Hệ thống**, điều chỉnh các trường được phép cấu hình mà không phải tạo lại biểu mẫu của trang.
- Với Biểu mẫu **Bổ sung**, tạo biểu mẫu mới rồi chèn vào vùng nội dung được hỗ trợ hoặc liên kết với CTA.
- Thêm và sắp xếp trường; quy định trường bắt buộc, kiểu dữ liệu và quy tắc nhập liệu.
- Cấu hình việc lưu lượt gửi thành Yêu cầu khách hàng, gửi thông báo nội bộ và gửi email xác nhận cho khách.
- Xem trước biểu mẫu và theo dõi lượt gửi.
- Tìm kiếm, lọc, nhân bản; quản lý trạng thái hoạt động, bản nháp, lưu trữ hoặc thùng rác.
- Ghi nhận nguồn phát sinh gồm Biểu mẫu, CTA, trang hoặc nội dung, vị trí sử dụng và đường dẫn để bộ phận tiếp nhận hiểu khách hàng đang quan tâm đến nội dung nào.

**Ví dụ thực tế:** CTA **Yêu cầu báo giá** tại trang sản phẩm mở Biểu mẫu báo giá. Khách hàng nhập họ tên, số điện thoại, email và nội dung cần tư vấn rồi gửi. CMS lưu lượt gửi, tạo một Yêu cầu khách hàng, đồng thời ghi nhận CTA, sản phẩm và đường dẫn phát sinh. Nếu email đã được cấu hình, khách hàng nhận xác nhận và bộ phận phụ trách nhận thông báo.

**Cách sử dụng:**  

- `Biểu mẫu Hệ thống: chọn Biểu mẫu → cập nhật trường và cấu hình tiếp nhận → xem trước → công bố`
- `Biểu mẫu Bổ sung: tạo Biểu mẫu → thêm và sắp xếp trường → thiết lập tiếp nhận, thông báo → xem trước → công bố → chèn vào nội dung hoặc liên kết với CTA`

![Màn hình quản lý Biểu mẫu](https://lh3.googleusercontent.com/d/1A_ZvREUePRr9f7ZLKw-7Ve4FClXmJqCb=w1600)

> **Hình 19.** Các trường và quy tắc được cấu hình theo mục tiêu thu thập thông tin.

#### Yêu cầu khách hàng

**Dùng để làm gì?** Tiếp nhận tập trung nhu cầu khách hàng từ Website và quản lý toàn bộ quá trình xử lý đến khi hoàn thành. Chức năng này khác Biểu mẫu: Biểu mẫu thu thập dữ liệu, còn Yêu cầu khách hàng là hồ sơ công việc để phân công và theo dõi.

**Có thể làm gì?**

- Xem thông tin khách gửi và nguồn phát sinh gồm Biểu mẫu, CTA, trang hoặc nội dung, vị trí và đường dẫn liên quan.
- Lọc theo trạng thái, mức ưu tiên, nguồn tiếp nhận và người phụ trách.
- Đặt hoặc thay đổi mức ưu tiên; phân công hoặc đổi người xử lý.
- Ghi chú, gắn thẻ, cập nhật trạng thái và theo dõi lịch sử diễn biến.
- Xử lý nhiều yêu cầu cùng lúc, chuyển yêu cầu không còn sử dụng vào thùng rác.
- Xuất danh sách phục vụ báo cáo và phối hợp công việc.

**Ví dụ thực tế:** Một khách gửi biểu mẫu từ trang sản phẩm. CMS ghi nhận sản phẩm và đường dẫn phát sinh; trưởng nhóm đặt ưu tiên “Cao”, giao cho nhân viên kinh doanh. Nhân viên cập nhật **Mới → Đang xử lý → Hoàn thành** và toàn bộ diễn biến được giữ trong lịch sử.

**Cách sử dụng:**  
`Tiếp nhận → xác định nguồn → đặt ưu tiên → phân công → xử lý và ghi chú → cập nhật trạng thái → hoàn thành`

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

> **Hình 20.** Mẫu email được quản lý theo tình huống và đối tượng nhận.

---

### 3.7. Người dùng & phân quyền

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

> **Hình 21.** Danh sách tài khoản cho biết trạng thái, vai trò và phạm vi của từng người.

#### Vai trò & quyền

**Dùng để làm gì?** Quy định một nhóm người dùng được thực hiện thao tác nào trong CMS. Mô hình vận hành chính là **Người dùng → Vai trò → Quyền**; phạm vi chỉ là thiết lập nâng cao khi nghiệp vụ thực tế yêu cầu.

**Có thể làm gì?**

- Tạo vai trò theo trách nhiệm công việc.
- Chọn quyền xem, tạo, sửa, công bố hoặc xóa theo từng phân hệ.
- Gán hoặc thu hồi vai trò của người dùng.
- Bật hoặc tắt vai trò; khi tắt, quyền tạm ngừng hiệu lực nhưng các lượt gán được giữ để có thể bật lại.
- Giới hạn theo nội dung phụ trách hoặc chi nhánh trong phần nâng cao khi thật sự cần.
- Danh mục quyền được định nghĩa trong code/backend, không cho quản trị viên tự tạo Task hoặc quyền trường dữ liệu trên giao diện.
- Mọi thay đổi quyền được ghi vào Nhật ký hoạt động thay cho quy trình versioning riêng của vai trò.

**Ví dụ thực tế:** “Biên tập viên Tin tức” được xem, tạo và sửa bài nhưng không được công bố. “Trưởng phòng Truyền thông” có thêm quyền công bố và xuất dữ liệu. Nhờ đó, hai người cùng làm việc trong chức năng Tin tức nhưng chịu trách nhiệm ở các bước khác nhau.

**Cách sử dụng:**  
`Tạo hoặc chọn vai trò → chọn quyền theo phân hệ → lưu → gán cho người dùng`

---

### 3.8. Cấu hình hệ thống

#### Cấu hình hệ thống

**Dùng để làm gì?** Quản lý các thiết lập dùng chung ảnh hưởng đến CMS và Website, chẳng hạn thông tin liên hệ doanh nghiệp.

**Có thể làm gì?**

- Xem và chỉnh sửa cấu hình theo nhóm nghiệp vụ.
- Phân biệt thiết lập dùng chung và thiết lập theo ngôn ngữ.
- Với cấu hình thông thường như hotline, email, địa chỉ, liên kết mạng xã hội hoặc logo: sửa và lưu trực tiếp; hệ thống ghi Nhật ký hoạt động.
- Với secret, tích hợp hoặc thiết lập có cảnh báo ảnh hưởng lớn: lưu bản nháp, so sánh giá trị cũ–mới và công bố sau khi kiểm tra.
- Theo dõi phiên bản riêng của các đợt công bố cấu hình ảnh hưởng lớn; thay đổi thông thường không tạo thêm một phiên bản cấu hình.

**Cách sử dụng:**  
- `Cấu hình thường: chọn nhóm → cập nhật → lưu`
- `Cấu hình ảnh hưởng lớn: cập nhật → lưu nháp → so sánh ảnh hưởng → công bố`

![Màn hình Cấu hình hệ thống](https://lh3.googleusercontent.com/d/1LuposJ1B5UxPKeT1-lKNtgPCAdP5e-e4=w1600)

> **Hình 22.** Thiết lập thông thường được lưu trực tiếp; workflow kiểm tra và công bố chỉ xuất hiện với cấu hình ảnh hưởng lớn.

#### Ngôn ngữ giao diện

**Dùng để làm gì?** Quản lý các câu chữ tiếng Việt và tiếng Anh hiển thị trên Website và CMS.

**Có thể làm gì?**  
Tìm kiếm và sửa câu chữ · Lọc theo Website/CMS, nhóm sử dụng và ngôn ngữ · Phát hiện nội dung thiếu hoặc chưa đồng nhất · Kiểm tra độ dài và thông tin bắt buộc phải giữ nguyên khi dịch.

**Cách sử dụng:**  
`Chọn khu vực và ngôn ngữ → tìm câu chữ → cập nhật bản dịch → kiểm tra ràng buộc → lưu`

![Màn hình quản lý Ngôn ngữ giao diện](https://lh3.googleusercontent.com/d/1y5UPwazZ5kDUm-f44GYw22YTpcA6Um2s=w1600)

> **Hình 23.** Câu chữ hai ngôn ngữ được kiểm soát theo khu vực sử dụng.

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

> **Hình 24.** Dữ liệu đã xóa được giữ lại để kiểm tra trước khi phục hồi hoặc xóa vĩnh viễn.

---

### 3.9. SEO

#### SEO & URL

**Dùng để làm gì?** Quản lý SEO theo ba tầng rõ ràng: mặc định toàn website trong **Cấu hình hệ thống**, template của trang hệ thống tại **SEO & URL**, và giá trị ghi đè của từng bài viết/sản phẩm tại form nội dung tương ứng.

**Có thể làm gì?**

- Theo dõi nhanh trang noindex, trang thiếu mô tả và route chưa có nơi quản lý.
- Cập nhật tiêu đề, mô tả, canonical và quyền lập chỉ mục theo từng chức năng.
- Nhập nội dung cố định hoặc chèn biến để hệ thống tự điền thông tin phù hợp cho từng trang.
- Quản lý riêng trang chính, trang lọc, trang danh mục và trang chi tiết khi được hỗ trợ.
- Chuyển tới nơi quản lý nội dung chi tiết để hoàn thiện thông tin tìm kiếm liên quan.
- Thêm, sửa, bật/tắt hoặc xóa redirect 301/302 khi URL thay đổi; hệ thống cảnh báo URL trùng và vòng lặp cơ bản.
- Theo dõi số URL đủ điều kiện cùng thời điểm cập nhật và mở sitemap để kiểm tra.
- Meta Keywords chỉ còn trong phần tương thích legacy, không phải trường SEO chính.

**Cách sử dụng:**  
`Kiểm tra tổng quan → chọn template hoặc URL cần xử lý → cập nhật SEO/canonical hoặc redirect → lưu → kiểm tra sitemap`

![Màn hình SEO & URL](https://lh3.googleusercontent.com/d/1TzzvXTPToe5ZCogveir4C7YamIkAkAu0=w1600)

> **Hình 25.** Workspace SEO & URL tách tổng quan chất lượng, template trang hệ thống và quản lý redirect/sitemap.

---

### 3.10. Tiện ích CMS

#### Tìm kiếm toàn cục

**Dùng để làm gì?** Tìm nhanh nội dung và chức năng trên toàn CMS từ một điểm duy nhất.

**Có thể làm gì?**  
Tìm theo từ khóa · Lọc theo chức năng, sản phẩm, tin tức, yêu cầu khách hàng, sự kiện, dự án, trang nội dung, dịch vụ, biểu mẫu, CTA hoặc media · Chỉ hiển thị dữ liệu và chức năng người dùng có quyền truy cập · Xem tóm tắt · Sao chép thông tin · Đi thẳng tới nơi xử lý.

**Cách sử dụng:**  
`Nhập từ khóa → lọc nhóm kết quả nếu cần → xem tóm tắt → mở đúng nội dung hoặc chức năng`

![Màn hình Tìm kiếm toàn cục](https://lh3.googleusercontent.com/d/1bZCyH6-Opcz2r0eNeWzP5UpLzCBPcncS=w1600)

> **Hình 26.** Một từ khóa trả về kết quả từ nhiều nhóm dữ liệu và dẫn tới đúng nơi xử lý.
