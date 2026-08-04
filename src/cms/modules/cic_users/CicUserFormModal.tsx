import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  User,
  Mail,
  Lock,
  Phone,
  Globe,
  MapPin,
  FileText,
  Upload,
  Eye,
  EyeOff,
  Building,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Shield,
  Layers,
  History,
  ShieldCheck,
  Smartphone,
  UserCheck,
  UserX,
  Clock,
  Sparkles,
} from 'lucide-react';
import { CicUser, UserAccountStatus, UserSecurityLog, UserStatusHistory } from './types';
import { agenciesMock, productCategoriesMock, newsCategoriesMock, rolesMock } from './mockData';
import { SearchableMultiSelect } from './SearchableMultiSelect';

interface CicUserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: CicUser) => void;
  userToEdit: CicUser | null;
  existingUsers: CicUser[];
}

export const CicUserFormModal: React.FC<CicUserFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  userToEdit,
  existingUsers,
}) => {
  const isEditMode = !!userToEdit;

  // Active Modal Tab
  const [activeTab, setActiveTab] = useState<'profile' | 'roles_scopes' | 'effective_access' | 'security'>('profile');

  // Form Fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [fullName, setFullName] = useState('');
  const [isFullNameManuallyEdited, setIsFullNameManuallyEdited] = useState(false);

  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Việt Nam');
  const [address, setAddress] = useState('');
  const [summary, setSummary] = useState('');

  const [avatar, setAvatar] = useState('');
  const [status, setStatus] = useState<UserAccountStatus>('active');
  const [roleId, setRoleId] = useState('role_editor');
  const [ordering, setOrdering] = useState(0);
  const [selectedAgencies, setSelectedAgencies] = useState<string[]>(['agency_hn']);
  const [productsCategories, setProductsCategories] = useState<string[]>([]);
  const [newsCategories, setNewsCategories] = useState<string[]>([]);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Status Change Reason modal / input
  const [statusReason, setStatusReason] = useState('');

  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form on open
  useEffect(() => {
    if (userToEdit) {
      setUsername(userToEdit.username);
      setEmail(userToEdit.email);
      setPassword('');
      setConfirmPassword('');
      setIsChangingPassword(false);

      setFname(userToEdit.fname || '');
      setLname(userToEdit.lname || '');
      setFullName(userToEdit.full_name || '');
      setIsFullNameManuallyEdited(true);

      setPhone(userToEdit.phone || '');
      setCountry(userToEdit.country || 'Việt Nam');
      setAddress(userToEdit.address || '');
      setSummary(userToEdit.summary || '');

      setAvatar(userToEdit.avatar || '');
      setStatus(userToEdit.status || (userToEdit.published ? 'active' : 'suspended'));
      setRoleId(userToEdit.role_id || 'role_editor');
      setOrdering(userToEdit.ordering || 0);
      setSelectedAgencies(userToEdit.agencies || ['agency_hn']);
      setProductsCategories(userToEdit.products_categories || []);
      setNewsCategories(userToEdit.news_categories || []);
      setTwoFactorEnabled(userToEdit.two_factor_enabled || false);
    } else {
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setIsChangingPassword(true);

      setFname('');
      setLname('');
      setFullName('');
      setIsFullNameManuallyEdited(false);

      setPhone('');
      setCountry('Việt Nam');
      setAddress('');
      setSummary('');

      setAvatar('');
      setStatus('active');
      setRoleId('role_editor');
      setOrdering(existingUsers.length + 1);
      setSelectedAgencies(['agency_hn']);
      setProductsCategories([]);
      setNewsCategories([]);
      setTwoFactorEnabled(false);
    }
    setErrors({});
    setActiveTab('profile');
    setStatusReason('');
  }, [userToEdit, isOpen, existingUsers.length]);

  const handleFnameChange = (val: string) => {
    setFname(val);
    if (!isFullNameManuallyEdited) {
      setFullName(`${lname} ${val}`.trim());
    }
  };

  const handleLnameChange = (val: string) => {
    setLname(val);
    if (!isFullNameManuallyEdited) {
      setFullName(`${val} ${fname}`.trim());
    }
  };

  const handleFullNameChange = (val: string) => {
    setFullName(val);
    setIsFullNameManuallyEdited(true);
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!username.trim()) {
      newErrors.username = 'Tên đăng nhập không được để trống';
    } else {
      const dup = existingUsers.find(
        (u) => u.username.toLowerCase() === username.trim().toLowerCase() && u.id !== userToEdit?.id
      );
      if (dup) newErrors.username = 'Tên đăng nhập đã tồn tại';
    }

    if (!email.trim()) {
      newErrors.email = 'Email không được để trống';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        newErrors.email = 'Email không đúng định dạng';
      } else {
        const dupEmail = existingUsers.find(
          (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.id !== userToEdit?.id
        );
        if (dupEmail) newErrors.email = 'Email đã được đăng ký bởi tài khoản khác';
      }
    }

    if (!isEditMode || (isEditMode && isChangingPassword)) {
      if (!password) newErrors.password = 'Mật khẩu không được để trống';
      if (password !== confirmPassword) newErrors.confirmPassword = 'Mật khẩu xác nhận không trùng khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      setActiveTab('profile');
      return;
    }

    const selectedRoleObj = rolesMock.find((r) => r.id === roleId);
    const roleName = selectedRoleObj ? selectedRoleObj.name : 'Content Editor';

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    // Prepare status history if status changed
    let updatedHistory: UserStatusHistory[] = userToEdit?.status_history || [];
    if (userToEdit && userToEdit.status !== status) {
      updatedHistory = [
        {
          id: `sth_${Date.now()}`,
          timestamp: nowStr,
          previous_status: userToEdit.status,
          new_status: status,
          changed_by: 'admin_cic',
          reason: statusReason.trim() || `Cập nhật trạng thái từ ${userToEdit.status} sang ${status}`,
        },
        ...updatedHistory,
      ];
    }

    // Prepare security log
    const updatedSecurityLogs: UserSecurityLog[] = [
      {
        id: `sec_${Date.now()}`,
        timestamp: nowStr,
        action: isEditMode ? 'Cập nhật thông tin tài khoản' : 'Khởi tạo tài khoản mới',
        ip_address: '118.70.124.89',
        status: 'success',
        details: isChangingPassword ? 'Thay đổi mật khẩu tài khoản' : undefined,
      },
      ...(userToEdit?.security_logs || []),
    ];

    const finalUser: CicUser = {
      id: userToEdit ? userToEdit.id : `usr_${Date.now()}`,
      username: username.trim(),
      password: isChangingPassword ? password : userToEdit?.password,
      email: email.trim(),
      fname: fname.trim(),
      lname: lname.trim(),
      full_name: fullName.trim() || `${lname} ${fname}`.trim() || username,
      phone: phone.trim(),
      country: country.trim(),
      address: address.trim(),
      summary: summary.trim(),
      avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      published: status === 'active',
      status,
      role_id: roleId,
      role_name: roleName,
      ordering: Number(ordering) || 0,
      agencies: selectedAgencies,
      products_categories: productsCategories,
      news_categories: newsCategories,
      two_factor_enabled: twoFactorEnabled,
      password_last_changed: isChangingPassword ? nowStr : userToEdit?.password_last_changed,
      failed_login_attempts: userToEdit?.failed_login_attempts || 0,
      security_logs: updatedSecurityLogs,
      status_history: updatedHistory,
      status_online: userToEdit ? userToEdit.status_online : true,
      created_time: userToEdit ? userToEdit.created_time : nowStr,
      updated_time: nowStr,
      last_visit_time: userToEdit?.last_visit_time,
      nums_visit: userToEdit?.nums_visit || 0,
    };

    onSave(finalUser);
  };

  if (!isOpen) return null;

  const currentRole = rolesMock.find((r) => r.id === roleId);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{isEditMode ? `Tài khoản: ${userToEdit.username}` : 'Thêm mới Tài khoản Quản trị CMS'}</span>
                {isEditMode && (
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                    status === 'active'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300'
                      : status === 'suspended'
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-300'
                      : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-400'
                  }`}>
                    {status === 'active' ? 'Hoạt động' : status === 'suspended' ? 'Tạm khóa' : 'Đã khóa'}
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Quản lý hồ sơ cá nhân, phân quyền role & phạm vi công việc chi tiết
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 pt-3 bg-slate-100/70 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 overflow-x-auto text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-orange-600 text-orange-600 dark:text-orange-400 bg-white dark:bg-slate-900 rounded-t-xl'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>1. Hồ sơ & Đăng nhập</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('roles_scopes')}
            className={`px-4 py-2.5 border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'roles_scopes'
                ? 'border-orange-600 text-orange-600 dark:text-orange-400 bg-white dark:bg-slate-900 rounded-t-xl'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>2. Vai trò & Phạm vi (Scopes)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('effective_access')}
            className={`px-4 py-2.5 border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'effective_access'
                ? 'border-orange-600 text-orange-600 dark:text-orange-400 bg-white dark:bg-slate-900 rounded-t-xl'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>3. Tóm tắt Quyền hạn (Effective Access)</span>
          </button>

          {isEditMode && (
            <button
              type="button"
              onClick={() => setActiveTab('security')}
              className={`px-4 py-2.5 border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'security'
                  ? 'border-orange-600 text-orange-600 dark:text-orange-400 bg-white dark:bg-slate-900 rounded-t-xl'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <History className="w-4 h-4" />
              <span>4. Bảo mật & Nhật ký Hoạt động</span>
            </button>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: PROFILE & LOGIN */}
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-150">
              {/* Left Column (Account Info) */}
              <div className="lg:col-span-7 space-y-5">
                <div className="bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-wider">
                    <KeyRound className="w-4 h-4" />
                    <span>Thông tin tài khoản đăng nhập</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Username */}
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Tên đăng nhập (Username) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="vd: admin_cic"
                        className={`w-full px-3 py-2 bg-white dark:bg-slate-900 border ${
                          errors.username ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                        } rounded-lg text-xs font-mono font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                      />
                      {errors.username && (
                        <p className="text-[11px] text-red-500 flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3 h-3" /> {errors.username}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Địa chỉ Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="vd: user@cic.com.vn"
                        className={`w-full px-3 py-2 bg-white dark:bg-slate-900 border ${
                          errors.email ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                        } rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                      />
                      {errors.email && (
                        <p className="text-[11px] text-red-500 flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3 h-3" /> {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Password Controls */}
                  <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 space-y-3">
                    {isEditMode && (
                      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                        <div>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Đổi mật khẩu tài khoản</span>
                          <p className="text-[11px] text-slate-400">Bật nếu bạn muốn đặt lại mật khẩu mới cho quản trị viên</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChangingPassword}
                            onChange={(e) => setIsChangingPassword(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                        </label>
                      </div>
                    )}

                    {(!isEditMode || isChangingPassword) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                            Mật khẩu {!isEditMode && <span className="text-red-500">*</span>}
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Nhập mật khẩu mới..."
                              className={`w-full pl-3 pr-9 py-2 bg-white dark:bg-slate-900 border ${
                                errors.password ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                              } rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          {errors.password && <p className="text-[11px] text-red-500">{errors.password}</p>}
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                            Xác nhận mật khẩu {!isEditMode && <span className="text-red-500">*</span>}
                          </label>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Nhập lại mật khẩu..."
                            className={`w-full px-3 py-2 bg-white dark:bg-slate-900 border ${
                              errors.confirmPassword ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                            } rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none`}
                          />
                          {errors.confirmPassword && <p className="text-[11px] text-red-500">{errors.confirmPassword}</p>}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Personal Info */}
                <div className="bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-wider">
                    <User className="w-4 h-4" />
                    <span>Thông tin cá nhân</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Tên (First Name)
                      </label>
                      <input
                        type="text"
                        value={fname}
                        onChange={(e) => handleFnameChange(e.target.value)}
                        placeholder="vd: Quản Trị"
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Họ & Tên đệm (Last Name)
                      </label>
                      <input
                        type="text"
                        value={lname}
                        onChange={(e) => handleLnameChange(e.target.value)}
                        placeholder="vd: Nguyễn Văn"
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Họ và tên đầy đủ (Full Name)
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => handleFullNameChange(e.target.value)}
                      placeholder="vd: Nguyễn Văn Quản Trị"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Số điện thoại
                      </label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="vd: 0912345678"
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Quốc gia
                      </label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
                      >
                        <option value="Việt Nam">Việt Nam</option>
                        <option value="Nhật Bản">Nhật Bản</option>
                        <option value="Hàn Quốc">Hàn Quốc</option>
                        <option value="Mỹ">Mỹ (United States)</option>
                        <option value="Singapore">Singapore</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Địa chỉ
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="vd: 37 Lê Thanh Nghị, Hai Bà Trưng, Hà Nội"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Ghi chú / Giới thiệu
                    </label>
                    <textarea
                      rows={2}
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      placeholder="Mô tả công việc hoặc ghi chú ngắn..."
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column (Avatar & Status) */}
              <div className="lg:col-span-5 space-y-5">
                {/* Avatar Card */}
                <div className="bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Ảnh đại diện (Avatar)
                  </label>
                  <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-center space-y-3">
                    {avatar ? (
                      <div className="relative group">
                        <img
                          src={avatar}
                          alt="Avatar preview"
                          className="w-24 h-24 rounded-full object-cover border-4 border-orange-500/20 shadow-md"
                        />
                        <button
                          type="button"
                          onClick={() => setAvatar('')}
                          className="absolute -top-1 -right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-md cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                        <User className="w-10 h-10" />
                      </div>
                    )}

                    <div className="space-y-2 w-full">
                      <label className="inline-flex items-center justify-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors w-full">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Tải ảnh từ máy tính</span>
                        <input type="file" accept="image/*" onChange={handleAvatarFileChange} className="hidden" />
                      </label>
                      <input
                        type="text"
                        value={avatar}
                        onChange={(e) => setAvatar(e.target.value)}
                        placeholder="Hoặc dán URL ảnh..."
                        className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-[11px] text-slate-700 dark:text-slate-300 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Account Lifecycle Status */}
                <div className="bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Trạng thái vòng đời tài khoản (Account Lifecycle)
                  </label>

                  <div className="space-y-2">
                    {[
                      {
                        key: 'active',
                        label: 'Hoạt động (Active)',
                        desc: 'Tài khoản hợp lệ, được phép đăng nhập và thao tác',
                        color: 'border-emerald-500 text-emerald-700 dark:text-emerald-300',
                      },
                      {
                        key: 'suspended',
                        label: 'Tạm khóa (Suspended)',
                        desc: 'Tạm ngưng quyền truy cập (bảo trì hoặc vi phạm)',
                        color: 'border-amber-500 text-amber-700 dark:text-amber-300',
                      },
                      {
                        key: 'deactivated',
                        label: 'Đã khóa / Ngừng dùng (Deactivated)',
                        desc: 'Vô hiệu hóa tài khoản (nhân sự nghỉ việc / thay đổi)',
                        color: 'border-slate-400 text-slate-700 dark:text-slate-300',
                      },
                    ].map((st) => (
                      <label
                        key={st.key}
                        className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          status === st.key
                            ? `bg-white dark:bg-slate-900 border-2 ${st.color} shadow-xs`
                            : 'bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="account_status"
                          value={st.key}
                          checked={status === st.key}
                          onChange={() => setStatus(st.key as UserAccountStatus)}
                          className="mt-0.5 text-orange-600 focus:ring-orange-500 cursor-pointer"
                        />
                        <div>
                          <div className="text-xs font-bold">{st.label}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{st.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>

                  {isEditMode && status !== userToEdit.status && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <label className="block text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Lý do thay đổi trạng thái (Lưu nhật ký Audit):</span>
                      </label>
                      <input
                        type="text"
                        value={statusReason}
                        onChange={(e) => setStatusReason(e.target.value)}
                        placeholder="Nhập nguyên nhân thay đổi trạng thái..."
                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ROLES & SCOPES */}
          {activeTab === 'roles_scopes' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Role Selection */}
              <div className="bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-wider">
                  <Shield className="w-4 h-4" />
                  <span>Chọn Vai trò Quản trị (Role Assignment)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {rolesMock.map((r) => {
                    const isSelected = roleId === r.id;
                    return (
                      <div
                        key={r.id}
                        onClick={() => setRoleId(r.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-white dark:bg-slate-900 border-2 border-orange-500 shadow-md shadow-orange-500/10'
                            : 'bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${r.badge_color}`}>
                              {r.name}
                            </span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />}
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                            {r.description}
                          </p>
                        </div>
                        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 flex items-center justify-between font-mono">
                          <span>Permissions count</span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">{r.permissions_count} quyền</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Agencies Scope */}
              <div className="bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-wider">
                  <Building className="w-4 h-4" />
                  <span>Phạm vi Đơn vị / Chi nhánh (Agencies Scope)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {agenciesMock.map((ag) => {
                    const isChecked = selectedAgencies.includes(ag.id);
                    return (
                      <label
                        key={ag.id}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-white dark:bg-slate-900 border-orange-500 shadow-xs'
                            : 'bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) setSelectedAgencies(selectedAgencies.filter((a) => a !== ag.id));
                              else setSelectedAgencies([...selectedAgencies, ag.id]);
                            }}
                            className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500 cursor-pointer"
                          />
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{ag.name}</span>
                        </div>
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono text-[10px] font-bold rounded">
                          {ag.code}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Category Scopes */}
              <div className="bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-wider">
                  <Layers className="w-4 h-4" />
                  <span>Phạm vi Phân quyền Danh mục Nội dung</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <SearchableMultiSelect
                    label="Danh mục Sản phẩm phụ trách"
                    placeholder="Chọn danh mục sản phẩm..."
                    options={productCategoriesMock}
                    selectedIds={productsCategories}
                    onChange={setProductsCategories}
                  />

                  <SearchableMultiSelect
                    label="Danh mục Tin tức phụ trách"
                    placeholder="Chọn danh mục tin tức..."
                    options={newsCategoriesMock}
                    selectedIds={newsCategories}
                    onChange={setNewsCategories}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EFFECTIVE ACCESS SUMMARY */}
          {activeTab === 'effective_access' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <div className="font-bold text-orange-900 dark:text-orange-300">
                    Tóm tắt Quyền hạn Hiệu lực (Effective Access)
                  </div>
                  <p className="text-orange-700 dark:text-orange-400">
                    Bảng tóm tắt kết hợp giữa Vai trò quản trị (<strong>{currentRole?.name}</strong>) và các phạm vi đơn vị, danh mục phụ trách.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                  <div className="text-[11px] font-bold uppercase text-slate-400">Vai trò chính</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-orange-600" />
                    <span>{currentRole?.name}</span>
                  </div>
                  <p className="text-xs text-slate-500">{currentRole?.description}</p>
                </div>

                <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                  <div className="text-[11px] font-bold uppercase text-slate-400">Số đơn vị quản lý</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Building className="w-4 h-4 text-blue-600" />
                    <span>{selectedAgencies.length} Chi nhánh / HQ</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedAgencies.map((aid) => {
                      const ag = agenciesMock.find((a) => a.id === aid);
                      return (
                        <span key={aid} className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold rounded">
                          {ag?.code || aid}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                  <div className="text-[11px] font-bold uppercase text-slate-400">Phạm vi Danh mục</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-600" />
                    <span>{productsCategories.length + newsCategories.length} Danh mục</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {productsCategories.length} sản phẩm + {newsCategories.length} tin tức
                  </p>
                </div>
              </div>

              {/* Matrix List of Modules */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
                  Ma trận phân quyền chi tiết theo module CMS
                </div>
                <div className="p-4 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {[
                    { module: 'Sản phẩm & Giải pháp', view: true, create: true, edit: true, delete: roleId === 'role_superadmin' },
                    { module: 'Tin tức & Bài viết', view: true, create: true, edit: true, delete: roleId === 'role_superadmin' || roleId === 'role_editor' },
                    { module: 'Khách hàng & Báo giá', view: true, create: roleId === 'role_sales', edit: true, delete: roleId === 'role_superadmin' },
                    { module: 'Bản địa hóa (Localization)', view: true, create: roleId === 'role_translator', edit: true, delete: roleId === 'role_superadmin' },
                    { module: 'Quản trị Người dùng & Phân quyền', view: roleId === 'role_superadmin' || roleId === 'role_admin', create: roleId === 'role_superadmin' || roleId === 'role_admin', edit: roleId === 'role_superadmin' || roleId === 'role_admin', delete: roleId === 'role_superadmin' },
                  ].map((row, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{row.module}</span>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.view ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>Xem</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.create ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>Thêm</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.edit ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>Sửa</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.delete ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>Xóa</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SECURITY & ACTIVITY LOG */}
          {activeTab === 'security' && isEditMode && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
                  <div className="text-[11px] font-bold uppercase text-slate-400">Xác thực 2 yếu tố (2FA)</div>
                  <div className="flex items-center justify-between pt-1">
                    <span className={`text-xs font-bold ${twoFactorEnabled ? 'text-emerald-600' : 'text-slate-500'}`}>
                      {twoFactorEnabled ? 'Đã kích hoạt' : 'Chưa kích hoạt'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                      className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-[11px] font-bold cursor-pointer"
                    >
                      {twoFactorEnabled ? 'Tắt 2FA' : 'Bật 2FA'}
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
                  <div className="text-[11px] font-bold uppercase text-slate-400">Đổi mật khẩu lần cuối</div>
                  <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                    {userToEdit?.password_last_changed || 'Chưa cập nhật'}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
                  <div className="text-[11px] font-bold uppercase text-slate-400">Số lượt đăng nhập thành công</div>
                  <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                    {userToEdit?.nums_visit || 0} lần
                  </div>
                </div>
              </div>

              {/* Status Change Audit Trail */}
              {userToEdit?.status_history && userToEdit.status_history.length > 0 && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span>Lịch sử thay đổi trạng thái tài khoản (Status Audit Trail)</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    {userToEdit.status_history.map((sth) => (
                      <div key={sth.id} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <span>{sth.previous_status}</span>
                            <span>→</span>
                            <span className="text-orange-600">{sth.new_status}</span>
                          </div>
                          <p className="text-[11px] text-slate-500">Lý do: {sth.reason}</p>
                        </div>
                        <div className="text-right text-[10px] text-slate-400 font-mono shrink-0">
                          <div>{sth.timestamp}</div>
                          <div>Bởi: {sth.changed_by}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Security Activity Log */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <History className="w-4 h-4 text-blue-500" />
                  <span>Nhật ký bảo mật gần đây (Security Log)</span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {userToEdit?.security_logs && userToEdit.security_logs.length > 0 ? (
                    userToEdit.security_logs.map((log) => (
                      <div key={log.id} className="p-3 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${log.status === 'success' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                            <span>{log.action}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            IP: {log.ip_address} | {log.user_agent || 'N/A'}
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{log.timestamp}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-slate-400">Chưa có nhật ký hoạt động.</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold cursor-pointer"
          >
            Hủy bỏ
          </button>
          <div className="flex items-center gap-2">
            {activeTab !== 'profile' && (
              <button
                type="button"
                onClick={() => {
                  if (activeTab === 'roles_scopes') setActiveTab('profile');
                  else if (activeTab === 'effective_access') setActiveTab('roles_scopes');
                  else if (activeTab === 'security') setActiveTab('effective_access');
                }}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold cursor-pointer"
              >
                Quay lại
              </button>
            )}
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-2 px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 cursor-pointer transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{isEditMode ? 'Lưu thay đổi' : 'Tạo tài khoản'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
