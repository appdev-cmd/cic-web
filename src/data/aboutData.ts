/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Award, 
  Heart, 
  TrendingUp, 
  Users, 
  Sparkles, 
  Cpu, 
  Layers, 
  Globe, 
  Activity, 
  Building2, 
  MapPin, 
  BookOpen, 
  FileText, 
  Target, 
  UserCheck, 
  GraduationCap 
} from 'lucide-react';

export const coreValues = [
  {
    title: "Cam kết về chất lượng",
    icon: Award,
    desc: "Đây chính là giá trị quan trọng hình thành phong cách của CIC, thể hiện hình ảnh của một doanh nghiệp đáng tin cậy, luôn giữ vững uy tín của mình thông qua những cam kết lâu dài với khách hàng, đối tác và bạn bè."
  },
  {
    title: "Tận tụy với khách hàng",
    icon: Heart,
    desc: "Luôn đặt mục tiêu và lợi ích của khách hàng lên hàng đầu và nỗ lực thực hiện những cam kết với khách hàng vì mục tiêu phát triển của khách hàng và của CIC."
  },
  {
    title: "Đổi mới không ngừng",
    icon: TrendingUp,
    desc: "Luôn luôn cập nhật những xu hướng công nghệ mới để đảm bảo chất lượng sản phẩm, dịch vụ đem đến cho khách hàng là tốt nhất."
  },
  {
    title: "Tinh thần tập thể",
    icon: Users,
    desc: "Giá trị và con người làm nên CIC là tinh thần đoàn kết nội bộ, thể hiện sự sẻ chia, kết nối, hỗ trợ, phối hợp cùng nhau để hoàn thành mục tiêu phát triển chung của cá nhân và tập thể."
  },
  {
    title: "Khích lệ - hài hoà",
    icon: Sparkles,
    desc: "CIC luôn đảm bảo các chính sách ưu đãi và chăm lo cho tất cả cán bộ nhân viên của mình thông qua các chính sách ưu đãi, hỗ trợ, tạo điều kiện, đồng thời có cơ chế khen thưởng để khích lệ CBNV phát huy hết năng lực của bản thân. CBNV của CIC cũng đặt lợi ích của mình hài hoà với lợi ích của doanh nghiệp và các cổ đông. Bên cạnh đó, đặc tính hài hoà thể hiện ở việc xây dựng môi trường làm việc, vui chơi lành mạnh, nếp sống yêu thương, tôn trọng và giúp đỡ lẫn nhau."
  }
];

export const businessFields = [
  {
    id: "01",
    title: "Phát triển phần mềm xây dựng",
    icon: Cpu,
    techs: ["enjiCAD", "MBW", "MDW", "MCW", "VINASAS", "KPW", "SBTW", "SUMAC", "ESCON", "stCAD"],
    desc: "Nghiên cứu phát triển phần mềm vẽ kỹ thuật, tính toán nền móng, kết cấu, lập dự toán và quy hoạch đất đai tự động hóa tối ưu cho kỹ sư Việt Nam."
  },
  {
    id: "02",
    title: "Phát triển phần mềm quản lý xây dựng",
    icon: Layers,
    techs: ["Quản lý dự toán", "Quản lý nhân sự", "Quản lý kho vật tư", "Kế toán xây dựng"],
    desc: "Xây dựng các hệ thống quản trị chuyên sâu phục vụ hoạt động sản xuất, điều hành dòng tiền, kế hoạch vật tư và hiệu suất nhân lực cho các doanh nghiệp xây dựng."
  },
  {
    id: "03",
    title: "Phần mềm quy hoạch & hạ tầng kỹ thuật",
    icon: Globe,
    techs: ["Công nghệ GIS", "MaPPro", "ESPA (Quản lý nước)", "MA (Cơ sở hạ tầng)"],
    desc: "Ứng dụng các công nghệ tiên tiến như Hệ thống thông tin địa lý (GIS) vào công tác quản lý đô thị, quy hoạch phân khu, mạng lưới cấp nước thông minh và hạ tầng kỹ thuật."
  },
  {
    id: "04",
    title: "Phần phối thiết bị công nghệ cao nhập khẩu",
    icon: Activity,
    techs: ["Piletest", "James NDT", "LRM (Cáp thép)", "IDS GPR", "ELE (Địa kỹ thuật)", "A.P.Van den Berg", "Instantel", "Seba KMT", "ROMDAS"],
    desc: "Nghiên cứu, chuyển giao các thiết bị kiểm tra không phá hủy, thiết bị địa chất công trình, trạm quan trắc tự động và hệ thống phát hiện rò rỉ nước sạch từ các tập đoàn hàng đầu thế giới."
  },
  {
    id: "05",
    title: "Phần phối phần mềm xây dựng nhập khẩu",
    icon: Building2,
    techs: ["Autodesk Partner", "CSI (SAP2000, ETABS)", "Bentley Systems", "Plaxis", "GeoSlope", "ADAPT"],
    desc: "Đại diện phân phối ủy quyền các phần mềm thiết kế kiến trúc, phân tích kết cấu và địa kỹ thuật phức tạp phục vụ các dự án hạ tầng lớn tại Việt Nam."
  },
  {
    id: "06",
    title: "Phần mềm giao thông, đô thị & môi trường",
    icon: MapPin,
    techs: ["PTV Simulation (Visum)", "TRL Software", "LakeEnvironmental", "DHI Water", "Vectuel 3D"],
    desc: "Phân phối và chuyển giao các giải pháp phần mềm mô phỏng lưu lượng giao thông, dự báo ô nhiễm môi trường, thủy văn và quy hoạch đô thị 3D trực quan."
  },
  {
    id: "07",
    title: "Các giải pháp công nghệ thông minh",
    icon: Sparkles,
    techs: ["Giao thông thông minh (ITS)", "Quản lý tòa nhà (BMS)", "Giải pháp tiết kiệm năng lượng"],
    desc: "Tích hợp phần cứng và phần mềm điều khiển thông minh tự động hóa cao, tối ưu hóa năng lượng tiêu thụ và nâng cao hiệu năng vận hành tòa nhà, đô thị."
  },
  {
    id: "08",
    title: "Tư vấn các dự án công nghệ thông tin",
    icon: BookOpen,
    techs: ["Thiết kế hệ thống mạng", "Tích hợp máy chủ", "Tư vấn đầu tư ICT", "Cơ sở dữ liệu LGSP"],
    desc: "Cung cấp giải pháp tư vấn tổng thể, giám sát thi công, thẩm tra thiết kế và quản lý dự án công nghệ thông tin, viễn thông cho cơ quan nhà nước và tập đoàn lớn."
  },
  {
    id: "09",
    title: "Tư vấn thiết kế xây dựng chuyên sâu",
    icon: FileText,
    techs: ["Khảo sát địa hình", "Địa chất công trình", "Thiết kế kỹ thuật", "Lập tổng dự toán"],
    desc: "Cung cấp dịch vụ khảo sát trắc địa, tư vấn thiết kế kết cấu, hạ tầng kỹ thuật dân dụng, công nghiệp và giao thông với độ chính xác và chất lượng vượt trội."
  },
  {
    id: "10",
    title: "Tư vấn triển khai BIM & Net Zero",
    icon: Target,
    techs: ["BIM 3D/5D (Glodon, Cubicost)", "Chuyển giao công nghệ BIM", "Kiểm kê khí nhà kính", "Công trình xanh"],
    desc: "Tiên phong đào tạo, chuyển giao quy trình số hóa công trình BIM, bóc tách khối lượng tự động và tư vấn các giải pháp tính toán phát thải giảm carbon hướng tới Net Zero."
  }
];

export const businessPillars = [
  {
    title: "Hệ sinh thái Phần mềm Kỹ thuật & Quản lý",
    subtitle: "Phát triển & phân phối giải pháp số hóa toàn diện cho thiết kế, phân tích kết cấu, lập dự toán và quản trị thông minh.",
    icon: Cpu,
    color: "border-slate-200 hover:border-blue-500/50",
    activeColor: "ring-2 ring-blue-600 bg-blue-50/30 border-blue-600",
    accentBg: "bg-blue-600",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-100",
    fieldIds: ["01", "02", "03", "05", "06"],
    highlights: [
      "Phần mềm kỹ thuật Việt tự chủ vẽ kết cấu & địa kỹ thuật",
      "Đại diện chính thức của các hãng lớn: Autodesk, CSI, Bentley",
      "Công nghệ GIS tiên tiến trong quản lý quy hoạch đô thị",
      "Mô phỏng & phân tích lưu lượng giao thông thông minh"
    ]
  },
  {
    title: "Thiết bị Công nghệ cao & Giải pháp thông minh",
    subtitle: "Chuyển giao công nghệ đo đạc, thiết bị kiểm định không phá hủy và tích hợp hệ thống tự động hóa tòa nhà.",
    icon: Activity,
    color: "border-slate-200 hover:border-orange-500/50",
    activeColor: "ring-2 ring-orange-600 bg-orange-50/30 border-orange-600",
    accentBg: "bg-orange-600",
    badgeColor: "bg-orange-50 text-orange-700 border-orange-100",
    fieldIds: ["04", "07"],
    highlights: [
      "Thiết bị siêu âm cọc khoan nhồi hàng đầu (Piletest)",
      "Trạm quan trắc động đất và chấn động đập GeoSIG",
      "Hệ thống quản lý tòa nhà thông minh BMS tối ưu năng lượng",
      "Giải pháp giao thông thông minh ITS đồng bộ"
    ]
  },
  {
    title: "Dịch vụ Tư vấn Chuyên sâu, BIM & Net Zero",
    subtitle: "Khảo sát, thiết kế kỹ thuật chất lượng cao và tiên phong đào tạo, tư vấn chuyển giao quy trình BIM5D & Net Zero.",
    icon: Target,
    color: "border-slate-200 hover:border-emerald-500/50",
    activeColor: "ring-2 ring-emerald-600 bg-emerald-50/30 border-emerald-600",
    accentBg: "bg-emerald-600",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
    fieldIds: ["08", "09", "10"],
    highlights: [
      "Hơn 35 năm kinh nghiệm tư vấn dự án CNTT & viễn thông",
      "Khảo sát địa hình địa chất & lập tổng dự toán chính xác",
      "Tiên phong đào tạo chuyển giao BIM5D (Glodon, Cubicost)",
      "Tư vấn kiểm kê khí nhà kính hướng tới công trình xanh Net Zero"
    ]
  }
];

export const hrData = [
  { stt: 1, name: "Ban Lãnh đạo - Quản lý", total: 3, nv: 0, dh: 0, postDh: 3, icon: UserCheck },
  { stt: 2, name: "Phòng Tổng hợp và Tài vụ", total: 8, nv: 1, dh: 7, postDh: 0, icon: FileText },
  { stt: 3, name: "Trung tâm Phần mềm Xây dựng nhập khẩu", total: 12, nv: 0, dh: 10, postDh: 2, icon: Layers },
  { stt: 4, name: "Trung tâm Giải pháp phần mềm và thiết bị nhập khẩu", total: 9, nv: 0, dh: 7, postDh: 2, icon: Activity },
  { stt: 5, name: "Trung tâm Phần mềm xây dựng", total: 12, nv: 0, dh: 9, postDh: 3, icon: Cpu },
  { stt: 6, name: "Trung tâm Tư vấn phát triển bền vững và Giải pháp công nghệ kỹ thuật", total: 6, nv: 0, dh: 5, postDh: 1, icon: Target },
  { stt: 7, name: "TT Tư vấn Dự án", total: 6, nv: 0, dh: 5, postDh: 1, icon: BookOpen },
  { stt: 8, name: "Trung tâm Tư vấn Thiết kế Xây dựng", total: 20, nv: 0, dh: 17, postDh: 3, icon: MapPin },
  { stt: 9, name: "Chi nhánh tại TP. HCM", total: 10, nv: 0, dh: 9, postDh: 1, icon: Building2 },
  { stt: 10, name: "Trung tâm BIM", total: 20, nv: 0, dh: 17, postDh: 3, icon: GraduationCap }
];

export const experienceYears = [
  { title: "Tư vấn các giải pháp tổng thể về hệ thống thiết bị tin học, viễn thông", years: 35 },
  { title: "Nghiên cứu ứng dụng và chuyển giao các giải pháp công nghệ thông tin", years: 35 },
  { title: "Thực hiện việc lắp đặt các hệ thống thiết bị tin học viễn thông", years: 35 },
  { title: "Nghiên cứu, thiết kế, sản xuất, khai thác phát triển và cung cấp phần mềm về công nghệ thông tin phục vụ quản lý kinh tế, kỹ thuật", years: 35 },
  { title: "Thực hiện các nội dung công tác tư vấn xây dựng đối với các công trình tin học viễn thông, các công trình dân dụng, công nghiệp, công trình kỹ thuật hạ tầng đô thị, khu công nghiệp", years: 35 },
  { title: "Xuất nhập khẩu thiết bị, sản phẩm công nghệ tin học và các ứng dụng công nghệ khác", years: 35 },
  { title: "Tổ chức đào tạo, bồi dưỡng về công nghệ thông tin và các ứng dụng công nghệ khác", years: 35 },
  { title: "Liên doanh, liên kết, hợp tác với các đơn vị trong và ngoài nước để phát triển và đầu tư công nghệ", years: 30 },
  { title: "Phân phối các thiết bị đặc thù và phần mềm nhập khẩu chuyên ngành xây dựng", years: 29 }
];

export const capDetails = [
  {
    tag: "Hạ tầng Viễn thông",
    icon: Cpu,
    projects: "Hạ tầng Trung tâm dữ liệu Bộ Xây dựng, nâng cấp thiết bị lưu trữ số",
    team: "15+ Chuyên gia mạng cao cấp (CCIE, CISSP, CCNP) thuộc Phòng TV Dự án",
    standards: "ISO 27001, Tiêu chuẩn kỹ thuật phòng máy chủ Tier III",
    tech: "Cisco, Enterprise Dell Servers, Fortinet Next-Gen, SAN Storage",
    desc: "Hơn 35 năm tư vấn giải pháp tổng thể từ khâu quy hoạch hạ tầng viễn thông, tối ưu hóa cấu hình thiết bị, an toàn bảo mật thông tin đến tích hợp lưu trữ đám mây cho các cơ quan nhà nước và tập đoàn lớn."
  },
  {
    tag: "Nghiên cứu & Chuyển giao",
    icon: Target,
    projects: "Tư vấn triển khai quy trình BIM cho Daewoo Starlake, STS Việt Nam",
    team: "20+ Thạc sĩ, Kỹ sư ứng dụng, Chuyên gia BIM đạt chứng chỉ quốc tế",
    standards: "BIM Level 2 (UK standards), ISO 19650",
    tech: "Cubicost TAS/TRB, Glodon, Allplan, Bentley Systems, Plaxis",
    desc: "Nghiên cứu sâu rộng và nhập khẩu, bản địa hóa các công nghệ tiên tiến trên thế giới để chuyển giao đồng bộ cho thị trường kỹ thuật, xây dựng Việt Nam nhằm nâng cao năng suất."
  },
  {
    tag: "Lắp đặt Đồng bộ",
    icon: Layers,
    projects: "Trang thiết bị mạng, bảo mật và máy chủ Trung tâm dữ liệu Bộ Xây dựng",
    team: "30+ Kỹ sư Cơ điện tử, Viễn thông & Giám sát hiện trường",
    standards: "IEEE, TCVN về lắp đặt thiết bị điện nhẹ và mạng viễn thông",
    tech: "Hệ thống điện nhẹ ELV, Fiber Optic Backbone, SAN/NAS Virtualization",
    desc: "Năng lực triển khai lắp đặt vật lý chuyên sâu, hiệu chuẩn thiết bị chính xác cao, đấu nối hệ thống thông tin phức tạp đạt hiệu năng tối đa ngay sau khi bàn giao."
  },
  {
    tag: "R&D & Phát triển Phần mềm",
    icon: Sparkles,
    projects: "Bộ phần mềm enjiCAD bản quyền, ESCON, stCAD, MBW, MDW tự phát triển",
    team: "25+ Lập trình viên C++, .NET, WebApp kỳ cựu",
    standards: "CMMI Level 3, Quy trình phát triển phần mềm Agile/Scrum",
    tech: "CAD Engine Core, .NET Core, React, SQL Server, Python AI Engine",
    desc: "Tự hào là đơn vị tiên phong tự chủ phát triển các phần mềm kỹ thuật nội địa. enjiCAD và ESCON đã trở thành công cụ làm việc không thể thiếu của hàng vạn kỹ sư thiết kế Việt."
  },
  {
    tag: "Tư vấn Đầu tư Xây dựng",
    icon: Building2,
    projects: "Tổ hợp Hải Phát Plaza, Usilk City 105 CT2, Trụ sở làm việc liên cơ quan",
    team: "35+ Kiến trúc sư, Kỹ sư Thiết kế Kết cấu Hạng I",
    standards: "Eurocode, TCVN 5574:2018 (Kết cấu bê tông cốt thép), IBC",
    tech: "SAP2000, ETABS, Plaxis 3D, CSI Safe, Bentley Microstation",
    desc: "Cung cấp trọn gói từ khảo sát địa chất, lập báo cáo tiền khả thi, thiết kế kỹ thuật chi tiết đến lập dự toán tổng thể với độ tin cậy và tối ưu chi phí nguyên vật liệu tối đa."
  },
  {
    tag: "Thương mại Quốc tế",
    icon: Globe,
    projects: "Hệ thống đo gió tự động ZX300 (Bitexco), thiết bị địa chấn Summit (DMT)",
    team: "12+ Chuyên viên Thương mại Quốc tế am hiểu sâu thủ tục hải quan",
    standards: "Incoterms 2020, CE, FCC, Chứng chỉ xuất xứ CO/CQ chặt chẽ",
    tech: "Laser Lidar, Ground Penetrating Radar (GPR), Acoustic Emission, NDT Equipment",
    desc: "Đối tác thương mại uy tín đại diện cho hơn 50 hãng công nghệ lớn toàn cầu. Đảm bảo quy trình nhập khẩu trực tiếp, thông quan nhanh chóng và bàn giao đầy đủ giấy tờ chính hãng."
  },
  {
    tag: "Đào tạo Chuyên sâu",
    icon: GraduationCap,
    projects: "Khóa đào tạo ứng dụng công nghệ BIM cho Ban QLDA Quảng Ninh, Ecoba",
    team: "15+ Giảng viên là chuyên gia thực chiến đạt chứng chỉ của Hãng",
    standards: "Authorized Training Center (ATC) được Autodesk & Glodon ủy quyền",
    tech: "BIM/VDC Workflow, Revit, Cubicost, Plaxis Professional Training",
    desc: "Tổ chức các khóa huấn luyện chuyên đề, nâng cao tay nghề và cấp chứng chỉ chuẩn mực quốc tế về ứng dụng BIM, phân tích kết cấu và địa kỹ thuật cho cộng đồng kỹ sư Việt Nam."
  },
  {
    tag: "Hợp tác Chiến lược",
    icon: Users,
    projects: "Hệ thống thông tin GIS quản lý tài nguyên nước (Chính phủ Phần Lan ODA)",
    team: "Hội đồng Cố vấn Khoa học & Ban đối ngoại chiến lược tập đoàn",
    standards: "FDI Tech Transfer Standard, Joint Venture Framework Agreement",
    tech: "GIS Technology, Integrated Water Resource Management (IWRM) Systems",
    desc: "Tạo dựng mạng lưới đối tác vững chắc với các viện nghiên cứu lớn như Viện Khoa học Công nghệ Xây dựng Hàn lâm Trung Quốc (PKPM) để thúc đẩy liên doanh đổi mới."
  },
  {
    tag: "Phân phối Ủy quyền",
    icon: Award,
    projects: "Đại diện chính hãng phân phối Bentley, CSI Mỹ, Piletest Israel, IDS Ý",
    team: "Mạng lưới 100+ Đối tác, đại lý & Đội ngũ hỗ trợ kỹ thuật 24/7",
    standards: "Exclusive Authorized Agency Criteria (EAA)",
    tech: "Bentley Microstation, SAP2000, ETABS, Plaxis 2D/3D, Piletest CHUM",
    desc: "Kênh phân phối phần mềm bản quyền và thiết bị đo lường chính hãng lớn hàng đầu Việt Nam, hỗ trợ cài đặt, chuyển giao tài liệu và cập nhật nâng cấp trọn đời cho khách hàng."
  }
];

export const contracts = [
  // 1. Phát triển phần mềm & Phân phối (software)
  { id: 1, name: "Cung cấp phần mềm CSI và IDEA Statica", year: "2022", client: "Công ty TNHH Nhà thép tiền chế Zamil Việt Nam", cat: "software" },
  { id: 2, name: "Cung cấp các phần mềm Allplan", year: "2022", client: "Công ty CP Tư vấn thiết kế đường bộ (HECO)", cat: "software" },
  { id: 3, name: "Cung cấp phần mềm enjiCAD bản quyền vĩnh viễn", year: "2022", client: "Công ty TNHH SHINRYO Việt Nam", cat: "software" },
  { id: 4, name: "Cung cấp phần mềm Plaxis, CSI phân tích kết cấu", year: "2022", client: "Công ty cổ phần Vinhomes", cat: "software" },
  { id: 5, name: "Cung cấp bản quyền phần mềm hãng Bentley Systems", year: "2022", client: "Tổng công ty tư vấn thiết kế giao thông vận tải (TEDI)", cat: "software" },
  { id: 6, name: "Cung cấp phần mềm kết cấu thép chuyên sâu BOCAD", year: "2022", client: "Liên doanh Việt - Nga (Vietsovpetro)", cat: "software" },
  { id: 7, name: "Cung cấp phần mềm PTV VISUM mô phỏng giao thông, JICA STRADA & máy tính chuyên dụng", year: "2022", client: "Viện chiến lược và phát triển GTVT", cat: "software" },
  { id: 8, name: "Phần mềm hỗ trợ kỹ thuật kiểm toán lĩnh vực tài chính ngân hàng", year: "2018 - 2019", client: "Công ty CP Tập đoàn HIPT", cat: "software" },
  { id: 9, name: "Nâng cấp phần mềm quản lý hợp đồng, quản lý sản xuất và quản lý kho vật tư", year: "2018", client: "Công ty CP In Hàng Không", cat: "software" },
  { id: 10, name: "Phát triển phần mềm ứng dụng quản lý kỹ thuật", year: "2008 - 2009", client: "Công ty CP Kiểm định kỹ thuật, an toàn và TVXD", cat: "software" },
  { id: 11, name: "Ứng dụng CNTT trong quản lý dịch vụ khách hàng và thiết bị đồng hồ nước", year: "2013", client: "Công ty CP Cấp thoát nước Lạng Sơn", cat: "software" },
  { id: 12, name: "Xây dựng cơ sở dữ liệu và bản đồ quản lý thông tin điều tra tài nguyên nước sử dụng GIS", year: "2007 - 2008", client: "Chính phủ Phần Lan (Dự án ODA)", cat: "software" },
  { id: 13, name: "Xây dựng ứng dụng công nghệ quản lý", year: "2010", client: "Công ty Cấp nước Cao Bằng", cat: "software" },
  { id: 14, name: "Xây dựng phần mềm Hướng dẫn quy trình thủ tục Quản lý dự án và Quản lý thông tin", year: "2006", client: "Bộ Xây dựng", cat: "software" },
  { id: 15, name: "Ứng dụng CNTT quản lý quy hoạch xây dựng tại 04 phường thị xã Bắc Kạn", year: "2006", client: "Sở xây dựng Bắc Kạn", cat: "software" },
  { id: 16, name: "Việt hoá và chuyển giao công nghệ phần mềm PKPM", year: "2005", client: "Viện Khoa học Công nghệ Xây dựng Hàn lâm Trung Quốc", cat: "software" },
  { id: 17, name: "Xây dựng hệ thống thông tin địa lý (GIS) phục vụ quản lý hạ tầng", year: "2001 - 2002", client: "Sở Xây dựng Bắc Ninh", cat: "software" },

  // 2. Tư vấn BIM & Chuyển giao (bim)
  { id: 18, name: "Tư vấn và Triển khai mô hình BIM (Dự án K8CT1)", year: "2023", client: "Công ty TNHH Daewoo Engineering & Construction Việt Nam", cat: "bim" },
  { id: 19, name: "Tư vấn và triển khai BIM (Dự án GBC)", year: "2023", client: "Công ty TNHH Phát triển STS Việt Nam", cat: "bim" },
  { id: 20, name: "Đào tạo chuyên sâu về ứng dụng công nghệ BIM trong quản lý dự án", year: "2023", client: "Ban QLDA ĐTXD Các công trình dân dụng và công nghiệp Quảng Ninh", cat: "bim" },
  { id: 21, name: "Tư vấn thiết lập quy trình và triển khai BIM", year: "2021 - 2022", client: "Công ty CP Công nghệ xây dựng Hancorp5", cat: "bim" },
  { id: 22, name: "Tư vấn và hỗ trợ kỹ thuật triển khai BIM", year: "2021", client: "Công ty CP Xây dựng Bông sen vàng", cat: "bim" },
  { id: 23, name: "Tư vấn giải pháp BIM tích hợp", year: "2020 - 2021", client: "Công ty CP Tập đoàn xây dựng Thành Đô", cat: "bim" },
  { id: 24, name: "Tư vấn Mô hình số hóa BIM công trình cao tầng", year: "2020 - 2022", client: "HASEKO Corporation (Nhật Bản)", cat: "bim" },
  { id: 25, name: "Cung cấp phần mềm bản quyền và đào tạo giải pháp BIM5D", year: "2020", client: "Công ty CP Ecoba Việt Nam", cat: "bim" },
  { id: 26, name: "Cung cấp phần mềm và đào tạo ứng dụng giải pháp BIM5D", year: "2020", client: "Tổng Công ty Đầu tư phát triển hạ tầng đô thị UDIC", cat: "bim" },
  { id: 27, name: "Cung cấp phần mềm và chuyển giao đào tạo giải pháp BIM5D chuyên sâu", year: "2019 - 2020", client: "Công ty TNHH Tư vấn thiết kế DP", cat: "bim" },
  { id: 28, name: "Hợp đồng cung cấp phần mềm và chuyển giao đào tạo giải pháp BIM5D", year: "2018 - 2019", client: "Công ty Cổ phần Vinhomes", cat: "bim" },

  // 3. Tư vấn QLDA, Giám sát, Thẩm tra (consult)
  { id: 29, name: "Tư vấn giám sát thi công hệ thống CNTT công trình", year: "2021", client: "Cục kinh tế xây dựng - Bộ Xây dựng", cat: "consult" },
  { id: 30, name: "Tư vấn thẩm tra hệ thống trang thiết bị công nghệ chuyên biệt", year: "2021", client: "Trung tâm tin học BKH", cat: "consult" },
  { id: 31, name: "Tư vấn giám sát lắp đặt thiết bị công nghệ & mạng truyền thông", year: "2021", client: "Trung tâm Thông tin - Bộ Xây dựng", cat: "consult" },
  { id: 32, name: "Tư vấn giám sát lắp đặt hạ tầng mạng máy chủ dữ liệu chuyên dụng", year: "2020", client: "Trung tâm thông tin Bộ Xây dựng", cat: "consult" },
  { id: 33, name: "Thẩm tra kỹ thuật dự án ứng dụng công nghệ thông tin", year: "2020", client: "Ban quản lý dự án RGEP", cat: "consult" },
  { id: 34, name: "Tư vấn giám sát thi công lắp đặt và hiệu chuẩn hệ thống thiết bị", year: "2019", client: "Cục kinh tế xây dựng", cat: "consult" },

  // 4. Khảo sát, Thiết kế, Tổng dự toán (design)
  { id: 35, name: "Tư vấn lập báo cáo nghiên cứu khả thi nâng cấp hạ tầng số", year: "2021", client: "Báo Vietnamnet", cat: "design" },
  { id: 36, name: "Tư vấn lập Báo cáo KTKT trang thiết bị kỹ thuật chuyên dụng", year: "2021", client: "Tổng Công ty thuốc lá Việt Nam", cat: "design" },
  { id: 37, name: "Lập Đề cương chi tiết và dự toán kinh phí nâng cấp hạ tầng ứng dụng CNTT", year: "2021", client: "Văn phòng Tỉnh ủy Hưng Yên", cat: "design" },
  { id: 38, name: "Tư vấn xây dựng nền tảng tích hợp, chia sẻ dữ liệu dùng chung (LGSP) ngành xây dựng", year: "2021", client: "Trung tâm thông tin Bộ Xây dựng", cat: "design" },
  { id: 39, name: "Lập thiết kế kỹ thuật và tổng dự toán nâng cấp hệ thống hạ tầng dữ liệu", year: "2020", client: "Trung tâm thông tin Bộ xây dựng", cat: "design" },
  { id: 40, name: "Tư vấn lập thiết kế bản vẽ thi công và tổng dự toán nâng cấp hệ thống lưu trữ số", year: "2019", client: "Điện ảnh Quân đội nhân dân", cat: "design" },
  { id: 41, name: "Tư vấn lập báo cáo nghiên cứu khả thi dự án số hóa tư liệu lịch sử", year: "2018", client: "Điện ảnh quân đội", cat: "design" },

  // 5. Thiết bị CNTT & Mạng (hardware)
  { id: 42, name: "Cung cấp trang thiết bị phòng máy chuyên dụng và chuyển giao đào tạo công nghệ", year: "2021", client: "Học viện Múa Việt Nam", cat: "hardware" },
  { id: 43, name: "Cung cấp iPad Pro, bàn phím Apple Magic, tai nghe Bluetooth phục vụ phòng họp không giấy tờ", year: "2021", client: "Trung tâm thông tin Bộ Xây dựng", cat: "hardware" },
  { id: 44, name: "Cung cấp Máy tính xách tay phục vụ quản lý kỹ thuật công trình", year: "2020", client: "Công ty CP Kiến trúc và xây dựng An Gia Phát", cat: "hardware" },
  { id: 45, name: "Mua sắm trang thiết bị mạng, bảo mật và máy chủ phục vụ nâng cấp trung tâm dữ liệu", year: "2020", client: "Trung tâm thông tin Bộ Xây Dựng", cat: "hardware" },
  { id: 46, name: "Cung cấp thiết bị và phần mềm nâng cao năng lực dạy học số hóa", year: "2018", client: "Trường Đại học Mỹ thuật Việt Nam", cat: "hardware" },
  { id: 47, name: "Cung cấp thiết bị phòng server chuyên dụng và phần mềm quản lý đào tạo", year: "2016", client: "Ban Quản lý dự án Tăng cường năng lực Trường cán bộ Tòa án", cat: "hardware" },

  // 6. Tư vấn đấu thầu (bidding)
  { id: 48, name: "Tư vấn lập HSMT và đánh giá HSDT các gói thầu mua sắm trang thiết bị CNTT", year: "2021", client: "Trung tâm Thông tin - Bộ Xây dựng", cat: "bidding" },
  { id: 49, name: "Mua thiết bị Phòng thí nghiệm đa dạng sinh học và môi trường biển", year: "2021", client: "Viện tài nguyên và môi trường biển", cat: "bidding" },
  { id: 50, name: "Mua sắm hệ thống máy móc chuyên dụng phục vụ dây chuyền sản xuất phim hoạt hình kỹ thuật số", year: "2021", client: "Công ty CP Hãng phim Hoạt hình Việt Nam", cat: "bidding" },
  { id: 51, name: "Tư vấn đầu tư và lập HSMT hệ thống điện nhẹ (LAN, CCTV, Access Control)", year: "2021", client: "Tổng công ty Thuốc lá Việt Nam", cat: "bidding" },

  // 7. Thiết kế dân dụng & CN (construction)
  { id: 52, name: "Lập BCKTKT nâng cấp cải tạo hạ tầng an ninh, tường rào, cổng bảo vệ và cảnh quan văn phòng", year: "2021", client: "Tổng công ty phát điện 2 - Ban QLDA Trung tâm điện lực Ô Môn", cat: "construction" },
  { id: 53, name: "Tư vấn thiết kế bản vẽ thi công và tổng dự toán - Nhà máy bảo trì, bảo dưỡng thiết bị PECI", year: "2019", client: "Công ty TNHH PECI Việt Nam (Khu kinh tế Nghi Sơn)", cat: "construction" },
  { id: 54, name: "Thiết kế BVTC và dự toán - Hạng mục hạ tầng kỹ thuật và nhà ở thấp tầng", year: "2016", client: "Tổ hợp Thương mại Hải Phát Plaza - Công ty CP Đầu tư Hải Phát", cat: "construction" },
  { id: 55, name: "Thiết kế kỹ thuật, lập TDT và thiết kế bản vẽ thi công Tổ hợp Hải Phát Plaza", year: "2015 - 2018", client: "Công ty cổ phần Đầu tư Hải Phát", cat: "construction" },
  { id: 56, name: "Thiết kế kỹ thuật, lập tổng dự toán Tòa nhà hỗn hợp cao tầng 105 CT2 - Usilk City", year: "2015 - 2018", client: "Công ty cổ phần Đầu tư Hải Phát Thủ đô", cat: "construction" },
  { id: 57, name: "Tư vấn TKKT và TDT; tư vấn thiết kế BVTC công trình Nhà làm việc liên cơ quan", year: "2013 - 2014", client: "Ban Quản lý dự án các công trình xây dựng của Đảng ở Trung ương", cat: "construction" },
  { id: 58, name: "Tư vấn thiết kế bản vẽ thi công và lập tổng dự toán Trụ sở Ngân hàng Nhà nước VN", year: "2013", client: "Công ty cổ phần Đầu tư Hải Phát Thủ đô", cat: "construction" },
  { id: 59, name: "Thiết kế bản vẽ thi công và dự toán xây dựng Tòa nhà văn phòng Báo điện tử Đảng Cộng Sản Việt Nam", year: "2010 - 2011", client: "Công ty cổ phần thi công cơ giới xây lắp", cat: "construction" },

  // 8. Cung cấp thiết bị nhập khẩu (imported)
  { id: 60, name: "Cung cấp hệ thống đo gió tự động tầm xa Lidar ZX300 khảo sát điện gió", year: "2021", client: "Công ty CP Năng lượng Bitexco", cat: "imported" },
  { id: 61, name: "Cung cấp 8 bộ thiết bị ghi địa chấn Summit M Vipa hiện đại của hãng DMT", year: "2021", client: "Viện Vật lý Địa cầu - Viện Hàn lâm KH&CN VN", cat: "imported" },
  { id: 62, name: "Cung cấp thiết bị dò tìm đường cáp ngầm, đường ống nước ngầm RD8200 hãng Radiodetection", year: "2021", client: "Công ty Điện lực Hoàn Kiếm", cat: "imported" },
  { id: 63, name: "Cung cấp 3 trạm thiết bị quan trắc động đất và chấn động đập hãng GeoSIG", year: "2021", client: "Công ty CP Tư vấn và Xây dựng Thuận Phong", cat: "imported" },
  { id: 64, name: "Cung cấp thiết bị cắt cánh đất hiện trường H70 hãng Geonor", year: "2021", client: "Tổng công ty Tư vấn Thiết kế Giao thông Vận tải (TEDI)", cat: "imported" },
  { id: 65, name: "Cung cấp thiết bị siêu âm chất lượng cọc khoan nhồi bằng sóng truyền qua CHUM hãng Piletest", year: "2021", client: "Sumitomo Mitsui Construction Co., Ltd (Nhật Bản)", cat: "imported" },
  { id: 66, name: "Cung cấp 3 thiết bị giám sát chấn động nổ mìn chuyên dụng Summit M Vipa hãng DMT", year: "2021", client: "Công ty TNHH Công nghệ và Giải pháp Miva Việt Nam", cat: "imported" },
  { id: 67, name: "Cung cấp thiết bị theo dõi chuyển động mắt Eye Tracking phục vụ nghiên cứu hành vi", year: "2020", client: "Trường Đại học Việt Đức", cat: "imported" },
  { id: 70, name: "Chuyển giao giải pháp và đào tạo vận hành phần mềm thiết kế Haixun 4.0", year: "2021", client: "Công ty TNHH Nội thất Minh Hoà", cat: "interior" },
  { id: 71, name: "Đào tạo, chuyển giao bản quyền phần mềm thiết kế và sản xuất nội thất chuyên nghiệp", year: "2021", client: "Công ty Cổ phần Thiết kế - Xây dựng và Đào tạo Kiến Thiết Việt", cat: "interior" },
  { id: 72, name: "Chuyển giao bản quyền phần mềm bóc tách vật tư và tính giá nhôm kính chuyên dụng Opera", year: "2021", client: "Công ty TNHH Cửa sổ Cuộc sống Ritavo", cat: "interior" }
];

export const categories = [
  { id: 'all', label: 'Tất cả hợp đồng' },
  { id: 'software', label: 'Phát triển Phần mềm' },
  { id: 'bim', label: 'Tư vấn BIM & Glodon' },
  { id: 'consult', label: 'Giám sát & Thẩm tra' },
  { id: 'design', label: 'Thiết kế & Khảo sát CNTT' },
  { id: 'hardware', label: 'Hạ tầng & Thiết bị CNTT' },
  { id: 'bidding', label: 'Tư vấn Đấu thầu' },
  { id: 'construction', label: 'Thiết kế Công trình' },
  { id: 'imported', label: 'Thiết bị Đo đạc Nhập khẩu' },
  { id: 'interior', label: 'Giải pháp Nội thất & VLXD' }
];

export const softwarePartners = [
  "Computer & Structure INC (CSI Mỹ)", "Autodesk (Mỹ)", "Bentley Systems (Mỹ)", "Hexagon (Thụy Điển)", 
  "Seequent (New Zealand)", "DNV GL (Na Uy)", "Plaxis (Hà Lan)", "Geo-Slope (Canada)", "Risa (Mỹ)", 
  "Glodon (Trung Quốc)", "Prokon (Anh)", "Almacam (Pháp)", "Idea-Statica (Cộng hòa Séc)", "PTV Group (Đức)", 
  "Kritikal (Ấn độ)", "Graitec (Pháp)", "AllPlan (Đức)", "DHI (Đan Mạch)", "Gstarsoft (Trung Quốc)", 
  "Cabinet Vision (Mỹ)", "Matterport (Mỹ)", "Pytha (Đức)", "Orgadata (Đức)", "Opera (Ý)", "Metsims (Anh)", 
  "STX (Hàn Quốc)", "CYPE (Tây Ban Nha)", "Cubicost", "HTRI (Mỹ)", "Lantek (Tây Ban Nha)", "Autocost", "TRL Software (Anh)"
];

export const hardwarePartners = [
  "Lander Simulation (Tây Ban Nha)", "Tecknotrove (Ấn Độ)", "DMT (Đức)", "Geotechnical (Anh)", "Piletest (Israel)", 
  "Elcometer (Anh Quốc)", "LRM (Ba Lan)", "IDS Georadar (Ý)", "A.P.Van den Berg (Hà Lan)", "Geonor (Na Uy)", 
  "Geotomographie (Đức)", "Geoscanner (Thụy Điển)", "Radiodetection (Anh)", "Pearpoint (Mỹ)", "SPX Corporation (Mỹ)", 
  "Instantel (Canada)", "OYO Corporation (Nhật Bản)", "AGI (Mỹ)", "Geometrics (Mỹ)", "GeoSIG (Thụy Sỹ)", 
  "Guralp Systems (Anh)", "IRIS Instruments (Mỹ)", "Lidar USA (Mỹ)", "Nomis (Mỹ)", "Zephir Lidar (Anh)", 
  "AQ Systems (Thụy Điển)", "Sewer Robotics (Hà Lan)", "CUES Inc (Mỹ)", "Alphacam"
];
