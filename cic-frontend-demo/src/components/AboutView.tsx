/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Target, 
  Eye, 
  Award, 
  Users, 
  Activity, 
  CheckCircle2, 
  Heart, 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  ShieldAlert,
  ArrowUpRight,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
  BookOpen,
  Search,
  Filter,
  Calendar,
  ChevronRight,
  UserCheck,
  GraduationCap,
  Briefcase,
  FileText,
  Globe,
  DollarSign,
  Trophy,
  Zap
} from 'lucide-react';

interface AboutViewProps {
  activeTab: 'overview' | 'structure' | 'experience';
  setActiveTab: (tab: 'overview' | 'structure' | 'experience') => void;
}

export const AboutView = ({ activeTab, setActiveTab }: AboutViewProps) => {
  // Interactive active states for redesigned sections
  const [activeCoreIndex, setActiveCoreIndex] = useState(0);
  const [activeFieldIndex, setActiveFieldIndex] = useState(0);
  const [activePillarIndex, setActivePillarIndex] = useState(0);
  const [activeCapIndex, setActiveCapIndex] = useState(0);
  
  // States for Contract registry searching and filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const coreValues = [
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

  const businessFields = [
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
      title: "Phân phối thiết bị công nghệ cao nhập khẩu",
      icon: Activity,
      techs: ["Piletest", "James NDT", "LRM (Cáp thép)", "IDS GPR", "ELE (Địa kỹ thuật)", "A.P.Van den Berg", "Instantel", "Seba KMT", "ROMDAS"],
      desc: "Nghiên cứu, chuyển giao các thiết bị kiểm tra không phá hủy, thiết bị địa chất công trình, trạm quan trắc tự động và hệ thống phát hiện rò rỉ nước sạch từ các tập đoàn hàng đầu thế giới."
    },
    {
      id: "05",
      title: "Phân phối phần mềm xây dựng nhập khẩu",
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

  const businessPillars = [
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

  // Structural Human Resources detailed table
  const hrData = [
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

  // Specific experience nature items
  const experienceYears = [
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

  const capDetails = [
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

  // Contract list with category tags
  const contracts = [
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
    { id: 68, name: "Cung cấp Robot kiểm tra chuyên dụng đường cống ngầm P550c FLEXITRAX của PEARPOINT", year: "2020", client: "Tổng công ty Đầu tư và Phát triển Công nghiệp - CTCP (BECAMEX)", cat: "imported" },
    { id: 69, name: "Cung cấp Thiết bị đo dòng dẫn nhiệt vật liệu xây dựng HFM 100", year: "2020", client: "Viện Nhiệt đới Môi trường", cat: "imported" },

    // 9. Nội thất & VLXD (interior)
    { id: 70, name: "Chuyển giao giải pháp và đào tạo vận hành phần mềm thiết kế Haixun 4.0", year: "2021", client: "Công ty TNHH Nội thất Minh Hoà", cat: "interior" },
    { id: 71, name: "Đào tạo, chuyển giao bản quyền phần mềm thiết kế và sản xuất nội thất chuyên nghiệp", year: "2021", client: "Công ty Cổ phần Thiết kế - Xây dựng và Đào tạo Kiến Thiết Việt", cat: "interior" },
    { id: 72, name: "Chuyển giao bản quyền phần mềm bóc tách vật tư và tính giá nhôm kính chuyên dụng Opera", year: "2021", client: "Công ty TNHH Cửa sổ Cuộc sống Ritavo", cat: "interior" }
  ];

  const categories = [
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

  // International Partners data arrays
  const softwarePartners = [
    "Computer & Structure INC (CSI Mỹ)", "Autodesk (Mỹ)", "Bentley Systems (Mỹ)", "Hexagon (Thụy Điển)", 
    "Seequent (New Zealand)", "DNV GL (Na Uy)", "Plaxis (Hà Lan)", "Geo-Slope (Canada)", "Risa (Mỹ)", 
    "Glodon (Trung Quốc)", "Prokon (Anh)", "Almacam (Pháp)", "Idea-Statica (Cộng hòa Séc)", "PTV Group (Đức)", 
    "Kritikal (Ấn độ)", "Graitec (Pháp)", "AllPlan (Đức)", "DHI (Đan Mạch)", "Gstarsoft (Trung Quốc)", 
    "Cabinet Vision (Mỹ)", "Matterport (Mỹ)", "Pytha (Đức)", "Orgadata (Đức)", "Opera (Ý)", "Metsims (Anh)", 
    "STX (Hàn Quốc)", "CYPE (Tây Ban Nha)", "Cubicost", "HTRI (Mỹ)", "Lantek (Tây Ban Nha)", "Autocost", "TRL Software (Anh)"
  ];

  const hardwarePartners = [
    "Lander Simulation (Tây Ban Nha)", "Tecknotrove (Ấn Độ)", "DMT (Đức)", "Geotechnical (Anh)", "Piletest (Israel)", 
    "Elcometer (Anh Quốc)", "LRM (Ba Lan)", "IDS Georadar (Ý)", "A.P.Van den Berg (Hà Lan)", "Geonor (Na Uy)", 
    "Geotomographie (Đức)", "Geoscanner (Thụy Điển)", "Radiodetection (Anh)", "Pearpoint (Mỹ)", "SPX Corporation (Mỹ)", 
    "Instantel (Canada)", "OYO Corporation (Nhật Bản)", "AGI (Mỹ)", "Geometrics (Mỹ)", "GeoSIG (Thụy Sỹ)", 
    "Guralp Systems (Anh)", "IRIS Instruments (Mỹ)", "Lidar USA (Mỹ)", "Nomis (Mỹ)", "Zephir Lidar (Anh)", 
    "AQ Systems (Thụy Điển)", "Sewer Robotics (Hà Lan)", "CUES Inc (Mỹ)", "Alphacam"
  ];

  // Dynamic filter processing
  const filteredContracts = contracts.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || c.cat === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const ActiveValueIcon = coreValues[activeCoreIndex].icon;
  const ActiveFieldIcon = businessFields[activeFieldIndex].icon;

  return (
    <div className="pt-24 bg-white min-h-screen">
      {/* Visual Top Hero Banner */}
      <section className="relative py-24 bg-slate-950 overflow-hidden text-white border-b border-slate-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80" 
            alt="CIC Banner" 
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 text-orange-500 font-bold uppercase tracking-widest text-[10px]">
              Về chúng tôi
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none text-white">
              CÔNG TY CỔ PHẦN <br />
              <span className="text-orange-500">CÔNG NGHỆ VÀ TƯ VẤN CIC</span>
            </h1>
            <p className="text-base md:text-lg text-slate-300 font-medium leading-relaxed max-w-2xl">
              Thành lập từ năm 1990, tiền thân là Trung tâm Tin học thuộc Bộ Xây dựng. Hơn 35 năm tiên phong thúc đẩy chuyển đổi số và phát triển khoa học công nghệ cho các ngành kỹ thuật tại Việt Nam.
            </p>
          </div>
        </div>
      </section>

      {/* Modern Tab Menu Bar */}
      <div className="bg-white border-b border-slate-200 z-30 relative shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-1 md:space-x-8 overflow-x-auto scrollbar-hide py-1">
            {[
              { id: 'overview', label: 'Tổng quan doanh nghiệp' },
              { id: 'structure', label: 'Cơ cấu tổ chức' },
              { id: 'experience', label: 'Năng lực & Kinh nghiệm' }
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    window.scrollTo({ top: 320, behavior: 'smooth' });
                  }}
                  className={`relative px-4 py-4 text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap shrink-0 flex items-center gap-2 rounded-none ${
                    active 
                      ? 'text-orange-600' 
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {tab.id === 'overview' && <Building2 size={14} />}
                  {tab.id === 'structure' && <Users size={14} />}
                  {tab.id === 'experience' && <Award size={14} />}
                  {tab.label}
                  {active && (
                    <motion.div 
                      layoutId="activeAboutTabLine" 
                      className="absolute bottom-0 left-0 right-0 h-[3px] bg-orange-600"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Dynamic View Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        
        {/* ==================== 1. TỔNG QUAN DOANH NGHIỆP ==================== */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-20"
          >
            {/* History intro block */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-7 space-y-6">
                <div className="border-l-4 border-orange-600 pl-4">
                  <h2 className="text-2xl md:text-3xl font-black text-slate-950 uppercase tracking-tight">
                    MỘT CHẶNG ĐƯỜNG PHÁT TRIỂN <br />35 NĂM ĐẦY TỰ HÀO
                  </h2>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Từ 1990 - Nay</p>
                </div>
                
                <p className="text-slate-700 text-sm md:text-base font-medium leading-relaxed text-justify">
                  Công ty Cổ phần Công nghệ và Tư vấn CIC, tiền thân là <strong>Trung tâm Tin học thuộc Bộ Xây dựng</strong>, chính thức thành lập vào ngày <strong>27/11/1990</strong>. Đến ngày <strong>21/12/2006</strong>, thực hiện chủ trương cổ phần hóa doanh nghiệp nhà nước, Bộ trưởng Bộ Xây dựng đã ký <strong>Quyết định số 1765/QĐ-BXD</strong> chuyển đổi trung tâm thành Công ty Cổ phần Công nghệ và Tư vấn CIC.
                </p>
                <p className="text-slate-600 text-sm leading-relaxed text-justify">
                  Ra đời trong thời kỳ đất nước đổi mới và hội nhập, trải qua hơn 35 năm kiên trì nỗ lực, CIC đã bứt phá vươn lên thành <strong>1 trong 10 thành viên chính thức cốt lõi của Tổ hợp Tư vấn Xây dựng Việt Nam (VC Group)</strong> - tổ hợp tư vấn lớn mạnh hàng đầu đất nước. Với đội ngũ hơn 100 cán bộ nghiên cứu, thạc sĩ và kỹ sư trình độ vượt trội, CIC đã kiến tạo vị thế độc tôn vững chắc trong nghiên cứu phát triển phần mềm kỹ thuật nội địa, chuyển giao thiết bị khoa học công nghệ cao và nhập khẩu bản quyền phần mềm xây dựng chính hãng.
                </p>
                <p className="text-slate-600 text-sm leading-relaxed text-justify">
                  Sứ mệnh lớn nhất của chúng tôi là đem lại giải pháp công nghệ toàn diện và gia tăng giá trị tối đa cho các công trình, quy trình quản lý của khách hàng, đồng thời hài hòa lợi ích của quý cổ đông và không ngừng nâng cao đời sống cho tập thể cán bộ công nhân viên.
                </p>
              </div>

              <div className="lg:col-span-5 relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-amber-500 blur opacity-20 group-hover:opacity-35 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white border border-slate-200 p-2 overflow-hidden shadow-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80" 
                    alt="Engineering Infrastructure" 
                    className="w-full h-80 object-cover"
                  />
                  <div className="p-4 bg-slate-950 text-white text-center">
                    <span className="font-sans text-xl font-black text-orange-500">35+ NĂM</span>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Tiên phong cách mạng công nghệ kỹ thuật</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Legal Information block - Highly structured and styled */}
            <div className="space-y-6 pt-4">
              <div className="border-l-4 border-orange-600 pl-4">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">THÔNG TIN PHÁP LÝ & ĐĂNG KÝ DOANH NGHIỆP</h3>
                <p className="text-xs text-slate-500">Hồ sơ pháp lý chính thức của Công ty Cổ phần Công nghệ và Tư vấn CIC</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* HQ Box */}
                <div className="bg-slate-50 border border-slate-200/80 p-6 space-y-4 relative group hover:border-orange-600/30 transition-all">
                  <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                    <div className="w-10 h-10 bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                      <Building2 size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-sm uppercase text-slate-900">TRỤ SỞ CHÍNH HÀ NỘI</h4>
                      <p className="text-[10px] text-slate-500">Quyết định thành lập số 1765/QĐ-BXD ngày 21/12/2006</p>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs text-slate-600">
                    <p className="font-semibold text-slate-900 flex items-start gap-2">
                      <MapPin size={14} className="text-orange-600 shrink-0 mt-0.5" />
                      <span>Địa chỉ: 37 Lê Đại Hành - Quận Hai Bà Trưng - HN</span>
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-sans text-[11px] border-t border-slate-200/60 text-slate-500">
                      <div>
                        <span className="text-[9px] text-slate-400 font-sans font-bold uppercase block">Đăng ký KD số</span>
                        <span className="text-slate-900 font-bold">0100775353 (Thay đổi lần 3, 29/05/2013)</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-sans font-bold uppercase block">Mã số thuế</span>
                        <span className="text-slate-900 font-bold">01 0077 5353</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-sans font-bold uppercase block">Điện thoại</span>
                        <a href="tel:84439781" className="text-slate-900 hover:text-orange-600 font-bold">84.4.39.781 / 39.741.313</a>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-sans font-bold uppercase block">Fax</span>
                        <span className="text-slate-900">84.4.38.216.793</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-sans font-bold uppercase block">Tài khoản Ngân hàng</span>
                        <span className="text-slate-900 font-bold">120.10.00.001477.7</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-sans font-bold uppercase block">Tại ngân hàng</span>
                        <span className="text-slate-900 font-bold">Sở GD Ngân hàng ĐT&PT Việt Nam (BIDV)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Branch Box */}
                <div className="bg-slate-50 border border-slate-200/80 p-6 space-y-4 relative group hover:border-orange-600/30 transition-all">
                  <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                    <div className="w-10 h-10 bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-sm uppercase text-slate-900">CHI NHÁNH TP HỒ CHÍ MINH</h4>
                      <p className="text-[10px] text-slate-500">Quyết định thành lập số 939/QĐ-BXD ngày 13/07/2000</p>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs text-slate-600">
                    <p className="font-semibold text-slate-900 flex items-start gap-2">
                      <MapPin size={14} className="text-orange-600 shrink-0 mt-0.5" />
                      <span>Địa chỉ: 36 Nguyễn Huy Lượng - P.14 - Q.Bình Thạnh - Tp HCM</span>
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-sans text-[11px] border-t border-slate-200/60 text-slate-500">
                      <div>
                        <span className="text-[9px] text-slate-400 font-sans font-bold uppercase block">Điện thoại chi nhánh</span>
                        <a href="tel:84862899022" className="text-slate-900 hover:text-orange-600 font-bold">84.8.628.99.022 – 628.99.033</a>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-sans font-bold uppercase block">Fax chi nhánh</span>
                        <span className="text-slate-900">84.8.628.99.033</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-sans font-bold uppercase block">Email liên hệ</span>
                        <a href="mailto:cichcm@cic.com.vn" className="text-slate-900 hover:text-orange-600 font-bold font-mono">cichcm@cic.com.vn</a>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-sans font-bold uppercase block">Website chính thức</span>
                        <a href="http://www.cic.com.vn" target="_blank" rel="noreferrer" className="text-slate-900 hover:text-orange-600 font-bold underline">www.cic.com.vn</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mission & Vision Bento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <div className="bg-slate-50 border border-slate-200/80 p-8 space-y-4 relative overflow-hidden group hover:border-orange-600/50 transition-all duration-300">
                <div className="w-12 h-12 bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  <Target size={24} />
                </div>
                <h3 className="text-xl font-black text-slate-950 uppercase tracking-tight">SỨ MỆNH CHIẾN LƯỢC</h3>
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed text-justify font-medium">
                  “Cung cấp những sản phẩm phần mềm, thiết bị, dịch vụ công nghệ thông tin hiện đại, có tính ứng dụng cao để hỗ trợ các kỹ sư, doanh nghiệp, cơ quan nghiên cứu, các nhà quản lý trong công tác nghiên cứu, sản xuất, điều hành tại Việt Nam và các nước trong khu vực; đồng thời không ngừng phát triển nhằm góp phần vào sự hội nhập và phát triển chung của đất nước, đem lại thu nhập cao ổn định cho cán bộ công nhân viên cũng như hài hoà với lợi ích của cổ đông”.
                </p>
                <div className="absolute right-0 bottom-0 w-24 h-24 bg-orange-600/5 blur-xl pointer-events-none group-hover:bg-orange-600/10 transition-colors"></div>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 p-8 space-y-4 relative overflow-hidden group hover:border-orange-600/50 transition-all duration-300">
                <div className="w-12 h-12 bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  <Eye size={24} />
                </div>
                <h3 className="text-xl font-black text-slate-950 uppercase tracking-tight">TẦM NHÌN PHÁT TRIỂN</h3>
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed text-justify font-medium">
                  “Trở thành nhà cung cấp hàng đầu về các giải pháp ứng dụng công nghệ ICT và khoa học công nghệ khác cho các ngành kỹ thuật tại Việt Nam và các nước trong khu vực”, chúng tôi liên tục nâng cao chất lượng và mở rộng các mảng sản phẩm, dịch vụ của mình nhằm đáp ứng tốt nhất nhu cầu của khách hàng.
                </p>
                <div className="absolute right-0 bottom-0 w-24 h-24 bg-orange-600/5 blur-xl pointer-events-none group-hover:bg-orange-600/10 transition-colors"></div>
              </div>
            </div>

            {/* REDESIGNED VALUE: Core Values - Interactive Layout (Alternating horizontal flow instead of repetitive grid) */}
            <div className="space-y-8 pt-8 border-t border-slate-100">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <h2 className="text-3xl font-black text-slate-950 uppercase tracking-tight">GIÁ TRỊ CỐT LÕI</h2>
                <p className="text-xs text-orange-600 font-bold uppercase tracking-widest">Không gian văn hóa và nền tảng phát triển của CIC</p>
                <div className="w-12 h-1 bg-orange-600 mx-auto mt-2"></div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
                {/* Left Side: Dynamic Display Panel */}
                <div className="lg:col-span-5 bg-slate-950 text-white p-8 flex flex-col justify-between relative overflow-hidden border border-slate-900 shadow-xl">
                  <div className="absolute right-0 top-0 w-48 h-48 bg-orange-600/10 blur-3xl"></div>
                  
                  <div className="space-y-6 relative z-10">
                    <div className="flex justify-between items-center">
                      <span className="font-sans text-xs font-black tracking-widest text-orange-500 uppercase bg-white/10 px-2.5 py-1">
                        Giá trị {(activeCoreIndex + 1).toString().padStart(2, '0')}
                      </span>
                      <ActiveValueIcon className="text-orange-500 w-8 h-8 animate-pulse" />
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeCoreIndex}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 15 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <h3 className="text-2xl font-black uppercase text-white tracking-tight leading-none">
                          {coreValues[activeCoreIndex].title}
                        </h3>
                        <p className="text-slate-300 text-sm leading-relaxed text-justify font-medium">
                          {coreValues[activeCoreIndex].desc}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className="pt-8 border-t border-white/10 mt-6 relative z-10 flex gap-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">CIC Corporate Ethics Code</span>
                  </div>
                </div>

                {/* Right Side: Interactive List */}
                <div className="lg:col-span-7 flex flex-col justify-center space-y-3">
                  {coreValues.map((val, i) => {
                    const isActive = activeCoreIndex === i;
                    const IconComp = val.icon;
                    return (
                      <button
                        key={i}
                        onClick={() => setActiveCoreIndex(i)}
                        className={`w-full text-left p-4 rounded-none border transition-all duration-300 flex items-center justify-between group ${
                          isActive 
                            ? 'bg-orange-50 border-orange-600 shadow-md translate-x-2' 
                            : 'bg-white border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <span className={`font-sans text-sm font-black transition-colors ${
                            isActive ? 'text-orange-600' : 'text-slate-300 group-hover:text-slate-500'
                          }`}>
                            {(i + 1).toString().padStart(2, '0')}
                          </span>
                          <div className={`p-2 transition-all ${
                            isActive ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-500'
                          }`}>
                            <IconComp size={16} />
                          </div>
                          <span className={`font-black text-xs md:text-sm uppercase tracking-tight transition-all ${
                            isActive ? 'text-orange-700' : 'text-slate-700 group-hover:text-slate-900'
                          }`}>
                            {val.title}
                          </span>
                        </div>
                        <ChevronRight 
                          size={16} 
                          className={`transition-transform duration-300 ${
                            isActive ? 'text-orange-600 translate-x-1' : 'text-slate-300 group-hover:text-slate-500'
                          }`} 
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* REDESIGNED VALUE: Lĩnh vực hoạt động - Interactively Categorized Split Showcase */}
            <div className="space-y-10 pt-10 border-t border-slate-100">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <h2 className="text-3xl font-black text-slate-950 uppercase tracking-tight">LĨNH VỰC HOẠT ĐỘNG CHỦ CHỐT</h2>
                <p className="text-xs text-orange-600 font-bold uppercase tracking-widest">Hệ sinh thái giải pháp khoa học công nghệ & dịch vụ tư vấn toàn diện</p>
                <div className="w-12 h-1 bg-orange-600 mx-auto mt-2"></div>
              </div>

              {/* High-End 3 Strategic Pillars Selector Card Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {businessPillars.map((pillar, i) => {
                  const isActive = activePillarIndex === i;
                  const IconComp = pillar.icon;
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setActivePillarIndex(i);
                        // Reset field index to first item of this pillar
                        const firstFieldId = pillar.fieldIds[0];
                        const foundIdx = businessFields.findIndex(f => f.id === firstFieldId);
                        if (foundIdx !== -1) setActiveFieldIndex(foundIdx);
                      }}
                      className={`text-left p-6 border transition-all duration-300 relative overflow-hidden flex flex-col justify-between group ${
                        isActive 
                          ? pillar.activeColor + ' shadow-lg translate-y-[-4px]' 
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 hover:translate-y-[-2px]'
                      }`}
                    >
                      {/* Top line accent */}
                      <div className={`absolute top-0 left-0 right-0 h-1 transition-all ${
                        isActive ? pillar.accentBg : 'bg-transparent group-hover:bg-slate-300'
                      }`} />

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div className={`p-3 text-white inline-block ${pillar.accentBg}`}>
                            <IconComp size={20} />
                          </div>
                          <span className="font-sans text-xs font-black text-slate-300">
                            TRỤ CỘT 0{i + 1}
                          </span>
                        </div>
                        
                        <h3 className="font-black text-sm uppercase tracking-tight text-slate-900 leading-snug group-hover:text-orange-600 transition-colors">
                          {pillar.title}
                        </h3>
                        <p className="text-slate-500 text-xs leading-relaxed font-medium line-clamp-2">
                          {pillar.subtitle}
                        </p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                          {pillar.fieldIds.length} Lĩnh vực hoạt động
                        </span>
                        <ChevronRight 
                          size={14} 
                          className={`transition-transform duration-300 ${
                            isActive ? 'text-orange-600 translate-x-1' : 'text-slate-300 group-hover:text-slate-500'
                          }`}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Active Pillar Workspace - Asymmetric Presentation */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePillarIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
                >
                  {/* Left Side: Dark-themed Pillar Spotlight Card */}
                  <div className="lg:col-span-4 bg-slate-950 text-white p-8 flex flex-col justify-between relative overflow-hidden border border-slate-900 shadow-xl">
                    <div className="absolute right-0 top-0 w-48 h-48 bg-orange-600/10 blur-3xl rounded-full"></div>
                    <div className="absolute left-[-20%] bottom-[-20%] w-64 h-64 bg-blue-600/5 blur-3xl rounded-full"></div>

                    <div className="space-y-6 relative z-10">
                      <div>
                        <span className="font-sans text-[10px] font-black tracking-widest text-orange-500 uppercase bg-orange-500/10 border border-orange-500/20 px-2.5 py-1">
                          Trụ cột chiến lược
                        </span>
                        <h3 className="text-2xl font-black uppercase tracking-tight leading-tight mt-3 text-white">
                          {businessPillars[activePillarIndex].title}
                        </h3>
                      </div>

                      <p className="text-slate-400 text-xs leading-relaxed text-justify font-medium">
                        {businessPillars[activePillarIndex].subtitle}
                      </p>

                      <div className="space-y-3.5 pt-4">
                        <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest block border-b border-white/10 pb-1.5">
                          Đặc điểm nổi bật
                        </span>
                        {businessPillars[activePillarIndex].highlights.map((highlight, hIdx) => (
                          <div key={hIdx} className="flex items-start gap-2.5 text-xs">
                            <span className="p-0.5 bg-orange-600/20 border border-orange-500/30 text-orange-500 shrink-0 mt-0.5">
                              <CheckCircle2 size={10} />
                            </span>
                            <span className="text-slate-300 font-semibold leading-relaxed">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-8 border-t border-white/10 mt-8 relative z-10 flex justify-between items-center">
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">CIC Ecosystem Guide</span>
                      <span className="font-sans text-xs text-orange-500 font-black">0{activePillarIndex + 1} / 03</span>
                    </div>
                  </div>

                  {/* Right Side: High-Impact List of Business Fields */}
                  <div className="lg:col-span-8 space-y-6">
                    {businessFields
                      .filter(field => businessPillars[activePillarIndex].fieldIds.includes(field.id))
                      .map((field, fIdx) => {
                        const FieldIcon = field.icon;
                        return (
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: fIdx * 0.1, duration: 0.3 }}
                            key={field.id}
                            className="bg-slate-50 border border-slate-200 hover:border-slate-300 p-6 flex flex-col md:flex-row gap-6 relative group transition-all"
                          >
                            {/* Giant field number overlay */}
                            <div className="absolute top-4 right-4 font-sans text-5xl font-black text-slate-200/50 group-hover:text-slate-200 pointer-events-none select-none transition-colors">
                              {field.id}
                            </div>

                            {/* Left part: Title & Description */}
                            <div className="flex-1 space-y-3 relative z-10">
                              <div className="flex items-center gap-3">
                                <div className={`p-2.5 text-white shrink-0 ${businessPillars[activePillarIndex].accentBg}`}>
                                  <FieldIcon size={16} />
                                </div>
                                <div>
                                  <span className="font-sans text-[10px] font-black text-slate-400">LĨNH VỰC KHAI THÁC {field.id}</span>
                                  <h4 className="font-black text-sm uppercase tracking-tight text-slate-900 mt-0.5">
                                    {field.title}
                                  </h4>
                                </div>
                              </div>

                              <p className="text-slate-600 text-xs leading-relaxed text-justify font-medium">
                                {field.desc}
                              </p>
                            </div>

                            {/* Right part: Technologies & Products */}
                            <div className="md:w-72 shrink-0 bg-white border border-slate-200/80 p-4 space-y-3 relative z-10 flex flex-col justify-between">
                              <div className="space-y-2">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block border-b border-slate-100 pb-1">
                                  Sản phẩm & Giải pháp tiêu biểu
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {field.techs.map((tech, tIdx) => (
                                    <span
                                      key={tIdx}
                                      className="px-2 py-0.5 bg-slate-100 hover:bg-orange-50 border border-slate-200 hover:border-orange-200/50 text-[10px] font-bold font-sans text-slate-700 transition-colors"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="text-[9px] text-slate-400 font-medium italic border-t border-slate-50 pt-1">
                                *Phân phối, chuyển giao chính thức bởi CIC.
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* ==================== 2. CƠ CẤU TỔ CHỨC ==================== */}
        {activeTab === 'structure' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-16"
          >
            {/* Structural Banner */}
            <div className="border-l-4 border-orange-600 pl-4">
              <h2 className="text-2xl md:text-3xl font-black text-slate-950 uppercase tracking-tight">
                SƠ ĐỒ CƠ CẤU TỔ CHỨC DOANH NGHIỆP
              </h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Hệ thống quản trị chuyên nghiệp - Linh hoạt - Kết nối liên thông</p>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed max-w-4xl text-justify font-medium">
              Cơ cấu tổ chức của Công ty Cổ phần Công nghệ và Tư vấn CIC được thiết kế theo mô hình quản trị công ty cổ phần hiện đại, bảo đảm tính minh bạch, độc lập giám sát và vận hành thông suốt giữa các bộ phận chuyên môn. Đội ngũ hơn 100 CBCNV có trình độ cao được dẫn dắt bởi ban lãnh đạo bản lĩnh và nhiệt huyết.
            </p>

            {/* flowchart block using pure CSS cards */}
            <div className="space-y-10">
              {/* Level 1: Shareholders */}
              <div className="flex justify-center">
                <div className="bg-slate-950 text-white p-6 border-2 border-orange-600 max-w-sm w-full text-center relative shadow-xl">
                  <span className="text-[10px] uppercase font-black tracking-widest text-orange-500">Cấp Quyết định cao nhất</span>
                  <h3 className="font-black text-base uppercase tracking-tight pt-1">ĐẠI HỘI ĐỒNG CỔ ĐÔNG</h3>
                  <p className="text-[10px] text-slate-400 mt-2">Bao gồm toàn bộ các cổ đông có quyền biểu quyết, quyết định các định hướng chiến lược lớn.</p>
                </div>
              </div>

              {/* Connecting vertical line */}
              <div className="flex justify-center">
                <div className="w-0.5 h-8 bg-slate-200"></div>
              </div>

              {/* Level 2: Board & Supervisor group */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="bg-white border-2 border-slate-900 p-6 relative shadow-lg text-center">
                  <span className="text-[10px] uppercase font-black tracking-widest text-orange-600">Ban quản trị</span>
                  <h3 className="font-black text-base uppercase tracking-tight text-slate-950 pt-1">HỘI ĐỒNG QUẢN TRỊ</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">Cơ quan quản lý công ty, có toàn quyền nhân danh công ty để quyết định mọi vấn đề liên quan tới mục đích hoạt động.</p>
                </div>

                <div className="bg-slate-50 border border-dashed border-slate-300 p-6 relative shadow-md text-center">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Ban kiểm soát độc lập</span>
                  <h3 className="font-black text-base uppercase tracking-tight text-slate-900 pt-1">BAN KIỂM SOÁT</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">Giám sát các hoạt động của Hội đồng quản trị và Ban giám đốc nhằm đảm bảo quyền lợi tối cao cho cổ đông.</p>
                </div>
              </div>

              {/* Connecting vertical line */}
              <div className="flex justify-center">
                <div className="w-0.5 h-8 bg-slate-200"></div>
              </div>

              {/* Level 3: Ban Giám Đốc */}
              <div className="flex justify-center">
                <div className="bg-orange-600 text-white p-6 max-w-md w-full text-center relative shadow-xl">
                  <span className="text-[10px] uppercase font-black tracking-widest text-white/80">Cấp Điều hành</span>
                  <h3 className="font-black text-lg uppercase tracking-tight pt-1">BAN GIÁM ĐỐC ĐIỀU HÀNH</h3>
                  <p className="text-xs text-white/90 mt-2 leading-relaxed">Chịu trách nhiệm tổ chức triển khai hoạt động kinh doanh, kỹ thuật và quản lý vận hành thường nhật của Công ty.</p>
                </div>
              </div>

              {/* Connecting vertical line */}
              <div className="flex justify-center">
                <div className="w-0.5 h-10 bg-slate-200"></div>
              </div>
            </div>

            {/* Human Resources Detailed Table with gorgeous progress ratios */}
            <div className="space-y-6 pt-4">
              <div className="border-l-4 border-orange-600 pl-4">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">BẢNG CƠ CẤU NHÂN SỰ CHI TIẾT THEO PHÒNG BAN</h3>
                <p className="text-xs text-slate-500">Tổng quy mô nhân sự: 106 cán bộ (Trình độ: Đại học chiếm 70.7%, Trên Đại học chiếm 17.9%)</p>
              </div>

              <div className="overflow-x-auto border border-slate-200 shadow-sm">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white font-black uppercase tracking-wider text-[10px]">
                      <th className="py-4 px-4 text-center border-b border-slate-800">STT</th>
                      <th className="py-4 px-5 border-b border-slate-800">Bộ phận / Trung tâm chuyên môn</th>
                      <th className="py-4 px-4 text-center border-b border-slate-800">Tổng Số người</th>
                      <th className="py-4 px-4 text-center border-b border-slate-800">Nhân viên / Khác</th>
                      <th className="py-4 px-4 text-center border-b border-slate-800">Đại học</th>
                      <th className="py-4 px-4 text-center border-b border-slate-800">Trên Đại học</th>
                      <th className="py-4 px-6 text-center border-b border-slate-800">Tỷ lệ Trình độ chuyên môn</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {hrData.map((dept, idx) => {
                      const IconComp = dept.icon;
                      const postPercent = dept.total > 0 ? (dept.postDh / dept.total) * 100 : 0;
                      const uPercent = dept.total > 0 ? (dept.dh / dept.total) * 100 : 0;
                      return (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-400">{dept.stt.toString().padStart(2, '0')}</td>
                          <td className="py-3.5 px-5 font-black text-slate-900 flex items-center gap-2.5">
                            <span className="p-1 bg-slate-100 text-orange-600 rounded">
                              <IconComp size={14} />
                            </span>
                            <span>{dept.name}</span>
                          </td>
                          <td className="py-3.5 px-4 text-center font-bold font-mono text-orange-600 text-sm bg-orange-50/20">{dept.total}</td>
                          <td className="py-3.5 px-4 text-center font-mono">{dept.nv || '-'}</td>
                          <td className="py-3.5 px-4 text-center font-mono font-semibold text-slate-900">{dept.dh || '-'}</td>
                          <td className="py-3.5 px-4 text-center font-mono font-semibold text-orange-600">{dept.postDh || '-'}</td>
                          <td className="py-3.5 px-6">
                            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex">
                              {dept.postDh > 0 && (
                                <div 
                                  style={{ width: `${postPercent}%` }} 
                                  title={`Trên Đại học: ${postPercent.toFixed(0)}%`}
                                  className="bg-orange-600 h-full"
                                />
                              )}
                              {dept.dh > 0 && (
                                <div 
                                  style={{ width: `${uPercent}%` }} 
                                  title={`Đại học: ${uPercent.toFixed(0)}%`}
                                  className="bg-slate-950 h-full"
                                />
                              )}
                              {dept.nv > 0 && (
                                <div 
                                  style={{ width: `${100 - postPercent - uPercent}%` }} 
                                  title="Khác"
                                  className="bg-slate-400 h-full"
                                />
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {/* Grand Total Row */}
                    <tr className="bg-slate-100 font-bold border-t-2 border-slate-300">
                      <td className="py-4 px-4 text-center"></td>
                      <td className="py-4 px-5 text-slate-950 text-xs font-black uppercase">TỔNG CỘNG NHÂN SỰ</td>
                      <td className="py-4 px-4 text-center font-mono text-orange-600 font-black text-base">106</td>
                      <td className="py-4 px-4 text-center font-mono text-slate-950">01</td>
                      <td className="py-4 px-4 text-center font-mono text-slate-950">75</td>
                      <td className="py-4 px-4 text-center font-mono text-orange-600">19</td>
                      <td className="py-4 px-6 text-slate-400 text-[10px] uppercase font-bold text-center">
                        75 ĐH (70.7%) | 19 Trên ĐH (17.9%)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quality Human Resources policy highlight */}
            <div className="bg-slate-50 border border-slate-200 p-8 flex flex-col lg:flex-row gap-8 items-center mt-12">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                <Heart size={32} />
              </div>
              <div className="space-y-2 flex-1">
                <h4 className="font-black text-slate-950 uppercase tracking-tight text-base">CHÍNH SÁCH KHUYẾN KHÍCH - HÀI HÒA & ĐOÀN KẾT NỘI BỘ</h4>
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed text-justify font-medium">
                  CIC luôn ưu tiên đảm bảo chính sách chăm lo chu đáo cho toàn thể cán bộ nhân viên thông qua chế độ đãi ngộ vượt trội, tạo không gian sáng tạo và cơ chế khen thưởng định kỳ. Chúng tôi đặt mục tiêu hài hòa hóa lợi ích cá nhân của cán bộ nhân viên cùng với lợi ích lâu dài của doanh nghiệp, của cổ đông và của khách hàng.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ==================== 3. NĂNG LỰC & KINH NGHIỆM ==================== */}
        {activeTab === 'experience' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-20"
          >
            {/* Experience Banner */}
            <div className="border-l-4 border-orange-600 pl-4">
              <h2 className="text-2xl md:text-3xl font-black text-slate-950 uppercase tracking-tight">
                NĂNG LỰC KỸ THUẬT & KINH NGHIỆM THỰC TIỄN
              </h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Được chứng minh vững chắc qua chặng đường 35 năm phục vụ thị trường kỹ thuật Việt Nam</p>
            </div>

            {/* REDESIGNED: BẢNG VÀNG THÀNH TÍCH (Sự thật ấn tượng - Highly Styled Glassmorphism Bento Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-slate-950 text-white p-8 border border-slate-900 shadow-2xl relative overflow-hidden">
              <div className="absolute right-0 top-0 w-96 h-96 bg-orange-600/5 blur-3xl rounded-full pointer-events-none"></div>
              <div className="absolute left-0 bottom-0 w-96 h-96 bg-blue-600/5 blur-3xl rounded-full pointer-events-none"></div>

              {[
                { 
                  count: "35+", 
                  title: "Năm liên tục phát triển", 
                  desc: "Kiến tạo nền móng số từ năm 1990, đặt dấu ấn công nghệ lên hàng vạn công trình quốc gia." 
                },
                { 
                  count: "106", 
                  title: "Nhân sự tinh hoa", 
                  desc: "Đội ngũ chuyên gia đầu ngành, Thạc sĩ, Kỹ sư xuất sắc làm chủ quy trình BIM và chuyển giao công nghệ." 
                },
                { 
                  count: "10,000+", 
                  title: "Doanh nghiệp đồng hành", 
                  desc: "Mạng lưới đối tác đồ sộ gồm các tập đoàn đa quốc gia, tổng công ty xây dựng và ban quản lý dự án nhà nước." 
                },
                { 
                  count: "Top 10", 
                  title: "Trụ cột VC Group", 
                  desc: "Thành viên sáng lập Tổ hợp Tư vấn Xây dựng lớn nhất Việt Nam (Bộ Xây dựng), dẫn dắt năng lực quốc gia." 
                }
              ].map((stat, i) => (
                <div key={i} className="text-center md:text-left space-y-3 p-4 border border-white/5 hover:border-orange-500/30 hover:bg-white/5 transition-all relative group">
                  <div className="text-4xl md:text-5xl font-black text-orange-500 font-mono tracking-tight group-hover:scale-105 transition-transform duration-300">
                    {stat.count}
                  </div>
                  <div className="text-xs font-black uppercase tracking-wider text-slate-200 border-b border-orange-500/20 pb-1.5">
                    {stat.title}
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed font-medium">
                    {stat.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* HIGH-FIDELITY INTERACTIVE TECH DASHBOARD: Năng lực chuyên môn tích lũy */}
            <div className="space-y-8">
              <div className="border-l-4 border-orange-600 pl-4">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">CƠ CẤU NĂNG LỰC CHUYÊN MÔN CHUẨN MỰC</h3>
                <p className="text-xs text-orange-600 font-bold uppercase tracking-widest mt-1">Hồ sơ kỹ thuật & Hệ giá trị năng lực tích lũy qua 35 năm</p>
              </div>

              {/* Master Blueprint Design Board Container */}
              <div className="bg-white border-2 border-slate-900 shadow-2xl overflow-hidden relative">
                
                {/* Drafting Header Metadata Block */}
                <div className="bg-slate-900 text-slate-100 p-4 px-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 relative z-10">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                    <span className="font-mono text-[10px] md:text-xs font-black tracking-widest uppercase text-slate-300">
                      TECHNICAL DRAWING // CORE_CAPABILITIES_SPECIFICATION // REF: CIC_35Y_MASTER
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 font-mono text-[9px] text-slate-400">
                    <span className="border border-slate-800 px-2 py-0.5">SCALE: MASTER_LEVEL</span>
                    <span className="border border-slate-800 px-2 py-0.5">EST: 1990</span>
                    <span className="border border-slate-800 px-2 py-0.5 text-orange-400">STATUS: VERIFIED</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                  
                  {/* LEFT COLUMN: Vertical Control Axis & Index (lg:col-span-5) */}
                  <div className="lg:col-span-5 bg-slate-950 flex flex-col justify-between border-r border-slate-900 relative">
                    {/* Architectural Grid overlay background */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#111827_1px,transparent_1px),linear-gradient(to_bottom,#111827_1px,transparent_1px)] bg-[size:20px_20px] opacity-35 pointer-events-none" />
                    
                    <div className="p-6 space-y-4 relative z-10 flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-900">
                          <span className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest">Danh mục phân mảng</span>
                          <span className="text-[9px] font-mono text-orange-500 font-bold">SELECT TO DEPLOY PROFILE</span>
                        </div>

                        {/* Interactive list designed like blueprint drawing selectors */}
                        <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1 scrollbar-hide">
                          {capDetails.map((cap, idx) => {
                            const isActive = activeCapIndex === idx;
                            const IconComp = cap.icon;
                            return (
                              <button
                                key={idx}
                                onClick={() => setActiveCapIndex(idx)}
                                className={`w-full text-left p-3.5 transition-all duration-300 flex items-center justify-between relative group border-b border-slate-900/60 ${
                                  isActive 
                                    ? 'bg-orange-600/10 border-l-4 border-l-orange-500 text-white' 
                                    : 'hover:bg-slate-900/40 border-l-4 border-l-transparent text-slate-400 hover:text-slate-200'
                                }`}
                              >
                                <div className="flex items-center gap-3 truncate">
                                  <span className={`font-mono text-[10px] ${isActive ? 'text-orange-500 font-black' : 'text-slate-600'}`}>
                                    0{idx + 1}.
                                  </span>
                                  <div className="truncate space-y-0.5">
                                    <div className={`text-[11px] font-black uppercase tracking-wide truncate ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                                      {cap.tag}
                                    </div>
                                    <div className="text-[9px] text-slate-500 truncate font-semibold">
                                      {experienceYears[idx].title}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2.5 shrink-0 ml-2">
                                  <span className="font-mono text-[9px] px-1.5 py-0.5 bg-slate-900 border border-slate-800 text-orange-500 font-bold">
                                    {experienceYears[idx].years}Y
                                  </span>
                                  <div className={`p-1.5 transition-colors ${isActive ? 'text-orange-500 bg-orange-950/40' : 'text-slate-600 bg-slate-900'}`}>
                                    <IconComp size={12} />
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Side axis description footer */}
                      <div className="pt-4 mt-6 border-t border-slate-900 flex items-center justify-between text-[9px] font-mono text-slate-500">
                        <span>DATA_SOURCE: REGISTRY_STAMP</span>
                        <span>UPDATE: Q3/2026</span>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: The Drafting Sheet Canvas (lg:col-span-7) */}
                  <div className="lg:col-span-7 bg-white p-6 md:p-8 flex flex-col justify-between relative overflow-hidden">
                    {/* Blueprint framing coordinates (A1, B2 labels in corner) */}
                    <div className="absolute top-2 left-3 font-mono text-[8px] text-slate-300 pointer-events-none select-none font-bold">ZONE A-{activeCapIndex + 1}</div>
                    <div className="absolute top-2 right-3 font-mono text-[8px] text-slate-300 pointer-events-none select-none font-bold">GRID REF: {100 + activeCapIndex * 12}</div>
                    <div className="absolute bottom-2 left-3 font-mono text-[8px] text-slate-300 pointer-events-none select-none font-bold">SCALE 1:1</div>
                    <div className="absolute bottom-2 right-3 font-mono text-[8px] text-slate-300 pointer-events-none select-none font-bold">CIC_DRAW_SHEET</div>

                    {/* Double technical borders */}
                    <div className="border-double border-4 border-slate-100 p-5 md:p-6 h-full flex flex-col justify-between space-y-6 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:12px_12px]">
                      
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeCapIndex}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.25 }}
                          className="space-y-6 flex-1 flex flex-col justify-between"
                        >
                          {/* Heading with Code reference */}
                          <div className="space-y-1.5 border-b border-slate-200 pb-4">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-[9px] font-black text-orange-600 uppercase tracking-widest bg-orange-50 px-2 py-0.5 border border-orange-200/50">
                                PROFILE_ID: CAP_CODE_0{activeCapIndex + 1}
                              </span>
                              <span className="font-mono text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 border border-blue-200/50">
                                KINH NGHIỆM TÍCH LŨY: {experienceYears[activeCapIndex].years} NĂM
                              </span>
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-600" />
                              <span className="font-mono text-[9px] text-slate-400 uppercase tracking-wider">Hồ sơ năng lực thực thi chuyên sâu</span>
                            </div>
                            <h4 className="text-lg md:text-xl font-black text-slate-900 leading-tight uppercase tracking-tight">
                              {experienceYears[activeCapIndex].title}
                            </h4>
                          </div>

                          {/* Technical specification matrix table */}
                          <div className="border border-slate-200 divide-y divide-slate-200 bg-white text-xs">
                            
                            <div className="grid grid-cols-1 md:grid-cols-12 items-stretch min-h-[44px]">
                              <div className="md:col-span-4 bg-slate-50 px-4 py-2.5 font-mono text-[9px] font-black text-slate-500 uppercase tracking-wider flex items-center border-r border-slate-200">
                                Lĩnh vực cốt lõi
                              </div>
                              <div className="md:col-span-8 px-4 py-2.5 font-semibold text-slate-700 flex items-center leading-relaxed">
                                {capDetails[activeCapIndex].tag}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 items-stretch min-h-[44px]">
                              <div className="md:col-span-4 bg-slate-50 px-4 py-2.5 font-mono text-[9px] font-black text-slate-500 uppercase tracking-wider flex items-center border-r border-slate-200">
                                Kinh nghiệm tích lũy
                              </div>
                              <div className="md:col-span-8 px-4 py-2.5 font-bold text-orange-600 flex items-center leading-relaxed gap-2">
                                <Clock size={14} className="text-orange-500 shrink-0" />
                                <span>{experienceYears[activeCapIndex].years} Năm liên tục tích lũy & vận hành phát triển</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 items-stretch min-h-[44px]">
                              <div className="md:col-span-4 bg-slate-50 px-4 py-2.5 font-mono text-[9px] font-black text-slate-500 uppercase tracking-wider flex items-center border-r border-slate-200">
                                Dự án & Đối tác tiêu biểu
                              </div>
                              <div className="md:col-span-8 px-4 py-2.5 font-bold text-slate-800 flex items-center leading-relaxed">
                                {capDetails[activeCapIndex].projects}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 items-stretch min-h-[44px]">
                              <div className="md:col-span-4 bg-slate-50 px-4 py-2.5 font-mono text-[9px] font-black text-slate-500 uppercase tracking-wider flex items-center border-r border-slate-200">
                                Lực lượng chuyên gia
                              </div>
                              <div className="md:col-span-8 px-4 py-2.5 text-slate-600 flex items-center leading-relaxed font-semibold">
                                {capDetails[activeCapIndex].team}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 items-stretch min-h-[44px]">
                              <div className="md:col-span-4 bg-slate-50 px-4 py-2.5 font-mono text-[9px] font-black text-slate-500 uppercase tracking-wider flex items-center border-r border-slate-200">
                                Tiêu chuẩn chất lượng
                              </div>
                              <div className="md:col-span-8 px-4 py-2.5 text-slate-600 flex items-center leading-relaxed font-medium">
                                {capDetails[activeCapIndex].standards}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 items-stretch min-h-[44px]">
                              <div className="md:col-span-4 bg-slate-50 px-4 py-2.5 font-mono text-[9px] font-black text-slate-500 uppercase tracking-wider flex items-center border-r border-slate-200">
                                Công cụ & Công nghệ cốt lõi
                              </div>
                              <div className="md:col-span-8 px-4 py-2.5 text-slate-800 font-mono text-[10px] font-bold flex items-center leading-relaxed bg-orange-50/10">
                                {capDetails[activeCapIndex].tech}
                              </div>
                            </div>

                          </div>

                          {/* Full Descriptive Text & Seal Section */}
                          <div className="flex flex-col md:flex-row gap-6 items-center justify-between pt-4 border-t border-slate-200/60">
                            <p className="flex-1 text-slate-500 text-[11px] md:text-xs leading-relaxed text-justify font-medium">
                              {capDetails[activeCapIndex].desc}
                            </p>

                            {/* Authentic blueprint ink seal/approval box */}
                            <div className="shrink-0 w-36 h-20 border-2 border-dashed border-orange-600/60 p-2 text-center flex flex-col justify-between select-none rotate-2 hover:rotate-0 transition-transform duration-300 bg-orange-50/20">
                              <span className="text-[8px] font-mono text-orange-600/80 font-bold block uppercase tracking-wider">CIC APPROVED SEAL</span>
                              <div className="h-[1px] bg-orange-600/20" />
                              <span className="text-[10px] font-black text-orange-600 block uppercase tracking-widest font-mono">SECURE_LEVEL</span>
                              <div className="text-[9px] font-mono text-slate-500 font-bold">REG_NO: #00{activeCapIndex + 1}</div>
                            </div>
                          </div>

                        </motion.div>
                      </AnimatePresence>

                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* BRAND-NEW SECTION: DỰ ÁN TRỌNG ĐIỂM QUỐC GIA (The Ultimate Flex!) */}
            <div className="space-y-8 pt-8 border-t border-slate-100">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <h2 className="text-3xl font-black text-slate-950 uppercase tracking-tight">HỒ SƠ DỰ ÁN TIÊU BIỂU</h2>
                <p className="text-xs text-orange-600 font-bold uppercase tracking-widest">Minh chứng năng lực kỹ thuật đỉnh cao được chứng thực thực tế</p>
                <div className="w-12 h-1 bg-orange-600 mx-auto mt-2"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    client: "Tập đoàn Vinhomes",
                    project: "Siêu đô thị Vinhomes Ocean Park & Smart City",
                    tech: "Plaxis, CSI Structural Analysis",
                    desc: "Cung cấp giải pháp phân tích địa kỹ thuật phức tạp và tính toán kết cấu nền móng cao tầng, bảo đảm an toàn tuyệt đối cho các tòa tháp biểu tượng.",
                    badge: "Siêu Dự Án",
                    year: "2018 - 2022"
                  },
                  {
                    client: "Daewoo E&C (Hàn Quốc)",
                    project: "Tổ hợp Starlake Tây Hồ Tây (K8CT1)",
                    tech: "Mô hình số hóa BIM 3D/5D",
                    desc: "Tư vấn thiết lập quy trình, quy chuẩn và trực tiếp triển khai mô hình BIM (3D/5D) phục vụ quản lý xung đột thiết kế và bóc tách khối lượng tự động.",
                    badge: "BIM Quốc Tế",
                    year: "2023"
                  },
                  {
                    client: "Học viện Tòa án (Tòa án Tối cao)",
                    project: "Nâng cao năng lực dạy học số hóa",
                    tech: "Datacenter & Server System",
                    desc: "Triển khai lắp đặt trọn gói hệ thống phòng máy chủ dữ liệu chuyên dụng, hạ tầng mạng truyền thông bảo mật cao và phần mềm quản lý đào tạo đồng bộ.",
                    badge: "Hạ Tầng ICT",
                    year: "2016"
                  },
                  {
                    client: "Tập đoàn Bitexco",
                    project: "Khảo sát năng lượng gió quốc gia",
                    tech: "Hệ thống Lidar ZX300 tầm xa",
                    desc: "Chuyển giao và hướng dẫn vận hành hệ thống đo gió tự động tầm xa Lidar ZX300 hiện đại nhất phục vụ các dự án nghiên cứu tiền khả thi điện gió ngoài khơi.",
                    badge: "Năng Lượng Sạch",
                    year: "2021"
                  },
                  {
                    client: "Viện Vật lý Địa cầu",
                    project: "Mạng lưới quan trắc địa chấn quốc gia",
                    tech: "DMT Summit M Vipa (Đức)",
                    desc: "Cung cấp hệ thống 8 bộ thiết bị ghi địa chấn chuyên sâu của hãng DMT phục vụ công tác giám sát, phân tích chuyển động đới đứt gãy kiến tạo địa chất phức tạp.",
                    badge: "Địa chất Công trình",
                    year: "2021"
                  },
                  {
                    client: "Chính phủ Phần Lan (ODA)",
                    project: "Dự án quản lý tài nguyên nước Việt Nam",
                    tech: "Công nghệ GIS toàn diện",
                    desc: "Xây dựng cơ sở dữ liệu và bản đồ GIS trực quan phục vụ công tác điều tra tài nguyên nước quốc gia, thúc đẩy quản lý bền vững.",
                    badge: "Tài nguyên & Môi trường",
                    year: "2007 - 2008"
                  }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 hover:border-orange-500/50 hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between group">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-xs text-orange-600 font-bold bg-orange-50 px-2.5 py-1">
                          {item.badge}
                        </span>
                        <span className="font-mono text-xs text-slate-400 font-bold">{item.year}</span>
                      </div>
                      
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block">{item.client}</span>
                        <h4 className="font-black text-sm uppercase tracking-tight text-slate-900 group-hover:text-orange-600 transition-colors leading-snug">
                          {item.project}
                        </h4>
                      </div>

                      <p className="text-slate-500 text-xs leading-relaxed text-justify font-medium line-clamp-4">
                        {item.desc}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 space-y-1">
                      <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest block">Giải pháp ứng dụng</span>
                      <span className="text-slate-800 text-xs font-bold font-mono">{item.tech}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* REDESIGNED: BỨC TƯỜNG ĐỐI TÁC TOÀN CẦU (Global Partnership Hall of Fame) */}
            <div className="space-y-8 pt-8 border-t border-slate-100">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <h2 className="text-3xl font-black text-slate-950 uppercase tracking-tight">BỨC TƯỜNG ĐỐI TÁC TOÀN CẦU</h2>
                <p className="text-xs text-orange-600 font-bold uppercase tracking-widest">Đại diện ủy quyền & Nhà phân phối chính hãng từ các tập đoàn hàng đầu thế giới</p>
                <div className="w-12 h-1 bg-orange-600 mx-auto mt-2"></div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Software Partners */}
                <div className="bg-slate-950 text-white p-8 relative overflow-hidden border border-slate-900 shadow-xl">
                  <div className="absolute right-0 top-0 w-48 h-48 bg-orange-600/10 blur-3xl rounded-full pointer-events-none"></div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                      <div className="w-12 h-12 bg-orange-600 text-white flex items-center justify-center shrink-0">
                        <Layers size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black uppercase tracking-wider text-orange-500">ĐỐI TÁC HÃNG PHẦN MỀM KỸ THUẬT</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Đại diện bản quyền quốc tế tại Việt Nam</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2 pt-2">
                      {softwarePartners.map((p, i) => (
                        <div 
                          key={i} 
                          className="bg-white/5 border border-white/10 hover:border-orange-500 hover:bg-orange-600/10 p-2.5 text-center transition-all duration-300 flex items-center justify-center min-h-[50px] group"
                        >
                          <span className="text-[10px] sm:text-xs font-black text-slate-300 group-hover:text-white leading-tight">
                            {p.replace(/ *\([^)]*\) */g, "")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Hardware Partners */}
                <div className="bg-slate-950 text-white p-8 relative overflow-hidden border border-slate-900 shadow-xl">
                  <div className="absolute right-0 top-0 w-48 h-48 bg-orange-600/10 blur-3xl rounded-full pointer-events-none"></div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                      <div className="w-12 h-12 bg-orange-600 text-white flex items-center justify-center shrink-0">
                        <Activity size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black uppercase tracking-wider text-orange-500">ĐỐI TÁC HÃNG THIẾT BỊ CHUYÊN NGÀNH</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Phân phối thiết bị quan trắc & địa kỹ thuật</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2 pt-2">
                      {hardwarePartners.map((p, i) => (
                        <div 
                          key={i} 
                          className="bg-white/5 border border-white/10 hover:border-orange-500 hover:bg-orange-600/10 p-2.5 text-center transition-all duration-300 flex items-center justify-center min-h-[50px] group"
                        >
                          <span className="text-[10px] sm:text-xs font-black text-slate-300 group-hover:text-white leading-tight">
                            {p.replace(/ *\([^)]*\) */g, "")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SEARCHABLE & FILTERABLE CONTRACT REGISTRY (BẢNG HỒ SƠ HỢP ĐỒNG KINH NGHIỆM) */}
            <div className="space-y-8 pt-8 border-t border-slate-100">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <h2 className="text-3xl font-black text-slate-950 uppercase tracking-tight font-sans">DANH MỤC HỢP ĐỒNG TIÊU BIỂU</h2>
                <p className="text-xs text-orange-600 font-bold uppercase tracking-widest">Hệ thống tra cứu hồ sơ năng lực & kinh nghiệm thực thi thực tế của CIC</p>
                <div className="w-12 h-1 bg-orange-600 mx-auto mt-2"></div>
              </div>

              {/* Redesigned Filter Controls with robust Layout & Scrollable Tabs */}
              <div className="bg-slate-50 border border-slate-200 p-6 space-y-6">
                <div className="flex flex-col md:flex-row gap-4 items-stretch justify-between">
                  {/* Modern Search bar */}
                  <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                      <Search size={16} />
                    </span>
                    <input
                      type="text"
                      placeholder="Tìm kiếm theo tên hợp đồng, đối tác..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 text-xs font-bold border border-slate-200 bg-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-600 focus:border-orange-600 rounded-none text-slate-800 transition-all shadow-sm"
                    />
                  </div>

                  {/* Clean found results tag */}
                  <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 shrink-0 shadow-sm">
                    <Filter size={14} className="text-orange-600" />
                    <span className="text-[10px] font-black uppercase text-slate-600 tracking-wider">
                      Tìm thấy: {filteredContracts.length} Hợp đồng
                    </span>
                  </div>
                </div>

                {/* Horizontal Swipeable Category Tabs (NEVER WRAPS UGLILY) */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                    Phân loại theo mảng giải pháp:
                  </span>
                  <div className="relative border-b border-slate-200">
                    <div className="flex space-x-2 overflow-x-auto pb-3 scrollbar-hide -mb-px">
                      {categories.map((cat) => {
                        const isActive = selectedCategory === cat.id;
                        return (
                          <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-4 py-2 text-[10px] md:text-xs font-black uppercase tracking-wider border-b-2 transition-all whitespace-nowrap shrink-0 ${
                              isActive 
                                ? 'border-orange-600 text-orange-600 font-black bg-orange-50/50' 
                                : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
                            }`}
                          >
                            {cat.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Data registry listing table */}
              <div className="border border-slate-200 overflow-hidden shadow-sm">
                <div className="max-h-[500px] overflow-y-auto scrollbar-hide">
                  <table className="w-full text-left text-xs border-collapse relative">
                    <thead className="sticky top-0 bg-slate-900 text-white font-black uppercase tracking-wider text-[10px] z-10">
                      <tr>
                        <th className="py-3 px-4 text-center border-b border-slate-800 w-16">STT</th>
                        <th className="py-3 px-5 border-b border-slate-800">Tên và nội dung của Hợp đồng</th>
                        <th className="py-3 px-5 border-b border-slate-800">Tên cơ quan ký hợp đồng / Khách hàng</th>
                        <th className="py-3 px-4 text-center border-b border-slate-800 w-28">Thời hạn HĐ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {filteredContracts.length > 0 ? (
                        filteredContracts.map((con, index) => {
                          return (
                            <tr key={con.id} className="hover:bg-slate-50 transition-colors">
                              <td className="py-3 px-4 text-center font-mono font-bold text-slate-400">{(index + 1).toString().padStart(3, '0')}</td>
                              <td className="py-3 px-5 font-bold text-slate-900 leading-relaxed text-justify">{con.name}</td>
                              <td className="py-3 px-5 font-semibold text-slate-600">{con.client}</td>
                              <td className="py-3 px-4 text-center font-mono font-bold text-orange-600 bg-orange-50/10">{con.year}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={4} className="py-12 text-center text-slate-400 font-bold italic">
                            Không tìm thấy hợp đồng nào phù hợp với từ khóa tìm kiếm.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="bg-slate-50 p-3.5 border-t border-slate-200 flex justify-between items-center text-[10px] font-black uppercase text-slate-400">
                  <span>Tổng số tìm thấy: {filteredContracts.length} hợp đồng</span>
                  <span>CIC Technology & Consultancy JSC Registry</span>
                </div>
              </div>
            </div>

            {/* Certification / Quality assurance footer strip */}
            <div className="bg-orange-600 text-white p-8 relative overflow-hidden shadow-2xl">
              <div className="absolute right-0 top-0 w-48 h-48 bg-white/10 blur-3xl pointer-events-none"></div>
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                <div className="space-y-2">
                  <h4 className="text-lg font-black uppercase tracking-tight">LIÊN HỆ KHẢO SÁT & HỢP TÁC CÔNG NGHỆ</h4>
                  <p className="text-xs text-orange-100 font-medium">Chúng tôi luôn sẵn lòng hợp tác, lắng nghe ý kiến đóng góp và chuyển giao giải pháp tiên tiến nhất.</p>
                </div>
                <button 
                  onClick={() => {
                    const el = document.getElementById('contact');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3 bg-slate-950 hover:bg-slate-900 text-white text-xs font-black uppercase tracking-wider rounded-none shrink-0 transition-all active:scale-95 shadow-xl border-2 border-slate-950"
                >
                  Kết nối ngay
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
