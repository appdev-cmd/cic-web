# Review và Tinh chỉnh Technical Specification
# Customer Interaction System - Specification Review & Refinement

## Tổng quan (Overview)

Dựa trên phân tích codebase hiện tại và technical specification ban đầu, tài liệu này nhận diện các khoảng trống kỹ thuật (technical gaps) và đề xuất giải pháp để tinh chỉnh specification.

---

## 1. Technical Gaps Đã Nhận Diện (Identified Technical Gaps)

### 1.1 Database Schema Gaps

#### Gap 1.1.1: Thiếu Indexes cho Performance
**Vấn đề**: Schema đề xuất thiếu indexes cho các queries thường xuyên
**Ảnh hưởng**: Performance sẽ giảm khi dữ liệu lớn
**Giải pháp đề xuất**:

```sql
-- Thêm indexes cho ctas table
CREATE INDEX idx_ctas_status ON ctas(status);
CREATE INDEX idx_ctas_code ON ctas(code);
CREATE INDEX idx_ctas_created_at ON ctas(created_at DESC);

-- Thêm indexes cho forms table
CREATE INDEX idx_forms_status ON forms(status);
CREATE INDEX idx_forms_code ON forms(code);
CREATE INDEX idx_forms_current_version ON forms(current_version);

-- Thêm indexes cho form_fields table
CREATE INDEX idx_form_fields_form_id ON form_fields(form_id);
CREATE INDEX idx_form_fields_form_version ON form_fields(form_id, form_version);
CREATE INDEX idx_form_fields_field_key ON form_fields(field_key);

-- Thêm indexes cho form_submissions table (QUAN TRỌNG)
CREATE INDEX idx_submissions_form_id ON form_submissions(form_id);
CREATE INDEX idx_submissions_status ON form_submissions(status);
CREATE INDEX idx_submissions_submitted_at ON form_submissions(submitted_at DESC);
CREATE INDEX idx_submissions_assigned_user ON form_submissions(assigned_user_id);
CREATE INDEX idx_submissions_page_id ON form_submissions(page_id);
CREATE INDEX idx_submissions_cta_id ON form_submissions(cta_id);

-- Thêm indexes cho form_submission_values table
CREATE INDEX idx_submission_values_submission_id ON form_submission_values(submission_id);
CREATE INDEX idx_submission_values_field_key ON form_submission_values(field_key);

-- Thêm indexes cho conversion_events table
CREATE INDEX idx_conversion_events_type ON conversion_events(event_type);
CREATE INDEX idx_conversion_events_created_at ON conversion_events(created_at DESC);
CREATE INDEX idx_conversion_events_cta_id ON conversion_events(cta_id);
CREATE INDEX idx_conversion_events_form_id ON conversion_events(form_id);
```

#### Gap 1.1.2: Thiếu Partitioning cho Large Tables
**Vấn đề**: Tables như `form_submissions` và `conversion_events` sẽ phát triển lớn theo thời gian
**Ảnh hưởng**: Queries sẽ chậm dần, backup/restore sẽ tốn thời gian
**Giải pháp đề xuất**:

```sql
-- Partition form_submissions by month
CREATE TABLE form_submissions (
  -- ... columns ...
) PARTITION BY RANGE (submitted_at);

-- Create monthly partitions
CREATE TABLE form_submissions_2026_01 PARTITION OF form_submissions
  FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');

CREATE TABLE form_submissions_2026_02 PARTITION OF form_submissions
  FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');

-- Tương tự cho conversion_events
```

#### Gap 1.1.3: Thiếu Soft Delete Mechanism
**Vấn đề**: Specification đề xuất soft delete nhưng không có cột `deleted_at` trong schema
**Ảnh hưởng**: Không thể khôi phục dữ liệu bị xóa nhầm
**Giải pháp đề xuất**:

```sql
-- Thêm deleted_at vào tất cả các bảng chính
ALTER TABLE ctas ADD COLUMN deleted_at TIMESTAMP;
ALTER TABLE forms ADD COLUMN deleted_at TIMESTAMP;
ALTER TABLE form_fields ADD COLUMN deleted_at TIMESTAMP;
ALTER TABLE form_submissions ADD COLUMN deleted_at TIMESTAMP;

-- Create index cho deleted_at
CREATE INDEX idx_ctas_deleted_at ON ctas(deleted_at);
CREATE INDEX idx_forms_deleted_at ON forms(deleted_at);
```

### 1.2 API Design Gaps

#### Gap 1.2.1: Thiếu Error Response Standards
**Vấn đề**: Không có standard format cho error responses
**Ảnh hưởng**: Frontend khó xử lý errors một cách nhất quán
**Giải pháp đề xuất**:

```typescript
// Standard error response format
interface ApiErrorResponse {
  success: false;
  error: {
    code: string;              // e.g., 'VALIDATION_ERROR', 'NOT_FOUND'
    message: string;           // User-friendly message
    details?: any;             // Additional error details
    field?: string;            // Field name for validation errors
  };
  timestamp: string;
}

// Standard success response format
interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    perPage?: number;
  };
}
```

#### Gap 1.2.2: Thiếu Pagination Standards
**Vấn đề**: Không có standard pagination parameters
**Ảnh hưởng**: Inconsistent pagination implementation
**Giải pháp đề xuất**:

```typescript
interface PaginationParams {
  page: number;               // Default: 1
  perPage: number;            // Default: 20, Max: 100
  sortBy?: string;            // e.g., 'created_at', 'name'
  sortOrder?: 'asc' | 'desc'; // Default: 'desc'
}

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
```

#### Gap 1.2.3: Thiếu Rate Limiting Specification
**Vấn đề**: Form submissions cần rate limiting nhưng không có spec chi tiết
**Ảnh hưởng**: Có thể bị spam attacks
**Giải pháp đề xuất**:

```typescript
interface RateLimitConfig {
  formId: string;
  enabled: boolean;
  maxSubmissions: number;     // Max submissions per window
  windowMinutes: number;      // Time window in minutes
  blockDurationMinutes: number; // How long to block after limit
  bypassSecret?: string;      // Secret to bypass rate limit
}

// API endpoint to check rate limit
GET /api/forms/:id/rate-limit-check
Response: {
  allowed: boolean;
  remaining: number;
  resetAt: string;
}
```

### 1.3 Frontend Integration Gaps

#### Gap 1.3.1: Thiếu CTA Slot Configuration
**Vấn đề**: Specification không định nghĩa rõ cách configure CTA slots trong existing components
**Ảnh hưởng**: Frontend developers không biết cách integrate
**Giải pháp đề xuất**:

```typescript
// Define CTA slots configuration interface
interface CtaSlotConfig {
  component: string;           // e.g., 'Hero', 'ProductDetail'
  slotKey: string;             // e.g., 'primary_cta', 'secondary_cta'
  slotName: string;            // e.g., 'CTA chính', 'CTA phụ'
  maxCtas: number;             // Số CTA tối đa cho slot này
  allowedActionTypes: ActionType[]; // Các action types được phép
}

// Example usage
const HERO_CTA_SLOTS: CtaSlotConfig[] = [
  {
    component: 'Hero',
    slotKey: 'primary_cta',
    slotName: 'CTA chính',
    maxCtas: 1,
    allowedActionTypes: ['open_form', 'redirect_internal', 'redirect_external'],
  },
  {
    component: 'Hero',
    slotKey: 'secondary_cta',
    slotName: 'CTA phụ',
    maxCtas: 1,
    allowedActionTypes: ['redirect_internal', 'redirect_external'],
  },
];
```

#### Gap 1.3.2: Thiếu Rich Text Editor Integration Spec
**Vấn đề**: Specification đề xuất shortcode/content node nhưng không có implementation details
**Ảnh hưởng**: Không thể integrate với existing Rich Text Editor
**Giải pháp đề xuất**:

```typescript
// Content node structure for CTA/Form insertion
interface CtaContentNode {
  type: 'cta';
  ctaId: string;
  // Preview data (snapshot)
  preview: {
    displayText: string;
    actionType: ActionType;
  };
}

interface FormContentNode {
  type: 'form';
  formId: string;
  // Preview data (snapshot)
  preview: {
    title: string;
    fieldCount: number;
  };
}

// Rich Text Editor plugin interface
interface CustomerInteractionPlugin {
  insertCta(ctaId: string): void;
  insertForm(formId: string): void;
  renderContentNode(node: CtaContentNode | FormContentNode): ReactNode;
  updateContentNode(nodeId: string, newData: any): void;
}
```

### 1.4 Security Gaps

#### Gap 1.4.1: Thiếu File Upload Security Details
**Vấn đề**: Specification đề xuất file upload nhưng không có security measures chi tiết
**Ảnh hưởng**: Có thể bị malicious file uploads
**Giải pháp đề xuất**:

```typescript
interface FileUploadSecurityConfig {
  // File type restrictions
  allowedMimeTypes: string[];  // e.g., ['image/jpeg', 'application/pdf']
  allowedExtensions: string[]; // e.g., ['.jpg', '.pdf', '.doc']
  
  // File size limits
  maxFileSize: number;          // in bytes
  maxTotalSize: number;         // Total size for multiple files
  
  // Security scanning
  scanForViruses: boolean;
  scanForMalware: boolean;
  
  // Storage configuration
  storageLocation: 'local' | 's3' | 'azure';
  storagePath: string;
  
  // Access control
  accessLevel: 'public' | 'private' | 'restricted';
  expirationDays?: number;      // Auto-delete after X days
}

// Validation endpoint
POST /api/files/validate-upload
Request: {
  fileName: string;
  fileSize: number;
  mimeType: string;
}
Response: {
  allowed: boolean;
  reason?: string;
}
```

#### Gap 1.4.2: Thiếu Data Encryption Specification
**Vấn đề**: Customer data có thể nhạy cảm nhưng không có encryption spec
**Ảnh hưởng**: Vi phạm bảo mật dữ liệu cá nhân
**Giải pháp đề xuất**:

```typescript
interface DataEncryptionConfig {
  // Fields to encrypt at rest
  encryptedFields: string[];   // e.g., ['email', 'phone', 'company']
  
  // Encryption method
  algorithm: 'AES-256-GCM';
  keyRotationDays: number;     // Key rotation interval
  
  // Data in transit
  enforceHttps: boolean;
  tlsVersion: '1.2' | '1.3';
}

// GDPR compliance features
interface GdprConfig {
  dataRetentionDays: number;    // Auto-delete after X days
  rightToDeletion: boolean;    // Support deletion requests
  dataPortability: boolean;    // Export user data
  consentManagement: boolean;  // Track consent
}
```

### 1.5 Analytics Gaps

#### Gap 1.5.1: Thiếu Real-time Analytics Specification
**Vấn đề**: Specification đề xuất analytics nhưng không có real-time requirements
**Ảnh hưởng**: Không thể monitoring trends in real-time
**Giải pháp đề xuất**:

```typescript
interface RealTimeAnalyticsConfig {
  enabled: boolean;
  updateInterval: number;      // milliseconds
  metrics: string[];           // e.g., ['impressions', 'clicks', 'submissions']
  
  // WebSocket configuration
  websocketEnabled: boolean;
  websocketEndpoint: string;
}

// Real-time data structure
interface RealTimeMetrics {
  timestamp: string;
  ctaMetrics: {
    [ctaId: string]: {
      impressions: number;
      clicks: number;
      ctr: number;
    };
  };
  formMetrics: {
    [formId: string]: {
      opens: number;
      submissions: number;
      completionRate: number;
    };
  };
}
```

#### Gap 1.5.2: Thiếu Attribution Modeling
**Vấn đề**: Không có cách để track conversion attribution
**Ảnh hưởng**: Không biết được CTA/Form nào thực sự hiệu quả
**Giải pháp đề xuất**:

```typescript
interface AttributionConfig {
  model: 'first_touch' | 'last_touch' | 'linear' | 'time_decay';
  lookbackDays: number;        // Attribution window
  
  // Touchpoint tracking
  trackCtaViews: boolean;
  trackFormViews: boolean;
  trackPageViews: boolean;
}

interface AttributionData {
  submissionId: string;
  attributedCtaId?: string;
  attributedFormId: string;
  attributionScore: number;    // 0-1
  touchpoints: Touchpoint[];
}

interface Touchpoint {
  type: 'cta_view' | 'cta_click' | 'form_view' | 'page_view';
  resourceId: string;
  timestamp: string;
  score: number;
}
```

---

## 2. Tinh chỉnh Specification (Specification Refinements)

### 2.1 Database Schema Refinements

#### Refinement 2.1.1: Thêm Audit Trail
**Thêm**: Audit trail cho tất cả các thay đổi quan trọng

```sql
-- Audit log table
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  table_name VARCHAR(100) NOT NULL,
  record_id INTEGER NOT NULL,
  action VARCHAR(20) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
  old_values JSONB,
  new_values JSONB,
  changed_by INTEGER NOT NULL,
  changed_at TIMESTAMP NOT NULL DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

CREATE INDEX idx_audit_logs_table_record ON audit_logs(table_name, record_id);
CREATE INDEX idx_audit_logs_changed_at ON audit_logs(changed_at DESC);
```

#### Refinement 2.1.2: Thêm Full-text Search Support
**Thêm**: Full-text search cho customer requests

```sql
-- Add full-text search for customer requests
ALTER TABLE form_submissions 
ADD COLUMN search_vector tsvector;

CREATE INDEX idx_submissions_search ON form_submissions USING GIN(search_vector);

-- Update trigger to maintain search vector
CREATE OR REPLACE FUNCTION update_submission_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('vietnamese', 
    COALESCE(NEW.raw_data_json::text, '') || ' ' ||
    COALESCE(NEW.page_title, '') || ' ' ||
    COALESCE(NEW.page_url, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_submission_search
  BEFORE INSERT OR UPDATE ON form_submissions
  FOR EACH ROW EXECUTE FUNCTION update_submission_search_vector();
```

### 2.2 API Refinements

#### Refinement 2.2.1: Thêm Batch Operations
**Thêm**: Batch operations cho performance

```typescript
// Batch CTA operations
POST /api/ctas/batch
Request: {
  operations: Array<{
    action: 'create' | 'update' | 'delete';
    data?: CtaItem;
    id?: string;
  }>;
}
Response: {
  results: Array<{
    success: boolean;
    action: string;
    id?: string;
    error?: string;
  }>;
}

// Batch form field operations
POST /api/forms/:id/fields/batch
Request: {
  operations: Array<{
    action: 'create' | 'update' | 'delete' | 'reorder';
    data?: FormField;
    id?: string;
    position?: number;
  }>;
}
```

#### Refinement 2.2.2: Thêm Webhook System
**Thêm**: Webhook system cho integrations

```typescript
interface WebhookConfig {
  id: string;
  eventTypes: string[];        // e.g., ['form.submitted', 'request.status_changed']
  endpointUrl: string;
  secret: string;              // For signature verification
  headers: Record<string, string>;
  retryConfig: {
    maxRetries: number;
    retryDelay: number;        // seconds
  };
  isActive: boolean;
}

// Webhook endpoints
POST /api/webhooks
GET /api/webhooks
PUT /api/webhooks/:id
DELETE /api/webhooks/:id
POST /api/webhooks/:id/test
```

### 2.3 Frontend Refinements

#### Refinement 2.3.1: Thêm Offline Support
**Thêm**: Offline support cho form submissions

```typescript
interface OfflineFormSubmission {
  formId: string;
  formData: Record<string, any>;
  timestamp: string;
  status: 'pending' | 'synced' | 'failed';
}

// Service Worker for offline support
interface OfflineSupportConfig {
  enabled: boolean;
  autoSync: boolean;
  syncInterval: number;        // minutes
  maxPendingSubmissions: number;
}
```

#### Refinement 2.3.2: Thêm Progressive Enhancement
**Thêm**: Progressive enhancement cho forms

```typescript
interface ProgressiveFormConfig {
  // Fallback khi JavaScript bị disable
  serverSideRendering: boolean;
  
  // Gradual enhancement
  loadProgressively: boolean;
  priorityFields: string[];     // Fields to load first
  
  // Performance optimization
  lazyLoadValidation: boolean;
  debounceValidation: number;  // milliseconds
}
```

### 2.4 Security Refinements

#### Refinement 2.4.1: Thêm 2FA Support
**Thêm**: Two-factor authentication cho admin actions

```typescript
interface TwoFactorConfig {
  enabled: boolean;
  requiredFor: string[];       // Actions requiring 2FA
                                 // e.g., ['delete_cta', 'export_data']
  methods: ('totp' | 'sms' | 'email')[];
  backupCodes: string[];
}

// 2FA verification endpoint
POST /api/auth/verify-2fa
Request: {
  action: string;
  code: string;
}
Response: {
  verified: boolean;
  token?: string;              // Temporary token for action
}
```

#### Refinement 2.4.2: Thêm RBAC Enhancements
**Thêm**: Enhanced role-based access control

```typescript
interface EnhancedPermission {
  resource: string;            // e.g., 'cta', 'form', 'request'
  action: string;              // e.g., 'create', 'read', 'update', 'delete'
  conditions?: {
    // Attribute-based access control
    ownedOnly?: boolean;        // Only own records
    status?: string[];          // Specific statuses
    department?: string[];      // Specific departments
  };
}

interface Role {
  id: string;
  name: string;
  permissions: EnhancedPermission[];
  inheritsFrom?: string[];     // Role inheritance
}
```

---

## 3. Priority Recommendations

### High Priority (Phải implement ngay)
1. **Database Indexes** - Critical cho performance
2. **Error Response Standards** - Essential cho error handling
3. **Pagination Standards** - Required cho consistent UX
4. **File Upload Security** - Critical cho security
5. **Rate Limiting** - Essential cho spam prevention

### Medium Priority (Nên implement trong giai đoạn 1)
1. **Soft Delete Mechanism** - Important cho data recovery
2. **Batch Operations** - Useful cho performance
3. **Audit Trail** - Important cho compliance
4. **CTA Slot Configuration** - Required cho integration
5. **Rich Text Editor Integration** - Required cho usability

### Low Priority (Có thể để giai đoạn 2)
1. **Real-time Analytics** - Nice to have
2. **Attribution Modeling** - Advanced feature
3. **Offline Support** - Progressive enhancement
4. **2FA Support** - Security enhancement
5. **Full-text Search** - Performance optimization

---

## 4. Migration Considerations

### 4.1 Database Migration Strategy
```sql
-- Migration script template
BEGIN;

-- 1. Create new tables
CREATE TABLE ctas_new (...);

-- 2. Migrate data
INSERT INTO ctas_new (...)
SELECT ... FROM ctas_old;

-- 3. Create indexes
CREATE INDEX ...;

-- 4. Update foreign keys
-- ...

-- 5. Switch tables
DROP TABLE ctas_old;
ALTER TABLE ctas_new RENAME TO ctas;

COMMIT;
```

### 4.2 Backward Compatibility
- Giữ lại old API endpoints với deprecation warnings
- Support cả old và new data formats trong transition period
- Feature flags để gradual rollout

---

## 5. Testing Strategy

### 5.1 Database Testing
```sql
-- Performance testing queries
EXPLAIN ANALYZE SELECT * FROM form_submissions 
WHERE form_id = 1 AND status = 'new' 
ORDER BY submitted_at DESC LIMIT 20;

-- Data integrity testing
SELECT COUNT(*) FROM form_submissions 
WHERE form_id NOT IN (SELECT id FROM forms WHERE deleted_at IS NULL);
```

### 5.2 API Testing
```typescript
// Load testing configuration
interface LoadTestConfig {
  endpoint: string;
  concurrentUsers: number;
  duration: number;
  requestsPerSecond: number;
}

// Security testing
interface SecurityTestConfig {
  testSqlInjection: boolean;
  testXss: boolean;
  testCsrf: boolean;
  testRateLimiting: boolean;
}
```

---

## 6. Documentation Requirements

### 6.1 API Documentation
- OpenAPI/Swagger specification
- Request/response examples cho tất cả endpoints
- Error code documentation
- Rate limiting documentation

### 6.2 Database Documentation
- ERD diagram
- Table descriptions
- Index descriptions
- Migration scripts documentation

### 6.3 Integration Documentation
- CTA slot integration guide
- Rich Text Editor plugin guide
- Webhook integration guide
- Analytics integration guide

---

## 7. Next Steps

1. **Review và approve** các refinements được đề xuất
2. **Update technical specification** với các refinements
3. **Create detailed implementation plan** cho high-priority items
4. **Set up development environment** với các configurations mới
5. **Begin implementation** starting với database schema refinements

---

## Conclusion

Technical specification ban đầu đã comprehensive, nhưng có một số gaps quan trọng cần được addressed trước khi bắt đầu implementation. Các refinements được đề xuất trong tài liệu này sẽ:

- **Improve performance** thông qua indexes và partitioning
- **Enhance security** với file upload security và encryption
- **Ensure consistency** với standardized API responses
- **Enable integration** với clear CTA slot và Rich Text Editor specs
- **Support scalability** với batch operations và real-time analytics

Việc address các gaps này trước khi bắt đầu development sẽ giúp tránh được costly rework và ensure hệ thống meets production requirements.