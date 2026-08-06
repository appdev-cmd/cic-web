# Admin UI/UX Wireframes - Hệ Thống Tương Tác Khách Hàng
# Customer Interaction System - Admin UI/UX Wireframes

## Tổng quan (Overview)

Tài liệu này chi tiết hóa wireframes cho giao diện admin của 3 module chính:
- **CTA Management** - Quản lý nút kêu gọi hành động
- **Form Management** - Quản lý biểu mẫu động
- **Customer Request Management** - Quản lý yêu cầu khách hàng

---

## 1. CTA Management Module Wireframes

### 1.1 CTA List View (Danh sách CTA)

#### Layout Structure
```
┌─────────────────────────────────────────────────────────────────────┐
│ Tương tác khách hàng > CTA                                    [Icon] │
├─────────────────────────────────────────────────────────────────────┤
│ [+ Tạo CTA mới]  [Search...]  [Filter ▼]  [Export]      [View: ▼]   │
├─────────────────────────────────────────────────────────────────────┤
│ Tab: [Tất cả] [Đang hoạt động] [Bản nháp] [Lưu trữ] [Thùng rác]      │
├─────────────────────────────────────────────────────────────────────┤
│ ☐ | Tên quản trị         | Nội dung hiển thị | Hành động  | Trạng thái│
│ ☐ | CTA - Tư vấn ERP     | Nhận tư vấn       | Mở Form    | Đang hoạt động│
│ ☐ | CTA - Báo giá CMS    | Nhận báo giá      | Mở Form    | Đang hoạt động│
│ ☐ | CTA - Tải Catalogue  | Tài liệu          | Tải File   | Bản nháp      │
├─────────────────────────────────────────────────────────────────────┤
│ ☐ | Hàng loạt: [Đổi trạng thái] [Lưu trữ] [Xóa]              │
│                                    Trang 1 / 5  [◀] [▶]             │
└─────────────────────────────────────────────────────────────────────┘
```

#### Detailed Components

**Header Section**:
- Breadcrumb navigation
- Page title with icon
- Action buttons (primary: "Tạo CTA mới")

**Filter Bar**:
- Search input (search theo tên, mã, nội dung hiển thị)
- Filter dropdown (trạng thái, hành động, tag)
- Export button
- View toggle (list/grid)

**Tabs**:
- Tất cả: Show tất cả CTAs
- Đang hoạt động: Chỉ CTAs với status = active
- Bản nháp: Chỉ CTAs với status = draft
- Lưu trữ: Chỉ CTAs với status = archived
- Thùng rác: Chỉ CTAs đã bị xóa (soft delete)

**Table Columns**:
1. Checkbox cho bulk selection
2. Tên quản trị (có thể click để edit)
3. Nội dung hiển thị (text preview)
4. Hành động (icon + label)
5. Biểu mẫu liên kết (nếu có, clickable)
6. Thống kê (lượt hiển thị, lượt nhấn, CTR)
7. Trạng thái (badge: active=green, draft=yellow, archived=gray)
8. Ngày tạo
9. Actions dropdown (edit, duplicate, archive, delete)

**Bulk Actions Bar**:
- Hiển thị khi có items được chọn
- Actions: Đổi trạng thái, Lưu trữ, Xóa
- Cancel selection button

**Pagination**:
- Page numbers
- Previous/Next buttons
- Rows per page selector

### 1.2 CTA Editor Modal (Modal Tạo/Chỉnh Sửa CTA)

#### Layout Structure
```
┌─────────────────────────────────────────────────────────────────────┐
│ [Tạo CTA mới]                                            [×]         │
├─────────────────────────────────────────────────────────────────────┤
│ Thông tin cơ bản                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ Tên quản trị *                                    [____________] │ │
│ │ Nội dung hiển thị *                              [____________] │ │
│ │ Mô tả nội bộ                                    [____________] │ │
│ │ Icon                                              [Icon Picker] │ │
│ │ Mã định danh                                    [Auto-generated] │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ Hành động khi nhấn                                                    │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ Loại hành động *                                [Dropdown ▼]     │ │
│ │                                                                     │ │
│ │ [Dynamic fields based on action type]                              │ │
│ │                                                                     │ │
│ │ Nếu "Mở Biểu mẫu":                                                  │ │
│ │   Chọn biểu mẫu *                              [Form Picker ▼]   │ │
│ │                                                                     │ │
│ │ Nếu "Điều hướng URL":                                               │ │
│ │   Đường dẫn *                                    [____________] │ │
│ │   Cách mở                                       (•) Tab mới        │ │
│ │                                                  ( ) Cùng tab      │ │
│ │                                                                     │ │
│ │ Nếu "Tải File":                                                     │ │
│ │   Chọn tài liệu *                                [File Picker ▼]   │ │
│ │                                                                     │ │
│ │ Nếu "Gọi điện":                                                     │ │
│ │   Số điện thoại *                                [____________] │ │
│ │                                                                     │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ Trạng thái                                                            │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ (•) Đang hoạt động  ( ) Tạm ngừng  ( ) Bản nháp  ( ) Lưu trữ     │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ Preview                                                               │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │                    [ Nhận tư vấn ]                                 │ │
│ │                    (Live preview button)                          │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│                    [Lưu bản nháp] [Gửi duyệt] [Xuất bản] [Hủy]        │
└─────────────────────────────────────────────────────────────────────┘
```

#### Detailed Components

**Basic Information Section**:
- Tên quản trị (required, max 255 chars)
- Nội dung hiển thị (required, max 100 chars for button text)
- Mô tả nội bộ (optional, textarea for internal notes)
- Icon picker (dropdown hoặc modal với icon library)
- Mã định danh (auto-generated from name, editable but unique)

**Action Configuration Section**:
- Action type dropdown với options:
  - Mở Biểu mẫu
  - Điều hướng URL nội bộ
  - Điều hướng URL bên ngoài
  - Cuộn tới Section
  - Tải File
  - Gọi điện
  - Gửi Email
  - Tùy chỉnh

- Dynamic fields based on selection:
  - **Mở Biểu mẫu**: Form picker dropdown
  - **Điều hướng URL**: URL input, target radio buttons
  - **Cuộn tới Section**: Section picker dropdown
  - **Tải File**: File picker from media library
  - **Gọi điện**: Phone number input với validation
  - **Gửi Email**: Email input với validation

**Status Section**:
- Radio buttons cho status selection
- Visual indicators cho mỗi status

**Preview Section**:
- Live preview của CTA button
- Shows hover states
- Updates in real-time khi form changes

**Action Buttons**:
- Lưu bản nháp (secondary button)
- Gửi duyệt (primary button, requires approval workflow)
- Xuất bản (primary button, immediate publish)
- Hủy (cancel button)

### 1.3 CTA Analytics View (Thống kê CTA)

#### Layout Structure
```
┌─────────────────────────────────────────────────────────────────────┐
│ Tương tác khách hàng > CTA > Thống kê                        [Icon] │
├─────────────────────────────────────────────────────────────────────┤
│ Date Range: [Last 30 days ▼]  [Apply]                                │
├─────────────────────────────────────────────────────────────────────┤
│ Summary Cards                                                        │
│ ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                │
│ │ Tổng CTA     │  │ Tổng lượt    │  │ Trung bình    │                │
│ │    45        │  │ hiển thị     │  │ CTR           │                │
│ │    [+12%]    │  │   125,430    │  │   8.5%        │                │
│ └──────────────┘  └──────────────┘  └──────────────┘                │
├─────────────────────────────────────────────────────────────────────┤
│ Performance Chart                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │  Lượt hiển thị và lượt nhấn theo thời gian                       │ │
│ │  [Line chart với 2 lines: impressions, clicks]                   │ │
│ └─────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│ Top Performing CTAs                                                  │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ CTA               | Lượt hiển thị | Lượt nhấn | CTR    | Trend  │ │
│ │ CTA - Tư vấn ERP  |    45,230     |   3,845   | 8.5%   │ ↗      │ │
│ │ CTA - Báo giá    |    32,100     |   2,430   | 7.6%   | →      │ │
│ │ CTA - Tài liệu   |    28,500     |   1,890   | 6.6%   | ↘      │ │
│ └─────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│ Usage by Page                                                         │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ Trang                | Số CTA | Tổng lượt hiển thị               │ │
│ │ Trang chủ            |   5    |    45,230                        │ │
│ │ Giải pháp ERP        |   3    |    32,100                        │ │
│ │ Sản phẩm             |   2    |    28,500                        │ │
│ └─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

#### Detailed Components

**Date Range Picker**:
- Preset options: Last 7 days, Last 30 days, Last 90 days, Custom
- Custom date range picker
- Apply button

**Summary Cards**:
- Total CTAs ( với trend indicator)
- Total impressions ( với trend indicator)
- Average CTR ( với trend indicator)
- Visual trend arrows (green up, red down, gray flat)

**Performance Chart**:
- Line chart showing impressions và clicks over time
- Time granularity based on date range (daily, weekly, monthly)
- Hover tooltips với detailed information
- Legend để toggle lines

**Top Performing CTAs Table**:
- Sorted by CTR hoặc total clicks
- Columns: CTA name, impressions, clicks, CTR, trend
- Trend indicators (arrows)
- Clickable rows để view CTA details

**Usage by Page Table**:
- Shows which pages have most CTAs và impressions
- Grouped by page
- Count of unique CTAs per page
- Total impressions per page

---

## 2. Form Management Module Wireframes

### 2.1 Form List View (Danh sách Biểu mẫu)

#### Layout Structure
```
┌─────────────────────────────────────────────────────────────────────┐
│ Tương tác khách hàng > Biểu mẫu                              [Icon] │
├─────────────────────────────────────────────────────────────────────┤
│ [+ Tạo biểu mẫu mới]  [Search...]  [Filter ▼]  [Export]   [View: ▼] │
├─────────────────────────────────────────────────────────────────────┤
│ Tab: [Tất cả] [Đang hoạt động] [Bản nháp] [Lưu trữ] [Thùng rác]      │
├─────────────────────────────────────────────────────────────────────┤
│ ☐ | Tên quản trị         | Tiêu đề hiển thị  | Trường | Phiên bản│
│ ☐ | Biểu mẫu - Tư vấn ERP| Đăng ký tư vấn   |   8    |   v2.1   │
│ ☐ | Biểu mẫu - Báo giá  | Nhận báo giá     |   5    |   v1.3   │
│ ☐ | Biểu mẫu - Liên hệ   | Liên hệ với chúng tôi| 6 |   v3.0   │
├─────────────────────────────────────────────────────────────────────┤
│ Statistics: Lượt mở | Lượt gửi | Tỷ lệ hoàn thành                      │
│ ☐ | Hàng loạt: [Đổi trạng thái] [Lưu trữ] [Xóa]              │
│                                    Trang 1 / 5  [◀] [▶]             │
└─────────────────────────────────────────────────────────────────────┘
```

#### Detailed Components

**Header Section**:
- Breadcrumb navigation
- Page title with icon
- Action buttons (primary: "Tạo biểu mẫu mới")

**Filter Bar**:
- Search input (search theo tên, mã, tiêu đề)
- Filter dropdown (trạng thái, số trường, version)
- Export button
- View toggle (list/grid)

**Tabs**:
- Tất cả, Đang hoạt động, Bản nháp, Lưu trữ, Thùng rác

**Table Columns**:
1. Checkbox cho bulk selection
2. Tên quản trị (clickable để edit)
3. Tiêu đề hiển thị (text preview)
4. Số trường (count)
5. Phiên bản hiện tại (badge)
6. Thống kê (lượt mở, lượt gửi, tỷ lệ hoàn thành)
7. Trạng thái (badge)
8. Ngày tạo
9. Actions dropdown

**Statistics Row**:
- Shows aggregate statistics cho filtered forms
- Total opens, submissions, completion rate

### 2.2 Form Builder (Form Builder)

#### Layout Structure
```
┌─────────────────────────────────────────────────────────────────────┐
│ [Tạo biểu mẫu mới] - Form Builder                        [×] [Save] │
├─────────────────────────────────────────────────────────────────────┤
│ Thông tin biểu mẫu                                                  │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ Tên quản trị *                                    [____________] │ │
│ │ Tiêu đề hiển thị *                              [____________] │ │
│ │ Mô tả                                            [____________] │ │
│ │ Mã định danh                                    [Auto-generated] │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ Form Fields                                                          │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ [+ Thêm trường]                                                 │ │
│ │                                                                   │ │
│ │ ┌─ Field 1 ──────────────────────────────────────────────────┐   │ │
│ │ │ Họ và tên *                                    [Text ▼]    │   │ │
│ │ │ Field key: full_name [🔒]                      [Required ✓] │   │ │
│ │ │ Role: [Customer name ▼]                        [↑] [↓] [×] │   │ │
│ │ └──────────────────────────────────────────────────────────────┘   │ │
│ │                                                                   │ │
│ │ ┌─ Field 2 ──────────────────────────────────────────────────┐   │ │
│ │ │ Email *                                       [Email ▼]    │   │ │
│ │ │ Field key: email [🔒]                        [Required ✓] │   │ │
│ │ │ Role: [Email ▼]                              [↑] [↓] [×] │   │ │
│ │ └──────────────────────────────────────────────────────────────┘   │ │
│ │                                                                   │ │
│ │ ┌─ Field 3 ──────────────────────────────────────────────────┐   │ │
│ │ │ Số điện thoại                                 [Phone ▼]    │   │ │
│ │ │ Field key: phone [🔒]                         [Required ✓] │   │ │
│ │ │ Role: [Phone ▼]                               [↑] [↓] [×] │   │ │
│ │ └──────────────────────────────────────────────────────────────┘   │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ [Preview Form] [Settings] [Version History]                        │
│                                                                      │
│                    [Lưu bản nháp] [Gửi duyệt] [Xuất bản] [Hủy]        │
└─────────────────────────────────────────────────────────────────────┘
```

#### Detailed Components

**Form Information Section**:
- Tên quản trị (required)
- Tiêu đề hiển thị (required, shown to users)
- Mô tả (optional, shown to users)
- Mã định danh (auto-generated)

**Form Fields Section**:
- "Thêm trường" button opens field type selector
- Field cards with:
  - Label input (required)
  - Field type dropdown
  - Field key (auto-generated, locked after data exists)
  - Required toggle
  - Role selector (customer name, email, phone, etc.)
  - Position controls (up, down arrows)
  - Delete button
  - Configuration button (opens field settings)

**Field Type Selector Modal**:
```
┌─────────────────────────────────────────────────────────────────────┐
│ Chọn loại trường                                          [×]       │
├─────────────────────────────────────────────────────────────────────┤
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                │
│ │   Text       │ │  Textarea    │ │   Email      │                │
│ │ [Icon]       │ │   [Icon]     │ │   [Icon]     │                │
│ └──────────────┘ └──────────────┘ └──────────────┘                │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                │
│ │   Phone      │ │   Number     │ │   Select     │                │
│ │ [Icon]       │ │   [Icon]     │ │   [Icon]     │                │
│ └──────────────┘ └──────────────┘ └──────────────┘                │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                │
│ │   Radio      │ │  Checkbox    │ │    Date      │                │
│ │ [Icon]       │ │   [Icon]     │ │   [Icon]     │                │
│ └──────────────┘ └──────────────┘ └──────────────┘                │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                │
│ │ File Upload  │ │   Hidden     │ │   Consent    │                │
│ │ [Icon]       │ │   [Icon]     │ │   [Icon]     │                │
│ └──────────────┘ └──────────────┘ └──────────────┘                │
└─────────────────────────────────────────────────────────────────────┘
```

**Field Settings Modal**:
```
┌─────────────────────────────────────────────────────────────────────┐
│ Cấu hình trường: Họ và tên                                   [×]   │
├─────────────────────────────────────────────────────────────────────┤
│ Label                                             [____________]   │
│ Placeholder                                       [____________]   │
│ Help text                                          [____________]  │
│                                                                      │
│ Validation                                                           │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ Required                                    [✓]                  │ │
│ │ Min length                                  [___] characters    │ │
│ │ Max length                                  [___] characters    │ │
│ │ Pattern (Regex)                             [____________]      │ │
│ │ Custom error message                        [____________]      │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ Options (cho Select/Radio/Checkbox)                                │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ [+ Thêm option]                                                │ │
│ │ ┌─ Option 1 ───────────────────────────────────────────────┐   │ │
│ │ │ Value: [option_1]   Label: [Option 1]        [×]            │   │ │
│ │ └────────────────────────────────────────────────────────────┘   │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ File Configuration (cho File Upload)                                │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ Allowed file types                              [____________]  │ │
│ │ Max file size (MB)                               [___]          │ │
│ │ Max number of files                              [___]          │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│                                    [Lưu] [Hủy]                       │
└─────────────────────────────────────────────────────────────────────┘
```

**Action Buttons**:
- Preview Form (opens preview modal)
- Settings (opens form settings modal)
- Version History (opens version history drawer)
- Save buttons (draft, submit, publish)

### 2.3 Form Settings Modal (Cấu hình Biểu mẫu)

#### Layout Structure
```
┌─────────────────────────────────────────────────────────────────────┐
│ Cấu hình biểu mẫu                                      [×]         │
├─────────────────────────────────────────────────────────────────────┤
│ Tabs: [Xử lý sau khi gửi] [Email] [Bảo mật] [Analytics]             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ Tab: Xử lý sau khi gửi                                                │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ ✓ Lưu dữ liệu vào Database                                       │ │
│ │ ✓ Tạo yêu cầu khách hàng                                         │ │
│ │                                                                  │ │
│ │ Thông báo thành công                                             │ │
│ │ Thông báo hiển thị                        [____________]        │ │
│ │ Chuyển hướng đến trang                      [____________]        │ │
│ │ Cho phép tải tài liệu                    [File Picker ▼]        │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ Tab: Email                                                           │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ Email thông báo cho Admin                                        │ │
│ │ ✓ Gửi email thông báo                                             │ │
│ │ Email recipients                            [____________]        │
│ │                                                                  │ │
│ │ Email xác nhận cho khách hàng                                     │ │
│ │ ✓ Gửi email xác nhận                                              │ │
│ │ Template email                              [Dropdown ▼]        │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ Tab: Bảo mật                                                         │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ ✓ Bảo vệ CSRF                                                   │ │
│ │ ✓ Rate limiting                                                  │ │
│ │ Max submissions per [___] minutes             [___]              │ │
│ │ ✓ Honeypot field                                                 │ │
│ │ ✓ CAPTCHA                                                        │ │
│ │ CAPTCHA type                                    [reCAPTCHA ▼]   │ │
│ │                                                                  │ │
│ │ File upload restrictions                                         │ │
│ │ Allowed file types                              [____________]    │ │
│ │ Max file size (MB)                              [___]            │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ Tab: Webhook & CRM                                                  │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ Webhook                                                          │ │
│ │ ✓ Enable webhook                                                 │ │
│ │ Webhook URL                                   [____________]    │ │
│ │ Secret key                                    [____________]    │
│ │                                                                  │ │
│ │ CRM Integration                                                  │ │
│ │ ✓ Enable CRM sync                                                │ │
│ │ CRM system                                    [Dropdown ▼]     │ │
│ │ API key                                       [____________]    │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│                                    [Lưu] [Hủy]                       │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.4 Form Preview Modal (Preview Biểu mẫu)

#### Layout Structure
```
┌─────────────────────────────────────────────────────────────────────┐
│ Preview: Đăng ký tư vấn                                    [×] [Edit]│
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   ┌──────────────────────────────────────────────────────────────┐  │
│   │           Đăng ký tư vấn                                      │  │
│   │           Vui lòng để lại thông tin để đội ngũ TechAZ         │  │
│   │           liên hệ.                                             │  │
│   │                                                              │  │
│   │   Họ và tên *                                    [________] │  │
│   │                                                              │  │
│   │   Email *                                       [________] │  │
│   │                                                              │  │
│   │   Số điện thoại *                               [________] │  │
│   │                                                              │  │
│   │   Công ty                                      [________] │  │
│   │                                                              │  │
│   │   Nhu cầu                                      [________] │  │
│   │                                              [        ]    │  │
│   │                                                              │  │
│   │                                                [Gửi yêu cầu] │  │
│   └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│ [Test validation] [View submission data]                            │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Customer Request Management Module Wireframes

### 3.1 Request List View (Danh sách Yêu cầu)

#### Layout Structure
```
┌─────────────────────────────────────────────────────────────────────┐
│ Tương tác khách hàng > Yêu cầu khách hàng                    [Icon] │
├─────────────────────────────────────────────────────────────────────┤
│ [Search...]  [Advanced Filter ▼]  [Export]       [View: ▼]         │
├─────────────────────────────────────────────────────────────────────┤
│ Summary Cards                                                        │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌─────────────┐│
│ │ Tổng yêu cầu │ │ Hôm nay      │ │ Chưa tiếp   │ │ Đang xử lý  ││
│ │    120       │ │    12        │ │    nhận 18   │ │    35       ││
│ └──────────────┘ └──────────────┘ └──────────────┘ └─────────────┘│
├─────────────────────────────────────────────────────────────────────┤
│ Tab: [Tất cả] [Mới] [Đang xử lý] [Đã hoàn thành] [Không phù hợp]    │
├─────────────────────────────────────────────────────────────────────┤
│ ☐ | Khách hàng    | Điện thoại  | Biểu mẫu   | Trang      | Trạng thái│
│ ☐ | Nguyễn Văn A  | 098xxxx     | Tư vấn ERP | Giải pháp  │ Mới       │
│ ☐ | Trần Văn B    | 097xxxx     | Báo giá    | Sản phẩm   │ Đang xử lý│
│ ☐ | Lê Thị C      | 096xxxx     | Liên hệ    | Trang chủ  │ Hoàn thành │
├─────────────────────────────────────────────────────────────────────┤
│ ☐ | Hàng loạt: [Phân công] [Đổi trạng thái] [Thêm tag] [Export]    │
│                                    Trang 1 / 10  [◀] [▶]            │
└─────────────────────────────────────────────────────────────────────┘
```

#### Detailed Components

**Summary Cards**:
- Total requests (clickable để view all)
- Today's requests (clickable để filter today)
- Unreceived requests (status = new)
- In progress requests (status = processing)
- Completed requests (status = completed)

**Advanced Filter Modal**:
```
┌─────────────────────────────────────────────────────────────────────┐
│ Advanced Filters                                            [×]      │
├─────────────────────────────────────────────────────────────────────┤
│ Biểu mẫu                                        [Dropdown ▼]       │
│ CTA                                            [Dropdown ▼]       │
│ Trang                                          [Dropdown ▼]       │
│ Trạng thái                                     [Multi-select ▼]    │
│ Người phụ trách                                [Dropdown ▼]       │
│ Khoảng thời gian                               [Date picker]       │
│ Chiến dịch (UTM)                               [____________]      │
│ Từ khóa                                       [____________]      │
│                                                                      │
│                                    [Áp dụng] [Reset] [Hủy]          │
└─────────────────────────────────────────────────────────────────────┘
```

**Table Columns**:
1. Checkbox cho bulk selection
2. Khách hàng (từ field role customer_name)
3. Điện thoại (từ field role phone)
4. Email (từ field role email)
5. Biểu mẫu (clickable để view form details)
6. CTA (nếu có)
7. Trang phát sinh (clickable để view page)
8. Ngày gửi
9. Trạng thái (badge với color coding)
10. Người phụ trách (avatar + name)
11. Actions dropdown

**Status Color Coding**:
- Mới: Blue
- Đã tiếp nhận: Cyan
- Đang xử lý: Orange
- Đã liên hệ: Purple
- Hoàn thành: Green
- Không phù hợp: Gray
- Hủy: Red

### 3.2 Request Detail View (Chi tiết Yêu cầu)

#### Layout Structure
```
┌─────────────────────────────────────────────────────────────────────┐
│ Yêu cầu #REQ-001 - Nguyễn Văn A                        [← Back] [×] │
├─────────────────────────────────────────────────────────────────────┤
│ Tabs: [Thông tin khách hàng] [Nguồn phát sinh] [Xử lý] [Lịch sử]    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ Tab: Thông tin khách hàng                                            │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ ┌─ Thông tin cơ bản ──────────────────────────────────────────┐ │ │
│ │ │ Họ và tên              Nguyễn Văn A                          │ │ │
│ │ │ Email                 abc@gmail.com                         │ │ │
│ │ │ Số điện thoại         098xxxxxxx                            │ │ │
│ │ │ Công ty               Công ty ABC                           │ │ │
│ │ └──────────────────────────────────────────────────────────────┘ │ │
│ │                                                                  │ │
│ │ ┌─ Thông tin chi tiết ─────────────────────────────────────────┐ │ │
│ │ │ Nhu cầu               Muốn tư vấn triển khai ERP              │ │ │
│ │ │ Ngân sách                                                    │ │ │
│ │ │ Địa chỉ              Hà Nội                                  │ │ │
│ │ │ Ngành nghề           Sản xuất                                │ │ │
│ │ └──────────────────────────────────────────────────────────────┘ │ │
│ │                                                                  │ │
│ │ ┌─ File đính kèm ───────────────────────────────────────────────┐ │ │
│ │ │ 📄 Profile_công_ty.pdf                 [Tải xuống]            │ │ │
│ │ │ 📷 Khu_vực_nghiên_cứu.jpg              [Tải xuống]            │ │ │
│ │ └──────────────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ Tab: Nguồn phát sinh                                                  │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ ┌─ Thông tin nguồn ────────────────────────────────────────────┐ │ │
│ │ │ Trang                Giải pháp ERP                            │ │ │
│ │ │ URL                  /giai-phap-erp                          │ │ │
│ │ │ CTA                  Nhận tư vấn                             │ │ │
│ │ │ Biểu mẫu             Tư vấn ERP                             │ │ │
│ │ │ Vị trí              Hero - CTA chính                         │ │ │
│ │ │ Ngày gửi            06/08/2026 09:15                         │ │ │
│ │ └──────────────────────────────────────────────────────────────┘ │ │
│ │                                                                  │ │
│ │ ┌─ Chiến dịch ─────────────────────────────────────────────────┐ │ │
│ │ │ UTM Source           google                                  │ │ │
│ │ │ UTM Medium           cpc                                     │ │ │
│ │ │ UTM Campaign         erp-q1-2026                             │ │ │
│ │ │ Referrer             https://google.com                      │ │ │
│ │ └──────────────────────────────────────────────────────────────┘ │ │
│ │                                                                  │ │
│ │ ┌─ Thông tin thiết bị ──────────────────────────────────────────┐ │ │
│ │ │ Browser              Chrome                                  │ │ │
│ │ │ OS                   Windows 10                              │ │ │
│ │ │ Device               Desktop                                 │ │ │
│ │ └──────────────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ Tab: Xử lý                                                           │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ ┌─ Trạng thái xử lý ────────────────────────────────────────────┐ │ │
│ │ │ Trạng thái hiện tại                         [Đang xử lý ▼]   │ │ │
│ │ │ Người phụ trách                            [Nguyễn Văn B ▼]  │ │ │
│ │ │ Mức độ ưu tiên                             [Trung bình ▼]    │ │ │
│ │ │ Nhóm xử lý                                 [Sales ▼]         │ │ │
│ │ │ Tags                          [+ Thêm tag] [Hot] [VIP]      │ │ │
│ │ └──────────────────────────────────────────────────────────────┘ │ │
│ │                                                                  │ │
│ │ ┌─ Ghi chú nội bộ ─────────────────────────────────────────────┐ │ │
│ │ │ [+ Thêm ghi chú]                                            │ │ │
│ │ │ ┌─ Ghi chú 1 ───────────────────────────────────────────────┐ │ │ │
│ │ │ │ Khách muốn được tư vấn vào tuần sau.                     │ │ │ │
│ │ │ │ Nguyễn Văn B - 06/08/2026 10:20                          │ │ │ │
│ │ │ └──────────────────────────────────────────────────────────┘ │ │ │
│ │ │ ┌─ Ghi chú 2 ───────────────────────────────────────────────┐ │ │ │
│ │ │ │ Quan tâm gói ERP Standard. Đã gửi Catalogue.             │ │ │ │
│ │ │ │ Nguyễn Văn B - 06/08/2026 14:30                          │ │ │ │
│ │ │ └──────────────────────────────────────────────────────────┘ │ │ │
│ │ └──────────────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ Tab: Lịch sử                                                          │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ ┌─ Timeline ────────────────────────────────────────────────────┐ │ │
│ │ │ ● 06/08 09:15 - Hệ thống                                      │ │ │
│ │ │   Tạo yêu cầu mới                                             │ │ │
│ │ │                                                                  │ │ │
│ │ │ ● 06/08 10:20 - Nguyễn Văn B                                   │ │ │
│ │ │   Chuyển trạng thái sang Đang xử lý                            │ │ │
│ │ │                                                                  │ │ │
│ │ │ ● 06/08 10:45 - Nguyễn Văn B                                   │ │ │
│ │ │   Thêm ghi chú: "Khách muốn tư vấn tuần sau"                   │ │ │
│ │ │                                                                  │ │ │
│ │ │ ● 06/08 15:00 - Nguyễn Văn B                                   │ │ │
│ │ │   Chuyển trạng thái sang Đã liên hệ                            │ │ │
│ │ └──────────────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│                    [Lưu thay đổi] [Gửi email] [Export]              │
└─────────────────────────────────────────────────────────────────────┘
```

#### Detailed Components

**Customer Information Tab**:
- **Basic Info Section**: Shows fields marked với customer roles
- **Detailed Info Section**: Shows all other form fields
- **Attachments Section**: File uploads với download links
- **Dynamic Field Generation**: Fields rendered based on form structure

**Source Information Tab**:
- **Source Section**: Page, CTA, Form, placement info
- **Campaign Section**: UTM parameters, referrer
- **Device Section**: Browser, OS, device info
- **Link to Page**: Clickable để view page where form was submitted

**Processing Tab**:
- **Status Section**: Status dropdown, assignee selector, priority, team
- **Tags Section**: Tag management với autocomplete
- **Notes Section**: Note timeline với add note functionality
- **Rich Text Editor**: For composing notes

**History Tab**:
- **Timeline**: Chronological list of all actions
- **Action Types**: Create, status change, assignment, note added, etc.
- **Actor Information**: Who performed action and when
- **Filter**: Filter by action type

### 3.3 Export Modal (Modal Export Dữ Liệu)

#### Layout Structure
```
┌─────────────────────────────────────────────────────────────────────┐
│ Export Yêu cầu Khách Hàng                                   [×]     │
├─────────────────────────────────────────────────────────────────────┤
│ Current Filters Applied:                                             │
│ • Trạng thái: Mới, Đang xử lý                                        │
│ • Khoảng thời gian: 01/08/2026 - 06/08/2026                         │
│ • Biểu mẫu: Tư vấn ERP                                              │
│ [Change filters]                                                      │
├─────────────────────────────────────────────────────────────────────┤
│ Export Options                                                       │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ File format                                    [Excel ▼]        │ │
│ │ Include columns:                                                   │ │
│ │ ☑ Mã yêu cầu  ☑ Khách hàng  ☑ Điện thoại  ☑ Email              │ │
│ │ ☑ Biểu mẫu    ☑ CTA          ☑ Trang      ☑ Ngày gửi           │ │
│ │ ☑ Trạng thái  ☑ Người phụ trách                                   │ │
│ │                                                                  │ │
│ │ Advanced options:                                                 │ │
│ │ ☐ Include submission values (all form fields)                    │ │
│ │ ☐ Include source information (UTM, referrer)                      │ │
│ │ ☐ Include internal notes                                          │ │
│ │ ☐ Include processing history                                      │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ Data Preview (first 5 rows):                                         │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ Mã yêu cầu | Khách hàng   | Điện thoại | Email     | Trạng thái │ │
│ │ REQ-001   | Nguyễn Văn A | 098xxxx    | abc@gmail | Mới        │ │
│ │ REQ-002   | Trần Văn B   | 097xxxx    | xyz@gmail | Đang xử lý │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ Total records: 45                                                     │
│                                                                      │
│                                    [Export] [Cancel]                 │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.4 Request Analytics Dashboard (Thống kê Yêu cầu)

#### Layout Structure
```
┌─────────────────────────────────────────────────────────────────────┐
│ Tương tác khách hàng > Yêu cầu > Thống kê                    [Icon] │
├─────────────────────────────────────────────────────────────────────┤
│ Date Range: [Last 30 days ▼]  [Apply]                                │
├─────────────────────────────────────────────────────────────────────┤
│ Summary Cards                                                        │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌─────────────┐│
│ │ Tổng yêu cầu │ │ Hôm nay      │ │ Chưa tiếp   │ │ Thời gian   ││
│ │    120       │ │    12        │ │    nhận 18   │ │ xử lý TB    ││
│ │    [+15%]    │ │    [+3]      │ │    [-5]      │ │   2.5 days  ││
│ └──────────────┘ └──────────────┘ └──────────────┘ └─────────────┘│
├─────────────────────────────────────────────────────────────────────┤
│ Requests Over Time                                                   │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │  [Line chart: requests per day]                                  │ │
│ └─────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│ Requests by Form                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ Biểu mẫu           | Số lượng | % Tổng | Trung bình xử lý       │ │
│ │ Tư vấn ERP         |   65     |  54%   | 2.1 days              │ │
│ │ Báo giá            |   35     |  29%   | 1.8 days              │ │
│ │ Liên hệ            |   20     |  17%   | 0.5 days              │ │
│ └─────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│ Requests by Page                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ Trang              | Số lượng | Conversion Rate               │ │
│ │ Giải pháp ERP      |   45     | 3.2%                          │ │
│ │ Trang chủ          |   35     | 1.1%                          │ │ │
│ │ Sản phẩm          |   25     | 2.8%                          │ │
│ └─────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│ Team Performance                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ Người phụ trách    | Đã xử lý | Đang xử lý | Thời gian TB      │ │
│ │ Nguyễn Văn B       |   25     |    8       | 1.9 days          │ │
│ │ Trần Thị C         |   20     |    5       | 2.2 days          │ │
│ │ Lê Văn D           |   15     |    3       | 3.1 days          │ │
│ └─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4. Shared Components

### 4.1 Status Badge Component
```
┌──────────────────┐
│   Đang hoạt động  │  (Green background)
└──────────────────┘

┌──────────────────┐
│   Bản nháp        │  (Yellow background)
└──────────────────┘

┌──────────────────┐
│   Lưu trữ         │  (Gray background)
└──────────────────┘
```

### 4.2 Assignee Selector Component
```
┌─────────────────────────────────────────┐
│ Người phụ trách        [Nguyễn Văn B ▼] │
│ ┌─────────────────────────────────────┐ │
│ │ Nguyễn Văn B         [Avatar]  ✓     │ │
│ │ Trần Thị C           [Avatar]        │ │
│ │ Lê Văn D             [Avatar]        │ │
│ │ [Unassigned]                        │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### 4.3 Date Range Picker Component
```
┌─────────────────────────────────────────┐
│ [Last 7 days ▼]                         │
│ ┌─────────────────────────────────────┐ │
│ │ Last 7 days                         │ │
│ │ Last 30 days                        │ │
│ │ Last 90 days                        │ │
│ │ This month                          │ │
│ │ Last month                          │ │
│ │ Custom range...                     │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## 5. Responsive Design

### 5.1 Mobile Views
- **List Views**: Stack table columns into cards
- **Forms**: Single column layout, stacked fields
- **Detail Views**: Tabbed interface converted to accordion
- **Charts**: Responsive chart sizing

### 5.2 Tablet Views
- **List Views**: Horizontal scroll cho tables, or card view
- **Forms**: Two-column layout cho complex forms
- **Detail Views**: Side-by-side layout cho info sections

---

## 6. Accessibility

### 6.1 Keyboard Navigation
- All interactive elements keyboard accessible
- Focus indicators visible
- Skip to main content link
- ARIA labels cho dynamic content

### 6.2 Screen Reader Support
- Semantic HTML structure
- ARIA attributes cho complex components
- Alt text cho images
- Descriptive link text

### 6.3 Color Contrast
- WCAG AA compliant color contrast ratios
- Color not used as sole indicator
- High contrast mode support

---

## 7. Design System Integration

### 7.1 Colors
- Primary: Existing CMS primary color
- Secondary: Existing CMS secondary color
- Status colors: Consistent với existing CMS
- Neutral colors: Existing CMS neutral palette

### 7.2 Typography
- Font family: Existing CMS font stack
- Font sizes: Existing CMS type scale
- Font weights: Existing CMS weight scale

### 7.3 Spacing
- Spacing scale: Existing CMS spacing system
- Component padding: Consistent với existing components
- Layout margins: Grid system consistency

### 7.4 Components
- Buttons: Existing CMS button styles
- Inputs: Existing CMS input styles
- Modals: Existing CMS modal component
- Drawers: Existing CMS drawer component

---

## 8. Next Steps

1. **Review wireframes** với stakeholders
2. **Create high-fidelity mockups** based on approved wireframes
3. **Build interactive prototypes** cho user testing
4. **Conduct usability testing** và iterate
5. **Finalize design specifications** cho development
6. **Create component library** based on final designs

Wireframes này provide foundation cho building a user-friendly, efficient admin interface cho the Customer Interaction Management System while maintaining consistency với existing CMS design language.