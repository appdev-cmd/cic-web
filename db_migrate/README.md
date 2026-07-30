# ETL migrate cic14005_cic_fs: MySQL -> PostgreSQL

## Cấu trúc thư mục
```
etl/
├── manifest.json     # Ánh xạ tự động: bảng/cột mới -> bảng/cột cũ
                       #   (sinh từ chính file schema PostgreSQL đã vá,
                       #    không cần bạn gõ tay 102 bảng)
├── config.py          # Thông tin kết nối MySQL nguồn + Postgres đích
├── migrate.py          # Script chính
└── README.md           # File này
```

## Chuẩn bị

1. **Tạo schema đích trước** bằng file DDL đã vá
   (`cic14005_cic_fs_schema_moi_postgresql_PATCHED.sql`) — chạy file đó
   trên Postgres rỗng trước, migrate.py chỉ INSERT dữ liệu, không tạo bảng.

   ```bash
   psql -h localhost -U your_pg_user -d cic14005_cic_fs_new \
        -f cic14005_cic_fs_schema_moi_postgresql_PATCHED.sql
   ```

2. **Cài thư viện Python** (khuyến nghị dùng venv):
   ```bash
   python3 -m venv venv
   source venv/bin/activate        # Windows: venv\Scripts\activate
   pip install mysql-connector-python psycopg2-binary
   ```

3. **Sửa `config.py`** — điền đúng host/user/password/database MySQL nguồn
   và Postgres đích.

4. **Backup dữ liệu nguồn trước khi chạy** (dù script chỉ SELECT, không
   UPDATE gì bên MySQL, nhưng luôn nên có bản backup trước khi làm việc
   với dữ liệu nghiệp vụ thật):
   ```bash
   mysqldump -u root -p cic14005_cic_fs > backup_truoc_migrate.sql
   ```

## Chạy

```bash
cd etl
python3 migrate.py
```

Script sẽ:
- Chạy **Phase A**: copy toàn bộ bảng thường trước (giữ nguyên `id` cũ).
- Chạy **Phase B**: copy các bảng `*_translations` sau (vì có
  `REFERENCES` về bảng ở Phase A).
- In log từng bảng: `OK  <tên bảng>  <số dòng>` hoặc `LOI` nếu lỗi.
- Ghi báo cáo tổng kết ra `migration_report.json` (số dòng đã copy mỗi
  bảng, hoặc `"ERROR"` nếu bảng đó lỗi).

Nếu 1 bảng bị lỗi, script **không dừng toàn bộ** — nó rollback riêng bảng
đó, ghi log lỗi, rồi chạy tiếp bảng kế tiếp. Sau khi chạy xong, xem
`migration_report.json` để biết bảng nào cần chạy lại tay.

Script dùng `ON CONFLICT ... DO NOTHING` nên **chạy lại nhiều lần là an
toàn** (idempotent) — dòng đã có sẽ tự bỏ qua, không bị trùng.

## Sau khi chạy xong — đối soát bắt buộc

1. **So sánh số dòng** — chạy nhanh trong `psql`:
   ```sql
   SELECT relname, n_live_tup FROM pg_stat_user_tables ORDER BY relname;
   ```
   rồi so với `SELECT COUNT(*)` từng bảng MySQL tương ứng (tổng bảng gộp
   `vi + en` cho các bảng `*_translations`).

2. **Kiểm tra vài dòng tiếng Việt** còn đúng dấu không (đặc biệt 22 bảng
   từng bị khai sai latin1 — xem `LATIN1_MISLABELED_TABLES` trong
   `migrate.py`):
   ```sql
   SELECT * FROM application_translations WHERE locale = 'vi' LIMIT 10;
   ```

3. **Kiểm tra `migration_report.json`** — bảng nào ghi `"ERROR"` hoặc số
   dòng = 0 bất thường (so với việc bảng đó có dữ liệu ở MySQL) thì xem
   log để biết lý do rồi chạy lại riêng bảng đó.

## Export data ra file SQL INSERT

Nếu bạn muốn export data từ MySQL ra file SQL INSERT statements trước khi
import vào PostgreSQL (thay vì import trực tiếp), dùng script `export_sql.py`:

```bash
cd etl
python3 export_sql.py
```

Script sẽ:
- Export toàn bộ dữ liệu ra file `export_data.sql` duy nhất
- Giữ nguyên ID gốc với `OVERRIDING SYSTEM VALUE` để tránh xung đột
- Tự động xử lý các vấn đề dữ liệu:
  - **FK violations**: Tạo stub rows cho các FK orphan (bản ghi cha đã bị xóa)
  - **0 values trong FK columns**: Chuyển thành NULL (tránh lỗi FK)
  - **Self-reference columns**: Defer UPDATE sau khi INSERT để tránh vòng FK
  - **Latin1-mislabeled UTF-8**: Fix encoding cho 22 bảng bị khai sai charset
  - **Topological sort**: Sắp xếp bảng theo thứ tự FK để tránh lỗi import
- Tạo file `export_report.json` với số dòng đã export mỗi bảng

Sau khi export xong, import vào PostgreSQL:

```bash
psql -h localhost -U your_pg_user -d cic14005_cic_fs_new \
     -f export_data.sql
```

**Khi nào nên dùng export_sql.py:**
- Khi bạn muốn kiểm tra file SQL trước khi import
- Khi cần import thủ công từng phần hoặc debug
- Khi migrate.py gặp lỗi và bạn cần cách tiếp cận khác
- Khi muốn giữ file SQL làm backup

**Lưu ý:** Script export chỉ đọc data từ MySQL, không sửa gì cả nên an toàn
để chạy lại nhiều lần. File SQL được sinh ra có thể import trực tiếp mà
không cần chỉnh sửa.

## Lưu ý quan trọng

- Script migrate **theo đúng manifest đã sinh từ schema đã vá** — nếu sau
  này bạn sửa tiếp file DDL (đổi tên cột, thêm bảng...), phải **sinh lại
  `manifest.json`** trước khi chạy lại migrate.py, không thì dữ liệu sẽ
  lệch. (Mình có thể viết lại script sinh manifest nếu bạn cần đụng vào.)
- Với các bảng `_translations` không có bảng `_en` tương ứng thật sự có
  dữ liệu (ví dụ `products_tables_translations` — không có cột nội dung
  nào để dịch), script sẽ không insert dòng nào cho bảng đó vì không có
  cột dữ liệu — đây là hành vi đúng theo thiết kế hiện tại, không phải
  lỗi.
- 92 cột khoá ngoại (category_id, parent_id...) trong schema mới **không
  có ràng buộc `REFERENCES` thật** (chỉ có index), nên script không cần
  quan tâm thứ tự insert giữa các bảng thường với nhau — chỉ cần bảng
  thường chạy xong trước bảng `_translations` (đã tự động đúng thứ tự
  trong `migrate.py`).
