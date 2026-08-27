-- ============================================================
-- Schema PostgreSQL da VA (PATCHED) - cic14005_cic_fs
-- Dua tren ban goc + ket qua kiem tra du lieu that (Phase 0)
-- ============================================================
-- CHANGELOG so voi ban goc (FINAL - da gop toan bo cac dot ra soat):
--
-- [Dot 1 - Phase 0: doi chieu du lieu that voi schema thiet ke]
--  1. [FIX] Xoa cot "sub_name" trong bang products - khong co
--     nguon du lieu trong fs_products goc (map sai/hu cau).
--  2. [FIX] Xoa cot "other_languages" trung lap trong bang
--     products - cung nguon fs_products.other_languages1 nhu
--     cot "other_languages1" da co san ben canh.
--  3. [FIX] products_translations.title: chi lay tu fs_products
--     (vi). fs_products_en KHONG co cot title trong schema cu.
--  4. [BO SUNG] config_modules_translations: them 2 cot bi thieu
--     o ban thiet ke truoc - value_seo_keyword, value_seo_description.
--  5. [BO SUNG] Them CONSTRAINT UNIQUE(entity_id, locale) THAT
--     (khong chi la comment) cho toan bo 31 bang *_translations.
--  6. [BO SUNG] Them ham + trigger auto-update THAT cho 39 cot
--     edited_time/updated_time - ban goc chi ghi chu de xuat.
--
-- [Dot 2 - Sua loi generator sinh SQL Postgres (buildNewSQL)]
--  7. [FIX] Loi lap toan bo cot trong MOI bang: out.push(lines) bi
--     goi 2 lan (truoc va sau doan them CONSTRAINT UNIQUE cho bang
--     *_translations) -> khien SQL cu khong the chay duoc. Da xoa
--     lan push thua.
--  8. [FIX] Loi thieu dau phay truoc CONSTRAINT UNIQUE(entity_id,
--     locale) o ca 31 bang *_translations - logic cu chi check
--     check endsWith dau phay tren dong co comment cuoi dong nen luon sai.
--  9. [FIX] 30 dong CREATE INDEX tro sai cot (mang indexDefinitions
--     go tay bi nham ten bang/cot). Da BO HOAN TOAN mang go tay,
--     thay bang co che tu suy ra index (FK-candidate + cot alias)
--     TRUC TIEP tu du lieu cot/comment luc build bang - dam bao
--     ten bang/cot luon khop 100% voi CREATE TABLE, khong the lech
--     tay nua ve sau.
--
-- [Dot 3 - Bao cao audit doi chieu voi code PHP + du lieu MySQL that]
-- 10. [BO SUNG] Don sentinel parent_id=0->NULL + them FK tu tham
--     chieu (self-reference, ON DELETE SET NULL) cho 6 bang cay
--     phan cap: areas, menus_admin, menus_items, contents_categories,
--     news_categories, products_categories.
-- 11. [BO SUNG] them FK tu tham chieu products_categories.root_id
--     (goc cua cay danh muc, tach rieng voi parent_id).
-- 12. [BO SUNG] Tach quan he N-N products.category_id (CSV, da xac
--     nhan 274/274 dong la CSV that) sang bang trung gian moi
--     products_categories_rel - dung bang do cho moi truy van/rang
--     buoc moi, giu nguyen cot cu (varchar) de tuong thich nguoc.
-- 13. [FIX] Ep kieu + gan FK CHUAN cho products.types_id (varchar->
--     integer, REFERENCES products_types(id)) va extends_items.group_id
--     (REFERENCES extends_groups(id)) - du lieu da kiem tra khong rac.
-- 14. [FIX] Doi ten wards.districts_id -> district_code va
--     order.discount_id -> discount_code KHONG duoc ap dung vi trung
--     voi cot discount_code da co san trong order - GIU NGUYEN ten
--     goc discount_id, chi ghi chu ro day khong phai khoa ngoai that.
-- 15. [BO SUNG] Khoi phuc ~19-28 cot LEGACY/RESERVED theo nguyen tac
--     "Preserve First" thay vi xoa thang - danh dau ro muc do du
--     thong tin va uu tien xac nhan (xem tung cot ⚠️ THIEU BANG THAM
--     CHIEU / LEGACY trong CREATE TABLE ben duoi).
-- 16. [BO SUNG] Danh dau CAN XAC NHAN NGHIEP VU cho services.category_id
--     va products_incentives.product_incenty_id (du lieu qua it/bat
--     thuong de tu quyet dinh).
--
-- [Dot 4 - Ra soat NOT hoan chinh toan bo cot *_id con lai (lan nay)]
-- 17. [BO SUNG] Ra soat toan bo 51 cot con lai dang o dang placeholder
--     "can khai bao REFERENCES tuong minh" (chua duoc xu ly trong Dot 3):
--       - 37 cot: gan FK CHUAN (REFERENCES ro rang, bang dich xac dinh
--         khong mo ho, rui ro nghiep vu thap) - xem tung dong "✅ FK
--         CHUAN" trong CREATE TABLE ben duoi.
--       - 2 cot (menus_createlink.parent_id, news_keyword.new_id): bang
--         dich CO TON TAI nhung lech kieu du lieu (varchar vs integer)
--         -> danh dau "🔧 CAN EP KIEU truoc khi gan FK", CHUA tu y ep.
--       - 2 cot (tables.foreign_id, products_tables.foreign_id): FK
--         DONG (bang dich xac dinh runtime qua cot foreign_tablename) -
--         Postgres khong ho tro FK dong -> giu nguyen khong FK.
--       - 4 cot session_id (products_images, order, image, image_images):
--         xac dinh day la session id TAM THOI, KHONG phai khoa ngoai
--         that -> ghi chu ro, khong gan FK.
--       - 2 cot (image.category_id, image_images.category_id): xac nhan
--         KHONG co bang danh muc "image_categories" trong ca MySQL goc
--         lan schema moi -> "⚠️ THIEU BANG THAM CHIEU" that su.
--       - 4 cot (banners.order_id, banners.user_id, products_filters_
--         values.record_id, products_filters_values.category_id): co
--         NHIEU HON 1 bang dich kha di, khong tu doan vi thuoc vung
--         rui ro cao (Don hang/Banner thuong mai) -> "⚠ CAN XAC NHAN
--         NGHIEP VU", giu nguyen khong FK cho den khi co xac nhan.
-- 18. [RENAME] Doi ten 2 bang tieng Viet sang tieng Anh de dong bo quy
--     uoc dat ten toan schema: khuvuc -> regions, khuvuc_translations
--     -> regions_translations (bang goc MySQL van la fs_khuvuc, xem cot
--     oldref). LUU Y: business.khuvuc / business.khuvuc_name la TEN COT
--     (khong phai ten bang) nen KHONG doi trong dot nay - can ra soat
--     rieng neu muon dong bo triet de ten cot tieng Viet con lai.
--
-- [Dot 5 - Ra soat doi chieu toan bo 103 bang: 54 cot _id chua co FK +
--          77 REFERENCES da co, doi chieu voi danh sach bang that]
-- 19. [FIX - LOI THAT] regions_translations.entity_id con sot
--     REFERENCES khuvuc(id) (ten bang cu, TRUOC khi doi ten sang
--     "regions" o Dot 4 muc 18) -> FK tro toi bang KHONG TON TAI.
--     Da sua thanh REFERENCES regions(id) ON DELETE CASCADE. Day la
--     loi that duy nhat tim thay sau khi doi chieu toan bo 77 FK
--     hien co voi danh sach 103 ten bang that trong schema.
-- 20. [BO SUNG] Hoan thien ghi chu cities.country_id (truoc do van
--     con sot text placeholder cu du da co dau "⚠️ THIEU BANG THAM
--     CHIEU") - dong bo voi quyet dinh da ap dung cho areas.country_id:
--     khong co bang countries, khong FK, can xac nhan nghiep vu.
-- 21. [RENAME] Hoan tat phan da hoan o Dot 4 muc 18: doi ten cot
--     business.khuvuc -> region, business.khuvuc_name -> region_name
--     (tieng Viet -> tieng Anh). Van la chuoi tu do (varchar), CHUA
--     xac nhan co phai tham chieu toi regions(id) hay khong nen chua
--     gan FK.
-- 22. [FIX] Dong bo lai 10 thuoc tinh data-search (dung cho tim kiem
--     tren trang) bi lech so voi ghi chu hien thi thuc te - loi hien
--     thi/tim kiem, khong anh huong SQL export.
-- 23. [XAC NHAN] Ra soat toan bo 54 cot _id chua co REFERENCES: khong
--     con cot nao bi bo sot hoan toan khong co ghi chu - toan bo da
--     duoc phan loai LEGACY/FK dong/session tam/can xac nhan nghiep vu.
--
-- [Dot 6 - Them tien to "cic_" cho toan bo ten bang]
-- 24. [RENAME] Them tien to "cic_" vao truoc TAT CA ten bang trong
--     schema Postgres (VD: address -> cic_address, products ->
--     cic_products). Ap dung dong bo cho: CREATE/DROP TABLE, moi
--     REFERENCES trong CONSTRAINT (FK), CREATE INDEX, va CREATE/DROP
--     TRIGGER. Ten cot giu nguyen, khong doi.
-- 25. [FIX - LOI THAT] indexDefinitions/triggerDefinitions con sot ten
--     bang cu "khuvuc"/"khuvuc_translations" (truoc khi doi ten sang
--     "regions"/"regions_translations" o Dot 4) -> INDEX/TRIGGER tro
--     toi bang khong ton tai. Da sua thanh "regions"/"regions_translations".
--
-- CHUA XU LY trong file nay (thuoc pham vi ETL script, khong phai DDL):
--  - Charset 22 bang latin1 (xac nhan la bug that qua Phase 0,
--    du lieu la UTF-8 bi khai sai latin1) -> xu ly bang cach
--    convert khi export tu MySQL, khong sua trong DDL Postgres.
--  - Chien luoc giu ID cu khi INSERT (OVERRIDING SYSTEM VALUE)
--    deu khong phai remap 92 cot FK -> xu ly trong script ETL.
--  - 9 cot audit (actflg, ctdusr, ctdwks, ctddtm, mdfusr, mdfwks,
--    lstmdf, cdtpgm, mdfpgm) - da xac nhan qua Phase 0 la an toan
--    bo (actflg la hang so "A", con lai gan nhu rong) -> ban thiet
--    ke goc da khong dua cac cot nay vao, giu nguyen.
--  - 12 cot con dang "⚠ CAN XAC NHAN NGHIEP VU" / "🔧 CAN EP KIEU"
--    (xem Dot 4, muc 17) - CAN LICH HOP VOI DEV/NGHIEP VU BAN DAU,
--    khong tu quyet dinh them de tranh sai lech du lieu Don hang/
--    San pham.
-- ============================================================

-- ============================================================
-- Schema MỚI đề xuất (PostgreSQL) — cic14005_cic_fs
-- Xuất tự động từ tài liệu tham chiếu — 2026-08-27
-- ============================================================

-- Danh sách địa chỉ / chi nhánh / văn phòng của công ty (tên, điện thoại, địa chỉ, tọa độ bản đồ).
DROP TABLE IF EXISTS "cic_address" CASCADE;
CREATE TABLE "cic_address" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_address.id / fs_address_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "phone" varchar(255), -- ← fs_address.phone | Số điện thoại.
  "icon" varchar(255), -- ← fs_address.icon | Đường dẫn/tên biểu tượng (icon).
  "image" varchar(255), -- ← fs_address.image | Đường dẫn ảnh chính.
  "created_time" timestamptz, -- ← fs_address.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "edited_time" timestamptz, -- ← fs_address.edited_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "published" boolean, -- ← fs_address.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer, -- ← fs_address.ordering | Thứ tự sắp xếp hiển thị.
  "latitude" numeric(9,6), -- ← fs_address.latitude | Đổi từ varchar sang numeric(9,6) để tính toán/toạ độ chính xác, hỗ trợ query khoảng cách (PostGIS) sau này.
  "longitude" numeric(9,6), -- ← fs_address.longitude | Đổi từ varchar sang numeric(9,6) để tính toán/toạ độ chính xác, hỗ trợ query khoảng cách (PostGIS) sau này.
  "fax" varchar(255), -- ← fs_address.fax | Số fax.
  "website" varchar(255), -- ← fs_address.website | Địa chỉ website.
  "email" varchar(255), -- ← fs_address.email | Địa chỉ email.
  "show_contact" boolean, -- ← fs_address.show_contact | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "show_home" boolean, -- ← fs_address.show_home | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "map" text, -- ← fs_address.map | Mã nhúng bản đồ (Google Maps iframe).
  "name" varchar(255), -- ← fs_address.name + fs_address_en.name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "alias" varchar(255), -- ← fs_address.alias + fs_address_en.alias | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "address" varchar(255), -- ← fs_address.address + fs_address_en.address | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "more_info" text -- ← fs_address.more_info + fs_address_en.more_info | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
);

-- Danh sách địa chỉ / chi nhánh / văn phòng của công ty (tên, điện thoại, địa chỉ, tọa độ bản đồ).
DROP TABLE IF EXISTS "cic_address_en" CASCADE;
CREATE TABLE "cic_address_en" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_address.id / fs_address_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "phone" varchar(255), -- ← fs_address.phone · fs_address_en.phone | Số điện thoại.
  "icon" varchar(255), -- ← fs_address.icon · fs_address_en.icon | Đường dẫn/tên biểu tượng (icon).
  "image" varchar(255), -- ← fs_address.image · fs_address_en.image | Đường dẫn ảnh chính.
  "created_time" timestamptz, -- ← fs_address.created_time · fs_address_en.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "edited_time" timestamptz, -- ← fs_address.edited_time · fs_address_en.edited_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "published" boolean, -- ← fs_address.published · fs_address_en.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer, -- ← fs_address.ordering · fs_address_en.ordering | Thứ tự sắp xếp hiển thị.
  "latitude" numeric(9,6), -- ← fs_address.latitude · fs_address_en.latitude | Đổi từ varchar sang numeric(9,6) để tính toán/toạ độ chính xác, hỗ trợ query khoảng cách (PostGIS) sau này.
  "longitude" numeric(9,6), -- ← fs_address.longitude · fs_address_en.longitude | Đổi từ varchar sang numeric(9,6) để tính toán/toạ độ chính xác, hỗ trợ query khoảng cách (PostGIS) sau này.
  "fax" varchar(255), -- ← fs_address.fax · fs_address_en.fax | Số fax.
  "website" varchar(255), -- ← fs_address.website · fs_address_en.website | Địa chỉ website.
  "email" varchar(255), -- ← fs_address.email · fs_address_en.email | Địa chỉ email.
  "show_contact" boolean, -- ← fs_address.show_contact · fs_address_en.show_contact | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "show_home" boolean, -- ← fs_address.show_home · fs_address_en.show_home | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "map" text, -- ← fs_address.map · fs_address_en.map | Mã nhúng bản đồ (Google Maps iframe).
  "name" varchar(255), -- ← fs_address.name + fs_address_en.name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "alias" varchar(255), -- ← fs_address.alias + fs_address_en.alias | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "address" varchar(255), -- ← fs_address.address + fs_address_en.address | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "more_info" text -- ← fs_address.more_info + fs_address_en.more_info | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
);

-- Danh sách khu vực địa lý dùng để phân loại/lọc.
DROP TABLE IF EXISTS "cic_areas" CASCADE;
CREATE TABLE "cic_areas" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_areas.id | Khoá chính tự tăng, dùng identity thay AUTO_INCREMENT.
  "name" varchar(255), -- ← fs_areas.name | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "alias" varchar(255), -- ← fs_areas.alias | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "ordering" integer NOT NULL, -- ← fs_areas.ordering | Thứ tự sắp xếp hiển thị.
  "published" boolean NOT NULL, -- ← fs_areas.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "created_time" timestamptz, -- ← fs_areas.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "edited_time" timestamptz, -- ← fs_areas.edited_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "parent_id" integer REFERENCES cic_areas(id) ON DELETE SET NULL, -- ← fs_areas.parent_id | Tự tham chiếu (self-reference) — sentinel 0 đã được dọn thành NULL trước khi migrate; cho phép NULL và khai báo REFERENCES areas(id) ON DELETE SET NULL để tránh mồ côi cây phân cấp (0 = gốc không còn ý nghĩa FK hợp lệ trong Postgres).
  "country_id" integer -- ← fs_areas.country_id | ⚠️ THIẾU BẢNG THAM CHIẾU — LEGACY: Country reference. Không có dữ liệu trong areas. Referenced trong 6 file với handler lấy cities theo country (cms/libraries/controllers.php:501). Không có bảng countries — không FK, không index.
);

-- Danh mục tỉnh/thành phố.
DROP TABLE IF EXISTS "cic_cities" CASCADE;
CREATE TABLE "cic_cities" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_cities.id / fs_cities_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "area_id" integer REFERENCES cic_areas(id), -- ← fs_cities.area_id | ✅ FK CHUẨN: Bảng đích areas tồn tại rõ ràng trong schema này — khai báo REFERENCES areas(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "area_alias" varchar(255), -- ← fs_cities.area_alias | Alias (đường dẫn) của khu vực.
  "country_id" integer, -- ← fs_cities.country_id | ⚠️ THIẾU BẢNG THAM CHIẾU — LEGACY: Country reference. fs_cities.country_id có 0 giá trị (khác areas.country_id — cùng ý nghĩa nhưng ở bảng areas có referenced trong code). Không có bảng countries trong hệ thống — không FK, không index. Cùng nhóm quyết định với areas.country_id: cần xác nhận nghiệp vụ có giữ khái niệm "country" hay bỏ trước khi tạo bảng countries thật.
  "ordering" integer, -- ← fs_cities.ordering | Thứ tự sắp xếp hiển thị.
  "published" boolean NOT NULL, -- ← fs_cities.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "created_time" timestamptz, -- ← fs_cities.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "edited_time" timestamptz, -- ← fs_cities.edited_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "is_hot" boolean NOT NULL, -- ← fs_cities.is_hot | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "name" varchar(255), -- ← fs_cities.name + fs_cities_en.name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "alias" varchar(255), -- ← fs_cities.alias + fs_cities_en.alias | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "area_name" varchar(255) -- ← fs_cities.area_name + fs_cities_en.area_name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
);

-- Danh mục tỉnh/thành phố.
DROP TABLE IF EXISTS "cic_cities_en" CASCADE;
CREATE TABLE "cic_cities_en" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_cities.id / fs_cities_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "area_id" integer REFERENCES cic_areas(id), -- ← fs_cities.area_id · fs_cities_en.area_id | ✅ FK CHUẨN: Bảng đích areas tồn tại rõ ràng trong schema này — khai báo REFERENCES areas(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "area_alias" varchar(255), -- ← fs_cities.area_alias · fs_cities_en.area_alias | Alias (đường dẫn) của khu vực.
  "country_id" integer, -- ← fs_cities.country_id · fs_cities_en.country_id | ⚠️ THIẾU BẢNG THAM CHIẾU — LEGACY: Country reference. fs_cities.country_id có 0 giá trị (khác areas.country_id — cùng ý nghĩa nhưng ở bảng areas có referenced trong code). Không có bảng countries trong hệ thống — không FK, không index. Cùng nhóm quyết định với areas.country_id: cần xác nhận nghiệp vụ có giữ khái niệm "country" hay bỏ trước khi tạo bảng countries thật.
  "ordering" integer, -- ← fs_cities.ordering · fs_cities_en.ordering | Thứ tự sắp xếp hiển thị.
  "published" boolean NOT NULL, -- ← fs_cities.published · fs_cities_en.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "created_time" timestamptz, -- ← fs_cities.created_time · fs_cities_en.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "edited_time" timestamptz, -- ← fs_cities.edited_time · fs_cities_en.edited_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "is_hot" boolean NOT NULL, -- ← fs_cities.is_hot · fs_cities_en.is_hot | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "name" varchar(255), -- ← fs_cities.name + fs_cities_en.name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "alias" varchar(255), -- ← fs_cities.alias + fs_cities_en.alias | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "area_name" varchar(255) -- ← fs_cities.area_name + fs_cities_en.area_name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
);

-- Danh mục khu vực (có thể dùng cho phân vùng kinh doanh/miền Bắc-Trung-Nam). [Đã đổi tên từ "khuvuc" (tiếng Việt) sang "regions" (tiếng Anh) để đồng bộ quy ước đặt tên toàn schema — bảng gốc MySQL vẫn là fs_khuvuc, xem cột oldref của từng dòng bên dưới.]
DROP TABLE IF EXISTS "cic_regions" CASCADE;
CREATE TABLE "cic_regions" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_khuvuc.id / fs_khuvuc_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "code" varchar(255), -- ← fs_khuvuc.code | Mã định danh dạng chuỗi (mã code) của đối tượng.
  "tablenames" varchar(255), -- ← fs_khuvuc.tablenames | Tên các bảng liên kết (có thể nhiều bảng).
  "published" boolean, -- ← fs_khuvuc.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer, -- ← fs_khuvuc.ordering | Thứ tự sắp xếp hiển thị.
  "created_time" timestamptz, -- ← fs_khuvuc.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "image" varchar(255), -- ← fs_khuvuc.image | Đường dẫn ảnh chính.
  "first_toll" varchar(255), -- ← fs_khuvuc.first_toll | Chi phí/mức phí ban đầu.
  "show_in_homepage" boolean, -- ← fs_khuvuc.show_in_homepage | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "prefix_name" varchar(255), -- ← fs_khuvuc.prefix_name | Tiền tố gắn trước tên.
  "old_id" integer, -- ← fs_khuvuc.old_id | Giữ tạm để đối chiếu dữ liệu trong lúc migrate; có thể xoá sau khi xác nhận không còn tham chiếu.
  "updated_time" timestamptz, -- ← fs_khuvuc.updated_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "color_code" varchar(255), -- ← fs_khuvuc.color_code | Mã màu.
  "is_retail" boolean, -- ← fs_khuvuc.is_retail | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_common" boolean, -- ← fs_khuvuc.is_common | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "name" varchar(255), -- ← fs_khuvuc.name + fs_khuvuc_en.name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "alias" varchar(255), -- ← fs_khuvuc.alias + fs_khuvuc_en.alias | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "description" text, -- ← fs_khuvuc.description + fs_khuvuc_en.description | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_title" varchar(255), -- ← fs_khuvuc.seo_title + fs_khuvuc_en.seo_title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_keyword" varchar(255), -- ← fs_khuvuc.seo_keyword + fs_khuvuc_en.seo_keyword | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_description" varchar(255), -- ← fs_khuvuc.seo_description + fs_khuvuc_en.seo_description | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "content" text -- ← fs_khuvuc.content + fs_khuvuc_en.content | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
);

-- Danh mục khu vực (có thể dùng cho phân vùng kinh doanh/miền Bắc-Trung-Nam). [Đã đổi tên từ "khuvuc" (tiếng Anh) sang "regions" (tiếng Anh) để đồng bộ quy ước đặt tên toàn schema — bảng gốc MySQL vẫn là fs_khuvuc, xem cột oldref của từng dòng bên dưới.]
DROP TABLE IF EXISTS "cic_regions_en" CASCADE;
CREATE TABLE "cic_regions_en" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_khuvuc.id / fs_khuvuc_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "code" varchar(255), -- ← fs_khuvuc.code · fs_khuvuc_en.code | Mã định danh dạng chuỗi (mã code) của đối tượng.
  "tablenames" varchar(255), -- ← fs_khuvuc.tablenames · fs_khuvuc_en.tablenames | Tên các bảng liên kết (có thể nhiều bảng).
  "published" boolean, -- ← fs_khuvuc.published · fs_khuvuc_en.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer, -- ← fs_khuvuc.ordering · fs_khuvuc_en.ordering | Thứ tự sắp xếp hiển thị.
  "created_time" timestamptz, -- ← fs_khuvuc.created_time · fs_khuvuc_en.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "image" varchar(255), -- ← fs_khuvuc.image · fs_khuvuc_en.image | Đường dẫn ảnh chính.
  "first_toll" varchar(255), -- ← fs_khuvuc.first_toll · fs_khuvuc_en.first_toll | Chi phí/mức phí ban đầu.
  "show_in_homepage" boolean, -- ← fs_khuvuc.show_in_homepage · fs_khuvuc_en.show_in_homepage | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "prefix_name" varchar(255), -- ← fs_khuvuc.prefix_name · fs_khuvuc_en.prefix_name | Tiền tố gắn trước tên.
  "old_id" integer, -- ← fs_khuvuc.old_id · fs_khuvuc_en.old_id | Giữ tạm để đối chiếu dữ liệu trong lúc migrate; có thể xoá sau khi xác nhận không còn tham chiếu.
  "updated_time" timestamptz, -- ← fs_khuvuc.updated_time · fs_khuvuc_en.updated_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "color_code" varchar(255), -- ← fs_khuvuc.color_code · fs_khuvuc_en.color_code | Mã màu.
  "is_retail" boolean, -- ← fs_khuvuc.is_retail · fs_khuvuc_en.is_retail | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_common" boolean, -- ← fs_khuvuc.is_common · fs_khuvuc_en.is_common | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "name" varchar(255), -- ← fs_khuvuc.name + fs_khuvuc_en.name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "alias" varchar(255), -- ← fs_khuvuc.alias + fs_khuvuc_en.alias | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "description" text, -- ← fs_khuvuc.description + fs_khuvuc_en.description | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_title" varchar(255), -- ← fs_khuvuc.seo_title + fs_khuvuc_en.seo_title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_keyword" varchar(255), -- ← fs_khuvuc.seo_keyword + fs_khuvuc_en.seo_keyword | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_description" varchar(255), -- ← fs_khuvuc.seo_description + fs_khuvuc_en.seo_description | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "content" text -- ← fs_khuvuc.content + fs_khuvuc_en.content | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
);

-- Danh mục phường/xã.
DROP TABLE IF EXISTS "cic_wards" CASCADE;
CREATE TABLE "cic_wards" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_wards.id | Khoá chính tự tăng, dùng identity thay AUTO_INCREMENT.
  "name" varchar(100) NOT NULL, -- ← fs_wards.name | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "type" varchar(30) NOT NULL, -- ← fs_wards.type | Loại/phân loại của bản ghi.
  "location" varchar(30) NOT NULL, -- ← fs_wards.location | Vị trí/địa điểm.
  "district_code" varchar(5), -- ← fs_wards.districts_id | Đổi tên thành district_code — đây là mã hành chính (1-3 chữ số), không phải khoá ngoại thật; không cần FOREIGN KEY.
  "published" boolean NOT NULL, -- ← fs_wards.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer NOT NULL, -- ← fs_wards.ordering | Thứ tự sắp xếp hiển thị.
  "alias" varchar(255), -- ← fs_wards.alias | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "districts_name" varchar(255), -- ← fs_wards.districts_name | Tên quận/huyện.
  "city_id" integer, -- ← fs_wards.city_id | ❌ KHÔNG PHẢI FK: city_id (1–96, 63 giá trị riêng biệt) là mã tỉnh/thành theo danh mục hành chính cố định (63 tỉnh/thành VN) — không cùng hệ ID với bảng cities (ID tự tăng, bắt đầu ~1473). Đã gỡ bỏ REFERENCES cities(id): giữ nguyên là cột số tham khảo, không ràng buộc khoá ngoại.
  "city_name" varchar(255), -- ← fs_wards.city_name | Tên tỉnh/thành phố.
  "created_time" timestamptz, -- ← fs_wards.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "edit_time" timestamptz, -- ← fs_wards.edit_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "districts_alias" varchar(255), -- ← fs_wards.districts_alias | Alias của quận/huyện.
  "city_alias" varchar(255) -- ← fs_wards.city_alias | Alias của tỉnh/thành phố.
);

-- Tài khoản người dùng quản trị hệ thống (đăng nhập, mật khẩu, thông tin cá nhân).
DROP TABLE IF EXISTS "cic_users" CASCADE;
CREATE TABLE "cic_users" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_users.id | Khoá chính tự tăng, dùng identity thay AUTO_INCREMENT.
  "username" varchar(50), -- ← fs_users.username | Tên đăng nhập.
  "password" varchar(255), -- ← fs_users.password | Mật khẩu (đã mã hóa) đăng nhập.
  "fname" varchar(50), -- ← fs_users.fname | Tên (first name).
  "lname" varchar(50), -- ← fs_users.lname | Họ (last name).
  "email" varchar(50), -- ← fs_users.email | Địa chỉ email.
  "phone" varchar(20), -- ← fs_users.phone | Số điện thoại.
  "address" varchar(255), -- ← fs_users.address | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "country" varchar(50), -- ← fs_users.country | Quốc gia.
  "published" boolean, -- ← fs_users.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer, -- ← fs_users.ordering | Thứ tự sắp xếp hiển thị.
  "created_time" timestamptz, -- ← fs_users.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "updated_time" timestamptz, -- ← fs_users.updated_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "last_visit_time" timestamptz, -- ← fs_users.last_visit_time | Thời điểm truy cập gần nhất.
  "nums_visit" integer, -- ← fs_users.nums_visit | Số lượt truy cập.
  "status_online" boolean, -- ← fs_users.status_online | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "agencies" varchar(255), -- ← fs_users.agencies | Đại lý/chi nhánh liên quan.
  "products_categories" varchar(255), -- ← fs_users.products_categories | Tên/mã danh mục sản phẩm liên kết.
  "news_categories" varchar(255), -- ← fs_users.news_categories | Tên/mã danh mục tin tức liên kết.
  "full_name" varchar(255), -- ← fs_users.full_name | Họ và tên đầy đủ.
  "image" varchar(255), -- ← fs_users.image | Đường dẫn ảnh chính.
  "summary" text, -- ← fs_users.summary | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "account_status" varchar(32) NOT NULL DEFAULT 'active', -- ← — (cột mới) | [MỚI] Trạng thái tài khoản: active / suspended / deactivated / pending_invite. `published` không đủ 4 trạng thái. Backfill: published=true→active, còn lại→deactivated; đồng bộ `published` trong giai đoạn compatibility.
  "two_factor_enabled" boolean NOT NULL DEFAULT false, -- ← — (cột mới) | [MỚI] Cờ bật/tắt 2FA cho tab Bảo mật. Chỉ lưu trạng thái; secret 2FA thuộc lớp xác thực riêng.
  "password_changed_at" timestamptz NULL, -- ← — (cột mới) | [MỚI] Thời điểm đổi mật khẩu gần nhất. Không map vào `updated_time` vì field đó đổi khi sửa cả hồ sơ/quyền.
  "failed_login_attempts" integer NOT NULL DEFAULT 0 -- ← — (cột mới) | [MỚI · ĐỀ XUẤT] Số lần đăng nhập lỗi liên tiếp, phục vụ màn hình audit. Chỉ ghi thật khi backend authentication/lockout được triển khai — hiện là mock.
);

-- Gán quyền (nhóm quyền) cho từng người dùng.
DROP TABLE IF EXISTS "cic_users_permission" CASCADE;
CREATE TABLE "cic_users_permission" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_users_permission.id | Khoá chính tự tăng, dùng identity thay AUTO_INCREMENT.
  "user_id" integer REFERENCES cic_users(id), -- ← fs_users_permission.user_id | ✅ FK CHUẨN: Bảng đích users tồn tại rõ ràng trong schema này — khai báo REFERENCES users(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "task_id" integer, -- ← fs_users_permission.task_id | ✅ FK CHUẨN: Bảng đích permission_tasks tồn tại rõ ràng trong schema này — khai báo REFERENCES permission_tasks(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "permission" integer -- ← fs_users_permission.permission | Quyền hạn được gán.
);

-- Phân quyền chi tiết theo từng trường dữ liệu cho người dùng.
DROP TABLE IF EXISTS "cic_users_permission_field" CASCADE;
CREATE TABLE "cic_users_permission_field" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_users_permission_field.id | Khoá chính tự tăng, dùng identity thay AUTO_INCREMENT.
  "user_id" integer REFERENCES cic_users(id), -- ← fs_users_permission_field.user_id | ✅ FK CHUẨN: Bảng đích users tồn tại rõ ràng trong schema này — khai báo REFERENCES users(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "task_id" integer, -- ← fs_users_permission_field.task_id | ✅ FK CHUẨN: Bảng đích permission_tasks tồn tại rõ ràng trong schema này — khai báo REFERENCES permission_tasks(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "permission" integer, -- ← fs_users_permission_field.permission | Quyền hạn được gán.
  "list_field" text, -- ← fs_users_permission_field.list_field | Danh sách các trường liên quan.
  "module" varchar(255), -- ← fs_users_permission_field.module | Tên module chức năng.
  "view" varchar(255) -- ← fs_users_permission_field.view | Lượt xem.
);

-- Phân quyền theo chức năng/thao tác (function) cho người dùng.
DROP TABLE IF EXISTS "cic_users_permission_fun" CASCADE;
CREATE TABLE "cic_users_permission_fun" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_users_permission_fun.id | Khoá chính tự tăng, dùng identity thay AUTO_INCREMENT.
  "user_id" integer REFERENCES cic_users(id), -- ← fs_users_permission_fun.user_id | ✅ FK CHUẨN: Bảng đích users tồn tại rõ ràng trong schema này — khai báo REFERENCES users(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "task_id" integer, -- ← fs_users_permission_fun.task_id | ✅ FK CHUẨN: Bảng đích permission_tasks tồn tại rõ ràng trong schema này — khai báo REFERENCES permission_tasks(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "permission" integer, -- ← fs_users_permission_fun.permission | Quyền hạn được gán.
  "list_field" text, -- ← fs_users_permission_fun.list_field | Danh sách các trường liên quan.
  "module" varchar(255), -- ← fs_users_permission_fun.module | Tên module chức năng.
  "view" varchar(255) -- ← fs_users_permission_fun.view | Lượt xem.
);

-- Danh mục các trường dữ liệu có thể phân quyền.
DROP TABLE IF EXISTS "cic_permission_field" CASCADE;
CREATE TABLE "cic_permission_field" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_permission_field.id | Khoá chính tự tăng, dùng identity thay AUTO_INCREMENT.
  "name" varchar(255), -- ← fs_permission_field.name | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "field" varchar(255), -- ← fs_permission_field.field | Tên trường dữ liệu.
  "published" boolean, -- ← fs_permission_field.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "module" varchar(255), -- ← fs_permission_field.module | Tên module chức năng.
  "view" varchar(255) -- ← fs_permission_field.view | Lượt xem.
);

-- Danh mục các chức năng/thao tác có thể phân quyền.
DROP TABLE IF EXISTS "cic_permission_fun" CASCADE;
CREATE TABLE "cic_permission_fun" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_permission_fun.id | Khoá chính tự tăng, dùng identity thay AUTO_INCREMENT.
  "name" varchar(255), -- ← fs_permission_fun.name | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "field" varchar(255), -- ← fs_permission_fun.field | Tên trường dữ liệu.
  "published" boolean -- ← fs_permission_fun.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
);

-- Danh mục các tác vụ (task) trong hệ thống dùng để gán quyền.
DROP TABLE IF EXISTS "cic_permission_tasks" CASCADE;
CREATE TABLE "cic_permission_tasks" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_permission_tasks.id | Khoá chính tự tăng, dùng identity thay AUTO_INCREMENT.
  "module" varchar(255), -- ← fs_permission_tasks.module | Tên module chức năng.
  "view" varchar(255), -- ← fs_permission_tasks.view | Lượt xem.
  "_task" varchar(255) NOT NULL, -- ← fs_permission_tasks._task | Tên tác vụ (task) nội bộ.
  "trigger" varchar(255), -- ← fs_permission_tasks.trigger | Điều kiện/hành động kích hoạt (trigger).
  "description" varchar(255), -- ← fs_permission_tasks.description | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "ordering" integer, -- ← fs_permission_tasks.ordering | Thứ tự sắp xếp hiển thị.
  "published" boolean NOT NULL, -- ← fs_permission_tasks.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "list_field" text, -- ← fs_permission_tasks.list_field | Danh sách các trường liên quan.
  "list_function" text, -- ← fs_permission_tasks.list_function | Danh sách chức năng liên quan.
  "is_contents" boolean -- ← fs_permission_tasks.is_contents | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
);

-- Tài khoản thành viên/khách hàng (phân biệt với `fs_users` là tài khoản quản trị).
DROP TABLE IF EXISTS "cic_members" CASCADE;
CREATE TABLE "cic_members" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_members.id | Khoá chính tự tăng, dùng identity thay AUTO_INCREMENT.
  "username" varchar(255) NOT NULL, -- ← fs_members.username | Tên đăng nhập.
  "password" varchar(200) NOT NULL, -- ← fs_members.password | Mật khẩu (đã mã hóa) đăng nhập.
  "full_name" varchar(50), -- ← fs_members.full_name | Họ và tên đầy đủ.
  "birthday" timestamptz, -- ← fs_members.birthday | Ngày sinh.
  "sex" varchar(10), -- ← fs_members.sex | Giới tính.
  "address" varchar(4000), -- ← fs_members.address | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "city_id" integer REFERENCES cic_cities(id), -- ← fs_members.city_id | ✅ FK CHUẨN: Bảng đích cities tồn tại rõ ràng trong schema này — khai báo REFERENCES cities(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "published_time" timestamptz, -- ← fs_members.published_time | Thời điểm xuất bản.
  "published" boolean NOT NULL, -- ← fs_members.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "block" boolean NOT NULL, -- ← fs_members.block | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "telephone" varchar(30), -- ← fs_members.telephone | Số điện thoại.
  "mobilephone" varchar(30), -- ← fs_members.mobilephone | Số điện thoại di động.
  "level" integer NOT NULL, -- ← fs_members.level | Cấp độ/mức độ phân cấp.
  "email" varchar(255) NOT NULL, -- ← fs_members.email | Địa chỉ email.
  "edited_time" timestamptz, -- ← fs_members.edited_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "created_time" timestamptz, -- ← fs_members.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "ordering" integer NOT NULL, -- ← fs_members.ordering | Thứ tự sắp xếp hiển thị.
  "job" varchar(255), -- ← fs_members.job | Nghề nghiệp/chức danh.
  "activated_code" varchar(255), -- ← fs_members.activated_code | Mã kích hoạt tài khoản/email.
  "is_newsletter" boolean NOT NULL, -- ← fs_members.is_newsletter | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "published_info" boolean NOT NULL, -- ← fs_members.published_info | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "point" integer NOT NULL, -- ← fs_members.point | Điểm tích lũy.
  "money" double precision, -- ← fs_members.money | Số tiền.
  "avatar" varchar(255), -- ← fs_members.avatar | Ảnh đại diện.
  "message" varchar(300), -- ← fs_members.message | Nội dung tin nhắn/thông điệp.
  "title" varchar(255), -- ← fs_members.title | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "district_id" integer, -- ← fs_members.district_id | ⚠️ THIẾU BẢNG THAM CHIẾU — LEGACY: Không có dữ liệu. Ý nghĩa nghiệp vụ chưa xác định — không FK, không index.
  "estore_id" integer -- ← fs_members.estore_id | ⚠️ THIẾU BẢNG THAM CHIẾU — LEGACY: Store reference. Referenced trong 12 file (chỉ đọc session tại libraries/fsmodels.php:175), không tìm thấy nơi set $_SESSION['estore_id']. Runtime verification required — không FK, không index.
);

-- [BẢNG MỚI] Lịch sử đổi trạng thái tài khoản người dùng.
DROP TABLE IF EXISTS "cic_user_status_history" CASCADE;
CREATE TABLE "cic_user_status_history" (
  "id" bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← — (bảng mới) | Khoá chính tự tăng.
  "user_id" integer NOT NULL REFERENCES cic_users(id) ON DELETE RESTRICT, -- ← — (bảng mới) | Người dùng bị đổi trạng thái.
  "previous_status" varchar(32) NULL, -- ← — (bảng mới) | Trạng thái trước khi đổi.
  "new_status" varchar(32) NOT NULL, -- ← — (bảng mới) | Trạng thái sau khi đổi.
  "reason" text NULL, -- ← — (bảng mới) | Lý do đổi trạng thái.
  "changed_at" timestamptz NOT NULL DEFAULT now(), -- ← — (bảng mới) | Thời điểm đổi.
  "changed_by" integer NULL REFERENCES cic_users(id) ON DELETE SET NULL -- ← — (bảng mới) | Người thực hiện thay đổi.
);

-- [BẢNG MỚI · ĐỀ XUẤT] Sự kiện bảo mật (đăng nhập, khoá tài khoản...).
DROP TABLE IF EXISTS "cic_security_events" CASCADE;
CREATE TABLE "cic_security_events" (
  "id" bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← — (bảng mới) | Khoá chính tự tăng.
  "user_id" integer NULL REFERENCES cic_users(id) ON DELETE SET NULL, -- ← — (bảng mới) | Người dùng liên quan (nếu có).
  "event_type" varchar(64) NOT NULL, -- ← — (bảng mới) | Loại sự kiện bảo mật.
  "status" varchar(16) NOT NULL, -- ← — (bảng mới) | Kết quả sự kiện.
  "ip_address" inet NULL, -- ← — (bảng mới) | Địa chỉ IP nguồn.
  "user_agent" text NULL, -- ← — (bảng mới) | User agent trình duyệt/thiết bị.
  "details" text NULL, -- ← — (bảng mới) | Chi tiết bổ sung.
  "created_at" timestamptz NOT NULL DEFAULT now() -- ← — (bảng mới) | Thời điểm phát sinh.
);

-- [BẢNG MỚI] Danh mục vai trò ổn định cho mô hình User → Role → Permission.
DROP TABLE IF EXISTS "cic_roles" CASCADE;
CREATE TABLE "cic_roles" (
-- (unique theo lower(trim(code)) được thêm bằng CREATE UNIQUE INDEX bên dưới, không thể khai báo inline)
  "id" bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← — (bảng mới) | Khoá chính.
  "code" varchar(100) NOT NULL, -- ← — (bảng mới) | Mã vai trò ổn định.
  "name" varchar(255) NOT NULL, -- ← — (bảng mới) | Tên vai trò.
  "description" text NULL, -- ← — (bảng mới) | Mô tả trách nhiệm.
  "status" varchar(16) NOT NULL DEFAULT 'active' CHECK ("status" IN ('active','inactive')), -- ← — (bảng mới) | Trạng thái hoạt động; inactive giữ assignment nhưng không cấp quyền.
  "is_protected" boolean NOT NULL DEFAULT false, -- ← — (bảng mới) | Vai trò hệ thống được bảo vệ.
  "created_at" timestamptz NOT NULL DEFAULT now(), -- ← — (bảng mới) | Thời điểm tạo.
  "created_by" integer NULL REFERENCES cic_users(id) ON DELETE SET NULL, -- ← — (bảng mới) | Người tạo.
  "updated_at" timestamptz NOT NULL DEFAULT now(), -- ← — (bảng mới) | Thời điểm cập nhật.
  "updated_by" integer NULL REFERENCES cic_users(id) ON DELETE SET NULL -- ← — (bảng mới) | Người cập nhật.
);

-- [BẢNG MỚI] Quyền trực tiếp của vai trò theo task và hành động.
DROP TABLE IF EXISTS "cic_role_permissions" CASCADE;
CREATE TABLE "cic_role_permissions" (
  "role_id" bigint NOT NULL REFERENCES cic_roles(id) ON DELETE CASCADE, -- ← — (bảng mới) | Vai trò.
  "permission_task_id" integer NOT NULL REFERENCES cic_permission_tasks(id) ON DELETE RESTRICT, -- ← — (bảng mới) | Task quyền do hệ thống quản lý.
  "action" varchar(24) NOT NULL, -- ← — (bảng mới) | Hành động view/create/edit/publish/delete…
  "allowed" boolean NOT NULL DEFAULT false, -- ← — (bảng mới) | Quyền hiệu lực của vai trò.
  "updated_at" timestamptz NOT NULL DEFAULT now(), -- ← — (bảng mới) | Thời điểm cập nhật.
  "updated_by" integer NULL REFERENCES cic_users(id) ON DELETE SET NULL, -- ← — (bảng mới) | Người cập nhật.
  CONSTRAINT "pk_cic_role_permissions" PRIMARY KEY ("role_id", "permission_task_id", "action")
);

-- [BẢNG MỚI] Gán vai trò cho người dùng.
DROP TABLE IF EXISTS "cic_user_roles" CASCADE;
CREATE TABLE "cic_user_roles" (
  "id" bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← — (bảng mới) | Khoá chính.
  "user_id" integer NOT NULL REFERENCES cic_users(id) ON DELETE CASCADE, -- ← — (bảng mới) | Người dùng được gán.
  "role_id" bigint NOT NULL REFERENCES cic_roles(id) ON DELETE RESTRICT, -- ← — (bảng mới) | Vai trò được gán.
  "assigned_at" timestamptz NOT NULL DEFAULT now(), -- ← — (bảng mới) | Thời điểm gán.
  "assigned_by" integer NULL REFERENCES cic_users(id) ON DELETE SET NULL, -- ← — (bảng mới) | Người thực hiện gán.
  "status" varchar(16) NOT NULL DEFAULT 'active' -- ← — (bảng mới) | Trạng thái assignment.
);

-- Cấu trúc menu khu vực quản trị (admin panel).
DROP TABLE IF EXISTS "cic_menus_admin" CASCADE;
CREATE TABLE "cic_menus_admin" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_menus_admin.id | Khoá chính tự tăng, dùng identity thay AUTO_INCREMENT.
  "name" varchar(255), -- ← fs_menus_admin.name | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "image" varchar(255), -- ← fs_menus_admin.image | Đường dẫn ảnh chính.
  "link" varchar(255), -- ← fs_menus_admin.link | Đường dẫn liên kết.
  "parent_id" integer REFERENCES cic_menus_admin(id) ON DELETE SET NULL, -- ← fs_menus_admin.parent_id | Tự tham chiếu (self-reference) — sentinel 0 đã được dọn thành NULL trước khi migrate; cho phép NULL và khai báo REFERENCES menus_admin(id) ON DELETE SET NULL để tránh mồ côi cây phân cấp (0 = gốc không còn ý nghĩa FK hợp lệ trong Postgres).
  "published" boolean NOT NULL, -- ← fs_menus_admin.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer NOT NULL, -- ← fs_menus_admin.ordering | Thứ tự sắp xếp hiển thị.
  "admin_type" boolean, -- ← fs_menus_admin.admin_type | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "module" varchar(255), -- ← fs_menus_admin.module | Tên module chức năng.
  "featured" varchar(255), -- ← fs_menus_admin.featured | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "icon" varchar(255), -- ← fs_menus_admin.icon | Đường dẫn/tên biểu tượng (icon).
  "view" varchar(255), -- ← fs_menus_admin.view | Lượt xem.
  "code_color" integer, -- ← fs_menus_admin.code_color | Mã màu (hex code) đại diện.
  "count" varchar(255), -- ← fs_menus_admin.count | Số lượng/bộ đếm.
  "where" varchar(255) -- ← fs_menus_admin.where | Điều kiện lọc dữ liệu (mệnh đề WHERE tùy chỉnh).
);

-- Danh sách liên kết có thể tạo nhanh khi thêm menu (ví dụ liên kết tới bài viết, sản phẩm...).
DROP TABLE IF EXISTS "cic_menus_createlink" CASCADE;
CREATE TABLE "cic_menus_createlink" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_menus_createlink.id | Khoá chính tự tăng, dùng identity thay AUTO_INCREMENT.
  "name" varchar(255), -- ← fs_menus_createlink.name | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "parent_id" varchar(255) NOT NULL, -- ← fs_menus_createlink.parent_id | 🔧 CẦN ÉP KIỂU trước khi gắn FK — Bảng đích menus_createlink.id tồn tại rõ ràng (không thiếu bảng), nhưng cột này đang là VARCHAR trong khi menus_createlink(id) là INTEGER — không thể khai báo REFERENCES trực tiếp do lệch kiểu dữ liệu. Cần kiểm tra dữ liệu thật (có rác/non-numeric không) rồi ép kiểu sang integer (theo đúng mẫu đã làm với products.types_id) trước khi thêm REFERENCES menus_createlink(id).
  "link_menu" varchar(255), -- ← fs_menus_createlink.link_menu | Đường dẫn liên kết của mục menu.
  "add_parameter" varchar(255), -- ← fs_menus_createlink.add_parameter | Tham số bổ sung truyền kèm.
  "add_table" varchar(255), -- ← fs_menus_createlink.add_table | Tên bảng bổ sung liên kết.
  "add_field_display" varchar(255), -- ← fs_menus_createlink.add_field_display | Trường bổ sung dùng để hiển thị thêm.
  "add_field_value" varchar(255), -- ← fs_menus_createlink.add_field_value | Giá trị bổ sung của trường mở rộng.
  "add_field_distinct" boolean, -- ← fs_menus_createlink.add_field_distinct | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "params" varchar(255), -- ← fs_menus_createlink.params | Tham số cấu hình (dạng JSON/chuỗi).
  "ordering" integer NOT NULL, -- ← fs_menus_createlink.ordering | Thứ tự sắp xếp hiển thị.
  "published" boolean NOT NULL, -- ← fs_menus_createlink.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_article" boolean, -- ← fs_menus_createlink.is_article | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_type" boolean -- ← fs_menus_createlink.is_type | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
);

-- Nhóm menu (vị trí hiển thị menu, ví dụ menu chính, menu chân trang).
DROP TABLE IF EXISTS "cic_menus_groups" CASCADE;
CREATE TABLE "cic_menus_groups" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_menus_groups.id / fs_menus_groups_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "published" boolean, -- ← fs_menus_groups.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer, -- ← fs_menus_groups.ordering | Thứ tự sắp xếp hiển thị.
  "group_name" varchar(255), -- ← fs_menus_groups.group_name + fs_menus_groups_en.group_name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "actflg" varchar(1) NULL, -- ← fs_menus_groups.actflg | Giữ để migrate đầy đủ dữ liệu legacy. Cờ trạng thái hoạt động (Active Flag) — trường kỹ thuật kế thừa từ hệ thống khác.
  "ctdusr" varchar(5) NULL, -- ← fs_menus_groups.ctdusr | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: người dùng tạo bản ghi (Created User).
  "ctdwks" varchar(15) NULL, -- ← fs_menus_groups.ctdwks | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: trạm làm việc tạo bản ghi (Created Workstation).
  "ctddtm" timestamptz NULL, -- ← fs_menus_groups.ctddtm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: ngày giờ tạo bản ghi (Created Date-Time).
  "mdfusr" varchar(5) NULL, -- ← fs_menus_groups.mdfusr | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: người chỉnh sửa gần nhất (Modified User).
  "mdfwks" varchar(15) NULL, -- ← fs_menus_groups.mdfwks | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: trạm làm việc chỉnh sửa gần nhất (Modified Workstation).
  "lstmdf" timestamptz NULL, -- ← fs_menus_groups.lstmdf | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: lần chỉnh sửa cuối (Last Modified).
  "cdtpgm" varchar(20) NULL, -- ← fs_menus_groups.cdtpgm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: chương trình tạo bản ghi (Created Program) — thường từ hệ thống cũ.
  "mdfpgm" varchar(20) NULL -- ← fs_menus_groups.mdfpgm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: chương trình chỉnh sửa gần nhất (Modified Program).
);

-- Nhóm menu (vị trí hiển thị menu, ví dụ menu chính, menu chân trang).
DROP TABLE IF EXISTS "cic_menus_groups_en" CASCADE;
CREATE TABLE "cic_menus_groups_en" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_menus_groups.id / fs_menus_groups_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "published" boolean, -- ← fs_menus_groups.published · fs_menus_groups_en.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer, -- ← fs_menus_groups.ordering · fs_menus_groups_en.ordering | Thứ tự sắp xếp hiển thị.
  "group_name" varchar(255), -- ← fs_menus_groups.group_name + fs_menus_groups_en.group_name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "actflg" varchar(1) NULL, -- ← fs_menus_groups_en.actflg | Giữ để migrate đầy đủ dữ liệu legacy. Cờ trạng thái hoạt động (Active Flag) — trường kỹ thuật kế thừa từ hệ thống khác.
  "ctdusr" varchar(5) NULL, -- ← fs_menus_groups_en.ctdusr | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: người dùng tạo bản ghi (Created User).
  "ctdwks" varchar(15) NULL, -- ← fs_menus_groups_en.ctdwks | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: trạm làm việc tạo bản ghi (Created Workstation).
  "ctddtm" timestamptz NULL, -- ← fs_menus_groups_en.ctddtm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: ngày giờ tạo bản ghi (Created Date-Time).
  "mdfusr" varchar(5) NULL, -- ← fs_menus_groups_en.mdfusr | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: người chỉnh sửa gần nhất (Modified User).
  "mdfwks" varchar(15) NULL, -- ← fs_menus_groups_en.mdfwks | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: trạm làm việc chỉnh sửa gần nhất (Modified Workstation).
  "lstmdf" timestamptz NULL, -- ← fs_menus_groups_en.lstmdf | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: lần chỉnh sửa cuối (Last Modified).
  "cdtpgm" varchar(20) NULL, -- ← fs_menus_groups_en.cdtpgm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: chương trình tạo bản ghi (Created Program) — thường từ hệ thống cũ.
  "mdfpgm" varchar(20) NULL -- ← fs_menus_groups_en.mdfpgm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: chương trình chỉnh sửa gần nhất (Modified Program).
);

-- Các mục (item) trong menu hiển thị ngoài website.
DROP TABLE IF EXISTS "cic_menus_items" CASCADE;
CREATE TABLE "cic_menus_items" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_menus_items.id / fs_menus_items_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "show_admin" boolean NOT NULL, -- ← fs_menus_items.show_admin | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "image" varchar(255), -- ← fs_menus_items.image | Đường dẫn ảnh chính.
  "link" varchar(255), -- ← fs_menus_items.link | Đường dẫn liên kết.
  "target" varchar(255), -- ← fs_menus_items.target | Đối tượng đích (ví dụ target của liên kết: _blank, _self).
  "group_id" integer REFERENCES cic_menus_groups(id), -- ← fs_menus_items.group_id | ✅ FK CHUẨN: Bảng đích menus_groups tồn tại rõ ràng trong schema này — khai báo REFERENCES menus_groups(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "ordering" integer NOT NULL, -- ← fs_menus_items.ordering | Thứ tự sắp xếp hiển thị.
  "default" boolean, -- ← fs_menus_items.default | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "published" boolean NOT NULL, -- ← fs_menus_items.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "created_time" timestamptz, -- ← fs_menus_items.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "updated_time" timestamptz, -- ← fs_menus_items.updated_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "template" varchar(50), -- ← fs_menus_items.template | Giao diện/mẫu (template) áp dụng.
  "list_parent" varchar(255), -- ← fs_menus_items.list_parent | Danh sách mã danh mục/mục cha.
  "level" integer, -- ← fs_menus_items.level | Cấp độ/mức độ phân cấp.
  "is_rewrite" boolean NOT NULL, -- ← fs_menus_items.is_rewrite | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_en" boolean, -- ← fs_menus_items.is_en | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "icon" varchar(255), -- ← fs_menus_items.icon | Đường dẫn/tên biểu tượng (icon).
  "parent_id" integer REFERENCES cic_menus_items(id) ON DELETE SET NULL, -- ← fs_menus_items.parent_id | ✅ FK CHUẨN (tự tham chiếu): Bảng đích menus_items chính là bảng này — khai báo REFERENCES menus_items(id) ON DELETE SET NULL. LƯU Ý: nếu dữ liệu cũ dùng sentinel 0 cho "không có cha/gốc", cần dọn 0→NULL trước khi migrate (giống 5 bảng cây phân cấp đã áp dụng: areas, menus_admin, contents_categories, news_categories, products_categories).
  "is_type" boolean, -- ← fs_menus_items.is_type | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_link" boolean, -- ← fs_menus_items.is_link | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "bk_color" varchar(255), -- ← fs_menus_items.bk_color | Mã màu nền (viết tắt background color).
  "name" varchar(255), -- ← fs_menus_items.name + fs_menus_items_en.name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "alias" varchar(255), -- ← fs_menus_items.alias + fs_menus_items_en.alias | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "description" text, -- ← fs_menus_items.description + fs_menus_items_en.description | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "description_short" varchar(255), -- ← fs_menus_items.description_short + fs_menus_items_en.description_short | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "summary" text, -- ← fs_menus_items.summary + fs_menus_items_en.summary | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "actflg" varchar(1) NULL, -- ← fs_menus_items.actflg | Giữ để migrate đầy đủ dữ liệu legacy. Cờ trạng thái hoạt động (Active Flag) — trường kỹ thuật kế thừa từ hệ thống khác.
  "ctdusr" varchar(5) NULL, -- ← fs_menus_items.ctdusr | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: người dùng tạo bản ghi (Created User).
  "ctdwks" varchar(15) NULL, -- ← fs_menus_items.ctdwks | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: trạm làm việc tạo bản ghi (Created Workstation).
  "ctddtm" timestamptz NULL, -- ← fs_menus_items.ctddtm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: ngày giờ tạo bản ghi (Created Date-Time).
  "mdfusr" varchar(5) NULL, -- ← fs_menus_items.mdfusr | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: người chỉnh sửa gần nhất (Modified User).
  "mdfwks" varchar(15) NULL, -- ← fs_menus_items.mdfwks | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: trạm làm việc chỉnh sửa gần nhất (Modified Workstation).
  "lstmdf" timestamptz NULL, -- ← fs_menus_items.lstmdf | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: lần chỉnh sửa cuối (Last Modified).
  "cdtpgm" varchar(20) NULL, -- ← fs_menus_items.cdtpgm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: chương trình tạo bản ghi (Created Program) — thường từ hệ thống cũ.
  "mdfpgm" varchar(20) NULL -- ← fs_menus_items.mdfpgm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: chương trình chỉnh sửa gần nhất (Modified Program).
);

-- Các mục (item) trong menu hiển thị ngoài website.
DROP TABLE IF EXISTS "cic_menus_items_en" CASCADE;
CREATE TABLE "cic_menus_items_en" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_menus_items.id / fs_menus_items_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "show_admin" boolean NOT NULL, -- ← fs_menus_items.show_admin · fs_menus_items_en.show_admin | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "image" varchar(255), -- ← fs_menus_items.image · fs_menus_items_en.image | Đường dẫn ảnh chính.
  "link" varchar(255), -- ← fs_menus_items.link · fs_menus_items_en.link | Đường dẫn liên kết.
  "target" varchar(255), -- ← fs_menus_items.target · fs_menus_items_en.target | Đối tượng đích (ví dụ target của liên kết: _blank, _self).
  "group_id" integer REFERENCES cic_menus_groups_en(id), -- ← fs_menus_items.group_id · fs_menus_items_en.group_id | ✅ FK CHUẨN: Bảng đích menus_groups_en tồn tại rõ ràng trong schema này — khai báo REFERENCES menus_groups_en(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "ordering" integer NOT NULL, -- ← fs_menus_items.ordering · fs_menus_items_en.ordering | Thứ tự sắp xếp hiển thị.
  "default" boolean, -- ← fs_menus_items.default · fs_menus_items_en.default | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "published" boolean NOT NULL, -- ← fs_menus_items.published · fs_menus_items_en.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "created_time" timestamptz, -- ← fs_menus_items.created_time · fs_menus_items_en.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "updated_time" timestamptz, -- ← fs_menus_items.updated_time · fs_menus_items_en.updated_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "template" varchar(50), -- ← fs_menus_items.template · fs_menus_items_en.template | Giao diện/mẫu (template) áp dụng.
  "list_parent" varchar(255), -- ← fs_menus_items.list_parent · fs_menus_items_en.list_parent | Danh sách mã danh mục/mục cha.
  "level" integer, -- ← fs_menus_items.level · fs_menus_items_en.level | Cấp độ/mức độ phân cấp.
  "is_rewrite" boolean NOT NULL, -- ← fs_menus_items.is_rewrite · fs_menus_items_en.is_rewrite | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_en" boolean, -- ← fs_menus_items.is_en · fs_menus_items_en.is_en | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "icon" varchar(255), -- ← fs_menus_items.icon · fs_menus_items_en.icon | Đường dẫn/tên biểu tượng (icon).
  "parent_id" integer REFERENCES cic_menus_items_en(id) ON DELETE SET NULL, -- ← fs_menus_items.parent_id · fs_menus_items_en.parent_id | ✅ FK CHUẨN (tự tham chiếu): Bảng đích menus_items chính là bảng này — khai báo REFERENCES menus_items_en(id) ON DELETE SET NULL. LƯU Ý: nếu dữ liệu cũ dùng sentinel 0 cho "không có cha/gốc", cần dọn 0→NULL trước khi migrate (giống 5 bảng cây phân cấp đã áp dụng: areas, menus_admin, contents_categories, news_categories, products_categories).
  "is_type" boolean, -- ← fs_menus_items.is_type · fs_menus_items_en.is_type | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_link" boolean, -- ← fs_menus_items.is_link · fs_menus_items_en.is_link | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "bk_color" varchar(255), -- ← fs_menus_items.bk_color · fs_menus_items_en.bk_color | Mã màu nền (viết tắt background color).
  "name" varchar(255), -- ← fs_menus_items.name + fs_menus_items_en.name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "alias" varchar(255), -- ← fs_menus_items.alias + fs_menus_items_en.alias | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "description" text, -- ← fs_menus_items.description + fs_menus_items_en.description | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "description_short" varchar(255), -- ← fs_menus_items.description_short + fs_menus_items_en.description_short | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "summary" text, -- ← fs_menus_items.summary + fs_menus_items_en.summary | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "actflg" varchar(1) NULL, -- ← fs_menus_items_en.actflg | Giữ để migrate đầy đủ dữ liệu legacy. Cờ trạng thái hoạt động (Active Flag) — trường kỹ thuật kế thừa từ hệ thống khác.
  "ctdusr" varchar(5) NULL, -- ← fs_menus_items_en.ctdusr | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: người dùng tạo bản ghi (Created User).
  "ctdwks" varchar(15) NULL, -- ← fs_menus_items_en.ctdwks | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: trạm làm việc tạo bản ghi (Created Workstation).
  "ctddtm" timestamptz NULL, -- ← fs_menus_items_en.ctddtm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: ngày giờ tạo bản ghi (Created Date-Time).
  "mdfusr" varchar(5) NULL, -- ← fs_menus_items_en.mdfusr | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: người chỉnh sửa gần nhất (Modified User).
  "mdfwks" varchar(15) NULL, -- ← fs_menus_items_en.mdfwks | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: trạm làm việc chỉnh sửa gần nhất (Modified Workstation).
  "lstmdf" timestamptz NULL, -- ← fs_menus_items_en.lstmdf | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: lần chỉnh sửa cuối (Last Modified).
  "cdtpgm" varchar(20) NULL, -- ← fs_menus_items_en.cdtpgm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: chương trình tạo bản ghi (Created Program) — thường từ hệ thống cũ.
  "mdfpgm" varchar(20) NULL -- ← fs_menus_items_en.mdfpgm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: chương trình chỉnh sửa gần nhất (Modified Program).
);

-- [BẢNG MỚI] Danh sách trụ sở và chi nhánh theo workspace, có liên hệ và bản đồ riêng.
DROP TABLE IF EXISTS "cic_branches" CASCADE;
CREATE TABLE "cic_branches" (
  "id" bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← — | Khóa chính.
  "workspace" varchar(5) NOT NULL CHECK (workspace IN ('vi','en')), -- ← — | Workspace độc lập.
  "code" varchar(100) NOT NULL, -- ← — | Mã ổn định.
  "name" varchar(255) NOT NULL, -- ← — | Tên địa điểm.
  "address" text NOT NULL CHECK (btrim(address) <> ''), -- ← — | Địa chỉ.
  "phone" varchar(255) NULL, -- ← — | Điện thoại.
  "email" varchar(255) NULL, -- ← — | Email.
  "fax" varchar(100) NULL, -- ← — | Fax.
  "working_hours" varchar(255) NULL, -- ← — | Giờ làm việc.
  "map_embed_url" text NULL, -- ← — | URL nhúng đã kiểm tra.
  "map_search_query" text NULL, -- ← — | Fallback mở bản đồ.
  "is_head_office" boolean NOT NULL DEFAULT false, -- ← — | Trụ sở chính.
  "published" boolean NOT NULL DEFAULT true, -- ← — | Hiển thị công khai.
  "ordering" integer NOT NULL DEFAULT 0 CHECK (ordering >= 0), -- ← — | Thứ tự.
  "created_by" integer NULL REFERENCES cic_users(id) ON DELETE SET NULL, -- ← — | Người tạo.
  "updated_by" integer NULL REFERENCES cic_users(id) ON DELETE SET NULL, -- ← — | Người cập nhật.
  "created_at" timestamptz NOT NULL DEFAULT now(), -- ← — | Thời điểm tạo.
  "updated_at" timestamptz NOT NULL DEFAULT now(), -- ← — | Thời điểm cập nhật.
  CONSTRAINT "uq_cic_branches_workspace_code" UNIQUE ("workspace", "code")
);

-- Cấu hình chung của website (tên site, meta, thông tin liên hệ mặc định...).
DROP TABLE IF EXISTS "cic_config" CASCADE;
CREATE TABLE "cic_config" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_config.id / fs_config_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "name" varchar(255) NOT NULL UNIQUE, -- ← fs_config.name / fs_config_en.name | Khoá định danh duy nhất của bản ghi cấu hình, dùng để tra cứu theo tên (ví dụ site_name, site_email...).
  "value" text, -- ← fs_config.value | Giá trị.
  "data_type" varchar(50), -- ← fs_config.data_type | Kiểu dữ liệu của trường.
  "is_common" boolean NOT NULL, -- ← fs_config.is_common | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "published" boolean, -- ← fs_config.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_ga" boolean, -- ← fs_config.is_ga | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer NOT NULL, -- ← fs_config.ordering | Thứ tự sắp xếp hiển thị.
  "title" varchar(255) -- ← fs_config.title + fs_config_en.title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
);

-- Cấu hình chung của website (tên site, meta, thông tin liên hệ mặc định...).
DROP TABLE IF EXISTS "cic_config_en" CASCADE;
CREATE TABLE "cic_config_en" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_config.id / fs_config_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "name" varchar(255) NOT NULL UNIQUE, -- ← fs_config.name / fs_config_en.name | Khoá định danh duy nhất của bản ghi cấu hình, dùng để tra cứu theo tên (ví dụ site_name, site_email...).
  "value" text, -- ← fs_config.value · fs_config_en.value | Giá trị.
  "data_type" varchar(50), -- ← fs_config.data_type · fs_config_en.data_type | Kiểu dữ liệu của trường.
  "is_common" boolean NOT NULL, -- ← fs_config.is_common · fs_config_en.is_common | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "published" boolean, -- ← fs_config.published · fs_config_en.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_ga" boolean, -- ← fs_config.is_ga · fs_config_en.is_ga | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer NOT NULL, -- ← fs_config.ordering · fs_config_en.ordering | Thứ tự sắp xếp hiển thị.
  "title" varchar(255) -- ← fs_config.title + fs_config_en.title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
);

-- Bảng cấu hình bổ sung (có thể liên quan tới module/tính năng đặc thù 'enjicad').
DROP TABLE IF EXISTS "cic_config_enjicad" CASCADE;
CREATE TABLE "cic_config_enjicad" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_config_enjicad.id | Khoá chính tự tăng, dùng identity thay AUTO_INCREMENT.
  "name" varchar(255) NOT NULL UNIQUE, -- ← fs_config_enjicad.name | Khoá định danh duy nhất của bản ghi cấu hình, dùng để tra cứu theo tên.
  "title" varchar(255), -- ← fs_config_enjicad.title | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "value" text, -- ← fs_config_enjicad.value | Giá trị.
  "data_type" varchar(50), -- ← fs_config_enjicad.data_type | Kiểu dữ liệu của trường.
  "is_common" boolean NOT NULL, -- ← fs_config_enjicad.is_common | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "published" boolean, -- ← fs_config_enjicad.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_ga" boolean, -- ← fs_config_enjicad.is_ga | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer NOT NULL -- ← fs_config_enjicad.ordering | Thứ tự sắp xếp hiển thị.
);

-- Cấu hình các module/widget hiển thị trên site.
DROP TABLE IF EXISTS "cic_config_modules" CASCADE;
CREATE TABLE "cic_config_modules" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_config_modules.id / fs_config_modules_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "module" varchar(255), -- ← fs_config_modules.module | Tên module chức năng.
  "view" varchar(255), -- ← fs_config_modules.view | Lượt xem.
  "task" varchar(255), -- ← fs_config_modules.task | Tên tác vụ.
  "published" boolean NOT NULL, -- ← fs_config_modules.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" varchar(255), -- ← fs_config_modules.ordering | Thứ tự sắp xếp hiển thị.
  "cache" integer, -- ← fs_config_modules.cache | Dữ liệu/cấu hình cache.
  "params" text, -- ← fs_config_modules.params | Tham số cấu hình (dạng JSON/chuỗi).
  "title" varchar(255), -- ← fs_config_modules.title + fs_config_modules_en.title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "fields_seo_title" varchar(255), -- ← fs_config_modules.fields_seo_title + fs_config_modules_en.fields_seo_title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "fields_seo_keyword" varchar(255), -- ← fs_config_modules.fields_seo_keyword + fs_config_modules_en.fields_seo_keyword | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "fields_seo_description" varchar(255), -- ← fs_config_modules.fields_seo_description + fs_config_modules_en.fields_seo_description | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "fields_seo_h1" varchar(255), -- ← fs_config_modules.fields_seo_h1 + fs_config_modules_en.fields_seo_h1 | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "fields_seo_h2" varchar(255), -- ← fs_config_modules.fields_seo_h2 + fs_config_modules_en.fields_seo_h2 | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "fields_seo_image_alt" varchar(255), -- ← fs_config_modules.fields_seo_image_alt + fs_config_modules_en.fields_seo_image_alt | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "value_seo_title" varchar(255), -- ← fs_config_modules.value_seo_title + fs_config_modules_en.value_seo_title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "value_seo_keyword" varchar(255) NULL, -- ← — (cột mới) · fs_config_modules.value_seo_keyword | [MỚI] Meta keywords cho route/module (VI). Có trong fs_config_modules, được code cũ ghi/đọc nhưng bị bỏ sót khỏi bản PostgreSQL trước đó.
  "value_seo_description" varchar(255) NULL, -- ← — (cột mới) · fs_config_modules.value_seo_description | [MỚI] Meta description cho route/module (VI). Field legacy dùng thật; bản draft trước chỉ giữ value_seo_title.
  "seo_indexable" boolean NOT NULL DEFAULT true -- ← — (cột mới) | [MỚI] Cho phép công cụ tìm kiếm lập chỉ mục route/module (VI). `published` là trạng thái cấu hình module, không phải robots index/noindex.
);

-- Cấu hình các module/widget hiển thị trên site.
DROP TABLE IF EXISTS "cic_config_modules_en" CASCADE;
CREATE TABLE "cic_config_modules_en" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_config_modules.id / fs_config_modules_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "module" varchar(255), -- ← fs_config_modules.module · fs_config_modules_en.module | Tên module chức năng.
  "view" varchar(255), -- ← fs_config_modules.view · fs_config_modules_en.view | Lượt xem.
  "task" varchar(255), -- ← fs_config_modules.task · fs_config_modules_en.task | Tên tác vụ.
  "published" boolean NOT NULL, -- ← fs_config_modules.published · fs_config_modules_en.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" varchar(255), -- ← fs_config_modules.ordering · fs_config_modules_en.ordering | Thứ tự sắp xếp hiển thị.
  "cache" integer, -- ← fs_config_modules.cache · fs_config_modules_en.cache | Dữ liệu/cấu hình cache.
  "params" text, -- ← fs_config_modules.params · fs_config_modules_en.params | Tham số cấu hình (dạng JSON/chuỗi).
  "title" varchar(255), -- ← fs_config_modules.title + fs_config_modules_en.title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "fields_seo_title" varchar(255), -- ← fs_config_modules.fields_seo_title + fs_config_modules_en.fields_seo_title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "fields_seo_keyword" varchar(255), -- ← fs_config_modules.fields_seo_keyword + fs_config_modules_en.fields_seo_keyword | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "fields_seo_description" varchar(255), -- ← fs_config_modules.fields_seo_description + fs_config_modules_en.fields_seo_description | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "fields_seo_h1" varchar(255), -- ← fs_config_modules.fields_seo_h1 + fs_config_modules_en.fields_seo_h1 | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "fields_seo_h2" varchar(255), -- ← fs_config_modules.fields_seo_h2 + fs_config_modules_en.fields_seo_h2 | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "fields_seo_image_alt" varchar(255), -- ← fs_config_modules.fields_seo_image_alt + fs_config_modules_en.fields_seo_image_alt | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "value_seo_title" varchar(255), -- ← fs_config_modules.value_seo_title + fs_config_modules_en.value_seo_title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "value_seo_keyword" varchar(255) NULL, -- ← — (cột mới) · fs_config_modules_en.value_seo_keyword | [MỚI] Meta keywords cho route/module — workspace EN, khôi phục field tương ứng bị bỏ sót.
  "value_seo_description" varchar(255) NULL, -- ← — (cột mới) · fs_config_modules_en.value_seo_description | [MỚI] Meta description cho route/module — workspace EN.
  "seo_indexable" boolean NOT NULL DEFAULT true -- ← — (cột mới) | [MỚI] Cho phép lập chỉ mục route/module — workspace EN. Không dùng `published` thay cho robots policy.
);

-- Các khối nội dung (block) có thể chèn vào trang.
DROP TABLE IF EXISTS "cic_blocks" CASCADE;
CREATE TABLE "cic_blocks" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_blocks.id / fs_blocks_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "ordering" integer, -- ← fs_blocks.ordering | Thứ tự sắp xếp hiển thị.
  "published" boolean, -- ← fs_blocks.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "module" varchar(255), -- ← fs_blocks.module | Tên module chức năng.
  "position" varchar(250), -- ← fs_blocks.position | Vị trí hiển thị (ví dụ trên trang/module).
  "listItemid" varchar(255), -- ← fs_blocks.listItemid | Danh sách ID các mục (dạng chuỗi phân tách).
  "params" text, -- ← fs_blocks.params | Tham số cấu hình (dạng JSON/chuỗi).
  "showTitle" boolean, -- ← fs_blocks.showTitle | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "hide_admin" boolean, -- ← fs_blocks.hide_admin | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "news_categories" text, -- ← fs_blocks.news_categories | Tên/mã danh mục tin tức liên kết.
  "url" varchar(255), -- ← fs_blocks.url | Đường dẫn URL.
  "text_replace" varchar(255), -- ← fs_blocks.text_replace | Văn bản dùng để thay thế.
  "text_color" varchar(255), -- ← fs_blocks.text_color | Mã màu chữ.
  "module_id" integer REFERENCES cic_config_modules(id), -- ← fs_blocks.module_id | ✅ FK CHUẨN: Bảng đích config_modules tồn tại rõ ràng trong schema này — khai báo REFERENCES config_modules(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "module_name" varchar(255), -- ← fs_blocks.module_name | Tên module.
  "type_html" varchar(255), -- ← fs_blocks.type_html | Loại định dạng HTML.
  "background_color" varchar(255), -- ← fs_blocks.background_color | Mã màu nền.
  "image" varchar(255), -- ← fs_blocks.image | Đường dẫn ảnh chính.
  "type_background" integer, -- ← fs_blocks.type_background | Loại nền hiển thị.
  "created_time" timestamptz, -- ← fs_blocks.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "title" varchar(255) NULL, -- ← fs_blocks.title | Giữ để migrate đầy đủ dữ liệu legacy. Tiêu đề.
  "content" text NULL, -- ← fs_blocks.content | Giữ để migrate đầy đủ dữ liệu legacy. Nội dung chi tiết (thường là HTML).
  "contents_categories" text NULL, -- ← fs_blocks.contents_categories | Giữ để migrate đầy đủ dữ liệu legacy. Tên/mã danh mục nội dung liên kết.
  "contents_categories_alias" varchar(255) NULL, -- ← fs_blocks.contents_categories_alias | Giữ để migrate đầy đủ dữ liệu legacy. Alias danh mục nội dung liên kết.
  "summary" text NULL, -- ← fs_blocks.summary | Giữ để migrate đầy đủ dữ liệu legacy. Tóm tắt nội dung.
  "actflg" varchar(1) NULL, -- ← fs_blocks.actflg | Giữ để migrate đầy đủ dữ liệu legacy. Cờ trạng thái hoạt động (Active Flag) — trường kỹ thuật kế thừa từ hệ thống khác.
  "ctdusr" varchar(5) NULL, -- ← fs_blocks.ctdusr | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: người dùng tạo bản ghi (Created User).
  "ctdwks" varchar(15) NULL, -- ← fs_blocks.ctdwks | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: trạm làm việc tạo bản ghi (Created Workstation).
  "ctddtm" timestamptz NULL, -- ← fs_blocks.ctddtm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: ngày giờ tạo bản ghi (Created Date-Time).
  "mdfusr" varchar(5) NULL, -- ← fs_blocks.mdfusr | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: người chỉnh sửa gần nhất (Modified User).
  "mdfwks" varchar(15) NULL, -- ← fs_blocks.mdfwks | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: trạm làm việc chỉnh sửa gần nhất (Modified Workstation).
  "lstmdf" timestamptz NULL, -- ← fs_blocks.lstmdf | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: lần chỉnh sửa cuối (Last Modified).
  "cdtpgm" varchar(20) NULL, -- ← fs_blocks.cdtpgm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: chương trình tạo bản ghi (Created Program) — thường từ hệ thống cũ.
  "mdfpgm" varchar(20) NULL, -- ← fs_blocks.mdfpgm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: chương trình chỉnh sửa gần nhất (Modified Program).
  "entity_id" integer NOT NULL, -- ← fs_blocks.id / fs_blocks_en.id · đồng bộ contract VI/EN | Khoá ngoại trỏ về blocks.id — thay cho cách "dùng chung id" giữa 2 bảng như thiết kế cũ.
  "locale" varchar(5) NOT NULL DEFAULT 'vi' -- ← (mới — suy ra từ việc bản ghi thuộc bảng gốc (vi) hay bảng _en (en)) · đồng bộ contract VI/EN | 'vi' hoặc 'en'. Kết hợp UNIQUE(entity_id, locale) để đảm bảo mỗi bản ghi chỉ có đúng 1 bản dịch / ngôn ngữ.
);

-- Nội dung đa ngôn ngữ (vi/en) của blocks — tách riêng khỏi bảng gốc, thay cho mô hình "1 bảng/ngôn ngữ" cũ.
DROP TABLE IF EXISTS "cic_blocks_translations" CASCADE;
CREATE TABLE "cic_blocks_translations" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- Khoá chính riêng của dòng bản dịch (không dùng chung id với bảng gốc nữa).
  "entity_id" integer NOT NULL REFERENCES cic_blocks(id) ON DELETE CASCADE, -- ← fs_blocks.id / fs_blocks_en.id | Khoá ngoại trỏ về blocks.id — thay cho cách "dùng chung id" giữa 2 bảng như thiết kế cũ.
  "locale" varchar(5) NOT NULL DEFAULT 'vi', -- ← (mới — suy ra từ việc bản ghi thuộc bảng gốc (vi) hay bảng _en (en)) | 'vi' hoặc 'en'. Kết hợp UNIQUE(entity_id, locale) để đảm bảo mỗi bản ghi chỉ có đúng 1 bản dịch / ngôn ngữ.
  "title" varchar(255), -- ← fs_blocks.title + fs_blocks_en.title | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "content" text, -- ← fs_blocks.content + fs_blocks_en.content | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "contents_categories" text, -- ← fs_blocks.contents_categories + fs_blocks_en.contents_categories | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "contents_categories_alias" varchar(255), -- ← fs_blocks.contents_categories_alias + fs_blocks_en.contents_categories_alias | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "summary" text, -- ← fs_blocks.summary + fs_blocks_en.summary | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "ordering" integer NULL, -- ← fs_blocks_en.ordering | Giữ để migrate đầy đủ dữ liệu legacy. Thứ tự sắp xếp hiển thị.
  "published" boolean NULL, -- ← fs_blocks_en.published | Giữ để migrate đầy đủ dữ liệu legacy. Trạng thái xuất bản/hiển thị (1: hiện, 0: ẩn).
  "module" varchar(255) NULL, -- ← fs_blocks_en.module | Giữ để migrate đầy đủ dữ liệu legacy. Tên module chức năng.
  "position" varchar(250) NULL, -- ← fs_blocks_en.position | Giữ để migrate đầy đủ dữ liệu legacy. Vị trí hiển thị (ví dụ trên trang/module).
  "listItemid" varchar(255) NULL, -- ← fs_blocks_en.listItemid | Giữ để migrate đầy đủ dữ liệu legacy. Danh sách ID các mục (dạng chuỗi phân tách).
  "params" text NULL, -- ← fs_blocks_en.params | Giữ để migrate đầy đủ dữ liệu legacy. Tham số cấu hình (dạng JSON/chuỗi).
  "showTitle" boolean NULL, -- ← fs_blocks_en.showTitle | Giữ để migrate đầy đủ dữ liệu legacy. Bật/tắt hiển thị tiêu đề.
  "hide_admin" boolean NULL, -- ← fs_blocks_en.hide_admin | Giữ để migrate đầy đủ dữ liệu legacy. Ẩn khỏi giao diện quản trị.
  "news_categories" text NULL, -- ← fs_blocks_en.news_categories | Giữ để migrate đầy đủ dữ liệu legacy. Tên/mã danh mục tin tức liên kết.
  "url" varchar(255) NULL, -- ← fs_blocks_en.url | Giữ để migrate đầy đủ dữ liệu legacy. Đường dẫn URL.
  "text_replace" varchar(255) NULL, -- ← fs_blocks_en.text_replace | Giữ để migrate đầy đủ dữ liệu legacy. Văn bản dùng để thay thế.
  "text_color" varchar(255) NULL, -- ← fs_blocks_en.text_color | Giữ để migrate đầy đủ dữ liệu legacy. Mã màu chữ.
  "module_id" integer NULL, -- ← fs_blocks_en.module_id | Giữ để migrate đầy đủ dữ liệu legacy. Khóa ngoại liên kết tới module.
  "module_name" varchar(255) NULL, -- ← fs_blocks_en.module_name | Giữ để migrate đầy đủ dữ liệu legacy. Tên module.
  "type_html" varchar(255) NULL, -- ← fs_blocks_en.type_html | Giữ để migrate đầy đủ dữ liệu legacy. Loại định dạng HTML.
  "background_color" varchar(255) NULL, -- ← fs_blocks_en.background_color | Giữ để migrate đầy đủ dữ liệu legacy. Mã màu nền.
  "image" varchar(255) NULL, -- ← fs_blocks_en.image | Giữ để migrate đầy đủ dữ liệu legacy. Đường dẫn ảnh chính.
  "type_background" integer NULL, -- ← fs_blocks_en.type_background | Giữ để migrate đầy đủ dữ liệu legacy. Loại nền hiển thị.
  "created_time" timestamptz NULL, -- ← fs_blocks_en.created_time | Giữ để migrate đầy đủ dữ liệu legacy. Thời điểm tạo bản ghi.
  "actflg" varchar(1) NULL, -- ← fs_blocks_en.actflg | Giữ để migrate đầy đủ dữ liệu legacy. Cờ trạng thái hoạt động (Active Flag) — trường kỹ thuật kế thừa từ hệ thống khác.
  "ctdusr" varchar(5) NULL, -- ← fs_blocks_en.ctdusr | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: người dùng tạo bản ghi (Created User).
  "ctdwks" varchar(15) NULL, -- ← fs_blocks_en.ctdwks | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: trạm làm việc tạo bản ghi (Created Workstation).
  "ctddtm" timestamptz NULL, -- ← fs_blocks_en.ctddtm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: ngày giờ tạo bản ghi (Created Date-Time).
  "mdfusr" varchar(5) NULL, -- ← fs_blocks_en.mdfusr | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: người chỉnh sửa gần nhất (Modified User).
  "mdfwks" varchar(15) NULL, -- ← fs_blocks_en.mdfwks | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: trạm làm việc chỉnh sửa gần nhất (Modified Workstation).
  "lstmdf" timestamptz NULL, -- ← fs_blocks_en.lstmdf | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: lần chỉnh sửa cuối (Last Modified).
  "cdtpgm" varchar(20) NULL, -- ← fs_blocks_en.cdtpgm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: chương trình tạo bản ghi (Created Program) — thường từ hệ thống cũ.
  "mdfpgm" varchar(20) NULL, -- ← fs_blocks_en.mdfpgm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: chương trình chỉnh sửa gần nhất (Modified Program).
  CONSTRAINT "uq_cic_blocks_translations_entity_locale" UNIQUE ("entity_id", "locale")
);

-- Danh sách các block đã tồn tại/được sử dụng trong hệ thống.
DROP TABLE IF EXISTS "cic_blocks_exist" CASCADE;
CREATE TABLE "cic_blocks_exist" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_blocks_exist.id | Khoá chính tự tăng, dùng identity thay AUTO_INCREMENT.
  "block" varchar(255), -- ← fs_blocks_exist.block | Nội dung/khối hiển thị.
  "name" varchar(255), -- ← fs_blocks_exist.name | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "content" text, -- ← fs_blocks_exist.content | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "ordering" integer, -- ← fs_blocks_exist.ordering | Thứ tự sắp xếp hiển thị.
  "published" boolean NOT NULL, -- ← fs_blocks_exist.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "price" varchar(255) -- ← fs_blocks_exist.price | Giá bán.
);

-- Danh mục các bảng dữ liệu động trong hệ thống (dùng cho tính năng quản lý bảng động/CMS builder).
DROP TABLE IF EXISTS "cic_tables" CASCADE;
CREATE TABLE "cic_tables" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_tables.id | Khoá chính tự tăng, dùng identity thay AUTO_INCREMENT.
  "type" varchar(255) NOT NULL, -- ← fs_tables.type | Loại/phân loại của bản ghi.
  "field_name" varchar(255) NOT NULL, -- ← fs_tables.field_name | Tên trường.
  "field_alias" varchar(255) NOT NULL, -- ← fs_tables.field_alias | Alias của trường dữ liệu.
  "field_name_display" varchar(255), -- ← fs_tables.field_name_display | Tên hiển thị của trường.
  "field_type" varchar(255) NOT NULL, -- ← fs_tables.field_type | Kiểu dữ liệu/loại của trường (text, number, select...).
  "field_length" integer, -- ← fs_tables.field_length | Độ dài tối đa của trường.
  "foreign_id" integer, -- ← fs_tables.foreign_id | ⚠️ THIẾU BẢNG THAM CHIẾU — FK ĐỘNG (dynamic): bảng đích của cột này KHÔNG cố định, được xác định lúc runtime bởi giá trị của cột "foreign_tablename" trong cùng dòng (mỗi dòng có thể trỏ tới một bảng khác nhau). Postgres không hỗ trợ FOREIGN KEY trỏ động theo dữ liệu — giữ nguyên dạng không FK, không index. Muốn ràng buộc chặt cần refactor sang bảng con riêng theo từng loại tham chiếu (polymorphic association), ngoài phạm vi của lần rà soát này.
  "foreign_name" varchar(255), -- ← fs_tables.foreign_name | Tên hiển thị của bản ghi tham chiếu ở bảng khác.
  "foreign_tablename" varchar(255), -- ← fs_tables.foreign_tablename | ⚠️ THIẾU BẢNG THAM CHIẾU — Tên bảng được tham chiếu tới (khóa ngoại động).
  "ordering" integer, -- ← fs_tables.ordering | Thứ tự sắp xếp hiển thị.
  "is_filter" boolean NOT NULL, -- ← fs_tables.is_filter | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_display_in_admin" boolean NOT NULL, -- ← fs_tables.is_display_in_admin | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_default" boolean NOT NULL, -- ← fs_tables.is_default | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "field_trigger" varchar(255), -- ← fs_tables.field_trigger | Trường kích hoạt (trigger) một hành động khác.
  "created_table" varchar(255) -- ← fs_tables.created_table | Tên bảng nơi bản ghi được tạo ra (dùng cho log/tra cứu).
);

-- Nhóm trường mở rộng (custom fields) gắn thêm cho các đối tượng dữ liệu.
DROP TABLE IF EXISTS "cic_extends_groups" CASCADE;
CREATE TABLE "cic_extends_groups" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_extends_groups.id | Khoá chính tự tăng, dùng identity thay AUTO_INCREMENT.
  "code" varchar(255), -- ← fs_extends_groups.code | Mã định danh dạng chuỗi (mã code) của đối tượng.
  "alias" varchar(250), -- ← fs_extends_groups.alias | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "name" varchar(250), -- ← fs_extends_groups.name | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "published" boolean, -- ← fs_extends_groups.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "image" varchar(250), -- ← fs_extends_groups.image | Đường dẫn ảnh chính.
  "icon" varchar(250), -- ← fs_extends_groups.icon | Đường dẫn/tên biểu tượng (icon).
  "ordering" integer NOT NULL, -- ← fs_extends_groups.ordering | Thứ tự sắp xếp hiển thị.
  "created_time" timestamptz, -- ← fs_extends_groups.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "updated_time" timestamptz, -- ← fs_extends_groups.updated_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "description" text, -- ← fs_extends_groups.description | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "seo_title" varchar(255), -- ← fs_extends_groups.seo_title | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "seo_keyword" varchar(255), -- ← fs_extends_groups.seo_keyword | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "seo_description" varchar(255) -- ← fs_extends_groups.seo_description | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
);

-- Giá trị cụ thể của các trường mở rộng.
DROP TABLE IF EXISTS "cic_extends_items" CASCADE;
CREATE TABLE "cic_extends_items" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_extends_items.id | Khoá chính tự tăng, dùng identity thay AUTO_INCREMENT.
  "name" varchar(255), -- ← fs_extends_items.name | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "alias" varchar(255), -- ← fs_extends_items.alias | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "ordering" integer, -- ← fs_extends_items.ordering | Thứ tự sắp xếp hiển thị.
  "published" boolean, -- ← fs_extends_items.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "created_time" timestamptz, -- ← fs_extends_items.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "edited_time" timestamptz, -- ← fs_extends_items.edited_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "group_id" integer REFERENCES cic_extends_groups(id), -- ← fs_extends_items.group_id | ✅ FK CHUẨN: Ép kiểu từ VARCHAR sang INTEGER — dữ liệu đã kiểm tra không có rác, toàn bộ là số nguyên. Bảng đích extends_groups tồn tại trong schema này — khai báo REFERENCES extends_groups(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "group_name" varchar(255), -- ← fs_extends_items.group_name | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "seo_title" varchar(255), -- ← fs_extends_items.seo_title | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "seo_keyword" varchar(255), -- ← fs_extends_items.seo_keyword | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "seo_description" varchar(255), -- ← fs_extends_items.seo_description | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "image" varchar(255) -- ← fs_extends_items.image | Đường dẫn ảnh chính.
);

-- Nhật ký lịch sử thao tác (audit log) của người dùng trong hệ thống.
DROP TABLE IF EXISTS "cic_history" CASCADE;
CREATE TABLE "cic_history" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_history.id | Khoá chính tự tăng, dùng identity thay AUTO_INCREMENT.
  "username" varchar(255) NOT NULL, -- ← fs_history.username | Tên đăng nhập.
  "money" varchar(255) NOT NULL, -- ← fs_history.money | Số tiền.
  "type" varchar(255) NOT NULL, -- ← fs_history.type | Loại/phân loại của bản ghi.
  "description" varchar(255), -- ← fs_history.description | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "created_time" timestamptz, -- ← fs_history.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "service_name" varchar(255), -- ← fs_history.service_name | Tên dịch vụ.
  "service_id" integer -- ← fs_history.service_id | ⚠️ THIẾU BẢNG THAM CHIẾU — LEGACY: Không có dữ liệu. Khác với cột service_name đã có sẵn trong bảng. Ý nghĩa nghiệp vụ chưa xác định — không FK, không index.
);

-- Thống kê lượt truy cập/lượt xem trang hoặc nội dung.
DROP TABLE IF EXISTS "cic_hits" CASCADE;
CREATE TABLE "cic_hits" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_hits.id | Khoá chính tự tăng, dùng identity thay AUTO_INCREMENT.
  "ip_address" varchar(250) NOT NULL, -- ← fs_hits.ip_address | Địa chỉ IP người dùng.
  "visited_time" timestamptz, -- ← fs_hits.visited_time | Thời điểm truy cập.
  "page" varchar(255) -- ← fs_hits.page | Trang liên kết/số trang.
);

-- Danh mục các ngôn ngữ được hỗ trợ trên site.
DROP TABLE IF EXISTS "cic_languages" CASCADE;
CREATE TABLE "cic_languages" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_languages.id | Khoá chính tự tăng, dùng identity thay AUTO_INCREMENT.
  "language" varchar(255), -- ← fs_languages.language | Ngôn ngữ.
  "lang_sort" varchar(255), -- ← fs_languages.lang_sort | Thứ tự sắp xếp theo ngôn ngữ.
  "is_default" boolean NOT NULL -- ← fs_languages.is_default | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
);

-- Ánh xạ nội dung theo từng ngôn ngữ.
DROP TABLE IF EXISTS "cic_languages_contents" CASCADE;
CREATE TABLE "cic_languages_contents" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_languages_contents.id | Khoá chính tự tăng, dùng identity thay AUTO_INCREMENT.
  "table_name" varchar(255), -- ← fs_languages_contents.table_name | Tên bảng liên kết.
  "field_name" varchar(255), -- ← fs_languages_contents.field_name | Tên trường.
  "value" text, -- ← fs_languages_contents.value | Giá trị.
  "modified_time" timestamptz, -- ← fs_languages_contents.modified_time | Thời điểm chỉnh sửa gần nhất.
  "created_time" timestamptz, -- ← fs_languages_contents.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "published" boolean -- ← fs_languages_contents.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
);

-- Ánh xạ các bảng nào hỗ trợ đa ngôn ngữ.
DROP TABLE IF EXISTS "cic_languages_tables" CASCADE;
CREATE TABLE "cic_languages_tables" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_languages_tables.id | Khoá chính tự tăng, dùng identity thay AUTO_INCREMENT.
  "table_name" varchar(255), -- ← fs_languages_tables.table_name | Tên bảng liên kết.
  "name" varchar(255), -- ← fs_languages_tables.name | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "main_field_display" varchar(255), -- ← fs_languages_tables.main_field_display | Trường chính được chọn để hiển thị.
  "edited_time" timestamptz, -- ← fs_languages_tables.edited_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "published" integer NOT NULL, -- ← fs_languages_tables.published | Trạng thái xuất bản/hiển thị (1: hiện, 0: ẩn).
  "field_not_display" text, -- ← fs_languages_tables.field_not_display | Trường không hiển thị.
  "field_synchronize" text, -- ← fs_languages_tables.field_synchronize | Đánh dấu trường cần đồng bộ.
  "field_inner_change_simultaneously" varchar(255), -- ← fs_languages_tables.field_inner_change_simultaneously | Trường nội bộ thay đổi đồng thời (cấu hình đồng bộ).
  "field_inner_change_after" varchar(255), -- ← fs_languages_tables.field_inner_change_after | Trường nội bộ thay đổi sau (cấu hình đồng bộ).
  "field_outer_change" varchar(255), -- ← fs_languages_tables.field_outer_change | Trường bên ngoài thay đổi (cấu hình đồng bộ).
  "where" varchar(255), -- ← fs_languages_tables.where | Điều kiện lọc dữ liệu (mệnh đề WHERE tùy chỉnh).
  "functions" varchar(255), -- ← fs_languages_tables.functions | Danh sách chức năng liên quan.
  "ordering" integer -- ← fs_languages_tables.ordering | Thứ tự sắp xếp hiển thị.
);

-- Chuỗi văn bản đa ngôn ngữ hiển thị ngoài site (i18n).
DROP TABLE IF EXISTS "cic_languages_text" CASCADE;
CREATE TABLE "cic_languages_text" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_languages_text.id | Khoá chính tự tăng, dùng identity thay AUTO_INCREMENT.
  "lang_key" varchar(255) NOT NULL, -- ← fs_languages_text.lang_key | Khóa (key) định danh chuỗi ngôn ngữ.
  "lang_vi" varchar(255), -- ← fs_languages_text.lang_vi | Nội dung/nhãn theo ngôn ngữ tiếng Việt.
  "lang_en" varchar(255), -- ← fs_languages_text.lang_en | Nội dung/nhãn theo ngôn ngữ tiếng Anh.
  "lang_fr" varchar(255), -- ← fs_languages_text.lang_fr | Nội dung/nhãn theo ngôn ngữ tiếng Pháp.
  "is_common" boolean NOT NULL, -- ← fs_languages_text.is_common | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "module" varchar(100), -- ← fs_languages_text.module | Tên module chức năng.
  "admin_change" boolean NOT NULL -- ← fs_languages_text.admin_change | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
);

-- Chuỗi văn bản đa ngôn ngữ dùng trong khu vực quản trị.
DROP TABLE IF EXISTS "cic_languages_text_admin" CASCADE;
CREATE TABLE "cic_languages_text_admin" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_languages_text_admin.id | Khoá chính tự tăng, dùng identity thay AUTO_INCREMENT.
  "lang_key" varchar(255) NOT NULL, -- ← fs_languages_text_admin.lang_key | Khóa (key) định danh chuỗi ngôn ngữ.
  "lang_vi" varchar(255), -- ← fs_languages_text_admin.lang_vi | Nội dung/nhãn theo ngôn ngữ tiếng Việt.
  "lang_en" varchar(255), -- ← fs_languages_text_admin.lang_en | Nội dung/nhãn theo ngôn ngữ tiếng Anh.
  "lang_fr" varchar(255), -- ← fs_languages_text_admin.lang_fr | Nội dung/nhãn theo ngôn ngữ tiếng Pháp.
  "is_common" boolean NOT NULL, -- ← fs_languages_text_admin.is_common | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "module" varchar(100), -- ← fs_languages_text_admin.module | Tên module chức năng.
  "admin_change" boolean NOT NULL -- ← fs_languages_text_admin.admin_change | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
);

-- Bảng trung gian lưu bản dịch nội dung giữa các ngôn ngữ.
DROP TABLE IF EXISTS "cic_translate_content" CASCADE;
CREATE TABLE "cic_translate_content" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_translate_content.id | Khoá chính tự tăng, dùng identity thay AUTO_INCREMENT.
  "name" varchar(255), -- ← fs_translate_content.name | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "alias" varchar(255), -- ← fs_translate_content.alias | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "published" boolean, -- ← fs_translate_content.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer, -- ← fs_translate_content.ordering | Thứ tự sắp xếp hiển thị.
  "created_time" timestamptz, -- ← fs_translate_content.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "template" text, -- ← fs_translate_content.template | Giao diện/mẫu (template) áp dụng.
  "image" varchar(255), -- ← fs_translate_content.image | Đường dẫn ảnh chính.
  "seo_title" varchar(255), -- ← fs_translate_content.seo_title | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "seo_keyword" varchar(255), -- ← fs_translate_content.seo_keyword | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "seo_description" varchar(255), -- ← fs_translate_content.seo_description | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "etemplate_id" integer -- ← fs_translate_content.etemplate_id | ⚠️ THIẾU BẢNG THAM CHIẾU — LEGACY: Không có dữ liệu. Ý nghĩa nghiệp vụ chưa xác định — không FK, không index.
);

-- Nội dung trang tĩnh / bài viết CMS (tiếng Việt).
DROP TABLE IF EXISTS "cic_contents" CASCADE;
CREATE TABLE "cic_contents" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_contents.id / fs_contents_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "content" text, -- ← fs_contents.content | Nội dung chi tiết (thường là HTML).
  "tags" varchar(255), -- ← fs_contents.tags | Thẻ gắn với nội dung (dùng để phân loại/tìm kiếm).
  "category_id" integer, -- ← fs_contents.category_id | ✅ FK CHUẨN: Bảng đích contents_categories tồn tại rõ ràng trong schema này — khai báo REFERENCES contents_categories(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "category_alias" varchar(255), -- ← fs_contents.category_alias | Alias của danh mục.
  "category_id_wrapper" varchar(255), -- ← fs_contents.category_id_wrapper | Mã danh mục cha bao ngoài (dùng cho breadcrumb/URL lồng nhau).
  "category_alias_wrapper" varchar(255), -- ← fs_contents.category_alias_wrapper | Alias bao ngoài của danh mục cha.
  "category_published" integer, -- ← fs_contents.category_published | Trạng thái hiển thị của danh mục.
  "image" varchar(255), -- ← fs_contents.image | Đường dẫn ảnh chính.
  "creator" varchar(255), -- ← fs_contents.creator | Người tạo bản ghi.
  "source_website" varchar(255), -- ← fs_contents.source_website | Nguồn website.
  "created_time" timestamptz, -- ← fs_contents.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "updated_time" timestamptz, -- ← fs_contents.updated_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "editor" varchar(255), -- ← fs_contents.editor | Người chỉnh sửa gần nhất.
  "show_in_homepage" boolean, -- ← fs_contents.show_in_homepage | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "hits" integer, -- ← fs_contents.hits | Tổng lượt xem/truy cập.
  "published" boolean, -- ← fs_contents.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer, -- ← fs_contents.ordering | Thứ tự sắp xếp hiển thị.
  "display_title" boolean, -- ← fs_contents.display_title | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "display_column" integer, -- ← fs_contents.display_column | Cột được chọn để hiển thị.
  "tags_group" integer, -- ← fs_contents.tags_group | Nhóm thẻ (tags).
  "rating_count" integer, -- ← fs_contents.rating_count | Số lượt đánh giá.
  "rating_sum" integer, -- ← fs_contents.rating_sum | Tổng điểm đánh giá (dùng để tính điểm trung bình).
  "source" varchar(255), -- ← fs_contents.source | Nguồn dữ liệu/nguồn trích dẫn.
  "show_map" boolean, -- ← fs_contents.show_map | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "author" varchar(255), -- ← fs_contents.author | Tên tác giả nội dung.
  "author_last" varchar(255), -- ← fs_contents.author_last | Tên người chỉnh sửa gần nhất.
  "summary" text, -- ← fs_contents.summary + fs_contents_en.summary | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "category_name" varchar(255), -- ← fs_contents.category_name + fs_contents_en.category_name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "title" varchar(255), -- ← fs_contents.title + fs_contents_en.title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "alias" varchar(255), -- ← fs_contents.alias + fs_contents_en.alias | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "title_display" varchar(255), -- ← fs_contents.title_display + fs_contents_en.title_display | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "keywords" varchar(255), -- ← fs_contents.keywords + fs_contents_en.keywords | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_title" varchar(255), -- ← fs_contents.seo_title + fs_contents_en.seo_title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_keyword" varchar(255), -- ← fs_contents.seo_keyword + fs_contents_en.seo_keyword | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_description" varchar(255), -- ← fs_contents.seo_description + fs_contents_en.seo_description | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "actflg" varchar(1) NULL, -- ← fs_contents.actflg | Giữ để migrate đầy đủ dữ liệu legacy. Cờ trạng thái hoạt động (Active Flag) — trường kỹ thuật kế thừa từ hệ thống khác.
  "ctdusr" varchar(5) NULL, -- ← fs_contents.ctdusr | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: người dùng tạo bản ghi (Created User).
  "ctdwks" varchar(15) NULL, -- ← fs_contents.ctdwks | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: trạm làm việc tạo bản ghi (Created Workstation).
  "ctddtm" timestamptz NULL, -- ← fs_contents.ctddtm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: ngày giờ tạo bản ghi (Created Date-Time).
  "mdfusr" varchar(5) NULL, -- ← fs_contents.mdfusr | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: người chỉnh sửa gần nhất (Modified User).
  "mdfwks" varchar(15) NULL, -- ← fs_contents.mdfwks | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: trạm làm việc chỉnh sửa gần nhất (Modified Workstation).
  "lstmdf" timestamptz NULL, -- ← fs_contents.lstmdf | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: lần chỉnh sửa cuối (Last Modified).
  "cdtpgm" varchar(20) NULL, -- ← fs_contents.cdtpgm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: chương trình tạo bản ghi (Created Program) — thường từ hệ thống cũ.
  "mdfpgm" varchar(20) NULL -- ← fs_contents.mdfpgm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: chương trình chỉnh sửa gần nhất (Modified Program).
);

-- Nội dung trang tĩnh / bài viết CMS (tiếng Anh).
DROP TABLE IF EXISTS "cic_contents_en" CASCADE;
CREATE TABLE "cic_contents_en" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_contents.id / fs_contents_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "content" text, -- ← fs_contents.content · fs_contents_en.content | Nội dung chi tiết (thường là HTML).
  "tags" varchar(255), -- ← fs_contents.tags · fs_contents_en.tags | Thẻ gắn với nội dung (dùng để phân loại/tìm kiếm).
  "category_id" integer, -- ← fs_contents.category_id · fs_contents_en.category_id | ✅ FK CHUẨN: Bảng đích contents_categories_en tồn tại rõ ràng trong schema này — khai báo REFERENCES contents_categories_en(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "category_alias" varchar(255), -- ← fs_contents.category_alias · fs_contents_en.category_alias | Alias của danh mục.
  "category_id_wrapper" varchar(255), -- ← fs_contents.category_id_wrapper · fs_contents_en.category_id_wrapper | Mã danh mục cha bao ngoài (dùng cho breadcrumb/URL lồng nhau).
  "category_alias_wrapper" varchar(255), -- ← fs_contents.category_alias_wrapper · fs_contents_en.category_alias_wrapper | Alias bao ngoài của danh mục cha.
  "category_published" integer, -- ← fs_contents.category_published · fs_contents_en.category_published | Trạng thái hiển thị của danh mục.
  "image" varchar(255), -- ← fs_contents.image · fs_contents_en.image | Đường dẫn ảnh chính.
  "creator" varchar(255), -- ← fs_contents.creator · fs_contents_en.creator | Người tạo bản ghi.
  "source_website" varchar(255), -- ← fs_contents.source_website · fs_contents_en.source_website | Nguồn website.
  "created_time" timestamptz, -- ← fs_contents.created_time · fs_contents_en.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "updated_time" timestamptz, -- ← fs_contents.updated_time · fs_contents_en.updated_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "editor" varchar(255), -- ← fs_contents.editor · fs_contents_en.editor | Người chỉnh sửa gần nhất.
  "show_in_homepage" boolean, -- ← fs_contents.show_in_homepage · fs_contents_en.show_in_homepage | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "hits" integer, -- ← fs_contents.hits · fs_contents_en.hits | Tổng lượt xem/truy cập.
  "published" boolean, -- ← fs_contents.published · fs_contents_en.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer, -- ← fs_contents.ordering · fs_contents_en.ordering | Thứ tự sắp xếp hiển thị.
  "display_title" boolean, -- ← fs_contents.display_title · fs_contents_en.display_title | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "display_column" integer, -- ← fs_contents.display_column · fs_contents_en.display_column | Cột được chọn để hiển thị.
  "tags_group" integer, -- ← fs_contents.tags_group · fs_contents_en.tags_group | Nhóm thẻ (tags).
  "rating_count" integer, -- ← fs_contents.rating_count · fs_contents_en.rating_count | Số lượt đánh giá.
  "rating_sum" integer, -- ← fs_contents.rating_sum · fs_contents_en.rating_sum | Tổng điểm đánh giá (dùng để tính điểm trung bình).
  "source" varchar(255), -- ← fs_contents.source | Nguồn dữ liệu/nguồn trích dẫn.
  "show_map" boolean, -- ← fs_contents.show_map · fs_contents_en.show_map | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "author" varchar(255), -- ← fs_contents.author · fs_contents_en.author | Tên tác giả nội dung.
  "author_last" varchar(255), -- ← fs_contents.author_last · fs_contents_en.author_last | Tên người chỉnh sửa gần nhất.
  "summary" text, -- ← fs_contents.summary + fs_contents_en.summary | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "category_name" varchar(255), -- ← fs_contents.category_name + fs_contents_en.category_name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "title" varchar(255), -- ← fs_contents.title + fs_contents_en.title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "alias" varchar(255), -- ← fs_contents.alias + fs_contents_en.alias | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "title_display" varchar(255), -- ← fs_contents.title_display + fs_contents_en.title_display | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "keywords" varchar(255), -- ← fs_contents.keywords + fs_contents_en.keywords | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_title" varchar(255), -- ← fs_contents.seo_title + fs_contents_en.seo_title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_keyword" varchar(255), -- ← fs_contents.seo_keyword + fs_contents_en.seo_keyword | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_description" varchar(255), -- ← fs_contents.seo_description + fs_contents_en.seo_description | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "actflg" varchar(1) NULL, -- ← fs_contents_en.actflg | Giữ để migrate đầy đủ dữ liệu legacy. Cờ trạng thái hoạt động (Active Flag) — trường kỹ thuật kế thừa từ hệ thống khác.
  "ctdusr" varchar(5) NULL, -- ← fs_contents_en.ctdusr | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: người dùng tạo bản ghi (Created User).
  "ctdwks" varchar(15) NULL, -- ← fs_contents_en.ctdwks | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: trạm làm việc tạo bản ghi (Created Workstation).
  "ctddtm" timestamptz NULL, -- ← fs_contents_en.ctddtm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: ngày giờ tạo bản ghi (Created Date-Time).
  "mdfusr" varchar(5) NULL, -- ← fs_contents_en.mdfusr | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: người chỉnh sửa gần nhất (Modified User).
  "mdfwks" varchar(15) NULL, -- ← fs_contents_en.mdfwks | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: trạm làm việc chỉnh sửa gần nhất (Modified Workstation).
  "lstmdf" timestamptz NULL, -- ← fs_contents_en.lstmdf | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: lần chỉnh sửa cuối (Last Modified).
  "cdtpgm" varchar(20) NULL, -- ← fs_contents_en.cdtpgm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: chương trình tạo bản ghi (Created Program) — thường từ hệ thống cũ.
  "mdfpgm" varchar(20) NULL -- ← fs_contents_en.mdfpgm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: chương trình chỉnh sửa gần nhất (Modified Program).
);

-- Danh mục phân loại nội dung.
DROP TABLE IF EXISTS "cic_contents_categories" CASCADE;
CREATE TABLE "cic_contents_categories" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_contents_categories.id / fs_contents_categories_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "alias_wrapper" varchar(255), -- ← fs_contents_categories.alias_wrapper | Alias bao ngoài, dùng cho việc bọc đường dẫn (ví dụ danh mục cha).
  "old_id" integer, -- ← fs_contents_categories.old_id | Giữ tạm để đối chiếu dữ liệu trong lúc migrate; có thể xoá sau khi xác nhận không còn tham chiếu.
  "old_path" varchar(255), -- ← fs_contents_categories.old_path | Đường dẫn cũ.
  "old_name" varchar(255), -- ← fs_contents_categories.old_name | Tên cũ (trước khi thay đổi/di chuyển dữ liệu).
  "list_parents" varchar(255), -- ← fs_contents_categories.list_parents | Danh sách mã các cấp cha (phân cấp).
  "level" integer NOT NULL, -- ← fs_contents_categories.level | Cấp độ/mức độ phân cấp.
  "published" boolean NOT NULL, -- ← fs_contents_categories.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer, -- ← fs_contents_categories.ordering | Thứ tự sắp xếp hiển thị.
  "image" varchar(255), -- ← fs_contents_categories.image | Đường dẫn ảnh chính.
  "icon" varchar(255), -- ← fs_contents_categories.icon | Đường dẫn/tên biểu tượng (icon).
  "created_time" timestamptz, -- ← fs_contents_categories.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "updated_time" timestamptz, -- ← fs_contents_categories.updated_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "show_in_homepage" boolean NOT NULL, -- ← fs_contents_categories.show_in_homepage | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "display_title" boolean NOT NULL, -- ← fs_contents_categories.display_title | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "display_tags" boolean NOT NULL, -- ← fs_contents_categories.display_tags | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "display_related" boolean NOT NULL, -- ← fs_contents_categories.display_related | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "display_created_time" boolean NOT NULL, -- ← fs_contents_categories.display_created_time | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "display_category" boolean NOT NULL, -- ← fs_contents_categories.display_category | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "display_comment" boolean NOT NULL, -- ← fs_contents_categories.display_comment | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "display_sharing" boolean NOT NULL, -- ← fs_contents_categories.display_sharing | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "name_display" varchar(255), -- ← fs_contents_categories.name_display | Tên hiển thị tùy chỉnh (có thể khác tên gốc).
  "is_comment" boolean NOT NULL, -- ← fs_contents_categories.is_comment | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "parent_id" integer REFERENCES cic_contents_categories(id) ON DELETE SET NULL, -- ← fs_contents_categories.parent_id | Tự tham chiếu (self-reference) — sentinel 0 đã được dọn thành NULL trước khi migrate; cho phép NULL và khai báo REFERENCES contents_categories(id) ON DELETE SET NULL để tránh mồ côi cây phân cấp (0 = gốc không còn ý nghĩa FK hợp lệ trong Postgres).
  "estore_id" integer, -- ← fs_contents_categories.estore_id | ⚠️ THIẾU BẢNG THAM CHIẾU — LEGACY: Store reference. Referenced trong 12 file (chỉ đọc session tại libraries/fsmodels.php:175), không tìm thấy nơi set $_SESSION['estore_id']. Runtime verification required — không FK, không index.
  "category_id" integer, -- ← fs_contents_categories.category_id | ⚠️ THIẾU BẢNG THAM CHIẾU — LEGACY: Không có dữ liệu. Ý nghĩa nghiệp vụ chưa xác định — không FK, không index.
  "name" varchar(255), -- ← fs_contents_categories.name + fs_contents_categories_en.name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "alias" varchar(255), -- ← fs_contents_categories.alias + fs_contents_categories_en.alias | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_title" varchar(255), -- ← fs_contents_categories.seo_title + fs_contents_categories_en.seo_title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_keyword" varchar(255), -- ← fs_contents_categories.seo_keyword + fs_contents_categories_en.seo_keyword | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_description" varchar(255), -- ← fs_contents_categories.seo_description + fs_contents_categories_en.seo_description | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "actflg" varchar(1) NULL, -- ← fs_contents_categories.actflg | Giữ để migrate đầy đủ dữ liệu legacy. Cờ trạng thái hoạt động (Active Flag) — trường kỹ thuật kế thừa từ hệ thống khác.
  "ctdusr" varchar(5) NULL, -- ← fs_contents_categories.ctdusr | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: người dùng tạo bản ghi (Created User).
  "ctdwks" varchar(15) NULL, -- ← fs_contents_categories.ctdwks | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: trạm làm việc tạo bản ghi (Created Workstation).
  "ctddtm" timestamptz NULL, -- ← fs_contents_categories.ctddtm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: ngày giờ tạo bản ghi (Created Date-Time).
  "mdfusr" varchar(5) NULL, -- ← fs_contents_categories.mdfusr | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: người chỉnh sửa gần nhất (Modified User).
  "mdfwks" varchar(15) NULL, -- ← fs_contents_categories.mdfwks | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: trạm làm việc chỉnh sửa gần nhất (Modified Workstation).
  "lstmdf" timestamptz NULL, -- ← fs_contents_categories.lstmdf | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: lần chỉnh sửa cuối (Last Modified).
  "cdtpgm" varchar(20) NULL, -- ← fs_contents_categories.cdtpgm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: chương trình tạo bản ghi (Created Program) — thường từ hệ thống cũ.
  "mdfpgm" varchar(20) NULL -- ← fs_contents_categories.mdfpgm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: chương trình chỉnh sửa gần nhất (Modified Program).
);

-- Danh mục phân loại nội dung.
DROP TABLE IF EXISTS "cic_contents_categories_en" CASCADE;
CREATE TABLE "cic_contents_categories_en" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_contents_categories.id / fs_contents_categories_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "alias_wrapper" varchar(255), -- ← fs_contents_categories.alias_wrapper · fs_contents_categories_en.alias_wrapper | Alias bao ngoài, dùng cho việc bọc đường dẫn (ví dụ danh mục cha).
  "old_id" integer, -- ← fs_contents_categories.old_id · fs_contents_categories_en.old_id | Giữ tạm để đối chiếu dữ liệu trong lúc migrate; có thể xoá sau khi xác nhận không còn tham chiếu.
  "old_path" varchar(255), -- ← fs_contents_categories.old_path · fs_contents_categories_en.old_path | Đường dẫn cũ.
  "old_name" varchar(255), -- ← fs_contents_categories.old_name · fs_contents_categories_en.old_name | Tên cũ (trước khi thay đổi/di chuyển dữ liệu).
  "list_parents" varchar(255), -- ← fs_contents_categories.list_parents · fs_contents_categories_en.list_parents | Danh sách mã các cấp cha (phân cấp).
  "level" integer NOT NULL, -- ← fs_contents_categories.level · fs_contents_categories_en.level | Cấp độ/mức độ phân cấp.
  "published" boolean NOT NULL, -- ← fs_contents_categories.published · fs_contents_categories_en.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer, -- ← fs_contents_categories.ordering · fs_contents_categories_en.ordering | Thứ tự sắp xếp hiển thị.
  "image" varchar(255), -- ← fs_contents_categories.image · fs_contents_categories_en.image | Đường dẫn ảnh chính.
  "icon" varchar(255), -- ← fs_contents_categories.icon · fs_contents_categories_en.icon | Đường dẫn/tên biểu tượng (icon).
  "created_time" timestamptz, -- ← fs_contents_categories.created_time · fs_contents_categories_en.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "updated_time" timestamptz, -- ← fs_contents_categories.updated_time · fs_contents_categories_en.updated_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "show_in_homepage" boolean NOT NULL, -- ← fs_contents_categories.show_in_homepage · fs_contents_categories_en.show_in_homepage | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "display_title" boolean NOT NULL, -- ← fs_contents_categories.display_title · fs_contents_categories_en.display_title | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "display_tags" boolean NOT NULL, -- ← fs_contents_categories.display_tags · fs_contents_categories_en.display_tags | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "display_related" boolean NOT NULL, -- ← fs_contents_categories.display_related · fs_contents_categories_en.display_related | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "display_created_time" boolean NOT NULL, -- ← fs_contents_categories.display_created_time · fs_contents_categories_en.display_created_time | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "display_category" boolean NOT NULL, -- ← fs_contents_categories.display_category · fs_contents_categories_en.display_category | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "display_comment" boolean NOT NULL, -- ← fs_contents_categories.display_comment · fs_contents_categories_en.display_comment | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "display_sharing" boolean NOT NULL, -- ← fs_contents_categories.display_sharing · fs_contents_categories_en.display_sharing | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "name_display" varchar(255), -- ← fs_contents_categories.name_display · fs_contents_categories_en.name_display | Tên hiển thị tùy chỉnh (có thể khác tên gốc).
  "is_comment" boolean NOT NULL, -- ← fs_contents_categories.is_comment · fs_contents_categories_en.is_comment | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "parent_id" integer REFERENCES cic_contents_categories_en(id) ON DELETE SET NULL, -- ← fs_contents_categories.parent_id · fs_contents_categories_en.parent_id | Tự tham chiếu (self-reference) — sentinel 0 đã được dọn thành NULL trước khi migrate; cho phép NULL và khai báo REFERENCES contents_categories_en(id) ON DELETE SET NULL để tránh mồ côi cây phân cấp (0 = gốc không còn ý nghĩa FK hợp lệ trong Postgres).
  "estore_id" integer, -- ← fs_contents_categories.estore_id · fs_contents_categories_en.estore_id | ⚠️ THIẾU BẢNG THAM CHIẾU — LEGACY: Store reference. Referenced trong 12 file (chỉ đọc session tại libraries/fsmodels.php:175), không tìm thấy nơi set $_SESSION['estore_id']. Runtime verification required — không FK, không index.
  "category_id" integer, -- ← fs_contents_categories.category_id · fs_contents_categories_en.category_id | ⚠️ THIẾU BẢNG THAM CHIẾU — LEGACY: Không có dữ liệu. Ý nghĩa nghiệp vụ chưa xác định — không FK, không index.
  "name" varchar(255), -- ← fs_contents_categories.name + fs_contents_categories_en.name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "alias" varchar(255), -- ← fs_contents_categories.alias + fs_contents_categories_en.alias | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_title" varchar(255), -- ← fs_contents_categories.seo_title + fs_contents_categories_en.seo_title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_keyword" varchar(255), -- ← fs_contents_categories.seo_keyword + fs_contents_categories_en.seo_keyword | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_description" varchar(255), -- ← fs_contents_categories.seo_description + fs_contents_categories_en.seo_description | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "actflg" varchar(1) NULL, -- ← fs_contents_categories_en.actflg | Giữ để migrate đầy đủ dữ liệu legacy. Cờ trạng thái hoạt động (Active Flag) — trường kỹ thuật kế thừa từ hệ thống khác.
  "ctdusr" varchar(5) NULL, -- ← fs_contents_categories_en.ctdusr | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: người dùng tạo bản ghi (Created User).
  "ctdwks" varchar(15) NULL, -- ← fs_contents_categories_en.ctdwks | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: trạm làm việc tạo bản ghi (Created Workstation).
  "ctddtm" timestamptz NULL, -- ← fs_contents_categories_en.ctddtm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: ngày giờ tạo bản ghi (Created Date-Time).
  "mdfusr" varchar(5) NULL, -- ← fs_contents_categories_en.mdfusr | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: người chỉnh sửa gần nhất (Modified User).
  "mdfwks" varchar(15) NULL, -- ← fs_contents_categories_en.mdfwks | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: trạm làm việc chỉnh sửa gần nhất (Modified Workstation).
  "lstmdf" timestamptz NULL, -- ← fs_contents_categories_en.lstmdf | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: lần chỉnh sửa cuối (Last Modified).
  "cdtpgm" varchar(20) NULL, -- ← fs_contents_categories_en.cdtpgm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: chương trình tạo bản ghi (Created Program) — thường từ hệ thống cũ.
  "mdfpgm" varchar(20) NULL -- ← fs_contents_categories_en.mdfpgm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: chương trình chỉnh sửa gần nhất (Modified Program).
);

-- Tin tức (tiếng Việt).
DROP TABLE IF EXISTS "cic_news" CASCADE;
CREATE TABLE "cic_news" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_news.id / fs_news_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "content" text, -- ← fs_news.content | Nội dung chi tiết (thường là HTML).
  "tags" text, -- ← fs_news.tags | Thẻ gắn với nội dung (dùng để phân loại/tìm kiếm).
  "category_id" integer, -- ← fs_news.category_id | ✅ FK CHUẨN: Bảng đích news_categories tồn tại rõ ràng trong schema này — khai báo REFERENCES news_categories(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "category_alias" varchar(255), -- ← fs_news.category_alias | Alias của danh mục.
  "category_id_wrapper" varchar(255), -- ← fs_news.category_id_wrapper | Mã danh mục cha bao ngoài (dùng cho breadcrumb/URL lồng nhau).
  "category_alias_wrapper" varchar(255), -- ← fs_news.category_alias_wrapper | Alias bao ngoài của danh mục cha.
  "category_published" integer, -- ← fs_news.category_published | Trạng thái hiển thị của danh mục.
  "image" varchar(255), -- ← fs_news.image | Đường dẫn ảnh chính.
  "video" varchar(255), -- ← fs_news.video | Đường dẫn/nội dung video.
  "creator" varchar(255), -- ← fs_news.creator | Người tạo bản ghi.
  "source_website" varchar(255), -- ← fs_news.source_website | Nguồn website.
  "created_time" timestamptz, -- ← fs_news.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "updated_time" timestamptz, -- ← fs_news.updated_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "editor" varchar(255), -- ← fs_news.editor | Người chỉnh sửa gần nhất.
  "show_in_homepage" boolean, -- ← fs_news.show_in_homepage | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_slide" boolean, -- ← fs_news.is_slide | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_new_video" boolean, -- ← fs_news.is_new_video | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_video" boolean, -- ← fs_news.is_video | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "hits" integer NOT NULL, -- ← fs_news.hits | Tổng lượt xem/truy cập.
  "published" boolean, -- ← fs_news.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer, -- ← fs_news.ordering | Thứ tự sắp xếp hiển thị.
  "display_title" boolean NOT NULL, -- ← fs_news.display_title | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "display_column" integer, -- ← fs_news.display_column | Cột được chọn để hiển thị.
  "tags_group" integer, -- ← fs_news.tags_group | Nhóm thẻ (tags).
  "rating_count" integer, -- ← fs_news.rating_count | Số lượt đánh giá.
  "rating_sum" integer, -- ← fs_news.rating_sum | Tổng điểm đánh giá (dùng để tính điểm trung bình).
  "seo_description" text, -- ← fs_news.seo_description | Mô tả SEO (thẻ meta description).
  "is_new" boolean, -- ← fs_news.is_new | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_hot" boolean, -- ← fs_news.is_hot | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "comments_total" integer, -- ← fs_news.comments_total | Tổng số bình luận.
  "comments_unread" integer, -- ← fs_news.comments_unread | Số bình luận chưa đọc.
  "comments_last_time" timestamptz, -- ← fs_news.comments_last_time | Thời điểm bình luận gần nhất.
  "comments_published" integer, -- ← fs_news.comments_published | Trạng thái hiển thị của bình luận.
  "products_related" varchar(255), -- ← fs_news.products_related | Sản phẩm liên quan.
  "action_time" timestamptz, -- ← fs_news.action_time | Thời điểm hành động được thực hiện.
  "action_username" varchar(255), -- ← fs_news.action_username | Tên tài khoản thực hiện hành động.
  "action_name" varchar(255), -- ← fs_news.action_name | Tên hành động (ví dụ: thêm, sửa, xóa) trong nhật ký thao tác.
  "news_related" varchar(255), -- ← fs_news.news_related | Tin tức liên quan.
  "source_news" varchar(255), -- ← fs_news.source_news | Nguồn tin tức.
  "author" varchar(255), -- ← fs_news.author | Tên tác giả nội dung.
  "icon" varchar(255), -- ← fs_news.icon | Đường dẫn/tên biểu tượng (icon).
  "author_last" varchar(255), -- ← fs_news.author_last | Tên người chỉnh sửa gần nhất.
  "start_time" timestamptz, -- ← fs_news.start_time | Thời điểm bắt đầu.
  "end_time" timestamptz, -- ← fs_news.end_time | Thời điểm kết thúc.
  "author_id" integer REFERENCES cic_users(id), -- ← fs_news.author_id | ✅ FK CHUẨN: Bảng đích users tồn tại rõ ràng trong schema này — khai báo REFERENCES users(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "author_last_id" integer REFERENCES cic_users(id), -- ← fs_news.author_last_id | ✅ FK CHUẨN: Bảng đích users tồn tại rõ ràng trong schema này — khai báo REFERENCES users(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "optimal_seo" boolean, -- ← fs_news.optimal_seo | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "file_upload" varchar(255), -- ← fs_news.file_upload | Tệp được tải lên.
  "other_languages1" varchar(255), -- ← fs_news.other_languages1 | Nội dung/thiết lập cho ngôn ngữ khác (bổ sung).
  "tawk_to" text, -- ← fs_news.tawk_to | Mã tích hợp chat trực tuyến Tawk.to.
  "action_id" integer, -- ← fs_news.action_id | ⚠️ THIẾU BẢNG THAM CHIẾU — LEGACY: Không có dữ liệu. Ý nghĩa nghiệp vụ chưa xác định — không FK, không index.
  "summary" text, -- ← fs_news.summary + fs_news_en.summary | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "category_name" varchar(255), -- ← fs_news.category_name + fs_news_en.category_name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "title" varchar(255), -- ← fs_news.title + fs_news_en.title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "alias" varchar(255), -- ← fs_news.alias + fs_news_en.alias | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "title_display" varchar(255), -- ← fs_news.title_display + fs_news_en.title_display | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "keywords" varchar(255), -- ← fs_news.keywords + fs_news_en.keywords | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_title" varchar(255), -- ← fs_news.seo_title + fs_news_en.seo_title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_keyword" varchar(255), -- ← fs_news.seo_keyword + fs_news_en.seo_keyword | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "actflg" varchar(1) NULL, -- ← fs_news.actflg | Giữ để migrate đầy đủ dữ liệu legacy. Cờ trạng thái hoạt động (Active Flag) — trường kỹ thuật kế thừa từ hệ thống khác.
  "ctdusr" varchar(5) NULL, -- ← fs_news.ctdusr | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: người dùng tạo bản ghi (Created User).
  "ctdwks" varchar(15) NULL, -- ← fs_news.ctdwks | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: trạm làm việc tạo bản ghi (Created Workstation).
  "ctddtm" timestamptz NULL, -- ← fs_news.ctddtm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: ngày giờ tạo bản ghi (Created Date-Time).
  "mdfusr" varchar(5) NULL, -- ← fs_news.mdfusr | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: người chỉnh sửa gần nhất (Modified User).
  "mdfwks" varchar(15) NULL, -- ← fs_news.mdfwks | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: trạm làm việc chỉnh sửa gần nhất (Modified Workstation).
  "lstmdf" timestamptz NULL, -- ← fs_news.lstmdf | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: lần chỉnh sửa cuối (Last Modified).
  "cdtpgm" varchar(20) NULL, -- ← fs_news.cdtpgm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: chương trình tạo bản ghi (Created Program) — thường từ hệ thống cũ.
  "mdfpgm" varchar(20) NULL -- ← fs_news.mdfpgm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: chương trình chỉnh sửa gần nhất (Modified Program).
);

-- Tin tức (tiếng Anh).
DROP TABLE IF EXISTS "cic_news_en" CASCADE;
CREATE TABLE "cic_news_en" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_news.id / fs_news_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "content" text, -- ← fs_news.content · fs_news_en.content | Nội dung chi tiết (thường là HTML).
  "tags" text, -- ← fs_news.tags · fs_news_en.tags | Thẻ gắn với nội dung (dùng để phân loại/tìm kiếm).
  "category_id" integer, -- ← fs_news.category_id · fs_news_en.category_id | ✅ FK CHUẨN: Bảng đích news_categories_en tồn tại rõ ràng trong schema này — khai báo REFERENCES news_categories_en(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "category_alias" varchar(255), -- ← fs_news.category_alias · fs_news_en.category_alias | Alias của danh mục.
  "category_id_wrapper" varchar(255), -- ← fs_news.category_id_wrapper · fs_news_en.category_id_wrapper | Mã danh mục cha bao ngoài (dùng cho breadcrumb/URL lồng nhau).
  "category_alias_wrapper" varchar(255), -- ← fs_news.category_alias_wrapper · fs_news_en.category_alias_wrapper | Alias bao ngoài của danh mục cha.
  "category_published" integer, -- ← fs_news.category_published · fs_news_en.category_published | Trạng thái hiển thị của danh mục.
  "image" varchar(255), -- ← fs_news.image · fs_news_en.image | Đường dẫn ảnh chính.
  "video" varchar(255), -- ← fs_news.video · fs_news_en.video | Đường dẫn/nội dung video.
  "creator" varchar(255), -- ← fs_news.creator · fs_news_en.creator | Người tạo bản ghi.
  "source_website" varchar(255), -- ← fs_news.source_website · fs_news_en.source_website | Nguồn website.
  "created_time" timestamptz, -- ← fs_news.created_time · fs_news_en.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "updated_time" timestamptz, -- ← fs_news.updated_time · fs_news_en.updated_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "editor" varchar(255), -- ← fs_news.editor · fs_news_en.editor | Người chỉnh sửa gần nhất.
  "show_in_homepage" boolean, -- ← fs_news.show_in_homepage · fs_news_en.show_in_homepage | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_slide" boolean, -- ← fs_news.is_slide · fs_news_en.is_slide | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_new_video" boolean, -- ← fs_news.is_new_video · fs_news_en.is_new_video | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_video" boolean, -- ← fs_news.is_video · fs_news_en.is_video | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "hits" integer NOT NULL, -- ← fs_news.hits · fs_news_en.hits | Tổng lượt xem/truy cập.
  "published" boolean, -- ← fs_news.published · fs_news_en.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer, -- ← fs_news.ordering · fs_news_en.ordering | Thứ tự sắp xếp hiển thị.
  "display_title" boolean NOT NULL, -- ← fs_news.display_title · fs_news_en.display_title | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "display_column" integer, -- ← fs_news.display_column · fs_news_en.display_column | Cột được chọn để hiển thị.
  "tags_group" integer, -- ← fs_news.tags_group · fs_news_en.tags_group | Nhóm thẻ (tags).
  "rating_count" integer, -- ← fs_news.rating_count · fs_news_en.rating_count | Số lượt đánh giá.
  "rating_sum" integer, -- ← fs_news.rating_sum · fs_news_en.rating_sum | Tổng điểm đánh giá (dùng để tính điểm trung bình).
  "seo_description" text, -- ← fs_news.seo_description · fs_news_en.seo_description | Mô tả SEO (thẻ meta description).
  "is_new" boolean, -- ← fs_news.is_new | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_hot" boolean, -- ← fs_news.is_hot · fs_news_en.is_hot | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "comments_total" integer, -- ← fs_news.comments_total · fs_news_en.comments_total | Tổng số bình luận.
  "comments_unread" integer, -- ← fs_news.comments_unread · fs_news_en.comments_unread | Số bình luận chưa đọc.
  "comments_last_time" timestamptz, -- ← fs_news.comments_last_time · fs_news_en.comments_last_time | Thời điểm bình luận gần nhất.
  "comments_published" integer, -- ← fs_news.comments_published · fs_news_en.comments_published | Trạng thái hiển thị của bình luận.
  "products_related" varchar(255), -- ← fs_news.products_related · fs_news_en.products_related | Sản phẩm liên quan.
  "action_time" timestamptz, -- ← fs_news.action_time · fs_news_en.action_time | Thời điểm hành động được thực hiện.
  "action_username" varchar(255), -- ← fs_news.action_username · fs_news_en.action_username | Tên tài khoản thực hiện hành động.
  "action_name" varchar(255), -- ← fs_news.action_name · fs_news_en.action_name | Tên hành động (ví dụ: thêm, sửa, xóa) trong nhật ký thao tác.
  "news_related" varchar(255), -- ← fs_news.news_related · fs_news_en.news_related | Tin tức liên quan.
  "source_news" varchar(255), -- ← fs_news.source_news · fs_news_en.source_news | Nguồn tin tức.
  "author" varchar(255), -- ← fs_news.author · fs_news_en.author | Tên tác giả nội dung.
  "icon" varchar(255), -- ← fs_news.icon · fs_news_en.icon | Đường dẫn/tên biểu tượng (icon).
  "author_last" varchar(255), -- ← fs_news.author_last · fs_news_en.author_last | Tên người chỉnh sửa gần nhất.
  "start_time" timestamptz, -- ← fs_news.start_time · fs_news_en.start_time | Thời điểm bắt đầu.
  "end_time" timestamptz, -- ← fs_news.end_time · fs_news_en.end_time | Thời điểm kết thúc.
  "author_id" integer REFERENCES cic_users(id), -- ← fs_news.author_id · fs_news_en.author_id | ✅ FK CHUẨN: Bảng đích users tồn tại rõ ràng trong schema này — khai báo REFERENCES users(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "author_last_id" integer REFERENCES cic_users(id), -- ← fs_news.author_last_id · fs_news_en.author_last_id | ✅ FK CHUẨN: Bảng đích users tồn tại rõ ràng trong schema này — khai báo REFERENCES users(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "optimal_seo" boolean, -- ← fs_news.optimal_seo · fs_news_en.optimal_seo | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "file_upload" varchar(255), -- ← fs_news.file_upload · fs_news_en.file_upload | Tệp được tải lên.
  "other_languages1" varchar(255), -- ← fs_news.other_languages1 · fs_news_en.other_languages1 | Nội dung/thiết lập cho ngôn ngữ khác (bổ sung).
  "tawk_to" text, -- ← fs_news.tawk_to · fs_news_en.tawk_to | Mã tích hợp chat trực tuyến Tawk.to.
  "action_id" integer, -- ← fs_news.action_id · fs_news_en.action_id | ⚠️ THIẾU BẢNG THAM CHIẾU — LEGACY: Không có dữ liệu. Ý nghĩa nghiệp vụ chưa xác định — không FK, không index.
  "summary" text, -- ← fs_news.summary + fs_news_en.summary | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "category_name" varchar(255), -- ← fs_news.category_name + fs_news_en.category_name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "title" varchar(255), -- ← fs_news.title + fs_news_en.title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "alias" varchar(255), -- ← fs_news.alias + fs_news_en.alias | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "title_display" varchar(255), -- ← fs_news.title_display + fs_news_en.title_display | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "keywords" varchar(255), -- ← fs_news.keywords + fs_news_en.keywords | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_title" varchar(255), -- ← fs_news.seo_title + fs_news_en.seo_title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_keyword" varchar(255), -- ← fs_news.seo_keyword + fs_news_en.seo_keyword | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "actflg" varchar(1) NULL, -- ← fs_news_en.actflg | Giữ để migrate đầy đủ dữ liệu legacy. Cờ trạng thái hoạt động (Active Flag) — trường kỹ thuật kế thừa từ hệ thống khác.
  "ctdusr" varchar(5) NULL, -- ← fs_news_en.ctdusr | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: người dùng tạo bản ghi (Created User).
  "ctdwks" varchar(15) NULL, -- ← fs_news_en.ctdwks | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: trạm làm việc tạo bản ghi (Created Workstation).
  "ctddtm" timestamptz NULL, -- ← fs_news_en.ctddtm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: ngày giờ tạo bản ghi (Created Date-Time).
  "mdfusr" varchar(5) NULL, -- ← fs_news_en.mdfusr | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: người chỉnh sửa gần nhất (Modified User).
  "mdfwks" varchar(15) NULL, -- ← fs_news_en.mdfwks | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: trạm làm việc chỉnh sửa gần nhất (Modified Workstation).
  "lstmdf" timestamptz NULL, -- ← fs_news_en.lstmdf | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: lần chỉnh sửa cuối (Last Modified).
  "cdtpgm" varchar(20) NULL, -- ← fs_news_en.cdtpgm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: chương trình tạo bản ghi (Created Program) — thường từ hệ thống cũ.
  "mdfpgm" varchar(20) NULL -- ← fs_news_en.mdfpgm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: chương trình chỉnh sửa gần nhất (Modified Program).
);

-- Danh mục tin tức.
DROP TABLE IF EXISTS "cic_news_categories" CASCADE;
CREATE TABLE "cic_news_categories" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_news_categories.id / fs_news_categories_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "alias_wrapper" varchar(255), -- ← fs_news_categories.alias_wrapper | Alias bao ngoài, dùng cho việc bọc đường dẫn (ví dụ danh mục cha).
  "parent_id" integer REFERENCES cic_news_categories(id) ON DELETE SET NULL, -- ← fs_news_categories.parent_id | Tự tham chiếu (self-reference) — sentinel 0 đã được dọn thành NULL trước khi migrate; cho phép NULL và khai báo REFERENCES news_categories(id) ON DELETE SET NULL để tránh mồ côi cây phân cấp (0 = gốc không còn ý nghĩa FK hợp lệ trong Postgres).
  "list_parents" varchar(255), -- ← fs_news_categories.list_parents | Danh sách mã các cấp cha (phân cấp).
  "level" integer NOT NULL, -- ← fs_news_categories.level | Cấp độ/mức độ phân cấp.
  "published" boolean NOT NULL, -- ← fs_news_categories.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer, -- ← fs_news_categories.ordering | Thứ tự sắp xếp hiển thị.
  "image" varchar(255), -- ← fs_news_categories.image | Đường dẫn ảnh chính.
  "icon" varchar(255), -- ← fs_news_categories.icon | Đường dẫn/tên biểu tượng (icon).
  "created_time" timestamptz, -- ← fs_news_categories.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "updated_time" timestamptz, -- ← fs_news_categories.updated_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "show_in_homepage" boolean NOT NULL, -- ← fs_news_categories.show_in_homepage | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "display_title" boolean NOT NULL, -- ← fs_news_categories.display_title | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "display_tags" boolean NOT NULL, -- ← fs_news_categories.display_tags | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "display_related" boolean NOT NULL, -- ← fs_news_categories.display_related | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "display_created_time" boolean NOT NULL, -- ← fs_news_categories.display_created_time | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "display_category" boolean NOT NULL, -- ← fs_news_categories.display_category | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "display_comment" boolean NOT NULL, -- ← fs_news_categories.display_comment | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "display_sharing" boolean NOT NULL, -- ← fs_news_categories.display_sharing | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "name_display" varchar(255), -- ← fs_news_categories.name_display | Tên hiển thị tùy chỉnh (có thể khác tên gốc).
  "is_comment" boolean, -- ← fs_news_categories.is_comment | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "display_summary" boolean, -- ← fs_news_categories.display_summary | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "products_related" varchar(255), -- ← fs_news_categories.products_related | Sản phẩm liên quan.
  "icon_font" varchar(255), -- ← fs_news_categories.icon_font | Mã icon font chữ (ví dụ FontAwesome).
  "estore_id" integer, -- ← fs_news_categories.estore_id | ⚠️ THIẾU BẢNG THAM CHIẾU — LEGACY: Store reference. Referenced trong 12 file (chỉ đọc session tại libraries/fsmodels.php:175), không tìm thấy nơi set $_SESSION['estore_id']. Runtime verification required — không FK, không index.
  "category_id" integer, -- ← fs_news_categories.category_id | ⚠️ THIẾU BẢNG THAM CHIẾU — LEGACY: Không có dữ liệu. Ý nghĩa nghiệp vụ chưa xác định — không FK, không index.
  "name" varchar(255), -- ← fs_news_categories.name + fs_news_categories_en.name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "alias" varchar(255), -- ← fs_news_categories.alias + fs_news_categories_en.alias | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_title" varchar(255), -- ← fs_news_categories.seo_title + fs_news_categories_en.seo_title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_keyword" varchar(255), -- ← fs_news_categories.seo_keyword + fs_news_categories_en.seo_keyword | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_description" varchar(255), -- ← fs_news_categories.seo_description + fs_news_categories_en.seo_description | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "summary" varchar(255), -- ← fs_news_categories.summary + fs_news_categories_en.summary | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "title" varchar(255), -- ← fs_news_categories.title + fs_news_categories_en.title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "actflg" varchar(1) NULL, -- ← fs_news_categories.actflg | Giữ để migrate đầy đủ dữ liệu legacy. Cờ trạng thái hoạt động (Active Flag) — trường kỹ thuật kế thừa từ hệ thống khác.
  "ctdusr" varchar(5) NULL, -- ← fs_news_categories.ctdusr | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: người dùng tạo bản ghi (Created User).
  "ctdwks" varchar(15) NULL, -- ← fs_news_categories.ctdwks | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: trạm làm việc tạo bản ghi (Created Workstation).
  "ctddtm" timestamptz NULL, -- ← fs_news_categories.ctddtm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: ngày giờ tạo bản ghi (Created Date-Time).
  "mdfusr" varchar(5) NULL, -- ← fs_news_categories.mdfusr | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: người chỉnh sửa gần nhất (Modified User).
  "mdfwks" varchar(15) NULL, -- ← fs_news_categories.mdfwks | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: trạm làm việc chỉnh sửa gần nhất (Modified Workstation).
  "lstmdf" timestamptz NULL, -- ← fs_news_categories.lstmdf | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: lần chỉnh sửa cuối (Last Modified).
  "cdtpgm" varchar(20) NULL, -- ← fs_news_categories.cdtpgm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: chương trình tạo bản ghi (Created Program) — thường từ hệ thống cũ.
  "mdfpgm" varchar(20) NULL -- ← fs_news_categories.mdfpgm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: chương trình chỉnh sửa gần nhất (Modified Program).
);

-- Danh mục tin tức.
DROP TABLE IF EXISTS "cic_news_categories_en" CASCADE;
CREATE TABLE "cic_news_categories_en" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_news_categories.id / fs_news_categories_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "alias_wrapper" varchar(255), -- ← fs_news_categories.alias_wrapper · fs_news_categories_en.alias_wrapper | Alias bao ngoài, dùng cho việc bọc đường dẫn (ví dụ danh mục cha).
  "parent_id" integer REFERENCES cic_news_categories_en(id) ON DELETE SET NULL, -- ← fs_news_categories.parent_id · fs_news_categories_en.parent_id | Tự tham chiếu (self-reference) — sentinel 0 đã được dọn thành NULL trước khi migrate; cho phép NULL và khai báo REFERENCES news_categories_en(id) ON DELETE SET NULL để tránh mồ côi cây phân cấp (0 = gốc không còn ý nghĩa FK hợp lệ trong Postgres).
  "list_parents" varchar(255), -- ← fs_news_categories.list_parents · fs_news_categories_en.list_parents | Danh sách mã các cấp cha (phân cấp).
  "level" integer NOT NULL, -- ← fs_news_categories.level · fs_news_categories_en.level | Cấp độ/mức độ phân cấp.
  "published" boolean NOT NULL, -- ← fs_news_categories.published · fs_news_categories_en.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer, -- ← fs_news_categories.ordering · fs_news_categories_en.ordering | Thứ tự sắp xếp hiển thị.
  "image" varchar(255), -- ← fs_news_categories.image · fs_news_categories_en.image | Đường dẫn ảnh chính.
  "icon" varchar(255), -- ← fs_news_categories.icon · fs_news_categories_en.icon | Đường dẫn/tên biểu tượng (icon).
  "created_time" timestamptz, -- ← fs_news_categories.created_time · fs_news_categories_en.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "updated_time" timestamptz, -- ← fs_news_categories.updated_time · fs_news_categories_en.updated_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "show_in_homepage" boolean NOT NULL, -- ← fs_news_categories.show_in_homepage · fs_news_categories_en.show_in_homepage | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "display_title" boolean NOT NULL, -- ← fs_news_categories.display_title · fs_news_categories_en.display_title | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "display_tags" boolean NOT NULL, -- ← fs_news_categories.display_tags · fs_news_categories_en.display_tags | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "display_related" boolean NOT NULL, -- ← fs_news_categories.display_related · fs_news_categories_en.display_related | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "display_created_time" boolean NOT NULL, -- ← fs_news_categories.display_created_time · fs_news_categories_en.display_created_time | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "display_category" boolean NOT NULL, -- ← fs_news_categories.display_category · fs_news_categories_en.display_category | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "display_comment" boolean NOT NULL, -- ← fs_news_categories.display_comment · fs_news_categories_en.display_comment | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "display_sharing" boolean NOT NULL, -- ← fs_news_categories.display_sharing · fs_news_categories_en.display_sharing | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "name_display" varchar(255), -- ← fs_news_categories.name_display · fs_news_categories_en.name_display | Tên hiển thị tùy chỉnh (có thể khác tên gốc).
  "is_comment" boolean, -- ← fs_news_categories.is_comment · fs_news_categories_en.is_comment | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "display_summary" boolean, -- ← fs_news_categories.display_summary · fs_news_categories_en.display_summary | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "products_related" varchar(255), -- ← fs_news_categories.products_related · fs_news_categories_en.products_related | Sản phẩm liên quan.
  "icon_font" varchar(255), -- ← fs_news_categories.icon_font · fs_news_categories_en.icon_font | Mã icon font chữ (ví dụ FontAwesome).
  "estore_id" integer, -- ← fs_news_categories.estore_id · fs_news_categories_en.estore_id | ⚠️ THIẾU BẢNG THAM CHIẾU — LEGACY: Store reference. Referenced trong 12 file (chỉ đọc session tại libraries/fsmodels.php:175), không tìm thấy nơi set $_SESSION['estore_id']. Runtime verification required — không FK, không index.
  "category_id" integer, -- ← fs_news_categories.category_id · fs_news_categories_en.category_id | ⚠️ THIẾU BẢNG THAM CHIẾU — LEGACY: Không có dữ liệu. Ý nghĩa nghiệp vụ chưa xác định — không FK, không index.
  "name" varchar(255), -- ← fs_news_categories.name + fs_news_categories_en.name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "alias" varchar(255), -- ← fs_news_categories.alias + fs_news_categories_en.alias | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_title" varchar(255), -- ← fs_news_categories.seo_title + fs_news_categories_en.seo_title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_keyword" varchar(255), -- ← fs_news_categories.seo_keyword + fs_news_categories_en.seo_keyword | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_description" varchar(255), -- ← fs_news_categories.seo_description + fs_news_categories_en.seo_description | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "summary" varchar(255), -- ← fs_news_categories.summary + fs_news_categories_en.summary | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "title" varchar(255), -- ← fs_news_categories.title + fs_news_categories_en.title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "actflg" varchar(1) NULL, -- ← fs_news_categories_en.actflg | Giữ để migrate đầy đủ dữ liệu legacy. Cờ trạng thái hoạt động (Active Flag) — trường kỹ thuật kế thừa từ hệ thống khác.
  "ctdusr" varchar(5) NULL, -- ← fs_news_categories_en.ctdusr | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: người dùng tạo bản ghi (Created User).
  "ctdwks" varchar(15) NULL, -- ← fs_news_categories_en.ctdwks | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: trạm làm việc tạo bản ghi (Created Workstation).
  "ctddtm" timestamptz NULL, -- ← fs_news_categories_en.ctddtm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: ngày giờ tạo bản ghi (Created Date-Time).
  "mdfusr" varchar(5) NULL, -- ← fs_news_categories_en.mdfusr | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: người chỉnh sửa gần nhất (Modified User).
  "mdfwks" varchar(15) NULL, -- ← fs_news_categories_en.mdfwks | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: trạm làm việc chỉnh sửa gần nhất (Modified Workstation).
  "lstmdf" timestamptz NULL, -- ← fs_news_categories_en.lstmdf | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: lần chỉnh sửa cuối (Last Modified).
  "cdtpgm" varchar(20) NULL, -- ← fs_news_categories_en.cdtpgm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: chương trình tạo bản ghi (Created Program) — thường từ hệ thống cũ.
  "mdfpgm" varchar(20) NULL -- ← fs_news_categories_en.mdfpgm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: chương trình chỉnh sửa gần nhất (Modified Program).
);

-- Từ khóa gắn với từng bài tin tức (SEO/tìm kiếm liên quan).
DROP TABLE IF EXISTS "cic_news_keyword" CASCADE;
CREATE TABLE "cic_news_keyword" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_news_keyword.id | Khoá chính tự tăng, dùng identity thay AUTO_INCREMENT.
  "new_id" varchar(255), -- ← fs_news_keyword.new_id | 🔧 CẦN ÉP KIỂU trước khi gắn FK — Bảng đích news.id tồn tại rõ ràng (không thiếu bảng), nhưng cột này đang là VARCHAR trong khi news(id) là INTEGER — không thể khai báo REFERENCES trực tiếp do lệch kiểu dữ liệu. Cần kiểm tra dữ liệu thật (có rác/non-numeric không) rồi ép kiểu sang integer (theo đúng mẫu đã làm với products.types_id) trước khi thêm REFERENCES news(id).
  "name" varchar(255), -- ← fs_news_keyword.name | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "name_replace" varchar(255), -- ← fs_news_keyword.name_replace | Tên dùng để thay thế khi hiển thị.
  "link_replace" text, -- ← fs_news_keyword.link_replace | Liên kết thay thế.
  "type" integer, -- ← fs_news_keyword.type | Loại/phân loại của bản ghi.
  "type_link" integer, -- ← fs_news_keyword.type_link | Loại liên kết.
  "new_title" varchar(255), -- ← fs_news_keyword.new_title | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "new_image" varchar(500), -- ← fs_news_keyword.new_image | Ảnh mới.
  "created_time" timestamptz, -- ← fs_news_keyword.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "edited_time" timestamptz -- ← fs_news_keyword.edited_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
);

-- Danh mục từ khóa dùng chung trong hệ thống.
DROP TABLE IF EXISTS "cic_keywords" CASCADE;
CREATE TABLE "cic_keywords" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_keywords.id | Khoá chính tự tăng, dùng identity thay AUTO_INCREMENT.
  "name" varchar(255) NOT NULL, -- ← fs_keywords.name | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "alias" varchar(255), -- ← fs_keywords.alias | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "published" boolean NOT NULL, -- ← fs_keywords.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer NOT NULL, -- ← fs_keywords.ordering | Thứ tự sắp xếp hiển thị.
  "created_time" timestamptz, -- ← fs_keywords.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "edited_time" timestamptz, -- ← fs_keywords.edited_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "is_home" boolean NOT NULL, -- ← fs_keywords.is_home | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "link" varchar(255) -- ← fs_keywords.link | Đường dẫn liên kết.
);

-- Sự kiện (tiếng Việt).
DROP TABLE IF EXISTS "cic_event" CASCADE;
CREATE TABLE "cic_event" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_event.id / fs_event_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "content" text, -- ← fs_event.content | Nội dung chi tiết (thường là HTML).
  "tags" varchar(255), -- ← fs_event.tags | Thẻ gắn với nội dung (dùng để phân loại/tìm kiếm).
  "category_alias" varchar(255), -- ← fs_event.category_alias | Alias của danh mục.
  "category_id_wrapper" varchar(255), -- ← fs_event.category_id_wrapper | Mã danh mục cha bao ngoài (dùng cho breadcrumb/URL lồng nhau).
  "category_alias_wrapper" varchar(255), -- ← fs_event.category_alias_wrapper | Alias bao ngoài của danh mục cha.
  "category_published" integer, -- ← fs_event.category_published | Trạng thái hiển thị của danh mục.
  "image" varchar(255), -- ← fs_event.image | Đường dẫn ảnh chính.
  "created_time" timestamptz, -- ← fs_event.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "updated_time" timestamptz, -- ← fs_event.updated_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "editor" varchar(255), -- ← fs_event.editor | Người chỉnh sửa gần nhất.
  "show_in_homepage" boolean, -- ← fs_event.show_in_homepage | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "published" boolean, -- ← fs_event.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer, -- ← fs_event.ordering | Thứ tự sắp xếp hiển thị.
  "seo_description" text, -- ← fs_event.seo_description | Mô tả SEO (thẻ meta description).
  "is_new" boolean, -- ← fs_event.is_new | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_hot" boolean, -- ← fs_event.is_hot | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "author" varchar(255), -- ← fs_event.author | Tên tác giả nội dung.
  "author_last" varchar(255), -- ← fs_event.author_last | Tên người chỉnh sửa gần nhất.
  "author_id" integer REFERENCES cic_users(id), -- ← fs_event.author_id | ✅ FK CHUẨN: Bảng đích users tồn tại rõ ràng trong schema này — khai báo REFERENCES users(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "author_last_id" integer REFERENCES cic_users(id), -- ← fs_event.author_last_id | ✅ FK CHUẨN: Bảng đích users tồn tại rõ ràng trong schema này — khai báo REFERENCES users(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "optimal_seo" boolean, -- ← fs_event.optimal_seo | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "place" varchar(255), -- ← fs_event.place | Vị trí hiển thị.
  "event_related" varchar(255), -- ← fs_event.event_related | Sự kiện liên quan.
  "end_time" timestamptz, -- ← fs_event.end_time | Thời điểm kết thúc.
  "time_event" timestamptz, -- ← fs_event.time_event | Thời gian diễn ra sự kiện.
  "link_dangky" varchar(255), -- ← fs_event.link_dangky | Liên kết đăng ký.
  "news_related" varchar(255), -- ← fs_event.news_related | Tin tức liên quan.
  "products_related" varchar(255), -- ← fs_event.products_related | Sản phẩm liên quan.
  "specific_time" varchar(255), -- ← fs_event.specific_time | Thời điểm cụ thể.
  "chu_de" varchar(255), -- ← fs_event.chu_de | Chủ đề nội dung.
  "show_in_home" boolean, -- ← fs_event.show_in_home | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "tawk_to" text, -- ← fs_event.tawk_to | Mã tích hợp chat trực tuyến Tawk.to.
  "category_id" integer, -- ← fs_event.category_id | ⚠️ THIẾU BẢNG THAM CHIẾU — LEGACY: Không có dữ liệu. Ý nghĩa nghiệp vụ chưa xác định — không FK, không index.
  "parent_id" integer, -- ← fs_event.parent_id | ⚠️ THIẾU BẢNG THAM CHIẾU — LEGACY: Không có dữ liệu. Ý nghĩa nghiệp vụ chưa xác định — không FK, không index.
  "summary" text, -- ← fs_event.summary + fs_event_en.summary | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "category_name" varchar(255), -- ← fs_event.category_name + fs_event_en.category_name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "title" varchar(255), -- ← fs_event.title + fs_event_en.title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "alias" varchar(255), -- ← fs_event.alias + fs_event_en.alias | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "keywords" varchar(255), -- ← fs_event.keywords + fs_event_en.keywords | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_title" varchar(255), -- ← fs_event.seo_title + fs_event_en.seo_title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_keyword" varchar(255), -- ← fs_event.seo_keyword + fs_event_en.seo_keyword | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "name" varchar(255) -- ← fs_event.name + fs_event_en.name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
);

-- Sự kiện (tiếng Anh).
DROP TABLE IF EXISTS "cic_event_en" CASCADE;
CREATE TABLE "cic_event_en" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_event.id / fs_event_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "content" text, -- ← fs_event.content · fs_event_en.content | Nội dung chi tiết (thường là HTML).
  "tags" varchar(255), -- ← fs_event.tags · fs_event_en.tags | Thẻ gắn với nội dung (dùng để phân loại/tìm kiếm).
  "category_alias" varchar(255), -- ← fs_event.category_alias · fs_event_en.category_alias | Alias của danh mục.
  "category_id_wrapper" varchar(255), -- ← fs_event.category_id_wrapper · fs_event_en.category_id_wrapper | Mã danh mục cha bao ngoài (dùng cho breadcrumb/URL lồng nhau).
  "category_alias_wrapper" varchar(255), -- ← fs_event.category_alias_wrapper · fs_event_en.category_alias_wrapper | Alias bao ngoài của danh mục cha.
  "category_published" integer, -- ← fs_event.category_published · fs_event_en.category_published | Trạng thái hiển thị của danh mục.
  "image" varchar(255), -- ← fs_event.image · fs_event_en.image | Đường dẫn ảnh chính.
  "created_time" timestamptz, -- ← fs_event.created_time · fs_event_en.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "updated_time" timestamptz, -- ← fs_event.updated_time · fs_event_en.updated_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "editor" varchar(255), -- ← fs_event.editor · fs_event_en.editor | Người chỉnh sửa gần nhất.
  "show_in_homepage" boolean, -- ← fs_event.show_in_homepage · fs_event_en.show_in_homepage | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "published" boolean, -- ← fs_event.published · fs_event_en.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer, -- ← fs_event.ordering · fs_event_en.ordering | Thứ tự sắp xếp hiển thị.
  "seo_description" text, -- ← fs_event.seo_description · fs_event_en.seo_description | Mô tả SEO (thẻ meta description).
  "is_new" boolean, -- ← fs_event.is_new · fs_event_en.is_new | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_hot" boolean, -- ← fs_event.is_hot · fs_event_en.is_hot | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "author" varchar(255), -- ← fs_event.author · fs_event_en.author | Tên tác giả nội dung.
  "author_last" varchar(255), -- ← fs_event.author_last · fs_event_en.author_last | Tên người chỉnh sửa gần nhất.
  "author_id" integer REFERENCES cic_users(id), -- ← fs_event.author_id · fs_event_en.author_id | ✅ FK CHUẨN: Bảng đích users tồn tại rõ ràng trong schema này — khai báo REFERENCES users(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "author_last_id" integer REFERENCES cic_users(id), -- ← fs_event.author_last_id · fs_event_en.author_last_id | ✅ FK CHUẨN: Bảng đích users tồn tại rõ ràng trong schema này — khai báo REFERENCES users(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "optimal_seo" boolean, -- ← fs_event.optimal_seo · fs_event_en.optimal_seo | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "place" varchar(255), -- ← fs_event.place · fs_event_en.place | Vị trí hiển thị.
  "event_related" varchar(255), -- ← fs_event.event_related · fs_event_en.event_related | Sự kiện liên quan.
  "end_time" timestamptz, -- ← fs_event.end_time · fs_event_en.end_time | Thời điểm kết thúc.
  "time_event" timestamptz, -- ← fs_event.time_event · fs_event_en.time_event | Thời gian diễn ra sự kiện.
  "link_dangky" varchar(255), -- ← fs_event.link_dangky · fs_event_en.link_dangky | Liên kết đăng ký.
  "news_related" varchar(255), -- ← fs_event.news_related · fs_event_en.news_related | Tin tức liên quan.
  "products_related" varchar(255), -- ← fs_event.products_related · fs_event_en.products_related | Sản phẩm liên quan.
  "specific_time" varchar(255), -- ← fs_event.specific_time · fs_event_en.specific_time | Thời điểm cụ thể.
  "chu_de" varchar(255), -- ← fs_event.chu_de · fs_event_en.chu_de | Chủ đề nội dung.
  "show_in_home" boolean, -- ← fs_event.show_in_home | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "tawk_to" text, -- ← fs_event.tawk_to · fs_event_en.tawk_to | Mã tích hợp chat trực tuyến Tawk.to.
  "category_id" integer, -- ← fs_event.category_id · fs_event_en.category_id | ⚠️ THIẾU BẢNG THAM CHIẾU — LEGACY: Không có dữ liệu. Ý nghĩa nghiệp vụ chưa xác định — không FK, không index.
  "parent_id" integer, -- ← fs_event.parent_id · fs_event_en.parent_id | ⚠️ THIẾU BẢNG THAM CHIẾU — LEGACY: Không có dữ liệu. Ý nghĩa nghiệp vụ chưa xác định — không FK, không index.
  "summary" text, -- ← fs_event.summary + fs_event_en.summary | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "category_name" varchar(255), -- ← fs_event.category_name + fs_event_en.category_name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "title" varchar(255), -- ← fs_event.title + fs_event_en.title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "alias" varchar(255), -- ← fs_event.alias + fs_event_en.alias | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "keywords" varchar(255), -- ← fs_event.keywords + fs_event_en.keywords | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_title" varchar(255), -- ← fs_event.seo_title + fs_event_en.seo_title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_keyword" varchar(255), -- ← fs_event.seo_keyword + fs_event_en.seo_keyword | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "name" varchar(255) -- ← fs_event.name + fs_event_en.name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
);

-- Sản phẩm (tiếng Việt) - thông tin chính của catalogue sản phẩm.
DROP TABLE IF EXISTS "cic_products" CASCADE;
CREATE TABLE "cic_products" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_products.id / fs_products_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "code" varchar(255), -- ← fs_products.code | Mã định danh dạng chuỗi (mã code) của đối tượng.
  "category_id" varchar(255), -- ← fs_products.category_id | ⚠ QUAN HỆ N-N — 274/274 dòng chứa CSV (VD: ',62,63,'), KHÔNG được ép kiểu integer/FK. Giữ nguyên varchar để tương thích ngược, nhưng quan hệ thật đã được chuẩn hoá sang bảng trung gian products_categories_rel (xem bên dưới) — dùng bảng đó cho mọi truy vấn/ràng buộc mới.
  "category_id_wrapper" varchar(255), -- ← fs_products.category_id_wrapper | Mã danh mục cha bao ngoài (dùng cho breadcrumb/URL lồng nhau).
  "category_root_alias" varchar(255), -- ← fs_products.category_root_alias | Alias của danh mục gốc (cấp cao nhất).
  "category_alias" varchar(255), -- ← fs_products.category_alias | Alias của danh mục.
  "category_alias_wrapper" varchar(255), -- ← fs_products.category_alias_wrapper | Alias bao ngoài của danh mục cha.
  "category_published" boolean, -- ← fs_products.category_published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "description" text, -- ← fs_products.description | Mô tả chi tiết.
  "image" varchar(255), -- ← fs_products.image | Đường dẫn ảnh chính.
  "video" text, -- ← fs_products.video | Đường dẫn/nội dung video.
  "manufactory" varchar(255), -- ← fs_products.manufactory | Nhà sản xuất.
  "manufactory_alias" varchar(255), -- ← fs_products.manufactory_alias | Alias của nhà sản xuất.
  "manufactory_name" varchar(255), -- ← fs_products.manufactory_name | Tên nhà sản xuất.
  "price" varchar(255), -- ← fs_products.price | Giá bán.
  "price_old" varchar(255), -- ← fs_products.price_old | Giá cũ (giá gốc trước khuyến mãi).
  "discount" double precision, -- ← fs_products.discount | Giá trị giảm giá.
  "currency" varchar(50), -- ← fs_products.currency | Đơn vị tiền tệ.
  "created_time" timestamptz, -- ← fs_products.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "edited_time" timestamptz, -- ← fs_products.edited_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "published" boolean, -- ← fs_products.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer, -- ← fs_products.ordering | Thứ tự sắp xếp hiển thị.
  "hits" integer NOT NULL, -- ← fs_products.hits | Tổng lượt xem/truy cập.
  "tags" varchar(255), -- ← fs_products.tags | Thẻ gắn với nội dung (dùng để phân loại/tìm kiếm).
  "types" varchar(255), -- ← fs_products.types | Danh sách loại/phân loại.
  "status" varchar(255), -- ← fs_products.status | Trạng thái của bản ghi.
  "show_in_home" boolean NOT NULL, -- ← fs_products.show_in_home | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "date_start" timestamptz, -- ← fs_products.date_start | Ngày bắt đầu.
  "date_end" timestamptz, -- ← fs_products.date_end | Ngày kết thúc.
  "is_hotdeal" boolean, -- ← fs_products.is_hotdeal | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "warranty" integer, -- ← fs_products.warranty | Thông tin bảo hành.
  "is_sell" boolean NOT NULL, -- ← fs_products.is_sell | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_hot" boolean NOT NULL, -- ← fs_products.is_hot | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "rating_count" integer NOT NULL, -- ← fs_products.rating_count | Số lượt đánh giá.
  "is_new" boolean NOT NULL, -- ← fs_products.is_new | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "size_name" varchar(255), -- ← fs_products.size_name | Tên kích thước/quy cách.
  "user_id" integer REFERENCES cic_users(id), -- ← fs_products.user_id | ✅ FK CHUẨN: Bảng đích users tồn tại rõ ràng trong schema này — khai báo REFERENCES users(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "username" varchar(255), -- ← fs_products.username | Tên đăng nhập.
  "user_image" varchar(255), -- ← fs_products.user_image | Ảnh đại diện người dùng.
  "user_full_name" varchar(255), -- ← fs_products.user_full_name | Họ tên đầy đủ của người dùng.
  "link_video" text, -- ← fs_products.link_video | Liên kết video (ví dụ YouTube).
  "is_sale" boolean, -- ← fs_products.is_sale | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_status" boolean, -- ← fs_products.is_status | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "latitude" numeric(9,6), -- ← fs_products.latitude | Đổi từ varchar sang numeric(9,6) để tính toán/toạ độ chính xác, hỗ trợ query khoảng cách (PostGIS) sau này.
  "longitude" numeric(9,6), -- ← fs_products.longitude | Đổi từ varchar sang numeric(9,6) để tính toán/toạ độ chính xác, hỗ trợ query khoảng cách (PostGIS) sau này.
  "city_id" integer REFERENCES cic_cities(id), -- ← fs_products.city_id | ✅ FK CHUẨN: Bảng đích cities tồn tại rõ ràng trong schema này — khai báo REFERENCES cities(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "city_name" varchar(255), -- ← fs_products.city_name | Tên tỉnh/thành phố.
  "city_alias" varchar(255), -- ← fs_products.city_alias | Alias của tỉnh/thành phố.
  "colors" varchar(255), -- ← fs_products.colors | Danh sách/thông tin màu sắc.
  "sizes" varchar(255), -- ← fs_products.sizes | Danh sách kích thước/quy cách.
  "icon" varchar(255), -- ← fs_products.icon | Đường dẫn/tên biểu tượng (icon).
  "feature_details" text, -- ← fs_products.feature_details | Chi tiết tính năng/đặc điểm nổi bật.
  "application" varchar(255), -- ← fs_products.application | Tên/mã ứng dụng (component) liên quan.
  "file_full" varchar(255), -- ← fs_products.file_full | Đường dẫn tệp đầy đủ.
  "file_price" varchar(255), -- ← fs_products.file_price | Tệp bảng giá đính kèm.
  "file_driver" varchar(255), -- ← fs_products.file_driver | Tệp driver đính kèm.
  "file_demo" varchar(255), -- ← fs_products.file_demo | Tệp demo/bản dùng thử đính kèm.
  "name_captain" varchar(255), -- ← fs_products.name_captain | Tên người phụ trách/trưởng nhóm.
  "types_id" integer, -- ← fs_products.types_id | ✅ FK CHUẨN: Ép kiểu từ VARCHAR sang INTEGER — dữ liệu đã kiểm tra không có rác, toàn bộ là số nguyên. Bảng đích products_types tồn tại trong schema này — khai báo REFERENCES products_types(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "products_relates" varchar(255), -- ← fs_products.products_relates | Sản phẩm liên quan (biến thể tên trường).
  "sub_name" varchar(255), -- ← fs_products.sub_name | Tên phụ/tên rút gọn bổ sung.
  "email_contact" varchar(255), -- ← fs_products.email_contact | Email nhận liên hệ.
  "email_download" varchar(255), -- ← fs_products.email_download | Email nhận thông báo tải tài liệu.
  "email_order" varchar(255), -- ← fs_products.email_order | Email nhận thông báo đơn hàng.
  "email_driver" varchar(255), -- ← fs_products.email_driver | Email nhận thông báo tải driver.
  "email_catalogue" varchar(255), -- ← fs_products.email_catalogue | Email nhận thông báo tải catalogue.
  "file_name1" varchar(255), -- ← fs_products.file_name1 | Tên hiển thị của tệp tải xuống số 1.
  "file_download1" varchar(255), -- ← fs_products.file_download1 | Tệp tải xuống số 1.
  "link_download1" varchar(255), -- ← fs_products.link_download1 | Liên kết tải xuống số 1.
  "file_name2" varchar(255), -- ← fs_products.file_name2 | Tên hiển thị của tệp tải xuống số 2.
  "file_download2" varchar(255), -- ← fs_products.file_download2 | Tệp tải xuống số 2.
  "link_download2" varchar(255), -- ← fs_products.link_download2 | Liên kết tải xuống số 2.
  "file_name3" varchar(255), -- ← fs_products.file_name3 | Tên hiển thị của tệp tải xuống số 3.
  "file_download3" varchar(255), -- ← fs_products.file_download3 | Tệp tải xuống số 3.
  "link_download3" varchar(255), -- ← fs_products.link_download3 | Liên kết tải xuống số 3.
  "file_name4" varchar(255), -- ← fs_products.file_name4 | Tên hiển thị của tệp tải xuống số 4.
  "file_download4" varchar(255), -- ← fs_products.file_download4 | Tệp tải xuống số 4.
  "link_download4" varchar(255), -- ← fs_products.link_download4 | Liên kết tải xuống số 4.
  "file_name5" varchar(255), -- ← fs_products.file_name5 | Tên hiển thị của tệp tải xuống số 5.
  "file_download5" varchar(255), -- ← fs_products.file_download5 | Tệp tải xuống số 5.
  "link_download5" varchar(255), -- ← fs_products.link_download5 | Liên kết tải xuống số 5.
  "file_name6" varchar(255), -- ← fs_products.file_name6 | Tên hiển thị của tệp tải xuống số 6.
  "file_download6" varchar(255), -- ← fs_products.file_download6 | Tệp tải xuống số 6.
  "link_download6" varchar(255), -- ← fs_products.link_download6 | Liên kết tải xuống số 6.
  "link_driver" varchar(255), -- ← fs_products.link_driver | Liên kết tải driver.
  "file_catalogue" varchar(255), -- ← fs_products.file_catalogue | Tệp catalogue đính kèm.
  "link_catalogue" varchar(255), -- ← fs_products.link_catalogue | Liên kết tới catalogue.
  "file_driver_name" varchar(255), -- ← fs_products.file_driver_name | Tên tệp driver.
  "discount_unit" varchar(255), -- ← fs_products.discount_unit | Đơn vị tính của giảm giá (%, VNĐ...).
  "comments_published" integer, -- ← fs_products.comments_published | Trạng thái hiển thị của bình luận.
  "tablename" varchar(255), -- ← fs_products.tablename | Tên bảng liên kết.
  "style_mail" integer, -- ← fs_products.style_mail | Kiểu định dạng/giao diện email.
  "hit1" integer, -- ← fs_products.hit1 | Lượt truy cập/thống kê loại 1.
  "hit2" integer, -- ← fs_products.hit2 | Lượt truy cập/thống kê loại 2.
  "hit3" integer, -- ← fs_products.hit3 | Lượt truy cập/thống kê loại 3.
  "hit4" integer, -- ← fs_products.hit4 | Lượt truy cập/thống kê loại 4.
  "hit5" integer, -- ← fs_products.hit5 | Lượt truy cập/thống kê loại 5.
  "hit6" integer, -- ← fs_products.hit6 | Lượt truy cập/thống kê loại 6.
  "types_alias" varchar(255), -- ← fs_products.types_alias | Alias của loại/phân loại.
  "application_alias" varchar(255), -- ← fs_products.application_alias | Alias của ứng dụng (component).
  "teamview" boolean NOT NULL, -- ← fs_products.teamview | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "seo_description" text, -- ← fs_products.seo_description | Mô tả SEO (thẻ meta description).
  "landing_page" varchar(255), -- ← fs_products.landing_page | Trang đích (landing page) liên kết.
  "tawk_to" text, -- ← fs_products.tawk_to | Mã tích hợp chat trực tuyến Tawk.to.
  "other_languages" varchar(255), -- ← fs_products.other_languages | Nội dung/thiết lập cho các ngôn ngữ khác.
  "other_languages1" varchar(255), -- ← fs_products.other_languages1 | Nội dung/thiết lập cho ngôn ngữ khác (bổ sung).
  "buy_status_id" integer, -- ← fs_products.buy_status_id | ⚠️ THIẾU BẢNG THAM CHIẾU — LEGACY: Luôn bằng 0 trong dữ liệu cũ (274/274 dòng). Không tìm thấy trong PHP source, chỉ tồn tại ở schema dump. Ứng viên xoá (CANDIDATE FOR REMOVAL) sau khi backup và xác nhận runtime — không FK, không index. Cần xem xét thêm nếu sau này có tài liệu xác nhận nghiệp vụ (hiện không referenced trong code, luôn = 0).
  "district_id" integer, -- ← fs_products.district_id | ⚠️ THIẾU BẢNG THAM CHIẾU — LEGACY: Không có dữ liệu. Ý nghĩa nghiệp vụ chưa xác định — không FK, không index.
  "name" varchar(255), -- ← fs_products.name + fs_products_en.name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "alias" varchar(255), -- ← fs_products.alias + fs_products_en.alias | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "category_name" varchar(255), -- ← fs_products.category_name + fs_products_en.category_name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "summary" text, -- ← fs_products.summary + fs_products_en.summary | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "guarantee" varchar(255), -- ← fs_products.guarantee + fs_products_en.guarantee | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "application_name" varchar(255), -- ← fs_products.application_name + fs_products_en.application_name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "types_name" varchar(255), -- ← fs_products.types_name + fs_products_en.types_name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_title" varchar(255), -- ← fs_products.seo_title + fs_products_en.seo_title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_keyword" varchar(255), -- ← fs_products.seo_keyword + fs_products_en.seo_keyword | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "title" varchar(255) -- ← fs_products.title + fs_products_en.title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
);

-- Sản phẩm (tiếng Anh) - thông tin chính của catalogue sản phẩm.
DROP TABLE IF EXISTS "cic_products_en" CASCADE;
CREATE TABLE "cic_products_en" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_products.id / fs_products_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "code" varchar(255), -- ← fs_products.code · fs_products_en.code | Mã định danh dạng chuỗi (mã code) của đối tượng.
  "category_id" varchar(255), -- ← fs_products.category_id · fs_products_en.category_id | ⚠ QUAN HỆ N-N — 274/274 dòng chứa CSV (VD: ',62,63,'), KHÔNG được ép kiểu integer/FK. Giữ nguyên varchar để tương thích ngược, nhưng quan hệ thật đã được chuẩn hoá sang bảng trung gian products_categories_rel (xem bên dưới) — dùng bảng đó cho mọi truy vấn/ràng buộc mới.
  "category_id_wrapper" varchar(255), -- ← fs_products.category_id_wrapper · fs_products_en.category_id_wrapper | Mã danh mục cha bao ngoài (dùng cho breadcrumb/URL lồng nhau).
  "category_root_alias" varchar(255), -- ← fs_products.category_root_alias · fs_products_en.category_root_alias | Alias của danh mục gốc (cấp cao nhất).
  "category_alias" varchar(255), -- ← fs_products.category_alias · fs_products_en.category_alias | Alias của danh mục.
  "category_alias_wrapper" varchar(255), -- ← fs_products.category_alias_wrapper · fs_products_en.category_alias_wrapper | Alias bao ngoài của danh mục cha.
  "category_published" boolean, -- ← fs_products.category_published · fs_products_en.category_published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "description" text, -- ← fs_products.description · fs_products_en.description | Mô tả chi tiết.
  "image" varchar(255), -- ← fs_products.image · fs_products_en.image | Đường dẫn ảnh chính.
  "video" text, -- ← fs_products.video · fs_products_en.video | Đường dẫn/nội dung video.
  "manufactory" varchar(255), -- ← fs_products.manufactory · fs_products_en.manufactory | Nhà sản xuất.
  "manufactory_alias" varchar(255), -- ← fs_products.manufactory_alias · fs_products_en.manufactory_alias | Alias của nhà sản xuất.
  "manufactory_name" varchar(255), -- ← fs_products.manufactory_name · fs_products_en.manufactory_name | Tên nhà sản xuất.
  "price" varchar(255), -- ← fs_products.price · fs_products_en.price | Giá bán.
  "price_old" varchar(255), -- ← fs_products.price_old · fs_products_en.price_old | Giá cũ (giá gốc trước khuyến mãi).
  "discount" double precision, -- ← fs_products.discount · fs_products_en.discount | Giá trị giảm giá.
  "currency" varchar(50), -- ← fs_products.currency · fs_products_en.currency | Đơn vị tiền tệ.
  "created_time" timestamptz, -- ← fs_products.created_time · fs_products_en.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "edited_time" timestamptz, -- ← fs_products.edited_time · fs_products_en.edited_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "published" boolean, -- ← fs_products.published · fs_products_en.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer, -- ← fs_products.ordering · fs_products_en.ordering | Thứ tự sắp xếp hiển thị.
  "hits" integer NOT NULL, -- ← fs_products.hits · fs_products_en.hits | Tổng lượt xem/truy cập.
  "tags" varchar(255), -- ← fs_products.tags · fs_products_en.tags | Thẻ gắn với nội dung (dùng để phân loại/tìm kiếm).
  "types" varchar(255), -- ← fs_products.types | Danh sách loại/phân loại.
  "status" varchar(255), -- ← fs_products.status · fs_products_en.status | Trạng thái của bản ghi.
  "show_in_home" boolean NOT NULL, -- ← fs_products.show_in_home · fs_products_en.show_in_home | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "date_start" timestamptz, -- ← fs_products.date_start · fs_products_en.date_start | Ngày bắt đầu.
  "date_end" timestamptz, -- ← fs_products.date_end · fs_products_en.date_end | Ngày kết thúc.
  "is_hotdeal" boolean, -- ← fs_products.is_hotdeal · fs_products_en.is_hotdeal | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "warranty" integer, -- ← fs_products.warranty · fs_products_en.warranty | Thông tin bảo hành.
  "is_sell" boolean NOT NULL, -- ← fs_products.is_sell · fs_products_en.is_sell | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_hot" boolean NOT NULL, -- ← fs_products.is_hot | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "rating_count" integer NOT NULL, -- ← fs_products.rating_count · fs_products_en.rating_count | Số lượt đánh giá.
  "is_new" boolean NOT NULL, -- ← fs_products.is_new · fs_products_en.is_new | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "size_name" varchar(255), -- ← fs_products.size_name · fs_products_en.size_name | Tên kích thước/quy cách.
  "user_id" integer REFERENCES cic_users(id), -- ← fs_products.user_id · fs_products_en.user_id | ✅ FK CHUẨN: Bảng đích users tồn tại rõ ràng trong schema này — khai báo REFERENCES users(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "username" varchar(255), -- ← fs_products.username · fs_products_en.username | Tên đăng nhập.
  "user_image" varchar(255), -- ← fs_products.user_image · fs_products_en.user_image | Ảnh đại diện người dùng.
  "user_full_name" varchar(255), -- ← fs_products.user_full_name · fs_products_en.user_full_name | Họ tên đầy đủ của người dùng.
  "link_video" text, -- ← fs_products.link_video · fs_products_en.link_video | Liên kết video (ví dụ YouTube).
  "is_sale" boolean, -- ← fs_products.is_sale · fs_products_en.is_sale | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_status" boolean, -- ← fs_products.is_status · fs_products_en.is_status | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "latitude" numeric(9,6), -- ← fs_products.latitude · fs_products_en.latitude | Đổi từ varchar sang numeric(9,6) để tính toán/toạ độ chính xác, hỗ trợ query khoảng cách (PostGIS) sau này.
  "longitude" numeric(9,6), -- ← fs_products.longitude · fs_products_en.longitude | Đổi từ varchar sang numeric(9,6) để tính toán/toạ độ chính xác, hỗ trợ query khoảng cách (PostGIS) sau này.
  "city_id" integer REFERENCES cic_cities_en(id), -- ← fs_products.city_id · fs_products_en.city_id | ✅ FK CHUẨN: Bảng đích cities_en tồn tại rõ ràng trong schema này — khai báo REFERENCES cities_en(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "city_name" varchar(255), -- ← fs_products.city_name · fs_products_en.city_name | Tên tỉnh/thành phố.
  "city_alias" varchar(255), -- ← fs_products.city_alias · fs_products_en.city_alias | Alias của tỉnh/thành phố.
  "colors" varchar(255), -- ← fs_products.colors · fs_products_en.colors | Danh sách/thông tin màu sắc.
  "sizes" varchar(255), -- ← fs_products.sizes · fs_products_en.sizes | Danh sách kích thước/quy cách.
  "icon" varchar(255), -- ← fs_products.icon · fs_products_en.icon | Đường dẫn/tên biểu tượng (icon).
  "feature_details" text, -- ← fs_products.feature_details · fs_products_en.feature_details | Chi tiết tính năng/đặc điểm nổi bật.
  "application" varchar(255), -- ← fs_products.application | Tên/mã ứng dụng (component) liên quan.
  "file_full" varchar(255), -- ← fs_products.file_full · fs_products_en.file_full | Đường dẫn tệp đầy đủ.
  "file_price" varchar(255), -- ← fs_products.file_price · fs_products_en.file_price | Tệp bảng giá đính kèm.
  "file_driver" varchar(255), -- ← fs_products.file_driver · fs_products_en.file_driver | Tệp driver đính kèm.
  "file_demo" varchar(255), -- ← fs_products.file_demo · fs_products_en.file_demo | Tệp demo/bản dùng thử đính kèm.
  "name_captain" varchar(255), -- ← fs_products.name_captain · fs_products_en.name_captain | Tên người phụ trách/trưởng nhóm.
  "types_id" integer, -- ← fs_products.types_id · fs_products_en.types_id | ✅ FK CHUẨN: Ép kiểu từ VARCHAR sang INTEGER — dữ liệu đã kiểm tra không có rác, toàn bộ là số nguyên. Bảng đích products_types_en tồn tại trong schema này — khai báo REFERENCES products_types_en(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "products_relates" varchar(255), -- ← fs_products.products_relates · fs_products_en.products_relates | Sản phẩm liên quan (biến thể tên trường).
  "sub_name" varchar(255), -- ← fs_products.sub_name | Tên phụ/tên rút gọn bổ sung.
  "email_contact" varchar(255), -- ← fs_products.email_contact · fs_products_en.email_contact | Email nhận liên hệ.
  "email_download" varchar(255), -- ← fs_products.email_download · fs_products_en.email_download | Email nhận thông báo tải tài liệu.
  "email_order" varchar(255), -- ← fs_products.email_order · fs_products_en.email_order | Email nhận thông báo đơn hàng.
  "email_driver" varchar(255), -- ← fs_products.email_driver · fs_products_en.email_driver | Email nhận thông báo tải driver.
  "email_catalogue" varchar(255), -- ← fs_products.email_catalogue · fs_products_en.email_catalogue | Email nhận thông báo tải catalogue.
  "file_name1" varchar(255), -- ← fs_products.file_name1 · fs_products_en.file_name1 | Tên hiển thị của tệp tải xuống số 1.
  "file_download1" varchar(255), -- ← fs_products.file_download1 · fs_products_en.file_download1 | Tệp tải xuống số 1.
  "link_download1" varchar(255), -- ← fs_products.link_download1 · fs_products_en.link_download1 | Liên kết tải xuống số 1.
  "file_name2" varchar(255), -- ← fs_products.file_name2 · fs_products_en.file_name2 | Tên hiển thị của tệp tải xuống số 2.
  "file_download2" varchar(255), -- ← fs_products.file_download2 · fs_products_en.file_download2 | Tệp tải xuống số 2.
  "link_download2" varchar(255), -- ← fs_products.link_download2 · fs_products_en.link_download2 | Liên kết tải xuống số 2.
  "file_name3" varchar(255), -- ← fs_products.file_name3 · fs_products_en.file_name3 | Tên hiển thị của tệp tải xuống số 3.
  "file_download3" varchar(255), -- ← fs_products.file_download3 · fs_products_en.file_download3 | Tệp tải xuống số 3.
  "link_download3" varchar(255), -- ← fs_products.link_download3 · fs_products_en.link_download3 | Liên kết tải xuống số 3.
  "file_name4" varchar(255), -- ← fs_products.file_name4 · fs_products_en.file_name4 | Tên hiển thị của tệp tải xuống số 4.
  "file_download4" varchar(255), -- ← fs_products.file_download4 · fs_products_en.file_download4 | Tệp tải xuống số 4.
  "link_download4" varchar(255), -- ← fs_products.link_download4 · fs_products_en.link_download4 | Liên kết tải xuống số 4.
  "file_name5" varchar(255), -- ← fs_products.file_name5 · fs_products_en.file_name5 | Tên hiển thị của tệp tải xuống số 5.
  "file_download5" varchar(255), -- ← fs_products.file_download5 · fs_products_en.file_download5 | Tệp tải xuống số 5.
  "link_download5" varchar(255), -- ← fs_products.link_download5 · fs_products_en.link_download5 | Liên kết tải xuống số 5.
  "file_name6" varchar(255), -- ← fs_products.file_name6 · fs_products_en.file_name6 | Tên hiển thị của tệp tải xuống số 6.
  "file_download6" varchar(255), -- ← fs_products.file_download6 · fs_products_en.file_download6 | Tệp tải xuống số 6.
  "link_download6" varchar(255), -- ← fs_products.link_download6 · fs_products_en.link_download6 | Liên kết tải xuống số 6.
  "link_driver" varchar(255), -- ← fs_products.link_driver · fs_products_en.link_driver | Liên kết tải driver.
  "file_catalogue" varchar(255), -- ← fs_products.file_catalogue · fs_products_en.file_catalogue | Tệp catalogue đính kèm.
  "link_catalogue" varchar(255), -- ← fs_products.link_catalogue · fs_products_en.link_catalogue | Liên kết tới catalogue.
  "file_driver_name" varchar(255), -- ← fs_products.file_driver_name · fs_products_en.file_driver_name | Tên tệp driver.
  "discount_unit" varchar(255), -- ← fs_products.discount_unit · fs_products_en.discount_unit | Đơn vị tính của giảm giá (%, VNĐ...).
  "comments_published" integer, -- ← fs_products.comments_published · fs_products_en.comments_published | Trạng thái hiển thị của bình luận.
  "tablename" varchar(255), -- ← fs_products.tablename · fs_products_en.tablename | Tên bảng liên kết.
  "style_mail" integer, -- ← fs_products.style_mail · fs_products_en.style_mail | Kiểu định dạng/giao diện email.
  "hit1" integer, -- ← fs_products.hit1 · fs_products_en.hit1 | Lượt truy cập/thống kê loại 1.
  "hit2" integer, -- ← fs_products.hit2 · fs_products_en.hit2 | Lượt truy cập/thống kê loại 2.
  "hit3" integer, -- ← fs_products.hit3 · fs_products_en.hit3 | Lượt truy cập/thống kê loại 3.
  "hit4" integer, -- ← fs_products.hit4 · fs_products_en.hit4 | Lượt truy cập/thống kê loại 4.
  "hit5" integer, -- ← fs_products.hit5 · fs_products_en.hit5 | Lượt truy cập/thống kê loại 5.
  "hit6" integer, -- ← fs_products.hit6 · fs_products_en.hit6 | Lượt truy cập/thống kê loại 6.
  "types_alias" varchar(255), -- ← fs_products.types_alias · fs_products_en.types_alias | Alias của loại/phân loại.
  "application_alias" varchar(255), -- ← fs_products.application_alias · fs_products_en.application_alias | Alias của ứng dụng (component).
  "teamview" boolean NOT NULL, -- ← fs_products.teamview · fs_products_en.teamview | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "seo_description" text, -- ← fs_products.seo_description · fs_products_en.seo_description | Mô tả SEO (thẻ meta description).
  "landing_page" varchar(255), -- ← fs_products.landing_page · fs_products_en.landing_page | Trang đích (landing page) liên kết.
  "tawk_to" text, -- ← fs_products.tawk_to · fs_products_en.tawk_to | Mã tích hợp chat trực tuyến Tawk.to.
  "other_languages" varchar(255), -- ← fs_products.other_languages | Nội dung/thiết lập cho các ngôn ngữ khác.
  "other_languages1" varchar(255), -- ← fs_products.other_languages1 · fs_products_en.other_languages1 | Nội dung/thiết lập cho ngôn ngữ khác (bổ sung).
  "buy_status_id" integer, -- ← fs_products.buy_status_id · fs_products_en.buy_status_id | ⚠️ THIẾU BẢNG THAM CHIẾU — LEGACY: Luôn bằng 0 trong dữ liệu cũ (274/274 dòng). Không tìm thấy trong PHP source, chỉ tồn tại ở schema dump. Ứng viên xoá (CANDIDATE FOR REMOVAL) sau khi backup và xác nhận runtime — không FK, không index. Cần xem xét thêm nếu sau này có tài liệu xác nhận nghiệp vụ (hiện không referenced trong code, luôn = 0).
  "district_id" integer, -- ← fs_products.district_id · fs_products_en.district_id | ⚠️ THIẾU BẢNG THAM CHIẾU — LEGACY: Không có dữ liệu. Ý nghĩa nghiệp vụ chưa xác định — không FK, không index.
  "name" varchar(255), -- ← fs_products.name + fs_products_en.name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "alias" varchar(255), -- ← fs_products.alias + fs_products_en.alias | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "category_name" varchar(255), -- ← fs_products.category_name + fs_products_en.category_name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "summary" text, -- ← fs_products.summary + fs_products_en.summary | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "guarantee" varchar(255), -- ← fs_products.guarantee + fs_products_en.guarantee | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "application_name" varchar(255), -- ← fs_products.application_name + fs_products_en.application_name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "types_name" varchar(255), -- ← fs_products.types_name + fs_products_en.types_name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_title" varchar(255), -- ← fs_products.seo_title + fs_products_en.seo_title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_keyword" varchar(255), -- ← fs_products.seo_keyword + fs_products_en.seo_keyword | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "title" varchar(255) -- ← fs_products.title + fs_products_en.title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
);

-- Danh mục sản phẩm.
DROP TABLE IF EXISTS "cic_products_categories" CASCADE;
CREATE TABLE "cic_products_categories" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_products_categories.id / fs_products_categories_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "code" varchar(255), -- ← fs_products_categories.code | Mã định danh dạng chuỗi (mã code) của đối tượng.
  "level" integer, -- ← fs_products_categories.level | Cấp độ/mức độ phân cấp.
  "parent_id" integer REFERENCES cic_products_categories(id) ON DELETE SET NULL, -- ← fs_products_categories.parent_id | Tự tham chiếu (self-reference) — sentinel 0 đã được dọn thành NULL trước khi migrate; cho phép NULL và khai báo REFERENCES products_categories(id) ON DELETE SET NULL để tránh mồ côi cây phân cấp (0 = gốc không còn ý nghĩa FK hợp lệ trong Postgres).
  "published" boolean, -- ← fs_products_categories.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "image" varchar(250), -- ← fs_products_categories.image | Đường dẫn ảnh chính.
  "icon" varchar(250), -- ← fs_products_categories.icon | Đường dẫn/tên biểu tượng (icon).
  "ordering" integer, -- ← fs_products_categories.ordering | Thứ tự sắp xếp hiển thị.
  "created_time" timestamptz, -- ← fs_products_categories.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "updated_time" timestamptz, -- ← fs_products_categories.updated_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "show_in_homepage" boolean, -- ← fs_products_categories.show_in_homepage | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "show_in_footer" boolean, -- ← fs_products_categories.show_in_footer | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "root_id" integer REFERENCES cic_products_categories(id) ON DELETE SET NULL, -- ← fs_products_categories.root_id | ✅ FK CHUẨN (tự tham chiếu): Bảng đích products_categories chính là bảng này — khai báo REFERENCES products_categories(id) ON DELETE SET NULL. LƯU Ý: nếu dữ liệu cũ dùng sentinel 0 cho "không có cha/gốc", cần dọn 0→NULL trước khi migrate (giống 5 bảng cây phân cấp đã áp dụng: areas, menus_admin, contents_categories, news_categories, products_categories).
  "root_alias" varchar(100), -- ← fs_products_categories.root_alias | Alias của mục gốc (cấp cao nhất).
  "list_parents" varchar(255), -- ← fs_products_categories.list_parents | Danh sách mã các cấp cha (phân cấp).
  "alias_wrapper" varchar(255), -- ← fs_products_categories.alias_wrapper | Alias bao ngoài, dùng cho việc bọc đường dẫn (ví dụ danh mục cha).
  "tablename" varchar(255), -- ← fs_products_categories.tablename | Tên bảng liên kết.
  "tags_group" varchar(255), -- ← fs_products_categories.tags_group | Nhóm thẻ (tags).
  "total_products" integer, -- ← fs_products_categories.total_products | Tổng số sản phẩm.
  "vat" integer NOT NULL, -- ← fs_products_categories.vat | Thuế giá trị gia tăng (VAT).
  "is_accessories" boolean, -- ← fs_products_categories.is_accessories | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "banner" varchar(255), -- ← fs_products_categories.banner | Đường dẫn ảnh banner.
  "promotion_main" text, -- ← fs_products_categories.promotion_main | Khuyến mãi chính/nổi bật.
  "hotline" text, -- ← fs_products_categories.hotline | Số điện thoại đường dây nóng.
  "link" varchar(255), -- ← fs_products_categories.link | Đường dẫn liên kết.
  "published_image" boolean, -- ← fs_products_categories.published_image | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "promotion" text, -- ← fs_products_categories.promotion | Thông tin khuyến mãi.
  "price" varchar(255), -- ← fs_products_categories.price | Giá bán.
  "type" varchar(255), -- ← fs_products_categories.type | Loại/phân loại của bản ghi.
  "sizes" varchar(255), -- ← fs_products_categories.sizes | Danh sách kích thước/quy cách.
  "alias" varchar(250), -- ← fs_products_categories.alias + fs_products_categories_en.alias | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "name" varchar(250), -- ← fs_products_categories.name + fs_products_categories_en.name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "description" text, -- ← fs_products_categories.description + fs_products_categories_en.description | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_title" varchar(255), -- ← fs_products_categories.seo_title + fs_products_categories_en.seo_title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_keyword" varchar(255), -- ← fs_products_categories.seo_keyword + fs_products_categories_en.seo_keyword | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_description" varchar(255), -- ← fs_products_categories.seo_description + fs_products_categories_en.seo_description | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "summary" text -- ← fs_products_categories.summary + fs_products_categories_en.summary | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
);

-- Danh mục sản phẩm.
DROP TABLE IF EXISTS "cic_products_categories_en" CASCADE;
CREATE TABLE "cic_products_categories_en" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_products_categories.id / fs_products_categories_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "code" varchar(255), -- ← fs_products_categories.code · fs_products_categories_en.code | Mã định danh dạng chuỗi (mã code) của đối tượng.
  "level" integer, -- ← fs_products_categories.level · fs_products_categories_en.level | Cấp độ/mức độ phân cấp.
  "parent_id" integer REFERENCES cic_products_categories_en(id) ON DELETE SET NULL, -- ← fs_products_categories.parent_id · fs_products_categories_en.parent_id | Tự tham chiếu (self-reference) — sentinel 0 đã được dọn thành NULL trước khi migrate; cho phép NULL và khai báo REFERENCES products_categories_en(id) ON DELETE SET NULL để tránh mồ côi cây phân cấp (0 = gốc không còn ý nghĩa FK hợp lệ trong Postgres).
  "published" boolean, -- ← fs_products_categories.published · fs_products_categories_en.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "image" varchar(250), -- ← fs_products_categories.image · fs_products_categories_en.image | Đường dẫn ảnh chính.
  "icon" varchar(250), -- ← fs_products_categories.icon · fs_products_categories_en.icon | Đường dẫn/tên biểu tượng (icon).
  "ordering" integer, -- ← fs_products_categories.ordering · fs_products_categories_en.ordering | Thứ tự sắp xếp hiển thị.
  "created_time" timestamptz, -- ← fs_products_categories.created_time · fs_products_categories_en.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "updated_time" timestamptz, -- ← fs_products_categories.updated_time · fs_products_categories_en.updated_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "show_in_homepage" boolean, -- ← fs_products_categories.show_in_homepage · fs_products_categories_en.show_in_homepage | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "show_in_footer" boolean, -- ← fs_products_categories.show_in_footer · fs_products_categories_en.show_in_footer | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "root_id" integer REFERENCES cic_products_categories_en(id) ON DELETE SET NULL, -- ← fs_products_categories.root_id · fs_products_categories_en.root_id | ✅ FK CHUẨN (tự tham chiếu): Bảng đích products_categories chính là bảng này — khai báo REFERENCES products_categories_en(id) ON DELETE SET NULL. LƯU Ý: nếu dữ liệu cũ dùng sentinel 0 cho "không có cha/gốc", cần dọn 0→NULL trước khi migrate (giống 5 bảng cây phân cấp đã áp dụng: areas, menus_admin, contents_categories, news_categories, products_categories).
  "root_alias" varchar(100), -- ← fs_products_categories.root_alias · fs_products_categories_en.root_alias | Alias của mục gốc (cấp cao nhất).
  "list_parents" varchar(255), -- ← fs_products_categories.list_parents · fs_products_categories_en.list_parents | Danh sách mã các cấp cha (phân cấp).
  "alias_wrapper" varchar(255), -- ← fs_products_categories.alias_wrapper · fs_products_categories_en.alias_wrapper | Alias bao ngoài, dùng cho việc bọc đường dẫn (ví dụ danh mục cha).
  "tablename" varchar(255), -- ← fs_products_categories.tablename · fs_products_categories_en.tablename | Tên bảng liên kết.
  "tags_group" varchar(255), -- ← fs_products_categories.tags_group · fs_products_categories_en.tags_group | Nhóm thẻ (tags).
  "total_products" integer, -- ← fs_products_categories.total_products · fs_products_categories_en.total_products | Tổng số sản phẩm.
  "vat" integer NOT NULL, -- ← fs_products_categories.vat · fs_products_categories_en.vat | Thuế giá trị gia tăng (VAT).
  "is_accessories" boolean, -- ← fs_products_categories.is_accessories · fs_products_categories_en.is_accessories | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "banner" varchar(255), -- ← fs_products_categories.banner · fs_products_categories_en.banner | Đường dẫn ảnh banner.
  "promotion_main" text, -- ← fs_products_categories.promotion_main · fs_products_categories_en.promotion_main | Khuyến mãi chính/nổi bật.
  "hotline" text, -- ← fs_products_categories.hotline · fs_products_categories_en.hotline | Số điện thoại đường dây nóng.
  "link" varchar(255), -- ← fs_products_categories.link · fs_products_categories_en.link | Đường dẫn liên kết.
  "published_image" boolean, -- ← fs_products_categories.published_image · fs_products_categories_en.published_image | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "promotion" text, -- ← fs_products_categories.promotion | Thông tin khuyến mãi.
  "price" varchar(255), -- ← fs_products_categories.price · fs_products_categories_en.price | Giá bán.
  "type" varchar(255), -- ← fs_products_categories.type · fs_products_categories_en.type | Loại/phân loại của bản ghi.
  "sizes" varchar(255), -- ← fs_products_categories.sizes · fs_products_categories_en.sizes | Danh sách kích thước/quy cách.
  "alias" varchar(250), -- ← fs_products_categories.alias + fs_products_categories_en.alias | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "name" varchar(250), -- ← fs_products_categories.name + fs_products_categories_en.name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "description" text, -- ← fs_products_categories.description + fs_products_categories_en.description | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_title" varchar(255), -- ← fs_products_categories.seo_title + fs_products_categories_en.seo_title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_keyword" varchar(255), -- ← fs_products_categories.seo_keyword + fs_products_categories_en.seo_keyword | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_description" varchar(255), -- ← fs_products_categories.seo_description + fs_products_categories_en.seo_description | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "summary" text -- ← fs_products_categories.summary + fs_products_categories_en.summary | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
);

-- Bảng trung gian N-N giữa sản phẩm và danh mục sản phẩm — bảng MỚI, thay thế cột products.category_id dạng CSV của schema cũ.
DROP TABLE IF EXISTS "cic_products_categories_rel" CASCADE;
CREATE TABLE "cic_products_categories_rel" (
  "product_id" integer NOT NULL REFERENCES cic_products(id) ON DELETE CASCADE, -- ← fs_products.category_id (CSV, phần tử tách ra) | Một phần của khoá chính kép (product_id, category_id). Sinh ra bằng cách parse từng phần tử CSV trong cột category_id cũ.
  "category_id" integer NOT NULL REFERENCES cic_products_categories(id) ON DELETE CASCADE, -- ← fs_products.category_id (CSV, phần tử tách ra) | Phần còn lại của khoá chính kép. Mỗi dòng của bảng này = 1 quan hệ sản phẩm ↔ danh mục (quan hệ N-N thật, thay cho CSV không thể ép kiểu integer).
  CONSTRAINT "pk_cic_products_categories_rel" PRIMARY KEY ("product_id", "category_id")
);

-- Bảng trung gian N-N giữa sản phẩm và danh mục sản phẩm (bản tiếng Anh) — bảng MỚI, thay thế cột products_en.category_id dạng CSV của schema cũ.
DROP TABLE IF EXISTS "cic_products_categories_rel_en" CASCADE;
CREATE TABLE "cic_products_categories_rel_en" (
  "product_id" integer NOT NULL REFERENCES cic_products_en(id) ON DELETE CASCADE, -- ← fs_products_en.category_id (CSV, phần tử tách ra) | Một phần của khoá chính kép (product_id, category_id). Sinh ra bằng cách parse từng phần tử CSV trong cột category_id cũ.
  "category_id" integer NOT NULL REFERENCES cic_products_categories_en(id) ON DELETE CASCADE, -- ← fs_products_en.category_id (CSV, phần tử tách ra) | Phần còn lại của khoá chính kép. Mỗi dòng của bảng này = 1 quan hệ sản phẩm ↔ danh mục (quan hệ N-N thật, thay cho CSV không thể ép kiểu integer).
  CONSTRAINT "pk_cic_products_categories_rel_en" PRIMARY KEY ("product_id", "category_id")
);

-- Nhóm các trường thuộc tính mở rộng cho sản phẩm.
DROP TABLE IF EXISTS "cic_products_fields_groups" CASCADE;
CREATE TABLE "cic_products_fields_groups" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_products_fields_groups.id | Khoá chính tự tăng, dùng identity thay AUTO_INCREMENT.
  "name" varchar(255) NOT NULL, -- ← fs_products_fields_groups.name | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "ordering" integer NOT NULL, -- ← fs_products_fields_groups.ordering | Thứ tự sắp xếp hiển thị.
  "published" boolean NOT NULL, -- ← fs_products_fields_groups.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "created_time" timestamptz -- ← fs_products_fields_groups.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
);

-- Bộ lọc thuộc tính sản phẩm (ví dụ: màu sắc, kích thước dùng để lọc trên site).
DROP TABLE IF EXISTS "cic_products_filters" CASCADE;
CREATE TABLE "cic_products_filters" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_products_filters.id | Khoá chính tự tăng, dùng identity thay AUTO_INCREMENT.
  "filter_show" varchar(255), -- ← fs_products_filters.filter_show | Bật/tắt hiển thị trong bộ lọc.
  "tablename" varchar(50), -- ← fs_products_filters.tablename | Tên bảng liên kết.
  "field_name" varchar(50), -- ← fs_products_filters.field_name | Tên trường.
  "field_show" varchar(50), -- ← fs_products_filters.field_show | Bật/tắt hiển thị trường.
  "field_ordering" integer, -- ← fs_products_filters.field_ordering | Thứ tự sắp xếp của trường.
  "field_ordering_item" integer, -- ← fs_products_filters.field_ordering_item | Thứ tự sắp xếp của mục trong trường.
  "alias" varchar(50), -- ← fs_products_filters.alias | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "calculator" integer, -- ← fs_products_filters.calculator | Bảng tính/công cụ tính toán liên quan sản phẩm.
  "calculator_show" varchar(50), -- ← fs_products_filters.calculator_show | Bật/tắt hiển thị công cụ tính toán.
  "filter_value" varchar(255), -- ← fs_products_filters.filter_value | Giá trị dùng để lọc.
  "published" boolean, -- ← fs_products_filters.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_common" boolean NOT NULL, -- ← fs_products_filters.is_common | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_condition" boolean NOT NULL, -- ← fs_products_filters.is_condition | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "seo_title" text, -- ← fs_products_filters.seo_title | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "seo_meta_key" text, -- ← fs_products_filters.seo_meta_key | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "seo_meta_des" text, -- ← fs_products_filters.seo_meta_des | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "lang" varchar(255) -- ← fs_products_filters.lang | Mã ngôn ngữ.
);

-- Giá trị cụ thể của từng bộ lọc sản phẩm.
DROP TABLE IF EXISTS "cic_products_filters_values" CASCADE;
CREATE TABLE "cic_products_filters_values" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_products_filters_values.id | Khoá chính tự tăng, dùng identity thay AUTO_INCREMENT.
  "record_id" integer, -- ← fs_products_filters_values.record_id | ⚠️ THIẾU BẢNG THAM CHIẾU — ⚠ CẦN XÁC NHẬN NGHIỆP VỤ — Có nhiều hơn 1 bảng đích khả dĩ: products_filters(id) (bản ghi định nghĩa filter) hoặc products(id) (sản phẩm cụ thể) — cấu trúc bảng cho thấy đây là bảng đếm/cache nên chưa rõ record_id trỏ vào đâu. Không tự suy đoán vì đây là vùng rủi ro cao (Sản phẩm/Đơn hàng/Banner thương mại) — cần xác nhận với đội nghiệp vụ trước khi gắn FK, tạm thời giữ nguyên không FK, không index.
  "total" integer, -- ← fs_products_filters_values.total | Tổng giá trị/số lượng.
  "category_id" varchar(255), -- ← fs_products_filters_values.category_id | ⚠️ THIẾU BẢNG THAM CHIẾU — ⚠ CẦN XÁC NHẬN NGHIỆP VỤ — Có nhiều hơn 1 bảng đích khả dĩ: tương tự products.category_id (nghi vấn CSV N-N) nhưng CHƯA kiểm tra dữ liệu thật để xác nhận như đã làm với products.category_id (274/274 dòng). Không tự suy đoán vì đây là vùng rủi ro cao (Sản phẩm/Đơn hàng/Banner thương mại) — cần xác nhận với đội nghiệp vụ trước khi gắn FK, tạm thời giữ nguyên không FK, không index.
  "category_alias" varchar(255), -- ← fs_products_filters_values.category_alias | Alias của danh mục.
  "url_ids" varchar(255), -- ← fs_products_filters_values.url_ids | Danh sách mã dùng trong URL.
  "url_alias" varchar(255), -- ← fs_products_filters_values.url_alias | Alias dùng trong URL.
  "url_total_params" integer NOT NULL, -- ← fs_products_filters_values.url_total_params | Tổng số tham số truyền trên URL.
  "filter_show" varchar(255), -- ← fs_products_filters_values.filter_show | Bật/tắt hiển thị trong bộ lọc.
  "tablename" varchar(50), -- ← fs_products_filters_values.tablename | Tên bảng liên kết.
  "field_name" varchar(50), -- ← fs_products_filters_values.field_name | Tên trường.
  "field_show" varchar(50), -- ← fs_products_filters_values.field_show | Bật/tắt hiển thị trường.
  "alias" varchar(50), -- ← fs_products_filters_values.alias | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "calculator" integer, -- ← fs_products_filters_values.calculator | Bảng tính/công cụ tính toán liên quan sản phẩm.
  "calculator_show" varchar(50), -- ← fs_products_filters_values.calculator_show | Bật/tắt hiển thị công cụ tính toán.
  "filter_value" varchar(255), -- ← fs_products_filters_values.filter_value | Giá trị dùng để lọc.
  "published" boolean, -- ← fs_products_filters_values.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_common" boolean NOT NULL, -- ← fs_products_filters_values.is_common | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_condition" boolean NOT NULL -- ← fs_products_filters_values.is_condition | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
);

-- Hình ảnh (thư viện ảnh) gắn với sản phẩm.
DROP TABLE IF EXISTS "cic_products_images" CASCADE;
CREATE TABLE "cic_products_images" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_products_images.id / fs_products_images_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "record_id" integer REFERENCES cic_products(id), -- ← fs_products_images.record_id | ✅ FK CHUẨN: Bảng đích products tồn tại rõ ràng trong schema này — khai báo REFERENCES products(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "session_id" varchar(255), -- ← fs_products_images.session_id | ℹ️ KHÔNG PHẢI KHOÁ NGOẠI THẬT — Đây là chuỗi định danh phiên làm việc tạm thời (session id, thường do PHP session hoặc client tự sinh) dùng để nhóm các bản ghi tạm trước khi có record_id chính thức, KHÔNG trỏ tới một bảng dữ liệu nào. Không có bảng "sessions" trong hệ thống — không FK, không cần index cho mục đích tham chiếu (nếu cần tra cứu nhanh theo session thì đã có sẵn ở nhóm index alias/FK khác nếu áp dụng).
  "image" varchar(255), -- ← fs_products_images.image | Đường dẫn ảnh chính.
  "ordering" integer, -- ← fs_products_images.ordering | Thứ tự sắp xếp hiển thị.
  "temp" varchar(255), -- ← fs_products_images.temp | Dữ liệu tạm thời.
  "color_id" integer, -- ← fs_products_images.color_id | ⚠️ THIẾU BẢNG THAM CHIẾU — LEGACY: Không có dữ liệu. Referenced trong 8 file với module Accessories (cms/modules/products/controllers/accessories.php). Runtime verification required — không FK, không index.
  "title" varchar(255) -- ← fs_products_images.title + fs_products_images_en.title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
);

-- Hình ảnh (thư viện ảnh) gắn với sản phẩm.
DROP TABLE IF EXISTS "cic_products_images_en" CASCADE;
CREATE TABLE "cic_products_images_en" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_products_images.id / fs_products_images_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "record_id" integer REFERENCES cic_products_en(id), -- ← fs_products_images.record_id · fs_products_images_en.record_id | ✅ FK CHUẨN: Bảng đích products_en tồn tại rõ ràng trong schema này — khai báo REFERENCES products_en(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "session_id" varchar(255), -- ← fs_products_images.session_id · fs_products_images_en.session_id | ℹ️ KHÔNG PHẢI KHOÁ NGOẠI THẬT — Đây là chuỗi định danh phiên làm việc tạm thời (session id, thường do PHP session hoặc client tự sinh) dùng để nhóm các bản ghi tạm trước khi có record_id chính thức, KHÔNG trỏ tới một bảng dữ liệu nào. Không có bảng "sessions" trong hệ thống — không FK, không cần index cho mục đích tham chiếu (nếu cần tra cứu nhanh theo session thì đã có sẵn ở nhóm index alias/FK khác nếu áp dụng).
  "image" varchar(255), -- ← fs_products_images.image · fs_products_images_en.image | Đường dẫn ảnh chính.
  "ordering" integer, -- ← fs_products_images.ordering · fs_products_images_en.ordering | Thứ tự sắp xếp hiển thị.
  "temp" varchar(255), -- ← fs_products_images.temp · fs_products_images_en.temp | Dữ liệu tạm thời.
  "color_id" integer, -- ← fs_products_images.color_id · fs_products_images_en.color_id | ⚠️ THIẾU BẢNG THAM CHIẾU — LEGACY: Không có dữ liệu. Referenced trong 8 file với module Accessories (cms/modules/products/controllers/accessories.php). Runtime verification required — không FK, không index.
  "title" varchar(255) -- ← fs_products_images.title + fs_products_images_en.title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
);

-- Chương trình khuyến mãi/ưu đãi áp dụng cho sản phẩm.
DROP TABLE IF EXISTS "cic_products_incentives" CASCADE;
CREATE TABLE "cic_products_incentives" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_products_incentives.id | Khoá chính tự tăng, dùng identity thay AUTO_INCREMENT.
  "product_id" integer REFERENCES cic_products(id), -- ← fs_products_incentives.product_id | ✅ FK CHUẨN: Bảng đích products tồn tại rõ ràng trong schema này — khai báo REFERENCES products(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "product_incenty_id" integer NOT NULL, -- ← fs_products_incentives.product_incenty_id | ⚠️ THIẾU BẢNG THAM CHIẾU — ⚠ CẦN XÁC NHẬN VỚI DEV BAN ĐẦU — cột hiện có 0 giá trị, tên có thể bị gõ nhầm; đề xuất bỏ nếu xác nhận không dùng, tạm giữ lại trong bản migrate đầu tiên.
  "product_incenty_name" varchar(255) NOT NULL, -- ← fs_products_incentives.product_incenty_name | Tên chương trình khuyến mãi sản phẩm.
  "price_old" double precision, -- ← fs_products_incentives.price_old | Giá cũ (giá gốc trước khuyến mãi).
  "price_new" double precision -- ← fs_products_incentives.price_new | Giá mới (giá sau khi thay đổi/khuyến mãi).
);

-- Bảng giá sản phẩm (có thể theo thời điểm/loại giá).
DROP TABLE IF EXISTS "cic_products_price" CASCADE;
CREATE TABLE "cic_products_price" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_products_price.id | Khoá chính tự tăng, dùng identity thay AUTO_INCREMENT.
  "record_id" integer REFERENCES cic_products(id), -- ← fs_products_price.record_id | ✅ FK CHUẨN: Bảng đích products tồn tại rõ ràng trong schema này — khai báo REFERENCES products(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "color_code" varchar(255), -- ← fs_products_price.color_code | Mã màu.
  "color_name" varchar(255), -- ← fs_products_price.color_name | Tên màu sắc.
  "price" varchar(255), -- ← fs_products_price.price | Giá bán.
  "image" varchar(255), -- ← fs_products_price.image | Đường dẫn ảnh chính.
  "sl_hn" integer, -- ← fs_products_price.sl_hn | Số lượng tại chi nhánh Hà Nội.
  "sl_hcm" integer, -- ← fs_products_price.sl_hcm | Số lượng tại chi nhánh TP. Hồ Chí Minh.
  "sl_dn" integer, -- ← fs_products_price.sl_dn | Số lượng tại chi nhánh Đà Nẵng.
  "is_default" boolean NOT NULL, -- ← fs_products_price.is_default | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "color_id" integer -- ← fs_products_price.color_id | ⚠️ THIẾU BẢNG THAM CHIẾU — LEGACY: Không có dữ liệu. Referenced trong 8 file với module Accessories (cms/modules/products/controllers/accessories.php). Runtime verification required — không FK, không index.
);

-- Kích thước/quy cách sản phẩm.
DROP TABLE IF EXISTS "cic_products_sizes" CASCADE;
CREATE TABLE "cic_products_sizes" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_products_sizes.id | Khoá chính tự tăng, dùng identity thay AUTO_INCREMENT.
  "name" varchar(255), -- ← fs_products_sizes.name | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "alias" varchar(255), -- ← fs_products_sizes.alias | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "image" varchar(255), -- ← fs_products_sizes.image | Đường dẫn ảnh chính.
  "created_time" timestamptz, -- ← fs_products_sizes.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "published" boolean, -- ← fs_products_sizes.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer, -- ← fs_products_sizes.ordering | Thứ tự sắp xếp hiển thị.
  "code" varchar(255), -- ← fs_products_sizes.code | Mã định danh dạng chuỗi (mã code) của đối tượng.
  "tablenames" varchar(255) -- ← fs_products_sizes.tablenames | Tên các bảng liên kết (có thể nhiều bảng).
);

-- Bảng thông số kỹ thuật của sản phẩm.
DROP TABLE IF EXISTS "cic_products_tables" CASCADE;
CREATE TABLE "cic_products_tables" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_products_tables.id / fs_products_tables_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "table_name" varchar(255) NOT NULL, -- ← fs_products_tables.table_name | Tên bảng liên kết.
  "field_name" varchar(255) NOT NULL, -- ← fs_products_tables.field_name | Tên trường.
  "field_name_display" varchar(255), -- ← fs_products_tables.field_name_display | Tên hiển thị của trường.
  "field_type" varchar(255) NOT NULL, -- ← fs_products_tables.field_type | Kiểu dữ liệu/loại của trường (text, number, select...).
  "field_length" integer, -- ← fs_products_tables.field_length | Độ dài tối đa của trường.
  "foreign_id" integer, -- ← fs_products_tables.foreign_id | ⚠️ THIẾU BẢNG THAM CHIẾU — FK ĐỘNG (dynamic): bảng đích của cột này KHÔNG cố định, được xác định lúc runtime bởi giá trị của cột "foreign_tablename" trong cùng dòng (mỗi dòng có thể trỏ tới một bảng khác nhau). Postgres không hỗ trợ FOREIGN KEY trỏ động theo dữ liệu — giữ nguyên dạng không FK, không index. Muốn ràng buộc chặt cần refactor sang bảng con riêng theo từng loại tham chiếu (polymorphic association), ngoài phạm vi của lần rà soát này.
  "foreign_name" varchar(255), -- ← fs_products_tables.foreign_name | Tên hiển thị của bản ghi tham chiếu ở bảng khác.
  "foreign_tablename" varchar(255), -- ← fs_products_tables.foreign_tablename | ⚠️ THIẾU BẢNG THAM CHIẾU — Tên bảng được tham chiếu tới (khóa ngoại động).
  "is_compare" boolean, -- ← fs_products_tables.is_compare | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_main" boolean, -- ← fs_products_tables.is_main | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "group_id" integer REFERENCES cic_products_fields_groups(id), -- ← fs_products_tables.group_id | ✅ FK CHUẨN: Bảng đích products_fields_groups tồn tại rõ ràng trong schema này — khai báo REFERENCES products_fields_groups(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "ordering" integer, -- ← fs_products_tables.ordering | Thứ tự sắp xếp hiển thị.
  "is_filter" integer NOT NULL, -- ← fs_products_tables.is_filter | Cho phép dùng làm bộ lọc.
  "is_config" integer NOT NULL, -- ← fs_products_tables.is_config | Đánh dấu thuộc phần cấu hình hệ thống.
  "created_table" varchar(255) -- ← fs_products_tables.created_table | Tên bảng nơi bản ghi được tạo ra (dùng cho log/tra cứu).
);

-- Bảng thông số kỹ thuật của sản phẩm.
DROP TABLE IF EXISTS "cic_products_tables_en" CASCADE;
CREATE TABLE "cic_products_tables_en" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_products_tables.id / fs_products_tables_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "table_name" varchar(255) NOT NULL, -- ← fs_products_tables.table_name · fs_products_tables_en.table_name | Tên bảng liên kết.
  "field_name" varchar(255) NOT NULL, -- ← fs_products_tables.field_name · fs_products_tables_en.field_name | Tên trường.
  "field_name_display" varchar(255), -- ← fs_products_tables.field_name_display · fs_products_tables_en.field_name_display | Tên hiển thị của trường.
  "field_type" varchar(255) NOT NULL, -- ← fs_products_tables.field_type · fs_products_tables_en.field_type | Kiểu dữ liệu/loại của trường (text, number, select...).
  "field_length" integer, -- ← fs_products_tables.field_length · fs_products_tables_en.field_length | Độ dài tối đa của trường.
  "foreign_id" integer, -- ← fs_products_tables.foreign_id · fs_products_tables_en.foreign_id | ⚠️ THIẾU BẢNG THAM CHIẾU — FK ĐỘNG (dynamic): bảng đích của cột này KHÔNG cố định, được xác định lúc runtime bởi giá trị của cột "foreign_tablename" trong cùng dòng (mỗi dòng có thể trỏ tới một bảng khác nhau). Postgres không hỗ trợ FOREIGN KEY trỏ động theo dữ liệu — giữ nguyên dạng không FK, không index. Muốn ràng buộc chặt cần refactor sang bảng con riêng theo từng loại tham chiếu (polymorphic association), ngoài phạm vi của lần rà soát này.
  "foreign_name" varchar(255), -- ← fs_products_tables.foreign_name · fs_products_tables_en.foreign_name | Tên hiển thị của bản ghi tham chiếu ở bảng khác.
  "foreign_tablename" varchar(255), -- ← fs_products_tables.foreign_tablename · fs_products_tables_en.foreign_tablename | ⚠️ THIẾU BẢNG THAM CHIẾU — Tên bảng được tham chiếu tới (khóa ngoại động).
  "is_compare" boolean, -- ← fs_products_tables.is_compare · fs_products_tables_en.is_compare | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_main" boolean, -- ← fs_products_tables.is_main · fs_products_tables_en.is_main | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "group_id" integer REFERENCES cic_products_fields_groups(id), -- ← fs_products_tables.group_id · fs_products_tables_en.group_id | ✅ FK CHUẨN: Bảng đích products_fields_groups tồn tại rõ ràng trong schema này — khai báo REFERENCES products_fields_groups(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "ordering" integer, -- ← fs_products_tables.ordering · fs_products_tables_en.ordering | Thứ tự sắp xếp hiển thị.
  "is_filter" integer NOT NULL, -- ← fs_products_tables.is_filter · fs_products_tables_en.is_filter | Cho phép dùng làm bộ lọc.
  "is_config" integer NOT NULL, -- ← fs_products_tables.is_config · fs_products_tables_en.is_config | Đánh dấu thuộc phần cấu hình hệ thống.
  "created_table" varchar(255) -- ← fs_products_tables.created_table · fs_products_tables_en.created_table | Tên bảng nơi bản ghi được tạo ra (dùng cho log/tra cứu).
);

-- Loại/dòng sản phẩm.
DROP TABLE IF EXISTS "cic_products_types" CASCADE;
CREATE TABLE "cic_products_types" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_products_types.id / fs_products_types_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "image" varchar(255), -- ← fs_products_types.image | Đường dẫn ảnh chính.
  "published" boolean, -- ← fs_products_types.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer, -- ← fs_products_types.ordering | Thứ tự sắp xếp hiển thị.
  "created_time" timestamptz, -- ← fs_products_types.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "tablenames" varchar(225), -- ← fs_products_types.tablenames | Tên các bảng liên kết (có thể nhiều bảng).
  "name" varchar(255), -- ← fs_products_types.name + fs_products_types_en.name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "alias" varchar(255), -- ← fs_products_types.alias + fs_products_types_en.alias | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "description" text, -- ← fs_products_types.description + fs_products_types_en.description | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "updated_time" timestamptz NULL DEFAULT NULL -- ← — (cột mới) | [MỚI] Thời gian cập nhật gần nhất, dùng cho list hiển thị và ghi khi form lưu. Nullable ở migration đầu; legacy giữ NULL tới lần sửa đầu tiên.
);

-- Loại/dòng sản phẩm.
DROP TABLE IF EXISTS "cic_products_types_en" CASCADE;
CREATE TABLE "cic_products_types_en" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_products_types.id / fs_products_types_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "image" varchar(255), -- ← fs_products_types.image · fs_products_types_en.image | Đường dẫn ảnh chính.
  "published" boolean, -- ← fs_products_types.published · fs_products_types_en.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer, -- ← fs_products_types.ordering · fs_products_types_en.ordering | Thứ tự sắp xếp hiển thị.
  "created_time" timestamptz, -- ← fs_products_types.created_time · fs_products_types_en.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "tablenames" varchar(225), -- ← fs_products_types.tablenames · fs_products_types_en.tablenames | Tên các bảng liên kết (có thể nhiều bảng).
  "name" varchar(255), -- ← fs_products_types.name + fs_products_types_en.name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "alias" varchar(255), -- ← fs_products_types.alias + fs_products_types_en.alias | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "description" text, -- ← fs_products_types.description + fs_products_types_en.description | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "updated_time" timestamptz NULL DEFAULT NULL -- ← — (cột mới) | [MỚI] Thời gian cập nhật gần nhất — workspace EN. Cần cơ chế cập nhật nhất quán khi triển khai.
);

-- Yêu cầu liên hệ/tư vấn về một sản phẩm cụ thể từ khách hàng.
DROP TABLE IF EXISTS "cic_product_contact" CASCADE;
CREATE TABLE "cic_product_contact" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_product_contact.id | Khoá chính tự tăng, dùng identity thay AUTO_INCREMENT.
  "email" varchar(255) NOT NULL, -- ← fs_product_contact.email | Địa chỉ email.
  "fullname" varchar(255), -- ← fs_product_contact.fullname | Họ và tên đầy đủ.
  "address" varchar(255), -- ← fs_product_contact.address | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "telephone" varchar(255), -- ← fs_product_contact.telephone | Số điện thoại.
  "fax" varchar(255), -- ← fs_product_contact.fax | Số fax.
  "subject" varchar(255), -- ← fs_product_contact.subject | Tiêu đề/chủ đề (ví dụ chủ đề email).
  "content" text, -- ← fs_product_contact.content | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "edited_time" timestamptz NOT NULL, -- ← fs_product_contact.edited_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "created_time" timestamptz NOT NULL, -- ← fs_product_contact.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "published" boolean NOT NULL, -- ← fs_product_contact.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "parts_email" varchar(255), -- ← fs_product_contact.parts_email | Danh sách các phần nội dung email.
  "ordering" integer, -- ← fs_product_contact.ordering | Thứ tự sắp xếp hiển thị.
  "website" varchar(255), -- ← fs_product_contact.website | Địa chỉ website.
  "title" varchar(255), -- ← fs_product_contact.title | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "quantity" varchar(255), -- ← fs_product_contact.quantity | Số lượng.
  "message" varchar(255), -- ← fs_product_contact.message | Nội dung tin nhắn/thông điệp.
  "company" varchar(255), -- ← fs_product_contact.company | Tên công ty.
  "country" varchar(255), -- ← fs_product_contact.country | Quốc gia.
  "type" varchar(255), -- ← fs_product_contact.type | Loại/phân loại của bản ghi.
  "products_id" integer REFERENCES cic_products(id), -- ← fs_product_contact.products_id | ✅ FK CHUẨN: Bảng đích products tồn tại rõ ràng trong schema này — khai báo REFERENCES products(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "products_alias" varchar(255), -- ← fs_product_contact.products_alias | Alias của sản phẩm.
  "products_name" varchar(255), -- ← fs_product_contact.products_name | Tên sản phẩm.
  "version" varchar(255), -- ← fs_product_contact.version | Phiên bản.
  "type_id" varchar(255) -- ← fs_product_contact.type_id | ⚠️ THIẾU BẢNG THAM CHIẾU — LEGACY: Không có dữ liệu. Ý nghĩa nghiệp vụ chưa xác định — khác với cột "type" đã có sẵn trong bảng. Không FK, không index.
);

-- Nhà sản xuất / nhà máy / thương hiệu sản phẩm.
DROP TABLE IF EXISTS "cic_manufactories" CASCADE;
CREATE TABLE "cic_manufactories" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_manufactories.id / fs_manufactories_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "code" varchar(255), -- ← fs_manufactories.code | Mã định danh dạng chuỗi (mã code) của đối tượng.
  "tablenames" varchar(255), -- ← fs_manufactories.tablenames | Tên các bảng liên kết (có thể nhiều bảng).
  "published" boolean, -- ← fs_manufactories.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer, -- ← fs_manufactories.ordering | Thứ tự sắp xếp hiển thị.
  "created_time" timestamptz, -- ← fs_manufactories.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "image" varchar(255), -- ← fs_manufactories.image | Đường dẫn ảnh chính.
  "first_toll" varchar(255), -- ← fs_manufactories.first_toll | Chi phí/mức phí ban đầu.
  "show_in_homepage" boolean, -- ← fs_manufactories.show_in_homepage | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "prefix_name" varchar(255), -- ← fs_manufactories.prefix_name | Tiền tố gắn trước tên.
  "old_id" integer, -- ← fs_manufactories.old_id | Giữ tạm để đối chiếu dữ liệu trong lúc migrate; có thể xoá sau khi xác nhận không còn tham chiếu.
  "updated_time" timestamptz, -- ← fs_manufactories.updated_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "color_code" varchar(255), -- ← fs_manufactories.color_code | Mã màu.
  "is_retail" boolean, -- ← fs_manufactories.is_retail | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_common" boolean, -- ← fs_manufactories.is_common | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "name" varchar(255), -- ← fs_manufactories.name + fs_manufactories_en.name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "alias" varchar(255), -- ← fs_manufactories.alias + fs_manufactories_en.alias | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "description" text, -- ← fs_manufactories.description + fs_manufactories_en.description | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_title" varchar(255), -- ← fs_manufactories.seo_title + fs_manufactories_en.seo_title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_keyword" varchar(255), -- ← fs_manufactories.seo_keyword + fs_manufactories_en.seo_keyword | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_description" varchar(255), -- ← fs_manufactories.seo_description + fs_manufactories_en.seo_description | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "content" text, -- ← fs_manufactories.content + fs_manufactories_en.content | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "country" varchar(255) NULL DEFAULT NULL, -- ← — (cột mới) | [MỚI] Quốc gia sản xuất — form Hãng sản xuất đang có field này nhưng DB chưa có. Nullable, không tự sinh dữ liệu cho bản ghi legacy.
  "website" varchar(2048) NULL DEFAULT NULL -- ← — (cột mới) | [MỚI] Website chính thức của Hãng. Nullable; URL được validate/render ở tầng ứng dụng.
);

-- Nhà sản xuất / nhà máy / thương hiệu sản phẩm.
DROP TABLE IF EXISTS "cic_manufactories_en" CASCADE;
CREATE TABLE "cic_manufactories_en" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_manufactories.id / fs_manufactories_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "code" varchar(255), -- ← fs_manufactories.code · fs_manufactories_en.code | Mã định danh dạng chuỗi (mã code) của đối tượng.
  "tablenames" varchar(255), -- ← fs_manufactories.tablenames · fs_manufactories_en.tablenames | Tên các bảng liên kết (có thể nhiều bảng).
  "published" boolean, -- ← fs_manufactories.published · fs_manufactories_en.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer, -- ← fs_manufactories.ordering · fs_manufactories_en.ordering | Thứ tự sắp xếp hiển thị.
  "created_time" timestamptz, -- ← fs_manufactories.created_time · fs_manufactories_en.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "image" varchar(255), -- ← fs_manufactories.image · fs_manufactories_en.image | Đường dẫn ảnh chính.
  "first_toll" varchar(255), -- ← fs_manufactories.first_toll · fs_manufactories_en.first_toll | Chi phí/mức phí ban đầu.
  "show_in_homepage" boolean, -- ← fs_manufactories.show_in_homepage · fs_manufactories_en.show_in_homepage | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "prefix_name" varchar(255), -- ← fs_manufactories.prefix_name · fs_manufactories_en.prefix_name | Tiền tố gắn trước tên.
  "old_id" integer, -- ← fs_manufactories.old_id · fs_manufactories_en.old_id | Giữ tạm để đối chiếu dữ liệu trong lúc migrate; có thể xoá sau khi xác nhận không còn tham chiếu.
  "updated_time" timestamptz, -- ← fs_manufactories.updated_time · fs_manufactories_en.updated_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "color_code" varchar(255), -- ← fs_manufactories.color_code · fs_manufactories_en.color_code | Mã màu.
  "is_retail" boolean, -- ← fs_manufactories.is_retail · fs_manufactories_en.is_retail | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_common" boolean, -- ← fs_manufactories.is_common · fs_manufactories_en.is_common | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "name" varchar(255), -- ← fs_manufactories.name + fs_manufactories_en.name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "alias" varchar(255), -- ← fs_manufactories.alias + fs_manufactories_en.alias | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "description" text, -- ← fs_manufactories.description + fs_manufactories_en.description | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_title" varchar(255), -- ← fs_manufactories.seo_title + fs_manufactories_en.seo_title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_keyword" varchar(255), -- ← fs_manufactories.seo_keyword + fs_manufactories_en.seo_keyword | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_description" varchar(255), -- ← fs_manufactories.seo_description + fs_manufactories_en.seo_description | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "content" text, -- ← fs_manufactories.content + fs_manufactories_en.content | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "country" varchar(255) NULL DEFAULT NULL, -- ← — (cột mới) | [MỚI] Quốc gia sản xuất — workspace EN, giữ đúng contract tương ứng với bảng VI.
  "website" varchar(2048) NULL DEFAULT NULL -- ← — (cột mới) | [MỚI] Website chính thức của Hãng — workspace EN. Không backfill nội dung không tồn tại.
);

-- Đơn hàng của khách.
DROP TABLE IF EXISTS "cic_order" CASCADE;
CREATE TABLE "cic_order" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_order.id | Khoá chính tự tăng, dùng identity thay AUTO_INCREMENT.
  "username" varchar(255), -- ← fs_order.username | Tên đăng nhập.
  "email" varchar(255), -- ← fs_order.email | Địa chỉ email.
  "products_id" varchar(100), -- ← fs_order.products_id | ⚠ DEPRECATED — chỉ 2 dòng dữ liệu, không có bản ghi nào sau 2020; giữ lại tạm thời để đối chiếu dữ liệu cũ, KHÔNG dùng cho tính năng mới và không cần migrate dữ liệu mới vào cột này.
  "buy_direct" integer, -- ← fs_order.buy_direct | Cho phép mua trực tiếp (không qua giỏ hàng).
  "is_temporary" boolean, -- ← fs_order.is_temporary | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "session_id" varchar(100), -- ← fs_order.session_id | ℹ️ KHÔNG PHẢI KHOÁ NGOẠI THẬT — Đây là chuỗi định danh phiên làm việc tạm thời (session id, thường do PHP session hoặc client tự sinh) dùng để nhóm các bản ghi tạm trước khi có record_id chính thức, KHÔNG trỏ tới một bảng dữ liệu nào. Không có bảng "sessions" trong hệ thống — không FK, không cần index cho mục đích tham chiếu (nếu cần tra cứu nhanh theo session thì đã có sẵn ở nhóm index alias/FK khác nếu áp dụng).
  "sender_name" varchar(100), -- ← fs_order.sender_name | Tên người gửi.
  "sender_sex" varchar(50), -- ← fs_order.sender_sex | Giới tính người gửi.
  "sender_address" varchar(100), -- ← fs_order.sender_address | Địa chỉ người gửi.
  "sender_email" varchar(50), -- ← fs_order.sender_email | Email người gửi.
  "sender_telephone" varchar(50), -- ← fs_order.sender_telephone | Số điện thoại người gửi.
  "sender_comments" text, -- ← fs_order.sender_comments | Ghi chú/lời nhắn của người gửi.
  "recipients_name" varchar(100) NOT NULL DEFAULT '', -- ← fs_order.recipients_name | Tên người nhận.
  "recipients_sex" varchar(50), -- ← fs_order.recipients_sex | Giới tính người nhận.
  "recipients_address" varchar(100), -- ← fs_order.recipients_address | Địa chỉ người nhận.
  "recipients_email" varchar(50), -- ← fs_order.recipients_email | Email người nhận.
  "recipients_telephone" varchar(50), -- ← fs_order.recipients_telephone | Số điện thoại người nhận.
  "recipients_mobile" varchar(50), -- ← fs_order.recipients_mobile | Số điện thoại di động người nhận.
  "recipients_comments" text, -- ← fs_order.recipients_comments | Ghi chú/lời nhắn của người nhận.
  "recipients_here" boolean, -- ← fs_order.recipients_here | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "received_time" timestamptz, -- ← fs_order.received_time | Thời điểm nhận (email/đơn hàng).
  "payment_method" integer, -- ← fs_order.payment_method | Phương thức thanh toán.
  "transfer_method" integer, -- ← fs_order.transfer_method | Hình thức vận chuyển/chuyển khoản.
  "created_time" timestamptz, -- ← fs_order.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "edited_time" timestamptz, -- ← fs_order.edited_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "is_activated" integer, -- ← fs_order.is_activated | Đánh dấu tài khoản đã kích hoạt.
  "total_before_discount" double precision, -- ← fs_order.total_before_discount | Tổng tiền trước khi giảm giá.
  "total_after_discount" double precision, -- ← fs_order.total_after_discount | Tổng tiền sau khi giảm giá.
  "total_end" double precision, -- ← fs_order.total_end | Tổng cộng cuối cùng.
  "member_level" integer, -- ← fs_order.member_level | Cấp bậc/hạng thành viên.
  "member_discount" varchar(11), -- ← fs_order.member_discount | Mức giảm giá dành cho thành viên.
  "products_count" integer, -- ← fs_order.products_count | Số lượng sản phẩm.
  "status" integer NOT NULL, -- ← fs_order.status | Trạng thái của bản ghi.
  "code_order" varchar(50), -- ← fs_order.code_order | Mã đơn hàng.
  "no_people" integer NOT NULL, -- ← fs_order.no_people | Số lượng người liên quan.
  "is_cancel" boolean NOT NULL, -- ← fs_order.is_cancel | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "cancel_people" varchar(255) NOT NULL, -- ← fs_order.cancel_people | Người yêu cầu hủy đơn.
  "cancel_time" timestamptz NOT NULL, -- ← fs_order.cancel_time | Thời điểm hủy đơn.
  "cancel_is_penalty" boolean NOT NULL, -- ← fs_order.cancel_is_penalty | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "cancel_money_penalty" varchar(255) NOT NULL, -- ← fs_order.cancel_money_penalty | Số tiền phạt khi hủy.
  "cancel_username_penalty" varchar(255) NOT NULL, -- ← fs_order.cancel_username_penalty | Tài khoản xử lý phạt khi hủy.
  "cancel_is_compensation" boolean NOT NULL, -- ← fs_order.cancel_is_compensation | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "cancel_money_compensation" varchar(255) NOT NULL, -- ← fs_order.cancel_money_compensation | Số tiền bồi thường khi hủy.
  "cancel_username_compensation" varchar(255) NOT NULL, -- ← fs_order.cancel_username_compensation | Tài khoản xử lý bồi thường khi hủy.
  "status_before_cancel" integer, -- ← fs_order.status_before_cancel | Trạng thái trước khi bị hủy.
  "is_dispute" boolean, -- ← fs_order.is_dispute | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "status_order" boolean, -- ← fs_order.status_order | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "payment_message" varchar(255), -- ← fs_order.payment_message | Thông báo/kết quả trả về từ cổng thanh toán.
  "discount_id" varchar(255), -- ← fs_order.discount_id | LEGACY: KHÔNG đổi tên thành discount_code vì bảng order đã có sẵn cột discount_code khác (fs_order.discount_code, ý nghĩa "Mã giảm giá") — đổi tên sẽ gây trùng cột. Chỉ 2 giá trị phân biệt (1 rỗng), không phải khoá ngoại; không cần FOREIGN KEY. Ý nghĩa nghiệp vụ cụ thể chưa xác nhận.
  "discount_value" varchar(255), -- ← fs_order.discount_value | Giá trị mức giảm.
  "discount_unit" boolean, -- ← fs_order.discount_unit | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "discount_money" varchar(255), -- ← fs_order.discount_money | Số tiền được giảm.
  "discount_code" varchar(255), -- ← fs_order.discount_code | Mã giảm giá.
  "ord_payment_type" integer, -- ← fs_order.ord_payment_type | Loại hình thức thanh toán của đơn hàng.
  "user_id" integer -- ← fs_order.user_id | ⚠️ THIẾU BẢNG THAM CHIẾU / LEGACY: Không có dữ liệu, ý nghĩa nghiệp vụ chưa xác định. Không FK, không index.
);

-- Chi tiết từng sản phẩm trong đơn hàng.
DROP TABLE IF EXISTS "cic_order_items" CASCADE;
CREATE TABLE "cic_order_items" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_order_items.id | Khoá chính tự tăng, dùng identity thay AUTO_INCREMENT.
  "order_id" integer REFERENCES cic_order(id), -- ← fs_order_items.order_id | ✅ FK CHUẨN: Bảng đích order tồn tại rõ ràng trong schema này — khai báo REFERENCES order(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "product_id" integer REFERENCES cic_products(id), -- ← fs_order_items.product_id | ✅ FK CHUẨN: Bảng đích products tồn tại rõ ràng trong schema này — khai báo REFERENCES products(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "price" double precision, -- ← fs_order_items.price | Giá bán.
  "count" integer, -- ← fs_order_items.count | Số lượng/bộ đếm.
  "discount" double precision, -- ← fs_order_items.discount | Giá trị giảm giá.
  "discount_incentives" double precision, -- ← fs_order_items.discount_incentives | Chương trình ưu đãi/khuyến mãi kèm theo.
  "total" double precision, -- ← fs_order_items.total | Tổng giá trị/số lượng.
  "total_after_discount" double precision, -- ← fs_order_items.total_after_discount | Tổng tiền sau khi giảm giá.
  "status" integer, -- ← fs_order_items.status | Trạng thái của bản ghi.
  "estore_id" integer -- ← fs_order_items.estore_id | ⚠️ THIẾU BẢNG THAM CHIẾU — LEGACY: Store reference. Referenced trong 12 file (chỉ đọc session tại libraries/fsmodels.php:175), không tìm thấy nơi set $_SESSION['estore_id']. Runtime verification required — không FK, không index.
);

-- Banner quảng cáo hiển thị trên site.
DROP TABLE IF EXISTS "cic_banners" CASCADE;
CREATE TABLE "cic_banners" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_banners.id / fs_banners_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "category_id" integer, -- ← fs_banners.category_id | ✅ FK CHUẨN: Bảng đích banners_categories tồn tại rõ ràng trong schema này — khai báo REFERENCES banners_categories(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "type" integer, -- ← fs_banners.type | Loại/phân loại của bản ghi.
  "image" varchar(255), -- ← fs_banners.image | Đường dẫn ảnh chính.
  "icon" varchar(255), -- ← fs_banners.icon | Đường dẫn/tên biểu tượng (icon).
  "flash" varchar(255), -- ← fs_banners.flash | Nội dung/banner dạng Flash (công nghệ cũ).
  "width" integer NOT NULL, -- ← fs_banners.width | Chiều rộng (ảnh/sản phẩm).
  "height" integer NOT NULL, -- ← fs_banners.height | Chiều cao (ảnh/sản phẩm).
  "link" varchar(255), -- ← fs_banners.link | Đường dẫn liên kết.
  "hits" integer NOT NULL, -- ← fs_banners.hits | Tổng lượt xem/truy cập.
  "created_time" timestamptz, -- ← fs_banners.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "edited_time" timestamptz, -- ← fs_banners.edited_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "published" boolean, -- ← fs_banners.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer, -- ← fs_banners.ordering | Thứ tự sắp xếp hiển thị.
  "news_categories" varchar(255), -- ← fs_banners.news_categories | Tên/mã danh mục tin tức liên kết.
  "news_categories_alias" varchar(255), -- ← fs_banners.news_categories_alias | Alias danh mục tin tức liên kết.
  "products_categories" varchar(255), -- ← fs_banners.products_categories | Tên/mã danh mục sản phẩm liên kết.
  "products_categories_alias" varchar(255), -- ← fs_banners.products_categories_alias | Alias danh mục sản phẩm liên kết.
  "listItemid" varchar(255), -- ← fs_banners.listItemid | Danh sách ID các mục (dạng chuỗi phân tách).
  "order_id" integer, -- ← fs_banners.order_id | ⚠️ THIẾU BẢNG THAM CHIẾU — ⚠ CẦN XÁC NHẬN NGHIỆP VỤ — Có nhiều hơn 1 bảng đích khả dĩ: order (đơn hàng thật) hoặc chỉ là thứ tự hiển thị — 2 cách hiểu khác nhau. Không tự suy đoán vì đây là vùng rủi ro cao (Sản phẩm/Đơn hàng/Banner thương mại) — cần xác nhận với đội nghiệp vụ trước khi gắn FK, tạm thời giữ nguyên không FK, không index.
  "user_id" integer, -- ← fs_banners.user_id | ⚠️ THIẾU BẢNG THAM CHIẾU — ⚠ CẦN XÁC NHẬN NGHIỆP VỤ — Có nhiều hơn 1 bảng đích khả dĩ: users (admin) hoặc members (khách hàng mua banner) — chưa rõ banner do ai khởi tạo. Không tự suy đoán vì đây là vùng rủi ro cao (Sản phẩm/Đơn hàng/Banner thương mại) — cần xác nhận với đội nghiệp vụ trước khi gắn FK, tạm thời giữ nguyên không FK, không index.
  "order_id_item" integer, -- ← fs_banners.order_id_item | Mã dòng sản phẩm trong đơn hàng.
  "total_usage" integer, -- ← fs_banners.total_usage | Tổng số lần sử dụng.
  "days" integer, -- ← fs_banners.days | Số ngày.
  "is_use" boolean, -- ← fs_banners.is_use | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "date_start" timestamptz, -- ← fs_banners.date_start | Ngày bắt đầu.
  "date_end" timestamptz, -- ← fs_banners.date_end | Ngày kết thúc.
  "check_link" integer, -- ← fs_banners.check_link | Kiểm tra/đánh dấu liên kết hợp lệ.
  "is_types" boolean, -- ← fs_banners.is_types | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "status" integer, -- ← fs_banners.status | Trạng thái của bản ghi.
  "user_admin_name" varchar(255), -- ← fs_banners.user_admin_name | Tên tài khoản quản trị liên quan.
  "link_video" varchar(255), -- ← fs_banners.link_video | Liên kết video (ví dụ YouTube).
  "user_admin" integer, -- ← fs_banners.user_admin | Tài khoản quản trị liên quan.
  "el_user_name" varchar(255), -- ← fs_banners.el_user_name | Tên người dùng (trường mở rộng).
  "el_info" text, -- ← fs_banners.el_info | Thông tin bổ sung (trường mở rộng).
  "el_address" varchar(255), -- ← fs_banners.el_address | Địa chỉ (trường mở rộng - extend field).
  "el_mobilephone" varchar(255), -- ← fs_banners.el_mobilephone | Số điện thoại di động (trường mở rộng).
  "el_link_website" varchar(255), -- ← fs_banners.el_link_website | Liên kết website (trường mở rộng).
  "el_link_facebook" varchar(255), -- ← fs_banners.el_link_facebook | Liên kết Facebook (trường mở rộng).
  "name" varchar(255), -- ← fs_banners.name + fs_banners_en.name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "alias" varchar(255), -- ← fs_banners.alias + fs_banners_en.alias | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "description" varchar(255), -- ← fs_banners.description + fs_banners_en.description | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "content" text, -- ← fs_banners.content + fs_banners_en.content | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "contents_categories" varchar(255), -- ← fs_banners.contents_categories + fs_banners_en.contents_categories | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "contents_categories_alias" varchar(255), -- ← fs_banners.contents_categories_alias + fs_banners_en.contents_categories_alias | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "summary" text, -- ← fs_banners.summary + fs_banners_en.summary | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "category_name" varchar(255), -- ← fs_banners.category_name + fs_banners_en.category_name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "actflg" varchar(1) NULL, -- ← fs_banners.actflg | Giữ để migrate đầy đủ dữ liệu legacy. Cờ trạng thái hoạt động (Active Flag) — trường kỹ thuật kế thừa từ hệ thống khác.
  "ctdusr" varchar(5) NULL, -- ← fs_banners.ctdusr | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: người dùng tạo bản ghi (Created User).
  "ctdwks" varchar(15) NULL, -- ← fs_banners.ctdwks | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: trạm làm việc tạo bản ghi (Created Workstation).
  "ctddtm" timestamptz NULL, -- ← fs_banners.ctddtm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: ngày giờ tạo bản ghi (Created Date-Time).
  "mdfusr" varchar(5) NULL, -- ← fs_banners.mdfusr | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: người chỉnh sửa gần nhất (Modified User).
  "mdfwks" varchar(15) NULL, -- ← fs_banners.mdfwks | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: trạm làm việc chỉnh sửa gần nhất (Modified Workstation).
  "lstmdf" timestamptz NULL, -- ← fs_banners.lstmdf | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: lần chỉnh sửa cuối (Last Modified).
  "cdtpgm" varchar(20) NULL, -- ← fs_banners.cdtpgm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: chương trình tạo bản ghi (Created Program) — thường từ hệ thống cũ.
  "mdfpgm" varchar(20) NULL -- ← fs_banners.mdfpgm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: chương trình chỉnh sửa gần nhất (Modified Program).
);

-- Banner quảng cáo hiển thị trên site.
DROP TABLE IF EXISTS "cic_banners_en" CASCADE;
CREATE TABLE "cic_banners_en" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_banners.id / fs_banners_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "category_id" integer, -- ← fs_banners.category_id · fs_banners_en.category_id | ✅ FK CHUẨN: Bảng đích banners_categories_en tồn tại rõ ràng trong schema này — khai báo REFERENCES banners_categories_en(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "type" integer, -- ← fs_banners.type · fs_banners_en.type | Loại/phân loại của bản ghi.
  "image" varchar(255), -- ← fs_banners.image · fs_banners_en.image | Đường dẫn ảnh chính.
  "icon" varchar(255), -- ← fs_banners.icon · fs_banners_en.icon | Đường dẫn/tên biểu tượng (icon).
  "flash" varchar(255), -- ← fs_banners.flash · fs_banners_en.flash | Nội dung/banner dạng Flash (công nghệ cũ).
  "width" integer NOT NULL, -- ← fs_banners.width · fs_banners_en.width | Chiều rộng (ảnh/sản phẩm).
  "height" integer NOT NULL, -- ← fs_banners.height · fs_banners_en.height | Chiều cao (ảnh/sản phẩm).
  "link" varchar(255), -- ← fs_banners.link · fs_banners_en.link | Đường dẫn liên kết.
  "hits" integer NOT NULL, -- ← fs_banners.hits · fs_banners_en.hits | Tổng lượt xem/truy cập.
  "created_time" timestamptz, -- ← fs_banners.created_time · fs_banners_en.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "edited_time" timestamptz, -- ← fs_banners.edited_time · fs_banners_en.edited_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "published" boolean, -- ← fs_banners.published · fs_banners_en.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer, -- ← fs_banners.ordering · fs_banners_en.ordering | Thứ tự sắp xếp hiển thị.
  "news_categories" varchar(255), -- ← fs_banners.news_categories · fs_banners_en.news_categories | Tên/mã danh mục tin tức liên kết.
  "news_categories_alias" varchar(255), -- ← fs_banners.news_categories_alias · fs_banners_en.news_categories_alias | Alias danh mục tin tức liên kết.
  "products_categories" varchar(255), -- ← fs_banners.products_categories · fs_banners_en.products_categories | Tên/mã danh mục sản phẩm liên kết.
  "products_categories_alias" varchar(255), -- ← fs_banners.products_categories_alias · fs_banners_en.products_categories_alias | Alias danh mục sản phẩm liên kết.
  "listItemid" varchar(255), -- ← fs_banners.listItemid · fs_banners_en.listItemid | Danh sách ID các mục (dạng chuỗi phân tách).
  "order_id" integer, -- ← fs_banners.order_id · fs_banners_en.order_id | ⚠️ THIẾU BẢNG THAM CHIẾU — ⚠ CẦN XÁC NHẬN NGHIỆP VỤ — Có nhiều hơn 1 bảng đích khả dĩ: order (đơn hàng thật) hoặc chỉ là thứ tự hiển thị — 2 cách hiểu khác nhau. Không tự suy đoán vì đây là vùng rủi ro cao (Sản phẩm/Đơn hàng/Banner thương mại) — cần xác nhận với đội nghiệp vụ trước khi gắn FK, tạm thời giữ nguyên không FK, không index.
  "user_id" integer, -- ← fs_banners.user_id · fs_banners_en.user_id | ⚠️ THIẾU BẢNG THAM CHIẾU — ⚠ CẦN XÁC NHẬN NGHIỆP VỤ — Có nhiều hơn 1 bảng đích khả dĩ: users (admin) hoặc members (khách hàng mua banner) — chưa rõ banner do ai khởi tạo. Không tự suy đoán vì đây là vùng rủi ro cao (Sản phẩm/Đơn hàng/Banner thương mại) — cần xác nhận với đội nghiệp vụ trước khi gắn FK, tạm thời giữ nguyên không FK, không index.
  "order_id_item" integer, -- ← fs_banners.order_id_item · fs_banners_en.order_id_item | Mã dòng sản phẩm trong đơn hàng.
  "total_usage" integer, -- ← fs_banners.total_usage · fs_banners_en.total_usage | Tổng số lần sử dụng.
  "days" integer, -- ← fs_banners.days · fs_banners_en.days | Số ngày.
  "is_use" boolean, -- ← fs_banners.is_use · fs_banners_en.is_use | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "date_start" timestamptz, -- ← fs_banners.date_start · fs_banners_en.date_start | Ngày bắt đầu.
  "date_end" timestamptz, -- ← fs_banners.date_end · fs_banners_en.date_end | Ngày kết thúc.
  "check_link" integer, -- ← fs_banners.check_link · fs_banners_en.check_link | Kiểm tra/đánh dấu liên kết hợp lệ.
  "is_types" boolean, -- ← fs_banners.is_types · fs_banners_en.is_types | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "status" integer, -- ← fs_banners.status · fs_banners_en.status | Trạng thái của bản ghi.
  "user_admin_name" varchar(255), -- ← fs_banners.user_admin_name · fs_banners_en.user_admin_name | Tên tài khoản quản trị liên quan.
  "link_video" varchar(255), -- ← fs_banners.link_video · fs_banners_en.link_video | Liên kết video (ví dụ YouTube).
  "user_admin" integer, -- ← fs_banners.user_admin | Tài khoản quản trị liên quan.
  "el_user_name" varchar(255), -- ← fs_banners.el_user_name · fs_banners_en.el_user_name | Tên người dùng (trường mở rộng).
  "el_info" text, -- ← fs_banners.el_info · fs_banners_en.el_info | Thông tin bổ sung (trường mở rộng).
  "el_address" varchar(255), -- ← fs_banners.el_address · fs_banners_en.el_address | Địa chỉ (trường mở rộng - extend field).
  "el_mobilephone" varchar(255), -- ← fs_banners.el_mobilephone · fs_banners_en.el_mobilephone | Số điện thoại di động (trường mở rộng).
  "el_link_website" varchar(255), -- ← fs_banners.el_link_website · fs_banners_en.el_link_website | Liên kết website (trường mở rộng).
  "el_link_facebook" varchar(255), -- ← fs_banners.el_link_facebook · fs_banners_en.el_link_facebook | Liên kết Facebook (trường mở rộng).
  "name" varchar(255), -- ← fs_banners.name + fs_banners_en.name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "alias" varchar(255), -- ← fs_banners.alias + fs_banners_en.alias | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "description" varchar(255), -- ← fs_banners.description + fs_banners_en.description | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "content" text, -- ← fs_banners.content + fs_banners_en.content | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "contents_categories" varchar(255), -- ← fs_banners.contents_categories + fs_banners_en.contents_categories | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "contents_categories_alias" varchar(255), -- ← fs_banners.contents_categories_alias + fs_banners_en.contents_categories_alias | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "summary" text, -- ← fs_banners.summary + fs_banners_en.summary | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "category_name" varchar(255), -- ← fs_banners.category_name + fs_banners_en.category_name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "actflg" varchar(1) NULL, -- ← fs_banners_en.actflg | Giữ để migrate đầy đủ dữ liệu legacy. Cờ trạng thái hoạt động (Active Flag) — trường kỹ thuật kế thừa từ hệ thống khác.
  "ctdusr" varchar(5) NULL, -- ← fs_banners_en.ctdusr | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: người dùng tạo bản ghi (Created User).
  "ctdwks" varchar(15) NULL, -- ← fs_banners_en.ctdwks | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: trạm làm việc tạo bản ghi (Created Workstation).
  "ctddtm" timestamptz NULL, -- ← fs_banners_en.ctddtm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: ngày giờ tạo bản ghi (Created Date-Time).
  "mdfusr" varchar(5) NULL, -- ← fs_banners_en.mdfusr | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: người chỉnh sửa gần nhất (Modified User).
  "mdfwks" varchar(15) NULL, -- ← fs_banners_en.mdfwks | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: trạm làm việc chỉnh sửa gần nhất (Modified Workstation).
  "lstmdf" timestamptz NULL, -- ← fs_banners_en.lstmdf | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: lần chỉnh sửa cuối (Last Modified).
  "cdtpgm" varchar(20) NULL, -- ← fs_banners_en.cdtpgm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: chương trình tạo bản ghi (Created Program) — thường từ hệ thống cũ.
  "mdfpgm" varchar(20) NULL -- ← fs_banners_en.mdfpgm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: chương trình chỉnh sửa gần nhất (Modified Program).
);

-- Danh mục/vị trí nhóm banner.
DROP TABLE IF EXISTS "cic_banners_categories" CASCADE;
CREATE TABLE "cic_banners_categories" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_banners_categories.id / fs_banners_categories_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "published" boolean NOT NULL, -- ← fs_banners_categories.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer, -- ← fs_banners_categories.ordering | Thứ tự sắp xếp hiển thị.
  "created_time" timestamptz, -- ← fs_banners_categories.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "updated_time" timestamptz, -- ← fs_banners_categories.updated_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "price" double precision, -- ← fs_banners_categories.price | Giá bán.
  "days" integer, -- ← fs_banners_categories.days | Số ngày.
  "is_types" boolean, -- ← fs_banners_categories.is_types | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_service" boolean, -- ← fs_banners_categories.is_service | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "width" integer, -- ← fs_banners_categories.width | Chiều rộng (ảnh/sản phẩm).
  "height" integer, -- ← fs_banners_categories.height | Chiều cao (ảnh/sản phẩm).
  "quantity" integer, -- ← fs_banners_categories.quantity | Số lượng.
  "check_unlimit" boolean, -- ← fs_banners_categories.check_unlimit | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "quantity_use" integer, -- ← fs_banners_categories.quantity_use | ⚠ CACHE CÓ THỂ LỆCH so với số lượng banner thực tế (4 category test có quantity_use=0 nhưng thực tế >0) — cần trigger hoặc job đồng bộ định kỳ, xem UPDATE đồng bộ trong migration script.
  "link_post" varchar(255), -- ← fs_banners_categories.link_post | Liên kết bài viết.
  "name" varchar(255), -- ← fs_banners_categories.name + fs_banners_categories_en.name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "summary" text, -- ← fs_banners_categories.summary + fs_banners_categories_en.summary | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "actflg" varchar(1) NULL, -- ← fs_banners_categories.actflg | Giữ để migrate đầy đủ dữ liệu legacy. Cờ trạng thái hoạt động (Active Flag) — trường kỹ thuật kế thừa từ hệ thống khác.
  "ctdusr" varchar(5) NULL, -- ← fs_banners_categories.ctdusr | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: người dùng tạo bản ghi (Created User).
  "ctdwks" varchar(15) NULL, -- ← fs_banners_categories.ctdwks | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: trạm làm việc tạo bản ghi (Created Workstation).
  "ctddtm" timestamptz NULL, -- ← fs_banners_categories.ctddtm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: ngày giờ tạo bản ghi (Created Date-Time).
  "mdfusr" varchar(5) NULL, -- ← fs_banners_categories.mdfusr | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: người chỉnh sửa gần nhất (Modified User).
  "mdfwks" varchar(15) NULL, -- ← fs_banners_categories.mdfwks | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: trạm làm việc chỉnh sửa gần nhất (Modified Workstation).
  "lstmdf" timestamptz NULL, -- ← fs_banners_categories.lstmdf | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: lần chỉnh sửa cuối (Last Modified).
  "cdtpgm" varchar(20) NULL, -- ← fs_banners_categories.cdtpgm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: chương trình tạo bản ghi (Created Program) — thường từ hệ thống cũ.
  "mdfpgm" varchar(20) NULL -- ← fs_banners_categories.mdfpgm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: chương trình chỉnh sửa gần nhất (Modified Program).
);

-- Danh mục/vị trí nhóm banner.
DROP TABLE IF EXISTS "cic_banners_categories_en" CASCADE;
CREATE TABLE "cic_banners_categories_en" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_banners_categories.id / fs_banners_categories_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "published" boolean NOT NULL, -- ← fs_banners_categories.published · fs_banners_categories_en.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer, -- ← fs_banners_categories.ordering · fs_banners_categories_en.ordering | Thứ tự sắp xếp hiển thị.
  "created_time" timestamptz, -- ← fs_banners_categories.created_time · fs_banners_categories_en.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "updated_time" timestamptz, -- ← fs_banners_categories.updated_time · fs_banners_categories_en.updated_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "price" double precision, -- ← fs_banners_categories.price · fs_banners_categories_en.price | Giá bán.
  "days" integer, -- ← fs_banners_categories.days · fs_banners_categories_en.days | Số ngày.
  "is_types" boolean, -- ← fs_banners_categories.is_types · fs_banners_categories_en.is_types | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_service" boolean, -- ← fs_banners_categories.is_service · fs_banners_categories_en.is_service | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "width" integer, -- ← fs_banners_categories.width · fs_banners_categories_en.width | Chiều rộng (ảnh/sản phẩm).
  "height" integer, -- ← fs_banners_categories.height · fs_banners_categories_en.height | Chiều cao (ảnh/sản phẩm).
  "quantity" integer, -- ← fs_banners_categories.quantity · fs_banners_categories_en.quantity | Số lượng.
  "check_unlimit" boolean, -- ← fs_banners_categories.check_unlimit · fs_banners_categories_en.check_unlimit | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "quantity_use" integer, -- ← fs_banners_categories.quantity_use · fs_banners_categories_en.quantity_use | ⚠ CACHE CÓ THỂ LỆCH so với số lượng banner thực tế (4 category test có quantity_use=0 nhưng thực tế >0) — cần trigger hoặc job đồng bộ định kỳ, xem UPDATE đồng bộ trong migration script.
  "link_post" varchar(255), -- ← fs_banners_categories.link_post · fs_banners_categories_en.link_post | Liên kết bài viết.
  "name" varchar(255), -- ← fs_banners_categories.name + fs_banners_categories_en.name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "summary" text, -- ← fs_banners_categories.summary + fs_banners_categories_en.summary | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "actflg" varchar(1) NULL, -- ← fs_banners_categories_en.actflg | Giữ để migrate đầy đủ dữ liệu legacy. Cờ trạng thái hoạt động (Active Flag) — trường kỹ thuật kế thừa từ hệ thống khác.
  "ctdusr" varchar(5) NULL, -- ← fs_banners_categories_en.ctdusr | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: người dùng tạo bản ghi (Created User).
  "ctdwks" varchar(15) NULL, -- ← fs_banners_categories_en.ctdwks | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: trạm làm việc tạo bản ghi (Created Workstation).
  "ctddtm" timestamptz NULL, -- ← fs_banners_categories_en.ctddtm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: ngày giờ tạo bản ghi (Created Date-Time).
  "mdfusr" varchar(5) NULL, -- ← fs_banners_categories_en.mdfusr | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: người chỉnh sửa gần nhất (Modified User).
  "mdfwks" varchar(15) NULL, -- ← fs_banners_categories_en.mdfwks | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: trạm làm việc chỉnh sửa gần nhất (Modified Workstation).
  "lstmdf" timestamptz NULL, -- ← fs_banners_categories_en.lstmdf | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: lần chỉnh sửa cuối (Last Modified).
  "cdtpgm" varchar(20) NULL, -- ← fs_banners_categories_en.cdtpgm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: chương trình tạo bản ghi (Created Program) — thường từ hệ thống cũ.
  "mdfpgm" varchar(20) NULL -- ← fs_banners_categories_en.mdfpgm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: chương trình chỉnh sửa gần nhất (Modified Program).
);

-- Ảnh trình chiếu (slideshow) trên trang chủ hoặc trang chuyên mục.
DROP TABLE IF EXISTS "cic_slideshow" CASCADE;
CREATE TABLE "cic_slideshow" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_slideshow.id / fs_slideshow_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "url" varchar(255), -- ← fs_slideshow.url | Đường dẫn URL.
  "image" varchar(255), -- ← fs_slideshow.image | Đường dẫn ảnh chính.
  "image_thumb" varchar(255), -- ← fs_slideshow.image_thumb | Đường dẫn ảnh thu nhỏ (thumbnail).
  "created_time" timestamptz, -- ← fs_slideshow.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "edited_time" timestamptz, -- ← fs_slideshow.edited_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "published" boolean, -- ← fs_slideshow.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer, -- ← fs_slideshow.ordering | Thứ tự sắp xếp hiển thị.
  "category_id" integer, -- ← fs_slideshow.category_id | ✅ FK CHUẨN: Bảng đích slideshow_categories tồn tại rõ ràng trong schema này — khai báo REFERENCES slideshow_categories(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "video" varchar(255), -- ← fs_slideshow.video | Đường dẫn/nội dung video.
  "name" varchar(255), -- ← fs_slideshow.name + fs_slideshow_en.name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "summary" text, -- ← fs_slideshow.summary + fs_slideshow_en.summary | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "actflg" varchar(1) NULL, -- ← fs_slideshow.actflg | Giữ để migrate đầy đủ dữ liệu legacy. Cờ trạng thái hoạt động (Active Flag) — trường kỹ thuật kế thừa từ hệ thống khác.
  "ctdusr" varchar(5) NULL, -- ← fs_slideshow.ctdusr | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: người dùng tạo bản ghi (Created User).
  "ctdwks" varchar(15) NULL, -- ← fs_slideshow.ctdwks | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: trạm làm việc tạo bản ghi (Created Workstation).
  "ctddtm" timestamptz NULL, -- ← fs_slideshow.ctddtm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: ngày giờ tạo bản ghi (Created Date-Time).
  "mdfusr" varchar(5) NULL, -- ← fs_slideshow.mdfusr | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: người chỉnh sửa gần nhất (Modified User).
  "mdfwks" varchar(15) NULL, -- ← fs_slideshow.mdfwks | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: trạm làm việc chỉnh sửa gần nhất (Modified Workstation).
  "lstmdf" timestamptz NULL, -- ← fs_slideshow.lstmdf | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: lần chỉnh sửa cuối (Last Modified).
  "cdtpgm" varchar(20) NULL, -- ← fs_slideshow.cdtpgm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: chương trình tạo bản ghi (Created Program) — thường từ hệ thống cũ.
  "mdfpgm" varchar(20) NULL -- ← fs_slideshow.mdfpgm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: chương trình chỉnh sửa gần nhất (Modified Program).
);

-- Ảnh trình chiếu (slideshow) trên trang chủ hoặc trang chuyên mục.
DROP TABLE IF EXISTS "cic_slideshow_en" CASCADE;
CREATE TABLE "cic_slideshow_en" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_slideshow.id / fs_slideshow_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "url" varchar(255), -- ← fs_slideshow.url · fs_slideshow_en.url | Đường dẫn URL.
  "image" varchar(255), -- ← fs_slideshow.image · fs_slideshow_en.image | Đường dẫn ảnh chính.
  "image_thumb" varchar(255), -- ← fs_slideshow.image_thumb · fs_slideshow_en.image_thumb | Đường dẫn ảnh thu nhỏ (thumbnail).
  "created_time" timestamptz, -- ← fs_slideshow.created_time · fs_slideshow_en.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "edited_time" timestamptz, -- ← fs_slideshow.edited_time · fs_slideshow_en.edited_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "published" boolean, -- ← fs_slideshow.published · fs_slideshow_en.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer, -- ← fs_slideshow.ordering · fs_slideshow_en.ordering | Thứ tự sắp xếp hiển thị.
  "category_id" integer, -- ← fs_slideshow.category_id · fs_slideshow_en.category_id | ✅ FK CHUẨN: Bảng đích slideshow_categories_en tồn tại rõ ràng trong schema này — khai báo REFERENCES slideshow_categories_en(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "video" varchar(255), -- ← fs_slideshow.video · fs_slideshow_en.video | Đường dẫn/nội dung video.
  "name" varchar(255), -- ← fs_slideshow.name + fs_slideshow_en.name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "summary" text, -- ← fs_slideshow.summary + fs_slideshow_en.summary | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "actflg" varchar(1) NULL, -- ← fs_slideshow_en.actflg | Giữ để migrate đầy đủ dữ liệu legacy. Cờ trạng thái hoạt động (Active Flag) — trường kỹ thuật kế thừa từ hệ thống khác.
  "ctdusr" varchar(5) NULL, -- ← fs_slideshow_en.ctdusr | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: người dùng tạo bản ghi (Created User).
  "ctdwks" varchar(15) NULL, -- ← fs_slideshow_en.ctdwks | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: trạm làm việc tạo bản ghi (Created Workstation).
  "ctddtm" timestamptz NULL, -- ← fs_slideshow_en.ctddtm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: ngày giờ tạo bản ghi (Created Date-Time).
  "mdfusr" varchar(5) NULL, -- ← fs_slideshow_en.mdfusr | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: người chỉnh sửa gần nhất (Modified User).
  "mdfwks" varchar(15) NULL, -- ← fs_slideshow_en.mdfwks | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: trạm làm việc chỉnh sửa gần nhất (Modified Workstation).
  "lstmdf" timestamptz NULL, -- ← fs_slideshow_en.lstmdf | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: lần chỉnh sửa cuối (Last Modified).
  "cdtpgm" varchar(20) NULL, -- ← fs_slideshow_en.cdtpgm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: chương trình tạo bản ghi (Created Program) — thường từ hệ thống cũ.
  "mdfpgm" varchar(20) NULL -- ← fs_slideshow_en.mdfpgm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: chương trình chỉnh sửa gần nhất (Modified Program).
);

-- Danh mục/nhóm slideshow.
DROP TABLE IF EXISTS "cic_slideshow_categories" CASCADE;
CREATE TABLE "cic_slideshow_categories" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_slideshow_categories.id / fs_slideshow_categories_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "published" boolean NOT NULL, -- ← fs_slideshow_categories.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer, -- ← fs_slideshow_categories.ordering | Thứ tự sắp xếp hiển thị.
  "created_time" timestamptz, -- ← fs_slideshow_categories.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "updated_time" timestamptz, -- ← fs_slideshow_categories.updated_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "width" integer, -- ← fs_slideshow_categories.width | Chiều rộng (ảnh/sản phẩm).
  "height" integer, -- ← fs_slideshow_categories.height | Chiều cao (ảnh/sản phẩm).
  "width_small" integer, -- ← fs_slideshow_categories.width_small | Chiều rộng phiên bản ảnh thu nhỏ.
  "height_small" integer, -- ← fs_slideshow_categories.height_small | Chiều cao phiên bản ảnh thu nhỏ.
  "name" varchar(255), -- ← fs_slideshow_categories.name + fs_slideshow_categories_en.name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "alias" varchar(255), -- ← fs_slideshow_categories.alias + fs_slideshow_categories_en.alias | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "actflg" varchar(1) NULL, -- ← fs_slideshow_categories.actflg | Giữ để migrate đầy đủ dữ liệu legacy. Cờ trạng thái hoạt động (Active Flag) — trường kỹ thuật kế thừa từ hệ thống khác.
  "ctdusr" varchar(5) NULL, -- ← fs_slideshow_categories.ctdusr | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: người dùng tạo bản ghi (Created User).
  "ctdwks" varchar(15) NULL, -- ← fs_slideshow_categories.ctdwks | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: trạm làm việc tạo bản ghi (Created Workstation).
  "ctddtm" timestamptz NULL, -- ← fs_slideshow_categories.ctddtm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: ngày giờ tạo bản ghi (Created Date-Time).
  "mdfusr" varchar(5) NULL, -- ← fs_slideshow_categories.mdfusr | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: người chỉnh sửa gần nhất (Modified User).
  "mdfwks" varchar(15) NULL, -- ← fs_slideshow_categories.mdfwks | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: trạm làm việc chỉnh sửa gần nhất (Modified Workstation).
  "lstmdf" timestamptz NULL, -- ← fs_slideshow_categories.lstmdf | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: lần chỉnh sửa cuối (Last Modified).
  "cdtpgm" varchar(20) NULL, -- ← fs_slideshow_categories.cdtpgm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: chương trình tạo bản ghi (Created Program) — thường từ hệ thống cũ.
  "mdfpgm" varchar(20) NULL -- ← fs_slideshow_categories.mdfpgm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: chương trình chỉnh sửa gần nhất (Modified Program).
);

-- Danh mục/nhóm slideshow.
DROP TABLE IF EXISTS "cic_slideshow_categories_en" CASCADE;
CREATE TABLE "cic_slideshow_categories_en" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_slideshow_categories.id / fs_slideshow_categories_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "published" boolean NOT NULL, -- ← fs_slideshow_categories.published · fs_slideshow_categories_en.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer, -- ← fs_slideshow_categories.ordering · fs_slideshow_categories_en.ordering | Thứ tự sắp xếp hiển thị.
  "created_time" timestamptz, -- ← fs_slideshow_categories.created_time · fs_slideshow_categories_en.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "updated_time" timestamptz, -- ← fs_slideshow_categories.updated_time · fs_slideshow_categories_en.updated_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "width" integer, -- ← fs_slideshow_categories.width · fs_slideshow_categories_en.width | Chiều rộng (ảnh/sản phẩm).
  "height" integer, -- ← fs_slideshow_categories.height · fs_slideshow_categories_en.height | Chiều cao (ảnh/sản phẩm).
  "width_small" integer, -- ← fs_slideshow_categories.width_small · fs_slideshow_categories_en.width_small | Chiều rộng phiên bản ảnh thu nhỏ.
  "height_small" integer, -- ← fs_slideshow_categories.height_small · fs_slideshow_categories_en.height_small | Chiều cao phiên bản ảnh thu nhỏ.
  "name" varchar(255), -- ← fs_slideshow_categories.name + fs_slideshow_categories_en.name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "alias" varchar(255), -- ← fs_slideshow_categories.alias + fs_slideshow_categories_en.alias | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "actflg" varchar(1) NULL, -- ← fs_slideshow_categories_en.actflg | Giữ để migrate đầy đủ dữ liệu legacy. Cờ trạng thái hoạt động (Active Flag) — trường kỹ thuật kế thừa từ hệ thống khác.
  "ctdusr" varchar(5) NULL, -- ← fs_slideshow_categories_en.ctdusr | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: người dùng tạo bản ghi (Created User).
  "ctdwks" varchar(15) NULL, -- ← fs_slideshow_categories_en.ctdwks | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: trạm làm việc tạo bản ghi (Created Workstation).
  "ctddtm" timestamptz NULL, -- ← fs_slideshow_categories_en.ctddtm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: ngày giờ tạo bản ghi (Created Date-Time).
  "mdfusr" varchar(5) NULL, -- ← fs_slideshow_categories_en.mdfusr | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: người chỉnh sửa gần nhất (Modified User).
  "mdfwks" varchar(15) NULL, -- ← fs_slideshow_categories_en.mdfwks | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: trạm làm việc chỉnh sửa gần nhất (Modified Workstation).
  "lstmdf" timestamptz NULL, -- ← fs_slideshow_categories_en.lstmdf | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: lần chỉnh sửa cuối (Last Modified).
  "cdtpgm" varchar(20) NULL, -- ← fs_slideshow_categories_en.cdtpgm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: chương trình tạo bản ghi (Created Program) — thường từ hệ thống cũ.
  "mdfpgm" varchar(20) NULL -- ← fs_slideshow_categories_en.mdfpgm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: chương trình chỉnh sửa gần nhất (Modified Program).
);

-- Thông tin liên hệ (form liên hệ khách gửi tới).
DROP TABLE IF EXISTS "cic_contact" CASCADE;
CREATE TABLE "cic_contact" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_contact.id / fs_contact_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "email" varchar(255) NOT NULL, -- ← fs_contact.email | Địa chỉ email.
  "fullname" varchar(255), -- ← fs_contact.fullname | Họ và tên đầy đủ.
  "telephone" varchar(255), -- ← fs_contact.telephone | Số điện thoại.
  "fax" varchar(255), -- ← fs_contact.fax | Số fax.
  "subject" varchar(255), -- ← fs_contact.subject | Tiêu đề/chủ đề (ví dụ chủ đề email).
  "edited_time" timestamptz NOT NULL, -- ← fs_contact.edited_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "created_time" timestamptz NOT NULL, -- ← fs_contact.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "published" boolean NOT NULL, -- ← fs_contact.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "parts_email" varchar(255), -- ← fs_contact.parts_email | Danh sách các phần nội dung email.
  "ordering" integer, -- ← fs_contact.ordering | Thứ tự sắp xếp hiển thị.
  "website" varchar(255), -- ← fs_contact.website | Địa chỉ website.
  "quantity" varchar(255), -- ← fs_contact.quantity | Số lượng.
  "message" text, -- ← fs_contact.message | Nội dung tin nhắn/thông điệp.
  "type_id" varchar(255), -- ← fs_contact.type_id | ⚠️ THIẾU BẢNG THAM CHIẾU — LEGACY: Không có dữ liệu. Ý nghĩa nghiệp vụ chưa xác định — không FK, không index.
  "address" varchar(255), -- ← fs_contact.address + fs_contact_en.address | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "content" text, -- ← fs_contact.content + fs_contact_en.content | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "title" varchar(255) -- ← fs_contact.title + fs_contact_en.title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
);

-- Thông tin liên hệ (form liên hệ khách gửi tới).
DROP TABLE IF EXISTS "cic_contact_en" CASCADE;
CREATE TABLE "cic_contact_en" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_contact.id / fs_contact_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "email" varchar(255) NOT NULL, -- ← fs_contact.email · fs_contact_en.email | Địa chỉ email.
  "fullname" varchar(255), -- ← fs_contact.fullname · fs_contact_en.fullname | Họ và tên đầy đủ.
  "telephone" varchar(255), -- ← fs_contact.telephone · fs_contact_en.telephone | Số điện thoại.
  "fax" varchar(255), -- ← fs_contact.fax · fs_contact_en.fax | Số fax.
  "subject" varchar(255), -- ← fs_contact.subject · fs_contact_en.subject | Tiêu đề/chủ đề (ví dụ chủ đề email).
  "edited_time" timestamptz NOT NULL, -- ← fs_contact.edited_time · fs_contact_en.edited_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "created_time" timestamptz NOT NULL, -- ← fs_contact.created_time · fs_contact_en.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "published" boolean NOT NULL, -- ← fs_contact.published · fs_contact_en.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "parts_email" varchar(255), -- ← fs_contact.parts_email · fs_contact_en.parts_email | Danh sách các phần nội dung email.
  "ordering" integer, -- ← fs_contact.ordering · fs_contact_en.ordering | Thứ tự sắp xếp hiển thị.
  "website" varchar(255), -- ← fs_contact.website · fs_contact_en.website | Địa chỉ website.
  "quantity" varchar(255), -- ← fs_contact.quantity · fs_contact_en.quantity | Số lượng.
  "message" text, -- ← fs_contact.message · fs_contact_en.message | Nội dung tin nhắn/thông điệp.
  "type_id" varchar(255), -- ← fs_contact.type_id · fs_contact_en.type_id | ⚠️ THIẾU BẢNG THAM CHIẾU — LEGACY: Không có dữ liệu. Ý nghĩa nghiệp vụ chưa xác định — không FK, không index.
  "address" varchar(255), -- ← fs_contact.address + fs_contact_en.address | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "content" text, -- ← fs_contact.content + fs_contact_en.content | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "title" varchar(255) -- ← fs_contact.title + fs_contact_en.title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
);

-- Bảng liên hệ bổ sung (liên quan tới module 'enjicad').
DROP TABLE IF EXISTS "cic_contact_enjicad" CASCADE;
CREATE TABLE "cic_contact_enjicad" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_contact_enjicad.id | Khoá chính tự tăng, dùng identity thay AUTO_INCREMENT.
  "email" varchar(255) NOT NULL, -- ← fs_contact_enjicad.email | Địa chỉ email.
  "fullname" varchar(255), -- ← fs_contact_enjicad.fullname | Họ và tên đầy đủ.
  "address" varchar(255), -- ← fs_contact_enjicad.address | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "telephone" varchar(255), -- ← fs_contact_enjicad.telephone | Số điện thoại.
  "fax" varchar(255), -- ← fs_contact_enjicad.fax | Số fax.
  "subject" varchar(255), -- ← fs_contact_enjicad.subject | Tiêu đề/chủ đề (ví dụ chủ đề email).
  "content" text, -- ← fs_contact_enjicad.content | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "edited_time" timestamptz NOT NULL, -- ← fs_contact_enjicad.edited_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "created_time" timestamptz NOT NULL, -- ← fs_contact_enjicad.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "published" boolean NOT NULL, -- ← fs_contact_enjicad.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "parts_email" varchar(255), -- ← fs_contact_enjicad.parts_email | Danh sách các phần nội dung email.
  "ordering" integer, -- ← fs_contact_enjicad.ordering | Thứ tự sắp xếp hiển thị.
  "website" varchar(255), -- ← fs_contact_enjicad.website | Địa chỉ website.
  "title" varchar(255), -- ← fs_contact_enjicad.title | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "quantity" varchar(255), -- ← fs_contact_enjicad.quantity | Số lượng.
  "message" varchar(255), -- ← fs_contact_enjicad.message | Nội dung tin nhắn/thông điệp.
  "type_id" varchar(255) -- ← fs_contact_enjicad.type_id | ⚠️ THIẾU BẢNG THAM CHIẾU — LEGACY: Không có dữ liệu. Ý nghĩa nghiệp vụ chưa xác định — không FK, không index.
);

-- Mẫu email (email template) hệ thống gửi đi.
DROP TABLE IF EXISTS "cic_email" CASCADE;
CREATE TABLE "cic_email" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_email.id / fs_email_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "code" varchar(255), -- ← fs_email.code | Mã định danh dạng chuỗi (mã code) của đối tượng.
  "tablenames" varchar(255), -- ← fs_email.tablenames | Tên các bảng liên kết (có thể nhiều bảng).
  "published" boolean, -- ← fs_email.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer, -- ← fs_email.ordering | Thứ tự sắp xếp hiển thị.
  "created_time" timestamptz, -- ← fs_email.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "image" varchar(255), -- ← fs_email.image | Đường dẫn ảnh chính.
  "first_toll" varchar(255), -- ← fs_email.first_toll | Chi phí/mức phí ban đầu.
  "show_in_homepage" boolean, -- ← fs_email.show_in_homepage | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "prefix_name" varchar(255), -- ← fs_email.prefix_name | Tiền tố gắn trước tên.
  "old_id" integer, -- ← fs_email.old_id | Giữ tạm để đối chiếu dữ liệu trong lúc migrate; có thể xoá sau khi xác nhận không còn tham chiếu.
  "updated_time" timestamptz, -- ← fs_email.updated_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "color_code" varchar(255), -- ← fs_email.color_code | Mã màu.
  "is_retail" boolean, -- ← fs_email.is_retail | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_common" boolean, -- ← fs_email.is_common | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "products" varchar(255), -- ← fs_email.products | Tên/mã sản phẩm liên kết.
  "types" integer, -- ← fs_email.types | Danh sách loại/phân loại.
  "lienhe_kd" varchar(255), -- ← fs_email.lienhe_kd | Thông tin liên hệ bộ phận kinh doanh.
  "lienhe_kt" varchar(255), -- ← fs_email.lienhe_kt | Thông tin liên hệ bộ phận kỹ thuật.
  "lienhe_kdmb" varchar(255), -- ← fs_email.lienhe_kdmb | Thông tin liên hệ kinh doanh miền Bắc.
  "lienhe_kdmn" varchar(255), -- ← fs_email.lienhe_kdmn | Thông tin liên hệ kinh doanh miền Nam.
  "name" varchar(255), -- ← fs_email.name + fs_email_en.name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "alias" varchar(255), -- ← fs_email.alias + fs_email_en.alias | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "description" text, -- ← fs_email.description + fs_email_en.description | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_title" varchar(255), -- ← fs_email.seo_title + fs_email_en.seo_title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_keyword" varchar(255), -- ← fs_email.seo_keyword + fs_email_en.seo_keyword | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_description" varchar(255), -- ← fs_email.seo_description + fs_email_en.seo_description | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "content" text -- ← fs_email.content + fs_email_en.content | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
);

-- Mẫu email (email template) hệ thống gửi đi.
DROP TABLE IF EXISTS "cic_email_en" CASCADE;
CREATE TABLE "cic_email_en" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_email.id / fs_email_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "code" varchar(255), -- ← fs_email.code · fs_email_en.code | Mã định danh dạng chuỗi (mã code) của đối tượng.
  "tablenames" varchar(255), -- ← fs_email.tablenames · fs_email_en.tablenames | Tên các bảng liên kết (có thể nhiều bảng).
  "published" boolean, -- ← fs_email.published · fs_email_en.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer, -- ← fs_email.ordering · fs_email_en.ordering | Thứ tự sắp xếp hiển thị.
  "created_time" timestamptz, -- ← fs_email.created_time · fs_email_en.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "image" varchar(255), -- ← fs_email.image · fs_email_en.image | Đường dẫn ảnh chính.
  "first_toll" varchar(255), -- ← fs_email.first_toll · fs_email_en.first_toll | Chi phí/mức phí ban đầu.
  "show_in_homepage" boolean, -- ← fs_email.show_in_homepage · fs_email_en.show_in_homepage | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "prefix_name" varchar(255), -- ← fs_email.prefix_name · fs_email_en.prefix_name | Tiền tố gắn trước tên.
  "old_id" integer, -- ← fs_email.old_id · fs_email_en.old_id | Giữ tạm để đối chiếu dữ liệu trong lúc migrate; có thể xoá sau khi xác nhận không còn tham chiếu.
  "updated_time" timestamptz, -- ← fs_email.updated_time · fs_email_en.updated_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "color_code" varchar(255), -- ← fs_email.color_code · fs_email_en.color_code | Mã màu.
  "is_retail" boolean, -- ← fs_email.is_retail · fs_email_en.is_retail | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_common" boolean, -- ← fs_email.is_common · fs_email_en.is_common | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "products" varchar(255), -- ← fs_email.products · fs_email_en.products | Tên/mã sản phẩm liên kết.
  "types" integer, -- ← fs_email.types · fs_email_en.types | Danh sách loại/phân loại.
  "lienhe_kd" varchar(255), -- ← fs_email.lienhe_kd · fs_email_en.lienhe_kd | Thông tin liên hệ bộ phận kinh doanh.
  "lienhe_kt" varchar(255), -- ← fs_email.lienhe_kt · fs_email_en.lienhe_kt | Thông tin liên hệ bộ phận kỹ thuật.
  "lienhe_kdmb" varchar(255), -- ← fs_email.lienhe_kdmb · fs_email_en.lienhe_kdmb | Thông tin liên hệ kinh doanh miền Bắc.
  "lienhe_kdmn" varchar(255), -- ← fs_email.lienhe_kdmn · fs_email_en.lienhe_kdmn | Thông tin liên hệ kinh doanh miền Nam.
  "name" varchar(255), -- ← fs_email.name + fs_email_en.name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "alias" varchar(255), -- ← fs_email.alias + fs_email_en.alias | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "description" text, -- ← fs_email.description + fs_email_en.description | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_title" varchar(255), -- ← fs_email.seo_title + fs_email_en.seo_title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_keyword" varchar(255), -- ← fs_email.seo_keyword + fs_email_en.seo_keyword | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_description" varchar(255), -- ← fs_email.seo_description + fs_email_en.seo_description | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "content" text -- ← fs_email.content + fs_email_en.content | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
);

-- Loại email hệ thống (ví dụ: email xác nhận đơn hàng, email liên hệ...).
DROP TABLE IF EXISTS "cic_types_email" CASCADE;
CREATE TABLE "cic_types_email" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_types_email.id / fs_types_email_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "code" varchar(255), -- ← fs_types_email.code | Mã định danh dạng chuỗi (mã code) của đối tượng.
  "tablenames" varchar(255), -- ← fs_types_email.tablenames | Tên các bảng liên kết (có thể nhiều bảng).
  "published" boolean, -- ← fs_types_email.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer, -- ← fs_types_email.ordering | Thứ tự sắp xếp hiển thị.
  "created_time" timestamptz, -- ← fs_types_email.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "image" varchar(255), -- ← fs_types_email.image | Đường dẫn ảnh chính.
  "first_toll" varchar(255), -- ← fs_types_email.first_toll | Chi phí/mức phí ban đầu.
  "show_in_homepage" boolean, -- ← fs_types_email.show_in_homepage | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "prefix_name" varchar(255), -- ← fs_types_email.prefix_name | Tiền tố gắn trước tên.
  "old_id" integer, -- ← fs_types_email.old_id | Giữ tạm để đối chiếu dữ liệu trong lúc migrate; có thể xoá sau khi xác nhận không còn tham chiếu.
  "updated_time" timestamptz, -- ← fs_types_email.updated_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "color_code" varchar(255), -- ← fs_types_email.color_code | Mã màu.
  "is_retail" boolean, -- ← fs_types_email.is_retail | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_common" boolean, -- ← fs_types_email.is_common | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "name" varchar(255), -- ← fs_types_email.name + fs_types_email_en.name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "alias" varchar(255), -- ← fs_types_email.alias + fs_types_email_en.alias | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "description" text, -- ← fs_types_email.description + fs_types_email_en.description | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_title" varchar(255), -- ← fs_types_email.seo_title + fs_types_email_en.seo_title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_keyword" varchar(255), -- ← fs_types_email.seo_keyword + fs_types_email_en.seo_keyword | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_description" varchar(255), -- ← fs_types_email.seo_description + fs_types_email_en.seo_description | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "content" text -- ← fs_types_email.content + fs_types_email_en.content | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
);

-- Loại email hệ thống (ví dụ: email xác nhận đơn hàng, email liên hệ...).
DROP TABLE IF EXISTS "cic_types_email_en" CASCADE;
CREATE TABLE "cic_types_email_en" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_types_email.id / fs_types_email_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "code" varchar(255), -- ← fs_types_email.code · fs_types_email_en.code | Mã định danh dạng chuỗi (mã code) của đối tượng.
  "tablenames" varchar(255), -- ← fs_types_email.tablenames · fs_types_email_en.tablenames | Tên các bảng liên kết (có thể nhiều bảng).
  "published" boolean, -- ← fs_types_email.published · fs_types_email_en.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer, -- ← fs_types_email.ordering · fs_types_email_en.ordering | Thứ tự sắp xếp hiển thị.
  "created_time" timestamptz, -- ← fs_types_email.created_time · fs_types_email_en.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "image" varchar(255), -- ← fs_types_email.image · fs_types_email_en.image | Đường dẫn ảnh chính.
  "first_toll" varchar(255), -- ← fs_types_email.first_toll · fs_types_email_en.first_toll | Chi phí/mức phí ban đầu.
  "show_in_homepage" boolean, -- ← fs_types_email.show_in_homepage · fs_types_email_en.show_in_homepage | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "prefix_name" varchar(255), -- ← fs_types_email.prefix_name · fs_types_email_en.prefix_name | Tiền tố gắn trước tên.
  "old_id" integer, -- ← fs_types_email.old_id · fs_types_email_en.old_id | Giữ tạm để đối chiếu dữ liệu trong lúc migrate; có thể xoá sau khi xác nhận không còn tham chiếu.
  "updated_time" timestamptz, -- ← fs_types_email.updated_time · fs_types_email_en.updated_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "color_code" varchar(255), -- ← fs_types_email.color_code · fs_types_email_en.color_code | Mã màu.
  "is_retail" boolean, -- ← fs_types_email.is_retail · fs_types_email_en.is_retail | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_common" boolean, -- ← fs_types_email.is_common · fs_types_email_en.is_common | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "name" varchar(255), -- ← fs_types_email.name + fs_types_email_en.name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "alias" varchar(255), -- ← fs_types_email.alias + fs_types_email_en.alias | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "description" text, -- ← fs_types_email.description + fs_types_email_en.description | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_title" varchar(255), -- ← fs_types_email.seo_title + fs_types_email_en.seo_title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_keyword" varchar(255), -- ← fs_types_email.seo_keyword + fs_types_email_en.seo_keyword | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_description" varchar(255), -- ← fs_types_email.seo_description + fs_types_email_en.seo_description | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "content" text -- ← fs_types_email.content + fs_types_email_en.content | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
);

-- Danh sách kênh hỗ trợ trực tuyến (Zalo, Skype, Yahoo chat...) hiển thị trên site.
DROP TABLE IF EXISTS "cic_onlinesupport" CASCADE;
CREATE TABLE "cic_onlinesupport" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_onlinesupport.id | Khoá chính tự tăng, dùng identity thay AUTO_INCREMENT.
  "name" varchar(255) NOT NULL, -- ← fs_onlinesupport.name | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "alias" varchar(255) NOT NULL, -- ← fs_onlinesupport.alias | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "yahoo" varchar(255), -- ← fs_onlinesupport.yahoo | Tài khoản Yahoo Messenger liên hệ (công nghệ cũ).
  "skype" varchar(255) NOT NULL, -- ← fs_onlinesupport.skype | Tài khoản Skype liên hệ.
  "email" varchar(255) NOT NULL, -- ← fs_onlinesupport.email | Địa chỉ email.
  "hotline" varchar(255), -- ← fs_onlinesupport.hotline | Số điện thoại đường dây nóng.
  "published" boolean NOT NULL, -- ← fs_onlinesupport.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer, -- ← fs_onlinesupport.ordering | Thứ tự sắp xếp hiển thị.
  "created_time" timestamptz, -- ← fs_onlinesupport.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "edited_time" timestamptz, -- ← fs_onlinesupport.edited_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "image" varchar(255) -- ← fs_onlinesupport.image | Đường dẫn ảnh chính.
);

-- Thông tin lĩnh vực/ngành nghề kinh doanh.
DROP TABLE IF EXISTS "cic_business" CASCADE;
CREATE TABLE "cic_business" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_business.id / fs_business_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "name" varchar(255) NULL, -- ← fs_business.name | Giữ để migrate đầy đủ dữ liệu legacy. Tên hiển thị của đối tượng.
  "code" varchar(255) NULL, -- ← fs_business.code | Giữ để migrate đầy đủ dữ liệu legacy. Mã định danh dạng chuỗi (mã code) của đối tượng.
  "alias" varchar(255) NULL, -- ← fs_business.alias | Giữ để migrate đầy đủ dữ liệu legacy. Đường dẫn thân thiện (slug) dùng trong URL, thường được tạo từ tên.
  "tablenames" varchar(255) NULL, -- ← fs_business.tablenames | Giữ để migrate đầy đủ dữ liệu legacy. Tên các bảng liên kết (có thể nhiều bảng).
  "published" smallint NULL, -- ← fs_business.published | Giữ để migrate đầy đủ dữ liệu legacy. Trạng thái xuất bản/hiển thị (1: hiện, 0: ẩn).
  "description" text NULL, -- ← fs_business.description | Giữ để migrate đầy đủ dữ liệu legacy. Mô tả chi tiết.
  "ordering" integer NULL, -- ← fs_business.ordering | Giữ để migrate đầy đủ dữ liệu legacy. Thứ tự sắp xếp hiển thị.
  "created_time" timestamptz NULL, -- ← fs_business.created_time | Giữ để migrate đầy đủ dữ liệu legacy. Thời điểm tạo bản ghi.
  "image" varchar(255) NULL, -- ← fs_business.image | Giữ để migrate đầy đủ dữ liệu legacy. Đường dẫn ảnh chính.
  "first_toll" varchar(255) NULL, -- ← fs_business.first_toll | Giữ để migrate đầy đủ dữ liệu legacy. Chi phí/mức phí ban đầu.
  "show_in_homepage" smallint NULL, -- ← fs_business.show_in_homepage | Giữ để migrate đầy đủ dữ liệu legacy. Hiển thị ở trang chủ.
  "seo_title" varchar(255) NULL, -- ← fs_business.seo_title | Giữ để migrate đầy đủ dữ liệu legacy. Tiêu đề SEO (thẻ meta title).
  "seo_keyword" varchar(255) NULL, -- ← fs_business.seo_keyword | Giữ để migrate đầy đủ dữ liệu legacy. Từ khóa SEO.
  "seo_description" varchar(255) NULL, -- ← fs_business.seo_description | Giữ để migrate đầy đủ dữ liệu legacy. Mô tả SEO (thẻ meta description).
  "prefix_name" varchar(255) NULL, -- ← fs_business.prefix_name | Giữ để migrate đầy đủ dữ liệu legacy. Tiền tố gắn trước tên.
  "old_id" integer NULL, -- ← fs_business.old_id | Giữ để migrate đầy đủ dữ liệu legacy. Mã cũ (trước khi thay đổi/di chuyển dữ liệu).
  "updated_time" timestamptz NULL, -- ← fs_business.updated_time | Giữ để migrate đầy đủ dữ liệu legacy. Thời điểm cập nhật gần nhất.
  "color_code" varchar(255) NULL, -- ← fs_business.color_code | Giữ để migrate đầy đủ dữ liệu legacy. Mã màu.
  "is_retail" smallint NULL, -- ← fs_business.is_retail | Giữ để migrate đầy đủ dữ liệu legacy. Đánh dấu bán lẻ.
  "content" text NULL, -- ← fs_business.content | Giữ để migrate đầy đủ dữ liệu legacy. Nội dung chi tiết (thường là HTML).
  "is_common" smallint NULL, -- ← fs_business.is_common | Giữ để migrate đầy đủ dữ liệu legacy. Đánh dấu dùng chung/mặc định.
  "phone" varchar(225) NULL, -- ← fs_business.phone | Giữ để migrate đầy đủ dữ liệu legacy. Số điện thoại.
  "Skype" varchar(255) NULL, -- ← fs_business.Skype | Giữ để migrate đầy đủ dữ liệu legacy. Tài khoản Skype liên hệ.
  "Zalo" varchar(255) NULL, -- ← fs_business.Zalo | Giữ để migrate đầy đủ dữ liệu legacy. Số điện thoại/tài khoản Zalo liên hệ.
  "khuvuc" varchar(255) NULL, -- ← fs_business.khuvuc | Giữ để migrate đầy đủ dữ liệu legacy. Khu vực.
  "khuvuc_name" varchar(255) NULL, -- ← fs_business.khuvuc_name | Giữ để migrate đầy đủ dữ liệu legacy. Tên khu vực.
  "products" varchar(255) NULL, -- ← fs_business.products | Giữ để migrate đầy đủ dữ liệu legacy. Tên/mã sản phẩm liên kết.
  "lienhe" text NULL, -- ← fs_business.lienhe | Giữ để migrate đầy đủ dữ liệu legacy. Thông tin liên hệ.
  "lienhe_kd" text NULL, -- ← fs_business.lienhe_kd | Giữ để migrate đầy đủ dữ liệu legacy. Thông tin liên hệ bộ phận kinh doanh.
  "lienhe_kt" text NULL, -- ← fs_business.lienhe_kt | Giữ để migrate đầy đủ dữ liệu legacy. Thông tin liên hệ bộ phận kỹ thuật.
  "lienhe_kdmb" text NULL, -- ← fs_business.lienhe_kdmb | Giữ để migrate đầy đủ dữ liệu legacy. Thông tin liên hệ kinh doanh miền Bắc.
  "lienhe_kdmn" text NULL -- ← fs_business.lienhe_kdmn | Giữ để migrate đầy đủ dữ liệu legacy. Thông tin liên hệ kinh doanh miền Nam.
);

-- Bảng tương thích để bảo toàn dữ liệu từ fs_business_en.
DROP TABLE IF EXISTS "cic_business_en" CASCADE;
CREATE TABLE "cic_business_en" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_business_en.id | Giữ để migrate đầy đủ dữ liệu legacy. Khóa chính, mã định danh duy nhất của bản ghi.
  "name" varchar(255) NULL, -- ← fs_business_en.name | Giữ để migrate đầy đủ dữ liệu legacy. Tên hiển thị của đối tượng.
  "code" varchar(255) NULL, -- ← fs_business_en.code | Giữ để migrate đầy đủ dữ liệu legacy. Mã định danh dạng chuỗi (mã code) của đối tượng.
  "alias" varchar(255) NULL, -- ← fs_business_en.alias | Giữ để migrate đầy đủ dữ liệu legacy. Đường dẫn thân thiện (slug) dùng trong URL, thường được tạo từ tên.
  "tablenames" varchar(255) NULL, -- ← fs_business_en.tablenames | Giữ để migrate đầy đủ dữ liệu legacy. Tên các bảng liên kết (có thể nhiều bảng).
  "published" smallint NULL, -- ← fs_business_en.published | Giữ để migrate đầy đủ dữ liệu legacy. Trạng thái xuất bản/hiển thị (1: hiện, 0: ẩn).
  "description" text NULL, -- ← fs_business_en.description | Giữ để migrate đầy đủ dữ liệu legacy. Mô tả chi tiết.
  "ordering" integer NULL, -- ← fs_business_en.ordering | Giữ để migrate đầy đủ dữ liệu legacy. Thứ tự sắp xếp hiển thị.
  "created_time" timestamptz NULL, -- ← fs_business_en.created_time | Giữ để migrate đầy đủ dữ liệu legacy. Thời điểm tạo bản ghi.
  "image" varchar(255) NULL, -- ← fs_business_en.image | Giữ để migrate đầy đủ dữ liệu legacy. Đường dẫn ảnh chính.
  "first_toll" varchar(255) NULL, -- ← fs_business_en.first_toll | Giữ để migrate đầy đủ dữ liệu legacy. Chi phí/mức phí ban đầu.
  "show_in_homepage" smallint NULL, -- ← fs_business_en.show_in_homepage | Giữ để migrate đầy đủ dữ liệu legacy. Hiển thị ở trang chủ.
  "seo_title" varchar(255) NULL, -- ← fs_business_en.seo_title | Giữ để migrate đầy đủ dữ liệu legacy. Tiêu đề SEO (thẻ meta title).
  "seo_keyword" varchar(255) NULL, -- ← fs_business_en.seo_keyword | Giữ để migrate đầy đủ dữ liệu legacy. Từ khóa SEO.
  "seo_description" varchar(255) NULL, -- ← fs_business_en.seo_description | Giữ để migrate đầy đủ dữ liệu legacy. Mô tả SEO (thẻ meta description).
  "prefix_name" varchar(255) NULL, -- ← fs_business_en.prefix_name | Giữ để migrate đầy đủ dữ liệu legacy. Tiền tố gắn trước tên.
  "old_id" integer NULL, -- ← fs_business_en.old_id | Giữ để migrate đầy đủ dữ liệu legacy. Mã cũ (trước khi thay đổi/di chuyển dữ liệu).
  "updated_time" timestamptz NULL, -- ← fs_business_en.updated_time | Giữ để migrate đầy đủ dữ liệu legacy. Thời điểm cập nhật gần nhất.
  "color_code" varchar(255) NULL, -- ← fs_business_en.color_code | Giữ để migrate đầy đủ dữ liệu legacy. Mã màu.
  "is_retail" smallint NULL, -- ← fs_business_en.is_retail | Giữ để migrate đầy đủ dữ liệu legacy. Đánh dấu bán lẻ.
  "content" text NULL, -- ← fs_business_en.content | Giữ để migrate đầy đủ dữ liệu legacy. Nội dung chi tiết (thường là HTML).
  "is_common" smallint NULL, -- ← fs_business_en.is_common | Giữ để migrate đầy đủ dữ liệu legacy. Đánh dấu dùng chung/mặc định.
  "phone" varchar(225) NULL, -- ← fs_business_en.phone | Giữ để migrate đầy đủ dữ liệu legacy. Số điện thoại.
  "Skype" varchar(255) NULL, -- ← fs_business_en.Skype | Giữ để migrate đầy đủ dữ liệu legacy. Tài khoản Skype liên hệ.
  "Zalo" varchar(255) NULL, -- ← fs_business_en.Zalo | Giữ để migrate đầy đủ dữ liệu legacy. Số điện thoại/tài khoản Zalo liên hệ.
  "khuvuc" varchar(255) NULL, -- ← fs_business_en.khuvuc | Giữ để migrate đầy đủ dữ liệu legacy. Khu vực.
  "khuvuc_name" varchar(255) NULL, -- ← fs_business_en.khuvuc_name | Giữ để migrate đầy đủ dữ liệu legacy. Tên khu vực.
  "products" varchar(255) NULL, -- ← fs_business_en.products | Giữ để migrate đầy đủ dữ liệu legacy. Tên/mã sản phẩm liên kết.
  "lienhe" text NULL, -- ← fs_business_en.lienhe | Giữ để migrate đầy đủ dữ liệu legacy. Thông tin liên hệ.
  "lienhe_kd" text NULL, -- ← fs_business_en.lienhe_kd | Giữ để migrate đầy đủ dữ liệu legacy. Thông tin liên hệ bộ phận kinh doanh.
  "lienhe_kt" text NULL, -- ← fs_business_en.lienhe_kt | Giữ để migrate đầy đủ dữ liệu legacy. Thông tin liên hệ bộ phận kỹ thuật.
  "lienhe_kdmb" text NULL, -- ← fs_business_en.lienhe_kdmb | Giữ để migrate đầy đủ dữ liệu legacy. Thông tin liên hệ kinh doanh miền Bắc.
  "lienhe_kdmn" text NULL -- ← fs_business_en.lienhe_kdmn | Giữ để migrate đầy đủ dữ liệu legacy. Thông tin liên hệ kinh doanh miền Nam.
);

-- Dịch vụ mà công ty cung cấp.
DROP TABLE IF EXISTS "cic_services_en" CASCADE;
CREATE TABLE "cic_services_en" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_services.id / fs_services_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "content" text, -- ← fs_services.content · fs_services_en.content | Nội dung chi tiết (thường là HTML).
  "tags" varchar(255), -- ← fs_services.tags · fs_services_en.tags | Thẻ gắn với nội dung (dùng để phân loại/tìm kiếm).
  "category_id" integer, -- ← fs_services.category_id · fs_services_en.category_id | ⚠️ THIẾU BẢNG THAM CHIẾU — ⚠ CẦN QUYẾT ĐỊNH NGHIỆP VỤ — chỉ 4 dòng, tất cả cùng category_id = 2, không có bảng services_categories tương ứng; xác nhận với nghiệp vụ trước khi bỏ cột hoặc tạo bảng danh mục dịch vụ.
  "category_alias" varchar(255), -- ← fs_services.category_alias · fs_services_en.category_alias | Alias của danh mục.
  "category_id_wrapper" varchar(255), -- ← fs_services.category_id_wrapper · fs_services_en.category_id_wrapper | Mã danh mục cha bao ngoài (dùng cho breadcrumb/URL lồng nhau).
  "category_alias_wrapper" varchar(255), -- ← fs_services.category_alias_wrapper · fs_services_en.category_alias_wrapper | Alias bao ngoài của danh mục cha.
  "category_published" integer, -- ← fs_services.category_published · fs_services_en.category_published | Trạng thái hiển thị của danh mục.
  "image" varchar(255), -- ← fs_services.image · fs_services_en.image | Đường dẫn ảnh chính.
  "creator" varchar(255), -- ← fs_services.creator · fs_services_en.creator | Người tạo bản ghi.
  "source_website" varchar(255), -- ← fs_services.source_website · fs_services_en.source_website | Nguồn website.
  "created_time" timestamptz, -- ← fs_services.created_time · fs_services_en.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "updated_time" timestamptz, -- ← fs_services.updated_time · fs_services_en.updated_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "editor" varchar(255), -- ← fs_services.editor · fs_services_en.editor | Người chỉnh sửa gần nhất.
  "show_in_homepage" smallint, -- ← fs_services.show_in_homepage · fs_services_en.show_in_homepage | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "hits" integer, -- ← fs_services.hits · fs_services_en.hits | Tổng lượt xem/truy cập.
  "published" smallint, -- ← fs_services.published · fs_services_en.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer, -- ← fs_services.ordering · fs_services_en.ordering | Thứ tự sắp xếp hiển thị.
  "display_title" smallint, -- ← fs_services.display_title · fs_services_en.display_title | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "display_column" integer, -- ← fs_services.display_column · fs_services_en.display_column | Cột được chọn để hiển thị.
  "tags_group" integer, -- ← fs_services.tags_group · fs_services_en.tags_group | Nhóm thẻ (tags).
  "rating_count" integer, -- ← fs_services.rating_count · fs_services_en.rating_count | Số lượt đánh giá.
  "rating_sum" integer, -- ← fs_services.rating_sum · fs_services_en.rating_sum | Tổng điểm đánh giá (dùng để tính điểm trung bình).
  "source" varchar(255), -- ← fs_services.source | Nguồn dữ liệu/nguồn trích dẫn.
  "show_map" smallint, -- ← fs_services.show_map · fs_services_en.show_map | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "author" varchar(255), -- ← fs_services.author · fs_services_en.author | Tên tác giả nội dung.
  "author_last" varchar(255), -- ← fs_services.author_last · fs_services_en.author_last | Tên người chỉnh sửa gần nhất.
  "tawk_to" text, -- ← fs_services.tawk_to · fs_services_en.tawk_to | Mã tích hợp chat trực tuyến Tawk.to.
  "summary" text, -- ← fs_services.summary + fs_services_en.summary | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "category_name" varchar(255), -- ← fs_services.category_name + fs_services_en.category_name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "title" varchar(255), -- ← fs_services.title + fs_services_en.title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "alias" varchar(255), -- ← fs_services.alias + fs_services_en.alias | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "title_display" varchar(255), -- ← fs_services.title_display + fs_services_en.title_display | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "keywords" varchar(255), -- ← fs_services.keywords + fs_services_en.keywords | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_title" varchar(255), -- ← fs_services.seo_title + fs_services_en.seo_title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_keyword" varchar(255), -- ← fs_services.seo_keyword + fs_services_en.seo_keyword | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_description" varchar(255), -- ← fs_services.seo_description + fs_services_en.seo_description | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "actflg" varchar(1) NULL, -- ← fs_services_en.actflg | Giữ để migrate đầy đủ dữ liệu legacy. Cờ trạng thái hoạt động (Active Flag) — trường kỹ thuật kế thừa từ hệ thống khác.
  "ctdusr" varchar(5) NULL, -- ← fs_services_en.ctdusr | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: người dùng tạo bản ghi (Created User).
  "ctdwks" varchar(15) NULL, -- ← fs_services_en.ctdwks | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: trạm làm việc tạo bản ghi (Created Workstation).
  "ctddtm" timestamptz NULL, -- ← fs_services_en.ctddtm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: ngày giờ tạo bản ghi (Created Date-Time).
  "mdfusr" varchar(5) NULL, -- ← fs_services_en.mdfusr | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: người chỉnh sửa gần nhất (Modified User).
  "mdfwks" varchar(15) NULL, -- ← fs_services_en.mdfwks | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: trạm làm việc chỉnh sửa gần nhất (Modified Workstation).
  "lstmdf" timestamptz NULL, -- ← fs_services_en.lstmdf | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: lần chỉnh sửa cuối (Last Modified).
  "cdtpgm" varchar(20) NULL, -- ← fs_services_en.cdtpgm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: chương trình tạo bản ghi (Created Program) — thường từ hệ thống cũ.
  "mdfpgm" varchar(20) NULL -- ← fs_services_en.mdfpgm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: chương trình chỉnh sửa gần nhất (Modified Program).
);

-- Bảng tương thích để bảo toàn dữ liệu từ fs_services.
DROP TABLE IF EXISTS "cic_services" CASCADE;
CREATE TABLE "cic_services" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_services.id | Giữ để migrate đầy đủ dữ liệu legacy. Khóa chính, mã định danh duy nhất của bản ghi.
  "summary" text NULL, -- ← fs_services.summary | Giữ để migrate đầy đủ dữ liệu legacy. Tóm tắt nội dung.
  "content" text NULL, -- ← fs_services.content | Giữ để migrate đầy đủ dữ liệu legacy. Nội dung chi tiết (thường là HTML).
  "tags" varchar(255) NULL, -- ← fs_services.tags | Giữ để migrate đầy đủ dữ liệu legacy. Thẻ gắn với nội dung (dùng để phân loại/tìm kiếm).
  "category_id" integer NULL, -- ← fs_services.category_id | Giữ để migrate đầy đủ dữ liệu legacy. Khóa ngoại liên kết tới danh mục.
  "category_alias" varchar(255) NULL, -- ← fs_services.category_alias | Giữ để migrate đầy đủ dữ liệu legacy. Alias của danh mục.
  "category_name" varchar(255) NULL, -- ← fs_services.category_name | Giữ để migrate đầy đủ dữ liệu legacy. Tên danh mục.
  "category_id_wrapper" varchar(255) NULL, -- ← fs_services.category_id_wrapper | Giữ để migrate đầy đủ dữ liệu legacy. Mã danh mục cha bao ngoài (dùng cho breadcrumb/URL lồng nhau).
  "category_alias_wrapper" varchar(255) NULL, -- ← fs_services.category_alias_wrapper | Giữ để migrate đầy đủ dữ liệu legacy. Alias bao ngoài của danh mục cha.
  "category_published" integer NULL, -- ← fs_services.category_published | Giữ để migrate đầy đủ dữ liệu legacy. Trạng thái hiển thị của danh mục.
  "title" varchar(255) NULL, -- ← fs_services.title | Giữ để migrate đầy đủ dữ liệu legacy. Tiêu đề.
  "alias" varchar(255) NULL, -- ← fs_services.alias | Giữ để migrate đầy đủ dữ liệu legacy. Đường dẫn thân thiện (slug) dùng trong URL, thường được tạo từ tên.
  "image" varchar(255) NULL, -- ← fs_services.image | Giữ để migrate đầy đủ dữ liệu legacy. Đường dẫn ảnh chính.
  "creator" varchar(255) NULL, -- ← fs_services.creator | Giữ để migrate đầy đủ dữ liệu legacy. Người tạo bản ghi.
  "source_website" varchar(255) NULL, -- ← fs_services.source_website | Giữ để migrate đầy đủ dữ liệu legacy. Nguồn website.
  "created_time" timestamptz NULL, -- ← fs_services.created_time | Giữ để migrate đầy đủ dữ liệu legacy. Thời điểm tạo bản ghi.
  "updated_time" timestamptz NULL, -- ← fs_services.updated_time | Giữ để migrate đầy đủ dữ liệu legacy. Thời điểm cập nhật gần nhất.
  "editor" varchar(255) NULL, -- ← fs_services.editor | Giữ để migrate đầy đủ dữ liệu legacy. Người chỉnh sửa gần nhất.
  "show_in_homepage" smallint NULL, -- ← fs_services.show_in_homepage | Giữ để migrate đầy đủ dữ liệu legacy. Hiển thị ở trang chủ.
  "hits" integer NULL, -- ← fs_services.hits | Giữ để migrate đầy đủ dữ liệu legacy. Tổng lượt xem/truy cập.
  "published" smallint NULL, -- ← fs_services.published | Giữ để migrate đầy đủ dữ liệu legacy. Trạng thái xuất bản/hiển thị (1: hiện, 0: ẩn).
  "ordering" integer NULL, -- ← fs_services.ordering | Giữ để migrate đầy đủ dữ liệu legacy. Thứ tự sắp xếp hiển thị.
  "title_display" varchar(255) NULL, -- ← fs_services.title_display | Giữ để migrate đầy đủ dữ liệu legacy. Tiêu đề hiển thị tùy chỉnh.
  "display_title" smallint NULL, -- ← fs_services.display_title | Giữ để migrate đầy đủ dữ liệu legacy. Tiêu đề hiển thị tùy chỉnh.
  "display_column" integer NULL, -- ← fs_services.display_column | Giữ để migrate đầy đủ dữ liệu legacy. Cột được chọn để hiển thị.
  "tags_group" integer NULL, -- ← fs_services.tags_group | Giữ để migrate đầy đủ dữ liệu legacy. Nhóm thẻ (tags).
  "rating_count" integer NULL, -- ← fs_services.rating_count | Giữ để migrate đầy đủ dữ liệu legacy. Số lượt đánh giá.
  "rating_sum" integer NULL, -- ← fs_services.rating_sum | Giữ để migrate đầy đủ dữ liệu legacy. Tổng điểm đánh giá (dùng để tính điểm trung bình).
  "keywords" varchar(255) NULL, -- ← fs_services.keywords | Giữ để migrate đầy đủ dữ liệu legacy. Danh sách từ khóa (phục vụ SEO/tìm kiếm).
  "seo_title" varchar(255) NULL, -- ← fs_services.seo_title | Giữ để migrate đầy đủ dữ liệu legacy. Tiêu đề SEO (thẻ meta title).
  "seo_keyword" varchar(255) NULL, -- ← fs_services.seo_keyword | Giữ để migrate đầy đủ dữ liệu legacy. Từ khóa SEO.
  "seo_description" varchar(255) NULL, -- ← fs_services.seo_description | Giữ để migrate đầy đủ dữ liệu legacy. Mô tả SEO (thẻ meta description).
  "source" varchar(255) NULL, -- ← fs_services.source | Giữ để migrate đầy đủ dữ liệu legacy. Nguồn dữ liệu/nguồn trích dẫn.
  "show_map" smallint NULL, -- ← fs_services.show_map | Giữ để migrate đầy đủ dữ liệu legacy. Bật/tắt hiển thị bản đồ.
  "author" varchar(255) NULL, -- ← fs_services.author | Giữ để migrate đầy đủ dữ liệu legacy. Tên tác giả nội dung.
  "author_last" varchar(255) NULL, -- ← fs_services.author_last | Giữ để migrate đầy đủ dữ liệu legacy. Tên người chỉnh sửa gần nhất.
  "actflg" varchar(1) NULL, -- ← fs_services.actflg | Giữ để migrate đầy đủ dữ liệu legacy. Cờ trạng thái hoạt động (Active Flag) — trường kỹ thuật kế thừa từ hệ thống khác.
  "ctdusr" varchar(5) NULL, -- ← fs_services.ctdusr | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: người dùng tạo bản ghi (Created User).
  "ctdwks" varchar(15) NULL, -- ← fs_services.ctdwks | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: trạm làm việc tạo bản ghi (Created Workstation).
  "ctddtm" timestamptz NULL, -- ← fs_services.ctddtm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: ngày giờ tạo bản ghi (Created Date-Time).
  "mdfusr" varchar(5) NULL, -- ← fs_services.mdfusr | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: người chỉnh sửa gần nhất (Modified User).
  "mdfwks" varchar(15) NULL, -- ← fs_services.mdfwks | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: trạm làm việc chỉnh sửa gần nhất (Modified Workstation).
  "lstmdf" timestamptz NULL, -- ← fs_services.lstmdf | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: lần chỉnh sửa cuối (Last Modified).
  "cdtpgm" varchar(20) NULL, -- ← fs_services.cdtpgm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: chương trình tạo bản ghi (Created Program) — thường từ hệ thống cũ.
  "mdfpgm" varchar(20) NULL, -- ← fs_services.mdfpgm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: chương trình chỉnh sửa gần nhất (Modified Program).
  "tawk_to" text NULL -- ← fs_services.tawk_to | Giữ để migrate đầy đủ dữ liệu legacy. Mã tích hợp chat trực tuyến Tawk.to.
);

-- [BẢNG MỚI] Quan hệ N–N Dịch vụ (VI) ↔ Sản phẩm (VI), có thứ tự.
DROP TABLE IF EXISTS "cic_services_products_rel" CASCADE;
CREATE TABLE "cic_services_products_rel" (
  "service_id" integer NOT NULL REFERENCES cic_services(id) ON DELETE CASCADE, -- ← — (bảng mới) | Dịch vụ VI sở hữu quan hệ.
  "product_id" integer NOT NULL REFERENCES cic_products(id) ON DELETE RESTRICT, -- ← — (bảng mới) | Sản phẩm VI liên quan.
  "ordering" integer NOT NULL DEFAULT 0 CHECK ("ordering" >= 0), -- ← — (bảng mới) | Thứ tự hiển thị sản phẩm trong dịch vụ.
  CONSTRAINT "pk_cic_services_products_rel" PRIMARY KEY ("service_id", "product_id")
);

-- [BẢNG MỚI] Quan hệ N–N Dịch vụ (EN) ↔ Sản phẩm (EN), có thứ tự — độc lập workspace EN.
DROP TABLE IF EXISTS "cic_services_products_rel_en" CASCADE;
CREATE TABLE "cic_services_products_rel_en" (
  "service_id" integer NOT NULL REFERENCES cic_services_en(id) ON DELETE CASCADE, -- ← — (bảng mới) | Dịch vụ EN sở hữu quan hệ.
  "product_id" integer NOT NULL REFERENCES cic_products_en(id) ON DELETE RESTRICT, -- ← — (bảng mới) | Sản phẩm EN liên quan.
  "ordering" integer NOT NULL DEFAULT 0 CHECK ("ordering" >= 0), -- ← — (bảng mới) | Thứ tự hiển thị sản phẩm trong dịch vụ.
  CONSTRAINT "pk_cic_services_products_rel_en" PRIMARY KEY ("service_id", "product_id")
);

-- Thư viện ảnh (album).
DROP TABLE IF EXISTS "cic_image" CASCADE;
CREATE TABLE "cic_image" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_image.id / fs_image_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "code" varchar(255), -- ← fs_image.code | Mã định danh dạng chuỗi (mã code) của đối tượng.
  "category_id" integer, -- ← fs_image.category_id | ⚠️ THIẾU BẢNG THAM CHIẾU — Không tồn tại bảng danh mục dành riêng cho module "image" (không có bảng kiểu "image_categories") trong cả MySQL gốc lẫn schema mới, và không có tài liệu nghiệp vụ xác nhận cột này trỏ tới bảng nào khác. Giữ nguyên dạng LEGACY, không FK, không index. Cần bổ sung bảng danh mục tương ứng hoặc xác nhận lại với đội nghiệp vụ khi có thêm tài liệu.
  "category_id_wrapper" varchar(255), -- ← fs_image.category_id_wrapper | Mã danh mục cha bao ngoài (dùng cho breadcrumb/URL lồng nhau).
  "category_root_alias" varchar(255), -- ← fs_image.category_root_alias | Alias của danh mục gốc (cấp cao nhất).
  "category_alias" varchar(255), -- ← fs_image.category_alias | Alias của danh mục.
  "category_alias_wrapper" varchar(255), -- ← fs_image.category_alias_wrapper | Alias bao ngoài của danh mục cha.
  "category_published" boolean, -- ← fs_image.category_published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "image" varchar(255), -- ← fs_image.image | Đường dẫn ảnh chính.
  "video" text, -- ← fs_image.video | Đường dẫn/nội dung video.
  "manufactory" integer, -- ← fs_image.manufactory | Nhà sản xuất.
  "manufactory_alias" varchar(255), -- ← fs_image.manufactory_alias | Alias của nhà sản xuất.
  "manufactory_name" varchar(255), -- ← fs_image.manufactory_name | Tên nhà sản xuất.
  "manufactory_image" varchar(255), -- ← fs_image.manufactory_image | Ảnh/logo nhà sản xuất.
  "model" varchar(255), -- ← fs_image.model | Mẫu mã/model sản phẩm.
  "model_alias" varchar(255), -- ← fs_image.model_alias | Alias của mẫu mã sản phẩm.
  "model_name" varchar(255), -- ← fs_image.model_name | Tên mẫu mã sản phẩm.
  "tablename" varchar(100), -- ← fs_image.tablename | Tên bảng liên kết.
  "price" double precision, -- ← fs_image.price | Giá bán.
  "price_old" double precision, -- ← fs_image.price_old | Giá cũ (giá gốc trước khuyến mãi).
  "discount" double precision, -- ← fs_image.discount | Giá trị giảm giá.
  "discount_unit" varchar(255), -- ← fs_image.discount_unit | Đơn vị tính của giảm giá (%, VNĐ...).
  "quantity" integer NOT NULL, -- ← fs_image.quantity | Số lượng.
  "currency" varchar(50), -- ← fs_image.currency | Đơn vị tiền tệ.
  "created_time" timestamptz, -- ← fs_image.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "edited_time" timestamptz, -- ← fs_image.edited_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "published" boolean, -- ← fs_image.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer, -- ← fs_image.ordering | Thứ tự sắp xếp hiển thị.
  "hits" integer NOT NULL, -- ← fs_image.hits | Tổng lượt xem/truy cập.
  "sale_count" integer, -- ← fs_image.sale_count | Số lượng đã bán.
  "tags" varchar(255), -- ← fs_image.tags | Thẻ gắn với nội dung (dùng để phân loại/tìm kiếm).
  "favourite" integer NOT NULL, -- ← fs_image.favourite | Đánh dấu yêu thích.
  "types" varchar(255), -- ← fs_image.types | Danh sách loại/phân loại.
  "status" varchar(255), -- ← fs_image.status | Trạng thái của bản ghi.
  "products_related" varchar(255), -- ← fs_image.products_related | Sản phẩm liên quan.
  "news_related" varchar(255), -- ← fs_image.news_related | Tin tức liên quan.
  "comments_total" integer NOT NULL, -- ← fs_image.comments_total | Tổng số bình luận.
  "comments_unread" integer NOT NULL, -- ← fs_image.comments_unread | Số bình luận chưa đọc.
  "comments_last_time" timestamptz, -- ← fs_image.comments_last_time | Thời điểm bình luận gần nhất.
  "comments_published" integer NOT NULL, -- ← fs_image.comments_published | Trạng thái hiển thị của bình luận.
  "show_in_home" boolean NOT NULL, -- ← fs_image.show_in_home | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "date_start" timestamptz, -- ← fs_image.date_start | Ngày bắt đầu.
  "date_end" timestamptz, -- ← fs_image.date_end | Ngày kết thúc.
  "is_hotdeal" boolean, -- ← fs_image.is_hotdeal | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "warranty" integer, -- ← fs_image.warranty | Thông tin bảo hành.
  "is_sell" boolean NOT NULL, -- ← fs_image.is_sell | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_hot" boolean NOT NULL, -- ← fs_image.is_hot | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "rating_count" integer NOT NULL, -- ← fs_image.rating_count | Số lượt đánh giá.
  "is_new" boolean NOT NULL, -- ← fs_image.is_new | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "size_name" varchar(255), -- ← fs_image.size_name | Tên kích thước/quy cách.
  "user_id" integer REFERENCES cic_users(id), -- ← fs_image.user_id | ✅ FK CHUẨN: Bảng đích users tồn tại rõ ràng trong schema này — khai báo REFERENCES users(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "username" varchar(255), -- ← fs_image.username | Tên đăng nhập.
  "user_image" varchar(255), -- ← fs_image.user_image | Ảnh đại diện người dùng.
  "user_full_name" varchar(255), -- ← fs_image.user_full_name | Họ tên đầy đủ của người dùng.
  "link_video" text, -- ← fs_image.link_video | Liên kết video (ví dụ YouTube).
  "is_sale" boolean, -- ← fs_image.is_sale | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_status" boolean, -- ← fs_image.is_status | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "latitude" numeric(9,6), -- ← fs_image.latitude | Đổi từ varchar sang numeric(9,6) để tính toán/toạ độ chính xác, hỗ trợ query khoảng cách (PostGIS) sau này.
  "longitude" numeric(9,6), -- ← fs_image.longitude | Đổi từ varchar sang numeric(9,6) để tính toán/toạ độ chính xác, hỗ trợ query khoảng cách (PostGIS) sau này.
  "city_id" integer REFERENCES cic_cities(id), -- ← fs_image.city_id | ✅ FK CHUẨN: Bảng đích cities tồn tại rõ ràng trong schema này — khai báo REFERENCES cities(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "city_name" varchar(255), -- ← fs_image.city_name | Tên tỉnh/thành phố.
  "city_alias" varchar(255), -- ← fs_image.city_alias | Alias của tỉnh/thành phố.
  "district_alias" varchar(255), -- ← fs_image.district_alias | Alias của quận/huyện.
  "district_name" varchar(255), -- ← fs_image.district_name | Tên quận/huyện.
  "colors" varchar(255), -- ← fs_image.colors | Danh sách/thông tin màu sắc.
  "sizes" varchar(255), -- ← fs_image.sizes | Danh sách kích thước/quy cách.
  "icon" varchar(255), -- ← fs_image.icon | Đường dẫn/tên biểu tượng (icon).
  "application" varchar(255), -- ← fs_image.application | Tên/mã ứng dụng (component) liên quan.
  "session_id" integer, -- ← fs_image.session_id | ℹ️ KHÔNG PHẢI KHOÁ NGOẠI THẬT — Đây là chuỗi định danh phiên làm việc tạm thời (session id, thường do PHP session hoặc client tự sinh) dùng để nhóm các bản ghi tạm trước khi có record_id chính thức, KHÔNG trỏ tới một bảng dữ liệu nào. Không có bảng "sessions" trong hệ thống — không FK, không cần index cho mục đích tham chiếu (nếu cần tra cứu nhanh theo session thì đã có sẵn ở nhóm index alias/FK khác nếu áp dụng).
  "name" varchar(255), -- ← fs_image.name + fs_image_en.name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "alias" varchar(255), -- ← fs_image.alias + fs_image_en.alias | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "category_name" varchar(255), -- ← fs_image.category_name + fs_image_en.category_name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "summary" text, -- ← fs_image.summary + fs_image_en.summary | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "description" text, -- ← fs_image.description + fs_image_en.description | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "keyword" varchar(255), -- ← fs_image.keyword + fs_image_en.keyword | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_title" varchar(255), -- ← fs_image.seo_title + fs_image_en.seo_title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_keyword" varchar(255), -- ← fs_image.seo_keyword + fs_image_en.seo_keyword | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_description" varchar(255), -- ← fs_image.seo_description + fs_image_en.seo_description | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "guarantee" varchar(255), -- ← fs_image.guarantee + fs_image_en.guarantee | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "feature_details" text, -- ← fs_image.feature_details + fs_image_en.feature_details | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "application_name" varchar(255), -- ← fs_image.application_name + fs_image_en.application_name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "types_name" varchar(255), -- ← fs_image.types_name + fs_image_en.types_name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "title" varchar(255), -- ← fs_image.title + fs_image_en.title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "buy_status_id" integer, -- ← fs_image.buy_status_id | ⚠️ THIẾU BẢNG THAM CHIẾU — LEGACY: Không có dữ liệu. Không tìm thấy trong PHP source, chỉ tồn tại ở schema dump. Ứng viên xoá (CANDIDATE FOR REMOVAL) sau khi backup và xác nhận runtime — không FK, không index. Cần xem xét thêm nếu sau này có tài liệu xác nhận nghiệp vụ (hiện không referenced trong code, luôn = 0).
  "district_id" integer -- ← fs_image.district_id | ⚠️ THIẾU BẢNG THAM CHIẾU — LEGACY: Không có dữ liệu. Ý nghĩa nghiệp vụ chưa xác định — không FK, không index.
);

-- Thư viện ảnh (album).
DROP TABLE IF EXISTS "cic_image_en" CASCADE;
CREATE TABLE "cic_image_en" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_image.id / fs_image_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "code" varchar(255), -- ← fs_image.code · fs_image_en.code | Mã định danh dạng chuỗi (mã code) của đối tượng.
  "category_id" integer, -- ← fs_image.category_id · fs_image_en.category_id | ⚠️ THIẾU BẢNG THAM CHIẾU — Không tồn tại bảng danh mục dành riêng cho module "image" (không có bảng kiểu "image_categories") trong cả MySQL gốc lẫn schema mới, và không có tài liệu nghiệp vụ xác nhận cột này trỏ tới bảng nào khác. Giữ nguyên dạng LEGACY, không FK, không index. Cần bổ sung bảng danh mục tương ứng hoặc xác nhận lại với đội nghiệp vụ khi có thêm tài liệu.
  "category_id_wrapper" varchar(255), -- ← fs_image.category_id_wrapper · fs_image_en.category_id_wrapper | Mã danh mục cha bao ngoài (dùng cho breadcrumb/URL lồng nhau).
  "category_root_alias" varchar(255), -- ← fs_image.category_root_alias · fs_image_en.category_root_alias | Alias của danh mục gốc (cấp cao nhất).
  "category_alias" varchar(255), -- ← fs_image.category_alias · fs_image_en.category_alias | Alias của danh mục.
  "category_alias_wrapper" varchar(255), -- ← fs_image.category_alias_wrapper · fs_image_en.category_alias_wrapper | Alias bao ngoài của danh mục cha.
  "category_published" boolean, -- ← fs_image.category_published · fs_image_en.category_published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "image" varchar(255), -- ← fs_image.image · fs_image_en.image | Đường dẫn ảnh chính.
  "video" text, -- ← fs_image.video · fs_image_en.video | Đường dẫn/nội dung video.
  "manufactory" integer, -- ← fs_image.manufactory · fs_image_en.manufactory | Nhà sản xuất.
  "manufactory_alias" varchar(255), -- ← fs_image.manufactory_alias · fs_image_en.manufactory_alias | Alias của nhà sản xuất.
  "manufactory_name" varchar(255), -- ← fs_image.manufactory_name · fs_image_en.manufactory_name | Tên nhà sản xuất.
  "manufactory_image" varchar(255), -- ← fs_image.manufactory_image · fs_image_en.manufactory_image | Ảnh/logo nhà sản xuất.
  "model" varchar(255), -- ← fs_image.model · fs_image_en.model | Mẫu mã/model sản phẩm.
  "model_alias" varchar(255), -- ← fs_image.model_alias · fs_image_en.model_alias | Alias của mẫu mã sản phẩm.
  "model_name" varchar(255), -- ← fs_image.model_name · fs_image_en.model_name | Tên mẫu mã sản phẩm.
  "tablename" varchar(100), -- ← fs_image.tablename · fs_image_en.tablename | Tên bảng liên kết.
  "price" double precision, -- ← fs_image.price · fs_image_en.price | Giá bán.
  "price_old" double precision, -- ← fs_image.price_old · fs_image_en.price_old | Giá cũ (giá gốc trước khuyến mãi).
  "discount" double precision, -- ← fs_image.discount · fs_image_en.discount | Giá trị giảm giá.
  "discount_unit" varchar(255), -- ← fs_image.discount_unit · fs_image_en.discount_unit | Đơn vị tính của giảm giá (%, VNĐ...).
  "quantity" integer NOT NULL, -- ← fs_image.quantity · fs_image_en.quantity | Số lượng.
  "currency" varchar(50), -- ← fs_image.currency · fs_image_en.currency | Đơn vị tiền tệ.
  "created_time" timestamptz, -- ← fs_image.created_time · fs_image_en.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "edited_time" timestamptz, -- ← fs_image.edited_time · fs_image_en.edited_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "published" boolean, -- ← fs_image.published · fs_image_en.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer, -- ← fs_image.ordering · fs_image_en.ordering | Thứ tự sắp xếp hiển thị.
  "hits" integer NOT NULL, -- ← fs_image.hits · fs_image_en.hits | Tổng lượt xem/truy cập.
  "sale_count" integer, -- ← fs_image.sale_count · fs_image_en.sale_count | Số lượng đã bán.
  "tags" varchar(255), -- ← fs_image.tags · fs_image_en.tags | Thẻ gắn với nội dung (dùng để phân loại/tìm kiếm).
  "favourite" integer NOT NULL, -- ← fs_image.favourite · fs_image_en.favourite | Đánh dấu yêu thích.
  "types" varchar(255), -- ← fs_image.types | Danh sách loại/phân loại.
  "status" varchar(255), -- ← fs_image.status · fs_image_en.status | Trạng thái của bản ghi.
  "products_related" varchar(255), -- ← fs_image.products_related · fs_image_en.products_related | Sản phẩm liên quan.
  "news_related" varchar(255), -- ← fs_image.news_related · fs_image_en.news_related | Tin tức liên quan.
  "comments_total" integer NOT NULL, -- ← fs_image.comments_total · fs_image_en.comments_total | Tổng số bình luận.
  "comments_unread" integer NOT NULL, -- ← fs_image.comments_unread · fs_image_en.comments_unread | Số bình luận chưa đọc.
  "comments_last_time" timestamptz, -- ← fs_image.comments_last_time · fs_image_en.comments_last_time | Thời điểm bình luận gần nhất.
  "comments_published" integer NOT NULL, -- ← fs_image.comments_published · fs_image_en.comments_published | Trạng thái hiển thị của bình luận.
  "show_in_home" boolean NOT NULL, -- ← fs_image.show_in_home · fs_image_en.show_in_home | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "date_start" timestamptz, -- ← fs_image.date_start · fs_image_en.date_start | Ngày bắt đầu.
  "date_end" timestamptz, -- ← fs_image.date_end · fs_image_en.date_end | Ngày kết thúc.
  "is_hotdeal" boolean, -- ← fs_image.is_hotdeal · fs_image_en.is_hotdeal | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "warranty" integer, -- ← fs_image.warranty · fs_image_en.warranty | Thông tin bảo hành.
  "is_sell" boolean NOT NULL, -- ← fs_image.is_sell · fs_image_en.is_sell | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_hot" boolean NOT NULL, -- ← fs_image.is_hot | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "rating_count" integer NOT NULL, -- ← fs_image.rating_count · fs_image_en.rating_count | Số lượt đánh giá.
  "is_new" boolean NOT NULL, -- ← fs_image.is_new · fs_image_en.is_new | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "size_name" varchar(255), -- ← fs_image.size_name · fs_image_en.size_name | Tên kích thước/quy cách.
  "user_id" integer REFERENCES cic_users(id), -- ← fs_image.user_id · fs_image_en.user_id | ✅ FK CHUẨN: Bảng đích users tồn tại rõ ràng trong schema này — khai báo REFERENCES users(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "username" varchar(255), -- ← fs_image.username · fs_image_en.username | Tên đăng nhập.
  "user_image" varchar(255), -- ← fs_image.user_image · fs_image_en.user_image | Ảnh đại diện người dùng.
  "user_full_name" varchar(255), -- ← fs_image.user_full_name · fs_image_en.user_full_name | Họ tên đầy đủ của người dùng.
  "link_video" text, -- ← fs_image.link_video · fs_image_en.link_video | Liên kết video (ví dụ YouTube).
  "is_sale" boolean, -- ← fs_image.is_sale · fs_image_en.is_sale | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_status" boolean, -- ← fs_image.is_status · fs_image_en.is_status | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "latitude" numeric(9,6), -- ← fs_image.latitude · fs_image_en.latitude | Đổi từ varchar sang numeric(9,6) để tính toán/toạ độ chính xác, hỗ trợ query khoảng cách (PostGIS) sau này.
  "longitude" numeric(9,6), -- ← fs_image.longitude · fs_image_en.longitude | Đổi từ varchar sang numeric(9,6) để tính toán/toạ độ chính xác, hỗ trợ query khoảng cách (PostGIS) sau này.
  "city_id" integer REFERENCES cic_cities_en(id), -- ← fs_image.city_id · fs_image_en.city_id | ✅ FK CHUẨN: Bảng đích cities_en tồn tại rõ ràng trong schema này — khai báo REFERENCES cities_en(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "city_name" varchar(255), -- ← fs_image.city_name · fs_image_en.city_name | Tên tỉnh/thành phố.
  "city_alias" varchar(255), -- ← fs_image.city_alias · fs_image_en.city_alias | Alias của tỉnh/thành phố.
  "district_alias" varchar(255), -- ← fs_image.district_alias · fs_image_en.district_alias | Alias của quận/huyện.
  "district_name" varchar(255), -- ← fs_image.district_name · fs_image_en.district_name | Tên quận/huyện.
  "colors" varchar(255), -- ← fs_image.colors · fs_image_en.colors | Danh sách/thông tin màu sắc.
  "sizes" varchar(255), -- ← fs_image.sizes · fs_image_en.sizes | Danh sách kích thước/quy cách.
  "icon" varchar(255), -- ← fs_image.icon · fs_image_en.icon | Đường dẫn/tên biểu tượng (icon).
  "application" varchar(255), -- ← fs_image.application | Tên/mã ứng dụng (component) liên quan.
  "session_id" integer, -- ← fs_image.session_id · fs_image_en.session_id | ℹ️ KHÔNG PHẢI KHOÁ NGOẠI THẬT — Đây là chuỗi định danh phiên làm việc tạm thời (session id, thường do PHP session hoặc client tự sinh) dùng để nhóm các bản ghi tạm trước khi có record_id chính thức, KHÔNG trỏ tới một bảng dữ liệu nào. Không có bảng "sessions" trong hệ thống — không FK, không cần index cho mục đích tham chiếu (nếu cần tra cứu nhanh theo session thì đã có sẵn ở nhóm index alias/FK khác nếu áp dụng).
  "name" varchar(255), -- ← fs_image.name + fs_image_en.name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "alias" varchar(255), -- ← fs_image.alias + fs_image_en.alias | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "category_name" varchar(255), -- ← fs_image.category_name + fs_image_en.category_name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "summary" text, -- ← fs_image.summary + fs_image_en.summary | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "description" text, -- ← fs_image.description + fs_image_en.description | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "keyword" varchar(255), -- ← fs_image.keyword + fs_image_en.keyword | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_title" varchar(255), -- ← fs_image.seo_title + fs_image_en.seo_title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_keyword" varchar(255), -- ← fs_image.seo_keyword + fs_image_en.seo_keyword | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_description" varchar(255), -- ← fs_image.seo_description + fs_image_en.seo_description | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "guarantee" varchar(255), -- ← fs_image.guarantee + fs_image_en.guarantee | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "feature_details" text, -- ← fs_image.feature_details + fs_image_en.feature_details | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "application_name" varchar(255), -- ← fs_image.application_name + fs_image_en.application_name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "types_name" varchar(255), -- ← fs_image.types_name + fs_image_en.types_name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "title" varchar(255), -- ← fs_image.title + fs_image_en.title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "buy_status_id" integer, -- ← fs_image.buy_status_id · fs_image_en.buy_status_id | ⚠️ THIẾU BẢNG THAM CHIẾU — LEGACY: Không có dữ liệu. Không tìm thấy trong PHP source, chỉ tồn tại ở schema dump. Ứng viên xoá (CANDIDATE FOR REMOVAL) sau khi backup và xác nhận runtime — không FK, không index. Cần xem xét thêm nếu sau này có tài liệu xác nhận nghiệp vụ (hiện không referenced trong code, luôn = 0).
  "district_id" integer -- ← fs_image.district_id · fs_image_en.district_id | ⚠️ THIẾU BẢNG THAM CHIẾU — LEGACY: Không có dữ liệu. Ý nghĩa nghiệp vụ chưa xác định — không FK, không index.
);

-- Ảnh chi tiết bên trong từng album (fs_image).
DROP TABLE IF EXISTS "cic_image_images" CASCADE;
CREATE TABLE "cic_image_images" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_image_images.id / fs_image_images_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "code" varchar(255), -- ← fs_image_images.code | Mã định danh dạng chuỗi (mã code) của đối tượng.
  "category_id" integer, -- ← fs_image_images.category_id | ⚠️ THIẾU BẢNG THAM CHIẾU — Không tồn tại bảng danh mục dành riêng cho module "image_images" (không có bảng kiểu "image_images_categories") trong cả MySQL gốc lẫn schema mới, và không có tài liệu nghiệp vụ xác nhận cột này trỏ tới bảng nào khác. Giữ nguyên dạng LEGACY, không FK, không index. Cần bổ sung bảng danh mục tương ứng hoặc xác nhận lại với đội nghiệp vụ khi có thêm tài liệu.
  "category_id_wrapper" varchar(255), -- ← fs_image_images.category_id_wrapper | Mã danh mục cha bao ngoài (dùng cho breadcrumb/URL lồng nhau).
  "category_root_alias" varchar(255), -- ← fs_image_images.category_root_alias | Alias của danh mục gốc (cấp cao nhất).
  "category_alias" varchar(255), -- ← fs_image_images.category_alias | Alias của danh mục.
  "category_alias_wrapper" varchar(255), -- ← fs_image_images.category_alias_wrapper | Alias bao ngoài của danh mục cha.
  "category_published" boolean, -- ← fs_image_images.category_published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "image" varchar(255), -- ← fs_image_images.image | Đường dẫn ảnh chính.
  "video" text, -- ← fs_image_images.video | Đường dẫn/nội dung video.
  "manufactory" integer, -- ← fs_image_images.manufactory | Nhà sản xuất.
  "manufactory_alias" varchar(255), -- ← fs_image_images.manufactory_alias | Alias của nhà sản xuất.
  "manufactory_name" varchar(255), -- ← fs_image_images.manufactory_name | Tên nhà sản xuất.
  "manufactory_image" varchar(255), -- ← fs_image_images.manufactory_image | Ảnh/logo nhà sản xuất.
  "model" varchar(255), -- ← fs_image_images.model | Mẫu mã/model sản phẩm.
  "model_alias" varchar(255), -- ← fs_image_images.model_alias | Alias của mẫu mã sản phẩm.
  "model_name" varchar(255), -- ← fs_image_images.model_name | Tên mẫu mã sản phẩm.
  "tablename" varchar(100), -- ← fs_image_images.tablename | Tên bảng liên kết.
  "price" double precision, -- ← fs_image_images.price | Giá bán.
  "price_old" double precision, -- ← fs_image_images.price_old | Giá cũ (giá gốc trước khuyến mãi).
  "discount" double precision, -- ← fs_image_images.discount | Giá trị giảm giá.
  "discount_unit" varchar(255), -- ← fs_image_images.discount_unit | Đơn vị tính của giảm giá (%, VNĐ...).
  "quantity" integer NOT NULL, -- ← fs_image_images.quantity | Số lượng.
  "currency" varchar(50), -- ← fs_image_images.currency | Đơn vị tiền tệ.
  "created_time" timestamptz, -- ← fs_image_images.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "edited_time" timestamptz, -- ← fs_image_images.edited_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "published" boolean, -- ← fs_image_images.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer, -- ← fs_image_images.ordering | Thứ tự sắp xếp hiển thị.
  "hits" integer NOT NULL, -- ← fs_image_images.hits | Tổng lượt xem/truy cập.
  "sale_count" integer, -- ← fs_image_images.sale_count | Số lượng đã bán.
  "tags" varchar(255), -- ← fs_image_images.tags | Thẻ gắn với nội dung (dùng để phân loại/tìm kiếm).
  "favourite" integer NOT NULL, -- ← fs_image_images.favourite | Đánh dấu yêu thích.
  "types" varchar(255), -- ← fs_image_images.types | Danh sách loại/phân loại.
  "status" varchar(255), -- ← fs_image_images.status | Trạng thái của bản ghi.
  "products_related" varchar(255), -- ← fs_image_images.products_related | Sản phẩm liên quan.
  "news_related" varchar(255), -- ← fs_image_images.news_related | Tin tức liên quan.
  "comments_total" integer NOT NULL, -- ← fs_image_images.comments_total | Tổng số bình luận.
  "comments_unread" integer NOT NULL, -- ← fs_image_images.comments_unread | Số bình luận chưa đọc.
  "comments_last_time" timestamptz, -- ← fs_image_images.comments_last_time | Thời điểm bình luận gần nhất.
  "comments_published" integer NOT NULL, -- ← fs_image_images.comments_published | Trạng thái hiển thị của bình luận.
  "show_in_home" boolean NOT NULL, -- ← fs_image_images.show_in_home | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "date_start" timestamptz, -- ← fs_image_images.date_start | Ngày bắt đầu.
  "date_end" timestamptz, -- ← fs_image_images.date_end | Ngày kết thúc.
  "is_hotdeal" boolean, -- ← fs_image_images.is_hotdeal | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "warranty" integer, -- ← fs_image_images.warranty | Thông tin bảo hành.
  "is_sell" boolean NOT NULL, -- ← fs_image_images.is_sell | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_hot" boolean NOT NULL, -- ← fs_image_images.is_hot | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "rating_count" integer NOT NULL, -- ← fs_image_images.rating_count | Số lượt đánh giá.
  "is_new" boolean NOT NULL, -- ← fs_image_images.is_new | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "size_name" varchar(255), -- ← fs_image_images.size_name | Tên kích thước/quy cách.
  "user_id" integer REFERENCES cic_users(id), -- ← fs_image_images.user_id | ✅ FK CHUẨN: Bảng đích users tồn tại rõ ràng trong schema này — khai báo REFERENCES users(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "username" varchar(255), -- ← fs_image_images.username | Tên đăng nhập.
  "user_image" varchar(255), -- ← fs_image_images.user_image | Ảnh đại diện người dùng.
  "user_full_name" varchar(255), -- ← fs_image_images.user_full_name | Họ tên đầy đủ của người dùng.
  "link_video" text, -- ← fs_image_images.link_video | Liên kết video (ví dụ YouTube).
  "is_sale" boolean, -- ← fs_image_images.is_sale | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_status" boolean, -- ← fs_image_images.is_status | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "latitude" numeric(9,6), -- ← fs_image_images.latitude | Đổi từ varchar sang numeric(9,6) để tính toán/toạ độ chính xác, hỗ trợ query khoảng cách (PostGIS) sau này.
  "longitude" numeric(9,6), -- ← fs_image_images.longitude | Đổi từ varchar sang numeric(9,6) để tính toán/toạ độ chính xác, hỗ trợ query khoảng cách (PostGIS) sau này.
  "city_id" integer REFERENCES cic_cities(id), -- ← fs_image_images.city_id | ✅ FK CHUẨN: Bảng đích cities tồn tại rõ ràng trong schema này — khai báo REFERENCES cities(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "city_name" varchar(255), -- ← fs_image_images.city_name | Tên tỉnh/thành phố.
  "city_alias" varchar(255), -- ← fs_image_images.city_alias | Alias của tỉnh/thành phố.
  "district_alias" varchar(255), -- ← fs_image_images.district_alias | Alias của quận/huyện.
  "district_name" varchar(255), -- ← fs_image_images.district_name | Tên quận/huyện.
  "colors" varchar(255), -- ← fs_image_images.colors | Danh sách/thông tin màu sắc.
  "sizes" varchar(255), -- ← fs_image_images.sizes | Danh sách kích thước/quy cách.
  "icon" varchar(255), -- ← fs_image_images.icon | Đường dẫn/tên biểu tượng (icon).
  "application" varchar(255), -- ← fs_image_images.application | Tên/mã ứng dụng (component) liên quan.
  "session_id" varchar(255), -- ← fs_image_images.session_id | ℹ️ KHÔNG PHẢI KHOÁ NGOẠI THẬT — Đây là chuỗi định danh phiên làm việc tạm thời (session id, thường do PHP session hoặc client tự sinh) dùng để nhóm các bản ghi tạm trước khi có record_id chính thức, KHÔNG trỏ tới một bảng dữ liệu nào. Không có bảng "sessions" trong hệ thống — không FK, không cần index cho mục đích tham chiếu (nếu cần tra cứu nhanh theo session thì đã có sẵn ở nhóm index alias/FK khác nếu áp dụng).
  "record_id" integer REFERENCES cic_image(id), -- ← fs_image_images.record_id | ✅ FK CHUẨN: Bảng đích image tồn tại rõ ràng trong schema này — khai báo REFERENCES image(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "buy_status_id" integer, -- ← fs_image_images.buy_status_id | ⚠️ THIẾU BẢNG THAM CHIẾU — LEGACY: Không có dữ liệu. Không tìm thấy trong PHP source, chỉ tồn tại ở schema dump. Ứng viên xoá (CANDIDATE FOR REMOVAL) sau khi backup và xác nhận runtime — không FK, không index. Cần xem xét thêm nếu sau này có tài liệu xác nhận nghiệp vụ (hiện không referenced trong code, luôn = 0).
  "district_id" integer, -- ← fs_image_images.district_id | ⚠️ THIẾU BẢNG THAM CHIẾU — LEGACY: Không có dữ liệu. Ý nghĩa nghiệp vụ chưa xác định — không FK, không index.
  "name" varchar(255), -- ← fs_image_images.name + fs_image_images_en.name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "alias" varchar(255), -- ← fs_image_images.alias + fs_image_images_en.alias | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "category_name" varchar(255), -- ← fs_image_images.category_name + fs_image_images_en.category_name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "summary" text, -- ← fs_image_images.summary + fs_image_images_en.summary | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "description" text, -- ← fs_image_images.description + fs_image_images_en.description | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "keyword" varchar(255), -- ← fs_image_images.keyword + fs_image_images_en.keyword | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_title" varchar(255), -- ← fs_image_images.seo_title + fs_image_images_en.seo_title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_keyword" varchar(255), -- ← fs_image_images.seo_keyword + fs_image_images_en.seo_keyword | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_description" varchar(255), -- ← fs_image_images.seo_description + fs_image_images_en.seo_description | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "guarantee" varchar(255), -- ← fs_image_images.guarantee + fs_image_images_en.guarantee | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "feature_details" text, -- ← fs_image_images.feature_details + fs_image_images_en.feature_details | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "application_name" varchar(255), -- ← fs_image_images.application_name + fs_image_images_en.application_name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "types_name" varchar(255), -- ← fs_image_images.types_name + fs_image_images_en.types_name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "title" varchar(255) -- ← fs_image_images.title + fs_image_images_en.title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
);

-- Ảnh chi tiết bên trong từng album (fs_image).
DROP TABLE IF EXISTS "cic_image_images_en" CASCADE;
CREATE TABLE "cic_image_images_en" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_image_images.id / fs_image_images_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "code" varchar(255), -- ← fs_image_images.code · fs_image_images_en.code | Mã định danh dạng chuỗi (mã code) của đối tượng.
  "category_id" integer, -- ← fs_image_images.category_id · fs_image_images_en.category_id | ⚠️ THIẾU BẢNG THAM CHIẾU — Không tồn tại bảng danh mục dành riêng cho module "image_images" (không có bảng kiểu "image_images_categories") trong cả MySQL gốc lẫn schema mới, và không có tài liệu nghiệp vụ xác nhận cột này trỏ tới bảng nào khác. Giữ nguyên dạng LEGACY, không FK, không index. Cần bổ sung bảng danh mục tương ứng hoặc xác nhận lại với đội nghiệp vụ khi có thêm tài liệu.
  "category_id_wrapper" varchar(255), -- ← fs_image_images.category_id_wrapper · fs_image_images_en.category_id_wrapper | Mã danh mục cha bao ngoài (dùng cho breadcrumb/URL lồng nhau).
  "category_root_alias" varchar(255), -- ← fs_image_images.category_root_alias · fs_image_images_en.category_root_alias | Alias của danh mục gốc (cấp cao nhất).
  "category_alias" varchar(255), -- ← fs_image_images.category_alias · fs_image_images_en.category_alias | Alias của danh mục.
  "category_alias_wrapper" varchar(255), -- ← fs_image_images.category_alias_wrapper · fs_image_images_en.category_alias_wrapper | Alias bao ngoài của danh mục cha.
  "category_published" boolean, -- ← fs_image_images.category_published · fs_image_images_en.category_published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "image" varchar(255), -- ← fs_image_images.image · fs_image_images_en.image | Đường dẫn ảnh chính.
  "video" text, -- ← fs_image_images.video · fs_image_images_en.video | Đường dẫn/nội dung video.
  "manufactory" integer, -- ← fs_image_images.manufactory · fs_image_images_en.manufactory | Nhà sản xuất.
  "manufactory_alias" varchar(255), -- ← fs_image_images.manufactory_alias · fs_image_images_en.manufactory_alias | Alias của nhà sản xuất.
  "manufactory_name" varchar(255), -- ← fs_image_images.manufactory_name · fs_image_images_en.manufactory_name | Tên nhà sản xuất.
  "manufactory_image" varchar(255), -- ← fs_image_images.manufactory_image · fs_image_images_en.manufactory_image | Ảnh/logo nhà sản xuất.
  "model" varchar(255), -- ← fs_image_images.model · fs_image_images_en.model | Mẫu mã/model sản phẩm.
  "model_alias" varchar(255), -- ← fs_image_images.model_alias · fs_image_images_en.model_alias | Alias của mẫu mã sản phẩm.
  "model_name" varchar(255), -- ← fs_image_images.model_name · fs_image_images_en.model_name | Tên mẫu mã sản phẩm.
  "tablename" varchar(100), -- ← fs_image_images.tablename · fs_image_images_en.tablename | Tên bảng liên kết.
  "price" double precision, -- ← fs_image_images.price · fs_image_images_en.price | Giá bán.
  "price_old" double precision, -- ← fs_image_images.price_old · fs_image_images_en.price_old | Giá cũ (giá gốc trước khuyến mãi).
  "discount" double precision, -- ← fs_image_images.discount · fs_image_images_en.discount | Giá trị giảm giá.
  "discount_unit" varchar(255), -- ← fs_image_images.discount_unit · fs_image_images_en.discount_unit | Đơn vị tính của giảm giá (%, VNĐ...).
  "quantity" integer NOT NULL, -- ← fs_image_images.quantity · fs_image_images_en.quantity | Số lượng.
  "currency" varchar(50), -- ← fs_image_images.currency · fs_image_images_en.currency | Đơn vị tiền tệ.
  "created_time" timestamptz, -- ← fs_image_images.created_time · fs_image_images_en.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "edited_time" timestamptz, -- ← fs_image_images.edited_time · fs_image_images_en.edited_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "published" boolean, -- ← fs_image_images.published · fs_image_images_en.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer, -- ← fs_image_images.ordering · fs_image_images_en.ordering | Thứ tự sắp xếp hiển thị.
  "hits" integer NOT NULL, -- ← fs_image_images.hits · fs_image_images_en.hits | Tổng lượt xem/truy cập.
  "sale_count" integer, -- ← fs_image_images.sale_count · fs_image_images_en.sale_count | Số lượng đã bán.
  "tags" varchar(255), -- ← fs_image_images.tags · fs_image_images_en.tags | Thẻ gắn với nội dung (dùng để phân loại/tìm kiếm).
  "favourite" integer NOT NULL, -- ← fs_image_images.favourite · fs_image_images_en.favourite | Đánh dấu yêu thích.
  "types" varchar(255), -- ← fs_image_images.types | Danh sách loại/phân loại.
  "status" varchar(255), -- ← fs_image_images.status · fs_image_images_en.status | Trạng thái của bản ghi.
  "products_related" varchar(255), -- ← fs_image_images.products_related · fs_image_images_en.products_related | Sản phẩm liên quan.
  "news_related" varchar(255), -- ← fs_image_images.news_related · fs_image_images_en.news_related | Tin tức liên quan.
  "comments_total" integer NOT NULL, -- ← fs_image_images.comments_total · fs_image_images_en.comments_total | Tổng số bình luận.
  "comments_unread" integer NOT NULL, -- ← fs_image_images.comments_unread · fs_image_images_en.comments_unread | Số bình luận chưa đọc.
  "comments_last_time" timestamptz, -- ← fs_image_images.comments_last_time · fs_image_images_en.comments_last_time | Thời điểm bình luận gần nhất.
  "comments_published" integer NOT NULL, -- ← fs_image_images.comments_published · fs_image_images_en.comments_published | Trạng thái hiển thị của bình luận.
  "show_in_home" boolean NOT NULL, -- ← fs_image_images.show_in_home · fs_image_images_en.show_in_home | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "date_start" timestamptz, -- ← fs_image_images.date_start · fs_image_images_en.date_start | Ngày bắt đầu.
  "date_end" timestamptz, -- ← fs_image_images.date_end · fs_image_images_en.date_end | Ngày kết thúc.
  "is_hotdeal" boolean, -- ← fs_image_images.is_hotdeal · fs_image_images_en.is_hotdeal | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "warranty" integer, -- ← fs_image_images.warranty · fs_image_images_en.warranty | Thông tin bảo hành.
  "is_sell" boolean NOT NULL, -- ← fs_image_images.is_sell · fs_image_images_en.is_sell | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_hot" boolean NOT NULL, -- ← fs_image_images.is_hot | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "rating_count" integer NOT NULL, -- ← fs_image_images.rating_count · fs_image_images_en.rating_count | Số lượt đánh giá.
  "is_new" boolean NOT NULL, -- ← fs_image_images.is_new · fs_image_images_en.is_new | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "size_name" varchar(255), -- ← fs_image_images.size_name · fs_image_images_en.size_name | Tên kích thước/quy cách.
  "user_id" integer REFERENCES cic_users(id), -- ← fs_image_images.user_id · fs_image_images_en.user_id | ✅ FK CHUẨN: Bảng đích users tồn tại rõ ràng trong schema này — khai báo REFERENCES users(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "username" varchar(255), -- ← fs_image_images.username · fs_image_images_en.username | Tên đăng nhập.
  "user_image" varchar(255), -- ← fs_image_images.user_image · fs_image_images_en.user_image | Ảnh đại diện người dùng.
  "user_full_name" varchar(255), -- ← fs_image_images.user_full_name · fs_image_images_en.user_full_name | Họ tên đầy đủ của người dùng.
  "link_video" text, -- ← fs_image_images.link_video · fs_image_images_en.link_video | Liên kết video (ví dụ YouTube).
  "is_sale" boolean, -- ← fs_image_images.is_sale · fs_image_images_en.is_sale | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_status" boolean, -- ← fs_image_images.is_status · fs_image_images_en.is_status | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "latitude" numeric(9,6), -- ← fs_image_images.latitude · fs_image_images_en.latitude | Đổi từ varchar sang numeric(9,6) để tính toán/toạ độ chính xác, hỗ trợ query khoảng cách (PostGIS) sau này.
  "longitude" numeric(9,6), -- ← fs_image_images.longitude · fs_image_images_en.longitude | Đổi từ varchar sang numeric(9,6) để tính toán/toạ độ chính xác, hỗ trợ query khoảng cách (PostGIS) sau này.
  "city_id" integer REFERENCES cic_cities_en(id), -- ← fs_image_images.city_id · fs_image_images_en.city_id | ✅ FK CHUẨN: Bảng đích cities_en tồn tại rõ ràng trong schema này — khai báo REFERENCES cities_en(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "city_name" varchar(255), -- ← fs_image_images.city_name · fs_image_images_en.city_name | Tên tỉnh/thành phố.
  "city_alias" varchar(255), -- ← fs_image_images.city_alias · fs_image_images_en.city_alias | Alias của tỉnh/thành phố.
  "district_alias" varchar(255), -- ← fs_image_images.district_alias · fs_image_images_en.district_alias | Alias của quận/huyện.
  "district_name" varchar(255), -- ← fs_image_images.district_name · fs_image_images_en.district_name | Tên quận/huyện.
  "colors" varchar(255), -- ← fs_image_images.colors · fs_image_images_en.colors | Danh sách/thông tin màu sắc.
  "sizes" varchar(255), -- ← fs_image_images.sizes · fs_image_images_en.sizes | Danh sách kích thước/quy cách.
  "icon" varchar(255), -- ← fs_image_images.icon · fs_image_images_en.icon | Đường dẫn/tên biểu tượng (icon).
  "application" varchar(255), -- ← fs_image_images.application | Tên/mã ứng dụng (component) liên quan.
  "session_id" varchar(255), -- ← fs_image_images.session_id · fs_image_images_en.session_id | ℹ️ KHÔNG PHẢI KHOÁ NGOẠI THẬT — Đây là chuỗi định danh phiên làm việc tạm thời (session id, thường do PHP session hoặc client tự sinh) dùng để nhóm các bản ghi tạm trước khi có record_id chính thức, KHÔNG trỏ tới một bảng dữ liệu nào. Không có bảng "sessions" trong hệ thống — không FK, không cần index cho mục đích tham chiếu (nếu cần tra cứu nhanh theo session thì đã có sẵn ở nhóm index alias/FK khác nếu áp dụng).
  "record_id" integer REFERENCES cic_image_en(id), -- ← fs_image_images.record_id · fs_image_images_en.record_id | ✅ FK CHUẨN: Bảng đích image_en tồn tại rõ ràng trong schema này — khai báo REFERENCES image_en(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "buy_status_id" integer, -- ← fs_image_images.buy_status_id · fs_image_images_en.buy_status_id | ⚠️ THIẾU BẢNG THAM CHIẾU — LEGACY: Không có dữ liệu. Không tìm thấy trong PHP source, chỉ tồn tại ở schema dump. Ứng viên xoá (CANDIDATE FOR REMOVAL) sau khi backup và xác nhận runtime — không FK, không index. Cần xem xét thêm nếu sau này có tài liệu xác nhận nghiệp vụ (hiện không referenced trong code, luôn = 0).
  "district_id" integer, -- ← fs_image_images.district_id · fs_image_images_en.district_id | ⚠️ THIẾU BẢNG THAM CHIẾU — LEGACY: Không có dữ liệu. Ý nghĩa nghiệp vụ chưa xác định — không FK, không index.
  "name" varchar(255), -- ← fs_image_images.name + fs_image_images_en.name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "alias" varchar(255), -- ← fs_image_images.alias + fs_image_images_en.alias | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "category_name" varchar(255), -- ← fs_image_images.category_name + fs_image_images_en.category_name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "summary" text, -- ← fs_image_images.summary + fs_image_images_en.summary | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "description" text, -- ← fs_image_images.description + fs_image_images_en.description | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "keyword" varchar(255), -- ← fs_image_images.keyword + fs_image_images_en.keyword | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_title" varchar(255), -- ← fs_image_images.seo_title + fs_image_images_en.seo_title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_keyword" varchar(255), -- ← fs_image_images.seo_keyword + fs_image_images_en.seo_keyword | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_description" varchar(255), -- ← fs_image_images.seo_description + fs_image_images_en.seo_description | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "guarantee" varchar(255), -- ← fs_image_images.guarantee + fs_image_images_en.guarantee | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "feature_details" text, -- ← fs_image_images.feature_details + fs_image_images_en.feature_details | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "application_name" varchar(255), -- ← fs_image_images.application_name + fs_image_images_en.application_name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "types_name" varchar(255), -- ← fs_image_images.types_name + fs_image_images_en.types_name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "title" varchar(255) -- ← fs_image_images.title + fs_image_images_en.title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
);

-- Danh sách video (ví dụ nhúng từ YouTube) hiển thị trên site.
DROP TABLE IF EXISTS "cic_video" CASCADE;
CREATE TABLE "cic_video" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_video.id | Khoá chính tự tăng, dùng identity thay AUTO_INCREMENT.
  "name" varchar(255), -- ← fs_video.name | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "alias" varchar(255), -- ← fs_video.alias | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "image" varchar(255), -- ← fs_video.image | Đường dẫn ảnh chính.
  "summary" text, -- ← fs_video.summary | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "created_time" timestamptz, -- ← fs_video.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "updated_time" timestamptz, -- ← fs_video.updated_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "published" boolean, -- ← fs_video.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "video" varchar(255), -- ← fs_video.video | Đường dẫn/nội dung video.
  "author" varchar(255), -- ← fs_video.author | Tên tác giả nội dung.
  "author_last" varchar(255), -- ← fs_video.author_last | Tên người chỉnh sửa gần nhất.
  "author_id" integer REFERENCES cic_users(id), -- ← fs_video.author_id | ✅ FK CHUẨN: Bảng đích users tồn tại rõ ràng trong schema này — khai báo REFERENCES users(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "author_last_id" integer REFERENCES cic_users(id), -- ← fs_video.author_last_id | ✅ FK CHUẨN: Bảng đích users tồn tại rõ ràng trong schema này — khai báo REFERENCES users(id) tường minh (điều mà schema MySQL cũ dùng MyISAM không hỗ trợ).
  "course_id" integer, -- ← fs_video.course_id | ⚠️ THIẾU BẢNG THAM CHIẾU — LEGACY: Course reference. 10 dòng có dữ liệu (demo cũ 2017). Referenced trong 6 file với CMS Course controller/view (cms/modules/course/controllers/course.php). Không có bảng courses trong MySQL cũ nên không FK, không index.
  "course_category_id" integer, -- ← fs_video.course_category_id | ⚠️ THIẾU BẢNG THAM CHIẾU — LEGACY: Course category reference. Referenced trong 6 file với CMS Course controller/view. Không FK, không index.
  "course_name" varchar(255), -- ← fs_video.course_name | ⚠️ THIẾU BẢNG THAM CHIẾU — LEGACY: Course name reference (VD: Wave Alpha, SH mode, Winner...). Referenced trong 6 file với CMS Course controller/view. Không FK, không index.
  "actflg" varchar(1) NULL, -- ← fs_video.actflg | Giữ để migrate đầy đủ dữ liệu legacy. Cờ trạng thái hoạt động (Active Flag) — trường kỹ thuật kế thừa từ hệ thống khác.
  "ctdusr" varchar(5) NULL, -- ← fs_video.ctdusr | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: người dùng tạo bản ghi (Created User).
  "ctdwks" varchar(15) NULL, -- ← fs_video.ctdwks | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: trạm làm việc tạo bản ghi (Created Workstation).
  "ctddtm" timestamptz NULL, -- ← fs_video.ctddtm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: ngày giờ tạo bản ghi (Created Date-Time).
  "mdfusr" varchar(5) NULL, -- ← fs_video.mdfusr | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: người chỉnh sửa gần nhất (Modified User).
  "mdfwks" varchar(15) NULL, -- ← fs_video.mdfwks | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: trạm làm việc chỉnh sửa gần nhất (Modified Workstation).
  "lstmdf" timestamptz NULL, -- ← fs_video.lstmdf | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: lần chỉnh sửa cuối (Last Modified).
  "cdtpgm" varchar(20) NULL, -- ← fs_video.cdtpgm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: chương trình tạo bản ghi (Created Program) — thường từ hệ thống cũ.
  "mdfpgm" varchar(20) NULL -- ← fs_video.mdfpgm | Giữ để migrate đầy đủ dữ liệu legacy. Trường kỹ thuật kế thừa: chương trình chỉnh sửa gần nhất (Modified Program).
);

-- [BẢNG MỚI] Thư viện media tập trung (Media Library) — asset gốc dùng chung cho picker và các content module.
DROP TABLE IF EXISTS "cic_media_assets" CASCADE;
CREATE TABLE "cic_media_assets" (
  "id" bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← — (bảng mới) | Khoá chính tự tăng.
  "filename" varchar(255) NOT NULL, -- ← — (bảng mới) | Tên file gốc.
  "media_type" varchar(20) NOT NULL CHECK ("media_type" IN ('image','video','document')), -- ← — (bảng mới) | Loại media.
  "mime_type" varchar(150) NOT NULL, -- ← — (bảng mới) | MIME type.
  "storage_path" text NOT NULL, -- ← — (bảng mới) | Đường dẫn lưu trữ.
  "thumbnail_path" text NULL, -- ← — (bảng mới) | Đường dẫn ảnh thumbnail.
  "file_size_bytes" bigint NOT NULL CHECK ("file_size_bytes" >= 0), -- ← — (bảng mới) | Kích thước file (bytes).
  "width" integer NULL CHECK ("width" > 0), -- ← — (bảng mới) | Chiều rộng (ảnh/video).
  "height" integer NULL CHECK ("height" > 0), -- ← — (bảng mới) | Chiều cao (ảnh/video).
  "duration_seconds" numeric(12,3) NULL CHECK ("duration_seconds" >= 0), -- ← — (bảng mới) | Thời lượng video.
  "credit_author" varchar(255) NULL, -- ← — (bảng mới) | Tác giả/nguồn ảnh.
  "license_type" varchar(30) NULL, -- ← — (bảng mới) | Loại giấy phép sử dụng.
  "license_expiry" date NULL, -- ← — (bảng mới) | Ngày hết hạn giấy phép.
  "tags" text[] NOT NULL DEFAULT '{}', -- ← — (bảng mới) | Thẻ gắn asset.
  "workflow_status" varchar(20) NOT NULL DEFAULT 'processing', -- ← — (bảng mới) | Trạng thái xử lý asset.
  "created_by" integer NULL REFERENCES cic_users(id) ON DELETE SET NULL, -- ← — (bảng mới) | Người upload.
  "created_at" timestamptz NOT NULL DEFAULT now(), -- ← — (bảng mới) | Thời điểm tạo.
  "updated_at" timestamptz NOT NULL DEFAULT now(), -- ← — (bảng mới) | Thời điểm cập nhật.
  "deleted_at" timestamptz NULL, -- ← — (bảng mới) | Thời điểm xoá mềm.
  "legacy_source_table" varchar(100) NULL, -- ← — (bảng mới) | Bảng nguồn khi import từ legacy.
  "legacy_source_id" bigint NULL, -- ← — (bảng mới) | ID bản ghi nguồn legacy.
  "legacy_path" text NULL -- ← — (bảng mới) | Đường dẫn/URL legacy giữ lại.
);

-- [BẢNG MỚI] Metadata hiển thị của asset theo từng locale (title/alt/caption).
DROP TABLE IF EXISTS "cic_media_asset_translations" CASCADE;
CREATE TABLE "cic_media_asset_translations" (
  "asset_id" bigint NOT NULL REFERENCES cic_media_assets(id) ON DELETE CASCADE, -- ← — (bảng mới) | Asset gốc.
  "locale" varchar(5) NOT NULL, -- ← — (bảng mới) | Mã locale.
  "title" varchar(255) NOT NULL, -- ← — (bảng mới) | Tiêu đề hiển thị.
  "description" text NULL, -- ← — (bảng mới) | Mô tả.
  "alt_text" text NOT NULL DEFAULT '', -- ← — (bảng mới) | Alt text (SEO/accessibility).
  "caption" text NULL, -- ← — (bảng mới) | Chú thích ảnh.
  "updated_at" timestamptz NOT NULL DEFAULT now(), -- ← — (bảng mới) | Thời điểm cập nhật.
  "updated_by" integer NULL REFERENCES cic_users(id) ON DELETE SET NULL, -- ← — (bảng mới) | Người cập nhật.
  CONSTRAINT "pk_cic_media_asset_translations" PRIMARY KEY ("asset_id", "locale")
);

-- [BẢNG MỚI] Thư mục tổ chức media theo workspace.
DROP TABLE IF EXISTS "cic_media_folders" CASCADE;
CREATE TABLE "cic_media_folders" (
  "id" bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← — (bảng mới) | Khoá chính tự tăng.
  "workspace" varchar(5) NOT NULL, -- ← — (bảng mới) | Workspace VI/EN.
  "name" varchar(255) NOT NULL, -- ← — (bảng mới) | Tên thư mục.
  "alias" varchar(150) NOT NULL, -- ← — (bảng mới) | Alias thư mục.
  "icon" varchar(100) NULL, -- ← — (bảng mới) | Icon hiển thị.
  "ordering" integer NOT NULL DEFAULT 0 CHECK ("ordering" >= 0), -- ← — (bảng mới) | Thứ tự sắp xếp.
  "created_at" timestamptz NOT NULL DEFAULT now(), -- ← — (bảng mới) | Thời điểm tạo.
  "updated_at" timestamptz NOT NULL DEFAULT now(), -- ← — (bảng mới) | Thời điểm cập nhật.
  CONSTRAINT "uq_cic_media_folders_workspace_alias" UNIQUE ("workspace", "alias")
);

-- [BẢNG MỚI] Quan hệ N–N Thư mục ↔ Asset để tổ chức mà không copy file.
DROP TABLE IF EXISTS "cic_media_folder_assets" CASCADE;
CREATE TABLE "cic_media_folder_assets" (
  "folder_id" bigint NOT NULL REFERENCES cic_media_folders(id) ON DELETE CASCADE, -- ← — (bảng mới) | Thư mục chứa asset.
  "asset_id" bigint NOT NULL REFERENCES cic_media_assets(id) ON DELETE CASCADE, -- ← — (bảng mới) | Asset được đặt vào thư mục.
  "ordering" integer NOT NULL DEFAULT 0 CHECK ("ordering" >= 0), -- ← — (bảng mới) | Thứ tự trong thư mục.
  CONSTRAINT "pk_cic_media_folder_assets" PRIMARY KEY ("folder_id", "asset_id")
);

-- [BẢNG MỚI] Album ảnh/video, có cover asset.
DROP TABLE IF EXISTS "cic_media_albums" CASCADE;
CREATE TABLE "cic_media_albums" (
  "id" bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← — (bảng mới) | Khoá chính tự tăng.
  "workspace" varchar(5) NOT NULL, -- ← — (bảng mới) | Workspace VI/EN.
  "title" varchar(255) NOT NULL, -- ← — (bảng mới) | Tên album.
  "alias" varchar(150) NOT NULL, -- ← — (bảng mới) | Alias album.
  "description" text NULL, -- ← — (bảng mới) | Mô tả album.
  "cover_asset_id" bigint NULL REFERENCES cic_media_assets(id) ON DELETE SET NULL, -- ← — (bảng mới) | Asset đại diện (cover).
  "workflow_status" varchar(20) NOT NULL DEFAULT 'draft' CHECK ("workflow_status" IN ('draft','published','archived')), -- ← — (bảng mới) | Trạng thái album.
  "ordering" integer NOT NULL DEFAULT 0 CHECK ("ordering" >= 0), -- ← — (bảng mới) | Thứ tự sắp xếp.
  "created_by" integer NULL REFERENCES cic_users(id) ON DELETE SET NULL, -- ← — (bảng mới) | Người tạo.
  "created_at" timestamptz NOT NULL DEFAULT now(), -- ← — (bảng mới) | Thời điểm tạo.
  "updated_at" timestamptz NOT NULL DEFAULT now(), -- ← — (bảng mới) | Thời điểm cập nhật.
  CONSTRAINT "uq_cic_media_albums_workspace_alias" UNIQUE ("workspace", "alias")
);

-- [BẢNG MỚI] Quan hệ N–N Album ↔ Asset, có thứ tự hiển thị.
DROP TABLE IF EXISTS "cic_media_album_assets" CASCADE;
CREATE TABLE "cic_media_album_assets" (
  "album_id" bigint NOT NULL REFERENCES cic_media_albums(id) ON DELETE CASCADE, -- ← — (bảng mới) | Album chứa asset.
  "asset_id" bigint NOT NULL REFERENCES cic_media_assets(id) ON DELETE CASCADE, -- ← — (bảng mới) | Asset trong album.
  "position" integer NOT NULL CHECK ("position" > 0), -- ← — (bảng mới) | Vị trí hiển thị.
  CONSTRAINT "pk_cic_media_album_assets" PRIMARY KEY ("album_id", "asset_id"),
  CONSTRAINT "uq_cic_media_album_assets_album_id_position" UNIQUE ("album_id", "position")
);

-- [BẢNG MỚI] Lịch sử phiên bản khi Replace Global Asset — giữ nguyên asset ID, lưu bản cũ có audit.
DROP TABLE IF EXISTS "cic_media_versions" CASCADE;
CREATE TABLE "cic_media_versions" (
  "id" bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← — (bảng mới) | Khoá chính tự tăng.
  "asset_id" bigint NOT NULL REFERENCES cic_media_assets(id) ON DELETE CASCADE, -- ← — (bảng mới) | Asset gốc.
  "version_number" integer NOT NULL CHECK ("version_number" >= 1), -- ← — (bảng mới) | Số hiệu version.
  "filename" varchar(255) NOT NULL, -- ← — (bảng mới) | Tên file của version.
  "storage_path" text NOT NULL, -- ← — (bảng mới) | Đường dẫn lưu trữ version.
  "file_size_bytes" bigint NOT NULL CHECK ("file_size_bytes" >= 0), -- ← — (bảng mới) | Kích thước file.
  "replacement_note" text NULL, -- ← — (bảng mới) | Ghi chú khi thay thế.
  "created_by" integer NULL REFERENCES cic_users(id) ON DELETE SET NULL, -- ← — (bảng mới) | Người thực hiện thay thế.
  "created_at" timestamptz NOT NULL DEFAULT now(), -- ← — (bảng mới) | Thời điểm tạo version.
  CONSTRAINT "uq_cic_media_versions_asset_id_version_number" UNIQUE ("asset_id", "version_number")
);

-- [BẢNG MỚI · ĐỀ XUẤT] Biến thể kích thước/định dạng (crop, focal point) của asset.
DROP TABLE IF EXISTS "cic_media_variants" CASCADE;
CREATE TABLE "cic_media_variants" (
  "id" bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← — (bảng mới) | Khoá chính tự tăng.
  "asset_id" bigint NOT NULL REFERENCES cic_media_assets(id) ON DELETE CASCADE, -- ← — (bảng mới) | Asset gốc.
  "preset_name" varchar(50) NOT NULL, -- ← — (bảng mới) | Tên preset kích thước.
  "width" integer NOT NULL CHECK ("width" > 0), -- ← — (bảng mới) | Chiều rộng biến thể.
  "height" integer NOT NULL CHECK ("height" > 0), -- ← — (bảng mới) | Chiều cao biến thể.
  "format" varchar(20) NOT NULL, -- ← — (bảng mới) | Định dạng file biến thể.
  "storage_path" text NOT NULL, -- ← — (bảng mới) | Đường dẫn lưu trữ.
  "file_size_bytes" bigint NOT NULL CHECK ("file_size_bytes" >= 0), -- ← — (bảng mới) | Kích thước file.
  "focal_x" numeric(5,2) NULL CHECK ("focal_x" BETWEEN 0 AND 100), -- ← — (bảng mới) | Toạ độ focal point X (%).
  "focal_y" numeric(5,2) NULL CHECK ("focal_y" BETWEEN 0 AND 100), -- ← — (bảng mới) | Toạ độ focal point Y (%).
  "processing_status" varchar(20) NOT NULL DEFAULT 'processing', -- ← — (bảng mới) | Trạng thái xử lý biến thể.
  CONSTRAINT "uq_cic_media_variants_asset_id_preset_name_format" UNIQUE ("asset_id", "preset_name", "format")
);

-- Danh mục các ứng dụng/module chức năng cài đặt trong hệ thống (component).
DROP TABLE IF EXISTS "cic_application" CASCADE;
CREATE TABLE "cic_application" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_application.id / fs_application_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "code" varchar(255), -- ← fs_application.code | Mã định danh dạng chuỗi (mã code) của đối tượng.
  "tablenames" varchar(255), -- ← fs_application.tablenames | Tên các bảng liên kết (có thể nhiều bảng).
  "published" boolean, -- ← fs_application.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer, -- ← fs_application.ordering | Thứ tự sắp xếp hiển thị.
  "created_time" timestamptz, -- ← fs_application.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "image" varchar(255), -- ← fs_application.image | Đường dẫn ảnh chính.
  "first_toll" varchar(255), -- ← fs_application.first_toll | Chi phí/mức phí ban đầu.
  "show_in_homepage" boolean, -- ← fs_application.show_in_homepage | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "prefix_name" varchar(255), -- ← fs_application.prefix_name | Tiền tố gắn trước tên.
  "old_id" integer, -- ← fs_application.old_id | Giữ tạm để đối chiếu dữ liệu trong lúc migrate; có thể xoá sau khi xác nhận không còn tham chiếu.
  "updated_time" timestamptz, -- ← fs_application.updated_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "color_code" varchar(255), -- ← fs_application.color_code | Mã màu.
  "is_retail" boolean, -- ← fs_application.is_retail | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_common" boolean, -- ← fs_application.is_common | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "name" varchar(255), -- ← fs_application.name + fs_application_en.name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "alias" varchar(255), -- ← fs_application.alias + fs_application_en.alias | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "description" text, -- ← fs_application.description + fs_application_en.description | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_title" varchar(255), -- ← fs_application.seo_title + fs_application_en.seo_title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_keyword" varchar(255), -- ← fs_application.seo_keyword + fs_application_en.seo_keyword | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_description" varchar(255), -- ← fs_application.seo_description + fs_application_en.seo_description | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "content" text -- ← fs_application.content + fs_application_en.content | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
);

-- Danh mục các ứng dụng/module chức năng cài đặt trong hệ thống (component).
DROP TABLE IF EXISTS "cic_application_en" CASCADE;
CREATE TABLE "cic_application_en" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_application.id / fs_application_en.id | Khoá chính tự tăng của bảng gốc, dùng identity thay AUTO_INCREMENT.
  "code" varchar(255), -- ← fs_application.code · fs_application_en.code | Mã định danh dạng chuỗi (mã code) của đối tượng.
  "tablenames" varchar(255), -- ← fs_application.tablenames · fs_application_en.tablenames | Tên các bảng liên kết (có thể nhiều bảng).
  "published" boolean, -- ← fs_application.published · fs_application_en.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "ordering" integer, -- ← fs_application.ordering · fs_application_en.ordering | Thứ tự sắp xếp hiển thị.
  "created_time" timestamptz, -- ← fs_application.created_time · fs_application_en.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "image" varchar(255), -- ← fs_application.image · fs_application_en.image | Đường dẫn ảnh chính.
  "first_toll" varchar(255), -- ← fs_application.first_toll · fs_application_en.first_toll | Chi phí/mức phí ban đầu.
  "show_in_homepage" boolean, -- ← fs_application.show_in_homepage · fs_application_en.show_in_homepage | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "prefix_name" varchar(255), -- ← fs_application.prefix_name · fs_application_en.prefix_name | Tiền tố gắn trước tên.
  "old_id" integer, -- ← fs_application.old_id · fs_application_en.old_id | Giữ tạm để đối chiếu dữ liệu trong lúc migrate; có thể xoá sau khi xác nhận không còn tham chiếu.
  "updated_time" timestamptz, -- ← fs_application.updated_time · fs_application_en.updated_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "color_code" varchar(255), -- ← fs_application.color_code · fs_application_en.color_code | Mã màu.
  "is_retail" boolean, -- ← fs_application.is_retail · fs_application_en.is_retail | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "is_common" boolean, -- ← fs_application.is_common · fs_application_en.is_common | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "name" varchar(255), -- ← fs_application.name + fs_application_en.name | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "alias" varchar(255), -- ← fs_application.alias + fs_application_en.alias | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "description" text, -- ← fs_application.description + fs_application_en.description | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_title" varchar(255), -- ← fs_application.seo_title + fs_application_en.seo_title | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_keyword" varchar(255), -- ← fs_application.seo_keyword + fs_application_en.seo_keyword | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "seo_description" varchar(255), -- ← fs_application.seo_description + fs_application_en.seo_description | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
  "content" text -- ← fs_application.content + fs_application_en.content | Nội dung theo ngôn ngữ — nằm trực tiếp trong bảng độc lập (không tách bảng dịch riêng, theo quyết định tách VI/EN độc lập).
);

-- Danh mục năm (dùng để lọc dữ liệu theo năm, ví dụ báo cáo/sự kiện theo năm).
DROP TABLE IF EXISTS "cic_year" CASCADE;
CREATE TABLE "cic_year" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← fs_year.id | Khoá chính tự tăng, dùng identity thay AUTO_INCREMENT.
  "name" varchar(255), -- ← fs_year.name | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "alias" varchar(255), -- ← fs_year.alias | Chuyển sang bảng dịch riêng vì đây là nội dung hiển thị theo ngôn ngữ.
  "published" boolean, -- ← fs_year.published | Đổi tinyint(4) dạng cờ 0/1 sang boolean thật của Postgres; khuyến nghị NOT NULL DEFAULT.
  "created_time" timestamptz, -- ← fs_year.created_time | Đổi datetime → timestamptz; nên thêm DEFAULT now().
  "edit_time" timestamptz, -- ← fs_year.edit_time | Đổi datetime → timestamptz; nên có trigger auto-update khi UPDATE row.
  "ordering" integer -- ← fs_year.ordering | Thứ tự sắp xếp hiển thị.
);

-- [BẢNG MỚI] Page theo template, giữ pointer Draft/Published hiện hành.
DROP TABLE IF EXISTS "cic_content_pages" CASCADE;
CREATE TABLE "cic_content_pages" (
  "id" bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← — (bảng mới) | Khoá chính tự tăng.
  "workspace" varchar(5) NOT NULL CHECK ("workspace" IN ('vi','en')), -- ← — (bảng mới) | Workspace của Page.
  "code" varchar(100) NOT NULL, -- ← — (bảng mới) | Mã định danh Page.
  "name" varchar(255) NOT NULL, -- ← — (bảng mới) | Tên Page.
  "slug" varchar(512) NOT NULL, -- ← — (bảng mới) | Đường dẫn Page.
  "page_type" varchar(50) NOT NULL, -- ← — (bảng mới) | Loại Page theo registry.
  "template_key" varchar(100) NOT NULL, -- ← — (bảng mới) | Template áp dụng.
  "system_defined" boolean NOT NULL DEFAULT false, -- ← — (bảng mới) | Page hệ thống, không cho xoá.
  "draft_revision_id" bigint NULL, -- ← — (bảng mới) | Con trỏ revision Draft hiện hành.
  "published_revision_id" bigint NULL, -- ← — (bảng mới) | Con trỏ revision Published hiện hành.
  "created_at" timestamptz NOT NULL DEFAULT now(), -- ← — (bảng mới) | Thời điểm tạo.
  "created_by" integer NULL REFERENCES cic_users(id) ON DELETE SET NULL, -- ← — (bảng mới) | Người tạo.
  "updated_at" timestamptz NOT NULL DEFAULT now(), -- ← — (bảng mới) | Thời điểm cập nhật.
  "updated_by" integer NULL REFERENCES cic_users(id) ON DELETE SET NULL, -- ← — (bảng mới) | Người cập nhật.
  CONSTRAINT "uq_cic_content_pages_workspace_code" UNIQUE ("workspace", "code"),
  CONSTRAINT "uq_cic_content_pages_workspace_slug" UNIQUE ("workspace", "slug")
);

-- [BẢNG MỚI] Revision của Page — lần sửa Draft tiếp theo không ghi đè nội dung đang Published.
DROP TABLE IF EXISTS "cic_content_page_revisions" CASCADE;
CREATE TABLE "cic_content_page_revisions" (
  "id" bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← — (bảng mới) | Khoá chính tự tăng.
  "page_id" bigint NOT NULL REFERENCES cic_content_pages(id) ON DELETE CASCADE, -- ← — (bảng mới) | Page sở hữu revision.
  "version_number" integer NOT NULL CHECK ("version_number" >= 1), -- ← — (bảng mới) | Số hiệu revision, UNIQUE (page_id, version_number).
  "state" varchar(20) NOT NULL CHECK ("state" IN ('draft','published')), -- ← — (bảng mới) | Trạng thái revision.
  "seo_title" varchar(255) NOT NULL DEFAULT '', -- ← — (bảng mới) | SEO title snapshot.
  "seo_description" text NOT NULL DEFAULT '', -- ← — (bảng mới) | SEO description snapshot.
  "created_at" timestamptz NOT NULL DEFAULT now(), -- ← — (bảng mới) | Thời điểm tạo revision.
  "created_by" integer NULL REFERENCES cic_users(id) ON DELETE SET NULL, -- ← — (bảng mới) | Người tạo.
  "published_at" timestamptz NULL, -- ← — (bảng mới) | Thời điểm publish.
  "published_by" integer NULL REFERENCES cic_users(id) ON DELETE SET NULL, -- ← — (bảng mới) | Người publish.
  CONSTRAINT "uq_cic_content_page_revisions_page_id_version_number" UNIQUE ("page_id", "version_number")
);

-- [BẢNG MỚI] Section trong một revision, config theo template registry trong code.
DROP TABLE IF EXISTS "cic_content_page_sections" CASCADE;
CREATE TABLE "cic_content_page_sections" (
  "id" bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← — (bảng mới) | Khoá chính tự tăng.
  "revision_id" bigint NOT NULL REFERENCES cic_content_page_revisions(id) ON DELETE CASCADE, -- ← — (bảng mới) | Revision sở hữu section.
  "section_key" varchar(150) NOT NULL, -- ← — (bảng mới) | Khoá section theo template.
  "section_type" varchar(100) NOT NULL, -- ← — (bảng mới) | Loại section/component.
  "position" integer NOT NULL CHECK ("position" > 0), -- ← — (bảng mới) | Thứ tự section.
  "config" jsonb NOT NULL DEFAULT '{}'::jsonb, -- ← — (bảng mới) | Cấu hình section (không GIN index nếu không query theo key).
  CONSTRAINT "uq_cic_content_page_sections_revision_id_section_key" UNIQUE ("revision_id", "section_key"),
  CONSTRAINT "uq_cic_content_page_sections_revision_id_position" UNIQUE ("revision_id", "position")
);

-- [BẢNG MỚI] Entity được chọn thủ công trong một section (product/news/service/project/partner/event), có thứ tự.
DROP TABLE IF EXISTS "cic_content_page_section_references" CASCADE;
CREATE TABLE "cic_content_page_section_references" (
  "id" bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← — (bảng mới) | Khoá chính tự tăng.
  "section_id" bigint NOT NULL REFERENCES cic_content_page_sections(id) ON DELETE CASCADE, -- ← — (bảng mới) | Section sở hữu reference.
  "entity_type" varchar(30) NOT NULL, -- ← — (bảng mới) | product / news / service / project / partner / event.
  "entity_id" bigint NOT NULL, -- ← — (bảng mới) | ID entity được chọn (polymorphic, không FK cứng).
  "position" integer NOT NULL CHECK ("position" > 0), -- ← — (bảng mới) | Thứ tự hiển thị.
  CONSTRAINT "uq_cic_content_page_section_references_section_id_entity_type_entity_id" UNIQUE ("section_id", "entity_type", "entity_id"),
  CONSTRAINT "uq_cic_content_page_section_references_section_id_entity_type_position" UNIQUE ("section_id", "entity_type", "position")
);

-- [BẢNG MỚI] Dự án (VI) — module mới, không có bảng legacy phù hợp để mở rộng.
DROP TABLE IF EXISTS "cic_projects" CASCADE;
CREATE TABLE "cic_projects" (
  "id" bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← — (bảng mới) | Khoá chính tự tăng.
  "title" varchar(255) NOT NULL, -- ← — (bảng mới) | Tên dự án.
  "alias" varchar(255) NOT NULL UNIQUE, -- ← — (bảng mới) | Alias dự án.
  "tagline" text NULL, -- ← — (bảng mới) | Câu giới thiệu ngắn.
  "summary" text NULL, -- ← — (bảng mới) | Tóm tắt dự án.
  "content" text NULL, -- ← — (bảng mới) | Nội dung chi tiết (Rich Text).
  "sector" varchar(150) NULL, -- ← — (bảng mới) | Lĩnh vực dự án.
  "solution" varchar(255) NULL, -- ← — (bảng mới) | Giải pháp áp dụng.
  "technologies" text[] NOT NULL DEFAULT '{}', -- ← — (bảng mới) | Công nghệ áp dụng, giữ thứ tự (danh sách tự do, không phải FK).
  "customer_name" varchar(255) NULL, -- ← — (bảng mới) | Tên khách hàng.
  "location" varchar(255) NULL, -- ← — (bảng mới) | Địa điểm triển khai.
  "start_year" smallint NULL, -- ← — (bảng mới) | Năm bắt đầu.
  "end_year" smallint NULL CHECK ("end_year" >= "start_year"), -- ← — (bảng mới) | Năm kết thúc.
  "is_ongoing" boolean NOT NULL DEFAULT false CHECK (NOT "is_ongoing" OR "end_year" IS NULL), -- ← — (bảng mới) | Dự án đang triển khai.
  "image" varchar(500) NULL, -- ← — (bảng mới) | Ảnh đại diện.
  "is_featured" boolean NOT NULL DEFAULT false, -- ← — (bảng mới) | Dự án nổi bật.
  "published" boolean NOT NULL DEFAULT false, -- ← — (bảng mới) | Trạng thái xuất bản.
  "ordering" integer NOT NULL DEFAULT 0 CHECK ("ordering" >= 0), -- ← — (bảng mới) | Thứ tự hiển thị.
  "seo_title" varchar(255) NULL, -- ← — (bảng mới) | SEO title.
  "seo_keyword" varchar(255) NULL, -- ← — (bảng mới) | SEO keywords.
  "seo_description" varchar(500) NULL, -- ← — (bảng mới) | SEO description.
  "created_by" integer NULL REFERENCES cic_users(id) ON DELETE SET NULL, -- ← — (bảng mới) | Người tạo.
  "updated_by" integer NULL REFERENCES cic_users(id) ON DELETE SET NULL, -- ← — (bảng mới) | Người cập nhật.
  "created_time" timestamptz NOT NULL DEFAULT now(), -- ← — (bảng mới) | Thời điểm tạo.
  "updated_time" timestamptz NOT NULL DEFAULT now() -- ← — (bảng mới) | Thời điểm cập nhật.
);

-- [BẢNG MỚI] Dự án (EN) — cùng cấu trúc cic_projects, dataset độc lập, không FK chéo VI/EN.
DROP TABLE IF EXISTS "cic_projects_en" CASCADE;
CREATE TABLE "cic_projects_en" (
  "id" bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← — (bảng mới) | Khoá chính tự tăng.
  "title" varchar(255) NOT NULL, -- ← — (bảng mới) | Tên dự án.
  "alias" varchar(255) NOT NULL UNIQUE, -- ← — (bảng mới) | Alias dự án.
  "tagline" text NULL, -- ← — (bảng mới) | Câu giới thiệu ngắn.
  "summary" text NULL, -- ← — (bảng mới) | Tóm tắt dự án.
  "content" text NULL, -- ← — (bảng mới) | Nội dung chi tiết (Rich Text).
  "sector" varchar(150) NULL, -- ← — (bảng mới) | Lĩnh vực dự án.
  "solution" varchar(255) NULL, -- ← — (bảng mới) | Giải pháp áp dụng.
  "technologies" text[] NOT NULL DEFAULT '{}', -- ← — (bảng mới) | Công nghệ áp dụng, giữ thứ tự (danh sách tự do, không phải FK).
  "customer_name" varchar(255) NULL, -- ← — (bảng mới) | Tên khách hàng.
  "location" varchar(255) NULL, -- ← — (bảng mới) | Địa điểm triển khai.
  "start_year" smallint NULL, -- ← — (bảng mới) | Năm bắt đầu.
  "end_year" smallint NULL CHECK ("end_year" >= "start_year"), -- ← — (bảng mới) | Năm kết thúc.
  "is_ongoing" boolean NOT NULL DEFAULT false CHECK (NOT "is_ongoing" OR "end_year" IS NULL), -- ← — (bảng mới) | Dự án đang triển khai.
  "image" varchar(500) NULL, -- ← — (bảng mới) | Ảnh đại diện.
  "is_featured" boolean NOT NULL DEFAULT false, -- ← — (bảng mới) | Dự án nổi bật.
  "published" boolean NOT NULL DEFAULT false, -- ← — (bảng mới) | Trạng thái xuất bản.
  "ordering" integer NOT NULL DEFAULT 0 CHECK ("ordering" >= 0), -- ← — (bảng mới) | Thứ tự hiển thị.
  "seo_title" varchar(255) NULL, -- ← — (bảng mới) | SEO title.
  "seo_keyword" varchar(255) NULL, -- ← — (bảng mới) | SEO keywords.
  "seo_description" varchar(500) NULL, -- ← — (bảng mới) | SEO description.
  "created_by" integer NULL REFERENCES cic_users(id) ON DELETE SET NULL, -- ← — (bảng mới) | Người tạo.
  "updated_by" integer NULL REFERENCES cic_users(id) ON DELETE SET NULL, -- ← — (bảng mới) | Người cập nhật.
  "created_time" timestamptz NOT NULL DEFAULT now(), -- ← — (bảng mới) | Thời điểm tạo.
  "updated_time" timestamptz NOT NULL DEFAULT now() -- ← — (bảng mới) | Thời điểm cập nhật.
);

-- [BẢNG MỚI] Quan hệ N–N Dự án (VI) ↔ Sản phẩm (VI), có thứ tự.
DROP TABLE IF EXISTS "cic_projects_products_rel" CASCADE;
CREATE TABLE "cic_projects_products_rel" (
  "project_id" bigint NOT NULL REFERENCES cic_projects(id) ON DELETE CASCADE, -- ← — (bảng mới) | Dự án VI.
  "product_id" integer NOT NULL REFERENCES cic_products(id) ON DELETE RESTRICT, -- ← — (bảng mới) | Sản phẩm VI liên quan.
  "ordering" integer NOT NULL DEFAULT 0 CHECK ("ordering" >= 0), -- ← — (bảng mới) | Thứ tự hiển thị.
  CONSTRAINT "pk_cic_projects_products_rel" PRIMARY KEY ("project_id", "product_id")
);

-- [BẢNG MỚI] Quan hệ N–N Dự án (EN) ↔ Sản phẩm (EN), tách độc lập theo workspace.
DROP TABLE IF EXISTS "cic_projects_products_rel_en" CASCADE;
CREATE TABLE "cic_projects_products_rel_en" (
  "project_id" bigint NOT NULL REFERENCES cic_projects_en(id) ON DELETE CASCADE, -- ← — (bảng mới) | Dự án EN.
  "product_id" integer NOT NULL REFERENCES cic_products_en(id) ON DELETE RESTRICT, -- ← — (bảng mới) | Sản phẩm EN liên quan.
  "ordering" integer NOT NULL DEFAULT 0 CHECK ("ordering" >= 0), -- ← — (bảng mới) | Thứ tự hiển thị.
  CONSTRAINT "pk_cic_projects_products_rel_en" PRIMARY KEY ("project_id", "product_id")
);

-- [BẢNG MỚI] Quan hệ N–N Dự án (VI) ↔ Dịch vụ (VI), có thứ tự.
DROP TABLE IF EXISTS "cic_projects_services_rel" CASCADE;
CREATE TABLE "cic_projects_services_rel" (
  "project_id" bigint NOT NULL REFERENCES cic_projects(id) ON DELETE CASCADE, -- ← — (bảng mới) | Dự án VI.
  "service_id" integer NOT NULL REFERENCES cic_services(id) ON DELETE RESTRICT, -- ← — (bảng mới) | Dịch vụ VI liên quan.
  "ordering" integer NOT NULL DEFAULT 0 CHECK ("ordering" >= 0), -- ← — (bảng mới) | Thứ tự hiển thị.
  CONSTRAINT "pk_cic_projects_services_rel" PRIMARY KEY ("project_id", "service_id")
);

-- [BẢNG MỚI] Quan hệ N–N Dự án (EN) ↔ Dịch vụ (EN), tách độc lập theo workspace.
DROP TABLE IF EXISTS "cic_projects_services_rel_en" CASCADE;
CREATE TABLE "cic_projects_services_rel_en" (
  "project_id" bigint NOT NULL REFERENCES cic_projects_en(id) ON DELETE CASCADE, -- ← — (bảng mới) | Dự án EN.
  "service_id" integer NOT NULL REFERENCES cic_services_en(id) ON DELETE RESTRICT, -- ← — (bảng mới) | Dịch vụ EN liên quan.
  "ordering" integer NOT NULL DEFAULT 0 CHECK ("ordering" >= 0), -- ← — (bảng mới) | Thứ tự hiển thị.
  CONSTRAINT "pk_cic_projects_services_rel_en" PRIMARY KEY ("project_id", "service_id")
);

-- [BẢNG MỚI] CTA (Call-To-Action) reusable — các module khác chỉ lưu CTA reference.
DROP TABLE IF EXISTS "cic_ctas" CASCADE;
CREATE TABLE "cic_ctas" (
  "id" bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← — (bảng mới) | Khoá chính tự tăng.
  "workspace" varchar(5) NOT NULL, -- ← — (bảng mới) | Workspace VI/EN.
  "code" varchar(100) NOT NULL, -- ← — (bảng mới) | Mã CTA.
  "is_system" boolean NOT NULL DEFAULT false, -- ← — (bảng mới) | CTA Hệ thống; nhóm Bổ sung dùng is_system=false. CTA Hệ thống không cho xoá hoặc đổi code.
  "admin_name" varchar(255) NOT NULL, -- ← — (bảng mới) | Tên hiển thị trong CMS.
  "display_text" varchar(100) NOT NULL, -- ← — (bảng mới) | Text hiển thị trên nút.
  "description" text NULL, -- ← — (bảng mới) | Mô tả CTA.
  "icon" varchar(100) NULL, -- ← — (bảng mới) | Icon (allowlist Lucide).
  "style_variant" varchar(30) NOT NULL DEFAULT 'primary', -- ← — (bảng mới) | Biến thể style theo design system.
  "action_type" varchar(40) NOT NULL, -- ← — (bảng mới) | open_form / download_file / send_email / redirect / scroll / call…
  "action_config" jsonb NOT NULL DEFAULT '{}'::jsonb, -- ← — (bảng mới) | Payload action (URL, target, anchor, phone, email…).
  "form_id" bigint NULL, -- ← — (bảng mới) | Bắt buộc khi action_type = open_form.
  "media_asset_id" bigint NULL REFERENCES cic_media_assets(id) ON DELETE RESTRICT, -- ← — (bảng mới) | Bắt buộc khi action_type = download_file.
  "email_template_id" bigint NULL, -- ← — (bảng mới) | Bắt buộc khi action_type = send_email.
  "status" varchar(20) NOT NULL DEFAULT 'draft', -- ← — (bảng mới) | active / inactive / draft / archived.
  "created_by" integer NULL REFERENCES cic_users(id) ON DELETE SET NULL, -- ← — (bảng mới) | Người tạo.
  "created_at" timestamptz NOT NULL DEFAULT now(), -- ← — (bảng mới) | Thời điểm tạo.
  "updated_at" timestamptz NOT NULL DEFAULT now(), -- ← — (bảng mới) | Thời điểm cập nhật.
  "deleted_at" timestamptz NULL, -- ← — (bảng mới) | Xoá mềm.
  CONSTRAINT "uq_cic_ctas_workspace_code" UNIQUE ("workspace", "code")
);

-- [BẢNG MỚI] Tham chiếu CTA/Biểu mẫu được chèn trong các vùng Rich Text hỗ trợ.
DROP TABLE IF EXISTS "cic_content_embeds" CASCADE;
CREATE TABLE "cic_content_embeds" (
  "id" bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← — (bảng mới) | Khoá chính tự tăng.
  "workspace" varchar(5) NOT NULL CHECK ("workspace" IN ('vi','en')), -- ← — (bảng mới) | Workspace của nội dung.
  "owner_type" varchar(30) NOT NULL CHECK ("owner_type" IN ('news','event','product','service','content_page')), -- ← — (bảng mới) | Loại nội dung sở hữu theo allowlist.
  "owner_id" bigint NOT NULL, -- ← — (bảng mới) | ID nội dung; service kiểm tra theo owner_type.
  "field_key" varchar(100) NOT NULL, -- ← — (bảng mới) | Vùng Rich Text chứa embed.
  "embed_type" varchar(20) NOT NULL CHECK ("embed_type" IN ('cta','form')), -- ← — (bảng mới) | Loại tham chiếu.
  "cta_id" bigint NULL REFERENCES cic_ctas(id) ON DELETE RESTRICT, -- ← — (bảng mới) | CTA được chèn.
  "form_id" bigint NULL, -- ← — (bảng mới) | Biểu mẫu được chèn.
  "position" integer NOT NULL CHECK ("position" > 0), -- ← — (bảng mới) | Thứ tự trong vùng nội dung.
  "display_config" jsonb NOT NULL DEFAULT '{}'::jsonb, -- ← — (bảng mới) | Cấu hình trình bày allowlist, không chứa payload CTA/Form.
  "created_at" timestamptz NOT NULL DEFAULT now(), -- ← — (bảng mới) | Thời điểm tạo.
  CONSTRAINT "ck_cic_content_embeds_target" CHECK (("embed_type" = 'cta' AND "cta_id" IS NOT NULL AND "form_id" IS NULL) OR ("embed_type" = 'form' AND "form_id" IS NOT NULL AND "cta_id" IS NULL)),
  CONSTRAINT "ck_cic_content_embeds_display_config_object" CHECK (jsonb_typeof("display_config") = 'object'),
  CONSTRAINT "uq_cic_content_embeds_owner_field_position" UNIQUE ("workspace", "owner_type", "owner_id", "field_key", "position")
);

-- [BẢNG MỚI] Định nghĩa Form — cấu hình gửi email, tạo customer request, version hiện hành.
DROP TABLE IF EXISTS "cic_forms" CASCADE;
CREATE TABLE "cic_forms" (
  "id" bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← — (bảng mới) | Khoá chính tự tăng.
  "workspace" varchar(5) NOT NULL, -- ← — (bảng mới) | Workspace VI/EN.
  "code" varchar(100) NOT NULL, -- ← — (bảng mới) | Mã Form.
  "is_system" boolean NOT NULL DEFAULT false, -- ← — (bảng mới) | Biểu mẫu Hệ thống; nhóm Bổ sung dùng is_system=false. Biểu mẫu Hệ thống không cho xoá hoặc đổi code.
  "admin_name" varchar(255) NOT NULL, -- ← — (bảng mới) | Tên hiển thị trong CMS.
  "title" varchar(255) NOT NULL, -- ← — (bảng mới) | Tiêu đề Form.
  "description" text NULL, -- ← — (bảng mới) | Mô tả Form.
  "status" varchar(20) NOT NULL DEFAULT 'draft', -- ← — (bảng mới) | active / inactive / draft / archived.
  "current_version" integer NOT NULL DEFAULT 1 CHECK ("current_version" >= 1), -- ← — (bảng mới) | Version hiện hành.
  "create_customer_request" boolean NOT NULL DEFAULT true, -- ← — (bảng mới) | Tự tạo customer request khi submit.
  "send_admin_email" boolean NOT NULL DEFAULT false, -- ← — (bảng mới) | Gửi email cho admin khi submit.
  "admin_emails" text[] NOT NULL DEFAULT '{}', -- ← — (bảng mới) | Danh sách email admin nhận.
  "admin_email_template_id" bigint NULL, -- ← — (bảng mới) | Template email cho admin.
  "send_confirmation_email" boolean NOT NULL DEFAULT false, -- ← — (bảng mới) | Gửi email xác nhận cho người gửi.
  "confirmation_email_template_id" bigint NULL, -- ← — (bảng mới) | Template email xác nhận.
  "submit_button_text" varchar(100) NOT NULL DEFAULT 'Gửi thông tin', -- ← — (bảng mới) | Text nút submit.
  "success_message" text NOT NULL, -- ← — (bảng mới) | Thông báo khi gửi thành công.
  "redirect_url" text NULL, -- ← — (bảng mới) | URL chuyển hướng sau khi gửi.
  "created_by" integer NULL REFERENCES cic_users(id) ON DELETE SET NULL, -- ← — (bảng mới) | Người tạo.
  "created_at" timestamptz NOT NULL DEFAULT now(), -- ← — (bảng mới) | Thời điểm tạo.
  "updated_at" timestamptz NOT NULL DEFAULT now(), -- ← — (bảng mới) | Thời điểm cập nhật.
  "deleted_at" timestamptz NULL, -- ← — (bảng mới) | Xoá mềm.
  CONSTRAINT "uq_cic_forms_workspace_code" UNIQUE ("workspace", "code")
);

-- [BẢNG MỚI] Field definition của Form (label, type, validation, options).
DROP TABLE IF EXISTS "cic_form_fields" CASCADE;
CREATE TABLE "cic_form_fields" (
  "id" bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← — (bảng mới) | Khoá chính tự tăng.
  "form_id" bigint NOT NULL REFERENCES cic_forms(id) ON DELETE CASCADE, -- ← — (bảng mới) | Form sở hữu field.
  "field_key" varchar(100) NOT NULL, -- ← — (bảng mới) | Khoá field.
  "field_type" varchar(30) NOT NULL, -- ← — (bảng mới) | Loại field theo allowlist.
  "role_type" varchar(30) NULL, -- ← — (bảng mới) | Vai trò field (VD: email liên hệ chính).
  "label" varchar(255) NOT NULL, -- ← — (bảng mới) | Nhãn hiển thị.
  "placeholder" varchar(255) NULL, -- ← — (bảng mới) | Placeholder.
  "help_text" text NULL, -- ← — (bảng mới) | Text hướng dẫn.
  "is_required" boolean NOT NULL DEFAULT false, -- ← — (bảng mới) | Bắt buộc nhập.
  "is_locked" boolean NOT NULL DEFAULT false, -- ← — (bảng mới) | Không cho xoá/sửa field hệ thống.
  "position" integer NOT NULL, -- ← — (bảng mới) | Thứ tự field.
  "validation_config" jsonb NOT NULL DEFAULT '{}'::jsonb, -- ← — (bảng mới) | Cấu hình validate (allowlist key).
  "options_config" jsonb NOT NULL DEFAULT '[]'::jsonb, -- ← — (bảng mới) | Options cho select/radio/checkbox.
  CONSTRAINT "uq_cic_form_fields_form_id_field_key" UNIQUE ("form_id", "field_key"),
  CONSTRAINT "uq_cic_form_fields_form_id_position" UNIQUE ("form_id", "position")
);

-- [BẢNG MỚI] Lượt gửi Form.
DROP TABLE IF EXISTS "cic_form_submissions" CASCADE;
CREATE TABLE "cic_form_submissions" (
  "id" bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← — (bảng mới) | Khoá chính tự tăng.
  "form_id" bigint NOT NULL REFERENCES cic_forms(id) ON DELETE RESTRICT, -- ← — (bảng mới) | Form được gửi.
  "form_version" integer NOT NULL CHECK ("form_version" >= 1), -- ← — (bảng mới) | Version Form tại thời điểm gửi.
  "source_type" varchar(50) NULL, -- ← — (bảng mới) | Nguồn gửi (trang, CTA…).
  "source_id" bigint NULL, -- ← — (bảng mới) | ID nguồn gửi.
  "source_path" text NULL, -- ← — (bảng mới) | Đường dẫn trang gửi.
  "cta_id" bigint NULL REFERENCES cic_ctas(id) ON DELETE SET NULL, -- ← — (bảng mới) | CTA đã mở biểu mẫu, nếu có.
  "placement_key" varchar(150) NULL, -- ← — (bảng mới) | Vị trí cố định hoặc vùng Rich Text phát sinh lượt gửi.
  "submitted_at" timestamptz NOT NULL DEFAULT now() -- ← — (bảng mới) | Thời điểm gửi.
);

-- [BẢNG MỚI] Giá trị từng field trong một submission, snapshot field_key theo version submit.
DROP TABLE IF EXISTS "cic_form_submission_values" CASCADE;
CREATE TABLE "cic_form_submission_values" (
  "id" bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← — (bảng mới) | Khoá chính tự tăng.
  "submission_id" bigint NOT NULL REFERENCES cic_form_submissions(id) ON DELETE CASCADE, -- ← — (bảng mới) | Submission sở hữu giá trị.
  "field_id" bigint NOT NULL REFERENCES cic_form_fields(id) ON DELETE RESTRICT, -- ← — (bảng mới) | Field tương ứng.
  "field_key" varchar(100) NOT NULL, -- ← — (bảng mới) | Snapshot key theo version submit.
  "value_text" text NULL, -- ← — (bảng mới) | Giá trị dạng text.
  "value_json" jsonb NULL, -- ← — (bảng mới) | Giá trị dạng cấu trúc (multi-select…).
  "media_asset_id" bigint NULL REFERENCES cic_media_assets(id) ON DELETE RESTRICT, -- ← — (bảng mới) | File upload (nếu field kiểu file).
  CONSTRAINT "uq_cic_form_submission_values_submission_id_field_id" UNIQUE ("submission_id", "field_id")
);

-- [BẢNG MỚI] Trạng thái vận hành hợp nhất cho request từ nhiều nguồn (contact/product_contact/order/form_submission).
DROP TABLE IF EXISTS "cic_customer_request_states" CASCADE;
CREATE TABLE "cic_customer_request_states" (
  "id" bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← — (bảng mới) | Khoá chính tự tăng.
  "workspace" varchar(5) NOT NULL, -- ← — (bảng mới) | Workspace VI/EN.
  "source_type" varchar(30) NOT NULL CHECK ("source_type" IN ('contact','product_contact','order','form_submission')), -- ← — (bảng mới) | Bảng nguồn.
  "source_id" bigint NOT NULL, -- ← — (bảng mới) | ID bản ghi nguồn (resolve theo allowlist, không FK đa hình).
  "status" varchar(30) NOT NULL DEFAULT 'new', -- ← — (bảng mới) | Trạng thái xử lý.
  "assigned_user_id" integer NULL REFERENCES cic_users(id) ON DELETE SET NULL, -- ← — (bảng mới) | Người được phân công.
  "priority" varchar(20) NOT NULL DEFAULT 'medium' CHECK ("priority" IN ('low','medium','high','urgent')), -- ← — (bảng mới) | Độ ưu tiên.
  "tags" text[] NOT NULL DEFAULT '{}', -- ← — (bảng mới) | Thẻ gắn request.
  "created_at" timestamptz NOT NULL DEFAULT now(), -- ← — (bảng mới) | Thời điểm tạo state.
  "updated_at" timestamptz NOT NULL DEFAULT now(), -- ← — (bảng mới) | Thời điểm cập nhật.
  CONSTRAINT "uq_cic_customer_request_states_workspace_source_type_source_id" UNIQUE ("workspace", "source_type", "source_id")
);

-- [BẢNG MỚI] Ghi chú nội bộ trên một customer request.
DROP TABLE IF EXISTS "cic_customer_request_notes" CASCADE;
CREATE TABLE "cic_customer_request_notes" (
  "id" bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← — (bảng mới) | Khoá chính tự tăng.
  "request_state_id" bigint NOT NULL REFERENCES cic_customer_request_states(id) ON DELETE RESTRICT, -- ← — (bảng mới) | Request được ghi chú.
  "content" text NOT NULL, -- ← — (bảng mới) | Nội dung ghi chú (không rỗng sau trim).
  "created_by" integer NULL REFERENCES cic_users(id) ON DELETE SET NULL, -- ← — (bảng mới) | Người ghi chú.
  "created_at" timestamptz NOT NULL DEFAULT now() -- ← — (bảng mới) | Thời điểm ghi chú.
);

-- [BẢNG MỚI] Nhật ký thay đổi (append-only) của customer request — nguồn render timeline.
DROP TABLE IF EXISTS "cic_customer_request_events" CASCADE;
CREATE TABLE "cic_customer_request_events" (
  "id" bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← — (bảng mới) | Khoá chính tự tăng.
  "request_state_id" bigint NOT NULL REFERENCES cic_customer_request_states(id) ON DELETE RESTRICT, -- ← — (bảng mới) | Request liên quan.
  "event_type" varchar(50) NOT NULL, -- ← — (bảng mới) | note / status / assignment / priority / tags changes.
  "old_value" jsonb NULL, -- ← — (bảng mới) | Giá trị trước thay đổi.
  "new_value" jsonb NULL, -- ← — (bảng mới) | Giá trị sau thay đổi.
  "actor_id" integer NULL REFERENCES cic_users(id) ON DELETE SET NULL, -- ← — (bảng mới) | Người thực hiện.
  "created_at" timestamptz NOT NULL DEFAULT now() -- ← — (bảng mới) | Thời điểm phát sinh.
);

-- [BẢNG MỚI] Template email theo event/audience, giữ pointer Draft/Active version.
DROP TABLE IF EXISTS "cic_email_templates" CASCADE;
CREATE TABLE "cic_email_templates" (
  "id" bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← — (bảng mới) | Khoá chính tự tăng.
  "workspace" varchar(5) NOT NULL, -- ← — (bảng mới) | Workspace VI/EN.
  "name" varchar(255) NOT NULL, -- ← — (bảng mới) | Tên template.
  "event_key" varchar(50) NOT NULL, -- ← — (bảng mới) | Event kích hoạt gửi (theo registry).
  "audience" varchar(20) NOT NULL CHECK ("audience" IN ('customer','internal')), -- ← — (bảng mới) | Đối tượng nhận.
  "status" varchar(20) NOT NULL DEFAULT 'draft', -- ← — (bảng mới) | draft / active / inactive / archived.
  "draft_version_id" bigint NULL, -- ← — (bảng mới) | Con trỏ version Draft.
  "active_version_id" bigint NULL, -- ← — (bảng mới) | Con trỏ version Active.
  "created_by" integer NULL REFERENCES cic_users(id) ON DELETE SET NULL, -- ← — (bảng mới) | Người tạo.
  "created_at" timestamptz NOT NULL DEFAULT now(), -- ← — (bảng mới) | Thời điểm tạo.
  "updated_by" integer NULL REFERENCES cic_users(id) ON DELETE SET NULL, -- ← — (bảng mới) | Người cập nhật.
  "updated_at" timestamptz NOT NULL DEFAULT now(), -- ← — (bảng mới) | Thời điểm cập nhật.
  "activated_by" integer NULL REFERENCES cic_users(id) ON DELETE SET NULL, -- ← — (bảng mới) | Người kích hoạt version Active.
  "activated_at" timestamptz NULL -- ← — (bảng mới) | Thời điểm kích hoạt.
);

-- [BẢNG MỚI] Version immutable của template (subject/content) — Save tạo version mới, Publish đổi active_version_id.
DROP TABLE IF EXISTS "cic_email_template_versions" CASCADE;
CREATE TABLE "cic_email_template_versions" (
  "id" bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ← — (bảng mới) | Khoá chính tự tăng.
  "template_id" bigint NOT NULL REFERENCES cic_email_templates(id) ON DELETE CASCADE, -- ← — (bảng mới) | Template sở hữu version.
  "version_number" integer NOT NULL CHECK ("version_number" >= 1), -- ← — (bảng mới) | Số hiệu version, UNIQUE (template_id, version_number).
  "subject" text NOT NULL, -- ← — (bảng mới) | Tiêu đề email (không rỗng sau trim).
  "content" text NOT NULL, -- ← — (bảng mới) | Nội dung email (không rỗng sau trim).
  "created_by" integer NULL REFERENCES cic_users(id) ON DELETE SET NULL, -- ← — (bảng mới) | Người tạo version.
  "created_at" timestamptz NOT NULL DEFAULT now(), -- ← — (bảng mới) | Thời điểm tạo.
  CONSTRAINT "uq_cic_email_template_versions_template_id_version_number" UNIQUE ("template_id", "version_number")
);

-- [BẢNG MỚI] Audit log quản trị dùng chung toàn hệ thống — actor, action, target, kết quả, request context, diff trước/sau.
DROP TABLE IF EXISTS "cic_activity_logs" CASCADE;
CREATE TABLE "cic_activity_logs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(), -- ← — (bảng mới) | Khoá chính UUID.
  "occurred_at" timestamptz NOT NULL DEFAULT now(), -- ← — (bảng mới) | Thời điểm phát sinh.
  "actor_id" integer NULL REFERENCES cic_users(id) ON DELETE SET NULL, -- ← — (bảng mới) | Người thực hiện (nếu có).
  "actor_label" varchar(255) NULL, -- ← — (bảng mới) | Snapshot/fallback cho system/legacy actor.
  "action_code" varchar(100) NOT NULL, -- ← — (bảng mới) | Mã hành động ổn định từ action registry.
  "category" varchar(50) NOT NULL, -- ← — (bảng mới) | Nhóm hành động.
  "severity" varchar(16) NOT NULL CHECK ("severity" IN ('low','medium','high','critical')), -- ← — (bảng mới) | Mức độ nghiêm trọng.
  "is_sensitive" boolean NOT NULL DEFAULT false, -- ← — (bảng mới) | Log có dữ liệu nhạy cảm cần redaction.
  "entity_type" varchar(100) NOT NULL, -- ← — (bảng mới) | Loại entity mục tiêu.
  "entity_id" varchar(100) NULL, -- ← — (bảng mới) | ID entity mục tiêu (hỗ trợ ID legacy/new khác kiểu).
  "entity_title" text NULL, -- ← — (bảng mới) | Snapshot tiêu đề để log vẫn đọc được sau khi target đổi/xoá.
  "module" varchar(100) NULL, -- ← — (bảng mới) | Module nguồn.
  "workspace" varchar(50) NOT NULL, -- ← — (bảng mới) | Workspace liên quan.
  "locale" varchar(10) NULL, -- ← — (bảng mới) | Locale liên quan.
  "result" varchar(16) NOT NULL CHECK ("result" IN ('success','failed','partial','denied')), -- ← — (bảng mới) | Kết quả hành động.
  "result_message" text NULL, -- ← — (bảng mới) | Thông điệp kết quả.
  "session_id" varchar(100) NULL, -- ← — (bảng mới) | Phiên làm việc.
  "correlation_id" varchar(100) NULL, -- ← — (bảng mới) | ID liên kết nhiều log cùng một request.
  "source_app" varchar(100) NULL, -- ← — (bảng mới) | Ứng dụng nguồn.
  "environment" varchar(20) NULL, -- ← — (bảng mới) | Môi trường (production/staging…).
  "ip_address" inet NULL, -- ← — (bảng mới) | Địa chỉ IP.
  "user_agent" text NULL, -- ← — (bảng mới) | User agent.
  "http_method" varchar(10) NULL, -- ← — (bảng mới) | HTTP method.
  "endpoint" text NULL, -- ← — (bảng mới) | Endpoint được gọi.
  "execution_time_ms" integer NULL CHECK ("execution_time_ms" >= 0), -- ← — (bảng mới) | Thời gian xử lý (ms).
  "before_data" jsonb NULL, -- ← — (bảng mới) | Dữ liệu trước thay đổi (đã redaction).
  "after_data" jsonb NULL, -- ← — (bảng mới) | Dữ liệu sau thay đổi (đã redaction).
  "redacted_fields" text[] NULL -- ← — (bảng mới) | Danh sách field đã bị che.
);

-- [BẢNG MỚI · ĐỀ XUẤT] Job xuất file audit log theo filter.
DROP TABLE IF EXISTS "cic_audit_export_jobs" CASCADE;
CREATE TABLE "cic_audit_export_jobs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(), -- ← — (bảng mới) | Khoá chính UUID.
  "requested_at" timestamptz NOT NULL DEFAULT now(), -- ← — (bảng mới) | Thời điểm yêu cầu.
  "requested_by" integer NULL REFERENCES cic_users(id) ON DELETE SET NULL, -- ← — (bảng mới) | Người yêu cầu.
  "workspace" varchar(50) NOT NULL, -- ← — (bảng mới) | Workspace.
  "filter_payload" jsonb NOT NULL, -- ← — (bảng mới) | Bộ lọc export.
  "status" varchar(16) NOT NULL, -- ← — (bảng mới) | Trạng thái job.
  "total_records" integer NULL, -- ← — (bảng mới) | Tổng số dòng export.
  "file_path" text NULL, -- ← — (bảng mới) | Đường dẫn file kết quả.
  "file_size_bytes" bigint NULL, -- ← — (bảng mới) | Kích thước file.
  "expires_at" timestamptz NULL, -- ← — (bảng mới) | Hạn tải file.
  "error_message" text NULL, -- ← — (bảng mới) | Lỗi (nếu có).
  "completed_at" timestamptz NULL -- ← — (bảng mới) | Thời điểm hoàn tất.
);

-- [BẢNG MỚI] Thùng rác dùng chung — snapshot, restore, conflict handling, retention, purge, legal hold cho nhiều module.
DROP TABLE IF EXISTS "cic_trash_items" CASCADE;
CREATE TABLE "cic_trash_items" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(), -- ← — (bảng mới) | Khoá chính UUID.
  "workspace" varchar(50) NOT NULL, -- ← — (bảng mới) | Workspace của bản ghi bị xoá.
  "entity_type" varchar(100) NOT NULL, -- ← — (bảng mới) | Loại entity theo registry được phép xoá.
  "entity_id" varchar(100) NOT NULL, -- ← — (bảng mới) | ID entity gốc.
  "module" varchar(100) NOT NULL, -- ← — (bảng mới) | Module nguồn.
  "title_snapshot" text NOT NULL, -- ← — (bảng mới) | Snapshot tiêu đề.
  "payload_snapshot" jsonb NOT NULL, -- ← — (bảng mới) | Snapshot dữ liệu (không tự khôi phục mọi FK/media/relation).
  "original_url" text NULL, -- ← — (bảng mới) | URL gốc (nếu có).
  "status" varchar(16) NOT NULL DEFAULT 'trashed' CHECK ("status" IN ('trashed','restored','purged')), -- ← — (bảng mới) | Trạng thái vòng đời.
  "deleted_by" integer NULL REFERENCES cic_users(id) ON DELETE SET NULL, -- ← — (bảng mới) | Người xoá.
  "deleted_at" timestamptz NOT NULL DEFAULT now(), -- ← — (bảng mới) | Thời điểm xoá.
  "purge_after" timestamptz NULL, -- ← — (bảng mới) | Hạn tự động purge.
  "restore_state" varchar(20) NULL, -- ← — (bảng mới) | Trạng thái khi restore (conflict mode…).
  "restored_by" integer NULL REFERENCES cic_users(id) ON DELETE SET NULL, -- ← — (bảng mới) | Người khôi phục.
  "restored_at" timestamptz NULL, -- ← — (bảng mới) | Thời điểm khôi phục.
  "purged_by" integer NULL REFERENCES cic_users(id) ON DELETE SET NULL, -- ← — (bảng mới) | Người purge vĩnh viễn.
  "purged_at" timestamptz NULL, -- ← — (bảng mới) | Thời điểm purge.
  "purge_reason" text NULL, -- ← — (bảng mới) | Lý do purge.
  "is_legal_hold" boolean NOT NULL DEFAULT false, -- ← — (bảng mới) | Đang bị giữ lại vì lý do pháp lý (chặn purge).
  "legal_hold_reason" text NULL -- ← — (bảng mới) | Lý do legal hold.
);

-- ============================================================
-- FK hoãn lại (bảng đích được tạo SAU trong file này) — gắn sau
-- khi toàn bộ 144 bảng đã CREATE TABLE xong
-- ============================================================
ALTER TABLE "cic_users_permission" ADD CONSTRAINT "fk_cic_users_permission_task_id" FOREIGN KEY ("task_id") REFERENCES "cic_permission_tasks"(id);
ALTER TABLE "cic_users_permission_field" ADD CONSTRAINT "fk_cic_users_permission_field_task_id" FOREIGN KEY ("task_id") REFERENCES "cic_permission_tasks"(id);
ALTER TABLE "cic_users_permission_fun" ADD CONSTRAINT "fk_cic_users_permission_fun_task_id" FOREIGN KEY ("task_id") REFERENCES "cic_permission_tasks"(id);
ALTER TABLE "cic_contents" ADD CONSTRAINT "fk_cic_contents_category_id" FOREIGN KEY ("category_id") REFERENCES "cic_contents_categories"(id);
ALTER TABLE "cic_contents_en" ADD CONSTRAINT "fk_cic_contents_en_category_id" FOREIGN KEY ("category_id") REFERENCES "cic_contents_categories_en"(id);
ALTER TABLE "cic_news" ADD CONSTRAINT "fk_cic_news_category_id" FOREIGN KEY ("category_id") REFERENCES "cic_news_categories"(id);
ALTER TABLE "cic_news_en" ADD CONSTRAINT "fk_cic_news_en_category_id" FOREIGN KEY ("category_id") REFERENCES "cic_news_categories_en"(id);
ALTER TABLE "cic_products" ADD CONSTRAINT "fk_cic_products_types_id" FOREIGN KEY ("types_id") REFERENCES "cic_products_types"(id);
ALTER TABLE "cic_products_en" ADD CONSTRAINT "fk_cic_products_en_types_id" FOREIGN KEY ("types_id") REFERENCES "cic_products_types_en"(id);
ALTER TABLE "cic_banners" ADD CONSTRAINT "fk_cic_banners_category_id" FOREIGN KEY ("category_id") REFERENCES "cic_banners_categories"(id);
ALTER TABLE "cic_banners_en" ADD CONSTRAINT "fk_cic_banners_en_category_id" FOREIGN KEY ("category_id") REFERENCES "cic_banners_categories_en"(id);
ALTER TABLE "cic_slideshow" ADD CONSTRAINT "fk_cic_slideshow_category_id" FOREIGN KEY ("category_id") REFERENCES "cic_slideshow_categories"(id);
ALTER TABLE "cic_slideshow_en" ADD CONSTRAINT "fk_cic_slideshow_en_category_id" FOREIGN KEY ("category_id") REFERENCES "cic_slideshow_categories_en"(id);
ALTER TABLE "cic_content_pages" ADD CONSTRAINT "fk_cic_content_pages_draft_revision_id" FOREIGN KEY ("draft_revision_id") REFERENCES "cic_content_page_revisions"(id);
ALTER TABLE "cic_content_pages" ADD CONSTRAINT "fk_cic_content_pages_published_revision_id" FOREIGN KEY ("published_revision_id") REFERENCES "cic_content_page_revisions"(id);
ALTER TABLE "cic_ctas" ADD CONSTRAINT "fk_cic_ctas_form_id" FOREIGN KEY ("form_id") REFERENCES "cic_forms"(id) ON DELETE RESTRICT;
ALTER TABLE "cic_ctas" ADD CONSTRAINT "fk_cic_ctas_email_template_id" FOREIGN KEY ("email_template_id") REFERENCES "cic_email_templates"(id) ON DELETE RESTRICT;
ALTER TABLE "cic_content_embeds" ADD CONSTRAINT "fk_cic_content_embeds_form_id" FOREIGN KEY ("form_id") REFERENCES "cic_forms"(id) ON DELETE RESTRICT;
ALTER TABLE "cic_forms" ADD CONSTRAINT "fk_cic_forms_admin_email_template_id" FOREIGN KEY ("admin_email_template_id") REFERENCES "cic_email_templates"(id) ON DELETE RESTRICT;
ALTER TABLE "cic_forms" ADD CONSTRAINT "fk_cic_forms_confirmation_email_template_id" FOREIGN KEY ("confirmation_email_template_id") REFERENCES "cic_email_templates"(id) ON DELETE RESTRICT;
ALTER TABLE "cic_email_templates" ADD CONSTRAINT "fk_cic_email_templates_draft_version_id" FOREIGN KEY ("draft_version_id") REFERENCES "cic_email_template_versions"(id);
ALTER TABLE "cic_email_templates" ADD CONSTRAINT "fk_cic_email_templates_active_version_id" FOREIGN KEY ("active_version_id") REFERENCES "cic_email_template_versions"(id);


-- ============================================================
-- INDEX bo sung cho cac cot khoa ngoai (FK-candidate) va alias
-- (schema goc chi co PK, khong co index nao khac)
-- ============================================================
CREATE INDEX IF NOT EXISTS "idx_cic_address_alias" ON "cic_address" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_address_en_alias" ON "cic_address_en" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_areas_alias" ON "cic_areas" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_areas_parent_id" ON "cic_areas" ("parent_id");
CREATE INDEX IF NOT EXISTS "idx_cic_cities_area_id" ON "cic_cities" ("area_id");
CREATE INDEX IF NOT EXISTS "idx_cic_cities_alias" ON "cic_cities" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_cities_en_area_id" ON "cic_cities_en" ("area_id");
CREATE INDEX IF NOT EXISTS "idx_cic_cities_en_alias" ON "cic_cities_en" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_regions_alias" ON "cic_regions" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_regions_en_alias" ON "cic_regions_en" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_wards_alias" ON "cic_wards" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_users_permission_user_id" ON "cic_users_permission" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_cic_users_permission_task_id" ON "cic_users_permission" ("task_id");
CREATE INDEX IF NOT EXISTS "idx_cic_users_permission_field_user_id" ON "cic_users_permission_field" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_cic_users_permission_field_task_id" ON "cic_users_permission_field" ("task_id");
CREATE INDEX IF NOT EXISTS "idx_cic_users_permission_fun_user_id" ON "cic_users_permission_fun" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_cic_users_permission_fun_task_id" ON "cic_users_permission_fun" ("task_id");
CREATE INDEX IF NOT EXISTS "idx_cic_members_city_id" ON "cic_members" ("city_id");
CREATE INDEX IF NOT EXISTS "idx_cic_user_status_history_user_id" ON "cic_user_status_history" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_cic_user_status_history_changed_by" ON "cic_user_status_history" ("changed_by");
CREATE INDEX IF NOT EXISTS "idx_cic_security_events_user_id" ON "cic_security_events" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_cic_roles_created_by" ON "cic_roles" ("created_by");
CREATE INDEX IF NOT EXISTS "idx_cic_roles_updated_by" ON "cic_roles" ("updated_by");
CREATE INDEX IF NOT EXISTS "idx_cic_role_permissions_role_id" ON "cic_role_permissions" ("role_id");
CREATE INDEX IF NOT EXISTS "idx_cic_role_permissions_permission_task_id" ON "cic_role_permissions" ("permission_task_id");
CREATE INDEX IF NOT EXISTS "idx_cic_role_permissions_updated_by" ON "cic_role_permissions" ("updated_by");
CREATE INDEX IF NOT EXISTS "idx_cic_user_roles_user_id" ON "cic_user_roles" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_cic_user_roles_role_id" ON "cic_user_roles" ("role_id");
CREATE INDEX IF NOT EXISTS "idx_cic_user_roles_assigned_by" ON "cic_user_roles" ("assigned_by");
CREATE INDEX IF NOT EXISTS "idx_cic_menus_admin_parent_id" ON "cic_menus_admin" ("parent_id");
CREATE INDEX IF NOT EXISTS "idx_cic_menus_items_group_id" ON "cic_menus_items" ("group_id");
CREATE INDEX IF NOT EXISTS "idx_cic_menus_items_parent_id" ON "cic_menus_items" ("parent_id");
CREATE INDEX IF NOT EXISTS "idx_cic_menus_items_alias" ON "cic_menus_items" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_menus_items_en_group_id" ON "cic_menus_items_en" ("group_id");
CREATE INDEX IF NOT EXISTS "idx_cic_menus_items_en_parent_id" ON "cic_menus_items_en" ("parent_id");
CREATE INDEX IF NOT EXISTS "idx_cic_menus_items_en_alias" ON "cic_menus_items_en" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_branches_created_by" ON "cic_branches" ("created_by");
CREATE INDEX IF NOT EXISTS "idx_cic_branches_updated_by" ON "cic_branches" ("updated_by");
CREATE INDEX IF NOT EXISTS "idx_cic_blocks_module_id" ON "cic_blocks" ("module_id");
CREATE INDEX IF NOT EXISTS "idx_cic_blocks_entity_id" ON "cic_blocks" ("entity_id");
CREATE INDEX IF NOT EXISTS "idx_cic_blocks_translations_entity_id" ON "cic_blocks_translations" ("entity_id");
CREATE INDEX IF NOT EXISTS "idx_cic_extends_groups_alias" ON "cic_extends_groups" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_extends_items_alias" ON "cic_extends_items" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_extends_items_group_id" ON "cic_extends_items" ("group_id");
CREATE INDEX IF NOT EXISTS "idx_cic_translate_content_alias" ON "cic_translate_content" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_contents_category_id" ON "cic_contents" ("category_id");
CREATE INDEX IF NOT EXISTS "idx_cic_contents_alias" ON "cic_contents" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_contents_en_category_id" ON "cic_contents_en" ("category_id");
CREATE INDEX IF NOT EXISTS "idx_cic_contents_en_alias" ON "cic_contents_en" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_contents_categories_parent_id" ON "cic_contents_categories" ("parent_id");
CREATE INDEX IF NOT EXISTS "idx_cic_contents_categories_alias" ON "cic_contents_categories" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_contents_categories_en_parent_id" ON "cic_contents_categories_en" ("parent_id");
CREATE INDEX IF NOT EXISTS "idx_cic_contents_categories_en_alias" ON "cic_contents_categories_en" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_news_category_id" ON "cic_news" ("category_id");
CREATE INDEX IF NOT EXISTS "idx_cic_news_author_id" ON "cic_news" ("author_id");
CREATE INDEX IF NOT EXISTS "idx_cic_news_author_last_id" ON "cic_news" ("author_last_id");
CREATE INDEX IF NOT EXISTS "idx_cic_news_alias" ON "cic_news" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_news_en_category_id" ON "cic_news_en" ("category_id");
CREATE INDEX IF NOT EXISTS "idx_cic_news_en_author_id" ON "cic_news_en" ("author_id");
CREATE INDEX IF NOT EXISTS "idx_cic_news_en_author_last_id" ON "cic_news_en" ("author_last_id");
CREATE INDEX IF NOT EXISTS "idx_cic_news_en_alias" ON "cic_news_en" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_news_categories_parent_id" ON "cic_news_categories" ("parent_id");
CREATE INDEX IF NOT EXISTS "idx_cic_news_categories_alias" ON "cic_news_categories" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_news_categories_en_parent_id" ON "cic_news_categories_en" ("parent_id");
CREATE INDEX IF NOT EXISTS "idx_cic_news_categories_en_alias" ON "cic_news_categories_en" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_keywords_alias" ON "cic_keywords" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_event_author_id" ON "cic_event" ("author_id");
CREATE INDEX IF NOT EXISTS "idx_cic_event_author_last_id" ON "cic_event" ("author_last_id");
CREATE INDEX IF NOT EXISTS "idx_cic_event_alias" ON "cic_event" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_event_en_author_id" ON "cic_event_en" ("author_id");
CREATE INDEX IF NOT EXISTS "idx_cic_event_en_author_last_id" ON "cic_event_en" ("author_last_id");
CREATE INDEX IF NOT EXISTS "idx_cic_event_en_alias" ON "cic_event_en" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_products_user_id" ON "cic_products" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_cic_products_city_id" ON "cic_products" ("city_id");
CREATE INDEX IF NOT EXISTS "idx_cic_products_types_id" ON "cic_products" ("types_id");
CREATE INDEX IF NOT EXISTS "idx_cic_products_alias" ON "cic_products" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_products_en_user_id" ON "cic_products_en" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_cic_products_en_city_id" ON "cic_products_en" ("city_id");
CREATE INDEX IF NOT EXISTS "idx_cic_products_en_types_id" ON "cic_products_en" ("types_id");
CREATE INDEX IF NOT EXISTS "idx_cic_products_en_alias" ON "cic_products_en" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_products_categories_parent_id" ON "cic_products_categories" ("parent_id");
CREATE INDEX IF NOT EXISTS "idx_cic_products_categories_root_id" ON "cic_products_categories" ("root_id");
CREATE INDEX IF NOT EXISTS "idx_cic_products_categories_alias" ON "cic_products_categories" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_products_categories_en_parent_id" ON "cic_products_categories_en" ("parent_id");
CREATE INDEX IF NOT EXISTS "idx_cic_products_categories_en_root_id" ON "cic_products_categories_en" ("root_id");
CREATE INDEX IF NOT EXISTS "idx_cic_products_categories_en_alias" ON "cic_products_categories_en" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_products_categories_rel_product_id" ON "cic_products_categories_rel" ("product_id");
CREATE INDEX IF NOT EXISTS "idx_cic_products_categories_rel_category_id" ON "cic_products_categories_rel" ("category_id");
CREATE INDEX IF NOT EXISTS "idx_cic_products_categories_rel_en_product_id" ON "cic_products_categories_rel_en" ("product_id");
CREATE INDEX IF NOT EXISTS "idx_cic_products_categories_rel_en_category_id" ON "cic_products_categories_rel_en" ("category_id");
CREATE INDEX IF NOT EXISTS "idx_cic_products_filters_alias" ON "cic_products_filters" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_products_filters_values_alias" ON "cic_products_filters_values" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_products_images_record_id" ON "cic_products_images" ("record_id");
CREATE INDEX IF NOT EXISTS "idx_cic_products_images_en_record_id" ON "cic_products_images_en" ("record_id");
CREATE INDEX IF NOT EXISTS "idx_cic_products_incentives_product_id" ON "cic_products_incentives" ("product_id");
CREATE INDEX IF NOT EXISTS "idx_cic_products_price_record_id" ON "cic_products_price" ("record_id");
CREATE INDEX IF NOT EXISTS "idx_cic_products_sizes_alias" ON "cic_products_sizes" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_products_tables_group_id" ON "cic_products_tables" ("group_id");
CREATE INDEX IF NOT EXISTS "idx_cic_products_tables_en_group_id" ON "cic_products_tables_en" ("group_id");
CREATE INDEX IF NOT EXISTS "idx_cic_products_types_alias" ON "cic_products_types" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_products_types_en_alias" ON "cic_products_types_en" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_product_contact_products_id" ON "cic_product_contact" ("products_id");
CREATE INDEX IF NOT EXISTS "idx_cic_manufactories_alias" ON "cic_manufactories" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_manufactories_en_alias" ON "cic_manufactories_en" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_order_items_order_id" ON "cic_order_items" ("order_id");
CREATE INDEX IF NOT EXISTS "idx_cic_order_items_product_id" ON "cic_order_items" ("product_id");
CREATE INDEX IF NOT EXISTS "idx_cic_banners_category_id" ON "cic_banners" ("category_id");
CREATE INDEX IF NOT EXISTS "idx_cic_banners_alias" ON "cic_banners" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_banners_en_category_id" ON "cic_banners_en" ("category_id");
CREATE INDEX IF NOT EXISTS "idx_cic_banners_en_alias" ON "cic_banners_en" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_slideshow_category_id" ON "cic_slideshow" ("category_id");
CREATE INDEX IF NOT EXISTS "idx_cic_slideshow_en_category_id" ON "cic_slideshow_en" ("category_id");
CREATE INDEX IF NOT EXISTS "idx_cic_slideshow_categories_alias" ON "cic_slideshow_categories" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_slideshow_categories_en_alias" ON "cic_slideshow_categories_en" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_email_alias" ON "cic_email" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_email_en_alias" ON "cic_email_en" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_types_email_alias" ON "cic_types_email" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_types_email_en_alias" ON "cic_types_email_en" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_onlinesupport_alias" ON "cic_onlinesupport" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_business_alias" ON "cic_business" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_business_en_alias" ON "cic_business_en" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_services_en_alias" ON "cic_services_en" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_services_alias" ON "cic_services" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_services_products_rel_service_id" ON "cic_services_products_rel" ("service_id");
CREATE INDEX IF NOT EXISTS "idx_cic_services_products_rel_product_id" ON "cic_services_products_rel" ("product_id");
CREATE INDEX IF NOT EXISTS "idx_cic_services_products_rel_en_service_id" ON "cic_services_products_rel_en" ("service_id");
CREATE INDEX IF NOT EXISTS "idx_cic_services_products_rel_en_product_id" ON "cic_services_products_rel_en" ("product_id");
CREATE INDEX IF NOT EXISTS "idx_cic_image_user_id" ON "cic_image" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_cic_image_city_id" ON "cic_image" ("city_id");
CREATE INDEX IF NOT EXISTS "idx_cic_image_alias" ON "cic_image" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_image_en_user_id" ON "cic_image_en" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_cic_image_en_city_id" ON "cic_image_en" ("city_id");
CREATE INDEX IF NOT EXISTS "idx_cic_image_en_alias" ON "cic_image_en" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_image_images_user_id" ON "cic_image_images" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_cic_image_images_city_id" ON "cic_image_images" ("city_id");
CREATE INDEX IF NOT EXISTS "idx_cic_image_images_record_id" ON "cic_image_images" ("record_id");
CREATE INDEX IF NOT EXISTS "idx_cic_image_images_alias" ON "cic_image_images" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_image_images_en_user_id" ON "cic_image_images_en" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_cic_image_images_en_city_id" ON "cic_image_images_en" ("city_id");
CREATE INDEX IF NOT EXISTS "idx_cic_image_images_en_record_id" ON "cic_image_images_en" ("record_id");
CREATE INDEX IF NOT EXISTS "idx_cic_image_images_en_alias" ON "cic_image_images_en" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_video_alias" ON "cic_video" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_video_author_id" ON "cic_video" ("author_id");
CREATE INDEX IF NOT EXISTS "idx_cic_video_author_last_id" ON "cic_video" ("author_last_id");
CREATE INDEX IF NOT EXISTS "idx_cic_media_assets_created_by" ON "cic_media_assets" ("created_by");
CREATE INDEX IF NOT EXISTS "idx_cic_media_asset_translations_asset_id" ON "cic_media_asset_translations" ("asset_id");
CREATE INDEX IF NOT EXISTS "idx_cic_media_asset_translations_updated_by" ON "cic_media_asset_translations" ("updated_by");
CREATE INDEX IF NOT EXISTS "idx_cic_media_folders_alias" ON "cic_media_folders" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_media_folder_assets_folder_id" ON "cic_media_folder_assets" ("folder_id");
CREATE INDEX IF NOT EXISTS "idx_cic_media_folder_assets_asset_id" ON "cic_media_folder_assets" ("asset_id");
CREATE INDEX IF NOT EXISTS "idx_cic_media_albums_alias" ON "cic_media_albums" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_media_albums_cover_asset_id" ON "cic_media_albums" ("cover_asset_id");
CREATE INDEX IF NOT EXISTS "idx_cic_media_albums_created_by" ON "cic_media_albums" ("created_by");
CREATE INDEX IF NOT EXISTS "idx_cic_media_album_assets_album_id" ON "cic_media_album_assets" ("album_id");
CREATE INDEX IF NOT EXISTS "idx_cic_media_album_assets_asset_id" ON "cic_media_album_assets" ("asset_id");
CREATE INDEX IF NOT EXISTS "idx_cic_media_versions_asset_id" ON "cic_media_versions" ("asset_id");
CREATE INDEX IF NOT EXISTS "idx_cic_media_versions_created_by" ON "cic_media_versions" ("created_by");
CREATE INDEX IF NOT EXISTS "idx_cic_media_variants_asset_id" ON "cic_media_variants" ("asset_id");
CREATE INDEX IF NOT EXISTS "idx_cic_application_alias" ON "cic_application" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_application_en_alias" ON "cic_application_en" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_year_alias" ON "cic_year" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_content_pages_draft_revision_id" ON "cic_content_pages" ("draft_revision_id");
CREATE INDEX IF NOT EXISTS "idx_cic_content_pages_published_revision_id" ON "cic_content_pages" ("published_revision_id");
CREATE INDEX IF NOT EXISTS "idx_cic_content_pages_created_by" ON "cic_content_pages" ("created_by");
CREATE INDEX IF NOT EXISTS "idx_cic_content_pages_updated_by" ON "cic_content_pages" ("updated_by");
CREATE INDEX IF NOT EXISTS "idx_cic_content_page_revisions_page_id" ON "cic_content_page_revisions" ("page_id");
CREATE INDEX IF NOT EXISTS "idx_cic_content_page_revisions_created_by" ON "cic_content_page_revisions" ("created_by");
CREATE INDEX IF NOT EXISTS "idx_cic_content_page_revisions_published_by" ON "cic_content_page_revisions" ("published_by");
CREATE INDEX IF NOT EXISTS "idx_cic_content_page_sections_revision_id" ON "cic_content_page_sections" ("revision_id");
CREATE INDEX IF NOT EXISTS "idx_cic_content_page_section_references_section_id" ON "cic_content_page_section_references" ("section_id");
CREATE INDEX IF NOT EXISTS "idx_cic_content_page_section_references_entity_id" ON "cic_content_page_section_references" ("entity_id");
CREATE INDEX IF NOT EXISTS "idx_cic_projects_alias" ON "cic_projects" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_projects_sector" ON "cic_projects" ("sector");
CREATE INDEX IF NOT EXISTS "idx_cic_projects_solution" ON "cic_projects" ("solution");
CREATE INDEX IF NOT EXISTS "idx_cic_projects_customer_name" ON "cic_projects" ("customer_name");
CREATE INDEX IF NOT EXISTS "idx_cic_projects_created_by" ON "cic_projects" ("created_by");
CREATE INDEX IF NOT EXISTS "idx_cic_projects_updated_by" ON "cic_projects" ("updated_by");
CREATE INDEX IF NOT EXISTS "idx_cic_projects_updated_time" ON "cic_projects" ("updated_time");
CREATE INDEX IF NOT EXISTS "idx_cic_projects_en_alias" ON "cic_projects_en" ("alias");
CREATE INDEX IF NOT EXISTS "idx_cic_projects_en_sector" ON "cic_projects_en" ("sector");
CREATE INDEX IF NOT EXISTS "idx_cic_projects_en_solution" ON "cic_projects_en" ("solution");
CREATE INDEX IF NOT EXISTS "idx_cic_projects_en_customer_name" ON "cic_projects_en" ("customer_name");
CREATE INDEX IF NOT EXISTS "idx_cic_projects_en_created_by" ON "cic_projects_en" ("created_by");
CREATE INDEX IF NOT EXISTS "idx_cic_projects_en_updated_by" ON "cic_projects_en" ("updated_by");
CREATE INDEX IF NOT EXISTS "idx_cic_projects_en_updated_time" ON "cic_projects_en" ("updated_time");
CREATE INDEX IF NOT EXISTS "idx_cic_projects_products_rel_project_id" ON "cic_projects_products_rel" ("project_id");
CREATE INDEX IF NOT EXISTS "idx_cic_projects_products_rel_product_id" ON "cic_projects_products_rel" ("product_id");
CREATE INDEX IF NOT EXISTS "idx_cic_projects_products_rel_en_project_id" ON "cic_projects_products_rel_en" ("project_id");
CREATE INDEX IF NOT EXISTS "idx_cic_projects_products_rel_en_product_id" ON "cic_projects_products_rel_en" ("product_id");
CREATE INDEX IF NOT EXISTS "idx_cic_projects_services_rel_project_id" ON "cic_projects_services_rel" ("project_id");
CREATE INDEX IF NOT EXISTS "idx_cic_projects_services_rel_service_id" ON "cic_projects_services_rel" ("service_id");
CREATE INDEX IF NOT EXISTS "idx_cic_projects_services_rel_en_project_id" ON "cic_projects_services_rel_en" ("project_id");
CREATE INDEX IF NOT EXISTS "idx_cic_projects_services_rel_en_service_id" ON "cic_projects_services_rel_en" ("service_id");
CREATE INDEX IF NOT EXISTS "idx_cic_ctas_form_id" ON "cic_ctas" ("form_id");
CREATE INDEX IF NOT EXISTS "idx_cic_ctas_media_asset_id" ON "cic_ctas" ("media_asset_id");
CREATE INDEX IF NOT EXISTS "idx_cic_ctas_email_template_id" ON "cic_ctas" ("email_template_id");
CREATE INDEX IF NOT EXISTS "idx_cic_ctas_created_by" ON "cic_ctas" ("created_by");
CREATE INDEX IF NOT EXISTS "idx_cic_content_embeds_cta_id" ON "cic_content_embeds" ("cta_id");
CREATE INDEX IF NOT EXISTS "idx_cic_content_embeds_form_id" ON "cic_content_embeds" ("form_id");
CREATE INDEX IF NOT EXISTS "idx_cic_forms_admin_email_template_id" ON "cic_forms" ("admin_email_template_id");
CREATE INDEX IF NOT EXISTS "idx_cic_forms_confirmation_email_template_id" ON "cic_forms" ("confirmation_email_template_id");
CREATE INDEX IF NOT EXISTS "idx_cic_forms_created_by" ON "cic_forms" ("created_by");
CREATE INDEX IF NOT EXISTS "idx_cic_form_fields_form_id" ON "cic_form_fields" ("form_id");
CREATE INDEX IF NOT EXISTS "idx_cic_form_submissions_form_id" ON "cic_form_submissions" ("form_id");
CREATE INDEX IF NOT EXISTS "idx_cic_form_submissions_cta_id" ON "cic_form_submissions" ("cta_id");
CREATE INDEX IF NOT EXISTS "idx_cic_form_submission_values_submission_id" ON "cic_form_submission_values" ("submission_id");
CREATE INDEX IF NOT EXISTS "idx_cic_form_submission_values_field_id" ON "cic_form_submission_values" ("field_id");
CREATE INDEX IF NOT EXISTS "idx_cic_form_submission_values_media_asset_id" ON "cic_form_submission_values" ("media_asset_id");
CREATE INDEX IF NOT EXISTS "idx_cic_customer_request_states_assigned_user_id" ON "cic_customer_request_states" ("assigned_user_id");
CREATE INDEX IF NOT EXISTS "idx_cic_customer_request_notes_request_state_id" ON "cic_customer_request_notes" ("request_state_id");
CREATE INDEX IF NOT EXISTS "idx_cic_customer_request_notes_created_by" ON "cic_customer_request_notes" ("created_by");
CREATE INDEX IF NOT EXISTS "idx_cic_customer_request_events_request_state_id" ON "cic_customer_request_events" ("request_state_id");
CREATE INDEX IF NOT EXISTS "idx_cic_customer_request_events_actor_id" ON "cic_customer_request_events" ("actor_id");
CREATE INDEX IF NOT EXISTS "idx_cic_email_templates_draft_version_id" ON "cic_email_templates" ("draft_version_id");
CREATE INDEX IF NOT EXISTS "idx_cic_email_templates_active_version_id" ON "cic_email_templates" ("active_version_id");
CREATE INDEX IF NOT EXISTS "idx_cic_email_templates_created_by" ON "cic_email_templates" ("created_by");
CREATE INDEX IF NOT EXISTS "idx_cic_email_templates_updated_by" ON "cic_email_templates" ("updated_by");
CREATE INDEX IF NOT EXISTS "idx_cic_email_templates_activated_by" ON "cic_email_templates" ("activated_by");
CREATE INDEX IF NOT EXISTS "idx_cic_email_template_versions_template_id" ON "cic_email_template_versions" ("template_id");
CREATE INDEX IF NOT EXISTS "idx_cic_email_template_versions_created_by" ON "cic_email_template_versions" ("created_by");
CREATE INDEX IF NOT EXISTS "idx_cic_activity_logs_actor_id" ON "cic_activity_logs" ("actor_id");
CREATE INDEX IF NOT EXISTS "idx_cic_activity_logs_entity_id" ON "cic_activity_logs" ("entity_id");
CREATE INDEX IF NOT EXISTS "idx_cic_audit_export_jobs_requested_by" ON "cic_audit_export_jobs" ("requested_by");
CREATE INDEX IF NOT EXISTS "idx_cic_trash_items_entity_id" ON "cic_trash_items" ("entity_id");
CREATE INDEX IF NOT EXISTS "idx_cic_trash_items_deleted_by" ON "cic_trash_items" ("deleted_by");
CREATE INDEX IF NOT EXISTS "idx_cic_trash_items_restored_by" ON "cic_trash_items" ("restored_by");
CREATE INDEX IF NOT EXISTS "idx_cic_trash_items_purged_by" ON "cic_trash_items" ("purged_by");
CREATE INDEX IF NOT EXISTS "idx_cic_content_embeds_owner" ON "cic_content_embeds" ("workspace", "owner_type", "owner_id", "field_key");
CREATE INDEX IF NOT EXISTS "idx_cic_form_submissions_placement_key" ON "cic_form_submissions" ("placement_key");
CREATE UNIQUE INDEX IF NOT EXISTS "ux_cic_roles_code_norm" ON "cic_roles" (lower(trim("code")));
CREATE UNIQUE INDEX IF NOT EXISTS "ux_cic_user_roles_active" ON "cic_user_roles" ("user_id", "role_id") WHERE "status" = 'active';
CREATE UNIQUE INDEX IF NOT EXISTS "ux_cic_branches_head_office" ON "cic_branches" ("workspace") WHERE "is_head_office" = true AND "published" = true;
CREATE UNIQUE INDEX IF NOT EXISTS "ux_cic_trash_items_trashed_entity" ON "cic_trash_items" ("workspace", "entity_type", "entity_id") WHERE "status" = 'trashed';

-- ============================================================
-- TRIGGER auto-update cho cac cot edited_time/updated_time
-- (truoc day chi la ghi chu de xuat, chua co DDL thuc thi)
-- ============================================================

CREATE OR REPLACE FUNCTION set_edit_time() RETURNS trigger AS $$
BEGIN
  NEW."edit_time" := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_edited_time() RETURNS trigger AS $$
BEGIN
  NEW."edited_time" := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_updated_time() RETURNS trigger AS $$
BEGIN
  NEW."updated_time" := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_cic_address_edited_time ON "cic_address";
CREATE TRIGGER trg_cic_address_edited_time
  BEFORE UPDATE ON "cic_address"
  FOR EACH ROW EXECUTE FUNCTION set_edited_time();

DROP TRIGGER IF EXISTS trg_cic_areas_edited_time ON "cic_areas";
CREATE TRIGGER trg_cic_areas_edited_time
  BEFORE UPDATE ON "cic_areas"
  FOR EACH ROW EXECUTE FUNCTION set_edited_time();

DROP TRIGGER IF EXISTS trg_cic_cities_edited_time ON "cic_cities";
CREATE TRIGGER trg_cic_cities_edited_time
  BEFORE UPDATE ON "cic_cities"
  FOR EACH ROW EXECUTE FUNCTION set_edited_time();

DROP TRIGGER IF EXISTS trg_cic_regions_updated_time ON "cic_regions";
CREATE TRIGGER trg_cic_regions_updated_time
  BEFORE UPDATE ON "cic_regions"
  FOR EACH ROW EXECUTE FUNCTION set_updated_time();

DROP TRIGGER IF EXISTS trg_cic_wards_edit_time ON "cic_wards";
CREATE TRIGGER trg_cic_wards_edit_time
  BEFORE UPDATE ON "cic_wards"
  FOR EACH ROW EXECUTE FUNCTION set_edit_time();

DROP TRIGGER IF EXISTS trg_cic_users_updated_time ON "cic_users";
CREATE TRIGGER trg_cic_users_updated_time
  BEFORE UPDATE ON "cic_users"
  FOR EACH ROW EXECUTE FUNCTION set_updated_time();

DROP TRIGGER IF EXISTS trg_cic_members_edited_time ON "cic_members";
CREATE TRIGGER trg_cic_members_edited_time
  BEFORE UPDATE ON "cic_members"
  FOR EACH ROW EXECUTE FUNCTION set_edited_time();

DROP TRIGGER IF EXISTS trg_cic_menus_items_updated_time ON "cic_menus_items";
CREATE TRIGGER trg_cic_menus_items_updated_time
  BEFORE UPDATE ON "cic_menus_items"
  FOR EACH ROW EXECUTE FUNCTION set_updated_time();

DROP TRIGGER IF EXISTS trg_cic_extends_groups_updated_time ON "cic_extends_groups";
CREATE TRIGGER trg_cic_extends_groups_updated_time
  BEFORE UPDATE ON "cic_extends_groups"
  FOR EACH ROW EXECUTE FUNCTION set_updated_time();

DROP TRIGGER IF EXISTS trg_cic_extends_items_edited_time ON "cic_extends_items";
CREATE TRIGGER trg_cic_extends_items_edited_time
  BEFORE UPDATE ON "cic_extends_items"
  FOR EACH ROW EXECUTE FUNCTION set_edited_time();

DROP TRIGGER IF EXISTS trg_cic_languages_tables_edited_time ON "cic_languages_tables";
CREATE TRIGGER trg_cic_languages_tables_edited_time
  BEFORE UPDATE ON "cic_languages_tables"
  FOR EACH ROW EXECUTE FUNCTION set_edited_time();

DROP TRIGGER IF EXISTS trg_cic_contents_updated_time ON "cic_contents";
CREATE TRIGGER trg_cic_contents_updated_time
  BEFORE UPDATE ON "cic_contents"
  FOR EACH ROW EXECUTE FUNCTION set_updated_time();

DROP TRIGGER IF EXISTS trg_cic_contents_categories_updated_time ON "cic_contents_categories";
CREATE TRIGGER trg_cic_contents_categories_updated_time
  BEFORE UPDATE ON "cic_contents_categories"
  FOR EACH ROW EXECUTE FUNCTION set_updated_time();

DROP TRIGGER IF EXISTS trg_cic_news_updated_time ON "cic_news";
CREATE TRIGGER trg_cic_news_updated_time
  BEFORE UPDATE ON "cic_news"
  FOR EACH ROW EXECUTE FUNCTION set_updated_time();

DROP TRIGGER IF EXISTS trg_cic_news_categories_updated_time ON "cic_news_categories";
CREATE TRIGGER trg_cic_news_categories_updated_time
  BEFORE UPDATE ON "cic_news_categories"
  FOR EACH ROW EXECUTE FUNCTION set_updated_time();

DROP TRIGGER IF EXISTS trg_cic_news_keyword_edited_time ON "cic_news_keyword";
CREATE TRIGGER trg_cic_news_keyword_edited_time
  BEFORE UPDATE ON "cic_news_keyword"
  FOR EACH ROW EXECUTE FUNCTION set_edited_time();

DROP TRIGGER IF EXISTS trg_cic_keywords_edited_time ON "cic_keywords";
CREATE TRIGGER trg_cic_keywords_edited_time
  BEFORE UPDATE ON "cic_keywords"
  FOR EACH ROW EXECUTE FUNCTION set_edited_time();

DROP TRIGGER IF EXISTS trg_cic_event_updated_time ON "cic_event";
CREATE TRIGGER trg_cic_event_updated_time
  BEFORE UPDATE ON "cic_event"
  FOR EACH ROW EXECUTE FUNCTION set_updated_time();

DROP TRIGGER IF EXISTS trg_cic_products_edited_time ON "cic_products";
CREATE TRIGGER trg_cic_products_edited_time
  BEFORE UPDATE ON "cic_products"
  FOR EACH ROW EXECUTE FUNCTION set_edited_time();

DROP TRIGGER IF EXISTS trg_cic_products_categories_updated_time ON "cic_products_categories";
CREATE TRIGGER trg_cic_products_categories_updated_time
  BEFORE UPDATE ON "cic_products_categories"
  FOR EACH ROW EXECUTE FUNCTION set_updated_time();

DROP TRIGGER IF EXISTS trg_cic_product_contact_edited_time ON "cic_product_contact";
CREATE TRIGGER trg_cic_product_contact_edited_time
  BEFORE UPDATE ON "cic_product_contact"
  FOR EACH ROW EXECUTE FUNCTION set_edited_time();

DROP TRIGGER IF EXISTS trg_cic_manufactories_updated_time ON "cic_manufactories";
CREATE TRIGGER trg_cic_manufactories_updated_time
  BEFORE UPDATE ON "cic_manufactories"
  FOR EACH ROW EXECUTE FUNCTION set_updated_time();

DROP TRIGGER IF EXISTS trg_cic_order_edited_time ON "cic_order";
CREATE TRIGGER trg_cic_order_edited_time
  BEFORE UPDATE ON "cic_order"
  FOR EACH ROW EXECUTE FUNCTION set_edited_time();

DROP TRIGGER IF EXISTS trg_cic_banners_edited_time ON "cic_banners";
CREATE TRIGGER trg_cic_banners_edited_time
  BEFORE UPDATE ON "cic_banners"
  FOR EACH ROW EXECUTE FUNCTION set_edited_time();

DROP TRIGGER IF EXISTS trg_cic_banners_categories_updated_time ON "cic_banners_categories";
CREATE TRIGGER trg_cic_banners_categories_updated_time
  BEFORE UPDATE ON "cic_banners_categories"
  FOR EACH ROW EXECUTE FUNCTION set_updated_time();

DROP TRIGGER IF EXISTS trg_cic_slideshow_edited_time ON "cic_slideshow";
CREATE TRIGGER trg_cic_slideshow_edited_time
  BEFORE UPDATE ON "cic_slideshow"
  FOR EACH ROW EXECUTE FUNCTION set_edited_time();

DROP TRIGGER IF EXISTS trg_cic_slideshow_categories_updated_time ON "cic_slideshow_categories";
CREATE TRIGGER trg_cic_slideshow_categories_updated_time
  BEFORE UPDATE ON "cic_slideshow_categories"
  FOR EACH ROW EXECUTE FUNCTION set_updated_time();

DROP TRIGGER IF EXISTS trg_cic_contact_edited_time ON "cic_contact";
CREATE TRIGGER trg_cic_contact_edited_time
  BEFORE UPDATE ON "cic_contact"
  FOR EACH ROW EXECUTE FUNCTION set_edited_time();

DROP TRIGGER IF EXISTS trg_cic_contact_enjicad_edited_time ON "cic_contact_enjicad";
CREATE TRIGGER trg_cic_contact_enjicad_edited_time
  BEFORE UPDATE ON "cic_contact_enjicad"
  FOR EACH ROW EXECUTE FUNCTION set_edited_time();

DROP TRIGGER IF EXISTS trg_cic_email_updated_time ON "cic_email";
CREATE TRIGGER trg_cic_email_updated_time
  BEFORE UPDATE ON "cic_email"
  FOR EACH ROW EXECUTE FUNCTION set_updated_time();

DROP TRIGGER IF EXISTS trg_cic_types_email_updated_time ON "cic_types_email";
CREATE TRIGGER trg_cic_types_email_updated_time
  BEFORE UPDATE ON "cic_types_email"
  FOR EACH ROW EXECUTE FUNCTION set_updated_time();

DROP TRIGGER IF EXISTS trg_cic_onlinesupport_edited_time ON "cic_onlinesupport";
CREATE TRIGGER trg_cic_onlinesupport_edited_time
  BEFORE UPDATE ON "cic_onlinesupport"
  FOR EACH ROW EXECUTE FUNCTION set_edited_time();

DROP TRIGGER IF EXISTS trg_cic_business_updated_time ON "cic_business";
CREATE TRIGGER trg_cic_business_updated_time
  BEFORE UPDATE ON "cic_business"
  FOR EACH ROW EXECUTE FUNCTION set_updated_time();

DROP TRIGGER IF EXISTS trg_cic_services_updated_time ON "cic_services";
CREATE TRIGGER trg_cic_services_updated_time
  BEFORE UPDATE ON "cic_services"
  FOR EACH ROW EXECUTE FUNCTION set_updated_time();

DROP TRIGGER IF EXISTS trg_cic_image_edited_time ON "cic_image";
CREATE TRIGGER trg_cic_image_edited_time
  BEFORE UPDATE ON "cic_image"
  FOR EACH ROW EXECUTE FUNCTION set_edited_time();
