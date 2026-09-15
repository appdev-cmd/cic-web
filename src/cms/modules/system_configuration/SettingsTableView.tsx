import React, { useState } from 'react';
import {
  Search,
  ArrowUpRight,
  Globe,
  Sliders,
  CheckCircle2,
  Image as ImageIcon,
  Eye,
} from 'lucide-react';
import type { CmsSettingsData, CmsSettingsScopeId } from '@/features/system-settings/domain/model';
import { CmsPagination } from '../../components/ui/CmsPagination';

const GROUP_LABELS: Record<string, string> = {
  branding: 'Thương hiệu',
  seo: 'SEO mặc định',
  company: 'Doanh nghiệp & liên hệ',
  footer_social: 'Footer & mạng xã hội',
  measurement: 'Đo lường & tiếp thị',
};

interface SettingsTableViewProps {
  websiteData: CmsSettingsData;
  valuesByScope: Record<string, Record<string, string>>;
  onLocateInEditor: (scopeId: CmsSettingsScopeId, groupId: string, settingKey: string) => void;
}

export const SettingsTableView: React.FC<SettingsTableViewProps> = ({
  websiteData,
  valuesByScope,
  onLocateInEditor,
}) => {
  const [selectedScopeId, setSelectedScopeId] = useState<CmsSettingsScopeId>(
    websiteData.workspaces[0]?.scope.id ?? 'site_cic'
  );
  const [selectedGroupId, setSelectedGroupId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const activeWorkspace = websiteData.workspaces.find((w) => w.scope.id === selectedScopeId) || websiteData.workspaces[0];
  const currentValues = valuesByScope[selectedScopeId] || {};

  const items = activeWorkspace ? activeWorkspace.settings : [];

  const filteredItems = items.filter((item) => {
    if (selectedGroupId !== 'all' && item.group !== selectedGroupId) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        item.label.toLowerCase().includes(q) ||
        item.key.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const paginatedItems = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* FILTER BAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          {/* SEARCH */}
          <div className="relative flex items-center flex-1 w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="w-4 h-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm theo Tên cài đặt, Khóa (Key) hoặc Mô tả..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* SCOPE SELECTOR */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-bold text-slate-500">Phạm vi:</span>
            <select
              value={selectedScopeId}
              onChange={(e) => {
                setSelectedScopeId(e.target.value as CmsSettingsScopeId);
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              {websiteData.workspaces.map((ws) => (
                <option key={ws.scope.id} value={ws.scope.id}>
                  {ws.scope.name} ({ws.scope.domain})
                </option>
              ))}
            </select>
          </div>

          {/* GROUP SELECTOR */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-bold text-slate-500">Nhóm:</span>
            <select
              value={selectedGroupId}
              onChange={(e) => {
                setSelectedGroupId(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="all">Tất cả Nhóm Cấu hình</option>
              {Object.entries(GROUP_LABELS).map(([gid, title]) => (
                <option key={gid} value={gid}>
                  {title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="cms-data-table text-left w-full text-xs">
            <thead>
              <tr className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-800">
                <th className="py-3 px-4">Tên Cấu hình & Khóa Key</th>
                <th className="py-3 px-4">Nhóm</th>
                <th className="py-3 px-4">Kiểu dữ liệu</th>
                <th className="py-3 px-4">Website Public</th>
                <th className="py-3 px-4">Giá trị Hiện hành</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {paginatedItems.map((item) => {
                const currentValue = currentValues[item.key] ?? item.value;
                const isModified = currentValues[item.key] !== undefined && currentValues[item.key] !== item.value;

                return (
                  <tr key={item.key} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        {item.type === 'image' && <ImageIcon className="w-3.5 h-3.5 text-orange-500" />}
                        <span>{item.label}</span>
                        {isModified && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-500/10 text-amber-600 font-bold border border-amber-500/20">
                            Chưa lưu
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-[10px] text-slate-400 mt-0.5">{item.key}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{item.description}</div>
                    </td>

                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">
                      <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold">
                        {GROUP_LABELS[item.group] || item.group}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                      {item.type}
                    </td>

                    <td className="py-3 px-4">
                      {item.publicReadable ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          <Eye className="w-3.5 h-3.5" /> Có
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Chỉ CMS</span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono break-all max-w-xs text-slate-700 dark:text-slate-200">
                      {item.type === 'image' && currentValue ? (
                        <div className="flex items-center gap-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={currentValue} alt="" className="h-8 max-w-16 rounded object-contain border border-slate-200 dark:border-slate-700 p-0.5" />
                          <span className="truncate max-w-[140px] text-[10px]">{currentValue}</span>
                        </div>
                      ) : (
                        <span>{currentValue || <span className="text-slate-400 italic">(Trống)</span>}</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => onLocateInEditor(selectedScopeId, item.group, item.key)}
                        className="px-3 py-1.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 font-bold rounded-xl border border-orange-500/20 flex items-center gap-1.5 ml-auto cursor-pointer transition-all shrink-0"
                      >
                        <span>Sửa</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {paginatedItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Không tìm thấy cấu hình nào khớp với bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <CmsPagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalCount={filteredItems.length}
          itemLabel="cài đặt"
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      </div>
    </div>
  );
};

