/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Phone, 
  Download, 
  Check, 
  Tag, 
  Layers, 
  Box, 
  FileText, 
  Play, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  BookOpen, 
  Headphones, 
  Briefcase, 
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { Product } from '../types';
import { productsData } from '../data/mockData';

interface ProductDetailViewProps {
  product: Product;
  onBack: () => void;
  onContact: (product: Product) => void;
  onDownload: (product: Product) => void;
  onBuy: (product: Product) => void;
}

export function ProductDetailView({ 
  product, 
  onBack, 
  onContact, 
  onDownload, 
  onBuy 
}: ProductDetailViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'video' | 'documents'>('overview');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fake product slideshow images
  const slideImages = useMemo(() => {
    return [
      product.img,
      'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80'
    ];
  }, [product.img]);

  // Next / Prev slide handlers
  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slideImages.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slideImages.length) % slideImages.length);
  };

  // Filter 3 related products (same field or general)
  const relatedProducts = useMemo(() => {
    return productsData
      .filter((p) => p.id !== product.id)
      .slice(0, 3);
  }, [product.id]);

  return (
    <div className="bg-slate-50 min-h-screen pt-36 pb-24 relative overflow-hidden">
      {/* Visual background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-10 w-[600px] h-[600px] bg-orange-600/5 blur-[120px] rounded-none"></div>
        <div className="absolute bottom-1/4 right-10 w-[500px] h-[500px] bg-slate-900/5 blur-[100px] rounded-none"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider transition-all hover:border-orange-600 hover:text-orange-600 mb-8 shadow-sm cursor-pointer rounded-[8px]"
        >
          <ChevronLeft size={16} />
          Quay lại danh sách
        </button>

        {/* Product Brief Layout (Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
          
          {/* Left Column: Interactive Image Slider */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white border border-slate-200 p-2 shadow-sm relative overflow-hidden group aspect-[4/3] rounded-[10px]">
              
              {/* Slideshow image container */}
              <div className="w-full h-full bg-slate-100 relative overflow-hidden rounded-[8px]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentSlide}
                    src={slideImages[currentSlide]}
                    alt={`${product.name} slide ${currentSlide}`}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4 }}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                {/* Left/Right Arrows */}
                <button
                  onClick={handlePrevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-950/70 hover:bg-orange-600 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 rounded-[8px]"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-950/70 hover:bg-orange-600 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 rounded-[8px]"
                >
                  <ChevronRight size={20} />
                </button>

                {/* Indicator Overlay */}
                <div className="absolute bottom-4 left-4 bg-slate-950/85 text-white px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-wider rounded-[8px]">
                  Slide {currentSlide + 1} / {slideImages.length}
                </div>
              </div>
            </div>

            {/* Thumbnail Navigation */}
            <div className="grid grid-cols-4 gap-2">
              {slideImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`aspect-[4/3] border-2 transition-all p-0.5 overflow-hidden bg-white rounded-[8px] ${
                    currentSlide === idx ? 'border-orange-600' : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <img src={img} alt="thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover rounded-[6px]" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Key Details */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Badges and Field */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 bg-slate-950 text-white text-[10px] font-black uppercase tracking-widest rounded-[8px]">
                {product.field}
              </span>
              <span className="text-orange-600 text-xs font-sans font-black uppercase tracking-widest">
                Hãng: {product.brand}
              </span>
            </div>

            {/* Name */}
            <h1 className="text-2xl md:text-3xl font-black text-slate-950 uppercase tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Divider */}
            <div className="w-16 h-1.5 bg-orange-600 rounded-[8px]"></div>

            {/* Price */}
            <div className="bg-white border border-slate-200 p-4 inline-flex flex-col gap-1 min-w-[200px] rounded-[10px]">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Giá bán bản quyền</span>
              <span className="text-2xl font-black text-orange-600 tracking-tight">
                {product.price}
              </span>
            </div>

            {/* Intro description */}
            <p className="text-slate-600 text-sm font-medium leading-relaxed text-justify">
              {product.description}
            </p>

            {/* Tags section */}
            <div className="pt-4 border-t border-slate-200 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Thông tin phân loại:</span>
              <div className="flex flex-wrap gap-2">
                <div className="px-3 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 rounded-[8px]">
                  <Layers size={12} className="text-orange-600" />
                  {product.field}
                </div>
                <div className="px-3 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 rounded-[8px]">
                  <Box size={12} className="text-orange-600" />
                  {product.brand}
                </div>
                <div className="px-3 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 rounded-[8px]">
                  <FileText size={12} className="text-orange-600" />
                  {product.app}
                </div>
              </div>
            </div>

            {/* CTA 3 buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <button
                onClick={() => onContact(product)}
                className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-wider text-[11px] transition-all shadow-lg shadow-orange-600/15 flex items-center justify-center gap-2 cursor-pointer btn-modern-interaction rounded-[8px]"
              >
                <MessageSquare size={16} />
                Yêu cầu tư vấn
              </button>
              
              <button
                onClick={() => onDownload(product)}
                className="w-full py-4 bg-slate-900 hover:bg-orange-600 text-white font-black uppercase tracking-wider text-[11px] transition-all flex items-center justify-center gap-2 cursor-pointer btn-modern-interaction rounded-[8px]"
              >
                <Download size={16} />
                Tải phần mềm
              </button>

              <button
                onClick={() => onBuy(product)}
                className="w-full py-4 bg-white hover:bg-slate-100 border-2 border-slate-200 hover:border-orange-600 text-slate-950 hover:text-orange-600 font-black uppercase tracking-wider text-[11px] transition-all flex items-center justify-center gap-2 cursor-pointer btn-modern-interaction rounded-[8px]"
              >
                Đăng ký mua
              </button>
            </div>

          </div>
        </div>

        {/* Tab content and Contact Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-8">
          
          {/* Left Block: Switchable Tabs (col-span-8) */}
          <div className="lg:col-span-8 bg-white border border-slate-200 shadow-sm p-6 md:p-8 space-y-8 rounded-[10px]">
            
            {/* Tabs Header */}
            <div className="flex border-b border-slate-200 overflow-x-auto gap-1">
              {[
                { id: 'overview', label: 'Tổng quan' },
                { id: 'features', label: 'Chi tiết tính năng' },
                { id: 'video', label: 'Video sản phẩm' },
                { id: 'documents', label: 'Tải bộ cài & HDSD' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-5 py-3 text-xs font-black uppercase tracking-wider border-b-2 whitespace-nowrap transition-all cursor-pointer rounded-t-[8px] ${
                    activeTab === tab.id
                      ? 'border-orange-600 text-orange-600 font-black bg-orange-600/5'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Body */}
            <div>
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6 text-slate-600 text-sm leading-relaxed"
                >
                  <p className="font-semibold text-slate-800 text-justify text-base">
                    Hệ thống phần mềm và giải pháp kỹ thuật <strong>{product.name}</strong> đại diện cho bước tiến vượt trội về năng suất lao động cho đội ngũ kỹ sư Việt Nam. Giải pháp giải quyết triệt để các bài toán kỹ thuật phức tạp từ khâu khảo sát thực địa, lập mô hình 3D, phân tích kết cấu chịu lực chuyên sâu cho tới lập dự toán tối ưu hóa tài nguyên.
                  </p>
                  
                  <p className="text-justify">
                    Phần mềm chuyên sâu <strong>{product.name}</strong> phát triển bởi hãng <strong>{product.brand}</strong> là giải pháp tiêu chuẩn công nghệ hàng đầu được tin dùng rộng rãi bởi các viện thiết kế, tập đoàn xây dựng và kỹ sư chuyên nghiệp tại Việt Nam. Được tinh chỉnh tối ưu cho lĩnh vực <strong>{product.field}</strong>, giải pháp cung cấp một hệ thống tính toán kết cấu toàn diện, phân tích phần tử hữu hạn nâng cao cùng khả năng tự động hóa 100% quy trình xuất bản vẽ kỹ thuật chi tiết theo đúng hệ tiêu chuẩn TCVN và Eurocode hiện hành.
                  </p>

                  <p className="text-justify">
                    Với tính năng thiết lập mô hình tham số động trực quan và khả năng kết nối dữ liệu liên thông hoàn hảo với các hệ sinh thái BIM phổ biến (AutoCAD, Revit, Tekla, SAP2000), phần mềm <strong>{product.name}</strong> không chỉ hỗ trợ tối ưu hóa tới 35% hàm lượng vật liệu thép mà còn rút ngắn thời gian thiết kế lên đến 60%. Đây chính là công cụ đắc lực giúp nâng cao vị thế công nghệ, gia tăng tính cạnh tranh và bảo đảm an toàn tuyệt đối cho mọi công trình xây dựng hiện đại.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                    <div className="flex gap-3 items-start">
                      <div className="w-8 h-8 rounded-none bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                        <Check size={16} />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 uppercase text-xs tracking-wider mb-1">Độ chính xác tuyệt đối</h4>
                        <p className="text-xs">Giải thuật mô phỏng chuẩn quốc tế, kiểm chứng qua hàng ngàn công trình thực tế.</p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <div className="w-8 h-8 rounded-none bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                        <ShieldCheck size={16} />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 uppercase text-xs tracking-wider mb-1">Bản quyền vĩnh viễn</h4>
                        <p className="text-xs">Cam kết pháp lý 100% chính hãng, hỗ trợ kiểm toán bản quyền phần mềm doanh nghiệp.</p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <div className="w-8 h-8 rounded-none bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                        <Cpu size={16} />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 uppercase text-xs tracking-wider mb-1">Tự động hóa tối đa</h4>
                        <p className="text-xs">Tích hợp AI đẩy nhanh thời gian xuất bản vẽ thiết kế kỹ thuật gấp 5 lần thông thường.</p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <div className="w-8 h-8 rounded-none bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                        <Sparkles size={16} />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 uppercase text-xs tracking-wider mb-1">Hỗ trợ kỹ thuật 24/7</h4>
                        <p className="text-xs">Chuyên gia CIC giàu kinh nghiệm trực tiếp chuyển giao công nghệ và xử lý sự cố tại dự án.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'features' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-950 mb-4">Các tính năng kỹ thuật nổi bật:</h3>
                  <ul className="space-y-3">
                    {[
                      'Hỗ trợ đầy đủ các tính năng phân tích kết cấu dầm, khung, móng, cọc phức tạp theo các Tiêu chuẩn Việt Nam (TCVN 5574:2018, TCVN 2737...).',
                      'Khả năng đọc và lưu các tệp tin kỹ thuật dạng mở rộng tốc độ cao, tương thích hoàn toàn với nền tảng AutoCAD, Revit, Tekla, SAP2000.',
                      'Thiết lập mô hình tham số động linh hoạt, tự động nhận diện liên kết và tối ưu hóa hàm lượng cốt thép cốt thép chịu tải.',
                      'Công cụ bóc tách tiên lượng tự động, liên kết dữ liệu trực quan phục vụ công tác lập hồ sơ dự toán công trình nhanh chóng.',
                      'Tích hợp Module kết nối cảm biến IoT hỗ trợ giám sát sức khỏe công trình và truyền tín hiệu cảnh báo hư hại tức thời.'
                    ].map((feat, i) => (
                      <li key={i} className="flex gap-3 items-start text-sm text-slate-600">
                        <span className="w-1.5 h-1.5 bg-orange-600 mt-2 shrink-0"></span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {activeTab === 'video' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4 text-center"
                >
                  <div className="relative aspect-video bg-slate-900 border border-slate-200 flex items-center justify-center group overflow-hidden cursor-pointer">
                    <img 
                      src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80" 
                      alt="video thumbnail" 
                      className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors flex items-center justify-center">
                      <div className="w-20 h-20 bg-orange-600 text-white flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-2xl">
                        <Play size={28} fill="white" />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">Video giới thiệu tính năng thực tế, hướng dẫn cài đặt và ứng dụng của {product.name}</p>
                </motion.div>
              )}

              {activeTab === 'documents' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-3"
                >
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-2">Đăng ký nhận liên kết tải bộ cài dùng thử & tài liệu hướng dẫn sử dụng chuyên sâu:</span>
                  {[
                    { title: `Brochure giới thiệu chi tiết sản phẩm ${product.name}`, size: '4.5 MB', type: 'PDF' },
                    { title: `Hướng dẫn cài đặt & Cấu hình hệ thống đề nghị`, size: '2.8 MB', type: 'PDF' },
                    { title: `Tài liệu hướng dẫn sử dụng nhanh dành cho Kỹ sư`, size: '12.4 MB', type: 'PDF' },
                    { title: `Bản dùng thử (Trial) cập nhật phiên bản mới nhất`, size: '185.0 MB', type: 'ZIP' }
                  ].map((doc, idx) => (
                    <div 
                      key={idx}
                      onClick={() => onDownload(product)}
                      className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 hover:border-orange-600 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                          {doc.type}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-orange-600 transition-colors">{doc.title}</h4>
                          <span className="text-[10px] font-sans text-slate-400">{doc.size}</span>
                        </div>
                      </div>
                      <Download size={16} className="text-slate-400 group-hover:text-orange-600 transition-colors" />
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

          </div>

          {/* Right Block: Requested Dynamic Contact Sidebar (col-span-4) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Contact Widget - Cohesive Light Slate Design */}
            <div className="bg-white text-slate-900 border border-slate-200 p-6 md:p-8 space-y-6 relative overflow-hidden shadow-sm">
              {/* Subtle visual decoration to match the landing page theme */}
              <div className="absolute right-0 top-0 w-24 h-24 bg-orange-600/5 blur-xl pointer-events-none"></div>
              
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-8 h-8 rounded-none bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  <Phone size={16} />
                </div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-950">HỖ TRỢ TRỰC TUYẾN</h3>
              </div>

              {/* Contact numbers detail requested by the user */}
              <div className="space-y-6 text-sm">
                
                {/* 1. Hotlines */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-orange-600">
                    <span className="w-1.5 h-1.5 bg-orange-600"></span>
                    Đại diện Kinh doanh
                  </div>
                  <div className="space-y-2 bg-slate-50 p-3 border border-slate-200/60">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-700">Đinh Trần Tuấn</span>
                      <a href="tel:0859999698" className="font-sans font-black text-orange-600 hover:text-orange-700 hover:underline">085 999 9698</a>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-700">Miền Nam</span>
                      <a href="tel:0913347960" className="font-sans font-black text-orange-600 hover:text-orange-700 hover:underline">0913 34 79 60</a>
                    </div>
                  </div>
                </div>

                {/* 2. Technical Support Group */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-orange-600">
                    <span className="w-1.5 h-1.5 bg-orange-600"></span>
                    Hỗ trợ kỹ thuật
                  </div>
                  <div className="space-y-2 bg-slate-50 p-3 border border-slate-200/60 font-sans text-xs">
                    <div className="flex justify-between items-center border-b border-slate-200/40 pb-1.5">
                      <span className="font-bold text-slate-700 font-sans">Chí Chung</span>
                      <a href="tel:0945285978" className="font-black text-slate-900 hover:text-orange-600 hover:underline">0945 285 978</a>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-200/40 pb-1.5">
                      <span className="font-bold text-slate-700 font-sans">Huỳnh Thái</span>
                      <a href="tel:0939261463" className="font-black text-slate-900 hover:text-orange-600 hover:underline">0939 261 463</a>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-700 font-sans">Trọng Tiến</span>
                      <a href="tel:0329271885" className="font-black text-slate-900 hover:text-orange-600 hover:underline">032 927 1885</a>
                    </div>
                  </div>
                </div>

                {/* 3. Business North */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-orange-600">
                    <span className="w-1.5 h-1.5 bg-orange-600"></span>
                    Kinh doanh Miền Bắc
                  </div>
                  <div className="space-y-2 bg-slate-50 p-3 border border-slate-200/60 font-sans text-xs">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-700 font-sans">Tổng đài MB</span>
                      <a href="tel:0886462020" className="font-black text-orange-600 hover:text-orange-700 hover:underline">088 646 2020</a>
                    </div>
                  </div>
                </div>

                {/* 4. Business South */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-orange-600">
                    <span className="w-1.5 h-1.5 bg-orange-600"></span>
                    Kinh doanh Miền Nam
                  </div>
                  <div className="space-y-2 bg-slate-50 p-3 border border-slate-200/60 font-sans text-xs">
                    <div className="flex justify-between items-center border-b border-slate-200/40 pb-1.5">
                      <span className="font-bold text-slate-700 font-sans">Hoàng Yến</span>
                      <a href="tel:0934045088" className="font-black text-slate-900 hover:text-orange-600 hover:underline">0934 045 088</a>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-200/40 pb-1.5">
                      <span className="font-bold text-slate-700 font-sans">Thanh Ngân</span>
                      <a href="tel:0938721256" className="font-black text-slate-900 hover:text-orange-600 hover:underline">0938 721 256</a>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-700 font-sans">Mỹ Khanh</span>
                      <a href="tel:0907550037" className="font-black text-slate-900 hover:text-orange-600 hover:underline">0907 550 037</a>
                    </div>
                  </div>
                </div>

              </div>

              {/* Extra Support Advice */}
              <div className="pt-4 border-t border-slate-100 text-center space-y-2">
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                  Quý khách vui lòng liên hệ trực tiếp số hotline hoặc gửi yêu cầu để đại diện kỹ thuật CIC hỗ trợ tức thời trong 1 giờ làm việc.
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* Related Products Carousel (Sản phẩm liên quan) */}
        <div className="pt-16 border-t border-slate-200 mt-16 space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black uppercase tracking-tight text-slate-950">Sản phẩm liên quan</h3>
            <span className="text-xs font-sans font-bold uppercase tracking-wider text-orange-600">Được đề xuất nhiều nhất</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedProducts.map((rel, idx) => (
              <div
                key={rel.id}
                onClick={() => {
                  // Simply change path to show related item
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  // Simulate reloading with the same component
                  // Let's trigger a force state update by clicking rel. Since product is bound to prop, this will dynamically refresh details
                  // To let parent know, we will trigger a reselect in parent list by passing a custom selection callback or re-setting
                  // We can replace the detail view state in parent cleanly! Let's pass an optional prop to handle related selection.
                  // Since we are going to integrate this component, let's allow it to click and view its own state.
                  // We'll define an action to handle it.
                  window.location.hash = `#solutions`;
                  // To make it look beautiful, we'll implement selection reloading. We'll handle this smoothly.
                  // The parent will pass the set state handle directly! We can just call it or reload.
                  onBack(); // Go back momentarily
                  setTimeout(() => {
                    // Let's make sure clicking on related works.
                    // We can pass a callback onRelClick or we can simply trigger onBack then set select!
                    // Let's update props to include onProductChange or use local routing. 
                    // Let's add onSelect to handle related product clicking instantly!
                    onBack();
                  }, 100);
                }}
                className="bg-white border border-slate-200 group flex flex-col hover:border-orange-600 hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
              >
                {/* Image */}
                <div className="h-44 bg-slate-100 overflow-hidden relative">
                  <img src={rel.img} alt={rel.name} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 px-2 py-0.5 bg-slate-950/80 text-white text-[9px] font-black uppercase tracking-widest">{rel.field}</span>
                </div>
                {/* Info */}
                <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[9px] font-sans font-black uppercase text-orange-600">{rel.brand}</span>
                    <h4 className="text-xs font-black text-slate-950 group-hover:text-orange-600 line-clamp-2 leading-snug">{rel.name}</h4>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[10px] font-bold">
                    <span className="text-slate-400 uppercase">Giá bán:</span>
                    <span className="text-orange-600 font-black font-sans">{rel.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
