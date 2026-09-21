# KẾ HOẠCH XỬ LÝ VÀ LÀM SẠCH LỊCH SỬ GIT (GIT HISTORY REMEDIATION PLAN)

**Mã phát hiện:** `SEC-A003`  
**Dự án:** CIC Web Portal (`cic-web`)  
**Ngày lập:** 21/09/2026  
**Trạng thái:** `VERIFIED_EXPOSURE_PENDING_OPERATIONAL_REMEDIATION`  
**Loại rủi ro:** Lộ lọt dữ liệu cơ sở dữ liệu legacy trong lịch sử commit của Git (Git History Data Exposure).

---

## 1. DANH SÁCH TỆP VÀ COMMIT BỊ ẢNH HƯỞNG (AFFECTED FILES & COMMITS)

### Các tệp dump cơ sở dữ liệu tồn tại trong lịch sử:
1. `db_migrate/cic14005_cic_fs.sql` (~1.5 MB, schema định nghĩa cấu trúc bảng).
2. `db_migrate/cic14005_cic_fs_data.sql` (~61.3 MB, dữ liệu chi tiết của hệ thống cũ).
3. `db_migrate/export_data.sql` (~25.4 MB, dữ liệu xuất từ hệ thống cũ).
4. `db_migrate/migration_data.sql` (~31.8 MB, dữ liệu trung gian phục vụ migration).
5. `db_migrate/cic14005_cic_fs_schema_moi_postgresql_PATCHED.sql` (~1.2 MB).

### Các commit giới thiệu tệp dump:
- **`c782eadd0f9320b78c67df4df72acc28e199a009`** (Thu Jul 30 15:59:48 2026): `feat(db): add database migration version 2`
- **`32128de06f0ac203382eede826f1a7ab90cc99f5`** (Mon Aug 17 13:56:10 2026): `feat(db): add upgrade db`
- **`4562acc7d811c70db2591df840691500d434dd05`** (Mon Sep 21 11:09:12 2026): Commit xóa tệp khỏi working tree (`git rm`), nhưng tệp vẫn còn lưu vĩnh viễn trong git object database của nhánh.

---

## 2. PHÂN LOẠI NỘI DUNG VÀ ĐÁNH GIÁ MỨC ĐỘ RỦI RO (EXPOSURE ASSESSMENT)

Qua rà soát chuyên sâu từng bảng dữ liệu trong các tệp dump:

| Hạng mục dữ liệu | Tình trạng xuất hiện | Chi tiết nội dung | Đánh giá phân loại |
| :--- | :---: | :--- | :--- |
| **Thông tin tài khoản (`fs_users`, `fs_members`)** | **CÓ** | Chứa danh sách tài khoản quản trị cũ, email, số điện thoại, họ tên, và chuỗi mã hóa mật khẩu MD5 (`password`). | `DATA_EXPOSURE` (PII & Password Hashes) |
| **Thông tin khách hàng (`fs_contact`)** | **CÓ** | Chứa họ tên khách hàng, email, số điện thoại, nội dung yêu cầu tư vấn kỹ thuật/sản phẩm. | `DATA_EXPOSURE` (Customer PII) |
| **Dữ liệu bài viết, sản phẩm, dịch vụ** | **CÓ** | Danh mục bài viết tin tức, thông số sản phẩm, dự án của CIC. | `BUSINESS_DATA` |
| **Active Cloud Credentials / Supabase Service Keys** | **KHÔNG** | Quét toàn bộ lịch sử với prefix `eyJh`, `service_role`, `sbp_`: Không tìm thấy Supabase Service Role Key hay JWT Token sản xuất. | `NO_CLOUD_SECRET_EXPOSURE` |
| **Cấu hình SMTP Mail (`fs_config`)** | **KHÔNG** | Bảng `fs_config` trong dump không chứa mật khẩu hòm thư hay credential SMTP còn hiệu lực. | `NO_SMTP_SECRET_EXPOSURE` |

### Kết luận đánh giá Secret Rotation:
- **`DATA_EXPOSURE`**: ĐÃ XÁC NHẬN (Lộ lọt thông tin cá nhân khách hàng và hash mật khẩu người dùng legacy).
- **`SECRET_EXPOSURE`**: KHÔNG CÓ credentials đám mây hoặc secret hạ tầng đang chạy bị lộ.
- **`ROTATION_REQUIRED`**: Đối với người dùng có tài khoản trên hệ thống mới trùng khớp với email trong bảng `fs_users` của hệ thống cũ, bắt buộc kích hoạt yêu cầu đổi mật khẩu (force password reset) nhằm phòng ngừa trường hợp người dùng tái sử dụng mật khẩu cũ (vốn chỉ được hash bằng MD5 đơn giản).

---

## 3. KẾ HOẠCH LÀM SẠCH LỊCH SỬ GIT (HISTORY REWRITE PLAN)

> [!CAUTION]
> **QUY TRÌNH VẬN HÀNH BẮT BUỘC:** Việc rewrite lịch sử git sẽ làm thay đổi mã băm (commit hashes) của toàn bộ các commit tiếp theo và yêu cầu `git push --force-with-lease`. Do đó, thao tác này **KHÔNG được tự động chạy** mà phải được điều phối và phê duyệt bởi Quản trị viên/Chủ dự án (Repository Owner).

### Bước 1: Tạo bản sao lưu toàn bộ kho mã nguồn (Full Mirror Backup)
Trước khi thực hiện bất kỳ thao tác nào, tạo bản sao lưu độc lập:
```bash
git clone --mirror https://github.com/appdev-cmd/cic-web.git cic-web-backup-before-rewrite.git
```

### Bước 2: Thông báo đóng băng commit (Freeze Coordination)
- Thông báo cho tất cả lập trình viên và thành viên dự án dừng push code lên nhánh `refactor/nextjs-fullstack` và `main`.
- Đảm bảo tất cả các Pull Request đang mở đã được merge hoặc lưu lại nhánh local.

### Bước 3: Sử dụng `git-filter-repo` để xóa triệt để các tệp dump
Sử dụng công cụ chính thức được Git khuyến nghị (`git-filter-repo`):
```bash
# Cài đặt git-filter-repo (nếu chưa có):
pip install git-filter-repo

# Di chuyển vào thư mục clone mới hoặc workspace:
git filter-repo --path db_migrate/cic14005_cic_fs.sql --invert-paths --force
git filter-repo --path db_migrate/cic14005_cic_fs_data.sql --invert-paths --force
git filter-repo --path db_migrate/export_data.sql --invert-paths --force
git filter-repo --path db_migrate/migration_data.sql --invert-paths --force
git filter-repo --path db_migrate/cic14005_cic_fs_schema_moi_postgresql_PATCHED.sql --invert-paths --force
```

### Bước 4: Thu dọn rác và xóa reflogs local
```bash
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

### Bước 5: Kiểm tra xác minh sau khi làm sạch (Verification Procedure)
Chạy lệnh kiểm tra lịch sử xem còn vết tích của các file SQL hay không:
```bash
git log --all --full-history -- "**/cic14005_cic_fs*.sql" "**/export_data.sql" "**/migration_data.sql"
```
*Kết quả bắt buộc: Không trả về bất kỳ commit nào.*

Đồng thời kiểm tra dung lượng thư mục `.git`:
Dung lượng thư mục `.git` sẽ giảm tương ứng khoảng 60–100 MB.

### Bước 6: Đẩy lại lên Remote Repository (Force Push with Coordination)
Sau khi xác minh toàn bộ test suite và build vẫn chạy bình thường:
```bash
git push origin --force --all
git push origin --force --tags
```

### Bước 7: Hướng dẫn dành cho cộng tác viên (Collaborator Impact)
Sau khi remote repository đã được rewrite, tất cả thành viên trong nhóm cần thực hiện:
```bash
# Cách an toàn nhất: Clone lại repository mới
cd ..
git clone https://github.com/appdev-cmd/cic-web.git cic-web-clean

# Hoặc rebase nhánh local lên origin mới:
git fetch origin
git reset --hard origin/refactor/nextjs-fullstack
```
