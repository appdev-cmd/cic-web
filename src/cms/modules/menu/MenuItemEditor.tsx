import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  Globe,
  Link,
  ExternalLink,
  Layers,
  Package,
  FileText,
  Newspaper,
  Hash,
  Eye,
  Calendar,
  Sparkles,
  AlertTriangle,
  FolderTree,
  ChevronRight,
  Shield,
  Trash2,
} from 'lucide-react';
import { MenuItem, NavigationTargetType } from './types';

interface MenuItemEditorProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedItem: MenuItem) => void;
  onDelete?: (itemId: string) => void;
  maxDepth: number;
  availableParents: { id: string; label: string; depth: number }[];
}

export const MenuItemEditor: React.FC<MenuItemEditorProps> = ({
  item,
  isOpen,
  onClose,
  onSave,
  onDelete,
  maxDepth,
  availableParents,
}) => {
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    label: '',
    locales: { vi: '', en: '', ja: '' },
    target_type: 'static_page',
    url: '/',
    open_in_new_tab: false,
    icon_name: '',
    css_class: '',
    is_visible: true,
    visibility_rule: 'all',
    parent_id: null,
  });

  const [activeTab, setActiveTab] = useState<'general' | 'target' | 'appearance' | 'visibility'>('general');
  const [linkCheckStatus, setLinkCheckStatus] = useState<'idle' | 'checking' | 'valid' | 'broken'>('idle');

  useEffect(() => {
    if (item) {
      setFormData({
        ...item,
        locales: item.locales || { vi: item.label, en: '', ja: '' },
      });
    } else {
      setFormData({
        label: '',
        locales: { vi: '', en: '', ja: '' },
        target_type: 'static_page',
        url: '/',
        open_in_new_tab: false,
        icon_name: '',
        css_class: '',
        is_visible: true,
        visibility_rule: 'all',
        parent_id: null,
      });
    }
    setLinkCheckStatus('idle');
  }, [item, isOpen]);

  if (!isOpen) return null;

  const handleTargetTypeChange = (type: NavigationTargetType) => {
    let defaultUrl = formData.url || '/';
    if (type === 'product_catalog') defaultUrl = '/san-pham';
    else if (type === 'service_catalog') defaultUrl = '/dich-vu';
    else if (type === 'news_category') defaultUrl = '/tin-tuc';
    else if (type === 'external_link') defaultUrl = 'https://';
    else if (type === 'section_header') defaultUrl = '#';
    else if (type === 'anchor') defaultUrl = '#section';

    setFormData((prev) => ({
      ...prev,
      target_type: type,
      url: defaultUrl,
    }));
  };

  const handleTestLink = () => {
    setLinkCheckStatus('checking');
    setTimeout(() => {
      if (formData.url && (formData.url.startsWith('/') || formData.url.startsWith('https://') || formData.url.startsWith('#'))) {
        setLinkCheckStatus('valid');
      } else {
        setLinkCheckStatus('broken');
      }
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.label || !formData.url) return;

    const updated: MenuItem = {
      id: item ? item.id : `item_${Date.now()}`,
      group_id: item ? item.group_id : 'grp_header_main',
      parent_id: formData.parent_id || null,
      depth: item ? item.depth : 0,
      display_order: item ? item.display_order : 99,
      label: formData.label || '',
      locales: {
        vi: formData.locales?.vi || formData.label || '',
        en: formData.locales?.en || '',
        ja: formData.locales?.ja || '',
      },
      translation_status: formData.locales?.en ? 'complete' : 'missing',
      target_type: formData.target_type || 'static_page',
      target_content_id: formData.target_content_id,
      target_content_name: formData.target_content_name,
      url: formData.url || '/',
      open_in_new_tab: !!formData.open_in_new_tab,
      icon_name: formData.icon_name || '',
      css_class: formData.css_class || '',
      is_visible: formData.is_visible !== false,
      visibility_rule: formData.visibility_rule || 'all',
      schedule_start: formData.schedule_start,
      schedule_end: formData.schedule_end,
      link_health: linkCheckStatus === 'broken' ? 'broken' : 'valid',
      draft_status: item ? (item.draft_status === 'added' ? 'added' : 'modified') : 'added',
      children: item?.children || [],
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
              <FolderTree className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {item ? `Chỉnh sửa Mục Menu: "${item.label}"` : 'Tạo mới Mục Điều Hướng'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Lưu thay đổi vào bản thảo Draft trước khi phát hành công khai.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-slate-900">
          <button
            onClick={() => setActiveTab('general')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'general'
                ? 'border-orange-600 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Nội dung & Bản dịch</span>
          </button>

          <button
            onClick={() => setActiveTab('target')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'target'
                ? 'border-orange-600 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <Link className="w-4 h-4" />
            <span>Đích liên kết (Target)</span>
          </button>

          <button
            onClick={() => setActiveTab('appearance')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'appearance'
                ? 'border-orange-600 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Giao diện & Icon</span>
          </button>

          <button
            onClick={() => setActiveTab('visibility')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'visibility'
                ? 'border-orange-600 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Phân quyền & Hiển thị</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'general' && (
            <div className="space-y-4">
              {/* Primary Label (VI) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nhãn hiển thị (Tiếng Việt) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.label || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      label: e.target.value,
                      locales: { ...formData.locales, vi: e.target.value },
                    })
                  }
                  placeholder="Ví dụ: Sản phẩm & Giải pháp, Liên hệ"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              {/* Locale Translations */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-orange-500" /> Multi-locale Translations
                  </span>
                  <span className="text-[11px] text-slate-500">Auto-synced on publish</span>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    English Label (en)
                  </label>
                  <input
                    type="text"
                    value={formData.locales?.en || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        locales: { ...formData.locales!, en: e.target.value },
                      })
                    }
                    placeholder="e.g. Products & Solutions"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Japanese Label (ja)
                  </label>
                  <input
                    type="text"
                    value={formData.locales?.ja || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        locales: { ...formData.locales!, ja: e.target.value },
                      })
                    }
                    placeholder="e.g. 製品とソリューション"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Parent Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mục cha (Parent Menu Item)
                </label>
                <select
                  value={formData.parent_id || ''}
                  onChange={(e) => setFormData({ ...formData, parent_id: e.target.value || null })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="">-- Cấp cao nhất (Root - Level 1) --</option>
                  {availableParents
                    .filter((p) => p.id !== item?.id && p.depth < maxDepth - 1)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {'- '.repeat(p.depth)} {p.label} (Level {p.depth + 1})
                      </option>
                    ))}
                </select>
                <p className="mt-1 text-[11px] text-slate-500">
                  Giới hạn phân cấp độ sâu của nhóm menu này: Tối đa {maxDepth} cấp.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'target' && (
            <div className="space-y-4">
              {/* Target Type Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Loại đích đến (Navigation Target Type)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { type: 'static_page', label: 'Trang tĩnh (Static Page)', icon: FileText, desc: 'Về CIC, Giới thiệu, Tuyển dụng' },
                    { type: 'product_catalog', label: 'Danh mục Sản phẩm', icon: Package, desc: 'ETABS, SAP2000, EnjiCAD' },
                    { type: 'service_catalog', label: 'Dịch vụ & Tư vấn', icon: Layers, desc: 'BIM, Đào tạo, Thẩm tra' },
                    { type: 'news_category', label: 'Danh mục Tin tức', icon: Newspaper, desc: 'Tin Xây dựng, Sự kiện' },
                    { type: 'external_link', label: 'Liên kết ngoài (External)', icon: ExternalLink, desc: 'Website đối tác hoặc landing' },
                    { type: 'section_header', label: 'Tiêu đề Nhóm (Header Only)', icon: FolderTree, desc: 'Menu cha không bấm được' },
                    { type: 'anchor', label: 'Neo trang (#Anchor)', icon: Hash, desc: 'Cuộn đến ID trang' },
                  ].map((t) => {
                    const IconComp = t.icon;
                    const isSelected = formData.target_type === t.type;
                    return (
                      <button
                        key={t.type}
                        type="button"
                        onClick={() => handleTargetTypeChange(t.type as NavigationTargetType)}
                        className={`p-3 text-left rounded-xl border transition flex items-start gap-2.5 ${
                          isSelected
                            ? 'border-orange-500 bg-orange-50/60 dark:bg-orange-950/30 ring-1 ring-orange-500'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
                        }`}
                      >
                        <IconComp
                          className={`w-4 h-4 mt-0.5 shrink-0 ${
                            isSelected ? 'text-orange-600 dark:text-orange-400' : 'text-slate-500'
                          }`}
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">{t.label}</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">{t.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* URL Field & Link Checker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Đường dẫn (Target URL) <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={formData.url || ''}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="/san-pham hoặc https://domain.com"
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleTestLink}
                    className="px-3 py-2 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition flex items-center gap-1 shrink-0"
                  >
                    <Link className="w-3.5 h-3.5 text-orange-500" />
                    <span>Kiểm tra link</span>
                  </button>
                </div>

                {/* Link health status display */}
                {linkCheckStatus === 'checking' && (
                  <p className="mt-1 text-[11px] text-orange-500 animate-pulse">
                    Đang kiểm tra kết nối URL canonical...
                  </p>
                )}
                {linkCheckStatus === 'valid' && (
                  <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                    <Check className="w-3.5 h-3.5" /> Đường dẫn hợp lệ và sẵn sàng công khai.
                  </p>
                )}
                {linkCheckStatus === 'broken' && (
                  <p className="mt-1 text-[11px] text-red-600 dark:text-red-400 flex items-center gap-1 font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5" /> Cảnh báo: Đường dẫn chưa đúng định dạng.
                  </p>
                )}
              </div>

              {/* Open target window */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Mở trong cửa sổ mới (_blank)</p>
                  <p className="text-[11px] text-slate-500">
                    Bật tùy chọn này cho các liên kết external hoặc tài liệu PDF.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={!!formData.open_in_new_tab}
                  onChange={(e) => setFormData({ ...formData, open_in_new_tab: e.target.checked })}
                  className="w-4 h-4 text-orange-600 rounded-sm focus:ring-orange-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-4">
              {/* Icon Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Biểu tượng (Icon Name)
                </label>
                <input
                  type="text"
                  value={formData.icon_name || ''}
                  onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                  placeholder="Ví dụ: Home, Package, Layers, Newspaper, PhoneCall, Globe"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Hỗ trợ các icon từ thư viện Lucide React.
                </p>
              </div>

              {/* Custom CSS Class */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Custom CSS Class (Lớp giao diện tùy biến)
                </label>
                <input
                  type="text"
                  value={formData.css_class || ''}
                  onChange={(e) => setFormData({ ...formData, css_class: e.target.value })}
                  placeholder="Ví dụ: font-bold text-orange-600 nav-highlight-btn"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>
          )}

          {activeTab === 'visibility' && (
            <div className="space-y-4">
              {/* Visibility Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Kích hoạt hiển thị (Visible)</p>
                  <p className="text-[11px] text-slate-500">
                    Ẩn hoặc hiện mục menu này trên giao diện frontend.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.is_visible !== false}
                  onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                  className="w-4 h-4 text-orange-600 rounded-sm focus:ring-orange-500"
                />
              </div>

              {/* Audience Rule */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Quy tắc đối tượng đối soát (Visibility Audience Rule)
                </label>
                <select
                  value={formData.visibility_rule || 'all'}
                  onChange={(e) => setFormData({ ...formData, visibility_rule: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="all">Tất cả khách truy cập (Public All Users)</option>
                  <option value="logged_in">Chỉ khách đã đăng nhập (Logged-in Only)</option>
                  <option value="guests">Chỉ khách vãng lai (Guests Only)</option>
                  <option value="campaign_only">Chỉ hiển thị theo Campaign / UTM parameter</option>
                </select>
              </div>

              {/* Schedule Dates */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-orange-500" /> Bắt đầu hiển thị từ
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.schedule_start || ''}
                    onChange={(e) => setFormData({ ...formData, schedule_start: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-orange-500" /> Tự động ẩn từ lúc
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.schedule_end || ''}
                    onChange={(e) => setFormData({ ...formData, schedule_end: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between">
          {item && onDelete ? (
            <button
              type="button"
              onClick={() => onDelete(item.id)}
              className="px-3 py-2 text-xs font-semibold text-red-600 hover:text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>Xóa mục này</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{item ? 'Cập nhật bản thảo' : 'Thêm vào cây Menu'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
