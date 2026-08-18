import React, { useState, useEffect } from 'react';
import { Zap, Save, X, RotateCcw, Sparkles } from 'lucide-react';
import { ProductItem, ProductCategory, ProductBrand, EditorialStatus } from './types';
import type { MasterApplicationItem, MasterProductTypeItem } from '../product_settings/types';
import { SearchableSelect, SearchableMultiSelect } from '../../components/SearchableSelect';

interface ProductQuickEditModalProps {
  isOpen: boolean;
  product: ProductItem | null;
  categories: ProductCategory[];
  brands: ProductBrand[];
  applications: MasterApplicationItem[];
  productTypes: MasterProductTypeItem[];
  onSave: (updatedFields: Partial<ProductItem>) => void;
  onClose: () => void;
}

const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

const inputClass =
  'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white';
const labelClass = 'mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300';

export const ProductQuickEditModal: React.FC<ProductQuickEditModalProps> = ({
  isOpen,
  product,
  categories,
  brands,
  applications: applicationOptions,
  productTypes,
  onSave,
  onClose,
}) => {
  if (!isOpen || !product) return null;

  const [name, setName] = useState(product.name || product.title || '');
  const [alias, setAlias] = useState(product.alias || '');
  const [manualAlias, setManualAlias] = useState(false);
  const [code, setCode] = useState(product.code || product.sku || '');
  const [otherLanguages1, setOtherLanguages1] = useState(product.other_languages1 || '');
  const [manufactory, setManufactory] = useState(product.manufactory || product.brand_id || '');
  const [types, setTypes] = useState(product.types || product.product_type || '');
  const [categoryIds, setCategoryIds] = useState<string[]>(
    product.category_ids || (product.category_id ? [product.category_id] : [])
  );
  const [applications, setApplications] = useState<string[]>(
    product.application || product.application_areas || []
  );
  const [priceOld, setPriceOld] = useState(product.price_old || product.price || '');
  const [isHot, setIsHot] = useState(product.is_hot ?? false);
  const [teamview, setTeamview] = useState(product.teamview ?? false);
  const [ordering, setOrdering] = useState(product.ordering || 1);
  const [landingPage, setLandingPage] = useState(product.landing_page || '');
  const [summary, setSummary] = useState(product.summary || product.short_description || '');
  const [editorialStatus, setEditorialStatus] = useState<EditorialStatus>(
    product.editorial_status === 'published' ? 'published' : 'draft'
  );

  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setName(product.name || product.title || '');
    setAlias(product.alias || '');
    setManualAlias(false);
    setCode(product.code || product.sku || '');
    setOtherLanguages1(product.other_languages1 || '');
    setManufactory(product.manufactory || product.brand_id || '');
    setTypes(product.types || product.product_type || '');
    setCategoryIds(product.category_ids || (product.category_id ? [product.category_id] : []));
    setApplications(product.application || product.application_areas || []);
    setPriceOld(product.price_old || product.price || '');
    setIsHot(product.is_hot ?? false);
    setTeamview(product.teamview ?? false);
    setOrdering(product.ordering || 1);
    setLandingPage(product.landing_page || '');
    setSummary(product.summary || product.short_description || '');
    setEditorialStatus(product.editorial_status === 'published' ? 'published' : 'draft');
    setIsDirty(false);
  }, [product]);

  useEffect(() => {
    if (!manualAlias && name) {
      setAlias(slugify(name));
    }
  }, [name, manualAlias]);

  const handleFieldChange = () => {
    setIsDirty(true);
  };

  const handleReset = () => {
    setName(product.name || product.title || '');
    setAlias(product.alias || '');
    setManualAlias(false);
    setCode(product.code || product.sku || '');
    setOtherLanguages1(product.other_languages1 || '');
    setManufactory(product.manufactory || product.brand_id || '');
    setTypes(product.types || product.product_type || '');
    setCategoryIds(product.category_ids || (product.category_id ? [product.category_id] : []));
    setApplications(product.application || product.application_areas || []);
    setPriceOld(product.price_old || product.price || '');
    setIsHot(product.is_hot ?? false);
    setTeamview(product.teamview ?? false);
    setOrdering(product.ordering || 1);
    setLandingPage(product.landing_page || '');
    setSummary(product.summary || product.short_description || '');
    setEditorialStatus(product.editorial_status === 'published' ? 'published' : 'draft');
    setIsDirty(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || categoryIds.length === 0) {
      alert('Vui lòng nhập tên sản phẩm và chọn ít nhất một lĩnh vực.');
      return;
    }

    const selectedBrand = brands.find((b) => b.id === manufactory);

    onSave({
      name,
      title: name,
      alias: alias || slugify(name),
      code,
      sku: code || product.sku,
      other_languages1: otherLanguages1,
      manufactory,
      brand_id: manufactory,
      brand_name: selectedBrand ? selectedBrand.name : product.brand_name,
      types,
      product_type: types,
      category_ids: categoryIds,
      category_id: categoryIds[0] || '',
      application: applications,
      application_areas: applications,
      price_old: priceOld,
      price: priceOld,
      ordering: Number(ordering) || 1,
      landing_page: landingPage,
      is_hot: isHot,
      teamview,
      editorial_status: editorialStatus,
      published: editorialStatus === 'published',
      summary,
      short_description: summary,
      updated_time: new Date().toISOString().replace('T', ' ').substring(0, 19),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Sửa nhanh sản phẩm
                </h3>
                {isDirty && (
                  <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-[10px] rounded-full border border-amber-500/20">
                    Đã thay đổi
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-md">
                Cập nhật nhanh các trường thông tin theo biểu mẫu sản phẩm CMS
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Tên sản phẩm */}
          <div>
            <label className={labelClass}>Tên sản phẩm *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                handleFieldChange();
              }}
              required
              placeholder="Nhập tên sản phẩm..."
              className={inputClass}
            />
          </div>

          {/* Alias & Biệt danh */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Alias</label>
              <input
                type="text"
                value={alias}
                onChange={(e) => {
                  setManualAlias(true);
                  setAlias(e.target.value);
                  handleFieldChange();
                }}
                placeholder="alias-san-pham"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Biệt danh (Mã sản phẩm)</label>
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  handleFieldChange();
                }}
                placeholder="VD: SP-ETABS-2026..."
                className={`${inputClass} font-mono`}
              />
            </div>
          </div>

          {/* Hãng sản xuất & Loại sản phẩm */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Hãng sản xuất</label>
              <SearchableSelect
                options={brands.map((b) => ({ id: b.id, label: b.name }))}
                selectedId={manufactory}
                onChange={(val) => {
                  setManufactory(val);
                  handleFieldChange();
                }}
                placeholder="Chọn hãng sản xuất..."
              />
            </div>
            <div>
              <label className={labelClass}>Loại sản phẩm</label>
              <SearchableSelect
                options={productTypes
                  .filter((item) => item.status === 'active')
                  .map((item) => ({ id: item.id, label: item.name }))}
                selectedId={types}
                onChange={(val) => {
                  setTypes(val);
                  handleFieldChange();
                }}
                placeholder="Chọn loại sản phẩm..."
              />
            </div>
          </div>

          {/* Lĩnh vực (Category) */}
          <div>
            <label className={labelClass}>Lĩnh vực *</label>
            <SearchableMultiSelect
              options={categories.map((c) => ({ id: c.id, label: c.name }))}
              selectedIds={categoryIds}
              onChange={(vals) => {
                setCategoryIds(vals);
                handleFieldChange();
              }}
              placeholder="Chọn lĩnh vực chuyên ngành..."
            />
          </div>

          {/* Ứng dụng */}
          <div>
            <label className={labelClass}>Ứng dụng</label>
            <SearchableMultiSelect
              options={applicationOptions
                .filter((item) => item.status === 'active')
                .map((item) => ({ id: item.id, label: item.name }))}
              selectedIds={applications}
              onChange={(vals) => {
                setApplications(vals);
                handleFieldChange();
              }}
              placeholder="Chọn lĩnh vực ứng dụng..."
            />
          </div>

          {/* Giá & Landing page & URL ngôn ngữ khác */}
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className={labelClass}>Giá</label>
              <input
                type="text"
                value={priceOld}
                onChange={(e) => {
                  setPriceOld(e.target.value);
                  handleFieldChange();
                }}
                placeholder="VD: Báo giá / 15.000.000 VNĐ..."
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Thứ tự</label>
              <input
                type="number"
                min={1}
                value={ordering}
                onChange={(e) => {
                  setOrdering(Number(e.target.value));
                  handleFieldChange();
                }}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Trạng thái</label>
              <select
                value={editorialStatus}
                onChange={(e) => {
                  setEditorialStatus(e.target.value as EditorialStatus);
                  handleFieldChange();
                }}
                className={`${inputClass} cursor-pointer font-bold`}
              >
                <option value="draft">Bản nháp</option>
                <option value="published">Đã xuất bản</option>
              </select>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Landing page</label>
              <input
                type="text"
                value={landingPage}
                onChange={(e) => {
                  setLandingPage(e.target.value);
                  handleFieldChange();
                }}
                placeholder="https://..."
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>URL ngôn ngữ khác</label>
              <input
                type="text"
                value={otherLanguages1}
                onChange={(e) => {
                  setOtherLanguages1(e.target.value);
                  handleFieldChange();
                }}
                placeholder="https://..."
                className={inputClass}
              />
            </div>
          </div>

          {/* Tóm tắt */}
          <div>
            <label className={labelClass}>Tóm tắt</label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => {
                setSummary(e.target.value);
                handleFieldChange();
              }}
              placeholder="Tóm tắt ngắn gọn về sản phẩm..."
              className={inputClass}
            />
          </div>

          {/* Checkboxes: Sản phẩm tiêu biểu & Link TeamViewer */}
          <div className="flex flex-wrap items-center gap-6 pt-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 p-3 border border-slate-200/80 dark:border-slate-800">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={isHot}
                onChange={(e) => {
                  setIsHot(e.target.checked);
                  handleFieldChange();
                }}
                className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500"
              />
              <span>Sản phẩm tiêu biểu</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={teamview}
                onChange={(e) => {
                  setTeamview(e.target.checked);
                  handleFieldChange();
                }}
                className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500"
              />
              <span>Link TeamViewer</span>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              disabled={!isDirty}
              className="px-3 py-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-bold text-xs flex items-center gap-1.5 disabled:opacity-40 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi phục</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Lưu thay đổi</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
