# Cấu Trúc Project Hệ Thống Tương Tác Khách Hàng
# Customer Interaction System - Project Structure

## Tổng quan cấu trúc (Structure Overview)

```
src/cms/modules/customer_interaction/
├── cta/                          # CTA Management Module
│   ├── components/
│   │   ├── CtaList.tsx
│   │   ├── CtaCard.tsx
│   │   ├── CtaEditor.tsx
│   │   ├── CtaPreview.tsx
│   │   ├── ActionTypeSelector.tsx
│   │   ├── CtaAnalytics.tsx
│   │   └── UsedByDrawer.tsx
│   ├── CtaManager.tsx
│   ├── types.ts
│   └── mockData.ts
│
├── forms/                        # Form Management Module
│   ├── components/
│   │   ├── FormList.tsx
│   │   ├── FormCard.tsx
│   │   ├── FormBuilder.tsx
│   │   ├── FormFieldEditor.tsx
│   │   ├── FieldTypeSelector.tsx
│   │   ├── ValidationConfig.tsx
│   │   ├── OptionEditor.tsx
│   │   ├── FormPreview.tsx
│   │   ├── FormSettings.tsx
│   │   ├── VersionHistoryDrawer.tsx
│   │   └── FormAnalytics.tsx
│   ├── FormManager.tsx
│   ├── types.ts
│   └── mockData.ts
│
├── customer_requests/            # Customer Request Management Module
│   ├── components/
│   │   ├── RequestList.tsx
│   │   ├── RequestCard.tsx
│   │   ├── RequestDetail.tsx
│   │   ├── CustomerInfoTab.tsx
│   │   ├── SourceInfoTab.tsx
│   │   ├── ProcessingTab.tsx
│   │   ├── HistoryTab.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── AssigneeSelector.tsx
│   │   ├── NotesTimeline.tsx
│   │   ├── RequestFilters.tsx
│   │   ├── ExportModal.tsx
│   │   └── RequestAnalytics.tsx
│   ├── CustomerRequestManager.tsx
│   ├── types.ts
│   └── mockData.ts
│
├── shared/                       # Shared Components & Utilities
│   ├── components/
│   │   ├── FieldRoleBadge.tsx
│   │   ├── FormFieldPreview.tsx
│   │   ├── SubmissionValuesTable.tsx
│   │   ├── SourceInfoDisplay.tsx
│   │   ├── ConversionRateCard.tsx
│   │   └── DateRangePicker.tsx
│   ├── utils/
│   │   ├── formHelpers.ts
│   │   ├── ctaHelpers.ts
│   │   ├── exportHelpers.ts
│   │   ├── validationHelpers.ts
│   │   └── analyticsHelpers.ts
│   ├── constants/
│   │   ├── actionTypes.ts
│   │   ├── fieldTypes.ts
│   │   ├── statusTypes.ts
│   │   └── roleTypes.ts
│   └── types.ts
│
├── data/                         # Data Sources
│   ├── CtaDataSource.ts
│   ├── FormDataSource.ts
│   └── CustomerRequestDataSource.ts
│
├── api/                          # API Clients (nếu cần)
│   ├── ctaApi.ts
│   ├── formApi.ts
│   └── customerRequestApi.ts
│
├── index.ts                      # Module exports
└── types.ts                      # Shared types
```

---

## Chi tiết từng module (Module Details)

### 1. CTA Module (`cta/`)

#### File Structure
```
cta/
├── components/
│   ├── CtaList.tsx                 # List view của tất cả CTAs
│   ├── CtaCard.tsx                 # Card component hiển thị single CTA
│   ├── CtaEditor.tsx               # Form tạo/chỉnh sửa CTA
│   ├── CtaPreview.tsx               # Real-time preview component
│   ├── ActionTypeSelector.tsx      # Dropdown chọn loại hành động
│   ├── CtaAnalytics.tsx            # Analytics dashboard cho CTA
│   └── UsedByDrawer.tsx           # Drawer hiển thị nơi CTA được dùng
├── CtaManager.tsx                  # Main manager component
├── types.ts                        # TypeScript types cho CTA
└── mockData.ts                     # Mock data cho development
```

#### Key Types (types.ts)
```typescript
export type ActionType = 
  | 'open_form'           // Mở biểu mẫu
  | 'redirect_internal'   // Redirect URL nội bộ
  | 'redirect_external'   // Redirect URL bên ngoài
  | 'scroll_to_section'   // Cuộn tới section
  | 'download_file'       // Tải file
  | 'call_phone'          // Gọi điện
  | 'send_email'          // Gửi email
  | 'custom_action';      // Hành động tùy chỉnh

export type CtaStatus = 'active' | 'inactive' | 'draft' | 'archived';

export interface CtaActionConfig {
  type: ActionType;
  // Dynamic fields based on type
  formId?: string;                    // Cho open_form
  url?: string;                       // Cho redirect
  openInNewTab?: boolean;             // Cho redirect
  sectionId?: string;                 // Cho scroll_to_section
  fileId?: string;                    // Cho download_file
  phoneNumber?: string;               // Cho call_phone
  emailAddress?: string;              // Cho send_email
  customAction?: string;             // Cho custom_action
}

export interface CtaItem {
  id: string;
  adminName: string;                  // Tên quản trị
  displayText: string;                // Nội dung hiển thị
  description?: string;               // Mô tả nội bộ
  code: string;                       // Mã định danh
  icon?: string;                      // Icon name
  actionConfig: CtaActionConfig;      // Cấu hình hành động
  status: CtaStatus;
  usedByCount: number;                // Số vị trí đang sử dụng
  usedByPages: Array<{                // Chi tiết vị trí sử dụng
    pageId: string;
    pageTitle: string;
    pagePath: string;
    placementKey: string;
  }>;
  analytics: {
    impressions: number;
    clicks: number;
    ctr: number;
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
```

---

### 2. Forms Module (`forms/`)

#### File Structure
```
forms/
├── components/
│   ├── FormList.tsx                 # List view của tất cả forms
│   ├── FormCard.tsx                 # Card component hiển thị single form
│   ├── FormBuilder.tsx              # Drag-drop form builder
│   ├── FormFieldEditor.tsx          # Editor cho单个 field
│   ├── FieldTypeSelector.tsx        # Chọn loại field
│   ├── ValidationConfig.tsx         # Cấu hình validation
│   ├── OptionEditor.tsx             # Editor cho options (select/radio/checkbox)
│   ├── FormPreview.tsx              # Live preview của form
│   ├── FormSettings.tsx             # Cấu hình form (email, webhook, etc.)
│   ├── VersionHistoryDrawer.tsx     # Lịch sử version
│   └── FormAnalytics.tsx           # Analytics dashboard cho form
├── FormManager.tsx                  # Main manager component
├── types.ts                        # TypeScript types cho Forms
└── mockData.ts                     # Mock data cho development
```

#### Key Types (types.ts)
```typescript
export type FieldType =
  | 'text'
  | 'textarea'
  | 'email'
  | 'phone'
  | 'number'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'file_upload'
  | 'hidden'
  | 'consent';

export type FieldRoleType =
  | 'customer_name'      // Họ tên khách hàng
  | 'email'              // Email
  | 'phone'              // Số điện thoại
  | 'company'            // Công ty
  | 'message'            // Tin nhắn/nội dung
  | 'other';             // Khác

export type FormStatus = 'active' | 'inactive' | 'draft' | 'archived';

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;              // Regex pattern
  min?: number;                 // Cho number/date
  max?: number;                 // Cho number/date
  customMessage?: string;
}

export interface FieldOption {
  value: string;
  label: string;
  order?: number;
}

export interface FormField {
  id: string;
  fieldKey: string;              // Mã trường (không đổi sau khi có data)
  label: string;                 // Nhãn hiển thị
  fieldType: FieldType;
  roleType?: FieldRoleType;       // Vai trò của trường
  placeholder?: string;
  helpText?: string;
  validation: FieldValidation;
  options?: FieldOption[];        // Cho select/radio/checkbox
  fileConfig?: {                  // Cho file_upload
    allowedTypes: string[];
    maxSize: number;              // in bytes
    maxFiles: number;
  };
  position: number;
  isRequired: boolean;
  isLocked: boolean;              // Khóa khi đã có data
}

export interface FormSubmitConfig {
  saveToDatabase: boolean;
  createCustomerRequest: boolean;
  sendAdminEmail: boolean;
  adminEmails: string[];
  sendConfirmationEmail: boolean;
  confirmationEmailTemplate?: string;
  successMessage: string;
  redirectUrl?: string;
  allowFileDownload?: boolean;
  downloadFileId?: string;
  webhookUrl?: string;
  webhookHeaders?: Record<string, string>;
  crmSyncEnabled: boolean;
  crmConfig?: Record<string, any>;
}

export interface FormItem {
  id: string;
  adminName: string;              // Tên quản trị
  title: string;                  // Tiêu đề hiển thị
  description?: string;           // Mô tả
  code: string;                   // Mã định danh
  status: FormStatus;
  currentVersion: number;
  fields: FormField[];
  submitConfig: FormSubmitConfig;
  analytics: {
    opens: number;
    submissions: number;
    completionRate: number;
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
```

---

### 3. Customer Requests Module (`customer_requests/`)

#### File Structure
```
customer_requests/
├── components/
│   ├── RequestList.tsx             # List view của tất cả requests
│   ├── RequestCard.tsx             # Card component hiển thị single request
│   ├── RequestDetail.tsx           # Detail view với tabs
│   ├── CustomerInfoTab.tsx        # Tab thông tin khách hàng
│   ├── SourceInfoTab.tsx           # Tab nguồn phát sinh
│   ├── ProcessingTab.tsx          # Tab xử lý
│   ├── HistoryTab.tsx              # Tab lịch sử
│   ├── StatusBadge.tsx             # Badge hiển thị trạng thái
│   ├── AssigneeSelector.tsx        # Selector chọn người phụ trách
│   ├── NotesTimeline.tsx           # Timeline hiển thị ghi chú
│   ├── RequestFilters.tsx          # Advanced filters
│   ├── ExportModal.tsx             # Modal export dữ liệu
│   └── RequestAnalytics.tsx       # Analytics dashboard
├── CustomerRequestManager.tsx      # Main manager component
├── types.ts                        # TypeScript types
└── mockData.ts                     # Mock data
```

#### Key Types (types.ts)
```typescript
export type RequestStatus =
  | 'new'                // Mới
  | 'received'           // Đã tiếp nhận
  | 'processing'         // Đang xử lý
  | 'contacted'          // Đã liên hệ
  | 'completed'          // Hoàn thành
  | 'not_suitable'       // Không phù hợp
  | 'cancelled';         // Hủy

export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';

export interface SourceConfig {
  formId: string;
  formVersion: number;
  formName: string;
  ctaId?: string;
  ctaName?: string;
  pageType: string;              // 'static_page', 'product', 'service', etc.
  pageId: string;
  pageUrl: string;
  pageTitle: string;
  placementKey?: string;         // Vị trí trên trang
  submittedAt: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
  deviceInfo?: {
    userAgent: string;
    browser: string;
    os: string;
    device: string;
  };
}

export interface SubmissionValue {
  fieldKey: string;
  fieldLabel: string;            // Snapshot của label tại thời điểm submit
  fieldType: FieldType;
  valueText?: string;
  valueJson?: any;               // Cho complex data
  fileId?: string;                // Cho file uploads
}

export interface CustomerRequest {
  id: string;
  sourceConfig: SourceConfig;
  submissionValues: SubmissionValue[];
  status: RequestStatus;
  assignedUserId?: string;
  assignedUserName?: string;
  priority: PriorityLevel;
  tags: string[];
  internalNotes: RequestNote[];
  createdAt: string;
  updatedAt: string;
}

export interface RequestNote {
  id: string;
  content: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
}

export interface RequestLog {
  id: string;
  actionType: string;
  oldValue?: any;
  newValue?: any;
  createdBy: string;
  createdByName: string;
  createdAt: string;
}
```

---

### 4. Shared Module (`shared/`)

#### File Structure
```
shared/
├── components/
│   ├── FieldRoleBadge.tsx           # Badge hiển thị role của field
│   ├── FormFieldPreview.tsx         # Preview component cho field
│   ├── SubmissionValuesTable.tsx    # Table hiển thị submission values
│   ├── SourceInfoDisplay.tsx       # Display component cho source info
│   ├── ConversionRateCard.tsx       # Card hiển thị conversion rate
│   └── DateRangePicker.tsx          # Date range picker component
├── utils/
│   ├── formHelpers.ts               # Helper functions cho forms
│   ├── ctaHelpers.ts               # Helper functions cho CTAs
│   ├── exportHelpers.ts            # Helper functions cho export
│   ├── validationHelpers.ts        # Helper functions cho validation
│   └── analyticsHelpers.ts         # Helper functions cho analytics
├── constants/
│   ├── actionTypes.ts              # Constants cho action types
│   ├── fieldTypes.ts               # Constants cho field types
│   ├── statusTypes.ts              # Constants cho status types
│   └── roleTypes.ts                # Constants cho role types
└── types.ts                        # Shared types
```

#### Key Utilities

**formHelpers.ts**
```typescript
export function generateFieldKey(label: string): string;
export function validateField(field: FormField, value: any): ValidationResult;
export function getStandardFieldKey(roleType: FieldRoleType): string;
export function isFieldLocked(field: FormField, hasData: boolean): boolean;
export function formatSubmissionValue(value: SubmissionValue): string;
```

**ctaHelpers.ts**
```typescript
export function generateCtaCode(name: string): string;
export function getCtaActionLabel(actionType: ActionType): string;
export function validateCtaAction(config: CtaActionConfig): ValidationResult;
export function calculateCTR(impressions: number, clicks: number): number;
```

**exportHelpers.ts**
```typescript
export function exportToExcel(data: any[], filename: string): Promise<void>;
export function mergeFormSubmissions(submissions: any[]): any[];
export function filterExportData(data: any[], filters: ExportFilter): any[];
```

---

### 5. Data Sources (`data/`)

#### File Structure
```
data/
├── CtaDataSource.ts                # Data source cho CTA module
├── FormDataSource.ts               # Data source cho Form module
└── CustomerRequestDataSource.ts    # Data source cho Customer Request module
```

#### Example Data Source Structure

**CtaDataSource.ts**
```typescript
import { CtaItem } from '../cta/types';

export interface CtaModuleData {
  ctas: CtaItem[];
  placements: PlacementZone[];
  usageStats: UsageStats[];
}

export const CtaDataSource: CtaModuleData = {
  ctas: [],
  placements: [],
  usageStats: [],
};

// Mock data cho development
export const MOCK_CTA_DATA: CtaModuleData = {
  ctas: [/* ... */],
  placements: [/* ... */],
  usageStats: [/* ... */],
};
```

---

## Integration với Existing CMS

### 1. Sidebar Integration

Update `src/cms/components/CmsSidebar.tsx`:

```typescript
// Thêm menu item mới
{
  title: 'Tương tác khách hàng',
  icon: Users,
  children: [
    {
      title: 'CTA',
      path: '/customer-interaction/cta',
      icon: MousePointer2,
    },
    {
      title: 'Biểu mẫu',
      path: '/customer-interaction/forms',
      icon: FileText,
    },
    {
      title: 'Yêu cầu khách hàng',
      path: '/customer-interaction/requests',
      icon: MessageSquare,
    },
  ],
}
```

### 2. Routing Integration

Update `src/cms/routing.ts`:

```typescript
// Thêm routes mới
{
  path: '/customer-interaction',
  children: [
    {
      path: 'cta',
      element: <CtaManager />,
    },
    {
      path: 'forms',
      element: <FormManager />,
    },
    {
      path: 'requests',
      element: <CustomerRequestManager />,
    },
  ],
}
```

### 3. Content Blocks Integration

Khi integrating với existing content blocks, cần:

1. Thêm CTA picker vào Content Block Editor
2. Thêm Form picker vào Content Block Editor  
3. Thêm shortcode/content node support vào Rich Text Editor
4. Update Content Block types để support references

---

## Database Schema Mapping

### Table Structure (PostgreSQL)

```sql
-- CTA Tables
CREATE TABLE ctas (
  id SERIAL PRIMARY KEY,
  admin_name VARCHAR(255) NOT NULL,
  display_text VARCHAR(255) NOT NULL,
  description TEXT,
  code VARCHAR(100) UNIQUE NOT NULL,
  icon VARCHAR(100),
  action_type VARCHAR(50) NOT NULL,
  action_config JSONB NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  created_by INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Form Tables
CREATE TABLE forms (
  id SERIAL PRIMARY KEY,
  admin_name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  code VARCHAR(100) UNIQUE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  current_version INTEGER NOT NULL DEFAULT 1,
  submit_config JSONB NOT NULL,
  created_by INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE form_fields (
  id SERIAL PRIMARY KEY,
  form_id INTEGER NOT NULL REFERENCES forms(id),
  form_version INTEGER NOT NULL,
  field_key VARCHAR(100) NOT NULL,
  label VARCHAR(255) NOT NULL,
  field_type VARCHAR(50) NOT NULL,
  role_type VARCHAR(50),
  position INTEGER NOT NULL,
  is_required BOOLEAN NOT NULL DEFAULT FALSE,
  validation_config JSONB,
  option_config JSONB,
  is_locked BOOLEAN NOT NULL DEFAULT FALSE,
  status VARCHAR(20) NOT NULL DEFAULT 'active'
);

-- Customer Request Tables
CREATE TABLE form_submissions (
  id SERIAL PRIMARY KEY,
  form_id INTEGER NOT NULL REFERENCES forms(id),
  form_version INTEGER NOT NULL,
  cta_id INTEGER REFERENCES ctas(id),
  page_type VARCHAR(50),
  page_id INTEGER,
  page_url VARCHAR(500),
  page_title VARCHAR(255),
  placement_key VARCHAR(100),
  submitted_at TIMESTAMP NOT NULL DEFAULT NOW(),
  status VARCHAR(20) NOT NULL DEFAULT 'new',
  assigned_user_id INTEGER,
  source_config JSONB NOT NULL,
  raw_data_json JSONB
);

CREATE TABLE form_submission_values (
  id SERIAL PRIMARY KEY,
  submission_id INTEGER NOT NULL REFERENCES form_submissions(id),
  field_key VARCHAR(100) NOT NULL,
  field_label_snapshot VARCHAR(255),
  field_type_snapshot VARCHAR(50),
  value_text TEXT,
  value_json JSONB,
  file_id INTEGER
);

CREATE TABLE customer_request_notes (
  id SERIAL PRIMARY KEY,
  submission_id INTEGER NOT NULL REFERENCES form_submissions(id),
  content TEXT NOT NULL,
  created_by INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE customer_request_logs (
  id SERIAL PRIMARY KEY,
  submission_id INTEGER NOT NULL REFERENCES form_submissions(id),
  action_type VARCHAR(50) NOT NULL,
  old_value JSONB,
  new_value JSONB,
  created_by INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Analytics Tables
CREATE TABLE conversion_events (
  id SERIAL PRIMARY KEY,
  event_type VARCHAR(50) NOT NULL,
  cta_id INTEGER REFERENCES ctas(id),
  form_id INTEGER REFERENCES forms(id),
  submission_id INTEGER REFERENCES form_submissions(id),
  page_type VARCHAR(50),
  page_id INTEGER,
  page_url VARCHAR(500),
  session_key VARCHAR(100),
  event_data JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

---

## Naming Conventions

### File Naming
- Components: PascalCase (e.g., `CtaList.tsx`)
- Utilities: camelCase (e.g., `formHelpers.ts`)
- Constants: camelCase (e.g., `actionTypes.ts`)
- Types: camelCase (e.g., `types.ts`)

### Component Naming
- Main managers: `[Module]Manager` (e.g., `CtaManager`)
- Lists: `[Entity]List` (e.g., `CtaList`)
- Cards: `[Entity]Card` (e.g., `CtaCard`)
- Editors: `[Entity]Editor` (e.g., `CtaEditor`)
- Drawers/Modals: `[Purpose]Drawer` / `[Purpose]Modal`

### Type Naming
- Interfaces: PascalCase (e.g., `CtaItem`)
- Types: PascalCase (e.g., `ActionType`)
- Enums: PascalCase (e.g., `CtaStatus`)

### Function Naming
- camelCase (e.g., `generateFieldKey`, `validateField`)
- Boolean functions: `is`/`has` prefix (e.g., `isFieldLocked`, `hasData`)

---

## Development Workflow

### 1. Component Development
1. Create types first in `types.ts`
2. Create mock data in `mockData.ts`
3. Build component in `components/`
4. Create manager component
5. Test with mock data
6. Integrate with real API

### 2. Testing Strategy
- Unit tests cho utilities
- Component tests với mock data
- Integration tests cho API calls
- E2E tests cho critical flows

### 3. Code Organization
- Keep components focused and single-purpose
- Share common logic in shared/utils
- Use types extensively for type safety
- Follow existing CMS patterns for consistency

---

## Next Steps

1. Create the directory structure
2. Set up basic types for each module
3. Create mock data for development
4. Build first components (CTA module)
5. Integrate with existing CMS routing
6. Test and iterate
