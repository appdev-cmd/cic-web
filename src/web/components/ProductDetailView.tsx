/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  ChevronUp,
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
import { Product } from '@shared/types';
import { productsData } from '../data/mockData';

interface ProductDetailViewProps {
  product: Product;
  onBack: () => void;
  onContact: (product: Product) => void;
  onDownload: (product: Product) => void;
  onBuy: (product: Product) => void;
}

function CollapsibleContent({ 
  children, 
  maxHeight = 450 
}: { 
  children: React.ReactNode; 
  maxHeight?: number;
  key?: React.Key;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowButton, setShouldShowButton] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const checkHeight = () => {
      if (el.scrollHeight > maxHeight + 30) {
        setShouldShowButton(true);
      } else {
        setShouldShowButton(false);
      }
    };

    checkHeight();

    const resizeObserver = new ResizeObserver(() => {
      checkHeight();
    });

    resizeObserver.observe(el);

    return () => {
      resizeObserver.disconnect();
    };
  }, [children, maxHeight]);

  const toggleExpand = () => {
    if (isExpanded && contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="relative">
      <div
        ref={contentRef}
        style={{
          maxHeight: isExpanded ? 'none' : `${maxHeight}px`,
        }}
        className="transition-all duration-300 overflow-hidden relative"
      >
        {children}

        {!isExpanded && shouldShowButton && (
          <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none" />
        )}
      </div>

      {shouldShowButton && (
        <div className="mt-4 text-center relative z-10">
          <button
            type="button"
            onClick={toggleExpand}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-800 text-xs font-bold rounded-full border border-slate-200 hover:border-orange-300 transition-all shadow-sm cursor-pointer"
          >
            {isExpanded ? (
              <>
                <span>Rút gọn nội dung</span>
                <ChevronUp size={16} />
              </>
            ) : (
              <>
                <span>Xem thêm nội dung</span>
                <ChevronDown size={16} />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
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

  // Check if product is Equipment / Hardware
  const isEquipment = useMemo(() => {
    if (product.productType) return product.productType === 'Thiết bị';
    const name = (product.name || '').toLowerCase();
    return name.includes('rô bốt') || name.includes('thiết bị') || name.includes('máy') || name.includes('cảm biến') || name.includes('chum') || name.includes('pet');
  }, [product]);

  // Product slideshow images
  const slideImages = useMemo(() => {
    if (product.slides && product.slides.length > 0) {
      return product.slides;
    }
    return [product.img];
  }, [product.slides, product.img]);

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
            {/* Feature Image */}
            <div className="bg-white p-2 border border-slate-200 shadow-sm relative overflow-hidden group aspect-[4/3] rounded-[10px]">
              
              {/* Slideshow image container */}
              <div className="w-full h-full bg-slate-50 relative overflow-hidden rounded-[8px] flex items-center justify-center p-3">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentSlide}
                    src={slideImages[currentSlide]}
                    alt={`${product.name} slide ${currentSlide}`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </AnimatePresence>

                {/* Left/Right Arrows & Indicator - Only if multiple slides */}
                {slideImages.length > 1 && (
                  <>
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
                    <div className="absolute bottom-4 left-4 bg-slate-950/85 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-[8px]">
                      Slide {currentSlide + 1} / {slideImages.length}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Thumbnail Navigation */}
            <div className="flex flex-wrap gap-2">
              {slideImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-20 sm:w-24 aspect-[4/3] border-2 transition-all p-1 overflow-hidden bg-white rounded-[8px] flex items-center justify-center ${
                    currentSlide === idx ? 'border-orange-600 ring-2 ring-orange-500/20' : 'border-slate-200 hover:border-slate-400 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`thumbnail ${idx + 1}`} referrerPolicy="no-referrer" className="w-full h-full object-contain rounded-[4px]" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Key Details */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Badges and Field */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 bg-slate-950 text-white text-xs font-bold uppercase tracking-wider rounded-[8px]">
                {product.field}
              </span>
              <span className="text-orange-600 text-xs font-bold uppercase tracking-wider">
                Hãng: {product.brand}
              </span>
            </div>

            {/* Name */}
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950 uppercase tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Divider */}
            <div className="w-16 h-1.5 bg-orange-600 rounded-[8px]"></div>

            {/* Price */}
            <div className="bg-white border border-slate-200 p-4 inline-flex flex-col gap-1 min-w-[200px] rounded-[10px]">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {isEquipment ? 'Giá bán' : 'Giá bán bản quyền'}
              </span>
              <span className="text-2xl font-extrabold text-orange-600 tracking-tight">
                {product.price}
              </span>
            </div>

            {/* Intro description */}
            <p className="text-slate-600 text-sm font-medium leading-relaxed text-justify">
              {product.description}
            </p>

            {/* Tags section */}
            <div className="pt-4 border-t border-slate-200 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Thông tin phân loại:</span>
              <div className="flex flex-wrap gap-2">
                <div className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1 rounded-[8px]">
                  <Layers size={12} className="text-orange-600" />
                  {product.field}
                </div>
                <div className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1 rounded-[8px]">
                  <Box size={12} className="text-orange-600" />
                  {product.brand}
                </div>
                <div className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1 rounded-[8px]">
                  <FileText size={12} className="text-orange-600" />
                  {product.app}
                </div>
              </div>
            </div>

            {/* CTA buttons */}
            <div className={`grid grid-cols-1 ${isEquipment ? 'sm:grid-cols-2' : 'sm:grid-cols-3'} gap-4 pt-4`}>
              <button
                onClick={() => onContact(product)}
                className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-wider text-xs transition-all shadow-lg shadow-orange-600/15 flex items-center justify-center gap-2 cursor-pointer btn-modern-interaction rounded-[8px]"
              >
                <MessageSquare size={16} />
                Yêu cầu tư vấn
              </button>
              
              {!isEquipment && (
                <button
                  onClick={() => onDownload(product)}
                  className="w-full py-4 bg-slate-900 hover:bg-orange-600 text-white font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 cursor-pointer btn-modern-interaction rounded-[8px]"
                >
                  <Download size={16} />
                  Tải phần mềm
                </button>
              )}

              <button
                onClick={() => onBuy(product)}
                className="w-full py-4 bg-white hover:bg-slate-100 border-2 border-slate-200 hover:border-orange-600 text-slate-950 hover:text-orange-600 font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 cursor-pointer btn-modern-interaction rounded-[8px]"
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
                  <CollapsibleContent key={`${product.id}-overview`} maxHeight={450}>
                    {product.overviewHtml ? (
                      <div 
                        className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mb-3 [&_h2]:mt-6 [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-slate-800 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_li]:mb-1 [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_td]:border [&_td]:border-slate-300 [&_td]:p-2 [&_th]:border [&_th]:border-slate-300 [&_th]:p-2 [&_th]:bg-slate-100 [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-3"
                        dangerouslySetInnerHTML={{ __html: product.overviewHtml }} 
                      />
                    ) : product.description ? (
                      <p className="text-slate-700 text-justify text-base leading-relaxed">
                        {product.description}
                      </p>
                    ) : (
                      <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-[8px]">
                        <FileText size={32} className="mx-auto text-slate-400 mb-2" />
                        <p className="text-slate-500 text-sm font-medium">Chưa có thông tin tổng quan cho sản phẩm này.</p>
                      </div>
                    )}
                  </CollapsibleContent>
                </motion.div>
              )}

              {activeTab === 'features' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <CollapsibleContent key={`${product.id}-features`} maxHeight={450}>
                    {product.featuresHtml ? (
                      <div 
                        className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mb-3 [&_h2]:mt-6 [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-slate-800 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_li]:mb-1 [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_td]:border [&_td]:border-slate-300 [&_td]:p-2 [&_th]:border [&_th]:border-slate-300 [&_th]:p-2 [&_th]:bg-slate-100 [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-3"
                        dangerouslySetInnerHTML={{ __html: product.featuresHtml }} 
                      />
                    ) : (
                      <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-[8px]">
                        <Layers size={32} className="mx-auto text-slate-400 mb-2" />
                        <p className="text-slate-500 text-sm font-medium">Không có thông tin tính năng cho sản phẩm này.</p>
                      </div>
                    )}
                  </CollapsibleContent>
                </motion.div>
              )}

              {activeTab === 'video' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4 text-center"
                >
                  {product.videoUrl ? (
                    <>
                      <div className="aspect-video w-full rounded-[10px] overflow-hidden bg-slate-900 shadow-md">
                        <iframe
                          src={product.videoUrl}
                          title={`${product.name} Video`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full border-0"
                        />
                      </div>
                      <p className="text-xs text-slate-500 font-medium">Video giới thiệu tính năng thực tế, hướng dẫn cài đặt và ứng dụng của {product.name}</p>
                    </>
                  ) : (
                    <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-[8px]">
                      <Play size={32} className="mx-auto text-slate-400 mb-2" />
                      <p className="text-slate-500 text-sm font-medium">Không có video cho sản phẩm này.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'documents' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-3"
                >
                  {product.documents && product.documents.length > 0 ? (
                    <>
                      <span className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-2">Liên kết tải bộ cài dùng thử & tài liệu hướng dẫn sử dụng:</span>
                      {product.documents.map((doc, idx) => (
                        <a 
                          key={idx}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 hover:border-orange-600 transition-colors cursor-pointer group rounded-[8px]"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs rounded-[8px]">
                              FILE
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-orange-600 transition-colors">{doc.name}</h4>
                              {doc.size && <span className="text-[10px] font-sans text-slate-400">{doc.size}</span>}
                            </div>
                          </div>
                          <Download size={16} className="text-orange-600 group-hover:scale-110 transition-transform" />
                        </a>
                      ))}
                    </>
                  ) : (
                    <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-[8px]">
                      <Download size={32} className="mx-auto text-slate-400 mb-2" />
                      <p className="text-slate-500 text-sm font-medium">Không có file hướng dẫn hoặc tài liệu đính kèm cho sản phẩm này.</p>
                    </div>
                  )}
                </motion.div>
              )}
            </div>

          </div>

          {/* Right Block: Requested Dynamic Contact Sidebar (col-span-4) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Contact Widget - Cohesive Light Slate Design */}
            <div className="bg-white text-slate-900 border border-slate-200 p-6 md:p-8 space-y-6 relative overflow-hidden shadow-sm rounded-[10px]">
              {/* Subtle visual decoration to match the landing page theme */}
              <div className="absolute right-0 top-0 w-24 h-24 bg-orange-600/5 blur-xl pointer-events-none"></div>
              
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-8 h-8 rounded-[8px] bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  <Phone size={16} />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-950">HỖ TRỢ TRỰC TUYẾN</h3>
              </div>

              {/* Contact numbers detail requested by the user */}
              <div className="space-y-6 text-sm">
                
                {/* 1. Hotlines */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600">
                    <span className="w-1.5 h-1.5 bg-orange-600"></span>
                    Đại diện Kinh doanh
                  </div>
                  <div className="space-y-2 bg-slate-50 p-3 border border-slate-200/60">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-700">Đinh Trần Tuấn</span>
                      <a href="tel:0859999698" className="font-bold text-orange-600 hover:text-orange-700 hover:underline">085 999 9698</a>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-700">Miền Nam</span>
                      <a href="tel:0913347960" className="font-bold text-orange-600 hover:text-orange-700 hover:underline">0913 34 79 60</a>
                    </div>
                  </div>
                </div>

                {/* 2. Technical Support Group */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600">
                    <span className="w-1.5 h-1.5 bg-orange-600"></span>
                    Hỗ trợ kỹ thuật
                  </div>
                  <div className="space-y-2 bg-slate-50 p-3 border border-slate-200/60 text-xs">
                    <div className="flex justify-between items-center border-b border-slate-200/40 pb-1.5">
                      <span className="font-bold text-slate-700">Chí Chung</span>
                      <a href="tel:0945285978" className="font-bold text-slate-900 hover:text-orange-600 hover:underline">0945 285 978</a>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-200/40 pb-1.5">
                      <span className="font-bold text-slate-700">Huỳnh Thái</span>
                      <a href="tel:0939261463" className="font-bold text-slate-900 hover:text-orange-600 hover:underline">0939 261 463</a>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-700">Trọng Tiến</span>
                      <a href="tel:0329271885" className="font-bold text-slate-900 hover:text-orange-600 hover:underline">032 927 1885</a>
                    </div>
                  </div>
                </div>

                {/* 3. Business North */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600">
                    <span className="w-1.5 h-1.5 bg-orange-600"></span>
                    Kinh doanh Miền Bắc
                  </div>
                  <div className="space-y-2 bg-slate-50 p-3 border border-slate-200/60 text-xs">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-700">Tổng đài MB</span>
                      <a href="tel:0886462020" className="font-bold text-orange-600 hover:text-orange-700 hover:underline">088 646 2020</a>
                    </div>
                  </div>
                </div>

                {/* 4. Business South */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600">
                    <span className="w-1.5 h-1.5 bg-orange-600"></span>
                    Kinh doanh Miền Nam
                  </div>
                  <div className="space-y-2 bg-slate-50 p-3 border border-slate-200/60 text-xs">
                    <div className="flex justify-between items-center border-b border-slate-200/40 pb-1.5">
                      <span className="font-bold text-slate-700">Hoàng Yến</span>
                      <a href="tel:0934045088" className="font-bold text-slate-900 hover:text-orange-600 hover:underline">0934 045 088</a>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-200/40 pb-1.5">
                      <span className="font-bold text-slate-700">Thanh Ngân</span>
                      <a href="tel:0938721256" className="font-bold text-slate-900 hover:text-orange-600 hover:underline">0938 721 256</a>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-700">Mỹ Khanh</span>
                      <a href="tel:0907550037" className="font-bold text-slate-900 hover:text-orange-600 hover:underline">0907 550 037</a>
                    </div>
                  </div>
                </div>

              </div>

              {/* Extra Support Advice */}
              <div className="pt-4 border-t border-slate-100 text-center space-y-2">
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                  Quý khách vui lòng liên hệ trực tiếp số hotline hoặc gửi yêu cầu để đại diện kỹ thuật CIC hỗ trợ tức thời trong 1 giờ làm việc.
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* Related Products Carousel (Sản phẩm liên quan) */}
        <div className="pt-16 border-t border-slate-200 mt-16 space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-extrabold uppercase tracking-tight text-slate-950">Sản phẩm liên quan</h3>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">Được đề xuất nhiều nhất</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  onBack();
                }}
                className="bg-white border border-slate-200 group flex flex-col hover:border-orange-600 hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer rounded-[10px]"
              >
                {/* Image */}
                <div className="h-40 bg-white border-b border-slate-100 overflow-hidden relative rounded-t-[10px] p-3 flex items-center justify-center">
                  <img 
                    src={rel.icon || rel.img} 
                    alt={rel.name} 
                    referrerPolicy="no-referrer" 
                    className={`w-full h-full ${rel.icon ? 'object-contain' : 'object-cover'} group-hover:scale-105 transition-transform duration-500`} 
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-slate-950/80 text-white text-[9px] font-bold uppercase tracking-wider rounded-[4px]">{rel.field}</span>
                </div>
                {/* Info */}
                <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase text-orange-600">{rel.brand}</span>
                    <h4 className="text-xs font-bold text-slate-950 group-hover:text-orange-600 line-clamp-2 leading-snug">{rel.name}</h4>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-bold">
                    <span className="text-slate-400 uppercase">Giá bán:</span>
                    <span className="text-orange-600 font-bold">{rel.price}</span>
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
