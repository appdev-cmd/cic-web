import React, { useState, useEffect } from 'react';
import { Zap, Save, X, RotateCcw, AlertCircle } from 'lucide-react';
import { ProductItem, ProductCategory, ProductBrand, EditorialStatus, CatalogStatus, AvailabilitySignal } from './types';

interface ProductQuickEditModalProps {
  isOpen: boolean;
  product: ProductItem | null;
  categories: ProductCategory[];
  brands: ProductBrand[];
  onSave: (updatedFields: Partial<ProductItem>) => void;
  onClose: () => void;
}

export const ProductQuickEditModal: React.FC<ProductQuickEditModalProps> = ({
  isOpen,
  product,
  categories,
  brands,
  onSave,
  onClose,
}) => {
  if (!isOpen || !product) return null;

  const [title, setTitle] = useState(product.title);
  const [sku, setSku] = useState(product.sku);
  const [categoryId, setCategoryId] = useState(product.category_id);
  const [brandId, setBrandId] = useState(product.brand_id);
  const [price, setPrice] = useState(product.price);
  const [availabilitySignal, setAvailabilitySignal] = useState<AvailabilitySignal>(product.availability_signal || 'in_stock');
  const [editorialStatus, setEditorialStatus] = useState<EditorialStatus>(product.editorial_status);
  const [catalogStatus, setCatalogStatus] = useState<CatalogStatus>(product.catalog_status);
  const [ordering, setOrdering] = useState(product.ordering || 1);
  const [isHot, setIsHot] = useState(product.is_hot || false);

  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setTitle(product.title);
    setSku(product.sku);
    setCategoryId(product.category_id);
    setBrandId(product.brand_id);
    setPrice(product.price);
    setAvailabilitySignal(product.availability_signal || 'in_stock');
    setEditorialStatus(product.editorial_status);
    setCatalogStatus(product.catalog_status);
    setOrdering(product.ordering || 1);
    setIsHot(product.is_hot || false);
    setIsDirty(false);
  }, [product]);

  const handleFieldChange = () => {
    setIsDirty(true);
  };

  const handleReset = () => {
    setTitle(product.title);
    setSku(product.sku);
    setCategoryId(product.category_id);
    setBrandId(product.brand_id);
    setPrice(product.price);
    setAvailabilitySignal(product.availability_signal || 'in_stock');
    setEditorialStatus(product.editorial_status);
    setCatalogStatus(product.catalog_status);
    setOrdering(product.ordering || 1);
    setIsHot(product.is_hot || false);
    setIsDirty(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedBrand = brands.find((b) => b.id === brandId);
    onSave({
      title,
      sku,
      category_id: categoryId,
      brand_id: brandId,
      brand_name: selectedBrand ? selectedBrand.name : product.brand_name,
      price,
      availability_signal: availabilitySignal,
      editorial_status: editorialStatus,
      catalog_status: catalogStatus,
      published: editorialStatus === 'published',
      ordering: Number(ordering),
      is_hot: isHot,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 text-amber-600 rounded-xl">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Sửa nhanh thuộc tính Sản phẩm
                </h3>
                {isDirty && (
                  <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 font-bold text-[10px] rounded-full border border-amber-500/20">
                    Đã thay đổi chưa lưu
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 truncate max-w-xs">{product.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Title */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Tên sản phẩm *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                handleFieldChange();
              }}
              required
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* SKU */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Mã SKU *
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => {
                  setSku(e.target.value);
                  handleFieldChange();
                }}
                required
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 font-mono"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Giá niêm yết / License
              </label>
              <input
                type="text"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  handleFieldChange();
                }}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Category */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Danh mục
              </label>
              <select
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  handleFieldChange();
                }}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Hãng sản xuất
              </label>
              <select
                value={brandId}
                onChange={(e) => {
                  setBrandId(e.target.value);
                  handleFieldChange();
                }}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
              >
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Editorial Status */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Trạng thái Biên tập
              </label>
              <select
                value={editorialStatus}
                onChange={(e) => {
                  setEditorialStatus(e.target.value as EditorialStatus);
                  handleFieldChange();
                }}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer font-bold"
              >
                <option value="draft">Bản nháp</option>
                <option value="published">Xuất bản (Published)</option>
              </select>
            </div>

            {/* Catalog Status */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Trạng thái Kinh doanh
              </label>
              <select
                value={catalogStatus}
                onChange={(e) => {
                  setCatalogStatus(e.target.value as CatalogStatus);
                  handleFieldChange();
                }}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer font-bold"
              >
                <option value="active">Đang kinh doanh</option>
                <option value="inactive">Ngừng kinh doanh</option>
                <option value="archived">Lưu trữ</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 items-center pt-2">
            {/* Ordering */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Thứ tự sắp xếp (Ordering)
              </label>
              <input
                type="number"
                value={ordering}
                onChange={(e) => {
                  setOrdering(Number(e.target.value));
                  handleFieldChange();
                }}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Is Hot Toggle */}
            <div className="pt-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isHot}
                  onChange={(e) => {
                    setIsHot(e.target.checked);
                    handleFieldChange();
                  }}
                  className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500"
                />
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Nổi bật / Hot Product
                </span>
              </label>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              disabled={!isDirty}
              className="px-3 py-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-bold text-xs flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi phục ban đầu</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Cập nhật ngay</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
