import asyncio
import os
import sqlite3
from app.db.session import async_session_factory
from app.models.document import LegalDocument

# Đường dẫn mặc định đến file SQLite cũ của người dùng
SQLITE_DB_PATH = "legal_search.db"


async def migrate_sqlite_to_supabase() -> None:
    if not os.path.exists(SQLITE_DB_PATH):
        print(f"File SQLite '{SQLITE_DB_PATH}' không tồn tại. Vui lòng đặt file SQLite của bạn vào thư mục gốc dự án.")
        return

    print(f"Bắt đầu đọc dữ liệu từ {SQLITE_DB_PATH}...")
    conn = sqlite3.connect(SQLITE_DB_PATH)
    cursor = conn.cursor()

    # Kiểm tra các bảng trong SQLite
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [t[0] for t in cursor.fetchall()]
    print(f"Các bảng tìm thấy trong file SQLite cũ: {tables}")

    # Giả định bảng chứa dữ liệu là 'documents' hoặc 'legal_documents'
    target_table = "documents" if "documents" in tables else (tables[0] if tables else None)
    if not target_table:
        print("Không tìm thấy bảng dữ liệu nào trong file SQLite cũ.")
        conn.close()
        return

    print(f"Đọc dữ liệu từ bảng '{target_table}'...")
    cursor.execute(f"SELECT * FROM {target_table}")
    rows = cursor.fetchall()
    columns = [desc[0] for desc in cursor.description]
    print(f"Tìm thấy {len(rows)} bản ghi. Cột gồm có: {columns}")

    # Ánh xạ các cột (sử dụng vị trí index của cột tương ứng)
    title_idx = columns.index("title") if "title" in columns else 0
    content_idx = columns.index("content") if "content" in columns else 1
    drive_id_idx = columns.index("drive_file_id") if "drive_file_id" in columns else -1
    embedding_idx = columns.index("embedding") if "embedding" in columns else -1

    async with async_session_factory() as session:
        count = 0
        for row in rows:
            title = row[title_idx]
            content = row[content_idx]
            drive_file_id = row[drive_id_idx] if drive_id_idx != -1 else None
            
            # Xử lý embedding blob/string nếu có
            embedding = None
            if embedding_idx != -1 and row[embedding_idx] is not None:
                # Tùy thuộc vào cách cũ lưu trữ (ví dụ list float dạng text hoặc blob)
                raw_embed = row[embedding_idx]
                if isinstance(raw_embed, bytes):
                    # Nếu là blob, bạn có thể giải mã tùy thuộc định dạng (e.g. numpy)
                    pass
                elif isinstance(raw_embed, str):
                    try:
                        # Thử parse JSON list float
                        import json
                        embedding = json.loads(raw_embed)
                    except Exception:
                        pass

            doc = LegalDocument(
                title=title,
                content=content,
                drive_file_id=drive_file_id,
                embedding=embedding
            )
            session.add(doc)
            count += 1
            if count % 100 == 0:
                await session.flush()

        await session.commit()
        print(f"Đã di chuyển thành công {count} tài liệu sang Supabase PostgreSQL.")

    conn.close()


if __name__ == "__main__":
    asyncio.run(migrate_sqlite_to_supabase())
