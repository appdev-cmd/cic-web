# Yêu cầu dữ liệu của website frontend

## Nguyên tắc contract

- Component giữ nguyên thiết kế; adapter chuyển dữ liệu backend sang view model hiện tại.
- Public API chỉ trả Published. Draft chỉ đi qua preview CMS có xác thực.
- Field thiếu không được bù bằng dữ liệu giả production. Section/widget tùy chọn phải ẩn an toàn.
- Rich text do backend sanitize; frontend chỉ render nội dung đã được phép.

## Trang và dữ liệu đang consume

| Trang/khối | Field website đang dùng | Nguồn phù hợp | Xử lý |
|---|---|---|---|
| Trang chủ | hero slides, giới thiệu, sản phẩm/tin/dịch vụ/dự án/đối tác/CTA | Page Builder config + entity relations + config/media | Section cố định; entity chọn thủ công, giữ order |
| Danh sách/chi tiết Tin tức | category, title, date, summary, image, author, views, tags, content, attachments, related | `cic_news*`, categories, user, file/media, related IDs | Rename mock; bỏ các subtype chuyên biệt chưa có nguồn hoặc thể hiện trong rich text |
| Danh sách/chi tiết Sản phẩm | name, price, summary, brand/type/application/category, image/gallery, rich content, video, document | cụm `cic_products*` | Join relation; metadata file derive; không tạo duplicate fields |
| Danh sách/chi tiết Dịch vụ | title, summary/tagline, image, rich content, related products | `cic_services*`, relation sản phẩm | Một rich text cho phần nội dung dài; ẩn category filter nếu không có nguồn |
| Danh sách/chi tiết Sự kiện | title, summary/content, image, time, place, topic, registration link, related | `cic_event*` | Tính sắp/đã từ time; không tuyên bố “đang diễn ra” khi chưa có end time thật |
| Static page | title/SEO và Page sections hoặc rich content | Page Builder mới; legacy contents để migrate | Template code quyết định layout; DB chỉ lưu config/content/references |
| Contact | thông tin công ty, địa chỉ, hotline/email, form | config/address + Form + request adapter | Không hard-code lâu dài; field form theo definition |
| Header/Footer/Menu/Breadcrumb | menu tree, active route, label, link | menu groups/items + route/content | Breadcrumb compose; không cần column breadcrumb |
| SEO route cấp cao | title, description, keywords, canonical, robots | config modules | Detail SEO lấy entity; route list SEO lấy function SEO |
| CTA/Form | CTA config, form definition, submit result | module mới | Không nhúng JSX/JS; source/entity context gửi cùng submission |
| Media | URL, alt, dimensions/variant, file metadata | adapter Media | URL legacy tiếp tục resolve; alt ưu tiên entity/media metadata |

## Các field mock cần đổi tên tại adapter

| View model hiện tại | Contract/backend |
|---|---|
| `shortDesc`, `description`, `desc` | `summary` |
| `longDesc`, `htmlContent`, `contentMarkdown`, `overviewHtml` | `content` rich text theo module |
| `slug` hoặc string `id` dùng làm URL | `alias`; `id` vẫn là ID dữ liệu |
| `img` | `image`/media view model |
| `brand`, `field`, `app`, `productType` | relation manufactories/category/application/type |
| `seoDesc`, `seoKeywords` | `seo_description`, `seo_keyword` qua DTO |
| `date` | timestamp backend được format theo locale |
| `isOpenRegistration` | derive từ `link_dangky` và quy tắc thời gian đã chốt |

## Dữ liệu có thể derive/compose, không tạo column

- Tên tác giả từ `author_id` và `cic_users`; giữ snapshot legacy để fallback.
- Category/brand/type/application name từ relation.
- File size/type/dimensions từ Media hoặc storage metadata.
- Số bài trong danh mục từ query aggregate.
- Breadcrumb từ menu/route + entity title.
- “Mới”, “sắp diễn ra”, số ngày còn lại từ timestamp tại thời điểm đọc.
- Trạng thái CTA đăng ký từ URL hợp lệ và thời gian; không lưu hai nguồn mâu thuẫn.
- Label, icon, helper text, score UI, accordion/tab state thuộc code/UI.

## Rich text

Các phần mô tả dài của Tin tức, Dịch vụ, Sự kiện, Sản phẩm và trang chính sách nên đi qua rich text hiện có. Heading, ảnh trong bài, bảng, list, link và embed được lưu trong content đã sanitize. Chỉ tách relation như sản phẩm/tin/sự kiện liên quan khi cần truy vấn độc lập.

## Contract fallback để giữ giao diện

- Ảnh thiếu: dùng placeholder do code quy định, không lưu placeholder vào DB.
- Widget liên quan không có item Published hợp lệ: bỏ widget, không trả entity draft/deleted.
- Mock block không có backend: ẩn block hoặc render từ rich text; không tạo dữ liệu giả.
- Link legacy còn hợp lệ: giữ nguyên trong lần migrate đầu và chuyển dần qua Media adapter.

