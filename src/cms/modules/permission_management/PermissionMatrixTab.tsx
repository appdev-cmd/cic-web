import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  ChevronRight,
  Shield,
  Save,
  CheckCircle2,
  Sliders,
  Check,
  Minus,
  Layers,
  User,
  Filter,
  Eye,
  Plus,
  Edit,
  Trash2,
  Globe,
  Sparkles,
} from 'lucide-react';
import {
  CmsUserPermissionTarget,
  PermissionTask,
  PermissionFunction,
  PermissionField,
  UserPermissionState,
} from './types';

interface PermissionMatrixTabProps {
  users: CmsUserPermissionTarget[];
  tasks: PermissionTask[];
  functions: PermissionFunction[];
  fields: PermissionField[];
  userPermissionsMap: Record<string, UserPermissionState>;
  onSaveUserPermissions: (userId: string, newPermissions: UserPermissionState) => void;
}

export const PermissionMatrixTab: React.FC<PermissionMatrixTabProps> = ({
  users,
  tasks,
  functions,
  fields,
  userPermissionsMap,
  onSaveUserPermissions,
}) => {
  // 1. Active User Selection
  const [selectedUserId, setSelectedUserId] = useState<string>(users[0]?.id || 'usr_001');
  const [userSearchQuery, setUserSearchQuery] = useState('');

  // Local state for permissions of currently selected user (staged changes before Save)
  const currentSavedState = userPermissionsMap[selectedUserId] || {
    userId: selectedUserId,
    grantedTaskIds: [],
    grantedFunctionIds: [],
    grantedFieldIds: [],
  };

  const [stagedPermissions, setStagedPermissions] = useState<UserPermissionState>(currentSavedState);

  // Sync staged state when switching users
  React.useEffect(() => {
    setStagedPermissions(
      userPermissionsMap[selectedUserId] || {
        userId: selectedUserId,
        grantedTaskIds: [],
        grantedFunctionIds: [],
        grantedFieldIds: [],
      }
    );
  }, [selectedUserId, userPermissionsMap]);

  // Search filter for permissions tree
  const [permSearchQuery, setPermSearchQuery] = useState('');
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    PRODUCTS: true,
    USERS: true,
    NEWS: true,
    BANNERS: false,
    SETTINGS: false,
  });

  const selectedUser = users.find((u) => u.id === selectedUserId) || users[0];

  // Filtered users in sidebar
  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  // Group Tasks by Module -> View
  const modulesGrouped = useMemo(() => {
    const modulesMap: Record<string, Record<string, PermissionTask[]>> = {};

    tasks.forEach((t) => {
      if (!modulesMap[t.module]) {
        modulesMap[t.module] = {};
      }
      if (!modulesMap[t.module][t.view]) {
        modulesMap[t.module][t.view] = [];
      }
      modulesMap[t.module][t.view].push(t);
    });

    return modulesMap;
  }, [tasks]);

  const moduleNamesList = Object.keys(modulesGrouped);

  // Quick Matrix Action Types: VIEW, ADD, EDIT, DELETE, PUBLISH
  const matrixActions = ['VIEW', 'ADD', 'EDIT', 'DELETE', 'PUBLISH'];

  // Helper to toggle task and its child functions
  const toggleTask = (taskId: string) => {
    const isGranted = stagedPermissions.grantedTaskIds.includes(taskId);
    const childFunctions = functions.filter((f) => f.taskId === taskId).map((f) => f.id);

    if (isGranted) {
      // Remove task and child functions
      setStagedPermissions((prev) => ({
        ...prev,
        grantedTaskIds: prev.grantedTaskIds.filter((id) => id !== taskId),
        grantedFunctionIds: prev.grantedFunctionIds.filter((id) => !childFunctions.includes(id)),
      }));
    } else {
      // Add task and all child functions
      setStagedPermissions((prev) => ({
        ...prev,
        grantedTaskIds: Array.from(new Set([...prev.grantedTaskIds, taskId])),
        grantedFunctionIds: Array.from(new Set([...prev.grantedFunctionIds, ...childFunctions])),
      }));
    }
  };

  // Helper to toggle function
  const toggleFunction = (functionId: string) => {
    const isGranted = stagedPermissions.grantedFunctionIds.includes(functionId);
    setStagedPermissions((prev) => ({
      ...prev,
      grantedFunctionIds: isGranted
        ? prev.grantedFunctionIds.filter((id) => id !== functionId)
        : [...prev.grantedFunctionIds, functionId],
    }));
  };

  // Helper to toggle field permission
  const toggleField = (fieldId: string) => {
    const isGranted = stagedPermissions.grantedFieldIds.includes(fieldId);
    setStagedPermissions((prev) => ({
      ...prev,
      grantedFieldIds: isGranted
        ? prev.grantedFieldIds.filter((id) => id !== fieldId)
        : [...prev.grantedFieldIds, fieldId],
    }));
  };

  // Helper for Module Level Matrix Toggle
  const toggleModuleActionMatrix = (moduleName: string, actionKey: string) => {
    // Find matching tasks in this module for actionKey
    const moduleTasks = tasks.filter((t) => {
      if (t.module !== moduleName) return false;
      const tLower = t.task.toLowerCase();
      if (actionKey === 'VIEW' && tLower.includes('view')) return true;
      if (actionKey === 'ADD' && (tLower.includes('add') || tLower.includes('create'))) return true;
      if (actionKey === 'EDIT' && (tLower.includes('edit') || tLower.includes('manage') || tLower.includes('update'))) return true;
      if (actionKey === 'DELETE' && tLower.includes('delete')) return true;
      if (actionKey === 'PUBLISH' && (tLower.includes('pub') || tLower.includes('publish'))) return true;
      return false;
    });

    const taskIds = moduleTasks.map((t) => t.id);
    const allSelected = taskIds.length > 0 && taskIds.every((id) => stagedPermissions.grantedTaskIds.includes(id));

    if (allSelected) {
      // Untick all
      setStagedPermissions((prev) => ({
        ...prev,
        grantedTaskIds: prev.grantedTaskIds.filter((id) => !taskIds.includes(id)),
      }));
    } else {
      // Tick all
      setStagedPermissions((prev) => ({
        ...prev,
        grantedTaskIds: Array.from(new Set([...prev.grantedTaskIds, ...taskIds])),
      }));
    }
  };

  const handleSavePermissions = () => {
    onSaveUserPermissions(selectedUserId, stagedPermissions);
  };

  const toggleExpandAll = (expand: boolean) => {
    const next: Record<string, boolean> = {};
    moduleNamesList.forEach((m) => {
      next[m] = expand;
    });
    setExpandedModules(next);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      {/* ================= SIDEBAR TRÁI: DANH SÁCH USER (3 COLS) ================= */}
      <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xs p-4 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-orange-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Tài khoản Quản trị
            </h3>
          </div>
          <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-950/80 text-orange-700 dark:text-orange-300 rounded-full text-[10px] font-bold">
            {users.length}
          </span>
        </div>

        {/* User Search Input */}
        <div className="relative flex items-center">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
            <Search className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm theo tên, username, vai trò..."
            value={userSearchQuery}
            onChange={(e) => setUserSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
          />
        </div>

        {/* User Cards List */}
        <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
          {filteredUsers.map((u) => {
            const isSelected = u.id === selectedUserId;
            return (
              <div
                key={u.id}
                onClick={() => setSelectedUserId(u.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                  isSelected
                    ? 'bg-orange-50/80 dark:bg-orange-950/40 border-orange-500 shadow-xs'
                    : 'bg-slate-50/50 dark:bg-slate-800/20 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <img
                  src={u.avatar}
                  alt={u.fullName}
                  className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {u.fullName}
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono truncate">@{u.username}</p>
                  <span className="inline-block mt-1 px-1.5 py-0.5 bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded text-[9px] font-semibold">
                    {u.role}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= MAIN BÊN PHẢI: PERMISSION MATRIX (9 COLS) ================= */}
      <div className="lg:col-span-9 space-y-5">
        {/* TOP USER HEADER & GLOBAL SAVE BUTTON */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={selectedUser.avatar}
              alt={selectedUser.fullName}
              className="w-11 h-11 rounded-full object-cover border-2 border-orange-500/30"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Phân quyền cho: {selectedUser.fullName}
                </h2>
                <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-950/80 text-orange-700 dark:text-orange-300 rounded text-[10px] font-bold">
                  {selectedUser.role}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                {selectedUser.email} • Phòng ban: {selectedUser.department}
              </p>
            </div>
          </div>

          {/* SINGLE GLOBAL SAVE BUTTON */}
          <button
            onClick={handleSavePermissions}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Lưu cấu hình phân quyền</span>
          </button>
        </div>

        {/* QUICK MATRIX OVERVIEW (MODULE VS ACTION MATRIX) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-orange-600" />
              <span>Ma trận phân quyền tổng quan (Quick Permission Matrix)</span>
            </h3>
            <span className="text-[11px] text-slate-400">Tích chọn nhanh thao tác theo Module</span>
          </div>

          <div className="overflow-x-auto">
            <table className="cms-data-table text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="p-3">Module</th>
                  {matrixActions.map((act) => (
                    <th key={act} className="p-3 text-center w-24">
                      {act}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {moduleNamesList.map((m) => {
                  return (
                    <tr key={m} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                      <td className="p-3 font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-orange-500" />
                        <span>{m}</span>
                      </td>
                      {matrixActions.map((act) => {
                        const moduleTasks = tasks.filter((t) => {
                          if (t.module !== m) return false;
                          const tLower = t.task.toLowerCase();
                          if (act === 'VIEW' && tLower.includes('view')) return true;
                          if (act === 'ADD' && (tLower.includes('add') || tLower.includes('create'))) return true;
                          if (act === 'EDIT' && (tLower.includes('edit') || tLower.includes('manage') || tLower.includes('update'))) return true;
                          if (act === 'DELETE' && tLower.includes('delete')) return true;
                          if (act === 'PUBLISH' && (tLower.includes('pub') || tLower.includes('publish'))) return true;
                          return false;
                        });

                        const taskIds = moduleTasks.map((t) => t.id);
                        const isChecked =
                          taskIds.length > 0 &&
                          taskIds.every((id) => stagedPermissions.grantedTaskIds.includes(id));
                        const isSomeChecked =
                          !isChecked &&
                          taskIds.some((id) => stagedPermissions.grantedTaskIds.includes(id));

                        return (
                          <td key={act} className="p-3 text-center">
                            {moduleTasks.length === 0 ? (
                              <span className="text-slate-300 dark:text-slate-700">—</span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => toggleModuleActionMatrix(m, act)}
                                className={`w-5 h-5 rounded border flex items-center justify-center mx-auto transition-colors cursor-pointer ${
                                  isChecked
                                    ? 'bg-orange-600 border-orange-600 text-white'
                                    : isSomeChecked
                                    ? 'bg-orange-100 dark:bg-orange-950 border-orange-500 text-orange-600'
                                    : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
                                }`}
                              >
                                {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                {isSomeChecked && <Minus className="w-3.5 h-3.5 stroke-[3]" />}
                              </button>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ACCORDION TREE PERMISSION MATRIX DETAIL (MODULE -> VIEW -> TASK -> FUNCTION -> FIELD) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-orange-600" />
                <span>Chi tiết Cây Phân quyền (Module → View → Task → Function → Field)</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Cấu hình trực tiếp quyền thực thi Task, Function nâng cao và Field chỉnh sửa
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleExpandAll(true)}
                className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg text-[11px] font-semibold cursor-pointer"
              >
                Mở rộng tất cả
              </button>
              <button
                type="button"
                onClick={() => toggleExpandAll(false)}
                className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg text-[11px] font-semibold cursor-pointer"
              >
                Thu gọn tất cả
              </button>
            </div>
          </div>

          {/* Search Permission Input */}
          <div className="relative flex items-center">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Lọc tên Task, Function hoặc Field..."
              value={permSearchQuery}
              onChange={(e) => setPermSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
            />
          </div>

          {/* Tree View Accordion */}
          <div className="space-y-3 pt-1">
            {moduleNamesList.map((mName) => {
              const viewsMap = modulesGrouped[mName];
              const isExpanded = expandedModules[mName] ?? true;
              const moduleFields = fields.filter((f) => f.moduleId === mName);

              return (
                <div
                  key={mName}
                  className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/30 dark:bg-slate-800/20"
                >
                  {/* Module Accordion Header */}
                  <div
                    onClick={() =>
                      setExpandedModules((prev) => ({
                        ...prev,
                        [mName]: !prev[mName],
                      }))
                    }
                    className="p-3.5 bg-slate-100/80 dark:bg-slate-800/60 flex items-center justify-between cursor-pointer hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-orange-600" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                      <span className="font-mono font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                        Module: {mName}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-slate-500 font-mono">
                        {Object.keys(viewsMap).length} Views • {moduleFields.length} Editable Fields
                      </span>
                    </div>
                  </div>

                  {/* Module Content Body */}
                  {isExpanded && (
                    <div className="p-4 space-y-4 border-t border-slate-200/80 dark:border-slate-800">
                      {/* Views & Tasks */}
                      {Object.keys(viewsMap).map((vName) => {
                        const viewTasks = viewsMap[vName];
                        return (
                          <div
                            key={vName}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 space-y-3"
                          >
                            <div className="text-[11px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                              <span>View: {vName}</span>
                            </div>

                            {/* Tasks List */}
                            <div className="space-y-2 pl-3 border-l-2 border-slate-200 dark:border-slate-800">
                              {viewTasks.map((task) => {
                                const isTaskGranted = stagedPermissions.grantedTaskIds.includes(
                                  task.id
                                );
                                const taskFunctions = functions.filter(
                                  (f) => f.taskId === task.id
                                );

                                return (
                                  <div
                                    key={task.id}
                                    className="p-2.5 bg-slate-50/80 dark:bg-slate-800/40 rounded-lg space-y-2"
                                  >
                                    {/* Task Checkbox */}
                                    <div className="flex items-center justify-between">
                                      <label className="flex items-center gap-2.5 cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={isTaskGranted}
                                          onChange={() => toggleTask(task.id)}
                                          className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500 cursor-pointer"
                                        />
                                        <div>
                                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                                            {task.task}
                                          </span>
                                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                            {task.description}
                                          </p>
                                        </div>
                                      </label>
                                    </div>

                                    {/* Functions Checkboxes (Con) */}
                                    {taskFunctions.length > 0 && (
                                      <div className="pt-2 pl-6 space-y-1.5 border-t border-slate-200/60 dark:border-slate-700/60">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                          Functions thực thi nâng cao:
                                        </span>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                          {taskFunctions.map((fn) => {
                                            const isFnGranted = stagedPermissions.grantedFunctionIds.includes(
                                              fn.id
                                            );
                                            return (
                                              <label
                                                key={fn.id}
                                                className="flex items-center gap-2 p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs cursor-pointer hover:border-orange-500 transition-colors"
                                              >
                                                <input
                                                  type="checkbox"
                                                  checked={isFnGranted}
                                                  onChange={() => toggleFunction(fn.id)}
                                                  className="w-3.5 h-3.5 text-orange-600 rounded focus:ring-orange-500"
                                                />
                                                <span className="text-slate-700 dark:text-slate-300 font-medium">
                                                  {fn.name}
                                                </span>
                                              </label>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}

                      {/* FIELD PERMISSIONS FOR THIS MODULE (Expanded directly underneath) */}
                      {moduleFields.length > 0 && (
                        <div className="bg-orange-50/40 dark:bg-orange-950/20 border border-orange-200/80 dark:border-orange-900/60 rounded-lg p-3 space-y-2">
                          <span className="text-[11px] font-bold text-orange-800 dark:text-orange-300 uppercase tracking-wider block">
                            Field Permission (Quyền cho phép sửa từng trường thông tin):
                          </span>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {moduleFields.map((fld) => {
                              const isFldGranted = stagedPermissions.grantedFieldIds.includes(
                                fld.id
                              );
                              return (
                                <label
                                  key={fld.id}
                                  className="flex items-center gap-2 p-2 bg-white dark:bg-slate-900 border border-orange-200 dark:border-orange-800/80 rounded-md text-xs cursor-pointer hover:border-orange-500 transition-colors"
                                >
                                  <input
                                    type="checkbox"
                                    checked={isFldGranted}
                                    onChange={() => toggleField(fld.id)}
                                    className="w-3.5 h-3.5 text-orange-600 rounded"
                                  />
                                  <span className="text-slate-800 dark:text-slate-200 font-medium">
                                    {fld.fieldName}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* FOOTER SAVE ACTION */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Đang cấu hình quyền cho tài khoản: <strong className="text-slate-800 dark:text-slate-200">{selectedUser.fullName}</strong>
          </div>
          <button
            onClick={handleSavePermissions}
            className="flex items-center gap-2 px-6 py-2.5 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Lưu cấu hình phân quyền</span>
          </button>
        </div>
      </div>
    </div>
  );
};
