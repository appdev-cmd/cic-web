# Kế Hoạch Tái Cấu Trúc: Clean Code & Phân Rã Mega Components (CIC-WEB)

> **Dành cho kỹ thuật viên & AI Agent:** YÊU CẦU THỰC HIỆN TUẦN TỰ TỪNG GIAI ĐOẠN. Tuyệt đối không làm gộp tất cả cùng lúc để đảm bảo kiểm thử và kiểm soát hồi quy (zero regression).

**Mục tiêu:** Nâng chuẩn Clean Code từ 6.5/10 lên 9.5+/10, xóa bỏ 100% lỗi ESLint, chia nhỏ các Mega Components (> 1.000 dòng) thành các Sub-components & Custom Hooks theo nguyên lý SRP (Single Responsibility Principle).

**Kiến trúc:** Next.js 16.3 + React 19 Client/Server Component Boundary.
- Presentational Components nhỏ gọn (< 250 dòng).
- Container / Orchestrator giữ nhiệm vụ phối hợp.
- Headless Hooks quản lý form & filter logic.

---

## Danh Sách 4 Giai Đoạn Thực Hiện

```text
GIAI ĐOẠN 1: Dọn sạch Linter & Type Safety (Làm ngay - Đạt 100% Green)
    ↓
GIAI ĐOẠN 2: Bóc tách Public Mega Component (AboutView.tsx: 1.259 dòng)
    ↓
GIAI ĐOẠN 3: Bóc tách CMS Mega Components (FunctionSeoManager: 1.450 dòng & ProductsFormView: 1.169 dòng)
    ↓
GIAI ĐOẠN 4: Phân rã File Dữ Liệu Tĩnh Khổng Lồ (mockData.ts: 2.829 dòng)
```

---

## CHI TIẾT GIAI ĐOẠN 1: Dọn Sạch Linter & Type Safety (100% Green Baseline)

**Mục tiêu:** Đưa lệnh `npm run lint` về **0 error, 0 warning**. Khắc phục 16 lỗi `any`, 1 lỗi non-null chain, 3 unused warnings.

### Task 1.1: Sửa anti-pattern non-null assertion trong WebsiteShell.tsx
- **File:** `src/app/(public)/WebsiteShell.tsx` (dòng 38)
- **Vấn đề:** `settingsMap?.vi!` vi phạm `@typescript-eslint/no-non-null-asserted-optional-chain`.
- **Giải pháp:** Đổi thành `settingsMap?.vi` hoặc cung cấp default object an toàn.
- **Kiểm tra:** `npx eslint src/app/\(public\)/WebsiteShell.tsx`

### Task 1.2: Typesafe Error Utils
- **File:** `src/shared/ui/cms/errorUtils.ts` (dòng 11)
- **Vấn đề:** `error: any` vi phạm `@typescript-eslint/no-explicit-any`.
- **Giải pháp:** Đổi thành `error: unknown` kết hợp kiểm tra `error instanceof Error ? error.message : String(error)`.
- **Kiểm tra:** `npx eslint src/shared/ui/cms/errorUtils.ts`

### Task 1.3: Typesafe Route Handlers cho CTA API
- **Files:**
  - `src/app/api/cms/cta/[id]/route.ts`
  - `src/app/api/cms/cta/bulk-delete/route.ts`
  - `src/app/api/cms/cta/route.ts`
  - `src/app/api/cta/[code]/route.ts`
- **Vấn đề:** Catch block và body request dùng `catch (error: any)`.
- **Giải pháp:** Chuẩn hóa `catch (error: unknown)`, parse typed payload.
- **Kiểm tra:** `npx eslint src/app/api/cms/cta/ src/app/api/cta/`

### Task 1.4: Typesafe Route Handlers cho Forms API
- **Files:**
  - `src/app/api/cms/forms/[id]/route.ts`
  - `src/app/api/cms/forms/[id]/submissions/route.ts`
  - `src/app/api/cms/forms/bulk-delete/route.ts`
  - `src/app/api/cms/forms/route.ts`
- **Vấn đề:** Dùng `any` trong catch block và parameter parsing.
- **Giải pháp:** Chuyển đổi sang `error: unknown` và typed request handlers.
- **Kiểm tra:** `npx eslint src/app/api/cms/forms/`

### Task 1.5: Sửa API Projects & Dọn dẹp Unused Variables
- **Files:**
  - `src/app/api/cms/projects/route.ts` (bỏ `AppError` unused, thay `any` bằng `unknown`)
  - `src/app/cms/CmsFoundationRoute.tsx` (bỏ `path` unused)
  - `src/server/db/postgres.ts` (bỏ directive eslint-disable thừa)
- **Kiểm tra:** `npm run lint` đạt `0 problems`.

---

## CHI TIẾT GIAI ĐOẠN 2: Bóc Tách Public Mega Component (`AboutView.tsx`)

**Mục tiêu:** Rút gọn `AboutView.tsx` từ **1.259 dòng** xuống **dưới 200 dòng**.

### Cấu trúc mới:
```text
src/web/components/about/
├── AboutHeroSection.tsx          (~120 dòng: Banner lịch sử 35 năm & video giới thiệu)
├── AboutVisionMissionSection.tsx (~180 dòng: Tầm nhìn, Sứ mệnh, Giá trị cốt lõi)
├── AboutMilestonesTimeline.tsx   (~220 dòng: Dòng thời gian 1990 - 2026)
├── AboutLeadershipSection.tsx    (~180 dòng: Ban lãnh đạo & Hội đồng cố vấn)
├── AboutCapacityCertSection.tsx  (~160 dòng: Hồ sơ năng lực & Chứng chỉ quốc tế)
└── AboutCulturePartnersSection.tsx (~150 dòng: Văn hóa CIC & Đối tác công nghệ)
```
- **File điều phối chính:** `src/web/components/AboutView.tsx` chỉ giữ lại State active tab và render các sub-components.
- **Tiêu chuẩn kiểm thử:** Giao diện trang Giới thiệu không bị xê dịch pixel, mượt mà trên mobile/desktop.

---

## CHI TIẾT GIAI ĐOẠN 3: Bóc Tách CMS Mega Components

### 3.1: Bóc tách `FunctionSeoManager.tsx` (1.450 dòng)
**Cấu trúc mới:**
```text
src/cms/modules/function_seo/
├── components/
│   ├── FunctionSeoTable.tsx         (~250 dòng: Bảng hiển thị danh sách URL & Thẻ SEO)
│   ├── FunctionSeoFilterBar.tsx     (~120 dòng: Tìm kiếm, lọc loại trang, trạng thái index)
│   ├── FunctionSeoEditModal.tsx     (~300 dòng: Modal form sửa Title, Description, OGP)
│   └── FunctionSeoSerpPreview.tsx   (~150 dòng: Khung mô phỏng kết quả Google SERP)
├── hooks/
│   └── useFunctionSeoManager.ts     (~200 dòng: Quản lý danh sách, filter state, mutations)
└── FunctionSeoManager.tsx           (~150 dòng: Orchestrator)
```

### 3.2: Bóc tách `ProductsFormView.tsx` (1.169 dòng)
**Cấu trúc mới:**
```text
src/cms/modules/products/components/form/
├── ProductCoreIdentitySection.tsx  (~200 dòng: Tên, Mã, Hãng SX, Lĩnh vực, Smart Trigger)
├── ProductContentDetailSection.tsx (~250 dòng: Tóm tắt, Rich Editor, Đặc tính kỹ thuật)
├── ProductTaxonomyRelationsSection.tsx (~200 dòng: Ứng dụng, Loại hình, SP liên quan)
├── ProductSeoMediaSection.tsx      (~250 dòng: Bộ 3 SEO Google, Banner, Brochure đính kèm)
└── ProductFormActionsBar.tsx       (~100 dòng: Nút Lưu, Hủy, Xem trước, Audit log badge)
```

---

## CHI TIẾT GIAI ĐOẠN 4: Phân Rã File Mock Data (2.829 dòng)

- **Mục tiêu:** Chia nhỏ `src/web/data/mockData.ts` (2.829 dòng) thành các file theo từng module domain:
  - `src/web/data/domains/homeData.ts`
  - `src/web/data/domains/aboutData.ts`
  - `src/web/data/domains/productsData.ts`
  - `src/web/data/domains/servicesData.ts`
  - `src/web/data/domains/contactData.ts`
- **Tương thích ngược:** Giữ `src/web/data/mockData.ts` làm file xuất tập trung (Barrel export `export * from './domains/...'`) để không ảnh hưởng đến bất kỳ import nào hiện có trong dự án.

---

## Quy Trình Thực Hiện & Kiểm Soát

- Mỗi giai đoạn làm xong đều tuân thủ quy trình Git bắt buộc:
  `pull → code → test → commit → pull → push`.
- Kiểm tra tự động sau mỗi giai đoạn:
  1. `npm run lint`
  2. `npm run typecheck:foundation`
  3. `npm run test:security`
