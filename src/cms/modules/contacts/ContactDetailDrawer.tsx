import React, { useState, useEffect } from 'react';
import {
  X,
  UserCheck,
  RotateCcw,
  Send,
  Pin,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Mail,
  Phone,
  MapPin,
  Tag,
  ShieldCheck,
  ShieldAlert,
  MessageSquare,
  Package,
  FileText,
  User,
  Sparkles,
  ArrowRight,
  Globe,
  Share2,
} from 'lucide-react';
import { ContactRequest, ContactStatus, PriorityLevel, StaffMember } from './types';
import { getPriorityBadge, getSlaRemainingText, getSourceBadge, getStatusBadge, maskEmail, maskName, maskPhone } from './utils';

interface ContactDetailDrawerProps {
  isOpen: boolean;
  contact: ContactRequest | null;
  onClose: () => void;
  currentUserId: string;
  onClaim: (contactId: string) => void;
  onOpenReassign: (contact: ContactRequest) => void;
  onUpdateStatus: (contactId: string, newStatus: ContactStatus, resolutionSummary?: string) => void;
  onUpdatePriority: (contactId: string, newPriority: PriorityLevel) => void;
  onAddInternalNote: (contactId: string, noteContent: string, isPinned: boolean) => void;
  onMarkSpam: (contact: ContactRequest) => void;
  onMarkDuplicate: (contact: ContactRequest) => void;
  onOpenAuditPii: (contact: ContactRequest) => void;
  onLogPiiReveal: (contactId: string) => void;
}

export const ContactDetailDrawer: React.FC<ContactDetailDrawerProps> = ({
  isOpen,
  contact,
  onClose,
  currentUserId,
  onClaim,
  onOpenReassign,
  onUpdateStatus,
  onUpdatePriority,
  onAddInternalNote,
  onMarkSpam,
  onMarkDuplicate,
  onOpenAuditPii,
  onLogPiiReveal,
}) => {
  const [isPiiRevealed, setIsPiiRevealed] = useState(false);
  const [noteInput, setNoteInput] = useState('');
  const [isNotePinned, setIsNotePinned] = useState(false);
  const [resolutionSummary, setResolutionSummary] = useState('');
  const [showResolutionBox, setShowResolutionBox] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Restore draft note from sessionStorage if available
  useEffect(() => {
    if (contact) {
      const draftKey = `draft_note_${contact.id}`;
      const savedDraft = sessionStorage.getItem(draftKey);
      if (savedDraft) {
        setNoteInput(savedDraft);
      } else {
        setNoteInput('');
      }
      setIsPiiRevealed(false);
      setShowResolutionBox(contact.status === 'resolved' || contact.status === 'closed');
      setResolutionSummary(contact.resolution_summary || '');
    }
  }, [contact?.id]);

  // Handle note typing with session draft save
  const handleNoteChange = (val: string) => {
    setNoteInput(val);
    if (contact) {
      sessionStorage.setItem(`draft_note_${contact.id}`, val);
    }
  };

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim() || !contact) return;
    onAddInternalNote(contact.id, noteInput.trim(), isNotePinned);
    sessionStorage.removeItem(`draft_note_${contact.id}`);
    setNoteInput('');
    setIsNotePinned(false);
  };

  const togglePiiReveal = () => {
    if (!isPiiRevealed && contact) {
      onLogPiiReveal(contact.id);
    }
    setIsPiiRevealed(!isPiiRevealed);
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleStatusClick = (targetStatus: ContactStatus) => {
    if (!contact) return;
    if (targetStatus === 'resolved' || targetStatus === 'closed') {
      setShowResolutionBox(true);
    } else {
      setShowResolutionBox(false);
      onUpdateStatus(contact.id, targetStatus);
    }
  };

  const handleSaveResolution = () => {
    if (!contact) return;
    onUpdateStatus(contact.id, 'resolved', resolutionSummary);
  };

  if (!isOpen || !contact) return null;

  const sourceInfo = getSourceBadge(contact.source);
  const statusInfo = getStatusBadge(contact.status);
  const priorityInfo = getPriorityBadge(contact.priority);
  const slaInfo = getSlaRemainingText(contact.sla_deadline, contact.status);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-5xl h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800">
        
        {/* 1. TOP HEADER & STICKY ACTIONS */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors text-slate-500"
              title="Quay lại danh sách"
            >
              <RotateCcw className="w-5 h-5 rotate-90" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-slate-900 dark:text-slate-100">
                  {contact.id}
                </span>
                <span className={`px-2.5 py-0.5 text-[11px] font-medium rounded-full border ${sourceInfo.colorClass}`}>
                  {sourceInfo.label}
                </span>
                <span className={`px-2 py-0.5 text-[11px] font-bold rounded-full ${statusInfo.colorClass}`}>
                  {statusInfo.label}
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 truncate max-w-xl mt-0.5">
                {contact.request_subject}
              </h2>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Claim button if unassigned */}
            {!contact.owner_id && (
              <button
                onClick={() => onClaim(contact.id)}
                className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
              >
                <UserCheck className="w-4 h-4" />
                <span>Nhận xử lý (Claim)</span>
              </button>
            )}

            {/* Reassign button */}
            <button
              onClick={() => onOpenReassign(contact)}
              className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5"
            >
              <UserCheck className="w-4 h-4 text-orange-500" />
              <span>Phân công</span>
            </button>

            {/* Status Change selector */}
            <select
              value={contact.status}
              onChange={(e) => handleStatusClick(e.target.value as ContactStatus)}
              className="text-xs font-semibold p-1.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl outline-none"
            >
              <option value="new">Mới (New)</option>
              <option value="assigned">Đã phân công</option>
              <option value="in_progress">Đang xử lý</option>
              <option value="resolved">Đã giải quyết</option>
              <option value="closed">Đã đóng</option>
              <option value="spam">Spam / Rác</option>
              <option value="duplicate">Trùng lặp</option>
            </select>

            {/* More Actions dropdown / buttons */}
            <button
              onClick={() => onMarkSpam(contact)}
              className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
              title="Báo Spam"
            >
              <ShieldAlert className="w-4 h-4" />
            </button>

            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. BODY GRID LAYOUT (8/12 MAIN + 4/12 SIDEBAR) */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* MAIN COLUMN (8/12) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* ORIGINAL CUSTOMER CONTENT CARD (READ-ONLY / IMMUTABLE) */}
            <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/60 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <FileText className="w-4 h-4 text-orange-500" />
                  <span>Nội dung yêu cầu gốc từ Frontend (Read-only)</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{contact.created_at}</span>
                </div>
              </div>

              {/* Form Metadata */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-white dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
                <div>
                  <span className="text-slate-400">Form tiếp nhận:</span>{' '}
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{contact.form_title}</span>
                </div>
                <div>
                  <span className="text-slate-400">Trang web gửi:</span>{' '}
                  <a
                    href={contact.page_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-orange-600 hover:underline flex items-center gap-1 inline-flex font-medium"
                  >
                    <span>{contact.page_url?.replace('https://cic.com.vn', '') || '/'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                {contact.sender_ip && (
                  <div>
                    <span className="text-slate-400">IP người gửi:</span>{' '}
                    <span className="font-mono text-slate-600 dark:text-slate-400">{contact.sender_ip}</span>
                  </div>
                )}
                {contact.duplicate_of_id && (
                  <div className="col-span-2 p-2 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-medium flex items-center gap-2">
                    <Copy className="w-4 h-4" />
                    <span>Yêu cầu này trùng lặp với bản ghi gốc: <b>{contact.duplicate_of_id}</b></span>
                  </div>
                )}
              </div>

              {/* Message Content */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-400">Chủ đề & Nội dung thư:</div>
                <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-sans">
                  {contact.request_content}
                </div>
              </div>
            </div>

            {/* RESOLUTION SUMMARY BOX (IF RESOLVED OR BEING RESOLVED) */}
            {showResolutionBox && (
              <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Kết quả giải quyết yêu cầu (Resolution Summary)</span>
                </div>
                <textarea
                  rows={3}
                  value={resolutionSummary}
                  onChange={(e) => setResolutionSummary(e.target.value)}
                  placeholder="Mô tả tóm tắt kết quả xử lý (ví dụ: Đã gửi báo giá qua email, hẹn lịch demo ngày 06/08...)"
                  className="w-full text-xs p-3 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveResolution}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                  >
                    Lưu kết quả & Chuyển Đã giải quyết
                  </button>
                </div>
              </div>
            )}

            {/* INTERNAL NOTES COMPOSER & NOTES LIST */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  <MessageSquare className="w-4 h-4 text-orange-500" />
                  <span>Ghi chú xử lý nội bộ ({contact.internal_notes.length})</span>
                </div>
                <span className="text-[11px] text-slate-400">Không hiển thị cho khách hàng</span>
              </div>

              {/* Note Composer Form */}
              <form onSubmit={handleNoteSubmit} className="space-y-3">
                <div className="relative">
                  <textarea
                    rows={3}
                    value={noteInput}
                    onChange={(e) => handleNoteChange(e.target.value)}
                    placeholder="Thêm ghi chú xử lý nội bộ (tự động lưu nháp trong phiên)..."
                    className="w-full text-xs p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                  {sessionStorage.getItem(`draft_note_${contact.id}`) && (
                    <span className="absolute bottom-3 left-3 text-[10px] text-orange-500 font-medium">
                      • Đã lưu nháp
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isNotePinned}
                      onChange={(e) => setIsNotePinned(e.target.checked)}
                      className="rounded text-orange-600 focus:ring-orange-500"
                    />
                    <Pin className="w-3.5 h-3.5 text-orange-500" />
                    <span>Ghim ghi chú lên đầu</span>
                  </label>

                  <button
                    type="submit"
                    disabled={!noteInput.trim()}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Gửi ghi chú</span>
                  </button>
                </div>
              </form>

              {/* Internal Notes List */}
              {contact.internal_notes.length > 0 && (
                <div className="space-y-3 pt-2">
                  {contact.internal_notes.map((note) => (
                    <div
                      key={note.id}
                      className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                        note.is_pinned
                          ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src={note.author_avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                          <span className="font-bold text-slate-800 dark:text-slate-200">{note.author_name}</span>
                          {note.is_pinned && (
                            <span className="px-2 py-0.5 text-[10px] bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 font-bold rounded-full flex items-center gap-1">
                              <Pin className="w-3 h-3" /> Ghim
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">{note.created_at}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans">{note.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* PROCESSING TIMELINE & HISTORY */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span>Lịch sử xử lý & Audit Timeline ({contact.timeline.length})</span>
                </div>
              </div>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                {contact.timeline.map((event) => (
                  <div key={event.id} className="relative text-xs space-y-1">
                    <div className="absolute -left-6 top-0.5 w-3 h-3 rounded-full bg-orange-500 border-2 border-white dark:border-slate-900" />
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{event.actor_name}</span>
                      <span className="text-[11px] font-mono text-slate-400">{event.timestamp}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">{event.description}</p>
                    {event.old_value && event.new_value && (
                      <div className="text-[11px] text-slate-500 font-mono">
                        {event.old_value} → <span className="text-orange-600 font-bold">{event.new_value}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* CONTEXT SIDEBAR (4/12) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* SENDER INFO CARD (WITH PII MASKING & REVEAL AUDIT) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  <User className="w-4 h-4 text-orange-500" />
                  <span>Thông tin người gửi</span>
                </div>

                <button
                  onClick={togglePiiReveal}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 ${
                    isPiiRevealed
                      ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                      : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200'
                  }`}
                  title={isPiiRevealed ? 'Che PII' : 'Mở xem PII (Có ghi Log audit)'}
                >
                  {isPiiRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{isPiiRevealed ? 'Ẩn PII' : 'Hiện PII'}</span>
                </button>
              </div>

              {/* Sender Details */}
              <div className="space-y-3 text-xs">
                <div>
                  <div className="text-[11px] text-slate-400">Họ và tên:</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                    {isPiiRevealed ? contact.sender_name : maskName(contact.sender_name)}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-slate-400">Email:</div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-slate-700 dark:text-slate-300">
                      {isPiiRevealed ? contact.sender_email : maskEmail(contact.sender_email)}
                    </span>
                    <button
                      onClick={() => handleCopyText(contact.sender_email, 'email')}
                      className="text-slate-400 hover:text-orange-500 p-1"
                      title="Sao chép Email"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-slate-400">Số điện thoại:</div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-slate-700 dark:text-slate-300">
                      {isPiiRevealed ? contact.sender_phone : maskPhone(contact.sender_phone)}
                    </span>
                    <button
                      onClick={() => handleCopyText(contact.sender_phone, 'phone')}
                      className="text-slate-400 hover:text-orange-500 p-1"
                      title="Sao chép Điện thoại"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {contact.sender_company && (
                  <div>
                    <div className="text-[11px] text-slate-400">Đơn vị / Công ty:</div>
                    <div className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{contact.sender_company}</span>
                    </div>
                  </div>
                )}

                {contact.sender_address && (
                  <div>
                    <div className="text-[11px] text-slate-400">Địa chỉ:</div>
                    <div className="text-slate-600 dark:text-slate-400 flex items-start gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{contact.sender_address}</span>
                    </div>
                  </div>
                )}

                {copiedField && (
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold text-right">
                    ✓ Đã chép {copiedField} vào clipboard
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  onClick={() => onOpenAuditPii(contact)}
                  className="text-[11px] text-slate-500 hover:text-orange-600 flex items-center gap-1 font-medium"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Xem Audit PII Log</span>
                </button>
              </div>
            </div>

            {/* RELATED OBJECT PREVIEW (PRODUCT / SERVICE) */}
            {contact.related_object && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <Package className="w-4 h-4 text-orange-500" />
                  <span>Sản phẩm / Dịch vụ liên quan</span>
                </div>

                <div className="flex items-start gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  {contact.related_object.thumbnail && (
                    <img
                      src={contact.related_object.thumbnail}
                      alt=""
                      className="w-14 h-14 rounded-lg object-cover border shrink-0"
                    />
                  )}
                  <div className="space-y-1 text-xs overflow-hidden">
                    <span className="px-2 py-0.5 text-[10px] bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 font-bold rounded-full">
                      {contact.related_object.category_name || contact.related_object.type.toUpperCase()}
                    </span>
                    <div className="font-bold text-slate-800 dark:text-slate-200 truncate">
                      {contact.related_object.title}
                    </div>
                    {contact.related_object.code && (
                      <div className="text-[11px] font-mono text-slate-400">
                        Mã: {contact.related_object.code}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* OWNER & SLA CARD */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  <UserCheck className="w-4 h-4 text-orange-500" />
                  <span>Phân công & Cam kết SLA</span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                {/* Owner */}
                <div>
                  <div className="text-[11px] text-slate-400">Người phụ trách (Owner):</div>
                  <div className="flex items-center justify-between mt-1">
                    {contact.owner_name ? (
                      <div className="flex items-center gap-2">
                        {contact.owner_avatar && (
                          <img src={contact.owner_avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                        )}
                        <div>
                          <div className="font-bold text-slate-800 dark:text-slate-200">{contact.owner_name}</div>
                          <div className="text-[11px] text-slate-400">{contact.assigned_team || 'Sales'}</div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded-lg">
                        Chưa phân công (Unassigned)
                      </span>
                    )}
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <div className="text-[11px] text-slate-400 mb-1">Mức ưu tiên:</div>
                  <div className="flex items-center gap-2">
                    {(['urgent', 'high', 'normal', 'low'] as PriorityLevel[]).map((p) => (
                      <button
                        key={p}
                        onClick={() => onUpdatePriority(contact.id, p)}
                        className={`px-2 py-1 text-[11px] rounded-lg border font-semibold transition-all ${
                          contact.priority === p
                            ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                        }`}
                      >
                        {p === 'urgent' ? 'Khẩn' : p === 'high' ? 'Cao' : p === 'normal' ? 'Thường' : 'Thấp'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SLA Clock */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Hạn chót SLA (4h):</span>
                    <span className="font-mono">{contact.sla_deadline}</span>
                  </div>
                  <div className={`text-xs font-bold flex items-center gap-1.5 ${slaInfo.isOverdue ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    <Clock className="w-4 h-4" />
                    <span>{slaInfo.text}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* TAGS CARD */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Tag className="w-4 h-4 text-orange-500" />
                <span>Thẻ phân loại (Tags)</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {contact.tags.map((tg, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700"
                  >
                    #{tg}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
