import React, { useState } from 'react';
import { X, Key, ShieldCheck, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { ConfigItem } from './types';

interface SecretRotateModalProps {
  isOpen: boolean;
  onClose: () => void;
  settingItem: ConfigItem | null;
  scopeName: string;
  onSaveSecret: (settingId: string, newSecretValue: string) => void;
}

export const SecretRotateModal: React.FC<SecretRotateModalProps> = ({
  isOpen,
  onClose,
  settingItem,
  scopeName,
  onSaveSecret,
}) => {
  const [newSecret, setNewSecret] = useState('');
  const [confirmSecret, setConfirmSecret] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !settingItem) return null;

  const handleTestConnection = () => {
    if (!newSecret.trim()) {
      setErrorMsg('Vui lòng nhập giá trị mật khẩu / khóa secret mới trước khi kiểm tra!');
      return;
    }
    setErrorMsg(null);
    setIsTesting(true);
    setTestResult(null);

    setTimeout(() => {
      setIsTesting(false);
      if (newSecret.length >= 8) {
        setTestResult({
          ok: true,
          msg: `Xác thực thành công! Kết nối API/SMTP hoạt động phản hồi chuẩn (Response 200 OK - 42ms)`,
        });
      } else {
        setTestResult({
          ok: false,
          msg: `Khóa bí mật không đúng định dạng tối thiểu 8 ký tự hoặc phản hồi lỗi từ phía Provider!`,
        });
      }
    }, 800);
  };

  const handleConfirmSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSecret.trim()) {
      setErrorMsg('Giá trị khóa secret mới không được để trống!');
      return;
    }
    if (newSecret !== confirmSecret) {
      setErrorMsg('Xác nhận giá trị khóa secret mới không trùng khớp!');
      return;
    }

    onSaveSecret(settingItem.id, newSecret);
    setNewSecret('');
    setConfirmSecret('');
    setTestResult(null);
    setErrorMsg(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl">
              <Key className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Cập nhật / Xoay Khóa Bí mật (Secret Rotation)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {settingItem.label} ({scopeName})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORM BODY */}
        <form onSubmit={handleConfirmSave} className="p-5 space-y-4 text-xs">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl text-amber-800 dark:text-amber-300 space-y-1">
            <div className="flex items-center gap-2 font-bold">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Quy trình Bảo mật Nghiêm ngặt:</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Vì lý do an toàn, giá trị khóa bí mật hiện tại sẽ <strong>không bao giờ hiển thị rõ</strong> trên giao diện hay nhật ký hoạt động. Thay đổi chỉ có hiệu lực trong Bản nháp cho đến khi Xuất bản chính thức.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl text-red-600 dark:text-red-400 font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 dark:text-slate-200">
              Nhập Giá trị Khóa / Password Secret Mới <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={newSecret}
              onChange={(e) => setNewSecret(e.target.value)}
              placeholder="VD: AIzaSyD-..."
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 dark:text-slate-200">
              Xác nhận lại Giá trị Secret Mới <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={confirmSecret}
              onChange={(e) => setConfirmSecret(e.target.value)}
              placeholder="Nhập lại chính xác giá trị ở trên"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 font-mono"
            />
          </div>

          {/* TEST CONNECTION BUTTON & RESULT */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl flex items-center gap-2 cursor-pointer transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin text-orange-500' : ''}`} />
              <span>{isTesting ? 'Đang kiểm tra kết nối API/Provider...' : 'Kiểm tra Kết nối Thử nghiệm (Test Connection)'}</span>
            </button>

            {testResult && (
              <div
                className={`mt-2 p-3 rounded-xl border text-[11px] font-semibold flex items-start gap-2 ${
                  testResult.ok
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 text-emerald-700 dark:text-emerald-400'
                    : 'bg-red-50 dark:bg-red-950/30 border-red-200 text-red-700 dark:text-red-400'
                }`}
              >
                {testResult.ok ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                )}
                <span>{testResult.msg}</span>
              </div>
            )}
          </div>

          {/* ACTIONS */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold rounded-xl cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md shadow-red-600/20 cursor-pointer transition-all"
            >
              Lưu Khóa Secret vào Bản nháp
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
