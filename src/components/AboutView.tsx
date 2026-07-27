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
  Check,
  ShieldCheck,
  Box,
  Lightbulb,
  Leaf
} from 'lucide-react';

import { partners } from '../data/mockData';
import { BIMIcon } from './shared/Icons';
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

const SectionHeader = ({ title, sub, dark }: { title: string; sub: string; dark?: boolean }) => (
  <div className="text-center mb-6">
    <h2 className={`text-3xl md:text-4xl font-black uppercase tracking-tighter mb-2 ${dark ? 'text-white' : 'text-slate-950'}`}>
      {title}
    </h2>
    <div className="w-16 h-1 bg-orange-600 mx-auto mt-2 mb-4"></div>
    <p className={`font-bold uppercase tracking-widest text-[10px] ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
      {sub}
    </p>
  </div>
);

interface AboutViewProps {
  activeTab: 'overview' | 'structure' | 'experience';
  setActiveTab: (tab: 'overview' | 'structure' | 'experience') => void;
  onNavigateToContact?: () => void;
}

export const AboutView = ({ activeTab, setActiveTab, onNavigateToContact }: AboutViewProps) => {
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
              <section className="relative pt-24 pb-12 lg:pt-32 lg:pb-16 overflow-hidden bg-slate-950 z-10 border-b border-slate-800">
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover opacity-30 mix-blend-screen scale-105"
              src="https://cdn.pixabay.com/video/2020/01/31/31755-388274351_large.mp4" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40"></div>
          </div>
          <div className="max-w-7xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-none mb-4 lg:mb-6 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-none bg-orange-600 animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">
                Về chúng tôi
              </span>
            </div>
            
            <h1 className="text-[4.5vw] sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-white leading-[1.3] mb-4 lg:mb-6 tracking-tighter max-w-full mx-auto whitespace-nowrap">
              HƠN 35 NĂM NHỊP BƯỚC <span className="text-orange-500">CÙNG CÔNG NGHỆ</span>
            </h1>
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
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full space-y-16"
             >
                {/* 0. Giới Thiệu & Video */}
                <section className="py-8 lg:py-10 bg-white relative overflow-hidden z-10 border-b border-slate-100">
                  <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                      <div>
                        <p className="text-sm md:text-base text-slate-600 mb-4 leading-relaxed font-normal text-justify">
                          Công ty Cổ phần Công nghệ và Tư vấn CIC tiền thân là Trung tâm tin học thuộc Bộ Xây dựng thành lập vào ngày 27/11/1990, bắt đầu hoạt động với chức năng là cơ quan tham mưu tin học thuộc Bộ Xây dựng nhằm phục vụ yêu cầu ứng dụng và phát triển Công nghệ thông tin trong ngành.
                        </p>
                        <p className="text-sm md:text-base text-slate-600 mb-4 leading-relaxed font-normal text-justify">
                          Hiện nay, chúng tôi là thành viên của VC Group, tổ hợp hàng đầu về tư vấn xây dựng, thiết bị và công nghệ tại Việt Nam.
                        </p>
                        <p className="text-sm md:text-base text-slate-600 leading-relaxed font-normal text-justify">
                          Sau hơn 35 năm phát triển, CIC đã xây dựng được đội ngũ quản lý vững vàng, quyết đoán, và năng động cùng tập thể nhân viên có trình độ chuyên môn cao, sáng tạo và tận tâm. Chúng tôi luôn gắn bó với sứ mệnh: “Cung cấp những sản phẩm phần mềm, thiết bị, dịch vụ công nghệ thông tin hiện đại, có tính ứng dụng cao để hỗ trợ các kỹ sư, doanh nghiệp, cơ quan nghiên cứu, các nhà quản lý trong công tác nghiên cứu, sản xuất, điều hành tại Việt Nam và các nước trong khu vực; đồng thời không ngừng phát triển nhằm góp phần vào sự hội nhập và phát triển chung của đất nước, đem lại thu nhập cao ổn định cho cán bộ công nhân viên cũng như hài hoà với lợi ích của cổ đông.”
                        </p>
                      </div>
                      <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl border-4 border-slate-100 bg-slate-900">
                        <iframe 
                          className="w-full h-full"
                          src="https://www.youtube.com/embed/hdLFK_09-tU?start=448" 
                          title="YouTube video player" 
                          frameBorder="0" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                          referrerPolicy="strict-origin-when-cross-origin" 
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 3. Tiến Trình Phát Triển (Timeline) */}
                <section className="py-16 bg-white relative overflow-hidden border-b border-slate-100 z-10">
                  <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-600 rounded-full mb-4">
                        <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse"></span>
                        <span className="text-[10px] font-black uppercase tracking-widest">Hành trình 35 năm</span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-4 text-slate-900">Lịch sử phát triển</h2>
                      <p className="text-slate-500 max-w-2xl mx-auto">Chặng đường vươn lên trở thành một trong những đơn vị tiên phong trong lĩnh vực công nghệ và tư vấn xây dựng tại Việt Nam.</p>
                    </div>

                    <div className="relative max-w-6xl mx-auto px-4 mt-8 md:mt-16">
                      {/* Horizontal Line - Thin */}
                      <div className="absolute top-[28px] left-[10%] right-[10%] h-[1px] bg-slate-300 hidden md:block"></div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8 relative z-10">
                        {[
                          { year: '1990', title: 'Thành lập', desc: 'Ngày 27/11/1990, CIC chính thức ra đời, tiền thân là Trung tâm tin học, thuộc Bộ Xây dựng.' },
                          { year: '2000', title: 'Trực thuộc Bộ', desc: 'Trở thành Công ty Tin học Xây dựng (CIC) thuộc Bộ Xây dựng.' },
                          { year: '2006', title: 'Cổ phần hóa', desc: 'Được cổ phần hóa thành Công ty CP Tin học và Tư vấn Xây dựng.' },
                          { year: '2019', title: 'Đổi tên & Gia nhập', desc: 'Trở thành Công ty CP Công nghệ & Tư vấn CIC (CIC) và thuộc VC Group — Tổ hợp gồm 10 công ty hàng đầu trong lĩnh vực xây dựng & các ngành kỹ thuật liên quan.' },
                          { year: '2025', title: 'Đổi mới', desc: 'Dấu mốc 35 năm phát triển của CIC, thay đổi nhận diện, mở rộng phát triển, trong đó có các giải pháp AI, Phát triển bền vững một cách mạnh mẽ hơn.' },
                        ].map((item, index) => (
                          <div key={item.year} className="relative flex flex-col items-center text-center group">
                            {/* Dot */}
                            <div className="hidden md:flex w-3 h-3 rounded-full bg-orange-500 ring-[6px] ring-white mb-6 relative z-10 items-center justify-center -translate-y-1/2 mt-[28px] group-hover:scale-150 group-hover:bg-orange-600 transition-all duration-300">
                              <div className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-50"></div>
                            </div>
                            
                            {/* Content */}
                            <div className="w-full flex flex-col items-center md:-mt-4">
                              <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">{item.year}</h3>
                              <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* 2. Định Hướng Chiến Lược */}
                <section className="py-10 bg-slate-50 border-b border-slate-100 z-10 relative overflow-hidden">
                  <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <SectionHeader 
                      title="Định hướng chiến lược" 
                      sub="Tầm nhìn kiến tạo giá trị công nghệ bền vững" 
                    />
                    
                    <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                      {/* Left: Illustration */}
                      <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-sm group hidden lg:block">
                        <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80" alt="Định hướng chiến lược" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent pointer-events-none"></div>
                      </div>

                      {/* Right: Content Blocks */}
                      <div className="flex flex-col gap-6">
                        {/* Sứ mệnh */}
                        <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-6 items-start hover:border-orange-200 transition-colors">
                          <div className="w-14 h-14 shrink-0 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100">
                            <ShieldCheck size={28} />
                          </div>
                          <div>
                            <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 mb-2">Sứ mệnh</h3>
                            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                              Trở thành nhà cung cấp hàng đầu về các giải pháp ứng dụng công nghệ ICT và khoa học công nghệ khác cho các ngành kỹ thuật tại Việt Nam và các nước trong khu vực.
                            </p>
                          </div>
                        </div>

                        {/* Tầm nhìn */}
                        <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-6 items-start hover:border-blue-200 transition-colors">
                          <div className="w-14 h-14 shrink-0 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                            <Globe size={28} />
                          </div>
                          <div>
                            <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 mb-2">Tầm nhìn</h3>
                            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                              Cung cấp những sản phẩm phần mềm, thiết bị, dịch vụ CNTT hiện đại, có tính ứng dụng cao để hỗ trợ công tác nghiên cứu, sản xuất, điều hành tại Việt Nam; không ngừng hội nhập thế giới.
                            </p>
                          </div>
                        </div>

                        {/* Giá trị cốt lõi */}
                        <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-6 items-start hover:border-orange-200 transition-colors">
                          <div className="w-14 h-14 shrink-0 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100">
                            <Award size={28} />
                          </div>
                          <div className="relative z-10 w-full">
                            <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 mb-4">Giá trị cốt lõi</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 w-full">
                              {[
                                'Cam kết về chất lượng',
                                'Tận tụy với khách hàng',
                                'Đổi mới không ngừng',
                                'Tinh thần tập thể',
                                'Khích lệ - hài hoà'
                              ].map((val, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></div>
                                  <span className="text-slate-600 leading-relaxed text-sm md:text-base">{val}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Lĩnh vực kinh doanh */}
                <section id="solutions" className="py-16 bg-white text-slate-900 relative overflow-hidden z-10 border-b border-slate-100">
                  <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <SectionHeader 
                      title="SẢN PHẨM VÀ DỊCH VỤ CUNG CẤP" 
                      sub="Khẳng định năng lực qua các giải pháp công nghệ cốt lõi" 
                    />

                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[
                        { title: 'Phát triển phần mềm xây dựng', icon: <BIMIcon />, desc: 'Phát triển các phần mềm chuyên ngành xây dựng, quản lý, quy hoạch làm nên thương hiệu CIC (KPW, Escon, RDW, VinaSAS…) và enjiCAD – phần mềm vẽ kỹ thuật chất lượng cao, giá cạnh tranh hơn nhiều so với CAD ngoại nhập.' },
                        { title: 'Phân phối phần mềm nhập khẩu chính hãng', icon: <ShieldCheck />, desc: 'Phân phối phần mềm bản quyền từ các hãng công nghệ hàng đầu thế giới như Microsoft, Autodesk, CSI, Cubicost, ANSYS, Bentley, DHI, Hexagon, DNV GL, Prokon, Risa…' },
                        { title: 'Thiết bị công nghệ', icon: <Cpu />, desc: 'Phân phối các thiết bị công nghệ hàm lượng khoa học cao từ những hãng uy tín thế giới như Piletest, Tecknotrove, ZXLidars, A.P. van den Berg, AQ System, Sewer Robotics, Radiodetection, Pearpoint, DJI…' },
                        { title: 'Tư vấn Xây dựng', icon: <Building2 />, desc: 'Tư vấn thiết kế, thẩm tra, giám sát, quản lý dự án công trình xây dựng, đảm bảo chất lượng và an toàn.' },
                        { title: 'BIM & Digital Twins', icon: <Box />, desc: 'Đồng hành chuyển đổi số, triển khai BIM chuyên sâu, xây dựng bản sao số (Digital Twins) cho công trình.' },
                        { title: 'Giải pháp Công nghệ thông minh', icon: <Lightbulb />, desc: 'Cung cấp và tư vấn ứng dụng các giải pháp công nghệ thông minh, AI, Big Data, IoT vào quản lý vận hành.' },
                        { title: 'Giải pháp phát triển bền vững', icon: <Leaf />, desc: 'Tư vấn phát triển bền vững, Net Zero, EPD, ESG cho các doanh nghiệp xây dựng hướng tới tương lai xanh.' },
                      ].map((item, i) => (
                        <div 
                          key={i}
                          className="flex flex-col gap-4 p-5 md:p-6 bg-slate-50 border border-slate-200 rounded-2xl hover:border-orange-300 hover:shadow-md transition-all"
                        >
                          <div className="w-14 h-14 shrink-0 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-orange-600 shadow-sm">
                            {item.icon}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Awards Section */}
                <section className="py-16 bg-slate-50 relative overflow-hidden z-10 border-b border-slate-200">
                  <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <SectionHeader 
                      title="Thành tựu & Giải thưởng" 
                      sub="Minh chứng cho nỗ lực không ngừng nghỉ" 
                    />
                    <div className="text-center mt-6 mb-12">
                      <p className="text-sm md:text-base text-slate-600 max-w-4xl mx-auto leading-relaxed font-normal text-justify">
                        Hơn 35 năm phát triển, CIC vinh dự nhận nhiều bằng khen, cúp và giải thưởng uy tín từ các cơ quan Nhà nước và hiệp hội chuyên ngành – tiêu biểu như Huân chương Lao động hạng Ba, Bằng khen của Thủ tướng Chính phủ, cùng các giải thưởng công nghệ danh giá như Sao Khuê, Sao Vàng Đất Việt và Vifotec. Đây là minh chứng cho chất lượng sản phẩm và uy tín thương hiệu mà CIC đã bền bỉ xây dựng trong suốt hành trình đồng hành cùng ngành Xây dựng Việt Nam.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-8 max-w-7xl mx-auto">
                      {[
                        { name: 'Giải thưởng Sao Khuê 2014', img: 'https://www.cic.com.vn/images/banners/original/giai-thuong-sao-khue-2014_1582012560.jpg' },
                        { name: 'Giải thưởng Sao Khuê 2015', img: 'https://www.cic.com.vn/images/banners/original/giai-thuong-sao-khue-2015_1582012665.jpg' },
                        { name: 'Cúp CNTT năm 2004', img: 'https://www.cic.com.vn/images/banners/original/cup-cntt-nam-2004_1582012378.jpg' },
                        { name: 'Giải thưởng VIFOTEC', img: 'https://www.cic.com.vn/images/banners/original/giai-thuong-vifotec_1582012769.jpg' },
                        { name: 'Huân chương Lao động hạng 3', img: 'https://www.cic.com.vn/images/banners/original/huan-chuong-lao-dong-hang-3_1582012829.jpg' },
                      ].map((award, i) => (
                        <div 
                          key={i}
                          className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col items-center hover:border-orange-300 hover:shadow-md transition-all duration-300"
                        >
                          <div className="h-20 flex items-center justify-center overflow-hidden mb-3 w-full">
                            <img src={award.img} alt={award.name} className="max-h-full max-w-full object-contain" />
                          </div>
                          <h3 className="text-[10px] font-bold text-slate-700 text-center uppercase tracking-wider">
                            {award.name}
                          </h3>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Partners Section */}
                <section className="py-10 bg-white border-b border-slate-100 overflow-hidden relative z-10">
                  <div className="max-w-7xl mx-auto px-6 mb-12 relative z-10">
                    <SectionHeader 
                      title="Khách hàng - Đối tác" 
                      sub="Đồng hành cùng phát triển bền vững" 
                    />
                    
                    <div className="text-center mt-6 mb-12">
                      <p className="text-sm md:text-base text-slate-600 max-w-4xl mx-auto leading-relaxed font-normal text-justify">
                        Với mạng lưới khách hàng rộng khắp trên cả nước, CIC hiện là đối tác tin cậy của hơn 1.000 khách hàng tại Việt Nam. Đồng thời, CIC là partner chính thức của hơn 100 hãng công nghệ hàng đầu thế giới, mang đến các giải pháp tiên tiến, hiện đại, chính hãng và có bản quyền đầy đủ. Không dừng lại ở thị trường trong nước, CIC đang tiếp tục mở rộng, hướng tới phục vụ cả khách hàng quốc tế, khẳng định vị thế trên hành trình chuyển đổi số ngành Xây dựng.
                      </p>
                    </div>
                    
                    {/* Modern Photo Album (Bento Grid) */}
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[250px] mb-12">
                      <div className="md:col-span-8 rounded-3xl overflow-hidden shadow-sm relative group">
                        <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80" alt="Activity" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <div className="md:col-span-4 rounded-3xl overflow-hidden shadow-sm relative group">
                        <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80" alt="Activity" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <div className="md:col-span-4 rounded-3xl overflow-hidden shadow-sm relative group">
                        <img src="https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80" alt="Activity" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <div className="md:col-span-8 rounded-3xl overflow-hidden shadow-sm relative group">
                        <img src="https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&q=80" alt="Activity" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Slider Partners */}
                  <div className="relative group z-10">
                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
                    
                    <motion.div 
                      animate={{ x: ["0%", "-50%"] }}
                      transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
                      className="flex gap-6 whitespace-nowrap"
                    >
                      {[...partners, ...partners].map((partner, i) => (
                        <div 
                          key={i}
                          className="flex-shrink-0 flex items-center justify-center p-4 md:p-6 rounded-lg bg-slate-50 border border-slate-100 h-20 md:h-24 w-44 md:w-48"
                        >
                          <img 
                            src={partner.logo} 
                            alt={partner.name} 
                            className="max-h-12 md:max-h-14 w-full object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300" 
                          />
                        </div>
                      ))}
                    </motion.div>
                  </div>
                </section>

             </motion.div>
          )}

        {/* ==================== 2. CƠ CẤU TỔ CHỨC ==================== */}
        {activeTab === 'structure' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-12"
          >
            {/* Structural Banner */}
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <h2 className="text-2xl md:text-4xl font-black text-slate-950 uppercase tracking-tight font-sans leading-tight">
                SƠ ĐỒ TỔ CHỨC
              </h2>
              <div className="flex items-center justify-center gap-2 pt-1">
                <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-orange-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-orange-600"></div>
                <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-orange-500"></div>
              </div>
            </div>

            {/* Sơ đồ cơ cấu tổ chức chuẩn xác theo sơ đồ gốc CIC - Tự động co giãn full chiều ngang không kéo scrollbar trên PC */}
            <div className="w-full overflow-x-auto lg:overflow-x-visible py-2">
              <div className="w-full max-w-7xl mx-auto">
                <svg 
                  viewBox="0 0 1600 560" 
                  className="w-full h-auto select-none font-sans"
                  style={{ textRendering: 'geometricPrecision' }}
                >
                  <defs>
                    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
                      <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#ea580c" floodOpacity="0.15" />
                    </filter>
                    <style>{`
                      .org-node {
                        cursor: pointer;
                        transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                      }
                      .org-node:hover {
                        transform: translateY(-3px);
                      }
                      .org-node:hover rect {
                        fill: #d93800 !important;
                        stroke: #b82d00 !important;
                        stroke-width: 2px !important;
                        filter: drop-shadow(0 6px 14px rgba(252, 81, 21, 0.4));
                      }
                    `}</style>
                  </defs>

                  {/* ================= CONNECTING LINES ================= */}
                  {/* Vertical Spine: Đại hội đồng cổ đông -> HĐQT -> Tổng Giám Đốc */}
                  <line x1="800" y1="65" x2="800" y2="95" stroke="#334155" strokeWidth="1" strokeLinecap="round" />
                  <line x1="800" y1="141" x2="800" y2="175" stroke="#334155" strokeWidth="1" strokeLinecap="round" />

                  {/* HĐQT -> Ban Kiểm Soát */}
                  <line x1="950" y1="118" x2="1210" y2="118" stroke="#334155" strokeWidth="1" strokeLinecap="round" />

                  {/* 1. Branch Sang Trái: TGĐ -> PTGĐ Left */}
                  <line x1="650" y1="198" x2="260" y2="198" stroke="#334155" strokeWidth="1" strokeLinecap="round" />
                  <line x1="260" y1="221" x2="260" y2="335" stroke="#334155" strokeWidth="1" strokeLinecap="round" />

                  {/* 2. Branch Sang Phải: TGĐ -> PTGĐ Right */}
                  <line x1="950" y1="198" x2="1340" y2="198" stroke="#334155" strokeWidth="1" strokeLinecap="round" />
                  <line x1="1340" y1="221" x2="1340" y2="320" stroke="#334155" strokeWidth="1" strokeLinecap="round" />
                  {/* Fork under PTGĐ Right */}
                  <line x1="1220" y1="320" x2="1460" y2="320" stroke="#334155" strokeWidth="1" strokeLinecap="round" />
                  <line x1="1220" y1="320" x2="1220" y2="335" stroke="#334155" strokeWidth="1" strokeLinecap="round" />
                  <line x1="1460" y1="320" x2="1460" y2="335" stroke="#334155" strokeWidth="1" strokeLinecap="round" />

                  {/* 3. Branch Xuống Giữa (Ngắn hơn): TGĐ -> P. Tổng hợp & P. Tài chính kế toán */}
                  <line x1="800" y1="221" x2="800" y2="248" stroke="#334155" strokeWidth="1" strokeLinecap="round" />
                  <line x1="630" y1="248" x2="970" y2="248" stroke="#334155" strokeWidth="1" strokeLinecap="round" />
                  <line x1="630" y1="248" x2="630" y2="260" stroke="#334155" strokeWidth="1" strokeLinecap="round" />
                  <line x1="970" y1="248" x2="970" y2="260" stroke="#334155" strokeWidth="1" strokeLinecap="round" />

                  {/* 4. Center Main Line straight down to Bottom Row Bus */}
                  <line x1="800" y1="221" x2="800" y2="425" stroke="#334155" strokeWidth="1" strokeLinecap="round" />
                  {/* Horizontal Bus Line spanning bottom row */}
                  <line x1="180" y1="425" x2="1420" y2="425" stroke="#334155" strokeWidth="1" strokeLinecap="round" />

                  {/* Connectors to Bottom Units */}
                  {/* Unit 1: CN TP. HCM (Connected) */}
                  <line x1="180" y1="425" x2="180" y2="460" stroke="#334155" strokeWidth="1" strokeLinecap="round" />
                  {/* Unit 2: TTGP Phần mềm & Thiết bị (NO connector as in original) */}
                  {/* Unit 3: TT Tư vấn Dự án (Connected) */}
                  <line x1="800" y1="425" x2="800" y2="460" stroke="#334155" strokeWidth="1" strokeLinecap="round" />
                  {/* Unit 4: TT Phần mềm Xây dựng (Connected) */}
                  <line x1="1110" y1="425" x2="1110" y2="460" stroke="#334155" strokeWidth="1" strokeLinecap="round" />
                  {/* Unit 5: TT Tư vấn PTPBV & GP CNKT (Connected) */}
                  <line x1="1420" y1="425" x2="1420" y2="460" stroke="#334155" strokeWidth="1" strokeLinecap="round" strokeDasharray="" />


                  {/* ================= BOX NODES (ORANGE THEME) ================= */}
                  {/* LEVEL 1: ĐẠI HỘI ĐỒNG CỔ ĐÔNG */}
                  <g filter="url(#shadow)" className="org-node">
                    <rect x="650" y="20" width="300" height="45" rx="4" fill="#fc5115" stroke="#d93800" strokeWidth="1.5" />
                    <text x="800" y="48" fill="#ffffff" fontSize="14" fontWeight="900" textAnchor="middle" letterSpacing="0.5">
                      ĐẠI HỘI ĐỒNG CỔ ĐÔNG
                    </text>
                  </g>

                  {/* BAN KIỂM SOÁT */}
                  <g filter="url(#shadow)" className="org-node">
                    <rect x="1210" y="95" width="260" height="46" rx="4" fill="#fc6435" stroke="#d93800" strokeWidth="1.5" />
                    <text x="1340" y="123" fill="#ffffff" fontSize="13" fontWeight="900" textAnchor="middle">
                      BAN KIỂM SOÁT
                    </text>
                  </g>

                  {/* LEVEL 2: HỘI ĐỒNG QUẢN TRỊ */}
                  <g filter="url(#shadow)" className="org-node">
                    <rect x="650" y="95" width="300" height="46" rx="4" fill="#fc5115" stroke="#d93800" strokeWidth="1.5" />
                    <text x="800" y="123" fill="#ffffff" fontSize="14" fontWeight="900" textAnchor="middle" letterSpacing="0.5">
                      HỘI ĐỒNG QUẢN TRỊ
                    </text>
                  </g>

                  {/* LEVEL 3: TỔNG GIÁM ĐỐC */}
                  <g filter="url(#shadow)" className="org-node">
                    <rect x="650" y="175" width="300" height="46" rx="4" fill="#fc5115" stroke="#d93800" strokeWidth="1.5" />
                    <text x="800" y="203" fill="#ffffff" fontSize="14" fontWeight="900" textAnchor="middle" letterSpacing="0.5">
                      TỔNG GIÁM ĐỐC
                    </text>
                  </g>

                  {/* LEFT: PHÓ TỔNG GIÁM ĐỐC */}
                  <g filter="url(#shadow)" className="org-node">
                    <rect x="130" y="177" width="260" height="44" rx="4" fill="#fc6435" stroke="#d93800" strokeWidth="1.5" />
                    <text x="260" y="204" fill="#ffffff" fontSize="13" fontWeight="800" textAnchor="middle">
                      PHÓ TỔNG GIÁM ĐỐC
                    </text>
                  </g>

                  {/* RIGHT: PHÓ TỔNG GIÁM ĐỐC */}
                  <g filter="url(#shadow)" className="org-node">
                    <rect x="1210" y="177" width="260" height="44" rx="4" fill="#fc6435" stroke="#d93800" strokeWidth="1.5" />
                    <text x="1340" y="204" fill="#ffffff" fontSize="13" fontWeight="800" textAnchor="middle">
                      PHÓ TỔNG GIÁM ĐỐC
                    </text>
                  </g>

                  {/* MIDDLE LEVEL SUB-UNITS */}
                  {/* Middle-Left (Trực thuộc TGĐ - Nhánh ngắn): P. TỔNG HỢP */}
                  <g filter="url(#shadow)" className="org-node">
                    <rect x="530" y="260" width="200" height="54" rx="4" fill="#fc5115" stroke="#d93800" strokeWidth="1.5" />
                    <text x="630" y="293" fill="#ffffff" fontSize="12" fontWeight="800" textAnchor="middle">
                      P. TỔNG HỢP
                    </text>
                  </g>

                  {/* Middle-Right (Trực thuộc TGĐ - Nhánh ngắn): P. TÀI CHÍNH KẾ TOÁN */}
                  <g filter="url(#shadow)" className="org-node">
                    <rect x="870" y="260" width="200" height="54" rx="4" fill="#fc5115" stroke="#d93800" strokeWidth="1.5" />
                    <text x="970" y="293" fill="#ffffff" fontSize="12" fontWeight="800" textAnchor="middle">
                      P. TÀI CHÍNH KẾ TOÁN
                    </text>
                  </g>

                  {/* Left sub-unit (Trực thuộc PTGĐ - Nhánh dài hơn): TT. TƯ VẤN THIẾT KẾ XÂY DỰNG */}
                  <g filter="url(#shadow)" className="org-node">
                    <rect x="120" y="335" width="280" height="58" rx="4" fill="#fc6435" stroke="#d93800" strokeWidth="1.5" />
                    <text x="260" y="362" fill="#ffffff" fontSize="12" fontWeight="800" textAnchor="middle">
                      TT. TƯ VẤN THIẾT KẾ
                    </text>
                    <text x="260" y="378" fill="#ffffff" fontSize="12" fontWeight="800" textAnchor="middle">
                      XÂY DỰNG
                    </text>
                  </g>

                  {/* Right sub-unit 1 (Trực thuộc PTGĐ - Nhánh dài hơn): TTGP. PHẦN MỀM NHẬP KHẨU TRONG XD */}
                  <g filter="url(#shadow)" className="org-node">
                    <rect x="1115" y="335" width="210" height="58" rx="4" fill="#fc6435" stroke="#d93800" strokeWidth="1.5" />
                    <text x="1220" y="362" fill="#ffffff" fontSize="11.5" fontWeight="800" textAnchor="middle">
                      TTGP. PHẦN MỀM NHẬP KHẨU
                    </text>
                    <text x="1220" y="378" fill="#ffffff" fontSize="11.5" fontWeight="800" textAnchor="middle">
                      TRONG XD
                    </text>
                  </g>

                  {/* Right sub-unit 2 (Trực thuộc PTGĐ - Nhánh dài hơn): TT. TƯ VẤN BIM SỐ HÓA CÔNG TRÌNH */}
                  <g filter="url(#shadow)" className="org-node">
                    <rect x="1355" y="335" width="210" height="58" rx="4" fill="#fc6435" stroke="#d93800" strokeWidth="1.5" />
                    <text x="1460" y="362" fill="#ffffff" fontSize="11.5" fontWeight="800" textAnchor="middle">
                      TT. TƯ VẤN BIM &amp;
                    </text>
                    <text x="1460" y="378" fill="#ffffff" fontSize="11.5" fontWeight="800" textAnchor="middle">
                      SỐ HÓA CÔNG TRÌNH
                    </text>
                  </g>

                  {/* ================= BOTTOM ROW UNITS ================= */}
                  {/* 1. CN. TP HỒ CHÍ MINH */}
                  <g filter="url(#shadow)" className="org-node">
                    <rect x="70" y="460" width="220" height="68" rx="4" fill="#fc5115" stroke="#d93800" strokeWidth="1.5" />
                    <text x="180" y="499" fill="#ffffff" fontSize="12" fontWeight="800" textAnchor="middle">
                      CN. TP HỒ CHÍ MINH
                    </text>
                  </g>

                  {/* 2. TTGP. PHẦN MỀM & THIẾT BỊ CÔNG NGHỆ (Unconnected as specified) */}
                  <g filter="url(#shadow)" className="org-node">
                    <rect x="375" y="460" width="230" height="68" rx="4" fill="#fc5115" stroke="#d93800" strokeWidth="1.5" />
                    <text x="490" y="491" fill="#ffffff" fontSize="11.5" fontWeight="800" textAnchor="middle">
                      TTGP. PHẦN MỀM &amp;
                    </text>
                    <text x="490" y="509" fill="#ffffff" fontSize="11.5" fontWeight="800" textAnchor="middle">
                      THIẾT BỊ CÔNG NGHỆ
                    </text>
                  </g>

                  {/* 3. TT. TƯ VẤN DỰ ÁN */}
                  <g filter="url(#shadow)" className="org-node">
                    <rect x="690" y="460" width="220" height="68" rx="4" fill="#fc5115" stroke="#d93800" strokeWidth="1.5" />
                    <text x="800" y="499" fill="#ffffff" fontSize="12" fontWeight="800" textAnchor="middle">
                      TT. TƯ VẤN DỰ ÁN
                    </text>
                  </g>

                  {/* 4. TT. PHẦN MỀM XÂY DỰNG */}
                  <g filter="url(#shadow)" className="org-node">
                    <rect x="1000" y="460" width="220" height="68" rx="4" fill="#fc5115" stroke="#d93800" strokeWidth="1.5" />
                    <text x="1110" y="499" fill="#ffffff" fontSize="12" fontWeight="800" textAnchor="middle">
                      TT. PHẦN MỀM XÂY DỰNG
                    </text>
                  </g>

                  {/* 5. TT. TƯ VẤN PTPBV & GIẢI PHÁP CNKT */}
                  <g filter="url(#shadow)" className="org-node">
                    <rect x="1300" y="460" width="240" height="68" rx="4" fill="#fc5115" stroke="#d93800" strokeWidth="1.5" />
                    <text x="1420" y="491" fill="#ffffff" fontSize="11.5" fontWeight="800" textAnchor="middle">
                      TT. TƯ VẤN PTPBV &amp;
                    </text>
                    <text x="1420" y="509" fill="#ffffff" fontSize="11.5" fontWeight="800" textAnchor="middle">
                      GIẢI PHÁP CNKT
                    </text>
                  </g>
                </svg>
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
            {/* Section I: THÔNG TIN PHÁP LÝ & ĐƠN VỊ */}
            <div className="space-y-8">
              <div className="text-center max-w-3xl mx-auto space-y-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-orange-50 border border-orange-200/80 text-orange-700 font-black uppercase tracking-widest text-[10px]">
                  <Award size={13} className="text-orange-600" />
                  <span>NĂNG LỰC & KINH NGHIỆM</span>
                </div>
                <h2 className="text-2xl md:text-4xl font-black text-slate-950 uppercase tracking-tight font-sans leading-tight">
                  HỒ SƠ NĂNG LỰC & THÔNG TIN PHÁP LÝ
                </h2>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-orange-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-600"></div>
                  <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-orange-500"></div>
                </div>
                <p className="text-orange-600 text-xs md:text-sm font-bold uppercase tracking-wider">
                  Pháp lý minh bạch - Đơn vị thành viên tập đoàn tư vấn xây dựng Việt Nam (VC Group)
                </p>
              </div>

              {/* Twin Office Locations Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                {/* Trụ sở chính Hà Nội */}
                <div className="bg-white border border-slate-200 p-6 md:p-8 flex flex-col justify-between space-y-6 shadow-sm hover:border-orange-500 hover:shadow-md transition-all duration-300">
                  <div className="space-y-6">
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
                        <span className="text-[10px] text-slate-400 font-sans font-black uppercase">Địa chỉ trụ sở:</span>
                        <p className="text-slate-950 font-bold flex items-start gap-2.5">
                          <MapPin size={16} className="text-orange-600 shrink-0 mt-0.5" />
                          <span>37 Lê Đại Hành - Quận Hai Bà Trưng - Hà Nội</span>
                        </p>
                      </div>

                      <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-4">
                        <span className="text-[10px] text-slate-400 font-sans font-black uppercase">Quyết định thành lập số:</span>
                        <p className="text-slate-950 font-bold flex items-center gap-2.5">
                          <FileText size={14} className="text-slate-500 shrink-0" />
                          <span>1765/QĐ-BXD ngày 21/12/2006 (Bộ Xây Dựng)</span>
                        </p>
                      </div>

                      <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-4">
                        <span className="text-[10px] text-slate-400 font-sans font-black uppercase">Điện thoại liên hệ:</span>
                        <p className="text-slate-950 font-bold flex items-center gap-2.5">
                          <Phone size={14} className="text-slate-500 shrink-0" />
                          <span>84.4.39.781 / 39.741.313</span>
                        </p>
                      </div>

                      <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-4">
                        <span className="text-[10px] text-slate-400 font-sans font-black uppercase">Số Fax:</span>
                        <p className="text-slate-950 font-bold flex items-center gap-2.5">
                          <Phone size={14} className="text-slate-400 shrink-0" />
                          <span>84.4.38.216.793</span>
                        </p>
                      </div>

                      <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-4">
                        <span className="text-[10px] text-slate-400 font-sans font-black uppercase">Thư điện tử (Email):</span>
                        <p className="text-slate-950 font-bold flex items-center gap-2.5">
                          <Mail size={14} className="text-slate-500 shrink-0" />
                          <a href="mailto:info@cic.com.vn" className="hover:text-orange-600 transition-colors">info@cic.com.vn</a>
                        </p>
                      </div>

                      <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-4">
                        <span className="text-[10px] text-slate-400 font-sans font-black uppercase">Trang tin điện tử (Website):</span>
                        <p className="text-slate-950 font-bold flex items-center gap-2.5">
                          <Globe size={14} className="text-slate-500 shrink-0" />
                          <a href="http://www.cic.com.vn" target="_blank" rel="noreferrer" className="text-orange-600 hover:underline">www.cic.com.vn</a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chi nhánh TP. Hồ Chí Minh */}
                <div className="bg-white border border-slate-200 p-6 md:p-8 flex flex-col justify-between space-y-6 shadow-sm hover:border-orange-500 hover:shadow-md transition-all duration-300">
                  <div className="space-y-6">
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
                        <span className="text-[10px] text-slate-400 font-sans font-black uppercase">Địa chỉ chi nhánh:</span>
                        <p className="text-slate-950 font-bold flex items-start gap-2.5">
                          <MapPin size={16} className="text-orange-600 shrink-0 mt-0.5" />
                          <span>36 Nguyễn Huy Lượng - P.14 - Q.Bình Thạnh - TP.HCM</span>
                        </p>
                      </div>

                      <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-4">
                        <span className="text-[10px] text-slate-400 font-sans font-black uppercase">Quyết định thành lập số:</span>
                        <p className="text-slate-950 font-bold flex items-center gap-2.5">
                          <FileText size={14} className="text-slate-500 shrink-0" />
                          <span>939/QĐ-BXD ngày 13/07/2000 (Bộ Xây Dựng)</span>
                        </p>
                      </div>

                      <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-4">
                        <span className="text-[10px] text-slate-400 font-sans font-black uppercase">Điện thoại liên hệ:</span>
                        <p className="text-slate-950 font-bold flex items-center gap-2.5">
                          <Phone size={14} className="text-slate-500 shrink-0" />
                          <span>84.8.628.99.022 – 628.99.033</span>
                        </p>
                      </div>

                      <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-4">
                        <span className="text-[10px] text-slate-400 font-sans font-black uppercase">Số Fax:</span>
                        <p className="text-slate-950 font-bold flex items-center gap-2.5">
                          <Phone size={14} className="text-slate-400 shrink-0" />
                          <span>84.8.628.99.033</span>
                        </p>
                      </div>

                      <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-4">
                        <span className="text-[10px] text-slate-400 font-sans font-black uppercase">Thư điện tử (Email):</span>
                        <p className="text-slate-950 font-bold flex items-center gap-2.5">
                          <Mail size={14} className="text-slate-500 shrink-0" />
                          <a href="mailto:cichcm@cic.com.vn" className="hover:text-orange-600 transition-colors">cichcm@cic.com.vn</a>
                        </p>
                      </div>

                      <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-4">
                        <span className="text-[10px] text-slate-400 font-sans font-black uppercase">Trang tin điện tử (Website):</span>
                        <p className="text-slate-950 font-bold flex items-center gap-2.5">
                          <Globe size={14} className="text-slate-500 shrink-0" />
                          <a href="http://www.cic.com.vn" target="_blank" rel="noreferrer" className="text-orange-600 hover:underline">www.cic.com.vn</a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Core Legal & Banking Card */}
              <div className="bg-slate-900 text-white p-6 md:p-8 space-y-6 shadow-md border-l-4 border-orange-600">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] text-orange-400 font-sans font-black tracking-widest uppercase block mb-1">
                      HỒ SƠ ĐĂNG KÝ DOANH NGHIỆP & TÀI KHOẢN GIAO DỊCH
                    </span>
                    <h4 className="text-lg md:text-xl font-black text-white uppercase tracking-tight">
                      CÔNG TY CỔ PHẦN CÔNG NGHỆ VÀ TƯ VẤN CIC
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 px-3 py-1.5 self-start sm:self-auto">
                    <ShieldAlert size={16} className="text-orange-500 shrink-0" />
                    <span className="text-xs text-slate-300 font-bold">MST: <strong className="text-white font-extrabold">01 0077 5353</strong></span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs md:text-sm">
                  {/* Left Column: Legal Registration */}
                  <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-slate-400 font-sans font-black uppercase tracking-wider">Đăng ký kinh doanh số:</span>
                      <p className="text-slate-100 font-medium flex items-start gap-2.5">
                        <CheckCircle2 size={16} className="text-orange-500 shrink-0 mt-0.5" />
                        <span>0100775353 ngày 29/05/2013 (thay đổi lần 3) do Phòng đăng ký kinh doanh - Sở KHĐT Hà Nội cấp</span>
                      </p>
                    </div>

                    <div className="flex flex-col gap-1 border-t border-slate-800/80 pt-3">
                      <span className="text-[10px] text-slate-400 font-sans font-black uppercase tracking-wider">Mã số thuế doanh nghiệp:</span>
                      <p className="text-slate-100 font-bold flex items-center gap-2.5">
                        <ShieldAlert size={16} className="text-orange-500 shrink-0" />
                        <span>01 0077 5353</span>
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Bank Account Details */}
                  <div className="space-y-4 md:border-l md:border-slate-800 md:pl-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-slate-400 font-sans font-black uppercase tracking-wider">Tài khoản ngân hàng giao dịch:</span>
                      <p className="text-white font-extrabold text-sm md:text-base flex items-center gap-2.5 text-orange-400">
                        <DollarSign size={18} className="text-orange-500 shrink-0" />
                        <span>120.10.00.001477.7</span>
                      </p>
                      <p className="text-slate-400 text-xs italic pl-7">
                        Tại Sở giao dịch Ngân hàng Đầu tư và Phát triển Việt Nam (BIDV)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section II: GIỚI THIỆU VỀ CÔNG TY VÀ QUÁ TRÌNH PHÁT TRIỂN */}
            <div className="space-y-8 pt-6 border-t border-slate-200">
              <div className="text-center max-w-3xl mx-auto space-y-2.5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 font-black uppercase tracking-widest text-[10px]">
                  <Clock size={13} className="text-orange-600" />
                  <span>QUÁ TRÌNH THÀNH LẬP</span>
                </div>
                <h3 className="text-xl md:text-3xl font-black text-slate-950 uppercase tracking-tight">
                  LỊCH SỬ HÌNH THÀNH & TẦM NHÌN SỨ MỆNH
                </h3>
                <div className="flex items-center justify-center gap-2 pt-0.5">
                  <div className="w-10 h-[2px] bg-gradient-to-r from-transparent to-orange-500"></div>
                  <div className="w-2 h-2 rounded-full bg-orange-600"></div>
                  <div className="w-10 h-[2px] bg-gradient-to-l from-transparent to-orange-500"></div>
                </div>
                <p className="text-orange-600 text-xs md:text-sm font-bold uppercase tracking-wider">
                  35 năm trưởng thành - Đồng hành cùng nền kỹ thuật & công nghệ Việt Nam
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

              </div>
            </div>

            {/* Section II: CÁC LĨNH VỰC KINH DOANH CHỦ YẾU */}
            <div className="space-y-8 pt-6 border-t border-slate-200">
              <div className="text-center max-w-3xl mx-auto space-y-2.5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 font-black uppercase tracking-widest text-[10px]">
                  <Layers size={13} className="text-orange-600" />
                  <span>PHÂN NHÓM CHUYÊN MÔN</span>
                </div>
                <h3 className="text-xl md:text-3xl font-black text-slate-950 uppercase tracking-tight">
                  CÁC LĨNH VỰC KINH DOANH NÒNG CỐT
                </h3>
                <div className="flex items-center justify-center gap-2 pt-0.5">
                  <div className="w-10 h-[2px] bg-gradient-to-r from-transparent to-orange-500"></div>
                  <div className="w-2 h-2 rounded-full bg-orange-600"></div>
                  <div className="w-10 h-[2px] bg-gradient-to-l from-transparent to-orange-500"></div>
                </div>
                <p className="text-orange-600 text-xs md:text-sm font-bold uppercase tracking-wider">
                  Giải pháp tổng thể - Tư vấn tiên phong - Bứt phá công nghệ
                </p>
              </div>

              {/* 3 Pillar Header Navigation Pills */}
              <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
                <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider mr-2">Nhóm mảng:</span>
                {businessPillars.map((pillar, pIdx) => {
                  const isActive = activePillarIndex === pIdx;
                  const Icon = pillar.icon;
                  return (
                    <button
                      key={pIdx}
                      onClick={() => {
                        setActivePillarIndex(pIdx);
                        const firstFieldId = pillar.fieldIds[0];
                        const foundIdx = businessFields.findIndex(f => f.id === firstFieldId);
                        if (foundIdx !== -1) setActiveFieldIndex(foundIdx);
                      }}
                      className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold transition-all duration-200 border cursor-pointer ${
                        isActive
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <Icon size={14} className={isActive ? 'text-orange-400' : 'text-slate-500'} />
                      <span>{pillar.title}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 font-sans font-black ${isActive ? 'bg-slate-800 text-orange-400' : 'bg-slate-100 text-slate-500'}`}>
                        {pillar.fieldIds.length}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Master-Detail Interactive Layout (No Boxed Grid!) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left side list of fields in current active pillar */}
                <div className="lg:col-span-5 space-y-1.5">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1 mb-2">
                    Danh mục Lĩnh vực ({businessPillars[activePillarIndex].fieldIds.length} mảng)
                  </div>
                  {businessPillars[activePillarIndex].fieldIds.map((fId) => {
                    const fieldObj = businessFields.find(f => f.id === fId);
                    if (!fieldObj) return null;
                    const realIdx = businessFields.findIndex(f => f.id === fId);
                    const isSelected = activeFieldIndex === realIdx;

                    return (
                      <button
                        key={fId}
                        onClick={() => setActiveFieldIndex(realIdx)}
                        className={`w-full text-left p-3.5 transition-all duration-200 flex items-center justify-between group cursor-pointer border-l-4 ${
                          isSelected
                            ? 'bg-slate-900 text-white border-orange-500 shadow-md pl-4'
                            : 'bg-white hover:bg-slate-100/80 text-slate-800 border-transparent border-b border-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-3 pr-2">
                          <span className="text-xs md:text-sm font-bold leading-snug line-clamp-1">
                            {fieldObj.title}
                          </span>
                        </div>
                        <ChevronRight size={14} className={`shrink-0 transition-transform ${isSelected ? 'text-orange-400 translate-x-1' : 'text-slate-400 group-hover:text-slate-600'}`} />
                      </button>
                    );
                  })}
                </div>

                {/* Right side Spotlight Detail Canvas */}
                <div className="lg:col-span-7 bg-slate-900 text-white p-6 md:p-8 border-l-4 border-orange-500 shadow-lg space-y-6 relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="bg-orange-600 text-white text-xs font-sans font-black px-2.5 py-1">
                        LĨNH VỰC CHUYÊN MÔN
                      </span>
                      <span className="text-[11px] text-orange-400 font-bold uppercase tracking-wider">
                        {businessPillars[activePillarIndex].title}
                      </span>
                    </div>
                    {(() => {
                      const ActiveIcon = businessFields[activeFieldIndex].icon;
                      return <ActiveIcon size={24} className="text-orange-500" />;
                    })()}
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-lg md:text-xl font-black uppercase text-white tracking-tight leading-snug">
                      {businessFields[activeFieldIndex].title}
                    </h4>
                    <p className="text-slate-300 text-xs md:text-sm leading-relaxed font-medium text-justify">
                      {businessFields[activeFieldIndex].desc}
                    </p>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-slate-800">
                    <div className="flex items-center gap-2">
                      <Sparkles size={14} className="text-orange-400" />
                      <span className="text-[11px] font-black uppercase text-orange-400 tracking-wider">
                        CÔNG CỤ & CÔNG NGHỆ CỐT LÕI HỢP TÁC / CHUYỂN GIAO:
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {businessFields[activeFieldIndex].techs.map((tech, tIdx) => (
                        <span 
                          key={tIdx} 
                          className="bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold px-3 py-1 hover:border-orange-500 transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {onNavigateToContact && (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={onNavigateToContact}
                        className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-black uppercase px-4 py-2.5 flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <span>Tư vấn mảng này</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* HỒ SƠ KINH NGHIỆM THEO SỐ NĂM TÍCH LŨY */}
            <div className="space-y-8 pt-6 border-t border-slate-200">
              <div className="text-center max-w-3xl mx-auto space-y-2.5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 font-black uppercase tracking-widest text-[10px]">
                  <Trophy size={13} className="text-orange-600" />
                  <span>TÍCH LŨY THỰC CHIẾN</span>
                </div>
                <h3 className="text-xl md:text-3xl font-black text-slate-950 uppercase tracking-tight">
                  HỒ SƠ KINH NGHIỆM THEO SỐ NĂM HOẠT ĐỘNG
                </h3>
                <div className="flex items-center justify-center gap-2 pt-0.5">
                  <div className="w-10 h-[2px] bg-gradient-to-r from-transparent to-orange-500"></div>
                  <div className="w-2 h-2 rounded-full bg-orange-600"></div>
                  <div className="w-10 h-[2px] bg-gradient-to-l from-transparent to-orange-500"></div>
                </div>
                <p className="text-orange-600 text-xs md:text-sm font-bold uppercase tracking-wider">
                  Chuyên môn vững vàng - Dự án trọng điểm - Uy tín tích lũy từ năm 1990
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
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
                  <div 
                    key={idx} 
                    className="bg-white border border-slate-200/90 hover:border-orange-400 p-4 md:p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 transition-all duration-200 group hover:shadow-xs"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="w-8 h-8 rounded bg-orange-50 text-orange-600 font-sans font-bold flex items-center justify-center text-xs shrink-0 border border-orange-200/80 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                        {(idx + 1).toString().padStart(2, '0')}
                      </span>
                      <p className="text-slate-800 text-xs md:text-sm font-medium leading-relaxed group-hover:text-slate-950 transition-colors">
                        {item.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto bg-slate-50 group-hover:bg-orange-50 border border-slate-200 group-hover:border-orange-200 px-3 py-1.5 transition-colors">
                      <Clock size={13} className="text-orange-500" />
                      <span className="font-sans font-bold text-xs text-slate-700 group-hover:text-orange-700 whitespace-nowrap">
                        {item.years} NĂM KINH NGHIỆM
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BẢNG CƠ CẤU NHÂN SỰ CHI TIẾT THEO PHÒNG BAN */}
            <div className="space-y-6 pt-6 border-t border-slate-200">
              <div className="text-center max-w-3xl mx-auto space-y-2.5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 font-black uppercase tracking-widest text-[10px]">
                  <Users size={13} className="text-orange-600" />
                  <span>QUY MÔ NHÂN SỰ</span>
                </div>
                <h3 className="text-xl md:text-3xl font-black text-slate-950 uppercase tracking-tight">
                  BẢNG CƠ CẤU NHÂN SỰ CHI TIẾT THEO PHÒNG BAN
                </h3>
                <div className="flex items-center justify-center gap-2 pt-0.5">
                  <div className="w-10 h-[2px] bg-gradient-to-r from-transparent to-orange-500"></div>
                  <div className="w-2 h-2 rounded-full bg-orange-600"></div>
                  <div className="w-10 h-[2px] bg-gradient-to-l from-transparent to-orange-500"></div>
                </div>
                <p className="text-orange-600 text-xs md:text-sm font-bold uppercase tracking-wider">
                  Đội ngũ 100+ chuyên gia trình độ cao - 88.6% trình độ đại học & trên đại học
                </p>
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
                          className={`transition-colors duration-150 ${
                            isHovered 
                              ? 'bg-orange-50/80' 
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
            <div className="space-y-8 pt-6 border-t border-slate-200">
              <div className="text-center max-w-3xl mx-auto space-y-2.5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 font-black uppercase tracking-widest text-[10px]">
                  <Globe size={13} className="text-orange-600" />
                  <span>HỢP TÁC QUỐC TẾ</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-950 uppercase tracking-tight">BỨC TƯỜNG ĐỐI TÁC TOÀN CẦU</h2>
                <div className="flex items-center justify-center gap-2 pt-0.5">
                  <div className="w-10 h-[2px] bg-gradient-to-r from-transparent to-orange-500"></div>
                  <div className="w-2 h-2 rounded-full bg-orange-600"></div>
                  <div className="w-10 h-[2px] bg-gradient-to-l from-transparent to-orange-500"></div>
                </div>
                <p className="text-xs md:text-sm text-orange-600 font-bold uppercase tracking-wider max-w-2xl mx-auto">
                  Đại diện ủy quyền & Nhà phân phối chính hãng từ các tập đoàn công nghệ hàng đầu thế giới
                </p>
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
            <div className="space-y-8 pt-6 border-t border-slate-200">
              <div className="text-center max-w-3xl mx-auto space-y-2.5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 font-black uppercase tracking-widest text-[10px]">
                  <FileText size={13} className="text-orange-600" />
                  <span>TRA CỨU HỒ SƠ NĂNG LỰC</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-950 uppercase tracking-tight font-sans">DANH MỤC HỢP ĐỒNG TIÊU BIỂU</h2>
                <div className="flex items-center justify-center gap-2 pt-0.5">
                  <div className="w-10 h-[2px] bg-gradient-to-r from-transparent to-orange-500"></div>
                  <div className="w-2 h-2 rounded-full bg-orange-600"></div>
                  <div className="w-10 h-[2px] bg-gradient-to-l from-transparent to-orange-500"></div>
                </div>
                <p className="text-orange-600 text-xs md:text-sm font-bold uppercase tracking-wider">
                  Minh bạch năng lực thực thi - Tra cứu hồ sơ dự án tiêu biểu theo chuyên ngành
                </p>
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
                    if (onNavigateToContact) {
                      onNavigateToContact();
                    } else {
                      const el = document.getElementById('contact');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="px-6 py-3 bg-slate-950 hover:bg-slate-900 text-white text-xs font-black uppercase tracking-wider rounded-none shrink-0 transition-all active:scale-95 shadow-xl border-2 border-slate-950 cursor-pointer"
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
