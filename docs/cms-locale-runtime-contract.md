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
- `CatalogDataSource` tách Products và taxonomy sản phẩm theo workspace locale. Staff, routing, impact và audit của Product Settings nằm trong `productSettingsGlobal` và không đổi theo workspace.
- Khi đổi workspace trong Product Settings, chỉ category/brand/application/product type được nạp lại; state staff/routing không remount.
- `PresentationDataSource` tách Menu và Banners theo workspace locale. Content Blocks dùng `contentBlocksUnscoped` cho tới khi xác định được bảng lưu thật.
- Content Blocks không phản ứng với workspace switch và không hiển thị locale trong tiêu đề.
- `MediaDataSource.mediaByLocale` cung cấp record album/ảnh độc lập theo workspace, khớp các cặp `cic_image*` và `cic_image_images*`. File storage có thể tái sử dụng nhưng không thay thế dataset nghiệp vụ.
- `ContactsDataSource.contactsByLocale` cung cấp hai hàng đợi độc lập, khớp `cic_contact` và `cic_contact_en`. Staff/current user là dữ liệu global dùng chung cho việc phân công.
- `source_locale` có thể được giữ cho audit/import nhưng không được dùng để mô phỏng hai bảng bằng một hàng đợi global.
- `GovernanceDataSource` cung cấp Users, Permission, Audit và Trash dưới dạng global; các module này không nhận `CmsLocale` và không remount khi đổi workspace.
- `ConfigurationDataSource.websiteConfigByLocale` chứa cấu hình website VI/EN; `globalConfig` chứa scope EnjiCAD dùng chung. System Configuration trộn hai nguồn nhưng chỉ thay phần website khi đổi workspace.
- All-locales mode đã bị ẩn cho tới khi permission và breakdown được triển khai thật.

## Bước tiếp theo

Tiếp tục với nhóm governance: Users, Permission, Configuration và Audit/Trash. UI Localization chỉ quản lý resource string, không làm nguồn cho business record.
