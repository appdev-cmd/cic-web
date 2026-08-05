# CMS LOCALE RUNTIME CONTRACT

## Hai context độc lập

| Context | Ý nghĩa | Phạm vi |
|---|---|---|
| `CmsUiLanguage` | Ngôn ngữ label, validation, toast và trợ giúp của CMS | Preference người dùng; không cấp quyền và không chọn business record |
| `CmsLocale` | Workspace dữ liệu nghiệp vụ đang thao tác | Route, query/data source, permission, notification context và Quick Create |

Trong baseline hiện tại, UI language vẫn cố định ở tiếng Việt vì resource translation chưa được triển khai. Nút VI/EN trên Header là **workspace locale switch**, không phải UI translation switch.

## Invariant bắt buộc

1. Chuyển workspace locale không được đổi UI language ngoài ý muốn.
2. Business data EN thiếu phải trả về empty/not-applicable; không fallback VI.
3. Count, chart, recent, notification và action phải giữ locale của đối tượng.
4. Quick Create phải tạo tại workspace locale hiện hành và hiển thị locale đích.
5. All-locales view chỉ xuất hiện khi có quyền cross-locale và breakdown rõ.
6. UI string có thể có fallback resource được kiểm soát; business record không được fallback chéo locale.
7. Request của locale cũ hoàn tất sau khi switch không được ghi vào workspace mới.

## Contract hiện tại

- `CmsDataSource.availableLocales`: locale workspace mà shell có thể chọn.
- `CmsDataSource.dashboardByLocale`: dữ liệu Dashboard theo locale, sử dụng `Partial<Record<...>>` để biểu diễn locale chưa có dữ liệu.
- Demo adapter hiện chỉ có Dashboard VI. EN cố ý không có data để kiểm tra no-fallback behavior.
- `EditorialContentDataSource` tách dữ liệu News, Static Pages, Services và Events theo `CmsLocale`; từng module chỉ nhận dataset của workspace đang mở.
- Demo adapter nội dung hiện chỉ khai báo VI. Khi chuyển sang EN, bốn module hiển thị danh sách rỗng và không dùng nội dung, lookup hoặc owner của VI.
- Event Form nhận related events/articles/products từ cùng dataset locale; không import chéo fixture News.
- Adapter demo nội dung được tải cùng lazy boundary của module, không nằm trong entry bundle của CMS.
- `CatalogDataSource` tách Products và Product Settings theo workspace locale, bao gồm sản phẩm, taxonomy, owner, routing, impact và audit liên quan.
- Demo catalog chỉ có VI. Workspace EN không sử dụng sản phẩm hoặc master data VI; các component con nhận dữ liệu từ manager thay vì tự import fixture.
- `PresentationDataSource` tách Menu, Banners và Content Blocks theo workspace locale, bao gồm placement, page tree, conflict, version và audit liên quan.
- Demo presentation chỉ có VI; editor/drawer nhận dữ liệu qua props và xử lý an toàn khi workspace EN chưa có placement hoặc page tree.
- `MediaDataSource` cung cấp một thư viện asset dùng chung cho mọi workspace nhằm tránh nhân đôi file vật lý. `CmsLocale` chỉ xác định metadata bản địa hóa đang thao tác.
- Asset, variant, license và folder là dữ liệu dùng chung; alt text, caption và usage reference phải giữ locale rõ ràng khi nối production adapter.
- `ContactsDataSource` cung cấp một hàng đợi vận hành dùng chung. Mỗi `ContactRequest` bắt buộc có `source_locale` bất biến ghi nhận locale của form/page gửi yêu cầu.
- Đổi workspace không lọc mất, fallback hoặc nhân đôi contact; giao diện hiển thị locale nguồn trên từng dòng và vẫn giữ toàn bộ workflow/assignment chung.
- All-locales mode đã bị ẩn cho tới khi permission và breakdown được triển khai thật.

## Bước tiếp theo

Tiếp tục với nhóm governance: Users, Permission, Configuration và Audit/Trash. UI Localization chỉ quản lý resource string, không làm nguồn cho business record.
