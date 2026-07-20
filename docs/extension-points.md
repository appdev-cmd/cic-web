# Các điểm mở rộng RAG CIC

## Nguyên tắc chung

Mỗi extension point dùng `Protocol` hoặc abstract base nhỏ, factory/registry tường minh và contract test chung. Chọn implementation bằng backend settings đã validate; không chọn từ request người dùng. Implementation phải map lỗi về typed domain error, có timeout và health semantics. Không tạo implementation chưa có use case; mock/noop chỉ phục vụ test hoặc fallback được định nghĩa.

## 1. LLM provider

- **Interface:** `generate(request) -> LLMResult`, `health_check()`; request gồm messages/system/model options, result gồm text/model/token/latency/provider metadata.
- **Hiện tại:** `services/llm_service.py` tự switch OpenAI/Gemini và trả chuỗi.
- **Implementation mới:** implement contract trong `core/ai/llm/<provider>.py`, đăng ký tên duy nhất, không lộ secret/log prompt mặc định.
- **Cấu hình:** `LLM_PROVIDER`; model/timeout/retry ở settings provider.
- **Test:** success, timeout, provider error mapping, empty response, token metadata, health, mock determinism.

## 2. Embedding provider

- **Interface:** `embed_text`, `embed_batch`, `dimension`, `health_check`.
- **Hiện tại:** `services/embedding_service.py`, Gemini 768, chỉ single text ở call sites.
- **Implementation mới:** validate vector finite/non-empty/dimension; batch có bounded concurrency.
- **Cấu hình:** provider/model/dimension/version/timeout/batch size.
- **Test:** dimension, batch order, empty/invalid input, rate limit/timeout, no empty vector, deterministic mock.

## 3. Reranker

- **Interface:** `rerank(query, candidates, limit) -> ranked candidates`, `health_check`.
- **Hiện tại:** chưa có; RRF score được dùng trực tiếp.
- **Implementation mới:** `noop` giữ thứ tự; provider thật phải giữ candidate IDs và score provenance.
- **Cấu hình:** provider/model/enabled/top_n/timeout; feature `rag_reranker`.
- **Test:** stable IDs, limit, empty candidates, failure fallback, deterministic noop.

## 4. Vector search

- **Interface:** `search(embedding, filters, limit, index_version) -> SearchHit[]`.
- **Hiện tại:** SQLAlchemy pgvector trong product repository và RAG retrieval service.
- **Implementation mới:** adapter pgvector trước; implementation khác phải hỗ trợ metadata filters và stable entity IDs.
- **Cấu hình:** backend/index/metric/probes/threshold.
- **Test:** ranking, filter isolation, dimension mismatch, threshold, index version, permission scope.

## 5. Keyword search

- **Interface:** `search(query, filters, limit) -> SearchHit[]`.
- **Hiện tại:** PostgreSQL `to_tsvector/plainto_tsquery` và product `ILIKE`.
- **Implementation mới:** tách legal/product adapter; normalize score về contract chung.
- **Cấu hình:** backend/language/config/candidate limit.
- **Test:** exact SKU/document number, Vietnamese text behavior, filters, escaping/injection, empty query.

## 6. File storage

- **Interface:** `upload`, `download`, `delete`, `exists`, `presign`, `health_check`.
- **Hiện tại:** global MinIO client trong `services/minio_client.py`.
- **Implementation mới:** MinIO adapter trước; local chỉ cho dev/test với path containment.
- **Cấu hình:** provider/endpoint/TLS/bucket/region/timeouts; credentials chỉ backend.
- **Test:** round-trip, exists/delete idempotency, missing object, path traversal, size/stream, health.

## 7. Document extractor

- **Interface:** `supports(mime, extension)`, `extract(stream, limits) -> ExtractedDocument`.
- **Hiện tại:** PDF/DOCX/TXT functions trong `document_processor.py`.
- **Implementation mới:** extractor riêng theo MIME; registry ưu tiên signature/MIME hơn extension.
- **Cấu hình:** allowed MIME, max bytes/pages/time, OCR policy.
- **Test:** valid/corrupt/encrypted/empty/oversized files, page metadata, timeout, resource limits.

## 8. Chunking strategy

- **Interface:** `chunk(extracted_document, config) -> Chunk[]` với hierarchy/position/checksum.
- **Hiện tại:** `split_legal_text` nhận diện Chương/Điều/Khoản và sliding chars.
- **Implementation mới:** legal/product/general strategies; không gọi embedding.
- **Cấu hình:** strategy/max chars/overlap/hierarchy rules/version.
- **Test:** boundaries, overlap, no loss/duplication bất thường, stable checksum/index, empty text.

## 9. Intent classifier

- **Interface:** `classify(query, user_context) -> IntentResult` structured, confidence/entities.
- **Hiện tại:** chưa có; route luôn legal RAG.
- **Implementation mới:** rule/mock trước hoặc LLM structured adapter; low-confidence policy nằm pipeline.
- **Cấu hình:** provider/model/threshold/intents/timeout.
- **Test:** legal/product/mixed/lead/general/unsupported, malformed output, low confidence, prompt injection.

## 10. Notification provider

- **Interface:** `send(Notification) -> DeliveryResult`, `health_check`.
- **Hiện tại:** chưa có.
- **Implementation mới:** noop, email, webhook khi có use case; tác vụ nặng chạy job.
- **Cấu hình:** provider/from/url/timeout/retry; secret backend-only.
- **Test:** payload validation, retryable/permanent errors, idempotency key, PII redaction, noop.

## 11. Authentication provider

- **Interface:** `authenticate`, `refresh`, `revoke`, `get_identity`; authorization vẫn nội bộ.
- **Hiện tại:** local user/password + JWT/Redis revoke.
- **Implementation mới:** Supabase/OIDC adapter phải map external subject sang internal user và sessions.
- **Cấu hình:** provider/issuer/audience/JWKS/session policy.
- **Test:** signature/audience/issuer/expiry, refresh/revoke, disabled user, key rotation, provider outage.

## 12. Export provider

- **Interface:** `export(dataset, format, options) -> ExportArtifact`.
- **Hiện tại:** chưa có; product/lead export là yêu cầu tương lai.
- **Implementation mới:** CSV/XLSX adapters, streaming/job cho dữ liệu lớn.
- **Cấu hình:** formats/max rows/storage/retention.
- **Test:** encoding/formula injection, permission-filtered rows, large dataset, cleanup, deterministic columns.

## 13. Google synchronization provider

- **Interface:** `list_changes`, `fetch_metadata`, `download`, `checkpoint`.
- **Hiện tại:** Google clients và mapping trùng trong hai CLI và Celery task.
- **Implementation mới:** một Google adapter; product/document mapper thuộc domain module, không nằm provider.
- **Cấu hình:** credentials file/IDs/ranges/folder/interval/page size.
- **Test:** pagination, modified version, retry/rate limit, lock/idempotency, malformed rows, checkpoint.

## 14. CRM integration

- **Interface:** `upsert_lead`, `assign`, `update_status`, `health_check`.
- **Hiện tại:** chỉ có local lead/handoff models, chưa integration.
- **Implementation mới:** local/noop trước; external connector qua jobs/events.
- **Cấu hình:** provider/endpoint/mapping/timeout/retry.
- **Test:** idempotent external ID, field mapping, consent/PII, conflict, retry/DLQ, outage isolation.

## 15. Audit storage

- **Interface:** append-only `write(event)`, query/export theo policy, `health_check`.
- **Hiện tại:** `AuditLog` model nhưng chưa writer/API.
- **Implementation mới:** PostgreSQL sink trước; external SIEM sink qua fan-out/job nếu cần.
- **Cấu hình:** sink/retention/redaction/failure policy.
- **Test:** immutability, actor/trace linkage, redaction, ordering/time, sink failure; production không dùng noop.

## 16. Metrics exporter

- **Interface:** counter/histogram/gauge registration và module collector lifecycle.
- **Hiện tại:** Prometheus FastAPI Instrumentator process/HTTP metrics.
- **Implementation mới:** module metrics đăng ký tên có namespace; OpenTelemetry exporter nếu được chọn.
- **Cấu hình:** exporter/enabled/endpoint/sampling/labels allowlist.
- **Test:** unique names, bounded cardinality, no PII/secret labels, disabled behavior, exporter failure isolation.

## 17. Contract và registration lifecycle

Mọi extension mới phải:

1. implement interface không mở rộng tùy tiện;
2. có tên registry duy nhất và settings validation;
3. vượt contract tests và ít nhất một integration smoke test;
4. định nghĩa timeout/retry/fallback/health semantics;
5. không ghi secret hoặc nội dung nhạy cảm vào log/metric;
6. cập nhật dependency map, feature docs, changelog và rollback;
7. giữ implementation cũ làm adapter trong deprecation window khi đang có consumer.
