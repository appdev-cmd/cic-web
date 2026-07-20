/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BIMIcon } from '../components/shared/Icons';

export interface ServiceDetail {
  id: string;
  title: string;
  tagline: string;
  shortDesc: string;
  longDesc?: string;
  category: string;
  image: string;
  whyNeedTitle?: string;
  whyNeed?: string[];
  scopeTitle?: string;
  scope: {
    title: string;
    desc?: string;
    list?: string[];
    img?: string;
  }[];
  process: {
    step: string;
    title: string;
    desc: string;
  }[];
  benefits: string[];
  media: {
    type: 'image' | 'text_block';
    url?: string;
    title?: string;
    content?: string;
    caption?: string;
  }[];
  stateCollaboration?: {
    title: string;
    items: {
      title: string;
      desc: string;
      img?: string;
    }[];
  };
  intlCollaboration?: {
    title: string;
    desc: string;
    img?: string;
  };
}

export const servicesData: ServiceDetail[] = [
  {
    id: "tu-van-bim",
    title: "Dịch Vụ Tư Vấn BIM Toàn Diện của CIC – Bứt Phá Chuyển Đổi Số Ngành Xây Dựng",
    tagline: "CIC – Đối tác tin cậy trong hành trình chuyển đổi số ngành xây dựng",
    shortDesc: "Doanh nghiệp của bạn đang tìm kiếm giải pháp BIM hiệu quả để tiết kiệm chi phí, tối ưu quy trình và nâng cao năng lực cạnh tranh? CIC mang đến dịch vụ tư vấn BIM toàn diện, giúp doanh nghiệp chủ động chuyển đổi số – nâng cao năng lực cạnh tranh.",
    category: "Giải pháp số & BIM",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80",
    whyNeedTitle: "Tại sao doanh nghiệp cần dịch vụ tư vấn BIM của CIC?",
    whyNeed: [
      "Tăng tốc tiến độ dự án và giảm thiểu sai sót nhờ quản lý toàn bộ vòng đời công trình (từ thiết kế, thi công đến vận hành).",
      "Tiết kiệm chi phí đầu tư và đảm bảo chất lượng theo tiêu chuẩn quốc tế.",
      "Tiếp cận công nghệ BIM mới nhất (BIM 4D, 5D, 6D, Digital Twin)."
    ],
    scopeTitle: "Các dịch vụ tư vấn BIM của CIC",
    scope: [
      {
        title: "2.1. Dịch vụ tư vấn BIM dành cho Chủ đầu tư",
        desc: "CIC cung cấp dịch vụ tư vấn BIM chuyên sâu dành cho chủ đầu tư, giúp kiểm soát chất lượng, tiến độ và chi phí dự án một cách chặt chẽ và hiệu quả. Với dịch vụ tư vấn BIM, chủ đầu tư sẽ được:",
        list: [
          "Đào tạo kiến thức tổng quan về BIM, giúp hiểu rõ các công cụ kiểm soát chất lượng mô hình BIM của đơn vị tư vấn thiết kế và nhà thầu.",
          "Thiết lập tiêu chuẩn BIM (EIR), khảo sát quy trình hoạt động của doanh nghiệp và xây dựng bộ tiêu chuẩn phù hợp với quy định tại Việt Nam, đảm bảo chất lượng BIM từ các đơn vị tham gia dự án.",
          "Hỗ trợ trong quá trình đấu thầu, đánh giá kế hoạch thực hiện BIM (BEP) của các nhà thầu, giúp chủ đầu tư lựa chọn đơn vị phù hợp.",
          "Thẩm tra chất lượng của mô hình BIM.",
          "Tư vấn triển khai Môi trường Dữ liệu Chung (CDE), giúp quản lý và kiểm soát toàn bộ quy trình BIM một cách minh bạch và hiệu quả.",
          "Tạo lập mô hình BIM 3D để phục vụ thẩm định theo các yêu cầu của Nhà nước.",
          "Ứng dụng các giải pháp BIM tiên tiến như BIM 4D (mô phỏng tiến độ thi công), BIM 5D (quản lý chi phí) và BIM 6D (quản lý vận hành), giúp chủ đầu tư kiểm soát toàn diện dự án.",
          "Xây dựng mô hình số song sinh (Digital Twins), hỗ trợ giám sát, quản lý và bảo trì công trình sau khi đưa vào vận hành."
        ],
        img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80"
      },
      {
        title: "2.2. Dịch vụ tư vấn BIM dành cho đơn vị tư vấn thiết kế",
        desc: "CIC cung cấp dịch vụ tư vấn BIM chuyên sâu dành cho đơn vị tư vấn thiết kế để trực tiếp triển khai BIM trong dự án thực tế, bao gồm:",
        list: [
          "Thiết lập Kế hoạch thực hiện BIM (B.E.P) để triển khai BIM vào hoạt động sản xuất tại doanh nghiệp.",
          "Đào tạo các kiến thức tổng quan về BIM, các công cụ tạo lập mô hình BIM phổ biến: Revit, Tekla, Allplan,.. để tạo lập mô hình BIM (3D).",
          "Đào tạo về các công cụ phần mềm để thực hiện các nội dung áp dụng BIM như: BIM 4D (Fuzor, SYNCHRO), BIM 5D (Cubicost),…",
          "Kết hợp với đơn vị tư vấn thiết kế thực hiện tạo lập mô hình BIM (3D) để nộp thẩm định và một số nội dung áp dụng BIM phổ thông khác như: BIM 4D (mô phỏng tiến độ thi công), BIM 5D (quản lý chi phí), BIM 6D (quản lý vận hành)."
        ],
        img: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80"
      },
      {
        title: "2.3. Dịch vụ Tư vấn BIM dành cho nhà thầu thi công",
        desc: "CIC cung cấp dịch vụ tư vấn BIM chuyên sâu dành cho nhà thầu thi công để trực tiếp triển khai BIM trong dự án thực tế, bao gồm:",
        list: [
          "Thiết lập Kế hoạch thực hiện BIM (B.E.P) để triển khai BIM vào hoạt động sản xuất tại doanh nghiệp.",
          "Đào tạo các kiến thức tổng quan về BIM, các công cụ tạo lập mô hình BIM phổ biến: Revit, Tekla, Allplan,.. để tạo lập mô hình BIM (3D).",
          "Đào tạo về các công cụ phần mềm để thực hiện các nội dung áp dụng BIM như: BIM 4D (Fuzor, SYNCHRO), BIM 5D (Cubicost),...",
          "Kết hợp với nhà thầu thi công thực hiện tạo lập mô hình BIM (3D) để nộp thẩm định và một số nội dung áp dụng BIM phổ thông khác như: BIM 4D (mô phỏng tiến độ thi công), BIM 5D (quản lý chi phí), BIM 6D (quản lý vận hành)."
        ],
        img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80"
      },
      {
        title: "2.4. Dịch vụ Tư vấn BIM dành cho đơn vị vận hành tài sản",
        desc: "Ứng dụng BIM trong quá trình vận hành tài sản với giải pháp Autodesk Tandem. Công ty CIC cung cấp dịch vụ tư vấn BIM chuyên sâu dành cho đơn vị vận hành tài sản để trực tiếp triển khai BIM trong dự án thực tế, bao gồm:",
        list: [
          "Đào tạo các kiến thức tổng quan về BIM: công nghệ và cơ sở pháp lý.",
          "Thiết lập quy trình áp dụng BIM trong công tác vận hành bảo trì tài sản: thiết lập môi trường trao đổi dữ liệu chung (CDE).",
          "Cập nhật mô hình BIM theo bản vẽ hoàn công, tích hợp các thông vận hành tài sản theo chuẩn Cobie.",
          "Tích hợp các dữ liệu vận hành để tạo lập mô hình số song sinh (Digital Twins).",
          "Tích hợp dữ liệu từ các giải pháp ERP (SAP, Oracle) vào môi trường dữ liệu chung (CDE) để kiểm soát dữ liệu vận hành."
        ],
        img: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80"
      }
    ],
    process: [
      { step: "01", title: "Khảo sát & Đánh giá hiện trạng", desc: "Đội ngũ chuyên gia của CIC khảo sát cơ sở hạ tầng CNTT, năng lực nhân sự và quy trình hoạt động hiện tại của doanh nghiệp." },
      { step: "02", title: "Lập phương án & Xây dựng Tiêu chuẩn", desc: "Xây dựng tài liệu EIR, lập kế hoạch áp dụng BEP chi tiết, thiết lập môi trường CDE phù hợp chuẩn mực quốc tế và Nhà nước." },
      { step: "03", title: "Đào tạo & Chuyển giao công cụ", desc: "Tập huấn chuyên sâu phần mềm (Revit, Tekla, Cubicost, Fuzor...) kèm đào tạo quy trình phối hợp cho từng phòng ban." },
      { step: "04", title: "Đồng hành triển khai & Thẩm định", desc: "Phối hợp dựng mô hình 3D thực tế, chạy giả lập tiến độ 4D, dự toán 5D, hỗ trợ nộp hồ sơ thẩm định phê duyệt dự án." },
      { step: "05", title: "Vận hành số & Bàn giao tài sản", desc: "Tích hợp mô hình số hoàn công vào phần mềm quản lý tài sản, kết nối mô hình số song sinh (Digital Twins) bảo trì bền vững." }
    ],
    benefits: [
      "Tiết kiệm chi phí & thời gian: Hạn chế tối đa sai sót, giúp dự án hoàn thành đúng tiến độ với ngân sách tối ưu.",
      "Chuyển giao công nghệ toàn diện: Doanh nghiệp không chỉ được tư vấn mà còn được đào tạo để chủ động triển khai BIM hiệu quả.",
      "Đội ngũ chuyên gia hàng đầu: Với kinh nghiệm triển khai nhiều dự án lớn, CIC cam kết mang đến giải pháp phù hợp nhất cho từng doanh nghiệp.",
      "Tăng cường tính cạnh tranh: BIM giúp nâng cao chất lượng thiết kế, thi công và vận hành, tạo lợi thế lớn cho doanh nghiệp trong ngành xây dựng."
    ],
    media: [
      {
        type: "text_block",
        title: "Ông Đặng Đức Hà – Chủ tịch HĐQT Công ty Cổ phần Công nghệ và Tư vấn CIC (CIC) phát biểu",
        content: "Phát biểu trong một sự kiện chuyển đổi số năm 2024, Chủ tịch khẳng định: 'Trung tâm BIM & Digital Twins của CIC cam kết cung cấp dịch vụ xuất sắc, đóng góp vào tương lai vươn mình của kỹ thuật xây dựng nước nhà.'"
      }
    ],
    stateCollaboration: {
      title: "Hợp tác với cơ quan quản lý Nhà nước trong lĩnh vực BIM",
      items: [
        {
          title: "Thảo luận ứng dụng BIM trong thẩm định với Cục Quản lý hoạt động xây dựng",
          desc: "Vào ngày 10/9/2024, CIC cùng Cục Quản lý hoạt động xây dựng đã tổ chức Hội nghị thảo luận về việc áp dụng BIM trong thẩm định dự án đầu tư xây dựng. Nhấn mạnh việc sử dụng BIM như công cụ hỗ trợ thẩm định báo cáo nghiên cứu khả thi, thiết kế xây dựng, cấp phép và kiểm tra nghiệm thu công trình."
        },
        {
          title: "Bồi dưỡng kiến thức BIM tại các Sở Xây dựng địa phương",
          desc: "Công ty CIC đã phối hợp với Sở Xây dựng các tỉnh thành như: Hà Nội, TP.HCM, Quảng Ninh, Lào Cai, Quảng Trị,... tổ chức lớp bồi dưỡng kiến thức về Mô hình thông tin công trình (BIM) cho các học viên từ các Sở, Ban Quản lý dự án, UBND quận huyện."
        }
      ]
    },
    intlCollaboration: {
      title: "Hợp tác quốc tế – Định hướng phát triển bền vững",
      desc: "Với mục tiêu nâng cao chất lượng dịch vụ, CIC đã ký kết thỏa thuận hợp tác chiến lược với BIMAGE Consulting – công ty tư vấn BIM hàng đầu Singapore, giúp tiếp cận công nghệ và chuyển giao quy trình chuẩn quốc tế cho các dự án quy mô lớn tại Việt Nam."
    }
  },
  {
    id: "tu-van-lap-don-gia-chi-so-gia",
    title: "Tư Vấn Lập Đơn Giá, Chỉ Số Giá Xây Dựng Dự Án Chuyên Nghiệp",
    tagline: "Giải pháp quản lý chi phí tối ưu, cập nhật định mức TCVN chính xác nhất",
    shortDesc: "Đơn vị tư vấn tiên phong hỗ trợ Chủ đầu tư lập đơn giá xây dựng công trình đặc thù, xác định chỉ số giá xây dựng theo quý, năm chuẩn xác, đảm bảo quản lý dòng vốn đầu tư dự án tối ưu.",
    category: "Kinh tế xây dựng",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80",
    whyNeedTitle: "Tại sao cần đơn giá và chỉ số giá chuẩn xác?",
    whyNeed: [
      "Kiểm soát chặt chẽ tổng mức đầu tư, hạn chế tối đa nguy cơ vượt dự toán vốn dự án.",
      "Định lượng chính xác biến động giá nguyên vật liệu, nhân công và máy thi công theo thời gian thực.",
      "Làm căn cứ pháp lý vững chắc cho công tác lập thầu, ký kết hợp đồng điều chỉnh giá."
    ],
    scope: [
      {
        title: "Tư vấn lập đơn giá xây dựng công trình đặc thù",
        desc: "Dành cho các dự án hạ tầng lớn, công nghệ mới chưa có trong hệ thống định mức của Nhà nước. CIC tiến hành xây dựng định mức nội bộ, khảo sát đơn giá thị trường thực tế."
      },
      {
        title: "Xác định chỉ số giá xây dựng (Construction Price Index - CPI)",
        desc: "Tư vấn tính toán chỉ số giá xây dựng riêng cho công trình phục vụ điều chỉnh giá hợp đồng xây dựng, đặc biệt hữu ích với dự án kéo dài nhiều năm."
      },
      {
        title: "Thẩm tra dự toán & Kiểm soát suất đầu tư",
        desc: "Đánh giá sự phù hợp của định mức áp dụng, giá vật liệu đưa vào tính toán, giúp Chủ đầu tư loại bỏ các hao phí bất hợp lý."
      }
    ],
    process: [
      { step: "01", title: "Tiếp nhận dữ liệu dự án", desc: "Thu thập hồ sơ thiết kế, thông số kỹ thuật công trình và thông tin vật liệu dự kiến sử dụng." },
      { step: "02", title: "Khảo sát thị trường thực tế", desc: "Khảo sát liên tục mặt bằng giá nhân công, máy móc và vật tư tại khu vực xây dựng dự án." },
      { step: "03", title: "Tính toán & Lập báo cáo", desc: "Áp dụng phương pháp luận khoa học, tiêu chuẩn của Bộ Xây dựng để chạy số liệu đơn giá, chỉ số giá." },
      { step: "04", title: "Bảo vệ số liệu trước cơ quan thẩm quyền", desc: "Đồng hành cùng chủ đầu tư giải trình và bảo vệ phương pháp tính toán trước hội đồng thẩm tra Nhà nước." }
    ],
    benefits: [
      "Phòng tránh rủi ro pháp lý liên quan đến thanh quyết toán nguồn vốn ngân sách nhà nước.",
      "Tối ưu hóa đến 15% tổng chi phí dự toán nhờ cập nhật sát sườn giá thị trường thực tế.",
      "Được thực hiện bởi các chuyên gia kinh tế xây dựng hàng đầu có kinh nghiệm thẩm tra dự án quốc gia."
    ],
    media: []
  },
  {
    id: "danh-gia-san-luong-dien-gio",
    title: "Đánh Giá Sản Lượng Năng Lượng Điện Gió Đạt Chuẩn Bankable",
    tagline: "Chìa khóa mở rộng nguồn vốn tài trợ quốc tế cho dự án năng lượng tái tạo",
    shortDesc: "Đo đạc dữ liệu gió chuyên sâu, phân tích và lập báo cáo đánh giá sản lượng điện gió (Yield Assessment) đáp ứng khắt khe các tiêu chuẩn khắt khe để vay vốn ngân hàng quốc tế (Bankable).",
    category: "Năng lượng & Môi trường",
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80",
    whyNeedTitle: "Thế nào là một báo cáo Điện gió đạt chuẩn Bankable?",
    whyNeed: [
      "Số liệu đo gió liên tục tối thiểu 1-2 năm bằng cột đo chuẩn hoặc hệ thống Lidar nhập khẩu.",
      "Sử dụng các mô hình mô phỏng chuyên ngành chuẩn quốc tế (WAsP, WindPRO) để tính toán tổn hao cực kỳ chi tiết.",
      "Báo cáo được ký xác nhận bởi đơn vị độc lập có uy tín toàn cầu, đảm bảo độ tin cậy sai số P90/P50 cực thấp."
    ],
    scope: [
      {
        title: "Tư vấn thiết kế & Lắp đặt hệ thống đo gió chuyên sâu",
        desc: "Lập phương án vị trí đặt cột khí tượng đo gió lý tưởng, lắp đặt sensor đo tốc độ, hướng gió, độ ẩm, nhiệt độ đạt chuẩn IEC."
      },
      {
        title: "Xử lý & Hiệu chuẩn chuỗi dữ liệu đo gió thực địa",
        desc: "Lọc bỏ dữ liệu rác, bù đắp chuỗi số liệu bị khuyết bằng thuật toán đối chiếu dữ liệu vệ tinh dài hạn (MCP)."
      },
      {
        title: "Mô phỏng sản lượng & Lập báo cáo Bankable Report",
        desc: "Giả lập bố trí turbine tối ưu, phân tích tổn hao (do hiệu ứng bám đuôi, dừng máy, sự cố lưới...) và tính toán các mức xác suất sản lượng P50, P75, P90."
      }
    ],
    process: [
      { step: "01", title: "Khảo sát địa hình & Thiết kế trạm đo", desc: "Xác định tọa độ tối ưu bằng drone và mô phỏng 3D địa hình, lắp đặt tháp khí tượng đo gió tiêu chuẩn." },
      { step: "02", title: "Thu thập & Giám sát dữ liệu 12-24 tháng", desc: "Truyền dữ liệu không dây thời gian thực, liên tục kiểm tra lỗi sensor để đảm bảo chuỗi dữ liệu sạch." },
      { step: "03", title: "Tương quan dữ liệu dài hạn (MCP)", desc: "Đối chiếu số liệu đo thực tế với dữ liệu khí tượng vệ tinh 20 năm gần nhất để đưa ra phân tích xu hướng dài hạn." },
      { step: "04", title: "Lập mô hình phát điện & Tổn thất", desc: "Sử dụng phần mềm chuyên dụng WindPRO giả lập hoạt động của các dòng turbine hàng đầu thế giới." },
      { step: "05", title: "Xuất báo cáo Bankable phê duyệt", desc: "Bàn giao báo cáo Yield Assessment hoàn chỉnh phục vụ hồ sơ gửi các định chế tài chính lớn như ADB, WB." }
    ],
    benefits: [
      "Tăng tỷ lệ phê duyệt hạn mức tín dụng dự án từ các ngân hàng quốc tế lên đến 95%.",
      "Xác định tối ưu tọa độ đặt turbine giúp nâng cao hiệu suất phát điện trung bình từ 5-8%.",
      "Giảm thiểu rủi ro đầu tư dài hạn cho các cổ đông sáng lập dự án."
    ],
    media: []
  },
  {
    id: "tu-van-xay-dung",
    title: "Tư Vấn Xây Dựng, Khảo Sát Địa Chất & Kiểm Định Chất Lượng Công Trình",
    tagline: "Khoa học - An toàn - Bền vững cho mọi cấu trúc hạ tầng kỹ thuật",
    shortDesc: "Dịch vụ khảo sát địa hình bằng công nghệ quét 3D laser, khảo sát địa chất công trình, siêu âm kiểm định chất lượng bê tông thân cọc khoan nhồi và đánh giá mức độ an toàn chịu lực của công trình.",
    category: "Khảo sát & Kiểm định",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80",
    whyNeedTitle: "Tầm quan trọng của khảo sát và kiểm định kỹ thuật?",
    whyNeed: [
      "Ngăn chặn triệt để sự cố lún, nứt, nghiêng đổ công trình ngay từ khâu thiết kế nền móng.",
      "Đánh giá chính xác khả năng chịu lực nâng tầng, cải tạo công năng của các tòa nhà hiện hữu.",
      "Đưa ra các giải pháp khắc phục, gia cường kết cấu khoa học, tối giản chi phí thi công."
    ],
    scope: [
      {
        title: "Khảo sát địa chất công trình & Địa chất thủy văn",
        desc: "Khoan khảo sát thực địa, lấy mẫu đất đá thí nghiệm, xác định cao trình mực nước ngầm phục vụ thiết kế hố móng sâu."
      },
      {
        title: "Kiểm định chất lượng cọc móng khoan nhồi sâu",
        desc: "Áp dụng phương pháp siêu âm truyền qua (Cross-hole Sonic Logging) xác định khuyết tật bê tông thân cọc và thí nghiệm biến dạng nhỏ PIT."
      },
      {
        title: "Quan trắc biến dạng tự động kết nối IoT",
        desc: "Thiết lập hệ thống cảm biến quan trắc độ lún công trình, độ nghiêng tường vây hố móng thời gian thực, tự động gửi cảnh báo nguy hiểm."
      }
    ],
    process: [
      { step: "01", title: "Khảo sát sơ bộ & Đề xuất phương án", desc: "Nghiên cứu bản vẽ kiến trúc, sơ đồ tải trọng kết cấu, đề xuất số lượng điểm khảo sát khoa học." },
      { step: "02", title: "Triển khai đo đạc khoan thực địa", desc: "Sử dụng dàn khoan chuyên dụng hiện đại và thiết bị thu đo dữ liệu độ nhạy cao chuẩn xác quốc tế." },
      { step: "03", title: "Thí nghiệm phòng Lab chuẩn ISO", desc: "Xác định các chỉ tiêu cơ lý của đất, cường độ nén bê tông bằng máy nén tạo tải tự động." },
      { step: "04", title: "Lập hồ sơ báo cáo kỹ thuật", desc: "Tổng hợp số liệu xuất thuyết minh báo cáo giải pháp xử lý nền móng tối ưu nhất cho kỹ sư thiết kế." }
    ],
    benefits: [
      "Cung cấp số liệu đầu vào siêu chuẩn xác giúp tối giản hóa chiều dài cọc móng, tiết kiệm hàng tỷ đồng vật tư thép.",
      "Bảo đảm an toàn tuyệt đối cho các công trình lân cận trong suốt quá trình đào hố móng sâu.",
      "Nhận được sự đồng hành từ đơn vị uy tín của Bộ Xây dựng có chứng chỉ hoạt động hạng 1."
    ],
    media: []
  },
  {
    id: "tu-van-du-an",
    title: "Tư Vấn Quản Lý Dự Án, Đấu Thầu & Thẩm Định Tính Khả Thi",
    tagline: "Quản trị dự án chuẩn chuyên nghiệp - Tối ưu hóa dòng tiền đầu tư",
    shortDesc: "Đồng hành cùng chủ đầu tư từ khâu lập báo cáo nghiên cứu tiền khả thi, lập hồ sơ mời thầu, đánh giá hồ sơ dự thầu đến trực tiếp giám sát, quản lý tiến độ, chi phí toàn bộ vòng đời dự án.",
    category: "Quản lý dự án",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80",
    whyNeedTitle: "Tại sao nên thuê tư vấn quản lý chuyên nghiệp độc lập?",
    whyNeed: [
      "Gia tăng tính minh bạch, hạn chế tối đa thất thoát dòng vốn đầu tư trong công tác mua sắm đấu thầu.",
      "Đảm bảo tiến độ dự án khớp 100% nhờ áp dụng các quy trình quản lý hiện đại (Primavera, MS Project).",
      "Giải quyết triệt để các xung đột kỹ thuật phát sinh giữa các nhà thầu thi công trên công trường."
    ],
    scope: [
      {
        title: "Tư vấn lập Báo cáo nghiên cứu khả thi (FS)",
        desc: "Đánh giá chi tiết khía cạnh kinh tế, kỹ thuật, môi trường, xã hội của dự án, chứng minh hiệu quả tài chính phục vụ gọi vốn đầu tư."
      },
      {
        title: "Quản lý đấu thầu & Lập hồ sơ mời thầu chất lượng",
        desc: "Xây dựng các tiêu chí kỹ thuật, tài chính tuyển chọn nhà thầu, tối thiểu hóa rủi ro tranh chấp điều khoản phát sinh sau này."
      },
      {
        title: "Dịch vụ Giám sát tác giả & Quản lý dự án (PMO)",
        desc: "Trực tiếp điều phối nhân sự, kiểm soát dòng tiền giải ngân, báo cáo tiến độ độc lập hàng tuần gửi Ban giám đốc Chủ đầu tư."
      }
    ],
    process: [
      { step: "01", title: "Khởi động dự án & Xác định mục tiêu", desc: "Xác định rõ ràng ràng buộc về thời gian, ngân sách và yêu cầu kỹ thuật đặc thù của dự án." },
      { step: "02", title: "Lập kế hoạch tổng thể & Phân tích rủi ro", desc: "Phác thảo sơ đồ găng tiến độ, dự báo các biến số rủi ro về mặt bằng, thời tiết và pháp lý." },
      { step: "03", title: "Tổ chức đấu thầu minh bạch", desc: "Phát hành hồ sơ, giải đáp thắc mắc nhà thầu, chấm thầu kỹ thuật và thương thảo hợp đồng tối ưu." },
      { step: "04", title: "Kiểm soát thực thi liên tục", desc: "Kiểm tra hiện trạng công trường hằng ngày, nghiệm thu khối lượng hoàn thành, kiểm soát hồ sơ thanh toán." }
    ],
    benefits: [
      "Rút ngắn thời gian chuẩn bị đầu tư dự án trung bình từ 2-3 tháng.",
      "Tối ưu chi phí mua sắm thiết bị nhờ năng lực đàm phán hợp đồng thương mại xuất sắc.",
      "Chủ đầu tư rảnh tay tập trung vào kinh doanh và phát triển quỹ đất dự án mới."
    ],
    media: []
  },
  {
    id: "tu-van-giai-phap-nganh-thep",
    title: "Tư Vấn Giải Pháp Công Nghệ & Tối Ưu Hóa Sản Xuất Ngành Thép",
    tagline: "Ứng dụng BIM Tekla nâng cao năng suất chế tạo cấu kiện thép vượt trội",
    shortDesc: "Chuyển giao giải pháp phần mềm Tekla chuyên dụng, thiết lập quy trình bóc tách bản vẽ Shopdrawing tự động, kết nối trực tiếp mô hình BIM sang dây chuyền sản xuất cơ khí CNC hiện đại.",
    category: "Giải pháp công nghiệp",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80",
    whyNeedTitle: "Doanh nghiệp kết cấu thép cần chuyển đổi số?",
    whyNeed: [
      "Cắt giảm đến 80% thời gian triển khai bản vẽ chi tiết gia công thủ công dễ sai sót.",
      "Hạn chế tối đa hao hụt phôi thép nhờ thuật toán sắp xếp chi tiết cắt (Nesting) tối ưu trên tấm thép nguyên bản.",
      "Tự động xuất danh mục bulông, bản mã, thanh giằng chính xác tuyệt đối, rút ngắn thời gian lắp dựng công trường."
    ],
    scope: [
      {
        title: "Tư vấn & Chuyển giao phần mềm Tekla Structures bản quyền",
        desc: "Cung cấp bản quyền chính hãng từ Trimble kèm theo khóa đào tạo chuẩn hóa cho đội ngũ kỹ sư thiết kế chế tạo thép."
      },
      {
        title: "Xây dựng thư viện cấu kiện thép tự động (Smart Components)",
        desc: "Lập trình các liên kết cơ khí đặc thù của doanh nghiệp lên Tekla, giúp dựng hình liên kết tự động chỉ với 1 click."
      },
      {
        title: "Liên thông dữ liệu từ mô hình BIM đến dây chuyền sản xuất CNC",
        desc: "Xuất file định dạng DSTV kết nối trực tiếp máy cắt plasma, máy đục lỗ tự động giúp loại bỏ hoàn toàn đo đạc thủ công."
      }
    ],
    process: [
      { step: "01", title: "Đánh giá quy trình nhà máy", desc: "Khảo sát máy móc CNC hiện có và thói quen triển khai bản vẽ của bộ phận kỹ thuật." },
      { step: "02", title: "Cài đặt & Đồng bộ hệ thống", desc: "Xây dựng cơ sở dữ liệu vật liệu, phôi thép và định dạng xuất bản vẽ shopdrawing theo quy chuẩn riêng." },
      { step: "03", title: "Đào tạo thực chiến ứng dụng dự án", desc: "Cầm tay chỉ việc triển khai trực tiếp trên một dự án thực tế nhà xưởng khẩu độ lớn của doanh nghiệp." },
      { step: "04", title: "Liên thông dữ liệu sản xuất CNC", desc: "Test thử nghiệm xuất file máy CNC, căn chỉnh dung sai máy cắt phôi tự động đảm bảo khớp 100%." }
    ],
    benefits: [
      "Tăng năng suất sản xuất chế tạo thép tại nhà máy lên gấp 2-3 lần.",
      "Giảm thiểu lỗi lắp dựng lệch lỗ bulông tại công trường về mức tiệm cận 0%.",
      "Nâng cao vị thế thương hiệu khi tham thầu các dự án FDI khắt khe của Nhật, Mỹ."
    ],
    media: []
  },
  {
    id: "web-360-tuong-tac-thong-minh",
    title: "Giải Pháp Số Hóa Web 360 Tương Tác Thông Minh",
    tagline: "Trải nghiệm không gian ảo sống động - Đột phá marketing và quản lý",
    shortDesc: "Số hóa nhà xưởng, khu công nghiệp, dự án bất động sản hay showroom thành không gian 3D tương tác thực tế ảo, tích hợp thông tin IoT trực quan ngay trên trình duyệt web, không cần cài đặt.",
    category: "Giải pháp số & BIM",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80",
    whyNeedTitle: "Tại sao Web 360 là xu hướng tất yếu?",
    whyNeed: [
      "Cho phép đối tác nước ngoài tham quan thực tế nhà máy trực tuyến từ xa với góc nhìn 360 độ chân thực.",
      "Tích hợp các điểm chạm thông tin (Hotspots) chứa tài liệu PDF, video giới thiệu, thông số máy móc.",
      "Khả năng tích hợp dữ liệu cảm biến IoT thời gian thực, giám sát trạng thái thiết bị trực quan 3D."
    ],
    scope: [
      {
        title: "Số hóa không gian nhà máy & Khu công nghiệp",
        desc: "Chụp ảnh/quay phim panorama bằng thiết bị chuyên dụng độ phân giải 16K, dựng sơ đồ mặt bằng di chuyển 3D tiện lợi."
      },
      {
        title: "Thiết lập Showroom ảo & Căn hộ mẫu 3D tương tác",
        desc: "Thiết kế không gian 3D giả lập cho phép khách hàng đổi màu sắc nội thất, vật liệu gạch lát nền trực tuyến tức thời."
      },
      {
        title: "Tích hợp hệ thống quản lý dữ liệu vận hành (Digital Twin Web Portal)",
        desc: "Tạo liên kết trực tiếp giữa các thiết bị trên giao diện 360 với phần mềm quản lý tài sản, hiển thị thông số nhiệt độ, áp suất máy."
      }
    ],
    process: [
      { step: "01", title: "Khảo sát thực địa & Lên kịch bản", desc: "Xác định các góc chụp lý tưởng, xây dựng luồng di chuyển logic của người xem trong không gian ảo." },
      { step: "02", title: "Ghi hình panorama chuyên sâu", desc: "Ghi hình bằng thiết bị chuyên dụng hàng đầu, xử lý HDR cân bằng ánh sáng chuyên nghiệp." },
      { step: "03", title: "Lập trình tương tác & Hotspots", desc: "Ghép nối các điểm không gian, thêm menu điều hướng thông minh, tích hợp âm thanh, nhãn thông tin." },
      { step: "04", title: "Publish lên Web Cloud & Bàn giao", desc: "Tối ưu hóa dung lượng giúp trang web load siêu tốc dưới 2s trên cả điện thoại di động thông minh." }
    ],
    benefits: [
      "Tăng tỷ lệ chuyển đổi chốt deal dự án bất động sản, cho thuê nhà xưởng KCN lên đến 40%.",
      "Tiết kiệm chi phí đi lại thực địa cho đối tác quốc tế trong giai đoạn khảo sát sơ bộ.",
      "Tạo ấn tượng công nghệ vượt trội, khẳng định vị thế dẫn đầu xu hướng số hóa của doanh nghiệp."
    ],
    media: []
  },
  {
    id: "tu-van-kiem-ke-khi-nha-kinh",
    title: "Dịch Vụ Tư Vấn Kiểm Kê Khí Nhà Kính & Lộ Trình ESG",
    tagline: "Chuyển đổi xanh bền vững - Đáp ứng tiêu chuẩn xuất khẩu quốc tế CBAM",
    shortDesc: "Đo đạc, tính toán lượng phát thải khí nhà kính Scope 1, 2, 3 chuẩn ISO 14064, xây dựng báo cáo phát thải xanh và thiết lập lộ trình trung hòa carbon hướng đến Net Zero cho doanh nghiệp.",
    category: "Năng lượng & Môi trường",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2070&auto=format&fit=crop",
    whyNeedTitle: "Tại sao doanh nghiệp phải kiểm kê khí nhà kính ngay lúc này?",
    whyNeed: [
      "Tuân thủ Nghị định 06/2022/NĐ-CP của Chính phủ bắt buộc các cơ sở phát thải lớn phải kiểm kê khí nhà kính.",
      "Vượt qua rào cản thuế Carbon carbon nhập khẩu của châu Âu (CBAM) để duy trì hoạt động xuất khẩu.",
      "Nâng cao điểm số xếp hạng ESG (Môi trường - Xã hội - Quản trị) thu hút các quỹ đầu tư xanh toàn cầu."
    ],
    scope: [
      {
        title: "Kiểm kê khí nhà kính cấp cơ sở & cấp tổ chức",
        desc: "Xác định ranh giới phát thải, thu thập hóa đơn điện, nhiên liệu tiêu thụ để tính toán lượng phát thải CO2 tương đương theo chuẩn ISO 14064-1."
      },
      {
        title: "Xây dựng lộ trình giảm phát thải & Trung hòa Carbon",
        desc: "Đề xuất các giải pháp chuyển đổi năng lượng mặt trời, tối ưu hiệu suất máy móc, thay thế nguyên liệu đầu vào xanh."
      },
      {
        title: "Hỗ trợ chuẩn bị hồ sơ kiểm toán phát thải độc lập",
        desc: "Tư vấn thiết lập hệ thống ghi chép số liệu khoa học sẵn sàng cho công tác thẩm tra từ các tổ chức chứng nhận độc lập uy tín quốc tế."
      }
    ],
    process: [
      { step: "01", title: "Xác định ranh giới & Phạm vi phát thải", desc: "Xác định rõ ràng nguồn phát thải trực tiếp (Scope 1), phát thải gián tiếp từ điện (Scope 2) và chuỗi cung ứng (Scope 3)." },
      { step: "02", title: "Thu thập & Chuẩn hóa số liệu hoạt động", desc: "Thu thập số liệu tiêu hao năng lượng, vận chuyển vật tư, xử lý rác thải trong năm đánh giá." },
      { step: "03", title: "Tính toán phát thải bằng công cụ chuẩn hóa", desc: "Áp dụng hệ số phát thải cập nhật mới nhất của IPCC và Bộ Tài nguyên Môi trường Việt Nam." },
      { step: "04", title: "Lập báo cáo kiểm kê & Phương án giảm thiểu", desc: "Xuất báo cáo chi tiết kèm phân tích điểm nóng phát thải và đề xuất giải pháp tiết giảm tối ưu chi phí." }
    ],
    benefits: [
      "Tránh các hình phạt hành chính liên quan đến chậm nộp báo cáo phát thải theo luật định Việt Nam.",
      "Tiết kiệm chi phí hóa đơn tiền điện trung bình từ 10-15% nhờ tìm ra nguồn hao phí lãng phí năng lượng.",
      "Mở rộng cơ hội tiếp cận dòng vốn tín dụng xanh với lãi suất ưu đãi cực tốt từ các ngân hàng."
    ],
    media: []
  },
  {
    id: "ho-so-nang-luc-trung-tam-bim",
    title: "Hồ Sơ Năng Lực Trung Tâm BIM & Digital Twins CIC",
    tagline: "Nơi tụ hội tinh hoa công nghệ số và giải pháp xây dựng thông minh hàng đầu",
    shortDesc: "Tổng quan về năng lực cốt lõi, đội ngũ chuyên gia giàu kinh nghiệm quốc tế, hạ tầng công nghệ vượt trội và danh sách dự án quốc gia tiêu biểu do Trung tâm BIM & Digital Twins - CIC trực tiếp triển khai.",
    category: "Giới thiệu & Hồ sơ",
    image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80",
    whyNeedTitle: "Tại sao nên chọn Trung tâm BIM & Digital Twins làm đối tác?",
    whyNeed: [
      "Là đơn vị trực thuộc CIC với bề dày lịch sử đồng hành cùng Bộ Xây dựng trong các đề án thúc đẩy ứng dụng BIM quốc gia.",
      "Đội ngũ chuyên gia sở hữu chứng chỉ BIM quốc tế danh giá (Autodesk, Bentley, Trimble) có kinh nghiệm thực chiến.",
      "Sở hữu hệ thống phòng Lab nghiên cứu và đào tạo BIM hiện đại, chuyển giao công nghệ bài bản chuẩn ISO 19650."
    ],
    scope: [
      {
        title: "Đội ngũ chuyên gia tư vấn cấp cao",
        desc: "Quy tụ hơn 30 chuyên gia đào tạo, kỹ sư công nghệ chuyên sâu am hiểu cặn kẽ tiêu chuẩn pháp lý Việt Nam và quốc tế."
      },
      {
        title: "Năng lực công nghệ & Thiết bị bản quyền tối tân",
        desc: "Được trang bị đầy đủ bản quyền các phần mềm thiết kế mô phỏng hàng đầu thế giới, kết hợp hạ tầng máy chủ hiệu năng cao phục vụ xử lý dữ liệu lớn."
      },
      {
        title: "Hệ thống dự án tiêu biểu trải rộng toàn quốc",
        desc: "Từ Landmark 81, các dự án cao tốc Bắc-Nam, nhà máy nhiệt điện lớn đến các công trình quy hoạch thông minh."
      }
    ],
    process: [
      { step: "01", title: "Tìm hiểu yêu cầu đối tác", desc: "Lắng nghe thách thức và kỳ vọng chuyển đổi số của doanh nghiệp để đưa ra cấu trúc hợp tác tốt nhất." },
      { step: "02", title: "Xây dựng phương án chuyên biệt", desc: "Thiết kế lộ trình chuyển giao công nghệ, đào tạo nhân lực và hỗ trợ dự án may đo riêng cho doanh nghiệp." },
      { step: "03", title: "Ký kết & Khởi động dự án", desc: "Cam kết các chỉ số hiệu suất đầu ra rõ ràng (KPIs), thành lập ban điều phối dự án chung giữa hai bên." },
      { step: "04", title: "Đồng hành trọn đời dự án", desc: "Hỗ trợ kỹ thuật 24/7, cập nhật các xu hướng công nghệ mới nhất giúp duy trì vị thế dẫn đầu của đối tác." }
    ],
    benefits: [
      "Doanh nghiệp được bảo đảm chất lượng chuyển giao bằng thương hiệu quốc gia uy tín 35 năm của CIC.",
      "Tối ưu hóa chi phí đầu tư công nghệ nhờ các gói combo phần mềm và tư vấn tích hợp độc quyền.",
      "Được hỗ trợ đào tạo liên tục, cập nhật nâng cấp tính năng phần mềm hoàn toàn miễn phí định kỳ."
    ],
    media: []
  }
];
