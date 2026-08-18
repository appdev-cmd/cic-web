import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Shield,
  Clock,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Calendar,
  Image as ImageIcon,
  Edit3,
} from 'lucide-react';
import { CmsUser } from '../types';

interface MyAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: CmsUser;
  onSave: (updatedUser: CmsUser) => void;
}

export const MyAccountModal: React.FC<MyAccountModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave,
}) => {
  const [fullName, setFullName] = useState(user.full_name || '');
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState('0912 345 678');
  const [address, setAddress] = useState('Tòa nhà CIC, 37 Lê Đại Hành, Hai Bà Trưng, Hà Nội');
  const [agency, setAgency] = useState('Trụ sở chính Hà Nội (HQ)');
  const [summary, setSummary] = useState('Chuyên viên quản trị nội dung và phân phối giải pháp công nghệ kỹ thuật CIC.');
  const [avatarUrl, setAvatarUrl] = useState(user.user_avatar || '');
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [avatarInput, setAvatarInput] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setFullName(user.full_name || '');
      setEmail(user.email || '');
      setAvatarUrl(user.user_avatar || '');
      setErrors({});
      setIsEditingAvatar(false);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const roleLabelMap: Record<string, string> = {
    superadmin: 'Quản trị viên cấp cao (Super Admin)',
    admin: 'Quản trị viên hệ thống (Admin)',
    editor: 'Biên tập viên nội dung (Editor)',
    viewer: 'Người xem (Viewer)',
  };

  const roleBadgeMap: Record<string, string> = {
    superadmin: 'bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    admin: 'bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    editor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    viewer: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  };

  const handleApplyAvatar = (url: string) => {
    if (url.trim()) {
      setAvatarUrl(url.trim());
      setIsEditingAvatar(false);
      setAvatarInput('');
    }
  };

  const presetAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Họ và tên không được để trống';
    }
    if (!email.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Định dạng email không hợp lệ';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const updatedUser: CmsUser = {
      ...user,
      full_name: fullName.trim(),
      email: email.trim(),
      user_avatar: avatarUrl || user.user_avatar,
    };

    onSave(updatedUser);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="my-account-modal-title"
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 id="my-account-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
                Tài khoản của tôi
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Thông tin hồ sơ và định danh tài khoản quản trị CMS
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* User Profile Card Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-orange-500/5 via-amber-500/5 to-transparent border border-orange-500/20 dark:border-orange-500/10 flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="relative group">
              <img
                src={avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={fullName}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-white dark:border-slate-800 shadow-md"
              />
              <button
                type="button"
                onClick={() => setIsEditingAvatar(!isEditingAvatar)}
                className="absolute -bottom-1 -right-1 p-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow-md transition-transform active:scale-95 cursor-pointer"
                title="Thay đổi ảnh đại diện"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {fullName || 'Chưa nhập tên'}
                </h3>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${roleBadgeMap[user.role] || roleBadgeMap.admin}`}>
                  <Shield className="w-3 h-3 mr-1" />
                  {roleLabelMap[user.role] || 'Quản trị viên'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                @{user.username} • ID: {user.id}
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Trạng thái: Hoạt động
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                  Đăng nhập: {user.last_login_time || 'Gần đây'}
                </span>
              </div>
            </div>
          </div>

          {/* Change Avatar Drawer / Panel */}
          {isEditingAvatar && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-orange-500" />
                  Chọn hoặc nhập link ảnh đại diện
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditingAvatar(false)}
                  className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Đóng
                </button>
              </div>

              {/* Preset Avatars */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Ảnh mẫu có sẵn:</span>
                <div className="flex items-center gap-2">
                  {presetAvatars.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleApplyAvatar(url)}
                      className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-transform hover:scale-105 cursor-pointer ${
                        avatarUrl === url ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <img src={url} alt={`Avatar ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* URL Input */}
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={avatarInput}
                  onChange={(e) => setAvatarInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 text-slate-800 dark:text-slate-200"
                />
                <button
                  type="button"
                  onClick={() => handleApplyAvatar(avatarInput)}
                  disabled={!avatarInput.trim()}
                  className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Áp dụng
                </button>
              </div>
            </div>
          )}

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                  }}
                  className={`w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-900 border rounded-xl outline-none transition-all text-slate-900 dark:text-white ${
                    errors.fullName
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                      : 'border-slate-300 dark:border-slate-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10'
                  }`}
                  placeholder="Nguyễn Văn A"
                />
              </div>
              {errors.fullName && <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.fullName}</p>}
            </div>

            {/* Username (Read-only) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Tên đăng nhập (Username)
              </label>
              <input
                type="text"
                value={user.username}
                disabled
                className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 cursor-not-allowed font-mono"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email công việc <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  className={`w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-900 border rounded-xl outline-none transition-all text-slate-900 dark:text-white ${
                    errors.email
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                      : 'border-slate-300 dark:border-slate-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10'
                  }`}
                  placeholder="admin@cic.com.vn"
                />
              </div>
              {errors.email && <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Số điện thoại liên hệ
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 text-slate-900 dark:text-white"
                  placeholder="024 3976 1381"
                />
              </div>
            </div>

            {/* Agency / Department */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Đơn vị / Chi nhánh công tác
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={agency}
                  onChange={(e) => setAgency(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 text-slate-900 dark:text-white"
                  placeholder="Trụ sở chính Hà Nội"
                />
              </div>
            </div>

            {/* Address */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Địa chỉ làm việc
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 text-slate-900 dark:text-white"
                  placeholder="Địa chỉ trụ sở"
                />
              </div>
            </div>

            {/* Summary / Bio */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Ghi chú / Giới thiệu nhiệm vụ
              </label>
              <textarea
                rows={2}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 text-slate-900 dark:text-white"
                placeholder="Ghi chú ngắn về chuyên môn, nhiệm vụ phân công..."
              />
            </div>
          </div>

          {/* Security & 2FA Quick Status */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Xác thực 2 yếu tố (2FA / OTP)
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Tăng cường bảo vệ tài khoản khi đăng nhập vào hệ thống quản trị
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={twoFactorEnabled}
                onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-600"></div>
            </label>
          </div>
        </form>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4.5 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
          >
            <Save className="w-4 h-4" />
            <span>Lưu thay đổi</span>
          </button>
        </div>
      </div>
    </div>
  );
};
