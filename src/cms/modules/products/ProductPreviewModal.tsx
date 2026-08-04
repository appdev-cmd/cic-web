import React, { useState } from 'react';
import { X, ExternalLink, Download, FileText, CheckCircle2, Phone, Mail, Building, Tag, ShieldCheck, Cpu, Globe, Share2, Star, Eye } from 'lucide-react';
import { ProductItem, ProductCategory } from './types';

interface ProductPreviewModalProps {
  isOpen: boolean;
  product: ProductItem | null;
  categories: ProductCategory[];
  onClose: () => void;
}

export const ProductPreviewModal: React.FC<ProductPreviewModalProps> = ({
  isOpen,
  product,
  categories,
  onClose,
}) => {
  if (!isOpen || !product) return null;

  const [activeImage, setActiveImage] = useState<string>(product.image || (product.gallery && product.gallery[0]) || '');
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'docs'>('overview');

  const categoryName = categories.find((c) => c.id === product.category_id)?.name || 'Sản phẩm CIC';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-5xl w-full h-[90vh] shadow-2xl overflow-hidden flex flex-col">
        {/* Top bar preview header */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 bg-orange-600 text-white font-mono text-[10px] font-bold rounded-full uppercase tracking-wider">
              Preview Public Website
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Mô phỏng hiển thị sản phẩm trên portal CIC Technology
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://cic.com.vn/san-pham/${product.alias}`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mở Tab mới</span>
            </a>
            <button
              onClick={onClose}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Public Website Simulation Area */}
        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-4 sm:p-8 space-y-6">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>Trang chủ</span>
            <span>/</span>
            <span>Sản phẩm</span>
            <span>/</span>
            <span className="text-slate-800 dark:text-slate-200 font-bold">{categoryName}</span>
          </div>

          {/* Product Hero Section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Gallery Left */}
            <div className="md:col-span-5 space-y-3">
              <div className="aspect-4/3 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 relative">
                <img
                  src={activeImage || product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                {product.is_hot && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-amber-500 text-slate-900 font-extrabold text-[10px] rounded-lg shadow-md flex items-center gap-1">
                    <Star className="w-3 h-3 fill-slate-900" /> HOT PRODUCT
                  </span>
                )}
              </div>

              {product.gallery && product.gallery.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {product.gallery.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(img)}
                      className={`w-16 h-12 rounded-lg border-2 overflow-hidden shrink-0 cursor-pointer transition-all ${
                        activeImage === img ? 'border-orange-600 ring-2 ring-orange-500/30' : 'border-slate-200 dark:border-slate-800 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Meta Right */}
            <div className="md:col-span-7 space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="px-2.5 py-1 bg-orange-500/10 text-orange-600 font-bold rounded-lg border border-orange-500/20">
                    SKU: {product.sku}
                  </span>
                  <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-lg border border-slate-200 dark:border-slate-700">
                    Hãng: {product.brand_name}
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                  {product.title}
                </h1>
                {product.tagline && (
                  <p className="text-xs text-orange-600 dark:text-orange-400 font-medium italic">
                    "{product.tagline}"
                  </p>
                )}
              </div>

              {/* Price Banner */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] text-slate-400 font-medium block">Giá tham khảo / Bản quyền:</span>
                  <span className="text-xl font-black text-orange-600 dark:text-orange-400">
                    {product.price}
                  </span>
                  <span className="text-[11px] text-slate-500 block">{product.unit}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-orange-600/20 flex items-center gap-2 cursor-pointer transition-all">
                    <Phone className="w-4 h-4" />
                    <span>Yêu cầu Báo giá</span>
                  </button>
                </div>
              </div>

              {/* Attributes grid */}
              <div className="grid grid-cols-2 gap-3 text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
                <div>
                  <span className="text-slate-400 block text-[11px]">Xuất xứ:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{product.origin || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Bảo hành / Bảo trì:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{product.warranty || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Loại sản phẩm:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{product.product_type}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Phụ trách kỹ thuật:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{product.owner_name}</span>
                </div>
              </div>

              {/* Application tags */}
              {product.application_areas && product.application_areas.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[11px] text-slate-400 font-medium">Ứng dụng:</span>
                  {product.application_areas.map((app, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-[10px] rounded">
                      #{app}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Navigation Tabs for detail */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-5">
            <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                  activeTab === 'overview'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Mô tả & Nổi bật
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                  activeTab === 'specs'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Thông số Kỹ thuật ({product.tech_specs?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('docs')}
                className={`pb-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                  activeTab === 'docs'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Tài liệu & Brochure ({product.documents?.length || 0})
              </button>
            </div>

            {/* Tab 1: Overview & Highlights */}
            {activeTab === 'overview' && (
              <div className="space-y-6 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {product.highlights && product.highlights.length > 0 && (
                  <div className="p-4 bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200/60 dark:border-orange-900/40 rounded-xl space-y-2">
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-orange-600" />
                      <span>Đặc điểm nổi bật của sản phẩm:</span>
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      {product.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-600 mt-1.5 shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div
                  className="prose dark:prose-invert max-w-none text-xs leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: product.content_html || '<p class="text-slate-400 italic">Chưa cập nhật nội dung chi tiết.</p>' }}
                />
              </div>
            )}

            {/* Tab 2: Tech Specs Table */}
            {activeTab === 'specs' && (
              <div className="space-y-4">
                {product.tech_specs && product.tech_specs.length > 0 ? (
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="py-2.5 px-4 text-left w-1/3">Thông số</th>
                          <th className="py-2.5 px-4 text-left">Giá trị</th>
                          <th className="py-2.5 px-4 text-left w-1/4">Phân nhóm</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {product.tech_specs.map((spec, i) => (
                          <tr key={spec.id || i} className={i % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/50 dark:bg-slate-800/40'}>
                            <td className="py-2.5 px-4 font-bold text-slate-800 dark:text-slate-200">{spec.key}</td>
                            <td className="py-2.5 px-4 text-slate-700 dark:text-slate-300 font-mono">{spec.value}</td>
                            <td className="py-2.5 px-4 text-slate-400 italic">{spec.group || 'Chung'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic py-6 text-center">Chưa có thông số kỹ thuật nào được nhập.</p>
                )}
              </div>
            )}

            {/* Tab 3: Documents Download */}
            {activeTab === 'docs' && (
              <div className="space-y-3">
                {product.documents && product.documents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {product.documents.map((doc) => (
                      <div key={doc.id} className="p-3.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-500/10 text-blue-600 rounded-lg">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <h5 className="font-bold text-slate-900 dark:text-white text-xs">{doc.title}</h5>
                            <p className="text-[10px] text-slate-400 font-mono">
                              {doc.file_type} • {doc.file_size} • Phiên bản {doc.version}
                            </p>
                          </div>
                        </div>

                        <a
                          href={doc.file_url}
                          download
                          className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 shrink-0"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Tải về</span>
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic py-6 text-center">Chưa có file tài liệu / brochure nào đính kèm.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
