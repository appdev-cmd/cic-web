import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  CheckCircle2,
  Package,
  Building2,
  Cpu,
  Layers,
  UserCheck,
  Zap,
  Globe,
  Tag,
  FileText,
  Search,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Plus,
  Trash2,
} from 'lucide-react';
import {
  MasterDataType,
  AnyMasterItem,
  MasterCategoryItem,
  MasterBrandItem,
  MasterApplicationItem,
  MasterProductTypeItem,
  MasterSalesStaffItem,
  MasterRoutingRuleItem,
} from './types';

interface MasterDataFormDrawerProps {
  isOpen: boolean;
  item: AnyMasterItem | null;
  targetType: MasterDataType;
  categories: MasterCategoryItem[];
  brands: MasterBrandItem[];
  staff: MasterSalesStaffItem[];
  onSave: (savedItem: AnyMasterItem) => void;
  onClose: () => void;
}

export const MasterDataFormDrawer: React.FC<MasterDataFormDrawerProps> = ({
  isOpen,
  item,
  targetType,
  categories,
  brands,
  staff,
  onSave,
  onClose,
}) => {
  if (!isOpen) return null;

  const isEdit = !!item;
  const typeLabels: Record<MasterDataType, string> = {
    categories: 'danh mục sản phẩm',
    brands: 'hãng sản xuất',
    applications: 'lĩnh vực ứng dụng',
    product_types: 'loại sản phẩm',
    sales_staff: 'người phụ trách',
    routing_rules: 'quy tắc nhận liên hệ',
  };

  // Active form tab
  const [activeTab, setActiveTab] = useState<'basic' | 'structure' | 'seo' | 'routing'>('basic');

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [ordering, setOrdering] = useState(1);

  // Category Specifics
  const [slug, setSlug] = useState('');
  const [parentId, setParentId] = useState<string | null>(null);
  const [icon, setIcon] = useState('Building2');
  const [imageUrl, setImageUrl] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [siteScope, setSiteScope] = useState<string[]>(['main_website']);

  // Brand Specifics
  const [country, setCountry] = useState('Mỹ (USA)');
  const [logoUrl, setLogoUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [contactPerson, setContactPerson] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  // Application Specifics
  const [sectorGroup, setSectorGroup] = useState('Kết cấu Dân dụng & Công nghiệp');
  const [colorBadge, setColorBadge] = useState('bg-blue-500/10 text-blue-600 border-blue-500/20');

  // Product Type Specifics
  const [typeCode, setTypeCode] = useState('software_desktop');
  const [requiresLicenseKey, setRequiresLicenseKey] = useState(true);
  const [pricingModel, setPricingModel] = useState<'quote' | 'fixed_price' | 'subscription'>('quote');

  // Sales Staff Specifics
  const [staffCode, setStaffCode] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [assignedCategoryIds, setAssignedCategoryIds] = useState<string[]>([]);
  const [assignedBrandIds, setAssignedBrandIds] = useState<string[]>([]);
  const [capacityInquiries, setCapacityInquiries] = useState(50);

  // Routing Rule Specifics
  const [priority, setPriority] = useState(1);
  const [scopeCatIds, setScopeCatIds] = useState<string[]>([]);
  const [scopeBrandIds, setScopeBrandIds] = useState<string[]>([]);
  const [triggerKeywords, setTriggerKeywords] = useState('etabs, sap2000, safe');
  const [primarySalesId, setPrimarySalesId] = useState(staff[0]?.id || 'staff_001');
  const [fallbackEmail, setFallbackEmail] = useState('phongkinhdoanh@cic.com.vn');
  const [notifyCcEmails, setNotifyCcEmails] = useState('admin@cic.com.vn, hotro@cic.com.vn');

  // Populate state on edit
  useEffect(() => {
    if (item) {
      setName(item.name || '');
      setCode(item.code || '');
      setDescription(item.description || '');
      setStatus(item.status === 'inactive' ? 'inactive' : 'active');
      setOrdering(item.ordering || 1);

      if (item.type === 'categories') {
        const cat = item as MasterCategoryItem;
        setSlug(cat.slug || '');
        setParentId(cat.parent_id || null);
        setIcon(cat.icon || 'Building2');
        setImageUrl(cat.image || '');
        setMetaTitle(cat.meta_title || '');
        setMetaDescription(cat.meta_description || '');
        setCanonicalUrl(cat.canonical_url || '');
        setSiteScope(cat.site_scope || ['main_website']);
      } else if (item.type === 'brands') {
        const brd = item as MasterBrandItem;
        setCountry(brd.country || 'Việt Nam');
        setLogoUrl(brd.logo || '');
        setWebsiteUrl(brd.website || '');
        setIsFeatured(brd.is_featured || false);
        setContactPerson(brd.contact_person || '');
        setContactEmail(brd.contact_email || '');
      } else if (item.type === 'applications') {
        const app = item as MasterApplicationItem;
        setSectorGroup(app.sector_group || 'Kết cấu Dân dụng & Công nghiệp');
        setColorBadge(app.color_badge || 'bg-blue-500/10 text-blue-600 border-blue-500/20');
        setIcon(app.icon || 'Cpu');
      } else if (item.type === 'product_types') {
        const pt = item as MasterProductTypeItem;
        setTypeCode(pt.type_code || 'software_desktop');
        setRequiresLicenseKey(pt.requires_license_key ?? true);
        setPricingModel(pt.pricing_model_default || 'quote');
      } else if (item.type === 'sales_staff') {
        const st = item as MasterSalesStaffItem;
        setStaffCode(st.staff_code || '');
        setEmail(st.email || '');
        setPhone(st.phone || '');
        setRoleTitle(st.role_title || '');
        setDepartment(st.department || '');
        setAvatarUrl(st.avatar || '');
        setAssignedCategoryIds(st.assigned_category_ids || []);
        setAssignedBrandIds(st.assigned_brand_ids || []);
        setCapacityInquiries(st.monthly_capacity_inquiries || 50);
      } else if (item.type === 'routing_rules') {
        const rr = item as MasterRoutingRuleItem;
        setPriority(rr.priority || 1);
        setScopeCatIds(rr.scope_category_ids || []);
        setScopeBrandIds(rr.scope_brand_ids || []);
        setTriggerKeywords((rr.trigger_keywords || []).join(', '));
        setPrimarySalesId(rr.primary_sales_id || staff[0]?.id || 'staff_001');
        setFallbackEmail(rr.fallback_email || 'phongkinhdoanh@cic.com.vn');
        setNotifyCcEmails((rr.notify_cc_emails || []).join(', '));
      }
    } else {
      // Reset defaults for Create new
      setName('');
      setCode(`CODE-${Date.now().toString().slice(-4)}`);
      setDescription('');
      setStatus('active');
      setOrdering(1);
      setSlug('');
      setParentId(null);
      setIcon('Building2');
      setImageUrl('');
      setMetaTitle('');
      setMetaDescription('');
      setCanonicalUrl('');
      setSiteScope(['main_website']);
      setCountry('Việt Nam');
      setLogoUrl('');
      setWebsiteUrl('');
      setIsFeatured(false);
      setContactPerson('');
      setContactEmail('');
      setSectorGroup('Kết cấu Dân dụng & Công nghiệp');
      setColorBadge('bg-blue-500/10 text-blue-600 border-blue-500/20');
      setTypeCode('software_desktop');
      setRequiresLicenseKey(true);
      setPricingModel('quote');
      setStaffCode(`CIC-KD-${Math.floor(Math.random() * 90 + 10)}`);
      setEmail('');
      setPhone('');
      setRoleTitle('Chuyên viên Tư vấn Kỹ thuật');
      setDepartment('Phòng Kinh doanh Phần mềm');
      setAvatarUrl('');
      setAssignedCategoryIds([]);
      setAssignedBrandIds([]);
      setCapacityInquiries(50);
      setPriority(1);
      setScopeCatIds([]);
      setScopeBrandIds([]);
      setTriggerKeywords('etabs, sap2000');
      setPrimarySalesId(staff[0]?.id || 'staff_001');
      setFallbackEmail('phongkinhdoanh@cic.com.vn');
      setNotifyCcEmails('admin@cic.com.vn');
    }
  }, [item, targetType]);

  // Auto Generate Slug Handler
  const handleAutoSlug = () => {
    if (!name) return;
    const generated = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    setSlug(generated);
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const baseObj = {
      id: item?.id || `item_${Date.now()}`,
      name: name.trim(),
      code: code.trim() || `CODE-${Date.now()}`,
      status: status,
      ordering: Number(ordering) || 1,
      usage_count: item?.usage_count || 0,
      description: description.trim(),
      created_time: item?.created_time || new Date().toISOString().replace('T', ' ').substring(0, 19),
      updated_time: new Date().toISOString().replace('T', ' ').substring(0, 19),
      updated_by: 'Lê Hoàng Nam',
    };

    let resultObj: AnyMasterItem;

    if (targetType === 'categories') {
      const parentName = categories.find((c) => c.id === parentId)?.name;
      resultObj = {
        ...baseObj,
        type: 'categories',
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        parent_id: parentId,
        parent_name: parentName,
        level: parentId ? 2 : 1,
        icon: icon,
        image: imageUrl,
        meta_title: metaTitle,
        meta_description: metaDescription,
        canonical_url: canonicalUrl,
        site_scope: siteScope as any,
      } as MasterCategoryItem;
    } else if (targetType === 'brands') {
      resultObj = {
        ...baseObj,
        type: 'brands',
        country: country,
        logo: logoUrl,
        website: websiteUrl,
        is_featured: isFeatured,
        contact_person: contactPerson,
        contact_email: contactEmail,
      } as MasterBrandItem;
    } else if (targetType === 'applications') {
      resultObj = {
        ...baseObj,
        type: 'applications',
        sector_group: sectorGroup,
        color_badge: colorBadge,
        icon: icon,
      } as MasterApplicationItem;
    } else if (targetType === 'product_types') {
      resultObj = {
        ...baseObj,
        type: 'product_types',
        type_code: typeCode,
        requires_license_key: requiresLicenseKey,
        pricing_model_default: pricingModel,
        icon: icon,
      } as MasterProductTypeItem;
    } else if (targetType === 'sales_staff') {
      resultObj = {
        ...baseObj,
        type: 'sales_staff',
        staff_code: staffCode,
        email: email,
        phone: phone,
        role_title: roleTitle,
        department: department,
        avatar: avatarUrl,
        assigned_category_ids: assignedCategoryIds,
        assigned_brand_ids: assignedBrandIds,
        monthly_capacity_inquiries: Number(capacityInquiries) || 50,
      } as MasterSalesStaffItem;
    } else {
      const selectedStaffObj = staff.find((s) => s.id === primarySalesId);
      resultObj = {
        ...baseObj,
        type: 'routing_rules',
        priority: Number(priority) || 1,
        scope_category_ids: scopeCatIds,
        scope_brand_ids: scopeBrandIds,
        trigger_keywords: triggerKeywords.split(',').map((k) => k.trim()).filter(Boolean),
        primary_sales_id: primarySalesId,
        primary_sales_name: selectedStaffObj?.name || 'Lê Hoàng Nam',
        fallback_email: fallbackEmail,
        notify_cc_emails: notifyCcEmails.split(',').map((k) => k.trim()).filter(Boolean),
      } as MasterRoutingRuleItem;
    }

    onSave(resultObj);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between animate-in slide-in-from-right duration-250">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-600 text-white rounded-xl shadow-md shadow-orange-600/20">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                {isEdit ? `Chỉnh sửa ${typeLabels[targetType]}` : `Thêm ${typeLabels[targetType]}`}
              </h2>
              <p className="text-xs text-orange-600 font-bold capitalize">
                Dùng trong phần thiết lập sản phẩm
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 px-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`py-3 px-3 font-bold border-b-2 -mb-px cursor-pointer transition-all ${
              activeTab === 'basic'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            1. Thông tin cơ bản
          </button>

          {targetType === 'categories' && (
            <button
              type="button"
              onClick={() => setActiveTab('seo')}
              className={`py-3 px-3 font-bold border-b-2 -mb-px cursor-pointer transition-all ${
                activeTab === 'seo'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              2. Tìm kiếm và hiển thị công khai
            </button>
          )}

          {(targetType === 'sales_staff' || targetType === 'routing_rules') && (
            <button
              type="button"
              onClick={() => setActiveTab('routing')}
              className={`py-3 px-3 font-bold border-b-2 -mb-px cursor-pointer transition-all ${
                activeTab === 'routing'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              2. Phân công và nhận liên hệ
            </button>
          )}
        </div>

        {/* Drawer Form Body */}
        <form id="masterDataForm" onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto space-y-5 text-xs">
          
          {/* TAB 1: BASIC INFO */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Tên mục <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ví dụ: Phần mềm thiết kế kết cấu"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none focus:border-orange-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Mã nhận diện:
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Status & Priority Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Trạng thái hoạt động:
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold cursor-pointer focus:outline-none"
                  >
                    <option value="active">Đang sử dụng</option>
                    <option value="inactive">Ngừng sử dụng</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Thứ tự ưu tiên:
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={ordering}
                    onChange={(e) => setOrdering(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold focus:outline-none"
                  />
                </div>
              </div>

              {/* Category specific fields */}
              {targetType === 'categories' && (
                <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                        Danh mục cha (Parent Category):
                      </label>
                      <select
                        value={parentId || ''}
                        onChange={(e) => setParentId(e.target.value || null)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium cursor-pointer focus:outline-none"
                      >
                        <option value="">(Cấp cao nhất - Root Category)</option>
                        {categories.filter((c) => c.id !== item?.id).map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-slate-700 dark:text-slate-300 font-bold">
                          Đường dẫn Alias (Slug):
                        </label>
                        <button
                          type="button"
                          onClick={handleAutoSlug}
                          className="text-[10px] text-orange-600 font-bold hover:underline cursor-pointer"
                        >
                          Tạo tự động
                        </button>
                      </div>
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="phan-mem-ket-cau"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Brand specific fields */}
              {targetType === 'brands' && (
                <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                        Quốc gia sản xuất:
                      </label>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="Mỹ (USA), Nhật Bản, Việt Nam..."
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                        Website chính thức Hãng:
                      </label>
                      <input
                        type="url"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        placeholder="https://www.csiamerica.com"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="w-4 h-4 text-orange-600 rounded cursor-pointer"
                    />
                    <label htmlFor="isFeatured" className="font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                      Nổi bật trên Trang chủ & Footer Website
                    </label>
                  </div>
                </div>
              )}

              {/* Sales Staff Specific Fields */}
              {targetType === 'sales_staff' && (
                <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                        Mã nhân viên (Staff Code):
                      </label>
                      <input
                        type="text"
                        value={staffCode}
                        onChange={(e) => setStaffCode(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                        Email công việc:
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nam.lh@cic.com.vn"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                        Chức danh / Vai trò:
                      </label>
                      <input
                        type="text"
                        value={roleTitle}
                        onChange={(e) => setRoleTitle(e.target.value)}
                        placeholder="Trưởng phòng KD1..."
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                        Phòng ban:
                      </label>
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="Phòng Kinh doanh Phần mềm"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Description textarea */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Mô tả vắn tắt / Ghi chú nghiệp vụ:
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả phạm vi áp dụng..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* TAB 2: SEO & PUBLIC DISPLAY (For Categories) */}
          {activeTab === 'seo' && targetType === 'categories' && (
            <div className="space-y-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Thẻ SEO Meta Title:
                </label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Phần mềm Thiết kế Kết cấu | Công ty CIC"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Thẻ SEO Meta Description:
                </label>
                <textarea
                  rows={3}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Phân phối phần mềm ETABS, SAP2000 chính hãng..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Đường dẫn Canonical URL:
                </label>
                <input
                  type="url"
                  value={canonicalUrl}
                  onChange={(e) => setCanonicalUrl(e.target.value)}
                  placeholder="https://cic.com.vn/danh-muc/phan-mem-ket-cau"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 3: ROUTING & SCOPE CONFIG (For Routing Rules & Sales Staff) */}
          {activeTab === 'routing' && (targetType === 'routing_rules' || targetType === 'sales_staff') && (
            <div className="space-y-4">
              {targetType === 'routing_rules' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                        Thứ tự ưu tiên quy tắc (Priority #):
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={priority}
                        onChange={(e) => setPriority(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold focus:outline-none"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Số nhỏ hơn có thứ tự ưu tiên cao hơn
                      </span>
                    </div>

                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                        Người phụ trách chính tiếp nhận:
                      </label>
                      <select
                        value={primarySalesId}
                        onChange={(e) => setPrimarySalesId(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold cursor-pointer focus:outline-none"
                      >
                        {staff.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} ({s.staff_code})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                      Từ khóa Kích hoạt (Trigger Keywords):
                    </label>
                    <input
                      type="text"
                      value={triggerKeywords}
                      onChange={(e) => setTriggerKeywords(e.target.value)}
                      placeholder="etabs, sap2000, safe, bao gia..."
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Phân cách bằng dấu phẩy. Dùng dấu * cho quy tắc mặc định.
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                        Email Fallback khi trùng lỗi:
                      </label>
                      <input
                        type="email"
                        value={fallbackEmail}
                        onChange={(e) => setFallbackEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                        Email CC nhận thông báo đồng thời:
                      </label>
                      <input
                        type="text"
                        value={notifyCcEmails}
                        onChange={(e) => setNotifyCcEmails(e.target.value)}
                        placeholder="admin@cic.com.vn, hotro@cic.com.vn"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono focus:outline-none"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

        </form>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl cursor-pointer"
          >
            Hủy bỏ
          </button>

          <button
            type="submit"
            form="masterDataForm"
            className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-md shadow-orange-600/20 flex items-center gap-2 cursor-pointer transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{isEdit ? 'Lưu thay đổi' : `Thêm ${typeLabels[targetType]}`}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
