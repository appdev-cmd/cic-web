import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [logoutOtherDevices, setLogoutOtherDevices] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Validation rules
  const hasMinLength = newPassword.length >= 8;
  const hasUpperLower = /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const isMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const validScore = [hasMinLength, hasUpperLower, hasNumber, hasSpecial].filter(Boolean).length;
  const strengthLabels = ['Rất yếu', 'Yếu', 'Trung bình', 'Khá', 'Rất mạnh'];
  const strengthColors = [
    'bg-slate-200 dark:bg-slate-700',
    'bg-red-500',
    'bg-amber-500',
    'bg-blue-500',
    'bg-emerald-500',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!currentPassword) {
      newErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
    }
    if (!newPassword) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
    } else if (!hasMinLength) {
      newErrors.newPassword = 'Mật khẩu mới phải có tối thiểu 8 ký tự';
    } else if (newPassword === currentPassword) {
      newErrors.newPassword = 'Mật khẩu mới không được trùng với mật khẩu hiện tại';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp với mật khẩu mới';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess();
      onClose();
    }, 400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="change-password-modal-title"
    >
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 id="change-password-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
                Đổi mật khẩu
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Bảo vệ tài khoản quản trị hệ thống của bạn
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-4.5">
          {/* Current Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Mật khẩu hiện tại <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  if (errors.currentPassword) setErrors((prev) => ({ ...prev, currentPassword: '' }));
                }}
                className={`w-full pl-9 pr-10 py-2 text-xs bg-white dark:bg-slate-900 border rounded-xl outline-none transition-all text-slate-900 dark:text-white ${
                  errors.currentPassword
                    ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                    : 'border-slate-300 dark:border-slate-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10'
                }`}
                placeholder="Nhập mật khẩu hiện tại đang dùng"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.currentPassword}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Mật khẩu mới <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (errors.newPassword) setErrors((prev) => ({ ...prev, newPassword: '' }));
                }}
                className={`w-full pl-9 pr-10 py-2 text-xs bg-white dark:bg-slate-900 border rounded-xl outline-none transition-all text-slate-900 dark:text-white ${
                  errors.newPassword
                    ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                    : 'border-slate-300 dark:border-slate-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10'
                }`}
                placeholder="Tối thiểu 8 ký tự, bao gồm chữ hoa, số"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.newPassword}
              </p>
            )}

            {/* Password Strength Indicator */}
            {newPassword.length > 0 && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-500 dark:text-slate-400">Độ mạnh mật khẩu:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {strengthLabels[validScore]}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1 h-1.5">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`rounded-full transition-colors ${
                        validScore >= step ? strengthColors[validScore] : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Xác nhận mật khẩu mới <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                }}
                className={`w-full pl-9 pr-10 py-2 text-xs bg-white dark:bg-slate-900 border rounded-xl outline-none transition-all text-slate-900 dark:text-white ${
                  errors.confirmPassword
                    ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                    : 'border-slate-300 dark:border-slate-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10'
                }`}
                placeholder="Nhập lại mật khẩu mới"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Password Security Rules Checklist */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-2">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
              Yêu cầu bảo mật mật khẩu:
            </span>
            <div className="grid grid-cols-1 gap-1 text-[11px]">
              <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-400'}`}>
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Tối thiểu 8 ký tự</span>
              </div>
              <div className={`flex items-center gap-1.5 ${hasUpperLower ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-400'}`}>
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Gồm cả chữ hoa (A-Z) và chữ thường (a-z)</span>
              </div>
              <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-400'}`}>
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Chứa ít nhất một chữ số (0-9)</span>
              </div>
              <div className={`flex items-center gap-1.5 ${hasSpecial ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-400'}`}>
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Chứa ký tự đặc biệt (!@#$%^&*...)</span>
              </div>
              {confirmPassword.length > 0 && (
                <div className={`flex items-center gap-1.5 ${isMatch ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-red-500'}`}>
                  {isMatch ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
                  <span>Mật khẩu xác nhận trùng khớp</span>
                </div>
              )}
            </div>
          </div>

          {/* Logout from other devices option */}
          <label className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={logoutOtherDevices}
              onChange={(e) => setLogoutOtherDevices(e.target.checked)}
              className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300 dark:border-slate-700 dark:bg-slate-800"
            />
            <span>Đăng xuất khỏi tất cả các phiên đăng nhập trên thiết bị khác</span>
          </label>
        </form>

        {/* Footer Actions */}
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
            disabled={isSubmitting}
            className="px-4.5 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
          >
            <KeyRound className="w-4 h-4" />
            <span>{isSubmitting ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
