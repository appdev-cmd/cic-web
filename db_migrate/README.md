# ETL migrate `cic14005_cic_fs`: MySQL → PostgreSQL

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
