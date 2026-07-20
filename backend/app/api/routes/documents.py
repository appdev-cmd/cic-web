import uuid
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import require_roles
from app.db.session import get_db
from app.models.user import User, UserRole
from app.models.document_upload import Document
from app.services.minio_client import upload_document, minio_client
from app.tasks.indexing import process_document_task

router = APIRouter(prefix="/documents", tags=["documents"])


@router.get("/")
async def list_documents(
    skip: int = 0,
    limit: int = 50,
    session: AsyncSession = Depends(get_db),
    _: User = Depends(require_roles(UserRole.ADMIN, UserRole.MANAGER)),
):
    """Lấy danh sách các tài liệu đã tải lên kèm trạng thái lập chỉ mục."""
    stmt = select(Document).offset(skip).limit(limit).order_by(Document.created_at.desc())
    result = await session.execute(stmt)
    docs = result.scalars().all()
    
    return [
        {
            "id": str(d.id),
            "filename": d.filename,
            "file_path": d.file_path,
            "status": d.status,
            "error_message": d.error_message,
            "document_number": d.document_number,
            "legal_title": d.legal_title,
            "issue_date": d.issue_date.isoformat() if d.issue_date else None,
            "expiration_date": d.expiration_date.isoformat() if d.expiration_date else None,
            "signer": d.signer,
            "ocr_used": d.ocr_used,
            "created_at": d.created_at.isoformat(),
            "updated_at": d.updated_at.isoformat(),
        }
        for d in docs
    ]


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    session: AsyncSession = Depends(get_db),
    _: User = Depends(require_roles(UserRole.ADMIN)),
):
    """Tải tệp PDF/Word/TXT lên MinIO và bắt đầu tác vụ Celery xử lý trích xuất văn bản."""
    ext = file.filename.lower().split(".")[-1]
    if ext not in ("pdf", "docx", "doc", "txt"):
        raise HTTPException(
            status_code=400,
            detail="Định dạng tệp không được hỗ trợ. Chỉ chấp nhận .pdf, .docx, .doc, .txt",
        )

    # 1. Đọc nội dung tệp tin
    file_bytes = await file.read()
    if not file_bytes:
        raise HTTPException(status_code=400, detail="Tệp tin rỗng.")

    # 2. Định nghĩa tên object duy nhất trên MinIO để tránh trùng lặp
    unique_filename = f"{uuid.uuid4()}_{file.filename}"

    try:
        # 3. Tải lên MinIO
        upload_document(
            bucket_name="documents",
            object_name=unique_filename,
            file_data=file_bytes,
            content_type=file.content_type or "application/octet-stream",
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Lỗi khi tải tệp lên kho lưu trữ MinIO: {str(e)}"
        )

    # 4. Ghi nhận tài liệu vào Database
    doc = Document(
        filename=file.filename,
        file_path=unique_filename,
        status="pending",
    )
    session.add(doc)
    await session.commit()
    await session.refresh(doc)

    # 5. Kích hoạt Celery Task chạy ngầm lập chỉ mục
    process_document_task.delay(str(doc.id))

    return {
        "status": "success",
        "message": f"Tải lên tệp {file.filename} thành công. Tiến trình lập chỉ mục đã được kích hoạt chạy ngầm.",
        "document": {
            "id": str(doc.id),
            "filename": doc.filename,
            "status": doc.status,
        },
    }


@router.get("/status/{document_id}")
async def get_document_status(
    document_id: str,
    session: AsyncSession = Depends(get_db),
    _: User = Depends(require_roles(UserRole.ADMIN, UserRole.MANAGER)),
):
    """Xem chi tiết trạng thái lập chỉ mục của một tài liệu."""
    try:
        doc_uuid = uuid.UUID(document_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Mã tài liệu không hợp lệ.")

    doc = await session.get(Document, doc_uuid)
    if not doc:
        raise HTTPException(status_code=404, detail="Không tìm thấy tài liệu.")

    return {
        "id": str(doc.id),
        "filename": doc.filename,
        "status": doc.status,
        "error_message": doc.error_message,
        "document_number": doc.document_number,
        "legal_title": doc.legal_title,
        "issue_date": doc.issue_date.isoformat() if doc.issue_date else None,
        "expiration_date": doc.expiration_date.isoformat() if doc.expiration_date else None,
        "signer": doc.signer,
        "ocr_used": doc.ocr_used,
        "created_at": doc.created_at.isoformat(),
        "updated_at": doc.updated_at.isoformat(),
    }


@router.post("/{document_id}/reindex", status_code=202)
async def reindex_document(
    document_id: str,
    session: AsyncSession = Depends(get_db),
    _: User = Depends(require_roles(UserRole.ADMIN)),
):
    """Queue one MinIO-backed document for hierarchical reindexing."""
    try:
        document_uuid = uuid.UUID(document_id)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Mã tài liệu không hợp lệ") from exc
    document = await session.get(Document, document_uuid)
    if document is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy tài liệu")
    if document.source not in {"manual", "google_drive"}:
        raise HTTPException(
            status_code=409,
            detail="Tài liệu nguồn này phải được đồng bộ lại từ Google Sheet",
        )
    document.status = "pending"
    document.error_message = None
    await session.commit()
    process_document_task.delay(str(document.id))
    return {"id": str(document.id), "status": "pending"}


@router.delete("/{document_id}")
async def delete_document(
    document_id: str,
    session: AsyncSession = Depends(get_db),
    _: User = Depends(require_roles(UserRole.ADMIN)),
):
    """Xóa tài liệu khỏi database và MinIO, đồng thời xóa các phân mảnh chunks tương ứng (cascade)."""
    try:
        doc_uuid = uuid.UUID(document_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Mã tài liệu không hợp lệ.")

    doc = await session.get(Document, doc_uuid)
    if not doc:
        raise HTTPException(status_code=404, detail="Không tìm thấy tài liệu.")

    # 1. Xóa file khỏi MinIO
    try:
        if minio_client.bucket_exists("documents"):
            minio_client.remove_object("documents", doc.file_path)
    except Exception as e:
        print(f"Error removing object {doc.file_path} from MinIO: {e}")

    # 2. Xóa trong database (các document_chunks liên kết sẽ tự động bị xóa qua CASCADE)
    await session.delete(doc)
    await session.commit()

    return {"status": "success", "message": f"Đã xóa tài liệu {doc.filename} thành công."}
