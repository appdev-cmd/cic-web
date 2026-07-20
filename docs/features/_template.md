# Tên chức năng

## Mục tiêu

Mô tả vấn đề cần giải quyết và kết quả mong muốn.

## Người dùng

Ai sẽ sử dụng chức năng này: admin, manager, employee hoặc nhóm khác.

## Phạm vi

- Những việc chức năng phải thực hiện.

## Ngoài phạm vi

- Những việc không triển khai trong lần này.

## Permission

```text
<module>.view
<module>.manage
```

## Feature flag

```text
<feature_flag_name>
```

Ghi `Không cần` nếu chức năng không cần rollout hoặc tắt độc lập.

## Data model

Liệt kê bảng, model, trường, quan hệ, constraint và dữ liệu cần backfill.

## API

```text
METHOD /api/v1/...
```

Mô tả request, response, validation và error chính.

## Frontend route

```text
/admin/...
```

## Background task

Liệt kê Celery task, lịch chạy, retry và idempotency. Ghi `Không có` nếu không cần.

## Events

Liệt kê domain event được phát hoặc xử lý.

## Audit log

Liệt kê hành động cần ghi audit, actor và entity.

## Metrics

Liệt kê counter, histogram hoặc dashboard cần theo dõi.

## Security risks

- Quyền truy cập và data scope.
- Dữ liệu nhạy cảm.
- Validation, rate limit và abuse cases.

## UX và accessibility

- Loading state.
- Empty state.
- Error state.
- Keyboard, focus, label và screen reader.

## Test cases

- Unit test.
- Repository/integration test.
- API và permission test.
- Feature-disabled test.
- Frontend/browser/accessibility test.

## Migration

Mô tả Alembic migration, backfill và cách kiểm tra dữ liệu cũ.

## Rollback

Mô tả cách quay lại code, cấu hình và database an toàn.

## Removal plan

Mô tả cách tắt flag, deprecate API, xử lý consumer và dữ liệu trước khi xóa.

## Tiêu chí hoàn thành

- [ ] Chức năng đáp ứng phạm vi đã duyệt.
- [ ] Permission và feature flag hoạt động đúng.
- [ ] Test bắt buộc đã pass.
- [ ] Migration và rollback đã được kiểm chứng.
- [ ] Tài liệu và changelog đã cập nhật.
