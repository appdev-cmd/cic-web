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
  ArrowLeft,
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
} from './types';

interface MasterDataFormDrawerProps {
  isOpen: boolean;
  item: AnyMasterItem | null;
  targetType: MasterDataType;
  categories: MasterCategoryItem[];
  brands: MasterBrandItem[];
  staff: MasterSalesStaffItem[];
  productOptions: { id: string; name?: string }[];
  presentation?: 'drawer' | 'page';
  onSave: (savedItem: AnyMasterItem) => void;
  onClose: () => void;
}

const createAlias = (value: string) => value
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[đĐ]/g, 'd')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

function ProductAssignmentField({
  label,
  options,
  selectedIds,
  onChange,
}: {
  label: string;
  options: { id: string; name?: string }[];
  selectedIds: string[];
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [query, setQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(50);
  const [showAllSelected, setShowAllSelected] = useState(false);
  const [selectedVisibleCount, setSelectedVisibleCount] = useState(50);
  const filtered = options.filter((product) => (product.name || product.id).toLowerCase().includes(query.toLowerCase()));
  const visibleProducts = filtered.slice(0, visibleCount);
  const visibleSelectedIds = selectedIds.slice(0, showAllSelected ? selectedVisibleCount : 6);
  const selectableIds = filtered.map((product) => product.id);
  const hasUnselectedVisibleProduct = selectableIds.some((id) => !selectedIds.includes(id));

  useEffect(() => {
    setVisibleCount(50);
  }, [query]);

  const handleSelectVisible = () => {
    onChange((current) => Array.from(new Set([...current, ...selectableIds])));
  };

  return (
    <fieldset className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
      <legend className="px-1 font-bold text-slate-700 dark:text-slate-300">{label}</legend>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="text-slate-400">Đã chọn {selectedIds.length} sản phẩm</span>
        <div className="flex items-center gap-3">
          <button type="button" onClick={handleSelectVisible} disabled={!hasUnselectedVisibleProduct} className="font-bold text-orange-600 hover:underline disabled:cursor-not-allowed disabled:text-slate-300 disabled:no-underline dark:disabled:text-slate-600">
            {query.trim() ? 'Chọn tất cả kết quả' : 'Chọn tất cả'}
          </button>
          {selectedIds.length > 0 && <button type="button" onClick={() => onChange([])} className="font-bold text-slate-500 hover:text-red-600 hover:underline">Xóa chọn</button>}
        </div>
      </div>
      {selectedIds.length > 0 && (
        <div className={`mb-3 ${showAllSelected ? 'max-h-48 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50' : ''}`}>
          <div className="flex flex-wrap gap-2">
            {visibleSelectedIds.map((id) => {
              const product = options.find((option) => option.id === id);
              return (
                <span key={id} className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-orange-200 bg-orange-50 px-2.5 py-1.5 text-xs font-semibold text-orange-700">
                  <span className="max-w-80 truncate">{product?.name || id}</span>
                  <button type="button" onClick={() => onChange((current) => current.filter((currentId) => currentId !== id))} aria-label={`Bỏ chọn ${product?.name || id}`} className="rounded p-0.5 hover:bg-orange-100">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              );
            })}
            {!showAllSelected && selectedIds.length > visibleSelectedIds.length && (
              <button type="button" onClick={() => setShowAllSelected(true)} className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-500 hover:border-orange-300 hover:text-orange-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Xem {selectedIds.length - visibleSelectedIds.length} sản phẩm khác
              </button>
            )}
          </div>
          {showAllSelected && (
            <div className="mt-3 flex items-center justify-end gap-3 border-t border-slate-200 pt-2 dark:border-slate-700">
              {selectedVisibleCount < selectedIds.length && <button type="button" onClick={() => setSelectedVisibleCount((count) => count + 50)} className="text-xs font-bold text-orange-600 hover:underline">Hiển thị thêm 50</button>}
              <button type="button" onClick={() => { setShowAllSelected(false); setSelectedVisibleCount(50); }} className="text-xs font-bold text-slate-500 hover:underline">Thu gọn</button>
            </div>
          )}
        </div>
      )}
      <div className="relative mb-3">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm sản phẩm..." className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-8 pr-3 text-xs outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800" />
      </div>
      <div className="max-h-48 space-y-1 overflow-y-auto pr-1">
        {visibleProducts.map((product) => <label key={product.id} className="flex cursor-pointer items-start gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800">
          <input type="checkbox" checked={selectedIds.includes(product.id)} onChange={() => onChange((current) => current.includes(product.id) ? current.filter((id) => id !== product.id) : [...current, product.id])} className="mt-0.5 h-4 w-4 rounded text-orange-600" />
          <span className="leading-5 text-slate-700 dark:text-slate-300">{product.name || product.id}</span>
        </label>)}
        {filtered.length === 0 && <div className="py-4 text-center text-[11px] text-slate-400">Không tìm thấy sản phẩm</div>}
        {visibleCount < filtered.length && (
          <button type="button" onClick={() => setVisibleCount((count) => count + 50)} className="w-full rounded-lg border border-dashed border-slate-300 px-3 py-2 text-xs font-bold text-slate-500 hover:border-orange-300 hover:text-orange-600 dark:border-slate-700">
            Hiển thị thêm 50 sản phẩm ({filtered.length - visibleCount} còn lại)
          </button>
        )}
      </div>
    </fieldset>
  );
}

export const MasterDataFormDrawer: React.FC<MasterDataFormDrawerProps> = ({
  isOpen,
  item,
  targetType,
  categories,
  brands,
  staff,
  productOptions,
  presentation = 'drawer',
  onSave,
  onClose,
}) => {
  const isEdit = !!item;
  const typeLabels: Record<MasterDataType, string> = {
    categories: 'danh mục sản phẩm',
    brands: 'hãng sản xuất',
    applications: 'lĩnh vực ứng dụng',
    product_types: 'loại sản phẩm',
    sales_staff: 'người phụ trách',
  };

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [ordering, setOrdering] = useState(1);

  // Category Specifics (internal defaults)
  const [parentId, setParentId] = useState<string | null>(null);

  // Application Specifics
  const [sectorGroup, setSectorGroup] = useState('Kết cấu Dân dụng & Công nghiệp');
  const [colorBadge, setColorBadge] = useState('bg-blue-500/10 text-blue-600 border-blue-500/20');
  const [icon, setIcon] = useState('Cpu');

  // Product Type Specifics
  const [requiresLicenseKey, setRequiresLicenseKey] = useState(true);
  const [pricingModel, setPricingModel] = useState<'quote' | 'fixed_price' | 'subscription'>('quote');

  // Sales Staff Specifics
  const [phone, setPhone] = useState('');
  const [skype, setSkype] = useState('');
  const [zalo, setZalo] = useState('');
  const [salesAlias, setSalesAlias] = useState('');
  const [contactProductIds, setContactProductIds] = useState<string[]>([]);
  const [salesProductIds, setSalesProductIds] = useState<string[]>([]);
  const [technicalProductIds, setTechnicalProductIds] = useState<string[]>([]);
  const [northSalesProductIds, setNorthSalesProductIds] = useState<string[]>([]);
  const [southSalesProductIds, setSouthSalesProductIds] = useState<string[]>([]);

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
        setParentId(cat.parent_id || null);
      } else if (item.type === 'applications') {
        const app = item as MasterApplicationItem;
        setSectorGroup(app.sector_group || 'Kết cấu Dân dụng & Công nghiệp');
        setColorBadge(app.color_badge || 'bg-blue-500/10 text-blue-600 border-blue-500/20');
        setIcon(app.icon || 'Cpu');
      } else if (item.type === 'product_types') {
        const pt = item as MasterProductTypeItem;
        setRequiresLicenseKey(pt.requires_license_key ?? true);
        setPricingModel(pt.pricing_model_default || 'quote');
      } else if (item.type === 'sales_staff') {
        const st = item as MasterSalesStaffItem;
        setPhone(st.phone || '');
        setSkype(st.skype || '');
        setZalo(st.zalo || '');
        setSalesAlias(st.alias || '');
        setContactProductIds(st.contact_product_ids || []);
        setSalesProductIds(st.sales_product_ids || []);
        setTechnicalProductIds(st.technical_support_product_ids || []);
        setNorthSalesProductIds(st.north_sales_product_ids || []);
        setSouthSalesProductIds(st.south_sales_product_ids || []);
      }
    } else {
      // Reset defaults for Create new
      setName('');
      setCode(`CODE-${Date.now().toString().slice(-4)}`);
      setDescription('');
      setStatus('active');
      setOrdering(1);
      setParentId(null);
      setSectorGroup('Kết cấu Dân dụng & Công nghiệp');
      setColorBadge('bg-blue-500/10 text-blue-600 border-blue-500/20');
      setRequiresLicenseKey(true);
      setPricingModel('quote');
      setPhone('');
      setSkype('');
      setZalo('');
      setSalesAlias('');
      setContactProductIds([]);
      setSalesProductIds([]);
      setTechnicalProductIds([]);
      setNorthSalesProductIds([]);
      setSouthSalesProductIds([]);
    }
  }, [item, targetType]);

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const generatedAlias = createAlias(name);
    const baseObj = {
      id: item?.id || `item_${Date.now()}`,
      name: name.trim(),
      code: generatedAlias,
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
      const categoryAlias = createAlias(name);
      resultObj = {
        ...baseObj,
        type: 'categories',
        alias: categoryAlias,
        slug: categoryAlias,
        parent_id: null,
        parent_name: undefined,
        level: 1,
        icon: 'Package',
        image: '',
        meta_title: '',
        meta_keyword: '',
        meta_description: '',
        site_scope: ['main_website'],
      } as MasterCategoryItem;
    } else if (targetType === 'brands') {
      resultObj = {
        ...baseObj,
        type: 'brands',
        alias: generatedAlias,
        country: '',
        logo: '',
        website: '',
        is_featured: false,
      } as MasterBrandItem;
    } else if (targetType === 'applications') {
      resultObj = {
        ...baseObj,
        type: 'applications',
        alias: generatedAlias,
        sector_group: sectorGroup,
        color_badge: colorBadge,
        icon: icon,
      } as MasterApplicationItem;
    } else if (targetType === 'product_types') {
      resultObj = {
        ...baseObj,
        type: 'product_types',
        alias: generatedAlias,
        type_code: item?.type === 'product_types' ? item.type_code : generatedAlias,
        requires_license_key: requiresLicenseKey,
        pricing_model_default: pricingModel,
        icon: icon,
      } as MasterProductTypeItem;
    } else if (targetType === 'sales_staff') {
      resultObj = {
        ...baseObj,
        type: 'sales_staff',
        phone: phone,
        skype,
        zalo,
        alias: salesAlias || generatedAlias,
        contact_product_ids: contactProductIds,
        sales_product_ids: salesProductIds,
        technical_support_product_ids: technicalProductIds,
        north_sales_product_ids: northSalesProductIds,
        south_sales_product_ids: southSalesProductIds,
      } as MasterSalesStaffItem;
    } else return;

    onSave(resultObj);
  };

  if (!isOpen) return null;

  const isSimpleForm = targetType === 'categories' || targetType === 'brands';

  return (
    <div className={presentation === 'page' ? 'min-h-[calc(100vh-7rem)] animate-in fade-in duration-200' : 'fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200'}>
      <div className={presentation === 'page' ? 'flex min-h-[calc(100vh-7rem)] w-full flex-col rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900' : 'w-full max-w-2xl bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between animate-in slide-in-from-right duration-250'}>
        
        {/* Header */}
        <div className={`flex flex-wrap items-center justify-between gap-3 border border-slate-200 bg-white/95 p-3 shadow-md backdrop-blur sm:p-4 dark:border-slate-800 dark:bg-slate-900/95 ${presentation === 'page' ? 'cms-sticky-action rounded-xl' : 'border-x-0 border-t-0'}`}>
          <div className="flex items-center gap-3">
            {presentation === 'page' ? (
              <button type="button" onClick={onClose} className="rounded-xl bg-slate-100 p-2 text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700" title="Quay lại danh sách">
                <ArrowLeft className="h-5 w-5" />
              </button>
            ) : (
              <div className="rounded-xl bg-orange-600 p-2.5 text-white shadow-md shadow-orange-600/20">
                <Plus className="h-5 w-5" />
              </div>
            )}
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                {isEdit ? `Chỉnh sửa ${typeLabels[targetType]}` : `Thêm ${typeLabels[targetType]}`}
              </h2>
              <p className="text-xs text-orange-600 font-bold capitalize">
                {presentation === 'page' ? 'Thiết lập sản phẩm / Người phụ trách kinh doanh' : 'Dùng trong phần thiết lập sản phẩm'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {presentation !== 'page' && <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"><X className="h-5 w-5" /></button>}
            {presentation === 'page' && (
              <button
                type="submit"
                form="masterDataForm"
                className="flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-600/20 transition-colors hover:bg-orange-700"
              >
                <Save className="h-4 w-4" />
                {isEdit ? 'Lưu thay đổi' : `Thêm ${typeLabels[targetType]}`}
              </button>
            )}
          </div>
        </div>

        {/* Drawer Form Body */}
        <form id="masterDataForm" onSubmit={handleSubmit} className={`flex-1 space-y-5 text-xs ${presentation === 'page' ? 'mx-auto w-full max-w-6xl p-5 sm:p-6' : 'overflow-y-auto p-6'}`}>
          
          {/* SIMPLIFIED FORM FOR CATEGORIES & BRANDS */}
          {isSimpleForm ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Tiêu đề dữ liệu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={targetType === 'categories' ? 'Ví dụ: Phần mềm thiết kế kết cấu' : 'Ví dụ: CSI America'}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none focus:border-orange-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Tên hiệu <span className="font-normal text-slate-400">(Tự động sinh)</span>:
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={createAlias(name)}
                    placeholder="ten-hieu-tu-dong"
                    className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 font-mono text-slate-600 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
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
            </div>
          ) : (
            /* OTHER TYPES: APPLICATIONS, PRODUCT_TYPES, SALES_STAFF */
            <div className="space-y-4">
              <div className={`grid grid-cols-1 gap-3 ${targetType === 'sales_staff' ? '' : 'sm:grid-cols-3'}`}>
                <div className={targetType === 'sales_staff' ? '' : 'sm:col-span-2'}>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    {targetType === 'sales_staff' ? 'Tên nhân viên' : 'Tiêu đề dữ liệu'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={targetType === 'sales_staff' ? 'Nhập tên nhân viên' : 'Ví dụ: Thiết kế cầu đường'}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none focus:border-orange-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Tên hiệu <span className="font-normal text-slate-400">(Tự động sinh)</span>:
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={createAlias(name)}
                    placeholder="ten-hieu-tu-dong"
                    className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 font-mono text-slate-600 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  />
                </div>
              </div>

              {/* Status & Priority Order */}
              <div className={`grid grid-cols-1 gap-3 ${targetType === 'sales_staff' ? '' : 'sm:grid-cols-2'}`}>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    {targetType === 'sales_staff' ? 'Kích hoạt' : 'Trạng thái hoạt động'}:
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
                    {targetType === 'sales_staff' ? 'Thứ tự' : 'Thứ tự ưu tiên'}:
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

              {/* Sales Staff Specific Fields */}
              {targetType === 'sales_staff' && (
                <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Số điện thoại</label>
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Ví dụ: 0934 045 088" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none focus:border-orange-500" />
                    </div>
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Skype</label>
                      <input type="text" value={skype} onChange={(e) => setSkype(e.target.value)} placeholder="Tên tài khoản Skype" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none focus:border-orange-500" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Zalo</label>
                      <input type="text" value={zalo} onChange={(e) => setZalo(e.target.value)} placeholder="Số điện thoại hoặc tài khoản Zalo" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none focus:border-orange-500" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-slate-700 dark:text-slate-300 font-bold">Tên hiệu (Alias)</label>
                        <button type="button" onClick={() => setSalesAlias(createAlias(name))} className="text-[10px] font-bold text-orange-600 hover:underline">Tạo tự động</button>
                      </div>
                      <input type="text" value={salesAlias} onChange={(e) => setSalesAlias(e.target.value)} placeholder="Hệ thống tự động sinh" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono focus:outline-none focus:border-orange-500" />
                    </div>
                  </div>
                  <div className={presentation === 'page' ? 'space-y-5' : 'space-y-3'}>{[
                    ['Liên hệ', contactProductIds, setContactProductIds],
                    ['Liên hệ kinh doanh', salesProductIds, setSalesProductIds],
                    ['Liên hệ hỗ trợ kỹ thuật', technicalProductIds, setTechnicalProductIds],
                    ['Liên hệ kinh doanh Miền Bắc', northSalesProductIds, setNorthSalesProductIds],
                    ['Liên hệ kinh doanh Miền Nam', southSalesProductIds, setSouthSalesProductIds],
                  ].map(([label, selected, setter]) => <ProductAssignmentField key={label as string} label={label as string} options={productOptions} selectedIds={selected as string[]} onChange={setter as React.Dispatch<React.SetStateAction<string[]>>} />)}</div>
                </div>
              )}
            </div>
          )}

        </form>

        {/* Drawer Footer */}
        {presentation !== 'page' && <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
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
        </div>}

      </div>
    </div>
  );
};
