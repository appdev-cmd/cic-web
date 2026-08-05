# CMS MOCK DATA INVENTORY

> Trạng thái ban đầu ngày 2026-08-04. Danh sách được kiểm soát bằng `npm run check:cms-production`.

## Baseline

- 18 file fixture `mockData.ts/mockCmsData.ts`.
- Baseline ban đầu có 36 runtime import tham chiếu trực tiếp tới fixture.
- Sau khi tách App Shell/Dashboard, News/Static Pages/Services và Products/Product Settings qua data-source boundary, gate ghi nhận 36 dependency path tới demo/mock. Con số bao gồm static lẫn dynamic import; production gate tiếp tục chặn cho tới khi có production adapter.
- Production gate phải fail cho tới khi runtime không còn import mock.
- TypeScript/build pass không đồng nghĩa production data readiness pass.

## Phân nhóm thay thế

| Nhóm | Fixture hiện tại | Hướng cô lập |
|---|---|---|
| App shell | `data/mockCmsData.ts` | Tách current user, navigation, notification và Dashboard data thành các data provider riêng |
| Nội dung | News, Static Pages, Events, Services, Content Blocks | Adapter theo locale workspace; VI/EN là dataset độc lập |
| Catalog | Products, Product Settings | Adapter theo locale và taxonomy policy; không mặc định dùng chung record |
| Presentation | Menu, Banners | Adapter theo site + locale; Draft/Live độc lập từng locale |
| Media | Media mock | Chờ quyết định asset global hay locale-aware; picker phải giữ locale context |
| Customer operations | Contacts | Một operational record, giữ source locale; không nhân bản contact theo VI/EN |
| UI localization | Localization | Chỉ Source–Target cho UI strings; không làm nguồn cho business records |
| Governance | Users, Permission, Configuration, Audit/Trash | Identity global; permission/config/audit có locale scope theo policy |
| Email templates | Email Templates | Giữ ở trạng thái VERIFY; chưa đưa vào navigation production |

## Quy tắc chuyển đổi từng module

1. Định nghĩa interface data source ở biên module, không import fixture trong component.
2. Di chuyển fixture sang demo/test adapter.
3. Production adapter không được fallback sang demo adapter.
4. UI phải có loading, empty, error và permission state trước khi bỏ fixture.
5. Chạy `npm run check:cms-production` sau từng module để theo dõi số import còn lại.
6. Chỉ bật production route khi adapter thật và smoke test theo locale đã pass.

## Thứ tự đề xuất

1. App shell + Dashboard.
2. News + Static Pages + Services.
3. Products + Product Settings.
4. Menu + Banners + Content Blocks.
5. Media.
6. Contacts.
7. Users + Permission + Configuration + Audit/Trash.
8. UI Localization sau khi glossary và locale workspace contract ổn định.

## Boundary đã tạo

- `src/cms/data/CmsDataSource.ts`: contract cho current user, navigation, notification và Dashboard data.
- `src/cms/data/demoCmsDataSource.ts`: adapter demo duy nhất của App Shell/Dashboard; vẫn bị production gate nhận diện.
- `src/cms/data/EditorialContentDataSource.ts`: contract theo locale cho News, Static Pages và Services.
- `src/cms/data/demoEditorialContentDataSource.ts`: gom fixture nội dung vào demo adapter; chỉ có VI để kiểm chứng không fallback sang VI khi workspace là EN.
- News, Static Pages và Services không còn import fixture trực tiếp trong manager/form; demo adapter chỉ được tải trong lazy boundary của từng module.
- `src/cms/data/CatalogDataSource.ts`: contract theo locale cho Products và Product Settings.
- `src/cms/data/demoCatalogDataSource.ts`: gom fixture catalog/master data vào adapter VI; Products, Product Settings và Usage Impact không còn import fixture trực tiếp.
- Bước tiếp theo: tạo boundary theo locale cho Menu, Banners và Content Blocks.
- Runtime contract đã được bổ sung tại `docs/cms-locale-runtime-contract.md`: Dashboard EN thiếu dữ liệu hiển thị empty state và không fallback KPI/list/chart VI.
