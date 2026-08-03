import React, { useState } from 'react';
import { Shield, Sliders, CheckCircle2 } from 'lucide-react';
import {
  permissionUsersMock,
  initialPermissionTasksMock,
  permissionFunctionsMock,
  permissionFieldsMock,
  initialUserPermissionsMock,
} from './mockData';
import { PermissionTask, UserPermissionState } from './types';
import { PermissionMatrixTab } from './PermissionMatrixTab';
import { TaskDefinitionTab } from './TaskDefinitionTab';

export const PermissionManagement: React.FC = () => {
  // Tabs State: 'matrix' (Tab B - Main Screen) or 'tasks' (Tab A - Task Definition)
  const [activeTab, setActiveTab] = useState<'matrix' | 'tasks'>('matrix');

  // Core Data States
  const [users] = useState(permissionUsersMock);
  const [tasks, setTasks] = useState<PermissionTask[]>(initialPermissionTasksMock);
  const [functions] = useState(permissionFunctionsMock);
  const [fields] = useState(permissionFieldsMock);

  // User Permissions Map State
  const [userPermissionsMap, setUserPermissionsMap] = useState<
    Record<string, UserPermissionState>
  >(initialUserPermissionsMock);

  // Toast notification state
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Save Task Definition Handler
  const handleSaveTask = (savedTask: PermissionTask) => {
    setTasks((prev) => {
      const exists = prev.some((t) => t.id === savedTask.id);
      if (exists) {
        return prev.map((t) => (t.id === savedTask.id ? savedTask : t));
      }
      return [savedTask, ...prev];
    });
    showToast(`Đã lưu Task Definition "${savedTask.task}"`);
  };

  // Delete Task Definition Handler
  const handleDeleteTask = (taskId: string) => {
    const taskToDelete = tasks.find((t) => t.id === taskId);
    if (confirm(`Bạn có chắc muốn xóa Task "${taskToDelete?.task || taskId}"?`)) {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      showToast('Đã xóa Task Definition thành công');
    }
  };

  // Save User Permissions Handler
  const handleSaveUserPermissions = (userId: string, newPerms: UserPermissionState) => {
    setUserPermissionsMap((prev) => ({
      ...prev,
      [userId]: newPerms,
    }));
    const userObj = users.find((u) => u.id === userId);
    showToast(`Đã lưu cấu hình phân quyền cho tài khoản "${userObj?.fullName || userId}"!`);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* TOP HEADER & TAB NAVIGATION BAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
                <Shield className="w-5 h-5" />
              </span>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                Trung tâm Phân quyền Hệ thống
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Cấu hình phân quyền chi tiết theo Task, Function và Field cho từng tài khoản quản trị
            </p>
          </div>

          {/* TAB BUTTONS */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'matrix'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Permission Matrix (Chính)</span>
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'tasks'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Task Definition</span>
            </button>
          </div>
        </div>
      </div>

      {/* RENDER ACTIVE TAB */}
      {activeTab === 'matrix' ? (
        <PermissionMatrixTab
          users={users}
          tasks={tasks}
          functions={functions}
          fields={fields}
          userPermissionsMap={userPermissionsMap}
          onSaveUserPermissions={handleSaveUserPermissions}
        />
      ) : (
        <TaskDefinitionTab
          tasks={tasks}
          onSaveTask={handleSaveTask}
          onDeleteTask={handleDeleteTask}
        />
      )}
    </div>
  );
};
