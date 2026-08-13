import React, { useState } from 'react';
import {
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Edit,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
  Sliders,
} from 'lucide-react';
import { PermissionTask } from './types';

interface TaskDefinitionTabProps {
  tasks: PermissionTask[];
  onSaveTask: (task: PermissionTask) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TaskDefinitionTab: React.FC<TaskDefinitionTabProps> = ({
  tasks,
  onSaveTask,
  onDeleteTask,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<PermissionTask | null>(null);

  // Form states
  const [moduleVal, setModuleVal] = useState('PRODUCTS');
  const [viewVal, setViewVal] = useState('List');
  const [taskVal, setTaskVal] = useState('');
  const [descVal, setDescVal] = useState('');
  const [publishedVal, setPublishedVal] = useState(true);
  const [orderingVal, setOrderingVal] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');

  const modulesList = Array.from(new Set(tasks.map((t) => t.module)));

  const filteredTasks = tasks.filter((t) => {
    const matchSearch =
      !searchQuery.trim() ||
      t.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.module.toLowerCase().includes(searchQuery.toLowerCase());
    const matchModule = moduleFilter === 'ALL' || t.module === moduleFilter;
    return matchSearch && matchModule;
  });

  const handleOpenModal = (t: PermissionTask | null) => {
    setTaskToEdit(t);
    if (t) {
      setModuleVal(t.module);
      setViewVal(t.view);
      setTaskVal(t.task);
      setDescVal(t.description);
      setPublishedVal(t.published);
      setOrderingVal(t.ordering);
    } else {
      setModuleVal('PRODUCTS');
      setViewVal('List');
      setTaskVal('');
      setDescVal('');
      setPublishedVal(true);
      setOrderingVal(tasks.length + 1);
    }
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskVal.trim()) {
      setErrorMsg('Tên Task không được để trống');
      return;
    }

    const payload: PermissionTask = {
      id: taskToEdit ? taskToEdit.id : `tsk_${Date.now()}`,
      module: moduleVal.toUpperCase().trim(),
      view: viewVal.trim() || 'List',
      task: taskVal.trim(),
      description: descVal.trim(),
      published: publishedVal,
      ordering: Number(orderingVal) || 0,
    };

    onSaveTask(payload);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Tìm kiếm Task definition, Mô tả, Module..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
            />
          </div>
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="ALL">Tất cả Modules</option>
            {modulesList.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => handleOpenModal(null)}
          className="flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Task Definition</span>
        </button>
      </div>

      {/* Task Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="cms-data-table text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="p-3 w-28">Module</th>
                <th className="p-3 w-24">View</th>
                <th className="p-3">Task Name</th>
                <th className="p-3">Description</th>
                <th className="p-3 text-center w-24">Published</th>
                <th className="p-3 text-center w-20">Ordering</th>
                <th className="p-3 text-right pr-4">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Không có Task định nghĩa nào.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-[10px] font-mono font-bold">
                        {t.module}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                      {t.view}
                    </td>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">
                      {t.task}
                    </td>
                    <td className="p-3 text-slate-500 dark:text-slate-400">
                      {t.description || '—'}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`inline-block w-2.5 h-2.5 rounded-full ${
                          t.published ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}
                        title={t.published ? 'Kích hoạt' : 'Ẩn'}
                      />
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                      {t.ordering}
                    </td>
                    <td className="p-3 text-right pr-4 whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenModal(t)}
                          className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteTask(t.id)}
                          className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL Task Create / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in duration-150">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {taskToEdit ? 'Chỉnh sửa Task Definition' : 'Thêm mới Task Definition'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-5 space-y-4 text-xs">
              {errorMsg && (
                <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 text-red-600 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Module
                  </label>
                  <input
                    type="text"
                    value={moduleVal}
                    onChange={(e) => setModuleVal(e.target.value)}
                    placeholder="vd: PRODUCTS, USERS..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs uppercase font-mono font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    View
                  </label>
                  <input
                    type="text"
                    value={viewVal}
                    onChange={(e) => setViewVal(e.target.value)}
                    placeholder="vd: List, Detail..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Task Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={taskVal}
                  onChange={(e) => setTaskVal(e.target.value)}
                  placeholder="vd: View Products List"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description (Mô tả)
                </label>
                <textarea
                  rows={2}
                  value={descVal}
                  onChange={(e) => setDescVal(e.target.value)}
                  placeholder="Mô tả chức năng của task này..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="publishedTaskCheck"
                    checked={publishedVal}
                    onChange={(e) => setPublishedVal(e.target.checked)}
                    className="w-4 h-4 text-orange-600 rounded"
                  />
                  <label htmlFor="publishedTaskCheck" className="font-bold text-slate-700 dark:text-slate-300">
                    Kích hoạt (Published)
                  </label>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Ordering
                  </label>
                  <input
                    type="number"
                    value={orderingVal}
                    onChange={(e) => setOrderingVal(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-bold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold cursor-pointer"
                >
                  Lưu Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
