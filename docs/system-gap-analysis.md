# Phân tích hiện trạng và khoảng cách hệ thống RAG CIC

> Ngày audit: 20/07/2026  
> Phạm vi: đọc mã nguồn, cấu hình, migration, test và các skill trong `.codex/skills`; chưa sửa mã tính năng.  
> Trạng thái dùng trong báo cáo: **Có**, **Một phần**, **Chưa có**, **Có nhưng chưa được nối vào hệ thống**.

## 1. Kết luận điều hành

RAG CIC hiện là một nền tảng kỹ thuật chạy được ở mức MVP: có đăng nhập JWT, ba vai trò, import/tìm kiếm sản phẩm, upload/index tài liệu, đồng bộ Google, truy vấn RAG pháp lý, health/readiness/metrics và bốn màn hình quản trị cơ bản. Tuy nhiên, hệ thống chưa đạt mức sẵn sàng vận hành theo yêu cầu mới.

Các khoảng cách nghiêm trọng nhất:

1. Refresh token chưa xoay vòng thực sự; logout frontend không gọi API thu hồi token; route quản trị chưa được bảo vệ.
2. Phân quyền chỉ dừng ở role, chưa có permission và data scope.
3. Các model conversation, lead, handoff, audit và prompt version đã tồn tại nhưng chưa có API/service/frontend.
4. RAG mới là một pipeline pháp lý đơn giản; chưa có intent router, pipeline sản phẩm/mixed/fallback, reranker, kiểm tra đủ ngữ cảnh, kiểm chứng citation và grounding.
5. Tài liệu và sản phẩm thiếu CRUD/vòng đời/versioning; upload/import kiểm tra file chưa đủ an toàn.
6. Chưa có evaluation harness, observability nghiệp vụ, backup/restore, CI/CD và kiểm thử E2E/accessibility.
7. Docker buộc backend phụ thuộc PostgreSQL nội bộ dù `DATABASE_URL` có thể trỏ Supabase; migration chạy lúc mỗi backend khởi động; Celery chạy bằng root.

## 2. Kiến trúc hiện tại

```text
Browser / Next.js
       |
       v
Nginx :80 ----> FastAPI :8000 ----> PostgreSQL + pgvector
                    |  |                 (local hoặc Supabase qua DATABASE_URL)
                    |  +------------> Redis
                    +---------------> MinIO
                    +---------------> Gemini Embedding / OpenAI hoặc Gemini LLM
                    |
                    +--> Celery queue --> Worker --> indexing / Google sync
                                      --> Beat   --> lịch đồng bộ
```

### Bản đồ module

| Lớp | Hiện có | Nhận xét |
|---|---|---|
| Frontend | Login, dashboard placeholder, products, documents, chat | Không có middleware/route guard, refresh interceptor, 403, user/lead/prompt/job/audit UI |
| API | auth, products, documents, RAG, health | Chưa có API users, categories, brands, conversations, feedback, leads, handoff, prompts, audit, jobs, settings |
| Service | auth, embedding, LLM, parsing tài liệu, retrieval, MinIO | `agents`, `rag`, `prompts`, `tools` mới chỉ là package rỗng |
| Data | users, products, categories, legal_documents, documents/chunks, conversations/messages, leads/handoffs, audit_logs, prompt_versions | Nhiều bảng mới chỉ là schema, chưa có luồng nghiệp vụ |
| Jobs | Celery indexing, Google sync | Thiếu job registry/progress/retry API/dead-letter/monitoring |
| Operations | Compose, Nginx, health, readiness, Prometheus endpoint | Thiếu dashboard/alerts/tracing/backup/restore/CI |

## 3. Chức năng đã hoàn thiện tương đối

- Đăng nhập email/mật khẩu; phát access và refresh JWT.
- Hash mật khẩu và kiểm tra loại token.
- Kiểm tra `admin`, `manager`, `employee` ở backend; một số thao tác ghi giới hạn admin.
- Danh sách sản phẩm, import Excel dạng upsert, keyword search, vector search và RRF.
- Upload PDF/DOC/DOCX/TXT lên MinIO; queue Celery; trích xuất và chunk theo Chương/Điều/Khoản; embedding 768 chiều.
- Danh sách, trạng thái, reindex API và xóa tài liệu.
- Đồng bộ Google Sheets/Drive có khóa Redis và kiểm tra phiên bản nguồn ở một phần luồng.
- RAG trả lời pháp lý, trả danh sách nguồn cùng page/chapter/article/clause khi có.
- `/health`, `/ready` và `/metrics`.
- Frontend build thành công; lint thành công; 2 unit test frontend thành công.

## 4. Chức năng có model nhưng chưa có API

| Model | Có trong DB | Thiếu |
|---|---:|---|
| ProductCategory | Có | CRUD, cây cha-con, disable, thống kê, ràng buộc khi xóa |
| Conversation / Message | Có | Repository, service, API lịch sử, lưu message/citation, UI |
| CustomerLead / LeadStatusHistory | Có | Validation, CRUD/assign/status/note/export, UI CRM |
| HumanHandoff | Có | Rule engine, queue/assign/resolve, thông báo và UI |
| AuditLog | Có | Writer thống nhất, API tra cứu/export, retention, UI |
| PromptVersion | Có | Draft/publish/rollback/test/approval, API và UI |

Không có model riêng cho permission, role-permission, refresh session/token hash, brand, citation, feedback, document version, index version, job execution và backup record.

## 5. Chức năng có API nhưng chưa có frontend

- `POST /auth/refresh` và `POST /auth/logout` không được tích hợp vào client.
- `POST /documents/{id}/reindex` không có nút/luồng UI.
- `/health`, `/ready`, `/metrics` không có operations dashboard.
- OpenAPI có các schema ProductCreate/ProductUpdate nhưng chưa có route CRUD tương ứng.

## 6. Frontend hiện có nhưng chưa hoàn chỉnh

- Admin layout không kiểm tra đăng nhập hay quyền; truy cập trực tiếp `/admin/*` vẫn render.
- Logout chỉ xóa Web Storage, không thu hồi refresh token.
- Access token ở `sessionStorage`, refresh token ở `localStorage`; tăng bề mặt rủi ro XSS và không có quản lý session/device.
- API client không tự refresh khi 401 và không điều hướng login khi phiên hỏng.
- Dashboard chỉ là placeholder.
- Products: chỉ list/search/import; không pagination/filter/sort/CRUD/bulk/export/preview import.
- Documents: chỉ list/upload/hard delete; không metadata/preview/download/retry/reindex UI/soft-delete/version/log.
- Chat: trạng thái trong bộ nhớ trình duyệt; không history, feedback, regenerate, lead/handoff; nguồn chưa được kiểm chứng hậu sinh.
- Chỉ có hai component UI tự xây (`Button`, `Input`), chưa có hệ thống shadcn đầy đủ hoặc design tokens.
- Một số nút chỉ có icon không có accessible name; input chat/search thiếu label; focus/keyboard/touch target/contrast chưa được audit bằng browser.

## 7. Ma trận khoảng cách theo yêu cầu

| Giai đoạn yêu cầu | Trạng thái | Bằng chứng/tóm tắt khoảng cách |
|---|---|---|
| 1. Auth & permission | Một phần | Login/JWT/role có; logout client, rotation/reuse detection, session hash/device, permission/data scope, route guard chưa có |
| 2. Users | Chưa có | Chỉ có model và read schema; repository chỉ get-by-id/email |
| 3. Product CRUD/import | Một phần | List/search/import có; CRUD, soft delete, restore, reindex status, import preview/modes/errors chưa có |
| 4. Category/brand | Một phần | Category model tối thiểu; không API; brand chỉ là chuỗi trên product |
| 5. Documents | Một phần | Upload/index/list/reindex/delete có; metadata/lifecycle/version/security/progress thiếu |
| 6. RAG architecture | Một phần | Hybrid chunk retrieval + RRF cơ bản; không router/pipelines/reranker/sufficiency/citation validation |
| 7. Index versioning | Chưa có | Chỉ vector trực tiếp trên record; overwrite khi reindex |
| 8. Conversation | Có nhưng chưa nối | Model tồn tại; không lưu từ API RAG, không citation model/API/UI |
| 9. Feedback | Chưa có | Không model/API/UI/review flow |
| 10. Evaluation | Chưa có | Không có thư mục/dataset/runner/report |
| 11. Handoff/CRM | Có nhưng chưa nối | Model lead/handoff/history có; không nghiệp vụ/API/UI |
| 12. Dashboard | Chưa có | Page placeholder |
| 13. Celery management | Một phần | Worker/Beat/task có; không job model/API/UI/DLQ/progress |
| 14. Google sync | Một phần | Sync có; luồng trùng lặp, thiếu quản trị cấu hình/status/log/retry UI |
| 15. Prompt management | Có nhưng chưa nối | Model tối thiểu; prompt vẫn hard-code trong route/service |
| 16. Audit log | Có nhưng chưa nối | Model tối thiểu; không ghi sự kiện |
| 17. RAG/upload security | Chưa đạt | Extension-only, đọc toàn file, không malware/size/MIME/signature/prompt-injection guard |
| 18. Backup/restore | Chưa có | Không script/runbook/test restore |
| 19. Observability | Một phần | Process metrics/health có; thiếu request ID, tracing, SLO, business/RAG/job metrics, alerts |
| 20. UX/accessibility | Một phần | UI cơ bản responsive cục bộ; chưa có design system, E2E và accessibility audit hoàn chỉnh |
| 24. Tests | Một phần | Backend có unit/API tests nhưng môi trường host thiếu `PyJWT`; frontend chỉ có 2 validator tests |
| 25. CI/CD | Chưa có | Không thấy workflow/pipeline |

## 8. Lỗi và rủi ro bảo mật

### P0/P1

- Refresh endpoint phát token mới nhưng không thu hồi token vừa dùng; không phát hiện reuse, không session family, không lưu hash.
- Logout frontend không gọi backend; refresh token cũ tiếp tục dùng được.
- Admin routes không có frontend guard; quyền cuối cùng vẫn dựa backend nhưng UX và session flow sai.
- Upload/import chỉ tin extension; không giới hạn dung lượng, số trang, MIME/signature, malware; đọc toàn file vào RAM.
- Exception nội bộ được trả/lưu bằng `str(exc)`, có thể lộ chi tiết provider/hạ tầng.
- Gemini API key được đặt trong query URL ở LLM client, dễ lọt vào log/proxy trace.
- MinIO client cố định `secure=False`; dev credentials có giá trị mặc định; production validation chưa kiểm tra các secret này.
- Không rate limit riêng cho login, refresh, upload, import và RAG; Nginx chỉ có ngưỡng toàn cục.
- Không có prompt-injection defense, authorization filter theo visibility/department và output/citation validation.

### P2

- Security headers thiếu CSP, HSTS và Permissions-Policy.
- Không có request/trace ID và generic exception sanitization thống nhất.
- Access/refresh token lưu trong Web Storage, cần threat model rõ hoặc chuyển refresh token sang HttpOnly Secure SameSite cookie.
- Không audit hành vi nhạy cảm; không giới hạn đăng nhập sai; không quản lý phiên đang hoạt động.
- CORS example chỉ định localhost nhưng cấu hình production chưa có cơ chế allowlist bắt buộc.

## 9. Lỗi luồng nghiệp vụ và dữ liệu

- Product import tái tạo embedding mọi lần, kể cả khi nội dung tìm kiếm không đổi; xử lý tuần tự, thiếu batch và báo lỗi theo dòng.
- `.xls` được chấp nhận trong UI/API nhưng parser dùng `openpyxl`, không hỗ trợ định dạng Excel cũ đúng nghĩa.
- Upload MinIO rồi mới ghi DB có thể để object mồ côi khi DB lỗi; hard delete làm mất khả năng restore.
- Hai nguồn dữ liệu pháp lý (`legal_documents` và `documents/document_chunks`) tồn tại song song, ownership/canonical source chưa rõ.
- Google sync có nhiều đường triển khai trùng lặp; một CLI giới hạn cứng 5 file và dùng `file_path` không nhất quán với MinIO.
- Indexing xóa chunk cũ trước khi tạo index mới; nếu job hỏng không có phiên bản ổn định để rollback.
- Embedding gọi tuần tự từng chunk; không batch, checkpoint, idempotency key hoặc giới hạn retry cấp job.
- Celery task lưu lỗi nhưng chưa có progress/current step/task ID/started/completed/retry count.
- Category vừa tồn tại dạng chuỗi legacy vừa có `category_id`; chưa có kế hoạch chuẩn hóa.

## 10. Lỗi chất lượng RAG

- Không phân loại `legal/product/mixed/lead/general/unsupported`.
- Không normalize query/entity extraction/metadata filter/exact-match boost.
- RRF dùng hằng số và top-k cố định; không reranker, diversity cap hay dynamic top-k.
- Dùng `hash()` tiến trình để deduplicate; không ổn định giữa process và chưa phát hiện near-duplicate.
- Không mở rộng parent/neighbor chunk; metadata thiếu parent/previous/next/page range/index version.
- Không áp threshold để quyết định thiếu ngữ cảnh; có thể gọi LLM khi retrieval yếu.
- Không lọc visibility/department/effective status.
- LLM service biến lỗi provider thành chuỗi câu trả lời thay vì error có kiểu.
- Không lưu prompt/model/token/latency/trace/citation cho từng message.
- Không kiểm tra citation tồn tại, citation completeness, hallucinated article/document number hay groundedness.
- Không có dataset/metrics/baseline nên không thể chứng minh cải tiến.

## 11. Lỗi vận hành

- `compose.yaml` và `docker-compose.yml` cùng tồn tại, Docker cảnh báo và chọn một file ngầm định.
- Backend phụ thuộc health của PostgreSQL local kể cả khi dùng Supabase ngoài Compose; gây lỗi khởi động giả.
- Backend tự chạy Alembic mỗi lần container start, không an toàn khi scale nhiều replica.
- Worker chạy root; chưa có resource limits, restart policy rõ cho mọi service, dead-letter hoặc Flower/job UI.
- Readiness chỉ kiểm tra DB/Redis, chưa kiểm tra MinIO/provider/queue ở mức phù hợp.
- Không có backup Postgres/MinIO/Redis config, restore drill, retention và mã hóa backup.
- Không có structured logging chuẩn, distributed tracing, alert rule, SLO/error budget hoặc chi phí LLM.
- Không có CI/CD; backend test host hiện chưa chạy do thiếu dependency `jwt` trong môi trường hiện tại.

## 12. Kết quả kiểm chứng Phase audit

| Kiểm tra | Kết quả |
|---|---|
| Frontend unit test | Pass: 1 file, 2 test |
| Frontend ESLint | Pass |
| Frontend production build | Pass; 7 route ứng dụng được tạo |
| Docker Compose config | Pass nhưng cảnh báo có hai compose file |
| Backend pytest | Chưa chạy được trên host: `ModuleNotFoundError: jwt` sau khi đã bổ sung `PYTHONPATH=.` |
| Browser E2E | Chưa thực hiện: chưa có test accounts/fixture ổn định và stack phụ thuộc DB đang chưa thống nhất local/Supabase |
| Accessibility runtime | Chưa thực hiện; source audit đã ghi nhận accessible-name/label/focus gaps |

## 13. File dự kiến sửa theo các phase sau

Danh sách này là dự kiến, cần thu hẹp lại trước mỗi phase:

- Auth/security: `backend/app/core/security.py`, `backend/app/api/deps.py`, `backend/app/api/routes/auth.py`, `backend/app/services/auth_service.py`, `frontend/src/lib/api.ts`, `frontend/src/lib/auth.ts`, admin middleware/layout/login.
- User/RBAC: model/schema/repository/service/routes mới cho sessions, permissions, users; các trang `frontend/src/app/admin/users/**`.
- Products/catalog: product/category/brand model, schemas, repository, routes, services và `frontend/src/app/admin/products/**`, categories/brands.
- Documents/jobs: document models/routes/indexing/MinIO, job models/services/routes và pages documents/jobs.
- RAG: `backend/app/rag/**`, `agents/**`, `prompts/**`, retrieval/LLM/embedding service, RAG route, conversation/citation/feedback.
- CRM: lead/handoff schemas/repositories/services/routes và pages leads/chat.
- Ops: compose, Nginx, Dockerfiles, logging/metrics/tracing, scripts backup/restore, CI workflows.
- UX: `.stitch/DESIGN.md`, shadcn primitives, globals/layout/pages, browser and accessibility tests.

## 14. Migration dự kiến

1. Auth sessions, refresh token hash/family/device/revocation; permissions, role-permission và data scopes.
2. User login/security metadata.
3. Product soft-delete/index metadata; categories tree/disabled; brands.
4. Legal document metadata, effective status, visibility/scope, versions và processing job fields.
5. Hierarchical chunk links và versioned embedding/index metadata.
6. Conversation/message extensions; citations và feedback.
7. Lead/handoff extensions, notes và consent.
8. Prompt lifecycle/approval; audit detail/trace/IP; generic job executions.

Mỗi migration cần `upgrade`, `downgrade`, backfill, index/constraint và kiểm thử trên bản sao dữ liệu trước production.

## 15. Test dự kiến bổ sung

- Unit/integration: refresh rotation/reuse/logout, permission/data scope, user/product/document CRUD, upload validation, job idempotency.
- RAG: router/entity extraction, retrieval filters, RRF/rerank, sufficiency/refusal, citation validation, outdated/restricted document, prompt injection.
- E2E: login/logout/expiry/403, import preview, upload/retry/reindex, chat/source/feedback/handoff/lead, job monitoring.
- Accessibility: axe + keyboard + screen reader smoke cho login/navigation/forms/tables/dialogs/chat.
- Operations: migration, backup/restore drill, readiness/dependency failure, worker retry/DLQ, load/latency.

## 16. Quyết định audit

Không nên triển khai đồng loạt. Phase tiếp theo phải bắt đầu bằng auth/session/RBAC, upload boundary và chuẩn hóa môi trường Docker/Supabase. Các tính năng RAG/CRM/UI lớn chỉ nên tiếp tục sau khi nền bảo mật, dữ liệu và test baseline ổn định.
