import React, { useState } from 'react';
import { Copy, AlertCircle, Check, X } from 'lucide-react';
import { ProductItem } from './types';

interface ProductDuplicateModalProps {
  isOpen: boolean;
  product: ProductItem | null;
  onConfirmDuplicate: (duplicateOptions: DuplicateConfig) => void;
  onClose: () => void;
}

export interface DuplicateConfig {
  copyGeneral: boolean;
  copyTaxonomy: boolean;
  copyCommercial: boolean;
  copyContent: boolean;
  copySpecs: boolean;
  copyMedia: boolean;
  copyDocuments: boolean;
  copySeo: boolean;
  newSkuSuffix: string;
}

export const ProductDuplicateModal: React.FC<ProductDuplicateModalProps> = ({
  isOpen,
  product,
  onConfirmDuplicate,
  onClose,
}) => {
  if (!isOpen || !product) return null;

  const [copyGeneral, setCopyGeneral] = useState(true);
  const [copyTaxonomy, setCopyTaxonomy] = useState(true);
  const [copyCommercial, setCopyCommercial] = useState(true);
  const [copyContent, setCopyContent] = useState(true);
  const [copySpecs, setCopySpecs] = useState(true);
  const [copyMedia, setCopyMedia] = useState(true);
  const [copyDocuments, setCopyDocuments] = useState(true);
  const [copySeo, setCopySeo] = useState(false);
  const [newSkuSuffix, setNewSkuSuffix] = useState('-COPY');

  const handleDuplicate = () => {
    onConfirmDuplicate({
      copyGeneral,
      copyTaxonomy,
      copyCommercial,
      copyContent,
      copySpecs,
      copyMedia,
      copyDocuments,
      copySeo,
      newSkuSuffix,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-500/10 text-purple-600 rounded-xl">
              <Copy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Nhân bản Sản phẩm (Duplicate Product)
              </h3>
              <p className="text-[11px] text-slate-500">Tạo bản nháp mới từ sản phẩm nguồn</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 space-y-4 text-xs overflow-y-auto max-h-[70vh]">
          {/* Warning Banner */}
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-xl space-y-1 text-amber-900 dark:text-amber-300">
            <p className="font-bold flex items-center gap-1.5 text-xs">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Lưu ý quan trọng khi Nhân bản:</span>
            </p>
            <ul className="text-[11px] list-disc pl-5 space-y-0.5">
              <li>Mã ID, Trạng thái xuất bản và Lịch sử audit log sẽ KHÔNG được sao chép.</li>
              <li>Sản phẩm mới sẽ ở trạng thái <strong>Bản nháp</strong>.</li>
              <li>Bạn bắt buộc phải kiểm tra và đổi lại <strong>Mã SKU</strong> và <strong>Tên sản phẩm</strong> để tránh trùng lặp.</li>
            </ul>
          </div>

          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
              Hậu tố Mã SKU mẫu:
            </label>
            <input
              type="text"
              value={newSkuSuffix}
              onChange={(e) => setNewSkuSuffix(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs focus:outline-none focus:border-orange-500"
              placeholder="VD: -COPY"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              SKU mới sẽ là: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{product.sku}{newSkuSuffix}</span>
            </p>
          </div>

          {/* Options Checklist */}
          <div className="space-y-2 pt-2">
            <label className="block font-bold text-slate-800 dark:text-slate-200">
              Chọn các phần thông tin muốn nhân bản:
            </label>

            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Thông tin chung', state: copyGeneral, set: setCopyGeneral },
                { label: 'Phân loại & Hãng', state: copyTaxonomy, set: setCopyTaxonomy },
                { label: 'Thương mại & Giá', state: copyCommercial, set: setCopyCommercial },
                { label: 'Nội dung chi tiết', state: copyContent, set: setCopyContent },
                { label: 'Thông số kỹ thuật', state: copySpecs, set: setCopySpecs },
                { label: 'Hình ảnh & Media', state: copyMedia, set: setCopyMedia },
                { label: 'Tài liệu đính kèm', state: copyDocuments, set: setCopyDocuments },
                { label: 'Cấu hình SEO (Không khuyến khích)', state: copySeo, set: setCopySeo },
              ].map((opt, i) => (
                <label key={i} className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={opt.state}
                    onChange={(e) => opt.set(e.target.checked)}
                    className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500"
                  />
                  <span className="font-medium text-slate-700 dark:text-slate-300">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
          >
            Hủy
          </button>
          <button
            onClick={handleDuplicate}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Copy className="w-4 h-4" />
            <span>Xác nhận Nhân bản</span>
          </button>
        </div>
      </div>
    </div>
  );
};
