/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ServiceDetail {
  id: string;
  title: string;
  tagline?: string;
  shortDesc: string;
  category: string;
  image: string;
  htmlContent: string;
  relatedProductIds?: number[];
  // Backwards compatibility fields for safety
  whyNeedTitle?: string;
  whyNeed?: string[];
  scopeTitle?: string;
  scope?: {
    title: string;
    desc?: string;
    list?: string[];
    img?: string;
  }[];
  process?: {
    step: string;
    title: string;
    desc: string;
  }[];
  benefits?: string[];
  media?: {
    type?: 'image' | 'text_block';
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
    title: "Tư vấn BIM",
    tagline: "CIC – Đối tác tin cậy trong hành trình chuyển đổi số ngành xây dựng",
    shortDesc: "Dịch vụ Tư vấn BIM toàn diện của CIC mang đến giải pháp giúp doanh nghiệp bứt phá chuyển đổi số, tiết kiệm chi phí, tối ưu quy trình và nâng cao năng lực cạnh tranh trong ngành xây dựng.",
    category: "Tư vấn & BIM",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80",
    relatedProductIds: [1, 3, 5, 12],
    htmlContent: `
<div class="title_head margin-top-20 margin-bottom-20">
<h2 style="text-align: center;"><span style="font-size:13pt"><span style="line-height:150%"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Dịch Vụ Tư Vấn BIM Toàn Diện của CIC – Bứt Phá Chuyển Đổi Số Ngành Xây Dựng</strong></span></span></span></span></h2>

<p data-end="567" data-start="257" style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong data-end="373" data-start="257">Doanh nghiệp của bạn&nbsp;đang tìm kiếm giải pháp BIM hiệu quả để tiết kiệm chi phí, tối ưu quy trình và nâng cao năng lực cạnh tranh?</strong></span></span></p>

<p data-end="567" data-start="257" style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">CIC – Công ty Công nghệ và Tư vấn hàng đầu Việt Nam với hơn <strong data-end="458" data-start="436">35&nbsp;năm kinh nghiệm</strong>, mang đến <strong data-end="501" data-start="469">dịch vụ tư vấn BIM toàn diện</strong>, giúp doanh nghiệp <strong data-end="566" data-start="521">chủ động chuyển đổi số – nâng cao năng lực cạnh tranh</strong>.</span></span></p>

<p style="text-align: center;"><img alt="" src="https://www.cic.com.vn/upload_images/images/2025/BIM/Cong-ty-CIC-dich-vu-BIM.jpg" style="width: 800px; max-width: 100%; height: auto;" /></p>

<p style="text-align: center;"><em><span style="font-size:16px;"><span style="font-family:Times New Roman,Times,serif;">Ông Đặng Đức Hà – Chủ tịch HĐQT Công ty Cổ phần Công nghệ và Tư vấn CIC (CIC) phát biểu trong một sự kiện chuyển đổi số năm 2024</span></span></em></p>

<h2 style="text-align: justify; margin: 0in 0in 0.0001pt;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span style="line-height:150%">Ra đời trong bối cảnh&nbsp;kỷ nguyên vươn mình của dân tộc Việt Nam, Trung Tâm <strong>BIM &amp; Digital Twins</strong> trực thuộc Công ty Cổ phần Công nghệ và Tư vấn CIC (CIC) tự hào là đơn vị tiên phong trong lĩnh vực công nghệ và tư vấn xây dựng tại Việt Nam. Chúng tôi không ngừng đổi mới để mang đến những giải pháp công nghệ tối ưu nhất cho ngành xây dựng, trong đó có&nbsp;dịch vụ tư vấn <strong>BIM (Building Infomation Modeing- Mô hình thông tin công trình)&nbsp;</strong>chính là thế mạnh hàng đầu.</span></span></span></h2>

<h2><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span style="line-height:150%">Tại sao doanh nghiệp cần dịch vụ tư vấn BIM của CIC?</span></span></span></strong></h2>

<ul>
	<li><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span style="line-height:150%">Tăng tốc tiến độ dự án và giảm thiểu sai sót nhờ quản lý toàn bộ vòng đời công trình (từ thiết kế, thi công đến vận hành).</span></span></span></li>
	<li><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span style="line-height:150%">Tiết kiệm chi phí đầu tư và đảm bảo chất lượng theo tiêu chuẩn quốc tế.</span></span></span></li>
	<li><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span style="line-height:150%">Tiếp cận công nghệ BIM mới nhất (BIM 4D, 5D, 6D, Digital Twin).</span></span></span></li>
</ul>

<p style="text-align:justify; margin:0in 0in 0.0001pt"><br />
&nbsp;</p>

<p style="margin: 0in 0in 0.0001pt; text-align: center;"><span style="font-size:13pt"><span style="line-height:150%"><img alt="" src="https://www.cic.com.vn/upload_images/images/2025/BIM/Cong-ty-CIC-dich-vu-BIM1.jpg" style="width: 800px; max-width: 100%; height: auto;" /></span></span></p>

<h2 style="text-align: justify; margin: 0in 0in 0.0001pt;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span style="line-height:150%"><b>2. Các dịch vụ tư vấn BIM của CIC</b></span></span></span></h2>

<h2 style="text-align: justify; margin: 0in 0in 0.0001pt;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span style="line-height:150%">CIC cung cấp các giải pháp BIM toàn diện, đáp ứng nhu cầu của doanh nghiệp trong việc triển khai và ứng dụng BIM hiệu quả. Các dịch vụ cụ thể bao gồm:</span></span></span></h2>

<h2 style="text-align: justify; margin: 0in 0in 0.0001pt;"><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><em><span style="line-height:150%">2.1. Dịch vụ tư vấn BIM dành cho Chủ đầu tư</span></em></span></span></strong></h2>

<p style="text-align: center;"><img alt="" src="https://www.cic.com.vn/upload_images/images/2025/BIM/Cong-ty-CIC-dich-vu-BIM2.jpg" style="width: 800px; max-width: 100%; height: auto;" /></p>

<p><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>CIC cung cấp dịch vụ tư vấn BIM</strong> chuyên sâu dành cho chủ đầu tư, giúp kiểm soát chất lượng, tiến độ và chi phí dự án một cách chặt chẽ và hiệu quả.Với dịch vụ tư vấn BIM, chủ đầu tư sẽ được:</span></span></p>

<ul>
	<li><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Đào tạo kiến thức tổng quan về BIM, giúp hiểu rõ các công cụ kiểm soát chất lượng mô hình BIM của đơn vị tư vấn thiết kế và nhà thầu.</span></span></li>
	<li><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Thiết lập tiêu chuẩn BIM (EIR), khảo sát quy trình hoạt động của doanh nghiệp và xây dựng bộ tiêu chuẩn phù hợp với quy định tại Việt Nam, đảm bảo chất lượng BIM từ các đơn vị tham gia dự án.</span></span></li>
	<li><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Hỗ trợ trong quá trình đấu thầu, đánh giá kế hoạch thực hiện BIM (BEP) của các nhà thầu, giúp chủ đầu tư lựa chọn đơn vị phù hợp.&nbsp;</span></span></li>
	<li><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Thẩm tra chất lượng của mô hình BIM</span></span></li>
	<li><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Tư vấn triển khai Môi trường Dữ liệu Chung (CDE), giúp quản lý và kiểm soát toàn bộ quy trình BIM một cách minh bạch và hiệu quả.</span></span></li>
	<li><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Tạo lập mô hình BIM 3D để phục vụ thẩm định theo các yêu cầu của Nhà nước.</span></span></li>
	<li><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Ứng dụng các giải pháp BIM tiên tiến như BIM 4D (mô phỏng tiến độ thi công), BIM 5D (quản lý chi phí) và BIM 6D (quản lý vận hành), giúp chủ đầu tư kiểm soát toàn diện dự án.</span></span></li>
	<li><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Xây dựng mô hình số song sinh (Digital Twins), hỗ trợ giám sát, quản lý và bảo trì công trình sau khi đưa vào vận hành.</span></span></li>
</ul>

<p style="text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><img alt="" src="https://www.cic.com.vn/upload_images/images/2025/BIM/TU-VAN-BIM.jpg" style="width: 650px; max-width: 100%; height: auto;" /></span></span></p>

<h3><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><em>2.2. Dịch vụ tư vấn BIM dành cho đơn vị tư vấn thiết kế</em></span></span></strong></h3>

<h3 style="text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><em><img alt="" src="https://www.cic.com.vn/upload_images/images/2025/BIM/Cong-ty-CIC-dich-vu-BIM3.jpg" style="width: 800px; max-width: 100%; height: auto;" /></em></span></span></h3>

<p style="text-align: center;"><span style="font-size:16px;"><span style="font-family:Times New Roman,Times,serif;"><em>Khóa đào tạo BIM theo tiêu chuẩn ISO 19650 cho các đơn vị tư vấn thiết kế hàng đầu như: TEDI, VNCC, Junglim, CPG,…</em></span></span></p>

<p style="text-align: justify;"><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">CIC cung cấp dịch vụ tư vấn BIM chuyên sâu dành cho đơn vị tư vấn thiết kế để trực tiếp triển khai BIM trong dự án thực tế, bao gồm:.</span></span></strong></p>

<ul>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Thiết lập Kế hoạch thực hiện BIM (B.E.P) để triển khai BIM vào hoạt động sản xuất tại doanh nghiệp.&nbsp;</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Đào tạo các kiến thức tổng quan về BIM, các công cụ tạo lập mô hình BIM phổ biến: Revit, Tekla, Allplan,.. để tạo lập mô hình BIM (3D)</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Đào tạo về các công cụ phần mềm để thực hiện các nội dung áp dụng BIM như: BIM 4D (Fuzor, SYNCHRO), BIM 5D (Cubicost),…</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Kết hợp với đơn vị tư vấn thiết kế thực hiện tạo lập mô hình BIM (3D) để nộp thẩm định và một số nội dung áp dụng BIM phổ thông khác như: BIM 4D (mô phỏng tiến độ thi công), BIM 5D (quản lý chi phí), BIM 6D (quản lý vận hành)</span></span></li>
</ul>

<h3 style="text-align: justify;"><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><em>2.3. Dịch vụ Tư vấn BIM dành cho nhà thầu thi công</em></span></span></strong></h3>

<h3 style="text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><em><img alt="" src="https://www.cic.com.vn/upload_images/images/2025/BIM/Cong-ty-CIC-dich-vu-BIM4.jpg" style="width: 800px; max-width: 100%; height: auto;" /></em></span></span></h3>

<p style="text-align: justify;"><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">CIC cung cấp dịch vụ tư vấn BIM chuyên sâu dành cho nhà thầu thi công để trực tiếp triển khai BIM trong dự án thực tế, bao gồm:</span></span></strong></p>

<ul>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Thiết lập Kế hoạch thực hiện BIM (B.E.P) để triển khai BIM vào hoạt động sản xuất tại doanh nghiệp.&nbsp;</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Đào tạo các kiến thức tổng quan về BIM, các công cụ tạo lập mô hình BIM phổ biến: Revit, Tekla, Allplan,.. để tạo lập mô hình BIM (3D).</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Đào tạo về các công cụ phần mềm để thực hiện các nội dung áp dụng BIM như: BIM 4D (Fuzor, SYNCHRO), BIM 5D (Cubicost),</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Kết hợp với nhà thầu thi công thực hiện tạo lập mô hình BIM (3D) để nộp thẩm định và một số nội dung áp dụng BIM phổ thông khác như: BIM 4D (mô phỏng tiến độ thi công), BIM 5D (quản lý chi phí), BIM 6D (quản lý vận hành)</span></span></li>
</ul>

<h3 style="text-align: justify;"><strong><em><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">2.4. Dịch vụ Tư vấn BIM dành cho đơn vị vận hành tài sản</span></span></em></strong></h3>

<p style="text-align: center;"><img alt="" src="https://www.cic.com.vn/upload_images/images/2025/BIM/tu-van-bim-cua-cic.png" style="width: 650px; max-width: 100%; height: auto;" /></p>

<p style="text-align: center;"><span style="font-size:16px;"><em><span style="font-family:Times New Roman,Times,serif;">Ứng dụng BIM trong quá trình vận hành tài sản với giái pháp Autodesk Tandem</span></em></span></p>

<p><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Công ty CIC cung cấp dịch vụ tư vấn BIM chuyên sâu dành cho đơn vị vận hành tài sản để trực tiếp triển khai BIM trong dự án thực tế, bao gồm:</span></span></strong></p>

<ul>
	<li><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Đào tạo các kiến thức tổng quan về BIM: công nghệ và cơ sở pháp lý.</span></span></li>
	<li><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Thiết lập quy trình áp dụng BIM trong công tác vận hành bảo trì tài sản: thiết lập môi trường trao đổi dữ liệu chung (CDE).</span></span></li>
	<li><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Cập nhật mô hình BIM theo bản vẽ hoàn công, tích hợp các thông vận hành tài sản theo chuẩn Cobie.</span></span></li>
	<li><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Tích hợp các dữ liệu vận hành để tạo lập mô hình số song sinh (Digital Twins)</span></span></li>
	<li><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Tích hợp dữ liệu từ các giải pháp ERP (SAP, Oracle) vào môi trường giữ liệu chung (CDE) để kiểm soát dữ liệu vận hành.</span></span></li>
</ul>

<p><span style="font-size:24px;"><span style="font-family:Times New Roman,Times,serif;">&gt;&gt;&gt;Đăng ký nhận tư vấn miễn phí ngay <a href="https://forms.gle/JsbYeYNxvf5vNNk17" target="_blank" rel="noopener noreferrer">tại đây!</a></span></span></p>

<h2><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">3. Hợp tác với cơ quan quản lý Nhà nước trong lĩnh vực BIM</span></span></strong></h2>

<p><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Nhận thức được vai trò quan trọng của BIM trong việc nâng cao chất lượng thẩm định và quản lý dự án, Công ty CIC đã tích cực hợp tác với các cơ quan quản lý Nhà nước nhằm thúc đẩy ứng dụng BIM trong các dự án xây dựng công cộng.&nbsp;</span></span></p>

<p><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Vào ngày 10/9/2024, CIC cùng Cục Quản lý hoạt động xây dựng đã tổ chức Hội nghị thảo luận về việc áp dụng BIM trong thẩm định dự án đầu tư xây dựng. Tại hội nghị, đại diện Công ty&nbsp;CIC đã trình bày về mô hình BIM và các phần mềm liên quan, nhấn mạnh việc sử dụng BIM như công cụ hỗ trợ thẩm định báo cáo nghiên cứu khả thi, thiết kế xây dựng, cấp phép và kiểm tra nghiệm thu công trình.</span></span></p>

<p style="text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><img alt="" src="https://www.cic.com.vn/upload_images/images/2025/BIM/Cong-ty-CIC-dich-vu-BIM6.jpg" style="width: 800px; max-width: 100%; height: auto;" /></span></span></p>

<p style="text-align: center;"><em><span style="font-size:16px;"><span style="font-family:Times New Roman,Times,serif;">Nhóm Chuyên gia của Trung tâm BIM &amp; Digital Twins (Công ty CIC) làm việc với lãnh đạo Cục Quản lý hoạt động xây dựng (Bộ Xây dựng)</span></span></em></p>

<p style="text-align: center;"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;"><img alt="" src="https://www.cic.com.vn/upload_images/images/2025/BIM/Cong-ty-CIC-dich-vu-BIM7.jpg" style="width: 800px; max-width: 100%; height: auto;" /></span></span></p>

<p style="text-align: center;"><span style="font-size:16px;"><span style="font-family:Times New Roman,Times,serif;"><em>Ông Lương Thành Hưng – Phó Tổng Giám đốc Công ty CIC làm việc với lãnh đạo Cục Quản lý hoạt động xây dựng (Bộ Xây dựng)</em></span></span></p>

<p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Cùng với đó, Công ty CIC đã phối hợp với Sở Xây dựng các tỉnh thành như: Hà Nội, TP.HCM, Quảng Ninh, Lào Cai,…tổ chức lớp bồi dưỡng kiến thức về Mô hình thông tin công trình (BIM) cho các học viên đến từ các Sở, Ban Quản lý dự án và UBND các quận, huyện, thị xã ,…</span></span></p>

<p style="text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><img alt="" src="https://www.cic.com.vn/upload_images/images/2025/BIM/Cong-ty-CIC-dich-vu-BIM8.jpg" style="width: 800px; max-width: 100%; height: auto;" /></span></span></p>

<p style="text-align: center;"><em><span style="font-size:16px;"><span style="font-family:Times New Roman,Times,serif;">Ông Lương Thành Hưng – Phó Tổng Giám đốc Công ty CIC tại buổi hội thảo với Sở Xây dựng Hà Nội</span></span></em></p>

<p style="text-align: center;"><em><span style="font-size:16px;"><span style="font-family:Times New Roman,Times,serif;"><img alt="" src="https://www.cic.com.vn/upload_images/images/2025/BIM/CIC-dao-ta-BIM-cho-SXD-Quang-Tri.jpg" style="width: 800px; max-width: 100%; height: auto;" /></span></span></em></p>

<p style="text-align: center;"><em><span style="font-size:16px;"><span style="font-family:Times New Roman,Times,serif;">CIC tham gia tập huấn Mô hình thông tin BIM tại Sở Xây dựng tỉnh Quảng Trị</span></span></em></p>

<p style="text-align: center;"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;"><img alt="" src="https://www.cic.com.vn/upload_images/images/2025/BIM/Cong-ty-CIC-dich-vu-BIM9.jpg" style="width: 800px; max-width: 100%; height: auto;" /></span></span></p>

<p style="text-align: center;"><span style="font-size:16px;"><em><span style="font-family:Times New Roman,Times,serif;">Ông Nguyễn Hoàng Hà &nbsp;– Tổng Giám đốc (CIC) tại buổi hội thảo AI với Hiệp hội tư vấn xây dựng Việt Nam (VECAS)</span></em></span></p>

<h2><strong><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">4. Hợp tác quốc tế – Định hướng phát triển bền vững</span></span></strong></h2>

<p style="text-align: center;"><img alt="" src="https://www.cic.com.vn/upload_images/images/2025/BIM/Cong-ty-CIC-dich-vu-BIM11.jpg" style="width: 800px; max-width: 100%; height: auto;" /></p>

<p style="text-align: center;"><span style="font-size:16px;"><span style="font-family:Times New Roman,Times,serif;">Lễ ký kết MoU giữa CIC và BIMAGE&nbsp;</span></span></p>

<p><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Với mục tiêu nâng cao chất lượng dịch vụ và mang đến các giải pháp BIM tiên tiến, Công ty CIC đã ký kết thỏa thuận hợp tác chiến lược với BIMAGE Consulting – công ty tư vấn BIM hàng đầu Singapore. Sự hợp tác này giúp CIC tiếp cận các công nghệ và phương pháp tiên tiến trong lĩnh vực BIM, đồng thời mang lại lợi ích thiết thực cho các doanh nghiệp Việt Nam thông qua việc chuyển giao công nghệ, đào tạo nhân lực và triển khai các dự án BIM quy mô lớn theo tiêu chuẩn quốc tế.</span></span></p>

<p style="text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><img alt="" src="https://www.cic.com.vn/upload_images/images/2025/BIM/Cong-ty-CIC-dich-vu-BIM12.jpg" style="width: 800px; max-width: 100%; height: auto;" /></span></span></p>

<p style="text-align: center;"><span style="font-size:16px;"><em><span style="font-family:Times New Roman,Times,serif;">Ông Nguyễn Hoàng Hà &nbsp;– Tổng Giám đốc (CIC) tại lễ ký kết biên bản ghi nhớ hợp tác giữa Autodesk và VC GROUP</span></em></span></p>

<h2><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">5. Lợi ích khi đồng hành cùng Công ty CIC</span></span></strong></h2>

<p><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">•&nbsp;&nbsp; &nbsp;Tiết kiệm chi phí &amp; thời gian: Hạn chế tối đa sai sót, giúp dự án hoàn thành đúng tiến độ với ngân sách tối ưu.<br />
•&nbsp;&nbsp; &nbsp;Chuyển giao công nghệ toàn diện: Doanh nghiệp không chỉ được tư vấn mà còn được đào tạo để chủ động triển khai BIM hiệu quả.<br />
•&nbsp;&nbsp; &nbsp;Đội ngũ chuyên gia hàng đầu: Với kinh nghiệm triển khai nhiều dự án lớn, CIC cam kết mang đến giải pháp phù hợp nhất cho từng doanh nghiệp.<br />
•&nbsp;&nbsp; &nbsp;Tăng cường tính cạnh tranh: BIM giúp nâng cao chất lượng thiết kế, thi công và vận hành, tạo lợi thế lớn cho doanh nghiệp trong ngành xây dựng.</span></span></p>

<h2><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">6. CIC – Đối tác tin cậy trong hành trình chuyển đổi số ngành xây dựng</span></span></strong></h2>

<p><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Với sứ mệnh tiên phong trong lĩnh vực công nghệ xây dựng, CIC cam kết mang đến những giải pháp BIM toàn diện, giúp doanh nghiệp xây dựng tại Việt Nam nâng cao năng lực cạnh tranh và bắt kịp xu hướng công nghệ trên thế giới.</span></span></p>

<p><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Đồng hành cùng CIC, doanh nghiệp không chỉ được tiếp cận với các giải pháp công nghệ tiên tiến mà còn được hỗ trợ tận tình trong quá trình triển khai và ứng dụng BIM một cách hiệu quả nhất.</span></span></p>

<p><span style="font-size:24px;"><span style="font-family:Times New Roman,Times,serif;">&gt;&gt;&gt;Đăng ký nhận tư vấn miễn phí ngay <a href="https://forms.gle/JsbYeYNxvf5vNNk17" target="_blank" rel="noopener noreferrer">tại đây!</a></span></span></p>

<p><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>LIÊN HỆ NGAY VỚI ĐỘI NGŨ CHUYÊN GIA</strong></span></span></p>

<ul>
	<li><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Điện thoại: 086 893 4576 &nbsp;- 024 3976 1381</span></span></li>
	<li><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Email: &nbsp;info@cic.com.vn</span></span></li>
</ul>
</div>
    `
  },
  {
    id: "tu-van-lap-don-gia-chi-so-gia",
    title: "Tư vấn lập đơn giá, chỉ số giá",
    tagline: "Công ty Cổ phần Công nghệ và Tư vấn CIC – Đơn vị uy tín hàng đầu trong lĩnh vực kinh tế xây dựng",
    shortDesc: "Công ty Cổ phần Công nghệ và Tư vấn CIC tự hào là đơn vị tư vấn hàng đầu trong lĩnh vực lập đơn giá xây dựng cơ bản, đơn giá công ích đô thị, đền bù, tư vấn lập chỉ số giá xây dựng cho các địa phương trên toàn quốc.",
    category: "Kinh tế xây dựng",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80",
    relatedProductIds: [12, 1, 5, 7],
    htmlContent: `
      <div className="service-cms-body">
        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Công ty Cổ phần Công nghệ và Tư vấn CIC tự hào là đơn vị tư vấn hàng đầu trong lĩnh vực xây dựng. Chúng tôi đã tư vấn lập đơn giá xây dựng cơ bản; đơn giá công ích đô thị; đơn giá đền bù nhà cửa, vật kiến trúc và nội thất; phương án giá, giá dịch vụ công ích; tư vấn lập chỉ số giá xây dựng; khảo sát và tính toán xác định đơn giá nhân công; bảng giá ca máy và thiết bị thi công cho nhiều địa phương trên khắp cả nước như:&nbsp;Sơn La, Điện Biên, Bắc Kạn, Hà Giang, Tuyên Quang, Yên Bái, Lào Cai, Lạng Sơn, Phú Thọ, Thái Nguyên, Hưng Yên, Đắc Nông, Gia Lai, Ninh Bình...</span></span></p>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Trên cơ sở các văn bản hướng dẫn của các cơ quan quản lý nhà nước:</span></span></p>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">- Bộ định mức dự toán xây dựng công trình (định mức xây dựng công trình, định mức lắp đặt hệ thống kỹ thuật công trình, lắp đặt máy và thiết bị công nghệ, sửa chữa và bảo dưỡng công trình xây dựng, khảo sát xây dựng công trình, thí nghiệm chuyên ngành xây dựng, công ích đô thị...) của Bộ Xây Dựng và các Bộ chuyên ngành khác (đường dây tải điện và trạm biến áp, thí nghiệm điện,...);&nbsp;</span></span></p>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>- Nghị định số 32/2015/NĐ-CP ngày 25/03/2015 của Chính phủ về Quản lý chi phí đầu tư xây dựng;&nbsp;</strong></span></span></p>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">+ Thông tư 06/2016/TT-BXD ngày 10/3/2016 của Bộ Xây dựng về việc hướng dẫn xác định và quản lý chi phí đầu tư xây dựng;&nbsp;</span></span></p>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">+ Quyết định số 1134/QĐ-BXD ngày 08/10/2015 của Bộ Xây dựng về việc công bố định mức các hao phí xác định giá ca máy và thiết bị thi công xây dựng;&nbsp;</span></span></p>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">+ Thông tư 01/2015/TT-BXD ngày 20/03/2015 của Bộ Xây dựng về Hướng dẫn xác định đơn giá nhân công trong quản lý chi phí đầu tư &nbsp;xây dựng;</span></span></p>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">+ Thông tư 05/2016/TT-BXD ngày 10/03/2016 của Bộ Xây dựng về Hướng dẫn xác định đơn giá nhân công trong quản lý chi phí đầu tư &nbsp;xây dựng;&nbsp;</span></span></p>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>- Nghị định số 68/2019/NĐ-CP ngày 14/8/2019 của Chính phủ về Quản lý chi phí đầu tư xây dựng;</strong></span></span></p>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">+ &nbsp;Thông tư số 09/2019/TT-BXD ngày 26/12/2019 của Bộ Xây dựng về Hướng dẫn xác định và quản lý chi phí đầu tư xây dựng</span></span></p>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">+ &nbsp;Thông tư số 10/2019/TT-BXD ngày 26/12/2019 của Bộ Xây dựng về Ban hành định mức xây dựng</span></span></p>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">+ &nbsp;Thông tư số 11/2019/TT-BXD ngày 26/12/2019 của Bộ Xây dựng về Hướng dẫn xác định giá ca máy và thiết bị thi công xây dựng</span></span></p>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">+ &nbsp;Thông tư số 12/2019/TT-BXD ngày 26/12/2019 của Bộ Xây dựng về Hướng dẫn xây dựng và quản lý hệ thống cơ sở dữ liệu về định mức, giá xây dựng và chỉ số giá xây dựng</span></span></p>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">+ &nbsp;Thông tư số 13/2019/TT-BXD ngày 26/12/2019 của Bộ Xây dựng về Quy định việc quản lý chi phí đầu tư xây dựng các công trình xây dựng thuộc Chương trình mục tiêu quốc gia giảm nghèo bền vững,&nbsp;</span></span><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Chương trình mục tiêu quốc gia về xây dựng nông thôn mới</span></span></p>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">+ &nbsp;Thông tư số 14/2019/TT-BXD ngày 26/12/2019 của Bộ Xây dựng về Hướng dẫn xác định và quản lý chỉ số giá xây dựng</span></span></p>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">+ &nbsp;Thông tư số 15/2019/TT-BXD ngày 26/12/2019 của Bộ Xây dựng về Hướng dẫn xác định đơn giá nhân công xây dựng</span></span></p>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">+ &nbsp;Thông tư số 16/2019/TT-BXD ngày 26/12/2019 của Bộ Xây dựng về Hướng dẫn xác định chi phí quản lý dự án và tư vấn đầu tư xây dựng</span></span></p>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">+ &nbsp;Thông tư số 17/2019/TT-BXD ngày 26/12/2019 của Bộ Xây dựng về Hướng dẫn đo bóc khối lượng xây dựng công trình</span></span></p>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">+ &nbsp;Thông tư số 18/2019/TT-BXD ngày 26/12/2019 của Bộ Xây dựng về Hướng dẫn quy đổi vốn đầu tư xây dựng</span></span></p>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>- Nghị định số 10/2021/NĐ-CP ngày 09/02/2021 của Chính phủ về quản lý chi phí đầu tư xây dựng:</strong></span></span></p>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">+ Thông tư số 11/2021/TT-BXD ngày 31/8/2021 của Bộ Xây dựng về hướng dẫn một số nội dung xác định và quản lý chi phí đầu tư xây dựng;&nbsp;</span></span></p>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">+ Thông tư số 12/2021/TT-BXD ngày 31/8/2021 của Bộ Xây dựng về ban hành định mức xây dựng;&nbsp;</span></span></p>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">+ Thông tư số 13/2021/TT-BXD ngày 31/8/2021 của Bộ Xây dựng về hướng dẫn phương pháp xác định các chỉ tiêu kinh tế kỹ thuật và đo bóc khối lượng công trình... và nhiều văn bản khác liên quan.&nbsp;</span></span></p>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">+ Thông tư 14/2023/TT-BXD ngày 29/12/2023 của Bộ Xây dựng về sửa đổi, bổ sung một số điều của Thông tư 11/2021/TT-BXD hướng dẫn một số nội dung xác định và quản lý chi phí đầu tư xây dựng</span></span></p>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Thông tin liên hệ:</strong></span></span></p>

        <ul>
          <li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Phụ trách mảng Kinh tế Xây dựng- Công ty CP Công nghệ và Tư vấn CIC</span></span></li>
          <li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Nguyễn Văn Quang -&nbsp;</span></span><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Tel: 0908 366 986, 0967 33 1369 -&nbsp;</span></span><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Email: quangta@cic.com.vn</span></span></li>
        </ul>
      </div>
    `
  },
  {
    id: "tu-van-giai-phap-nganh-thep",
    title: "Tư vấn giải pháp ngành thép",
    tagline: "Giải pháp chuyển đổi số và tự động hóa toàn diện từ thiết kế đến chế tạo ngành thép",
    shortDesc: "Giải pháp ứng dụng cho ngành thép dựa trên mô hình làm việc khép kín giữa kỹ sư thiết kế, mô hình, triển khai chi tiết và gia công chế tạo dựa trên chuỗi phần mềm SAP2000/ETABS, IdeaStatica, Tekla và AlmaCAM.",
    category: "Giải pháp công nghiệp",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80",
    relatedProductIds: [3, 6, 5, 1],
    htmlContent: `
      <div className="service-cms-body">
        <h2 style="text-align: justify;"><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Tổng quan dịch vụ tư vấn giải pháp công nghệ ứng dụng cho ngành thép</span></span></strong></h2>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Với hơn 30 năm kinh nghiệm hoạt động trong lĩnh vực công nghệ ứng dụng trong xây dựng, giao thông, quy hoạch, cơ sở hạ tầng, năng lượng, dầu khí, khai khoáng… Hiện CIC là đối tác của các hãng phần mềm nổi tiếng trên thế giới trong lĩnh vực xây dựng &amp; cơ khí chế tạo như <a href="https://www.csiamerica.com/" target="_blank" rel="noopener noreferrer">CSI</a> (Mỹ), <a href="https://www.bentley.com/" target="_blank" rel="noopener noreferrer">Bentley</a> (Mỹ), <a href="https://www.ideastatica.com/" target="_blank" rel="noopener noreferrer">IdeaStatica</a> (Séc), <a href="https://www.almacam.com" target="_blank" rel="noopener noreferrer">Alma</a> (Pháp), <a href="http://www.adaptsoft.com/" target="_blank" rel="noopener noreferrer">Adapt</a> (Mỹ), <a href="https://www.trimble.com/" target="_blank" rel="noopener noreferrer">Trimble</a> (Mỹ), <a href="https://geoslope.com" target="_blank" rel="noopener noreferrer">Geo-Slope</a> (Canada), <a href="http://www.raptsoftware.com" target="_blank" rel="noopener noreferrer">Rapt</a> (Úc), <a href="http://glodon.com" target="_blank" rel="noopener noreferrer">Glodon</a> (Singapore)… với nhiều nhóm giải pháp phần mềm ứng dụng trong các ngành đặc thù khác nhau. Trong đó có chuỗi giải pháp ứng dụng cho ngành kết cấu thép &amp; cơ khí công nghiệp nặng.</span></span></p>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Giải pháp ứng dụng cho ngành thép dựa trên mô hình làm việc khép kín giữa kỹ sư thiết kế, kỹ sư mô hình, kỹ sư triển khai chi tiết và kỹ sư gia công chế tạo dựa trên các phần mềm mà CIC đang phân phối chuyển giao: <a href="https://www.csiamerica.com/products/sap2000" target="_blank" rel="noopener noreferrer">SAP2000</a>/<a href="https://www.csiamerica.com/products/Etabs" target="_blank" rel="noopener noreferrer">ETABS</a> – phân tích thiết kế kết cấu khung, dầm sàn hoạc tấm vỏ &lt;-&gt;<a href="https://www.ideastatica.com/steel/" target="_blank" rel="noopener noreferrer"> IdeaStatica Steel</a> – thiết kế và kiểm tra liên kết thép&lt;-&gt; Tekla (BIM Tool) – mô hình và cấu tạo kết cấu thép &amp; công trình &lt;-&gt; AlmaCAM – triên khai sắp xếp và tối ưu hóa cắt thép, quản lý vật tư.</span></span></p>

        <h2 style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>1. Giai đoạn thiết kế kết cấu</strong></span></span></h2>

        <h3 style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Cách làm thông thường theo sơ đồ dưới đây</strong></span></span></h3>

        <p style="text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong><img alt="Giai đoạn thiết kế kết cấu thông thường" src="https://www.cic.com.vn/upload_images/images/2020/04/1.png" style="width: 611px; max-width: 100%; height: auto;" /></strong></span></span></p>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Với cách làm truyền thống, kỹ sư thiết kế sẽ sử dụng các chương trình phân tích, thiết kế như SAP2000, ETABS, STAAD.PRO, Robot… để tính toán tiết diện thanh và có kết quả nội lực. Các kết quả này sẽ được chuyển cho bộ phận tính toán liên kết thép sử dụng các công cụ như Ram Connection, Limcom hoạc bảng tính Excel để tính toán liên kết. Chi tiết liên kết sau đó được chuyển cho bộ phần triển khai mô hình bằng công cụ BIM như Tekla, Revit hoạc Advance Steel.</span></span></p>

        <h3 style="text-align: justify;">&nbsp;</h3>

        <h3 style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Quá trình làm việc theo mô hình cũ sẽ phát sinh những hạn chế sau:</strong></span></span></h3>

        <ul>
          <li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Khâu chuyển đổi thông tin giữa bộ phận thiết kế phần khung và bộ phân thiết kế liên kết hoàn toàn thủ công có thể dẫn tới những sai sót</span></span></li>
          <li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Việc chuyển đổi giữa bộ phận thiết kế phần khung, bộ phân thiết kế liên kết đến bộ phân làm BIM cũng hoàn toàn thủ công.</span></span></li>
          <li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Trong quá trình thiết kế nếu phát sinh thay đổi, thay đổi phương án thì quy trình này lập lại từ đầu dẫn tới mất rất nhiều thời gian.</span></span></li>
          <li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Bộ phận mô hình BIM phải đợi bộ phận thiết kế xong mới có thể triển khai dẫn tới mất thời gian của cả hệ thống.</span></span></li>
        </ul>

        <h3 style="text-align: justify;">&nbsp;</h3>

        <h3 style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Cách làm theo mô hình kết hợp C.I.B:</strong></span></span></h3>

        <p>&nbsp;</p>

        <p style="text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong><img alt="Mô hình kết hợp CIB" src="https://www.cic.com.vn/upload_images/images/2020/04/2.png" style="width: 650px; max-width: 100%; height: auto;" /></strong></span></span></p>

        <p style="text-align: justify;">&nbsp;</p>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Với mô hình ứng dụng chuỗi giải pháp C.I.B của CIC, bằng việc ứng dụng các phần mềm SAP2000, ETABS, IdeaStatica, Tekla (BIM) tạo thành một chuỗi quy trình khép kín từ khâu thiết kế kết cấu khung, mô hình BIM, và tính toán kiểm tra liên kết. Sau khi công việc bộ phận thết kế kết cấu khung kết thúc, toàn bộ tiết diện thanh sẽ được chuyển sang bộ phận Tekla (BIM) để làm cấu tạo liên kết thép. Sau khi cấu tạo các nút liên kết bộ phận Tekla (BIM) sẽ chuyển mô hình cấu tạo nút sang cho bộ phận làm liên kết đồng thời lấy nội lực từ SAP2000, ETABS sang phần mềm IdeaStatica Steel để kiểm tra và thiết kế lại liên kết nếu chưa đủ khả năng chịu lực.</span></span></p>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Việc chuyển đổi mô hình và thông tin nội lực giữa các bộ phận hoàn toàn tự động, không có sai sót.</span></span></p>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Việc tiến hành dự án gần như song song giữa các bộ phân sẽ giúp tiết kiệm thời gian của cả dự án.</span></span></p>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Việc thay đổi phương án, hoạc thay đổi từ chủ đầu tư giờ không còn là nỗi lo vì quy trình đã hoàn toàn tự động, các thay đổi sẽ được tự động đồng bộ để tránh sai sót và không phải thiết kế lại từ đầu như phương pháp truyền thống.</span></span></p>

        <p style="text-align: justify;">&nbsp;</p>

        <p style="text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><img alt="Mô hình chuyển nội lực" src="https://www.cic.com.vn/upload_images/images/2020/04/3.png" style="width: 650px; max-width: 100%; height: auto;" /></span></span></p>

        <p style="text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><em>Mô hình chuyển nội lực từ SAP2000 -&gt;IdeaStatica Steel</em></span></span></p>

        <p style="text-align: center;">&nbsp;</p>

        <p style="text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><em><img alt="Mô hình chuyển cấu tạo nút" src="https://www.cic.com.vn/upload_images/images/2020/04/4.png" style="width: 596px; max-width: 100%; height: auto;" /></em></span></span></p>

        <p style="text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><em>Mô hình chuyển cấu tạo nút từ Tekla -&gt; IdeaStatica</em></span></span></p>

        <p style="text-align: center;">&nbsp;</p>

        <h2 style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>2. Giai đoạn gia công chế tạo</strong></span></span></h2>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Sau khi có mô hình BIM với các chi tiết kết cấu khung, liên kết thép và các bộ phận cơ khí liên quan khác như phếu, máng, tấm sàn… sẽ được xuất hoàn toàn tự động sang cho bộ phận gia công chế tạo. Với phần cắt thép, thay vì xuất bản vẽ sang để kỹ sư bố trí sắp xếp cắt thông quan phần mềm AutoCAD hoạc các phần mềm nesting thông thường. Với công nghệ của chúng tôi cộng đoạn này sẽ được ứng dụng với phần mềm cắt thép &amp; quản lý vật tư thông minh mà hãng AlmaCAM mang lại.</span></span></p>

        <p style="text-align: justify;">&nbsp;</p>

        <p style="text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><img alt="Cắt thép AlmaCAM" src="https://www.cic.com.vn/upload_images/images/2020/04/5.jpg" style="width: 650px; max-width: 100%; height: auto;" /></span></span></p>

        <p style="text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><em>Bố trí cắt thép tối ưu trên phần mềm AlmaCAM từ các part xuất từ Tekla</em></span></span></p>

        <p style="text-align: center;">&nbsp;</p>

        <h3><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Lợi ích của việc ứng dụng quy trình cắt thép tự động từ các parts chuyển từ Tekla-&gt;AlmaCAM:</strong></span></span></h3>

        <ul>
          <li><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Việc chuyển đổi dữ liệu là hoạt toàn tự động</span></span></li>
          <li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Việc đánh dấu phân loại các part hoàn toàn tự động</span></span></li>
          <li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Việc phân loại vật liệu độ dầy, thuộc tính vật liệu hoàn toàn tự động</span></span></li>
          <li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Quản lý vật tư và các thành phần dư trong kho để tái sử dụng cho các dự án sau</span></span></li>
          <li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Việc phân loại tìm kiếm vật tư trong kho phù hợp với các part của một dự án hoàn toàn tự đồng.</span></span></li>
        </ul>

        <h2 style="text-align: justify;">&nbsp;</h2>

        <h2 style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Với giải pháp trên CIC cung cấp tới các quý công ty sản phẩm và dịch vụ gì:</strong></span></span></h2>

        <ul>
          <li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Phần mềm bản quyền được phân phối theo kênh chính thức của các hãng.</span></span></li>
          <li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Tư vấn lựa chọn phiên bản phù hợp với nhu cầu công việc giúp tiết kiệm chi phí đầu tư.</span></span></li>
          <li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Đào tạo chuyển giao từ giai đoạn thiết kế đến giai đoạn gia công chế tạo, ứng dụng cho quá trình sản xuất.</span></span></li>
          <li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Dịch vụ tối ưu hóa kết cấu thép giúp giảm khối lượng, chi phí vật tư…</span></span></li>
          <li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Dịch vụ mô phỏng thổi gió và gán lực sau khi thôi gió vào các phần mềm phân tích thiết kế kết cấu theo yêu cầu.</span></span></li>
          <li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Dịch vụ tư vấn xử lý các vấn đề liên quan dạng kết cấu, dạng công trình có các liên kết phức tạp.</span></span></li>
        </ul>

        <p style="text-align: justify;">&nbsp;</p>

        <p style="text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><img alt="Mô hình thổi gió" src="https://www.cic.com.vn/upload_images/images/2020/04/6.png" style="width: 650px; max-width: 100%; height: auto;" /></span></span></p>

        <p style="text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><em>Mô hình thôi gió trên phần mềm&nbsp;</em></span></span></p>

        <p style="text-align: center;">&nbsp;</p>

        <p style="text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><img alt="CSI SAP2000 ETABS nhận lực" src="https://www.cic.com.vn/upload_images/images/2020/04/7.png" style="width: 650px; max-width: 100%; height: auto;" /></span></span><br />
        <span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><em>Mô hình phần mềm CSI SAP2000/ETABS nhận lực từ quá trình thổi gió</em></span></span></p>

        <p style="text-align: justify;">&nbsp;</p>
      </div>
    `
  },
  {
    id: "tu-van-du-an",
    title: "Tư vấn dự án",
    tagline: "Giải pháp tư vấn quản lý dự án, đấu thầu và lập dự án CNTT chuyên nghiệp",
    shortDesc: "Với đội ngũ chuyên gia am hiểu sâu sắc quy định pháp luật và có đầy đủ chứng chỉ chuyên môn, CIC cung cấp các dịch vụ tư vấn quản lý dự án, tư vấn đấu thầu, lập dự án CNTT và giám sát triển khai.",
    category: "Quản lý dự án",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80",
    relatedProductIds: [1, 3, 6, 12],
    htmlContent: `
      <div className="service-cms-body">
        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Với đội ngũ cán bộ là những Thạc sỹ, Kỹ sư, Cử nhân với chuyên ngành Điện tử viễn thông, Tự động hóa, Công nghệ thông tin, &nbsp;Phần mềm… với hơn 25&nbsp;năm kinh nghiệm hoạt động trong lĩnh vực cung cấp thiết bị công nghệ, &nbsp;dịch vụ tư vấn CNTT nói chung và dịch vụ tư vấn đấu thầu nói riêng, có trình độ am hiểu về các văn bản quy phạm pháp luật về quản lý, đầu tư ứng dụng CNTT, có đầy đủ các Chứng chỉ Lập và Quản lý dự án, Giám sát thi công dự án, Lập dự toán chi phí đầu tư ứng dụng CNTT,... theo Nghị định 102 của Chính phủ, Nghị định 73/2019/NĐ-CP ngày tháng năm 2019 của Chính phủ và Chứng chỉ bồi dưỡng nghiệm vụ đấu thầu, Chứng chỉ hành nghề đấu thầu theo Luật đấu thầu số 43 và Nghị định 63 của Chính phủ. CIC sẽ giúp quý khách hàng triển khai thành công các dự án CNTT và đảm bảo đúng các quy định của pháp luật.</span></span></p>

        <h2 style="margin: 0cm 0cm 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span style="color:#0000cc;"><strong><span>Những lĩnh vực hoạt động chính:</span></strong></span></span></span></h2>

        <p style="margin: 0cm 0cm 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">+ Tư vấn quản lý dự án;</span></span></p>
        <p style="margin: 0cm 0cm 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">+ Tư vấn đấu thầu;</span></span></p>
        <p style="margin: 0cm 0cm 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">+ Tư vấn lập dự án, đề cương, thiết kế chi tiết&nbsp;và dự toán cho các dự án CNTT khối cơ quan Nhà nước;</span></span></p>
        <p style="margin: 0cm 0cm 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">+ Tư vấn thẩm tra và tư vấn giám sát&nbsp; công tác triển khai dự án CNTT;</span></span></p>
        <p style="margin: 0cm 0cm 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">+ Tư vấn giải pháp về CNTT, viễn thông.</span></span></p>
        <p style="margin: 0cm 0cm 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">+ Tư vấn giải pháp về thiết bị giám sát, an ninh, bảo mật...</span></span></p>
        <p style="margin: 0cm 0cm 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">+ Tư vấn các giải pháp dịch vụ trực tuyến, giải pháp Portal…</span></span></p>
        <p style="margin: 0cm 0cm 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">+ Thi công, lắp đặt thiết CNTT, hệ thống mạng LAN, WAN…..</span></span></p>
        <p style="margin: 0cm 0cm 8pt; text-align: justify;">&nbsp;</p>

        <h2 style="margin: 0cm 0cm 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span style="color:#0000ff;"><b><span>1. Tư vấn quản lý dự án</span></b></span></span></span></h2>

        <p style="margin: 0cm 0cm 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">a. Quản lý tiến độ, quản lý chất lượng;</span></span></p>
        <p style="margin: 0cm 0cm 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">b.&nbsp;&nbsp;&nbsp; Quản lý chi phí;</span></span></p>
        <p style="margin: 0cm 0cm 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">c.&nbsp;&nbsp;&nbsp; Quản lý an toàn lao động và môi trường xây dựng;</span></span></p>
        <p style="margin: 0cm 0cm 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">d.&nbsp;&nbsp;&nbsp; Quản lý rủi ro;</span></span></p>
        <p style="margin: 0cm 0cm 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">e.&nbsp;&nbsp;&nbsp; Các nội dung quản lý khác.</span></span></p>
        <p style="margin: 0cm 0cm 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Chi tiết như sau:</span></span></p>
        <p style="margin: 0cm 0cm 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">•&nbsp;&nbsp;&nbsp; Đánh giá tình trạng hiện tại của việc thực hiện dự án và nắm rõ các quy trình thực hiện dự án để lập kế hoạch quản lý và kiểm soát dự án;</span></span></p>
        <p style="margin: 0cm 0cm 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">•&nbsp;&nbsp;&nbsp; Đánh giá các thay đổi liên quan đến thiết kế , thi công xây dựng, mua sắm vật tư, thiết bị, an toàn lao động , vệ sinh mối trường và phòng chống cháy, nổ, chạy thử nghiệm thu và bàn giao công trình, đào tạo vận hành: đề xuất cho Chủ đầu tư các biện pháp thích hợp để đảm bảo các thay đổi trên không ảnh hưởng đến an toàn, chất lượng và tiến độ thực hiện dự án;</span></span></p>
        <p style="margin: 0cm 0cm 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">•&nbsp;&nbsp;&nbsp; Lập hồ sơ mời thầu, tư vấn lựa chọn nhà thầu;</span></span></p>
        <p style="margin: 0cm 0cm 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">•&nbsp;&nbsp;&nbsp; Kiểm tra, điều hành tiến độ và chất lượng thực hiện hợp đồng của các nhà thầu theo đúng hợp đồng đã ký;</span></span></p>
        <p style="margin: 0cm 0cm 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">•&nbsp;&nbsp;&nbsp; Xem xét, kiểm tra các tài liệu của các nhà thầu, các nhà tư vấn khác theo hợp đồng đã ký kết với Chủ đầu tư;</span></span></p>
        <p style="margin: 0cm 0cm 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">•&nbsp;&nbsp;&nbsp; Giám sát và điều hành các nhà thầu thực hiện tiến độ do các nhà thầu khác lập và hiệu chỉnh, lập lại tiến độ thực hiện dự án (nếu cần thiết) phù hợp với tổng tiến độ và các mốc quan trọng đã được duyệt;</span></span></p>
        <p style="margin: 0cm 0cm 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">•&nbsp;&nbsp;&nbsp; Theo dõi, đánh giá và báo cáo mức độ hoàn thành tiến độ của các nhà thầu. Xử lý khi có chậm trễ và có biện pháp xác thực nhằm hoàn thành đúng tiến độ đã cam kết với Chủ đầu tư;</span></span></p>
        <p style="margin: 0cm 0cm 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">•&nbsp;&nbsp;&nbsp; Giám sát và điều hành các nhà thầu thực hiện các công việc phù hợp với các mốc và các khoảng thời gian quan trọng của dự án;</span></span></p>
        <p style="margin: 0cm 0cm 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">•&nbsp;&nbsp;&nbsp; Xem xét, kiểm tra biện pháp tổ chức thi công, kế hoạch chất lượng của nhà thầu;</span></span></p>
        <p style="margin: 0cm 0cm 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">•&nbsp;&nbsp;&nbsp; Quản lý rủi ro liên quan đến dự án;</span></span></p>
        <p style="margin: 0cm 0cm 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">•&nbsp;&nbsp;&nbsp; Lập, kiểm tra, điều hành kế hoạch và các điều kiện để tiến hành thí nghiệm, kiểm định, chạy thử, nghiệm thu cho phù hợp với tổng tiến độ;</span></span></p>
        <p style="margin: 0cm 0cm 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">•&nbsp;&nbsp;&nbsp; Kiểm tra, giám sát, đôn đốc việc lập và thực hiện các biện pháp nhằm bảo đảm công tác an toàn lao động, vệ sinh môi trường và phòng chống cháy, nổ của các nhà thầu;</span></span></p>
        <p style="margin: 0cm 0cm 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">•&nbsp;&nbsp;&nbsp; Thông báo cho các Chủ đầu tư về tính đầy đủ của các công việc trước khi tiến hành nghiệm thu;</span></span></p>
        <p style="margin: 0cm 0cm 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">•&nbsp;&nbsp;&nbsp; Kiểm tra kế hoạch, điều hành quá trình đào tạo của các nhà thầu đào tạo, hướng dẫn vận hành và chuyển giao công nghệ của các nhà thầu;</span></span></p>
        <p style="margin: 0cm 0cm 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">•&nbsp;&nbsp;&nbsp; Và những công việc liên quan khác…</span></span></p>
        <p style="margin: 0cm 0cm 8pt; text-align: justify;">&nbsp;</p>

        <h2 style="margin: 0cm 0cm 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span style="color:#0000ff;"><b><span>2. Tư vấn đấu thầu</span></b></span></span></span></h2>

        <p style="margin: 0cm 0cm 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Cung cấp dịch vụ lập hồ sơ mời thầu, hồ sơ yêu cầu các gói thầu mua sắm hàng hóa, gói thầu xây lắp, gói thầu tư vấn…..</span></span></p>
        <p style="margin: 0cm 0cm 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">+ Tư vấn quá trình mời thầu, tổ chức đấu thầu và xử lý những vấn đề phát sinh trong đấu thầu;</span></span></p>
        <p style="margin: 0cm 0cm 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">+ Tư vấn về việc lập và hoàn thiện thủ tục pháp lý trong quá trình đấu thầu;</span></span></p>
        <p style="margin: 0cm 0cm 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">+ Cam kết hồ sơ yêu cầu/ hồ sơ mời thầu đáp ứng yêu cầu về mặt kỹ thuật, yêu cầu về mặt tài chính, thương mại theo yêu cầu của tổng gói thầu, tổng dự án;</span></span></p>
        <p style="margin: 0cm 0cm 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">+ Phân tích, đánh giá hồ sơ dự thầu, lựa chọn nhà thầu đáp ứng yêu cầu của hồ sơ mời thầu, hồ sơ yêu cầu.</span></span></p>
        <p style="margin: 0cm 0cm 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">+ Tư vấn thương thảo hợp đồng, hoàn thiện hợp đồng trên cơ sở kết quả lựa chọn nhà thầu được duyệt.</span></span></p>
        <p style="margin: 0cm 0cm 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">+ Tất cả các tài liệu và thông tin liên quan đều được bảo mật theo quy định.</span></span></p>
        <p style="margin: 0cm 0cm 8pt; text-align: justify;">&nbsp;</p>

        <h2 style="margin: 0cm 0cm 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span style="color:#0000ff;"><b><span>3. Tư vấn lập dự án, thiết kế chi tiết và dự toán </span></b></span></span></span></h2>

        <p style="margin: 0cm 0cm 8pt; text-align: justify;">&nbsp;</p>

        <h2 style="margin: 0cm 0cm 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span style="color:#0000ff;"><b><span>4. Tư vấn thẩm tra, tư vấn giám sát công tác triển khai&nbsp;dự án CNTT</span></b></span></span></span></h2>

        <p style="margin: 0cm 0cm 8pt; text-align: justify;">&nbsp;</p>

        <h2 style="margin: 0cm 0cm 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span style="color:#0000ff;"><b><span>5. Tư vấn giải pháp, cung cấp các giải pháp CNTT </span></b></span></span></span></h2>

        <p style="margin: 0cm 0cm 8pt; text-align: justify;">&nbsp;</p>

        <h2 style="margin: 0cm 0cm 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span style="color:#0000ff;"><b><span>6. Cung cấp, lắp đặt thiết bị CNTT, thi công hệ thống mạng LAN, WAN…</span></b></span></span></span></h2>
      </div>
    `
  },
  {
    id: "tu-van-xay-dung",
    title: "Tư vấn xây dựng",
    tagline: "Tư vấn thiết kế, thẩm tra, kiểm định chất lượng công trình xây dựng",
    shortDesc: "Công ty Cổ phần Công nghệ và Tư vấn CIC triển khai dịch vụ tư vấn & thiết kế xây dựng dân dụng, công nghiệp, thiết kế quy hoạch, lập & thẩm định dự án đầu tư và cung cấp thiết bị CNTT-TT.",
    category: "Tư vấn xây dựng",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80",
    relatedProductIds: [14, 4, 6, 10],
    htmlContent: `
      <div className="service-cms-body">
        <div className="title_head margin-top-20 margin-bottom-20">
          <p className="title_center_page" style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Công ty Cổ phần Công nghệ và Tư vấn CIC triển khai một số dịch vụ tư vấn xây dựng như sau:</span></span></p>

          <p className="title_center_page" style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">1.&nbsp;Tư vấn &amp; Thiết kế xây dựng dân dụng và công nghiệp</span></span></p>

          <p className="title_center_page" style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">2.&nbsp;Thiết kế quy hoạch&nbsp;</span></span></p>

          <p className="title_center_page" style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">3. Lập và thẩm định đầu tư các dự án</span></span></p>

          <p className="title_center_page" style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">4.&nbsp;Tư vấn đấu thầu, tư vấn CNTT-TT</span></span></p>

          <p className="title_center_page" style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">5.&nbsp;Thiết kế mạng, cung cấp thiết bị CNTT-TT</span></span></p>
        </div>
      </div>
    `
  },
  {
    id: "ho-so-nang-luc-trung-tam-bim",
    title: "Hồ sơ năng lực Trung tâm BIM",
    tagline: "Trung tâm BIM & Digital Twins - Đơn vị tiên phong chuyển đổi số ngành xây dựng Việt Nam",
    shortDesc: "Hồ sơ năng lực Trung tâm BIM & Digital Twins - Công ty CIC: Giới thiệu giải pháp công nghệ quản lý thông tin xây dựng, nâng cao năng suất, đảm bảo chất lượng công trình và tối ưu hóa đầu tư.",
    category: "Hồ sơ năng lực",
    image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80",
    relatedProductIds: [1, 3, 5, 8],
    htmlContent: `
      <div className="service-cms-body">
        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><a href="https://www.cic.com.vn/tu-van-bim-s5.html" target="_blank" rel="noopener noreferrer"><strong>BIM</strong></a> là công nghệ quản lý thông tin xây dựng cung cấp mô hình 3D chi tiết và dữ liệu tích hợp, giúp cải thiện hiệu quả thiết kế và giảm chi phí. Ở các quốc gia phát triển như Mỹ và Anh, BIM đã trở thành tiêu chuẩn ngành, hỗ trợ từ thiết kế đến bảo trì công trình. Tại Việt Nam, BIM đang dần được áp dụng trong các dự án lớn và công ty xây dựng, nhưng vẫn gặp thách thức về đào tạo và cơ sở hạ tầng. Mặc dù còn mới mẻ, BIM đang mở ra cơ hội nâng cao chất lượng và quản lý dự án trong ngành xây dựng Việt Nam.</span></span></p>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Việc ứng dụng <strong>BIM</strong> hiện nay không chỉ là một xu hướng mà còn là yếu tố then chốt giúp nâng cao năng suất, đảm bảo chất lượng công trình và tối ưu hóa đầu tư xây dựng. Với kinh nghiệm phong phú và chuyên môn sâu rộng, CIC tự hào cung cấp các dịch vụ BIM toàn diện, đáp ứng tốt nhất mọi nhu cầu của doanh nghiệp. Hướng tới mục tiêu trở thành nhà cung cấp giải pháp công nghệ thông tin và khoa học công nghệ hàng đầu, CIC không ngừng nỗ lực mở rộng và nâng cao chất lượng sản phẩm, dịch vụ để phục vụ khách hàng trong và ngoài nước một cách tốt nhất.</span></span></p>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">CIC cung cấp dịch vụ tư vấn BIM chuyên sâu dành cho chủ đầu tư, giúp kiểm soát chất lượng, tiến độ và chi phí dự án một cách chặt chẽ và hiệu quả.Với dịch vụ tư vấn BIM, chủ đầu tư sẽ được:</span></span></p>

        <ul>
          <li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Đào tạo kiến thức tổng quan về BIM, giúp hiểu rõ các công cụ kiểm soát chất lượng mô hình BIM của đơn vị tư vấn thiết kế và nhà thầu.</span></span></li>
          <li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Thiết lập tiêu chuẩn BIM (EIR), khảo sát quy trình hoạt động của doanh nghiệp và xây dựng bộ tiêu chuẩn phù hợp với quy định tại Việt Nam, đảm bảo chất lượng BIM từ các đơn vị tham gia dự án.</span></span></li>
          <li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Hỗ trợ trong quá trình đấu thầu, đánh giá kế hoạch thực hiện BIM (BEP) của các nhà thầu, giúp chủ đầu tư lựa chọn đơn vị phù hợp.&nbsp;</span></span></li>
          <li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Thẩm tra chất lượng của mô hình BIM</span></span></li>
          <li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Tư vấn triển khai Môi trường Dữ liệu Chung (CDE), giúp quản lý và kiểm soát toàn bộ quy trình BIM một cách minh bạch và hiệu quả.</span></span></li>
          <li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Tạo lập mô hình BIM 3D để phục vụ thẩm định theo các yêu cầu của Nhà nước.</span></span></li>
          <li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Ứng dụng các giải pháp BIM tiên tiến như BIM 4D (mô phỏng tiến độ thi công), BIM 5D (quản lý chi phí) và BIM 6D (quản lý vận hành), giúp chủ đầu tư kiểm soát toàn diện dự án.</span></span></li>
          <li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Xây dựng mô hình số song sinh (Digital Twins), hỗ trợ giám sát, quản lý và bảo trì công trình sau khi đưa vào vận hành</span></span></li>
        </ul>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Dưới đây là hồ sơ năng lực giới thiệu về hồ sơ năng lực Trung tâm BIM <a href="https://www.cic.com.vn/flipbooks/index.html?pdf=bim.pdf" target="_blank" rel="noopener noreferrer">tại đây</a></span></span></p>
      </div>
    `
  },
  {
    id: "tu-van-kiem-ke-khi-nha-kinh",
    title: "Tư vấn Kiểm kê Khí nhà kính",
    tagline: "Giải pháp toàn diện kiểm kê khí nhà kính, xây dựng báo cáo phát thải và lộ trình Net Zero",
    shortDesc: "Tư vấn kiểm kê khí nhà kính là giải pháp toàn diện giúp doanh nghiệp đo lường chính xác phát thải (Scope 1, 2, 3), lập báo cáo hợp lệ, đáp ứng quy định Nghị định 06/2022/NĐ-CP và hướng tới Net Zero.",
    category: "Năng lượng & Môi trường",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2070&auto=format&fit=crop",
    relatedProductIds: [2, 4, 8],
    htmlContent: `
      <div className="service-cms-body">
        <h2 style="text-align: justify;"><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Tư Vấn Kiểm Kê Khí Nhà Kính – Giải Pháp Toàn Diện Giúp Doanh Nghiệp Phát Triển Bền Vững</span></span></strong></h2>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Kiểm Kê Khí Nhà Kính chính là bước đi quan trọng cho các doanh nghiệp hướng tới phát triển bền vững, trách nhiệm xã hội, nâng cao năng lực cạnh tranh, minh bạch hóa thông tin.&nbsp;</span></span><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Trong bối cảnh toàn cầu đang hướng mạnh mẽ đến mục tiêu <strong>phát thải ròng bằng 0 (<a href="https://netzero2050.vn/" target="_blank" rel="noopener noreferrer">Net Zero</a>)</strong>, kiểm kê khí nhà kính đã trở thành yêu cầu bắt buộc tại nhiều quốc gia và thị trường. Không chỉ là nghĩa vụ pháp lý, đây còn là cơ hội để doanh nghiệp:</span></span></p>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">•&nbsp;&nbsp; &nbsp;Gia tăng tính minh bạch<br />
        •&nbsp;&nbsp; &nbsp;Nâng cao năng lực cạnh tranh quốc tế<br />
        •&nbsp;&nbsp; &nbsp;Thu hút nhà đầu tư có tiêu chí ESG<br />
        •&nbsp;&nbsp; &nbsp;Tham gia vào các chương trình, chứng chỉ phát triển bền vững</span></span></p>

        <h2 style="text-align: justify;"><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Dịch Vụ Tư Vấn Kiểm Kê Khí Nhà Kính Là Gì?</span></span></strong></h2>

        <p style="text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><img alt="Dịch vụ kiểm kê khí nhà kính CIC" src="https://www.cic.com.vn/upload_images/images/2025/KNK/cic-dich-vu-kiem-ke-khi-nha-kinh.jpg" style="width: 650px; max-width: 100%; height: auto;" /></span></span></p>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Dịch vụ tư vấn kiểm kê khí nhà kính là giải pháp giúp các doanh nghiệp các nhiệm vụ sau:</span></span></p>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">•&nbsp;&nbsp; &nbsp;Xác định và đo lường chính xác lượng khí nhà kính phát thải.<br />
        •&nbsp;&nbsp; &nbsp;Thu thập dữ liệu theo phương pháp chuẩn quốc tế (GHG Protocol, IPCC).<br />
        •&nbsp;&nbsp; &nbsp;Xây dựng báo cáo kiểm kê hợp lệ, dễ trình bày với cơ quan quản lý, khách hàng, đối tác.<br />
        •&nbsp;&nbsp; &nbsp;Tư vấn phương án giảm phát thải thực tế &amp; hiệu quả.</span></span></p>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Tất cả quá trình trên&nbsp;đều do đội ngũ chuyên gia môi trường giàu kinh nghiệm thực hiện, đảm bảo độ chính xác, tính pháp lý và uy tín cao cho doanh nghiệp thực hiện báo cáo kiểm kê khí nhà kính.</span></span></p>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Với hơn 35&nbsp;năm hình thành và phát triển,</span></span> <span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Công ty cổ phần Công nghệ và tư vấn&nbsp;CIC (trực thuộc Bộ Xây dựng) đã và đang hợp tác với nhiều hãng công nghệ hàng đầu về giải pháp KNK với nhiều chuyên gia uy tín,&nbsp;đã có nhiều năm&nbsp;kinh nghiệm.&nbsp;Từ biến đổi khí hậu đến mục tiêu giảm phát thải carbon để Việt Nam đạt Net Zero (phát thải ròng bằng 0) vào năm 2050, Công ty CIC đồng hành cùng các doanh nghiệp Việt, cung cấp trọn bộ các giải pháp hiệu quả và tối ưu nhất.&nbsp;</span></span></p>

        <h2 style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Những doanh nghiệp nào nên thực hiện kiểm kê khí nhà kính?</strong></span></span></h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div>
            <ul className="list-disc pl-5 space-y-2">
              <li style="margin: 0in 0in 8pt;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Doanh nghiệp có quy mô lớn, nhiều nhà máy, chuỗi cung ứng phức tạp</span></span></li>
              <li style="margin: 0in 0in 8pt;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Doanh nghiệp xuất khẩu sang EU, Mỹ, Nhật Bản…</span></span></li>
              <li style="margin: 0in 0in 8pt;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Doanh nghiệp tham gia chương trình phát triển bền vững, ESG</span></span></li>
              <li style="margin: 0in 0in 8pt;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Doanh nghiệp muốn nâng cao hình ảnh thương hiệu “Xanh”</span></span></li>
              <li style="margin: 0in 0in 8pt;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Tổ chức đang xây dựng kế hoạch trung hòa phát thải</span></span></li>
            </ul>
          </div>

          <div className="flex justify-center items-center">
            <img alt="Khí nhà kính" src="https://www.cic.com.vn/upload_images/images/2023/cic-khi-nha-kinh.jpg" style="width: 275px; max-width: 100%; height: auto;" />
          </div>
        </div>

        <p style="text-align: justify;">&nbsp;</p>

        <h2 style="text-align: justify;"><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Quy Trình Tư Vấn Kiểm Kê Khí Nhà Kính Tại Công ty cổ phần Công nghệ và Tư vấn CIC</span></span></strong></h2>

        <p style="text-align: center;"><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><img alt="Quy trình kiểm kê" src="https://www.cic.com.vn/upload_images/images/2025/KNK/cic-dich-vu-kiem-ke-khi-nha-kinh1.jpg" style="width: 650px; max-width: 100%; height: auto;" /></span></span></strong></p>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">1.&nbsp;&nbsp; &nbsp;Tiếp nhận thông tin &amp; đánh giá sơ bộ</span></span></p>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">2.&nbsp;&nbsp; &nbsp;Xác định phạm vi và nguồn phát thải (Scope 1, 2, 3)</span></span></p>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">3.&nbsp;&nbsp; &nbsp;Hướng dẫn thu thập dữ liệu hoạt động</span></span></p>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">4.&nbsp;&nbsp; &nbsp;Tính toán và lập báo cáo phát thải chi tiết</span></span></p>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">5.&nbsp;&nbsp; &nbsp;Tư vấn giải pháp giảm phát thải hiệu quả &amp; đào tạo nội bộ nếu cần</span></span></p>

        <h2 style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Tại sao phải kiểm kê khí nhà kính?</strong></span></span></h2>

        <h3 style="text-align: justify;"><em><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">1. Căn cứ pháp lý</span></span></em></h3>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">– Luật Bảo vệ môi trường 72/2020/QH14 ngày 17 tháng 11 năm 2020 do Quốc hội ban hành có hiệu lực từ ngày 01/01/2022</span></span></p>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">– Nghị định số 06/2022/NĐ-CP ngày 07 tháng 01 năm 2022 của Chính phủ về việc Quy định giảm nhẹ phát thải KNK và bảo vệ tầng Ozon có hiệu lực từ ngày 07/01/2022;</span></span></p>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">– Thông tư số 01/2022/TT-BTNMT ngày 07/01//2022 của Bộ Tài nguyên &amp; Môi trường Quy định chi tiết thi hành Luật Bảo vệ Môi trường về ứng phó Biến đổi khí hậu có hiệu lực từ ngày 07/01/2022</span></span></p>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">– Quyết định số 01/2022/QĐ-TTg của Thủ tướng Chính Phủ ngày 18 tháng 01 năm 2022 ban hành danh mục lĩnh vực, cơ sở phát thải KNK phải thực hiện kiểm kê KNK, trong đó liệt kê 1912 doanh nghiệp thuộc diện phải thực hiện kiểm kê khí nhà kính có hiệu lực từ ngày 18/01/2022.</span></span></p>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Dự kiến danh sách này sẽ còn tiếp tục tăng khi các địa phương, bộ ban ngành thực hiện rà soát và bổ sung để đảm bảo tiến trình tiến tới Net Zero vào năm 2050 theo cam kết của Chính phủ tại COP 26.&nbsp;</span></span></p>

        <p><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Theo Nghị định 06/2022/NĐ-CP, có sáu lĩnh vực phải thực hiện kiểm kê khí nhà kính gồm: năng lượng, giao thông vận tải, xây dựng, các quá trình công nghiệp, nông- lâm nghiệp và sử dụng đất, chất thải. Đó là:</span></span></p>

        <p><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Các cơ sở phát thải khí nhà kính phải thực hiện kiểm kê khí nhà kính là cơ sở có mức phát thải khí nhà kính hằng năm từ 3.000 tấn CO2 tương đương trở lên hoặc thuộc một trong các trường hợp sau:</span></span></p>

        <p><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">a) Nhà máy nhiệt điện, cơ sở sản xuất công nghiệp có tổng lượng tiêu thụ năng lượng hằng năm từ 1.000 tấn dầu tương đương (TOE) trở lên;</span></span></p>

        <p><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">b) Công ty kinh doanh vận tải hàng hóa có tổng tiêu thụ nhiên liệu hằng năm từ 1.000 TOE trở lên;</span></span></p>

        <p><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">c) Tòa nhà thương mại có tổng tiêu thụ năng lượng hằng năm từ 1.000 TOE trở lên;</span></span></p>

        <p><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">d) Cơ sở xử lý chất thải rắn có công suất hoạt động hằng năm từ 65.000 tấn trở lên.</span></span></p>

        <p><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span>Danh sách các cơ sở phải thực hiện kiểm kê khí nhà kính các bạn có thể xem&nbsp;tại Phụ lục II-III-IV-V theo Quyết định 01/2022/QĐ-TTg </span><a href="https://thuvienphapluat.vn/van-ban/Tai-nguyen-Moi-truong/Quyet-dinh-01-2022-QD-TTg-co-so-phat-thai-khi-nha-kinh-phai-thuc-hien-kiem-ke-khi-nha-kinh-501161.aspx" target="_blank" rel="noopener noreferrer">tại đây</a></span></span></p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div>
            <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Hiện nay, một số thị trường khó tính như Châu Âu cũng đã bắt đầu đưa ra những cơ chế CBAM (thuế carbon) đối với 6 nhóm sản phẩm xuất khẩu vào thị trường này (gồm Xi măng, Sắt thép, Phân bón, Hidro, Nhôm và điện). Các nhà xuất khẩu cần cung cấp hồ sơ liên quan đến việc kiểm kê phát thải khí nhà kính trong quá trình sản xuất để được cấp phép xuất hàng vào EU. Nếu mức phát thải vượt ngưỡng cho phép, sản phẩm sẽ bị đánh thuế carbon hoặc hàng hoá sẽ bị từ chối nếu không đủ hồ sơ CBAM. (Chi tiết về CBAM các bạn xem<a href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=uriserv%3AOJ.L_.2023.130.01.0052.01.ENG&amp;toc=OJ%3AL%3A2023%3A130%3ATOC" target="_blank" rel="noopener noreferrer"> tại đây</a>)</span></span></p>
          </div>

          <div className="flex flex-col items-center justify-center">
            <img alt="Lộ trình CBAM" src="https://www.cic.com.vn/upload_images/images/2023/CIC-danh-gia-vong-doi-san-pham1.png" style="width: 650px; max-width: 100%; height: auto;" />
            <p style="text-align: center;"><em><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">Lộ trình thực hiện CBAM</span></span></em></p>
          </div>
        </div>

        <p style="text-align: justify;">&nbsp;</p>

        <p style="text-align: justify;"><em><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">2. Lợi ích khi kiểm kê khí nhà kính</span></span></em></p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="flex justify-center items-center">
            <img alt="Điều chỉnh carbon" src="https://www.cic.com.vn/upload_images/images/2023/dieu-chinh-carbon-cic.jpg" style="width: 350px; max-width: 100%; height: auto;" />
          </div>

          <div>
            <ul className="list-disc pl-5 space-y-2">
              <li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Hoàn thành nghĩa vụ với cơ quan quản lý nhà nước về quản lý môi trường;&nbsp;</span></span></li>
              <li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Chủ động nắm bắt được tình hình phát thải của doanh nghiệp;&nbsp;</span></span></li>
              <li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Chủ động xây dựng kế hoạch, lộ trình giảm phát thải trong tương lai, hạn chế rủi ro liên quan đến việc phát thải khí nhà kính vượt tiêu chuẩn;&nbsp;</span></span></li>
              <li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Tạo lợi thế cạnh tranh cho sản phẩm liên quan tới biến đổi khí hậu, bảo vệ môi trường;&nbsp;</span></span></li>
              <li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Nâng cao hình ảnh và vị thế của doanh nghiệp.</span></span></li>
            </ul>

            <p style="text-align: justify; margin-top: 1rem;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Tại Hội nghị (COP26), Việt Nam đã cam kết đạt mức phát thải ròng bằng 0&nbsp; hay còn gọi là Net Zero vào năm 2050.</span></span></p>
          </div>
        </div>

        <p>&nbsp;</p>

        <h2 style="text-align: justify;"><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Các bước kiểm kê khí nhà kính</span></span></strong></h2>

        <p style="text-align: center;"><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><img alt="Các bước kiểm kê" src="https://www.cic.com.vn/upload_images/images/2023/CIC-kiem-ke-khi-nha-kinh.png" style="width: 800px; max-width: 100%; height: auto;" /></span></span></strong></p>

        <h2 style="text-align: justify;"><strong><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">Quy định giảm nhẹ phát thải khí nhà kính và bảo vệ tầng ô zôn</span></span></strong></h2>

        <p style="text-align: justify;"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">Nghị định số 06/2022/NĐ-CP của Chính phủ: Quy định giảm nhẹ phát thải khí nhà kính và bảo vệ tầng ô-dôn. Dưới đây là các mốc thời gian mà doanh nghiệp cần theo dõi và thực hiện các hoạt động liên quan Kiểm kê khí nhà kính quy định trong Nghị định 06/2022/NĐ-CP</span></span></p>

        <ul className="list-disc pl-5 space-y-1">
          <li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Trước 31/12/2022, Đơn đăng ký sử dụng các chất được kiểm soát</span></span></li>
          <li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Trước ngày 15/1/2023, báo cáo tình hình sử dụng các chất được kiểm soát</span></span></li>
          <li style="text-align: justify;"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">Trước ngày 31/3/2023, cung cấp số liệu hoạt động thông tin liên quan phục vụ&nbsp;KNK</span></span></li>
          <li style="text-align: justify;"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">Từ ngày 1/1/2024, thu gom các chất được kiểm soát khi không còn sử dụng hoặc tiêu hủy</span></span></li>
          <li style="text-align: justify;"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">Ngày 15/1/2024, Báo cáo tình hình sử dụng các chất được kiểm soát</span></span></li>
          <li style="text-align: justify;"><span style="font-size: 18px; font-family: Times New Roman, Times, serif;">Trước 31/3/2025, thực hiện kiểm kê KNK cấp cơ sở cho năm 2024</span></li>
          <li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Trước 1/12/2025, Hoàn thiện báo cáo kết quả kiểm kê KNK, trước kỳ báo cáo xây dựng báo cáo giảm nhẹ phát thải KNK</span></span></li>
          <li style="text-align: justify;"><span style="font-size: 18px; font-family: Times New Roman, Times, serif;">Trước ngày 31/12/2025, Xây dựng, phê duyệt kế hoạch giảm nhẹ phát thải KNK 2026-2030</span></li>
        </ul>

        <p className="my-2"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">Thông tin chi tiết xem&nbsp;<a href="https://datafiles.chinhphu.vn/cpp/files/vbpq/2022/01/06-nd.signed.pdf" target="_blank" rel="noopener noreferrer">tại đây</a></span></span></p>

        <h2><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;"><strong>Dịch vụ kiểm kê phát thải khí nhà kính của CIC&nbsp;</strong></span></span></h2>

        <h3><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;"><em>1. Dịch vụ tư vấn kiểm kê phát thải khí nhà kính cho toàn công ty</em></span></span></h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div>
            <p style="text-align: justify;"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">Dịch vụ lập báo cáo kiểm kê khí nhà kính trên phạm vi toàn công ty (đối với cả 3 phạm vi Scope 1,2,3) tuân thủ Tiêu chuẩn ISO 14064 và theo Nghị định 06/2022/NĐ-CP ngày 07 tháng 01 năm 2022 của Chính phủ về việc Quy định giảm nhẹ phát thải KNK và bảo vệ tầng Ozon;</span></span></p>
          </div>
          <div className="flex justify-center items-center">
            <img alt="Dịch vụ kiểm kê KNK" src="https://www.cic.com.vn/upload_images/images/dich-vu-tu-van-khi-nha-kinh6.png" style="width: 275px; max-width: 100%; height: auto;" />
          </div>
        </div>

        <h3><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;"><em><span>2. Dịch vụ&nbsp;tư vấn LCA (Life Cycle Assessment – Đánh giá vòng đời sản phẩm)</span></em></span></span></h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="flex justify-center items-center">
            <img alt="Tư vấn LCA" src="https://www.cic.com.vn/upload_images/images/2023/dich-vu-tu-van-khi-nha-kinh1.png.jpg" style="width: 400px; max-width: 100%; height: auto;" />
          </div>
          <div>
            <p style="text-align: justify;"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;"><span>LCA là báo cáo kỹ thuật phân tích và đánh giá các tác động toàn diện đến môi trường trong toàn bộ vòng đời một sản phẩm hay dịch vụ từ khâu khai thác nguyên liệu thô đến khi sản xuất, sử dụng và tái chế hoặc bị thải bỏ (nghĩa là: từ lúc mới sinh ra cho đến hết đời). Tiêu chuẩn thực hiện: Theo tiêu chuẩn ISO 14040 /ISO 14044. Quy trình&nbsp;đánh giá vòng đời sản phẩm - LCA, các bạn có thể tham khảo <a href="https://www.cic.com.vn/phuong-phap-danh-gia-vong-doi-san-pham-lca-n962.html" target="_blank" rel="noopener noreferrer">tại&nbsp;đây</a>, theo đó có 4 bước quan trọng để đánh giá LCA.&nbsp;</span></span></span></p>
          </div>
        </div>

        <p style="margin: 0in 0in 8pt;"><span style="font-size: 18px; font-family: Times New Roman, Times, serif;">Tại sao phải Đánh giá vòng đời sản phẩm&nbsp; - LCA, mời các bạn đọc thông tin <a href="https://www.cic.com.vn/tai-sao-can-phan-tich-danh-gia-vong-doi-san-pham-n979.html" target="_blank" rel="noopener noreferrer">tại đây</a>&nbsp;</span></p>

        <h3 style="margin: 0in 0in 8pt;"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;"><em><span>3. Dịch vụ tư vấn EPD (Environmental Product Declaration – Tuyên bố sản phẩm môi trường)</span></em></span></span></h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div>
            <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">EPD (Environmental Product Declaration - Tuyên bố sản phẩm&nbsp;môi trường) là hồ sơ công bố minh bạch&nbsp;thông tin về các&nbsp;tác động của sản phẩm đến&nbsp;môi trường dựa trên kết quả đánh giá vòng đời sản phẩm (LCA). Tiêu chuẩn thực hiện: ISO 14025 và EN 15804 PCR.</span></span></p>
          </div>
          <div className="flex justify-center items-center">
            <img alt="Tư vấn EPD" src="https://www.cic.com.vn/upload_images/images/2023/cic-epd.jpg" style="width: 400px; max-width: 100%; height: auto;" />
          </div>
        </div>

        <h2 style="margin: 0in 0in 8pt; text-align: justify;"><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Lợi Ích Khi Sử Dụng Dịch Vụ Tư Vấn Kiểm Kê Khí Nhà Kính</span></span></strong></h2>

        <p style="margin: 0in 0in 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">•&nbsp;&nbsp; &nbsp;Tuân thủ quy định pháp luật về môi trường<br />
        •&nbsp;&nbsp; &nbsp;Nâng cao năng lực cạnh tranh khi xuất khẩu<br />
        •&nbsp;&nbsp; &nbsp;Xây dựng thương hiệu doanh nghiệp xanh, minh bạch<br />
        •&nbsp;&nbsp; &nbsp;Cơ sở để đăng ký tín chỉ carbon, tham gia các cơ chế tài chính xanh<br />
        •&nbsp;&nbsp; &nbsp;Hỗ trợ ra quyết định trong chuyển đổi mô hình phát triển bền vững</span></span></p>

        <h2 style="margin: 0in 0in 8pt; text-align: justify;"><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Vì Sao Nên Chọn Công Ty Cổ Phần Công Nghệ &amp; Tư Vấn CIC?</span></span></strong></h2>

        <p style="margin: 0in 0in 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">1.&nbsp;&nbsp; &nbsp;Đội ngũ chuyên gia môi trường nhiều năm kinh nghiệm<br />
        2.&nbsp;&nbsp; &nbsp;Quy trình kiểm kê bài bản, minh bạch, đạt chuẩn quốc tế<br />
        3.&nbsp;&nbsp; &nbsp;Cam kết đồng hành lâu dài và tận tâm với doanh nghiệp<br />
        4.&nbsp;&nbsp; &nbsp;Dịch vụ trọn gói – không phát sinh chi phí ngoài hợp đồng<br />
        5.&nbsp;&nbsp; &nbsp;Tối ưu hóa dữ liệu đầu vào – tiết kiệm thời gian doanh nghiệp<br />
        6.&nbsp;&nbsp; &nbsp;Báo cáo chuẩn chỉnh, dễ sử dụng trong hồ sơ công bố ESG<br />
        7.&nbsp;&nbsp; &nbsp;Tư vấn cả giải pháp giảm phát thải và kế hoạch hành động<br />
        8.&nbsp;&nbsp; &nbsp;Hỗ trợ đào tạo &amp; nâng cao năng lực nội bộ cho doanh nghiệp<br />
        9.&nbsp;&nbsp; &nbsp;Linh hoạt, phù hợp mọi ngành nghề &amp; quy mô doanh nghiệp<br />
        10.&nbsp;&nbsp; &nbsp;Uy tín – trách nhiệm – dẫn đầu xu hướng xanh hóa doanh nghiệp</span></span></p>

        <p style="margin: 0in 0in 8pt; text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><img alt="Tư vấn kiểm kê KNK CIC" src="https://www.cic.com.vn/upload_images/images/2025/KNK/CIC-kiem-ke-khi-nha-kinh-xi-mang-bim-son4.png" style="width: 650px; max-width: 100%; height: auto;" /></span></span></p>

        <p style="margin: 0in 0in 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Hiện nay, Chúng tôi cũng đã mở chuyên trang riêng dành cho mảng tư vấn phát triển bền vững, tại địa chỉ&nbsp;<a href="https://netzero2050.vn/" target="_blank" rel="noopener noreferrer">https://netzero2050.vn/&nbsp;</a>, mời quý khách hàng theo dõi và cập nhật thông tin.</span></span></p>

        <h2 style="margin: 0in 0in 8pt; text-align: justify;"><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">CÁC DỰ ÁN ĐÃ THỰC HIỆN CỦA CIC</span></span></strong></h2>

        <ul className="list-disc pl-5 space-y-1 my-2">
          <li style="margin: 0in 0in 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Tư vấn kiểm kê khí nhà kính cấp cơ sở cho Nhà máy điện Diesel Phú Qúy – Điện lực Bình Thuận</span></span></li>
          <li style="margin: 0in 0in 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Tư vấn kiểm kê khí nhà kính cấp cơ sở cho Công ty CP Gang Thép Thái Nguyên (TISCO)</span></span></li>
          <li style="margin: 0in 0in 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Triển khai dịch vụ tư vấn kiểm kê khí nhà kính cấp cơ sở cho Công ty Xi măng VICEM Hoàng Thạch</span></span></li>
          <li style="margin: 0in 0in 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Triển khai dịch vụ tư vấn kiểm kê khí nhà kính cấp cơ sở cho Công ty Xi măng Bỉm Sơn</span></span></li>
          <li style="margin: 0in 0in 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Cung cấp dịch vụ tư vấn kiểm kê khí nhà kính cấp cơ sở cho Xi măng Cẩm Phả</span></span></li>
          <li style="margin: 0in 0in 8pt; text-align: justify;"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">Công ty CP Thép Việt Ý – Thẩm định báo cáo Kiểm kê KNK cấp cơ sở</span></span></li>
          <li style="margin: 0in 0in 8pt; text-align: justify;"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">Kiểm kê khí nhà kính cấp cơ sở cho Nhà máy Xi măng Thăng Long</span></span></li>
          <li style="margin: 0in 0in 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Tư vấn lập báo cáo kiểm kê khí nhà kính cấp cơ sở năm 2024 cho Nhà máy thép Kyoei</span></span></li>
          <li style="margin: 0in 0in 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Kiểm kê khí nhà kính cấp cơ sở cho Xi măng VICEM Hạ Long</span></span></li>
          <li style="margin: 0in 0in 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Kiểm kê khí nhà kính cho Nhà máy xi măng VICEM Bút Sơn</span></span></li>
          <li style="margin: 0in 0in 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Kiểm kê khí nhà kính cho Xi măng Tân Thắng</span></span></li>
          <li style="margin: 0in 0in 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Tư vấn LCA và EPD cho Xi măng Chinfon</span></span></li>
          <li style="margin: 0in 0in 8pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Tư vấn LCA- EPD cho Công ty sản xuất gạch SECOIN</span></span></li>
        </ul>

        <p style="margin: 0in 0in 8pt;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Để được hỗ trợ thông tin về dịch vụ kiểm kê khí nhà kính, vui lòng liên hệ Hotline: 0866.059.659 – Công ty Cổ phần Công nghệ và Tư vấn CIC.&nbsp;</strong></span></span></p>
      </div>
    `
  },
  {
    id: "web-360-tuong-tac-thong-minh",
    title: "Web 360 tương tác thông minh",
    tagline: "Số hóa không gian 3D / VR360 cho Showroom, Nhà xưởng, Dự án Bất động sản",
    shortDesc: "Dịch vụ tạo Showroom ảo, Web 360 hoặc Số hóa không gian cho phép tạo ra bản sao thế giới thực trong thế giới số, tiếp cận khách hàng toàn cầu 24/7 không rào cản khoảng cách.",
    category: "Giải pháp số & 360",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80",
    relatedProductIds: [8, 9, 11, 1],
    htmlContent: `
      <div className="service-cms-body">
        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Dịch vụ tạo Showroom ảo, Web 360 hoặc Số hóa không gian</strong>&nbsp;cho phép tạo ra bản sao thế giới thực trong thế giới số, bạn có thể tiếp cận khách hàng trên khắp thế giới mà không bị bất cứ rào cản nào về không gian hay thời gian</span></span></p>

        <p style="text-align: justify;">&nbsp;</p>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Lợi ích khi sử dựng Showroom ảo, Web 360, Số hóa không gian</strong></span></span></p>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">+ Giảm thiểu rào cản khoảng cách và các hạn chế khác như dịch bệnh, giãn cách…</span></span></p>
        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">+ Thể hiện chính xác và đa dạng thực tế sản phẩm, cảnh quan mà hình ảnh truyền thông không đáp ứng được</span></span></p>
        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">+ Khách hàng có nhiều thời gian trải nghiệm nhiều lựa chọn sản phẩm hơn</span></span></p>
        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">+ Quảng bá và PR sản phẩm, thương hiệu đến khách hàng một cách chuyên nghiệp và hiệu quả</span></span></p>
        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">+ Dịch vụ vận hành online xuyên suốt 24/7</span></span></p>
        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">+ Tiếp cận khách hàng dễ dàng và hiệu quả</span></span></p>
        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">+ Tiết kiệm chi phí marketing và tư vấn viên</span></span></p>
        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">+ Nâng cao tỉ lệ quyết định mua hàng của khách hàng</span></span></p>

        <p style="text-align: justify;">&nbsp;</p>

        <p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Showroom ảo, Web 360, Số hóa không gian có thể được ứng dụng ở nhiều lĩnh vực khác nhau: <a href="https://www.cic.com.vn/web360" target="_blank" rel="noopener noreferrer">Trải nghiệm ngay</a></strong></span></span></p>

        <p>&nbsp;</p>

        <p style="text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong><em>Showroom tương tác thông minh</em></strong></span></span></p>

        <p style="text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong><a href="https://www.cic.com.vn/web360/showroom/" target="_blank" rel="noopener noreferrer"><img alt="Showroom" src="https://www.cic.com.vn/upload_images/images/2022/11/07/furniture.png" style="width: 120px; max-width: 100%; height: auto;" /></a></strong></span></span></p>

        <p style="text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Showroom tương tác thông minh là nền tảng cho phép số hoá toàn bộ showroom thực tế thành mô hình 3D trên website. Khách hàng tự do di chuyển bên trong không gian showroom ảo đó, xoay 360 để tham khảo và biết thêm thông tin về sản phẩm. Doanh nghiệp cũng có thể tích hợp thêm các tiện ích như tour tự động, video, lời thoại hướng dẫn về Công ty của bạn cũng hoàn toàn có thể liên kết đến các nền tảng thương mại điện tử để thúc đẩy câu chuyện kinh doanh.&nbsp;</span></span></p>

        <p style="text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Trải nghiệm: <a href="https://www.cic.com.vn/web360/showroom/" target="_blank" rel="noopener noreferrer">Showroom 3D</a></span></span></p>

        <p style="text-align: center;">&nbsp;</p>

        <p style="text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Nhà máy tương tác thông minh</strong></span></span></p>

        <p style="text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><img alt="Nhà máy 3D" src="https://www.cic.com.vn/upload_images/images/2022/11/07/factory.png" style="width: 120px; max-width: 100%; height: auto;" /><br />
        Nhà máy tương tác thông minh cho phép khách hàng và đối tác có thể tham quan nhà máy từ xa. Khách hàng có thể tham quan ‘tiền trạm’ và hiểu về các dây chuyền máy móc hiện đại mà nhà máy muốn giới thiệu từ đó tăng niềm tin cho khách hàng khi hợp tác cùng nhà máy. Dịch vụ tạo tour tham quan tự động, hướng dẫn viên tự động để quảng bá hình ảnh nhà máy đến đối tác.&nbsp;</span></span></p>

        <p style="text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Trải nghiệm: <a href="https://www.cic.com.vn/web360/nhamay/" target="_blank" rel="noopener noreferrer">Nhà máy 3D</a></span></span></p>

        <p style="text-align: center;">&nbsp;</p>

        <p style="text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Khu công nghiệp tương tác thông minh</strong></span></span></p>

        <p style="text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><a href="https://www.cic.com.vn/web360/khucongnghiep/" target="_blank" rel="noopener noreferrer"><img alt="Khu công nghiệp" src="https://www.cic.com.vn/upload_images/images/2022/11/07/industrial.png" style="width: 120px; max-width: 100%; height: auto;" /></a></span></span></p>

        <p style="text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Khu công nghiệp tương tác thông minh giúp bạn xây dựng một bản đồ tổng thể, quảng bá quy mô của KCN. Khách hàng của bạn sẽ có cái nhìn trực quan về vị trí, các cơ sở hạ tầng trong KCN (trạm điện, đường ống nước, trạm phòng cháy chữa cháy, nhà xưởng, khu xử lý nước thải..) từ đó khách hàng sẽ đánh giá và thấy được sự tiện lợi nếu thuê và sử dụng đất của bạn để xây dựng nhà máy,… Ngoài ra, dịch vụ có tích hợp việc lựa chọn đặt chỗ, đặt lịch tham quan KCN.</span></span></p>

        <p style="text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Trải nghiệm: <a href="https://www.cic.com.vn/web360/khucongnghiep/" target="_blank" rel="noopener noreferrer">Khu công nghiệp&nbsp;3D</a></span></span></p>

        <p style="text-align: center;"><br />
        <span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Hạ tầng tương tác thông minh</strong></span></span></p>

        <p style="text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><a href="https://www.cic.com.vn/web360/cosohatang/" target="_blank" rel="noopener noreferrer"><img alt="Cơ sở hạ tầng" src="https://www.cic.com.vn/upload_images/images/2022/11/07/63691.png" style="width: 120px; max-width: 100%; height: auto;" /></a></span></span></p>

        <p style="text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Hạ tầng tương tác thông minh là giải pháp giúp các đơn vị có thể quảng bá hình ảnh cơ sở hạ tầng, điều kiện vật chất của mình nhằm thu hút khách hàng, người sử dụng dịch vụ đến thăm quan, lưu trú và trải nghiệm. Đây là bộ giải pháp cực kì tiện ích với các đơn vị là khách sạn, resort, trường học, trung tâm thương mại,…&nbsp;</span></span></p>

        <p style="text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Trải nghiệm: <a href="https://www.cic.com.vn/web360/cosohatang/" target="_blank" rel="noopener noreferrer">Cơ sở hạ tầng 3D</a></span></span></p>

        <p style="text-align: center;"><br />
        <span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Bất động sản tương tác thông minh</strong></span></span></p>

        <p style="text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><a href="https://www.cic.com.vn/web360/batdongsan" target="_blank" rel="noopener noreferrer"><img alt="Bất động sản" src="https://www.cic.com.vn/upload_images/images/2022/11/07/AR%20options.png" style="width: 120px; max-width: 100%; height: auto;" /></a></span></span></p>

        <p style="text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Dịch vụ bất động sản tương tác thông minh giúp khách hàng có thể tham quan từ xa nhà mẫu và các khu tiện ích xung quanh, giúp tiết kiệm thời gian mà vẫn đem lại trải nghiệm sang trọng, đẳng cấp và nâng cao quyết định của khách hàng.&nbsp;</span></span></p>

        <p style="text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Trải nghiệm: <a href="https://www.cic.com.vn/web360/batdongsan" target="_blank" rel="noopener noreferrer">Bất động sản 3D</a></span></span></p>
      </div>
    `
  },
  {
    id: "danh-gia-san-luong-dien-gio",
    title: "Đánh giá sản lượng năng lượng điện gió đạt chuẩn bankable",
    tagline: "Đơn vị thực hiện: Deutsche WindGuard (CHLB Đức) & Đại diện ủy quyền tại Việt Nam: CIC",
    shortDesc: "Dịch vụ Đánh giá Sản lượng Năng lượng (EYA) chuẩn quốc tế, giúp minh bạch hóa dữ liệu, giảm thiểu rủi ro và mở khóa nguồn vốn vay Bankable cho dự án điện gió.",
    category: "Tư vấn & Năng lượng",
    image: "https://www.cic.com.vn/upload_images/images/2026/STC/dich-vudanh-gia-san-luong-nang-luong-dien-gio.png",
    relatedProductIds: [1, 2, 8, 12],
    htmlContent: `
      <div className="service-cms-body">
        <p style="margin-top: 0pt; margin-bottom: 5pt; text-align: center;"><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">DỊCH VỤ ĐÁNH GIÁ SẢN LƯỢNG NĂNG LƯỢNG ĐIỆN GIÓ ĐẠT CHUẨN BANKABLE</span></span></strong></p>

        <p className="p" style="margin: 5pt 0pt; text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Đơn vị thực hiện:&nbsp;Deutsche WindGuard (CHLB Đức)&nbsp;&amp;&nbsp;Đại diện ủy quyền tại Việt Nam: CIC</span></span></p>

        <p style="text-align: justify; margin: 5pt 0pt;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Trong lĩnh vực phát triển điện gió, việc tối ưu hóa hiệu quả tài chính và đảm bảo dự án đạt chuẩn "Bankable"&nbsp;(được các ngân hàng, tổ chức tài chính quốc tế chấp thuận cấp vốn) là yếu tố quyết định sự thành bại.</span></span></p>

        <p style="text-align: justify; margin: 5pt 0pt;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Chúng tôi vinh hạnh là đại diện ủy quyền của Deutsche WindGuard&nbsp;– một trong những tổ chức tư vấn độc lập hàng đầu thế giới về năng lượng gió. Chúng tôi xin gửi tới Quý đối tác giải pháp Đánh giá Sản lượng Năng lượng (Energy Yield Assessment - EYA)&nbsp;chuẩn quốc tế, giúp minh bạch hóa dữ liệu, giảm thiểu rủi ro và mở khóa nguồn vốn vay cho dự án của Quý vị. </span></span></p>

        <p style="margin: 5pt 0pt; text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><img alt="Đánh giá sản lượng điện gió" src="https://www.cic.com.vn/upload_images/images/2026/STC/dich-vudanh-gia-san-luong-nang-luong-dien-gio.png" style="width: 600px; max-width: 100%; height: auto;" /></span></span></p>

        <p style="margin: 5pt 0pt; text-align: justify;">&nbsp;</p>

        <h2 style="margin-top: 0pt; text-align: justify; margin-bottom: 5pt;"><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">I. DỊCH VỤ EYA (ENERGY YIELD ASSESSMENT) LÀ GÌ?</span></span></strong></h2>

        <p style="text-align: justify; margin: 5pt 0pt;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Đánh giá Sản lượng Năng lượng (EYA) là quá trình nghiên cứu kỹ thuật chuyên sâu nhằm xác định và dự báo sản lượng điện năng dài hạn hàng năm&nbsp;của một trang trại gió trước khi tiến hành xây dựng (Giai đoạn Pre-construction). </span></span></p>

        <p style="text-align: justify; margin: 5pt 0pt;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Báo cáo EYA từ Deutsche WindGuard là cơ sở pháp lý và kỹ thuật cốt lõi để:</span></span></p>

        <ul className="list-disc pl-5 space-y-1 my-2">
          <li style="text-align: justify; margin: 5pt 0pt;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Chứng minh tính khả thi về mặt tài chính của dự án với các cổ đông.</span></span></li>
          <li style="text-align: justify; margin: 5pt 0pt;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Nộp hồ sơ xin giải ngân vốn từ các tổ chức tín dụng, ngân hàng trong và ngoài nước (chuẩn Bankable).</span></span></li>
          <li style="text-align: justify; margin: 5pt 0pt;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Tối ưu hóa vị trí lắp đặt tuabin để đạt hiệu suất cao nhất.</span></span></li>
        </ul>

        <h2 style="margin-top: 1rem; text-align: justify; margin-bottom: 5pt;"><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">II. QUY TRÌNH THỰC HIỆN 6 BƯỚC CHUẨN QUỐC TẾ</span></span></strong></h2>

        <p style="text-align: justify; margin: 5pt 0pt;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Báo cáo EYA của chúng tôi được xây dựng dựa trên chuỗi quy trình nghiêm ngặt nhằm kiểm soát sai số ở mức thấp nhất: </span></span></p>

        <ul className="list-disc pl-5 space-y-1 my-2">
          <li style="text-align: justify; margin: 5pt 0pt;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Thu thập &amp; Xử lý Dữ liệu Khí tượng Nền tảng (Meteorological Data Basis):</strong>&nbsp;Khảo sát hiện trường, sử dụng dữ liệu đo đạc thực tế từ cột khí tượng hoặc thiết bị viễn thám. </span></span></li>
          <li style="text-align: justify; margin: 5pt 0pt;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Đánh giá Dài hạn (Long-Term Assessment):</strong>&nbsp;Phân tích xu hướng gió trong dài hạn để đưa ra dự báo chính xác cho vòng đời dự án. </span></span></li>
          <li style="text-align: justify; margin: 5pt 0pt;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Mô phỏng Trường Gió (Wind Field Modelling):</strong>&nbsp;Tái hiện cấu trúc và sự phân bổ tốc độ gió trên toàn bộ khu vực dự án. </span></span></li>
          <li style="text-align: justify; margin: 5pt 0pt;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Tính toán Hiệu ứng Đuôi Gió (Wake Effect Calculation):</strong>&nbsp;Đo lường sự sụt giảm năng lượng do các tuabin che chắn nhau để tối ưu hóa khoảng cách bố trí. </span></span></li>
          <li style="text-align: justify; margin: 5pt 0pt;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Tính toán Sản lượng Năng lượng (Energy Yield Calculation):</strong>&nbsp;Đưa ra con số dự báo tổng sản lượng điện năng phát lên lưới. </span></span></li>
          <li style="text-align: justify; margin: 5pt 0pt;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Đánh giá Tổn thất Kỹ thuật (Assessment of Technical Losses):</strong>&nbsp;Tính toán các hao hụt do lưới điện, bảo trì, hoặc điều kiện môi trường để cho ra sản lượng thực tế cuối cùng.</span></span></li>
        </ul>

        <h2 style="margin-top: 1rem; text-align: justify; margin-bottom: 5pt;"><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">III. CÁC TIÊU CHUẨN KỸ THUẬT NGHIÊM NGẶT ĐƯỢC ÁP DỤNG</span></span></strong></h2>

        <p style="text-align: justify; margin: 5pt 0pt;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Điểm khác biệt giúp báo cáo của Deutsche WindGuard có giá trị "Bankable" cao trên toàn cầu chính là sự tuân thủ tuyệt đối các tiêu chuẩn quốc tế khắt khe nhất: </span></span></p>

        <ul className="list-disc pl-5 space-y-1 my-2">
          <li style="text-align: justify; margin: 5pt 0pt;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Bộ tiêu chuẩn IEC (International Electrotechnical Commission):</strong>&nbsp;Tuân thủ nghiêm ngặt các quy định về đo đạc đường cong công suất và cấu trúc lắp đặt thiết bị đo như IEC 61400-12-1, IEC 61400-50-1, và IEC 61400-50-2. </span></span></li>
          <li style="text-align: justify; margin: 5pt 0pt;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Hướng dẫn MEASNET (Version 3, 2022):</strong>&nbsp;Quy trình đánh giá điều kiện gió đặc thù tại địa điểm dự án được công nhận và chấp thuận rộng rãi nhất trên quy mô quốc tế. </span></span></li>
          <li style="text-align: justify; margin: 5pt 0pt;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Hướng dẫn Kỹ thuật Đức FGW TR6 (Revision 12, 2023):</strong>&nbsp;Tiêu chuẩn vàng áp dụng cho các dự án điện gió lớn tại Châu Âu và quốc tế. </span></span></li>
          <li style="text-align: justify; margin: 5pt 0pt;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Hệ thống Traceability:</strong>&nbsp;Lịch sử và dữ liệu đo đạc được truy xuất nguồn gốc rõ ràng theo tiêu chuẩn quốc tế ISO/IEC 17025. </span></span></li>
        </ul>

        <h2 style="margin-top: 1rem; text-align: justify; margin-bottom: 5pt;"><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">IV. QUY ĐỊNH VỀ THIẾT BỊ ĐO ĐẠC ĐỂ ĐẢM BẢO ĐỘ CHÍNH XÁC</span></span></strong></h2>

        <p style="text-align: justify; margin: 5pt 0pt;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Để báo cáo đạt chuẩn và không bị các ngân hàng từ chối, chiến dịch đo gió của dự án cần đáp ứng:</span></span></p>

        <p style="text-align: justify; margin: 5pt 0pt;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Thời gian đo đạc:</strong>&nbsp;Tối thiểu 12 tháng liên tục. </span></span></p>

        <ul className="list-disc pl-5 space-y-1 my-2">
          <li style="text-align: justify; margin: 5pt 0pt;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Chiều cao cột đo</strong>:&nbsp;Ít nhất phải đạt 2/3 chiều cao tâm tuabin&nbsp;dự kiến.</span></span></li>
          <li style="text-align: justify; margin: 5pt 0pt;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Trường hợp sử dụng Thiết bị cảm biến từ xa (LiDAR / SoDAR):</strong>&nbsp;* Lợi thế về chiều cao:&nbsp;LiDAR sử dụng công nghệ bắn tia laser nên có thể dễ dàng đo gió ở nhiều tầng độ cao khác nhau, quét qua toàn bộ vùng cánh quạt và vượt xa chiều cao tâm tuabin dự kiến (từ 100m đến hơn 200m) mà không bị giới hạn cứng về chiều cao vật lý như cột thép.</span></span></li>
        </ul>

        <p style="text-align: justify; margin: 5pt 0pt;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Điều kiện Bankable bắt buộc</strong>:&nbsp;Dữ liệu từ LiDAR chỉ được ngân hàng công nhận khi thiết bị có Báo cáo kiểm định (Verification Test Report)&nbsp;do một đơn vị độc lập chuẩn quốc tế (như Deutsche WindGuard) cấp theo tiêu chuẩn IEC 61400-12-1&nbsp;hoặc IEA&nbsp;trước khi vận hành.</span></span></p>

        <p style="text-align: justify; margin: 5pt 0pt;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Yêu cầu đối chứng:</strong>&nbsp;Hệ thống cần được giám sát tính nhất quán bằng một cột đo đối chứng (Control Mast) cao tối thiểu 40m đặt gần đó. Trong trường hợp không dựng cột thép, việc giám sát này có thể thay thế bằng một đợt kiểm định lại thiết bị lần 2 (Second Verification)&nbsp;ngay sau khi chiến dịch đo gió kết thúc.</span></span></p>

        <p style="text-align: justify; margin: 5pt 0pt;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Bán kính đại diện dữ liệu (Extrapolation radius):</strong>&nbsp;Khoảng cách tối đa từ tuabin đến vị trí đo (Cột đo hoặc LiDAR) là 10 km đối với địa hình bằng phẳng&nbsp;và giảm xuống còn 2 km đối với địa hình phức tạp (đồi núi).</span></span></p>

        <p style="text-align: justify; margin: 5pt 0pt;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Xử lý sai số địa hình phức tạp:</strong>&nbsp;Tại các khu vực địa hình đồi núi dốc, thuật toán giả định dòng chảy đồng nhất của LiDAR sẽ bị nhiễu. Deutsche WindGuard sẽ áp dụng Mô hình dòng chảy 3D chuyên sâu&nbsp;để hiệu chỉnh các sai số này, đảm bảo dữ liệu LiDAR đạt độ tin cậy tuyệt đối trước các tổ chức tài chính.</span></span></p>

        <p style="text-align: justify; margin: 5pt 0pt;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Giải pháp bổ sung Remote Sensing Devices (RSD):</strong>&nbsp;Hỗ trợ sử dụng công nghệ tiên tiến như LiDAR&nbsp;hoặc SoDAR&nbsp;để thay thế hoặc bổ sung cho cột đo truyền thống, đặc biệt hiệu quả trong việc sửa đổi sai số ở địa hình phức tạp. </span></span></p>

        <h2 style="margin-top: 1rem; text-align: justify; margin-bottom: 5pt;"><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">V. GIÁ TRỊ CỐT LÕI: GIẢM THIỂU RỦI RO ĐẦU TƯ</span></span></strong></h2>

        <p style="text-align: justify; margin: 5pt 0pt;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Mọi dự án điện gió đều đối mặt với rủi ro sai số dữ liệu. Tùy thuộc vào chất lượng đo đạc, độ bất định (Uncertainties) về sản lượng có thể dao động lớn từ <strong>3%</strong> đến <strong>12%</strong>. </span></span></p>

        <p style="text-align: justify; margin: 5pt 0pt;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Việc sử dụng dịch vụ EYA chuẩn quốc tế của Deutsche WindGuard sẽ giúp:</span></span></p>

        <ul className="list-disc pl-5 space-y-1 my-2">
          <li style="text-align: justify; margin: 5pt 0pt;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Thu hẹp tối đa sai số xuống mức thấp nhất (gần mức 3%)&nbsp;nhờ vào việc chuẩn hóa thiết bị đo, hiệu chuẩn anemometer và áp dụng mô hình dòng chảy 3D. </span></span></li>
          <li style="text-align: justify; margin: 5pt 0pt;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Bảo vệ dòng tiền dự kiến, giúp nhà đầu tư đưa ra quyết định mua sắm thiết bị (tuabin) và đàm phán hợp đồng PPA chính xác nhất.</span></span></li>
          <li style="text-align: justify; margin: 5pt 0pt;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Tạo dựng niềm tin tuyệt đối với các tổ chức cho vay vốn, đẩy nhanh tiến độ thẩm định dự án.</span></span></li>
        </ul>

        <p style="margin-top: 1.5rem; text-align: justify; margin-bottom: 5pt;"><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">LIÊN HỆ ĐỂ ĐƯỢC TƯ VẤN CHI TIẾT</span></span></strong></p>

        <p style="text-align: justify; margin: 5pt 0pt;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Nếu Quý nhà đầu tư đang chuẩn bị cho chiến dịch đo gió hoặc cần thẩm định, đánh giá lại sản lượng để tái cấu trúc nguồn vốn (Refinancing), hãy liên hệ với chúng tôi để nhận được sự hỗ trợ trực tiếp từ các chuyên gia hàng đầu của Deutsche WindGuard.</span></span></p>

        <p style="text-align: justify; margin: 5pt 0pt;"><em><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Mọi thông tin chi tiết xin vui lòng liên hệ:</span></span></em></p>

        <ul className="list-disc pl-5 space-y-1 my-2">
          <li style="text-align: justify; margin: 5pt 0pt;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Trung tâm giải pháp phần mềm và thiết bị công nghệ (STC)- Công ty CP Công nghệ và Tư vấn CIC</span></span></li>
          <li style="text-align: justify; margin: 5pt 0pt;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Hotline: 024 397 41373 &amp; 0976 268 036</span></span></li>
        </ul>
      </div>
    `
  }
];
