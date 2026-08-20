/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo, useState } from 'react';
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
  Leaf,
  Download
} from 'lucide-react';

import { getHomeAwards, getHomePartners } from '../features/home/homeData';
import { AwardsSlider } from './AwardsSlider';
import { BIMIcon } from '@shared/components/Icons';
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

const SectionHeader = ({ title, sub, dark }: { title: string; sub?: string; dark?: boolean }) => (
  <div className="text-center mb-6">
    <h2 className={`text-3xl md:text-4xl font-black uppercase tracking-tighter mb-2 ${dark ? 'text-white' : 'text-slate-950'}`}>
      {title}
    </h2>
    <div className="w-16 h-1 bg-orange-600 mx-auto mt-2 mb-4"></div>
    {sub && (
      <p className={`font-bold uppercase tracking-widest text-[10px] ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
        {sub}
      </p>
    )}
  </div>
);

interface AboutViewProps {
  activeTab: 'overview' | 'structure' | 'experience';
  setActiveTab: (tab: 'overview' | 'structure' | 'experience') => void;
  onNavigateToContact?: () => void;
}

export const AboutView = ({ activeTab, setActiveTab, onNavigateToContact }: AboutViewProps) => {
  const homeAwards = useMemo(getHomeAwards, []);
  const partners = useMemo(getHomePartners, []);
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
    <div className="pt-24 bg-transparent min-h-screen relative">
      {/* Visual Top Hero Banner */}
      <section className="relative pt-24 pb-14 lg:pt-36 lg:pb-20 overflow-hidden bg-slate-900 z-10 border-b border-slate-800">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80" 
            alt="CIC Technology Banner"
            className="w-full h-full object-cover opacity-75 scale-105 filter brightness-105 contrast-105"
          />
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-screen scale-105"
            src="https://cdn.pixabay.com/video/2020/01/31/31755-388274351_large.mp4" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-slate-950/20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 via-transparent to-slate-950/40"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/60 border border-white/20 rounded-[8px] mb-4 lg:mb-6 backdrop-blur-md shadow-lg">
            <span className="flex h-2 w-2 rounded-full bg-orange-600 animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">
              Về chúng tôi
            </span>
          </div>
          
          <h1 className="text-[4.5vw] sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-white leading-[1.3] mb-3 lg:mb-4 tracking-tighter max-w-full mx-auto whitespace-nowrap [text-shadow:_0_4px_12px_rgb(0_0_0_/_80%)]">
            HƠN 35 NĂM NHỊP BƯỚC <span className="text-orange-500">CÙNG CÔNG NGHỆ</span>
          </h1>

          <p className="text-slate-100 text-sm md:text-base max-w-2xl mx-auto font-medium leading-relaxed [text-shadow:_0_2px_8px_rgb(0_0_0_/_80%)]">
            Tiên phong cung cấp giải pháp phần mềm kỹ thuật, thiết bị công nghệ và tư vấn chuyển đổi số toàn diện cho ngành Xây dựng Việt Nam.
          </p>
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
                  className={`relative px-4 py-4 text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap shrink-0 flex items-center gap-2 rounded-[8px] ${
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

      {/* Main Dynamic View Content Container */}
      <div className="relative min-h-[600px]">
        {/* Contained Brand Watermark */}
        {activeTab === 'structure' ? (
          /* Static Watermark for Structure Page - Fully fixed & centered behind the organization diagram */
          <div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 pt-16" 
            aria-hidden="true"
          >
            <div className="w-[240px] sm:w-[340px] md:w-[420px] lg:w-[480px] max-w-[70vw] aspect-square opacity-[0.04]">
              <img 
                src="/logo CIC-12.png" 
                alt="" 
                className="w-full h-full object-contain filter grayscale contrast-125" 
              />
            </div>
          </div>
        ) : (
          /* Scrolling Watermark for Overview & Experience - Locks in the vertical center of the screen while scrolling */
          <div 
            className="absolute inset-0 pointer-events-none select-none z-0" 
            aria-hidden="true"
          >
            <div className="sticky top-1/2 -translate-y-1/2 flex items-center justify-center w-full min-h-[400px]">
              <div className="w-[240px] sm:w-[340px] md:w-[420px] lg:w-[480px] max-w-[70vw] aspect-square opacity-[0.045] transition-opacity duration-300">
                <img 
                  src="/logo CIC-12.png" 
                  alt="" 
                  className="w-full h-full object-contain filter grayscale contrast-125" 
                />
              </div>
            </div>
          </div>
        )}

        {/* Main Dynamic View Content */}
        <div className="max-w-7xl mx-auto px-6 pt-4 md:pt-6 pb-12 lg:pb-16 relative z-10">
        
        {/* ==================== 1. TỔNG QUAN DOANH NGHIỆP ==================== */}
        {activeTab === 'overview' && (
             <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full space-y-6 lg:space-y-8"
             >
                {/* 0. Giới Thiệu & Video */}
                <section className="pb-4 lg:pb-6 bg-transparent relative overflow-hidden z-10 border-b border-slate-100">
                  <div className="w-full relative z-10">
                    <SectionHeader 
                      title="Tổng quan doanh nghiệp" 
                    />
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
                      <div className="relative aspect-video rounded-[10px] overflow-hidden shadow-xl border-4 border-slate-100 bg-black">
                        <iframe 
                          className="w-full h-full scale-[1.03] origin-center"
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
                <section className="py-6 md:py-8 bg-transparent relative overflow-hidden border-b border-slate-100 z-10">
                  <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-600 rounded-[8px] mb-2">
                        <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse"></span>
                        <span className="text-[10px] font-black uppercase tracking-widest">Hành trình 35 năm</span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-2 text-slate-900">Lịch sử phát triển</h2>
                      <p className="text-slate-500 max-w-2xl mx-auto text-sm">Chặng đường vươn lên trở thành một trong những đơn vị tiên phong trong lĩnh vực công nghệ và tư vấn xây dựng tại Việt Nam.</p>
                    </div>

                    <div className="relative max-w-6xl mx-auto px-4 mt-4 md:mt-6">
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
                      <div className="relative aspect-[4/5] rounded-[10px] overflow-hidden shadow-sm group hidden lg:block">
                        <img src="/35nam_cic_1.JPG" alt="Định hướng chiến lược" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-[10px]" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent pointer-events-none"></div>
                      </div>

                      {/* Right: Content Blocks */}
                      <div className="flex flex-col gap-6">
                        {/* Sứ mệnh */}
                        <div className="p-8 bg-white rounded-[10px] border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-6 items-start hover:border-orange-200 transition-colors">
                          <div className="w-14 h-14 shrink-0 rounded-[8px] bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100">
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
                        <div className="p-8 bg-white rounded-[10px] border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-6 items-start hover:border-blue-200 transition-colors">
                          <div className="w-14 h-14 shrink-0 rounded-[8px] bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
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
                        <div className="p-8 bg-white rounded-[10px] border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-6 items-start hover:border-orange-200 transition-colors">
                          <div className="w-14 h-14 shrink-0 rounded-[8px] bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100">
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
                <section id="solutions" className="py-16 bg-transparent text-slate-900 relative overflow-hidden z-10 border-b border-slate-100">
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
                          className="flex flex-col gap-4 p-5 md:p-6 bg-slate-50 border border-slate-200 rounded-[10px] hover:border-orange-300 hover:shadow-md transition-all"
                        >
                          <div className="w-14 h-14 shrink-0 rounded-[8px] bg-white border border-slate-200 flex items-center justify-center text-orange-600 shadow-sm">
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
                <section className="py-16 bg-slate-50/60 relative overflow-hidden z-10 border-b border-slate-200">
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
                    <div className="mt-8">
                      <AwardsSlider awards={homeAwards} />
                    </div>
                  </div>
                </section>

                {/* Partners Section */}
                <section className="py-10 bg-transparent border-b border-slate-100 overflow-hidden relative z-10">
                  <div className="max-w-7xl mx-auto px-6 mb-12 relative z-10">
                    <SectionHeader 
                      title="Đối tác chiến lược" 
                      sub="Hợp tác cùng các tập đoàn công nghệ hàng đầu thế giới" 
                    />
                    
                    <div className="text-center mt-6 mb-12">
                      <p className="text-sm md:text-base text-slate-600 max-w-4xl mx-auto leading-relaxed font-normal text-justify">
                        Với mạng lưới khách hàng rộng khắp trên cả nước, CIC hiện là đối tác tin cậy của hơn 1.000 khách hàng tại Việt Nam. Đồng thời, CIC là partner chính thức của hơn 100 hãng công nghệ hàng đầu thế giới, mang đến các giải pháp tiên tiến, hiện đại, chính hãng và có bản quyền đầy đủ. Không dừng lại ở thị trường trong nước, CIC đang tiếp tục mở rộng, hướng tới phục vụ cả khách hàng quốc tế, khẳng định vị thế trên hành trình chuyển đổi số ngành Xây dựng.
                      </p>
                    </div>
                    
                    {/* Modern Photo Album (Bento Grid) */}
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[250px] mb-12">
                      <div className="md:col-span-8 rounded-[10px] overflow-hidden shadow-sm relative group">
                        <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80" alt="Activity" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-[10px]" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <div className="md:col-span-4 rounded-[10px] overflow-hidden shadow-sm relative group">
                        <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80" alt="Activity" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-[10px]" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <div className="md:col-span-4 rounded-[10px] overflow-hidden shadow-sm relative group">
                        <img src="https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80" alt="Activity" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-[10px]" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <div className="md:col-span-8 rounded-[10px] overflow-hidden shadow-sm relative group">
                        <img src="https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&q=80" alt="Activity" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-[10px]" />
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
                        <motion.div 
                          key={i}
                          whileHover={{ scale: 1.05, y: -5 }}
                          className="flex-shrink-0 flex items-center justify-center p-4 md:p-6 rounded-[10px] bg-white border border-slate-100 hover:shadow-xl hover:border-orange-200 transition-all cursor-pointer h-20 md:h-24 w-44 md:w-48 group"
                        >
                          <img 
                            src={partner.logo} 
                            alt={partner.name} 
                            className="max-h-12 md:max-h-14 w-full object-contain grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500" 
                          />
                        </motion.div>
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
            className="space-y-12 relative overflow-hidden z-10"
          >
            {/* Structural Banner */}
            <div className="relative z-10">
              <SectionHeader title="Cơ cấu tổ chức" />
            </div>

            {/* Sơ đồ cơ cấu tổ chức chuẩn xác theo sơ đồ gốc CIC - Tự động co giãn full chiều ngang không kéo scrollbar trên PC */}
            <div className="w-full overflow-x-auto lg:overflow-x-visible py-2 relative z-10">
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
            key="capacity"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full space-y-16 relative overflow-hidden z-10"
          >
            {/* Top Capacity & Scale Overview */}
            <div className="w-full bg-transparent">
              <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col items-center text-center pt-2">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter text-slate-900 leading-tight">
                    Tiềm lực vững vàng, <br/><span className="text-orange-600">vươn tầm quốc tế</span>
                  </h2>
                  <div className="w-16 h-1 bg-orange-600 mx-auto mt-3 mb-6"></div>
                  <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-10 max-w-3xl">
                    Trải qua 35 năm hình thành và phát triển, CIC đã xây dựng được một đội ngũ nhân sự chất lượng cao, mạng lưới đối tác toàn cầu và danh mục khách hàng rộng khắp, khẳng định vị thế vững chắc trong lĩnh vực công nghệ và xây dựng.
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16 w-full">
                    <div className="bg-slate-50 p-6 rounded-[10px] border border-slate-200 flex flex-col items-center text-center hover:border-orange-500 hover:shadow-md transition-all">
                      <div className="text-3xl md:text-4xl font-black text-orange-600 mb-2">150+</div>
                      <div className="text-xs md:text-sm font-bold text-slate-600 uppercase">Nhân sự chất lượng cao</div>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-[10px] border border-slate-200 flex flex-col items-center text-center hover:border-orange-500 hover:shadow-md transition-all">
                      <div className="text-3xl md:text-4xl font-black text-orange-600 mb-2">100+</div>
                      <div className="text-xs md:text-sm font-bold text-slate-600 uppercase">Đối tác toàn cầu</div>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-[10px] border border-slate-200 flex flex-col items-center text-center hover:border-orange-500 hover:shadow-md transition-all">
                      <div className="text-3xl md:text-4xl font-black text-orange-600 mb-2">5.000+</div>
                      <div className="text-xs md:text-sm font-bold text-slate-600 uppercase">Dự án thành công</div>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-[10px] border border-slate-200 flex flex-col items-center text-center hover:border-orange-500 hover:shadow-md transition-all">
                      <div className="text-3xl md:text-4xl font-black text-orange-600 mb-2">35+</div>
                      <div className="text-xs md:text-sm font-bold text-slate-600 uppercase">Năm kinh nghiệm</div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-12 lg:gap-16 text-left w-full mb-12">
                    {/* 1. Phát triển nguồn nhân lực chất lượng cao */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
                      <div className="rounded-[10px] overflow-hidden shadow-md">
                        <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80" alt="Phát triển nguồn nhân lực chất lượng cao" className="w-full h-[260px] md:h-[320px] object-cover rounded-[10px]" />
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-4">Phát triển nguồn nhân lực chất lượng cao</h3>
                        <p className="text-slate-600 text-base md:text-lg leading-relaxed">
                          Chú trọng đào tạo, phát triển nguồn nhân sự chất lượng cao, thu hút nhân sự trẻ, chất lượng, nhiệt huyết và sẵn sàng học hỏi, tiếp cận công nghệ mới.
                        </p>
                      </div>
                    </div>

                    {/* 2. Đối tác chiến lược với các hãng công nghệ danh tiếng */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center md:flex-row-reverse">
                      <div className="order-1 md:order-2 rounded-[10px] overflow-hidden shadow-md">
                        <img src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80" alt="Đối tác chiến lược" className="w-full h-[260px] md:h-[320px] object-cover rounded-[10px]" />
                      </div>
                      <div className="order-2 md:order-1">
                        <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-4">Đối tác chiến lược với các hãng công nghệ danh tiếng</h3>
                        <p className="text-slate-600 text-base md:text-lg leading-relaxed">
                          Hợp tác sâu rộng với hơn 100 hãng công nghệ, sản xuất phần mềm, thiết bị danh tiếng trên thế giới. Là partner chính thức tại Việt Nam.
                        </p>
                      </div>
                    </div>

                    {/* 3. Cập nhật xu hướng công nghệ hàng đầu */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
                      <div className="rounded-[10px] overflow-hidden shadow-md">
                        <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80" alt="Xu hướng công nghệ" className="w-full h-[260px] md:h-[320px] object-cover rounded-[10px]" />
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-4">Cập nhật xu hướng công nghệ hàng đầu</h3>
                        <p className="text-slate-600 text-base md:text-lg leading-relaxed">
                          Đa dạng sản phẩm, dịch vụ về các giải pháp phần mềm, khoa học công nghệ hàng đầu trong các ngành kỹ thuật.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <a 
                    href="https://www.cic.com.vn/flipbooks/index.html?pdf=CICProfile2024Final.pdf" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 bg-orange-600 text-white font-black uppercase tracking-widest text-sm hover:bg-orange-700 transition-colors inline-flex items-center gap-3 rounded-[8px] shadow-lg shadow-orange-600/30 cursor-pointer"
                  >
                    <ArrowUpRight size={20} /> Hồ sơ năng lực (Profile)
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        </div>
      </div>
    </div>
  );
};
