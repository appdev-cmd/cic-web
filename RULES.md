# Quy Tắc Dự Án (Project Rules)

Tài liệu này định nghĩa các quy tắc làm việc cốt lõi cho dự án này.

## 1. Giao Tiếp (Communication)
- **Ngôn ngữ chính**: Tiếng Việt.
- Mọi trao đổi, giải thích, và tài liệu (trừ code và comments kỹ thuật nếu cần thiết) sẽ được thực hiện bằng Tiếng Việt để đảm bảo sự rõ ràng và thống nhất.

## 2. Quản Lý Mã Nguồn (Source Control)
### Quy trình Git (BẮT BUỘC tuân thủ):

**Bước 1: Pull trước khi code**
```bash
git pull origin main
```
> ⚠️ LUÔN pull trước khi bắt đầu code để đảm bảo có phiên bản mới nhất.

**Bước 2: Code xong → Commit**
```bash
git add .
git commit -m "feat: mô tả thay đổi"
```
> Commit message tuân theo format: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`

**Bước 3: Pull lại trước khi push**
```bash
git pull origin main
```
> ⚠️ Phòng trường hợp người khác đã push trong lúc mình code.

**Bước 4: Push (nếu không có conflict)**
```bash
git push origin main
```
> ❌ Nếu có conflict → resolve conflict trước → commit lại → rồi mới push.

### Tóm tắt nhanh:
```
pull → code → commit → pull → push
```
