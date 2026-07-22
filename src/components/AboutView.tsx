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
  Zap,
  Image,
  Copy,
  Check
} from 'lucide-react';

import {
  coreValues,
  businessFields,
  businessPillars,
  hrData,
  experienceYears,
  capDetails,
  contracts,
  categories,
  softwarePartners,
  hardwarePartners
} from '../data/aboutData';

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

  // Organizational structure view states
  const [structureMode, setStructureMode] = useState<'interactive' | 'official'>('interactive');
  const [zoomScale, setZoomScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoveredDeptId, setHoveredDeptId] = useState<number | null>(null);



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
    <div className="pt-24 bg-transparent min-h-screen">
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
            className="space-y-24"
          >
            {/* 1. History & Introduction Block */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-7 space-y-6">
                <div className="border-l-4 border-orange-600 pl-4">
                  <span className="text-[10px] text-orange-600 font-sans font-black uppercase tracking-widest block">GIỚI THIỆU CHUNG</span>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-950 uppercase tracking-tight mt-0.5">
                    QUÁ TRÌNH PHÁT TRIỂN & VỊ THẾ DOANH NGHIỆP
                  </h2>
                </div>
                
                <p className="text-slate-800 text-sm md:text-[15px] leading-relaxed text-justify font-medium">
                  Công ty Cổ phần Công nghệ và Tư vấn CIC, tiền thân là Trung tâm Tin học thuộc Bộ Xây Dựng chính thức thành lập vào ngày 27/11/1990, bắt đầu hoạt động với chức năng là cơ quan tham mưu tin học thuộc Bộ Xây dựng nhằm phục vụ yêu cầu ứng dụng và phát triển Công nghệ thông tin trong ngành.
                </p>

                <p className="text-slate-700 text-sm md:text-[15px] leading-relaxed text-justify font-medium">
                  Ra đời trong thời kỳ đất nước đang chuyển mình và hội nhập với quá trình bùng nổ công nghệ thông tin trên toàn thế giới, bên cạnh yếu tố thuận lợi khách quan CIC đã không ngừng nỗ lực vượt khó, vươn lên và khẳng định vị thế của mình trong lĩnh vực khoa học công nghệ cho các ngành kỹ thuật tại Việt Nam nói chung, cũng như công nghệ thông tin ngành xây dựng nói riêng. Đến nay, CIC là 1 trong 10 thành viên chính thức của Tổ hợp Tư vấn Xây dựng Việt Nam (VC Group), một tổ hợp hàng đầu về tư vấn xây dựng trong nước.
                </p>

                <p className="text-slate-700 text-sm md:text-[15px] leading-relaxed text-justify font-medium">
                  Từ số lượng CBCNV cơ bản lúc đầu chưa đến chục người, đến nay, sau 35 năm hình thành và phát triển CIC đã có một đội ngũ cán bộ quản lý bản lĩnh vững vàng, quyết đoán và năng động cùng một tập thể CBCNV hơn 100 người có trình độ chuyên môn, sáng tạo, nhiều tâm huyết gắn bó với công ty.
                </p>

                <p className="text-orange-600 text-sm md:text-[15px] font-bold leading-relaxed text-justify pl-4 border-l-2 border-orange-500 my-4">
                  Sứ mệnh: “Cung cấp những sản phẩm phần mềm, thiết bị, dịch vụ công nghệ thông tin hiện đại, có tính ứng dụng cao để hỗ trợ các kỹ sư, doanh nghiệp, cơ quan nghiên cứu, các nhà quản lý trong công tác nghiên cứu, sản xuất, điều hành tại Việt Nam và các nước trong khu vực; đồng thời không ngừng phát triển nhằm góp phần vào sự hội nhập và phát triển chung của đất nước, đem lại thu nhập cao ổn định cho cán bộ công nhân viên cũng như hài hoà với lợi ích của cổ đông”.
                </p>

                <p className="text-slate-700 text-sm md:text-[15px] leading-relaxed text-justify font-medium">
                  Bên cạnh các dòng sản phẩm phần mềm truyền thống tự mình phát triển trong lĩnh vực xây dựng, quản lý, quy hoạch đã đem lại thương hiệu cho CIC như KPW, Escon, RDW, stCAD, VinaSAS, Sumac, MapPro, ESPA, Conna… CIC còn phát triển thành công phần mềm vẽ kỹ thuật enjiCAD với chất lượng rất cao và giá cả cạnh tranh hơn nhiều so với phần mềm CAD nổi tiếng khác trên thế giới. Bên cạnh đó CIC cũng là đối tác chính thức của Microsoft, Autodesk, CSI, Cubicost, Risa, Marin, DHI, Alma, DNV GL, Prokon… hay các thiết bị công nghệ mang hàm lượng khoa học cao của các hãng như Piletest, Tecknotrove, ZXLidars, A.P.Van den Berg, AQ System, Sewer Robotics, RadioDetection, Pearpoint, DJI, …
                </p>
              </div>

              <div className="lg:col-span-5 relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-amber-500 blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white border border-slate-200 p-2.5 shadow-2xl">
                  <img 
                    src="https://www.cic.com.vn/upload_images/images/2019/08/19/gioi-thieu.png" 
                    alt="Engineering Infrastructure" 
                    className="w-full h-80 object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="p-5 bg-slate-950 text-white flex flex-col justify-center items-center text-center">
                    <span className="font-sans text-2xl font-black text-orange-500">35+ NĂM KINH NGHIỆM</span>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Đồng hành cùng khoa học công nghệ kỹ thuật Việt Nam</p>
                    <div className="w-12 h-[1px] bg-orange-600/50 my-3"></div>
                    <p className="text-xs text-slate-300 font-semibold italic">"Tiên phong - Sáng tạo - Chuyên nghiệp - Bền vững"</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Strategic Objectives, Mission & Vision Bento */}
            <div className="space-y-8 pt-4">
              <div className="border-l-4 border-orange-600 pl-4">
                <span className="text-[10px] text-orange-600 font-sans font-black uppercase tracking-widest block">CHIẾN LƯỢC PHÁT TRIỂN</span>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mt-0.5">SỨ MỆNH - TẦM NHÌN - MỤC TIÊU PHÁT TRIỂN</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-slate-50 border border-slate-200 p-8 space-y-4 relative overflow-hidden group hover:border-orange-500 hover:bg-white transition-all duration-300 shadow-md">
                  <div className="w-12 h-12 bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                    <Target size={24} />
                  </div>
                  <h4 className="text-base font-black text-slate-950 uppercase tracking-tight">SỨ MỆNH CHIẾN LƯỢC</h4>
                  <p className="text-slate-600 text-xs md:text-sm leading-relaxed text-justify font-medium">
                    “Cung cấp những sản phẩm phần mềm, thiết bị, dịch vụ công nghệ thông tin hiện đại, có tính ứng dụng cao để hỗ trợ các kỹ sư, doanh nghiệp, cơ quan nghiên cứu, các nhà quản lý trong công tác nghiên cứu, sản xuất, điều hành tại Việt Nam và các nước trong khu vực; đồng thời không ngừng phát triển nhằm góp phần vào sự hội nhập và phát triển chung của đất nước, đem lại thu nhập cao ổn định cho cán bộ công nhân viên cũng như hài hoà với lợi ích của cổ đông”.
                  </p>
                  <div className="absolute right-0 bottom-0 w-24 h-24 bg-orange-600/5 blur-xl pointer-events-none group-hover:bg-orange-600/10 transition-colors"></div>
                </div>

                 <div className="bg-slate-50 border border-slate-200 p-8 space-y-4 relative overflow-hidden group hover:border-orange-500 hover:bg-white transition-all duration-300 shadow-md">
                   <div className="w-12 h-12 bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                     <Eye size={24} />
                   </div>
                   <h4 className="text-base font-black text-slate-950 uppercase tracking-tight">TẦM NHÌN PHÁT TRIỂN</h4>
                   <p className="text-slate-600 text-xs md:text-sm leading-relaxed text-justify font-medium">
                     Với tầm nhìn “Trở thành nhà cung cấp hàng đầu về các giải pháp ứng dụng công nghệ ICT và khoa học công nghệ khác cho các ngành kỹ thuật tại Việt Nam và các nước trong khu vực”, chúng tôi liên tục nâng cao chất lượng và mở rộng các mảng sản phẩm, dịch vụ của mình nhằm đáp ứng tốt nhất nhu cầu của khách hàng.
                   </p>
                   <div className="absolute right-0 bottom-0 w-24 h-24 bg-orange-600/5 blur-xl pointer-events-none group-hover:bg-orange-600/10 transition-colors"></div>
                 </div>
 
                 <div className="bg-slate-50 border border-slate-200 p-8 space-y-4 relative overflow-hidden group hover:border-orange-500 hover:bg-white transition-all duration-300 shadow-md">
                   <div className="w-12 h-12 bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                     <TrendingUp size={24} />
                   </div>
                   <h4 className="text-base font-black text-slate-950 uppercase tracking-tight">MỤC TIÊU DOANH NGHIỆP</h4>
                   <p className="text-slate-600 text-xs md:text-sm leading-relaxed text-justify font-medium">
                     Đem lại lợi nhuận cao nhất cho các cổ đông, tạo việc làm ổn định và nâng cao thu nhập vượt trội cho người lao động, thực hiện đầy đủ nghĩa vụ đóng góp cho Ngân sách Nhà nước, nâng cấp quy mô doanh nghiệp ngày càng lớn mạnh, góp phần phát triển chuyên ngành Tin học và Tư vấn xây dựng nước nhà ngang tầm trình độ khu vực và quốc tế.
                   </p>
                   <div className="absolute right-0 bottom-0 w-24 h-24 bg-orange-600/5 blur-xl pointer-events-none group-hover:bg-orange-600/10 transition-colors"></div>
                 </div>
               </div>
             </div>
 
             {/* 4. Các lĩnh vực hoạt động chủ yếu của công ty (FULL 10 mảng hoạt động nòng cốt) */}
             <div className="space-y-8 pt-4 border-t border-slate-100">
               <div className="border-l-4 border-orange-600 pl-4">
                 <span className="text-[10px] text-orange-600 font-sans font-black uppercase tracking-widest block">DANH MỤC LĨNH VỰC</span>
                 <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mt-0.5">CÁC LĨNH VỰC HOẠT ĐỘNG CHỦ YẾU CỦA CÔNG TY</h3>
                 <p className="text-xs text-slate-500 font-medium">Toàn bộ 10 mảng kinh doanh & tư vấn nòng cốt tạo nên vị thế dẫn đầu công nghệ kỹ thuật của CIC</p>
               </div>
 
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {[
                   {
                     title: "Phát triển phần mềm chuyên dụng",
                     desc: "Phát triển phần mềm xây dựng, phần mềm quản lý, phần mềm quy hoạch,... và các phần mềm đặc thù theo nhu cầu của khách hàng.",
                     highlights: "enjiCAD, ESCON, RDW, stCAD, VinaSAS, Sumac, MapPro, ESPA, Conna..."
                   },
                   {
                     title: "Phân phối phần mềm nhập khẩu",
                     desc: "Phân phối phần mềm nhập khẩu trong: xây dựng, nội thất, giao thông, đô thị, môi trường, thuỷ lợi, khai khoáng, ngành điện, giáo dục,... và các ngành kỹ thuật nói chung.",
                     highlights: "Microsoft, Autodesk, CSI (SAP2000, ETABS), Cubicost, Risa, Marin, DHI, Alma, DNV GL, Prokon..."
                   },
                   {
                     title: "Phân phối thiết bị khoa học công nghệ",
                     desc: "Phân phối các giải pháp máy móc thiết bị khoa học công nghệ trong: xây dựng, nội thất, giao thông, đô thị, môi trường, thuỷ lợi, khai khoáng, ngành điện, giáo dục,... và các ngành kỹ thuật nói chung.",
                     highlights: "Piletest, Tecknotrove, ZXLidars, A.P.Van den Berg, AQ System, Sewer Robotics, RadioDetection, Pearpoint, DJI..."
                   },
                   {
                     title: "Phân phối các sản phẩm vật liệu mới",
                     desc: "Phân phối các sản phẩm vật liệu mới chất lượng cao phục vụ các công trình hiện đại và dự án hạ tầng kỹ thuật tiên tiến.",
                     highlights: "Vật liệu thông minh, sợi carbon cường độ cao, chất chống thấm đặc thù"
                   },
                   {
                     title: "Giải pháp tích hợp hệ thống",
                     desc: "Triển khai các giải pháp tích hợp hệ thống công nghệ thông tin, bảo mật hạ tầng mạng và lưu trữ cơ sở dữ liệu chuyên sâu.",
                     highlights: "Hạ tầng Datacenter, Enterprise Server, giải pháp bảo mật nhiều lớp"
                   },
                   {
                     title: "Tư vấn thiết kế xây dựng & quy hoạch",
                     desc: "Tư vấn thiết kế xây dựng, quy hoạch chi tiết đô thị và hạ tầng kỹ thuật cho các dự án quy mô lớn.",
                     highlights: "Khảo sát địa chất, lập báo cáo tiền khả thi, thiết kế kỹ thuật & lập dự toán"
                   },
                   {
                     title: "Tư vấn triển khai BIM & số hoá công trình",
                     desc: "Tư vấn triển khai BIM; số hoá công trình: xây dựng, nhà máy, hạ tầng kỹ thuật từ mô phỏng đến hiện thực hóa.",
                     highlights: "Scan-to-BIM, point cloud 3D, quy trình chuẩn hóa ISO 19650"
                   },
                   {
                     title: "Quản lý vận hành trên BIM / Digital twin",
                     desc: "Tư vấn triển khai giải pháp quản lý vận hành công trình, nhà máy, hạ tầng kỹ thuật... trên mô hình BIM/Digital twin.",
                     highlights: "Asset Management, IoT Integration, bản sao số Digital Twin"
                   },
                   {
                     title: "Tư vấn dự án & giải pháp CNTT",
                     desc: "Tư vấn dự án, tư vấn giải pháp CNTT toàn diện cho các tổ chức, bộ ban ngành và doanh nghiệp trong nước.",
                     highlights: "Tư vấn thiết kế kỹ thuật, lập tổng dự toán CNTT, thẩm tra giải pháp"
                   },
                   {
                     title: "Phát triển bền vững & Net Zero",
                     desc: "Cung cấp dịch vụ và giải pháp phần mềm về phát triển bền vững, kiểm kê và giảm phát thải khí nhà kính; Chứng nhận môi trường cho sản phẩm, công trình....",
                     highlights: "Báo cáo ESG, kiểm kê khí nhà kính, tư vấn đạt chứng nhận LEED, LOTUS"
                   }
                 ].map((item, idx) => (
                   <div key={idx} className="bg-white border border-slate-200 p-6 flex flex-col justify-between hover:border-orange-500 hover:shadow-xl transition-all duration-300 relative group">
                     <div className="space-y-3">
                       <span className="font-sans text-[9px] font-black text-slate-400 block uppercase tracking-wider">MẢNG HOẠT ĐỘNG {(idx + 1).toString().padStart(2, '0')}</span>
                       <h4 className="font-black text-sm uppercase tracking-tight text-slate-900 group-hover:text-orange-600 transition-colors leading-snug">{item.title}</h4>
                       <div className="w-8 h-[1px] bg-orange-500 group-hover:w-16 transition-all duration-300"></div>
                       <p className="text-slate-600 text-xs leading-relaxed text-justify font-medium pt-1">{item.desc}</p>
                     </div>
                     <div className="pt-4 mt-6 border-t border-slate-100 bg-slate-50/50 p-3">
                       <span className="text-[9px] text-orange-600 font-sans font-black uppercase tracking-widest block">Công cụ & Công nghệ đại diện:</span>
                       <p className="text-slate-800 text-[11px] font-bold mt-1 font-sans leading-relaxed text-justify">{item.highlights}</p>
                     </div>
                   </div>
                 ))}
               </div>
             </div>

            {/* 5. Các hoạt động và nhiệm vụ đăng ký pháp lý chính của công ty (FULL 11 items) */}
            <div className="space-y-8 pt-4 border-t border-slate-100">
              <div className="border-l-4 border-orange-600 pl-4">
                <span className="text-[10px] text-orange-600 font-sans font-black uppercase tracking-widest block">HOẠT ĐỘNG PHÁP LÝ</span>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mt-0.5">CÁC HOẠT ĐỘNG & NHIỆM VỤ ĐĂNG KÝ PHÁP LÝ CHÍNH</h3>
                <p className="text-xs text-slate-500">Hệ thống danh mục 11 nhóm hoạt động nghiệp vụ được đăng ký chính thức của Công ty Cổ phần Công nghệ và Tư vấn CIC</p>
              </div>

              <div className="space-y-4 pl-5 border-l-2 border-slate-200/60 ml-0.5 w-full">
                {[
                  {
                    act: "Sản xuất, phát triển, khai thác và cung cấp các sản phẩm phần mềm và các dịch vụ công nghệ thông tin phục vụ quản lý, kinh tế, kỹ thuật;",
                    theme: "Phần mềm & Dịch vụ CNTT"
                  },
                  {
                    act: "Sản xuất, lắp ráp, xuất nhập khẩu, đại lý và cung cấp thiết bị tin học - viễn thông, thiết bị thí nghiệm và các thiết bị công nghệ khác;",
                    theme: "Thiết bị & Công nghệ cao"
                  },
                  {
                    act: "Tổ chức đào tạo, bồi dưỡng về công nghệ thông tin và các ứng dụng công nghệ khác;",
                    theme: "Đào tạo & Chuyển giao CNTT"
                  },
                  {
                    act: "Tổ chức đào tạo về tư vấn xây dựng;",
                    theme: "Đào tạo Tư vấn Xây dựng"
                  },
                  {
                    act: "Thi công lắp đặt các hệ thống thiết bị tin học, bưu chính viễn thông, điện lạnh, hệ thống điểu khiển trong công trình xây dựng dân dụng, công nghiệp, hạ tầng kỹ thuật, công nghệ thông tin, bưu chính viễn thông và bảo vệ môi trường;",
                    theme: "Thi công Cơ điện & Viễn thông"
                  },
                  {
                    act: "Lập dự án đầu tư; thiết kế kỹ thuật và lập tổng dự toán; thẩm tra và quản lý chất lượng dự án đầu tư về công nghệ thông tin và bưu chính viễn thông;",
                    theme: "Tư vấn Thiết kế & Đầu tư ICT"
                  },
                  {
                    act: "Tư vấn xây dựng các công trình xây dựng dân dụng; công trình công nghiệp, công trình hạ tầng kỹ thuật và bảo vệ môi trường gồm: Lập và thẩm tra dự án đầu tư, khảo sát địa hình, địa chất và đo đạc; quy hoạch khu dân cư, khu chức năng đô thị và khu công nghiệp; thiết kế xây dựng công trình; thẩm tra thiết kế kỹ thuật, thiết kế bản vẽ thi công; lập và thẩm tra dự toán và tổng dự toán công trình; lập hồ sơ mời thầu và phân tích đánh giá hồ sơ về lựa chọn nhà thầu tư vấn, nhà thầu thi công, thiết kế, nhà thầu cung cấp thiết bị, thi tuyển phương án kiến trúc; giám sát thi công xây dựng, lắp đặt thiết bị; tổng thầu tư vấn; quản lý dự án; kiểm định, kiểm tra và chứng nhận sự phù hợp về chất lượng các công trình xây dựng;",
                    theme: "Tư vấn Thiết kế & Giám sát"
                  },
                  {
                    act: "Thi công xây dựng các công trình dân dụng, công trình công nghệ thông tin, công trình bảo vệ môi trường;",
                    theme: "Thi công Xây lắp & Môi trường"
                  },
                  {
                    act: "Liên doanh liên kết với các đơn vị trong và ngoài nước để phát triển, ứng dụng và đầu tư công nghệ;",
                    theme: "Hợp tác & Liên doanh Công nghệ"
                  },
                  {
                    act: "Đầu tư kinh doanh bất động sản, dịch vụ cho thuê nhà và văn phòng làm việc;",
                    theme: "Bất động sản & Cho thuê văn phòng"
                  },
                  {
                    act: "Đầu tư và xây dựng dự án khu đô thị, khu công nghiệp, khu du lịch;",
                    theme: "Đầu tư & Phát triển Hạ tầng"
                  }
                ].map((item, index) => (
                  <div 
                    key={index} 
                    className="flex flex-col md:flex-row items-start md:items-center gap-4 p-5 bg-white border border-slate-200/80 border-l-4 border-l-slate-400 hover:border-l-orange-600 hover:border-slate-300 hover:shadow-md hover:bg-slate-50/10 transition-all duration-300 relative group animate-fade-in w-full"
                  >
                    {/* Index & Theme */}
                    <div className="flex items-center gap-3 shrink-0 w-full md:w-64">
                      <span className="font-mono text-xs font-black text-slate-400 group-hover:text-orange-600 transition-colors">
                        {(index + 1).toString().padStart(2, '0')}.
                      </span>
                      <span className="text-xs font-black uppercase tracking-wider text-slate-700 group-hover:text-slate-950 transition-colors">
                        {item.theme}
                      </span>
                    </div>

                    {/* Connecting line on desktop */}
                    <div className="hidden md:block h-6 w-[1px] bg-slate-200 self-stretch my-1"></div>

                    {/* Legal text content */}
                    <div className="grow pl-0 md:pl-2">
                      <p className="text-slate-700 text-xs md:text-[13px] font-semibold leading-relaxed text-justify">
                        {item.act}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. GIÁ TRỊ CỐT LÕI (Interactive & Beautifully polished) */}
            <div className="space-y-8 pt-4 border-t border-slate-100">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-xs text-orange-600 font-bold uppercase tracking-widest block">GIÁ TRỊ DOANH NGHIỆP</span>
                <h2 className="text-3xl font-black text-slate-950 uppercase tracking-tight">HỆ THỐNG GIÁ TRỊ CỐT LÕI</h2>
                <p className="text-xs text-slate-400 font-bold uppercase mt-1">Không gian văn hóa đặc sắc và bệ đỡ phát triển bền bỉ của tập thể CIC</p>
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

            {/* Global Contact & Official Legal Profile Section (Moved into Overview Tab only) */}
            <div id="contact" className="space-y-8 pt-12 border-t border-slate-200 mt-16">
              <div className="bg-slate-50 border border-slate-200 p-8 text-center max-w-4xl mx-auto space-y-4">
                <Heart className="text-orange-600 mx-auto w-8 h-8 animate-pulse" />
                <p className="text-slate-700 text-sm md:text-base font-semibold italic leading-relaxed">
                  "Với tinh thần trân trọng, lắng nghe và phục vụ, chúng tôi luôn sẵn sàng tiếp nhận và biết ơn mọi sự góp ý của khách hàng."
                </p>
                <div className="w-16 h-[2px] bg-orange-600 mx-auto"></div>
                <span className="text-[10px] text-slate-400 font-sans font-black uppercase tracking-widest block">MỌI THÔNG TIN XIN LIÊN HỆ</span>
                <h3 className="text-lg md:text-xl font-black text-slate-900 uppercase tracking-tight">CÔNG TY CỔ PHẦN CÔNG NGHỆ VÀ TƯ VẤN CIC</h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Trụ sở chính Hà Nội */}
                <div className="bg-white border border-slate-200 p-6 md:p-8 space-y-6 relative group hover:border-orange-500 hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                      <div className="w-12 h-12 bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                        <Building2 size={24} />
                      </div>
                      <div>
                        <span className="text-[9px] text-orange-600 font-sans font-black tracking-widest uppercase block">Trụ sở chính</span>
                        <h4 className="font-black text-base uppercase text-slate-900 tracking-tight">CÔNG TY CP CÔNG NGHỆ VÀ TƯ VẤN CIC</h4>
                      </div>
                    </div>

                    <div className="space-y-4 text-xs md:text-sm text-slate-700 font-medium">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] text-slate-400 font-sans font-black uppercase">Trụ sở chính:</span>
                        <p className="text-slate-950 font-bold flex items-start gap-2.5">
                          <MapPin size={16} className="text-orange-600 shrink-0 mt-0.5" />
                          <span>Tầng 4, Tòa nhà VG Building, Số 235 Nguyễn Trãi, Phường Khương Đình, TP Hà Nội</span>
                        </p>
                      </div>

                      <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-4">
                        <span className="text-[10px] text-slate-400 font-sans font-black uppercase">Điện thoại:</span>
                        <p className="text-slate-950 font-bold flex items-center gap-2.5">
                          <Phone size={14} className="text-slate-500 shrink-0" />
                          <span>(84-4) 39 761 381; (84-4) 39 741 313</span>
                        </p>
                      </div>

                      <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-4">
                        <span className="text-[10px] text-slate-400 font-sans font-black uppercase">Fax:</span>
                        <p className="text-slate-950 font-bold flex items-center gap-2.5">
                          <Phone size={14} className="text-slate-400 shrink-0" />
                          <span>(84-4) 38 216 793</span>
                        </p>
                      </div>

                      <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-4">
                        <span className="text-[10px] text-slate-400 font-sans font-black uppercase">Email:</span>
                        <p className="text-slate-950 font-bold flex items-center gap-2.5 font-mono">
                          <Mail size={14} className="text-slate-500 shrink-0" />
                          <a href="mailto:info@cic.com.vn" className="hover:text-orange-600 transition-colors">info@cic.com.vn</a>
                        </p>
                      </div>

                      <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-4">
                        <span className="text-[10px] text-slate-400 font-sans font-black uppercase">Website:</span>
                        <p className="text-slate-950 font-bold flex items-center gap-2.5">
                          <Globe size={14} className="text-slate-500 shrink-0" />
                          <a href="http://www.cic.com.vn" target="_blank" rel="noreferrer" className="text-orange-600 hover:underline">http://www.cic.com.vn</a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chi nhánh TP. Hồ Chí Minh */}
                <div className="bg-white border border-slate-200 p-6 md:p-8 space-y-6 relative group hover:border-orange-500 hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                      <div className="w-12 h-12 bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                        <MapPin size={24} />
                      </div>
                      <div>
                        <span className="text-[9px] text-orange-600 font-sans font-black tracking-widest uppercase block">Chi nhánh phía Nam</span>
                        <h4 className="font-black text-base uppercase text-slate-900 tracking-tight">CHI NHÁNH TP HỒ CHÍ MINH</h4>
                      </div>
                    </div>

                    <div className="space-y-4 text-xs md:text-sm text-slate-700 font-medium">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] text-slate-400 font-sans font-black uppercase">Chi nhánh TP Hồ Chí Minh:</span>
                        <p className="text-slate-950 font-bold flex items-start gap-2.5">
                          <MapPin size={16} className="text-orange-600 shrink-0 mt-0.5" />
                          <span>36 Nguyễn Huy Lượng – P.14 – Q.Bình Thạnh – TP Hồ Chí Minh</span>
                        </p>
                      </div>

                      <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-4">
                        <span className="text-[10px] text-slate-400 font-sans font-black uppercase">Điện thoại:</span>
                        <p className="text-slate-950 font-bold flex items-center gap-2.5">
                          <Phone size={14} className="text-slate-500 shrink-0" />
                          <span>(84-8) 62 899 022; (84-8) 62 899 033</span>
                        </p>
                      </div>

                      <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-4">
                        <span className="text-[10px] text-slate-400 font-sans font-black uppercase">Fax:</span>
                        <p className="text-slate-950 font-bold flex items-center gap-2.5">
                          <Phone size={14} className="text-slate-400 shrink-0" />
                          <span>(84-8) 62 899 033</span>
                        </p>
                      </div>

                      <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-4">
                        <span className="text-[10px] text-slate-400 font-sans font-black uppercase">Email:</span>
                        <p className="text-slate-950 font-bold flex items-center gap-2.5 font-mono">
                          <Mail size={14} className="text-slate-500 shrink-0" />
                          <a href="mailto:cichcm@cic.com.vn" className="hover:text-orange-600 transition-colors">cichcm@cic.com.vn</a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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

            {/* Sơ đồ cơ cấu tổ chức chính thức */}
            <div className="w-full overflow-x-auto flex justify-center py-4 mt-6">
              <div className="min-w-[800px] lg:min-w-0 max-w-5xl w-full">
                <img 
                  src="https://www.cic.com.vn/upload_images/images/2026/CIC%20chung/SO_D%E1%BB%92_T%E1%BB%94_CH%E1%BB%A8C-02.png" 
                  alt="Sơ đồ cơ cấu tổ chức CIC" 
                  className="w-full h-auto object-contain select-none pointer-events-none mix-blend-multiply"
                  referrerPolicy="no-referrer"
                />
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
            <div className="border-l-4 border-orange-600 pl-4 animate-fadeIn">
              <h2 className="text-2xl md:text-3xl font-black text-slate-950 uppercase tracking-tight">
                NĂNG LỰC KỸ THUẬT & HỒ SƠ KINH NGHIỆM
              </h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Được chứng minh vững chắc qua chặng đường hơn 35 năm phục vụ thị trường kỹ thuật Việt Nam</p>
            </div>

            {/* Section I: THÔNG TIN PHÁP LÝ & ĐƠN VỊ */}
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
                <div className="border-l-4 border-slate-950 pl-4">
                  <h3 className="text-xl font-black text-slate-950 uppercase tracking-tight">
                    I. TÊN ĐƠN VỊ: CÔNG TY CỔ PHẦN CÔNG NGHỆ VÀ TƯ VẤN CIC
                  </h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                    Thông tin pháp lý chính thức và địa chỉ giao dịch của CIC
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Trụ sở chính */}
                <div className="bg-white border border-slate-200 p-6 md:p-8 space-y-6 shadow-sm hover:border-orange-500 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                      <Building2 size={24} />
                    </div>
                    <div>
                      <span className="text-[9px] text-orange-600 font-sans font-black tracking-widest uppercase block">ĐƠN VỊ ĐIỀU HÀNH CHÍNH</span>
                      <h4 className="font-black text-base uppercase text-slate-900 tracking-tight">TRỤ SỞ CHÍNH HÀ NỘI</h4>
                    </div>
                  </div>

                  <div className="space-y-4 text-xs md:text-sm text-slate-700 font-medium">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] text-slate-400 font-sans font-black uppercase">Trụ sở chính :</span>
                      <p className="text-slate-950 font-bold flex items-start gap-2.5">
                        <MapPin size={16} className="text-orange-600 shrink-0 mt-0.5" />
                        <span>37 Lê Đại Hành - Quận Hai Bà Trưng - HN</span>
                      </p>
                    </div>

                    <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-4">
                      <span className="text-[10px] text-slate-400 font-sans font-black uppercase">Quyết định thành lập số:</span>
                      <p className="text-slate-950 font-bold flex items-center gap-2.5">
                        <FileText size={14} className="text-slate-500 shrink-0" />
                        <span>1765/QĐ-BXD ngày 21/12/2006.</span>
                      </p>
                    </div>

                    <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-4">
                      <span className="text-[10px] text-slate-400 font-sans font-black uppercase">Đăng ký kinh doanh số:</span>
                      <p className="text-slate-950 font-bold flex items-start gap-2.5">
                        <CheckCircle2 size={14} className="text-slate-500 shrink-0 mt-0.5" />
                        <span>0100775353 ngày 29/05/2013 (thay đổi lần 3) do Phòng đăng ký kinh doanh Sở KHĐT HN cấp.</span>
                      </p>
                    </div>

                    <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-4">
                      <span className="text-[10px] text-slate-400 font-sans font-black uppercase">Mã số thuế    :</span>
                      <p className="text-slate-950 font-bold flex items-center gap-2.5 font-mono">
                        <ShieldAlert size={14} className="text-slate-500 shrink-0" />
                        <span>01 0077 5353</span>
                      </p>
                    </div>

                    <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-4">
                      <span className="text-[10px] text-slate-400 font-sans font-black uppercase">Tài khoản      :</span>
                      <div className="space-y-1">
                        <p className="text-slate-950 font-bold flex items-start gap-2.5 font-mono">
                          <DollarSign size={14} className="text-slate-500 shrink-0 mt-0.5" />
                          <span>120.10.00.001477.7</span>
                        </p>
                        <p className="text-slate-500 text-xs italic pl-6">
                          Tại Sở giao dịch Ngân hàng đầu tư và phát triển Việt Nam
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-4">
                      <span className="text-[10px] text-slate-400 font-sans font-black uppercase">Điện thoại:</span>
                      <p className="text-slate-950 font-bold flex items-center gap-2.5">
                        <Phone size={14} className="text-slate-500 shrink-0" />
                        <span>84.4.39.781 /39.741.313</span>
                      </p>
                    </div>

                    <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-4">
                      <span className="text-[10px] text-slate-400 font-sans font-black uppercase">Fax                :</span>
                      <p className="text-slate-950 font-bold flex items-center gap-2.5">
                        <Phone size={14} className="text-slate-400 shrink-0" />
                        <span>84.4.38.216.793</span>
                      </p>
                    </div>

                    <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-4">
                      <span className="text-[10px] text-slate-400 font-sans font-black uppercase">Email             :</span>
                      <p className="text-slate-950 font-bold flex items-center gap-2.5 font-mono">
                        <Mail size={14} className="text-slate-500 shrink-0" />
                        <a href="mailto:info@cic.com.vn" className="hover:text-orange-600 transition-colors">info@cic.com.vn</a>
                      </p>
                    </div>

                    <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-4">
                      <span className="text-[10px] text-slate-400 font-sans font-black uppercase">Website         :</span>
                      <p className="text-slate-950 font-bold flex items-center gap-2.5">
                        <Globe size={14} className="text-slate-500 shrink-0" />
                        <a href="http://www.cic.com.vn" target="_blank" rel="noreferrer" className="text-orange-600 hover:underline">www.cic.com.vn</a>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chi nhánh TP. Hồ Chí Minh */}
                <div className="bg-white border border-slate-200 p-6 md:p-8 space-y-6 shadow-sm hover:border-orange-500 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <span className="text-[9px] text-orange-600 font-sans font-black tracking-widest uppercase block">KHU VỰC PHÁT TRIỂN PHÍA NAM</span>
                      <h4 className="font-black text-base uppercase text-slate-900 tracking-tight">CHI NHÁNH TP. HỒ CHÍ MINH</h4>
                    </div>
                  </div>

                  <div className="space-y-4 text-xs md:text-sm text-slate-700 font-medium">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] text-slate-400 font-sans font-black uppercase font-mono">Chi nhánh tại Tp.HCM:</span>
                      <p className="text-slate-950 font-bold flex items-start gap-2.5">
                        <MapPin size={16} className="text-orange-600 shrink-0 mt-0.5" />
                        <span>36 Nguyễn Huy Lượng - P.14 - Q.Bình Thạnh - Tp HCM</span>
                      </p>
                    </div>

                    <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-4">
                      <span className="text-[10px] text-slate-400 font-sans font-black uppercase">Quyết định thành lập số:</span>
                      <p className="text-slate-950 font-bold flex items-center gap-2.5">
                        <FileText size={14} className="text-slate-500 shrink-0" />
                        <span>939/QĐ-BXD ngày 13/07/2000.</span>
                      </p>
                    </div>

                    <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-4">
                      <span className="text-[10px] text-slate-400 font-sans font-black uppercase">Điện thoại     :</span>
                      <p className="text-slate-950 font-bold flex items-center gap-2.5">
                        <Phone size={14} className="text-slate-500 shrink-0" />
                        <span>84.8.628.99.022 – 628.99.033</span>
                      </p>
                    </div>

                    <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-4">
                      <span className="text-[10px] text-slate-400 font-sans font-black uppercase">Fax                :</span>
                      <p className="text-slate-950 font-bold flex items-center gap-2.5">
                        <Phone size={14} className="text-slate-400 shrink-0" />
                        <span>84.8.628.99.033</span>
                      </p>
                    </div>

                    <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-4">
                      <span className="text-[10px] text-slate-400 font-sans font-black uppercase">Email             :</span>
                      <p className="text-slate-950 font-bold flex items-center gap-2.5 font-mono">
                        <Mail size={14} className="text-slate-500 shrink-0" />
                        <a href="mailto:cichcm@cic.com.vn" className="hover:text-orange-600 transition-colors">cichcm@cic.com.vn</a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section II: GIỚI THIỆU VỀ CÔNG TY VÀ QUÁ TRÌNH PHÁT TRIỂN */}
            <div className="space-y-8 pt-8 border-t border-slate-100">
              <div className="border-l-4 border-slate-950 pl-4">
                <h3 className="text-xl font-black text-slate-950 uppercase tracking-tight">
                  II. GIỚI THIỆU VỀ CÔNG TY VÀ QUÁ TRÌNH PHÁT TRIỂN
                </h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                  Chặng đường phát triển công nghệ xuất sắc của CIC
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-6 md:p-8 space-y-6">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <p className="text-slate-700 text-xs md:text-sm leading-relaxed text-justify font-medium">
                      Công ty Cổ phần Công nghệ và Tư vấn CIC với tên giao dịch là <strong>CIC (CIC Technology & Consultancy Joint - Stock Company)</strong> được thành lập từ 27/11/1990 và trên cơ sở đó chuyển thành Công ty cổ phần theo Quyết định số 1765/QĐ-BXD ngày 21/12/2006 . Qua hơn 35 năm hoạt động cùng với việc được công nhận là 1 trong 10 thành viên chính thức của Tập đoàn Tư vấn Xây dựng Việt Nam (VC Group), một tổ hợp hàng đầu về tư vấn xây dựng trong nước, CIC thực sự khẳng định được vai trò và vị trí của mình.
                    </p>
                    <p className="text-slate-700 text-xs md:text-sm leading-relaxed text-justify font-medium">
                      Với mục tiêu đem lại lợi nhuận cao nhất cho các cổ đông, tạo việc làm ổn định và nâng cao thu nhập cho người lao động, đóng góp cho Ngân sách Nhà nước và phát triển công ty ngày càng lớn mạnh, góp phần phát triển chuyên ngành Tin học và Tư vấn xây dựng đạt trình độ khu vực và quốc tế, CIC cùng với 100 cán bộ có trình độ cao và chuyên môn sâu về tin học cũng như tư vấn xây dựng của mình đã mang lại những lợi ích không nhỏ cho việc đẩy mạnh ứng dụng CNTT nói chung và phát triển phần mềm xây dựng nói riêng.
                    </p>
                  </div>
                  <div className="space-y-4 bg-orange-600/5 border border-orange-600/10 p-6">
                    <h4 className="font-black text-xs md:text-sm uppercase text-orange-600 tracking-tight">SỨ MỆNH PHÂN PHỐI VÀ CHUYỂN GIAO TOÀN CẦU</h4>
                    <p className="text-slate-700 text-xs md:text-sm leading-relaxed text-justify font-medium">
                      Công ty CIC đã, đang và sẽ là nhà phân phối chính thức, có uy tín trong lĩnh vực cung cấp các sản phẩm phần mềm nhập khẩu, thiết bị, các giải pháp công nghệ tiên tiến của thế giới phục vụ nhu cầu chung trong các doanh nghiệp xây dựng, giao thông, thủy lợi, cơ khí và các ngành liên quan khác.
                    </p>
                  </div>
                </div>

                {/* Các hoạt động đăng ký chính */}
                <div className="space-y-4 pt-6 border-t border-slate-200">
                  <h4 className="font-black text-xs md:text-sm uppercase text-slate-900 tracking-tight">CÁC HOẠT ĐỘNG VÀ NHIỆM VỤ ĐĂNG KÝ PHÁP LÝ CHÍNH CỦA CÔNG TY</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "Sản xuất, phát triển, khai thác và cung cấp các sản phẩm phần mềm và các dịch vụ công nghệ thông tin phục vụ quản lý, kinh tế, kỹ thuật;",
                      "Sản xuất, lắp ráp, xuất nhập khẩu, đại lý và cung cấp thiết bị tin học - viễn thông, thiết bị thí nghiệm và các thiết bị công nghệ khác;",
                      "Tổ chức đào tạo, bồi dưỡng về công nghệ thông tin và các ứng dụng công nghệ khác;",
                      "Tổ chức đào tạo về tư vấn xây dựng;",
                      "Thi công lắp đặt các hệ thống thiết bị tin học, bưu chính viễn thông, điện lạnh, hệ thống điểu khiển trong công trình xây dựng dân dụng, công nghiệp, hạ tầng kỹ thuật, công nghệ thông tin, bưu chính viễn thông và bảo vệ môi trường;",
                      "Lập dự án đầu tư; thiết kế kỹ thuật và lập tổng dự toán; thẩm tra và quản lý chất lượng dự án đầu tư về công nghệ thông tin và bưu chính viễn thông;",
                      "Tư vấn xây dựng các công trình xây dựng dân dụng; công trình công nghiệp, công trình hạ tầng kỹ thuật và bảo vệ môi trường gồm: Lập và thẩm tra dự án đầu tư, khảo sát địa hình, địa chất và đo đạc; quy hoạch khu dân cư, khu chức năng đô thị và khu công nghiệp; thiết kế xây dựng công trình; thẩm tra thiết kế kỹ thuật, thiết kế bản vẽ thi công; lập và thẩm tra dự toán và tổng dự toán công trình; lập hồ sơ mời thầu và phân tích đánh giá hồ sơ về lựa chọn nhà thầu tư vấn, nhà thầu thi công, thiết kế, nhà thầu cung cấp thiết bị, thi tuyển phương án kiến trúc; giám sát thi công xây dựng, lắp đặt thiết bị; tổng thầu tư vấn; quản lý dự án; kiểm định, kiểm tra và chứng nhận sự phù hợp về chất lượng các công trình xây dựng;",
                      "Thi công xây dựng các công trình dân dụng, công trình công nghệ thông tin, công trình bảo vệ môi trường;",
                      "Liên doanh liên kết với các đơn vị trong và ngoài nước để phát triển, ứng dụng và đầu tư công nghệ;",
                      "Đầu tư kinh doanh bất động sản, dịch vụ cho thuê nhà và văn phòng làm việc;",
                      "Đầu tư và xây dựng dự án khu đô thị, khu công nghiệp, khu du lịch."
                    ].map((act, index) => (
                      <div key={index} className="flex gap-3 bg-white border border-slate-200 p-4 hover:border-orange-600/30 transition-all">
                        <span className="font-sans font-black text-orange-600 text-xs md:text-sm shrink-0">{(index + 1).toString().padStart(2, '0')}</span>
                        <p className="text-slate-600 text-[11px] md:text-xs font-semibold leading-relaxed text-justify">{act}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Section III: CÁC LĨNH VỰC KINH DOANH CHỦ YẾU */}
            <div className="space-y-8 pt-8 border-t border-slate-100">
              <div className="border-l-4 border-slate-950 pl-4">
                <h3 className="text-xl font-black text-slate-950 uppercase tracking-tight">
                  III. CÁC LĨNH VỰC KINH DOANH CHỦ YẾU CỦA CÔNG TY
                </h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                  Mảng kinh doanh nòng cốt thúc đẩy hiện đại hóa ngành kỹ thuật Việt Nam
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: "Phát triển phần mềm xây dựng",
                    desc: "Nghiên cứu, xây dựng các phần mềm và các chương trình hỗ trợ tự động hoá công tác tư vấn thiết kế xây dựng.",
                    highlights: "MBW, MDW, MCW, VINASAS, KPW, SBTW, SUMAC, ESCON, stCAD..."
                  },
                  {
                    title: "Phát triển phần mềm quản lý xây dựng",
                    desc: "Nghiên cứu, xây dựng các phần mềm chuyên ngành phục vụ công tác quản lý kế toán, quản lý nhân sự tiền lương, ... cho các doanh nghiệp xây dựng, các cơ quan hành chính sự nghiệp.",
                    highlights: "Quản lý tài chính kế toán, Nhân sự, Tiền lương chuyên biệt"
                  },
                  {
                    title: "Phát triển phần mềm quy hoạch và hạ tầng kỹ thuật",
                    desc: "Áp dụng các công nghệ tiên tiến trên thế giới, xây dựng các phần mềm ứng dụng cho quản lý của các đơn vị trong lĩnh vực quy hoạch và hạ tầng kỹ thuật.",
                    highlights: "MaPPro, ESPA, MA"
                  },
                  {
                    title: "Phân phối thiết bị công nghệ cao nhập khẩu",
                    desc: "Nghiên cứu, phân phối, chuyển giao các thiết bị công nghệ cao, đặc thù của các nước phát triển cho ngành xây dựng Việt Nam. Các thiết bị tập trung trong một số nhóm chính như: thiết bị kiểm tra không phá huỷ, thiết bị địa kỹ thuật, thiết bị địa vật lý, thiết bị & giải pháp công nghệ cho ngành nước...",
                    highlights: "Piletest, James Instruments, LRM, IDS, ELE, A.P.Van den Berg, Instantel, PASI, Casio, Seba KMT, ROMDAS..."
                  },
                  {
                    title: "Phân phối phần mềm xây dựng nhập khẩu",
                    desc: "Nghiên cứu, phân phối, chuyển giao các phần mềm xây dựng nhập khẩu có bản quyền của các hãng nổi tiếng trên thế giới.",
                    highlights: "Autodesk, SAP, ETABS, ADAPT, Bentley, GEO SLOPE, PLAXIS..."
                  },
                  {
                    title: "Phân phối phần mềm giao thông, đô thị và môi trường",
                    desc: "Nghiên cứu, phân phối và chuyển giao các giải pháp công nghệ và phần mềm cho các lĩnh vực giao thông, đô thị và môi trường.",
                    highlights: "PTV, TRL, Kritikal, ASA, LakeEnvironmental, DHI, D3D, Vectuel..."
                  },
                  {
                    title: "Các giải pháp công nghệ thông minh",
                    desc: "Nghiên cứu, chuyển giao các giải pháp và thiết bị công nghệ thông minh mang tính tự động hoá cao.",
                    highlights: "Giao thông thông minh (ITS), quản lý tòa nhà và căn hộ (BMS), tiết kiệm năng lượng"
                  },
                  {
                    title: "Tư vấn các dự án",
                    desc: "Cung cấp các dịch vụ tư vấn dự án công nghệ thông tin, dự án đầu tư xây dựng và triển khai thực hiện các dự án công nghệ thông tin cho các tổ chức và doanh nghiệp, thi công lắp đặt các hệ thống trang thiết bị tin học, bưu chính viễn thông, hạ tầng kỹ thuật, hệ thống điều khiển các công trình xây dựng dân dụng.",
                    highlights: "Tư vấn đầu tư ICT, Giám sát lắp đặt phần cứng viễn thông, điện nhẹ"
                  },
                  {
                    title: "Tư vấn thiết kế xây dựng",
                    desc: "Cung cấp các dịch vụ về khảo sát, lập dự án đầu tư, thiết kế và tư vấn xây dựng, ... cho các công trình dân dụng, công nghiệp, giao thông, thuỷ lợi, ... với yêu cầu cao.",
                    highlights: "Khảo sát địa hình địa chất, quy hoạch đô thị, lập dự án và tổng dự toán"
                  }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 p-6 flex flex-col justify-between hover:border-orange-600 hover:shadow-md transition-all duration-300 relative group">
                    <div className="space-y-3">
                      <span className="font-sans text-[9px] font-black text-slate-400 block uppercase tracking-wider">LĨNH VỰC 0{idx + 1}</span>
                      <h4 className="font-black text-xs md:text-sm uppercase tracking-tight text-slate-900 group-hover:text-orange-600 transition-colors leading-snug">{item.title}</h4>
                      <p className="text-slate-500 text-[11px] md:text-xs leading-relaxed text-justify font-medium">{item.desc}</p>
                    </div>
                    <div className="pt-4 mt-4 border-t border-slate-100">
                      <span className="text-[9px] text-orange-600 font-black uppercase tracking-widest block">Công cụ & Công nghệ cốt lõi:</span>
                      <p className="text-slate-800 text-[11px] font-bold mt-1.5 font-sans leading-relaxed">{item.highlights}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* HỒ SƠ KINH NGHIỆM THEO SỐ NĂM TÍCH LŨY */}
            <div className="space-y-8 pt-8 border-t border-slate-100">
              <div className="border-l-4 border-slate-950 pl-4">
                <h3 className="text-xl font-black text-slate-950 uppercase tracking-tight">
                  HỒ SƠ KINH NGHIỆM THEO SỐ NĂM HOẠT ĐỘNG
                </h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                  Kinh nghiệm tích lũy chuyên môn vững vàng của CIC theo từng loại hình công việc
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {[
                  { title: "Tư vấn các giải pháp tổng thể về hệ thống thiết bị tin học, viễn thông.", years: 35 },
                  { title: "Nghiên cứu ứng dụng và chuyển giao các giải pháp công nghệ thông tin.", years: 35 },
                  { title: "Thực hiện việc lắp đặt các hệ thống thiết bị tin học viễn thông.", years: 35 },
                  { title: "Nghiên cứu, thiết kế, sản xuất, khai thác phát triển và cung cấp phần mềm về công nghệ thông tin phục vụ quản lý kinh tế, kỹ thuật.", years: 35 },
                  { title: "Thực hiện các nội dung công tác tư vấn xây dựng đối với các công trình tin học viễn thông, các công trình dân dụng, công nghiệp, công trình kỹ thuật hạ tầng đô thị, khu công nghiệp.", years: 35 },
                  { title: "Xuất nhập khẩu thiết bị, sản phẩm công nghệ tin học và các ứng dụng công nghệ khác.", years: 35 },
                  { title: "Tổ chức đào tạo, bồi dưỡng về công nghệ thông tin và các ứng dụng công nghệ khác.", years: 35 },
                  { title: "Liên doanh, liên kết, hợp tác với các đơn vị trong và ngoài nước để phát triển và đầu tư công nghệ.", years: 30 },
                  { title: "Phân phối các thiết bị đặc thù và phần mềm nhập khẩu chuyên ngành xây dựng.", years: 29 }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-orange-500/50 transition-all">
                    <div className="flex items-center gap-4">
                      <span className="w-10 h-10 bg-slate-950 text-white font-sans font-black flex items-center justify-center text-xs shrink-0">
                        0{idx + 1}
                      </span>
                      <div>
                        <p className="text-slate-900 text-xs md:text-sm font-black leading-relaxed">{item.title}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Lực lượng năng lực CIC</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto bg-orange-50 border border-orange-200 px-4 py-2">
                      <Clock size={14} className="text-orange-600" />
                      <span className="font-sans font-black text-sm text-orange-600 whitespace-nowrap">{item.years} NĂM KINH NGHIỆM</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BẢNG CƠ CẤU NHÂN SỰ CHI TIẾT THEO PHÒNG BAN (Transferred from Structure Tab) */}
            <div className="space-y-6 pt-8 border-t border-slate-100">
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
                      const isHovered = hoveredDeptId === dept.stt;
                      return (
                        <tr 
                          key={idx} 
                          onMouseEnter={() => setHoveredDeptId(dept.stt)}
                          onMouseLeave={() => setHoveredDeptId(null)}
                          className={`transition-all duration-300 ${
                            isHovered 
                              ? 'bg-orange-50 border-l-4 border-l-orange-500' 
                              : 'hover:bg-slate-50'
                          }`}
                        >
                          <td className="py-3.5 px-4 text-center font-sans font-bold text-slate-400">{dept.stt.toString().padStart(2, '0')}</td>
                          <td className="py-3.5 px-5 font-black text-slate-900 flex items-center gap-2.5">
                            <span className="p-1 bg-slate-100 text-orange-600 rounded">
                              <IconComp size={14} />
                            </span>
                            <span>{dept.name}</span>
                          </td>
                          <td className="py-3.5 px-4 text-center font-bold font-sans text-orange-600 text-sm bg-orange-50/20">{dept.total}</td>
                          <td className="py-3.5 px-4 text-center font-sans">{dept.nv || '-'}</td>
                          <td className="py-3.5 px-4 text-center font-sans font-semibold text-slate-900">{dept.dh || '-'}</td>
                          <td className="py-3.5 px-4 text-center font-sans font-semibold text-orange-600">{dept.postDh || '-'}</td>
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
                      <td className="py-4 px-4 text-center font-sans text-orange-600 font-black text-base">106</td>
                      <td className="py-4 px-4 text-center font-sans text-slate-950">01</td>
                      <td className="py-4 px-4 text-center font-sans text-slate-950">75</td>
                      <td className="py-4 px-4 text-center font-sans text-orange-600">19</td>
                      <td className="py-4 px-6 text-slate-400 text-[10px] uppercase font-bold text-center">
                        75 ĐH (70.7%) | 19 Trên ĐH (17.9%)
                      </td>
                    </tr>
                  </tbody>
                </table>
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
                <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
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
                              <td className="py-3 px-4 text-center font-sans font-bold text-slate-400">{(index + 1).toString().padStart(3, '0')}</td>
                              <td className="py-3 px-5 font-bold text-slate-900 leading-relaxed text-justify">{con.name}</td>
                              <td className="py-3 px-5 font-semibold text-slate-600">{con.client}</td>
                              <td className="py-3 px-4 text-center font-sans font-bold text-orange-600 bg-orange-50/10">{con.year}</td>
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
