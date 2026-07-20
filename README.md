# RAG CIC — Phase 1

Nền tảng monorepo cho chatbot tư vấn khách hàng. Phase 1 cung cấp FastAPI, Next.js App Router, JWT/RBAC, PostgreSQL + pgvector, Redis, MinIO, Celery worker/beat, Nginx và migration Alembic. Repo hiện cũng có một số module sản phẩm và tài liệu đang được phát triển cho các phase sau.

## Kiến trúc và cây thư mục

```text
rag_cic/
├── backend/
│   ├── alembic/versions/       # migration có phiên bản
│   ├── app/
│   │   ├── api/routes/         # auth, health và API modules
│   │   ├── cli/                # lệnh tạo admin
│   │   ├── core/               # config, security, logging, exceptions
│   │   ├── db/                 # SQLAlchemy async và Redis
│   │   ├── models/             # SQLAlchemy models
│   │   ├── repositories/       # truy cập dữ liệu
│   │   ├── schemas/            # Pydantic DTO
│   │   ├── services/           # nghiệp vụ
│   │   └── tasks/              # Celery app và tasks
│   └── tests/
├── frontend/
│   ├── public/
│   └── src/
│       ├── app/                # Next.js App Router
│       ├── components/         # UI và forms
│       └── lib/                # API, auth, query client, validators
├── nginx/nginx.conf
├── compose.yaml
├── .env.example
└── Makefile
```

Nginx là cổng HTTP duy nhất. `/api/*`, `/health`, `/ready`, `/metrics` và tài liệu OpenAPI được chuyển tới FastAPI; các route còn lại tới Next.js. Backend dùng SQLAlchemy async với PostgreSQL; Redis làm cache/broker; Celery worker và beat dùng chung image backend; MinIO lưu object.

## Yêu cầu

- Docker Engine 24+ và Docker Compose v2+
- Nếu chạy ngoài container: Python 3.11+ và Node.js 20.19+

## Cấu hình và khởi chạy

```bash
cp .env.example .env
# Đổi SECRET_KEY, POSTGRES_PASSWORD, MINIO_ROOT_PASSWORD và ADMIN_PASSWORD
docker compose config
docker compose up --build -d
docker compose ps
```

Trên PowerShell, dùng `Copy-Item .env.example .env`. Compose tự cấu hình backend kết nối service `postgres` và `redis`; `DATABASE_URL` trong `.env` dành cho lệnh chạy trực tiếp trên máy host.

Ứng dụng: `http://localhost`; OpenAPI: `http://localhost/docs`. `/health` là liveness; `/ready` kiểm tra PostgreSQL và Redis; `/metrics` xuất định dạng Prometheus.

## Migration và tài khoản admin

Backend tự chạy `alembic upgrade head` khi khởi động. Có thể chạy thủ công:

```bash
docker compose run --rm backend alembic upgrade head
docker compose run --rm backend alembic current
docker compose run --rm backend python -m app.cli.create_admin
```

Lệnh tạo admin đọc `ADMIN_EMAIL` và `ADMIN_PASSWORD` từ `.env`, có tính idempotent. Không có mật khẩu production hardcode.

Authentication:

- `POST /api/v1/auth/login`: cấp access và refresh token.
- `POST /api/v1/auth/refresh`: xoay token.
- `POST /api/v1/auth/logout`: thu hồi refresh token qua Redis.
- `GET /api/v1/auth/me`: hồ sơ người dùng hiện tại.

RBAC gồm `admin`, `manager`, `employee`; khách hàng không cần đăng nhập để dùng chat ở phase tương ứng.

## Kiểm thử

```bash
docker compose run --rm backend python -m pytest -q
docker compose run --rm backend ruff check app tests
docker compose run --rm frontend npm test
docker compose run --rm frontend npm run lint
docker compose run --rm frontend npm run build
```

Chạy local backend: `cd backend && pip install -e ".[dev]" && uvicorn app.main:app --reload`. Chạy frontend: `cd frontend && npm install && npm run dev`.

## Quy trình dữ liệu ở các phase kế tiếp

- Import sản phẩm: trang `/admin/products`, endpoint import Excel và pipeline preview/confirm sẽ được hoàn thiện ở Phase 2.
- Upload tài liệu: trang `/admin/documents`, lưu MinIO và Celery indexing được hoàn thiện ở Phase 3.
- Lead/export Excel, chat streaming và dashboard hoàn chỉnh thuộc Phase 4–5.

## Đồng bộ Google Sheets và Drive mỗi 60 giây

1. Tạo Google service account, bật Google Drive API và Google Sheets API.
2. Chia sẻ spreadsheet và thư mục Drive cho email của service account ở quyền Viewer.
3. Lưu JSON key tại `secrets/google-service-account.json` (thư mục này bị Git bỏ qua).
4. Cấu hình `.env`:

```env
GOOGLE_SYNC_ENABLED=true
GOOGLE_SYNC_INTERVAL_SECONDS=60
GOOGLE_SERVICE_ACCOUNT_FILE=/app/secrets/google-service-account.json
GOOGLE_PRODUCT_SPREADSHEET_ID=<spreadsheet-id-san-pham>
GOOGLE_SPREADSHEET_ID=<file-id-danh-muc-phap-ly>
GOOGLE_DRIVE_FOLDER_ID=<folder-id-chua-pdf-docx>
GEMINI_API_KEY=<gemini-api-key>
GEMINI_EMBEDDING_MODEL=gemini-embedding-2
GEMINI_EMBEDDING_DIMENSIONS=768
```

Celery Beat phát tín hiệu mỗi 60 giây. Worker so sánh phiên bản spreadsheet và `modifiedTime`
của file Drive; dữ liệu không thay đổi sẽ được bỏ qua. PDF, DOCX, TXT và Google Docs mới hoặc
được chỉnh sửa sẽ được lưu vào MinIO, sau đó tách đoạn và embedding bằng Gemini 768 chiều.
Upload thủ công tại `/admin/documents` và `POST /api/v1/documents/upload` vẫn hoạt động độc lập.

## Hierarchical hybrid RAG

Tài liệu mới hoặc được reindex đi qua pipeline:

```text
Trích xuất toàn văn
→ chia theo Chương/Điều/Khoản
→ embedding cấp tài liệu
→ embedding từng chunk
→ metadata vector shortlist
→ keyword + vector search trong tài liệu ứng viên
→ Reciprocal Rank Fusion
→ tối đa 8 chunks / 24.000 ký tự context
→ trả lời có citation
```

File và chunk có checksum để nhận diện nội dung. PostgreSQL có GIN full-text index cho fallback
keyword search. Reindex một tài liệu MinIO bằng `POST /api/v1/documents/{id}/reindex`; tài liệu
không đổi trên Drive vẫn được bỏ qua trong lịch đồng bộ.

## Triển khai production

- Không commit `.env`; dùng secret manager và secret ngẫu nhiên tối thiểu 32 ký tự.
- Đổi toàn bộ mật khẩu mặc định, giới hạn CORS đúng domain, terminate TLS tại load balancer/Nginx.
- Không public PostgreSQL, Redis hoặc MinIO; chỉ Nginx cần public.
- Chạy Alembic như release job trước rollout, tránh nhiều replica cùng migrate.
- Sao lưu volume PostgreSQL/MinIO, thu thập structured logs và scrape `/metrics`.
- Refresh-token deny-list nâng cao, Sentry và OpenTelemetry được harden ở Phase 6.

## API documentation

Khi stack chạy, Swagger UI ở `/docs`, ReDoc ở `/redoc`, schema ở `/openapi.json`. Tài khoản demo không được tạo mặc định; dùng lệnh `create_admin` với thông tin trong `.env` cho môi trường phát triển.
