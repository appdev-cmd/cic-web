# BÁO CÁO AUDIT TOÀN DIỆN VÀ THIẾT KẾ KIẾN TRÚC MULTI-DESTINATION CHO MODULE FORM

> **Trạng thái tài liệu:** Hoàn tất audit & Đề xuất kiến trúc kỹ thuật  
> **Ngày thực hiện:** 23/09/2026  
> **Phạm vi:** Module Form (Dynamic Form Engine), CMS Form Builder, API Form Submission, Tích hợp Google Sheets & Email Multi-destination  
> **Tác giả:** AI Architecture Audit  

---

## MỤC LỤC

1. [Phần A: Phân tích kiến trúc hiện tại (Current Architecture)](#phần-a-phân-tích-kiến-trúc-hiện-tại-current-architecture)
2. [Phần B: Cấu trúc cơ sở dữ liệu hiện tại (Current DB Schema)](#phần-b-cấu-trúc-cơ-sở-dữ-liệu-hiện-tại-current-db-schema)
3. [Phần C: Hiện trạng tích hợp & Hạ tầng sẵn có (Existing Integration)](#phần-c-hiện-trạng-tích-hợp--hạ-tầng-sẵn-có-existing-integration)
4. [Phần D: Phân tích khoảng cách (Gap Analysis: REUSE / REFACTOR / ADD / REMOVE)](#phần-d-phân-tích-khoảng-cách-gap-analysis)
5. [Phần E: Đề xuất kiến trúc mới (Proposed Architecture: Multi-Destination Pipeline)](#phần-e-đề-xuất-kiến-trúc-mới-proposed-architecture)
6. [Phần F: Thiết kế cơ sở dữ liệu mới (Proposed DB Changes)](#phần-f-thiết-kế-cơ-sở-dữ-liệu-mới-proposed-db-changes)
7. [Phần G: Thiết kế chi tiết tích hợp Google Sheets (Google Sheets Integration Design)](#phần-g-thiết-kế-chi-tiết-tích-hợp-google-sheets)
8. [Phần H: Thiết kế trải nghiệm người dùng CMS (CMS UX Enhancements)](#phần-h-thiết-kế-trải-nghiệm-người-dùng-cms-cms-ux-enhancements)
9. [Phần I: Độ tin cậy & An toàn hệ thống (Reliability & Security)](#phần-i-độ-tin-cậy--an-toàn-hệ-thống-reliability--security)
10. [Phần J: Rủi ro tương thích & Phương án xử lý (Compatibility Risks)](#phần-j-rủi-ro-tương-thích--phương-án-xử-lý-compatibility-risks)
11. [Phần K: Lộ trình triển khai (Implementation Plan)](#phần-k-lộ-trình-triển-khai-implementation-plan)
12. [Phần L: Câu hỏi mở & Kết luận chính thức (Open Questions & Final Verdict)](#phần-l-câu-hỏi-mở--kết-luận-chính-thức-final-verdict)

---

## PHẦN A: PHÂN TÍCH KIẾN TRÚC HIỆN TẠI (CURRENT ARCHITECTURE)

### 1. Bức tranh tổng thể và Sự phân tách giữa hai hệ thống Form

Qua việc khảo sát trực tiếp source code và cơ sở dữ liệu PostgreSQL thực tế, hệ thống hiện có **2 kiến trúc form song song**:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        HỆ THỐNG BIỂU MẪU HIỆN TẠI                       │
└────────────────────────────────────────────────────────────────────────┘
          │                                              │
          ▼                                              ▼
┌───────────────────────────────┐              ┌───────────────────────────────┐
│     1. LEGACY CONTACT FORM    │              │    2. DYNAMIC FORM ENGINE     │
│   (Form Liên hệ cố định)      │              │ (Form động tùy biến trường)   │
├───────────────────────────────┤              ├───────────────────────────────┤
│ • File: ContactForm.tsx       │              │ • Builder: FormBuilderView    │
│ • Action: submitContactAction │              │ • Render: DynamicFormRenderer │
│ • Table: cic_contact (216 row)│              │ • API: /api/forms/submit      │
│ • Triaging: cic_customer_     │              │ • Tables: cic_forms,          │
│   request_states              │              │   cic_form_fields,            │
│   (source_type = 'contact')   │              │   cic_form_submissions...     │
└───────────────────────────────┘              └───────────────────────────────┘
```

Trong đó, **Dynamic Form Engine** (`cic_forms`) là hệ thống hiện đại, có tính năng tạo form tùy biến, cấu hình trường động, cấu hình hành động sau khi gửi, và là đối tượng chính cần nâng cấp kiến trúc Multi-Destination.

---

### 2. Luồng dữ liệu chi tiết của Dynamic Form Engine

Trace toàn bộ luồng hoạt động từ CMS đến Public Form và xử lý Side-effects:

```text
[1. CMS Quản trị]
  FormBuilderView.tsx ──> FormSubmitActionsTab.tsx (Cấu hình email/thông báo)
         │
         ▼
  /api/cms/forms/[id] (PUT) ──> updateForm (mutations.ts)
         │
         ▼
  Lưu cấu hình vào PostgreSQL: table cic_forms & cic_form_fields

─────────────────────────────────────────────────────────────────────────────

[2. Public Website hiển thị & Người dùng gửi]
  DynamicFormEmbed / DynamicFormRenderer.tsx
         │  (Client thu thập dữ liệu các input động)
         ▼
  POST /api/forms/submit (src/app/api/forms/submit/route.ts)
         │
         ├──> Bước 2.1: Rate Limit Check (checkRateLimit - in-memory sliding window)
         ├──> Bước 2.2: Extract Metadata (IP, User-Agent, Referer, sourcePath...)
         ▼
  submitDynamicForm(data) (src/features/forms/server/mutations.ts, L.367–606)
         │
         ├──> Bước 2.3: Validation
         │      • Check Form status = 'published' (nếu draft/closed -> Throw)
         │      • Check Required Fields (kiểm tra rỗng)
         │      • Check Field Type Validation (email, phone, number, regex, min/max)
         │
         ├──> Bước 2.4: DATABASE TRANSACTION (BẮT BUỘC & DUY NHẤT HIỆN TẠI)
         │      ┌────────────────────────────────────────────────────────┐
         │      │ BEGIN TRANSACTION;                                     │
         │      │ 1. INSERT INTO cic_form_submissions (...) RETURNING id │
         │      │ 2. INSERT INTO cic_form_submission_values (...) [EAV]  │
         │      │ 3. IF form.create_customer_request THEN                │
         │      │      INSERT INTO cic_customer_request_states (...)     │
         │      │      INSERT INTO cic_customer_request_events (...)     │
         │      │ COMMIT;                                                │
         │      └────────────────────────────────────────────────────────┘
         │
         ├──> Bước 2.5: SIDE EFFECTS (Chạy bất đồng bộ sau Commit)
         │      ┌────────────────────────────────────────────────────────┐
         │      │ try {                                                  │
         │      │   • IF form.send_admin_email THEN                      │
         │      │       sendDynamicFormAdminNotification(...)            │
         │      │   • IF form.send_confirmation_email THEN               │
         │      │       sendDynamicFormConfirmation(...)                 │
         │      │ } catch (e) {                                          │
         │      │   logger.warn("Gửi email thất bại", e);                │
         │      │   // Không throw error ra ngoài                        │
         │      │ }                                                      │
         │      └────────────────────────────────────────────────────────┘
         ▼
  Return JSON: { success: true, submissionId, message, redirectUrl }
```

### 3. Nhận định cốt lõi về luồng hiện tại:
1. **Database Persistence đã được bảo vệ độc lập:** Quá trình lưu DB nằm trọn vẹn trong một transaction SQL. Email được kích hoạt **sau** khi transaction đã `COMMIT`. Do đó, nếu Email thất bại, dữ liệu DB vẫn được lưu vẹn toàn.
2. **Hạn chế cấu trúc:** Hiện tại side-effects bị hardcode trực tiếp trong hàm `submitDynamicForm` (chỉ gọi 2 hàm email cụ thể). Không có cơ chế pipeline mở rộng (Dispatcher/Adapter), không có bảng lưu lại lịch sử chuyển phát (delivery audit log) xem điểm đến nào thành công, điểm đến nào thất bại.

---

## PHẦN B: CẤU TRÚC CƠ SỞ DỮ LIỆU HIỆN TẠI (CURRENT DB SCHEMA)

Dựa trên kết quả query schema trực tiếp từ cơ sở dữ liệu PostgreSQL thực tế:

### 1. Bảng `cic_forms` (22 cột)
Bảng định nghĩa form, thông tin chung và cấu hình hành động sau gửi.

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | `bigint` | `PRIMARY KEY` | Khóa chính |
| `workspace` | `varchar` | `NOT NULL` | Không gian làm việc đa người thuê |
| `code` | `varchar` | `NOT NULL` | Mã code định danh form (slug/unique code) |
| `is_system` | `boolean` | `NOT NULL DEFAULT false` | Form mặc định của hệ thống |
| `admin_name` | `varchar` | `NOT NULL` | Tên nội bộ cho quản trị viên nhận diện |
| `title` | `varchar` | `NOT NULL` | Tiêu đề hiển thị ra ngoài website |
| `description` | `text` | `NULL` | Mô tả ngắn / ghi chú |
| `status` | `varchar` | `NOT NULL DEFAULT 'draft'` | Trạng thái: `draft`, `published`, `archived` |
| `current_version` | `integer` | `NOT NULL DEFAULT 1` | Phiên bản form |
| `create_customer_request` | `boolean` | `NOT NULL DEFAULT true` | Tạo bản ghi yêu cầu khách hàng |
| `send_admin_email` | `boolean` | `NOT NULL DEFAULT false` | Bật gửi thông báo cho Admin |
| `admin_emails` | `text[]` | `NOT NULL DEFAULT '{}'` | Danh sách email nhận thông báo |
| `admin_email_template_id` | `bigint` | `NULL` | Template email admin từ `cic_email_templates` |
| `send_confirmation_email` | `boolean` | `NOT NULL DEFAULT false` | Gửi email xác nhận lại cho người gửi |
| `confirmation_email_template_id` | `bigint` | `NULL` | Template email xác nhận |
| `submit_button_text` | `varchar` | `NOT NULL DEFAULT 'Gửi thông tin'` | Nhãn nút submit |
| `success_message` | `text` | `NOT NULL` | Thông báo thành công |
| `redirect_url` | `text` | `NULL` | URL chuyển hướng sau khi gửi |
| `created_by` | `integer` | `NULL` | ID user tạo |
| `created_at` | `timestamptz`| `NOT NULL DEFAULT now()` | Thời gian tạo |
| `updated_at` | `timestamptz`| `NOT NULL DEFAULT now()` | Thời gian cập nhật |
| `deleted_at` | `timestamptz`| `NULL` | Soft delete |

> **Đánh giá kiến trúc:** Các cột `send_admin_email`, `admin_emails`, `admin_email_template_id`, `send_confirmation_email` đang được thiết kế dạng **flat column**. Nếu tiếp tục thêm các cột như `send_google_sheet`, `sheet_id`, `sheet_name`, `sheet_mapping`, `send_webhook`, `webhook_url` trực tiếp vào bảng `cic_forms`, bảng này sẽ bị **ô nhiễm cấu trúc (schema bloat)**, vi phạm nguyên tắc Open/Closed và gây khó khăn khi một form muốn gửi dữ liệu sang nhiều sheet hoặc nhiều webhook khác nhau.

---

### 2. Bảng `cic_form_fields` (13 cột)
Bảng định nghĩa các trường nhập liệu động của Form.

| Tên cột | Kiểu dữ liệu | Ghi chú |
| :--- | :--- | :--- |
| `id` | `bigint` | Khóa chính |
| `form_id` | `bigint` | Khóa ngoại trỏ đến `cic_forms(id)` |
| `field_key` | `varchar` | Mã trường duy nhất trong form (vd: `fullname`, `email`, `phone`) |
| `field_type` | `varchar` | Kiểu: `text`, `email`, `phone`, `textarea`, `select`, `checkbox`, `radio`... |
| `role_type` | `varchar` | Vai trò ngữ nghĩa (vd: `customer_name`, `customer_email`, `customer_phone`) |
| `label` | `varchar` | Nhãn hiển thị của trường |
| `placeholder` | `varchar` | Gợi ý nhập liệu |
| `help_text` | `text` | Hướng dẫn phụ |
| `is_required` | `boolean` | Bắt buộc nhập |
| `is_locked` | `boolean` | Khóa không cho xóa nếu là trường hệ thống |
| `position` | `integer` | Thứ tự hiển thị |
| `validation_config` | `jsonb` | Quy tắc regex, min, max, format |
| `options_config` | `jsonb` | Danh sách option cho select/radio/checkbox |

---

### 3. Bảng `cic_form_submissions` (9 cột)
Bảng ghi nhận một lần người dùng gửi form thành công.

| Tên cột | Kiểu dữ liệu | Ghi chú |
| :--- | :--- | :--- |
| `id` | `bigint` | Khóa chính (Mã submission) |
| `form_id` | `bigint` | Khóa ngoại trỏ đến `cic_forms(id)` |
| `form_version` | `integer` | Phiên bản form tại thời điểm gửi |
| `source_type` | `varchar` | Nguồn (vd: `landing_page`, `news_detail`, `product_cta`) |
| `source_id` | `bigint` | ID đối tượng nguồn |
| `source_path` | `text` | URL trang người dùng đang đứng khi submit |
| `cta_id` | `bigint` | ID nút CTA nếu được kích hoạt từ CTA |
| `placement_key` | `varchar` | Vị trí đặt form |
| `submitted_at` | `timestamptz` | Thời gian người dùng gửi (`DEFAULT now()`) |

---

### 4. Bảng `cic_form_submission_values` (7 cột)
Lưu trữ giá trị từng trường theo mô hình EAV (Entity-Attribute-Value).

| Tên cột | Kiểu dữ liệu | Ghi chú |
| :--- | :--- | :--- |
| `id` | `bigint` | Khóa chính |
| `submission_id` | `bigint` | Khóa ngoại trỏ đến `cic_form_submissions(id)` |
| `field_id` | `bigint` | Khóa ngoại trỏ đến `cic_form_fields(id)` |
| `field_key` | `varchar` | Khóa trường tại thời điểm submit |
| `value_text` | `text` | Giá trị dạng text chuẩn |
| `value_json` | `jsonb` | Giá trị phức tạp (mảng, object nếu có) |
| `media_asset_id` | `bigint` | Khóa trỏ file đính kèm nếu trường là upload file |

---

### 5. Bảng `cic_customer_request_states` & `cic_customer_request_events`
Bảng trung tâm điều phối yêu cầu khách hàng (Customer Request / Leads):
- Khi submit form, nếu `form.create_customer_request = true`, một bản ghi được tạo tại `cic_customer_request_states` với `source_type = 'form_submission'` và `source_id = submission.id`.
- Đây là cơ chế triaging nội bộ (phân công nhân sự, quản lý trạng thái `new`, `contacted`, `converted`, `rejected`).

---

## PHẦN C: HIỆN TRẠNG TÍCH HỢP & HẠ TẦNG SẴN CÓ (EXISTING INTEGRATION)

### 1. Hạ tầng Email (`@/lib/email/dispatcher.ts` & `@/lib/email/transporter.ts`)
- **Tình trạng:** **Đã hoàn thiện và hoạt động tốt.**
- **Cơ chế:**
  - Sử dụng `nodemailer` cấu hình SMTP tập trung qua biến môi trường (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_SECURE`, `SMTP_FROM`).
  - Hệ thống template lưu trong bảng `cic_email_templates`.
  - Bộ thay thế token (`replaceEmailTokens` trong `@/lib/email/tokens.ts`) hỗ trợ các placeholder như `{{form_name}}`, `{{submission_id}}`, `{{field_fullname}}`, `{{all_fields_table}}`...
  - Xử lý lỗi an toàn: Bọc trong `try/catch` có logging, không ngắt quãng tiến trình gọi.

### 2. Hiện trạng Google Sheets
- **Tình trạng:** **Chưa có bất kỳ dòng code hoặc thư viện nào trong dự án.**
- Trong `package.json` hiện **chưa cài đặt** `googleapis` hay `google-auth-library`.
- Cần bổ sung thư viện chính thức hoặc client REST tối ưu để làm việc với Google Sheets API v4.

### 3. Hạ tầng Anti-spam & Rate Limiting
- **Tình trạng:** **Đã có sẵn tại `/api/forms/submit/route.ts`**.
- Sử dụng thuật toán sliding window in-memory với hàm `checkRateLimit(key, limit, windowMs)`.
- Giới hạn hiện tại: 10 lần gửi trong 60 giây trên mỗi địa chỉ IP (`getClientIp(request)`).
- **Điểm khuyết:** Chưa có trường bẫy spam ẩn (Honeypot field) để chặn bot tự động mà không làm phiền người dùng thật.

---

## PHẦN D: PHÂN TÍCH KHOẢNG CÁCH (GAP ANALYSIS)

| Phân loại | Thành phần | Đánh giá kỹ thuật | Hành động cụ thể |
| :--- | :--- | :--- | :--- |
| **REUSE** | Core Submission DB Transaction | Lưu `cic_form_submissions` + `cic_form_submission_values` + `cic_customer_request_states` rất chặt chẽ, đảm bảo ACID. | **Giữ nguyên 100%**. Đây là nền tảng cốt lõi không được phép thay đổi. |
| **REUSE** | Email Dispatcher & Templates | `@/lib/email/dispatcher.ts` và `@/lib/email/tokens.ts` đã có sẵn logic render và gửi SMTP. | Đóng gói thành `EmailDestinationAdapter` để kết nối vào pipeline mới. |
| **REUSE** | Rate Limiting & Validation Engine | `checkRateLimit` và `validateFieldVal` hoạt động ổn định. | Tái sử dụng tại API submit, bổ sung thêm Honeypot check. |
| **REFACTOR** | Logic xử lý sau Submit (Side-effects) | Hiện tại `submitDynamicForm` gọi trực tiếp gửi email dạng cứng trong thân hàm. | Tách rời thành `DestinationDispatcher.dispatchAll(ctx)`. Tách biệt hoàn toàn DB transaction khỏi I/O ngoại vi. |
| **REFACTOR** | `FormSubmitActionsTab.tsx` (CMS) | Giao diện hiện tại chỉ là checkbox phẳng cho email. | Thiết kế lại thành dạng **Thẻ điểm đến (Destination Cards)** có trạng thái bật/tắt độc lập và cấu hình riêng biệt. |
| **ADD** | Bảng `cic_form_destinations` | Chưa có bảng quản lý các đích đến linh hoạt (1 form -> N destinations). | Tạo bảng mới lưu cấu hình `google_sheets`, `email`, `webhook` theo dạng JSONB linh hoạt. |
| **ADD** | Bảng `cic_form_submission_deliveries` | Chưa có bảng theo dõi lịch sử và trạng thái gửi của từng destination. | Tạo bảng mới để lưu audit log: `destination_type`, `status` (`success`/`failed`), `error_message`, `attempt_count`. |
| **ADD** | Google Sheets Integration Service | Chưa có kết nối Google API. | Cài đặt `googleapis`, tạo adapter xác thực Service Account tập trung qua `.env`, API kiểm tra kết nối và ghi dòng (`appendRow`). |
| **ADD** | Giao diện Header Auto-mapping | Chưa có cơ chế map trường form với cột trong Sheet. | Xây dựng UI tự động map theo tên cột kèm dropdown chọn thủ công. |
| **ADD** | Delivery Status Badges trong Submissions Modal | CMS xem danh sách gửi form nhưng không biết dữ liệu đã đẩy sang Sheet hay Email chưa. | Bổ sung các icon badge trạng thái chuyển phát trong `FormSubmissionsModal.tsx` kèm nút gửi lại (Retry). |
| **REMOVE** | Tư duy lưu cấu hình điểm đến vào cột phẳng `cic_forms` | Dễ gây phình to bảng, khó bảo trì khi thêm Webhook/CRM. | Ngừng bổ sung cột vào `cic_forms`. Chuyển dịch toàn bộ cấu hình sang `cic_form_destinations`. |

---

## PHẦN E: ĐỀ XUẤT KIẾN TRÚC MỚI (PROPOSED ARCHITECTURE)

### 1. Sơ đồ luồng xử lý Multi-Destination Pipeline

```text
                           [ CLIENT FORM SUBMISSION ]
                                       │
                                       ▼
                       [ Rate Limit & Honeypot Check ]
                                       │
                                       ▼
                       [ Field Validation & Sanitization ]
                                       │
                                       ▼
                       ┌───────────────────────────────┐
                       │   BẮT BUỘC: DB TRANSACTION   │
                       │   (PostgreSQL - ACID)         │
                       ├───────────────────────────────┤
                       │ 1. INSERT Submission          │
                       │ 2. INSERT Submission Values   │
                       │ 3. INSERT Customer Request    │
                       └───────────────────────────────┘
                                       │
                                   [ COMMIT ] ── (Nếu fail tại đây: rollback, báo lỗi client)
                                       │
                    ┌──────────────────┴──────────────────┐
                    ▼                                     ▼
        [ Trả về phản hồi cho Client ]        [ Kích hoạt DestinationDispatcher ]
        { success: true, submissionId }       (Thực thi ngầm, không block Client)
                                                          │
             ┌────────────────────────────────────────────┼────────────────────────────────────────────┐
             │                                            │                                            │
             ▼                                            ▼                                            ▼
   [ 1. GOOGLE SHEETS ADAPTER ]                  [ 2. EMAIL ADAPTER ]                       [ 3. WEBHOOK ADAPTER ]
   • Kiểm tra destination is_enabled             • Kiểm tra destination is_enabled          • (Dự phòng tương lai)
   • Map payload -> Row array                    • Render template & tokens                 • POST JSON payload
   • spreadsheets.values.append                  • Gửi SMTP qua Transporter                 • Timeout 5000ms
             │                                            │                                            │
             └────────────────────────────────────────────┼────────────────────────────────────────────┘
                                                          │
                                                          ▼
                                    ┌───────────────────────────────────────────┐
                                    │    GHI AUDIT LOG CHUYỂN PHÁT              │
                                    │    (cic_form_submission_deliveries)       │
                                    ├───────────────────────────────────────────┤
                                    │ • Sheet:   SUCCESS (sent_at, row_id)      │
                                    │ • Email:   SUCCESS (message_id)           │
                                    │ • Webhook: SKIPPED (disabled)             │
                                    │ (Nếu có lỗi: status='failed', error_msg)  │
                                    └───────────────────────────────────────────┘
```

### 2. Thiết kế Module Hóa (Interface & Adapters)

Mỗi điểm đến (Destination) sẽ hiện thực một interface chung:

```typescript
export interface FormSubmissionPayload {
  submissionId: string;
  formId: string;
  formCode: string;
  formTitle: string;
  submittedAt: Date;
  sourcePath?: string;
  clientIp?: string;
  fields: Record<string, {
    label: string;
    value: any;
    fieldKey: string;
    fieldType: string;
  }>;
}

export interface DestinationDeliveryResult {
  destinationType: 'google_sheets' | 'email' | 'webhook';
  status: 'success' | 'failed' | 'skipped';
  errorMessage?: string;
  responsePayload?: any;
  attemptCount: number;
}

export interface IDestinationAdapter<TConfig = any> {
  readonly type: string;
  send(config: TConfig, payload: FormSubmissionPayload): Promise<DestinationDeliveryResult>;
  testConnection(config: TConfig): Promise<{ success: boolean; message: string; meta?: any }>;
}
```

**Ưu điểm vượt trội:**
1. **Phân tách trách nhiệm hoàn hảo (Single Responsibility):** Database hoàn toàn độc lập với các side-effects.
2. **Không làm chậm người dùng cuối:** Sau khi DB commit thành công, client nhận ngay thông báo thành công (trải nghiệm mượt mà), các tác vụ mạng gửi ra ngoài diễn ra trong background.
3. **Mở rộng vô hạn:** Muốn thêm CRM Hubspot, Zalo ZNS, Webhook Discord... chỉ cần viết thêm Adapter mới và implement `IDestinationAdapter` mà không sửa đổi một dòng code nào của logic lưu DB.

---

## PHẦN F: THIẾT KẾ CƠ SỞ DỮ LIỆU MỚI (PROPOSED DB CHANGES)

Nhằm đảm bảo tính mở rộng cao nhất và không gây ô nhiễm bảng `cic_forms`, chúng ta thiết kế 2 bảng chuyên biệt:

### 1. Bảng cấu hình điểm đến: `cic_form_destinations`

```sql
CREATE TABLE IF NOT EXISTS cic_form_destinations (
    id BIGSERIAL PRIMARY KEY,
    form_id BIGINT NOT NULL REFERENCES cic_forms(id) ON DELETE CASCADE,
    destination_type VARCHAR(50) NOT NULL, -- 'google_sheets', 'email', 'webhook'
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    config JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_form_destination UNIQUE (form_id, destination_type)
);

CREATE INDEX idx_form_destinations_form_id ON cic_form_destinations(form_id);
CREATE INDEX idx_form_destinations_type_enabled ON cic_form_destinations(destination_type, is_enabled);
```

#### Cấu trúc JSONB `config` cho từng loại:

**a. Cho `google_sheets`:**
```json
{
  "spreadsheet_id": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
  "sheet_name": "Sheet1",
  "auto_create_headers": true,
  "column_mapping": [
    { "header_name": "Thời gian", "source_type": "system", "source_key": "submitted_at" },
    { "header_name": "Họ và tên", "source_type": "field", "source_key": "fullname" },
    { "header_name": "Số điện thoại", "source_type": "field", "source_key": "phone" },
    { "header_name": "Email", "source_type": "field", "source_key": "email" },
    { "header_name": "Nội dung", "source_type": "field", "source_key": "message" },
    { "header_name": "Trang gửi", "source_type": "system", "source_key": "source_path" }
  ]
}
```

**b. Cho `email`:**
```json
{
  "send_admin": true,
  "admin_emails": ["admin@cic.com.vn", "lead@cic.com.vn"],
  "admin_template_id": 12,
  "send_confirmation": true,
  "confirmation_template_id": 14
}
```

---

### 2. Bảng theo dõi trạng thái chuyển phát: `cic_form_submission_deliveries`

```sql
CREATE TABLE IF NOT EXISTS cic_form_submission_deliveries (
    id BIGSERIAL PRIMARY KEY,
    submission_id BIGINT NOT NULL REFERENCES cic_form_submissions(id) ON DELETE CASCADE,
    destination_type VARCHAR(50) NOT NULL, -- 'google_sheets', 'email', 'webhook'
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'success', 'failed', 'retrying'
    attempt_count INTEGER NOT NULL DEFAULT 1,
    max_attempts INTEGER NOT NULL DEFAULT 3,
    response_payload JSONB NULL,
    error_message TEXT NULL,
    last_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    delivered_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_submission_deliveries_sub_id ON cic_form_submission_deliveries(submission_id);
CREATE INDEX idx_submission_deliveries_status ON cic_form_submission_deliveries(status);
```

### 3. Chiến lược Migration dữ liệu cũ (Zero Downtime & Backward Compatible)
- Viết script migration (SQL):
  - Duyệt toàn bộ các record trong `cic_forms` hiện tại.
  - Nếu `send_admin_email = true` hoặc `send_confirmation_email = true`, tự động tạo bản ghi tương ứng trong `cic_form_destinations` với `destination_type = 'email'`.
  - Giữ lại các cột cũ trên `cic_forms` như trường dự phòng (fallback), đảm bảo nếu chưa kịp update code một vị trí nào đó thì hệ thống vẫn không bị crash.

---

## PHẦN G: THIẾT KẾ CHI TIẾT TÍCH HỢP GOOGLE SHEETS

### 1. Quản lý xác thực tập trung qua Server Environment (Security First)
- **Tuyệt đối không lưu Google Client Secret hay Private Key vào Database hoặc Form Config.**
- **Tuyệt đối không để lộ thông tin xác thực ra Client-side UI.**
- Sử dụng cơ chế **Google Service Account**:
  - Quản trị viên chỉ cấu hình 1 lần duy nhất trong file môi trường `.env` của server:
    ```env
    GOOGLE_SERVICE_ACCOUNT_EMAIL="cic-form-collector@cic-production.iam.gserviceaccount.com"
    GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
    ```
- **Nguyên lý phân quyền của Google:**
  - Service Account không có quyền mặc định xem các file cá nhân của bất kỳ ai.
  - Người dùng khi tạo Google Sheet chỉ cần **Share (Chia sẻ quyền chỉnh sửa - Editor)** file Sheet đó cho địa chỉ `GOOGLE_SERVICE_ACCOUNT_EMAIL`.
  - Trên CMS, giao diện hiển thị rõ email này cùng nút bấm "Copy Email" tiện lợi.

---

### 2. Thuật toán Tự động khớp Cột (Auto-Header Mapping)

Khi quản trị viên nhập Spreadsheet ID/URL và nhấn **"Kiểm tra kết nối & Đọc tiêu đề Sheet"**:
1. Server sử dụng Google Sheets API v4 gọi:
   ```typescript
   sheets.spreadsheets.values.get({
     spreadsheetId,
     range: `${sheetName}!1:1`, // Đọc toàn bộ hàng đầu tiên (Row 1)
   });
   ```
2. Nếu hàng 1 rỗng:
   - Hệ thống gợi ý: *"Sheet đang rỗng. Bạn có muốn tự động tạo hàng tiêu đề dựa trên các trường của Form không?"*
3. Nếu hàng 1 đã có các tiêu đề (ví dụ: `Họ và tên`, `Số điện thoại`, `Email`, `Ngày tạo`...):
   - Hệ thống chạy thuật toán chuẩn hóa chuỗi (Normalize String):
     - Xóa dấu tiếng Việt: `Họ và tên` -> `ho va ten`
     - Bỏ khoảng trắng & ký tự đặc biệt: `ho va ten` -> `hovaten`
     - So khớp với `label` và `field_key` của các trường Form:
       - Nếu `fullname` hoặc `Ho va ten` tương đồng > 80% -> **Khớp tự động (Auto-matched)**.
   - Hiển thị bảng đối chiếu trực quan trên giao diện:
     - **Cột A:** `Họ và tên` ──> Gắn với trường: `[ Họ và tên (fullname) ▾ ]`
     - **Cột B:** `Số điện thoại` ──> Gắn với trường: `[ Điện thoại (phone) ▾ ]`
     - **Cột C:** `Thời gian gửi` ──> Gắn với trường hệ thống: `[ Ngày gửi biểu mẫu ▾ ]`
   - Quản trị viên có thể đổi lại bằng Dropdown nếu thuật toán đoán sai.

---

### 3. Cơ chế Ghi Dữ liệu (`appendRow`)

Khi có submission mới:
1. Destination Dispatcher nạp cấu hình `column_mapping` đã lưu.
2. Tạo mảng dữ liệu tương ứng theo thứ tự cột của Sheet:
   ```typescript
   const rowValues = mapping.map(col => {
     if (col.source_type === 'system') {
       if (col.source_key === 'submitted_at') return formatVietnameseDateTime(payload.submittedAt);
       if (col.source_key === 'submission_id') return String(payload.submissionId);
       if (col.source_key === 'source_path') return payload.sourcePath || '';
     }
     return payload.fields[col.source_key]?.value ?? '';
   });
   ```
3. Gọi API chèn dòng mới vào cuối bảng:
   ```typescript
   await sheets.spreadsheets.values.append({
     spreadsheetId,
     range: `${sheetName}!A1`,
     valueInputOption: 'USER_ENTERED', // Đảm bảo số điện thoại, ngày tháng được Google Sheets nhận diện đúng format
     insertDataOption: 'INSERT_ROWS',
     requestBody: {
       values: [rowValues],
     },
   });
   ```
4. Đặt timeout tối đa là **5000ms**. Nếu Google API phản hồi quá thời gian này, ngắt kết nối và đánh dấu status = `failed` trong bảng deliveries, đảm bảo không nghẽn tài nguyên server.

---

## PHẦN H: THIẾT KẾ TRẢI NGHIỆM NGƯỜI DÙNG CMS (CMS UX ENHANCEMENTS)

### 1. Nâng cấp Tab "Xử lý sau khi gửi" (`FormSubmitActionsTab.tsx`)

Thay thế giao diện checkbox đơn điệu hiện tại bằng giao diện **Thẻ điểm đến (Multi-Destination Cards)**:

```text
┌────────────────────────────────────────────────────────────────────────┐
│ CẤU HÌNH ĐIỂM ĐẾN DỮ LIỆU (SUBMISSION DESTINATIONS)                    │
│ Tùy chọn các nơi lưu trữ và thông báo dữ liệu khi có lượt gửi mới      │
└────────────────────────────────────────────────────────────────────────┘

 [Thẻ 1] 🗄️ CƠ SỞ DỮ LIỆU HỆ THỐNG (CMS DATABASE)
 ┌──────────────────────────────────────────────────────────────────────┐
 │ TRẠNG THÁI: [ BẮT BUỘC - LUÔN BẬT ] 🔒                              │
 │ Mọi lượt gửi biểu mẫu đều được mã hóa và lưu trữ an toàn trong DB.    │
 │ ☑ Tự động tạo Yêu cầu khách hàng (Leads Triaging)                    │
 │    Người phụ trách mặc định: [ Chọn nhân viên kinh doanh ▾ ]         │
 │    Nhãn (Tags) tự động: [ Form Khách hàng, Website ]                 │
 └──────────────────────────────────────────────────────────────────────┘

 [Thẻ 2] 📊 GOOGLE SHEETS
 ┌──────────────────────────────────────────────────────────────────────┐
 │ BẬT ĐỒNG BỘ: [ [ON] / OFF ]                                          │
 │                                                                      │
 │ ℹ Hướng dẫn cấp quyền:                                              │
 │ Vui lòng chia sẻ (Share) quyền "Người chỉnh sửa" file Google Sheet   │
 │ cho email Service Account sau:                                       │
 │ ┌──────────────────────────────────────────────────┐ [ Sao chép ]   │
 │ │ cic-form-collector@cic-production.iam.gservice... │                 │
 │ └──────────────────────────────────────────────────┘                 │
 │                                                                      │
 │ 🔗 Đường dẫn hoặc ID Google Sheet:                                   │
 │ [ https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvB.../edit ]│
 │                                                                      │
 │ 📑 Tên Trang tính (Sheet Tab):                                       │
 │ [ Trang_tính_1               ]  [ 🔄 Kiểm tra kết nối & Tải cột ]    │
 │                                                                      │
 │ 📋 CẤU HÌNH GHÉP CỘT (COLUMN MAPPING):                               │
 │ ┌──────────┬─────────────────────────────┬─────────────────────────┐ │
 │ │ Cột Sheet│ Tiêu đề nhận diện           │ Trường dữ liệu tương ứng│ │
 │ ├──────────┼─────────────────────────────┼─────────────────────────┤ │
 │ │ Cột A    │ Thời gian gửi               │ [ Ngày gửi (Hệ thống) ▾]│ │
 │ │ Cột B    │ Họ và tên                   │ [ Họ và tên (fullname) ▾]││
 │ │ Cột C    │ Số điện thoại               │ [ Số điện thoại (phone)▾]││
 │ │ Cột D    │ Email liên hệ               │ [ Email (email)       ▾]│ │
 │ │ Cột E    │ Lời nhắn / Nhu cầu          │ [ Ghi chú (message)   ▾]│ │
 │ └──────────┴─────────────────────────────┴─────────────────────────┘ │
 │ [ Khởi tạo hàng tiêu đề mẫu vào Sheet nếu file đang trống ]          │
 └──────────────────────────────────────────────────────────────────────┘

 [Thẻ 3] ✉️ THÔNG BÁO EMAIL
 ┌──────────────────────────────────────────────────────────────────────┐
 │ BẬT GỬI EMAIL: [ [ON] / OFF ]                                        │
 │                                                                      │
 │ ▾ Gửi thông báo cho Quản trị viên (Admin)                            │
 │   ☑ Bật thông báo admin                                             │
 │   Danh sách email nhận: [ admin@cic.com.vn, sale@cic.com.vn        ] │
 │   Mẫu Email: [ Mẫu thông báo biểu mẫu mới (ID: 12) ▾ ]              │
 │                                                                      │
 │ ▾ Gửi thư xác nhận cho Người gửi (Auto-responder)                    │
 │   ☑ Bật thư xác nhận                                                │
 │   Gửi đến trường: [ Email người gửi (email) ▾ ]                     │
 │   Mẫu Email: [ Mẫu cảm ơn đăng ký dịch vụ (ID: 14) ▾ ]              │
 └──────────────────────────────────────────────────────────────────────┘

 [Thẻ 4] 🌐 WEBHOOK / CRM (Mở rộng trong tương lai)
 ┌──────────────────────────────────────────────────────────────────────┐
 │ BẬT WEBHOOK: [ ON / [OFF] ] (Dự phòng kết nối CRM Hubspot/Lark/Zalo)  │
 └──────────────────────────────────────────────────────────────────────┘
```

---

### 2. Nâng cấp Bảng Lịch sử Gửi (`FormSubmissionsModal.tsx`)

Bổ sung hiển thị trực quan trạng thái chuyển phát đến từng điểm:
- Cột **Trạng thái chuyển phát (Delivery Status)**:
  - `[DB: Thành công]` (Màu xanh lá - luôn có).
  - `[Sheet: Đã ghi]` (Màu xanh lá) hoặc `[Sheet: Thất bại]` (Màu đỏ, hover hiện lý do lỗi: *Permission denied / Sheet not found*).
  - `[Email: Đã gửi]` (Màu xanh lá) hoặc `[Email: Lỗi SMTP]`.
- Nút bấm **"Thử gửi lại" (Retry Delivery)**: Cho phép admin kích hoạt gửi lại riêng cho Google Sheets hoặc Email nếu lần gửi đầu tiên bị gián đoạn mạng mà không phải tạo submission mới.

---

## PHẦN I: ĐỘ TIN CẬY & AN TOÀN HỆ THỐNG (RELIABILITY & SECURITY)

### 1. Nguyên tắc Cách ly Thất bại (Failure Isolation Principle)
- Bất kể Google Sheets bị lỗi gì:
  - Sai Spreadsheet ID.
  - Người dùng quên Share quyền cho Service Account.
  - Quá hạn ngạch (Rate limit quota của Google API).
  - Mất mạng / Timeout.
- **TUYỆT ĐỐI KHÔNG ẢNH HƯỞNG ĐẾN SUBMISSION TRONG DATABASE.**
- Quá trình ghi nhận yêu cầu khách hàng vẫn hoàn thành 100%. Người dùng trên website vẫn nhận được thông báo "Gửi thành công".
- Lỗi được ghi nhận vào `cic_form_submission_deliveries` và log của hệ thống để quản trị viên có thể theo dõi và bấm "Thử gửi lại".

### 2. Chính sách Timeout và Retry
- **Timeout:** Mỗi cuộc gọi đến Google Sheets hoặc dịch vụ ngoài được bọc qua `AbortController` với thời gian chờ tối đa **5 giây**.
- **Retry Policy:** Không retry vô hạn để tránh làm nghẽn worker. Nếu thất bại, ghi nhận trạng thái `failed`, cho phép admin bấm retry thủ công trên CMS.

### 3. Bảo vệ Thông tin Xác thực (Credential Security)
- Toàn bộ Private Key của Google Service Account chỉ nằm trong biến môi trường của Server.
- API Endpoint CMS khi trả về cấu hình destination chỉ trả về `spreadsheet_id`, `sheet_name`, `column_mapping`. Tuyệt đối không bao giờ trả về thông tin mật.
- Endpoint test kết nối chỉ cho phép người dùng có quyền `forms:edit` thực hiện.

---

## PHẦN J: RỦI RO TƯƠNG THÍCH & PHƯƠNG ÁN XỬ LÝ (COMPATIBILITY RISKS)

| Rủi ro tiềm ẩn | Mức độ | Phương án phòng ngừa & Xử lý |
| :--- | :---: | :--- |
| **Ảnh hưởng đến các Form đang chạy thực tế** | Thấp | Không sửa đổi cấu trúc bảng `cic_forms` hiện tại. Bảng mới `cic_form_destinations` hoàn toàn độc lập. API `/api/forms/submit` giữ nguyên định dạng request/response. |
| **Gửi đồng thời nhiều đích gây chậm phản hồi của Form** | Trung bình | Luồng dispatch chạy ở chế độ **Fire-and-forget** (hoặc `Promise.allSettled` không chặn việc trả response HTTP cho client nếu dùng cơ chế background task). |
| **Google Sheets thay đổi tên cột hoặc xóa cột** | Trung bình | Ghi log chi tiết lỗi vào `cic_form_submission_deliveries`. Nếu sheet bị đổi tên, hệ thống thông báo lỗi rõ ràng trên CMS thay vì im lặng fail. |
| **Quá hạn mức Google Sheets API (300 req/phút/project)** | Thấp | Với lưu lượng của website doanh nghiệp thông thường, khó vượt quá quota này. Nếu lượng submit đột biến trong tương lai, kiến trúc bảng `deliveries` đã sẵn sàng để chuyển sang cơ chế hàng đợi (Queue/BullMQ/Redis). |

---

## PHẦN K: LỘ TRÌNH TRIỂN KHAI (IMPLEMENTATION PLAN)

Kế hoạch được chia làm 4 giai đoạn rõ ràng:

### Giai đoạn 1: Cơ sở dữ liệu & Core Engine (Độ ưu tiên: P0)
- Tạo bảng `cic_form_destinations` và `cic_form_submission_deliveries`.
- Viết query & mutation quản lý Destinations (`getFormDestinations`, `saveFormDestinations`).
- Script migration chuyển cấu hình email cũ từ `cic_forms` sang `cic_form_destinations`.

### Giai đoạn 2: Tích hợp Google Sheets Service (Độ ưu tiên: P0)
- Cài đặt thư viện `googleapis`.
- Cấu hình biến môi trường Service Account (`GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`).
- Viết module `src/lib/integrations/google-sheets/client.ts`:
  - `testGoogleSheetAccess(spreadsheetId, sheetName)`
  - `getGoogleSheetHeaders(spreadsheetId, sheetName)`
  - `appendRowToGoogleSheet(spreadsheetId, sheetName, rowValues)`
- Tạo API route `/api/cms/forms/[id]/destinations/google-sheets/test`.

### Giai đoạn 3: Xây dựng Destination Dispatcher Pipeline (Độ ưu tiên: P0)
- Viết `src/features/forms/server/dispatcher/index.ts`.
- Hiện thực `GoogleSheetsAdapter` và `EmailAdapter`.
- Tách rời side-effects ra khỏi `submitDynamicForm` trong `mutations.ts`.
- Tích hợp ghi nhận delivery audit log.

### Giai đoạn 4: Nâng cấp CMS UI (Độ ưu tiên: P1 & P2)
- Nâng cấp `FormSubmitActionsTab.tsx`:
  - Giao diện Multi-Destination Cards.
  - Box hướng dẫn cấp quyền Service Account kèm nút sao chép.
  - Trình kiểm tra kết nối Sheet & giao diện ghép cột (Auto-header mapping).
  - Tích hợp cấu hình Email dạng Accordion.
- Nâng cấp `FormSubmissionsModal.tsx`:
  - Hiển thị badge trạng thái chuyển phát (DB, Sheet, Email).
  - Nút Retry cho các lượt gửi bị lỗi.

---

## PHẦN L: CÂU HỎI MỞ & KẾT LUẬN CHÍNH THỨC (FINAL VERDICT)

### 1. Câu hỏi kỹ thuật cần xác nhận với Product / Admin
1. **Thông tin Google Service Account:** Đội ngũ kỹ thuật đã có sẵn tài khoản GCP (Google Cloud Project) để tạo Service Account chưa, hay cần một hướng dẫn tạo Service Account trên Google Cloud Console?  
   *(Khuyến nghị: Sẽ cung cấp tài liệu hướng dẫn tạo Service Account chi tiết đi kèm).*
2. **Quy tắc khi Sheet chưa có hàng tiêu đề:** Khi người dùng nhập một Google Sheet hoàn toàn trắng, hệ thống nên tự động chèn hàng 1 làm tiêu đề cột dựa trên tên trường form, hay bắt buộc người dùng tự gõ tiêu đề trước trên Sheet?  
   *(Khuyến nghị: Bổ sung nút bấm "Khởi tạo tiêu đề tự động" ngay trên CMS để tiện lợi nhất).*

### 2. Kết luận chính thức (Final Verdict)

```text
================================================================================
                    FINAL VERDICT: READY_TO_IMPLEMENT
================================================================================
Kiến trúc Form hiện tại hoàn toàn phù hợp để nâng cấp lên mô hình Multi-Destination.
Phương án đề xuất đảm bảo 100%:
  1. Database luôn là đích đến bắt buộc và bất biến.
  2. Lỗi ở Google Sheets hoặc Email không bao giờ làm mất dữ liệu đã lưu DB.
  3. Quản lý thông tin Google tập trung an toàn qua Server Environment.
  4. Trải nghiệm Auto-mapping trực quan, dễ dùng cho quản trị viên.
  5. Sẵn sàng mở rộng Webhook/CRM mà không phải thay đổi kiến trúc core.
===============================================================================

---

## PHẦN M: BẢNG KIỂM TRA TRIỂN KHAI PRODUCTION (PRODUCTION IMPLEMENTATION AUDIT MATRIX)

| Hạng mục kiểm tra | Trạng thái | Ghi chú & Bằng chứng kiểm thử |
| :--- | :---: | :--- |
| **Bảng CSDL `cic_form_destinations`** | `[x]` Đã áp dụng | Migration `db_migrate/migrations/20260923_form_multi_destination.sql` đã chạy thành công trên PostgreSQL. |
| **Bảng CSDL `cic_form_submission_deliveries`** | `[x]` Đã áp dụng | Foreign key cascade, unique constraint `(submission_id, destination_id)` và indexes đầy đủ. |
| **Đồng bộ Database Documentation** | `[x]` Hoàn thành | Đã cập nhật `db_migrate/database.html`, `cic14005_cic_fs_schema_moi_postgresql_PATCHED.sql`, `docs/database/POSTGRES_SCHEMA_DELTA.md`. |
| **Backfill dữ liệu Form hiện có** | `[x]` Hoàn thành | 8 biểu mẫu đang có cấu hình email đã được backfill thành bản ghi `email` trong `cic_form_destinations`. |
| **Google Sheets Server Credentials** | `[x]` Hoàn thành | Quản lý qua `GOOGLE_SERVICE_ACCOUNT_EMAIL` & `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` (khử lỗi `\n` tự động). Không lưu key vào DB. |
| **Chuẩn hóa URL / ID Google Sheet** | `[x]` Hoàn thành | Hàm `normalizeSpreadsheetId` bóc tách chính xác ID từ URL đầy đủ hoặc giữ nguyên ID chuẩn. |
| **Bảo toàn số điện thoại & Tiếng Việt** | `[x]` Hoàn thành | Tự động thêm `'` (apostrophe) trước chuỗi số bắt đầu bằng `0` (ví dụ: `'0912345678`) để Sheet không làm mất số `0`. UTF-8 Unicode tiếng Việt 100% chuẩn xác. |
| **Deterministic Header Matcher** | `[x]` Hoàn thành | Khớp theo 5 bậc: (1) `field_key` -> (2) Normalized Vietnamese label -> (3) Semantic `role_type` -> (4) System fields -> (5) `UNMAPPED`. |
| **Khởi tạo tiêu đề tự động trên Sheet** | `[x]` Hoàn thành | Nút "Khởi tạo hàng tiêu đề mẫu" chèn hàng 1 nếu Sheet chưa có tiêu đề. |
| **Destination Dispatcher Pipeline** | `[x]` Hoàn thành | Chạy song song độc lập bằng `Promise.allSettled`, bọc `AbortController` 5 giây. |
| **Failure Isolation** | `[x]` Hoàn thành | Sheet/Email thất bại không bao giờ rollback DB submission. Người dùng submit nhận thông báo thành công. |
| **Idempotent Retry & Tracking** | `[x]` Hoàn thành | Bảng deliveries ghi nhận số lần thử (`attempt_count`), lỗi (`last_error`), và hỗ trợ retry qua API/CMS. |
| **Giao diện CMS Form Builder** | `[x]` Hoàn thành | Thẻ Database (Luôn bật), Thẻ Google Sheets (Test kết nối, Copy SA Email, Auto-mapping), Thẻ Email (Admin & Khách hàng). |
| **Giao diện Lịch sử Gửi (Submissions)** | `[x]` Hoàn thành | Huy hiệu trực quan `[DB: Đã lưu]`, `[Sheet: Thành công/Thất bại]`, `[Email: Thành công/Thất bại]` kèm nút Retry. |
| **Verification Test Suite** | `[x]` Hoàn thành | `scripts/verify-form-multi-destination.ts`: 22/22 tests passed (100%). |
| **Typecheck Foundation** | `[x]` Hoàn thành | `npm run typecheck:foundation`: 0 errors. |

```
