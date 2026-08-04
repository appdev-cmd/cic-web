# KẾ HOẠCH KIỂM TRA VÀ DỌN DẸP CMS TRƯỚC KHI BỔ SUNG ĐA NGÔN NGỮ

> Phạm vi khảo sát: `src/cms`  
> Trạng thái: kế hoạch kiểm tra; chưa xóa file, chưa refactor và chưa triển khai đa ngôn ngữ  
> Mục tiêu: đưa prototype UI về baseline có thể tích hợp production trước khi tách UI language và locale workspace

---

# 1. Kết luận nhanh

Không nên triển khai đa ngôn ngữ trực tiếp trên trạng thái hiện tại. `src/cms` đang là prototype tương tác với:

- 193 file, trong đó 150 file TSX;
- 20 module và 20 file mock data;
- dữ liệu, notification, menu, KPI, audit, permission và cấu hình phần lớn chạy từ mock/local state;
- nhiều action chỉ thay state, chờ bằng `setTimeout` hoặc hiện toast thành công;
- ngôn ngữ VI/EN hiện mới là state ở app shell, chưa phải locale workspace độc lập;
- copy UI trộn tiếng Việt với các thuật ngữ tiếng Anh không có quy chuẩn.

Dọn dẹp phải thực hiện theo hướng **inventory → xác minh → cô lập/xóa → chuẩn hóa copy → thiết lập nền locale → kiểm thử**, không xóa đồng loạt theo tên file.

---

# 2. Phát hiện cần xử lý trước production

## 2.1. Nhóm P0 — hành vi giả nhưng đang trình bày như chức năng thật

| Phát hiện | Bằng chứng hiện tại | Rủi ro | Hướng xử lý |
|---|---|---|---|
| Realtime giả | Dashboard hiển thị `Realtime · Đồng bộ 100%` nhưng dữ liệu lấy từ mock/local state | Người dùng tin dữ liệu đang đồng bộ thật | Đổi thành “Dữ liệu mẫu” trong môi trường demo; production chỉ hiện “Cập nhật lần cuối” cho tới khi có realtime thật |
| Export giả | Dashboard/Contacts/Localization chỉ hiện toast đã tạo XLSX | Báo thành công nhưng không có file/job | Ẩn/disable có giải thích cho tới khi capability thật tồn tại; không để action success giả |
| Refresh giả | `CmsDashboard` dùng `setTimeout` để mô phỏng đồng bộ | Che giấu tình trạng nguồn dữ liệu | Thay bằng contract trạng thái loading/success/error của data source thật |
| Quick Create giả | Header chỉ hiện toast “Đã mở giao diện…” | Action không đưa tới form thật | Điều hướng tới create flow thật hoặc ẩn khỏi production |
| Publish/restore/approve bằng local state | Xuất hiện ở Menu, Configuration, Content Block và các manager | Workflow/permission/audit không đáng tin cậy | Đánh dấu prototype; chỉ bật production khi module nguồn xác nhận kết quả |
| Secret/config mẫu nằm trong bundle | `system_configuration/mockData.ts` chứa key/password/email/config có hình thức giống dữ liệu thật | Dễ bị hiểu nhầm, copy nhầm hoặc lộ dữ liệu test | Loại khỏi production bundle; thay bằng fixture vô hại trong môi trường demo/test |

## 2.2. Nhóm P1 — rác cấu trúc và phạm vi trùng

1. `CmsDashboard.tsx` đang chứa state Dashboard cũ (`contacts`, `registrations`, `pendingItems`, `activityLogs`, search/filter) trong khi giao diện Dashboard được render bởi `DashboardOverview`.
2. `CicHistoryManager` được import nhưng không có nhánh render tương ứng; phạm vi có khả năng trùng `ActivityLogsManager`.
3. `BannerCategoriesManager` được import nhưng route `/cms/banner-categories` đang render `BannersManager`; cần quyết định giữ category như view trong Banner & Slideshow hay module riêng.
4. `activity_logs_trash` chứa hai manager độc lập và sidebar cũng có hai menu độc lập. Đây không phải rác mặc định: giữ hai entry point nhưng nên dùng chung governance domain/component khi phù hợp.
5. `email_templates` có route nhưng không có entry trong sidebar hiện tại; cần xác nhận là chức năng production, subview của Cấu hình hay prototype bỏ dở.
6. Nhiều alias route được xử lý bằng chuỗi điều kiện dài trong `CmsDashboard`; cần xác minh alias nào còn dùng trước khi đa ngôn ngữ hóa navigation/deep link.
7. `cic_history` và `activity_logs_trash` có tên/phạm vi gần nhau; không giữ cả hai nếu không chứng minh được hai nguồn nghiệp vụ khác nhau.

## 2.3. Nhóm P1 — dữ liệu mock trong runtime

Không xóa ngay 20 file `mockData.ts`. Trước tiên phân loại từng file:

- **Fixture demo/test:** chuyển ra khỏi production runtime và chỉ import trong demo/test.
- **Seed/reference tạm:** thay bằng data adapter khi có nguồn thật.
- **Danh mục tĩnh hợp lệ:** đổi tên, xác định owner và phạm vi locale; không gọi là mock.
- **Không còn consumer:** xóa sau khi kiểm tra import graph và build.

Production gate: không còn manager production khởi tạo dữ liệu nghiệp vụ từ `mockData.ts` hoặc `mockCmsData.ts`.

Gate tự động đã được bổ sung bằng `npm run check:cms-production`. Baseline ban đầu có 18 fixture, 36 runtime import và 0 production claim bị cấm. Sau boundary App Shell/Dashboard, gate còn 34 demo/mock dependency path; lệnh cố ý trả mã lỗi cho tới khi runtime mock import về 0.

## 2.4. Nhóm P2 — từ ngữ và microcopy cần chuẩn hóa

Các từ sau không nhất thiết sai về nghiệp vụ, nhưng đang dùng lẫn lộn và dư thừa trong UI:

| Đang dùng | Chuẩn đề xuất tiếng Việt |
|---|---|
| Draft / Working Draft | Bản nháp |
| Published | Đã xuất bản |
| Publish Live / Atomic Publish | Xuất bản; chỉ giải thích “nguyên tử” trong help kỹ thuật nếu thật sự cần |
| Live Preview / PREVIEW LIVE | Xem trước |
| Actor | Người thực hiện |
| Diff Check | So sánh thay đổi |
| Restore | Phục hồi |
| Undo | Hoàn tác |
| Database | Cơ sở dữ liệu; không hiển thị nếu không giúp người dùng ra quyết định |
| job xuất XLSX | Tác vụ xuất dữ liệu hoặc Đang chuẩn bị tệp |
| Realtime | Cập nhật theo thời gian thực, chỉ dùng khi capability đã được xác minh |

Quy tắc copy:

- Giao diện VI dùng tiếng Việt nhất quán; không lặp `Bản nháp (Draft)` ở mọi vị trí.
- Giao diện EN dùng bản dịch riêng, không ghép hai ngôn ngữ trong cùng label.
- Giữ tên sản phẩm, chuẩn kỹ thuật và định dạng file như XLSX khi cần.
- Không dùng “thành công”, “đã đồng bộ”, “đã xuất file” nếu hệ thống chưa nhận kết quả thật.
- Không dùng badge nhấp nháy liên tục hoặc thông điệp marketing trong công cụ quản trị.

---

# 3. Kế hoạch thực hiện

## Giai đoạn 0 — đóng băng phạm vi

1. Không thêm locale logic mới trong lúc cleanup.
2. Chốt danh sách module production theo 17 product specification.
3. Lập bảng ánh xạ `sidebar item → route → manager → spec → owner`.
4. Mọi module không có spec/owner được đánh dấu `Verify`, không tự động xóa.

**Đầu ra:** module registry được phê duyệt.

## Giai đoạn 1 — dựng baseline kiểm tra

1. Cài dependency theo lockfile sau khi được phép.
2. Chạy TypeScript `tsc --noEmit`.
3. Chạy production build.
4. Ghi nhận lỗi hiện có, bundle size và warning.
5. Chụp smoke baseline cho tất cả route sidebar ở desktop/tablet.

Baseline đã được thiết lập ngày 2026-08-04: dependency được cài và `package-lock.json` được đồng bộ với `package.json`; `npm.cmd run lint` và `npm.cmd run build` đều pass. Page manager đã được lazy-load theo canonical route: entry bundle giảm từ khoảng 3,62 MB xuống 1,57 MB và từng module được tách thành chunk riêng. Build vẫn cảnh báo entry chung lớn hơn 500 kB; cần tiếp tục tách phần website/app shell ở giai đoạn tối ưu sau cleanup chức năng.

**Gate:** có baseline build/lint tái lập được trước khi xóa file.

## Giai đoạn 2 — dọn entry point và dead code

Thứ tự đề xuất:

1. Xóa state/import/filter Dashboard cũ sau khi chứng minh `DashboardOverview` không dùng chúng.
2. Quyết định `cic_history`: gộp vào Nhật ký hoạt động hoặc chứng minh use case riêng.
3. Quyết định `banner_categories`: view trong Banner & Slideshow hay module độc lập; chỉ giữ một route/manager chuẩn.
4. Quyết định vị trí `email_templates`.
5. Thay chuỗi điều kiện route alias bằng registry có canonical path; giữ redirect alias thực sự cần.
6. Sau mỗi cụm: type-check, build và smoke test route liên quan.

**Gate:** không còn import/component không thể truy cập; mỗi sidebar item có đúng một canonical destination.

## Giai đoạn 3 — cô lập mock và hành vi mô phỏng

1. Tạo inventory mọi import từ 20 file mock.
2. Đánh dấu từng màn hình `Demo`, `Connected` hoặc `Blocked`.
3. Tách fixture khỏi production runtime.
4. Ẩn/disable Export, Realtime, Refresh, Publish, Restore và Quick Create giả.
5. Không thay mock bằng dữ liệu rỗng mà vẫn báo thành công; phải có empty/error/not-configured state.
6. Loại toàn bộ secret-like placeholder khỏi bundle production.

**Gate:** production UI không tuyên bố capability chưa tồn tại và không dùng dữ liệu nghiệp vụ giả.

## Giai đoạn 4 — chuẩn hóa từ ngữ

1. Lập glossary VI chuẩn cho status, action, notification và navigation.
2. Thay label trộn VI/EN theo bảng tại mục 2.4.
3. Rút ngắn title, tooltip và toast; bỏ từ kỹ thuật không giúp hoàn thành tác vụ.
4. Chuẩn hóa cùng một action trên tất cả module: Tạo mới, Lưu bản nháp, Gửi duyệt, Xuất bản, Lưu trữ, Phục hồi, Xóa vĩnh viễn.
5. Review accessibility cho badge, icon-only action, focus và thông báo động.

**Gate:** một khái niệm có một tên chuẩn trong giao diện VI.

## Giai đoạn 5 — kiểm tra nền trước đa ngôn ngữ

Chỉ bắt đầu sau khi bốn giai đoạn trên đạt gate.

1. Tách rõ hai khái niệm:
   - **UI language:** ngôn ngữ nút, label, validation, toast.
   - **Workspace locale:** dataset nghiệp vụ VI/EN độc lập.
2. Xác minh locale switch đổi toàn bộ workspace, không chỉ đổi chữ ở Header.
3. Chốt canonical locale context cho route, deep link, Drawer, notification, recent và command palette.
4. Chốt module nào là:
   - record độc lập theo locale;
   - global nhưng có metadata locale;
   - global hoàn toàn;
   - UI string Source–Target.
5. Không dùng module Localization Source–Target để ép đồng bộ News/Product/Page/Service VI và EN.
6. Kiểm tra permission theo locale trước khi render cả count, chart và action.
7. Chuẩn bị resource key cho UI copy sau khi glossary VI ổn định; không lấy nguyên câu hard-code làm key.
8. Xác định fallback:
   - UI string có fallback được kiểm soát;
   - business record không fallback sang record locale khác.

**Gate:** chuyển VI ↔ EN không giữ số liệu/data cache cũ, không tạo record sai dataset và không làm lộ dữ liệu ngoài locale permission.

## Giai đoạn 6 — regression trước production

1. Type-check và production build sạch.
2. Smoke test toàn bộ canonical route.
3. Test role × locale × module.
4. Test đổi locale khi request đang chạy.
5. Test empty/loading/error/permission revoked.
6. Test keyboard, focus, screen reader name và reduced motion.
7. Kiểm tra bundle không chứa mock business data, secret-like fixture hoặc copy demo.

---

# 4. Danh sách không được xóa chỉ vì “trông thừa”

- Empty, loading, error, permission và accessibility state.
- Drawer/Modal phục vụ use case đã có trong spec và có route/action thật.
- Nhật ký hoạt động và Thùng rác: hai menu độc lập nhưng cùng nhóm Governance.
- Type definition đang được dùng bởi adapter/component production.
- Locale badge/context, even when current locale is obvious, nếu item có thể xuất hiện trong All-locales view.
- Placeholder hướng dẫn nhập liệu hợp lệ; từ `placeholder` trong code không đồng nghĩa dữ liệu giả.

---

# 5. Thứ tự ưu tiên đề xuất

1. Gỡ các tuyên bố chức năng giả khỏi production UI.
2. Xử lý shell Dashboard cũ và component/route không thể truy cập.
3. Cô lập toàn bộ mock data khỏi production runtime.
4. Chuẩn hóa glossary và microcopy VI.
5. Thiết lập canonical route/module registry.
6. Sau đó mới triển khai UI language và workspace locale độc lập.

Không thực hiện xóa file cho tới khi hoàn tất Giai đoạn 1 và có module registry được xác nhận.
