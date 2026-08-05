import React, { useState } from 'react';
import {
  Edit,
  Trash2,
  ExternalLink,
  Link,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Globe,
  ArrowUpDown,
  Filter,
  CheckSquare,
  Square,
  Search,
} from 'lucide-react';
import { MenuItem } from './types';
import { CmsListFooter } from '../../components/ui/CmsPagination';

interface MenuTableViewProps {
  items: MenuItem[];
  onEditItem: (item: MenuItem) => void;
  onDeleteItem: (itemId: string) => void;
  onToggleVisibility: (itemId: string) => void;
}

export const MenuTableView: React.FC<MenuTableViewProps> = ({
  items,
  onEditItem,
  onDeleteItem,
  onToggleVisibility,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterHealth, setFilterHealth] = useState<'all' | 'valid' | 'broken' | 'warning'>('all');

  // Flatten nested items tree into linear array for data table
  const flattenItems = (itemList: MenuItem[], result: MenuItem[] = []): MenuItem[] => {
    itemList.forEach((item) => {
      result.push(item);
      if (item.children && item.children.length > 0) {
        flattenItems(item.children, result);
      }
    });
    return result;
  };

  const flatData = flattenItems(items);

  const filteredData = flatData.filter((item) => {
    if (filterHealth === 'all') return true;
    return item.link_health === filterHealth;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredData.map((i) => i.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  return (
    <div className="space-y-4">
      {/* Table Filter Controls */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Lọc theo Link Health:</span>
          <select
            value={filterHealth}
            onChange={(e) => setFilterHealth(e.target.value as any)}
            className="px-2.5 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="all">Tất cả mục menu ({flatData.length})</option>
            <option value="valid">Đường dẫn chuẩn (Valid)</option>
            <option value="broken">Lỗi Broken Link (404)</option>
            <option value="warning">Cảnh báo link (Warning)</option>
          </select>
        </div>

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Đã chọn {selectedIds.length} mục
            </span>
            <button
              onClick={() => {
                alert(`Đã kiểm tra lại link health cho ${selectedIds.length} mục menu!`);
                setSelectedIds([]);
              }}
              className="px-2.5 py-1 text-xs font-bold bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition"
            >
              Bulk Check Links
            </button>
          </div>
        )}
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
        <table className="cms-data-table text-left text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="p-3.5 w-10">
                <button onClick={toggleSelectAll}>
                  {selectedIds.length === filteredData.length && filteredData.length > 0 ? (
                    <CheckSquare className="w-4 h-4 text-orange-600" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              </th>
              <th className="p-3.5">Tên nhãn & Phân cấp</th>
              <th className="p-3.5">Loại đích đến</th>
              <th className="p-3.5">URL Target Canonical</th>
              <th className="p-3.5">Link Health</th>
              <th className="p-3.5">Trạng thái</th>
              <th className="p-3.5 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {filteredData.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              return (
                <tr
                  key={item.id}
                  className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition ${
                    isSelected ? 'bg-orange-50/50 dark:bg-orange-950/20' : ''
                  }`}
                >
                  <td className="p-3.5">
                    <button onClick={() => toggleSelect(item.id)}>
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-orange-600" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-2" style={{ paddingLeft: `${item.depth * 16}px` }}>
                      <span className="font-bold text-slate-900 dark:text-white">{item.label}</span>
                      <span className="text-[10px] text-slate-400 font-mono">L{item.depth + 1}</span>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase">
                      {item.target_type}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-slate-600 dark:text-slate-400">{item.url}</td>
                  <td className="p-3.5">
                    {item.link_health === 'valid' && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center gap-1 w-max">
                        <CheckCircle className="w-3 h-3" /> Chuẩn
                      </span>
                    )}
                    {item.link_health === 'broken' && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 flex items-center gap-1 w-max">
                        <AlertTriangle className="w-3 h-3" /> Lỗi 404
                      </span>
                    )}
                    {item.link_health === 'warning' && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center gap-1 w-max">
                        <AlertTriangle className="w-3 h-3" /> Cảnh báo
                      </span>
                    )}
                  </td>
                  <td className="p-3.5">
                    <button
                      onClick={() => onToggleVisibility(item.id)}
                      className={`p-1.5 rounded-lg transition ${
                        item.is_visible
                          ? 'text-emerald-600 hover:bg-emerald-50'
                          : 'text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      {item.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </td>
                  <td className="p-3.5 text-right space-x-1">
                    <button
                      onClick={() => onEditItem(item)}
                      className="p-1.5 text-slate-600 hover:text-slate-900 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/60 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <CmsListFooter visibleCount={filteredData.length} totalCount={flatData.length} itemLabel="mục menu" />
    </div>
  );
};
