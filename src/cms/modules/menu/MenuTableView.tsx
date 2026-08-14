import React, { useState } from 'react';
import {
  Edit,
  Trash2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { MenuItem } from './types';
import { CmsPagination } from '../../components/ui/CmsPagination';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

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

  const paginatedData = flatData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-4">
      {/* Table Content */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
        <table className="cms-data-table text-left text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="p-3.5">Tên nhãn & Phân cấp</th>
              <th className="p-3.5">Đường dẫn</th>
              <th className="p-3.5">Cửa sổ</th>
              <th className="p-3.5">Trạng thái</th>
              <th className="p-3.5 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {paginatedData.map((item) => {
              return (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                >
                  <td className="p-3.5">
                    <div className="flex items-center gap-2" style={{ paddingLeft: `${item.depth * 16}px` }}>
                      <span className="font-bold text-slate-900 dark:text-white">{item.label}</span>
                      <span className="text-[10px] text-slate-400 font-mono">L{item.depth + 1}</span>
                    </div>
                  </td>
                  <td className="p-3.5 font-mono text-slate-600 dark:text-slate-400">{item.url}</td>
                  <td className="p-3.5">
                    <span className="text-xs text-slate-600 dark:text-slate-300">{item.open_in_new_tab ? 'Cửa sổ mới' : 'Cửa sổ hiện tại'}</span>
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
      <CmsPagination currentPage={currentPage} pageSize={pageSize} totalCount={flatData.length} itemLabel="mục menu" onPageChange={setCurrentPage} onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }} />
    </div>
  );
};
