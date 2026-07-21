import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Lock, 
  Database, 
  Eye, 
  Server, 
  UserCheck, 
  HelpCircle, 
  ArrowLeft, 
  Calendar, 
  FileText, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle2,
  Bookmark,
  ChevronRight,
  Printer
} from 'lucide-react';

interface PrivacyPolicyViewProps {
  onNavigateHome: () => void;
}

export const PrivacyPolicyView = ({ onNavigateHome }: PrivacyPolicyViewProps) => {
  const [activeTab, setActiveTab] = useState<string>('all'); // 'all' or '01' - '05'

  const sections = [
    {
      id: '01',
      tag: 'THU THẬP',
      title: 'Mục đích và phạm vi thu thập',
      icon: <Database className="w-5 h-5 text-orange-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-slate-700 leading-relaxed font-medium">
            Việc thu thập dữ liệu chủ yếu trên website{' '}
            <a href="https://www.cic.com.vn" target="_blank" rel="noreferrer" className="text-orange-600 hover:underline font-bold font-sans">
              www.cic.com.vn
            </a>{' '}
            bao gồm: họ tên, email, điện thoại, địa chỉ khách hàng,... là bắt buộc khi Khách hàng đăng ký sử dụng dịch vụ và để CIC liên hệ xác nhận khi khách hàng đăng ký sử dụng dịch vụ trên website nhằm đảm bảo quyền lợi cho khách hàng.
          </p>
          <p className="text-slate-700 leading-relaxed font-medium">
            Khách hàng sẽ tự chịu trách nhiệm về bảo mật và lưu giữ mọi hoạt động sử dụng dịch vụ dưới tên đăng ký và hộp thư điện tử của mình. Ngoài ra, khách hàng có trách nhiệm thông báo kịp thời cho Công ty CP Công nghệ và Tư vấn CIC về những hành vi sử dụng trái phép, lạm dụng, vi phạm bảo mật, lưu giữ tên đăng ký, thông tin cá nhân của bên thứ ba để có biện pháp giải quyết phù hợp.
          </p>
        </div>
      )
    },
    {
      id: '02',
      tag: 'SỬ DỤNG',
      title: 'Phạm vi sử dụng thông tin',
      icon: <Eye className="w-5 h-5 text-orange-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-slate-700 leading-relaxed font-medium">Công ty sử dụng thông tin Khách hàng cung cấp để:</p>
          <ul className="space-y-3.5 pl-2 border-l-2 border-orange-600/70 text-slate-700 font-medium">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-1" />
              <span>Cung cấp các dịch vụ/sản phẩm đến khách hàng;</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-1" />
              <span>Chuyển giao công nghệ cho khách hàng;</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-1" />
              <span>Gửi các thông báo về các hoạt động trao đổi thông tin cũng như các chương trình khuyến mãi, tri ân khách hàng, các sự kiện được tổ chức,...</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-1" />
              <span>Ngăn ngừa các hoạt động phá hủy tài khoản của KH hoặc các hoạt động giả mạo;</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-1" />
              <span>Liên lạc và giải quyết với khách hàng trong những trường hợp đặc biệt;</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-1" />
              <span>Không sử dụng thông tin cá nhân của Khách hàng ngoài mục đích xác nhận và liên hệ có liên quan đến các dịch vụ, sản phẩm và hoạt động của công ty;</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-1" />
              <span className="text-slate-600 italic">
                Trong trường hợp có yêu cầu của pháp luật: Công ty có trách nhiệm hợp tác cung cấp thông tin cá nhân thành viên khi có yêu cầu từ cơ quan tư pháp bao gồm: Viện kiểm sát, tòa án, cơ quan công an điều tra liên quan đến hành vi vi phạm pháp luật nào đó của khách hàng. Ngoài ra, không ai có quyền xâm phạm vào thông tin cá nhân của thành viên.
              </span>
            </li>
          </ul>
        </div>
      )
    },
    {
      id: '03',
      tag: 'LƯU TRỮ',
      title: 'Thời gian lưu trữ thông tin',
      icon: <Server className="w-5 h-5 text-orange-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-slate-700 leading-relaxed font-medium">
            Dữ liệu cá nhân của khách hàng sẽ được lưu trữ cho đến khi có yêu cầu hủy bỏ, còn lại trong mọi trường hợp thông tin cá nhân thành viên sẽ được bảo mật trên máy chủ của CIC.
          </p>
        </div>
      )
    },
    {
      id: '04',
      tag: 'QUYỀN HẠN',
      title: 'Phương tiện để tiếp cận và chỉnh sửa dữ liệu cá nhân',
      icon: <UserCheck className="w-5 h-5 text-orange-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-slate-700 leading-relaxed font-medium">
            Khách hàng có quyền tự kiểm tra, cập nhật, điều chỉnh hoặc hủy bỏ thông tin cá nhân của mình bằng cách yêu cầu Công ty CIC thực hiện việc này.
          </p>
          <p className="text-slate-700 leading-relaxed font-medium">
            Khách hàng có quyền gửi khiếu nại về nhân viên của Công ty CIC đến Ban quản trị website{' '}
            <a href="https://www.cic.com.vn" target="_blank" rel="noreferrer" className="text-orange-600 hover:underline font-bold font-sans">
              www.cic.com.vn
            </a>
            . Khi tiếp nhận những phản hồi này, Công ty CIC sẽ xác nhận lại thông tin, trường hợp đúng như phản ánh của khách hàng tùy theo mức độ, chúng tôi sẽ có những biện pháp xử lý kịp thời.
          </p>
        </div>
      )
    },
    {
      id: '05',
      tag: 'CAM KẾT',
      title: 'Cam kết bảo mật thông tin cá nhân khách hàng',
      icon: <ShieldCheck className="w-5 h-5 text-orange-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-slate-700 leading-relaxed font-medium">
            Thông tin cá nhân của khách hàng tại website{' '}
            <a href="https://www.cic.com.vn" target="_blank" rel="noreferrer" className="text-orange-600 hover:underline font-bold font-sans">
              www.cic.com.vn
            </a>{' '}
            được cam kết bảo mật tuyệt đối theo chính sách bảo vệ thông tin cá nhân của Công ty CIC. Việc thu thập và sử dụng thông tin của mỗi khách hàng chỉ được thực hiện khi có sự đồng ý của khách hàng đó trừ những trường hợp pháp luật có quy định khác.
          </p>
          <p className="text-slate-700 leading-relaxed font-medium">
            Tuyệt đối không sử dụng, không chuyển giao, không cung cấp hay tiết lộ cho bất kỳ bên thứ ba nào về thông tin cá nhân của khách hàng khi không có sự cho phép đồng ý từ khách hàng.
          </p>
          <div className="bg-gradient-to-r from-slate-900 to-slate-950 text-slate-100 p-6 border-l-4 border-orange-600 shadow-md space-y-3 mt-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-orange-500 font-sans">Lưu ý quan trọng từ Ban Quản Trị</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ban quản trị website <span className="font-sans text-white font-bold">www.cic.com.vn</span> yêu cầu các cá nhân khi đăng ký/mua hàng phải cung cấp đầy đủ thông tin cá nhân có liên quan như: Họ và tên, địa chỉ liên lạc, email, điện thoại, số tài khoản, số thẻ thanh toán…., và chịu trách nhiệm về tính pháp lý của những thông tin trên. Ban quản trị website <span className="font-sans text-white font-bold">www.cic.com.vn</span> không chịu trách nhiệm cũng như không giải quyết mọi khiếu nại có liên quan đến quyền lợi của thành viên đó nếu xét thấy tất cả thông tin cá nhân của khách hàng đó cung cấp khi đăng ký ban đầu là không chính xác.
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div id="privacy-policy-view-root" className="pt-28 pb-24 relative z-10 min-h-screen bg-gradient-to-b from-slate-50/50 via-white/70 to-slate-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* BREADCRUMB */}
        <nav id="privacy-breadcrumb" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8 font-sans">
          <button 
            onClick={onNavigateHome} 
            className="hover:text-orange-600 transition-colors cursor-pointer"
          >
            Trang chủ
          </button>
          <span>/</span>
          <span className="text-slate-800">Chính sách bảo mật</span>
        </nav>

        {/* HERO HEADER - SLICK TECH LOOK */}
        <div id="privacy-hero-header" className="relative border-b border-slate-200 pb-8 mb-12">
          <div className="absolute right-0 top-0 hidden lg:block opacity-[0.03]">
            <Lock size={180} className="text-slate-950" />
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-orange-600 block mb-3 font-sans">
                BẢO VỆ DỮ LIỆU CÁ NHÂN
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-slate-950 mb-4 font-sans leading-none">
                Chính sách bảo mật
              </h1>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Công ty Cổ phần Công nghệ và Tư vấn CIC cam kết bảo vệ thông tin cá nhân của quý khách hàng tuyệt đối. Văn bản dưới đây trình bày rõ ràng mục đích, phạm vi sử dụng, phương pháp lưu trữ và quyền chỉnh sửa thông tin của quý khách khi truy cập hệ thống của chúng tôi.
              </p>
            </div>
            
            {/* DOC METADATA CARD */}
            <div className="bg-white border border-slate-200 p-5 shrink-0 flex flex-col gap-2 shadow-[0_4px_20px_rgba(0,0,0,0.02)] min-w-[240px]">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 font-sans uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5 text-orange-600" />
                <span>Cập nhật: 19/07/2026</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 font-sans uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-orange-600" />
                <span>Thời gian đọc: 4 phút</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 font-sans uppercase tracking-wider">
                <Bookmark className="w-3.5 h-3.5 text-orange-600" />
                <span>Phiên bản: v2.4 (Mới nhất)</span>
              </div>
            </div>
          </div>
        </div>

        {/* LAYOUT WITH STICKY SIDEBAR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT COLUMN - INTERACTIVE TABLE OF CONTENTS */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28 lg:h-fit">
            
            {/* VIEW MODE SELECTOR */}
            <div className="bg-white border border-slate-200 p-2 shadow-[0_4px_30px_rgba(0,0,0,0.03)] flex gap-1">
              <button
                onClick={() => setActiveTab('all')}
                className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
                  activeTab === 'all' 
                    ? 'bg-slate-950 text-white' 
                    : 'text-slate-500 hover:text-slate-950 hover:bg-slate-50'
                }`}
              >
                Xem toàn bộ
              </button>
              <button
                onClick={() => setActiveTab('01')}
                className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
                  activeTab !== 'all' 
                    ? 'bg-slate-950 text-white' 
                    : 'text-slate-500 hover:text-slate-950 hover:bg-slate-50'
                }`}
              >
                Đọc chi tiết
              </button>
            </div>

            {/* TAB BUTTONS (ONLY SHOW IN 'DETAILED' OR ALWAYS INTERACTIVE) */}
            <div className="bg-white border border-slate-200 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.03)] space-y-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-950 mb-4 pb-2 border-b border-slate-100">
                Mục lục chính sách
              </h3>
              
              {/* ALL TAB */}
              <button
                onClick={() => setActiveTab('all')}
                className={`w-full text-left p-3.5 flex items-center justify-between border transition-all duration-300 group ${
                  activeTab === 'all'
                    ? 'border-orange-600 bg-orange-50/50 text-slate-950 font-bold'
                    : 'border-slate-100 hover:border-slate-300 text-slate-600 hover:text-slate-950'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`font-sans text-xs font-bold transition-colors ${activeTab === 'all' ? 'text-orange-600' : 'text-slate-400'}`}>
                    ALL
                  </span>
                  <span className="text-xs uppercase tracking-wider font-bold">Hiển thị tất cả điều khoản</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-300 ${activeTab === 'all' ? 'translate-x-1 text-orange-600' : 'text-slate-300 group-hover:translate-x-1'}`} />
              </button>

              {/* SECTION TABS */}
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setActiveTab(sec.id)}
                  className={`w-full text-left p-3.5 flex items-center justify-between border transition-all duration-300 group ${
                    activeTab === sec.id
                      ? 'border-orange-600 bg-orange-50/50 text-slate-950 font-bold'
                      : 'border-slate-100 hover:border-slate-300 text-slate-600 hover:text-slate-950'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`font-sans text-xs font-extrabold transition-colors ${activeTab === sec.id ? 'text-orange-600' : 'text-slate-400'}`}>
                      {sec.id}
                    </span>
                    <span className="text-xs uppercase tracking-wider font-bold truncate max-w-[200px] lg:max-w-[180px] xl:max-w-[220px]">
                      {sec.tag}
                    </span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-300 ${activeTab === sec.id ? 'translate-x-1 text-orange-600' : 'text-slate-300 group-hover:translate-x-1'}`} />
                </button>
              ))}
            </div>

            {/* QUICK CONTACT HELP CARD */}
            <div className="bg-slate-950 text-white p-6 relative overflow-hidden">
              <div className="absolute right-[-15px] bottom-[-15px] opacity-10">
                <HelpCircle size={100} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-wider text-orange-500 mb-2 font-sans">Hỗ trợ pháp lý?</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4 font-medium">
                Nếu bạn có bất kỳ câu hỏi hoặc khiếu nại nào liên quan đến quyền bảo mật và bảo vệ thông tin cá nhân tại CIC.
              </p>
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <a href="tel:02439761381" className="flex items-center gap-2.5 text-xs text-white hover:text-orange-500 transition-colors font-bold font-sans">
                  <Phone size={14} className="text-orange-600 shrink-0" />
                  <span>024 3976 1381</span>
                </a>
                <a href="mailto:info@cic.com.vn" className="flex items-center gap-2.5 text-xs text-white hover:text-orange-500 transition-colors font-bold font-sans">
                  <Mail size={14} className="text-orange-600 shrink-0" />
                  <span>info@cic.com.vn</span>
                </a>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN - CONTENT CONTAINER */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {activeTab === 'all' ? (
                /* RENDER ALL SECTIONS VIEW WITH ELEVATED CARD DESIGNS */
                <motion.div
                  key="all-sections"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-8"
                >
                  {sections.map((sec, idx) => (
                    <div 
                      key={sec.id}
                      className="bg-white border border-slate-200 p-8 shadow-[0_10px_35px_rgba(0,0,0,0.02)] relative group hover:border-slate-300 transition-all duration-300"
                    >
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-200 group-hover:bg-orange-600 transition-colors duration-300" />
                      
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <span className="font-sans text-3xl font-black text-orange-600 leading-none">
                            {sec.id}
                          </span>
                          <div>
                            <span className="block text-[9px] font-black tracking-widest text-slate-400 font-sans uppercase">
                              CHƯƠNG / MỤC
                            </span>
                            <span className="block text-[11px] font-black tracking-wider text-slate-800 uppercase font-sans">
                              {sec.tag}
                            </span>
                          </div>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-none">
                          {sec.icon}
                        </div>
                      </div>

                      <h2 className="text-xl font-black uppercase tracking-tight text-slate-950 mb-4">
                        {sec.title}
                      </h2>
                      <div className="text-sm text-slate-600 font-medium leading-relaxed">
                        {sec.content}
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : (
                /* RENDER SELECTED SINGLE SECTION WITH ELEVATED TRANSITION */
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border border-slate-200 p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] relative"
                >
                  <div className="absolute top-0 left-0 w-2 h-full bg-orange-600" />
                  
                  {sections.filter(s => s.id === activeTab).map((sec) => (
                    <div key={sec.id} className="space-y-6">
                      <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                        <div className="flex items-center gap-4">
                          <span className="font-sans text-4xl font-black text-orange-600 leading-none">
                            {sec.id}
                          </span>
                          <div>
                            <span className="block text-[10px] font-black tracking-widest text-slate-400 font-sans uppercase">
                              ĐANG ĐỌC CHI TIẾT
                            </span>
                            <span className="block text-xs font-black tracking-wider text-slate-900 uppercase font-sans">
                              PHÂN MỤC: {sec.tag}
                            </span>
                          </div>
                        </div>
                        <div className="bg-orange-50 p-3 rounded-none">
                          {sec.icon}
                        </div>
                      </div>

                      <h2 className="text-2xl font-black uppercase tracking-tight text-slate-950">
                        {sec.title}
                      </h2>
                      
                      <div className="text-sm text-slate-600 font-medium leading-relaxed pt-2">
                        {sec.content}
                      </div>

                      {/* NAVIGATOR AT BOTTOM OF SINGLE VIEW */}
                      <div className="flex justify-between items-center pt-8 border-t border-slate-100 mt-8">
                        <button
                          disabled={activeTab === '01'}
                          onClick={() => {
                            const prevId = String(Number(activeTab) - 1).padStart(2, '0');
                            setActiveTab(prevId);
                          }}
                          className="px-4 py-2 text-[10px] font-black uppercase tracking-wider text-slate-500 hover:text-slate-950 disabled:opacity-30 disabled:pointer-events-none transition-colors border border-slate-100 hover:border-slate-300 cursor-pointer"
                        >
                          ← Mục trước
                        </button>
                        
                        <button
                          onClick={() => setActiveTab('all')}
                          className="text-[10px] font-black uppercase tracking-wider text-orange-600 hover:text-orange-700 transition-colors cursor-pointer"
                        >
                          Hiển thị tất cả
                        </button>

                        <button
                          disabled={activeTab === '05'}
                          onClick={() => {
                            const nextId = String(Number(activeTab) + 1).padStart(2, '0');
                            setActiveTab(nextId);
                          }}
                          className="px-4 py-2 text-[10px] font-black uppercase tracking-wider text-slate-500 hover:text-slate-950 disabled:opacity-30 disabled:pointer-events-none transition-colors border border-slate-100 hover:border-slate-300 cursor-pointer"
                        >
                          Mục kế tiếp →
                        </button>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* BACK TO HOME - DESIGNED FOR MAXIMUM CRAFT */}
        <div id="privacy-footer-back" className="mt-20 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">
            © 2026 CIC. All rights reserved.
          </p>
          <button
            onClick={onNavigateHome}
            className="text-[10px] font-black uppercase tracking-widest text-slate-950 hover:text-orange-600 transition-all duration-300 cursor-pointer flex items-center gap-2 group border border-slate-950/10 px-5 py-3 hover:border-orange-600/30 hover:bg-orange-50/10"
          >
            <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-1" />
            <span>Quay lại trang chủ</span>
          </button>
        </div>

      </div>
    </div>
  );
};
