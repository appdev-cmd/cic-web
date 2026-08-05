import React, { useState, useMemo } from 'react';
import {
  X,
  Shield,
  Save,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Layers,
  Globe,
  Users,
  History,
  GitCompare,
  ArrowRight,
  Sparkles,
  Lock,
  Unlock,
  Building,
  Check,
  Ban,
  Filter,
  Eye,
  Plus,
  Edit,
  Trash2,
  Send,
  Info,
} from 'lucide-react';
import {
  CmsRole,
  RoleRiskLevel,
  RoleCategory,
  RoleStatus,
  MatrixAction,
  CellPermissionState,
  ModulePermissionMatrix,
  ScopeConstraint,
  RoleVersion,
} from './types';
import type { AgencyOption } from '../cic_users/types';

interface RoleEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveRole: (role: CmsRole, activateImmediately: boolean) => void;
  roleToEdit: CmsRole | null;
  existingRoles: CmsRole[];
  agencies: AgencyOption[];
}

const MODULE_LIST = [
  { code: 'PRODUCTS', name: 'Sản phẩm Phần mềm & Báo giá', desc: 'Danh mục phần mềm, mã SKU, bảng giá và tài liệu kỹ thuật' },
  { code: 'USERS', name: 'Người dùng & Tài khoản CMS', desc: 'Hồ sơ người dùng, phân quyền vai trò và trạng thái tài khoản' },
  { code: 'NEWS', name: 'Bài viết & Tin tức Portal', desc: 'Soạn thảo, biên tập và xuất bản bài viết truyền thông' },
  { code: 'BANNERS', name: 'Banner & Slider Quảng cáo', desc: 'Quản lý banner trang chủ và vị trí truyền thông' },
  { code: 'SETTINGS', name: 'Cấu hình Hệ thống & SEO', desc: 'Tham số toàn cục, SEO meta, email template và API keys' },
  { code: 'ROLES', name: 'Chính sách Phân quyền & Security', desc: 'Định nghĩa Role, Scope policy và kiểm tra nhật ký audit' },
];

const MATRIX_ACTIONS: { code: MatrixAction; label: string; isPrivileged?: boolean }[] = [
  { code: 'view', label: 'Xem (View)' },
  { code: 'create', label: 'Tạo (Create)' },
  { code: 'edit', label: 'Sửa (Edit)' },
  { code: 'delete', label: 'Xóa (Delete)', isPrivileged: true },
  { code: 'review', label: 'Rà soát (Review)' },
  { code: 'approve', label: 'Duyệt (Approve)', isPrivileged: true },
  { code: 'publish', label: 'Xuất bản (Publish)' },
  { code: 'export', label: 'Xuất dữ liệu (Export)' },
  { code: 'configure', label: 'Cấu hình (Configure)', isPrivileged: true },
];

export const RoleEditorModal: React.FC<RoleEditorModalProps> = ({
  isOpen,
  onClose,
  onSaveRole,
  roleToEdit,
  existingRoles,
  agencies,
}) => {
  if (!isOpen) return null;

  const isCreate = !roleToEdit;

  // Form Basic Info State
  const [name, setName] = useState(roleToEdit?.name || '');
  const [category, setCategory] = useState<RoleCategory>(roleToEdit?.category || 'custom');
  const [riskLevel, setRiskLevel] = useState<RoleRiskLevel>(roleToEdit?.riskLevel || 'standard');
  const [purpose, setPurpose] = useState(roleToEdit?.purpose || '');
  const [description, setDescription] = useState(roleToEdit?.description || '');
  const [owner, setOwner] = useState(roleToEdit?.owner || 'Phòng An ninh Thông tin');
  const [reviewer, setReviewer] = useState(roleToEdit?.reviewer || 'Security Lead');
  const [changeNote, setChangeNote] = useState('');

  // Active Tab inside Editor
  const [activeTab, setActiveTab] = useState<'info' | 'matrix' | 'scope' | 'diff' | 'versions'>('matrix');

  // Matrix State
  const [matrix, setMatrix] = useState<ModulePermissionMatrix>(
    roleToEdit?.matrix || {
      PRODUCTS: { view: 'allowed', edit: 'conditional' },
      NEWS: { view: 'allowed', create: 'allowed', edit: 'allowed' },
    }
  );

  // Matrix Filter
  const [matrixFilter, setMatrixFilter] = useState<'all' | 'granted' | 'risky' | 'changed'>('all');
  const [matrixSearch, setMatrixSearch] = useState('');

  // Scope Builder State
  const [scopes, setScopes] = useState<ScopeConstraint[]>(
    roleToEdit?.scopes || [{ type: 'site', allowedValues: ['AG_HN', 'AG_HCM'], description: 'Chi nhánh Hà Nội & TP.HCM' }]
  );

  // Cell toggle helper: denied -> allowed -> conditional -> denied
  const toggleCell = (modCode: string, actCode: MatrixAction) => {
    setMatrix((prev) => {
      const modMatrix = prev[modCode] || {};
      const current = modMatrix[actCode] || 'denied';
      let next: CellPermissionState = 'allowed';
      if (current === 'denied') next = 'allowed';
      else if (current === 'allowed') next = 'conditional';
      else next = 'denied';

      return {
        ...prev,
        [modCode]: {
          ...modMatrix,
          [actCode]: next,
        },
      };
    });
  };

  // Scope toggle helper
  const handleScopeTypeChange = (type: ScopeConstraint['type']) => {
    if (type === 'global') {
      setScopes([{ type: 'global', allowedValues: ['ALL'], description: 'Toàn hệ thống (Global Scope)' }]);
    } else if (type === 'site') {
      setScopes([{ type: 'site', allowedValues: ['AG_HN'], description: 'Giới hạn theo Chi nhánh phụ trách' }]);
    } else if (type === 'team') {
      setScopes([{ type: 'team', allowedValues: ['CONTENT_TEAM'], description: 'Giới hạn theo Phòng ban / Team' }]);
    } else if (type === 'ownership') {
      setScopes([{ type: 'ownership', allowedValues: ['SELF_ONLY'], description: 'Chỉ các bản ghi do chính tài khoản khởi tạo' }]);
    }
  };

  const handleToggleScopeSite = (siteCode: string) => {
    const currentSiteScope = scopes.find((s) => s.type === 'site');
    let currentValues = currentSiteScope?.allowedValues || [];
    if (currentValues.includes(siteCode)) {
      currentValues = currentValues.filter((v) => v !== siteCode);
    } else {
      currentValues = [...currentValues, siteCode];
    }
    setScopes([
      {
        type: 'site',
        allowedValues: currentValues,
        description: `Chi nhánh: ${currentValues.join(', ') || 'Chưa chọn'}`,
      },
    ]);
  };

  // Check Separation of Duties (SoD) risk automatically
  const sodConflictFound = useMemo(() => {
    // Conflict rule: Cannot have both PRODUCTS Edit and PRODUCTS Approve in the same role
    const prodEdit = matrix.PRODUCTS?.edit === 'allowed' || matrix.PRODUCTS?.edit === 'conditional';
    const prodApprove = matrix.PRODUCTS?.approve === 'allowed' || matrix.PRODUCTS?.approve === 'conditional';
    return prodEdit && prodApprove;
  }, [matrix]);

  // Diff calculation comparing Current Matrix vs Active Version Matrix
  const matrixDiffs = useMemo(() => {
    const activeVer = roleToEdit?.versions.find((v) => v.versionNumber === roleToEdit.activeVersion);
    const oldMatrix = activeVer?.matrix || {};
    const added: string[] = [];
    const removed: string[] = [];
    const expanded: string[] = [];
    const reduced: string[] = [];

    MODULE_LIST.forEach((mod) => {
      MATRIX_ACTIONS.forEach((act) => {
        const oldSt = oldMatrix[mod.code]?.[act.code] || 'denied';
        const newSt = matrix[mod.code]?.[act.code] || 'denied';

        if (oldSt === 'denied' && newSt !== 'denied') {
          added.push(`${mod.name} -> ${act.label} (${newSt})`);
        } else if (oldSt !== 'denied' && newSt === 'denied') {
          removed.push(`${mod.name} -> ${act.label}`);
        } else if (oldSt === 'conditional' && newSt === 'allowed') {
          expanded.push(`${mod.name} -> ${act.label} (Từ Conditional nâng lên Allowed)`);
        } else if (oldSt === 'allowed' && newSt === 'conditional') {
          reduced.push(`${mod.name} -> ${act.label} (Thu hẹp thành Conditional)`);
        }
      });
    });

    return { added, removed, expanded, reduced };
  }, [matrix, roleToEdit]);

  // Submit Handler
  const handleSubmit = (activateImmediately: boolean) => {
    if (!name.trim()) {
      alert('Vui lòng nhập tên vai trò!');
      return;
    }

    const versionNum = roleToEdit ? (roleToEdit.draftVersion ? roleToEdit.draftVersion : roleToEdit.activeVersion + 0.1) : 1.0;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newVersionObj: RoleVersion = {
      versionNumber: Number(versionNum.toFixed(1)),
      createdTime: nowStr,
      createdBy: 'admin_cic',
      status: activateImmediately ? 'active' : 'draft',
      changeNote: changeNote.trim() || (isCreate ? 'Khởi tạo vai trò mới' : 'Cập nhật ma trận phân quyền'),
      matrix: matrix,
      scopes: scopes,
    };

    const updatedRole: CmsRole = {
      id: roleToEdit?.id || `role_cust_${Date.now()}`,
      name: name.trim(),
      category: category,
      riskLevel: riskLevel,
      status: activateImmediately ? 'active' : 'draft',
      purpose: purpose.trim() || 'Chưa bổ sung mục đích',
      description: description.trim() || 'Chưa có mô tả chi tiết',
      owner: owner,
      reviewer: reviewer,
      activeVersion: activateImmediately ? newVersionObj.versionNumber : (roleToEdit?.activeVersion || 1.0),
      draftVersion: activateImmediately ? undefined : newVersionObj.versionNumber,
      versions: [newVersionObj, ...(roleToEdit?.versions || [])],
      matrix: matrix,
      scopes: scopes,
      assignedUsersCount: roleToEdit?.assignedUsersCount || 0,
      assignedGroupCount: roleToEdit?.assignedGroupCount || 0,
      conflictIssuesCount: sodConflictFound ? 1 : 0,
      updatedTime: nowStr,
      updatedBy: 'admin_cic',
    };

    onSaveRole(updatedRole, activateImmediately);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-5xl my-auto flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* MODAL HEADER */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${riskLevel === 'privileged' ? 'bg-red-500/10 text-red-600' : 'bg-orange-500/10 text-orange-600'}`}>
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {isCreate ? 'Tạo Vai trò & Chính sách Quyền mới' : `Cấu hình Role: ${roleToEdit?.name}`}
                </h2>
                {!isCreate && (
                  <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded font-mono text-[10px] font-bold">
                    v{roleToEdit?.activeVersion} {roleToEdit?.draftVersion ? `(Draft v${roleToEdit.draftVersion})` : ''}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Xây dựng Ma trận Quyền (Permission Matrix), Phạm vi Scope và Tách biệt Trách nhiệm (SoD).
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL NAVIGATION TABS */}
        <div className="px-5 pt-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto shrink-0 text-xs">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`pb-2.5 font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'matrix'
                ? 'border-orange-600 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Ma trận Quyền (Permission Matrix)</span>
          </button>

          <button
            onClick={() => setActiveTab('scope')}
            className={`pb-2.5 font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'scope'
                ? 'border-orange-600 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Phạm vi Scope</span>
          </button>

          <button
            onClick={() => setActiveTab('info')}
            className={`pb-2.5 font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'info'
                ? 'border-orange-600 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>Thông tin & Ownership</span>
          </button>

          {!isCreate && (
            <button
              onClick={() => setActiveTab('diff')}
              className={`pb-2.5 font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'diff'
                  ? 'border-orange-600 text-orange-600 dark:text-orange-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <GitCompare className="w-4 h-4" />
              <span>So sánh & Tác động ({matrixDiffs.added.length + matrixDiffs.removed.length + matrixDiffs.expanded.length + matrixDiffs.reduced.length})</span>
            </button>
          )}

          {!isCreate && (
            <button
              onClick={() => setActiveTab('versions')}
              className={`pb-2.5 font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'versions'
                  ? 'border-orange-600 text-orange-600 dark:text-orange-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Lịch sử Phiên bản ({roleToEdit?.versions.length || 1})</span>
            </button>
          )}
        </div>

        {/* SOD RISK WARNING BANNER */}
        {sodConflictFound && (
          <div className="mx-5 mt-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl flex items-center justify-between text-xs text-red-700 dark:text-red-300 shrink-0">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>
                <strong>Cảnh báo SoD:</strong> Vai trò đang bật đồng thời quyền <strong>Chỉnh sửa (Edit)</strong> và <strong>Duyệt (Approve)</strong> trên Sản phẩm!
              </span>
            </div>
            <span className="px-2 py-0.5 bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200 font-bold rounded text-[10px]">
              Critical Risk
            </span>
          </div>
        )}

        {/* MODAL BODY (SCROLLABLE) */}
        <div className="p-5 flex-1 overflow-y-auto space-y-5 text-xs">
          
          {/* TAB 1: PERMISSION MATRIX */}
          {activeTab === 'matrix' && (
            <div className="space-y-4">
              {/* Matrix Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Lọc ma trận:</span>
                  <button
                    onClick={() => setMatrixFilter('all')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                      matrixFilter === 'all' ? 'bg-orange-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Tất cả
                  </button>
                  <button
                    onClick={() => setMatrixFilter('granted')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                      matrixFilter === 'granted' ? 'bg-orange-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Chỉ được phép (Allowed)
                  </button>
                  <button
                    onClick={() => setMatrixFilter('risky')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                      matrixFilter === 'risky' ? 'bg-orange-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Quyền đặc thù (Privileged)
                  </button>
                </div>

                <div className="text-[11px] text-slate-500 font-mono">
                  Mẹo: Click vào ô để chuyển <strong>Denied (Khóa) → Allowed (Cho phép) → Conditional (Theo Scope)</strong>
                </div>
              </div>

              {/* MATRIX TABLE */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      <th className="p-3 w-64 border-r border-slate-200 dark:border-slate-700">Module / Resource</th>
                      {MATRIX_ACTIONS.map((act) => (
                        <th key={act.code} className="p-2 text-center border-r border-slate-200 dark:border-slate-700 min-w-[90px]">
                          <div className={act.isPrivileged ? 'text-red-600 dark:text-red-400 font-extrabold' : ''}>
                            {act.label}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
                    {MODULE_LIST.map((mod) => (
                      <tr key={mod.code} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        {/* Module Info */}
                        <td className="p-3 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                          <div className="font-bold text-slate-900 dark:text-white">{mod.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{mod.code}</div>
                        </td>

                        {/* Action Cells */}
                        {MATRIX_ACTIONS.map((act) => {
                          const state = matrix[mod.code]?.[act.code] || 'denied';

                          // Apply filter
                          if (matrixFilter === 'granted' && state === 'denied') {
                            return (
                              <td key={act.code} className="p-2 text-center border-r border-slate-200 dark:border-slate-800 opacity-20">
                                —
                              </td>
                            );
                          }
                          if (matrixFilter === 'risky' && !act.isPrivileged) {
                            return (
                              <td key={act.code} className="p-2 text-center border-r border-slate-200 dark:border-slate-800 opacity-20">
                                —
                              </td>
                            );
                          }

                          return (
                            <td key={act.code} className="p-2 text-center border-r border-slate-200 dark:border-slate-800">
                              <button
                                type="button"
                                onClick={() => toggleCell(mod.code, act.code)}
                                className={`w-full py-1.5 px-2 rounded-lg text-[10px] font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                                  state === 'allowed'
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800 shadow-2xs'
                                    : state === 'conditional'
                                    ? 'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800 shadow-2xs'
                                    : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 hover:bg-slate-200'
                                }`}
                              >
                                {state === 'allowed' && (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-600" />
                                    <span>Allowed</span>
                                  </>
                                )}
                                {state === 'conditional' && (
                                  <>
                                    <Globe className="w-3 h-3 text-amber-600" />
                                    <span>Scope</span>
                                  </>
                                )}
                                {state === 'denied' && <span>Denied</span>}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: SCOPE BUILDER */}
          {activeTab === 'scope' && (
            <div className="space-y-4">
              <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl space-y-1">
                <div className="font-bold text-orange-900 dark:text-orange-300 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-orange-600" />
                  <span>Cấu hình Phạm vi Dữ liệu (Scope Policy Builder)</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  Xác định giới hạn truy cập dữ liệu của vai trò theo Chi nhánh (Site), Phòng ban (Team), Quốc gia (Locale) hoặc Quyền sở hữu (Ownership).
                </p>
              </div>

              {/* Scope Selection Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => handleScopeTypeChange('global')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer space-y-2 ${
                    scopes.some((s) => s.type === 'global')
                      ? 'bg-orange-50/50 border-orange-500 dark:bg-orange-950/30'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                    <span>Toàn hệ thống (Global)</span>
                    {scopes.some((s) => s.type === 'global') && <CheckCircle2 className="w-4 h-4 text-orange-600" />}
                  </div>
                  <p className="text-slate-500 text-[11px]">Không giới hạn phạm vi, xem và thao tác trên mọi dữ liệu.</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleScopeTypeChange('site')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer space-y-2 ${
                    scopes.some((s) => s.type === 'site')
                      ? 'bg-orange-50/50 border-orange-500 dark:bg-orange-950/30'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                    <span>Theo Chi nhánh (Site)</span>
                    {scopes.some((s) => s.type === 'site') && <CheckCircle2 className="w-4 h-4 text-orange-600" />}
                  </div>
                  <p className="text-slate-500 text-[11px]">Chỉ truy cập các bài viết & sản phẩm thuộc Chi nhánh phân công.</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleScopeTypeChange('team')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer space-y-2 ${
                    scopes.some((s) => s.type === 'team')
                      ? 'bg-orange-50/50 border-orange-500 dark:bg-orange-950/30'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                    <span>Theo Phòng ban (Team)</span>
                    {scopes.some((s) => s.type === 'team') && <CheckCircle2 className="w-4 h-4 text-orange-600" />}
                  </div>
                  <p className="text-slate-500 text-[11px]">Giới hạn dữ liệu trong nội bộ team/phòng ban phụ trách.</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleScopeTypeChange('ownership')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer space-y-2 ${
                    scopes.some((s) => s.type === 'ownership')
                      ? 'bg-orange-50/50 border-orange-500 dark:bg-orange-950/30'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                    <span>Chính chủ (Ownership)</span>
                    {scopes.some((s) => s.type === 'ownership') && <CheckCircle2 className="w-4 h-4 text-orange-600" />}
                  </div>
                  <p className="text-slate-500 text-[11px]">Chỉ xem & thao tác trên bản ghi do chính tài khoản đó khởi tạo.</p>
                </button>
              </div>

              {/* Site Selection Details if Site scope active */}
              {scopes.some((s) => s.type === 'site') && (
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
                  <div className="font-bold text-slate-800 dark:text-slate-200">Chọn Chi nhánh được phép (Allowed Sites):</div>
                  <div className="flex flex-wrap gap-2">
                    {agencies.map((ag) => {
                      const siteScope = scopes.find((s) => s.type === 'site');
                      const isChecked = siteScope?.allowedValues.includes(ag.id);
                      return (
                        <button
                          key={ag.id}
                          type="button"
                          onClick={() => handleToggleScopeSite(ag.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                            isChecked
                              ? 'bg-orange-600 text-white border-orange-600'
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                          }`}
                        >
                          <Building className="w-3.5 h-3.5" />
                          <span>{ag.name} ({ag.code})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BASIC INFO & OWNERSHIP */}
          {activeTab === 'info' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tên Vai trò (Role Name) *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ví dụ: Biên tập viên Chi nhánh Miền Nam"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-medium focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Loại Vai trò (Category)
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as RoleCategory)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-medium cursor-pointer"
                  >
                    <option value="custom">Vai trò tùy chỉnh (Custom Role)</option>
                    <option value="system">Vai trò hệ thống (System Role)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mức độ Rủi ro (Risk Level)
                  </label>
                  <select
                    value={riskLevel}
                    onChange={(e) => setRiskLevel(e.target.value as RoleRiskLevel)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold cursor-pointer"
                  >
                    <option value="standard">Tiêu chuẩn (Standard Risk)</option>
                    <option value="elevated">Nâng cao (Elevated Risk)</option>
                    <option value="privileged">Đặc quyền cao (Privileged Access Risk)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Ghi chú thay đổi (Change Note for Version Audit)
                  </label>
                  <input
                    type="text"
                    value={changeNote}
                    onChange={(e) => setChangeNote(e.target.value)}
                    placeholder="Mô tả lý do thay đổi phiên bản..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mục đích Nghiệp vụ (Business Purpose)
                  </label>
                  <textarea
                    rows={2}
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="Mô tả mục đích cấp vai trò này..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-medium resize-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mô tả Chi tiết (Description)
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Mô tả quyền hạn chi tiết..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-medium resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Đơn vị sở hữu (Owner)
                    </label>
                    <input
                      type="text"
                      value={owner}
                      onChange={(e) => setOwner(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Người phê duyệt (Reviewer)
                    </label>
                    <input
                      type="text"
                      value={reviewer}
                      onChange={(e) => setReviewer(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: VERSION DIFF & IMPACT ANALYSIS */}
          {activeTab === 'diff' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl space-y-1">
                <div className="font-bold text-blue-900 dark:text-blue-300 flex items-center gap-2">
                  <GitCompare className="w-4 h-4 text-blue-600" />
                  <span>So sánh Khác biệt: Bản thảo (Draft) vs Bản đang phát hành (Active v{roleToEdit?.activeVersion})</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  Xem trước các quyền được Thêm (Added), Gỡ bỏ (Removed), Mở rộng (Expanded) hoặc Thu hẹp (Reduced) trước khi kích hoạt chính thức.
                </p>
              </div>

              {/* Diffs Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-2">
                  <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                    <span>Quyền được Thêm mới (Added):</span>
                    <span className="px-2 py-0.5 bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 rounded text-[10px] font-bold">
                      {matrixDiffs.added.length}
                    </span>
                  </div>
                  <ul className="space-y-1 list-disc list-inside text-[11px] text-slate-700 dark:text-slate-300">
                    {matrixDiffs.added.length === 0 ? (
                      <li className="text-slate-400 italic">Không có quyền mới nào được thêm.</li>
                    ) : (
                      matrixDiffs.added.map((d, i) => <li key={i}>{d}</li>)
                    )}
                  </ul>
                </div>

                <div className="p-4 bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl space-y-2">
                  <div className="font-bold text-red-800 dark:text-red-300 flex items-center justify-between">
                    <span>Quyền bị Gỡ bỏ (Removed):</span>
                    <span className="px-2 py-0.5 bg-red-200 dark:bg-red-900 text-red-900 dark:text-red-100 rounded text-[10px] font-bold">
                      {matrixDiffs.removed.length}
                    </span>
                  </div>
                  <ul className="space-y-1 list-disc list-inside text-[11px] text-slate-700 dark:text-slate-300">
                    {matrixDiffs.removed.length === 0 ? (
                      <li className="text-slate-400 italic">Không có quyền nào bị gỡ bỏ.</li>
                    ) : (
                      matrixDiffs.removed.map((d, i) => <li key={i}>{d}</li>)
                    )}
                  </ul>
                </div>
              </div>

              {/* Impact Summary */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Users className="w-4 h-4 text-orange-600" />
                  <span>Đánh giá Tác động tới Người dùng (Impact Analysis):</span>
                </div>
                <div className="text-slate-600 dark:text-slate-400 text-xs">
                  Khi kích hoạt phiên bản này, có <strong>{roleToEdit?.assignedUsersCount || 0} tài khoản quản trị</strong> đang giữ vai trò này sẽ ngay lập tức áp dụng ma trận phân quyền mới.
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: VERSION HISTORY */}
          {activeTab === 'versions' && (
            <div className="space-y-3">
              <div className="font-bold text-slate-800 dark:text-slate-200 mb-2">
                Nhật ký các phiên bản đã phát hành & dự thảo:
              </div>

              {roleToEdit?.versions.map((ver) => (
                <div
                  key={ver.versionNumber}
                  className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2"
                >
                  <div className="flex items-center justify-between font-bold">
                    <div className="flex items-center gap-2">
                      <span className="text-orange-600 font-mono text-sm">v{ver.versionNumber}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ver.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
                          : ver.status === 'draft'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
                          : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                      }`}>
                        {ver.status.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-slate-400 font-mono text-[11px]">{ver.createdTime}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-xs">{ver.changeNote}</p>
                  <div className="text-[11px] text-slate-400 font-mono">Tạo bởi: {ver.createdBy}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-slate-500 font-medium">
            * Mọi thay đổi phiên bản vai trò sẽ được tự động ghi nhận vào Audit Log hệ thống.
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
            >
              Hủy
            </button>

            <button
              type="button"
              onClick={() => handleSubmit(false)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Lưu Bản nháp (Draft)</span>
            </button>

            <button
              type="button"
              onClick={() => handleSubmit(true)}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Phát hành (Activate)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
