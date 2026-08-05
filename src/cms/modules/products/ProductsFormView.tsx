import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Save,
  Eye,
  Send,
  CheckCircle2,
  XCircle,
  Globe,
  Upload,
  Plus,
  Trash2,
  GripVertical,
  HelpCircle,
  AlertTriangle,
  FileText,
  Tag,
  ShieldCheck,
  Layers,
  Settings,
  Image as ImageIcon,
  DollarSign,
  Briefcase,
  Share2,
  Lock,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import {
  ProductItem,
  ProductCategory,
  ProductBrand,
  ProductOwnerOption,
  EditorialStatus,
  CatalogStatus,
  AvailabilitySignal,
  TechSpecParam,
  ProductDocument,
} from './types';
import { RichTextEditor } from '../static_pages/RichTextEditor';

interface ProductsFormViewProps {
  product: ProductItem | null; // null if creating new
  categories: ProductCategory[];
  brands: ProductBrand[];
  owners: ProductOwnerOption[];
  onSave: (productData: Partial<ProductItem>, actionType: 'draft' | 'submit' | 'approve' | 'publish') => void;
  onCancel: () => void;
  onOpenPreview: (productData: ProductItem) => void;
}

export const ProductsFormView: React.FC<ProductsFormViewProps> = ({
  product,
  categories,
  brands,
  owners,
  onSave,
  onCancel,
  onOpenPreview,
}) => {
  const isEdit = !!product;

  // Form State
  const [sku, setSku] = useState(product?.sku || '');
  const [title, setTitle] = useState(product?.title || '');
  const [alias, setAlias] = useState(product?.alias || '');
  const [tagline, setTagline] = useState(product?.tagline || '');
  const [shortDescription, setShortDescription] = useState(product?.short_description || '');
  const [productType, setProductType] = useState(product?.product_type || 'Phần mềm bản quyền');

  // Taxonomy
  const [categoryId, setCategoryId] = useState(product?.category_id || categories[0]?.id || '');
  const [brandId, setBrandId] = useState(product?.brand_id || brands[0]?.id || '');
  const [applicationAreas, setApplicationAreas] = useState<string[]>(product?.application_areas || ['Kết cấu', 'BIM']);
  const [newAppInput, setNewAppInput] = useState('');

  // Commercial
  const [price, setPrice] = useState(product?.price || 'Báo giá theo License');
  const [currency, setCurrency] = useState<'VND' | 'USD'>(product?.currency || 'VND');
  const [unit, setUnit] = useState(product?.unit || 'License Standalone / Network');
  const [origin, setOrigin] = useState(product?.origin || 'Mỹ (CSI)');
  const [warranty, setWarranty] = useState(product?.warranty || '12 tháng bảo trì');
  const [availabilitySignal, setAvailabilitySignal] = useState<AvailabilitySignal>(product?.availability_signal || 'in_stock');

  // Content
  const [contentHtml, setContentHtml] = useState(product?.content_html || '');
  const [highlights, setHighlights] = useState<string[]>(product?.highlights || ['Giao diện 3D trực quan', 'Cập nhật TCVN mới nhất']);

  // Tech Specs
  const [techSpecs, setTechSpecs] = useState<TechSpecParam[]>(
    product?.tech_specs || [
      { id: 'sp_1', key: 'Hệ điều hành', value: 'Windows 10 / 11 (64-bit)', group: 'Yêu cầu hệ thống' },
      { id: 'sp_2', key: 'Bộ nhớ RAM', value: '16 GB RAM', group: 'Yêu cầu hệ thống' },
    ]
  );

  // Media
  const [image, setImage] = useState(product?.image || 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop&q=80');
  const [gallery, setGallery] = useState<string[]>(product?.gallery || [image]);
  const [newGalleryInput, setNewGalleryInput] = useState('');
  const [videoUrl, setVideoUrl] = useState(product?.video_url || '');
  const [ogImage, setOgImage] = useState(product?.og_image || '');

  // Documents
  const [documents, setDocuments] = useState<ProductDocument[]>(
    product?.documents || [
      { id: 'doc_1', title: 'Brochure Tổng quan (PDF)', file_url: '/files/brochure.pdf', file_type: 'PDF', file_size: '3.5 MB', version: '2026.1', access: 'public' },
    ]
  );

  // SEO
  const [metaTitle, setMetaTitle] = useState(product?.meta_title || '');
  const [metaDescription, setMetaDescription] = useState(product?.meta_description || '');
  const [metaKeywords, setMetaKeywords] = useState(product?.meta_keywords || '');
  const [canonicalUrl, setCanonicalUrl] = useState(product?.canonical_url || '');

  // Contact & Owner
  const [ownerId, setOwnerId] = useState(product?.owner_id || owners[0]?.id || '');
  const [inquiryRouting, setInquiryRouting] = useState(product?.inquiry_routing || 'Phòng Kinh doanh Phần mềm');

  // Publishing & Catalog
  const [editorialStatus, setEditorialStatus] = useState<EditorialStatus>(product?.editorial_status || 'draft');
  const [catalogStatus, setCatalogStatus] = useState<CatalogStatus>(product?.catalog_status || 'inactive');
  const [isHot, setIsHot] = useState(product?.is_hot || false);
  const [ordering, setOrdering] = useState(product?.ordering || 1);
  const [sitePlacement, setSitePlacement] = useState<string[]>(product?.site_placement || ['catalog_grid']);

  // Active Collapsible Section State (all expanded by default for full disclosure, or toggleable)
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  // Auto-slugify when title changes
  const handleAutoSlug = () => {
    if (!title) return;
    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    setAlias(slug);
  };

  // Calculate completeness score
  const calculateCompleteness = () => {
    let score = 0;
    const missing: string[] = [];

    if (title) score += 15; else missing.push('Tên sản phẩm');
    if (sku) score += 10; else missing.push('Mã SKU');
    if (shortDescription) score += 10; else missing.push('Mô tả ngắn');
    if (image) score += 10; else missing.push('Thumbnail sản phẩm');
    if (contentHtml && contentHtml.length > 50) score += 15; else missing.push('Nội dung chi tiết');
    if (techSpecs.length > 0) score += 10; else missing.push('Thông số kỹ thuật');
    if (documents.length > 0) score += 10; else missing.push('Tài liệu / Brochure');
    if (metaTitle && metaDescription) score += 10; else missing.push('Thẻ SEO Meta Title/Desc');
    if (ownerId) score += 10; else missing.push('Người phụ trách');

    return { score: Math.min(100, score), missing };
  };

  const { score: completenessScore, missing: missingFields } = calculateCompleteness();

  const toggleSection = (sectionKey: string) => {
    setCollapsedSections((prev) => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  };

  // Helper for current form object preview
  const buildCurrentProductObject = (): ProductItem => {
    const selectedBrand = brands.find((b) => b.id === brandId);
    const selectedOwner = owners.find((o) => o.id === ownerId);

    return {
      id: product?.id || `prod_${Date.now()}`,
      sku,
      title,
      alias: alias || 'san-pham-moi',
      tagline,
      short_description: shortDescription,
      product_type: productType,
      category_id: categoryId,
      brand_id: brandId,
      brand_name: selectedBrand ? selectedBrand.name : 'CIC Brand',
      application_areas: applicationAreas,
      price,
      currency,
      unit,
      origin,
      warranty,
      availability_signal: availabilitySignal,
      content_html: contentHtml,
      highlights,
      tech_specs: techSpecs,
      image,
      gallery,
      video_url: videoUrl,
      og_image: ogImage,
      documents,
      meta_title: metaTitle || title,
      meta_description: metaDescription || shortDescription,
      meta_keywords: metaKeywords,
      canonical_url: canonicalUrl || `https://cic.com.vn/san-pham/${alias}`,
      owner_id: ownerId,
      owner_name: selectedOwner ? selectedOwner.name : 'Chuyên viên CIC',
      owner_avatar: selectedOwner?.avatar,
      inquiry_routing: inquiryRouting,
      editorial_status: editorialStatus,
      catalog_status: catalogStatus,
      published: editorialStatus === 'published',
      is_hot: isHot,
      ordering: Number(ordering),
      site_placement: sitePlacement,
      completeness_score: completenessScore,
      missing_fields: missingFields,
      created_time: product?.created_time || new Date().toISOString().replace('T', ' ').substring(0, 19),
      updated_time: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
  };

  const handleSubmitAction = (actionType: 'draft' | 'submit' | 'approve' | 'publish') => {
    const obj = buildCurrentProductObject();
    if (actionType === 'submit') obj.editorial_status = 'pending_review';
    if (actionType === 'approve') obj.editorial_status = 'approved';
    if (actionType === 'publish') {
      obj.editorial_status = 'published';
      obj.catalog_status = 'active';
      obj.published = true;
    }
    onSave(obj, actionType);
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-200">
      {/* 1. STICKY TOP ACTION BAR */}
      <div className="cms-sticky-action bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-xl p-3 sm:p-4 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-colors cursor-pointer"
            title="Quay lại danh sách"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                {isEdit ? `Chỉnh sửa: ${product.title}` : 'Thêm sản phẩm'}
              </h2>
              {isEdit && product.working_version_id && (
                <span className="px-2 py-0.5 bg-orange-500/10 text-orange-600 font-bold text-[10px] rounded-full border border-orange-500/20">
                  Bản đang chỉnh sửa
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Biểu mẫu gồm 11 phần thông tin sản phẩm
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <button
            type="button"
            onClick={() => onOpenPreview(buildCurrentProductObject())}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4 text-blue-500" />
            <span>Xem thử</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubmitAction('draft')}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-600 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Lưu bản nháp</span>
          </button>

          {editorialStatus === 'draft' && (
            <button
              type="button"
              onClick={() => handleSubmitAction('submit')}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Gửi duyệt</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => handleSubmitAction('publish')}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-orange-600/20 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Xuất bản</span>
          </button>
        </div>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: 11 PROGRESSIVE DISCLOSURE SECTIONS */}
        <div className="lg:col-span-8 space-y-5">
          {/* SECTION 1: THÔNG TIN CHUNG */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
            <div
              onClick={() => toggleSection('sec_1')}
              className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-orange-600 text-white font-extrabold text-xs flex items-center justify-center">1</span>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Thông tin chung</h3>
              </div>
              {collapsedSections['sec_1'] ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
            </div>

            {!collapsedSections['sec_1'] && (
              <div className="p-5 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Tên sản phẩm *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="VD: CSI ETABS Ultimate v21 - Phần mềm Thiết kế Kết cấu Tòa nhà"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Mã SKU sản phẩm *
                    </label>
                    <input
                      type="text"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      placeholder="VD: CSI-ETABS-ULT-2026"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-slate-800 dark:text-slate-200">
                        Đường dẫn Alias / Slug *
                      </label>
                      <button
                        type="button"
                        onClick={handleAutoSlug}
                        className="text-[10px] text-orange-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" /> Tự động tạo
                      </button>
                    </div>
                    <input
                      type="text"
                      value={alias}
                      onChange={(e) => setAlias(e.target.value)}
                      placeholder="csi-etabs-ultimate-v21"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Loại hình sản phẩm
                    </label>
                    <select
                      value={productType}
                      onChange={(e) => setProductType(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 cursor-pointer"
                    >
                      <option value="Phần mềm bản quyền">Phần mềm bản quyền (Software)</option>
                      <option value="Phần mềm thương hiệu CIC">Phần mềm thương hiệu CIC</option>
                      <option value="Thiết bị kỹ thuật">Thiết bị kỹ thuật & Đo đạc</option>
                      <option value="Dịch vụ & Đào tạo">Dịch vụ & Khóa đào tạo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Tagline / Khẩu hiệu phụ
                    </label>
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      placeholder="Tiêu chuẩn vàng trong thiết kế kết cấu"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Mô tả ngắn (Short Description) *
                  </label>
                  <textarea
                    rows={3}
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    placeholder="Tóm tắt ngắn gọn tính năng chính của sản phẩm hiển thị trên card danh mục..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: PHÂN LOẠI & TAXONOMY */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
            <div
              onClick={() => toggleSection('sec_2')}
              className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-orange-600 text-white font-extrabold text-xs flex items-center justify-center">2</span>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Phân loại và hãng sản xuất</h3>
              </div>
              {collapsedSections['sec_2'] ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
            </div>

            {!collapsedSections['sec_2'] && (
              <div className="p-5 space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Danh mục chính *
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 cursor-pointer"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Hãng sản xuất / Đối tác *
                    </label>
                    <select
                      value={brandId}
                      onChange={(e) => setBrandId(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 cursor-pointer"
                    >
                      {brands.map((b) => (
                        <option key={b.id} value={b.id}>{b.name} ({b.country})</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Application Areas Chips */}
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Lĩnh vực ứng dụng (Application Areas)
                  </label>
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    {applicationAreas.map((area, index) => (
                      <span key={index} className="px-3 py-1 bg-orange-500/10 text-orange-600 font-bold rounded-xl border border-orange-500/20 flex items-center gap-1.5">
                        <span>#{area}</span>
                        <button
                          type="button"
                          onClick={() => setApplicationAreas(applicationAreas.filter((_, i) => i !== index))}
                          className="hover:text-red-500 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newAppInput}
                      onChange={(e) => setNewAppInput(e.target.value)}
                      placeholder="Thêm lĩnh vực mới (VD: Kháng chấn, Thủy lợi...)"
                      className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newAppInput.trim()) {
                          setApplicationAreas([...applicationAreas, newAppInput.trim()]);
                          setNewAppInput('');
                        }
                      }}
                      className="px-3.5 py-2 bg-slate-800 text-white rounded-xl font-bold cursor-pointer"
                    >
                      Thêm
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 3: THƯƠNG MẠI & GIÁ */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
            <div
              onClick={() => toggleSection('sec_3')}
              className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-orange-600 text-white font-extrabold text-xs flex items-center justify-center">3</span>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Thông tin thương mại và giá</h3>
              </div>
              {collapsedSections['sec_3'] ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
            </div>

            {!collapsedSections['sec_3'] && (
              <div className="p-5 space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Giá niêm yết / Nhãn giá *
                    </label>
                    <input
                      type="text"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="VD: Báo giá theo License hoặc 15.000.000 VNĐ"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-orange-600 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Đơn vị tiền tệ
                    </label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value as 'VND' | 'USD')}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold cursor-pointer"
                    >
                      <option value="VND">VND (Việt Nam Đồng)</option>
                      <option value="USD">USD (Đô la Mỹ)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Trạng thái cung ứng / Tồn kho
                    </label>
                    <select
                      value={availabilitySignal}
                      onChange={(e) => setAvailabilitySignal(e.target.value as AvailabilitySignal)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold cursor-pointer"
                    >
                      <option value="in_stock">Sẵn sàng cung cấp (In Stock)</option>
                      <option value="pre_order">Đặt hàng trước (Pre-order)</option>
                      <option value="contact">Liên hệ trực tiếp (Contact)</option>
                      <option value="out_of_stock">Tạm hết hàng (Out of Stock)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Đơn vị tính / Gói
                    </label>
                    <input
                      type="text"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      placeholder="VD: License Standalone / Khóa USB"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Xuất xứ sản phẩm
                    </label>
                    <input
                      type="text"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      placeholder="VD: Mỹ (CSI America)"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Chính sách Bảo hành / Bảo trì
                    </label>
                    <input
                      type="text"
                      value={warranty}
                      onChange={(e) => setWarranty(e.target.value)}
                      placeholder="VD: 12 tháng nâng cấp phiên bản"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 4: NỘI DUNG CHI TIẾT */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
            <div
              onClick={() => toggleSection('sec_4')}
              className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-orange-600 text-white font-extrabold text-xs flex items-center justify-center">4</span>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Nội dung và đặc điểm nổi bật</h3>
              </div>
              {collapsedSections['sec_4'] ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
            </div>

            {!collapsedSections['sec_4'] && (
              <div className="p-5 space-y-4 text-xs">
                {/* Highlights Editor */}
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
                    Các điểm nổi bật chính (Highlights Checklist):
                  </label>
                  <div className="space-y-2">
                    {highlights.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => {
                            const newH = [...highlights];
                            newH[idx] = e.target.value;
                            setHighlights(newH);
                          }}
                          className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                        />
                        <button
                          type="button"
                          onClick={() => setHighlights(highlights.filter((_, i) => i !== idx))}
                          className="p-2 text-slate-400 hover:text-red-500 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setHighlights([...highlights, ''])}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-orange-600 font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Thêm điểm nổi bật
                    </button>
                  </div>
                </div>

                {/* Main Content Rich Editor */}
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
                    Bài viết giới thiệu chi tiết (Rich HTML Content):
                  </label>
                  <RichTextEditor value={contentHtml} onChange={setContentHtml} minHeight="300px" />
                </div>
              </div>
            )}
          </div>

          {/* SECTION 5: THÔNG SỐ KỸ THUẬT */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
            <div
              onClick={() => toggleSection('sec_5')}
              className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-orange-600 text-white font-extrabold text-xs flex items-center justify-center">5</span>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Thông số kỹ thuật</h3>
              </div>
              {collapsedSections['sec_5'] ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
            </div>

            {!collapsedSections['sec_5'] && (
              <div className="p-5 space-y-3 text-xs">
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                      <tr>
                        <th className="py-2.5 px-3 text-left w-1/3">Tên Thông số</th>
                        <th className="py-2.5 px-3 text-left">Giá trị</th>
                        <th className="py-2.5 px-3 text-left w-1/4">Nhóm thông số</th>
                        <th className="py-2.5 px-3 text-center w-12">Xóa</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {techSpecs.map((spec, i) => (
                        <tr key={spec.id || i}>
                          <td className="p-2">
                            <input
                              type="text"
                              value={spec.key}
                              onChange={(e) => {
                                const next = [...techSpecs];
                                next[i].key = e.target.value;
                                setTechSpecs(next);
                              }}
                              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={spec.value}
                              onChange={(e) => {
                                const next = [...techSpecs];
                                next[i].value = e.target.value;
                                setTechSpecs(next);
                              }}
                              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={spec.group || ''}
                              onChange={(e) => {
                                const next = [...techSpecs];
                                next[i].group = e.target.value;
                                setTechSpecs(next);
                              }}
                              placeholder="Yêu cầu hệ thống..."
                              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                            />
                          </td>
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => setTechSpecs(techSpecs.filter((_, idx) => idx !== i))}
                              className="p-1.5 text-slate-400 hover:text-red-500 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setTechSpecs([...techSpecs, { id: `sp_${Date.now()}`, key: '', value: '', group: 'Chung' }])
                  }
                  className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 text-orange-600 font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Thêm hàng thông số kỹ thuật
                </button>
              </div>
            )}
          </div>

          {/* SECTION 6: MEDIA (IMAGES & VIDEO) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
            <div
              onClick={() => toggleSection('sec_6')}
              className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-orange-600 text-white font-extrabold text-xs flex items-center justify-center">6</span>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Hình ảnh và video</h3>
              </div>
              {collapsedSections['sec_6'] ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
            </div>

            {!collapsedSections['sec_6'] && (
              <div className="p-5 space-y-4 text-xs">
                {/* Main Image */}
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Ảnh đại diện chính (Thumbnail URL) *
                  </label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                    <div className="w-12 h-12 rounded-xl border overflow-hidden shrink-0 bg-slate-100">
                      <img src={image} alt="" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                {/* Gallery */}
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Bộ sưu tập ảnh sản phẩm (Gallery)
                  </label>
                  <div className="flex items-center gap-3 overflow-x-auto pb-2">
                    {gallery.map((imgUrl, i) => (
                      <div key={i} className="relative group w-20 h-16 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0">
                        <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setGallery(gallery.filter((_, idx) => idx !== i))}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newGalleryInput}
                      onChange={(e) => setNewGalleryInput(e.target.value)}
                      placeholder="Dán URL ảnh bổ sung..."
                      className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newGalleryInput.trim()) {
                          setGallery([...gallery, newGalleryInput.trim()]);
                          setNewGalleryInput('');
                        }
                      }}
                      className="px-3.5 py-2 bg-slate-800 text-white font-bold rounded-xl cursor-pointer"
                    >
                      Thêm ảnh
                    </button>
                  </div>
                </div>

                {/* Video URL */}
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Đường dẫn Video Youtube / Demo sản phẩm
                  </label>
                  <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>
            )}
          </div>

          {/* SECTION 7: TÀI LIỆU & BROCHURE */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
            <div
              onClick={() => toggleSection('sec_7')}
              className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-orange-600 text-white font-extrabold text-xs flex items-center justify-center">7</span>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Tài liệu đính kèm</h3>
              </div>
              {collapsedSections['sec_7'] ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
            </div>

            {!collapsedSections['sec_7'] && (
              <div className="p-5 space-y-3 text-xs">
                <div className="space-y-2">
                  {documents.map((doc, i) => (
                    <div key={doc.id || i} className="p-3 border border-slate-200 dark:border-slate-800 rounded-xl grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                      <div className="md:col-span-5">
                        <label className="block text-[10px] text-slate-400 font-bold">Tên tài liệu</label>
                        <input
                          type="text"
                          value={doc.title}
                          onChange={(e) => {
                            const next = [...documents];
                            next[i].title = e.target.value;
                            setDocuments(next);
                          }}
                          className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold"
                        />
                      </div>

                      <div className="md:col-span-4">
                        <label className="block text-[10px] text-slate-400 font-bold">URL File</label>
                        <input
                          type="text"
                          value={doc.file_url}
                          onChange={(e) => {
                            const next = [...documents];
                            next[i].file_url = e.target.value;
                            setDocuments(next);
                          }}
                          className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-[10px] text-slate-400 font-bold">Quyền tải về</label>
                        <select
                          value={doc.access}
                          onChange={(e) => {
                            const next = [...documents];
                            next[i].access = e.target.value as 'public' | 'require_email';
                            setDocuments(next);
                          }}
                          className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px]"
                        >
                          <option value="public">Công khai</option>
                          <option value="require_email">Cần nhập Email</option>
                        </select>
                      </div>

                      <div className="md:col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => setDocuments(documents.filter((_, idx) => idx !== i))}
                          className="p-1.5 text-slate-400 hover:text-red-500 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setDocuments([
                      ...documents,
                      { id: `doc_${Date.now()}`, title: 'Tài liệu hướng dẫn mới', file_url: '/files/new_doc.pdf', file_type: 'PDF', file_size: '2.0 MB', version: '1.0', access: 'public' },
                    ])
                  }
                  className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 text-orange-600 font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Thêm file tài liệu
                </button>
              </div>
            )}
          </div>

          {/* SECTION 8: SEO & SHARING */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
            <div
              onClick={() => toggleSection('sec_8')}
              className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-orange-600 text-white font-extrabold text-xs flex items-center justify-center">8</span>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">SEO và chia sẻ mạng xã hội</h3>
              </div>
              {collapsedSections['sec_8'] ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
            </div>

            {!collapsedSections['sec_8'] && (
              <div className="p-5 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Thẻ SEO Meta Title *
                  </label>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder={title}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">{metaTitle.length}/60 ký tự khuyến nghị</span>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Thẻ SEO Meta Description *
                  </label>
                  <textarea
                    rows={2}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder={shortDescription}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">{metaDescription.length}/160 ký tự khuyến nghị</span>
                </div>

                {/* Google Search Card Live Preview */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Xem trước trên Google:</span>
                  <div className="text-blue-700 dark:text-blue-400 font-bold text-sm hover:underline cursor-pointer">
                    {metaTitle || title || 'Tên sản phẩm - CIC Technology'}
                  </div>
                  <div className="text-emerald-700 dark:text-emerald-400 text-[11px] font-mono">
                    https://cic.com.vn/san-pham/{alias || 'url-san-pham'}
                  </div>
                  <div className="text-slate-600 dark:text-slate-300 text-[11px]">
                    {metaDescription || shortDescription || 'Mô tả tóm tắt hiển thị trên kết quả tìm kiếm Google...'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 9: LIÊN HỆ & PHỤ TRÁCH */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
            <div
              onClick={() => toggleSection('sec_9')}
              className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-orange-600 text-white font-extrabold text-xs flex items-center justify-center">9</span>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Người phụ trách và nơi nhận liên hệ</h3>
              </div>
              {collapsedSections['sec_9'] ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
            </div>

            {!collapsedSections['sec_9'] && (
              <div className="p-5 space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Chuyên viên Phụ trách Sản phẩm *
                    </label>
                    <select
                      value={ownerId}
                      onChange={(e) => setOwnerId(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium cursor-pointer"
                    >
                      {owners.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.name} - {o.role} ({o.department})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Bộ phận nhận yêu cầu báo giá
                    </label>
                    <input
                      type="text"
                      value={inquiryRouting}
                      onChange={(e) => setInquiryRouting(e.target.value)}
                      placeholder="Phòng Kinh doanh Phần mềm CSI"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 10: XUẤT BẢN & CATALOG PLACEMENT */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
            <div
              onClick={() => toggleSection('sec_10')}
              className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-orange-600 text-white font-extrabold text-xs flex items-center justify-center">10</span>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">10. Cấu hình Xuất bản & Catalog Placement</h3>
              </div>
              {collapsedSections['sec_10'] ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
            </div>

            {!collapsedSections['sec_10'] && (
              <div className="p-5 space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Trạng thái Biên tập (Editorial Status) *
                    </label>
                    <select
                      value={editorialStatus}
                      onChange={(e) => setEditorialStatus(e.target.value as EditorialStatus)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold cursor-pointer"
                    >
                      <option value="draft">Bản nháp</option>
                      <option value="pending_review">Chờ duyệt (Pending Review)</option>
                      <option value="approved">Đã duyệt (Approved)</option>
                      <option value="published">Đã xuất bản (Published)</option>
                      <option value="rejected">Trả lại chỉnh sửa (Rejected)</option>
                      <option value="archived">Lưu trữ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Trạng thái Catalog Kinh doanh *
                    </label>
                    <select
                      value={catalogStatus}
                      onChange={(e) => setCatalogStatus(e.target.value as CatalogStatus)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold cursor-pointer"
                    >
                      <option value="active">Đang kinh doanh</option>
                      <option value="inactive">Ngừng kinh doanh</option>
                      <option value="archived">Lưu trữ</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Thứ tự hiển thị (Catalog Ordering)
                    </label>
                    <input
                      type="number"
                      value={ordering}
                      onChange={(e) => setOrdering(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                    />
                  </div>

                  <div className="pt-4">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isHot}
                        onChange={(e) => setIsHot(e.target.checked)}
                        className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500"
                      />
                      <span className="font-bold text-slate-900 dark:text-white">
                        Đánh dấu Sản phẩm Nổi bật / Hot Product
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: COMPLETENESS SCORE & CONTEXT SIDEBAR */}
        <div className="lg:col-span-4 space-y-5">
          {/* Completeness Checklist Card */}
          <div className="cms-sticky-aside bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                Chất lượng Dữ liệu (Completeness)
              </h3>
              <span className="text-lg font-black text-orange-600 dark:text-orange-400">
                {completenessScore}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  completenessScore >= 80 ? 'bg-emerald-500' : completenessScore >= 50 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${completenessScore}%` }}
              />
            </div>

            {/* Missing Fields Checklist */}
            {missingFields.length > 0 ? (
              <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 rounded-xl space-y-1.5 text-xs text-red-800 dark:text-red-300">
                <p className="font-bold text-[11px] flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                  <span>Cần bổ sung ({missingFields.length} mục):</span>
                </p>
                <ul className="text-[10px] list-disc pl-4 space-y-0.5">
                  {missingFields.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Dữ liệu đạt chuẩn chất lượng 100%!</span>
              </div>
            )}

            <hr className="border-slate-100 dark:border-slate-800" />

            {/* Workflow Quick Status */}
            <div className="space-y-2 text-xs">
              <span className="text-slate-400 font-bold block text-[10px] uppercase">
                Trạng thái hoạt động
              </span>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Biên tập:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 uppercase">{editorialStatus}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Kinh doanh:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 uppercase">{catalogStatus}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
