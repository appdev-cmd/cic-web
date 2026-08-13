# Vấn đề PostgreSQL cần xử lý — FK Tin tức

> Trạng thái: Danh sách lỗi cần xử lý riêng; chưa sửa schema hoặc viết migration.  
> Phạm vi: Chỉ các khóa ngoại của bài viết và danh mục Tin tức.

## Vấn đề 1: `cic_news.category_id` chưa có FK

Schema hiện tại khai báo:

```text
category_id integer
```

Comment nói đây là FK nhưng DDL không có `REFERENCES`. PostgreSQL vì vậy vẫn cho phép bài viết VI trỏ tới một danh mục không tồn tại.

Đích dự kiến sau khi đối soát dữ liệu:

```text
cic_news.category_id → cic_news_categories.id
```

## Vấn đề 2: `cic_news_en.category_id` chưa có FK

Tương tự bảng VI, bài viết EN chưa được database ràng buộc với danh mục EN.

Đích dự kiến:

```text
cic_news_en.category_id → cic_news_categories_en.id
```

Không trỏ bài EN sang danh mục VI vì hai workspace độc lập.

## Vấn đề 3: parent danh mục EN trỏ sai bảng

Schema hiện tại:

```text
cic_news_categories_en.parent_id
  → cic_news_categories.id
```

Đây là tham chiếu chéo EN → VI. Đích đúng theo mô hình workspace độc lập:

```text
cic_news_categories_en.parent_id
  → cic_news_categories_en.id
```

`cic_news_categories.parent_id` tự trỏ về `cic_news_categories.id` là đúng.

## Phải kiểm tra trước khi thêm/sửa FK

Không thêm constraint ngay khi chưa kiểm tra dữ liệu legacy. Cần báo cáo riêng các trường hợp:

- `category_id = 0` hoặc giá trị sentinel khác.
- Bài viết có `category_id` không tồn tại.
- Danh mục có `parent_id` không tồn tại.
- Danh mục tự làm cha của chính nó.
- Chu trình nhiều cấp trong cây danh mục.
- ID danh mục EN đang phụ thuộc ID VI do logic cũ.
- Bản ghi có `NULL` và quy tắc nghiệp vụ có cho phép không.

## Quy tắc xử lý dữ liệu lỗi

- Sentinel `0` của parent gốc: chuyển thành `NULL`.
- Category mồ côi: lập báo cáo để map về danh mục hợp lệ; không tự đoán.
- Parent mồ côi: chuyển `NULL` chỉ sau khi được xác nhận.
- Chu trình cây: dừng migrate các dòng liên quan và báo cáo.
- Không tạo danh mục giả trong production chỉ để vượt FK nếu chưa được phê duyệt dữ liệu.

## Hành vi xóa đề xuất

Phải chốt trước khi viết DDL:

- Xóa danh mục đang có bài viết: backend chặn và yêu cầu chuyển bài sang danh mục khác.
- Xóa danh mục cha đang có danh mục con: backend chặn hoặc yêu cầu chọn parent mới.
- Không dùng cascade để xóa hàng loạt bài viết khi xóa danh mục.

Với các quy tắc trên, FK bài → danh mục không nên `ON DELETE CASCADE`. Parent category có thể `ON DELETE SET NULL` ở tầng database, nhưng backend vẫn nên chặn để người dùng chủ động xử lý cây.

## Thứ tự xử lý

1. Chạy lại migration/export report theo schema hiện hành.
2. Viết truy vấn kiểm tra orphan, sentinel và cycle.
3. Xuất báo cáo dữ liệu lỗi để review.
4. Chốt cách map/sửa từng nhóm dữ liệu.
5. Sửa schema PostgreSQL.
6. Sinh lại `manifest.json` nếu schema/mapping thay đổi.
7. Chạy migrate trên database staging rỗng.
8. Đối soát số dòng VI/EN và kiểm thử create/update/delete category.

## Điều kiện hoàn thành

- Không còn bài VI/EN trỏ tới category không tồn tại.
- Parent category EN chỉ trỏ trong cây EN.
- Không có self-reference hoặc cycle.
- Xóa danh mục không làm cascade mất bài viết.
- Migration report không còn lỗi ở bốn bảng news/category chính.
- Backend và database áp dụng cùng quy tắc xóa/chuyển danh mục.
