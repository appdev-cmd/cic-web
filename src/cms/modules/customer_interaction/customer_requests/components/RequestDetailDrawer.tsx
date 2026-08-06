import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  MessageSquare,
  Clock,
  FileText,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Pin,
  Send,
  Tag,
  History,
  UserCheck,
  Globe,
  MapPin,
} from 'lucide-react';
import { CustomerRequest } from '../types';
import { REQUEST_STATUS_LABELS, REQUEST_STATUS_COLORS } from '../../shared/constants/statusTypes';
import { PRIORITY_LABELS, PRIORITY_COLORS } from '../../shared/constants/statusTypes';

interface RequestDetailDrawerProps {
  isOpen: boolean;
  request: CustomerRequest | null;
  onClose: () => void;
  onAssignUser: (requestId: string, userId: string) => void;
  onUpdateStatus: (requestId: string, newStatus: string) => void;
  onAddNote: (requestId: string, noteContent: string) => void;
}

export const RequestDetailDrawer: React.FC<RequestDetailDrawerProps> = ({
  isOpen,
  request,
  onClose,
  onAssignUser,
  onUpdateStatus,
  onAddNote,
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'source' | 'logs'>('info');
  const [noteInput, setNoteInput] = useState('');

  if (!isOpen || !request) return null;

  const getCustomerName = (): string => {
    const nameField = request.submissionValues.find(
      (v) => v.fieldKey === 'full_name' || v.fieldType === 'text'
    );
    return nameField?.valueText || 'Không có tên';
  };

  const getCustomerEmail = (): string => {
    const emailField = request.submissionValues.find(
      (v) => v.fieldKey === 'email' || v.fieldType === 'email'
    );
    return emailField?.valueText || '';
  };

  const getCustomerPhone = (): string => {
    const phoneField = request.submissionValues.find(
      (v) => v.fieldKey === 'phone' || v.fieldType === 'phone'
    );
    return phoneField?.valueText || '';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    onAddNote(request.id, noteInput.trim());
    setNoteInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-2xl h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {getCustomerName()}
              </h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                #{request.id}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-4 py-3 border-b border-slate-200 dark:border-slate-800 shrink-0">
          {[
            { id: 'info' as const, label: 'Thông tin', icon: <User className="w-3.5 h-3.5" /> },
            { id: 'source' as const, label: 'Nguồn', icon: <Globe className="w-3.5 h-3.5" /> },
            { id: 'logs' as const, label: 'Lịch sử', icon: <History className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar min-h-0">
          {activeTab === 'info' && (
            <div className="space-y-6">
              {/* Status & Priority */}
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${REQUEST_STATUS_COLORS[request.status as keyof typeof REQUEST_STATUS_COLORS]}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {REQUEST_STATUS_LABELS[request.status]}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${PRIORITY_COLORS[request.priority as keyof typeof PRIORITY_COLORS]}`}
                >
                  {PRIORITY_LABELS[request.priority]}
                </span>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Thông tin liên hệ
                </h3>
                <div className="space-y-3">
                  {getCustomerEmail() && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        {getCustomerEmail()}
                      </span>
                    </div>
                  )}
                  {getCustomerPhone() && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        {getCustomerPhone()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Data */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Dữ liệu biểu mẫu
                </h3>
                <div className="space-y-3">
                  {request.submissionValues.map((field) => (
                    <div key={field.fieldKey} className="space-y-1">
                      <label className="text-xs text-slate-500 dark:text-slate-400">
                        {field.fieldLabel}
                      </label>
                      <div className="text-sm text-slate-700 dark:text-slate-300">
                        {field.valueText || field.valueJson?.toString() || '-'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              {request.tags.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {request.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md text-xs"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Assignee */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Người phụ trách
                </h3>
                {request.assignedUserName ? (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center text-orange-600 dark:text-orange-400 text-sm font-bold">
                      {request.assignedUserName.charAt(0)}
                    </div>
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      {request.assignedUserName}
                    </span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onAssignUser(request.id, '')}
                    className="text-sm text-orange-600 dark:text-orange-400 hover:underline"
                  >
                    Phân công người phụ trách
                  </button>
                )}
              </div>

              {/* Internal Notes */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Ghi chú nội bộ
                </h3>
                <div className="space-y-3">
                  {request.internalNotes.map((note) => (
                    <div
                      key={note.id}
                      className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          {note.createdByName}
                        </span>
                        <span className="text-xs text-slate-400">
                          {formatDate(note.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {note.content}
                      </p>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleAddNote} className="space-y-2">
                  <textarea
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    placeholder="Thêm ghi chú mới..."
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-sm"
                  />
                  <button
                    type="submit"
                    disabled={!noteInput.trim()}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                    Thêm ghi chú
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'source' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Thông tin nguồn
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Biểu mẫu</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        {request.sourceConfig.formName}
                      </p>
                    </div>
                  </div>
                  {request.sourceConfig.ctaName && (
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">CTA</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          {request.sourceConfig.ctaName}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Trang</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        {request.sourceConfig.pageTitle}
                      </p>
                      <a
                        href={request.sourceConfig.pageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1"
                      >
                        {request.sourceConfig.pageUrl}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Thời gian gửi</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        {formatDate(request.sourceConfig.submittedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* UTM Params */}
              {(request.sourceConfig.utmSource || request.sourceConfig.utmMedium || request.sourceConfig.utmCampaign) && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Thông số Marketing
                  </h3>
                  <div className="space-y-3">
                    {request.sourceConfig.utmSource && (
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500 dark:text-slate-400 w-20">UTM Source:</span>
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {request.sourceConfig.utmSource}
                        </span>
                      </div>
                    )}
                    {request.sourceConfig.utmMedium && (
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500 dark:text-slate-400 w-20">UTM Medium:</span>
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {request.sourceConfig.utmMedium}
                        </span>
                      </div>
                    )}
                    {request.sourceConfig.utmCampaign && (
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500 dark:text-slate-400 w-20">UTM Campaign:</span>
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {request.sourceConfig.utmCampaign}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Device Info */}
              {request.sourceConfig.deviceInfo && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Thiết bị
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500 dark:text-slate-400 w-20">Browser:</span>
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        {request.sourceConfig.deviceInfo.browser}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500 dark:text-slate-400 w-20">OS:</span>
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        {request.sourceConfig.deviceInfo.os}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500 dark:text-slate-400 w-20">Device:</span>
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        {request.sourceConfig.deviceInfo.device}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Lịch sử hoạt động
              </h3>
              <div className="space-y-3">
                {request.logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        {log.createdByName}
                      </span>
                      <span className="text-xs text-slate-400">
                        {formatDate(log.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {log.actionType}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => onUpdateStatus(request.id, request.status)}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Đổi trạng thái
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
