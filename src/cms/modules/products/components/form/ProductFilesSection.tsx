import React from 'react';
import { FileDown, Link2, ShieldCheck } from 'lucide-react';
import { ProductFileInput } from '../../ProductFileInput';
import type { LegacyDownload } from './productFormUtils';
import { inputClass, labelClass } from './productFormUtils';

export interface ProductFilesSectionProps {
  fileCatalogue: string;
  setFileCatalogue: (val: string) => void;
  filePrice: string;
  setFilePrice: (val: string) => void;
  linkCatalogue: string;
  setLinkCatalogue: (val: string) => void;
  fileDriverName: string;
  setFileDriverName: (val: string) => void;
  fileDriver: string;
  setFileDriver: (val: string) => void;
  linkDriver: string;
  setLinkDriver: (val: string) => void;
  downloads: LegacyDownload[];
  updateDownload: (index: number, key: keyof LegacyDownload, val: string) => void;
}

export const ProductFilesSection: React.FC<ProductFilesSectionProps> = ({
  fileCatalogue,
  setFileCatalogue,
  filePrice,
  setFilePrice,
  linkCatalogue,
  setLinkCatalogue,
  fileDriverName,
  setFileDriverName,
  fileDriver,
  setFileDriver,
  linkDriver,
  setLinkDriver,
  downloads,
  updateDownload,
}) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-black dark:text-white">
          <Link2 className="h-5 w-5 text-orange-600" />
          Tệp sản phẩm & Tài liệu đính kèm
        </div>
        <span className="text-[11px] text-slate-400">Catalogue, Driver & Bộ cài đặt</span>
      </div>

      <div className="space-y-6">
        {/* Khối 1: File báo giá & Catalogue chính */}
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
          <div className="mb-3 flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
            <FileDown className="h-4 w-4 text-orange-600" />
            File Báo giá & Catalogue chính
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <label className={labelClass}>Tên file báo giá / catalogue</label>
              <input
                className={inputClass}
                value={fileCatalogue}
                onChange={(e) => setFileCatalogue(e.target.value)}
                placeholder="VD: Báo giá phần mềm CIC, Catalogue..."
              />
            </div>
            <div>
              <ProductFileInput
                label="File báo giá đính kèm"
                value={filePrice}
                onChange={setFilePrice}
                onAutoFillName={(autoName: string) => {
                  if (!fileCatalogue) setFileCatalogue(autoName);
                }}
                placeholder="Chọn tệp catalogue từ máy..."
              />
            </div>
            <div>
              <label className={labelClass}>Link tải catalogue trực tuyến</label>
              <input
                className={inputClass}
                value={linkCatalogue}
                onChange={(e) => setLinkCatalogue(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        {/* Khối 2: File Driver & Khóa cứng (Dongle) */}
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
          <div className="mb-3 flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            File Driver & Khóa cứng (Dongle)
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <label className={labelClass}>Tên file khóa cứng / driver</label>
              <input
                className={inputClass}
                value={fileDriverName}
                onChange={(e) => setFileDriverName(e.target.value)}
                placeholder="VD: Khóa cứng Rockey, Driver..."
              />
            </div>
            <div>
              <ProductFileInput
                label="File driver đính kèm"
                value={fileDriver}
                onChange={setFileDriver}
                onAutoFillName={(autoName: string) => {
                  if (!fileDriverName) setFileDriverName(autoName);
                }}
                placeholder="Chọn tệp driver/bộ cài..."
              />
            </div>
            <div>
              <label className={labelClass}>Link tải driver trực tuyến</label>
              <input
                className={inputClass}
                value={linkDriver}
                onChange={(e) => setLinkDriver(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        {/* Khối 3: Danh sách tệp tải về & Catalogue bổ sung (Tối đa 6 tệp) */}
        <div>
          <div className="mb-3 text-xs font-bold text-slate-700 dark:text-slate-300">
            Danh sách tệp tải về & Catalogue bổ sung (Tối đa 6 tệp)
          </div>
          <div className="space-y-3">
            {downloads.map((item, index) => (
              <div
                key={index}
                className="grid gap-3 rounded-xl border border-slate-200 p-3.5 md:grid-cols-3 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-2xs"
              >
                <div>
                  <label className={labelClass}>Ghi chú / Tên tệp {index + 1}</label>
                  <input
                    className={inputClass}
                    value={item.name}
                    onChange={(e) => updateDownload(index, 'name', e.target.value)}
                    placeholder={`Tên tài liệu / phần mềm ${index + 1}...`}
                  />
                </div>
                <div>
                  <ProductFileInput
                    label={`Chọn tệp đính kèm ${index + 1}`}
                    value={item.file}
                    onChange={(val: string) => updateDownload(index, 'file', val)}
                    onAutoFillName={(autoName: string) => {
                      if (!item.name) updateDownload(index, 'name', autoName);
                    }}
                    placeholder={`Chọn tệp ${index + 1} từ máy...`}
                  />
                </div>
                <div>
                  <label className={labelClass}>Link tải trực tuyến {index + 1}</label>
                  <input
                    className={inputClass}
                    value={item.link}
                    onChange={(e) => updateDownload(index, 'link', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
