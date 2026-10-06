# AI Customer Request Lead Triage Design Specification

**Status:** Approved  
**Author:** Antigravity AI & Lead Engineer  
**Date:** 2026-10-06  
**Context:** CIC Technology & Consultancy (Công ty Cổ phần Công nghệ và Tư vấn CIC)

---

## 1. Problem Statement & Motivation

Công ty Cổ phần Công nghệ và Tư vấn CIC chuyên phân phối, phát triển phần mềm kỹ thuật xây dựng, kết cấu, BIM, giao thông, địa kỹ thuật (CSI SAP2000, ETABS, SAFE, GEO5, Plaxis, Kompas-3D, Enscape...), tư vấn chuyển đổi số và đào tạo chuyên ngành.

Tuy nhiên, biểu mẫu liên hệ / yêu cầu công khai thường xuyên tiếp nhận:
1. **Sự nhầm lẫn thương hiệu nghiêm trọng:** Người dùng nhầm lẫn với Trung tâm Thông tin Tín dụng Quốc gia Việt Nam (CIC Ngân hàng Nhà nước) gửi các yêu cầu tra cứu nợ xấu, vay tiền cá nhân, mở thẻ tín dụng, bùng nợ...
2. **Nội dung rác (Spam & Gibberish):** Ký tự ngẫu nhiên, spam bán hàng ngoài ngành, quảng cáo cờ bạc.
3. **Nguy cơ bỏ sót khách hàng lớn (Enterprise / VIP Leads):** Các đơn vị như Tổng công ty, Viện thiết kế, Tập đoàn lớn, Trường đại học hỏi mua bản quyền số lượng lớn (network license) hoặc đào tạo dự án trọng điểm bị chìm lẫn trong hàng loạt đơn rác.

---

## 2. Target Architecture & 3-Tier Classification

Hệ thống phân loại yêu cầu khách hàng sử dụng Gemini AI (qua `getLlmProvider()` / Supabase Gemini Gateway) chia thành **3 nhóm rõ ràng**:

### Nhóm 1: `enterprise` (⭐ Doanh nghiệp lớn / Nhu cầu cao / Mua nhiều)
- **Tiêu chí:**
  - Tổ chức lớn: Tập đoàn, Tổng công ty, Viện thiết kế, Ban QLDA, Trường Đại học, Sở ban ngành.
  - Số lượng: Nhiều licenses (multi-seat / network), triển khai toàn diện, đào tạo hàng chục kỹ sư.
  - Dự án lớn: Công trình hạ tầng, cao tốc, sân bay, cảng biển, dự án trọng điểm quốc gia.
- **Ánh xạ DB (`cic_customer_request_states`):**
  - `status`: `'new'`
  - `priority`: `'urgent'` (hoặc `'high'`)
  - `tags`: `['ai:enterprise', 'vip']`
  - Thêm ghi chú vào `cic_customer_request_notes`: Tóm tắt nhu cầu dự án, đề xuất gọi điện khẩn cấp.
  - Kích hoạt CMS Notification: Title `[⭐ VIP] Yêu cầu từ ...`, high priority, âm thanh chuông thông báo.

### Nhóm 2: `qualified` (💼 Khách hàng tiềm năng chuẩn)
- **Tiêu chí:**
  - Kỹ sư cá nhân, công ty vừa và nhỏ quan tâm đến đúng sản phẩm phần mềm, dịch vụ, khóa đào tạo của CIC.
  - Số lượng 1-2 license hoặc yêu cầu dùng thử, hỗ trợ kỹ thuật hợp lệ.
- **Ánh xạ DB (`cic_customer_request_states`):**
  - `status`: `'new'`
  - `priority`: `'medium'`
  - `tags`: `['ai:qualified']`
  - Thêm ghi chú vào `cic_customer_request_notes`: Tóm tắt yêu cầu.
  - Kích hoạt CMS Notification: Standard priority.

### Nhóm 3: `irrelevant` (🚫 Không liên quan / Rác / Nhầm CIC Tín dụng)
- **Tiêu chí:**
  - Nhầm sang CIC Tín Dụng vay tiền, nợ xấu, tài chính ngân hàng.
  - Ký tự vô nghĩa, test dạo, chửi bới, spam link bẩn.
  - Không phục vụ hoạt động bán hàng của CIC.
- **Ánh xạ DB (`cic_customer_request_states`):**
  - `status`: `'not_suitable'` (Không phù hợp - enum có sẵn trong schema)
  - `priority`: `'low'`
  - `tags`: `['ai:irrelevant']`
  - Thêm ghi chú vào `cic_customer_request_notes`: Lý do loại bỏ (vd: *"Khách nhầm lẫn với CIC Tín dụng ngân hàng"*).
  - Ghi sự kiện vào `cic_customer_request_events`.
  - **Không gửi chuông làm phiền sales**, tự động tách khỏi tab `Mới (new)` trên màn hình CMS.

---

## 3. Database Schema Alignment

Không thay đổi bảng và không thêm trường thừa! Bám sát 100% schema hiện tại:
- Bảng nguồn: `cic_contact` (lưu trữ thông tin gốc).
- Bảng trạng thái: `cic_customer_request_states`:
  - `status`: `'new' | 'received' | 'processing' | 'contacted' | 'completed' | 'not_suitable' | 'cancelled'`
  - `priority`: `'low' | 'medium' | 'high' | 'urgent'`
  - `tags`: `text[]`
- Bảng ghi chú: `cic_customer_request_notes` (content, created_by, created_at).
- Bảng dòng thời gian: `cic_customer_request_events` (event_type: `'ai_triaged'`, old_value, new_value).

---

## 4. UI/UX Touchpoints trên CMS

1. **Chi tiết đơn (`RequestDetailPage.tsx`):**
   - Hộp **AI Triage Lead Intelligence**:
     - Huy hiệu phân loại 3 màu (Vàng VIP, Xanh Dương Tiềm năng, Xám Không liên quan).
     - Điểm tin cậy (Confidence score: 0-100%).
     - Tóm tắt 1-2 câu của AI.
     - Sản phẩm kỹ thuật được nhận diện (vd: `Plaxis`, `SAP2000`, `GEO5`...).
     - Đề xuất hành động tiếp theo.
     - Nút **"Thẩm định lại với AI"** (On-demand re-triage).
2. **Danh sách đơn (`RequestList.tsx`):**
   - Hiển thị badge tag `⭐ Doanh nghiệp` hoặc `Không phù hợp`.
   - Nổi bật viền/nền vàng nhẹ cho các đơn `enterprise`.
3. **Thanh lọc (`RequestFilterBar.tsx`):**
   - Tab `Không phù hợp` lọc các đơn nhóm 3.
   - Thêm nút lọc nhanh `⭐ VIP / Doanh nghiệp lớn`.
