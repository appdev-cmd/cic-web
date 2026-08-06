# Kế Hoạch Phát Triển Hệ Thống Tương Tác Khách Hàng
# Customer Interaction Management System - Development Plan

## Tổng quan (Overview)

Hệ thống Tương tác khách hàng bao gồm 3 module chính:
- **CTA Management** - Quản lý nút kêu gọi hành động tập trung
- **Form Management** - Quản lý biểu mẫu động có versioning
- **Customer Request Management** - Quản lý yêu cầu khách hàng và quy trình xử lý

---

## Giai đoạn 1: Nền tảng cốt lõi (Core Foundation) - 4 tuần

### Tuần 1: Database Schema & Backend API
**Mục tiêu**: Thiết lập cấu trúc database và API endpoints

#### 1.1 Database Schema Design
- [ ] Thiết kế các bảng chính:
  - `ctas` - CTA cơ bản
  - `forms` - Biểu mẫu cơ bản  
  - `form_fields` - Trường biểu mẫu
  - `form_submissions` - Lần gửi biểu mẫu
  - `form_submission_values` - Giá trị từng trường
  - `customer_request_notes` - Ghi chú yêu cầu
  - `customer_request_logs` - Lịch sử xử lý
  - `conversion_events` - Sự kiện thống kê

- [ ] Tạo database migration script
- [ ] Thiết lập indexes cho performance
- [ ] Tạo foreign keys và constraints
- [ ] Review và optimize schema

#### 1.2 Backend API Structure
- [ ] Thiết lập API routes structure:
  ```
  /api/ctas/*
  /api/forms/*
  /api/customer-requests/*
  /api/analytics/*
  ```

- [ ] Implement CRUD endpoints cho CTA:
  - `GET /api/ctas` - List CTAs
  - `POST /api/ctas` - Create CTA
  - `GET /api/ctas/:id` - Get CTA detail
  - `PUT /api/ctas/:id` - Update CTA
  - `DELETE /api/ctas/:id` - Delete CTA (soft delete)
  - `POST /api/ctas/:id/toggle-status` - Toggle active/inactive

- [ ] Implement CRUD endpoints cho Forms:
  - `GET /api/forms` - List forms
  - `POST /api/forms` - Create form
  - `GET /api/forms/:id` - Get form detail
  - `PUT /api/forms/:id` - Update form
  - `DELETE /api/forms/:id` - Delete form (soft delete)
  - `POST /api/forms/:id/fields` - Add field
  - `PUT /api/forms/:id/fields/:fieldId` - Update field
  - `DELETE /api/forms/:id/fields/:fieldId` - Delete field

- [ ] Implement endpoints cho Customer Requests:
  - `GET /api/customer-requests` - List requests
  - `GET /api/customer-requests/:id` - Get request detail
  - `PUT /api/customer-requests/:id/status` - Update status
  - `PUT /api/customer-requests/:id/assign` - Assign user
  - `POST /api/customer-requests/:id/notes` - Add note
  - `GET /api/customer-requests/:id/history` - Get history
  - `GET /api/customer-requests/export` - Export to Excel

#### 1.3 Authentication & Authorization
- [ ] Thiết lập permission roles:
  - `cta_view`, `cta_create`, `cta_edit`, `cta_delete`
  - `form_view`, `form_create`, `form_edit`, `form_delete`
  - `request_view`, `request_process`, `request_export`

- [ ] Implement middleware cho permissions
- [ ] Tạo role-based access control

### Tuần 2: Frontend Foundation Components
**Mục tiêu**: Xây dựng các UI components cơ bản

#### 2.1 Shared Components
- [ ] Tạo module structure mới:
  ```
  src/cms/modules/customer_interaction/
  ├── cta/
  ├── forms/
  ├── customer_requests/
  ├── shared/
  └── types.ts
  ```

- [ ] Build reusable form components:
  - `FormFieldEditor` - Component chỉnh sửa trường
  - `FieldTypeSelector` - Chọn loại trường
  - `ValidationConfig` - Cấu hình validation
  - `OptionEditor` - Editor cho select/radio/checkbox

- [ ] Build CTA components:
  - `CTAEditor` - Form chỉnh sửa CTA
  - `ActionTypeSelector` - Chọn loại hành động
  - `CTAPreview` - Preview CTA

- [ ] Build Customer Request components:
  - `RequestCard` - Card hiển thị yêu cầu
  - `StatusBadge` - Badge trạng thái
  - `AssigneeSelector` - Chọn người phụ trách
  - `NotesTimeline` - Timeline ghi chú

#### 2.2 Data Sources & Mock Data
- [ ] Tạo data sources:
  - `CtaDataSource.ts`
  - `FormDataSource.ts`
  - `CustomerRequestDataSource.ts`

- [ ] Tạo mock data cho development:
  - Mock CTAs với các action types khác nhau
  - Mock Forms với các field types khác nhau
  - Mock Customer requests với các trạng thái

#### 2.3 Integration với Existing CMS
- [ ] Thêm menu items vào sidebar:
  - "Tương tác khách hàng" (parent)
    - "CTA"
    - "Biểu mẫu" 
    - "Yêu cầu khách hàng"

- [ ] Update routing configuration
- [ ] Integrate với existing design system
- [ ] Ensure responsive design consistency

### Tuần 3: CTA Management Module
**Mục tiêu**: Hoàn thành module quản lý CTA

#### 3.1 CTA List View
- [ ] Build CTA list với columns:
  - Tên quản trị
  - Nội dung hiển thị
  - Hành động
  - Biểu mẫu liên kết (nếu có)
  - Trạng thái
  - Thống kê cơ bản (lượt hiển thị, lượt nhấn, CTR)
  - Ngày tạo
  - Hành động

- [ ] Implement filtering:
  - Theo trạng thái (active, inactive, draft, archived)
  - Theo hành động (open form, redirect, scroll, download, call, email)
  - Theo từ khóa

- [ ] Implement sorting:
  - Theo tên, ngày tạo, lượt hiển thị, CTR

- [ ] Implement bulk actions:
  - Bulk toggle status
  - Bulk archive
  - Bulk delete

#### 3.2 CTA Form & Editor
- [ ] Build CTA creation/editing form:
  - Tên quản trị (required)
  - Nội dung hiển thị (required)
  - Mô tả nội bộ
  - Icon picker
  - Hành động (dropdown với các loại)
  - Dynamic fields dựa trên hành động:
    - Open Form: Form selector
    - Redirect URL: URL input, target (new tab/same tab)
    - Scroll to section: Section selector
    - Download file: File picker
    - Call phone: Phone number input
    - Send email: Email address input
  - Trạng thái
  - Mã định danh (auto-generate)

- [ ] Implement validation:
  - Required fields validation
  - URL format validation
  - Phone number format validation
  - Email format validation

- [ ] Implement CTA preview:
  - Real-time preview component
  - Show different states (normal, hover, active)

#### 3.3 CTA Analytics Integration
- [ ] Display basic statistics:
  - Lượt hiển thị (impressions)
  - Lượt nhấn (clicks)
  - CTR (click-through rate)
  - Chart showing trend over time

- [ ] Implement date range filter
- [ ] Show usage locations (pages where CTA is used)

### Tuần 4: Form Management Module  
**Mục tiêu**: Hoàn thành module quản lý Biểu mẫu

#### 4.1 Form List View
- [ ] Build Form list với columns:
  - Tên quản trị
  - Tiêu đề hiển thị
  - Số trường
  - Phiên bản hiện tại
  - Lượt mở
  - Lượt gửi
  - Tỷ lệ hoàn thành
  - Trạng thái
  - Ngày tạo
  - Hành động

- [ ] Implement filtering:
  - Theo trạng thái
  - Theo từ khóa
  - Theo số lượng trường

- [ ] Implement sorting:
  - Theo tên, ngày tạo, lượt gửi, tỷ lệ hoàn thành

#### 4.2 Form Builder
- [ ] Build form field editor:
  - Drag-and-drop field ordering
  - Field types:
    - Text
    - Textarea
    - Email
    - Phone
    - Number
    - Select
    - Radio
    - Checkbox
    - Date
    - File Upload
    - Hidden Field
    - Consent Checkbox

  - Field configuration:
    - Label (required)
    - Field key (auto-generate from label, lock after data exists)
    - Placeholder
    - Help text
    - Required toggle
    - Validation rules
    - Options (cho select, radio, checkbox)
    - File restrictions (cho file upload)

- [ ] Implement field role assignment:
  - Customer name
  - Email
  - Phone
  - Company
  - Message
  - Other

- [ ] Implement form versioning:
  - Auto-increment version on structural changes
  - Version history viewer
  - Rollback capability

#### 4.3 Form Configuration
- [ ] Build submit configuration:
  - Email notifications (admin email)
  - Confirmation email (to customer)
  - Success message
  - Redirect after submit
  - File download after submit
  - Webhook configuration
  - CRM sync settings

- [ ] Implement security settings:
  - CSRF protection toggle
  - Rate limiting configuration
  - Honeypot field
  - CAPTCHA integration
  - File upload restrictions

#### 4.4 Form Preview & Testing
- [ ] Build form preview component:
  - Live preview of form
  - Test submission functionality
  - Validation testing

---

## Giai đoạn 2: Customer Request Management - 3 tuần

### Tuần 5: Customer Request List & Processing
**Mục tiêu**: Hoàn thành module quản lý yêu cầu khách hàng

#### 5.1 Request List View
- [ ] Build customer request list với columns:
  - Khách hàng (từ trường name role)
  - Điện thoại (từ trường phone role)
  - Email (từ trường email role)
  - Biểu mẫu
  - CTA (nếu có)
  - Trang phát sinh
  - Ngày gửi
  - Trạng thái
  - Người phụ trách
  - Hành động

- [ ] Implement advanced filtering:
  - Theo biểu mẫu
  - Theo CTA
  - Theo trang
  - Theo trạng thái
  - Theo người phụ trách
  - Theo khoảng thời gian
  - Theo chiến dịch (UTM parameters)
  - Theo từ khóa

- [ ] Implement sorting:
  - Theo ngày gửi, trạng thái, ưu tiên

- [ ] Implement bulk actions:
  - Bulk assign
  - Bulk change status
  - Bulk add tags
  - Bulk export

#### 5.2 Request Detail View
- [ ] Build request detail screen với các tabs:
  - **Tab Thông tin khách hàng**:
    - Table hiển thị tất cả fields từ form
    - File attachments với download links
    - Metadata (ngày gửi, IP, device info)

  - **Tab Nguồn phát sinh**:
    - Trang phát sinh ( với link)
    - CTA được nhấn
    - Biểu mẫu được sử dụng
    - Vị trí hiển thị
    - UTM parameters
    - Referrer

  - **Tab Xử lý**:
    - Trạng thái (dropdown)
    - Người phụ trách (user selector)
    - Mức độ ưu tiên
    - Nhóm xử lý
    - Tags/labels
    - Internal notes

  - **Tab Lịch sử**:
    - Timeline của tất cả actions
    - Filters theo loại action

#### 5.3 Processing Workflow
- [ ] Implement status transitions:
  - Mới → Đã tiếp nhận → Đang xử lý → Đã liên hệ → Hoàn thành
  - Mới → Không phù hợp
  - Mới → Hủy

- [ ] Implement assignment system:
  - Assign to individual user
  - Assign to team/group
  - Auto-assignment rules

- [ ] Implement notes system:
  - Add internal notes
  - Rich text editor for notes
  - Note visibility settings

- [ ] Implement duplicate detection:
  - Warning if email/phone already exists
  - Show related requests
  - Manual merge capability (future)

### Tuần 6: Export & Analytics
**Mục tiêu**: Hoàn thành chức năng xuất dữ liệu và thống kê

#### 6.1 Export Functionality
- [ ] Implement Excel export:
  - Export single form data (preserves form structure)
  - Export multiple forms (merged structure)
  - Export with current filters
  - Column selection for export
  - Export scheduling (future)

- [ ] Implement export permissions:
  - Role-based export access
  - Export logging
  - Data retention policies

#### 6.2 Analytics Dashboard
- [ ] Build customer request analytics:
  - Summary cards:
    - Tổng yêu cầu
    - Yêu cầu hôm nay
    - Chưa tiếp nhận
    - Đang xử lý
    - Đã hoàn thành
  - Charts:
    - Requests over time
    - Requests by form
    - Requests by CTA
    - Requests by page
    - Requests by status
    - Processing time distribution

- [ ] Implement date range filtering
- [ ] Implement drill-down functionality

### Tuần 7: Integration & Testing
**Mục tiêu**: Tích hợp và test toàn bộ hệ thống

#### 7.1 Frontend Integration
- [ ] Integrate CTA selector vào trang nội dung:
  - Add CTA picker trong page editor
  - Support multiple CTA slots per section
  - CTA preview in page context

- [ ] Integrate Form embedding:
  - Add form picker trong page editor
  - Support direct form embedding
  - Form preview in page context

- [ ] Rich Text Editor integration:
  - Add CTA insertion button
  - Add Form insertion button
  - Implement shortcode/content node system

#### 7.2 Form Submission Flow
- [ ] Implement frontend form rendering:
  - Dynamic form component
  - Field validation
  - File upload handling
  - Submit handling

- [ ] Implement submission processing:
  - Server-side validation
  - Data storage
  - Request creation
  - Email notifications
  - Webhook calls
  - CRM sync (placeholder)

#### 7.3 Testing
- [ ] Unit tests cho core components
- [ ] Integration tests cho API endpoints
- [ ] E2E tests cho critical flows:
  - CTA creation → Form association → Page embedding
  - Form creation → Field configuration → Publishing
  - Form submission → Request creation → Processing
  - Export functionality

- [ ] Performance testing:
  - Large form handling
  - Large dataset export
  - Analytics query performance

---

## Giai đoạn 3: Migration & Rollout - 2 tuần

### Tuần 8: Data Migration
**Mục tiêu**: Chuyển đổi dữ liệu từ module cũ

#### 8.1 Audit Existing Data
- [ ] Inventory existing CTAs:
  - Count all CTAs in content blocks
  - Map CTA types to new action types
  - Identify CTA usage patterns

- [ ] Inventory existing Forms:
  - Count all forms in system
  - Map form fields to new field types
  - Identify form submission data

- [ ] Inventory existing Customer Requests:
  - Count existing leads/submissions
  - Map to new structure
  - Identify data quality issues

#### 8.2 Migration Scripts
- [ ] Create CTA migration script:
  - Extract CTAs from content blocks
  - Convert to new CTA structure
  - Preserve relationships
  - Handle edge cases

- [ ] Create Form migration script:
  - Extract form definitions
  - Convert to new form structure
  - Generate field keys
  - Assign field roles
  - Handle custom fields

- [ ] Create Customer Request migration script:
  - Extract submission data
  - Convert to new structure
  - Preserve timestamps
  - Map source information
  - Handle missing data

#### 8.3 Migration Execution
- [ ] Run migration on staging environment
- [ ] Validate migrated data:
  - Count comparisons
  - Data integrity checks
  - Relationship verification
  - Spot check sample records

- [ ] Fix migration issues
- [ ] Re-run migration until clean
- [ ] Document any data transformations

### Tuần 9: Rollout & Documentation
**Mục tiêu**: Triển khai production và tài liệu hóa

#### 9.1 Production Rollout
- [ ] Deploy database changes:
  - Run migration scripts on production
  - Verify data integrity
  - Monitor for issues

- [ ] Deploy frontend changes:
  - Feature flags for gradual rollout
  - Monitor performance
  - A/B testing if needed

- [ ] Deprecate old modules:
  - Hide old content block CTA/Form features
  - Add migration warnings
  - Plan eventual removal

#### 9.2 Documentation
- [ ] User documentation:
  - CTA management guide
  - Form builder guide
  - Customer request processing guide
  - Analytics interpretation guide

- [ ] Technical documentation:
  - API documentation
  - Database schema documentation
  - Integration guide
  - Troubleshooting guide

- [ ] Training materials:
  - Admin training slides
  - Video tutorials
  - FAQ document

#### 9.3 Monitoring & Support
- [ ] Set up monitoring:
  - Error tracking
  - Performance monitoring
  - Usage analytics

- [ ] Create support process:
  - Issue escalation path
  - Bug report template
  - Feature request process

---

## Giai đoạn 4: Advanced Features - 3 tuần (Future)

### Tuần 10-12: Advanced Features
**Mục tiêu**: Phát triển các tính năng nâng cao

#### Advanced CTA Features
- [ ] A/B testing cho CTAs
- [ ] CTA scheduling and expiration
- [ ] Advanced targeting rules
- [ ] CTA performance insights

#### Advanced Form Features
- [ ] Conditional logic for fields
- [ ] Multi-step forms
- [ ] Form templates
- [ ] Advanced validation rules
- [ ] Form analytics (field completion rates, drop-off points)

#### Advanced Request Features
- [ ] Customer profiles (aggregating requests by customer)
- [ ] SLA tracking
- [ ] Automated workflows
- [ ] Integration với CRM systems
- [ ] Advanced reporting

#### Advanced Analytics
- [ ] GA4 integration
- [ ] Custom dashboards
- [ ] Attribution modeling
- [ ] Predictive analytics

---

## Rủi ro & Giải pháp (Risks & Mitigation)

### 1. Data Migration Complexity
**Rủi ro**: Dữ liệu cũ có cấu trúc phức tạp, khó chuyển đổi hoàn toàn
**Giải pháp**: 
- Audit kỹ lưỡng trước khi migration
- Tạo scripts có thể chạy lại nhiều lần
- Có rollback plan
- Chạy song song trên staging trước

### 2. Performance Issues
**Rủi ro**: Số lượng request lớn có thể ảnh hưởng performance
**Giải pháp**:
- Optimize database queries
- Implement caching
- Use pagination cho large datasets
- Monitor performance closely

### 3. User Adoption
**Rủi ro**: Người dùng không quen với workflow mới
**Giải pháp**:
- Training comprehensive
- Documentation chi tiết
- Support trong giai đoạn transition
- Collect feedback và iterate

### 4. Integration Complexity
**Rủi ro**: Tích hợp với existing modules có thể gây conflict
**Giải pháp**:
- Careful API design
- Version compatibility considerations
- Feature flags cho gradual rollout
- Thorough testing

---

## Success Metrics

### Technical Metrics
- [ ] Migration success rate > 99%
- [ ] API response time < 200ms (p95)
- [ ] Page load time impact < 100ms
- [ ] Zero data loss during migration
- [ ] Test coverage > 80%

### Business Metrics
- [ ] User adoption rate > 80% sau 1 tháng
- [ ] Average request processing time giảm 30%
- [ ] Form completion rate tăng 15%
- [ ] CTR improvement on key CTAs
- [ ] Support requests related to system giảm 50%

---

## Resources Needed

### Development Team
- 2 Senior Frontend Developers
- 1 Backend Developer  
- 1 Database Developer
- 1 QA Engineer
- 1 UI/UX Designer

### Infrastructure
- Staging environment
- Production environment with backup
- Monitoring tools
- Error tracking tools

### Timeline Summary
- **Giai đoạn 1**: 4 tuần (Core Foundation)
- **Giai đoạn 2**: 3 tuần (Customer Request Management)
- **Giai đoạn 3**: 2 tuần (Migration & Rollout)
- **Giai đoạn 4**: 3 tuần (Advanced Features - Future)

**Tổng cộng**: 9 tuần cho core system + 3 tuần advanced features

---

## Next Steps

1. Review và approve development plan
2. Set up development environment
3. Begin database schema design (Tuần 1)
4. Start frontend foundation components (Tuần 2)
5. Regular progress reviews (weekly)
6. Adjust timeline based on findings
