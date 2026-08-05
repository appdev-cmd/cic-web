import React, { useState } from 'react';
import {
  UserCheck,
  Eye,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MoreVertical,
  SlidersHorizontal,
  ShieldAlert,
  Copy,
  Building2,
  Layers,
  Sparkles,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import { ContactRequest, ContactStatus, PriorityLevel, StaffMember } from './types';
import { getPriorityBadge, getSlaRemainingText, getSourceBadge, getStatusBadge, maskEmail, maskName } from './utils';

interface ContactListViewProps {
  contacts: ContactRequest[];
  selectedIds: string[];
  onToggleSelectAll: () => void;
  onToggleSelectOne: (id: string) => void;
  onSelectContact: (contact: ContactRequest) => void;
  onClaim: (contactId: string) => void;
  onOpenReassign: (contact: ContactRequest) => void;
  onQuickUpdateStatus: (contactId: string, status: ContactStatus) => void;
  onMarkSpam: (contact: ContactRequest) => void;
  onMarkDuplicate: (contact: ContactRequest) => void;
  // Bulk actions
  onBulkAssign: () => void;
  onBulkStatus: (status: ContactStatus) => void;
  onBulkSpam: () => void;
}

export const ContactListView: React.FC<ContactListViewProps> = ({
  contacts,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectOne,
  onSelectContact,
  onClaim,
  onOpenReassign,
  onQuickUpdateStatus,
  onMarkSpam,
  onMarkDuplicate,
  onBulkAssign,
  onBulkStatus,
  onBulkSpam,
}) => {
  const [density, setDensity] = useState<'compact' | 'standard' | 'spacious'>('standard');
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const isAllSelected = contacts.length > 0 && selectedIds.length === contacts.length;

  const rowPadding =
    density === 'compact' ? 'py-2 px-3 text-xs' : density === 'spacious' ? 'py-4 px-4 text-sm' : 'py-3 px-3.5 text-xs';

  return (
    <div className="space-y-4">
      {/* TOOLBAR CONTROLS (DENSITY & COLUMNS) */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div>
          Hiển thị <span className="font-bold text-slate-800 dark:text-slate-200">{contacts.length}</span> yêu cầu
        </div>

        <div className="flex items-center gap-3">
          {/* Density Picker */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
            {(['compact', 'standard', 'spacious'] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDensity(d)}
                className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                  density === d
                    ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {d === 'compact' ? 'Gọn' : d === 'standard' ? 'Vừa' : 'Rộng'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* DATA TABLE CONTAINER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {/* Sticky Checkbox Column */}
                <th className="py-3 px-3 w-10 sticky left-0 z-10 bg-slate-50 dark:bg-slate-800">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={onToggleSelectAll}
                    className="rounded text-orange-600 focus:ring-orange-500"
                  />
                </th>

                {/* Sticky Request ID & Sender Column */}
                <th className="py-3 px-3.5 sticky left-10 z-10 bg-slate-50 dark:bg-slate-800 min-w-[220px]">
                  Mã & Người gửi
                </th>

                <th className="py-3 px-3.5 min-w-[140px]">Nguồn</th>
                <th className="py-3 px-3.5 min-w-[180px]">Đối tượng liên quan</th>
                <th className="py-3 px-3.5 min-w-[150px]">Phụ trách (Owner)</th>
                <th className="py-3 px-3.5 min-w-[130px]">Trạng thái</th>
                <th className="py-3 px-3.5 min-w-[140px]">Ưu tiên & SLA</th>
                <th className="py-3 px-3.5 min-w-[120px]">Ngày gửi</th>

                {/* Sticky Actions */}
                <th className="py-3 px-3 text-right sticky right-0 z-10 bg-slate-50 dark:bg-slate-800 min-w-[110px]">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-xs text-slate-400">
                    Không tìm thấy yêu cầu liên hệ nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                contacts.map((contact) => {
                  const isSelected = selectedIds.includes(contact.id);
                  const sourceInfo = getSourceBadge(contact.source);
                  const statusInfo = getStatusBadge(contact.status);
                  const priorityInfo = getPriorityBadge(contact.priority);
                  const slaInfo = getSlaRemainingText(contact.sla_deadline, contact.status);

                  return (
                    <tr
                      key={contact.id}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group ${
                        isSelected ? 'bg-orange-50/40 dark:bg-orange-950/20' : ''
                      } ${contact.is_unread ? 'font-medium' : ''}`}
                    >
                      {/* Sticky Selection */}
                      <td className={`sticky left-0 z-10 ${rowPadding} ${isSelected ? 'bg-orange-50/90 dark:bg-slate-900' : 'bg-white dark:bg-slate-900'}`}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onToggleSelectOne(contact.id)}
                          className="rounded text-orange-600 focus:ring-orange-500"
                        />
                      </td>

                      {/* Sticky Request ID & Sender */}
                      <td className={`sticky left-10 z-10 ${rowPadding} ${isSelected ? 'bg-orange-50/90 dark:bg-slate-900' : 'bg-white dark:bg-slate-900'}`}>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onSelectContact(contact)}
                              className="font-mono font-bold text-slate-900 dark:text-slate-100 hover:text-orange-600 dark:hover:text-orange-400 hover:underline"
                            >
                              {contact.id}
                            </button>
                            {contact.is_unread && (
                              <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" title="Chưa đọc" />
                            )}
                          </div>
                          <div className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                            {contact.sender_name}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono truncate max-w-[200px]">
                            {contact.sender_email}
                          </div>
                        </div>
                      </td>

                      {/* Source */}
                      <td className={rowPadding}>
                        <span className={`px-2.5 py-1 text-[11px] font-medium rounded-full border ${sourceInfo.colorClass}`}>
                          {sourceInfo.label}
                        </span>
                      </td>

                      {/* Related Object */}
                      <td className={rowPadding}>
                        {contact.related_object ? (
                          <div className="space-y-0.5 max-w-[170px]">
                            <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                              {contact.related_object.title}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {contact.related_object.code || contact.related_object.category_name}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">—</span>
                        )}
                      </td>

                      {/* Owner */}
                      <td className={rowPadding}>
                        {contact.owner_name ? (
                          <div className="flex items-center gap-2">
                            {contact.owner_avatar && (
                              <img src={contact.owner_avatar} alt="" className="w-6 h-6 rounded-full object-cover shrink-0" />
                            )}
                            <div className="truncate max-w-[120px]">
                              <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                                {contact.owner_name}
                              </div>
                              <div className="text-[10px] text-slate-400 truncate">{contact.assigned_team}</div>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => onClaim(contact.id)}
                            className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 border border-amber-200 dark:border-amber-800 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Nhận xử lý</span>
                          </button>
                        )}
                      </td>

                      {/* Status */}
                      <td className={rowPadding}>
                        <select
                          value={contact.status}
                          onChange={(e) => onQuickUpdateStatus(contact.id, e.target.value as ContactStatus)}
                          className={`text-[11px] font-bold px-2 py-1 rounded-lg outline-none cursor-pointer ${statusInfo.colorClass}`}
                        >
                          <option value="new">Mới (New)</option>
                          <option value="assigned">Đã phân công</option>
                          <option value="in_progress">Đang xử lý</option>
                          <option value="resolved">Đã giải quyết</option>
                          <option value="closed">Đã đóng</option>
                          <option value="spam">Spam / Rác</option>
                          <option value="duplicate">Trùng lặp</option>
                        </select>
                      </td>

                      {/* Priority & SLA */}
                      <td className={rowPadding}>
                        <div className="space-y-1">
                          <span className={`px-2 py-0.5 text-[10px] rounded-md font-bold ${priorityInfo.colorClass}`}>
                            {priorityInfo.label}
                          </span>
                          <div className={`text-[11px] font-semibold flex items-center gap-1 ${slaInfo.isOverdue ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-500'}`}>
                            <Clock className="w-3 h-3" />
                            <span>{slaInfo.text}</span>
                          </div>
                        </div>
                      </td>

                      {/* Received Date */}
                      <td className={rowPadding}>
                        <div className="text-[11px] font-mono text-slate-600 dark:text-slate-400">
                          {contact.created_at.substring(0, 10)}
                          <div className="text-[10px] text-slate-400">{contact.created_at.substring(11, 16)}</div>
                        </div>
                      </td>

                      {/* Sticky Actions */}
                      <td className={`sticky right-0 z-10 text-right ${rowPadding} ${isSelected ? 'bg-orange-50/90 dark:bg-slate-900' : 'bg-white dark:bg-slate-900'}`}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onSelectContact(contact)}
                            className="p-1.5 text-slate-500 hover:text-orange-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onOpenReassign(contact)}
                            className="p-1.5 text-slate-500 hover:text-orange-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            title="Chuyển giao"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onMarkSpam(contact)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Báo Spam"
                          >
                            <ShieldAlert className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* STICKY BULK ACTION BAR WHEN ITEMS ARE SELECTED */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 dark:bg-slate-800 text-white px-6 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 text-xs font-semibold">
          <span>Đã chọn <span className="text-orange-400 font-bold">{selectedIds.length}</span> yêu cầu</span>
          <div className="h-4 w-px bg-slate-700" />

          <button
            onClick={onBulkAssign}
            className="hover:text-orange-400 transition-colors flex items-center gap-1.5"
          >
            <UserCheck className="w-4 h-4 text-orange-400" />
            <span>Phân công hàng loạt</span>
          </button>

          <button
            onClick={() => onBulkStatus('in_progress')}
            className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
          >
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Chuyển Đang xử lý</span>
          </button>

          <button
            onClick={() => onBulkStatus('resolved')}
            className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Chuyển Đã giải quyết</span>
          </button>

          <button
            onClick={onBulkSpam}
            className="hover:text-rose-400 transition-colors flex items-center gap-1.5"
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Báo Spam</span>
          </button>

        </div>
      )}
    </div>
  );
};
