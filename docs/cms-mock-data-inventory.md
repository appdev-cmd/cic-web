# CMS MOCK DATA INVENTORY

> Trạng thái ban đầu ngày 2026-08-04. Danh sách được kiểm soát bằng `npm run check:cms-production`.

## Baseline

- 18 file fixture `mockData.ts/mockCmsData.ts`.
- Baseline ban đầu có 36 runtime import tham chiếu trực tiếp tới fixture.
- Sau khi tách thêm Events vào editorial boundary, gate giảm từ 37 còn 36 dependency path tới demo/mock. Events Manager/Form không còn import fixture trực tiếp hoặc import chéo News fixture.
- Production gate phải fail cho tới khi runtime không còn import mock.
- TypeScript/build pass không đồng nghĩa production data readiness pass.

## Phân nhóm thay thế

| Nhóm | Fixture hiện tại | Hướng cô lập |
|---|---|---|
| App shell | `data/mockCmsData.ts` | Tách current user, navigation, notification và Dashboard data thành các data provider riêng |
| Nội dung | News, Static Pages, Events, Services | Adapter theo locale workspace; VI/EN là dataset độc lập |
| Catalog | Products, Product Settings | Product/taxonomy theo locale; staff/routing của Product Settings dùng chung |
| Presentation | Menu, Banners | Adapter theo site + locale; Draft/Live độc lập từng locale |
| Media | Media mock | Record album/ảnh theo locale; lớp file storage có thể dùng chung |
| Customer operations | Contacts | Hàng đợi VI/EN độc lập; staff và current user dùng chung |
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
- `src/cms/data/EditorialContentDataSource.ts`: contract theo locale cho News, Static Pages, Services và Events.
- `src/cms/data/demoEditorialContentDataSource.ts`: gom fixture nội dung vào demo adapter; chỉ có VI để kiểm chứng không fallback sang VI khi workspace là EN.
- News, Static Pages, Services và Events không còn import fixture trực tiếp trong manager/form; demo adapter chỉ được tải trong lazy boundary của từng module.
- `src/cms/data/CatalogDataSource.ts`: Products/taxonomy theo locale; staff/routing/impact/audit là global.
- `src/cms/data/demoCatalogDataSource.ts`: demo taxonomy VI và governance sản phẩm dùng chung.
- `src/cms/data/PresentationDataSource.ts`: Menu/Banners theo locale; Content Blocks ở trạng thái unscoped.
- `src/cms/data/demoPresentationDataSource.ts`: demo presentation theo contract trên; manager và drawer con không import fixture trực tiếp.
- `src/cms/data/MediaDataSource.ts`: contract record album/ảnh độc lập theo workspace locale.
- `src/cms/data/demoMediaDataSource.ts`: adapter demo theo locale; Media manager không còn import fixture trực tiếp.
- `src/cms/data/ContactsDataSource.ts`: contract hàng đợi độc lập theo workspace; staff/current user là global.
- `src/cms/data/demoContactsDataSource.ts`: adapter demo cho contacts/staff/current user; manager và reassign modal không còn import fixture.
- Bước tiếp theo: tạo governance boundary cho Users, Permission, Configuration và Audit/Trash.
- Runtime contract đã được bổ sung tại `docs/cms-locale-runtime-contract.md`: Dashboard EN thiếu dữ liệu hiển thị empty state và không fallback KPI/list/chart VI.
