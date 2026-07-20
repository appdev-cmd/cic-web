from io import BytesIO
from minio import Minio
from app.core.config import settings

# Khởi tạo MinIO client
# Chú ý: Lấy endpoint từ config. Nếu chạy local bên ngoài Docker, 
# có thể dùng 'localhost:9000' bằng cách cấu hình file .env
minio_client = Minio(
    endpoint=settings.MINIO_ENDPOINT,
    access_key=settings.MINIO_ROOT_USER,
    secret_key=settings.MINIO_ROOT_PASSWORD,
    secure=False,  # Để chạy HTTP cục bộ trong dev
)


def ensure_bucket_exists(bucket_name: str) -> None:
    """Tạo bucket nếu chưa tồn tại."""
    if not minio_client.bucket_exists(bucket_name):
        minio_client.make_bucket(bucket_name)


def upload_document(bucket_name: str, object_name: str, file_data: bytes, content_type: str = "application/pdf") -> str:
    """Tải tệp tin lên MinIO và trả về tên object."""
    ensure_bucket_exists(bucket_name)
    data_stream = BytesIO(file_data)
    minio_client.put_object(
        bucket_name=bucket_name,
        object_name=object_name,
        data=data_stream,
        length=len(file_data),
        content_type=content_type,
    )
    return object_name


def get_document_data(bucket_name: str, object_name: str) -> bytes:
    """Tải tệp từ MinIO về dưới dạng bytes."""
    response = minio_client.get_object(bucket_name, object_name)
    try:
        return response.read()
    finally:
        response.close()
        response.release_conn()


def get_presigned_download_url(bucket_name: str, object_name: str, expires_seconds: int = 3600) -> str:
    """Tạo đường dẫn chia sẻ file tạm thời (presigned URL)."""
    # Nếu kết nối qua hostname 'minio:9000' (trong docker network), khi click từ browser ngoài máy host
    # link sẽ lỗi. Do đó, nếu endpoint là 'minio:9000', chúng ta có thể convert sang 'localhost:9000' 
    # để browser ngoài máy host truy cập được qua Nginx hoặc cổng mapping.
    # Tuy nhiên, để đơn giản, ta tạo link sử dụng domain cấu hình.
    return minio_client.presigned_get_object(
        bucket_name=bucket_name,
        object_name=object_name,
        expires=expires_seconds
    )
