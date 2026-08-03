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
} from 'lucide-react';
import { CicUser } from './types';
import { agenciesMock, productCategoriesMock, newsCategoriesMock } from './mockData';
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

  // Form Field States
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
  const [published, setPublished] = useState(true);
  const [ordering, setOrdering] = useState(0);
  const [selectedAgencies, setSelectedAgencies] = useState<string[]>(['agency_hn']);
  const [productsCategories, setProductsCategories] = useState<string[]>([]);
  const [newsCategories, setNewsCategories] = useState<string[]>([]);

  // Errors state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate data on open/change userToEdit
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
      setPublished(userToEdit.published);
      setOrdering(userToEdit.ordering || 0);
      setSelectedAgencies(userToEdit.agencies || ['agency_hn']);
      setProductsCategories(userToEdit.products_categories || []);
      setNewsCategories(userToEdit.news_categories || []);
    } else {
      // Reset form for create
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setIsChangingPassword(true); // Always require password on Create

      setFname('');
      setLname('');
      setFullName('');
      setIsFullNameManuallyEdited(false);

      setPhone('');
      setCountry('Việt Nam');
      setAddress('');
      setSummary('');

      setAvatar('');
      setPublished(true);
      setOrdering(existingUsers.length + 1);
      setSelectedAgencies(['agency_hn']);
      setProductsCategories([]);
      setNewsCategories([]);
    }
    setErrors({});
  }, [userToEdit, isOpen, existingUsers.length]);

  // Handle auto-concatenating full_name
  const handleFnameChange = (value: string) => {
    setFname(value);
    if (!isFullNameManuallyEdited) {
      const generated = `${lname} ${value}`.trim();
      setFullName(generated);
    }
  };

  const handleLnameChange = (value: string) => {
    setLname(value);
    if (!isFullNameManuallyEdited) {
      const generated = `${value} ${fname}`.trim();
      setFullName(generated);
    }
  };

  const handleFullNameChange = (value: string) => {
    setFullName(value);
    setIsFullNameManuallyEdited(true);
  };

  // Avatar Upload simulation
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 1. Username
    if (!username.trim()) {
      newErrors.username = 'Tên đăng nhập không được để trống';
    } else {
      const duplicateUsername = existingUsers.find(
        (u) => u.username.toLowerCase() === username.trim().toLowerCase() && u.id !== userToEdit?.id
      );
      if (duplicateUsername) {
        newErrors.username = 'Tên đăng nhập đã tồn tại trên hệ thống';
      }
    }

    // 2. Email
    if (!email.trim()) {
      newErrors.email = 'Email không được để trống';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        newErrors.email = 'Định dạng email không hợp lệ (ví dụ: name@company.com)';
      } else {
        const duplicateEmail = existingUsers.find(
          (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.id !== userToEdit?.id
        );
        if (duplicateEmail) {
          newErrors.email = 'Địa chỉ email này đã được sử dụng bởi tài khoản khác';
        }
      }
    }

    // 3. Password (Required on Create OR when Edit with "Change Password" toggled)
    if (!isEditMode || (isEditMode && isChangingPassword)) {
      if (!password) {
        newErrors.password = 'Mật khẩu không được để trống';
      }
      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Mật khẩu xác nhận không trùng khớp';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const finalFullName = fullName.trim() || `${lname} ${fname}`.trim() || username;

    const userPayload: CicUser = {
      id: userToEdit ? userToEdit.id : `usr_${Date.now()}`,
      username: username.trim(),
      password: isChangingPassword ? password : userToEdit?.password,
      email: email.trim(),
      fname: fname.trim(),
      lname: lname.trim(),
      full_name: finalFullName,
      phone: phone.trim(),
      country: country.trim(),
      address: address.trim(),
      summary: summary.trim(),
      avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      published,
      ordering: Number(ordering) || 0,
      agencies: selectedAgencies,
      products_categories: productsCategories,
      news_categories: newsCategories,
      status_online: userToEdit ? userToEdit.status_online : true,
      created_time: userToEdit ? userToEdit.created_time : new Date().toISOString().replace('T', ' ').substring(0, 19),
      updated_time: new Date().toISOString().replace('T', ' ').substring(0, 19),
      last_visit_time: userToEdit?.last_visit_time,
      nums_visit: userToEdit?.nums_visit || 0,
    };

    onSave(userPayload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {isEditMode ? `Cập nhật Tài khoản Quản trị: ${userToEdit.username}` : 'Thêm mới Tài khoản Quản trị CMS'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEditMode ? 'Chỉnh sửa thông tin chi tiết và phân quyền quản lý' : 'Tạo mới người dùng đăng nhập hệ thống'}
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

        {/* Modal Body - 2 Columns Layout */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT COLUMN (7 Cols) - Account Info & Personal Info */}
            <div className="lg:col-span-7 space-y-6">
              {/* SECTION 1: Thông tin tài khoản */}
              <div className="bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
                  <KeyRound className="w-4 h-4" />
                  <span>Thông tin tài khoản</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Username */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Tên đăng nhập (Username) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="vd: admin_cic"
                        className={`w-full pl-3 pr-3 py-2 bg-white dark:bg-slate-900 border ${
                          errors.username ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                        } rounded-lg text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                      />
                    </div>
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
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="vd: user@cic.com.vn"
                        className={`w-full pl-3 pr-3 py-2 bg-white dark:bg-slate-900 border ${
                          errors.email ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                        } rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-[11px] text-red-500 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" /> {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Password Section */}
                <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 space-y-3">
                  {isEditMode ? (
                    <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Đổi mật khẩu tài khoản</span>
                        <p className="text-[11px] text-slate-400">Bật tùy chọn này nếu bạn muốn thiết lập mật khẩu mới</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChangingPassword}
                          onChange={(e) => setIsChangingPassword(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ) : null}

                  {/* Render Password Fields when Create OR when "Đổi mật khẩu" is checked */}
                  {(!isEditMode || isChangingPassword) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-150">
                      {/* Password */}
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                          Mật khẩu {!isEditMode && <span className="text-red-500">*</span>}
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Nhập mật khẩu..."
                            className={`w-full pl-3 pr-10 py-2 bg-white dark:bg-slate-900 border ${
                              errors.password ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                            } rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {errors.password && (
                          <p className="text-[11px] text-red-500 flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3 h-3" /> {errors.password}
                          </p>
                        )}
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                          Xác nhận Mật khẩu {!isEditMode && <span className="text-red-500">*</span>}
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Nhập lại mật khẩu..."
                            className={`w-full pl-3 pr-3 py-2 bg-white dark:bg-slate-900 border ${
                              errors.confirmPassword ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                            } rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                          />
                        </div>
                        {errors.confirmPassword && (
                          <p className="text-[11px] text-red-500 flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3 h-3" /> {errors.confirmPassword}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 2: Thông tin cá nhân */}
              <div className="bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
                  <User className="w-4 h-4" />
                  <span>Thông tin cá nhân</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Tên (First Name)
                    </label>
                    <input
                      type="text"
                      value={fname}
                      onChange={(e) => handleFnameChange(e.target.value)}
                      placeholder="vd: Quản Trị"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>

                  {/* Last Name */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Họ & Tên đệm (Last Name)
                    </label>
                    <input
                      type="text"
                      value={lname}
                      onChange={(e) => handleLnameChange(e.target.value)}
                      placeholder="vd: Nguyễn Văn"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>
                </div>

                {/* Full Name */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Họ và tên đầy đủ (Full Name)
                    </label>
                    <span className="text-[10px] text-slate-400">Tự động ghép từ Họ + Tên</span>
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => handleFullNameChange(e.target.value)}
                    placeholder="vd: Nguyễn Văn Quản Trị"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Số điện thoại
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="vd: 0912345678"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>

                  {/* Country */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Quốc gia
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    >
                      <option value="Việt Nam">Việt Nam</option>
                      <option value="Nhật Bản">Nhật Bản</option>
                      <option value="Hàn Quốc">Hàn Quốc</option>
                      <option value="Mỹ">Mỹ (United States)</option>
                      <option value="Singapore">Singapore</option>
                    </select>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Địa chỉ liên hệ
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="vd: 37 Lê Thanh Nghị, Hai Bà Trưng, Hà Nội"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

                {/* Summary */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Ghi chú / Mới thiệu ngắn (Summary)
                  </label>
                  <textarea
                    rows={3}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Mô tả công việc hoặc vai trò trách nhiệm ngắn..."
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN (5 Cols) - Avatar & System Specs & Category Permissions */}
            <div className="lg:col-span-5 space-y-6">
              {/* SECTION: Avatar */}
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
                        className="w-24 h-24 rounded-full object-cover border-4 border-blue-500/20 shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => setAvatar('')}
                        className="absolute -top-1 -right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-md cursor-pointer transition-transform hover:scale-110"
                        title="Xóa ảnh"
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
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Tải ảnh lên từ máy tính</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarFileChange}
                        className="hidden"
                      />
                    </label>

                    <div className="relative">
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
              </div>

              {/* SECTION: Trang thái & Thứ tự & Đơn vị */}
              <div className="bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
                {/* Published */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                      Trạng thái Kích hoạt (Published)
                    </label>
                    <p className="text-[11px] text-slate-400">Cho phép tài khoản đăng nhập vào hệ thống</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                {/* Ordering */}
                <div className="space-y-1 pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Thứ tự hiển thị (Ordering)
                  </label>
                  <input
                    type="number"
                    value={ordering}
                    onChange={(e) => setOrdering(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>

                {/* Agencies */}
                <div className="space-y-1 pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Đơn vị / Chi nhánh (Agencies)
                  </label>
                  <div className="space-y-1.5">
                    {agenciesMock.map((agency) => {
                      const isChecked = selectedAgencies.includes(agency.id);
                      return (
                        <label
                          key={agency.id}
                          className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-blue-500 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setSelectedAgencies(selectedAgencies.filter((a) => a !== agency.id));
                              } else {
                                setSelectedAgencies([...selectedAgencies, agency.id]);
                              }
                            }}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                            {agency.name}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* SECTION: Phân quyền Danh mục Sản phẩm & Tin tức */}
              <div className="bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
                  <Building className="w-4 h-4" />
                  <span>Phân quyền Phụ trách Danh mục</span>
                </div>

                {/* Products Categories (Searchable Multi select) */}
                <SearchableMultiSelect
                  label="Danh mục Sản phẩm phụ trách"
                  placeholder="Chọn danh mục sản phẩm..."
                  options={productCategoriesMock}
                  selectedIds={productsCategories}
                  onChange={setProductsCategories}
                />

                {/* News Categories (Searchable Multi select) */}
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
        </form>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isEditMode ? 'Lưu thay đổi' : 'Tạo tài khoản'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
