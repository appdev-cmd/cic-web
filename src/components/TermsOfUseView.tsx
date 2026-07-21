import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scale, 
  Copyright, 
  Download, 
  Globe, 
  History, 
  HelpCircle, 
  ArrowLeft, 
  Calendar, 
  FileText, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle2,
  Bookmark,
  ChevronRight
} from 'lucide-react';

interface TermsOfUseViewProps {
  onNavigateHome: () => void;
}

export const TermsOfUseView = ({ onNavigateHome }: TermsOfUseViewProps) => {
  const [activeTab, setActiveTab] = useState<string>('all'); // 'all' or '01' - '05'

  const sections = [
    {
      id: '01',
      tag: 'SỬ DỤNG',
      title: 'Quy định chung khi sử dụng website',
      icon: <Globe className="w-5 h-5 text-orange-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-slate-700 leading-relaxed font-medium">
            Khi truy cập và sử dụng website{' '}
            <a href="https://www.cic.com.vn" target="_blank" rel="noreferrer" className="text-orange-600 hover:underline font-bold font-sans">
              www.cic.com.vn
            </a>
            , khách hàng mặc định đồng ý với các điều khoản điều kiện này. Nếu không đồng ý, vui lòng ngưng sử dụng trang web.
          </p>
          <p className="text-slate-700 leading-relaxed font-medium">
            Khách hàng cam kết sử dụng trang web cho mục đích tìm hiểu dịch vụ, phần mềm và hoạt động hợp pháp. Nghiêm cấm các hành vi phá hoại, can thiệp mã nguồn, sử dụng robot hoặc các phương thức tự động để khai thác dữ liệu trái phép, hoặc đăng tải thông tin sai sự thật ảnh hưởng đến uy tín của CIC.
          </p>
        </div>
      )
    },
    {
      id: '02',
      tag: 'BẢN QUYỀN',
      title: 'Sở hữu trí tuệ và Bản quyền nội dung',
      icon: <Copyright className="w-5 h-5 text-orange-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-slate-700 leading-relaxed font-medium">
            Toàn bộ nội dung đăng tải trên website bao gồm bài viết, tài liệu, cấu trúc danh mục, hình ảnh, video giới thiệu sản phẩm CAD/BIM đều thuộc sở hữu trí tuệ của Công ty Cổ phần Công nghệ và Tư vấn CIC hoặc đã được cấp phép hợp pháp.
          </p>
          <p className="text-slate-700 leading-relaxed font-medium">
            Nghiêm cấm việc sao chép, tái bản, phân phối hoặc sử dụng lại bất kỳ phần nội dung nào cho mục đích thương mại mà chưa có sự đồng ý bằng văn bản của người đại diện theo pháp luật của CIC.
          </p>
        </div>
      )
    },
    {
      id: '03',
      tag: 'TẢI XUỐNG',
      title: 'Quy định về tài liệu tải xuống và Phần mềm dùng thử',
      icon: <Download className="w-5 h-5 text-orange-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-slate-700 leading-relaxed font-medium">
            Các tài liệu, catalog, hướng dẫn sử dụng phần mềm, và bộ cài đặt dùng thử (demo) được cung cấp miễn phí trên trang web nhằm mục đích hỗ trợ học thuật, khảo sát và đánh giá trước khi mua sắm.
          </p>
          <ul className="space-y-3.5 pl-2 border-l-2 border-orange-600/70 text-slate-700 font-medium">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-1" />
              <span>Chỉ sử dụng tài liệu cho mục đích học tập hoặc tìm hiểu phi thương mại.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-1" />
              <span>Tuyệt đối không can thiệp thay đổi, bẻ khóa (crack), dịch ngược (reverse engineering) hay tháo rời các phần mềm hoặc tệp tài nguyên tải xuống từ CIC.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-1" />
              <span>Khách hàng tự chịu trách nhiệm về an toàn bảo mật thiết bị cá nhân của mình khi khởi chạy các bộ cài. CIC cam kết các bộ cài trên máy chủ của chúng tôi được quét mã độc định kỳ, tuy nhiên việc rà soát từ phía người dùng trước khi giải nén luôn được khuyến nghị.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-1" />
              <span>Giữ nguyên các thông tin bản quyền và nguồn gốc xuất xứ của tài liệu khi sử dụng hoặc trích dẫn.</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      id: '04',
      tag: 'GIỚI HẠN',
      title: 'Miễn trừ và Giới hạn trách nhiệm pháp lý',
      icon: <Scale className="w-5 h-5 text-orange-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-slate-700 leading-relaxed font-medium">
            CIC nỗ lực tối đa để đảm bảo tính cập nhật và chính xác của toàn bộ dữ liệu trên website. Tuy nhiên, chúng tôi không bảo đảm tuyệt đối rằng không có sự cố kỹ thuật hoặc lỗi đánh máy vô ý xảy ra.
          </p>
          <p className="text-slate-700 leading-relaxed font-medium">
            CIC sẽ không chịu trách nhiệm pháp lý cho bất kỳ tổn thất trực tiếp, gián tiếp hoặc hệ quả nào phát sinh từ việc truy cập, sử dụng, hoặc không thể sử dụng nội dung, phần mềm hoặc các đường link liên kết ngoài của trang web này.
          </p>
        </div>
      )
    },
    {
      id: '05',
      tag: 'THAY ĐỔI',
      title: 'Cập nhật và Thay đổi các điều khoản sử dụng',
      icon: <History className="w-5 h-5 text-orange-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-slate-700 leading-relaxed font-medium">
            CIC có toàn quyền cập nhật, sửa đổi, bổ sung các điều khoản sử dụng này bất cứ lúc nào mà không cần báo trước. Các thay đổi sẽ có hiệu lực ngay khi được công bố chính thức trên website. Việc quý khách hàng tiếp tục sử dụng website sau khi cập nhật đồng nghĩa với việc chấp nhận các điều khoản mới.
          </p>
          <div className="bg-gradient-to-r from-slate-900 to-slate-950 text-slate-100 p-6 border-l-4 border-orange-600 shadow-md space-y-3 mt-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-orange-500 font-sans">Thông tin liên hệ & Hỗ trợ kỹ thuật</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Mọi thắc mắc hoặc yêu cầu làm rõ liên quan đến nội dung, sở hữu trí tuệ hoặc chính sách tải xuống phần mềm bản quyền của CIC xin vui lòng gửi về Ban quản trị qua email:{' '}
              <a href="mailto:info@cic.com.vn" className="text-orange-400 font-bold hover:underline font-sans">info@cic.com.vn</a>
              {' '}hoặc Hotline trực tiếp:{' '}
              <span className="font-bold text-white font-sans">024 3976 1381</span> để được phản hồi và giải đáp kịp thời.
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div id="terms-of-use-view-root" className="pt-28 pb-24 relative z-10 min-h-screen bg-gradient-to-b from-slate-50/50 via-white/70 to-slate-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* BREADCRUMB */}
        <nav id="terms-breadcrumb" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8 font-sans">
          <button 
            onClick={onNavigateHome} 
            className="hover:text-orange-600 transition-colors cursor-pointer"
          >
            Trang chủ
          </button>
          <span>/</span>
          <span className="text-slate-800">Điều khoản sử dụng</span>
        </nav>

        {/* HERO HEADER - SLICK TECH LOOK */}
        <div id="terms-hero-header" className="relative border-b border-slate-200 pb-8 mb-12">
          <div className="absolute right-0 top-0 hidden lg:block opacity-[0.03]">
            <Scale size={180} className="text-slate-950" />
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-orange-600 block mb-3 font-sans">
                QUY ĐỊNH & PHÁP LÝ
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-slate-950 mb-4 font-sans leading-none">
                Điều khoản sử dụng
              </h1>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Vui lòng đọc kỹ các điều khoản dưới đây khi truy cập website www.cic.com.vn và sử dụng các sản phẩm dịch vụ, tài liệu tải xuống hoặc các tài nguyên số của Công ty Cổ phần Công nghệ và Tư vấn CIC.
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
                <span>Thời gian đọc: 5 phút</span>
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
                Mục lục điều khoản
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
              <h3 className="text-sm font-black uppercase tracking-wider text-orange-500 mb-2 font-sans">Trợ giúp pháp lý?</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4 font-medium">
                Nếu bạn cần trao đổi thêm về các quy định bản quyền, sở hữu trí tuệ hoặc điều kiện cấp phép phần mềm tại CIC.
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
        <div id="terms-footer-back" className="mt-20 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
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
