# AI Customer Request Lead Triage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an automated and on-demand AI Triage system using Gemini LLM for customer interaction requests, classifying them into 3 clear business groups (Enterprise VIP, Standard Qualified Lead, Irrelevant/Spam/Credit Inquiries), mapping directly into existing Postgres tables (`cic_customer_request_states`, `cic_customer_request_notes`, `cic_customer_request_events`).

**Architecture:** Core LLM service in `src/features/customer-requests/server/ai-triage.ts` using `getLlmProvider()`, background hooks in public contact forms (`src/features/contact/server/actions.ts`), on-demand Server Actions in `src/features/customer-requests/server/actions.ts`, and UI enhancements in CMS Customer Requests module (`RequestDetailPage.tsx`, `RequestList.tsx`, `RequestFilterBar.tsx`).

**Tech Stack:** Next.js Server Actions, PostgreSQL (with postgres client), Gemini 3.5 Flash / Flash Lite (via Supabase Edge Function Gateway or direct API key), React 19, Tailwind CSS, Lucide icons.

**Spec:** `docs/superpowers/specs/2026-10-06-ai-customer-request-triage-design.md`

## Global Constraints
- Preserve existing DB tables (`cic_customer_request_states`, `cic_customer_request_notes`, `cic_customer_request_events`, `cic_contact`) without altering schema.
- Follow Git workflow: `pull → code → commit → pull → push` on branch `refactor/nextjs-fullstack`.
- Ensure `npm run typecheck:foundation` passes with 0 errors.

---

### Task 1: Core AI Triage Service & Prompt Engineering

**Files:**
- Create: `src/features/customer-requests/server/ai-triage.ts`
- Create: `scripts/test-ai-customer-triage.mjs`

**Interfaces:**
- Produces: `analyzeCustomerRequestWithAi(payload: CustomerRequestTriageInput): Promise<AiTriageResult>`
- Types: `AiTriageCategory` ('enterprise' | 'qualified' | 'irrelevant'), `AiTriageResult`

- [ ] **Step 1: Implement `ai-triage.ts`**
  - Define `CustomerRequestTriageInput` and `AiTriageResult`.
  - Craft system prompt specifically explaining CIC's business (engineering software, BIM, geotechnical, structural) vs Vietnam Credit Information Center (nợ xấu, vay tiền).
  - Classify input into 3 categories: `enterprise`, `qualified`, `irrelevant`.
  - Call `getLlmProvider().generateStructured<AiTriageResult>`.
  - Provide fallback parsing and safe default return if LLM fails or is disabled.

- [ ] **Step 2: Create automated test script `scripts/test-ai-customer-triage.mjs`**
  - Test 3 distinct test cases:
    1. Vay tiền / nợ xấu: "Kiểm tra nợ xấu ngân hàng giúp em, điểm tín dụng bao nhiêu?" $\rightarrow$ Must return `irrelevant`, status `not_suitable`, reason mentions credit inquiry.
    2. Doanh nghiệp lớn: "Tôi bên Tập đoàn Xây dựng Đèo Cả cần báo giá 15 license Plaxis và SAP2000 cho dự án cao tốc" $\rightarrow$ Must return `enterprise`, priority `urgent`, tags include `ai:enterprise`.
    3. Kỹ sư thông thường: "Tôi muốn tìm hiểu khóa học ETABS và giá phần mềm SAFE cho cá nhân" $\rightarrow$ Must return `qualified`, priority `medium`.

- [ ] **Step 3: Run test script & verify**
  - Execute `node scripts/test-ai-customer-triage.mjs` and confirm all 3 test cases pass accurately.

- [ ] **Step 4: Git commit Task 1**
  - `git pull origin refactor/nextjs-fullstack`
  - `git add src/features/customer-requests/server/ai-triage.ts scripts/test-ai-customer-triage.mjs`
  - `git commit -m "feat(ai): add customer request AI triage service and verification script"`

---

### Task 2: Automated Public Form Triage & Notification Integration

**Files:**
- Modify: `src/features/contact/server/actions.ts:40-80` (contact form)
- Modify: `src/features/contact/server/actions.ts:210-280` (customer interaction form)

**Interfaces:**
- Consumes: `analyzeCustomerRequestWithAi` from `@/features/customer-requests/server/ai-triage`
- Consumes: `createCmsNotification` from `@/server/notifications/service`

- [ ] **Step 1: Hook AI Triage into `submitContactAction`**
  - After `cic_contact` insertion, execute `analyzeCustomerRequestWithAi`.
  - If `irrelevant`:
    - Set state `status = 'not_suitable'`, `priority = 'low'`, `tags = result.tags`.
    - Insert note in `cic_customer_request_notes` explaining why it's marked not suitable.
    - Insert event in `cic_customer_request_events` (`event_type: 'ai_triaged'`).
    - Skip audible high-priority notification to avoid bothering sales.
  - If `enterprise`:
    - Set state `status = 'new'`, `priority = 'urgent'`, `tags = result.tags`.
    - Insert note with AI executive summary.
    - Create CMS Notification with title `[⭐ VIP] ${input.fullname}` and high priority.
  - If `qualified`:
    - Set state `status = 'new'`, `priority = 'medium'`, `tags = result.tags`.
    - Create CMS Notification with standard priority.

- [ ] **Step 2: Hook AI Triage into `submitCustomerInteractionAction`**
  - Apply the exact same intelligent triage flow for product quote/brochure/interaction forms.

- [ ] **Step 3: Test and verify automated triage end-to-end**
  - Run test simulating submission and verify state, note, and notification in database.

- [ ] **Step 4: Git commit Task 2**
  - `git pull origin refactor/nextjs-fullstack`
  - `git add src/features/contact/server/actions.ts`
  - `git commit -m "feat(contact): auto-triage incoming customer requests with AI and route notifications"`

---

### Task 3: Backend Server Actions for On-Demand CMS Triage

**Files:**
- Create/Modify: `src/features/customer-requests/server/actions.ts`
- Modify: `src/features/customer-requests/server/mutations.ts`

**Interfaces:**
- Produces: `triageCustomerRequestAction(unifiedId: string): Promise<AiTriageActionResult>`
- Produces: `bulkCleanIrrelevantRequestsAction(requestIds: string[]): Promise<{ count: number }>`

- [ ] **Step 1: Implement `triageCustomerRequestAction`**
  - Check CMS user permission (`customer_requests:edit` or `manage`).
  - Read request details from unified source (`cic_contact`, `cic_order`, etc.).
  - Run `analyzeCustomerRequestWithAi`.
  - Update `cic_customer_request_states` (`priority`, `tags`, and optionally `status` if still `new`).
  - Add internal note to `cic_customer_request_notes` with author `AI Co-pilot`.
  - Log event `ai_triaged` in `cic_customer_request_events`.
  - Return updated request details and AI result.

- [ ] **Step 2: Implement `bulkCleanIrrelevantRequestsAction`**
  - Allow Sales/Admin to mark all selected or all `not_suitable` items as processed/cancelled or archived.

- [ ] **Step 3: Git commit Task 3**
  - `git pull origin refactor/nextjs-fullstack`
  - `git add src/features/customer-requests/server/`
  - `git commit -m "feat(customer-requests): add on-demand AI triage and bulk cleanup server actions"`

---

### Task 4: CMS Customer Request UI Enhancements (Detail View, List & Filter)

**Files:**
- Modify: `src/cms/modules/customer_interaction/customer_requests/components/RequestDetailPage.tsx`
- Modify: `src/cms/modules/customer_interaction/customer_requests/components/RequestList.tsx`
- Modify: `src/cms/modules/customer_interaction/customer_requests/components/RequestFilterBar.tsx`
- Modify: `src/cms/modules/customer_interaction/customer_requests/CustomerRequestManager.tsx`

**Interfaces:**
- Consumes: `triageCustomerRequestAction`

- [ ] **Step 1: Add AI Triage Card in `RequestDetailPage.tsx`**
  - Render an "AI Lead Intelligence" banner:
    - Gold/Amber gradient badge for `⭐ Doanh nghiệp lớn / VIP`.
    - Blue badge for `Khách tiềm năng chuẩn`.
    - Muted badge for `Không liên quan / Rác / Nhầm vay tiền`.
    - Display AI summary, identified products, confidence score, and suggested action.
    - Add "Thẩm định lại với AI" button with loading state.
    - Allow 1-click apply of AI suggestion (e.g. "Chuyển thành Không phù hợp" or "Đánh dấu Ưu tiên cao").

- [ ] **Step 2: Update `RequestList.tsx`**
  - Display AI badges (`⭐ Doanh nghiệp`, `Không liên quan`) next to tags or priority column.
  - Highlight rows that are `enterprise` so sales reps instantly see high-value leads.

- [ ] **Step 3: Update `RequestFilterBar.tsx`**
  - Add quick filter button: `⭐ VIP / Doanh nghiệp lớn` (filters by `tags.includes('ai:enterprise')` or `priority = 'urgent'`).
  - Ensure tab `Không phù hợp (not_suitable)` has count badge.

- [ ] **Step 4: Typecheck verification**
  - Run `npm run typecheck:foundation` and verify 0 errors.

- [ ] **Step 5: Git commit Task 4**
  - `git pull origin refactor/nextjs-fullstack`
  - `git add src/cms/modules/customer_interaction/customer_requests/`
  - `git commit -m "feat(cms): add AI Lead Intelligence card and smart filters in customer requests"`

---

### Task 5: End-to-End Verification & Push

**Files:**
- Test scripts and manual verification on `http://localhost:3000/cms/customer-requests`.

- [ ] **Step 1: Test simulated flow via script**
  - Verify auto-triage upon form submission.
  - Verify state updates in Postgres and notes in `cic_customer_request_notes`.
- [ ] **Step 2: Verify CMS UI in browser**
  - Open `http://localhost:3000/cms/customer-requests`.
  - View detail page with AI Lead Intelligence card.
  - Test "Thẩm định lại với AI" button.
- [ ] **Step 3: Final Git push**
  - `git pull origin refactor/nextjs-fullstack`
  - `git push origin refactor/nextjs-fullstack`
