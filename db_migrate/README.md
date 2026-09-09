# ETL migrate `cic14005_cic_fs`: MySQL → PostgreSQL

## Runbook nhanh: dựng database, chạy migration và khởi động dự án

Các lệnh dưới đây dành cho **Windows PowerShell**. Chạy từ thư mục gốc của
repository, trừ khi bước đó có `Set-Location db_migrate`.

### Chọn đúng loại thao tác

- **Dựng database mới từ đầu:** chạy schema + dữ liệu nền bằng
  `import_to_postgres.py`, sau đó chạy toàn bộ migration incremental.
- **Database đã có dữ liệu:** không chạy lại schema/data nền; chỉ chạy những
  migration incremental chưa được áp dụng.

> Cảnh báo: schema nền có các lệnh `DROP TABLE ... CASCADE`. Không chạy lại
> `import_to_postgres.py` trên database đang sử dụng nếu chưa chủ động chấp nhận
> xoá và dựng lại dữ liệu. Hãy sao lưu database trước mọi thao tác production.

### 1. Chuẩn bị

Từ thư mục gốc repository:

```powershell
npm.cmd install
python -m venv db_migrate\venv
db_migrate\venv\Scripts\Activate.ps1
pip install mysql-connector-python python-dotenv
psql --version
```

`.env.local` phải có cấu hình `DB_MIGRATE_MYSQL_*`,
`DB_MIGRATE_POSTGRES_*` cho các script Python và `DATABASE_URL` cùng các biến
Supabase/Next.js mà ứng dụng yêu cầu. Không commit credential thật.

Kiểm tra cấu hình ứng dụng mà không in secret:

```powershell
npm.cmd run check:env
```

### 2. Dựng schema và dữ liệu nền (chỉ cho database mới/rỗng)

```powershell
Set-Location db_migrate
python generate_manifest.py
python export_sql.py
python import_to_postgres.py --schema cic14005_cic_fs_schema_moi_postgresql_PATCHED.sql --data export_data.sql
Set-Location ..
```

Trước khi import thật, có thể chỉ kiểm tra kết nối:

```powershell
Set-Location db_migrate
python import_to_postgres.py --schema cic14005_cic_fs_schema_moi_postgresql_PATCHED.sql --check-only
Set-Location ..
```

Sau `export_sql.py`, bắt buộc kiểm tra `export_report.json` và dữ liệu tiếng
Việt trong `export_data.sql`. Không import nếu tên/nội dung đã xuất hiện ký tự
`?` thay cho dấu tiếng Việt; khi đó lỗi đã nằm ở nguồn hoặc bước export.

### 3. Chạy migration incremental

Các migration cần chạy là những file SQL trong `db_migrate/migrations/`.
`psql` không tự đọc `.env.local`, nhưng có thể nạp riêng `DATABASE_URL` từ file
đó vào phiên PowerShell hiện tại (lệnh không in giá trị secret ra màn hình):

> **Bắt buộc trước khi chạy các lệnh `psql` bên dưới:** mỗi lần mở một terminal
> PowerShell mới, phải chạy khối nạp `DATABASE_URL` này đúng một lần. Nếu bỏ
> qua, `$env:DATABASE_URL` sẽ rỗng và `psql` có thể chuyển sang PostgreSQL local,
> sau đó hỏi `Password for user Admin`.

```powershell
$databaseUrlLine = Get-Content .env.local |
  Where-Object { $_ -match '^\s*DATABASE_URL\s*=' } |
  Select-Object -First 1

if (-not $databaseUrlLine) { throw 'Không tìm thấy DATABASE_URL trong .env.local' }

$env:DATABASE_URL = ($databaseUrlLine -replace '^\s*DATABASE_URL\s*=\s*', '').Trim().Trim('"').Trim("'")
if (-not $env:DATABASE_URL) { throw 'DATABASE_URL trong .env.local đang rỗng' }

# Phải trả về True trước khi chạy migration
$env:DATABASE_URL -like 'postgres*'
```

Biến này chỉ tồn tại trong terminal hiện tại. Mở terminal mới thì chạy lại đoạn
trên. Nếu kết quả kiểm tra là `False`, không chạy migration. Không in
`$env:DATABASE_URL` ra console và không commit credential thật.

Chạy trực tiếp từng file theo thứ tự timestamp. `ON_ERROR_STOP=1` bảo đảm
`psql` trả lỗi ngay thay vì âm thầm chạy tiếp:

```powershell
psql "$env:DATABASE_URL" -v ON_ERROR_STOP=1 -f db_migrate/migrations/20260903_activity_audit_foundation.sql
psql "$env:DATABASE_URL" -v ON_ERROR_STOP=1 -f db_migrate/migrations/20260903_trash_foundation.sql
psql "$env:DATABASE_URL" -v ON_ERROR_STOP=1 -f db_migrate/migrations/20260903_users_identity_hardening.sql
psql "$env:DATABASE_URL" -v ON_ERROR_STOP=1 -f db_migrate/migrations/20260904_media_foundation_hardening.sql
psql "$env:DATABASE_URL" -v ON_ERROR_STOP=1 -f db_migrate/migrations/20260904_product_brands_hardening.sql
psql "$env:DATABASE_URL" -v ON_ERROR_STOP=1 -f db_migrate/migrations/20260904_product_categories_hardening.sql
psql "$env:DATABASE_URL" -v ON_ERROR_STOP=1 -f db_migrate/migrations/20260908_product_applications_hardening.sql
psql "$env:DATABASE_URL" -v ON_ERROR_STOP=1 -f db_migrate/migrations/20260908_product_types_hardening.sql
```

Nếu đang dựng một database mới và chắc chắn chưa file nào được áp dụng, có thể
chạy toàn bộ thư mục theo thứ tự tên file:

```powershell
Get-ChildItem db_migrate/migrations/*.sql |
  Sort-Object Name |
  ForEach-Object {
    Write-Host "Applying $($_.Name)..."
    psql "$env:DATABASE_URL" -v ON_ERROR_STOP=1 -f $_.FullName
    if ($LASTEXITCODE -ne 0) { throw "Migration failed: $($_.Name)" }
  }
```

Với database đã tồn tại, chỉ chạy file chưa áp dụng; không dùng vòng lặp trên
một cách máy móc. Các wrapper `scripts/apply-*.mjs` vẫn có thể dùng khi cần,
nhưng không phải luồng chính của mục hướng dẫn này.

### 4. Xác minh sau migration

```powershell
node --env-file=.env.local scripts/verify-activity-audit-foundation.mjs
node --env-file=.env.local scripts/verify-trash-foundation.mjs
node --env-file=.env.local scripts/verify-users-identity.mjs
node --env-file=.env.local scripts/verify-media-foundation.mjs
npm.cmd run verify:product-brand-roundtrip
npm.cmd run verify:product-category-roundtrip
npm.cmd run verify:product-application-foundation
npm.cmd run verify:product-application-roundtrip
```

Các kiểm thử `roundtrip` có tạo dữ liệu kiểm thử tạm thời rồi dọn dẹp. Chỉ chạy
trên môi trường đã cấu hình đúng và có tài khoản/quyền CMS phục vụ kiểm thử.

### 5. Khởi động dự án

```powershell
npm.cmd run check:env
npm.cmd run typecheck
npm.cmd run dev
```

Mở `http://localhost:3000`. Khi kiểm tra bản production:

```powershell
npm.cmd run build
npm.cmd run start
```

### Khi thêm migration mới

1. Tạo file SQL có timestamp trong `db_migrate/migrations/`.
2. Tạo/cập nhật script `scripts/apply-*.mjs` và script verify phù hợp.
3. Thêm lệnh vào runbook này theo đúng thứ tự phụ thuộc.
4. Chạy apply một lần, chạy verify, rồi chạy `typecheck`/`build` liên quan.

---

Quy trình này dùng **MySQL local làm nguồn dữ liệu cũ**, sinh `manifest.json` từ **schema PostgreSQL mới**, export dữ liệu MySQL thành SQL PostgreSQL, sau đó import **schema + data** vào PostgreSQL.

> **Thứ tự cần nhớ:**
> `database.html` → PostgreSQL schema → MySQL local → `generate_manifest.py` → `export_sql.py` → `import_to_postgres.py`

---

## 1. Các file chính

```text
etl/
├── database.html
├── cic14005_cic_fs.sql
├── cic14005_cic_fs_schema_moi_postgresql_PATCHED.sql
├── config.py
├── generate_manifest.py
├── manifest.json                  # được sinh tự động
├── export_sql.py
├── export_data.sql                # được sinh tự động
├── export_report.json             # được sinh tự động
├── import_to_postgres.py
└── README.md
```

### Vai trò từng file

- `database.html`: tài liệu/schema database mới. Dùng nút export trong file này để xuất schema PostgreSQL.
- `cic14005_cic_fs.sql`: dump **MySQL cũ**, gồm schema và dữ liệu nguồn.
- `cic14005_cic_fs_schema_moi_postgresql_PATCHED.sql`: schema PostgreSQL mới được export từ `database.html`.
- `config.py`: đọc cấu hình MySQL/PostgreSQL từ `.env.local`.
- `generate_manifest.py`: đọc schema PostgreSQL mới và đối chiếu MySQL local để sinh `manifest.json`.
- `manifest.json`: mapping giữa schema PostgreSQL mới và dữ liệu MySQL cũ.
- `export_sql.py`: đọc MySQL theo `manifest.json` và sinh `export_data.sql`.
- `import_to_postgres.py`: import schema PostgreSQL mới và `export_data.sql` vào PostgreSQL.

**Không dùng `migrate.py`.**

---

# 2. Quy trình chạy chuẩn

## Bước 0 — Chuẩn bị môi trường

Khuyến nghị dùng virtual environment:

```bash
python -m venv venv
source venv/bin/activate
```

Windows:

```bash
venv\Scripts\activate
```

Cài dependency:

```bash
pip install mysql-connector-python python-dotenv
```

`import_to_postgres.py` dùng lệnh `psql`, vì vậy máy cũng phải có **PostgreSQL client** và lệnh sau phải chạy được:

```bash
psql --version
```

---

## Bước 1 — Export schema PostgreSQL từ `database.html`

Mở:

```text
database.html
```

Trong trang tài liệu database, dùng chức năng **export schema PostgreSQL**.

File đầu ra cần là:

```text
cic14005_cic_fs_schema_moi_postgresql_PATCHED.sql
```

Đây là **schema đích** mà toàn bộ các bước sau sẽ dựa vào.

> Nếu sửa cấu trúc database trong `database.html`, phải export lại file schema PostgreSQL rồi chạy lại `generate_manifest.py`.

---

## Bước 2 — Bật MySQL local và import database cũ

Trước khi chạy bất kỳ script export dữ liệu nào, phải đảm bảo **MySQL local đang chạy**.

Tạo database nguồn, ví dụ:

```sql
CREATE DATABASE cic14005_cic_fs
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

Sau đó import dump MySQL cũ:

```bash
mysql -u root -p cic14005_cic_fs < cic14005_cic_fs.sql
```

Có thể import bằng phpMyAdmin/MySQL Workbench nếu muốn.

### Kiểm tra bắt buộc

MySQL local phải có **cả schema lẫn data cũ**, không chỉ tạo database rỗng.

Ví dụ:

```sql
USE cic14005_cic_fs;

SHOW TABLES;

SELECT COUNT(*) FROM fs_products;
```

Nếu bảng không tồn tại hoặc dữ liệu trả về bất thường thì **không chạy tiếp**.

---

## Bước 3 — Cấu hình `.env.local`

`config.py` đọc thông tin kết nối từ `.env.local`.

Ví dụ:

```env
DB_MIGRATE_MYSQL_HOST=localhost
DB_MIGRATE_MYSQL_PORT=3306
DB_MIGRATE_MYSQL_USER=root
DB_MIGRATE_MYSQL_PASSWORD=your_mysql_password
DB_MIGRATE_MYSQL_DATABASE=cic14005_cic_fs

DB_MIGRATE_POSTGRES_HOST=localhost
DB_MIGRATE_POSTGRES_PORT=5432
DB_MIGRATE_POSTGRES_USER=postgres
DB_MIGRATE_POSTGRES_PASSWORD=your_postgres_password
DB_MIGRATE_POSTGRES_DATABASE=cic14005_cic_fs_new

DB_MIGRATE_MANIFEST_PATH=manifest.json
```

Không commit credential thật lên Git.

---

## Bước 4 — Chạy `generate_manifest.py` trước

Đây là **script đầu tiên phải chạy** sau khi schema PostgreSQL mới và MySQL nguồn đã sẵn sàng.

```bash
cd etl
python generate_manifest.py
```

Script sẽ:

1. Đọc `cic14005_cic_fs_schema_moi_postgresql_PATCHED.sql`.
2. Kết nối tới MySQL local.
3. Đối chiếu bảng/cột PostgreSQL mới với bảng/cột MySQL cũ.
4. Xác định dependency/FK và các self-reference.
5. Sinh:

```text
manifest.json
```

### Quan trọng

Mỗi khi thay đổi/export lại schema PostgreSQL, phải chạy lại:

```bash
python generate_manifest.py
```

Không dùng `manifest.json` cũ với schema mới.

---

## Bước 5 — Export data MySQL → SQL PostgreSQL

Sau khi đã có `manifest.json`, chạy:

```bash
python export_sql.py
```

Script đọc dữ liệu trực tiếp từ **MySQL local** và sinh:

```text
export_data.sql
export_report.json
```

`export_data.sql` chứa dữ liệu đã được chuyển sang dạng có thể import vào PostgreSQL.

Sau khi export, nên kiểm tra `export_report.json` để phát hiện bảng có số dòng bằng `0`, lỗi hoặc số lượng bất thường.

> Không sửa dữ liệu trực tiếp trong `export_data.sql` nếu chưa xác định rõ nguyên nhân. Nếu mapping/schema sai, sửa nguồn tương ứng rồi chạy lại `generate_manifest.py` → `export_sql.py`.

---

## Bước 6 — Import schema + data vào PostgreSQL

Đảm bảo database PostgreSQL đích đã được tạo và nên là database **rỗng**.

Ví dụ:

```sql
CREATE DATABASE cic14005_cic_fs_new;
```

Sau đó chạy:

```bash
python import_to_postgres.py --schema cic14005_cic_fs_schema_moi_postgresql_PATCHED.sql --data export_data.sql
```

Script sẽ chạy theo đúng thứ tự:

```text
1. Kiểm tra psql
2. Kiểm tra kết nối PostgreSQL
3. Import schema PostgreSQL
4. Nếu schema thành công → import export_data.sql
5. Nếu có lỗi → dừng và rollback file đang import
```

Không cần chạy `psql -f` thủ công nếu đã dùng `import_to_postgres.py`.

### Chỉ kiểm tra kết nối

```bash
python import_to_postgres.py \
  --schema cic14005_cic_fs_schema_moi_postgresql_PATCHED.sql \
  --check-only
```

### Chỉ import schema

```bash
python import_to_postgres.py \
  --schema cic14005_cic_fs_schema_moi_postgresql_PATCHED.sql \
  --skip-data
```

---

# 3. Tóm tắt lệnh cần chạy

Sau khi đã export schema từ `database.html` và import database MySQL cũ vào local:

```bash
cd etl

# 1. Sinh mapping từ schema mới + MySQL cũ
python generate_manifest.py

# 2. Export dữ liệu MySQL thành SQL PostgreSQL
python export_sql.py

# 3. Import schema + data vào PostgreSQL
python import_to_postgres.py --schema cic14005_cic_fs_schema_moi_postgresql_PATCHED.sql --data export_data.sql
```

Luồng đầy đủ:

```text
database.html
      │
      ▼
Export PostgreSQL schema
      │
      ▼
cic14005_cic_fs_schema_moi_postgresql_PATCHED.sql
      │
      │        cic14005_cic_fs.sql
      │                 │
      │                 ▼
      │          Import MySQL local
      │                 │
      └────────┬────────┘
               ▼
      generate_manifest.py
               │
               ▼
          manifest.json
               │
               ▼
          export_sql.py
               │
               ▼
         export_data.sql
               │
               ▼
      import_to_postgres.py
               │
               ▼
        PostgreSQL mới
```

---

# 4. Khi schema thay đổi thì chạy lại gì?

Nếu chỉ sửa dữ liệu trong MySQL:

```text
export_sql.py
→ import_to_postgres.py
```

Nếu sửa schema trong `database.html`:

```text
database.html
→ export lại schema PostgreSQL
→ generate_manifest.py
→ export_sql.py
→ import_to_postgres.py
```

**Không bỏ qua `generate_manifest.py` khi schema thay đổi.**

---

# 5. Đối soát sau khi import

Sau khi import thành công, kiểm tra số dòng PostgreSQL:

```sql
SELECT relname, n_live_tup
FROM pg_stat_user_tables
ORDER BY relname;
```

Đồng thời đối chiếu với MySQL nguồn:

```sql
SELECT COUNT(*) FROM fs_products;
```

và PostgreSQL:

```sql
SELECT COUNT(*) FROM cic_products;
```

Ngoài số lượng dòng, nên kiểm tra:

- dữ liệu tiếng Việt;
- dữ liệu `_translations`;
- foreign key;
- `parent_id` / self-reference;
- ID cũ có được giữ đúng;
- các bảng có số dòng `0` bất thường trong `export_report.json`.

---

# 6. Checklist nhanh

Trước khi migrate:

- [ ] Đã mở `database.html` và export schema PostgreSQL mới nhất.
- [ ] Có `cic14005_cic_fs_schema_moi_postgresql_PATCHED.sql`.
- [ ] MySQL local đang chạy.
- [ ] Đã import **schema + data MySQL cũ** từ `cic14005_cic_fs.sql`.
- [ ] `.env.local` trỏ đúng MySQL local.
- [ ] `.env.local` trỏ đúng PostgreSQL đích.
- [ ] Đã chạy `generate_manifest.py`.
- [ ] Đã kiểm tra `manifest.json` được sinh mới.
- [ ] Đã chạy `export_sql.py`.
- [ ] Có `export_data.sql` và `export_report.json`.
- [ ] PostgreSQL đích đã tạo và sẵn sàng import.
- [ ] Chạy `import_to_postgres.py`.
- [ ] Đối soát dữ liệu sau import.

---

## Quy tắc quan trọng nhất

Không chạy theo luồng `migrate.py` cũ.

Luồng chuẩn hiện tại là:

```text
Export schema từ database.html
→ chuẩn bị MySQL local có đầy đủ schema + data cũ
→ generate_manifest.py
→ export_sql.py
→ import_to_postgres.py
→ đối soát PostgreSQL
```
