import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Building2,
  Calendar,
  Check,
  Cpu,
  FileCheck2,
  FileText,
  Image as ImageIcon,
  FolderTree,
  History,
  Layers,
  LayoutDashboard,
  MailCheck,
  Menu,
  Minus,
  MousePointer2,
  Newspaper,
  Package,
  RotateCcw,
  Search,
  Settings,
  Shield,
  ShieldAlert,
  Sparkles,
  UserCheck,
  X,
  MessageSquareText,
} from 'lucide-react';
import type { CmsRole, MatrixAction, ModulePermissionMatrix, PermissionTask } from './types';
import { CmsButton } from '../../components/ui/CmsButton';
import { cmsMenuGroups } from '../../config/navigation';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaveRole: (role: CmsRole) => void | Promise<void>;
  roleToEdit: CmsRole | null;
  existingRoles: CmsRole[];
  permissionTasks: PermissionTask[];
  isSaving?: boolean;
}

const matrixActions: { code: MatrixAction; label: string }[] = [
  { code: 'view', label: 'Xem' },
  { code: 'create', label: 'Tạo' },
  { code: 'edit', label: 'Sửa' },
  { code: 'publish', label: 'Xuất bản' },
  { code: 'delete', label: 'Xóa' },
  { code: 'export', label: 'Xuất file' },
  { code: 'configure', label: 'Cấu hình' },
];

const renderMenuIcon = (iconName: string, className = 'size-4 text-orange-600 dark:text-orange-400') => {
  switch (iconName) {
    case 'LayoutDashboard': return <LayoutDashboard className={className} />;
    case 'Newspaper': return <Newspaper className={className} />;
    case 'FolderTree': return <FolderTree className={className} />;
    case 'FileText': return <FileText className={className} />;
    case 'CalendarEvent':
    case 'Calendar': return <Calendar className={className} />;
    case 'Building2': return <Building2 className={className} />;
    case 'Layers': return <Layers className={className} />;
    case 'Package': return <Package className={className} />;
    case 'Cpu': return <Cpu className={className} />;
    case 'UserCheck': return <UserCheck className={className} />;
    case 'Menu': return <Menu className={className} />;
    case 'FolderImage':
    case 'Image': return <ImageIcon className={className} />;
    case 'MousePointer2': return <MousePointer2 className={className} />;
    case 'FileCheck2': return <FileCheck2 className={className} />;
    case 'MessageSquareText': return <MessageSquareText className={className} />;
    case 'MailCheck': return <MailCheck className={className} />;
    case 'ShieldAlert': return <ShieldAlert className={className} />;
    case 'Settings': return <Settings className={className} />;
    case 'Search': return <Search className={className} />;
    case 'Sparkles': return <Sparkles className={className} />;
    case 'History': return <History className={className} />;
    case 'RotateCcw': return <RotateCcw className={className} />;
    default: return <Menu className={className} />;
  }
};

interface MenuGroupWithTasks {
  id: string;
  groupTitle: string;
  items: {
    menuTitle: string;
    iconName: string;
    task: PermissionTask;
    allowedActions: Set<MatrixAction>;
  }[];
}

export const RoleEditorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSaveRole,
  roleToEdit,
  existingRoles,
  permissionTasks,
  isSaving = false,
}) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState(roleToEdit?.name ?? '');
  const [description, setDescription] = useState(roleToEdit?.description ?? '');
  const [matrix, setMatrix] = useState<ModulePermissionMatrix>(roleToEdit?.matrix ?? {});
  const [permissionQuery, setPermissionQuery] = useState('');
  const [error, setError] = useState('');

  // Map tasks to CMS Menu Groups
  const groupedMenuTasks = useMemo(() => {
    const taskByTitle = new Map<string, PermissionTask>();
    const taskByTaskKey = new Map<string, PermissionTask>();

    for (const task of permissionTasks) {
      if (task.view) taskByTitle.set(task.view.trim().toLowerCase(), task);
      if (task.task) taskByTaskKey.set(task.task.trim().toLowerCase(), task);
    }

    const groups: MenuGroupWithTasks[] = [];

    for (const group of cmsMenuGroups) {
      const items: MenuGroupWithTasks['items'] = [];
      for (const item of group.items) {
        // Find matching task by view title or task key
        const titleKey = item.title.trim().toLowerCase();
        let matchedTask = taskByTitle.get(titleKey);

        if (!matchedTask) {
          // fallback by task key / route
          for (const task of permissionTasks) {
            const itemPath = item.path?.toLowerCase() ?? '';
            if (itemPath && (itemPath.includes(task.task.toLowerCase()) || itemPath.includes(task.module.toLowerCase()))) {
              matchedTask = task;
              break;
            }
          }
        }

        if (matchedTask) {
          const supported = matchedTask.listFunction
            ? new Set(matchedTask.listFunction.split(',').map((s) => s.trim().toLowerCase()) as MatrixAction[])
            : new Set<MatrixAction>(['view', 'create', 'edit', 'publish', 'delete', 'export', 'configure']);

          items.push({
            menuTitle: item.title,
            iconName: item.iconName ?? 'Menu',
            task: matchedTask,
            allowedActions: supported,
          });
        }
      }

      if (items.length > 0) {
        groups.push({
          id: group.id,
          groupTitle: group.groupTitle,
          items,
        });
      }
    }

    // Add any orphan tasks not matched in cmsMenuGroups (if any exist)
    const matchedTaskIds = new Set(groups.flatMap((g) => g.items.map((i) => i.task.id)));
    const orphanTasks = permissionTasks.filter((t) => !matchedTaskIds.has(t.id));
    if (orphanTasks.length > 0) {
      groups.push({
        id: 'grp_khac',
        groupTitle: 'CHỨC NĂNG KHÁC',
        items: orphanTasks.map((t) => ({
          menuTitle: t.view || t.description || t.task,
          iconName: 'Menu',
          task: t,
          allowedActions: t.listFunction
            ? new Set(t.listFunction.split(',').map((s) => s.trim().toLowerCase()) as MatrixAction[])
            : new Set<MatrixAction>(['view', 'create', 'edit', 'publish', 'delete', 'export', 'configure']),
        })),
      });
    }

    return groups;
  }, [permissionTasks]);

  // Filter based on search query
  const filteredGroups = useMemo(() => {
    const q = permissionQuery.trim().toLowerCase();
    if (!q) return groupedMenuTasks;

    return groupedMenuTasks
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (item) =>
            item.menuTitle.toLowerCase().includes(q) ||
            (item.task.description && item.task.description.toLowerCase().includes(q)) ||
            group.groupTitle.toLowerCase().includes(q)
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [groupedMenuTasks, permissionQuery]);

  // Count active permissions
  const totalAvailableCount = useMemo(() => {
    return groupedMenuTasks.reduce(
      (acc, g) => acc + g.items.reduce((itemAcc, item) => itemAcc + item.allowedActions.size, 0),
      0
    );
  }, [groupedMenuTasks]);

  const currentGrantedCount = useMemo(() => {
    return Object.values(matrix).reduce(
      (count, taskActions) =>
        count + Object.values(taskActions ?? {}).filter((state) => state === 'allowed').length,
      0
    );
  }, [matrix]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSaving) onClose();
      if (event.key !== 'Tab') return;
      const focusable = [
        ...(dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]),input:not([disabled])') ?? []),
      ];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable.at(-1)!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, isSaving, onClose]);

  if (!isOpen) return null;

  const toggle = (taskId: string, action: MatrixAction) => {
    setMatrix((current) => ({
      ...current,
      [taskId]: {
        ...current[taskId],
        [action]: current[taskId]?.[action] === 'allowed' ? 'denied' : 'allowed',
      },
    }));
  };

  // Toggle all actions for a specific row
  const toggleRow = (taskId: string, allowedActions: Set<MatrixAction>) => {
    setMatrix((current) => {
      const currentTaskMatrix = current[taskId] ?? {};
      const allChecked = [...allowedActions].every((act) => currentTaskMatrix[act] === 'allowed');
      const updatedTaskMatrix = { ...currentTaskMatrix };

      for (const act of allowedActions) {
        updatedTaskMatrix[act] = allChecked ? 'denied' : 'allowed';
      }

      return { ...current, [taskId]: updatedTaskMatrix };
    });
  };

  // Toggle entire group
  const toggleGroup = (group: MenuGroupWithTasks) => {
    setMatrix((current) => {
      const allInGroupChecked = group.items.every((item) =>
        [...item.allowedActions].every((act) => current[item.task.id]?.[act] === 'allowed')
      );

      const updated = { ...current };
      for (const item of group.items) {
        const itemMatrix = { ...(updated[item.task.id] ?? {}) };
        for (const act of item.allowedActions) {
          itemMatrix[act] = allInGroupChecked ? 'denied' : 'allowed';
        }
        updated[item.task.id] = itemMatrix;
      }
      return updated;
    });
  };

  // Select all / Deselect all
  const toggleAllGlobal = (grant: boolean) => {
    setMatrix((current) => {
      const updated = { ...current };
      for (const group of groupedMenuTasks) {
        for (const item of group.items) {
          const itemMatrix = { ...(updated[item.task.id] ?? {}) };
          for (const act of item.allowedActions) {
            itemMatrix[act] = grant ? 'allowed' : 'denied';
          }
          updated[item.task.id] = itemMatrix;
        }
      }
      return updated;
    });
  };

  const save = () => {
    const trimmed = name.trim();
    if (trimmed.length < 2 || trimmed.length > 255) {
      return setError('Tên vai trò phải có từ 2 đến 255 ký tự.');
    }
    if (
      existingRoles.some(
        (role) =>
          role.id !== roleToEdit?.id &&
          role.name.trim().toLocaleLowerCase('vi') === trimmed.toLocaleLowerCase('vi')
      )
    ) {
      return setError('Tên vai trò đã tồn tại.');
    }
    if (description.trim().length > 5000) {
      return setError('Mô tả không được vượt quá 5.000 ký tự.');
    }

    void onSaveRole({
      id: roleToEdit?.id ?? 'new',
      code: roleToEdit?.code ?? '',
      name: trimmed,
      description: description.trim(),
      status: roleToEdit?.status ?? 'active',
      isProtected: roleToEdit?.isProtected ?? false,
      matrix,
      assignedUsersCount: roleToEdit?.assignedUsersCount ?? 0,
      updatedTime: roleToEdit?.updatedTime ?? new Date().toISOString(),
      updatedById: roleToEdit?.updatedById ?? null,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-3 sm:p-5 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="role-editor-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSaving) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="my-auto flex max-h-[calc(100dvh-1.5rem)] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:max-h-[94vh] dark:border-slate-800 dark:bg-slate-900"
      >
        {/* Modal Header */}
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
              <Shield className="size-5" />
            </span>
            <div className="min-w-0">
              <h2 id="role-editor-title" className="truncate font-bold text-slate-950 dark:text-white">
                {roleToEdit ? 'Chỉnh sửa vai trò' : 'Thêm vai trò mới'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Phân quyền theo cấu trúc Menu CMS. Tích chọn các thao tác được phép cho từng chức năng.
              </p>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="flex size-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
            aria-label="Đóng"
          >
            <X className="size-5" />
          </button>
        </header>

        {/* Modal Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Role Name & Description Inputs */}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <span>Tên vai trò *</span>
              <input
                autoFocus
                value={name}
                maxLength={255}
                placeholder="VD: Biên tập viên tin tức, Chuyên viên kinh doanh..."
                onChange={(event) => {
                  setName(event.target.value);
                  setError('');
                }}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-950 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </label>
            <label className="space-y-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <span>Mô tả vai trò</span>
              <input
                value={description}
                maxLength={5000}
                placeholder="Mô tả phạm vi trách nhiệm của vai trò..."
                onChange={(event) => setDescription(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-950 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </label>
          </div>
          {error && <p role="alert" className="text-sm font-semibold text-red-600">{error}</p>}

          {/* Matrix Controls & Search */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                Ma trận quyền theo Menu CMS
              </span>
              <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-700 dark:bg-orange-950/60 dark:text-orange-300">
                Đã chọn {currentGrantedCount}/{totalAvailableCount} quyền
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <label className="relative w-full sm:w-60">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={permissionQuery}
                  onChange={(event) => setPermissionQuery(event.target.value)}
                  placeholder="Tìm theo tên menu..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs outline-none focus:border-orange-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:focus:bg-slate-900 dark:text-white"
                />
              </label>

              <button
                type="button"
                onClick={() => toggleAllGlobal(true)}
                disabled={isSaving}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-orange-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Chọn tất cả
              </button>
              <button
                type="button"
                onClick={() => toggleAllGlobal(false)}
                disabled={isSaving}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-red-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Bỏ chọn tất cả
              </button>
            </div>
          </div>

          {/* Matrix Tables Grouped by CMS Menu Groups */}
          <div className="space-y-6">
            {filteredGroups.map((group) => {
              const allInGroupChecked = group.items.every((item) =>
                [...item.allowedActions].every((act) => matrix[item.task.id]?.[act] === 'allowed')
              );
              const groupGrantedCount = group.items.reduce(
                (acc, item) =>
                  acc +
                  [...item.allowedActions].filter((act) => matrix[item.task.id]?.[act] === 'allowed').length,
                0
              );
              const groupTotalAvailable = group.items.reduce(
                (acc, item) => acc + item.allowedActions.size,
                0
              );

              return (
                <div
                  key={group.id}
                  className="overflow-hidden rounded-xl border border-slate-200 shadow-xs dark:border-slate-800 bg-white dark:bg-slate-900"
                >
                  {/* Group Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50/90 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-800/60">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs tracking-wider uppercase text-slate-800 dark:text-slate-200">
                        {group.groupTitle}
                      </span>
                      <span className="rounded-md bg-slate-200/80 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                        {groupGrantedCount}/{groupTotalAvailable}
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => toggleGroup(group)}
                      className="text-[11px] font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-400 hover:underline"
                    >
                      {allInGroupChecked ? 'Bỏ chọn nhóm' : 'Chọn cả nhóm'}
                    </button>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold text-slate-500 dark:border-slate-800/80 dark:bg-slate-800/30">
                          <th className="min-w-64 px-4 py-2.5">Chức năng Menu CMS</th>
                          <th className="w-16 px-2 py-2.5 text-center">Tất cả</th>
                          {matrixActions.map((action) => (
                            <th key={action.code} className="w-16 px-2 py-2.5 text-center">
                              {action.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                        {group.items.map((item) => {
                          const taskId = item.task.id;
                          const currentTaskMatrix = matrix[taskId] ?? {};
                          const allRowChecked = [...item.allowedActions].every(
                            (act) => currentTaskMatrix[act] === 'allowed'
                          );
                          const someRowChecked =
                            !allRowChecked &&
                            [...item.allowedActions].some((act) => currentTaskMatrix[act] === 'allowed');

                          return (
                            <tr
                              key={taskId}
                              className="hover:bg-orange-50/30 dark:hover:bg-slate-800/40 transition-colors"
                            >
                              {/* Menu Title & Icon */}
                              <td className="px-4 py-2.5">
                                <div className="flex items-center gap-2.5">
                                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-950/40">
                                    {renderMenuIcon(item.iconName)}
                                  </span>
                                  <div className="min-w-0">
                                    <span className="font-bold text-slate-900 dark:text-white text-xs">
                                      {item.menuTitle}
                                    </span>
                                    {item.task.description && (
                                      <p className="line-clamp-1 text-[11px] text-slate-500 dark:text-slate-400">
                                        {item.task.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </td>

                              {/* Toggle Row All */}
                              <td className="px-2 py-2.5 text-center">
                                <button
                                  type="button"
                                  disabled={isSaving}
                                  onClick={() => toggleRow(taskId, item.allowedActions)}
                                  aria-label={`Chọn tất cả quyền cho ${item.menuTitle}`}
                                  className={`inline-flex size-6 items-center justify-center rounded-md border transition-colors ${
                                    allRowChecked
                                      ? 'border-orange-600 bg-orange-600 text-white shadow-xs'
                                      : someRowChecked
                                      ? 'border-orange-400 bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300'
                                      : 'border-slate-300 bg-white text-transparent hover:border-orange-400 dark:border-slate-700 dark:bg-slate-900'
                                  }`}
                                >
                                  {allRowChecked && <Check className="size-3.5" />}
                                  {someRowChecked && <Minus className="size-3.5" />}
                                </button>
                              </td>

                              {/* Matrix Action Checkboxes */}
                              {matrixActions.map((action) => {
                                const isApplicable = item.allowedActions.has(action.code);
                                if (!isApplicable) {
                                  return (
                                    <td key={action.code} className="px-2 py-2.5 text-center text-slate-300 dark:text-slate-700">
                                      <span title="Không áp dụng cho chức năng này">—</span>
                                    </td>
                                  );
                                }

                                const isChecked = currentTaskMatrix[action.code] === 'allowed';
                                return (
                                  <td key={action.code} className="px-2 py-2.5 text-center">
                                    <button
                                      type="button"
                                      disabled={isSaving}
                                      onClick={() => toggle(taskId, action.code)}
                                      aria-pressed={isChecked}
                                      aria-label={`${action.label}: ${item.menuTitle}`}
                                      className={`inline-flex size-6 items-center justify-center rounded-md border transition-all ${
                                        isChecked
                                          ? 'border-orange-600 bg-orange-600 text-white shadow-xs'
                                          : 'border-slate-300 bg-white text-transparent hover:border-orange-400 dark:border-slate-700 dark:bg-slate-900'
                                      }`}
                                    >
                                      {isChecked && <Check className="size-3.5" />}
                                    </button>
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
              );
            })}

            {filteredGroups.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700">
                Không tìm thấy chức năng menu nào khớp với từ khóa &ldquo;{permissionQuery}&rdquo;.
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <footer className="flex shrink-0 items-center justify-between border-t border-slate-200 px-5 py-3.5 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Tổng cộng: <strong className="text-slate-900 dark:text-white">{currentGrantedCount}</strong> thao tác được cấp quyền
          </div>
          <div className="flex gap-2.5">
            <CmsButton variant="secondary" size="sm" onClick={onClose} disabled={isSaving}>
              Hủy
            </CmsButton>
            <CmsButton size="sm" onClick={save} disabled={isSaving}>
              {isSaving ? 'Đang lưu...' : 'Lưu vai trò'}
            </CmsButton>
          </div>
        </footer>
      </div>
    </div>
  );
};
